import { createRoot } from "react-dom/client";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { adManager } from "@/ads/ad-manager";

// When VITE_API_BASE_URL is set (mobile APK builds), point all /api/* calls
// to the absolute URL instead of the relative path used in browser dev mode.
const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "");
if (apiBase) {
  setBaseUrl(apiBase);
  // eslint-disable-next-line no-console
  console.info("[TrueConcept] Using API base URL:", apiBase);

  // Patch window.fetch so direct fetch("/api/...") calls (e.g. in the login
  // page) also get redirected to the API base URL. Without this, those calls
  // would hit the Capacitor local server and receive index.html as response.
  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const rewrite = (url: string) =>
      url.startsWith("/api/") ? `${apiBase}${url}` : url;

    if (typeof input === "string") {
      return originalFetch(rewrite(input), init);
    }
    if (input instanceof URL) {
      if (input.pathname.startsWith("/api/") && input.origin === window.location.origin) {
        return originalFetch(`${apiBase}${input.pathname}${input.search}${input.hash}`, init);
      }
      return originalFetch(input, init);
    }
    if (input instanceof Request) {
      const u = new URL(input.url, window.location.href);
      if (u.pathname.startsWith("/api/") && u.origin === window.location.origin) {
        return originalFetch(new Request(`${apiBase}${u.pathname}${u.search}`, input), init);
      }
      return originalFetch(input, init);
    }
    return originalFetch(input as RequestInfo, init);
  }) as typeof window.fetch;
}

const isCapacitor = typeof (window as any).Capacitor !== "undefined";

// Tag <html> when running inside Capacitor so CSS can apply a fallback
// status-bar inset. Android WebView only returns a non-zero value for
// env(safe-area-inset-top) on notched devices — regular tablets without a
// cutout report 0, causing the header to overlap the system status bar.
if (isCapacitor) {
  document.documentElement.classList.add("is-capacitor");
}

// In Capacitor: forcibly remove any cached service worker. PWA SWs intercept
// fetch() and break Capacitor's cross-origin API calls.
if (isCapacitor && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
  if ("caches" in window) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  }
}

// Only register the PWA service worker in a real browser, never inside Capacitor.
if (!isCapacitor && "serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => { /* no-op */ });
  });
}

// Android back button — works when running inside Capacitor.
const CapApp = (window as any).Capacitor?.Plugins?.App;
if (CapApp) {
  CapApp.addListener("backButton", ({ canGoBack }: { canGoBack: boolean }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      CapApp.exitApp();
    }
  });
}

setAuthTokenGetter(() => localStorage.getItem("trueconcept_token"));

// Fire-and-forget AdMob (Android) / AdSense (web) SDK initialization.
// On Android this loads the Google Mobile Ads SDK; on the web it's currently
// a no-op stub. Failure here MUST NOT block app boot — the provider is
// internally failsafe.
void adManager.initialize().catch((err) => {
  console.warn("[ads] manager initialize threw (ignored):", err);
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Missing root element with id "root".');
}

const root = createRoot(rootElement);

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack || `${error.name}: ${error.message}`;
  }
  if (typeof error === "string") {
    return error;
  }
  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

function showStartupError(title: string, error: unknown): void {
  const details = formatError(error);
  root.render(
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: "min(960px, 100%)",
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(148,163,184,0.35)",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(15,23,42,0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, #da6b45, #fbbf24)",
            color: "#fff",
            fontWeight: 800,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ margin: "0 0 12px", color: "#334155", fontWeight: 600 }}>
            The frontend failed during startup. The error details are below.
          </p>
          <pre
            style={{
              margin: 0,
              padding: "16px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              borderRadius: "12px",
              background: "#0f172a",
              color: "#e2e8f0",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            {details}
          </pre>
        </div>
      </div>
    </div>,
  );
}

window.addEventListener("error", (event) => {
  showStartupError("Unhandled Error", event.error ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showStartupError("Unhandled Promise Rejection", event.reason);
});

async function bootstrap() {
  const mod = await import("./App");
  root.render(<mod.default />);
}

void bootstrap().catch((error) => {
  showStartupError("Application Startup Failed", error);
});
