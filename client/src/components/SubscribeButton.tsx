import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Plan = "monthly" | "quarterly" | "annual";

interface SubscribeButtonProps {
  plan: Plan;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
}

/**
 * Drop-in subscribe button. Usage:
 *
 *   <SubscribeButton plan="monthly">Subscribe — $29/mo</SubscribeButton>
 *   <SubscribeButton plan="quarterly">Subscribe — $79/quarter</SubscribeButton>
 *   <SubscribeButton plan="annual">Subscribe — $299/year</SubscribeButton>
 */
export function SubscribeButton({
  plan,
  children,
  className,
  variant = "default",
}: SubscribeButtonProps) {
  const { checkout, loading, error } = useCheckout();

  return (
    <div>
      <Button
        variant={variant}
        className={className}
        disabled={loading}
        onClick={() => checkout(plan)}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          children ?? "Subscribe Now"
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
