import { Link } from "wouter";
import { useGetSubjects, useGetExperiments } from "@workspace/api-client-react";
import { ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  const { data: subjects } = useGetSubjects();
  const { data: experiments } = useGetExperiments();

  const stats = [
    { label: "Total Subjects", value: subjects?.length ?? "—", emoji: "📚", gradient: "from-blue-400 to-indigo-600", bg: "bg-blue-50", text: "text-blue-700", href: "/admin/subjects" },
    { label: "Total Experiments", value: experiments?.length ?? "—", emoji: "🔬", gradient: "from-emerald-400 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-700", href: "/admin/experiments" },
  ];

  const quickLinks = [
    { href: "/admin/subjects", emoji: "📚", label: "Manage Subjects", desc: "Add, edit or delete subjects", gradient: "from-blue-400 to-indigo-600" },
    { href: "/admin/chapters", emoji: "📖", label: "Manage Chapters", desc: "Organize chapter content", gradient: "from-purple-400 to-violet-600" },
    { href: "/admin/experiments", emoji: "🔬", label: "Manage Experiments", desc: "Virtual lab experiments", gradient: "from-emerald-400 to-teal-600" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)" }}>
        <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none">⚙️</div>
        <div className="relative">
          <div className="text-3xl mb-2">⚙️</div>
          <h1 className="font-black text-3xl mb-1" data-testid="heading-admin">Admin Dashboard</h1>
          <p className="text-purple-200 font-semibold">Manage all content for TRUE CONCEPT Portal</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {stats.map(({ label, value, emoji, gradient, bg, text, href }) => (
          <Link key={href} href={href}>
            <div data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`${bg} border-2 border-white rounded-3xl p-6 cursor-pointer hover:scale-105 transition-transform shadow-sm`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} shadow-md text-2xl`}>
                {emoji}
              </div>
              <div className={`text-4xl font-black ${text}`}>{value}</div>
              <div className="text-sm font-bold text-gray-500 mt-1">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-black text-xl text-gray-900 mb-4">📂 Content Management</h2>
        <div className="space-y-3">
          {quickLinks.map(({ href, emoji, label, desc, gradient }) => (
            <Link key={href} href={href}>
              <div
                data-testid={`link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-4 bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 hover:border-purple-200 hover:shadow-sm cursor-pointer transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-md text-2xl shrink-0`}>
                  {emoji}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900 group-hover:text-purple-700 transition-colors">{label}</p>
                  <p className="text-sm text-gray-400 font-medium">{desc}</p>
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
