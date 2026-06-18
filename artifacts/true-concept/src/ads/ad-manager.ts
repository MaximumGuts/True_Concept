/**
 * Platform-agnostic ad manager singleton.
 *
 * Picks the right provider at boot time based on Capacitor.isNativePlatform():
 *   • Android (Capacitor)       → admob-provider (real AdMob banners + rewarded)
 *   • Web / PC / browser preview → adsense-provider (currently a stub; real
 *                                   AdSense + countdown fallback ships in
 *                                   MASTER_PLAN.md Phase 3)
 *
 * Usage:
 *   import { adManager } from "@/ads/ad-manager";
 *   await adManager.initialize();                        // boot
 *   await adManager.showAdaptiveBanner();                // on a page
 *   const ok = await adManager.showRewardedAd("notes");  // inside UnlockGate
 */

import type { AdProvider } from "./types";
import type { UnlockFeature } from "./config";
import { adMobProvider } from "./providers/admob-provider";
import { adSenseProvider } from "./providers/adsense-provider";

/* eslint-disable @typescript-eslint/no-explicit-any */

function pickProvider(): AdProvider {
  const Cap = (window as any).Capacitor;
  const isNative = Cap?.isNativePlatform?.() === true;
  return isNative ? adMobProvider : adSenseProvider;
}

class AdManager implements AdProvider {
  private provider: AdProvider | null = null;
  private initPromise: Promise<void> | null = null;

  private getProvider(): AdProvider {
    if (!this.provider) this.provider = pickProvider();
    return this.provider;
  }

  initialize(): Promise<void> {
    // Memoised — running initialize() twice is a no-op
    if (!this.initPromise) {
      this.initPromise = this.getProvider().initialize();
    }
    return this.initPromise;
  }

  showAdaptiveBanner(): Promise<void> {
    return this.getProvider().showAdaptiveBanner();
  }

  hideBanner(): Promise<void> {
    return this.getProvider().hideBanner();
  }

  showInterstitial(): Promise<void> {
    return this.getProvider().showInterstitial();
  }

  showRewardedAd(feature: UnlockFeature): Promise<boolean> {
    return this.getProvider().showRewardedAd(feature);
  }
}

export const adManager = new AdManager();
