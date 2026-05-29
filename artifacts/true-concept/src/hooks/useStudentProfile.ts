import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchStudentProfile, type StudentProfile } from "@/lib/progress/profile-service";

/**
 * Returns the logged-in student's full profile (name, phone, class, medium, board).
 *
 * Backed by TanStack Query + a 1-hour localStorage cache, so this is essentially
 * free to call from any component — only the first call per session hits Firestore.
 *
 * Returns null while loading, or if the user is not a student.
 */
export function useStudentProfile() {
  const { user } = useAuth();

  const query = useQuery<StudentProfile | null>({
    queryKey: ["studentProfile", user?.id],
    enabled: !!user && user.role === "student",
    queryFn: () => fetchStudentProfile(user!.id),
    staleTime: 60 * 60 * 1000,        // 1 hour
    gcTime: 4 * 60 * 60 * 1000,       // keep in memory 4h
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
