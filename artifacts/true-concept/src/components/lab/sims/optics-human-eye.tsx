/**
 * Human Eye Virtual Laboratory — Class IX–X Physics
 * Three immersive tabs:
 *   1. Explorer    — interactive cross-section, light rays, accommodation
 *   2. Myopia      — short-sightedness defect + concave-lens cure
 *   3. Hypermetropia — long-sightedness defect + convex-lens cure
 *
 * Fully bilingual (English + Assamese) via useLanguage().
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimContainer, SimSlider, SimButton, SimNumber, useRafLoop } from "../sim-ui";
import {
  Eye, ScanEye, Glasses, Sun, Sparkles, Info, RotateCcw,
  ZoomIn, ZoomOut, Lightbulb, Play, Pause,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// SHARED TYPES & DATA
// ═══════════════════════════════════════════════════════════════

type EyeTab = "explorer" | "myopia" | "hypermetropia";

interface EyePart {
  id: string;
  en: { name: string; short: string; desc: string };
  as: { name: string; short: string; desc: string };
  color: string;
  // SVG label anchor (where the line+pill points to)
  ax: number; ay: number;
  // Label pill position
  lx: number; ly: number;
}

// Eye parts — coordinates calibrated for a 600 × 380 viewBox
const EYE_PARTS: EyePart[] = [
  {
    id: "cornea",
    en: { name: "Cornea", short: "Transparent front window",
          desc: "Transparent, dome-shaped front surface. Does most of the light bending (~67% of the eye's total focusing power)." },
    as: { name: "কৰ্নিয়া", short: "স্বচ্ছ সন্মুখীন আৱৰণ",
          desc: "স্বচ্ছ, গম্বুজাকাৰ সন্মুখীন পৃষ্ঠ। চকুৰ মুঠ আলোক প্ৰতিসৰণৰ প্ৰায় ৬৭% ইয়াতে হয়।" },
    color: "#7dd3fc", ax: 138, ay: 190, lx: 30, ly: 110,
  },
  {
    id: "iris",
    en: { name: "Iris", short: "Coloured ring",
          desc: "The coloured ring around the pupil. Muscles in the iris adjust pupil size to control how much light enters." },
    as: { name: "আইৰিছ", short: "ৰঙীন বলয়",
          desc: "তাৰাৰ চাৰিওফালৰ ৰঙীন বলয়। আইৰিছৰ মাংসপেশীয়ে তাৰাৰ আকাৰ সলনি কৰি প্ৰৱেশ কৰা পোহৰ নিয়ন্ত্ৰণ কৰে।" },
    color: "#a78bfa", ax: 168, ay: 165, lx: 30, ly: 70,
  },
  {
    id: "pupil",
    en: { name: "Pupil", short: "Light entry hole",
          desc: "The dark opening at the centre of the iris. Dilates in dim light, contracts in bright light." },
    as: { name: "তাৰা (পিউপিল)", short: "পোহৰ প্ৰৱেশৰ ৰন্ধ্ৰ",
          desc: "আইৰিছৰ মাজত থকা ক'লা ৰন্ধ্ৰ। কম পোহৰত ডাঙৰ, পোহৰ বেছি হ'লে সৰু হয়।" },
    color: "#0f172a", ax: 188, ay: 190, lx: 215, ly: 38,
  },
  {
    id: "lens",
    en: { name: "Crystalline Lens", short: "Adjustable focusing lens",
          desc: "A flexible biconvex lens behind the iris. Changes thickness (accommodation) to focus on near or distant objects." },
    as: { name: "অভিনেত্ৰ (লেন্স)", short: "সমন্বয়যোগ্য ফোকাচিং লেন্স",
          desc: "আইৰিছৰ পাছত থকা নমনীয় উভয়োত্তল লেন্স। ওচৰ বা দূৰৰ বস্তুক ফোকাচ কৰিবলৈ মোটা বা পাতল হয় (এডজেস্টমেণ্ট)।" },
    color: "#fcd34d", ax: 215, ay: 190, lx: 320, ly: 38,
  },
  {
    id: "ciliary",
    en: { name: "Ciliary Muscles", short: "Lens thickness control",
          desc: "Ring of muscles that contract or relax to change the lens thickness. Contracted → thicker lens (near vision)." },
    as: { name: "চিলিয়াৰী মাংসপেশী", short: "লেন্সৰ পুৰুত্ব নিয়ন্ত্ৰক",
          desc: "এক বলয়াকাৰ মাংসপেশী যি সঙ্কোচন বা শিথিল হৈ লেন্সৰ পুৰুত্ব সলনি কৰে। সঙ্কোচন → মোটা লেন্স (ওচৰ দৃষ্টি)।" },
    color: "#fb7185", ax: 215, ay: 138, lx: 420, ly: 38,
  },
  {
    id: "aqueous",
    en: { name: "Aqueous Humor", short: "Watery fluid (front)",
          desc: "Clear watery fluid between cornea and lens. Maintains eye shape and supplies nutrients." },
    as: { name: "একুৱাছ হিউমাৰ", short: "আগৰ পানী-সদৃশ তৰল",
          desc: "কৰ্নিয়া আৰু লেন্সৰ মাজত থকা স্বচ্ছ পানী-সদৃশ তৰল। চকুৰ আকাৰ ৰক্ষা কৰে আৰু পুষ্টি যোগায়।" },
    color: "#bae6fd", ax: 170, ay: 220, lx: 22, ly: 270,
  },
  {
    id: "vitreous",
    en: { name: "Vitreous Humor", short: "Jelly fluid (back)",
          desc: "Clear jelly-like fluid filling the back of the eye. Holds the retina against the eye wall." },
    as: { name: "ভিট্ৰিয়াছ হিউমাৰ", short: "পিছফালৰ জেলী-সদৃশ তৰল",
          desc: "চকুৰ পিছফাল ভৰাই থকা স্বচ্ছ জেলী-সদৃশ তৰল। ৰেটিনাক চকুৰ দেৱালত আঁকোৱালি ৰাখে।" },
    color: "#e0f2fe", ax: 360, ay: 200, lx: 250, ly: 320,
  },
  {
    id: "retina",
    en: { name: "Retina", short: "Light-sensitive screen",
          desc: "Light-sensitive layer at the back. Contains rods (low-light) and cones (colour). Converts light into nerve signals." },
    as: { name: "ৰেটিনা", short: "পোহৰ-সংবেদী পৰ্দা",
          desc: "চকুৰ পিছফালৰ পোহৰ-সংবেদী স্তৰ। ৰড (কম পোহৰ) আৰু কোন (ৰং) থাকে। পোহৰক স্নায়ু সংকেতলৈ ৰূপান্তৰ কৰে।" },
    color: "#f97316", ax: 470, ay: 190, lx: 520, ly: 110,
  },
  {
    id: "yellow-spot",
    en: { name: "Yellow Spot (Macula)", short: "Sharpest vision area",
          desc: "Small yellowish region on the retina with the highest density of cones. Centre of sharpest, most colourful vision." },
    as: { name: "হালধীয়া দাগ (মেকুলা)", short: "তীক্ষ্ণ দৃষ্টিৰ স্থান",
          desc: "ৰেটিনাৰ ওপৰৰ এক সৰু হালধীয়া অঞ্চল য'ত কোনৰ ঘনত্ব সৰ্বাধিক। তীক্ষ্ণ আৰু ৰঙীন দৃষ্টিৰ কেন্দ্ৰ।" },
    color: "#fde047", ax: 478, ay: 195, lx: 520, ly: 170,
  },
  {
    id: "blind-spot",
    en: { name: "Blind Spot", short: "No photoreceptors",
          desc: "Where the optic nerve exits the eye. No rods or cones here — so any image falling here is not seen." },
    as: { name: "অন্ধ-স্থান", short: "ফট'ৰিচেপ্টৰ নাই",
          desc: "চকুৰ পৰা অপটিক স্নায়ু ওলোৱা স্থান। ইয়াত ৰড বা কোন নাই — সেয়েহে ইয়াত পৰা প্ৰতিচ্ছবি দেখা নাযায়।" },
    color: "#94a3b8", ax: 478, ay: 235, lx: 520, ly: 240,
  },
  {
    id: "optic-nerve",
    en: { name: "Optic Nerve", short: "Signal cable to brain",
          desc: "Bundle of over a million nerve fibres carrying visual signals from the retina to the brain's visual cortex." },
    as: { name: "অপটিক স্নায়ু", short: "মস্তিষ্কলৈ সংকেত কেবল",
          desc: "দহ লাখৰো অধিক স্নায়ু তন্তুৰে গঠিত — ৰেটিনাৰ পৰা মস্তিষ্কৰ দৃষ্টি কেন্দ্ৰলৈ দৃষ্টি সংকেত কঢ়িয়াই নিয়ে।" },
    color: "#a3e635", ax: 510, ay: 245, lx: 520, ly: 305,
  },
];

// ═══════════════════════════════════════════════════════════════
// EYE SVG — Cross-section, used by all 3 tabs (parameterised)
// ═══════════════════════════════════════════════════════════════

interface EyeSvgProps {
  /** Eyeball horizontal radius (semi-major axis) in svg units — defaults to 200 (normal). */
  rx?: number;
  /** Lens thickness (half-width); 14 = thin, 30 = fat. Default 18. */
  lensThickness?: number;
  /** Highlighted part id (glows). */
  highlightId?: string | null;
  /** Show internal cutaway labels & all part fills. */
  showCutaway?: boolean;
  /** Show animated light rays from object → retina. */
  showRays?: boolean;
  /** Phase value for animations. */
  phase?: number;
  /** Where rays converge horizontally — if not on retina, blur happens. */
  focalX?: number;
  /** Optional corrective lens type: "concave" | "convex". */
  correctiveLens?: "concave" | "convex" | null;
  /** SVG width / height for layout. */
  width?: number; height?: number;
  /** Click handler for any labelled part. */
  onPartClick?: (id: string) => void;
}

function EyeSvg({
  rx = 200, lensThickness = 18, highlightId = null,
  showCutaway = true, showRays = false, phase = 0,
  focalX, correctiveLens = null, width = 600, height = 380,
  onPartClick,
}: EyeSvgProps) {
  // Eye centre & geometry
  const cx = 300, cy = 195, ry = 175;
  // Retina arc — back of the eye
  const retinaStartX = cx + rx - 20;
  // Lens centre
  const lensCx = 215, lensCy = 190;
  // Light rays
  const rayStartX = 0;
  const rayY = [155, 195, 235];
  const targetX = focalX ?? retinaStartX + 5;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="eyeGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="70%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </radialGradient>
        <radialGradient id="lensGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="pupilGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* OUTER SCLERA / EYE SHELL */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
               fill={showCutaway ? "url(#eyeGrad)" : "#fdf6e3"}
               stroke="#92400e" strokeWidth="2" />

      {/* VITREOUS HUMOR fill (back chamber) */}
      {showCutaway && (
        <path
          d={`M ${lensCx + 30} ${cy - 130} Q ${cx + rx - 6} ${cy - 80} ${cx + rx - 6} ${cy}
              Q ${cx + rx - 6} ${cy + 80} ${lensCx + 30} ${cy + 130} Z`}
          fill="rgba(186,230,253,0.25)"
          stroke={highlightId === "vitreous" ? "#0ea5e9" : "none"}
          strokeWidth={highlightId === "vitreous" ? 2 : 0}
        />
      )}

      {/* RETINA — inner back arc */}
      {showCutaway && (
        <path d={`M ${cx} ${cy - ry + 6} A ${rx - 6} ${ry - 6} 0 0 1 ${cx} ${cy + ry - 6}`}
              fill="none"
              stroke={highlightId === "retina" ? "#f97316" : "#fb923c"}
              strokeWidth={highlightId === "retina" ? 6 : 4}
              style={highlightId === "retina" ? { filter: "drop-shadow(0 0 8px #f97316)" } : undefined}
        />
      )}

      {/* AQUEOUS HUMOR (front chamber) */}
      {showCutaway && (
        <path d={`M ${cx - rx + 6} ${cy} Q ${cx - rx + 6} ${cy - 40} ${lensCx - 24} ${cy - 40}
                  L ${lensCx - 24} ${cy + 40} Q ${cx - rx + 6} ${cy + 40} ${cx - rx + 6} ${cy} Z`}
              fill="rgba(186,230,253,0.45)"
              stroke={highlightId === "aqueous" ? "#0ea5e9" : "none"}
              strokeWidth={highlightId === "aqueous" ? 2 : 0}
        />
      )}

      {/* CORNEA — front transparent dome */}
      <path
        d={`M ${cx - rx + 4} ${cy - 45} Q ${cx - rx - 18} ${cy} ${cx - rx + 4} ${cy + 45}`}
        fill="rgba(125,211,252,0.25)"
        stroke={highlightId === "cornea" ? "#0ea5e9" : "#38bdf8"}
        strokeWidth={highlightId === "cornea" ? 4 : 2.5}
        style={highlightId === "cornea" ? { filter: "drop-shadow(0 0 8px #0ea5e9)" } : undefined}
      />

      {/* IRIS — coloured ring (front) */}
      <g>
        <path d={`M ${lensCx - 26} ${lensCy - 50} L ${lensCx - 26} ${lensCy - 14}`}
              stroke={highlightId === "iris" ? "#7c3aed" : "#8b5cf6"} strokeWidth="9" strokeLinecap="round"
              style={highlightId === "iris" ? { filter: "drop-shadow(0 0 6px #7c3aed)" } : undefined} />
        <path d={`M ${lensCx - 26} ${lensCy + 14} L ${lensCx - 26} ${lensCy + 50}`}
              stroke={highlightId === "iris" ? "#7c3aed" : "#8b5cf6"} strokeWidth="9" strokeLinecap="round"
              style={highlightId === "iris" ? { filter: "drop-shadow(0 0 6px #7c3aed)" } : undefined} />
      </g>

      {/* PUPIL — black opening */}
      <ellipse cx={lensCx - 26} cy={lensCy} rx={3} ry={14} fill="url(#pupilGrad)"
               stroke={highlightId === "pupil" ? "#facc15" : "none"} strokeWidth={highlightId === "pupil" ? 2 : 0} />

      {/* CRYSTALLINE LENS — biconvex, thickness driven by lensThickness */}
      <ellipse cx={lensCx} cy={lensCy} rx={lensThickness} ry={50}
               fill="url(#lensGrad)"
               stroke={highlightId === "lens" ? "#eab308" : "#ca8a04"}
               strokeWidth={highlightId === "lens" ? 3 : 1.5}
               style={highlightId === "lens" ? { filter: "drop-shadow(0 0 10px #facc15)" } : undefined} />

      {/* CILIARY MUSCLES — at top/bottom of lens */}
      {showCutaway && (
        <g stroke={highlightId === "ciliary" ? "#e11d48" : "#fb7185"}
           strokeWidth={highlightId === "ciliary" ? 4 : 2.5} strokeLinecap="round"
           style={highlightId === "ciliary" ? { filter: "drop-shadow(0 0 6px #fb7185)" } : undefined}>
          <line x1={lensCx - 14} y1={lensCy - 56} x2={lensCx + 14} y2={lensCy - 50} />
          <line x1={lensCx - 14} y1={lensCy + 56} x2={lensCx + 14} y2={lensCy + 50} />
          <line x1={lensCx - 20} y1={lensCy - 60} x2={lensCx + 20} y2={lensCy - 54} />
          <line x1={lensCx - 20} y1={lensCy + 60} x2={lensCx + 20} y2={lensCy + 54} />
        </g>
      )}

      {/* YELLOW SPOT (macula) */}
      {showCutaway && (
        <circle cx={cx + rx - 6} cy={cy} r={highlightId === "yellow-spot" ? 7 : 5}
                fill="#fde047"
                stroke={highlightId === "yellow-spot" ? "#facc15" : "none"}
                strokeWidth={highlightId === "yellow-spot" ? 2 : 0}
                style={highlightId === "yellow-spot" ? { filter: "drop-shadow(0 0 8px #facc15)" } : undefined} />
      )}

      {/* BLIND SPOT */}
      {showCutaway && (
        <circle cx={cx + rx - 14} cy={cy + 40} r={highlightId === "blind-spot" ? 7 : 5} fill="#94a3b8"
                stroke={highlightId === "blind-spot" ? "#fff" : "none"} strokeWidth={2}
                style={highlightId === "blind-spot" ? { filter: "drop-shadow(0 0 6px #94a3b8)" } : undefined} />
      )}

      {/* OPTIC NERVE — extending out the back */}
      {showCutaway && (
        <path d={`M ${cx + rx - 18} ${cy + 38} Q ${cx + rx + 25} ${cy + 55} ${cx + rx + 50} ${cy + 70}
                  L ${cx + rx + 80} ${cy + 88} L ${cx + rx + 80} ${cy + 105}
                  L ${cx + rx + 50} ${cy + 88} Q ${cx + rx + 22} ${cy + 72} ${cx + rx - 14} ${cy + 52} Z`}
              fill={highlightId === "optic-nerve" ? "#84cc16" : "#a3e635"}
              stroke="#65a30d" strokeWidth="1.5"
              style={highlightId === "optic-nerve" ? { filter: "drop-shadow(0 0 8px #a3e635)" } : undefined} />
      )}

      {/* OPTIONAL CORRECTIVE LENS in front */}
      {correctiveLens && (() => {
        const lx = cx - rx - 55;   // horizontal centre of corrective lens
        const H = 70;              // half-height
        if (correctiveLens === "concave") {
          // Biconcave: thin in the middle, thick at top/bottom edges.
          // Two arcs both curve INWARD toward the optical axis.
          const edgeW = 11;         // edge thickness
          const midW  = 3;          // middle thickness
          return (
            <g>
              <path
                d={`M ${lx - edgeW} ${cy - H}
                    Q ${lx - midW} ${cy} ${lx - edgeW} ${cy + H}
                    L ${lx + edgeW} ${cy + H}
                    Q ${lx + midW} ${cy} ${lx + edgeW} ${cy - H} Z`}
                fill="rgba(56,189,248,0.35)" stroke="#0ea5e9" strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 6px rgba(14,165,233,0.4))" }}
              />
              {/* glass shine */}
              <line x1={lx - 2} y1={cy - H + 10} x2={lx - 4} y2={cy - 10}
                    stroke="white" strokeWidth="1.5" opacity="0.5" />
            </g>
          );
        }
        // Biconvex: fat in the middle, thin at edges — symmetric lens.
        return (
          <g>
            <ellipse cx={lx} cy={cy} rx={14} ry={H}
                     fill="rgba(56,189,248,0.35)" stroke="#0ea5e9" strokeWidth="2"
                     style={{ filter: "drop-shadow(0 0 6px rgba(14,165,233,0.4))" }} />
            <line x1={lx - 4} y1={cy - H + 12} x2={lx - 7} y2={cy - 12}
                  stroke="white" strokeWidth="1.5" opacity="0.5" />
          </g>
        );
      })()}

      {/* LIGHT RAYS — animated */}
      {showRays && (
        <g>
          {rayY.map((y, i) => {
            // Ray segments: incoming → refract at cornea → refract at lens → meet at targetX
            const corneaX = cx - rx + 8;
            const dashOffset = -(phase * 60) % 16;
            return (
              <g key={i}>
                {/* Incoming */}
                <line x1={rayStartX} y1={y} x2={corneaX} y2={y}
                      stroke="#ef4444" strokeWidth="2" strokeDasharray="8 4"
                      strokeDashoffset={dashOffset} opacity="0.85" />
                {/* Through cornea → lens (slightly bent toward axis) */}
                <line x1={corneaX} y1={y} x2={lensCx - lensThickness}
                      y2={cy + (y - cy) * 0.85}
                      stroke="#f59e0b" strokeWidth="2" />
                {/* Through lens → focal point */}
                <line x1={lensCx + lensThickness} y1={cy + (y - cy) * 0.85}
                      x2={targetX} y2={cy}
                      stroke="#fde047" strokeWidth="2"
                      style={{ filter: "drop-shadow(0 0 4px #fde047)" }} />
              </g>
            );
          })}
          {/* Focal point */}
          <circle cx={targetX} cy={cy} r="5" fill="#fde047"
                  style={{ filter: "drop-shadow(0 0 10px #fde047)" }}>
            <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* PART LABELS — clickable */}
      {showCutaway && EYE_PARTS.map(p => {
        const isHi = highlightId === p.id;
        return (
          <g key={p.id} onClick={() => onPartClick?.(p.id)}
             style={{ cursor: "pointer" }}>
            {/* Connector line */}
            <line x1={p.ax} y1={p.ay} x2={p.lx + 32} y2={p.ly + 9}
                  stroke={isHi ? p.color : "#94a3b8"}
                  strokeWidth={isHi ? 2 : 1} opacity={isHi ? 1 : 0.6} />
            {/* Pill label */}
            <g transform={`translate(${p.lx} ${p.ly})`}>
              <rect x="0" y="0" width="84" height="18" rx="9"
                    fill={isHi ? p.color : "rgba(15,23,42,0.85)"}
                    stroke={isHi ? "#fff" : "#475569"} strokeWidth={isHi ? 1.5 : 1} />
              <text x="42" y="13" textAnchor="middle"
                    fill={isHi ? "#0f172a" : "#e2e8f0"} fontSize="9" fontWeight="bold">
                {/* Show short name */}
                {p.id === "yellow-spot" ? "Yellow Spot"
                 : p.id === "blind-spot" ? "Blind Spot"
                 : p.id === "optic-nerve" ? "Optic Nerve"
                 : p.id === "ciliary" ? "Ciliary"
                 : p.id === "aqueous" ? "Aqueous"
                 : p.id === "vitreous" ? "Vitreous"
                 : p.en.name}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 1 — HUMAN EYE EXPLORER
// ═══════════════════════════════════════════════════════════════

function ExplorerTab() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [showCutaway, setShowCutaway] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [objectDistance, setObjectDistance] = useState(50);   // cm — 10 (very near) to 500 (far)
  const [phase, setPhase] = useState(0);

  useRafLoop(showRays, (dt) => setPhase(p => (p + dt) % 1000));

  // Accommodation: near objects → thick lens, far objects → thin lens
  // Map 10cm..500cm → 30..14 (lens thickness)
  const lensThickness = useMemo(() => {
    const t = Math.min(1, Math.max(0, (500 - objectDistance) / 490));
    return 14 + t * 16;
  }, [objectDistance]);

  // Lens formula: 1/v − 1/u = 1/f
  // Take v = 22mm (eye axial length, treat as 2.2 cm)
  // f varies with accommodation. For normal eye, f ≈ 17–22 mm.
  // We compute f from u and v: 1/f = 1/v − 1/u
  const v = 2.2;
  const u = -objectDistance;
  const f = 1 / (1 / v - 1 / u);
  const ciliaryState = lensThickness > 22
    ? (isAs ? "সঙ্কোচিত (ওচৰ দৃষ্টি)" : "Contracted (near vision)")
    : (isAs ? "শিথিল (দূৰ দৃষ্টি)" : "Relaxed (distant vision)");

  const selected = highlightId ? EYE_PARTS.find(p => p.id === highlightId) ?? null : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-3"
    >
      {/* LEFT: Eye visualization */}
      <div className="lg:col-span-3">
        <div className="bg-gradient-to-br from-[#020617] to-[#0f172a] rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <Eye className="w-3.5 h-3.5 text-orange-300" />
            <span className="text-[11px] font-black text-orange-200 uppercase tracking-wider">
              {isAs ? "মানৱ চকুৰ আভ্যন্তৰীণ গঠন" : "Human Eye — Cross-Section"}
            </span>
            <div className="ml-auto flex gap-1.5">
              <button
                onClick={() => setShowCutaway(c => !c)}
                className={`text-[10px] font-black px-2 py-1 rounded-lg ${showCutaway
                  ? "bg-orange-500/25 border border-orange-400 text-orange-100"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
              >
                {showCutaway
                  ? (isAs ? "অভ্যন্তৰীণ" : "Inside")
                  : (isAs ? "বহিৰাগত" : "Outside")}
              </button>
              <button
                onClick={() => setShowRays(r => !r)}
                className={`text-[10px] font-black px-2 py-1 rounded-lg ${showRays
                  ? "bg-yellow-500/25 border border-yellow-400 text-yellow-100"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
              >
                {showRays
                  ? (isAs ? "ৰে চালু" : "Rays On")
                  : (isAs ? "ৰে বন্ধ" : "Rays Off")}
              </button>
            </div>
          </div>
          <div className="aspect-[5/3] sm:aspect-[12/7]">
            <EyeSvg showCutaway={showCutaway} showRays={showRays} phase={phase}
                    lensThickness={lensThickness}
                    highlightId={highlightId}
                    onPartClick={(id) => setHighlightId(id)} />
          </div>
        </div>

        {/* Accommodation control */}
        <div className="mt-3 bg-slate-900/60 border border-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-[11px] font-black text-yellow-200 uppercase tracking-wider">
              {isAs ? "এডজেস্টমেণ্ট (লেন্স পুৰুত্ব)" : "Accommodation (Lens Thickness)"}
            </span>
          </div>
          <SimSlider label={isAs ? "বস্তুৰ দূৰত্ব (u)" : "Object Distance (u)"}
                     value={objectDistance} onChange={setObjectDistance}
                     min={10} max={500} step={5} unit=" cm" color="#f59e0b" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <SimNumber label={isAs ? "ফোকাচ দূৰত্ব f" : "Focal Length f"} value={f * 10} unit=" mm" color="#fde047" precision={1} />
            <SimNumber label={isAs ? "লেন্স পুৰুত্ব" : "Lens Thickness"} value={lensThickness} unit=" px" color="#fb923c" precision={0} />
            <div className="flex flex-col items-center justify-center p-2 bg-black/30 rounded-lg border border-white/10">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-wide">
                {isAs ? "চিলিয়াৰী" : "Ciliary"}
              </span>
              <span className="text-[10px] font-bold text-rose-300 text-center mt-0.5 leading-tight">{ciliaryState}</span>
            </div>
          </div>
        </div>

        {/* Equation card */}
        <div className="mt-3 bg-gradient-to-r from-indigo-900/40 to-fuchsia-900/40 border border-indigo-400/30 rounded-xl p-3 text-center">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-wider mb-1">
            {isAs ? "লেন্স সূত্ৰ" : "Lens Formula"}
          </p>
          <p className="text-base font-black text-white">
            <span className="text-fuchsia-300">1/v</span>
            <span className="text-gray-500"> − </span>
            <span className="text-orange-300">1/u</span>
            <span className="text-gray-500"> = </span>
            <span className="text-yellow-300">1/f</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            v = +22 mm · u = −{objectDistance} cm · f = {(f * 10).toFixed(1)} mm
          </p>
        </div>
      </div>

      {/* RIGHT: Info panel */}
      <div className="lg:col-span-2 flex flex-col gap-3">
        <div className="bg-slate-900/70 border border-white/10 rounded-xl p-3 min-h-[200px]">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: selected.color, boxShadow: `0 0 8px ${selected.color}` }} />
                  <h4 className="font-black text-sm text-white">
                    {isAs ? selected.as.name : selected.en.name}
                  </h4>
                </div>
                <p className="text-[11px] font-bold text-orange-300 mb-2">
                  {isAs ? selected.as.short : selected.en.short}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isAs ? selected.as.desc : selected.en.desc}
                </p>
                <button
                  onClick={() => setHighlightId(null)}
                  className="mt-3 text-[10px] font-black text-orange-300 hover:text-orange-200"
                >
                  ← {isAs ? "ঘূৰি যাওক" : "Back"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center"
              >
                <Info className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-300">
                  {isAs
                    ? "চকুৰ যিকোনো অংশৰ লেবেলত টিপি বিৱৰণ চাওক।"
                    : "Tap any labelled part of the eye to read about it."}
                </p>
                <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                  {isAs
                    ? "১১টা অংশ আছে: কৰ্নিয়া, আইৰিছ, তাৰা, লেন্স, চিলিয়াৰী, একুৱাছ, ভিট্ৰিয়াছ, ৰেটিনা, হালধীয়া দাগ, অন্ধ-স্থান, অপটিক স্নায়ু।"
                    : "11 parts: Cornea, Iris, Pupil, Lens, Ciliary, Aqueous, Vitreous, Retina, Yellow Spot, Blind Spot, Optic Nerve."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick reference */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] font-black text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            {isAs ? "মূল কথা" : "Key Facts"}
          </p>
          <ul className="text-[11px] text-gray-300 space-y-1.5 leading-relaxed">
            <li>• {isAs ? "মানৱ চকু এক জটিল প্ৰাকৃতিক কেমেৰা।" : "The human eye is a complex natural camera."}</li>
            <li>• {isAs ? "কৰ্নিয়াই অধিকাংশ আলোক প্ৰতিসৰণ কৰে।" : "The cornea does most of the light bending."}</li>
            <li>• {isAs ? "লেন্স পুৰুত্ব সলনি কৰি ওচৰ-দূৰ ফোকাচ কৰা হয় (এডজেস্টমেণ্ট)।" : "Lens thickness changes to focus on near/far objects (accommodation)."}</li>
            <li>• {isAs ? "ৰেটিনাত উলোটা প্ৰতিচ্ছবি গঠিত হয়; মস্তিষ্কই সোজা কৰে।" : "An inverted image forms on the retina; the brain flips it upright."}</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED — Patient view (split: normal vs defective vision)
// ═══════════════════════════════════════════════════════════════

function PatientView({ blurAmount, label1, label2 }: {
  blurAmount: number; label1: string; label2: string;
}) {
  return (
    <div className="bg-[#020617] rounded-xl border border-white/10 p-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-b from-sky-200 to-emerald-200">
          <SceneArt />
          <div className="absolute top-1 left-1 bg-emerald-500/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded">{label1}</div>
        </div>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-b from-sky-200 to-emerald-200"
             style={{ filter: `blur(${blurAmount}px)` }}>
          <SceneArt />
        </div>
        <div className="col-span-2 -mt-7 flex justify-end pr-2 pointer-events-none">
          <div className="bg-rose-500/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded relative z-10">{label2}</div>
        </div>
      </div>
    </div>
  );
}

function SceneArt() {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Sun */}
      <circle cx="30" cy="25" r="12" fill="#fbbf24" />
      <g stroke="#fbbf24" strokeWidth="1.5">
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r1 = 14, r2 = 19;
          const rad = (a * Math.PI) / 180;
          return <line key={a} x1={30 + Math.cos(rad) * r1} y1={25 + Math.sin(rad) * r1}
                       x2={30 + Math.cos(rad) * r2} y2={25 + Math.sin(rad) * r2} />;
        })}
      </g>
      {/* Mountain */}
      <polygon points="0,110 60,50 110,90 160,40 200,110" fill="#475569" />
      <polygon points="40,80 60,50 80,80" fill="#fff" />
      <polygon points="135,68 160,40 185,68" fill="#fff" />
      {/* Tree */}
      <rect x="68" y="98" width="6" height="22" fill="#78350f" />
      <circle cx="71" cy="92" r="14" fill="#16a34a" />
      <circle cx="80" cy="86" r="12" fill="#16a34a" />
      <circle cx="62" cy="86" r="12" fill="#16a34a" />
      {/* Ground */}
      <rect x="0" y="120" width="200" height="30" fill="#84cc16" />
      {/* House */}
      <rect x="130" y="100" width="30" height="20" fill="#fde68a" stroke="#92400e" />
      <polygon points="128,100 145,84 162,100" fill="#b91c1c" />
      <rect x="140" y="108" width="6" height="12" fill="#78350f" />
      {/* Text below */}
      <text x="100" y="142" fontSize="9" fontWeight="bold" fill="#1e293b" textAnchor="middle">📷 Scene</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 2 — MYOPIA (short-sightedness)
// ═══════════════════════════════════════════════════════════════

function MyopiaTab() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  // Myopia: eye is TOO LONG (or lens too powerful) → image forms BEFORE retina
  const [eyeLength, setEyeLength] = useState(28);   // mm — normal 24, myopic 26-30
  const [objectDistance, setObjectDistance] = useState(400);  // cm
  const [lensPower, setLensPower] = useState(62);    // dioptres — normal eye ~60
  const [applyCure, setApplyCure] = useState(false);
  const [showRays, setShowRays] = useState(true);
  const [phase, setPhase] = useState(0);

  useRafLoop(showRays, (dt) => setPhase(p => (p + dt) % 1000));

  // ── Optical model (intuitive linear approximation) ──────────────────────
  // Retina position: eye stretched longer → retina sits farther back.
  const rx = 200 + (eyeLength - 24) * 6.7;
  const retinaX = 300 + rx - 14;
  // How far in FRONT of the retina the focal point sits (myopia → positive).
  //   • stronger lens (higher power)   → focus shifts further forward
  //   • longer eyeball                 → focus shifts further forward
  //   • DISTANT object (large u)       → focus stays forward → blur
  //   • NEAR object (small u)          → image moves back toward retina → sharper
  const focalShift =
      (lensPower  - 60) * 4
    + (eyeLength  - 24) * 14
    + (objectDistance - 50) * 0.05;
  const baseFocalX = retinaX - focalShift;
  // ── Corrective lens (concave for myopia) ────────────────────────────────
  // Required power neutralises the forward shift. Concave lens → NEGATIVE dioptres.
  const cureP = -focalShift / 10;
  // With cure applied, the focal point lands exactly on the retina.
  const focalX = applyCure ? retinaX : baseFocalX;
  // Patient-view blur: small focus errors (~5 px) still look sharp; bigger errors blur.
  const blurFar = applyCure ? 0 : Math.min(9, Math.max(0, Math.abs(focalShift) - 5) * 0.18);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-3"
    >
      {/* Left: Eye + rays */}
      <div className="lg:col-span-3 space-y-3">
        <div className="bg-gradient-to-br from-[#020617] to-[#0f172a] rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <Glasses className="w-3.5 h-3.5 text-rose-300" />
            <span className="text-[11px] font-black text-rose-200 uppercase tracking-wider">
              {isAs ? "মায়োপিয়া (নিকটদৃষ্টি)" : "Myopia (Short-Sightedness)"}
            </span>
            <div className="ml-auto flex gap-1.5">
              <button onClick={() => setShowRays(r => !r)}
                      className={`text-[10px] font-black px-2 py-1 rounded-lg ${showRays
                        ? "bg-yellow-500/25 border border-yellow-400 text-yellow-100"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}>
                {showRays ? (isAs ? "ৰে চালু" : "Rays On") : (isAs ? "ৰে বন্ধ" : "Rays Off")}
              </button>
            </div>
          </div>
          <div className="aspect-[5/3] sm:aspect-[12/7]">
            <EyeSvg rx={rx} showRays={showRays} phase={phase} showCutaway={false}
                    focalX={focalX} correctiveLens={applyCure ? "concave" : null}
                    lensThickness={20} />
          </div>
        </div>

        {/* Patient view */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
            {isAs ? "ৰোগীৰ দৃষ্টি (দূৰৰ বস্তু)" : "Patient View (distant object)"}
          </p>
          <PatientView
            blurAmount={applyCure ? 0 : blurFar}
            label1={isAs ? "স্বাভাৱিক চকু" : "Normal Eye"}
            label2={applyCure
              ? (isAs ? "শোধনাৰ্থ লেন্সৰ পিছত" : "After Corrective Lens")
              : (isAs ? "মায়োপিক চকু" : "Myopic Eye")}
          />
        </div>
      </div>

      {/* Right: Controls + explanation */}
      <div className="lg:col-span-2 space-y-3">
        <div className="bg-slate-900/70 border border-white/10 rounded-xl p-3 space-y-2">
          <SimSlider label={isAs ? "বস্তুৰ দূৰত্ব" : "Object Distance"} value={objectDistance} onChange={setObjectDistance}
                     min={50} max={1000} step={10} unit=" cm" color="#38bdf8" />
          <SimSlider label={isAs ? "চকুৰ দৈৰ্ঘ্য" : "Eyeball Length"} value={eyeLength} onChange={setEyeLength}
                     min={24} max={30} step={0.2} unit=" mm" color="#f43f5e" />
          <SimSlider label={isAs ? "লেন্সৰ ক্ষমতা" : "Lens Power"} value={lensPower} onChange={setLensPower}
                     min={58} max={68} step={0.2} unit=" D" color="#a78bfa" />
        </div>

        {/* Cure */}
        <div className={`rounded-xl p-3 border transition-colors ${applyCure
            ? "bg-emerald-900/30 border-emerald-400/50"
            : "bg-rose-900/30 border-rose-400/40"}`}>
          <div className="flex items-center gap-2 mb-2">
            {applyCure ? <Sparkles className="w-4 h-4 text-emerald-300" />
                       : <Glasses className="w-4 h-4 text-rose-300" />}
            <span className={`text-[11px] font-black uppercase tracking-wider ${applyCure ? "text-emerald-200" : "text-rose-200"}`}>
              {applyCure
                ? (isAs ? "শোধনাৰ্থ লেন্স প্ৰয়োগ কৰা হ'ল" : "Corrective Lens Applied")
                : (isAs ? "শোধনৰ প্ৰয়োজন" : "Needs Correction")}
            </span>
          </div>
          <button
            onClick={() => setApplyCure(c => !c)}
            className={`w-full py-2 rounded-lg text-xs font-black text-white shadow-md transition ${applyCure
              ? "bg-gradient-to-r from-rose-500 to-rose-600 hover:opacity-90"
              : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90"}`}
          >
            {applyCure
              ? (isAs ? "শোধন আঁতৰাওক" : "Remove Lens")
              : (isAs ? "অৱতল লেন্স লগাওক" : "Apply Concave Lens")}
          </button>
          {applyCure && (
            <div className="mt-2 text-center">
              <p className="text-[10px] font-black text-emerald-200 uppercase tracking-wider mb-0.5">
                {isAs ? "প্ৰয়োজনীয় ক্ষমতা P = 1/f" : "Required Power P = 1/f"}
              </p>
              <p className="text-lg font-black text-emerald-100">
                {cureP.toFixed(2)} <span className="text-xs text-emerald-300">D</span>
              </p>
              <p className="text-[10px] text-emerald-300/70 mt-0.5">
                {isAs ? "(ঋণাত্মক → অৱতল লেন্স)" : "(negative → concave lens)"}
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] font-black text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            {isAs ? "ব্যাখ্যা" : "Explanation"}
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            {applyCure
              ? (isAs
                  ? "অৱতল লেন্সে প্ৰবেশ কৰা ৰেবোৰ অলপ বিকীৰ্ণ কৰি লেন্সৰ আগতে ফোকাচ পিছলৈ ঠেলি দিয়ে — যাতে চিত্ৰ ৰেটিনাত গঠিত হয়।"
                  : "The concave lens diverges incoming rays slightly, pushing the focal point back so the image now forms ON the retina.")
              : (isAs
                  ? "মায়োপিয়াত চকুৰ দৈৰ্ঘ্য বৃদ্ধি হয় বা লেন্সৰ ক্ষমতা বেছি হয় → দূৰৰ বস্তুৰ চিত্ৰ ৰেটিনাৰ আগতে গঠিত হয় → দূৰৰ বস্তু অস্পষ্ট দেখা যায়।"
                  : "In myopia, the eyeball is too long or the lens is too powerful → distant objects focus BEFORE the retina → distant objects appear blurred.")}
          </p>
        </div>

        {/* Live metrics */}
        <div className="grid grid-cols-2 gap-2">
          <SimNumber label={isAs ? "ফোকাচ অৱস্থান" : "Focal Pos"} value={focalX} unit=" px" color="#fb923c" precision={0} />
          <SimNumber label={isAs ? "ৰেটিনা অৱস্থান" : "Retina Pos"} value={retinaX} unit=" px" color="#fde047" precision={0} />
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 3 — HYPERMETROPIA (long-sightedness)
// ═══════════════════════════════════════════════════════════════

function HypermetropiaTab() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  // Hypermetropia: eye is TOO SHORT (or lens too weak) → image forms BEHIND retina
  const [eyeLength, setEyeLength] = useState(22);
  const [objectDistance, setObjectDistance] = useState(25);
  const [lensPower, setLensPower] = useState(58);
  const [applyCure, setApplyCure] = useState(false);
  const [showRays, setShowRays] = useState(true);
  const [phase, setPhase] = useState(0);

  useRafLoop(showRays, (dt) => setPhase(p => (p + dt) % 1000));

  // ── Optical model (intuitive linear approximation) ──────────────────────
  // Eye is SHORT (or lens too WEAK) → image forms BEHIND the retina, especially for near objects.
  const rx = 200 + (eyeLength - 24) * 6.7;
  const retinaX = 300 + rx - 14;
  // How far BEHIND the retina the focal point sits (hyperm → positive shift).
  //   • weaker lens (lower power)   → focus shifts further behind
  //   • shorter eyeball             → retina is forward → focus relatively further behind
  //   • NEAR object (small u)       → focus shifts further behind → blur
  //   • DISTANT object (large u)    → image relaxes toward retina → sharper
  const focalShift =
      (60 - lensPower)  * 4
    + (24 - eyeLength)  * 14
    + (50 - objectDistance) * 0.05;
  const baseFocalX = retinaX + focalShift;
  // ── Corrective lens (convex for hypermetropia) ──────────────────────────
  // Convex lens → POSITIVE dioptres.
  const cureP = focalShift / 10;
  const focalX = applyCure ? retinaX : baseFocalX;
  const blurNear = applyCure ? 0 : Math.min(9, Math.max(0, Math.abs(focalShift) - 5) * 0.18);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-3"
    >
      <div className="lg:col-span-3 space-y-3">
        <div className="bg-gradient-to-br from-[#020617] to-[#0f172a] rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <Glasses className="w-3.5 h-3.5 text-violet-300" />
            <span className="text-[11px] font-black text-violet-200 uppercase tracking-wider">
              {isAs ? "হাইপাৰমেট্ৰপিয়া (দূৰদৃষ্টি)" : "Hypermetropia (Long-Sightedness)"}
            </span>
            <div className="ml-auto flex gap-1.5">
              <button onClick={() => setShowRays(r => !r)}
                      className={`text-[10px] font-black px-2 py-1 rounded-lg ${showRays
                        ? "bg-yellow-500/25 border border-yellow-400 text-yellow-100"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}>
                {showRays ? (isAs ? "ৰে চালু" : "Rays On") : (isAs ? "ৰে বন্ধ" : "Rays Off")}
              </button>
            </div>
          </div>
          <div className="aspect-[5/3] sm:aspect-[12/7]">
            <EyeSvg rx={rx} showRays={showRays} phase={phase} showCutaway={false}
                    focalX={focalX} correctiveLens={applyCure ? "convex" : null}
                    lensThickness={20} />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
            {isAs ? "ৰোগীৰ দৃষ্টি (ওচৰৰ বস্তু)" : "Patient View (near object)"}
          </p>
          <PatientView
            blurAmount={applyCure ? 0 : blurNear}
            label1={isAs ? "স্বাভাৱিক চকু" : "Normal Eye"}
            label2={applyCure
              ? (isAs ? "শোধনাৰ্থ লেন্সৰ পিছত" : "After Corrective Lens")
              : (isAs ? "হাইপাৰমেট্ৰপিক চকু" : "Hypermetropic Eye")}
          />
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <div className="bg-slate-900/70 border border-white/10 rounded-xl p-3 space-y-2">
          <SimSlider label={isAs ? "ওচৰ বস্তুৰ দূৰত্ব" : "Near Object Distance"} value={objectDistance} onChange={setObjectDistance}
                     min={10} max={100} step={1} unit=" cm" color="#38bdf8" />
          <SimSlider label={isAs ? "চকুৰ দৈৰ্ঘ্য" : "Eyeball Length"} value={eyeLength} onChange={setEyeLength}
                     min={18} max={24} step={0.2} unit=" mm" color="#a78bfa" />
          <SimSlider label={isAs ? "লেন্সৰ ক্ষমতা" : "Lens Power"} value={lensPower} onChange={setLensPower}
                     min={52} max={60} step={0.2} unit=" D" color="#fb7185" />
        </div>

        <div className={`rounded-xl p-3 border transition-colors ${applyCure
            ? "bg-emerald-900/30 border-emerald-400/50"
            : "bg-violet-900/30 border-violet-400/40"}`}>
          <div className="flex items-center gap-2 mb-2">
            {applyCure ? <Sparkles className="w-4 h-4 text-emerald-300" />
                       : <Glasses className="w-4 h-4 text-violet-300" />}
            <span className={`text-[11px] font-black uppercase tracking-wider ${applyCure ? "text-emerald-200" : "text-violet-200"}`}>
              {applyCure
                ? (isAs ? "শোধনাৰ্থ লেন্স প্ৰয়োগ কৰা হ'ল" : "Corrective Lens Applied")
                : (isAs ? "শোধনৰ প্ৰয়োজন" : "Needs Correction")}
            </span>
          </div>
          <button
            onClick={() => setApplyCure(c => !c)}
            className={`w-full py-2 rounded-lg text-xs font-black text-white shadow-md transition ${applyCure
              ? "bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90"
              : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90"}`}
          >
            {applyCure
              ? (isAs ? "শোধন আঁতৰাওক" : "Remove Lens")
              : (isAs ? "উত্তল লেন্স লগাওক" : "Apply Convex Lens")}
          </button>
          {applyCure && (
            <div className="mt-2 text-center">
              <p className="text-[10px] font-black text-emerald-200 uppercase tracking-wider mb-0.5">
                {isAs ? "প্ৰয়োজনীয় ক্ষমতা P = 1/f" : "Required Power P = 1/f"}
              </p>
              <p className="text-lg font-black text-emerald-100">
                +{cureP.toFixed(2)} <span className="text-xs text-emerald-300">D</span>
              </p>
              <p className="text-[10px] text-emerald-300/70 mt-0.5">
                {isAs ? "(ধনাত্মক → উত্তল লেন্স)" : "(positive → convex lens)"}
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] font-black text-violet-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            {isAs ? "ব্যাখ্যা" : "Explanation"}
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            {applyCure
              ? (isAs
                  ? "উত্তল লেন্সে প্ৰবেশ কৰা ৰেবোৰ অলপ অভিসাৰিত কৰি লেন্সৰ পিছত ফোকাচ আগলৈ আনে — যাতে চিত্ৰ ৰেটিনাত গঠিত হয়।"
                  : "The convex lens converges incoming rays slightly, bringing the focal point forward so the image forms ON the retina.")
              : (isAs
                  ? "হাইপাৰমেট্ৰপিয়াত চকুৰ দৈৰ্ঘ্য কম হয় বা লেন্সৰ ক্ষমতা দুৰ্বল হয় → ওচৰৰ বস্তুৰ চিত্ৰ ৰেটিনাৰ পিছত গঠিত হয় → ওচৰৰ বস্তু অস্পষ্ট দেখা যায়।"
                  : "In hypermetropia, the eyeball is too short or the lens is too weak → near objects focus BEHIND the retina → near objects appear blurred.")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <SimNumber label={isAs ? "ফোকাচ অৱস্থান" : "Focal Pos"} value={focalX} unit=" px" color="#fb923c" precision={0} />
          <SimNumber label={isAs ? "ৰেটিনা অৱস্থান" : "Retina Pos"} value={retinaX} unit=" px" color="#fde047" precision={0} />
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════

interface QuizQ {
  q: { en: string; as: string };
  opts: { en: string; as: string }[];
  ans: number;
  expl: { en: string; as: string };
}

const QUIZ: QuizQ[] = [
  {
    q: { en: "Which lens corrects myopia?", as: "মায়োপিয়া কোন লেন্সে শোধন কৰে?" },
    opts: [
      { en: "Convex lens (+ve)", as: "উত্তল লেন্স (+ve)" },
      { en: "Concave lens (−ve)", as: "অৱতল লেন্স (−ve)" },
      { en: "Bifocal lens", as: "বাইফ'কাল লেন্স" },
      { en: "Cylindrical lens", as: "চিলিণ্ড্ৰিকেল লেন্স" },
    ], ans: 1,
    expl: { en: "A concave (diverging) lens pushes the focal point back onto the retina.",
            as: "অৱতল (বিকীৰ্ণকাৰী) লেন্সে ফোকাচ পিছলৈ ঠেলি ৰেটিনাত আনে।" },
  },
  {
    q: { en: "Where does the image form in a normal eye?", as: "স্বাভাৱিক চকুত প্ৰতিচ্ছবি ক'ত গঠিত হয়?" },
    opts: [
      { en: "On the cornea", as: "কৰ্নিয়াত" },
      { en: "On the iris", as: "আইৰিছত" },
      { en: "On the retina", as: "ৰেটিনাত" },
      { en: "In the vitreous humor", as: "ভিট্ৰিয়াছ হিউমাৰত" },
    ], ans: 2,
    expl: { en: "A real, inverted image always forms on the retina in a healthy eye.",
            as: "সুস্থ চকুত সদায় ৰেটিনাত এক প্ৰকৃত, উলোটা প্ৰতিচ্ছবি গঠিত হয়।" },
  },
  {
    q: { en: "What changes the lens thickness in the eye?", as: "চকুৰ লেন্সৰ পুৰুত্ব কিহে সলনি কৰে?" },
    opts: [
      { en: "Pupil", as: "তাৰা" },
      { en: "Cornea", as: "কৰ্নিয়া" },
      { en: "Ciliary muscles", as: "চিলিয়াৰী মাংসপেশী" },
      { en: "Optic nerve", as: "অপটিক স্নায়ু" },
    ], ans: 2,
    expl: { en: "Ciliary muscles contract for near vision (thick lens) and relax for distance vision (thin lens).",
            as: "চিলিয়াৰী মাংসপেশী ওচৰ দৃষ্টিৰ বাবে সঙ্কোচিত হয় (মোটা লেন্স) আৰু দূৰ দৃষ্টিৰ বাবে শিথিল হয় (পাতল লেন্স)।" },
  },
  {
    q: { en: "Hypermetropia is corrected by which lens?", as: "হাইপাৰমেট্ৰপিয়া কোন লেন্সে শোধন কৰে?" },
    opts: [
      { en: "Concave lens", as: "অৱতল লেন্স" },
      { en: "Convex lens", as: "উত্তল লেন্স" },
      { en: "Plano-concave", as: "প্লেনো-অৱতল" },
      { en: "No lens needed", as: "কোনো লেন্স লাগে নাই" },
    ], ans: 1,
    expl: { en: "A convex (converging) lens brings the focal point forward onto the retina.",
            as: "উত্তল (অভিসাৰী) লেন্সে ফোকাচ আগলৈ আনি ৰেটিনাত পৰিৱেশন কৰে।" },
  },
  {
    q: { en: "Which part has NO photoreceptors?", as: "কোনটো অংশত কোনো ফট'ৰিচেপ্টৰ নাই?" },
    opts: [
      { en: "Yellow spot", as: "হালধীয়া দাগ" },
      { en: "Blind spot", as: "অন্ধ-স্থান" },
      { en: "Macula", as: "মেকুলা" },
      { en: "Fovea", as: "ফ'ভিয়া" },
    ], ans: 1,
    expl: { en: "The blind spot is where the optic nerve exits — no rods or cones present.",
            as: "অপটিক স্নায়ু ওলোৱা স্থানেই অন্ধ-স্থান — ইয়াত ৰড বা কোন নাই।" },
  },
];

function QuizPanel() {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = QUIZ[i];

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.ans) setScore(s => s + 1);
  };

  const next = () => {
    if (i < QUIZ.length - 1) { setI(i + 1); setPicked(null); }
    else { setI(0); setPicked(null); setScore(0); }
  };

  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-xl p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" />
          {isAs ? "কুইজ" : "Quick Quiz"}
        </p>
        <span className="text-[10px] font-black text-gray-400">
          {isAs ? `প্ৰশ্ন ${i + 1}/${QUIZ.length}` : `Q ${i + 1}/${QUIZ.length}`} · {isAs ? "স্ক'ৰ" : "Score"}: {score}
        </span>
      </div>
      <p className="text-sm font-black text-white mb-3 leading-snug">
        {isAs ? q.q.as : q.q.en}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.opts.map((o, idx) => {
          const isCorrect = picked !== null && idx === q.ans;
          const isWrong = picked === idx && idx !== q.ans;
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={picked !== null}
              className={`text-left p-2 rounded-lg text-xs font-bold transition-all border ${
                isCorrect ? "bg-emerald-500/25 border-emerald-400 text-emerald-100"
                : isWrong ? "bg-rose-500/25 border-rose-400 text-rose-100"
                : picked !== null ? "bg-white/5 border-white/10 text-gray-500"
                : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
              }`}
            >
              {isAs ? o.as : o.en}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-3 p-2 bg-slate-950/60 rounded-lg border border-white/10">
          <p className="text-[11px] text-gray-300 leading-relaxed">
            <span className="text-emerald-300 font-black">{isAs ? "ব্যাখ্যা: " : "Explanation: "}</span>
            {isAs ? q.expl.as : q.expl.en}
          </p>
          <button onClick={next} className="mt-2 text-[10px] font-black text-orange-300 hover:text-orange-200">
            {i < QUIZ.length - 1 ? (isAs ? "পৰৱৰ্তী →" : "Next →") : (isAs ? "পুনৰাৰম্ভ ↻" : "Restart ↻")}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT — exported to sim registry as "human-eye"
// ═══════════════════════════════════════════════════════════════

export function HumanEyeLab() {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [tab, setTab] = useState<EyeTab>("explorer");

  const tabs: { id: EyeTab; en: string; as: string; emoji: string }[] = [
    { id: "explorer",        en: "Eye Explorer",   as: "চকুৰ অন্বেষণ",      emoji: "👁️" },
    { id: "myopia",          en: "Myopia",         as: "নিকটদৃষ্টি",         emoji: "👓" },
    { id: "hypermetropia",   en: "Hypermetropia",  as: "দূৰদৃষ্টি",          emoji: "🔍" },
  ];

  return (
    <SimContainer
      hint={isAs
        ? "মানৱ চকুৰ গঠন, এডজেস্টমেণ্ট আৰু সাধাৰণ দৃষ্টি ত্ৰুটিৰ লগতে তাৰ শোধন বিচাৰি লওক।"
        : "Explore the structure of the human eye, accommodation, and the two main defects with their corrections."}
    >
      {/* Tab bar */}
      <div className="grid grid-cols-3 gap-1.5 mb-3 bg-black/30 p-1 rounded-xl">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-black transition-all ${
              tab === t.id
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <span>{t.emoji}</span>
            <span className="hidden sm:inline">{isAs ? t.as : t.en}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "explorer"      && <ExplorerTab      key="explorer" />}
        {tab === "myopia"        && <MyopiaTab        key="myopia" />}
        {tab === "hypermetropia" && <HypermetropiaTab key="hypermetropia" />}
      </AnimatePresence>

      {/* Quiz — always visible at bottom */}
      <QuizPanel />
    </SimContainer>
  );
}
