import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";

const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    VitePWA({
      registerType: "autoUpdate",
      // Don't auto-register the service worker — we handle registration
      // manually in main.tsx so we can opt out inside Capacitor.
      injectRegister: false,
      includeAssets: ["favicon.svg", "icons/icon.svg"],
      manifest: {
        name: "TRUE CONCEPT",
        short_name: "TrueConcept",
        description: "NCERT Class IX & X Learning Portal — Notes, MCQs, Q&A, Virtual Lab",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#0c0920",
        theme_color: "#da6b45",
        lang: "en-IN",
        categories: ["education"],
        icons: [
          { src: "/icons/icon-72.png",  sizes: "72x72",   type: "image/png" },
          { src: "/icons/icon-96.png",  sizes: "96x96",   type: "image/png" },
          { src: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon-152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/icons/icon-384.png", sizes: "384x384", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          { src: "/icons/icon.svg",     sizes: "any",      type: "image/svg+xml", purpose: "any maskable" },
        ],
        shortcuts: [
          { name: "Subjects",    url: "/subjects",    description: "Browse all subjects" },
          { name: "Virtual Lab", url: "/virtual-lab", description: "Interactive Virtual Lab" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path: string) => {
          // Firebase emulator URL format: /PROJECT_ID/REGION/FUNCTION_NAME/original/path
          const PROJECT = "true-concept-353c9";
          const REGION = "asia-south1";

          // Map each /api/* prefix to its Firebase Function name
          const routes: Record<string, string> = {
            "/api/auth": "auth",
            "/api/subjects": "subjects",
            "/api/chapters": "chapters",
            "/api/notes": "content",
            "/api/mcqs": "content",
            "/api/qa": "content",
            "/api/videos": "content",
            "/api/experiments": "experiments",
            "/api/progress": "progress",
            "/api/dashboard": "dashboard",
            "/api/search": "search",
            "/api/students": "students",
            "/api/healthz": "health",
            "/api/ai": "aiMentor",
          };

          for (const [prefix, fn] of Object.entries(routes)) {
            if (path === prefix || path.startsWith(prefix + "/") || path.startsWith(prefix + "?")) {
              return `/${PROJECT}/${REGION}/${fn}${path}`;
            }
          }
          return path;
        },
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
