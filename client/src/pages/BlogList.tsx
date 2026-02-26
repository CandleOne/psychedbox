import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import NewsletterForm from "@/components/NewsletterForm";
import { useSEO } from "@/hooks/useSEO";
import { useJsonLd } from "@/hooks/useJsonLd";
import { blogPosts as fallbackPosts, allCategories as fallbackCategories, type BlogCategory, type BlogPost } from "@/data/blog-posts";
import axios from "axios";

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "PsychedBox Blog",
  description:
    "Guides, stories, and insights on psychedelic harm reduction, ceremony, art, community, and wellness.",
  url: "https://psychedbox.com/blog",
  publisher: {
    "@type": "Organization",
    name: "PsychedBox",
    url: "https://psychedbox.com",
  },
  blogPost: fallbackPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    url: `https://psychedbox.com/blog/${post.slug}`,
    image: post.image,
  })),
};

const categoryColors: Record<BlogCategory, string> = {
  "Harm Reduction": "#059669",
  Community: "#7C3AED",
  "Art & Culture": "#FF6B6B",
  Ceremony: "#D97706",
  Wellness: "#2563EB",
  News: "#475569",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">(
    "All"
  );
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [categories, setCategories] = useState<BlogCategory[]>(fallbackCategories);

  // Try loading posts from the API; fall back to hardcoded data on failure
  useEffect(() => {
    let cancelled = false;
    axios
      .get<{ posts: BlogPost[] }>("/api/blog")
      .then(({ data }) => {
        if (!cancelled && data.posts.length > 0) {
          // Merge: API posts first, then any hardcoded posts not already present
          const apiSlugs = new Set(data.posts.map((p) => p.slug));
          const merged = [
            ...data.posts,
            ...fallbackPosts.filter((p) => !apiSlugs.has(p.slug)),
          ];
          setPosts(merged);
          const cats = Array.from(new Set(merged.map((p) => p.category))) as BlogCategory[];
          setCategories(cats);
        }
      })
      .catch(() => {
        // API unavailable (static hosting) — keep fallback data
      });
    return () => { cancelled = true; };
  }, []);

  useSEO({
    title: "Blog — Guides on Psychedelic Harm Reduction, Ceremony, Art & Wellness",
    description:
      "Guides, stories, and insights on psychedelic harm reduction, ceremony, art, community, and wellness from the PsychedBox team.",
    canonical: "/blog",
  });
  useJsonLd(blogListSchema);

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      {/* Hero */}
      <section
        style={{ backgroundColor: "#1a1a1a" }}
        className="px-6 py-16 md:py-20"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-4">
            Blog
          </p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">
            Guides, Stories &amp; Insights
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl">
            Harm reduction, ceremony, art history, and community wisdom — all in
            one place.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-[52px] z-30 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeCategory === "All"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Post Grid */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-500 text-sm mb-8">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </p>

          {/* Featured post (first) */}
          {filtered.length > 0 && (
            <a
              href={`/blog/${filtered[0].slug}`}
              className="group block mb-12"
            >
              <article className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={filtered[0].image}
                    alt={filtered[0].imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white mb-3"
                    style={{
                      backgroundColor:
                        categoryColors[filtered[0].category] ?? "#475569",
                    }}
                  >
                    {filtered[0].category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 group-hover:text-[#FF6B6B] transition-colors">
                    {filtered[0].title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {filtered[0].description}
                  </p>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span>{formatDate(filtered[0].date)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {filtered[0].readTime}
                    </span>
                  </div>
                </div>
              </article>
            </a>
          )}

          {/* Remaining posts */}
          {filtered.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.slice(1).map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article>
                    <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 mb-4">
                      <img
                        src={post.image}
                        alt={post.imageAlt}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white mb-2"
                      style={{
                        backgroundColor:
                          categoryColors[post.category] ?? "#475569",
                      }}
                    >
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FF6B6B] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-gray-400 text-xs">
                      <span>{formatDate(post.date)}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No posts in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section
        style={{ backgroundColor: "#F0F0F0" }}
        className="py-16 px-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Get New Posts in Your Inbox
          </h2>
          <p className="text-gray-600 mb-6">
            We publish guides, community stories, and harm reduction resources
            every week. Subscribe to stay informed.
          </p>
          <NewsletterForm source="blog" showIcon className="max-w-md mx-auto" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
