import { describe, it, expect } from "vitest";
import request from "supertest";
import { PLANS, SHOP_PRODUCTS } from "../../shared/payments.js";
import { createTestApp } from "./helpers.js";

const app = createTestApp();

describe("Payment Data Integrity", () => {
  describe("PLANS", () => {
    it("has exactly 5 plans", () => {
      expect(PLANS).toHaveLength(5);
    });

    it("has unique IDs", () => {
      const ids = PLANS.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all plans have required fields", () => {
      for (const plan of PLANS) {
        expect(plan.id).toBeTruthy();
        expect(plan.name).toBeTruthy();
        expect(typeof plan.price).toBe("number");
        expect(plan.price).toBeGreaterThanOrEqual(0);
        expect(plan.displayPrice).toBeTruthy();
        expect(["month", "quarter", "year", "one_time"]).toContain(plan.interval);
        expect(plan.features.length).toBeGreaterThan(0);
      }
    });

    it("donation plan has zero base price", () => {
      const donation = PLANS.find((p) => p.id === "donation");
      expect(donation).toBeDefined();
      expect(donation!.price).toBe(0);
    });

    it("quarterly plan is marked popular", () => {
      const quarterly = PLANS.find((p) => p.id === "quarterly");
      expect(quarterly?.popular).toBe(true);
    });
  });

  describe("SHOP_PRODUCTS", () => {
    it("has unique IDs", () => {
      const ids = SHOP_PRODUCTS.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all products have positive prices", () => {
      for (const product of SHOP_PRODUCTS) {
        expect(product.price).toBeGreaterThan(0);
        expect(product.name).toBeTruthy();
        expect(product.id).toBeTruthy();
      }
    });

    it("prices are in cents (>= $10)", () => {
      for (const product of SHOP_PRODUCTS) {
        expect(product.price).toBeGreaterThanOrEqual(1000);
      }
    });
  });
});

describe("Checkout Auth Guard", () => {
  it("POST /api/payments/create-checkout returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/payments/create-checkout")
      .send({ planId: "monthly" });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/authentication/i);
  });

  it("POST /api/payments/create-product-checkout returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/payments/create-product-checkout")
      .send({ productId: "ceremony-bundle" });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/authentication/i);
  });

  it("POST /api/payments/create-cart-checkout returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/payments/create-cart-checkout")
      .send({ items: [{ productId: "ceremony-bundle", quantity: 1 }] });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/authentication/i);
  });

  it("GET /api/payments/plans does not require auth", async () => {
    const res = await request(app).get("/api/payments/plans");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
