/**
 * Shared bilingual labels for the AI "Next Best Step" recommendation engine.
 * Used by both NextRecommendationCard (the dashboard card) and
 * RecommendationPopup (the once-per-session attention popup) so the rung
 * labels, CTA text and language picker stay in one place.
 */

import type { BilingualField } from "@/hooks/useNextRecommendation";

/** Short pill label per recommendation kind. */
export const RUNG_LABELS: Record<string, string> = {
  unread_note:   "READ",
  note_video:    "WATCH",
  lab:           "LAB",
  lab_quiz:      "QUIZ",
  chapter_mcq:   "MCQ",
  qna:           "Q&A",
  qna_video:     "VIDEO",
  next_chapter:  "NEXT",
  all_caught_up: "DONE",
};

/** CTA button text per recommendation kind (English + Assamese). */
export const CTA_LABEL: Record<string, { en: string; as: string }> = {
  unread_note:   { en: "Read now",      as: "এতিয়াই পঢ়ক" },
  note_video:    { en: "Watch video",   as: "ভিডিঅ' চাওক" },
  lab:           { en: "Open lab",      as: "পৰীক্ষাগাৰ খোলক" },
  lab_quiz:      { en: "Take lab quiz", as: "ল্যাব কুইজ দিয়ক" },
  chapter_mcq:   { en: "Try MCQs",      as: "MCQ চেষ্টা কৰক" },
  qna:           { en: "Review Q&A",    as: "Q&A চাওক" },
  qna_video:     { en: "Watch video",   as: "ভিডিঅ' চাওক" },
  next_chapter:  { en: "Start chapter", as: "অধ্যায় আৰম্ভ কৰক" },
  all_caught_up: { en: "Explore",       as: "অন্বেষণ" },
};

export const HEADER_LABEL = {
  en: "Next Best Step",
  as: "পৰৱৰ্তী পদক্ষেপ",
};

export function pickLang<T>(field: BilingualField<T>, isAssamese: boolean): T {
  return isAssamese ? field.as : field.en;
}
