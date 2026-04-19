import { useState } from "react";
import { Link } from "wouter";
import { useGetExperiments, getGetExperimentsQueryKey } from "@workspace/api-client-react";

const experimentEmojis: Record<string, string> = {
  "light-reflection": "🪞", "light-refraction": "🌈", "electric-circuit": "⚡", "lens": "🔭", "magnet": "🧲", "custom": "🔬"
};

const expColors = [
  { grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.25)" },
  { grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.25)" },
  { grad: "linear-gradient(135deg, #8b5cf6, #a855f7)", glow: "rgba(168,85,247,0.25)" },
  { grad: "linear-gradient(135deg, #f43f5e, #fb7185)", glow: "rgba(244,63,94,0.25)" },
  { grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.25)" },
];

const diffBadge: Record<string, { text: string; style: React.CSSProperties }> = {
  easy: { text: "🟢 Easy", style: { background: "rgba(16,185,129,0.15)", color: "#059669" } },
  medium: { text: "🟡 Medium", style: { background: "rgba(245,158,11,0.15)", color: "#d97706" } },
  hard: { text: "🔴 Hard", style: { background: "rgba(244,63,94,0.15)", color: "#e11d48" } },
};

const CLASS_LEVELS = ["All", "Class IX", "Class X"];

export default function VirtualLabPage() {
  const [selectedClass, setSelectedClass] = useState("All");
  const { data: experiments, isLoading } = useGetExperiments(
    selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined,
    { query: { queryKey: getGetExperimentsQueryKey(selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined) } }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      {/* Header */}
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-8 text-white mb-8">
        <div className="absolute top-0 right-0 text-[160px] opacity-10 leading-none pointer-events-none">🔬</div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
        <div className="relative">
          <div className="text-4xl mb-3">🔬</div>
          <h1 className="font-black text-3xl sm:text-4xl mb-2" data-testid="heading-virtual-lab">Virtual Science Lab</h1>
          <p className="text-purple-300 font-bold text-lg">Do real experiments — no lab needed! 🚀</p>
        </div>
      </div>

      {/* Class Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
        {CLASS_LEVELS.map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
              selectedClass === cl ? "text-white shadow-lg scale-105" : "liquid-card text-gray-700 hover:scale-105"
            }`}
            style={selectedClass === cl ? { background: "linear-gradient(135deg, #047857, #065f46)" } : {}}
          >
            {cl === "All" ? "🌟 All" : cl === "Class IX" ? "📗 Class IX" : "📘 Class X"}
          </button>
        ))}
      </div>

      {/* Experiments Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-44 liquid-card rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {experiments?.map((exp, i) => {
            const emoji = experimentEmojis[exp.type] ?? "🔬";
            const col = expColors[i % expColors.length];
            const diff = diffBadge[exp.difficulty];
            return (
              <Link key={exp.id} href={`/virtual-lab/${exp.id}`}>
                <div
                  data-testid={`card-experiment-${exp.id}`}
                  className="group liquid-card rounded-3xl overflow-hidden card-hover"
                >
                  {/* Gradient top strip */}
                  <div className="h-2" style={{ background: col.grad }} />

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Icon */}
                      <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0"
                        style={{ background: col.grad }}>
                        <div className="absolute inset-0 rounded-2xl blur-md opacity-50" style={{ background: col.glow }} />
                        <span className="relative">{emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-gray-900 group-hover:text-purple-700 transition-colors leading-snug mb-1">
                          {exp.title}
                        </h3>
                        <div className="flex gap-2 flex-wrap items-center">
                          <span className="text-xs font-black liquid-inner text-gray-600 px-2.5 py-1 rounded-full">{exp.classLevel}</span>
                          <span className="text-xs font-black px-2.5 py-1 rounded-full" style={diff.style}>{diff.text}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 font-medium mb-4">{exp.objective}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Tap to start</span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                        <span className="text-white text-sm">▶</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {!isLoading && !experiments?.length && (
            <div className="col-span-2 liquid-panel rounded-3xl text-center py-16">
              <div className="text-5xl mb-3">🔬</div>
              <p className="font-black text-lg text-gray-900">No experiments for {selectedClass}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
