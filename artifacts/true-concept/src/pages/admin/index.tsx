import { Link } from "wouter";
import { useGetSubjects, useGetExperiments } from "@workspace/api-client-react";
import { BookOpen, FlaskConical, Users, BarChart2, ChevronRight, Settings } from "lucide-react";

export default function AdminDashboard() {
  const { data: subjects } = useGetSubjects();
  const { data: experiments } = useGetExperiments();

  const stats = [
    { label: "Total Subjects", value: subjects?.length ?? "—", icon: BookOpen, href: "/admin/subjects", color: "text-blue-600 bg-blue-50" },
    { label: "Experiments", value: experiments?.length ?? "—", icon: FlaskConical, href: "/admin/experiments", color: "text-purple-600 bg-purple-50" },
  ];

  const quickLinks = [
    { href: "/admin/subjects", label: "Manage Subjects", icon: BookOpen, desc: "View and manage all subjects" },
    { href: "/admin/chapters", label: "Manage Chapters", icon: BookOpen, desc: "View and manage chapter content" },
    { href: "/admin/experiments", label: "Manage Experiments", icon: FlaskConical, desc: "Virtual lab experiments" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-1" data-testid="heading-admin">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage learning content for TRUE CONCEPT Portal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={href} href={href}>
            <div
              data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        <div className="px-5 py-4">
          <h2 className="font-semibold text-foreground">Content Management</h2>
        </div>
        {quickLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}>
            <div
              data-testid={`link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 cursor-pointer transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
