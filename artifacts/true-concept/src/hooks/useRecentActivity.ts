import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchRecentActivity } from "@/lib/progress/activity-service";
import type { ActivityEntry } from "@/lib/progress/types";

/**
 * Returns the most recent 20 activity entries for the logged-in student.
 * Cached for 30 seconds to keep dashboard renders cheap.
 */
export function useRecentActivity(): {
  activity: ActivityEntry[];
  isLoading: boolean;
} {
  const { user } = useAuth();

  const query = useQuery<ActivityEntry[]>({
    queryKey: ["recentActivity", user?.id],
    enabled: !!user && user.role === "student",
    queryFn: () => fetchRecentActivity(user!.id),
    staleTime: 30 * 1000,
  });

  return {
    activity: query.data ?? [],
    isLoading: query.isLoading,
  };
}
