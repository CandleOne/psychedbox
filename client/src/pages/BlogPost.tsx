import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { Clock, ArrowLeft, ChevronRight } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { useJsonLd } from "@/hooks/useJsonLd";
import { type ContentBlock, type BlogPost as BlogPostType } from "@/data/blog-posts";
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
    case "image-text":
      return (
        <div className="flex gap-5 my-8 items-start">
          <div className="flex-shrink-0">
            <img
              src={block.src}
              alt={block.alt}
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
              loading="lazy"
            />
            {(block.spotifyUrl || block.appleUrl) && (
              <div className="flex items-center justify-center gap-3 mt-2">
                {block.spotifyUrl && (
                  <a href={block.spotifyUrl} target="_blank" rel="noopener noreferrer" title="Listen on Spotify" className="opacity-70 hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                )}
                {block.appleUrl && (
                  <a href={block.appleUrl} target="_blank" rel="noopener noreferrer" title="Listen on Apple Podcasts" className="opacity-70 hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#9933CC" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.076 1.126 1.588 2.2 1.656 2.38l.036.085-.086.035c-.19.079-.964.384-1.313.518l-.076.03-.063-.06c-.479-.504-1.545-1.527-2.87-2.1-.93-.402-1.862-.567-2.855-.507-4.133.252-6.08 4.126-6.062 6.556.012 1.563.397 2.97 1.144 4.193.807 1.32 2.034 2.303 3.456 2.769.68.223 1.28.316 1.893.293.738-.028 1.455-.207 2.191-.547.85-.393 1.34-.894 1.34-.894l.063-.065.08.03c.348.13 1.097.43 1.298.516l.088.038-.046.082c-.109.195-.42.685-.814 1.1-.462.488-1.028.99-1.797 1.38-.935.476-1.994.718-3.147.72h-.016c-.93 0-1.86-.16-2.764-.477-1.34-.47-2.525-1.267-3.523-2.37C4.478 17.357 3.6 15.36 3.46 13.12c-.06-.96.01-1.953.205-2.895.376-1.814 1.22-3.38 2.441-4.526 1.47-1.38 3.412-2.13 5.76-2.13zm-.06 5.093c.702.003 1.37.345 1.705.94.167.295.24.636.216.99a1.68 1.68 0 01-.476 1.068c-.45.466-1.076.588-1.63.502a1.854 1.854 0 01-.997-.544 1.62 1.62 0 01-.441-1.096c-.012-.465.166-.9.487-1.222.357-.357.798-.547 1.136-.638zm-1.778 5.004l.034-.002h3.847l.034.002c.313.024.56.27.56.582v.002l-.522 5.998v.003a.587.587 0 01-.59.55h-.003l-2.804-.003h-.003a.587.587 0 01-.587-.55l-.525-5.999v-.003c0-.312.247-.558.56-.58z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{block.title}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{block.text}</p>
          </div>
        </div>
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
  const [related, setRelated] = useState<BlogPostType[]>([]);

  useEffect(() => {
    let cancelled = false;
    axios
      .get<{ posts: BlogPostType[] }>("/api/blog")
      .then(({ data }) => {
        if (!cancelled) {
          const filtered = data.posts
            .filter((p) => p.slug !== currentSlug)
            .filter((p) => p.category === category)
            .slice(0, 3);
          setRelated(filtered);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [currentSlug, category]);

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
  const [post, setPost] = useState<BlogPostType | undefined>(undefined);
  const [loading, setLoading] = useState(!!slug);

  // Fetch post from API
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
