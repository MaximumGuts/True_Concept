import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";

interface PlatformStats {
  totalChapters: number;
  totalMcqs: number;
}

/**
 * Platform-wide content totals for the landing page stats strip.
 * Backed by cheap Firestore .count() aggregations — safe to cache for a
 * while since these numbers only move when admins add content.
 */
export function usePlatformStats() {
  return useQuery<PlatformStats>({
    queryKey: ["/api/subjects/stats"],
    queryFn: () => customFetch<PlatformStats>("/api/subjects/stats"),
    staleTime: 60 * 60 * 1000,
  });
}
