import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Microscope, Info, CheckCircle2, Zap, Check, X, Activity,
  Play, Pause, RotateCcw, ChevronRight, FlaskConical,
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ORGANS, JOURNEY_STEPS, QUIZ_DATA, OrganData } from './digestive-system-data';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStructureNameKey } from '@/i18n/biologyTranslations';
import LanguageToggle from '@/components/LanguageToggle';
import { pick as pickLang } from '@/lib/i18n';
import { useLabTracker } from '@/lib/analytics/lab-tracking-context';

// ─── ROOT MODULE ────────────────────────────────────────────────
export function DigestiveSystemModule() {
  const [view, setView] = useState<'DASH' | 'EXPLORE' | 'QUIZ'>('DASH');
  if (view === 'DASH')    return <Dashboard  onStart={() => setView('EXPLORE')} onQuiz={() => setView('QUIZ')} />;
  if (view === 'QUIZ')    return <Quiz        onBack={() => setView('EXPLORE')} />;
  return <DigestiveExplorer onBack={() => setView('DASH')} onQuiz={() => setView('QUIZ')} />;
}

// ─── EXPLORER ───────────────────────────────────────────────────
function DigestiveExplorer({ onBack, onQuiz }: { onBack: () => void; onQuiz: () => void }) {
  const { t, lang } = useLanguage();
  const { recordInteraction, recordJourneyFinished } = useLabTracker();
  const [selected, setSelected] = useState<OrganData | null>(null);
  const handleSelect = (o: OrganData) => { setSelected(o); recordInteraction(o.id); };
  const [journeyStep, setJourneyStep] = useState(-1);
  const [journeyRunning, setJourneyRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const startJourney = useCallback(() => {
    setJourneyStep(0);
    setSelected(ORGANS[JOURNEY_STEPS[0].organId]);
    setJourneyRunning(true);
  }, []);

  const stopJourney = useCallback(() => {
    clearTimer();
    setJourneyRunning(false);
    setJourneyStep(-1);
  }, []);

  const pauseJourney = () => { clearTimer(); setJourneyRunning(false); };
  const resumeJourney = () => setJourneyRunning(true);

  useEffect(() => {
    if (!journeyRunning) return;
    timerRef.current = setInterval(() => {
      setJourneyStep(prev => {
        const next = prev + 1;
        if (next >= JOURNEY_STEPS.length) { clearTimer(); setJourneyRunning(false); recordJourneyFinished(); return -1; }
        setSelected(ORGANS[JOURNEY_STEPS[next].organId]);
        return next;
      });
    }, 2800);
    return clearTimer;
  }, [journeyRunning, recordJourneyFinished]);

  return (
    <div className="w-full bg-[#04080f] text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans flex flex-col" style={{ minHeight: '80vh' }}>

      {/* ── Header ── */}
      <div className="bg-[#080e1c] border-b border-slate-800/50 px-3 py-2.5 md:px-4 flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950/80 border border-emerald-800/60 rounded-lg text-emerald-400"><FlaskConical className="w-4 h-4 md:w-5 md:h-5" /></div>
          <div>
            <h2 className="text-sm md:text-lg font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">{t("module.digestive")}</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{t("ui.clickToExplore")} · Scroll to zoom</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {journeyStep < 0
            ? <button onClick={startJourney} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold transition-all"><Play className="w-3 h-3" />{t("ui.journey")}</button>
            : <>
                <button onClick={journeyRunning ? pauseJourney : resumeJourney} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-[10px] font-bold transition-all">
                  {journeyRunning ? <><Pause className="w-3 h-3" />{t("ui.pause")}</> : <><Play className="w-3 h-3" />{t("ui.resume")}</>}
                </button>
                <button onClick={stopJourney} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold border border-slate-700 transition-all"><RotateCcw className="w-3 h-3" /></button>
              </>
          }
          <LanguageToggle />
          <button onClick={onQuiz} className="px-3 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-[10px] font-bold transition-all">{t("ui.quiz")}</button>
          <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold border border-slate-700 transition-all">← {t("ui.back")}</button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* SVG panel */}
        <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing" style={{ background: 'radial-gradient(ellipse at 48% 42%, #0a1428 0%, #04080f 70%)' }}>
          <TransformWrapper initialScale={0.88} minScale={0.3} maxScale={7} centerOnInit>
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DigestiveSVG selected={selected} onSelect={handleSelect} journeyStep={journeyStep} onStopJourney={stopJourney} />
            </TransformComponent>
          </TransformWrapper>

          {/* Journey stage banner */}
          {journeyStep >= 0 && (
            <div className="absolute bottom-0 inset-x-0 pointer-events-none">
              <div className="mx-3 mb-3 bg-slate-950/95 border border-emerald-800/50 rounded-xl p-3 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Stage {journeyStep + 1}/{JOURNEY_STEPS.length}</span>
                  <ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-300">{pickLang(JOURNEY_STEPS[journeyStep].stage, lang)}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{pickLang(JOURNEY_STEPS[journeyStep].shortNote, lang)}</p>
                <div className="flex gap-0.5 mt-2">
                  {JOURNEY_STEPS.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= journeyStep ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="w-full md:w-[360px] lg:w-[400px] bg-[#080e1c]/95 border-t md:border-t-0 md:border-l border-slate-800/50 overflow-y-auto shrink-0">
          {selected ? (
            <OrganInfoPanel organ={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <FlaskConical className="w-10 h-10 text-slate-700" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-bold mb-1">Click any organ to explore</p>
                <p className="text-slate-600 text-xs">12 interactive organs · NCERT aligned · Exam notes</p>
              </div>
              <button onClick={startJourney} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-700/40 text-emerald-300 text-xs font-bold transition-all">
                <Play className="w-3.5 h-3.5" /> {t("ui.watchJourney")}
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
  const translatedName = (() => { const k = getStructureNameKey(organ.id); const tr = t(k); return tr !== k ? tr : pickLang(organ.name, lang); })();
  const fns = pickLang(organ.functions, lang);
  const secs = pickLang(organ.secretions, lang);
  const notes = pickLang(organ.examNotes, lang);
  return (
    <div className="p-4 md:p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="w-4 h-4 rounded-full mb-2 shadow-lg" style={{ background: organ.color, boxShadow: `0 0 10px ${organ.glowColor}60` }} />
          <h2 className="text-lg font-black text-white leading-tight">{translatedName}</h2>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide" style={{ background: `${organ.color}22`, color: organ.glowColor, border: `1px solid ${organ.color}44` }}>{pickLang(organ.role, lang)}</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center shrink-0 transition-colors"><X className="w-3.5 h-3.5" /></button>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 border border-slate-800/50 rounded-xl p-3">{pickLang(organ.description, lang)}</p>

      <InfoBlock icon={<Activity className="w-3 h-3" />} label={t("panel.functions")} color="text-emerald-400" bg="bg-emerald-950/30 border border-emerald-900/40">
        <ul className="space-y-1">{fns.map((f, i) => <li key={i} className="flex gap-1.5"><span className="text-emerald-500 shrink-0 mt-0.5">›</span><span>{f}</span></li>)}</ul>
      </InfoBlock>

      {secs[0] !== 'None' && secs[0] !== 'একো নাই' && (
        <InfoBlock icon={<FlaskConical className="w-3 h-3" />} label={t("panel.secretions")} color="text-cyan-400" bg="bg-cyan-950/30 border border-cyan-900/40">
          <ul className="space-y-1">{secs.map((s, i) => <li key={i} className="flex gap-1.5"><span className="text-cyan-500 shrink-0 mt-0.5">›</span><span>{s}</span></li>)}</ul>
        </InfoBlock>
      )}

      <InfoBlock icon={<CheckCircle2 className="w-3 h-3" />} label={t("panel.ncertExamNotes")} color="text-violet-400" bg="bg-violet-950/30 border border-violet-900/40">
        <ul className="space-y-1">{notes.map((n, i) => <li key={i} className="flex gap-1.5"><span className="text-violet-500 shrink-0 mt-0.5">✦</span><span>{n}</span></li>)}</ul>
      </InfoBlock>

      <div className="rounded-xl p-3 bg-amber-950/30 border border-amber-800/30">
        <div className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Zap className="w-3 h-3" />{t("panel.funFact")}</div>
        <p className="text-[11px] text-amber-200 leading-relaxed italic">"{pickLang(organ.funFact, lang)}"</p>
      </div>

      <div className="rounded-xl p-3 bg-rose-950/25 border border-rose-900/30">
        <div className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Info className="w-3 h-3" />{t("panel.commonDisorders")}</div>
        <p className="text-[11px] text-rose-300 leading-relaxed">{pickLang(organ.disorders, lang)}</p>
      </div>

      <div className="rounded-xl p-3 bg-teal-950/30 border border-teal-900/30">
        <div className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><ChevronRight className="w-3 h-3" />{t("panel.digestionJourney")}</div>
        <p className="text-[11px] text-teal-200 leading-relaxed">{pickLang(organ.journeyNote, lang)}</p>
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

// ─── DIGESTIVE SYSTEM SVG ───────────────────────────────────────
function DigestiveSVG({ selected, onSelect, journeyStep, onStopJourney }:
  { selected: OrganData | null; onSelect: (o: OrganData) => void; journeyStep: number; onStopJourney: () => void }) {
  const { t, lang } = useLanguage();

  const active = (id: string) => selected?.id === id || (journeyStep >= 0 && JOURNEY_STEPS[journeyStep]?.organId === id);

  const G = (id: string, children: React.ReactNode) => {
    const organ = ORGANS[id];
    const isActive = active(id);
    const dimmed = selected !== null && !isActive && journeyStep < 0;
    return (
      <g
        onClick={(e) => { e.stopPropagation(); onStopJourney(); onSelect(organ); }}
        style={{
          cursor: 'pointer',
          filter: isActive ? `drop-shadow(0 0 14px ${organ.glowColor}) drop-shadow(0 0 4px ${organ.glowColor})` : undefined,
          opacity: dimmed ? 0.62 : 1,
          transition: 'opacity 0.3s, filter 0.3s',
        }}
      >{children}</g>
    );
  };

  const pStep = journeyStep >= 0 ? JOURNEY_STEPS[journeyStep] : null;

  return (
    <svg viewBox="-82 -5 724 760" className="w-full select-none" style={{ maxWidth: 640, maxHeight: 680 }}>
      <defs>
        {/* ── Gradients ── */}
        <radialGradient id="ds_mouth"    cx="45%" cy="35%"><stop offset="0%" stopColor="#f0d878"/><stop offset="100%" stopColor="#c8a030"/></radialGradient>
        <radialGradient id="ds_salivary" cx="40%" cy="35%"><stop offset="0%" stopColor="#fcd0d0"/><stop offset="100%" stopColor="#e08888"/></radialGradient>
        <radialGradient id="ds_pharynx"  cx="40%" cy="35%"><stop offset="0%" stopColor="#e0a888"/><stop offset="100%" stopColor="#b87060"/></radialGradient>
        <radialGradient id="ds_esoph"    cx="0%"  cy="50%"><stop offset="0%" stopColor="#a05040"/><stop offset="100%" stopColor="#c87060"/></radialGradient>
        <radialGradient id="ds_stomach"  cx="35%" cy="30%"><stop offset="0%" stopColor="#e07878"/><stop offset="100%" stopColor="#a03838"/></radialGradient>
        <radialGradient id="ds_liver"    cx="30%" cy="28%"><stop offset="0%" stopColor="#c05050"/><stop offset="100%" stopColor="#6a1818"/></radialGradient>
        <radialGradient id="ds_gb"       cx="40%" cy="30%"><stop offset="0%" stopColor="#80c888"/><stop offset="100%" stopColor="#306840"/></radialGradient>
        <radialGradient id="ds_panc"     cx="35%" cy="40%"><stop offset="0%" stopColor="#f0b878"/><stop offset="100%" stopColor="#b87030"/></radialGradient>
        <radialGradient id="ds_si"       cx="35%" cy="35%"><stop offset="0%" stopColor="#f0b090"/><stop offset="100%" stopColor="#b86848"/></radialGradient>
        <radialGradient id="ds_li"       cx="50%" cy="40%"><stop offset="0%" stopColor="#d08858"/><stop offset="100%" stopColor="#784028"/></radialGradient>
        <radialGradient id="ds_rect"     cx="50%" cy="30%"><stop offset="0%" stopColor="#a06050"/><stop offset="100%" stopColor="#583028"/></radialGradient>
        <radialGradient id="ds_anus"     cx="50%" cy="40%"><stop offset="0%" stopColor="#804040"/><stop offset="100%" stopColor="#3a1818"/></radialGradient>
        <filter id="ds_glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* CSS animations injected as style element */}
      <style>{`
        @keyframes ds-breathe { 0%,100%{opacity:1} 50%{opacity:.87} }
        @keyframes ds-esophWave { 0%{transform:translateY(0);opacity:0} 8%{opacity:.9} 85%{opacity:.6} 100%{transform:translateY(162px);opacity:0} }
        @keyframes ds-stomachPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.012)} }
        @keyframes ds-liverGlow { 0%,100%{filter:drop-shadow(0 0 4px rgba(180,60,60,.35))} 50%{filter:drop-shadow(0 0 14px rgba(200,70,70,.65))} }
        @keyframes ds-absorb { 0%,100%{opacity:0;r:2} 50%{opacity:.95;r:6} }
        @keyframes ds-gbsqueeze { 0%,100%{transform:scaleX(1) scaleY(1)} 50%{transform:scaleX(.9) scaleY(1.12)} }
        @keyframes ds-particlePulse { 0%,100%{r:7;opacity:1} 50%{r:11;opacity:.7} }
        @keyframes ds-flow { 0%{opacity:0;transform:translateX(-10px)} 30%{opacity:.9} 70%{opacity:.9} 100%{opacity:0;transform:translateX(15px)} }
        .ds-breathe { animation: ds-breathe 3.5s ease-in-out infinite; }
        .ds-liver    { animation: ds-liverGlow 4s ease-in-out infinite; }
        .ds-stomach  { transform-origin: 195px 336px; animation: ds-stomachPulse 3s ease-in-out infinite; }
        .ds-gbsqueeze { transform-origin: 325px 397px; animation: ds-gbsqueeze 4s ease-in-out infinite; }
        .ds-absorb0  { animation: ds-absorb 2.2s 0.0s ease-in-out infinite; }
        .ds-absorb1  { animation: ds-absorb 2.2s 0.4s ease-in-out infinite; }
        .ds-absorb2  { animation: ds-absorb 2.2s 0.8s ease-in-out infinite; }
        .ds-absorb3  { animation: ds-absorb 2.2s 1.2s ease-in-out infinite; }
        .ds-absorb4  { animation: ds-absorb 2.2s 1.6s ease-in-out infinite; }
        .ds-flow0    { animation: ds-flow 3s 0.0s ease-in-out infinite; }
        .ds-flow1    { animation: ds-flow 3s 0.6s ease-in-out infinite; }
        .ds-flow2    { animation: ds-flow 3s 1.2s ease-in-out infinite; }
      `}</style>

      {/* ── Body silhouette (very subtle) ── */}
      <path d="M 228,4 C 205,10 185,28 178,58 L 154,138 C 132,210 120,305 116,402 C 112,492 115,578 122,652 C 128,712 148,742 172,755 L 368,755 C 392,742 412,712 418,652 C 425,578 428,492 424,402 C 420,305 408,210 386,138 L 362,58 C 355,28 335,10 312,4 C 295,-2 280,-5 270,-5 C 260,-5 245,-2 228,4 Z"
        fill="#1a2840" opacity="0.20" />

      {/* ═══════════════════════ ORGANS ═══════════════════════ */}

      {/* ── LARGE INTESTINE (render before small intestine for z-order) ── */}
      {G('largeIntestine', <>
        {/* Cecum pocket at bottom-right */}
        <ellipse cx="393" cy="595" rx="22" ry="18" fill="url(#ds_li)" stroke="#5a3018" strokeWidth="2.5" className="ds-breathe" />
        {/* Appendix */}
        <path d="M 398,613 C 410,628 415,645 408,658" fill="none" stroke="#6a3822" strokeWidth="9" strokeLinecap="round" />
        {/* Ascending colon (right side, going UP) */}
        <path d="M 393,578 L 393,418 C 393,408 382,400 364,400" fill="none" stroke="#5a3018" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 393,578 L 393,418 C 393,408 382,400 364,400" fill="none" stroke="url(#ds_li)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" className="ds-breathe" />
        <path d="M 393,578 L 393,418 C 393,408 382,400 364,400" fill="none" stroke="#d09060" strokeWidth="9"  strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
        {/* Transverse colon (horizontal across) */}
        <path d="M 364,400 C 330,394 295,392 270,392 C 245,392 210,394 176,400" fill="none" stroke="#5a3018" strokeWidth="30" strokeLinecap="round" />
        <path d="M 364,400 C 330,394 295,392 270,392 C 245,392 210,394 176,400" fill="none" stroke="url(#ds_li)" strokeWidth="24" strokeLinecap="round" className="ds-breathe" />
        <path d="M 364,400 C 330,394 295,392 270,392 C 245,392 210,394 176,400" fill="none" stroke="#d09060" strokeWidth="9"  strokeLinecap="round" opacity="0.35" />
        {/* Descending colon (left side, going DOWN) */}
        <path d="M 147,400 C 132,408 128,418 128,430 L 128,578" fill="none" stroke="#5a3018" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 147,400 C 132,408 128,418 128,430 L 128,578" fill="none" stroke="url(#ds_li)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" className="ds-breathe" />
        <path d="M 147,400 C 132,408 128,418 128,430 L 128,578" fill="none" stroke="#d09060" strokeWidth="9"  strokeLinecap="round" opacity="0.35" />
        {/* Sigmoid colon (curves right toward center) */}
        <path d="M 128,578 C 128,602 146,624 172,636 C 196,646 228,645 248,634 C 266,624 275,607 272,590" fill="none" stroke="#5a3018" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 128,578 C 128,602 146,624 172,636 C 196,646 228,645 248,634 C 266,624 275,607 272,590" fill="none" stroke="url(#ds_li)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" className="ds-breathe" />
        {/* Haustra markings (pouch lines on transverse colon) */}
        {[305, 330, 355].map(x => <line key={x} x1={x} y1="381" x2={x} y2="411" stroke="#7a4828" strokeWidth="2.5" opacity="0.6" />)}
        {/* Flow particle dots in colon */}
        <circle cx="393" cy="500" r="4.5" fill="#e8b070" className="ds-flow0" />
        <circle cx="270" cy="392" r="4.5" fill="#e8b070" className="ds-flow1" />
        <circle cx="128" cy="500" r="4.5" fill="#e8b070" className="ds-flow2" />
      </>)}

      {/* ── PANCREAS (behind stomach) ── */}
      {G('pancreas', <>
        <path d="M 158,380 C 158,370 198,364 250,364 C 302,364 348,370 362,382 C 367,392 352,404 308,407 C 258,410 198,410 162,400 C 155,396 155,388 158,380 Z"
          fill="url(#ds_panc)" stroke="#885820" strokeWidth="2" className="ds-breathe" />
        {/* Duct of Wirsung */}
        <path d="M 248,364 C 260,372 270,380 280,385" fill="none" stroke="#f0d090" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.55" />
        {/* Enzyme secretion particles */}
        <circle cx="248" cy="365" r="3.5" fill="#ffd890" className="ds-flow0" />
        <circle cx="260" cy="368" r="3" fill="#ffd890" className="ds-flow1" />
        <circle cx="272" cy="373" r="3" fill="#ffd890" className="ds-flow2" />
        {/* Islets of Langerhans hint */}
        <circle cx="192" cy="388" r="5" fill="#f0a060" opacity="0.5" />
        <circle cx="225" cy="390" r="4" fill="#f0a060" opacity="0.4" />
        <circle cx="310" cy="386" r="4.5" fill="#f0a060" opacity="0.4" />
      </>)}

      {/* ── LIVER ── */}
      {G('liver', <>
        <path d="M 278,292 C 292,280 362,274 410,284 C 442,292 460,318 450,352 C 440,382 408,396 370,393 C 332,390 292,374 274,352 C 256,330 256,304 278,292 Z"
          fill="url(#ds_liver)" stroke="#480e0e" strokeWidth="3" className="ds-liver" />
        <path d="M 282,296 C 298,285 360,280 405,290 C 435,298 450,322 441,352" fill="none" stroke="#e06060" strokeWidth="2.5" opacity="0.25" />
        {/* Hepatic veins suggestion */}
        <path d="M 340,310 C 355,305 375,310 390,320" fill="none" stroke="#ff9090" strokeWidth="2" opacity="0.3" />
        <path d="M 310,330 C 330,325 360,330 380,342" fill="none" stroke="#ff9090" strokeWidth="2" opacity="0.3" />
        {/* Portal vein */}
        <path d="M 285,350 C 295,358 315,368 340,375" fill="none" stroke="#80a0ff" strokeWidth="3" opacity="0.35" strokeDasharray="5 3" />
        {/* Bile production glow particles */}
        <circle cx="340" cy="330" r="5" fill="#70ff90" className="ds-flow0" opacity="0" />
        <circle cx="370" cy="320" r="4" fill="#70ff90" className="ds-flow1" opacity="0" />
      </>)}

      {/* ── GALLBLADDER ── */}
      {G('gallbladder', <>
        <path d="M 328,382 C 310,382 295,396 293,413 C 291,430 302,443 318,445 C 332,447 350,438 354,420 C 358,402 347,382 328,382 Z"
          fill="url(#ds_gb)" stroke="#1e5028" strokeWidth="2.5" className="ds-gbsqueeze" />
        {/* Bile glow */}
        <path d="M 324,390 C 316,390 310,396 310,405 C 310,414 318,420 326,420" fill="none" stroke="#90ee90" strokeWidth="2" opacity="0.5" />
        {/* Bile duct to duodenum */}
        <path d="M 340,430 C 330,445 315,458 302,462" fill="none" stroke="#60b860" strokeWidth="3.5" strokeDasharray="5 3" opacity="0.6" />
        {/* Bile particles squeezing out */}
        <circle cx="328" cy="448" r="4" fill="#80e880" className="ds-flow2" />
      </>)}

      {/* ── STOMACH ── */}
      {G('stomach', <>
        <path d="M 268,292 C 252,282 226,278 202,282 C 165,288 132,308 118,340 C 104,370 112,398 134,410 C 154,420 186,418 212,412 C 238,405 264,392 278,374 C 294,356 296,320 282,305 C 274,296 272,296 268,292 Z"
          fill="url(#ds_stomach)" stroke="#680e0e" strokeWidth="3" className="ds-stomach" />
        {/* Rugae (internal folds) */}
        <path d="M 148,340 C 175,332 208,342 228,336" fill="none" stroke="#ff9090" strokeWidth="2" opacity="0.4">
          <animate attributeName="d" values="M 148,340 C 175,332 208,342 228,336;M 148,346 C 175,338 208,348 228,342;M 148,340 C 175,332 208,342 228,336" dur="2.5s" repeatCount="indefinite"/>
        </path>
        <path d="M 140,360 C 168,352 200,362 222,356" fill="none" stroke="#ff9090" strokeWidth="2" opacity="0.35">
          <animate attributeName="d" values="M 140,360 C 168,352 200,362 222,356;M 140,366 C 168,358 200,368 222,362;M 140,360 C 168,352 200,362 222,356" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
        </path>
        {/* HCl acid bubbles */}
        {[[155,375],[172,368],[190,372],[210,366],[230,370]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#ff6060" opacity="0">
            <animate attributeName="cy" values={`${y};${y-20};${y}`} dur={`${1.8+i*0.3}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.7;0" dur={`${1.8+i*0.3}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* Pyloric sphincter */}
        <ellipse cx="276" cy="375" rx="10" ry="7" fill="#c84848" stroke="#801818" strokeWidth="2" />
      </>)}

      {/* ── SMALL INTESTINE ── */}
      {G('smallIntestine', <>
        {/* Loop 1 — outer sweep */}
        <path d="M 260,418 C 342,418 390,440 392,468 C 394,496 356,516 294,516 C 232,516 180,496 148,476 C 118,456 106,430 122,412 C 136,396 170,410 205,425"
          fill="none" stroke="#8a4828" strokeWidth="24" strokeLinecap="round" />
        <path d="M 260,418 C 342,418 390,440 392,468 C 394,496 356,516 294,516 C 232,516 180,496 148,476 C 118,456 106,430 122,412 C 136,396 170,410 205,425"
          fill="none" stroke="url(#ds_si)" strokeWidth="18" strokeLinecap="round" className="ds-breathe" />
        <path d="M 260,418 C 342,418 390,440 392,468 C 394,496 356,516 294,516"
          fill="none" stroke="#f0b090" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
        {/* Loop 2 — middle inner */}
        <path d="M 205,425 C 238,440 262,458 264,478 C 266,498 248,516 222,521 C 196,526 165,518 144,504"
          fill="none" stroke="#8a4828" strokeWidth="24" strokeLinecap="round" />
        <path d="M 205,425 C 238,440 262,458 264,478 C 266,498 248,516 222,521 C 196,526 165,518 144,504"
          fill="none" stroke="url(#ds_si)" strokeWidth="18" strokeLinecap="round" className="ds-breathe" />
        {/* Loop 3 — lower */}
        <path d="M 144,504 C 120,490 110,466 124,446 C 136,426 168,418 205,420"
          fill="none" stroke="#8a4828" strokeWidth="24" strokeLinecap="round" />
        <path d="M 144,504 C 120,490 110,466 124,446 C 136,426 168,418 205,420"
          fill="none" stroke="url(#ds_si)" strokeWidth="18" strokeLinecap="round" className="ds-breathe" />
        {/* Villi absorption glow dots */}
        <circle cx="294" cy="468" r="5" fill="#ffd090" className="ds-absorb0" />
        <circle cx="260" cy="480" r="5" fill="#ffd090" className="ds-absorb1" />
        <circle cx="225" cy="490" r="5" fill="#ffd090" className="ds-absorb2" />
        <circle cx="190" cy="478" r="5" fill="#ffd090" className="ds-absorb3" />
        <circle cx="158" cy="460" r="5" fill="#ffd090" className="ds-absorb4" />
        {/* Blood capillary glow in villi */}
        <circle cx="338" cy="452" r="4" fill="#ff9090" className="ds-absorb2" />
        <circle cx="310" cy="502" r="4" fill="#ff9090" className="ds-absorb0" />
      </>)}

      {/* ── ESOPHAGUS ── */}
      {G('esophagus', <>
        {/* Outer wall */}
        <path d="M 270,126 C 268,190 268,252 270,292" fill="none" stroke="#6a2820" strokeWidth="28" strokeLinecap="round" />
        {/* Inner wall */}
        <path d="M 270,126 C 268,190 268,252 270,292" fill="none" stroke="url(#ds_esoph)" strokeWidth="22" strokeLinecap="round" />
        {/* Lumen */}
        <path d="M 270,126 C 268,190 268,252 270,292" fill="none" stroke="#f0a090" strokeWidth="8"  strokeLinecap="round" opacity="0.45" />
        {/* Peristaltic wave — animated ball descending */}
        <ellipse cx="270" cy="130" rx="13" ry="9" fill="none" stroke="#ffc0a0" strokeWidth="3" opacity="0">
          <animate attributeName="cy"      values="130;280;130" dur="2.8s" repeatCount="indefinite" keyTimes="0;0.7;1" />
          <animate attributeName="opacity" values="0;0.9;0.8;0" dur="2.8s" repeatCount="indefinite" keyTimes="0;0.08;0.65;1" />
        </ellipse>
        <ellipse cx="270" cy="130" rx="13" ry="9" fill="none" stroke="#ffc0a0" strokeWidth="3" opacity="0">
          <animate attributeName="cy"      values="130;280;130" dur="2.8s" begin="1.4s" repeatCount="indefinite" keyTimes="0;0.7;1" />
          <animate attributeName="opacity" values="0;0.8;0.7;0" dur="2.8s" begin="1.4s" repeatCount="indefinite" keyTimes="0;0.08;0.65;1" />
        </ellipse>
      </>)}

      {/* ── PHARYNX ── */}
      {G('pharynx', <>
        <path d="M 244,90 L 296,90 L 284,127 L 256,127 Z" fill="url(#ds_pharynx)" stroke="#906050" strokeWidth="2" className="ds-breathe" />
        {/* Epiglottis hint */}
        <path d="M 256,100 C 265,95 278,98 276,108 C 274,116 260,116 258,107" fill="#d09878" stroke="#906050" strokeWidth="1.5" />
      </>)}

      {/* ── MOUTH ── */}
      {G('mouth', <>
        {/* Outer lip ellipse */}
        <ellipse cx="270" cy="72" rx="58" ry="20" fill="url(#ds_mouth)" stroke="#a08020" strokeWidth="2.5" />
        {/* Upper teeth */}
        {[-36,-22,-8,8,22,36].map(dx => (
          <rect key={`ut${dx}`} x={270+dx-6} y={55} width="12" height="14" rx="3" fill="#fffde8" stroke="#c8a840" strokeWidth="1" opacity="0.85" />
        ))}
        {/* Lower teeth */}
        {[-36,-22,-8,8,22,36].map(dx => (
          <rect key={`lt${dx}`} x={270+dx-6} y={79} width="12" height="11" rx="3" fill="#fffde8" stroke="#c8a840" strokeWidth="1" opacity="0.75" />
        ))}
        {/* Tongue */}
        <ellipse cx="270" cy="80" rx="28" ry="7" fill="#e08870" opacity="0.65" />
        {/* Saliva shimmer */}
        <ellipse cx="250" cy="73" rx="18" ry="5" fill="#c8f0ff" opacity="0.18">
          <animate attributeName="opacity" values="0.12;0.28;0.12" dur="2.5s" repeatCount="indefinite"/>
        </ellipse>
      </>)}

      {/* ── SALIVARY GLANDS ── */}
      {G('salivary', <>
        {/* Left — submandibular + sublingual */}
        <ellipse cx="183" cy="86" rx="28" ry="16" fill="url(#ds_salivary)" stroke="#b07070" strokeWidth="1.8" className="ds-breathe" />
        <ellipse cx="190" cy="107" rx="19" ry="12" fill="url(#ds_salivary)" stroke="#b07070" strokeWidth="1.5" className="ds-breathe" />
        {/* Right */}
        <ellipse cx="357" cy="86" rx="28" ry="16" fill="url(#ds_salivary)" stroke="#b07070" strokeWidth="1.8" className="ds-breathe" />
        <ellipse cx="350" cy="107" rx="19" ry="12" fill="url(#ds_salivary)" stroke="#b07070" strokeWidth="1.5" className="ds-breathe" />
        {/* Duct lines showing flow into mouth */}
        <path d="M 204,112 C 218,118 236,124 252,127" fill="none" stroke="#ffd0d0" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
        <path d="M 336,112 C 322,118 304,124 288,127" fill="none" stroke="#ffd0d0" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
        {/* Saliva droplets in ducts */}
        <circle cx="218" cy="115" r="3.5" fill="#ffd0d0" className="ds-absorb1" />
        <circle cx="322" cy="115" r="3.5" fill="#ffd0d0" className="ds-absorb3" />
      </>)}

      {/* ── RECTUM ── */}
      {G('rectum', <>
        <path d="M 270,642 C 268,655 268,668 270,682" fill="none" stroke="#3a1808" strokeWidth="30" strokeLinecap="round" />
        <path d="M 270,642 C 268,655 268,668 270,682" fill="none" stroke="url(#ds_rect)" strokeWidth="24" strokeLinecap="round" className="ds-breathe" />
        <path d="M 270,642 C 268,655 268,668 270,682" fill="none" stroke="#b07868" strokeWidth="10" strokeLinecap="round" opacity="0.4" />
        {/* Feces particle */}
        <circle cx="270" cy="660" r="5.5" fill="#a06848" opacity="0.6" className="ds-breathe" />
      </>)}

      {/* ── ANUS ── */}
      {G('anus', <>
        <ellipse cx="270" cy="693" rx="20" ry="11" fill="url(#ds_anus)" stroke="#280e08" strokeWidth="2.5" />
        <ellipse cx="270" cy="693" rx="12" ry="6" fill="#4a1818" />
        {/* Sphincter suggestion */}
        <ellipse cx="270" cy="693" rx="20" ry="11" fill="none" stroke="#5a2818" strokeWidth="5" strokeDasharray="6 3" opacity="0.5" />
      </>)}

      {/* ═══ ANATOMY LABELS (pointer-events: none) ═══ */}
      <g style={{ pointerEvents: 'none' }}>
        {/* LEFT SIDE */}
        <DLabel ox={212} oy={72}  lx={60} ly={72}  text={t("struct.oralCavity")}      active={active('mouth')}         color="#d4a832" />
        <DLabel ox={184} oy={90}  lx={60} ly={130} text={t("struct.salivaryGlands")}  active={active('salivary')}      color="#f0a0a0" />
        <DLabel ox={255} oy={108} lx={60} ly={190} text={t("struct.pharynxDigest")}   active={active('pharynx')}       color="#cc8870" />
        <DLabel ox={258} oy={210} lx={60} ly={252} text={t("struct.esophagus")}       active={active('esophagus')}     color="#c07060" />
        <DLabel ox={118} oy={358} lx={60} ly={338} text={t("struct.stomach")}         active={active('stomach')}       color="#b85258" />
        <DLabel ox={119} oy={470} lx={60} ly={428} text={t("struct.smallIntestine")}  active={active('smallIntestine')}color="#d49075" />
        <DLabel ox={128} oy={510} lx={60} ly={518} text={t("struct.largeIntestine")}  active={active('largeIntestine')}color="#a06848" />
        <DLabel ox={258} oy={660} lx={60} ly={615} text={t("struct.rectum")}          active={active('rectum')}        color="#7a4838" />
        <DLabel ox={252} oy={693} lx={60} ly={668} text={t("struct.anus")}            active={active('anus')}          color="#5a3028" />
        {/* RIGHT SIDE */}
        <DLabel ox={328} oy={72}  lx={520} ly={72}  text={t("struct.oralCavity")}     active={active('mouth')}         color="#d4a832" right />
        <DLabel ox={356} oy={88}  lx={520} ly={138} text={t("struct.salivaryGlands")} active={active('salivary')}      color="#f0a0a0" right />
        <DLabel ox={406} oy={316} lx={520} ly={226} text={t("struct.liver")}           active={active('liver')}         color="#b05050" right />
        <DLabel ox={348} oy={425} lx={520} ly={310} text={t("struct.gallbladder")}     active={active('gallbladder')}   color="#4a8855" right />
        <DLabel ox={360} oy={385} lx={520} ly={388} text={t("struct.pancreas")}        active={active('pancreas')}      color="#d49060" right />
        <DLabel ox={393} oy={468} lx={520} ly={468} text={t("struct.cecumColon")}      active={active('largeIntestine')}color="#a06848" right />
        <DLabel ox={393} oy={595} lx={520} ly={548} text={t("struct.appendix")}        active={active('largeIntestine')}color="#8a5840" right />
      </g>

      {/* ═══ FOOD PARTICLE (journey mode) ═══ */}
      {pStep && (
        <g
          style={{
            transform: `translate(${pStep.x}px, ${pStep.y}px)`,
            transition: 'transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)',
            pointerEvents: 'none',
          }}
        >
          {/* Outer ring pulse */}
          <circle cx="0" cy="0" r="8" fill="none" stroke="#ffee50" strokeWidth="3" opacity="0.7">
            <animate attributeName="r"       values="8;16;8"   dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="1.2s" repeatCount="indefinite" />
          </circle>
          {/* Inner solid dot */}
          <circle cx="0" cy="0" r="7" fill="#ffe840" stroke="#fff080" strokeWidth="1.5">
            <animate attributeName="r" values="7;9;7" dur="1.2s" repeatCount="indefinite" />
          </circle>
          {/* Label */}
          <text x="12" y="-10" fill="#ffe840" fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif">{pickLang(pStep.stage, lang).split(' ')[0]}</text>
        </g>
      )}
    </svg>
  );
}

// ─── SVG LABEL HELPER ───────────────────────────────────────────
function DLabel({ ox, oy, lx, ly, text, active, color, right = false }:
  { ox: number; oy: number; lx: number; ly: number; text: string; active: boolean; color: string; right?: boolean }) {
  const c = active ? color : '#4b5563';
  return (
    <g>
      <circle cx={ox} cy={oy} r="2.8" fill={c} opacity={active ? 0.95 : 0.45} />
      <polyline
        points={`${ox},${oy} ${ox},${ly} ${lx},${ly}`}
        fill="none" stroke={c} strokeWidth="0.85"
        opacity={active ? 0.7 : 0.28}
        strokeDasharray={active ? '0' : '3 2'}
      />
      <text
        x={right ? lx + 4 : lx - 4} y={ly + 1}
        fill={c} fontSize={active ? '12' : '11'} fontWeight={active ? '700' : '600'}
        textAnchor={right ? 'start' : 'end'}
        dominantBaseline="middle" fontFamily="system-ui,-apple-system,sans-serif"
      >{text}</text>
    </g>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────
function Dashboard({ onStart, onQuiz }: { onStart: () => void; onQuiz: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="w-full min-h-[60vh] bg-[#04080f] text-slate-100 font-sans rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
      {/* Lab-language toggle — top-right */}
      <div className="absolute top-3 right-3 z-20">
        <LanguageToggle />
      </div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 40% 45%, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)' }} />
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Floating anatomy particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/20"
            style={{ left: `${8 + i * 8}%`, top: `${20 + (i % 5) * 15}%`, animation: `bounce ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.25}s` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Mini digestive preview SVG */}
          <div className="shrink-0">
            <svg viewBox="60 40 260 680" width="88" height="230" className="opacity-90">
              {/* Simplified preview */}
              <ellipse cx="190" cy="72"  rx="48" ry="16" fill="#d4a832" opacity="0.9" />
              <path d="M 190,90 L 190,195" fill="none" stroke="#c07060" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
              <path d="M 190,196 C 180,190 162,186 150,190 C 130,195 114,210 108,232 C 100,256 108,278 124,287 C 138,295 158,293 172,288 C 186,283 200,274 210,262 C 220,250 220,228 212,216 C 204,204 198,198 190,196 Z" fill="#b85258" opacity="0.9" />
              <path d="M 215,210 C 222,203 250,198 270,204 C 287,208 297,222 291,240 C 285,256 267,264 250,262 C 233,260 218,250 215,238 C 210,222 214,214 215,210 Z" fill="#8b3535" opacity="0.85" />
              <path d="M 182,295 C 230,295 262,308 264,325 C 266,342 240,354 204,354 C 168,354 136,342 122,325 C 110,310 118,296 138,294 C 157,292 178,295 182,295 Z" fill="#d49075" opacity="0.85" />
              <path d="M 262,360 L 262,446 C 260,454 254,458 244,458 L 136,458 C 126,458 120,454 118,446 L 118,358" fill="none" stroke="#a06848" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              <path d="M 190,462 L 190,502" fill="none" stroke="#7a4838" strokeWidth="20" strokeLinecap="round" opacity="0.85" />
              <ellipse cx="190" cy="512" rx="15" ry="9" fill="#5a3028" opacity="0.85" />
              {/* Animated food particle */}
              <circle cx="190" cy="72" r="6" fill="#ffe840" opacity="0.9">
                <animate attributeName="cy" values="72;92;196;250;330;410;475;512" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                <animate attributeName="opacity" values="1;0.9;0.9;0.9;0.9;0.9;0.9;0" dur="5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FlaskConical className="w-3 h-3" /> {t("pill.biologyLab")}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-3 leading-tight">
              {t("dash.digestive.title")}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
              {t("dash.digestive.desc")}
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
              {[
                { label: t("badge.organsCount").replace("{n}", "12"), c: "emerald" },
                { label: t("badge.liveJourney"),                      c: "teal" },
                { label: t("badge.ncertNotes"),                       c: "cyan" },
                { label: t("badge.mcqCount").replace("{n}", "10"),    c: "violet" },
              ].map(({ label, c }) => (
                <span key={label} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-${c}-900/40 border border-${c}-700/40 text-${c}-400`}>{label}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button onClick={onStart} className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wide shadow-[0_0_28px_rgba(16,185,129,0.35)] transition-all hover:-translate-y-0.5">
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
    <div className="w-full bg-[#04080f] text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl p-6 min-h-[500px]">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-900/40 border-2 border-emerald-600/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <span className="text-4xl font-black text-emerald-400">{score}/{QUIZ_DATA.length}</span>
        </div>
        <h2 className="text-2xl font-black mb-2">{t("ui.quizComplete")}</h2>
        <p className="text-slate-400 text-sm mb-2">{t("ui.score")}: <strong className="text-white">{score}</strong> / <strong className="text-white">{QUIZ_DATA.length}</strong></p>
        <p className="text-slate-500 text-xs mb-8">{score >= 8 ? t("ui.excellent") : score >= 6 ? t("ui.goodWork") : t("ui.reviewMore")}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm transition-all flex items-center gap-2"><RotateCcw className="w-4 h-4" />{t("ui.retry")}</button>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm transition-all">{t("ui.exploreAgain")}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#04080f] text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl relative overflow-hidden p-4 min-h-[560px]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
      {/* Lab-language toggle */}
      <div className="absolute top-3 right-3 z-20"><LanguageToggle /></div>
      <div className="max-w-xl w-full z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-xs tracking-widest"><Zap className="w-4 h-4" />{t("quiz.title.digestive")}</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-bold">{t("quiz.score")}: {score}/{qi}</span>
            <span className="text-xs font-bold text-slate-500">{t("quiz.questionPrefix")}{qi + 1}/{QUIZ_DATA.length}</span>
          </div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
          <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${(qi / QUIZ_DATA.length) * 100}%` }} />
        </div>
        <h2 className="text-sm md:text-base font-black mb-5 leading-snug">{qText}</h2>
        <div className="flex flex-col gap-2.5 mb-4">
          {qOpts.map((o, i) => {
            let c = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-slate-900';
            if (st !== 'IDLE' && i === q.ans) c = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
            else if (st !== 'IDLE' && sel === i) c = 'bg-rose-950/60 border-rose-500 text-rose-200';
            return (
              <button key={i} onClick={() => choose(i)} className={`p-3 md:p-3.5 rounded-xl border text-left font-semibold transition-all text-sm flex items-center justify-between gap-2 ${c}`}>
                <span>{o}</span>
                {st !== 'IDLE' && i === q.ans && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
        {st !== 'IDLE' && (
          <div className={`rounded-xl p-3 text-xs leading-relaxed ${st === 'OK' ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300' : 'bg-rose-950/40 border border-rose-800/40 text-rose-300'}`}>
            <strong className="block mb-0.5">{st === 'OK' ? `✓ ${t("ui.correct")}` : `✗ ${t("ui.incorrect")}`}</strong>
            {qExplanation}
            {st === 'NO' && <button onClick={() => { setSt('IDLE'); setSel(null); }} className="block mt-2 text-slate-400 underline underline-offset-2 text-[10px]">{t("ui.tryAgain")}</button>}
          </div>
        )}
      </div>
    </div>
  );
}
