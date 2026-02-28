import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import db from "../db.js";
import { createTestApp } from "./helpers.js";

const app = createTestApp();

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Clean relevant tables between tests for isolation */
function cleanDb() {
  db.exec("DELETE FROM sessions");
  db.exec("DELETE FROM email_verifications");
  db.exec("DELETE FROM password_resets");
  db.exec("DELETE FROM users");
}

/** Sign up a user and return the session cookie */
async function signupUser(email = "test@example.com", password = "Test1234!", name = "Tester") {
  const res = await request(app)
    .post("/api/auth/signup")
    .send({ email, password, name });
  const cookies = res.headers["set-cookie"];
  return { res, cookies };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("Auth Routes", () => {
  beforeEach(cleanDb);

  // ── Signup ──────────────────────────────────────────────────────────────

  describe("POST /api/auth/signup", () => {
    it("creates a new user and returns 201", async () => {
      const { res } = await signupUser();
      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.user.name).toBe("Tester");
      expect(res.body.user.role).toBe("user");
    });

    it("sets a session cookie", async () => {
      const { res } = await signupUser();
      expect(res.headers["set-cookie"]).toBeDefined();
      const cookie = res.headers["set-cookie"]![0];
      expect(cookie).toContain("pb_session=");
      expect(cookie).toContain("HttpOnly");
    });

    it("rejects duplicate email", async () => {
      await signupUser("dupe@test.com");
      const res2 = await request(app)
        .post("/api/auth/signup")
        .send({ email: "dupe@test.com", password: "Test1234!", name: "Dupe" });
      expect(res2.status).toBe(409);
      expect(res2.body.error).toContain("already exists");
    });

    it("rejects short password", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "short@test.com", password: "abc", name: "Short" });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("8 characters");
    });

    it("rejects missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({});
      expect(res.status).toBe(400);
    });
  });

  // ── Login ───────────────────────────────────────────────────────────────

  describe("POST /api/auth/login", () => {
    it("logs in with valid credentials", async () => {
      await signupUser("login@test.com", "MyPassword8!");
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "login@test.com", password: "MyPassword8!" });
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("login@test.com");
    });

    it("rejects wrong password", async () => {
      await signupUser("wrong@test.com", "CorrectPass1!");
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@test.com", password: "WrongPass1!" });
      expect(res.status).toBe(401);
    });

    it("rejects non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@test.com", password: "Whatever1!" });
      expect(res.status).toBe(401);
    });
  });

  // ── Me ──────────────────────────────────────────────────────────────────

  describe("GET /api/auth/me", () => {
    it("returns user when authenticated", async () => {
      const { cookies } = await signupUser("me@test.com");
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", cookies!);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("me@test.com");
    });

    it("returns 401 without session", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });
  });

  // ── Logout ──────────────────────────────────────────────────────────────

  describe("POST /api/auth/logout", () => {
    it("clears the session", async () => {
      const { cookies } = await signupUser("logout@test.com");
      const logoutRes = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", cookies!);
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.ok).toBe(true);

      // Session should be invalid now
      const meRes = await request(app)
        .get("/api/auth/me")
        .set("Cookie", cookies!);
      expect(meRes.status).toBe(401);
    });
  });

  // ── Forgot / Reset Password ─────────────────────────────────────────────

  describe("Password Reset Flow", () => {
    it("forgot-password always returns 200 (no email enumeration)", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "noone@test.com" });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });

    it("can reset password with valid token", async () => {
      await signupUser("reset@test.com", "OldPassword1!");

      // Trigger forgot-password
      await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "reset@test.com" });

      // Get token from DB
      const row = db.prepare(
        "SELECT token FROM password_resets WHERE used = 0 ORDER BY id DESC LIMIT 1"
      ).get() as { token: string };

      // Reset with the token
      const resetRes = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: row.token, password: "NewPassword1!" });
      expect(resetRes.status).toBe(200);
      expect(resetRes.body.ok).toBe(true);

      // Can login with new password
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "reset@test.com", password: "NewPassword1!" });
      expect(loginRes.status).toBe(200);
    });

    it("rejects expired/invalid token", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "invalid-token", password: "NewPass123!" });
      expect(res.status).toBe(400);
    });
  });

  // ── Email Verification ──────────────────────────────────────────────────

  describe("Email Verification", () => {
    it("verifies email with valid token", async () => {
      const { cookies } = await signupUser("verify@test.com");

      // Get verification token from DB
      const row = db.prepare(
        "SELECT token FROM email_verifications ORDER BY id DESC LIMIT 1"
      ).get() as { token: string };

      const res = await request(app)
        .post("/api/auth/verify-email")
        .send({ token: row.token });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);

      // User should now be verified
      const meRes = await request(app)
        .get("/api/auth/me")
        .set("Cookie", cookies!);
      expect(meRes.body.user.email_verified).toBe(true);
    });

    it("rejects invalid verification token", async () => {
      const res = await request(app)
        .post("/api/auth/verify-email")
        .send({ token: "bogus" });
      expect(res.status).toBe(400);
    });
  });

  // ── Account Deletion ────────────────────────────────────────────────────

  describe("DELETE /api/auth/account", () => {
    it("deletes account with correct password", async () => {
      const { cookies } = await signupUser("delete@test.com", "DeleteMe1!");
      const res = await request(app)
        .delete("/api/auth/account")
        .set("Cookie", cookies!)
        .send({ password: "DeleteMe1!" });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);

      // User should no longer exist
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "delete@test.com", password: "DeleteMe1!" });
      expect(loginRes.status).toBe(401);
    });

    it("rejects wrong password", async () => {
      const { cookies } = await signupUser("nodelete@test.com", "KeepMe123!");
      const res = await request(app)
        .delete("/api/auth/account")
        .set("Cookie", cookies!)
        .send({ password: "WrongPassword!" });
      expect(res.status).toBe(401);
    });

    it("requires authentication", async () => {
      const res = await request(app)
        .delete("/api/auth/account")
        .send({ password: "doesntmatter" });
      expect(res.status).toBe(401);
    });
  });
});
