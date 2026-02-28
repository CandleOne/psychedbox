import { Router, raw, json } from "express";
import Stripe from "stripe";
import { PLANS, SHOP_PRODUCTS } from "../shared/payments.js";
import db from "./db.js";
import { sendOrderConfirmationEmail, sendPaymentFailedEmail } from "./email.js";
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
                unit_amount: Math.max(donationAmountCents || 500, 50), // Stripe minimum is $0.50
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

      // Serialize cart items into metadata so the webhook can persist line items
      const cartItemsMeta = items.map((ci) => {
        const prod = SHOP_PRODUCTS.find((p) => p.id === ci.productId);
        return {
          id: ci.productId,
          name: prod?.name ?? ci.productId,
          variant: ci.variant || null,
          quantity: Math.max(1, Math.min(ci.quantity || 1, 10)),
          priceCents: prod?.price ?? 0,
        };
      });

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/shop`,
        metadata: {
          source: "cart",
          itemCount: String(lineItems.length),
          items: JSON.stringify(cartItemsMeta),
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

      // Verify the logged-in user owns this Stripe customer ID
      const user = (req as any).user;
      if (!user || user.stripe_customer_id !== customerId) {
        res.status(403).json({ error: "You can only manage your own subscription" });
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
        const planId = session.metadata?.planId;
        const customerId = session.customer as string | null;
        const customerEmail = session.customer_details?.email ?? session.customer_email;
        console.log(
          `[Stripe] ✅ Checkout completed — session=${session.id}, customer=${customerId}, email=${customerEmail}, plan=${planId}`
        );

        // Link Stripe customer to local user and set their plan
        if (customerEmail) {
          const user = db.prepare("SELECT id, name FROM users WHERE email = ? COLLATE NOCASE").get(customerEmail) as { id: number; name: string } | undefined;
          if (user) {
            db.prepare(
              "UPDATE users SET stripe_customer_id = COALESCE(?, stripe_customer_id), plan = COALESCE(?, plan), updated_at = datetime('now') WHERE id = ?"
            ).run(customerId, planId, user.id);
            console.log(`[Stripe] Linked customer ${customerId} to user ${user.id}, plan=${planId}`);
          } else {
            console.warn(`[Stripe] No local user found for email ${customerEmail}`);
          }

          // Build order summary
          const productMeta = session.metadata?.productId;
          const plan = planId ? PLANS.find((p) => p.id === planId) : null;
          const itemName = plan?.name
            ? `PsychedBox — ${plan.name}`
            : productMeta
              ? `Shop — ${productMeta}`
              : session.metadata?.source === "cart"
                ? `Cart (${session.metadata.itemCount} items)`
                : "PsychedBox Purchase";
          const amountCents = session.amount_total ?? 0;
          const amountStr = amountCents
            ? `$${(amountCents / 100).toFixed(2)}`
            : "—";

          // Persist order to database
          try {
            const orderResult = db.prepare(`
              INSERT INTO orders (user_id, stripe_session_id, stripe_customer_id, email, amount_cents, currency, status, plan_id, item_summary)
              VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?)
            `).run(
              user?.id ?? null,
              session.id,
              customerId,
              customerEmail,
              amountCents,
              session.currency ?? "usd",
              planId ?? null,
              itemName
            );
            const orderId = orderResult.lastInsertRowid;

            // If it was a cart checkout, persist individual line items
            if (session.metadata?.source === "cart" && session.metadata.items) {
              try {
                const cartItems = JSON.parse(session.metadata.items) as Array<{
                  id: string;
                  name?: string;
                  variant?: string;
                  quantity: number;
                  priceCents: number;
                }>;
                const insertItem = db.prepare(`
                  INSERT INTO order_items (order_id, product_id, name, variant, quantity, price_cents)
                  VALUES (?, ?, ?, ?, ?, ?)
                `);
                for (const item of cartItems) {
                  insertItem.run(orderId, item.id, item.name ?? item.id, item.variant ?? null, item.quantity, item.priceCents ?? 0);
                }
              } catch {
                console.warn("[Stripe] Could not parse cart items metadata");
              }
            } else if (productMeta) {
              // Single product purchase
              db.prepare(`
                INSERT INTO order_items (order_id, product_id, name, variant, quantity, price_cents)
                VALUES (?, ?, ?, ?, 1, ?)
              `).run(orderId, productMeta, itemName, session.metadata?.variant ?? null, amountCents);
            }

            console.log(`[Stripe] Order #${orderId} saved for ${customerEmail}`);
          } catch (err: any) {
            // Don't fail the webhook if the order already exists (idempotency)
            if (err.message?.includes("UNIQUE constraint")) {
              console.log(`[Stripe] Order already exists for session ${session.id}`);
            } else {
              console.error("[Stripe] Failed to save order:", err.message);
            }
          }

          // Send order confirmation email
          sendOrderConfirmationEmail(
            customerEmail,
            (user as any)?.name || session.customer_details?.name || "",
            { planOrProduct: itemName, amount: amountStr, sessionId: session.id }
          ).catch(() => {});
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const status = sub.status; // active, past_due, canceled, unpaid, etc.
        const planId = sub.metadata?.planId;
        console.log(`[Stripe] 🔄 Subscription updated — sub=${sub.id}, status=${status}, plan=${planId}`);

        // Update user's plan based on subscription status
        const planValue = (status === "active" || status === "trialing") ? (planId || "active") : null;
        const result = db.prepare(
          "UPDATE users SET plan = ?, updated_at = datetime('now') WHERE stripe_customer_id = ?"
        ).run(planValue, customerId);

        if (result.changes > 0) {
          console.log(`[Stripe] Updated plan to "${planValue}" for customer ${customerId}`);
        } else {
          console.warn(`[Stripe] No user found with stripe_customer_id=${customerId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        console.log(`[Stripe] ❌ Subscription cancelled — sub=${sub.id}, customer=${customerId}`);

        // Revoke access: clear the user's plan
        const result = db.prepare(
          "UPDATE users SET plan = NULL, updated_at = datetime('now') WHERE stripe_customer_id = ?"
        ).run(customerId);

        if (result.changes > 0) {
          console.log(`[Stripe] Revoked access for customer ${customerId}`);
        } else {
          console.warn(`[Stripe] No user found with stripe_customer_id=${customerId}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const attemptCount = invoice.attempt_count;
        console.log(
          `[Stripe] ⚠️ Payment failed — invoice=${invoice.id}, customer=${customerId}, attempt=${attemptCount}`
        );

        // Mark the user's plan as past_due so the UI can show a warning
        const failedUser = db.prepare(
          "SELECT id, email, name FROM users WHERE stripe_customer_id = ?"
        ).get(customerId) as { id: number; email: string; name: string } | undefined;

        if (failedUser) {
          db.prepare(
            "UPDATE users SET plan = 'past_due', updated_at = datetime('now') WHERE id = ?"
          ).run(failedUser.id);
          console.log(`[Stripe] Marked customer ${customerId} as past_due`);

          // Notify user about payment failure
          sendPaymentFailedEmail(
            failedUser.email,
            failedUser.name,
            attemptCount ?? 1
          ).catch(() => {});
        } else {
          console.warn(`[Stripe] No user found with stripe_customer_id=${customerId}`);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string | null;
        const chargeCustomer = charge.customer as string | null;
        const amountRefunded = charge.amount_refunded;
        console.log(
          `[Stripe] 💸 Charge refunded — charge=${charge.id}, pi=${paymentIntentId}, customer=${chargeCustomer}, refunded=${amountRefunded}`
        );

        // Try to find the matching order via payment_intent → checkout session
        if (paymentIntentId) {
          try {
            const stripe = getStripe();
            const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 });
            const matchedSession = sessions.data[0];
            if (matchedSession) {
              const result = db.prepare(
                "UPDATE orders SET status = 'refunded', updated_at = datetime('now') WHERE stripe_session_id = ?"
              ).run(matchedSession.id);
              if (result.changes > 0) {
                console.log(`[Stripe] Marked order for session ${matchedSession.id} as refunded`);
              } else {
                console.warn(`[Stripe] No order found for session ${matchedSession.id}`);
              }
            } else {
              console.warn(`[Stripe] No checkout session found for payment_intent ${paymentIntentId}`);
            }
          } catch (err: any) {
            console.error("[Stripe] Failed to look up session for refund:", err.message);
          }
        }
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
