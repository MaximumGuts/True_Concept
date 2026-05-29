/**
 * Android AdMob provider — accesses @capacitor-community/admob at runtime.
 *
 * **Why the `window.Capacitor.Plugins.AdMob` accessor instead of a static import?**
 * The web build of this app does not depend on the plugin (it only lives in
 * `mobile/node_modules`). Going through the runtime accessor keeps the plugin
 * out of the web bundle and matches the existing pattern used for the `App`
 * plugin in main.tsx. The plugin is `undefined` in a browser context, and
 * every method here checks for that and no-ops gracefully — so the same code
 * works in `npm run dev` (web preview) and on a real Capacitor Android build.
 *
 * **Failsafe rule (MASTER_PLAN.md Rule #4):**
 * Every method must resolve (not throw) on failure. Rewarded failures return
 * `false` so the UnlockGate can show a toast and let the student retry without
 * being blocked.
 */

import type { AdProvider } from "../types";
import {
  ADS_ARE_TEST_MODE,
  APP_ID,
  BANNER_AD_UNIT_ID,
  REWARDED_AD_UNIT_IDS,
  TESTING_DEVICES,
  type UnlockFeature,
} from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Runtime accessor for the plugin. Returns null on web (no Capacitor).
function getAdMobPlugin(): any | null {
  const Cap = (window as any).Capacitor;
  if (!Cap?.isNativePlatform?.()) return null;
  return Cap.Plugins?.AdMob ?? null;
}

const REWARDED_EVENT_LOADED        = "rewardedVideoAdLoaded";
const REWARDED_EVENT_FAILED_LOAD   = "rewardedVideoAdFailedToLoad";
const REWARDED_EVENT_SHOWED        = "rewardedVideoAdShowed";
const REWARDED_EVENT_DISMISSED     = "rewardedVideoAdDismissed";
const REWARDED_EVENT_REWARD        = "rewardedVideoAdReward";

const BANNER_EVENT_LOADED          = "bannerAdLoaded";
const BANNER_EVENT_FAILED_LOAD     = "bannerAdFailedToLoad";

const BANNER_POSITION_BOTTOM       = "BOTTOM_CENTER";
const BANNER_SIZE_ADAPTIVE         = "ADAPTIVE_BANNER";
const BANNER_MARGIN_PX             = 0;

let initialized = false;
let bannerCreated = false;   // Has showBanner() ever succeeded? Persists across hides.
let bannerVisible = false;   // Is the banner currently on-screen?
let appStateListenerWired = false;

/** Subscribes to a plugin event. Returns a cleanup function that calls `.remove()` on the handle. */
async function subscribe(plugin: any, event: string, cb: (payload: any) => void): Promise<() => void> {
  const handle: any = await plugin.addListener(event, (payload: any) => cb(payload));
  return () => {
    try { handle?.remove?.(); } catch { /* noop */ }
  };
}

export const adMobProvider: AdProvider = {
  async initialize(): Promise<void> {
    const plugin = getAdMobPlugin();
    if (!plugin) {
      console.info("[admob] not on Android, skipping initialize");
      return;
    }
    if (initialized) return;
    try {
      await plugin.initialize({
        testingDevices: TESTING_DEVICES,
        initializeForTesting: ADS_ARE_TEST_MODE,
      });
      initialized = true;
      console.info(`[admob] initialized (App ID: ${APP_ID})`);

      // Wire diagnostic listeners — these stay on for the app's lifetime.
      void plugin.addListener(BANNER_EVENT_LOADED, () =>
        console.info("[admob] banner loaded ✓"));
      void plugin.addListener(BANNER_EVENT_FAILED_LOAD, (e: any) =>
        console.warn("[admob] banner failed:", e?.code, e?.message));

      // ── App lifecycle handler ────────────────────────────────────────
      // When Android suspends the app, the OS may destroy the native banner
      // view to free memory. JavaScript state survives the suspend, so our
      // `bannerVisible` / `bannerCreated` flags become stale-true — meaning
      // the next call to showAdaptiveBanner() would be skipped by the guard,
      // leaving the user with no banner.
      // On resume, reset the lifecycle flags so the next show actually fires.
      if (!appStateListenerWired) {
        const Cap = (window as any).Capacitor;
        const AppPlugin = Cap?.Plugins?.App;
        if (AppPlugin?.addListener) {
          try {
            await AppPlugin.addListener("appStateChange", ({ isActive }: { isActive: boolean }) => {
              if (isActive) {
                console.info("[admob] app resumed — resetting banner lifecycle flags");
                bannerCreated = false;
                bannerVisible = false;
              }
            });
            appStateListenerWired = true;
          } catch (err) {
            console.warn("[admob] could not wire appStateChange listener:", err);
          }
        }
      }
    } catch (err) {
      console.error("[admob] initialize failed (continuing without ads):", err);
    }
  },

  async showAdaptiveBanner(): Promise<void> {
    const plugin = getAdMobPlugin();
    if (!plugin) return;
    if (!initialized) await this.initialize();
    if (bannerVisible) return;

    // ── AdMob plugin lifecycle quirk ────────────────────────────────────
    // The plugin separates "create" (`showBanner`) from "re-show after hide"
    // (`resumeBanner`). Calling showBanner on an already-created-then-hidden
    // banner silently no-ops or stacks views. Calling resumeBanner before any
    // banner is created throws. So we track `bannerCreated` and dispatch.
    try {
      if (bannerCreated && typeof plugin.resumeBanner === "function") {
        try {
          await plugin.resumeBanner();
          bannerVisible = true;
          console.info("[admob] banner resumed ✓");
          return;
        } catch (resumeErr) {
          // Banner was probably destroyed by the OS (low memory, app suspend).
          // Fall through to recreate.
          console.info("[admob] resumeBanner failed, recreating:", resumeErr);
          bannerCreated = false;
        }
      }

      await plugin.showBanner({
        adId: BANNER_AD_UNIT_ID,
        adSize: BANNER_SIZE_ADAPTIVE,
        position: BANNER_POSITION_BOTTOM,
        margin: BANNER_MARGIN_PX,
        isTesting: ADS_ARE_TEST_MODE,
      });
      bannerCreated = true;
      bannerVisible = true;
    } catch (err) {
      console.warn("[admob] showBanner failed:", err);
    }
  },

  async hideBanner(): Promise<void> {
    const plugin = getAdMobPlugin();
    if (!plugin) return;

    // ── Why we DON'T early-return on `!bannerVisible` ──────────────────
    // A rewarded/interstitial ad fires `appStateChange("active")` on dismissal
    // (the WebView regains foreground after the fullscreen overlay closes).
    // That listener (below in initialize()) resets `bannerVisible = false`
    // even though the AdMob SDK has *automatically resumed* the banner display
    // behind the fullscreen ad. If we trust the stale JS flag and skip the
    // native call, the banner stays on screen forever when the student
    // navigates to /dashboard. Always attempt removeBanner — it's cheap and
    // safe to call on a non-existent view (the catch handles that).
    //
    // ── Why removeBanner() instead of hideBanner() ──────────────────────
    // The plugin's hideBanner() silently no-ops on a banner that's been
    // through a pause/resume cycle (same root cause as above). removeBanner()
    // DESTROYS the banner view, which works reliably in every scenario. The
    // trade-off is a small re-fetch cost on the next showAdaptiveBanner()
    // because we can't resumeBanner() on a destroyed view — always full
    // create. Negligible at admin-page-navigation volume.
    try {
      const removeFn = typeof plugin.removeBanner === "function"
        ? plugin.removeBanner.bind(plugin)
        : plugin.hideBanner.bind(plugin);
      await removeFn();
      bannerVisible = false;
      bannerCreated = false;   // forces showBanner() (not resumeBanner) on next show
    } catch (err) {
      console.warn("[admob] hide/remove banner failed:", err);
      // Even if the native call threw, sync our flags so the next showBanner
      // attempt isn't blocked by a stale bannerVisible=true guard.
      bannerVisible = false;
      bannerCreated = false;
    }
  },

  async showRewardedAd(feature: UnlockFeature): Promise<boolean> {
    const plugin = getAdMobPlugin();
    if (!plugin) {
      // Web preview path — pretend the user earned the reward so the gate
      // opens during browser-based UI development. Production web users
      // will go through the AdSense provider, not this one.
      console.info(`[admob] not on Android, granting ${feature} unlock as dev-stub`);
      return true;
    }
    if (!initialized) await this.initialize();

    const adId = REWARDED_AD_UNIT_IDS[feature];
    let rewardEarned = false;
    const cleanupFns: Array<() => void> = [];

    try {
      // Subscribe to lifecycle events first
      const handles = await Promise.all([
        subscribe(plugin, REWARDED_EVENT_REWARD, () => {
          rewardEarned = true;
          console.info(`[admob] rewarded ${feature} earned ✓`);
        }),
        subscribe(plugin, REWARDED_EVENT_LOADED, () =>
          console.info(`[admob] rewarded ${feature} loaded ✓`)),
        subscribe(plugin, REWARDED_EVENT_FAILED_LOAD, (e: any) =>
          console.warn(`[admob] rewarded ${feature} failed:`, e?.code, e?.message)),
        subscribe(plugin, REWARDED_EVENT_SHOWED, () =>
          console.info(`[admob] rewarded ${feature} showed`)),
      ]);
      cleanupFns.push(...handles);

      // Preload then show. The plugin's prepare/show pattern.
      await plugin.prepareRewardVideoAd({
        adId,
        isTesting: ADS_ARE_TEST_MODE,
      });

      // Wait for either dismissal or a hard failure
      await new Promise<void>((resolve) => {
        void subscribe(plugin, REWARDED_EVENT_DISMISSED, () => resolve())
          .then(cleanup => cleanupFns.push(cleanup));
        plugin.showRewardVideoAd().catch((err: unknown) => {
          console.warn(`[admob] rewarded ${feature} show failed:`, err);
          resolve();
        });
      });

      return rewardEarned;
    } catch (err) {
      console.warn(`[admob] rewarded ${feature} unexpected error:`, err);
      return false;
    } finally {
      // Best-effort cleanup
      for (const fn of cleanupFns) {
        try { fn(); } catch { /* noop */ }
      }
    }
  },
};
