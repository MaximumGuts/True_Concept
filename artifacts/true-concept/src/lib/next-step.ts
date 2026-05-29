/**
 * Rule-based "Next Step" engine.
 *
 * Given what a student just did (or their last activity), returns the single
 * most logical next action — no AI call, zero cost, instant response.
 *
 * Decision tree:
 *   Just finished note reading
 *     → has MCQs not attempted → "Test yourself: Try MCQs"
 *     → has QA              → "Revise with Q&A"
 *     → all done in chapter → "Move to next chapter"
 *
 *   Just finished MCQs (score < 70%)
 *     → "Re-read the notes" or "Try Q&A for deeper understanding"
 *
 *   Just finished MCQs (score 70-79%)
 *     → "Read Q&A to strengthen understanding"
 *
 *   Just finished MCQs (score ≥ 80%)
 *     → chapter complete → "Move to next chapter"
 *     → else             → "Read Q&A"
 *
 *   Returning to app (no recent action)
 *     → lastStudiedChapterId + mastery state → resume suggestion
 */

export type NextStepType = "mcq" | "notes" | "qa" | "lab" | "next-chapter" | "revision";

export interface NextStep {
  type: NextStepType;
  emoji: string;
  title: string;
  message: string;
  actionLabel: string;
  chapterId: string | null;
  tab: "notes" | "mcq" | "qa" | null;
}

export interface ChapterState {
  chapterId: string;
  chapterTitle: string;
  subjectId: string;
  hasMcqs: boolean;
  hasQa: boolean;
  mcqBestScore: number;        // 0-100, 0 = not attempted
  mcqAttemptCount: number;
  notesCompleted: number;
  masteryStatus: string;
}

// ── Post-note-completion step ─────────────────────────────────────────────────

export function nextStepAfterNote(state: ChapterState): NextStep {
  if (state.hasMcqs && state.mcqAttemptCount === 0) {
    return {
      type: "mcq",
      emoji: "🎯",
      title: "Test Yourself",
      message: `You've read the notes for ${state.chapterTitle}. Now test your understanding with MCQs.`,
      actionLabel: "Try MCQs",
      chapterId: state.chapterId,
      tab: "mcq",
    };
  }

  if (state.hasQa) {
    return {
      type: "qa",
      emoji: "💬",
      title: "Exam-Style Questions",
      message: `Good read! Now go through the Q&A section — these are exactly the type of questions asked in board exams.`,
      actionLabel: "Read Q&A",
      chapterId: state.chapterId,
      tab: "qa",
    };
  }

  return {
    type: "next-chapter",
    emoji: "✅",
    title: "Chapter Done!",
    message: `You've covered all the notes in ${state.chapterTitle}. Great work — move to the next chapter.`,
    actionLabel: "Next Chapter",
    chapterId: null,
    tab: null,
  };
}

// ── Post-MCQ step ─────────────────────────────────────────────────────────────

export function nextStepAfterMcq(state: ChapterState, score: number): NextStep {
  if (score < 50) {
    return {
      type: "notes",
      emoji: "📚",
      title: "Review the Notes",
      message: `Score of ${score}% means some concepts need another look. Re-read the notes, then retry the MCQs.`,
      actionLabel: "Re-read Notes",
      chapterId: state.chapterId,
      tab: "notes",
    };
  }

  if (score < 70) {
    return {
      type: "qa",
      emoji: "💬",
      title: "Deepen Your Understanding",
      message: `${score}% is a good start! Read through the Q&A section to strengthen weak areas before retrying.`,
      actionLabel: "Read Q&A",
      chapterId: state.chapterId,
      tab: state.hasQa ? "qa" : "notes",
    };
  }

  if (score < 80 && state.hasQa) {
    return {
      type: "qa",
      emoji: "💬",
      title: "Almost There!",
      message: `${score}% — well done! Go through the Q&A to push your mastery above 80%.`,
      actionLabel: "Read Q&A",
      chapterId: state.chapterId,
      tab: "qa",
    };
  }

  // Score ≥ 80% — chapter effectively mastered
  return {
    type: "next-chapter",
    emoji: "🏆",
    title: "Chapter Mastered!",
    message: `Excellent ${score}%! This chapter is done. Time to move forward.`,
    actionLabel: "Next Chapter",
    chapterId: null,
    tab: null,
  };
}

// ── Dashboard "continue" step (based on last activity) ───────────────────────

export function nextStepFromDashboard(
  lastChapterId: string | null,
  lastChapterTitle: string | null,
  chapterState?: Partial<ChapterState>
): NextStep | null {
  if (!lastChapterId || !lastChapterTitle) return null;

  const hasMcqs         = chapterState?.hasMcqs         ?? true;
  const mcqAttemptCount = chapterState?.mcqAttemptCount ?? 0;
  const masteryStatus   = chapterState?.masteryStatus   ?? "in_progress";
  const hasQa           = chapterState?.hasQa           ?? true;

  if (masteryStatus === "mastered") {
    return {
      type: "next-chapter",
      emoji: "🚀",
      title: "Keep Going!",
      message: `${lastChapterTitle} is mastered. What's next on your syllabus?`,
      actionLabel: "Explore Chapters",
      chapterId: null,
      tab: null,
    };
  }

  if (hasMcqs && mcqAttemptCount === 0) {
    return {
      type: "mcq",
      emoji: "🎯",
      title: "Continue Where You Left Off",
      message: `You've read the notes for ${lastChapterTitle} but haven't tried the MCQs yet. That's your next step.`,
      actionLabel: "Try MCQs",
      chapterId: lastChapterId,
      tab: "mcq",
    };
  }

  if (hasQa && mcqAttemptCount > 0) {
    return {
      type: "qa",
      emoji: "💬",
      title: `Continue: ${lastChapterTitle}`,
      message: `Check the Q&A section for ${lastChapterTitle} — important exam questions you haven't covered yet.`,
      actionLabel: "Read Q&A",
      chapterId: lastChapterId,
      tab: "qa",
    };
  }

  return {
    type: "notes",
    emoji: "📖",
    title: "Continue Studying",
    message: `Pick up where you left off in ${lastChapterTitle}.`,
    actionLabel: "Open Chapter",
    chapterId: lastChapterId,
    tab: "notes",
  };
}
