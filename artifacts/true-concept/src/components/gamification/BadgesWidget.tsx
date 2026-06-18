import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronRight, Lock, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { useGamification } from "@/hooks/useGamification";
import { BADGES, type BadgeDef } from "@/lib/gamification/xp-config";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

function BadgeDetailModal({ badge, earned, onClose }: { badge: BadgeDef; earned: boolean; onClose: () => void }) {
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";
  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="liquid-panel rounded-3xl p-6 max-w-xs w-full text-center space-y-4 relative"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-xl hover:bg-muted">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className={`text-5xl ${!earned ? "grayscale opacity-50" : ""}`}>{badge.emoji}</div>
        <div>
          <h3 className="font-black text-lg text-gray-900 dark:text-gray-100">{isAs ? badge.nameAs : badge.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">{badge.description}</p>
        </div>
        {earned
          ? <div className="px-4 py-2 rounded-2xl text-white font-black text-sm" style={{ background: `linear-gradient(135deg, ${badge.color}, ${badge.color}88)` }}>✅ {isAs ? "অৰ্জিত" : "Earned"}</div>
          : <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl liquid-inner text-gray-500 dark:text-gray-400 font-semibold text-sm"><Lock className="w-4 h-4" /> {isAs ? "এতিয়ালৈকে লক" : "Not earned yet"}</div>}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default function BadgesWidget() {
  const { earnedBadges, isLoading } = useGamification();
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";
  const [selected, setSelected] = useState<BadgeDef | null>(null);

  if (isLoading) return <div className="liquid-card rounded-2xl p-4 animate-pulse h-28" />;

  const earnedIds = new Set(earnedBadges.map((b) => b.id));
  // Show first 6 badges (earned first, then locked) to keep widget compact
  const sorted = [...BADGES].sort((a, b) => {
    const aE = earnedIds.has(a.id) ? 0 : 1;
    const bE = earnedIds.has(b.id) ? 0 : 1;
    return aE - bE;
  });
  const preview = sorted.slice(0, 6);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="liquid-card rounded-2xl p-4" data-testid="badges-widget">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <p className="font-black text-sm text-gray-900 dark:text-gray-100">
            {isAs ? "বেজ" : "Badges"} · {earnedBadges.length}/{BADGES.length}
          </p>
        </div>
        <Link href="/achievements">
          <button className="flex items-center gap-0.5 text-[10px] font-black text-orange-600 dark:text-orange-400 hover:underline">
            {isAs ? "সকলো চাওক" : "View all"} <ChevronRight className="w-3 h-3" />
          </button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {preview.map((badge) => {
          const earned = earnedIds.has(badge.id);
          return (
            <motion.button key={badge.id} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(badge)}
              title={isAs ? badge.nameAs : badge.name}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl relative ${!earned ? "grayscale opacity-40" : ""}`}
              style={earned ? { background: `${badge.color}22`, border: `1px solid ${badge.color}44` } : { background: "rgba(0,0,0,0.05)" }}>
              {badge.emoji}
              {!earned && <Lock className="w-2.5 h-2.5 text-gray-400 absolute -bottom-0.5 -right-0.5" />}
            </motion.button>
          );
        })}
        {BADGES.length > 6 && (
          <Link href="/achievements">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-muted"
              style={{ background: "rgba(0,0,0,0.05)" }}>
              +{BADGES.length - 6}
            </div>
          </Link>
        )}
      </div>

      <AnimatePresence>
        {selected && <BadgeDetailModal badge={selected} earned={earnedIds.has(selected.id)} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
