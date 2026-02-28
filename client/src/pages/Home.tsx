import { Star, Users, Gift, Zap, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import NewsletterForm from "@/components/NewsletterForm";
import { useSEO } from "@/hooks/useSEO";
import { useJsonLd } from "@/hooks/useJsonLd";
import type { BlogPost } from "@/data/blog-posts";

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://psychedbox.com/#organization",
      name: "PsychedBox",
      url: "https://psychedbox.com",
      logo: "https://psychedbox.com/og-image.jpg",
      sameAs: [
        "https://www.instagram.com/psychedbox",
        "https://twitter.com/psychedbox",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@psychedbox.com",
        contactType: "customer service",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://psychedbox.com/#website",
      url: "https://psychedbox.com",
      name: "PsychedBox",
      publisher: { "@id": "https://psychedbox.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://psychedbox.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Product",
      name: "PsychedBox Monthly Subscription",
      description:
        "A monthly subscription box featuring a unique puzzle portrait of an inspiring psychedelic community member, themed goodies, and their story.",
      brand: { "@id": "https://psychedbox.com/#organization" },
      url: "https://psychedbox.com",
      offers: [
        {
          "@type": "Offer",
          name: "Monthly Plan",
          price: "29.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://psychedbox.com/shop/monthly-boxes",
        },
        {
          "@type": "Offer",
          name: "Quarterly Plan",
          price: "79.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://psychedbox.com/shop/monthly-boxes",
        },
        {
          "@type": "Offer",
          name: "Annual Plan",
          price: "299.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://psychedbox.com/shop/monthly-boxes",
        },
      ],
    },
  ],
};

export default function Home() {
  useSEO({
    title: "Monthly Psychedelic Art & Story Subscription Box",
    description:
      "PsychedBox delivers a monthly puzzle portrait of an inspiring psychedelic community member, curated goodies, and their story — straight to your door. Subscribe from $29/mo.",
    canonical: "/",
  });
  useJsonLd(organizationSchema);

  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);
  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        const posts: BlogPost[] = data.posts ?? [];
        if (posts.length > 0) setLatestPost(posts[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <SiteNavbar showAnnouncement />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[520px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1920&q=80&auto=format&fit=crop"
          alt="Psychedelic puzzle pattern"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 px-8 md:px-16 lg:px-24 py-12 md:py-20 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            {/* Left — headline + CTA */}
            <div className="max-w-lg">
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
                <Link href="/movement" style={{ backgroundColor: "#282828" }} className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-center">
                Learn more about the work!
                </Link>
                <Link href="/pricing" style={{ backgroundColor: "#FF6B6B" }} className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-center">
                SUBSCRIBE NOW
                </Link>
              </div>
            </div>

            {/* Right — latest blog post preview */}
            {latestPost && (
              <Link
                href={`/blog/${latestPost.slug}`}
                className="hidden md:flex flex-col max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/15 transition-colors group"
              >
                <img
                  src={latestPost.image}
                  alt={latestPost.imageAlt || latestPost.title}
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B6B] mb-3">
                    Check out our newest blog post
                  </p>
                  <h3 className="text-white font-bold text-xl leading-snug mb-2 group-hover:text-[#FF6B6B] transition-colors">
                    {latestPost.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-3 mb-4">
                    {latestPost.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF6B6B]">
                    Read more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            )}
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
              src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80&auto=format&fit=crop"
              alt="February featured member puzzle"
              loading="lazy"
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
            <Link href="/community/stories" style={{ backgroundColor: "#FF6B6B" }} className="inline-block px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
              EXPLORE THEIR STORY
            </Link>
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
            <div key={i} style={{ borderColor: i === 1 ? "#FF6B6B" : "#E0E0E0", borderWidth: i === 1 ? "3px" : "1px" }} className="rounded-lg p-8 bg-white flex flex-col">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FF6B6B" }} className="mb-2">
                {plan.price}
              </p>
              <p className="text-gray-600 mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-700">
                    <span style={{ color: "#FF6B6B" }} className="font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" style={{ backgroundColor: i === 1 ? "#FF6B6B" : "#F0F0F0", color: i === 1 ? "white" : "#333" }} className="w-full py-3 font-bold rounded-lg hover:opacity-90 transition-opacity block text-center">
                {i === 1 ? "MOST POPULAR" : "SELECT"}
              </Link>
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
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop"
            alt="Community members sharing completed psychedelic puzzles"
            loading="lazy"
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
        <NewsletterForm source="homepage" className="max-w-md mx-auto" />
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
