import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ── Sentry client-side error tracking ─────────────────────────────────
// Set VITE_SENTRY_DSN in your .env to activate.
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0,    // don't record normal sessions
    replaysOnErrorSampleRate: 1.0,  // always record sessions with errors
  });
}

createRoot(document.getElementById("root")!).render(<App />);
