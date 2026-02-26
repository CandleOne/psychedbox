import { useState } from "react";
import { Search, LogIn, Menu, ShoppingCart, X, User, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05em", color: "#ffffff", textTransform: "uppercase", lineHeight: 1 }}>
        Psych<span style={{ color: "#FF6B6B" }}>ed</span>Box
      </span>
    </Link>
  );
}

export default function SiteNavbar({ showAnnouncement = false }: { showAnnouncement?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();
  const { count, openCart } = useCart();
  const { user, loading } = useAuth();

  return (
    <>
      {showAnnouncement && (
        <div style={{ backgroundColor: "#FF6B6B" }} className="w-full py-2 text-center">
          <Link href="/movement" className="text-white text-sm font-semibold hover:opacity-80 transition-opacity">
            ✨ Take a piece give a piece! Learn more about our efforts to support the movement ✨
          </Link>
        </div>
      )}

      <nav style={{ backgroundColor: "#1a1a1a" }} className="sticky top-0 z-50 w-full">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-white/10 rounded px-3 py-1.5">
                <Search size={14} className="text-white/70" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-white text-sm outline-none placeholder:text-white/50 w-48"
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-white/80 hover:text-white transition-colors">
                <Search size={18} />
              </button>
            )}
            <Logo />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={openCart} className="relative text-white hover:text-white/80 transition-colors">
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#FF6B6B] text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
            {loading ? (
              <Loader2 size={18} className="text-white/50 animate-spin" />
            ) : user ? (
              <>
                <Link href="/account" className="text-white text-xs font-semibold tracking-widest uppercase hidden sm:block hover:text-white/80 transition-colors">
                  ACCOUNT
                </Link>
                <Link href="/account" className="text-white hover:text-white/80 transition-colors">
                  <User size={18} />
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white text-xs font-semibold tracking-widest uppercase hidden sm:block hover:text-white/80 transition-colors">
                  LOG IN
                </Link>
                <Link href="/signup" className="text-white text-xs font-semibold tracking-widest uppercase hidden sm:block hover:text-white/80 transition-colors">
                  SIGN UP
                </Link>
                <Link href="/login" className="text-white hover:text-white/80 transition-colors sm:hidden">
                  <LogIn size={18} />
                </Link>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white hover:text-white/80 transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setMenuOpen(false)}
          style={{ animation: "fadeIn 0.3s ease-out" }}
        />
      )}

      <div
        className="fixed top-16 left-0 right-0 z-50 w-full overflow-y-auto max-h-[calc(100vh-4rem)]"
        style={{
          backgroundColor: "#1a1a1a",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          visibility: menuOpen ? "visible" : "hidden",
        }}
      >
        <div className="p-6" onClick={() => setMenuOpen(false)}>
          <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Shop</p>
              <Link href="/shop" className="block text-sm py-1 font-semibold hover:opacity-80 transition-colors" style={{ color: location === "/shop" ? "#FF6B6B" : "#ffffff" }}>All Products</Link>
              <Link href="/shop/monthly-boxes" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Monthly Boxes</Link>
              <Link href="/shop/gift-subscriptions" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Gift Subscriptions</Link>
              <Link href="/shop/past-puzzles" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Past Puzzles</Link>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Community</p>
              <Link href="/community/member-gallery" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Member Gallery</Link>
              <Link href="/community/stories" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Stories</Link>
              <Link href="/community/events" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Events</Link>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">About</p>
              <Link href="/blog" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Blog</Link>
              <Link href="/movement" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Movement</Link>
              <Link href="/about/our-mission" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Our Mission</Link>
              <Link href="/about/how-it-works" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">How It Works</Link>
              <Link href="/contact" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Contact</Link>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Support</p>
              <Link href="/faq" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">FAQ</Link>
              <Link href="/shipping-info" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Shipping</Link>
              <Link href="/returns" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Returns</Link>
            </div>
            <div className="sm:hidden col-span-2 border-t border-white/10 pt-4 mt-2">
              {user ? (
                <Link href="/account" className="block text-white text-sm py-1 font-semibold hover:text-white/70 transition-colors">My Account</Link>
              ) : (
                <>
                  <Link href="/login" className="block text-white text-sm py-1 font-semibold hover:text-white/70 transition-colors">Log In</Link>
                  <Link href="/signup" className="block text-white text-sm py-1 font-semibold hover:text-white/70 transition-colors">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}