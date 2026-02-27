import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { createPaymentRouter } from "./payments.js";
import { createAuthRouter, authMiddleware } from "./auth.js";
import { createAdminRouter } from "./admin.js";
import { createPublicRouter } from "./public.js";
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
