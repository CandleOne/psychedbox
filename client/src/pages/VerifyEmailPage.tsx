import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function VerifyEmailPage() {
  useSEO({
    title: "Verify Email — PsychedBox",
    description: "Verify your email address for your PsychedBox account.",
    canonical: "/verify-email",
  });

  const search = useSearch();
  const token = new URLSearchParams(search).get("token");
  const { refresh } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token. Please check the link in your email.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          refresh(); // refresh user state
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error — please try again.");
      });
  }, [token, refresh]);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">Account</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">
            Email Verification
          </h1>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 size={48} className="mx-auto animate-spin text-gray-400" />
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Verified!</h2>
              <p className="text-gray-600">{message}</p>
              <Link
                href="/account"
                style={{ backgroundColor: "#1a1a1a" }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity mt-4"
              >
                Go to Account
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle size={48} className="mx-auto text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="text-gray-600">{message}</p>
              <Link
                href="/account"
                style={{ backgroundColor: "#1a1a1a" }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity mt-4"
              >
                Go to Account
              </Link>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
