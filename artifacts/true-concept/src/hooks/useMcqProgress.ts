import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { recordMcqAttempt, fetchMcqProgressForChapter } from "@/lib/progress/mcq-service";
import type { McqProgress } from "@/lib/progress/types";

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
      // Invalidate cached MCQ + dashboard data so badges refresh
      qc.invalidateQueries({ queryKey: ["mcqProgress", user.id, args.chapterId] });
      qc.invalidateQueries({ queryKey: ["studentStats", user.id] });
      qc.invalidateQueries({ queryKey: ["recentActivity", user.id] });
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
