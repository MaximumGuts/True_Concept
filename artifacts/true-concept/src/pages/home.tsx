import { Link } from "wouter";
import { useGetSubjects } from "@workspace/api-client-react";
import { BookOpen, Sparkles } from "lucide-react";

const subjectColors = [
  { grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.3)", badge: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.3)", badge: "linear-gradient(135deg, #10b981, #14b8a6)" },
  { grad: "linear-gradient(135deg, #8b5cf6, #a855f7)", glow: "rgba(168,85,247,0.3)", badge: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { grad: "linear-gradient(135deg, #f43f5e, #fb7185)", glow: "rgba(244,63,94,0.3)", badge: "linear-gradient(135deg, #f43f5e, #fb7185)" },
  { grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.3)", badge: "linear-gradient(135deg, #f59e0b, #f97316)" },
];

const subjectEmojis = ["🔢", "🔬", "📐", "📖", "🧬"];

const features = [
  { icon: "📝", title: "Smart Notes", desc: "Chapter-wise notes that are easy to read and remember", grad: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { icon: "🎯", title: "MCQ Practice", desc: "Test yourself with instant feedback and explanations", grad: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { icon: "🎬", title: "Video Lessons", desc: "Expert video explanations for every chapter", grad: "linear-gradient(135deg, #f43f5e, #fb7185)" },
  { icon: "🔬", title: "Virtual Lab", desc: "Do science experiments from your screen!", grad: "linear-gradient(135deg, #10b981, #14b8a6)" },
  { icon: "❓", title: "Q&A Bank", desc: "Important exam questions with step-by-step answers", grad: "linear-gradient(135deg, #f59e0b, #f97316)" },
  { icon: "📊", title: "Track Progress", desc: "See how much you've studied and how well you're doing", grad: "linear-gradient(135deg, #ec4899, #f43f5e)" },
];

const stats = [
  { value: "14+", label: "Chapters", emoji: "📚" },
  { value: "100+", label: "MCQs", emoji: "✅" },
  { value: "5", label: "Lab Sims", emoji: "🔬" },
  { value: "2", label: "Boards", emoji: "🏆" },
];

export default function HomePage() {
  const { data: subjects } = useGetSubjects();

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative bg-hero text-white py-20 lg:py-32 px-4 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold liquid-dark">
            <span>🎓</span>
            <span className="text-yellow-300">SEBA & CBSE Board — Class IX & X</span>
            <span>✨</span>
          </div>

          <h1 className="font-black text-5xl sm:text-6xl lg:text-7xl leading-tight mb-4" data-testid="heading-hero">
            <span className="block text-white">Learn Smarter,</span>
            <span className="block" style={{
              background: "linear-gradient(135deg, #f59e0b, #fbbf24, #fde68a)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Score Higher!</span>
            <span className="block text-purple-200 text-4xl sm:text-5xl mt-1">🚀 TRUE CONCEPT</span>
          </h1>

          <p className="text-xl text-purple-200 mb-10 max-w-xl leading-relaxed font-semibold">
            Your all-in-one study buddy for Class IX & X. Notes, quizzes, videos, and a virtual science lab — all in one place!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <button
                className="w-full sm:w-auto font-black text-base px-8 py-4 rounded-2xl text-purple-900 shadow-2xl hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
                data-testid="button-get-started"
              >
                🚀 Get Started Free
              </button>
            </Link>
            <Link href="/subjects">
              <button
                className="w-full sm:w-auto font-bold text-base px-8 py-4 rounded-2xl text-white hover:scale-105 transition-transform liquid-dark"
                data-testid="button-explore"
              >
                📚 Explore Subjects
              </button>
            </Link>
          </div>
        </div>

        {/* Floating emojis */}
        <div className="absolute top-16 right-8 text-4xl opacity-60 hidden lg:block animate-bounce">🧪</div>
        <div className="absolute top-36 right-40 text-3xl opacity-40 hidden lg:block">⚡</div>
        <div className="absolute bottom-20 right-16 text-4xl opacity-50 hidden lg:block animate-bounce" style={{ animationDelay: "0.5s" }}>📐</div>
      </section>

      {/* ── Stats Row ─────────────────────────────── */}
      <section className="py-8 px-4" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label, emoji }) => (
            <div key={label} className="text-center text-white">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-3xl font-black">{value}</div>
              <div className="text-purple-200 text-sm font-bold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subjects ──────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto blob-bg">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-card text-purple-700 font-bold text-sm mb-4">
            <BookOpen className="w-4 h-4" /> Available Subjects
          </div>
          <h2 className="font-black text-3xl sm:text-4xl text-gray-900 mb-3">
            Pick Your{" "}
            <span style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Subject</span> 📖
          </h2>
          <p className="text-gray-600 text-lg font-semibold">Full SEBA and CBSE syllabus for Class IX & X</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects?.map((subject, idx) => {
            const col = subjectColors[idx % subjectColors.length];
            const emoji = subjectEmojis[idx % subjectEmojis.length];
            return (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <div
                  data-testid={`card-subject-${subject.id}`}
                  className="group liquid-card rounded-3xl overflow-hidden card-hover"
                >
                  {/* Gradient top stripe */}
                  <div className="h-2 w-full" style={{ background: col.grad }} />

                  <div className="p-6">
                    {/* Icon with glow */}
                    <div className="relative w-14 h-14 rounded-2xl mb-5 flex items-center justify-center text-2xl shadow-lg"
                      style={{ background: col.grad }}>
                      <div className="absolute inset-0 rounded-2xl blur-md opacity-60"
                        style={{ background: col.glow }} />
                      <span className="relative">{emoji}</span>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2 font-medium">{subject.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {subject.classLevels.map((cl) => (
                          <span key={cl} className="text-xs font-black px-3 py-1 rounded-full text-white shadow-sm"
                            style={{ background: col.badge }}>
                            {cl}
                          </span>
                        ))}
                      </div>
                      {subject.chapterCount !== undefined && (
                        <span className="text-xs font-bold text-gray-400">{subject.chapterCount} chapters</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {!subjects && [1, 2, 3].map((i) => (
            <div key={i} className="liquid-card rounded-3xl p-6 animate-pulse">
              <div className="w-14 h-14 bg-white/40 rounded-2xl mb-4" />
              <div className="h-5 bg-white/40 rounded-lg mb-2 w-3/4" />
              <div className="h-4 bg-white/30 rounded mb-1" />
              <div className="h-4 bg-white/30 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative" style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(219,39,119,0.06) 50%, rgba(245,158,11,0.08) 100%)"
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-card text-purple-700 font-bold text-sm mb-4">
              <Sparkles className="w-4 h-4" /> Everything you need
            </div>
            <h2 className="font-black text-3xl sm:text-4xl text-gray-900 mb-3">
              Your Complete Study{" "}
              <span style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Kit 🎒</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, title, desc, grad }) => (
              <div key={title} className="liquid-card rounded-3xl p-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md text-xl text-white"
                  style={{ background: grad }}>
                  {icon}
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-lg">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-20 px-4 text-center bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-black text-4xl text-white mb-4">Ready to Ace Your Exams?</h2>
          <p className="text-purple-200 text-lg mb-8 font-semibold">
            Join students across Assam who are studying smarter. Login now — it's free!
          </p>
          <Link href="/login">
            <button
              className="font-black text-lg px-10 py-4 rounded-2xl text-purple-900 shadow-2xl hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
              data-testid="button-cta-login"
            >
              🚀 Start Learning Now!
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
