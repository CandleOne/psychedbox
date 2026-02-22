import { Star, Users, Gift, Zap } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <SiteNavbar showAnnouncement />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[520px] flex items-center">
        <img
          src="https://private-us-east-1.manuscdn.com/sessionFile/mlT7Ir3Q0O51J7zY8nz4Zd/sandbox/4NsjTC8C2NH03jIu1uF372-img-1_1771710920000_na1fn_cHN5Y2hlZGJveC1oZXJvLXB1enpsZQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbWxUN0lyM1EwTzUxSjd6WThuejRaZC9zYW5kYm94LzROc2pUQzhDMk5IMDNqSXUxdUYzNzItaW1nLTFfMTc3MTcxMDkyMDAwMF9uYTFmbl9jSE41WTJobFpHSnZlQzFvWlhKdkxYQjFlbnBzWlEuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=MxYK~x3LW42U8qcQS0Hzpdcanr00FXGArbeWeS3Pwmlahe5j4uL1oyHZ~IVtxUXy-CGr1ttovIpTDL~djqqPyw7K5QpwoOrsd~USOZnpTYkj40pyVYCS47nIFT0v66WEVM-3tRYrtxUQz-BulVbQkbALM~0NXS7M0kAoWtSi7LMVtTmxIqxNgeX3BsY-TZkCoKCMYeu1c7T8JCv3UI5zd3w-IbvCM3wwWEKSDewnXZl3h8VFBmvtOXj3splYfhuPKSTMCmhXgrDyjOTFAcTTFc~NFQSgbg2unqeyMxw8Hq5IbVaHVwPb~7ESbzQm22grdUeJvtPP2qbJCA80fB-uQA__"
          alt="Psychedelic puzzle pattern"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 px-6 md:px-8 py-12 md:py-20 w-full">
          <div className="max-w-md">
            <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff", lineHeight: 1.1 }} className="mb-4">
              Let's Piece it together
            </h1>
            <p className="text-lg text-white mb-6">
              PsychedBox aims to educate and connect the psychedelic community through immersive art and storytelling.
            </p>
            <p className="text-lg text-white mb-6">
              Each discovery box contains a unique puzzle highlighting an exemplary community member, themed goodies, and a story that highlights their journey of wellness, and work within the movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button style={{ backgroundColor: "#282828" }} className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
              Learn more about the work!
              </button>
              <button style={{ backgroundColor: "#FF6B6B" }} className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
              SUBSCRIBE NOW
              </button>
            </div>
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
      <SiteFooter />
    </div>
  );
}
