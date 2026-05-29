/**
 * Per-feature 1-hour unlock storage.
 *
 * Each unlock is GLOBAL within its feature — one `unlockFeature("notes")`
 * call grants the student access to every chapter's notes for 1 hour. See
 * MASTER_PLAN.md decision #7 ("Strict per-feature unlock") for rationale.
 *
 * State lives in localStorage. No backend writes (Decision #1: backend stays
 * untouched for the ads work).
 */

import type { UnlockFeature } from "./config";

const UNLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour

function storageKeyFor(feature: UnlockFeature): string {
  return `trueconcept_unlock_${feature}`;
}

/** Returns true if the feature is currently within its 1-hour unlock window. */
export function isFeatureUnlocked(feature: UnlockFeature): boolean {
  try {
    const raw = localStorage.getItem(storageKeyFor(feature));
    if (!raw) return false;
    const expiresAt = parseInt(raw, 10);
    if (!expiresAt) return false;
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

/** Grant the feature 1 hour of access. Idempotent — overwrites prior expiry. */
export function unlockFeature(feature: UnlockFeature): void {
  try {
    const expiresAt = Date.now() + UNLOCK_DURATION_MS;
    localStorage.setItem(storageKeyFor(feature), expiresAt.toString());
  } catch { /* localStorage blocked — student will hit the gate again next tap */ }
}

/** Minutes remaining on an active unlock. Returns 0 if locked or expired. */
export function getUnlockMinutesRemaining(feature: UnlockFeature): number {
  try {
    const raw = localStorage.getItem(storageKeyFor(feature));
    if (!raw) return 0;
    const expiresAt = parseInt(raw, 10);
    if (!expiresAt) return 0;
    const remaining = expiresAt - Date.now();
    return Math.max(0, Math.floor(remaining / 60_000));
  } catch {
    return 0;
  }
}

/** Wipe a feature's unlock. Used in dev / settings reset only. */
export function clearFeatureUnlock(feature: UnlockFeature): void {
  try {
    localStorage.removeItem(storageKeyFor(feature));
  } catch { /* noop */ }
}
