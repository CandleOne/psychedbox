import { useState } from "react";
import { Search, LogIn, Menu, X } from "lucide-react";

function Logo() {
  return (
    <a href="/" className="flex items-center">
      <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05em", color: "#ffffff", textTransform: "uppercase", lineHeight: 1 }}>
        Psych<span style={{ color: "#FF6B6B" }}>ed</span>Box
      </span>
    </a>
  );
}

export default function SiteNavbar({ showAnnouncement = false }: { showAnnouncement?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {showAnnouncement && (
        <div style={{ backgroundColor: "#FF6B6B" }} className="w-full py-2 text-center">
          <a href="/movement" className="text-white text-sm font-semibold hover:opacity-80 transition-opacity">
            ✨ Take a piece give a piece! Learn more about our efforts to support the movement ✨
          </a>
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
            <a href="/account" className="text-white text-xs font-semibold tracking-widest uppercase hidden sm:block hover:text-white/80 transition-colors">
              ACCOUNT
            </a>
            <a href="/account" className="text-white hover:text-white/80 transition-colors hidden sm:block">
              <LogIn size={18} />
            </a>
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
        <div className="p-6">
          <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Shop</p>
              <a href="/shop" className="block text-sm py-1 font-semibold hover:opacity-80 transition-colors" style={{ color: "#FF6B6B" }}>All Products</a>
              <a href="/shop/monthly-boxes" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Monthly Boxes</a>
              <a href="/shop/gift-subscriptions" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Gift Subscriptions</a>
              <a href="/shop/past-puzzles" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Past Puzzles</a>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Community</p>
              <a href="/community/member-gallery" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Member Gallery</a>
              <a href="/community/stories" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Stories</a>
              <a href="/community/events" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Events</a>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">About</p>
              <a href="/movement" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Movement</a>
              <a href="/about/our-mission" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Our Mission</a>
              <a href="/about/how-it-works" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">How It Works</a>
              <a href="/contact" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Contact</a>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Support</p>
              <a href="/faq" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">FAQ</a>
              <a href="/shipping-info" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Shipping</a>
              <a href="/returns" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Returns</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}