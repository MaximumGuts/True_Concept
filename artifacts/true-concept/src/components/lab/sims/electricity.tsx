import { useState } from "react";
import { SimSlider, SimNumber, SimContainer, SimGraph, SimButton } from "../sim-ui";
import { Plus, Minus } from "lucide-react";

/* 16. Ohm's Law */
export function OhmsLawSim() {
  const [V, setV] = useState(6);
  const [R, setR] = useState(3);
  const I = V / R;
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const record = () => setPts((p) => [...p.slice(-30), { x: V, y: I }].sort((a, b) => a.x - b.x));
  return (
    <SimContainer
      onReset={() => setPts([])}
      hint="V = IR. Current rises linearly with voltage when R is constant."
      controls={<SimButton onClick={record} color="#10b981">Record point</SimButton>}
    >
      <SimSlider label="Voltage" value={V} onChange={setV} min={0} max={12} step={0.5} unit=" V" color="#3b82f6" />
      <SimSlider label="Resistance" value={R} onChange={setR} min={1} max={10} step={1} unit=" Ω" color="#f59e0b" />
      <svg viewBox="0 0 280 120" className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
        {/* battery */}
        <rect x="20" y="50" width="30" height="20" fill="#f59e0b" stroke="#374151" strokeWidth="1.5" />
        <text x="22" y="64" fontSize="11" fill="white" fontWeight="900">{V}V</text>
        {/* wires */}
        <line x1="50" y1="60" x2="100" y2="60" stroke="#374151" strokeWidth="2" />
        <line x1="100" y1="60" x2="100" y2="30" stroke="#374151" strokeWidth="2" />
        <line x1="100" y1="30" x2="180" y2="30" stroke="#374151" strokeWidth="2" />
        <line x1="220" y1="30" x2="260" y2="30" stroke="#374151" strokeWidth="2" />
        <line x1="260" y1="30" x2="260" y2="60" stroke="#374151" strokeWidth="2" />
        <line x1="260" y1="60" x2="20" y2="60" stroke="#374151" strokeWidth="2" />
        {/* resistor */}
        <rect x="180" y="22" width="40" height="16" fill="#fef3c7" stroke="#374151" strokeWidth="1.5" />
        <text x="186" y="34" fontSize="10" fill="#374151" fontWeight="700">{R}Ω</text>
        {/* ammeter */}
        <circle cx="140" cy="60" r="14" fill="#fefce8" stroke="#374151" strokeWidth="1.5" />
        <text x="133" y="64" fontSize="10" fill="#374151" fontWeight="900">A</text>
        {/* current arrow */}
        <text x="120" y="22" fontSize="10" fill="#dc2626" fontWeight="900">→ I = {I.toFixed(2)}A</text>
      </svg>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <SimNumber label="V" value={V} unit="V" color="#3b82f6" precision={1} />
        <SimNumber label="I" value={I} unit="A" color="#dc2626" precision={2} />
        <SimNumber label="R" value={R} unit="Ω" color="#f59e0b" precision={0} />
      </div>
      {pts.length > 1 && <div className="mt-3"><SimGraph points={pts} xMax={12} yMax={Math.max(2, Math.max(...pts.map((p) => p.y)) * 1.2)} xLabel="V (V)" yLabel="I (A)" color="#10b981" /></div>}
    </SimContainer>
  );
}

/* 17. Series Circuit */
export function SeriesCircuitSim() {
  const [R, setR] = useState<number[]>([5, 10, 15]);
  const total = R.reduce((s, r) => s + r, 0);
  const V = 12;
  const I = V / total;
  return (
    <SimContainer
      onReset={() => setR([5, 10, 15])}
      hint="In series: R_total = R₁+R₂+R₃... Same current flows through every resistor."
      controls={
        <div className="flex gap-1.5">
          <button onClick={() => R.length < 6 && setR([...R, 5])} className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center"><Plus className="w-4 h-4" /></button>
          <button onClick={() => R.length > 1 && setR(R.slice(0, -1))} className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center"><Minus className="w-4 h-4" /></button>
        </div>
      }
    >
      <div className="space-y-2">
        {R.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-600 w-8">R{i + 1}</span>
            <input type="range" min={1} max={20} value={r} onChange={(e) => setR(R.map((x, j) => j === i ? Number(e.target.value) : x))} className="flex-1" />
            <span className="text-xs font-black text-amber-700 w-10 text-right">{r} Ω</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 320 80" className="w-full bg-amber-50 rounded-xl mt-3">
        <line x1="10" y1="40" x2="40" y2="40" stroke="#374151" strokeWidth="2" />
        <text x="14" y="32" fontSize="10" fill="#374151" fontWeight="700">{V}V</text>
        {R.map((r, i) => {
          const x = 40 + i * (250 / R.length);
          const w = (250 / R.length) - 12;
          return (
            <g key={i}>
              <rect x={x} y="32" width={w} height="16" fill="#fef3c7" stroke="#374151" strokeWidth="1.5" />
              <text x={x + 4} y="44" fontSize="9" fill="#374151" fontWeight="700">{r}Ω</text>
              {i < R.length - 1 && <line x1={x + w} y1="40" x2={40 + (i + 1) * (250 / R.length)} y2="40" stroke="#374151" strokeWidth="2" />}
            </g>
          );
        })}
        <line x1={290} y1="40" x2="310" y2="40" stroke="#374151" strokeWidth="2" />
      </svg>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Total R" value={total} unit="Ω" color="#f59e0b" precision={0} />
        <SimNumber label="Current I" value={I} unit="A" color="#dc2626" />
      </div>
    </SimContainer>
  );
}

/* 18. Parallel Circuit */
export function ParallelCircuitSim() {
  const [R, setR] = useState<number[]>([4, 6, 12]);
  const inv = R.reduce((s, r) => s + 1 / r, 0);
  const total = inv > 0 ? 1 / inv : 0;
  const V = 12;
  const Itot = V / total;
  return (
    <SimContainer
      onReset={() => setR([4, 6, 12])}
      hint="In parallel: 1/R_total = 1/R₁+1/R₂... Voltage is same across each branch."
      controls={
        <div className="flex gap-1.5">
          <button onClick={() => R.length < 5 && setR([...R, 6])} className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center"><Plus className="w-4 h-4" /></button>
          <button onClick={() => R.length > 2 && setR(R.slice(0, -1))} className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center"><Minus className="w-4 h-4" /></button>
        </div>
      }
    >
      <div className="space-y-2">
        {R.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-600 w-8">R{i + 1}</span>
            <input type="range" min={1} max={20} value={r} onChange={(e) => setR(R.map((x, j) => j === i ? Number(e.target.value) : x))} className="flex-1" />
            <span className="text-xs font-black text-amber-700 w-10 text-right">{r} Ω</span>
            <span className="text-xs font-black text-rose-700 w-14 text-right">{(V / r).toFixed(2)}A</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Total R" value={total} unit="Ω" color="#f59e0b" />
        <SimNumber label="Total I" value={Itot} unit="A" color="#dc2626" />
      </div>
    </SimContainer>
  );
}

/* 19. Heating Effect of Current */
export function HeatingEffectSim() {
  const [I, setI] = useState(2);
  const [R, setR] = useState(5);
  const [t, setT] = useState(60);
  const Q = I * I * R * t;
  const tempK = Math.min(255, 30 + Q / 200);
  const glow = `rgba(${Math.min(255, tempK)},${Math.max(0, 255 - tempK)},0,1)`;
  return (
    <SimContainer hint="Joule's Law: Heat H = I²Rt. Doubling current quadruples heat produced.">
      <SimSlider label="Current" value={I} onChange={setI} min={0.5} max={6} step={0.5} unit=" A" color="#dc2626" />
      <SimSlider label="Resistance" value={R} onChange={setR} min={1} max={20} step={1} unit=" Ω" color="#f59e0b" />
      <SimSlider label="Time" value={t} onChange={setT} min={10} max={300} step={10} unit=" s" color="#3b82f6" />
      <div className="my-3 flex items-center justify-center bg-gray-900 rounded-xl py-6">
        <div className="h-3 w-48 rounded-full transition-colors" style={{ background: glow, boxShadow: `0 0 ${Math.min(40, tempK / 8)}px ${glow}` }} />
      </div>
      <SimNumber label="Heat Produced" value={Q} unit="J" color="#dc2626" precision={0} />
    </SimContainer>
  );
}
