import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createPaymentRouter } from "./payments.js";
import { createAuthRouter, authMiddleware } from "./auth.js";
import { createAdminRouter } from "./admin.js";
import { createPublicRouter } from "./public.js";
import db from "./db.js";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON for all routes EXCEPT the Stripe webhook
  // (Stripe webhook needs the raw body buffer for signature verification)
  app.use((req, res, next) => {
    if (req.path === "/api/payments/webhook") return next();
    express.json()(req, res, next);
  });
  app.use(cookieParser());

  // ── Security headers (Helmet) ─────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://cloud.umami.is"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.stripe.com", "blob:"],
          frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
          connectSrc: ["'self'", "https://api.stripe.com", "https://cloud.umami.is"],
        },
      },
      crossOriginEmbedderPolicy: false, // needed for external images
    })
  );

  // ── Rate limiting ──────────────────────────────────────────────────────
  // Strict limiter for auth-sensitive routes (login, signup, forgot-password)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,                  // 15 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts. Please try again in a few minutes." },
  });
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/signup", authLimiter);
  app.use("/api/auth/forgot-password", authLimiter);
  app.use("/api/auth/reset-password", authLimiter);

  // General API limiter (generous — catches abuse without affecting normal usage)
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,      // 1 minute
    max: 120,                 // 120 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please slow down." },
  });
  app.use("/api/", apiLimiter);

  // Auth middleware — attaches req.user on every request
  app.use(authMiddleware);

  // Payments API routes (shop products, plans, portal, webhook)
  app.use("/api/payments", createPaymentRouter());

  // Auth API routes (signup, login, logout, me)
  app.use("/api/auth", createAuthRouter());

  // Admin API routes (requires admin role)
  app.use("/api/admin", createAdminRouter());

  // Public API routes (newsletter subscribe, public blog)
  app.use("/api", createPublicRouter());

  // Health check endpoint (for Fly.io health checks)
  app.get("/api/health", (_req, res) => {
    try {
      // Quick DB check to ensure SQLite is responsive
      db.prepare("SELECT 1").get();
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    } catch {
      res.status(503).json({ status: "error", message: "Database unavailable" });
    }
  });

  // Dynamic sitemap — auto-includes blog posts from DB
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = process.env.SITE_URL || "https://psychedbox.com";

    // Static routes
    const staticRoutes = [
      "/", "/pricing", "/shop", "/shop/monthly-boxes", "/shop/gift-subscriptions",
      "/shop/past-puzzles", "/community/member-gallery", "/community/stories",
      "/community/events", "/about/our-mission", "/about/how-it-works", "/about-us",
      "/contact", "/careers", "/faq", "/shipping-info", "/returns", "/blog",
      "/movement",
    ];

    // Dynamic blog posts from DB
    const blogPosts = db.prepare(
      "SELECT slug, updated_at FROM blog_posts WHERE published = 1 ORDER BY created_at DESC"
    ).all() as { slug: string; updated_at: string }[];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const route of staticRoutes) {
      xml += `  <url><loc>${baseUrl}${route}</loc></url>\n`;
    }
    for (const post of blogPosts) {
      const lastmod = post.updated_at ? post.updated_at.split("T")[0] || post.updated_at.split(" ")[0] : "";
      xml += `  <url><loc>${baseUrl}/blog/${post.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>\n`;
    }

    xml += `</urlset>`;
    res.header("Content-Type", "application/xml").send(xml);
  });

  // Serve uploaded images from the persistent data volume
  const uploadsPath = process.env.NODE_ENV === "production"
    ? "/app/data/uploads"
    : path.resolve(__dirname, "..", "data", "uploads");
  app.use("/uploads", express.static(uploadsPath));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // Hashed assets (assets/*) get long-lived cache; other static files get short cache
  app.use("/assets", express.static(path.join(staticPath, "assets"), {
    maxAge: "1y",
    immutable: true,
  }));
  app.use(express.static(staticPath, {
    maxAge: "1h",
  }));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
