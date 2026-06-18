/**
 * Practice Hub — /practice
 *
 * Two sections:
 *   1. Daily Challenge — today's status + start/continue button
 *   2. Mock Exam — pick class, pick mode, see past results
 *
 * Banner ad is shown (same as chapters/labs pages).
 */

import { useState, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Clock, CheckCircle, Play, BarChart2, ChevronRight, FlaskConical, BookOpen, Flame, ArrowLeft, Lock, Unlock } from "lucide-react";
import { useDailyChallenge, useChallengeHistory } from "@/hooks/useDailyChallenge";
import { useMockExamHistory, type MockExamMode } from "@/hooks/useMockExam";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { showRewardedFor } from "@/ads/rewarded-manager";
import { isMockExamUnlocked, unlockMockExamForToday } from "@/ads/mock-exam-unlock";
import WebInterstitial from "@/ads/web-interstitial/WebInterstitial";
import UnlockModal from "@/ads/components/UnlockModal";

/* eslint-disable @typescript-eslint/no-explicit-any */
function isNativeApp(): boolean {
  const Cap = (window as any).Capacitor;
  return Cap?.isNativePlatform?.() === true;
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDate(dateKey: string): string {
  if (!dateKey) return "";
  const d = new Date(dateKey);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <span className="font-black text-sm" style={{ color }}>{score}%</span>
  );
}

export default function PracticePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const [unlocked, setUnlocked] = useState(() => isMockExamUnlocked());
  // Web interstitial state — stores the pending mode while the 30s popup shows
  const [webInterstitialMode, setWebInterstitialMode] = useState<MockExamMode | null>(null);
  // Native unlock-modal state — stores the pending mode while the "Watch ad to
  // unlock" popup is shown on Android (mirrors the UnlockGate pattern).
  const [unlockModalMode, setUnlockModalMode] = useState<MockExamMode | null>(null);
  const isAssamese = prefs?.medium === "Assamese";
  const classLevel = prefs?.class ?? "Class IX";

  // Called when the web interstitial 30s countdown finishes.
  const handleWebInterstitialComplete = useCallback(() => {
    unlockMockExamForToday();
    setUnlocked(true);
    const pendingMode = webInterstitialMode;
    setWebInterstitialMode(null);
    if (pendingMode) {
      setLocation(`/practice/mock-exam-subjects?mode=${pendingMode}&class=${encodeURIComponent(classLevel)}`);
    }
  }, [webInterstitialMode, classLevel, setLocation]);

  // Gate handler — platform-aware:
  //   Web     → 30-second WebInterstitial (tip + AdSense ad)
  //   Android → "Watch ad to unlock" UnlockModal popup → rewarded AdMob ad
  const handleMockExamTap = (mode: MockExamMode) => {
    if (unlocked) {
      setLocation(`/practice/mock-exam-subjects?mode=${mode}&class=${encodeURIComponent(classLevel)}`);
      return;
    }
    if (!isNativeApp()) {
      // Web path: show the 30-second tip+AdSense interstitial
      setWebInterstitialMode(mode);
      return;
    }
    // Android path: show the "Watch ad to unlock" popup first (same modal used
    // by notes / MCQ / Q&A / lab). The rewarded ad only fires when the student
    // taps "Watch Ad" inside the modal.
    setUnlockModalMode(mode);
  };

  // Called from the native UnlockModal's "Watch Ad" button. Resolves true when
  // the rewarded ad is fully watched; on success we unlock + navigate.
  const handleWatchMockAd = useCallback(async (): Promise<boolean> => {
    const earned = await showRewardedFor("mock_exam");
    if (earned) {
      unlockMockExamForToday();
      setUnlocked(true);
      const pendingMode = unlockModalMode;
      setUnlockModalMode(null);
      if (pendingMode) {
        setLocation(`/practice/mock-exam-subjects?mode=${pendingMode}&class=${encodeURIComponent(classLevel)}`);
      }
    }
    return earned;
  }, [unlockModalMode, classLevel, setLocation]);

  const { challenge, isLoading: challengeLoading, isCompleted, isInProgress } = useDailyChallenge();
  const { history: challengeHistory } = useChallengeHistory(7);
  const { sessions: mockSessions, isLoading: mockLoading } = useMockExamHistory(10);

  const L = {
    hub:           isAssamese ? "প্ৰশিক্ষণ কেন্দ্ৰ"     : "Practice Hub",
    subtitle:      isAssamese ? "দৈনিক চেট আৰু মক পৰীক্ষা" : "Daily Challenge & Mock Exams",
    daily:         isAssamese ? "দৈনিক প্ৰত্যাহ্বান"   : "Daily Challenge",
    dailySub:      isAssamese ? "১০টা মিশ্ৰিত প্ৰশ্ন"  : "10 mixed questions",
    start:         isAssamese ? "আৰম্ভ কৰক"             : "Start",
    cont:          isAssamese ? "অব্যাহত ৰাখক"           : "Continue",
    done:          isAssamese ? "সম্পূৰ্ণ"              : "Done",
    mock:          isAssamese ? "মক পৰীক্ষা"            : "Mock Exam",
    mockSub:       isAssamese ? "৫০টা প্ৰশ্ন · ১ ঘণ্টা" : "50 questions · 1 hour",
    strict:        isAssamese ? "কঠোৰ মোড"              : "Strict Mode",
    strictDesc:    isAssamese ? "টাইমাৰ · পিছলৈ যোৱা নহয়" : "Timer · No going back",
    practice:      isAssamese ? "অভ্যাস মোড"            : "Practice Mode",
    practiceDesc:  isAssamese ? "কোনো টাইমাৰ নাই · পৰীক্ষা কৰক" : "No timer · Review answers",
    history:       isAssamese ? "পূৰ্বৰ ফলাফল"          : "Past Results",
    noHistory:     isAssamese ? "এতিয়ালৈকে কোনো মক পৰীক্ষা নাই" : "No mock exams yet",
    correct:       isAssamese ? "শুদ্ধ"                  : "correct",
    streak:        isAssamese ? "দিনৰ ষ্ট্ৰিক"          : "day streak",
  };

  const done    = challenge?.answers ? Object.keys(challenge.answers).length : 0;
  const total   = challenge?.totalQuestions ?? 10;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg space-y-6">
      {/* Back button — nav pill is hidden on this page */}
      <button
        onClick={() => setLocation("/dashboard")}
        className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="w-4 h-4" /> {isAssamese ? "হোমলৈ যাওক" : "Back to Home"}
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)" }}>
        <div className="absolute top-2 right-4 text-[100px] opacity-10 leading-none select-none">🏆</div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 uppercase tracking-wider mb-3">
            <Trophy className="w-3 h-3" /> {L.hub}
          </span>
          <h1 className="font-black text-2xl sm:text-3xl mb-1">{L.hub}</h1>
          <p className="text-white/85 text-sm font-medium">{L.subtitle}</p>
        </div>
      </div>

      {/* ── Daily Challenge ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
            <Flame className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-black text-base text-gray-900 dark:text-gray-100">{L.daily}</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">{L.dailySub}</span>
        </div>

        {challengeLoading ? (
          <div className="liquid-card rounded-2xl h-24 animate-pulse" />
        ) : challenge ? (
          <Link href="/practice/challenge">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="liquid-card rounded-2xl p-4 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: isCompleted
                  ? "linear-gradient(90deg, #10b981, #14b8a6)"
                  : "linear-gradient(90deg, #f97316, #fbbf24)" }} />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ background: isCompleted
                    ? "linear-gradient(135deg, #10b981, #14b8a6)"
                    : "linear-gradient(135deg, #f97316, #ea580c)" }}>
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  {isCompleted ? (
                    <>
                      <p className="font-black text-sm text-emerald-700 dark:text-emerald-300">{L.done}! {challenge.correctCount}/{total} {L.correct}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Score: <ScoreBadge score={challenge.score} /></p>
                    </>
                  ) : (
                    <>
                      <p className="font-black text-sm text-gray-900 dark:text-gray-100">
                        {isInProgress ? L.cont : L.start} — {total} questions
                      </p>
                      {isInProgress && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f97316, #fbbf24)" }} />
                          </div>
                          <span className="text-[10px] font-black text-orange-600">{done}/{total}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: isCompleted ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg, #f97316, #ea580c)" }}>
                  {isCompleted
                    ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                    : <Play className="w-4 h-4 fill-white" />}
                </div>
              </div>
            </motion.div>
          </Link>
        ) : (
          <div className="liquid-card rounded-2xl p-4 text-center text-gray-500 dark:text-gray-400 text-sm font-semibold">
            No questions available yet. Admin is adding content.
          </div>
        )}

        {/* 7-day challenge history */}
        {challengeHistory.filter((c) => c.status === "completed").length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {challengeHistory.map((c) => (
              <div key={c.dateKey} className="shrink-0 flex flex-col items-center gap-1 liquid-card rounded-xl px-3 py-2">
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400">{formatDate(c.dateKey)}</span>
                {c.status === "completed"
                  ? <ScoreBadge score={c.score} />
                  : <span className="text-xs text-gray-300 dark:text-gray-600">—</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Mock Exam ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-black text-base text-gray-900 dark:text-gray-100">{L.mock}</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">50 {isAssamese ? "প্ৰশ্ন · ১ ঘণ্টা" : "questions · 1 hour"}</span>
        </div>

        {/* Unlock status banner */}
        {unlocked ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-emerald-700 dark:text-emerald-300 mb-1"
            style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <Unlock className="w-3.5 h-3.5" />
            {isAssamese ? "আজিৰ বাবে আনলক হৈছে ✅" : "Unlocked for today ✅"}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-orange-700 dark:text-orange-300 mb-1"
            style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.25)" }}>
            <Lock className="w-3.5 h-3.5" />
            {isAssamese ? "এটা চুটি ভিডিঅ' চাই আনলক কৰক" : "Watch a short ad to unlock for today"}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Strict mode */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => handleMockExamTap("strict")}
            className="liquid-card rounded-2xl p-4 cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-gray-900 dark:text-gray-100">{L.strict}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{L.strictDesc}</p>
              </div>
              {unlocked
                ? <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors shrink-0 mt-1" />
                : <Lock className="w-4 h-4 text-orange-400 shrink-0 mt-1" />}
            </div>
          </motion.div>

          {/* Practice mode */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => handleMockExamTap("practice")}
            className="liquid-card rounded-2xl p-4 cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-gray-900 dark:text-gray-100">{L.practice}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{L.practiceDesc}</p>
              </div>
              {unlocked
                ? <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0 mt-1" />
                : <Lock className="w-4 h-4 text-orange-400 shrink-0 mt-1" />}
            </div>
          </motion.div>
        </div>

        {/* Past mock exam results */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <h3 className="font-black text-sm text-gray-700 dark:text-gray-300">{L.history}</h3>
          </div>
          {mockLoading ? (
            <div className="space-y-2">
              {[1,2].map(i => <div key={i} className="h-14 liquid-card rounded-xl animate-pulse" />)}
            </div>
          ) : mockSessions.length === 0 ? (
            <div className="liquid-card rounded-xl p-4 text-center text-gray-500 dark:text-gray-400 text-sm font-semibold">
              {L.noHistory}
            </div>
          ) : (
            <div className="space-y-2">
              {mockSessions.map((s) => (
                <div key={s.sessionId} className="liquid-card rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ background: s.mode === "strict"
                      ? "linear-gradient(135deg, #ef4444, #dc2626)"
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    {s.mode === "strict" ? <Clock className="w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs text-gray-900 dark:text-gray-100">
                      {s.classLevel} · {formatDate(s.dateKey)}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                      {s.correctCount}/{s.totalQuestions} {L.correct} · {formatTime(s.timeTakenMs)}
                    </p>
                  </div>
                  <ScoreBadge score={s.score} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Web interstitial — 30s tip + AdSense ad shown on web when student taps
          a locked mock exam mode. Completes → unlocks for 1 day → navigates. */}
      {webInterstitialMode && (
        <WebInterstitial onComplete={handleWebInterstitialComplete} />
      )}

      {/* Native unlock popup — "Watch ad to unlock the Mock Exam" shown on
          Android. Tapping "Watch Ad" plays the rewarded ad; on success it
          unlocks for the day and navigates to the subject picker. */}
      {unlockModalMode && (
        <UnlockModal
          feature="mock_exam"
          onWatchAd={handleWatchMockAd}
          onDismiss={() => setUnlockModalMode(null)}
        />
      )}
    </div>
  );
}
