# TRUE CONCEPT — Complete Codebase Documentation

> This document is the single source of truth for any developer joining the project.
> Read it top-to-bottom once before touching any code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Tech Stack](#3-tech-stack)
4. [How to Run Locally](#4-how-to-run-locally)
5. [Frontend — `artifacts/true-concept`](#5-frontend--artifactstrue-concept)
6. [Backend — Firebase Functions (`functions/`)](#6-backend--firebase-functions-functions)
7. [Shared Libraries — `lib/`](#7-shared-libraries--lib)
8. [Authentication Flow](#8-authentication-flow)
9. [Design System](#9-design-system)
10. [Virtual Lab System](#10-virtual-lab-system)
11. [Firestore Data Model](#11-firestore-data-model)
12. [Mobile / APK Build](#12-mobile--apk-build)
13. [Key Utility Modules](#13-key-utility-modules)
14. [Code Style Guide](#14-code-style-guide)
15. [Environment Variables Reference](#15-environment-variables-reference)
16. [Common Gotchas & Hard-Won Fixes](#16-common-gotchas--hard-won-fixes)

---

## 1. Project Overview

**TRUE CONCEPT** is an NCERT-aligned Science learning platform for Class IX and X students in Assam. It is a full-stack web app that also ships as an Android APK via Capacitor.

Core features:
- Subject → Chapter → Notes / MCQ / Q&A reading flow
- Interactive Virtual Science Lab (60+ physics & chemistry simulations)
- Phone OTP login for students (Firebase Auth), password login for admins
- Admin panel to manage subjects, chapters, experiments, and view student registrations
- PWA (installable on Android/iOS from browser) + native APK

---

## 2. Monorepo Structure

The repo uses **pnpm workspaces**. All packages live under `artifacts/`, `functions/`, `lib/`, `mobile/`, and `scripts/`.

```
Web-App-Assets/
├── pnpm-workspace.yaml          ← workspace config + shared dep catalog
├── tsconfig.base.json           ← shared TS base config
├── firebase.json                ← Functions config + Hosting rewrites
│
├── artifacts/
│   └── true-concept/            ← React frontend (Vite + Tailwind + PWA)
│
├── functions/                   ← Firebase Functions (serverless backend)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts             ← Re-exports all 10 functions
│       ├── middleware/
│       │   └── auth.ts          ← JWT auth (signToken, requireAuth, requireAdmin)
│       ├── utils/
│       │   ├── cors.ts          ← CORS preflight handler
│       │   └── router.ts       ← Sub-path parser + param extraction
│       └── routes/
│           ├── auth.ts          ← /api/auth/* (login, phone-login, logout, me)
│           ├── subjects.ts      ← /api/subjects (CRUD)
│           ├── chapters.ts      ← /api/chapters (CRUD + enrichment)
│           ├── content.ts       ← /api/notes, /api/mcqs, /api/qa, /api/videos
│           ├── experiments.ts   ← /api/experiments (CRUD)
│           ├── progress.ts      ← /api/progress (read, mcq-score, mark-chapter)
│           ├── dashboard.ts     ← /api/dashboard/summary
│           ├── search.ts        ← /api/search
│           ├── students.ts      ← /api/students (admin only)
│           └── health.ts        ← /api/healthz
│
├── lib/
│   ├── db/                      ← Firebase Admin init + Firestore exports
│   ├── api-client-react/        ← Orval-generated API hooks + custom fetch layer
│   ├── api-spec/                ← OpenAPI YAML spec (source of truth for API contract)
│   └── api-zod/                 ← Zod validation schemas
│
├── mobile/
│   ├── capacitor.config.json    ← Capacitor mobile configuration
│   ├── build.mjs                ← Full APK build pipeline script
│   └── android/                 ← Android native project (Gradle + Java)
│
└── scripts/                     ← Utility scripts (seed, etc.)
```

### `pnpm-workspace.yaml` — key rules

```yaml
packages:
  - "artifacts/*"
  - "lib/*"
  - "lib/integrations/*"
  - "scripts"
  - "functions"

catalog:
  react: "^19.1.0"
  vite: "^7.3.0"
  tailwindcss: "^4.1.14"
  typescript: "^5.8.3"
  # ... all shared deps pinned here

onlyBuiltDependencies:
  - "@replit/vite-plugin-cartographer"
  # Supply-chain safety: new packages must be ≥1 day old
```

Cross-package imports use the `@workspace/` prefix defined in each `package.json`'s `name` field. Example: `import { db } from "@workspace/db"`.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (new `@import "tailwindcss"` syntax) |
| Routing | Wouter (lightweight, no React Router) |
| Server state | TanStack React Query v5 |
| Animations | Framer Motion |
| API client | Orval-generated hooks (`@workspace/api-client-react`) |
| Backend | Firebase Functions v2 (serverless, `onRequest`) |
| Auth | Firebase Phone Auth (students) + custom JWT (server-signed) |
| Database | Firestore (Firebase) |
| File storage | Google Cloud Storage |
| Mobile | Capacitor v6 (Android APK) |
| PWA | vite-plugin-pwa + Workbox |

---

## 4. How to Run Locally

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- Firebase CLI (`npm install -g firebase-tools`)
- A `.env` file inside `functions/` with `SESSION_SECRET` and `FIREBASE_SERVICE_ACCOUNT_KEY` (see §15)

### Build the functions

```powershell
cd functions
pnpm run build
```

This compiles TypeScript from `functions/src/` into `functions/lib/`.

### Start Firebase Emulators (backend)

```powershell
# From the project root
firebase emulators:start --only functions
# Functions emulator runs on http://localhost:5001
# Emulator UI at http://localhost:4000
```

The emulator loads environment variables from `functions/.env` automatically.

### Start the frontend

```powershell
cd artifacts/true-concept
pnpm dev
# Runs on http://localhost:5173
# /api requests are proxied to localhost:5001 by Vite
```

Open `http://localhost:5173` in the browser.

### Deploy functions to production

```powershell
# From the project root
firebase deploy --only functions
# All 10 functions deploy to asia-south1 (Mumbai)
```

---

## 5. Frontend — `artifacts/true-concept`

### Entry Point: `src/main.tsx`

This is the very first file that runs. It does several critical things **before** rendering the React tree:

```typescript
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

// 1. Mobile API routing — baked in at build time via VITE_API_BASE_URL
const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
if (apiBase) {
  setBaseUrl(apiBase);

  // 2. Patch window.fetch so direct fetch("/api/...") calls also get redirected
  //    Without this, login.tsx's raw fetch() calls would hit Capacitor's local
  //    server and get back index.html instead of JSON.
  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input, init) => {
    const rewrite = (url: string) =>
      url.startsWith("/api/") ? `${apiBase}${url}` : url;

    if (typeof input === "string") return originalFetch(rewrite(input), init);
    if (input instanceof URL && input.pathname.startsWith("/api/"))
      return originalFetch(`${apiBase}${input.pathname}${input.search}${input.hash}`, init);
    if (input instanceof Request) { /* similar URL rewrite logic */ }
    return originalFetch(input as RequestInfo, init);
  }) as typeof window.fetch;
}

// 3. Capacitor detection
const isCapacitor = typeof (window as any).Capacitor !== "undefined";

// 4. Kill PWA service worker inside Capacitor — it intercepts API calls
if (isCapacitor && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
  caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
}

// 5. Register SW only in real browser production builds
if (!isCapacitor && "serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

// 6. Android hardware back button
const CapApp = (window as any).Capacitor?.Plugins?.App;
if (CapApp) {
  CapApp.addListener("backButton", ({ canGoBack }: { canGoBack: boolean }) => {
    if (canGoBack) window.history.back(); else CapApp.exitApp();
  });
}

// 7. Wire auth token into every API request
setAuthTokenGetter(() => localStorage.getItem("trueconcept_token"));
```

### Vite Config: `vite.config.ts`

```typescript
export default defineConfig({
  base: basePath,                // "/" in browser, set dynamically
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,     // manual registration in main.tsx
      manifest: { name: "TRUE CONCEPT", short_name: "TrueConcept", theme_color: "#da6b45" },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],  // never intercept API calls
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.googleapis\.com\//, handler: "CacheFirst" },
          { urlPattern: /^\/api\//, handler: "NetworkFirst" },
        ],
      },
    }),
  ],
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
  },
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:3000", changeOrigin: true } },
  },
});
```

### App Shell: `src/App.tsx`

```typescript
function AppRoutes() {
  const { user } = useAuth();
  return (
    <Layout>
      <StudentPrefsModal />
      {user?.role === "student" && <WhatsAppPopup />}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/subjects">
          {() => <ProtectedRoute><SubjectsPage /></ProtectedRoute>}
        </Route>
        <Route path="/subjects/:subjectId">
          {() => <ProtectedRoute><SubjectDetailPage /></ProtectedRoute>}
        </Route>
        <Route path="/chapters/:chapterId">
          {() => <ProtectedRoute><ChapterDetailPage /></ProtectedRoute>}
        </Route>
        <Route path="/virtual-lab">
          {() => <ProtectedRoute><VirtualLabPage /></ProtectedRoute>}
        </Route>
        <Route path="/virtual-lab/:experimentId">
          {() => <ProtectedRoute><ExperimentDetailPage /></ProtectedRoute>}
        </Route>
        <Route path="/search">
          {() => <ProtectedRoute><SearchPage /></ProtectedRoute>}
        </Route>
        {/* Admin routes — adminOnly flag redirects non-admins to /subjects */}
        <Route path="/admin">
          {() => <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
        </Route>
        <Route path="/admin/students">
          {() => <ProtectedRoute adminOnly><AdminStudentsPage /></ProtectedRoute>}
        </Route>
        {/* ... more admin routes */}
      </Switch>
    </Layout>
  );
}
```

`ProtectedRoute` redirects unauthenticated users to `/login`. It also separates admin vs student — an admin visiting a student route gets sent to `/admin`, and vice versa.

### Page Directory: `src/pages/`

| File | Route | Who sees it |
|---|---|---|
| `home.tsx` | `/` | Public (landing page) |
| `login.tsx` | `/login` | Public |
| `subjects.tsx` | `/subjects` | Students |
| `subject-detail.tsx` | `/subjects/:id` | Students |
| `chapter-detail.tsx` | `/chapters/:id` | Students |
| `virtual-lab.tsx` | `/virtual-lab` | Students |
| `experiment-detail.tsx` | `/virtual-lab/:id` | Students |
| `search.tsx` | `/search` | Students |
| `admin/index.tsx` | `/admin` | Admin |
| `admin/subjects.tsx` | `/admin/subjects` | Admin |
| `admin/chapters.tsx` | `/admin/chapters` | Admin |
| `admin/chapter-content.tsx` | `/admin/chapters/:id/content` | Admin |
| `admin/experiments.tsx` | `/admin/experiments` | Admin |
| `admin/students.tsx` | `/admin/students` | Admin |

### Layout: `src/components/Layout.tsx`

The layout provides:
- **Sticky glass header** with logo + desktop nav + logout
- **Mobile hamburger menu** (top-right, slides down)
- **Floating bottom pill nav** (mobile only, students only) — the pill uses `fixed` positioning, centered with `left-1/2 -translate-x-1/2`
- **Safe-area awareness** for notched Android phones: `env(safe-area-inset-bottom)`, `env(safe-area-inset-top)`

```typescript
// Mobile bottom pill nav — the active item expands to show label
{navLinks.map(({ href, label, icon: Icon }) => {
  const active = isActive(href);
  return (
    <Link key={href} href={href}>
      <button
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-xs transition-all duration-300
          ${active ? "text-white shadow-lg scale-105" : "text-gray-600 dark:text-gray-300"}`}
        style={active ? { background: "linear-gradient(135deg, #da6b45, #b85535)" } : {}}
      >
        <Icon className={`shrink-0 transition-all ${active ? "w-4 h-4" : "w-5 h-5"}`} />
        {active && <span className="whitespace-nowrap">{label}</span>}
      </button>
    </Link>
  );
})}
```

Admin nav links: Dashboard, Subjects, Chapters, Lab, Students.
Student nav links: Subjects, Virtual Lab, Search.

---

## 6. Backend — Firebase Functions (`functions/`)

The backend is fully serverless using **Firebase Functions v2** (`onRequest`). There is no Express server. Each route group is an independent Firebase HTTPS function deployed to `asia-south1` (Mumbai, India).

### Architecture

```
firebase.json rewrites
    /api/subjects/** → subjects function
    /api/chapters/** → chapters function
    /api/auth/**     → auth function
    ...etc

Each function:
    1. Handles CORS (handleCors utility)
    2. Parses sub-path (getSubPath utility)
    3. Dispatches by HTTP method (req.method)
    4. Calls auth middleware if needed (requireAuth / requireAdmin)
    5. Interacts with Firestore via @workspace/db
    6. Returns JSON response
```

### Entry Point: `functions/src/index.ts`

```typescript
export { auth } from "./routes/auth.js";
export { subjects } from "./routes/subjects.js";
export { chapters } from "./routes/chapters.js";
export { content } from "./routes/content.js";
export { experiments } from "./routes/experiments.js";
export { progress } from "./routes/progress.js";
export { dashboard } from "./routes/dashboard.js";
export { search } from "./routes/search.js";
export { students } from "./routes/students.js";
export { health } from "./routes/health.js";
```

Each export becomes a separate Firebase Function. They cold-start independently.

### Route Functions: `functions/src/routes/`

| File | Firebase Function | API Paths | Auth |
|---|---|---|---|
| `auth.ts` | `auth` | `/api/auth/login`, `/phone-login`, `/logout`, `/me` | None (login) / requireAuth (me) |
| `subjects.ts` | `subjects` | `/api/subjects`, `/api/subjects/:id` | None (GET) / requireAdmin (CUD) |
| `chapters.ts` | `chapters` | `/api/chapters`, `/api/chapters/:id` | None (GET) / requireAdmin (CUD) |
| `content.ts` | `content` | `/api/notes/*`, `/api/mcqs/*`, `/api/qa/*`, `/api/videos/*` | None (GET) / requireAdmin (CUD) |
| `experiments.ts` | `experiments` | `/api/experiments`, `/api/experiments/:id` | None (GET) / requireAdmin (CUD) |
| `progress.ts` | `progress` | `/api/progress`, `/mcq-score`, `/mark-chapter` | requireAuth |
| `dashboard.ts` | `dashboard` | `/api/dashboard/summary` | requireAuth |
| `search.ts` | `search` | `/api/search?q=...` | None |
| `students.ts` | `students` | `/api/students` | requireAdmin |
| `health.ts` | `health` | `/api/healthz` | None |

### Function Pattern

Every route function follows the same structure:

```typescript
import { onRequest } from "firebase-functions/v2/https";
import { db } from "@workspace/db";
import { handleCors } from "../utils/cors.js";
import { getSubPath, extractParam } from "../utils/router.js";
import { requireAdmin, type AuthError } from "../middleware/auth.js";

export const subjects = onRequest({ region: "asia-south1" }, async (req, res) => {
  if (handleCors(req, res)) return;  // Handle OPTIONS preflight

  const subPath = getSubPath(req, "/api/subjects");  // e.g. "/" or "/abc123"

  try {
    if (req.method === "GET" && (subPath === "/" || subPath === "")) {
      // List all subjects from Firestore
      const snap = await db.collection("subjects").get();
      res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      return;
    }

    if (req.method === "POST" && (subPath === "/" || subPath === "")) {
      requireAdmin(req);  // Throws AuthError if not admin
      // ... create logic
    }

    const paramId = extractParam(subPath);  // Extract ID from path
    if (req.method === "GET" && paramId) { /* ... get by ID */ }
    if (req.method === "PUT" && paramId) { requireAdmin(req); /* ... update */ }
    if (req.method === "DELETE" && paramId) { requireAdmin(req); /* ... delete */ }

    res.status(404).json({ error: "Not found" });
  } catch (err) {
    const authErr = err as AuthError;
    if (authErr.status && authErr.error) {
      res.status(authErr.status).json({ error: authErr.error });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### Auth Middleware: `functions/src/middleware/auth.ts`

Converted from Express middleware (req/res/next) to **pure functions that throw on failure**:

```typescript
// Extract user from Authorization header — returns null if invalid
export function extractAuthUser(req: Request): AuthUser | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return verifyToken(auth.slice(7));
}

// Require valid auth — throws { status: 401, error: "Unauthorized" }
export function requireAuth(req: Request): AuthUser { ... }

// Require admin — throws { status: 403, error: "Admin access required" }
export function requireAdmin(req: Request): AuthUser { ... }
```

The calling function catches the thrown `AuthError` object and returns the appropriate HTTP status code.

JWT tokens are signed with `SESSION_SECRET` env var, expire in 7 days.

### CORS: `functions/src/utils/cors.ts`

Every function calls `handleCors(req, res)` as its first line. This:
- Sets `Access-Control-Allow-Origin: *`
- Sets allowed methods and headers
- Returns `true` for `OPTIONS` preflight requests (already handled, function should return)

### URL Routing: `functions/src/utils/router.ts`

Since there's no Express Router, URL parsing is handled manually:
- `getSubPath(req, "/api/subjects")` → strips the prefix, returns the remaining path (e.g. `"/abc123"`)
- `extractParam(subPath)` → extracts a single path parameter (e.g. `"abc123"`)

### Firebase Hosting Rewrites

The `firebase.json` file maps `/api/*` paths to the corresponding functions so the frontend can continue calling `/api/subjects`, `/api/chapters`, etc. without any URL changes:

```json
"rewrites": [
  { "source": "/api/subjects/**", "function": "subjects", "region": "asia-south1" },
  { "source": "/api/chapters/**", "function": "chapters", "region": "asia-south1" },
  // ... one per function
  { "source": "**", "destination": "/index.html" }  // SPA catch-all (last)
]
```

---

## 7. Shared Libraries — `lib/`

### `lib/db` — Firebase Admin

```typescript
// src/index.ts
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const credential = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? cert(JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf8")))
  : applicationDefault();  // fallback for CI / GCP environments

initializeApp({ credential });

export const db = getFirestore();
export const firebaseAuth = getAuth();
```

The key is stored base64-encoded in `.env` so it survives copy-paste without line break issues.

### `lib/api-client-react` — Custom Fetch Layer

The API client hooks are **auto-generated by Orval** from `lib/api-spec/openapi.yaml`. You should never edit the generated files directly — re-run Orval to regenerate.

The hand-written piece is `src/custom-fetch.ts`:

```typescript
let _baseUrl: string | null = null;
let _getToken: (() => string | null) | null = null;

export function setBaseUrl(url: string | null) {
  _baseUrl = url?.replace(/\/+$/, "") ?? null;
}

export function setAuthTokenGetter(fn: () => string | null) {
  _getToken = fn;
}

// This is the fetch function Orval-generated hooks call for every request
export async function customFetch<T>(url: string, options: RequestInit): Promise<T> {
  const fullUrl = _baseUrl && url.startsWith("/api/") ? `${_baseUrl}${url}` : url;
  const token = _getToken?.();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(fullUrl, { ...options, headers });
  // Smart response parsing: JSON / text / blob based on Content-Type
  // Throws ApiError on non-2xx responses
  return parseResponse(res);
}
```

**Usage in frontend components:**
```typescript
// Auto-generated hook from Orval — just import and use
import { useGetSubjects, useGetChapters } from "@workspace/api-client-react";

const { data: subjects, isLoading } = useGetSubjects();
```

You never call `fetch` directly for reading data — always use the generated hooks. For mutations (POST/PATCH/DELETE) use the corresponding generated mutation hooks or call `fetch` directly in event handlers.

---

## 8. Authentication Flow

### Student Login (Phone OTP)

```
Student opens app
  → Chooses "Student" on login screen
  → Enters 10-digit Indian phone number
  → Firebase signInWithPhoneNumber() → SMS OTP sent
  → Student enters 6-digit OTP
  → confirmation.confirm(otp) → Firebase credential
  → credential.user.getIdToken() → Firebase ID token (JWT)
  → POST /api/auth/phone-login { idToken }
      → Server: firebaseAuth.verifyIdToken(idToken) → decoded.uid, phone
      → If student doc in Firestore doesn't exist → return { needsProfile: true }
      → Frontend shows Profile screen (name, class, medium, board)
      → POST /api/auth/phone-login { idToken, name, classLevel, medium, board }
          → Server creates Firestore student doc
          → Signs custom JWT with student's info
          → Returns { user, token }
  → Frontend stores token in localStorage["trueconcept_token"]
  → Redirects to /subjects
```

**Returning student:** Skips profile step, server just updates `lastLogin` and returns a fresh JWT.

### Admin Login (Username + Password)

```
Admin chooses "Admin" on login screen
  → Enters username + password
  → POST /api/auth/login { username, password }
      → Server queries Firestore "users" collection
      → Compares password (plain text — not hashed, fine for internal admin)
      → Signs JWT with role: "admin"
      → Returns { user, token }
  → Frontend stores token, redirects to /admin
```

### Token Lifecycle

```typescript
// AuthContext.tsx — token is initialized from localStorage on every page load
const [token, setToken] = useState(() => localStorage.getItem("trueconcept_token"));

// The token is immediately used to fetch /api/auth/me (via Orval-generated useGetMe hook)
// If token is valid → user state is populated
// If token is expired/invalid → user is null → ProtectedRoute redirects to /login

// On logout:
localStorage.removeItem("trueconcept_token");
localStorage.removeItem("trueconcept_student_prefs");
setToken(null);
setUser(null);
```

---

## 9. Design System

### Brand Colors

| Variable | Value | Use |
|---|---|---|
| `--brand-500` | `#da6b45` | Primary coral — buttons, active states, logo |
| `--brand-deep` | `#b85535` | Darker coral — gradient end, shadows |
| `--honey-400` | `#fbbf24` | Amber/honey — admin theme, secondary accents |
| `--page-gradient` | `#f0eeff` (light) / `#0c0920` (dark) | Solid page background |

The brand gradient used everywhere: `linear-gradient(135deg, #da6b45, #b85535)`

### Light / Dark Theme

Themes are defined entirely in `src/index.css` using CSS custom properties and Tailwind v4's `@custom-variant dark` system.

```css
/* Light theme (default) */
:root {
  --background: 250 60% 97%;       /* soft lavender */
  --foreground: 245 30% 14%;       /* near-black with blue tint */
  --page-gradient: #f0eeff;
  --glass-card-bg: rgba(250,248,255,0.42);
  --glass-panel-bg: rgba(240,236,255,0.55);
  --bottom-nav-bg: rgba(255,251,247,0.96);
  --hint-bg: rgba(255,251,232,0.98);
  --hint-text: #92400e;
}

/* Dark theme — toggled by adding .dark class to <html> */
.dark {
  --background: 243 45% 7%;        /* deep indigo */
  --foreground: 245 15% 92%;       /* near-white */
  --page-gradient: #0c0920;
  --glass-card-bg: rgba(22,18,52,0.58);
  --glass-panel-bg: rgba(16,12,42,0.70);
  --bottom-nav-bg: rgba(20,16,50,0.96);
  --hint-bg: rgba(40,30,18,0.97);
  --hint-text: #fde68a;
}
```

Theme is persisted in `localStorage["trueconcept_theme"]` and toggled by `ThemeContext.tsx`.

### Liquid Glass Utilities

These are custom CSS classes defined in `index.css` and used throughout the UI:

```css
.glass {
  background: var(--glass-card-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
}

.liquid-card {
  background: var(--glass-card-bg);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.25);
}

.liquid-panel {
  background: var(--glass-panel-bg);
  backdrop-filter: blur(32px) saturate(200%);
}

.liquid-inner {
  background: rgba(255,255,255,0.35);   /* light */
  backdrop-filter: blur(8px);
}
.dark .liquid-inner {
  background: rgba(255,255,255,0.06);
}
```

**Rule:** Never use raw `bg-white` or `bg-gray-*` for card surfaces. Always use `liquid-card`, `liquid-panel`, or `liquid-inner`. This ensures light/dark compatibility and the frosted glass aesthetic.

### Typography

Fonts loaded from Google Fonts:
- **Inter** (300–900 weight) — body text
- **Nunito** (400–900 weight) — headings, brand labels

`font-black` (weight 900) is used very aggressively for headings, nav items, buttons, and stat values. This is intentional — it creates the high-energy visual identity of the app.

### Radius & Spacing Convention

| Element | Radius |
|---|---|
| Cards | `rounded-3xl` (24px) |
| Buttons (primary) | `rounded-2xl` (16px) |
| Pills / tags | `rounded-full` |
| Inner sections | `rounded-xl` (12px) |
| Input fields | `rounded-2xl` |

### Animations

Framer Motion is used for all transitions:

```typescript
// Page-level list animation pattern
<MotionList className="space-y-3">
  {items.map((item) => (
    <MotionItem key={item.id}>
      <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
        {/* content */}
      </motion.div>
    </MotionItem>
  ))}
</MotionList>

// Card hover effect
<motion.div
  whileHover={{ y: -4, scale: 1.01 }}
  transition={{ type: "spring", stiffness: 300, damping: 22 }}
>
```

`MotionList` and `MotionItem` are wrappers in `src/components/MotionList.tsx` that apply stagger to children.

---

## 10. Virtual Lab System

### Architecture

Each simulation is a standalone React component. They are registered in a central registry and lazy-loaded when the student opens that experiment.

### Sim Registry: `src/components/lab/sim-registry.ts`

```typescript
export const simRegistry: Record<string, LazyExoticComponent<() => JSX.Element>> = {
  // Motion
  "distance-time": lazy(() => import("./sims/motion").then(m => ({ default: m.DistanceTimeSim }))),
  "pendulum":      lazy(() => import("./sims/motion").then(m => ({ default: m.PendulumSim }))),

  // NCERT Chemistry — Ch1: Chemical Reactions
  "chem-mg-combustion":    lazy(() => import("./sims/chemistry-ncert").then(m => ({ default: m.MgCombustionSim }))),
  "chem-water-electrolysis": lazy(() => import("./sims/chemistry-ncert").then(m => ({ default: m.WaterElectrolysisSim }))),

  // ... 60+ total entries
};
```

**Key rule:** The string key (e.g. `"chem-mg-combustion"`) must exactly match the `type` field stored in Firestore for that experiment document. When the admin seeds an experiment with `type: "chem-mg-combustion"`, the experiment detail page looks up `simRegistry["chem-mg-combustion"]` to render the simulation.

### How to add a new simulation

1. Create (or export from an existing) sim component in `src/components/lab/sims/`
2. Add an entry to `simRegistry` in `sim-registry.ts`
3. Add a label to `SIM_TYPE_LABELS` and an emoji to `SIM_EMOJIS`
4. In the admin panel, create an experiment with that `type` string
5. Seed or save the experiment to Firestore

### Sim UI Components: `src/components/lab/sim-ui.tsx`

All simulations use shared UI primitives from this file:

```typescript
// Slider control
<SimSlider label="Angle" value={angle} onChange={setAngle} min={0} max={90} unit="°" />

// Numeric readout
<SimNumber label="Period" value={period} unit=" s" precision={2} />

// Button (primary action)
<SimButton onClick={toggle} icon={<Play />}>Start</SimButton>

// Reset button (standard style)
<SimResetButton onClick={reset} />

// Hint — shows inline below controls (not a floating dropdown)
// Managed by SimContainer — do not use SimHint standalone
```

**SimContainer** is the standard wrapper for all simulations:

```typescript
<SimContainer
  onReset={reset}
  hint="As the bob swings, KE ↔ PE constantly convert. Total energy stays the same (ignoring friction)."
  controls={
    <>
      <SimButton onClick={toggle}>{running ? "Pause" : "Play"}</SimButton>
    </>
  }
>
  {/* SVG or canvas simulation goes here */}
</SimContainer>
```

The hint text renders as an **inline banner below the controls row** on both desktop and mobile, avoiding the off-screen overflow problem that absolute-positioned dropdowns have on small screens.

### Animation Loop: `useRafLoop`

Physics simulations use this custom hook for `requestAnimationFrame` loops:

```typescript
import { useRafLoop } from "@/components/lab/sim-ui";

useRafLoop(running, (dt) => {
  // dt = seconds since last frame, clamped to max 0.05s to prevent spiral-of-death
  angle += omega * dt;
  setAngle(angle);
});
```

---

## 11. Firestore Data Model

### Collections

```
students/{uid}
  name: string
  phone: string          ("+91XXXXXXXXXX")
  classLevel: string     ("Class IX" | "Class X")
  medium: string         ("Assamese" | "English")
  board: string          ("SEBA" | "CBSE")
  createdAt: Timestamp
  lastLogin: Timestamp

users/{docId}            (admin accounts)
  username: string
  password: string       (plain text — internal use only)
  role: "admin"
  name: string

subjects/{subjectId}
  name: string
  description: string
  order: number

chapters/{chapterId}
  subjectId: string      (reference to subjects collection)
  title: string
  description: string
  order: number

content/{contentId}
  chapterId: string
  type: "note" | "mcq" | "qa"
  title: string
  body: string           (Markdown for notes)
  options: string[]      (MCQ choices)
  answer: string
  order: number

experiments/{experimentId}
  title: string
  description: string
  type: string           (must match a key in simRegistry, e.g. "chem-mg-combustion")
  category: string       ("physics" | "chemistry")
  subjectId: string      (optional link to subject)
  chapterId: string      (optional link to chapter)
  procedure: string[]    (numbered steps)
  observations: string
  result: string
  order: number
```

### Access Patterns

- All reads are admin-authenticated (via JWT `requireAdmin` middleware) for the admin panel
- Student reads (subjects, chapters, content, experiments) use `requireAuth` — any valid JWT works
- The `students` collection is only readable by admins

---

## 12. Mobile / APK Build

### Capacitor Config: `mobile/capacitor.config.json`

```json
{
  "appId": "com.trueconcept.app",
  "appName": "TRUE CONCEPT",
  "webDir": "../artifacts/true-concept/dist/public",
  "server": {
    "androidScheme": "http",
    "cleartext": true
  },
  "android": {
    "backgroundColor": "#0c0920",
    "allowMixedContent": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1800,
      "backgroundColor": "#0c0920",
      "showSpinner": false
    }
  }
}
```

**Why `androidScheme: "http"`**: Android blocks HTTP inside HTTPS WebViews. Since the dev API server runs on HTTP, the app scheme must also be HTTP to avoid mixed content errors.

### Build Script: `mobile/build.mjs`

```javascript
// Requires $env:API_URL="http://192.168.1.X:3000"  (your PC's LAN IP)

// Step 1: Build frontend with API URL baked in
execSync(`pnpm --filter @workspace/true-concept build`, {
  env: { ...process.env, VITE_API_BASE_URL: process.env.API_URL }
});

// Step 2: Sync web assets into Android project
execSync("npx cap sync android", { cwd: mobileDir });

// Step 3: Compile APK
execSync("gradlew.bat assembleDebug", { cwd: androidDir });
// Output: mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

**Full build command:**
```powershell
$env:API_URL = "http://192.168.1.X:3000"
node mobile/build.mjs
```

### Android Edge-to-Edge Setup

**`MainActivity.java`**:
```java
@Override public void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  // Make the app draw behind the system bars
  WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
}
```

**`res/values/styles.xml`** (AppTheme.NoActionBar):
```xml
<!-- Coral status bar at top — matches app header color -->
<item name="android:statusBarColor">@color/colorPrimaryDark</item>  <!-- #B85535 -->

<!-- Transparent nav bar at bottom — immersive feel for bottom pill nav -->
<item name="android:navigationBarColor">@android:color/transparent</item>
<item name="android:windowDrawsSystemBarBackgrounds">true</item>
<item name="android:enforceNavigationBarContrast" tools:targetApi="29">false</item>
```

**In Layout.tsx**, the header pads itself to avoid the status bar:
```tsx
<header style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
```

And the bottom nav accounts for the gesture bar:
```tsx
<nav style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
```

**`network_security_config.xml`** allows plain HTTP for dev:
```xml
<base-config cleartextTrafficPermitted="true">
  <trust-anchors><certificates src="system"/></trust-anchors>
</base-config>
```

### PWA vs Capacitor — Important Rule

The PWA service worker and Capacitor **cannot coexist**. When running inside Capacitor, the SW would intercept all `/api/` fetch calls and return cached responses or errors. This is why `main.tsx` forcibly unregisters the SW when `window.Capacitor` is detected.

---

## 13. Key Utility Modules

### `src/lib/auto-icon.ts` — Deterministic Icons

Generates a consistent emoji + color gradient for any piece of content based on its ID. Same ID always gives the same icon — makes the UI feel curated without manual assignment.

```typescript
export function getAutoIcon(seed: string | null | undefined, salt = ""): AutoIcon {
  const h = hash((seed ?? "") + "|" + salt);  // djb2 hash
  return {
    emoji: ICON_POOL[h % 40],              // 40 emojis
    grad:  GRAD_POOL[(h >>> 7) % 12],      // 12 gradients
    glow:  GLOW_POOL[(h >>> 7) % 12],      // matching glow color
  };
}

// Usage:
const icon = getAutoIcon(chapterId);
<div style={{ background: icon.grad }}>{icon.emoji}</div>

// With salt to get different icons for MCQ vs Q&A in same chapter:
const mcqIcon = getAutoIcon(chapterId, "mcq");
const qaIcon  = getAutoIcon(chapterId, "qa");
```

### `src/lib/subject-theme.ts` — Subject Color Theming

Maps subject names to a full color theme (emoji, gradient, accent color):

```typescript
export function getSubjectTheme(name: string, index = 0): SubjectTheme {
  const n = name.toLowerCase();
  if (n.includes("physics") || n.includes("পদাৰ্থ")) return PHYSICS_THEME;
  if (n.includes("chemistry") || n.includes("ৰসায়ন")) return CHEMISTRY_THEME;
  if (n.includes("biology") || n.includes("জীৱ")) return BIOLOGY_THEME;
  if (n.includes("math") || n.includes("গণিত")) return MATH_THEME;
  // ... more subjects
  return FALLBACK_THEMES[index % FALLBACK_THEMES.length];
}

// Usage:
const theme = getSubjectTheme(subject.name, index);
<div style={{ background: theme.grad }}>{theme.emoji}</div>
<span style={{ color: theme.accent }}>{subject.name}</span>
```

Supports multilingual name matching (Assamese, Hindi, English).

### `src/components/WhatsAppPopup.tsx` — Channel Promotion

Popup shown to students on every app open (after killing):

```typescript
const SESSION_KEY = "wa_popup_dismissed";
const WA_CHANNEL_URL = "https://whatsapp.com/channel/placeholder"; // ← update this

export default function WhatsAppPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // sessionStorage is cleared when app is killed — so popup shows every launch
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setTimeout(() => setVisible(true), 1200);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };
  // ... renders via createPortal to document.body
}
```

**To update the WhatsApp link**: Change `WA_CHANNEL_URL` at the top of `WhatsAppPopup.tsx`.

---

## 14. Code Style Guide

This section documents the conventions already established in the codebase. Follow them so the new code blends in seamlessly.

### TypeScript

- Always use `interface` for object shapes, `type` for unions and aliases
- No `any` unless bridging third-party APIs (Capacitor plugins, Firebase)
- Component props are always typed inline or with a named interface
- Never use `!` non-null assertion unless you are 100% certain. Use optional chaining `?.` instead

### React Components

**Structure within a component file:**
1. Type/interface definitions at the top
2. Helper functions that are pure (no hooks)
3. Sub-components (small, used only within this file)
4. Main exported component at the bottom

```typescript
// ── types ───────────────────────────────────────────────────────────────────
interface StudentCardProps { name: string; phone: string; }

// ── helpers ─────────────────────────────────────────────────────────────────
function formatPhone(p: string) { return p.replace("+91", ""); }

// ── sub-component ────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  return <div className="...rounded...">{name[0]}</div>;
}

// ── main component ───────────────────────────────────────────────────────────
export default function StudentCard({ name, phone }: StudentCardProps) {
  return (
    <div className="liquid-card rounded-3xl px-5 py-4">
      <Avatar name={name} />
      <p className="font-black">{name}</p>
      <p className="text-sm text-muted-foreground">{formatPhone(phone)}</p>
    </div>
  );
}
```

### CSS / Tailwind

- **Never use raw color values** in `className`. Use CSS variables via the design system tokens (`text-foreground`, `text-muted-foreground`, `bg-card`, etc.)
- For **brand gradients and special colors**, use `style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}` inline
- Always prefer `font-black` (900) for headings and interactive labels
- Cards always use `liquid-card` or `liquid-inner` — never plain `bg-white`
- Responsive: mobile-first. Use `sm:`, `md:` breakpoints. Mobile is the primary target
- For border radii: `rounded-3xl` for cards, `rounded-2xl` for buttons/inputs, `rounded-full` for pills/tags

### API Calls

```typescript
// ✅ CORRECT — use generated hooks for GET requests
const { data, isLoading } = useGetSubjects();

// ✅ CORRECT — use raw fetch for mutations (POST/PATCH/DELETE) in event handlers
const handleSave = async () => {
  const token = localStorage.getItem("trueconcept_token");
  await fetch("/api/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
};

// ❌ WRONG — never call fetch inside a hook body or useEffect for reads
useEffect(() => { fetch("/api/subjects").then(...) }, []); // use useGetSubjects() instead
```

### Animations

- All card/list transitions use Framer Motion spring physics: `{ type: "spring", stiffness: 300, damping: 22 }`
- Use `MotionList` + `MotionItem` wrappers for staggered list animations
- Use `AnimatePresence` when elements conditionally appear/disappear
- Hover effects: `whileHover={{ y: -4, scale: 1.01 }}` for cards, `whileHover={{ x: 6 }}` for list rows

### Naming Conventions

| Pattern | Convention |
|---|---|
| Components | PascalCase |
| Hooks | `use` prefix + camelCase |
| Utility functions | camelCase |
| CSS custom properties | `--kebab-case` |
| Firestore collection names | `camelCase` plural (e.g. `students`, `subjects`) |
| Sim type keys | `kebab-case` (e.g. `"chem-mg-combustion"`) |
| Environment variables | `SCREAMING_SNAKE_CASE` |

### Comments

Write comments only for the **why**, not the **what**. The code explains itself; comments explain intent.

```typescript
// ✅ Good comment — explains a non-obvious constraint
// Patch window.fetch so direct fetch("/api/...") calls in login.tsx also get
// redirected. Without this, Capacitor's local server returns index.html.

// ❌ Bad comment — the code already says this
// Loop through all items and render them
items.map(item => <Card key={item.id} {...item} />)
```

---

## 15. Environment Variables Reference

### `functions/.env`

```env
SESSION_SECRET=your-jwt-secret-here

# Firebase service account key — base64-encoded JSON
# To encode: [Convert]::ToBase64String([IO.File]::ReadAllBytes("serviceAccountKey.json"))
TRUE_CONCEPT_SERVICE_KEY=eyJhbGci...base64...
```

The Firebase Functions emulator loads this `.env` file automatically. For production deployment, set these via `firebase functions:config:set` or Google Cloud Secret Manager.

### `artifacts/true-concept/.env.local`

```env
# Firebase web app config (safe to include — these are public keys)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=true-concept-353c9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=true-concept-353c9
VITE_FIREBASE_APP_ID=1:123...

# API base URL — only needed for mobile APK build
# For production: use your Firebase Hosting URL (e.g. https://true-concept-353c9.web.app)
# For local dev with phone on same WiFi: use your PC's LAN IP pointing to the emulator
# Leave blank for browser development (Vite proxy handles /api → localhost:5001)
VITE_API_BASE_URL=
```

---

## 16. Common Gotchas & Hard-Won Fixes

These are real issues that were debugged and fixed during development. Do not undo them.

### "Unexpected token '<'" on mobile login

**Symptom:** Login on the APK returns HTML instead of JSON.

**Root causes (all must be fixed together):**
1. PWA service worker intercepts API calls → **fixed by unregistering SW inside Capacitor** in `main.tsx`
2. Android blocks HTTP cleartext → **fixed by `network_security_config.xml`** with `cleartextTrafficPermitted="true"`
3. Mixed content (HTTPS app making HTTP requests) → **fixed by `androidScheme: "http"`** in `capacitor.config.json`
4. Direct `fetch("/api/...")` bypasses `setBaseUrl()` → **fixed by patching `window.fetch`** in `main.tsx`

### "Invalid or expired token" after phone login

**Symptom:** Function logs show `verifyIdToken failed` immediately.

**Cause:** `TRUE_CONCEPT_SERVICE_KEY` not set in the environment.

**Fix:** Ensure `functions/.env` contains the base64-encoded key. The Firebase emulator and production runtime both read environment variables automatically.

### Cold starts on Firebase Functions

**Symptom:** First API call after a period of inactivity takes 2–5 seconds.

**Cause:** Each function cold-starts independently. With 10 separate functions, a user's first page load may trigger multiple cold starts.

**Mitigation:** This is expected behavior for serverless. For the TRUE CONCEPT user base (students in Assam), the latency is acceptable. If it becomes a problem, consider setting `minInstances: 1` on critical functions (auth, subjects) — but this incurs cost.

### Firebase Hosting rewrites must come before the SPA catch-all

**Symptom:** API calls return `index.html` instead of JSON when deployed.

**Cause:** The `{ "source": "**", "destination": "/index.html" }` catch-all rewrite in `firebase.json` was placed before the API rewrites.

**Fix:** API rewrites must be listed **before** the SPA catch-all. The current `firebase.json` has them in the correct order. Do not reorder.

### Auth middleware throws instead of calling next()

**Symptom:** `requireAuth(req)` or `requireAdmin(req)` doesn't return a response.

**Cause:** Unlike Express middleware (which calls `res.status(401).json(...)` directly), the Firebase Functions auth helpers **throw an `AuthError` object**. The calling function must catch it.

**Pattern:** Every route function wraps its logic in `try/catch` and checks for `AuthError` in the catch block:
```typescript
catch (err) {
  const authErr = err as AuthError;
  if (authErr.status && authErr.error) {
    res.status(authErr.status).json({ error: authErr.error });
    return;
  }
  res.status(500).json({ error: "Internal server error" });
}
```

### Status bar turns transparent after edge-to-edge setup

**Symptom:** After setting up immersive bottom navigation, the top status bar also became transparent, making the app look broken.

**Fix:** Keep `android:statusBarColor = @color/colorPrimaryDark` (coral `#B85535`) in `styles.xml`. Only the nav bar at the bottom should be transparent. The `WindowCompat.setDecorFitsSystemWindows(false)` call enables drawing behind both bars, but the status bar color is then re-asserted via the theme.

### Sim hint popup goes off-screen to the left on mobile

**Symptom:** The hint tooltip clips off the left edge of the screen on small phones.

**Fix:** The hint was an absolute-positioned dropdown (`right-0`). Changed to an **inline banner** rendered by `SimContainer` below the controls row. This has no positioning issues on any screen size.

### `capacitor.config.ts` vs `.json`

Capacitor's TypeScript config uses CommonJS exports (`exports.default = ...`), which breaks in an ESM monorepo. Always use `capacitor.config.json` — no code, no ESM issues.

### Seam / diagonal line visible in page background

**Symptom:** A visible line appeared diagonally across the background due to gradient blending.

**Fix:** Replaced gradient backgrounds with solid colors: `#f0eeff` (light) and `#0c0920` (dark). Removed all `body::before` / `body::after` blob pseudo-elements. Simple solid color, no seams.

### Vite proxy port changed from 3000 to 5001

**Symptom:** Frontend can't reach the API during local development.

**Cause:** The old Express server ran on port 3000. Firebase Functions emulator runs on port 5001.

**Fix:** `vite.config.ts` proxy target was updated to `http://localhost:5001`. Do not change it back to 3000.

---

*End of documentation. If you find something missing or outdated, update this file in the same commit as the code change.*
