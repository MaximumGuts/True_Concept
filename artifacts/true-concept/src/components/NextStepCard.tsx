import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { NextStep } from "@/lib/next-step";

interface NextStepCardProps {
  step: NextStep;
  /** compact = small inline card, default = full card */
  compact?: boolean;
  onDismiss?: () => void;
}

export default function NextStepCard({ step, compact = false, onDismiss }: NextStepCardProps) {
  const gradMap: Record<string, string> = {
    mcq:          "linear-gradient(135deg,#da6b45,#b85535)",
    notes:        "linear-gradient(135deg,#6366f1,#4f46e5)",
    qa:           "linear-gradient(135deg,#0891b2,#0e7490)",
    lab:          "linear-gradient(135deg,#059669,#047857)",
    "next-chapter": "linear-gradient(135deg,#7c3aed,#6d28d9)",
    revision:     "linear-gradient(135deg,#d97706,#b45309)",
  };
  const grad = gradMap[step.type] ?? gradMap.notes;

  const href = step.chapterId
    ? `/chapters/${step.chapterId}${step.tab ? `?tab=${step.tab}` : ""}`
    : "/subjects";

  if (compact) {
    return (
      <Link href={href}>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer hover:scale-[1.01] transition-transform"
          style={{ background: grad }}
          onClick={onDismiss}
        >
          <span className="text-xl shrink-0">{step.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-xs leading-tight">{step.title}</p>
            <p className="text-white/80 text-[11px] truncate">{step.message}</p>
          </div>
          <div className="flex items-center gap-1 text-white text-xs font-black shrink-0">
            {step.actionLabel} <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="rounded-3xl p-5 overflow-hidden relative"
      style={{ background: grad }}
    >
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle,white,transparent)" }} />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{step.emoji}</span>
          <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">What To Do Next</p>
        </div>
        <p className="text-white font-black text-base leading-snug mb-1">{step.title}</p>
        <p className="text-white/80 text-sm leading-relaxed mb-4">{step.message}</p>

        <div className="flex items-center gap-3">
          <Link href={href}>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.2)" }}
              onClick={onDismiss}
            >
              {step.actionLabel} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-white/60 text-xs font-semibold hover:text-white/80 transition-colors"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
