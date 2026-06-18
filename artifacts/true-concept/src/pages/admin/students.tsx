import { useState, useEffect, useMemo } from "react";
import { Users, Search, Phone, GraduationCap, Calendar, Download, Filter, ArrowUpDown, ArrowUp, ArrowDown, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, MotionList, MotionItem } from "@/components/MotionList";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getLevelForXP, BADGES } from "@/lib/gamification/xp-config";

interface Student {
  id: string;
  name: string;
  phone: string;
  email?: string;
  classLevel: string;
  medium: string;
  board: string;
  createdAt: string | null;
  lastLogin: string | null;
}

interface StudentXPInfo {
  totalXP:       number;
  level:         number;
  earnedBadgeIds: string[];
}

type SortKey = "name" | "joined" | "xp_desc" | "xp_asc" | "level_desc" | "level_asc";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  const active = value !== "all";
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}
      className={`text-xs font-black rounded-xl px-3 py-2 outline-none cursor-pointer transition-colors border ${
        active ? "border-violet-400 text-violet-700 dark:text-violet-300" : "border-white/50 dark:border-white/10 text-foreground"
      }`}
      style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
      {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
    </select>
  );
}

function csvField(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function exportToCsv(rows: Student[], xpMap: Map<string, StudentXPInfo>): void {
  const headers = ["Name", "Phone", "Email", "Class", "Medium", "Board", "Joined", "Last Login", "Total XP", "Level", "Level Title", "Badges Earned"];
  const lines = [
    headers.map(csvField).join(","),
    ...rows.map((s) => {
      const xp   = xpMap.get(s.id);
      const lvl  = getLevelForXP(xp?.totalXP ?? 0);
      return [
        s.name, s.phone, s.email ?? "", s.classLevel, s.medium, s.board,
        formatDate(s.createdAt), formatDate(s.lastLogin),
        xp?.totalXP ?? 0, lvl.level, lvl.title,
        (xp?.earnedBadgeIds ?? []).length,
      ].map(csvField).join(",");
    }),
  ];
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `true-concept-students-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminStudentsPage() {
  const [students, setStudents]   = useState<Student[]>([]);
  const [xpMap, setXpMap]         = useState<Map<string, StudentXPInfo>>(new Map());
  const [loading, setLoading]     = useState(true);
  const [xpLoading, setXpLoading] = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [classFilter, setClassFilter]   = useState<string>("all");
  const [mediumFilter, setMediumFilter] = useState<string>("all");
  const [boardFilter, setBoardFilter]   = useState<string>("all");
  const [sortKey, setSortKey]     = useState<SortKey>("joined");

  // 1. Load student list from API
  useEffect(() => {
    const token = localStorage.getItem("trueconcept_token");
    fetch("/api/students", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
        else setError("Failed to load students.");
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // 2. Load XP data for all students in parallel after list loads
  useEffect(() => {
    if (students.length === 0) return;
    setXpLoading(true);
    // Fetch all studentXP docs in one batch
    getDocs(collection(db, "studentXP"))
      .then((snap) => {
        const m = new Map<string, StudentXPInfo>();
        snap.docs.forEach((d) => {
          const data = d.data() as Record<string, unknown>;
          m.set(d.id, {
            totalXP:       (data.totalXP       as number)   ?? 0,
            level:         (data.level          as number)   ?? 1,
            earnedBadgeIds: (data.earnedBadgeIds as string[]) ?? [],
          });
        });
        setXpMap(m);
      })
      .catch(() => {})
      .finally(() => setXpLoading(false));
  }, [students.length]);

  const boards = useMemo(
    () => Array.from(new Set(students.map((s) => s.board).filter(Boolean))).sort(),
    [students],
  );

  // Filter
  const filtered = useMemo(() => students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.name?.toLowerCase().includes(q) || s.phone?.includes(q) || s.email?.toLowerCase().includes(q);
    return matchesSearch
      && (classFilter  === "all" || s.classLevel === classFilter)
      && (mediumFilter === "all" || s.medium     === mediumFilter)
      && (boardFilter  === "all" || s.board      === boardFilter);
  }), [students, search, classFilter, mediumFilter, boardFilter]);

  // Sort
  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortKey) {
      case "xp_desc":    return copy.sort((a, b) => (xpMap.get(b.id)?.totalXP ?? 0) - (xpMap.get(a.id)?.totalXP ?? 0));
      case "xp_asc":     return copy.sort((a, b) => (xpMap.get(a.id)?.totalXP ?? 0) - (xpMap.get(b.id)?.totalXP ?? 0));
      case "level_desc": return copy.sort((a, b) => (xpMap.get(b.id)?.level   ?? 1) - (xpMap.get(a.id)?.level   ?? 1));
      case "level_asc":  return copy.sort((a, b) => (xpMap.get(a.id)?.level   ?? 1) - (xpMap.get(b.id)?.level   ?? 1));
      case "name":       return copy.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      default:           return copy.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    }
  }, [filtered, sortKey, xpMap]);

  const anyFilterActive = classFilter !== "all" || mediumFilter !== "all" || boardFilter !== "all" || !!search;

  function SortButton({ sk, label }: { sk: SortKey; label: string }) {
    const active = sortKey === sk;
    return (
      <button onClick={() => setSortKey(sk)}
        className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl transition-colors ${
          active ? "text-white" : "text-gray-600 dark:text-gray-300 liquid-card"
        }`}
        style={active ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}>
        {label}
        {active ? <ArrowUp className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3 opacity-50" />}
      </button>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)" }}>
          <div className="absolute -top-8 -right-4 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
          <div className="absolute top-2 right-4 text-[140px] opacity-15 leading-none pointer-events-none select-none">🎓</div>
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider mb-3">
              <Users className="w-3 h-3" /> Student Registry
            </span>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="font-black text-3xl sm:text-4xl mb-1 tracking-tight">Students</h1>
                <p className="text-white/90 font-medium text-sm sm:text-base">
                  {sorted.length} of {students.length} student{students.length !== 1 ? "s" : ""}
                  {anyFilterActive ? " (filtered)" : ""}
                  {xpLoading && " · loading XP…"}
                </p>
              </div>
              <button onClick={() => exportToCsv(sorted, xpMap)} disabled={sorted.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm font-black text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
                <Download className="w-4 h-4" /> Export Excel
              </button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Search + Filters + Sort */}
      <FadeIn>
        <div className="space-y-3">
          {/* Search */}
          <div className="liquid-card rounded-2xl px-4 py-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input type="text" placeholder="Search by name, phone, email…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-semibold text-foreground placeholder:text-muted-foreground" />
            {search && <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground text-xs font-black">✕</button>}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-black text-muted-foreground">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <FilterSelect label="Class" value={classFilter} onChange={setClassFilter}
              options={[["all", "All Classes"], ["Class IX", "Class IX"], ["Class X", "Class X"]]} />
            <FilterSelect label="Medium" value={mediumFilter} onChange={setMediumFilter}
              options={[["all", "All Mediums"], ["English", "English"], ["Assamese", "Assamese"]]} />
            <FilterSelect label="Board" value={boardFilter} onChange={setBoardFilter}
              options={[["all", "All Boards"], ...boards.map((b) => [b, b] as [string, string])]} />
            {anyFilterActive && (
              <button onClick={() => { setSearch(""); setClassFilter("all"); setMediumFilter("all"); setBoardFilter("all"); }}
                className="text-xs font-black text-red-500 hover:text-red-600 px-2 py-1">Clear all</button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-black text-muted-foreground">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <SortButton sk="joined"     label="Joined" />
            <SortButton sk="name"       label="Name A–Z" />
            <SortButton sk="xp_desc"    label="XP ↓ High" />
            <SortButton sk="xp_asc"     label="XP ↑ Low" />
            <SortButton sk="level_desc" label="Level ↓ High" />
            <SortButton sk="level_asc"  label="Level ↑ Low" />
          </div>
        </div>
      </FadeIn>

      {/* Content */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && <div className="liquid-card rounded-2xl p-6 text-center text-red-500 font-semibold">{error}</div>}
      {!loading && !error && sorted.length === 0 && (
        <div className="liquid-card rounded-2xl p-10 text-center">
          <div className="text-5xl mb-3">🎓</div>
          <p className="font-black text-foreground text-lg">{search ? "No students match your search" : "No students yet"}</p>
          <p className="text-sm text-muted-foreground font-medium mt-1">Students appear here after they register via the app</p>
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <MotionList className="space-y-3">
          {sorted.map((student, i) => {
            const xpInfo    = xpMap.get(student.id);
            const totalXP   = xpInfo?.totalXP ?? 0;
            const levelDef  = getLevelForXP(totalXP);
            const badgeCount = (xpInfo?.earnedBadgeIds ?? []).length;

            return (
              <MotionItem key={student.id}>
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="liquid-card rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Rank # */}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-gray-400 dark:text-gray-500 shrink-0"
                    style={{ background: "rgba(0,0,0,0.05)" }}>
                    {i + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0"
                    style={{ background: `linear-gradient(135deg, ${levelDef.color}, ${levelDef.color}88)` }}>
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
                        <Calendar className="w-3 h-3" /> {formatDate(student.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* XP + Level + Badges */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    {/* XP chip */}
                    {totalXP > 0 && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-black shadow-sm"
                        style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                        <Zap className="w-3 h-3 fill-white" />
                        {totalXP.toLocaleString("en-IN")}
                      </div>
                    )}
                    {/* Level badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-black shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${levelDef.color}, ${levelDef.color}88)` }}>
                      {levelDef.emoji} Lv.{levelDef.level}
                    </div>
                    {/* Badge count */}
                    {badgeCount > 0 && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black liquid-inner">
                        🏅 {badgeCount}
                      </div>
                    )}
                    {/* No XP yet */}
                    {totalXP === 0 && !xpLoading && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">No XP yet</span>
                    )}
                  </div>
                </motion.div>
              </MotionItem>
            );
          })}
        </MotionList>
      )}
    </div>
  );
}
