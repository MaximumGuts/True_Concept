/**
 * Daily Challenge runner — /practice/challenge
 *
 * 10-question mixed MCQ session. One question at a time.
 * Answers are saved to Firestore after each selection.
 * On completion, updates chapter mastery via onMcqAttempted so the AI Mentor
 * picks up the performance on its next recommendation cycle.
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, X, ChevronRight, Trophy } from "lucide-react";
import { useDailyChallenge, type ChallengeQuestion } from "@/hooks/useDailyChallenge";
import { awardXP } from "@/lib/gamification/xp-service";
import { XP_VALUES } from "@/lib/gamification/xp-config";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { useAuth } from "@/contexts/AuthContext";
import { onMcqAttempted } from "@/lib/analytics/mastery-service";
import { adManager } from "@/ads/ad-manager";
import WebInterstitial from "@/ads/web-interstitial/WebInterstitial";

const optLabels = ["A", "B", "C", "D"];

/* eslint-disable @typescript-eslint/no-explicit-any */
function isNativeApp(): boolean {
  const Cap = (window as any).Capacitor;
  return Cap?.isNativePlatform?.() === true;
}

function ResultScreen({
  questions,
  answers,
  score,
  correctCount,
  total,
  isAssamese,
  onClose,
}: {
  questions: ChallengeQuestion[];
  answers: Record<number, number>;
  score: number;
  correctCount: number;
  total: number;
  isAssamese: boolean;
  onClose: () => void;
}) {
  // ── 6-tier emoji + gradient (same as mock exam) ──────────────────────────
  const tier = (() => {
    if (score === 100) return { emoji: "🌟", gradFrom: "#f59e0b", gradTo: "#fbbf24", en: "Perfect Score!",      as: "নিখুঁত ফলাফল!" };
    if (score >= 80)   return { emoji: "🏆", gradFrom: "#10b981", gradTo: "#14b8a6", en: "Excellent work!",     as: "অসাধাৰণ কাম!" };
    if (score >= 60)   return { emoji: "👏", gradFrom: "#6366f1", gradTo: "#8b5cf6", en: "Good effort!",        as: "ভাল চেষ্টা!" };
    if (score >= 35)   return { emoji: "💪", gradFrom: "#f97316", gradTo: "#ea580c", en: "Keep pushing!",       as: "চেষ্টা অব্যাহত ৰাখক!" };
    if (score > 0)     return { emoji: "📚", gradFrom: "#f59e0b", gradTo: "#d97706", en: "Needs more study",    as: "আৰু পঢ়া দৰকাৰ" };
    return               { emoji: "😔", gradFrom: "#ef4444", gradTo: "#dc2626", en: "Don't give up!",       as: "হাৰ নামানিব!" };
  })();

  const scoreColor  = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const ringCircum  = 2 * Math.PI * 42;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-background overflow-y-auto"
    >
      {/* Extra bottom padding (pb-32 = 128px) clears the 50px AdMob banner
          + safe area without relying on the Layout spacer (portal bypasses it). */}
      <div className="max-w-2xl mx-auto pb-32">

        {/* ── Hero header ─────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-b-3xl px-6 pt-10 pb-8 text-white text-center shadow-xl mb-5"
          style={{ background: `linear-gradient(135deg, ${tier.gradFrom}, ${tier.gradTo})` }}
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 blur-3xl bg-white pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-20 blur-3xl bg-white pointer-events-none" />

          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
            className="text-7xl mb-3 relative z-10"
          >{tier.emoji}</motion.div>

          <h1 className="font-black text-xl relative z-10">
            {isAssamese ? "দৈনিক প্ৰত্যাহ্বান সম্পূৰ্ণ!" : "Challenge Complete!"}
          </h1>
          <p className="text-white/80 text-sm font-bold mt-1 relative z-10">
            {isAssamese ? tier.as : tier.en}
          </p>
        </div>

        <div className="px-4 space-y-4">

          {/* ── Score ring ───────────────────────────────────────── */}
          <div className="liquid-panel rounded-3xl p-6 flex flex-col items-center gap-3">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={ringCircum}
                  initial={{ strokeDashoffset: ringCircum }}
                  animate={{ strokeDashoffset: ringCircum * (1 - score / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-3xl font-black" style={{ color: scoreColor }}
                >{score}%</motion.span>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
              {correctCount}/{total} {isAssamese ? "শুদ্ধ" : "correct"}
            </p>
          </div>

          {/* ── Answer review ────────────────────────────────────── */}
          <div className="space-y-3">
            {questions.map((q, i) => {
              const chosen  = answers[i] ?? -1;
              const correct = chosen === q.correctIndex;
              return (
                <div key={q.mcqId} className="liquid-card rounded-2xl p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${correct ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                      {correct
                        ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        : <X className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                    <p className="font-black text-sm text-gray-900 dark:text-gray-100">{q.question}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {q.options.map((opt, oi) => {
                      const isCorrect = oi === q.correctIndex;
                      const isChosen  = oi === chosen;
                      return (
                        <div key={oi}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                          style={{
                            background: isCorrect ? "rgba(16,185,129,0.12)" : isChosen && !isCorrect ? "rgba(239,68,68,0.10)" : "rgba(0,0,0,0.03)",
                            border: `1px solid ${isCorrect ? "rgba(16,185,129,0.35)" : isChosen && !isCorrect ? "rgba(239,68,68,0.30)" : "transparent"}`,
                          }}>
                          <span className="font-black shrink-0">{optLabels[oi]}.</span>
                          <span className={isCorrect ? "text-emerald-800 dark:text-emerald-300 font-black" : isChosen && !isCorrect ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}>
                            {opt}
                          </span>
                          {isCorrect && <span className="ml-auto">✅</span>}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <p className="mt-2 text-xs text-blue-700 dark:text-blue-300 font-medium italic">💡 {q.explanation}</p>
                  )}
                  <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                    {q.subjectName} · {q.chapterTitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Back button ──────────────────────────────────────── */}
          <button onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
            {isAssamese ? "সম্পূৰ্ণ হ'ল" : "Back to Practice"} →
          </button>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}

export default function DailyChallengePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const isAssamese = prefs?.medium === "Assamese";

  const {
    challenge, isLoading, isCompleted,
    start, answer, submit,
  } = useDailyChallenge();

  const [currentIdx, setCurrentIdx]   = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult]   = useState(false);
  const [showWebInterstitial, setShowWebInterstitial] = useState(false);
  const [result, setResult]           = useState<{ correctCount: number; score: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start on mount
  useEffect(() => {
    if (challenge && challenge.status === "pending") {
      void start();
    }
    if (challenge?.answers) {
      setLocalAnswers(challenge.answers);
      // Resume at first unanswered question
      const firstUnanswered = challenge.questions.findIndex((_q, i) => !(i in (challenge.answers ?? {})));
      setCurrentIdx(firstUnanswered >= 0 ? firstUnanswered : challenge.questions.length - 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.dateKey]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-8 liquid-card rounded-xl w-40" />
        <div className="h-48 liquid-card rounded-3xl" />
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-12 liquid-card rounded-2xl" />)}</div>
      </div>
    );
  }

  if (!challenge || challenge.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-5xl mb-3">📭</p>
        <p className="font-black text-lg text-gray-900 dark:text-gray-100">
          {isAssamese ? "আজি কোনো প্ৰশ্ন নাই" : "No questions available today"}
        </p>
        <p className="text-gray-500 text-sm mt-1">{isAssamese ? "Admin এ MCQ যোগ কৰিব" : "Admin will add MCQs soon"}</p>
        <button onClick={() => setLocation("/practice")}
          className="mt-4 px-5 py-2.5 rounded-xl text-white font-black"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          {isAssamese ? "পিছলৈ" : "Go Back"}
        </button>
      </div>
    );
  }

  const questions = challenge.questions;
  const current   = questions[currentIdx];
  const chosen    = localAnswers[currentIdx] ?? -1;
  const answered  = chosen >= 0;
  const isLast    = currentIdx === questions.length - 1;
  const doneCount = Object.keys(localAnswers).length;

  const handleSelect = async (optIdx: number) => {
    if (answered) return;
    const updated = { ...localAnswers, [currentIdx]: optIdx };
    setLocalAnswers(updated);
    // Deferred marking: no right/wrong reveal here — feedback is shown only on
    // the result screen after all 10 questions are done.
    await answer(currentIdx, optIdx);
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIdx((i) => i + 1);
    } else {
      void handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const res = await submit(localAnswers, questions);
    if (res) {
      setResult(res);
      // Update chapter mastery for each chapter in the challenge
      if (user?.id) {
        const byChapter = new Map<string, { correct: number; total: number; meta: ChallengeQuestion }>();
        questions.forEach((q, i) => {
          if (!byChapter.has(q.chapterId)) byChapter.set(q.chapterId, { correct: 0, total: 0, meta: q });
          const entry = byChapter.get(q.chapterId)!;
          entry.total++;
          if (localAnswers[i] === q.correctIndex) entry.correct++;
        });
        for (const [chapterId, { correct, total, meta }] of byChapter) {
          void onMcqAttempted({
            uid:          user.id,
            chapterId,
            subjectId:    chapterId.split("-")[0] ?? "unknown",
            chapterTitle: meta.chapterTitle,
            subjectName:  meta.subjectName,
            score:        Math.round((correct / total) * 100),
            totalCorrect: correct,
            totalAttempted: total,
          });
        }
      }
      // Award XP for completing the daily challenge
      if (user?.id && res) {
        const today = new Date().toISOString().slice(0, 10);
        void awardXP({
          uid: user.id, xp: XP_VALUES.DAILY_CHALLENGE_DONE,
          eventId: `daily-challenge-${today}`, type: "daily_challenge_done",
          statDelta: { challengesDone: 1 },
        });
        if (res.score === 100) {
          void awardXP({
            uid: user.id, xp: XP_VALUES.DAILY_CHALLENGE_PERFECT,
            eventId: `daily-challenge-perfect-${today}`, type: "daily_challenge_perfect",
            statDelta: { perfectChallenges: 1 },
          });
        }
      }
      // Interstitial ad before revealing the result. Web shows the 31s
      // WebInterstitial component; native plays a full-screen AdMob interstitial
      // (TEST unit). Either way the result is shown right after.
      if (isNativeApp()) {
        await adManager.showInterstitial();
        setShowResult(true);
      } else {
        setShowWebInterstitial(true);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-44 md:pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setLocation("/practice")}
          className="w-10 h-10 rounded-xl liquid-inner flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {isAssamese ? "দৈনিক প্ৰত্যাহ্বান" : "Daily Challenge"}
          </p>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
            {current.subjectName} · {current.chapterTitle}
          </p>
        </div>
        <span className="font-black text-sm text-orange-600 dark:text-orange-300">
          {currentIdx + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(doneCount / questions.length) * 100}%`, background: "linear-gradient(90deg, #f97316, #fbbf24)" }} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="liquid-panel rounded-3xl p-5 sm:p-6">
          <p className="font-black text-base sm:text-lg text-gray-900 dark:text-gray-100 leading-relaxed mb-6">
            {current.question}
          </p>

          <div className="space-y-2.5">
            {current.options.map((opt, oi) => {
              const isChosen = oi === chosen;
              // Deferred marking: only show which option the student picked
              // (neutral orange highlight) — no right/wrong until the result.
              return (
                <button key={oi} onClick={() => handleSelect(oi)}
                  disabled={answered}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    !answered ? "hover:scale-[1.01] active:scale-[0.99]" : ""
                  }`}
                  style={{
                    background: isChosen ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${isChosen ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.3)"}`,
                    backdropFilter: "blur(12px)",
                  }}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm"
                    style={{ background: isChosen ? "linear-gradient(135deg,#f97316,#ea580c)" : "linear-gradient(135deg,#9ca3af,#6b7280)" }}>
                    {optLabels[oi]}
                  </span>
                  <span className={isChosen ? "text-orange-800 dark:text-orange-200 font-black" : "text-gray-800 dark:text-gray-100"}>
                    {opt}
                  </span>
                  {isChosen && <CheckCircle className="w-4 h-4 text-orange-500 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Deferred marking — no per-question explanation; the result screen
              after all 10 questions shows full correct/wrong + explanations. */}

          {/* Next button */}
          {answered && (
            <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              disabled={isSubmitting}
              className="mt-5 w-full py-3.5 rounded-2xl font-black text-white text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              {isSubmitting
                ? (isAssamese ? "জমা হৈছে..." : "Submitting…")
                : isLast
                  ? <><Trophy className="w-4 h-4" /> {isAssamese ? "ফলাফল চাওক" : "See Results"}</>
                  : <>{isAssamese ? "পৰৱৰ্তী" : "Next"} <ChevronRight className="w-4 h-4" /></>}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Results overlay */}
      {showResult && result && (
        <ResultScreen
          questions={questions}
          answers={localAnswers}
          score={result.score}
          correctCount={result.correctCount}
          total={questions.length}
          isAssamese={isAssamese}
          onClose={() => setLocation("/practice")}
        />
      )}

      {/* Interstitial before the result on web — 31s tip + AdSense slot.
          On completion it reveals the result screen. */}
      {showWebInterstitial && (
        <WebInterstitial onComplete={() => { setShowWebInterstitial(false); setShowResult(true); }} />
      )}

      {/* Already completed today — show results */}
      {isCompleted && !showResult && !showWebInterstitial && challenge.score > 0 && (
        <div className="liquid-card rounded-3xl p-5 text-center">
          <p className="font-black text-gray-900 dark:text-gray-100">
            {isAssamese ? "আজিৰ চেট সম্পূৰ্ণ হৈছে" : "Today's challenge is complete!"}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {challenge.correctCount}/{challenge.totalQuestions} correct · {challenge.score}%
          </p>
          <button onClick={() => setLocation("/practice")}
            className="mt-4 px-5 py-2.5 rounded-xl text-white font-black text-sm"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
            {isAssamese ? "পিছলৈ" : "Back to Practice"}
          </button>
        </div>
      )}
    </div>
  );
}
