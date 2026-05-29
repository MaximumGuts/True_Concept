/**
 * Thin wrapper around `adManager.showRewardedAd()` that:
 *   • Prevents double-click race conditions (concurrent show calls return the
 *     same promise instead of stacking multiple ad requests).
 *   • Implements MASTER_PLAN Rule #4 (failsafe): if the underlying provider
 *     throws or hangs, resolve as if the reward was earned so the gate opens
 *     and the student is never stranded. A console warning is logged for QA.
 *   • Adds a 30-second timeout watchdog — if the ad never resolves (Google
 *     SDK occasionally hangs on emulators / poor networks), we time out
 *     gracefully instead of leaving a permanent "loading" spinner.
 */

import { adManager } from "./ad-manager";
import type { UnlockFeature } from "./config";

const TIMEOUT_MS = 30 * 1000;

// Active in-flight calls per feature. Re-clicking while one is pending returns
// the same promise so we never start two parallel ad requests for one feature.
const inFlight = new Map<UnlockFeature, Promise<boolean>>();

/**
 * Show a rewarded ad for the given feature.
 *
 * @returns `true` when the student earned the reward OR the ad failed and we
 *          auto-passed per the failsafe. `false` only when the student
 *          actively closed/skipped the ad early.
 */
export function showRewardedFor(feature: UnlockFeature): Promise<boolean> {
  const existing = inFlight.get(feature);
  if (existing) return existing;

  const promise = (async () => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      // Race the real ad call against a 30s watchdog
      const watchdog = new Promise<"timeout">((resolve) => {
        timeoutId = setTimeout(() => resolve("timeout"), TIMEOUT_MS);
      });

      const result = await Promise.race([
        adManager.showRewardedAd(feature),
        watchdog,
      ]);

      if (result === "timeout") {
        console.warn(`[rewarded-manager] ${feature} ad timed out after 30s — failsafe granting reward`);
        return true; // failsafe per MASTER_PLAN rule #4
      }
      return result;
    } catch (err) {
      console.warn(`[rewarded-manager] ${feature} ad threw, failsafe granting reward:`, err);
      return true; // failsafe per MASTER_PLAN rule #4
    } finally {
      if (timeoutId !== null) clearTimeout(timeoutId);
      inFlight.delete(feature);
    }
  })();

  inFlight.set(feature, promise);
  return promise;
}
