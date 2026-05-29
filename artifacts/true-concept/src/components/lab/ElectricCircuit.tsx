import { useState } from "react";

export default function ElectricCircuitSim() {
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <div className="space-y-4" data-testid="circuit-sim">
      <div className="bg-[#0f1729] rounded-xl p-6 flex flex-col items-center">
        <svg viewBox="0 0 400 280" className="w-full max-w-md">
          {/* Wires */}
          <path d="M 80 60 L 320 60" stroke={switchOn ? "#fbbf24" : "#475569"} strokeWidth={switchOn ? "3" : "2"} fill="none" />
          <path d="M 320 60 L 320 220" stroke={switchOn ? "#fbbf24" : "#475569"} strokeWidth={switchOn ? "3" : "2"} fill="none" />
          <path d="M 320 220 L 80 220" stroke={switchOn ? "#fbbf24" : "#475569"} strokeWidth={switchOn ? "3" : "2"} fill="none" />
          <path d="M 80 220 L 80 60" stroke={switchOn ? "#fbbf24" : "#475569"} strokeWidth={switchOn ? "3" : "2"} fill="none" />

          {/* Battery (left side) */}
          <rect x={68} y={120} width={24} height={40} rx={4} fill="#1e3a8a" stroke="#60a5fa" strokeWidth={1.5} />
          <text x={80} y={136} fill="#93c5fd" fontSize={10} textAnchor="middle">+</text>
          <text x={80} y={154} fill="#93c5fd" fontSize={10} textAnchor="middle">-</text>
          <text x={80} y={175} fill="#94a3b8" fontSize={9} textAnchor="middle">6V</text>

          {/* Switch (top) */}
          <circle cx={160} cy={60} r={5} fill={switchOn ? "#34d399" : "#475569"} />
          <circle cx={200} cy={60} r={5} fill={switchOn ? "#34d399" : "#475569"} />
          {switchOn ? (
            <line x1={160} y1={60} x2={200} y2={60} stroke="#34d399" strokeWidth={3} />
          ) : (
            <line x1={160} y1={60} x2={195} y2={45} stroke="#94a3b8" strokeWidth={2} />
          )}
          <text x={180} y={45} fill="#94a3b8" fontSize={9} textAnchor="middle">Switch</text>

          {/* Bulb (right side) */}
          <circle cx={320} cy={140} r={25} fill={switchOn ? "rgba(251,191,36,0.15)" : "rgba(71,85,105,0.2)"} stroke={switchOn ? "#fbbf24" : "#475569"} strokeWidth={2} />
          {switchOn && (
            <>
              <circle cx={320} cy={140} r={25} fill="rgba(251,191,36,0.05)" stroke="#fbbf24" strokeWidth={1}>
                <animate attributeName="r" values="25;30;25" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          {/* Filament */}
          <path d="M 312 140 Q 316 133 320 140 Q 324 147 328 140" fill="none" stroke={switchOn ? "#fbbf24" : "#475569"} strokeWidth={2} />
          <text x={320} y={180} fill="#94a3b8" fontSize={9} textAnchor="middle">Bulb</text>
          {switchOn && <text x={320} y={195} fill="#fbbf24" fontSize={9} textAnchor="middle">ON</text>}

          {/* Resistor (bottom) */}
          <path d="M 180 220 L 190 220 L 192 212 L 196 228 L 200 212 L 204 228 L 208 212 L 212 228 L 216 212 L 220 228 L 222 220 L 230 220" fill="none" stroke={switchOn ? "#fbbf24" : "#475569"} strokeWidth={2} />
          <text x={205} y={240} fill="#94a3b8" fontSize={9} textAnchor="middle">10Ω Resistor</text>

          {/* Current flow arrows when on */}
          {switchOn && (
            <>
              <polygon points="240,58 250,54 250,62" fill="#34d399" opacity={0.8}>
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
              </polygon>
              <polygon points="322,170 318,180 326,180" fill="#34d399" opacity={0.8}>
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.3s" />
              </polygon>
              <polygon points="160,222 150,218 150,226" fill="#34d399" opacity={0.8}>
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.6s" />
              </polygon>
            </>
          )}

          {/* Labels */}
          <text x={80} y={110} fill="#60a5fa" fontSize={9} textAnchor="middle">Battery</text>
        </svg>

        <button
          onClick={() => setSwitchOn(!switchOn)}
          data-testid="button-toggle-switch"
          className={`mt-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            switchOn
              ? "bg-[hsl(45,93%,47%)] text-[hsl(222,47%,11%)] shadow-lg shadow-amber-500/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {switchOn ? "Switch OFF" : "Switch ON"}
        </button>

        {switchOn && (
          <div className="mt-3 bg-[hsl(45,93%,47%)]/10 rounded-lg px-4 py-2 text-center">
            <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">Circuit closed — Current flowing!</p>
            <p className="text-xs text-muted-foreground mt-0.5">V=6V, R=10Ω, I = V/R = 0.6 A (Ohm's Law)</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Toggle the switch to open/close the circuit. When closed, current flows and the bulb lights up.
      </p>
    </div>
  );
}
