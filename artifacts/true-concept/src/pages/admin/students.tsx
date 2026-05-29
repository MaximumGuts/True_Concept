import { useState, useEffect } from "react";
import { Users, Search, Phone, GraduationCap, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, MotionList, MotionItem } from "@/components/MotionList";

interface Student {
  id: string;
  name: string;
  phone: string;
  classLevel: string;
  medium: string;
  board: string;
  createdAt: string | null;
  lastLogin: string | null;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("trueconcept_token");
    fetch("/api/students", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
        else setError("Failed to load students.");
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.classLevel?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <FadeIn>
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)" }}
        >
          <div className="absolute -top-8 -right-4 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
          <div className="absolute top-2 right-4 text-[140px] opacity-15 leading-none pointer-events-none select-none">🎓</div>
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider mb-3">
              <Users className="w-3 h-3" /> Student Registry
            </span>
            <h1 className="font-black text-3xl sm:text-4xl mb-1 tracking-tight">Students</h1>
            <p className="text-white/90 font-medium text-sm sm:text-base">
              {students.length} registered student{students.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn>
        <div className="liquid-card rounded-2xl px-4 py-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by name, phone or class…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-semibold text-foreground placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground text-xs font-black">✕</button>
          )}
        </div>
      </FadeIn>

      {/* Content */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="liquid-card rounded-2xl p-6 text-center text-red-500 font-semibold">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="liquid-card rounded-2xl p-10 text-center">
          <div className="text-5xl mb-3">🎓</div>
          <p className="font-black text-foreground text-lg">{search ? "No students match your search" : "No students yet"}</p>
          <p className="text-sm text-muted-foreground font-medium mt-1">Students appear here after they register via the app</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <MotionList className="space-y-3">
          {filtered.map((student, i) => (
            <MotionItem key={student.id}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="liquid-card rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0"
                  style={{ background: `hsl(${(i * 47 + 200) % 360}, 60%, 55%)` }}
                >
                  {student.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground text-base truncate">{student.name || "—"}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Phone className="w-3 h-3" /> {student.phone || "—"}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <GraduationCap className="w-3 h-3" /> {student.classLevel || "—"} · {student.board || "—"} · {student.medium || "—"}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Calendar className="w-3 h-3" /> Joined {formatDate(student.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Badge */}
                <div className="shrink-0">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    {student.classLevel || "Student"}
                  </span>
                </div>
              </motion.div>
            </MotionItem>
          ))}
        </MotionList>
      )}
    </div>
  );
}
