/**
 * DailyChallengeCard — shown on the dashboard above the AI Mentor card.
 * Shows today's challenge status: pending → in-progress → completed.
 * Tapping the card/button navigates to /practice/challenge.
 * Bilingual labels respect the student's medium preference.
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, Play, Flame } from "lucide-react";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

export default function DailyChallengeCard() {
  const { challenge, isLoading, isCompleted, isPending, isInProgress } = useDailyChallenge();
  const { prefs } = useStudentPrefs();
  const isAssamese = prefs?.medium === "Assamese";

  const L = {
    title:         isAssamese ? "দৈনিক প্ৰত্যাহ্বান"   : "Daily Challenge",
    pending:       isAssamese ? "আজিৰ চেট আৰম্ভ কৰক"   : "Start Today's Challenge",
    inProgress:    isAssamese ? "চেট অব্যাহত ৰাখক"       : "Continue Challenge",
    completed:     isAssamese ? "আজিৰ চেট সম্পূৰ্ণ!"    : "Today's Challenge Done!",
    questions:     isAssamese ? "প্ৰশ্ন"                  : "questions",
    keepStreak:    isAssamese ? "ষ্ট্ৰিক ৰক্ষা কৰক"      : "Complete to keep your streak",
    tomorrow:      isAssamese ? "কাইলৈ নতুন চেট আসিব"  : "New challenge tomorrow",
    mixed:         isAssamese ? "মিশ্ৰিত বিষয়"           : "Mixed subjects",
    minutes:       isAssamese ? "মিনিট"                   : "min",
  };

  if (isLoading) {
    return (
      <div className="liquid-card rounded-3xl p-5 animate-pulse flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-200/40 dark:bg-orange-500/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-lg w-1/3" />
          <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-lg w-2/3" />
        </div>
      </div>
    );
  }

  // No challenge yet (no MCQs found for this student) — show a teaser card
  // so the section is always visible on the dashboard. The message nudges the
  // admin to add MCQs; once content exists the card auto-upgrades next day.
  if (!challenge) {
    return (
      <div className="liquid-card rounded-3xl p-5 flex items-center gap-4 opacity-70">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          <Trophy className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
            {L.title}
          </p>
          <p className="font-black text-sm text-gray-700 dark:text-gray-300">
            {isAssamese ? "MCQ যোগ হ'লে উপলব্ধ হ'ব" : "Available once MCQs are added"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            {isAssamese ? "Admin এ content যোগ কৰিব" : "Admin is adding content soon"}
          </p>
        </div>
      </div>
    );
  }

  const done    = challenge.answers ? Object.keys(challenge.answers).length : 0;
  const total   = challenge.totalQuestions;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link href="/practice/challenge">
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        className="relative liquid-card rounded-3xl p-5 cursor-pointer overflow-hidden"
        data-testid="daily-challenge-card"
      >
        {/* Gradient accent strip at top */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          style={{ background: isCompleted
            ? "linear-gradient(90deg, #10b981, #14b8a6)"
            : "linear-gradient(90deg, #f97316, #fbbf24)" }} />

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ background: isCompleted
                ? "linear-gradient(135deg, #10b981, #14b8a6)"
                : "linear-gradient(135deg, #f97316, #ea580c)" }}>
              {isCompleted
                ? <CheckCircle className="w-6 h-6" />
                : <Trophy className="w-6 h-6" />}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {L.title}
              </p>
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500">·</span>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500">
                {total} {L.questions} · ~{Math.ceil(total * 0.5)} {L.minutes} · {L.mixed}
              </p>
            </div>

            {isCompleted ? (
              <>
                <p className="font-black text-sm text-emerald-700 dark:text-emerald-300">
                  {L.completed} {challenge.correctCount}/{total} correct
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">{L.tomorrow}</p>
              </>
            ) : isInProgress ? (
              <>
                <p className="font-black text-sm text-gray-900 dark:text-gray-100">{L.inProgress}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f97316, #fbbf24)" }} />
                  </div>
                  <span className="text-[10px] font-black text-orange-600 dark:text-orange-300 shrink-0">{done}/{total}</span>
                </div>
              </>
            ) : (
              <>
                <p className="font-black text-sm text-gray-900 dark:text-gray-100">{L.pending}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <p className="text-xs text-orange-600 dark:text-orange-300 font-semibold">{L.keepStreak}</p>
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="shrink-0">
            {isCompleted ? (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)" }}>
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <Play className="w-4 h-4 fill-white" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
