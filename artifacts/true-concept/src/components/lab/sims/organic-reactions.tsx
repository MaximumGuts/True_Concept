import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Droplets, Atom, ShieldAlert, AlertTriangle, Zap, CheckCircle2, ChevronRight, Check, Microscope, FlaskConical, Flame, TestTube2, Wind } from 'lucide-react';
import { OrganicExperimentDef, ORGANIC_EXPERIMENTS } from './organic-reactions-data';
import { useLabTracker } from '@/lib/analytics/lab-tracking-context';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { pick as pickLang } from '@/lib/i18n';

export function OrganicReactionsModule() {
  const { recordCompletion, recordInteraction } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [selectedExp, setSelectedExp] = useState<OrganicExperimentDef | null>(null);
  const [state, setState] = useState<"SETUP" | "REACTING" | "FINISHED" | "QUIZ">("SETUP");
  const [progress, setProgress] = useState(0);
  useEffect(() => { if (selectedExp) recordInteraction(`exp-${selectedExp.id}`); }, [selectedExp, recordInteraction]);

  if (!selectedExp) {
    return <OrganicReactionsDashboard onSelect={setSelectedExp} />;
  }

  if (state === "QUIZ") {
    return <OrganicQuizSection exp={selectedExp} onFinish={() => { setSelectedExp(null); setState("SETUP"); setProgress(0); }} />;
  }

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans flex flex-col relative h-[85vh] md:h-[800px] max-h-[1200px]">
      <div className="bg-slate-900 border-b border-slate-800 p-3 md:p-4 flex justify-between items-center z-10 shadow-lg">
        <div className="min-w-0 pr-2">
          <h2 className="text-base md:text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent truncate">{pickLang(selectedExp.name, lang)}</h2>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">{pickLang(selectedExp.category, lang)}</span>
            <span className="px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-red-900/30 text-red-400 border border-red-800/50">{isAs ? "তীব্ৰতা" : "Intensity"}: {selectedExp.intensity}/10</span>
          </div>
        </div>
        <LanguageToggle />
        <button onClick={() => setSelectedExp(null)} className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] md:text-xs font-bold transition-all border border-slate-700">← {isAs ? "উভতি যাওক" : "Back"}</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 bg-slate-900/50 border-t md:border-t-0 md:border-r border-slate-800 p-4 md:p-6 flex flex-col justify-between overflow-y-auto order-2 md:order-1">
          <div>
            <div className="mb-4 md:mb-6">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5" /> {isAs ? "ৰাসায়নিক সমীকৰণ" : "Chemical Equation"}
              </div>
              <div className="bg-slate-950 p-2 md:p-3 rounded-lg border border-slate-800 font-mono text-center text-cyan-400 shadow-inner text-[10px] md:text-xs font-bold">
                {selectedExp.equation}
              </div>
            </div>
            
            <div className="mb-4 md:mb-6 space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1.5 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> {isAs ? "তত্ত্ব" : "Theory"}
                </div>
                <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed">{pickLang(selectedExp.desc, lang)}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-black mb-1.5 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" /> {isAs ? "পৰ্যবেক্ষণ" : "Observations"}
                </div>
                <p className="text-[11px] md:text-xs text-emerald-200 leading-relaxed bg-emerald-950/30 p-2 md:p-2.5 rounded-lg border border-emerald-900/50">{pickLang(selectedExp.observations, lang)}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-black mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {isAs ? "পৰীক্ষাৰ টোকা" : "Exam Notes"}
                </div>
                <p className="text-[11px] md:text-xs text-indigo-200 leading-relaxed bg-indigo-950/30 p-2 md:p-2.5 rounded-lg border border-indigo-900/50">{pickLang(selectedExp.examNotes, lang)}</p>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> {isAs ? "সুৰক্ষা প্ৰ'ট'কল" : "Safety Protocols"}
              </div>
              <div className="flex flex-col gap-2">
                {pickLang(selectedExp.hazards, lang).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-red-950/20 border border-red-900/30 text-red-400 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" /> {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 shrink-0">
             {state === "SETUP" && (
                <button onClick={() => { setState("REACTING"); setProgress(0); }} className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-black shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-xs md:text-sm">
                  <TestTube2 className="w-4 h-4 md:w-5 md:h-5" /> {isAs ? "সংশ্লেষণ আৰম্ভ কৰক" : "Initiate Synthesis"}
                </button>
             )}
             {state === "REACTING" && (
                <div className="w-full p-3 md:p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="text-[10px] md:text-xs font-bold text-slate-400 mb-2 flex justify-between">
                    <span>{isAs ? "বিক্ৰিয়া অগ্ৰগতি" : "Reaction Progress"}</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 ease-linear" style={{ width: `${progress * 100}%` }} />
                  </div>
                </div>
             )}
             {state === "FINISHED" && (
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="w-full p-3 md:p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs md:text-sm font-black text-center flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> {isAs ? "সংশ্লেষণ সম্পূৰ্ণ" : "Synthesis Complete"}
                  </div>
                  <button onClick={() => setState("QUIZ")} className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-black shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-[10px] md:text-sm">
                    {isAs ? "ধাৰণা কুইজ দিয়ক" : "Take Concept Quiz"} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button onClick={() => { setState("SETUP"); setProgress(0); }} className="w-full py-2.5 md:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 transition-all flex justify-center items-center gap-2 text-[10px] md:text-xs">
                    <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" /> {isAs ? "সৰঞ্জাম পুনৰ আৰম্ভ" : "Reset Apparatus"}
                  </button>
                </div>
             )}
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col order-1 md:order-2 shrink-0 md:shrink border-b border-slate-800 md:border-b-0 h-[40vh] min-h-[320px] md:h-auto md:min-h-0 bg-slate-950 md:relative">
           <div className="relative overflow-hidden flex-1 w-full">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.5)_0%,rgba(2,6,23,1)_100%)] z-0" />
             <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0 pointer-events-none" />

             <div className="absolute inset-0 z-10 flex items-center justify-center">
               <OrganicReactionCanvas exp={selectedExp} progress={progress} state={state} onProgressUpdate={setProgress} onFinish={() => { setState("FINISHED"); recordCompletion("interaction"); }} />
             </div>

             <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-1.5 md:gap-2 pointer-events-none">
                <HUDCard label={isAs ? "উদ্দীপক" : "Catalyst"} value={selectedExp.catalyst} color="text-slate-400" />
                <HUDCard label={isAs ? "অৱস্থা" : "Status"} value={progress === 0 ? (isAs ? "অপেক্ষাত" : "Standby") : progress < 1 ? (isAs ? "সক্ৰিয়" : "Active") : (isAs ? "সাম্যাৱস্থা" : "Equilibrium")} color={progress > 0 && progress < 1 ? "text-cyan-400" : "text-slate-400"} />
             </div>
           </div>

           <div className={`md:absolute md:bottom-0 md:inset-x-0 bg-slate-900/95 border-t border-slate-700/50 backdrop-blur-xl transition-all duration-700 ease-out z-30 flex w-full overflow-hidden ${state !== "SETUP" ? "h-20 md:h-48 opacity-100 md:translate-y-0" : "h-0 md:h-48 opacity-0 md:opacity-100 md:translate-y-full border-transparent md:border-slate-700/50"}`}>
             <div className="w-1/4 md:w-1/3 border-r border-slate-800/50 p-2 md:p-4 flex flex-col justify-center items-center text-center">
                <Microscope className="hidden md:block w-8 h-8 text-cyan-400 mb-2 opacity-50" />
                <h3 className="text-[8px] md:text-xs font-black uppercase tracking-widest text-slate-400">{isAs ? "আণৱিক দৃশ্য" : "Molecular View"}</h3>
                <p className="hidden md:block text-[10px] text-slate-500 mt-2 font-mono">
                  {progress < 0.5 ? (isAs ? "কাৰ্যকৰী গোষ্ঠীৰ মিথষ্ক্ৰিয়া..." : "Functional group interaction...") : (isAs ? "উৎপাদ একত্ৰিকৰণ..." : "Product assembly...")}
                </p>
             </div>
             <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <OrganicMolecularAnimation exp={selectedExp} progress={progress} />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- PHYSICS ENGINE ---
type Pt = { x:number; y:number; vx:number; vy:number; life:number; ml:number; r:number; c:string; kind:string };

function OrganicReactionCanvas({ exp, progress, state, onProgressUpdate, onFinish }: { exp: OrganicExperimentDef, progress: number, state: string, onProgressUpdate: (p: number) => void, onFinish: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts = useRef<Pt[]>([]);
  const reqRef = useRef<number | undefined>(undefined);
  const startRef = useRef(0);

  useEffect(() => {
    if (state === "SETUP") {
      pts.current = [];
      startRef.current = 0;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawSetup(ctx, canvas.width, canvas.height, exp, 0);
        }
      }
    }

    if (state !== "REACTING") return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const duration = 12; // Organic reactions are slower/more deliberate
    startRef.current = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startRef.current) / 1000;
      const p = Math.min(1, elapsed / duration);
      onProgressUpdate(p);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSetup(ctx, canvas.width, canvas.height, exp, p, time);

      // Particle emission logic based on reaction type
      if (p > 0.05 && p < 0.95) {
        if (exp.visuals.reactionType === "ESTERIFICATION" && Math.random() < 0.3) {
           spawnParticle(exp, pts, canvas.width, canvas.height, p, "aroma");
        }
        if (exp.visuals.reactionType === "SAPONIFICATION" && Math.random() < 0.6) {
           spawnParticle(exp, pts, canvas.width, canvas.height, p, "foam");
        }
        if (exp.visuals.reactionType === "SCUM_FORMATION" && Math.random() < 0.8) {
           spawnParticle(exp, pts, canvas.width, canvas.height, p, "scum");
        }
        if (exp.visuals.reactionType === "HYDROGENATION" && Math.random() < 0.5) {
           spawnParticle(exp, pts, canvas.width, canvas.height, p, "h2_bubble");
        }
      }

      // Update & render particles
      for (let i = pts.current.length - 1; i >= 0; i--) {
        const pt = pts.current[i];
        pt.x += pt.vx; pt.y += pt.vy; pt.life -= pt.ml;
        
        if (pt.kind === 'aroma') { pt.r += 0.2; pt.vx += (Math.random() - 0.5) * 0.2; }
        if (pt.kind === 'foam' || pt.kind === 'scum') { pt.vx += (Math.random() - 0.5) * 0.1; }
        if (pt.kind === 'h2_bubble') { pt.vx += (Math.random() - 0.5) * 0.4; pt.vy -= 0.05; }
        
        if (pt.life <= 0) { pts.current.splice(i, 1); continue; }
        
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.c;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, Math.max(0.5, pt.r), 0, Math.PI * 2); ctx.fill();
        
        // Specular highlight for foam bubbles
        if (pt.kind === 'foam' && pt.r > 2) {
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.beginPath(); ctx.arc(pt.x - pt.r*0.3, pt.y - pt.r*0.3, pt.r*0.2, 0, Math.PI*2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (p < 1) { reqRef.current = requestAnimationFrame(render); }
      else { setTimeout(() => onFinish(), 500); }
    };

    reqRef.current = requestAnimationFrame(render);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [state, exp]);

  // Draw initial frame
  useEffect(() => {
    if (state === "SETUP") {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) drawSetup(ctx, canvas.width, canvas.height, exp, 0);
      }
    }
  }, [exp, state]);

  return <canvas ref={canvasRef} width={700} height={450} className="max-w-full" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
}

function drawSetup(ctx: CanvasRenderingContext2D, W: number, H: number, exp: OrganicExperimentDef, p: number, time = 0) {
  const cx = W / 2;
  const isHeated = exp.visuals.environment === "heated_fume_hood" || exp.visuals.environment === "catalyst_chamber";
  const isBeaker = exp.visuals.environment === "stirred_beaker";

  // --- Bench surface ---
  ctx.fillStyle = "rgba(51, 65, 85, 0.6)";
  ctx.fillRect(0, H * 0.78, W, 4);

  // --- Apparatus Setup ---
  const flaskBot = H * 0.78;
  const bTop = flaskBot - 150;
  const bBot = flaskBot;

  if (isHeated) {
    // Water Bath / Heating Mantle
    ctx.fillStyle = "#334155";
    ctx.fillRect(cx - 70, bBot - 30, 140, 30);
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    if (p > 0) {
      // Heat glow
      ctx.fillStyle = `rgba(239, 68, 68, ${0.1 + Math.sin(time/200)*0.1})`;
      ctx.fillRect(cx - 65, bBot - 28, 130, 26);
    }
  }

  if (isBeaker) {
    // Beaker
    const topW = 60, botW = 55;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx - topW, bTop); ctx.lineTo(cx - botW, bBot); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + topW, bTop); ctx.lineTo(cx + botW, bBot); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - botW, bBot); ctx.lineTo(cx + botW, bBot); ctx.stroke();
    // Stirrer
    ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 4;
    const sRot = p > 0 && p < 1 ? Math.sin(time/100) * 15 : 0;
    ctx.beginPath(); ctx.moveTo(cx + 20, bTop - 40); ctx.lineTo(cx - 20 + sRot, bBot - 10); ctx.stroke();
  } else {
    // Round Bottom Flask
    const neckTop = bTop, neckBot = bTop + 40, bulbCy = (neckBot + bBot)/2, bulbR = 55;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx - 15, neckTop); ctx.lineTo(cx - 15, neckBot); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 15, neckTop); ctx.lineTo(cx + 15, neckBot); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, bulbCy, bulbR, 0, Math.PI*2); ctx.stroke();
  }

  // --- Fluid Rendering Logic ---
  const liqTop = bTop + 50;
  const liqBot = bBot - 2;

  if (exp.visuals.reactionType === "ESTERIFICATION") {
    // RBF fluid: shows layer separation
    const bulbCy = (bTop + 40 + bBot)/2, bulbR = 55;
    const layerSplitY = bulbCy + p * 15; // Upper ester layer grows

    ctx.save();
    ctx.beginPath(); ctx.arc(cx, bulbCy, bulbR - 2, 0, Math.PI*2); ctx.clip();
    // Bottom Layer (Water/Acid mix)
    ctx.fillStyle = hexToRgb(exp.visuals.liquidColor2, 0.6);
    ctx.fillRect(cx - bulbR, layerSplitY, bulbR*2, bBot - layerSplitY);
    // Top Layer (Ester forming)
    ctx.fillStyle = p > 0.1 ? hexToRgb(exp.visuals.productColor, p * 0.8) : hexToRgb(exp.visuals.liquidColor1, 0.6);
    ctx.fillRect(cx - bulbR, liqTop, bulbR*2, layerSplitY - liqTop);
    ctx.restore();
  } 
  else if (exp.visuals.reactionType === "SAPONIFICATION") {
    // Beaker fluid: becomes thick and soapy
    ctx.save();
    ctx.beginPath(); ctx.moveTo(cx - 58, liqTop); ctx.lineTo(cx - 55, bBot); ctx.lineTo(cx + 55, bBot); ctx.lineTo(cx + 58, liqTop); ctx.clip();
    
    // Base liquid
    ctx.fillStyle = hexToRgb(exp.visuals.liquidColor1, 1 - p*0.5);
    ctx.fillRect(cx - 60, liqTop, 120, bBot - liqTop);
    
    // Soap product (thick, opaque)
    if (p > 0) {
      ctx.fillStyle = hexToRgb(exp.visuals.productColor, p);
      ctx.fillRect(cx - 60, liqTop, 120, bBot - liqTop);
      
      // Soap curdles on surface
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for(let i=0; i<10; i++) {
         ctx.beginPath(); 
         ctx.arc(cx - 40 + i*9, liqTop + Math.sin(i*123)*5, p * 6, 0, Math.PI*2); 
         ctx.fill();
      }
    }
    ctx.restore();
  }
  else if (exp.visuals.reactionType === "SCUM_FORMATION") {
    ctx.save();
    ctx.beginPath(); ctx.moveTo(cx - 58, liqTop); ctx.lineTo(cx - 55, bBot); ctx.lineTo(cx + 55, bBot); ctx.lineTo(cx + 58, liqTop); ctx.clip();
    
    ctx.fillStyle = hexToRgb(exp.visuals.productColor, 0.5 + p*0.5);
    ctx.fillRect(cx - 60, liqTop, 120, bBot - liqTop);
    
    // Scum particles
    if (p > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      const particleCount = Math.floor(p * 50);
      for(let i=0; i<particleCount; i++) {
         const px = cx - 50 + ((i*37)%100);
         const py = liqTop + ((i*17)%(bBot-liqTop));
         ctx.beginPath(); ctx.arc(px, py, 1.5 + Math.sin(i)*1, 0, Math.PI*2); ctx.fill();
      }
    }
    ctx.restore();
  }
  else if (exp.visuals.reactionType === "HYDROGENATION") {
    // RBF fluid: oil thickens into fat
    const bulbCy = (bTop + 40 + bBot)/2, bulbR = 55;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, bulbCy, bulbR - 2, 0, Math.PI*2); ctx.clip();
    
    // Liquid oil fading into solid fat
    ctx.fillStyle = hexToRgb(exp.visuals.liquidColor1, 1 - p);
    ctx.fillRect(cx - bulbR, liqTop, bulbR*2, bBot - liqTop);
    
    ctx.fillStyle = hexToRgb(exp.visuals.productColor, p);
    ctx.fillRect(cx - bulbR, liqTop, bulbR*2, bBot - liqTop);

    // Catalyst mesh (Nickel)
    ctx.fillStyle = "rgba(100, 110, 120, 0.8)";
    for(let i=0; i<8; i++) {
       ctx.fillRect(cx - 30 + i*8, bBot - 15 - Math.sin(i)*5, 6, 12);
    }
    ctx.restore();

    // H2 Gas tube
    ctx.strokeStyle = "rgba(200,200,200,0.6)"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx - 10, bTop - 80); ctx.lineTo(cx - 10, bBot - 10); ctx.stroke();
  }
}

function spawnParticle(exp: OrganicExperimentDef, pts: React.MutableRefObject<Pt[]>, W: number, H: number, p: number, type: string) {
  const cx = W / 2;
  const isHeated = exp.visuals.environment === "heated_fume_hood" || exp.visuals.environment === "catalyst_chamber";
  const surfaceY = isHeated ? H * 0.78 - 90 : H * 0.78 - 100;

  if (type === "aroma") {
    pts.current.push({
      x: cx + (Math.random() - 0.5) * 20, y: surfaceY - 40,
      vx: (Math.random() - 0.5) * 1.5, vy: -1 - Math.random(),
      life: 1, ml: 0.005 + Math.random() * 0.01, r: 4 + Math.random() * 10,
      c: `rgba(255, 200, 200, 0.4)`, kind: 'aroma'
    });
  } 
  else if (type === "foam" || type === "scum") {
    pts.current.push({
      x: cx + (Math.random() - 0.5) * 100, y: surfaceY + Math.random() * 10,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.5,
      life: 1, ml: 0.01, r: 3 + Math.random() * 6,
      c: type === "foam" ? "rgba(240, 250, 255, 0.8)" : "rgba(220, 220, 220, 0.9)", 
      kind: type
    });
  }
  else if (type === "h2_bubble") {
    pts.current.push({
      x: cx - 10 + (Math.random() - 0.5) * 5, y: H * 0.78 - 15,
      vx: (Math.random() - 0.5) * 2, vy: -3 - Math.random() * 2,
      life: 1, ml: 0.02, r: 1.5 + Math.random() * 2,
      c: "rgba(200, 240, 255, 0.6)", kind: 'h2_bubble'
    });
  }
}

// --- MOLECULAR ANIMATION ---
function OrganicMolecularAnimation({ exp, progress }: { exp: OrganicExperimentDef, progress: number }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  if (progress === 0) return <div className="text-slate-600 font-mono text-[9px] md:text-xs animate-pulse">{isAs ? "বিক্ৰিয়াৰ অপেক্ষা..." : "Awaiting reaction..."}</div>;
  if (progress >= 1) return <div className="text-emerald-500 font-mono text-[9px] md:text-xs">{isAs ? "সংশ্লেষণ সম্পূৰ্ণ" : "Synthesis Complete"}</div>;

  let leftGroup = "", rightGroup = "", productGroup = "", byProduct = "";

  if (exp.visuals.reactionType === "ESTERIFICATION") {
    leftGroup = "CH₃COOH"; rightGroup = "HOC₂H₅"; productGroup = "CH₃COOC₂H₅"; byProduct = "H₂O";
  } else if (exp.visuals.reactionType === "SAPONIFICATION") {
    leftGroup = "CH₃COOC₂H₅"; rightGroup = "NaOH"; productGroup = "CH₃COONa"; byProduct = "C₂H₅OH";
  } else if (exp.visuals.reactionType === "SCUM_FORMATION") {
    leftGroup = "2RCOONa"; rightGroup = "Ca²⁺"; productGroup = "(RCOO)₂Ca"; byProduct = "2Na⁺";
  } else if (exp.visuals.reactionType === "HYDROGENATION") {
    leftGroup = "R₂C=CR₂"; rightGroup = "H₂"; productGroup = "R₂CH-CHR₂"; byProduct = "";
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
      
      <div className="flex items-center gap-3 md:gap-8 z-10 font-mono">
        {/* Reactants (Fade out) */}
        <div className={`flex gap-2 transition-all duration-1000 ${progress > 0.5 ? 'opacity-0 scale-50 absolute' : 'opacity-100 scale-100 relative'}`}>
          <div className="px-3 py-2 border-2 border-indigo-500/50 text-indigo-300 rounded-lg bg-indigo-950/30 text-[9px] md:text-sm">{leftGroup}</div>
          <div className="text-slate-500 flex items-center">+</div>
          <div className="px-3 py-2 border-2 border-cyan-500/50 text-cyan-300 rounded-lg bg-cyan-950/30 text-[9px] md:text-sm">{rightGroup}</div>
        </div>

        {/* Products (Fade in) */}
        <div className={`flex gap-2 transition-all duration-1000 ${progress <= 0.5 ? 'opacity-0 scale-50 absolute' : 'opacity-100 scale-100 relative'}`}>
          <div className="px-4 py-2 border-2 border-emerald-500 text-emerald-300 rounded-lg bg-emerald-950/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-[10px] md:text-base font-bold">{productGroup}</div>
          {byProduct && (
            <>
              <div className="text-slate-500 flex items-center">+</div>
              <div className="px-3 py-2 border-2 border-slate-500/50 text-slate-300 rounded-lg bg-slate-900/50 text-[9px] md:text-sm">{byProduct}</div>
            </>
          )}
        </div>
      </div>

      {progress > 0.2 && progress < 0.8 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 md:w-32 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm opacity-80 animate-pulse" />
      )}

      <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 text-[6px] md:text-[9px] text-slate-500 tracking-widest uppercase whitespace-nowrap">
        {progress < 0.5 ? (isAs ? "কাৰ্যকৰী গোষ্ঠীৰ মিথষ্ক্ৰিয়া" : "Functional Group Interaction") : (isAs ? "আণৱিক সমাবেশ" : "Molecular Assembly")}
      </div>
    </div>
  );
}

// --- DASHBOARD UI ---
function OrganicReactionsDashboard({ onSelect }: { onSelect: (e: OrganicExperimentDef) => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <div className="w-full bg-slate-950 min-h-[50vh] text-slate-100 font-sans selection:bg-cyan-500/30 rounded-2xl border border-slate-800">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight">{isAs ? "জৈৱ সংশ্লেষণ লেব" : "Organic Synthesis Lab"}</h1>
          <LanguageToggle />
        </div>
        <div className="text-center mb-10">
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto font-medium text-sm md:text-base">{isAs ? "ইষ্টাৰিফিকেচন, চাবোনীকৰণ, আৰু যোগ বিক্ৰিয়াসহ চলচ্চিত্ৰমূলক জৈৱ ৰসায়ন সংশ্লেষণ সম্পাদন কৰক।" : "Perform cinematic organic chemistry syntheses including Esterification, Saponification, and Addition reactions."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ORGANIC_EXPERIMENTS.map((exp) => (
            <div key={exp.id} onClick={() => onSelect(exp)} 
                 className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 cursor-pointer hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.3)] flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
              
              <div className="absolute -inset-20 bg-gradient-to-br from-cyan-500/0 via-emerald-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:via-emerald-500/10 group-hover:to-blue-500/10 rounded-full blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400`}>
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${exp.intensity > 5 ? 'bg-red-950/30 border-red-900/50 text-red-400' : 'bg-green-950/30 border-green-900/50 text-green-400'}`}>
                    {pickLang(exp.category, lang)}
                  </span>
                </div>
                
                <h3 className="text-base md:text-lg font-black text-slate-100 mb-1">{pickLang(exp.name, lang)}</h3>
                <p className="text-[10px] md:text-xs text-slate-500 font-mono font-bold mb-4 line-clamp-2">{exp.reactants.join(" + ")}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-4 text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>{isAs ? "লেবত প্ৰৱেশ" : "Enter Laboratory"}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- QUIZ UI ---
function OrganicQuizSection({ exp, onFinish }: { exp: OrganicExperimentDef, onFinish: () => void }) {
  const { recordQuizResult } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [status, setStatus] = useState<"IDLE"|"CORRECT"|"WRONG">("IDLE");
  const correctRef = useRef(0);
  const wrongRef = useRef(0);

  const q = exp.quiz[qIdx];

  const handleSelect = (idx: number) => {
    if (status !== "IDLE") return;
    setSelectedOpt(idx);
    if (idx === q.ans) {
      correctRef.current++;
      setStatus("CORRECT");
      setTimeout(() => {
        if (qIdx < exp.quiz.length - 1) {
          setQIdx(prev => prev + 1);
          setSelectedOpt(null);
          setStatus("IDLE");
        } else {
          const total = correctRef.current + wrongRef.current;
          const score = total > 0 ? Math.round((correctRef.current / total) * 100) : 100;
          recordQuizResult({ score, totalCorrect: correctRef.current, totalAttempted: total });
          onFinish();
        }
      }, 1500);
    } else {
      wrongRef.current++;
      setStatus("WRONG");
    }
  };

  return (
    <div className="w-full min-h-[500px] md:h-[600px] bg-slate-950 text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl relative overflow-hidden p-4">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_100%)] pointer-events-none" />
       
       <div className="max-w-xl w-full z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-cyan-400 font-black uppercase text-[10px] md:text-xs tracking-widest">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" /> {isAs ? "সংশ্লেষণ যাচাই" : "Synthesis Verification"}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-500 shrink-0">
              {isAs ? "ধাৰণা" : "Concept"} {qIdx + 1} {isAs ? "মুঠৰ পৰা" : "of"} {exp.quiz.length}
            </div>
          </div>
          
          <h2 className="text-lg md:text-xl font-black text-slate-100 mb-6 md:mb-8 leading-tight">{pickLang(q.q, lang)}</h2>

          <div className="flex flex-col gap-2.5 md:gap-3">
            {pickLang(q.opts, lang).map((opt, i) => {
              const isSelected = selectedOpt === i;
              const isCorrect = i === q.ans;
              
              let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800";
              if (status !== "IDLE" && isCorrect) btnClass = "bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
              else if (status !== "IDLE" && isSelected && !isCorrect) btnClass = "bg-rose-950 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]";

              return (
                <button key={i} onClick={() => handleSelect(i)} className={`p-3 md:p-4 rounded-xl border text-left font-bold transition-all duration-300 flex justify-between items-center text-xs md:text-sm ${btnClass}`}>
                  <span className="pr-2">{opt}</span>
                  {status !== "IDLE" && isCorrect && <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 shrink-0" />}
                </button>
              )
            })}
          </div>

          {status === "WRONG" && (
            <div className="mt-5 md:mt-6 text-center animate-fade-in">
               <p className="text-rose-400 text-xs md:text-sm font-bold mb-2 md:mb-3">{isAs ? "ভুল। জৈৱ ৰসায়ন তত্ত্ব পুনৰীক্ষণ কৰক।" : "Incorrect. Review the organic chemistry theory."}</p>
               <button onClick={() => { setStatus("IDLE"); setSelectedOpt(null); }} className="text-slate-400 hover:text-white text-[10px] md:text-xs font-bold underline underline-offset-4 transition-colors">{isAs ? "পুনৰ চেষ্টা কৰক" : "Try Again"}</button>
            </div>
          )}

          {status === "CORRECT" && (
            <div className="mt-6 md:mt-8 text-center animate-fade-in">
               <div className="inline-flex items-center gap-1.5 md:gap-2 bg-emerald-500/20 text-emerald-400 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-emerald-500/50 font-black text-xs md:text-sm uppercase tracking-wide">
                 <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> {qIdx < exp.quiz.length - 1 ? (isAs ? "সঠিক! পৰৱৰ্তী লোড হৈছে..." : "Correct! Loading next...") : (isAs ? "যাচাই সম্পূৰ্ণ" : "Verification Complete")}
               </div>
            </div>
          )}
       </div>
    </div>
  );
}

// --- UTILS ---
function HUDCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-2 md:p-2.5 min-w-[90px] md:min-w-[140px] shadow-lg">
      <div className="text-[8px] md:text-[9px] uppercase font-black text-slate-500 tracking-widest mb-0.5">{label}</div>
      <div className={`text-[10px] md:text-sm font-black font-mono ${color} truncate`}>{value}</div>
    </div>
  );
}

function hexToRgb(hexOrRgba: string, alpha: number) {
  if (hexOrRgba.startsWith('rgba')) {
     return hexOrRgba.replace(/[\d.]+\)$/g, `${alpha})`);
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexOrRgba);
  return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : `rgba(0,0,0,${alpha})`;
}
