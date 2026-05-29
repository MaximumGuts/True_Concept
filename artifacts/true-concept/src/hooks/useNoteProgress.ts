import { useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  markNoteOpened,
  updateScrollProgress,
  markNoteCompleted,
  fetchNotesProgressForChapter,
} from "@/lib/progress/notes-service";
import type { NoteProgress } from "@/lib/progress/types";

/**
 * Tracks reading progress for a single note. Call this hook inside the note
 * reader component — it will:
 *   - Record an "opened" event on mount
 *   - Update scroll progress (debounced) as the student scrolls
 *   - Auto-mark complete when scroll passes ~85%
 *   - Provide manualMarkComplete() for an explicit "Mark as Read" button
 */
export function useNoteProgress(args: {
  noteId: string;
  chapterId: string;
  subjectId: string;
  noteTitle?: string;
  chapterTitle?: string;
  subjectName?: string;
  /** Chapter's classLevel — recorded on chapterMastery for AI per-track filtering. */
  classLevel?: string | null;
  /** Chapter's medium — recorded on chapterMastery for AI per-track filtering. */
  medium?: string;
  /** Total notes in the chapter — enables exact completion % in mastery score. */
  totalNotesInChapter?: number;
  /** Element whose scroll position should be tracked. Defaults to window. */
  scrollContainer?: HTMLElement | null;
}) {
  const { user } = useAuth();
  const lastWriteRef = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const argsRef = useRef(args);
  argsRef.current = args;
  // Track when this note session started so we can compute reading time
  const noteOpenedAtRef = useRef<number>(Date.now());

  const qc = useQueryClient();

  // Mark opened on mount — invalidate caches so the "Reading" badge appears
  useEffect(() => {
    if (!user || user.role !== "student") return;
    noteOpenedAtRef.current = Date.now(); // reset reading timer for this note
    void markNoteOpened({
      uid: user.id,
      noteId: args.noteId,
      chapterId: args.chapterId,
      subjectId: args.subjectId,
      noteTitle: args.noteTitle,
      chapterTitle: args.chapterTitle,
    }).then(() => {
      qc.invalidateQueries({ queryKey: ["notesProgress", user.id, args.chapterId] });
      qc.invalidateQueries({ queryKey: ["dashboardStats", user.id] });
      qc.invalidateQueries({ queryKey: ["recentActivity", user.id] });
    });
    // Only run on mount + when noteId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, args.noteId]);

  // Track scroll
  useEffect(() => {
    if (!user || user.role !== "student") return;
    const target = args.scrollContainer ?? window;

    const computePercent = (): number => {
      if (target instanceof Window) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total <= 0) return 100;
        return Math.round((window.scrollY / total) * 100);
      }
      const el = target as HTMLElement;
      const total = el.scrollHeight - el.clientHeight;
      if (total <= 0) return 100;
      return Math.round((el.scrollTop / total) * 100);
    };

    const onScroll = () => {
      // Throttle to once every 2 sec
      const now = Date.now();
      if (now - lastWriteRef.current < 2000) return;

      // Additional debounce — wait 800ms of no-scroll before writing
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        lastWriteRef.current = Date.now();
        const pct = computePercent();
        const readingTimeMs = Date.now() - noteOpenedAtRef.current;
        void updateScrollProgress({
          uid: user.id,
          noteId: argsRef.current.noteId,
          scrollPercent: pct,
          readingTimeMs,
          totalNotesInChapter: argsRef.current.totalNotesInChapter,
        });
      }, 800);
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [user, args.scrollContainer]);

  const manualMarkComplete = useCallback(async () => {
    if (!user || user.role !== "student") return;
    const readingTimeMs = Date.now() - noteOpenedAtRef.current;
    await markNoteCompleted({
      uid:                 user.id,
      noteId:              argsRef.current.noteId,
      chapterId:           argsRef.current.chapterId,
      subjectId:           argsRef.current.subjectId,
      noteTitle:           argsRef.current.noteTitle,
      chapterTitle:        argsRef.current.chapterTitle,
      subjectName:         argsRef.current.subjectName,
      classLevel:          argsRef.current.classLevel,
      medium:              argsRef.current.medium,
      totalNotesInChapter: argsRef.current.totalNotesInChapter,
      readingTimeMs,
    });
    // Invalidate so badges + dashboard refresh immediately
    qc.invalidateQueries({ queryKey: ["notesProgress", user.id, argsRef.current.chapterId] });
    qc.invalidateQueries({ queryKey: ["dashboardStats", user.id] });
    qc.invalidateQueries({ queryKey: ["recentActivity", user.id] });
  }, [user, qc]);

  return { manualMarkComplete };
}

/**
 * Returns progress info for every note in a chapter (for badges in note list).
 * Cached for 30 sec — students rarely re-mark notes that fast.
 */
export function useChapterNotesProgress(chapterId: string | null) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery<NoteProgress[]>({
    queryKey: ["notesProgress", user?.id, chapterId],
    enabled: !!user && user.role === "student" && !!chapterId,
    queryFn: () => fetchNotesProgressForChapter(user!.id, chapterId!),
    staleTime: 5 * 1000,           // 5 sec — fast enough for "real-time" feel
    refetchOnWindowFocus: true,    // refetch when student returns to the chapter list
  });

  // Convenience: lookup map by noteId
  const byId = (query.data ?? []).reduce<Record<string, NoteProgress>>((acc, n) => {
    acc[n.noteId] = n;
    return acc;
  }, {});

  return {
    progressList: query.data ?? [],
    progressById: byId,
    isLoading: query.isLoading,
    invalidate: () => qc.invalidateQueries({ queryKey: ["notesProgress", user?.id, chapterId] }),
  };
}
