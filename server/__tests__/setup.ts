/**
 * Test setup — runs before all test files.
 * Mocks email (no real emails sent) and provides a fresh in-memory DB.
 */
import { vi, beforeEach } from "vitest";

// ── Mock email module ────────────────────────────────────────────────────────
// Prevents actual SMTP calls during tests.
vi.mock("../email.js", () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
  sendEmailVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendSubscriberWelcomeEmail: vi.fn().mockResolvedValue(undefined),
  sendOrderConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendPaymentFailedEmail: vi.fn().mockResolvedValue(undefined),
  sendNewsletterEmail: vi.fn().mockResolvedValue(undefined),
  sendBlogUpdateEmail: vi.fn().mockResolvedValue(undefined),
  sendBulkEmail: vi.fn().mockResolvedValue(undefined),
}));

// ── Set dummy env vars ───────────────────────────────────────────────────────
process.env.STRIPE_SECRET_KEY = "sk_test_fake";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_fake";
process.env.NODE_ENV = "test";
