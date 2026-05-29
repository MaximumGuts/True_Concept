import { useState, useEffect, useRef } from "react";
import { STRUCTURES, SYSTEM_JOURNEY, QUIZ_DATA } from "./excretory-system-data";
import type { StructureInfo } from "./excretory-system-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStructureNameKey } from "@/i18n/biologyTranslations";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang } from "@/lib/i18n";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";

// ── Shared label helper ───────────────────────────────────────────────────────
function ELabel({ ox, oy, lx, label, sub, right }: {
  ox: number; oy: number; lx: number; label: string; sub?: string; right: boolean;
}) {
  const a = right ? "start" : "end";
  return (
    <g>
      <polyline points={`${ox},${oy} ${lx},${oy}`} fill="none" stroke="#475569" strokeWidth="0.9" opacity="0.75" />
      <circle cx={ox} cy={oy} r="2.5" fill="#475569" opacity="0.75" />
      <text x={lx + (right ? 4 : -4)} y={oy} textAnchor={a} fontSize="11.5" fill="#cbd5e1"
        fontFamily="sans-serif" dominantBaseline="middle">{label}</text>
      {sub && <text x={lx + (right ? 4 : -4)} y={oy + 13} textAnchor={a} fontSize="9.5" fill="#64748b"
        fontFamily="sans-serif" dominantBaseline="middle">{sub}</text>}
    </g>
  );
}

// ── Animated particle helper ──────────────────────────────────────────────────
function Particle({ path, dur, color, r = 5, begin = "0s", opacity = 0.9 }: {
  path: string; dur: string; color: string; r?: number; begin?: string; opacity?: number;
}) {
  return (
    <circle r={r} fill={color} opacity={opacity}>
      <animateMotion dur={dur} repeatCount="indefinite" begin={begin} path={path} />
    </circle>
  );
}

// ── Excretory System SVG ──────────────────────────────────────────────────────
function ExcretorySystemSVG({ selected, onSelect, journeyStep }: {
  selected: string | null; onSelect: (id: string) => void; journeyStep: number;
}) {
  const { t } = useLanguage();
  const sel = (id: string) => selected === id;

  return (
    <svg viewBox="-80 0 720 640" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        <filter id="es_glow_red" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="es_glow_gold" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="es_kidney_grad" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#c03060" /><stop offset="55%" stopColor="#9b2a50" /><stop offset="100%" stopColor="#5c1030" />
        </radialGradient>
        <radialGradient id="es_bladder_grad" cx="50%" cy="35%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" /><stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <style>{`
        @keyframes es-kidney-pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.035)} }
        @keyframes es-bladder-fill { 0%,100%{opacity:0.8}50%{opacity:1} }
        @keyframes es-aorta-pulse { 0%,100%{opacity:0.85}50%{opacity:1} }
        .es-kidney-r { transform-origin:148px 265px; animation:es-kidney-pulse 2.4s ease-in-out infinite; }
        .es-kidney-l { transform-origin:392px 265px; animation:es-kidney-pulse 2.4s ease-in-out infinite 1.2s; }
        .es-bladder-g { animation:es-bladder-fill 3s ease-in-out infinite; }
        .es-aorta-g { animation:es-aorta-pulse 1.8s ease-in-out infinite; }
      `}</style>

      <rect x="-80" y="0" width="720" height="640" fill="#030B1A" />

      {/* Medical grid overlay */}
      <g opacity="0.05">
        {Array.from({length:9},(_, i)=><line key={`v${i}`} x1={-80+i*90} y1="0" x2={-80+i*90} y2="640" stroke="#38bdf8" strokeWidth="0.5" />)}
        {Array.from({length:8},(_, i)=><line key={`h${i}`} y1={i*80} x1="-80" y2={i*80} x2="640" stroke="#38bdf8" strokeWidth="0.5" />)}
      </g>

      {/* ── Spine indicator ── */}
      <rect x="243" y="110" width="28" height="360" rx="14" fill="#1e293b" opacity="0.7" />
      {[160,210,260,310,360,400,440].map((y, i) => (
        <rect key={i} x="248" y={y - 8} width="18" height="16" rx="3" fill="#334155" opacity="0.8" />
      ))}

      {/* ── Aorta ── */}
      <g className="es-aorta-g" style={{ cursor: 'pointer' }} onClick={() => onSelect('aorta')}>
        <rect x="243" y="72" width="14" height="390" rx="6"
          fill={sel('aorta') ? "#facc15" : "#dc2626"} opacity="0.95" />
        <rect x="245" y="72" width="10" height="390" rx="5" fill="#ef4444" opacity="0.5" />
        <text x="250" y="112" textAnchor="middle" fontSize="7" fill="#fca5a5" fontFamily="sans-serif"
          transform="rotate(-90,250,112)">AORTA</text>
      </g>

      {/* ── IVC ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('inferiorVenaCava')}>
        <rect x="263" y="72" width="14" height="390" rx="6"
          fill={sel('inferiorVenaCava') ? "#facc15" : "#1d4ed8"} opacity="0.95" />
        <rect x="265" y="72" width="10" height="390" rx="5" fill="#3b82f6" opacity="0.5" />
        <text x="270" y="112" textAnchor="middle" fontSize="7" fill="#93c5fd" fontFamily="sans-serif"
          transform="rotate(-90,270,112)">IVC</text>
      </g>

      {/* ── Adrenal glands ── */}
      <ellipse cx="148" cy="198" rx="16" ry="10" fill="#ca8a04" opacity="0.85" />
      <ellipse cx="392" cy="198" rx="16" ry="10" fill="#ca8a04" opacity="0.85" />
      <text x="148" y="201" textAnchor="middle" fontSize="6" fill="#fef3c7" fontFamily="sans-serif">Adrenal</text>
      <text x="392" y="201" textAnchor="middle" fontSize="6" fill="#fef3c7" fontFamily="sans-serif">Adrenal</text>

      {/* ── Right Kidney ── */}
      <g className="es-kidney-r" style={{ cursor: 'pointer' }} onClick={() => onSelect('kidneys')}>
        {sel('kidneys') && <ellipse cx="148" cy="265" rx="52" ry="70" fill="#facc15" opacity="0.25" filter="url(#es_glow_gold)" />}
        <ellipse cx="148" cy="265" rx="44" ry="62" fill="url(#es_kidney_grad)" />
        <ellipse cx="148" cy="265" rx="30" ry="46" fill="#7f1f3a" opacity="0.7" />
        <ellipse cx="148" cy="265" rx="14" ry="22" fill="#c03060" opacity="0.6" />
        <path d="M 188,252 Q 200,265 188,278" fill="none" stroke="#030B1A" strokeWidth="11" strokeLinecap="round" />
        <path d="M 188,252 Q 200,265 188,278" fill="none" stroke="#5c1030" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* ── Left Kidney ── */}
      <g className="es-kidney-l" style={{ cursor: 'pointer' }} onClick={() => onSelect('kidneys')}>
        {sel('kidneys') && <ellipse cx="392" cy="265" rx="52" ry="70" fill="#facc15" opacity="0.25" filter="url(#es_glow_gold)" />}
        <ellipse cx="392" cy="265" rx="44" ry="62" fill="url(#es_kidney_grad)" />
        <ellipse cx="392" cy="265" rx="30" ry="46" fill="#7f1f3a" opacity="0.7" />
        <ellipse cx="392" cy="265" rx="14" ry="22" fill="#c03060" opacity="0.6" />
        <path d="M 352,252 Q 340,265 352,278" fill="none" stroke="#030B1A" strokeWidth="11" strokeLinecap="round" />
        <path d="M 352,252 Q 340,265 352,278" fill="none" stroke="#5c1030" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* ── Renal arteries ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('renalArtery')}>
        <line x1="243" y1="252" x2="190" y2="252" stroke={sel('renalArtery') ? "#facc15" : "#ef4444"} strokeWidth="10" strokeLinecap="round" />
        <line x1="257" y1="258" x2="348" y2="258" stroke={sel('renalArtery') ? "#facc15" : "#ef4444"} strokeWidth="10" strokeLinecap="round" />
        <line x1="243" y1="252" x2="190" y2="252" stroke="#fca5a5" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        <line x1="257" y1="258" x2="348" y2="258" stroke="#fca5a5" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* ── Renal veins ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('renalVein')}>
        <line x1="190" y1="274" x2="263" y2="270" stroke={sel('renalVein') ? "#facc15" : "#2563eb"} strokeWidth="10" strokeLinecap="round" />
        <line x1="348" y1="276" x2="277" y2="272" stroke={sel('renalVein') ? "#facc15" : "#2563eb"} strokeWidth="10" strokeLinecap="round" />
        <line x1="190" y1="274" x2="263" y2="270" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        <line x1="348" y1="276" x2="277" y2="272" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* ── Ureters ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('ureter')}>
        <path d="M 152,325 C 148,390 158,448 218,478" fill="none"
          stroke={sel('ureter') ? "#facc15" : "#d97706"} strokeWidth="9" strokeLinecap="round" />
        <path d="M 385,325 C 380,390 368,448 315,478" fill="none"
          stroke={sel('ureter') ? "#facc15" : "#d97706"} strokeWidth="9" strokeLinecap="round" />
        <path d="M 152,325 C 148,390 158,448 218,478" fill="none"
          stroke="#fde68a" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <path d="M 385,325 C 380,390 368,448 315,478" fill="none"
          stroke="#fde68a" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* ── Urinary Bladder ── */}
      <g className="es-bladder-g" style={{ cursor: 'pointer' }} onClick={() => onSelect('bladder')}>
        {sel('bladder') && <ellipse cx="268" cy="493" rx="65" ry="52" fill="#facc15" opacity="0.2" filter="url(#es_glow_gold)" />}
        <ellipse cx="268" cy="493" rx="57" ry="44" fill="url(#es_bladder_grad)" />
        <ellipse cx="268" cy="488" rx="40" ry="28" fill="#3b82f6" opacity="0.3" />
        <text x="268" y="492" textAnchor="middle" fontSize="10" fill="#bfdbfe" fontFamily="sans-serif" fontWeight="bold">Bladder</text>
      </g>

      {/* ── Urethra ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('urethra')}>
        <line x1="268" y1="537" x2="268" y2="612" stroke={sel('urethra') ? "#facc15" : "#d97706"} strokeWidth="8" strokeLinecap="round" />
        <line x1="268" y1="537" x2="268" y2="612" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* ── Animated particles ── */}
      {/* Blood down aorta */}
      <Particle path="M 248,78 L 248,440" dur="2.8s" color="#ef4444" r={4} />
      <Particle path="M 248,78 L 248,440" dur="2.8s" color="#fca5a5" r={3} begin="1.4s" opacity={0.7} />
      {/* Blood entering kidneys */}
      <Particle path="M 243,252 L 190,252 L 172,262" dur="1.2s" color="#ef4444" r={4.5} />
      <Particle path="M 243,252 L 190,252 L 172,262" dur="1.2s" color="#ef4444" r={4.5} begin="0.6s" />
      <Particle path="M 257,258 L 348,258 L 368,262" dur="1.2s" color="#ef4444" r={4.5} begin="0.3s" />
      <Particle path="M 257,258 L 348,258 L 368,262" dur="1.2s" color="#ef4444" r={4.5} begin="0.9s" />
      {/* Purified blood leaving kidneys */}
      <Particle path="M 172,276 L 190,275 L 263,270" dur="1.2s" color="#f97316" r={4} begin="0.4s" />
      <Particle path="M 368,276 L 348,276 L 277,272" dur="1.2s" color="#f97316" r={4} begin="0.1s" />
      {/* Blood up IVC */}
      <Particle path="M 268,438 L 268,75" dur="2.8s" color="#3b82f6" r={4} begin="0.7s" />
      <Particle path="M 268,438 L 268,75" dur="2.8s" color="#60a5fa" r={3} begin="2.1s" opacity={0.7} />
      {/* Urine through ureters */}
      <Particle path="M 152,325 C 148,390 158,448 218,478" dur="2.4s" color="#fbbf24" r={4} begin="0.8s" />
      <Particle path="M 152,325 C 148,390 158,448 218,478" dur="2.4s" color="#fde68a" r={3} begin="2.0s" opacity={0.7} />
      <Particle path="M 385,325 C 380,390 368,448 315,478" dur="2.4s" color="#fbbf24" r={4} begin="1.4s" />
      <Particle path="M 385,325 C 380,390 368,448 315,478" dur="2.4s" color="#fde68a" r={3} begin="0.2s" opacity={0.7} />
      {/* Urine down urethra */}
      <Particle path="M 268,537 L 268,612" dur="1.2s" color="#fbbf24" r={4} begin="0.5s" />

      {/* ── Journey step highlight ── */}
      {journeyStep >= 0 && journeyStep < SYSTEM_JOURNEY.length && SYSTEM_JOURNEY[journeyStep].view === 'system' && (
        <circle cx={SYSTEM_JOURNEY[journeyStep].x} cy={SYSTEM_JOURNEY[journeyStep].y} r="14" fill="#facc15" opacity="0.8">
          <animate attributeName="r" values="11;16;11" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* ── Labels ── */}
      {/* Left labels */}
      <ELabel ox={243} oy={140} lx={60} label={t("struct.abdominalAorta")} sub={t("sub.bloodSupply")} right={false} />
      <ELabel ox={216} oy={252} lx={60} label={t("struct.renalArtery")} sub={t("sub.oxygenated")} right={false} />
      <ELabel ox={106} oy={285} lx={60} label={t("struct.kidneys")} sub={t("sub.1MNephrons")} right={false} />
      <ELabel ox={190} oy={318} lx={60} label={t("struct.renalVein")} sub={t("sub.purifiedBlood")} right={false} />
      <ELabel ox={151} oy={365} lx={60} label={t("struct.ureter")} sub={t("sub.peristalsis")} right={false} />

      {/* Right labels */}
      <ELabel ox={277} oy={165} lx={520} label={t("struct.ivcExcretory")} sub={t("sub.returnsToHeart")} right={true} />
      <ELabel ox={316} oy={258} lx={520} label={t("struct.renalArtery")} sub={t("sub.oxygenated")} right={true} />
      <ELabel ox={434} oy={285} lx={520} label={t("struct.kidneysLeft")} sub={t("sub.1MNephrons")} right={true} />
      <ELabel ox={316} oy={318} lx={520} label={t("struct.renalVein")} sub={t("sub.purifiedBlood")} right={true} />
      <ELabel ox={382} oy={365} lx={520} label={t("struct.ureter")} sub={t("sub.peristalsis")} right={true} />
      <ELabel ox={322} oy={493} lx={520} label={t("struct.bladder")} sub={t("sub.300600ml")} right={true} />
      <ELabel ox={268} oy={575} lx={520} label={t("struct.urethra")} sub={t("sub.exitPathway")} right={true} />

      {/* Adrenal labels */}
      <ELabel ox={132} oy={198} lx={60} label={t("struct.adrenalGland")} sub="aldosterone" right={false} />
    </svg>
  );
}

// ── Nephron SVG ───────────────────────────────────────────────────────────────
function NephronSVG({ selected, onSelect, journeyStep }: {
  selected: string | null; onSelect: (id: string) => void; journeyStep: number;
}) {
  const { t } = useLanguage();
  const sel = (id: string) => selected === id;

  const NEPHRON_JOURNEY_PTS = [
    { x: 90, y: 88, id: 'afferentArteriole' },
    { x: 222, y: 148, id: 'glomerulus' },
    { x: 222, y: 148, id: 'bowmansCapsule' },
    { x: 270, y: 298, id: 'proximalConvolutedTubule' },
    { x: 282, y: 488, id: 'loopOfHenle' },
    { x: 430, y: 348, id: 'distalConvolutedTubule' },
    { x: 552, y: 448, id: 'collectingDuct' },
    { x: 415, y: 285, id: 'peritubularCapillaries' },
  ];

  return (
    <svg viewBox="0 0 700 580" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        <filter id="ns_glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ns_glow_strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <style>{`
        @keyframes ns-glom-pulse { 0%,100%{opacity:0.85}50%{opacity:1} }
        @keyframes ns-capsule-pulse { 0%,100%{r:60}50%{r:63} }
        .ns-glom { animation: ns-glom-pulse 1.8s ease-in-out infinite; }
      `}</style>

      <rect x="0" y="0" width="700" height="580" fill="#030B1A" />
      <g opacity="0.04">
        {Array.from({length:9},(_, i)=><line key={i} x1={i*88} y1="0" x2={i*88} y2="580" stroke="#38bdf8" strokeWidth="0.5" />)}
        {Array.from({length:8},(_, i)=><line key={i} y1={i*82} x1="0" y2={i*82} x2="700" stroke="#38bdf8" strokeWidth="0.5" />)}
      </g>

      {/* ── Medulla boundary indicator ── */}
      <rect x="10" y="412" width="680" height="4" rx="2" fill="#334155" opacity="0.5" />
      <text x="350" y="408" textAnchor="middle" fontSize="9" fill="#475569" fontFamily="sans-serif">— CORTEX | MEDULLA —</text>

      {/* ── Peritubular capillaries / Vasa recta ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('peritubularCapillaries')}>
        <path d="M 378,205 C 425,218 458,258 452,300 C 446,340 424,362 406,380" fill="none"
          stroke={sel('peritubularCapillaries') ? "#facc15" : "#1d4ed8"} strokeWidth="10" strokeLinecap="round" opacity="0.85" />
        <path d="M 378,205 C 425,218 458,258 452,300 C 446,340 424,362 406,380" fill="none"
          stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        {/* Vasa recta alongside loop */}
        <line x1="302" y1="448" x2="302" y2="528" stroke={sel('peritubularCapillaries') ? "#facc15" : "#1d4ed8"} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
        <line x1="358" y1="528" x2="358" y2="418" stroke={sel('peritubularCapillaries') ? "#facc15" : "#1d4ed8"} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
        <path d="M 302,528 C 302,542 358,542 358,528" fill="none" stroke={sel('peritubularCapillaries') ? "#facc15" : "#1d4ed8"} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── PCT ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('proximalConvolutedTubule')}>
        <path d="M 222,208 C 305,228 345,268 312,305 C 278,340 215,335 238,375 C 260,412 322,402 288,442"
          fill="none" stroke={sel('proximalConvolutedTubule') ? "#facc15" : "#0e7490"} strokeWidth="15" strokeLinecap="round" opacity="0.9" />
        <path d="M 222,208 C 305,228 345,268 312,305 C 278,340 215,335 238,375 C 260,412 322,402 288,442"
          fill="none" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── Loop of Henle ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('loopOfHenle')}>
        {/* Descending */}
        <line x1="288" y1="442" x2="284" y2="528" stroke={sel('loopOfHenle') ? "#facc15" : "#5b21b6"} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        <line x1="288" y1="442" x2="284" y2="528" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        {/* U-turn */}
        <path d="M 284,528 C 284,548 338,548 338,528" fill="none" stroke={sel('loopOfHenle') ? "#facc15" : "#5b21b6"} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        <path d="M 284,528 C 284,548 338,548 338,528" fill="none" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        {/* Ascending */}
        <line x1="338" y1="528" x2="340" y2="418" stroke={sel('loopOfHenle') ? "#facc15" : "#6d28d9"} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        <line x1="338" y1="528" x2="340" y2="418" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        {/* Labels inside */}
        <text x="265" y="490" fontSize="7.5" fill="#c4b5fd" fontFamily="sans-serif">↓DESC</text>
        <text x="345" y="490" fontSize="7.5" fill="#c4b5fd" fontFamily="sans-serif">ASC↑</text>
      </g>

      {/* ── DCT ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('distalConvolutedTubule')}>
        <path d="M 340,418 C 392,390 432,410 468,376 C 500,346 512,312 555,322"
          fill="none" stroke={sel('distalConvolutedTubule') ? "#facc15" : "#9d174d"} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        <path d="M 340,418 C 392,390 432,410 468,376 C 500,346 512,312 555,322"
          fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── Collecting Duct ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('collectingDuct')}>
        <line x1="555" y1="322" x2="558" y2="578" stroke={sel('collectingDuct') ? "#facc15" : "#92400e"} strokeWidth="16" strokeLinecap="round" opacity="0.9" />
        <line x1="555" y1="322" x2="558" y2="578" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── Afferent Arteriole ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('afferentArteriole')}>
        <path d="M 30,88 C 82,80 132,102 162,130" fill="none"
          stroke={sel('afferentArteriole') ? "#facc15" : "#991b1b"} strokeWidth="14" strokeLinecap="round" opacity="0.95" />
        <path d="M 30,88 C 82,80 132,102 162,130" fill="none"
          stroke="#ef4444" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── Bowman's Capsule ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('bowmansCapsule')}>
        {sel('bowmansCapsule') && <circle cx="222" cy="148" r="72" fill="#facc15" opacity="0.1" filter="url(#ns_glow_strong)" />}
        <circle cx="222" cy="148" r="62" fill="none" stroke={sel('bowmansCapsule') ? "#facc15" : "#065f46"} strokeWidth="3.5" opacity="0.9" />
        <circle cx="222" cy="148" r="62" fill="#030B1A" opacity="0.5" />
      </g>

      {/* ── Glomerulus ── */}
      <g className="ns-glom" style={{ cursor: 'pointer' }} onClick={() => onSelect('glomerulus')}>
        {sel('glomerulus') && <circle cx="222" cy="148" r="48" fill="#facc15" opacity="0.2" filter="url(#ns_glow_strong)" />}
        <circle cx="222" cy="148" r="40" fill={sel('glomerulus') ? "#facc1550" : "#431407"} opacity="0.9" />
        {/* Capillary tuft - small overlapping circles */}
        {[{cx:208,cy:138,r:12},{cx:228,cy:132,r:11},{cx:242,cy:145,r:12},{cx:234,cy:162,r:11},{cx:214,cy:162,r:12},{cx:204,cy:152,r:10}].map((c,i)=>(
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="#c2410c" stroke="#f97316" strokeWidth="1.5" opacity="0.85" />
        ))}
        <text x="222" y="152" textAnchor="middle" fontSize="7.5" fill="#fed7aa" fontFamily="sans-serif" fontWeight="bold">Glom.</text>
      </g>

      {/* ── Efferent Arteriole ── */}
      <g style={{ cursor: 'pointer' }} onClick={() => onSelect('efferentArteriole')}>
        <path d="M 278,148 C 330,130 375,152 410,180 C 438,202 450,235 442,268"
          fill="none" stroke={sel('efferentArteriole') ? "#facc15" : "#92400e"} strokeWidth="12" strokeLinecap="round" opacity="0.9" />
        <path d="M 278,148 C 330,130 375,152 410,180 C 438,202 450,235 442,268"
          fill="none" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── Animated particles ── */}
      <Particle path="M 30,88 C 82,80 132,102 162,130" dur="1.8s" color="#ef4444" r={5} />
      <Particle path="M 30,88 C 82,80 132,102 162,130" dur="1.8s" color="#fca5a5" r={3.5} begin="0.9s" opacity={0.7} />
      {/* Blood through glomerulus */}
      <Particle path="M 185,142 C 205,130 228,122 252,138 C 268,150 272,160 258,170" dur="1.5s" color="#f97316" r={4} begin="0.2s" />
      {/* Blood through efferent → peritubular */}
      <Particle path="M 278,148 C 330,130 375,152 410,180 C 438,202 450,235 442,268 C 438,295 428,312 418,325" dur="2.8s" color="#f97316" r={4} begin="0.5s" />
      <Particle path="M 278,148 C 330,130 375,152 410,180 C 438,202 450,235 442,268 C 438,295 428,312 418,325" dur="2.8s" color="#fb923c" r={3} begin="1.7s" opacity={0.7} />
      {/* Filtrate through PCT */}
      <Particle path="M 222,208 C 305,228 345,268 312,305 C 278,340 215,335 238,375 C 260,412 322,402 288,442" dur="3.2s" color="#22d3ee" r={4.5} begin="0.6s" />
      <Particle path="M 222,208 C 305,228 345,268 312,305 C 278,340 215,335 238,375 C 260,412 322,402 288,442" dur="3.2s" color="#67e8f9" r={3} begin="2.0s" opacity={0.7} />
      {/* Filtrate through Loop descending */}
      <Particle path="M 288,442 L 284,528 C 284,548 338,548 338,528 L 340,418" dur="3.6s" color="#a78bfa" r={4} begin="1.0s" />
      <Particle path="M 288,442 L 284,528 C 284,548 338,548 338,528 L 340,418" dur="3.6s" color="#c4b5fd" r={3} begin="2.8s" opacity={0.7} />
      {/* Filtrate through DCT */}
      <Particle path="M 340,418 C 392,390 432,410 468,376 C 500,346 512,312 555,322" dur="2.8s" color="#f472b6" r={4} begin="1.5s" />
      <Particle path="M 340,418 C 392,390 432,410 468,376 C 500,346 512,312 555,322" dur="2.8s" color="#fda4af" r={3} begin="0.5s" opacity={0.7} />
      {/* Urine through collecting duct */}
      <Particle path="M 555,322 L 558,578" dur="2.8s" color="#fbbf24" r={5} begin="2.0s" />
      <Particle path="M 555,322 L 558,578" dur="2.8s" color="#fde68a" r={3.5} begin="0.8s" opacity={0.7} />
      {/* Water reabsorption particles from PCT to peritubular */}
      <Particle path="M 295,268 L 362,258" dur="1.4s" color="#60a5fa" r={3} begin="0.4s" opacity={0.8} />
      <Particle path="M 295,268 L 362,258" dur="1.4s" color="#93c5fd" r={2.5} begin="1.1s" opacity={0.6} />

      {/* ── Journey highlight ── */}
      {journeyStep >= 0 && journeyStep < NEPHRON_JOURNEY_PTS.length && (
        <circle cx={NEPHRON_JOURNEY_PTS[journeyStep].x} cy={NEPHRON_JOURNEY_PTS[journeyStep].y} r="14" fill="#facc15" opacity="0.8">
          <animate attributeName="r" values="11;16;11" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* ── Labels ── */}
      {/* Left labels */}
      <ELabel ox={90} oy={88} lx={50} label={t("struct.afferentArteriole")} sub={t("sub.highPressure")} right={false} />
      <ELabel ox={165} oy={148} lx={50} label={t("struct.bowmansCapsule")} sub={t("sub.collectsFiltrate")} right={false} />
      <ELabel ox={238} oy={335} lx={50} label={t("struct.pct")} sub={t("sub.6570Reabsorbed")} right={false} />
      <ELabel ox={282} oy={488} lx={50} label={t("struct.loopOfHenle")} sub={t("sub.countercurrent")} right={false} />
      {/* Right labels */}
      <ELabel ox={258} oy={118} lx={650} label={t("struct.glomerulus")} sub={t("sub.ultrafiltration")} right={true} />
      <ELabel ox={395} oy={175} lx={650} label={t("struct.efferentArteriole")} sub={t("sub.narrowerVessel")} right={true} />
      <ELabel ox={420} oy={290} lx={650} label={t("struct.peritubularCaps")} sub={t("sub.reabsorption")} right={true} />
      <ELabel ox={465} oy={350} lx={650} label={t("struct.dct")} sub={t("sub.aldosteroneTarget")} right={true} />
      <ELabel ox={555} oy={450} lx={650} label={t("struct.collectingDuct")} sub={t("sub.adhTarget")} right={true} />
    </svg>
  );
}

// ── Info Panel ────────────────────────────────────────────────────────────────
function InfoPanel({ data, onClose }: { data: StructureInfo; onClose: () => void }) {
  const { t, lang } = useLanguage();
  const processBadge: Record<string, string> = {
    organ: "bg-rose-900 text-rose-200 border border-rose-700",
    nephron: "bg-indigo-900 text-indigo-200 border border-indigo-700",
  };
  const fns = pickLang(data.functions, lang);
  const keyFs = pickLang(data.keyFacts, lang);
  const notes = pickLang(data.examNotes, lang);
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white leading-tight">{pickLang(data.name, lang)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{pickLang(data.role, lang)}</p>
          <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${processBadge[data.category]}`}>
            {t(`category.${data.category}`)}
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl ml-2 flex-shrink-0 mt-1">×</button>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{pickLang(data.description, lang)}</p>
      <div>
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">{t("panel.functions")}</h4>
        <ul className="space-y-1">
          {fns.map((f, i) => <li key={i} className="flex gap-2 text-xs text-slate-300"><span className="text-emerald-400 flex-shrink-0">•</span>{f}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">{t("panel.keyFacts")}</h4>
        <ul className="space-y-1">
          {keyFs.map((f, i) => <li key={i} className="flex gap-2 text-xs text-slate-300"><span className="text-blue-400 flex-shrink-0">→</span>{f}</li>)}
        </ul>
      </div>
      <div className="bg-yellow-950 border border-yellow-800 rounded-lg p-3">
        <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1.5">{t("panel.examNotes")}</h4>
        <ul className="space-y-1">
          {notes.map((n, i) => <li key={i} className="flex gap-2 text-xs text-yellow-200"><span className="text-yellow-400 flex-shrink-0">★</span>{n}</li>)}
        </ul>
      </div>
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
        <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">{t("panel.ncertNote")}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{pickLang(data.ncertNote, lang)}</p>
      </div>
      <div className="bg-purple-950 border border-purple-800 rounded-lg p-3">
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">{t("panel.funFact")}</h4>
        <p className="text-xs text-purple-200 leading-relaxed">{pickLang(data.funFact, lang)}</p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">{t("panel.disorders")}</h4>
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
      style={{ background: "linear-gradient(135deg,#020B1A 0%,#0a0f2e 50%,#020B1A 100%)" }}>
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="text-8xl mb-4 select-none" style={{ filter: "drop-shadow(0 0 30px #3b82f6)" }}>🫘</div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">
        {t("dash.excretory.title")}
      </h1>
      <p className="text-slate-400 text-center max-w-xl mb-8 text-sm">
        {t("dash.excretory.subtitle")}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
        {[
          { labelKey: "dash.excretory.stat1", subKey: "dash.excretory.stat1sub", color: "text-red-400" },
          { labelKey: "dash.excretory.stat2", subKey: "dash.excretory.stat2sub", color: "text-amber-400" },
          { labelKey: "dash.excretory.stat3", subKey: "dash.excretory.stat3sub", color: "text-cyan-400" },
          { labelKey: "dash.excretory.stat4", subKey: "dash.excretory.stat4sub", color: "text-purple-400" },
        ].map(s => (
          <div key={s.labelKey} className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{t(s.labelKey)}</div>
            <div className="text-xs text-slate-400 mt-1">{t(s.subKey)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        <div className="bg-rose-950 border border-rose-700 rounded-xl p-4">
          <h3 className="text-rose-300 font-bold mb-1 text-sm">{t("struct.pct").split("(")[0].trim()} {t("struct.loopOfHenle")}</h3>
          <p className="text-xs text-rose-200">Filtration → Reabsorption → Secretion → Excretion</p>
          <p className="text-xs text-slate-400 mt-1">{t("struct.glomerulus")} → PCT → Loop → DCT</p>
        </div>
        <div className="bg-blue-950 border border-blue-700 rounded-xl p-4">
          <h3 className="text-blue-300 font-bold mb-1 text-sm">{t("struct.kidneys").replace("সোঁ ", "").replace("Right ", "")}</h3>
          <p className="text-xs text-blue-200">{t("struct.kidneys")} · Skin · {t("struct.lungs")} · Liver</p>
          <p className="text-xs text-slate-400 mt-1">Principal: {t("struct.kidneys")} (urea, uric acid, creatinine)</p>
        </div>
      </div>
      <button onClick={onStart}
        className="px-8 py-3 rounded-xl text-white font-bold text-base transition-all"
        style={{ background: "linear-gradient(90deg,#1e3a8a,#2563eb)", boxShadow: "0 0 28px #3b82f6aa" }}>
        {t("ui.startExploration")}
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
  function choose(i: number) { if (chosen !== null) return; setChosen(i); if (i === q.ans) setScore(s => s + 1); }
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative" style={{ background: "#020B1A" }}>
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="text-6xl mb-4">🫘</div>
      <h2 className="text-2xl font-bold text-white mb-2">{t("ui.quizComplete")}</h2>
      <p className="text-4xl font-extrabold text-blue-400 mb-1">{score}/{QUIZ_DATA.length}</p>
      <p className="text-slate-400 mb-6">
        {score >= 8 ? t("quiz.excellent.excretory") : score >= 5 ? t("quiz.good.excretory") : t("quiz.try.excretory")}
      </p>
      <div className="flex gap-3">
        <button onClick={restart} className="px-5 py-2 rounded-lg bg-blue-800 text-white font-bold hover:bg-blue-700">{t("ui.retry")}</button>
        <button onClick={onBack} className="px-5 py-2 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600">{t("ui.back")}</button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 relative" style={{ background: "#020B1A" }}>
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white text-sm">← {t("ui.back")}</button>
          <span className="text-slate-400 text-sm">{t("quiz.questionPrefix")} {idx + 1}/{QUIZ_DATA.length} · {t("ui.score")}: {score}</span>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <p className="text-white font-semibold text-sm mb-4 leading-relaxed">{qText}</p>
          <div className="space-y-2">
            {qOpts.map((o, i) => {
              let cls = "w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all border ";
              if (chosen === null) cls += "border-slate-600 text-slate-200 hover:border-blue-500 hover:bg-blue-950 bg-slate-800";
              else if (i === q.ans) cls += "border-emerald-500 bg-emerald-950 text-emerald-200";
              else if (i === chosen) cls += "border-red-500 bg-red-950 text-red-200";
              else cls += "border-slate-700 bg-slate-800 text-slate-400";
              return <button key={i} className={cls} onClick={() => choose(i)}>{o}</button>;
            })}
          </div>
          {chosen !== null && <div className="mt-4 bg-slate-800 border border-slate-600 rounded-lg p-3"><p className="text-xs text-slate-300">{qExplanation}</p></div>}
          {chosen !== null && (
            <button onClick={next} className="mt-4 w-full py-2 rounded-lg bg-blue-800 text-white font-bold hover:bg-blue-700 text-sm">
              {idx + 1 < QUIZ_DATA.length ? t("ui.next") : t("ui.seeResults")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Explorer ──────────────────────────────────────────────────────────────────
function ExcretoryExplorer({ onBack }: { onBack: () => void }) {
  const { t, lang } = useLanguage();
  const { recordInteraction, recordJourneyFinished } = useLabTracker();
  const [tab, setTab] = useState<'system' | 'nephron'>('system');
  const [selected, setSelected] = useState<string | null>(null);
  const [journeyStep, setJourneyStep] = useState(-1);
  const [journeyActive, setJourneyActive] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const NEPHRON_JOURNEY_LEN = 8;

  function startJourney() {
    setJourneyActive(true);
    setJourneyStep(0);
    const journey = tab === 'system' ? SYSTEM_JOURNEY : null;
    const len = tab === 'system' ? SYSTEM_JOURNEY.length : NEPHRON_JOURNEY_LEN;
    if (journey) setSelected(journey[0].structureId);
    let step = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= len) { clearInterval(intervalRef.current!); setJourneyActive(false); setJourneyStep(-1); recordJourneyFinished(); return; }
      setJourneyStep(step);
      if (tab === 'system' && step < SYSTEM_JOURNEY.length) setSelected(SYSTEM_JOURNEY[step].structureId);
    }, 2600);
  }

  function stopJourney() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setJourneyActive(false); setJourneyStep(-1);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  useEffect(() => { stopJourney(); setSelected(null); }, [tab]);

  if (showQuiz) return <Quiz onBack={() => setShowQuiz(false)} />;

  const selectedData = selected ? STRUCTURES[selected] : null;
  const curStep = journeyStep >= 0 && journeyStep < SYSTEM_JOURNEY.length && tab === 'system' ? SYSTEM_JOURNEY[journeyStep] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#020B1A" }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 flex-wrap">
        <button onClick={onBack} className="text-slate-400 hover:text-white text-sm">{t("ui.backToDashboard")}</button>
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 rounded-lg p-1">
          <button onClick={() => setTab('system')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${tab === 'system' ? 'bg-blue-800 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t("tab.excretorySystem")}
          </button>
          <button onClick={() => setTab('nephron')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${tab === 'nephron' ? 'bg-cyan-800 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t("tab.nephron")}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap ml-auto items-center">
          <LanguageToggle />
          {!journeyActive
            ? <button onClick={startJourney} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{ background: "linear-gradient(90deg,#1e3a8a,#2563eb)" }}>
                {tab === 'system' ? t("ui.filtrationJourney") : t("ui.nephronJourney")}
              </button>
            : <button onClick={stopJourney} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-700 hover:bg-slate-600">{t("ui.stop")}</button>}
          <button onClick={() => setShowQuiz(true)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-800 hover:bg-purple-700">{t("ui.quiz")}</button>
          <button onClick={() => setSelected(null)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-600 hover:text-white">{t("ui.clear")}</button>
        </div>
      </div>

      {/* Journey banner */}
      {curStep && (
        <div className="mx-4 mt-3 rounded-xl border border-blue-800 bg-blue-950 px-4 py-2 flex items-center gap-3">
          <span className="text-blue-400 font-bold text-sm">{t("ui.step")} {journeyStep + 1}/{SYSTEM_JOURNEY.length}:</span>
          <span className="text-blue-200 font-semibold text-sm">{pickLang(curStep.stage, lang)}</span>
          <span className="text-blue-300 text-xs hidden md:inline">— {pickLang(curStep.shortNote, lang)}</span>
        </div>
      )}
      {journeyActive && tab === 'nephron' && (
        <div className="mx-4 mt-3 rounded-xl border border-cyan-800 bg-cyan-950 px-4 py-2 flex items-center gap-3">
          <span className="text-cyan-400 font-bold text-sm">{t("tab.nephron")}</span>
          <span className="text-cyan-200 text-xs">{t("ui.step")} {journeyStep + 1}/{NEPHRON_JOURNEY_LEN}</span>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* SVG panel */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={{ minHeight: 400 }}>
          <div className="w-full relative" style={{ maxWidth: 680, maxHeight: "calc(100vh - 148px)" }}>
            {tab === 'system'
              ? <ExcretorySystemSVG selected={selected} onSelect={id => { stopJourney(); setSelected(id); recordInteraction(id); }} journeyStep={journeyStep} />
              : <NephronSVG selected={selected} onSelect={id => { stopJourney(); setSelected(id); recordInteraction(id); }} journeyStep={journeyStep} />}
            {!selected && !journeyActive && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 text-xs pointer-events-none whitespace-nowrap">
                {t("ui.clickToExplore")}
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        {selectedData
          ? <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 110px)" }}>
              <InfoPanel data={selectedData} onClose={() => setSelected(null)} />
            </div>
          : <div className="hidden md:flex w-80 lg:w-96 border-l border-slate-800 bg-slate-950 items-center justify-center">
              <div className="text-center p-6">
                <div className="text-4xl mb-3 opacity-40">🫘</div>
                <p className="text-slate-500 text-sm">{t("ui.clickToExplore")}</p>
                <div className="mt-4 space-y-2">
                  {(tab === 'system'
                    ? ['kidneys','renalArtery','ureter','bladder']
                    : ['glomerulus','proximalConvolutedTubule','loopOfHenle','collectingDuct']
                  ).map(id => {
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
            </div>}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-800 flex-wrap">
        <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded-sm bg-red-600" /><span className="text-xs text-slate-400">Oxygenated blood</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded-sm bg-blue-600" /><span className="text-xs text-slate-400">Filtered blood/IVC</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded-sm bg-amber-500" /><span className="text-xs text-slate-400">Urine</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded-sm bg-cyan-500" /><span className="text-xs text-slate-400">Filtrate (PCT)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded-sm" style={{ background: "#a78bfa" }} /><span className="text-xs text-slate-400">Loop of Henle</span></div>
      </div>
    </div>
  );
}

// ── Root Module ───────────────────────────────────────────────────────────────
export function ExcretorySystemModule() {
  const [view, setView] = useState<'dashboard' | 'explorer'>('dashboard');
  if (view === 'explorer') return <ExcretoryExplorer onBack={() => setView('dashboard')} />;
  return <Dashboard onStart={() => setView('explorer')} />;
}
