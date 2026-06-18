/**
 * Achievements Page — /achievements
 * Full view of XP, level, all 18 badges (earned + locked), stats and leaderboard.
 */

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Lock, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { useGamification } from "@/hooks/useGamification";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { BADGES, LEVELS, getLevelForXP, getXPToNextLevel, type BadgeDef } from "@/lib/gamification/xp-config";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

// ── Badge detail modal ─────────────────────────────────────────────────────────

function BadgeDetailModal({ badge, earned, onClose }: { badge: BadgeDef; earned: boolean; onClose: () => void }) {
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";
  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="liquid-panel rounded-3xl p-6 max-w-xs w-full text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-xl hover:bg-muted">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="text-5xl">{badge.emoji}</div>
        <div>
          <h3 className="font-black text-lg text-gray-900 dark:text-gray-100">
            {isAs ? badge.nameAs : badge.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">
            {badge.description}
          </p>
        </div>

        {earned ? (
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-white font-black text-sm"
            style={{ background: `linear-gradient(135deg, ${badge.color}, ${badge.color}88)` }}>
            ✅ {isAs ? "অৰ্জিত" : "Earned"}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-gray-500 dark:text-gray-400 font-semibold text-sm liquid-inner">
            <Lock className="w-4 h-4" /> {isAs ? "এতিয়ালৈকে লক" : "Not earned yet"}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const [, setLocation] = useLocation();
  const { totalXP, weeklyXP, level, xpToNext, xpInCurrentLevel, progressPct, earnedBadges, isLoading } = useGamification();
  const { entries: leaderboard } = useLeaderboard(5);
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";
  const [selectedBadge, setSelectedBadge] = useState<BadgeDef | null>(null);

  const earnedIds = new Set(earnedBadges.map((b) => b.id));
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1) ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg space-y-6">
      {/* Back */}
      <button onClick={() => setLocation("/dashboard")}
        className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {isAs ? "হোমলৈ" : "Back to Home"}
      </button>

      {/* Hero — Level card */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl"
        style={{ background: `linear-gradient(135deg, ${level.color}CC, ${level.color}88)` }}>
        <div className="absolute top-2 right-4 text-[90px] opacity-15 leading-none select-none">{level.emoji}</div>
        <div className="relative flex items-center gap-4">
          <div className="text-5xl">{level.emoji}</div>
          <div className="flex-1">
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
              {isAs ? "আপোনাৰ স্তৰ" : "Your Level"}
            </p>
            <h1 className="font-black text-2xl">{isAs ? level.titleAs : level.title}</h1>
            <p className="text-white/80 text-sm font-semibold">
              {isAs ? `স্তৰ ${level.level}` : `Level ${level.level}`} · {totalXP.toLocaleString("en-IN")} XP {isAs ? "মুঠ" : "total"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/60 text-[10px] font-black uppercase">{isAs ? "এই সপ্তাহ" : "This week"}</p>
            <p className="font-black text-xl">{weeklyXP}</p>
            <p className="text-white/60 text-[10px] font-semibold">XP</p>
          </div>
        </div>

        {/* XP progress to next level */}
        {nextLevel && (
          <div className="relative mt-4">
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "rgba(255,255,255,0.85)" }}
                initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-white/70 font-semibold">
              <span>{xpInCurrentLevel} XP</span>
              <span>{xpToNext} XP {isAs ? "আৰু লাগিব" : "to"} {isAs ? nextLevel.titleAs : nextLevel.title} {nextLevel.emoji}</span>
            </div>
          </div>
        )}
      </div>

      {/* Badges grid */}
      <div>
        <h2 className="font-black text-base text-gray-900 dark:text-gray-100 mb-3">
          🏅 {isAs ? "বেজসমূহ" : "Badges"} · {earnedBadges.length}/{BADGES.length}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {BADGES.map((badge) => {
            const earned = earnedIds.has(badge.id);
            return (
              <motion.button key={badge.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedBadge(badge)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl liquid-card cursor-pointer relative"
                style={earned ? { borderColor: `${badge.color}55`, boxShadow: `0 0 12px ${badge.color}30` } : {}}
              >
                <span className={`text-2xl ${!earned ? "grayscale opacity-40" : ""}`}>{badge.emoji}</span>
                <span className={`text-[10px] font-black text-center leading-tight line-clamp-2 ${earned ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-600"}`}>
                  {isAs ? badge.nameAs : badge.name}
                </span>
                {!earned && (
                  <Lock className="w-3 h-3 text-gray-400 dark:text-gray-600 absolute top-2 right-2" />
                )}
                {earned && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: badge.color }} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* All levels roadmap */}
      <div>
        <h2 className="font-black text-base text-gray-900 dark:text-gray-100 mb-3">
          🗺️ {isAs ? "স্তৰৰ মানচিত্ৰ" : "Level Roadmap"}
        </h2>
        <div className="space-y-2">
          {LEVELS.map((lvl) => {
            const isCurrent = lvl.level === level.level;
            const isPast    = lvl.level < level.level;
            return (
              <div key={lvl.level}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                  isCurrent ? "ring-2" : isPast ? "opacity-60" : ""
                }`}
                style={{
                  background: isCurrent ? `${lvl.color}15` : "rgba(0,0,0,0.03)",
                  ...(isCurrent ? { ringColor: lvl.color } : {}),
                  border: isCurrent ? `1px solid ${lvl.color}55` : "1px solid transparent",
                }}>
                <span className="text-xl w-8 text-center">{lvl.emoji}</span>
                <div className="flex-1">
                  <p className={`font-black text-sm ${isCurrent ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
                    {isAs ? lvl.titleAs : lvl.title}
                    {isCurrent && <span className="ml-2 text-[10px] font-bold text-orange-500">{isAs ? "← আপুনি এতিয়াত" : "← You are here"}</span>}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                    {isAs ? `স্তৰ ${lvl.level}` : `Level ${lvl.level}`} · {lvl.minXP.toLocaleString("en-IN")} XP
                    {isPast && " ✅"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini leaderboard */}
      {leaderboard.length > 0 && (
        <div>
          <h2 className="font-black text-base text-gray-900 dark:text-gray-100 mb-3">
            <Trophy className="w-4 h-4 inline mr-1 text-amber-500" />
            {isAs ? "সাপ্তাহিক শীৰ্ষ ৫" : "Weekly Top 5"}
          </h2>
          <div className="space-y-2">
            {leaderboard.map((e, i) => {
              const medals = ["🥇","🥈","🥉"];
              return (
                <div key={e.uid} className="flex items-center gap-3 px-4 py-2.5 liquid-card rounded-2xl">
                  <span className="w-7 text-center font-black text-sm">{i < 3 ? medals[i] : `#${i+1}`}</span>
                  <div className="flex-1"><p className="font-black text-sm text-gray-900 dark:text-gray-100">{e.name}</p></div>
                  <span className="font-black text-sm text-orange-600 dark:text-orange-400">{e.weeklyXP} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badge detail modal */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal badge={selectedBadge} earned={earnedIds.has(selectedBadge.id)} onClose={() => setSelectedBadge(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
