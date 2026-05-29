# TRUE CONCEPT — Master Ad Implementation Plan

> **Single source of truth.** Supersedes `finalAddmob.md` and `UnifiedAdImplementation.md`.
> All architecture, decisions, and operational detail consolidated into one document.
> Ready to execute phase-by-phase when you say **"Start Phase 1."**

---

## 📑 Table of Contents

1. [Why This Plan Exists](#1-why-this-plan-exists)
2. [Architecture — Facade Pattern](#2-architecture--facade-pattern)
3. [Locked Decisions](#3-locked-decisions)
4. [Strict Rules of Implementation](#4-strict-rules-of-implementation)
5. [Final Folder Structure](#5-final-folder-structure)
6. [Pre-Implementation Manual Setup](#6-pre-implementation-manual-setup)
7. [Implementation Phases (Detailed)](#7-implementation-phases-detailed)
8. [Grace Period — Code + Edge Cases](#8-grace-period--code--edge-cases)
9. [UnlockGate UX & Decision Tree](#9-unlockgate-ux--decision-tree)
10. [Cross-Platform Considerations](#10-cross-platform-considerations)
11. [Economic Projections](#11-economic-projections)
12. [APK Update Procedure](#12-apk-update-procedure)
13. [Web Update Procedure](#13-web-update-procedure)
14. [Recommended Timeline](#14-recommended-timeline)
15. [Pre-Go Checklist](#15-pre-go-checklist)
16. [Trigger Words to Start](#16-trigger-words-to-start)

---

## 1. Why This Plan Exists

The first plan (`finalAddmob.md`) assumed **Android APK only** — built around Google AdMob via `@capacitor-community/admob`. That plugin is mobile-native and does NOT work in:

- Plain web browsers (Firebase Hosting)
- Electron / Tauri PC wrappers
- Any non-Capacitor environment

Since TRUE CONCEPT is now expanding to a **PC executable**, the ad system must run on both Android and PC without:

- Duplicating UI/logic between platforms
- Breaking the existing React codebase
- Locking students out when ads fail
- Requiring backend changes

The solution is a **Unified Ad Manager** (Facade) that detects the platform at runtime and routes ad requests to the right provider. The rest of the app talks only to the unified manager — it never knows or cares whether it's AdMob or AdSense underneath.

---

## 2. Architecture — Facade Pattern

```
                    ┌─────────────────────────────┐
                    │      UI Components          │
                    │  <UnlockGate>, <Banner>     │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │    UnifiedAdManager         │   ← the only thing UI talks to
                    │   (src/ads/manager.ts)      │
                    └─────────────┬───────────────┘
                                  │
                  detect platform at runtime
                                  │
                ┌─────────────────┴─────────────────┐
                ▼                                   ▼
   ┌────────────────────────┐           ┌────────────────────────┐
   │  Android (Capacitor)   │           │   PC / Web Browser     │
   │  AdMob Provider        │           │   AdSense Provider     │
   │  @capacitor-community/ │           │   <ins class=          │
   │       admob            │           │     "adsbygoogle">     │
   └────────────────────────┘           └────────────────────────┘
```

Both providers implement the same TypeScript interface:

```typescript
export interface AdProvider {
  initialize(): Promise<void>;
  showAdaptiveBanner(): Promise<void>;
  hideBanner(): Promise<void>;
  showRewardedAd(): Promise<boolean>;   // true = reward earned, false = closed early / failed
}
```

The UnifiedAdManager exposes this same surface to the rest of the app:

```typescript
import { adManager } from "@/ads/unified-ad-manager";
await adManager.initialize();
const earned = await adManager.showRewardedAd();
if (earned) unlockFeature("notes");
```

UI code is **completely platform-agnostic**.

---

## 3. Locked Decisions

| # | Decision | Choice | Reasoning |
|---|---|---|---|
| 1 | **Platform targets** | Android APK + PC executable + Web | Same React codebase, two ad providers |
| 2 | **Frontend hosting** | Firebase Hosting | Already wired in `firebase.json` rewrites → Functions |
| 3 | **Android ad provider** | Google AdMob via `@capacitor-community/admob` | Industry standard, highest eCPM in India |
| 4 | **Web/PC ad provider** | Google AdSense (`<ins class="adsbygoogle">`) | Same Google account, unified payouts. Fallback: countdown display ad when AdSense rewarded not approved |
| 5 | **Banner placement** | Page-level — render `<AdaptiveBanner />` on screens where bottom nav is hidden | Nav visibility is already manually managed |
| 6 | **Ad formats** | Banner + Rewarded only — **NO interstitials** | Cleaner UX for an education app |
| 7 | **Unlock model** | Strict per-feature — Notes / Lab / MCQ / QnA each unlock separately for 1 hour | Highest revenue. Friction softened by grace period |
| 8 | **New-student grace** | First **24 hours** unlocked free after signup | Smooth onboarding → better retention before any ad walls |
| 9 | **Test-mode toggle** | `IS_TESTING = !import.meta.env.PROD \|\| !isProductionPlatform()` | Production ads only ship from production builds on the right platform |
| 10 | **Failsafe** | If ad SDK fails, `UnlockGate` opens automatically | No student is ever permanently locked out by an ad-loading failure |

---

## 4. Strict Rules of Implementation

These are **non-negotiable** — they keep the rest of the app safe while ads are layered in.

1. **Zero backend changes.** No edits to Firebase Functions, Firestore rules, or API routes. Ads are 100% client-side.
2. **Isolated logic.** All ad code lives under `src/ads/`. Nothing leaks into `pages/`, `components/`, or `lib/`.
3. **Non-destructive page integration.** Existing UI components (`NotesTab`, `McqTab`, `QaTab`, `Simulation`) are NOT internally modified. We use **React composition** — wrap them with `<UnlockGate>`.
4. **Failsafe design.** Ad failures (network, ad-blockers, SDK glitches, AdSense not approved yet) MUST result in the gate opening with a console warning, never blocking the student.
5. **Bilingual.** All ad UI (`UnlockModal`, error toasts, banner labels) must support English + Assamese using the existing `useLanguage()` hook.
6. **No deploy without explicit OK.** Per `feedback_no_deploy_without_ok` memory — building/deploying happens only when you say "yes deploy now" in the current turn.

---

## 5. Final Folder Structure

```
artifacts/true-concept/src/
└── ads/                                  ← NEW: all ad logic isolated here
    ├── platform.ts                       ← isCapacitorAndroid() / isWeb() / isPC()
    ├── config.ts                         ← Test + Production IDs for AdMob AND AdSense
    ├── unified-ad-manager.ts             ← Main facade — the only thing UI imports
    ├── providers/
    │   ├── admob-provider.ts             ← Capacitor AdMob implementation
    │   └── adsense-provider.ts           ← Web AdSense (with fallback)
    ├── rewarded-manager.ts               ← Preload + show + auto-reload (platform-agnostic)
    ├── unlock-manager.ts                 ← localStorage feature unlocks (1h TTL)
    ├── grace-period.ts                   ← First-24h-free for new students
    ├── unlock-actions.ts                 ← unlockNotes() / unlockLab() / unlockMCQ() / unlockQnA()
    ├── lifecycle.ts                      ← App resume/background handlers
    └── components/
        ├── UnlockModal.tsx               ← "Watch Ad" modal (works on both platforms)
        ├── UnlockGate.tsx                ← Wraps protected sections
        └── AdaptiveBanner.tsx            ← Native AdMob banner on Android, <ins> tag on web/PC

# Files that get touched (minimal edits)
artifacts/true-concept/src/main.tsx       ← Wire adManager.initialize() at bootstrap
artifacts/true-concept/src/pages/login.tsx ← Call recordSignup() after first registration
artifacts/true-concept/src/pages/chapter-detail.tsx ← Wrap NotesTab, McqTab, QaTab
artifacts/true-concept/src/pages/experiment-detail.tsx ← Wrap the SimComponent only
artifacts/true-concept/index.html         ← Add AdSense script tag (deferred Phase 4)
mobile/android/app/src/main/AndroidManifest.xml ← Add APPLICATION_ID meta-data
artifacts/true-concept/package.json       ← Add @capacitor-community/admob
```

---

## 6. Pre-Implementation Manual Setup

These tasks are external (Google dashboards, payment forms) and can be done in parallel with development.

### 6A. AdMob Setup (for Android) — ~30 min

1. Visit **https://admob.google.com** — sign up with your Google account.
2. Click **Apps → Add app**:
   - Platform: **Android**
   - App name: `TRUE CONCEPT`
   - Package name: `com.trueconcept.app`
3. **Copy the App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
4. **Create 5 ad units** (Apps → your app → Ad units → Add ad unit):

| # | Type | Name | Reward (rewarded only) |
|---|---|---|---|
| 1 | Banner | `Banner — Tiny Adaptive` | — |
| 2 | Rewarded | `Rewarded — Notes Unlock` | `1 hour of Notes access` |
| 3 | Rewarded | `Rewarded — Lab Unlock` | `1 hour of Lab access` |
| 4 | Rewarded | `Rewarded — MCQ Unlock` | `1 hour of MCQ access` |
| 5 | Rewarded | `Rewarded — QnA Unlock` | `1 hour of QnA access` |

Save all 5 Ad Unit IDs (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`).

### 6B. AdSense Setup (for PC/Web) — ~30 min + 1-7 days approval wait

1. Visit **https://adsense.google.com** — sign up with the **same Google account** as AdMob (consolidated payouts).
2. Add site: `https://true-concept-353c9.web.app` (or your custom domain if you have one).
3. AdSense will give you a **publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`).
4. **Wait for approval.** This typically takes 1–7 days. The site must:
   - Be live and reachable (Firebase Hosting deployed)
   - Have enough content (your app already does)
   - Comply with AdSense program policies
5. After approval, create 2 ad units (AdSense → Ads → By ad unit → Create new ad unit):

| # | Type | Name | Notes |
|---|---|---|---|
| 1 | Display | `Banner — Web Adaptive` | Responsive sized |
| 2 | Display | `Reward Fallback — Countdown Display` | Used as the rewarded fallback until AdSense rewarded is approved |

Each ad unit gives you a **slot ID** (format: `0123456789`). Save these.

> **Heads-up:** AdSense Rewarded (`H5 Games Ads`) requires separate program approval. Until you're approved, the AdSense provider falls back to a "watch this display ad for 30 seconds" countdown (Phase 4 implements this).

### 6C. Payment Setup (AdMob + AdSense) — ~30 min

In each dashboard (Payments section):

- **PAN card number** (required for India)
- **Bank account** (NEFT/IMPS) — UPI is not yet supported by Google ad platforms
- **Tax residence:** India

AdMob and AdSense are **separate payment accounts** even though they're billed under one Google account. Fill both.

### 6D. Firebase Verification — ~10 min

- Project on **Blaze plan** ✓ (already done)
- Phone Auth provider **enabled** ✓ (already done)
- India SMS region **allowed** ✓ (verify in Firebase Console → Authentication → Sign-in method → Phone)
- Frontend **deployed to Firebase Hosting** ✓ — must be done BEFORE AdSense approval submission

---

## 7. Implementation Phases (Detailed)

Each phase is gated. We do not start the next phase until the current one is verified working.

### Phase 1 — Core Infrastructure (~1.5 hrs)

**Goal:** Detect the platform, define the provider interface, create the empty UnifiedAdManager skeleton.

| Step | File | Action |
|---|---|---|
| 1 | `src/ads/platform.ts` | Export `isCapacitorAndroid()`, `isWeb()`, `isPC()`. Detection via `Capacitor.getPlatform()` for native; everything else is "web/PC" |
| 2 | `src/ads/config.ts` | Export `IS_TESTING`, all AdMob test/prod IDs (Google's official test IDs first), AdSense publisher + slot IDs |
| 3 | `src/ads/unified-ad-manager.ts` | Define `AdProvider` interface; export a singleton that picks the provider on first call to `initialize()` |
| 4 | `src/main.tsx` | Add `await adManager.initialize()` to the bootstrap, before `<App />` renders |

**Verification:** App boots, console shows `"AdManager initialized with provider: web"` or `"android"`, nothing breaks.

### Phase 2 — Android AdMob Provider (~2.5 hrs)

**Goal:** Real banner + rewarded ads on Android using test IDs.

| Step | File | Action |
|---|---|---|
| 5 | `mobile/android/app/src/main/AndroidManifest.xml` | Add `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXXXXXX~XXXXXXXX" />` inside `<application>` |
| 6 | `package.json` | `pnpm add @capacitor-community/admob` |
| 7 | `mobile/` | `npx cap sync android` |
| 8 | `src/ads/providers/admob-provider.ts` | Implement `AdProvider`: `initialize()` calls `AdMob.initialize()`, `showAdaptiveBanner()` uses `AdMob.showBanner()` at `BannerPosition.BOTTOM_CENTER`, `showRewardedAd()` preloads + shows + listens for `rewardedVideoAdReward` event |

**Verification:** Run on a physical Android device (emulator may not show ads reliably). Use Google's official test IDs (`ca-app-pub-3940256099942544/6300978111` for banner, `/5224354917` for rewarded). Banner appears at bottom; rewarded plays and resolves with `true` on completion.

### Phase 3 — PC/Web AdSense Provider (~2 hrs)

**Goal:** Web banner working. Web rewarded uses a countdown-display fallback until AdSense H5 is approved.

| Step | File | Action |
|---|---|---|
| 9 | `index.html` | Add the AdSense script tag in `<head>`: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>` |
| 10 | `src/ads/providers/adsense-provider.ts` | Implement `AdProvider`: `initialize()` waits for `window.adsbygoogle` to be defined; `showAdaptiveBanner()` injects an `<ins class="adsbygoogle" data-ad-client=... data-ad-slot=...>` into a portal `<div>`; `showRewardedAd()` opens a modal showing a 30-second countdown over a display ad, resolves `true` when timer hits 0 (cannot be skipped) |
| 11 | `src/ads/providers/adsense-provider.ts` | Add the **failsafe**: if AdSense script never loaded after 5s OR the `<ins>` tag remains unfilled after 3s → resolve rewarded as `true` so the user is not punished for an ad-blocker / approval delay |

**Verification:** Test in browser. Banner shows real AdSense ad (after approval) or a `data-adtest="on"` placeholder (before approval). Rewarded modal opens, 30s timer runs, resolves `true`.

### Phase 4 — Unlock Logic (~2 hrs)

**Goal:** Track per-feature unlocks in localStorage. Implement grace period. Compose into 4 unlock action functions.

| Step | File | Action |
|---|---|---|
| 12 | `src/ads/unlock-manager.ts` | `unlockFeature(feature)` writes `{ feature, expiresAt: Date.now() + 60*60*1000 }` to localStorage. `isFeatureUnlocked(feature)` checks not expired. `getRemainingUnlockTime(feature)` returns minutes left |
| 13 | `src/ads/grace-period.ts` | See [Section 8](#8-grace-period--code--edge-cases) below — exact code already locked |
| 14 | `src/ads/rewarded-manager.ts` | Thin wrapper around `adManager.showRewardedAd()` — adds loading state, error toast, prevents double-click |
| 15 | `src/ads/unlock-actions.ts` | Export `unlockNotes()`, `unlockLab()`, `unlockMCQ()`, `unlockQnA()`. Each: show rewarded → on `true` → `unlockFeature(name)` → return `true`. On `false` → return `false` so the modal can show an error |

**Verification:** Browser DevTools → Application → Local Storage shows `trueconcept_unlock_notes` after a successful unlock, with the right `expiresAt`. After 1 hour the lookup returns `false`.

### Phase 5 — UI Components (~2.5 hrs)

**Goal:** The 3 reusable components that wrap content and show ads.

| Step | File | Action |
|---|---|---|
| 16 | `src/ads/components/UnlockModal.tsx` | Premium modal with Framer Motion. Props: `title`, `description`, `onUnlock`, `onCancel`. Buttons: "Watch Ad" (with loading spinner during ad load/show, disabled while loading) and "Maybe later". **Bilingual** via `useLanguage()` |
| 17 | `src/ads/components/UnlockGate.tsx` | Wraps children. Logic: `if (isInGracePeriod() \|\| isFeatureUnlocked(feature)) → render children`. Else → `<UnlockModal />`. When user clicks "Watch Ad" → call the matching `unlock<Feature>()` action. On success → re-render to step 1. On failure → show error toast, stay on modal. **Failsafe:** if the ad SDK times out or throws, auto-unlock so the student is never blocked |
| 18 | `src/ads/components/AdaptiveBanner.tsx` | On mount: `adManager.showAdaptiveBanner()`. On unmount: `adManager.hideBanner()`. Renders an empty `<div id="adsense-mount-point">` for the AdSense `<ins>` tag to attach to (ignored by AdMob native provider) |

**Verification:** Render `<UnlockGate feature="notes" title="Unlock Notes" description="…"><div>secret</div></UnlockGate>` in a test page. With grace expired and feature locked → modal shows. Click "Watch Ad" → ad plays → `<div>secret</div>` reveals.

### Phase 6 — Page Integration (~1 hr)

**Goal:** Wrap the 4 protected features. No internal changes to existing components — pure composition.

| Step | File | Where |
|---|---|---|
| 19 | `src/pages/chapter-detail.tsx` | Wrap the rendered `NotesTab` content in `<UnlockGate feature="notes" title="Unlock Notes" description="Watch a short ad to access notes for the next hour.">` |
| 20 | `src/pages/chapter-detail.tsx` | Same for `McqTab` → `<UnlockGate feature="mcq" …>` |
| 21 | `src/pages/chapter-detail.tsx` | Same for `QaTab` → `<UnlockGate feature="qna" …>`. Only gate the expanded answer reveal, not the question list browsing |
| 22 | `src/pages/experiment-detail.tsx` | Wrap **only** the `<SimComponent />` rendering in `<UnlockGate feature="lab" …>`. Page chrome (title, objective, theory, procedure) stays unlocked so students can preview |

### Phase 7 — Banner Placement (~1 hr)

**Goal:** Show the AdaptiveBanner on pages where the bottom nav is already hidden.

| Step | File | Action |
|---|---|---|
| 23 | Pages without bottom nav (identify from current code — likely experiment-detail.tsx, chapter-detail.tsx in some routes) | Mount `<AdaptiveBanner />` at the bottom of the page JSX |
| 24 | `src/ads/lifecycle.ts` | Hook `App.addListener('appStateChange', ...)` from Capacitor on Android, `document.visibilitychange` on web. On resume: re-check unlocks, reload stale rewarded ads, optionally hide banner during transitions |
| 25 | `src/main.tsx` | Wire `setupLifecycle()` after `adManager.initialize()` |

### Phase 8 — Polish & Hardening (~1.5 hrs)

| Step | File | Action |
|---|---|---|
| 26 | `src/ads/config.ts` | Final hardening: production IDs ONLY when `import.meta.env.PROD === true` AND the platform is correct (Android for AdMob IDs, Web for AdSense IDs). Test IDs in all other cases |
| 27 | `src/ads/*` (full audit) | Code review pass — no memory leaks, proper cleanup in `useEffect`, web safety (no `window` access without checks), TypeScript strict mode passes |
| 28 | `src/ads/components/UnlockModal.tsx` | Add error-toast UI for "Ad failed to load — please try again" with bilingual strings |
| 29 | Test matrix | Browser desktop, browser mobile, Capacitor Android device — all 4 unlock features, grace period start, grace period expiry, ad failure path, banner hide/show |

**Total estimated time:** ~14 hours of focused coding, split across **3 sessions**.

---

## 8. Grace Period — Code + Edge Cases

### Implementation (locked)

```typescript
// src/ads/grace-period.ts
const GRACE_KEY = "trueconcept_signup_at";
const GRACE_DURATION_MS = 24 * 60 * 60 * 1000;   // 24 hours

/** Called once on successful registration. Idempotent — only sets if not already set. */
export function recordSignup(): void {
  if (!localStorage.getItem(GRACE_KEY)) {
    localStorage.setItem(GRACE_KEY, Date.now().toString());
  }
}

/** Returns true for the first 24h after signup. */
export function isInGracePeriod(): boolean {
  const signupAt = parseInt(localStorage.getItem(GRACE_KEY) ?? "0", 10);
  if (!signupAt) return false;
  return Date.now() - signupAt < GRACE_DURATION_MS;
}

/** Minutes remaining in grace — for a "23h 45m of free access left" banner. */
export function getGraceMinutesRemaining(): number {
  const signupAt = parseInt(localStorage.getItem(GRACE_KEY) ?? "0", 10);
  if (!signupAt) return 0;
  const remaining = GRACE_DURATION_MS - (Date.now() - signupAt);
  return Math.max(0, Math.floor(remaining / 60_000));
}
```

### Where it's called

- `recordSignup()` — added to `login.tsx` immediately after a successful **registration** (NOT login — only first-time signups get grace).
- `isInGracePeriod()` — checked inside `<UnlockGate />` BEFORE the unlock check.
- `getGraceMinutesRemaining()` — optionally displayed as a banner ("23h 45m of free access left") at the top of `subjects.tsx` or `home.tsx`.

### Edge cases (accepted behaviour)

| Scenario | Behaviour |
|---|---|
| Student clears app data | Grace resets — they get a fresh 24h. Acceptable trade-off; server-side tracking would add backend complexity (Decision #1 forbids backend changes for ads) |
| Student logs out and back in | Grace remains (we keep `GRACE_KEY` even after logout) |
| Student reinstalls APK on a new phone | Fresh grace — fine, acts as device-bound onboarding |
| Student clears browser storage on PC | Fresh grace — same as APK reinstall |
| Student uses both Android + PC | Each device gets its own 24h grace — fine for onboarding |

---

## 9. UnlockGate UX & Decision Tree

### Usage

```tsx
<UnlockGate
  feature="notes"
  title={isAs ? "টোকা আনলক কৰক" : "Unlock Notes"}
  description={isAs
    ? "এক চমু বিজ্ঞাপন চাই পৰৱৰ্তী এক ঘণ্টালৈ টোকা চাবলৈ পাওক।"
    : "Watch a 30-second ad to access notes for the next hour."}
>
  <NotesContent />
</UnlockGate>
```

### Decision tree

```
1. Is the student in grace period (first 24h after signup)?
   ├── YES → render <NotesContent /> directly
   └── NO ↓

2. Is the feature already unlocked (within the 1h window)?
   ├── YES → render <NotesContent /> directly
   └── NO ↓

3. Render <UnlockModal />
   ├── Student clicks "Maybe Later" → render fallback (back to subjects)
   └── Student clicks "Watch Ad"
       ├── adManager.showRewardedAd() called
       ├── On reward earned (true):
       │   ├── unlockFeature("notes")  // 1h TTL set in localStorage
       │   ├── re-render → step 2 succeeds → render <NotesContent />
       │   └── preload next rewarded ad in background
       └── On ad failed / closed early (false):
           ├── FAILSAFE: if failure was an SDK/network error (not user cancel),
           │             auto-unlock the feature so the student is not blocked
           └── On user-cancel: show error toast, stay on modal
```

### Why "Strict per-feature" works for an education app

A typical study session:

```
Open Notes      → (ad #1) → 1 hour Notes unlocked
Try MCQs        → (ad #2) → 1 hour MCQ unlocked
Try Lab         → (ad #3) → 1 hour Lab unlocked
Try QnA         → (ad #4) → 1 hour QnA unlocked

Total: 3-4 ads watched per 2-3 hours of study.
After 1 hour → gates re-appear for fresh unlocks.
```

The **24h grace** means new students experience the app **friction-free for one full day** before any ad walls. They get hooked first, then see ads — industry-standard pattern.

---

## 10. Cross-Platform Considerations

### Android (AdMob) specifics

- AdMob requires the `APPLICATION_ID` meta-data in `AndroidManifest.xml` — app crashes on startup without it
- New AdMob accounts get **throttled eCPM** for the first ~30 days — don't panic, it picks up
- **Indian carriers** sometimes block ad domains — there's nothing we can do at the SDK level

### Web/PC (AdSense) specifics

- **Domain verification:** AdSense requires a verified live domain. If your PC executable runs on `file://`, AdSense will silently refuse to render ads.
  - **Fix:** The PC app should be a lightweight **Electron/Tauri wrapper** that loads the live URL (`https://true-concept-353c9.web.app`) rather than serving bundled local files.
- **AdSense approval delay:** 1–7 days. Site must be live, content-rich, and policy-compliant.
- **Rewarded ads on the web** require **AdSense for H5 Games** approval — a separate program. Until approved, our fallback is a 30-second **non-skippable countdown over a display ad**.
- **Ad-blockers** are common on PC. The failsafe (Rule #4) handles this gracefully.
- **Single-page-app routing:** AdSense ads inside SPA route changes need careful handling — push a new `<ins>` on each route mount, clean up on unmount. The provider takes care of this.

### Shared platform issues

- **localStorage is per-device.** Grace period and unlock state don't sync between Android and PC. Decision #1 forbids backend sync, so this is accepted.
- **Test mode** auto-enabled outside production builds and outside the right platform — see Decision #9.

---

## 11. Economic Projections

### Assumptions (conservative)

- **6-month JWT** (already implemented — students don't re-login often)
- **70% Google Sign-In, 30% Phone OTP** (cuts SMS cost by ~70%)
- **DAU/MAU = 40%** (industry standard for education apps in India)
- **eCPM India:** Banner ₹50, Rewarded ₹500 (mid-range, realistic for AdMob; AdSense web slightly lower)
- **Strict per-feature unlock** → ~2.8 rewarded watches per DAU/day
- **Banner: 25 impressions per DAU/day** on screens that show banner

### Rewarded watches per DAU/day breakdown

| Feature | Daily watches per active student |
|---|---|
| Notes (most-used) | 1.0 |
| MCQ | 0.8 |
| Lab | 0.6 |
| QnA | 0.4 |
| **TOTAL** | **~2.8** |

### 🟢 Scenario 1 — 500 MAU (~200 DAU)

**Monthly costs**

| Service | Cost |
|---|---|
| Firebase Functions | ₹0 (450K invocations < 2M free) |
| Firestore (Blaze) | ₹250 |
| Phone Auth SMS | ₹125 |
| Cloud Storage | ₹165 |
| Firebase Hosting | ₹0 |
| Domain (optional) | ₹85 |
| **TOTAL** | **~₹625/month** |

**Monthly earnings**

| Ad | Calculation | Earnings |
|---|---|---|
| Banner | 200 × 25 days × 25 imp = 125,000 × ₹50/CPM | **₹6,250** |
| Rewarded | 200 × 25 days × 2.8 watches = 14,000 × ₹500/CPM | **₹7,000** |
| **TOTAL** | | **₹13,250** |

**Net: ₹12,625/month (~₹1.51 lakh/year)**

### 🟡 Scenario 2 — 1,000 MAU (~400 DAU)

**Monthly costs**

| Service | Cost |
|---|---|
| Firebase Functions | ₹0 |
| Firestore (Blaze) | ₹400 |
| Phone Auth SMS | ₹250 |
| Cloud Storage | ₹250 |
| Firebase Hosting | ₹165 |
| Domain | ₹85 |
| **TOTAL** | **~₹1,150/month** |

**Monthly earnings**

| Ad | Earnings |
|---|---|
| Banner: 250,000 × ₹50/CPM | **₹12,500** |
| Rewarded: 28,000 × ₹500/CPM | **₹14,000** |
| **TOTAL** | **₹26,500** |

**Net: ₹25,350/month (~₹3.04 lakh/year)**

### 🔴 Scenario 3 — 5,000 MAU (~2,000 DAU)

**Monthly costs**

| Service | Cost |
|---|---|
| Firebase Functions | ₹250 (some overage) |
| Firestore (Blaze) | ₹1,650 |
| Phone Auth SMS | ₹830 |
| Cloud Storage | ₹1,250 |
| Firebase Hosting | ₹400 |
| Domain | ₹85 |
| Buffer | ₹500 |
| **TOTAL** | **~₹4,965/month** |

**Monthly earnings**

| Ad | Earnings |
|---|---|
| Banner: 1,250,000 × ₹50/CPM | **₹62,500** |
| Rewarded: 140,000 × ₹500/CPM | **₹70,000** |
| **TOTAL** | **₹1,32,500** |

**Net: ₹1,27,535/month (~₹15.3 lakh/year)**

### Summary table

| Scale | MAU | DAU | Cost | Earnings | **Net/month** | **Net/year** |
|---|---|---|---|---|---|---|
| Small | 500 | 200 | ₹625 | ₹13,250 | **₹12,625** | **₹1.51 lakh** |
| Medium | 1,000 | 400 | ₹1,150 | ₹26,500 | **₹25,350** | **₹3.04 lakh** |
| Large | 5,000 | 2,000 | ₹4,965 | ₹1,32,500 | **₹1,27,535** | **₹15.3 lakh** |

### Things that push numbers higher

- ✅ Better banner placement (visible more time)
- ✅ Higher eCPM during exam season (Feb–March, Nov–Dec)
- ✅ Engaged students watching 4+ ads/day on heavy-study days
- ✅ Education niche has slightly higher CPM than average

### Things that push numbers lower

- ❌ Lower DAU/MAU (under 30%) if app feels boring
- ❌ High uninstall rate from ad fatigue (mitigated by 24h grace)
- ❌ AdMob throttling new accounts (eCPM artificially low for first 30 days)
- ❌ Indian carrier ad domain blocking
- ❌ AdSense not approved → web/PC users see fallback display ads (lower revenue)

---

## 12. APK Update Procedure

### A. Backend updates (auto-propagate)

```powershell
cd functions
pnpm run build
cd ..
firebase deploy --only functions --project true-concept-353c9
# Live in 3-5 min for ALL users
```

### B. Frontend (Web/PC) updates (auto-propagate)

```powershell
cd artifacts/true-concept
pnpm build
cd ../..
firebase deploy --only hosting --project true-concept-353c9
# Live in 2-3 min for web users on next refresh
# PC Electron/Tauri wrapper picks it up automatically since it loads the live URL
```

### C. APK updates (manual — plan monthly releases)

```powershell
# 1. Bump versionCode in mobile/android/app/build.gradle:
#      versionCode 2          ← was 1
#      versionName "1.1.0"    ← human-readable

# 2. Rebuild APK with production API URL baked in
$env:API_URL = "https://true-concept-353c9.web.app"
cd c:/Users/ASUS/Desktop/Web-App-Assets
node mobile/build.mjs

# 3. APK output:
#      mobile/android/app/build/outputs/apk/debug/app-debug.apk
#      (or /release/app-release.apk for signed builds)

# 4. Distribute via WhatsApp / Google Drive / your website
#    Users install OVER existing app → preserves login + grace + unlocks
```

### Update cadence recommendation

| Component | Update cadence |
|---|---|
| Backend (Functions) | Whenever ready (auto-propagates) |
| Frontend (Web/PWA) | Whenever ready (auto-propagates) |
| PC executable | Whenever the wrapper changes (rare). Frontend updates flow through automatically |
| **APK** | **Monthly releases** — bundle multiple changes per APK |

---

## 13. Web Update Procedure

See Section 12B above. The PC executable (Electron/Tauri wrapper) automatically picks up the live URL — no separate update needed unless the wrapper itself changes.

---

## 14. Recommended Timeline

```
Week 1 — Pending frontend work + manual setup
  Day 1-N:  Finish your pending frontend work (current focus)
  Day N+1:  Deploy frontend to Firebase Hosting (~20 min) + test live
  Day N+2:  Sign up for AdMob — create app + 5 ad units + bank/PAN info (~75 min total)
  Day N+3:  Sign up for AdSense + submit site for approval (~30 min)
            Wait 1-7 days for AdSense approval (continue dev in parallel)

Week 2 — Implementation (3 sessions, ~14 hrs total)
  Session 1 (~4 hrs):  Phase 1 (Foundation) + Phase 2 (AdMob)
  Session 2 (~4 hrs):  Phase 3 (AdSense) + Phase 4 (Unlock Logic)
  Session 3 (~3 hrs):  Phase 5 (UI) + Phase 6 (Page Integration)
  Session 4 (~3 hrs):  Phase 7 (Banner) + Phase 8 (Polish + Code Review)
  Final: Build APK with TEST IDs → install on phone → end-to-end test
         Test web build on a few browsers → end-to-end test

Week 3 — Production rollout
  Day 1: Switch to REAL ad IDs → rebuild APK + redeploy hosting → test once more
  Day 2: Distribute APK to 5-10 beta testers; quietly enable ads on live web
  Day 3-7: Monitor AdMob + AdSense dashboards, fix issues, iterate
```

---

## 15. Pre-Go Checklist

Before saying "Start Phase 1," confirm ALL of these:

- [ ] AdMob account created
- [ ] AdMob App ID copied to a notes file
- [ ] 5 AdMob ad unit IDs copied (1 banner + 4 rewarded)
- [ ] AdMob tax info + bank account submitted
- [ ] AdSense account created (approval can be in-progress; we'll bypass with test/fallback)
- [ ] AdSense publisher ID copied (even if approval pending)
- [ ] AdSense site submitted for approval
- [ ] Frontend deployed to Firebase Hosting (live URL works)
- [ ] Student registration flow tested end-to-end on the live URL
- [ ] Your pending frontend work is finished (or you've explicitly paused it)
- [ ] You're ready to dedicate ~3-4 days for the implementation

---

## 16. Trigger Words to Start

When ready, message me with:

> **"Start Phase 1"**

Plus have these ready (paste them when you say go):

```
ADMOB_APP_ID         = ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
ADMOB_BANNER_ID      = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_REWARDED_NOTES = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_REWARDED_LAB   = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_REWARDED_MCQ   = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_REWARDED_QNA   = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

ADSENSE_PUBLISHER_ID = ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_BANNER_SLOT  = XXXXXXXXXX      (optional — fallback to test slot if not approved yet)
ADSENSE_REWARDED_FB  = XXXXXXXXXX      (optional — used by the 30s countdown fallback)
```

For development I'll use **Google's official test IDs** first — your real IDs only get baked in for production builds. You can ship the AdMob side fully even while AdSense approval is still pending.

---

## 📌 Quick Phase Index

| Phase | What | Time | Output |
|---|---|---|---|
| 1 | Core infra + platform detection + provider interface | 1.5h | Skeleton + `adManager.initialize()` works |
| 2 | AdMob provider (Android) | 2.5h | Real banner + rewarded on Android |
| 3 | AdSense provider (Web/PC) with fallback | 2h | Banner on web; 30s countdown for rewarded |
| 4 | Unlock manager + grace period + unlock actions | 2h | localStorage-backed 1h unlocks |
| 5 | UnlockModal + UnlockGate + AdaptiveBanner components | 2.5h | Reusable, bilingual UI |
| 6 | Wrap NotesTab / McqTab / QaTab / SimComponent | 1h | 4 features gated |
| 7 | Place banner on appropriate pages + lifecycle handlers | 1h | Banner shows where bottom nav is hidden |
| 8 | Hardening, test matrix, production-ID guarding | 1.5h | Shippable build |

**Total: ~14 hours, split across 3-4 focused sessions.**

---

*Plan consolidated, decisions locked, both platforms covered. Ready to execute on "Start Phase 1."*
