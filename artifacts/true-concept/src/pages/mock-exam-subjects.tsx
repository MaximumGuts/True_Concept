/**
 * Subject picker for Mock Exam — /practice/mock-exam-subjects?mode=...&class=...
 *
 * Fetches ALL subjects live from Firestore via useGetSubjects so admin-added
 * subjects appear automatically without any code change.
 * Shows "All Subjects" + each individual subject.
 * After selection → /practice/mock-exam?mode=...&class=...&subject=...
 */

import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ChevronRight, Layers } from "lucide-react";
import { useGetSubjects } from "@workspace/api-client-react";
import { useStudentPrefs } from "@/contexts/StudentPrefsContext";

/** Consistent color gradient per subject index */
const GRADS = [
  "linear-gradient(135deg, #3b82f6, #6366f1)",
  "linear-gradient(135deg, #14b8a6, #0d9488)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #ef4444, #dc2626)",
  "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #f97316, #ea580c)",
  "linear-gradient(135deg, #0ea5e9, #0284c7)",
];

const EMOJIS: Record<string, string> = {
  physics:     "⚡",
  chemistry:   "🧪",
  biology:     "🔬",
  mathematics: "📐",
  math:        "📐",
  maths:       "📐",
};

function getEmoji(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "");
  for (const [k, v] of Object.entries(EMOJIS)) {
    if (key.includes(k)) return v;
  }
  return "📚";
}

export default function MockExamSubjectsPage() {
  const [, setLocation] = useLocation();
  const searchStr = useSearch();
  const params    = useMemo(() => new URLSearchParams(searchStr), [searchStr]);
  const mode      = params.get("mode") ?? "practice";
  const classLevel = params.get("class") ?? "Class IX";
  const { prefs } = useStudentPrefs();
  const isAssamese = prefs?.medium === "Assamese";

  const { data: subjects, isLoading } = useGetSubjects();

  // Filter subjects to ones matching the student's class (or "Both").
  // New subjects added by admin are automatically included here.
  const filteredSubjects = (subjects ?? []).filter((s: any) =>
    !s.classLevel || s.classLevel === classLevel || s.classLevel === "Both",
  );

  const goToExam = (subjectId?: string) => {
    const url = new URLSearchParams({ mode, class: classLevel });
    if (subjectId) url.set("subject", subjectId);
    setLocation(`/practice/mock-exam?${url.toString()}`);
  };

  const L = {
    title:      isAssamese ? "বিষয় বাছক"             : "Choose Subject",
    subtitle:   isAssamese ? "কোনটো বিষয়ৰ পৰীক্ষা দিব?" : "Which subject do you want to practise?",
    allSubj:    isAssamese ? "সকলো বিষয়"              : "All Subjects",
    allDesc:    isAssamese ? "সকলো বিষয়ৰ পৰা ৫০টা প্ৰশ্ন" : "50 questions from all subjects",
    loading:    isAssamese ? "লোড হৈছে..."             : "Loading subjects...",
    noSubj:     isAssamese ? "কোনো বিষয় পোৱা নাই"     : "No subjects found",
    questions:  isAssamese ? "প্ৰশ্ন"                  : "questions",
    modeLabel:  mode === "strict"
      ? (isAssamese ? "কঠোৰ মোড · ১ ঘণ্টা"  : "Strict Mode · 1 hour")
      : (isAssamese ? "অভ্যাস মোড · সময় নাই" : "Practice Mode · No timer"),
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-8 space-y-5">
      {/* Back */}
      <button onClick={() => setLocation("/practice")}
        className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {isAssamese ? "পিছলৈ" : "Back"}
      </button>

      {/* Header */}
      <div>
        <h1 className="font-black text-2xl text-gray-900 dark:text-gray-100">{L.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mt-1">{L.subtitle}</p>
        <span className="inline-block mt-2 text-[10px] font-black px-2.5 py-1 rounded-full text-white"
          style={{ background: mode === "strict" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          {L.modeLabel}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 liquid-card rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {/* All Subjects card */}
          <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.99 }}
            onClick={() => goToExam(undefined)}
            className="liquid-card rounded-2xl p-4 cursor-pointer group flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 text-xl shadow-md"
              style={{ background: "linear-gradient(135deg, #da6b45, #b85535)" }}>
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base text-gray-900 dark:text-gray-100">{L.allSubj}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{L.allDesc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
          </motion.div>

          {/* Per-subject cards — auto-generated from live Firestore data */}
          {filteredSubjects.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm font-semibold py-8">{L.noSubj}</p>
          )}
          {filteredSubjects.map((subj: any, idx: number) => {
            const name  = isAssamese && subj.nameAssamese ? subj.nameAssamese : subj.name;
            const emoji = getEmoji(subj.name ?? "");
            const grad  = GRADS[idx % GRADS.length];
            return (
              <motion.div key={subj.id}
                whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.99 }}
                onClick={() => goToExam(subj.id)}
                className="liquid-card rounded-2xl p-4 cursor-pointer group flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 text-xl shadow-md"
                  style={{ background: grad }}>
                  <span>{emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-base text-gray-900 dark:text-gray-100">{name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    <BookOpen className="w-3 h-3 inline mr-1" />
                    {isAssamese ? "বিষয়-ভিত্তিক পৰীক্ষা" : "Subject-specific exam"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
