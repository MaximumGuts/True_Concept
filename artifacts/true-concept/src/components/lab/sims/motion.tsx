import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { SimSlider, SimNumber, SimContainer, SimGraph, SimButton, useRafLoop, ObservationTable, StepMode } from "../sim-ui";

/* 1. Distance–Time Graph */
export function DistanceTimeSim() {
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
      hint="Higher speed → steeper distance–time line. A straight line means uniform motion."
      controls={<SimButton onClick={() => setRunning((r) => !r)} icon={running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}>{running ? "Pause" : "Start"}</SimButton>}
    >
      <SimSlider label="Speed" value={speed} onChange={setSpeed} min={0} max={5} step={0.5} unit=" m/s" color="#3b82f6" />
      <div className="relative bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl h-16 mb-3 overflow-hidden">
        <div className="absolute inset-y-0 flex items-center transition-transform" style={{ transform: `translateX(${(d / 50) * 100}%)` }}>
          <div className="w-10 h-10 ml-1 rounded-full shadow-lg flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}>🚗</div>
        </div>
      </div>
      <SimGraph points={pts} xMax={10} yMax={50} xLabel="time (s)" yLabel="distance (m)" color="#3b82f6" />
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Time" value={t} unit="s" color="#3b82f6" />
        <SimNumber label="Distance" value={d} unit="m" color="#3b82f6" />
      </div>
      <div className="mt-3"><ObservationTable columns={["Speed (m/s)", "Time (s)", "Distance (m)"]} rows={3} /></div>
    </SimContainer>
  );
}

/* 2. Velocity–Time Graph */
export function VelocityTimeSim() {
  const [a, setA] = useState(1);
  const [running, setRunning] = useState(false);
  const [v, setV] = useState(0); const [t, setT] = useState(0);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([{ x: 0, y: 0 }]);
  const tRef = useRef(0); const vRef = useRef(0);

  useRafLoop(running, (dt) => {
    tRef.current = Math.min(10, tRef.current + dt);
    vRef.current = Math.min(20, Math.max(-20, vRef.current + a * dt));
    setT(tRef.current); setV(vRef.current);
    setPts((p) => [...p.slice(-200), { x: tRef.current, y: Math.abs(vRef.current) }]);
    if (tRef.current >= 10) setRunning(false);
  });
  const reset = () => { tRef.current = 0; vRef.current = 0; setT(0); setV(0); setPts([{ x: 0, y: 0 }]); setRunning(false); };

  return (
    <SimContainer
      onReset={reset}
      hint="A straight inclined line on a v-t graph means constant acceleration. Slope = acceleration."
      controls={<SimButton onClick={() => setRunning((r) => !r)} color="#10b981" icon={running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}>{running ? "Pause" : "Start"}</SimButton>}
    >
      <SimSlider label="Acceleration" value={a} onChange={setA} min={-2} max={2} step={0.25} unit=" m/s²" color="#10b981" />
      <SimGraph points={pts} xMax={10} yMax={20} xLabel="time (s)" yLabel="velocity (m/s)" color="#10b981" />
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Time" value={t} unit="s" color="#10b981" />
        <SimNumber label="Velocity" value={v} unit="m/s" color="#10b981" />
      </div>
    </SimContainer>
  );
}

/* 3. Free Fall */
export function FreeFallSim() {
  const G = 9.8;
  const [h, setH] = useState(20);
  const [running, setRunning] = useState(false);
  const [y, setY] = useState(0); const [t, setT] = useState(0); const [v, setV] = useState(0);
  const tRef = useRef(0);

  useRafLoop(running, (dt) => {
    tRef.current += dt;
    const fall = 0.5 * G * tRef.current * tRef.current;
    if (fall >= h) { setY(h); setV(Math.sqrt(2 * G * h)); setT(Math.sqrt((2 * h) / G)); setRunning(false); return; }
    setY(fall); setV(G * tRef.current); setT(tRef.current);
  });
  const reset = () => { tRef.current = 0; setY(0); setT(0); setV(0); setRunning(false); };

  return (
    <SimContainer
      onReset={reset}
      hint="All objects fall with the same acceleration g = 9.8 m/s² (ignoring air resistance)."
      controls={<SimButton onClick={() => setRunning(true)} color="#7c3aed" disabled={running || y >= h} icon={<Play className="w-3.5 h-3.5" />}>Drop</SimButton>}
    >
      <SimSlider label="Height" value={h} onChange={(v) => { setH(v); reset(); }} min={5} max={80} step={1} unit=" m" color="#7c3aed" />
      <div className="relative bg-gradient-to-b from-sky-100 to-amber-50 rounded-xl mb-3 overflow-hidden mx-auto" style={{ height: 180, width: 100 }}>
        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-lg transition-all" style={{ top: `${(y / h) * 80}%`, background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>⚽</div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-emerald-600 to-emerald-400" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <SimNumber label="Fallen" value={y} unit="m" color="#7c3aed" />
        <SimNumber label="Time" value={t} unit="s" color="#7c3aed" />
        <SimNumber label="Velocity" value={v} unit="m/s" color="#7c3aed" />
      </div>
      <div className="mt-3 liquid-card rounded-xl p-3 text-xs font-medium text-gray-700">
        <strong>Formula:</strong> v² = 2gh, t = √(2h/g)
      </div>
    </SimContainer>
  );
}

/* 4. Motion with Constant Acceleration */
export function MotionAccelSim() {
  const [u, setU] = useState(5);
  const [a, setA] = useState(2);
  const [t, setT] = useState(3);
  const s = u * t + 0.5 * a * t * t;
  const v = u + a * t;
  return (
    <SimContainer hint="Equations of motion: s = ut + ½at², v = u + at">
      <SimSlider label="Initial Velocity (u)" value={u} onChange={setU} min={0} max={20} step={1} unit=" m/s" color="#0ea5e9" />
      <SimSlider label="Acceleration (a)" value={a} onChange={setA} min={-3} max={5} step={0.5} unit=" m/s²" color="#f59e0b" />
      <SimSlider label="Time (t)" value={t} onChange={setT} min={0} max={10} step={0.5} unit=" s" color="#10b981" />
      <div className="relative bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl h-14 mt-3 mb-3 overflow-hidden">
        <div className="absolute inset-y-0 flex items-center transition-transform" style={{ transform: `translateX(${Math.min(95, Math.max(0, (s / 200) * 100))}%)` }}>
          <div className="w-9 h-9 ml-1 rounded-full shadow-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>🏃</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SimNumber label="Displacement (s)" value={s} unit="m" color="#0ea5e9" />
        <SimNumber label="Final Velocity (v)" value={v} unit="m/s" color="#f59e0b" />
      </div>
    </SimContainer>
  );
}

/* 8. Kinetic Energy */
export function KineticEnergySim() {
  const [m, setM] = useState(2);
  const [v, setV] = useState(5);
  const ke = 0.5 * m * v * v;
  const barH = Math.min(100, (ke / 200) * 100);
  return (
    <SimContainer hint="KE = ½mv². Doubling the velocity quadruples the kinetic energy.">
      <SimSlider label="Mass" value={m} onChange={setM} min={0.5} max={10} step={0.5} unit=" kg" color="#7c3aed" />
      <SimSlider label="Velocity" value={v} onChange={setV} min={0} max={20} step={1} unit=" m/s" color="#3b82f6" />
      <div className="flex items-end gap-3 h-32 mt-3 mb-3 justify-center">
        <div className="w-12 rounded-t-lg shadow-md transition-all" style={{ height: `${barH}%`, background: "linear-gradient(to top, #f97316, #fbbf24)" }} />
        <div className="text-center pb-2">
          <div className="text-3xl">{v > 10 ? "🏎️" : v > 4 ? "🚗" : "🚙"}</div>
          <div className="text-xs font-black text-gray-500 mt-1">{m} kg</div>
        </div>
      </div>
      <SimNumber label="Kinetic Energy" value={ke} unit="J" color="#f97316" />
    </SimContainer>
  );
}

/* 9. Potential Energy */
export function PotentialEnergySim() {
  const G = 9.8;
  const [m, setM] = useState(2);
  const [h, setH] = useState(10);
  const pe = m * G * h;
  return (
    <SimContainer hint="PE = mgh. Higher position or heavier mass means more potential energy.">
      <SimSlider label="Mass" value={m} onChange={setM} min={0.5} max={10} step={0.5} unit=" kg" color="#7c3aed" />
      <SimSlider label="Height" value={h} onChange={setH} min={0} max={50} step={1} unit=" m" color="#10b981" />
      <div className="relative bg-gradient-to-b from-sky-100 to-amber-100 rounded-xl mb-3 overflow-hidden mx-auto" style={{ height: 160, width: 90 }}>
        <div className="absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full shadow-lg flex items-center justify-center text-lg transition-all" style={{ top: `${(1 - h / 50) * 80}%`, background: "linear-gradient(135deg,#10b981,#059669)" }}>📦</div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-stone-700 to-stone-500" />
      </div>
      <SimNumber label="Potential Energy" value={pe} unit="J" color="#10b981" />
    </SimContainer>
  );
}

/* 10. Pendulum / Conservation of Energy */
export function PendulumSim() {
  const [running, setRunning] = useState(true);
  const [angle, setAngle] = useState(45);
  const aRef = useRef(0); const wRef = useRef(0);
  const [theta, setTheta] = useState(0);
  const L = 100; const g = 9.8;
  // KE/PE based on angular position
  const maxAngleRad = (angle * Math.PI) / 180;
  const h = L * (1 - Math.cos(theta));
  const hMax = L * (1 - Math.cos(maxAngleRad));
  const pePct = hMax > 0 ? (h / hMax) * 100 : 0;
  const kePct = 100 - pePct;

  useRafLoop(running, (dt) => {
    const aAcc = -(g / L) * Math.sin(aRef.current);
    wRef.current += aAcc * dt * 50;
    wRef.current *= 0.999;
    aRef.current += wRef.current * dt;
    if (Math.abs(aRef.current) > maxAngleRad && Math.sign(aRef.current) === Math.sign(wRef.current)) {
      aRef.current = Math.sign(aRef.current) * maxAngleRad;
      wRef.current = 0;
    }
    setTheta(aRef.current);
  });
  const reset = () => { aRef.current = maxAngleRad; wRef.current = 0; setTheta(maxAngleRad); };

  const px = 100 + L * Math.sin(theta);
  const py = 20 + L * Math.cos(theta);

  return (
    <SimContainer
      onReset={reset}
      hint="As the bob swings, KE ↔ PE constantly convert. Total energy stays the same (ignoring friction)."
      controls={<SimButton onClick={() => setRunning((r) => !r)} icon={running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}>{running ? "Pause" : "Resume"}</SimButton>}
    >
      <SimSlider label="Release Angle" value={angle} onChange={(v) => { setAngle(v); aRef.current = (v * Math.PI) / 180; wRef.current = 0; }} min={5} max={80} step={5} unit="°" color="#a855f7" />
      <svg viewBox="0 0 200 160" className="w-full bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl">
        <line x1="100" y1="20" x2={px} y2={py} stroke="#475569" strokeWidth="2" />
        <circle cx="100" cy="20" r="4" fill="#475569" />
        <circle cx={px} cy={py} r="10" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
      </svg>
      <div className="mt-3 space-y-2">
        <div>
          <div className="flex justify-between text-xs font-black mb-1"><span className="text-orange-700">KE</span><span className="text-orange-700">{kePct.toFixed(0)}%</span></div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden"><div className="h-full transition-all" style={{ width: `${kePct}%`, background: "linear-gradient(to right,#fb923c,#f97316)" }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-black mb-1"><span className="text-emerald-700">PE</span><span className="text-emerald-700">{pePct.toFixed(0)}%</span></div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden"><div className="h-full transition-all" style={{ width: `${pePct}%`, background: "linear-gradient(to right,#34d399,#10b981)" }} /></div>
        </div>
      </div>
      <StepMode steps={[
        { title: "Release", body: "At the highest point, the bob is at rest. All energy is potential (PE = max, KE = 0)." },
        { title: "Mid-swing", body: "At the lowest point, speed is maximum. PE is minimum, KE is maximum." },
        { title: "Other side", body: "The bob rises again, KE converts back to PE. Total energy stays constant." },
      ]} />
    </SimContainer>
  );
}
