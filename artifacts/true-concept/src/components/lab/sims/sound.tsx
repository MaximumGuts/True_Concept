import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SimSlider, SimNumber, SimContainer, SimButton, useRafLoop } from "../sim-ui";

/* 20. Sound Wave */
export function SoundWaveSim() {
  const [freq, setFreq] = useState(2);
  const [amp, setAmp] = useState(30);
  const [phase, setPhase] = useState(0);
  useRafLoop(true, (dt) => setPhase((p) => p + dt * freq * 2));
  const w = 320, h = 100;
  const path = Array.from({ length: 80 }, (_, i) => {
    const x = (i / 79) * w;
    const y = h / 2 + Math.sin((i / 79) * Math.PI * 2 * freq + phase) * amp;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return (
    <SimContainer hint="Frequency = pitch (high vs low). Amplitude = loudness.">
      <SimSlider label="Frequency" value={freq} onChange={setFreq} min={1} max={8} step={0.5} unit=" Hz" color="#a855f7" />
      <SimSlider label="Amplitude" value={amp} onChange={setAmp} min={5} max={45} step={1} color="#f43f5e" />
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mt-2">
        <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="#94a3b8" strokeDasharray="2 3" />
        <path d={path} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </SimContainer>
  );
}

/* 21. Frequency and Pitch */
export function PitchSim() {
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

  const note = freq < 200 ? "Bass" : freq < 500 ? "Mid" : freq < 1500 ? "Treble" : "High";
  return (
    <SimContainer
      hint="Human hearing: 20 Hz to 20 000 Hz. Tap play and slide to hear the pitch change."
      controls={<SimButton onClick={toggle} color={playing ? "#dc2626" : "#10b981"} icon={playing ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}>{playing ? "Stop" : "Play"}</SimButton>}
    >
      <SimSlider label="Frequency" value={freq} onChange={setFreq} min={100} max={2000} step={20} unit=" Hz" color="#0ea5e9" />
      <div className="text-center my-3">
        <div className="text-3xl">🎵</div>
        <div className="text-sm font-black text-gray-700 mt-1">{note} • {freq} Hz</div>
      </div>
    </SimContainer>
  );
}

/* 22. Echo Simulation */
export function EchoSim() {
  const speed = 340; // m/s
  const [d, setD] = useState(50);
  const delay = (2 * d) / speed;
  const audible = delay >= 0.1;
  return (
    <SimContainer hint="Echo is heard only when reflected sound arrives ≥ 0.1 s after original. So minimum distance ≈ 17 m.">
      <SimSlider label="Distance to Wall" value={d} onChange={setD} min={5} max={500} step={5} unit=" m" color="#0ea5e9" />
      <svg viewBox="0 0 280 100" className="w-full bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl mt-2">
        <text x="10" y="60" fontSize="28">🧍</text>
        <rect x="250" y="20" width="20" height="70" fill="#475569" />
        <text x="247" y="15" fontSize="9" fill="#374151" fontWeight="700">Wall</text>
        {/* sound arrows */}
        <line x1="40" y1="50" x2={245} y2={50} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#sa1)" />
        <line x1={245} y1="65" x2={40} y2={65} stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#sa2)" />
        <text x="120" y="46" fontSize="9" fill="#a855f7" fontWeight="700">Sound →</text>
        <text x="120" y="80" fontSize="9" fill="#10b981" fontWeight="700">← Echo</text>
        <defs>
          <marker id="sa1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#a855f7" /></marker>
          <marker id="sa2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#10b981" /></marker>
        </defs>
      </svg>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <SimNumber label="Delay" value={delay} unit="s" color="#a855f7" precision={3} />
        <div className="liquid-inner rounded-2xl px-3 py-2.5 flex items-center justify-between">
          <span className="text-xs font-black text-gray-600 uppercase">Echo</span>
          <span className={`text-base font-black ${audible ? "text-emerald-700" : "text-rose-700"}`}>{audible ? "Heard ✓" : "No echo"}</span>
        </div>
      </div>
    </SimContainer>
  );
}
