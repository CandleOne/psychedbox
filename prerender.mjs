/**
 * prerender.mjs
 * Runs after `vite build` — writes a unique index.html per route
 * with baked-in title, meta description, OG, and Twitter Card tags.
 * No SSR, no Puppeteer. Pure static injection.
 *
 * Blog posts are read dynamically from the SQLite database so every
 * published post automatically gets a prerendered page with proper
 * SEO metadata and crawlable body content.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "dist/public");
const BASE_HTML = path.join(DIST, "index.html");
const SITE_URL = "https://psychedbox.com";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const SITE_NAME = "PsychedBox";
const DB_PATH = path.resolve(__dirname, "data", "psychedbox.db");

// ─── Route definitions ───────────────────────────────────────────────────────
const routes = [
  {
    path: "/",
    title: `${SITE_NAME} — Monthly Immersive Art Subscription`,
    description:
      "PsychedBox delivers a monthly puzzle portrait of an inspiring psychedelic community member, curated goodies, and their story — straight to your door. Subscribe from $29/mo.",
  },
  {
    path: "/movement",
    title: `The Movement — ${SITE_NAME}`,
    description:
      "PsychedBox donates 10% of revenues to psychedelic harm reduction, education, and equity partners including The Zendo Project, DanceSafe, and Heroic Hearts Project.",
  },
  {
    path: "/shop",
    title: `Shop — Psychedelic Art, Tools & Ceremony Supplies | ${SITE_NAME}`,
    description:
      "Shop the PsychedBox catalog — ceremony eye masks, integration journals, artist grinders, harm reduction test kits, enamel pins, playing cards, grow kits, and more. Built for the psychedelic community.",
  },
  {
    path: "/shop/monthly-boxes",
    title: `Monthly Subscription Boxes — ${SITE_NAME}`,
    description:
      "Subscribe to PsychedBox and receive a monthly puzzle portrait of an inspiring psychedelic community member, curated themed goodies, and their story. Plans from $29/mo.",
  },
  {
    path: "/shop/gift-subscriptions",
    title: `Gift a PsychedBox Subscription — Unique Psychedelic Art Gift`,
    description:
      "Give the gift of discovery. PsychedBox gift subscriptions include monthly puzzle art, community stories, and curated goodies. A truly unique gift for any occasion.",
  },
  {
    path: "/shop/past-puzzles",
    title: `Past Puzzle Drops — ${SITE_NAME}`,
    description:
      "Browse past PsychedBox puzzle portraits featuring inspiring members of the psychedelic community. Revisit their stories and explore previous monthly drops.",
  },
  {
    path: "/community/member-gallery",
    title: `Member Gallery — ${SITE_NAME}`,
    description:
      "See how PsychedBox members are completing and displaying their puzzle portraits. A gallery of community creativity and connection.",
  },
  {
    path: "/community/stories",
    title: `Community Stories — ${SITE_NAME}`,
    description:
      "Read first-person stories from psychedelic community members featured in PsychedBox. Journeys of healing, advocacy, art, and transformation.",
  },
  {
    path: "/community/events",
    title: `Events — ${SITE_NAME}`,
    description:
      "Find upcoming PsychedBox community events, member circles, and psychedelic culture gatherings near you.",
  },
  {
    path: "/about/our-mission",
    title: `Our Mission — ${SITE_NAME}`,
    description:
      "PsychedBox exists to educate and connect the psychedelic community through art and storytelling — while giving back to partners advancing harm reduction and equity.",
  },
  {
    path: "/about/how-it-works",
    title: `How It Works — ${SITE_NAME}`,
    description:
      "Learn how PsychedBox works: we curate a monthly community story, ship a puzzle box with themed goodies, and donate 10% of revenues to movement partners.",
  },
  {
    path: "/about-us",
    title: `About Us — ${SITE_NAME}`,
    description:
      "PsychedBox blends art, storytelling, and community care to make the psychedelic movement more human, informed, and accessible.",
  },
  {
    path: "/contact",
    title: `Contact Us — ${SITE_NAME}`,
    description:
      "Get in touch with PsychedBox for subscription support, partnership inquiries, media requests, or general questions. We reply within 1–2 business days.",
  },
  {
    path: "/careers",
    title: `Careers — ${SITE_NAME}`,
    description:
      "Interested in building the psychedelic community through art and storytelling? Explore open roles and opportunities to work with PsychedBox.",
  },
  {
    path: "/faq",
    title: `FAQ — ${SITE_NAME}`,
    description:
      "Answers to common questions about PsychedBox subscriptions, shipping, gifting, cancellations, and our giveback program.",
  },
  {
    path: "/shipping-info",
    title: `Shipping Info — ${SITE_NAME}`,
    description:
      "Learn about PsychedBox shipping times, processing windows, tracking, and international delivery options.",
  },
  {
    path: "/returns",
    title: `Returns & Refunds — ${SITE_NAME}`,
    description:
      "Need to return or report an issue with your PsychedBox? Learn about our returns process and how to contact our support team.",
  },
  {
    path: "/blog",
    title: `Blog — Guides on Psychedelic Harm Reduction, Ceremony, Art & Wellness | ${SITE_NAME}`,
    description:
      "Guides, stories, and insights on psychedelic harm reduction, ceremony, art, community, and wellness from the PsychedBox team.",
  },
  // Blog post routes are loaded dynamically from the database below
  {
    path: "/login",
    title: `Log In — ${SITE_NAME}`,
    description: "Log in to your PsychedBox account to manage your subscription, view orders, and access exclusive content.",
    noIndex: true,
  },
  {
    path: "/signup",
    title: `Sign Up — ${SITE_NAME}`,
    description: "Create your PsychedBox account to subscribe, shop, and join the psychedelic art community.",
    noIndex: true,
  },
  {
    path: "/forgot-password",
    title: `Forgot Password — ${SITE_NAME}`,
    description: "Reset your PsychedBox account password. Enter your email and we'll send you a reset link.",
    noIndex: true,
  },
  {
    path: "/reset-password",
    title: `Reset Password — ${SITE_NAME}`,
    description: "Set a new password for your PsychedBox account.",
    noIndex: true,
  },
  {
    path: "/verify-email",
    title: `Verify Email — ${SITE_NAME}`,
    description: "Verify your email address to complete your PsychedBox account setup.",
    noIndex: true,
  },
  {
    path: "/privacy-policy",
    title: `Privacy Policy — ${SITE_NAME}`,
    description: "Read PsychedBox's privacy policy to understand how we collect, use, and protect your personal information.",
    noIndex: true,
  },
  {
    path: "/terms-of-service",
    title: `Terms of Service — ${SITE_NAME}`,
    description:
      "Review the terms and conditions that apply to your PsychedBox subscription and use of our website.",
    noIndex: true,
  },
];

// ─── Static body content for SEO crawlers ────────────────────────────────────
// Injected as visible HTML before #root. React will hide it on mount via the
// "seo-fallback" container. Crawlers that don't run JS see real headings,
// text, and internal links — solving H1, heading, word-count, and link errors.
//
// Static pages have hand-written SEO content below.
// Blog posts are generated automatically from their DB body content.

const seoContent = {
  "/": `
    <h1>PsychedBox — Monthly Psychedelic Art &amp; Story Subscription Box</h1>
    <p>PsychedBox delivers a monthly puzzle portrait of an inspiring psychedelic community member, curated goodies, and their story — straight to your door.</p>
    <h2>What's Inside Every Box</h2>
    <ul><li>Unique puzzle portrait</li><li>Their story</li><li>Themed goodies</li><li>Exclusive community access</li></ul>
    <h2>Choose Your Plan</h2>
    <p>Monthly $29/mo · Quarterly $79/quarter · Annual $299/year</p>
    <nav><a href="/shop/monthly-boxes">Subscribe Now</a> · <a href="/movement">Learn About the Movement</a> · <a href="/blog">Read Our Blog</a> · <a href="/pricing">View Pricing</a> · <a href="/shop">Shop All Products</a> · <a href="/about/how-it-works">How It Works</a></nav>`,

  "/blog": null, // Generated dynamically below from DB posts

  "/movement": `
    <h1>The Movement — Psychedelic Education, Harm Reduction &amp; Community</h1>
    <p>PsychedBox donates 10% of revenues to psychedelic harm reduction, education, and equity partners including The Zendo Project, DanceSafe, Heroic Hearts Project, and Fireside Project.</p>
    <h2>Our Partners</h2>
    <ul><li>The Zendo Project — psychedelic peer support at events</li><li>DanceSafe — drug checking and harm reduction</li><li>Heroic Hearts Project — psychedelic therapy for veterans</li><li>Fireside Project — free psychedelic peer support hotline</li></ul>
    <nav><a href="/">Home</a> · <a href="/blog">Blog</a> · <a href="/shop/monthly-boxes">Subscribe</a> · <a href="/pricing">Pricing</a></nav>`,

  "/pricing": `
    <h1>PsychedBox Pricing — Choose Your Subscription Plan</h1>
    <p>Every box delivers a unique puzzle portrait, themed goodies, and the story of an inspiring community member.</p>
    <h2>Subscription Plans</h2>
    <ul><li>Monthly — $29/mo</li><li>Quarterly — $79/quarter (save 10%)</li><li>Annual — $299/year (save 15%)</li></ul>
    <h2>One-Time Options</h2>
    <ul><li>Gift Box — $39</li><li>Donation — support psychedelic education</li></ul>
    <nav><a href="/">Home</a> · <a href="/shop/monthly-boxes">Subscribe</a> · <a href="/blog">Blog</a> · <a href="/movement">The Movement</a></nav>`,

  "/shop": `
    <h1>Shop — Psychedelic Art, Tools &amp; Ceremony Supplies</h1>
    <p>Curated tools for the conscious explorer. New drops every month.</p>
    <nav><a href="/">Home</a> · <a href="/shop/monthly-boxes">Monthly Boxes</a> · <a href="/blog">Blog</a> · <a href="/pricing">Pricing</a> · <a href="/movement">The Movement</a></nav>`,

  "/shop/monthly-boxes": `
    <h1>Monthly Subscription Boxes — Psychedelic Puzzle Art &amp; Goodies</h1>
    <p>Subscribe to PsychedBox and receive a monthly puzzle portrait of an inspiring psychedelic community member, curated themed goodies, and their story.</p>
    <h2>Plans</h2>
    <ul><li>Monthly — $29/mo</li><li>Quarterly — $79/quarter</li><li>Annual — $299/year</li></ul>
    <nav><a href="/">Home</a> · <a href="/shop">Shop</a> · <a href="/blog">Blog</a> · <a href="/pricing">Pricing</a> · <a href="/movement">The Movement</a></nav>`,
};

// ─── HTML tag builder ─────────────────────────────────────────────────────────
function buildMetaBlock({ path: routePath, title, description, noIndex, ogImage, ogType }) {
  const canonical = `${SITE_URL}${routePath}`;
  const robots = noIndex ? "noindex, nofollow" : "index, follow";
  const image = ogImage || OG_IMAGE;
  const type = ogType || "website";
  return `
    <title>${title}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@psychedbox" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />`.trim();
}

// ─── Escape HTML entities in meta content ─────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── Build JSON-LD structured data for blog posts ─────────────────────────────
function buildJsonLd(post) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "PsychedBox",
      url: "https://psychedbox.com",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.jpg` },
    },
    image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    articleSection: post.category,
    keywords: safeParse(post.tags, []).join(", "),
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// ─── Convert a blog post body (JSON blocks) into crawlable HTML ───────────────
function bodyToSeoHtml(post) {
  const body = safeParse(post.body, []);
  const dateStr = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  let html = `\n    <nav><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; ${escapeHtml(post.title)}</nav>`;
  html += `\n    <h1>${escapeHtml(post.title)}</h1>`;
  html += `\n    <p>By ${escapeHtml(post.author)} · ${dateStr} · ${escapeHtml(post.read_time)}</p>`;

  for (const block of body) {
    switch (block.type) {
      case "paragraph":
        html += `\n    <p>${escapeHtml(block.text)}</p>`;
        break;
      case "heading":
        html += `\n    <h2>${escapeHtml(block.text)}</h2>`;
        break;
      case "subheading":
        html += `\n    <h3>${escapeHtml(block.text)}</h3>`;
        break;
      case "image-text":
        html += `\n    <h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.text)}</p>`;
        break;
      case "quote":
        html += `\n    <blockquote><p>${escapeHtml(block.text)}</p>`;
        if (block.attribution) html += `<footer>— ${escapeHtml(block.attribution)}</footer>`;
        html += `</blockquote>`;
        break;
      case "list":
        html += `\n    <ul>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
        break;
    }
  }

  html += `\n    <nav><a href="/blog">Back to Blog</a> · <a href="/">Home</a> · <a href="/shop/monthly-boxes">Subscribe</a> · <a href="/movement">The Movement</a></nav>`;
  return html;
}

function safeParse(json, fallback) {
  if (Array.isArray(json)) return json;
  try { return JSON.parse(json); } catch { return fallback; }
}

// ─── Build static body content for SEO crawlers ──────────────────────────────
function buildSeoBody(routePath) {
  const content = seoContent[routePath];
  if (!content) return "";
  return `\n    <div id="seo-fallback" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden">${content}\n    </div>`;
}

// ─── Strip existing head tags we'll replace ───────────────────────────────────
function stripExistingMeta(html) {
  return html
    .replace(/<title>[^<]*<\/title>/gi, "")
    .replace(/<meta name="description"[^>]*>/gi, "")
    .replace(/<meta name="robots"[^>]*>/gi, "")
    .replace(/<link rel="canonical"[^>]*>/gi, "")
    .replace(/<meta property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta name="twitter:[^"]*"[^>]*>/gi, "");
}

// ─── Load blog posts from database ────────────────────────────────────────────
function loadBlogPosts() {
  if (!fs.existsSync(DB_PATH)) {
    console.warn(`⚠  Database not found at ${DB_PATH} — skipping dynamic blog prerender`);
    return [];
  }
  const db = new Database(DB_PATH, { readonly: true });
  const posts = db.prepare(
    `SELECT slug, title, description, category, tags, image, image_alt,
            author, read_time, body, created_at, updated_at
     FROM blog_posts WHERE published = 1 ORDER BY created_at DESC`
  ).all();
  db.close();
  return posts;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const baseHtml = fs.readFileSync(BASE_HTML, "utf-8");
const strippedHtml = stripExistingMeta(baseHtml);

// Load all published blog posts from DB
const blogPosts = loadBlogPosts();
console.log(`📝 Found ${blogPosts.length} published blog posts in database`);

// Generate dynamic route entries for each blog post
const blogRoutes = blogPosts.map(post => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} | ${SITE_NAME}`,
  description: post.description,
  ogImage: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
  ogType: "article",
}));

// Generate dynamic /blog listing SEO content
const blogListingArticles = blogPosts.map(post =>
  `<article><h3><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.description)}</p></article>`
).join("\n    ");
seoContent["/blog"] = `
    <h1>PsychedBox Blog — Psychedelic Harm Reduction, Art &amp; Community Guides</h1>
    <p>Guides, stories, and insights on psychedelic harm reduction, ceremony, art, community, and wellness from the PsychedBox team.</p>
    <h2>Latest Articles</h2>
    ${blogListingArticles}
    <nav><a href="/">Home</a> · <a href="/shop/monthly-boxes">Subscribe</a> · <a href="/movement">The Movement</a> · <a href="/pricing">Pricing</a> · <a href="/shop">Shop</a></nav>`;

// Generate dynamic SEO body content for each blog post
for (const post of blogPosts) {
  seoContent[`/blog/${post.slug}`] = bodyToSeoHtml(post);
}

// Merge static + dynamic routes
const allRoutes = [...routes, ...blogRoutes];

let count = 0;

for (const route of allRoutes) {
  const metaBlock = buildMetaBlock(route);
  const seoBody = buildSeoBody(route.path);

  // Find blog post for JSON-LD injection
  const blogPost = blogPosts.find(p => `/blog/${p.slug}` === route.path);
  const jsonLd = blogPost ? buildJsonLd(blogPost) : "";

  // Inject meta after <head>, JSON-LD before </head>, SEO body before #root
  let rendered = strippedHtml.replace(/<head>/, `<head>\n    ${metaBlock}`);
  if (jsonLd) {
    rendered = rendered.replace(/<\/head>/, `    ${jsonLd}\n  </head>`);
  }
  if (seoBody) {
    rendered = rendered.replace(/<div id="root">/, `${seoBody}\n    <div id="root">`);
  }

  // Write to dist/public/<route>/index.html
  const outDir =
    route.path === "/"
      ? DIST
      : path.join(DIST, ...route.path.split("/").filter(Boolean));

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), rendered, "utf-8");

  console.log(`✓ ${route.path}`);
  count++;
}

console.log(`\n✅ Prerendered ${count} routes into ${DIST}`);
