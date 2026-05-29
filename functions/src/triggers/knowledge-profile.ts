import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { db } from "@workspace/db";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

/**
 * Firestore trigger: rebuilds the Student Knowledge Profile whenever a
 * chapterMastery document is written (created or updated).
 *
 * Path: studentProgress/{uid}/chapterMastery/{chapterId}
 *
 * Why here and not client-side only:
 *   - Profile is rebuilt even when the student closes the app mid-session
 *   - Runs on Google's infrastructure — no latency or memory pressure on device
 *   - Rate-limited to 1 rebuild per student per 5 minutes via the lastProfileBuildAt field
 */
export const rebuildKnowledgeProfile = onDocumentWritten(
  {
    document: "studentProgress/{uid}/chapterMastery/{chapterId}",
    region: "asia-south1",
  },
  async (event) => {
    const uid = event.params.uid;

    // ── Rate-limit: at most one full profile rebuild per 30 seconds per student ─
    // The previous 5-minute window left the AI Mentor recommending stale advice
    // (e.g. "retry these MCQs") even after the student had just done the retry,
    // because the profile didn't recompute fast enough for the dashboard to
    // reflect their progress. 30 s is fast enough that students see updated
    // guidance almost immediately, while still capping Gemini call cost.
    const profileRef = db.collection("studentKnowledgeProfiles").doc(uid);
    const profileSnap = await profileRef.get();
    const isCoolingDown = (() => {
      if (!profileSnap.exists) return false;
      const lastBuild = profileSnap.data()?.updatedAt as Timestamp | undefined;
      if (!lastBuild) return false;
      return Date.now() - lastBuild.toMillis() < 30 * 1000;
    })();

    if (isCoolingDown) {
      // Even when we skip the rebuild, ALWAYS invalidate the AI recommendation
      // cache so the next dashboard fetch picks up whatever profile exists.
      // Without this, the old recommendations stuck around for 6 h regardless
      // of how many MCQs the student completed in quick succession.
      try {
        await db.collection("aiRecommendations").doc(uid).delete();
      } catch (err) {
        console.warn("[rebuildKnowledgeProfile] cache delete during cooldown failed:", uid, err);
      }
      return;
    }

    await computeAndPersistProfile(uid);
  }
);

// ── Profile computation (Admin SDK version) ───────────────────────────────────

const WEAK_MASTERY_THRESHOLD   = 40;
const STRONG_MASTERY_THRESHOLD = 75;
const MASTERY_LEARNED_MIN      = 60;
const RETRY_ACCURACY_THRESHOLD = 50;
const PROFILE_VERSION          = 1;

async function computeAndPersistProfile(uid: string): Promise<void> {
  try {
    // ── Parallel reads ────────────────────────────────────────────────────────
    const [masterySnap, questionSnap, sessionSnap, statsSnap, studentSnap] = await Promise.all([
      db.collection("studentProgress").doc(uid).collection("chapterMastery").get(),
      db.collection("studentProgress").doc(uid).collection("questionResults").get(),
      db.collection("studentProgress").doc(uid).collection("sessions")
        .orderBy("startedAt", "desc").limit(30).get(),
      db.collection("studentProgress").doc(uid).get(),
      db.collection("students").doc(uid).get(),
    ]);

    const masteries  = masterySnap.docs.map((d) => d.data());
    const questions  = questionSnap.docs.map((d) => d.data());
    const sessions   = sessionSnap.docs.map((d) => d.data());
    const stats      = statsSnap.exists ? statsSnap.data() : null;
    const student    = studentSnap.exists ? studentSnap.data() : null;

    // ── Mastery maps ──────────────────────────────────────────────────────────
    const masteryMap: Record<string, number> = {};
    const weakTopicMap: Record<string, object> = {};
    const strongTopicMap: Record<string, object> = {};
    const subjectGroups: Record<string, { sum: number; count: number; lastStudied: string; subjectName: string }> = {};

    for (const m of masteries) {
      masteryMap[m.chapterId] = m.masteryScore ?? 0;

      const lastMs  = tsToMs(m.lastStudiedAt);
      const daysSinceStudy = lastMs ? Math.floor((Date.now() - lastMs) / 86_400_000) : 999;

      if ((m.masteryScore ?? 0) < WEAK_MASTERY_THRESHOLD && m.masteryStatus !== "not_started") {
        weakTopicMap[m.chapterId] = {
          chapterId: m.chapterId, chapterTitle: m.chapterTitle,
          subjectId: m.subjectId, subjectName: m.subjectName,
          masteryScore: m.masteryScore, mcqAccuracy: m.mcqAccuracy,
          daysSinceStudy, revisionCount: m.revisionCount ?? 0,
        };
      }
      if ((m.masteryScore ?? 0) >= STRONG_MASTERY_THRESHOLD) {
        strongTopicMap[m.chapterId] = {
          chapterId: m.chapterId, chapterTitle: m.chapterTitle,
          subjectId: m.subjectId, subjectName: m.subjectName,
          masteryScore: m.masteryScore, mcqAccuracy: m.mcqAccuracy,
        };
      }

      if (!subjectGroups[m.subjectId]) {
        subjectGroups[m.subjectId] = { sum: 0, count: 0, lastStudied: "", subjectName: m.subjectName ?? "" };
      }
      const g = subjectGroups[m.subjectId];
      g.sum += m.masteryScore ?? 0;
      g.count++;
      const dateStr = lastMs ? new Date(lastMs).toISOString().slice(0, 10) : "";
      if (dateStr > g.lastStudied) g.lastStudied = dateStr;
    }

    // ── Subject mastery ───────────────────────────────────────────────────────
    const subjectMastery: Record<string, object> = {};
    for (const [sid, g] of Object.entries(subjectGroups)) {
      const avg = g.count > 0 ? Math.round(g.sum / g.count) : 0;
      const subjectMasteries = masteries.filter((m) => m.subjectId === sid);
      const trend = computeSubjectTrend(subjectMasteries);
      subjectMastery[sid] = {
        subjectId: sid, subjectName: g.subjectName,
        masteryScore: avg, trend,
        chaptersStudied: g.count, lastStudied: g.lastStudied,
      };
    }

    // ── Study behavior ────────────────────────────────────────────────────────
    const dailyMap: Record<string, number> = {};
    const hourCounts: number[] = new Array(24).fill(0);
    const cutoff = Date.now() - 30 * 86_400_000;

    for (const s of sessions) {
      const startMs = tsToMs(s.startedAt);
      if (startMs < cutoff) continue;
      const date = s.date ?? new Date(startMs).toISOString().slice(0, 10);
      dailyMap[date] = (dailyMap[date] ?? 0) + (s.activeDurationMs ?? 0);
      const h = s.hourStarted ?? 0;
      if (h >= 0 && h < 24) hourCounts[h]++;
    }

    const dailyTotals    = Object.values(dailyMap);
    const activeDays     = dailyTotals.filter((ms) => ms > 0).length;
    const totalStudyMs   = dailyTotals.reduce((a, b) => a + b, 0);
    const avgDailyMs     = activeDays > 0 ? Math.round(totalStudyMs / activeDays) : 0;
    const preferredHour  = hourCounts.indexOf(Math.max(...hourCounts, 0));
    const avgSessionMs   = sessions.length > 0
      ? Math.round(sessions.reduce((a, s) => a + (s.activeDurationMs ?? 0), 0) / sessions.length)
      : 0;
    const consistencyScore = Math.min(100, Math.round((activeDays / 30) * 100));

    const studyBehavior = {
      totalStudyTimeMs: totalStudyMs, avgDailyStudyTimeMs: avgDailyMs,
      preferredStudyHour: preferredHour, consistencyScore,
      currentStreak: stats?.currentStreak ?? 0, longestStreak: stats?.longestStreak ?? 0,
      activeDaysLast30: activeDays, avgSessionDurationMs: avgSessionMs,
      totalSessions: sessions.length,
    };

    // ── Learning patterns ─────────────────────────────────────────────────────
    const studiedMasteries = masteries.filter((m) => m.masteryStatus !== "not_started");
    const avgMcqAcc = studiedMasteries.length > 0
      ? Math.round(studiedMasteries.reduce((a, m) => a + (m.mcqAccuracy ?? 0), 0) / studiedMasteries.length) : 0;
    const avgNotesEng = studiedMasteries.length > 0
      ? Math.round(studiedMasteries.reduce((a, m) => a + (m.notesEngagementScore ?? 0), 0) / studiedMasteries.length) : 0;

    const recentCutoff = Date.now() - 7 * 86_400_000;
    const masteredRecently = masteries.filter(
      (m) => (m.masteryScore ?? 0) >= MASTERY_LEARNED_MIN && tsToMs(m.lastStudiedAt) > recentCutoff
    ).length;

    const subjectScores = Object.entries(subjectMastery)
      .map(([sid, entry]) => ({ sid, score: (entry as { masteryScore: number }).masteryScore }))
      .sort((a, b) => b.score - a.score);
    const strongestSubjectId = subjectScores[0]?.sid ?? null;
    const weakestSubjectId   = subjectScores[subjectScores.length - 1]?.sid ?? null;

    const learningPattern = {
      averageMcqAccuracy: avgMcqAcc, averageNotesEngagement: avgNotesEng,
      improvementTrend: computeOverallTrend(masteries),
      learningVelocity: masteredRecently,
      strongestSubjectId, weakestSubjectId,
    };

    // ── Revision profile ──────────────────────────────────────────────────────
    const needsRevision = masteries
      .filter((m) => {
        if (m.masteryStatus === "not_started") return false;
        const lastMs = tsToMs(m.lastStudiedAt);
        return lastMs > 0 && Math.floor((Date.now() - lastMs) / 86_400_000) >= 7;
      })
      .map((m) => m.chapterId as string);

    const withRevision  = masteries.filter((m) => (m.revisionCount ?? 0) > 0 && m.lastRevisedAt);
    const totalRevisions = masteries.reduce((a, m) => a + (m.revisionCount ?? 0), 0);
    const avgRevisionGap = withRevision.length > 0
      ? Math.round(withRevision.reduce((a, m) => {
          const diff = Math.abs(tsToMs(m.lastStudiedAt) - tsToMs(m.lastRevisedAt));
          return a + Math.floor(diff / 86_400_000);
        }, 0) / withRevision.length)
      : 0;

    let latestRevisionMs = 0;
    for (const m of masteries) {
      const ms = tsToMs(m.lastRevisedAt);
      if (ms > latestRevisionMs) latestRevisionMs = ms;
    }
    const lastRevisionDate = latestRevisionMs
      ? new Date(latestRevisionMs).toISOString().slice(0, 10)
      : null;

    const revisionProfile = {
      chaptersNeedingRevision: needsRevision, avgRevisionGapDays: avgRevisionGap,
      lastRevisionDate, totalRevisions,
    };

    // ── Retry questions ───────────────────────────────────────────────────────
    const chapterMeta: Record<string, { chapterTitle: string; subjectId: string; subjectName: string }> = {};
    for (const m of masteries) {
      chapterMeta[m.chapterId] = {
        chapterTitle: m.chapterTitle ?? "", subjectId: m.subjectId ?? "", subjectName: m.subjectName ?? "",
      };
    }

    const retryQuestions = questions
      .filter((q) => (q.totalAttempts ?? 0) >= 2 && (q.accuracy ?? 100) < RETRY_ACCURACY_THRESHOLD)
      .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
      .slice(0, 20)
      .map((q) => ({
        questionId: q.questionId, chapterId: q.chapterId,
        chapterTitle: chapterMeta[q.chapterId]?.chapterTitle ?? "",
        subjectId: q.subjectId,
        subjectName: chapterMeta[q.chapterId]?.subjectName ?? "",
        accuracy: q.accuracy ?? 0, totalAttempts: q.totalAttempts ?? 0,
        consecutiveWrong: q.consecutiveWrong ?? 0,
      }));

    // ── AI scores ─────────────────────────────────────────────────────────────
    const avgMastery = masteries.length > 0
      ? masteries.reduce((a, m) => a + (m.masteryScore ?? 0), 0) / masteries.length : 0;
    const examReadinessScore = Math.min(100, Math.round(
      avgMastery + Math.min((stats?.currentStreak ?? 0) * 2, 10) + consistencyScore * 0.1
    ));
    const confidenceScore = Math.min(100, Math.round(
      avgMcqAcc * 0.4 + Math.min((stats?.currentStreak ?? 0) * 3, 30) + Math.min(activeDays * 2, 30)
    ));

    // ── Write profile ─────────────────────────────────────────────────────────
    await db.collection("studentKnowledgeProfiles").doc(uid).set({
      uid,
      classLevel: student?.classLevel ?? "",
      medium:     student?.medium     ?? "",
      masteryMap, subjectMastery, weakTopicMap, strongTopicMap,
      studyBehavior, learningPattern, revisionProfile,
      examReadinessScore, confidenceScore,
      suggestedRetryQuestions: retryQuestions,
      version: PROFILE_VERSION,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Invalidate the AI mentor cache so the next /api/ai/mentor call regenerates
    // using this fresh profile. Without this, the AI keeps serving 6-hour-stale
    // recommendations and won't react to recent MCQ scores or wrong answers.
    // The 5-minute rate limit on this trigger caps cost: max ~12 Gemini calls
    // per hour per active student, only when their profile actually changed.
    try {
      await db.collection("aiRecommendations").doc(uid).delete();
    } catch (cacheErr) {
      console.warn("[rebuildKnowledgeProfile] failed to bust aiRecommendations cache for uid:", uid, cacheErr);
    }
  } catch (err) {
    console.error("[rebuildKnowledgeProfile] failed for uid:", uid, err);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function tsToMs(ts: unknown): number {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  const raw = ts as { seconds?: number };
  return (raw.seconds ?? 0) * 1000;
}

function computeSubjectTrend(masteries: Record<string, unknown>[]): string {
  const improving = masteries.filter((m) => m.trend === "improving").length;
  const declining = masteries.filter((m) => m.trend === "declining").length;
  if (improving > declining) return "improving";
  if (declining > improving) return "declining";
  if (masteries.length === 0) return "unknown";
  return "stable";
}

function computeOverallTrend(masteries: Record<string, unknown>[]): string {
  const improving = masteries.filter((m) => m.trend === "improving").length;
  const declining = masteries.filter((m) => m.trend === "declining").length;
  if (improving > declining * 1.5) return "improving";
  if (declining > improving * 1.5) return "declining";
  return "stable";
}
