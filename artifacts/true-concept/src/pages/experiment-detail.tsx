import { useRoute, Link } from "wouter";
import { useGetExperiment, getGetExperimentQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Target, List, CheckCircle, Lightbulb } from "lucide-react";
import { lazy, Suspense } from "react";

const simComponents: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  "light-reflection": lazy(() => import("@/components/lab/LightReflection")),
  "light-refraction": lazy(() => import("@/components/lab/LightRefraction")),
  "electric-circuit": lazy(() => import("@/components/lab/ElectricCircuit")),
  "lens": lazy(() => import("@/components/lab/LensSim")),
  "magnet": lazy(() => import("@/components/lab/MagnetSim")),
};

function ProcedureList({ text }: { text: string }) {
  const steps = text.split("\n").filter((s) => s.trim());
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm text-foreground/90">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-semibold text-xs mt-0.5">
            {i + 1}
          </span>
          <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, "")}</span>
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-6 bg-muted rounded w-20 mb-4" />
        <div className="h-8 bg-muted rounded w-2/3 mb-6" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-muted-foreground">Experiment not found</p>
        <Link href="/virtual-lab">
          <button className="mt-4 text-primary text-sm hover:underline">Back to lab</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      {/* Back */}
      <Link href="/virtual-lab">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="button-back-lab">
          <ArrowLeft className="w-4 h-4" />
          Virtual Lab
        </button>
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {experiment.classLevel}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            experiment.difficulty === "easy" ? "bg-green-100 text-green-700" :
            experiment.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
          }`}>
            {experiment.difficulty}
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground" data-testid="heading-experiment">
          {experiment.title}
        </h1>
      </div>

      {/* Objective */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Objective</h2>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{experiment.objective}</p>
      </div>

      {/* Interactive Simulation */}
      {SimComponent && (
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <h2 className="font-semibold text-foreground mb-4">Interactive Simulation</h2>
          <Suspense fallback={<div className="h-48 bg-muted rounded-xl animate-pulse" />}>
            <SimComponent />
          </Suspense>
        </div>
      )}

      {/* Procedure */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <List className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Procedure</h2>
        </div>
        <ProcedureList text={experiment.procedure} />
      </div>

      {/* Expected Result */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <h2 className="font-semibold text-green-800">Expected Result</h2>
        </div>
        <p className="text-sm text-green-800/90 leading-relaxed">{experiment.expectedResult}</p>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-blue-800">Scientific Explanation</h2>
        </div>
        <p className="text-sm text-blue-800/90 leading-relaxed">{experiment.explanation}</p>
      </div>
    </div>
  );
}
