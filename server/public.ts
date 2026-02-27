/**
 * server/public.ts
 * Public (unauthenticated) API routes: newsletter subscribe, public blog.
 */

import { Router, Request, Response } from "express";
import db from "./db.js";
import { sendSubscriberWelcomeEmail } from "./email.js";

export function createPublicRouter(): Router {
  const router = Router();

  // ─── Newsletter Subscribe ──────────────────────────────────────────────────

  router.post("/subscribe", (req: Request, res: Response) => {
    const { email, source } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Basic email validation
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    // Check if already subscribed
    const existing = db
      .prepare("SELECT id FROM subscribers WHERE email = ? COLLATE NOCASE")
      .get(trimmed);
    if (existing) {
      return res.status(409).json({ error: "You're already subscribed!" });
    }

    db.prepare("INSERT INTO subscribers (email, source) VALUES (?, ?)").run(
      trimmed,
      source || "website"
    );
    res.status(201).json({ ok: true });

    // Fire-and-forget welcome email to new subscriber
    sendSubscriberWelcomeEmail(trimmed).catch(() => {});
  });

  // ─── Public Blog ───────────────────────────────────────────────────────────

  // List published blog posts (public)
  router.get("/blog", (_req: Request, res: Response) => {
    const posts = db
      .prepare(
        `SELECT id, slug, title, description, category, tags, image, image_alt,
                author, read_time, created_at, updated_at
         FROM blog_posts
         WHERE published = 1
         ORDER BY created_at DESC`
      )
      .all() as any[];

    // Parse tags JSON string back to array
    const formatted = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.created_at,
      author: p.author,
      category: p.category,
      tags: safeParse(p.tags, []),
      image: p.image,
      imageAlt: p.image_alt,
      readTime: p.read_time,
    }));

    res.json({ posts: formatted });
  });

  // Get a single published blog post by slug (public)
  router.get("/blog/:slug", (req: Request, res: Response) => {
    const post = db
      .prepare(
        `SELECT slug, title, description, category, tags, image, image_alt,
                author, read_time, body, created_at, updated_at
         FROM blog_posts
         WHERE slug = ? AND published = 1`
      )
      .get(req.params.slug) as any | undefined;

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      post: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.created_at,
        author: post.author,
        category: post.category,
        tags: safeParse(post.tags, []),
        image: post.image,
        imageAlt: post.image_alt,
        readTime: post.read_time,
        body: safeParse(post.body, []),
      },
    });
  });

  return router;
}

function safeParse(json: string, fallback: any): any {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
