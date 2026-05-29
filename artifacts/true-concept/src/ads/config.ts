/**
 * AdMob configuration — ad-unit IDs and feature mapping.
 *
 * **TEST vs REAL ad units**
 * Controlled by `VITE_USE_REAL_ADS` env var (set by mobile/build.mjs for
 * --release builds only). When unset or anything other than the string "true",
 * we use Google's official test ad units which:
 *   • Always serve a working test ad
 *   • Are never billed
 *   • Pose zero risk of an AdMob account ban from accidental self-clicks
 *
 * When set to "true" (only happens on `node build.mjs --release`), we use
 * the real production ad units. Real units on a brand-new AdMob account
 * typically have very low fill rates until the app is on Play Store and
 * AdMob's ML has matched ads to traffic.
 *
 * `import.meta.env.DEV` alone is INSUFFICIENT because mobile/build.mjs always
 * runs `vite build` (production mode) regardless of debug/release intent.
 *
 * Reference: androidAddMob/AdMob-Verification-Guide.md
 */

/** The four protected features that each get their own rewarded ad slot. */
export type UnlockFeature = "notes" | "lab" | "mcq" | "qna";

const USE_REAL_ADS = (import.meta.env.VITE_USE_REAL_ADS as string | undefined) === "true";
const USE_TEST_ADS = !USE_REAL_ADS;

/* ── Google's official test IDs ───────────────────────────────────────── */
const TEST_APP_ID                = "ca-app-pub-3940256099942544~3347511713";
const TEST_BANNER_ID             = "ca-app-pub-3940256099942544/6300978111";
const TEST_REWARDED_ID           = "ca-app-pub-3940256099942544/5224354917";

/* ── TRUE CONCEPT production IDs (Android) ────────────────────────────── */
const PROD_APP_ID                = "ca-app-pub-7343144848032125~7156806995";
const PROD_BANNER_ID             = "ca-app-pub-7343144848032125/1280143875";
const PROD_REWARDED_NOTES_ID     = "ca-app-pub-7343144848032125/7478343417";
const PROD_REWARDED_LAB_ID       = "ca-app-pub-7343144848032125/7619841424";
const PROD_REWARDED_MCQ_ID       = "ca-app-pub-7343144848032125/7833566638";
const PROD_REWARDED_QNA_ID       = "ca-app-pub-7343144848032125/3268012966";

/**
 * App ID — used only for log/diagnostic purposes from JS.
 * The actual SDK initialization reads the App ID from AndroidManifest.xml.
 * Keep the two values in sync — see `mobile/android/app/src/main/AndroidManifest.xml`.
 */
export const APP_ID = USE_TEST_ADS ? TEST_APP_ID : PROD_APP_ID;

/** Banner ad-unit (one slot — bottom adaptive banner). */
export const BANNER_AD_UNIT_ID = USE_TEST_ADS ? TEST_BANNER_ID : PROD_BANNER_ID;

/** Per-feature rewarded ad-unit map. */
export const REWARDED_AD_UNIT_IDS: Record<UnlockFeature, string> = USE_TEST_ADS
  ? {
      notes: TEST_REWARDED_ID,
      lab:   TEST_REWARDED_ID,
      mcq:   TEST_REWARDED_ID,
      qna:   TEST_REWARDED_ID,
    }
  : {
      notes: PROD_REWARDED_NOTES_ID,
      lab:   PROD_REWARDED_LAB_ID,
      mcq:   PROD_REWARDED_MCQ_ID,
      qna:   PROD_REWARDED_QNA_ID,
    };

/** True when this build is using TEST ad units (debug / non-release). Used by
 *  the admob-provider to set the SDK's isTesting flag consistently. */
export const ADS_ARE_TEST_MODE = USE_TEST_ADS;

/** Human-readable labels for the UnlockGate modal. */
export const FEATURE_LABELS: Record<UnlockFeature, { en: string; as: string }> = {
  notes: { en: "Notes",  as: "টোকা" },
  lab:   { en: "Lab",    as: "পৰীক্ষাগাৰ" },
  mcq:   { en: "MCQ",    as: "MCQ" },
  qna:   { en: "Q&A",    as: "প্ৰশ্নোত্তৰ" },
};

/**
 * Hashed device IDs that should receive TEST creatives even when real ad
 * units are configured. Add YOUR device's hash here before testing real IDs
 * — clicking real ads with an unregistered device is a permanent AdMob ban.
 *
 * Get your hash from `adb logcat` once after first running with real IDs:
 *   "Use AdRequest.Builder.addTestDevice("ABCDEF...") to get test ads on this device."
 */
export const TESTING_DEVICES: string[] = [
  // "ABCDEF0123456789...",   // add your device hash here
];

/* ── AdSense (web build) ──────────────────────────────────────────────
 * Used by adsense-provider.ts to load the AdSense script and inject the
 * bottom banner. Both values are EMPTY until Google approves the site —
 * with empty values the provider gracefully no-ops (no script load, no
 * ad element, no layout shift). The site stays fully functional.
 *
 * After approval:
 *   1. Paste your publisher ID into ADSENSE_PUBLISHER_ID below.
 *   2. Create a "responsive display ad" unit in AdSense → paste its slot
 *      ID into ADSENSE_BANNER_SLOT_ID.
 *   3. Also update artifacts/true-concept/public/ads.txt with the same
 *      publisher ID.
 *   4. Optionally uncomment the script tag in index.html (only needed
 *      for AdSense's site-verification crawl; the provider also loads
 *      the script dynamically at runtime).
 */
export const ADSENSE_PUBLISHER_ID         = "ca-pub-7343144848032125";
export const ADSENSE_BANNER_SLOT_ID       = "5290012395"; // bottom responsive banner
export const ADSENSE_INTERSTITIAL_SLOT_ID = "5374227126"; // vertical slot in the WebInterstitial popup
