import { useRoute, Link } from "wouter";
import { useGetExperiment, getGetExperimentQueryKey } from "@workspace/api-client-react";
import { ArrowLeft } from "lucide-react";
import { lazy, Suspense } from "react";

const simComponents: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  "light-reflection": lazy(() => import("@/components/lab/LightReflection")),
  "light-refraction": lazy(() => import("@/components/lab/LightRefraction")),
  "electric-circuit": lazy(() => import("@/components/lab/ElectricCircuit")),
  "lens": lazy(() => import("@/components/lab/LensSim")),
  "magnet": lazy(() => import("@/components/lab/MagnetSim")),
};

const experimentEmojis: Record<string, string> = {
  "light-reflection": "🪞", "light-refraction": "🌈", "electric-circuit": "⚡", "lens": "🔭", "magnet": "🧲", "custom": "🔬"
};

const difficultyConfig: Record<string, { bg: string; text: string; emoji: string }> = {
  easy: { bg: "bg-emerald-100", text: "text-emerald-700", emoji: "🟢" },
  medium: { bg: "bg-amber-100", text: "text-amber-700", emoji: "🟡" },
  hard: { bg: "bg-red-100", text: "text-red-700", emoji: "🔴" },
};

function ProcedureList({ text }: { text: string }) {
  const steps = text.split("\n").filter((s) => s.trim());
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            {i + 1}
          </span>
          <span className="text-gray-700 font-medium leading-relaxed pt-1">{step.replace(/^\d+\.\s*/, "")}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ExperimentDetailPage() {
  const [, params] = useRoute("/virtual-lab/:experimentId");
  const expId = parseInt(params?.experimentId ?? "0", 10);

  const { data: experiment, isLoading } = useGetExperiment(expId, {
    query: { enabled: !!expId, queryKey: getGetExperimentQueryKey(expId) },
  });

  const SimComponent = experiment ? simComponents[experiment.type] : null;
  const diff = experiment ? difficultyConfig[experiment.difficulty] : null;
  const emoji = experiment ? (experimentEmojis[experiment.type] ?? "🔬") : "🔬";

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded-xl w-24" />
        <div className="h-36 bg-gray-100 rounded-3xl" />
        <div className="h-64 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <div className="text-5xl mb-3">🔍</div>
        <p className="font-black text-lg text-gray-900">Experiment not found</p>
        <Link href="/virtual-lab">
          <button className="mt-4 text-purple-600 font-bold text-sm hover:underline">Back to lab</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8">
      {/* Back */}
      <Link href="/virtual-lab">
        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-lab">
          <ArrowLeft className="w-4 h-4" />
          Virtual Lab
        </button>
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white mb-6"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)" }}>
        <div className="absolute top-0 right-0 text-[120px] opacity-15 leading-none">{emoji}</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full">{experiment.classLevel}</span>
            {diff && (
              <span className={`text-xs font-black px-3 py-1.5 rounded-full ${diff.bg} ${diff.text}`}>
                {diff.emoji} {experiment.difficulty}
              </span>
            )}
          </div>
          <h1 className="font-black text-2xl sm:text-3xl" data-testid="heading-experiment">
            {emoji} {experiment.title}
          </h1>
        </div>
      </div>

      {/* Objective */}
      <div className="bg-white border-2 border-blue-100 rounded-3xl p-5 mb-4">
        <h2 className="font-black text-gray-900 mb-2 flex items-center gap-2"><span>🎯</span> Objective</h2>
        <p className="text-sm text-gray-700 font-medium leading-relaxed">{experiment.objective}</p>
      </div>

      {/* Simulation */}
      {SimComponent && (
        <div className="bg-white border-2 border-purple-100 rounded-3xl p-5 mb-4">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <span>⚗️</span> Interactive Simulation
          </h2>
          <Suspense fallback={<div className="h-48 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-3xl">🔬</div>}>
            <SimComponent />
          </Suspense>
        </div>
      )}

      {/* Procedure */}
      <div className="bg-white border-2 border-amber-100 rounded-3xl p-5 mb-4">
        <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2"><span>📋</span> Procedure</h2>
        <ProcedureList text={experiment.procedure} />
      </div>

      {/* Expected Result */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 mb-4">
        <h2 className="font-black text-emerald-800 mb-2 flex items-center gap-2"><span>✅</span> Expected Result</h2>
        <p className="text-sm text-emerald-800/90 font-medium leading-relaxed">{experiment.expectedResult}</p>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-5">
        <h2 className="font-black text-blue-800 mb-2 flex items-center gap-2"><span>💡</span> Scientific Explanation</h2>
        <p className="text-sm text-blue-800/90 font-medium leading-relaxed">{experiment.explanation}</p>
      </div>
    </div>
  );
}
