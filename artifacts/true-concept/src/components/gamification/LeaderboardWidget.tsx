import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { getLevelForXP } from "@/lib/gamification/xp-config";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardWidget() {
  const { entries, isLoading, myRank } = useLeaderboard(10);
  const { user } = useAuth();
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";

  if (isLoading) {
    return (
      <div className="liquid-panel rounded-3xl p-5 space-y-3 animate-pulse">
        <div className="h-5 liquid-card rounded-lg w-1/3" />
        {[1,2,3].map(i => <div key={i} className="h-12 liquid-card rounded-2xl" />)}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-panel rounded-3xl p-5"
      data-testid="leaderboard-widget"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="font-black text-base text-gray-900 dark:text-gray-100">
            {isAs ? "সাপ্তাহিক লিডাৰবোৰ্ড" : "Weekly Leaderboard"}
          </h2>
        </div>
        {myRank && (
          <span className="text-xs font-black px-2.5 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
            #{myRank} {isAs ? "আপোনাৰ স্থান" : "Your rank"}
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold text-center py-4">
          {isAs ? "এতিয়ালৈকে কোনো ডেটা নাই" : "No data yet — start earning XP!"}
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const levelDef  = getLevelForXP(entry.totalXP);
            const isMe      = entry.uid === user?.id;
            return (
              <div
                key={entry.uid}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors ${
                  isMe ? "ring-2 ring-orange-400/50" : ""
                }`}
                style={{ background: isMe ? "rgba(249,115,22,0.10)" : "rgba(0,0,0,0.03)" }}
              >
                {/* Rank */}
                <span className="text-base w-7 text-center shrink-0 font-black">
                  {entry.rank <= 3 ? MEDAL[entry.rank - 1] : `#${entry.rank}`}
                </span>

                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${levelDef.color}, ${levelDef.color}88)` }}
                >
                  {entry.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>

                {/* Name + level */}
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm truncate ${isMe ? "text-orange-700 dark:text-orange-300" : "text-gray-900 dark:text-gray-100"}`}>
                    {isMe ? (isAs ? "আপুনি" : "You") : entry.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold truncate">
                    {levelDef.emoji} {isAs ? levelDef.titleAs : levelDef.title}
                    {entry.badgeCount > 0 && ` · ${entry.badgeCount} 🏅`}
                  </p>
                </div>

                {/* Weekly XP */}
                <span className="font-black text-sm shrink-0" style={{ color: levelDef.color }}>
                  {entry.weeklyXP.toLocaleString("en-IN")}
                  <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 ml-0.5">XP</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
