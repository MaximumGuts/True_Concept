import { useState, useRef, useEffect } from "react";
import { SimSlider, SimNumber, SimContainer, SimButton, useRafLoop, StepMode } from "../sim-ui";
import { Play, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* 5. Universal Law of Gravitation — Star + Planet, drag + orbit mode */
export function GravitationSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [m1, setM1] = useState(200);  // star "mass" (visual units)
  const [m2, setM2] = useState(20);   // planet "mass"
  const [p1, setP1] = useState({ x: 200, y: 150 });
  const [p2, setP2] = useState({ x: 300, y: 150 });
  const p1Ref = useRef(p1);
  const p2Ref = useRef(p2);
  const velRef = useRef({ vx: 0, vy: Math.sqrt(5000 / 100) });
  const [orbit, setOrbit] = useState(false);
  const [dragging, setDragging] = useState<1 | 2 | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [showBend, setShowBend] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const r1 = 15 + Math.sqrt(m1) * 1.5;
  const r2 = 8 + Math.sqrt(m2) * 1.5;
  const dist = Math.max(1, Math.hypot(p2.x - p1.x, p2.y - p1.y));
  const force = (m1 * m2 * 1000) / (dist * dist);

  useEffect(() => { p1Ref.current = p1; p2Ref.current = p2; }, [p1, p2]);

  useRafLoop(orbit && dragging === null, (dt) => {
    const step = Math.min(dt, 0.05) * 3;
    const dx = p1Ref.current.x - p2Ref.current.x;
    const dy = p1Ref.current.y - p2Ref.current.y;
    const r2sq = dx * dx + dy * dy;
    const r = Math.max(5, Math.sqrt(r2sq));
    const a = (500 * m1) / r2sq;
    const ax = a * (dx / r);
    const ay = a * (dy / r);
    velRef.current.vx += ax * step;
    velRef.current.vy += ay * step;
    p2Ref.current.x  += velRef.current.vx * step * 20;
    p2Ref.current.y  += velRef.current.vy * step * 20;
    setP2({ x: p2Ref.current.x, y: p2Ref.current.y });
    setTrail((t) => {
      if (t.length === 0 || Math.hypot(t[t.length - 1].x - p2Ref.current.x, t[t.length - 1].y - p2Ref.current.y) > 2) {
        const next = [...t, { x: p2Ref.current.x, y: p2Ref.current.y }];
        if (next.length > 200) next.shift();
        return next;
      }
      return t;
    });
  });

  const onPtrDown = (e: React.PointerEvent, which: 1 | 2) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(which);
    setOrbit(false);
  };
  const onPtrMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    if (dragging === 1) {
      p1Ref.current = { x: loc.x, y: loc.y };
      setP1(p1Ref.current);
    } else {
      p2Ref.current = { x: loc.x, y: loc.y };
      setP2(p2Ref.current);
      setTrail([]);
      const dx = p1Ref.current.x - p2Ref.current.x;
      const dy = p1Ref.current.y - p2Ref.current.y;
      const r = Math.max(10, Math.sqrt(dx * dx + dy * dy));
      // give it tangential velocity for orbit
      const speed = Math.sqrt((25 * m1) / r);
      velRef.current = { vx: -dy / r * speed, vy: dx / r * speed };
    }
  };
  const onPtrUp = (e: React.PointerEvent) => {
    if (dragging) { (e.target as Element).releasePointerCapture(e.pointerId); setDragging(null); }
  };

  const reset = () => {
    setOrbit(false);
    p1Ref.current = { x: 200, y: 150 }; setP1(p1Ref.current);
    p2Ref.current = { x: 300, y: 150 }; setP2(p2Ref.current);
    setTrail([]);
    velRef.current = { vx: 0, vy: Math.sqrt(5000 / 100) };
  };

  // Space-bending grid (light distortion around masses)
  const renderBendGrid = () => {
    if (!showBend) return null;
    const paths: React.ReactNode[] = [];
    const step = 20;
    for (let x0 = 0; x0 <= 400; x0 += step) {
      let d = `M ${x0} 0 `;
      for (let y0 = 0; y0 <= 300; y0 += 15) {
        let px = x0, py = y0;
        [{ p: p1, m: m1 }, { p: p2, m: m2 }].forEach(({ p, m }) => {
          const r = Math.max(10, Math.hypot(px - p.x, py - p.y));
          const pull = Math.min(r - 5, (m * 0.2) / (r / 20));
          if (r < 120) { px -= ((px - p.x) / r) * pull; py -= ((py - p.y) / r) * pull; }
        });
        d += `L ${px} ${py} `;
      }
      paths.push(<path key={`v${x0}`} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />);
    }
    for (let y0 = 0; y0 <= 300; y0 += step) {
      let d = `M 0 ${y0} `;
      for (let x0 = 0; x0 <= 400; x0 += 15) {
        let px = x0, py = y0;
        [{ p: p1, m: m1 }, { p: p2, m: m2 }].forEach(({ p, m }) => {
          const r = Math.max(10, Math.hypot(px - p.x, py - p.y));
          const pull = Math.min(r - 5, (m * 0.2) / (r / 20));
          if (r < 120) { px -= ((px - p.x) / r) * pull; py -= ((py - p.y) / r) * pull; }
        });
        d += `L ${px} ${py} `;
      }
      paths.push(<path key={`h${y0}`} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />);
    }
    return paths;
  };

  // Force vectors (drawn between masses)
  const fLen = Math.min(60, Math.max(10, force / 5));
  const theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const f1x = p1.x + Math.cos(theta) * r1;
  const f1y = p1.y + Math.sin(theta) * r1;
  const f1x2 = f1x + Math.cos(theta) * fLen;
  const f1y2 = f1y + Math.sin(theta) * fLen;
  const f2x = p2.x - Math.cos(theta) * r2;
  const f2y = p2.y - Math.sin(theta) * r2;
  const f2x2 = f2x - Math.cos(theta) * fLen;
  const f2y2 = f2y - Math.sin(theta) * fLen;

  let feedback = isAs
    ? "গ্ৰহসমূহ টানি দেখক যে দূৰত্বই মাধ্যাকৰ্ষণ কেনেদৰে প্ৰভাৱিত কৰে। স্থান কেনেদৰে বেঁকা হৈছে লক্ষ্য কৰক!"
    : "Drag the planets to see how distance affects gravity. Notice how space bends around them!";
  if (orbit) {
    feedback = isAs
      ? "কক্ষপথত! স্পৰ্শবেগে মাধ্যাকৰ্ষণিক টানক ঠিক ভাৰসাম্য কৰি স্থিৰ কক্ষপথ ৰাখিছে।"
      : "Orbiting! Tangential velocity perfectly balances the gravitational pull, keeping it in stable orbit.";
  } else if (force > 500) {
    feedback = isAs
      ? "বিশাল মাধ্যাকৰ্ষণ! উচ্চ ভৰ বা ওচৰৰ অৱস্থানৰ বাবে বল অত্যন্ত প্ৰবল।"
      : "Immense Gravity! The force is extremely strong due to high mass or close proximity.";
  } else if (dist > 200) {
    feedback = isAs
      ? "দূৰত্ব বঢ়াৰ লগে লগে বল ব্যস্তসমানুপাতিক বৰ্গ নিয়ম অনুসৰি বৃহৎ হাৰত কমে।"
      : "As distance increases, the force drops exponentially (Inverse-Square Law).";
  }

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "F = G·m₁·m₂ / r²। ব্যস্তসমানুপাতিক বৰ্গ নিয়ম দৃশ্যমানভাৱে লক্ষ্য কৰক।"
        : "F = G·m₁·m₂ / r². Observe the inverse-square law visually."}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <SimSlider label={isAs ? "ভৰ m₁ (তৰা)"   : "Mass m₁ (Star)"}   value={m1} onChange={setM1} min={50} max={500} step={10} color="#f59e0b" />
        <SimSlider label={isAs ? "ভৰ m₂ (গ্ৰহ)"  : "Mass m₂ (Planet)"} value={m2} onChange={setM2} min={5}  max={100} step={5}  color="#0ea5e9" />
        <div className="flex flex-col justify-center gap-2 col-span-2 sm:col-span-2 px-2">
          <div className="flex gap-2">
            <SimButton onClick={() => setOrbit(!orbit)} color={orbit ? "#ef4444" : "#10b981"}
                       icon={orbit ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}>
              {orbit ? (isAs ? "কক্ষপথ ৰখাওক" : "Pause Orbit") : (isAs ? "কক্ষপথ আৰম্ভ" : "Start Orbit")}
            </SimButton>
            <SimButton onClick={reset} color="#64748b" icon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isAs ? "ৰিছেট" : "Reset"}
            </SimButton>
          </div>
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase cursor-pointer">
            <input type="checkbox" checked={showBend} onChange={(e) => setShowBend(e.target.checked)}
                   className="w-3.5 h-3.5 text-indigo-500 rounded focus:ring-indigo-500" />
            {isAs ? "স্থান বেঁকা দেখুৱাওক" : "Show Space Bending"}
          </label>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-4 bg-[#0a0f1c] touch-none" style={{ height: "300px" }}
           onPointerMove={onPtrMove} onPointerUp={onPtrUp} onPointerLeave={onPtrUp}>
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" style={{
          backgroundImage: "radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, #aaa, rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0))",
          backgroundSize: "200px 200px",
        }} />
        {/* Formula tag */}
        <div className="absolute top-3 left-3 bg-black/60 border border-white/10 backdrop-blur-md px-3 py-2 rounded-xl pointer-events-none">
          <div className="text-[10px] font-black uppercase text-gray-400 mb-1">
            {isAs ? "সাৰ্বজনীন মাধ্যাকৰ্ষণ" : "Universal Gravitation"}
          </div>
          <div className="flex items-center gap-2 font-mono font-black text-sm text-orange-400">
            <span>F = G</span>
            <div className="flex flex-col items-center justify-center leading-none text-xs">
              <span className="border-b border-orange-400/50 pb-0.5">m₁ m₂</span>
              <span className="pt-0.5">r²</span>
            </div>
            <span className="text-white">=</span>
            <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{force.toFixed(1)} N</span>
          </div>
        </div>

        <svg ref={svgRef} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="w-full h-full cursor-crosshair">
          <defs>
            <radialGradient id="grav-starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fde047" stopOpacity="1" />
              <stop offset="40%"  stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="grav-planetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="1" />
              <stop offset="60%"  stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
            <marker id="grav-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="#f43f5e" />
            </marker>
          </defs>

          {renderBendGrid()}

          {/* Orbit trail */}
          {trail.length > 1 && (
            <path d={`M ${trail.map((t) => `${t.x},${t.y}`).join(" L ")}`}
                  fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
          )}
          {/* Line between masses */}
          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 4" />
          {/* Force vectors */}
          {force > 0.1 && (
            <>
              <line x1={f1x} y1={f1y} x2={f1x2} y2={f1y2} stroke="#f43f5e" strokeWidth="3" markerEnd="url(#grav-arrow)" />
              <line x1={f2x} y1={f2y} x2={f2x2} y2={f2y2} stroke="#f43f5e" strokeWidth="3" markerEnd="url(#grav-arrow)" />
            </>
          )}

          {/* Star (m1) */}
          <g transform={`translate(${p1.x}, ${p1.y})`} onPointerDown={(e) => onPtrDown(e, 1)} className="cursor-grab active:cursor-grabbing">
            <circle cx="0" cy="0" r={r1 * 3} fill="url(#grav-starGlow)" opacity={0.4 + m1 / 1000} />
            <circle cx="0" cy="0" r={r1}      fill="#fbbf24" stroke="#fffbeb" strokeWidth="2" />
            <text x="0" y="4" fill="#78350f" fontSize="10" fontWeight="900" textAnchor="middle" pointerEvents="none">m₁</text>
          </g>
          {/* Planet (m2) */}
          <g transform={`translate(${p2.x}, ${p2.y})`} onPointerDown={(e) => onPtrDown(e, 2)} className="cursor-grab active:cursor-grabbing">
            <circle cx="0" cy="0" r={r2 * 2.5} fill="url(#grav-planetGlow)" opacity={0.4 + m2 / 200} />
            <circle cx="0" cy="0" r={r2}       fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="1.5" />
            <text x="0" y="3" fill="#0c4a6e" fontSize="9" fontWeight="900" textAnchor="middle" pointerEvents="none">m₂</text>
          </g>
        </svg>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-black/60 border border-indigo-500/30 backdrop-blur-md p-2.5 rounded-xl shadow-xl text-center pointer-events-none">
          <p className="text-xs font-bold text-indigo-100 leading-snug">{feedback}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SimNumber label={isAs ? "দূৰত্ব (r)"          : "Distance (r)"}        value={dist}  unit="Mm" color="#8b5cf6" precision={0} />
        <SimNumber label={isAs ? "মাধ্যাকৰ্ষণিক বল"  : "Gravitational Force"} value={force} unit="N"  color="#10b981" precision={1} />
      </div>

      <StepMode steps={isAs ? [
        { title: "ভৰ আৰু বল",      body: "যিকোনো গ্ৰহৰ ভৰ স্লাইডাৰেৰে বঢ়াওক। উভয় দিশৰ বল ভেক্টৰ তৎক্ষণাত ডাঙৰ হোৱা চাওক!" },
        { title: "দূৰত্বৰ প্ৰভাৱ", body: "নীলা গ্ৰহটো তৰাৰ পৰা আঁতৰাই নিয়ক। ব্যস্তসমানুপাতিক বৰ্গ নিয়মৰ বাবে বল বৃহৎ হাৰত কমিব।" },
        { title: "কক্ষপথ ধৰণ",     body: "গ্ৰহটো টানি 'কক্ষপথ আৰম্ভ' টিপক। স্পৰ্শবেগে মাধ্যাকৰ্ষণিক টানক ঠিক ভাৰসাম্য কৰি স্থিৰ বৃত্তাকাৰ কক্ষপথ ৰাখিব।" },
        { title: "স্থান বেঁকা",   body: "'স্থান বেঁকা দেখুৱাওক' সক্ৰিয় কৰি আইনষ্টাইনৰ ধাৰণা চাওক: বিশাল বস্তুসমূহে কাৰ্যত স্থান-কাল কাপোৰ বিকৃত কৰে!" },
      ] : [
        { title: "Mass & Force",   body: "Increase the mass of either planet using the sliders. Watch the bidirectional force vectors grow instantly!" },
        { title: "Distance Effect", body: "Drag the blue planet away from the star. The force decreases exponentially due to the Inverse-Square Law." },
        { title: "Orbit Mode",     body: "Drag the planet, then click 'Start Orbit'. Tangential velocity perfectly balances the gravitational pull, keeping it in a stable circular orbit." },
        { title: "Space Bending",  body: "Toggle 'Show Space Bending' to visualize Einstein's concept: Massive objects literally distort the fabric of spacetime around them!" },
      ]} />
    </SimContainer>
  );
}

/* 6. Archimedes Principle — Fluid selector, drag-and-drop, drop physics */
type ArchFluid = "water" | "salt" | "oil" | "mercury";
type ArchObj   = "wood" | "metal" | "custom";

export function ArchimedesSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [fluid, setFluid] = useState<ArchFluid>("water");
  const [objType, setObjType] = useState<ArchObj>("wood");
  const [mass, setMass] = useState(6);
  const [vol, setVol]   = useState(10);
  const [yPos, setYPos] = useState(100);
  const [vy, setVy]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const tRef = useRef(0);
  const G = 9.8;
  const rhoFluid = { water: 1, salt: 1.03, oil: 0.9, mercury: 13.6 }[fluid];

  useEffect(() => {
    if (objType === "wood")  { setMass(6);  setVol(10); }
    if (objType === "metal") { setMass(78); setVol(10); }
  }, [objType]);

  // Geometry (350 × 400 viewBox)
  const VW = 350, VH = 400;
  const beakerWBottom = 220;
  const beakerInset   = (VW - beakerWBottom) / 2;
  const waterTopY     = 240;
  const beakerFloor   = 380;
  const cubeSide      = 60;

  const computePhysics = (y: number) => {
    const bottom = y + cubeSide / 2;
    const top    = y - cubeSide / 2;
    let subD = (bottom - waterTopY) / (1 - cubeSide / beakerWBottom);
    subD = Math.max(0, Math.min(cubeSide, subD));
    const waterLevel = waterTopY - (subD * cubeSide) / beakerWBottom;
    if (top > waterLevel) subD = cubeSide;
    const vSub = vol * (subD / cubeSide);
    const Fb   = rhoFluid * vSub * G;
    const Fg   = mass * G;
    return { subD, waterLevel, vSub, Fb, Fg, boxBottom: bottom };
  };
  const { subD, waterLevel, vSub, Fb, Fg, boxBottom } = computePhysics(yPos);

  // Drop physics (RAF)
  useRafLoop(!dragging, (dt) => {
    tRef.current += dt;
    let acc = (Fg - Fb) / mass;
    if (subD > 0) acc -= 3 * vy;
    else          acc -= 0.1 * vy;
    let newVy = vy + acc * dt * 20;
    let newY  = yPos + newVy * dt * 20;
    if (newY + cubeSide / 2 > beakerFloor) {
      newY = beakerFloor - cubeSide / 2;
      newVy = -newVy * 0.4;
      if (Math.abs(newVy) < 1) newVy = 0;
    }
    setYPos(newY); setVy(newVy);
  });

  // Drag handlers
  const svgRef = useRef<SVGSVGElement | null>(null);
  const onPtrDown = (e: React.PointerEvent) => {
    setDragging(true); setVy(0); updateY(e);
  };
  const onPtrMove = (e: React.PointerEvent) => { if (dragging) updateY(e); };
  const onPtrUp   = () => setDragging(false);
  const updateY = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    let y = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse()).y;
    y = Math.max(-100, Math.min(beakerFloor - cubeSide / 2, y));
    setYPos(y);
  };

  const reset = () => { setYPos(50); setVy(0); tRef.current = 0; };

  // Visual colours
  const fluidFill = fluid === "water" ? "rgba(14,165,233,0.5)"
    : fluid === "salt" ? "rgba(16,185,129,0.5)"
    : fluid === "oil"  ? "rgba(245,158,11,0.6)"
    :                    "rgba(148,163,184,0.9)";
  const fluidLine = fluid === "water" ? "#38bdf8"
    : fluid === "salt" ? "#34d399"
    : fluid === "oil"  ? "#fbbf24"
    :                    "#cbd5e1";
  const objDensity = mass / vol;
  const objColor = objType === "wood" ? "#b45309"
    : objType === "metal" ? "#64748b"
    : objDensity > 4 ? "#475569"
    : objDensity < 0.8 ? "#d97706"
    : "#8b5cf6";
  const objLabel = objType === "custom"
    ? (objDensity > 4 ? (isAs ? "ভাৰী" : "HEAVY") : objDensity < 0.8 ? (isAs ? "ফোপোলা" : "HOLLOW") : (isAs ? "নিজস্ব" : "CUSTOM"))
    : objType === "wood" ? (isAs ? "কাঠ" : "WOOD")
    : (isAs ? "ধাতু" : "METAL");

  // Dynamic feedback
  let feedback = isAs
    ? "আৰ্কিমিডিছৰ নীতি দেখুৱাবলৈ বস্তুটো তৰলত টানি দিয়ক।"
    : "Drag the object into the fluid to observe Archimedes' Principle in action.";
  if (Fb > Fg + 0.1) {
    feedback = isAs
      ? `উৰ্ধমুখী উৎপ্লাৱন বল (${Fb.toFixed(1)} N) ওজন (${Fg.toFixed(1)} N)তকৈ অধিক। ই উঠিছে!`
      : `The upward Buoyant Force (${Fb.toFixed(1)} N) is greater than Weight (${Fg.toFixed(1)} N). It's rising!`;
  } else if (Math.abs(Fb - Fg) <= 0.5 && subD > 0 && subD < cubeSide) {
    feedback = isAs
      ? "ভাৰসাম্য! উৎপ্লাৱন বলে ওজনক ঠিক ভাৰসাম্য কৰে। বস্তুটো স্বাভাৱিকভাৱে ভাহি আছে।"
      : "Equilibrium! Buoyant Force perfectly balances Weight. The object naturally floats.";
  } else if (Fb < Fg && boxBottom >= beakerFloor - 1) {
    feedback = isAs
      ? "ওজনে সম্ভাব্য সৰ্বোচ্চ উৎপ্লাৱন বলক অতিক্ৰম কৰিছে। বস্তুটো তলত পৰিল।"
      : "Weight exceeds the maximum possible Buoyant Force. The object sinks to the bottom.";
  } else if (Fb < Fg && subD > 0) {
    feedback = isAs
      ? `ওজন (${Fg.toFixed(1)} N) উৎপ্লাৱন বল (${Fb.toFixed(1)} N)তকৈ অধিক। ডুবিছে!`
      : `Weight (${Fg.toFixed(1)} N) is greater than Buoyant Force (${Fb.toFixed(1)} N). Sinking!`;
  }

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "আৰ্কিমিডিছৰ নীতি: উৎপ্লাৱন বল বাহিৰ হোৱা তৰলৰ ওজনৰ সমান।"
        : "Archimedes' Principle: The buoyant force equals the weight of the displaced fluid."}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="flex flex-col justify-center px-1">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "তৰল" : "Liquid"}
          </label>
          <select value={fluid} onChange={(e) => { setFluid(e.target.value as ArchFluid); reset(); }}
                  className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full">
            <option value="water">{isAs ? "পানী (1.0 kg/L)"      : "Water (1.0 kg/L)"}</option>
            <option value="salt">{isAs ? "নিমখপানী (1.03 kg/L)" : "Salt Water (1.03 kg/L)"}</option>
            <option value="oil">{isAs   ? "তেল (0.9 kg/L)"        : "Oil (0.9 kg/L)"}</option>
            <option value="mercury">{isAs ? "পাৰদ (13.6 kg/L)"    : "Mercury (13.6 kg/L)"}</option>
          </select>
        </div>
        <div className="flex flex-col justify-center px-1">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "বস্তু" : "Object"}
          </label>
          <select value={objType} onChange={(e) => { setObjType(e.target.value as ArchObj); reset(); }}
                  className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full">
            <option value="wood">{isAs   ? "কাঠৰ ব্লক"  : "Wooden Block"}</option>
            <option value="metal">{isAs  ? "ধাতুৰ ব্লক" : "Metal Block"}</option>
            <option value="custom">{isAs ? "নিজস্ব বস্তু" : "Custom Object"}</option>
          </select>
        </div>
        <SimSlider label={isAs ? "ভৰ (m)" : "Mass (m)"} value={mass}
                   onChange={(v) => { setMass(v); setObjType("custom"); }}
                   min={1} max={100} step={1} unit=" kg" color="#f59e0b" />
        <SimSlider label={isAs ? "আয়তন (V)" : "Volume (V)"} value={vol}
                   onChange={(v) => { setVol(v); setObjType("custom"); }}
                   min={5} max={20} step={1} unit=" L" color="#8b5cf6" />
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#1e293b] touch-none mb-4 w-full h-[350px] sm:h-[420px]"
           onPointerDown={onPtrDown} onPointerMove={onPtrMove} onPointerUp={onPtrUp} onPointerLeave={onPtrUp}>
        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet"
             className="w-full h-full absolute inset-0 cursor-ns-resize active:cursor-grabbing">
          <defs>
            <marker id="arch-arrow-up"   markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 z" fill="#38bdf8" /></marker>
            <marker id="arch-arrow-down" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 z" fill="#f59e0b" /></marker>
            <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={VW} height={VH} fill="url(#arch-grid)" />

          {/* Beaker outline (silhouette) */}
          <path d={`M ${beakerInset - 10} 100 L ${beakerInset} ${beakerFloor} L ${VW - beakerInset} ${beakerFloor} L ${VW - beakerInset + 10} 100`}
                fill="rgba(255,255,255,0.05)" />
          {/* Tick marks */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={beakerInset} x2={beakerInset + 10}
                  y1={beakerFloor - i * 25} y2={beakerFloor - i * 25}
                  stroke="#cbd5e1" strokeWidth="2" opacity="0.3" />
          ))}
          {/* Fluid */}
          <path d={`M ${beakerInset} ${waterLevel} L ${VW - beakerInset} ${waterLevel} L ${VW - beakerInset} ${beakerFloor} L ${beakerInset} ${beakerFloor} Z`}
                fill={fluidFill} className="transition-all duration-75" />
          <line x1={beakerInset} x2={VW - beakerInset} y1={waterLevel} y2={waterLevel}
                stroke={fluidLine} strokeWidth="3" opacity="0.8" className="transition-all duration-75" />

          {/* Object */}
          <g transform={`translate(${VW / 2}, ${yPos})`}>
            <rect x={-cubeSide / 2} y={-cubeSide / 2} width={cubeSide} height={cubeSide}
                  fill={objColor} stroke="rgba(255,255,255,0.3)" strokeWidth="2" rx="4" />
            <text x={0} y={5} fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold">{objLabel}</text>
            <text x={0} y={20} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="middle">
              {(mass / vol).toFixed(1)} kg/L
            </text>
            {/* Buoyant force arrow */}
            {Fb > 0 && (
              <g>
                <line x1={-cubeSide / 2 - 20} y1={cubeSide / 2}
                      x2={-cubeSide / 2 - 20} y2={cubeSide / 2 - Math.min(120, Fb * 0.4)}
                      stroke="#38bdf8" strokeWidth="4" markerEnd="url(#arch-arrow-up)" />
                <text x={-cubeSide / 2 - 30} y={cubeSide / 2 - Math.min(120, Fb * 0.4) - 10}
                      fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="end">
                  Fb = {Fb.toFixed(0)}N
                </text>
              </g>
            )}
            {/* Weight arrow */}
            <g>
              <line x1={cubeSide / 2 + 20} y1={0}
                    x2={cubeSide / 2 + 20} y2={Math.min(120, Fg * 0.4)}
                    stroke="#f59e0b" strokeWidth="4" markerEnd="url(#arch-arrow-down)" />
              <text x={cubeSide / 2 + 30} y={Math.min(120, Fg * 0.4) + 15}
                    fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="start">
                Fg = {Fg.toFixed(0)}N
              </text>
            </g>
          </g>

          {/* Beaker outline (front) */}
          <path d={`M ${beakerInset - 10} 100 L ${beakerInset} ${beakerFloor} L ${VW - beakerInset} ${beakerFloor} L ${VW - beakerInset + 10} 100`}
                fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

          {/* Formula card */}
          <rect x={10} y={15} width={135} height={70} rx="6" fill="rgba(0,0,0,0.7)" stroke="#334155" strokeWidth="1" />
          <text x={20} y={30} fill="#cbd5e1" fontSize="10" fontWeight="bold">F_b = ρ_f · g · V_sub</text>
          <text x={20} y={45} fill="#38bdf8" fontSize="11" fontWeight="bold">F_b = {(rhoFluid * vSub * G).toFixed(1)} N</text>
          <text x={20} y={65} fill="#cbd5e1" fontSize="10">
            {isAs ? "বাহিৰ হোৱা" : "Displaced"}: {vSub.toFixed(1)} L
          </text>
          {/* Density card */}
          <rect x={VW - 105} y={15} width={95} height={60} rx="6" fill="rgba(0,0,0,0.7)" stroke="#334155" strokeWidth="1" />
          <text x={VW - 57} y={30} fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
            {isAs ? "ঘনত্ব (kg/L)" : "Density (kg/L)"}
          </text>
          <text x={VW - 57} y={45} fill="#cbd5e1" fontSize="10" textAnchor="middle">
            {isAs ? "তৰল: " : "Fluid: "}{rhoFluid.toFixed(2)}
          </text>
          <text x={VW - 57} y={55} fill="#cbd5e1" fontSize="10" textAnchor="middle">
            {isAs ? "বস্তু: " : "Object: "}{(mass / vol).toFixed(2)}
          </text>
        </svg>
      </div>

      <div className="w-full bg-slate-900 border border-sky-500/30 p-3 mb-4 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-sky-100 leading-relaxed">{feedback}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <SimNumber label={isAs ? "নিমজ্জিত আয়তন" : "Submerged Vol"} value={vSub}       unit=" L" color="#0891b2" precision={1} />
        <SimNumber label={isAs ? "উৎপ্লাৱন বল"   : "Buoyant Force"} value={Fb}         unit=" N" color="#0ea5e9" precision={1} />
        <SimNumber label={isAs ? "ওজন"            : "Weight"}        value={Fg}         unit=" N" color="#f59e0b" precision={1} />
        <SimNumber label={isAs ? "মুঠ বল"         : "Net Force"}     value={Fb - Fg}    unit=" N" color="#ec4899" precision={1} />
      </div>

      <StepMode steps={isAs ? [
        { title: "ভাহি থকা",  body: "'কাঠৰ ব্লক' বাছক। ইয়াৰ ঘনত্ব (0.6) পানী (1.0)তকৈ কম হোৱা বাবে, আংশিক নিমজ্জনতে উৎপ্লাৱন বল ওজনৰ সমান হয়।" },
        { title: "ডুবি যোৱা", body: "'ধাতুৰ ব্লক' বাছক। ইয়াৰ ঘনত্ব (7.8) অত্যন্ত বেছি। সম্পূৰ্ণ নিমজ্জিত হ'লেও সৰ্বোচ্চ উৎপ্লাৱন বল ওজনতকৈ কম, গতিকে ই তলত পৰে।" },
        { title: "বিভিন্ন তৰল", body: "ধাতুৰ ব্লকটো ৰাখি তৰলক পাৰদলৈ (13.6 kg/L) সলনি কৰক। চাওক কি হয়! পাৰদৰ চৰম ঘনত্বই গধুৰ ধাতুকো ভাহি ৰাখে।" },
        { title: "সূত্ৰ",      body: "লক্ষ্য কৰক যে উৎপ্লাৱন বল কেৱল নিমজ্জিত আয়তন (V_sub), তৰলৰ ঘনত্ব (ρ) আৰু মাধ্যাকৰ্ষণ (g) ৰ ওপৰত নিৰ্ভৰ কৰে — কেতিয়াও বস্তুৰ ভৰৰ ওপৰত নহয়!" },
      ] : [
        { title: "Floating",        body: "Select 'Wooden Block'. Since its density (0.6) is less than water (1.0), the Buoyant Force perfectly balances Weight when only partially submerged." },
        { title: "Sinking",         body: "Select 'Metal Block'. Its density (7.8) is huge. Even fully submerged, the maximum Buoyant Force is smaller than Weight, so it sinks to the bottom." },
        { title: "Different Fluids", body: "Keep the metal block, but switch the liquid to Mercury (13.6 kg/L). Watch what happens! The extreme density of Mercury makes even dense metal float." },
        { title: "The Formula",     body: "Notice how Buoyant Force ONLY depends on the volume submerged (V_sub), the liquid's density (ρ), and gravity (g) — never the object's mass!" },
      ]} />
    </SimContainer>
  );
}

/* 7. Density Determination — Interactive Virtual Lab */
export function DensitySim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  // Material presets — wood/plastic/iron lock to known densities; custom unlocks the sliders
  const [material, setMaterial] = useState<"wood" | "plastic" | "iron" | "custom">("wood");
  const [m, setM] = useState(30);   // mass in grams
  const [v, setV] = useState(50);   // object volume in cm³

  useEffect(() => {
    if (material === "wood")    { setM(30);  setV(50); } // 0.60 g/cm³
    else if (material === "plastic") { setM(48);  setV(50); } // 0.96 g/cm³
    else if (material === "iron")    { setM(390); setV(50); } // 7.80 g/cm³
  }, [material]);

  const density = v > 0 ? m / v : 0;

  // Physics state — uses refs so RAF updates don't trigger re-renders for every frame
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const yRef = useRef(40);     // current object Y (centre)
  const vyRef = useRef(0);     // vertical velocity
  const [yPos, setYPos] = useState(40);
  const [splash, setSplash] = useState(false);

  // Geometry (viewBox coords)
  const waterYBase   = 160;    // surface before any displacement
  const beakerBottom = 230;    // inner bottom of beaker
  const s = 40;                // object visual size (px in viewBox)

  // Submerged fraction f ∈ [0..1] based on current object position
  let f = (yPos + s / 2 - waterYBase) / (s - 15);
  f = Math.max(0, Math.min(1, f));

  // Water rises as the object pushes water aside (visual only)
  const currentWaterY = waterYBase - f * 15;
  const V_sub = f * v;            // displaced volume (cm³) — visible to student
  const Fb    = V_sub * 1.0;      // buoyant force (water ρ = 1, units: g-equivalent)
  const W     = m;                // weight (units: g-equivalent)

  useRafLoop(running, (dt) => {
    const timeStep = dt * 2.0;

    let curF = (yRef.current + s / 2 - waterYBase) / (s - 15);
    curF = Math.max(0, Math.min(1, curF));

    // Splash on first contact at high downward speed
    if (curF > 0.1 &&
        yRef.current - vyRef.current * timeStep + s / 2 <= waterYBase &&
        vyRef.current > 100) {
      setSplash(true);
      setTimeout(() => setSplash(false), 500);
    }

    const curV_sub = curF * v;
    const curFb    = curV_sub * 1.0;
    const netForce = m - curFb;           // +ve down, -ve up

    let a = (netForce / m) * 600;
    const drag = curF > 0 ? 8.0 * curF * vyRef.current : 0.2 * vyRef.current;
    a -= drag;

    vyRef.current += a * timeStep;
    yRef.current  += vyRef.current * timeStep;

    if (yRef.current + s / 2 >= beakerBottom) {
      yRef.current = beakerBottom - s / 2;
      vyRef.current = -vyRef.current * 0.1; // small bounce
    }
    setYPos(yRef.current);
  });

  const svgRef = useRef<SVGSVGElement>(null);

  const handleDown = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    if (Math.abs(loc.x - 150) < 40 && Math.abs(loc.y - yPos) < 40) {
      setDragging(true);
      setRunning(false);
      vyRef.current = 0;
    }
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    yRef.current = Math.max(20, Math.min(240, loc.y));
    setYPos(yRef.current);
  };

  const handleUp = () => {
    if (dragging) {
      setDragging(false);
      setRunning(true);
    }
  };

  const reset = () => {
    yRef.current = 40;
    vyRef.current = 0;
    setYPos(40);
    setRunning(false);
  };

  // Verdict
  const verdict = density < 0.95
    ? (isAs ? "ভাঁহিছে" : "Floats")
    : density > 1.05
      ? (isAs ? "ডুবিছে" : "Sinks")
      : (isAs ? "ওলমি আছে" : "Suspended");

  // Dynamic educational feedback (live English/Assamese)
  let feedback: string;
  if (f === 0) {
    feedback = isAs
      ? "বস্তুটো পানীত এৰি দিয়ক।"
      : "Drag and drop the object into the water.";
  } else if (yPos + s / 2 >= beakerBottom - 1) {
    feedback = isAs
      ? `বস্তুটো ডুবে কাৰণ ইয়াৰ ঘনত্ব (${density.toFixed(2)}) > পানী (1.0)। ওজন > উৎপ্লাৱন বল।`
      : `Object sinks because its density (${density.toFixed(2)}) > water (1.0). Weight > Buoyancy.`;
  } else if (Math.abs(vyRef.current) < 5 && f < 0.99) {
    feedback = isAs
      ? "বস্তুটো ভাঁহি আছে! নিমজ্জিত আয়তনৰ উৎপ্লাৱন বল ইয়াৰ ওজনৰ সমান।"
      : "Object floats! Submerged volume displaces enough water to equal its weight.";
  } else if (Math.abs(vyRef.current) < 5 && f > 0.99) {
    feedback = isAs
      ? "বস্তুটো নিৰপেক্ষভাৱে ভাঁহি আছে (পানীত ওলমি)।"
      : "Object is neutrally buoyant (suspended in water).";
  } else if (vyRef.current > 0) {
    feedback = isAs
      ? "বস্তুটো পৰিছে। বেছি আয়তন পানীত সোমোৱাৰ লগে লগে উৎপ্লাৱন বল বাঢ়িছে।"
      : "Object falling. Buoyancy increases as more volume enters water.";
  } else {
    feedback = isAs
      ? "উৎপ্লাৱন বলে বস্তুটো ওপৰলৈ ঠেলিছে!"
      : "Buoyancy is pushing the object upward!";
  }

  // Force-arrow visual lengths (capped for clarity)
  const wArrow  = Math.min(60, (W  / 50) * 30);
  const fbArrow = Math.min(60, (Fb / 50) * 30);

  return (
    <SimContainer
      onReset={reset}
      hint={isAs
        ? "বস্তুৰ ঘনত্ব তৰলতকৈ কম হ'লে ই ভাঁহে; বেছি হ'লে ডুবে।"
        : "If the object's density is less than the liquid's, it floats; greater, it sinks."}
    >
      {/* Controls row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="flex flex-col justify-center col-span-2 sm:col-span-1">
          <label className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-1.5">
            {isAs ? "পদাৰ্থ" : "Material"}
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as "wood" | "plastic" | "iron" | "custom")}
            className="bg-white/80 dark:bg-gray-800 border-0 rounded-lg text-xs font-bold shadow-sm p-1.5 text-gray-700 dark:text-gray-200 cursor-pointer w-full"
          >
            <option value="wood">{isAs ? "কাঠ (0.6 g/cm³)" : "Wood (0.6 g/cm³)"}</option>
            <option value="plastic">{isAs ? "প্লাষ্টিক (0.96 g/cm³)" : "Plastic (0.96 g/cm³)"}</option>
            <option value="iron">{isAs ? "লো (7.8 g/cm³)" : "Iron (7.8 g/cm³)"}</option>
            <option value="custom">{isAs ? "নিজস্ব" : "Custom"}</option>
          </select>
        </div>
        <SimSlider
          label={isAs ? "ভৰ" : "Mass"}
          value={m}
          onChange={(val) => { setM(val); setMaterial("custom"); }}
          min={10} max={500} step={5} unit=" g" color="#da6b45"
        />
        <SimSlider
          label={isAs ? "আয়তন" : "Volume"}
          value={v}
          onChange={(val) => { setV(val); setMaterial("custom"); }}
          min={20} max={150} step={5} unit=" cm³" color="#8b5cf6"
        />
        <div className="flex items-center justify-center gap-2">
          <SimButton onClick={() => setRunning(true)} color="#10b981"
                     icon={<Play className="w-3.5 h-3.5" />}>
            {isAs ? "এৰক" : "Drop"}
          </SimButton>
          <SimButton onClick={reset} color="#64748b"
                     icon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isAs ? "পুনৰ" : "Reset"}
          </SimButton>
        </div>
      </div>

      {/* Animated Result Panel */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="liquid-inner rounded-xl px-3 py-2">
          <div className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase">
            {isAs ? "ভৰ (m)" : "Mass (m)"}
          </div>
          <div className="text-base font-black text-rose-500">{m} <span className="text-xs opacity-60">g</span></div>
        </div>
        <div className="liquid-inner rounded-xl px-3 py-2">
          <div className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase">
            {isAs ? "আয়তন (V)" : "Volume (V)"}
          </div>
          <div className="text-base font-black text-violet-500">{v} <span className="text-xs opacity-60">cm³</span></div>
        </div>
        <div className="liquid-inner rounded-xl px-3 py-2 ring-1 ring-orange-300/40">
          <div className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase">
            {isAs ? "ঘনত্ব ρ" : "Density ρ"}
          </div>
          <div className="text-base font-black bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
            {density.toFixed(2)} <span className="text-xs opacity-60">g/cm³</span>
          </div>
        </div>
      </div>

      {/* Beaker Canvas — full-width on mobile, capped + centred on desktop */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-inner border border-white/20 dark:border-gray-700 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 touch-none mb-4 md:max-w-md md:mx-auto"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
      >
        <svg ref={svgRef} viewBox="0 0 300 250" className="w-full h-auto cursor-grab active:cursor-grabbing">
          <defs>
            <linearGradient id="densWaterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="densObjGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={density > 1.5 ? "#94a3b8" : density > 0.8 ? "#fde047" : "#fdba74"} />
              <stop offset="100%" stopColor={density > 1.5 ? "#475569" : density > 0.8 ? "#eab308" : "#f97316"} />
            </linearGradient>
            <linearGradient id="densGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor="#fff" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.18" />
            </linearGradient>
            <marker id="densWArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="#f97316" />
            </marker>
            <marker id="densBArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Beaker glass body */}
          <rect x="80" y="50" width="140" height="180" rx="5" fill="url(#densGlass)" stroke="#cbd5e1" strokeWidth="4" />
          {/* Glass highlight (reflection) */}
          <rect x="86" y="55" width="6" height="170" rx="2" fill="#fff" opacity="0.25" />

          {/* Tick marks + labels */}
          {[1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <line x1="80" x2="92" y1={50 + i * 30} y2={50 + i * 30} stroke="#cbd5e1" strokeWidth="2" />
              <text x="76" y={50 + i * 30 + 3} fontSize="7" textAnchor="end" fill="#94a3b8" fontWeight="bold">{500 - i * 100}ml</text>
            </g>
          ))}

          {/* Water volume */}
          <path d={`M 82 ${currentWaterY} L 218 ${currentWaterY} L 218 228 C 218 228 150 228 82 228 Z`}
                fill="url(#densWaterGrad)" />
          <line x1="82" x2="218" y1={currentWaterY} y2={currentWaterY} stroke="#7dd3fc" strokeWidth="2" opacity="0.85" />

          {/* Splash ripple */}
          {splash && (
            <>
              <ellipse cx="150" cy={currentWaterY} rx="30" ry="5" fill="none" stroke="#bae6fd" strokeWidth="2">
                <animate attributeName="rx"      from="10" to="55" dur="0.5s" fill="freeze" />
                <animate attributeName="opacity" from="1"  to="0"  dur="0.5s" fill="freeze" />
              </ellipse>
              <ellipse cx="150" cy={currentWaterY} rx="20" ry="3" fill="none" stroke="#7dd3fc" strokeWidth="1.5">
                <animate attributeName="rx"      from="5"  to="40" dur="0.6s" fill="freeze" />
                <animate attributeName="opacity" from="0.8" to="0" dur="0.6s" fill="freeze" />
              </ellipse>
            </>
          )}

          {/* Shadow under object on beaker floor */}
          {yPos + s / 2 < beakerBottom - 5 && (
            <ellipse cx="150" cy={beakerBottom - 2} rx={s * 0.45} ry="3" fill="#000" opacity="0.15" />
          )}

          {/* The Object — colour changes with material density */}
          <rect x={150 - s / 2} y={yPos - s / 2} width={s} height={s} rx="4"
                fill="url(#densObjGrad)" stroke="#475569" strokeWidth="1" />
          <text x="150" y={yPos + 4} fill="#1e293b" fontSize="11" fontWeight="900" textAnchor="middle">{m}g</text>

          {/* Force vectors — Weight (orange, down) + Buoyancy (blue, up) */}
          {W > 0 && (
            <g>
              <line x1="128" y1={yPos} x2="128" y2={yPos + wArrow} stroke="#f97316" strokeWidth="3" markerEnd="url(#densWArrow)" />
              <text x="124" y={yPos + wArrow + 8} fill="#f97316" fontSize="8" textAnchor="end" fontWeight="900">W</text>
            </g>
          )}
          {Fb > 0 && (
            <g>
              <line x1="172" y1={yPos} x2="172" y2={yPos - fbArrow} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#densBArrow)" />
              <text x="176" y={yPos - fbArrow - 4} fill="#3b82f6" fontSize="8" textAnchor="start" fontWeight="900">Fb</text>
            </g>
          )}
        </svg>

        {/* Live data overlay (top-right) */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm pointer-events-none">
          <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{isAs ? "তাৎক্ষণিক তথ্য" : "Live Data"}</div>
          <div className="text-[10px] font-black text-orange-500">{isAs ? "W (ওজন)" : "W (Weight)"}: {m.toFixed(0)}</div>
          <div className="text-[10px] font-black text-blue-500">{isAs ? "Fb (উৎপ্লাৱন)" : "Fb (Buoyancy)"}: {Fb.toFixed(0)}</div>
          <div className="text-[10px] font-black text-emerald-500">{isAs ? "V_বাহিৰ" : "V_disp"}: {V_sub.toFixed(1)} cm³</div>
        </div>

        {/* Verdict badge (top-left) */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm pointer-events-none">
          <div className="text-[10px] font-black uppercase text-gray-500">{isAs ? "অৱস্থা" : "Status"}</div>
          <div className={`text-xs font-black ${density < 0.95 ? "text-emerald-500" : density > 1.05 ? "text-rose-500" : "text-amber-500"}`}>
            {verdict}
          </div>
        </div>

        {/* Educational feedback (bottom) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-indigo-900/85 p-2.5 rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-xl text-center pointer-events-none">
          <p className="text-xs font-bold text-indigo-100 leading-snug">{feedback}</p>
        </div>
      </div>

      {/* Density Behaviour Scale */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">
            {isAs ? "ঘনত্বৰ আচৰণ মাপনী" : "Density Behaviour Scale"}
          </div>
          <div className="text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {density.toFixed(2)} g/cm³ = {verdict}
          </div>
        </div>
        <div className="relative h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
          <div className="h-full bg-emerald-400/50 flex items-center justify-center text-[10px] font-bold text-emerald-800" style={{ width: "50%" }}>
            {isAs ? "ভাঁহে (ρ < 1)" : "Float (ρ < 1)"}
          </div>
          <div className="h-full w-0.5 bg-blue-500" />
          <div className="h-full bg-rose-400/50 flex items-center justify-center text-[10px] font-bold text-rose-800" style={{ width: "50%" }}>
            {isAs ? "ডুবে (ρ > 1)" : "Sink (ρ > 1)"}
          </div>
          <div
            className="absolute top-0 bottom-0 w-3 bg-white border-2 border-indigo-600 rounded-full shadow-md transition-all z-10"
            style={{ left: `calc(${Math.min(100, Math.max(0, (density / 2) * 100))}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-black text-gray-400 mt-1 px-1">
          <span>0.0</span>
          <span>{isAs ? "পানী (1.0)" : "Water (1.0)"}</span>
          <span>2.0+</span>
        </div>
      </div>

      {/* Step-by-step lab mode */}
      <StepMode steps={isAs ? [
        { title: "১. পদাৰ্থ বাছক", body: "এটা পদাৰ্থ বাছক (কাঠ / প্লাষ্টিক / লো) বা নিজস্ব ভৰ আৰু আয়তন নিৰ্ধাৰণ কৰক।" },
        { title: "২. ভৰ জোখা",     body: "বস্তুৰ ভৰ (m) আৰু আয়তন (V) লক্ষ্য কৰক।" },
        { title: "৩. পানীত এৰক",   body: "বস্তুটো বীকাৰৰ পানীত এৰি দিয়ক। নিমজ্জিত হোৱাৰ পৰিমাণ পৰ্যবেক্ষণ কৰক।" },
        { title: "৪. বিচ্যুতি চাওক", body: "বাহিৰ হোৱা পানীৰ আয়তন বস্তুৰ নিমজ্জিত অংশৰ সমান।" },
        { title: "৫. ঘনত্ব গণনা",  body: "ঘনত্ব ρ = ভৰ / আয়তন। যদি ρ < 1 তেতিয়া ভাঁহে; ρ > 1 হ'লে ডুবে।" },
      ] : [
        { title: "1. Select Object", body: "Pick a material (Wood / Plastic / Iron) or enter custom mass and volume." },
        { title: "2. Measure Mass",  body: "Note the object's mass (m) and volume (V)." },
        { title: "3. Drop in Water", body: "Drop the object into the beaker. Watch how much of it submerges." },
        { title: "4. Observe Displacement", body: "The displaced water volume equals the submerged portion of the object." },
        { title: "5. Calculate Density",    body: "Density ρ = mass / volume. If ρ < 1 it floats; if ρ > 1 it sinks." },
      ]} />
    </SimContainer>
  );
}
