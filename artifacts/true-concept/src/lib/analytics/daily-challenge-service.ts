/**
 * Daily Challenge Service
 *
 * Generates a personalised 10-question MCQ set each calendar day, weighted
 * toward the student's weakest chapters. The same set is served for the
 * entire day (stored in Firestore so refresh / device-switch gives the same
 * questions). New MCQ sets added by admin are automatically included the next
 * day because we always query the live `mcqs` collection.
 *
 * Selection algorithm (10 questions):
 *   4 — from the student's 3 weakest chapters  (low masteryScore)
 *   3 — from chapters not touched in ≥7 days   (revision)
 *   2 — random from any available chapter      (discovery)
 *   1 — from a 4th weak chapter or random      (variety)
 *
 * If the pool is too small for any bucket, remaining slots are filled from
 * whatever is available.
 */

import {
  getDoc, setDoc, updateDoc, getDocs,
  collection, query, where, orderBy, limit,
  serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { dailyChallengeDoc } from "./paths";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChallengeQuestion {
  mcqId:        string;
  chapterId:    string;
  chapterTitle: string;
  subjectName:  string;
  question:     string;
  options:      string[];
  correctIndex: number;
  explanation:  string;
}

export type ChallengeStatus = "pending" | "in_progress" | "completed";

export interface DailyChallenge {
  dateKey:        string;           // "YYYY-MM-DD"
  questions:      ChallengeQuestion[];
  status:         ChallengeStatus;
  answers:        Record<number, number>; // questionIndex → chosen option
  correctCount:   number;
  totalQuestions: number;
  score:          number;           // 0-100
  startedAt:      Timestamp | null;
  completedAt:    Timestamp | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// ── Main API ──────────────────────────────────────────────────────────────────

/** Load today's challenge, generating it if it doesn't exist yet. */
export async function loadOrGenerateDailyChallenge(
  uid: string,
  classLevel: string,
  board?: string | null,
): Promise<DailyChallenge | null> {
  const dateKey = getTodayKey();
  const ref     = dailyChallengeDoc(uid, dateKey);

  // Return cached challenge if it exists
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as DailyChallenge;

  // Generate a new challenge
  const questions = await generateQuestions(uid, classLevel, board);
  if (questions.length === 0) return null;

  const challenge: DailyChallenge = {
    dateKey,
    questions,
    status:         "pending",
    answers:        {},
    correctCount:   0,
    totalQuestions: questions.length,
    score:          0,
    startedAt:      null,
    completedAt:    null,
  };
  await setDoc(ref, challenge);
  return challenge;
}

/** Mark challenge as started (first question opened). */
export async function markChallengeStarted(uid: string): Promise<void> {
  const ref = dailyChallengeDoc(uid, getTodayKey());
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data()?.startedAt) return;
  await updateDoc(ref, { status: "in_progress", startedAt: serverTimestamp() });
}

/** Save a student's answer and return the updated answers map. */
export async function saveAnswer(
  uid: string,
  questionIndex: number,
  chosenOption: number,
): Promise<void> {
  const ref = dailyChallengeDoc(uid, getTodayKey());
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as DailyChallenge;
  const answers = { ...data.answers, [questionIndex]: chosenOption };
  await updateDoc(ref, { answers });
}

/** Finalise the challenge, compute score, persist result. */
export async function submitChallenge(
  uid: string,
  answers: Record<number, number>,
  questions: ChallengeQuestion[],
): Promise<{ correctCount: number; score: number }> {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct++;
  });
  const score = Math.round((correct / questions.length) * 100);
  const ref   = dailyChallengeDoc(uid, getTodayKey());
  await updateDoc(ref, {
    status:       "completed",
    answers,
    correctCount: correct,
    score,
    completedAt:  serverTimestamp(),
  });
  return { correctCount: correct, score };
}

/** Fetch the last N daily challenge results for history display. */
export async function fetchChallengeHistory(
  uid: string,
  maxDays = 7,
): Promise<DailyChallenge[]> {
  const col  = collection(db, "studentProgress", uid, "dailyChallenges");
  const snap = await getDocs(query(col, orderBy("dateKey", "desc"), limit(maxDays)));
  return snap.docs.map((d) => d.data() as DailyChallenge);
}

// ── Question generation ───────────────────────────────────────────────────────

async function generateQuestions(
  uid: string,
  classLevel: string,
  board?: string | null,
): Promise<ChallengeQuestion[]> {
  // 1. Fetch ALL chapters (no class filter). Admin-created MCQ docs only store
  // `chapterId` — they have no `classLevel` — so the only way to know an MCQ's
  // class is via the chapter it belongs to. We tag each chapter with its class
  // and PREFER the student's class, but never exclude other classes outright;
  // otherwise a class mismatch would leave the challenge permanently empty.
  const chapSnap = await getDocs(collection(db, "chapters"));
  if (chapSnap.empty) return [];

  type ChapMeta = { id: string; title: string; subjectName: string; classLevel: string; board: string; lastStudiedMs: number; masteryScore: number };
  const everyChapterRaw: ChapMeta[] = chapSnap.docs.map((d) => ({
    id:          d.id,
    title:       (d.data().title as string) ?? "",
    subjectName: (d.data().subjectName as string) ?? "",
    classLevel:  (d.data().classLevel as string) ?? "",
    board:       (d.data().board as string) ?? "Both",
    lastStudiedMs: 0,
    masteryScore: 100, // default — not studied yet chapters are discovery candidates
  }));

  // Exclude chapters whose board doesn't match the student's board (CBSE content
  // is never shown to SEBA students). "Both" chapters always pass.
  const everyChapter = everyChapterRaw.filter(
    (c) => !board || c.board === "Both" || c.board === board);

  // Prefer the student's own class; keep the rest as cross-class fallback pool.
  const sameClass  = everyChapter.filter((c) => c.classLevel === classLevel);
  const otherClass = everyChapter.filter((c) => c.classLevel !== classLevel);
  const allChapters: ChapMeta[] = sameClass.length > 0 ? sameClass : everyChapter;

  // 2. Overlay student mastery data
  const masterySnap = await getDocs(
    collection(db, "studentProgress", uid, "chapterMastery"),
  );
  const masteryMap = new Map<string, { score: number; lastMs: number }>();
  masterySnap.docs.forEach((d) => {
    const data = d.data();
    const ts   = data.lastStudiedAt;
    const ms   = ts?.toMillis ? ts.toMillis() : 0;
    masteryMap.set(d.id, { score: data.masteryScore ?? 0, lastMs: ms });
  });

  for (const ch of allChapters) {
    const m = masteryMap.get(ch.id);
    if (m) {
      ch.masteryScore  = m.score;
      ch.lastStudiedMs = m.lastMs;
    }
  }

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  // Buckets
  const studiedChapters = allChapters.filter((c) => masteryMap.has(c.id));
  const weakChapters    = [...studiedChapters]
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .slice(0, 5); // bottom 5 mastery
  const staleChapters   = studiedChapters.filter(
    (c) => c.lastStudiedMs > 0 && now - c.lastStudiedMs >= sevenDaysMs,
  );

  // 3. Fetch MCQs per bucket and build the pool
  const TOTAL = 10;
  const picked = new Set<string>(); // mcqIds already picked
  const result: ChallengeQuestion[] = [];

  async function fetchFromChapters(
    chapters: ChapMeta[],
    want: number,
  ): Promise<void> {
    if (want <= 0 || chapters.length === 0) return;
    const candidates: ChallengeQuestion[] = [];
    for (const ch of chapters) {
      const mcqSnap = await getDocs(
        query(collection(db, "mcqs"), where("chapterId", "==", ch.id), limit(10)),
      );
      for (const d of mcqSnap.docs) {
        if (picked.has(d.id)) continue;
        const data = d.data();
        if (!data.question || !Array.isArray(data.options)) continue;
        candidates.push({
          mcqId:        d.id,
          chapterId:    ch.id,
          chapterTitle: ch.title,
          subjectName:  ch.subjectName,
          question:     data.question as string,
          options:      data.options as string[],
          correctIndex: data.correctIndex as number,
          explanation:  (data.explanation as string) ?? "",
        });
      }
    }
    const chosen = pickN(candidates, want);
    chosen.forEach((q) => { picked.add(q.mcqId); result.push(q); });
  }

  // 4 from weakest studied chapters
  await fetchFromChapters(weakChapters.slice(0, 3), 4);
  // 3 from stale chapters
  await fetchFromChapters(staleChapters, 3);

  // Fill remaining from ANY same-class chapter. Iterate over ALL of them
  // (shuffled) rather than sampling a handful, because only a few chapters may
  // actually have MCQs uploaded — sampling 6 of 30 could miss every chapter
  // with questions and leave the challenge empty.
  if (TOTAL - result.length > 0) {
    await fetchFromChapters(shuffle(allChapters), TOTAL - result.length);
  }

  // Still short? Cross-fill from OTHER classes so the challenge is never empty
  // just because the student's own class has too few MCQs yet.
  if (TOTAL - result.length > 0 && otherClass.length > 0) {
    await fetchFromChapters(shuffle(otherClass), TOTAL - result.length);
  }

  // Final shuffle so subject order is mixed
  return shuffle(result).slice(0, TOTAL);
}
