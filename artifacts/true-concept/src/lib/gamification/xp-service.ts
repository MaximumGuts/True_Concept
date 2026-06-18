/**
 * XP Service — awards XP, checks anti-duplication, updates level, unlocks badges.
 *
 * Every call is idempotent: pass a unique `eventId` and the function silently
 * no-ops if it was already awarded (anti-cheat / anti-farming).
 *
 * Firestore structure:
 *   studentXP/{uid}                  — totals doc (totalXP, weeklyXP, level, badges)
 *   studentXP/{uid}/events/{eventId} — one doc per unique XP event (anti-cheat)
 *   weeklyLeaderboard/{weekKey}/entries/{uid} — maintained by Cloud Function trigger
 */

import {
  doc, getDoc, setDoc, updateDoc,
  collection, serverTimestamp, increment,
  writeBatch, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  XP_VALUES, getLevelForXP, BADGES, getCurrentWeekKey,
  type BadgeCheckStats,
} from "./xp-config";
import { emitXPAwarded, xpLabel } from "./xp-toast-event";
import { emitXPCelebration } from "./xp-celebration-event";

// XP event types that, on their own, warrant a full confetti celebration
// (not just the small toast). Level-ups and new badges are detected separately.
const CELEBRATORY_TYPES: Record<string, { emoji: string; title: string; subtitle: string }> = {
  mcq_perfect:             { emoji: "🌟", title: "Perfect Score!",     subtitle: "You nailed every question" },
  daily_challenge_perfect: { emoji: "🌟", title: "Perfect Challenge!", subtitle: "100% on today's challenge" },
  daily_challenge_done:    { emoji: "🎯", title: "Challenge Complete!", subtitle: "Daily challenge done — nice work" },
  mock_exam_score_75:      { emoji: "🏆", title: "Strong Exam Score!", subtitle: "75%+ on your mock exam" },
  streak_7:                { emoji: "🔥", title: "7-Day Streak!",      subtitle: "A whole week of studying" },
  streak_30:               { emoji: "🔥", title: "30-Day Streak!",     subtitle: "A full month — incredible!" },
};

// ── Firestore helpers ─────────────────────────────────────────────────────────

export const studentXPDoc  = (uid: string) => doc(db, "studentXP", uid);
export const xpEventsCol   = (uid: string) => collection(db, "studentXP", uid, "events");
export const xpEventDoc    = (uid: string, eventId: string) => doc(db, "studentXP", uid, "events", eventId);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StudentXPDoc {
  totalXP:       number;
  weeklyXP:      number;
  currentWeekKey: string;
  level:         number;
  earnedBadgeIds: string[];
  // stats for badge checking
  totalNotesRead:    number;
  totalLabsDone:     number;
  totalMcqAttempts:  number;
  mcqAccuracySum:    number;   // sum of all MCQ accuracy values (for avg calc)
  challengesDone:    number;
  mockExamsDone:     number;
  perfectChallenges: number;
  updatedAt:     Timestamp | null;
}

const DEFAULT_XP_DOC: Omit<StudentXPDoc, "updatedAt"> = {
  totalXP: 0, weeklyXP: 0, currentWeekKey: "", level: 1,
  earnedBadgeIds: [],
  totalNotesRead: 0, totalLabsDone: 0, totalMcqAttempts: 0,
  mcqAccuracySum: 0, challengesDone: 0, mockExamsDone: 0, perfectChallenges: 0,
};

// ── Core award function ───────────────────────────────────────────────────────

export interface AwardXPOptions {
  uid:     string;
  xp:      number;
  /** Unique event identifier — re-awarding the same ID is a no-op. */
  eventId: string;
  type:    string;
  /** Optional stat increments applied alongside the XP. */
  statDelta?: Partial<Pick<StudentXPDoc,
    "totalNotesRead" | "totalLabsDone" | "totalMcqAttempts" |
    "mcqAccuracySum" | "challengesDone" | "mockExamsDone" | "perfectChallenges">>;
}

/**
 * Award XP to a student. Idempotent — safe to call on every activity.
 * Returns the new totalXP, or null if the event was already awarded.
 */
export async function awardXP(opts: AwardXPOptions): Promise<number | null> {
  const { uid, xp, eventId, type, statDelta = {} } = opts;
  if (xp <= 0 || !uid || !eventId) return null;

  try {
    const evRef = xpEventDoc(uid, eventId);
    const evSnap = await getDoc(evRef);
    if (evSnap.exists()) return null; // already awarded — silently skip

    const xpRef      = studentXPDoc(uid);
    const xpSnap     = await getDoc(xpRef);
    const current    = xpSnap.exists() ? (xpSnap.data() as StudentXPDoc) : { ...DEFAULT_XP_DOC, updatedAt: null };

    // Weekly XP reset if week changed
    const weekKey    = getCurrentWeekKey();
    const weeklyXP   = current.currentWeekKey === weekKey ? current.weeklyXP : 0;

    const newTotal   = (current.totalXP ?? 0) + xp;
    const newWeekly  = weeklyXP + xp;
    const newLevel   = getLevelForXP(newTotal).level;

    // Build stats for badge check
    const updatedStats: BadgeCheckStats = {
      totalXP:           newTotal,
      totalNotesRead:    (current.totalNotesRead ?? 0)    + (statDelta.totalNotesRead ?? 0),
      totalLabsDone:     (current.totalLabsDone ?? 0)     + (statDelta.totalLabsDone ?? 0),
      totalMcqAttempts:  (current.totalMcqAttempts ?? 0)  + (statDelta.totalMcqAttempts ?? 0),
      mcqAccuracyPct:    computeAccuracy(current, statDelta),
      currentStreak:     0,   // read separately in badge checks triggered from hooks
      longestStreak:     0,
      weeklyRank:        null,
      challengesDone:    (current.challengesDone ?? 0)    + (statDelta.challengesDone ?? 0),
      mockExamsDone:     (current.mockExamsDone ?? 0)     + (statDelta.mockExamsDone ?? 0),
      perfectChallenges: (current.perfectChallenges ?? 0) + (statDelta.perfectChallenges ?? 0),
    };

    const existingBadgeIds = current.earnedBadgeIds ?? [];
    const newBadges = checkNewBadges(existingBadgeIds, updatedStats);
    const newlyEarnedBadgeId = newBadges.find((id) => !existingBadgeIds.includes(id));

    // Batch write: XP doc update + event doc
    const batch = writeBatch(db);

    if (!xpSnap.exists()) {
      batch.set(xpRef, {
        ...DEFAULT_XP_DOC,
        ...statDelta,
        totalXP: xp, weeklyXP: xp, currentWeekKey: weekKey,
        level: newLevel, earnedBadgeIds: newBadges,
        updatedAt: serverTimestamp(),
      });
    } else {
      const updates: Record<string, unknown> = {
        totalXP:        increment(xp),
        weeklyXP:       current.currentWeekKey === weekKey ? increment(xp) : xp,
        currentWeekKey: weekKey,
        level:          newLevel,
        updatedAt:      serverTimestamp(),
      };
      if (newBadges.length > current.earnedBadgeIds.length) {
        updates["earnedBadgeIds"] = newBadges;
      }
      Object.entries(statDelta).forEach(([k, v]) => {
        if (v) updates[k] = increment(v);
      });
      batch.update(xpRef, updates);
    }

    // Record the event (anti-cheat)
    batch.set(evRef, { xp, type, awardedAt: serverTimestamp() });

    await batch.commit();
    // Notify the UI toast (fire-and-forget, non-blocking)
    emitXPAwarded(xp, xpLabel(type));

    // Big-win celebration (confetti) — new badge > celebratory type.
    // (Level-ups are already celebrated by the dedicated LevelUpModal via
    // useGamification, so we don't double up here.) Routine awards = toast only.
    if (newlyEarnedBadgeId) {
      const badge = BADGES.find((b) => b.id === newlyEarnedBadgeId);
      if (badge) {
        emitXPCelebration({
          emoji: badge.emoji,
          title: `Badge unlocked: ${badge.name}!`,
          subtitle: badge.description,
        });
      }
    } else if (CELEBRATORY_TYPES[type]) {
      emitXPCelebration(CELEBRATORY_TYPES[type]);
    }

    return newTotal;
  } catch (err) {
    // Never break existing study flow on XP failure
    console.warn("[xp-service] awardXP failed:", err);
    return null;
  }
}

// ── Badge checking ────────────────────────────────────────────────────────────

function checkNewBadges(existing: string[], stats: BadgeCheckStats): string[] {
  const earned = new Set(existing);
  for (const badge of BADGES) {
    if (!earned.has(badge.id) && badge.check(stats)) {
      earned.add(badge.id);
    }
  }
  return [...earned];
}

function computeAccuracy(
  current: Partial<StudentXPDoc>,
  delta: Partial<StudentXPDoc>,
): number {
  const totalAttempts = (current.totalMcqAttempts ?? 0) + (delta.totalMcqAttempts ?? 0);
  const accuracySum   = (current.mcqAccuracySum ?? 0) + (delta.mcqAccuracySum ?? 0);
  return totalAttempts > 0 ? Math.round(accuracySum / totalAttempts) : 0;
}

// ── Streak XP (call once per day on app open) ─────────────────────────────────

export async function tryAwardDailyStreakXP(uid: string, currentStreak: number): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  await awardXP({
    uid, xp: XP_VALUES.STREAK_DAILY,
    eventId: `streak-daily-${today}`,
    type: "streak_daily",
  });
  // Bonus milestones
  if (currentStreak >= 30) {
    await awardXP({ uid, xp: XP_VALUES.STREAK_30_DAY_BONUS, eventId: `streak-30-${today}`, type: "streak_30" });
  } else if (currentStreak >= 7 && currentStreak % 7 === 0) {
    await awardXP({ uid, xp: XP_VALUES.STREAK_7_DAY_BONUS, eventId: `streak-7-${today}-${currentStreak}`, type: "streak_7" });
  }
}

// ── Read helper ───────────────────────────────────────────────────────────────

export async function getStudentXP(uid: string): Promise<StudentXPDoc | null> {
  try {
    const snap = await getDoc(studentXPDoc(uid));
    if (!snap.exists()) return null;
    return snap.data() as StudentXPDoc;
  } catch {
    return null;
  }
}
