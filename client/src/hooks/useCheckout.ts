import { useState } from "react";

type Plan = "monthly" | "quarterly" | "annual";

interface UseCheckoutReturn {
  redirectToCheckout: (plan: Plan) => Promise<void>;
  redirectToPortal: (customerId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useCheckout(): UseCheckoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCheckout = async (plan: Plan) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout.");
      }

      // Redirect to Stripe-hosted checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const redirectToPortal = async (customerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to open billing portal.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { redirectToCheckout, redirectToPortal, loading, error };
}
