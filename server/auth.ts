/**
 * server/auth.ts
 * Authentication routes: signup, login, logout, me
 * Uses bcrypt for password hashing and secure session cookies.
 */

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import db from "./db.js";
import { sendWelcomeEmail, sendPasswordResetEmail, sendEmailVerificationEmail } from "./email.js";

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
  email_verified: boolean;
  created_at: string;
}

function getUserFromSession(sessionId: string | undefined): AuthUser | null {
  if (!sessionId) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.plan, u.stripe_customer_id, u.email_verified, u.created_at
       FROM sessions s JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
    .get(sessionId) as (Omit<AuthUser, 'email_verified'> & { email_verified: number }) | undefined;
  if (!row) return null;
  return { ...row, email_verified: !!row.email_verified };
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

      // Fire-and-forget welcome email + verification email
      sendWelcomeEmail(email, name || "").catch(() => {});

      // Create and send email verification token
      const verifyToken = crypto.randomBytes(32).toString("hex");
      const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
      db.prepare("INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)").run(
        userId, verifyToken, verifyExpires
      );
      const siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
      sendEmailVerificationEmail(email, name || "", `${siteUrl}/verify-email?token=${verifyToken}`).catch(() => {});
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

  // POST /api/auth/forgot-password
  router.post("/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Always respond 200 to avoid email enumeration
      const okResponse = { ok: true, message: "If that email exists, a reset link has been sent." };

      const user = db.prepare("SELECT id, name FROM users WHERE email = ? COLLATE NOCASE").get(email) as
        | { id: number; name: string }
        | undefined;

      if (!user) {
        return res.json(okResponse);
      }

      // Invalidate any existing unused reset tokens for this user
      db.prepare("UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0").run(user.id);

      // Create a new reset token (valid for 1 hour)
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      db.prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)").run(
        user.id,
        token,
        expiresAt
      );

      const siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
      const resetUrl = `${siteUrl}/reset-password?token=${token}`;

      sendPasswordResetEmail(email, user.name, resetUrl).catch(() => {});

      res.json(okResponse);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  // POST /api/auth/reset-password
  router.post("/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: "Token and new password are required" });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      const reset = db.prepare(
        "SELECT id, user_id FROM password_resets WHERE token = ? AND used = 0 AND expires_at > datetime('now')"
      ).get(token) as { id: number; user_id: number } | undefined;

      if (!reset) {
        return res.status(400).json({ error: "Invalid or expired reset link. Please request a new one." });
      }

      // Hash the new password and update the user
      const hash = await bcrypt.hash(password, 12);
      db.prepare("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?").run(hash, reset.user_id);

      // Mark the token as used
      db.prepare("UPDATE password_resets SET used = 1 WHERE id = ?").run(reset.id);

      // Invalidate all existing sessions for this user (force re-login)
      db.prepare("DELETE FROM sessions WHERE user_id = ?").run(reset.user_id);

      res.json({ ok: true, message: "Password reset successfully. Please log in with your new password." });
    } catch (err: any) {
      console.error("Reset password error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  // POST /api/auth/send-verification — resend email verification
  router.post("/send-verification", requireAuth, (req: Request, res: Response) => {
    try {
      const user = (req as any).user as AuthUser;
      if (user.email_verified) {
        return res.json({ ok: true, message: "Email is already verified." });
      }

      // Invalidate existing tokens
      db.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(user.id);

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      db.prepare("INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)").run(
        user.id, token, expiresAt
      );

      const siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
      sendEmailVerificationEmail(user.email, user.name, `${siteUrl}/verify-email?token=${token}`).catch(() => {});

      res.json({ ok: true, message: "Verification email sent." });
    } catch (err: any) {
      console.error("Send verification error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  // POST /api/auth/verify-email — verify email with token
  router.post("/verify-email", (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const row = db.prepare(
        "SELECT id, user_id FROM email_verifications WHERE token = ? AND expires_at > datetime('now')"
      ).get(token) as { id: number; user_id: number } | undefined;

      if (!row) {
        return res.status(400).json({ error: "Invalid or expired verification link." });
      }

      db.prepare("UPDATE users SET email_verified = 1, updated_at = datetime('now') WHERE id = ?").run(row.user_id);
      db.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(row.user_id);

      res.json({ ok: true, message: "Email verified successfully!" });
    } catch (err: any) {
      console.error("Verify email error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  // DELETE /api/auth/account — delete the logged-in user's account (GDPR)
  router.delete("/account", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as AuthUser;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: "Password is required to confirm account deletion." });
      }

      // Verify password
      const row = db.prepare("SELECT password FROM users WHERE id = ?").get(user.id) as { password: string } | undefined;
      if (!row || !(await bcrypt.compare(password, row.password))) {
        return res.status(401).json({ error: "Incorrect password." });
      }

      // Anonymize orders (keep for business records, remove PII)
      db.prepare("UPDATE orders SET email = '[deleted]', stripe_customer_id = NULL WHERE user_id = ?").run(user.id);
      db.prepare("UPDATE orders SET user_id = NULL WHERE user_id = ?").run(user.id);

      // Delete user (cascades to sessions, password_resets, email_verifications)
      db.prepare("DELETE FROM users WHERE id = ?").run(user.id);

      // Clear session cookie
      res.clearCookie(SESSION_COOKIE, { path: "/" });
      res.json({ ok: true, message: "Your account has been permanently deleted." });
    } catch (err: any) {
      console.error("Account deletion error:", err);
      res.status(500).json({ error: "Failed to delete account" });
    }
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
