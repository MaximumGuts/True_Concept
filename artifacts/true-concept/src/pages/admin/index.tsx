import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useGetSubjects, useGetExperiments } from "@workspace/api-client-react";
import { ChevronRight, Settings, BookOpen, FlaskConical, BookText, Users, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { MotionList, MotionItem, FadeIn } from "@/components/MotionList";

export default function AdminDashboard() {
  const { data: subjects } = useGetSubjects();
  const { data: experiments } = useGetExperiments();
  const [studentCount, setStudentCount] = useState<number | "—">("—");

  useEffect(() => {
    const token = localStorage.getItem("trueconcept_token");
    fetch("/api/students", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setStudentCount(d.length); })
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Total Subjects", value: subjects?.length ?? "—",   emoji: "📚", grad: "linear-gradient(135deg, #da6b45, #b85535)", glow: "rgba(218,107,69,0.30)", href: "/admin/subjects" },
    { label: "Experiments",    value: experiments?.length ?? "—", emoji: "🔬", grad: "linear-gradient(135deg, #14b8a6, #0d9488)", glow: "rgba(20,184,166,0.30)", href: "/admin/experiments" },
    { label: "Students",       value: studentCount,               emoji: "🎓", grad: "linear-gradient(135deg, #6366f1, #8b5cf6)", glow: "rgba(99,102,241,0.30)",  href: "/admin/students" },
  ];

  const quickLinks = [
    { href: "/admin/subjects",    Icon: BookOpen,     emoji: "📚", label: "Manage Subjects",    desc: "Add, edit or delete subjects",     grad: "linear-gradient(135deg, #da6b45, #b85535)" },
    { href: "/admin/chapters",    Icon: BookText,     emoji: "📖", label: "Manage Chapters",    desc: "Organize chapter content",          grad: "linear-gradient(135deg, #fbbf24, #f59e0b)" },
    { href: "/admin/experiments", Icon: FlaskConical, emoji: "🔬", label: "Manage Experiments", desc: "Virtual lab experiments",           grad: "linear-gradient(135deg, #14b8a6, #0d9488)" },
    { href: "/admin/students",    Icon: Users,        emoji: "🎓", label: "View Students",      desc: "See registered students & classes", grad: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 blob-bg space-y-8">
      {/* Header — coral gradient panel */}
      <FadeIn>
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, #b85535 0%, #da6b45 60%, #f5a584 100%)" }}
        >
          <div className="absolute -top-8 -right-4 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
          <div className="absolute top-2 right-4 text-[140px] opacity-15 leading-none pointer-events-none select-none">⚙️</div>
          <div className="relative">
            <Link href="/admin/settings">
              <button
                className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-black transition-colors"
                title="Change username & password"
                data-testid="button-admin-settings"
              >
                <KeyRound className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Settings</span>
              </button>
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider mb-3">
              <Settings className="w-3 h-3" /> Control Panel
            </span>
            <h1 className="font-black text-3xl sm:text-4xl mb-1 tracking-tight" data-testid="heading-admin">Admin Dashboard</h1>
            <p className="text-white/90 font-medium text-sm sm:text-base">
              Manage all content for the TRUE CONCEPT learning portal
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <MotionList className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, emoji, grad, glow, href }) => (
          <MotionItem key={href}>
            <Link href={href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="liquid-card rounded-3xl p-6 cursor-pointer relative overflow-hidden group"
              >
                <div
                  className="absolute -top-2 -right-2 w-32 h-32 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity pointer-events-none"
                  style={{ background: glow }}
                />
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg"
                  style={{ background: grad }}>
                  <div className="absolute inset-0 rounded-2xl blur-md opacity-50" style={{ background: glow }} />
                  <span className="relative">{emoji}</span>
                </div>
                <div className="relative text-4xl sm:text-5xl font-black text-foreground tracking-tight">{value}</div>
                <div className="relative text-sm font-bold text-muted-foreground mt-1">{label}</div>
              </motion.div>
            </Link>
          </MotionItem>
        ))}
      </MotionList>

      {/* Quick Links */}
      <div>
        <FadeIn>
          <h2 className="font-black text-xl text-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">📂</span> Content Management
          </h2>
        </FadeIn>
        <MotionList className="space-y-3">
          {quickLinks.map(({ href, emoji, label, desc, grad }) => (
            <MotionItem key={href}>
              <Link href={href}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  data-testid={`link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-4 liquid-card rounded-2xl px-5 py-4 cursor-pointer group relative overflow-hidden"
                >
                  {/* Sliding accent stripe on left */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: grad }}
                  />
                  <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0"
                    style={{ background: grad }}>
                    <span className="relative">{emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-foreground group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                      {label}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">{desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </motion.div>
              </Link>
            </MotionItem>
          ))}
        </MotionList>
      </div>
    </div>
  );
}
