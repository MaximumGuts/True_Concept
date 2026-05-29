import { useState, useRef } from "react";
import { SimSlider, SimNumber, SimContainer, SimResetButton, useRafLoop } from "../sim-ui";
import { useLanguage } from "@/contexts/LanguageContext";

/* ───────────────────────────────────────────────────────────
   11. Laws of Reflection — interactive (3 mirror modes)
   ─────────────────────────────────────────────────────────── */
type MirrorMode = "plane" | "diffuse" | "multi";

export function ReflectionSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [angle, setAngle] = useState(45);
  const [mode, setMode] = useState<MirrorMode>("plane");
  const [showGraph, setShowGraph] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState(0);

  useRafLoop(true, (dt) => setPhase((p) => p + dt));

  // SVG geometry (800 × 500 viewBox)
  const MX = 400;        // mirror normal x
  const MY = 350;        // mirror y
  const RAY_LEN = 280;   // visual ray length

  const onPtrDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    updateAngle(e);
  };
  const onPtrMove = (e: React.PointerEvent) => { if (dragging) updateAngle(e); };
  const onPtrUp   = (e: React.PointerEvent) => {
    setDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };
  const updateAngle = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const lx = (e.clientX - rect.left) / rect.width  * 800;
    const ly = (e.clientY - rect.top)  / rect.height * 500;
    const dx = MX - lx;
    const dy = MY - ly;
    if (dy > 0) {
      const a = Math.atan2(Math.abs(dx), dy) * 180 / Math.PI;
      setAngle(Math.min(85, Math.max(0, Math.round(a))));
    }
  };

  const rad = (angle * Math.PI) / 180;
  const lampX = MX - Math.sin(rad) * RAY_LEN;
  const lampY = MY - Math.cos(rad) * RAY_LEN;

  // For multi mode: 3 parallel rays
  const offsets = mode === "multi" ? [-30, 0, 30] : [0];
  // For diffuse mode: small pseudo-random angle deviation per ray
  const diffuseDev = (i: number) => {
    const r = Math.sin(i * 123.456) * 1e4;
    return rad + (r - Math.floor(r) - 0.5) * 0.8;
  };

  const renderRays = () =>
    offsets.map((off, idx) => {
      // Source point shifted perpendicular to incident direction
      const dxOff = Math.cos(rad) * off;
      const dyOff = -Math.sin(rad) * off;
      const sx = lampX + dxOff;
      const sy = lampY + dyOff;
      // Hit point on mirror surface (project to MY)
      const hx = MX + off / Math.cos(rad);
      const hy = MY;
      // Reflected angle (diffuse uses deviation)
      const rr = mode === "diffuse" ? diffuseDev(hx) : rad;
      const ox = hx + Math.sin(rr) * RAY_LEN * 1.5;
      const oy = hy - Math.cos(rr) * RAY_LEN * 1.5;
      const dashShift = -(phase * 0.2) % 20;
      return (
        <g key={idx}>
          {/* Incident ray (red) */}
          <line x1={sx} y1={sy} x2={hx} y2={hy} stroke="#ef4444" strokeWidth="4" filter="url(#refl-glow-red)" />
          <line x1={sx} y1={sy} x2={hx} y2={hy} stroke="#ffffff" strokeWidth="1.5" />
          <line x1={sx} y1={sy} x2={hx} y2={hy} stroke="#ffffff" strokeWidth="6"
                strokeDasharray="2 18" strokeDashoffset={dashShift} opacity="0.8"
                style={{ mixBlendMode: "screen" }} />
          {/* Reflected ray (green) */}
          <line x1={hx} y1={hy} x2={ox} y2={oy} stroke="#10b981" strokeWidth="4" filter="url(#refl-glow-green)" />
          <line x1={hx} y1={hy} x2={ox} y2={oy} stroke="#ffffff" strokeWidth="1.5" />
          <line x1={hx} y1={hy} x2={ox} y2={oy} stroke="#ffffff" strokeWidth="6"
                strokeDasharray="2 18" strokeDashoffset={-dashShift} opacity="0.8"
                style={{ mixBlendMode: "screen" }} />
          {/* Hit-point glow */}
          <circle cx={hx} cy={hy} r="4" fill="#ffffff" filter="url(#refl-glow-white)" opacity="0.9" />
        </g>
      );
    });

  const modeLabel: Record<MirrorMode, { en: string; as: string }> = {
    plane:   { en: "Plane Mirror",   as: "সমতল দৰ্পণ" },
    diffuse: { en: "Diffuse Mirror", as: "অসমতল দৰ্পণ" },
    multi:   { en: "Multi Mirror",   as: "বহু-ৰশ্মি দৰ্পণ" },
  };

  return (
    <SimContainer hint={isAs
      ? "আপতন কোণ সলনি কৰিবলৈ পোহৰৰ উৎস টানক। লক্ষ্য কৰক যে ∠i = ∠r সদায়।"
      : "Drag the light source to change the angle of incidence. Notice that ∠i = ∠r always."}>
      {/* Mode chips + Graph toggle */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["plane", "diffuse", "multi"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === m
                ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-700"
            }`}
          >
            {isAs ? modeLabel[m].as : modeLabel[m].en}
          </button>
        ))}
        <button
          onClick={() => setShowGraph(!showGraph)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ml-auto ${
            showGraph
              ? "bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          {showGraph
            ? (isAs ? "তাৎক্ষণিক গ্ৰাফ লুকুৱাওক" : "Hide Live Graph")
            : (isAs ? "তাৎক্ষণিক গ্ৰাফ দেখুৱাওক" : "Show Live Graph")}
        </button>
      </div>

      <div className="relative group touch-none select-none">
        <svg ref={svgRef} viewBox="0 0 800 500"
             className="w-full bg-[#020617] rounded-xl cursor-crosshair overflow-hidden touch-none shadow-2xl"
             onPointerDown={onPtrDown} onPointerMove={onPtrMove} onPointerUp={onPtrUp}
             style={{ touchAction: "none" }}>
          <defs>
            <filter id="refl-glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="refl-glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="refl-glow-white" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="refl-mirror-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#94a3b8" />
              <stop offset="20%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <pattern id="refl-rough" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#64748b" opacity="0.6" />
              <circle cx="8" cy="7" r="2"   fill="#475569" opacity="0.6" />
              <circle cx="5" cy="5" r="1"   fill="#94a3b8" opacity="0.6" />
            </pattern>
          </defs>

          {/* Faint grid background */}
          <g opacity="0.1">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" stroke="#ffffff" strokeWidth="1" />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#ffffff" strokeWidth="1" />
            ))}
          </g>

          {/* Normal */}
          <line x1={MX} y1={MY} x2={MX} y2="50" stroke="#64748b" strokeWidth="2" strokeDasharray="8 8" />
          <text x={MX + 10} y="60" fill="#94a3b8" fontSize="16" fontWeight="bold">
            {isAs ? "অভিলম্ব" : "Normal"}
          </text>

          {/* Mirror surface */}
          <g transform={`translate(0, ${MY})`}>
            {mode === "diffuse" ? (
              <rect x="100" y="0" width="600" height="15" fill="url(#refl-rough)" stroke="#475569" strokeWidth="2" rx="4" />
            ) : (
              <>
                <rect x="100" y="-2" width="600" height="12" fill="url(#refl-mirror-grad)" rx="2" />
                <line x1="105" y1="0" x2="695" y2="0" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
                {Array.from({ length: 30 }).map((_, i) => (
                  <line key={`mh${i}`} x1={110 + i * 20} y1="10" x2={100 + i * 20} y2="20" stroke="#475569" strokeWidth="2" />
                ))}
              </>
            )}
            <text x="715" y="10" fill="#94a3b8" fontSize="14" fontWeight="bold">
              {isAs ? "পৃষ্ঠ" : "Surface"}
            </text>
          </g>

          {/* Angle arcs */}
          {mode !== "diffuse" && (
            <g opacity="0.8">
              <path d={`M ${MX} ${MY - 80} A 80 80 0 0 0 ${MX - 80 * Math.sin(rad)} ${MY - 80 * Math.cos(rad)}`}
                    fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.6" />
              <text x={MX - Math.sin(rad / 2) * 100} y={MY - Math.cos(rad / 2) * 100}
                    fill="#ef4444" fontSize="20" fontWeight="900" textAnchor="middle">
                ∠i = {angle}°
              </text>
              <path d={`M ${MX} ${MY - 80} A 80 80 0 0 1 ${MX + 80 * Math.sin(rad)} ${MY - 80 * Math.cos(rad)}`}
                    fill="none" stroke="#10b981" strokeWidth="3" opacity="0.6" />
              <text x={MX + Math.sin(rad / 2) * 100} y={MY - Math.cos(rad / 2) * 100}
                    fill="#10b981" fontSize="20" fontWeight="900" textAnchor="middle">
                ∠r = {angle}°
              </text>
            </g>
          )}

          {renderRays()}

          {/* Light source (flashlight) */}
          <g transform={`translate(${lampX}, ${lampY}) rotate(${-angle})`}>
            <rect x="-15" y="-30" width="30" height="40" fill="#334155" rx="4" stroke="#64748b" strokeWidth="2" />
            <rect x="-5" y="10" width="10" height="10" fill="#ef4444" />
            <path d="M -10 -10 L 10 -10 L 15 -30 L -15 -30 Z" fill="#1e293b" />
            <circle cx="0" cy="-20" r="4" fill="#0ea5e9" filter="url(#refl-glow-white)" />
          </g>

          {/* Live mini-graph overlay */}
          {showGraph && (
            <g transform="translate(40, 40)">
              <rect x="0" y="0" width="220" height="180" fill="rgba(15,23,42,0.85)" stroke="#334155" strokeWidth="2" rx="8" />
              <text x="110" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
                {isAs ? "আপতন কোণ বনাম প্ৰতিফলন কোণ" : "Angle of Incidence vs Reflection"}
              </text>
              <line x1="30" y1="150" x2="190" y2="150" stroke="#64748b" strokeWidth="2" />
              <line x1="30" y1="40"  x2="30"  y2="150" stroke="#64748b" strokeWidth="2" />
              <text x="110" y="165" fill="#ef4444" fontSize="10" textAnchor="middle">{isAs ? "আপতন (i)" : "Incidence (i)"}</text>
              <text x="15" y="95" fill="#10b981" fontSize="10" transform="rotate(-90 15 95)" textAnchor="middle">
                {isAs ? "প্ৰতিফলন (r)" : "Reflection (r)"}
              </text>
              {mode !== "diffuse" ? (
                <>
                  <line x1="30" y1="150" x2="190" y2="40" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                  <circle cx={30 + (angle / 90) * 160} cy={150 - (angle / 90) * 110} r="5" fill="#a855f7" filter="url(#refl-glow-white)" />
                  <text x={30 + (angle / 90) * 160 + 10} y={150 - (angle / 90) * 110 - 10} fill="#f8fafc" fontSize="12" fontWeight="bold">
                    ({angle}°, {angle}°)
                  </text>
                </>
              ) : (
                <text x="110" y="95" fill="#94a3b8" fontSize="12" textAnchor="middle" opacity="0.8">
                  {isAs ? "বিকিৰিত আকৃতি" : "Scatter pattern"}
                </text>
              )}
            </g>
          )}

          {/* Law of Reflection footer */}
          <g transform="translate(250, 420)">
            <rect x="0" y="0" width="300" height="60" fill="rgba(30,41,59,0.8)" stroke="#475569" strokeWidth="1" rx="8" />
            <text x="150" y="25" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">
              {isAs ? "প্ৰতিফলনৰ সূত্ৰ" : "Law of Reflection"}
            </text>
            <text x="150" y="45" fill="#94a3b8" fontSize="12" textAnchor="middle">
              {mode === "diffuse"
                ? (isAs ? "অসমতল পৃষ্ঠই পোহৰ বিকিৰিত কৰে (অসমতল প্ৰতিফলন)।" : "Rough surfaces scatter light (Diffuse Reflection).")
                : (isAs ? "আপতন কোণ ঠিক প্ৰতিফলন কোণৰ সমান।" : "The angle of incidence exactly equals the angle of reflection.")}
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <SimSlider label={isAs ? "কোণ (i)" : "Angle (i)"} value={angle} onChange={setAngle}
                   min={0} max={85} step={1} unit="°" color="#ef4444" />
        <SimNumber label={isAs ? "আপতন" : "Incidence"}   value={angle} unit="°" color="#ef4444" precision={0} />
        <SimNumber label={isAs ? "প্ৰতিফলন" : "Reflection"} value={angle} unit="°" color="#10b981" precision={0} />
        <div className="flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            {isAs ? "সম্পৰ্ক" : "Relationship"}
          </span>
          <span className={`text-lg font-black ${mode === "diffuse" ? "text-slate-400" : "text-purple-600 dark:text-purple-400"}`}>
            {mode === "diffuse" ? (isAs ? "বিকিৰিত" : "Scattered") : "∠i = ∠r"}
          </span>
        </div>
      </div>
    </SimContainer>
  );
}

/* ───────────────────────────────────────────────────────────
   12. Image Formation by Plane Mirror
   ─────────────────────────────────────────────────────────── */
export function PlaneMirrorSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [d, setD] = useState(40);

  return (
    <SimContainer hint={isAs
      ? "সমতল দৰ্পণে দৰ্পণৰ পিছফালে একে দূৰত্বত এক আভাসী, সিধা প্ৰতিচ্ছবি গঠন কৰে।"
      : "A plane mirror forms a virtual, upright image at the same distance behind the mirror."}>
      <SimSlider label={isAs ? "বস্তুৰ দূৰত্ব" : "Object Distance"} value={d} onChange={setD}
                 min={10} max={100} step={5} unit=" cm" color="#da6b45" />
      <svg viewBox="0 0 280 140"
           className="w-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 rounded-xl">
        {/* Mirror surface */}
        <line x1="140" y1="10" x2="140" y2="130" stroke="#475569" strokeWidth="3" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="140" y1={10 + i * 11} x2="148" y2={18 + i * 11} stroke="#475569" strokeWidth="1" />
        ))}
        {/* Ray tracing (faint) */}
        <g opacity="0.5">
          <line x1="140" y1="90" x2="120" y2="90" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
          <line x1={140 - d * 1.1} y1="50" x2="140"            y2="50"  stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#pm-ray)" />
          <line x1="140"             y1="50" x2={140 - d * 1.1} y2="50"  stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#pm-ray)" />
          <line x1="140"             y1="50" x2={140 + d * 1.1} y2="50"  stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1={140 - d * 1.1} y1="50" x2="140"            y2="90"  stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#pm-ray)" />
          <line x1="140"             y1="90" x2={140 - d * 1.1} y2="130" stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#pm-ray)" />
          <line x1="140"             y1="90" x2={140 + d * 1.1} y2="50"  stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" />
        </g>
        {/* Object */}
        <g>
          <line x1={140 - d * 1.1} y1="92" x2={140 - d * 1.1} y2="50" stroke="#dc2626" strokeWidth="3" markerEnd="url(#pm-obj)" />
          <text x={140 - d * 1.1 - 18} y="38" fontSize="10" fill="#dc2626" fontWeight="800">
            {isAs ? "বস্তু" : "Object"}
          </text>
        </g>
        {/* Virtual image */}
        <g opacity="0.6">
          <line x1={140 + d * 1.1} y1="92" x2={140 + d * 1.1} y2="50" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 3" markerEnd="url(#pm-img)" />
          <text x={140 + d * 1.1 - 22} y="38" fontSize="10" fill="#d97706" fontWeight="800">
            {isAs ? "প্ৰতিচ্ছবি" : "Image"}
          </text>
        </g>
        <text x={140 - d * 1.1 - 12} y="122" fontSize="9" fill="#da6b45" fontWeight="700">{d} cm</text>
        <text x={140 + d * 1.1 - 12} y="122" fontSize="9" fill="#f08766" fontWeight="700">{d} cm</text>
        <defs>
          <marker id="pm-ray" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,1 L5,3 L0,5 z" fill="#0ea5e9" />
          </marker>
          <marker id="pm-obj" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 z" fill="#dc2626" />
          </marker>
          <marker id="pm-img" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 z" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
    </SimContainer>
  );
}

/* ───────────────────────────────────────────────────────────
   13. Image Formation by Lens & Mirror — full PhET-style geometric optics
   660×320 canvas with optical bench, click-to-place object, screen-focus
   detection, 4 element types (convex/concave lens, concave/convex mirror).
   ─────────────────────────────────────────────────────────── */
type OpticType = "cv" | "cc" | "cm" | "cx";

export function ConvexLensSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [type, setType] = useState<OpticType>("cv");
  const [f, setF]           = useState(18);
  const [u, setU]           = useState(42);
  const [ho, setHo]         = useState(16);
  const [screen, setScreen] = useState(42);

  const isLens = type === "cv" || type === "cc";
  const fS = type === "cv" || type === "cx" ? f : -f;
  const uS = -u;
  const vS = isLens
    ? 1 / (1 / fS + 1 / uS)
    : 1 / (1 / fS - 1 / uS);
  const m  = isLens ? vS / uS : -vS / uS;
  const hi = m * ho;
  const isVirtual = isLens ? vS < 0 : vS > 0;
  const isReal    = Number.isFinite(vS) && !isVirtual;

  // Canvas geometry (live build's dimensions)
  const W = 660, H = 320;
  const elemX = 330, axisY = 170;
  const SX = 3.2, SY = 3.1;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const objX      = elemX + uS * SX;
  const objTopY   = axisY - ho * SY;
  const imageXraw = elemX + vS * SX;
  const imageX    = clamp(Number.isFinite(imageXraw) ? imageXraw : W - 24, 20, W - 20);
  const imgHpx    = hi * SY;
  const imgTopY   = clamp(axisY - imgHpx, 18, H - 24);
  const Fnear     = elemX - f * SX;
  const Ffar      = elemX + f * SX;
  const Cnear     = elemX - 2 * f * SX;
  const Cfar      = elemX + 2 * f * SX;
  const aperture  = clamp(58 - f * 0.65, 28, 54);
  const screenX   = elemX + (isLens ? screen : -screen) * SX;
  const screenErr = isReal ? Math.abs(Math.abs(vS) - screen) : Infinity;
  const screenFocus = clamp(1 - screenErr / 28, 0, 1);

  function extend(from: { x: number; y: number }, dx: number, dy: number, len: number) {
    const d = Math.hypot(dx, dy) || 1;
    return { x: from.x + (dx / d) * len, y: from.y + (dy / d) * len };
  }

  // Triangular arrowhead at (x, tipY); base at (x, baseY)
  function renderArrow(x: number, tipY: number, baseY: number, color: string) {
    const height = Math.abs(baseY - tipY);
    if (height < 1) return null;
    const size = clamp(height * 0.4, 2.5, 7.5);
    const dy = tipY < baseY ? size : -size;
    return (
      <polygon
        points={`${x},${tipY} ${x - size * 0.5},${tipY + dy} ${x + size * 0.5},${tipY + dy}`}
        fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
    );
  }

  // Ray 1: parallel-to-axis after element
  let r1dx: number, r1dy: number;
  if (type === "cv")       { r1dx = Ffar - elemX;  r1dy = axisY - objTopY; }
  else if (type === "cc")  { r1dx = elemX - Fnear; r1dy = objTopY - axisY; }
  else if (type === "cm")  { r1dx = Fnear - elemX; r1dy = axisY - objTopY; }
  else                     { r1dx = elemX - Ffar;  r1dy = objTopY - axisY; }
  const out1 = extend({ x: elemX, y: objTopY }, r1dx, r1dy, 410);

  // Ray 2: through optical centre / pole
  const incDx = elemX - objX, incDy = axisY - objTopY;
  const out2 = extend({ x: elemX, y: axisY }, isLens ? incDx : -incDx, incDy, 410);

  // Extra rays for richer ray-fan visual (4 rays at fractional aperture offsets)
  const imgPt = { x: imageXraw, y: axisY - imgHpx };
  const extraRays = [-0.8, -0.38, 0.38, 0.8].map((off) => {
    const hitY = axisY + off * aperture;
    let dx = (Number.isFinite(imageXraw) ? imageXraw : out1.x) - elemX;
    let dy = (Number.isFinite(imgPt.y)   ? imgPt.y   : out1.y) - hitY;
    if (!isReal) {
      dx = isLens ? elemX - (Number.isFinite(imageXraw) ? imageXraw : Fnear)
                  : -Math.abs(elemX - Fnear);
      dy = hitY - (Number.isFinite(imgPt.y) ? imgPt.y : axisY);
    }
    return { hitY, to: extend({ x: elemX, y: hitY }, dx, dy, 410) };
  });

  // Click on optical bench → place object
  const setObjectFromBench = (clientX: number, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    if (x < elemX - 20 && x > 24) setU(clamp(Math.round((elemX - x) / SX), 8, 90));
  };

  // Element rendering — apertures, white shines, hatching on mirror back
  function renderElement() {
    const elemColors: Record<OpticType, string> = { cv: "#4f46e5", cc: "#0f766e", cm: "#0d9488", cx: "#ea580c" };
    const colour = elemColors[type];
    if (type === "cv") {
      return (
        <g>
          <ellipse cx={elemX} cy={axisY} rx="13" ry={aperture + 18}
                   fill="rgba(79,70,229,0.18)" stroke={colour} strokeWidth="3" />
          <ellipse cx={elemX - 2} cy={axisY} rx="5" ry={aperture + 9}
                   fill="rgba(255,255,255,0.46)" />
        </g>
      );
    }
    if (type === "cc") {
      return (
        <g>
          <path
            d={`M ${elemX - 13},${axisY - aperture - 18} Q ${elemX + 5},${axisY} ${elemX - 13},${axisY + aperture + 18} L ${elemX + 13},${axisY + aperture + 18} Q ${elemX - 5},${axisY} ${elemX + 13},${axisY - aperture - 18} Z`}
            fill="rgba(15,118,110,0.17)" stroke={colour} strokeWidth="3"
          />
          <path d={`M ${elemX - 3},${axisY - aperture - 5} Q ${elemX - 10},${axisY} ${elemX - 3},${axisY + aperture + 5}`}
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        </g>
      );
    }
    if (type === "cm") {
      return (
        <g>
          <path d={`M ${elemX - 12},${axisY - aperture - 18} Q ${elemX + 14},${axisY} ${elemX - 12},${axisY + aperture + 18}`}
                fill="none" stroke={colour} strokeWidth="4" strokeLinecap="round" />
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={i}
                  x1={elemX + 8}  y1={axisY - aperture - 12 + i * ((aperture * 2 + 24) / 10)}
                  x2={elemX + 19} y2={axisY - aperture - 5  + i * ((aperture * 2 + 24) / 10)}
                  stroke={colour} strokeWidth="1" opacity="0.75" />
          ))}
        </g>
      );
    }
    // cx
    return (
      <g>
        <path d={`M ${elemX + 12},${axisY - aperture - 18} Q ${elemX - 14},${axisY} ${elemX + 12},${axisY + aperture + 18}`}
              fill="none" stroke={colour} strokeWidth="4" strokeLinecap="round" />
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={i}
                x1={elemX + 8}  y1={axisY - aperture - 12 + i * ((aperture * 2 + 24) / 10)}
                x2={elemX + 19} y2={axisY - aperture - 5  + i * ((aperture * 2 + 24) / 10)}
                stroke={colour} strokeWidth="1" opacity="0.75" />
        ))}
      </g>
    );
  }

  const labels: Record<OpticType, { en: string; as: string }> = {
    cv: { en: "Convex Lens",    as: "উত্তল লেন্স" },
    cc: { en: "Concave Lens",   as: "অবতল লেন্স" },
    cm: { en: "Concave Mirror", as: "অবতল দৰ্পণ" },
    cx: { en: "Convex Mirror",  as: "উত্তল দৰ্পণ" },
  };
  const btnColors: Record<OpticType, string> = { cv: "#4f46e5", cc: "#0f766e", cm: "#0d9488", cx: "#ea580c" };

  // Image description
  let desc: string;
  if (!Number.isFinite(vS)) {
    desc = isAs ? "প্ৰতিচ্ছবি অসীমত গঠন" : "Image formed at infinity";
  } else {
    const sizeEn = Math.abs(m) > 1.05 ? "magnified" : Math.abs(m) < 0.95 ? "diminished" : "same size";
    const sizeAs = Math.abs(m) > 1.05 ? "বিবৰ্ধিত" : Math.abs(m) < 0.95 ? "ক্ষুদ্ৰীকৃত" : "একে আকাৰ";
    const kindEn = isReal ? "Real" : "Virtual";
    const kindAs = isReal ? "প্ৰকৃত" : "আভাসী";
    const oriEn  = m < 0 ? "inverted" : "upright";
    const oriAs  = m < 0 ? "ওলোটা"   : "সিধা";
    desc = isAs ? `${kindAs}, ${oriAs}, ${sizeAs}` : `${kindEn}, ${oriEn}, ${sizeEn}`;
  }

  // Screen text
  let screenText: string;
  if (!isReal) {
    screenText = isAs ? "আভাসী প্ৰতিচ্ছবিৰ বাবে পৰ্দাত প্ৰতিচ্ছবি গঠন নহয়" : "No screen image for virtual image";
  } else if (screenFocus > 0.86) {
    screenText = isAs ? "পৰ্দাত স্পষ্ট ফোকাছ হ'ল" : "Screen is sharply focused";
  } else if (screen < Math.abs(vS)) {
    screenText = isAs ? "পৰ্দা আঁতৰাই নিয়ক" : "Move screen farther";
  } else {
    screenText = isAs ? "পৰ্দা ওচৰলৈ আনক" : "Move screen closer";
  }

  return (
    <SimContainer
      hint={isAs
        ? "এটা লেন্স বা দৰ্পণ বাছক, তাৰপাছত বস্তুৰ দূৰত্ব, ফোকাছ দূৰত্ব আৰু পৰ্দাৰ অৱস্থান সলনি কৰক। কঠিন ৰশ্মি প্ৰকৃত প্ৰতিচ্ছবিত মিলিত হয়; বিন্দুকৃত পশ্চাৎ-অংকনে আভাসী প্ৰতিচ্ছবি দেখুৱায়।"
        : "Choose a lens or mirror, then change object distance, focal length, and screen position. Solid rays meet at real images; dashed back-traces show virtual images."}
    >
      {/* 4 type buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {(Object.keys(labels) as OpticType[]).map((id) => (
          <button
            key={id}
            onClick={() => setType(id)}
            data-testid={`btn-optic-${id}`}
            className={`min-h-12 px-3 py-2 rounded-xl text-xs font-black transition-all ${
              type === id
                ? "text-white shadow-md scale-[1.02]"
                : "bg-white/70 dark:bg-slate-800/60 text-gray-700 dark:text-gray-200 hover:bg-white/90"
            }`}
            style={type === id ? { background: btnColors[id] } : undefined}
          >
            {isAs ? labels[id].as : labels[id].en}
          </button>
        ))}
      </div>

      {/* 4 sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
        <SimSlider label={isAs ? "ফোকাছ দূৰত্ব |f|"     : "Focal length |f|"}     value={f}      onChange={setF}      min={8} max={42} step={1} unit=" cm" color="#4f46e5" />
        <SimSlider label={isAs ? "বস্তুৰ দূৰত্ব |u|"   : "Object distance |u|"}  value={u}      onChange={setU}      min={8} max={90} step={1} unit=" cm" color="#dc2626" />
        <SimSlider label={isAs ? "বস্তুৰ উচ্চতা"        : "Object height"}        value={ho}     onChange={setHo}     min={6} max={26} step={1} unit=" cm" color="#0ea5e9" />
        <SimSlider label={isAs ? "পৰ্দাৰ দূৰত্ব"         : "Screen distance"}      value={screen} onChange={setScreen} min={8} max={90} step={1} unit=" cm" color="#16a34a" />
      </div>

      {/* Main optical canvas */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl border border-white/70 dark:border-white/10 shadow-inner cursor-crosshair"
        onPointerDown={(e) => setObjectFromBench(e.clientX, e.currentTarget)}
        onPointerMove={(e) => { if (e.buttons === 1) setObjectFromBench(e.clientX, e.currentTarget); }}
      >
        {/* Optical bench with tick marks (click to place object) */}
        <rect x="24" y="246" width="612" height="12" rx="6" fill="#cbd5e1" />
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={i} x1={42 + i * 48} y1="246" x2={42 + i * 48} y2="265" stroke="#94a3b8" strokeWidth="1.5" />
        ))}

        {/* Principal axis */}
        <line x1="18" y1={axisY} x2="642" y2={axisY} stroke="#64748b" strokeWidth="1.2" strokeDasharray="5 6" />
        <text x="28" y={axisY - 8} fontSize="11" fontWeight="800" fill="#64748b">
          {isAs ? "মুখ্য অক্ষ" : "principal axis"}
        </text>

        {/* Screen — only shown when real image exists */}
        {isReal && (
          <g opacity="0.95">
            <line x1={screenX} y1="62" x2={screenX} y2="244" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
            <rect x={screenX - 7} y="66" width="14" height="174" rx="7"
                  fill="#bbf7d0" opacity={0.45 + screenFocus * 0.45} />
            <circle cx={screenX} cy={axisY - imgHpx} r={8 + (1 - screenFocus) * 16}
                    fill="#22c55e" opacity={0.12 + screenFocus * 0.28} />
            <text x={screenX - 34} y="54" fontSize="11" fontWeight="900" fill="#15803d">
              {isAs ? "পৰ্দা" : "screen"}
            </text>
          </g>
        )}

        {renderElement()}

        {/* F, F', 2F, 2F' (lens) OR F, C (mirror) markers */}
        {isLens ? (
          <>
            <circle cx={Fnear} cy={axisY} r="3" fill="#1f2937" />
            <text x={Fnear - 4} y={axisY + 17} fontSize="11" fontWeight="900" fill="#1f2937">F</text>
            <circle cx={Ffar}  cy={axisY} r="3" fill="#1f2937" />
            <text x={Ffar - 5}  y={axisY + 17} fontSize="11" fontWeight="900" fill="#1f2937">F'</text>
            <circle cx={Cnear} cy={axisY} r="2.5" fill="#64748b" />
            <text x={Cnear - 7} y={axisY + 17} fontSize="10" fontWeight="800" fill="#64748b">2F</text>
            <circle cx={Cfar}  cy={axisY} r="2.5" fill="#64748b" />
            <text x={Cfar - 8}  y={axisY + 17} fontSize="10" fontWeight="800" fill="#64748b">2F'</text>
          </>
        ) : type === "cm" ? (
          <>
            <circle cx={Fnear} cy={axisY} r="3" fill="#1f2937" />
            <text x={Fnear - 4} y={axisY + 17} fontSize="11" fontWeight="900" fill="#1f2937">F</text>
            <circle cx={Cnear} cy={axisY} r="3" fill="#475569" />
            <text x={Cnear - 4} y={axisY + 17} fontSize="11" fontWeight="900" fill="#475569">C</text>
          </>
        ) : (
          <>
            <circle cx={Ffar} cy={axisY} r="3" fill="#1f2937" />
            <text x={Ffar - 4} y={axisY + 17} fontSize="11" fontWeight="900" fill="#1f2937">F</text>
            <circle cx={Cfar} cy={axisY} r="3" fill="#475569" />
            <text x={Cfar - 4} y={axisY + 17} fontSize="11" fontWeight="900" fill="#475569">C</text>
          </>
        )}

        {/* Object — red arrow + halo + label */}
        <g>
          <line x1={objX} y1={axisY} x2={objX} y2={objTopY} stroke="#dc2626" strokeWidth="5" />
          {renderArrow(objX, objTopY, axisY, "#dc2626")}
          <circle cx={objX} cy={objTopY - (objTopY < axisY ? 6 : -6)} r="5"
                  fill="#fee2e2" stroke="#dc2626" strokeWidth="2" opacity="0.2" />
          <text x={objX - 20} y={objTopY - (objTopY < axisY ? 12 : -20)} fontSize="12" fontWeight="900" fill="#dc2626">
            {isAs ? "বস্তু" : "object"}
          </text>
        </g>

        {/* 4 extra rays (faint blue fan) */}
        {extraRays.map((ray, i) => (
          <g key={i} opacity="0.32">
            <line x1={objX} y1={objTopY} x2={elemX} y2={ray.hitY} stroke="#38bdf8" strokeWidth="1.2" />
            <line x1={elemX} y1={ray.hitY} x2={ray.to.x} y2={ray.to.y} stroke="#38bdf8" strokeWidth="1.2" />
            {!isLens && isVirtual && Number.isFinite(imgPt.x) && (
              <line x1={elemX} y1={ray.hitY} x2={imgPt.x} y2={imgPt.y}
                    stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.65" />
            )}
          </g>
        ))}

        {/* Ray 1: parallel-to-axis */}
        <line x1={objX} y1={objTopY} x2={elemX} y2={objTopY} stroke="#0284c7" strokeWidth="2.4" />
        <line x1={elemX} y1={objTopY} x2={out1.x} y2={out1.y} stroke="#0284c7" strokeWidth="2.4" />
        {isVirtual && Number.isFinite(imgPt.x) && (
          <line x1={elemX} y1={objTopY} x2={imgPt.x} y2={imgPt.y}
                stroke="#0284c7" strokeWidth="1.6" strokeDasharray="5 5" opacity="0.65" />
        )}

        {/* Ray 2: chief ray through optical centre / pole */}
        <line x1={objX} y1={objTopY} x2={elemX} y2={axisY} stroke="#f97316" strokeWidth="2.4" />
        <line x1={elemX} y1={axisY} x2={out2.x} y2={out2.y} stroke="#f97316" strokeWidth="2.4" />
        {isVirtual && Number.isFinite(imgPt.x) && (
          <line x1={elemX} y1={axisY} x2={imgPt.x} y2={imgPt.y}
                stroke="#f97316" strokeWidth="1.6" strokeDasharray="5 5" opacity="0.65" />
        )}

        {/* Image — green if real, amber if virtual */}
        {Number.isFinite(vS) && (
          <>
            <line x1={imageX} y1={axisY} x2={imageX} y2={imgTopY}
                  stroke={isReal ? "#10b981" : "#f59e0b"} strokeWidth="5"
                  strokeDasharray={isReal ? undefined : "4 3"} />
            {renderArrow(imageX, imgTopY, axisY, isReal ? "#10b981" : "#f59e0b")}
            <circle cx={imageX} cy={imgTopY - (imgTopY < axisY ? 6 : -6)} r="5"
                    fill={isReal ? "#dcfce7" : "#fef3c7"} stroke={isReal ? "#10b981" : "#f59e0b"}
                    strokeWidth="2" opacity="0.2" />
            <text x={clamp(imageX - 18, 10, W - 72)} y={imgTopY - (imgTopY < axisY ? 12 : -20)}
                  fontSize="12" fontWeight="900" fill={isReal ? "#10b981" : "#f59e0b"}>
              {isReal
                ? (isAs ? "প্ৰকৃত প্ৰতিচ্ছবি" : "real image")
                : (isAs ? "আভাসী প্ৰতিচ্ছবি" : "virtual image")}
            </text>
          </>
        )}
      </svg>

      {/* 4 readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        <SimNumber label={isAs ? "বস্তু |u|"          : "object |u|"}    value={u}    unit=" cm" color="#dc2626" precision={0} />
        <SimNumber label={isAs ? "প্ৰতিচ্ছবি |v|"     : "image |v|"}     value={Number.isFinite(vS) ? Math.abs(vS) : Infinity}
                   unit=" cm" color={isReal ? "#10b981" : "#f59e0b"} precision={1} />
        <SimNumber label={isAs ? "বিবৰ্ধন"             : "magnification"} value={Number.isFinite(m) ? m : Infinity}
                   color="#ea580c" precision={2} />
        <SimNumber label={isAs ? "প্ৰতিচ্ছবি উচ্চতা" : "image height"}  value={Number.isFinite(hi) ? hi : Infinity}
                   unit=" cm" color="#2563eb" precision={1} />
      </div>

      {/* Two status pills: image description + screen text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        <div data-testid="text-image-desc"
             className="px-3 py-2 rounded-xl text-xs font-black text-center liquid-inner text-gray-700 dark:text-gray-200">
          {desc}
        </div>
        <div className="px-3 py-2 rounded-xl text-xs font-black text-center liquid-inner text-gray-700 dark:text-gray-200">
          {screenText}
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <SimResetButton onClick={() => { setType("cv"); setF(18); setU(42); setHo(16); setScreen(42); }} />
      </div>
    </SimContainer>
  );
}

/* ───────────────────────────────────────────────────────────
   14. Refraction Through Glass Slab — animated photons + Snell's law
   ─────────────────────────────────────────────────────────── */
export function RefractionSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [angleDeg, setAngleDeg] = useState(45);
  const [thickness, setThickness] = useState(120);
  const [n2, setN2] = useState(1.5);
  const inRef  = useRef<SVGLineElement | null>(null);
  const midRef = useRef<SVGLineElement | null>(null);
  const outRef = useRef<SVGLineElement | null>(null);

  useRafLoop(true, () => {
    const t = performance.now() / 1000;
    const baseSpeed = 150;
    const slowed    = baseSpeed / n2;
    if (inRef.current)  inRef.current.style.strokeDashoffset  = `${-t * baseSpeed}`;
    if (midRef.current) midRef.current.style.strokeDashoffset = `${-t * slowed}`;
    if (outRef.current) outRef.current.style.strokeDashoffset = `${-t * baseSpeed}`;
  });

  const n1 = 1;
  const i = (angleDeg * Math.PI) / 180;
  const r = Math.asin((n1 / n2) * Math.sin(i));
  const rDeg = (r * 180) / Math.PI;
  const lateralDisp = (thickness * Math.sin(i - r)) / Math.cos(r);

  const VW = 600, VH = 400;
  const cx = VW / 2;
  const cy = 120;            // top of glass
  const sx = cx - 150 * Math.sin(i);
  const sy = cy - 150 * Math.cos(i);
  const ex = cx + thickness * Math.tan(r);
  const ey = cy + thickness;
  const fx = ex + 150 * Math.sin(i);
  const fy = ey + 150 * Math.cos(i);
  const undeflectedX = cx + (thickness + 100) * Math.tan(i);
  const undeflectedY = cy + thickness + 100;

  const matLabel =
    n2 === 1.33 ? (isAs ? "পানী" : "Water")
    : n2 === 1.5 ? (isAs ? "ক্ৰাউন কাঁচ" : "Crown Glass")
    : n2 === 1.65 ? (isAs ? "ফ্লিন্ট কাঁচ" : "Flint Glass")
    : n2 === 2.42 ? (isAs ? "হীৰা" : "Diamond")
    : "Medium";

  let feedback = isAs
    ? `পোহৰ ${matLabel} ৰ ভিতৰত (n=${n2.toFixed(2)}) সোমাইছে। ঘন মাধ্যম হোৱা বাবে পোহৰৰ গতি কমি যায় আৰু ৰশ্মি অভিলম্বৰ ফালে বেঁকা হয়।`
    : `Light enters ${matLabel} (n=${n2.toFixed(2)}). Because it's denser than air, the light photons physically slow down, causing the ray to bend toward the normal.`;
  if (angleDeg === 0) {
    feedback = isAs
      ? "০° আপতনত পোহৰ পোনে পোনে সোমায়, বেঁকা নহয় — কিন্তু মাধ্যমৰ ভিতৰত গতি কমি যায়!"
      : "At 0° incidence, the light passes straight through without bending, but the photons still slow down while inside the medium!";
  }

  return (
    <SimContainer hint={isAs
      ? "স্নেলৰ সূত্ৰ: n₁·sin(i) = n₂·sin(r)। কাঁচৰ ভিতৰত ফোটনৰ গতি কমি যোৱাটো লক্ষ্য কৰক!"
      : "Snell's Law: n₁·sin(i) = n₂·sin(r). Observe the speed of the photons slowing down inside the slab!"}>
      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <SimSlider label={isAs ? "আপতন কোণ (i)" : "Angle of Incidence (i)"} value={angleDeg} onChange={setAngleDeg}
                   min={0} max={80} step={1} unit="°" color="#3b82f6" />
        <SimSlider label={isAs ? "প্লেটৰ মোটা" : "Slab Thickness"} value={thickness} onChange={setThickness}
                   min={60} max={200} step={5} unit=" mm" color="#8b5cf6" />
        <div className="flex flex-col justify-center col-span-2 sm:col-span-2 px-2">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "প্লেটৰ পদাৰ্থ" : "Slab Material"}
          </label>
          <select value={n2} onChange={(e) => setN2(parseFloat(e.target.value))}
                  className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full">
            <option value={1.33}>{isAs ? "পানী (n = 1.33)" : "Water (n = 1.33)"}</option>
            <option value={1.5}>{isAs ? "ক্ৰাউন কাঁচ (n = 1.50)" : "Crown Glass (n = 1.50)"}</option>
            <option value={1.65}>{isAs ? "ঘন ফ্লিন্ট কাঁচ (n = 1.65)" : "Dense Flint Glass (n = 1.65)"}</option>
            <option value={2.42}>{isAs ? "হীৰা (n = 2.42)" : "Diamond (n = 2.42)"}</option>
          </select>
        </div>
      </div>

      {/* Scene */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-4 bg-[#0a0f1c] w-full h-[280px] sm:h-[400px]">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{ background: `radial-gradient(circle at 50% 50%, ${n2 > 2 ? "#6ee7b7" : "#38bdf8"}, transparent 60%)` }} />
        <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="ref-laser" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Normals (entry + exit) */}
          <line x1={cx} y1={cy - 80} x2={cx} y2={cy + thickness + 40}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 6" />
          <line x1={ex} y1={ey - 40} x2={ex} y2={ey + 80}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 6" />

          {/* Glass slab */}
          <rect x={cx - 200} y={cy} width={400} height={thickness} fill="rgba(56,189,248,0.15)" stroke="#0ea5e9" strokeWidth="2" rx="4" />
          <rect x={cx - 200} y={cy} width={400} height={thickness} fill="url(#ref-laser)" opacity="0.05" rx="4" />
          <text x={cx + 100} y={cy + 30} fill="rgba(56,189,248,0.6)" fontSize="16" fontWeight="900" letterSpacing="2">
            {matLabel.toUpperCase()}
          </text>
          <text x={cx + 100} y={cy + 50} fill="rgba(56,189,248,0.4)" fontSize="12" fontWeight="800" fontStyle="italic">
            n = {n2.toFixed(2)}
          </text>

          {/* Undeflected reference (faint dashed) */}
          <line x1={cx} y1={cy} x2={undeflectedX} y2={undeflectedY}
                stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

          {/* Incident ray */}
          <line x1={sx} y1={sy} x2={cx} y2={cy} stroke="#fca5a5" strokeWidth="4" />
          <line x1={sx} y1={sy} x2={cx} y2={cy} stroke="#ef4444" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px #ef4444)" }} />
          {/* Refracted ray (inside slab) */}
          <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#fca5a5" strokeWidth="4" opacity="0.7" />
          <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#ef4444" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px #ef4444)" }} />
          {/* Emergent ray */}
          <line x1={ex} y1={ey} x2={fx} y2={fy} stroke="#fca5a5" strokeWidth="4" />
          <line x1={ex} y1={ey} x2={fx} y2={fy} stroke="#ef4444" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px #ef4444)" }} />

          {/* Animated photons (white dotted overlay, slows inside glass) */}
          <line ref={inRef}  x1={sx} y1={sy} x2={cx} y2={cy}
                stroke="#ffffff" strokeWidth="2" strokeDasharray="1 30" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px white)" }} />
          <line ref={midRef} x1={cx} y1={cy} x2={ex} y2={ey}
                stroke="#ffffff" strokeWidth="2" strokeDasharray="1 30" strokeLinecap="round" opacity="0.8" />
          <line ref={outRef} x1={ex} y1={ey} x2={fx} y2={fy}
                stroke="#ffffff" strokeWidth="2" strokeDasharray="1 30" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px white)" }} />

          {/* Angle arcs + labels */}
          {angleDeg > 0 && (
            <g>
              <path d={`M ${cx} ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(i)} ${cy - 40 * Math.cos(i)}`}
                    fill="none" stroke="#60a5fa" strokeWidth="2" />
              <text x={cx - 20 * Math.sin(i) - 25} y={cy - 20 * Math.cos(i) - 10}
                    fill="#60a5fa" fontSize="13" fontWeight="800">i={angleDeg}°</text>
              <path d={`M ${cx} ${cy + 50} A 50 50 0 0 0 ${cx + 50 * Math.sin(r)} ${cy + 50 * Math.cos(r)}`}
                    fill="none" stroke="#f59e0b" strokeWidth="2" />
              <text x={cx + 25 * Math.sin(r) + 10} y={cy + 25 * Math.cos(r) + 15}
                    fill="#f59e0b" fontSize="13" fontWeight="800">r={rDeg.toFixed(1)}°</text>
              <path d={`M ${ex} ${ey + 40} A 40 40 0 0 0 ${ex + 40 * Math.sin(i)} ${ey + 40 * Math.cos(i)}`}
                    fill="none" stroke="#34d399" strokeWidth="2" />
              <text x={ex + 20 * Math.sin(i) + 15} y={ey + 20 * Math.cos(i) + 15}
                    fill="#34d399" fontSize="13" fontWeight="800">e={angleDeg}°</text>
              {/* Lateral displacement arrow */}
              <line x1={ex} y1={ey} x2={ex + lateralDisp * Math.cos(i)} y2={ey - lateralDisp * Math.sin(i)}
                    stroke="#a78bfa" strokeWidth="2" strokeDasharray="2 2" />
              <text x={ex + (lateralDisp / 2) * Math.cos(i) + 8} y={ey - (lateralDisp / 2) * Math.sin(i) - 5}
                    fill="#a78bfa" fontSize="13" fontWeight="800">d = {lateralDisp.toFixed(1)}</text>
            </g>
          )}
        </svg>
      </div>

      {/* Snell's Law card */}
      <div className="w-full bg-[#0a0f1c] border border-sky-500/30 p-3 mb-4 rounded-xl shadow-lg flex flex-col items-center justify-center">
        <div className="text-[10px] font-black uppercase text-gray-400 mb-1.5 tracking-wider">
          {isAs ? "স্নেলৰ সূত্ৰ" : "Snell's Law"}
        </div>
        <div className="flex items-center gap-3 font-mono font-black text-sm sm:text-base">
          <span className="text-sky-400">n₁ · sin(i)</span>
          <span className="text-white">=</span>
          <span className="text-amber-400">n₂ · sin(r)</span>
        </div>
        <div className="flex items-center gap-3 font-mono font-bold text-xs sm:text-sm mt-1.5 opacity-80">
          <span className="text-sky-300">1.00 × {Math.sin(i).toFixed(3)}</span>
          <span className="text-white">=</span>
          <span className="text-amber-300">{n2.toFixed(2)} × {Math.sin(r).toFixed(3)}</span>
        </div>
      </div>

      <div className="w-full bg-slate-900 border border-sky-500/30 p-3 mb-4 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-sky-100 leading-relaxed">{feedback}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <SimNumber label={isAs ? "প্ৰতিসৰণ কোণ"   : "Refraction Angle"} value={rDeg}         unit="°"      color="#f59e0b" precision={1} />
        <SimNumber label={isAs ? "নিৰ্গমন কোণ"    : "Emergence Angle"}  value={angleDeg}     unit="°"      color="#34d399" precision={1} />
        <SimNumber label={isAs ? "পাৰ্শ্ব সৰণ"   : "Lateral Disp."}     value={lateralDisp}  unit=" mm"    color="#a78bfa" precision={1} />
        <SimNumber label={isAs ? "পোহৰৰ গতি"     : "Light Speed"}      value={300 / n2}     unit=" Mm/s"  color="#ef4444" precision={0} />
      </div>
    </SimContainer>
  );
}

/* ───────────────────────────────────────────────────────────
   15. Power of Lens — convex/concave with draggable object + ray tracing
   ─────────────────────────────────────────────────────────── */
type PowLensType = "convex" | "concave";

export function PowerOfLensSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [type, setType] = useState<PowLensType>("convex");
  const [f, setF]     = useState(50);    // cm
  const [u, setU]     = useState(-100);  // cm (negative = left of lens)
  const [dashOffset, setDashOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useRafLoop(true, (dt) => setDashOffset((o) => o - dt * 40));

  const fSigned = type === "convex" ? f : -f;
  const power   = 100 / fSigned;          // dioptres (f in cm → m: f/100, P = 100/f)
  const objX    = 200 + u;                // viewBox x
  const objH    = 40;
  const objTopY = 100 - objH;
  const objRise = (100 - objTopY) / fSigned;   // ratio for parallel ray
  const chiefRise = (100 - objTopY) / -u;       // ratio for chief ray

  // Image distance via thin lens: 1/v − 1/u = 1/f  →  v = 1 / (1/f + 1/u)
  let vSigned = 0;
  if (Math.abs(u + fSigned) < 0.1) vSigned = 9999;
  else vSigned = 1 / (1 / fSigned + 1 / u);
  const mag      = vSigned !== 9999 ? vSigned / u : 9999;
  const imgH     = vSigned !== 9999 ? mag * objH  : 9999;
  const imgX     = 200 + vSigned;
  const imgTopY  = 100 - imgH;
  const isVirtual = vSigned < 0 && vSigned !== 9999;
  const imgArrowDir = imgH > 0 ? 1 : -1;

  // Lens visual path
  const lensH = Math.max(10, 800 / f);
  const lensPath = type === "convex"
    ? `M 200 15 Q ${200 + lensH} 100 200 185 Q ${200 - lensH} 100 200 15`
    : `M ${200 - lensH / 2} 15 L ${200 + lensH / 2} 15 Q 200 100 ${200 + lensH / 2} 185 L ${200 - lensH / 2} 185 Q 200 100 ${200 - lensH / 2} 15`;

  // Drag-to-move object
  const onPtrDown = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    if (Math.abs(loc.x - objX) < 40) {
      setDragging(true);
      (e.target as Element).setPointerCapture(e.pointerId);
    }
  };
  const onPtrMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    const newU = Math.max(-180, Math.min(-20, loc.x - 200));
    setU(newU);
  };
  const onPtrUp = () => setDragging(false);

  let feedback = "";
  if (vSigned === 9999) {
    feedback = isAs
      ? "বস্তু ফোকাছ বিন্দুত আছে। প্ৰতিসৰিত ৰশ্মি একে দিশত যায়, প্ৰতিচ্ছবি অসীমত।"
      : "Object is at the focal point. Refracted rays emerge perfectly parallel, forming an image at infinity.";
  } else if (isVirtual) {
    feedback = isAs
      ? `এক আভাসী, ${Math.abs(mag) > 1 ? "বিবৰ্ধিত" : "ক্ষুদ্ৰীকৃত"}, সিধা প্ৰতিচ্ছবি গঠন হৈছে। লেন্সৰ পিছফালৰ পৰা ৰশ্মি যেন আহিছে দেখা যায়।`
      : `A VIRTUAL, ${Math.abs(mag) > 1 ? "MAGNIFIED" : "DIMINISHED"}, and UPRIGHT image is formed. Notice how the light rays appear to diverge from behind the lens.`;
  } else {
    feedback = isAs
      ? `এক প্ৰকৃত, ${Math.abs(mag) > 1 ? "বিবৰ্ধিত" : "ক্ষুদ্ৰীকৃত"}, ওলোটা প্ৰতিচ্ছবি গঠন হৈছে। ৰশ্মিসমূহ একত্ৰিত হৈ প্ৰতিচ্ছবি গঠন কৰে।`
      : `A REAL, ${Math.abs(mag) > 1 ? "MAGNIFIED" : "DIMINISHED"}, and INVERTED image is formed. The light rays physically converge to create the image.`;
  }

  return (
    <SimContainer
      onReset={() => { setType("convex"); setF(50); setU(-100); }}
      hint={isAs
        ? "লেন্সৰ ক্ষমতা (P) = 1/f (মিটাৰত)। কম ফোকাছ দূৰত্বই অধিক পোহৰ বেঁকা কৰে, অৰ্থাৎ অধিক ক্ষমতা!"
        : "Lens Power (P) = 1/f (in meters). Shorter focal lengths bend light more aggressively, resulting in higher power!"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-center px-1">
            <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
              {isAs ? "লেন্সৰ প্ৰকাৰ" : "Lens Type"}
            </label>
            <select value={type} onChange={(e) => setType(e.target.value as PowLensType)}
                    className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full">
              <option value="convex">{isAs ? "উত্তল (অভিসৰণকাৰী)" : "Convex (Converging)"}</option>
              <option value="concave">{isAs ? "অবতল (অপসৰণকাৰী)" : "Concave (Diverging)"}</option>
            </select>
          </div>
          <SimSlider label={isAs ? "বস্তুৰ দূৰত্ব (u)" : "Object Distance (u)"} value={-u} onChange={(v) => setU(-v)}
                     min={20} max={180} step={1} unit=" cm" color="#38bdf8" />
          <SimSlider label={isAs ? "ফোকাছ দূৰত্ব (|f|)" : "Focal Length (|f|)"} value={f} onChange={setF}
                     min={20} max={150} step={1} unit=" cm" color="#a855f7" />
        </div>

        <div className="lg:col-span-2 bg-[#0f172a]/50 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <SimNumber label={isAs ? "প্ৰতিচ্ছবিৰ দূৰত্ব (v)" : "Image Dist (v)"}
                       value={vSigned === 9999 ? NaN : vSigned} unit=" cm"
                       color={isVirtual ? "#a855f7" : "#10b981"} precision={1} />
            <SimNumber label={isAs ? "বিবৰ্ধন (m)" : "Mag (m)"}
                       value={mag === 9999 ? NaN : mag} unit="x" color="#ec4899" precision={2} />
            <SimNumber label={isAs ? "ফোকাছ দূৰত্ব (f)" : "Focal Len (f)"} value={fSigned} unit=" cm" color="#a855f7" precision={0} />
            <SimNumber label={isAs ? "লেন্সৰ ক্ষমতা (P)" : "Lens Power (P)"} value={power} unit=" D" color="#facc15" precision={2} />
          </div>
          <p className="text-xs font-bold text-gray-400 mt-4 text-center">
            {isAs ? "সম্পৰ্ক: " : "Relationship: "}<span className="text-fuchsia-400">P = 100 / f</span>
          </p>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#020617] to-[#0f172a] touch-none mb-4 w-full h-[320px]">
        <svg ref={svgRef} viewBox="0 0 400 200"
             className="w-full h-full absolute inset-0 cursor-crosshair"
             preserveAspectRatio="xMidYMid meet"
             onPointerDown={onPtrDown} onPointerMove={onPtrMove} onPointerUp={onPtrUp} onPointerLeave={onPtrUp}>
          <line x1="0" y1="100" x2="400" y2="100" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />
          {/* Focal points */}
          <circle cx={200 - f} cy={100} r="4" fill="#94a3b8" />
          <text x={200 - f} y={115} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">F</text>
          <circle cx={200 + f} cy={100} r="4" fill="#94a3b8" />
          <text x={200 + f} y={115} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">F'</text>

          {/* Lens shape */}
          <path d={lensPath} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 12px rgba(56,189,248,0.4))" }} />
          <line x1="200" y1="10" x2="200" y2="190" stroke="#38bdf8" strokeDasharray="2 4" strokeWidth="1" opacity="0.5" />

          {/* Virtual image back-trace */}
          {isVirtual && vSigned !== 9999 && (
            <g opacity={0.6}>
              <line x1={200} y1={objTopY} x2={imgX} y2={imgTopY} stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
              <line x1={200} y1={100}     x2={imgX} y2={imgTopY} stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" />
            </g>
          )}

          {/* Animated rays */}
          <g style={{ filter: "drop-shadow(0 0 6px rgba(250,204,21,0.6))" }}>
            <path d={`M ${objX} ${objTopY} L 200 ${objTopY} L 400 ${objTopY + objRise * 200}`}
                  fill="none" stroke="rgba(250, 204, 21, 0.2)" strokeWidth="6" />
            <path d={`M ${objX} ${objTopY} L 200 ${objTopY} L 400 ${objTopY + objRise * 200}`}
                  fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="8 12" strokeDashoffset={dashOffset} />
            <path d={`M ${objX} ${objTopY} L 200 100 L 400 ${100 + chiefRise * 200}`}
                  fill="none" stroke="rgba(250, 204, 21, 0.2)" strokeWidth="6" />
            <path d={`M ${objX} ${objTopY} L 200 100 L 400 ${100 + chiefRise * 200}`}
                  fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="8 12" strokeDashoffset={dashOffset} />
          </g>

          {/* Object arrow (draggable) */}
          <g style={{ cursor: "ew-resize" }}>
            <line x1={objX} y1={100} x2={objX} y2={objTopY} stroke="#38bdf8" strokeWidth={4} />
            <polygon points={`${objX},${objTopY} ${objX - 5},${objTopY + 6} ${objX + 5},${objTopY + 6}`} fill="#38bdf8" />
            <text x={objX} y={objTopY - 15} fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">
              {isAs ? "বস্তু" : "Object"}
            </text>
            <circle cx={objX} cy={100} r={20} fill="transparent"
                    stroke={dragging ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"} strokeWidth="2" />
          </g>

          {/* Image arrow */}
          {vSigned !== 9999 && (
            <g>
              <line x1={imgX} y1={100} x2={imgX} y2={imgTopY}
                    stroke={isVirtual ? "#a855f7" : "#10b981"} strokeWidth="4"
                    strokeDasharray={isVirtual ? "4 4" : "none"} />
              <polygon points={`${imgX},${imgTopY} ${imgX - 5},${imgTopY + 6 * imgArrowDir} ${imgX + 5},${imgTopY + 6 * imgArrowDir}`}
                       fill={isVirtual ? "#a855f7" : "#10b981"} />
              <text x={imgX} y={imgH > 0 ? imgTopY - 10 : imgTopY + 15}
                    fill={isVirtual ? "#a855f7" : "#10b981"} fontSize="10" textAnchor="middle" fontWeight="bold">
                {isAs ? "প্ৰতিচ্ছবি" : "Image"}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="w-full bg-slate-900 border border-amber-500/30 p-3 mb-4 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-amber-100 leading-relaxed">{feedback}</p>
      </div>
    </SimContainer>
  );
}
