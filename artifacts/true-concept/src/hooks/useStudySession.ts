import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { tracker } from "@/lib/analytics";

/**
 * Manages the study session lifecycle for the current student.
 *
 * Mount this hook ONCE at the app root (inside AuthProvider).
 * It will:
 *   - Initialize the tracking engine when a student logs in
 *   - Tear down the session on logout or tab close
 *   - Handle tab visibility changes (pauses active-time accumulation)
 *
 * For admins this hook is a no-op.
 */
export function useStudySession(): void {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "student") return;

    void tracker.init(user.id);

    return () => {
      void tracker.teardown();
    };
  }, [user?.id, user?.role]);
}
