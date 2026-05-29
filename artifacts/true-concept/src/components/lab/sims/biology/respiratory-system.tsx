import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Microscope, Info, CheckCircle2, Zap, Check, X, Activity,
  Play, Pause, RotateCcw, ChevronRight, Wind,
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ORGANS, JOURNEY_STEPS, QUIZ_DATA, OrganData } from './respiratory-system-data';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStructureNameKey } from '@/i18n/biologyTranslations';
import { pick as pickLang } from '@/lib/i18n';
import { useLabTracker } from '@/lib/analytics/lab-tracking-context';
import LanguageToggle from '@/components/LanguageToggle';

// ─── ROOT ───────────────────────────────────────────────────────
export function RespiratorySystemModule() {
  const [view, setView] = useState<'DASH' | 'EXPLORE' | 'QUIZ'>('DASH');
  if (view === 'DASH') return <Dashboard onStart={() => setView('EXPLORE')} onQuiz={() => setView('QUIZ')} />;
  if (view === 'QUIZ') return <Quiz onBack={() => setView('EXPLORE')} />;
  return <RespiratoryExplorer onBack={() => setView('DASH')} onQuiz={() => setView('QUIZ')} />;
}

// ─── EXPLORER ───────────────────────────────────────────────────
function RespiratoryExplorer({ onBack, onQuiz }: { onBack: () => void; onQuiz: () => void }) {
  const { t, lang } = useLanguage();
  const { recordInteraction, recordJourneyFinished } = useLabTracker();
  const [selected, setSelected] = useState<OrganData | null>(null);
  const handleSelect = (o: OrganData) => { setSelected(o); recordInteraction(o.id); };
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathMode, setBreathMode] = useState(false);
  const [journeyStep, setJourneyStep] = useState(-1);
  const [journeyRunning, setJourneyRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync breathPhase with the CSS 5s animation cycle
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - start) % 5000;
      setBreathPhase(t < 2500 ? 'inhale' : 'exhale');
    }, 80);
    return () => clearInterval(id);
  }, []);

  const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const startJourney = useCallback(() => {
    setJourneyStep(0);
    setSelected(ORGANS[JOURNEY_STEPS[0].organId]);
    setJourneyRunning(true);
  }, []);

  const stopJourney = useCallback(() => {
    clearTimer(); setJourneyRunning(false); setJourneyStep(-1);
  }, []);

  useEffect(() => {
    if (!journeyRunning) return;
    timerRef.current = setInterval(() => {
      setJourneyStep(prev => {
        const next = prev + 1;
        if (next >= JOURNEY_STEPS.length) { clearTimer(); setJourneyRunning(false); recordJourneyFinished(); return -1; }
        setSelected(ORGANS[JOURNEY_STEPS[next].organId]);
        return next;
      });
    }, 2600);
    return clearTimer;
  }, [journeyRunning]);

  return (
    <div className="w-full bg-[#03080f] text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans flex flex-col" style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div className="bg-[#060d1c] border-b border-slate-800/50 px-3 py-2.5 md:px-4 flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-800/60 rounded-lg text-cyan-400"><Wind className="w-4 h-4 md:w-5 md:h-5" /></div>
          <div>
            <h2 className="text-sm md:text-lg font-black bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">{t("module.respiratory")}</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{t("ui.clickToExplore")} · Scroll to zoom</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setBreathMode(b => !b)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${breathMode ? 'bg-cyan-700 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
            <Activity className="w-3 h-3" />{breathMode ? t("ui.hideBreath") : t("ui.breathMode")}
          </button>
          {journeyStep < 0
            ? <button onClick={startJourney} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-[10px] font-bold transition-all"><Play className="w-3 h-3" />{t("ui.journey")}</button>
            : <>
                <button onClick={journeyRunning ? () => { clearTimer(); setJourneyRunning(false); } : () => setJourneyRunning(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-[10px] font-bold transition-all">
                  {journeyRunning ? <><Pause className="w-3 h-3" />{t("ui.pause")}</> : <><Play className="w-3 h-3" />{t("ui.resume")}</>}
                </button>
                <button onClick={stopJourney} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold border border-slate-700"><RotateCcw className="w-3 h-3" /></button>
              </>
          }
          <LanguageToggle />
          <button onClick={onQuiz} className="px-3 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-[10px] font-bold transition-all">{t("ui.quiz")}</button>
          <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold border border-slate-700">← {t("ui.back")}</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SVG Panel */}
        <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, #081828 0%, #03080f 68%)' }}>
          <TransformWrapper initialScale={0.9} minScale={0.3} maxScale={7} centerOnInit>
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RespiratorySVG selected={selected} onSelect={(o) => { stopJourney(); handleSelect(o); }} journeyStep={journeyStep} />
            </TransformComponent>
          </TransformWrapper>

          {/* Breath Mode overlay */}
          {breathMode && (
            <div className="absolute bottom-0 inset-x-0 pointer-events-none">
              <div className="mx-3 mb-3 bg-slate-950/95 border border-cyan-800/50 rounded-xl p-3 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-black tracking-widest ${breathPhase === 'inhale' ? 'text-cyan-400' : 'text-blue-400'}`}>
                    {breathPhase === 'inhale' ? '↓ INHALING' : '↑ EXHALING'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">~12/min · 500 mL/breath</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-[2300ms] ease-in-out ${breathPhase === 'inhale' ? 'bg-gradient-to-r from-cyan-600 to-sky-500 w-full' : 'bg-gradient-to-r from-blue-600 to-indigo-500 w-[8%]'}`} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-600 mt-1 font-bold">
                  <span>Empty</span><span>Tidal Volume</span>
                </div>
              </div>
            </div>
          )}

          {/* Journey banner */}
          {journeyStep >= 0 && !breathMode && (
            <div className="absolute bottom-0 inset-x-0 pointer-events-none">
              <div className="mx-3 mb-3 bg-slate-950/95 border border-sky-800/50 rounded-xl p-3 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Stage {journeyStep + 1}/{JOURNEY_STEPS.length}</span>
                  <ChevronRight className="w-3 h-3 text-sky-600" />
                  <span className="text-[10px] font-bold text-sky-300">{pickLang(JOURNEY_STEPS[journeyStep].stage, lang)}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{pickLang(JOURNEY_STEPS[journeyStep].shortNote, lang)}</p>
                <div className="flex gap-0.5 mt-2">
                  {JOURNEY_STEPS.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= journeyStep ? 'bg-sky-500' : 'bg-slate-700'}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-[360px] lg:w-[400px] bg-[#060d1c]/95 border-t md:border-t-0 md:border-l border-slate-800/50 overflow-y-auto shrink-0">
          {selected ? (
            <OrganInfoPanel organ={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Wind className="w-10 h-10 text-slate-700" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-bold mb-1">Click any organ to explore</p>
                <p className="text-slate-600 text-xs">12 interactive organs · NCERT aligned</p>
              </div>
              <button onClick={startJourney} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-900/50 hover:bg-cyan-800/60 border border-cyan-700/40 text-cyan-300 text-xs font-bold transition-all">
                <Play className="w-3.5 h-3.5" /> Trace Breathing Pathway
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ORGAN INFO PANEL ───────────────────────────────────────────
function OrganInfoPanel({ organ, onClose }: { organ: OrganData; onClose: () => void }) {
  const { t, lang } = useLanguage();
  const fallbackName = pickLang(organ.name, lang);
  const translatedName = (() => { const k = getStructureNameKey(organ.id); const tr = t(k); return tr !== k ? tr : fallbackName; })();
  const role = pickLang(organ.role, lang);
  const description = pickLang(organ.description, lang);
  const functions = pickLang(organ.functions, lang);
  const keyFacts = pickLang(organ.keyFacts, lang);
  const examNotes = pickLang(organ.examNotes, lang);
  const funFact = pickLang(organ.funFact, lang);
  const disorders = pickLang(organ.disorders, lang);
  const breathingNote = pickLang(organ.breathingNote, lang);
  return (
    <div className="p-4 md:p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="w-4 h-4 rounded-full mb-2 shadow-lg" style={{ background: organ.color, boxShadow: `0 0 10px ${organ.glowColor}60` }} />
          <h2 className="text-lg font-black text-white leading-tight">{translatedName}</h2>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide"
            style={{ background: `${organ.color}22`, color: organ.glowColor, border: `1px solid ${organ.color}44` }}>{role}</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center shrink-0 transition-colors"><X className="w-3.5 h-3.5" /></button>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 border border-slate-800/50 rounded-xl p-3">{description}</p>
      <InfoBlock icon={<Activity className="w-3 h-3" />} label={t("panel.functions")} color="text-cyan-400" bg="bg-cyan-950/30 border border-cyan-900/40">
        <ul className="space-y-1">{functions.map((f, i) => <li key={i} className="flex gap-1.5"><span className="text-cyan-500 shrink-0 mt-0.5">›</span><span>{f}</span></li>)}</ul>
      </InfoBlock>
      <InfoBlock icon={<Info className="w-3 h-3" />} label={t("panel.keyFacts")} color="text-sky-400" bg="bg-sky-950/30 border border-sky-900/40">
        <ul className="space-y-1">{keyFacts.map((f, i) => <li key={i} className="flex gap-1.5"><span className="text-sky-500 shrink-0 mt-0.5">›</span><span>{f}</span></li>)}</ul>
      </InfoBlock>
      <InfoBlock icon={<CheckCircle2 className="w-3 h-3" />} label={t("panel.ncertExamNotes")} color="text-violet-400" bg="bg-violet-950/30 border border-violet-900/40">
        <ul className="space-y-1">{examNotes.map((n, i) => <li key={i} className="flex gap-1.5"><span className="text-violet-500 shrink-0 mt-0.5">✦</span><span>{n}</span></li>)}</ul>
      </InfoBlock>
      <div className="rounded-xl p-3 bg-amber-950/30 border border-amber-800/30">
        <div className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Zap className="w-3 h-3" />{t("panel.funFact")}</div>
        <p className="text-[11px] text-amber-200 leading-relaxed italic">"{funFact}"</p>
      </div>
      <div className="rounded-xl p-3 bg-rose-950/25 border border-rose-900/30">
        <div className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Info className="w-3 h-3" />{t("panel.commonDisorders")}</div>
        <p className="text-[11px] text-rose-300 leading-relaxed">{disorders}</p>
      </div>
      <div className="rounded-xl p-3 bg-teal-950/30 border border-teal-900/30">
        <div className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Wind className="w-3 h-3" />{t("panel.breathingNote")}</div>
        <p className="text-[11px] text-teal-200 leading-relaxed">{breathingNote}</p>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, color, bg, children }: { icon: React.ReactNode; label: string; color: string; bg: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={`text-[9px] uppercase font-bold mb-1.5 flex items-center gap-1.5 ${color}`}>{icon}{label}</div>
      <div className={`text-[10px] md:text-[11px] text-slate-300 leading-relaxed p-3 rounded-xl ${bg}`}>{children}</div>
    </div>
  );
}

// ─── RESPIRATORY SVG ─────────────────────────────────────────────
function RespiratorySVG({ selected, onSelect, journeyStep }:
  { selected: OrganData | null; onSelect: (o: OrganData) => void; journeyStep: number }) {
  const { t, lang } = useLanguage();

  const active = (id: string) => selected?.id === id || (journeyStep >= 0 && JOURNEY_STEPS[journeyStep]?.organId === id);

  const G = (id: string, children: React.ReactNode) => {
    const organ = ORGANS[id];
    const isActive = active(id);
    const dimmed = selected !== null && !isActive && journeyStep < 0;
    return (
      <g onClick={(e) => { e.stopPropagation(); onSelect(organ); }}
        style={{
          cursor: 'pointer',
          filter: isActive ? `drop-shadow(0 0 14px ${organ.glowColor}) drop-shadow(0 0 5px ${organ.glowColor})` : undefined,
          opacity: dimmed ? 0.58 : 1,
          transition: 'opacity 0.3s, filter 0.3s',
        }}>{children}</g>
    );
  };

  const pStep = journeyStep >= 0 ? JOURNEY_STEPS[journeyStep] : null;

  return (
    <svg viewBox="-82 -5 724 760" className="w-full select-none" style={{ maxWidth: 640, maxHeight: 690 }}>
      <defs>
        <radialGradient id="rs_nose"    cx="50%" cy="40%"><stop offset="0%" stopColor="#f0c090"/><stop offset="100%" stopColor="#c88060"/></radialGradient>
        <radialGradient id="rs_pharynx" cx="50%" cy="35%"><stop offset="0%" stopColor="#e0a888"/><stop offset="100%" stopColor="#b07860"/></radialGradient>
        <radialGradient id="rs_larynx"  cx="50%" cy="35%"><stop offset="0%" stopColor="#c8a080"/><stop offset="100%" stopColor="#9a7050"/></radialGradient>
        <radialGradient id="rs_trach"   cx="0%"  cy="50%"><stop offset="0%" stopColor="#4a7090"/><stop offset="100%" stopColor="#6898b8"/></radialGradient>
        <radialGradient id="rs_lung_r"  cx="35%" cy="30%"><stop offset="0%" stopColor="#f0b8c0"/><stop offset="100%" stopColor="#d07888"/></radialGradient>
        <radialGradient id="rs_lung_l"  cx="65%" cy="30%"><stop offset="0%" stopColor="#f0b8c0"/><stop offset="100%" stopColor="#d07888"/></radialGradient>
        <radialGradient id="rs_alv"     cx="50%" cy="40%"><stop offset="0%" stopColor="#ffd8dc"/><stop offset="100%" stopColor="#f0a0a8"/></radialGradient>
        <radialGradient id="rs_diaph"   cx="50%" cy="30%"><stop offset="0%" stopColor="#c06868"/><stop offset="100%" stopColor="#782828"/></radialGradient>
        <radialGradient id="rs_pleura"  cx="50%" cy="50%"><stop offset="0%" stopColor="#b0d0e8" stopOpacity="0.4"/><stop offset="100%" stopColor="#80a8c8" stopOpacity="0.2"/></radialGradient>
        <filter id="rs_glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="rs_o2glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes rs-breathe {
          0%,5%    { transform: scale(1);    }
          42%,54%  { transform: scale(1.09); }
          94%,100% { transform: scale(1);    }
        }
        @keyframes rs-breathe-r  { 0%,5%{transform:scale(1)} 42%,54%{transform:scale(1.09)} 94%,100%{transform:scale(1)} }
        @keyframes rs-breathe-l  { 0%,5%{transform:scale(1)} 42%,54%{transform:scale(1.09)} 94%,100%{transform:scale(1)} }
        @keyframes rs-diaphragm  { 0%,5%{transform:translateY(0)} 42%,54%{transform:translateY(14px)} 94%,100%{transform:translateY(0)} }
        @keyframes rs-ribs       { 0%,5%{transform:scaleX(1)} 42%,54%{transform:scaleX(1.04)} 94%,100%{transform:scaleX(1)} }
        @keyframes rs-air-in     { 0%{cy:162;opacity:0} 4%{opacity:.9} 42%{cy:282;opacity:.5} 46%{opacity:0} 100%{opacity:0} }
        @keyframes rs-air-out    { 0%,50%{opacity:0} 56%{cy:282;opacity:0} 60%{opacity:.9} 94%{cy:162;opacity:.5} 98%{opacity:0} 100%{opacity:0} }
        @keyframes rs-o2-enter   { 0%,5%{opacity:0;r:2} 20%{opacity:.95;r:5} 42%{opacity:.85;r:4} 48%{opacity:0} 100%{opacity:0} }
        @keyframes rs-co2-exit   { 0%,48%{opacity:0} 55%{opacity:.95;r:5} 88%{opacity:.8;r:4} 95%{opacity:0} 100%{opacity:0} }
        @keyframes rs-cilia      { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(12deg)} }
        @keyframes rs-heartbeat  { 0%,100%{opacity:.25} 50%{opacity:.55} }
        @keyframes rs-o2-glow    { 0%,100%{opacity:.15} 50%{opacity:.4} }
        @keyframes rs-surf       { 0%,100%{r:6} 50%{r:8} }
        @keyframes rs-flow       { 0%{opacity:0;transform:translateX(-8px)} 30%{opacity:.9} 70%{opacity:.9} 100%{opacity:0;transform:translateX(10px)} }
        .rs-lung-r { transform-origin:195px 400px; animation:rs-breathe-r 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-lung-l { transform-origin:345px 405px; animation:rs-breathe-l 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-diaphragm { animation:rs-diaphragm 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-ribs-l    { transform-origin:268px 410px; animation:rs-ribs 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-ribs-r    { transform-origin:272px 410px; animation:rs-ribs 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-pleura-r  { transform-origin:195px 400px; animation:rs-breathe-r 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-pleura-l  { transform-origin:345px 405px; animation:rs-breathe-l 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-hb { animation: rs-heartbeat 5s cubic-bezier(.4,0,.6,1) infinite; }
        .rs-o2g { animation: rs-o2-glow 5s cubic-bezier(.4,0,.6,1) infinite; }
      `}</style>

      {/* ── Body silhouette ── */}
      <path d="M 228,2 C 205,8 185,28 178,55 L 154,130 C 132,202 120,298 116,395 C 112,482 115,565 122,640 C 128,698 148,728 175,740 L 365,740 C 392,728 412,698 418,640 C 425,565 428,482 424,395 C 420,298 408,202 386,130 L 362,55 C 355,28 335,8 312,2 C 295,-4 280,-7 270,-7 C 260,-7 245,-4 228,2 Z"
        fill="#0d1e30" opacity="0.25" />

      {/* ═══ RIB CAGE (behind lungs, renders first) ═══ */}
      {G('ribs', <>
        {/* Left ribs (patient's right side, viewer's left) */}
        <g className="rs-ribs-l">
          {[
            [266,285, 235,277, 195,279, 162,290, 144,300, 133,316],
            [266,312, 233,304, 193,306, 159,317, 141,328, 130,344],
            [266,340, 233,332, 192,334, 158,345, 139,357, 128,372],
            [266,368, 233,360, 192,362, 158,373, 138,385, 128,400],
            [266,394, 234,386, 193,388, 160,399, 140,411, 130,426],
            [266,420, 236,412, 196,414, 164,425, 146,437, 137,452],
            [266,444, 239,437, 200,439, 170,450, 154,462, 147,475],
          ].map((pts, ri) => (
            <path key={ri} d={`M ${pts[0]},${pts[1]} C ${pts[2]},${pts[3]-4} ${pts[4]},${pts[3]} ${pts[4]},${pts[3]+2} C ${pts[4]+10},${pts[3]+6} ${pts[4]+20},${pts[5]-6} ${pts[5]-4},${pts[5]}`}
              fill="none" stroke="#b0c8d8" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
          ))}
        </g>
        {/* Right ribs (patient's left side, viewer's right) */}
        <g className="rs-ribs-r">
          {[
            [274,285, 305,277, 345,279, 378,290, 396,300, 407,316],
            [274,312, 307,304, 347,306, 381,317, 399,328, 410,344],
            [274,340, 307,332, 348,334, 382,345, 401,357, 412,372],
            [274,368, 307,360, 348,362, 382,373, 402,385, 412,400],
            [274,394, 306,386, 347,388, 380,399, 400,411, 410,426],
            [274,420, 304,412, 344,414, 376,425, 394,437, 403,452],
            [274,444, 301,437, 340,439, 370,450, 386,462, 393,475],
          ].map((pts, ri) => (
            <path key={ri} d={`M ${pts[0]},${pts[1]} C ${pts[2]},${pts[3]-4} ${pts[4]},${pts[3]} ${pts[4]},${pts[3]+2} C ${pts[4]+10},${pts[3]+6} ${pts[4]+20},${pts[5]-6} ${pts[5]-4},${pts[5]}`}
              fill="none" stroke="#b0c8d8" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
          ))}
        </g>
        {/* Sternum */}
        <rect x="263" y="268" width="14" height="210" rx="5" fill="#c8d8e8" opacity="0.45" />
        {/* Sternum costal cartilages hint */}
        {[285,312,340,368,395,422].map(y => (
          <line key={y} x1="270" y1={y} x2="263" y2={y} stroke="#d0e0f0" strokeWidth="3" opacity="0.35" />
        ))}
      </>)}

      {/* ═══ LEFT LUNG ═══ */}
      {G('lungs', <>
        {/* Right lung (patient's right, viewer's LEFT) */}
        <g className="rs-lung-r">
          {/* Pleura suggestion */}
          <path d="M 265,255 C 256,247 235,243 210,248 C 178,254 147,270 132,298 C 117,325 115,362 115,404 C 115,446 121,486 133,514 C 145,542 163,560 185,569 C 207,577 230,574 250,562 C 264,551 268,532 268,507 Z"
            fill="url(#rs_pleura)" stroke="#80b0d0" strokeWidth="1.5" strokeDasharray="5 3.5" opacity="0.55" className="rs-pleura-r" />
          {/* Lung parenchyma */}
          <path d="M 262,258 C 252,250 232,246 208,251 C 178,257 150,272 136,300 C 122,327 120,364 120,405 C 120,446 126,485 138,511 C 149,537 166,554 188,562 C 210,570 232,567 250,556 C 263,546 266,528 266,505 Z"
            fill="url(#rs_lung_r)" stroke="#b05868" strokeWidth="2.5" />
          {/* Lung surface texture */}
          <path d="M 135,308 C 150,298 172,298 185,312" fill="none" stroke="#e8b0b8" strokeWidth="1.5" opacity="0.35" />
          <path d="M 128,345 C 144,334 168,334 182,348" fill="none" stroke="#e8b0b8" strokeWidth="1.5" opacity="0.3" />
          <path d="M 125,385 C 142,374 168,374 182,388" fill="none" stroke="#e8b0b8" strokeWidth="1.5" opacity="0.3" />
          {/* Lobe fissures */}
          <path d="M 188,258 C 165,298 148,348 148,400" fill="none" stroke="#c87888" strokeWidth="2" strokeDasharray="5 4" opacity="0.5" />
          <path d="M 162,340 C 145,362 136,385 136,405" fill="none" stroke="#c87888" strokeWidth="2" strokeDasharray="5 4" opacity="0.4" />
          {/* O2 glow */}
          <path d="M 262,258 C 252,250 232,246 208,251 C 178,257 150,272 136,300" fill="none" stroke="#60d0ff" strokeWidth="3" opacity="0" className="rs-o2g" />
        </g>

        {/* Left lung (patient's left, viewer's RIGHT) */}
        <g className="rs-lung-l">
          {/* Pleura */}
          <path d="M 275,256 C 284,248 306,244 332,249 C 362,256 389,273 403,301 C 417,328 420,365 418,406 C 416,447 410,486 397,513 C 383,540 363,556 341,563 C 320,569 298,566 280,555 C 270,548 268,530 268,507 Z"
            fill="url(#rs_pleura)" stroke="#80b0d0" strokeWidth="1.5" strokeDasharray="5 3.5" opacity="0.55" className="rs-pleura-l" />
          {/* Lung */}
          <path d="M 278,259 C 287,251 308,247 334,252 C 362,259 388,275 402,302 C 416,329 418,366 416,407 C 414,448 408,487 395,513 C 381,538 362,554 340,561 C 318,567 297,564 280,553 C 271,546 268,528 268,505 Z"
            fill="url(#rs_lung_l)" stroke="#b05868" strokeWidth="2.5" />
          {/* Surface texture */}
          <path d="M 398,308 C 380,300 358,300 344,315" fill="none" stroke="#e8b0b8" strokeWidth="1.5" opacity="0.35" />
          <path d="M 403,348 C 384,338 360,338 346,352" fill="none" stroke="#e8b0b8" strokeWidth="1.5" opacity="0.3" />
          {/* Cardiac notch (left lung medial) */}
          <path d="M 275,380 C 278,358 285,342 295,335" fill="none" stroke="#c87888" strokeWidth="3" opacity="0.4" />
          {/* Lobe fissure (left has 1 oblique fissure) */}
          <path d="M 352,260 C 376,300 390,348 390,400" fill="none" stroke="#c87888" strokeWidth="2" strokeDasharray="5 4" opacity="0.5" />
          {/* O2 glow */}
          <path d="M 278,259 C 287,251 308,247 334,252 C 362,259 388,275 402,302" fill="none" stroke="#60d0ff" strokeWidth="3" opacity="0" className="rs-o2g" />
        </g>
      </>)}

      {/* ═══ DIAPHRAGM ═══ */}
      {G('diaphragm', <>
        <g className="rs-diaphragm">
          {/* Dome shape */}
          <path d="M 120,520 C 120,540 150,562 190,570 C 225,577 255,577 270,575 C 285,577 315,577 350,570 C 390,562 420,540 420,520"
            fill="url(#rs_diaph)" stroke="#580808" strokeWidth="3" strokeLinecap="round" />
          {/* Inner dome highlight */}
          <path d="M 135,520 C 135,538 162,556 198,562 C 230,568 258,568 270,566 C 282,568 310,568 342,562 C 378,556 405,538 405,520"
            fill="none" stroke="#d08080" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
          {/* Central tendon */}
          <ellipse cx="270" cy="520" rx="38" ry="12" fill="#9a4040" opacity="0.6" />
          {/* Diaphragm muscle fibres suggestion */}
          {[145, 178, 212, 328, 362, 395].map(x => (
            <path key={x} d={`M ${x},520 C ${x > 270 ? x-12 : x+12},510 270,516 270,520`}
              fill="none" stroke="#c05050" strokeWidth="2" opacity="0.3" />
          ))}
          {/* Openings labels */}
          <circle cx="270" cy="512" r="4" fill="#ff9060" opacity="0.5" />
          <circle cx="258" cy="519" r="3" fill="#80c0ff" opacity="0.5" />
          <circle cx="282" cy="519" r="3" fill="#ff8080" opacity="0.4" />
        </g>
      </>)}

      {/* ═══ BRONCHIOLES (inside lungs) ═══ */}
      {G('bronchioles', <>
        {/* Right lung bronchioles */}
        <path d="M 214,308 C 200,325 190,345 185,368" fill="none" stroke="#386880" strokeWidth="10" strokeLinecap="round" />
        <path d="M 214,308 C 208,332 204,356 200,380" fill="none" stroke="#386880" strokeWidth="8"  strokeLinecap="round" />
        <path d="M 214,308 C 218,335 215,360 210,385" fill="none" stroke="#386880" strokeWidth="6"  strokeLinecap="round" />
        <path d="M 185,368 C 180,385 178,402 180,418" fill="none" stroke="#386880" strokeWidth="7"  strokeLinecap="round" />
        <path d="M 200,380 C 196,398 195,415 196,432" fill="none" stroke="#386880" strokeWidth="6"  strokeLinecap="round" />
        <path d="M 210,385 C 208,402 207,420 208,438" fill="none" stroke="#386880" strokeWidth="5"  strokeLinecap="round" />
        {/* Highlight */}
        <path d="M 214,308 C 200,325 190,345 185,368" fill="none" stroke="#68a8c8" strokeWidth="4" strokeLinecap="round" opacity="0.4" />

        {/* Left lung bronchioles */}
        <path d="M 326,315 C 340,332 350,352 350,375" fill="none" stroke="#386880" strokeWidth="10" strokeLinecap="round" />
        <path d="M 326,315 C 333,340 330,364 328,388" fill="none" stroke="#386880" strokeWidth="8"  strokeLinecap="round" />
        <path d="M 326,315 C 318,338 316,362 316,385" fill="none" stroke="#386880" strokeWidth="6"  strokeLinecap="round" />
        <path d="M 350,375 C 352,392 350,410 348,428" fill="none" stroke="#386880" strokeWidth="7"  strokeLinecap="round" />
        <path d="M 328,388 C 326,405 326,422 326,440" fill="none" stroke="#386880" strokeWidth="6"  strokeLinecap="round" />
        <path d="M 316,385 C 314,402 314,420 315,438" fill="none" stroke="#386880" strokeWidth="5"  strokeLinecap="round" />
        {/* Highlight */}
        <path d="M 326,315 C 340,332 350,352 350,375" fill="none" stroke="#68a8c8" strokeWidth="4" strokeLinecap="round" opacity="0.4" />

        {/* Airflow particles in bronchioles */}
        {[[190,355],[202,370],[212,380],[348,365],[330,378],[318,378]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="3.5" fill="#80d8ff" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="2.5s" begin={`${i*0.4}s`} repeatCount="indefinite"/>
            <animate attributeName="cy" values={`${y};${y+28};${y+28}`} dur="2.5s" begin={`${i*0.4}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </>)}

      {/* ═══ ALVEOLI CLUSTERS ═══ */}
      {G('alveoli', <>
        {/* Right lung alveoli clusters */}
        {[
          [180,425],[196,440],[210,448],[184,450],[176,440],
          [198,465],[208,472],[186,470],[200,480],
        ].map(([cx,cy],i) => (
          <circle key={`ra${i}`} cx={cx} cy={cy} r="9" fill="url(#rs_alv)" stroke="#e890a0" strokeWidth="1.5" opacity="0.88">
            <animate attributeName="r" values="9;10.5;9" dur={`${3.5+i*0.2}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* O2 entering (blue) - inhale phase */}
        {[[181,428],[199,442],[212,452],[186,455]].map(([x,y],i)=>(
          <circle key={`o${i}`} cx={x} cy={y} r="3" fill="#60d0ff" filter="url(#rs_o2glow)" opacity="0">
            <animate attributeName="opacity" values="0;0;.95;.8;0" dur="5s" begin={`${i*0.35}s`} repeatCount="indefinite" keyTimes="0;0.05;0.2;0.42;0.48"/>
            <animate attributeName="cx" values={`${x};${x+6};${x+6}`} dur="5s" begin={`${i*0.35}s`} repeatCount="indefinite" keyTimes="0;0.42;1"/>
          </circle>
        ))}
        {/* CO2 exiting (red-orange) - exhale phase */}
        {[[181,428],[199,442],[212,452],[186,455]].map(([x,y],i)=>(
          <circle key={`c${i}`} cx={x+6} cy={y} r="3" fill="#ff7060" filter="url(#rs_o2glow)" opacity="0">
            <animate attributeName="opacity" values="0;0;.95;.8;0" dur="5s" begin={`${i*0.35+2.5}s`} repeatCount="indefinite" keyTimes="0;0.55;0.7;0.88;0.96"/>
            <animate attributeName="cx" values={`${x+6};${x};${x}`} dur="5s" begin={`${i*0.35+2.5}s`} repeatCount="indefinite" keyTimes="0;0.88;1"/>
          </circle>
        ))}
        {/* Capillary glow around right alveoli */}
        <ellipse cx="193" cy="450" rx="48" ry="40" fill="none" stroke="#ff8080" strokeWidth="8" opacity="0.12" className="rs-hb" />

        {/* Left lung alveoli clusters */}
        {[
          [348,432],[334,448],[320,455],[350,455],[336,465],
          [322,475],[348,474],[335,482],[322,490],
        ].map(([cx,cy],i) => (
          <circle key={`la${i}`} cx={cx} cy={cy} r="9" fill="url(#rs_alv)" stroke="#e890a0" strokeWidth="1.5" opacity="0.88">
            <animate attributeName="r" values="9;10.5;9" dur={`${3.5+i*0.2}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* O2 entering left alveoli */}
        {[[349,435],[335,452],[321,460],[349,460]].map(([x,y],i)=>(
          <circle key={`lo${i}`} cx={x} cy={y} r="3" fill="#60d0ff" filter="url(#rs_o2glow)" opacity="0">
            <animate attributeName="opacity" values="0;0;.95;.8;0" dur="5s" begin={`${i*0.35+0.18}s`} repeatCount="indefinite" keyTimes="0;0.05;0.2;0.42;0.48"/>
          </circle>
        ))}
        {/* CO2 exiting left alveoli */}
        {[[349,435],[335,452],[321,460],[349,460]].map(([x,y],i)=>(
          <circle key={`lc${i}`} cx={x} cy={y} r="3" fill="#ff7060" filter="url(#rs_o2glow)" opacity="0">
            <animate attributeName="opacity" values="0;0;.95;.8;0" dur="5s" begin={`${i*0.35+2.68}s`} repeatCount="indefinite" keyTimes="0;0.55;0.7;0.88;0.96"/>
          </circle>
        ))}
        {/* Capillary glow around left alveoli */}
        <ellipse cx="335" cy="458" rx="46" ry="40" fill="none" stroke="#ff8080" strokeWidth="8" opacity="0.12" className="rs-hb" />
      </>)}

      {/* ═══ TRACHEA ═══ */}
      {G('trachea', <>
        {/* Outer wall */}
        <path d="M 270,158 C 268,198 268,238 270,272" fill="none" stroke="#284858" strokeWidth="30" strokeLinecap="round" />
        {/* Inner wall */}
        <path d="M 270,158 C 268,198 268,238 270,272" fill="none" stroke="url(#rs_trach)" strokeWidth="24" strokeLinecap="round" />
        {/* Lumen */}
        <path d="M 270,158 C 268,198 268,238 270,272" fill="none" stroke="#a8d8f0" strokeWidth="8"  strokeLinecap="round" opacity="0.5" />
        {/* C-shaped cartilage rings */}
        {[168,180,192,204,216,228,240,252,264].map(y => (
          <g key={y}>
            <path d={`M 257,${y} Q 270,${y-6} 283,${y}`} fill="none" stroke="#304858" strokeWidth="5" strokeLinecap="round" />
            <path d={`M 257,${y} Q 270,${y-6} 283,${y}`} fill="none" stroke="#78a8c8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        ))}
        {/* Cilia suggestion */}
        {[170,184,198,212,226,240,254,268].map((y,i) => (
          <line key={y} x1={258+i%3} y1={y} x2={258+i%3+3} y2={y-7} stroke="#a0d0e8" strokeWidth="1.5" opacity="0.45">
            <animateTransform attributeName="transform" type="rotate" values={`0 ${259+i%3} ${y};12 ${259+i%3} ${y};0 ${259+i%3} ${y}`} dur="0.5s" begin={`${i*0.06}s`} repeatCount="indefinite"/>
          </line>
        ))}
        {/* Air flow particles inhale */}
        {[0,1,2,3].map(i => (
          <circle key={i} cx="270" cy="162" r="4" fill="#90e0ff" opacity="0">
            <animate attributeName="cy" values="162;270;270" dur="5s" keyTimes="0;0.42;1" begin={`${i*1.25}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.9;0.6;0" dur="5s" keyTimes="0;0.04;0.40;0.46" begin={`${i*1.25}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* Air flow particles exhale (CO2 - slightly reddish) */}
        {[0,1,2,3].map(i => (
          <circle key={i} cx="270" cy="270" r="4" fill="#ffa888" opacity="0">
            <animate attributeName="cy" values="270;270;162" dur="5s" keyTimes="0;0.50;0.94" begin={`${i*1.25+2.5}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0;0.85;0.7;0" dur="5s" keyTimes="0;0.52;0.56;0.92;0.97" begin={`${i*1.25+2.5}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* Carina */}
        <circle cx="270" cy="272" r="5" fill="#5890a8" stroke="#90c0d8" strokeWidth="1.5" />
      </>)}

      {/* ═══ PRIMARY BRONCHI ═══ */}
      {G('bronchi', <>
        {/* Right bronchus (shorter, more vertical, wider) */}
        <path d="M 268,272 C 258,282 238,296 214,310" fill="none" stroke="#284858" strokeWidth="20" strokeLinecap="round" />
        <path d="M 268,272 C 258,282 238,296 214,310" fill="none" stroke="url(#rs_trach)" strokeWidth="16" strokeLinecap="round" />
        <path d="M 268,272 C 258,282 238,296 214,310" fill="none" stroke="#a8d8f0" strokeWidth="6"  strokeLinecap="round" opacity="0.5" />
        {/* Left bronchus (longer, more horizontal, narrower) */}
        <path d="M 272,272 C 282,282 308,298 330,317" fill="none" stroke="#284858" strokeWidth="18" strokeLinecap="round" />
        <path d="M 272,272 C 282,282 308,298 330,317" fill="none" stroke="url(#rs_trach)" strokeWidth="14" strokeLinecap="round" />
        <path d="M 272,272 C 282,282 308,298 330,317" fill="none" stroke="#a8d8f0" strokeWidth="5"  strokeLinecap="round" opacity="0.5" />
        {/* Secondary bronchi right (lobar) */}
        <path d="M 214,310 C 202,325 196,342 193,362" fill="none" stroke="#5088a0" strokeWidth="13" strokeLinecap="round" />
        <path d="M 214,310 C 202,325 196,342 193,362" fill="none" stroke="#78b8d8" strokeWidth="7"  strokeLinecap="round" opacity="0.55" />
        {/* Secondary bronchi left (lobar) */}
        <path d="M 330,317 C 342,332 348,350 348,372" fill="none" stroke="#5088a0" strokeWidth="12" strokeLinecap="round" />
        <path d="M 330,317 C 342,332 348,350 348,372" fill="none" stroke="#78b8d8" strokeWidth="6"  strokeLinecap="round" opacity="0.55" />
        {/* Airflow particles in bronchi */}
        <circle cx="240" cy="290" r="3.5" fill="#80d0f0" opacity="0">
          <animate attributeName="opacity" values="0;0.85;0" dur="5s" keyTimes="0;0.25;0.47" repeatCount="indefinite"/>
          <animate attributeName="cx"      values="268;214;214" dur="5s" keyTimes="0;0.44;1" repeatCount="indefinite"/>
          <animate attributeName="cy"      values="272;310;310" dur="5s" keyTimes="0;0.44;1" repeatCount="indefinite"/>
        </circle>
        <circle cx="300" cy="290" r="3.5" fill="#80d0f0" opacity="0">
          <animate attributeName="opacity" values="0;0.85;0" dur="5s" keyTimes="0;0.25;0.47" begin="0.2s" repeatCount="indefinite"/>
          <animate attributeName="cx"      values="272;330;330" dur="5s" keyTimes="0;0.44;1" begin="0.2s" repeatCount="indefinite"/>
          <animate attributeName="cy"      values="272;317;317" dur="5s" keyTimes="0;0.44;1" begin="0.2s" repeatCount="indefinite"/>
        </circle>
      </>)}

      {/* ═══ PHARYNX ═══ */}
      {G('pharynx', <>
        <path d="M 248,88 C 240,88 232,100 232,112 C 232,124 240,130 252,132 L 288,132 C 300,130 308,124 308,112 C 308,100 300,88 292,88 Z"
          fill="url(#rs_pharynx)" stroke="#8a6045" strokeWidth="2.5" />
        <path d="M 248,90 C 244,98 244,110 248,120" fill="none" stroke="#e8b090" strokeWidth="1.5" opacity="0.35" />
        {/* Nasopharynx / oropharynx boundary */}
        <line x1="232" y1="108" x2="308" y2="108" stroke="#a08060" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        {/* Air flow in pharynx */}
        <ellipse cx="270" cy="110" rx="14" ry="4" fill="#b0e8ff" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="5s" keyTimes="0;0.2;0.44" repeatCount="indefinite"/>
        </ellipse>
      </>)}

      {/* ═══ LARYNX ═══ */}
      {G('larynx', <>
        <path d="M 248,132 C 240,132 230,140 228,152 C 226,162 232,172 248,175 L 292,175 C 308,172 314,162 312,152 C 310,140 300,132 292,132 Z"
          fill="url(#rs_larynx)" stroke="#786040" strokeWidth="2.5" />
        {/* Thyroid cartilage angle (Adam's apple) */}
        <path d="M 260,132 L 270,122 L 280,132" fill="none" stroke="#b09070" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Vocal cords */}
        <path d="M 252,155 C 260,150 280,150 288,155" fill="none" stroke="#e8c8a0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 252,160 C 260,165 280,165 288,160" fill="none" stroke="#e8c8a0" strokeWidth="2.5" strokeLinecap="round" />
        {/* Epiglottis */}
        <path d="M 262,134 C 268,126 278,126 280,134" fill="#c0a080" stroke="#907050" strokeWidth="1.5" />
        {/* Glottis (opening) */}
        <ellipse cx="270" cy="157" rx="8" ry="3.5" fill="#284858" opacity="0.7" />
      </>)}

      {/* ═══ NASAL CAVITY ═══ */}
      {G('nasal', <>
        {/* External nose */}
        <path d="M 242,28 C 240,24 238,22 240,14 C 244,8 256,6 270,6 C 284,6 296,8 300,14 C 302,22 300,24 298,28 C 290,30 278,32 270,32 C 262,32 250,30 242,28 Z"
          fill="url(#rs_nose)" stroke="#a07050" strokeWidth="2" />
        {/* Nasal bridge */}
        <path d="M 265,6 L 268,32" fill="none" stroke="#b08060" strokeWidth="1.5" opacity="0.4" />
        {/* Nostrils */}
        <ellipse cx="255" cy="42" rx="11" ry="15" fill="url(#rs_nose)" stroke="#9a6040" strokeWidth="2" />
        <ellipse cx="285" cy="42" rx="11" ry="15" fill="url(#rs_nose)" stroke="#9a6040" strokeWidth="2" />
        {/* Nasal septum */}
        <path d="M 270,32 L 270,62" fill="none" stroke="#a07050" strokeWidth="2.5" />
        {/* Nasal conchae (turbinates) */}
        <path d="M 248,42 C 250,38 255,36 259,40" fill="none" stroke="#d09070" strokeWidth="2" strokeLinecap="round" />
        <path d="M 292,42 C 290,38 285,36 281,40" fill="none" stroke="#d09070" strokeWidth="2" strokeLinecap="round" />
        {/* Nasal hair / vibrissae */}
        {[-4,-1,2].map(dx => (
          <line key={`lh${dx}`} x1={252+dx} y1={60} x2={249+dx} y2={50} stroke="#8a6040" strokeWidth="1" opacity="0.5" />
        ))}
        {[-4,-1,2].map(dx => (
          <line key={`rh${dx}`} x1={288+dx} y1={60} x2={291+dx} y2={50} stroke="#8a6040" strokeWidth="1" opacity="0.5" />
        ))}
        {/* Air filtration/conditioning particles */}
        {[255,270,285].map((x,i) => (
          <circle key={i} cx={x} cy={52} r="2.5" fill="#80d8ff" opacity="0">
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin={`${i*0.6}s`} repeatCount="indefinite"/>
            <animate attributeName="cy" values="56;44;44" dur="3s" begin={`${i*0.6}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </>)}

      {/* ═══ MOUTH (alternate airway) ═══ */}
      {G('mouth', <>
        {/* Very subtle hint – mouth outline at sides */}
        <path d="M 234,68 C 238,72 250,75 270,75 C 290,75 302,72 306,68" fill="none" stroke="#c89060" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M 234,68 C 238,64 250,62 270,62 C 290,62 302,64 306,68" fill="none" stroke="#c89060" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </>)}

      {/* ═══ PLEURA LABEL (rendered separately from lung group for independent clicking) ═══ */}
      {G('pleura', <>
        <ellipse cx="195" cy="258" rx="28" ry="10" fill="none" stroke="#90b0d0" strokeWidth="2" strokeDasharray="4 3" opacity="0.45" />
        <ellipse cx="345" cy="262" rx="28" ry="10" fill="none" stroke="#90b0d0" strokeWidth="2" strokeDasharray="4 3" opacity="0.45" />
      </>)}

      {/* ═══ CONNECTOR LINE: Nose → Pharynx → Larynx (airway continuity) ═══ */}
      <path d="M 270,62 L 270,88" fill="none" stroke="#c0a080" strokeWidth="4" strokeLinecap="round" opacity="0.4" style={{ pointerEvents: 'none' }} />
      <path d="M 270,132 L 270,158" fill="none" stroke="#506878" strokeWidth="5" strokeLinecap="round" opacity="0.5" style={{ pointerEvents: 'none' }} />

      {/* ═══ ANATOMY LABELS ═══ */}
      <g style={{ pointerEvents: 'none' }}>
        {/* Left side */}
        <DLabel ox={242} oy={42}  lx={60} ly={42}  text={t("struct.nasalCavity")}     active={active('nasal')}       color="#e8a878" />
        <DLabel ox={234} oy={68}  lx={60} ly={88}  text={t("struct.mouth")}           active={active('mouth')}       color="#d4a832" />
        <DLabel ox={233} oy={110} lx={60} ly={135} text={t("struct.pharynxResp")}     active={active('pharynx')}     color="#cc8870" />
        <DLabel ox={228} oy={152} lx={60} ly={182} text={t("struct.larynx")}          active={active('larynx')}      color="#b08870" />
        <DLabel ox={256} oy={215} lx={60} ly={232} text={t("struct.trachea")}         active={active('trachea')}     color="#7090a8" />
        <DLabel ox={210} oy={295} lx={60} ly={295} text={t("struct.rightBronchus")}   active={active('bronchi')}     color="#6080a0" />
        <DLabel ox={188} oy={365} lx={60} ly={365} text={t("struct.bronchioles")}     active={active('bronchioles')} color="#5890a8" />
        <DLabel ox={120} oy={406} lx={60} ly={428} text={t("struct.rightLung")}       active={active('lungs')}       color="#e8a0a8" />
        <DLabel ox={193} oy={442} lx={60} ly={480} text={t("struct.alveoli")}         active={active('alveoli')}     color="#f0c8c8" />
        <DLabel ox={194} oy={520} lx={60} ly={530} text={t("struct.diaphragm")}       active={active('diaphragm')}   color="#a05858" />
        {/* Right side */}
        <DLabel ox={298} oy={42}  lx={520} ly={42}  text={t("struct.nasalCavity")}    active={active('nasal')}       color="#e8a878" right />
        <DLabel ox={330} oy={312} lx={520} ly={145} text={t("struct.leftBronchus")}   active={active('bronchi')}     color="#6080a0" right />
        <DLabel ox={350} oy={370} lx={520} ly={248} text={t("struct.bronchioles")}    active={active('bronchioles')} color="#5890a8" right />
        <DLabel ox={420} oy={406} lx={520} ly={350} text={t("struct.leftLung")}       active={active('lungs')}       color="#e8a0a8" right />
        <DLabel ox={335} oy={458} lx={520} ly={455} text={t("struct.alveoli")}        active={active('alveoli')}     color="#f0c8c8" right />
        <DLabel ox={420} oy={522} lx={520} ly={540} text={t("struct.diaphragm")}      active={active('diaphragm')}   color="#a05858" right />
        <DLabel ox={280} oy={258} lx={520} ly={608} text={t("struct.pleuralMembrane")} active={active('pleura')}    color="#90b8d0" right />
        <DLabel ox={284} oy={290} lx={520} ly={660} text={t("struct.ribCage")}        active={active('ribs')}        color="#c8d8e8" right />
      </g>

      {/* ═══ AIR/O2 JOURNEY PARTICLE ═══ */}
      {pStep && (
        <g style={{
          transform: `translate(${pStep.x}px, ${pStep.y}px)`,
          transition: 'transform 1.0s cubic-bezier(0.25,0.46,0.45,0.94)',
          pointerEvents: 'none',
        }}>
          <circle cx="0" cy="0" r="8" fill="none" stroke="#80e8ff" strokeWidth="3" opacity="0.7">
            <animate attributeName="r"       values="8;16;8"    dur="1.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;0;0.7" dur="1.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="0" cy="0" r="7" fill="#60d8ff" stroke="#a0f0ff" strokeWidth="1.5">
            <animate attributeName="r" values="7;9;7" dur="1.2s" repeatCount="indefinite"/>
          </circle>
          <text x="12" y="-10" fill="#60d8ff" fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif">
            {(() => { const s = pickLang(pStep.stage, lang); return s.includes('O₂') ? 'O₂' : s.includes('CO₂') ? 'CO₂' : ''; })()}
          </text>
        </g>
      )}
    </svg>
  );
}

// ─── LABEL HELPER ────────────────────────────────────────────────
function DLabel({ ox, oy, lx, ly, text, active, color, right = false }:
  { ox: number; oy: number; lx: number; ly: number; text: string; active: boolean; color: string; right?: boolean }) {
  const c = active ? color : '#4b5563';
  return (
    <g>
      <circle cx={ox} cy={oy} r="2.8" fill={c} opacity={active ? 0.95 : 0.45} />
      <polyline points={`${ox},${oy} ${ox},${ly} ${lx},${ly}`} fill="none" stroke={c} strokeWidth="0.85"
        opacity={active ? 0.72 : 0.28} strokeDasharray={active ? '0' : '3 2'} />
      <text x={right ? lx + 4 : lx - 4} y={ly + 1} fill={c}
        fontSize={active ? '12' : '11'} fontWeight={active ? '700' : '600'}
        textAnchor={right ? 'start' : 'end'} dominantBaseline="middle"
        fontFamily="system-ui,-apple-system,sans-serif">{text}</text>
    </g>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────
function Dashboard({ onStart, onQuiz }: { onStart: () => void; onQuiz: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="w-full min-h-[60vh] bg-[#03080f] text-slate-100 font-sans rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 45% 45%, rgba(6,182,212,0.1) 0%, rgba(14,165,233,0.06) 40%, transparent 70%)' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
      {/* Animated O2/CO2 particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <div key={i} className={`absolute rounded-full ${i % 3 === 0 ? 'bg-blue-400/30 w-2 h-2' : i % 3 === 1 ? 'bg-red-400/20 w-1.5 h-1.5' : 'bg-cyan-400/25 w-1.5 h-1.5'}`}
            style={{ left: `${6 + i * 7}%`, top: `${15 + (i % 6) * 12}%`, animation: `bounce ${2.5 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Mini breathing preview SVG */}
          <div className="shrink-0">
            <svg viewBox="80 20 300 560" width="80" height="220" className="opacity-90">
              <style>{`.db-l{transform-origin:190px 330px;animation:rs-breathe 5s ease-in-out infinite}.db-r{transform-origin:310px 330px;animation:rs-breathe 5s ease-in-out infinite}.db-d{animation:rs-diaphragm 5s ease-in-out infinite}`}</style>
              {/* mini nose */}
              <ellipse cx="195" cy="55" rx="10" ry="14" fill="#c88060" opacity="0.85"/>
              <ellipse cx="225" cy="55" rx="10" ry="14" fill="#c88060" opacity="0.85"/>
              {/* mini trachea */}
              <path d="M 210,80 L 210,170" fill="none" stroke="#607898" strokeWidth="14" strokeLinecap="round"/>
              <path d="M 210,80 L 210,170" fill="none" stroke="#90b8d0" strokeWidth="6"  strokeLinecap="round" opacity="0.5"/>
              {/* bronchi */}
              <path d="M 208,170 C 195,180 182,190 175,205" fill="none" stroke="#607898" strokeWidth="12" strokeLinecap="round"/>
              <path d="M 212,170 C 225,180 240,190 248,205" fill="none" stroke="#607898" strokeWidth="11" strokeLinecap="round"/>
              {/* left lung */}
              <g className="db-l">
                <path d="M 205,178 C 196,170 178,167 162,172 C 142,178 128,195 125,220 C 122,248 124,278 130,300 C 136,320 148,332 162,337 C 176,342 192,338 202,328 C 208,320 210,305 210,288 Z" fill="#e098a0" stroke="#b06070" strokeWidth="2"/>
              </g>
              {/* right lung */}
              <g className="db-r">
                <path d="M 215,178 C 224,170 244,167 260,172 C 280,178 294,195 298,220 C 302,248 299,278 292,300 C 286,320 273,332 260,337 C 246,342 230,338 220,328 C 214,320 210,305 210,288 Z" fill="#e098a0" stroke="#b06070" strokeWidth="2"/>
              </g>
              {/* diaphragm */}
              <g className="db-d">
                <path d="M 122,338 C 122,355 148,368 185,373 C 210,377 230,377 210,374 C 190,377 258,377 295,373 C 332,368 358,355 358,338" fill="url(#rs_diaph)" stroke="#580808" strokeWidth="3" strokeLinecap="round"/>
              </g>
              {/* journey particle */}
              <circle cx="210" cy="55" r="5" fill="#60d8ff" opacity="0.9">
                <animate attributeName="cy" values="55;80;170;250;340;370;340;170;80;55" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;1;0.9;0.9;0.9;0;0;0;0.8;1" dur="6s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-700/40 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Wind className="w-3 h-3" /> {t("pill.biologyLab")}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 mb-3 leading-tight">
              {t("dash.respiratory.title")}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
              {t("dash.respiratory.desc")}
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start mb-6">
              {[
                { label: t("badge.organsCount").replace("{n}", "12"), c: "cyan" },
                { label: t("badge.liveJourney"),                     c: "sky" },
                { label: t("badge.ncertNotes"),                      c: "indigo" },
                { label: t("badge.mcqCount").replace("{n}", "10"),   c: "violet" },
              ].map(({ label, c }) => (
                <span key={label} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-${c}-900/40 border border-${c}-700/40 text-${c}-400`}>{label}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button onClick={onStart} className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-700 to-sky-600 hover:from-cyan-600 hover:to-sky-500 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_28px_rgba(6,182,212,0.35)] transition-all hover:-translate-y-0.5">
                <Microscope className="w-4 h-4" /> {t("btn.startExploration")}
              </button>
              <button onClick={onQuiz} className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm transition-all hover:-translate-y-0.5">
                <Zap className="w-4 h-4 text-violet-400" /> {t("btn.takeQuiz")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ ────────────────────────────────────────────────────────
function Quiz({ onBack }: { onBack: () => void }) {
  const { t, lang } = useLanguage();
  const { recordQuizResult } = useLabTracker();
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [st, setSt] = useState<'IDLE' | 'OK' | 'NO'>('IDLE');
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUIZ_DATA[qi];
  const qText = pickLang(q.q, lang);
  const qOpts = pickLang(q.opts, lang);
  const qExplanation = pickLang(q.explanation, lang);

  const choose = (i: number) => {
    if (st !== 'IDLE') return;
    setSel(i);
    if (i === q.ans) {
      const newScore = score + 1;
      setSt('OK'); setScore(newScore);
      setTimeout(() => {
        if (qi < QUIZ_DATA.length - 1) { setQi(p => p + 1); setSel(null); setSt('IDLE'); }
        else {
          const pct = Math.round((newScore / QUIZ_DATA.length) * 100);
          recordQuizResult({ score: pct, totalCorrect: newScore, totalAttempted: QUIZ_DATA.length });
          setDone(true);
        }
      }, 1800);
    } else setSt('NO');
  };

  const restart = () => { setQi(0); setSel(null); setSt('IDLE'); setScore(0); setDone(false); };

  if (done) return (
    <div className="w-full bg-[#03080f] text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl p-6 min-h-[500px] relative">
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-cyan-900/40 border-2 border-cyan-600/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
          <span className="text-4xl font-black text-cyan-400">{score}/{QUIZ_DATA.length}</span>
        </div>
        <h2 className="text-2xl font-black mb-2">{t("ui.quizComplete")}</h2>
        <p className="text-slate-400 text-sm mb-2">{t("quiz.score")}: <strong className="text-white">{score}/{QUIZ_DATA.length}</strong></p>
        <p className="text-slate-500 text-xs mb-8">{score >= 8 ? t("ui.excellent") : score >= 6 ? t("ui.goodWork") : t("ui.reviewMore")}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" />{t("ui.retry")}</button>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm">{t("ui.exploreAgain")}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#03080f] text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 relative overflow-hidden p-4 min-h-[560px]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="max-w-xl w-full z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-cyan-400 font-black uppercase text-xs tracking-widest"><Wind className="w-4 h-4" />{t("quiz.title.respiratory")}</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-bold">{t("quiz.score")}: {score}/{qi}</span>
            <span className="text-xs font-bold text-slate-500">{t("quiz.questionPrefix")}{qi + 1}/{QUIZ_DATA.length}</span>
          </div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
          <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${(qi / QUIZ_DATA.length) * 100}%` }} />
        </div>
        <h2 className="text-sm md:text-base font-black mb-5 leading-snug">{qText}</h2>
        <div className="flex flex-col gap-2.5 mb-4">
          {qOpts.map((o, i) => {
            let c = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900';
            if (st !== 'IDLE' && i === q.ans) c = 'bg-cyan-950/60 border-cyan-500 text-cyan-200';
            else if (st !== 'IDLE' && sel === i) c = 'bg-rose-950/60 border-rose-500 text-rose-200';
            return (
              <button key={i} onClick={() => choose(i)} className={`p-3 md:p-3.5 rounded-xl border text-left font-semibold transition-all text-sm flex items-center justify-between gap-2 ${c}`}>
                <span>{o}</span>
                {st !== 'IDLE' && i === q.ans && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
        {st !== 'IDLE' && (
          <div className={`rounded-xl p-3 text-xs leading-relaxed ${st === 'OK' ? 'bg-cyan-950/40 border border-cyan-800/40 text-cyan-300' : 'bg-rose-950/40 border border-rose-800/40 text-rose-300'}`}>
            <strong className="block mb-0.5">{st === 'OK' ? `✓ ${t("ui.correct")}` : `✗ ${t("ui.incorrect")}`}</strong>
            {qExplanation}
            {st === 'NO' && <button onClick={() => { setSt('IDLE'); setSel(null); }} className="block mt-2 text-slate-400 underline underline-offset-2 text-[10px]">{t("ui.tryAgain")}</button>}
          </div>
        )}
      </div>
    </div>
  );
}
