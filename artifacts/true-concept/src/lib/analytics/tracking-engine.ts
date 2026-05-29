/**
 * Centralized Analytics Tracking Engine
 *
 * Every meaningful student learning event MUST pass through this engine.
 * The engine is a singleton — call TrackingEngine.getInstance() everywhere.
 *
 * Responsibilities:
 *   1. Maintain the current study session lifecycle
 *   2. Dispatch events to the correct sub-services (question, mastery, profile)
 *   3. Update session counters on each event
 *   4. Trigger knowledge profile rebuild after significant events
 *
 * Why a singleton engine instead of calling services directly:
 *   - Single place to add cross-cutting concerns (rate limits, error handling)
 *   - Session counter updates are always in sync with events
 *   - Future: swap to server-side tracking without changing call sites
 */

import {
  startSession,
  endSession,
  sessionNoteOpened,
  sessionNoteCompleted,
  sessionQuestionAnswered,
  sessionExperimentStarted,
  sessionInteraction,
  onVisibilityHidden,
  onVisibilityVisible,
} from "./session-service";
import { logActivity } from "@/lib/progress/activity-service";
import { recordQuestionAnswer } from "./question-service";
import { onNoteCompleted, onMcqAttempted } from "./mastery-service";
import {
  onExperimentStarted,
  onExperimentCompleted,
  onLabQuizAttempted,
} from "./experiment-mastery-service";
import type { ExperimentCompletionSignal } from "./types";
import { buildProfile } from "./knowledge-profile-service";

// ── Event types ───────────────────────────────────────────────────────────────

export type EngineEvent =
  | {
      type: "note_opened";
      uid: string;
      noteId: string;
      chapterId: string;
      subjectId: string;
      noteTitle?: string;
      chapterTitle?: string;
      subjectName?: string;
    }
  | {
      type: "note_completed";
      uid: string;
      noteId: string;
      chapterId: string;
      subjectId: string;
      chapterTitle: string;
      subjectName: string;
      classLevel?: string | null;
      medium?: string;
      readingTimeMs: number;
      totalNotesInChapter?: number;
    }
  | {
      type: "question_answered";
      uid: string;
      questionId: string;
      chapterId: string;
      subjectId: string;
      isCorrect: boolean;
      /** Set within the chapter this question belongs to (1, 2, …). Lets the AI mentor scope
       *  weak-question lists and per-set accuracy when suggesting what to study next. */
      setNumber?: number;
    }
  | {
      type: "mcq_set_completed";
      uid: string;
      chapterId: string;
      subjectId: string;
      chapterTitle: string;
      subjectName: string;
      classLevel?: string | null;
      medium?: string;
      score: number;          // 0-100
      totalCorrect: number;
      totalAttempted: number;
    }
  | {
      type: "experiment_started";
      uid: string;
      experimentId: string;
      experimentTitle: string;
      subjectId: string;
      subjectName: string;
      chapterId?: string | null;
    }
  | {
      type: "experiment_completed";
      uid: string;
      experimentId: string;
      experimentTitle: string;
      subjectId: string;
      subjectName: string;
      chapterId?: string | null;
      signal: ExperimentCompletionSignal;   // "journey" | "interaction" | "quiz"
    }
  | {
      type: "lab_quiz_completed";
      uid: string;
      experimentId: string;
      experimentTitle: string;
      subjectId: string;
      subjectName: string;
      chapterId?: string | null;
      score: number;          // 0-100
      totalCorrect: number;
      totalAttempted: number;
    }
  | {
      type: "qa_viewed";
      uid: string;
      qaId: string;
      chapterId: string;
      subjectId: string;
      chapterTitle?: string;
      subjectName?: string;
    }
  | {
      type: "video_played";
      uid: string;
      youtubeId: string;
      noteId?: string;
      chapterId: string;
      subjectId: string;
      chapterTitle?: string;
      subjectName?: string;
    };

// ── Singleton ─────────────────────────────────────────────────────────────────

class TrackingEngine {
  private static _instance: TrackingEngine;

  private _currentUid: string | null = null;
  private _visibilityBound = false;

  static getInstance(): TrackingEngine {
    if (!TrackingEngine._instance) {
      TrackingEngine._instance = new TrackingEngine();
    }
    return TrackingEngine._instance;
  }

  // ── Session management ──────────────────────────────────────────────────────

  /**
   * Initialize the engine for a signed-in student. Call this once on login /
   * app mount. Subsequent calls for the same uid are no-ops.
   */
  async init(uid: string): Promise<void> {
    if (this._currentUid === uid) return;
    if (this._currentUid && this._currentUid !== uid) {
      // Different user — end previous session first
      await endSession();
    }

    this._currentUid = uid;
    await startSession(uid);
    this._bindVisibility();
  }

  /** Tear down session on logout / app unmount. */
  async teardown(): Promise<void> {
    await endSession();
    this._currentUid = null;
    this._unbindVisibility();
  }

  private _bindVisibility(): void {
    if (this._visibilityBound || typeof document === "undefined") return;
    this._visibilityBound = true;

    document.addEventListener("visibilitychange", this._onVisibility);
    window.addEventListener("beforeunload", this._onBeforeUnload);
  }

  private _unbindVisibility(): void {
    if (!this._visibilityBound) return;
    this._visibilityBound = false;
    document.removeEventListener("visibilitychange", this._onVisibility);
    window.removeEventListener("beforeunload", this._onBeforeUnload);
  }

  private readonly _onVisibility = (): void => {
    if (document.hidden) {
      onVisibilityHidden();
    } else {
      onVisibilityVisible();
    }
  };

  private readonly _onBeforeUnload = (): void => {
    // Synchronous — just flush timers, full end happens async best-effort
    void endSession();
  };

  // ── Event dispatch ──────────────────────────────────────────────────────────

  /**
   * Primary public API. Call track() for every student learning event.
   * All calls are fire-and-forget (returns void).
   */
  track(event: EngineEvent): void {
    void this._dispatch(event);
  }

  private async _dispatch(event: EngineEvent): Promise<void> {
    try {
      switch (event.type) {

        case "note_opened":
          sessionNoteOpened(event.chapterId);
          break;

        case "note_completed":
          sessionNoteCompleted();
          void onNoteCompleted({
            uid:                 event.uid,
            chapterId:           event.chapterId,
            subjectId:           event.subjectId,
            chapterTitle:        event.chapterTitle,
            subjectName:         event.subjectName,
            classLevel:          event.classLevel,
            medium:              event.medium,
            readingTimeMs:       event.readingTimeMs,
            totalNotesInChapter: event.totalNotesInChapter,
          });
          break;

        case "question_answered":
          sessionQuestionAnswered(event.isCorrect);
          void recordQuestionAnswer({
            uid:        event.uid,
            questionId: event.questionId,
            chapterId:  event.chapterId,
            subjectId:  event.subjectId,
            isCorrect:  event.isCorrect,
            setNumber:  event.setNumber,
          });
          break;

        case "mcq_set_completed":
          void onMcqAttempted({
            uid:           event.uid,
            chapterId:     event.chapterId,
            subjectId:     event.subjectId,
            chapterTitle:  event.chapterTitle,
            subjectName:   event.subjectName,
            classLevel:    event.classLevel,
            medium:        event.medium,
            score:         event.score,
            totalCorrect:  event.totalCorrect,
            totalAttempted: event.totalAttempted,
          });
          // Rebuild AI profile after MCQ set (primary learning signal)
          buildProfile(event.uid);
          break;

        case "experiment_started":
          sessionExperimentStarted();
          void onExperimentStarted({
            uid:             event.uid,
            experimentId:    event.experimentId,
            experimentTitle: event.experimentTitle,
            subjectId:       event.subjectId,
            subjectName:     event.subjectName,
            chapterId:       event.chapterId,
          });
          break;

        case "experiment_completed":
          void onExperimentCompleted({
            uid:             event.uid,
            experimentId:    event.experimentId,
            experimentTitle: event.experimentTitle,
            subjectId:       event.subjectId,
            subjectName:     event.subjectName,
            chapterId:       event.chapterId,
            signal:          event.signal,
          });
          // Rebuild AI profile after lab completion so Mentor sees the new state
          buildProfile(event.uid);
          break;

        case "lab_quiz_completed":
          void onLabQuizAttempted({
            uid:             event.uid,
            experimentId:    event.experimentId,
            experimentTitle: event.experimentTitle,
            subjectId:       event.subjectId,
            subjectName:     event.subjectName,
            chapterId:       event.chapterId,
            score:           event.score,
            totalCorrect:    event.totalCorrect,
            totalAttempted:  event.totalAttempted,
          });
          buildProfile(event.uid);
          break;

        case "qa_viewed":
          void logActivity(event.uid, {
            type: "qa_viewed",
            refId: event.qaId,
            refTitle: event.chapterTitle ? `Q&A — ${event.chapterTitle}` : "Q&A",
            chapterId: event.chapterId,
            chapterTitle: event.chapterTitle,
            subjectId: event.subjectId,
            subjectName: event.subjectName,
          });
          sessionInteraction();
          break;

        case "video_played":
          void logActivity(event.uid, {
            type: "video_played",
            refId: event.noteId ?? event.youtubeId,
            refTitle: event.chapterTitle ? `Video — ${event.chapterTitle}` : "Video",
            chapterId: event.chapterId,
            chapterTitle: event.chapterTitle,
            subjectId: event.subjectId,
            subjectName: event.subjectName,
          });
          sessionInteraction();
          break;
      }
    } catch {
      // Tracking failures must NEVER propagate to the UI
    }
  }
}

// ── Exported singleton accessor ───────────────────────────────────────────────

export const tracker = TrackingEngine.getInstance();
