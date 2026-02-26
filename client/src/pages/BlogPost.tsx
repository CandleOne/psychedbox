import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { Clock, ArrowLeft, ChevronRight } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { useJsonLd } from "@/hooks/useJsonLd";
import { getPostBySlug, blogPosts, type ContentBlock, type BlogPost as BlogPostType } from "@/data/blog-posts";
import NotFound from "./NotFound";
import axios from "axios";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Content Block Renderer ──────────────────────────────────────────────────

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-gray-700 text-lg leading-relaxed mb-6">{block.text}</p>;
    case "heading":
      return <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{block.text}</h2>;
    case "subheading":
      return <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">{block.text}</h3>;
    case "image":
      return (
        <figure className="my-8">
          <img src={block.src} alt={block.alt} className="w-full rounded-lg" loading="lazy" />
          {block.caption && <figcaption className="text-gray-400 text-sm text-center mt-2">{block.caption}</figcaption>}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-[#FF6B6B] pl-6 my-8">
          <p className="text-gray-700 text-lg italic leading-relaxed">{block.text}</p>
          {block.attribution && (
            <footer className="text-gray-400 text-sm mt-2">— {block.attribution}</footer>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-2 mb-6 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-gray-700 text-lg leading-relaxed">
              <span style={{ color: "#FF6B6B" }} className="font-bold mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

// ─── Related Posts ───────────────────────────────────────────────────────────

function RelatedPosts({ currentSlug, category }: { currentSlug: string; category: string }) {
  const related = blogPosts
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.category === category || p.tags.some((t) => blogPosts.find((bp) => bp.slug === currentSlug)?.tags.includes(t)))
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-16 px-6" style={{ backgroundColor: "#F0F0F0" }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                <img src={post.image} alt={post.imageAlt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#FF6B6B] transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-xs mt-2">{formatDate(post.date)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog Post Page ─────────────────────────────────────────────────────────

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const localPost = slug ? getPostBySlug(slug) : undefined;
  const [post, setPost] = useState<BlogPostType | undefined>(localPost);
  const [loading, setLoading] = useState(!localPost && !!slug);

  // Try fetching from API; fall back to hardcoded data
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    axios
      .get<{ post: BlogPostType }>(`/api/blog/${slug}`)
      .then(({ data }) => {
        if (!cancelled && data.post) setPost(data.post);
      })
      .catch(() => {
        // API unavailable — keep local post
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  // Always call hooks, but with fallback values when post is missing
  useSEO({
    title: post?.title ?? "Post Not Found",
    description: post?.description ?? "",
    canonical: post ? `/blog/${post.slug}` : undefined,
    ogType: "article",
    ogImage: post?.image,
  });

  useJsonLd(
    post
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          author: {
            "@type": "Person",
            name: post.author,
          },
          publisher: {
            "@type": "Organization",
            name: "PsychedBox",
            url: "https://psychedbox.com",
            logo: {
              "@type": "ImageObject",
              url: "https://psychedbox.com/og-image.jpg",
            },
          },
          image: post.image,
          url: `https://psychedbox.com/blog/${post.slug}`,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://psychedbox.com/blog/${post.slug}`,
          },
          articleSection: post.category,
          keywords: post.tags.join(", "),
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://psychedbox.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://psychedbox.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://psychedbox.com/blog/${post.slug}`,
              },
            ],
          },
        }
      : {}
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]" />
        </div>
      </div>
    );
  }

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden bg-gray-100 relative">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 -mt-16 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-white/80 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Meta */}
          <span
            className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white mb-4"
            style={{
              backgroundColor:
                ({
                  "Harm Reduction": "#059669",
                  Community: "#7C3AED",
                  "Art & Culture": "#FF6B6B",
                  Ceremony: "#D97706",
                  Wellness: "#2563EB",
                  News: "#475569",
                } as Record<string, string>)[post.category] ?? "#475569",
            }}
          >
            {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-8 pb-8 border-b border-gray-100">
            <span>By {post.author}</span>
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.readTime}
            </span>
          </div>

          {/* Body */}
          <div className="prose-lg">
            {post.body.map((block, i) => (
              <RenderBlock key={i} block={block} />
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#FF6B6B] transition-colors"
            >
              <ArrowLeft size={16} /> Back to all articles
            </a>
          </div>
        </div>
      </article>

      {/* Related */}
      <div className="mt-16">
        <RelatedPosts currentSlug={post.slug} category={post.category} />
      </div>

      <SiteFooter />
    </div>
  );
}
