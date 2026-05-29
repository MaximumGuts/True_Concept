import { useQuery } from "@tanstack/react-query";
import { getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { statsDoc } from "@/lib/progress/paths";
import { fetchRecentActivity } from "@/lib/progress/activity-service";
import type { StudentStats, DashboardSummary, ActivityEntry, SubjectAggregate } from "@/lib/progress/types";

/**
 * Fetches everything the dashboard needs in 2 reads:
 *   1. Aggregate stats doc (counters, streak, last studied)
 *   2. Recent activity (last 20 entries)
 *
 * Output is a derived DashboardSummary shape that's safe to render directly.
 */
export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery<DashboardSummary | null>({
    queryKey: ["dashboardStats", user?.id],
    enabled: !!user && user.role === "student",
    staleTime: 30 * 1000,
    queryFn: async () => {
      const uid = user!.id;
      const [statsSnap, activity] = await Promise.all([
        getDoc(statsDoc(uid)),
        fetchRecentActivity(uid),
      ]);

      if (!statsSnap.exists()) {
        // Brand-new student — return an empty summary so the UI shows zeros
        return emptySummary(activity);
      }

      const stats = statsSnap.data() as StudentStats;
      const accuracy =
        stats.totalMcqsAttempted > 0
          ? Math.round((stats.totalMcqsCorrect / stats.totalMcqsAttempted) * 100)
          : 0;

      const subjectProgress: SubjectAggregate[] = Object.values(stats.subjectProgress ?? {});

      return {
        notesCompleted: stats.totalNotesRead ?? 0,
        notesInProgress: 0, // computed elsewhere if needed; kept 0 to avoid extra reads
        mcqsAttempted: stats.totalMcqsAttempted ?? 0,
        mcqsCompleted: 0,   // see below — computed by counting subject totals if needed
        accuracyPercent: accuracy,
        experimentsCompleted: stats.totalExperimentsCompleted ?? 0,
        currentStreak: stats.currentStreak ?? 0,
        longestStreak: stats.longestStreak ?? 0,
        lastStudiedChapterId: stats.lastStudiedChapterId,
        lastStudiedChapterTitle: stats.lastStudiedChapterTitle,
        recentActivity: activity,
        subjectProgress,
      } satisfies DashboardSummary;
    },
  });
}

function emptySummary(activity: ActivityEntry[]): DashboardSummary {
  return {
    notesCompleted: 0,
    notesInProgress: 0,
    mcqsAttempted: 0,
    mcqsCompleted: 0,
    accuracyPercent: 0,
    experimentsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudiedChapterId: null,
    lastStudiedChapterTitle: null,
    recentActivity: activity,
    subjectProgress: [],
  };
}
