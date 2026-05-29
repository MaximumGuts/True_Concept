import { Link } from "wouter";
import { ArrowLeft, Sparkles, BookOpen, FlaskConical, Brain } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 blob-bg space-y-6">
      <Link href="/">
        <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </Link>

      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, #b85535 0%, #da6b45 60%, #f5a584 100%)" }}
      >
        <div className="absolute top-2 right-4 text-[120px] opacity-15 leading-none pointer-events-none select-none">📚</div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> About
          </span>
          <h1 className="font-black text-2xl sm:text-3xl mb-1 tracking-tight">About TRUE CONCEPT</h1>
          <p className="text-white/90 font-medium text-sm">NCERT-aligned learning for Class IX &amp; X in Assam.</p>
        </div>
      </div>

      <div className="liquid-panel rounded-3xl p-6 sm:p-8 space-y-6 text-gray-800 dark:text-gray-200">
        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100 mb-2">Our mission</h2>
          <p className="text-sm leading-relaxed">
            TRUE CONCEPT helps Class IX and X students in Assam learn faster and revise smarter.
            Built around the NCERT and SEBA syllabi, the platform combines crisp notes, set-wise
            MCQ practice, Q&amp;A bundles, full-length question papers, and interactive virtual
            labs — all in English and Assamese.
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100 mb-3">What you get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="liquid-card rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 shadow-md"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="font-black text-sm">Notes &amp; MCQs</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                Chapter-wise notes, set-wise quizzes with explanations.
              </p>
            </div>
            <div className="liquid-card rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 shadow-md"
                style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)" }}>
                <FlaskConical className="w-5 h-5" />
              </div>
              <p className="font-black text-sm">Virtual Lab</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                Interactive Physics, Chemistry, and Biology experiments.
              </p>
            </div>
            <div className="liquid-card rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 shadow-md"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <Brain className="w-5 h-5" />
              </div>
              <p className="font-black text-sm">AI Mentor</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                Personalised study recommendations powered by Gemini.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100 mb-2">Who we serve</h2>
          <p className="text-sm leading-relaxed">
            Students preparing for SEBA / CBSE board exams in Class IX and X, with content
            available in both <strong>English</strong> and <strong>Assamese</strong>. The platform
            is free to use on the web, with optional ad-supported unlocks on the Android app.
          </p>
        </section>

        <section>
          <h2 className="font-black text-lg text-gray-900 dark:text-gray-100 mb-2">Contact</h2>
          <p className="text-sm leading-relaxed">
            Built and maintained by Manas Jyoti Boruah. For feedback, partnership, or support
            requests, email{" "}
            <a
              href="mailto:manasjyoti.boruah1@gmail.com"
              className="text-orange-700 dark:text-orange-300 font-black"
            >
              manasjyoti.boruah1@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="text-xs text-gray-500 dark:text-gray-400 font-semibold border-t border-white/10 pt-4">
          See also: <Link href="/privacy"><a className="text-orange-700 dark:text-orange-300 font-black">Privacy Policy</a></Link>.
        </section>
      </div>
    </div>
  );
}
