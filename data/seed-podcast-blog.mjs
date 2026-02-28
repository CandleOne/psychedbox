/**
 * Seed script: Insert the "Top Psychedelic Podcasts" blog post into the database.
 *
 * Usage:  node data/seed-podcast-blog.mjs
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "psychedbox.db");
const db = new Database(dbPath);

const slug = "top-psychedelic-podcasts-changing-the-narrative";
const title =
  "Pushing the Digital Envelope: How These Psychedelic Podcasts Are Changing the Narrative in Online Spaces";
const description =
  "From harm reduction to mycology entrepreneurship, these ten standout psychedelic podcasts are reshaping how we talk about consciousness, therapy, and culture online.";
const category = "Art & Culture";
const tags = JSON.stringify([
  "podcasts",
  "psychedelics",
  "media",
  "harm reduction",
  "therapy",
  "culture",
  "digital media",
]);
const image = "/uploads/psychedelic-podcasts-thumbnail.jpg";
const imageAlt =
  "Psychedelic podcast episode thumbnail featuring the Psychedelic Therapy Frontiers show";
const author = "PsychedBox Team";
const readTime = "12 min read";

const body = JSON.stringify([
  {
    type: "paragraph",
    text: "The psychedelic renaissance isn't just happening in labs and retreat centers — it's unfolding in your earbuds. A new wave of podcasters is pushing the digital envelope, bringing nuanced, evidence-informed, and deeply human conversations about psychedelics to audiences worldwide. These shows are doing more than filling airtime; they're actively reshaping public perception, dismantling decades-old stigma, and creating accessible entry points for the psychedelic-curious.",
  },
  {
    type: "paragraph",
    text: "Whether you're a researcher, a therapist, an entrepreneur, or someone simply trying to make sense of their own experiences, there's a podcast on this list for you. Here are our picks for the top psychedelic podcasts that are truly changing the narrative in online spaces.",
  },
  {
    type: "heading",
    text: "Our Top 10 Picks",
  },
  {
    type: "image-text",
    src: "/uploads/Psychedelics-Today---Show.jpg",
    alt: "Psychedelics Today podcast logo",
    title: "1. Psychedelics Today",
    text: "Founded by Joe Moore and Kyle Buller, Psychedelics Today is one of the longest-running and most respected voices in the space. The show covers everything from cutting-edge clinical research and policy developments to personal healing narratives and integration strategies. With hundreds of episodes in its archive and guests ranging from leading neuroscientists to indigenous practitioners, it has become a go-to resource for anyone serious about understanding the psychedelic landscape. Their educational platform, Vital, extends the conversation into structured coursework and professional training.",
    spotifyUrl: "https://open.spotify.com/show/3vRPGbzS7IeNeKBQtDwteu",
    appleUrl: "https://podcasts.apple.com/us/podcast/psychedelics-today/id1114398275",
  },
  {
    type: "image-text",
    src: "/uploads/Adventures-Through-The-Mind---Show.jpg",
    alt: "Adventures Through The Mind podcast logo",
    title: "2. Adventures Through The Mind",
    text: "Hosted by author and speaker James W. Jesso, Adventures Through The Mind blends psychology, philosophy, and psychedelic experience into long-form, deeply reflective conversations. Jesso's interviewing style is intimate and exploratory — less news-driven, more soul-searching. Episodes often dive into trauma, relationships, altered states of consciousness, and the ethics of the psychedelic movement. If you prefer depth over breadth and genuine introspection over soundbites, this podcast is a perfect fit.",
    spotifyUrl: "https://open.spotify.com/show/2CwfdCjRr3ng0DFjr5h2j0",
    appleUrl: "https://podcasts.apple.com/us/podcast/adventures-through-the-mind/id968927571",
  },
  {
    type: "image-text",
    src: "/uploads/Psychedelic-Therapy-Frontiers---Show.jpg",
    alt: "Psychedelic Therapy Frontiers podcast logo",
    title: "3. Psychedelic Therapy Frontiers",
    text: "Produced by the team at Novamind, Psychedelic Therapy Frontiers is laser-focused on the clinical side of psychedelic-assisted therapy. Hosted by Dr. Steve Thayer and Dr. Reid Robison, the show breaks down complex research papers, discusses therapeutic protocols, and explores the practical realities of bringing psychedelic medicine into mainstream healthcare. It's an essential listen for clinicians, therapists, and anyone interested in the medical applications of psilocybin, MDMA, and ketamine.",
    spotifyUrl: "https://open.spotify.com/show/6Sxtg0RCfcf3zT2nhLFIPB",
    appleUrl: "https://podcasts.apple.com/us/podcast/psychedelic-therapy-frontiers/id1573959330",
  },
  {
    type: "image-text",
    src: "/uploads/The-Psychedelic-Podcast---Show.jpg",
    alt: "The Psychedelic Podcast logo",
    title: "4. The Psychedelic Podcast",
    text: "From Third Wave, the organization dedicated to mainstream psychedelic education, The Psychedelic Podcast explores the intersection of psychedelics with leadership, creativity, and personal growth. Host Paul Austin brings a unique lens that bridges the worlds of microdosing, self-optimization, and conscious entrepreneurship. The show is particularly strong for listeners who are interested in how psychedelics can be integrated into professional and personal development rather than purely clinical contexts.",
    spotifyUrl: "https://open.spotify.com/search/The%20Psychedelic%20Podcast",
    appleUrl: "https://podcasts.apple.com/us/podcast/the-psychedelic-podcast/id1200537009",
  },
  {
    type: "image-text",
    src: "/uploads/Business-Trip---Show.jpg",
    alt: "Business Trip podcast logo",
    title: "5. Business Trip",
    text: "Hosted by Greg Kubin and Matias Serebrinsky, Business Trip is indispensable for those keeping an eye on the business side of the psychedelic renaissance. The podcast takes an unflinching look at the emerging psychedelic industry — from biotech startups and venture capital to regulatory hurdles and ethical debates around commercialization. It doesn't shy away from hard questions: Who profits from psychedelics going mainstream? How do we protect indigenous knowledge? What happens when Wall Street meets ayahuasca? This is essential listening for investors, founders, and critical observers alike.",
    spotifyUrl: "https://open.spotify.com/show/7spoB9PhenMRQTY538x4No",
    appleUrl: "https://podcasts.apple.com/us/podcast/business-trip/id1520085146",
  },
  {
    type: "image-text",
    src: "/uploads/Inner-Integration-Podcast---Show.jpg",
    alt: "Inner Integration Podcast logo",
    title: "6. Inner Integration Podcast",
    text: "Integration is where the real work happens, and this podcast makes that abundantly clear. Hosted by psychedelic integration coach and educator Meredith Miller, the Inner Integration Podcast focuses on the often-overlooked period after a psychedelic experience — how to process, embody, and sustain the insights gained. Topics include shadow work, somatic practices, journaling techniques, and navigating difficult or challenging trips. It's a compassionate, grounded resource for anyone trying to make lasting meaning from their experiences.",
    spotifyUrl: "https://open.spotify.com/show/5hNQv0WeJgKSGCu4tKgHff",
    appleUrl: "https://podcasts.apple.com/us/podcast/inner-integration-podcast/id1418633395",
  },
  {
    type: "image-text",
    src: "/uploads/Mycopreneur---Show.jpg",
    alt: "Mycopreneur podcast logo",
    title: "7. Mycopreneur",
    text: "Hosted by Dennis Walker, Mycopreneur sits at the crossroads of mycology, wellness, and entrepreneurship. This podcast dives into the world of functional and psychoactive mushrooms from a business and innovation perspective. Episodes cover everything from mushroom cultivation techniques and supplement science to brand building and the legal landscape around psilocybin. If you're curious about the booming fungal economy and the entrepreneurs driving it forward, Mycopreneur offers a unique niche that few other shows fill.",
    spotifyUrl: "https://open.spotify.com/show/3l0nacwTcCCzvtyXowA9t7",
    appleUrl: "https://podcasts.apple.com/us/podcast/mycopreneur/id1550343391",
  },
  {
    type: "image-text",
    src: "/uploads/The-Entheogenic-Evolution---Show.jpg",
    alt: "The Entheogenic Evolution podcast logo",
    title: "8. The Entheogenic Evolution",
    text: "Hosted by Martin W. Ball, The Entheogenic Evolution is one of the true OGs of psychedelic podcasting, holding space for these conversations long before the current renaissance made them trendy. The show covers entheogens — psychoactive substances used in spiritual contexts — with an emphasis on personal transformation, ceremony, and the broader counter-cultural significance of these experiences. Its extensive back catalog is a treasure trove for listeners who want to understand the roots of the modern psychedelic movement.",
    spotifyUrl: "https://open.spotify.com/search/The%20Entheogenic%20Evolution",
    appleUrl: "https://podcasts.apple.com/us/podcast/the-entheogenic-evolution/id272825477",
  },
  {
    type: "image-text",
    src: "/uploads/Webdelics-Podcast---Show.jpg",
    alt: "Webdelics Podcast logo",
    title: "9. Webdelics Podcast",
    text: "Hosted by Mark McNally, Chiara Burns, and Scott Mason, Webdelics brings a fresh, web-native energy to psychedelic discourse. The podcast explores psychedelic culture through the lens of digital communities, online harm reduction, and the evolving relationship between technology and altered states. It's a newer voice in the space but an important one — grappling with how the internet shapes psychedelic education, access, and misinformation. If you spend time in psychedelic subreddits, Discord servers, or online forums, this show speaks directly to your world.",
    spotifyUrl: "https://open.spotify.com/search/Webdelics%20Podcast",
    appleUrl: "https://podcasts.apple.com/us/podcast/webdelics-podcast/id1654755584",
  },
  {
    type: "image-text",
    src: "/uploads/Divergent-States---Show.jpg",
    alt: "Divergent States podcast logo",
    title: "10. Divergent States",
    text: "Hosted by 3L1T3, founder of r/Psychonaut — the world's largest psychedelic harm-reduction community — and co-hosted by Bryan, a USMC veteran and advocate for psychedelic healing, Divergent States stands out for its commitment to amplifying underrepresented and diverse perspectives within the psychedelic space. The podcast tackles topics that many others overlook: racial equity in psychedelic medicine, queer experiences with entheogens, disability and neurodivergence, and the decolonization of plant medicine traditions. In a field that has historically centered certain voices, Divergent States is a much-needed corrective — thoughtful, inclusive, and unflinching in its honesty.",
    spotifyUrl: "https://open.spotify.com/show/4cOGFO21zRAmRelp1ejAGu",
    appleUrl: "https://podcasts.apple.com/us/podcast/divergent-states/id1777650311",
  },
  {
    type: "heading",
    text: "Why These Podcasts Matter",
  },
  {
    type: "paragraph",
    text: "What connects all ten of these shows is a shared commitment to moving the conversation forward — responsibly, inclusively, and with intellectual rigor. The psychedelic space is at a critical inflection point. Clinical trials are yielding remarkable results. Decriminalization efforts are gaining traction. But alongside the promise comes real risk: hype, misinformation, cultural appropriation, and predatory business practices.",
  },
  {
    type: "paragraph",
    text: "Podcasts like these serve as a vital counterweight. They educate. They challenge. They humanize. They create space for nuance in a media landscape that too often prefers sensationalism. And because they're free and accessible to anyone with a phone, they're democratizing knowledge that was once locked behind academic paywalls or passed only through underground networks.",
  },
  {
    type: "quote",
    text: "The most powerful thing about the psychedelic podcast space is that it meets people exactly where they are — no gatekeeping, no prerequisites, just honest conversations about consciousness, healing, and what it means to be human.",
    attribution: "PsychedBox Editorial",
  },
  {
    type: "heading",
    text: "Tune In, Turn On, Think Critically",
  },
  {
    type: "paragraph",
    text: "If you're new to psychedelic media, start with whichever show matches your interests — clinical science, business, personal growth, or cultural critique — and let the rabbit hole take you where it will. And if you're already a seasoned listener, consider sharing these shows with someone in your life who might benefit from hearing a more balanced, compassionate take on what psychedelics actually are and what they can do.",
  },
  {
    type: "paragraph",
    text: "The narrative is changing. These podcasters are helping write the next chapter. Hit subscribe, and join the conversation.",
  },
  {
    type: "list",
    items: [
      "Psychedelics Today — Deep research, policy, and healing narratives",
      "Adventures Through The Mind — Philosophy, psychology, and introspection",
      "Psychedelic Therapy Frontiers — Clinical research and therapeutic protocols",
      "The Psychedelic Podcast — Personal growth, microdosing, and leadership",
      "Business Trip — Industry analysis, ethics, and commercialization",
      "Inner Integration Podcast — Post-experience processing and integration",
      "Mycopreneur — Mushroom business, cultivation, and innovation",
      "The Entheogenic Evolution — Ceremony, counter-culture, and spiritual use",
      "Webdelics Podcast — Digital culture, online harm reduction, and community",
      "Divergent States — Equity, inclusion, and decolonization in psychedelics",
    ],
  },
]);

// Check for existing post with same slug
const existing = db.prepare("SELECT id FROM blog_posts WHERE slug = ?").get(slug);
if (existing) {
  console.log(`Post with slug "${slug}" already exists (id: ${existing.id}). Updating...`);
  db.prepare(`
    UPDATE blog_posts
    SET title = ?, description = ?, category = ?, tags = ?, image = ?, image_alt = ?,
        author = ?, read_time = ?, body = ?, published = 1, updated_at = datetime('now')
    WHERE slug = ?
  `).run(title, description, category, tags, image, imageAlt, author, readTime, body, slug);
  console.log("Post updated successfully.");
} else {
  const result = db.prepare(`
    INSERT INTO blog_posts (slug, title, description, category, tags, image, image_alt, author, read_time, body, published, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
  `).run(slug, title, description, category, tags, image, imageAlt, author, readTime, body);
  console.log(`Blog post inserted with id: ${result.lastInsertRowid}`);
}

db.close();
console.log("Done.");
