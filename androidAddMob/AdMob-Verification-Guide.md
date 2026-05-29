# AdMob Verification Guide — Capacitor / Android

How to verify your AdMob integration is working **without** manually building and
distributing a release APK every time. This is the developer inner-loop for
`@capacitor-community/admob` inside a Capacitor-wrapped React app.

---

## The fast inner loop (≈ 30 s per iteration)

```powershell
# One-time setup
#  • On your phone: enable Developer Mode + USB Debugging, then connect via USB
#  • OR start an Android emulator from Android Studio (Pixel 6 / API 33 works)

# Each time you change code:
npm run build                    # build the web assets
npx cap sync android             # copy the web bundle into the Android project
npx cap run android              # build a DEBUG apk, install it, and launch on the connected device
```

No manual APK upload, no Play Store. The first run takes ~60 s; subsequent runs
are ~10 s thanks to Gradle caching. The freshly-installed debug build behaves
identically to a release APK for AdMob purposes — same plugin, same SDK, same
ad-fetch lifecycle.

---

## Four mandatory pieces for correct verification

### 1. Use Google's official test ad-unit IDs in dev

These IDs **always** return a working test ad. They never bill, they never
risk your AdMob account. Use them in every dev/QA build.

| Ad type                | Test Ad Unit ID (Android)                          |
| ---------------------- | -------------------------------------------------- |
| Banner                 | `ca-app-pub-3940256099942544/6300978111`           |
| Interstitial           | `ca-app-pub-3940256099942544/1033173712`           |
| Rewarded               | `ca-app-pub-3940256099942544/5224354917`           |
| Rewarded interstitial  | `ca-app-pub-3940256099942544/5354046379`           |
| App open               | `ca-app-pub-3940256099942544/3419835294`           |
| Native                 | `ca-app-pub-3940256099942544/2247696110`           |

Test App ID (`AndroidManifest.xml`): `ca-app-pub-3940256099942544~3347511713`

Wire these via an environment flag so the swap to real IDs is one line at
production-build time:

```ts
const isDev = process.env.NODE_ENV !== "production";

export const AD_UNITS = {
  banner: isDev
    ? "ca-app-pub-3940256099942544/6300978111"
    : "ca-app-pub-XXXXXXXXXX/XXXXXXXXXX",   // your real banner unit
  interstitial: isDev
    ? "ca-app-pub-3940256099942544/1033173712"
    : "ca-app-pub-XXXXXXXXXX/XXXXXXXXXX",   // your real interstitial unit
  rewarded: isDev
    ? "ca-app-pub-3940256099942544/5224354917"
    : "ca-app-pub-XXXXXXXXXX/XXXXXXXXXX",   // your real rewarded unit
};
```

### 2. Register your real device as a "test device" before going live with real IDs

When you switch to real ad-unit IDs for a final pre-launch test, **never click
on the ads yourself** — that's a permanent AdMob account ban.

The first time you run the app in debug with real IDs, logcat prints a line like:

```
Use AdRequest.Builder.addTestDevice("ABCDEF0123456789ABCDEF...") to get test ads on this device.
```

Pass that hashed device ID to `AdMob.initialize`:

```ts
import { AdMob } from "@capacitor-community/admob";

await AdMob.initialize({
  testingDevices: ["ABCDEF0123456789ABCDEF..."],   // your hashed device id
  initializeForTesting: true,
});
```

Now your real ad units serve TEST creatives on your device — safe to inspect,
impossible to click-trigger fraud detection.

### 3. Subscribe to plugin lifecycle events and log everything

The plugin emits events for every stage of the ad lifecycle. Wire listeners in
dev so the JS console tells you exactly what AdMob is doing.

```ts
import {
  AdMob,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";

// Banner
AdMob.addListener(BannerAdPluginEvents.Loaded, () =>
  console.log("[admob] banner loaded ✓"));
AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) =>
  console.warn("[admob] banner failed:", err.code, err.message));
AdMob.addListener(BannerAdPluginEvents.SizeChanged, (info) =>
  console.log("[admob] banner size:", info.width, "×", info.height));
AdMob.addListener(BannerAdPluginEvents.Opened, () =>
  console.log("[admob] banner opened"));
AdMob.addListener(BannerAdPluginEvents.Closed, () =>
  console.log("[admob] banner closed"));

// Interstitial
AdMob.addListener(InterstitialAdPluginEvents.Loaded, () =>
  console.log("[admob] interstitial loaded ✓"));
AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) =>
  console.warn("[admob] interstitial failed:", err.code, err.message));
AdMob.addListener(InterstitialAdPluginEvents.Showed, () =>
  console.log("[admob] interstitial showed"));
AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () =>
  console.log("[admob] interstitial dismissed"));

// Rewarded
AdMob.addListener(RewardAdPluginEvents.Loaded, () =>
  console.log("[admob] rewarded loaded ✓"));
AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) =>
  console.log("[admob] rewarded earned:", reward.type, reward.amount));
AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (err) =>
  console.warn("[admob] rewarded failed:", err.code, err.message));
```

### 4. Read logs in real time — two channels

#### JS side — Chrome DevTools remote inspect

With the phone connected and the app running on it:

1. Open Chrome on your PC.
2. Go to **`chrome://inspect`**.
3. Find your app in the "Remote Target" list and click **inspect**.
4. Full Chrome DevTools opens — Console, Network, Elements, Sources, the works.
5. Every `console.log` from your React code AND every plugin event listed above
   appears in the Console tab in real time.

#### Native side — Android logcat

```powershell
# Show only ad-related noise + any errors
adb logcat -s "Ads" "Ads:I" "GoogleMobileAds" "*:E"
```

This shows Google's native SDK logs — ad fetch URLs, fill rates, error codes,
the test-device hash printed on first run, mediation chain results, etc.

Common error codes:

| Code | Meaning            | Likely cause                              |
| ---- | ------------------ | ----------------------------------------- |
| 0    | INTERNAL_ERROR     | SDK issue, retry                          |
| 1    | INVALID_REQUEST    | Wrong ad unit ID or malformed request     |
| 2    | NETWORK_ERROR      | Device offline                            |
| 3    | NO_FILL            | No ad inventory — expected sometimes      |

---

## What you can verify WITHOUT a device at all

Some logic doesn't need the native plugin to fire — you can test in plain Vite
dev (`npm run dev` in a browser) with a small mock layer:

- Where the `<AdProvider>` mounts (which routes get ads)
- The placeholder slot reserved where the bottom nav used to be
- Gate / grace-period / quota logic
- `UnlockGate` UI flows (free vs paid users, cooldowns)
- Conditional rendering when an ad fails to load (since the plugin no-ops
  outside Capacitor, you can mock the events with a small dev helper)

Anything involving an actual ad fetch from Google needs `npx cap run android`
on a real device or emulator.

---

## End-to-end checklist for your first banner

1. **Install the plugin:**
   `npm install @capacitor-community/admob`
2. **Sync into Android project:**
   `npx cap sync android`
3. **Wire test ad unit ID + event listeners** (see sections 1 & 3 above).
4. **Set test App ID** in `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-3940256099942544~3347511713"/>
   ```
5. **Connect phone (USB-debug enabled)** OR start an emulator.
6. **Run on device:**
   `npx cap run android`
7. **Open Chrome → `chrome://inspect`** → click **inspect** on your app.
8. **Navigate to a screen** that has a banner.
9. **Watch Console** — you should see `[admob] banner loaded ✓`.
10. **Look at the screen** — Google's TEST BANNER appears in the slot.

If step 9 logs `[admob] banner failed:` with:
- `code 3 (NO_FILL)` → harmless even for test ads; retry the navigation.
- `code 1 (INVALID_REQUEST)` → double-check your ad unit ID and App ID.
- `code 2 (NETWORK_ERROR)` → device is offline.

Total iteration time once set up: change code → `npm run build && npx cap sync android && npx cap run android` → ~30 s → see live test ad. **No manual APK
distribution involved.**

---

## When you finally ship

The exact same code path is used for the release build. You only change:

1. Swap test ad-unit IDs for your real ones (the env flag handles this).
2. Replace the test App ID in `AndroidManifest.xml` with your real one.
3. Build the release APK / AAB.
4. (One last sanity check) Run it on your registered test device using
   `testingDevices` so you see test creatives on real units.
5. Ship.

---

# Going Live for Real Users — Play Store Path

Short answer: **yes, Google Play Store is the right (and recommended) path** —
AdMob explicitly verifies apps through their Play Store listing, and sideloaded
apps earn significantly less (lower fill rate, capped revenue, restricted ad
formats, suspicious-traffic flags).

---

## What "ready for production" means

Three things must be true at the same time:

1. **Your app is on Google Play Store** (open OR closed/internal testing track
   — even an internal one is enough for AdMob verification).
2. **Your AdMob account is approved** with payment + tax info filled in.
3. **The release build uses real ad-unit IDs**, real App ID in
   `AndroidManifest.xml`, signed with your release keystore.

Miss any of these and either ads don't show, or they show but you don't get
paid, or you risk being banned.

---

## Why Play Store specifically matters for AdMob

When you create an Android app in AdMob, you link it by package name
(e.g. `com.trueconcept.app`). AdMob then tries to find that package on the
Play Store:

| Listing status                                | What AdMob does                                                                              |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Published on Play Store**                   | App is "verified" → full ad fill, all ad formats, full eCPM                                  |
| **Closed / Internal testing on Play Store**   | Verified for AdMob once the listing exists — even before public launch                       |
| **Sideloaded only (not on Play Store)**       | Marked "unverified" → reduced fill, lower eCPM, may be flagged as suspicious, hard to scale  |

So even if you don't want a public launch yet, **push at minimum an internal
testing track** so AdMob sees a listing for the package name.

---

## Step-by-step roadmap — current state → first real impression

### Phase A — Do these in parallel with ad coding (no dependencies on the ad code)

1. **Google Play Console signup** — pay the one-time **$25** (~₹2,000) fee.
   Use the same Google account as AdMob if you can.
2. **AdMob signup** at admob.google.com. Add the Android app by its package
   name (must exactly match `applicationId` in `android/app/build.gradle`).
3. **AdMob payment info:**
   - Country: India
   - Add UPI / bank account
   - Upload PAN card (mandatory for Indian publishers)
   - Fill the W-8BEN tax form (a guided wizard, ~5 min)
4. **Create your real ad units in AdMob** — at minimum one banner. Get the
   real unit IDs ready to drop into the env-flagged config. **Do NOT use real
   IDs in dev builds.**
5. **Privacy policy** — required by Play Store AND AdMob. Must say:
   - You use Google AdMob
   - It collects the Advertising ID
   - Data is shared with Google for ad personalisation
   - Users can opt out (link to Google Ads Settings)
   - Host it at a public URL — your `true-concept-353c9.web.app` works
     fine; add a `/privacy` route.
6. **Generate your release keystore** (ONE-TIME — losing this means you can
   NEVER update the app on Play Store, EVER. You'd have to publish a new app
   under a new package name and lose all installs):
   ```powershell
   keytool -genkey -v -keystore true-concept-release.jks `
     -keyalg RSA -keysize 2048 -validity 10000 `
     -alias trueconcept
   ```
   Save the `.jks` file AND the passwords in:
   - A password manager (1Password / Bitwarden), AND
   - A second offline backup (USB drive, encrypted)

### Phase B — Build the release AAB

After your ad code is tested with TEST IDs:

1. Swap test IDs → real IDs (via the env flag from Section 1 above).
2. Update `AndroidManifest.xml` with your real App ID.
3. Bump `versionCode` and `versionName` in `android/app/build.gradle`.
4. Build a signed Android App Bundle (Play Store requires AAB, not APK):
   ```powershell
   cd android
   .\gradlew bundleRelease
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   ```

### Phase C — Internal Testing track (the smart first upload)

Don't push straight to production. Internal Testing lets you verify everything
with real users before going public.

1. Play Console → Create app → Fill basic info (name, default language,
   category = Education).
2. Left sidebar → **Internal testing** → Create release → upload `app-release.aab`.
3. Add tester emails (yourself + 5–10 trusted students).
4. Get the "opt-in" link → testers install via Play Store.
5. Within ~1 hour, the app is downloadable BY TESTERS ONLY through Play Store.
6. AdMob discovers the listing → app status becomes "verified" within 24–48 h.
7. Testers install + use → real ads start showing → real impressions appear in
   AdMob dashboard.

### Phase D — Forms Play Store requires BEFORE production push

The Play Console blocks "Production" track until you complete:

1. **Content rating questionnaire** — IARC tool, ~5 min.
2. **Target audience** — pick the age groups your app targets. If you include
   under-13 users, you trigger COPPA + need extra ad config in AdMob.
3. **Data safety form** — declare:
   - AdMob SDK collects: *Device or other IDs*, *Approximate location*,
     *App activity*
   - Data IS shared with third parties (Google)
   - Purpose: *Advertising*
4. **Privacy policy URL** — the one from Phase A.
5. **App listing assets:**
   - 512×512 icon
   - 1024×500 feature graphic
   - ≥ 2 phone screenshots
   - Short description (80 chars) + full description (4000 chars)
6. **App access** — if the app requires login (yours does), provide a test
   student username + password so Google reviewers can sign in.
7. **Ads declaration** — tick the checkbox: "Yes, my app contains ads".
8. Skip the news / financial / VPN / etc. declarations — they don't apply.

### Phase E — Production release

1. Production track → New release → Upload the same AAB (or promote it from
   Internal Testing — one click).
2. Pick rollout %: **start at 5–10% staged rollout** so you can halt if a
   major bug surfaces.
3. **First-time review takes 1–7 days**. Subsequent updates are often within
   24h.
4. Once approved, the app appears in Play Store search → anyone can install.
5. AdMob impressions start counting from the first real install.
6. **Payout threshold: $100** (~₹8,500). Earnings accrue until then; first
   payout via UPI / bank around the 21st of the month following threshold.

---

## Critical "do NOT" list

| Don't                                            | Why                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Click your own ads (ever)                        | Permanent AdMob ban, no appeal                                                       |
| Ask friends or family to "click to test"         | Same — Google detects this from device IDs, IPs, behavioural patterns                |
| Ship REAL ad IDs in a debug/test build           | Causes invalid clicks during testing → ban risk                                      |
| Lose your release keystore                       | Cannot update the app on Play Store, EVER. Must republish as a new app, lose users.  |
| Skip the privacy policy                          | Play Store rejection + AdMob suspension                                              |
| Use sideload-only distribution long-term         | Stunted earnings, suspicious-traffic flags, capped formats                           |
| Target Android API < 34                          | Play Store rejects new submissions targeting < Android 14 as of 2026                 |
| Forget the Data Safety form                      | Play Console blocks the production push                                              |
| Change package name later                        | Counts as a brand-new app on Play Store + AdMob. Existing installs cannot upgrade.   |

---

## Realistic timeline — today → first real impression

| Step                                            | Time            |
| ----------------------------------------------- | --------------- |
| AdMob signup + payment + tax                    | 1–2 hours       |
| Privacy policy write + host                     | 1 hour          |
| Play Console signup + $25 payment               | 30 min          |
| Generate keystore + back it up                  | 5 min           |
| Build signed AAB                                | 10 min          |
| Internal testing upload + AdMob verify          | 1 day           |
| Internal QA with real testers                   | 1–2 weeks       |
| Data safety / content rating / store listing    | 1–2 hours       |
| First production review by Google               | 1–7 days        |
| **Total: ~2–3 weeks from now to live ads**      |                 |

---

## What you can do RIGHT NOW (parallel to ad coding)

While you're writing the AdMob React integration (Phase 1 of `MASTER_PLAN.md`),
none of these depend on the ad code being done:

- [ ] Create Google Play Console account ($25)
- [ ] Create AdMob account, add the Android app, request payment + tax setup
- [ ] Generate the release keystore + back it up to two separate places
- [ ] Draft the privacy policy + host it at `your-site/privacy`
- [ ] Finalise the package name FOREVER (`applicationId` in
      `android/app/build.gradle`) — you can never change it on Play Store
      without losing every install
- [ ] Prepare the 512×512 icon and 1024×500 feature graphic for the listing
- [ ] Take 2–3 polished phone screenshots of the app (light mode for clarity
      if your dark mode looks dim in thumbnails)

Each of these takes longer than coding the actual banner, so starting them in
parallel saves you a week at the end.
