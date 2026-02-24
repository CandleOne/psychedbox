import { useEffect, useState } from "react";
import { Check, Package } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

export default function CheckoutSuccess() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <div
          style={{ backgroundColor: "#E8F5E9" }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Check size={40} style={{ color: "#2E7D32" }} />
        </div>

        <h1
          style={{ fontSize: "2.5rem", fontWeight: 900 }}
          className="mb-4 text-gray-900"
        >
          Thank You!
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Your order has been confirmed. We're preparing your PsychedBox
          and will send you tracking details as soon as it ships.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Package size={20} className="text-gray-500" />
            <h3 className="font-bold text-gray-900">What happens next?</h3>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span style={{ color: "#FF6B6B" }} className="font-bold mt-0.5">
                1.
              </span>
              You'll receive a confirmation email with your order details.
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: "#FF6B6B" }} className="font-bold mt-0.5">
                2.
              </span>
              We'll curate and assemble your box with care.
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: "#FF6B6B" }} className="font-bold mt-0.5">
                3.
              </span>
              Shipping updates will arrive via email once your box is on its way.
            </li>
          </ul>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-8">
            Reference: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            style={{ backgroundColor: "#FF6B6B" }}
            className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity inline-block"
          >
            Back to Home
          </a>
          <a
            href="/account"
            className="px-8 py-3 font-bold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors inline-block"
          >
            View Account
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
