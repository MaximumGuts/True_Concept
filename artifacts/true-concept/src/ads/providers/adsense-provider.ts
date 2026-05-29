/**
 * Web AdSense provider.
 *
 * Shows a sticky bottom-of-viewport responsive display banner on exactly the
 * pages where the Capacitor AdMob banner is shown on Android (Layout.tsx
 * controls visibility — same `hideBottomNav` regex, same `showAdaptiveBanner`/
 * `hideBanner` calls). The picker in ad-manager.ts routes here only when
 * Capacitor.isNativePlatform() is false, so this code never runs in the APK.
 *
 * **Failsafe behaviour (no publisher ID yet):**
 * While `ADSENSE_PUBLISHER_ID` and `ADSENSE_BANNER_SLOT_ID` in config.ts are
 * empty strings, every method is a silent no-op. No script load, no DOM
 * injection, no layout shift. Once Google approves the site and the IDs are
 * filled in, banners start appearing without any other code change.
 *
 * **Rewarded ads:** AdSense for Content does NOT support a rewarded ad format
 * (unlike AdMob on mobile). `showRewardedAd()` therefore resolves `true` so
 * the UnlockGate stays unblocked on web. A real web-side "unlock" pattern
 * (timed interstitial with study tips) is planned separately — see the chat
 * thread about the "tip of the day" popup.
 */

import type { AdProvider } from "../types";
import type { UnlockFeature } from "../config";
import { ADSENSE_PUBLISHER_ID, ADSENSE_BANNER_SLOT_ID } from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */

const SCRIPT_URL          = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const BANNER_CONTAINER_ID = "tc-adsense-banner-container";
const BODY_CLASS          = "has-adsense-banner";

let scriptLoaded   = false;
let scriptLoading: Promise<void> | null = null;

function isConfigured(): boolean {
  return !!ADSENSE_PUBLISHER_ID && !!ADSENSE_BANNER_SLOT_ID;
}

/**
 * AdSense behaves differently on unverified domains (like localhost): it
 * reserves a large placeholder slot for the ad iframe instead of returning
 * an empty `<ins>`, which renders as a big dark/cream blob over the page
 * content. We skip the provider entirely in local dev so light-mode review
 * isn't obstructed. Production hosts (true-concept-353c9.web.app + any
 * custom domain) are unaffected.
 */
function isLocalDevHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h.endsWith(".local");
}

/**
 * Idempotent dynamic <script> load. Multiple callers (initialize() and
 * showAdaptiveBanner()) await this; only one network request happens.
 */
function loadAdSenseScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  if (!ADSENSE_PUBLISHER_ID) return Promise.resolve();

  // index.html already includes the script tag in <head> (needed for AdSense
  // site-verification crawler). If it's there and adsbygoogle is already
  // available on window, we're done — don't inject a second copy or AdSense
  // will warn about a duplicate.
  if (typeof document !== "undefined") {
    const existing = document.querySelector(`script[src*="adsbygoogle.js"]`);
    if (existing) {
      scriptLoaded = true;
      return Promise.resolve();
    }
  }

  scriptLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `${SCRIPT_URL}?client=${ADSENSE_PUBLISHER_ID}`;
    script.onload  = () => { scriptLoaded = true; resolve(); };
    script.onerror = (e) => {
      // Fail silent — ad-blocked browsers and offline users still need the
      // app to work. Reset the loading promise so a future call can retry
      // once the network/blocker situation improves.
      console.warn("[adsense] script failed to load:", e);
      scriptLoading = null;
      reject(new Error("AdSense script load failed"));
    };
    document.head.appendChild(script);
  });
  return scriptLoading;
}

export const adSenseProvider: AdProvider = {
  async initialize(): Promise<void> {
    if (isLocalDevHost()) {
      console.info("[adsense] localhost detected — skipping AdSense init in local dev");
      return;
    }
    if (!isConfigured()) {
      console.info("[adsense] no publisher / slot ID — stub mode");
      return;
    }
    try {
      await loadAdSenseScript();
      console.info("[adsense] script loaded");
    } catch (err) {
      console.warn("[adsense] init failed (ignored):", err);
    }
  },

  async showAdaptiveBanner(): Promise<void> {
    if (isLocalDevHost()) return;
    if (!isConfigured()) return;
    if (typeof document === "undefined") return;
    // Idempotent — Layout.tsx may call this on every route change. If the
    // banner is already mounted, do nothing (don't push() again either, or
    // AdSense will warn about an already-filled slot).
    if (document.getElementById(BANNER_CONTAINER_ID)) return;

    try {
      await loadAdSenseScript();
    } catch {
      return; // ad-blocked / offline → silent skip
    }

    // ── Fixed-bottom container ──────────────────────────────────────────
    // Sits under the floating mobile pill (z=40 vs pill z=40 but pill is
    // bottom:env-inset+12px, banner is bottom:0 — they don't overlap because
    // banner sits ON pages where hideBottomNav=true so the pill isn't rendered
    // anyway). On desktop we add body padding via the .has-adsense-banner
    // class (see index.css) so content isn't covered.
    const container = document.createElement("div");
    container.id = BANNER_CONTAINER_ID;
    // Background + border come from CSS vars so the strip stays theme-aware
    // (light cream on light theme, dark cosmic on dark theme).
    container.style.cssText = [
      "position:fixed",
      "left:0",
      "right:0",
      "bottom:0",
      "z-index:40",
      "background:var(--adsense-banner-bg)",
      "backdrop-filter:blur(8px)",
      "-webkit-backdrop-filter:blur(8px)",
      "border-top:1px solid var(--adsense-banner-border)",
      "padding:4px 0",
      "padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 4px)",
      "min-height:60px",
      "max-height:110px",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "pointer-events:auto",
    ].join(";");

    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.cssText = "display:block; width:100%; max-width:728px;";
    ins.setAttribute("data-ad-client",            ADSENSE_PUBLISHER_ID);
    ins.setAttribute("data-ad-slot",              ADSENSE_BANNER_SLOT_ID);
    ins.setAttribute("data-ad-format",            "auto");
    ins.setAttribute("data-full-width-responsive", "true");

    container.appendChild(ins);
    document.body.appendChild(container);
    document.body.classList.add(BODY_CLASS);

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.warn("[adsense] push failed:", err);
    }
  },

  async hideBanner(): Promise<void> {
    if (typeof document === "undefined") return;
    const el = document.getElementById(BANNER_CONTAINER_ID);
    if (el) el.remove();
    document.body.classList.remove(BODY_CLASS);
  },

  async showRewardedAd(feature: UnlockFeature): Promise<boolean> {
    // No rewarded format in AdSense for Content. Auto-grant the unlock so
    // the gate doesn't block web users. A web-specific timed interstitial
    // (the "tip of the day" popup) will replace this later.
    console.info(`[adsense] no rewarded format — auto-granting ${feature} unlock`);
    return true;
  },
};
