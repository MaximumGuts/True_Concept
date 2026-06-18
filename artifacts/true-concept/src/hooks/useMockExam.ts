import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDocs, addDoc, query, collection, where, orderBy, limit,
  serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mockExamSessionsCol } from "@/lib/analytics/paths";
import { awardXP } from "@/lib/gamification/xp-service";
import { XP_VALUES } from "@/lib/gamification/xp-config";

export interface MockExamQuestion {
  mcqId:        string;
  chapterId:    string;
  chapterTitle: string;
  subjectName:  string;
  question:     string;
  options:      string[];
  correctIndex: number;
  explanation:  string;
}

export type MockExamMode = "strict" | "practice";

export interface MockExamSession {
  sessionId:        string;
  classLevel:       string;
  mode:             MockExamMode;
  totalQuestions:   number;
  correctCount:     number;
  score:            number;
  timeTakenMs:      number;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
  completedAt:      Timestamp | null;
  dateKey:          string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Fetch up to 50 MCQs for a given class (and optional subject), distributed
 *  across chapters. Prefers the student's class but cross-fills from other
 *  classes if needed. When subjectId is given, only chapters from that subject
 *  are used — enabling subject-specific exam mode. */
export async function generateMockExamQuestions(
  classLevel: string,
  subjectId?: string,
  board?: string | null,
): Promise<MockExamQuestion[]> {
  // Admin MCQ docs carry no classLevel — only chapterId — so we must join
  // through chapters. Fetch ALL chapters and prefer the student's class.
  const chapSnap = await getDocs(collection(db, "chapters"));
  if (chapSnap.empty) return [];

  type ChapMeta = { id: string; title: string; subjectName: string; subjectId: string; classLevel: string; board: string };
  const everyChapterRaw: ChapMeta[] = chapSnap.docs.map((d) => ({
    id:          d.id,
    title:       (d.data().title as string) ?? "",
    subjectName: (d.data().subjectName as string) ?? "",
    subjectId:   (d.data().subjectId as string) ?? "",
    classLevel:  (d.data().classLevel as string) ?? "",
    board:       (d.data().board as string) ?? "Both",
  }));

  // Board filter — CBSE content never shown to SEBA students (and vice versa).
  const everyChapter = everyChapterRaw.filter(
    (c) => !board || c.board === "Both" || c.board === board);

  // Apply subject filter (if provided), then class preference.
  const subjFiltered = subjectId
    ? everyChapter.filter((c) => c.subjectId === subjectId)
    : everyChapter;
  const sameClass  = subjFiltered.filter((c) => c.classLevel === classLevel);
  const chapters   = sameClass.length > 0 ? sameClass : subjFiltered;
  const otherClass = subjFiltered.filter((c) => c.classLevel !== classLevel);

  const TARGET = 50;
  const picked = new Set<string>();
  const all: MockExamQuestion[] = [];

  // Fetch all MCQs for a list of chapters, grouped by subject, capped to `cap`.
  async function harvest(chapterList: ChapMeta[], cap: number): Promise<void> {
    if (all.length >= cap || chapterList.length === 0) return;
    const bySubject = new Map<string, ChapMeta[]>();
    for (const ch of chapterList) {
      const key = ch.subjectName || ch.subjectId || "General";
      if (!bySubject.has(key)) bySubject.set(key, []);
      bySubject.get(key)!.push(ch);
    }
    const perSubject = Math.ceil(cap / Math.max(1, bySubject.size));

    for (const [subjectName, subChapters] of bySubject) {
      const pool: MockExamQuestion[] = [];
      for (const ch of subChapters) {
        const mcqSnap = await getDocs(
          query(collection(db, "mcqs"), where("chapterId", "==", ch.id), limit(20)),
        );
        for (const d of mcqSnap.docs) {
          if (picked.has(d.id)) continue;
          const data = d.data();
          if (!data.question || !Array.isArray(data.options)) continue;
          pool.push({
            mcqId:        d.id,
            chapterId:    ch.id,
            chapterTitle: ch.title,
            subjectName,
            question:     data.question as string,
            options:      data.options as string[],
            correctIndex: data.correctIndex as number,
            explanation:  (data.explanation as string) ?? "",
          });
        }
      }
      shuffle(pool).slice(0, perSubject).forEach((q) => {
        if (all.length >= cap) return;
        picked.add(q.mcqId);
        all.push(q);
      });
    }
  }

  // Prefer same-class chapters, then cross-fill from other classes if short.
  await harvest(chapters, TARGET);
  if (all.length < TARGET && otherClass.length > 0) {
    await harvest(otherClass, TARGET);
  }

  return shuffle(all).slice(0, TARGET);
}

/** Save completed mock exam result to Firestore. */
export async function saveMockExamResult(
  uid: string,
  classLevel: string,
  mode: MockExamMode,
  questions: MockExamQuestion[],
  answers: Record<number, number>,
  timeTakenMs: number,
): Promise<string> {
  let correct = 0;
  const breakdown: Record<string, { correct: number; total: number }> = {};

  questions.forEach((q, i) => {
    const subj = q.subjectName;
    if (!breakdown[subj]) breakdown[subj] = { correct: 0, total: 0 };
    breakdown[subj].total++;
    if (answers[i] === q.correctIndex) {
      correct++;
      breakdown[subj].correct++;
    }
  });

  const score = Math.round((correct / questions.length) * 100);
  const col   = mockExamSessionsCol(uid);
  const ref   = await addDoc(col, {
    classLevel,
    mode,
    totalQuestions:   questions.length,
    correctCount:     correct,
    score,
    timeTakenMs,
    subjectBreakdown: breakdown,
    answers,
    completedAt:      serverTimestamp(),
    dateKey:          new Date().toISOString().slice(0, 10),
  });
  return ref.id;
}

/** Hook: load past mock exam sessions for the current user. */
export function useMockExamHistory(maxSessions = 10) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MockExamSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);
    getDocs(
      query(mockExamSessionsCol(user.id), orderBy("completedAt", "desc"), limit(maxSessions)),
    )
      .then((snap) =>
        setSessions(snap.docs.map((d) => ({ sessionId: d.id, ...d.data() } as MockExamSession))),
      )
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user?.id, maxSessions]);

  return { sessions, isLoading };
}

/** Hook: run a mock exam session (generate questions, timer, submit). */
export function useMockExamRunner(classLevel: string, mode: MockExamMode, subjectId?: string, board?: string | null) {
  const { user } = useAuth();
  const [questions, setQuestions]   = useState<MockExamQuestion[]>([]);
  const [answers, setAnswers]       = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading]   = useState(true);
  const [isSubmitted, setSubmitted] = useState(false);
  const [result, setResult]         = useState<{ correct: number; score: number; breakdown: Record<string, { correct: number; total: number }> } | null>(null);
  const [elapsedMs, setElapsedMs]   = useState(0);
  const startRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const THREE_HOURS_MS = 1 * 60 * 60 * 1000; // 1 hour strict mode timer

  useEffect(() => {
    generateMockExamQuestions(classLevel, subjectId, board)
      .then(setQuestions)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [classLevel, subjectId, board]);

  // Countdown timer for strict mode
  useEffect(() => {
    if (mode !== "strict" || isLoading || isSubmitted) return;
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setElapsedMs(elapsed);
      if (elapsed >= THREE_HOURS_MS) {
        clearInterval(timerRef.current!);
        void handleSubmit();
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isLoading, isSubmitted]);

  const selectAnswer = useCallback((optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIndex }));
  }, [currentIdx]);

  const next = useCallback(() => {
    setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
  }, [questions.length]);

  const prev = useCallback(() => {
    if (mode === "practice") setCurrentIdx((i) => Math.max(i - 1, 0));
  }, [mode]);

  const handleSubmit = useCallback(async () => {
    if (!user?.id || isSubmitted || questions.length === 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Date.now() - startRef.current;
    setSubmitted(true);

    let correct = 0;
    const breakdown: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const subj = q.subjectName;
      if (!breakdown[subj]) breakdown[subj] = { correct: 0, total: 0 };
      breakdown[subj].total++;
      if (answers[i] === q.correctIndex) { correct++; breakdown[subj].correct++; }
    });
    const score = Math.round((correct / questions.length) * 100);
    setResult({ correct, score, breakdown });

    try {
      await saveMockExamResult(user.id, classLevel, mode, questions, answers, timeTaken);
    } catch (err) {
      console.error("[useMockExamRunner] save failed:", err);
    }
    // Award XP for completing a mock exam
    const today = new Date().toISOString().slice(0, 10);
    void awardXP({
      uid: user.id, xp: XP_VALUES.MOCK_EXAM_COMPLETED,
      eventId: `mock-exam-${today}-${timeTaken}`, type: "mock_exam_completed",
      statDelta: { mockExamsDone: 1 },
    });
    if (score >= 75) {
      void awardXP({
        uid: user.id, xp: XP_VALUES.MOCK_EXAM_SCORE_75,
        eventId: `mock-exam-score75-${today}-${timeTaken}`, type: "mock_exam_score_75",
      });
    }
  }, [user?.id, isSubmitted, questions, answers, classLevel, mode]);

  const remainingMs = Math.max(0, THREE_HOURS_MS - elapsedMs);

  return {
    questions, answers, currentIdx, isLoading, isSubmitted, result,
    elapsedMs, remainingMs,
    selectAnswer, next, prev, submit: handleSubmit,
  };
}
