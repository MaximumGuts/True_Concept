/**
 * Mock exam 24-hour unlock.
 * One rewarded ad unlocks BOTH strict and practice mode for the rest of the day.
 * Resets at midnight (calendar-day boundary) rather than a rolling 24h window
 * so students can't unlock at 11:55 PM and carry it through the next day.
 */

const KEY = "tc_mock_exam_unlock_date";

/** Returns today's date as "YYYY-MM-DD". */
function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** True if mock exam was already unlocked today. */
export function isMockExamUnlocked(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(KEY) === todayKey();
}

/** Unlock mock exam for today (called after rewarded ad is earned). */
export function unlockMockExamForToday(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, todayKey());
}

/** Clear the unlock (dev / testing utility). */
export function clearMockExamUnlock(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}
