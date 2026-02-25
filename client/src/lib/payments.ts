import type {
  CartLineItem,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  CreateProductCheckoutRequest,
  CreateProductCheckoutResponse,
  CreateCartCheckoutRequest,
  CreateCartCheckoutResponse,
  CreatePortalRequest,
  CreatePortalResponse,
  PricingPlan,
} from "@shared/payments";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import axios from "axios";

const api = axios.create({ baseURL: "/api/payments" });

// ── Client-side Stripe (for static-hosted deployments without a backend) ──

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

/** Map plan IDs → VITE_ env price IDs */
const CLIENT_PRICE_IDS: Record<string, string | undefined> = {
  monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY as string | undefined,
  quarterly: import.meta.env.VITE_STRIPE_PRICE_QUARTERLY as string | undefined,
  annual: import.meta.env.VITE_STRIPE_PRICE_ANNUAL as string | undefined,
  gift: import.meta.env.VITE_STRIPE_PRICE_GIFT as string | undefined,
};

let _stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> {
  if (!_stripePromise && STRIPE_PK) {
    _stripePromise = loadStripe(STRIPE_PK);
  }
  return _stripePromise ?? Promise.resolve(null);
}

/**
 * Attempt a server-side checkout first. If the API server is unreachable
 * (static hosting / 405 / network error), fall back to client-only
 * Stripe Checkout using publishable key + Price IDs baked into the bundle.
 */

/** Fetch the plan catalog from the server */
export async function fetchPlans(): Promise<PricingPlan[]> {
  const { data } = await api.get<PricingPlan[]>("/plans");
  return data;
}

/**
 * Create a Stripe Checkout session and redirect the browser to
 * Stripe's hosted checkout page.
 *
 * Tries the backend API first. If it fails (static hosting / no server),
 * falls back to client-side Stripe Checkout using Price IDs.
 */
export async function redirectToCheckout(
  planId: string,
  donationAmountCents?: number
): Promise<void> {
  // 1) Try server-side session creation
  try {
    const body: CreateCheckoutRequest = { planId, donationAmountCents };
    const { data } = await api.post<CreateCheckoutResponse>("/create-checkout", body);
    window.location.href = data.url;
    return;
  } catch {
    // Server unreachable — fall through to client-side
  }

  // 2) Client-side fallback (static deployment)
  const priceId = CLIENT_PRICE_IDS[planId];
  if (!priceId || priceId === "price_REPLACE_ME") {
    throw new Error(
      `No price configured for plan "${planId}". Set VITE_STRIPE_PRICE_${planId.toUpperCase()} in your environment.`
    );
  }

  const stripe = await getStripe();
  if (!stripe) {
    throw new Error(
      "Stripe could not be loaded. Set VITE_STRIPE_PUBLISHABLE_KEY in your environment."
    );
  }

  const isSubscription = planId !== "gift" && planId !== "donation";
  const origin = window.location.origin;

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: isSubscription ? "subscription" : "payment",
    successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/checkout/cancel`,
  });

  if (error) {
    throw new Error(error.message ?? "Stripe redirect failed");
  }
}

/**
 * Create a Stripe Checkout session for a shop product and redirect.
 */
export async function redirectToProductCheckout(
  productId: string,
  variant?: string
): Promise<void> {
  const body: CreateProductCheckoutRequest = { productId, variant };
  const { data } = await api.post<CreateProductCheckoutResponse>(
    "/create-product-checkout",
    body
  );
  window.location.href = data.url;
}

/**
 * Create a Stripe Checkout session for a cart of multiple products.
 */
export async function redirectToCartCheckout(
  items: CartLineItem[]
): Promise<void> {
  const body: CreateCartCheckoutRequest = { items };
  const { data } = await api.post<CreateCartCheckoutResponse>(
    "/create-cart-checkout",
    body
  );
  window.location.href = data.url;
}

/**
 * Open the Stripe Customer Portal so the user can manage their
 * subscription, update payment methods, or cancel.
 */
export async function redirectToPortal(customerId: string): Promise<void> {
  const body: CreatePortalRequest = { customerId };
  const { data } = await api.post<CreatePortalResponse>("/create-portal", body);
  window.location.href = data.url;
}
