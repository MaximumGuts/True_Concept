import { useState, useRef } from "react";
import { Play, Snowflake, Flame } from "lucide-react";
import { SimContainer, SimButton, SimSlider, useRafLoop } from "../sim-ui";

/* 23. Filtration */
export function FiltrationSim() {
  const [progress, setProgress] = useState(0); // 0–100
  const [running, setRunning] = useState(false);
  const pRef = useRef(0);
  useRafLoop(running, (dt) => {
    pRef.current = Math.min(100, pRef.current + dt * 25);
    setProgress(pRef.current);
    if (pRef.current >= 100) setRunning(false);
  });
  const reset = () => { pRef.current = 0; setProgress(0); setRunning(false); };
  return (
    <SimContainer
      onReset={reset}
      hint="Filter paper traps insoluble particles (residue) while liquid (filtrate) passes through."
      controls={<SimButton onClick={() => setRunning(true)} disabled={running || progress >= 100} color="#0ea5e9" icon={<Play className="w-3.5 h-3.5" />}>Pour Mixture</SimButton>}
    >
      <svg viewBox="0 0 220 220" className="w-full bg-gradient-to-b from-sky-50 to-cyan-50 rounded-xl">
        {/* funnel */}
        <polygon points="60,30 160,30 130,90 90,90" fill="rgba(229,231,235,0.7)" stroke="#475569" strokeWidth="1.5" />
        <rect x="105" y="90" width="10" height="40" fill="rgba(229,231,235,0.7)" stroke="#475569" strokeWidth="1.5" />
        {/* mixture in funnel */}
        {progress < 100 && (
          <polygon points={`62,32 158,32 ${130 - (progress / 100) * 25},${88 - (progress / 100) * 5} ${90 + (progress / 100) * 25},${88 - (progress / 100) * 5}`} fill="rgba(180,83,9,0.6)" />
        )}
        {/* residue */}
        {progress > 30 && (
          <ellipse cx="110" cy="78" rx={(progress - 30) * 0.4} ry={(progress - 30) * 0.1} fill="#92400e" />
        )}
        {/* drop */}
        {running && progress < 100 && <circle cx="110" cy={130 + (progress % 10) * 4} r="3" fill="#0ea5e9" />}
        {/* beaker */}
        <path d="M 70 170 L 70 215 L 150 215 L 150 170 Z" fill="rgba(186,230,253,0.5)" stroke="#475569" strokeWidth="1.5" />
        <rect x="72" y={215 - (progress * 0.4)} width="76" height={progress * 0.4} fill="rgba(56,189,248,0.7)" />
        <text x="78" y={210} fontSize="9" fill="#0369a1" fontWeight="700">Filtrate (clear)</text>
        <text x="62" y={155} fontSize="9" fill="#475569" fontWeight="700">filter paper</text>
      </svg>
      <div className="mt-3 text-xs text-center font-black text-gray-700 dark:text-gray-200">
        Progress: {progress.toFixed(0)}%
      </div>
    </SimContainer>
  );
}

/* 24. Crystallization */
export function CrystallizationSim() {
  const [stage, setStage] = useState<"heat" | "cool" | "crystal" | "idle">("idle");
  const [t, setT] = useState(25);
  const tRef = useRef(25);
  const stageRef = useRef<typeof stage>("idle");
  stageRef.current = stage;

  useRafLoop(stage === "heat" || stage === "cool", (dt) => {
    if (stageRef.current === "heat") {
      tRef.current = Math.min(100, tRef.current + dt * 25);
      if (tRef.current >= 100) setStage("cool");
    } else if (stageRef.current === "cool") {
      tRef.current = Math.max(20, tRef.current - dt * 18);
      if (tRef.current <= 30) setStage("crystal");
    }
    setT(tRef.current);
  });

  const reset = () => { tRef.current = 25; setT(25); setStage("idle"); };
  const isHot = t > 60;

  return (
    <SimContainer
      onReset={reset}
      hint="Hot saturated copper sulphate solution → cool slowly → blue crystals appear."
      controls={
        <div className="flex gap-1.5">
          <SimButton onClick={() => setStage("heat")} color="#f97316" icon={<Flame className="w-3.5 h-3.5" />} disabled={stage === "heat"}>Heat</SimButton>
          <SimButton onClick={() => setStage("cool")} color="#0ea5e9" icon={<Snowflake className="w-3.5 h-3.5" />} disabled={stage === "cool" || tRef.current < 50}>Cool</SimButton>
        </div>
      }
    >
      <svg viewBox="0 0 220 200" className="w-full bg-gradient-to-b from-orange-50 to-blue-50 rounded-xl">
        {/* beaker */}
        <path d="M 60 60 L 60 180 L 160 180 L 160 60" fill="none" stroke="#475569" strokeWidth="2" />
        {/* solution */}
        <rect x="62" y="80" width="96" height="98" fill={`rgba(59,130,246,${0.3 + (t / 200)})`} />
        {/* heat lines */}
        {isHot && [...Array(4)].map((_, i) => (
          <line key={i} x1={75 + i * 25} y1="55" x2={75 + i * 25} y2="35" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2 2" opacity={0.5 + Math.random() * 0.5} />
        ))}
        {/* crystals */}
        {stage === "crystal" && [
          [80, 170], [100, 165], [120, 175], [140, 168], [90, 172], [130, 162],
        ].map(([x, y], i) => (
          <polygon key={i} points={`${x},${y - 8} ${x + 6},${y - 4} ${x + 4},${y + 4} ${x - 4},${y + 4} ${x - 6},${y - 4}`} fill="#3b82f6" stroke="#1e40af" strokeWidth="0.8" />
        ))}
        <text x="170" y="80" fontSize="11" fill="#dc2626" fontWeight="900">{t.toFixed(0)}°C</text>
      </svg>
      <div className="mt-3 text-center text-xs font-black text-gray-700 dark:text-gray-200">
        {stage === "idle" && "Tap Heat to start"}
        {stage === "heat" && "🔥 Heating..."}
        {stage === "cool" && "❄️ Cooling..."}
        {stage === "crystal" && "💎 Crystals formed!"}
      </div>
    </SimContainer>
  );
}

/* 25. pH Testing */
const SOLUTIONS = [
  { id: "hcl", name: "HCl", pH: 1, color: "#fef3c7", emoji: "🧪" },
  { id: "naoh", name: "NaOH", pH: 13, color: "#e0f2fe", emoji: "🧪" },
  { id: "water", name: "Water", pH: 7, color: "#dbeafe", emoji: "💧" },
  { id: "soap", name: "Soap soln", pH: 9, color: "#f3e8ff", emoji: "🧼" },
];
const INDICATORS = [
  {
    id: "litmus", name: "Litmus",
    color: (pH: number) => pH < 7 ? "#dc2626" : "#3b82f6",
    label: (pH: number) => pH < 7 ? "Red" : "Blue",
  },
  {
    id: "phen", name: "Phenolphthalein",
    color: (pH: number) => pH < 8 ? "#f9fafb" : "#f59e0b",
    label: (pH: number) => pH < 8 ? "Colorless" : "Pink",
  },
  {
    id: "uni", name: "Universal",
    color: (pH: number) => pH < 4 ? "#dc2626" : pH < 7 ? "#f97316" : pH < 8 ? "#84cc16" : pH < 11 ? "#0ea5e9" : "#da6b45",
    label: (pH: number) => pH < 4 ? "Red" : pH < 7 ? "Orange" : pH < 8 ? "Green" : pH < 11 ? "Blue" : "Violet",
  },
];

export function PHTestingSim() {
  const [sol, setSol] = useState(SOLUTIONS[0]);
  const [ind, setInd] = useState(INDICATORS[0]);
  const color = ind.color(sol.pH);
  const label = ind.label(sol.pH);
  const acidic = sol.pH < 7 ? "Acidic" : sol.pH > 7 ? "Basic" : "Neutral";
  return (
    <SimContainer hint="Acids turn blue litmus red. Bases turn red litmus blue and pink with phenolphthalein.">
      <div className="mb-3">
        <div className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase mb-2">Choose Solution</div>
        <div className="grid grid-cols-4 gap-2">
          {SOLUTIONS.map((s) => (
            <button key={s.id} onClick={() => setSol(s)}
              className={`liquid-inner rounded-xl py-2 px-1 text-center transition-all ${sol.id === s.id ? "ring-2 ring-orange-500 scale-105" : ""}`}>
              <div className="text-xl">{s.emoji}</div>
              <div className="text-xs font-black text-gray-700 dark:text-gray-200">{s.name}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <div className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase mb-2">Choose Indicator</div>
        <div className="grid grid-cols-3 gap-2">
          {INDICATORS.map((i) => (
            <button key={i.id} onClick={() => setInd(i)}
              className={`liquid-inner rounded-xl py-2 px-2 text-center transition-all ${ind.id === i.id ? "ring-2 ring-orange-500 scale-105" : ""}`}>
              <div className="text-xs font-black text-gray-700 dark:text-gray-200">{i.name}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end justify-center gap-4 mt-4">
        <svg viewBox="0 0 80 110" width="80" height="110">
          <path d="M 20 30 L 20 100 L 60 100 L 60 30 Z" fill="none" stroke="#475569" strokeWidth="2" />
          <rect x="22" y="40" width="36" height="58" fill={color} />
        </svg>
        <SimSlider label="pH" value={sol.pH} onChange={() => { /* read only */ }} min={0} max={14} color="#da6b45" />
      </div>
      <div className="mt-3 text-center">
        <div className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Result</div>
        <div className="text-lg font-black text-gray-900 dark:text-gray-100">{sol.name} → {label}</div>
        <div className="text-sm font-black mt-1" style={{ color: sol.pH < 7 ? "#dc2626" : sol.pH > 7 ? "#3b82f6" : "#10b981" }}>{acidic} (pH {sol.pH})</div>
      </div>
    </SimContainer>
  );
}
