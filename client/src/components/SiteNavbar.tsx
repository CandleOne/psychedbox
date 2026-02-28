import { useState, useRef } from "react";
import { Search, LogIn, Menu, ShoppingCart, X, User, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

// Simple site-wide search: maps query keywords to relevant pages
const SEARCH_INDEX = [
  { keywords: ["subscribe", "subscription", "plan", "pricing", "price", "box", "monthly", "quarterly", "annual"], path: "/pricing", label: "Pricing & Plans" },
  { keywords: ["shop", "store", "product", "buy", "merch", "grinder", "journal", "bowl", "incense", "poster", "sticker", "tray", "mask", "reagent", "test", "kit"], path: "/shop", label: "Shop" },
  { keywords: ["gift", "present"], path: "/shop/gift-subscriptions", label: "Gift Subscriptions" },
  { keywords: ["blog", "article", "guide", "read", "post"], path: "/blog", label: "Blog" },
  { keywords: ["harm", "reduction", "safety", "test", "dancesafe"], path: "/blog/what-is-harm-reduction", label: "What Is Harm Reduction?" },
  { keywords: ["ceremony", "ritual", "space", "setting", "set"], path: "/blog/setting-up-a-ceremony-space", label: "Setting Up a Ceremony Space" },
  { keywords: ["movement", "mission", "donate", "donation", "nonprofit", "advocacy", "giveback"], path: "/movement", label: "The Movement" },
  { keywords: ["about", "team", "who", "company"], path: "/about-us", label: "About Us" },
  { keywords: ["contact", "email", "support", "help"], path: "/contact", label: "Contact" },
  { keywords: ["faq", "question", "answer", "how"], path: "/faq", label: "FAQ" },
  { keywords: ["shipping", "delivery", "track"], path: "/shipping-info", label: "Shipping Info" },
  { keywords: ["return", "refund", "exchange"], path: "/returns", label: "Returns" },
  { keywords: ["account", "profile", "settings", "login", "signup", "sign"], path: "/account", label: "My Account" },
  { keywords: ["gallery", "photo", "community", "member"], path: "/community/member-gallery", label: "Member Gallery" },
  { keywords: ["story", "stories", "feature", "featured"], path: "/community/stories", label: "Stories" },
  { keywords: ["event", "events", "meetup"], path: "/community/events", label: "Events" },
  { keywords: ["puzzle", "past", "archive", "previous"], path: "/shop/past-puzzles", label: "Past Puzzles" },
  { keywords: ["privacy", "policy", "data"], path: "/privacy-policy", label: "Privacy Policy" },
  { keywords: ["terms", "service", "legal"], path: "/terms-of-service", label: "Terms of Service" },
  { keywords: ["career", "job", "work", "hire"], path: "/careers", label: "Careers" },
  { keywords: ["mushroom", "grow", "gourmet"], path: "/blog/growing-gourmet-mushrooms-at-home", label: "Growing Gourmet Mushrooms" },
  { keywords: ["integration", "after", "experience", "process"], path: "/blog/integration-after-psychedelic-experience", label: "Integration After an Experience" },
  { keywords: ["art", "history", "psychedelic art", "culture"], path: "/blog/psychedelic-art-history-brief-introduction", label: "Psychedelic Art History" },
];

function searchPages(query: string): { path: string; label: string }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const words = q.split(/\s+/);
  const scored = SEARCH_INDEX.map((entry) => {
    const score = words.reduce((acc, word) => {
      const match = entry.keywords.some((k) => k.includes(word)) || entry.label.toLowerCase().includes(word);
      return acc + (match ? 1 : 0);
    }, 0);
    return { ...entry, score };
  })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const [location, navigate] = useLocation();
  const { count, openCart } = useCart();
  const { user, loading } = useAuth();

  const searchResults = searchPages(searchQuery);

  function handleSearchSelect(path: string) {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(path);
  }

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
        <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-3">
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div ref={searchRef} className="relative">
                <div className="flex items-center gap-2 bg-white/10 rounded px-3 py-1.5">
                  <Search size={14} className="text-white/70" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search PsychedBox..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                      if (e.key === "Enter" && searchResults.length > 0) handleSearchSelect(searchResults[0].path);
                    }}
                    className="bg-transparent text-white text-sm outline-none placeholder:text-white/50 w-48"
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-white/50 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                {searchQuery.trim() && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <button
                          key={result.path}
                          onClick={() => handleSearchSelect(result.path)}
                          className="w-full px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <Search size={12} className="text-gray-400 flex-shrink-0" />
                          {result.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-400">No results found</div>
                    )}
                  </div>
                )}
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