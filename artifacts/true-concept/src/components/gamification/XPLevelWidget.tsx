import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useGamification } from "@/hooks/useGamification";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

export default function XPLevelWidget() {
  const { totalXP, weeklyXP, level, xpToNext, xpInCurrentLevel, progressPct, isLoading } = useGamification();
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";

  if (isLoading) {
    return <div className="liquid-card rounded-2xl p-4 animate-pulse h-24" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-card rounded-2xl p-4"
      data-testid="xp-level-widget"
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Level badge */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md"
          style={{ background: `linear-gradient(135deg, ${level.color}, ${level.color}88)` }}
        >
          {level.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-black text-sm text-gray-900 dark:text-gray-100">
              {isAs ? level.titleAs : level.title}
            </p>
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {isAs ? "স্তৰ" : "Level"} {level.level}
            </span>
          </div>
          {/* XP progress bar */}
          <div className="mt-1.5 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${level.color}, ${level.color}88)` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
              {xpInCurrentLevel} / {xpInCurrentLevel + xpToNext} XP
            </span>
            {xpToNext > 0 && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                {xpToNext} XP {isAs ? "বাকি আছে" : "to next level"}
              </span>
            )}
          </div>
        </div>

        {/* Weekly XP chip */}
        <div className="shrink-0 flex flex-col items-center gap-0.5">
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-black text-xs text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            <Zap className="w-3 h-3" />
            <span>{weeklyXP}</span>
          </div>
          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold uppercase">
            {isAs ? "সাপ্তাহিক" : "This week"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        <span>🌟 {totalXP.toLocaleString("en-IN")} {isAs ? "মুঠ XP" : "Total XP"}</span>
        <Link href="/achievements">
          <button className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 hover:underline">
            {isAs ? "সকলো চাওক" : "View all"} <ChevronRight className="w-3 h-3" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
