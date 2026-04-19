import { useState } from "react";
import { SimSlider, SimNumber, SimContainer } from "../sim-ui";

/* 5. Universal Law of Gravitation */
export function GravitationSim() {
  const G = 6.674e-11;
  const [m1, setM1] = useState(5e10);
  const [m2, setM2] = useState(5e10);
  const [r, setR] = useState(10);
  const F = (G * m1 * m2) / (r * r);
  return (
    <SimContainer hint="F = G·m₁·m₂ / r². Doubling the distance reduces force by ¼.">
      <SimSlider label="Mass m₁ (×10¹⁰ kg)" value={m1 / 1e10} onChange={(v) => setM1(v * 1e10)} min={1} max={100} step={1} color="#7c3aed" />
      <SimSlider label="Mass m₂ (×10¹⁰ kg)" value={m2 / 1e10} onChange={(v) => setM2(v * 1e10)} min={1} max={100} step={1} color="#a855f7" />
      <SimSlider label="Distance r" value={r} onChange={setR} min={1} max={50} step={1} unit=" m" color="#0ea5e9" />
      <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl h-24 mt-3 mb-3 flex items-center justify-between px-4 overflow-hidden">
        <div className="rounded-full shadow-lg flex items-center justify-center" style={{
          width: 20 + (m1 / 1e10) * 0.3, height: 20 + (m1 / 1e10) * 0.3,
          background: "radial-gradient(circle at 30% 30%,#a78bfa,#6d28d9)"
        }} />
        <div className="flex-1 mx-3 relative">
          <div className="h-0.5 bg-gradient-to-r from-purple-400 via-orange-400 to-purple-400 relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black text-orange-600">F</span>
          </div>
          <div className="text-center text-xs font-black text-gray-500 mt-2">r = {r} m</div>
        </div>
        <div className="rounded-full shadow-lg flex items-center justify-center" style={{
          width: 20 + (m2 / 1e10) * 0.3, height: 20 + (m2 / 1e10) * 0.3,
          background: "radial-gradient(circle at 30% 30%,#c4b5fd,#7c3aed)"
        }} />
      </div>
      <SimNumber label="Gravitational Force" value={F} unit="N" color="#f97316" precision={4} />
    </SimContainer>
  );
}

/* 6. Archimedes Principle */
export function ArchimedesSim() {
  const [submerged, setSubmerged] = useState(0);
  const [vol, setVol] = useState(1000); // cm^3
  const rho = 1; // g/cm^3 water
  const g = 9.8;
  const submergedVol = (submerged / 100) * vol;
  const Fb = (submergedVol * rho * g) / 1000; // in N (mass in kg)
  const waterRise = (submergedVol / 5000) * 100;

  return (
    <SimContainer
      onReset={() => setSubmerged(0)}
      hint="Buoyant force = weight of displaced fluid. Drag the slider to dip the object into water."
    >
      <SimSlider label="Object Volume" value={vol} onChange={setVol} min={200} max={3000} step={100} unit=" cm³" color="#0891b2" />
      <SimSlider label="Submerged %" value={submerged} onChange={setSubmerged} min={0} max={100} step={5} unit="%" color="#0ea5e9" />
      <div className="relative h-44 bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl mt-3 mb-3 overflow-hidden border-2 border-amber-200">
        {/* water */}
        <div className="absolute inset-x-0 bottom-0 transition-all" style={{ height: `${50 + waterRise * 0.4}%`, background: "linear-gradient(to bottom, rgba(14,165,233,0.6), rgba(2,132,199,0.85))" }}>
          <div className="absolute top-0 inset-x-0 h-1 bg-cyan-300 opacity-70" />
        </div>
        {/* cube */}
        <div className="absolute left-1/2 -translate-x-1/2 rounded-md shadow-xl transition-all flex items-center justify-center text-xl"
          style={{
            width: 50, height: 50,
            top: `${20 + submerged * 0.3}%`,
            background: "linear-gradient(135deg,#f59e0b,#d97706)"
          }}>📦</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SimNumber label="Volume Displaced" value={submergedVol} unit="cm³" color="#0891b2" precision={0} />
        <SimNumber label="Buoyant Force" value={Fb} unit="N" color="#0ea5e9" />
      </div>
    </SimContainer>
  );
}

/* 7. Density Determination */
export function DensitySim() {
  const [m, setM] = useState(50);
  const [v, setV] = useState(20);
  const d = v > 0 ? m / v : 0;
  const verdict = d > 1.05 ? "Sinks 🪨" : d < 0.95 ? "Floats 🪵" : "Neutral 🌊";
  return (
    <SimContainer hint="Density ρ = mass / volume. Objects with ρ > 1 g/cm³ sink in water.">
      <SimSlider label="Mass" value={m} onChange={setM} min={5} max={200} step={5} unit=" g" color="#7c3aed" />
      <SimSlider label="Volume Displaced" value={v} onChange={setV} min={5} max={200} step={5} unit=" cm³" color="#0ea5e9" />
      <div className="text-center mt-3 mb-3">
        <div className="inline-block liquid-card rounded-2xl px-6 py-4">
          <div className="text-xs font-black text-gray-500 uppercase mb-1">Result</div>
          <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{d.toFixed(2)} g/cm³</div>
          <div className="text-sm font-black mt-1 text-gray-700">{verdict}</div>
        </div>
      </div>
    </SimContainer>
  );
}
