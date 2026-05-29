/**
 * High-level "watch ad → unlock feature" actions, one per protected feature.
 *
 * The UnlockGate component calls one of these on Watch Ad click. Each is a
 * thin glue function: show rewarded ad → if reward earned, persist the
 * 1-hour unlock → return success/failure boolean so the modal can decide
 * whether to dismiss (success) or show an error toast (failure — e.g. the
 * student closed the ad early).
 *
 * Failure to LOAD an ad never reaches here — `rewarded-manager.ts` applies
 * the failsafe and returns `true` even when the SDK throws. The only path
 * that returns `false` is the student actively skipping a loaded ad.
 */

import { showRewardedFor } from "./rewarded-manager";
import { unlockFeature } from "./unlock-manager";

async function watchAdAndUnlock(feature: Parameters<typeof unlockFeature>[0]): Promise<boolean> {
  const earned = await showRewardedFor(feature);
  if (earned) {
    unlockFeature(feature);
    return true;
  }
  return false;
}

export const unlockNotes = () => watchAdAndUnlock("notes");
export const unlockLab   = () => watchAdAndUnlock("lab");
export const unlockMCQ   = () => watchAdAndUnlock("mcq");
export const unlockQnA   = () => watchAdAndUnlock("qna");
