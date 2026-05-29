import { Link } from "wouter";
import { useGetSubjects } from "@workspace/api-client-react";
import { BookOpen, Sparkles, ArrowRight, Rocket, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { MotionList, MotionItem, FadeIn } from "@/components/MotionList";
import { getSubjectTheme } from "@/lib/subject-theme";
import HomeGreeting from "@/components/HomeGreeting";

const features = [
  { icon: "📝", title: "Smart Notes",     desc: "Chapter-wise notes that are easy to read and remember", grad: "linear-gradient(135deg, #da6b45, #b85535)" },
  { icon: "🎯", title: "MCQ Practice",    desc: "Test yourself with instant feedback and explanations",  grad: "linear-gradient(135deg, #fbbf24, #f59e0b)" },
  { icon: "🎬", title: "Video Lessons",   desc: "Expert video explanations for every chapter",           grad: "linear-gradient(135deg, #ef4444, #f87171)" },
  { icon: "🔬", title: "Virtual Lab",     desc: "Do science experiments from your screen!",              grad: "linear-gradient(135deg, #14b8a6, #0d9488)" },
  { icon: "❓", title: "Q&A Bank",        desc: "Important exam questions with step-by-step answers",    grad: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { icon: "📊", title: "Track Progress",  desc: "See how much you've studied and how well you're doing", grad: "linear-gradient(135deg, #ec4899, #db2777)" },
];

const stats = [
  { value: "14+",  label: "Chapters", emoji: "📚" },
  { value: "100+", label: "MCQs",     emoji: "✅" },
  { value: "5",    label: "Lab Sims", emoji: "🔬" },
  { value: "2",    label: "Boards",   emoji: "🏆" },
];

export default function HomePage() {
  const { data: subjects } = useGetSubjects();

  return (
    <div className="overflow-hidden">
      {/* Personalized greeting — only shown to logged-in students */}
      <HomeGreeting />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative bg-hero text-white py-20 lg:py-32 px-4 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #da6b45, transparent)" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }} />

        <div className="relative max-w-7xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold liquid-dark">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200">SEBA &amp; CBSE Board — Class IX &amp; X</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-5 tracking-tight" data-testid="heading-hero">
              <span className="block text-white">Learn Smarter,</span>
              <span className="block" style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f5a584 50%, #fcd34d 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Score Higher. 🚀</span>
              <span className="block text-orange-200/90 text-3xl sm:text-4xl lg:text-5xl mt-3 font-extrabold tracking-tight">
                TRUE CONCEPT
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg sm:text-xl text-orange-100/85 mb-10 max-w-xl leading-relaxed font-medium">
              Your all-in-one study buddy for Class IX &amp; X.
              <br className="hidden sm:block" />
              Notes, quizzes, videos &amp; a virtual science lab — all in one place.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto font-black text-base px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-2 justify-center bg-cta text-amber-950 anim-pulse-glow"
                  data-testid="button-get-started"
                >
                  <Rocket className="w-5 h-5" /> Get Started Free
                </motion.button>
              </Link>
              <Link href="/subjects">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto font-bold text-base px-8 py-4 rounded-2xl text-white liquid-dark flex items-center gap-2 justify-center"
                  data-testid="button-explore"
                >
                  <BookOpen className="w-5 h-5" /> Explore Subjects
                </motion.button>
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Floating accent emojis */}
        <div className="absolute top-16 right-8 text-4xl opacity-60 hidden lg:block anim-float">🧪</div>
        <div className="absolute top-36 right-40 text-3xl opacity-40 hidden lg:block anim-float" style={{ animationDelay: "0.8s" }}>⚡</div>
        <div className="absolute bottom-20 right-16 text-4xl opacity-50 hidden lg:block anim-float" style={{ animationDelay: "1.4s" }}>📐</div>
      </section>

      {/* ── Stats Row ─────────────────────────────── */}
      <section className="py-10 px-4 relative overflow-hidden" style={{ background: "var(--grad-brand)" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle at 20% 50%, #fcd34d, transparent 60%)" }} />
        <div className="relative max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label, emoji }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center text-white"
            >
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">{value}</div>
              <div className="text-orange-100 text-xs sm:text-sm font-bold uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Subjects ──────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto blob-bg">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="brand-pill">
              <BookOpen className="w-3.5 h-3.5" /> Available Subjects
            </span>
            <h2 className="font-black text-3xl sm:text-5xl text-foreground mt-4 mb-3 tracking-tight">
              Pick Your{" "}
              <span className="gradient-text">Subject 📖</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-semibold max-w-xl mx-auto">
              Full SEBA &amp; CBSE syllabus for Class IX &amp; X — built around how you actually learn.
            </p>
          </div>
        </FadeIn>

        <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects?.map((subject, idx) => {
            const theme = getSubjectTheme(subject.name, idx);
            return (
              <MotionItem key={subject.id}>
                <Link href={`/subjects/${subject.id}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    data-testid={`card-subject-${subject.id}`}
                    className="group liquid-card rounded-3xl overflow-hidden h-full cursor-pointer"
                  >
                    <div className="h-1.5 w-full" style={{ background: theme.grad }} />
                    <div className="p-6">
                      <div className="relative w-14 h-14 rounded-2xl mb-5 flex items-center justify-center text-2xl shadow-lg"
                        style={{ background: theme.grad }}>
                        <div className="absolute inset-0 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-opacity"
                          style={{ background: theme.glow }} />
                        <span className="relative">{theme.emoji}</span>
                      </div>
                      <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2 font-medium">
                        {subject.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {subject.classLevels.map((cl) => (
                            <span key={cl} className="text-xs font-black px-3 py-1 rounded-full text-white shadow-sm"
                              style={{ background: theme.badge }}>
                              {cl}
                            </span>
                          ))}
                        </div>
                        {subject.chapterCount !== undefined && (
                          <span className="text-xs font-bold text-muted-foreground">{subject.chapterCount} chapters</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </MotionItem>
            );
          })}

          {!subjects && [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="liquid-card rounded-3xl p-6">
              <div className="w-14 h-14 rounded-2xl mb-4 skeleton-shimmer rounded-2xl" />
              <div className="h-5 w-3/4 mb-2 rounded skeleton-shimmer" />
              <div className="h-4 w-full mb-1 rounded skeleton-shimmer" />
              <div className="h-4 w-2/3 rounded skeleton-shimmer" />
            </div>
          ))}
        </MotionList>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative" style={{
        background: "linear-gradient(135deg, rgba(218, 107, 69, 0.08) 0%, rgba(251, 191, 36, 0.06) 50%, rgba(20, 184, 166, 0.08) 100%)"
      }}>
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="brand-pill">
                <Sparkles className="w-3.5 h-3.5" /> Everything you need
              </span>
              <h2 className="font-black text-3xl sm:text-5xl text-foreground mt-4 mb-3 tracking-tight">
                Your Complete Study{" "}
                <span className="gradient-text">Kit 🎒</span>
              </h2>
            </div>
          </FadeIn>

          <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, title, desc, grad }) => (
              <MotionItem key={title}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="liquid-card rounded-3xl p-6 h-full cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md text-xl text-white"
                    style={{ background: grad }}>
                    {icon}
                  </div>
                  <h3 className="font-black text-foreground mb-2 text-lg">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">{desc}</p>
                </motion.div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-20 px-4 text-center bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #da6b45, transparent)" }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
        </div>
        <FadeIn>
          <div className="relative max-w-2xl mx-auto">
            <div className="text-5xl mb-4 anim-float">🎉</div>
            <h2 className="font-black text-4xl sm:text-5xl text-white mb-4 tracking-tight">
              Ready to Ace Your Exams?
            </h2>
            <p className="text-orange-100/85 text-lg mb-8 font-semibold">
              Join students across Assam who are studying smarter. Login now — it's free!
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="font-black text-lg px-10 py-4 rounded-2xl text-amber-950 shadow-2xl bg-cta inline-flex items-center gap-2 anim-pulse-glow"
                data-testid="button-cta-login"
              >
                <Rocket className="w-5 h-5" /> Start Learning Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
