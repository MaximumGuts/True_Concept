/**
 * Lab tracking context — wraps every /virtual-lab/* route with identity for
 * the analytics engine.
 *
 * Wiring:
 *   <LabTrackingRoute identity={{ experimentId, experimentTitle, subjectId, subjectName }}>
 *     <SomeLabModule />
 *   </LabTrackingRoute>
 *
 * On mount, fires `experiment_started` once. Inside the lab, components call
 * `useLabTracker()` to push completion / quiz events without rebuilding the
 * identity payload at every emit site.
 *
 * Completion heuristic (per Phase 7 spec):
 *   - recordInteraction(key) → auto-fires `experiment_completed` once the unique
 *     interaction set reaches 5 entries (signal: "interaction")
 *   - recordJourneyFinished() → fires immediately (signal: "journey")
 *   - recordQuizResult(...) → fires `lab_quiz_completed` (also implies completion)
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { tracker } from "./tracking-engine";
import type { ExperimentCompletionSignal } from "./types";

export interface LabIdentity {
  experimentId: string;
  experimentTitle: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string | null;   // wired by Phase 7B lab→chapter registry
}

interface LabTrackerCtx {
  identity: LabIdentity;
  /** Add a unique interaction key (e.g. organ id). Auto-fires completion at ≥5 unique. */
  recordInteraction: (key: string) => void;
  /** Mark the lab's guided journey/animation as finished. */
  recordJourneyFinished: () => void;
  /** Explicit completion emit. Use when the heuristic doesn't fit. */
  recordCompletion: (signal: ExperimentCompletionSignal) => void;
  /** Lab's built-in quiz finished. Routes to experimentMastery, not chapterMastery. */
  recordQuizResult: (args: { score: number; totalCorrect: number; totalAttempted: number }) => void;
}

const COMPLETION_INTERACTION_THRESHOLD = 5;

const LabTrackerContext = createContext<LabTrackerCtx | null>(null);

export function LabTrackingProvider({
  identity,
  children,
}: {
  identity: LabIdentity;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const uid = user?.id ?? null;

  // Refs survive re-renders so we never double-emit started/completed per route entry.
  const startedRef = useRef(false);
  const completionFiredRef = useRef(false);
  const interactionSet = useRef<Set<string>>(new Set());

  // Reset emit guards when the route changes to a different experiment
  useEffect(() => {
    startedRef.current = false;
    completionFiredRef.current = false;
    interactionSet.current = new Set();
  }, [identity.experimentId]);

  // Fire experiment_started exactly once per (uid, experimentId) mount
  useEffect(() => {
    if (!uid || startedRef.current) return;
    startedRef.current = true;
    tracker.track({
      type: "experiment_started",
      uid,
      experimentId:    identity.experimentId,
      experimentTitle: identity.experimentTitle,
      subjectId:       identity.subjectId,
      subjectName:     identity.subjectName,
      chapterId:       identity.chapterId ?? null,
    });
  }, [uid, identity.experimentId, identity.experimentTitle, identity.subjectId, identity.subjectName, identity.chapterId]);

  const recordCompletion = useCallback(
    (signal: ExperimentCompletionSignal) => {
      if (!uid || completionFiredRef.current) return;
      completionFiredRef.current = true;
      tracker.track({
        type: "experiment_completed",
        uid,
        experimentId:    identity.experimentId,
        experimentTitle: identity.experimentTitle,
        subjectId:       identity.subjectId,
        subjectName:     identity.subjectName,
        chapterId:       identity.chapterId ?? null,
        signal,
      });
    },
    [uid, identity.experimentId, identity.experimentTitle, identity.subjectId, identity.subjectName, identity.chapterId],
  );

  const recordInteraction = useCallback(
    (key: string) => {
      interactionSet.current.add(key);
      if (interactionSet.current.size >= COMPLETION_INTERACTION_THRESHOLD) {
        recordCompletion("interaction");
      }
    },
    [recordCompletion],
  );

  const recordJourneyFinished = useCallback(() => {
    recordCompletion("journey");
  }, [recordCompletion]);

  const recordQuizResult = useCallback(
    (args: { score: number; totalCorrect: number; totalAttempted: number }) => {
      if (!uid) return;
      tracker.track({
        type: "lab_quiz_completed",
        uid,
        experimentId:    identity.experimentId,
        experimentTitle: identity.experimentTitle,
        subjectId:       identity.subjectId,
        subjectName:     identity.subjectName,
        chapterId:       identity.chapterId ?? null,
        score:           args.score,
        totalCorrect:    args.totalCorrect,
        totalAttempted:  args.totalAttempted,
      });
    },
    [uid, identity.experimentId, identity.experimentTitle, identity.subjectId, identity.subjectName, identity.chapterId],
  );

  const value = useMemo<LabTrackerCtx>(
    () => ({ identity, recordInteraction, recordJourneyFinished, recordCompletion, recordQuizResult }),
    [identity, recordInteraction, recordJourneyFinished, recordCompletion, recordQuizResult],
  );

  return <LabTrackerContext.Provider value={value}>{children}</LabTrackerContext.Provider>;
}

/**
 * Convenience wrapper for App.tsx route definitions.
 *
 * <LabTrackingRoute
 *   experimentId="biology-animal-cell"
 *   experimentTitle="Animal Cell"
 *   subjectId="biology"
 *   subjectName="Biology"
 * >
 *   <AnimalCellLab />
 * </LabTrackingRoute>
 */
export function LabTrackingRoute({
  experimentId,
  experimentTitle,
  subjectId,
  subjectName,
  chapterId,
  children,
}: LabIdentity & { children: React.ReactNode }) {
  const identity = useMemo<LabIdentity>(
    () => ({ experimentId, experimentTitle, subjectId, subjectName, chapterId }),
    [experimentId, experimentTitle, subjectId, subjectName, chapterId],
  );
  return <LabTrackingProvider identity={identity}>{children}</LabTrackingProvider>;
}

/**
 * Used inside a lab sim. Returns no-op functions if called outside a
 * LabTrackingProvider (e.g. admin preview surface) so sims never crash.
 */
export function useLabTracker(): LabTrackerCtx {
  const ctx = useContext(LabTrackerContext);
  if (!ctx) {
    return {
      identity: {
        experimentId:    "unknown",
        experimentTitle: "Unknown",
        subjectId:       "unknown",
        subjectName:     "Unknown",
      },
      recordInteraction:      () => {},
      recordJourneyFinished:  () => {},
      recordCompletion:       () => {},
      recordQuizResult:       () => {},
    };
  }
  return ctx;
}
