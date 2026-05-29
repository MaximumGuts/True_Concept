import { getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { knowledgeProfileDoc } from "./paths";
import {
  fetchAllChapterMastery,
  groupBySubject,
  findChaptersNeedingRevision,
} from "./mastery-service";
import {
  fetchAllQuestionResults,
  filterRetryQuestions,
  RETRY_ACCURACY_THRESHOLD,
} from "./question-service";
import {
  fetchRecentSessions,
  buildDailyStudyMap,
  computePreferredStudyHour,
} from "./session-service";
import { fetchStudentProfile } from "@/lib/progress/profile-service";
import { statsDoc } from "@/lib/progress/paths";
import type {
  StudentKnowledgeProfile,
  ChapterMastery,
  StudyBehaviorProfile,
  LearningPatternProfile,
  RevisionProfile,
  TrendDirection,
  WeakTopicEntry,
  StrongTopicEntry,
  RetryQuestion,
  SubjectMasteryEntry,
} from "./types";
import type { StudentStats } from "@/lib/progress/types";

const PROFILE_VERSION = 1;
const WEAK_MASTERY_THRESHOLD   = 40;
const STRONG_MASTERY_THRESHOLD = 75;
const MASTERY_LEARNED_MIN      = 60; // "mastered" for velocity calculation

// ── Profile computation ───────────────────────────────────────────────────────

/**
 * Builds and persists the Student Knowledge Profile for `uid`.
 *
 * This reads from:
 *   - studentProgress/{uid}/chapterMastery/*
 *   - studentProgress/{uid}/questionResults/*
 *   - studentProgress/{uid}/sessions/* (last 30)
 *   - studentProgress/{uid} (stats doc for streak)
 *   - students/{uid} (profile for class/medium)
 *
 * The result is written to studentKnowledgeProfiles/{uid}.
 * The AI Academic Mentor reads ONLY this document.
 *
 * Debounced externally via buildProfile() below — call buildProfile() from
 * the tracking engine, not this function directly.
 */
export async function computeAndPersistProfile(uid: string): Promise<void> {
  try {
    // ── Parallel reads ──────────────────────────────────────────────────────
    const [masteries, questionResults, sessions, statsSnap, studentProfile] =
      await Promise.all([
        fetchAllChapterMastery(uid),
        fetchAllQuestionResults(uid),
        fetchRecentSessions(uid, 30),
        getDoc(statsDoc(uid)),
        fetchStudentProfile(uid).catch(() => null),
      ]);

    const stats = statsSnap.exists() ? (statsSnap.data() as StudentStats) : null;

    // ── Mastery maps ────────────────────────────────────────────────────────
    const masteryMap: Record<string, number>         = {};
    const weakTopicMap: Record<string, WeakTopicEntry>   = {};
    const strongTopicMap: Record<string, StrongTopicEntry> = {};

    for (const m of masteries) {
      masteryMap[m.chapterId] = m.masteryScore;

      const lastMs  = timestampToMs(m.lastStudiedAt);
      const daysSinceStudy = lastMs ? Math.floor((Date.now() - lastMs) / 86_400_000) : 999;

      if (m.masteryScore < WEAK_MASTERY_THRESHOLD && m.masteryStatus !== "not_started") {
        weakTopicMap[m.chapterId] = {
          chapterId:    m.chapterId,
          chapterTitle: m.chapterTitle,
          subjectId:    m.subjectId,
          subjectName:  m.subjectName,
          masteryScore: m.masteryScore,
          mcqAccuracy:  m.mcqAccuracy,
          daysSinceStudy,
          revisionCount: m.revisionCount,
        };
      }

      if (m.masteryScore >= STRONG_MASTERY_THRESHOLD) {
        strongTopicMap[m.chapterId] = {
          chapterId:    m.chapterId,
          chapterTitle: m.chapterTitle,
          subjectId:    m.subjectId,
          subjectName:  m.subjectName,
          masteryScore: m.masteryScore,
          mcqAccuracy:  m.mcqAccuracy,
        };
      }
    }

    // ── Subject mastery ─────────────────────────────────────────────────────
    const subjectGroups = groupBySubject(masteries);
    const subjectMastery: Record<string, SubjectMasteryEntry> = {};

    for (const [sid, g] of Object.entries(subjectGroups)) {
      const subjectMasteries = masteries.filter((m) => m.subjectId === sid);
      const trend = computeSubjectTrend(subjectMasteries);
      subjectMastery[sid] = {
        subjectId:      sid,
        subjectName:    g.subjectName,
        masteryScore:   g.avg,
        trend,
        chaptersStudied: g.count,
        lastStudied:    g.lastStudied,
      };
    }

    // ── Study behavior ──────────────────────────────────────────────────────
    const dailyMap      = buildDailyStudyMap(sessions, 30);
    const dailyTotals   = Object.values(dailyMap);
    const activeDays    = dailyTotals.filter((ms) => ms > 0).length;
    const totalStudyMs  = dailyTotals.reduce((a, b) => a + b, 0);
    const avgDailyMs    = activeDays > 0 ? Math.round(totalStudyMs / activeDays) : 0;
    const preferredHour = computePreferredStudyHour(sessions);
    const avgSessionMs  = sessions.length > 0
      ? Math.round(sessions.reduce((a, s) => a + (s.activeDurationMs ?? 0), 0) / sessions.length)
      : 0;
    const consistencyScore = computeConsistencyScore(activeDays);

    const studyBehavior: StudyBehaviorProfile = {
      totalStudyTimeMs:    totalStudyMs,
      avgDailyStudyTimeMs: avgDailyMs,
      preferredStudyHour:  preferredHour,
      consistencyScore,
      currentStreak:       stats?.currentStreak   ?? 0,
      longestStreak:       stats?.longestStreak   ?? 0,
      activeDaysLast30:    activeDays,
      avgSessionDurationMs: avgSessionMs,
      totalSessions:       sessions.length,
    };

    // ── Learning patterns ───────────────────────────────────────────────────
    const studiedMasteries = masteries.filter((m) => m.masteryStatus !== "not_started");
    const avgMcqAcc = studiedMasteries.length > 0
      ? Math.round(studiedMasteries.reduce((a, m) => a + m.mcqAccuracy, 0) / studiedMasteries.length)
      : 0;
    const avgNotesEng = studiedMasteries.length > 0
      ? Math.round(studiedMasteries.reduce((a, m) => a + m.notesEngagementScore, 0) / studiedMasteries.length)
      : 0;

    const masteredRecently = masteries.filter(
      (m) => m.masteryScore >= MASTERY_LEARNED_MIN && timestampToMs(m.lastStudiedAt) > Date.now() - 7 * 86_400_000
    ).length;
    const learningVelocity = masteredRecently; // topics reaching ≥ 60 in last 7 days

    const subjectScores = Object.entries(subjectMastery).sort((a, b) => b[1].masteryScore - a[1].masteryScore);
    const strongestSubjectId = subjectScores[0]?.[0] ?? null;
    const weakestSubjectId   = subjectScores[subjectScores.length - 1]?.[0] ?? null;

    const learningPattern: LearningPatternProfile = {
      averageMcqAccuracy:     avgMcqAcc,
      averageNotesEngagement: avgNotesEng,
      improvementTrend:       computeOverallTrend(masteries),
      learningVelocity,
      strongestSubjectId,
      weakestSubjectId,
    };

    // ── Revision profile ────────────────────────────────────────────────────
    const needsRevision   = findChaptersNeedingRevision(masteries, 7);
    const revisionCounts  = masteries.map((m) => m.revisionCount ?? 0);
    const totalRevisions  = revisionCounts.reduce((a, b) => a + b, 0);
    const avgGap          = computeAvgRevisionGap(masteries);
    const lastRevisionDate = computeLastRevisionDate(masteries);

    const revisionProfile: RevisionProfile = {
      chaptersNeedingRevision: needsRevision,
      avgRevisionGapDays:      avgGap,
      lastRevisionDate,
      totalRevisions,
    };

    // ── Retry questions ─────────────────────────────────────────────────────
    // Build chapterId → chapterTitle/subjectId lookup from mastery docs
    const chapterMeta: Record<string, { chapterTitle: string; subjectId: string; subjectName: string }> = {};
    for (const m of masteries) {
      chapterMeta[m.chapterId] = {
        chapterTitle: m.chapterTitle,
        subjectId:    m.subjectId,
        subjectName:  m.subjectName,
      };
    }

    const retryQuestions: RetryQuestion[] = filterRetryQuestions(questionResults, RETRY_ACCURACY_THRESHOLD)
      .slice(0, 20) // cap at 20 suggestions
      .map((q) => ({
        questionId:      q.questionId,
        chapterId:       q.chapterId,
        chapterTitle:    chapterMeta[q.chapterId]?.chapterTitle ?? "",
        subjectId:       q.subjectId,
        subjectName:     chapterMeta[q.chapterId]?.subjectName ?? "",
        accuracy:        q.accuracy,
        totalAttempts:   q.totalAttempts,
        consecutiveWrong: q.consecutiveWrong,
      }));

    // ── AI scores ───────────────────────────────────────────────────────────
    const examReadinessScore = computeExamReadiness(masteries, studyBehavior);
    const confidenceScore    = computeConfidenceScore(avgMcqAcc, studyBehavior.currentStreak, activeDays);

    // ── Write profile ───────────────────────────────────────────────────────
    const profile: Omit<StudentKnowledgeProfile, "updatedAt"> = {
      uid,
      classLevel: studentProfile?.classLevel ?? "",
      medium:     studentProfile?.medium     ?? "",
      masteryMap,
      subjectMastery,
      weakTopicMap,
      strongTopicMap,
      studyBehavior,
      learningPattern,
      revisionProfile,
      examReadinessScore,
      confidenceScore,
      suggestedRetryQuestions: retryQuestions,
      version: PROFILE_VERSION,
    };

    await setDoc(knowledgeProfileDoc(uid), { ...profile, updatedAt: serverTimestamp() });
  } catch (err) {
    // Profile build must never crash the app
    console.error("[knowledge-profile] build failed:", err);
  }
}

// ── Debounced profile builder ─────────────────────────────────────────────────
// Only build once every 5 minutes per session to avoid expensive batch reads.

let _lastBuildUid   = "";
let _lastBuildMs    = 0;
const MIN_REBUILD_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Debounced entry point. Call this after significant events (MCQ attempt).
 * Internally rate-limits to once every 5 minutes.
 */
export function buildProfile(uid: string): void {
  const now = Date.now();
  if (_lastBuildUid === uid && now - _lastBuildMs < MIN_REBUILD_INTERVAL_MS) return;
  _lastBuildUid = uid;
  _lastBuildMs  = now;
  void computeAndPersistProfile(uid);
}

/**
 * Read the current knowledge profile without rebuilding.
 */
export async function fetchKnowledgeProfile(uid: string): Promise<StudentKnowledgeProfile | null> {
  const snap = await getDoc(knowledgeProfileDoc(uid));
  return snap.exists() ? (snap.data() as StudentKnowledgeProfile) : null;
}

// ── Score computation helpers ─────────────────────────────────────────────────

function computeExamReadiness(masteries: ChapterMastery[], behavior: StudyBehaviorProfile): number {
  if (masteries.length === 0) return 0;
  const avgMastery   = masteries.reduce((a, m) => a + m.masteryScore, 0) / masteries.length;
  const streakBonus  = Math.min(behavior.currentStreak * 2, 10);
  const consistBonus = behavior.consistencyScore * 0.1;
  return Math.min(100, Math.round(avgMastery + streakBonus + consistBonus));
}

function computeConfidenceScore(avgAccuracy: number, streak: number, activeDays: number): number {
  const streakComponent   = Math.min(streak * 3, 30);
  const activityComponent = Math.min(activeDays * 2, 30);
  const accuracyComponent = avgAccuracy * 0.4;
  return Math.min(100, Math.round(accuracyComponent + streakComponent + activityComponent));
}

function computeConsistencyScore(activeDays: number): number {
  // 30 active days out of 30 = 100 score
  return Math.min(100, Math.round((activeDays / 30) * 100));
}

function computeSubjectTrend(masteries: ChapterMastery[]): TrendDirection {
  const improving = masteries.filter((m) => m.trend === "improving").length;
  const declining = masteries.filter((m) => m.trend === "declining").length;
  if (improving > declining) return "improving";
  if (declining > improving) return "declining";
  if (masteries.length === 0) return "unknown";
  return "stable";
}

function computeOverallTrend(masteries: ChapterMastery[]): TrendDirection {
  const improving = masteries.filter((m) => m.trend === "improving").length;
  const declining = masteries.filter((m) => m.trend === "declining").length;
  if (improving > declining * 1.5) return "improving";
  if (declining > improving * 1.5) return "declining";
  return "stable";
}

function computeAvgRevisionGap(masteries: ChapterMastery[]): number {
  const withRevision = masteries.filter((m) => (m.revisionCount ?? 0) > 0 && m.lastRevisedAt);
  if (withRevision.length === 0) return 0;
  const gaps = withRevision.map((m) => {
    const lastMs = timestampToMs(m.lastStudiedAt);
    const revMs  = timestampToMs(m.lastRevisedAt);
    if (!lastMs || !revMs) return 0;
    return Math.abs(Math.floor((lastMs - revMs) / 86_400_000));
  });
  return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
}

function computeLastRevisionDate(masteries: ChapterMastery[]): string | null {
  let latestMs = 0;
  for (const m of masteries) {
    const ms = timestampToMs(m.lastRevisedAt);
    if (ms > latestMs) latestMs = ms;
  }
  return latestMs ? new Date(latestMs).toISOString().slice(0, 10) : null;
}

function timestampToMs(ts: Timestamp | null | undefined): number {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  const raw = ts as unknown as { seconds: number };
  return raw.seconds ? raw.seconds * 1000 : 0;
}
