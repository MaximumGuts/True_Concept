/**
 * Cross-platform ad provider contract.
 *
 * Two implementations exist:
 *   • admob-provider   — runs on Android via @capacitor-community/admob
 *   • adsense-provider — runs on the web (currently a no-op until AdSense H5 is
 *                         approved per MASTER_PLAN.md Phase 3)
 *
 * The ad-manager picks the right one based on Capacitor.isNativePlatform().
 *
 * Per MASTER_PLAN.md Rule #4: every method here MUST resolve (not throw) on
 * failure so the student is never blocked. Rewarded failures return `false`
 * which the UnlockGate treats as "show an error toast and keep the modal".
 */

import type { UnlockFeature } from "./config";

export interface AdProvider {
  /** One-time SDK initialization. Safe to call multiple times. */
  initialize(): Promise<void>;

  /** Show the adaptive banner anchored to the bottom of the screen. */
  showAdaptiveBanner(): Promise<void>;

  /** Hide the banner (e.g. while transitioning between screens). */
  hideBanner(): Promise<void>;

  /**
   * Show a full-screen interstitial ad and resolve once it is dismissed
   * (or immediately if it fails / isn't available). Per Rule #4 this never
   * throws and never blocks the student — the caller proceeds regardless.
   */
  showInterstitial(): Promise<void>;

  /**
   * Show a rewarded ad for a specific feature.
   * @returns `true` if the user watched it and earned the reward,
   *          `false` if they closed it early, the ad failed to load,
   *          or any other unhappy path.
   */
  showRewardedAd(feature: UnlockFeature): Promise<boolean>;
}
