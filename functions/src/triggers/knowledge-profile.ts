import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { db } from "@workspace/db";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getContentIndex } from "../lib/content-index.js";

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
      // During cooldown we skip the rebuild entirely. We intentionally do NOT
      // bust the AI recommendation cache here — the 48h cache TTL in
      // ai-mentor.ts governs regeneration to cap Gemini cost. (The profile doc
      // still updates dashboard stats on the next full rebuild; only the
      // Gemini-generated text is throttled.)
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
    const [
      masterySnap, questionSnap, sessionSnap, statsSnap, studentSnap, labSnap,
      challengeSnap, mockSnap, contentIndex,
    ] = await Promise.all([
      db.collection("studentProgress").doc(uid).collection("chapterMastery").get(),
      db.collection("studentProgress").doc(uid).collection("questionResults").get(),
      db.collection("studentProgress").doc(uid).collection("sessions")
        .orderBy("startedAt", "desc").limit(30).get(),
      db.collection("studentProgress").doc(uid).get(),
      db.collection("students").doc(uid).get(),
      db.collection("studentProgress").doc(uid).collection("experimentMastery").get(),
      db.collection("studentProgress").doc(uid).collection("dailyChallenges")
        .orderBy("dateKey", "desc").limit(7).get(),
      db.collection("studentProgress").doc(uid).collection("mockExamSessions")
        .orderBy("completedAt", "desc").limit(5).get(),
      // Single-doc read of the shared content index (curriculum-wide counts).
      // Replaces reading the whole mcqs/qa/papers/chapters/subjects collections
      // per student — cost is now O(1) per rebuild instead of O(total content).
      getContentIndex(),
    ]);

    const masteries  = masterySnap.docs.map((d) => d.data());
    const questions  = questionSnap.docs.map((d) => d.data());
    const sessions   = sessionSnap.docs.map((d) => d.data());
    const student    = studentSnap.exists ? studentSnap.data() : null;

    // ── Daily challenge stats ─────────────────────────────────────────────────
    const challenges = challengeSnap.docs.map((d) => d.data());
    const completedChallenges = challenges.filter((c: any) => c.status === "completed");
    const dailyChallengeStreak = (() => {
      // Count consecutive completed days ending today
      const today = new Date().toISOString().slice(0, 10);
      const datesCompleted = new Set(completedChallenges.map((c: any) => c.dateKey as string));
      let streak = 0;
      const d = new Date();
      while (true) {
        const key = d.toISOString().slice(0, 10);
        if (!datesCompleted.has(key)) break;
        streak++;
        d.setDate(d.getDate() - 1);
        if (streak > 7) break; // cap at 7 days lookback
      }
      void today; // suppress unused warning
      return streak;
    })();
    const lastChallengeScore = completedChallenges[0]?.score ?? null;
    const avgChallengeScore  = completedChallenges.length > 0
      ? Math.round(completedChallenges.reduce((s: number, c: any) => s + (c.score ?? 0), 0) / completedChallenges.length)
      : null;

    // ── Mock exam stats ───────────────────────────────────────────────────────
    const mockExams = mockSnap.docs.map((d) => d.data());
    const lastMockScore = mockExams[0]?.score ?? null;
    const mockExamCount = mockExams.length;

    // Count completed labs (any experiment where completionPct >= 80 or completed flag is set)
    const completedLabCount = labSnap.docs.filter((d) => {
      const data = d.data();
      return data.completed === true || (data.completionPct ?? 0) >= 80;
    }).length;
    const totalLabCount = labSnap.docs.length; // labs the student has touched

    // Total chapters for this student's class — used to make examReadinessScore
    // cover ALL chapters, not just the ones the student has studied. Without
    // this, a student who aced 3 chapters out of 29 would score ~90 instead
    // of the honest ~10-15.
    const studentClass = student?.classLevel ?? null;
    const studentBoard = student?.board ?? null;
    // Chapter is in the student's track if class + board both match (or "Both").
    const inTrack = (c: { classLevel: string; board: string }) =>
      (!studentClass || c.classLevel === studentClass || c.classLevel === "Both") &&
      (!studentBoard || c.board === studentBoard || c.board === "Both" || !c.board);
    const totalChaptersForClass = contentIndex.chapters.filter(inTrack).length;
    // Floor at masteries.length so we never divide by a smaller number than
    // what the student has actually studied (edge case: chapters not yet in DB).
    const effectiveTotalChapters = Math.max(masteries.length, totalChaptersForClass || 1);
    const stats      = statsSnap.exists ? statsSnap.data() : null;

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

    // ── Content gap analysis (curriculum-wide awareness) ───────────────────────
    // The AI needs to know what content EXISTS so it can recommend new chapters,
    // unpracticed MCQs, unviewed Q&A, available papers, and untouched subjects —
    // including anything an admin just added.
    const studiedChapterIds = new Set(masteries.map((m: any) => m.chapterId));

    // Chapters belonging to this student's class + board track (from the index).
    const classChapters = contentIndex.chapters.filter(inTrack);

    // MCQ / Q&A counts per chapter come straight from the cached index.
    const mcqCountByChapter = contentIndex.mcqCountByChapter;
    const qaCountByChapter  = contentIndex.qaCountByChapter;

    // (a) Chapters never opened — top discovery candidates.
    const unexploredChapters = classChapters
      .filter((c) => !studiedChapterIds.has(c.id))
      .slice(0, 8)
      .map((c) => ({
        chapterId: c.id, chapterTitle: c.title,
        subjectId: c.subjectId, subjectName: c.subjectName,
      }));

    // (b) Chapters studied (notes/started) but MCQs never attempted, where MCQs exist.
    const chaptersWithUnpracticedMcqs = masteries
      .filter((m: any) =>
        (mcqCountByChapter[m.chapterId] ?? 0) > 0 && (m.mcqAttemptCount ?? 0) === 0)
      .slice(0, 6)
      .map((m: any) => ({
        chapterId: m.chapterId, chapterTitle: m.chapterTitle ?? "",
        subjectName: m.subjectName ?? "",
        mcqAvailable: mcqCountByChapter[m.chapterId] ?? 0,
      }));

    // (c) Chapters the student has studied that also have Q&A available to review.
    const chaptersWithQaToReview = masteries
      .filter((m: any) => (qaCountByChapter[m.chapterId] ?? 0) > 0)
      .slice(0, 6)
      .map((m: any) => ({
        chapterId: m.chapterId, chapterTitle: m.chapterTitle ?? "",
        subjectName: m.subjectName ?? "",
        qaAvailable: qaCountByChapter[m.chapterId] ?? 0,
      }));

    // (d) Full-length papers available (no per-student tracking by product design).
    const availablePapersCount = contentIndex.paperCount;

    // (e) Subjects with ZERO activity (student never opened any of their chapters).
    const subjectChapterIds: Record<string, { name: string; ids: string[] }> = {};
    for (const c of classChapters) {
      const sid = c.subjectId || "unknown";
      if (!subjectChapterIds[sid]) subjectChapterIds[sid] = { name: c.subjectName, ids: [] };
      subjectChapterIds[sid].ids.push(c.id);
    }
    const allClassSubjects = contentIndex.subjects
      .filter((s) =>
        !studentClass || s.classLevel === studentClass || s.classLevel === "Both" || !s.classLevel);
    const emptySubjects = Object.entries(subjectChapterIds)
      .filter(([, v]) => v.ids.every((id) => !studiedChapterIds.has(id)))
      .map(([sid, v]) => ({ subjectId: sid, subjectName: v.name, chapterCount: v.ids.length }));

    // (f) Content coverage percentages (for scoring + AI context).
    const uniqueMcqsAttempted = questions.length; // questionResults = one doc per unique MCQ
    const totalMcqsForClass = classChapters.reduce(
      (sum, c) => sum + (mcqCountByChapter[c.id] ?? 0), 0);
    const chapterCoveragePct = totalChaptersForClass > 0
      ? Math.round((studiedChapterIds.size / totalChaptersForClass) * 100) : 0;
    const mcqCoveragePct = totalMcqsForClass > 0
      ? Math.round((Math.min(uniqueMcqsAttempted, totalMcqsForClass) / totalMcqsForClass) * 100) : 0;
    const subjectsStarted = Object.values(subjectChapterIds)
      .filter((v) => v.ids.some((id) => studiedChapterIds.has(id))).length;

    const contentCoverage = {
      chapterCoveragePct,
      mcqCoveragePct,
      subjectsStarted,
      totalSubjects: allClassSubjects.length || Object.keys(subjectChapterIds).length,
      chaptersStudied: studiedChapterIds.size,
      totalChapters: totalChaptersForClass,
      mcqsAttempted: uniqueMcqsAttempted,
      totalMcqs: totalMcqsForClass,
      availablePapersCount,
    };

    // ── AI scores ─────────────────────────────────────────────────────────────
    // examReadinessScore — holistic blend across the WHOLE curriculum:
    //   60%  chapter mastery coverage   (sum of mastery / total chapters)
    //   15%  MCQ breadth                (unique MCQs attempted / total available)
    //   15%  exam performance           (avg of last mock + avg daily challenge)
    //   10%  consistency                (active days / 30)
    // Falls back gracefully when a component has no data so new students aren't
    // unfairly penalised. Chapter coverage stays dominant → score stays honest.
    const studiedMasterySum = masteries.reduce((a: number, m: any) => a + (m.masteryScore ?? 0), 0);
    const chapterCoverageScore = Math.min(100, studiedMasterySum / effectiveTotalChapters);

    const examPerfParts: number[] = [];
    if (lastMockScore != null)      examPerfParts.push(lastMockScore);
    if (avgChallengeScore != null)  examPerfParts.push(avgChallengeScore);
    const examPerfScore = examPerfParts.length > 0
      ? examPerfParts.reduce((a, b) => a + b, 0) / examPerfParts.length
      : chapterCoverageScore; // neutral fallback

    const examReadinessScore = Math.min(100, Math.round(
        chapterCoverageScore * 0.60
      + mcqCoveragePct       * 0.15
      + examPerfScore        * 0.15
      + consistencyScore     * 0.10
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
      // Daily challenge + mock exam for AI prompt context
      dailyChallengeStreak,
      lastChallengeScore,
      avgChallengeScore,
      lastMockScore,
      mockExamCount,
      // Lab engagement
      completedLabCount,
      totalLabCount,
      // ── Content gap map — makes the AI aware of ALL available content ────────
      contentCoverage,
      unexploredChapters,
      chaptersWithUnpracticedMcqs,
      chaptersWithQaToReview,
      emptySubjects,
      availablePapersCount,
      // lastActiveAt — this trigger only fires when the student writes a
      // chapterMastery doc (a real study action), so "now" is an accurate
      // last-active timestamp. Drives activity tiering in ai-mentor.ts to
      // throttle Gemini for infrequent/returning users. See lib/activity-tier.ts.
      lastActiveAt: FieldValue.serverTimestamp(),
      version: PROFILE_VERSION,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // NOTE: We intentionally do NOT delete the AI mentor cache here anymore.
    // The profile doc above is always fresh (it drives dashboard stats, exam
    // readiness, content gaps — all read directly). Only the Gemini-GENERATED
    // recommendation TEXT is governed by the 48h cache TTL in ai-mentor.ts.
    // This caps Gemini cost to ~1 call per student per 2 days — the single
    // biggest variable cost. Students who want fresher AI advice immediately
    // can tap the manual refresh button (POST /api/ai/refresh).
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
