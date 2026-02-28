import { useState } from "react";
import { useLocation } from "wouter";
import type { CartLineItem } from "@shared/payments";
import {
  redirectToCheckout,
  redirectToPortal,
  redirectToProductCheckout,
  redirectToCartCheckout,
} from "@/lib/payments";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook that wraps Stripe checkout / portal redirects with loading
 * and error state so the UI can show spinners and error messages.
 *
 * All checkout functions require the user to be logged in.
 * If not authenticated, the user is redirected to the login page
 * with a `?redirect=` param so they return after signing in.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  /** Redirect unauthenticated users to login with a return URL */
  function requireLogin(): boolean {
    if (user) return true;
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    navigate(`/login?redirect=${returnTo}`);
    return false;
  }

  async function checkout(planId: string, donationAmountCents?: number) {
    if (!requireLogin()) return;
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
    if (!requireLogin()) return;
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
    if (!requireLogin()) return;
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
