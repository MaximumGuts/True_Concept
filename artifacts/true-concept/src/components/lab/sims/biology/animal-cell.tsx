import React, { useRef, useState } from 'react';
import { Microscope, Info, CheckCircle2, Zap, Check, Dna, Activity, X } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ORGANELLES, BIOLOGY_QUIZ_DATA, OrganelleDef } from './animal-cell-data';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStructureNameKey } from '@/i18n/biologyTranslations';
import LanguageToggle from '@/components/LanguageToggle';
import { pick as pickLang } from '@/lib/i18n';
import { useLabTracker } from '@/lib/analytics/lab-tracking-context';

export function AnimalCellModule() {
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
    <div className="w-full bg-[#05080f] text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans flex flex-col" style={{ minHeight: '75vh' }}>
      <div className="bg-[#0a0d1a] border-b border-slate-800/60 px-3 py-2.5 md:px-4 md:py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950/80 border border-emerald-800/60 rounded-lg text-emerald-400">
            <Microscope className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t("module.animalCell")}</h2>
            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t("ui.clickOrganelle")} · Scroll to zoom</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <LanguageToggle />
          <button onClick={onQuiz} className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] md:text-xs font-bold transition-all">{t("ui.quiz")}</button>
          <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] md:text-xs font-bold border border-slate-700 transition-all">← {t("ui.back")}</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ background: 'radial-gradient(ellipse at 40% 45%, #0d1a30 0%, #05080f 65%)' }}
        >
          <TransformWrapper initialScale={1} minScale={0.35} maxScale={6} centerOnInit>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <AnimalCellSVG selected={selected} onSelect={handleSelect} />
            </TransformComponent>
          </TransformWrapper>
        </div>

        <div className="w-full md:w-[340px] lg:w-[380px] bg-[#0a0d1a]/90 border-t md:border-t-0 md:border-l border-slate-800/60 overflow-y-auto shrink-0">
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
                <InfoSection icon={<Activity className="w-3 h-3" />} label={t("panel.function")} color="text-emerald-400" bg="bg-emerald-950/30 border border-emerald-900/40">{pickLang(selected.function, lang)}</InfoSection>
                <InfoSection icon={<CheckCircle2 className="w-3 h-3" />} label={t("panel.examNotes")} color="text-violet-400" bg="bg-violet-950/30 border border-violet-900/40">{pickLang(selected.examNotes, lang)}</InfoSection>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Microscope className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-400 text-sm font-semibold">Click any organelle to learn</p>
              <p className="text-slate-600 text-xs">12 interactive organelles · labels shown on diagram</p>
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

// ─────────────────────────────────────────────────
//  ANIMAL CELL SVG — scientifically accurate
// ─────────────────────────────────────────────────
function AnimalCellSVG({ selected, onSelect }: { selected: OrganelleDef | null; onSelect: (o: OrganelleDef) => void }) {
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

  // Organic blob — main cell body
  const CELL = 'M 188,112 C 315,38 602,44 720,165 C 802,260 808,432 704,513 C 600,594 340,592 210,508 C 82,424 66,208 188,112 Z';
  // Slightly inset for inner phospholipid layer hint
  const CELL_IN = 'M 196,124 C 318,52 598,58 714,175 C 793,267 799,430 697,507 C 595,584 344,580 218,500 C 93,420 78,216 196,124 Z';

  // Nuclear pore positions (8 around nucleus ellipse cx=372, cy=298, rx=116, ry=106)
  const nucPores = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI * 2) / 8;
    return { x: 372 + 116 * Math.cos(a), y: 298 + 106 * Math.sin(a) };
  });

  return (
    <svg viewBox="0 0 880 640" className="w-full max-w-[840px] h-auto select-none" style={{ maxHeight: '570px' }}>
      <defs>
        <radialGradient id="ac_cyto" cx="40%" cy="38%">
          <stop offset="0%"   stopColor="#cce4ff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a8d0ff" stopOpacity="0.10" />
        </radialGradient>
        <radialGradient id="ac_nuc" cx="32%" cy="28%">
          <stop offset="0%"   stopColor="#fef9c3" />
          <stop offset="80%"  stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="ac_nucleolus" cx="38%" cy="32%">
          <stop offset="0%"   stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#db2777" />
        </radialGradient>
        <radialGradient id="ac_mito" cx="28%" cy="22%">
          <stop offset="0%"   stopColor="#fecaca" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
        <radialGradient id="ac_lyso" cx="32%" cy="28%">
          <stop offset="0%"   stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <radialGradient id="ac_vac" cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>
        <filter id="ac_glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="ac_clip"><path d={CELL} /></clipPath>
      </defs>

      {/* Subtle microscope ring */}
      <ellipse cx="440" cy="318" rx="435" ry="325" fill="none" stroke="#1e3a5f" strokeWidth="1" opacity="0.25" />

      {/* ── CYTOPLASM ──────────────────────────────── */}
      <g {...hit('cytoplasm', '#93c5fd')}>
        <path d={CELL} fill="url(#ac_cyto)" />
      </g>

      {/* ── CELL MEMBRANE ──────────────────────────── */}
      <g {...hit('membrane', '#94a3b8')} onClick={(e) => { e.stopPropagation(); onSelect(O.membrane); }}>
        {/* outer phospholipid layer */}
        <path d={CELL} fill="none" stroke="#94a3b8" strokeWidth={active('membrane') ? 8 : 5.5} opacity="0.85" />
        {/* inner phospholipid layer */}
        <path d={CELL_IN} fill="none" stroke="#64748b" strokeWidth="2" opacity="0.5" />
      </g>

      {/* ── ROUGH ER ───────────────────────────────── */}
      {/* Cisternae — 3 parallel curved membrane sacs wrapping right side of nucleus */}
      <g {...hit('roughER', '#8b5cf6')}>
        {[0, 14, 28].map((offset, ci) => (
          <g key={ci}>
            <path
              d={`M ${492 + offset},192 C ${562 + offset},168 ${610 + offset},230 ${600 + offset},298 C ${592 + offset},350 ${562 + offset},375 ${526 + offset},380`}
              fill="none" stroke="#7c3aed" strokeWidth="13" strokeLinecap="round"
            />
            <path
              d={`M ${492 + offset},192 C ${562 + offset},168 ${610 + offset},230 ${600 + offset},298 C ${592 + offset},350 ${562 + offset},375 ${526 + offset},380`}
              fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"
            />
          </g>
        ))}
        {/* Ribosome dots on outer surface of RER */}
        {[
          [492,208],[492,230],[491,253],[492,276],[492,300],[492,324],[495,347],
          [506,185],[520,182],[534,182],[548,183],[562,186],[576,191],[588,200],
          [530,380],[544,380],[558,378],[570,375],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.6" fill="#1e1035" stroke="#4c1d95" strokeWidth="0.5" />
        ))}
      </g>

      {/* ── NUCLEUS ────────────────────────────────── */}
      <g {...hit('nucleus', '#f59e0b')}>
        {/* Outer nuclear membrane */}
        <ellipse cx="372" cy="298" rx="116" ry="106" fill="url(#ac_nuc)" stroke="#d97706" strokeWidth="3.5" />
        {/* Nuclear pores */}
        {nucPores.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill="#92400e" stroke="#fef08a" strokeWidth="1.5" />
        ))}
        {/* Inner nuclear membrane */}
        <ellipse cx="372" cy="298" rx="107" ry="97" fill="none" stroke="#b45309" strokeWidth="1.5" strokeDasharray="5 3.5" opacity="0.55" />
      </g>

      {/* ── CHROMATIN ──────────────────────────────── */}
      <g {...hit('chromatin', '#d8b4fe')} onClick={(e) => { e.stopPropagation(); onSelect(O.chromatin); }}>
        {[
          ['M 322,295 Q 342,272 362,295 Q 382,318 402,295', '#c026d3', '#9333ea'],
          ['M 322,295 Q 342,318 362,295 Q 382,272 402,295', '#9333ea', '#7e22ce'],
          ['M 338,325 Q 355,306 372,325 Q 389,344 406,325', '#a21caf', '#7c3aed'],
          ['M 338,325 Q 355,344 372,325 Q 389,306 406,325', '#7c3aed', '#6d28d9'],
          ['M 330,265 Q 348,246 366,265 Q 384,284 402,265', '#be185d', '#9333ea'],
          ['M 330,265 Q 348,284 366,265 Q 384,246 402,265', '#9333ea', '#7c3aed'],
        ].map(([d, s1, s2], i) => (
          <path key={i} d={d as string} fill="none" stroke={i % 2 === 0 ? s1 as string : s2 as string} strokeWidth="2" opacity={0.6 - i * 0.03} />
        ))}
      </g>

      {/* ── NUCLEOLUS ──────────────────────────────── */}
      <g {...hit('nucleolus', '#ec4899')} onClick={(e) => { e.stopPropagation(); onSelect(O.nucleolus); }}>
        <ellipse cx="370" cy="280" rx="38" ry="33" fill="url(#ac_nucleolus)" stroke="#be185d" strokeWidth="2" />
        <ellipse cx="368" cy="278" rx="22" ry="18" fill="#fce7f3" opacity="0.35" />
      </g>

      {/* ── SMOOTH ER ──────────────────────────────── */}
      <g {...hit('smoothER', '#06b6d4')}>
        {/* Tubular loops — no ribosomes */}
        <path d="M 648,138 C 678,112 718,122 722,155 C 726,188 700,205 678,196 C 660,188 664,168 682,162 C 700,156 720,165 718,183" fill="none" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" />
        <path d="M 648,138 C 678,112 718,122 722,155 C 726,188 700,205 678,196 C 660,188 664,168 682,162 C 700,156 720,165 718,183" fill="none" stroke="#0e7490" strokeWidth="3" strokeLinecap="round" />
        <path d="M 718,155 C 740,140 758,150 756,172 C 754,190 738,197 724,188" fill="none" stroke="#22d3ee" strokeWidth="9" strokeLinecap="round" />
        <path d="M 718,155 C 740,140 758,150 756,172 C 754,190 738,197 724,188" fill="none" stroke="#0e7490" strokeWidth="3" strokeLinecap="round" />
        <path d="M 678,206 C 656,222 640,244 650,266 C 662,292 688,284 690,262" fill="none" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" />
        <path d="M 678,206 C 656,222 640,244 650,266 C 662,292 688,284 690,262" fill="none" stroke="#0e7490" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ── GOLGI APPARATUS ────────────────────────── */}
      <g {...hit('golgi', '#f97316')}>
        {/* 5 stacked cisternae — widest at cis (top), narrowest at trans (bottom) */}
        {[
          { w: 80, y: 318, stroke: '#fed7aa', width: 11 },
          { w: 72, y: 332, stroke: '#fdba74', width: 10.5 },
          { w: 64, y: 346, stroke: '#fb923c', width: 10 },
          { w: 56, y: 360, stroke: '#f97316', width: 9.5 },
          { w: 48, y: 373, stroke: '#ea580c', width: 9 },
        ].map(({ w, y, stroke, width }, i) => (
          <g key={i}>
            <path d={`M ${648 - w},${y} Q 648,${y - 16} ${648 + w},${y}`} fill="none" stroke="#7c2d12" strokeWidth={width + 2} strokeLinecap="round" />
            <path d={`M ${648 - w},${y} Q 648,${y - 16} ${648 + w},${y}`} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" />
          </g>
        ))}
        {/* Trans face vesicles (secretory) */}
        <circle cx="706" cy="385" r="9"   fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
        <circle cx="690" cy="396" r="7"   fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
        <circle cx="720" cy="374" r="7.5" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
        {/* Cis face vesicle (from rough ER) */}
        <circle cx="596" cy="318" r="8"   fill="#fdba74" stroke="#9a3412" strokeWidth="1.5" />
        <circle cx="586" cy="332" r="6"   fill="#fdba74" stroke="#9a3412" strokeWidth="1.5" />
        {/* Label cis/trans */}
        <text x="560" y="313" fill="#78716c" fontSize="7.5" fontFamily="system-ui, sans-serif" fontWeight="600">cis</text>
        <text x="560" y="380" fill="#78716c" fontSize="7.5" fontFamily="system-ui, sans-serif" fontWeight="600">trans</text>
      </g>

      {/* ── MITOCHONDRIA ───────────────────────────── */}
      <g {...hit('mitochondria', '#ef4444')}>
        {/* Mito 1 — upper right */}
        <g transform="translate(668, 232) rotate(-28)">
          <ellipse cx="0" cy="0" rx="46" ry="20" fill="url(#ac_mito)" stroke="#991b1b" strokeWidth="2.5" />
          {/* Cristae — internal membrane folds */}
          {[-22, -8, 6, 20].map((x, i) => (
            <path key={i} d={`M ${x},-11 C ${x - 4},0 ${x + 4},0 ${x},11`} fill="none" stroke="#fca5a5" strokeWidth="1.8" opacity="0.65" />
          ))}
          <ellipse cx="0" cy="0" rx="46" ry="20" fill="none" stroke="#991b1b" strokeWidth="2.5" />
        </g>
        {/* Mito 2 — upper left */}
        <g transform="translate(232, 195) rotate(32)">
          <ellipse cx="0" cy="0" rx="40" ry="17" fill="url(#ac_mito)" stroke="#991b1b" strokeWidth="2" />
          {[-16, -4, 8].map((x, i) => (
            <path key={i} d={`M ${x},-9 C ${x - 3},0 ${x + 3},0 ${x},9`} fill="none" stroke="#fca5a5" strokeWidth="1.6" opacity="0.65" />
          ))}
          <ellipse cx="0" cy="0" rx="40" ry="17" fill="none" stroke="#991b1b" strokeWidth="2" />
        </g>
        {/* Mito 3 — lower center */}
        <g transform="translate(290, 482) rotate(-8)">
          <ellipse cx="0" cy="0" rx="44" ry="19" fill="url(#ac_mito)" stroke="#991b1b" strokeWidth="2.5" />
          {[-20, -6, 8, 22].map((x, i) => (
            <path key={i} d={`M ${x},-10 C ${x - 4},0 ${x + 4},0 ${x},10`} fill="none" stroke="#fca5a5" strokeWidth="1.8" opacity="0.65" />
          ))}
          <ellipse cx="0" cy="0" rx="44" ry="19" fill="none" stroke="#991b1b" strokeWidth="2.5" />
        </g>
      </g>

      {/* ── LYSOSOMES ──────────────────────────────── */}
      <g {...hit('lysosome', '#6d28d9')}>
        {[[548, 452, 17], [696, 396, 14], [175, 402, 15]].map(([cx, cy, r], i) => (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            <circle cx="0" cy="0" r={r} fill="url(#ac_lyso)" stroke="#4c1d95" strokeWidth="2" />
            <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.28} fill="white" opacity="0.22" />
          </g>
        ))}
      </g>

      {/* ── CENTROSOME / CENTRIOLES ────────────────── */}
      <g {...hit('centriole', '#3b82f6')}>
        <g transform="translate(372, 152)">
          {/* Pericentriolar material halo */}
          <circle cx="0" cy="0" r="26" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          {/* Centriole A — horizontal barrel */}
          <rect x="-18" y="-7" width="36" height="14" rx="7" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
          {[-9, 0, 9].map((x) => (
            <line key={x} x1={x} y1="-7" x2={x} y2="7" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
          ))}
          {/* Centriole B — vertical barrel (perpendicular) */}
          <rect x="5" y="-24" width="14" height="30" rx="7" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
          {[-12, -4, 4].map((y) => (
            <line key={y} x1="5" y1={y} x2="19" y2={y} stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
          ))}
        </g>
      </g>

      {/* ── VACUOLES (small, temporary) ────────────── */}
      <g {...hit('vacuole', '#10b981')}>
        <ellipse cx="672" cy="256" rx="25" ry="15" fill="url(#ac_vac)" stroke="#065f46" strokeWidth="1.5" transform="rotate(-18, 672, 256)" />
        <ellipse cx="462" cy="498" rx="30" ry="18" fill="url(#ac_vac)" stroke="#065f46" strokeWidth="1.5" transform="rotate(14, 462, 498)" />
        <ellipse cx="170" cy="450" rx="21" ry="13" fill="url(#ac_vac)" stroke="#065f46" strokeWidth="1.5" transform="rotate(38, 170, 450)" />
      </g>

      {/* ── FREE RIBOSOMES ─────────────────────────── */}
      <g {...hit('ribosome', '#475569')}>
        {[
          [295, 152],[315, 144],[275, 162],[260, 178],
          [245, 352],[232, 370],[162, 295],[178, 282],
          [655, 455],[672, 462],[686, 447],
          [432, 462],[450, 476],[416, 452],
          [718, 304],[724, 320],[710, 296],
          [148, 238],[165, 252],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            {/* large subunit */}
            <ellipse cx="0" cy="0" rx="3.5" ry="2.5" fill="#334155" stroke="#475569" strokeWidth="0.5" />
            {/* small subunit */}
            <ellipse cx="0" cy="4" rx="2.5" ry="2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
          </g>
        ))}
      </g>

      {/* ── FLOATING ANATOMY LABELS ─────────────────── */}
      <g style={{ pointerEvents: 'none' }}>
        <ConnectorLabel ox={193} oy={128} lx={108} ly={82}  text={t("struct.cellMembrane")}  active={active('membrane')}     color="#94a3b8" />
        <ConnectorLabel ox={680} oy={480} lx={775} ly={528} text={t("struct.cytoplasm")}     active={active('cytoplasm')}    color="#60a5fa" />
        <ConnectorLabel ox={258} oy={305} lx={162} ly={305} text={t("struct.nucleus")}       active={active('nucleus')}      color="#f59e0b" right={false} />
        <ConnectorLabel ox={372} oy={280} lx={282} ly={246} text={t("struct.nucleolus")}     active={active('nucleolus')}    color="#ec4899" right={false} />
        <ConnectorLabel ox={376} oy={268} lx={280} ly={230} text={t("struct.chromatin")}     active={active('chromatin')}    color="#c084fc" right={false} />
        <ConnectorLabel ox={540} oy={196} lx={620} ly={162} text={t("struct.roughER")}       active={active('roughER')}      color="#a78bfa" />
        <ConnectorLabel ox={694} oy={162} lx={780} ly={136} text={t("struct.smoothER")}      active={active('smoothER')}     color="#22d3ee" />
        <ConnectorLabel ox={650} oy={395} lx={775} ly={420} text={t("struct.golgi")}         active={active('golgi')}        color="#fb923c" />
        <ConnectorLabel ox={668} oy={232} lx={778} ly={202} text={t("struct.mitochondria")}  active={active('mitochondria')} color="#f87171" />
        <ConnectorLabel ox={548} oy={452} lx={506} ly={524} text={t("struct.lysosome")}      active={active('lysosome')}     color="#a78bfa" right={false} />
        <ConnectorLabel ox={372} oy={152} lx={278} ly={118} text={t("struct.centrosome")}    active={active('centriole')}    color="#60a5fa" right={false} />
        <ConnectorLabel ox={672} oy={256} lx={775} ly={265} text={t("struct.vacuole")}       active={active('vacuole')}      color="#34d399" />
        <ConnectorLabel ox={303} oy={148} lx={218} ly={114} text={t("struct.ribosome")}      active={active('ribosome')}     color="#64748b" right={false} />
      </g>
    </svg>
  );
}

function ConnectorLabel({
  ox, oy, lx, ly, text, active, color, right = true,
}: {
  ox: number; oy: number; lx: number; ly: number;
  text: string; active: boolean; color: string; right?: boolean;
}) {
  const baseColor = active ? color : '#4b5563';
  const textAnchor = right ? 'start' : 'end';
  return (
    <g>
      <circle cx={ox} cy={oy} r="2.8" fill={baseColor} opacity={active ? 0.95 : 0.55} />
      <polyline
        points={`${ox},${oy} ${ox + (lx - ox) * 0.55},${oy} ${lx},${ly}`}
        fill="none" stroke={baseColor} strokeWidth="0.9" opacity={active ? 0.7 : 0.35}
        strokeDasharray={active ? '0' : '3 2'}
      />
      <text
        x={lx + (right ? 3 : -3)} y={ly + 1}
        fill={baseColor}
        fontSize={active ? '10' : '9.5'}
        fontWeight={active ? '700' : '500'}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="0.2"
      >
        {text}
      </text>
    </g>
  );
}

// ── DASHBOARD ──────────────────────────────────────
function Dashboard({ onStart }: { onStart: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="w-full min-h-[50vh] bg-[#05080f] text-slate-100 font-sans rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(16,185,129,0.08) 0%, transparent 65%)' }} />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-xl w-full p-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border-2 border-emerald-600/40 text-emerald-400 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <Dna className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">{t("dash.animalCell.title")}</h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8">
          {t("dash.animalCell.desc")}
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
        >
          <Microscope className="w-5 h-5" /> {t("ui.exploreCell")}
        </button>
        <div className="mt-6 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-500" /> 12 Organelles</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> NCERT Aligned</span>
        </div>
      </div>
    </div>
  );
}

// ── QUIZ ────────────────────────────────────────────
function Quiz({ onFinish }: { onFinish: () => void }) {
  const { t, lang } = useLanguage();
  const { recordQuizResult } = useLabTracker();
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [st, setSt] = useState<'IDLE' | 'OK' | 'NO'>('IDLE');
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const q = BIOLOGY_QUIZ_DATA[qi];
  const qText = pickLang(q.q, lang);
  const qOpts = pickLang(q.opts, lang);

  const choose = (i: number) => {
    if (st !== 'IDLE') return;
    setSel(i);
    if (i === q.ans) {
      correctRef.current++;
      setSt('OK');
      setTimeout(() => {
        if (qi < BIOLOGY_QUIZ_DATA.length - 1) { setQi(p => p + 1); setSel(null); setSt('IDLE'); }
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
    <div className="w-full bg-[#05080f] text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl relative overflow-hidden p-4 min-h-[500px]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="max-w-xl w-full z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-xs tracking-widest"><Zap className="w-4 h-4" /> {t("quiz.title.animalCell")}</div>
          <div className="text-xs font-bold text-slate-500">{t("quiz.questionPrefix")}{qi + 1}/{BIOLOGY_QUIZ_DATA.length}</div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mb-6">
          <div className="bg-emerald-500 h-1 rounded-full transition-all duration-500" style={{ width: `${((qi) / BIOLOGY_QUIZ_DATA.length) * 100}%` }} />
        </div>
        <h2 className="text-base md:text-lg font-black mb-5 leading-snug">{qText}</h2>
        <div className="flex flex-col gap-2.5">
          {qOpts.map((o, i) => {
            let c = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-slate-900';
            if (st !== 'IDLE' && i === q.ans) c = 'bg-emerald-950/60 border-emerald-500 text-emerald-300';
            else if (st !== 'IDLE' && sel === i) c = 'bg-rose-950/60 border-rose-500 text-rose-300';
            return (
              <button key={i} onClick={() => choose(i)} className={`p-3 md:p-4 rounded-xl border text-left font-semibold transition-all text-sm flex items-center justify-between ${c}`}>
                <span>{o}</span>
                {st !== 'IDLE' && i === q.ans && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
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
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/40 font-black text-xs">
              <CheckCircle2 className="w-4 h-4" />{qi < BIOLOGY_QUIZ_DATA.length - 1 ? t("ui.correct") : t("ui.quizComplete")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
