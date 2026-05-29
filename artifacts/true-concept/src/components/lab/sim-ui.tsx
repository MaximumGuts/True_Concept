import { useState, useRef, ReactNode, useEffect } from "react";
import { RotateCcw, Lightbulb, ChevronRight, ChevronLeft } from "lucide-react";

export function SimSlider({
  label, value, onChange, min, max, step = 1, unit = "", color = "#da6b45",
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit?: string; color?: string; disabled?: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide">{label}</label>
        <span className="text-sm font-black px-2.5 py-0.5 rounded-lg text-white shadow-sm" style={{ background: color }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer touch-pan-x"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(0,0,0,0.1) ${((value - min) / (max - min)) * 100}%, rgba(0,0,0,0.1) 100%)`,
        }}
      />
    </div>
  );
}

export function SimNumber({
  label, value, unit = "", color = "#da6b45", precision = 2,
}: { label: string; value: number; unit?: string; color?: string; precision?: number }) {
  return (
    <div className="liquid-inner rounded-2xl px-3 py-2.5 flex items-center justify-between">
      <span className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase">{label}</span>
      <span className="text-base font-black" style={{ color }}>
        {Number.isFinite(value) ? value.toFixed(precision) : "—"}{unit && <span className="text-xs ml-1 font-bold text-gray-500 dark:text-gray-400">{unit}</span>}
      </span>
    </div>
  );
}

export function SimButton({
  children, onClick, color = "#da6b45", icon, disabled,
}: { children: ReactNode; onClick: () => void; color?: string; icon?: ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-xl text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{ background: color }}
    >
      {icon}
      {children}
    </button>
  );
}

export function SimResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-black text-gray-700 dark:text-gray-200 liquid-inner hover:bg-white/80 transition-colors inline-flex items-center gap-1"
      data-testid="sim-reset"
    >
      <RotateCcw className="w-3.5 h-3.5" /> Reset
    </button>
  );
}

export function SimHint({ text, open, onToggle }: { text: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors inline-flex items-center gap-1 ${
        open
          ? "bg-amber-400/30 text-amber-800 dark:text-amber-200"
          : "text-amber-700 dark:text-amber-300 bg-amber-100/80 hover:bg-amber-200/80"
      }`}
      data-testid="sim-hint-toggle"
    >
      <Lightbulb className="w-3.5 h-3.5" /> Hint
    </button>
  );
}

export function SimContainer({
  children, onReset, hint, controls, className,
}: { children: ReactNode; onReset?: () => void; hint?: string; controls?: ReactNode; className?: string }) {
  const [hintOpen, setHintOpen] = useState(false);
  return (
    <div className={`liquid-inner rounded-2xl p-3 sm:p-4${className ? ` ${className}` : ""}`}>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {controls}
        </div>
        <div className="flex items-center gap-2">
          {hint && <SimHint text={hint} open={hintOpen} onToggle={() => setHintOpen((o) => !o)} />}
          {onReset && <SimResetButton onClick={onReset} />}
        </div>
      </div>
      {hint && hintOpen && (
        <div
          data-testid="sim-hint"
          className="mb-3 rounded-xl px-4 py-3 text-xs font-semibold leading-relaxed w-full"
          style={{
            background: "var(--hint-bg)",
            border: "1px solid var(--hint-border)",
            color: "var(--hint-text)",
          }}
        >
          💡 {hint}
        </div>
      )}
      {children}
    </div>
  );
}

export function SimGraph({
  points, xLabel = "x", yLabel = "y", xMax, yMax, color = "#da6b45", height = 160, series
}: {
  points?: { x: number; y: number }[];
  xLabel?: string; yLabel?: string; xMax: number; yMax: number; color?: string; height?: number;
  series?: { points: { x: number; y: number }[]; color: string; dashed?: boolean }[];
}) {
  const w = 320;
  const h = height;
  const pad = 28;
  const sx = (x: number) => pad + (x / xMax) * (w - pad - 8);
  const sy = (y: number) => h - pad - (y / yMax) * (h - pad - 8);
  
  const allSeries = series || (points ? [{ points, color, dashed: false }] : []);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full bg-white/70 rounded-xl border border-white/50 dark:border-white/10" preserveAspectRatio="xMidYMid meet">
      {/* grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={`gx-${f}`} x1={pad + f * (w - pad - 8)} y1={pad} x2={pad + f * (w - pad - 8)} y2={h - pad} stroke="#e5e7eb" strokeDasharray="2 3" />
      ))}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={`gy-${f}`} x1={pad} y1={h - pad - f * (h - pad - 8)} x2={w - 8} y2={h - pad - f * (h - pad - 8)} stroke="#e5e7eb" strokeDasharray="2 3" />
      ))}
      {/* axes */}
      <line x1={pad} y1={h - pad} x2={w - 8} y2={h - pad} stroke="#374151" strokeWidth={1.5} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#374151" strokeWidth={1.5} />
      {/* labels */}
      <text x={w - 8} y={h - 8} textAnchor="end" className="fill-gray-600" fontSize="10" fontWeight="700">{xLabel}</text>
      <text x={6} y={pad - 4} className="fill-gray-600" fontSize="10" fontWeight="700">{yLabel}</text>
      <text x={pad - 4} y={h - pad + 12} textAnchor="end" className="fill-gray-400" fontSize="9">0</text>
      <text x={w - 8} y={h - pad + 12} textAnchor="end" className="fill-gray-400" fontSize="9">{xMax}</text>
      <text x={pad - 4} y={pad + 4} textAnchor="end" className="fill-gray-400" fontSize="9">{yMax.toFixed(0)}</text>
      {/* lines */}
      {allSeries.map((s, i) => {
        const path = s.points.length > 0
          ? "M " + s.points.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" L ")
          : "";
        return (
          <g key={i}>
            {path && <path d={path} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? "4 4" : "none"} />}
            {s.points.length > 0 && (() => {
              const last = s.points[s.points.length - 1];
              return <circle cx={sx(last.x)} cy={sy(last.y)} r={4} fill={s.color} />;
            })()}
          </g>
        );
      })}
    </svg>
  );
}

export function ObservationTable({
  columns, rows: initialRows = 3,
}: { columns: string[]; rows?: number }) {
  const [data, setData] = useState<string[][]>(() =>
    Array.from({ length: initialRows }, () => columns.map(() => ""))
  );
  const setCell = (r: number, c: number, v: string) => {
    setData((d) => d.map((row, i) => i === r ? row.map((cell, j) => j === c ? v : cell) : row));
  };
  const addRow = () => setData((d) => [...d, columns.map(() => "")]);
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase px-2 py-2 text-left bg-white/50 first:rounded-l-lg last:rounded-r-lg">#</th>
            {columns.map((col, i) => (
              <th key={i} className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase px-2 py-2 text-left bg-white/50 last:rounded-r-lg">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, r) => (
            <tr key={r} className="border-b border-white/40 dark:border-white/10">
              <td className="px-2 py-1.5 text-xs font-black text-gray-400 dark:text-gray-500">{r + 1}</td>
              {row.map((cell, c) => (
                <td key={c} className="px-1 py-1">
                  <input
                    value={cell}
                    onChange={(e) => setCell(r, c, e.target.value)}
                    className="w-full px-2 py-1 rounded-md text-sm bg-white/70 border border-white/60 dark:border-white/10 focus:bg-white focus:border-orange-300 outline-none"
                    data-testid={`obs-${r}-${c}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addRow}
        className="mt-2 text-xs font-black text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-200 inline-flex items-center gap-1"
        data-testid="obs-add-row"
      >
        + Add Row
      </button>
    </div>
  );
}

export function StepMode({ steps }: { steps: { title: string; body: string }[] }) {
  const [i, setI] = useState(0);
  const s = steps[i];
  return (
    <div className="liquid-inner rounded-xl p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Step {i + 1} / {steps.length}</span>
        <div className="flex gap-1">
          <button
            disabled={i === 0}
            onClick={() => setI((v) => Math.max(0, v - 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/60 hover:bg-white disabled:opacity-30"
          ><ChevronLeft className="w-4 h-4" /></button>
          <button
            disabled={i === steps.length - 1}
            onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/60 hover:bg-white disabled:opacity-30"
          ><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <h4 className="font-black text-gray-900 dark:text-gray-100 mb-1">{s.title}</h4>
      <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">{s.body}</p>
    </div>
  );
}

/** Hook to run an animation frame loop while `running` is true. Calls `tick(dt)` with seconds. */
export function useRafLoop(running: boolean, tick: (dt: number) => void) {
  const tickRef = useRef(tick);
  tickRef.current = tick;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tickRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}
