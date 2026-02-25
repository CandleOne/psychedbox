import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { stripeRouter } from "./stripe.js";
import { createPaymentRouter } from "./payments.js";
import { createAuthRouter, authMiddleware } from "./auth.js";
import { createAdminRouter } from "./admin.js";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ⚠️  Webhook route MUST come before express.json() middleware
  // Stripe needs the raw body buffer for signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => {
      // Pass raw buffer to router
      next();
    }
  );

  // Parse JSON and cookies for all other routes
  app.use(express.json());
  app.use(cookieParser());

  // Auth middleware — attaches req.user on every request
  app.use(authMiddleware);

  // Stripe API routes
  app.use("/api/stripe", stripeRouter);

  // Payments API routes (shop products, plans, portal)
  app.use("/api/payments", createPaymentRouter());

  // Auth API routes (signup, login, logout, me)
  app.use("/api/auth", createAuthRouter());

  // Admin API routes (requires admin role)
  app.use("/api/admin", createAdminRouter());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

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
