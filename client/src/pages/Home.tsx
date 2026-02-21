import { useState } from "react";
import { Search, LogIn, Menu, X, Star, Users, Gift, Zap } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div style={{ backgroundColor: "#FF6B6B" }} className="w-full py-2 text-center">
        <p className="text-white text-sm font-semibold">
          ✨ February Box Now Available • Limited Edition Puzzle Inside 🧩
        </p>
      </div>

      {/* Navbar */}
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: Tagline & CTA */}
          <div className="flex flex-col justify-center px-6 md:px-8 py-12 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-md">
              <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#1a1a1a", lineHeight: 1.1 }} className="mb-4">
                Let Piece it together
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                PsychedBox aims to educate and connect the psychedelic community through immersive art and storytelling.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Each box contains a unique puzzle highlighting an exemplary community member, themed goodies, and a story that highlights their journey of wellness, and working within the movement.
              </p>
              <button style={{ backgroundColor: "#FF6B6B" }} className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity inline-block">
                SUBSCRIBE NOW
              </button>
            </div>
          </div>

          {/* Right: Featured Image */}
          <div className="relative h-96 md:h-auto">
            <img
              src="https://private-us-east-1.manuscdn.com/sessionFile/mlT7Ir3Q0O51J7zY8nz4Zd/sandbox/4NsjTC8C2NH03jIu1uF372-img-1_1771710920000_na1fn_cHN5Y2hlZGJveC1oZXJvLXB1enpsZQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbWxUN0lyM1EwTzUxSjd6WThuejRaZC9zYW5kYm94LzROc2pUQzhDMk5IMDNqSXUxdUYzNzItaW1nLTFfMTc3MTcxMDkyMDAwMF9uYTFmbl9jSE41WTJobFpHSnZlQzFvWlhKdkxYQjFlbnBzWlEuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=MxYK~x3LW42U8qcQS0Hzpdcanr00FXGArbeWeS3Pwmlahe5j4uL1oyHZ~IVtxUXy-CGr1ttovIpTDL~djqqPyw7K5QpwoOrsd~USOZnpTYkj40pyVYCS47nIFT0v66WEVM-3tRYrtxUQz-BulVbQkbALM~0NXS7M0kAoWtSi7LMVtTmxIqxNgeX3BsY-TZkCoKCMYeu1c7T8JCv3UI5zd3w-IbvCM3wwWEKSDewnXZl3h8VFBmvtOXj3splYfhuPKSTMCmhXgrDyjOTFAcTTFc~NFQSgbg2unqeyMxw8Hq5IbVaHVwPb~7ESbzQm22grdUeJvtPP2qbJCA80fB-uQA__"
              alt="Psychedelic puzzle pattern"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800 }} className="text-center mb-12 text-gray-900">
          What's Inside Every Box
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Zap, title: "Unique Puzzle", desc: "A stylized portrait puzzle of an inspiring community member" },
            { icon: Users, title: "Their Story", desc: "Learn about the person behind the puzzle and their journey" },
            { icon: Gift, title: "Themed Goodies", desc: "Monthly curated items matching the theme" },
            { icon: Star, title: "Exclusive Access", desc: "Member-only content and community events" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-4">
                <div style={{ backgroundColor: "#FF6B6B" }} className="p-4 rounded-full">
                  <item.icon size={24} className="text-white" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Member Section */}
      <section style={{ backgroundColor: "#F0F0F0" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="https://private-us-east-1.manuscdn.com/sessionFile/mlT7Ir3Q0O51J7zY8nz4Zd/sandbox/4NsjTC8C2NH03jIu1uF372-img-2_1771710920000_na1fn_cHN5Y2hlZGJveC1tb250aGx5LXRoZW1l.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbWxUN0lyM1EwTzUxSjd6WThuejRaZC9zYW5kYm94LzROc2pUQzhDMk5IMDNqSXUxdUYzNzItaW1nLTJfMTc3MTcxMDkyMDAwMF9uYTFmbl9jSE41WTJobFpHSnZlQzF0YjI1MGFHeDVMWFJvWlcxbC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=IVT0uXbVFTdzAyFbnuKA22Vm4-mqYLEuS-Ljfk25eUgZ9Ha-KvRkVVffpgQnI2oKdkzHoKoXFp9p-d5DPlyONwBrJNtshLtcZQs79eWlzvPjbUCrKXTaXXcAzjMHJ7QcDuaRZGEUrVRQEAWGgS48EKentFkpIB~0DrzfNZhtwQ9oHi2TRK-WEBgRIU1d-7mU~TYlx-oR64mAnQY8PQ-J-QKEZBN9Syw6Cl7Y5JzWcRpQP~9SllB5HpK9nnAIaeT9~ZFq~KWM1b501KJzeTWVUeWo1HVTJBgvpLRU8HdNxBSkcVhQ326kXcSDTG4VaChfnVmTIViyi8mjoGnmTOkUtw__"
              alt="February featured member puzzle"
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <p style={{ color: "#FF6B6B" }} className="font-bold text-sm uppercase tracking-widest mb-2">
              February Featured
            </p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800 }} className="mb-4 text-gray-900">
              Meet This Month's Puzzle
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Every month, we celebrate an inspiring member of our community by creating a unique puzzle portrait. This puzzle isn't just a game—it's a gateway to discovering their story, their passion, and their impact on the world around them.
            </p>
            <button style={{ backgroundColor: "#FF6B6B" }} className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
              EXPLORE THEIR STORY
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800 }} className="text-center mb-12 text-gray-900">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Monthly", price: "$29", desc: "One puzzle box per month", features: ["Monthly puzzle", "Themed goodies", "Digital story"] },
            { name: "Quarterly", price: "$79", desc: "Three boxes, save 10%", features: ["3 monthly puzzles", "Themed goodies", "Digital stories", "Exclusive merch"] },
            { name: "Annual", price: "$299", desc: "Twelve boxes, save 15%", features: ["12 monthly puzzles", "Themed goodies", "Digital stories", "Exclusive merch", "VIP community access"] },
          ].map((plan, i) => (
            <div key={i} style={{ borderColor: i === 1 ? "#FF6B6B" : "#E0E0E0", borderWidth: i === 1 ? "3px" : "1px" }} className="rounded-lg p-8 bg-white">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FF6B6B" }} className="mb-2">
                {plan.price}
              </p>
              <p className="text-gray-600 mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-700">
                    <span style={{ color: "#FF6B6B" }} className="font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button style={{ backgroundColor: i === 1 ? "#FF6B6B" : "#F0F0F0", color: i === 1 ? "white" : "#333" }} className="w-full py-3 font-bold rounded-lg hover:opacity-90 transition-opacity">
                {i === 1 ? "MOST POPULAR" : "SELECT"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section style={{ backgroundColor: "#1a1a1a" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "white" }} className="mb-6">
            Join Our Community
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Connect with fellow puzzle enthusiasts, share your completed puzzles, and discover the stories of inspiring community members from around the world.
          </p>
          <img
            src="https://private-us-east-1.manuscdn.com/sessionFile/mlT7Ir3Q0O51J7zY8nz4Zd/sandbox/4NsjTC8C2NH03jIu1uF372-img-4_1771710918000_na1fn_cHN5Y2hlZGJveC1jb21tdW5pdHk.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbWxUN0lyM1EwTzUxSjd6WThuejRaZC9zYW5kYm94LzROc2pUQzhDMk5IMDNqSXUxdUYzNzItaW1nLTRfMTc3MTcxMDkxODAwMF9uYTFmbl9jSE41WTJobFpHSnZlQzFqYjIxdGRXNXBkSGsuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Csc6N6z74XovSgQOUkJ5qhC20GNl71EkGSHTcxb9gMV~KX-ANJQpXtX8peF-gEsB0726fmDITvjYlZN9sORari19637qAVKsGXofXdstB7z6XwqPYHwcQCZbhJ436AjI4ceHMzejYWT8uzlFhWshRDvjaN4t712Lfn2pqjgPq8U30zvKkjckyAJN~I5SFjeIPqE0ykkZIkHE355H17YaG8GjheoKKB4qB6u4WRzDWq33LP5Y7-cJFOcnSnmtn6~BAnifHq0J15Gx4fNg9iWmJyghSIE-~Pgs14ynyh3H9WCfAXezOwj6ALaiDY5dUi9YyA--2itUV8Y7oehAiE-RVQ__"
            alt="Community members"
            className="w-full rounded-lg max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 max-w-2xl mx-auto text-center">
        <h2 style={{ fontSize: "2rem", fontWeight: 800 }} className="mb-4 text-gray-900">
          Get Updates & Exclusive Previews
        </h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for sneak peeks of upcoming puzzle portraits and member stories.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-400"
          />
          <button style={{ backgroundColor: "#FF6B6B" }} className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            SUBSCRIBE
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1a1a1a" }} className="w-full py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Company</p>
              {["About Us", "Contact", "Careers"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Support</p>
              {["FAQ", "Shipping Info", "Returns"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Legal</p>
              {["Privacy Policy", "Terms of Service"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Follow</p>
              {["Instagram", "Twitter", "Facebook"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">© 2026 PsychedBox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <a href="/" className="flex items-center">
      <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05em", color: "#ffffff", textTransform: "uppercase", lineHeight: 1 }}>
        Psych<span style={{ color: "#FF6B6B" }}>ed</span>Box
      </span>
    </a>
  );
}

function Navbar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
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
            <a href="#" className="text-white text-xs font-semibold tracking-widest uppercase hidden sm:block hover:text-white/80 transition-colors">
              ACCOUNT
            </a>
            <a href="#" className="text-white hover:text-white/80 transition-colors hidden sm:block">
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
              {["Monthly Boxes", "Gift Subscriptions", "Past Puzzles"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Community</p>
              {["Member Gallery", "Stories", "Events"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">About</p>
              {["Our Mission", "How It Works", "Contact"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Support</p>
              {["FAQ", "Shipping", "Returns"].map(item => (
                <a key={item} href="#" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
