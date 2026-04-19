import { useRoute, Link } from "wouter";
import { useGetExperiment, getGetExperimentQueryKey } from "@workspace/api-client-react";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { simRegistry, SIM_EMOJIS } from "@/components/lab/sim-registry";

const diffBadge: Record<string, { text: string; style: React.CSSProperties }> = {
  easy: { text: "🟢 Easy", style: { background: "rgba(16,185,129,0.15)", color: "#059669" } },
  medium: { text: "🟡 Medium", style: { background: "rgba(245,158,11,0.15)", color: "#d97706" } },
  hard: { text: "🔴 Hard", style: { background: "rgba(244,63,94,0.15)", color: "#e11d48" } },
};

function SectionCard({ icon, title, children, tint }: { icon: string; title: string; children: React.ReactNode; tint?: string }) {
  return (
    <div className="liquid-card rounded-3xl p-5 mb-4" style={tint ? { background: tint } : undefined}>
      <h2 className="font-black text-gray-900 mb-3 flex items-center gap-2 text-base">{icon} {title}</h2>
      {children}
    </div>
  );
}

function NumberedList({ text }: { text: string }) {
  const steps = text.split("\n").map((s) => s.trim()).filter(Boolean);
  return (
    <ol className="space-y-2.5">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5 shadow-md"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>{i + 1}</span>
          <span className="text-gray-700 font-medium leading-relaxed pt-1">{step.replace(/^\d+[.)]\s*/, "")}</span>
        </li>
      ))}
    </ol>
  );
}

function BulletList({ text }: { text: string }) {
  const items = text.split("\n").map((s) => s.trim()).filter(Boolean);
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-700 font-medium leading-relaxed">
          <span className="text-purple-500 font-black mt-0.5">•</span>
          <span>{item.replace(/^[-•*]\s*/, "")}</span>
        </li>
      ))}
    </ul>
  );
}

function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return m ? m[1] : (url.length === 11 ? url : null);
}

export default function ExperimentDetailPage() {
  const [, params] = useRoute("/virtual-lab/:experimentId");
  const expId = parseInt(params?.experimentId ?? "0", 10);

  const { data: experiment, isLoading } = useGetExperiment(expId, {
    query: { enabled: !!expId, queryKey: getGetExperimentQueryKey(expId) },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse blob-bg space-y-4">
        <div className="h-6 liquid-card rounded-xl w-24" />
        <div className="h-36 liquid-dark rounded-3xl" />
        <div className="h-64 liquid-card rounded-3xl" />
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <div className="text-5xl mb-3">🔍</div>
        <p className="font-black text-lg text-gray-900">Experiment not found</p>
        <Link href="/virtual-lab"><button className="mt-4 text-purple-600 font-bold text-sm hover:underline">Back to lab</button></Link>
      </div>
    );
  }

  const SimComponent = simRegistry[experiment.type] ?? null;
  const diff = diffBadge[experiment.difficulty];
  const emoji = SIM_EMOJIS[experiment.type] ?? "🔬";
  const ytId = youtubeId(experiment.videoUrl);
  const subjectLink = experiment.subject === "Chemistry" ? "/virtual-lab/chemistry" : "/virtual-lab/physics";
  const subjectLabel = experiment.subject === "Chemistry" ? "Chemistry Lab" : "Physics Lab";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <Link href={subjectLink}>
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-purple-700 mb-6 transition-colors" data-testid="button-back-lab">
          <ArrowLeft className="w-4 h-4" /> {subjectLabel}
        </button>
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-6 text-white mb-5">
        <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none pointer-events-none">{emoji}</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="liquid-inner text-white/80 text-xs font-black px-3 py-1.5 rounded-full">{experiment.subject}</span>
            <span className="liquid-inner text-white/80 text-xs font-black px-3 py-1.5 rounded-full">{experiment.classLevel}</span>
            {diff && <span className="text-xs font-black px-3 py-1.5 rounded-full" style={diff.style}>{diff.text}</span>}
          </div>
          <h1 className="font-black text-2xl sm:text-3xl" data-testid="heading-experiment">
            {emoji} {experiment.title}
          </h1>
        </div>
      </div>

      {/* Objective */}
      <SectionCard icon="🎯" title="Objective">
        <p className="text-sm text-gray-700 font-medium leading-relaxed">{experiment.objective}</p>
      </SectionCard>

      {/* Theory */}
      {experiment.theory && (
        <SectionCard icon="📚" title="Theory">
          <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line">{experiment.theory}</p>
        </SectionCard>
      )}

      {/* Apparatus */}
      {experiment.apparatus && (
        <SectionCard icon="🧰" title="Apparatus">
          <BulletList text={experiment.apparatus} />
        </SectionCard>
      )}

      {/* Procedure */}
      <SectionCard icon="📋" title="Procedure">
        <NumberedList text={experiment.procedure} />
      </SectionCard>

      {/* Simulation */}
      {SimComponent && (
        <div className="liquid-panel rounded-3xl p-4 sm:p-5 mb-4">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-base">⚗️ Interactive Simulation</h2>
          <Suspense fallback={
            <div className="h-48 liquid-card rounded-2xl animate-pulse flex items-center justify-center text-3xl">🔬</div>
          }>
            <SimComponent />
          </Suspense>
        </div>
      )}

      {/* Expected Result */}
      <SectionCard icon="✅" title="Expected Result" tint="rgba(16,185,129,0.08)">
        <p className="text-sm text-emerald-900/85 font-medium leading-relaxed whitespace-pre-line">{experiment.expectedResult}</p>
      </SectionCard>

      {/* Explanation */}
      <SectionCard icon="💡" title="Scientific Explanation" tint="rgba(59,130,246,0.07)">
        <p className="text-sm text-blue-900/85 font-medium leading-relaxed whitespace-pre-line">{experiment.explanation}</p>
      </SectionCard>

      {/* Video */}
      {ytId && (
        <SectionCard icon="🎬" title="Explanation Video">
          <div className="relative w-full pb-[56.25%] rounded-2xl overflow-hidden bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={experiment.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </SectionCard>
      )}

      {/* Concept Summary */}
      {experiment.summary && (
        <SectionCard icon="🧠" title="Concept Summary" tint="rgba(168,85,247,0.10)">
          <p className="text-sm text-purple-900/85 font-medium leading-relaxed whitespace-pre-line">{experiment.summary}</p>
        </SectionCard>
      )}
    </div>
  );
}
