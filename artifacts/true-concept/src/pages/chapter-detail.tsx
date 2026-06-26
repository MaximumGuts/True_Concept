import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRoute, Link, useSearch } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import "katex/dist/katex.min.css";
import { preserveSpaces } from "@/lib/preserve-spaces";
import { markdownComponents } from "@/lib/markdown-components";
import {
  useGetChapter, getGetChapterQueryKey,
  useGetSubject, getGetSubjectQueryKey,
  useGetNotes, getGetNotesQueryKey,
  useGetMcqs, getGetMcqsQueryKey,
  useGetQa, getGetQaQueryKey,
  useMarkChapterVisited, useSaveMcqScore,
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { ArrowLeft, X, Play, BookOpen, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/MotionList";
import { getSubjectTheme } from "@/lib/subject-theme";
import { useNoteProgress, useChapterNotesProgress } from "@/hooks/useNoteProgress";
import { useRecordMcqAttempt } from "@/hooks/useMcqProgress";
import NoteStatusBadge from "@/components/progress/NoteStatusBadge";
import { tracker } from "@/lib/analytics";
import NextStepCard from "@/components/NextStepCard";
import { nextStepAfterNote, nextStepAfterMcq } from "@/lib/next-step";
import UnlockGate from "@/ads/components/UnlockGate";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";
import { awardXP } from "@/lib/gamification/xp-service";
import { XP_VALUES } from "@/lib/gamification/xp-config";
import BookmarkButton from "@/components/BookmarkButton";

/** Minimal chapter info passed down to tabs for progress tracking. */
interface ChapterCtx {
  id: string;
  subjectId: string;
  title: string;
  subjectName?: string;
  classLevel?: string | null;
  medium?: string;
}

/** Header card showing a unique auto-icon for an MCQ/Q&A set */
type Tab = "notes" | "mcq" | "qa";

type NoteData = {
  id: string;
  title: string;
  content: string;
  youtubeId?: string | null;       // legacy single-video field
  youtubeIds?: string[] | null;    // new multi-video field
};

/** Returns the canonical list of YouTube IDs for a note (handles legacy data). */
function getNoteYoutubeIds(note: NoteData): string[] {
  if (note.youtubeIds && note.youtubeIds.length > 0) return note.youtubeIds;
  return note.youtubeId ? [note.youtubeId] : [];
}

/* Note preview card — clickable, opens the immersive reader */
function NoteCard({
  note, chapter, onOpen, progressStatus, scrollPercent,
}: {
  note: NoteData;
  chapter: ChapterCtx;
  onOpen: () => void;
  progressStatus?: "unread" | "in_progress" | "completed";
  scrollPercent?: number;
}) {
  // Strip markdown for a clean preview snippet
  const preview = note.content
    .replace(/[#*_`>~\-\[\]()!|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);

  return (
    <div className="relative">
    <motion.button
      onClick={onOpen}
      whileHover={{ y: -3, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      data-testid={`note-card-${note.id}`}
      className="w-full text-left bg-card hover:bg-muted/30 rounded-2xl border border-border p-5 transition-colors relative overflow-hidden group"
    >
      {/* Subtle hover glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(218,107,69,0.20), transparent 70%)" }} />

      <div className="flex items-start gap-4 relative">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg"
          style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
          📝
        </div>
        <div className="flex-1 min-w-0 pr-9">
          <h2 className="text-base sm:text-lg font-black text-foreground leading-snug assamese-text mb-1.5">
            {note.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-2 assamese-text leading-relaxed">
            {preview}…
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full liquid-inner text-orange-700 dark:text-orange-300">
              <BookOpen className="w-3 h-3" /> Read
            </span>
            {(() => {
              const videoCount = getNoteYoutubeIds(note).length;
              if (videoCount === 0) return null;
              return (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full liquid-inner text-red-700 dark:text-red-300">
                  <Play className="w-3 h-3 fill-current" />
                  {videoCount > 1 ? `${videoCount} Videos` : "Video"}
                </span>
              );
            })()}
            <NoteStatusBadge status={progressStatus} scrollPercent={scrollPercent} />
          </div>
        </div>
      </div>
    </motion.button>
      {/* Bookmark toggle — sibling (not nested) so it isn't a button-in-button */}
      <div className="absolute top-3 right-3 z-10">
        <BookmarkButton
          size={18}
          data={{
            type: "note",
            refId: note.id,
            chapterId: chapter.id,
            subjectId: chapter.subjectId,
            chapterTitle: chapter.title,
            subjectName: chapter.subjectName ?? null,
            title: note.title,
            preview,
          }}
        />
      </div>
    </div>
  );
}

/** Single video card — opens YouTube app/site on tap so ads play correctly. */
function NoteVideoEmbed({
  youtubeId, index, total, noteId, chapter,
}: {
  youtubeId: string;
  index: number;
  total: number;
  noteId?: string;
  chapter?: ChapterCtx;
}) {
  const { user } = useAuth();

  const trackPlay = () => {
    if (user?.role === "student" && chapter) {
      tracker.track({
        type:        "video_played",
        uid:         user.id,
        youtubeId,
        noteId,
        chapterId:   chapter.id,
        subjectId:   chapter.subjectId,
        chapterTitle: chapter.title,
        subjectName: chapter.subjectName,
      });
      // Award XP for watching a video (once per video per day)
      const today = new Date().toISOString().slice(0, 10);
      void awardXP({
        uid: user.id, xp: XP_VALUES.VIDEO_WATCHED,
        eventId: `video-${youtubeId}-${today}`, type: "video_watched",
      });
    }
  };

  return (
    <YouTubeThumbnail
      youtubeId={youtubeId}
      label={total > 1 ? `Video ${index} of ${total}` : "Lecture Video"}
      onBeforeOpen={trackPlay}
    />
  );
}

/* Full-screen immersive note reader */
function NoteReaderModal({
  note, chapter, onClose, totalNotesInChapter,
}: {
  note: NoteData;
  chapter: ChapterCtx;
  onClose: () => void;
  totalNotesInChapter?: number;
}) {
  const [marked, setMarked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track reading progress — auto-mark on scroll past 85%, also exposes manual button
  const { manualMarkComplete } = useNoteProgress({
    noteId: note.id,
    chapterId: chapter.id,
    subjectId: chapter.subjectId,
    noteTitle: note.title,
    chapterTitle: chapter.title,
    subjectName: chapter.subjectName,
    classLevel: chapter.classLevel,
    medium: chapter.medium,
    totalNotesInChapter,
    scrollContainer: scrollRef.current,
  });

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleManualMark = async () => {
    await manualMarkComplete();
    setMarked(true);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-background"
      data-testid="note-reader"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="flex flex-col h-full"
      >
        {/* Top bar — sticky, themed */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-card/85 border-b border-border shadow-sm"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px), var(--cap-status-bar, 0px))" }}>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button
              onClick={onClose}
              data-testid="button-close-note"
              className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors shrink-0"
              aria-label="Close note"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base shrink-0 shadow-md"
              style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
              📝
            </div>
            <h1 className="flex-1 font-black text-base sm:text-lg text-foreground truncate assamese-text">
              {note.title}
            </h1>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors shrink-0 hidden sm:flex"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable reading area — extra bottom padding reserves room for
            the native AdMob banner (~60 dp) on Android so the Mark-as-Read
            CTA below isn't covered. */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)" }}>
          <UnlockGate feature="notes" onDismiss={onClose}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
            <div className="note-reading-prose">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={markdownComponents}
              >
                {preserveSpaces(note.content)}
              </ReactMarkdown>
            </div>

            {/* Mark as Read button — alternative to scrolling all the way through */}
            <div className="mt-10 flex flex-col items-center gap-2">
              {!marked && (
                <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed px-2">
                  Tap when you've finished reading — this lets your AI mentor suggest what to study next.
                </p>
              )}
              <button
                onClick={handleManualMark}
                disabled={marked}
                data-testid="button-mark-read"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm shadow-lg transition-all ${
                  marked
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 cursor-default"
                    : "text-white hover:opacity-90 active:scale-95"
                }`}
                style={!marked ? { background: "linear-gradient(135deg, #16a34a, #059669)" } : undefined}
              >
                <CheckCircle2 className="w-5 h-5" />
                {marked ? "Marked as Read" : "Mark as Read"}
              </button>
            </div>

            {/* Next step suggestion — appears after marking as read */}
            {marked && (
              <div className="mt-8">
                <NextStepCard
                  step={nextStepAfterNote({
                    chapterId: chapter.id,
                    chapterTitle: chapter.title,
                    subjectId: chapter.subjectId,
                    hasMcqs: true,
                    hasQa: true,
                    mcqBestScore: 0,
                    mcqAttemptCount: 0,
                    notesCompleted: 1,
                    masteryStatus: "in_progress",
                  })}
                  onDismiss={onClose}
                />
              </div>
            )}

            {/* YouTube section pinned at the bottom — supports multiple videos */}
            {(() => {
              const videoIds = getNoteYoutubeIds(note);
              if (videoIds.length === 0) return null;
              return (
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/15 dark:bg-red-500/20">
                      <Play className="w-4 h-4 text-red-600 dark:text-red-400 fill-current" />
                    </div>
                    <h3 className="font-black text-base text-foreground">
                      {videoIds.length === 1 ? "Related Video Lecture" : `${videoIds.length} Video Lectures`}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {videoIds.map((vid, idx) => (
                      <NoteVideoEmbed
                        key={`${vid}-${idx}`}
                        youtubeId={vid}
                        index={idx + 1}
                        total={videoIds.length}
                        noteId={note.id}
                        chapter={chapter}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
          </UnlockGate>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function NotesTab({ chapter }: { chapter: ChapterCtx }) {
  const chapterId = chapter.id;
  const { data: notes, isLoading } = useGetNotes(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetNotesQueryKey({ chapterId }) } }
  );
  const { progressById } = useChapterNotesProgress(chapterId);
  // Honor a `?note=<id>` deep link (used by the Bookmarks page) — auto-open it.
  const [openNoteId, setOpenNoteId] = useState<string | null>(
    () => new URLSearchParams(window.location.search).get("note"),
  );

  // Browser-history integration: pushState on open, popstate (Android back) closes.
  useEffect(() => {
    if (!openNoteId) return;
    window.history.pushState({ noteOpen: true }, "");
    const onPop = () => setOpenNoteId(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openNoteId]);

  const closeNote = () => {
    if (window.history.state?.noteOpen) {
      window.history.back();
    } else {
      setOpenNoteId(null);
    }
  };

  if (isLoading) return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded-lg w-3/5" />
              <div className="h-3 bg-muted/60 rounded w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!notes?.length) return (
    <div className="bg-card rounded-3xl border border-border text-center py-20">
      <div className="text-5xl mb-4">📭</div>
      <p className="font-black text-lg text-foreground">No notes yet — check back soon!</p>
      <p className="text-muted-foreground text-sm mt-1 font-medium">Your teacher will upload notes for this chapter.</p>
    </div>
  );

  const openNote = openNoteId ? notes.find((n) => n.id === openNoteId) ?? null : null;

  return (
    <>
      <div className="space-y-3">
        {notes.map((note) => {
          const p = progressById[note.id];
          return (
            <NoteCard
              key={note.id}
              note={note}
              chapter={chapter}
              onOpen={() => setOpenNoteId(note.id)}
              progressStatus={p?.status}
              scrollPercent={p?.scrollPercent}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {openNote && (
          <NoteReaderModal
            note={openNote}
            chapter={chapter}
            onClose={closeNote}
            totalNotesInChapter={notes?.length}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Extract setNumber from an MCQ, defaulting to 1 for legacy docs that pre-date the field. */
function mcqSetNumber(m: unknown): number {
  const n = (m as { setNumber?: number }).setNumber;
  return typeof n === "number" && n >= 1 ? Math.floor(n) : 1;
}

function McqTab({ chapter }: { chapter: ChapterCtx }) {
  const chapterId = chapter.id;
  const { user } = useAuth();
  const { data: mcqs, isLoading } = useGetMcqs(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetMcqsQueryKey({ chapterId }) } }
  );
  const saveScore = useSaveMcqScore();
  const recordAttempt = useRecordMcqAttempt();

  // ── Set-picker state ────────────────────────────────────────────────────
  // null = picker view; number = currently-active set's MCQs.
  // Honor a `?set=<n>` deep link (used by the Bookmarks page).
  const [activeSet, setActiveSet] = useState<number | null>(() => {
    const s = new URLSearchParams(window.location.search).get("set");
    const n = s ? parseInt(s, 10) : NaN;
    return Number.isFinite(n) && n >= 1 ? n : null;
  });
  // Per-set best score (kept in memory for the picker badge — Firestore is
  // source of truth long-term, but the in-session memory gives instant feedback)
  const [setBest, setSetBest] = useState<Record<number, { correct: number; total: number }>>({});

  // ── Quiz state (only used when activeSet !== null) ──────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Filter to the active set, sorted by order
  const currentMcqs = useMemo(() => {
    if (!mcqs || activeSet === null) return [];
    return mcqs
      .filter(m => mcqSetNumber(m) === activeSet)
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [mcqs, activeSet]);

  // Reset quiz state whenever a new set is selected
  useEffect(() => {
    if (activeSet !== null) {
      setCurrentIdx(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswers(new Array(currentMcqs.length).fill(null));
      setQuizComplete(false);
      setScoreSaved(false);
      startTimeRef.current = Date.now();
    }
  }, [activeSet, currentMcqs.length]);

  // Group MCQs into sets — Map<setNumber, mcqs[]>
  const setsMap = useMemo(() => {
    const m = new Map<number, typeof mcqs>();
    (mcqs ?? []).forEach(q => {
      const n = mcqSetNumber(q);
      if (!m.has(n)) m.set(n, []);
      m.get(n)!.push(q);
    });
    return m;
  }, [mcqs]);
  const setNumbers = useMemo(() => Array.from(setsMap.keys()).sort((a, b) => a - b), [setsMap]);

  const handleSelect = (optIdx: number) => {
    if (selectedAnswer !== null || activeSet === null) return;
    setSelectedAnswer(optIdx);
    setShowExplanation(true);
    const na = [...answers]; na[currentIdx] = optIdx; setAnswers(na);

    // Track per-question for the AI mentor (weak-question map, retry detection).
    // setNumber is included so the AI knows which set the result belongs to.
    if (user && user.role === "student") {
      const question = currentMcqs[currentIdx];
      tracker.track({
        type:       "question_answered",
        uid:        user.id,
        questionId: question.id,
        chapterId,
        subjectId:  chapter.subjectId,
        isCorrect:  optIdx === question.correctIndex,
        setNumber:  activeSet,
      });
    }
  };

  const handleNext = () => {
    if (activeSet === null) return;
    if (currentIdx < currentMcqs.length - 1) {
      setCurrentIdx(currentIdx + 1);
      const next = answers[currentIdx + 1];
      setSelectedAnswer(next); setShowExplanation(next !== null);
      return;
    }
    // Last question → compute score, save, mark complete
    const score = answers.filter((a, i) => a === currentMcqs[i].correctIndex).length;
    setQuizComplete(true);
    setSetBest(prev => {
      const prior = prev[activeSet];
      if (prior && prior.correct >= score) return prev;
      return { ...prev, [activeSet]: { correct: score, total: currentMcqs.length } };
    });
    if (user && user.id !== "0" && !scoreSaved) {
      // 1. API score save — keeps dashboard summary working
      saveScore.mutate({ data: { chapterId, score, total: currentMcqs.length } });
      // 2. Firestore per-set history for the AI mentor — setId encodes the set
      //    so each set's attempts/accuracy/streak are tracked independently.
      const durationSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      void recordAttempt({
        chapterId,
        setId: `${chapterId}__set${activeSet}`,
        subjectId: chapter.subjectId,
        totalQuestions: currentMcqs.length,
        correctAnswers: score,
        durationSec,
        chapterTitle: chapter.title,
        subjectName: chapter.subjectName,
        classLevel: chapter.classLevel,
        medium: chapter.medium,
      });
      setScoreSaved(true);
    }
  };

  const retryCurrentSet = () => {
    setCurrentIdx(0); setSelectedAnswer(null); setShowExplanation(false);
    setAnswers(new Array(currentMcqs.length).fill(null));
    setQuizComplete(false); setScoreSaved(false);
    startTimeRef.current = Date.now();
  };

  const backToPicker = () => setActiveSet(null);

  if (isLoading) return <div className="h-48 liquid-card rounded-2xl animate-pulse" />;
  if (!mcqs?.length) return (
    <div className="liquid-panel rounded-3xl text-center py-16">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-black text-lg text-gray-900 dark:text-gray-100">No MCQs yet</p>
    </div>
  );

  // ── Set picker view ─────────────────────────────────────────────────────
  if (activeSet === null) {
    return (
      <div data-testid="mcq-set-picker">
        <div className="mb-4 flex items-center gap-3 p-4 rounded-2xl liquid-card">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-2xl"
               style={{ background: "linear-gradient(135deg, #e58359, #f08766)" }}>🎯</div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-foreground text-sm sm:text-base leading-tight">MCQ Tests</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {setNumbers.length === 1 ? "1 test available" : `${setNumbers.length} tests available`}
              {" · "}
              {mcqs.length} questions total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {setNumbers.map(n => {
            const setQs = setsMap.get(n)!;
            const best = setBest[n];
            const bestPct = best ? Math.round((best.correct / best.total) * 100) : null;
            return (
              <div className="relative" key={n}>
              <button
                onClick={() => setActiveSet(n)}
                data-testid={`set-card-${n}`}
                className="w-full text-left p-5 rounded-3xl liquid-panel border border-transparent hover:border-orange-300 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shrink-0 shadow-md"
                       style={{ background: "linear-gradient(135deg, #e58359, #f08766)" }}>
                    S{n}
                  </div>
                  <div className="flex-1 min-w-0 pr-9">
                    <p className="font-black text-foreground text-base leading-tight">Set {n}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {setQs.length} {setQs.length === 1 ? "question" : "questions"}
                    </p>
                    {best && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          bestPct! >= 80 ? "text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/40"
                          : bestPct! >= 50 ? "text-amber-700 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/40"
                          : "text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/40"
                        }`}>
                          Best: {best.correct}/{best.total} · {bestPct}%
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-orange-500 text-xl shrink-0">›</span>
                </div>
              </button>
              <div className="absolute top-3 right-3 z-10">
                <BookmarkButton
                  size={18}
                  data={{
                    type: "mcq_set",
                    refId: `${chapterId}__set${n}`,
                    chapterId,
                    subjectId: chapter.subjectId,
                    chapterTitle: chapter.title,
                    subjectName: chapter.subjectName ?? null,
                    title: `Set ${n}`,
                    setNumber: n,
                    preview: `${setQs.length} ${setQs.length === 1 ? "question" : "questions"}`,
                  }}
                />
              </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Empty set safety net ────────────────────────────────────────────────
  if (currentMcqs.length === 0) {
    return (
      <div className="liquid-panel rounded-3xl text-center py-12" data-testid="mcq-empty-set">
        <div className="text-5xl mb-3">📭</div>
        <p className="font-black text-lg text-gray-900 dark:text-gray-100 mb-3">No questions in this set</p>
        <button onClick={backToPicker} className="px-6 py-2.5 rounded-xl text-sm font-black liquid-card text-gray-700 dark:text-gray-200">
          ← Back to MCQ tests
        </button>
      </div>
    );
  }

  // ── Results view ────────────────────────────────────────────────────────
  if (quizComplete) {
    const score = answers.filter((a, i) => a === currentMcqs[i].correctIndex).length;
    const pct = Math.round((score / currentMcqs.length) * 100);
    const nextStep = nextStepAfterMcq({
      chapterId,
      chapterTitle: chapter.title,
      subjectId: chapter.subjectId,
      hasMcqs: true,
      hasQa: true,
      mcqBestScore: pct,
      mcqAttemptCount: 1,
      notesCompleted: 0,
      masteryStatus: pct >= 80 ? "mastered" : "practiced",
    }, pct);
    return (
      <div className="space-y-4" data-testid="quiz-complete">
        <div className="liquid-panel rounded-3xl p-8 text-center">
          <div className="text-6xl mb-3">{pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚"}</div>
          <p className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Set {activeSet} — Result</p>
          <h3 className="font-black text-2xl text-gray-900 dark:text-gray-100 mb-3">MCQ Test Complete!</h3>
          <p className="text-5xl font-black mb-1"
             style={{ background: "linear-gradient(135deg, #da6b45, #b85535)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {score}/{currentMcqs.length}
          </p>
          <p className="text-gray-600 dark:text-gray-300 font-semibold mb-2">{pct}% correct</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-6">
            {pct >= 80 ? "Excellent — this counts toward mastery for the AI mentor."
             : pct >= 50 ? "Good effort — your mentor will suggest a follow-up next."
             : "Review the notes and try again — your mentor is tracking your progress."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={retryCurrentSet}
              className="px-6 py-3 rounded-2xl text-white font-black shadow-xl hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }} data-testid="button-retry-quiz">
              Try Set {activeSet} Again 🔄
            </button>
            <button onClick={backToPicker}
              className="px-6 py-3 rounded-2xl font-black liquid-card text-gray-700 dark:text-gray-200 hover:scale-[1.02] transition-transform"
              data-testid="button-back-to-sets">
              ← All MCQ Tests
            </button>
          </div>
        </div>
        <NextStepCard step={nextStep} />
      </div>
    );
  }

  // ── Quiz view ───────────────────────────────────────────────────────────
  // Gated: student picked a set but hasn't unlocked the MCQ feature yet.
  // Dismissing the UnlockModal returns them to the set picker.
  const current = currentMcqs[currentIdx];
  const optLabels = ["A", "B", "C", "D"];
  const isCorrect = selectedAnswer === current.correctIndex;

  return (
    <UnlockGate feature="mcq" onDismiss={backToPicker}>
    <>
    <div className="mb-3 flex items-center gap-2">
      <button onClick={backToPicker}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-card text-xs font-black text-gray-700 dark:text-gray-200 hover:scale-[1.02] transition-transform"
        data-testid="button-back-to-picker">
        <ArrowLeft className="w-3.5 h-3.5" /> All Sets
      </button>
      <span className="text-[10px] font-black px-2 py-1 rounded-full text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #e58359, #f08766)" }}>
        Set {activeSet}
      </span>
    </div>
    <div className="liquid-panel rounded-3xl p-6" data-testid="mcq-question">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-gray-500 dark:text-gray-400">Question {currentIdx + 1} of {currentMcqs.length}</span>
          <BookmarkButton
            size={16}
            data={{
              type: "mcq",
              refId: current.id,
              chapterId,
              subjectId: chapter.subjectId,
              chapterTitle: chapter.title,
              subjectName: chapter.subjectName ?? null,
              title: current.question,
              setNumber: activeSet,
              question: current.question,
              options: current.options,
              correctIndex: current.correctIndex,
              explanation: current.explanation ?? null,
            }}
          />
        </div>
        <div className="flex gap-1.5">
          {currentMcqs.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${
              i < currentIdx ? "w-5 bg-emerald-400" :
              i === currentIdx ? "w-8 bg-orange-500" : "w-5 bg-gray-200 dark:bg-gray-800"
            }`} />
          ))}
        </div>
      </div>

      <div className="text-lg font-black text-gray-900 dark:text-gray-100 leading-relaxed mb-6 note-reading-prose" data-testid="text-question">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>{current.question}</ReactMarkdown>
      </div>

      <div className="space-y-3 mb-4">
        {current.options.map((opt, i) => {
          const chosen = selectedAnswer === i;
          const correct = i === current.correctIndex;
          let style: React.CSSProperties = {};
          let cls = "w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold text-base ";
          if (selectedAnswer === null) {
            cls += "border-transparent liquid-card hover:border-orange-300 hover:scale-[1.01]";
          } else if (correct) {
            cls += "border-emerald-400 text-emerald-900 dark:text-emerald-200"; style = { background: "rgba(16,185,129,0.1)" };
          } else if (chosen) {
            cls += "border-red-300 text-red-700 dark:text-red-300"; style = { background: "rgba(239,68,68,0.08)" };
          } else {
            cls += "border-transparent liquid-inner text-gray-400 dark:text-gray-500";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} className={cls} style={style} data-testid={`option-${i}`}>
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm"
                  style={{ background: correct && selectedAnswer !== null ? "linear-gradient(135deg,#10b981,#14b8a6)" : "linear-gradient(135deg,#9ca3af,#6b7280)" }}>
                  {optLabels[i]}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={`mt-4 p-4 rounded-2xl text-sm font-semibold liquid-inner ${isCorrect ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"}`}
          data-testid="text-explanation">
          <p className="font-black mb-1">{isCorrect ? "🎉 Correct!" : "💡 Not quite!"}</p>
          <div className="note-reading-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{preserveSpaces(current.explanation)}</ReactMarkdown>
          </div>
        </div>
      )}

      {selectedAnswer !== null && (
        <button className="mt-4 w-full py-3.5 rounded-2xl font-black text-white shadow-xl hover:opacity-90 transition-opacity"
          onClick={handleNext} data-testid="button-next-question"
          style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
          {currentIdx < currentMcqs.length - 1 ? "Next Question →" : "View Results 🏆"}
        </button>
      )}
    </div>
    </>
    </UnlockGate>
  );
}

/* ── Q&A: student view mirrors Notes — a card list + full-screen reader,
   so opening a Q&A feels exactly like opening a note (no accordion / set
   header). ───────────────────────────────────────────────────────────── */

type QaItem = {
  id: string;
  question: string;
  answer: string;
  title?: string | null;
  content?: string | null;
  explanation?: string | null;
  isImportant?: boolean | null;
  youtubeId?: string | null;
  youtubeIds?: string[] | null;
};

// Q&A docs now follow a note-style shape (`title` + markdown `content`), but the
// old schema with `question`/`answer` still exists in Firestore for chapters
// that haven't been re-saved. Prefer the new fields, fall back to the legacy.
const qaHeading = (item: QaItem): string => (item.title && item.title.trim()) ? item.title : item.question;
const qaBody    = (item: QaItem): string => (item.content && item.content.length > 0) ? item.content : item.answer;
function qaYoutubeIds(item: QaItem): string[] {
  if (item.youtubeIds && item.youtubeIds.length > 0) return item.youtubeIds;
  return item.youtubeId ? [item.youtubeId] : [];
}

/* Q&A preview card — mirrors NoteCard; opens the immersive reader */
function QaCard({ item, index, chapter, onOpen }: {
  item: QaItem; index: number; chapter: ChapterCtx; onOpen: () => void;
}) {
  const heading = qaHeading(item);
  const body    = qaBody(item);
  const preview = (body || "")
    .replace(/[#*_`>~\-\[\]()!|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
  const videoCount = qaYoutubeIds(item).length;

  return (
    <div className="relative">
      <motion.button
        onClick={onOpen}
        whileHover={{ y: -3, scale: 1.005 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        data-testid={`qa-card-${item.id}`}
        className="w-full text-left bg-card hover:bg-muted/30 rounded-2xl border border-border p-5 transition-colors relative overflow-hidden group"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.20), transparent 70%)" }} />

        <div className="flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shrink-0 shadow-lg"
            style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>
            {index}
          </div>
          <div className="flex-1 min-w-0 pr-9">
            {item.isImportant && (
              <span className="inline-block text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full mb-1.5">⭐ Important</span>
            )}
            <h2 className="text-base sm:text-lg font-black text-foreground leading-snug assamese-text mb-1.5">
              {heading}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium line-clamp-2 assamese-text leading-relaxed">
              {preview}…
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full liquid-inner text-emerald-700 dark:text-emerald-300">
                <BookOpen className="w-3 h-3" /> Read
              </span>
              {videoCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full liquid-inner text-red-700 dark:text-red-300">
                  <Play className="w-3 h-3 fill-current" />
                  {videoCount > 1 ? `${videoCount} Videos` : "Video"}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.button>
      {/* Bookmark toggle — sibling (not nested) so it isn't a button-in-button */}
      <div className="absolute top-3 right-3 z-10">
        <BookmarkButton
          size={18}
          data={{
            type: "qna",
            refId: item.id,
            chapterId: chapter.id,
            subjectId: chapter.subjectId,
            chapterTitle: chapter.title,
            subjectName: chapter.subjectName ?? null,
            title: heading,
            question: heading,
            answer: body,
          }}
        />
      </div>
    </div>
  );
}

/* Full-screen immersive Q&A reader — mirrors NoteReaderModal */
function QaReaderModal({ item, chapter, onClose }: {
  item: QaItem; chapter: ChapterCtx; onClose: () => void;
}) {
  const heading  = qaHeading(item);
  const body     = qaBody(item);
  const videoIds = qaYoutubeIds(item);

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-background"
      data-testid="qa-reader"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="flex flex-col h-full"
      >
        {/* Top bar — sticky, themed */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-card/85 border-b border-border shadow-sm"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px), var(--cap-status-bar, 0px))" }}>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button onClick={onClose} data-testid="button-close-qa"
              className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors shrink-0" aria-label="Close Q&A">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base shrink-0 shadow-md"
              style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>❓</div>
            <h1 className="flex-1 font-black text-base sm:text-lg text-foreground truncate assamese-text">{heading}</h1>
            <button onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center liquid-inner hover:bg-muted transition-colors shrink-0 hidden sm:flex" aria-label="Close">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable reading area — extra bottom padding reserves room for the
            native AdMob banner on Android. */}
        <div className="flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)" }}>
          <UnlockGate feature="qna" onDismiss={onClose}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
            <div className="note-reading-prose">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={markdownComponents}
              >
                {preserveSpaces(body)}
              </ReactMarkdown>
            </div>

            {/* Extra explanation */}
            {item.explanation && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">💡 Extra Explanation</p>
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium leading-relaxed">{item.explanation}</p>
              </div>
            )}

            {/* YouTube section pinned at the bottom — supports multiple videos */}
            {videoIds.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/15 dark:bg-red-500/20">
                    <Play className="w-4 h-4 text-red-600 dark:text-red-400 fill-current" />
                  </div>
                  <h3 className="font-black text-base text-foreground">
                    {videoIds.length === 1 ? "Related Video Lecture" : `${videoIds.length} Video Lectures`}
                  </h3>
                </div>
                <div className="space-y-4">
                  {videoIds.map((vid, idx) => (
                    <NoteVideoEmbed
                      key={`${vid}-${idx}`}
                      youtubeId={vid}
                      index={idx + 1}
                      total={videoIds.length}
                      chapter={chapter}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          </UnlockGate>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function QaTab({ chapter }: { chapter: ChapterCtx }) {
  const chapterId = chapter.id;
  const { user } = useAuth();
  const { data: qa, isLoading } = useGetQa(
    { chapterId },
    { query: { enabled: !!chapterId, queryKey: getGetQaQueryKey({ chapterId }) } }
  );
  // Honor a `?qa=<id>` deep link (used by the Bookmarks page) — auto-open it.
  const [openQaId, setOpenQaId] = useState<string | null>(
    () => new URLSearchParams(window.location.search).get("qa"),
  );

  // Browser-history integration: pushState on open, popstate (Android back) closes.
  useEffect(() => {
    if (!openQaId) return;
    window.history.pushState({ qaOpen: true }, "");
    const onPop = () => setOpenQaId(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openQaId]);

  const closeQa = () => {
    if (window.history.state?.qaOpen) window.history.back();
    else setOpenQaId(null);
  };

  // Opening a Q&A counts as a view (mirrors the old expand-to-view tracking).
  const openQa = (item: QaItem) => {
    setOpenQaId(item.id);
    if (user?.role === "student") {
      tracker.track({
        type: "qa_viewed", uid: user.id, qaId: item.id, chapterId,
        subjectId: chapter.subjectId, chapterTitle: chapter.title, subjectName: chapter.subjectName,
      });
      const today = new Date().toISOString().slice(0, 10);
      void awardXP({
        uid: user.id, xp: XP_VALUES.QA_SECTION_VIEWED,
        eventId: `qa-${item.id}-${today}`, type: "qa_viewed",
      });
      // Emit video_played for each attached video so the AI mentor's ladder
      // knows the QnA-video rung was reached.
      for (const vid of qaYoutubeIds(item)) {
        tracker.track({
          type: "video_played", uid: user.id, youtubeId: vid, chapterId,
          subjectId: chapter.subjectId, chapterTitle: chapter.title, subjectName: chapter.subjectName,
        });
      }
    }
  };

  if (isLoading) return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded-lg w-3/5" />
              <div className="h-3 bg-muted/60 rounded w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!qa?.length) return (
    <div className="bg-card rounded-3xl border border-border text-center py-20">
      <div className="text-5xl mb-4">📭</div>
      <p className="font-black text-lg text-foreground">No Q&amp;A yet — check back soon!</p>
      <p className="text-muted-foreground text-sm mt-1 font-medium">Your teacher will add Q&amp;A for this chapter.</p>
    </div>
  );

  const items = qa as unknown as QaItem[];
  const openItem = openQaId ? items.find((q) => q.id === openQaId) ?? null : null;

  return (
    <>
      <div className="space-y-3" data-testid="qa-list">
        {items.map((item, i) => (
          <QaCard key={item.id} item={item} index={i + 1} chapter={chapter} onOpen={() => openQa(item)} />
        ))}
      </div>

      <AnimatePresence>
        {openItem && <QaReaderModal item={openItem} chapter={chapter} onClose={closeQa} />}
      </AnimatePresence>
    </>
  );
}

const TABS = [
  { id: "notes" as Tab, label: "Notes", emoji: "📝", grad: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "mcq" as Tab, label: "MCQ", emoji: "🎯", grad: "linear-gradient(135deg, #e58359, #f08766)" },
  { id: "qa" as Tab, label: "Q&A", emoji: "❓", grad: "linear-gradient(135deg, #10b981, #14b8a6)" },
];

export default function ChapterDetailPage() {
  const [, params] = useRoute("/chapters/:chapterId");
  const chapterId = params?.chapterId ?? "";
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    return (tab === "mcq" || tab === "qa") ? tab : "notes";
  });
  // Re-sync the tab when the URL's ?tab= query changes (e.g. a NextStepCard
  // link to ?tab=notes after an MCQ result) — wouter doesn't remount this
  // component for same-route navigations, so the lazy useState above only
  // runs once and would otherwise ignore later query-string changes.
  const search = useSearch();
  useEffect(() => {
    const tab = new URLSearchParams(search).get("tab");
    if (tab === "mcq" || tab === "qa" || tab === "notes") setActiveTab(tab);
  }, [search]);
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const markVisited = useMarkChapterVisited();

  const { data: chapter, isLoading } = useGetChapter(chapterId, {
    query: { enabled: !!chapterId, queryKey: getGetChapterQueryKey(chapterId) },
  });

  // Fetch the parent subject so the header can use its admin-chosen color.
  // (The chapter payload only carries subjectName, not the subject's color.)
  const subjectId = chapter?.subjectId;
  const { data: subject } = useGetSubject(subjectId!, {
    query: { enabled: !!subjectId, queryKey: getGetSubjectQueryKey(subjectId!) },
  });

  const isStudent = user?.role === "student";
  // Does this chapter belong to the student's current class/medium?
  // Admins bypass the guard entirely.
  const chapterBoard = chapter ? ((chapter as any).board as string | undefined) : undefined;
  const chapterMatchesPrefs =
    !isStudent ||
    !prefs ||
    !chapter ||
    ((!chapter.classLevel || chapter.classLevel === prefs.class) &&
     (!chapter.medium     || chapter.medium === "Both" || chapter.medium === prefs.medium) &&
     (!chapterBoard       || chapterBoard === "Both"  || !prefs.board || chapterBoard === prefs.board));

  // Only mark visited / track when chapter belongs to the student's track.
  // This prevents cross-class chapters poisoning the AI knowledge profile.
  useEffect(() => {
    if (chapterId && user && user.id !== "0" && chapterMatchesPrefs) {
      markVisited.mutate({ data: { chapterId } });
    }
  }, [chapterId, chapterMatchesPrefs]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4 blob-bg">
        <div className="h-6 w-24 rounded-xl skeleton-shimmer" />
        <div className="h-32 rounded-3xl skeleton-shimmer" />
        <div className="h-14 rounded-2xl skeleton-shimmer" />
        <div className="h-48 rounded-3xl skeleton-shimmer" />
      </div>
    );
  }

  // Mismatch gate — student opened a chapter that doesn't match their class/medium.
  // Render a friendly redirect prompt instead of the chapter (no tracking writes).
  if (chapter && isStudent && prefs && !chapterMatchesPrefs) {
    const wrongClass  = chapter.classLevel && chapter.classLevel !== prefs.class;
    const wrongMedium = chapter.medium && chapter.medium !== "Both" && chapter.medium !== prefs.medium;
    const wrongBoard  = chapterBoard && chapterBoard !== "Both" && prefs.board && chapterBoard !== prefs.board;
    void wrongBoard;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 blob-bg">
        <div className="liquid-card rounded-3xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="font-black text-2xl text-foreground mb-2">Not for your track</h2>
          <p className="text-muted-foreground font-medium mb-1">
            <span className="assamese-text">{chapter.title}</span> is for{" "}
            <span className="font-black text-foreground">
              {chapter.classLevel}
              {chapter.medium && chapter.medium !== "Both" ? ` · ${chapter.medium} medium` : ""}
            </span>.
          </p>
          <p className="text-muted-foreground font-medium text-sm mb-6">
            You're set as <span className="font-black text-foreground">{prefs.class} · {prefs.medium} medium</span>.
            {wrongClass && wrongMedium ? " Both don't match." : wrongClass ? " The class doesn't match." : " The medium doesn't match."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/subjects/${chapter.subjectId}`}>
              <button className="px-6 py-3 rounded-2xl font-black text-sm text-white shadow-lg hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
                Back to {chapter.subjectName ?? "subject"}
              </button>
            </Link>
            <Link href="/subjects">
              <button className="px-6 py-3 rounded-2xl font-black text-sm liquid-card hover:scale-105 transition-transform">
                All subjects
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subjectTheme = getSubjectTheme(chapter?.subjectName, 0, subject?.color);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      {/* Back */}
      <FadeIn>
        <Link href={`/subjects/${chapter?.subjectId}`}>
          <button className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-orange-700 dark:hover:text-orange-300 mb-6 transition-colors group" data-testid="button-back-subject">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to {chapter?.subjectName ?? "Subject"}
          </button>
        </Link>
      </FadeIn>

      {/* Chapter Header — themed by subject */}
      <FadeIn delay={0.05}>
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white mb-6 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${subjectTheme.accent}, ${subjectTheme.accent}DD)` }}
        >
          <div className="absolute -top-8 -right-4 w-48 h-48 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: subjectTheme.glow }} />
          <div className="absolute top-0 right-2 text-[140px] opacity-10 font-black leading-none pointer-events-none select-none">
            {chapter?.chapterNumber}
          </div>
          <div className="absolute bottom-2 right-4 text-7xl opacity-15 leading-none pointer-events-none select-none">
            {subjectTheme.emoji}
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider">
                {subjectTheme.emoji} Chapter {chapter?.chapterNumber}
              </span>
              {chapter?.classLevel && (
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider">
                  {chapter.classLevel}
                </span>
              )}
            </div>
            <h1 className="font-black text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight assamese-text drop-shadow-sm" data-testid="heading-chapter">
              {chapter?.title}
            </h1>
            {chapter?.description && (
              <p className="text-white/90 mt-2 text-sm sm:text-base font-medium leading-relaxed assamese-text max-w-2xl">
                {chapter.description}
              </p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Tab Buttons */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {TABS.map(({ id, label, emoji, grad }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              whileHover={{ scale: activeTab === id ? 1.02 : 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              data-testid={`tab-${id}`}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3.5 px-2 rounded-2xl text-xs sm:text-sm font-black transition-colors ${
                activeTab === id ? "text-white shadow-xl" : "liquid-card text-muted-foreground"
              }`}
              style={activeTab === id ? { background: grad } : {}}
            >
              <span className="text-lg sm:text-base">{emoji}</span>
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* Tab Content with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {chapter && (
            <>
              {activeTab === "notes" && (
                <NotesTab chapter={{
                  id: chapterId,
                  subjectId: chapter.subjectId ?? "",
                  title: chapter.title ?? "",
                  subjectName: chapter.subjectName,
                  classLevel: chapter.classLevel ?? null,
                  medium: chapter.medium ?? "Both",
                }} />
              )}
              {activeTab === "mcq" && (
                <McqTab chapter={{
                  id: chapterId,
                  subjectId: chapter.subjectId ?? "",
                  title: chapter.title ?? "",
                  subjectName: chapter.subjectName,
                  classLevel: chapter.classLevel ?? null,
                  medium: chapter.medium ?? "Both",
                }} />
              )}
              {activeTab === "qa" && (
                <QaTab chapter={{
                  id: chapterId,
                  subjectId: chapter.subjectId ?? "",
                  title: chapter.title ?? "",
                  subjectName: chapter.subjectName,
                  classLevel: chapter.classLevel ?? null,
                  medium: chapter.medium ?? "Both",
                }} />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
