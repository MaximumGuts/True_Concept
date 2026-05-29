import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { SimContainer, SimButton, SimResetButton, SimSlider, StepMode } from "../sim-ui";

/* ─── Shared UI ─────────────────────────────────────────── */
function Eq({ children }: { children: ReactNode }) {
  return (
    <div className="my-2 px-4 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-center font-mono text-sm font-black text-violet-900 dark:text-violet-200 select-none">
      {children}
    </div>
  );
}
function EnergyBar({ pct, isExo }: { pct: number; isExo: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 mb-2">
      <span className="text-[10px] font-black shrink-0" style={{ color: isExo ? "#f97316" : "#6366f1" }}>
        {isExo ? "🔥 EXOTHERMIC" : "❄️ ENDOTHERMIC"}
      </span>
      <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: isExo ? "linear-gradient(to right,#fbbf24,#f97316,#ef4444)" : "linear-gradient(to right,#93c5fd,#6366f1)" }} />
      </div>
    </div>
  );
}
function PHStrip({ ph }: { ph: number }) {
  const hue = ph < 7 ? (ph / 7) * 60 : 120 + ((ph - 7) / 7) * 120;
  const color = `hsl(${hue},75%,45%)`;
  const label = ph < 6.5 ? "Acidic" : ph > 7.5 ? "Alkaline" : "Neutral";
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl mb-2" style={{ background: `${color}18`, border: `1px solid ${color}44` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white shadow" style={{ background: color }}>{ph.toFixed(1)}</div>
      <div className="flex-1">
        <div className="text-xs font-black mb-1" style={{ color }}>{label} — pH {ph.toFixed(1)}</div>
        <div className="relative h-2 rounded-full w-full" style={{ background: "linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#6366f1,#7c3aed)" }}>
          <div className="absolute top-0 w-2 h-2 rounded-full bg-white border border-gray-400 transition-all duration-500" style={{ left: `calc(${(ph / 14) * 100}% - 4px)` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── SVG Primitives ─────────────────────────────────────── */
const BG = "w-full my-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-inner";
const VB = "0 0 320 210";

function Bubbles({ cx, cy, n, color = "rgba(255,255,255,0.85)", diam = 5, rise = 70 }: {
  cx: number; cy: number; n: number; color?: string; diam?: number; rise?: number;
}) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = cx + (i - (n - 1) / 2) * (diam * 2.2);
        const dur = 1.1 + (i % 3) * 0.35;
        const delay = i * 0.28;
        return (
          <circle key={i} cx={x} cy={cy} r={diam / 2 + (i % 3) * 0.6} fill={color}>
            <animate attributeName="cy" from={cy} to={cy - rise} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </>
  );
}

function Flame({ cx, base, sz = 40 }: { cx: number; base: number; sz?: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={base - sz * 0.5} rx={sz * 0.38} ry={sz * 0.58} fill="#fb923c">
        <animate attributeName="ry" values={`${sz*0.58};${sz*0.72};${sz*0.58}`} dur="0.4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx} cy={base - sz * 0.63} rx={sz * 0.22} ry={sz * 0.4} fill="#fde047">
        <animate attributeName="ry" values={`${sz*0.4};${sz*0.5};${sz*0.4}`} dur="0.35s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={cx} cy={base - sz * 0.72} rx={sz * 0.09} ry={sz * 0.18} fill="white" opacity="0.9" />
    </g>
  );
}

function Burner({ cx, base, on }: { cx: number; base: number; on: boolean }) {
  return (
    <g>
      <rect x={cx - 14} y={base - 6} width={28} height={18} rx={4} fill="#475569" />
      <rect x={cx - 5} y={base - 20} width={10} height={18} rx={3} fill="#334155" />
      {on && <Flame cx={cx} base={base - 18} sz={32} />}
    </g>
  );
}

function Beaker({ x, y, w, h, pct, color, label }: { x: number; y: number; w: number; h: number; pct: number; color: string; label?: string }) {
  const lh = (pct / 100) * h * 0.88;
  return (
    <g>
      <rect x={x + 3} y={y + h * 0.88 - lh} width={w - 6} height={lh} fill={color} opacity="0.82" rx="2" style={{ transition: "fill 0.6s ease" }} />
      <path d={`M ${x+2} ${y} L ${x} ${y+h} L ${x+w} ${y+h} L ${x+w-2} ${y}`} fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={x-4} y1={y} x2={x+w+4} y2={y} stroke="rgba(148,163,184,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      {label && <text x={x + w / 2} y={y + h + 15} textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">{label}</text>}
    </g>
  );
}

function TestTube({ cx, topY, len, w, pct, color, label }: { cx: number; topY: number; len: number; w: number; pct: number; color: string; label?: string }) {
  const hw = w / 2;
  const lh = (pct / 100) * len * 0.85;
  return (
    <g>
      <rect x={cx - hw} y={topY + len * 0.85 - lh} width={w} height={lh} fill={color} opacity="0.85" rx="2" style={{ transition: "fill 0.7s ease" }} />
      <path d={`M ${cx-hw} ${topY} L ${cx-hw} ${topY+len-6} Q ${cx} ${topY+len+6} ${cx+hw} ${topY+len-6} L ${cx+hw} ${topY}`} fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx-hw-3} y1={topY} x2={cx+hw+3} y2={topY} stroke="rgba(148,163,184,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      {label && <text x={cx} y={topY - 12} textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">{label}</text>}
    </g>
  );
}

function Precip({ cx, y, w, color, active }: { cx: number; y: number; w: number; color: string; active: boolean }) {
  if (!active) return null;
  return (
    <g>
      <ellipse cx={cx} cy={y} rx={w / 2} ry={7} fill={color} opacity="0.7" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={cx - w/2 + 4 + i * (w/7)} cy={y - 3 - (i % 3) * 4} r={3} fill={color} opacity="0.9">
          <animate attributeName="cy" from={y - 55} to={y - 3 - (i%3)*4} dur={`${0.6+i*0.1}s`} fill="freeze" begin="0s" />
        </circle>
      ))}
    </g>
  );
}

function Steam({ cx, y, active }: { cx: number; y: number; active: boolean }) {
  if (!active) return null;
  return (
    <>
      {[-14, 0, 14].map((dx, i) => (
        <circle key={i} cx={cx + dx} cy={y} r="4" fill="rgba(186,230,253,0.55)">
          <animate attributeName="cy" from={y} to={y - 38} dur={`${1.3+i*0.25}s`} begin={`${i*0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur={`${1.3+i*0.25}s`} begin={`${i*0.4}s`} repeatCount="indefinite" />
          <animate attributeName="r" from="4" to="9" dur={`${1.3+i*0.25}s`} begin={`${i*0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function Electrode({ x, y1, y2, positive }: { x: number; y1: number; y2: number; positive: boolean }) {
  const c = positive ? "#ef4444" : "#3b82f6";
  return (
    <g>
      <line x1={x} y1={y1 - 18} x2={x} y2={y1} stroke="#64748b" strokeWidth="2.5" />
      <rect x={x-4} y={y1} width={8} height={y2-y1} rx="4" fill={c} opacity="0.9" />
      <text x={x} y={y1-22} textAnchor="middle" fontSize="10" fontWeight="900" fill={c}>{positive ? "(+)" : "(−)"}</text>
    </g>
  );
}

function TempBar({ val, max, x, y, h }: { val: number; max: number; x: number; y: number; h: number }) {
  const fh = Math.min(h - 6, (val / max) * (h - 6));
  const c = val > max * 0.7 ? "#ef4444" : val > max * 0.4 ? "#f97316" : "#3b82f6";
  return (
    <g>
      <rect x={x-5} y={y} width={10} height={h} rx={5} fill="rgba(148,163,184,0.2)" stroke="rgba(148,163,184,0.35)" strokeWidth="1.5" />
      <rect x={x-4} y={y+h-6-fh} width={8} height={fh+6} rx={4} fill={c} style={{ transition: "all 0.4s" }} />
      <circle cx={x} cy={y+h+6} r={7} fill={c} />
      <text x={x} y={y+h+21} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">{val}°C</text>
    </g>
  );
}

function Atom({ cx, cy, el, color, r = 13 }: { cx: number; cy: number; el: string; color: string; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx - r*0.3} cy={cy - r*0.3} r={r*0.35} fill="rgba(255,255,255,0.25)" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={r < 12 ? 9 : 11} fontWeight="900" fill="white">{el}</text>
    </g>
  );
}

function Bond({ x1, y1, x2, y2, double: dbl }: { x1: number; y1: number; x2: number; y2: number; double?: boolean }) {
  if (!dbl) return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />;
  const dx = -(y2 - y1); const dy = x2 - x1;
  const len = Math.hypot(dx, dy) || 1;
  const ox = (dx / len) * 3.5; const oy = (dy / len) * 3.5;
  return (
    <>
      <line x1={x1+ox} y1={y1+oy} x2={x2+ox} y2={y2+oy} stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={x1-ox} y1={y1-oy} x2={x2-ox} y2={y2-oy} stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function StatusText({ text, color = "#94a3b8" }: { text: string; color?: string }) {
  return <text x="160" y="204" textAnchor="middle" fontSize="10" fontWeight="800" fill={color}>{text}</text>;
}

/* ═══════════════════════════════════════════════════════
   CHAPTER 1: CHEMICAL REACTIONS AND EQUATIONS
═══════════════════════════════════════════════════════ */

export function MgCombustionSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const t1 = useRef<ReturnType<typeof setTimeout>|null>(null);
  const ignite = () => { setStage(1); t1.current = setTimeout(() => setStage(2), 2800); };
  const reset = () => { if (t1.current) clearTimeout(t1.current); setStage(0); };

  return (
    <SimContainer hint="Magnesium burns in oxygen with an intensely bright white flame producing magnesium oxide (MgO). This is a combination reaction and also exothermic.">
      <Eq>2Mg(s) + O₂(g) → 2MgO(s) + Heat + Light</Eq>
      <EnergyBar pct={stage === 1 ? 92 : 0} isExo />
      <svg viewBox={VB} className={BG}>
        <rect x="100" y="176" width="120" height="10" rx="5" fill="#334155" />
        {stage === 0 && <>
          <rect x="157" y="80" width="6" height="92" rx="2" fill="#c0c0c0" stroke="#9ca3af" strokeWidth="1" />
          <text x="160" y="72" textAnchor="middle" fontSize="10" fontWeight="800" fill="#94a3b8">Mg ribbon</text>
        </>}
        {stage === 1 && <>
          <Flame cx={160} base={172} sz={75} />
          <ellipse cx="160" cy="118" rx="72" ry="72" fill="white" opacity="0.15">
            <animate attributeName="rx" values="72;100;72" dur="0.35s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="0.35s" repeatCount="indefinite" />
          </ellipse>
          {[0,1,2,3,4,5].map(i => (
            <circle key={i} cx={155 + Math.cos(i) * 28} cy={120 + Math.sin(i) * 24} r="3" fill="white">
              <animate attributeName="cx" from={155+Math.cos(i)*8} to={155+Math.cos(i)*55} dur={`${0.5+i*0.1}s`} repeatCount="indefinite" />
              <animate attributeName="cy" from={120+Math.sin(i)*8} to={120+Math.sin(i)*42} dur={`${0.5+i*0.1}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur={`${0.5+i*0.1}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <StatusText text="⚠ Intense white light — do not look directly!" color="#fcd34d" />
        </>}
        {stage === 2 && <>
          <ellipse cx="160" cy="174" rx="50" ry="10" fill="#f1f5f9" opacity="0.85" />
          <text x="160" y="174" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="800" fill="#64748b">White MgO powder</text>
          <StatusText text="✓ MgO formed — basic oxide. Test with litmus: turns blue." color="#22c55e" />
        </>}
        {stage === 0 && <StatusText text="Click Ignite to begin" />}
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={ignite} disabled={stage !== 0} color="#ef4444">🔥 Ignite</SimButton>
        <SimResetButton onClick={reset} />
      </div>
      <StepMode steps={[
        { title: "Reactants", body: "Magnesium (Mg) is a shiny silver-white metal. Oxygen (O₂) is present in air." },
        { title: "Burning", body: "Mg burns vigorously with a dazzling white flame releasing heat and light." },
        { title: "Product — MgO", body: "White MgO powder forms. It is a basic oxide — turns red litmus blue." },
      ]} />
    </SimContainer>
  );
}

export function SlakingOfLimeSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const [temp, setTemp] = useState(25);
  const iv = useRef<ReturnType<typeof setInterval>|null>(null);

  const pour = () => {
    setStage(1);
    iv.current = setInterval(() => {
      setTemp(t => {
        if (t >= 82) { clearInterval(iv.current!); setStage(2); return 82; }
        return t + 3;
      });
    }, 120);
  };
  const reset = () => { if (iv.current) clearInterval(iv.current); setStage(0); setTemp(25); };

  const liqColor = stage === 0 ? "#f8fafc" : "#f0f9ff";
  return (
    <SimContainer hint="Calcium oxide (quicklime) reacts vigorously with water releasing a large amount of heat. Ca(OH)₂ (slaked lime) is formed.">
      <Eq>CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat</Eq>
      <EnergyBar pct={Math.round(((temp - 25) / 57) * 100)} isExo />
      <svg viewBox={VB} className={BG}>
        <Beaker x={80} y={65} w={150} h={115} pct={stage === 0 ? 30 : 68} color={liqColor} label="Beaker" />
        {stage === 0 && <>
          <ellipse cx="155" cy="138" rx="42" ry="9" fill="#f8fafc" opacity="0.9" />
          <text x="155" y="138" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="800" fill="#64748b">CaO (white powder)</text>
        </>}
        {stage === 1 && <>
          <Steam cx={155} y={68} active />
          <Bubbles cx={140} cy={128} n={4} color="rgba(186,230,253,0.9)" />
          <ellipse cx="155" cy="52" rx="6" ry="8" fill="#60a5fa" opacity="0.8">
            <animate attributeName="cy" from="28" to="68" dur="0.7s" repeatCount="indefinite" />
          </ellipse>
        </>}
        <TempBar val={temp} max={90} x={265} y={62} h={112} />
        <text x="265" y="54" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">°C</text>
        <StatusText text={stage === 0 ? "Add water to CaO" : stage === 1 ? `Reacting... ${temp}°C` : `✓ Ca(OH)₂ formed — ${temp}°C`}
          color={stage === 2 ? "#22c55e" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={pour} disabled={stage !== 0} color="#3b82f6">💧 Add Water</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function FeSO4DecompSim() {
  const [stage, setStage] = useState<0|1|2|3>(0);
  const [heat, setHeat] = useState(false);

  const startHeat = () => {
    setHeat(true);
    setTimeout(() => setStage(1), 1400);
    setTimeout(() => setStage(2), 2800);
    setTimeout(() => { setStage(3); setHeat(false); }, 4200);
  };
  const reset = () => { setStage(0); setHeat(false); };

  const crystalColors = ["#4ade80","#d1fae5","#c4a35a","#92400e"];
  const stageLabels = ["Green FeSO₄·7H₂O crystals","Losing water — turning white...","Decomposing — SO₂/SO₃ gas evolving","Brown Fe₂O₃ residue formed ✓"];

  return (
    <SimContainer hint="On heating, ferrous sulphate loses water (green→white), then decomposes releasing SO₂ and SO₃ gases leaving reddish-brown iron(III) oxide.">
      <Eq>2FeSO₄(s) → Fe₂O₃(s) + SO₂(g)↑ + SO₃(g)↑</Eq>
      <EnergyBar pct={heat ? 70 : 0} isExo={false} />
      <svg viewBox={VB} className={BG}>
        <TestTube cx={160} topY={45} len={135} w={56} pct={65} color={crystalColors[stage]} label="Test tube" />
        <Burner cx={160} base={196} on={heat} />
        {stage >= 2 && <Bubbles cx={160} cy={52} n={5} color="rgba(253,224,71,0.75)" rise={48} />}
        {stage >= 2 && <text x="160" y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fbbf24">SO₂ / SO₃ ↑</text>}
        <StatusText text={stageLabels[stage]} color={stage === 3 ? "#f97316" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={startHeat} disabled={heat || stage > 0} color="#ef4444">🔥 Heat</SimButton>
        <SimResetButton onClick={reset} />
      </div>
      <StepMode steps={[
        { title: "Green Crystals", body: "FeSO₄·7H₂O (green) contains 7 water molecules — water of crystallisation." },
        { title: "White Residue", body: "Heating drives off water. Anhydrous FeSO₄ is white." },
        { title: "Decomposition", body: "At higher temp FeSO₄ decomposes. SO₂ and SO₃ (pungent) are released. Brown Fe₂O₃ remains." },
      ]} />
    </SimContainer>
  );
}

export function WaterElectrolysisSim() {
  const [on, setOn] = useState(false);

  return (
    <SimContainer hint="Water is split into hydrogen (cathode, 2 volumes) and oxygen (anode, 1 volume) by electrolysis. H₂:O₂ = 2:1 by volume.">
      <Eq>2H₂O(l) ⟶(electric current) 2H₂(g) + O₂(g)</Eq>
      <svg viewBox={VB} className={BG}>
        <Beaker x={50} y={50} w={220} h={135} pct={82} color="rgba(186,230,253,0.35)" />
        <Electrode x={108} y1={78} y2={172} positive={false} />
        <Electrode x={212} y1={78} y2={172} positive />
        <text x="108" y="56" textAnchor="middle" fontSize="9" fill="#64748b">Cathode (−)</text>
        <text x="212" y="56" textAnchor="middle" fontSize="9" fill="#64748b">Anode (+)</text>
        {on && <Bubbles cx={108} cy={80} n={7} color="rgba(147,197,253,0.9)" rise={58} />}
        {on && <Bubbles cx={212} cy={80} n={3} color="rgba(253,186,116,0.9)" rise={52} diam={4} />}
        <rect x={82} y={18} width={52} height={32} rx="4" fill="rgba(147,197,253,0.12)" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" />
        <rect x={186} y={18} width={52} height={32} rx="4" fill="rgba(253,186,116,0.12)" stroke="rgba(253,186,116,0.4)" strokeWidth="1.5" />
        <text x="108" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fill="#93c5fd">H₂</text>
        <text x="108" y="46" textAnchor="middle" fontSize="9" fill="#6366f1">2 vol.</text>
        <text x="212" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fb923c">O₂</text>
        <text x="212" y="46" textAnchor="middle" fontSize="9" fill="#fb923c">1 vol.</text>
        <rect x="130" y="10" width="60" height="18" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <text x="160" y="21" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fbbf24">⚡ DC Battery</text>
        <line x1="108" y1="10" x2="108" y2="22" stroke="#3b82f6" strokeWidth="2" />
        <line x1="212" y1="10" x2="212" y2="22" stroke="#ef4444" strokeWidth="2" />
        <StatusText text={on ? "H₂ : O₂ = 2 : 1 by volume" : "Switch on current to begin"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={() => setOn(o => !o)} color={on ? "#ef4444" : "#22c55e"}>{on ? "⏹ Off" : "▶ Switch On"}</SimButton>
        <SimResetButton onClick={() => setOn(false)} />
      </div>
    </SimContainer>
  );
}

export function IronCuSO4Sim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const t1 = useRef<ReturnType<typeof setTimeout>|null>(null);
  const lowerNail = () => { setStage(1); t1.current = setTimeout(() => setStage(2), 2500); };
  const reset = () => { setStage(0); };
  const solColor = stage === 0 ? "#3b82f6" : stage === 1 ? "rgba(59,130,246,0.55)" : "#4ade80";

  return (
    <SimContainer hint="Iron displaces copper from CuSO₄ solution (blue→green). Copper deposits on the iron nail as it is above Cu in the reactivity series.">
      <Eq>Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)↓</Eq>
      <svg viewBox={VB} className={BG}>
        <Beaker x={80} y={58} w={160} h={122} pct={75} color={solColor} label="CuSO₄ → FeSO₄" />
        <rect x="153" y={stage === 0 ? 18 : 62} width="14" height="114" rx="3" fill="#94a3b8" style={{ transition: "y 0.9s ease" }} />
        {stage >= 1 && <rect x="153" y="98" width="14" height="78" rx="3" fill="#ea580c" opacity="0.85" style={{ transition: "all 0.9s ease" }} />}
        <text x="160" y={stage === 0 ? 13 : 57} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">Fe nail</text>
        {stage >= 1 && <text x="182" y="138" fontSize="9" fill="#ea580c" fontWeight="800">Cu↓</text>}
        <StatusText text={["Blue CuSO₄ — lower the Fe nail","Solution changing colour...","✓ Green FeSO₄ — copper deposited on Fe"][stage]}
          color={stage === 2 ? "#4ade80" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={lowerNail} disabled={stage !== 0} color="#ea580c">🔩 Lower Fe Nail</SimButton>
        <SimResetButton onClick={reset} />
      </div>
      <StepMode steps={[
        { title: "Before", body: "Blue CuSO₄ solution. Iron nail is shiny grey." },
        { title: "Displacement", body: "Fe (more reactive) displaces Cu²⁺ from solution." },
        { title: "After", body: "Solution turns pale green (FeSO₄). Red-brown Cu coats the nail." },
      ]} />
    </SimContainer>
  );
}

export function ZnHClSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const [temp, setTemp] = useState(25);
  const iv = useRef<ReturnType<typeof setInterval>|null>(null);

  const addZinc = () => {
    setStage(1);
    iv.current = setInterval(() => {
      setTemp(t => { if (t >= 54) { clearInterval(iv.current!); setStage(2); return 54; } return t + 1.5; });
    }, 100);
  };
  const reset = () => { if (iv.current) clearInterval(iv.current); setStage(0); setTemp(25); };

  return (
    <SimContainer hint="Zinc displaces hydrogen from HCl (displacement reaction). H₂ gas is released — burns with a pop. ZnCl₂ solution forms. The reaction is exothermic.">
      <Eq>Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑</Eq>
      <EnergyBar pct={Math.round(((temp - 25) / 29) * 100)} isExo />
      <svg viewBox={VB} className={BG}>
        <Beaker x={88} y={52} w={144} h={128} pct={72} color="rgba(254,249,195,0.65)" label="HCl(aq)" />
        {stage === 0 && <rect x="147" y="26" width="26" height="18" rx="4" fill="#94a3b8" />}
        {stage === 0 && <text x="160" y="20" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">Zn</text>}
        {stage >= 1 && <>
          <rect x="147" y="112" width={Math.max(4, 26 - stage * 8)} height="14" rx="3" fill="#94a3b8" style={{ transition: "width 0.5s" }} />
          <Bubbles cx={160} cy={76} n={7} color="rgba(220,220,255,0.9)" rise={58} />
          <text x="160" y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill="#d1d5db">H₂ gas ↑</text>
        </>}
        <TempBar val={temp} max={60} x={268} y={62} h={105} />
        <StatusText text={["Add zinc to HCl", "Reacting — H₂ evolving...", "✓ ZnCl₂ + H₂ produced"][stage]}
          color={stage === 2 ? "#22c55e" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={addZinc} disabled={stage !== 0} color="#6b7280">⬛ Add Zinc</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function LeadIodideSim() {
  const [mixed, setMixed] = useState(false);
  return (
    <SimContainer hint="Mixing Pb(NO₃)₂ and KI solutions produces a bright yellow precipitate of PbI₂. This is a double displacement (metathesis) reaction.">
      <Eq>Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s)↓ + 2KNO₃(aq)</Eq>
      <svg viewBox={VB} className={BG}>
        {!mixed ? <>
          <Beaker x={35} y={58} w={102} h={115} pct={65} color="rgba(248,250,252,0.65)" label="Pb(NO₃)₂" />
          <Beaker x={183} y={58} w={102} h={115} pct={65} color="rgba(248,250,252,0.6)" label="KI" />
          <text x="160" y="118" textAnchor="middle" fontSize="24" fill="#64748b">+</text>
        </> : <>
          <Beaker x={80} y={55} w={160} h={122} pct={72} color="rgba(253,224,71,0.4)" label="Mixed" />
          <Precip cx={160} y={170} w={136} color="#fde047" active />
          <text x="160" y="40" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fde047">⬇ PbI₂ — Bright Yellow Precipitate</text>
          <StatusText text="✓ Double displacement complete" color="#fde047" />
        </>}
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={() => setMixed(true)} disabled={mixed} color="#eab308">🧪 Mix Solutions</SimButton>
        <SimResetButton onClick={() => setMixed(false)} />
      </div>
    </SimContainer>
  );
}

export function BaSO4Sim() {
  const [mixed, setMixed] = useState(false);
  return (
    <SimContainer hint="BaCl₂ + H₂SO₄ → white insoluble BaSO₄ precipitate. Used as a confirmatory test for sulphate ions — BaSO₄ is insoluble even in dilute HCl.">
      <Eq>BaCl₂(aq) + H₂SO₄(aq) → BaSO₄(s)↓ + 2HCl(aq)</Eq>
      <svg viewBox={VB} className={BG}>
        {!mixed ? <>
          <Beaker x={35} y={58} w={102} h={115} pct={65} color="rgba(248,250,252,0.65)" label="BaCl₂" />
          <Beaker x={183} y={58} w={102} h={115} pct={65} color="rgba(254,249,195,0.6)" label="H₂SO₄" />
          <text x="160" y="118" textAnchor="middle" fontSize="24" fill="#64748b">+</text>
        </> : <>
          <Beaker x={80} y={55} w={160} h={122} pct={72} color="rgba(248,250,252,0.28)" label="Mixed" />
          <Precip cx={160} y={170} w={136} color="#e2e8f0" active />
          <text x="160" y="40" textAnchor="middle" fontSize="11" fontWeight="900" fill="#e2e8f0">⬇ BaSO₄ — White Precipitate</text>
          <StatusText text="✓ Insoluble even in dilute HCl" color="#94a3b8" />
        </>}
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={() => setMixed(true)} disabled={mixed} color="#64748b">🧪 Mix Solutions</SimButton>
        <SimResetButton onClick={() => setMixed(false)} />
      </div>
    </SimContainer>
  );
}

export function CuOxidationSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const [heat, setHeat] = useState(false);
  const cuColors = ["#ea580c","#92400e","#1e293b"];
  const labels = ["Copper (Cu) — red/orange","Oxidising...","✓ Black CuO formed"];

  const startHeat = () => {
    setHeat(true);
    setTimeout(() => setStage(1), 1500);
    setTimeout(() => { setStage(2); setHeat(false); }, 3200);
  };
  const reset = () => { setStage(0); setHeat(false); };

  return (
    <SimContainer hint="Copper heated in air reacts with O₂ forming black copper oxide (CuO). This is oxidation — Cu is the reducing agent, O₂ is the oxidising agent.">
      <Eq>2Cu(s) + O₂(g) → 2CuO(s)</Eq>
      <EnergyBar pct={heat ? 55 : 0} isExo />
      <svg viewBox={VB} className={BG}>
        <rect x="110" y="78" width="100" height="82" rx="8" fill={cuColors[stage]} style={{ transition: "fill 0.8s ease" }} />
        <text x="160" y="121" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="900" fill="white">{["Cu","Cu→CuO","CuO"][stage]}</text>
        {heat && <Bubbles cx={160} cy={80} n={4} color="rgba(156,163,175,0.6)" rise={38} />}
        <Burner cx={160} base={196} on={heat} />
        <StatusText text={labels[stage]} color={stage === 0 ? "#ea580c" : stage === 1 ? "#92400e" : "#22c55e"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={startHeat} disabled={heat || stage > 0} color="#ef4444">🔥 Heat in Air</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function CuOReductionSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const [heat, setHeat] = useState(false);
  const cuoColors = ["#1e293b","#78350f","#ea580c"];

  const startReduce = () => {
    setHeat(true);
    setTimeout(() => setStage(1), 1800);
    setTimeout(() => { setStage(2); setHeat(false); }, 3600);
  };
  const reset = () => { setStage(0); setHeat(false); };

  return (
    <SimContainer hint="Black CuO is reduced by H₂ gas to give red Cu metal. CuO is the oxidising agent (gains H), H₂ is the reducing agent (loses H). This is a redox reaction.">
      <Eq>CuO(s) + H₂(g) → Cu(s) + H₂O(g)</Eq>
      <svg viewBox={VB} className={BG}>
        {heat && <>
          <rect x="28" y="100" width="72" height="20" rx="5" fill="rgba(147,197,253,0.25)" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="64" y="111" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="700">H₂ gas →</text>
        </>}
        <rect x="108" y="76" width="104" height="80" rx="8" fill={cuoColors[stage]} style={{ transition: "fill 1.2s ease" }} />
        <text x="160" y="118" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="900" fill="white">
          {["CuO","CuO → Cu","Cu"][stage]}
        </text>
        {stage >= 1 && <Steam cx={218} y={78} active />}
        {stage >= 1 && <text x="246" y="66" fontSize="9" fill="#93c5fd" fontWeight="700">H₂O↑</text>}
        <Burner cx={160} base={196} on={heat} />
        <StatusText text={["Black CuO ready", "Reducing... Cu restoring...", "✓ Red Cu metal — redox complete"][stage]}
          color={stage === 2 ? "#ea580c" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={startReduce} disabled={heat || stage > 0} color="#ef4444">🔥 Heat + H₂</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER 2: ACIDS, BASES AND SALTS
═══════════════════════════════════════════════════════ */

export function AcidMetalSim() {
  const [ph] = useState(1.2);
  const [metal, setMetal] = useState<"Zn"|"Fe"|"Cu">("Zn");
  const [reacting, setReacting] = useState(false);
  const reacts = metal !== "Cu";
  const reset = () => setReacting(false);

  return (
    <SimContainer hint="Metals above hydrogen in the reactivity series displace H₂ from acids. Copper is below hydrogen — it does NOT react with HCl or H₂SO₄.">
      <Eq>{metal === "Zn" ? "Zn + 2HCl → ZnCl₂ + H₂↑" : metal === "Fe" ? "Fe + H₂SO₄ → FeSO₄ + H₂↑" : "Cu + HCl → No reaction ✗"}</Eq>
      <PHStrip ph={ph} />
      <svg viewBox={VB} className={BG}>
        <Beaker x={80} y={58} w={160} h={122} pct={72} color="rgba(254,249,195,0.65)" label="Dilute Acid" />
        <rect x="147" y={reacting ? 82 : 26} width="26" height="92" rx="4"
          fill={metal === "Zn" ? "#94a3b8" : metal === "Fe" ? "#78716c" : "#ea580c"}
          style={{ transition: "y 0.8s ease" }} />
        <text x="160" y={reacting ? 78 : 22} textAnchor="middle" fontSize="10" fontWeight="800"
          fill={metal === "Zn" ? "#94a3b8" : metal === "Fe" ? "#78716c" : "#ea580c"}>{metal}</text>
        {reacting && reacts && <Bubbles cx={160} cy={70} n={6} color="rgba(220,220,255,0.9)" rise={55} />}
        {reacting && reacts && <text x="160" y="36" textAnchor="middle" fontSize="10" fontWeight="800" fill="#d1d5db">H₂ ↑</text>}
        {reacting && !reacts && <text x="160" y="36" textAnchor="middle" fontSize="11" fontWeight="900" fill="#f97316">No reaction!</text>}
        <StatusText text={reacts ? (reacting ? "H₂ gas evolving — exothermic" : "Ready") : "Cu is below H — no displacement"} />
      </svg>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {(["Zn","Fe","Cu"] as const).map(m => (
          <button key={m} onClick={() => { setMetal(m); setReacting(false); }}
            className={`py-2 rounded-xl text-xs font-black transition-all ${metal === m ? "text-white shadow" : "bg-white/10 text-gray-300"}`}
            style={metal === m ? { background: m === "Zn" ? "#64748b" : m === "Fe" ? "#78716c" : "#ea580c" } : {}}>
            {m} {m === "Cu" ? "⛔" : "✓"}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <SimButton onClick={() => setReacting(true)} disabled={reacting} color="#eab308">🧪 Add Metal</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function CO2EvolutionSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const pour = () => { setStage(1); setTimeout(() => setStage(2), 2000); };
  const reset = () => setStage(0);

  return (
    <SimContainer hint="Acids react with carbonates and bicarbonates to produce CO₂ gas. The effervescence (fizzing) is due to CO₂. This gas turns lime water milky.">
      <Eq>Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑</Eq>
      <svg viewBox={VB} className={BG}>
        <Beaker x={80} y={62} w={160} h={120} pct={68} color="rgba(254,249,195,0.65)" label="HCl(aq)" />
        {stage === 0 && <>
          <ellipse cx="160" cy="92" rx="42" ry="9" fill="#f8fafc" opacity="0.85" />
          <text x="160" y="93" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="800" fill="#64748b">Na₂CO₃ powder</text>
        </>}
        {stage >= 1 && <>
          <Bubbles cx={145} cy={76} n={7} color="rgba(209,250,229,0.85)" rise={62} />
          <Bubbles cx={175} cy={78} n={5} color="rgba(209,250,229,0.85)" rise={58} diam={4} />
          <text x="160" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fill="#6ee7b7">CO₂ gas ↑ (effervescence)</text>
        </>}
        <StatusText text={["Add Na₂CO₃ to HCl","Effervescence — CO₂ releasing!","CO₂ produced — turns lime water milky"][stage]}
          color={stage >= 1 ? "#6ee7b7" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={pour} disabled={stage !== 0} color="#16a34a">🧪 Add Carbonate</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function LimeWaterTestSim() {
  const [clarity, setClarity] = useState(0);
  const [bubbling, setBubbling] = useState(false);
  const iv = useRef<ReturnType<typeof setInterval>|null>(null);

  const blowCO2 = () => {
    setBubbling(true);
    iv.current = setInterval(() => {
      setClarity(c => { if (c >= 100) { clearInterval(iv.current!); setBubbling(false); return 100; } return c + 5; });
    }, 150);
  };
  const reset = () => { if (iv.current) clearInterval(iv.current); setBubbling(false); setClarity(0); };

  const r = Math.round(248 - clarity * 1.2);
  const liqColor = `rgba(${r},${Math.round(250 - clarity * 0.5)},252,0.85)`;

  return (
    <SimContainer hint="CO₂ passed through lime water [Ca(OH)₂] forms a white precipitate of CaCO₃, making it milky. This is the standard test for CO₂.">
      <Eq>Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s)↓ + H₂O(l)</Eq>
      <svg viewBox={VB} className={BG}>
        <Beaker x={90} y={52} w={140} h={132} pct={78} color={liqColor} label="Lime water" />
        <rect x="138" y="16" width="44" height="12" rx="4" fill="rgba(209,250,229,0.25)" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="160" y="23" textAnchor="middle" fontSize="9" fill="#6ee7b7" fontWeight="700">CO₂</text>
        <line x1="160" y1="28" x2="160" y2="52" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="3 3" />
        {bubbling && <Bubbles cx={160} cy={68} n={5} color="rgba(209,250,229,0.85)" rise={48} />}
        {clarity > 25 && <ellipse cx="160" cy="128" rx="55" ry="24" fill="rgba(241,245,249,0.7)" opacity={clarity / 100} />}
        <StatusText text={clarity === 0 ? "Lime water is clear" : clarity < 100 ? `Turning milky... ${clarity}%` : "✓ Milky white — CO₂ confirmed (CaCO₃↓)"}
          color={clarity === 100 ? "#f1f5f9" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={blowCO2} disabled={bubbling || clarity >= 100} color="#16a34a">🫧 Pass CO₂</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function NeutralizationSim() {
  const [naoh, setNaoh] = useState(0);
  const ph = Math.max(0, Math.min(14, 1 + (naoh / 10) * 13));
  const indColor = ph < 6.5 ? "#ef4444" : ph < 7.5 ? "#22c55e" : "#7c3aed";
  const indLabel = ph < 6.5 ? "Red — Acidic" : ph < 7.5 ? "Green — Neutral" : "Purple — Alkaline";

  return (
    <SimContainer hint="Acid + Base → Salt + Water. The pH changes from acidic to neutral at the equivalence point. This is detected by an indicator (phenolphthalein, litmus etc.).">
      <Eq>HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)</Eq>
      <PHStrip ph={ph} />
      <svg viewBox={VB} className={BG}>
        <Beaker x={80} y={52} w={160} h={132} pct={76} color={`${indColor}42`} label="HCl + indicator" />
        <rect x="134" y="8" width="52" height="18" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="160" y="18" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="800">NaOH solution</text>
        <line x1="160" y1="26" x2="160" y2="52" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
        {naoh > 0 && <ellipse cx="160" cy="50" rx="5" ry="7" fill="#93c5fd" opacity="0.8">
          <animate attributeName="cy" from="26" to="52" dur="0.6s" repeatCount="indefinite" />
        </ellipse>}
        <text x="160" y="130" textAnchor="middle" fontSize="11" fontWeight="900" fill={indColor} style={{ transition: "fill 0.5s" }}>{indLabel}</text>
        <StatusText text={`pH = ${ph.toFixed(1)} — ${ph < 6.5 ? "Acidic" : ph < 7.5 ? "Neutral" : "Alkaline"}`} />
      </svg>
      <SimSlider label="NaOH added (mL)" value={naoh} onChange={setNaoh} min={0} max={20} step={1} unit=" mL" color="#7c3aed" />
    </SimContainer>
  );
}

export function BrineElectrolysisSim() {
  const [on, setOn] = useState(false);
  return (
    <SimContainer hint="Electrolysis of brine (NaCl + water): Cl₂ at anode, H₂ at cathode, NaOH in solution. This is the chlor-alkali process — industrially very important.">
      <Eq>2NaCl(aq) + 2H₂O → 2NaOH(aq) + H₂(g) + Cl₂(g)</Eq>
      <svg viewBox={VB} className={BG}>
        <Beaker x={50} y={48} w={220} h={138} pct={82} color="rgba(248,250,252,0.35)" label="Brine (NaCl solution)" />
        <Electrode x={108} y1={76} y2={174} positive={false} />
        <Electrode x={212} y1={76} y2={174} positive />
        <text x="108" y="54" textAnchor="middle" fontSize="8" fill="#64748b">Cathode (−)</text>
        <text x="212" y="54" textAnchor="middle" fontSize="8" fill="#64748b">Anode (+)</text>
        {on && <Bubbles cx={108} cy={78} n={5} color="rgba(147,197,253,0.9)" rise={54} />}
        {on && <Bubbles cx={212} cy={78} n={4} color="rgba(253,224,71,0.8)" rise={50} diam={4} />}
        <rect x={82} y={20} width={52} height={28} rx="4" fill="rgba(147,197,253,0.12)" stroke="#93c5fd" strokeWidth="1" />
        <rect x={186} y={20} width={52} height={28} rx="4" fill="rgba(253,224,71,0.12)" stroke="#fde047" strokeWidth="1" />
        <text x="108" y="38" textAnchor="middle" fontSize="10" fontWeight="900" fill="#93c5fd">H₂</text>
        <text x="212" y="38" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fde047">Cl₂</text>
        <rect x="130" y="10" width="60" height="16" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <text x="160" y="20" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fbbf24">⚡ DC</text>
        <text x="160" y="148" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="700">NaOH forms in solution</text>
        <StatusText text={on ? "H₂ at cathode | Cl₂ at anode | NaOH in solution" : "Switch on current to start"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={() => setOn(o => !o)} color={on ? "#ef4444" : "#22c55e"}>{on ? "⏹ Off" : "▶ On"}</SimButton>
        <SimResetButton onClick={() => setOn(false)} />
      </div>
    </SimContainer>
  );
}

export function NaHCO3HeatSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const [heat, setHeat] = useState(false);
  const startHeat = () => {
    setHeat(true);
    setTimeout(() => setStage(1), 1500);
    setTimeout(() => { setStage(2); setHeat(false); }, 3000);
  };
  const reset = () => { setStage(0); setHeat(false); };

  return (
    <SimContainer hint="Sodium bicarbonate (baking soda) decomposes on heating to sodium carbonate, CO₂, and water. This is why bread rises when baked.">
      <Eq>2NaHCO₃(s) → Na₂CO₃(s) + H₂O(g) + CO₂(g)↑</Eq>
      <EnergyBar pct={heat ? 65 : 0} isExo={false} />
      <svg viewBox={VB} className={BG}>
        <TestTube cx={160} topY={44} len={138} w={56} pct={62}
          color={stage === 0 ? "#f8fafc" : stage === 1 ? "#f0f9ff" : "#e2e8f0"} label="NaHCO₃" />
        <Burner cx={160} base={196} on={heat} />
        {stage >= 1 && <Bubbles cx={160} cy={52} n={5} color="rgba(209,250,229,0.8)" rise={46} />}
        {stage >= 1 && <text x="160" y="30" textAnchor="middle" fontSize="10" fontWeight="800" fill="#6ee7b7">CO₂ + H₂O ↑</text>}
        <StatusText text={["NaHCO₃ ready — heat to decompose","Decomposing — CO₂ + H₂O gas!","✓ Na₂CO₃ residue remains"][stage]}
          color={stage === 2 ? "#22c55e" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={startHeat} disabled={heat || stage > 0} color="#ef4444">🔥 Heat</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER 3: METALS AND NON-METALS
═══════════════════════════════════════════════════════ */

export function NaWaterSim() {
  const [stage, setStage] = useState<0|1|2|3>(0);
  const drop = () => {
    setStage(1);
    setTimeout(() => setStage(2), 1200);
    setTimeout(() => setStage(3), 2800);
  };
  const reset = () => setStage(0);

  return (
    <SimContainer hint="Sodium is so reactive it floats on water, melts due to heat, and vigorously releases H₂ gas which may ignite. NaOH (strongly alkaline) forms.">
      <Eq>2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)↑</Eq>
      <EnergyBar pct={stage >= 1 ? 88 : 0} isExo />
      <svg viewBox={VB} className={BG}>
        <Beaker x={62} y={58} w={196} h={132} pct={72} color="rgba(186,230,253,0.45)" label="Water" />
        {stage === 0 && <rect x="147" y="26" width="26" height="20" rx="5" fill="#c0c0c0" />}
        {stage === 0 && <text x="160" y="20" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">Na</text>}
        {stage >= 1 && <>
          <circle cx="160" cy="90" r="14" fill="#c0c0c0" stroke="#e2e8f0" strokeWidth="1.5">
            {stage >= 2 && <animate attributeName="cx" values="160;152;168;157;163;160" dur="0.6s" repeatCount="indefinite" />}
          </circle>
          <Bubbles cx={160} cy={78} n={8} color="rgba(220,220,255,0.9)" rise={52} />
        </>}
        {stage >= 2 && <Flame cx={160} base={80} sz={22} />}
        {stage >= 3 && <text x="160" y="48" textAnchor="middle" fontSize="10" fontWeight="900" fill="#22c55e">NaOH forms — turns phenolphthalein pink</text>}
        <StatusText text={["Drop Na in water","Na floating & reacting!","H₂ ignites — vigorous reaction!","✓ NaOH (aq) + H₂ produced"][stage]}
          color={stage >= 2 ? "#fbbf24" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={drop} disabled={stage !== 0} color="#94a3b8">💧 Drop Na in Water</SimButton>
        <SimResetButton onClick={reset} />
      </div>
      <StepMode steps={[
        { title: "Na is Highly Reactive", body: "Sodium is stored in kerosene to prevent contact with air and moisture." },
        { title: "Reaction with Water", body: "Na floats, moves around, and melts into a ball from the intense heat released." },
        { title: "Products", body: "NaOH (strong alkali) and H₂ gas form. H₂ may ignite spontaneously due to the heat." },
      ]} />
    </SimContainer>
  );
}

export function AmphoterixSim() {
  const [reagent, setReagent] = useState<"none"|"acid"|"base">("none");
  const eqs: Record<string, string> = {
    none: "Al₂O₃ — amphoteric oxide (select a reagent)",
    acid: "Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O",
    base: "Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O",
  };

  return (
    <SimContainer hint="Al₂O₃ is amphoteric — it reacts with both acids and bases. This dual behaviour is characteristic of amphoteric oxides like ZnO and PbO.">
      <Eq>{eqs[reagent]}</Eq>
      <svg viewBox={VB} className={BG}>
        <circle cx="160" cy="108" r="44" fill="rgba(148,163,184,0.25)" stroke="#94a3b8" strokeWidth="2.5" />
        <text x="160" y="106" textAnchor="middle" fontSize="12" fontWeight="900" fill="#e2e8f0">Al₂O₃</text>
        <text x="160" y="122" textAnchor="middle" fontSize="9" fill="#94a3b8">Amphoteric</text>
        <circle cx="62" cy="108" r="33" fill={reagent === "acid" ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.1)"}
          stroke={reagent === "acid" ? "#ef4444" : "rgba(239,68,68,0.3)"} strokeWidth="1.5" />
        <text x="62" y="106" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ef4444">HCl</text>
        <text x="62" y="120" textAnchor="middle" fontSize="9" fill="#94a3b8">Acid</text>
        <circle cx="258" cy="108" r="33" fill={reagent === "base" ? "rgba(124,58,237,0.3)" : "rgba(124,58,237,0.1)"}
          stroke={reagent === "base" ? "#7c3aed" : "rgba(124,58,237,0.3)"} strokeWidth="1.5" />
        <text x="258" y="106" textAnchor="middle" fontSize="11" fontWeight="900" fill="#7c3aed">NaOH</text>
        <text x="258" y="120" textAnchor="middle" fontSize="9" fill="#94a3b8">Base</text>
        <line x1="95" y1="108" x2="116" y2="108" stroke={reagent === "acid" ? "#ef4444" : "#334155"} strokeWidth={reagent === "acid" ? 3 : 1.5} />
        <line x1="204" y1="108" x2="225" y2="108" stroke={reagent === "base" ? "#7c3aed" : "#334155"} strokeWidth={reagent === "base" ? 3 : 1.5} />
        {reagent === "acid" && <text x="160" y="172" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ef4444">→ AlCl₃ + H₂O</text>}
        {reagent === "base" && <text x="160" y="172" textAnchor="middle" fontSize="10" fontWeight="900" fill="#7c3aed">→ NaAlO₂ + H₂O</text>}
        <StatusText text="Al₂O₃ reacts with both — it is amphoteric!" />
      </svg>
      <div className="grid grid-cols-2 gap-2">
        <SimButton onClick={() => setReagent("acid")} color="#ef4444">🧪 Add HCl (Acid)</SimButton>
        <SimButton onClick={() => setReagent("base")} color="#7c3aed">🧪 Add NaOH (Base)</SimButton>
      </div>
      <div className="mt-2"><SimResetButton onClick={() => setReagent("none")} /></div>
    </SimContainer>
  );
}

export function ThermiteSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const ignite = () => { setStage(1); setTimeout(() => setStage(2), 3500); };
  const reset = () => setStage(0);

  return (
    <SimContainer hint="Thermite reaction: Al + Fe₂O₃ releases enormous heat (~3500°C) producing molten iron. Used in welding railway tracks — iron flows into the gap and solidifies.">
      <Eq>Fe₂O₃(s) + 2Al(s) → Al₂O₃(s) + 2Fe(l) + Heat (~3500°C)</Eq>
      <EnergyBar pct={stage === 1 ? 100 : 0} isExo />
      <svg viewBox={VB} className={BG}>
        {stage === 0 && <>
          <rect x="98" y="76" width="124" height="92" rx="8" fill="rgba(146,64,14,0.7)" />
          <text x="160" y="124" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="900" fill="#fcd34d">Fe₂O₃ + 2Al</text>
        </>}
        {stage === 1 && <>
          <Flame cx={160} base={168} sz={95} />
          {[0,1,2,3,4,5,6,7].map(i => (
            <circle key={i} cx={160 + Math.cos(i * 0.8) * 38} cy={128 + Math.sin(i * 0.8) * 34} r="4" fill="#fde047">
              <animate attributeName="cx" from={160+Math.cos(i*0.8)*10} to={160+Math.cos(i*0.8)*70} dur={`${0.38+i*0.07}s`} repeatCount="indefinite" />
              <animate attributeName="cy" from={128+Math.sin(i*0.8)*10} to={128+Math.sin(i*0.8)*56} dur={`${0.38+i*0.07}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur={`${0.38+i*0.07}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <StatusText text="⚡ ~3500°C — Intense heat and sparks!" color="#fde047" />
        </>}
        {stage === 2 && <>
          <rect x="100" y="76" width="120" height="68" rx="6" fill="rgba(99,102,241,0.4)" />
          <text x="160" y="112" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="900" fill="#c7d2fe">Al₂O₃ slag</text>
          <ellipse cx="160" cy="168" rx="62" ry="22" fill="#f97316" opacity="0.85">
            <animate attributeName="opacity" values="0.85;0.6;0.85" dur="1s" repeatCount="indefinite" />
          </ellipse>
          <text x="160" y="169" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="800" fill="white">Molten Fe</text>
          <StatusText text="✓ Molten iron formed — used to weld railway tracks!" color="#22c55e" />
        </>}
        {stage === 0 && <StatusText text="Fe₂O₃ + Al mixture ready — ignite to react" />}
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={ignite} disabled={stage !== 0} color="#ef4444">🔥 Ignite Thermite</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function MetalReactivitySim() {
  const metals = [
    { name: "K",  label: "Potassium", color: "#a855f7", w: 200, note: "Explodes in water" },
    { name: "Na", label: "Sodium",    color: "#8b5cf6", w: 176, note: "Burns in water" },
    { name: "Mg", label: "Magnesium", color: "#6366f1", w: 148, note: "Reacts with steam" },
    { name: "Zn", label: "Zinc",      color: "#3b82f6", w: 118, note: "Displaces from acid" },
    { name: "Fe", label: "Iron",      color: "#0ea5e9", w: 96,  note: "Rusts slowly" },
    { name: "H",  label: "Hydrogen",  color: "#22c55e", w: 74,  note: "Reference point" },
    { name: "Cu", label: "Copper",    color: "#ea580c", w: 52,  note: "No acid reaction" },
    { name: "Au", label: "Gold",      color: "#fbbf24", w: 28,  note: "Least reactive" },
  ];

  return (
    <SimContainer hint="The reactivity series ranks metals. Metals above H displace H₂ from acids. More reactive metals displace less reactive ones from their salt solutions.">
      <svg viewBox="0 0 320 220" className={BG}>
        <text x="160" y="18" textAnchor="middle" fontSize="12" fontWeight="900" fill="#e2e8f0">Metal Reactivity Series</text>
        <text x="24" y="35" fontSize="9" fontWeight="700" fill="#f97316">MORE ↓</text>
        <line x1="26" y1="40" x2="26" y2="205" stroke="#334155" strokeWidth="2" />
        {metals.map((m, i) => (
          <g key={m.name}>
            <rect x="40" y={32 + i * 23} width={m.w} height="17" rx="4" fill={m.color} opacity="0.82" />
            <text x="50" y={43 + i * 23} fontSize="10" fontWeight="900" fill="white">{m.name}</text>
            <text x={48 + m.w} y={43 + i * 23} fontSize="8.5" fill="#94a3b8"> {m.label} — {m.note}</text>
          </g>
        ))}
        <text x="24" y="212" fontSize="9" fontWeight="700" fill="#22c55e">LESS</text>
      </svg>
    </SimContainer>
  );
}

/* ═══════════════════════════════════════════════════════
   CHAPTER 4: CARBON AND ITS COMPOUNDS
═══════════════════════════════════════════════════════ */

export function MethaneCombustionSim() {
  const [on, setOn] = useState(false);
  const [molView, setMolView] = useState(false);

  return (
    <SimContainer hint="Methane (CH₄) undergoes complete combustion in excess O₂ producing CO₂ and H₂O. The flame is blue — a characteristic of gaseous hydrocarbon combustion.">
      <Eq>CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g) + Heat</Eq>
      <EnergyBar pct={on ? 80 : 0} isExo />
      <svg viewBox={VB} className={BG}>
        {!molView ? <>
          <rect x="133" y="152" width="54" height="32" rx="6" fill="#334155" />
          <rect x="148" y="134" width="24" height="22" rx="4" fill="#475569" />
          {on && <>
            <ellipse cx="160" cy="116" rx="23" ry="29" fill="#60a5fa" opacity="0.72">
              <animate attributeName="ry" values="29;37;29" dur="0.4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="160" cy="108" rx="14" ry="19" fill="#93c5fd" opacity="0.8">
              <animate attributeName="ry" values="19;25;19" dur="0.35s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="160" cy="102" rx="6" ry="9" fill="white" opacity="0.75" />
            <Steam cx={160} y={86} active />
            <text x="224" y="82" fontSize="9" fill="#93c5fd" fontWeight="700">CO₂+H₂O↑</text>
          </>}
          {!on && <text x="160" y="128" textAnchor="middle" fontSize="10" fill="#94a3b8">Ignite gas</text>}
          <StatusText text={on ? "Complete combustion — blue flame" : "Ready"} color={on ? "#93c5fd" : "#94a3b8"} />
        </> : <>
          {/* Molecular view */}
          <text x="160" y="18" textAnchor="middle" fontSize="10" fontWeight="800" fill="#94a3b8">Molecular View — Products</text>
          <Atom cx={50} cy={78} el="C" color="#475569" />
          {[[32,58],[32,98],[68,58],[68,98]].map(([bx,by],i) => <><Bond key={`b${i}`} x1={50} y1={78} x2={bx} y2={by} /><Atom cx={bx} cy={by} el="H" color="#3b82f6" r={10} /></>)}
          <text x="50" y="118" textAnchor="middle" fontSize="9" fill="#94a3b8">CH₄</text>
          <text x="103" y="80" textAnchor="middle" fontSize="14" fill="#64748b">+2O₂→</text>
          <Atom cx={170} cy={78} el="C" color="#475569" />
          <Atom cx={148} cy={78} el="O" color="#ef4444" /><Bond x1={148} y1={78} x2={170} y2={78} double />
          <Atom cx={192} cy={78} el="O" color="#ef4444" /><Bond x1={170} y1={78} x2={192} y2={78} double />
          <text x="170" y="100" textAnchor="middle" fontSize="9" fill="#94a3b8">CO₂</text>
          <text x="220" y="80" textAnchor="middle" fontSize="13" fill="#64748b">+</text>
          <Atom cx={260} cy={72} el="O" color="#ef4444" />
          <Atom cx={244} cy={88} el="H" color="#3b82f6" r={10} /><Bond x1={260} y1={72} x2={244} y2={88} />
          <Atom cx={276} cy={88} el="H" color="#3b82f6" r={10} /><Bond x1={260} y1={72} x2={276} y2={88} />
          <text x="260" y="108" textAnchor="middle" fontSize="9" fill="#94a3b8">H₂O</text>
        </>}
      </svg>
      <div className="flex gap-2 flex-wrap">
        <SimButton onClick={() => setOn(o => !o)} color={on ? "#ef4444" : "#3b82f6"}>{on ? "🔵 Off" : "🔥 Ignite"}</SimButton>
        <SimButton onClick={() => setMolView(m => !m)} color="#6366f1">{molView ? "🔭 Macro" : "⚗️ Molecular"}</SimButton>
        <SimResetButton onClick={() => { setOn(false); setMolView(false); }} />
      </div>
    </SimContainer>
  );
}

export function HydrogenationSim() {
  const [stage, setStage] = useState<0|1|2>(0);

  return (
    <SimContainer hint="Hydrogenation adds H₂ across the C=C double bond (unsaturated → saturated). Used industrially to convert vegetable oils into vanaspati ghee. Ni catalyst at 150°C.">
      <Eq>C₂H₄ + H₂ ⟶(Ni, 150°C) C₂H₆</Eq>
      <svg viewBox={VB} className={BG}>
        <text x="160" y="18" textAnchor="middle" fontSize="10" fontWeight="800" fill="#94a3b8">
          {["Ethene — C=C double bond (unsaturated)","Adding H₂ across C=C...","Ethane — C−C single bond (saturated) ✓"][stage]}
        </text>
        {/* Carbon atoms */}
        <Atom cx={108} cy={102} el="C" color="#475569" />
        <Atom cx={172} cy={102} el="C" color="#475569" />
        <Bond x1={108} y1={102} x2={172} y2={102} double={stage < 2} />
        {stage === 2 && <Bond x1={108} y1={102} x2={172} y2={102} />}
        {/* Existing H atoms */}
        {[[80,80],[80,124],[200,80],[200,124]].map(([bx,by],i) => (
          <g key={i}>
            <Bond x1={i < 2 ? 108 : 172} y1={102} x2={bx} y2={by} />
            <Atom cx={bx} cy={by} el="H" color="#3b82f6" r={10} />
          </g>
        ))}
        {/* New H atoms from H₂ */}
        {stage === 1 && <>
          <g>
            <circle cx={108} cy={56} r={10} fill="#22c55e">
              <animate attributeName="cy" from="28" to="76" dur="0.7s" fill="freeze" />
            </circle>
            <text x={108} y={56} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900" fill="white">H</text>
          </g>
          <g>
            <circle cx={172} cy={56} r={10} fill="#22c55e">
              <animate attributeName="cy" from="28" to="128" dur="0.7s" fill="freeze" />
            </circle>
            <text x={172} y={56} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900" fill="white">H</text>
          </g>
          <Bond x1={108} y1={56} x2={172} y2={56} />
          <text x="140" y="40" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="800">H₂ (Ni catalyst)</text>
        </>}
        {stage === 2 && <>
          <Bond x1={108} y1={102} x2={108} y2={64} />
          <Atom cx={108} cy={64} el="H" color="#22c55e" r={10} />
          <Bond x1={172} y1={102} x2={172} y2={140} />
          <Atom cx={172} cy={140} el="H" color="#22c55e" r={10} />
          <text x="140" y="170" textAnchor="middle" fontSize="10" fontWeight="900" fill="#22c55e">Saturated — no more addition reactions</text>
        </>}
        <StatusText text={["Click to add H₂","H₂ breaking into double bond...","Ethene → Ethane: fully saturated"][stage]} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={() => setStage(s => Math.min(2, s + 1) as 0|1|2)} disabled={stage >= 2} color="#22c55e">
          {stage === 0 ? "➕ Add H₂" : stage === 1 ? "⚡ React" : "✓ Done"}
        </SimButton>
        <SimResetButton onClick={() => setStage(0)} />
      </div>
    </SimContainer>
  );
}

export function EthanolNaSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const add = () => { setStage(1); setTimeout(() => setStage(2), 2200); };
  const reset = () => setStage(0);

  return (
    <SimContainer hint="Sodium reacts with ethanol to produce sodium ethoxide and H₂ gas. Slower than Na + water — ethanol is a weaker acid. Shows that OH group in alcohols is different from water.">
      <Eq>2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂(g)↑</Eq>
      <svg viewBox={VB} className={BG}>
        <Beaker x={80} y={58} w={160} h={122} pct={72} color="rgba(254,243,199,0.55)" label="Ethanol (C₂H₅OH)" />
        {stage === 0 && <text x="160" y="204" textAnchor="middle" fontSize="10" fill="#94a3b8">Add sodium to ethanol</text>}
        {stage >= 1 && <>
          <circle cx="160" cy="104" r="13" fill="#c0c0c0" stroke="#e2e8f0" strokeWidth="1.5" />
          <Bubbles cx={160} cy={88} n={5} color="rgba(209,250,229,0.85)" rise={48} />
          <text x="160" y="38" textAnchor="middle" fontSize="10" fontWeight="800" fill="#6ee7b7">H₂ gas ↑ (steady, not violent)</text>
        </>}
        {stage === 2 && <StatusText text="✓ C₂H₅ONa + H₂ — slower than Na + water" color="#22c55e" />}
        {stage < 2 && <StatusText text={stage === 0 ? "Add sodium to begin" : "Reacting steadily..."} />}
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={add} disabled={stage !== 0} color="#94a3b8">⬛ Add Na</SimButton>
        <SimResetButton onClick={reset} />
      </div>
      <div className="mt-2 px-3 py-2 rounded-xl text-xs font-medium liquid-inner text-foreground">
        💡 <strong>Compare:</strong> Na + H₂O is violent. Na + C₂H₅OH is slower — ethanol is a weaker acid than water.
      </div>
    </SimContainer>
  );
}

export function EsterificationSim() {
  const [stage, setStage] = useState<0|1|2>(0);
  const [heat, setHeat] = useState(false);
  const startHeat = () => {
    setHeat(true);
    setTimeout(() => setStage(1), 2000);
    setTimeout(() => { setStage(2); setHeat(false); }, 4000);
  };
  const reset = () => { setStage(0); setHeat(false); };
  const flaskColor = stage === 0 ? "rgba(254,249,195,0.4)" : stage === 1 ? "rgba(251,191,36,0.3)" : "rgba(134,239,172,0.4)";

  return (
    <SimContainer hint="Esterification: carboxylic acid + alcohol (H₂SO₄ catalyst, heat) → ester + water. Esters have characteristic fruity smells. This is a reversible reaction.">
      <Eq>C₂H₅OH + CH₃COOH ⇌(H₂SO₄,heat) CH₃COOC₂H₅ + H₂O</Eq>
      <svg viewBox={VB} className={BG}>
        <path d="M 138 58 L 138 122 Q 116 162 96 178 L 224 178 Q 204 162 182 122 L 182 58 Z"
          fill={flaskColor} stroke="rgba(148,163,184,0.6)" strokeWidth="2" style={{ transition: "fill 1s ease" }} />
        <rect x="133" y="38" width="54" height="24" rx="5" fill="rgba(100,116,139,0.5)" stroke="rgba(148,163,184,0.5)" strokeWidth="2" />
        <text x="160" y="51" textAnchor="middle" fontSize="9" fontWeight="800" fill="#e2e8f0">
          {stage === 0 ? "EtOH + CH₃COOH" : stage === 1 ? "Esterifying..." : "Ester formed!"}
        </text>
        <text x="160" y="135" textAnchor="middle" fontSize="9" fill="#94a3b8">H₂SO₄ catalyst</text>
        {heat && <Steam cx={160} y={40} active />}
        {stage === 2 && <>
          <text x="160" y="108" textAnchor="middle" fontSize="30">🍑</text>
          <text x="160" y="168" textAnchor="middle" fontSize="11" fontWeight="900" fill="#22c55e">Fruity smell — Ester!</text>
        </>}
        <Burner cx={160} base={202} on={heat} />
        <StatusText text={["Ready — heat the mixture","Heating with H₂SO₄ catalyst...","✓ Ethyl ethanoate (fruity ester)"][stage]}
          color={stage === 2 ? "#22c55e" : "#94a3b8"} />
      </svg>
      <div className="flex gap-2">
        <SimButton onClick={startHeat} disabled={heat || stage > 0} color="#ef4444">🔥 Heat + Catalyst</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}

export function SoapHardWaterSim() {
  const [waterType, setWaterType] = useState<"soft"|"hard">("soft");
  const [stage, setStage] = useState<0|1|2>(0);
  const shake = () => { setStage(1); setTimeout(() => setStage(2), 1800); };
  const reset = () => setStage(0);
  const isHard = waterType === "hard";

  return (
    <SimContainer hint="Soap lathers easily in soft water. Hard water (Ca²⁺/Mg²⁺ ions) reacts with soap to form an insoluble scum — no lather. This is why hard water wastes soap.">
      <Eq>2RCOONa + CaCl₂ → (RCOO)₂Ca↓ (scum) + 2NaCl</Eq>
      <svg viewBox={VB} className={BG}>
        <Beaker x={80} y={52} w={160} h={132} pct={76}
          color={isHard ? "rgba(254,249,195,0.45)" : "rgba(186,230,253,0.5)"}
          label={isHard ? "Hard Water (Ca²⁺/Mg²⁺)" : "Soft Water"} />
        {!isHard && stage >= 2 && <>
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={94 + i * 12} cy={66 - (i % 3) * 8} r={5 + (i % 3) * 2}
              fill="rgba(255,255,255,0.72)" stroke="rgba(147,197,253,0.5)" strokeWidth="1" />
          ))}
          <text x="160" y="44" textAnchor="middle" fontSize="11" fontWeight="900" fill="#22c55e">✓ Good lather — cleans well!</text>
        </>}
        {isHard && stage >= 2 && <>
          <Precip cx={160} y={178} w={136} color="#d4a259" active />
          <text x="160" y="44" textAnchor="middle" fontSize="11" fontWeight="900" fill="#f97316">✗ Scum formed — no lather!</text>
        </>}
        {stage === 1 && <text x="160" y="44" textAnchor="middle" fontSize="10" fill="#94a3b8">Shaking...</text>}
        <StatusText text={stage === 0 ? "Add soap and shake" : stage === 1 ? "Mixing..." : isHard ? "Scum = wasted soap" : "Clean lather!"} />
      </svg>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {(["soft","hard"] as const).map(w => (
          <button key={w} onClick={() => { setWaterType(w); setStage(0); }}
            className={`py-2 rounded-xl text-xs font-black transition-all ${waterType === w ? "text-white shadow" : "bg-white/10 text-gray-300"}`}
            style={waterType === w ? { background: w === "soft" ? "#3b82f6" : "#f59e0b" } : {}}>
            {w === "soft" ? "💧 Soft Water" : "🪨 Hard Water"}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <SimButton onClick={shake} disabled={stage !== 0} color="#da6b45">🧴 Add Soap & Shake</SimButton>
        <SimResetButton onClick={reset} />
      </div>
    </SimContainer>
  );
}
