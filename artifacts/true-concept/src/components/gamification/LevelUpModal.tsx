/**
 * LevelUpModal — full-screen celebration overlay when a student levels up.
 * Pure CSS confetti (no library), framer-motion for the entrance animation.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";
import type { LevelDef } from "@/lib/gamification/xp-config";

interface Props {
  newLevel: LevelDef;
  onClose: () => void;
}

const CONFETTI_COLORS = ["#f97316", "#fbbf24", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#da6b45"];
const CONFETTI_COUNT  = 40;

function Confetti() {
  const pieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    animDuration: `${0.8 + Math.random() * 1.4}s`,
    animDelay:    `${Math.random() * 0.5}s`,
    size:         `${6 + Math.random() * 8}px`,
    rotate:       `${Math.random() * 360}deg`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            transform: `rotate(${p.rotate})`,
            animation: `confettiFall ${p.animDuration} ${p.animDelay} ease-in forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function LevelUpModal({ newLevel, onClose }: Props) {
  const { prefs } = useStudentPrefs();
  const isAs = prefs?.medium === "Assamese";

  // Auto-close after 4 seconds
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10600] flex items-center justify-center"
      style={{ background: "rgba(8,5,24,0.88)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <Confetti />
      <motion.div
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1,   y: 0,  opacity: 1 }}
        exit={{   scale: 0.7, y: 40,  opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative flex flex-col items-center gap-5 px-8 py-10 rounded-3xl text-center max-w-xs mx-4"
        style={{
          background: "linear-gradient(135deg, rgba(28,18,68,0.96), rgba(20,14,48,0.96))",
          border: `2px solid ${newLevel.color}55`,
          boxShadow: `0 0 60px ${newLevel.color}44`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow orb */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${newLevel.color}22, transparent 70%)` }} />

        {/* Level emoji (bouncing) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 0.8, repeat: 2 }}
          className="text-7xl relative"
        >
          {newLevel.emoji}
        </motion.div>

        <div className="relative space-y-2">
          <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">
            {isAs ? "স্তৰ বৃদ্ধি!" : "Level Up!"}
          </p>
          <h2 className="font-black text-3xl text-white tracking-tight">
            {isAs ? newLevel.titleAs : newLevel.title}
          </h2>
          <p className="text-white/60 text-sm font-semibold">
            {isAs ? `স্তৰ ${newLevel.level} — অভিনন্দন!` : `Level ${newLevel.level} — Congratulations!`}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="relative px-6 py-2.5 rounded-2xl text-white font-black text-sm"
          style={{ background: `linear-gradient(135deg, ${newLevel.color}, ${newLevel.color}88)` }}
        >
          {isAs ? "অগ্ৰসৰ হওক 🚀" : "Keep Going 🚀"}
        </motion.button>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
