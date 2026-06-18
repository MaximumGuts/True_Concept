import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { recordMcqAttempt, fetchMcqProgressForChapter } from "@/lib/progress/mcq-service";
import type { McqProgress } from "@/lib/progress/types";
import { awardXP } from "@/lib/gamification/xp-service";
import { XP_VALUES } from "@/lib/gamification/xp-config";

/**
 * Records a completed MCQ attempt. Wrap your "Submit MCQs" handler with this.
 */
export function useRecordMcqAttempt() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useCallback(
    async (args: {
      chapterId: string;
      setId: string;
      subjectId: string;
      totalQuestions: number;
      correctAnswers: number;
      durationSec: number;
      chapterTitle?: string;
      subjectName?: string;
      classLevel?: string | null;
      medium?: string;
    }) => {
      if (!user || user.role !== "student") return;
      await recordMcqAttempt({ uid: user.id, ...args });

      // Award XP based on performance (fire-and-forget)
      const score = args.totalQuestions > 0
        ? Math.round((args.correctAnswers / args.totalQuestions) * 100) : 0;
      const today = new Date().toISOString().slice(0, 10);
      const baseId = `mcq-${args.chapterId}-${args.setId}-${today}`;
      void awardXP({
        uid: user.id, xp: XP_VALUES.MCQ_ATTEMPT,
        eventId: `${baseId}-attempt`, type: "mcq_attempt",
        statDelta: { totalMcqAttempts: 1, mcqAccuracySum: score },
      });
      if (score >= 100) {
        void awardXP({ uid: user.id, xp: XP_VALUES.MCQ_SCORE_100, eventId: `${baseId}-perfect`, type: "mcq_perfect" });
      } else if (score >= 75) {
        void awardXP({ uid: user.id, xp: XP_VALUES.MCQ_SCORE_75, eventId: `${baseId}-score75`, type: "mcq_score_75" });
      } else if (score >= 50) {
        void awardXP({ uid: user.id, xp: XP_VALUES.MCQ_SCORE_50, eventId: `${baseId}-score50`, type: "mcq_score_50" });
      }

      // Invalidate cached MCQ + dashboard data so badges refresh
      qc.invalidateQueries({ queryKey: ["mcqProgress", user.id, args.chapterId] });
      qc.invalidateQueries({ queryKey: ["studentStats", user.id] });
      qc.invalidateQueries({ queryKey: ["recentActivity", user.id] });
      qc.invalidateQueries({ queryKey: ["studentXP", user.id] });
    },
    [user, qc]
  );
}

/**
 * Returns MCQ progress for all sets in one chapter (for badges).
 */
export function useChapterMcqProgress(chapterId: string | null) {
  const { user } = useAuth();

  const query = useQuery<McqProgress[]>({
    queryKey: ["mcqProgress", user?.id, chapterId],
    enabled: !!user && user.role === "student" && !!chapterId,
    queryFn: () => fetchMcqProgressForChapter(user!.id, chapterId!),
    staleTime: 30 * 1000,
  });

  const byKey = (query.data ?? []).reduce<Record<string, McqProgress>>((acc, m) => {
    acc[m.setKey] = m;
    return acc;
  }, {});

  return {
    progressList: query.data ?? [],
    progressByKey: byKey,
    isLoading: query.isLoading,
  };
}
