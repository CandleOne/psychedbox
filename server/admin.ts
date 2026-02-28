/**
 * server/admin.ts
 * Admin API routes: dashboard stats, user management, blog CRUD, subscribers.
 * All routes require admin role.
 */

import { Router, Request, Response } from "express";
import { requireAdmin } from "./auth.js";
import db from "./db.js";
import {
  sendNewsletterEmail,
  sendBlogUpdateEmail,
  sendWelcomeEmail,
  sendSubscriberWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPaymentFailedEmail,
  sendBulkEmail,
} from "./email.js";
import {
  newsletterEmail as newsletterTpl,
  blogUpdateEmail as blogUpdateTpl,
} from "./email-templates.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ─── Image Upload Setup ──────────────────────────────────────────────────────
// In production, use the persistent Fly volume (/app/data/uploads).
// In development, use a local data/uploads directory.

const uploadDir = process.env.NODE_ENV === "production"
  ? path.resolve("/app/data/uploads")
  : path.resolve("data/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage });

export function createAdminRouter(): Router {
  const router = Router();
  router.use(requireAdmin);

  // POST /api/admin/upload (multipart/form-data, field: image)
  router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  // ─── Dashboard Stats ────────────────────────────────────────────────────────

  router.get("/stats", (_req: Request, res: Response) => {
    const users = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
    const admins = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
    const subscribers = db.prepare("SELECT COUNT(*) as count FROM subscribers").get() as { count: number };
    const blogPosts = db.prepare("SELECT COUNT(*) as count FROM blog_posts").get() as { count: number };
    const publishedPosts = db.prepare("SELECT COUNT(*) as count FROM blog_posts WHERE published = 1").get() as { count: number };
    const activeSessions = db.prepare("SELECT COUNT(*) as count FROM sessions WHERE expires_at > datetime('now')").get() as { count: number };

    // Signups per day (last 30 days)
    const signupsByDay = db.prepare(`
      SELECT date(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at > datetime('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `).all();

    // Users by plan
    const usersByPlan = db.prepare(`
      SELECT COALESCE(plan, 'free') as plan, COUNT(*) as count
      FROM users
      GROUP BY COALESCE(plan, 'free')
    `).all();

    res.json({
      users: users.count,
      admins: admins.count,
      subscribers: subscribers.count,
      blogPosts: blogPosts.count,
      publishedPosts: publishedPosts.count,
      activeSessions: activeSessions.count,
      signupsByDay,
      usersByPlan,
    });
  });

  // ─── Users ──────────────────────────────────────────────────────────────────

  router.get("/users", (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    let rows: any[];
    let total: { count: number };

    if (search) {
      const pattern = `%${search}%`;
      rows = db.prepare(
        "SELECT id, email, name, role, plan, created_at, updated_at FROM users WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
      ).all(pattern, pattern, limit, offset);
      total = db.prepare(
        "SELECT COUNT(*) as count FROM users WHERE email LIKE ? OR name LIKE ?"
      ).get(pattern, pattern) as { count: number };
    } else {
      rows = db.prepare(
        "SELECT id, email, name, role, plan, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?"
      ).all(limit, offset);
      total = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
    }

    res.json({ users: rows, total: total.count, page, limit });
  });

  router.patch("/users/:id/role", (req: Request, res: Response) => {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    db.prepare("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?").run(role, req.params.id);
    res.json({ ok: true });
  });

  router.delete("/users/:id", (req: Request, res: Response) => {
    const targetId = parseInt(req.params.id);
    const currentUser = (req as any).user;
    if (targetId === currentUser.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }
    db.prepare("DELETE FROM users WHERE id = ?").run(targetId);
    res.json({ ok: true });
  });

  // ─── Blog Posts ─────────────────────────────────────────────────────────────

  router.get("/blog", (_req: Request, res: Response) => {
    const posts = db.prepare(
      "SELECT id, slug, title, category, published, author, created_at, updated_at FROM blog_posts ORDER BY created_at DESC"
    ).all();
    res.json({ posts });
  });

  router.get("/blog/:id", (req: Request, res: Response) => {
    const post = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ post });
  });

  router.post("/blog", (req: Request, res: Response) => {
    const { slug, title, description, category, tags, image, image_alt, author, read_time, body, published } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ error: "Slug and title are required" });
    }

    const existing = db.prepare("SELECT id FROM blog_posts WHERE slug = ?").get(slug);
    if (existing) {
      return res.status(409).json({ error: "A post with this slug already exists" });
    }

    const result = db.prepare(`
      INSERT INTO blog_posts (slug, title, description, category, tags, image, image_alt, author, read_time, body, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      slug,
      title,
      description || "",
      category || "News",
      JSON.stringify(tags || []),
      image || "",
      image_alt || "",
      author || "PsychedBox Team",
      read_time || "5 min read",
      JSON.stringify(body || []),
      published ? 1 : 0
    );

    res.status(201).json({ id: result.lastInsertRowid });
  });

  router.put("/blog/:id", (req: Request, res: Response) => {
    const { slug, title, description, category, tags, image, image_alt, author, read_time, body, published } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ error: "Slug and title are required" });
    }

    const existing = db.prepare("SELECT id FROM blog_posts WHERE slug = ? AND id != ?").get(slug, req.params.id);
    if (existing) {
      return res.status(409).json({ error: "Another post with this slug already exists" });
    }

    db.prepare(`
      UPDATE blog_posts
      SET slug = ?, title = ?, description = ?, category = ?, tags = ?, image = ?, image_alt = ?,
          author = ?, read_time = ?, body = ?, published = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      slug, title, description || "", category || "News",
      JSON.stringify(tags || []), image || "", image_alt || "",
      author || "PsychedBox Team", read_time || "5 min read",
      JSON.stringify(body || []), published ? 1 : 0, req.params.id
    );

    res.json({ ok: true });
  });

  router.delete("/blog/:id", (req: Request, res: Response) => {
    db.prepare("DELETE FROM blog_posts WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });

  // ─── Subscribers ────────────────────────────────────────────────────────────

  router.get("/subscribers", (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const rows = db.prepare("SELECT * FROM subscribers ORDER BY created_at DESC LIMIT ? OFFSET ?").all(limit, offset);
    const total = db.prepare("SELECT COUNT(*) as count FROM subscribers").get() as { count: number };

    res.json({ subscribers: rows, total: total.count, page, limit });
  });

  router.post("/subscribers", (req: Request, res: Response) => {
    const { email, source } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    try {
      db.prepare("INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)").run(email, source || "admin");
      res.status(201).json({ ok: true });
    } catch {
      res.status(409).json({ error: "Already subscribed" });
    }
  });

  router.delete("/subscribers/:id", (req: Request, res: Response) => {
    const result = db.prepare("DELETE FROM subscribers WHERE id = ?").run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    res.json({ ok: true });
  });

  // ─── Email: Send Newsletter ─────────────────────────────────────────────────

  router.post("/email/newsletter", async (req: Request, res: Response) => {
    const { subject, bodyHtml } = req.body;
    if (!subject || !bodyHtml) {
      return res.status(400).json({ error: "subject and bodyHtml are required" });
    }

    const subscribers = db
      .prepare("SELECT email FROM subscribers ORDER BY created_at ASC")
      .all() as { email: string }[];

    if (subscribers.length === 0) {
      return res.json({ sent: 0, failed: 0, total: 0 });
    }

    const emails = subscribers.map((s) => s.email);
    const siteUrl = process.env.SITE_URL || "https://psychedbox.com";

    const result = await sendBulkEmail(emails, subject, () => {
      return newsletterTpl(subject, bodyHtml, siteUrl);
    });

    res.json({ ...result, total: emails.length });
  });

  // ─── Email: Notify Subscribers of New Blog Post ─────────────────────────────

  router.post("/email/blog-notify/:id", async (req: Request, res: Response) => {
    const post = db
      .prepare("SELECT slug, title, description, author, published FROM blog_posts WHERE id = ?")
      .get(req.params.id) as
      | { slug: string; title: string; description: string; author: string; published: number }
      | undefined;

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!post.published) {
      return res.status(400).json({ error: "Post is not published yet" });
    }

    const subscribers = db
      .prepare("SELECT email FROM subscribers ORDER BY created_at ASC")
      .all() as { email: string }[];

    if (subscribers.length === 0) {
      return res.json({ sent: 0, failed: 0, total: 0 });
    }

    const emails = subscribers.map((s) => s.email);
    const siteUrl = process.env.SITE_URL || "https://psychedbox.com";

    const result = await sendBulkEmail(
      emails,
      `New Post: ${post.title}`,
      () => blogUpdateTpl(post, siteUrl)
    );

    res.json({ ...result, total: emails.length });
  });

  // ─── Email: Send Test Email ─────────────────────────────────────────────────

  router.post("/email/test", async (req: Request, res: Response) => {
    const { to, template } = req.body;
    const currentUser = (req as any).user;
    const targetEmail = to || currentUser.email;

    try {
      let sent = false;
      switch (template) {
        case "welcome":
          sent = await sendWelcomeEmail(targetEmail, currentUser.name || "Admin");
          break;
        case "subscriber":
          sent = await sendSubscriberWelcomeEmail(targetEmail);
          break;
        case "order":
          sent = await sendOrderConfirmationEmail(targetEmail, currentUser.name || "Admin", {
            planOrProduct: "PsychedBox — Monthly",
            amount: "$29.00",
            sessionId: "cs_test_" + Date.now(),
          });
          break;
        case "payment-failed":
          sent = await sendPaymentFailedEmail(targetEmail, currentUser.name || "Admin", 1);
          break;
        default:
          return res.status(400).json({ error: "Unknown template. Use: welcome, subscriber, order, payment-failed" });
      }
      res.json({ sent, to: targetEmail, template });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Database Overview ──────────────────────────────────────────────────────

  router.get("/db/tables", (_req: Request, res: Response) => {
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all() as { name: string }[];

    const result = tables.map((t) => {
      const count = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get() as { count: number };
      const info = db.prepare(`PRAGMA table_info("${t.name}")`).all();
      return { name: t.name, rowCount: count.count, columns: info };
    });

    res.json({ tables: result });
  });

  router.get("/db/query", (req: Request, res: Response) => {
    const sql = (req.query.sql as string) || "";
    if (!sql) return res.status(400).json({ error: "Missing sql parameter" });

    // Only allow SELECT for safety
    const trimmed = sql.trim().toUpperCase();
    if (!trimmed.startsWith("SELECT") && !trimmed.startsWith("PRAGMA")) {
      return res.status(403).json({ error: "Only SELECT and PRAGMA queries are allowed" });
    }

    // Block access to sensitive tables/columns
    const forbidden = /\bpassword\b|\bsessions\b|\bpassword_resets\b/i;
    if (forbidden.test(sql)) {
      return res.status(403).json({ error: "Access to sensitive columns/tables (password, sessions, password_resets) is restricted" });
    }

    try {
      const rows = db.prepare(sql).all();
      res.json({ rows, count: rows.length });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
