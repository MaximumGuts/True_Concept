import { useState, useEffect, useRef } from "react";
import { STRUCTURES, JOURNEY_STEPS, QUIZ_DATA, type StructureData } from "./heart-circulation-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStructureNameKey } from "@/i18n/biologyTranslations";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang } from "@/lib/i18n";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";

// ── Label helper ─────────────────────────────────────────────────────────────
function HLabel({ ox, oy, lx, label, sub, right }: {
  ox: number; oy: number; lx: number; label: string; sub?: string; right: boolean;
}) {
  const ly = oy;
  const anchor = right ? "start" : "end";
  return (
    <g>
      <polyline points={`${ox},${oy} ${ox},${ly} ${lx},${ly}`}
        fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.7" />
      <circle cx={ox} cy={oy} r="2" fill="#94a3b8" opacity="0.7" />
      <text x={lx + (right ? 4 : -4)} y={ly} textAnchor={anchor}
        fontSize="12" fill="#e2e8f0" fontFamily="sans-serif" dominantBaseline="middle">{label}</text>
      {sub && <text x={lx + (right ? 4 : -4)} y={ly + 13} textAnchor={anchor}
        fontSize="10" fill="#94a3b8" fontFamily="sans-serif" dominantBaseline="middle">{sub}</text>}
    </g>
  );
}

// ── Heart SVG ─────────────────────────────────────────────────────────────────
function HeartSVG({ selected, onSelect, journeyStep }:
  { selected: string | null; onSelect: (id: string) => void; journeyStep: number }) {
  const { t } = useLanguage();

  return (
    <svg viewBox="-80 0 720 640" width="100%" height="100%"
      style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Chamber clip paths */}
        <clipPath id="hc_ra"><rect x="122" y="134" width="150" height="160" /></clipPath>
        <clipPath id="hc_rv"><rect x="122" y="294" width="150" height="158" /></clipPath>
        <clipPath id="hc_la"><rect x="272" y="134" width="150" height="160" /></clipPath>
        <clipPath id="hc_lv"><rect x="272" y="294" width="150" height="158" /></clipPath>
        <clipPath id="hc_full">
          <path d="M 268,130 C 310,126 368,142 398,178 C 428,215 432,260 418,298
                   C 404,337 380,363 356,390 C 332,417 308,438 288,452
                   C 278,458 272,462 268,464
                   C 264,462 258,458 248,452
                   C 228,438 204,417 180,390
                   C 156,363 132,337 118,298
                   C 104,260 108,215 138,178
                   C 168,142 226,126 268,130 Z" />
        </clipPath>

        {/* Glow filters */}
        <filter id="hc_blueGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="hc_redGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="hc_selectGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Journey particle paths */}
        <path id="hc_path_pulm" d="M 205,365 L 205,294 L 235,148 L 135,180 L 108,282" fill="none" />
        <path id="hc_path_sys"  d="M 335,375 L 335,218 L 312,148 L 270,60 L 270,605" fill="none" />
      </defs>

      <style>{`
        @keyframes hc-heartbeat {
          0%   { transform: scale(1.00) translate(0px, 0px); }
          15%  { transform: scale(1.06) translate(-1px, -2px); }
          30%  { transform: scale(0.97) translate(0px, 1px); }
          45%  { transform: scale(1.04) translate(-1px, -1px); }
          60%  { transform: scale(1.00) translate(0px, 0px); }
          100% { transform: scale(1.00) translate(0px, 0px); }
        }
        .hc-heart-group {
          transform-origin: 268px 300px;
          animation: hc-heartbeat 0.85s ease-in-out infinite;
        }
        @keyframes hc-blood-blue {
          0%   { opacity: 0.85; }
          50%  { opacity: 1;    }
          100% { opacity: 0.85; }
        }
        @keyframes hc-blood-red {
          0%   { opacity: 0.9; }
          50%  { opacity: 1;   }
          100% { opacity: 0.9; }
        }
        .hc-particle-blue { animation: hc-blood-blue 0.85s ease-in-out infinite; }
        .hc-particle-red  { animation: hc-blood-red  0.85s ease-in-out infinite 0.42s; }
      `}</style>

      {/* ── Background ── */}
      <rect x="-80" y="0" width="720" height="640" fill="#050B18" />

      {/* ── Lung silhouettes ── */}
      <ellipse cx="90" cy="282" rx="46" ry="72" fill="#2d1a2e" stroke="#8b5a8b" strokeWidth="1.5" opacity="0.8"
        style={{ cursor: "pointer" }} onClick={() => onSelect("lungs")} />
      <ellipse cx="90" cy="282" rx="32" ry="55" fill="#3d1f3e" opacity="0.7" />
      <text x="90" y="278" textAnchor="middle" fontSize="9" fill="#c084c8" fontFamily="sans-serif">LUNG</text>
      <text x="90" y="290" textAnchor="middle" fontSize="8" fill="#c084c8" fontFamily="sans-serif">Right</text>

      {/* ── Body capillaries (top — upper body) ── */}
      <g style={{ cursor: "pointer" }} onClick={() => onSelect("bodyCapillaries")}>
        <rect x="185" y="18" width="165" height="34" rx="8" fill="#3a0a0a" stroke="#7f1d1d" strokeWidth="1.2" />
        <text x="268" y="31" textAnchor="middle" fontSize="10" fill="#f87171" fontFamily="sans-serif">Body Capillaries</text>
        <text x="268" y="44" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="sans-serif">Upper Body O₂ delivery</text>
      </g>

      {/* ── Body capillaries (bottom — lower body) ── */}
      <g style={{ cursor: "pointer" }} onClick={() => onSelect("bodyCapillaries")}>
        <rect x="185" y="592" width="165" height="34" rx="8" fill="#3a0a0a" stroke="#7f1d1d" strokeWidth="1.2" />
        <text x="268" y="605" textAnchor="middle" fontSize="10" fill="#f87171" fontFamily="sans-serif">Body Capillaries</text>
        <text x="268" y="618" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="sans-serif">Lower Body O₂ delivery</text>
      </g>

      {/* ── Vessels (drawn before heart so heart overlays) ── */}

      {/* SVC — blue tube from top body to RA */}
      <g style={{ cursor: "pointer" }} onClick={() => onSelect("superiorVenaCava")}>
        <rect x="198" y="52" width="22" height="88" rx="6" fill="#1a3a8a" stroke="#3060c8" strokeWidth="1.5" />
        <text x="209" y="105" textAnchor="middle" fontSize="8" fill="#93c5fd" fontFamily="sans-serif"
          transform="rotate(-90,209,105)">SVC</text>
      </g>

      {/* IVC — blue tube from bottom to RA */}
      <g style={{ cursor: "pointer" }} onClick={() => onSelect("inferiorVenaCava")}>
        <rect x="198" y="462" width="22" height="85" rx="6" fill="#1a3a8a" stroke="#3060c8" strokeWidth="1.5" />
        <text x="209" y="512" textAnchor="middle" fontSize="8" fill="#93c5fd" fontFamily="sans-serif"
          transform="rotate(-90,209,512)">IVC</text>
      </g>

      {/* Aorta — red arch from LV up and over */}
      <g style={{ cursor: "pointer" }} onClick={() => onSelect("aorta")}>
        <path d="M 310,138 C 310,80 268,60 268,52" fill="none" stroke="#dc2626" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
        <path d="M 310,138 C 310,80 268,60 268,52" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Pulmonary artery — blue from RV to lungs */}
      <g style={{ cursor: "pointer" }} onClick={() => onSelect("pulmonaryArtery")}>
        <path d="M 228,148 C 228,120 170,105 135,160" fill="none" stroke="#1d4ed8" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        <path d="M 228,148 C 228,120 170,105 135,160" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Pulmonary vein — red from lungs to LA */}
      <g style={{ cursor: "pointer" }} onClick={() => onSelect("pulmonaryVein")}>
        <path d="M 140,338 C 182,380 280,345 300,295" fill="none" stroke="#b91c1c" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        <path d="M 140,338 C 182,380 280,345 300,295" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── Heart (animated group) ── */}
      <g className="hc-heart-group">

        {/* Heart outline/shadow */}
        <path d="M 268,130 C 310,126 368,142 398,178 C 428,215 432,260 418,298
                 C 404,337 380,363 356,390 C 332,417 308,438 288,452
                 C 278,458 272,462 268,464
                 C 264,462 258,458 248,452
                 C 228,438 204,417 180,390
                 C 156,363 132,337 118,298
                 C 104,260 108,215 138,178
                 C 168,142 226,126 268,130 Z"
          fill="#0c0510" stroke="#6b21a8" strokeWidth="2" opacity="0.5" />

        {/* RA — deoxygenated blue */}
        <g clipPath="url(#hc_ra)" style={{ cursor: "pointer" }} onClick={() => onSelect("rightAtrium")}>
          <path d="M 268,130 C 310,126 368,142 398,178 C 428,215 432,260 418,298
                   C 404,337 380,363 356,390 C 332,417 308,438 288,452
                   C 278,458 272,462 268,464
                   C 264,462 258,458 248,452
                   C 228,438 204,417 180,390
                   C 156,363 132,337 118,298
                   C 104,260 108,215 138,178
                   C 168,142 226,126 268,130 Z"
            fill={selected === "rightAtrium" ? "#facc15" : "#2748a8"} opacity="0.92" />
        </g>

        {/* RV — darker blue */}
        <g clipPath="url(#hc_rv)" style={{ cursor: "pointer" }} onClick={() => onSelect("rightVentricle")}>
          <path d="M 268,130 C 310,126 368,142 398,178 C 428,215 432,260 418,298
                   C 404,337 380,363 356,390 C 332,417 308,438 288,452
                   C 278,458 272,462 268,464
                   C 264,462 258,458 248,452
                   C 228,438 204,417 180,390
                   C 156,363 132,337 118,298
                   C 104,260 108,215 138,178
                   C 168,142 226,126 268,130 Z"
            fill={selected === "rightVentricle" ? "#facc15" : "#1e3a8a"} opacity="0.92" />
        </g>

        {/* LA — oxygenated red */}
        <g clipPath="url(#hc_la)" style={{ cursor: "pointer" }} onClick={() => onSelect("leftAtrium")}>
          <path d="M 268,130 C 310,126 368,142 398,178 C 428,215 432,260 418,298
                   C 404,337 380,363 356,390 C 332,417 308,438 288,452
                   C 278,458 272,462 268,464
                   C 264,462 258,458 248,452
                   C 228,438 204,417 180,390
                   C 156,363 132,337 118,298
                   C 104,260 108,215 138,178
                   C 168,142 226,126 268,130 Z"
            fill={selected === "leftAtrium" ? "#facc15" : "#b91c1c"} opacity="0.92" />
        </g>

        {/* LV — darkest red */}
        <g clipPath="url(#hc_lv)" style={{ cursor: "pointer" }} onClick={() => onSelect("leftVentricle")}>
          <path d="M 268,130 C 310,126 368,142 398,178 C 428,215 432,260 418,298
                   C 404,337 380,363 356,390 C 332,417 308,438 288,452
                   C 278,458 272,462 268,464
                   C 264,462 258,458 248,452
                   C 228,438 204,417 180,390
                   C 156,363 132,337 118,298
                   C 104,260 108,215 138,178
                   C 168,142 226,126 268,130 Z"
            fill={selected === "leftVentricle" ? "#facc15" : "#7f1d1d"} opacity="0.92" />
        </g>

        {/* Heart outline stroke */}
        <path d="M 268,130 C 310,126 368,142 398,178 C 428,215 432,260 418,298
                 C 404,337 380,363 356,390 C 332,417 308,438 288,452
                 C 278,458 272,462 268,464
                 C 264,462 258,458 248,452
                 C 228,438 204,417 180,390
                 C 156,363 132,337 118,298
                 C 104,260 108,215 138,178
                 C 168,142 226,126 268,130 Z"
          fill="none" stroke="#e2e8f0" strokeWidth="1.8" opacity="0.5" />

        {/* Interventricular septum (vertical) */}
        <line x1="268" y1="134" x2="268" y2="458" stroke="#e2e8f0" strokeWidth="2.5" opacity="0.35"
          style={{ cursor: "pointer" }} onClick={() => onSelect("septum")} />

        {/* AV groove (horizontal) */}
        <line x1="128" y1="294" x2="410" y2="294" stroke="#e2e8f0" strokeWidth="1.8" opacity="0.25"
          style={{ cursor: "pointer" }} onClick={() => onSelect("septum")} />

        {/* Chamber labels */}
        <text x="195" y="230" textAnchor="middle" fontSize="13" fill="#93c5fd" fontFamily="sans-serif" fontWeight="bold" opacity="0.9">RA</text>
        <text x="195" y="380" textAnchor="middle" fontSize="13" fill="#60a5fa" fontFamily="sans-serif" fontWeight="bold" opacity="0.9">RV</text>
        <text x="340" y="230" textAnchor="middle" fontSize="13" fill="#fca5a5" fontFamily="sans-serif" fontWeight="bold" opacity="0.9">LA</text>
        <text x="340" y="380" textAnchor="middle" fontSize="13" fill="#f87171" fontFamily="sans-serif" fontWeight="bold" opacity="0.9">LV</text>

        {/* ── Valve indicators ── */}
        {/* Tricuspid valve (between RA and RV) */}
        <g style={{ cursor: "pointer" }} onClick={() => onSelect("tricuspidValve")}>
          <ellipse cx="195" cy="294" rx="30" ry="7" fill="#3b82f6" opacity="0.7" />
          <text x="195" y="297" textAnchor="middle" fontSize="7.5" fill="#fff" fontFamily="sans-serif">Tricuspid</text>
        </g>

        {/* Mitral valve (between LA and LV) */}
        <g style={{ cursor: "pointer" }} onClick={() => onSelect("mitralValve")}>
          <ellipse cx="338" cy="294" rx="30" ry="7" fill="#ef4444" opacity="0.7" />
          <text x="338" y="297" textAnchor="middle" fontSize="7.5" fill="#fff" fontFamily="sans-serif">Mitral</text>
        </g>

        {/* Pulmonary valve (RV outlet) */}
        <g style={{ cursor: "pointer" }} onClick={() => onSelect("pulmonaryValve")}>
          <ellipse cx="230" cy="148" rx="22" ry="6" fill="#2563eb" opacity="0.8" />
          <text x="230" y="151" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="sans-serif">Pulm.V</text>
        </g>

        {/* Aortic valve (LV outlet) */}
        <g style={{ cursor: "pointer" }} onClick={() => onSelect("aorticValve")}>
          <ellipse cx="312" cy="148" rx="22" ry="6" fill="#dc2626" opacity="0.8" />
          <text x="312" y="151" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="sans-serif">Aortic V</text>
        </g>

        {/* ── Blood flow particles (animated) ── */}
        {/* Blue deoxygenated — right side */}
        <g className="hc-particle-blue">
          <circle r="5" fill="#60a5fa" opacity="0.9">
            <animateMotion dur="3.4s" repeatCount="indefinite"
              path="M 195,370 L 195,294 L 230,150 L 170,140 L 108,210" />
          </circle>
        </g>
        <g className="hc-particle-blue">
          <circle r="4" fill="#93c5fd" opacity="0.8">
            <animateMotion dur="3.4s" repeatCount="indefinite" begin="1.7s"
              path="M 195,370 L 195,294 L 230,150 L 170,140 L 108,210" />
          </circle>
        </g>

        {/* Red oxygenated — left side */}
        <g className="hc-particle-red">
          <circle r="5" fill="#ef4444" opacity="0.9">
            <animateMotion dur="3.4s" repeatCount="indefinite" begin="0.85s"
              path="M 108,340 L 200,390 L 338,370 L 338,294 L 310,150 L 268,58" />
          </circle>
        </g>
        <g className="hc-particle-red">
          <circle r="4" fill="#fca5a5" opacity="0.8">
            <animateMotion dur="3.4s" repeatCount="indefinite" begin="2.55s"
              path="M 108,340 L 200,390 L 338,370 L 338,294 L 310,150 L 268,58" />
          </circle>
        </g>
      </g>

      {/* ── Journey step highlight ── */}
      {journeyStep >= 0 && journeyStep < JOURNEY_STEPS.length && (
        <circle
          cx={JOURNEY_STEPS[journeyStep].x}
          cy={JOURNEY_STEPS[journeyStep].y}
          r="12"
          fill="#facc15"
          opacity="0.85"
        >
          <animate attributeName="r" values="10;14;10" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.85;1;0.85" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* ── Labels ── */}
      {/* Left labels — sorted by y to avoid overlaps */}
      <HLabel ox={198} oy={80}  lx={60} label={t("struct.svc")} sub={t("sub.upperBody")} right={false} />
      <HLabel ox={230} oy={148} lx={60} label={t("struct.pulmonaryValve")} sub={t("sub.semilunar")} right={false} />
      <HLabel ox={135} oy={178} lx={60} label={t("struct.pulmonaryArtery")} sub={t("sub.deoxygenated")} right={false} />
      <HLabel ox={148} oy={224} lx={60} label={t("struct.rightAtrium")} sub={t("sub.ra")} right={false} />
      <HLabel ox={108} oy={282} lx={60} label={t("struct.lungsPulm")} sub={t("sub.gasExchange")} right={false} />
      <HLabel ox={195} oy={314} lx={60} label={t("struct.tricuspidValve")} sub={t("sub.3cusps")} right={false} />
      <HLabel ox={140} oy={346} lx={60} label={t("struct.pulmonaryVeins")} sub={t("sub.oxygenated")} right={false} />
      <HLabel ox={148} oy={375} lx={60} label={t("struct.rightVentricle")} sub={t("sub.rv")} right={false} />
      <HLabel ox={198} oy={500} lx={60} label={t("struct.ivc")} sub={t("sub.lowerBody")} right={false} />

      {/* Right labels — sorted by y to avoid overlaps */}
      <HLabel ox={310} oy={82}  lx={520} label={t("struct.aorta")} sub={t("sub.systemic")} right={true} />
      <HLabel ox={312} oy={148} lx={520} label={t("struct.aorticValve")} sub={t("sub.semilunar")} right={true} />
      <HLabel ox={340} oy={220} lx={520} label={t("struct.leftAtrium")} sub={t("sub.la")} right={true} />
      <HLabel ox={268} oy={268} lx={520} label={t("struct.septum")} sub={t("sub.preventsmixing")} right={true} />
      <HLabel ox={338} oy={316} lx={520} label={t("struct.mitralValve")} sub={t("sub.2cusps")} right={true} />
      <HLabel ox={345} oy={375} lx={520} label={t("struct.leftVentricle")} sub={t("sub.lv")} right={true} />
      <HLabel ox={268} oy={452} lx={520} label={t("struct.cardiacApex")} right={true} />
    </svg>
  );
}

// ── Structure Info Panel ───────────────────────────────────────────────────────
function StructureInfoPanel({ data, onClose }: { data: StructureData; onClose: () => void }) {
  const { t, lang } = useLanguage();
  const bloodBadge: Record<string, string> = {
    oxygenated: "bg-red-900 text-red-200 border border-red-700",
    deoxygenated: "bg-blue-900 text-blue-200 border border-blue-700",
    both: "bg-purple-900 text-purple-200 border border-purple-700",
    none: "bg-gray-800 text-gray-300 border border-gray-600",
  };
  const bloodLabel: Record<string, string> = {
    oxygenated: t("badge.oxygenated"),
    deoxygenated: t("badge.deoxygenated"),
    both: t("badge.both"),
    none: t("badge.none"),
  };
  const translatedName = (() => { const k = getStructureNameKey(data.id); const tr = t(k); return tr !== k ? tr : pickLang(data.name, lang); })();
  const fns = pickLang(data.functions, lang);
  const keyFs = pickLang(data.keyFacts, lang);
  const notes = pickLang(data.examNotes, lang);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">{translatedName}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{pickLang(data.role, lang)}</p>
          <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${bloodBadge[data.bloodType]}`}>
            {bloodLabel[data.bloodType]}
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl ml-2 flex-shrink-0">×</button>
      </div>

      <div>
        <p className="text-sm text-slate-300 leading-relaxed">{pickLang(data.description, lang)}</p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">{t("panel.functions")}</h4>
        <ul className="space-y-1">
          {fns.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="text-red-400 flex-shrink-0">•</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">{t("panel.keyFacts")}</h4>
        <ul className="space-y-1">
          {keyFs.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="text-blue-400 flex-shrink-0">→</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-950 border border-yellow-700 rounded-lg p-3">
        <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">{t("panel.examNotes")}</h4>
        <ul className="space-y-1">
          {notes.map((n, i) => (
            <li key={i} className="flex gap-2 text-xs text-yellow-200">
              <span className="text-yellow-400 flex-shrink-0">★</span>{n}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">{t("panel.circulationNote")}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{pickLang(data.circulationNote, lang)}</p>
      </div>

      <div className="bg-purple-950 border border-purple-700 rounded-lg p-3">
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">{t("panel.funFact")}</h4>
        <p className="text-xs text-purple-200 leading-relaxed">{pickLang(data.funFact, lang)}</p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">{t("panel.disorders")}</h4>
        <p className="text-xs text-slate-400">{pickLang(data.disorders, lang)}</p>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ onStart }: { onStart: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 relative"
      style={{ background: "linear-gradient(135deg,#0a0514 0%,#0f0a1e 50%,#0a0514 100%)" }}>

      {/* Lab-language toggle */}
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>

      <div className="relative mb-6">
        <div className="text-8xl select-none" style={{ filter: "drop-shadow(0 0 30px #dc2626)" }}>🫀</div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">
        {t("module.heart")}
      </h1>
      <p className="text-slate-400 text-center max-w-xl mb-8 text-sm">
        {t("dash.heart.subtitle")}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
        {[
          { labelKey: "dash.heart.chambers", subKey: "dash.heart.chambersSub", color: "text-red-400" },
          { labelKey: "dash.heart.valves",   subKey: "dash.heart.valvesSub",   color: "text-blue-400" },
          { labelKey: "dash.heart.circuit",  subKey: "dash.heart.circuitSub",  color: "text-purple-400" },
          { labelKey: "dash.heart.bpm",      subKey: "dash.heart.bpmSub",      color: "text-yellow-400" },
        ].map((s) => (
          <div key={s.labelKey} className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{t(s.labelKey)}</div>
            <div className="text-xs text-slate-400 mt-1 whitespace-pre-line">{t(s.subKey)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        <div className="bg-blue-950 border border-blue-700 rounded-xl p-4">
          <h3 className="text-blue-300 font-bold mb-2">{t("dash.heart.pulmonaryTitle")}</h3>
          <p className="text-xs text-blue-200">{t("dash.heart.pulmonaryPath")}</p>
          <p className="text-xs text-slate-400 mt-1">{t("dash.heart.pulmonarySub")}</p>
        </div>
        <div className="bg-red-950 border border-red-700 rounded-xl p-4">
          <h3 className="text-red-300 font-bold mb-2">{t("dash.heart.systemicTitle")}</h3>
          <p className="text-xs text-red-200">{t("dash.heart.systemicPath")}</p>
          <p className="text-xs text-slate-400 mt-1">{t("dash.heart.systemicSub")}</p>
        </div>
      </div>

      <button onClick={onStart}
        className="px-8 py-3 rounded-xl text-white font-bold text-base transition-all"
        style={{ background: "linear-gradient(90deg,#7f1d1d,#dc2626)", boxShadow: "0 0 24px #dc2626aa" }}>
        {t("dash.heart.exploreBtn")}
      </button>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function Quiz({ onBack }: { onBack: () => void }) {
  const { t, lang } = useLanguage();
  const { recordQuizResult } = useLabTracker();
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUIZ_DATA[idx];
  const qText = pickLang(q.q, lang);
  const qOpts = pickLang(q.opts, lang);
  const qExplanation = pickLang(q.explanation, lang);

  function choose(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === q.ans) setScore(s => s + 1);
  }
  function next() {
    if (idx + 1 >= QUIZ_DATA.length) {
      const pct = Math.round((score / QUIZ_DATA.length) * 100);
      recordQuizResult({ score: pct, totalCorrect: score, totalAttempted: QUIZ_DATA.length });
      setDone(true);
      return;
    }
    setIdx(i => i + 1); setChosen(null);
  }
  function restart() { setIdx(0); setChosen(null); setScore(0); setDone(false); }

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{ background: "#050B18" }}>
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="text-6xl mb-4">🫀</div>
      <h2 className="text-2xl font-bold text-white mb-2">{t("ui.quizComplete")}</h2>
      <p className="text-4xl font-extrabold text-red-400 mb-1">{score}/{QUIZ_DATA.length}</p>
      <p className="text-slate-400 mb-6">{score >= 8 ? t("quiz.excellent.heart") : score >= 5 ? t("quiz.good.heart") : t("ui.reviewMore")}</p>
      <div className="flex gap-3">
        <button onClick={restart} className="px-5 py-2 rounded-lg bg-red-800 text-white font-bold hover:bg-red-700">{t("ui.retry")}</button>
        <button onClick={onBack} className="px-5 py-2 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600">{t("ui.back")}</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 relative"
      style={{ background: "#050B18" }}>
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white text-sm">← {t("ui.back")}</button>
          <span className="text-slate-400 text-sm">{t("quiz.questionPrefix")} {idx + 1}/{QUIZ_DATA.length} · {t("ui.score")}: {score}</span>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <p className="text-white font-semibold text-base mb-4">{qText}</p>
          <div className="space-y-2">
            {qOpts.map((o, i) => {
              let cls = "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all border ";
              if (chosen === null) cls += "border-slate-600 text-slate-200 hover:border-red-500 hover:bg-red-950 bg-slate-800";
              else if (i === q.ans) cls += "border-emerald-500 bg-emerald-950 text-emerald-200";
              else if (i === chosen) cls += "border-red-500 bg-red-950 text-red-200";
              else cls += "border-slate-700 bg-slate-800 text-slate-400";
              return <button key={i} className={cls} onClick={() => choose(i)}>{o}</button>;
            })}
          </div>
          {chosen !== null && (
            <div className="mt-4 bg-slate-800 border border-slate-600 rounded-lg p-3">
              <p className="text-xs text-slate-300">{qExplanation}</p>
            </div>
          )}
          {chosen !== null && (
            <button onClick={next}
              className="mt-4 w-full py-2 rounded-lg bg-red-800 text-white font-bold hover:bg-red-700 text-sm">
              {idx + 1 < QUIZ_DATA.length ? t("ui.next") : t("ui.seeResults")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Explorer ──────────────────────────────────────────────────────────────────
function HeartCirculationExplorer({ onBack }: { onBack: () => void }) {
  const { t, lang } = useLanguage();
  const { recordInteraction, recordJourneyFinished } = useLabTracker();
  const [selected, setSelected] = useState<string | null>(null);
  const [journeyStep, setJourneyStep] = useState(-1);
  const [journeyActive, setJourneyActive] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

function startJourney() {
    setJourneyActive(true);
    setJourneyStep(0);
    setSelected(JOURNEY_STEPS[0].structureId);
    let step = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= JOURNEY_STEPS.length) {
        clearInterval(intervalRef.current!);
        setJourneyActive(false);
        setJourneyStep(-1);
        recordJourneyFinished();
        return;
      }
      setJourneyStep(step);
      setSelected(JOURNEY_STEPS[step].structureId);
    }, 2400);
  }

  function stopJourney() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setJourneyActive(false);
    setJourneyStep(-1);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  if (showQuiz) return <Quiz onBack={() => setShowQuiz(false)} />;

  const selectedData = selected ? STRUCTURES[selected] : null;
  const currentJStep = journeyStep >= 0 && journeyStep < JOURNEY_STEPS.length ? JOURNEY_STEPS[journeyStep] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050B18" }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 flex-wrap">
        <button onClick={onBack} className="text-slate-400 hover:text-white text-sm">{t("ui.backToDashboard")}</button>
        <span className="text-white font-bold text-sm flex-1">{t("module.heart")}</span>
        <div className="flex gap-2 flex-wrap items-center">
          <LanguageToggle />
          {!journeyActive ? (
            <button onClick={startJourney}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ background: "linear-gradient(90deg,#7f1d1d,#dc2626)" }}>
              {t("ui.followBloodJourney")}
            </button>
          ) : (
            <button onClick={stopJourney}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-700 hover:bg-slate-600">
              {t("ui.stop")}
            </button>
          )}
          <button onClick={() => setShowQuiz(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-800 hover:bg-purple-700">
            {t("ui.quiz")}
          </button>
          <button onClick={() => setSelected(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-600 hover:text-white">
            {t("ui.clear")}
          </button>
        </div>
      </div>

      {/* Journey step banner */}
      {currentJStep && (
        <div className="mx-4 mt-3 rounded-xl border border-yellow-700 bg-yellow-950 px-4 py-2 flex items-center gap-3">
          <span className="text-yellow-400 font-bold text-sm">{t("ui.step")} {journeyStep + 1}/{JOURNEY_STEPS.length}:</span>
          <span className="text-yellow-200 font-semibold text-sm">{pickLang(currentJStep.stage, lang)}</span>
          <span className="text-yellow-300 text-xs hidden md:inline">— {pickLang(currentJStep.shortNote, lang)}</span>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* SVG panel */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={{ minHeight: 400 }}>
          <div className="w-full relative" style={{ maxWidth: 680, maxHeight: "calc(100vh - 140px)" }}>
            <HeartSVG
              selected={selected}
              onSelect={(id) => { stopJourney(); setSelected(id); recordInteraction(id); }}
              journeyStep={journeyStep}
            />
            {!selected && !journeyActive && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 text-xs pointer-events-none whitespace-nowrap">
                {t("ui.clickToExplore")}
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        {selectedData ? (
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 120px)" }}>
            <StructureInfoPanel data={selectedData} onClose={() => setSelected(null)} />
          </div>
        ) : (
          <div className="hidden md:flex w-80 lg:w-96 border-l border-slate-800 bg-slate-950 items-center justify-center">
            <div className="text-center p-6">
              <div className="text-4xl mb-3 opacity-40">🫀</div>
              <p className="text-slate-500 text-sm">{t("ui.clickToExplore")}</p>
              <div className="mt-4 space-y-2">
                {["rightAtrium","leftVentricle","pulmonaryArtery","aorta"].map(id => {
                  const k = getStructureNameKey(id); const tr = t(k);
                  return (
                    <button key={id} onClick={() => setSelected(id)}
                      className="block w-full text-xs text-left px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                      {tr !== k ? tr : pickLang(STRUCTURES[id].name, lang)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-800 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ background: "#2748a8" }} />
          <span className="text-xs text-slate-400">Deoxygenated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ background: "#b91c1c" }} />
          <span className="text-xs text-slate-400">Oxygenated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded-sm" style={{ background: "#3b82f6" }} />
          <span className="text-xs text-slate-400">Pulm. Artery (exception)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded-sm" style={{ background: "#ef4444" }} />
          <span className="text-xs text-slate-400">Pulm. Vein (exception)</span>
        </div>
      </div>
    </div>
  );
}

// ── Root Module ───────────────────────────────────────────────────────────────
export function HeartCirculationModule() {
  const [view, setView] = useState<"dashboard" | "explorer">("dashboard");
  if (view === "explorer") return <HeartCirculationExplorer onBack={() => setView("dashboard")} />;
  return <Dashboard onStart={() => setView("explorer")} />;
}
