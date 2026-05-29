import { CheckCircle2, BookOpenCheck, Circle } from "lucide-react";
import type { NoteStatus } from "@/lib/progress/types";

interface NoteStatusBadgeProps {
  status: NoteStatus | undefined;
  scrollPercent?: number;
  /** Compact mode hides the label and just shows the icon. */
  compact?: boolean;
}

/**
 * Visual indicator for note reading progress. Used in chapter notes lists.
 * Returns null for undefined status so unread notes get no decoration.
 */
export default function NoteStatusBadge({ status, scrollPercent, compact }: NoteStatusBadgeProps) {
  if (!status || status === "unread") return null;

  if (status === "completed") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
        style={{ background: "rgba(22,163,74,0.15)", color: "#16a34a" }}
        title="Completed"
      >
        <CheckCircle2 className="w-3 h-3" />
        {!compact && "Read"}
      </span>
    );
  }

  // in_progress
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
      style={{ background: "rgba(245,158,11,0.15)", color: "#d97706" }}
      title={`In progress${scrollPercent ? ` (${scrollPercent}%)` : ""}`}
    >
      <BookOpenCheck className="w-3 h-3" />
      {!compact && (scrollPercent ? `${scrollPercent}%` : "Reading")}
    </span>
  );
}

/** Tiny dot version for ultra-compact lists. */
export function NoteStatusDot({ status }: { status: NoteStatus | undefined }) {
  if (!status || status === "unread") {
    return <Circle className="w-3 h-3 text-gray-300" />;
  }
  if (status === "completed") return <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />;
  return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse" />;
}
