import { useState, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useGetExperiments, getGetExperimentsQueryKey } from "@workspace/api-client-react";
import { SIM_EMOJIS } from "@/components/lab/sim-registry";

const diffBadge: Record<string, { text: string; style: React.CSSProperties }> = {
  easy: { text: "🟢 Easy", style: { background: "rgba(16,185,129,0.15)", color: "#059669" } },
  medium: { text: "🟡 Medium", style: { background: "rgba(245,158,11,0.15)", color: "#d97706" } },
  hard: { text: "🔴 Hard", style: { background: "rgba(244,63,94,0.15)", color: "#e11d48" } },
};

const expColors = [
  { grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.25)" },
  { grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.25)" },
  { grad: "linear-gradient(135deg, #8b5cf6, #a855f7)", glow: "rgba(168,85,247,0.25)" },
  { grad: "linear-gradient(135deg, #f43f5e, #fb7185)", glow: "rgba(244,63,94,0.25)" },
  { grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.25)" },
];

const CLASS_LEVELS = ["All", "Class IX", "Class X"];

export default function VirtualLabPage() {
  const [, params] = useRoute("/virtual-lab/:subject");
  const subjectParam = params?.subject;
  // If the param is a number, this is the experiment-detail route — let that page handle it
  const isSubjectRoute = subjectParam === "physics" || subjectParam === "chemistry";

  if (isSubjectRoute) {
    return <SubjectLabPage subject={subjectParam === "physics" ? "Physics" : "Chemistry"} />;
  }

  return <LabHomePage />;
}

function LabHomePage() {
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
          <p className="text-purple-300 font-bold text-lg">Choose your lab and start experimenting!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { id: "physics", name: "Physics Lab", emoji: "⚛️", desc: "Motion, energy, light, electricity & sound", grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.4)" },
          { id: "chemistry", name: "Chemistry Lab", emoji: "🧪", desc: "Mixtures, crystallization & pH testing", grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.4)" },
        ].map((lab) => (
          <Link key={lab.id} href={`/virtual-lab/${lab.id}`}>
            <div data-testid={`card-lab-${lab.id}`} className="group liquid-card rounded-3xl p-7 card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-40 -translate-y-12 translate-x-12" style={{ background: lab.glow }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4" style={{ background: lab.grad }}>
                  {lab.emoji}
                </div>
                <h3 className="font-black text-2xl text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">{lab.name}</h3>
                <p className="text-sm text-gray-600 font-medium">{lab.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-purple-700">
                  Open Lab <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SubjectLabPage({ subject }: { subject: "Physics" | "Chemistry" }) {
  const [selectedClass, setSelectedClass] = useState("All");
  const { data: allExperiments, isLoading } = useGetExperiments(
    selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined,
    { query: { queryKey: getGetExperimentsQueryKey(selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined) } }
  );

  const experiments = useMemo(
    () => allExperiments?.filter((e) => e.subject === subject) ?? [],
    [allExperiments, subject]
  );

  const heroGrad = subject === "Physics"
    ? "linear-gradient(135deg, #1e3a8a, #4338ca)"
    : "linear-gradient(135deg, #064e3b, #115e59)";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <Link href="/virtual-lab">
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-virtual-lab">
          <ArrowLeft className="w-4 h-4" /> Virtual Lab
        </button>
      </Link>

      <div className="relative overflow-hidden rounded-3xl p-7 text-white mb-6 shadow-xl" style={{ background: heroGrad }}>
        <div className="absolute top-0 right-0 text-[140px] opacity-10 leading-none pointer-events-none">{subject === "Physics" ? "⚛️" : "🧪"}</div>
        <div className="relative">
          <div className="text-3xl mb-2">{subject === "Physics" ? "⚛️" : "🧪"}</div>
          <h1 className="font-black text-3xl sm:text-4xl mb-2" data-testid="heading-subject-lab">{subject} Lab</h1>
          <p className="text-white/80 font-bold">{experiments.length} interactive experiment{experiments.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Class Filter */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {CLASS_LEVELS.map((cl) => (
          <button
            key={cl}
            onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-5 py-2 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
              selectedClass === cl ? "text-white shadow-lg scale-105" : "liquid-card text-gray-700 hover:scale-105"
            }`}
            style={selectedClass === cl ? { background: heroGrad } : {}}
          >
            {cl === "All" ? "🌟 All" : cl === "Class IX" ? "📗 Class IX" : "📘 Class X"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 liquid-card rounded-3xl animate-pulse" />)}
        </div>
      ) : experiments.length === 0 ? (
        <div className="liquid-panel rounded-3xl text-center py-16">
          <div className="text-5xl mb-3">🔬</div>
          <p className="font-black text-lg text-gray-900">No experiments yet for {selectedClass} in {subject}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experiments.map((exp, i) => {
            const emoji = SIM_EMOJIS[exp.type] ?? "🔬";
            const col = expColors[i % expColors.length];
            const diff = diffBadge[exp.difficulty];
            return (
              <Link key={exp.id} href={`/virtual-lab/${exp.id}`} className="block">
                <div data-testid={`card-experiment-${exp.id}`} className="group liquid-card rounded-3xl overflow-hidden card-hover h-full">
                  <div className="h-2" style={{ background: col.grad }} />
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg shrink-0" style={{ background: col.grad }}>
                        <div className="absolute inset-0 rounded-2xl blur-md opacity-50" style={{ background: col.glow }} />
                        <span className="relative">{emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 group-hover:text-purple-700 transition-colors leading-snug">{exp.title}</h3>
                        <div className="flex gap-1.5 flex-wrap items-center mt-1">
                          <span className="text-[10px] font-black liquid-inner text-gray-600 px-2 py-0.5 rounded-full">{exp.classLevel}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={diff.style}>{diff.text}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 font-medium mb-3">{exp.objective}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Tap to start</span>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform" style={{ background: col.grad }}>
                        <span className="text-white text-xs">▶</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
