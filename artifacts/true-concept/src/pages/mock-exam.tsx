/**
 * Mock Exam runner — /practice/mock-exam?mode=strict|practice&class=...
 *
 * Strict mode: 3-hour countdown, no going back, auto-submit.
 * Practice mode: no timer, can review previous answers.
 * Results saved to Firestore → feeds AI Mentor on next profile rebuild.
 * Banner ad is shown (page is in hideBottomNav set in Layout.tsx).
 */

import { useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, X, ChevronLeft, ChevronRight, Trophy, AlertTriangle } from "lucide-react";
import { useMockExamRunner, type MockExamMode } from "@/hooks/useMockExam";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { useAuth } from "@/contexts/AuthContext";
import { onMcqAttempted } from "@/lib/analytics/mastery-service";

const optLabels = ["A", "B", "C", "D"];

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Clean up raw subject IDs like "bio-ix" → "Bio IX" for display. */
function formatSubjectName(raw: string): string {
  return raw.split("-")
    .map((part) => ["ix", "x", "xi", "xii"].includes(part.toLowerCase())
      ? part.toUpperCase()
      : part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ResultScreen({
  result, questions, answers, timeTakenMs, isAssamese, onClose,
}: {
  result: { correct: number; score: number; breakdown: Record<string, { correct: number; total: number }> };
  questions: ReturnType<typeof useMockExamRunner>["questions"];
  answers: Record<number, number>;
  timeTakenMs: number;
  isAssamese: boolean;
  onClose: () => void;
}) {
  const [showReview, setShowReview] = useState(false);

  // ── Dynamic tier (6 levels) ──────────────────────────────────────────────
  const tier = (() => {
    if (result.score === 100) return {
      emoji: "🌟", gradFrom: "#f59e0b", gradTo: "#fbbf24",
      en: "Perfect Score!", as: "নিখুঁত ফলাফল!",
    };
    if (result.score >= 80) return {
      emoji: "🏆", gradFrom: "#10b981", gradTo: "#14b8a6",
      en: "Excellent work!", as: "অসাধাৰণ কাম!",
    };
    if (result.score >= 60) return {
      emoji: "👏", gradFrom: "#6366f1", gradTo: "#8b5cf6",
      en: "Good effort!", as: "ভাল চেষ্টা!",
    };
    if (result.score >= 35) return {
      emoji: "💪", gradFrom: "#f97316", gradTo: "#ea580c",
      en: "Keep pushing!", as: "চেষ্টা অব্যাহত ৰাখক!",
    };
    if (result.score > 0) return {
      emoji: "📚", gradFrom: "#f59e0b", gradTo: "#d97706",
      en: "More study needed", as: "আৰু পঢ়া দৰকাৰ",
    };
    return {
      emoji: "😔", gradFrom: "#ef4444", gradTo: "#dc2626",
      en: "Don't give up!", as: "হাৰ নামানিব!",
    };
  })();

  const scoreColor = result.score >= 75 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444";
  const ringCircum = 2 * Math.PI * 42;

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-background overflow-y-auto">
      <div className="max-w-2xl mx-auto pb-24">

        {/* ── Hero header ────────────────────────────────────── */}
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
            {isAssamese ? "মক পৰীক্ষাৰ ফলাফল" : "Mock Exam Result"}
          </h1>
          <p className="text-white/80 text-sm font-bold mt-1 relative z-10">
            {isAssamese ? tier.as : tier.en}
          </p>
        </div>

        <div className="px-4 space-y-4">

          {/* ── Score ring card ─────────────────────────────── */}
          <div className="liquid-panel rounded-3xl p-6 flex flex-col items-center gap-3">
            {/* Circular progress ring */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={ringCircum}
                  initial={{ strokeDashoffset: ringCircum }}
                  animate={{ strokeDashoffset: ringCircum * (1 - result.score / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-black"
                  style={{ color: scoreColor }}
                >{result.score}%</motion.span>
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
              {result.correct}/{questions.length} {isAssamese ? "শুদ্ধ" : "correct"}
              {" · "}
              {formatCountdown(timeTakenMs)} {isAssamese ? "সময়" : "taken"}
            </p>
          </div>

          {/* ── Subject breakdown ────────────────────────────── */}
          <div className="liquid-panel rounded-3xl p-5 space-y-3">
            <h2 className="font-black text-sm text-gray-900 dark:text-gray-100 mb-3">
              {isAssamese ? "বিষয় অনুযায়ী ফলাফল" : "Subject Breakdown"}
            </h2>
            {Object.entries(result.breakdown).map(([subj, { correct, total }]) => {
              const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
              const col = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
              return (
                <div key={subj}>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    <span>{formatSubjectName(subj)}</span>
                    <span style={{ color: col }}>{correct}/{total} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                      style={{ background: col }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Review answers ───────────────────────────────── */}
          <button onClick={() => setShowReview((v) => !v)}
            className="w-full py-3.5 rounded-2xl font-black text-sm liquid-card text-gray-700 dark:text-gray-200 border border-black/5 dark:border-white/10">
            {showReview
              ? (isAssamese ? "উত্তৰ লুকাওক" : "Hide Answers")
              : (isAssamese ? "উত্তৰ পৰীক্ষা কৰক" : "Review Answers")}
          </button>

          {showReview && (
            <div className="space-y-3">
              {questions.map((q, i) => {
                const chosen  = answers[i] ?? -1;
                const correct = chosen === q.correctIndex;
                return (
                  <div key={q.mcqId} className="liquid-card rounded-2xl p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${correct ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                        {correct
                          ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          : <X className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <p className="font-black text-xs text-gray-900 dark:text-gray-100">{q.question}</p>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-2 ml-7">
                      {q.subjectName} · {q.chapterTitle}
                    </p>
                    {q.options.map((opt, oi) => {
                      const isC  = oi === q.correctIndex;
                      const isCh = oi === chosen;
                      return (
                        <div key={oi}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-semibold mb-1"
                          style={{ background: isC ? "rgba(16,185,129,0.10)" : isCh && !isC ? "rgba(239,68,68,0.08)" : "transparent" }}>
                          <span className="font-black w-4 shrink-0">{optLabels[oi]}.</span>
                          <span className={isC ? "text-emerald-800 dark:text-emerald-300 font-black" : isCh ? "text-red-700 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}>{opt}</span>
                          {isC && <span className="ml-auto">✅</span>}
                        </div>
                      );
                    })}
                    {q.explanation && (
                      <p className="mt-1.5 text-[10px] text-blue-700 dark:text-blue-300 italic">💡 {q.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Back button ──────────────────────────────────── */}
          <button onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            {isAssamese ? "পিছলৈ যাওক" : "Back to Practice"} →
          </button>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}

export default function MockExamPage() {
  const [, setLocation] = useLocation();
  const searchStr = useSearch();
  const params = useMemo(() => new URLSearchParams(searchStr), [searchStr]);
  const mode       = (params.get("mode") ?? "practice") as MockExamMode;
  const classLevel = params.get("class") ?? "Class IX";
  const subjectId  = params.get("subject") ?? undefined;
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const isAssamese = prefs?.medium === "Assamese";

  const {
    questions, answers, currentIdx, isLoading, isSubmitted, result,
    remainingMs, selectAnswer, next, prev, submit,
  } = useMockExamRunner(classLevel, mode, subjectId, prefs?.board ?? null);

  const [showConfirm, setShowConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-8 liquid-card rounded-xl w-48" />
        <div className="h-60 liquid-card rounded-3xl" />
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-12 liquid-card rounded-2xl" />)}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-5xl mb-3">📭</p>
        <p className="font-black text-lg text-gray-900 dark:text-gray-100">
          {isAssamese ? "পৰ্যাপ্ত প্ৰশ্ন নাই" : "Not enough questions yet"}
        </p>
        <p className="text-gray-500 text-sm mt-1">{isAssamese ? "Admin এ MCQ যোগ কৰিব" : "Admin will add more MCQs soon"}</p>
        <button onClick={() => setLocation("/practice")}
          className="mt-4 px-5 py-2.5 rounded-xl text-white font-black text-sm"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          {isAssamese ? "পিছলৈ" : "Back"}
        </button>
      </div>
    );
  }

  const current   = questions[currentIdx];
  const chosen    = answers[currentIdx] ?? -1;
  const answered  = chosen >= 0;
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = async () => {
    setShowConfirm(false);
    await submit();
    // Update chapter mastery
    if (user?.id) {
      const byChapter = new Map<string, { correct: number; total: number; meta: typeof questions[0] }>();
      questions.forEach((q, i) => {
        if (!byChapter.has(q.chapterId)) byChapter.set(q.chapterId, { correct: 0, total: 0, meta: q });
        const e = byChapter.get(q.chapterId)!;
        e.total++;
        if (answers[i] === q.correctIndex) e.correct++;
      });
      for (const [chapterId, { correct, total, meta }] of byChapter) {
        void onMcqAttempted({
          uid: user.id, chapterId,
          subjectId:    chapterId.split("-")[0] ?? "unknown",
          chapterTitle: meta.chapterTitle,
          subjectName:  meta.subjectName,
          score:        Math.round((correct / total) * 100),
          totalCorrect: correct, totalAttempted: total,
        });
      }
    }
  };

  const timeTakenMs = 1 * 60 * 60 * 1000 - remainingMs;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-44 md:pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => !isSubmitted && setShowConfirm(true)}
          className="w-10 h-10 rounded-xl liquid-inner flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {mode === "strict" ? (isAssamese ? "কঠোৰ মক পৰীক্ষা" : "Strict Mock Exam") : (isAssamese ? "অভ্যাস মক পৰীক্ষা" : "Practice Mock Exam")}
          </p>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
            {classLevel} · {subjectId ? current.subjectName : (isAssamese ? "সকলো বিষয়" : "All Subjects")}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {mode === "strict" && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${remainingMs < 600000 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-300"}`}
              style={{ background: remainingMs < 600000 ? "rgba(239,68,68,0.10)" : "rgba(0,0,0,0.06)" }}>
              <Clock className="w-3.5 h-3.5" />
              {formatCountdown(remainingMs)}
            </div>
          )}
          <span className="text-sm font-black text-gray-500 dark:text-gray-400">
            {currentIdx + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
      </div>
      <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 text-right">
        {answeredCount}/{questions.length} {isAssamese ? "উত্তৰ দিয়া হৈছে" : "answered"}
      </p>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx}
          initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.18 }}
          className="liquid-panel rounded-3xl p-5 sm:p-6">
          <p className="font-black text-base sm:text-lg text-gray-900 dark:text-gray-100 leading-relaxed mb-6">
            {current.question}
          </p>
          <div className="space-y-2.5">
            {current.options.map((opt, oi) => {
              const isChosen = oi === chosen;
              const isCorrect = mode === "practice" && answered && oi === current.correctIndex;
              const isWrong   = mode === "practice" && answered && isChosen && !isCorrect;
              return (
                <button key={oi}
                  onClick={() => selectAnswer(oi)}
                  disabled={mode === "strict" && answered}
                  className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-[1.005]"
                  style={{
                    background: isCorrect ? "rgba(16,185,129,0.12)" : isWrong ? "rgba(239,68,68,0.09)" : isChosen ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${isCorrect ? "rgba(16,185,129,0.40)" : isWrong ? "rgba(239,68,68,0.30)" : isChosen ? "rgba(99,102,241,0.40)" : "rgba(255,255,255,0.25)"}`,
                    backdropFilter: "blur(12px)",
                  }}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0"
                    style={{ background: isCorrect ? "#10b981" : isWrong ? "#ef4444" : isChosen ? "#6366f1" : "#9ca3af" }}>
                    {optLabels[oi]}
                  </span>
                  <span className={`${isCorrect ? "text-emerald-800 dark:text-emerald-200 font-black" : isWrong ? "text-red-800 dark:text-red-300" : isChosen ? "text-indigo-800 dark:text-indigo-200 font-black" : "text-gray-800 dark:text-gray-100"}`}>
                    {opt}
                  </span>
                  {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
                  {isWrong && <X className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation in practice mode */}
          {mode === "practice" && answered && current.explanation && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs font-semibold">
              💡 {current.explanation}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 gap-3">
            {mode === "practice" && (
              <button onClick={prev} disabled={currentIdx === 0}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl liquid-card text-sm font-black text-gray-700 dark:text-gray-200 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" /> {isAssamese ? "পূৰ্বৱৰ্তী" : "Prev"}
              </button>
            )}
            {currentIdx < questions.length - 1 ? (
              <button onClick={next}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-white font-black text-sm"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                {isAssamese ? "পৰৱৰ্তী" : "Next"} <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setShowConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-black text-sm"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <Trophy className="w-4 h-4" /> {isAssamese ? "জমা দিয়ক" : "Submit Exam"}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Confirm submit modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
          <div className="liquid-panel rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-gray-900 dark:text-gray-100">
                  {isAssamese ? "পৰীক্ষা জমা দিবনে?" : "Submit the exam?"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  {answeredCount}/{questions.length} {isAssamese ? "উত্তৰ দিয়া হৈছে" : "answered"}.
                  {answeredCount < questions.length && ` ${questions.length - answeredCount} ${isAssamese ? "খালি আছে" : "unanswered"}.`}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl liquid-card font-black text-sm text-gray-700 dark:text-gray-200">
                {isAssamese ? "বাতিল" : "Cancel"}
              </button>
              <button onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl text-white font-black text-sm"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                {isAssamese ? "জমা দিয়ক" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result overlay */}
      {isSubmitted && result && (
        <ResultScreen
          result={result}
          questions={questions}
          answers={answers}
          timeTakenMs={timeTakenMs}
          isAssamese={isAssamese}
          onClose={() => setLocation("/practice")}
        />
      )}
    </div>
  );
}
