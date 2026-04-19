import { useState } from "react";
import { SimSlider, SimNumber, SimContainer } from "../sim-ui";

/* 11. Laws of Reflection */
export function ReflectionSim() {
  const [angle, setAngle] = useState(30);
  const a = (angle * Math.PI) / 180;
  const x = Math.sin(a) * 80;
  const y = Math.cos(a) * 80;
  return (
    <SimContainer hint="Angle of incidence = angle of reflection. Both lie in the same plane as the normal.">
      <SimSlider label="Angle of Incidence" value={angle} onChange={setAngle} min={0} max={80} step={1} unit="°" color="#0ea5e9" />
      <svg viewBox="0 0 240 140" className="w-full bg-gradient-to-b from-sky-50 to-blue-50 rounded-xl">
        {/* mirror */}
        <line x1="20" y1="120" x2="220" y2="120" stroke="#475569" strokeWidth="3" />
        {[...Array(10)].map((_, i) => (
          <line key={i} x1={20 + i * 22} y1="120" x2={28 + i * 22} y2="130" stroke="#475569" strokeWidth="1" />
        ))}
        {/* normal */}
        <line x1="120" y1="20" x2="120" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        {/* incident */}
        <line x1={120 - x} y1={120 - y} x2="120" y2="120" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#ah1)" />
        {/* reflected */}
        <line x1="120" y1="120" x2={120 + x} y2={120 - y} stroke="#10b981" strokeWidth="2.5" markerEnd="url(#ah2)" />
        {/* angle arcs */}
        <path d={`M ${120 - 22 * Math.sin(a / 2 * 2) * 0} ${120 - 22} A 22 22 0 0 1 ${120 - 22 * Math.sin(a)} ${120 - 22 * Math.cos(a)}`} fill="none" stroke="#ef4444" strokeWidth="1.2" />
        <path d={`M ${120 + 22 * Math.sin(a)} ${120 - 22 * Math.cos(a)} A 22 22 0 0 1 120 ${120 - 22}`} fill="none" stroke="#10b981" strokeWidth="1.2" />
        <text x={120 - x / 2 - 5} y={120 - y / 2} fontSize="9" fill="#dc2626" fontWeight="700">i={angle}°</text>
        <text x={120 + x / 2 + 4} y={120 - y / 2} fontSize="9" fill="#059669" fontWeight="700">r={angle}°</text>
        <defs>
          <marker id="ah1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#ef4444" /></marker>
          <marker id="ah2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#10b981" /></marker>
        </defs>
      </svg>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Incidence" value={angle} unit="°" color="#ef4444" precision={0} />
        <SimNumber label="Reflection" value={angle} unit="°" color="#10b981" precision={0} />
      </div>
    </SimContainer>
  );
}

/* 12. Image Formation by Plane Mirror */
export function PlaneMirrorSim() {
  const [d, setD] = useState(40);
  return (
    <SimContainer hint="A plane mirror forms a virtual, upright image at the same distance behind the mirror.">
      <SimSlider label="Object Distance" value={d} onChange={setD} min={10} max={100} step={5} unit=" cm" color="#7c3aed" />
      <svg viewBox="0 0 280 140" className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        {/* mirror */}
        <line x1="140" y1="10" x2="140" y2="130" stroke="#475569" strokeWidth="3" />
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="140" y1={10 + i * 11} x2="148" y2={18 + i * 11} stroke="#475569" strokeWidth="1" />
        ))}
        {/* object */}
        <text x={140 - d * 1.1 - 10} y={80} fontSize="32">🚲</text>
        {/* image */}
        <text x={140 + d * 1.1 - 10} y={80} fontSize="32" opacity="0.6" transform={`scale(-1,1) translate(${-(140 + d * 1.1) * 2 + 20},0)`}>🚲</text>
        <text x={140 - d * 1.1 - 4} y={120} fontSize="9" fill="#7c3aed" fontWeight="700">{d} cm</text>
        <text x={140 + d * 1.1 - 4} y={120} fontSize="9" fill="#a855f7" fontWeight="700">{d} cm</text>
        <text x={140 - d * 1.1 - 4} y={20} fontSize="9" fill="#374151" fontWeight="700">Object</text>
        <text x={140 + d * 1.1 - 4} y={20} fontSize="9" fill="#9ca3af" fontWeight="700">Image (virtual)</text>
      </svg>
    </SimContainer>
  );
}

/* 13. Convex Lens Image Formation */
export function ConvexLensSim() {
  const [u, setU] = useState(30); // object distance (cm)
  const f = 15;
  // 1/v - 1/u = 1/f → v = uf/(u-f) (using sign convention with u positive to left)
  const v = (u * f) / (u - f);
  const m = -v / -u; // magnification (linear)
  const isReal = u > f;
  return (
    <SimContainer hint="Beyond 2F → image is real, inverted, smaller. Inside F → virtual, upright, larger.">
      <SimSlider label="Object Distance (u)" value={u} onChange={setU} min={5} max={60} step={1} unit=" cm" color="#7c3aed" />
      <svg viewBox="0 0 320 160" className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
        {/* axis */}
        <line x1="10" y1="80" x2="310" y2="80" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        {/* lens */}
        <ellipse cx="160" cy="80" rx="8" ry="55" fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth="2" />
        <text x="155" y="155" fontSize="9" fill="#6366f1" fontWeight="700">L</text>
        {/* focal points */}
        <circle cx={160 - f * 2} cy="80" r="3" fill="#374151" /><text x={160 - f * 2 - 6} y={95} fontSize="9" fill="#374151">F</text>
        <circle cx={160 + f * 2} cy="80" r="3" fill="#374151" /><text x={160 + f * 2 - 6} y={95} fontSize="9" fill="#374151">F'</text>
        {/* object arrow */}
        <line x1={160 - u * 2} y1="80" x2={160 - u * 2} y2="50" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#oa)" />
        <text x={160 - u * 2 - 8} y="45" fontSize="9" fill="#dc2626" fontWeight="700">O</text>
        {/* image arrow */}
        {isFinite(v) && Math.abs(v) < 200 && (
          <>
            <line x1={160 + v * 2} y1="80" x2={160 + v * 2} y2={isReal ? 80 + Math.min(50, Math.abs(m) * 30) : 80 - Math.min(50, Math.abs(m) * 30)} stroke="#10b981" strokeWidth="2.5" markerEnd="url(#ia)" />
            <text x={160 + v * 2 - 5} y={isReal ? 80 + Math.min(50, Math.abs(m) * 30) + 12 : 80 - Math.min(50, Math.abs(m) * 30) - 4} fontSize="9" fill="#10b981" fontWeight="700">I</text>
          </>
        )}
        <defs>
          <marker id="oa" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#dc2626" /></marker>
          <marker id="ia" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#10b981" /></marker>
        </defs>
      </svg>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Image dist (v)" value={v} unit="cm" color="#10b981" />
        <SimNumber label="Magnification" value={m} color="#f59e0b" />
      </div>
      <div className="mt-2 text-xs text-center font-black text-gray-700">
        {u <= f ? "Virtual, upright, magnified" : u < 2 * f ? "Real, inverted, magnified" : u === 2 * f ? "Real, inverted, same size" : "Real, inverted, diminished"}
      </div>
    </SimContainer>
  );
}

/* 14. Refraction Through Glass Slab */
export function RefractionSim() {
  const [angle, setAngle] = useState(40);
  const n1 = 1, n2 = 1.5;
  const i = (angle * Math.PI) / 180;
  const r = Math.asin((n1 / n2) * Math.sin(i));
  // emergent angle equals incident (parallel slab)
  return (
    <SimContainer hint="When light enters denser medium it bends toward the normal. Emergent ray is parallel to incident ray.">
      <SimSlider label="Angle of Incidence" value={angle} onChange={setAngle} min={0} max={75} step={1} unit="°" color="#3b82f6" />
      <svg viewBox="0 0 280 200" className="w-full bg-gradient-to-b from-sky-50 to-cyan-50 rounded-xl">
        {/* glass slab */}
        <rect x="20" y="70" width="240" height="60" fill="rgba(56,189,248,0.25)" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="245" y="105" fontSize="9" fill="#0369a1" fontWeight="700">glass</text>
        {/* normals */}
        <line x1="100" y1="40" x2="100" y2="160" stroke="#94a3b8" strokeDasharray="2 3" />
        <line x1={100 + 60 * Math.tan(r)} y1="70" x2={100 + 60 * Math.tan(r)} y2="190" stroke="#94a3b8" strokeDasharray="2 3" />
        {/* incident ray */}
        <line x1={100 - 50 * Math.sin(i)} y1={70 - 50 * Math.cos(i)} x2="100" y2="70" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#rh1)" />
        {/* refracted ray */}
        <line x1="100" y1="70" x2={100 + 60 * Math.tan(r)} y2="130" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#rh2)" />
        {/* emergent ray */}
        <line x1={100 + 60 * Math.tan(r)} y1="130" x2={100 + 60 * Math.tan(r) + 50 * Math.sin(i)} y2={130 + 50 * Math.cos(i)} stroke="#10b981" strokeWidth="2.5" markerEnd="url(#rh3)" />
        <defs>
          <marker id="rh1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#ef4444" /></marker>
          <marker id="rh2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#a855f7" /></marker>
          <marker id="rh3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#10b981" /></marker>
        </defs>
      </svg>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Angle i" value={angle} unit="°" color="#ef4444" precision={0} />
        <SimNumber label="Angle r" value={(r * 180) / Math.PI} unit="°" color="#a855f7" precision={1} />
      </div>
    </SimContainer>
  );
}

/* 15. Power of Lens */
export function PowerOfLensSim() {
  const [f, setF] = useState(20); // cm
  const P = 100 / f; // dioptres (since f in cm → m: f/100, P = 1/(f/100) = 100/f)
  return (
    <SimContainer hint="Power P = 1/f (in metres). Shorter focal length means more powerful lens.">
      <SimSlider label="Focal Length" value={f} onChange={setF} min={5} max={100} step={1} unit=" cm" color="#a855f7" />
      <svg viewBox="0 0 280 120" className="w-full bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl">
        <line x1="10" y1="60" x2="270" y2="60" stroke="#94a3b8" strokeDasharray="3 3" />
        <ellipse cx="140" cy="60" rx={6 + (50 / f) * 4} ry={50 - (f / 5)} fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="2" />
        <line x1={140 - f * 1.5} y1="55" x2={140 - f * 1.5} y2="65" stroke="#374151" strokeWidth="1.5" />
        <line x1={140 + f * 1.5} y1="55" x2={140 + f * 1.5} y2="65" stroke="#374151" strokeWidth="1.5" />
        <text x={140 - f * 1.5 - 6} y={78} fontSize="9" fill="#374151">F</text>
        <text x={140 + f * 1.5 - 6} y={78} fontSize="9" fill="#374151">F'</text>
      </svg>
      <SimNumber label="Power" value={P} unit=" D" color="#a855f7" />
    </SimContainer>
  );
}
