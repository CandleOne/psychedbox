import { Router, raw, json } from "express";
import Stripe from "stripe";
import { PLANS, SHOP_PRODUCTS } from "../shared/payments.js";
import type {
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  CreateProductCheckoutRequest,
  CreateProductCheckoutResponse,
  CreateCartCheckoutRequest,
  CreateCartCheckoutResponse,
  CreatePortalRequest,
  CreatePortalResponse,
} from "../shared/payments.js";

// ── Stripe instance (lazy — created on first request) ──

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

// ── Map plan IDs → Stripe Price IDs from env vars ──

function getStripePriceId(planId: string): string | undefined {
  // Convention: STRIPE_PRICE_MONTHLY, STRIPE_PRICE_QUARTERLY, etc.
  return process.env[`STRIPE_PRICE_${planId.toUpperCase()}`];
}

// ── Helpers ──

function origin(req: { headers: Record<string, string | string[] | undefined> }): string {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["host"] || "localhost:3000";
  return `${proto}://${host}`;
}

// ── Router ──

export function createPaymentRouter(): Router {
  const router = Router();

  // ── GET /api/payments/plans ──
  // Returns plan metadata (no Stripe IDs) for the client pricing page.
  router.get("/plans", (_req, res) => {
    const clientPlans = PLANS.map(({ stripePriceId: _, ...rest }) => rest);
    res.json(clientPlans);
  });

  // ── POST /api/payments/create-checkout ──
  // Creates a Stripe Checkout Session and returns the hosted URL.
  router.post("/create-checkout", json(), async (req, res) => {
    try {
      const { planId, donationAmountCents } = req.body as CreateCheckoutRequest;

      const plan = PLANS.find((p) => p.id === planId);
      if (!plan) {
        res.status(400).json({ error: "Unknown plan" });
        return;
      }

      const stripe = getStripe();
      const base = origin(req);

      // Build line item
      const lineItem: Stripe.Checkout.SessionCreateParams.LineItem =
        plan.id === "donation"
          ? {
              price_data: {
                currency: "usd",
                product_data: { name: "Donation — Support the Movement" },
                unit_amount: donationAmountCents || 500, // minimum $5
              },
              quantity: 1,
            }
          : plan.interval === "one_time"
            ? {
                price: getStripePriceId(plan.id),
                quantity: 1,
              }
            : {
                price: getStripePriceId(plan.id),
                quantity: 1,
              };

      // For ad-hoc prices (donation / fallback) without a Stripe Price ID,
      // build a price_data object instead.
      if (!lineItem.price && !lineItem.price_data) {
        lineItem.price_data = {
          currency: "usd",
          product_data: { name: `PsychedBox — ${plan.name}` },
          unit_amount: plan.price,
          ...(plan.interval !== "one_time" && {
            recurring: {
              interval: plan.interval === "quarter" ? "month" : plan.interval,
              interval_count: plan.interval === "quarter" ? 3 : 1,
            },
          }),
        };
      }

      const mode: Stripe.Checkout.SessionCreateParams.Mode =
        plan.interval === "one_time" ? "payment" : "subscription";

      const session = await stripe.checkout.sessions.create({
        mode,
        line_items: [lineItem],
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/checkout/cancel`,
        ...(mode === "subscription" && { subscription_data: { metadata: { planId: plan.id } } }),
        metadata: { planId: plan.id },
      });

      const response: CreateCheckoutResponse = { url: session.url! };
      res.json(response);
    } catch (err: any) {
      console.error("[Stripe] create-checkout error:", err);
      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });

  // ── POST /api/payments/create-product-checkout ──
  // Creates a Stripe Checkout Session for a shop product (one-time purchase).
  router.post("/create-product-checkout", json(), async (req, res) => {
    try {
      const { productId, variant } = req.body as CreateProductCheckoutRequest;

      const product = SHOP_PRODUCTS.find((p) => p.id === productId);
      if (!product) {
        res.status(400).json({ error: "Unknown product" });
        return;
      }

      const stripe = getStripe();
      const base = origin(req);

      const productName = variant
        ? `${product.name} — ${variant}`
        : product.name;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: productName },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/shop`,
        metadata: { productId: product.id, variant: variant || "" },
      });

      const response: CreateProductCheckoutResponse = { url: session.url! };
      res.json(response);
    } catch (err: any) {
      console.error("[Stripe] create-product-checkout error:", err);
      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });

  // ── POST /api/payments/create-cart-checkout ──
  // Creates a Stripe Checkout Session for multiple shop products (cart).
  router.post("/create-cart-checkout", json(), async (req, res) => {
    try {
      const { items } = req.body as CreateCartCheckoutRequest;

      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: "Cart is empty" });
        return;
      }

      if (items.length > 50) {
        res.status(400).json({ error: "Too many items" });
        return;
      }

      const stripe = getStripe();
      const base = origin(req);

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      for (const item of items) {
        const product = SHOP_PRODUCTS.find((p) => p.id === item.productId);
        if (!product) {
          res.status(400).json({ error: `Unknown product: ${item.productId}` });
          return;
        }

        const qty = Math.max(1, Math.min(item.quantity || 1, 10));
        const displayName = item.variant
          ? `${product.name} — ${item.variant}`
          : product.name;

        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: displayName },
            unit_amount: product.price,
          },
          quantity: qty,
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/shop`,
        metadata: {
          source: "cart",
          itemCount: String(lineItems.length),
        },
      });

      const response: CreateCartCheckoutResponse = { url: session.url! };
      res.json(response);
    } catch (err: any) {
      console.error("[Stripe] create-cart-checkout error:", err);
      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });

  // ── POST /api/payments/create-portal ──
  // Creates a Stripe Customer Portal session so subscribers can manage billing.
  router.post("/create-portal", json(), async (req, res) => {
    try {
      const { customerId } = req.body as CreatePortalRequest;
      if (!customerId) {
        res.status(400).json({ error: "customerId is required" });
        return;
      }

      const stripe = getStripe();
      const base = origin(req);

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${base}/account`,
      });

      const response: CreatePortalResponse = { url: session.url };
      res.json(response);
    } catch (err: any) {
      console.error("[Stripe] create-portal error:", err);
      res.status(500).json({ error: err.message || "Failed to create portal session" });
    }
  });

  // ── POST /api/payments/webhook ──
  // Stripe sends events here. Verify signature, then handle fulfillment.
  router.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("[Stripe] STRIPE_WEBHOOK_SECRET not set — skipping verification");
      res.status(400).json({ error: "Webhook secret not configured" });
      return;
    }

    const sig = req.headers["stripe-signature"] as string | undefined;
    if (!sig) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    let event: Stripe.Event;
    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("[Stripe] Webhook signature verification failed:", err.message);
      res.status(400).json({ error: "Invalid signature" });
      return;
    }

    // ── Handle relevant events ──
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(
          `[Stripe] ✅ Checkout completed — session=${session.id}, customer=${session.customer}, plan=${session.metadata?.planId}`
        );
        // TODO: Provision access / fulfill order in your database
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[Stripe] 🔄 Subscription updated — sub=${sub.id}, status=${sub.status}`);
        // TODO: Update subscription status in your database
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[Stripe] ❌ Subscription cancelled — sub=${sub.id}`);
        // TODO: Revoke access in your database
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe] ⚠️ Payment failed — invoice=${invoice.id}, customer=${invoice.customer}`);
        // TODO: Notify user about failed payment
        break;
      }

      default:
        // Unhandled event type — that's fine
        break;
    }

    res.json({ received: true });
  });

  return router;
}
