import {
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  increment,
  type Timestamp,
} from "firebase/firestore";
import { questionResultDoc, questionResultsCol } from "./paths";
import type { QuestionResult } from "./types";

// Accuracy threshold below which a question surfaces in "retry" suggestions
export const RETRY_ACCURACY_THRESHOLD = 50;

/**
 * Records a student's answer to a single MCQ question.
 *
 * Call this on every individual question answer (inside handleSelect),
 * NOT only at the end of the quiz. This gives per-question resolution for:
 *   - "You got this question wrong 3 times"
 *   - Spaced repetition readiness
 *   - Weak question detection
 */
export async function recordQuestionAnswer(args: {
  uid: string;
  questionId: string;
  chapterId: string;
  subjectId: string;
  isCorrect: boolean;
  setNumber?: number;
}): Promise<void> {
  const ref = questionResultDoc(args.uid, args.questionId);

  try {
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const initial: QuestionResult = {
        questionId: args.questionId,
        chapterId: args.chapterId,
        subjectId: args.subjectId,
        totalAttempts: 1,
        correctAttempts: args.isCorrect ? 1 : 0,
        wrongAttempts: args.isCorrect ? 0 : 1,
        accuracy: args.isCorrect ? 100 : 0,
        // serverTimestamp() returns FieldValue, but the QuestionResult shape
        // expects Timestamp because that's what the document holds once Firestore
        // resolves the placeholder server-side. Safe cast.
        lastAttemptedAt: serverTimestamp() as unknown as Timestamp,
        lastResult: args.isCorrect ? "correct" : "wrong",
        consecutiveCorrect: args.isCorrect ? 1 : 0,
        consecutiveWrong: args.isCorrect ? 0 : 1,
        ...(typeof args.setNumber === "number" ? { setNumber: args.setNumber } : {}),
      };
      await setDoc(ref, { ...initial, lastAttemptedAt: serverTimestamp() });
      return;
    }

    const cur = snap.data() as QuestionResult;
    const newTotal = (cur.totalAttempts ?? 0) + 1;
    const newCorrect = (cur.correctAttempts ?? 0) + (args.isCorrect ? 1 : 0);
    const newAccuracy = Math.round((newCorrect / newTotal) * 100);

    const newConsecutiveCorrect = args.isCorrect ? (cur.consecutiveCorrect ?? 0) + 1 : 0;
    const newConsecutiveWrong  = args.isCorrect ? 0 : (cur.consecutiveWrong ?? 0) + 1;

    await updateDoc(ref, {
      totalAttempts:      increment(1),
      correctAttempts:    increment(args.isCorrect ? 1 : 0),
      wrongAttempts:      increment(args.isCorrect ? 0 : 1),
      accuracy:           newAccuracy,
      lastAttemptedAt:    serverTimestamp(),
      lastResult:         args.isCorrect ? "correct" : "wrong",
      ...(typeof args.setNumber === "number" ? { setNumber: args.setNumber } : {}),
      consecutiveCorrect: newConsecutiveCorrect,
      consecutiveWrong:   newConsecutiveWrong,
    });
  } catch {
    // Question tracking failure must never break the quiz flow
  }
}

/**
 * Fetches all question results for a chapter.
 * Used by the knowledge profile builder to find retry candidates.
 */
export async function fetchQuestionResultsForChapter(
  uid: string,
  chapterId: string
): Promise<QuestionResult[]> {
  const q = query(questionResultsCol(uid), where("chapterId", "==", chapterId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as QuestionResult);
}

/**
 * Fetches ALL question results for a student.
 * Used by the knowledge profile builder to assemble retry suggestions.
 */
export async function fetchAllQuestionResults(uid: string): Promise<QuestionResult[]> {
  const snap = await getDocs(questionResultsCol(uid));
  return snap.docs.map((d) => d.data() as QuestionResult);
}

/**
 * Returns questions that should be retried (accuracy < threshold, ≥ 2 attempts).
 * The result is already sorted by accuracy ascending (worst first).
 */
export function filterRetryQuestions(
  results: QuestionResult[],
  threshold = RETRY_ACCURACY_THRESHOLD
): QuestionResult[] {
  return results
    .filter((q) => q.totalAttempts >= 2 && q.accuracy < threshold)
    .sort((a, b) => a.accuracy - b.accuracy);
}
