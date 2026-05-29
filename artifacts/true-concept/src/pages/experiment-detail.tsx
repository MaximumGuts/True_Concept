import { useRoute, Link } from "wouter";
import { useGetExperiment, getGetExperimentQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { simRegistry, SIM_EMOJIS } from "@/components/lab/sim-registry";
import { useAuth } from "@/contexts/AuthContext";
import { markExperimentStarted, markExperimentCompleted } from "@/lib/progress";
import { tracker } from "@/lib/analytics/tracking-engine";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { EXPERIMENT_AS, pickExpField } from "@/i18n/experimentTranslations";
import UnlockGate from "@/ads/components/UnlockGate";

const diffBadgeStyle: Record<string, React.CSSProperties> = {
  easy:   { background: "rgba(16,185,129,0.15)", color: "#059669" },
  medium: { background: "rgba(245,158,11,0.15)", color: "#d97706" },
  hard:   { background: "rgba(244,63,94,0.15)", color: "#e11d48" },
};

const diffLabel: Record<string, { en: string; as: string }> = {
  easy:   { en: "🟢 Easy",   as: "🟢 সহজ" },
  medium: { en: "🟡 Medium", as: "🟡 মধ্যম" },
  hard:   { en: "🔴 Hard",   as: "🔴 কঠিন" },
};

const SUBJECT_AS: Record<string, string> = {
  Physics:   "পদাৰ্থ বিজ্ঞান",
  Chemistry: "ৰসায়ন",
  Biology:   "জীৱ বিজ্ঞান",
};

const CLASS_AS: Record<string, string> = {
  "Class IX": "নৱম শ্ৰেণী",
  "Class X":  "দশম শ্ৰেণী",
};

function SectionCard({ icon, title, children, tint }: { icon: string; title: string; children: React.ReactNode; tint?: string }) {
  return (
    <div className="liquid-card rounded-3xl p-5 mb-4" style={tint ? { background: tint } : undefined}>
      <h2 className="font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-base">{icon} {title}</h2>
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
            style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>{i + 1}</span>
          <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed pt-1">{step.replace(/^\d+[.)]\s*/, "")}</span>
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
        <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
          <span className="text-orange-500 font-black mt-0.5">•</span>
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
  const expId = params?.experimentId ?? "";
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [marked, setMarked] = useState(false);

  const { data: experiment, isLoading } = useGetExperiment(expId, {
    query: { enabled: !!expId, queryKey: getGetExperimentQueryKey(expId) },
  });

  // Log "started" once per experiment open — students can open any experiment
  // regardless of class, and every open is tracked.
  useEffect(() => {
    if (!user || user.role !== "student" || !experiment) return;
    void markExperimentStarted({
      uid: user.id,
      experimentId: expId,
      experimentTitle: experiment.title,
      subjectName: experiment.subject,
    });
    // Phase 7A: also feed the analytics tracker so the AI recommendation
    // engine sees lab activity in experimentMastery/{uid}/{experimentId}.
    const subjectId = String(experiment.subject ?? "unknown").toLowerCase();
    tracker.track({
      type: "experiment_started",
      uid: user.id,
      experimentId: expId,
      experimentTitle: experiment.title,
      subjectId,
      subjectName: experiment.subject,
      chapterId: null,
    });
  }, [user, experiment, expId]);

  const handleMarkDone = async () => {
    if (!user || user.role !== "student" || !experiment) return;
    await markExperimentCompleted({
      uid: user.id,
      experimentId: expId,
      experimentTitle: experiment.title,
      subjectName: experiment.subject,
    });
    const subjectId = String(experiment.subject ?? "unknown").toLowerCase();
    tracker.track({
      type: "experiment_completed",
      uid: user.id,
      experimentId: expId,
      experimentTitle: experiment.title,
      subjectId,
      subjectName: experiment.subject,
      chapterId: null,
      signal: "interaction",
    });
    setMarked(true);
  };

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
        <p className="font-black text-lg text-gray-900 dark:text-gray-100">
          {isAs ? "পৰীক্ষা পোৱা নগ'ল" : "Experiment not found"}
        </p>
        <Link href="/virtual-lab">
          <button className="mt-4 text-orange-600 dark:text-orange-400 font-bold text-sm hover:underline">
            {isAs ? "পৰীক্ষাগাৰলৈ উভতি যাওক" : "Back to lab"}
          </button>
        </Link>
      </div>
    );
  }

  const SimComponent = simRegistry[experiment.type] ?? null;
  const diffStyle = diffBadgeStyle[experiment.difficulty];
  const diffText = diffLabel[experiment.difficulty]
    ? (isAs ? diffLabel[experiment.difficulty].as : diffLabel[experiment.difficulty].en)
    : null;
  const emoji = SIM_EMOJIS[experiment.type] ?? "🔬";
  const ytId = youtubeId(experiment.videoUrl);

  const subjectLink = experiment.subject === "Chemistry" ? "/virtual-lab/chemistry" : "/virtual-lab/physics";
  const subjectLabel = isAs
    ? (experiment.subject === "Chemistry" ? "ৰসায়ন পৰীক্ষাগাৰ" : "পদাৰ্থ বিজ্ঞান পৰীক্ষাগাৰ")
    : (experiment.subject === "Chemistry" ? "Chemistry Lab" : "Physics Lab");

  const subjectChip = isAs ? (SUBJECT_AS[experiment.subject] ?? experiment.subject) : experiment.subject;
  const classChip = isAs ? (CLASS_AS[experiment.classLevel] ?? experiment.classLevel) : experiment.classLevel;

  // Frontend Assamese overlay for the Firestore-backed body content.
  // Falls back to the English string per-field if no translation is provided.
  const tr = EXPERIMENT_AS[experiment.type];
  const f = (en: string | undefined | null, field: keyof typeof EXPERIMENT_AS[string]) =>
    pickExpField(en, tr, field, lang);
  const titleText        = f(experiment.title,          "title");
  const objectiveText    = f(experiment.objective,      "objective");
  const theoryText       = f(experiment.theory,         "theory");
  const apparatusText    = f(experiment.apparatus,      "apparatus");
  const procedureText    = f(experiment.procedure,      "procedure");
  const expectedText     = f(experiment.expectedResult, "expectedResult");
  const explanationText  = f(experiment.explanation,    "explanation");
  const summaryText      = f(experiment.summary,        "summary");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <div className="flex items-center justify-between mb-6">
        <Link href={subjectLink}>
          <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors" data-testid="button-back-lab">
            <ArrowLeft className="w-4 h-4" /> {subjectLabel}
          </button>
        </Link>
        <LanguageToggle />
      </div>

      {/* Header */}
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-6 text-white mb-5">
        <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none pointer-events-none">{emoji}</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="liquid-inner text-white/80 text-xs font-black px-3 py-1.5 rounded-full">{subjectChip}</span>
            <span className="liquid-inner text-white/80 text-xs font-black px-3 py-1.5 rounded-full">{classChip}</span>
            {diffText && diffStyle && (
              <span className="text-xs font-black px-3 py-1.5 rounded-full" style={diffStyle}>{diffText}</span>
            )}
          </div>
          <h1 className="font-black text-2xl sm:text-3xl" data-testid="heading-experiment">
            {emoji} {titleText}
          </h1>
        </div>
      </div>

      {/* Objective */}
      <SectionCard icon="🎯" title={isAs ? "উদ্দেশ্য" : "Objective"}>
        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">{objectiveText}</p>
      </SectionCard>

      {/* Theory */}
      {theoryText && (
        <SectionCard icon="📚" title={isAs ? "তত্ত্ব" : "Theory"}>
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed whitespace-pre-line">{theoryText}</p>
        </SectionCard>
      )}

      {/* Apparatus */}
      {apparatusText && (
        <SectionCard icon="🧰" title={isAs ? "সঁজুলি" : "Apparatus"}>
          <BulletList text={apparatusText} />
        </SectionCard>
      )}

      {/* Procedure */}
      <SectionCard icon="📋" title={isAs ? "পদ্ধতি" : "Procedure"}>
        <NumberedList text={procedureText} />
      </SectionCard>

      {/* Simulation — gated so students can preview theory/procedure for free,
          but running the interactive sim requires unlocking the Lab feature
          (1 ad = 1 hour of unlimited sim access across every experiment). */}
      {SimComponent && (
        <div className="liquid-panel rounded-3xl p-4 sm:p-5 mb-4">
          <h2 className="font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 text-base">
            ⚗️ {isAs ? "ইন্টাৰেক্টিভ চিমুলেশ্যন" : "Interactive Simulation"}
          </h2>
          <UnlockGate feature="lab">
            <Suspense fallback={
              <div className="h-48 liquid-card rounded-2xl animate-pulse flex items-center justify-center text-3xl">🔬</div>
            }>
              <SimComponent />
            </Suspense>
          </UnlockGate>
        </div>
      )}

      {/* Expected Result */}
      <SectionCard icon="✅" title={isAs ? "প্ৰত্যাশিত ফলাফল" : "Expected Result"} tint="rgba(16,185,129,0.08)">
        <p className="text-sm text-emerald-900 dark:text-emerald-200/85 font-medium leading-relaxed whitespace-pre-line">{expectedText}</p>
      </SectionCard>

      {/* Explanation */}
      <SectionCard icon="💡" title={isAs ? "বৈজ্ঞানিক ব্যাখ্যা" : "Scientific Explanation"} tint="rgba(59,130,246,0.07)">
        <p className="text-sm text-blue-900 dark:text-blue-200/85 font-medium leading-relaxed whitespace-pre-line">{explanationText}</p>
      </SectionCard>

      {/* Video */}
      {ytId && (
        <SectionCard icon="🎬" title={isAs ? "ব্যাখ্যা ভিডিঅ'" : "Explanation Video"}>
          <div className="relative w-full pb-[56.25%] rounded-2xl overflow-hidden bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={titleText}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </SectionCard>
      )}

      {/* Concept Summary */}
      {summaryText && (
        <SectionCard icon="🧠" title={isAs ? "ধাৰণাৰ সাৰাংশ" : "Concept Summary"} tint="rgba(168,85,247,0.10)">
          <p className="text-sm text-orange-900 dark:text-orange-200/85 font-medium leading-relaxed whitespace-pre-line">{summaryText}</p>
        </SectionCard>
      )}

      {/* Mark as Done — only shown to logged-in students */}
      {user?.role === "student" && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleMarkDone}
            disabled={marked}
            data-testid="button-mark-done"
            className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-sm shadow-lg transition-all ${
              marked
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 cursor-default"
                : "text-white hover:opacity-90 active:scale-95"
            }`}
            style={!marked ? { background: "linear-gradient(135deg, #16a34a, #059669)" } : undefined}
          >
            <CheckCircle2 className="w-5 h-5" />
            {marked
              ? (isAs ? "পৰীক্ষা সম্পন্ন হ'ল!" : "Experiment Completed!")
              : (isAs ? "পৰীক্ষা সম্পন্ন বুলি চিহ্নিত কৰক" : "Mark Experiment as Done")}
          </button>
        </div>
      )}
    </div>
  );
}
