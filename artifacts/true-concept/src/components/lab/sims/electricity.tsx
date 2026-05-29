import { useState, useEffect, useRef } from "react";
import { SimSlider, SimNumber, SimContainer, SimGraph, SimButton, useRafLoop, StepMode } from "../sim-ui";
import { Plus, Minus, Power, RotateCcw, Play, Pause } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* 16. Ohm's Law — Interactive circuit with live V-I / I-R graph */
type OhmsMode = "VI" | "IR" | "FREE";

export function OhmsLawSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [mode, setMode] = useState<OhmsMode>("VI");
  const [isOn, setIsOn] = useState(false);
  const [V, setV] = useState(1);
  const [R, setR] = useState(1);
  const I = isOn ? V / R : 0;
  const P = V * I;
  const [pts, setPts] = useState<{ v: number; r: number; i: number }[]>([]);
  const [offset, setOffset] = useState(0);

  useRafLoop(isOn, (dt) => setOffset((o) => o - I * 25 * dt));

  useEffect(() => {
    if (isOn) {
      setPts((p) => {
        if (p.length > 0) {
          const last = p[p.length - 1];
          if (last.v === V && last.r === R) return p;
        }
        const next = [...p, { v: V, r: R, i: I }];
        return next.length > 300 ? next.slice(-300) : next;
      });
    }
  }, [V, R, I, isOn]);

  const reset = () => {
    setPts([]); setIsOn(false); setV(1); setR(1);
  };

  // Graph data — mode determines x axis
  let xLabel = isAs ? "ভোল্টেজ (V)" : "Voltage (V)";
  let xMax = 24;
  let plotPts = pts.map((p) => ({ x: p.v, y: p.i }));
  if (mode === "IR") {
    xLabel = isAs ? "ৰোধ (Ω)" : "Resistance (Ω)";
    plotPts = pts.map((p) => ({ x: p.r, y: p.i }));
  }
  plotPts.sort((a, b) => a.x - b.x);
  const series = [{ points: plotPts, color: mode === "IR" ? "#f59e0b" : "#38bdf8" }];

  // Resistor heat colour
  const heatLvl = Math.min(1, I / 10);
  const cR = Math.floor(100 + heatLvl * 139);
  const cG = Math.floor(116 - heatLvl * 48);
  const cB = Math.floor(139 - heatLvl * 71);
  const heatColor = isOn ? `rgb(${cR}, ${cG}, ${cB})` : "#64748b";
  const heatGlow  = isOn && heatLvl > 0.1 ? `drop-shadow(0 0 ${heatLvl * 10}px rgb(239, 68, 68))` : "none";

  // Dynamic feedback
  let feedback = isAs
    ? "বিদ্যুৎপ্ৰৱাহ পৰ্যবেক্ষণ কৰিবলৈ বৰ্তনী ON কৰক।"
    : "Turn ON the circuit to observe the flow of current.";
  if (isOn) {
    if (mode === "VI") {
      feedback = isAs
        ? `ৰোধ ${R}Ω স্থিৰ ৰাখি, ভোল্টেজ বঢ়ালে বৰ্তনীত অধিক বিদ্যুৎপ্ৰৱাহ হয়। ৰৈখিক V-I গ্ৰাফ পোৱা যায়!`
        : `With Resistance constant at ${R}Ω, increasing Voltage forces more Current through the circuit. This generates a linear V-I graph!`;
    } else if (mode === "IR") {
      feedback = isAs
        ? `ভোল্টেজ ${V}V স্থিৰ ৰাখি, ৰোধ বঢ়ালে বিদ্যুৎপ্ৰৱাহ বাধাপ্ৰাপ্ত হয়, বক্ৰভাৱে কমে। এক বিপৰীত বক্ৰ পোৱা যায়!`
        : `With Voltage constant at ${V}V, increasing Resistance restricts the flow, exponentially reducing Current. This creates an inverse curve!`;
    } else {
      feedback = isAs
        ? `মুক্ত অন্বেষণ: বিদ্যুৎপ্ৰৱাহ (${I.toFixed(2)}A) ভোল্টেজৰ সমানুপাতিক আৰু ৰোধৰ বিপৰীতানুপাতিক।`
        : `Free Exploration: Current (${I.toFixed(2)}A) is directly proportional to Voltage and inversely proportional to Resistance.`;
    }
  }

  const wirePath = "M 50 120 L 50 50 L 350 50 L 350 200 L 50 200 L 50 180";

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "অহ্মৰ সূত্ৰ: V = I × R। ভোল্টেজে বিদ্যুৎপ্ৰৱাহ ঠেলি দিয়ে, ৰোধে ই কমায়।"
        : "Ohm's Law: V = I × R. Voltage pushes current, while Resistance slows it down."}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col justify-center px-1">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "পৰীক্ষা ধৰণ" : "Experiment Mode"}
          </label>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as OhmsMode); reset(); }}
            className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full"
          >
            <option value="VI">{isAs ? "V-I যাচাই" : "V-I Verification"}</option>
            <option value="IR">{isAs ? "I-R সম্পৰ্ক"  : "I-R Relationship"}</option>
            <option value="FREE">{isAs ? "মুক্ত লেব ধৰণ" : "Free Lab Mode"}</option>
          </select>
        </div>
        <SimSlider label={isAs ? "ভোল্টেজ (V)" : "Voltage (V)"} value={V} onChange={setV}
                   min={1} max={24} step={1} unit=" V" color="#38bdf8" disabled={mode === "IR"} />
        <SimSlider label={isAs ? "ৰোধ (R)" : "Resistance (R)"} value={R} onChange={setR}
                   min={1} max={24} step={1} unit=" Ω" color="#f59e0b" disabled={mode === "VI"} />
        <div className="flex items-center justify-center pt-2 sm:pt-4">
          <SimButton onClick={() => setIsOn(!isOn)} color={isOn ? "#ef4444" : "#10b981"}
                     icon={<Power className="w-4 h-4" />}>
            {isOn ? (isAs ? "OFF কৰক" : "Turn OFF") : (isAs ? "ON কৰক" : "Turn ON")}
          </SimButton>
        </div>
      </div>

      {/* Circuit SVG */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#020617] to-[#0f172a] touch-none mb-4 w-full h-[280px]">
        <svg viewBox="-10 -10 430 260" preserveAspectRatio="xMidYMid meet" className="w-full h-full absolute inset-0">
          {/* Wires */}
          <path d={wirePath} fill="none" stroke="#334155" strokeWidth="4" />
          {isOn && I > 0 && (
            <path d={wirePath} fill="none" stroke="#38bdf8" strokeWidth="2"
                  strokeDasharray="6 12" strokeDashoffset={offset} />
          )}
          {/* Voltmeter branch wire */}
          <path d="M 350 110 L 290 110 L 290 200 L 350 200" fill="none" stroke="#334155" strokeWidth="4" />
          {isOn && (
            <path d="M 350 110 L 290 110 L 290 200 L 350 200" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />
          )}

          {/* Switch */}
          <rect x={230} y={30} width={40} height={40} fill="#0f172a" />
          <circle cx={235} cy={50} r={4} fill="#94a3b8" />
          <circle cx={265} cy={50} r={4} fill="#94a3b8" />
          <line x1={235} y1={50} x2={265} y2={isOn ? 50 : 35}
                stroke={isOn ? "#10b981" : "#cbd5e1"} strokeWidth="4" strokeLinecap="round"
                className="transition-all duration-200" />

          {/* Battery */}
          <rect x={20} y={120} width={60} height={60} fill="#0f172a" />
          <rect x={25} y={130} width={50} height={40} fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4" />
          <rect x={40} y={125} width={20} height={5}  fill="#64748b" />
          <text x={50} y={155} fill="#fff"    fontSize="14" textAnchor="middle" fontWeight="bold">{V}V</text>
          <text x={50} y={120} fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">+</text>
          <text x={50} y={185} fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">−</text>

          {/* Ammeter */}
          <rect   x={130} y={30}  width={40} height={40} fill="#0f172a" />
          <circle cx={150} cy={50} r={22} fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text   x={150} y={55} fill="#fff" fontSize="16" textAnchor="middle" fontWeight="bold">A</text>
          <rect   x={125} y={-5} width={50} height={20} fill="#020617" rx="4" />
          <text   x={150} y={8}  fill="#38bdf8" fontSize="10" textAnchor="middle">{I.toFixed(2)} A</text>

          {/* Resistor — heat-colour shifts with current */}
          <rect x={330} y={110} width={40} height={90} fill="#0f172a" />
          <path d="M 350 110 L 340 120 L 360 135 L 340 150 L 360 165 L 340 180 L 350 190 L 350 200"
                fill="none" stroke={heatColor} strokeWidth="4" strokeLinejoin="round"
                style={{ filter: heatGlow, transition: "stroke 0.3s, filter 0.3s" }} />
          <text x={380} y={155} fill="#f59e0b" fontSize="14" textAnchor="start" fontWeight="bold">{R} Ω</text>

          {/* Voltmeter */}
          <rect   x={270} y={135} width={40} height={40} fill="#0f172a" />
          <circle cx={290} cy={155} r={22} fill="#1e293b" stroke="#10b981" strokeWidth="2" />
          <text   x={290} y={160} fill="#fff" fontSize="16" textAnchor="middle" fontWeight="bold">V</text>
          <rect   x={265} y={100} width={50} height={20} fill="#020617" rx="4" />
          <text   x={290} y={113} fill="#10b981" fontSize="10" textAnchor="middle">{isOn ? V.toFixed(1) : "0.0"} V</text>
        </svg>
      </div>

      {/* Dynamic feedback */}
      <div className="w-full bg-slate-900 border border-emerald-500/30 p-3 mb-4 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-emerald-100 leading-relaxed">{feedback}</p>
      </div>

      {/* Live numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <SimNumber label={isAs ? "ভোল্টেজ (V)"     : "Voltage (V)"}    value={isOn ? V : 0} unit=" V" color="#38bdf8" precision={1} />
        <SimNumber label={isAs ? "বিদ্যুৎপ্ৰৱাহ (I)" : "Current (I)"}    value={I}            unit=" A" color="#dc2626" precision={2} />
        <SimNumber label={isAs ? "ৰোধ (R)"          : "Resistance (R)"} value={R}            unit=" Ω" color="#f59e0b" precision={0} />
        <SimNumber label={isAs ? "ক্ষমতা (P)"       : "Power (P)"}      value={P}            unit=" W" color="#8b5cf6" precision={1} />
      </div>

      {/* Live graph */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-black text-gray-500 dark:text-gray-400">
            {isAs ? "তাৎক্ষণিক গ্ৰাফ সৃষ্টি" : "Live Graph Generation"}
          </div>
          <div className="flex gap-3 text-[10px] font-bold">
            <span className={mode === "IR" ? "text-amber-500" : "text-sky-500"}>
              ■ {mode === "IR"
                  ? (isAs ? "বিদ্যুৎপ্ৰৱাহ বনাম ৰোধ" : "Current vs Resistance")
                  : (isAs ? "বিদ্যুৎপ্ৰৱাহ বনাম ভোল্টেজ" : "Current vs Voltage")}
            </span>
          </div>
        </div>
        <SimGraph series={series} xMax={xMax} yMax={12} xLabel={xLabel} yLabel={isAs ? "বিদ্যুৎপ্ৰৱাহ (A)" : "Current (A)"} height={120} />
      </div>
    </SimContainer>
  );
}

/* 17. Series Circuit — 3-column interactive lab */
type SeriesMode = "basic" | "voltage" | "current";
type SeriesGraph = "IvsR" | "RvsN";

export function SeriesCircuitSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [R, setR] = useState<number[]>([10, 20]);
  const [V, setV] = useState(12);
  const [isOn, setIsOn] = useState(false);
  const [mode, setMode] = useState<SeriesMode>("basic");
  const [graphMode, setGraphMode] = useState<SeriesGraph>("IvsR");
  const [dashOffset, setDashOffset] = useState(0);

  const totalR = R.reduce((s, r) => s + r, 0);
  const I = isOn ? V / totalR : 0;

  useRafLoop(isOn, (dt) => setDashOffset((o) => o - dt * I * 80));

  const reset = () => { setR([10, 20]); setIsOn(false); };
  const addResistor = () => { if (R.length < 5) setR([...R, 10]); };
  const removeResistor = () => { if (R.length > 1) setR(R.slice(0, -1)); };

  // --- live graph helpers ---
  const renderCurve = () => {
    if (graphMode === "IvsR") {
      const pts: string[] = [];
      for (let r = 1; r <= 150; r += 2) {
        const i = V / r;
        const px = 20 + (r / 150) * 160;
        const py = 90 - Math.min(1, i / 12) * 80;
        pts.push(`${px},${py}`);
      }
      return <polyline points={pts.join(" ")} fill="none" stroke="#facc15" strokeWidth="2"
                       style={{ filter: "drop-shadow(0 0 4px #facc15)" }} />;
    }
    let sum = 0;
    const pts: string[] = ["20,90"];
    for (let i = 0; i < R.length; i++) {
      sum += R[i];
      const px = 20 + ((i + 1) / 5) * 160;
      const py = 90 - (sum / 150) * 80;
      pts.push(`${px},${py}`);
    }
    return <polyline points={pts.join(" ")} fill="none" stroke="#10b981" strokeWidth="2"
                     style={{ filter: "drop-shadow(0 0 4px #10b981)" }} />;
  };
  const currentPoint = () => {
    if (graphMode === "IvsR") {
      return { cx: 20 + Math.min(1, totalR / 150) * 160, cy: 90 - Math.min(1, I / 12) * 80 };
    }
    return { cx: 20 + (R.length / 5) * 160, cy: 90 - (totalR / 150) * 80 };
  };

  // Dynamic feedback
  let feedback = isAs
    ? "বৰ্তনী OFF আছে। বিদ্যুৎপ্ৰৱাহ চাবলৈ চুইচ ON কৰক।"
    : "Circuit is OFF. Turn the switch ON to observe current flow.";
  if (isOn) {
    if (mode === "voltage") {
      feedback = isAs
        ? "ভোল্টেজ পাত লক্ষ্য কৰক: বেটাৰীৰ মুঠ ১২V প্ৰতিটো ৰোধকৰ মাজত তাৰ ৰোধৰ অনুপাতে ভাগ হয়।"
        : "Notice the Voltage Drop: The total 12V from the battery is divided across each resistor based on its resistance.";
    } else if (mode === "current") {
      feedback = isAs
        ? "বিদ্যুৎপ্ৰৱাহ লক্ষ্য কৰক: শ্ৰেণী বৰ্তনীত প্ৰতিটো ৰোধকৰ মাজেৰে একে পৰিমাণৰ বিদ্যুৎপ্ৰৱাহ যায়।"
        : "Notice the Current: Exactly the same amount of current flows through EVERY resistor in a series circuit.";
    } else {
      feedback = isAs
        ? `বিদ্যুৎপ্ৰৱাহ চলিছে! মুঠ ৰোধ ${totalR}Ω, বিদ্যুৎপ্ৰৱাহ ${I.toFixed(2)}A।`
        : `Current is flowing! Total resistance is ${totalR}Ω, yielding a current of ${I.toFixed(2)}A.`;
    }
  }

  const wirePathAnim = "M 225 150 L 350 150 L 350 50 L 50 50 L 50 150 L 175 150";

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "শ্ৰেণী বৰ্তনীত বিদ্যুৎপ্ৰৱাহ সকলোতে একে থাকে, কিন্তু ভোল্টেজ উপাদানসমূহৰ মাজত ভাগ হয়!"
        : "In a series circuit, Current is the same everywhere, but Voltage divides across components!"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* LEFT — controls */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-1">
            {(["basic", "voltage", "current"] as const).map((m) => {
              const cls = m === "basic"   ? "bg-indigo-600 border-indigo-400"
                       :  m === "voltage" ? "bg-rose-600 border-rose-400"
                       :                    "bg-emerald-600 border-emerald-400";
              return (
                <button key={m} onClick={() => setMode(m)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          mode === m ? `${cls} text-white` : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"
                        }`}>
                  {m === "basic"   ? (isAs ? "মৌলিক" : "Basic")
                   : m === "voltage" ? (isAs ? "ভোল্টেজ" : "Voltage")
                                     : (isAs ? "বিদ্যুৎপ্ৰৱাহ" : "Current")}
                </button>
              );
            })}
          </div>

          <div className="bg-[#0f172a]/50 p-3 rounded-xl border border-white/10 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-black uppercase text-gray-500">
                {isAs ? `ৰোধক (${R.length}/5)` : `Resistors (${R.length}/5)`}
              </span>
              <div className="flex gap-1">
                <button onClick={removeResistor} disabled={R.length <= 1}
                        className="w-6 h-6 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white disabled:opacity-30 rounded flex items-center justify-center font-black">
                  <Minus className="w-3 h-3" />
                </button>
                <button onClick={addResistor} disabled={R.length >= 5}
                        className="w-6 h-6 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white disabled:opacity-30 rounded flex items-center justify-center font-black">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            {R.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-500 w-4">R{idx + 1}</span>
                <input type="range" min={1} max={50} value={r}
                       onChange={(e) => setR(R.map((x, j) => j === idx ? Number(e.target.value) : x))}
                       className="flex-1 accent-amber-500 h-1" />
                <span className="text-[10px] font-black text-gray-300 w-6 text-right">{r}Ω</span>
              </div>
            ))}
          </div>

          <SimSlider label={isAs ? "বেটাৰীৰ ভোল্টেজ" : "Battery Voltage"} value={V} onChange={setV}
                     min={1} max={24} step={1} unit=" V" color="#38bdf8" />

          <div className="flex gap-2 mt-2">
            <SimButton onClick={() => setIsOn(!isOn)} color={isOn ? "#ef4444" : "#10b981"}
                       icon={<Power className="w-4 h-4" />}>
              {isOn
                ? (isAs ? "বৰ্তনী OFF কৰক" : "Turn OFF Circuit")
                : (isAs ? "বৰ্তনী ON কৰক"  : "Turn ON Circuit")}
            </SimButton>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <SimNumber label={isAs ? "মুঠ ৰোধ" : "Total Resistance"} value={totalR} unit=" Ω" color="#f59e0b" precision={0} />
            <SimNumber label={isAs ? "বিদ্যুৎপ্ৰৱাহ" : "Current"}    value={I}      unit=" A" color="#dc2626" precision={2} />
          </div>
        </div>

        {/* MIDDLE — circuit diagram */}
        <div className="lg:col-span-1 bg-[#020617] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col" style={{ minHeight: "350px" }}>
          <svg viewBox="0 0 400 200" className="w-full h-full flex-1">
            <defs>
              <filter id="ser-glow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="ser-wire-glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <pattern id="ser-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#fff" opacity="0.05" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ser-grid)" />

            {/* Wire paths */}
            <path d="M 225 150 L 350 150 L 350 115"            fill="none" stroke="#334155" strokeWidth="4" />
            <path d="M 350 85 L 350 50 L 50 50 L 50 150 L 175 150" fill="none" stroke="#334155" strokeWidth="4" />
            {isOn && (
              <path d={wirePathAnim} fill="none" stroke="#38bdf8" strokeWidth="3"
                    strokeDasharray="6 12" strokeDashoffset={dashOffset}
                    filter="url(#ser-wire-glow)" opacity={Math.min(1, I / 2 + 0.3)} />
            )}

            {/* Switch */}
            <g transform="translate(350, 100)">
              <circle cx="0" cy="-15" r="4" fill="#64748b" />
              <circle cx="0" cy="15"  r="4" fill="#64748b" />
              <line x1="0" y1="-15" x2={isOn ? "0" : "15"} y2={isOn ? "15" : "0"}
                    stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"
                    style={{ transition: "all 0.2s ease" }} />
            </g>

            {/* Resistors */}
            {R.map((r, idx) => {
              const slot = 300 / R.length;
              const cx = 50 + slot / 2 + idx * slot;
              const cy = 50;
              const vDrop = I * r;
              const heat = isOn ? Math.min(0.8, (I * I * r) / 50) : 0;
              return (
                <g key={idx}>
                  <rect x={cx - 15} y={cy - 8} width="30" height="16" fill="#b45309" rx="3" />
                  <rect x={cx - 10} y={cy - 8} width="3"  height="16" fill="#000"    opacity="0.6" />
                  <rect x={cx - 3}  y={cy - 8} width="3"  height="16" fill="#ef4444" opacity="0.6" />
                  <rect x={cx + 4}  y={cy - 8} width="3"  height="16" fill="#eab308" opacity="0.6" />
                  {heat > 0 && (
                    <rect x={cx - 15} y={cy - 8} width="30" height="16" fill="#ef4444"
                          opacity={heat} filter="url(#ser-glow)" rx="3" />
                  )}
                  <text x={cx} y={cy - 14} fill="#cbd5e1" fontSize="10" textAnchor="middle" fontWeight="bold">
                    R{idx + 1}: {r}Ω
                  </text>

                  {/* Per-resistor voltage probe in voltage mode */}
                  {mode === "voltage" && isOn && (
                    <g transform={`translate(${cx}, ${cy + 25})`}>
                      <rect x="-18" y="-8" width="36" height="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" rx="2" />
                      <text x="0" y="3" fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="bold">{vDrop.toFixed(1)}V</text>
                      <path d="M -15 -8 L -20 -25" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                      <path d="M 15 -8 L 20 -25"   stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                    </g>
                  )}
                  {/* Per-resistor current probe in current mode */}
                  {mode === "current" && isOn && (
                    <g transform={`translate(${cx}, ${cy + 25})`}>
                      <rect x="-16" y="-8" width="32" height="16" fill="#0f172a" stroke="#ef4444" strokeWidth="1" rx="2" />
                      <text x="0" y="3" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="bold">{I.toFixed(2)}A</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Battery */}
            <g transform="translate(200, 150)">
              <rect x="-25" y="-15" width="50" height="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <rect x="-30" y="-8"  width="5"  height="16" fill="#38bdf8" />
              <rect x="25"  y="-8"  width="5"  height="16" fill="#38bdf8" />
              <text x="0"  y="4" fill="white"   fontSize="12" textAnchor="middle" fontWeight="bold">{V}V</text>
              <text x="-15" y="4" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">−</text>
              <text x="15"  y="4" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">+</text>
            </g>
          </svg>
          <div className="w-full bg-slate-900 border-t border-sky-500/30 p-2 text-center text-xs font-bold text-sky-200 min-h-[40px] flex items-center justify-center">
            {feedback}
          </div>
        </div>

        {/* RIGHT — live graph */}
        <div className="lg:col-span-1 bg-[#0f172a]/50 p-4 rounded-xl border border-white/10 flex flex-col shadow-inner min-h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-black uppercase text-gray-500 tracking-wider">
              {isAs ? "তাৎক্ষণিক গ্ৰাফ" : "Live Graph"}
            </label>
            <select value={graphMode} onChange={(e) => setGraphMode(e.target.value as SeriesGraph)}
                    className="bg-transparent text-xs font-bold text-white border-b border-white/20 pb-1 cursor-pointer outline-none focus:border-amber-500 transition-colors">
              <option value="IvsR" className="bg-slate-800">{isAs ? "বিদ্যুৎপ্ৰৱাহ বনাম ৰোধ" : "Current vs Resistance"}</option>
              <option value="RvsN" className="bg-slate-800">{isAs ? "ৰোধ বনাম উপাদান"        : "Resistance vs Components"}</option>
            </select>
          </div>

          <div className="flex-1 relative border-l border-b border-slate-700 mx-2 mt-4 mb-6">
            <svg viewBox="0 0 200 100" className="w-full h-full absolute inset-0 overflow-visible">
              <line x1="20" y1="10" x2="180" y2="10" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="20" y1="50" x2="180" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              <text x="5" y="10" fill="#64748b" fontSize="8" textAnchor="middle" transform="rotate(-90 5,10)">
                {graphMode === "IvsR"
                  ? (isAs ? "বিদ্যুৎপ্ৰৱাহ (A)" : "Current (A)")
                  : (isAs ? "ৰোধ (Ω)"          : "Res (Ω)")}
              </text>
              <text x="180" y="110" fill="#64748b" fontSize="8" textAnchor="end">
                {graphMode === "IvsR"
                  ? (isAs ? "ৰোধ (Ω)"          : "Resistance (Ω)")
                  : (isAs ? "ৰোধক (N)"         : "Resistors (N)")}
              </text>
              {renderCurve()}
              <g transform={`translate(${currentPoint().cx}, ${currentPoint().cy})`}>
                <circle r="4" fill="white" style={{ filter: "drop-shadow(0 0 4px white)" }} />
                <circle r="6" fill="none" stroke={graphMode === "IvsR" ? "#facc15" : "#10b981"} strokeWidth="1.5">
                  <animate attributeName="r"       values="4; 10; 4" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1; 0; 1"  dur="1s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>

          <div className="mt-auto bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="text-xs font-medium text-gray-400 leading-relaxed text-center">
              {graphMode === "IvsR"
                ? (isAs
                    ? <>লক্ষ্য কৰক <strong className="text-amber-400">বিপৰীত বক্ৰ</strong>। মুঠ শ্ৰেণী ৰোধ বৃদ্ধি পালে, বিদ্যুৎপ্ৰৱাহ বক্ৰভাৱে হ্ৰাস পায়।</>
                    : <>Observe the <strong className="text-amber-400">Inverse Curve</strong>. As total series resistance increases, current exponentially decreases.</>)
                : (isAs
                    ? <>লক্ষ্য কৰক <strong className="text-emerald-400">ৰৈখিক বৃদ্ধি</strong>। শ্ৰেণীত ৰোধক যোগ কৰিলে মুঠ ৰোধ পোনপটীয়াকৈ বৃদ্ধি পায়।</>
                    : <>Observe the <strong className="text-emerald-400">Linear Growth</strong>. Adding resistors in series increases the total resistance directly.</>)}
            </p>
          </div>
        </div>
      </div>
    </SimContainer>
  );
}

/* 18. Parallel Circuit — Branch-by-branch interactive diagram */
export function ParallelCircuitSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [isOn, setIsOn] = useState(false);
  const [V, setV] = useState(12);
  const [R, setR] = useState<number[]>([10, 20, 30]);
  const [dashOffset, setDashOffset] = useState(0);

  const invSum = R.reduce((s, r) => s + 1 / r, 0);
  const totalR = invSum > 0 ? 1 / invSum : 0;
  const Itot = isOn ? V / totalR : 0;

  useRafLoop(isOn, (dt) => setDashOffset((o) => o - dt * 25));

  // Diagram geometry — depends on branch count
  const startY  = 80;
  const spacing = 70;
  const N       = R.length;
  const lastY   = startY + (N - 1) * spacing;
  const bottomY = Math.max(260, lastY + 50);
  const viewH   = bottomY + 40;
  const leftBus  = `M 50 160 L 50 40 L 150 40 L 150 ${lastY}`;
  const rightBus = `M 350 ${startY} L 350 ${bottomY} L 50 ${bottomY} L 50 220`;

  const heatColor = (curr: number) => {
    const lvl = Math.min(1, curr / 4);
    const r = Math.floor(100 + lvl * 139);
    const g = Math.floor(116 - lvl * 48);
    const b = Math.floor(139 - lvl * 71);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const reset = () => { setIsOn(false); setV(12); setR([10, 20, 30]); };

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "সমান্তৰাল বৰ্তনীত, সকলো শাখাত ভোল্টেজ একে থাকে। বিদ্যুৎপ্ৰৱাহ অনুপাতে ভাগ হয়।"
        : "In parallel, voltage is identical across all branches. Current splits proportionally."}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-3">
          <SimSlider label={isAs ? "উৎস ভোল্টেজ (V)" : "Source Voltage (V)"} value={V} onChange={setV}
                     min={1} max={24} step={1} unit=" V" color="#38bdf8" />
          <div className="flex items-center gap-2">
            <SimButton onClick={() => setIsOn(!isOn)} color={isOn ? "#ef4444" : "#10b981"}
                       icon={<Power className="w-4 h-4" />}>
              {isOn
                ? (isAs ? "বৰ্তনী OFF কৰক" : "Turn OFF Circuit")
                : (isAs ? "বৰ্তনী ON কৰক"  : "Turn ON Circuit")}
            </SimButton>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <SimNumber label={isAs ? "মুঠ ৰোধ"           : "Total Resistance"} value={totalR} unit=" Ω" color="#f59e0b" precision={2} />
            <SimNumber label={isAs ? "মুঠ বিদ্যুৎপ্ৰৱাহ" : "Total Current"}    value={Itot}   unit=" A" color="#dc2626" precision={2} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0f172a]/50 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
              {isAs ? `সমান্তৰাল শাখা (${N})` : `Parallel Branches (${N})`}
            </label>
            <div className="flex gap-2">
              <button onClick={() => N < 5 && setR([...R, 10])} disabled={N >= 5}
                      className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold disabled:opacity-30 transition-all">
                {isAs ? "+ শাখা যোগ কৰক" : "+ Add Branch"}
              </button>
              <button onClick={() => N > 1 && setR(R.slice(0, -1))} disabled={N <= 1}
                      className="px-2 py-1 bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold disabled:opacity-30 transition-all">
                {isAs ? "- শাখা আঁতৰাওক" : "- Remove Branch"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {R.map((r, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                <span className="text-xs font-black text-sky-400 w-6">R{idx + 1}</span>
                <input type="range" min={1} max={30} step={1} value={r}
                       onChange={(e) => setR(R.map((x, j) => j === idx ? Number(e.target.value) : x))}
                       className="flex-1 h-1.5 rounded-full appearance-none bg-slate-700 accent-fuchsia-500" />
                <span className="text-xs font-black text-fuchsia-400 w-10 text-right">{r} Ω</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Circuit diagram */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#020617] to-[#0f172a] touch-none mb-4 w-full"
           style={{ height: Math.max(350, viewH) }}>
        <svg viewBox={`-10 -10 420 ${viewH}`} className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
          <path d={leftBus}  fill="none" stroke="#334155" strokeWidth="4" />
          <path d={rightBus} fill="none" stroke="#334155" strokeWidth="4" />
          {isOn && Itot > 0 && (
            <>
              <path d={leftBus}  fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 12" strokeDashoffset={dashOffset * Math.min(5, Itot)} />
              <path d={rightBus} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 12" strokeDashoffset={dashOffset * Math.min(5, Itot)} />
            </>
          )}

          {/* Switch */}
          <rect x={80} y={30} width={40} height={20} fill="#0f172a" />
          <circle cx={85}  cy={40} r={4} fill="#94a3b8" />
          <circle cx={115} cy={40} r={4} fill="#94a3b8" />
          <line x1={85} y1={40} x2={115} y2={isOn ? 40 : 25}
                stroke={isOn ? "#10b981" : "#cbd5e1"} strokeWidth="4" strokeLinecap="round"
                className="transition-all duration-200" />

          {/* Battery */}
          <rect x={20} y={160} width={60} height={60} fill="#0f172a" />
          <rect x={25} y={170} width={50} height={40} fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4" />
          <rect x={40} y={165} width={20} height={5}  fill="#64748b" />
          <text x={50} y={195} fill="#fff"    fontSize="14" textAnchor="middle" fontWeight="bold">{V}V</text>
          <text x={50} y={160} fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">+</text>
          <text x={50} y={225} fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">−</text>

          {/* Main ammeter (bottom centre) */}
          <rect   x={180} y={bottomY - 20} width={40} height={40} fill="#0f172a" />
          <circle cx={200} cy={bottomY} r={18} fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text   x={200} y={bottomY + 5} fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold">A</text>
          <rect   x={175} y={bottomY + 20} width={50} height={16} fill="#020617" rx="4" />
          <text   x={200} y={bottomY + 31} fill="#38bdf8" fontSize="9" textAnchor="middle">{Itot.toFixed(2)} A</text>

          {/* Each parallel branch */}
          {R.map((r, idx) => {
            const y = startY + idx * spacing;
            const branchI = isOn ? V / r : 0;
            const col     = heatColor(branchI);
            const speed   = Math.min(10, branchI);
            const glow    = isOn && branchI > 0.5
              ? `drop-shadow(0 0 ${Math.min(10, branchI * 2)}px rgb(239, 68, 68))`
              : "none";
            return (
              <g key={idx}>
                {/* Branch wire */}
                <path d={`M 150 ${y} L 350 ${y}`} fill="none" stroke="#334155" strokeWidth="4" />
                {isOn && branchI > 0 && (
                  <path d={`M 150 ${y} L 350 ${y}`} fill="none" stroke="#a855f7" strokeWidth="2"
                        strokeDasharray="6 12" strokeDashoffset={dashOffset * speed} />
                )}
                {/* Resistor */}
                <rect x={260} y={y - 15} width={50} height={30} fill="#0f172a" />
                <path d={`M 260 ${y} L 265 ${y - 10} L 275 ${y + 10} L 285 ${y - 10} L 295 ${y + 10} L 305 ${y - 10} L 310 ${y}`}
                      fill="none" stroke={col} strokeWidth="3" strokeLinejoin="round"
                      style={{ filter: glow, transition: "stroke 0.3s, filter 0.3s" }} />
                <text x={315} y={y + 4} fill="#f59e0b" fontSize="12" fontWeight="bold">{r} Ω</text>
                {/* Branch ammeter */}
                <rect   x={175} y={y - 15} width={30} height={30} fill="#0f172a" />
                <circle cx={190} cy={y} r={14} fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
                <text   x={190} y={y + 4}  fill="#fff"    fontSize="10" textAnchor="middle" fontWeight="bold">A</text>
                <text   x={190} y={y + 24} fill="#a855f7" fontSize="9"  textAnchor="middle">{branchI.toFixed(2)} A</text>
                {/* Voltmeter loop wire */}
                <path d={`M 260 ${y - 2} L 260 ${y - 25} L 310 ${y - 25} L 310 ${y - 2}`}
                      fill="none" stroke="#334155" strokeWidth="2" />
                {isOn && (
                  <path d={`M 260 ${y - 2} L 260 ${y - 25} L 310 ${y - 25} L 310 ${y - 2}`}
                        fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
                )}
                {/* Voltmeter */}
                <rect   x={275} y={y - 35} width={20} height={20} fill="#0f172a" />
                <circle cx={285} cy={y - 25} r={10} fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                <text   x={285} y={y - 22} fill="#10b981" fontSize="8" textAnchor="middle" fontWeight="bold">V</text>
                <text   x={285} y={y - 38} fill="#10b981" fontSize="8" textAnchor="middle">{isOn ? V.toFixed(1) : "0.0"}V</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Feedback */}
      <div className="w-full bg-slate-900 border border-fuchsia-500/30 p-3 mb-4 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-fuchsia-100 leading-relaxed">
          {isOn
            ? (isAs
                ? `সকলো শাখাত ভোল্টেজ ঠিক একে (${V}V)। মুঠ বিদ্যুৎপ্ৰৱাহ (${Itot.toFixed(2)}A) প্ৰতিটো শাখাৰ ৰোধ অনুসৰি ভাগ হৈ যায়।`
                : `Voltage is perfectly equal across all branches (${V}V). Total Current (${Itot.toFixed(2)}A) splits dynamically based on each branch's resistance.`)
            : (isAs
                ? "সমান্তৰাল বিদ্যুৎপ্ৰৱাহ বিভাজন চাবলৈ বৰ্তনী ON কৰক।"
                : "Turn ON the circuit to observe parallel current division.")}
        </p>
      </div>
    </SimContainer>
  );
}

/* 19. Heating Effect of Current — Immersive electrical lab
   ───────────────────────────────────────────────────────────
   - 4 device modes: heater coil, bulb filament, iron plate, fuse wire
   - Animated electron flow with speed ∝ current
   - 4 temperature stages with colour + glow + heat-particle emission
   - Live power gauge, accumulated heat graph (H vs t / I / R)
   - Fuse-blow simulation (sparks + circuit break) at high current
   - Step-by-step lab walkthrough, slow-mo, on/off switch
   - Fully bilingual (English + Assamese)
   ─────────────────────────────────────────────────────────── */
type HeatDevice = "heater" | "bulb" | "iron" | "fuse";
type HeatGraph  = "HvsT" | "HvsI" | "HvsR";

interface HeatParticle { x: number; vx: number; y: number; life: number; size: number; }
interface Spark { x: number; y: number; angle: number; life: number; }

export function HeatingEffectSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [device, setDevice]       = useState<HeatDevice>("heater");
  const [graphMode, setGraphMode] = useState<HeatGraph>("HvsT");
  const [I, setI]       = useState(2);
  const [R, setR]       = useState(5);
  const [maxT, setMaxT] = useState(60);
  const [isOn, setIsOn]   = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [t, setT]       = useState(0);
  const [blown, setBlown] = useState(false);
  const [showSparks, setShowSparks] = useState(false);

  // RAF state held in refs
  const tRef      = useRef(0);
  const electronOffset = useRef(0);
  const particlesRef   = useRef<HeatParticle[]>([]);
  const sparksRef      = useRef<Spark[]>([]);
  const historyRef     = useRef<{ t: number; H: number }[]>([]);
  // Forces re-render every animation tick (refs change but state stays same)
  const [tick, setTick] = useState(0);

  // Derived physics
  const P = I * I * R;                       // instantaneous power (W)
  const H = P * t;                           // accumulated heat (J)
  const fuseLimit = 4;                       // amps before the fuse melts
  const tempIntensity = Math.min(1, P / 200);  // 0 → 1 colour intensity
  const accumTemp = 25 + Math.min(1400, (P * t) / 8); // visual °C estimate

  // Stop drawing electrons / particles when blown
  const liveEffect = isOn && !blown;

  // Reset everything
  const reset = () => {
    setIsOn(false);
    setBlown(false);
    setShowSparks(false);
    setT(0);
    tRef.current = 0;
    electronOffset.current = 0;
    particlesRef.current = [];
    sparksRef.current = [];
    historyRef.current = [{ t: 0, H: 0 }];
  };

  // When device or sliders change, reset the run
  useEffect(() => { if (!isOn) reset(); /* eslint-disable-next-line */ }, [device, I, R, maxT]);

  // Main RAF loop
  useRafLoop(liveEffect, (frameDt) => {
    const dt = slowMo ? frameDt * 0.3 : frameDt;
    tRef.current += dt;
    setT(tRef.current);

    // Sample H history at 10Hz
    if (Math.floor(tRef.current * 10) > Math.floor((tRef.current - dt) * 10)) {
      historyRef.current.push({ t: tRef.current, H: P * tRef.current });
      if (historyRef.current.length > 300) historyRef.current.shift();
    }

    // Electron flow speed proportional to current
    electronOffset.current = (electronOffset.current - I * dt * 80) % 30;

    // Spawn heat particles (more + faster when hotter)
    const spawnRate = tempIntensity * 30 * dt;
    for (let i = 0; i < Math.floor(spawnRate + (Math.random() < spawnRate % 1 ? 1 : 0)); i++) {
      particlesRef.current.push({
        x: 280 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 0.4,
        y: 130,
        life: 0,
        size: 2 + Math.random() * 2,
      });
    }
    // Age & move particles upward (faster when hotter)
    particlesRef.current = particlesRef.current
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y - (0.4 + tempIntensity * 1.6),
        life: p.life + dt,
      }))
      .filter((p) => p.life < 2 && p.y > 20);

    // Spark spawning (extreme heat or near-fuse)
    if (tempIntensity > 0.85 && Math.random() < dt * 8) {
      sparksRef.current.push({
        x: 280 + (Math.random() - 0.5) * 60,
        y: 130 + (Math.random() - 0.5) * 30,
        angle: Math.random() * Math.PI * 2,
        life: 0,
      });
    }
    sparksRef.current = sparksRef.current
      .map((s) => ({ ...s, life: s.life + dt }))
      .filter((s) => s.life < 0.3);

    // Fuse-blow check: fuse mode + current above limit + sustained for >0.5s
    if (device === "fuse" && I > fuseLimit && tRef.current > 0.5) {
      setShowSparks(true);
      setTimeout(() => {
        setBlown(true);
        setIsOn(false);
      }, 400);
    }

    // Auto-stop when reaching target time
    if (tRef.current >= maxT) setIsOn(false);

    setTick((x) => x + 1);
  });

  // Colour gradient by temperature intensity
  // 0  → dark grey   (#475569)
  // 0.4→ orange      (#f97316)
  // 0.7→ red         (#dc2626)
  // 1.0→ white-yellow (#fef3c7)
  const heatColor = (() => {
    const lvl = tempIntensity;
    if (lvl < 0.05) return "#475569";
    if (lvl < 0.4) {
      const f = (lvl - 0.05) / 0.35;
      return `rgb(${Math.floor(71 + f * (249 - 71))}, ${Math.floor(85 + f * (115 - 85))}, ${Math.floor(105 + f * (22 - 105))})`;
    }
    if (lvl < 0.7) {
      const f = (lvl - 0.4) / 0.3;
      return `rgb(${Math.floor(249 + f * (220 - 249))}, ${Math.floor(115 + f * (38 - 115))}, ${Math.floor(22 + f * (38 - 22))})`;
    }
    const f = (lvl - 0.7) / 0.3;
    return `rgb(${Math.floor(220 + f * (254 - 220))}, ${Math.floor(38 + f * (243 - 38))}, ${Math.floor(38 + f * (199 - 38))})`;
  })();
  const glowSize = 4 + tempIntensity * 24;

  // Dynamic feedback line
  let feedback: string;
  if (blown) {
    feedback = isAs
      ? "বৰ্তনী ভাঙি গ'ল! ফিউজে গলি বৰ্তনীক ৰক্ষা কৰিলে।"
      : "Circuit broken! The fuse melted to protect the circuit.";
  } else if (!isOn) {
    feedback = isAs
      ? "বৰ্তনী OFF আছে। তাপীয় প্ৰভাৱ চাবলৈ চুইচ ON কৰক।"
      : "Circuit is OFF. Turn the switch ON to observe Joule heating.";
  } else if (tempIntensity < 0.15) {
    feedback = isAs
      ? "কম বিদ্যুৎপ্ৰৱাহ → কম তাপীয় প্ৰভাৱ। তাঁৰডাল প্ৰায় ঠাণ্ডা থাকিছে।"
      : "Low current → small heating effect. The wire stays cool.";
  } else if (tempIntensity < 0.5) {
    feedback = isAs
      ? "বিদ্যুৎপ্ৰৱাহ বঢ়াৰ লগে লগে তাপ বাঢ়ে। কইল কমলা ৰঙৰ হ'বলৈ ধৰিছে।"
      : "As current rises, heating increases. The coil starts to glow orange.";
  } else if (tempIntensity < 0.85) {
    feedback = isAs
      ? "অতি উচ্চ তাপ! H = I²Rt — বিদ্যুৎপ্ৰৱাহ দুগুণ কৰিলে তাপ চাৰিগুণ বাঢ়ে!"
      : "Very high heat! H = I²Rt — doubling the current quadruples the heat produced!";
  } else {
    feedback = isAs
      ? "চৰম উষ্ণতা! সাবধান — ৰেটিং অতিক্ৰম কৰিলে তাঁৰডাল গলিব পাৰে।"
      : "Extreme temperature! Caution — if rating is exceeded, the wire could melt.";
  }

  // Device labels
  const deviceLabel: Record<HeatDevice, { en: string; as: string; emoji: string }> = {
    heater: { en: "Electric Heater",   as: "বৈদ্যুতিক হিটাৰ",   emoji: "🔥" },
    bulb:   { en: "Incandescent Bulb", as: "তাপদীপ্ত বাল্ব",     emoji: "💡" },
    iron:   { en: "Electric Iron",     as: "বৈদ্যুতিক ইস্ত্ৰী", emoji: "🧺" },
    fuse:   { en: "Fuse Wire",         as: "ফিউজ তাঁৰ",          emoji: "⚡" },
  };

  // Heating-element SVG per device
  const renderHeatingElement = () => {
    if (blown && device === "fuse") {
      // Broken fuse wire
      return (
        <g>
          <line x1="220" y1="130" x2="260" y2="130" stroke="#64748b" strokeWidth="3" />
          <line x1="300" y1="130" x2="340" y2="130" stroke="#64748b" strokeWidth="3" />
          <text x="280" y="115" fill="#ef4444" fontSize="11" fontWeight="900" textAnchor="middle">
            ⚠ {isAs ? "ভঙা" : "BROKEN"}
          </text>
        </g>
      );
    }
    if (device === "heater") {
      // Nichrome coil — sinusoidal path
      const coil = Array.from({ length: 30 }).map((_, i) => {
        const x = 220 + i * 4;
        const y = 130 + Math.sin(i * 0.9) * 12;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      }).join(" ");
      return (
        <g>
          <path d={coil} fill="none" stroke={heatColor} strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 ${glowSize}px ${heatColor})`, transition: "stroke 0.2s" }} />
          {tempIntensity > 0.5 && (
            <path d={coil} fill="none" stroke="#fff" strokeWidth="1.5" opacity={tempIntensity * 0.7} />
          )}
        </g>
      );
    }
    if (device === "bulb") {
      // Bulb body + zigzag filament
      const filament = "M 260 138 L 268 122 L 276 138 L 284 122 L 292 138 L 300 122";
      return (
        <g>
          {/* Light bloom when hot */}
          {tempIntensity > 0.3 && (
            <circle cx="280" cy="125" r={20 + tempIntensity * 60} fill="#fef08a"
                    opacity={tempIntensity * 0.3} style={{ filter: "blur(8px)" }} />
          )}
          {/* Bulb glass */}
          <ellipse cx="280" cy="120" rx="32" ry="38"
                   fill={tempIntensity > 0.4 ? `rgba(254, 240, 138, ${tempIntensity * 0.35})` : "rgba(148,163,184,0.15)"}
                   stroke="#94a3b8" strokeWidth="1.5" />
          {/* Base */}
          <rect x="270" y="155" width="20" height="6" fill="#475569" />
          <rect x="272" y="161" width="16" height="4" fill="#64748b" />
          <rect x="274" y="165" width="12" height="4" fill="#475569" />
          {/* Filament wires (leads) */}
          <line x1="276" y1="155" x2="270" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="284" y1="155" x2="300" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Filament */}
          <path d={filament} fill="none" stroke={heatColor} strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 ${glowSize}px ${heatColor})`, transition: "stroke 0.2s" }} />
        </g>
      );
    }
    if (device === "iron") {
      // Iron silhouette: handle on top, sole plate at bottom
      return (
        <g>
          {/* Handle */}
          <path d="M 240 95 Q 280 75 320 95 L 315 110 Q 280 95 245 110 Z"
                fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          {/* Body */}
          <path d="M 235 115 L 325 115 L 325 130 L 235 130 Z"
                fill="#334155" stroke="#475569" strokeWidth="1.5" />
          {/* Sole plate (the heating part) */}
          <path d="M 225 130 L 335 130 L 320 150 L 240 150 Z"
                fill={heatColor}
                stroke="#1e293b" strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 ${glowSize / 2}px ${glowSize}px ${heatColor})`, transition: "fill 0.2s" }} />
          {/* Steam mark when hot */}
          {tempIntensity > 0.5 && (
            <text x="280" y="105" fill="#cbd5e1" fontSize="14" textAnchor="middle" opacity={tempIntensity}>~~~</text>
          )}
        </g>
      );
    }
    // fuse
    return (
      <g>
        {/* Fuse holder */}
        <rect x="218" y="124" width="124" height="12" rx="6" fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="1.5" />
        {/* Fuse wire (thin straight wire, melts at high current) */}
        <line x1="222" y1="130" x2="338" y2="130"
              stroke={heatColor} strokeWidth={I > fuseLimit * 0.8 ? 1.5 : 2.5}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 ${glowSize}px ${heatColor})`, transition: "stroke 0.2s" }} />
        {/* Rating label */}
        <text x="280" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">
          {fuseLimit}A {isAs ? "ফিউজ" : "FUSE"}
        </text>
      </g>
    );
  };

  // Build live graph series
  const graphSeries = (() => {
    if (graphMode === "HvsT") {
      return [{ points: historyRef.current.map((p) => ({ x: p.t, y: p.H })), color: heatColor }];
    }
    if (graphMode === "HvsI") {
      // Theoretical H(I) curve at current R and t
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 6; i += 0.25) {
        pts.push({ x: i, y: i * i * R * Math.max(1, t) });
      }
      return [{ points: pts, color: "#facc15" }];
    }
    // HvsR
    const pts: { x: number; y: number }[] = [];
    for (let r = 1; r <= 20; r += 1) {
      pts.push({ x: r, y: I * I * r * Math.max(1, t) });
    }
    return [{ points: pts, color: "#10b981" }];
  })();
  const graphX = graphMode === "HvsT" ? Math.max(5, t) : graphMode === "HvsI" ? 6 : 20;
  const graphY = Math.max(50, H * 1.2);

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "জুলৰ সূত্ৰ: H = I²Rt। যিকোনো পৰিচালকত প্ৰৱাহিত বিদ্যুৎপ্ৰৱাহে তাপ উৎপন্ন কৰে — বাল্ব, হিটাৰ, ফিউজৰ ভিত্তি।"
        : "Joule's Law: H = I²Rt. Current flowing through any conductor generates heat — the basis for bulbs, heaters, and fuses."}
    >
      {/* Device + mode controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {(["heater", "bulb", "iron", "fuse"] as const).map((d) => (
          <button
            key={d}
            onClick={() => { setDevice(d); reset(); }}
            className={`py-2 rounded-xl text-xs font-black transition-all border ${
              device === d
                ? "bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-500/30"
                : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5"
            }`}
          >
            {deviceLabel[d].emoji} {isAs ? deviceLabel[d].as : deviceLabel[d].en}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mb-3">
        <SimSlider label={isAs ? "বিদ্যুৎপ্ৰৱাহ (I)" : "Current (I)"}    value={I}    onChange={setI}
                   min={0.5} max={6}    step={0.5} unit=" A" color="#dc2626" disabled={isOn} />
        <SimSlider label={isAs ? "ৰোধ (R)"           : "Resistance (R)"} value={R}    onChange={setR}
                   min={1}   max={20}   step={1}   unit=" Ω" color="#f59e0b" disabled={isOn} />
        <SimSlider label={isAs ? "লক্ষ্য সময় (t)"   : "Target Time (t)"} value={maxT} onChange={setMaxT}
                   min={10}  max={300}  step={10}  unit=" s" color="#3b82f6" disabled={isOn} />
      </div>

      {/* Button row */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <SimButton onClick={() => setIsOn(!isOn)} color={isOn ? "#ef4444" : "#10b981"}
                   icon={isOn ? <Pause className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                   disabled={blown}>
          {isOn ? (isAs ? "OFF কৰক" : "Turn OFF") : (isAs ? "ON কৰক" : "Turn ON")}
        </SimButton>
        <SimButton onClick={reset} color="#64748b" icon={<RotateCcw className="w-4 h-4" />}>
          {isAs ? "ৰিছেট" : "Reset"}
        </SimButton>
        <button
          onClick={() => setSlowMo(!slowMo)}
          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
            slowMo ? "bg-indigo-500 text-white shadow-md" : "liquid-inner text-gray-700 dark:text-gray-200"
          }`}
        >
          {slowMo ? (isAs ? "ধীৰ গতি ✓" : "Slow-Mo ✓") : (isAs ? "ধীৰ গতি" : "Slow-Mo")}
        </button>
      </div>

      {/* Main electrical-lab canvas */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#020617] to-[#0f172a] mb-4 w-full h-[280px] md:max-w-2xl md:mx-auto">
        <svg viewBox="0 0 480 240" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="he-glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="he-bench" cx="50%" cy="100%" r="80%">
              <stop offset="0%"   stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <pattern id="he-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#fff" opacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#he-grid)" />
          {/* Bench shadow */}
          <ellipse cx="240" cy="200" rx="180" ry="10" fill="url(#he-bench)" opacity="0.6" />

          {/* Wires connecting battery → switch → element → back */}
          <path d="M 100 130 L 100 90 L 200 90 L 200 130" fill="none" stroke="#334155" strokeWidth="3" />
          <path d="M 360 130 L 380 130 L 380 200 L 100 200 L 100 175" fill="none" stroke="#334155" strokeWidth="3" />
          {/* Animated electrons (only when ON & not blown) */}
          {liveEffect && (
            <>
              <path d="M 100 130 L 100 90 L 200 90 L 200 130"
                    fill="none" stroke="#38bdf8" strokeWidth="2"
                    strokeDasharray="4 26" strokeDashoffset={electronOffset.current}
                    style={{ filter: "drop-shadow(0 0 4px #38bdf8)" }} />
              <path d="M 360 130 L 380 130 L 380 200 L 100 200 L 100 175"
                    fill="none" stroke="#38bdf8" strokeWidth="2"
                    strokeDasharray="4 26" strokeDashoffset={electronOffset.current}
                    style={{ filter: "drop-shadow(0 0 4px #38bdf8)" }} />
            </>
          )}

          {/* Switch */}
          <g transform="translate(160, 90)">
            <circle cx="0"  cy="0" r="3" fill="#64748b" />
            <circle cx="20" cy="0" r="3" fill="#64748b" />
            <line x1="0" y1="0" x2={isOn ? "20" : "16"} y2={isOn ? "0" : "-14"}
                  stroke={isOn ? "#10b981" : "#cbd5e1"} strokeWidth="3" strokeLinecap="round"
                  style={{ transition: "all 0.15s" }} />
          </g>

          {/* Battery (left) */}
          <rect x="80" y="130" width="40" height="45" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <rect x="90" y="125" width="20" height="5" fill="#475569" />
          <text x="100" y="155" fill="#fff" fontSize="11" fontWeight="900" textAnchor="middle">{(I * R).toFixed(0)}V</text>
          <text x="100" y="170" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">+</text>

          {/* Heating element (varies per device) */}
          {renderHeatingElement()}

          {/* Heat particles rising */}
          {particlesRef.current.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.size}
                    fill={heatColor} opacity={Math.max(0, 1 - p.life / 2) * 0.5} />
          ))}

          {/* Sparks at extreme heat / fuse-blow */}
          {(sparksRef.current.length > 0 || showSparks) && sparksRef.current.map((s, i) => {
            const len = 8 + Math.random() * 6;
            const dx = Math.cos(s.angle) * len;
            const dy = Math.sin(s.angle) * len;
            return (
              <line key={`s${i}`} x1={s.x} y1={s.y} x2={s.x + dx} y2={s.y + dy}
                    stroke="#fef08a" strokeWidth="2" strokeLinecap="round"
                    opacity={Math.max(0, 1 - s.life / 0.3)}
                    style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
            );
          })}

          {/* Power meter (top-right) */}
          <g transform="translate(390, 30)">
            <rect x="0" y="0" width="80" height="40" rx="6" fill="rgba(0,0,0,0.7)" stroke="#334155" strokeWidth="1" />
            <text x="40" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">
              {isAs ? "ক্ষমতা P" : "POWER P"}
            </text>
            <text x="40" y="28" fill={heatColor} fontSize="14" textAnchor="middle" fontWeight="900"
                  style={{ filter: `drop-shadow(0 0 4px ${heatColor})` }}>
              {P.toFixed(1)} W
            </text>
            <rect x="6" y="32" width="68" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
            <rect x="6" y="32" width={68 * tempIntensity} height="4" rx="2" fill={heatColor} />
          </g>

          {/* Equation card (top-left) */}
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="120" height="40" rx="6" fill="rgba(0,0,0,0.7)" stroke="#334155" strokeWidth="1" />
            <text x="60" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">
              {isAs ? "জুলৰ সূত্ৰ" : "JOULE'S LAW"}
            </text>
            <text x="60" y="32" fill="#fde047" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              H = I²Rt
            </text>
          </g>

          {/* Temperature readout (bottom-left) */}
          <g transform="translate(20, 200)">
            <rect x="0" y="0" width="110" height="32" rx="6" fill="rgba(0,0,0,0.7)" stroke="#334155" strokeWidth="1" />
            <text x="55" y="11" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">
              {isAs ? "উষ্ণতা" : "TEMPERATURE"}
            </text>
            <text x="55" y="26" fill={heatColor} fontSize="13" textAnchor="middle" fontWeight="900">
              {Math.round(accumTemp)} °C
            </text>
          </g>
        </svg>
      </div>

      {/* Live numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <SimNumber label={isAs ? "বিদ্যুৎপ্ৰৱাহ (I)" : "Current (I)"} value={I}      unit=" A" color="#dc2626" precision={1} />
        <SimNumber label={isAs ? "ৰোধ (R)"            : "Resistance (R)"} value={R}   unit=" Ω" color="#f59e0b" precision={0} />
        <SimNumber label={isAs ? "ক্ষমতা (P)"         : "Power (P)"}   value={P}      unit=" W" color="#8b5cf6" precision={1} />
        <SimNumber label={isAs ? "উৎপন্ন তাপ (H)"      : "Heat (H)"}    value={H}      unit=" J" color="#10b981" precision={0} />
      </div>

      {/* Educational feedback */}
      <div className="w-full bg-slate-900 border border-rose-500/30 p-3 mb-3 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-rose-100 leading-relaxed">{feedback}</p>
      </div>

      {/* Live graph */}
      <div className="bg-[#0f172a]/50 p-3 rounded-xl border border-white/10 shadow-inner mb-3">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-black uppercase text-gray-500 tracking-wider">
            {isAs ? "তাৎক্ষণিক লেখ" : "Live Graph"}
          </label>
          <select value={graphMode} onChange={(e) => setGraphMode(e.target.value as HeatGraph)}
                  className="bg-transparent text-xs font-bold text-white border-b border-white/20 pb-1 cursor-pointer outline-none focus:border-rose-500 transition-colors">
            <option value="HvsT" className="bg-slate-800">{isAs ? "তাপ বনাম সময়"           : "Heat vs Time"}</option>
            <option value="HvsI" className="bg-slate-800">{isAs ? "তাপ বনাম বিদ্যুৎপ্ৰৱাহ" : "Heat vs Current"}</option>
            <option value="HvsR" className="bg-slate-800">{isAs ? "তাপ বনাম ৰোধ"            : "Heat vs Resistance"}</option>
          </select>
        </div>
        <SimGraph series={graphSeries} xMax={graphX} yMax={graphY}
                  xLabel={graphMode === "HvsT"
                    ? (isAs ? "সময় (s)" : "Time (s)")
                    : graphMode === "HvsI"
                      ? (isAs ? "বিদ্যুৎপ্ৰৱাহ (A)" : "Current (A)")
                      : (isAs ? "ৰোধ (Ω)" : "Resistance (Ω)")}
                  yLabel={isAs ? "তাপ (J)" : "Heat (J)"}
                  height={130} />
      </div>

      {/* Step-by-step lab walkthrough */}
      <StepMode steps={isAs ? [
        { title: "১. যন্ত্ৰ বাছক",       body: "হিটাৰ, বাল্ব, ইস্ত্ৰী বা ফিউজ তাঁৰৰ যিকোনো এটা বাছক। প্ৰতিটোৰে নিজস্ব কাৰ্যকৰী তাপীয় আচৰণ আছে।" },
        { title: "২. বিদ্যুৎপ্ৰৱাহ ঠিক কৰক", body: "I স্লাইডাৰ লৰাই বিদ্যুৎপ্ৰৱাহ সলনি কৰক। লক্ষ্য কৰক — বিদ্যুৎপ্ৰৱাহ দুগুণ কৰিলেও তাপ চাৰিগুণ হয় (I²)।" },
        { title: "৩. ৰোধ নিৰ্ধাৰণ কৰক",  body: "ৰোধ R বাছক। অধিক ৰোধে অধিক তাপ উৎপন্ন কৰে (P = I²R)।" },
        { title: "৪. বৰ্তনী ON কৰক",     body: "ON বুটাম টিপি বৰ্তনী চালু কৰক। তাঁৰত ইলেক্ট্ৰনৰ প্ৰৱাহ লক্ষ্য কৰক।" },
        { title: "৫. উষ্ণতা পৰ্যবেক্ষণ কৰক", body: "কইল গৰম হোৱাৰ লগে লগে ৰং সলনি হয়: ধূসৰ → কমলা → ৰঙা → বগা-হালধীয়া। তাপ কণিকাবোৰ ওপৰলৈ উঠে।" },
        { title: "৬. লেখ বিশ্লেষণ কৰক",  body: "তিনিটা ধৰণৰ লেখ বাছক: H বনাম সময়, H বনাম I (পেৰাবলিক!), H বনাম R (ৰৈখিক)। ফিউজ মোডত অতি বিদ্যুৎপ্ৰৱাহ দিলে ফিউজ গলি যাব।" },
      ] : [
        { title: "1. Select Device",       body: "Choose Heater, Bulb, Iron, or Fuse Wire. Each has its own visible heating behaviour." },
        { title: "2. Adjust Current",      body: "Slide the I value. Note that doubling current quadruples the heat (I²)." },
        { title: "3. Set Resistance",      body: "Pick a resistance R. Higher R generates more heat (P = I²R)." },
        { title: "4. Turn ON",             body: "Press the ON button to start the circuit. Watch electrons flow through the wires." },
        { title: "5. Observe Heating",     body: "As the element heats up, colour shifts: grey → orange → red → white-yellow. Heat particles rise upward." },
        { title: "6. Analyse the Graph",   body: "Switch between H vs Time, H vs I (parabolic!), and H vs R (linear). In Fuse mode, exceeding the rating melts the fuse." },
      ]} />
      {/* keep `tick` referenced so React doesn't tree-shake the dependency */}
      <span hidden>{tick}</span>
    </SimContainer>
  );
}
