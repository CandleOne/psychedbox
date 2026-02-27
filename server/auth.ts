/**
 * server/auth.ts
 * Authentication routes: signup, login, logout, me
 * Uses bcrypt for password hashing and secure session cookies.
 */

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import db from "./db.js";
import { sendWelcomeEmail } from "./email.js";

const SESSION_COOKIE = "pb_session";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createSession(userId: number): string {
  const id = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(
    id,
    userId,
    expiresAt
  );
  return id;
}

function clearExpiredSessions() {
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  plan: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}

function getUserFromSession(sessionId: string | undefined): AuthUser | null {
  if (!sessionId) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.plan, u.stripe_customer_id, u.created_at
       FROM sessions s JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
    .get(sessionId) as AuthUser | undefined;
  return row ?? null;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  (req as any).user = getUserFromSession(sessionId);
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as AuthUser | null;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export function createAuthRouter(): Router {
  const router = Router();

  // Clean up expired sessions periodically
  clearExpiredSessions();
  setInterval(clearExpiredSessions, 60 * 60 * 1000); // hourly

  // POST /api/auth/signup
  router.post("/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }

      const hash = await bcrypt.hash(password, 12);
      const result = db
        .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
        .run(email, hash, name || "");

      const userId = result.lastInsertRowid as number;
      const sessionId = createSession(userId);

      res.cookie(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_MS,
        path: "/",
      });

      const user = getUserFromSession(sessionId);
      res.status(201).json({ user });

      // Fire-and-forget welcome email
      sendWelcomeEmail(email, name || "").catch(() => {});
    } catch (err: any) {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // POST /api/auth/login
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const row = db.prepare("SELECT id, password FROM users WHERE email = ?").get(email) as
        | { id: number; password: string }
        | undefined;

      if (!row || !(await bcrypt.compare(password, row.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const sessionId = createSession(row.id);

      res.cookie(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_MS,
        path: "/",
      });

      const user = getUserFromSession(sessionId);
      res.json({ user });
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // POST /api/auth/logout
  router.post("/logout", (req: Request, res: Response) => {
    const sessionId = req.cookies?.[SESSION_COOKIE];
    if (sessionId) {
      db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
    }
    res.clearCookie(SESSION_COOKIE, { path: "/" });
    res.json({ ok: true });
  });

  // GET /api/auth/me
  router.get("/me", (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ user: null });
    res.json({ user });
  });

  // GET /api/auth/orders – order history for the logged-in user
  router.get("/orders", requireAuth, (req: Request, res: Response) => {
    try {
      const user = (req as any).user as AuthUser;
      const orders = db
        .prepare(
          `SELECT id, stripe_session_id, amount_cents, currency, status, plan_id, item_summary, created_at
           FROM orders
           WHERE user_id = ? OR email = ?
           ORDER BY created_at DESC
           LIMIT 50`
        )
        .all(user.id, user.email) as any[];

      // Attach line items to each order
      const getItems = db.prepare(
        `SELECT product_id, name, variant, quantity, price_cents FROM order_items WHERE order_id = ?`
      );
      for (const order of orders) {
        order.items = getItems.all(order.id);
      }

      res.json({ orders });
    } catch (err: any) {
      console.error("Orders fetch error:", err);
      res.status(500).json({ error: "Failed to load orders" });
    }
  });

  return router;
}
