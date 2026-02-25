import { useState } from "react";
import type { CartLineItem } from "@shared/payments";
import {
  redirectToCheckout,
  redirectToPortal,
  redirectToProductCheckout,
  redirectToCartCheckout,
} from "@/lib/payments";

/**
 * Hook that wraps Stripe checkout / portal redirects with loading
 * and error state so the UI can show spinners and error messages.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout(planId: string, donationAmountCents?: number) {
    setLoading(true);
    setError(null);
    try {
      await redirectToCheckout(planId, donationAmountCents);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  async function manageSubscription(customerId: string) {
    setLoading(true);
    setError(null);
    try {
      await redirectToPortal(customerId);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  async function productCheckout(productId: string, variant?: string) {
    setLoading(true);
    setError(null);
    try {
      await redirectToProductCheckout(productId, variant);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  async function cartCheckout(items: CartLineItem[]) {
    setLoading(true);
    setError(null);
    try {
      await redirectToCartCheckout(items);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  return { checkout, productCheckout, cartCheckout, manageSubscription, loading, error };
}
