import { Link } from "wouter";
import { useGetSubjects, useGetExperiments } from "@workspace/api-client-react";
import { ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  const { data: subjects } = useGetSubjects();
  const { data: experiments } = useGetExperiments();

  const stats = [
    { label: "Total Subjects", value: subjects?.length ?? "—", emoji: "📚", grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.25)", href: "/admin/subjects" },
    { label: "Experiments", value: experiments?.length ?? "—", emoji: "🔬", grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.25)", href: "/admin/experiments" },
  ];

  const quickLinks = [
    { href: "/admin/subjects", emoji: "📚", label: "Manage Subjects", desc: "Add, edit or delete subjects", grad: "linear-gradient(135deg, #3b82f6, #6366f1)" },
    { href: "/admin/chapters", emoji: "📖", label: "Manage Chapters", desc: "Organize chapter content", grad: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
    { href: "/admin/experiments", emoji: "🔬", label: "Manage Experiments", desc: "Virtual lab experiments", grad: "linear-gradient(135deg, #10b981, #14b8a6)" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 blob-bg space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-6 text-white">
        <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none pointer-events-none">⚙️</div>
        <div className="relative">
          <div className="text-3xl mb-2">⚙️</div>
          <h1 className="font-black text-3xl mb-1" data-testid="heading-admin">Admin Dashboard</h1>
          <p className="text-purple-300 font-bold">Manage all content for TRUE CONCEPT Portal</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, emoji, grad, glow, href }) => (
          <Link key={href} href={href}>
            <div data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="liquid-card rounded-3xl p-6 cursor-pointer card-hover">
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg"
                style={{ background: grad }}>
                <div className="absolute inset-0 rounded-2xl blur-md opacity-50" style={{ background: glow }} />
                <span className="relative">{emoji}</span>
              </div>
              <div className="text-4xl font-black text-gray-900">{value}</div>
              <div className="text-sm font-bold text-gray-500 mt-1">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-black text-xl text-gray-900 mb-4">📂 Content Management</h2>
        <div className="space-y-3">
          {quickLinks.map(({ href, emoji, label, desc, grad }) => (
            <Link key={href} href={href}>
              <div
                data-testid={`link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-4 liquid-card rounded-2xl px-5 py-4 cursor-pointer card-hover group"
              >
                <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0"
                  style={{ background: grad }}>
                  <span className="relative">{emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900 group-hover:text-purple-700 transition-colors">{label}</p>
                  <p className="text-sm text-gray-500 font-medium">{desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
