/**
 * 24-hour onboarding grace period for new students.
 *
 * Per MASTER_PLAN.md Section 8 (locked code). For the first 24 hours after a
 * student registers, every UnlockGate auto-passes without an ad. Lets first-
 * time users explore the app without immediate friction.
 *
 * State lives entirely in localStorage. Edge cases (accepted per master plan):
 *   • Cleared app data → fresh 24h (acceptable trade — no backend cost)
 *   • Logout + login → grace remains (key not cleared on logout)
 *   • Reinstall APK → fresh 24h (acts as device-bound onboarding)
 *   • Each device gets its own 24h — fine
 */

const GRACE_KEY = "trueconcept_signup_at";
const GRACE_DURATION_MS = 24 * 60 * 60 * 1000;

// ── TEMPORARY: grace disabled for testing rewarded ad gates ───────────────
// Flip back to `true` once the rewarded-ad flow has been QA'd end-to-end.
// While `false`, every UnlockGate evaluates as "locked" for new users so
// every gate is reachable without waiting 24 h after registration.
//
// recordSignup() still runs (writes the timestamp) so re-enabling later
// works for users who registered while grace was off.
const GRACE_ENABLED = false;

/** Called once on successful REGISTRATION (not login). Idempotent. */
export function recordSignup(): void {
  try {
    if (!localStorage.getItem(GRACE_KEY)) {
      localStorage.setItem(GRACE_KEY, Date.now().toString());
    }
  } catch { /* localStorage blocked — grace simply won't apply */ }
}

/** Returns true for the first 24h after the recordSignup() call. */
export function isInGracePeriod(): boolean {
  if (!GRACE_ENABLED) return false;
  try {
    const raw = localStorage.getItem(GRACE_KEY);
    if (!raw) return false;
    const signupAt = parseInt(raw, 10);
    if (!signupAt) return false;
    return Date.now() - signupAt < GRACE_DURATION_MS;
  } catch {
    return false;
  }
}

/** Minutes remaining in the grace window (for optional banner display). */
export function getGraceMinutesRemaining(): number {
  if (!GRACE_ENABLED) return 0;
  try {
    const raw = localStorage.getItem(GRACE_KEY);
    if (!raw) return 0;
    const signupAt = parseInt(raw, 10);
    if (!signupAt) return 0;
    const remaining = GRACE_DURATION_MS - (Date.now() - signupAt);
    return Math.max(0, Math.floor(remaining / 60_000));
  } catch {
    return 0;
  }
}
