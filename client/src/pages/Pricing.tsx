import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useCheckout } from "@/hooks/useCheckout";
import { PLANS } from "@shared/payments";

export default function Pricing() {
  const { checkout, loading, error } = useCheckout();
  const [donationAmount, setDonationAmount] = useState(10);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const subscriptionPlans = PLANS.filter(
    (p) => p.interval !== "one_time" && p.id !== "donation"
  );
  const giftPlan = PLANS.find((p) => p.id === "gift")!;
  const donationPlan = PLANS.find((p) => p.id === "donation")!;

  function handleCheckout(planId: string, donationCents?: number) {
    setActivePlan(planId);
    checkout(planId, donationCents);
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      {/* Header */}
      <section
        style={{ backgroundColor: "#FF6B6B" }}
        className="px-6 py-16 md:py-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">
            Pricing
          </p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight mb-6">
            Choose Your Plan
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
            Every box delivers a unique puzzle portrait, themed goodies, and the
            story of an inspiring community member.
          </p>
        </div>
      </section>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 text-center text-sm">
          {error}
        </div>
      )}

      {/* Subscription Plans */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2
          style={{ fontSize: "2rem", fontWeight: 800 }}
          className="text-center mb-12 text-gray-900"
        >
          Subscriptions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => {
            const isPopular = plan.popular;
            const isLoading = loading && activePlan === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  borderColor: isPopular ? "#FF6B6B" : "#E0E0E0",
                  borderWidth: isPopular ? "3px" : "1px",
                }}
                className="rounded-lg p-8 bg-white relative flex flex-col"
              >
                {isPopular && (
                  <span
                    style={{ backgroundColor: "#FF6B6B" }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white rounded-full uppercase tracking-wide"
                  >
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {plan.name}
                </h3>
                <p
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "#FF6B6B",
                  }}
                  className="mb-1"
                >
                  {plan.displayPrice}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {plan.interval === "month"
                    ? "/month"
                    : plan.interval === "quarter"
                      ? "/quarter"
                      : "/year"}
                </p>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Check
                        size={16}
                        style={{ color: "#FF6B6B" }}
                        className="flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading}
                  style={{
                    backgroundColor: isPopular ? "#FF6B6B" : "#F0F0F0",
                    color: isPopular ? "white" : "#333",
                  }}
                  className="w-full py-3 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {isLoading ? "Redirecting…" : "Subscribe"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* One-time Purchases */}
      <section
        style={{ backgroundColor: "#F0F0F0" }}
        className="py-16 px-6"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gift Box */}
          <div className="rounded-lg p-8 bg-white border border-gray-200 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {giftPlan.name}
            </h3>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "#FF6B6B",
              }}
              className="mb-1"
            >
              {giftPlan.displayPrice}
            </p>
            <p className="text-gray-400 text-sm mb-4">one-time</p>
            <p className="text-gray-600 mb-6">{giftPlan.description}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {giftPlan.features.map((f, j) => (
                <li
                  key={j}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <Check
                    size={16}
                    style={{ color: "#FF6B6B" }}
                    className="flex-shrink-0"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(giftPlan.id)}
              disabled={loading}
              style={{ backgroundColor: "#FF6B6B" }}
              className="w-full py-3 font-bold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && activePlan === giftPlan.id && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {loading && activePlan === giftPlan.id
                ? "Redirecting…"
                : "Buy Gift Box"}
            </button>
          </div>

          {/* Donation */}
          <div className="rounded-lg p-8 bg-white border border-gray-200 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {donationPlan.name}
            </h3>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "#FF6B6B",
              }}
              className="mb-1"
            >
              ${donationAmount}
            </p>
            <p className="text-gray-400 text-sm mb-4">one-time donation</p>
            <p className="text-gray-600 mb-6">{donationPlan.description}</p>
            <ul className="space-y-3 mb-6 flex-1">
              {donationPlan.features.map((f, j) => (
                <li
                  key={j}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <Check
                    size={16}
                    style={{ color: "#FF6B6B" }}
                    className="flex-shrink-0"
                  />
                  {f}
                </li>
              ))}
            </ul>

            {/* Amount selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[5, 10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDonationAmount(amt)}
                  style={{
                    backgroundColor:
                      donationAmount === amt ? "#FF6B6B" : "#F0F0F0",
                    color: donationAmount === amt ? "white" : "#333",
                  }}
                  className="px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  ${amt}
                </button>
              ))}
              <input
                type="number"
                min={1}
                value={donationAmount}
                onChange={(e) =>
                  setDonationAmount(Math.max(1, Number(e.target.value)))
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center"
              />
            </div>

            <button
              onClick={() =>
                handleCheckout(donationPlan.id, donationAmount * 100)
              }
              disabled={loading}
              style={{ backgroundColor: "#FF6B6B" }}
              className="w-full py-3 font-bold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && activePlan === donationPlan.id && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {loading && activePlan === donationPlan.id
                ? "Redirecting…"
                : `Donate $${donationAmount}`}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2
          style={{ fontSize: "2rem", fontWeight: 800 }}
          className="text-center mb-10 text-gray-900"
        >
          Payment FAQ
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, and more through our secure Stripe checkout.",
            },
            {
              q: "Can I cancel my subscription?",
              a: "Absolutely. You can cancel anytime from your account page. You'll still receive boxes for the remainder of your paid period.",
            },
            {
              q: "Is my payment information secure?",
              a: "Yes — we never see or store your card details. All payments are processed securely by Stripe, a PCI Level 1 certified payment processor.",
            },
            {
              q: "Do you offer refunds?",
              a: "We offer full refunds within 14 days of purchase if your box hasn't shipped yet. Visit the Returns page for more details.",
            },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="font-bold text-gray-900 mb-1">{item.q}</h3>
              <p className="text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
