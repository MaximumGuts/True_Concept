import { Trophy, Target } from "lucide-react";
import type { McqProgress } from "@/lib/progress/types";

interface McqStatusBadgeProps {
  progress: McqProgress | undefined;
  /** Compact mode shows only the score, no label. */
  compact?: boolean;
}

/**
 * Visual indicator for MCQ set progress. Shows "best score" + status.
 * Returns null for sets that have never been attempted.
 */
export default function McqStatusBadge({ progress, compact }: McqStatusBadgeProps) {
  if (!progress || progress.attemptCount === 0) return null;

  const isCompleted = progress.status === "completed";
  const score = progress.bestScore;

  // Color based on score band
  const colorBand =
    score >= 80 ? { bg: "rgba(22,163,74,0.15)", fg: "#16a34a" } :   // green — completed
    score >= 60 ? { bg: "rgba(245,158,11,0.15)", fg: "#d97706" } :  // amber — practiced well
                  { bg: "rgba(99,102,241,0.15)", fg: "#6366f1" };   // indigo — attempted

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
      style={{ background: colorBand.bg, color: colorBand.fg }}
      title={`Best: ${score}% • Attempts: ${progress.attemptCount}`}
    >
      {isCompleted ? <Trophy className="w-3 h-3" /> : <Target className="w-3 h-3" />}
      {compact ? `${score}%` : `${score}% best`}
    </span>
  );
}

/** Detailed score line (for MCQ list rows). */
export function McqScoreLine({ progress }: { progress: McqProgress | undefined }) {
  if (!progress || progress.attemptCount === 0) {
    return <span className="text-xs font-semibold text-muted-foreground">Not attempted</span>;
  }
  return (
    <span className="text-xs font-semibold text-muted-foreground">
      Best: <span className="font-black text-foreground">{progress.bestScore}%</span> ·
      <span className="ml-1">{progress.attemptCount} attempt{progress.attemptCount > 1 ? "s" : ""}</span>
    </span>
  );
}
