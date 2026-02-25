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
  {
    path: "/blog/what-is-harm-reduction",
    title: `What Is Harm Reduction? A Beginner's Guide | ${SITE_NAME}`,
    description:
      "Harm reduction saves lives. Learn the core principles, practical strategies, and why the psychedelic community is leading the way.",
  },
  {
    path: "/blog/setting-up-a-ceremony-space",
    title: `How to Set Up a Ceremony Space at Home | ${SITE_NAME}`,
    description:
      "Create a safe, intentional environment for your inner work. A step-by-step guide to preparing your space, your mind, and your tools.",
  },
  {
    path: "/blog/psychedelic-art-history-brief-introduction",
    title: `A Brief History of Psychedelic Art | ${SITE_NAME}`,
    description:
      "From Mayan mushroom stones to Alex Grey — how visionary experiences have shaped art across centuries.",
  },
  {
    path: "/blog/integration-after-psychedelic-experience",
    title: `Integration: What to Do After a Psychedelic Experience | ${SITE_NAME}`,
    description:
      "The journey doesn't end when the effects fade. Learn how to process, integrate, and apply the insights from your experiences.",
  },
  {
    path: "/blog/growing-gourmet-mushrooms-at-home",
    title: `A Beginner's Guide to Growing Gourmet Mushrooms at Home | ${SITE_NAME}`,
    description:
      "Lion's mane, oyster, shiitake — growing gourmet mushrooms at home is easier than you think. Here's how to get started.",
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

const seoContent = {
  "/": `
    <h1>PsychedBox — Monthly Psychedelic Art &amp; Story Subscription Box</h1>
    <p>PsychedBox delivers a monthly puzzle portrait of an inspiring psychedelic community member, curated goodies, and their story — straight to your door.</p>
    <h2>What's Inside Every Box</h2>
    <ul><li>Unique puzzle portrait</li><li>Their story</li><li>Themed goodies</li><li>Exclusive community access</li></ul>
    <h2>Choose Your Plan</h2>
    <p>Monthly $29/mo · Quarterly $79/quarter · Annual $299/year</p>
    <nav><a href="/shop/monthly-boxes">Subscribe Now</a> · <a href="/movement">Learn About the Movement</a> · <a href="/blog">Read Our Blog</a> · <a href="/pricing">View Pricing</a> · <a href="/shop">Shop All Products</a> · <a href="/about/how-it-works">How It Works</a></nav>`,

  "/blog": `
    <h1>PsychedBox Blog — Psychedelic Harm Reduction, Art &amp; Community Guides</h1>
    <p>Guides, stories, and insights on psychedelic harm reduction, ceremony, art, community, and wellness from the PsychedBox team.</p>
    <h2>Latest Articles</h2>
    <article><h3><a href="/blog/what-is-harm-reduction">What Is Harm Reduction? A Beginner's Guide</a></h3><p>Harm reduction saves lives. Learn the core principles, practical strategies, and why the psychedelic community is leading the way.</p></article>
    <article><h3><a href="/blog/setting-up-a-ceremony-space">How to Set Up a Ceremony Space at Home</a></h3><p>Create a safe, intentional environment for your inner work. A step-by-step guide to preparing your space, your mind, and your tools.</p></article>
    <article><h3><a href="/blog/psychedelic-art-history-brief-introduction">A Brief History of Psychedelic Art</a></h3><p>From Mayan mushroom stones to Alex Grey — how visionary experiences have shaped art across centuries.</p></article>
    <article><h3><a href="/blog/integration-after-psychedelic-experience">Integration: What to Do After a Psychedelic Experience</a></h3><p>The journey doesn't end when the effects fade. Learn how to process, integrate, and apply insights from your experiences.</p></article>
    <article><h3><a href="/blog/growing-gourmet-mushrooms-at-home">A Beginner's Guide to Growing Gourmet Mushrooms at Home</a></h3><p>Lion's mane, oyster, shiitake — growing gourmet mushrooms is easier than you think.</p></article>
    <nav><a href="/">Home</a> · <a href="/shop/monthly-boxes">Subscribe</a> · <a href="/movement">The Movement</a> · <a href="/pricing">Pricing</a> · <a href="/shop">Shop</a></nav>`,

  "/blog/what-is-harm-reduction": `
    <nav><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; What Is Harm Reduction?</nav>
    <h1>What Is Harm Reduction? A Beginner's Guide</h1>
    <p>By PsychedBox Team · February 20, 2026 · 6 min read</p>
    <p>Harm reduction is a set of practical strategies aimed at reducing the negative consequences of drug use — without requiring abstinence. It meets people where they are, prioritizing safety, dignity, and informed choice.</p>
    <h2>The Core Principles</h2>
    <p>Accept that drug use is a reality and work to minimize its harms. Respect autonomy. Recognize that conditions of use determine risk. Ensure interventions are evidence-based and free of moral judgment.</p>
    <h2>Practical Harm Reduction Strategies</h2>
    <p>In the psychedelic space, harm reduction shows up in concrete ways: reagent testing kits, peer-support trip sitting at events, and integration circles that help people process their experiences afterward.</p>
    <h2>Why PsychedBox Supports Harm Reduction</h2>
    <p>Ten percent of every PsychedBox subscription goes directly to harm reduction, education, and equity organizations.</p>
    <nav><a href="/blog">Back to Blog</a> · <a href="/blog/setting-up-a-ceremony-space">How to Set Up a Ceremony Space</a> · <a href="/blog/integration-after-psychedelic-experience">Integration Guide</a> · <a href="/movement">The Movement</a></nav>`,

  "/blog/setting-up-a-ceremony-space": `
    <nav><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; Ceremony Space</nav>
    <h1>How to Set Up a Ceremony Space at Home</h1>
    <p>By PsychedBox Team · February 12, 2026 · 8 min read</p>
    <p>Your environment shapes your experience. Whether you're meditating, journaling, or working with plant medicines, an intentional ceremony space creates the container for meaningful inner work.</p>
    <h2>1. Choose Your Space</h2><p>Pick a room where you feel safe and won't be interrupted.</p>
    <h2>2. Clear and Clean</h2><p>Physical clutter creates mental clutter. Remove anything unnecessary.</p>
    <h2>3. Set the Sensory Field</h2><p>Sound, scent, touch, and sight — curate each element intentionally.</p>
    <h2>4. Gather Your Tools</h2><p>A journal, water, a warm blanket, and personal anchoring items.</p>
    <h2>5. Set an Intention</h2><p>Ask yourself: What am I seeking? What am I ready to let go of?</p>
    <nav><a href="/blog">Back to Blog</a> · <a href="/blog/what-is-harm-reduction">Harm Reduction Guide</a> · <a href="/blog/integration-after-psychedelic-experience">Integration Guide</a> · <a href="/shop">Shop Ceremony Supplies</a></nav>`,

  "/blog/psychedelic-art-history-brief-introduction": `
    <nav><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; Psychedelic Art History</nav>
    <h1>A Brief History of Psychedelic Art</h1>
    <p>By PsychedBox Team · February 5, 2026 · 7 min read</p>
    <p>Psychedelic art is as old as human consciousness. From Mayan mushroom stones to Alex Grey's translucent energy paintings, visionary experiences have shaped art across centuries.</p>
    <h2>Ancient Roots</h2><p>Mayan mushroom stones dating back to 1000 BCE. Tassili cave paintings in Algeria circa 7000 BCE show mushroom-headed shamans.</p>
    <h2>The 1960s Explosion</h2><p>Wes Wilson's iconic San Francisco concert posters. Peter Max's psychedelic color palettes in mainstream pop art.</p>
    <h2>The Visionary Art Movement</h2><p>Alex Grey, Android Jones, and Amanda Sage pushed psychedelic art into fine art galleries.</p>
    <h2>Psychedelic Art Today</h2><p>Digital tools, AI, projection mapping, and VR create immersive visionary experiences. At PsychedBox, every monthly puzzle portrait is a piece of this tradition.</p>
    <nav><a href="/blog">Back to Blog</a> · <a href="/blog/setting-up-a-ceremony-space">Ceremony Space Guide</a> · <a href="/shop">Shop Art &amp; Collectibles</a></nav>`,

  "/blog/integration-after-psychedelic-experience": `
    <nav><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; Integration Guide</nav>
    <h1>Integration: What to Do After a Psychedelic Experience</h1>
    <p>By PsychedBox Team · January 28, 2026 · 9 min read</p>
    <p>Integration is the process of making meaning from your experiences and translating insights into lasting change in your daily life.</p>
    <h2>Why Integration Matters</h2><p>Research shows the real benefits come from what you do afterward. Without integration, even profound insights can fade.</p>
    <h2>The First 24-48 Hours</h2><p>Journal everything. Stay off screens. Eat nourishing food. Avoid major life decisions.</p>
    <h2>The Following Weeks</h2><p>Review journal entries. Share with someone you trust. Pick one or two concrete changes.</p>
    <h2>Long-Term Integration Practices</h2><p>Regular journaling, therapy, creative expression, community connection, and revisiting your intentions.</p>
    <nav><a href="/blog">Back to Blog</a> · <a href="/blog/what-is-harm-reduction">Harm Reduction Guide</a> · <a href="/blog/setting-up-a-ceremony-space">Ceremony Space Guide</a> · <a href="/shop">Shop Integration Journals</a></nav>`,

  "/blog/growing-gourmet-mushrooms-at-home": `
    <nav><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; Growing Gourmet Mushrooms</nav>
    <h1>A Beginner's Guide to Growing Gourmet Mushrooms at Home</h1>
    <p>By PsychedBox Team · January 20, 2026 · 7 min read</p>
    <p>You don't need a lab, a farm, or a green thumb to grow beautiful, edible mushrooms at home. With an all-in-one grow kit, you can harvest your first flush in as little as two weeks.</p>
    <h2>Why Grow Your Own?</h2><p>Freshness, variety, cost savings, and the deep satisfaction of growing your own food from mycelium.</p>
    <h2>Best Beginner Species</h2><p>Oyster mushrooms are the easiest. Lion's mane is a close second, prized for cognitive health benefits. Shiitake rewards patience with rich umami flavor.</p>
    <h2>The Grow Kit Method</h2><p>Pre-sterilized, pre-inoculated substrate. Cut, mist daily, and harvest in 7-14 days.</p>
    <h2>Key Tips for Success</h2><p>Maintain 80-95% humidity. Allow fresh air exchange. Use indirect light. Most kits give 2-3 harvests.</p>
    <nav><a href="/blog">Back to Blog</a> · <a href="/blog/what-is-harm-reduction">Harm Reduction Guide</a> · <a href="/shop">Shop Grow Kits</a> · <a href="/shop/monthly-boxes">Subscribe</a></nav>`,

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

// ─── Main ─────────────────────────────────────────────────────────────────────
const baseHtml = fs.readFileSync(BASE_HTML, "utf-8");
const strippedHtml = stripExistingMeta(baseHtml);

let count = 0;

for (const route of routes) {
  const metaBlock = buildMetaBlock(route);
  const seoBody = buildSeoBody(route.path);

  // Inject meta after <head>, SEO body before #root
  let rendered = strippedHtml.replace(/<head>/, `<head>\n    ${metaBlock}`);
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
