import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";
import { SimSlider, SimNumber, SimContainer, SimButton, SimGraph, StepMode, useRafLoop } from "../sim-ui";
import { useLanguage } from "@/contexts/LanguageContext";

/* 20. Sound Wave — Immersive Sound Physics Lab */

type SoundView = "transverse" | "longitudinal" | "circular" | "speaker";
type SoundGraph = "freq-time" | "amp-db" | "freq-pitch";

interface SoundSource {
  id: string;
  en: string;
  as: string;
  emoji: string;
  freq: number;
  amp: number;
  waveform: OscillatorType;
}

const SOUND_SOURCES: SoundSource[] = [
  { id: "speaker", en: "Speaker",      as: "স্পিকাৰ",       emoji: "🔊", freq: 440, amp: 35, waveform: "sine" },
  { id: "guitar",  en: "Guitar",       as: "গিটাৰ",         emoji: "🎸", freq: 220, amp: 30, waveform: "triangle" },
  { id: "fork",    en: "Tuning Fork",  as: "টিউনিং ফৰ্ক",   emoji: "🎼", freq: 512, amp: 18, waveform: "sine" },
  { id: "voice",   en: "Voice",        as: "মাত",           emoji: "🎤", freq: 200, amp: 28, waveform: "triangle" },
  { id: "bell",    en: "Bell",         as: "ঘণ্টা",          emoji: "🔔", freq: 800, amp: 22, waveform: "sawtooth" },
  { id: "drum",    en: "Drum",         as: "ঢোল",           emoji: "🥁", freq: 90,  amp: 45, waveform: "square" },
];

export function SoundWaveSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [view, setView] = useState<SoundView>("transverse");
  const [sourceId, setSourceId] = useState("speaker");
  const [freq, setFreq] = useState(440);
  const [amp, setAmp] = useState(35);
  const [waveSpeed, setWaveSpeed] = useState(343);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [phase, setPhase] = useState(0);
  const [graphMode, setGraphMode] = useState<SoundGraph>("freq-time");

  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const source = SOUND_SOURCES.find(s => s.id === sourceId) ?? SOUND_SOURCES[0];

  // Apply preset when source changes
  useEffect(() => {
    setFreq(source.freq);
    setAmp(source.amp);
    if (oscRef.current) oscRef.current.type = source.waveform;
  }, [sourceId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update live audio params
  useEffect(() => {
    if (oscRef.current && ctxRef.current && gainRef.current) {
      oscRef.current.frequency.setValueAtTime(freq, ctxRef.current.currentTime);
      gainRef.current.gain.setValueAtTime(isMuted ? 0 : (amp / 100) * 0.15, ctxRef.current.currentTime);
    }
  }, [freq, amp, isMuted]);

  // Cleanup on unmount
  useEffect(() => () => {
    try { oscRef.current?.stop(); } catch { /* noop */ }
    ctxRef.current?.close();
  }, []);

  // Animation loop
  useRafLoop(true, (dt) => {
    const rate = slowMo ? 0.15 : 1;
    setPhase(p => (p + dt * (1 + freq / 200) * rate * 3) % (Math.PI * 200));
  });

  const togglePlay = () => {
    if (isPlaying) {
      try { oscRef.current?.stop(); } catch { /* noop */ }
      oscRef.current = null;
      gainRef.current = null;
      setIsPlaying(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctx: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = ctxRef.current ?? new Ctx();
    ctxRef.current = ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = source.waveform;
    osc.frequency.value = freq;
    gain.gain.value = isMuted ? 0 : (amp / 100) * 0.15;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
    setIsPlaying(true);
  };

  // ─── Derived quantities ───
  const wavelength = waveSpeed / freq;
  const periodMs = 1000 / freq;
  const loudnessDb = Math.max(0, Math.round(20 + amp * 0.9));
  const pitchLabel = freq < 100   ? (isAs ? "অতি নিম্ন"      : "Very Low")
                   : freq < 300   ? (isAs ? "নিম্ন (Bass)"    : "Low (Bass)")
                   : freq < 800   ? (isAs ? "মধ্য"           : "Mid")
                   : freq < 2000  ? (isAs ? "তীক্ষ্ণ"         : "Treble")
                   :                (isAs ? "অতি তীক্ষ্ণ"     : "Very High");

  // ─── View renderers ───
  const W = 600, H = 200;

  const renderTransverse = () => {
    const cycles = Math.max(1, Math.min(8, freq / 100));
    const ampPx = amp * 1.3;
    const path = Array.from({ length: 200 }, (_, i) => {
      const x = (i / 199) * W;
      const y = H / 2 + Math.sin((i / 199) * Math.PI * 2 * cycles + phase) * ampPx;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1={H / 2 - ampPx} x2={W} y2={H / 2 - ampPx} stroke="#f0876644" strokeDasharray="2 6" />
        <line x1="0" y1={H / 2 + ampPx} x2={W} y2={H / 2 + ampPx} stroke="#f0876644" strokeDasharray="2 6" />
        <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#475569" strokeDasharray="2 4" />
        <path d={path} fill="none" stroke="#f08766" strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 6px #f0876688)" }} />
        <text x="10" y="18" fill="#f08766" fontSize="12" fontWeight="bold">
          {isAs ? "প্ৰস্থিক তৰংগ (চিত্ৰ)" : "Transverse Wave (representation)"}
        </text>
        <text x={W - 10} y="18" textAnchor="end" fill="#94a3b8" fontSize="11" fontWeight="bold">
          A = {amp}
        </text>
      </svg>
    );
  };

  const renderLongitudinal = () => {
    const cycles = Math.max(1, Math.min(6, freq / 150));
    const particles = Array.from({ length: 70 }, (_, i) => {
      const baseX = 20 + (i / 69) * (W - 40);
      const offset = Math.sin((i / 69) * Math.PI * 2 * cycles + phase) * (amp * 0.5);
      const density = Math.cos((i / 69) * Math.PI * 2 * cycles + phase);
      const isC = density > 0.3;
      const isR = density < -0.3;
      const color = isC
        ? `rgba(239, 68, 68, ${0.55 + density * 0.45})`
        : isR
          ? `rgba(56, 189, 248, ${0.5 + Math.abs(density) * 0.4})`
          : "rgba(203, 213, 225, 0.5)";
      return { x: baseX + offset, r: 3 + Math.max(0, density) * 2, color };
    });
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <text x="10" y="18" fill="#f08766" fontSize="12" fontWeight="bold">
          {isAs ? "অনুদৈৰ্ঘ্য তৰংগ — বায়ু অণু" : "Longitudinal Wave — Air Molecules"}
        </text>
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={H / 2} r={p.r} fill={p.color} />
        ))}
        <text x="10" y={H - 26} fill="#ef4444" fontSize="11" fontWeight="bold">
          ● {isAs ? "সংকোচন (C)" : "Compression (C)"}
        </text>
        <text x="10" y={H - 10} fill="#38bdf8" fontSize="11" fontWeight="bold">
          ● {isAs ? "প্ৰসাৰণ (R)" : "Rarefaction (R)"}
        </text>
      </svg>
    );
  };

  const renderCircular = () => {
    const cx = W / 2, cy = H / 2;
    const maxR = Math.min(W, H) * 0.45;
    const ringCount = 6;
    const spacing = maxR / ringCount;
    const offset = (phase * 8) % spacing;
    const rings = Array.from({ length: ringCount }, (_, i) => {
      const r = offset + i * spacing;
      const op = Math.max(0, 1 - r / maxR);
      return { r, op };
    });
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <text x="10" y="18" fill="#f08766" fontSize="12" fontWeight="bold">
          {isAs ? "বৃত্তীয় তৰংগ (3D প্ৰক্ষেপণ)" : "Circular Ripple (3D projection)"}
        </text>
        {rings.map((ring, i) => (
          <circle key={i} cx={cx} cy={cy} r={ring.r} fill="none"
                  stroke="#f08766" strokeWidth={2 + ring.op * 2.5} opacity={ring.op * 0.9} />
        ))}
        <circle cx={cx} cy={cy} r="18" fill="#f08766"
                style={{ filter: "drop-shadow(0 0 10px #f08766)" }} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="16">📢</text>
        <text x={cx} y={H - 12} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
          {isAs ? "তীব্ৰতা ∝ 1/r²" : "Intensity ∝ 1/r²"}
        </text>
      </svg>
    );
  };

  const renderSpeaker = () => {
    const speakerX = 90;
    const cone = Math.sin(phase * 2) * Math.min(14, amp * 0.35);
    const cycles = Math.max(1, Math.min(7, freq / 150));
    const particles = Array.from({ length: 55 }, (_, i) => {
      const baseX = speakerX + 40 + (i / 54) * (W - speakerX - 60);
      const offset = Math.sin((i / 54) * Math.PI * 2 * cycles + phase * 2) * (amp * 0.4);
      const density = Math.cos((i / 54) * Math.PI * 2 * cycles + phase * 2);
      const isC = density > 0.2;
      const color = isC
        ? `rgba(239, 68, 68, ${0.55 + density * 0.45})`
        : `rgba(148, 163, 184, ${0.35 + Math.abs(density) * 0.2})`;
      return { x: baseX + offset, r: 3 + Math.max(0, density) * 2.5, color };
    });
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <text x="10" y="18" fill="#f08766" fontSize="12" fontWeight="bold">
          {isAs ? "স্পিকাৰৰ পৰা শব্দ নিৰ্গমন" : "Speaker Emission"}
        </text>
        {/* Speaker box */}
        <rect x={speakerX - 40} y={H / 2 - 55} width="50" height="110" rx="6"
              fill="#1e293b" stroke="#475569" strokeWidth="2" />
        {/* Cone */}
        <ellipse cx={speakerX + cone} cy={H / 2} rx="22" ry="42"
                 fill="#334155" stroke="#64748b" strokeWidth="2" />
        <circle cx={speakerX + cone} cy={H / 2} r="11" fill="#0f172a" />
        {/* Particles */}
        {particles.map((p, i) => {
          const wobble = Math.sin(p.x / 30 + phase) * 8;
          return <circle key={i} cx={p.x} cy={H / 2 + wobble} r={p.r} fill={p.color} />;
        })}
      </svg>
    );
  };

  const renderView = () => {
    if (view === "transverse")   return renderTransverse();
    if (view === "longitudinal") return renderLongitudinal();
    if (view === "circular")     return renderCircular();
    return renderSpeaker();
  };

  // ─── Graph data ───
  const graphData = (() => {
    if (graphMode === "freq-time") {
      const cycles = Math.max(1, Math.min(6, freq / 200));
      const pts = Array.from({ length: 80 }, (_, i) => {
        const t = i / 79;
        const y = 0.5 + Math.sin(t * Math.PI * 2 * cycles + phase) * 0.45 * (amp / 60);
        return { x: t, y };
      });
      return { points: pts, xMax: 1, yMax: 1, color: "#34d399" };
    }
    if (graphMode === "amp-db") {
      const pts = Array.from({ length: 60 }, (_, i) => {
        const a = (i / 59) * 60;
        const db = 20 + a * 0.9;
        return { x: a, y: db };
      });
      return { points: pts, xMax: 60, yMax: 80, color: "#facc15" };
    }
    // freq-pitch (log)
    const pts = Array.from({ length: 60 }, (_, i) => {
      const f = 20 * Math.pow(100, i / 59);
      const norm = Math.log10(f / 20) / Math.log10(2000 / 20);
      return { x: f, y: norm };
    });
    return { points: pts, xMax: 2000, yMax: 1, color: "#a78bfa" };
  })();

  // ─── Labels ───
  const viewBtns: { id: SoundView; en: string; as: string }[] = [
    { id: "transverse",   en: "Transverse",   as: "প্ৰস্থিক" },
    { id: "longitudinal", en: "Longitudinal", as: "অনুদৈৰ্ঘ্য" },
    { id: "circular",     en: "Circular",     as: "বৃত্তীয়" },
    { id: "speaker",      en: "Speaker",      as: "স্পিকাৰ" },
  ];
  const graphBtns: { id: SoundGraph; en: string; as: string }[] = [
    { id: "freq-time",  en: "Wave (Y vs T)",  as: "তৰংগ (Y বনাম T)" },
    { id: "amp-db",     en: "Amp vs dB",      as: "বিস্তাৰ বনাম dB" },
    { id: "freq-pitch", en: "Freq vs Pitch",  as: "কম্পাঙ্ক বনাম স্বৰ" },
  ];

  const feedback = view === "longitudinal"
    ? (isAs
        ? "বায়ুৰ অণুবোৰ আগ-পাছ আন্দোলিত হয় — মাত্ৰ শক্তি আগবাঢ়ে, পদাৰ্থ নহয়। ৰঙা = সংকোচন, নীলা = প্ৰসাৰণ।"
        : "Air molecules oscillate back & forth — only energy travels, not matter. Red = compression, blue = rarefaction.")
    : view === "circular"
      ? (isAs
          ? "শব্দ উৎসৰ পৰা চাৰিওফালে বৃত্তাকাৰে বিস্তাৰিত হয়। দূৰ গ'লে তীব্ৰতা দূৰত্বৰ বৰ্গৰ ব্যস্তানুপাতে কমে।"
          : "Waves spread spherically from the source — intensity falls as 1/r² with distance.")
      : view === "speaker"
        ? (isAs
            ? `স্পিকাৰৰ কোণ ${freq} বাৰ প্ৰতিছেকেণ্ডত আগ-পাছ আন্দোলিত হৈ বায়ুক ঠেলি দিয়ে — সেইটোৱেই শব্দ।`
            : `The speaker cone vibrates ${freq} times per second, pushing air — that vibration IS the sound.`)
        : (isAs
            ? `${freq} Hz = ${pitchLabel} স্বৰ। তৰংগদৈৰ্ঘ্য λ = v/f = ${wavelength.toFixed(2)} m।`
            : `${freq} Hz = ${pitchLabel}. Wavelength λ = v/f = ${wavelength.toFixed(2)} m.`);

  return (
    <SimContainer
      onReset={() => {
        setView("transverse"); setSourceId("speaker");
        setFreq(440); setAmp(35); setWaveSpeed(343);
        setIsMuted(false); setSlowMo(false);
      }}
      hint={isAs
        ? "শব্দ এক অনুদৈৰ্ঘ্য যান্ত্ৰিক তৰংগ। দৃশ্য সলনি কৰি বুজি লওক বায়ুৰ মাজেৰে শক্তি কেনেকৈ প্ৰচাৰিত হয়।"
        : "Sound is a longitudinal mechanical wave. Switch views to see how energy travels through air."}
      controls={
        <div className="flex gap-2 flex-wrap">
          <SimButton
            onClick={togglePlay}
            color={isPlaying ? "#dc2626" : "#10b981"}
            icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isPlaying ? (isAs ? "বন্ধ" : "Stop") : (isAs ? "শুনক" : "Listen")}
          </SimButton>
          <SimButton
            onClick={() => setIsMuted(m => !m)}
            color={isMuted ? "#64748b" : "#0ea5e9"}
            icon={isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          >
            {isMuted ? (isAs ? "নীৰৱ" : "Muted") : (isAs ? "শব্দ চালু" : "Sound On")}
          </SimButton>
          <SimButton
            onClick={() => setSlowMo(s => !s)}
            color={slowMo ? "#f59e0b" : "#475569"}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {slowMo ? (isAs ? "ধীৰ গতি" : "Slow-mo") : (isAs ? "সাধাৰণ" : "Normal")}
          </SimButton>
        </div>
      }
    >
      {/* Source selector */}
      <div className="mb-3">
        <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
          {isAs ? "শব্দৰ উৎস" : "Sound Source"}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {SOUND_SOURCES.map(s => (
            <button
              key={s.id}
              onClick={() => setSourceId(s.id)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-bold transition-all ${
                sourceId === s.id
                  ? "bg-orange-500/25 border border-orange-400 text-orange-100"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{s.emoji}</span>
              {isAs ? s.as : s.en}
            </button>
          ))}
        </div>
      </div>

      {/* View selector */}
      <div className="mb-3">
        <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
          {isAs ? "দৃশ্যৰ ধৰণ" : "Visualization Mode"}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {viewBtns.map(b => (
            <button
              key={b.id}
              onClick={() => setView(b.id)}
              className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
                view === b.id
                  ? "bg-fuchsia-500/25 border border-fuchsia-400 text-fuchsia-100"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {isAs ? b.as : b.en}
            </button>
          ))}
        </div>
      </div>

      {/* Main visualization */}
      <div className="bg-[#020617] rounded-xl border border-white/10 mb-3 overflow-hidden">
        <div className="w-full h-[210px]">{renderView()}</div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <SimSlider label={isAs ? "কম্পাঙ্ক (f)" : "Frequency (f)"} value={freq} onChange={setFreq}
                   min={20} max={2000} step={10} unit=" Hz" color="#f08766" />
        <SimSlider label={isAs ? "বিস্তাৰ (A)" : "Amplitude (A)"} value={amp} onChange={setAmp}
                   min={5} max={60} step={1} color="#ef4444" />
        <SimSlider label={isAs ? "মাধ্যমৰ বেগ (v)" : "Medium Speed (v)"} value={waveSpeed} onChange={setWaveSpeed}
                   min={300} max={1500} step={10} unit=" m/s" color="#0ea5e9" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <SimNumber label={isAs ? "তৰংগদৈৰ্ঘ্য λ" : "Wavelength λ"} value={wavelength} unit=" m"  color="#a78bfa" precision={2} />
        <SimNumber label={isAs ? "পৰ্যায়কাল T"   : "Period T"}     value={periodMs}   unit=" ms" color="#facc15" precision={1} />
        <SimNumber label={isAs ? "ধ্বনি স্তৰ"     : "Loudness"}     value={loudnessDb} unit=" dB" color="#f97316" precision={0} />
        <div className="flex flex-col items-center justify-center p-2 bg-black/30 rounded-lg border border-white/10">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-wide">
            {isAs ? "স্বৰৰ মান" : "Pitch"}
          </span>
          <span className="text-xs font-bold text-emerald-300 text-center mt-0.5">{pitchLabel}</span>
        </div>
      </div>

      {/* Equation card */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-fuchsia-900/40 border border-indigo-400/30 rounded-xl p-3 mb-3 text-center">
        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-wider mb-1">
          {isAs ? "তৰংগ সমীকৰণ" : "Wave Equation"}
        </p>
        <p className="text-base sm:text-lg font-black text-white">
          v = f × λ <span className="text-gray-500 mx-1">⇒</span>{" "}
          <span className="text-fuchsia-300">{waveSpeed}</span>
          <span className="text-gray-500"> = </span>
          <span className="text-orange-300">{freq}</span>
          <span className="text-gray-500"> × </span>
          <span className="text-purple-300">{wavelength.toFixed(2)}</span>
          <span className="text-gray-400 text-xs ml-1">m/s</span>
        </p>
      </div>

      {/* Graph */}
      <div className="mb-3">
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {graphBtns.map(b => (
            <button
              key={b.id}
              onClick={() => setGraphMode(b.id)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                graphMode === b.id
                  ? "bg-emerald-500/25 border border-emerald-400 text-emerald-100"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {isAs ? b.as : b.en}
            </button>
          ))}
        </div>
        <SimGraph
          points={graphData.points}
          xMax={graphData.xMax}
          yMax={graphData.yMax}
          color={graphData.color}
          height={130}
        />
      </div>

      {/* Educational feedback */}
      <div className="bg-slate-900/70 border border-orange-500/30 p-3 rounded-xl mb-3">
        <p className="text-sm font-bold text-orange-100 leading-relaxed text-center">{feedback}</p>
      </div>

      {/* Walkthrough */}
      <StepMode
        steps={isAs ? [
          { title: "১. উৎস বাছনি কৰক",     body: "স্পিকাৰ, গিটাৰ, টিউনিং ফৰ্ক, মাত, ঘণ্টা বা ঢোলৰ পৰা যিকোনো এটা বাছনি কৰক। প্ৰতিটো উৎসৰ নিজস্ব আকাৰৰ তৰংগ থাকে।" },
          { title: "২. প্ৰকৃত শব্দ শুনক",   body: "'শুনক' বুটাম টিপি Web Audio দ্বাৰা নিৰ্মিত প্ৰকৃত টোন শুনক। কম্পাঙ্ক সলনি কৰিলে স্বৰ লগে লগে সলনি হ'ব।" },
          { title: "৩. দৃশ্যবোৰ চাওক",     body: "প্ৰস্থিক (চিত্ৰাঙ্কন), অনুদৈৰ্ঘ্য (প্ৰকৃত বায়ু অণু), বৃত্তীয় (3D বিস্তাৰ), আৰু স্পিকাৰ (শব্দ কেনেকৈ সৃষ্টি হয়) — প্ৰতিটো মোডত একে শব্দৰ বেলেগ ৰূপ দেখা যায়।" },
          { title: "৪. কম্পাঙ্ক বুজি লওক",  body: "কম্পাঙ্ক বঢ়ালে স্বৰ তীক্ষ্ণ (উচ্চ) হয়, কমালে গধুৰ (নিম্ন) হয়। মানৱ শ্ৰৱণ সীমা: 20 Hz – 20,000 Hz।" },
          { title: "৫. বিস্তাৰ আৰু ধ্বনি",  body: "বিস্তাৰ বঢ়ালে শব্দ ডাঙৰ (Loud) হয় — dB মান চাওক। 60 dB = সাধাৰণ কথোপকথন, 120 dB = বিপদজনক।" },
          { title: "৬. v = f × λ যাচাই",   body: "মাধ্যমৰ বেগ সলনি কৰি (বায়ু 343, পানী ~1480 m/s) চাওক λ কেনেকৈ সলনি হয়। সূত্ৰ সদায় সত্য থাকে।" },
        ] : [
          { title: "1. Pick a source",        body: "Choose Speaker, Guitar, Tuning Fork, Voice, Bell, or Drum. Each has its own characteristic waveform (sine, triangle, sawtooth, square)." },
          { title: "2. Hear the real tone",   body: "Tap 'Listen' to start the Web Audio oscillator. Move the frequency slider — the pitch you hear updates live." },
          { title: "3. Switch views",         body: "Transverse (representation), Longitudinal (real air molecules with C/R), Circular (3D spread), Speaker (how sound is born) — same wave, different windows." },
          { title: "4. Frequency = Pitch",    body: "Higher frequency → higher pitch. Lower → deeper. Human hearing: 20 Hz – 20,000 Hz." },
          { title: "5. Amplitude = Loudness", body: "Bigger amplitude → louder sound; watch the dB meter. 60 dB = conversation, 120 dB = harmful." },
          { title: "6. Verify v = f × λ",     body: "Change medium speed (air 343, water ~1480 m/s) and watch λ update. The equation always holds." },
        ]}
      />
    </SimContainer>
  );
}

/* 21. Frequency and Pitch (Web Audio oscillator) */
export function PitchSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [freq, setFreq] = useState(440);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => () => {
    try { oscRef.current?.stop(); } catch { /* noop */ }
    ctxRef.current?.close();
  }, []);

  useEffect(() => {
    if (oscRef.current && ctxRef.current) {
      oscRef.current.frequency.setValueAtTime(freq, ctxRef.current.currentTime);
    }
  }, [freq]);

  const toggle = () => {
    if (playing) {
      try { oscRef.current?.stop(); } catch { /* noop */ }
      oscRef.current = null;
      setPlaying(false);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctx: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = ctxRef.current ?? new Ctx();
      ctxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      osc.frequency.value = freq;
      osc.type = "sine";
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setPlaying(true);
    }
  };

  const noteEn = freq < 200 ? "Bass" : freq < 500 ? "Mid" : freq < 1500 ? "Treble" : "High";
  const noteAs = freq < 200 ? "নিম্ন" : freq < 500 ? "মধ্য" : freq < 1500 ? "তীক্ষ্ণ" : "উচ্চ";

  return (
    <SimContainer
      hint={isAs
        ? "মানৱ শ্ৰৱণ: ২০ Hz পৰা ২০,০০০ Hz। চালু কৰি স্লাইড কৰি স্বৰৰ পৰিৱৰ্তন শুনক।"
        : "Human hearing: 20 Hz to 20 000 Hz. Tap play and slide to hear the pitch change."}
      controls={
        <SimButton
          onClick={toggle}
          color={playing ? "#dc2626" : "#10b981"}
          icon={playing ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        >
          {playing ? (isAs ? "বন্ধ" : "Stop") : (isAs ? "চালু" : "Play")}
        </SimButton>
      }
    >
      <SimSlider label={isAs ? "কম্পাঙ্ক" : "Frequency"} value={freq} onChange={setFreq}
                 min={100} max={2000} step={20} unit=" Hz" color="#0ea5e9" />
      <div className="text-center my-3">
        <div className="text-3xl">🎵</div>
        <div className="text-sm font-black text-gray-700 dark:text-gray-200 mt-1">
          {isAs ? noteAs : noteEn} • {freq} Hz
        </div>
      </div>
    </SimContainer>
  );
}

/* 22. Echo Simulation — Animated wave propagation + real audio playback */
export function EchoSim() {
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const [d, setD] = useState(120);
  const [temp, setTemp] = useState(20);
  const speed = 331.4 + 0.6 * temp;
  const delay = (2 * d) / speed;
  const audible = delay >= 0.1;

  const [pulse, setPulse] = useState<{ active: boolean; start: number; dur: number }>({ active: false, start: 0, dur: 0 });
  const [now, setNow] = useState(0);

  useRafLoop(pulse.active, () => {
    setNow(performance.now());
    if (performance.now() - pulse.start > pulse.dur * 1000 + 1000) {
      setPulse((p) => ({ ...p, active: false }));
    }
  });

  const trigger = () => {
    setPulse({ active: true, start: performance.now(), dur: delay });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctx: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    // Original clap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
    // Echo (delayed clap, quieter as distance grows)
    if (d > 0) {
      const echoGain = Math.max(0.02, 0.4 - d / 1000);
      const echoT = ctx.currentTime + delay;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(400, echoT);
      osc2.frequency.exponentialRampToValueAtTime(80, echoT + 0.1);
      gain2.gain.setValueAtTime(0, echoT);
      gain2.gain.linearRampToValueAtTime(echoGain, echoT + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.01, echoT + 0.15);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(echoT);
      osc2.stop(echoT + 0.15);
    }
  };

  const wallX = 50 + (d / 500) * 300;

  const renderWave = () => {
    if (!pulse.active) return null;
    const elapsed = (now - pulse.start) / 1000;
    if (elapsed > pulse.dur) {
      // Post-return ring (impact ripple at the source)
      const over = elapsed - pulse.dur;
      if (over < 0.6) {
        const op = Math.max(0, 1 - over * 1.6);
        return <circle cx={50} cy={110} r={20 + over * 150} stroke="#10b981" strokeWidth={4} fill="none" opacity={op} />;
      }
      return null;
    }
    const half = pulse.dur / 2;
    if (elapsed > half) {
      // Returning wave (green)
      const prog = (elapsed - half) / half;
      const x = wallX - prog * (wallX - 50);
      return (
        <g>
          <path d={`M ${x} 60 Q ${x - 20} 110 ${x} 160`} fill="none" stroke="#10b981" strokeWidth={4}
                style={{ filter: "drop-shadow(0 0 8px #10b981)" }} />
          <path d={`M ${x + 12} 70 Q ${x - 5} 110 ${x + 12} 150`} fill="none" stroke="#10b981" strokeWidth={2} opacity={0.5} />
        </g>
      );
    }
    // Outgoing wave (blue)
    const prog = elapsed / half;
    const x = 50 + prog * (wallX - 50);
    return (
      <g>
        <path d={`M ${x} 60 Q ${x + 20} 110 ${x} 160`} fill="none" stroke="#38bdf8" strokeWidth={4}
              style={{ filter: "drop-shadow(0 0 8px #38bdf8)" }} />
        <path d={`M ${x - 12} 70 Q ${x + 5} 110 ${x - 12} 150`} fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.5} />
      </g>
    );
  };

  const preset = (which: "hall" | "cave" | "canyon") => {
    if (which === "hall")   { setD(15);  setTemp(25); }
    if (which === "cave")   { setD(120); setTemp(10); }
    if (which === "canyon") { setD(400); setTemp(20); }
  };

  const feedback = audible
    ? (isAs
        ? `দেৰি (${delay.toFixed(3)}s) ≥ 0.1s হোৱা বাবে, মানৱ মস্তিষ্কই এটা স্বতন্ত্ৰ প্ৰতিধ্বনি অনুভৱ কৰে!`
        : `Since the delay (${delay.toFixed(3)}s) is ≥ 0.1s, the human brain perceives a DISTINCT ECHO!`)
    : (isAs
        ? `দেৰি (${delay.toFixed(3)}s) < 0.1s হোৱা বাবে, প্ৰতিফলন মূল শব্দৰ সৈতে মিলি যায় (অনুৰণন)।`
        : `Since the delay (${delay.toFixed(3)}s) is < 0.1s, the reflection MERGES with the original sound (Reverberation).`);

  return (
    <SimContainer
      onReset={() => { setD(120); setTemp(20); }}
      hint={isAs
        ? "শব্দ প্ৰায় 343 m/s বেগেৰে যায়। প্ৰতিধ্বনি কেৱল তেতিয়াহে শোনা যায় যেতিয়া প্ৰতিফলনে ঘূৰি আহিবলৈ অনুন্যনে 0.1 ছেকেণ্ড লয়।"
        : "Sound travels at approx 343 m/s. An echo is only heard if the reflection takes at least 0.1 seconds to return."}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button onClick={() => preset("hall")} className="flex-1 bg-white/5 py-1.5 rounded text-xs font-bold text-gray-300 hover:bg-white/10 transition-colors">
              {isAs ? "হল প্ৰিছেট" : "Hall Preset"}
            </button>
            <button onClick={() => preset("cave")} className="flex-1 bg-white/5 py-1.5 rounded text-xs font-bold text-gray-300 hover:bg-white/10 transition-colors">
              {isAs ? "গুহা প্ৰিছেট" : "Cave Preset"}
            </button>
            <button onClick={() => preset("canyon")} className="flex-1 bg-white/5 py-1.5 rounded text-xs font-bold text-gray-300 hover:bg-white/10 transition-colors">
              {isAs ? "উপত্যকা প্ৰিছেট" : "Canyon Preset"}
            </button>
          </div>
          <SimSlider label={isAs ? "বেৰৰ দূৰত্ব (d)" : "Distance to Wall (d)"} value={d} onChange={setD}
                     min={5} max={500} step={1} unit=" m" color="#38bdf8" />
          <SimSlider label={isAs ? "বায়ুৰ উষ্ণতা (T)" : "Air Temperature (T)"} value={temp} onChange={setTemp}
                     min={-20} max={50} step={1} unit=" °C" color="#facc15" />
          <SimButton onClick={trigger} color="#ec4899" icon={<Volume2 className="w-4 h-4" />}>
            {isAs ? "শব্দ স্পন্দন ট্ৰিগাৰ কৰক" : "Trigger Sound Pulse"}
          </SimButton>
        </div>

        <div className="lg:col-span-2 bg-[#0f172a]/50 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <SimNumber label={isAs ? "বেগ (v)"          : "Speed (v)"}        value={speed} unit=" m/s" color="#facc15" precision={1} />
            <SimNumber label={isAs ? "মুঠ দূৰত্ব (2d)" : "Total Dist (2d)"}  value={2 * d} unit=" m"   color="#38bdf8" precision={0} />
            <SimNumber label={isAs ? "প্ৰতিধ্বনি দেৰি (t)" : "Echo Delay (t)"} value={delay} unit=" s" color="#ec4899" precision={3} />
            <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-lg border border-white/5">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-1">
                {isAs ? "মানৱ শ্ৰৱণ" : "Human Hearing"}
              </span>
              <span className={`text-sm font-bold ${audible ? "text-emerald-400" : "text-rose-400"}`}>
                {audible ? (isAs ? "প্ৰতিধ্বনি শোনা গ'ল" : "Echo Heard") : (isAs ? "মিলি গ'ল" : "Merged")}
              </span>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-400 mt-4 text-center">
            {isAs ? "সূত্ৰ: " : "Formula: "}<span className="text-fuchsia-400">t = 2d / v</span>
          </p>
        </div>
      </div>

      {/* SVG scene with wave propagation */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#020617] to-[#0f172a] touch-none mb-4 w-full h-[260px]">
        <svg viewBox="0 0 400 200" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
          {/* Distance scale */}
          <line x1="50"  y1="180" x2="350" y2="180" stroke="#334155" strokeWidth="2" />
          <line x1="50"  y1="175" x2="50"  y2="185" stroke="#334155" strokeWidth="2" />
          <line x1="350" y1="175" x2="350" y2="185" stroke="#334155" strokeWidth="2" />
          <text x="50"  y="195" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">0 m</text>
          <text x="350" y="195" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">500 m</text>
          <text x={Math.max(70, Math.min(330, wallX))} y="195" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">
            {d} m
          </text>

          {/* Wall */}
          <rect x={wallX - 5} y="40" width="10" height="140" fill="#475569" rx="2" />
          <path d={`M ${wallX + 5} 40 L ${wallX + 30} 10 L ${wallX + 30} 150 L ${wallX + 5} 180 Z`} fill="#334155" />

          {/* Stick figure (the listener / clapper) */}
          <circle cx="50" cy="100" r="12" fill="#94a3b8" />
          <line x1="50" y1="112" x2="50" y2="150" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="125" x2="35" y2="140" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="125" x2="65" y2="135" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="150" x2="40" y2="180" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="150" x2="60" y2="180" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />

          {/* Animated wave */}
          {renderWave()}
        </svg>
      </div>

      {/* Feedback */}
      <div className="w-full bg-slate-900 border border-emerald-500/30 p-3 mb-4 rounded-xl shadow-lg text-center">
        <p className="text-sm font-bold text-emerald-100 leading-relaxed">{feedback}</p>
      </div>
    </SimContainer>
  );
}
