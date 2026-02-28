/**
 * server/email.ts
 * Email service using Nodemailer with Mango Mail SMTP.
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import {
  welcomeEmail,
  subscriberWelcomeEmail,
  orderConfirmationEmail,
  paymentFailedEmail,
  newsletterEmail,
  blogUpdateEmail,
  passwordResetEmail,
  emailVerificationEmail,
} from "./email-templates.js";

// ── Transporter (lazy-initialized) ──────────────────────────────────────────

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!_transporter) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error(
        "SMTP_HOST, SMTP_USER, and SMTP_PASS must be set in environment variables"
      );
    }

    _transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (implicit TLS), false for 587 (STARTTLS)
      auth: { user, pass },
    });
  }
  return _transporter;
}

const FROM_ADDRESS = process.env.SMTP_FROM || "PsychedBox <contact@psychedbox.com>";
const SITE_URL = process.env.SITE_URL || "https://psychedbox.com";

// ── Send helpers ────────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const info = await getTransporter().sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    console.log(`[Email] ✉️  Sent "${subject}" to ${to} — messageId=${info.messageId}`);
    return true;
  } catch (err: any) {
    console.error(`[Email] ❌ Failed to send "${subject}" to ${to}:`, err.message);
    return false;
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Send welcome email when a new user signs up */
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  return send(to, "Welcome to PsychedBox! 🎉", welcomeEmail(name, SITE_URL));
}

/** Send welcome email when someone subscribes to the newsletter */
export async function sendSubscriberWelcomeEmail(to: string): Promise<boolean> {
  return send(
    to,
    "You're subscribed to PsychedBox! ✨",
    subscriberWelcomeEmail(to, SITE_URL)
  );
}

/** Send order confirmation after a successful Stripe checkout */
export async function sendOrderConfirmationEmail(
  to: string,
  name: string,
  orderDetails: {
    planOrProduct: string;
    amount: string;
    sessionId: string;
  }
): Promise<boolean> {
  return send(
    to,
    `Order Confirmed — ${orderDetails.planOrProduct}`,
    orderConfirmationEmail(name, orderDetails, SITE_URL)
  );
}

/** Send payment failed notification */
export async function sendPaymentFailedEmail(
  to: string,
  name: string,
  attemptCount: number
): Promise<boolean> {
  return send(
    to,
    "Action Required — Payment Failed",
    paymentFailedEmail(name, attemptCount, SITE_URL)
  );
}

/** Send a newsletter to a single recipient */
export async function sendNewsletterEmail(
  to: string,
  subject: string,
  bodyHtml: string
): Promise<boolean> {
  return send(to, subject, newsletterEmail(subject, bodyHtml, SITE_URL));
}

/** Send a blog update notification to a single recipient */
export async function sendBlogUpdateEmail(
  to: string,
  post: { title: string; slug: string; description: string; author: string }
): Promise<boolean> {
  return send(
    to,
    `New Post: ${post.title}`,
    blogUpdateEmail(post, SITE_URL)
  );
}

/** Send password reset email */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
): Promise<boolean> {
  return send(
    to,
    "Reset Your Password — PsychedBox",
    passwordResetEmail(name, resetUrl, SITE_URL)
  );
}

/** Send email verification email */
export async function sendEmailVerificationEmail(
  to: string,
  name: string,
  verifyUrl: string
): Promise<boolean> {
  return send(
    to,
    "Verify Your Email — PsychedBox",
    emailVerificationEmail(name, verifyUrl, SITE_URL)
  );
}

/** Send a newsletter or blog update to all subscribers (batched) */
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  htmlBuilder: (email: string) => string,
  { batchSize = 10, delayMs = 1000 } = {}
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((email) => send(email, subject, htmlBuilder(email)))
    );

    for (const r of results) {
      if (r.status === "fulfilled" && r.value) sent++;
      else failed++;
    }

    // Throttle between batches to avoid SMTP rate limits
    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.log(`[Email] Bulk send complete: ${sent} sent, ${failed} failed out of ${recipients.length}`);
  return { sent, failed };
}
