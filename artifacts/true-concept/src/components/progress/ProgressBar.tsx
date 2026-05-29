interface ProgressBarProps {
  /** 0-100 */
  percent: number;
  /** Optional gradient — defaults to coral brand */
  gradient?: string;
  /** Bar height in px (default 6) */
  height?: number;
  /** Show percentage text inline next to the bar */
  showLabel?: boolean;
}

export default function ProgressBar({
  percent, gradient = "linear-gradient(90deg, #da6b45, #fbbf24)", height = 6, showLabel,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height, background: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: gradient }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-black text-foreground tabular-nums shrink-0" style={{ minWidth: 32 }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
