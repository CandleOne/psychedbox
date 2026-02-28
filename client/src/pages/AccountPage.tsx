import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckout } from "@/hooks/useCheckout";
import { useSEO } from "@/hooks/useSEO";
import { Link, useLocation } from "wouter";
import { LogOut, Settings, Shield, Package, Truck, Star, Mail, Loader2, ExternalLink, Receipt, ShoppingBag, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface OrderItem {
  product_id: string;
  name: string;
  variant: string | null;
  quantity: number;
  price_cents: number;
}

interface Order {
  id: number;
  stripe_session_id: string;
  amount_cents: number;
  currency: string;
  status: string;
  plan_id: string | null;
  item_summary: string;
  created_at: string;
  items: OrderItem[];
}

export default function AccountPage() {
  useSEO({
    title: "Your Account — PsychedBox",
    description: "Manage your PsychedBox subscription, track deliveries, update billing, and set your preferences.",
    canonical: "/account",
  });

  const { user, loading, logout, deleteAccount, isAdmin } = useAuth();
  const { manageSubscription, loading: portalLoading } = useCheckout();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    fetch("/api/auth/orders", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  async function handleResendVerification() {
    setVerificationLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", { method: "POST", credentials: "include" });
      if (res.ok) setVerificationSent(true);
    } catch { /* ignore */ }
    setVerificationLoading(false);
  }

  async function handleDeleteAccount() {
    if (!deletePassword) {
      setDeleteError("Enter your password to confirm.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    const result = await deleteAccount(deletePassword);
    if (result.error) {
      setDeleteError(result.error);
      setDeleteLoading(false);
    } else {
      navigate("/");
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteNavbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <SiteNavbar />
        <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">Account</p>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">Your Account</h1>
            <p className="text-white text-lg md:text-xl max-w-3xl">Log in or create an account to get started.</p>
          </div>
        </section>
        <section className="px-6 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <p className="text-gray-600">Sign in to manage your subscription, track deliveries, and access your dashboard.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/login"
                style={{ backgroundColor: "#1a1a1a" }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
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
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">
            Welcome back{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-white text-lg md:text-xl max-w-3xl">
            Manage your membership, deliveries, and preferences.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* User info card */}
          <div className="rounded-xl border border-gray-200 p-6 bg-white mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || user.email}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    <Settings size={12} />
                    {user.plan ?? "Free"}
                  </span>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Member since {new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Shield size={14} />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <LogOut size={14} />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Email verification banner */}
          {!user.email_verified && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-900 font-semibold text-sm">Email not verified</p>
                <p className="text-amber-700 text-sm">
                  Please verify your email address to secure your account.
                </p>
              </div>
              {verificationSent ? (
                <span className="inline-flex items-center gap-1 text-green-700 text-sm font-medium">
                  <CheckCircle2 size={14} /> Sent!
                </span>
              ) : (
                <button
                  onClick={handleResendVerification}
                  disabled={verificationLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {verificationLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                  Resend Verification
                </button>
              )}
            </div>
          )}

          {/* Quick actions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.plan && user.plan !== "free" ? (
              <button
                onClick={() => user.stripe_customer_id && manageSubscription(user.stripe_customer_id)}
                disabled={portalLoading}
                className="text-left rounded-xl border border-gray-200 p-6 bg-white hover:border-gray-300 transition-colors"
              >
                <div style={{ backgroundColor: "#FF6B6B" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  <Package size={18} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  Manage Subscription
                  {portalLoading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={14} className="text-gray-400" />}
                </h3>
                <p className="text-gray-600 leading-relaxed">Switch plans, update billing details, and review renewal dates via the Stripe customer portal.</p>
              </button>
            ) : (
              <Link href="/pricing" className="block rounded-xl border border-gray-200 p-6 bg-white hover:border-gray-300 transition-colors">
                <div style={{ backgroundColor: "#FF6B6B" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  <Package size={18} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Start a Subscription</h3>
                <p className="text-gray-600 leading-relaxed">Choose a plan to get monthly puzzle portraits, themed goodies, and member stories.</p>
              </Link>
            )}
            <Link href="/shipping-info" className="block rounded-xl border border-gray-200 p-6 bg-white hover:border-gray-300 transition-colors">
              <div style={{ backgroundColor: "#FF6B6B" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <Truck size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Shipping & Deliveries</h3>
              <p className="text-gray-600 leading-relaxed">View shipping timelines, tracking info, and delivery details for your boxes.</p>
            </Link>
            <article className="rounded-xl border border-gray-200 p-6 bg-white">
              <div style={{ backgroundColor: "#FF6B6B" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <Star size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Member Preferences</h3>
              <p className="text-gray-600 leading-relaxed">
                You're signed in as <strong>{user.email}</strong>.
                {user.plan ? ` Current plan: ${user.plan}.` : " No active subscription."}
              </p>
            </article>
            <Link href="/contact" className="block rounded-xl border border-gray-200 p-6 bg-white hover:border-gray-300 transition-colors">
              <div style={{ backgroundColor: "#FF6B6B" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <Mail size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 leading-relaxed">Contact support for shipping, billing, or membership questions.</p>
            </Link>
          </div>

          {/* Order History */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Receipt size={22} />
              Order History
            </h2>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
                <ShoppingBag size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium mb-1">No orders yet</p>
                <p className="text-gray-400 text-sm">Your purchase history will appear here once you place an order.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-gray-200 p-5 bg-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{order.item_summary}</h3>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">
                          ${(order.amount_cents / 100).toFixed(2)}
                        </span>
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "refunded"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {order.items.length > 0 && (
                      <div className="border-t border-gray-100 pt-3 mt-1">
                        <ul className="space-y-1 text-sm text-gray-600">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>
                                {item.name}
                                {item.variant ? ` (${item.variant})` : ""}
                                {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                              </span>
                              <span className="text-gray-400">
                                ${(item.price_cents / 100).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Account */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Trash2 size={18} className="text-red-500" />
              Delete Account
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Delete My Account
              </button>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 max-w-md">
                <p className="text-red-800 text-sm font-semibold mb-3">
                  Enter your password to confirm permanent deletion:
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3 py-2 rounded-lg border border-red-300 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {deleteError && (
                  <p className="text-red-600 text-sm mb-3">{deleteError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Permanently Delete
                  </button>
                  <button
                    onClick={() => { setDeleteConfirm(false); setDeletePassword(""); setDeleteError(""); }}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}


