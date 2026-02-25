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
import axios from "axios";

const api = axios.create({ baseURL: "/api/payments" });

/** Fetch the plan catalog from the server */
export async function fetchPlans(): Promise<PricingPlan[]> {
  const { data } = await api.get<PricingPlan[]>("/plans");
  return data;
}

/**
 * Create a Stripe Checkout session and redirect the browser to
 * Stripe's hosted checkout page.
 */
export async function redirectToCheckout(
  planId: string,
  donationAmountCents?: number
): Promise<void> {
  const body: CreateCheckoutRequest = { planId, donationAmountCents };
  const { data } = await api.post<CreateCheckoutResponse>("/create-checkout", body);
  window.location.href = data.url;
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
