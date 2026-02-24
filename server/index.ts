import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { stripeRouter } from "./stripe.js";
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

  // Parse JSON for all other routes
  app.use(express.json());

  // Stripe API routes
  app.use("/api/stripe", stripeRouter);

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
