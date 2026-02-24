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

  return (
    <article className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Art area */}
      <div
        className="flex items-center justify-center h-40 text-6xl select-none"
        style={{ backgroundColor: "#F7F3FF" }}
      >
        {product.emoji}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Badge */}
        {product.badge && (
          <span
            className="self-start text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3"
            style={{ backgroundColor: product.badgeColor ?? "#FF6B6B" }}
          >
            {product.badge}
          </span>
        )}

        <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{product.tagline}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{product.description}</p>

        {/* Variant selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">Variant</p>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400 bg-white"
            >
              {product.variants.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-gray-900 font-black text-xl">
            {product.priceFrom && <span className="text-gray-400 text-sm font-normal mr-1">from</span>}
            {product.price}
          </p>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FF6B6B" }}
            onClick={() => {
              // TODO: wire to Stripe checkout or cart
              alert(`Add to cart: ${product.name} — ${selectedVariant}`);
            }}
          >
            <ShoppingCart size={14} />
            Add to Cart
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
      <section style={{ backgroundColor: "#1a1a1a" }} className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-bold mb-4">The Catalog</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">
            Tools for the{" "}
            <span style={{ color: "#FF6B6B" }}>conscious explorer</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl">
            Ceremony supplies, collectible art, harm reduction tools, and more — curated for the psychedelic community. New drops every month.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-[52px] z-30 bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
              style={
                activeCategory === cat.id
                  ? { backgroundColor: "#FF6B6B", color: "#fff" }
                  : { backgroundColor: "#F3F4F6", color: "#374151" }
              }
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 text-sm mb-6">{filtered.length} products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Monthly drops CTA */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto rounded-2xl p-10 text-center" style={{ backgroundColor: "#F7F3FF" }}>
          <Zap size={32} className="mx-auto mb-4" style={{ color: "#7C3AED" }} />
          <h2 className="text-3xl font-black text-gray-900 mb-3">Get everything in one box</h2>
          <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
            Subscribe to PsychedBox and get a curated selection of these products — plus exclusive items — delivered every month.
          </p>
          <a
            href="/shop/monthly-boxes"
            className="inline-block px-8 py-4 rounded-xl text-white font-bold text-lg transition-opacity hover:opacity-90"
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
