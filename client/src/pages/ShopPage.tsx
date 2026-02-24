import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { ShoppingCart, Tag, Star, Zap } from "lucide-react";

// ─── Product Data ────────────────────────────────────────────────────────────

type Category = "all" | "ceremony" | "art" | "tools" | "wellness" | "collectibles";

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceFrom?: boolean;
  category: Category;
  badge?: string;
  badgeColor?: string;
  emoji: string;
  variants?: string[];
  description: string;
  comingSoon?: boolean;
}

const products: Product[] = [
  // CEREMONY
  {
    id: "eye-mask",
    name: "Ceremony Eye Mask",
    tagline: "Blackout comfort for deep journeys",
    price: "$24",
    category: "ceremony",
    badge: "Fan Favorite",
    badgeColor: "#FF6B6B",
    emoji: "🌑",
    variants: ["Silk Black", "Velvet Violet", "Cotton Cream", "Weighted Indigo"],
    description: "Weighted, blackout eye masks designed for ceremony, meditation, and deep inner work. Blocks 100% of light. Adjustable strap, breathable lining.",
  },
  {
    id: "integration-journal",
    name: "Integration Journal",
    tagline: "Process what you discover",
    price: "$28",
    category: "ceremony",
    badge: "New",
    badgeColor: "#7C3AED",
    emoji: "📓",
    variants: ["Classic Guided", "Blank Canvas", "90-Day Deep Dive", "Microdose Log"],
    description: "Guided prompts for before, during, and after your experiences. Different editions for different needs — from first-timers to seasoned explorers.",
  },
  {
    id: "singing-bowl",
    name: "Singing Bowl",
    tagline: "Set the tone. Literally.",
    price: "$38",
    priceFrom: true,
    category: "ceremony",
    emoji: "🔔",
    variants: ["Tibetan Brass 5\"", "Tibetan Brass 7\"", "Crystal Clear", "Crystal Rose"],
    description: "Hand-hammered Tibetan and crystal singing bowls for ceremony, sound healing, and grounding. Each one rings differently — find your frequency.",
  },
  {
    id: "incense-bundle",
    name: "Sacred Smoke Bundle",
    tagline: "Scent as ceremony",
    price: "$18",
    category: "ceremony",
    emoji: "🌿",
    variants: ["Palo Santo", "Copal + Holder", "Nag Champa", "Dragon's Blood", "Blue Lotus", "Custom Blend"],
    description: "Premium incense and smoke bundles sourced from small producers. Each pack includes 10–15 sticks or pieces, and optional hand-carved holders.",
  },

  // TOOLS
  {
    id: "herb-grinder",
    name: "Artist Series Grinder",
    tagline: "Every grind, a work of art",
    price: "$32",
    priceFrom: true,
    category: "tools",
    badge: "Monthly Drop",
    badgeColor: "#FF6B6B",
    emoji: "🎨",
    variants: ["Aluminum 4-piece", "Wood Lid Series", "Acrylic Clear", "Limited Artist Collab"],
    description: "4-piece aluminum grinders featuring rotating artist designs on the lid. Each month a new artist. Collect them all or just grab your favorite.",
  },
  {
    id: "reagent-kit",
    name: "Harm Reduction Test Kit",
    tagline: "Know before you go",
    price: "$22",
    priceFrom: true,
    category: "tools",
    badge: "Community Essential",
    badgeColor: "#059669",
    emoji: "🔬",
    variants: ["Ehrlich (LSD/Indoles)", "Hofmann (LSD/NBOMe)", "Mecke (MDMA/Opioids)", "Full Starter Set (3-pack)"],
    description: "Ehrlich, Hofmann, and Mecke reagent test kits for harm reduction and substance verification. Completely legal. Community-trusted. Know what you're working with.",
  },
  {
    id: "rolling-tray",
    name: "Artist Rolling Tray",
    tagline: "Your ritual deserves a stage",
    price: "$26",
    category: "tools",
    emoji: "🎭",
    variants: ["Small (7\"×5\")", "Medium (11\"×7\")", "Large (14\"×10\")"],
    description: "Metal rolling trays with full-coverage psychedelic art prints. Rotating artist designs. Curved edges, magnetic lid option, durable powder coat finish.",
  },
  {
    id: "mushroom-kit",
    name: "Gourmet Mushroom Grow Kit",
    tagline: "Grow something magical",
    price: "$34",
    priceFrom: true,
    category: "tools",
    badge: "🍄 Legal",
    badgeColor: "#854d0e",
    emoji: "🍄",
    variants: ["Lion's Mane", "Oyster (Blue)", "Oyster (Pink)", "Shiitake", "Reishi", "Mystery Variety"],
    description: "All-in-one gourmet mushroom grow kits. Legal everywhere. Yields 2–3 harvests. Perfect for kitchen counter growing, gifting, or getting into the cultivation mindset. No experience needed.",
  },

  // ART & COLLECTIBLES
  {
    id: "enamel-pins",
    name: "Enamel Pin",
    tagline: "Tiny art. Big statement.",
    price: "$14",
    priceFrom: true,
    category: "collectibles",
    badge: "Monthly Drop",
    badgeColor: "#FF6B6B",
    emoji: "📌",
    variants: ["Mushroom Series", "Sacred Geometry", "Cosmic Eye", "Artist Collab", "Limited Edition"],
    description: "Hard enamel pins designed by independent psychedelic artists. 1.25\" standard, butterfly clutch backing. New designs drop monthly. Collect the whole set.",
  },
  {
    id: "playing-cards",
    name: "Psychedelic Playing Cards",
    tagline: "Shuffle the cosmos",
    price: "$18",
    priceFrom: true,
    category: "collectibles",
    badge: "Collector's Item",
    badgeColor: "#7C3AED",
    emoji: "🃏",
    variants: ["Sacred Geometry Deck", "Mushroom Kingdom", "Cosmic Horror", "Artist Series Vol. 1", "Tarot-Inspired"],
    description: "Fully illustrated 54-card decks featuring original psychedelic art. Casino-grade card stock with linen finish. Each deck tells a visual story from Ace to King.",
  },
  {
    id: "art-print",
    name: "Limited Art Print",
    tagline: "Original psychedelic art for your walls",
    price: "$22",
    priceFrom: true,
    category: "art",
    emoji: "🖼️",
    variants: ["8\"×10\"", "11\"×14\"", "16\"×20\"", "Signed Edition"],
    description: "Museum-quality giclée prints from independent psychedelic artists. New artists featured monthly. Printed on heavyweight acid-free paper. Arrives ready to frame.",
  },
  {
    id: "tapestry",
    name: "Psychedelic Tapestry",
    tagline: "Transform any space",
    price: "$44",
    priceFrom: true,
    category: "art",
    emoji: "🌌",
    variants: ["Small (60\"×40\")", "Large (80\"×60\")", "Artist Series"],
    description: "Vibrant full-coverage tapestries featuring rotating psychedelic art. Machine-washable polyester microfiber. Hang rings included. Different artists each drop.",
  },
  {
    id: "sticker-pack",
    name: "Sticker Pack",
    tagline: "Stick your vibe everywhere",
    price: "$10",
    category: "collectibles",
    emoji: "✨",
    variants: ["8-pack Mixed", "12-pack Artist Series", "Holographic Edition"],
    description: "Waterproof vinyl sticker packs featuring original psychedelic art. UV-resistant, dishwasher-safe. Great for laptops, water bottles, and everywhere else you want to make a statement.",
  },

  // WELLNESS
  {
    id: "crystal-set",
    name: "Crystal & Stone Set",
    tagline: "Grounded in the earth",
    price: "$26",
    priceFrom: true,
    category: "wellness",
    emoji: "💎",
    variants: ["Amethyst Set", "Lapis Lazuli", "Smoky Quartz", "Labradorite", "Mystery Rotation"],
    description: "Curated crystal and stone sets sourced from ethical suppliers. Each set includes 3–5 stones with a card describing their traditional uses. New varieties rotate monthly.",
  },
  {
    id: "candle",
    name: "Ceremony Candle",
    tagline: "Set the atmosphere",
    price: "$24",
    priceFrom: true,
    category: "wellness",
    emoji: "🕯️",
    variants: ["Earthy (Cedar + Vetiver)", "Floral (Rose + Jasmine)", "Resinous (Frankincense + Myrrh)", "Sacred (Palo Santo + Copal)"],
    description: "Hand-poured soy wax candles in psychedelic-art-labeled jars. Scents designed to complement ceremony, meditation, and creative work. 40+ hour burn time.",
  },
  {
    id: "tea-ceremony-set",
    name: "Botanical Tea Set",
    tagline: "Ritual in a cup",
    price: "$42",
    category: "wellness",
    emoji: "🍵",
    variants: ["Kava Starter", "Blue Lotus Blend", "Cacao Ceremony", "Mushroom Adaptogen"],
    description: "Complete tea ceremony kits for kava, blue lotus, cacao, and adaptogenic mushroom teas. Includes strainer, scoop, blend, and a guide card. Everything you need to brew with intention.",
  },
];

// ─── Category Filter ─────────────────────────────────────────────────────────

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "All Products", emoji: "🌀" },
  { id: "ceremony", label: "Ceremony", emoji: "🌑" },
  { id: "tools", label: "Tools", emoji: "🔬" },
  { id: "art", label: "Art", emoji: "🖼️" },
  { id: "collectibles", label: "Collectibles", emoji: "📌" },
  { id: "wellness", label: "Wellness", emoji: "💎" },
];

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? "");
  const [isHovered, setIsHovered] = useState(false);

  // Gradient backgrounds per category
  const categoryGradients: Record<Category, string> = {
    ceremony: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    tools: "linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%)",
    art: "linear-gradient(135deg, #4a1942 0%, #2d1b4e 100%)",
    collectibles: "linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)",
    wellness: "linear-gradient(135deg, #1a2f1e 0%, #0f1f14 100%)",
    all: "linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%)",
  };

  return (
    <article 
      className="rounded-3xl bg-white overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Art area with gradient */}
      <div
        className="flex items-center justify-center h-48 text-7xl select-none relative overflow-hidden"
        style={{ background: categoryGradients[product.category] || categoryGradients.all }}
      >
        <span className={`transition-transform duration-500 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
          {product.emoji}
        </span>
        {/* Decorative orbs */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-purple-500/10 blur-lg" />
      </div>

      <div className="p-6 flex flex-col flex-1 relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        {/* Badge */}
        {product.badge && (
          <span
            className="self-start text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-lg"
            style={{ backgroundColor: product.badgeColor ?? "#FF6B6B" }}
          >
            {product.badge}
          </span>
        )}

        <h3 className="text-gray-900 font-bold text-xl leading-tight mb-2">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 font-medium">{product.tagline}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{product.description}</p>

        {/* Variant selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">Select</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.slice(0, 4).map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedVariant === v 
                      ? 'bg-gray-900 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v}
                </button>
              ))}
              {product.variants.length > 4 && (
                <span className="px-3 py-1.5 text-xs text-gray-400">+{product.variants.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <p className="text-gray-900 font-black text-2xl">
            {product.priceFrom && <span className="text-gray-400 text-sm font-normal mr-1">from</span>}
            {product.price}
          </p>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#FF6B6B" }}
            onClick={() => {
              alert(`Add to cart: ${product.name} — ${selectedVariant}`);
            }}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  useSEO({
    title: "Shop — Psychedelic Art, Tools & Ceremony Supplies | PsychedBox",
    description:
      "Shop the PsychedBox catalog — ceremony eye masks, integration journals, artist grinders, harm reduction test kits, enamel pins, playing cards, grow kits, and more. Built for the psychedelic community.",
    canonical: "/shop",
  });

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      {/* Hero */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900" />
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 40%),
                           radial-gradient(circle at 80% 50%, rgba(255, 107, 107, 0.3) 0%, transparent 40%)`,
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        
        <div className="max-w-5xl mx-auto relative">
          <p className="text-purple-300/60 text-xs uppercase tracking-[0.2em] font-bold mb-4">The Catalog</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">
            Tools for the{" "}
            <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">conscious explorer</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
            Ceremony supplies, collectible art, harm reduction tools, and more — curated for the psychedelic community. New drops every month.
          </p>
          
          {/* Stats */}
          <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-black text-white">16+</p>
              <p className="text-white/40 text-sm">Products</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">5</p>
              <p className="text-white/40 text-sm">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">Monthly</p>
              <p className="text-white/40 text-sm">New Drops</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-[52px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all hover:scale-105 active:scale-95"
              style={
                activeCategory === cat.id
                  ? { backgroundColor: "#FF6B6B", color: "#fff", boxShadow: "0 4px 15px rgba(255,107,107,0.3)" }
                  : { backgroundColor: "#F3F4F6", color: "#374151" }
              }
            >
              <span className="text-base">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.08) 0%, transparent 50%)`,
        }} />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 text-sm font-medium">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Ready to ship
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Monthly drops CTA */}
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="max-w-4xl mx-auto rounded-3xl p-10 md:p-14 text-center relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl" />
          
          <Zap size={40} className="mx-auto mb-6 text-amber-400" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative">Get everything in one box</h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto relative">
            Subscribe to PsychedBox and get a curated selection of these products — plus exclusive items — delivered every month.
          </p>
          <a
            href="/shop/monthly-boxes"
            className="inline-block px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-500/25"
            style={{ backgroundColor: "#FF6B6B" }}
          >
            View Subscription Plans
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
