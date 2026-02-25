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
import axios from "axios";

const api = axios.create({ baseURL: "/api/payments" });

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
let _stripePromise: ReturnType<typeof loadStripe> | null = null;
function getStripe() {
  if (!_stripePromise && STRIPE_PK) _stripePromise = loadStripe(STRIPE_PK);
  return _stripePromise ?? Promise.resolve(null);
}

const CLIENT_PRICE_IDS: Record<string, string | undefined> = {
  monthly:   import.meta.env.VITE_STRIPE_PRICE_MONTHLY as string | undefined,
  quarterly: import.meta.env.VITE_STRIPE_PRICE_QUARTERLY as string | undefined,
  annual:    import.meta.env.VITE_STRIPE_PRICE_ANNUAL as string | undefined,
  gift:      import.meta.env.VITE_STRIPE_PRICE_GIFT as string | undefined,
};

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
// Payment Links — create in Stripe Dashboard → Payment Links
// Set these as GitHub secrets: VITE_STRIPE_LINK_MONTHLY, etc.
const PAYMENT_LINKS: Record<string, string | undefined> = {
  monthly:   import.meta.env.VITE_STRIPE_LINK_MONTHLY as string | undefined,
  quarterly: import.meta.env.VITE_STRIPE_LINK_QUARTERLY as string | undefined,
  annual:    import.meta.env.VITE_STRIPE_LINK_ANNUAL as string | undefined,
  gift:      import.meta.env.VITE_STRIPE_LINK_GIFT as string | undefined,
};

export async function redirectToCheckout(
  planId: string,
  donationAmountCents?: number
): Promise<void> {
  // 1) Try server-side session (works when Node server is running)
  try {
    const body: CreateCheckoutRequest = { planId, donationAmountCents };
    const { data } = await api.post<CreateCheckoutResponse>("/create-checkout", body);
    window.location.href = data.url;
    return;
  } catch {
    // Server unavailable (static hosting) — fall through
  }

  // 2) Static fallback: redirect to Stripe Payment Link
  const link = PAYMENT_LINKS[planId];
  if (!link) {
    throw new Error(
      `Checkout unavailable. Please contact support.`
    );
  }
  window.location.href = link;
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
