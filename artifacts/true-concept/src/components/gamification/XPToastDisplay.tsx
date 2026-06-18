/**
 * XPToastDisplay — mounts once in Layout.tsx and listens for XP award events.
 * Shows a "+10 XP · Note read" toast that animates in and fades after 2.5s.
 * Multiple awards stack briefly then the latest wins (no queue needed).
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { onXPAwarded } from "@/lib/gamification/xp-toast-event";

interface Toast { id: number; amount: number; label: string }

export default function XPToastDisplay() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let counter = 0;
    const unsub = onXPAwarded((amount, label) => {
      const id = ++counter;
      setToasts((prev) => [...prev.slice(-2), { id, amount, label }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    });
    return unsub;
  }, []);

  return (
    <div className="fixed bottom-24 right-4 z-[10400] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.85 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{   opacity: 0, x: 40,  scale: 0.85 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-white shadow-2xl text-sm font-black"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 8px 24px rgba(249,115,22,0.45)",
            }}
          >
            <Zap className="w-4 h-4 fill-white shrink-0" />
            <span>+{t.amount} XP</span>
            {t.label && (
              <span className="text-white/80 font-semibold text-xs">· {t.label}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
