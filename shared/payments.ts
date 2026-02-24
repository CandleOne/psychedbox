// ── Shared payment types used by both client and server ──

export interface PricingPlan {
  id: string;
  name: string;
  price: number; // in cents
  displayPrice: string;
  interval: "month" | "quarter" | "year" | "one_time";
  description: string;
  features: string[];
  popular?: boolean;
  stripePriceId?: string; // set from env at runtime on server
}

/**
 * Static plan definitions. `stripePriceId` is populated server-side from
 * environment variables so Stripe IDs never leak into the client bundle.
 */
export const PLANS: PricingPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 2900,
    displayPrice: "$29",
    interval: "month",
    description: "One puzzle box per month",
    features: [
      "Monthly puzzle",
      "Themed goodies",
      "Digital story",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 7900,
    displayPrice: "$79",
    interval: "quarter",
    description: "Three boxes, save 10%",
    popular: true,
    features: [
      "3 monthly puzzles",
      "Themed goodies",
      "Digital stories",
      "Exclusive merch",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: 29900,
    displayPrice: "$299",
    interval: "year",
    description: "Twelve boxes, save 15%",
    features: [
      "12 monthly puzzles",
      "Themed goodies",
      "Digital stories",
      "Exclusive merch",
      "VIP community access",
    ],
  },
  {
    id: "gift",
    name: "Gift Box",
    price: 3900,
    displayPrice: "$39",
    interval: "one_time",
    description: "A single discovery box — perfect as a gift",
    features: [
      "One curated puzzle box",
      "Themed goodies",
      "Digital story",
      "Gift wrapping included",
    ],
  },
  {
    id: "donation",
    name: "Support the Movement",
    price: 0, // variable — user picks amount
    displayPrice: "Any amount",
    interval: "one_time",
    description: "Donate to support psychedelic education and community outreach",
    features: [
      "100% goes to community programs",
      "Tax-deductible receipt",
      "Supporter recognition (optional)",
    ],
  },
];

// ── API request / response shapes ──

export interface CreateCheckoutRequest {
  planId: string;
  /** For donations — amount in cents */
  donationAmountCents?: number;
}

export interface CreateCheckoutResponse {
  url: string;
}

export interface CreatePortalRequest {
  /** Stripe customer ID (stored client-side after first checkout) */
  customerId: string;
}

export interface CreatePortalResponse {
  url: string;
}
