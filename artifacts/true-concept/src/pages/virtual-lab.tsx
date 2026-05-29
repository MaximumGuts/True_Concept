import { useState, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useGetExperiments, getGetExperimentsQueryKey } from "@workspace/api-client-react";
import { SIM_EMOJIS } from "@/components/lab/sim-registry";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { pick, type BilingualField } from "@/lib/i18n";
import { EXPERIMENT_AS, pickExpField } from "@/i18n/experimentTranslations";

const diffBadgeStyle: Record<string, React.CSSProperties> = {
  easy:   { background: "rgba(16,185,129,0.15)", color: "#059669" },
  medium: { background: "rgba(245,158,11,0.15)", color: "#d97706" },
  hard:   { background: "rgba(244,63,94,0.15)",  color: "#e11d48" },
};

const diffLabelAs: Record<string, string> = {
  easy:   "🟢 সহজ",
  medium: "🟡 মধ্যম",
  hard:   "🔴 কঠিন",
};
const diffLabelEn: Record<string, string> = {
  easy:   "🟢 Easy",
  medium: "🟡 Medium",
  hard:   "🔴 Hard",
};

const CLASS_LEVEL_AS: Record<string, string> = {
  "Class IX": "নৱম শ্ৰেণী",
  "Class X":  "দশম শ্ৰেণী",
};

const expColors = [
  { grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.25)"  },
  { grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.25)"  },
  { grad: "linear-gradient(135deg, #e58359, #f08766)", glow: "rgba(168,85,247,0.25)"  },
  { grad: "linear-gradient(135deg, #ef4444, #f87171)", glow: "rgba(244,63,94,0.25)"   },
  { grad: "linear-gradient(135deg, #f59e0b, #f97316)", glow: "rgba(249,115,22,0.25)"  },
];

const CLASS_LEVELS = ["All", "Class IX", "Class X"];

interface ChemModule {
  id: string;
  name: BilingualField<string>;
  tag: BilingualField<string>;
  desc: BilingualField<string>;
  emoji: string;
  grad: string;
  border: string;
  bg: string;
  tagColor: string;
  hover: string;
}

// Chemistry interactive modules — always present, independent of Firestore data
const CHEM_MODULES: ChemModule[] = [
  {
    id: "combination-reactions",
    name: { en: "Combination Reactions",          as: "সংযোজন বিক্ৰিয়া" },
    tag:  { en: "6 EXPERIMENTS",                  as: "৬টা পৰীক্ষা" },
    desc: { en: "Mg+O₂ · CaO+H₂O · H₂+O₂ · Haber · C+O₂ · CH₄",
            as: "Mg+O₂ · CaO+H₂O · H₂+O₂ · হেবাৰ · C+O₂ · CH₄" },
    emoji: "⚗️",
    grad: "linear-gradient(135deg, #059669, #34d399)",
    border: "rgba(52,211,153,0.35)",
    bg: "linear-gradient(135deg, rgba(5,150,105,0.18), rgba(52,211,153,0.08))",
    tagColor: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    hover: "dark:group-hover:text-emerald-300",
  },
  {
    id: "decomposition-reactions",
    name: { en: "Decomposition Reactions",        as: "বিয়োজন বিক্ৰিয়া" },
    tag:  { en: "7 EXPERIMENTS",                  as: "৭টা পৰীক্ষা" },
    desc: { en: "Thermal · Photolytic · Electrolytic decomposition",
            as: "তাপীয় · আলোকবিশ্লেষণ · তড়িৎবিশ্লেষণ বিয়োজন" },
    emoji: "🔥",
    grad: "linear-gradient(135deg, #EA580C, #FB923C)",
    border: "rgba(251,146,60,0.35)",
    bg: "linear-gradient(135deg, rgba(234,88,12,0.18), rgba(251,146,60,0.08))",
    tagColor: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    hover: "dark:group-hover:text-orange-300",
  },
  {
    id: "double-displacement",
    name: { en: "Double Displacement",            as: "দ্বৈত প্ৰতিস্থাপন" },
    tag:  { en: "5 EXPERIMENTS",                  as: "৫টা পৰীক্ষা" },
    desc: { en: "BaSO₄ · AgCl · PbI₂ · Precipitation & ion exchange",
            as: "BaSO₄ · AgCl · PbI₂ · অধঃক্ষেপণ আৰু আয়ন বিনিময়" },
    emoji: "🟡",
    grad: "linear-gradient(135deg, #CA8A04, #FDE047)",
    border: "rgba(253,224,71,0.35)",
    bg: "linear-gradient(135deg, rgba(202,138,4,0.18), rgba(253,224,71,0.08))",
    tagColor: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10",
    hover: "dark:group-hover:text-yellow-300",
  },
  {
    id: "displacement-reactions",
    name: { en: "Displacement Reactions",         as: "প্ৰতিস্থাপন বিক্ৰিয়া" },
    tag:  { en: "7 EXPERIMENTS",                  as: "৭টা পৰীক্ষা" },
    desc: { en: "Fe · Zn · Pb · Al + salt & acid · Reactivity series · Redox",
            as: "Fe · Zn · Pb · Al + লৱণ আৰু অম্ল · ক্ৰিয়াশীলতা শ্ৰেণী · ৰেডক্স" },
    emoji: "⚗️",
    grad: "linear-gradient(135deg, #1D4ED8, #60A5FA)",
    border: "rgba(96,165,250,0.35)",
    bg: "linear-gradient(135deg, rgba(29,78,216,0.18), rgba(96,165,250,0.08))",
    tagColor: "text-blue-300 border-blue-500/30 bg-blue-500/10",
    hover: "dark:group-hover:text-blue-300",
  },
  {
    id: "redox-reactions",
    name: { en: "Redox Reactions",                as: "জাৰণ-বিজাৰণ বিক্ৰিয়া" },
    tag:  { en: "6 EXPERIMENTS",                  as: "৬টা পৰীক্ষা" },
    desc: { en: "Cu oxidation · CuO reduction · Thermite · Steam+Fe · HCl+MnO₂ · H₂S",
            as: "Cu জাৰণ · CuO বিজাৰণ · থাৰমাইট · বাষ্প+Fe · HCl+MnO₂ · H₂S" },
    emoji: "⚡",
    grad: "linear-gradient(135deg, #C2410C, #FB923C)",
    border: "rgba(251,146,60,0.35)",
    bg: "linear-gradient(135deg, rgba(194,65,12,0.18), rgba(251,146,60,0.08))",
    tagColor: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    hover: "dark:group-hover:text-orange-300",
  },
  {
    id: "ionic-neutralization",
    name: { en: "Ionic Dissociation & Neutralization", as: "আয়নিক বিয়োজন আৰু প্ৰশমন" },
    tag:  { en: "4 EXPERIMENTS",                  as: "৪টা পৰীক্ষা" },
    desc: { en: "HCl+H₂O · NaOH dissociation · HCl+NaOH · HNO₃+KOH · pH scale",
            as: "HCl+H₂O · NaOH বিয়োজন · HCl+NaOH · HNO₃+KOH · pH মাপনী" },
    emoji: "💧",
    grad: "linear-gradient(135deg, #0E7490, #22D3EE)",
    border: "rgba(34,211,238,0.35)",
    bg: "linear-gradient(135deg, rgba(14,116,144,0.18), rgba(34,211,238,0.08))",
    tagColor: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
    hover: "dark:group-hover:text-cyan-300",
  },
  {
    id: "acid-metal-oxide",
    name: { en: "Acids, Metals & Oxides",         as: "অম্ল, ধাতু আৰু অক্সাইড" },
    tag:  { en: "7 EXPERIMENTS",                  as: "৭টা পৰীক্ষা" },
    desc: { en: "Zn+H₂SO₄ · Zn+HCl · Zn+NaOH · CuO+HCl · CuO+H₂SO₄ · CO₂+Ca(OH)₂ · CO₂+NaOH",
            as: "Zn+H₂SO₄ · Zn+HCl · Zn+NaOH · CuO+HCl · CuO+H₂SO₄ · CO₂+Ca(OH)₂ · CO₂+NaOH" },
    emoji: "⚗️",
    grad: "linear-gradient(135deg, #1D4ED8, #10B981)",
    border: "rgba(59,130,246,0.35)",
    bg: "linear-gradient(135deg, rgba(29,78,216,0.18), rgba(16,185,129,0.08))",
    tagColor: "text-blue-300 border-blue-500/30 bg-blue-500/10",
    hover: "dark:group-hover:text-blue-300",
  },
  {
    id: "carbonate-reactions",
    name: { en: "Carbonates & Hydrogencarbonates", as: "কাৰ্বনেট আৰু হাইড্ৰজেনকাৰ্বনেট" },
    tag:  { en: "5 EXPERIMENTS",                  as: "৫টা পৰীক্ষা" },
    desc: { en: "Na₂CO₃+HCl · NaHCO₃+HCl · Na₂CO₃+CH₃COOH · NaHCO₃+CH₃COOH · CaCO₃+CO₂+H₂O",
            as: "Na₂CO₃+HCl · NaHCO₃+HCl · Na₂CO₃+CH₃COOH · NaHCO₃+CH₃COOH · CaCO₃+CO₂+H₂O" },
    emoji: "🫧",
    grad: "linear-gradient(135deg, #1D4ED8, #34D399)",
    border: "rgba(52,211,153,0.35)",
    bg: "linear-gradient(135deg, rgba(29,78,216,0.18), rgba(52,211,153,0.08))",
    tagColor: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    hover: "dark:group-hover:text-emerald-300",
  },
  {
    id: "industrial-chemicals",
    name: { en: "Industrial Chemicals from Salt",  as: "লৱণৰ পৰা শিল্প ৰাসায়নিক" },
    tag:  { en: "5 PROCESSES",                    as: "৫টা প্ৰক্ৰিয়া" },
    desc: { en: "NaOH · Bleaching Powder · Baking Soda · Washing Soda · Plaster of Paris",
            as: "NaOH · বিৰঞ্জন চূৰ্ণ · বেকিং চোডা · ধোৱা চোডা · প্লাষ্টাৰ অৱ পেৰিছ" },
    emoji: "🏭",
    grad: "linear-gradient(135deg, #B45309, #FCD34D)",
    border: "rgba(251,191,36,0.35)",
    bg: "linear-gradient(135deg, rgba(180,83,9,0.18), rgba(252,211,77,0.08))",
    tagColor: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10",
    hover: "dark:group-hover:text-yellow-300",
  },
  {
    id: "reactive-metals",
    name: { en: "Reactions with Oxygen & Water",   as: "অক্সিজেন আৰু পানীৰ সৈতে বিক্ৰিয়া" },
    tag:  { en: "8 EXPERIMENTS",                  as: "৮টা পৰীক্ষা" },
    desc: { en: "Na · Mg · Zn · Cu · Al · Flame tests & Amphoteric nature",
            as: "Na · Mg · Zn · Cu · Al · শিখা পৰীক্ষা আৰু উভধৰ্মী প্ৰকৃতি" },
    emoji: "🔥",
    grad: "linear-gradient(135deg, #9f1239, #f43f5e)",
    border: "rgba(244,63,94,0.35)",
    bg: "linear-gradient(135deg, rgba(159,18,57,0.18), rgba(244,63,94,0.08))",
    tagColor: "text-rose-300 border-rose-500/30 bg-rose-500/10",
    hover: "dark:group-hover:text-rose-300",
  },
  {
    id: "mineral-acids",
    name: { en: "Mineral Acids & Nitric Anomaly",  as: "খনিজ অম্ল আৰু নাইট্ৰিক বিসংগতি" },
    tag:  { en: "4 EXPERIMENTS",                  as: "৪টা পৰীক্ষা" },
    desc: { en: "Fe+HNO₃ · Cu+HNO₃ · Mg+HNO₃ · Cu+Conc.H₂SO₄ · Gas Evolution",
            as: "Fe+HNO₃ · Cu+HNO₃ · Mg+HNO₃ · Cu+ঘন H₂SO₄ · গেছ নিৰ্গমন" },
    emoji: "🧪",
    grad: "linear-gradient(135deg, #0f766e, #06b6d4)",
    border: "rgba(6,182,212,0.35)",
    bg: "linear-gradient(135deg, rgba(15,118,110,0.18), rgba(6,182,212,0.08))",
    tagColor: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
    hover: "dark:group-hover:text-cyan-300",
  },
  {
    id: "organic-reactions",
    name: { en: "Organic Synthesis Lab",           as: "জৈৱ সংশ্লেষণ পৰীক্ষাগাৰ" },
    tag:  { en: "4 SYNTHESES",                    as: "৪টা সংশ্লেষণ" },
    desc: { en: "Esterification · Saponification · Scum Formation · Hydrogenation",
            as: "এষ্টাৰিফিকেচন · চাবানিকৰণ · স্কাম গঠন · হাইড্ৰজেনিকৰণ" },
    emoji: "⚗️",
    grad: "linear-gradient(135deg, #4338ca, #a855f7)",
    border: "rgba(168,85,247,0.35)",
    bg: "linear-gradient(135deg, rgba(67,56,202,0.18), rgba(168,85,247,0.08))",
    tagColor: "text-purple-300 border-purple-500/30 bg-purple-500/10",
    hover: "dark:group-hover:text-purple-300",
  },
];

interface BiologyModule {
  id: string;
  name: BilingualField<string>;
  tag: BilingualField<string>;
  desc: BilingualField<string>;
  emoji: string;
  grad: string;
  border: string;
  bg: string;
  tagColor: string;
  hover: string;
}

const BIOLOGY_MODULES: BiologyModule[] = [
  {
    id: "animal-cell",
    name: { en: "Explore Animal Cell",            as: "প্ৰাণী কোষ অন্বেষণ" },
    tag:  { en: "2D DIAGRAM",                     as: "২D চিত্ৰ" },
    desc: { en: "Interactive organelles · Live biological functions · AAA Quality",
            as: "ক্লিকযোগ্য কোষাঙ্গ · জীৱিত জৈৱিক কাৰ্য · উচ্চমানৰ" },
    emoji: "🔬",
    grad: "linear-gradient(135deg, #047857, #10b981)",
    border: "rgba(16,185,129,0.35)",
    bg: "linear-gradient(135deg, rgba(4,120,87,0.18), rgba(16,185,129,0.08))",
    tagColor: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    hover: "dark:group-hover:text-emerald-300",
  },
  {
    id: "plant-cell",
    name: { en: "Explore Plant Cell",             as: "উদ্ভিদ কোষ অন্বেষণ" },
    tag:  { en: "2D DIAGRAM",                     as: "২D চিত্ৰ" },
    desc: { en: "Cell wall · Chloroplasts · Central vacuole · NCERT Aligned",
            as: "কোষ প্ৰাচীৰ · হৰিতকণা · কেন্দ্ৰীয় গহ্বৰ · NCERT অনুসৰি" },
    emoji: "🌿",
    grad: "linear-gradient(135deg, #65a30d, #84cc16)",
    border: "rgba(132,204,22,0.35)",
    bg: "linear-gradient(135deg, rgba(101,163,13,0.18), rgba(132,204,22,0.08))",
    tagColor: "text-lime-300 border-lime-500/30 bg-lime-500/10",
    hover: "dark:group-hover:text-lime-300",
  },
  {
    id: "respiratory-system",
    name: { en: "Human Respiratory System",       as: "মানৱ শ্বসন তন্ত্ৰ" },
    tag:  { en: "LIVE ANIMATION",                 as: "জীৱন্ত এনিমেশ্যন" },
    desc: { en: "12 organs · Live breathing cycle · O₂/CO₂ exchange · Alveoli visualization",
            as: "১২টা অংগ · জীৱন্ত শ্বসন চক্ৰ · O₂/CO₂ বিনিময় · বায়ুকোষ দৰ্শন" },
    emoji: "🫁",
    grad: "linear-gradient(135deg, #0e7490, #0ea5e9)",
    border: "rgba(14,165,233,0.35)",
    bg: "linear-gradient(135deg, rgba(14,116,144,0.18), rgba(14,165,233,0.08))",
    tagColor: "text-sky-300 border-sky-500/30 bg-sky-500/10",
    hover: "dark:group-hover:text-sky-300",
  },
  {
    id: "digestive-system",
    name: { en: "Human Digestive System",         as: "মানৱ পাচন তন্ত্ৰ" },
    tag:  { en: "LIVE ANIMATION",                 as: "জীৱন্ত এনিমেশ্যন" },
    desc: { en: "12 organs · Live digestion journey · Peristalsis · NCERT Exam notes",
            as: "১২টা অংগ · জীৱন্ত পাচন যাত্ৰা · ক্ৰম-সংকোচন · NCERT পৰীক্ষাৰ টোকা" },
    emoji: "🫀",
    grad: "linear-gradient(135deg, #0e7490, #10b981)",
    border: "rgba(16,185,129,0.35)",
    bg: "linear-gradient(135deg, rgba(14,116,144,0.18), rgba(16,185,129,0.08))",
    tagColor: "text-teal-300 border-teal-500/30 bg-teal-500/10",
    hover: "dark:group-hover:text-teal-300",
  },
  {
    id: "heart-circulation",
    name: { en: "Heart & Blood Circulation",      as: "হৃদপিণ্ড আৰু তেজ পৰিবহন" },
    tag:  { en: "DOUBLE CIRCULATION",             as: "দ্বৈত পৰিবহন" },
    desc: { en: "16 structures · 4 chambers · Valves · Pulmonary & Systemic circuits · NCERT",
            as: "১৬টা গঠন · ৪টা প্ৰকোষ্ঠ · কপাটিকা · ফুসফুসীয় আৰু দৈহিক পৰিবহন · NCERT" },
    emoji: "❤️",
    grad: "linear-gradient(135deg, #991b1b, #dc2626)",
    border: "rgba(220,38,38,0.35)",
    bg: "linear-gradient(135deg, rgba(153,27,27,0.18), rgba(220,38,38,0.08))",
    tagColor: "text-red-300 border-red-500/30 bg-red-500/10",
    hover: "dark:group-hover:text-red-300",
  },
  {
    id: "excretory-system",
    name: { en: "Excretory System & Nephron",     as: "বৰ্জ্যনিষ্কাষণ তন্ত্ৰ আৰু নেফ্ৰন" },
    tag:  { en: "LIVE FILTRATION",                as: "জীৱন্ত ফিল্টাৰিং" },
    desc: { en: "Kidneys · Nephron · Blood filtration · Urine formation · ADH & Aldosterone · NCERT",
            as: "বৃক্ক · নেফ্ৰন · তেজ ফিল্টাৰিং · মূত্ৰ গঠন · ADH আৰু এলডোষ্টেৰন · NCERT" },
    emoji: "🫘",
    grad: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    border: "rgba(37,99,235,0.35)",
    bg: "linear-gradient(135deg, rgba(30,58,138,0.18), rgba(37,99,235,0.08))",
    tagColor: "text-blue-300 border-blue-500/30 bg-blue-500/10",
    hover: "dark:group-hover:text-blue-300",
  },
];

export default function VirtualLabPage() {
  const [, params] = useRoute("/virtual-lab/:subject");
  const subjectParam = params?.subject;
  const isSubjectRoute = subjectParam === "physics" || subjectParam === "chemistry" || subjectParam === "biology";

  if (isSubjectRoute) {
    return <SubjectLabPage subject={subjectParam === "physics" ? "Physics" : subjectParam === "chemistry" ? "Chemistry" : "Biology"} />;
  }
  return <LabHomePage />;
}

function LabHomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <div className="relative overflow-hidden liquid-dark rounded-3xl p-8 text-white mb-8">
        <div className="absolute top-0 right-0 text-[160px] opacity-10 leading-none pointer-events-none">🔬</div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
        <div className="relative">
          <div className="text-4xl mb-3">🔬</div>
          <h1 className="font-black text-3xl sm:text-4xl mb-2" data-testid="heading-virtual-lab">Virtual Science Lab</h1>
          <p className="text-orange-300 font-bold text-lg">Choose your lab and start experimenting!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { id: "physics",   name: "Physics Lab",   emoji: "⚛️", desc: "Motion, energy, light, electricity & sound", grad: "linear-gradient(135deg, #3b82f6, #6366f1)", glow: "rgba(99,102,241,0.4)"  },
          { id: "chemistry", name: "Chemistry Lab", emoji: "🧪", desc: "Reactions, mixtures, crystallization & more",  grad: "linear-gradient(135deg, #10b981, #14b8a6)", glow: "rgba(20,184,166,0.4)" },
          { id: "biology",   name: "Biology Lab",   emoji: "🧬", desc: "Cells, organisms, anatomy & ecosystems",   grad: "linear-gradient(135deg, #a855f7, #d946ef)", glow: "rgba(217,70,239,0.4)" },
        ].map((lab) => (
          <Link key={lab.id} href={`/virtual-lab/${lab.id}`}>
            <div data-testid={`card-lab-${lab.id}`} className="group liquid-card rounded-3xl p-7 card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-40 -translate-y-12 translate-x-12" style={{ background: lab.glow }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4" style={{ background: lab.grad }}>
                  {lab.emoji}
                </div>
                <h3 className="font-black text-2xl text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-700 dark:hover:text-orange-300 transition-colors">{lab.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{lab.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-orange-700 dark:text-orange-300">
                  Open Lab <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SubjectLabPage({ subject }: { subject: "Physics" | "Chemistry" | "Biology" }) {
  const { lang } = useLanguage();
  // All users (students, admins, anon) start with "All" and can opt-in to filter.
  const [selectedClass, setSelectedClass] = useState<string>("All");

  const { data: allExperiments, isLoading } = useGetExperiments(
    selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined,
    { query: { queryKey: getGetExperimentsQueryKey(selectedClass !== "All" ? { classLevel: selectedClass as "Class IX" | "Class X" } : undefined) } }
  );

  const experiments = useMemo(
    () => allExperiments?.filter((e) => e.subject === subject && e.type !== "density") ?? [],
    [allExperiments, subject]
  );

  const heroGrad = subject === "Physics"
    ? "linear-gradient(135deg, #1e3a8a, #4338ca)"
    : subject === "Chemistry" 
    ? "linear-gradient(135deg, #064e3b, #115e59)"
    : "linear-gradient(135deg, #4c1d95, #7e22ce)"; // Biology

  const emoji = subject === "Physics" ? "⚛️" : subject === "Chemistry" ? "🧪" : "🧬";

  // Built-in interactive modules count
  const modCount = subject === "Chemistry" ? CHEM_MODULES.length : subject === "Biology" ? BIOLOGY_MODULES.length : 0;
  const totalCount = experiments.length + modCount;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-8 blob-bg">
      <div className="flex items-center justify-between mb-6">
        <Link href="/virtual-lab">
          <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors" data-testid="button-back-virtual-lab">
            <ArrowLeft className="w-4 h-4" /> {lang === "as" ? "ভাৰ্চুৱেল লেব" : "Virtual Lab"}
          </button>
        </Link>
        <LanguageToggle />
      </div>

      {/* Hero — Biology shows Assamese strings when toggle is on; other subjects stay English */}
      <div className="relative overflow-hidden rounded-3xl p-7 text-white mb-6 shadow-xl" style={{ background: heroGrad }}>
        <div className="absolute top-0 right-0 text-[140px] opacity-10 leading-none pointer-events-none">{emoji}</div>
        <div className="relative">
          <div className="text-3xl mb-2">{emoji}</div>
          <h1 className="font-black text-3xl sm:text-4xl mb-2" data-testid="heading-subject-lab">
            {lang === "as" && subject === "Biology" ? "জীৱ বিজ্ঞান গৱেষণাগাৰ"
              : lang === "as" && subject === "Chemistry" ? "ৰসায়ন পৰীক্ষাগাৰ"
              : `${subject} Lab`}
          </h1>
          <p className="text-white/80 font-bold">
            {lang === "as" && subject === "Biology"
              ? `${totalCount}টা পৰীক্ষাযোগ্য কাৰ্যকলাপ`
              : lang === "as" && subject === "Chemistry"
              ? `${totalCount}টা ইন্টাৰেক্টিভ পৰীক্ষা`
              : `${totalCount} interactive experiment${totalCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Class Filter — visible to everyone, optional opt-in. */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {CLASS_LEVELS.map((cl) => (
          <button key={cl} onClick={() => setSelectedClass(cl)}
            data-testid={`filter-${cl.toLowerCase().replace(/\s+/g, "-")}`}
            className={`px-5 py-2 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
              selectedClass === cl ? "text-white shadow-lg scale-105" : "liquid-card text-gray-700 dark:text-gray-200 hover:scale-105"
            }`}
            style={selectedClass === cl ? { background: heroGrad } : {}}>
            {cl === "All"
              ? (lang === "as" ? "🌟 সকলো" : "🌟 All")
              : cl === "Class IX"
              ? (lang === "as" ? "📗 নৱম শ্ৰেণী" : "📗 Class IX")
              : (lang === "as" ? "📘 দশম শ্ৰেণী" : "📘 Class X")}
          </button>
        ))}
      </div>

      {/* Experiments grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 liquid-card rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* ── Built-in interactive module cards ────────── */}
          {subject === "Biology" && BIOLOGY_MODULES.map((mod) => (
            <Link key={mod.id} href={`/virtual-lab/biology/${mod.id}`} className="block">
              <div className="group relative overflow-hidden rounded-3xl card-hover h-full border"
                style={{ background: mod.bg, borderColor: mod.border }}>
                <div className="h-2" style={{ background: mod.grad }} />
                <div className="absolute top-0 right-3 text-[90px] opacity-10 leading-none pointer-events-none select-none">{mod.emoji}</div>
                <div className="relative p-5 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shrink-0" style={{ background: mod.grad }}>
                    <div className="absolute inset-0 rounded-xl blur-md opacity-50" />
                    <span className="relative">{mod.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${mod.tagColor}`}>{pick(mod.tag, lang)}</span>
                    <h3 className={`font-black text-base text-gray-900 dark:text-gray-100 group-hover:opacity-80 transition-colors mt-1 ${mod.hover}`}>{pick(mod.name, lang)}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{pick(mod.desc, lang)}</p>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: mod.grad }}>
                    <span className="text-white text-xs">▶</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {subject === "Chemistry" && CHEM_MODULES.map((mod) => (
            <Link key={mod.id} href={`/virtual-lab/${mod.id}`} className="block">
              <div className="group relative overflow-hidden rounded-3xl card-hover h-full border"
                style={{ background: mod.bg, borderColor: mod.border }}>
                <div className="h-2" style={{ background: mod.grad }} />
                <div className="absolute top-0 right-3 text-[90px] opacity-10 leading-none pointer-events-none select-none">{mod.emoji}</div>
                <div className="relative p-5 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shrink-0" style={{ background: mod.grad }}>
                    <div className="absolute inset-0 rounded-xl blur-md opacity-50" />
                    <span className="relative">{mod.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${mod.tagColor}`}>{pick(mod.tag, lang)}</span>
                    <h3 className={`font-black text-base text-gray-900 dark:text-gray-100 group-hover:opacity-80 transition-colors mt-1 ${mod.hover}`}>{pick(mod.name, lang)}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{pick(mod.desc, lang)}</p>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: mod.grad }}>
                    <span className="text-white text-xs">▶</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* ── Firestore-backed individual experiments ──────────────────── */}
          {experiments.map((exp, i) => {
            const emoji = SIM_EMOJIS[exp.type] ?? "🔬";
            const col = expColors[i % expColors.length];
            const diffStyle = diffBadgeStyle[exp.difficulty];
            const diffText = lang === "as"
              ? (diffLabelAs[exp.difficulty] ?? exp.difficulty)
              : (diffLabelEn[exp.difficulty] ?? exp.difficulty);

            // Apply the Assamese overlay for Firestore-backed title/objective
            const tr = EXPERIMENT_AS[exp.type];
            const cardTitle     = pickExpField(exp.title,     tr, "title",     lang);
            const cardObjective = pickExpField(exp.objective, tr, "objective", lang);
            const classChip = lang === "as"
              ? (CLASS_LEVEL_AS[exp.classLevel] ?? exp.classLevel)
              : exp.classLevel;
            return (
              <Link key={exp.id} href={`/virtual-lab/${exp.id}`} className="block">
                <div data-testid={`card-experiment-${exp.id}`} className="group liquid-card rounded-3xl overflow-hidden card-hover h-full">
                  <div className="h-2" style={{ background: col.grad }} />
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg shrink-0" style={{ background: col.grad }}>
                        <div className="absolute inset-0 rounded-2xl blur-md opacity-50" style={{ background: col.glow }} />
                        <span className="relative">{emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 dark:text-gray-100 group-hover:text-orange-700 dark:hover:text-orange-300 transition-colors leading-snug">{cardTitle}</h3>
                        <div className="flex gap-1.5 flex-wrap items-center mt-1">
                          <span className="text-[10px] font-black liquid-inner text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{classChip}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={diffStyle}>{diffText}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 font-medium mb-3">{cardObjective}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                        {lang === "as" ? "আৰম্ভ কৰিবলৈ টিপক" : "Tap to start"}
                      </span>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform" style={{ background: col.grad }}>
                        <span className="text-white text-xs">▶</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* ── Empty state ────── */}
          {totalCount === 0 && (
            <div className="col-span-2 liquid-panel rounded-3xl text-center py-16">
              <div className="text-5xl mb-3">🔬</div>
              <p className="font-black text-lg text-gray-900 dark:text-gray-100">
                {lang === "as"
                  ? `${subject === "Physics" ? "পদাৰ্থ বিজ্ঞান" : subject === "Chemistry" ? "ৰসায়ন" : "জীৱ বিজ্ঞান"}ত ${selectedClass === "All" ? "সকলো শ্ৰেণী" : (CLASS_LEVEL_AS[selectedClass] ?? selectedClass)}ৰ বাবে এতিয়ালৈকে কোনো পৰীক্ষা নাই`
                  : `No experiments yet for ${selectedClass} in ${subject}`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
