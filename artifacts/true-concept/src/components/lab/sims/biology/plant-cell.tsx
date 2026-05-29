import React, { useRef, useState } from 'react';
import { Microscope, Info, CheckCircle2, Zap, Check, Leaf, Activity, X } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { PLANT_ORGANELLES as ORGANELLES, PLANT_QUIZ_DATA, OrganelleDef } from './plant-cell-data';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStructureNameKey } from '@/i18n/biologyTranslations';
import LanguageToggle from '@/components/LanguageToggle';
import { pick as pickLang } from '@/lib/i18n';
import { useLabTracker } from '@/lib/analytics/lab-tracking-context';

export function PlantCellModule() {
  const [view, setView] = useState<'DASH' | 'CELL' | 'QUIZ'>('DASH');
  if (view === 'DASH') return <Dashboard onStart={() => setView('CELL')} />;
  if (view === 'QUIZ') return <Quiz onFinish={() => setView('DASH')} />;
  return <CellExplorer onBack={() => setView('DASH')} onQuiz={() => setView('QUIZ')} />;
}

function CellExplorer({ onBack, onQuiz }: { onBack: () => void; onQuiz: () => void }) {
  const { t, lang } = useLanguage();
  const { recordInteraction } = useLabTracker();
  const [selected, setSelected] = useState<OrganelleDef | null>(null);
  const handleSelect = (o: OrganelleDef) => { setSelected(o); recordInteraction(o.id); };
  return (
    <div className="w-full bg-[#03080a] text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans flex flex-col" style={{ minHeight: '75vh' }}>
      <div className="bg-[#071210] border-b border-slate-800/60 px-3 py-2.5 md:px-4 md:py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-950/80 border border-green-800/60 rounded-lg text-green-400">
            <Leaf className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{t("module.plantCell")}</h2>
            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t("ui.clickOrganelle")} · Scroll to zoom</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <LanguageToggle />
          <button onClick={onQuiz} className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-[10px] md:text-xs font-bold transition-all">{t("ui.quiz")}</button>
          <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] md:text-xs font-bold border border-slate-700 transition-all">← {t("ui.back")}</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ background: 'radial-gradient(ellipse at 48% 46%, #071a0e 0%, #03080a 65%)' }}
        >
          <TransformWrapper initialScale={0.95} minScale={0.3} maxScale={6} centerOnInit>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <PlantCellSVG selected={selected} onSelect={handleSelect} />
            </TransformComponent>
          </TransformWrapper>
        </div>

        <div className="w-full md:w-[340px] lg:w-[380px] bg-[#071210]/90 border-t md:border-t-0 md:border-l border-slate-800/60 overflow-y-auto shrink-0">
          {selected ? (
            <div className="p-4 md:p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="w-3 h-3 rounded-full mb-2" style={{ background: selected.color }} />
                  <h2 className="text-lg md:text-xl font-black text-white leading-tight">{(() => { const k = getStructureNameKey(selected.id); const tr = t(k); return tr !== k ? tr : pickLang(selected.name, lang); })()}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: selected.color }}>{pickLang(selected.analogy, lang)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center shrink-0 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                <InfoSection icon={<Info className="w-3 h-3" />} label={t("panel.structure")} color="text-slate-400" bg="bg-slate-900/60 border border-slate-800/50">{pickLang(selected.description, lang)}</InfoSection>
                <InfoSection icon={<Activity className="w-3 h-3" />} label={t("panel.function")} color="text-green-400" bg="bg-green-950/30 border border-green-900/40">{pickLang(selected.function, lang)}</InfoSection>
                <InfoSection icon={<CheckCircle2 className="w-3 h-3" />} label={t("panel.examNotes")} color="text-teal-400" bg="bg-teal-950/30 border border-teal-900/40">{pickLang(selected.examNotes, lang)}</InfoSection>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-400 text-sm font-semibold">Click any organelle to learn</p>
              <p className="text-slate-600 text-xs">14 interactive components</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoSection({ icon, label, color, bg, children }: { icon: React.ReactNode; label: string; color: string; bg: string; children: string }) {
  return (
    <div>
      <div className={`text-[10px] uppercase font-bold mb-1.5 flex items-center gap-1.5 ${color}`}>{icon}{label}</div>
      <p className={`text-[11px] md:text-xs text-slate-300 leading-relaxed p-3 rounded-xl ${bg}`}>{children}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  PLANT CELL SVG — hexagonal, scientifically accurate
// ─────────────────────────────────────────────────────────────────
function PlantCellSVG({ selected, onSelect }: { selected: OrganelleDef | null; onSelect: (o: OrganelleDef) => void }) {
  const { t } = useLanguage();
  const O = ORGANELLES;
  const active = (id: string) => selected?.id === id;

  const hit = (id: string, color: string) => ({
    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onSelect(O[id]); },
    style: {
      cursor: 'pointer' as const,
      filter: active(id) ? `drop-shadow(0 0 10px ${color}bb) drop-shadow(0 0 3px ${color})` : undefined,
      opacity: selected && !active(id) ? 0.72 : 1,
      transition: 'opacity 0.25s, filter 0.25s',
    },
  });

  // ── Hexagonal geometry (flat-top, centered at 490,325) ──
  // Outer cell wall
  const WALL  = 'M 268,56 L 712,56 L 800,325 L 712,594 L 268,594 L 180,325 Z';
  // Inner cytoplasm / cell membrane boundary
  const INNER = 'M 286,76 L 694,76 L 780,325 L 694,574 L 286,574 L 200,325 Z';

  // Plasmodesmata arrow-tabs at each vertex (channels to neighbouring cells)
  const TABS = [
    'M 268,56  L 240,16  L 280,16  L 268,56',   // top-left
    'M 712,56  L 702,16  L 742,16  L 712,56',   // top-right
    'M 800,325 L 850,303 L 850,347 L 800,325',  // right
    'M 712,594 L 742,634 L 702,634 L 712,594',  // bottom-right
    'M 268,594 L 280,634 L 240,634 L 268,594',  // bottom-left
    'M 180,325 L 130,347 L 130,303 L 180,325',  // left
  ].join(' ');

  // Large central vacuole (right portion, ~70% of interior)
  const VAC  = 'M 356,135 C 462,106 706,114 762,218 C 802,294 800,386 756,464 C 704,546 462,556 356,528 C 272,508 274,448 272,348 C 270,254 262,163 356,135 Z';
  // Tonoplast (inner vacuole membrane, slightly inset)
  const TONO = 'M 362,144 C 467,116 700,123 755,225 C 793,299 791,387 748,463 C 697,542 466,549 362,523 C 280,504 282,448 280,350 C 278,257 269,170 362,144 Z';

  // Nuclear pores on nucleus ellipse cx=248, cy=308, rx=50, ry=48
  const nucPores = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI * 2) / 6 + 0.5;
    return { x: 248 + 50 * Math.cos(a), y: 308 + 48 * Math.sin(a) };
  });

  return (
    <svg
      viewBox="0 0 1000 660"
      className="w-full max-w-[960px] h-auto select-none"
      style={{ maxHeight: '580px' }}
    >
      <defs>
        <radialGradient id="pc2_cyto" cx="25%" cy="50%">
          <stop offset="0%"   stopColor="#bbf7d0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#86efac" stopOpacity="0.10" />
        </radialGradient>
        <radialGradient id="pc2_vac" cx="42%" cy="35%">
          <stop offset="0%"   stopColor="#e0f2fe" stopOpacity="0.65" />
          <stop offset="80%"  stopColor="#bae6fd" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.46" />
        </radialGradient>
        <radialGradient id="pc2_nuc" cx="32%" cy="28%">
          <stop offset="0%"   stopColor="#fed7aa" />
          <stop offset="80%"  stopColor="#fdba74" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>
        <radialGradient id="pc2_nucl" cx="38%" cy="32%">
          <stop offset="0%"   stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
        <radialGradient id="pc2_mito" cx="28%" cy="22%">
          <stop offset="0%"   stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <radialGradient id="pc2_amylo" cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#9333ea" />
        </radialGradient>
        <radialGradient id="pc2_perox" cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#fefce8" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        <linearGradient id="pc2_chloro" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <clipPath id="pc2_wallclip">
          <path d={WALL} />
        </clipPath>
      </defs>

      {/* ── CELL WALL ──────────────────────────────────────── */}
      <g {...hit('cellWall', '#4ade80')}>
        {/* Primary cell wall — thick green hexagon */}
        <path d={WALL} fill="#14532d" stroke="#052e16" strokeWidth="3" />
        {/* Secondary wall texture */}
        <path d={WALL} fill="none" stroke="#166534" strokeWidth="5" strokeDasharray="10 6" opacity="0.35" />
        {/* Plasmodesmata arrow-tabs at vertices */}
        <path d={TABS} fill="#16a34a" stroke="#052e16" strokeWidth="2" strokeLinejoin="round" />
        {/* Small channel circles on wall edges (plasmodesmata pores) */}
        {[
          [355,56],[440,56],[535,56],[625,56],           // top
          [355,594],[440,594],[535,594],[625,594],        // bottom
          [207,384],[193,296],                            // left side
          [773,384],[787,266],                            // right side
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#6ee7b7" opacity="0.75" />
        ))}
      </g>

      {/* ── CYTOPLASM ──────────────────────────────────────── */}
      <g {...hit('cytoplasm', '#86efac')}>
        <path d={INNER} fill="url(#pc2_cyto)" />
      </g>

      {/* ── CELL MEMBRANE ──────────────────────────────────── */}
      <g {...hit('membrane', '#4ade80')} onClick={(e) => { e.stopPropagation(); onSelect(O.membrane); }}>
        <path d={INNER} fill="none" stroke="#22c55e" strokeWidth={active('membrane') ? 5 : 3.5} opacity="0.85" />
        <path d={INNER} fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="0" opacity="0.35" />
      </g>

      {/* ── CENTRAL VACUOLE ────────────────────────────────── */}
      <g {...hit('vacuole', '#38bdf8')}>
        <path d={VAC}  fill="url(#pc2_vac)" stroke="#0284c7" strokeWidth="2.5" />
        <path d={TONO} fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="5 3.5" opacity="0.5" />
        <text x="558" y="328" fill="#7dd3fc" fontSize="11" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="600" opacity="0.55">Cell Sap</text>
        <text x="558" y="346" fill="#7dd3fc" fontSize="9"  textAnchor="middle" fontFamily="system-ui,sans-serif" opacity="0.35">(water · sugars · pigments · waste)</text>
      </g>

      {/* ── ROUGH ER (around nucleus, clearly right of it) ──── */}
      <g {...hit('roughER', '#a855f7')}>
        {[0, 13, 26].map((off, ci) => (
          <g key={ci}>
            <path
              d={`M ${298 + off},265 C ${315 + off},238 ${348 + off},228 ${370 + off},242 C ${390 + off},255 ${392 + off},285 ${380 + off},305`}
              fill="none" stroke="#7e22ce" strokeWidth="12" strokeLinecap="round"
            />
            <path
              d={`M ${298 + off},265 C ${315 + off},238 ${348 + off},228 ${370 + off},242 C ${390 + off},255 ${392 + off},285 ${380 + off},305`}
              fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" opacity="0.5"
            />
          </g>
        ))}
        {/* Ribosome dots on RER outer surface */}
        {[[300,268],[305,255],[314,244],[326,236],[340,231],[355,228],[370,228],[384,234],[393,244],[397,258],[397,272],[394,287],[388,300]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2.4" fill="#1e1035" stroke="#4c1d95" strokeWidth="0.5"/>
        ))}
      </g>

      {/* ── MITOCHONDRIA (above and below nucleus, clear separation) */}
      <g {...hit('mitochondria', '#f97316')}>
        {/* Mito 1 — above nucleus (nucleus top ≈ y=260, mito center y=200) */}
        <g transform="translate(250, 200) rotate(20)">
          <ellipse cx="0" cy="0" rx="30" ry="13" fill="url(#pc2_mito)" stroke="#9a3412" strokeWidth="2" />
          {[-12, 0, 12].map((x, i) => (
            <path key={i} d={`M ${x},-7 C ${x-3},0 ${x+3},0 ${x},7`} fill="none" stroke="#fed7aa" strokeWidth="1.5" opacity="0.6" />
          ))}
          <ellipse cx="0" cy="0" rx="30" ry="13" fill="none" stroke="#9a3412" strokeWidth="2" />
        </g>
        {/* Mito 2 — well below Golgi (Golgi center y=478, bottom ≈ y=514, mito starts y=532) */}
        <g transform="translate(255, 538) rotate(-18)">
          <ellipse cx="0" cy="0" rx="28" ry="12" fill="url(#pc2_mito)" stroke="#9a3412" strokeWidth="2" />
          {[-10, 0, 10].map((x, i) => (
            <path key={i} d={`M ${x},-7 C ${x-3},0 ${x+3},0 ${x},7`} fill="none" stroke="#fed7aa" strokeWidth="1.5" opacity="0.6" />
          ))}
          <ellipse cx="0" cy="0" rx="28" ry="12" fill="none" stroke="#9a3412" strokeWidth="2" />
        </g>
      </g>

      {/* ── CHLOROPLASTS ────────────────────────────────────── */}
      <g {...hit('chloroplast', '#22c55e')}>
        {/* Top cytoplasm strip */}
        {[308, 425, 548, 665].map((cx, i) => (
          <Chloroplast key={`t${i}`} cx={cx} cy={100} rx={26} ry={13} angle={i % 2 === 0 ? 6 : -6} />
        ))}
        {/* Bottom cytoplasm strip */}
        {[308, 425, 548, 665].map((cx, i) => (
          <Chloroplast key={`b${i}`} cx={cx} cy={550} rx={26} ry={13} angle={i % 2 === 0 ? -6 : 8} />
        ))}
        {/* Left cytoplasm strip */}
        <Chloroplast cx={280} cy={172} rx={25} ry={12} angle={14} />
        <Chloroplast cx={228} cy={325} rx={22} ry={10} angle={0}  />
        <Chloroplast cx={278} cy={472} rx={24} ry={11} angle={-14} />
      </g>

      {/* ── NUCLEUS (rendered after vacuole → appears on top) ── */}
      <g {...hit('nucleus', '#f97316')}>
        {/* Outer nuclear membrane */}
        <ellipse cx="248" cy="308" rx="50" ry="48" fill="url(#pc2_nuc)" stroke="#c2410c" strokeWidth="3" />
        {/* Nuclear pores */}
        {nucPores.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#9a3412" stroke="#fed7aa" strokeWidth="1.2" />
        ))}
        {/* Inner membrane */}
        <ellipse cx="248" cy="308" rx="43" ry="41" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
      </g>

      {/* ── CHROMATIN ──────────────────────────────────────── */}
      <g {...hit('chromatin', '#d8b4fe')} onClick={(e) => { e.stopPropagation(); onSelect(O.chromatin); }}>
        {[
          ['M 213,305 Q 228,289 243,305 Q 258,321 273,305', '#ea580c'],
          ['M 213,305 Q 228,321 243,305 Q 258,289 273,305', '#c2410c'],
          ['M 220,323 Q 234,308 248,323 Q 262,338 276,323', '#d97706'],
          ['M 220,323 Q 234,338 248,323 Q 262,308 276,323', '#b45309'],
          ['M 218,288 Q 232,272 246,288 Q 260,304 274,288', '#c2410c'],
          ['M 218,288 Q 232,304 246,288 Q 260,272 274,288', '#ea580c'],
        ].map(([d, s], i) => (
          <path key={i} d={d as string} fill="none" stroke={s as string} strokeWidth="1.8" opacity="0.55" />
        ))}
      </g>

      {/* ── NUCLEOLUS ──────────────────────────────────────── */}
      <g {...hit('nucleolus', '#ea580c')} onClick={(e) => { e.stopPropagation(); onSelect(O.nucleolus); }}>
        <ellipse cx="246" cy="293" rx="18" ry="15" fill="url(#pc2_nucl)" stroke="#c2410c" strokeWidth="2" />
        <ellipse cx="244" cy="291" rx="10" ry="8"  fill="#ffedd5" opacity="0.35" />
      </g>

      {/* ── SMOOTH ER (tubular network, no ribosomes) ──────── */}
      {/* Placed between rough ER / nucleus region and the Golgi */}
      <g {...hit('smoothER', '#22d3ee')}>
        {/* Tubular loop 1 */}
        <path d="M 326,388 C 338,366 374,364 382,388 C 390,412 356,418 330,404" fill="none" stroke="#0e7490" strokeWidth="9"  strokeLinecap="round" />
        <path d="M 326,388 C 338,366 374,364 382,388 C 390,412 356,418 330,404" fill="none" stroke="#22d3ee" strokeWidth="3"  strokeLinecap="round" opacity="0.75" />
        {/* Tubular loop 2 */}
        <path d="M 382,388 C 394,366 422,368 428,388 C 434,408 420,418 400,410" fill="none" stroke="#0e7490" strokeWidth="9"  strokeLinecap="round" />
        <path d="M 382,388 C 394,366 422,368 428,388 C 434,408 420,418 400,410" fill="none" stroke="#22d3ee" strokeWidth="3"  strokeLinecap="round" opacity="0.75" />
        {/* Branch */}
        <path d="M 360,368 C 360,352 386,348 390,362" fill="none" stroke="#0e7490" strokeWidth="8"  strokeLinecap="round" />
        <path d="M 360,368 C 360,352 386,348 390,362" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* ── GOLGI / DICTYOSOME ─────────────────────────────── */}
      {/* Rendered AFTER nucleus so it appears on top when they're near each other */}
      {/* Center at y=478 → clearly 120px below nucleus bottom (y=356) */}
      <g {...hit('golgi', '#3b82f6')}>
        <g transform="translate(255, 478)">
          {[
            { w: 52, y: 0,  stroke: '#bfdbfe', lw: 9   },
            { w: 46, y: 12, stroke: '#93c5fd', lw: 8.5 },
            { w: 40, y: 24, stroke: '#60a5fa', lw: 8   },
            { w: 34, y: 36, stroke: '#3b82f6', lw: 7.5 },
          ].map(({ w, y, stroke, lw }, i) => (
            <g key={i}>
              <path d={`M ${-w},${y} Q 0,${y-13} ${w},${y}`} fill="none" stroke="#1e3a8a" strokeWidth={lw+2} strokeLinecap="round" />
              <path d={`M ${-w},${y} Q 0,${y-13} ${w},${y}`} fill="none" stroke={stroke}   strokeWidth={lw}   strokeLinecap="round" />
            </g>
          ))}
          {/* Trans face vesicles */}
          <circle cx="60"  cy="38"  r="7" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1.5" />
          <circle cx="72"  cy="28"  r="5" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1.5" />
          <circle cx="-60" cy="36"  r="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          {/* Cis face vesicle */}
          <circle cx="0"  cy="-18"  r="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
        </g>
      </g>

      {/* ── AMYLOPLASTS (bottom cytoplasm) ─────────────────── */}
      <g {...hit('amyloplast', '#9333ea')}>
        {[[415, 570], [548, 572], [680, 568]].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            <ellipse cx="0" cy="0" rx="20" ry="15" fill="url(#pc2_amylo)" stroke="#7e22ce" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="12" ry="9"  fill="#e9d5ff" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="6"  ry="4"  fill="#f3e8ff" opacity="0.4" />
          </g>
        ))}
      </g>

      {/* ── PEROXISOMES ────────────────────────────────────── */}
      <g {...hit('peroxisome', '#ca8a04')}>
        {[[370, 100], [618, 102], [285, 468]].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            <circle cx="0" cy="0" r="10" fill="url(#pc2_perox)" stroke="#92400e" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4"  fill="#a16207" opacity="0.5" />
            <circle cx="-2" cy="-2" r="2.5" fill="#fef9c3" opacity="0.4" />
          </g>
        ))}
      </g>

      {/* ── FREE RIBOSOMES ─────────────────────────────────── */}
      <g {...hit('ribosome', '#475569')}>
        {[
          [215,152],[232,144],[204,165],
          [215,508],[232,500],[205,520],
          [295,100],[316,96],[334,98],
          [295,558],[316,562],[335,556],
          [470,98],[488,102],[505,96],
          [470,558],[488,554],[506,562],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            <ellipse cx="0" cy="0"   rx="3"   ry="2.2" fill="#334155" stroke="#475569" strokeWidth="0.5" />
            <ellipse cx="0" cy="3.5" rx="2.2" ry="1.8" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
          </g>
        ))}
      </g>

      {/* ── ANATOMY LABELS ─────────────────────────────────── */}
      {/* LEFT LABELS — lx=110, text-anchor="end" — all text goes rightward from x=110 */}
      {/* Using text-anchor="start" at x=112 so text is always inside the 1000-wide viewBox */}
      <g style={{ pointerEvents: 'none' }}>
        {/* Left-side labels — 9 items, 50 px spacing */}
        <PLabel ox={260} oy={190} lx={112} ly={112} text={t("struct.mitochondria")}    active={active('mitochondria')} color="#f97316" />
        <PLabel ox={298} oy={265} lx={112} ly={162} text={t("struct.roughER")}          active={active('roughER')}      color="#a78bfa" />
        <PLabel ox={360} oy={375} lx={112} ly={212} text={t("struct.smoothER")}         active={active('smoothER')}     color="#22d3ee" />
        <PLabel ox={218} oy={270} lx={112} ly={262} text={t("struct.cellWall")}         active={active('cellWall')}     color="#4ade80" />
        <PLabel ox={204} oy={312} lx={112} ly={312} text={t("struct.cellMembrane")}     active={active('membrane')}     color="#22c55e" />
        <PLabel ox={200} oy={340} lx={112} ly={362} text={t("struct.nucleus")}          active={active('nucleus')}      color="#fb923c" />
        <PLabel ox={230} oy={293} lx={112} ly={412} text={t("struct.nucleolus")}        active={active('nucleolus')}    color="#ea580c" />
        <PLabel ox={235} oy={300} lx={112} ly={462} text={t("struct.chromatin")}        active={active('chromatin')}    color="#c084fc" />
        <PLabel ox={208} oy={478} lx={112} ly={512} text={t("struct.golgiDictyosome")} active={active('golgi')}        color="#60a5fa" />

        {/* Right-side labels */}
        <PLabel ox={268} oy={56}  lx={888} ly={112} text={t("struct.plasmodesmata")}   active={active('cellWall')}     color="#6ee7b7" right />
        <PLabel ox={308} oy={100} lx={888} ly={174} text={t("struct.chloroplast")}     active={active('chloroplast')}  color="#22c55e" right />
        <PLabel ox={558} oy={330} lx={888} ly={248} text={t("struct.centralVacuole")} active={active('vacuole')}      color="#38bdf8" right />
        <PLabel ox={756} oy={330} lx={888} ly={318} text={t("struct.tonoplast")}       active={active('vacuole')}      color="#0ea5e9" right />
        <PLabel ox={370} oy={100} lx={888} ly={392} text={t("struct.peroxisome")}      active={active('peroxisome')}   color="#facc15" right />
        <PLabel ox={415} oy={560} lx={888} ly={462} text={t("struct.amyloplast")}      active={active('amyloplast')}   color="#c084fc" right />
        <PLabel ox={295} oy={100} lx={888} ly={526} text={t("struct.ribosome")}        active={active('ribosome')}     color="#64748b" right />
        <PLabel ox={680} oy={450} lx={888} ly={590} text={t("struct.cytoplasm")}       active={active('cytoplasm')}    color="#86efac" right />
      </g>
    </svg>
  );
}

// ── Chloroplast helper ─────────────────────────────────────────
function Chloroplast({ cx, cy, rx, ry, angle }: { cx: number; cy: number; rx: number; ry: number; angle: number }) {
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      {/* Outer double membrane */}
      <ellipse cx="0" cy="0" rx={rx}     ry={ry}     fill="#14532d" stroke="#052e16" strokeWidth="1.5" />
      <ellipse cx="0" cy="0" rx={rx - 3} ry={ry - 3} fill="#15803d" />
      {/* Thylakoid grana — 3 columns of stacked discs */}
      {[-rx * 0.38, 0, rx * 0.38].map((gx, gi) => (
        <g key={gi} transform={`translate(${gx},0)`}>
          {[-ry * 0.4, -ry * 0.13, ry * 0.13, ry * 0.4].map((gy, ti) => (
            <ellipse key={ti} cx="0" cy={gy} rx={rx * 0.21} ry={ry * 0.18}
              fill="#166534" stroke="#4ade80" strokeWidth="0.7" opacity="0.9" />
          ))}
        </g>
      ))}
      {/* Outer rim */}
      <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="none" stroke="#4ade80" strokeWidth="1.2" opacity="0.55" />
    </g>
  );
}

// ── Label with L-shaped connector ─────────────────────────────
function PLabel({ ox, oy, lx, ly, text, active, color, right = false }: {
  ox: number; oy: number; lx: number; ly: number;
  text: string; active: boolean; color: string; right?: boolean;
}) {
  const c = active ? color : '#4b5563';
  return (
    <g>
      <circle cx={ox} cy={oy} r="2.6" fill={c} opacity={active ? 0.95 : 0.5} />
      <polyline
        points={`${ox},${oy} ${ox},${ly} ${lx},${ly}`}
        fill="none" stroke={c} strokeWidth="0.85"
        opacity={active ? 0.72 : 0.32}
        strokeDasharray={active ? '0' : '3 2'}
      />
      <text
        x={right ? lx + 4 : lx - 4}
        y={ly + 1}
        fill={c}
        fontSize={active ? '10' : '9.5'}
        fontWeight={active ? '700' : '500'}
        textAnchor={right ? 'start' : 'end'}
        dominantBaseline="middle"
        fontFamily="system-ui,-apple-system,sans-serif"
        letterSpacing="0.2"
      >
        {text}
      </text>
    </g>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────
function Dashboard({ onStart }: { onStart: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="w-full min-h-[50vh] bg-[#03080a] text-slate-100 font-sans rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 45% 50%, rgba(34,197,94,0.08) 0%, transparent 65%)' }} />
      <div className="relative z-10 max-w-xl w-full p-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border-2 border-green-600/40 text-green-400 mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <Leaf className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">{t("dash.plantCell.title")}</h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8">
          {t("dash.plantCell.desc")}
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_24px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
        >
          <Microscope className="w-5 h-5" /> {t("ui.explorePlant")}
        </button>
        <div className="mt-6 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-green-500" /> 14 Organelles</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> NCERT Aligned</span>
        </div>
      </div>
    </div>
  );
}

// ── QUIZ ────────────────────────────────────────────────────────
function Quiz({ onFinish }: { onFinish: () => void }) {
  const { t, lang } = useLanguage();
  const { recordQuizResult } = useLabTracker();
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [st, setSt] = useState<'IDLE' | 'OK' | 'NO'>('IDLE');
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const q = PLANT_QUIZ_DATA[qi];
  const qText = pickLang(q.q, lang);
  const qOpts = pickLang(q.opts, lang);

  const choose = (i: number) => {
    if (st !== 'IDLE') return;
    setSel(i);
    if (i === q.ans) {
      correctRef.current++;
      setSt('OK');
      setTimeout(() => {
        if (qi < PLANT_QUIZ_DATA.length - 1) { setQi(p => p + 1); setSel(null); setSt('IDLE'); }
        else {
          const total = correctRef.current + wrongRef.current;
          const score = total > 0 ? Math.round((correctRef.current / total) * 100) : 100;
          recordQuizResult({ score, totalCorrect: correctRef.current, totalAttempted: total });
          onFinish();
        }
      }, 1500);
    } else { wrongRef.current++; setSt('NO'); }
  };

  return (
    <div className="w-full bg-[#03080a] text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl relative overflow-hidden p-4 min-h-[500px]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 70%)' }} />
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="max-w-xl w-full z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-green-400 font-black uppercase text-xs tracking-widest"><Zap className="w-4 h-4" /> {t("quiz.title.plantCell")}</div>
          <div className="text-xs font-bold text-slate-500">{t("quiz.questionPrefix")}{qi + 1}/{PLANT_QUIZ_DATA.length}</div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mb-6">
          <div className="bg-green-500 h-1 rounded-full transition-all duration-500" style={{ width: `${(qi / PLANT_QUIZ_DATA.length) * 100}%` }} />
        </div>
        <h2 className="text-base md:text-lg font-black mb-5 leading-snug">{qText}</h2>
        <div className="flex flex-col gap-2.5">
          {qOpts.map((o, i) => {
            let c = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-green-500/40 hover:bg-slate-900';
            if (st !== 'IDLE' && i === q.ans) c = 'bg-green-950/60 border-green-500 text-green-300';
            else if (st !== 'IDLE' && sel === i) c = 'bg-rose-950/60 border-rose-500 text-rose-300';
            return (
              <button key={i} onClick={() => choose(i)} className={`p-3 md:p-4 rounded-xl border text-left font-semibold transition-all text-sm flex items-center justify-between ${c}`}>
                <span>{o}</span>
                {st !== 'IDLE' && i === q.ans && <Check className="w-4 h-4 text-green-400 shrink-0" />}
              </button>
            );
          })}
        </div>
        {st === 'NO' && (
          <div className="mt-4 text-center">
            <p className="text-rose-400 text-xs font-bold mb-2">{t("ui.wrong")} — {t("ui.retry").toLowerCase()}</p>
            <button onClick={() => { setSt('IDLE'); setSel(null); }} className="text-slate-400 text-xs underline underline-offset-2">{t("ui.retry")}</button>
          </div>
        )}
        {st === 'OK' && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 px-3 py-1.5 rounded-full border border-green-500/40 font-black text-xs">
              <CheckCircle2 className="w-4 h-4" />{qi < PLANT_QUIZ_DATA.length - 1 ? t("ui.correct") : t("ui.quizComplete")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
