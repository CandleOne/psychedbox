import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { Loader2, CheckCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "wouter";

export default function ForgotPasswordPage() {
  useSEO({
    title: "Forgot Password — PsychedBox",
    description: "Reset your PsychedBox account password.",
    canonical: "/forgot-password",
  });

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">Account</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">Forgot Password</h1>
          <p className="text-white text-lg md:text-xl max-w-3xl">Enter your email and we'll send you a reset link.</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-md mx-auto">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle size={48} className="mx-auto text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
              <p className="text-gray-600">
                If an account exists for <strong>{email}</strong>, we've sent a password reset link.
                It expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#1a1a1a" }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-[#FF6B6B] hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
