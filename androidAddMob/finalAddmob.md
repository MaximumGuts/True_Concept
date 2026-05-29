# TRUE CONCEPT — AdMob Implementation Plan (FINAL)

> Single source of truth for the AdMob integration. **All decisions locked.** Ready to execute when you say "Start Phase 1."

---

## 🎯 Decisions (LOCKED)

| Decision | Choice | Why |
|---|---|---|
| Platform target | **Android APK only** | Capacitor AdMob plugin doesn't work on web; web stays ad-free |
| Hosting (frontend) | **Firebase Hosting** | Already wired in `firebase.json` rewrites → Functions |
| Banner placement | **Page-level** — render `<TinyBanner />` on screens where you've hidden the bottom nav | You manage nav visibility manually |
| Ad formats | **Banner + Rewarded only** — NO interstitials | Cleaner UX for education app |
| **Unlock model** | **A. Strict per-feature** — Notes/Lab/MCQ/QnA each unlock separately for 1 hour | Highest revenue. Friction mitigated by 24h grace below |
| **New-student grace** | **First 24 hours unlocked free** | Smooth onboarding → better retention |
| Test mode toggle | `IS_TESTING = !import.meta.env.PROD \|\| !isCapacitorAndroid()` | Production ads only ship from production builds |

---

## 📁 Final Folder Structure (To Be Created)

```
artifacts/true-concept/src/
└── ads/                                  ← NEW: all AdMob logic isolated
    ├── config.ts                         ← Test/Production ad IDs (env-aware)
    ├── platform.ts                       ← Capacitor Android detection
    ├── admob-init.ts                     ← One-time AdMob initialization
    ├── rewarded-manager.ts               ← Preload + show + auto-reload
    ├── unlock-manager.ts                 ← localStorage feature unlocks (1h TTL)
    ├── grace-period.ts                   ← First-24h-free for new students
    ├── unlock-actions.ts                 ← Composer: unlockNotes/Lab/MCQ/QnA
    ├── lifecycle.ts                      ← App resume/background handlers
    └── components/
        ├── UnlockModal.tsx               ← "Watch Ad" modal
        ├── UnlockGate.tsx                ← Wraps protected sections
        └── TinyBanner.tsx                ← Adaptive banner

# Modified files
artifacts/true-concept/src/main.tsx       ← Wire initAdMob() on startup
artifacts/true-concept/src/pages/login.tsx ← Call recordSignup() after registration
artifacts/true-concept/src/pages/chapter-detail.tsx  ← Wrap NotesTab, McqTab, QaTab
artifacts/true-concept/src/pages/experiment-detail.tsx  ← Wrap experiment interaction
mobile/android/app/src/main/AndroidManifest.xml  ← Add APPLICATION_ID meta-data
artifacts/true-concept/package.json       ← Add @capacitor-community/admob
```

---

## 🛒 Pre-Implementation: Manual Setup (Your Tasks Before "Go")

These don't require code — do them whenever convenient.

### A. Sign up for AdMob (~30 min)

1. Visit https://admob.google.com — sign up with your Gmail
2. Add app:
   - Platform: **Android**
   - App name: `TRUE CONCEPT`
   - Package name: `com.trueconcept.app`
3. **Copy the App ID** — looks like `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### B. Create 5 Ad Units (~15 min)

In AdMob → your app → **Add ad unit** → repeat 5 times:

| # | Type | Name | Reward (for rewarded) |
|---|---|---|---|
| 1 | Banner | `Banner — Tiny Adaptive` | — |
| 2 | Rewarded | `Rewarded — Notes Unlock` | `1 hour of Notes access` |
| 3 | Rewarded | `Rewarded — Lab Unlock` | `1 hour of Lab access` |
| 4 | Rewarded | `Rewarded — MCQ Unlock` | `1 hour of MCQ access` |
| 5 | Rewarded | `Rewarded — QnA Unlock` | `1 hour of QnA access` |

Save all 5 Ad Unit IDs (format `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`).

### C. Add Tax + Bank Info on AdMob (~30 min)

In AdMob → **Payments** → fill in:
- PAN card number (required for India)
- Bank account (NEFT/IMPS) — UPI not supported by AdMob yet
- Tax residence: India

### D. Verify Firebase setup

- Project on **Blaze plan** ✓ (already done)
- Phone Auth provider **enabled** ✓ (already done)
- India SMS region **allowed** ✓ (verify in Firebase Console)
- Frontend deployed to **Firebase Hosting** ✓ (do this BEFORE Phase 1)

---

## 📋 Implementation Phases (After "Go")

### Phase 1 — Foundation (~2.5 hrs)

| Step | File | Action |
|---|---|---|
| 1 | `mobile/android/app/src/main/AndroidManifest.xml` | Add `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" />` |
| 2 | `package.json` (true-concept) | `pnpm add @capacitor-community/admob` |
| 3 | `mobile/` | Run `npx cap sync android` |
| 4 | `src/ads/platform.ts` | `isCapacitorAndroid()` helper |
| 5 | `src/ads/config.ts` | Test IDs (Google's official) + your real IDs, env-aware switch |
| 6 | `src/ads/admob-init.ts` | One-time init with consent form |
| 7 | `src/main.tsx` | Call `initAdMob()` in bootstrap |

### Phase 2 — Core Managers (~2 hrs)

| Step | File | Action |
|---|---|---|
| 8 | `src/ads/rewarded-manager.ts` | preload / show / auto-reload, handle `closed-early` and `failed-to-load` |
| 9 | `src/ads/unlock-manager.ts` | `unlockFeature(feature)`, `isFeatureUnlocked(feature)`, `getRemainingUnlockTime(feature)` — keys: `notes` / `lab` / `mcq` / `qna`, **1h TTL** in localStorage |
| 10 | `src/ads/grace-period.ts` | `recordSignup()` writes timestamp on first registration. `isInGracePeriod()` returns true for first 24h |
| 11 | `src/ads/unlock-actions.ts` | `unlockNotes()`, `unlockLab()`, `unlockMCQ()`, `unlockQnA()` — compose rewarded-manager + unlock-manager. Reward only on confirmed earned-callback |

### Phase 3 — UI Components (~2 hrs)

| Step | File | Action |
|---|---|---|
| 12 | `src/ads/components/UnlockModal.tsx` | Premium modal: title, description, **Watch Ad button** (loading state), **Cancel button**, prevent double-click, smooth Framer Motion animations |
| 13 | `src/ads/components/UnlockGate.tsx` | Wrapper. Logic: `if (graceActive \|\| isUnlocked) → render children. Else → <UnlockModal />` |

### Phase 4 — Page Integration (~1 hr)

Wrap protected content:

| Step | File | Where |
|---|---|---|
| 14 | `src/pages/chapter-detail.tsx` (NotesTab) | Wrap notes content rendering in `<UnlockGate feature="notes">` |
| 15 | `src/pages/experiment-detail.tsx` | Wrap simulation interaction in `<UnlockGate feature="lab">` (allow page browsing, gate only the SimComponent) |
| 16 | `src/pages/chapter-detail.tsx` (McqTab) | Wrap MCQ quiz interaction in `<UnlockGate feature="mcq">` |
| 17 | `src/pages/chapter-detail.tsx` (QaTab) | Wrap expanded QnA answer reveal in `<UnlockGate feature="qna">` |

### Phase 5 — Banner + Polish (~2 hrs)

| Step | File | Action |
|---|---|---|
| 18 | `src/ads/components/TinyBanner.tsx` | Mounts adaptive banner at `BOTTOM_CENTER` on `useEffect` mount, hides on unmount |
| 19 | Pages where you've hidden bottom nav | Render `<TinyBanner />` there (page-level decision) |
| 20 | `src/ads/lifecycle.ts` | `App.addListener('appStateChange', ...)` — recheck unlocks on resume, reload stale ads |
| 21 | `src/ads/admob-init.ts` | Wire lifecycle handlers |
| 22 | `src/ads/config.ts` | Final hardening: production IDs ONLY when `import.meta.env.PROD === true` AND `isCapacitorAndroid()` |
| 23 | `src/ads/*` (all files) | Code review pass — memory leaks, cleanups, web safety, TS strictness |

**Total: ~9-10 hrs of focused coding** (split across 2-3 sessions).

---

## 🧮 The Grace Period — Detailed Logic

### Implementation

```typescript
// src/ads/grace-period.ts
const GRACE_KEY = "trueconcept_signup_at";
const GRACE_DURATION_MS = 24 * 60 * 60 * 1000;   // 24 hours

/** Called once on successful registration. Idempotent. */
export function recordSignup() {
  if (!localStorage.getItem(GRACE_KEY)) {
    localStorage.setItem(GRACE_KEY, Date.now().toString());
  }
}

/** Returns true for first 24h after signup. */
export function isInGracePeriod(): boolean {
  const signupAt = parseInt(localStorage.getItem(GRACE_KEY) ?? "0", 10);
  if (!signupAt) return false;
  return Date.now() - signupAt < GRACE_DURATION_MS;
}

/** Minutes remaining in grace (for showing a banner like "23h 45m of free access left"). */
export function getGraceMinutesRemaining(): number {
  const signupAt = parseInt(localStorage.getItem(GRACE_KEY) ?? "0", 10);
  if (!signupAt) return 0;
  const remaining = GRACE_DURATION_MS - (Date.now() - signupAt);
  return Math.max(0, Math.floor(remaining / 60_000));
}
```

### Where it's called

- `recordSignup()` — added to `login.tsx` immediately after successful **registration** (NOT login — only first-time users get grace)
- `isInGracePeriod()` — checked inside `<UnlockGate />` BEFORE the unlock check

### Edge cases

| Scenario | Behavior |
|---|---|
| Student clears app data | Grace resets — they get fresh 24h. Acceptable: server-side tracking adds complexity |
| Student logs out and back in | Grace remains (we keep `GRACE_KEY` even after logout) |
| Student installs APK on a new phone | Fresh grace — fine, acts as device-bound onboarding |

---

## 🎨 UnlockGate UX Behavior

```tsx
<UnlockGate
  feature="notes"
  title="Unlock Notes"
  description="Watch a 30-second ad to access notes for the next hour."
>
  <NotesContent />
</UnlockGate>
```

### Decision tree

```
1. Is user in grace period (first 24h after signup)?
   ├── YES → render <NotesContent /> directly
   └── NO ↓

2. Is feature already unlocked (within 1h window)?
   ├── YES → render <NotesContent /> directly
   └── NO ↓

3. Render <UnlockModal />
   ├── Student clicks "Maybe Later" → render fallback (back to subjects)
   └── Student clicks "Watch Ad"
       ├── Show rewarded ad
       ├── On reward earned:
       │   ├── unlockFeature("notes")          // 1h TTL set in localStorage
       │   ├── re-render → step 2 succeeds → render <NotesContent />
       │   └── preload next rewarded ad in background
       └── On ad failed/closed early:
           └── Show error toast, stay on modal
```

### Why "Strict per-feature" works for education

A typical study session looks like:

```
Open Notes (first ad)        → 1 hour Notes unlocked
Try MCQs (second ad)          → 1 hour MCQ unlocked
Try Lab experiment (3rd ad)   → 1 hour Lab unlocked
Try QnA (4th ad — rare)       → 1 hour QnA unlocked

Total: 3-4 ads watched in 2-3 hours of study.
After 1 hour → go through gates again for fresh unlocks.
```

The **24h grace period** means new students experience the app friction-free for one full day before any ad walls. They get hooked first, THEN see ads. Industry-standard pattern for education monetization.

---

## 💰 Final Cost & Earnings Projections

### Assumptions

- **6-month JWT** (already implemented)
- **70% Google Sign-In, 30% Phone OTP** (cuts SMS cost by ~70%)
- **DAU/MAU = 40%** (industry standard for education apps in India)
- **eCPM India:** Banner ₹50, Rewarded ₹500 (mid-range realistic)
- **Strict per-feature unlock = ~2.8 rewarded watches per DAU/day**
- **Banner: 25 impressions per DAU/day** on screens that show banner

### Earnings Per Feature Per DAU/Day (Strict Model)

| Feature | Daily watches per active student |
|---|---|
| Notes | 1.0 (most-used feature) |
| MCQ | 0.8 |
| Lab | 0.6 |
| QnA | 0.4 |
| **Total rewarded watches per DAU/day** | **~2.8** |

### 🟢 Scenario 1 — 500 MAU (~200 DAU)

#### Costs

| Service | Cost |
|---|---|
| Firebase Functions | ₹0 (450K invocations < 2M free) |
| Firestore (Blaze) | ₹250 |
| Phone Auth SMS | ₹125 |
| Cloud Storage | ₹165 |
| Firebase Hosting | ₹0 |
| Domain (optional) | ₹85 |
| **TOTAL** | **~₹625/month** |

#### Earnings

| Ad | Calculation | Monthly |
|---|---|---|
| Banner | 200 × 25 days × 25 imp = 125,000 × ₹50 | **₹6,250** |
| Rewarded | 200 × 25 days × 2.8 watches = 14,000 × ₹500 | **₹7,000** |
| **TOTAL** | | **₹13,250** |

#### Net

```
Earnings:  ₹13,250
Costs:     -₹625
─────────────────────
NET:       ₹12,625/month  (~₹1,51,500/year)
```

### 🟡 Scenario 2 — 1,000 MAU (~400 DAU)

#### Costs

| Service | Cost |
|---|---|
| Firebase Functions | ₹0 |
| Firestore (Blaze) | ₹400 |
| Phone Auth SMS | ₹250 |
| Cloud Storage | ₹250 |
| Firebase Hosting | ₹165 |
| Domain | ₹85 |
| **TOTAL** | **~₹1,150/month** |

#### Earnings

| Ad | Monthly |
|---|---|
| Banner: 250,000 × ₹50 | **₹12,500** |
| Rewarded: 28,000 × ₹500 | **₹14,000** |
| **TOTAL** | **₹26,500** |

#### Net

```
Earnings:  ₹26,500
Costs:     -₹1,150
─────────────────────
NET:       ₹25,350/month  (~₹3,04,200/year)
```

### 🔴 Scenario 3 — 5,000 MAU (~2,000 DAU)

#### Costs

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

#### Earnings

| Ad | Monthly |
|---|---|
| Banner: 1,250,000 × ₹50 | **₹62,500** |
| Rewarded: 140,000 × ₹500 | **₹70,000** |
| **TOTAL** | **₹1,32,500** |

#### Net

```
Earnings:  ₹1,32,500
Costs:     -₹4,965
─────────────────────
NET:       ₹1,27,535/month  (~₹15.3 lakh/year)
```

### 📊 Summary Table

| Scale | MAU | DAU | Cost | Earnings | **Net Profit** | **Annual Net** |
|---|---|---|---|---|---|---|
| Small | 500 | 200 | ₹625 | ₹13,250 | **₹12,625** | **₹1.51 lakh** |
| Medium | 1,000 | 400 | ₹1,150 | ₹26,500 | **₹25,350** | **₹3.04 lakh** |
| Large | 5,000 | 2,000 | ₹4,965 | ₹1,32,500 | **₹1,27,535** | **₹15.3 lakh** |

### Sanity Checks

These numbers are **conservative**. Things that can push them higher:
- ✅ Better banner placement (visible more time)
- ✅ Higher eCPM during exam season (March, December)
- ✅ Engaged students watching 4+ ads/day on heavy-study days
- ✅ Premium category ad targeting (education niche has higher CPMs)

Things that can push them lower:
- ❌ Lower DAU/MAU (under 30%) if app feels boring
- ❌ High uninstall rate from ad fatigue (mitigated by 24h grace)
- ❌ AdMob throttling new accounts (eCPM artificially low for first 30 days)
- ❌ Indian carrier ad blocking

---

## 🚦 APK Update Procedure (After Deployment)

### A. Backend Updates (Auto)

```powershell
cd functions
pnpm run build
cd ..
firebase deploy --only functions --project true-concept-353c9
# Live in 3-5 min for ALL users
```

### B. Frontend (Web) Updates (Auto)

```powershell
cd artifacts/true-concept
pnpm build
cd ../..
firebase deploy --only hosting --project true-concept-353c9
# Live in 2-3 min for web users on next refresh
```

### C. APK Updates (Manual — Plan Monthly Releases)

```powershell
# 1. Bump versionCode (so Android treats it as an update, not a fresh install)
# Edit mobile/android/app/build.gradle:
#   versionCode 2     ← was 1
#   versionName "1.1.0"  ← human-readable

# 2. Rebuild APK with production API URL baked in
$env:API_URL = "https://true-concept-353c9.web.app"
cd c:/Users/ASUS/Desktop/Web-App-Assets
node mobile/build.mjs

# 3. APK lands at:
# mobile/android/app/build/outputs/apk/debug/app-debug.apk

# 4. Distribute via WhatsApp / Google Drive / your website
# Users install OVER existing app — preserves login + grace period + unlocks
```

### D. Frequency Recommendation

| Component | Update cadence |
|---|---|
| Backend (Functions) | Whenever ready (auto-propagates) |
| Frontend (Web/PWA) | Whenever ready (auto-propagates) |
| **APK** | **Monthly releases** — bundle multiple changes into one APK |

---

## 🚦 Recommended Action Plan

```
Week 1 (your current frontend work):
  Day 1-N: Finish your pending frontend work
  Day N+1: Deploy frontend to Firebase Hosting (~20 min) + test live
  Day N+2: Sign up for AdMob, create app + 5 ad units, add bank/PAN info

Week 2 (AdMob implementation, ~2-3 days):
  Session 1 (~3 hrs): Phase 1 (Foundation) + Phase 2 (Core Managers)
  Session 2 (~3 hrs): Phase 3 (UI) + Phase 4 (Page Integration)
  Session 3 (~3 hrs): Phase 5 (Banner + Polish + Code Review)
  Final:    Build APK with TEST IDs → install on phone → end-to-end test

Week 3 (production rollout):
  Day 1: Switch to REAL ad IDs → rebuild APK → test once more
  Day 2: Distribute to 5-10 beta testers
  Day 3-7: Monitor AdMob dashboard, fix issues, iterate
```

---

## ✅ Pre-"Go" Checklist

Before saying "Start Phase 1," confirm:

- [ ] AdMob account created
- [ ] App ID copied to a notes file
- [ ] 5 ad unit IDs copied (1 banner + 4 rewarded)
- [ ] Tax info + bank account submitted on AdMob
- [ ] Frontend deployed to Firebase Hosting (test live URL works)
- [ ] You've tested student registration flow end-to-end on the live URL
- [ ] You've finished your pending frontend work
- [ ] You're ready to dedicate ~2-3 days for the implementation

---

## 🎯 The Order I'll Execute (When You Say Go)

```
Session 1 (~3 hrs):
  Phase 1 — Foundation (plugin install + manifest + init + config + platform)
  Phase 2 — Core Managers (rewarded + unlock + grace-period + unlock-actions)

Session 2 (~3 hrs):
  Phase 3 — UI Components (UnlockModal + UnlockGate)
  Phase 4 — Page Integration (4 places: Notes/Lab/MCQ/QnA)

Session 3 (~3 hrs):
  Phase 5 — Banner + Lifecycle + Polish + Code Review
  Test build APK with TEST IDs
  Document the production switch-over steps
```

After Session 3, you'll have:
- ✅ Working APK with 4 ad walls + tiny banner
- ✅ 24-hour grace period for new students
- ✅ All ads using TEST IDs (safe for development)
- ✅ Documentation for switching to REAL IDs when you publish

---

## 📞 Trigger Words To Start

When ready, message me with:

> **"Start Phase 1"**

Plus have these ready (paste them when you say go):

```
ADMOB_APP_ID         = ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
BANNER_AD_UNIT_ID    = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
REWARDED_NOTES_ID    = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
REWARDED_LAB_ID      = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
REWARDED_MCQ_ID      = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
REWARDED_QNA_ID      = ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

(For development I'll use Google's official test IDs first — your real IDs only get baked in for production builds.)

---

*Plan finalized. All decisions locked. Ready to execute.*
