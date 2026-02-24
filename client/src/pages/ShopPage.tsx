import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

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
  image: string;
  variants?: string[];
  description: string;
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
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=400&fit=crop",
    variants: ["Silk Black", "Velvet Violet", "Cotton Cream", "Weighted Indigo"],
    description: "Weighted, blackout eye masks designed for ceremony, meditation, and deep inner work.",
  },
  {
    id: "integration-journal",
    name: "Integration Journal",
    tagline: "Process what you discover",
    price: "$28",
    category: "ceremony",
    badge: "New",
    badgeColor: "#7C3AED",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop",
    variants: ["Classic Guided", "Blank Canvas", "90-Day Deep Dive", "Microdose Log"],
    description: "Guided prompts for before, during, and after your experiences.",
  },
  {
    id: "singing-bowl",
    name: "Singing Bowl",
    tagline: "Set the tone. Literally.",
    price: "$38",
    priceFrom: true,
    category: "ceremony",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop",
    variants: ["Tibetan Brass 5\"", "Tibetan Brass 7\"", "Crystal Clear", "Crystal Rose"],
    description: "Hand-hammered Tibetan and crystal singing bowls for ceremony and sound healing.",
  },
  {
    id: "incense-bundle",
    name: "Sacred Smoke Bundle",
    tagline: "Scent as ceremony",
    price: "$18",
    category: "ceremony",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop",
    variants: ["Palo Santo", "Copal + Holder", "Nag Champa", "Dragon's Blood", "Blue Lotus", "Custom Blend"],
    description: "Premium incense and smoke bundles sourced from small producers.",
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
    image: "https://images.unsplash.com/photo-1584448082637-23d7d3283848?w=400&h=400&fit=crop",
    variants: ["Aluminum 4-piece", "Wood Lid Series", "Acrylic Clear", "Limited Artist Collab"],
    description: "4-piece aluminum grinders featuring rotating artist designs on the lid.",
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
    image: "https://images.unsplash.com/photo-1584515933487-779824d29609?w=400&h=400&fit=crop",
    variants: ["Ehrlich (LSD/Indoles)", "Hofmann (LSD/NBOMe)", "Mecke (MDMA/Opioids)", "Full Starter Set (3-pack)"],
    description: "Reagent test kits for harm reduction and substance verification.",
  },
  {
    id: "rolling-tray",
    name: "Artist Rolling Tray",
    tagline: "Your ritual deserves a stage",
    price: "$26",
    category: "tools",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop",
    variants: ["Small (7\"×5\")", "Medium (11\"×7\")", "Large (14\"×10\")"],
    description: "Metal rolling trays with full-coverage psychedelic art prints.",
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
    image: "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?w=400&h=400&fit=crop",
    variants: ["Lion's Mane", "Oyster (Blue)", "Oyster (Pink)", "Shiitake", "Reishi", "Mystery Variety"],
    description: "All-in-one gourmet mushroom grow kits. Legal everywhere. Yields 2–3 harvests.",
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
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop",
    variants: ["Mushroom Series", "Sacred Geometry", "Cosmic Eye", "Artist Collab", "Limited Edition"],
    description: "Hard enamel pins designed by independent psychedelic artists.",
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
    image: "https://images.unsplash.com/photo-1529480780361-4db4eb267204?w=400&h=400&fit=crop",
    variants: ["Sacred Geometry Deck", "Mushroom Kingdom", "Cosmic Horror", "Artist Series Vol. 1", "Tarot-Inspired"],
    description: "Fully illustrated 54-card decks featuring original psychedelic art.",
  },
  {
    id: "art-print",
    name: "Limited Art Print",
    tagline: "Original psychedelic art for your walls",
    price: "$22",
    priceFrom: true,
    category: "art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    variants: ["8\"×10\"", "11\"×14\"", "16\"×20\"", "Signed Edition"],
    description: "Museum-quality giclée prints from independent psychedelic artists.",
  },
  {
    id: "tapestry",
    name: "Psychedelic Tapestry",
    tagline: "Transform any space",
    price: "$44",
    priceFrom: true,
    category: "art",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    variants: ["Small (60\"×40\")", "Large (80\"×60\")", "Artist Series"],
    description: "Vibrant full-coverage tapestries featuring rotating psychedelic art.",
  },
  {
    id: "sticker-pack",
    name: "Sticker Pack",
    tagline: "Stick your vibe everywhere",
    price: "$10",
    category: "collectibles",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    variants: ["8-pack Mixed", "12-pack Artist Series", "Holographic Edition"],
    description: "Waterproof vinyl sticker packs featuring original psychedelic art.",
  },

  // WELLNESS
  {
    id: "crystal-set",
    name: "Crystal & Stone Set",
    tagline: "Grounded in the earth",
    price: "$26",
    priceFrom: true,
    category: "wellness",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
    variants: ["Amethyst Set", "Lapis Lazuli", "Smoky Quartz", "Labradorite", "Mystery Rotation"],
    description: "Curated crystal and stone sets sourced from ethical suppliers.",
  },
  {
    id: "candle",
    name: "Ceremony Candle",
    tagline: "Set the atmosphere",
    price: "$24",
    priceFrom: true,
    category: "wellness",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop",
    variants: ["Earthy (Cedar + Vetiver)", "Floral (Rose + Jasmine)", "Resinous (Frankincense + Myrrh)", "Sacred (Palo Santo + Copal)"],
    description: "Hand-poured soy wax candles in psychedelic-art-labeled jars.",
  },
  {
    id: "tea-ceremony-set",
    name: "Botanical Tea Set",
    tagline: "Ritual in a cup",
    price: "$42",
    category: "wellness",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
    variants: ["Kava Starter", "Blue Lotus Blend", "Cacao Ceremony", "Mushroom Adaptogen"],
    description: "Complete tea ceremony kits for kava, blue lotus, cacao, and adaptogenic mushroom teas.",
  },
];

// ─── Category Filter ─────────────────────────────────────────────────────────

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ceremony", label: "Ceremony" },
  { id: "tools", label: "Tools" },
  { id: "art", label: "Art" },
  { id: "collectibles", label: "Collectibles" },
  { id: "wellness", label: "Wellness" },
];

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? "");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <span 
          className="absolute top-3 left-3 z-10 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md"
          style={{ backgroundColor: product.badgeColor ?? "#FF6B6B" }}
        >
          {product.badge}
        </span>
      )}

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Quick Add on Hover */}
      <button
        className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-900 hover:text-white ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        onClick={() => alert(`Quick add: ${product.name}`)}
      >
        <ShoppingCart size={18} />
      </button>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{product.tagline}</p>
        
        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.variants.slice(0, 3).map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariant(v)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  selectedVariant === v 
                    ? 'border-gray-900 bg-gray-900 text-white' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {v}
              </button>
            ))}
            {product.variants.length > 3 && (
              <span className="text-xs text-gray-400 py-1">+{product.variants.length - 3}</span>
            )}
          </div>
        )}

        {/* Price & Add */}
        <div className="flex items-center justify-between">
          <p className="text-gray-900 font-black text-xl">
            {product.priceFrom && <span className="text-gray-400 text-sm font-normal mr-1">from</span>}
            {product.price}
          </p>
          <button
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
            onClick={() => alert(`Add to cart: ${product.name} — ${selectedVariant}`)}
          >
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
    description: "Shop the PsychedBox catalog — ceremony supplies, collectible art, harm reduction tools, and more.",
    canonical: "/shop",
  });

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gray-900 px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-4xl md:text-5xl font-black leading-tight mb-4">
            Shop
          </h1>
          <p className="text-gray-400 text-lg">
            Curated tools for the conscious explorer. New drops every month.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[52px] z-30 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">{filtered.length} products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
