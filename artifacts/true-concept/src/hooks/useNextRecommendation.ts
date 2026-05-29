/**
 * useNextRecommendation — fetches the deterministic next-best-action from
 * the rule engine (Phase 7C). Powers the AI Mentor's second card.
 *
 * Cheap (~5 Firestore reads server-side, no AI call), so we refetch on
 * window focus and stale-while-revalidate every 60 seconds.
 */

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface BilingualField<T> { en: T; as: T; }

export type RecKind =
  | "unread_note"
  | "note_video"
  | "lab"
  | "lab_quiz"
  | "chapter_mcq"
  | "qna"
  | "qna_video"
  | "next_chapter"
  | "all_caught_up";

export interface NextRecommendation {
  kind: RecKind;
  rung: number;
  target: {
    id: string;
    title: BilingualField<string>;
    chapterId?: string;
    chapterTitle?: BilingualField<string>;
    subjectId?: string;
    subjectName?: BilingualField<string>;
    ctaUrl: string;
    youtubeId?: string;
  };
  reason: BilingualField<string>;
  emoji?: string;
  bilingualReady: boolean;
  generatedAt: string;
}

// Mirror the pattern in useAiRecommendations — dev hits the deployed
// Cloud Function URL directly, prod uses Firebase Hosting rewrite.
const AI_BASE = import.meta.env.DEV
  ? "https://asia-south1-true-concept-353c9.cloudfunctions.net/aiMentor"
  : "";

const REFRESH_INTERVAL_MS = 60 * 1000;

export function useNextRecommendation() {
  const { user } = useAuth();
  const [data, setData] = useState<NextRecommendation | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRec = useCallback(async (forceFresh = false) => {
    if (!user || user.role !== "student") return;
    setLoading(true);
    setError(null);
    try {
      // When user manually refreshes, also clear cached AI narration so we get
      // freshly worded copy from Gemini instead of the 7d-cached version.
      if (forceFresh) {
        await fetch(`${AI_BASE}/api/ai/next-recommendation/refresh`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("trueconcept_token")}` },
        }).catch(() => { /* non-fatal */ });
      }

      const res = await fetch(`${AI_BASE}/api/ai/next-recommendation`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("trueconcept_token")}` },
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`);
      }
      const json = await res.json() as NextRecommendation;
      setData(json);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("[useNextRecommendation]", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch on mount + on user change
  useEffect(() => {
    if (user?.role === "student") void fetchRec();
  }, [user?.id, fetchRec]);

  // Refetch on window focus (student likely just took an MCQ / finished a lab)
  useEffect(() => {
    if (!user || user.role !== "student") return;
    const onFocus = () => { void fetchRec(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [user?.id, fetchRec]);

  // Background refresh while card is mounted
  useEffect(() => {
    if (!user || user.role !== "student") return;
    const id = setInterval(() => { void fetchRec(); }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user?.id, fetchRec]);

  return {
    data,
    isLoading,
    error,
    refresh: () => fetchRec(true),   // user-initiated refresh = fresh AI text
  };
}
