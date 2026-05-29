import {
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { sessionsCol, sessionDoc } from "./paths";
import type { StudySession } from "./types";
import { todayLocalDate } from "@/lib/progress/streak";

// ── Module-level session state (survives re-renders, resets on page reload) ───

let _uid: string | null = null;
let _sessionId: string | null = null;
let _sessionStartMs: number = 0;
let _activeDurationMs: number = 0;
let _lastVisibleMs: number = 0;
let _sessionCounters = {
  chaptersVisited: [] as string[],
  notesOpened: 0,
  notesCompleted: 0,
  mcqsAttempted: 0,
  questionsCorrect: 0,
  experimentsStarted: 0,
};

// ── Idle / visibility tracking ────────────────────────────────────────────────

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 min of inactivity = new session
let _idleTimer: ReturnType<typeof setTimeout> | null = null;

function resetIdleTimer() {
  if (_idleTimer) clearTimeout(_idleTimer);
  _idleTimer = setTimeout(() => {
    // User has been idle 15 min — end current session silently
    void endSession().then(() => {
      _sessionId = null; // Next event will auto-start a new session
    });
  }, IDLE_TIMEOUT_MS);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Start a new study session for `uid`. Idempotent — if a session is already
 * active for this uid it's a no-op.
 */
export async function startSession(uid: string): Promise<string | null> {
  if (_sessionId && _uid === uid) return _sessionId;

  _uid = uid;
  _sessionStartMs = Date.now();
  _lastVisibleMs = Date.now();
  _activeDurationMs = 0;
  _sessionCounters = {
    chaptersVisited: [],
    notesOpened: 0,
    notesCompleted: 0,
    mcqsAttempted: 0,
    questionsCorrect: 0,
    experimentsStarted: 0,
  };

  try {
    const now = new Date();
    const ref = await addDoc(sessionsCol(uid), {
      uid,
      startedAt: serverTimestamp(),
      endedAt: null,
      durationMs: 0,
      activeDurationMs: 0,
      chaptersVisited: [],
      notesOpened: 0,
      notesCompleted: 0,
      mcqsAttempted: 0,
      questionsCorrect: 0,
      experimentsStarted: 0,
      accuracyThisSession: 0,
      date: todayLocalDate(),
      hourStarted: now.getHours(),
    });
    _sessionId = ref.id;
    resetIdleTimer();
    return _sessionId;
  } catch {
    return null; // Session tracking failure must never break the app
  }
}

/** Returns the current active session ID (or null if none). */
export function getCurrentSessionId(): string | null {
  return _sessionId;
}

/** Returns the current uid being tracked. */
export function getCurrentSessionUid(): string | null {
  return _uid;
}

/**
 * End the current session. Computes final duration and writes to Firestore.
 * Safe to call multiple times (idempotent after first call).
 */
export async function endSession(): Promise<void> {
  if (!_sessionId || !_uid) return;
  const sid = _sessionId;
  const uid = _uid;

  // Accumulate any remaining active time
  if (_lastVisibleMs > 0 && !document.hidden) {
    _activeDurationMs += Date.now() - _lastVisibleMs;
  }

  const totalMs = Date.now() - _sessionStartMs;
  const accuracy =
    _sessionCounters.mcqsAttempted > 0
      ? Math.round((_sessionCounters.questionsCorrect / _sessionCounters.mcqsAttempted) * 100)
      : 0;

  try {
    await updateDoc(sessionDoc(uid, sid), {
      endedAt: serverTimestamp(),
      durationMs: totalMs,
      activeDurationMs: _activeDurationMs,
      accuracyThisSession: accuracy,
      ..._sessionCounters,
    });
  } catch {
    // Non-fatal
  }

  _sessionId = null;
  _uid = null;
  if (_idleTimer) clearTimeout(_idleTimer);
}

/**
 * Called when the browser tab becomes hidden. Pauses active-time accumulation.
 */
export function onVisibilityHidden(): void {
  if (!_sessionId) return;
  _activeDurationMs += Date.now() - _lastVisibleMs;
  _lastVisibleMs = 0;
}

/**
 * Called when the browser tab becomes visible again. Resumes active-time
 * accumulation and resets idle timer.
 */
export function onVisibilityVisible(): void {
  if (!_sessionId) return;
  _lastVisibleMs = Date.now();
  resetIdleTimer();
}

// ── Incremental counter updates ────────────────────────────────────────────────
// These update the in-memory counters AND debounce Firestore writes so we
// don't write on every single question answer.

let _flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (_flushTimer) return;
  _flushTimer = setTimeout(() => {
    _flushTimer = null;
    void flushSessionCounters();
  }, 5000); // write accumulated counters every 5 sec
}

async function flushSessionCounters(): Promise<void> {
  if (!_sessionId || !_uid) return;
  try {
    await updateDoc(sessionDoc(_uid, _sessionId), {
      ..._sessionCounters,
    });
  } catch {
    // Non-fatal
  }
}

/** Increment session counter when a note is opened. */
export function sessionNoteOpened(chapterId: string): void {
  if (!_sessionId) return;
  _sessionCounters.notesOpened++;
  if (!_sessionCounters.chaptersVisited.includes(chapterId)) {
    _sessionCounters.chaptersVisited.push(chapterId);
  }
  resetIdleTimer();
  scheduleFlush();
}

/** Increment session counter when a note is completed. */
export function sessionNoteCompleted(): void {
  if (!_sessionId) return;
  _sessionCounters.notesCompleted++;
  resetIdleTimer();
  scheduleFlush();
}

/** Increment session counter when a question is answered. */
export function sessionQuestionAnswered(isCorrect: boolean): void {
  if (!_sessionId) return;
  _sessionCounters.mcqsAttempted++;
  if (isCorrect) _sessionCounters.questionsCorrect++;
  resetIdleTimer();
  scheduleFlush();
}

/**
 * Records any lightweight interaction that should reset the idle timer but
 * doesn't increment a named counter (e.g. Q&A view, video play).
 */
export function sessionInteraction(): void {
  if (!_sessionId) return;
  resetIdleTimer();
  scheduleFlush();
}

/** Increment session counter when an experiment is started. */
export function sessionExperimentStarted(): void {
  if (!_sessionId) return;
  _sessionCounters.experimentsStarted++;
  resetIdleTimer();
  scheduleFlush();
}

// ── Historical session query (for behavior analysis) ─────────────────────────

/** Returns the last N sessions for a student (for preferred-time analysis). */
export async function fetchRecentSessions(uid: string, count = 30): Promise<StudySession[]> {
  const q = query(sessionsCol(uid), orderBy("startedAt", "desc"), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ sessionId: d.id, ...d.data() } as StudySession));
}

/**
 * Computes daily active study time from sessions in the last N days.
 * Returns a map of YYYY-MM-DD → totalMs.
 */
export function buildDailyStudyMap(sessions: StudySession[], days = 30): Record<string, number> {
  const result: Record<string, number> = {};
  const cutoff = Date.now() - days * 86_400_000;

  for (const s of sessions) {
    const startMs =
      s.startedAt instanceof Timestamp
        ? s.startedAt.toMillis()
        : (s.startedAt as unknown as { seconds: number }).seconds * 1000;
    if (startMs < cutoff) continue;
    const date = s.date ?? todayLocalDate();
    result[date] = (result[date] ?? 0) + (s.activeDurationMs ?? 0);
  }

  return result;
}

/**
 * Computes the preferred study hour (0-23) from sessions.
 * Returns the hour with the most sessions.
 */
export function computePreferredStudyHour(sessions: StudySession[]): number {
  const hourCounts: number[] = new Array(24).fill(0);
  for (const s of sessions) {
    if (s.hourStarted >= 0 && s.hourStarted < 24) {
      hourCounts[s.hourStarted]++;
    }
  }
  return hourCounts.indexOf(Math.max(...hourCounts));
}
