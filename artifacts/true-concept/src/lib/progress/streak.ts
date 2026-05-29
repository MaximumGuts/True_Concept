/**
 * Returns today's date as YYYY-MM-DD in the user's local timezone.
 * Used as the canonical "activity day" key for streak calculations.
 */
export function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns yesterday's date as YYYY-MM-DD in the user's local timezone.
 */
export function yesterdayLocalDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Computes the new streak values when an activity is recorded today.
 *
 * Rules:
 *   - Activity today + last was yesterday → streak += 1
 *   - Activity today + last was today → streak unchanged (already counted)
 *   - Activity today + last was older → streak resets to 1
 *   - Never had activity → streak becomes 1
 */
export function computeStreakUpdate(
  lastActivityDate: string,
  currentStreak: number,
  longestStreak: number
): StreakUpdate {
  const today = todayLocalDate();
  const yesterday = yesterdayLocalDate();

  let newCurrent: number;

  if (lastActivityDate === today) {
    // Already had activity today — streak unchanged
    newCurrent = currentStreak || 1;
  } else if (lastActivityDate === yesterday) {
    // Continued the streak
    newCurrent = (currentStreak || 0) + 1;
  } else {
    // Streak broken (or first activity ever) — start fresh
    newCurrent = 1;
  }

  return {
    currentStreak: newCurrent,
    longestStreak: Math.max(longestStreak ?? 0, newCurrent),
  };
}
