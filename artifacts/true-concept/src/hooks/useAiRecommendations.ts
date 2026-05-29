import { useState, useEffect, useCallback, useRef } from "react";
import { doc, onSnapshot, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface AiRecommendation {
  priority: number;
  type: "revision" | "retry" | "study" | "practice";
  icon: string;
  title: string;
  message: string;
  actionLabel: string;
  chapterId: string | null;
}

export interface AiMentorData {
  greeting: string;
  examReadinessMessage: string;
  examReadinessScore: number;
  topRecommendations: AiRecommendation[];
  weakTopicAlert: string | null;
  revisionAlert: string | null;
  motivationalMessage: string;
  nextBestAction: {
    message: string;
    chapterId: string | null;
    tab: "notes" | "mcq" | "qa" | null;
  };
  generatedAt: Timestamp;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// In dev mode call the deployed production Cloud Function directly — bypasses
// all local proxy / emulator complexity. In production the relative URL is
// rewritten to the aiMentor function by Firebase Hosting.
const AI_BASE = import.meta.env.DEV
  ? "https://asia-south1-true-concept-353c9.cloudfunctions.net/aiMentor"
  : "";

export function useAiRecommendations() {
  const { user } = useAuth();
  const [data, setData]       = useState<AiMentorData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isPending, setPending] = useState(false); // profile not ready yet
  const [error, setError]     = useState<string | null>(null);
  // Ref so the Firestore listener can trigger a refetch without re-binding on
  // every state change (which would tear down + reattach the snapshot).
  const fetchRecommendationsRef = useRef<((force?: boolean) => Promise<void>) | null>(null);

  // ── Real-time Firestore listener on cached recommendation ─────────────────
  // The knowledge-profile trigger deletes this doc whenever the student's
  // profile rebuilds (after an MCQ etc.) — we react by clearing local cache
  // and refetching fresh data so the AI reflects new performance immediately.
  useEffect(() => {
    if (!user || user.role !== "student") return;

    const ref = doc(db, "aiRecommendations", user.id);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data() as AiMentorData);
        setPending(false);
      } else if (data) {
        // Doc was deleted server-side (profile rebuilt). Drop the stale
        // React state so the next fetch is allowed through the TTL guard.
        setData(null);
        void fetchRecommendationsRef.current?.();
      }
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── Fetch from Cloud Function (calls Gemini, caches result) ───────────────
  const fetchRecommendations = useCallback(async (force = false) => {
    if (!user || user.role !== "student") return;

    // Don't re-fetch if data is fresh and not forced
    if (!force && data?.generatedAt) {
      const ageMs = Date.now() - (data.generatedAt as Timestamp).toMillis();
      if (ageMs < CACHE_TTL_MS) return;
    }

    setLoading(true);
    setError(null);

    try {
      if (force) {
        // Clear cache first so the function regenerates
        await fetch(`${AI_BASE}/api/ai/mentor/refresh`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("trueconcept_token")}` } });
      }

      const res = await fetch(`${AI_BASE}/api/ai/mentor`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("trueconcept_token")}` },
      });

      console.log("[AI Mentor] response status:", res.status, res.url);

      if (res.status === 202) {
        setPending(true);
        return;
      }

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`);
      }

      const json = await res.json() as AiMentorData;
      setData(json);
      setPending(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("[useAiRecommendations]", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, data?.generatedAt]);

  // Keep the ref pointing at the latest fetchRecommendations so the snapshot
  // listener can invoke it without re-binding the listener.
  fetchRecommendationsRef.current = fetchRecommendations;

  // Auto-fetch on mount and when user logs in
  useEffect(() => {
    if (user?.role === "student") {
      void fetchRecommendations();
    }
  }, [user?.id]);

  return {
    data,
    isLoading,
    isPending,
    error,
    refresh: () => fetchRecommendations(true),
  };
}
