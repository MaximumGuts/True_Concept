# TRUE CONCEPT — Unified Ad Implementation Plan (Android + PC)

## 🎯 The Challenge: Cross-Platform Ads
The previous ad plan (`finalAddmob.md`) exclusively used **AdMob**, which is strictly for mobile (Android/iOS) and **does not work on PC/Desktop executables** (Electron/Tauri) or standard Web. 

Since you are now expanding to a **PC exe app**, the ad architecture must be redesigned to support both platforms seamlessly without breaking or duplicating your UI logic.

## 🏗️ The Solution: Unified Ad Architecture (Facade Pattern)
We will create a **Unified Ad Manager** that acts as a bridge. The UI components (Unlock Gate, Banner) will talk *only* to the Unified Ad Manager. Under the hood, the manager will detect the platform and delegate the request to the correct ad network:

1. **Android App (Capacitor)** ➔ Routes to **Google AdMob** (`@capacitor-community/admob`)
2. **PC App / Web** ➔ Routes to **Google AdSense** (or a fallback Web Ad Network / Custom House Ads)

---

## 🛡️ STRICT RULES OF IMPLEMENTATION (LOCKED IN MEMORY)
Before executing this plan, these absolute rules must be followed:
1. **Zero Backend Changes:** No modifications to Firebase Functions, Firestore, or API routes. Ads are 100% client-side.
2. **Isolated Logic:** All AdMob/AdSense complex logic lives exclusively in the new `src/ads/` directory.
3. **Non-Destructive Frontend Changes:** Existing UI components (`NotesTab`, `McqTab`, `Simulation`) will NOT have their internal code altered. We will exclusively use React Composition to wrap them with `<UnlockGate>`.
4. **Failsafe Design:** If an ad fails to load (due to network issues, ad-blockers, or SDK glitches), the `UnlockGate` must automatically open. **No student will ever be locked out due to an ad failure.**

---

## 📁 New Architecture Folder Structure

```text
artifacts/true-concept/src/
└── ads/
    ├── unified-ad-manager.ts     ← The main interface your app talks to
    ├── providers/
    │   ├── admob-provider.ts     ← Android AdMob implementation
    │   └── adsense-provider.ts   ← PC/Web AdSense implementation (placeholder for now)
    ├── config.ts                 ← IDs for both AdMob and AdSense
    ├── platform.ts               ← Detects Android vs PC
    ├── unlock-manager.ts         ← localStorage feature unlocks (1h TTL)
    ├── grace-period.ts           ← First-24h-free for new students
    └── components/
        ├── UnlockModal.tsx       ← Unified "Watch Ad" modal (works on both)
        ├── UnlockGate.tsx        ← Wraps protected sections
        └── AdaptiveBanner.tsx    ← Mounts either native AdMob banner or HTML <ins> tag
```

---

## 🔌 Provider Implementations

### 1. Android (AdMob Provider)
- Uses `@capacitor-community/admob`
- **Banner**: Native banner overlaid on top of the webview.
- **Rewarded**: High-eCPM full-screen native video ads.

### 2. PC / Web (AdSense Provider)
- Uses standard Web Ad networks (Google AdSense via `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">`).
- **Banner**: Renders standard HTML/JS banner ads (`<ins class="adsbygoogle">`) directly into the React DOM.
- **Rewarded**: Uses Google's **AdSense for Platforms / H5 Games Ads** (which supports rewarded video on the web) OR falls back to a custom mandatory "Sponsor Video" or standard display ad with a countdown timer if web rewarded ads aren't approved yet.

---

## 🔄 The Implementation Phases

### Phase 1 — Core Infrastructure & Platform Detection
1. Create `platform.ts` to detect `isCapacitorAndroid()` vs `isPC()`.
2. Define the `AdProvider` interface:
   ```typescript
   export interface AdProvider {
     initialize(): Promise<void>;
     showAdaptiveBanner(): Promise<void>;
     hideBanner(): Promise<void>;
     showRewardedAd(): Promise<boolean>; // Returns true if reward was earned
   }
   ```
3. Implement `UnifiedAdManager` that instantiates the correct provider based on the platform.

### Phase 2 — Android AdMob Integration
1. Install `@capacitor-community/admob`.
2. Implement `admob-provider.ts` using native capacitor calls.
3. Hook up AdMob App IDs and Ad Unit IDs in the Android Manifest.

### Phase 3 — PC AdSense Integration (Deferred for later)
1. Implement `adsense-provider.ts` (initially bypassing ads for free).
2. Later: Add the AdSense script tag to `index.html`.
3. Later: Implement the AdSense `<ins>` tag injection logic for banners.
4. Later: Implement a Web Rewarded Ad flow.

### Phase 4 — Unified UI & Unlocks
1. Implement the `grace-period.ts` (first 24 hrs free) and `unlock-manager.ts` (1-hour unlock TTLs) just like the original plan.
2. Build `<UnlockModal />`:
   - Clicking "Watch Ad" calls `UnifiedAdManager.showRewardedAd()`.
   - On success `=>` Unlock feature `=>` hide modal.
3. Build `<AdaptiveBanner />`:
   - Calls `UnifiedAdManager.showAdaptiveBanner()`.

### Phase 5 — Page Integration
Wrap the 4 core features exactly as planned:
1. **Notes**: `<UnlockGate feature="notes"> <NotesTab /> </UnlockGate>`
2. **MCQ**: `<UnlockGate feature="mcq"> <McqTab /> </UnlockGate>`
3. **QnA**: `<UnlockGate feature="qna"> <QaTab /> </UnlockGate>`
4. **Lab**: `<UnlockGate feature="lab"> <Simulation /> </UnlockGate>`

---

## ⚠️ Important Considerations for PC Ads

AdMob is straightforward, but **PC / AdSense** has specific rules:
1. **Domain Verification**: Google AdSense requires a verified live domain. If your PC executable runs on a local `file://` protocol, AdSense will block the ads. 
   - *Fix*: Your PC App should ideally be a lightweight wrapper (like Electron) that loads your live hosted web app URL (e.g., `https://true-concept-353c9.web.app`), rather than serving local files.
2. **Rewarded Web Ads**: Google AdSense does offer Rewarded Ads (AdSense for H5), but your account needs to be approved for it. Until approved, you may need to use a fallback "Countdown Display Ad" for PC users to earn their unlocks.
