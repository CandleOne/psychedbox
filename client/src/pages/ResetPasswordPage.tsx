import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useSearch } from "wouter";

export default function ResetPasswordPage() {
  useSEO({
    title: "Reset Password — PsychedBox",
    description: "Set a new password for your PsychedBox account.",
    canonical: "/reset-password",
  });

  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white">
        <SiteNavbar />
        <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">Account</p>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">Reset Password</h1>
          </div>
        </section>
        <section className="px-6 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <AlertTriangle size={48} className="mx-auto text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Invalid reset link</h2>
            <p className="text-gray-600">This link is missing a reset token. Please request a new password reset.</p>
            <Link
              href="/forgot-password"
              style={{ backgroundColor: "#1a1a1a" }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
            >
              Request New Link
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">Account</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">Set New Password</h1>
          <p className="text-white text-lg md:text-xl max-w-3xl">Choose a new password for your account.</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-md mx-auto">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle size={48} className="mx-auto text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Password updated!</h2>
              <p className="text-gray-600">Your password has been reset successfully. You can now log in with your new password.</p>
              <Link
                href="/login"
                style={{ backgroundColor: "#1a1a1a" }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
              >
                Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#1a1a1a" }}
                className="w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
