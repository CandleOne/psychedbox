// ─── Blog Post Types ─────────────────────────────────────────────────────────
// Type definitions for blog posts. Post data is served from the database
// via /api/blog endpoints. These types are shared by consuming components.

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

export const allCategories: BlogCategory[] = [
  "Harm Reduction",
  "Community",
  "Art & Culture",
  "Ceremony",
  "Wellness",
  "News",
];
