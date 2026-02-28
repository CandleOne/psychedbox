import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import db from "../db.js";
import { createTestApp } from "./helpers.js";

const app = createTestApp();

function cleanDb() {
  db.exec("DELETE FROM subscribers");
  db.exec("DELETE FROM blog_posts");
}

describe("Public Routes", () => {
  beforeEach(cleanDb);

  // ── Newsletter Subscribe ────────────────────────────────────────────────

  describe("POST /api/subscribe", () => {
    it("subscribes a new email", async () => {
      const res = await request(app)
        .post("/api/subscribe")
        .send({ email: "sub@example.com" });
      expect(res.status).toBe(201);
      expect(res.body.ok).toBe(true);
    });

    it("rejects duplicate subscriber", async () => {
      await request(app).post("/api/subscribe").send({ email: "dup@example.com" });
      const res = await request(app)
        .post("/api/subscribe")
        .send({ email: "dup@example.com" });
      expect(res.status).toBe(409);
    });

    it("is case-insensitive", async () => {
      await request(app).post("/api/subscribe").send({ email: "case@example.com" });
      const res = await request(app)
        .post("/api/subscribe")
        .send({ email: "CASE@example.com" });
      expect(res.status).toBe(409);
    });

    it("rejects missing email", async () => {
      const res = await request(app).post("/api/subscribe").send({});
      expect(res.status).toBe(400);
    });

    it("rejects invalid email", async () => {
      const res = await request(app)
        .post("/api/subscribe")
        .send({ email: "not-an-email" });
      expect(res.status).toBe(400);
    });

    it("accepts optional source", async () => {
      const res = await request(app)
        .post("/api/subscribe")
        .send({ email: "source@example.com", source: "footer" });
      expect(res.status).toBe(201);

      const row = db.prepare("SELECT source FROM subscribers WHERE email = ?").get("source@example.com") as any;
      expect(row.source).toBe("footer");
    });
  });

  // ── Blog API ────────────────────────────────────────────────────────────

  describe("GET /api/blog", () => {
    it("returns empty array when no posts", async () => {
      const res = await request(app).get("/api/blog");
      expect(res.status).toBe(200);
      expect(res.body.posts).toEqual([]);
    });

    it("returns only published posts", async () => {
      db.prepare(
        `INSERT INTO blog_posts (slug, title, description, body, published) VALUES (?, ?, ?, ?, ?)`
      ).run("published-post", "Published", "A published post", "[]", 1);

      db.prepare(
        `INSERT INTO blog_posts (slug, title, description, body, published) VALUES (?, ?, ?, ?, ?)`
      ).run("draft-post", "Draft", "A draft post", "[]", 0);

      const res = await request(app).get("/api/blog");
      expect(res.status).toBe(200);
      expect(res.body.posts).toHaveLength(1);
      expect(res.body.posts[0].slug).toBe("published-post");
    });
  });
});
