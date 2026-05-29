import { useQuery } from "@tanstack/react-query";
import { getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { chapterMasteryCol, chapterMasteryDoc } from "@/lib/analytics/paths";
import { getDoc } from "firebase/firestore";
import type { ChapterMastery } from "@/lib/analytics/types";

/**
 * Returns the mastery data for a single chapter.
 * Used in chapter cards to show mastery status / score badge.
 */
export function useChapterMastery(chapterId: string | null) {
  const { user } = useAuth();

  return useQuery<ChapterMastery | null>({
    queryKey: ["chapterMastery", user?.id, chapterId],
    enabled: !!user && user.role === "student" && !!chapterId,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const snap = await getDoc(chapterMasteryDoc(user!.id, chapterId!));
      return snap.exists() ? (snap.data() as ChapterMastery) : null;
    },
  });
}

/**
 * Returns mastery data for all chapters the student has interacted with.
 * Keyed by chapterId for fast lookup.
 *
 * Used in subject-detail page to show per-chapter mastery badges.
 */
export function useAllChapterMastery() {
  const { user } = useAuth();

  const query = useQuery<ChapterMastery[]>({
    queryKey: ["allChapterMastery", user?.id],
    enabled: !!user && user.role === "student",
    staleTime: 60 * 1000, // 1 min — mastery changes slowly
    queryFn: async () => {
      const snap = await getDocs(chapterMasteryCol(user!.id));
      return snap.docs.map((d) => d.data() as ChapterMastery);
    },
  });

  const byChapterId = (query.data ?? []).reduce<Record<string, ChapterMastery>>((acc, m) => {
    acc[m.chapterId] = m;
    return acc;
  }, {});

  return {
    masteries: query.data ?? [],
    masteryByChapterId: byChapterId,
    isLoading: query.isLoading,
  };
}
