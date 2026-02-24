import Stripe from "stripe";
import { Router, Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export const stripeRouter = Router();

// Price IDs — create these in Stripe Dashboard then set as env vars
// stripe.com/dashboard → Products → Add product → Add pricing
const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,    // $29/mo recurring
  quarterly: process.env.STRIPE_PRICE_QUARTERLY!, // $79/3mo recurring
  annual: process.env.STRIPE_PRICE_ANNUAL!,       // $299/yr recurring
};

/**
 * POST /api/stripe/create-checkout-session
 * Body: { plan: "monthly" | "quarterly" | "annual", successUrl?: string, cancelUrl?: string }
 * Returns: { url: string } — redirect user to this Stripe-hosted checkout URL
 */
stripeRouter.post("/create-checkout-session", async (req: Request, res: Response) => {
  const { plan, successUrl, cancelUrl } = req.body;

  if (!plan || !PRICES[plan as keyof typeof PRICES]) {
    res.status(400).json({ error: "Invalid plan. Must be monthly, quarterly, or annual." });
    return;
  }

  const priceId = PRICES[plan as keyof typeof PRICES];

  if (!priceId) {
    res.status(500).json({ error: `Stripe price ID for plan "${plan}" is not configured. Set STRIPE_PRICE_${plan.toUpperCase()} env var.` });
    return;
  }

  const origin = process.env.APP_URL || "https://psychedbox.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${origin}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/shop/monthly-boxes?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"], // expand as needed
      },
      metadata: { plan },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

/**
 * POST /api/stripe/create-portal-session
 * Body: { customerId: string }
 * Returns: { url: string } — Stripe Customer Portal for managing/cancelling subscriptions
 */
stripeRouter.post("/create-portal-session", async (req: Request, res: Response) => {
  const { customerId } = req.body;

  if (!customerId) {
    res.status(400).json({ error: "customerId is required." });
    return;
  }

  const origin = process.env.APP_URL || "https://psychedbox.com";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err.message);
    res.status(500).json({ error: "Failed to create portal session." });
  }
});

/**
 * POST /api/stripe/webhook
 * Stripe sends events here. Verify signature, handle subscription lifecycle.
 * Set webhook secret in Stripe Dashboard → Webhooks → your endpoint → Signing secret
 */
stripeRouter.post(
  "/webhook",
  // Raw body required for signature verification — mount BEFORE express.json()
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle subscription events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ New subscription:", session.customer, session.metadata?.plan);
        // TODO: Save customer to your DB, send welcome email, etc.
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        console.log("🔄 Subscription updated:", sub.id, sub.status);
        // TODO: Update subscription status in your DB
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log("❌ Subscription cancelled:", sub.id);
        // TODO: Mark user as inactive, send offboarding email
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💰 Payment succeeded:", invoice.customer, invoice.amount_paid / 100);
        // TODO: Record payment, update billing history
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("⚠️ Payment failed:", invoice.customer);
        // TODO: Notify customer, trigger dunning flow
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);
