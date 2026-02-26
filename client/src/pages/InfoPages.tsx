import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useCheckout } from "@/hooks/useCheckout";
import { useSEO } from "@/hooks/useSEO";
import { useJsonLd } from "@/hooks/useJsonLd";
import { useState } from "react";
import { Camera, Users, BookOpen, Calendar, Heart, Package, Gift, RotateCcw, Truck, HelpCircle, Briefcase, Mail, Star, ShieldAlert, Loader2, MapPin, Clock, ExternalLink, ThumbsUp, Puzzle, Award, Globe, Mic } from "lucide-react";

// ─── Shared layout components ────────────────────────────────────────────────

function PageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">{eyebrow}</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">{title}</h1>
          <p className="text-white text-lg md:text-xl max-w-3xl">{description}</p>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">{children}</div>
      </section>
      <SiteFooter />
    </div>
  );
}

function InfoCard({ title, description, icon: Icon }: { title: string; description: string; icon?: React.ElementType }) {
  return (
    <article className="rounded-xl border border-gray-200 p-6 bg-white">
      {Icon && (
        <div style={{ backgroundColor: "#FF6B6B" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
          <Icon size={18} className="text-white" />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </article>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

// ─── Account (now a thin redirect — real page is in AccountPage.tsx) ─────────
// Kept as export for backward compat; the route now points to the dedicated file.

export { default as AccountPage } from "./AccountPage";

// ─── Shop ────────────────────────────────────────────────────────────────────

export function MonthlyBoxesPage() {
  useSEO({
    title: "Monthly Subscription Boxes — Psychedelic Puzzle Art & Goodies",
    description: "Subscribe to PsychedBox and receive a monthly puzzle portrait of an inspiring psychedelic community member, curated themed goodies, and their story. Plans from $29/mo.",
    canonical: "/shop/monthly-boxes",
  });

  const { checkout, loading, error } = useCheckout();
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const plans = [
    { id: "monthly", name: "Monthly", price: "$29", period: "/mo", desc: "Flexibility to explore month by month.", features: ["Monthly puzzle portrait", "Curated themed goodies", "Digital member story", "Community access"] },
    { id: "quarterly", name: "Quarterly", price: "$79", period: "/quarter", desc: "Three boxes, save 10% vs monthly.", features: ["3 monthly puzzle portraits", "Curated themed goodies", "Digital member stories", "Community access", "Exclusive quarterly merch"] },
    { id: "annual", name: "Annual", price: "$299", period: "/year", desc: "Twelve boxes, save 15% vs monthly.", features: ["12 monthly puzzle portraits", "Curated themed goodies", "Digital member stories", "Community access", "Exclusive merch drops", "VIP early access"] },
  ];

  function handleCheckout(planId: string) {
    setActivePlan(planId);
    checkout(planId);
  }

  return (
    <PageShell eyebrow="Shop" title="Monthly Boxes" description="A new story, a new portrait, a new connection every month. Choose the plan that works for you.">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-lg text-center text-sm mb-8">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, i) => {
          const isLoading = loading && activePlan === plan.id;
          return (
          <div key={plan.name} style={{ borderColor: i === 1 ? "#FF6B6B" : "#E0E0E0", borderWidth: i === 1 ? "3px" : "1px" }} className="rounded-xl p-8 bg-white border flex flex-col">
            {i === 1 && <p style={{ color: "#FF6B6B" }} className="text-xs font-bold uppercase tracking-widest mb-3">Most Popular</p>}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
            <p className="mb-6"><span style={{ color: "#FF6B6B", fontSize: "2.5rem", fontWeight: 900 }}>{plan.price}</span><span className="text-gray-400 text-sm">{plan.period}</span></p>
            <ul className="space-y-2 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-gray-700 text-sm">
                  <span style={{ color: "#FF6B6B" }} className="font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loading}
              style={{ backgroundColor: i === 1 ? "#FF6B6B" : "#1a1a1a" }}
              className="w-full py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Redirecting…" : "Get Started"}
            </button>
          </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: "#F7F7F7" }} className="rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's inside every box?</h2>
        <p className="text-gray-600 mb-6">Every PsychedBox is built around a featured community member — their portrait, their story, and the culture they represent.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Puzzle Portrait", "A high-quality stylized puzzle featuring an inspiring person from the psychedelic community."],
            ["Their Story", "A printed and digital story that goes deep on who they are, what they do, and why it matters."],
            ["Themed Goodies", "Curated items — art prints, zines, wellness items, and more — tied to the monthly theme."],
            ["Community Access", "Members-only content, events, and the chance to nominate future featured members."],
          ].map(([t, d]) => (
            <div key={t} className="flex gap-3">
              <span style={{ color: "#FF6B6B" }} className="font-black text-xl mt-0.5">✦</span>
              <div><p className="font-bold text-gray-900">{t}</p><p className="text-gray-600 text-sm">{d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export function GiftSubscriptionsPage() {
  useSEO({
    title: "Gift a PsychedBox Subscription — Unique Psychedelic Art Gift",
    description: "Give the gift of discovery. PsychedBox gift subscriptions include monthly puzzle art, community stories, and curated goodies. A truly unique gift for any occasion.",
    canonical: "/shop/gift-subscriptions",
  });

  const { checkout, loading, error } = useCheckout();
  const [activePlan, setActivePlan] = useState<string | null>(null);

  function handleGift(planId: string) {
    setActivePlan(planId);
    checkout(planId);
  }

  return (
    <PageShell eyebrow="Shop" title="Gift Subscriptions" description="Share discovery with someone you care about. PsychedBox makes a meaningful, one-of-a-kind gift.">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-lg text-center text-sm mb-8">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { id: "gift", name: "1 Month Gift", price: "$34", desc: "A single box — perfect intro gift." },
          { id: "gift", name: "3 Month Gift", price: "$89", desc: "Three months of stories and art." },
          { id: "gift", name: "12 Month Gift", price: "$329", desc: "A full year of community and culture." },
        ].map((plan, i) => {
          const isLoading = loading && activePlan === plan.id;
          return (
          <div key={plan.name} style={{ borderColor: i === 1 ? "#FF6B6B" : "#E0E0E0", borderWidth: i === 1 ? "3px" : "1px" }} className="rounded-xl p-8 bg-white border text-center">
            <Gift size={32} style={{ color: "#FF6B6B" }} className="mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
            <p style={{ color: "#FF6B6B", fontSize: "2rem", fontWeight: 900 }} className="mb-6">{plan.price}</p>
            <button
              onClick={() => handleGift(plan.id)}
              disabled={loading}
              style={{ backgroundColor: "#FF6B6B" }}
              className="w-full py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Redirecting…" : "Gift This"}
            </button>
          </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={Mail} title="Delivered to Them" description="We send a digital gift notification directly to your recipient so they can set up their account and choose their start date." />
        <InfoCard icon={Heart} title="Includes a Personal Note" description="Add a personal message at checkout and we'll include it in the gift notification — no gift wrapping required." />
        <InfoCard icon={Package} title="Ships to Their Door" description="Once activated, boxes ship directly to your recipient every month on their chosen plan." />
        <InfoCard icon={HelpCircle} title="Questions?" description="Reach us at support@psychedbox.com and we'll sort out any gift order questions within 1–2 business days." />
      </div>
    </PageShell>
  );
}

const pastPuzzles = [
  {
    month: "February 2026",
    name: "Elena Vásquez",
    role: "Integration Therapist & Author",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    theme: "Healing",
    pieces: 500,
    description: "Elena's work bridging traditional ceremony with modern psychotherapy has helped hundreds navigate their healing journeys with safety and intention.",
    available: true,
  },
  {
    month: "January 2026",
    name: "Marcus Chen",
    role: "Harm Reduction Advocate",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    theme: "Safety",
    pieces: 500,
    description: "Marcus co-founded a mobile testing service bringing reagent kits and peer support to music festivals across the Pacific Northwest.",
    available: true,
  },
  {
    month: "December 2025",
    name: "Amara Osei",
    role: "Visual Artist & Muralist",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
    theme: "Art & Expression",
    pieces: 500,
    description: "Amara's large-scale murals explore consciousness expansion through Afrofuturist imagery, exhibited in galleries from Accra to Brooklyn.",
    available: false,
  },
  {
    month: "November 2025",
    name: "Dr. James Whitfield",
    role: "Psychedelic Researcher",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    theme: "Research",
    pieces: 500,
    description: "Dr. Whitfield leads a clinical research program studying psilocybin-assisted therapy for treatment-resistant depression at a leading university.",
    available: true,
  },
  {
    month: "October 2025",
    name: "Sage Running Deer",
    role: "Indigenous Medicine Keeper",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    theme: "Tradition",
    pieces: 500,
    description: "Sage advocates for indigenous sovereignty over sacred plant medicines and educates communities on the cultural roots of ceremonial practice.",
    available: false,
  },
  {
    month: "September 2025",
    name: "Rafael Torres",
    role: "Veterans Wellness Advocate",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    theme: "Advocacy",
    pieces: 500,
    description: "After his own transformative experience, Rafael started a peer support network helping veterans explore psychedelic-assisted healing for PTSD.",
    available: true,
  },
];

export function PastPuzzlesPage() {
  useSEO({
    title: "Past Puzzle Drops — Previous Featured Community Members",
    description: "Browse past PsychedBox puzzle portraits featuring inspiring members of the psychedelic community. Revisit their stories and explore previous monthly drops.",
    canonical: "/shop/past-puzzles",
  });

  const [filter, setFilter] = useState<string>("All");
  const themes = ["All", ...Array.from(new Set(pastPuzzles.map(p => p.theme)))];
  const filtered = filter === "All" ? pastPuzzles : pastPuzzles.filter(p => p.theme === filter);

  return (
    <PageShell eyebrow="Shop" title="Past Puzzles" description="Every month features a new community member. Browse our archive of past puzzle portraits and the stories behind them.">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {themes.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={filter === t ? { backgroundColor: "#FF6B6B", color: "#fff" } : { backgroundColor: "#F3F4F6", color: "#374151" }}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:opacity-90"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Puzzle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filtered.map(puzzle => (
          <article key={puzzle.month} className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={puzzle.image}
                alt={`${puzzle.name} — ${puzzle.role}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span style={{ backgroundColor: "#FF6B6B" }} className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full">
                {puzzle.theme}
              </span>
              {!puzzle.available && (
                <span className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Sold Out
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{puzzle.month}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-0.5">{puzzle.name}</h3>
              <p style={{ color: "#FF6B6B" }} className="text-sm font-semibold mb-3">{puzzle.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{puzzle.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{puzzle.pieces} pieces</span>
                <div className="flex gap-2">
                  <Link href="/community/stories" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                    Read Story →
                  </Link>
                  {puzzle.available && (
                    <button
                      style={{ backgroundColor: "#FF6B6B" }}
                      className="text-sm font-bold text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Buy — $24
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: "#F7F7F7" }} className="rounded-xl p-8 md:p-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Don't miss the next drop</h2>
            <p className="text-gray-600 max-w-lg">Subscribe to get every new puzzle portrait delivered to your door — plus themed goodies and the featured member's story.</p>
          </div>
          <Link href="/shop/monthly-boxes" style={{ backgroundColor: "#FF6B6B" }} className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
            Subscribe Now
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

// ─── Community ───────────────────────────────────────────────────────────────

const galleryEntries = [
  {
    member: "@jessicamindful",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&h=600&fit=crop",
    caption: "Finally finished the Elena Vásquez portrait! Framed it above my meditation space — feels right.",
    puzzle: "February 2026 — Elena Vásquez",
    likes: 142,
    featured: true,
  },
  {
    member: "@puzzlehead_dan",
    image: "https://images.unsplash.com/photo-1494451930944-8998635c2123?w=600&h=600&fit=crop",
    caption: "Sunday session with Marcus Chen's puzzle and some good music. Harm reduction hero 🙌",
    puzzle: "January 2026 — Marcus Chen",
    likes: 98,
    featured: false,
  },
  {
    member: "@artful_healing",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop",
    caption: "Wall of PsychedBox puzzles is growing! Three months in and I'm hooked. Community is everything.",
    puzzle: "Multiple drops",
    likes: 215,
    featured: true,
  },
  {
    member: "@the_quiet_trip",
    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=600&h=600&fit=crop",
    caption: "Amara Osei's puzzle glued down and lacquered. The colors in this one are absolutely unreal.",
    puzzle: "December 2025 — Amara Osei",
    likes: 176,
    featured: false,
  },
  {
    member: "@cactus_mom_",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=600&fit=crop",
    caption: "Gift from my partner — unboxing video coming soon! The goodies this month are 🔥",
    puzzle: "February 2026 — Elena Vásquez",
    likes: 87,
    featured: false,
  },
  {
    member: "@integrateandcreate",
    image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&h=600&fit=crop",
    caption: "Built this one with my integration group. 4 people, 2 hours, incredible conversation. That's the magic.",
    puzzle: "November 2025 — Dr. James Whitfield",
    likes: 203,
    featured: true,
  },
];

export function MemberGalleryPage() {
  useSEO({
    title: "Member Gallery — Community Puzzle Builds & Creations",
    description: "See how PsychedBox members are completing and displaying their puzzle portraits. A gallery of community creativity and connection.",
    canonical: "/community/member-gallery",
  });

  const [view, setView] = useState<"all" | "featured">("all");
  const displayed = view === "featured" ? galleryEntries.filter(e => e.featured) : galleryEntries;

  return (
    <PageShell eyebrow="Community" title="Member Gallery" description="PsychedBox is built by its members. This is where they share what they've built, how they've displayed it, and what it means to them.">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          <button
            onClick={() => setView("all")}
            style={view === "all" ? { backgroundColor: "#FF6B6B", color: "#fff" } : { backgroundColor: "#F3F4F6", color: "#374151" }}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            All Posts
          </button>
          <button
            onClick={() => setView("featured")}
            style={view === "featured" ? { backgroundColor: "#FF6B6B", color: "#fff" } : { backgroundColor: "#F3F4F6", color: "#374151" }}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            ⭐ Featured
          </button>
        </div>
        <p className="text-gray-400 text-sm">{displayed.length} posts</p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {displayed.map((entry, i) => (
          <article key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden group">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={entry.image}
                alt={`${entry.member}'s puzzle build`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {entry.featured && (
                <span style={{ backgroundColor: "#FF6B6B" }} className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Award size={12} /> Featured
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900 text-sm">{entry.member}</p>
                <span className="flex items-center gap-1 text-gray-400 text-xs"><ThumbsUp size={12} /> {entry.likes}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{entry.caption}</p>
              <p className="text-gray-400 text-xs flex items-center gap-1"><Puzzle size={12} /> {entry.puzzle}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Submit Section */}
      <div style={{ backgroundColor: "#F7F7F7" }} className="rounded-xl p-8 md:p-10 mb-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Share your build</h2>
            <p className="text-gray-600 max-w-lg">Completed a PsychedBox puzzle? Tag us <strong>@psychedbox</strong> on Instagram or email your photo to <strong>gallery@psychedbox.com</strong> for a chance to be featured.</p>
          </div>
          <a href="https://www.instagram.com/psychedbox" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#FF6B6B" }} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
            <Camera size={16} /> Tag Us on Instagram
          </a>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={Camera} title="Submit Your Build" description="Share photos of your completed puzzle portraits, display setups, or unboxing moments to be featured in the gallery." />
        <InfoCard icon={Users} title="Community Voted" description="Each month the community votes on standout builds. Top entries get featured in our newsletter and win exclusive merch." />
        <InfoCard icon={Heart} title="Share Your Story" description="Tell us what the puzzle meant to you. We love hearing how members connect with each featured story." />
      </div>
    </PageShell>
  );
}

const communityStories = [
  {
    name: "Elena Vásquez",
    role: "Integration Therapist & Author",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    month: "February 2026",
    category: "Healing",
    excerpt: "I spent ten years in clinical psychology before I understood that healing isn't linear — it's recursive. My own journey with plant medicine showed me what my training couldn't: that transformation requires surrender, not control.",
    readTime: "8 min read",
  },
  {
    name: "Marcus Chen",
    role: "Harm Reduction Advocate",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    month: "January 2026",
    category: "Advocacy",
    excerpt: "At my first festival, I watched someone have a crisis with no support around them. That moment changed my career. Now I run a team of fifty volunteers across twelve events a year.",
    readTime: "6 min read",
  },
  {
    name: "Amara Osei",
    role: "Visual Artist & Muralist",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
    month: "December 2025",
    category: "Art",
    excerpt: "My art lives in two worlds — the ancestral visions I carry from my grandmother's stories in Ghana and the expanded perceptions I've found through my own practice. I paint what the in-between looks like.",
    readTime: "7 min read",
  },
  {
    name: "Dr. James Whitfield",
    role: "Psychedelic Researcher",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    month: "November 2025",
    category: "Research",
    excerpt: "The data tells one story. The patients tell another. My work exists in the space between clinical rigor and lived experience — trying to build a bridge strong enough to carry both.",
    readTime: "9 min read",
  },
  {
    name: "Sage Running Deer",
    role: "Indigenous Medicine Keeper",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    month: "October 2025",
    category: "Tradition",
    excerpt: "These plants were never ours to discover — they were always here, held by hands before ours. My work is about reminding people of that, and ensuring indigenous communities remain at the center of this conversation.",
    readTime: "10 min read",
  },
  {
    name: "Rafael Torres",
    role: "Veterans Wellness Advocate",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    month: "September 2025",
    category: "Advocacy",
    excerpt: "I came home from three deployments broken in ways the VA couldn't fix. Psychedelic therapy gave me my life back. Now I make sure other veterans know there's a path forward.",
    readTime: "7 min read",
  },
];

export function StoriesPage() {
  useSEO({
    title: "Community Stories — Psychedelic Wellness & Personal Journeys",
    description: "Read first-person stories from psychedelic community members featured in PsychedBox. Journeys of healing, advocacy, art, and transformation.",
    canonical: "/community/stories",
  });

  const [category, setCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(communityStories.map(s => s.category)))];
  const filtered = category === "All" ? communityStories : communityStories.filter(s => s.category === category);

  return (
    <PageShell eyebrow="Community" title="Stories" description="Every box tells a story. This is where those stories live — honest, human accounts from people doing meaningful work in the movement.">
      {/* Subscriber Badge */}
      <div style={{ backgroundColor: "#FFF5F5", borderColor: "#FF6B6B" }} className="rounded-xl border p-4 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Star size={20} style={{ color: "#FF6B6B" }} className="flex-shrink-0 mt-0.5" />
        <p className="text-gray-700 text-sm"><strong>Subscriber perk:</strong> Stories drop digitally to active subscribers the day each box ships — before they're published here.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={category === c ? { backgroundColor: "#FF6B6B", color: "#fff" } : { backgroundColor: "#F3F4F6", color: "#374151" }}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:opacity-90"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Stories List */}
      <div className="space-y-6 mb-16">
        {filtered.map(story => (
          <article key={story.name} className="rounded-xl border border-gray-200 bg-white overflow-hidden md:flex group">
            <div className="md:w-56 md:flex-shrink-0 aspect-square md:aspect-auto overflow-hidden bg-gray-100">
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span style={{ backgroundColor: "#FF6B6B" }} className="text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{story.category}</span>
                <span className="text-gray-400 text-xs">{story.month}</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={11} /> {story.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-0.5">{story.name}</h3>
              <p style={{ color: "#FF6B6B" }} className="text-sm font-semibold mb-3">{story.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">"{story.excerpt}"</p>
              <div className="mt-4">
                <button style={{ color: "#FF6B6B" }} className="text-sm font-bold hover:underline">Read Full Story →</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Nominate + Info */}
      <div style={{ backgroundColor: "#F7F7F7" }} className="rounded-xl p-8 md:p-10 mb-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nominate someone</h2>
            <p className="text-gray-600 max-w-lg">Know a community member whose story deserves to be told? Subscribers can nominate future featured members each month.</p>
          </div>
          <a href="mailto:stories@psychedbox.com" style={{ backgroundColor: "#FF6B6B" }} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
            <Mail size={16} /> Nominate Now
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={BookOpen} title="Subscriber-First Access" description="Every story drops digitally to subscribers the day their box ships — before anything goes public." />
        <InfoCard icon={Heart} title="Human-Centered" description="Stories are written with care and consent, centering the featured member's voice and experience." />
        <InfoCard icon={Users} title="Community-Driven" description="Featured subjects are nominated by the community. Every member has a voice in who we spotlight next." />
      </div>
    </PageShell>
  );
}

const upcomingEvents = [
  {
    title: "PsychedBox Member Circle — Portland",
    date: "March 15, 2026",
    time: "2:00 PM – 5:00 PM PST",
    location: "The Loft Community Space, Portland, OR",
    type: "In-Person" as const,
    tag: "Member Circle",
    description: "An intimate afternoon of puzzle building, story sharing, and community connection. Open to all active PsychedBox subscribers. Light refreshments provided.",
    spotsLeft: 12,
  },
  {
    title: "Harm Reduction 101 — Virtual Workshop",
    date: "March 22, 2026",
    time: "1:00 PM – 2:30 PM EST",
    location: "Zoom (link sent after registration)",
    type: "Virtual" as const,
    tag: "Partner Event",
    description: "A DanceSafe-led workshop on substance testing, peer support, and situational awareness. Free for all PsychedBox members.",
    spotsLeft: null,
  },
  {
    title: "Art & Integration Evening — NYC",
    date: "April 5, 2026",
    time: "6:00 PM – 9:00 PM EST",
    location: "Blossom Gallery, Brooklyn, NY",
    type: "In-Person" as const,
    tag: "Community Event",
    description: "A guided evening combining puzzle art, reflective writing, and group conversation. Facilitated by integration therapist Elena Vásquez.",
    spotsLeft: 24,
  },
  {
    title: "Fireside Chat: Indigenous Perspectives",
    date: "April 18, 2026",
    time: "12:00 PM – 1:30 PM PST",
    location: "Zoom (link sent after registration)",
    type: "Virtual" as const,
    tag: "Speaker Series",
    description: "A conversation with Sage Running Deer on indigenous sovereignty, sacred plant medicines, and the ethics of the modern psychedelic movement.",
    spotsLeft: null,
  },
];

const pastEvents = [
  { title: "Launch Party — PsychedBox Debut", date: "September 1, 2025", location: "Denver, CO", type: "In-Person" as const, attendees: 85 },
  { title: "Veterans & Psychedelics Panel", date: "October 10, 2025", location: "Virtual", type: "Virtual" as const, attendees: 210 },
  { title: "Holiday Puzzle Build-a-thon", date: "December 14, 2025", location: "Austin, TX", type: "In-Person" as const, attendees: 42 },
  { title: "New Year Integration Circle", date: "January 11, 2026", location: "Virtual", type: "Virtual" as const, attendees: 130 },
];

export function EventsPage() {
  useSEO({
    title: "Events — Psychedelic Community Gatherings & Circles",
    description: "Find upcoming PsychedBox community events, member circles, and psychedelic culture gatherings near you.",
    canonical: "/community/events",
  });

  return (
    <PageShell eyebrow="Community" title="Events" description="Community is built in person. Find gatherings, member circles, and events where the PsychedBox community comes together.">
      {/* Upcoming Events */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span style={{ backgroundColor: "#FF6B6B" }} className="w-3 h-3 rounded-full inline-block" />
        Upcoming Events
      </h2>
      <div className="space-y-6 mb-16">
        {upcomingEvents.map(event => (
          <article key={event.title} className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <div className="md:flex md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    style={{ backgroundColor: event.type === "Virtual" ? "#7C3AED" : "#059669" }}
                    className="text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  >
                    {event.type === "Virtual" ? <Globe size={11} /> : <MapPin size={11} />}
                    {event.type}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{event.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {event.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {event.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:text-right flex-shrink-0">
                {event.spotsLeft !== null && (
                  <p className="text-gray-400 text-xs mb-2">{event.spotsLeft} spots left</p>
                )}
                <button
                  style={{ backgroundColor: "#FF6B6B" }}
                  className="px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  RSVP
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Past Events */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {pastEvents.map(event => (
          <div key={event.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
              <span
                style={{ backgroundColor: event.type === "Virtual" ? "#EDE9FE" : "#D1FAE5", color: event.type === "Virtual" ? "#7C3AED" : "#059669" }}
                className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
              >
                {event.type}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{event.date}</span>
              <span>·</span>
              <span>{event.location}</span>
              <span>·</span>
              <span>{event.attendees} attended</span>
            </div>
          </div>
        ))}
      </div>

      {/* Host CTA */}
      <div style={{ backgroundColor: "#F7F7F7" }} className="rounded-xl p-8 md:p-10 mb-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Want to host a member circle?</h2>
            <p className="text-gray-600 max-w-lg">We support members who want to host local gathering. We'll help with planning, materials, and promotion to members in your area.</p>
          </div>
          <a href="mailto:partnerships@psychedbox.com" style={{ backgroundColor: "#FF6B6B" }} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
            <Mic size={16} /> Get in Touch
          </a>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={Users} title="Member Circles" description="Small, intentional gatherings hosted by and for PsychedBox members — local and virtual, always free for subscribers." />
        <InfoCard icon={Calendar} title="Partner Events" description="Events from our movement partners: DanceSafe, The Zendo Project, Heroic Hearts, and more — with member-exclusive access." />
        <InfoCard icon={Heart} title="Speaker Series" description="Monthly virtual conversations with featured community members, researchers, and advocates. Free for all PsychedBox members." />
      </div>
    </PageShell>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

export function MissionPage() {
  useSEO({
    title: "Our Mission — Psychedelic Education, Art & Community Care",
    description: "PsychedBox exists to educate and connect the psychedelic community through art and storytelling — while giving back to partners advancing harm reduction and equity.",
    canonical: "/about/our-mission",
  });

  return (
    <PageShell eyebrow="About" title="Our Mission" description="PsychedBox exists to educate, connect, and give back — using art and storytelling as the bridge.">
      <div className="prose max-w-none mb-12">
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          The psychedelic community is full of people doing extraordinary work — researchers, advocates, healers, artists, and everyday people on personal journeys of transformation. Too often, their stories go untold.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          PsychedBox was built to change that. Every month, we spotlight one community member through the medium of puzzle art — turning their likeness into something tactile, collectible, and shareable. Their story travels with the box.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          10% of every subscription goes to movement partners advancing harm reduction, education, and equity. Another 10% goes directly to the featured member. We exist to serve the community, not extract from it.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={BookOpen} title="Education First" description="Every story is crafted to inform — about people, practices, culture, and the broader movement for psychedelic awareness." />
        <InfoCard icon={Heart} title="Community-Led" description="The people we feature, the partners we support, and the direction we grow are all shaped by the community we serve." />
        <InfoCard icon={ShieldAlert} title="Responsibility Always" description="We believe in responsible storytelling. We do not promote or condone illegal activity. We celebrate culture, art, and human experience." />
      </div>
    </PageShell>
  );
}

export function HowItWorksPage() {
  useSEO({
    title: "How It Works — Monthly Psychedelic Subscription Box",
    description: "Learn how PsychedBox works: we curate a monthly community story, ship a puzzle box with themed goodies, and donate 10% of revenues to movement partners.",
    canonical: "/about/how-it-works",
  });

  const steps = [
    { title: "1) We curate each monthly theme", description: "Every month centers around a featured community voice, designed to educate and inspire through art and story." },
    { title: "2) Your box arrives with puzzle + story", description: "Each delivery includes a featured puzzle portrait, themed goodies, and a story spotlighting impact in the movement." },
    { title: "3) A portion supports partner organizations", description: "10% of revenues go to movement partners. Another 10% goes directly to the featured member." },
    { title: "4) Stay connected all month", description: "Members get exclusive updates, digital content, and opportunities to engage with the broader community." },
  ];

  return (
    <PageShell eyebrow="About" title="How It Works" description="From curation to community impact, here's how a PsychedBox subscription works month to month.">
      <div className="space-y-4">
        {steps.map((step) => (
          <InfoCard key={step.title} title={step.title} description={step.description} />
        ))}
      </div>
    </PageShell>
  );
}

export function AboutPage() {
  useSEO({
    title: "About Us — PsychedBox",
    description: "PsychedBox blends art, storytelling, and community care to make the psychedelic movement more human, informed, and accessible. Learn about our vision and approach.",
    canonical: "/about-us",
  });

  return (
    <PageShell eyebrow="Company" title="About Us" description="PsychedBox blends art, storytelling, and community care to make the movement more human, informed, and accessible.">
      <div className="text-gray-700 text-lg leading-relaxed mb-10 space-y-4">
        <p>PsychedBox started with a simple belief: the people doing meaningful work in the psychedelic community deserve to be celebrated — and their stories deserve to reach more people.</p>
        <p>We're a small team of artists, advocates, and culture enthusiasts building something we genuinely believe in. Every decision — from who we feature to which partners we support — is made with the community in mind.</p>
        <p>We're not a wellness brand selling a lifestyle. We're a community platform that happens to ship a box.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={Star} title="Our Vision" description="A connected community where education, safety, and creative expression can grow side by side." />
        <InfoCard icon={Heart} title="Our Approach" description="Each monthly box centers a community story and creates tangible support for movement-aligned organizations." />
        <InfoCard icon={ShieldAlert} title="Our Commitment" description="We prioritize responsible storytelling, inclusive representation, and full transparency with our partners and members." />
      </div>
    </PageShell>
  );
}

// ─── Support / Company ────────────────────────────────────────────────────────

export function ContactPage() {
  useSEO({
    title: "Contact Us — PsychedBox Support & Partnerships",
    description: "Get in touch with PsychedBox for subscription support, partnership inquiries, media requests, or general questions. We reply within 1–2 business days.",
    canonical: "/contact",
  });

  return (
    <PageShell eyebrow="Company" title="Contact" description="Reach out for support, partnerships, or general questions — we'd love to hear from you.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={Mail} title="General Support" description="For account, orders, and shipping questions: support@psychedbox.com" />
        <InfoCard icon={Heart} title="Partnerships" description="For movement and giveback collaborations: partnerships@psychedbox.com" />
        <InfoCard icon={BookOpen} title="Media & Stories" description="For storytelling features and press requests: stories@psychedbox.com" />
        <InfoCard icon={HelpCircle} title="Response Window" description="We typically reply within 1–2 business days, Monday through Friday." />
      </div>
    </PageShell>
  );
}

export function CareersPage() {
  useSEO({
    title: "Careers — Join the PsychedBox Team",
    description: "Interested in building the psychedelic community through art and storytelling? Explore open roles and opportunities to work with PsychedBox.",
    canonical: "/careers",
  });

  return (
    <PageShell eyebrow="Company" title="Careers" description="We're a small, passionate team. When we grow, we grow intentionally — with people who care about community as much as craft.">
      <div style={{ backgroundColor: "#F7F7F7" }} className="rounded-xl p-10 text-center mb-10">
        <Briefcase size={48} style={{ color: "#FF6B6B" }} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Open Roles Right Now</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">We don't have open positions at the moment, but we're always interested in connecting with talented people who believe in what we're building.</p>
        <a href="mailto:partnerships@psychedbox.com" style={{ backgroundColor: "#FF6B6B" }} className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity">
          Introduce Yourself
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon={Heart} title="Mission-Driven" description="We're building something we believe in. We want teammates who feel the same." />
        <InfoCard icon={Users} title="Community-First" description="Our work serves real people. Every role here — regardless of title — touches the community." />
        <InfoCard icon={Star} title="Remote & Flexible" description="We operate as a distributed team. We care about output, autonomy, and trust." />
      </div>
    </PageShell>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How often do PsychedBox boxes ship?", acceptedAnswer: { "@type": "Answer", text: "Boxes ship monthly. Once your order is processed, you'll receive tracking details when it leaves our fulfillment team." } },
    { "@type": "Question", name: "Can I gift a PsychedBox subscription?", acceptedAnswer: { "@type": "Answer", text: "Yes. Gift subscriptions are available and can be sent directly to a recipient with a personalized note." } },
    { "@type": "Question", name: "What if I need to skip or cancel my subscription?", acceptedAnswer: { "@type": "Answer", text: "You can manage plan changes from your account settings before the next renewal date." } },
    { "@type": "Question", name: "Does PsychedBox promote illegal drug use?", acceptedAnswer: { "@type": "Answer", text: "No. PsychedBox does not promote, condone, or encourage the use of any illegal substances. We celebrate culture, art, storytelling, and community — not substance use. All content is educational and artistic in nature." } },
    { "@type": "Question", name: "Does PsychedBox donate to causes?", acceptedAnswer: { "@type": "Answer", text: "Yes. 10% of revenues go to movement partners focused on education, harm reduction, and equity. An additional 10% goes directly to the featured community member each month." } },
    { "@type": "Question", name: "Who do you feature in the boxes?", acceptedAnswer: { "@type": "Answer", text: "We feature advocates, researchers, artists, healers, and community leaders doing meaningful work in the psychedelic culture space. Members can nominate future subjects." } },
  ],
};

export function FAQPage() {
  useSEO({
    title: "FAQ — Frequently Asked Questions",
    description: "Answers to common questions about PsychedBox subscriptions, shipping, gifting, cancellations, and our giveback program.",
    canonical: "/faq",
  });
  useJsonLd(faqSchema);

  const faqs = [
    { question: "How often do boxes ship?", answer: "Boxes ship monthly. Once your order is processed, you'll receive tracking details when it leaves our fulfillment team." },
    { question: "Can I gift a subscription?", answer: "Yes. Gift subscriptions are available and can be sent directly to a recipient with a personalized note." },
    { question: "What if I need to skip or cancel?", answer: "You can manage plan changes from your account settings before the next renewal date." },
    { question: "Does PsychedBox promote illegal drug use?", answer: "No. PsychedBox does not promote, condone, or encourage the use of any illegal substances. We celebrate culture, art, storytelling, and community — not substance use. All content is educational and artistic in nature." },
    { question: "Does PsychedBox donate to causes?", answer: "Yes. 10% of revenues support mission-aligned movement partners focused on education, harm reduction, and equity. An additional 10% goes directly to that month's featured community member." },
    { question: "Who do you feature in the boxes?", answer: "Advocates, researchers, artists, healers, and community leaders doing meaningful work in the psychedelic culture space. Members can nominate future subjects each month." },
    { question: "What age do I need to be to subscribe?", answer: "You must be 18 years or older to subscribe to PsychedBox." },
  ];

  return (
    <PageShell eyebrow="Support" title="Frequently Asked Questions" description="Quick answers to the most common questions from members and first-time subscribers.">
      <div className="space-y-4">
        {faqs.map((item) => (
          <article key={item.question} className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.question}</h3>
            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

// ─── Shipping & Returns ───────────────────────────────────────────────────────

export function ShippingPage() {
  useSEO({
    title: "Shipping Info — Delivery Times & Tracking",
    description: "Learn about PsychedBox shipping times, processing windows, tracking, and international delivery options.",
    canonical: "/shipping-info",
  });

  return (
    <PageShell eyebrow="Support" title="Shipping Info" description="Everything you need to know about processing times, delivery windows, and tracking your PsychedBox.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={Package} title="Processing Time" description="Orders are usually processed in 2–4 business days before leaving our fulfillment center." />
        <InfoCard icon={Truck} title="Delivery Window" description="Standard deliveries typically arrive within 5–10 business days after shipment." />
        <InfoCard icon={Mail} title="Tracking" description="A tracking link is emailed as soon as your order ships so you can follow each step of the journey." />
        <InfoCard icon={Heart} title="International Shipping" description="Availability varies by destination and local carrier support. Rates and delivery windows are shown at checkout." />
      </div>
    </PageShell>
  );
}

export function ReturnsPage() {
  useSEO({
    title: "Returns & Refunds — PsychedBox Support",
    description: "Need to return or report an issue with your PsychedBox? Learn about our returns process and how to contact our support team.",
    canonical: "/returns",
  });

  return (
    <PageShell eyebrow="Support" title="Returns" description="We want every member to love their box. If something's wrong, we'll make it right.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <InfoCard icon={RotateCcw} title="Damaged or Missing Items" description="If your box arrives damaged or with missing items, contact us at support@psychedbox.com within 14 days of delivery and we'll send a replacement." />
        <InfoCard icon={Package} title="Wrong Item Received" description="If you received the wrong item, let us know and we'll ship the correct one at no extra cost." />
        <InfoCard icon={HelpCircle} title="Subscription Cancellations" description="You can cancel your subscription any time from your account settings before the next renewal date. Boxes already shipped are non-refundable." />
        <InfoCard icon={Mail} title="Contact Support" description="For all return and refund requests: support@psychedbox.com. We respond within 1–2 business days." />
      </div>
      <div style={{ backgroundColor: "#FFF5F5", borderColor: "#FF6B6B" }} className="rounded-xl border p-6">
        <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold">Please note:</span> Due to the custom and perishable nature of our boxes, we cannot accept returns of opened or used items. We evaluate all issues on a case-by-case basis and always aim to find a fair resolution.</p>
      </div>
    </PageShell>
  );
}

// ─── Legal ────────────────────────────────────────────────────────────────────

export function PrivacyPage() {
  useSEO({
    title: "Privacy Policy — PsychedBox",
    description: "Read PsychedBox's privacy policy to understand how we collect, use, and protect your personal information.",
    canonical: "/privacy-policy",
    noIndex: true,
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <section style={{ backgroundColor: "#1a1a1a" }} className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-semibold">Legal</p>
          <h1 className="text-white text-4xl font-black mb-3">Privacy Policy</h1>
          <p className="text-white/60 text-sm">Last updated: February 2026</p>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <LegalSection title="1. Introduction">
            <p>PsychedBox ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and subscribe to our services. Please read this policy carefully.</p>
          </LegalSection>

          <LegalSection title="2. Information We Collect">
            <p><strong>Personal Information:</strong> When you subscribe or create an account, we collect your name, email address, shipping address, and payment information (processed securely through our payment provider).</p>
            <p><strong>Usage Data:</strong> We may collect information about how you interact with our website, including pages visited, time spent, and referral sources, to improve our service.</p>
            <p><strong>Communications:</strong> If you contact us, we retain the content of your messages to respond and improve our support.</p>
          </LegalSection>

          <LegalSection title="3. How We Use Your Information">
            <p>We use your information to: process and fulfill your subscription orders; send shipping and order updates; communicate about your account; send marketing communications (with your consent); improve our website and services; and comply with legal obligations.</p>
          </LegalSection>

          <LegalSection title="4. Data Sharing">
            <p>We do not sell your personal information. We may share your data with trusted third-party service providers (payment processors, shipping carriers, email platforms) solely to operate our business. These providers are bound by confidentiality agreements.</p>
          </LegalSection>

          <LegalSection title="5. Cookies">
            <p>We use cookies and similar tracking technologies to enhance your experience and analyze site traffic. You can control cookie preferences through your browser settings.</p>
          </LegalSection>

          <LegalSection title="6. Data Retention">
            <p>We retain your personal information for as long as your account is active or as needed to provide services and comply with legal obligations. You may request deletion of your data at any time by contacting support@psychedbox.com.</p>
          </LegalSection>

          <LegalSection title="7. Your Rights">
            <p>Depending on your location, you may have the right to access, correct, or delete your personal data; opt out of marketing communications; and data portability. To exercise any of these rights, contact us at support@psychedbox.com.</p>
          </LegalSection>

          <LegalSection title="8. Security">
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </LegalSection>

          <LegalSection title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.</p>
          </LegalSection>

          <LegalSection title="10. Contact">
            <p>For privacy-related questions: <strong>support@psychedbox.com</strong></p>
          </LegalSection>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export function TermsPage() {
  useSEO({
    title: "Terms of Service — PsychedBox",
    description: "Review the terms and conditions that apply to your PsychedBox subscription and use of our website.",
    canonical: "/terms-of-service",
    noIndex: true,
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <section style={{ backgroundColor: "#1a1a1a" }} className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-semibold">Legal</p>
          <h1 className="text-white text-4xl font-black mb-3">Terms of Service</h1>
          <p className="text-white/60 text-sm">Last updated: February 2026</p>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Substance Disclaimer — prominent */}
          <div style={{ backgroundColor: "#FFF5F5", borderColor: "#FF6B6B", borderWidth: "2px" }} className="rounded-xl border p-6 mb-10">
            <div className="flex items-start gap-3">
              <ShieldAlert size={24} style={{ color: "#FF6B6B" }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-gray-900 text-lg mb-2">Important Disclaimer — Substance Use</p>
                <p className="text-gray-700 leading-relaxed">
                  PsychedBox is an art, education, and community platform. <strong>We do not promote, condone, encourage, or facilitate the use of any illegal substances.</strong> Our content is cultural, artistic, and educational in nature. Nothing on this website or within any PsychedBox product should be construed as advice, encouragement, or instruction regarding the use of controlled substances. By using this site and subscribing to our services, you acknowledge and agree to this.
                </p>
              </div>
            </div>
          </div>

          <LegalSection title="1. Acceptance of Terms">
            <p>By accessing or using PsychedBox's website and services, you agree to be bound by these Terms of Service. If you do not agree, do not use our services. You must be at least 18 years of age to subscribe.</p>
          </LegalSection>

          <LegalSection title="2. Subscriptions & Billing">
            <p>PsychedBox offers monthly, quarterly, and annual subscription plans. By subscribing, you authorize us to charge your payment method on a recurring basis at the stated frequency. Prices are subject to change with advance notice.</p>
            <p>Subscriptions automatically renew unless cancelled before the renewal date. Cancellations take effect at the end of the current billing period.</p>
          </LegalSection>

          <LegalSection title="3. Shipping & Delivery">
            <p>We ship to addresses within supported regions. Delivery times are estimates and not guaranteed. PsychedBox is not responsible for delays caused by carriers or circumstances outside our control. Risk of loss passes to you upon handoff to the carrier.</p>
          </LegalSection>

          <LegalSection title="4. Returns & Refunds">
            <p>Due to the custom nature of our products, all sales are final. We will replace damaged or incorrect items at our discretion. Please review our Returns Policy for full details.</p>
          </LegalSection>

          <LegalSection title="5. Intellectual Property">
            <p>All content on this website — including puzzle artwork, written stories, imagery, and branding — is owned by PsychedBox or its licensors. You may not reproduce, distribute, or use our content without prior written permission.</p>
          </LegalSection>

          <LegalSection title="6. User Conduct">
            <p>You agree not to use our website or services for any unlawful purpose, to submit false information, to interfere with the operation of our platform, or to engage in any conduct that could harm PsychedBox, its members, or featured community partners.</p>
          </LegalSection>

          <LegalSection title="7. Substance Use Disclaimer">
            <p><strong>PsychedBox does not promote, condone, or encourage the use of any illegal substances.</strong> Our mission is rooted in art, education, harm reduction awareness, and community connection. All featured content is provided for cultural and educational purposes only. We do not provide medical, therapeutic, or legal advice. Always consult qualified professionals for any health-related decisions.</p>
          </LegalSection>

          <LegalSection title="8. Limitation of Liability">
            <p>To the fullest extent permitted by law, PsychedBox shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid for your most recent subscription period.</p>
          </LegalSection>

          <LegalSection title="9. Governing Law">
            <p>These Terms are governed by the laws of the United States. Any disputes shall be resolved through binding arbitration or in the courts of competent jurisdiction.</p>
          </LegalSection>

          <LegalSection title="10. Changes to Terms">
            <p>We reserve the right to update these Terms at any time. Continued use of our services after changes constitutes acceptance of the updated Terms.</p>
          </LegalSection>

          <LegalSection title="11. Contact">
            <p>For questions about these Terms: <strong>support@psychedbox.com</strong></p>
          </LegalSection>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
