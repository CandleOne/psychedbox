/**
 * Test helper — creates a lightweight Express app with auth & public routes
 * wired up, backed by the real SQLite database (which uses data/ dir).
 */
import express from "express";
import cookieParser from "cookie-parser";
import { createAuthRouter, authMiddleware } from "../auth.js";
import { createPublicRouter } from "../public.js";
import { createPaymentRouter } from "../payments.js";

/**
 * Creates a fresh Express app with middleware + routes for testing.
 * Does NOT start listening — use with supertest's `request(app)`.
 */
export function createTestApp() {
  const app = express();

  // Body parsing (skip raw webhook path, same as production)
  app.use((req, res, next) => {
    if (req.path === "/api/payments/webhook") return next();
    express.json()(req, res, next);
  });
  app.use(cookieParser());
  app.use(authMiddleware);

  app.use("/api/payments", createPaymentRouter());
  app.use("/api/auth", createAuthRouter());
  app.use("/api", createPublicRouter());

  // Global error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (!res.headersSent) {
      res.status(err.status || 500).json({ error: "Internal server error" });
    }
  });

  return app;
}
