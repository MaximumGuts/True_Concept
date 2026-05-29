import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { SimSlider, SimNumber, SimContainer, SimGraph, SimButton, useRafLoop, ObservationTable, StepMode } from "../sim-ui";
import { useLanguage } from "@/contexts/LanguageContext";

/* 1. Distance–Time Graph */
export function DistanceTimeSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [speed, setSpeed] = useState(2);
  const [running, setRunning] = useState(false);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([{ x: 0, y: 0 }]);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const tRef = useRef(0); const dRef = useRef(0);

  useRafLoop(running, (dt) => {
    tRef.current = Math.min(10, tRef.current + dt);
    dRef.current = Math.min(50, dRef.current + speed * dt);
    setT(tRef.current); setD(dRef.current);
    setPts((p) => [...p.slice(-200), { x: tRef.current, y: dRef.current }]);
    if (tRef.current >= 10) setRunning(false);
  });

  const reset = () => { tRef.current = 0; dRef.current = 0; setT(0); setD(0); setPts([{ x: 0, y: 0 }]); setRunning(false); };

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "বেছি বেগ → অধিক হেলনীয়া দূৰত্ব–সময় ৰেখা। পোন ৰেখা মানে একৰূপ গতি।"
        : "Higher speed → steeper distance–time line. A straight line means uniform motion."}
      controls={
        <SimButton
          onClick={() => setRunning((r) => !r)}
          icon={running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        >
          {running ? (isAs ? "বিৰতি" : "Pause") : (isAs ? "আৰম্ভ" : "Start")}
        </SimButton>
      }
    >
      <SimSlider
        label={isAs ? "বেগ" : "Speed"}
        value={speed} onChange={setSpeed}
        min={0} max={5} step={0.5} unit=" m/s" color="#3b82f6"
      />
      <div className="relative bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl h-16 mb-3 overflow-hidden">
        <div className="absolute inset-y-0 flex items-center transition-transform" style={{ transform: `translateX(${(d / 50) * 100}%)` }}>
          <div className="w-10 h-10 ml-1 rounded-full shadow-lg flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>🚗</div>
        </div>
      </div>
      <SimGraph
        points={pts} xMax={10} yMax={50}
        xLabel={isAs ? "সময় (s)" : "time (s)"}
        yLabel={isAs ? "দূৰত্ব (m)" : "distance (m)"}
        color="#3b82f6"
      />
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label={isAs ? "সময়" : "Time"}     value={t} unit="s" color="#3b82f6" />
        <SimNumber label={isAs ? "দূৰত্ব" : "Distance"} value={d} unit="m" color="#3b82f6" />
      </div>
      <div className="mt-3">
        <ObservationTable
          columns={isAs
            ? ["বেগ (m/s)", "সময় (s)", "দূৰত্ব (m)"]
            : ["Speed (m/s)", "Time (s)", "Distance (m)"]}
          rows={3}
        />
      </div>
    </SimContainer>
  );
}

/* 2. Velocity–Time Graph */
export function VelocityTimeSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"accel" | "const" | "retard" | "custom">("accel");
  const [u, setU] = useState(0);
  const [a, setA] = useState(2);
  const [targetT, setTargetT] = useState(10);
  const [slowMo, setSlowMo] = useState(false);
  const [showArea, setShowArea] = useState(true);
  const [showSlope, setShowSlope] = useState(true);
  const [showVectors, setShowVectors] = useState(true);

  const [t, setT] = useState(0);
  const [v, setV] = useState(0);
  const [s, setS] = useState(0);
  const [points, setPoints] = useState<{ t: number; v: number; s: number }[]>([{ t: 0, v: 0, s: 0 }]);

  const tRef = useRef(0);
  const vRef = useRef(u);
  const sRef = useRef(0);
  const aRef = useRef(a);

  // Apply mode presets
  useEffect(() => {
    if (mode === "accel")  { setU(0);  setA(2); }
    if (mode === "const")  { setU(10); setA(0); }
    if (mode === "retard") { setU(20); setA(-2); }
    if (mode === "custom") { setU(5);  setA(1); }
  }, [mode]);

  // Sync refs with sliders before start
  useEffect(() => {
    aRef.current = a;
    if (!running && tRef.current === 0) {
      vRef.current = u;
      setV(u);
      setPoints([{ t: 0, v: u, s: 0 }]);
    }
  }, [a, u, running]);

  const reset = () => {
    setRunning(false);
    tRef.current = 0;
    vRef.current = u;
    sRef.current = 0;
    setT(0); setV(u); setS(0);
    setPoints([{ t: 0, v: u, s: 0 }]);
  };

  useRafLoop(running, (dt) => {
    const stepDt = slowMo ? dt * 0.3 : dt;
    const next = tRef.current + stepDt;
    if (next >= targetT) {
      const rem = targetT - tRef.current;
      tRef.current = targetT;
      sRef.current += vRef.current * rem + 0.5 * aRef.current * rem * rem;
      vRef.current += aRef.current * rem;
      setRunning(false);
    } else {
      tRef.current = next;
      sRef.current += vRef.current * stepDt + 0.5 * aRef.current * stepDt * stepDt;
      vRef.current += aRef.current * stepDt;
    }
    setT(tRef.current); setV(vRef.current); setS(sRef.current);
    if (Math.floor(tRef.current * 15) > Math.floor((tRef.current - stepDt) * 15) || tRef.current === targetT) {
      setPoints((p) => [...p, { t: tRef.current, v: vRef.current, s: sRef.current }]);
    }
  });

  // Graph geometry
  const Y_MAX = 25, Y_MIN = -10, GW = 400, GH = 200;
  // Compute s-range for the mini-track marker
  let dMin = 0, dMax = 0;
  const finalS = u * targetT + 0.5 * a * targetT * targetT;
  dMin = Math.min(0, finalS); dMax = Math.max(0, finalS);
  if (a !== 0) {
    const turnT = -u / a;
    if (turnT > 0 && turnT < targetT) {
      const turnS = u * turnT + 0.5 * a * turnT * turnT;
      dMin = Math.min(dMin, turnS); dMax = Math.max(dMax, turnS);
    }
  }
  const dRange = Math.max(50, dMax - dMin);
  const carPct = 10 + ((s - dMin) / dRange) * 80;

  const xS = (val: number) => (val / Math.max(5, targetT)) * GW;
  const yS = (val: number) => GH - ((val - Y_MIN) / (Y_MAX - Y_MIN)) * GH;
  const baseY = yS(0);
  const linePath = points.length > 0
    ? `M ${xS(points[0].t)},${yS(points[0].v)} ` + points.map((p) => `L ${xS(p.t)},${yS(p.v)}`).join(" ")
    : "";
  const areaPath = points.length > 0
    ? `M ${xS(points[0].t)},${baseY} ` + points.map((p) => `L ${xS(p.t)},${yS(p.v)}`).join(" ") + ` L ${xS(points[points.length - 1].t)},${baseY} Z`
    : "";

  // Dynamic feedback line
  let feedback = "";
  if (v === 0 && a === 0) {
    feedback = isAs
      ? "বস্তুটো বিশ্ৰামত। লেখ x-অক্ষৰ ওপৰত সমতল। ক্ষেত্ৰফল আৰু সৰণ শূন্য।"
      : "The object is at rest. The graph is flat on the x-axis. Area and displacement remain zero.";
  } else if (a === 0) {
    feedback = isAs
      ? `স্থিৰ বেগ (${v.toFixed(1)} m/s)। লেখ এডাল অনুভূমিক ৰেখা। ঢাল শূন্য। ক্ষেত্ৰফল স্থিৰভাৱে বাঢ়ে।`
      : `Constant velocity (${v.toFixed(1)} m/s). The graph is a horizontal line. Slope is zero. Area grows steadily.`;
  } else if (a > 0 && v >= 0) {
    feedback = isAs
      ? `ধনাত্মক ত্বৰণ (${a.toFixed(1)} m/s²)। বস্তুৰ বেগ বাঢ়িছে। লেখ ওপৰলৈ হেলিছে।`
      : `Positive acceleration (${a.toFixed(1)} m/s²). The object is speeding up. The graph slopes upwards.`;
  } else if (a < 0 && v > 0) {
    feedback = isAs
      ? `মন্দন (${a.toFixed(1)} m/s²)। বস্তুটো বেগ কমাইছে। ঢাল ঋণাত্মক।`
      : `Retardation (${a.toFixed(1)} m/s²). The object is slowing down. The slope is negative.`;
  } else if (a < 0 && v <= 0) {
    feedback = isAs
      ? `ঋণাত্মক ত্বৰণ (${a.toFixed(1)} m/s²)। বিপৰীত দিশত বেগ বাঢ়িছে! লেখ তললৈ হেলিছে।`
      : `Negative acceleration (${a.toFixed(1)} m/s²). Speeding up in reverse direction! The graph slopes downwards.`;
  } else if (a > 0 && v < 0) {
    feedback = isAs
      ? `ধনাত্মক ত্বৰণ (${a.toFixed(1)} m/s²)। বিপৰীতে গতি কৰাৰ সময়ত মন্থৰ হৈছে, শূন্য বেগৰ ফালে।`
      : `Positive acceleration (${a.toFixed(1)} m/s²). Slowing down while moving in reverse, heading towards zero velocity.`;
  }

  // Slope indicator (Δv over last 1 s window)
  const slopeWindow = Math.min(1, t);
  const slopeDv = a * slopeWindow;

  const modeLabel: Record<typeof mode, { en: string; as: string }> = {
    accel:  { en: "Uniform Accel",  as: "একৰূপ ত্বৰণ" },
    const:  { en: "Constant Vel",   as: "স্থিৰ বেগ" },
    retard: { en: "Retardation",    as: "মন্দন" },
    custom: { en: "Custom Graph",   as: "নিজস্ব লেখ" },
  };

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "উন্নত বেগ–সময় বিশ্লেষণ। ঢাল = ত্বৰণ। লেখৰ তলৰ ক্ষেত্ৰফল = সৰণ।"
        : "Advanced Velocity-Time Analysis. Slope = Acceleration. Area under graph = Displacement."}
      controls={
        <SimButton
          onClick={() => setRunning(!running)}
          color="#0ea5e9"
          icon={running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        >
          {running ? (isAs ? "বিৰতি" : "Pause") : (isAs ? "আৰম্ভ" : "Start")}
        </SimButton>
      }
    >
      {/* Mode chips */}
      <div className="flex flex-wrap gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {(["accel", "const", "retard", "custom"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`px-3 py-1 text-[10px] sm:text-xs font-black rounded-md transition-all uppercase ${
              mode === m
                ? "bg-white dark:bg-gray-700 shadow-sm text-sky-600 dark:text-sky-400"
                : "opacity-50 text-gray-700 dark:text-gray-300"
            }`}
          >
            {isAs ? modeLabel[m].as : modeLabel[m].en}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 mb-4">
        <SimSlider label={isAs ? "আদি বেগ (u)" : "Initial Vel (u)"}    value={u} onChange={setU}       min={-20} max={20} step={1}   unit=" m/s"  color="#3b82f6" />
        <SimSlider label={isAs ? "ত্বৰণ (a)" : "Acceleration (a)"}     value={a} onChange={setA}       min={-5}  max={5}  step={0.5} unit=" m/s²" color="#f59e0b" />
        <SimSlider label={isAs ? "লক্ষ্য সময় (t)" : "Target Time (t)"} value={targetT} onChange={setTargetT} min={2} max={15} step={1} unit=" s" color="#10b981" />
      </div>

      {/* Visualization toggles */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <label className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer">
          <input type="checkbox" checked={showArea} onChange={(e) => setShowArea(e.target.checked)} className="w-3.5 h-3.5 text-sky-500 rounded focus:ring-sky-500" />
          {isAs ? "ক্ষেত্ৰফল (সৰণ)" : "Show Area (Displacement)"}
        </label>
        <label className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer">
          <input type="checkbox" checked={showSlope} onChange={(e) => setShowSlope(e.target.checked)} className="w-3.5 h-3.5 text-amber-500 rounded focus:ring-amber-500" />
          {isAs ? "ঢাল (ত্বৰণ)" : "Show Slope (Accel)"}
        </label>
        <label className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer">
          <input type="checkbox" checked={showVectors} onChange={(e) => setShowVectors(e.target.checked)} className="w-3.5 h-3.5 text-emerald-500 rounded focus:ring-emerald-500" />
          {isAs ? "ভেক্টৰ দেখুৱাওক" : "Show Vectors"}
        </label>
        <label className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer">
          <input type="checkbox" checked={slowMo} onChange={(e) => setSlowMo(e.target.checked)} className="w-3.5 h-3.5 text-indigo-500 rounded focus:ring-indigo-500" />
          {isAs ? "ধীৰগতি" : "Slow Motion"}
        </label>
      </div>

      {/* Animated mini-track */}
      <div className="relative h-32 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner mb-4 flex flex-col justify-end">
        {/* Scrolling grid */}
        <div className="absolute inset-0 flex"
             style={{ transform: `translateX(${-(s * 10) % 100}px)`, transition: running && !slowMo ? "transform 0.1s linear" : "none" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-full border-r border-slate-700/50 min-w-[50px]" />
          ))}
        </div>
        {/* Ground strip + origin marker */}
        <div className="h-5 bg-slate-700 border-t border-slate-600 relative z-0">
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-slate-400" />
          <div className="absolute top-0 bottom-0 border-l-4 border-yellow-400 opacity-50"
               style={{ left: `${10 - (dMin / dRange) * 80}%`, transform: `translateX(${-(s * 10)}px)` }} />
        </div>
        {/* Car + vectors */}
        <div className="absolute bottom-4 z-10 transition-transform duration-75" style={{ left: `${Math.max(2, Math.min(98, carPct))}%` }}>
          <div className="relative inline-block">
            <div
              className="text-4xl filter drop-shadow-lg inline-block"
              style={{
                transform: v < 0 ? "none" : "scaleX(-1)",
                filter: Math.abs(v) > 5
                  ? `drop-shadow(0 0 10px rgba(14,165,233,0.5)) blur(${Math.abs(v) * 0.05}px)`
                  : "none",
              }}
            >🏎️</div>
            {showVectors && (
              <>
                {Math.abs(v) > 0.5 && (
                  <div className="absolute -top-3 h-1 bg-sky-500 rounded-full"
                       style={{
                         left: v > 0 ? "50%" : "auto",
                         right: v < 0 ? "50%" : "auto",
                         width: `${Math.abs(v) * 2}px`,
                         transformOrigin: v > 0 ? "left center" : "right center",
                       }}>
                    <div className={`absolute top-1/2 -translate-y-1/2 border-y-4 border-y-transparent ${v > 0 ? "right-0 border-l-4 border-sky-500 translate-x-full" : "left-0 border-r-4 border-sky-500 -translate-x-full"}`} />
                    <span className="absolute -top-4 text-[9px] font-black text-sky-400 min-w-max"
                          style={{ [v > 0 ? "left" : "right"]: "100%" } as React.CSSProperties}>
                      v={v.toFixed(1)}
                    </span>
                  </div>
                )}
                {Math.abs(a) > 0.5 && (
                  <div className="absolute -top-7 h-1 bg-amber-500 rounded-full"
                       style={{
                         left: a > 0 ? "50%" : "auto",
                         right: a < 0 ? "50%" : "auto",
                         width: `${Math.abs(a) * 4}px`,
                         transformOrigin: a > 0 ? "left center" : "right center",
                       }}>
                    <div className={`absolute top-1/2 -translate-y-1/2 border-y-4 border-y-transparent ${a > 0 ? "right-0 border-l-4 border-amber-500 translate-x-full" : "left-0 border-r-4 border-amber-500 -translate-x-full"}`} />
                    <span className="absolute -top-4 text-[9px] font-black text-amber-400 min-w-max"
                          style={{ [a > 0 ? "left" : "right"]: "100%" } as React.CSSProperties}>
                      a={a.toFixed(1)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live data row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <SimNumber label={isAs ? "সময় (t)" : "Time (t)"}    value={t} unit="s"    color="#10b981" />
        <SimNumber label={isAs ? "বেগ (v)" : "Vel (v)"}      value={v} unit="m/s"  color="#0ea5e9" />
        <SimNumber label={isAs ? "ত্বৰণ (a)" : "Accel (a)"}  value={a} unit="m/s²" color="#f59e0b" />
        <SimNumber label={isAs ? "সৰণ (s)" : "Disp (s)"}     value={s} unit="m"    color="#8b5cf6" />
      </div>

      {/* SVG graph: v-t with optional area / slope overlays */}
      <div className="relative bg-slate-900 rounded-xl p-3 border border-slate-700 shadow-lg mb-4 overflow-hidden">
        <svg viewBox="0 0 400 200" className="w-full h-auto bg-slate-900 rounded-lg">
          <defs>
            <linearGradient id="vtAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
            </linearGradient>
            <filter id="vtGlow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Vertical gridlines */}
          {Array.from({ length: targetT + 1 }).map((_, i) => (
            <line key={`gx-${i}`} x1={xS(i)} x2={xS(i)} y1={0} y2={GH} stroke="#334155" strokeWidth={1} strokeDasharray="2 2" />
          ))}
          {/* Horizontal gridlines */}
          {[-10, -5, 0, 5, 10, 15, 20, 25].map((val) => (
            <line key={`gy-${val}`} x1={0} x2={GW} y1={yS(val)} y2={yS(val)}
                  stroke={val === 0 ? "#64748b" : "#334155"}
                  strokeWidth={val === 0 ? 2 : 1}
                  strokeDasharray={val === 0 ? "none" : "2 2"} />
          ))}
          {showArea && points.length > 1 && <path d={areaPath} fill="url(#vtAreaGrad)" />}
          {points.length > 1 && <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="3" filter="url(#vtGlow)" />}
          {points.length > 1 && <path d={linePath} fill="none" stroke="#bae6fd" strokeWidth="1" />}
          {/* Slope indicator (visible when running + has accel + has elapsed time) */}
          {showSlope && points.length > 0 && running && a !== 0 && slopeWindow > 0 && (
            <g>
              <path d={`M ${xS(t - slopeWindow)},${yS(v - slopeDv)} L ${xS(t)},${yS(v - slopeDv)} L ${xS(t)},${yS(v)}`}
                    fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
              <rect x={xS(t) - 6} y={yS(v - slopeDv) - (a > 0 ? 6 : 0)} width="6" height="6" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <text x={xS(t - slopeWindow / 2)} y={yS(v - slopeDv) + (a > 0 ? 12 : -5)} fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">
                {slopeWindow.toFixed(1)}s
              </text>
              <text x={xS(t) + 4} y={yS(v - slopeDv / 2)} fill="#f59e0b" fontSize="10" fontWeight="bold">
                Δv={slopeDv.toFixed(1)}
              </text>
            </g>
          )}
          {/* Current point marker */}
          {points.length > 0 && (
            <circle cx={xS(t)} cy={yS(v)} r="5" fill="#fff" stroke="#0ea5e9" strokeWidth="2" filter="url(#vtGlow)" />
          )}
          <text x="5" y={yS(0) - 5} fill="#94a3b8" fontSize="10" fontWeight="bold">0 m/s</text>
          <text x="5" y={10}        fill="#94a3b8" fontSize="10" fontWeight="bold">v (m/s)</text>
          <text x={GW - 25} y={yS(0) + 12} fill="#94a3b8" fontSize="10" fontWeight="bold">t (s)</text>
        </svg>
        {/* Area = Displacement overlay */}
        {showArea && s !== 0 && (
          <div className="absolute bottom-3 right-3 bg-sky-900/80 p-2 rounded-lg border border-sky-500/30 backdrop-blur-md shadow-xl pointer-events-none">
            <div className="text-[10px] font-black uppercase text-sky-400">
              {isAs ? "ক্ষেত্ৰফল = সৰণ" : "Area = Disp"}
            </div>
            <div className="text-sm font-black text-white text-center">{s.toFixed(1)} m</div>
          </div>
        )}
      </div>

      {/* Dynamic feedback */}
      <div className="bg-indigo-900/80 p-3 rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-xl text-center">
        <p className="text-sm font-bold text-indigo-100 leading-snug">{feedback}</p>
      </div>
    </SimContainer>
  );
}

/* 3. Free Fall — Interactive Multi-Planet Simulation */
type Planet = "earth" | "moon" | "jupiter";
type FFObject = "ball" | "feather" | "metal";

export function FreeFallSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [planet, setPlanet] = useState<Planet>("earth");
  const gravity = { earth: 9.81, moon: 1.62, jupiter: 24.79 }[planet];

  const [objType, setObjType] = useState<FFObject>("ball");
  const [airRes, setAirRes] = useState(false);
  const [h, setH] = useState(100);
  const [running, setRunning] = useState(false);

  const [dist, setDist] = useState(0);  // current fallen distance (m)
  const [time, setTime] = useState(0);
  const [vel, setVel] = useState(0);
  const [graphMode, setGraphMode] = useState<"vt" | "yt">("vt");

  type Hist = { t: number; y: number; v: number };
  const phys = useRef<{ y: number; v: number; t: number; history: Hist[] }>({ y: 0, v: 0, t: 0, history: [] });
  const svgRef = useRef<SVGSVGElement>(null);

  const reset = () => {
    setRunning(false);
    phys.current = { y: 0, v: 0, t: 0, history: [{ t: 0, y: 0, v: 0 }] };
    setDist(0); setVel(0); setTime(0);
  };

  // Object physics constants
  const objMass = objType === "feather" ? 0.05 : objType === "metal" ? 10 : 1;
  const objK = airRes ? (objType === "feather" ? 0.05 : 0.005) : 0;

  useRafLoop(running, (frameDt) => {
    let { y: yPos, v, t } = phys.current;
    const subSteps = 10;
    const subDt = frameDt / subSteps;
    for (let i = 0; i < subSteps; i++) {
      const a = gravity - (objK / objMass) * v * v;
      v += a * subDt;
      yPos += v * subDt;
      t += subDt;
      if (yPos >= h) { yPos = h; break; }
    }
    const last = phys.current.history[phys.current.history.length - 1];
    if (!last || t - last.t >= 0.05 || yPos >= h) {
      phys.current.history.push({ t, y: yPos, v });
    }
    phys.current.y = yPos; phys.current.v = v; phys.current.t = t;
    setDist(yPos); setVel(v); setTime(t);
    if (yPos >= h) setRunning(false);
  });

  // Drag to set height (when not running)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (running) return;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (running || !e.buttons || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    let newH = (380 - loc.y) / 3.6;
    newH = Math.max(5, Math.min(100, newH));
    setH(newH);
    reset();
  };

  // Energy distribution
  const remaining = h - dist;
  const pe       = objMass * gravity * remaining;
  const ke       = 0.5 * objMass * vel * vel;
  const peMax    = objMass * gravity * h;
  const pePct    = Math.max(0, Math.min(100, peMax > 0 ? (pe / peMax) * 100 : 0)) || 0;
  const kePct    = Math.max(0, Math.min(100, peMax > 0 ? (ke / peMax) * 100 : 0)) || 0;
  const heatPct  = Math.max(0, 100 - pePct - kePct) || 0;

  // Live graph (v-t or y-t)
  const renderGraphLine = () => {
    const hist = phys.current.history;
    if (hist.length < 2) return null;
    const maxT = Math.max(1, hist[hist.length - 1].t);
    const maxY = graphMode === "vt" ? Math.max(10, hist[hist.length - 1].v) : h;
    const pts = hist.map((p) => {
      const px = 20 + (p.t / maxT) * 160;
      const py = 90 - ((graphMode === "vt" ? p.v : p.y) / maxY) * 80;
      return `${px},${py}`;
    }).join(" ");
    return (
      <polyline points={pts} fill="none"
                stroke={graphMode === "vt" ? "#facc15" : "#a855f7"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    );
  };

  // Dynamic feedback line
  let feedback = isAs
    ? "উচ্চতা নিৰ্ধাৰণৰ বাবে বস্তুটো টানক, তাৰপাছত মুক্ত পতন পৰ্যবেক্ষণ কৰিবলৈ এৰি দিয়ক।"
    : "Drag the object to set height, then drop to observe free fall.";
  if (running) {
    if (airRes) {
      const vTerminal = Math.sqrt((objMass * gravity) / Math.max(0.0001, objK));
      if (vel > 0.9 * vTerminal) {
        feedback = isAs
          ? "বায়ু প্ৰতিৰোধে মাধ্যাকৰ্ষণৰ সমান হৈছে। অন্তিম বেগৰ ওচৰ পাইছে!"
          : "Air resistance balances gravity. Reaching Terminal Velocity!";
      } else {
        feedback = isAs
          ? "বস্তুটো তললৈ ত্বৰিত হৈছে। বায়ু প্ৰতিৰোধে গতিৰ বিৰোধিতা কৰে।"
          : "Object accelerating downward. Air resistance opposes motion.";
      }
    } else {
      feedback = isAs
        ? "মাধ্যাকৰ্ষণিক বিভৱ শক্তি গতিশক্তিলৈ সম্পূৰ্ণৰূপে ৰূপান্তৰিত হৈছে। ত্বৰণ স্থিৰ!"
        : "Gravitational PE converts perfectly into Kinetic Energy. Acceleration is constant!";
    }
  } else if (dist >= h && h > 0 && time > 0) {
    feedback = isAs
      ? `সংঘাত! ${vel.toFixed(1)} m/s বেগেৰে ${time.toFixed(2)} ছেকেণ্ডত মাটিত পৰিল।`
      : `Impact! Hit the ground at ${vel.toFixed(1)} m/s in ${time.toFixed(2)} seconds.`;
  }

  const planetLabel: Record<Planet, { en: string; as: string }> = {
    earth:   { en: "Earth",   as: "পৃথিৱী" },
    moon:    { en: "Moon",    as: "চন্দ্ৰ" },
    jupiter: { en: "Jupiter", as: "বৃহস্পতি" },
  };
  const objLabel: Record<FFObject, { en: string; as: string }> = {
    ball:    { en: "Ball",    as: "বল" },
    feather: { en: "Feather", as: "পাখি" },
    metal:   { en: "Metal",   as: "ধাতু" },
  };

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "বায়ুশূন্যত সকলো বস্তু একে ত্বৰণেৰে (g) পৰে। বায়ু প্ৰতিৰোধ সক্ৰিয় কৰি চাওক!"
        : "All objects fall with the same acceleration (g) in a vacuum. Try enabling air resistance!"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* LEFT — controls */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 mb-1">
              {isAs ? "গ্ৰহ (মাধ্যাকৰ্ষণ)" : "Planet (Gravity)"}
            </label>
            <div className="flex gap-1">
              {(["earth", "moon", "jupiter"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPlanet(p); reset(); }}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                    planet === p
                      ? p === "earth" ? "bg-sky-500 text-white shadow-md"
                      : p === "moon"  ? "bg-slate-500 text-white shadow-md"
                                      : "bg-orange-600 text-white shadow-md"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {isAs ? planetLabel[p].as : planetLabel[p].en}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 mb-1">
              {isAs ? "বস্তুৰ প্ৰকাৰ" : "Object Type"}
            </label>
            <div className="flex gap-1">
              {(["ball", "feather", "metal"] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => { setObjType(o); reset(); }}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                    objType === o ? "bg-emerald-500 text-white shadow-md" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {isAs ? objLabel[o].as : objLabel[o].en}
                </button>
              ))}
            </div>
          </div>

          <div
            className="bg-white/5 rounded-lg p-2.5 flex items-center gap-3 mt-1 cursor-pointer hover:bg-white/10 transition-colors"
            onClick={() => { setAirRes(!airRes); reset(); }}
          >
            <input type="checkbox" checked={airRes} readOnly className="w-4 h-4 accent-emerald-500 pointer-events-none" />
            <label className="text-xs font-bold text-gray-200 cursor-pointer select-none">
              {isAs ? "বায়ু প্ৰতিৰোধ সক্ৰিয় কৰক" : "Enable Air Resistance"}
            </label>
          </div>

          <div className="h-px bg-white/10 my-1" />

          <div className="grid grid-cols-2 gap-2">
            <SimNumber label={isAs ? "ত্বৰণ (g)" : "Accel (g)"} value={gravity} unit=" m/s²" color="#38bdf8" precision={2} />
            <SimNumber label={isAs ? "বেগ" : "Velocity"}        value={vel}     unit=" m/s"  color="#facc15" precision={1} />
            <SimNumber label={isAs ? "দূৰত্ব" : "Distance"}     value={dist}    unit=" m"    color="#ec4899" precision={1} />
            <SimNumber label={isAs ? "সময়" : "Time"}            value={time}    unit=" s"    color="#a855f7" precision={2} />
          </div>

          <div className="flex gap-2 mt-1">
            <SimButton
              onClick={() => setRunning(true)}
              color="#10b981"
              icon={<Play className="w-4 h-4" />}
              disabled={running || remaining <= 0.1}
            >
              {isAs ? "এৰি দিয়ক" : "Drop"}
            </SimButton>
          </div>
        </div>

        {/* MIDDLE — SVG tower with object */}
        <div className="lg:col-span-1 bg-[#020617] border border-white/10 rounded-2xl overflow-hidden relative touch-none shadow-2xl"
             style={{ minHeight: "400px" }}>
          <svg ref={svgRef} viewBox="0 0 150 400" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="ff-bg-earth"   x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="ff-bg-moon"    x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#000000" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="ff-bg-jupiter" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#431407" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
              <radialGradient id="ff-grad-ball"  cx="30%" cy="30%" r="70%">
                <stop offset="0%"   stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
              <radialGradient id="ff-grad-metal" cx="30%" cy="30%" r="70%">
                <stop offset="0%"   stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#475569" />
              </radialGradient>
            </defs>

            <rect width="150" height="400" fill={`url(#ff-bg-${planet})`} />
            {/* Tower walls (subtle perspective hints) */}
            <path d="M 0 0 L 20 20 L 20 380 L 0 400" fill="white" opacity="0.02" />
            <path d="M 150 0 L 130 20 L 130 380 L 150 400" fill="white" opacity="0.02" />
            <rect x="20" y="20" width="110" height="360" fill="none" stroke="white" strokeWidth="1" opacity="0.05" />
            <rect x="0" y="380" width="150" height="20"
                  fill={planet === "moon" ? "#334155" : planet === "jupiter" ? "#9a3412" : "#0f766e"} />

            {/* Height markers */}
            <line x1="130" y1="20" x2="130" y2="380" stroke="#cbd5e1" strokeDasharray="4 4" opacity="0.2" />
            <text x="125" y="25"  fill="#94a3b8" fontSize="10" textAnchor="end">100m</text>
            <text x="125" y="110" fill="#94a3b8" fontSize="10" textAnchor="end">75m</text>
            <text x="125" y="200" fill="#94a3b8" fontSize="10" textAnchor="end">50m</text>
            <text x="125" y="290" fill="#94a3b8" fontSize="10" textAnchor="end">25m</text>
            <text x="125" y="378" fill="#94a3b8" fontSize="10" textAnchor="end">0m</text>

            {/* Start-height yellow line */}
            <line x1="20" y1={380 - h * 3.6} x2="130" y2={380 - h * 3.6}
                  stroke="#facc15" strokeDasharray="2 2" opacity="0.5" />
            <text x="125" y={380 - h * 3.6 + 12} fill="#facc15" fontSize="10" textAnchor="end" fontWeight="bold">
              {isAs ? "আৰম্ভ" : "Start"}
            </text>

            {/* The object */}
            <g
              transform={`translate(75, ${380 - (h - dist) * 3.6})`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              style={{ cursor: running ? "default" : "grab" }}
            >
              {running && vel > 5 && (
                <line x1="0" y1="-15" x2="0" y2={-15 - vel * 1.5}
                      stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeDasharray="2 4" strokeLinecap="round" />
              )}
              {objType === "ball"    && <circle r="12" fill="url(#ff-grad-ball)" />}
              {objType === "metal"   && <circle r="14" fill="url(#ff-grad-metal)" />}
              {objType === "feather" && (
                <text x="0" y="6" fontSize="22" textAnchor="middle" style={{ userSelect: "none" }}>🪶</text>
              )}
              {/* Larger transparent hit-area for easier dragging */}
              <circle r="25" fill="transparent" />
            </g>
          </svg>
        </div>

        {/* RIGHT — Energy bars + live graph */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/10 shadow-inner">
            <label className="text-xs font-black uppercase text-gray-500 mb-4 block text-center tracking-wider">
              {isAs ? "শক্তি ৰূপান্তৰ" : "Energy Transformation"}
            </label>
            <div className="flex items-end justify-around h-28 mb-3 border-b border-white/10 pb-2">
              <div className="w-12 bg-black/40 rounded-t-sm overflow-hidden relative flex items-end h-full">
                <div className="w-full bg-cyan-400" style={{ height: `${pePct}%`, filter: "drop-shadow(0 -4px 8px rgba(34,211,238,0.5))" }} />
              </div>
              <div className="w-12 bg-black/40 rounded-t-sm overflow-hidden relative flex items-end h-full">
                <div className="w-full bg-rose-500" style={{ height: `${kePct}%`, filter: "drop-shadow(0 -4px 8px rgba(244,63,94,0.5))" }} />
              </div>
              {airRes && (
                <div className="w-12 bg-black/40 rounded-t-sm overflow-hidden relative flex items-end h-full">
                  <div className="w-full bg-orange-500" style={{ height: `${heatPct}%`, filter: "drop-shadow(0 -4px 8px rgba(249,115,22,0.5))" }} />
                </div>
              )}
            </div>
            <div className="flex justify-around text-[10px] font-black uppercase tracking-wider">
              <span className="drop-shadow-sm" style={{ color: `rgba(34, 211, 238, ${0.3 + 0.7 * (pePct / 100)})` }}>
                PE {Math.round(pePct)}%
              </span>
              <span className="drop-shadow-sm" style={{ color: `rgba(244, 63, 94, ${0.3 + 0.7 * (kePct / 100)})` }}>
                KE {Math.round(kePct)}%
              </span>
              {airRes && (
                <span className="drop-shadow-sm" style={{ color: `rgba(249, 115, 22, ${0.3 + 0.7 * (heatPct / 100)})` }}>
                  {isAs ? "তাপ" : "Heat"} {Math.round(heatPct)}%
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/10 flex-1 flex flex-col shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">
                {isAs ? "তাৎক্ষণিক লেখ" : "Live Graph"}
              </label>
              <select
                value={graphMode}
                onChange={(e) => setGraphMode(e.target.value as "vt" | "yt")}
                className="bg-transparent text-xs font-bold text-white border-b border-white/20 pb-1 cursor-pointer outline-none"
              >
                <option value="vt" className="bg-slate-800">{isAs ? "বেগ বনাম সময় (v-t)" : "Vel vs Time (v-t)"}</option>
                <option value="yt" className="bg-slate-800">{isAs ? "দূৰত্ব বনাম সময় (y-t)" : "Dist vs Time (y-t)"}</option>
              </select>
            </div>
            <div className="flex-1 relative min-h-[120px]">
              <svg viewBox="0 0 200 100" className="w-full h-full absolute inset-0">
                <line x1="20" y1="10" x2="20"  y2="90" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="90" x2="190" y2="90" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                <text x="10"  y="20" fill="#64748b" fontSize="8" textAnchor="end">{graphMode === "vt" ? "v" : "y"}</text>
                <text x="190" y="98" fill="#64748b" fontSize="8" textAnchor="end">t</text>
                {renderGraphLine()}
                {phys.current.history.length > 0 && (
                  <circle
                    cx={20 + (time / Math.max(1, phys.current.history[phys.current.history.length - 1].t)) * 160}
                    cy={
                      90 -
                      ((graphMode === "vt" ? vel : dist) /
                        (graphMode === "vt"
                          ? Math.max(10, phys.current.history[phys.current.history.length - 1].v)
                          : h)) *
                        80
                    }
                    r="3" fill="white" style={{ filter: "drop-shadow(0 0 4px white)" }}
                  />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-900 border border-emerald-500/30 p-3 mb-1 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-emerald-100 leading-relaxed">{feedback}</p>
      </div>
      <p className="text-xs font-bold text-gray-500 text-center">
        {airRes
          ? (isAs ? "গতিৰ সমীকৰণ: F = mg − kv²" : "Equation of Motion: F = mg − kv²")
          : (isAs ? "গতিৰ সমীকৰণ: v² = 2gh, t = √(2h/g)" : "Equations of Motion: v² = 2gh,  t = √(2h/g)")}
      </p>
    </SimContainer>
  );
}

/* 4. Motion with Constant Acceleration — Interactive Simulation */
export function MotionAccelSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [mode, setMode] = useState<"manual" | "explore">("manual");
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [stepMode, setStepMode] = useState(false);

  // Manual parameters
  const [u, setU] = useState(0);
  const [a, setA] = useState(2);
  const [targetT, setTargetT] = useState(5);

  // Live state
  const [t, setT] = useState(0);
  const [s, setS] = useState(0);
  const [v, setV] = useState(0);
  const [currA, setCurrA] = useState(2);

  // Graph data
  const [ptsS, setPtsS] = useState<{ x: number; y: number }[]>([{ x: 0, y: 0 }]);
  const [ptsV, setPtsV] = useState<{ x: number; y: number }[]>([{ x: 0, y: 0 }]);

  // Trail (afterimages)
  const [trail, setTrail] = useState<number[]>([]);

  // Refs for RAF loop
  const tRef = useRef(0);
  const sRef = useRef(0);
  const vRef = useRef(0);

  // Exploration-mode refs (compute v & a from drag history)
  const historyRef = useRef<{ t: number; s: number }[]>([]);
  const lastVRef = useRef(0);

  const trackLength = 100; // metres along the visible road
  const maxV = 25;         // for colour / speedometer scaling

  const reset = () => {
    setRunning(false);
    setStarted(false);
    setT(0);
    setS(0);
    setV(u);
    setCurrA(mode === "manual" ? a : 0);
    tRef.current = 0;
    sRef.current = 0;
    vRef.current = u;
    setPtsS([{ x: 0, y: 0 }]);
    setPtsV([{ x: 0, y: u }]);
    setTrail([]);
    historyRef.current = [];
    lastVRef.current = 0;
  };

  // Keep readouts in sync with sliders before the experiment starts
  useEffect(() => {
    if (!started && mode === "manual") {
      setV(u);
      vRef.current = u;
      setPtsV([{ x: 0, y: u }]);
      setCurrA(a);
    }
  }, [u, a, started, mode]);

  // RAF physics loop — only runs in Manual mode after Start
  useRafLoop(running && mode === "manual", (dt) => {
    const stepDt = stepMode ? dt * 0.25 : dt; // slow-mo when Step Mode is on
    tRef.current += stepDt;
    if (tRef.current >= targetT) {
      tRef.current = targetT;
      setRunning(false);
    }
    const newV = u + a * tRef.current;
    const newS = u * tRef.current + 0.5 * a * tRef.current * tRef.current;
    sRef.current = newS;
    vRef.current = newV;
    setT(tRef.current);
    setV(newV);
    setS(newS);
    setPtsS((p) => [...p.slice(-200), { x: tRef.current, y: newS }]);
    setPtsV((p) => [...p.slice(-200), { x: tRef.current, y: newV }]);

    const pct = Math.max(0, Math.min(100, (newS / trackLength) * 100));
    setTrail((tr) => [...tr.slice(-9), pct]);
  });

  // Exploration mode pointer handlers — compute v & a from drag motion
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "explore" || e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newS = xPct * trackLength;
    const now = performance.now() / 1000;
    historyRef.current.push({ t: now, s: newS });
    if (historyRef.current.length > 12) historyRef.current.shift();
    const hist = historyRef.current;
    if (hist.length > 2) {
      const first = hist[0];
      const last = hist[hist.length - 1];
      const dtH = last.t - first.t;
      if (dtH > 0) {
        const rawV = (last.s - first.s) / dtH;
        const smoothV = lastVRef.current * 0.6 + rawV * 0.4;
        const rawA = (smoothV - lastVRef.current) / dtH;
        const smoothA = currA * 0.85 + Math.max(-15, Math.min(15, rawA)) * 0.15;
        setV(smoothV);
        setCurrA(smoothA);
        lastVRef.current = smoothV;
      }
    }
    setS(newS);
    setTrail((tr) => [...tr.slice(-9), xPct * 100]);
  };

  const handlePointerUp = () => {
    if (mode === "explore") {
      historyRef.current = [];
      setV(0);
      setCurrA(0);
      lastVRef.current = 0;
    }
  };

  const handleStart = () => {
    if (!started) setStarted(true);
    setRunning(true);
  };

  // Speed-based colour: Blue (slow) → Yellow (mid) → Red (fast)
  const speedRatio = Math.min(1, Math.abs(v) / maxV);
  const carColor = speedRatio < 0.5
    ? `rgb(${Math.floor(speedRatio * 2 * 250)}, ${Math.floor(speedRatio * 2 * 200)}, 255)`
    : `rgb(255, ${Math.floor((1 - (speedRatio - 0.5) * 2) * 220)}, 0)`;

  const sPct = Math.max(0, Math.min(95, (s / trackLength) * 100));
  const motionBlur = speedRatio * 2.2;
  const gaugeAngle = -90 + speedRatio * 180; // -90° at 0, +90° at max

  const hintText = mode === "manual"
    ? (isAs
        ? "ধনাত্মক ত্বৰণে বেগ সময়ৰ সৈতে ৰৈখিকভাৱে বৃদ্ধি কৰে, আৰু সৰণ বক্ৰভাৱে বৃদ্ধি পায় (s = ut + ½at²)।"
        : "Positive acceleration makes velocity grow linearly over time, while displacement curves upward (s = ut + ½at²).")
    : (isAs
        ? "গাড়ীটো টানক — চিষ্টেমে আপোনাৰ গতিৰ পৰা বেগ আৰু ত্বৰণ তাৎক্ষণিকভাৱে গণনা কৰিব।"
        : "Drag the car — the system computes velocity and acceleration from your motion in real time.");

  const finished = mode === "manual" && started && tRef.current >= targetT;

  return (
    <SimContainer
      onReset={reset}
      hint={hintText}
      controls={
        mode === "manual" ? (
          <>
            <SimButton
              onClick={running ? () => setRunning(false) : handleStart}
              color={running ? "#dc2626" : finished ? "#94a3b8" : "#10b981"}
              icon={running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              disabled={finished}
            >
              {running
                ? (isAs ? "বিৰতি" : "Pause")
                : started && !finished
                  ? (isAs ? "পুনৰ আৰম্ভ" : "Resume")
                  : finished
                    ? (isAs ? "সম্পূৰ্ণ" : "Finished")
                    : (isAs ? "পৰীক্ষা আৰম্ভ" : "Start Experiment")}
            </SimButton>
            <button
              onClick={() => setStepMode((sm) => !sm)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                stepMode ? "bg-indigo-500 text-white shadow-md" : "liquid-inner text-gray-700 dark:text-gray-200"
              }`}
            >
              {stepMode ? (isAs ? "ধাপ ধৰণ ✓" : "Step Mode ✓") : (isAs ? "ধাপ ধৰণ" : "Step Mode")}
            </button>
          </>
        ) : null
      }
    >
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => { setMode("manual"); reset(); }}
          className={`px-3 py-1 text-xs font-black rounded-md transition-all ${
            mode === "manual"
              ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
              : "opacity-60 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isAs ? "নিয়ন্ত্ৰিত ধৰণ" : "Manual Mode"}
        </button>
        <button
          onClick={() => { setMode("explore"); reset(); }}
          className={`px-3 py-1 text-xs font-black rounded-md transition-all ${
            mode === "explore"
              ? "bg-white dark:bg-gray-700 shadow-sm text-orange-600 dark:text-orange-400"
              : "opacity-60 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isAs ? "অন্বেষণ ধৰণ (টানক)" : "Exploration Mode (Drag)"}
        </button>
      </div>

      {/* Manual mode sliders */}
      {mode === "manual" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 mb-2">
          <SimSlider
            label={isAs ? "আদি বেগ (u)" : "Initial Velocity (u)"}
            value={u} onChange={(val) => { setU(val); if (!started) { setV(val); vRef.current = val; } }}
            min={0} max={15} step={1} unit=" m/s" color="#0ea5e9"
          />
          <SimSlider
            label={isAs ? "ত্বৰণ (a)" : "Acceleration (a)"}
            value={a} onChange={(val) => { setA(val); if (!started) setCurrA(val); }}
            min={-3} max={5} step={0.5} unit=" m/s²" color="#f59e0b"
          />
          <SimSlider
            label={isAs ? "লক্ষ্য সময় (t)" : "Target Time (t)"}
            value={targetT} onChange={setTargetT}
            min={1} max={15} step={1} unit=" s" color="#10b981"
          />
        </div>
      )}

      {/* Motion Track — dark road with gradient sky */}
      <div className="relative mt-3 mb-4 rounded-2xl overflow-hidden border border-white/40 dark:border-white/10 shadow-inner"
           style={{ background: "linear-gradient(to bottom, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }}>
        <div
          className="relative h-28 touch-none"
          onPointerDown={handlePointerMove}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Distance markers */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 border-l border-white/15" style={{ left: `${i * 10}%` }}>
              <span className="absolute bottom-1 left-1 text-[8px] font-black text-white/40 select-none">
                {i * (trackLength / 10)}m
              </span>
            </div>
          ))}
          {/* Centre dashed lane line */}
          <div
            className="absolute top-1/2 left-0 right-0 h-px"
            style={{ backgroundImage: "repeating-linear-gradient(to right, #fbbf24 0 14px, transparent 14px 28px)" }}
          />

          {/* Trail (afterimages, oldest faintest) */}
          {trail.map((pct, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full pointer-events-none"
              style={{
                left: `calc(${pct}% - 14px)`,
                background: carColor,
                opacity: ((i + 1) / trail.length) * 0.22,
                filter: `blur(${1.5 + (trail.length - i) * 0.45}px)`,
              }}
            />
          ))}

          {/* Velocity arrow (above the car) */}
          {Math.abs(v) > 0.4 && (
            <div className="absolute pointer-events-none" style={{
              top: "calc(50% - 24px)",
              left: `${sPct}%`,
              transform: "translateX(-50%)",
              width: `${Math.min(70, Math.abs(v) * 2.4)}px`,
              height: 3,
              background: "#38bdf8",
              borderRadius: 2,
              boxShadow: "0 0 6px #38bdf8",
              transformOrigin: "center",
            }}>
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-sky-300 whitespace-nowrap">
                v: {v.toFixed(1)} m/s
              </span>
              <span className="absolute top-1/2 -translate-y-1/2" style={{
                [v >= 0 ? "right" : "left"]: -7,
                width: 0, height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                [v >= 0 ? "borderLeft" : "borderRight"]: "8px solid #38bdf8",
              } as React.CSSProperties} />
            </div>
          )}

          {/* The Car — color shifts with speed, motion blur at high speed */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full shadow-xl border-2 border-white/40 flex items-center justify-center select-none z-10"
            style={{
              left: `${sPct}%`,
              transform: "translate(-50%, -50%)",
              background: carColor,
              boxShadow: `0 0 ${10 + speedRatio * 22}px ${carColor}, 0 4px 10px rgba(0,0,0,0.4)`,
              filter: `blur(${motionBlur}px)`,
              cursor: mode === "explore" ? "grab" : "default",
            }}
          >
            <span
              className="text-lg inline-block"
              style={{
                filter: `blur(${motionBlur * 0.3}px)`,
                transform: mode === "manual" ? `scaleX(${v < 0 ? 1 : -1})` : "none",
              }}
            >
              {mode === "manual" ? "🏎️" : "🖐️"}
            </span>
          </div>

          {/* Acceleration arrow (below the car) */}
          {Math.abs(currA) > 0.3 && (
            <div className="absolute pointer-events-none" style={{
              top: "calc(50% + 22px)",
              left: `${sPct}%`,
              transform: "translateX(-50%)",
              width: `${Math.min(55, Math.abs(currA) * 6)}px`,
              height: 2,
              background: "#fb923c",
              borderRadius: 1,
              boxShadow: "0 0 4px #fb923c",
            }}>
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-orange-300 whitespace-nowrap">
                a: {currA.toFixed(1)} m/s²
              </span>
              <span className="absolute top-1/2 -translate-y-1/2" style={{
                [currA >= 0 ? "right" : "left"]: -6,
                width: 0, height: 0,
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                [currA >= 0 ? "borderLeft" : "borderRight"]: "6px solid #fb923c",
              } as React.CSSProperties} />
            </div>
          )}
        </div>

        {/* Bottom HUD: mini speedometer + status */}
        <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-t border-white/10">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 60 36" className="w-14 h-9">
              <path d="M5 32 A 25 25 0 0 1 55 32" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
              <path d="M5 32 A 25 25 0 0 1 55 32" fill="none" stroke={carColor} strokeWidth="4" strokeLinecap="round"
                    pathLength="100" strokeDasharray={`${speedRatio * 100} 100`} />
              <line x1="30" y1="32"
                    x2={30 + 18 * Math.cos((gaugeAngle * Math.PI) / 180)}
                    y2={32 + 18 * Math.sin((gaugeAngle * Math.PI) / 180)}
                    stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="30" cy="32" r="2" fill="#fff" />
            </svg>
            <div className="text-[10px] font-black text-white/90 leading-tight">
              <div>{Math.abs(v).toFixed(1)} <span className="opacity-60">m/s</span></div>
              <div className="text-white/55">
                {speedRatio < 0.33
                  ? (isAs ? "ধীৰ" : "Slow")
                  : speedRatio < 0.66
                    ? (isAs ? "মধ্যম" : "Medium")
                    : (isAs ? "দ্ৰুত" : "Fast")}
              </div>
            </div>
          </div>
          {mode === "manual" && (
            <div className="text-[10px] font-black text-white/80 text-right">
              <div>{isAs ? "সময়" : "Time"}: {t.toFixed(2)}s / {targetT}s</div>
              <div className="w-28 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full transition-all"
                     style={{ width: `${Math.min(100, (t / targetT) * 100)}%`, background: carColor }} />
              </div>
            </div>
          )}
          {mode === "explore" && (
            <div className="text-[10px] font-black text-white/70 text-right">
              {isAs ? "টানি ধৰি ৰাখি গতি কৰক" : "Hold + drag to move"}
            </div>
          )}
        </div>
      </div>

      {/* Live data panels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <SimNumber label={isAs ? "সময় (t)" : "Time (t)"}        value={t}     unit=" s"    color="#10b981" />
        <SimNumber label={isAs ? "সৰণ (s)" : "Disp. (s)"}        value={s}     unit=" m"    color="#0ea5e9" />
        <SimNumber label={isAs ? "বেগ (v)" : "Velocity (v)"}     value={v}     unit=" m/s"  color="#38bdf8" />
        <SimNumber label={isAs ? "ত্বৰণ (a)" : "Accel. (a)"}     value={currA} unit=" m/s²" color="#fb923c" />
      </div>

      {/* Two real-time graphs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-black text-gray-500 dark:text-gray-400 mb-1">
            {isAs ? "সৰণ বনাম সময়" : "Displacement vs Time"}
          </div>
          <SimGraph
            points={ptsS}
            xMax={Math.max(5, targetT)}
            yMax={Math.max(50, Math.abs(s) + 20)}
            xLabel="t (s)" yLabel="s (m)"
            color="#0ea5e9" height={130}
          />
        </div>
        <div>
          <div className="text-xs font-black text-gray-500 dark:text-gray-400 mb-1">
            {isAs ? "বেগ বনাম সময়" : "Velocity vs Time"}
          </div>
          <SimGraph
            points={ptsV}
            xMax={Math.max(5, targetT)}
            yMax={Math.max(20, Math.abs(v) + 5)}
            xLabel="t (s)" yLabel="v (m/s)"
            color="#38bdf8" height={130}
          />
        </div>
      </div>
    </SimContainer>
  );
}

/* 8. Kinetic Energy — Cruise + Impact, with Live KE Graph */
type KEObject = "ball" | "bike" | "car" | "truck";
type KEMode = "cruise" | "impact";
type KEGraphMode = "kevsv" | "kevsms";

export function KineticEnergySim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [objType, setObjType] = useState<KEObject>("car");
  const [mass, setMass] = useState(1000);
  const [vel, setVel]  = useState(20);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<KEMode>("cruise");
  const [graphMode, setGraphMode] = useState<KEGraphMode>("kevsv");

  const sceneRef = useRef({ bgX: 0, carX: 40 });
  const [bgX, setBgX] = useState(0);
  const [carX, setCarX] = useState(40);
  const [impacted, setImpacted] = useState(false);

  const ke = 0.5 * mass * vel * vel;
  const keMax = 0.5 * 8000 * 50 * 50; // for normalisation
  const keBarPct = Math.max(0, Math.min(100, (ke / keMax) * 100));

  const reset = () => {
    setRunning(false);
    setImpacted(false);
    sceneRef.current.carX = 40;
    sceneRef.current.bgX = 0;
    setCarX(40);
    setBgX(0);
  };

  useRafLoop(running, (dt) => {
    if (mode === "cruise") {
      sceneRef.current.bgX = (sceneRef.current.bgX + vel * dt * 15) % 100;
      setBgX(sceneRef.current.bgX);
    } else if (!impacted) {
      sceneRef.current.carX += vel * dt * 25;
      setCarX(sceneRef.current.carX);
      if (sceneRef.current.carX >= 230) {
        sceneRef.current.carX = 230;
        setCarX(230);
        setImpacted(true);
        setRunning(false);
      }
    }
  });

  // Colour shift with KE
  const energyColor = ke < 5e3 ? "#38bdf8" : ke < 2e5 ? "#facc15" : "#ef4444";
  const auraSize = Math.min(80, 5 + (ke / keMax) * 150);

  // KE-vs-x curve points
  const curvePoints = (() => {
    const pts: string[] = [];
    if (graphMode === "kevsv") {
      const yMax = 0.5 * mass * 50 * 50;
      for (let v = 0; v <= 50; v += 2) {
        const k = 0.5 * mass * v * v;
        const px = 20 + (v / 50) * 160;
        const py = 90 - (k / (yMax || 1)) * 80;
        pts.push(`${px},${py}`);
      }
    } else {
      const yMax = 4000 * vel * vel;
      for (let m = 0; m <= 8000; m += 400) {
        const k = 0.5 * m * vel * vel;
        const px = 20 + (m / 8000) * 160;
        const py = 90 - (k / (yMax || 1)) * 80;
        pts.push(`${px},${py}`);
      }
    }
    return pts.join(" ");
  })();

  const currentPoint = (() => {
    if (graphMode === "kevsv") {
      const yMax = 0.5 * mass * 50 * 50;
      return { cx: 20 + (vel / 50) * 160, cy: 90 - (ke / (yMax || 1)) * 80 };
    }
    const yMax = 4000 * vel * vel;
    return { cx: 20 + (mass / 8000) * 160, cy: 90 - (ke / (yMax || 1)) * 80 };
  })();

  // Dynamic feedback
  let feedback = mode === "cruise"
    ? (isAs
        ? "বস্তুটো একনাগাড়ে গতি কৰি আছে। অধিক বেগে গতিশক্তি (KE) বিশাল হাৰত বাঢ়ে।"
        : "Object moves continuously. Higher velocity drastically increases Kinetic Energy (KE).")
    : (isAs
        ? "সংঘাত পৰীক্ষা প্ৰস্তুত। অধিক KE-এ দেৱালত প্ৰবল আঘাত কৰিব।"
        : "Collision test ready. Higher KE will cause a massive impact force on the wall.");
  if (running && mode === "cruise") {
    feedback = isAs
      ? `${vel} m/s বেগেৰে চলিছে! শক্তি তীব্ৰতা অনুসৰি জ্বলিছে।`
      : `Cruising at ${vel} m/s! Energy is actively glowing based on intensity.`;
  } else if (impacted) {
    feedback = ke < 1e3
      ? (isAs
          ? "সামান্য আঘাত। বস্তুটোৱে দেৱালত হেঁচুকা মাৰিলে।"
          : "Minor tap. The object barely hit the wall.")
      : ke < 1e5
        ? (isAs
            ? "দৃঢ় সংঘাত! গতিশক্তি দেৱালে শোষণ কৰিলে।"
            : "Solid collision! The kinetic energy was absorbed by the wall.")
        : (isAs
            ? "বিশাল আঘাত! ভয়ংকৰ গতিশক্তিয়ে চৰম বিকৃতি সৃষ্টি কৰিলে!"
            : "Massive Impact! The tremendous kinetic energy caused extreme deformation!");
  }

  const objLabel: Record<KEObject, { en: string; as: string; emoji: string; fontSize: string }> = {
    ball:  { en: "Ball",  as: "বল",          emoji: "⚽",   fontSize: "20" },
    bike:  { en: "Bike",  as: "মটৰচাইকেল",   emoji: "🏍️", fontSize: "30" },
    car:   { en: "Car",   as: "গাড়ী",         emoji: "🚗",  fontSize: "35" },
    truck: { en: "Truck", as: "ট্ৰাক",         emoji: "🚚",  fontSize: "40" },
  };

  const formatKE = (j: number) =>
    j >= 1e6 ? `${(j / 1e6).toFixed(2)} MJ`
    : j >= 1e3 ? `${(j / 1e3).toFixed(1)} kJ`
    : `${j.toFixed(0)} J`;

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "সমীকৰণ: KE = ½mv²। বেগ দুগুণ হ'লে KE চাৰি গুণ হয় লক্ষ্য কৰক!"
        : "Equation: KE = ½mv². Notice that doubling velocity increases KE by a factor of 4!"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* LEFT — controls */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setMode("cruise"); reset(); }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                mode === "cruise"
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/30"
                  : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"
              }`}
            >
              {isAs ? "ভ্ৰমণ ধৰণ" : "Cruise Mode"}
            </button>
            <button
              onClick={() => { setMode("impact"); reset(); }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                mode === "impact"
                  ? "bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-500/30"
                  : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"
              }`}
            >
              {isAs ? "সংঘাত ধৰণ" : "Impact Mode"}
            </button>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 mb-1">
              {isAs ? "বস্তু প্ৰিছেট" : "Object Preset"}
            </label>
            <div className="flex gap-1">
              {(["ball", "bike", "car", "truck"] as const).map((o) => {
                const presetMass = { ball: 5, bike: 200, car: 1500, truck: 5000 }[o];
                return (
                  <button
                    key={o}
                    onClick={() => { setObjType(o); setMass(presetMass); reset(); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                      objType === o ? "bg-emerald-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {objLabel[o].emoji} {isAs ? objLabel[o].as : objLabel[o].en}
                  </button>
                );
              })}
            </div>
          </div>

          <SimSlider
            label={isAs ? "ভৰ (m)" : "Mass (m)"}
            value={mass}
            onChange={(val) => { setMass(val); reset(); }}
            min={1} max={8000} step={1} unit=" kg" color="#10b981"
          />
          <SimSlider
            label={isAs ? "বেগ (v)" : "Velocity (v)"}
            value={vel}
            onChange={(val) => { setVel(val); reset(); }}
            min={0} max={50} step={1} unit=" m/s" color="#f59e0b"
          />

          {/* KE display panel */}
          <div className="bg-[#0f172a]/50 p-3 rounded-xl border border-white/10 mt-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                {isAs ? "গতিশক্তি" : "Kinetic Energy"}
              </span>
              <span className="text-xl font-black drop-shadow-md" style={{ color: energyColor }}>
                {formatKE(ke)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden relative">
              <div className="h-full transition-all duration-300"
                   style={{ width: `${keBarPct}%`, background: energyColor, filter: `drop-shadow(0 0 8px ${energyColor})` }} />
            </div>
          </div>

          <div className="flex gap-2">
            <SimButton
              onClick={() => setRunning(true)}
              color="#10b981"
              icon={<Play className="w-4 h-4" />}
              disabled={running || impacted || vel === 0}
            >
              {isAs ? "গতি আৰম্ভ" : "Start Motion"}
            </SimButton>
          </div>
        </div>

        {/* MIDDLE — animated scene */}
        <div className="lg:col-span-1 bg-[#020617] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col" style={{ minHeight: "350px" }}>
          <svg viewBox="0 0 300 200" className="w-full h-full flex-1">
            <defs>
              <linearGradient id="ke-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <filter id="ke-motion-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={running ? vel / 4 : 0} />
              </filter>
              <filter id="ke-aura">
                <feGaussianBlur in="SourceGraphic" stdDeviation={running || impacted ? auraSize / 10 : 0} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="300" height="200" fill="url(#ke-sky)" />
            {/* Buildings (parallax) */}
            <g opacity="0.3">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 100 - bgX} y="130" width="10" height="30" fill="#334155" />
              ))}
            </g>
            {/* Road */}
            <rect x="0" y="150" width="300" height="50" fill="#1e293b" />
            <rect x="0" y="145" width="300" height="5"  fill="#475569" />
            {/* Road dashes */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i}
                    x={i * 60 - (mode === "cruise" ? bgX : 0)}
                    y="170" width="30" height="4" fill="#cbd5e1" opacity="0.4" />
            ))}
            {/* Wall (impact mode) */}
            {mode === "impact" && (
              <g transform="translate(260, 90)">
                <rect width="20" height="60" fill="#94a3b8" rx="2" />
                <line x1="0"  y1="0" x2="20" y2="60" stroke="#475569" strokeWidth="2" />
                <line x1="20" y1="0" x2="0"  y2="60" stroke="#475569" strokeWidth="2" />
                {impacted && ke > 5e4 && <path d="M -5 30 L 10 20 L 5 40 Z" fill="#0f172a" />}
              </g>
            )}
            {/* Vehicle */}
            <g transform={`translate(${mode === "cruise" ? 40 : carX}, 145)`} filter="url(#ke-motion-blur)">
              {(running || impacted) && (
                <ellipse cx="0" cy="-15" rx={30 + auraSize / 2} ry={20 + auraSize / 3}
                         fill={energyColor} opacity="0.4" filter="url(#ke-aura)" />
              )}
              {impacted && (
                <circle cx="20" cy="-15" r={Math.min(100, 10 + ke / 1e4)}
                        fill={energyColor} opacity="0.7" filter="url(#ke-aura)">
                  <animate attributeName="r" values={`10; ${Math.min(150, 20 + ke / 5e3)}; 0`} dur="0.5s" fill="freeze" />
                  <animate attributeName="opacity" values="0.8; 0" dur="0.5s" fill="freeze" />
                </circle>
              )}
              {running && vel > 10 && (
                <g opacity="0.5">
                  <line x1="-30" y1="-10" x2="-60" y2="-10" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="-20" y1="-25" x2="-80" y2="-25" stroke="white" strokeWidth="1" strokeDasharray="2 6" />
                </g>
              )}
              <text x="0" y="-5" transform="scale(-1, 1)"
                    fontSize={objLabel[objType].fontSize}
                    textAnchor="middle"
                    style={{ userSelect: "none" }}>
                {objLabel[objType].emoji}
              </text>
            </g>
          </svg>
          <div className="w-full bg-slate-900 border-t border-indigo-500/30 p-2 text-center text-xs font-bold text-indigo-200">
            {feedback}
          </div>
        </div>

        {/* RIGHT — live graph */}
        <div className="lg:col-span-1 bg-[#0f172a]/50 p-4 rounded-xl border border-white/10 flex flex-col shadow-inner min-h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-black uppercase text-gray-500 tracking-wider">
              {isAs ? "তাৎক্ষণিক লেখ" : "Live Graph"}
            </label>
            <select
              value={graphMode}
              onChange={(e) => setGraphMode(e.target.value as KEGraphMode)}
              className="bg-transparent text-xs font-bold text-white border-b border-white/20 pb-1 cursor-pointer outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="kevsv"  className="bg-slate-800">{isAs ? "KE বনাম বেগ (v)" : "KE vs Velocity (v)"}</option>
              <option value="kevsms" className="bg-slate-800">{isAs ? "KE বনাম ভৰ (m)"  : "KE vs Mass (m)"}</option>
            </select>
          </div>

          <div className="flex-1 relative border-l border-b border-slate-700 mx-2 mt-4 mb-6">
            <svg viewBox="0 0 200 100" className="w-full h-full absolute inset-0 overflow-visible">
              <line x1="20" y1="10" x2="180" y2="10" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="20" y1="50" x2="180" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              <text x="5" y="10" fill="#64748b" fontSize="8" textAnchor="middle" transform="rotate(-90 5,10)">
                {isAs ? "শক্তি (J)" : "Energy (J)"}
              </text>
              <text x="180" y="110" fill="#64748b" fontSize="8" textAnchor="end">
                {graphMode === "kevsv"
                  ? (isAs ? "বেগ (m/s)" : "Velocity (m/s)")
                  : (isAs ? "ভৰ (kg)"   : "Mass (kg)")}
              </text>
              <polyline
                points={curvePoints} fill="none" stroke={energyColor} strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${energyColor})` }}
              />
              <g transform={`translate(${currentPoint.cx}, ${currentPoint.cy})`}>
                <circle r="4" fill="white" style={{ filter: `drop-shadow(0 0 6px ${energyColor})` }} />
                <circle r="6" fill="none" stroke={energyColor} strokeWidth="1.5">
                  {running && <animate attributeName="r"       values="4; 10; 4" dur="1s" repeatCount="indefinite" />}
                  {running && <animate attributeName="opacity" values="1; 0; 1"  dur="1s" repeatCount="indefinite" />}
                </circle>
              </g>
            </svg>
          </div>

          <div className="mt-auto bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="text-xs font-medium text-gray-400 leading-relaxed text-center">
              {graphMode === "kevsv"
                ? isAs
                  ? <>লক্ষ্য কৰক <strong className="text-indigo-400">পেৰাবলিক বক্ৰ</strong>। বেগৰ বৰ্গ (v²) হোৱা বাবে, বেগৰ সামান্য বৃদ্ধিয়ে শক্তিৰ বৃহৎ বৃদ্ধি ঘটায়!</>
                  : <>Observe the <strong className="text-indigo-400">Parabolic Curve</strong>. Because velocity is squared (v²), a small increase in speed produces a massive increase in Energy!</>
                : isAs
                  ? <>লক্ষ্য কৰক <strong className="text-emerald-400">ৰৈখিক ঢাল</strong>। গতিশক্তি বস্তুৰ ভৰৰ সমানুপাতে স্থিৰভাৱে বাঢ়ে।</>
                  : <>Observe the <strong className="text-emerald-400">Linear Slope</strong>. Kinetic energy increases steadily in direct proportion to the object's mass.</>}
            </p>
          </div>
        </div>
      </div>
    </SimContainer>
  );
}

/* 9. Potential Energy — Drag, Drop & Energy Conversion */
type PEObject = "box" | "sphere" | "rock";

export function PotentialEnergySim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [gravity, setGravity] = useState(9.8);
  const [mass, setMass] = useState(2);
  const [setH, setSetH] = useState(25);          // target height (slider / drag)
  const [objType, setObjType] = useState<PEObject>("box");
  const [falling, setFalling] = useState(false);
  const [curH, setCurH] = useState(25);          // current height during fall
  const [vel, setVel] = useState(0);

  const tRef = useRef(0);
  const [history, setHistory] = useState<{ t: number; pe: number; ke: number }[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState(false);

  // Geometry
  const H_MAX  = 50;       // max real-world height (m)
  const V_W    = 350;      // viewBox width
  const V_H    = 400;      // viewBox height
  const GROUND = 360;      // ground y in svg coords
  const PX_PER_M = (GROUND - 40) / H_MAX;

  const reset = () => {
    setFalling(false);
    setCurH(setH);
    setVel(0);
    tRef.current = 0;
    setHistory([]);
  };

  // Keep curH in sync with the slider when not falling/dragging
  useEffect(() => {
    if (!falling && !dragging) setCurH(setH);
  }, [setH, falling, dragging]);

  // Drop physics (RAF)
  useRafLoop(falling, (dt) => {
    tRef.current += dt;
    const fallDist = 0.5 * gravity * tRef.current * tRef.current;
    const newH = setH - fallDist;
    if (newH <= 0) {
      setCurH(0);
      setVel(Math.sqrt(2 * gravity * setH));
      setFalling(false);
      return;
    }
    setCurH(newH);
    setVel(gravity * tRef.current);
    if (Math.floor(tRef.current * 15) > Math.floor((tRef.current - dt) * 15)) {
      const curPE = mass * gravity * newH;
      const curKE = 0.5 * mass * Math.pow(gravity * tRef.current, 2);
      setHistory((p) => [...p, { t: tRef.current, pe: curPE, ke: curKE }]);
    }
  });

  // Drag handlers: pointer Y → height
  const updateHeightFromPointer = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    const raw = (GROUND - loc.y) / PX_PER_M;
    let h = Math.max(0, Math.min(H_MAX, raw));
    h = Math.round(h * 10) / 10;
    setSetH(h);
    setCurH(h);
    setHistory([]);
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    if (falling) return;
    setDragging(true);
    updateHeightFromPointer(e);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging) updateHeightFromPointer(e);
  };
  const handlePointerUp = () => setDragging(false);

  // Energies (derived)
  const pe    = mass * gravity * curH;
  const ke    = 0.5 * mass * vel * vel;
  const peMax = mass * gravity * H_MAX;
  const intensity = Math.min(1, pe / (10 * 24.7 * H_MAX));
  const r = Math.floor( 10 + intensity * 245);
  const g = Math.floor(185 - intensity * 185);
  const b = Math.floor(255 - intensity * 255);
  const aura = `rgba(${r},${g},${b},0.6)`;
  const objY = GROUND - curH * PX_PER_M;
  const emoji = objType === "box" ? "📦" : objType === "sphere" ? "🎳" : "🪨";

  // Dynamic feedback
  let feedback = isAs
    ? `সঞ্চিত PE = ${pe.toFixed(1)} J। মাধ্যাকৰ্ষণিক বিভৱ শক্তি সঞ্চয় কৰিবলৈ বস্তুটো উলম্বভাৱে টানক!`
    : `Stored PE = ${pe.toFixed(1)} J. Drag the object vertically to store Gravitational Potential Energy!`;
  if (falling) {
    feedback = isAs
      ? "পৰিছে! বিভৱ শক্তি দ্ৰুতভাৱে গতিশক্তিলৈ ৰূপান্তৰিত হৈছে।"
      : "Falling! Potential energy is rapidly converting into kinetic energy.";
  } else if (curH === 0 && setH > 0) {
    feedback = isAs
      ? "সংঘাত! সকলো সঞ্চিত বিভৱ শক্তি সফলভাৱে গতিশক্তিলৈ ৰূপান্তৰিত হ'ল।"
      : "Impact! All stored potential energy has successfully converted to kinetic energy.";
  } else if (gravity === 1.6) {
    feedback = isAs
      ? "চন্দ্ৰৰ মাধ্যাকৰ্ষণে (1.6 m/s²) পৃথিৱীতকৈ বহু কম বিভৱ শক্তি সঞ্চয় কৰে।"
      : "Moon gravity (1.6 m/s²) stores much less potential energy compared to Earth.";
  } else if (gravity > 20) {
    feedback = isAs
      ? "বৃহস্পতিৰ মাধ্যাকৰ্ষণে (24.7 m/s²) বিশাল মাধ্যাকৰ্ষণিক টানৰ বাবে অপৰিসীম বিভৱ শক্তি সঞ্চয় কৰে!"
      : "Jupiter gravity (24.7 m/s²) stores immense potential energy due to massive gravitational pull!";
  } else if (curH === H_MAX) {
    feedback = isAs
      ? "সৰ্বোচ্চ উচ্চতা! এই ভৰৰ বাবে সৰ্বাধিক বিভৱ শক্তি সঞ্চিত হ'ল।"
      : "Maximum height reached! Maximum potential energy stored for this mass.";
  }

  const series = [
    { points: history.map((h) => ({ x: h.t, y: h.pe })), color: "#10b981" },
    { points: history.map((h) => ({ x: h.t, y: h.ke })), color: "#f97316" },
  ];

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "বিভৱ শক্তি (PE = mgh) এটা বস্তুৰ মাধ্যাকৰ্ষণিক ক্ষেত্ৰত অৱস্থানৰ বাবে সঞ্চিত শক্তি।"
        : "Potential Energy (PE = mgh) is the energy stored due to an object's position in a gravitational field."}
    >
      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <SimSlider
          label={isAs ? "ভৰ (m)" : "Mass (m)"}
          value={mass} onChange={(v) => { setMass(v); reset(); }}
          min={1} max={10} step={1} unit=" kg" color="#f59e0b"
          disabled={falling}
        />
        <SimSlider
          label={isAs ? "উচ্চতা (h)" : "Height (h)"}
          value={setH} onChange={(v) => { setSetH(v); setCurH(v); reset(); }}
          min={0} max={H_MAX} step={1} unit=" m" color="#10b981"
          disabled={falling}
        />
        <div className="flex flex-col justify-center px-1">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "মাধ্যাকৰ্ষণ" : "Gravity"}
          </label>
          <select
            value={gravity}
            onChange={(e) => { setGravity(Number(e.target.value)); reset(); }}
            disabled={falling}
            className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full"
          >
            <option value={9.8}>{isAs ? "পৃথিৱী (9.8)" : "Earth (9.8)"}</option>
            <option value={1.6}>{isAs ? "চন্দ্ৰ (1.6)" : "Moon (1.6)"}</option>
            <option value={24.7}>{isAs ? "বৃহস্পতি (24.7)" : "Jupiter (24.7)"}</option>
          </select>
        </div>
        <div className="flex flex-col justify-center px-1">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "বস্তু" : "Object"}
          </label>
          <select
            value={objType}
            onChange={(e) => setObjType(e.target.value as PEObject)}
            className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full"
          >
            <option value="box">📦 {isAs ? "বাকচ" : "Box"}</option>
            <option value="sphere">🎳 {isAs ? "গোলক" : "Sphere"}</option>
            <option value="rock">🪨 {isAs ? "শিল" : "Rock"}</option>
          </select>
        </div>
      </div>

      {/* Drop button */}
      <div className="flex justify-center gap-3 mb-4">
        <SimButton onClick={() => setFalling(true)} color="#f97316" disabled={falling || curH === 0}
                   icon={<Play className="w-3.5 h-3.5" />}>
          {isAs ? "বস্তু এৰি দিয়ক" : "Drop Object"}
        </SimButton>
      </div>

      {/* Scene */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#0a0f1c] to-[#1e1b4b] touch-none mb-4 w-full h-[320px] sm:h-[400px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Background radial glow that intensifies with PE */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-300"
          style={{ background: `radial-gradient(circle at 50% 50%, ${aura}, transparent 70%)` }}
        />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${V_W} ${V_H}`}
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full absolute inset-0 ${falling ? "" : "cursor-ns-resize active:cursor-grabbing"}`}
        >
          <defs>
            <marker id="pe-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 z" fill="#38bdf8" />
            </marker>
            <filter id="pe-glow">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="pe-brick" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#0f172a" />
              <path d="M0,10 L20,10 M10,0 L10,10 M0,10 L0,20 M20,10 L20,20" stroke="#1e293b" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Tower */}
          <rect x={135} y={30}  width={30}  height={GROUND - 30}    fill="url(#pe-brick)" />
          <rect x={130} y={30}  width={40}  height={10}             fill="#334155" />
          {/* Ground */}
          <rect x={0}   y={GROUND} width={V_W} height={V_H - GROUND} fill="#020617" />
          <line x1={0}  x2={V_W} y1={GROUND} y2={GROUND}             stroke="#475569" strokeWidth="3" />

          {/* Faint vertical gridlines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={40 + i * 65} x2={40 + i * 65} y1={50} y2={GROUND - 20}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          ))}

          {/* Height arrow */}
          <line x1={80} x2={80} y1={objY} y2={GROUND}
                stroke="#38bdf8" strokeWidth="2"
                markerEnd="url(#pe-arrow)" markerStart="url(#pe-arrow)" opacity={0.6} />
          <text x={70} y={(objY + GROUND) / 2}
                fill="#38bdf8" fontSize="14" fontWeight="bold"
                transform={`rotate(-90 70 ${(objY + GROUND) / 2})`}
                textAnchor="middle">
            h = {curH.toFixed(1)} m
          </text>
          {!falling && curH === setH && (
            <text x={V_W - 70} y={objY + 5} fill="#94a3b8" fontSize="12" fontStyle="italic" textAnchor="middle" opacity="0.6">
              {isAs ? "ওপৰ-তললৈ টানক ↑↓" : "Drag to lift ↑↓"}
            </text>
          )}

          {/* The object + energy aura */}
          <g transform={`translate(150, ${objY})`}>
            {pe > 0 && (
              <circle cx={0} cy={0} r={20 + intensity * 45}
                      fill={aura} filter="url(#pe-glow)"
                      className="transition-all duration-300"
                      opacity={0.5 + intensity * 0.4} />
            )}
            <text x={0} y={12} textAnchor="middle"
                  fontSize={mass * 2 + 24}
                  className="select-none pointer-events-none drop-shadow-xl">
              {emoji}
            </text>
          </g>

          {/* Live PE / KE readout (top-right) */}
          <rect x={V_W - 120} y={20} width={100} height={50} rx="6" fill="rgba(0,0,0,0.7)" stroke="#1e293b" strokeWidth="1" />
          <text x={V_W - 70} y={40} fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">
            PE = {pe.toFixed(0)} J
          </text>
          <text x={V_W - 70} y={55} fill="#f97316" fontSize="12" textAnchor="middle" fontWeight="bold">
            KE = {ke.toFixed(0)} J
          </text>
        </svg>
      </div>

      {/* Dynamic feedback */}
      <div className="w-full bg-slate-900 border border-emerald-500/30 p-3 mb-4 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-emerald-100 leading-relaxed">{feedback}</p>
      </div>

      {/* Live numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <SimNumber label={isAs ? "বিভৱ শক্তি" : "Potential Energy"} value={pe}      unit=" J"   color="#10b981" precision={0} />
        <SimNumber label={isAs ? "গতিশক্তি" : "Kinetic Energy"}     value={ke}      unit=" J"   color="#f97316" precision={0} />
        <SimNumber label={isAs ? "মুঠ শক্তি" : "Total Energy"}      value={pe + ke} unit=" J"   color="#8b5cf6" precision={0} />
        <SimNumber label={isAs ? "বেগ" : "Velocity"}                value={vel}     unit=" m/s" color="#38bdf8" precision={1} />
      </div>

      {/* Energy conversion graph */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-black text-gray-500 dark:text-gray-400">
            {isAs ? "শক্তি ৰূপান্তৰ লেখ" : "Energy Conversion Graph"}
          </div>
          <div className="flex gap-3 text-[10px] font-bold">
            <span className="text-emerald-500">■ PE</span>
            <span className="text-orange-500">■ KE</span>
          </div>
        </div>
        <SimGraph
          series={series}
          xMax={Math.max(3, tRef.current)}
          yMax={peMax + 10}
          xLabel={isAs ? "সময় (s)" : "Time (s)"}
          yLabel={isAs ? "শক্তি (J)" : "Energy (J)"}
          height={120}
        />
      </div>
    </SimContainer>
  );
}

/* 10. Pendulum — Conservation of Energy (Interactive) */
export function PendulumSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"explore" | "challenge">("explore");

  // Physical parameters
  const [L, setL] = useState(1.0);   // string length (m)
  const [M, setM] = useState(1.0);   // bob mass (kg)
  const [g, setG] = useState(9.8);   // gravity (m/s²)
  const [damping, setDamping] = useState(false);
  const [slowMo, setSlowMo] = useState(false);

  // Live state
  const [theta, setTheta] = useState(Math.PI / 4); // 45°
  const aRef = useRef(Math.PI / 4);
  const wRef = useRef(0);
  const tRef = useRef(0);

  // Live energy graph data
  const [graphData, setGraphData] = useState<{ t: number; pe: number; ke: number; te: number }[]>([]);

  // Bob trail (afterimages)
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  // Drag interaction
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  // Challenge state
  const [challengeState, setChallengeState] = useState<"pending" | "success">("pending");

  // Derived physics
  const h    = L * (1 - Math.cos(theta));
  const pe   = M * g * h;
  const v    = L * wRef.current;
  const ke   = 0.5 * M * v * v;
  const te   = pe + ke;
  const maxTE = M * g * L * 1.5;        // graph upper bound (PE at θ=π is 2MgL, this covers ~75° release)
  const vMax  = Math.sqrt(2 * g * L);   // max possible speed (released from horizontal)

  // Visual length of string in viewBox units (50..150 for L in [0.5, 2.0])
  const L_vis = 50 + L * 50;

  const reset = () => {
    aRef.current = Math.PI / 4;
    wRef.current = 0;
    tRef.current = 0;
    setTheta(Math.PI / 4);
    setRunning(false);
    setGraphData([]);
    setTrail([]);
    if (mode === "challenge") setChallengeState("pending");
  };

  // RAF physics loop
  useRafLoop(running, (dt) => {
    const realDt = slowMo ? dt * 0.2 : dt;
    tRef.current += realDt;

    const aAcc = -(g / L) * Math.sin(aRef.current);
    wRef.current += aAcc * realDt;
    if (damping) wRef.current *= Math.exp(-0.05 * realDt);
    aRef.current += wRef.current * realDt;
    setTheta(aRef.current);

    // Sample graph at ~20 Hz (matches live build behaviour)
    if (Math.floor(tRef.current * 20) > Math.floor((tRef.current - realDt) * 20)) {
      const curH  = L * (1 - Math.cos(aRef.current));
      const curPE = M * g * curH;
      const curV  = L * wRef.current;
      const curKE = 0.5 * M * curV * curV;
      setGraphData((p) => [...p.slice(-200), { t: tRef.current, pe: curPE, ke: curKE, te: curPE + curKE }]);
    }

    // Bob position for trail
    const tx = 150 + L_vis * Math.sin(aRef.current);
    const ty = 20  + L_vis * Math.cos(aRef.current);
    setTrail((tr) => [...tr.slice(-14), { x: tx, y: ty }]);
  });

  // Drag handlers
  const updateAngleFromPointer = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    const dx = loc.x - 150;
    const dy = loc.y - 20;
    let angle = Math.atan2(dx, dy);
    angle = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angle));
    aRef.current = angle;
    wRef.current = 0;
    setTheta(angle);
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setRunning(false);
    updateAngleFromPointer(e);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging) updateAngleFromPointer(e);
  };
  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    wRef.current = 0;
    tRef.current = 0;
    setGraphData([]);
    setTrail([]);
    if (mode === "challenge") {
      const deg = Math.abs((aRef.current * 180) / Math.PI);
      setChallengeState(Math.abs(deg - 60) < 5 && !damping ? "success" : "pending");
    }
    setRunning(true);
  };

  // Bob visual position
  const px = 150 + L_vis * Math.sin(theta);
  const py = 20  + L_vis * Math.cos(theta);

  // Bob colour: interpolate Blue (PE dominant) → Orange (KE dominant)
  const peRatio = te > 0 ? pe / te : 1;
  const keRatio = te > 0 ? ke / te : 0;
  const r  = Math.floor(peRatio *  59 + keRatio * 249);
  const gC = Math.floor(peRatio * 130 + keRatio * 115);
  const b  = Math.floor(peRatio * 246 + keRatio *  22);
  const bobColor = `rgb(${r},${gC},${b})`;

  const speedRatio = vMax > 0 ? Math.min(1, Math.abs(v) / vMax) : 0;
  const glowSize   = 6 + speedRatio * 14;

  // Dynamic feedback line
  let feedback: string;
  if (!running && !dragging) {
    feedback = isAs
      ? "গোলক টানি এৰি দিয়াৰ কোণ নিৰ্ধাৰণ কৰক, তাৰপাছত চালু কৰক।"
      : "Drag the bob to set a release angle, then press Play.";
  } else if (Math.abs(wRef.current) < 0.15 && Math.abs(theta) > 0.1) {
    feedback = isAs
      ? "সৰ্বোচ্চ বিন্দু: সকলো শক্তি = বিভৱ। গোলকটো মুহূৰ্তৰ বাবে ৰয়।"
      : "Highest Point: All energy = Potential. Bob momentarily stops.";
  } else if (Math.abs(theta) < 0.08) {
    feedback = isAs
      ? "সৰ্বনিম্ন বিন্দু: সকলো শক্তি = গতি। বেগ সৰ্বাধিক।"
      : "Lowest Point: All energy = Kinetic. Speed is maximum.";
  } else if (theta * wRef.current < 0) {
    feedback = isAs
      ? "তললৈ দোলিছে: বিভৱ শক্তি → গতিশক্তি-লৈ ৰূপান্তৰ হৈছে।"
      : "Swinging downward: Potential Energy → Kinetic Energy.";
  } else {
    feedback = isAs
      ? "ওপৰলৈ দোলিছে: গতিশক্তি → বিভৱ শক্তি-লৈ ৰূপান্তৰ হৈছে।"
      : "Swinging upward: Kinetic Energy → Potential Energy.";
  }

  // Energy-bar percentages
  const peP = te > 0 ? (pe / te) * 100 : 100;
  const keP = te > 0 ? (ke / te) * 100 : 0;

  // Graph series
  const series = [
    { points: graphData.map((d) => ({ x: d.t, y: d.pe })), color: "#3b82f6" },
    { points: graphData.map((d) => ({ x: d.t, y: d.ke })), color: "#f97316" },
    { points: graphData.map((d) => ({ x: d.t, y: d.te })), color: "#9ca3af", dashed: true },
  ];

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "মুঠ যান্ত্ৰিক শক্তি (PE + KE) স্থিৰ থাকে — যদিহে বায়ু প্ৰতিৰোধ সক্ৰিয় নহয়।"
        : "Total mechanical energy (PE + KE) stays constant — unless Air Resistance is enabled."}
    >
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => { setMode("explore"); reset(); }}
          className={`px-3 py-1 text-xs font-black rounded-md transition-all ${
            mode === "explore"
              ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400"
              : "opacity-60 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isAs ? "অন্বেষণ ধৰণ" : "Exploration Mode"}
        </button>
        <button
          onClick={() => { setMode("challenge"); reset(); }}
          className={`px-3 py-1 text-xs font-black rounded-md transition-all ${
            mode === "challenge"
              ? "bg-white dark:bg-gray-700 shadow-sm text-rose-600 dark:text-rose-400"
              : "opacity-60 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isAs ? "প্ৰত্যাহ্বান ধৰণ" : "Challenge Mode"}
        </button>
      </div>

      {/* Challenge prompt */}
      {mode === "challenge" && (
        <div className={`mb-4 p-3 rounded-xl border-2 transition-colors ${
          challengeState === "success"
            ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
        }`}>
          <div className="font-black text-sm mb-1">
            {challengeState === "success"
              ? (isAs ? "🎉 প্ৰত্যাহ্বান সম্পন্ন!" : "🎉 Challenge Completed!")
              : (isAs ? "🎯 প্ৰত্যাহ্বান:" : "🎯 Challenge:")}
          </div>
          <div className="text-xs font-bold opacity-80">
            {isAs
              ? "বায়ু প্ৰতিৰোধ বন্ধ কৰক, তাৰপাছত গোলকটো ঠিক ৬০°লৈ টানি এৰি দিয়ক। মুঠ শক্তিৰ স্থিৰতা পৰ্যবেক্ষণ কৰক।"
              : "Turn off Air Resistance, then drag the pendulum to exactly 60° and release. Observe how Total Energy stays constant."}
          </div>
        </div>
      )}

      {/* Parameter controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <SimSlider label={isAs ? "দৈৰ্ঘ্য" : "Length"} value={L} onChange={setL}
                   min={0.5} max={2.0} step={0.1} unit=" m" color="#8b5cf6" />
        <SimSlider label={isAs ? "ভৰ" : "Mass"} value={M} onChange={setM}
                   min={0.5} max={5.0} step={0.5} unit=" kg" color="#ec4899" />
        <div className="flex flex-col justify-center">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "মাধ্যাকৰ্ষণ" : "Gravity"}
          </label>
          <select
            value={g}
            onChange={(e) => setG(Number(e.target.value))}
            className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <option value={9.8}>{isAs ? "পৃথিৱী (9.8)" : "Earth (9.8)"}</option>
            <option value={1.6}>{isAs ? "চন্দ্ৰ (1.6)" : "Moon (1.6)"}</option>
            <option value={24.7}>{isAs ? "বৃহস্পতি (24.7)" : "Jupiter (24.7)"}</option>
          </select>
        </div>
        <div className="flex flex-col justify-center gap-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer">
            <input type="checkbox" checked={damping} onChange={(e) => setDamping(e.target.checked)}
                   className="w-3.5 h-3.5 rounded text-emerald-500" />
            {isAs ? "বায়ু প্ৰতিৰোধ" : "Air Resist."}
          </label>
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer">
            <input type="checkbox" checked={slowMo} onChange={(e) => setSlowMo(e.target.checked)}
                   className="w-3.5 h-3.5 rounded text-indigo-500" />
            {isAs ? "ধীৰগতি" : "Slow-Mo"}
          </label>
        </div>
      </div>

      {/* Play / Pause */}
      <div className="flex gap-2 mb-4 justify-center">
        <SimButton
          onClick={() => setRunning(!running)}
          color={running ? "#dc2626" : "#10b981"}
          icon={running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        >
          {running ? (isAs ? "বিৰতি" : "Pause") : (isAs ? "চালু" : "Play")}
        </SimButton>
      </div>

      {/* Pendulum canvas — full-width on mobile, capped + centred on desktop */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700 bg-gradient-to-b from-slate-900 to-slate-800 touch-none mb-4 shadow-inner md:max-w-lg md:mx-auto"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg ref={svgRef} viewBox="0 0 300 240" className="w-full h-auto cursor-grab active:cursor-grabbing">
          <defs>
            <linearGradient id="pendLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="pendGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="pendVArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="#f97316" />
            </marker>
          </defs>

          {/* Light-ray cone falling from pivot */}
          <path d="M150,0 L100,240 L200,240 Z" fill="url(#pendLight)" opacity="0.10" />

          {/* Faint horizontal reference grid */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="20" x2="280" y1={20 + 200 * f} y2={20 + 200 * f}
                  stroke="#334155" strokeDasharray="2 4" strokeWidth="1" opacity="0.45" />
          ))}
          {/* Travel arc */}
          <path d={`M ${150 - L_vis} 20 A ${L_vis} ${L_vis} 0 0 0 ${150 + L_vis} 20`}
                fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

          {/* Pivot mount + shadow */}
          <rect x="130" y="14" width="40" height="10" rx="3" fill="#475569" />
          <circle cx="150" cy="20" r="4" fill="#94a3b8" />

          {/* String shadow (slight offset for depth) */}
          <line x1="152" y1="22" x2={px + 2} y2={py + 2} stroke="#000" strokeWidth="2" opacity="0.3" />
          {/* String */}
          <line x1="150" y1="20" x2={px} y2={py} stroke="#cbd5e1" strokeWidth="2" />

          {/* Height indicator (from bob to vertical axis at bob's height) */}
          <line x1="150" y1={py} x2={px} y2={py}
                stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          <text x="146" y={py - 3} fill="#10b981" fontSize="9" textAnchor="end" fontWeight="bold" opacity="0.85">
            h={h.toFixed(2)}m
          </text>

          {/* Trail (fading afterimages, oldest faintest) */}
          {trail.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y}
              r={(8 + M * 2) * 0.55}
              fill={bobColor}
              opacity={((i + 1) / trail.length) * 0.20}
              style={{ pointerEvents: "none" }}
            />
          ))}

          {/* Velocity arrow (tangential, length ∝ |v|) */}
          {Math.abs(v) > 0.2 && (() => {
            const scale = 14;
            const vx =  v * scale * Math.cos(theta);
            const vy = -v * scale * Math.sin(theta);
            return (
              <line x1={px} y1={py} x2={px + vx} y2={py + vy}
                    stroke="#f97316" strokeWidth="2.5" markerEnd="url(#pendVArrow)" />
            );
          })()}

          {/* Bob — colour shifts with energy, glow pulses with speed */}
          <circle
            cx={px} cy={py}
            r={8 + M * 2}
            fill={bobColor}
            stroke="#fff" strokeWidth="2"
            filter="url(#pendGlow)"
            style={{ filter: `drop-shadow(0 0 ${glowSize}px ${bobColor})` }}
          />

          {/* Angle label near pivot */}
          <text x="150" y="48" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold" opacity="0.85">
            {(Math.abs(theta) * 180 / Math.PI).toFixed(0)}°
          </text>
        </svg>

        {/* HUD overlay (top-left): live PE / KE / TE */}
        <div className="absolute top-3 left-3 bg-slate-900/80 p-2 rounded-lg border border-slate-700/50 backdrop-blur-sm pointer-events-none">
          <div className="text-[9px] font-black uppercase text-blue-400">PE: {pe.toFixed(2)} J</div>
          <div className="text-[9px] font-black uppercase text-orange-400">KE: {ke.toFixed(2)} J</div>
          <div className="text-[9px] font-black uppercase text-gray-300">TE: {te.toFixed(2)} J</div>
        </div>

        {/* Dynamic feedback (bottom centre) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-indigo-900/80 p-2.5 rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-xl text-center pointer-events-none">
          <p className="text-xs font-bold text-indigo-100 leading-snug">{feedback}</p>
        </div>
      </div>

      {/* Energy bars (PE blue, KE orange) */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs font-black mb-1">
            <span className="text-blue-600 dark:text-blue-400">{isAs ? "বিভৱ শক্তি (PE)" : "Potential (PE)"}</span>
            <span className="text-blue-600 dark:text-blue-400">{peP.toFixed(0)}% · {pe.toFixed(2)} J</span>
          </div>
          <div className="h-3 bg-white/60 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full transition-all" style={{ width: `${peP}%`, background: "linear-gradient(to right,#60a5fa,#3b82f6)" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-black mb-1">
            <span className="text-orange-600 dark:text-orange-400">{isAs ? "গতিশক্তি (KE)" : "Kinetic (KE)"}</span>
            <span className="text-orange-600 dark:text-orange-400">{keP.toFixed(0)}% · {ke.toFixed(2)} J</span>
          </div>
          <div className="h-3 bg-white/60 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full transition-all" style={{ width: `${keP}%`, background: "linear-gradient(to right,#fb923c,#f97316)" }} />
          </div>
        </div>
      </div>

      {/* Live energy-vs-time graph */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-black text-gray-500 dark:text-gray-400">
            {isAs ? "শক্তি বনাম সময়" : "Energy vs Time"}
          </div>
          <div className="flex gap-3 text-[10px] font-bold">
            <span className="text-blue-500">■ PE</span>
            <span className="text-orange-500">■ KE</span>
            <span className="text-gray-400">-- {isAs ? "মুঠ" : "Total"}</span>
          </div>
        </div>
        <SimGraph
          series={series}
          xMax={Math.max(5, tRef.current)}
          yMax={maxTE}
          xLabel="t (s)"
          yLabel={isAs ? "শক্তি (J)" : "Energy (J)"}
          height={130}
        />
      </div>

      {/* Step-by-step learning */}
      <StepMode steps={isAs ? [
        { title: "১. মুক্ত কৰাৰ বিন্দু",  body: "সৰ্বোচ্চ বিন্দুত গোলকটো বিশ্ৰামত থাকে। সকলো শক্তি = বিভৱ (PE = সৰ্বাধিক, KE = 0)।" },
        { title: "২. মধ্য দোলন",         body: "তললৈ পৰাৰ সময়ত PE গতিশক্তি (KE)-লৈ ৰূপান্তৰিত হয়।" },
        { title: "৩. সৰ্বনিম্ন বিন্দু",   body: "তলত বেগ সৰ্বাধিক। PE সৰ্বনিম্ন, KE সৰ্বাধিক।" },
        { title: "৪. আনফালে",           body: "গোলকটো পুনৰ উঠে, KE আকৌ PE-লৈ ৰূপান্তৰিত হয়। মুঠ শক্তি স্থিৰ থাকে।" },
      ] : [
        { title: "1. Release Point", body: "At the highest point the bob is at rest. All energy = Potential (PE = max, KE = 0)." },
        { title: "2. Mid-Swing",     body: "As the bob falls, PE converts into Kinetic Energy (KE)." },
        { title: "3. Lowest Point",  body: "At the bottom, speed is maximum. PE is minimum, KE is maximum." },
        { title: "4. Other Side",    body: "The bob rises again; KE converts back to PE. Total energy stays constant." },
      ]} />
    </SimContainer>
  );
}
