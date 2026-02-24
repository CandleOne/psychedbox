import { XCircle } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <div
          style={{ backgroundColor: "#FFF3E0" }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <XCircle size={40} style={{ color: "#E65100" }} />
        </div>

        <h1
          style={{ fontSize: "2.5rem", fontWeight: 900 }}
          className="mb-4 text-gray-900"
        >
          Checkout Cancelled
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          No worries — your payment was not processed. You can return to
          pricing whenever you're ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/pricing"
            style={{ backgroundColor: "#FF6B6B" }}
            className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity inline-block"
          >
            Back to Pricing
          </a>
          <a
            href="/"
            className="px-8 py-3 font-bold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors inline-block"
          >
            Go Home
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
