/**
 * XPCelebrationOverlay — mounts once in Layout.tsx and listens for "big win"
 * XP events (level-up, new badge, perfect score, challenge/streak milestones).
 *
 * Renders a full-screen confetti burst + a center card with the milestone.
 * No external confetti dependency — particles are framer-motion divs.
 * Auto-dismisses after ~3.2s; tap anywhere to dismiss early.
 */

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { onXPCelebration, type Celebration } from "@/lib/gamification/xp-celebration-event";

const AUTO_DISMISS_MS = 3200;
const CONFETTI_COLORS = ["#f97316", "#fbbf24", "#10b981", "#6366f1", "#ec4899", "#14b8a6", "#ef4444"];
const CONFETTI_COUNT = 40;

interface Piece {
  id: number;
  left: number;       // vw start position
  color: string;
  size: number;
  delay: number;
  drift: number;      // horizontal drift in px
  rotate: number;
  duration: number;
}

function makeConfetti(): Piece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 160,
    rotate: Math.random() * 720 - 360,
    duration: 1.8 + Math.random() * 1.2,
  }));
}

export default function XPCelebrationOverlay() {
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  // New confetti set each time a celebration opens.
  const [seed, setSeed] = useState(0);
  const pieces = useMemo(makeConfetti, [seed]);

  useEffect(() => {
    return onXPCelebration((c) => {
      setCelebration(c);
      setSeed((s) => s + 1);
    });
  }, []);

  useEffect(() => {
    if (!celebration) return;
    const t = window.setTimeout(() => setCelebration(null), AUTO_DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [celebration, seed]);

  return createPortal(
    <AnimatePresence>
      {celebration && (
        <motion.div
          className="fixed inset-0 z-[10600] flex items-center justify-center pointer-events-auto"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCelebration(null)}
        >
          {/* Confetti rain */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {pieces.map((p) => (
              <motion.div
                key={`${seed}-${p.id}`}
                className="absolute rounded-sm"
                style={{
                  left: `${p.left}vw`,
                  top: "-5%",
                  width: p.size,
                  height: p.size * 1.4,
                  background: p.color,
                }}
                initial={{ y: "-10vh", x: 0, opacity: 1, rotate: 0 }}
                animate={{ y: "110vh", x: p.drift, opacity: [1, 1, 0.9, 0], rotate: p.rotate }}
                transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
              />
            ))}
          </div>

          {/* Center card */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative mx-4 px-8 py-7 rounded-3xl text-center shadow-2xl max-w-xs"
            style={{
              background: "linear-gradient(160deg, #f97316 0%, #ea580c 60%, #dc2626 100%)",
              boxShadow: "0 24px 70px -16px rgba(249,115,22,0.6)",
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 11, delay: 0.1 }}
              className="text-6xl mb-3 select-none drop-shadow-lg"
            >
              {celebration.emoji}
            </motion.div>
            <h2 className="font-black text-white text-xl leading-tight mb-1.5">
              {celebration.title}
            </h2>
            <p className="text-white/85 text-sm font-semibold">
              {celebration.subtitle}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
