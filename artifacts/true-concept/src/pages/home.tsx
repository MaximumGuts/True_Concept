import { Link } from "wouter";
import { useGetSubjects } from "@workspace/api-client-react";
import { BookOpen, Sparkles } from "lucide-react";

const subjectGradients: Record<number, string> = {
  1: "from-blue-500 to-indigo-600",
  2: "from-emerald-500 to-teal-600",
  3: "from-purple-500 to-violet-600",
  4: "from-rose-500 to-pink-600",
  5: "from-orange-500 to-amber-600",
};

const subjectBg: Record<number, string> = {
  1: "bg-blue-50 border-blue-100",
  2: "bg-emerald-50 border-emerald-100",
  3: "bg-purple-50 border-purple-100",
  4: "bg-rose-50 border-rose-100",
  5: "bg-orange-50 border-orange-100",
};

const features = [
  { icon: "📝", title: "Smart Notes", desc: "Chapter-wise study material that's easy to read and remember", color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
  { icon: "🎯", title: "MCQ Practice", desc: "Test yourself with instant feedback and detailed explanations", color: "from-purple-400 to-purple-600", bg: "bg-purple-50" },
  { icon: "🎬", title: "Video Lessons", desc: "Watch expert video explanations for every chapter", color: "from-rose-400 to-rose-600", bg: "bg-rose-50" },
  { icon: "🔬", title: "Virtual Lab", desc: "Do science experiments right from your screen — no equipment needed!", color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50" },
  { icon: "❓", title: "Q&A Bank", desc: "Important exam questions with step-by-step answers", color: "from-orange-400 to-orange-600", bg: "bg-orange-50" },
  { icon: "📊", title: "Track Progress", desc: "See how much you've studied and how well you're doing", color: "from-pink-400 to-pink-600", bg: "bg-pink-50" },
];

const stats = [
  { value: "14+", label: "Chapters", emoji: "📚" },
  { value: "100+", label: "MCQs", emoji: "✅" },
  { value: "5", label: "Lab Experiments", emoji: "🔬" },
  { value: "2", label: "Boards (SEBA & CBSE)", emoji: "🏆" },
];

export default function HomePage() {
  const { data: subjects } = useGetSubjects();

  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero text-white py-20 lg:py-32 px-4">
        {/* Decorative floating blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <span>🎓</span>
              <span className="text-yellow-300">SEBA & CBSE Board — Class IX & X</span>
              <span>✨</span>
            </div>

            <h1 className="font-black text-5xl sm:text-6xl lg:text-7xl leading-tight mb-4" data-testid="heading-hero">
              <span className="block text-white">Learn Smarter,</span>
              <span className="block" style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24, #fcd34d)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Score Higher!</span>
              <span className="block text-purple-200 text-4xl sm:text-5xl mt-2">🚀 TRUE CONCEPT</span>
            </h1>

            <p className="text-xl text-purple-200 mb-10 max-w-xl leading-relaxed">
              Your all-in-one study buddy for Class IX & X. Notes, quizzes, videos, and even a virtual science lab — all in one place!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <button
                  className="w-full sm:w-auto font-black text-base px-8 py-4 rounded-2xl text-purple-900 shadow-xl hover:scale-105 transition-transform"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
                  data-testid="button-get-started"
                >
                  🚀 Get Started Free
                </button>
              </Link>
              <Link href="/subjects">
                <button
                  className="w-full sm:w-auto font-bold text-base px-8 py-4 rounded-2xl text-white hover:scale-105 transition-transform"
                  style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}
                  data-testid="button-explore"
                >
                  📚 Explore Subjects
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating emoji decorations */}
        <div className="absolute top-16 right-8 text-4xl opacity-70 hidden lg:block animate-bounce">🧪</div>
        <div className="absolute top-32 right-32 text-3xl opacity-50 hidden lg:block" style={{ animationDelay: "0.3s" }}>⚡</div>
        <div className="absolute bottom-20 right-16 text-4xl opacity-60 hidden lg:block animate-bounce" style={{ animationDelay: "0.6s" }}>📐</div>
        <div className="absolute top-24 right-64 text-2xl opacity-40 hidden lg:block">🌟</div>
      </section>

      {/* Stats Row */}
      <section className="py-8 px-4" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label, emoji }) => (
            <div key={label} className="text-center text-white">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-3xl font-black">{value}</div>
              <div className="text-purple-200 text-sm font-semibold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-4">
            <BookOpen className="w-4 h-4" /> Available Subjects
          </div>
          <h2 className="font-black text-3xl sm:text-4xl text-gray-900 mb-3">
            Pick Your{" "}
            <span style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Subject</span> 📖
          </h2>
          <p className="text-gray-500 text-lg">Covering the full SEBA and CBSE syllabus for Class IX & X</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects?.map((subject, idx) => {
            const gradClass = subjectGradients[(idx % 5) + 1];
            const bgClass = subjectBg[(idx % 5) + 1];
            return (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <div
                  data-testid={`card-subject-${subject.id}`}
                  className={`group bg-white border-2 rounded-2xl overflow-hidden cursor-pointer card-hover shadow-sm ${bgClass}`}
                >
                  <div className={`h-2 bg-gradient-to-r ${gradClass}`} />
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradClass} shadow-lg text-2xl`}>
                      {idx === 0 ? "🔢" : idx === 1 ? "🔬" : idx === 2 ? "📐" : "📚"}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{subject.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {subject.classLevels.map((cl) => (
                          <span key={cl} className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${gradClass} text-white`}>
                            {cl}
                          </span>
                        ))}
                      </div>
                      {subject.chapterCount !== undefined && (
                        <span className="text-xs font-semibold text-gray-400">{subject.chapterCount} chapters</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {!subjects && (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-6 animate-pulse">
                <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-5 bg-gray-200 rounded-lg mb-2 w-3/4" />
                <div className="h-4 bg-gray-100 rounded mb-1 w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #ede9fe 50%, #ddd6fe 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-purple-700 font-bold text-sm mb-4 shadow-sm">
              <Sparkles className="w-4 h-4" /> Everything you need
            </div>
            <h2 className="font-black text-3xl sm:text-4xl text-gray-900 mb-3">
              Your Complete Study{" "}
              <span style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Kit 🎒</span>
            </h2>
            <p className="text-gray-500 text-lg">Everything your board exams need, in one app</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, title, desc, color, bg }) => (
              <div key={title} className={`${bg} rounded-2xl p-6 border border-white shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${color} shadow-md text-xl`}>
                  {icon}
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-lg">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-black text-4xl text-white mb-4">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-purple-200 text-lg mb-8">
            Join students across Assam who are studying smarter with TRUE CONCEPT. Login now — it's free!
          </p>
          <Link href="/login">
            <button
              className="font-black text-lg px-10 py-4 rounded-2xl text-purple-900 shadow-xl hover:scale-105 transition-transform"
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
