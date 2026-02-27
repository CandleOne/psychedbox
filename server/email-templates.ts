/**
 * server/email-templates.ts
 * HTML email templates for PsychedBox transactional & marketing emails.
 *
 * All templates use inline CSS for maximum email client compatibility.
 */

// ── Shared layout wrapper ───────────────────────────────────────────────────

function layout(content: string, siteUrl: string, footerExtra = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PsychedBox</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF6B6B 0%,#9b59b6 100%);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                PsychedBox
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#fafafa;border-top:1px solid #e5e5e5;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#888;">
                PsychedBox — Curated psychedelic wellness, delivered.
              </p>
              ${footerExtra}
              <p style="margin:8px 0 0;font-size:12px;color:#aaa;">
                <a href="${siteUrl}" style="color:#FF6B6B;text-decoration:none;">psychedbox.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
  <tr>
    <td style="background-color:#FF6B6B;border-radius:8px;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">
        ${text}
      </a>
    </td>
  </tr>
</table>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Templates ───────────────────────────────────────────────────────────────

/** Welcome email sent after user signup */
export function welcomeEmail(name: string, siteUrl: string): string {
  const displayName = name || "there";
  return layout(
    `<h2 style="margin:0 0 16px;font-size:22px;color:#1a1a1a;">Welcome aboard, ${escapeHtml(displayName)}! 🎉</h2>
<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#444;">
  Thanks for joining PsychedBox! You're now part of a growing community dedicated to mindful exploration and psychedelic wellness.
</p>
<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#444;">
  Here's what you can do next:
</p>
<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.8;color:#444;">
  <li>🛍️ Browse our <a href="${siteUrl}/shop" style="color:#FF6B6B;text-decoration:none;font-weight:600;">curated shop</a></li>
  <li>📦 Check out our <a href="${siteUrl}/pricing" style="color:#FF6B6B;text-decoration:none;font-weight:600;">subscription plans</a></li>
  <li>📖 Read the latest on our <a href="${siteUrl}/blog" style="color:#FF6B6B;text-decoration:none;font-weight:600;">blog</a></li>
</ul>
${button("Explore PsychedBox", siteUrl)}
<p style="margin:0;font-size:14px;color:#888;">
  Questions? Just reply to this email — we'd love to hear from you.
</p>`,
    siteUrl
  );
}

/** Welcome email sent when someone subscribes to the newsletter */
export function subscriberWelcomeEmail(email: string, siteUrl: string): string {
  return layout(
    `<h2 style="margin:0 0 16px;font-size:22px;color:#1a1a1a;">You're on the list! ✨</h2>
<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#444;">
  Thanks for subscribing to the PsychedBox newsletter! You'll be the first to hear about new products, exclusive content, community events, and more.
</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">
  In the meantime, come explore what PsychedBox is all about:
</p>
${button("Visit PsychedBox", siteUrl)}
<p style="margin:0;font-size:14px;color:#888;">
  You subscribed with <strong>${escapeHtml(email)}</strong>.
</p>`,
    siteUrl,
    `<p style="margin:4px 0 0;font-size:11px;color:#bbb;">
      You received this because you subscribed at psychedbox.com.
    </p>`
  );
}

/** Order confirmation after a successful Stripe checkout */
export function orderConfirmationEmail(
  name: string,
  order: { planOrProduct: string; amount: string; sessionId: string },
  siteUrl: string
): string {
  const displayName = name || "there";
  return layout(
    `<h2 style="margin:0 0 16px;font-size:22px;color:#1a1a1a;">Order Confirmed! 🎁</h2>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">
  Hey ${escapeHtml(displayName)}, thanks for your purchase! Here are your order details:
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
  <tr style="background-color:#fafafa;">
    <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#666;border-bottom:1px solid #e5e5e5;">Item</td>
    <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#666;border-bottom:1px solid #e5e5e5;text-align:right;">Amount</td>
  </tr>
  <tr>
    <td style="padding:14px 16px;font-size:15px;color:#1a1a1a;">${escapeHtml(order.planOrProduct)}</td>
    <td style="padding:14px 16px;font-size:15px;color:#1a1a1a;text-align:right;font-weight:700;">${escapeHtml(order.amount)}</td>
  </tr>
</table>
<p style="margin:0 0 8px;font-size:13px;color:#888;">
  Order reference: ${escapeHtml(order.sessionId.slice(-12))}
</p>
${button("View Your Account", `${siteUrl}/account`)}
<p style="margin:0;font-size:14px;color:#888;">
  If you have any questions about your order, just reply to this email.
</p>`,
    siteUrl
  );
}

/** Payment failed notification */
export function paymentFailedEmail(
  name: string,
  attemptCount: number,
  siteUrl: string
): string {
  const displayName = name || "there";
  return layout(
    `<h2 style="margin:0 0 16px;font-size:22px;color:#e74c3c;">Payment Issue ⚠️</h2>
<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#444;">
  Hey ${escapeHtml(displayName)}, we had trouble processing your latest payment (attempt ${attemptCount}).
</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">
  Please update your payment method to keep your subscription active. You can manage your billing details from your account page:
</p>
${button("Update Payment Method", `${siteUrl}/account`)}
<p style="margin:0;font-size:14px;color:#888;">
  If you believe this is an error, please reply to this email and we'll help sort it out.
</p>`,
    siteUrl
  );
}

/** Newsletter email — wraps custom HTML content in the branded layout */
export function newsletterEmail(
  subject: string,
  bodyHtml: string,
  siteUrl: string
): string {
  return layout(
    `<h2 style="margin:0 0 20px;font-size:22px;color:#1a1a1a;">${escapeHtml(subject)}</h2>
<div style="font-size:15px;line-height:1.7;color:#444;">
  ${bodyHtml}
</div>`,
    siteUrl,
    `<p style="margin:4px 0 0;font-size:11px;color:#bbb;">
      You received this because you're subscribed to the PsychedBox newsletter.
    </p>`
  );
}

/** Blog update notification */
export function blogUpdateEmail(
  post: { title: string; slug: string; description: string; author: string },
  siteUrl: string
): string {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  return layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">New on the Blog 📝</h2>
<h3 style="margin:0 0 12px;font-size:20px;color:#333;">
  <a href="${postUrl}" style="color:#FF6B6B;text-decoration:none;">${escapeHtml(post.title)}</a>
</h3>
<p style="margin:0 0 4px;font-size:13px;color:#888;">By ${escapeHtml(post.author)}</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#444;">
  ${escapeHtml(post.description)}
</p>
${button("Read the Full Post", postUrl)}`,
    siteUrl,
    `<p style="margin:4px 0 0;font-size:11px;color:#bbb;">
      You received this because you're subscribed to PsychedBox updates.
    </p>`
  );
}
