import { useState } from "react";
import { Link } from "wouter";
import { useGetExperiments, getGetExperimentsQueryKey } from "@workspace/api-client-react";

const experimentEmojis: Record<string, string> = {
  "light-reflection": "🪞",
  "light-refraction": "🌈",
  "electric-circuit": "⚡",
  "lens": "🔭",
  "magnet": "🧲",
  "custom": "🔬",
};

const difficultyConfig: Record<string, { label: string; bg: string; text: string; emoji: string }> = {
  easy: { label: "Easy", bg: "bg-emerald-100", text: "text-emerald-700", emoji: "🟢" },
  medium: { label: "Medium", bg: "bg-amber-100", text: "text-amber-700", emoji: "🟡" },
  hard: { label: "Hard", bg: "bg-red-100", text: "text-red-700", emoji: "🔴" },
};

const cardGradients = [
  "from-blue-400 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-purple-400 to-violet-600",
  "from-rose-400 to-pink-600",
  "from-orange-400 to-amber-600",
];

const CLASS_LEVELS = ["All", "Class IX", "Class X"];

export default function VirtualLabPage() {
  const [selectedClass, setSelectedClass] = useState("All");
  const { data: experiments, isLoading } = useGetExperiments(
    selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined,
    { query: { queryKey: getGetExperimentsQueryKey(selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined) } }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white mb-8"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 70%, #10b981 100%)" }}>
        <div className="absolute top-0 right-0 text-[160px] opacity-10 leading-none">🔬</div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 blur-2xl"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
        <div className="relative">
          <div className="text-4xl mb-3">🔬</div>
          <h1 className="font-black text-3xl sm:text-4xl mb-2" data-testid="heading-virtual-lab">
            Virtual Science Lab
          </h1>
          <p className="text-emerald-200 font-semibold text-lg">
            Do real science experiments — no lab needed! Just click and explore. 🚀
          </p>
        </div>
      </div>

      {/* Class Filter */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {CLASS_LEVELS.map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 ${
              selectedClass === cl
                ? "text-white border-transparent shadow-lg scale-105"
                : "bg-white border-gray-200 text-gray-600 hover:border-emerald-200"
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
          {[1,2,3,4].map(i => <div key={i} className="h-44 bg-gray-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {experiments?.map((exp, i) => {
            const emoji = experimentEmojis[exp.type] ?? "🔬";
            const diff = difficultyConfig[exp.difficulty];
            const grad = cardGradients[i % cardGradients.length];
            return (
              <Link key={exp.id} href={`/virtual-lab/${exp.id}`}>
                <div
                  data-testid={`card-experiment-${exp.id}`}
                  className="group bg-white border-2 border-gray-100 rounded-3xl overflow-hidden cursor-pointer card-hover shadow-sm"
                >
                  <div className={`bg-gradient-to-r ${grad} p-5 flex items-center gap-4`}>
                    <div className="text-5xl">{emoji}</div>
                    <div className="flex-1 text-white">
                      <h3 className="font-black text-lg leading-tight">{exp.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/80 text-xs font-bold">{exp.classLevel}</span>
                        <span className="text-white/50">·</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
                          {diff.emoji} {diff.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 line-clamp-2 font-medium">{exp.objective}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Tap to start experiment</span>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: `linear-gradient(135deg, ${grad.includes('blue') ? '#3b82f6' : grad.includes('emerald') ? '#10b981' : grad.includes('purple') ? '#7c3aed' : grad.includes('rose') ? '#f43f5e' : '#f59e0b'}, transparent)`, background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                        <span className="text-white text-xs">▶</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {!isLoading && !experiments?.length && (
            <div className="col-span-2 text-center py-16 bg-white rounded-3xl border-2 border-gray-100">
              <div className="text-5xl mb-3">🔬</div>
              <p className="font-black text-lg text-gray-900">No experiments for {selectedClass}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
