/**
 * Tiny event bus for XP award notifications. Framework-free so it can be
 * called from service functions that don't have React context.
 */

type XPListener = (amount: number, label: string) => void;
const listeners = new Set<XPListener>();

export function onXPAwarded(fn: XPListener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** Call this right after a successful XP award to show the toast. */
export function emitXPAwarded(amount: number, label = ""): void {
  if (amount <= 0) return;
  listeners.forEach((fn) => fn(amount, label));
}

/** Human-friendly label for each XP event type. */
export function xpLabel(type: string): string {
  const map: Record<string, string> = {
    note_completed:          "Note read",
    mcq_attempt:             "MCQ attempt",
    mcq_score_50:            "Good score",
    mcq_score_75:            "Great score",
    mcq_perfect:             "Perfect score!",
    lab_completed:           "Lab completed",
    qa_viewed:               "Q&A viewed",
    video_watched:           "Video watched",
    daily_challenge_done:    "Challenge done",
    daily_challenge_perfect: "Perfect challenge!",
    mock_exam_completed:     "Mock exam done",
    mock_exam_score_75:      "Strong exam score",
    streak_daily:            "Daily streak",
    streak_7:                "7-day streak!",
    streak_30:               "30-day streak!",
  };
  return map[type] ?? "Activity";
}
