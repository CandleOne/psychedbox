/**
 * prerender.mjs
 * Runs after `vite build` — writes a unique index.html per route
 * with baked-in title, meta description, OG, and Twitter Card tags.
 * No SSR, no Puppeteer. Pure static injection.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "dist/public");
const BASE_HTML = path.join(DIST, "index.html");
const SITE_URL = "https://psychedbox.com";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const SITE_NAME = "PsychedBox";

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

// ─── HTML tag builder ─────────────────────────────────────────────────────────
function buildMetaBlock({ path: routePath, title, description, noIndex }) {
  const canonical = `${SITE_URL}${routePath}`;
  const robots = noIndex ? "noindex, nofollow" : "index, follow";
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@psychedbox" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />`.trim();
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

// ─── Main ─────────────────────────────────────────────────────────────────────
const baseHtml = fs.readFileSync(BASE_HTML, "utf-8");
const strippedHtml = stripExistingMeta(baseHtml);

let count = 0;

for (const route of routes) {
  const metaBlock = buildMetaBlock(route);

  // Inject right after <head>
  const rendered = strippedHtml.replace(/<head>/, `<head>\n    ${metaBlock}`);

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
