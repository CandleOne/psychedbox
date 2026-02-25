// ─── Blog Post Data ──────────────────────────────────────────────────────────
// Add new posts to the top of the array. Slugs must be unique and URL-safe.
// Body uses a simple markdown-like array of blocks for easy authoring.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string
  author: string;
  category: BlogCategory;
  tags: string[];
  image: string;
  imageAlt: string;
  readTime: string;
  body: ContentBlock[];
}

export type BlogCategory =
  | "Harm Reduction"
  | "Community"
  | "Art & Culture"
  | "Ceremony"
  | "Wellness"
  | "News";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] };

// ─── Posts ───────────────────────────────────────────────────────────────────

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-harm-reduction",
    title: "What Is Harm Reduction? A Beginner's Guide",
    description:
      "Harm reduction saves lives. Learn the core principles, practical strategies, and why the psychedelic community is leading the way.",
    date: "2026-02-20",
    author: "PsychedBox Team",
    category: "Harm Reduction",
    tags: ["harm reduction", "safety", "education", "psychedelics 101"],
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop",
    imageAlt: "Hands holding a safety card at a festival",
    readTime: "6 min read",
    body: [
      {
        type: "paragraph",
        text: "Harm reduction is a set of practical strategies aimed at reducing the negative consequences of drug use — without requiring abstinence. It meets people where they are, prioritizing safety, dignity, and informed choice.",
      },
      {
        type: "heading",
        text: "The Core Principles",
      },
      {
        type: "list",
        items: [
          "Accept that drug use is a reality and work to minimize its harms rather than ignore or condemn it.",
          "Respect the autonomy of people who use substances — they are the primary agents of change.",
          "Recognize that conditions of use, not just the substances themselves, determine risk.",
          "Ensure interventions are evidence-based and free of moral judgment.",
        ],
      },
      {
        type: "heading",
        text: "Practical Harm Reduction Strategies",
      },
      {
        type: "paragraph",
        text: "In the psychedelic space, harm reduction shows up in concrete ways: reagent testing kits that verify substance identity, peer-support 'trip sitting' at events, and integration circles that help people process their experiences afterward.",
      },
      {
        type: "paragraph",
        text: "Organizations like DanceSafe provide free on-site drug checking at festivals. The Zendo Project offers compassionate psychedelic support tents. Fireside Project runs a free peer-support phone line anyone can call during or after an experience.",
      },
      {
        type: "quote",
        text: "Harm reduction is not about encouraging use — it's about keeping people alive and safe so they can make their own informed decisions.",
        attribution: "DanceSafe",
      },
      {
        type: "heading",
        text: "Why PsychedBox Supports Harm Reduction",
      },
      {
        type: "paragraph",
        text: "Ten percent of every PsychedBox subscription goes directly to harm reduction, education, and equity organizations. We believe that an informed community is a safer community — and that starts with access to honest, stigma-free information.",
      },
      {
        type: "paragraph",
        text: "Whether you're new to psychedelics or a seasoned explorer, understanding harm reduction principles is one of the most important steps you can take. Always test your substances, never use alone for the first time, start with low doses, and have a plan for integration.",
      },
    ],
  },
  {
    slug: "setting-up-a-ceremony-space",
    title: "How to Set Up a Ceremony Space at Home",
    description:
      "Create a safe, intentional environment for your inner work. A step-by-step guide to preparing your space, your mind, and your tools.",
    date: "2026-02-12",
    author: "PsychedBox Team",
    category: "Ceremony",
    tags: ["ceremony", "set and setting", "ritual", "meditation", "wellness"],
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=450&fit=crop",
    imageAlt: "Singing bowl and candles arranged in a ceremony space",
    readTime: "8 min read",
    body: [
      {
        type: "paragraph",
        text: "Your environment shapes your experience. Whether you're meditating, journaling, or working with plant medicines, an intentional ceremony space creates the container for meaningful inner work.",
      },
      {
        type: "heading",
        text: "1. Choose Your Space",
      },
      {
        type: "paragraph",
        text: "Pick a room — or a corner of a room — where you feel safe and won't be interrupted. It doesn't need to be large. A yoga mat's worth of floor space is plenty. Natural light is ideal, but you'll want the option to dim or darken the room.",
      },
      {
        type: "heading",
        text: "2. Clear and Clean",
      },
      {
        type: "paragraph",
        text: "Physical clutter creates mental clutter. Remove anything unnecessary. A clean space signals to your nervous system that it's safe to let go. Some practitioners prefer to smudge with sage or palo santo as a symbolic clearing.",
      },
      {
        type: "heading",
        text: "3. Set the Sensory Field",
      },
      {
        type: "list",
        items: [
          "Sound: A singing bowl, calming playlist, or nature sounds. Avoid anything with lyrics or a strong beat.",
          "Scent: Incense, ceremony candles, or essential oils like lavender, frankincense, or vetiver.",
          "Touch: Soft blankets, cushions, an eye mask for deeper introspection.",
          "Sight: Low warm lighting. Fairy lights, candles, or a salt lamp work well.",
        ],
      },
      {
        type: "heading",
        text: "4. Gather Your Tools",
      },
      {
        type: "paragraph",
        text: "Keep them simple: a journal for capturing insights, water to stay hydrated, a warm blanket, and any personal items that hold meaning — a crystal, a photograph, a letter. These anchor your intention.",
      },
      {
        type: "quote",
        text: "The ceremony doesn't happen because of the tools. It happens because you decided to show up. The space just holds you while you do.",
      },
      {
        type: "heading",
        text: "5. Set an Intention",
      },
      {
        type: "paragraph",
        text: "Before you begin, sit quietly and ask yourself: What am I seeking? What am I ready to let go of? Write it down. An intention is not a goal — it's a compass heading. It doesn't guarantee where you'll end up, but it gives direction.",
      },
      {
        type: "paragraph",
        text: "Your ceremony space is a living thing. It evolves as you do. Start simple, adjust as you learn what works, and remember: the most important thing isn't the space — it's your willingness to be present in it.",
      },
    ],
  },
  {
    slug: "psychedelic-art-history-brief-introduction",
    title: "A Brief History of Psychedelic Art",
    description:
      "From Mayan mushroom stones to Alex Grey — how visionary experiences have shaped art across centuries.",
    date: "2026-02-05",
    author: "PsychedBox Team",
    category: "Art & Culture",
    tags: [
      "psychedelic art",
      "art history",
      "visionary art",
      "culture",
      "Alex Grey",
    ],
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=450&fit=crop",
    imageAlt: "Colorful abstract painting in a gallery",
    readTime: "7 min read",
    body: [
      {
        type: "paragraph",
        text: "Psychedelic art is as old as human consciousness. Long before the word 'psychedelic' existed, cultures worldwide created visual representations of altered states — from the geometric patterns in Amazonian ayahuasca visions to the fractal mandalas of Tibetan Buddhism.",
      },
      {
        type: "heading",
        text: "Ancient Roots",
      },
      {
        type: "paragraph",
        text: "Mayan mushroom stones dating back to 1000 BCE depict human figures merged with psilocybin mushrooms. The Tassili cave paintings in Algeria (circa 7000 BCE) show mushroom-headed shamans in ecstatic dance. These weren't decorations — they were records of transformative experiences.",
      },
      {
        type: "heading",
        text: "The 1960s Explosion",
      },
      {
        type: "paragraph",
        text: "The modern psychedelic art movement exploded alongside the counterculture of the 1960s. Artists like Wes Wilson created iconic San Francisco concert posters with swirling, barely readable letterforms that mimicked the visual distortions of LSD. Peter Max brought psychedelic color palettes into mainstream pop art.",
      },
      {
        type: "quote",
        text: "Psychedelic art is the art of translating the untranslatable — making visible the invisible landscapes of consciousness.",
        attribution: "Alex Grey",
      },
      {
        type: "heading",
        text: "The Visionary Art Movement",
      },
      {
        type: "paragraph",
        text: "In the 1980s and 90s, artists like Alex Grey, Android Jones, and Amanda Sage pushed psychedelic art beyond poster design into fine art. Grey's intricate paintings of the human energy body — translucent figures revealing nervous systems, chakras, and cosmic grids — became defining images of the psychedelic renaissance.",
      },
      {
        type: "heading",
        text: "Psychedelic Art Today",
      },
      {
        type: "paragraph",
        text: "Today's psychedelic art lives on gallery walls, festival stages, album covers, and — in our case — puzzle boxes. Digital tools have expanded the possibilities, with artists using AI, projection mapping, and VR to create immersive visionary experiences.",
      },
      {
        type: "paragraph",
        text: "At PsychedBox, every monthly puzzle portrait is a piece of this tradition. We commission independent artists to create stylized portraits of real community members — turning living stories into collectible art that connects people to the movement.",
      },
    ],
  },
  {
    slug: "integration-after-psychedelic-experience",
    title: "Integration: What to Do After a Psychedelic Experience",
    description:
      "The journey doesn't end when the effects fade. Learn how to process, integrate, and apply the insights from your experiences.",
    date: "2026-01-28",
    author: "PsychedBox Team",
    category: "Wellness",
    tags: [
      "integration",
      "mental health",
      "journaling",
      "psychedelic therapy",
      "wellness",
    ],
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=450&fit=crop",
    imageAlt: "Journal and pen on a wooden surface",
    readTime: "9 min read",
    body: [
      {
        type: "paragraph",
        text: "You've had a powerful experience. Maybe it was beautiful, maybe it was challenging, maybe it was both. Now what? Integration is the process of making meaning from your experiences and translating insights into lasting change in your daily life.",
      },
      {
        type: "heading",
        text: "Why Integration Matters",
      },
      {
        type: "paragraph",
        text: "Research shows that the psychedelic experience itself is only part of the equation. The real benefits — reduced anxiety, greater openness, improved relationships — come from what you do afterward. Without integration, even profound insights can fade into distant memories.",
      },
      {
        type: "quote",
        text: "The psychedelic experience opens a window. Integration is what you choose to build through it.",
        attribution: "Rosalind Watts, Imperial College London",
      },
      {
        type: "heading",
        text: "The First 24–48 Hours",
      },
      {
        type: "list",
        items: [
          "Journal everything you remember — images, feelings, words, body sensations. Don't edit or analyze yet.",
          "Stay off social media and avoid screens. Give your mind space to settle.",
          "Eat nourishing food, hydrate, and get into nature if possible.",
          "Avoid making major life decisions. Let the dust settle first.",
        ],
      },
      {
        type: "heading",
        text: "The Following Weeks",
      },
      {
        type: "paragraph",
        text: "This is where the real work begins. Review your journal entries and look for patterns or themes. What kept coming up? What felt important? Share your experience with someone you trust — a therapist, a friend, or an integration circle.",
      },
      {
        type: "paragraph",
        text: "Pick one or two concrete changes you want to make based on what you learned. Start small. If your experience showed you that you need more stillness, commit to five minutes of daily meditation — not an hour.",
      },
      {
        type: "heading",
        text: "Long-Term Integration Practices",
      },
      {
        type: "list",
        items: [
          "Regular journaling — even 5 minutes a day keeps the channel open.",
          "Therapy or coaching — a professional can help you work with difficult material.",
          "Creative expression — art, music, movement. Let the experience speak through you.",
          "Community — connect with others on a similar path. PsychedBox member circles are one way to do this.",
          "Revisit your intentions periodically. Are you honoring what you learned?",
        ],
      },
      {
        type: "paragraph",
        text: "Integration isn't a one-time event — it's an ongoing practice. Be patient with yourself. Some insights take months or years to fully unfold. The fact that you're here, reading this, means you're already doing the work.",
      },
    ],
  },
  {
    slug: "growing-gourmet-mushrooms-at-home",
    title: "A Beginner's Guide to Growing Gourmet Mushrooms at Home",
    description:
      "Lion's mane, oyster, shiitake — growing gourmet mushrooms at home is easier than you think. Here's how to get started.",
    date: "2026-01-20",
    author: "PsychedBox Team",
    category: "Wellness",
    tags: [
      "mushrooms",
      "growing",
      "gourmet",
      "lion's mane",
      "oyster mushrooms",
      "DIY",
    ],
    image:
      "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?w=800&h=450&fit=crop",
    imageAlt: "Oyster mushrooms growing on a substrate",
    readTime: "7 min read",
    body: [
      {
        type: "paragraph",
        text: "You don't need a lab, a farm, or even a green thumb to grow beautiful, edible mushrooms at home. With an all-in-one grow kit or a simple DIY setup, you can harvest your first flush in as little as two weeks.",
      },
      {
        type: "heading",
        text: "Why Grow Your Own?",
      },
      {
        type: "list",
        items: [
          "Freshness: Store-bought mushrooms are days old. Yours will be hours old.",
          "Variety: Grow species that are hard to find in stores — lion's mane, pink oyster, maitake.",
          "Cost: A single kit yields multiple harvests. Better value than buying organic mushrooms weekly.",
          "Connection: There's something deeply satisfying about growing your own food from mycelium.",
        ],
      },
      {
        type: "heading",
        text: "Best Beginner Species",
      },
      {
        type: "paragraph",
        text: "Oyster mushrooms (blue or pink) are the easiest to grow — they're aggressive colonizers that tolerate beginner mistakes. Lion's mane is a close second, prized for its flavor and cognitive health benefits. Shiitake takes a bit longer but rewards patience with rich, umami-packed caps.",
      },
      {
        type: "heading",
        text: "The Grow Kit Method",
      },
      {
        type: "paragraph",
        text: "All-in-one grow kits take the guesswork out of the process. The substrate is pre-sterilized and inoculated — all you need to do is cut open the bag, mist it daily, and maintain humidity. Within 7–14 days, you'll see pins (tiny mushroom primordia) forming. Within another week, you'll be harvesting.",
      },
      {
        type: "heading",
        text: "Key Tips for Success",
      },
      {
        type: "list",
        items: [
          "Humidity is everything: Mushrooms need 80–95% humidity. A simple spray bottle and a humidity tent (even a plastic bag with holes) work fine.",
          "Fresh air exchange: Mushrooms need oxygen. Don't seal them airtight — allow some airflow.",
          "Indirect light: Mushrooms don't photosynthesize, but they do use light as a directional cue. A north-facing window is ideal.",
          "Temperature: Most gourmet species fruit best between 60–75°F (15–24°C).",
          "Multiple harvests: After your first flush, soak the block in water for a few hours and let it fruit again. Most kits give 2–3 harvests.",
        ],
      },
      {
        type: "paragraph",
        text: "Growing mushrooms is a meditative, rewarding practice that connects you to one of nature's most fascinating kingdoms. And once you've tasted a freshly harvested lion's mane steak, you'll never look at the grocery store the same way again.",
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

export const allCategories: BlogCategory[] = Array.from(
  new Set(blogPosts.map((p) => p.category))
);
