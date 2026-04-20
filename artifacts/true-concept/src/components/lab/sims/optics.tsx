import { useState } from "react";
import { SimSlider, SimNumber, SimContainer, SimResetButton } from "../sim-ui";

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

/* 13. Image Formation by Lens & Mirror — PhET Geometric Optics style */
type OpticType = "cv" | "cc" | "cm" | "cx";

export function ConvexLensSim() {
  const [type, setType] = useState<OpticType>("cv");
  const [f, setF] = useState(15);
  const [u, setU] = useState(30);
  const [ho, setHo] = useState(15);

  const isLens = type === "cv" || type === "cc";
  // NCERT Cartesian sign convention: convex lens & convex mirror → +f; concave lens & concave mirror → -f
  const fS = type === "cv" || type === "cx" ? f : -f;
  const uS = -u; // object always at negative position (left of element)

  let vS: number;
  if (isLens) vS = 1 / (1 / fS + 1 / uS); // 1/v - 1/u = 1/f
  else vS = 1 / (1 / fS - 1 / uS); // 1/v + 1/u = 1/f

  const m = isLens ? vS / uS : -vS / uS;
  const hi = m * ho;

  const elemX = 180;
  const axisY = 100;
  const SX = 2;
  const SY = 1.2;

  const objX = elemX + uS * SX; // = elemX - u*2
  const objTopY = axisY - ho * SY;
  const imageXraw = elemX + vS * SX;
  const imageX = Math.max(8, Math.min(352, Number.isFinite(imageXraw) ? imageXraw : 9999));
  const imgHeightPx = hi * SY;
  const imgTopY = Math.max(8, Math.min(192, axisY - imgHeightPx));

  const isVirtual = isLens ? vS < 0 : vS > 0;
  const isReal = !isVirtual && Number.isFinite(vS);

  // Focal points (NCERT-style: F is the "primary" focal point on the side of incoming light, F' on the other side)
  const Fnear = elemX - f * SX;
  const Ffar = elemX + f * SX;
  const Cnear = elemX - 2 * f * SX;
  const Cfar = elemX + 2 * f * SX;

  // Geometric construction of outgoing rays per element type (works even at u=f / image at infinity).
  // Ray 1: incoming parallel-to-axis at height objTopY hits element at elemPt1.
  // Ray 2: incoming through optical centre / pole hits element at elemPt2 = (elemX, axisY).
  const elemPt1 = { x: elemX, y: objTopY };
  const elemPt2 = { x: elemX, y: axisY };
  const imgPt = { x: imageXraw, y: axisY - imgHeightPx };

  // Helper: extend a line from `from` in direction (dx,dy) by `len` pixels, clamped to viewBox.
  function extend(from: { x: number; y: number }, dx: number, dy: number, len: number) {
    const d = Math.hypot(dx, dy) || 1;
    return { x: from.x + (dx / d) * len, y: from.y + (dy / d) * len };
  }

  // Direction of outgoing parallel ray (Ray 1) after the element.
  // Convex lens (cv): refracts through F' on far side → direction = F' − elemPt1.
  // Concave lens (cc): diverges as if from F on near side → direction = elemPt1 − F (away from F).
  // Concave mirror (cm): reflects through F on near (left) side → direction = F − elemPt1 (going left).
  // Convex mirror (cx): reflects diverging, virtual F behind on far (right) side → direction = elemPt1 − F_behind (going left).
  let r1dx: number, r1dy: number;
  if (type === "cv") { r1dx = Ffar - elemX; r1dy = axisY - objTopY; }
  else if (type === "cc") { r1dx = elemX - Fnear; r1dy = objTopY - axisY; }
  else if (type === "cm") { r1dx = Fnear - elemX; r1dy = axisY - objTopY; }
  else { r1dx = elemX - Ffar; r1dy = objTopY - axisY; }
  const out1 = extend(elemPt1, r1dx, r1dy, 220);

  // Direction of outgoing chief ray (Ray 2):
  // Lens: continues straight in same direction as incident (axisY − objTopY in y, positive x).
  // Mirror: reflects about the mirror plane at pole (axis is normal): x-component negates, y-component preserved.
  let r2dx: number, r2dy: number;
  const inc2dx = elemX - objX; // = u*SX (positive)
  const inc2dy = axisY - objTopY; // = ho*SY (positive when object above axis)
  if (isLens) { r2dx = inc2dx; r2dy = inc2dy; }
  else { r2dx = -inc2dx; r2dy = inc2dy; }
  const out2 = extend(elemPt2, r2dx, r2dy, 220);

  function renderElement() {
    const colors = { cv: "#6366f1", cc: "#8b5cf6", cm: "#10b981", cx: "#f59e0b" };
    const c = colors[type];
    if (type === "cv") {
      return (
        <ellipse cx={elemX} cy={axisY} rx="10" ry="55" fill="rgba(99,102,241,0.28)" stroke={c} strokeWidth="2.5" />
      );
    }
    if (type === "cc") {
      return (
        <path
          d={`M ${elemX - 9},${axisY - 55} Q ${elemX + 4},${axisY} ${elemX - 9},${axisY + 55} L ${elemX + 9},${axisY + 55} Q ${elemX - 4},${axisY} ${elemX + 9},${axisY - 55} Z`}
          fill="rgba(139,92,246,0.28)"
          stroke={c}
          strokeWidth="2.5"
        />
      );
    }
    if (type === "cm") {
      return (
        <g>
          <path d={`M ${elemX + 8},${axisY - 55} Q ${elemX - 8},${axisY} ${elemX + 8},${axisY + 55}`} fill="none" stroke={c} strokeWidth="3" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={elemX + 4} y1={axisY - 50 + i * 13} x2={elemX + 12} y2={axisY - 44 + i * 13} stroke={c} strokeWidth="1" />
          ))}
        </g>
      );
    }
    return (
      <g>
        <path d={`M ${elemX - 8},${axisY - 55} Q ${elemX + 8},${axisY} ${elemX - 8},${axisY + 55}`} fill="none" stroke={c} strokeWidth="3" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={elemX - 12} y1={axisY - 50 + i * 13} x2={elemX - 4} y2={axisY - 44 + i * 13} stroke={c} strokeWidth="1" />
        ))}
      </g>
    );
  }

  const desc = !Number.isFinite(vS)
    ? "Image formed at infinity"
    : `${isReal ? "Real" : "Virtual"}, ${m < 0 ? "inverted" : "upright"}, ${
        Math.abs(m) > 1.05 ? "magnified" : Math.abs(m) < 0.95 ? "diminished" : "same size"
      }`;

  const labels: Record<OpticType, string> = {
    cv: "Convex Lens",
    cc: "Concave Lens",
    cm: "Concave Mirror",
    cx: "Convex Mirror",
  };
  const emojis: Record<OpticType, string> = { cv: "🔍", cc: "〰️", cm: "🥄", cx: "🪩" };
  const btnColors: Record<OpticType, string> = { cv: "#6366f1", cc: "#8b5cf6", cm: "#10b981", cx: "#f59e0b" };

  return (
    <SimContainer hint="Pick any of the four optical elements. Use the sliders to change focal length, object distance, and object size — watch how the image, magnification, and ray diagram change in real time.">
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {(Object.keys(labels) as OpticType[]).map((id) => (
          <button
            key={id}
            onClick={() => setType(id)}
            data-testid={`btn-optic-${id}`}
            className={`px-2 py-1.5 rounded-xl text-xs font-black transition-all ${
              type === id ? "text-white shadow-md scale-[1.02]" : "bg-white/60 text-gray-700 hover:bg-white/80"
            }`}
            style={type === id ? { background: btnColors[id] } : {}}
          >
            <span className="mr-1">{emojis[id]}</span>
            {labels[id]}
          </button>
        ))}
      </div>

      <SimSlider label="Focal length |f|" value={f} onChange={setF} min={5} max={45} step={1} unit=" cm" color="#7c3aed" />
      <SimSlider label="Object distance (u)" value={u} onChange={setU} min={10} max={80} step={1} unit=" cm" color="#dc2626" />
      <SimSlider label="Object height" value={ho} onChange={setHo} min={5} max={30} step={1} unit=" cm" color="#0ea5e9" />

      <svg viewBox="0 0 360 200" className="w-full bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border border-white/60">
        {/* principal axis */}
        <line x1="4" y1={axisY} x2="356" y2={axisY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

        {/* element */}
        {renderElement()}

        {/* focal points + center of curvature */}
        {isLens ? (
          <>
            <circle cx={Fnear} cy={axisY} r="3" fill="#1f2937" />
            <text x={Fnear - 3} y={axisY + 13} fontSize="9" fontWeight="800" fill="#1f2937">F</text>
            <circle cx={Ffar} cy={axisY} r="3" fill="#1f2937" />
            <text x={Ffar - 4} y={axisY + 13} fontSize="9" fontWeight="800" fill="#1f2937">F'</text>
            <circle cx={Cnear} cy={axisY} r="2.5" fill="#64748b" />
            <text x={Cnear - 4} y={axisY + 13} fontSize="8" fontWeight="700" fill="#64748b">2F</text>
            <circle cx={Cfar} cy={axisY} r="2.5" fill="#64748b" />
            <text x={Cfar - 5} y={axisY + 13} fontSize="8" fontWeight="700" fill="#64748b">2F'</text>
          </>
        ) : type === "cm" ? (
          <>
            <circle cx={Fnear} cy={axisY} r="3" fill="#1f2937" />
            <text x={Fnear - 3} y={axisY + 13} fontSize="9" fontWeight="800" fill="#1f2937">F</text>
            <circle cx={Cnear} cy={axisY} r="3" fill="#475569" />
            <text x={Cnear - 3} y={axisY + 13} fontSize="9" fontWeight="800" fill="#475569">C</text>
          </>
        ) : (
          <>
            <circle cx={Ffar} cy={axisY} r="3" fill="#1f2937" />
            <text x={Ffar - 3} y={axisY + 13} fontSize="9" fontWeight="800" fill="#1f2937">F</text>
            <circle cx={Cfar} cy={axisY} r="3" fill="#475569" />
            <text x={Cfar - 3} y={axisY + 13} fontSize="9" fontWeight="800" fill="#475569">C</text>
          </>
        )}

        {/* object arrow */}
        <line x1={objX} y1={axisY} x2={objX} y2={objTopY} stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#arr-obj)" />
        <text x={objX - 14} y={objTopY - 4} fontSize="9" fontWeight="800" fill="#dc2626">Object</text>

        {/* Ray 1: parallel to axis */}
        <line x1={objX} y1={objTopY} x2={elemX} y2={objTopY} stroke="#0ea5e9" strokeWidth="1.5" />
        <line x1={elemX} y1={objTopY} x2={out1.x} y2={out1.y} stroke="#0ea5e9" strokeWidth="1.5" />
        {isVirtual && Number.isFinite(imgPt.x) && (
          <line x1={elemX} y1={objTopY} x2={imgPt.x} y2={imgPt.y} stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        )}

        {/* Ray 2: through optical center / pole */}
        <line x1={objX} y1={objTopY} x2={elemX} y2={axisY} stroke="#a855f7" strokeWidth="1.5" />
        <line x1={elemX} y1={axisY} x2={out2.x} y2={out2.y} stroke="#a855f7" strokeWidth="1.5" />
        {isVirtual && Number.isFinite(imgPt.x) && (
          <line x1={elemX} y1={axisY} x2={imgPt.x} y2={imgPt.y} stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        )}

        {/* image arrow */}
        {Number.isFinite(vS) && (
          <>
            <line
              x1={imageX}
              y1={axisY}
              x2={imageX}
              y2={imgTopY}
              stroke={isReal ? "#10b981" : "#f59e0b"}
              strokeWidth="2.5"
              strokeDasharray={isReal ? undefined : "4 3"}
              markerEnd={isReal ? "url(#arr-img-real)" : "url(#arr-img-virt)"}
            />
            <text
              x={imageX - 10}
              y={imgHeightPx > 0 ? imgTopY - 4 : imgTopY + 12}
              fontSize="9"
              fontWeight="800"
              fill={isReal ? "#10b981" : "#f59e0b"}
            >
              Image
            </text>
          </>
        )}

        <defs>
          <marker id="arr-obj" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#dc2626" /></marker>
          <marker id="arr-img-real" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#10b981" /></marker>
          <marker id="arr-img-virt" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#f59e0b" /></marker>
        </defs>
      </svg>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <SimNumber label="u" value={u} unit=" cm" color="#dc2626" precision={0} />
        <SimNumber label="|v|" value={Number.isFinite(vS) ? Math.abs(vS) : Infinity} unit=" cm" color={isReal ? "#10b981" : "#f59e0b"} precision={1} />
        <SimNumber label="m" value={Number.isFinite(m) ? m : Infinity} color="#7c3aed" precision={2} />
      </div>
      <div data-testid="text-image-desc" className="mt-2 px-3 py-2 rounded-xl text-xs font-black text-center liquid-inner text-gray-700">
        {desc}
      </div>
      <div className="mt-2 flex justify-end">
        <SimResetButton onClick={() => { setType("cv"); setF(15); setU(30); setHo(15); }} />
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
