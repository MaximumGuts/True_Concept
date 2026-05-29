/**
 * 1-hour shared cooldown for the web interstitial.
 *
 * After a student completes one interstitial (countdown finishes), all four
 * gate features (notes / mcq / qna / lab) become free for the next hour. This
 * is friendlier than per-feature cooldowns and matches the user-stated intent
 * ("after doing this the student is allowed for 1 hr").
 *
 * Persisted in localStorage so the cooldown survives page reloads but resets
 * on logout (logout clears the prefs key, see AuthContext).
 */

const KEY = "tc_web_unlock_until";
const ONE_HOUR_MS = 60 * 60 * 1000;

export function isCooldownActive(): boolean {
  if (typeof localStorage === "undefined") return false;
  const raw = localStorage.getItem(KEY);
  if (!raw) return false;
  const until = Number(raw);
  if (!Number.isFinite(until)) return false;
  return until > Date.now();
}

/** Returns ms remaining until cooldown expires, or 0 if not active. */
export function cooldownRemainingMs(): number {
  if (typeof localStorage === "undefined") return 0;
  const raw = localStorage.getItem(KEY);
  if (!raw) return 0;
  const until = Number(raw);
  if (!Number.isFinite(until)) return 0;
  return Math.max(0, until - Date.now());
}

/** Starts a fresh 1-hour cooldown window from now. */
export function startCooldown(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, String(Date.now() + ONE_HOUR_MS));
}

/** Clears the cooldown (used by logout / dev tools). */
export function clearCooldown(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}
