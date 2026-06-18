import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import {
  loadOrGenerateDailyChallenge,
  markChallengeStarted,
  saveAnswer,
  submitChallenge,
  fetchChallengeHistory,
  getTodayKey,
  type DailyChallenge,
  type ChallengeQuestion,
} from "@/lib/analytics/daily-challenge-service";

export type { DailyChallenge, ChallengeQuestion };

export function useDailyChallenge() {
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const classLevel = prefs?.class ?? "Class IX";
    setIsLoading(true);
    setError(null);
    try {
      const ch = await loadOrGenerateDailyChallenge(user.id, classLevel, prefs?.board ?? null);
      setChallenge(ch);
    } catch (err) {
      console.error("[useDailyChallenge] load error:", err);
      setError("Could not load today's challenge. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, prefs?.class, prefs?.board]);

  useEffect(() => { void load(); }, [load]);

  const start = useCallback(async () => {
    if (!user?.id || !challenge) return;
    await markChallengeStarted(user.id);
    setChallenge((c) => c ? { ...c, status: "in_progress" } : c);
  }, [user?.id, challenge]);

  const answer = useCallback(async (questionIndex: number, chosen: number) => {
    if (!user?.id || !challenge) return;
    await saveAnswer(user.id, questionIndex, chosen);
    setChallenge((c) =>
      c ? { ...c, answers: { ...c.answers, [questionIndex]: chosen } } : c,
    );
  }, [user?.id, challenge]);

  const submit = useCallback(async (
    answers: Record<number, number>,
    questions: ChallengeQuestion[],
  ) => {
    if (!user?.id) return null;
    const result = await submitChallenge(user.id, answers, questions);
    setChallenge((c) =>
      c ? { ...c, status: "completed", ...result, completedAt: null } : c,
    );
    return result;
  }, [user?.id]);

  const todayKey = getTodayKey();
  const isCompleted = challenge?.status === "completed";
  const isPending   = challenge?.status === "pending";
  const isInProgress = challenge?.status === "in_progress";

  return {
    challenge, isLoading, error, todayKey,
    isCompleted, isPending, isInProgress,
    start, answer, submit, reload: load,
  };
}

export function useChallengeHistory(maxDays = 7) {
  const { user } = useAuth();
  const [history, setHistory] = useState<DailyChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);
    fetchChallengeHistory(user.id, maxDays)
      .then(setHistory)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user?.id, maxDays]);

  return { history, isLoading };
}
