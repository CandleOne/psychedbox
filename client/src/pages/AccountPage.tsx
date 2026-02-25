import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { useSEO } from "@/hooks/useSEO";
import { Link, useLocation } from "wouter";
import { LogOut, Settings, Shield, Package, Truck, Star, Mail, Loader2 } from "lucide-react";

export default function AccountPage() {
  useSEO({
    title: "Your Account — PsychedBox",
    description: "Manage your PsychedBox subscription, track deliveries, update billing, and set your preferences.",
    canonical: "/account",
  });

  const { user, loading, logout, isAdmin } = useAuth();
  const [, navigate] = useLocation();

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

          {/* Quick actions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickCard icon={Package} title="Manage Subscription" description="Switch plans, update billing details, and review renewal dates with full control." />
            <QuickCard icon={Truck} title="Track Deliveries" description="Check shipping status for your current and upcoming boxes with order visibility." />
            <QuickCard icon={Star} title="Member Preferences" description="Set content preferences and email settings so your experience stays personalized." />
            <QuickCard icon={Mail} title="Need Help?" description="Contact support directly from your account for shipping, billing, or membership questions." />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function QuickCard({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <article className="rounded-xl border border-gray-200 p-6 bg-white hover:border-gray-300 transition-colors">
      <div style={{ backgroundColor: "#FF6B6B" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
        <Icon size={18} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </article>
  );
}
