/**
 * Displacement Reactions Virtual Lab — Production-Grade Module
 * 7 interactive displacement experiments with canvas particles,
 * SVG apparatus, molecular visualization, live observations, CBSE quiz.
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";
import {
  ArrowLeft, Zap, Thermometer, Shield, FlaskConical,
  RotateCcw, Play, AlertTriangle, CheckCircle, Info,
  ChevronRight, BarChart2,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ExpId = "fe-cuso4" | "zn-cuso4" | "pb-cucl2" | "zn-h2so4" | "zn-hcl" | "fe-hcl" | "al-cucl2";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "bubble-acid" | "bubble-salt" | "deposit-copper" | "heat-exo" | "none";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; blur: number; type: string;
}

interface Exp {
  id: ExpId; num: number;
  // Bilingual student-facing text
  title: BilingualField<string>;
  subtitle: BilingualField<string>;
  description: BilingualField<string>;
  realWorld: BilingualField<string>;
  examNote: BilingualField<string>;
  safety: BilingualField<string[]>;
  steps: { label: BilingualField<string>; desc: BilingualField<string> }[];
  observations: BilingualField<string[]>;
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
  // Language-neutral
  equation: string; ionicEq: string;
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  solutionColor: { before: string; after: string };
  metalColor: string; depositColor: string;
  hazard: "LOW" | "MEDIUM" | "HIGH";
  reactivity: "Moderate" | "High" | "Very High";
  isAcid: boolean; isExo: boolean;
  pmode: PMode;
}

const REACTIVITY_LABEL: Record<Exp["reactivity"], BilingualField<string>> = {
  Moderate:    { en: "Moderate",    as: "মধ্যম" },
  High:        { en: "High",        as: "উচ্চ" },
  "Very High": { en: "Very High",   as: "অতি উচ্চ" },
};

// ═══════════════════════════════════════════════════════════
// EXPERIMENT CONFIG
// ═══════════════════════════════════════════════════════════

const EXPERIMENTS: Exp[] = [
  {
    id: "fe-cuso4", num: 1,
    title: { en: "Iron + Copper Sulphate", as: "লোহা + কপাৰ ছালফেট" },
    subtitle: { en: "Metal Displacement", as: "ধাতু প্ৰতিস্থাপন" },
    equation: "Fe + CuSO₄ → FeSO₄ + Cu",
    ionicEq: "Fe + Cu²⁺ → Fe²⁺ + Cu",
    accent: "#FB923C", glow: "rgba(251,146,60,0.4)", gradFrom: "#C2410C", gradTo: "#FB923C", emoji: "🔩",
    solutionColor: { before: "#1E40AF", after: "#16A34A" },
    metalColor: "#78716C", depositColor: "#B45309",
    hazard: "LOW", reactivity: "Moderate", isAcid: false, isExo: false,
    description: { en: "Iron is more reactive than copper. When an iron nail is placed in blue copper sulphate solution, iron displaces copper. The blue solution turns pale green (FeSO₄) and reddish-brown copper deposits on the nail.", as: "তামতকৈ লোহা বেছি সক্ৰিয়। লোহাৰ গজাল নীলা কপাৰ ছালফেট সমাধানত ৰাখিলে লোহাই তামক প্ৰতিস্থাপন কৰে। নীলা সমাধান পাতল সেউজীয়া (FeSO₄) হয় আৰু গজালত মুগা-ৰঙা তাম জমা হয়।" },
    realWorld: { en: "Copper extraction from ore · Galvanic cells · Electroplating · Corrosion studies", as: "আকৰিকৰ পৰা তাম নিষ্কাষণ · গেলভেনিক কোষ · ইলেক্ট্ৰ’প্লেটিং · ক্ষয় অধ্যয়ন" },
    examNote: { en: "Fe > Cu in reactivity series. Blue CuSO₄ → pale green FeSO₄. Reddish-brown Cu deposits. This is a redox reaction: Fe is oxidised, Cu²⁺ is reduced.", as: "সক্ৰিয়তা শ্ৰেণীত Fe > Cu। নীলা CuSO₄ → পাতল সেউজীয়া FeSO₄। মুগা-ৰঙা Cu জমা হয়। এইটো এক জাৰণ-বিজাৰণ বিক্ৰিয়া: Fe জাৰিত হয়, Cu²⁺ বিজাৰিত হয়।" },
    safety: { en: ["Wear gloves — CuSO₄ is toxic", "Wash hands thoroughly after", "Dispose of solution properly"], as: ["দস্তানা পিন্ধক — CuSO₄ বিষাক্ত", "কাম শেষৰ পিছত হাত ভালদৰে ধুব", "সমাধান সঠিকভাৱে নিষ্পত্তি কৰক"] },
    steps: [
      { label: { en: "Prepare Solution", as: "সমাধান প্ৰস্তুত কৰক" }, desc: { en: "Take blue copper sulphate solution in a beaker. Note the deep blue colour due to Cu²⁺ ions.", as: "বিকাৰত নীলা কপাৰ ছালফেট সমাধান লওক। Cu²⁺ আয়নৰ বাবে গাঢ় নীলা ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Insert Iron Nail", as: "লোহাৰ গজাল ভৰাওক" }, desc: { en: "Carefully lower a clean iron nail into the CuSO₄ solution using forceps. Observe immediately.", as: "ফৰচেপৰ সহায়ত পৰিষ্কাৰ লোহাৰ গজাল সাৱধানে CuSO₄ সমাধানত ভৰাওক। তৎক্ষণাৎ লক্ষ্য কৰক।" } },
      { label: { en: "Observe Reaction", as: "বিক্ৰিয়া লক্ষ্য কৰক" }, desc: { en: "Reddish-brown copper deposits on the nail. The blue solution gradually turns pale green.", as: "গজালত মুগা-ৰঙা তাম জমা হয়। নীলা সমাধান ক্ৰমে পাতল সেউজীয়া হয়।" } },
      { label: { en: "Record Results", as: "ফলাফল লিখক" }, desc: { en: "Remove the nail after 10 minutes. Copper coating is clearly visible. Solution is now pale green FeSO₄.", as: "১০ মিনিটৰ পিছত গজাল উঠাওক। তাম প্ৰলেপ স্পষ্টভাৱে দৃশ্যমান। সমাধান এতিয়া পাতল সেউজীয়া FeSO₄।" } },
    ],
    observations: { en: ["Blue CuSO₄ solution gradually turns pale green", "Reddish-brown copper deposits on iron nail", "Iron surface shows corrosion", "Iron nail becomes coated with copper layer"], as: ["নীলা CuSO₄ সমাধান ক্ৰমে পাতল সেউজীয়া হয়", "লোহাৰ গজালত মুগা-ৰঙা তাম জমা হয়", "লোহাৰ পৃষ্ঠত ক্ষয় দেখা যায়", "লোহাৰ গজাল তামৰ স্তৰেৰে আবৃত হয়"] },
    pmode: "deposit-copper",
    quiz: [
      { q: { en: "Why does the blue CuSO₄ solution turn pale green?", as: "নীলা CuSO₄ সমাধান কিয় পাতল সেউজীয়া হয়?" }, opts: { en: ["Fe₂O₃ forms", "FeSO₄ (pale green) is formed", "CuSO₄ evaporates", "CuO precipitates"], as: ["Fe₂O₃ গঠিত হয়", "FeSO₄ (পাতল সেউজীয়া) গঠিত হয়", "CuSO₄ বাষ্পীভূত হয়", "CuO অৱক্ষেপিত হয়"] }, ans: 1 },
      { q: { en: "What is the reddish-brown deposit formed on the iron nail?", as: "লোহাৰ গজালত গঠিত মুগা-ৰঙা জমা কি?" }, opts: { en: ["Iron oxide", "Copper sulphate", "Copper metal", "Iron sulphate"], as: ["আইৰন অক্সাইড", "কপাৰ ছালফেট", "তাম ধাতু", "আইৰন ছালফেট"] }, ans: 2 },
      { q: { en: "Which metal is more reactive?", as: "কোন ধাতু অধিক সক্ৰিয়?" }, opts: { en: ["Copper", "Iron", "Both equally", "Neither"], as: ["তাম", "লোহা", "দুয়ো সমান", "কোনোটোৱে নহয়"] }, ans: 1 },
      { q: { en: "This reaction is an example of:", as: "এই বিক্ৰিয়া ইয়াৰ উদাহৰণ:" }, opts: { en: ["Combination reaction", "Decomposition", "Single displacement", "Double displacement"], as: ["সংযোগ বিক্ৰিয়া", "বিযোজন", "এক ধৰণৰ প্ৰতিস্থাপন", "দ্বৈত প্ৰতিস্থাপন"] }, ans: 2 },
    ],
  },
  {
    id: "zn-cuso4", num: 2,
    title: { en: "Zinc + Copper Sulphate", as: "জিংক + কপাৰ ছালফেট" },
    subtitle: { en: "Metal Displacement", as: "ধাতু প্ৰতিস্থাপন" },
    equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
    ionicEq: "Zn + Cu²⁺ → Zn²⁺ + Cu",
    accent: "#60A5FA", glow: "rgba(96,165,250,0.4)", gradFrom: "#1D4ED8", gradTo: "#60A5FA", emoji: "🔷",
    solutionColor: { before: "#1E40AF", after: "#F8FAFC" },
    metalColor: "#9CA3AF", depositColor: "#B45309",
    hazard: "LOW", reactivity: "High", isAcid: false, isExo: false,
    description: { en: "Zinc is more reactive than copper. When zinc is placed in CuSO₄ solution, zinc rapidly displaces copper. The blue colour completely disappears as colourless ZnSO₄ forms, and copper deposits on zinc.", as: "তামতকৈ জিংক বেছি সক্ৰিয়। জিংক CuSO₄ সমাধানত ৰাখিলে জিংকে দ্ৰুতগতিত তামক প্ৰতিস্থাপন কৰে। বৰ্ণহীন ZnSO₄ গঠিত হোৱাৰ লগে লগে নীলা ৰং সম্পূৰ্ণৰূপে অদৃশ্য হয়, আৰু জিংকত তাম জমা হয়।" },
    realWorld: { en: "Zinc plating · Galvanic protection · Battery technology · Metal recovery", as: "জিংক প্লেটিং · গেলভেনিক সুৰক্ষা · বেটাৰী প্ৰযুক্তি · ধাতু পুনৰুদ্ধাৰ" },
    examNote: { en: "Zn > Cu in reactivity series. Blue CuSO₄ → colourless ZnSO₄. Cu deposits. Zinc oxidised (Zn → Zn²⁺), copper reduced (Cu²⁺ → Cu). Reaction is faster than Fe + CuSO₄.", as: "সক্ৰিয়তা শ্ৰেণীত Zn > Cu। নীলা CuSO₄ → বৰ্ণহীন ZnSO₄। Cu জমা হয়। জিংক জাৰিত হয় (Zn → Zn²⁺), তাম বিজাৰিত হয় (Cu²⁺ → Cu)। Fe + CuSO₄-তকৈ দ্ৰুততৰ বিক্ৰিয়া।" },
    safety: { en: ["CuSO₄ is toxic — handle with care", "Wear safety goggles", "Avoid skin contact"], as: ["CuSO₄ বিষাক্ত — সাৱধানে নাড়ক", "সুৰক্ষা চশমা পিন্ধক", "চামৰিৰ সৈতে স্পৰ্শ এৰক"] },
    steps: [
      { label: { en: "Prepare Beaker", as: "বিকাৰ প্ৰস্তুত কৰক" }, desc: { en: "Fill beaker with blue CuSO₄ solution. Note the vivid blue colour of copper ions.", as: "বিকাৰটো নীলা CuSO₄ সমাধানেৰে ভৰাওক। কপাৰ আয়নৰ চটচটে নীলা ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Insert Zinc Strip", as: "জিংক ফালি ভৰাওক" }, desc: { en: "Place a clean zinc strip in the solution. Observe the immediate surface reaction.", as: "সমাধানত পৰিষ্কাৰ জিংকৰ ফালি ৰাখক। তৎক্ষণাৎ পৃষ্ঠ বিক্ৰিয়া লক্ষ্য কৰক।" } },
      { label: { en: "Observe Decolorisation", as: "বিৰঙীকৰণ লক্ষ্য কৰক" }, desc: { en: "Blue colour fades rapidly as Cu²⁺ ions are reduced to Cu metal on the zinc surface.", as: "Cu²⁺ আয়ন জিংকৰ পৃষ্ঠত Cu ধাতুলৈ বিজাৰিত হোৱাৰ লগে লগে নীলা ৰং দ্ৰুত ম্লান হয়।" } },
      { label: { en: "Confirm Products", as: "উৎপাদ নিশ্চিত কৰক" }, desc: { en: "Colourless ZnSO₄ solution and copper-coated zinc strip confirm the reaction.", as: "বৰ্ণহীন ZnSO₄ সমাধান আৰু তাম-প্ৰলেপিত জিংক ফালিয়ে বিক্ৰিয়া নিশ্চিত কৰে।" } },
    ],
    observations: { en: ["Blue CuSO₄ rapidly turns colourless", "Reddish-brown copper deposits on zinc strip", "Zinc surface becomes covered with Cu", "No gas evolved — clean displacement"], as: ["নীলা CuSO₄ দ্ৰুত বৰ্ণহীন হয়", "জিংক ফালিত মুগা-ৰঙা তাম জমা হয়", "জিংকৰ পৃষ্ঠ Cu-ৰে আবৃত হয়", "কোনো গেছ নিৰ্গত নহয় — পৰিষ্কাৰ প্ৰতিস্থাপন"] },
    pmode: "deposit-copper",
    quiz: [
      { q: { en: "Why does the blue colour completely disappear?", as: "নীলা ৰং কিয় সম্পূৰ্ণৰূপে অদৃশ্য হয়?" }, opts: { en: ["Zn absorbs colour", "Cu²⁺ ions are all reduced to Cu", "ZnSO₄ is blue", "Water dilutes it"], as: ["Zn-এ ৰং শোষণ কৰে", "সকলো Cu²⁺ আয়ন Cu লৈ বিজাৰিত হয়", "ZnSO₄ নীলা", "পানীয়ে ই পাতল কৰে"] }, ans: 1 },
      { q: { en: "Which ion is reduced in this reaction?", as: "এই বিক্ৰিয়াত কোন আয়ন বিজাৰিত হয়?" }, opts: { en: ["Zn²⁺", "SO₄²⁻", "Cu²⁺", "H⁺"], as: ["Zn²⁺", "SO₄²⁻", "Cu²⁺", "H⁺"] }, ans: 2 },
      { q: { en: "In the reactivity series, zinc is placed:", as: "সক্ৰিয়তা শ্ৰেণীত জিংক ৰখা হৈছে:" }, opts: { en: ["Below copper", "Above copper", "Same as copper", "Not in the series"], as: ["তামৰ তলত", "তামৰ ওপৰত", "তামৰ সমান", "শ্ৰেণীত নাই"] }, ans: 1 },
      { q: { en: "The colourless solution formed is:", as: "গঠিত বৰ্ণহীন সমাধান:" }, opts: { en: ["CuSO₄", "ZnO", "ZnSO₄", "ZnCl₂"], as: ["CuSO₄", "ZnO", "ZnSO₄", "ZnCl₂"] }, ans: 2 },
    ],
  },
  {
    id: "pb-cucl2", num: 3,
    title: { en: "Lead + Copper Chloride", as: "ছীহ + কপাৰ ক্ল’ৰাইড" },
    subtitle: { en: "Metal Displacement", as: "ধাতু প্ৰতিস্থাপন" },
    equation: "Pb + CuCl₂ → PbCl₂ + Cu",
    ionicEq: "Pb + Cu²⁺ → Pb²⁺ + Cu",
    accent: "#A78BFA", glow: "rgba(167,139,250,0.4)", gradFrom: "#6D28D9", gradTo: "#A78BFA", emoji: "🔗",
    solutionColor: { before: "#0EA5E9", after: "#F1F5F9" },
    metalColor: "#6B7280", depositColor: "#B45309",
    hazard: "MEDIUM", reactivity: "Moderate", isAcid: false, isExo: false,
    description: { en: "Lead is more reactive than copper. Lead displaces copper from copper chloride solution, forming white lead chloride precipitate and depositing copper metal. This confirms lead's position above copper in the reactivity series.", as: "তামতকৈ ছীহ অধিক সক্ৰিয়। ছীহে কপাৰ ক্ল’ৰাইড সমাধানৰ পৰা তামক প্ৰতিস্থাপন কৰে, বগা ছীহ ক্ল’ৰাইড অৱক্ষেপ গঠন কৰে আৰু তাম ধাতু জমা কৰে। ইয়াৰ দ্বাৰা সক্ৰিয়তা শ্ৰেণীত তামৰ ওপৰত ছীহৰ স্থান নিশ্চিত হয়।" },
    realWorld: { en: "Lead processing · Waste water treatment · Metal recovery from solutions", as: "ছীহ প্ৰক্ৰিয়াকৰণ · পানী শোধন · সমাধানৰ পৰা ধাতু পুনৰুদ্ধাৰ" },
    examNote: { en: "Pb > Cu in reactivity. CuCl₂ solution (light blue) → PbCl₂ (white precipitate) + Cu (reddish-brown). PbCl₂ is insoluble — forms white precipitate. TOXIC reaction — ventilation required.", as: "সক্ৰিয়তাত Pb > Cu। CuCl₂ সমাধান (পাতল নীলা) → PbCl₂ (বগা অৱক্ষেপ) + Cu (মুগা-ৰঙা)। PbCl₂ অদ্ৰৱণীয় — বগা অৱক্ষেপ গঠন কৰে। বিষাক্ত বিক্ৰিয়া — বায়ু চলাচল আৱশ্যক।" },
    safety: { en: ["Lead compounds are toxic — never ingest", "Wear gloves and goggles", "Work in ventilated area", "Dispose of lead waste properly"], as: ["ছীহ যৌগ বিষাক্ত — কেতিয়াও গিলিব নলাগে", "দস্তানা আৰু চশমা পিন্ধক", "বায়ু চলাচলযুক্ত স্থানত কাম কৰক", "ছীহ আবৰ্জনা সঠিকভাৱে নিষ্পত্তি কৰক"] },
    steps: [
      { label: { en: "Prepare CuCl₂", as: "CuCl₂ প্ৰস্তুত কৰক" }, desc: { en: "Take light blue copper chloride solution. CuCl₂ gives characteristic blue-green colour to solution.", as: "পাতল নীলা কপাৰ ক্ল’ৰাইড সমাধান লওক। CuCl₂-এ সমাধানক বৈশিষ্ট্যপূৰ্ণ নীলা-সেউজীয়া ৰং দিয়ে।" } },
      { label: { en: "Insert Lead Strip", as: "ছীহৰ ফালি ভৰাওক" }, desc: { en: "Lower a lead strip into the solution. Lead being more reactive begins to displace copper.", as: "সমাধানত ছীহৰ এটা ফালি ভৰাওক। অধিক সক্ৰিয় হোৱাৰ বাবে ছীহে তামক প্ৰতিস্থাপন কৰিবলৈ আৰম্ভ কৰে।" } },
      { label: { en: "Observe Changes", as: "পৰিৱৰ্তন লক্ষ্য কৰক" }, desc: { en: "Copper deposits on lead surface. White PbCl₂ precipitate forms in solution.", as: "ছীহৰ পৃষ্ঠত তাম জমা হয়। সমাধানত বগা PbCl₂ অৱক্ষেপ গঠিত হয়।" } },
      { label: { en: "Confirm Products", as: "উৎপাদ নিশ্চিত কৰক" }, desc: { en: "Copper (reddish) on lead strip and white PbCl₂ precipitate confirm successful displacement.", as: "ছীহৰ ফালিত (মুগা-ৰঙা) তাম আৰু বগা PbCl₂ অৱক্ষেপে সফল প্ৰতিস্থাপন নিশ্চিত কৰে।" } },
    ],
    observations: { en: ["Blue-green CuCl₂ solution slowly decolourises", "Reddish copper deposits on lead strip", "White PbCl₂ precipitate forms in solution", "Solution becomes turbid due to PbCl₂"], as: ["নীলা-সেউজীয়া CuCl₂ সমাধান লাহে লাহে বৰ্ণহীন হয়", "ছীহৰ ফালিত মুগা-ৰঙা তাম জমা হয়", "সমাধানত বগা PbCl₂ অৱক্ষেপ গঠিত হয়", "PbCl₂-ৰ বাবে সমাধান ঘোলা হয়"] },
    pmode: "deposit-copper",
    quiz: [
      { q: { en: "What white precipitate is formed in this reaction?", as: "এই বিক্ৰিয়াত কি বগা অৱক্ষেপ গঠিত হয়?" }, opts: { en: ["Cu(OH)₂", "CuCl₂", "PbCl₂", "PbO"], as: ["Cu(OH)₂", "CuCl₂", "PbCl₂", "PbO"] }, ans: 2 },
      { q: { en: "Which metal is displaced from its compound?", as: "কোন ধাতু ইয়াৰ যৌগৰ পৰা প্ৰতিস্থাপিত হয়?" }, opts: { en: ["Lead", "Copper", "Iron", "Zinc"], as: ["ছীহ", "তাম", "লোহা", "জিংক"] }, ans: 1 },
      { q: { en: "Why does PbCl₂ appear as a precipitate?", as: "PbCl₂ অৱক্ষেপ হিচাপে কিয় দেখা দিয়ে?" }, opts: { en: ["It is a gas", "It is insoluble in water", "It is a coloured solid", "It evaporates"], as: ["ই এক গেছ", "ই পানীত অদ্ৰৱণীয়", "ই এক ৰঙীণ কঠিন", "ই বাষ্পীভূত হয়"] }, ans: 1 },
      { q: { en: "Lead is placed __ copper in the reactivity series:", as: "সক্ৰিয়তা শ্ৰেণীত ছীহ তামৰ __ স্থানত আছে:" }, opts: { en: ["Below", "Above", "Same level", "Not present"], as: ["তল", "ওপৰ", "একে স্তৰ", "নাই"] }, ans: 1 },
    ],
  },
  {
    id: "zn-h2so4", num: 4,
    title: { en: "Zinc + Sulphuric Acid", as: "জিংক + ছালফিউৰিক এচিড" },
    subtitle: { en: "Acid Displacement", as: "এচিড প্ৰতিস্থাপন" },
    equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    ionicEq: "Zn + 2H⁺ → Zn²⁺ + H₂↑",
    accent: "#34D399", glow: "rgba(52,211,153,0.4)", gradFrom: "#059669", gradTo: "#34D399", emoji: "⚗️",
    solutionColor: { before: "#F0FDF4", after: "#ECFDF5" },
    metalColor: "#9CA3AF", depositColor: "#D1D5DB",
    hazard: "HIGH", reactivity: "High", isAcid: true, isExo: true,
    description: { en: "Zinc reacts vigorously with dilute sulphuric acid to displace hydrogen gas. Zinc is above hydrogen in the reactivity series. The vigorous bubbling of H₂ gas is confirmed by the burning splint 'pop' test.", as: "জিংকে তনু ছালফিউৰিক এচিডৰ সৈতে প্ৰচণ্ডভাৱে বিক্ৰিয়া কৰি হাইড্ৰ’জেন গেছ প্ৰতিস্থাপন কৰে। সক্ৰিয়তা শ্ৰেণীত জিংক হাইড্ৰ’জেনৰ ওপৰত আছে। H₂ গেছৰ প্ৰচণ্ড বুদবুদক জ্বলি থকা কাঠিৰ 'পপ' পৰীক্ষাৰে নিশ্চিত কৰা হয়।" },
    realWorld: { en: "Hydrogen production · Electrolytic cells · Industrial acid cleaning · Battery manufacturing", as: "হাইড্ৰ’জেন উৎপাদন · বৈদ্যুতিক বিশ্লেষণ কোষ · ঔদ্যোগিক এচিড পৰিষ্কাৰকৰণ · বেটাৰী উৎপাদন" },
    examNote: { en: "Zn > H in reactivity — displaces H₂ from H₂SO₄. Colourless H₂ gas confirmed by burning splint (pop sound). ZnSO₄ (colourless salt) forms in solution. Reaction is exothermic.", as: "সক্ৰিয়তাত Zn > H — H₂SO₄-ৰ পৰা H₂ প্ৰতিস্থাপন কৰে। জ্বলি থকা কাঠিৰে নিশ্চিত হোৱা বৰ্ণহীন H₂ গেছ (পপ শব্দ)। সমাধানত ZnSO₄ (বৰ্ণহীন লৱণ) গঠিত হয়। বিক্ৰিয়া তাপোৎপাদক।" },
    safety: { en: ["H₂SO₄ is highly corrosive — causes burns", "H₂ is flammable — keep away from flames", "Wear acid-resistant gloves", "Goggles essential"], as: ["H₂SO₄ অতি ক্ষয়কাৰক — পোৰাব পাৰে", "H₂ দাহ্য — জ্বালাৰ পৰা দূৰত ৰাখক", "এচিড-প্ৰতিৰোধী দস্তানা পিন্ধক", "চশমা আৱশ্যক"] },
    steps: [
      { label: { en: "Set Up Apparatus", as: "যন্ত্ৰ স্থাপন কৰক" }, desc: { en: "Take dilute H₂SO₄ in a conical flask fitted with gas delivery tube. Solution should be colourless.", as: "গেছ পৰিবহন টিউবৰ সৈতে কনিকেল ফ্লাস্কত তনু H₂SO₄ লওক। সমাধান বৰ্ণহীন হ’ব লাগিব।" } },
      { label: { en: "Add Zinc Granules", as: "জিংক গ্ৰেণুল যোগ কৰক" }, desc: { en: "Add zinc granules to the acid. Vigorous effervescence begins immediately — H₂ is produced.", as: "এচিডত জিংক গ্ৰেণুল যোগ কৰক। তৎক্ষণাৎ প্ৰচণ্ড ফেচফেচাই আৰম্ভ হয় — H₂ উৎপন্ন হয়।" } },
      { label: { en: "Collect Hydrogen", as: "হাইড্ৰ’জেন সংগ্ৰহ কৰক" }, desc: { en: "Collect the colourless H₂ gas over water. Tube fills with gas slowly.", as: "বৰ্ণহীন H₂ গেছ পানীৰ ওপৰত সংগ্ৰহ কৰক। টিউব লাহে লাহে গেছেৰে ভৰে।" } },
      { label: { en: "Pop Test", as: "পপ পৰীক্ষা" }, desc: { en: "Bring a burning splint near the gas — a pop sound confirms hydrogen. ZnSO₄ remains in solution.", as: "গেছৰ ওচৰলৈ জ্বলি থকা কাঠি আনক — পপ শব্দে হাইড্ৰ’জেন নিশ্চিত কৰে। ZnSO₄ সমাধানত থাকে।" } },
    ],
    observations: { en: ["Vigorous bubbling immediately on adding Zn", "Colourless H₂ gas evolved rapidly", "Burning splint gives 'pop' sound", "Solution remains colourless (ZnSO₄)"], as: ["Zn যোগ কৰাৰ লগে লগে প্ৰচণ্ড বুদবুদ", "বৰ্ণহীন H₂ গেছ দ্ৰুত নিৰ্গত হয়", "জ্বলি থকা কাঠিয়ে 'পপ' শব্দ দিয়ে", "সমাধান বৰ্ণহীনেই থাকে (ZnSO₄)"] },
    pmode: "bubble-acid",
    quiz: [
      { q: { en: "Which gas is produced when Zn reacts with H₂SO₄?", as: "Zn-এ H₂SO₄-ৰ সৈতে বিক্ৰিয়া কৰিলে কোন গেছ উৎপন্ন হয়?" }, opts: { en: ["O₂", "CO₂", "H₂", "SO₂"], as: ["O₂", "CO₂", "H₂", "SO₂"] }, ans: 2 },
      { q: { en: "How is hydrogen gas confirmed?", as: "হাইড্ৰ’জেন গেছ কেনেকৈ নিশ্চিত কৰা হয়?" }, opts: { en: ["Lime water test", "Burning splint — pop sound", "Glowing splint", "Litmus test"], as: ["চূনৰ পানীৰ পৰীক্ষা", "জ্বলি থকা কাঠি — পপ শব্দ", "চিকমিকা চাকি", "লিটমাছ পৰীক্ষা"] }, ans: 1 },
      { q: { en: "What salt is formed in this reaction?", as: "এই বিক্ৰিয়াত কি লৱণ গঠিত হয়?" }, opts: { en: ["ZnCl₂", "ZnO", "ZnSO₄", "ZnCO₃"], as: ["ZnCl₂", "ZnO", "ZnSO₄", "ZnCO₃"] }, ans: 2 },
      { q: { en: "Zinc displaces hydrogen because:", as: "জিংকে হাইড্ৰ’জেন কিয় প্ৰতিস্থাপন কৰে?" }, opts: { en: ["H is more reactive", "Zn is more reactive than H", "H₂SO₄ is weak", "Zn is below H"], as: ["H অধিক সক্ৰিয়", "Zn H-তকৈ অধিক সক্ৰিয়", "H₂SO₄ দুৰ্বল", "Zn H-ৰ তলত"] }, ans: 1 },
      { q: { en: "The gas in this reaction is collected by:", as: "এই বিক্ৰিয়াৰ গেছ সংগ্ৰহ কৰা হয়:" }, opts: { en: ["Downward displacement", "Upward displacement of air", "Displacement of water", "Absorption"], as: ["তললৈ স্থানান্তৰ", "বায়ুৰ ওপৰলৈ স্থানান্তৰ", "পানীৰ স্থানান্তৰ", "শোষণ"] }, ans: 2 },
    ],
  },
  {
    id: "zn-hcl", num: 5,
    title: { en: "Zinc + Hydrochloric Acid", as: "জিংক + হাইড্ৰ’ক্ল’ৰিক এচিড" },
    subtitle: { en: "Acid Displacement", as: "এচিড প্ৰতিস্থাপন" },
    equation: "Zn + 2HCl → ZnCl₂ + H₂↑",
    ionicEq: "Zn + 2H⁺ → Zn²⁺ + H₂↑",
    accent: "#38BDF8", glow: "rgba(56,189,248,0.4)", gradFrom: "#0284C7", gradTo: "#38BDF8", emoji: "💧",
    solutionColor: { before: "#F0F9FF", after: "#F0F9FF" },
    metalColor: "#9CA3AF", depositColor: "#D1D5DB",
    hazard: "HIGH", reactivity: "High", isAcid: true, isExo: true,
    description: { en: "Zinc reacts with dilute hydrochloric acid to produce hydrogen gas and zinc chloride. Similar to H₂SO₄ reaction but forms ZnCl₂ salt. H₂ gas confirmed by burning splint test with characteristic pop.", as: "জিংকে তনু হাইড্ৰ’ক্ল’ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰি হাইড্ৰ’জেন গেছ আৰু জিংক ক্ল’ৰাইড উৎপন্ন কৰে। H₂SO₄ বিক্ৰিয়াৰ সদৃশ কিন্তু ZnCl₂ লৱণ গঠন কৰে। বৈশিষ্ট্যপূৰ্ণ পপৰ সৈতে জ্বলি থকা কাঠি পৰীক্ষাৰে H₂ গেছ নিশ্চিত হয়।" },
    realWorld: { en: "Pickling metals · Hydrogen generation · Zinc chloride production · Metal cleaning", as: "ধাতুৰ পিকলিং · হাইড্ৰ’জেন উৎপাদন · জিংক ক্ল’ৰাইড উৎপাদন · ধাতু পৰিষ্কাৰকৰণ" },
    examNote: { en: "Zn > H in reactivity. H₂ gas confirmed by pop test. ZnCl₂ is colourless in solution. Compare with Zn + H₂SO₄ — same gas but different salt. Important NCERT experiment.", as: "সক্ৰিয়তাত Zn > H। পপ পৰীক্ষাৰে H₂ গেছ নিশ্চিত। সমাধানত ZnCl₂ বৰ্ণহীন। Zn + H₂SO₄-ৰ সৈতে তুলনা — একে গেছ কিন্তু ভিন্ন লৱণ। গুৰুত্বপূৰ্ণ NCERT পৰীক্ষা।" },
    safety: { en: ["HCl fumes are irritating", "Wear goggles and gloves", "Work in ventilated area", "HCl causes skin irritation"], as: ["HCl-ৰ ধোঁৱা জ্বলজ্বলাকাৰক", "চশমা আৰু দস্তানা পিন্ধক", "বায়ু চলাচলযুক্ত স্থানত কাম কৰক", "HCl-এ চামৰিত জ্বলন সৃষ্টি কৰে"] },
    steps: [
      { label: { en: "Prepare Acid", as: "এচিড প্ৰস্তুত কৰক" }, desc: { en: "Take dilute HCl in a test tube/conical flask. HCl is colourless with a pungent smell.", as: "টেষ্ট টিউব/কনিকেল ফ্লাস্কত তনু HCl লওক। HCl বৰ্ণহীন আৰু কটু গোন্ধযুক্ত।" } },
      { label: { en: "Add Zinc", as: "জিংক যোগ কৰক" }, desc: { en: "Drop zinc granules or foil into the acid. Immediate vigorous bubbling of H₂ gas observed.", as: "এচিডত জিংক গ্ৰেণুল বা ফয়েল ভৰাওক। তৎক্ষণাৎ H₂ গেছৰ প্ৰচণ্ড বুদবুদ লক্ষ্য কৰক।" } },
      { label: { en: "Collect H₂", as: "H₂ সংগ্ৰহ কৰক" }, desc: { en: "Collect gas in inverted test tube over water. Colourless H₂ collects at top.", as: "পানীৰ ওপৰত উলটাই থোৱা টেষ্ট টিউবত গেছ সংগ্ৰহ কৰক। ওপৰত বৰ্ণহীন H₂ জমা হয়।" } },
      { label: { en: "Pop Test", as: "পপ পৰীক্ষা" }, desc: { en: "Apply burning splint — pop sound confirms H₂. ZnCl₂ solution remains in flask.", as: "জ্বলি থকা কাঠি প্ৰয়োগ কৰক — পপ শব্দে H₂ নিশ্চিত কৰে। ফ্লাস্কত ZnCl₂ সমাধান থাকে।" } },
    ],
    observations: { en: ["Vigorous H₂ bubbles immediately", "Zinc gradually dissolves in acid", "Burning splint produces pop sound", "Colourless ZnCl₂ solution remains"], as: ["তৎক্ষণাৎ প্ৰচণ্ড H₂ বুদবুদ", "জিংক ক্ৰমে এচিডত দ্ৰৱীভূত হয়", "জ্বলি থকা কাঠিয়ে পপ শব্দ উৎপন্ন কৰে", "বৰ্ণহীন ZnCl₂ সমাধান থাকে"] },
    pmode: "bubble-acid",
    quiz: [
      { q: { en: "Which gas is produced when Zn reacts with HCl?", as: "Zn-এ HCl-ৰ সৈতে বিক্ৰিয়া কৰিলে কোন গেছ উৎপন্ন হয়?" }, opts: { en: ["Cl₂", "O₂", "H₂", "HCl"], as: ["Cl₂", "O₂", "H₂", "HCl"] }, ans: 2 },
      { q: { en: "What salt is formed?", as: "কি লৱণ গঠিত হয়?" }, opts: { en: ["ZnSO₄", "ZnCl₂", "ZnO", "ZnCO₃"], as: ["ZnSO₄", "ZnCl₂", "ZnO", "ZnCO₃"] }, ans: 1 },
      { q: { en: "How is hydrogen confirmed?", as: "হাইড্ৰ’জেন কেনেকৈ নিশ্চিত কৰা হয়?" }, opts: { en: ["Turns lime water milky", "Relights glowing splint", "Pop sound with flame", "Blue litmus turns red"], as: ["চূনৰ পানী গাখীৰীয়া হয়", "চিকমিকা চাকি পুনৰ জ্বলে", "জ্বালাৰ সৈতে পপ শব্দ", "নীলা লিটমাছ ৰঙা হয়"] }, ans: 2 },
      { q: { en: "In Zn + HCl, how many moles of HCl react with 1 mole of Zn?", as: "Zn + HCl-ত ১ ম’ল Zn-ৰ সৈতে কিমান ম’ল HCl বিক্ৰিয়া কৰে?" }, opts: { en: ["1", "2", "3", "4"], as: ["1", "2", "3", "4"] }, ans: 1 },
    ],
  },
  {
    id: "fe-hcl", num: 6,
    title: { en: "Iron + Hydrochloric Acid", as: "লোহা + হাইড্ৰ’ক্ল’ৰিক এচিড" },
    subtitle: { en: "Acid Displacement", as: "এচিড প্ৰতিস্থাপন" },
    equation: "Fe + 2HCl → FeCl₂ + H₂↑",
    ionicEq: "Fe + 2H⁺ → Fe²⁺ + H₂↑",
    accent: "#F472B6", glow: "rgba(244,114,182,0.4)", gradFrom: "#BE185D", gradTo: "#F472B6", emoji: "🔴",
    solutionColor: { before: "#F0F9FF", after: "#DCFCE7" },
    metalColor: "#6B7280", depositColor: "#6B7280",
    hazard: "HIGH", reactivity: "Moderate", isAcid: true, isExo: true,
    description: { en: "Iron reacts with dilute hydrochloric acid to form iron(II) chloride (pale green FeCl₂) and hydrogen gas. The pale green colour is characteristic of Fe²⁺ ions in solution.", as: "লোহাই তনু হাইড্ৰ’ক্ল’ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰি আইৰন(II) ক্ল’ৰাইড (পাতল সেউজীয়া FeCl₂) আৰু হাইড্ৰ’জেন গেছ গঠন কৰে। সমাধানত Fe²⁺ আয়নৰ বৈশিষ্ট্যপূৰ্ণ পাতল সেউজীয়া ৰং।" },
    realWorld: { en: "Iron cleaning/pickling · Steel industry · FeCl₂ production · Electroplating pretreatment", as: "লোহা পৰিষ্কাৰকৰণ/পিকলিং · ইস্পাত উদ্যোগ · FeCl₂ উৎপাদন · ইলেক্ট্ৰ’প্লেটিং পূৰ্ব-প্ৰস্তুতি" },
    examNote: { en: "Fe > H in reactivity. Fe + HCl → FeCl₂ (pale green) + H₂. The pale green colour confirms Fe²⁺ ions (not Fe³⁺ which gives yellow-brown). H₂ confirmed by pop test.", as: "সক্ৰিয়তাত Fe > H। Fe + HCl → FeCl₂ (পাতল সেউজীয়া) + H₂। পাতল সেউজীয়া ৰঙে Fe²⁺ আয়ন নিশ্চিত কৰে (Fe³⁺ নহয় যিয়ে হালধীয়া-মুগা ৰং দিয়ে)। পপ পৰীক্ষাৰে H₂ নিশ্চিত।" },
    safety: { en: ["HCl is corrosive", "H₂ is flammable", "Goggles and gloves mandatory", "Ensure ventilation"], as: ["HCl ক্ষয়কাৰক", "H₂ দাহ্য", "চশমা আৰু দস্তানা বাধ্যতামূলক", "বায়ু চলাচল নিশ্চিত কৰক"] },
    steps: [
      { label: { en: "Set Up Test Tube", as: "টেষ্ট টিউব স্থাপন কৰক" }, desc: { en: "Take dilute HCl in test tube. Clean iron filings/nail reduces surface oxide for better reaction.", as: "টেষ্ট টিউবত তনু HCl লওক। পৰিষ্কাৰ লোহাৰ গজাল/চূৰ্ণে ভাল বিক্ৰিয়াৰ বাবে পৃষ্ঠ অক্সাইড হ্ৰাস কৰে।" } },
      { label: { en: "Add Iron", as: "লোহা যোগ কৰক" }, desc: { en: "Add iron filings to the HCl. Moderate bubbling of H₂ begins. Slightly less vigorous than zinc.", as: "HCl-ত লোহাৰ চূৰ্ণ যোগ কৰক। মাজামজি H₂ বুদবুদ আৰম্ভ হয়। জিংকতকৈ অলপ কম প্ৰচণ্ড।" } },
      { label: { en: "Observe Colour Change", as: "ৰং পৰিৱৰ্তন লক্ষ্য কৰক" }, desc: { en: "Solution gradually turns pale green as FeCl₂ forms. Fe²⁺ ions give the characteristic colour.", as: "FeCl₂ গঠিত হোৱাৰ লগে লগে সমাধান ক্ৰমে পাতল সেউজীয়া হয়। Fe²⁺ আয়নে বৈশিষ্ট্যপূৰ্ণ ৰং দিয়ে।" } },
      { label: { en: "Pop Test", as: "পপ পৰীক্ষা" }, desc: { en: "Collect H₂ and perform pop test. Pale green FeCl₂ solution confirms iron(II) product.", as: "H₂ সংগ্ৰহ কৰি পপ পৰীক্ষা কৰক। পাতল সেউজীয়া FeCl₂ সমাধানে আইৰন(II) উৎপাদ নিশ্চিত কৰে।" } },
    ],
    observations: { en: ["Moderate H₂ bubbling on adding iron", "Solution turns pale green (FeCl₂)", "Iron surface corrodes/dissolves", "Burning splint gives pop (H₂ confirmed)"], as: ["লোহা যোগ কৰাৰ লগে লগে মাজামজি H₂ বুদবুদ", "সমাধান পাতল সেউজীয়া হয় (FeCl₂)", "লোহাৰ পৃষ্ঠ ক্ষয় হয়/দ্ৰৱীভূত হয়", "জ্বলি থকা কাঠিয়ে পপ দিয়ে (H₂ নিশ্চিত)"] },
    pmode: "bubble-acid",
    quiz: [
      { q: { en: "Why does the solution turn pale green?", as: "সমাধান কিয় পাতল সেউজীয়া হয়?" }, opts: { en: ["H₂ dissolves", "FeCl₂ (Fe²⁺) is pale green", "HCl is green", "Iron turns green"], as: ["H₂ দ্ৰৱীভূত হয়", "FeCl₂ (Fe²⁺) পাতল সেউজীয়া", "HCl সেউজীয়া", "লোহা সেউজীয়া হয়"] }, ans: 1 },
      { q: { en: "Which gas is evolved?", as: "কোন গেছ নিৰ্গত হয়?" }, opts: { en: ["Cl₂", "HCl", "H₂", "O₂"], as: ["Cl₂", "HCl", "H₂", "O₂"] }, ans: 2 },
      { q: { en: "The product FeCl₂ contains iron in which oxidation state?", as: "উৎপাদ FeCl₂-ত লোহা কোন জাৰণ অৱস্থাত আছে?" }, opts: { en: ["+1", "+2", "+3", "0"], as: ["+1", "+2", "+3", "0"] }, ans: 1 },
      { q: { en: "Iron reacts less vigorously than zinc with HCl because:", as: "জিংকতকৈ লোহা HCl-ৰ সৈতে কম প্ৰচণ্ডভাৱে কিয় বিক্ৰিয়া কৰে?" }, opts: { en: ["Fe > Zn in reactivity", "Zn > Fe in reactivity", "Both react equally", "Fe doesn't react with HCl"], as: ["সক্ৰিয়তাত Fe > Zn", "সক্ৰিয়তাত Zn > Fe", "দুয়ো একে বিক্ৰিয়া কৰে", "Fe-এ HCl-ৰ সৈতে বিক্ৰিয়া নকৰে"] }, ans: 1 },
    ],
  },
  {
    id: "al-cucl2", num: 7,
    title: { en: "Aluminium + Copper Chloride", as: "এলুমিনিয়াম + কপাৰ ক্ল’ৰাইড" },
    subtitle: { en: "Vigorous Displacement", as: "প্ৰচণ্ড প্ৰতিস্থাপন" },
    equation: "2Al + 3CuCl₂ → 2AlCl₃ + 3Cu",
    ionicEq: "2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu",
    accent: "#FBBF24", glow: "rgba(251,191,36,0.4)", gradFrom: "#D97706", gradTo: "#FBBF24", emoji: "⚡",
    solutionColor: { before: "#0EA5E9", after: "#F8FAFC" },
    metalColor: "#D1D5DB", depositColor: "#B45309",
    hazard: "MEDIUM", reactivity: "Very High", isAcid: false, isExo: true,
    description: { en: "Aluminium is highly reactive and rapidly displaces copper from copper chloride solution. The reaction is exothermic — the solution heats up noticeably. Bright copper deposits form on aluminium foil and the blue solution turns colourless.", as: "এলুমিনিয়াম অতি সক্ৰিয় আৰু কপাৰ ক্ল’ৰাইড সমাধানৰ পৰা তামক দ্ৰুত প্ৰতিস্থাপন কৰে। বিক্ৰিয়াটো তাপোৎপাদক — সমাধান উল্লেখযোগ্যভাৱে গৰম হয়। এলুমিনিয়াম ফয়েলত উজ্জ্বল তামৰ জমা গঠিত হয় আৰু নীলা সমাধান বৰ্ণহীন হয়।" },
    realWorld: { en: "Aluminium extraction processes · Thermite welding · Metal purification · Exothermic welding", as: "এলুমিনিয়াম নিষ্কাষণ প্ৰক্ৰিয়া · থাৰ্মাইট ৱেল্ডিং · ধাতু বিশুদ্ধিকৰণ · তাপোৎপাদক ৱেল্ডিং" },
    examNote: { en: "Al >> Cu in reactivity (Al is much more reactive). Reaction is rapid and exothermic. Blue CuCl₂ → colourless AlCl₃. Copper deposits rapidly. Ratio: 2 Al : 3 CuCl₂ (important for balancing).", as: "সক্ৰিয়তাত Al >> Cu (Al বহু গুণে অধিক সক্ৰিয়)। বিক্ৰিয়া দ্ৰুত আৰু তাপোৎপাদক। নীলা CuCl₂ → বৰ্ণহীন AlCl₃। তাম দ্ৰুত জমা হয়। অনুপাত: ২ Al : ৩ CuCl₂ (সমতা ৰক্ষাৰ বাবে গুৰুত্বপূৰ্ণ)।" },
    safety: { en: ["Exothermic — container may become hot", "Wear gloves to handle hot apparatus", "CuCl₂ is toxic", "Aluminium foil edges are sharp"], as: ["তাপোৎপাদক — পাত্ৰ গৰম হ’ব পাৰে", "গৰম যন্ত্ৰ নাড়িবলৈ দস্তানা পিন্ধক", "CuCl₂ বিষাক্ত", "এলুমিনিয়াম ফয়েলৰ ধাৰ চোকা"] },
    steps: [
      { label: { en: "Prepare CuCl₂", as: "CuCl₂ প্ৰস্তুত কৰক" }, desc: { en: "Take blue copper chloride solution in beaker. Note vivid blue from Cu²⁺ ions.", as: "বিকাৰত নীলা কপাৰ ক্ল’ৰাইড সমাধান লওক। Cu²⁺ আয়নৰ পৰা চটচটে নীলা লক্ষ্য কৰক।" } },
      { label: { en: "Add Aluminium Foil", as: "এলুমিনিয়াম ফয়েল যোগ কৰক" }, desc: { en: "Submerge aluminium foil in CuCl₂ solution. Reaction starts rapidly — Al is highly reactive.", as: "CuCl₂ সমাধানত এলুমিনিয়াম ফয়েল ডুবাওক। বিক্ৰিয়া দ্ৰুত আৰম্ভ হয় — Al অতি সক্ৰিয়।" } },
      { label: { en: "Exothermic Reaction", as: "তাপোৎপাদক বিক্ৰিয়া" }, desc: { en: "Solution heats up significantly. Blue colour fades rapidly as Cu deposits form on Al surface.", as: "সমাধান উল্লেখযোগ্যভাৱে গৰম হয়। Al পৃষ্ঠত Cu জমা হোৱাৰ লগে লগে নীলা ৰং দ্ৰুত ম্লান হয়।" } },
      { label: { en: "Observe Products", as: "উৎপাদ লক্ষ্য কৰক" }, desc: { en: "Colourless AlCl₃ solution + thick copper deposits confirm the rapid, vigorous displacement.", as: "বৰ্ণহীন AlCl₃ সমাধান + ঘন তামৰ জমাই দ্ৰুত, প্ৰচণ্ড প্ৰতিস্থাপন নিশ্চিত কৰে।" } },
    ],
    observations: { en: ["Blue solution fades very rapidly", "Vigorous copper deposition on aluminium foil", "Solution becomes noticeably warm (exothermic)", "Colourless AlCl₃ solution remains"], as: ["নীলা সমাধান অতি দ্ৰুত ম্লান হয়", "এলুমিনিয়াম ফয়েলত প্ৰচণ্ড তামৰ জমা", "সমাধান উল্লেখযোগ্যভাৱে গৰম হয় (তাপোৎপাদক)", "বৰ্ণহীন AlCl₃ সমাধান থাকে"] },
    pmode: "heat-exo",
    quiz: [
      { q: { en: "Why does aluminium react more vigorously than iron with CuCl₂?", as: "এলুমিনিয়াম লোহাতকৈ CuCl₂-ৰ সৈতে কিয় বেছি প্ৰচণ্ডভাৱে বিক্ৰিয়া কৰে?" }, opts: { en: ["Al is less reactive", "Al is much more reactive than Cu", "CuCl₂ is stronger", "Al is below Cu"], as: ["Al কম সক্ৰিয়", "Al Cu-তকৈ বহু অধিক সক্ৰিয়", "CuCl₂ বেছি শক্তিশালী", "Al Cu-ৰ তলত"] }, ans: 1 },
      { q: { en: "The balanced equation shows Al:CuCl₂ ratio as:", as: "সমতা সমীকৰণত Al:CuCl₂ অনুপাত:" }, opts: { en: ["1:1", "1:2", "2:3", "3:2"], as: ["1:1", "1:2", "2:3", "3:2"] }, ans: 2 },
      { q: { en: "What confirms this is an exothermic reaction?", as: "এই তাপোৎপাদক বিক্ৰিয়া বুলি কি নিশ্চিত কৰে?" }, opts: { en: ["Gas evolves", "Solution turns blue", "Solution becomes warm/hot", "Precipitate forms"], as: ["গেছ নিৰ্গত হয়", "সমাধান নীলা হয়", "সমাধান উষ্ণ/গৰম হয়", "অৱক্ষেপ গঠিত হয়"] }, ans: 2 },
      { q: { en: "What colourless solution forms?", as: "কি বৰ্ণহীন সমাধান গঠিত হয়?" }, opts: { en: ["Al(OH)₃", "AlSO₄", "AlCl₃", "Al₂O₃"], as: ["Al(OH)₃", "AlSO₄", "AlCl₃", "Al₂O₃"] }, ans: 2 },
      { q: { en: "Aluminium is placed __ copper in the activity series:", as: "সক্ৰিয়তা শ্ৰেণীত এলুমিনিয়াম তামৰ __ স্থানত আছে:" }, opts: { en: ["Below", "Same level", "Well above", "Not present"], as: ["তল", "একে স্তৰ", "যথেষ্ট ওপৰ", "নাই"] }, ans: 2 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// CANVAS PARTICLE ENGINE
// ═══════════════════════════════════════════════════════════

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, mode: PMode, intensity = 1.0) {
  const particles = useRef<Particle[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode === "none") { particles.current = []; return; }
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const spawn = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2;

      const add = (p: Omit<Particle, "life"> & { life?: number }) =>
        particles.current.push({ life: p.maxLife, ...p });

      switch (mode) {
        case "bubble-acid":
          // Vigorous upward bubbles from reaction zone
          for (let i = 0; i < Math.ceil(5 * intensity); i++) {
            const x = cx + (Math.random() - .5) * 50;
            const life = 50 + Math.random() * 40;
            add({ x, y: H * 0.7, vx: (Math.random() - .5) * 1.2, vy: -(2 + Math.random() * 3.5), maxLife: life, size: 2.5 + Math.random() * 4, color: `rgba(200,240,255,${0.5 + Math.random() * 0.3})`, blur: 5, type: "bubble" });
          }
          // Tiny sparkling surface particles
          if (Math.random() < 0.4 * intensity) {
            add({ x: cx + (Math.random() - .5) * 60, y: H * 0.68, vx: (Math.random() - .5) * 2, vy: -(1 + Math.random() * 2), maxLife: 20 + Math.random() * 15, size: 1.5 + Math.random() * 2, color: "#FFFFFF", blur: 8, type: "spark" });
          }
          break;

        case "bubble-salt":
          // Gentle slow bubbles
          for (let i = 0; i < Math.ceil(2 * intensity); i++) {
            const x = cx + (Math.random() - .5) * 40;
            const life = 80 + Math.random() * 50;
            add({ x, y: H * 0.72, vx: (Math.random() - .5) * 0.7, vy: -(0.8 + Math.random() * 1.5), maxLife: life, size: 2 + Math.random() * 3, color: `rgba(180,220,255,${0.3 + Math.random() * 0.3})`, blur: 4, type: "bubble" });
          }
          break;

        case "deposit-copper":
          // Reddish-brown copper particles settling on metal
          if (Math.random() < 0.45 * intensity) {
            const x = cx + (Math.random() - .5) * 18;
            const life = 60 + Math.random() * 40;
            add({ x, y: H * 0.42 + Math.random() * 30, vx: (Math.random() - .5) * 0.5, vy: 0.3 + Math.random() * 0.8, maxLife: life, size: 2 + Math.random() * 3, color: ["#B45309","#92400E","#D97706","#A16207","#78350F"][Math.floor(Math.random() * 5)], blur: 6, type: "deposit" });
          }
          // Solution diffusion particles
          for (let i = 0; i < Math.ceil(1.5 * intensity); i++) {
            add({ x: cx + (Math.random() - .5) * 80, y: H * 0.55 + (Math.random() - .5) * 30, vx: (Math.random() - .5) * 0.8, vy: (Math.random() - .5) * 0.8, maxLife: 80 + Math.random() * 50, size: 1.5 + Math.random() * 2, color: `rgba(180,200,255,${0.2 + Math.random() * 0.2})`, blur: 3, type: "diffuse" });
          }
          break;

        case "heat-exo":
          // Copper deposition + heat shimmer
          if (Math.random() < 0.6 * intensity) {
            const x = cx + (Math.random() - .5) * 22;
            const life = 40 + Math.random() * 30;
            add({ x, y: H * 0.42 + Math.random() * 35, vx: (Math.random() - .5) * 0.8, vy: 0.5 + Math.random() * 1.2, maxLife: life, size: 2.5 + Math.random() * 4, color: ["#B45309","#D97706","#92400E","#C05621"][Math.floor(Math.random() * 4)], blur: 8, type: "deposit" });
          }
          // Heat shimmer particles
          for (let i = 0; i < Math.ceil(2 * intensity); i++) {
            add({ x: cx + (Math.random() - .5) * 70, y: H * 0.35, vx: (Math.random() - .5) * 1.5, vy: -(1 + Math.random() * 2), maxLife: 30 + Math.random() * 25, size: 3 + Math.random() * 5, color: `rgba(251,146,60,${0.1 + Math.random() * 0.15})`, blur: 18, type: "heat" });
          }
          // Bright sparks
          if (Math.random() < 0.25 * intensity) {
            add({ x: cx + (Math.random() - .5) * 40, y: H * 0.45, vx: (Math.random() - .5) * 3, vy: -(1 + Math.random() * 2), maxLife: 15 + Math.random() * 12, size: 1.5, color: "#FBBF24", blur: 14, type: "spark" });
          }
          break;
      }
    };

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      spawn();
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        const t = p.life / p.maxLife;
        let alpha = t;
        if (p.type === "bubble") { alpha = t < 0.15 ? t / 0.15 * 0.7 : t * 0.7; }
        if (p.type === "diffuse") { alpha = Math.sin(t * Math.PI) * 0.4; }
        if (p.type === "deposit") { alpha = t < 0.2 ? t / 0.2 * 0.75 : 0.75; }
        if (p.type === "heat") { alpha = Math.sin(t * Math.PI) * 0.3; }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowBlur = p.blur;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.type === "bubble") { ctx.globalAlpha = alpha * 0.5; ctx.strokeStyle = p.color; ctx.lineWidth = 0.8; ctx.stroke(); }
        ctx.restore();

        p.x += p.vx; p.y += p.vy;
        if (p.type === "bubble") { p.vx += (Math.random() - .5) * 0.1; p.vy *= 0.998; }
        if (p.type === "heat") { p.vx += (Math.random() - .5) * 0.3; p.vy *= 0.97; }
        if (p.type === "deposit") { p.vy *= 0.92; }
        p.life--;
      });
      frame.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame.current); particles.current = []; };
  }, [mode, intensity, canvasRef]);
}

// ═══════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════

function GlassPanel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`}
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.08)", ...style }}>
      {children}
    </div>
  );
}
function NeonBadge({ label, color }: { label: string; color: string }) {
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ color, borderColor: `${color}60`, background: `${color}18` }}>{label}</span>;
}
function DataRow({ label, value, color = "#94a3b8" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-black" style={{ color }}>{value}</span>
    </div>
  );
}
function AnimatedBar({ label, target, accent, icon }: { label: string; target: number; accent: string; icon: React.ReactNode }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let cur = 0; const step = target / 60;
    const iv = setInterval(() => { cur = Math.min(cur + step, target); setVal(Math.round(cur)); if (cur >= target) clearInterval(iv); }, 25);
    return () => clearInterval(iv);
  }, [target]);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">{icon}{label}</span>
        <span className="text-xs font-black tabular-nums" style={{ color: accent }}>{val}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 2, ease: "easeOut" }}
          style={{ background: `linear-gradient(to right, ${accent}88, ${accent})` }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APPARATUS SVG
// ═══════════════════════════════════════════════════════════

function BeakerApparatus({ exp, phase }: { exp: Exp; phase: Phase }) {
  const reacting = phase === "reacting" || phase === "complete";
  const complete = phase === "complete";

  const solColor = reacting
    ? exp.solutionColor.after
    : exp.solutionColor.before;

  const isAcid = exp.isAcid;
  const isExo = exp.isExo;

  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      <rect x="20" y="205" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />

      {/* Beaker body */}
      <path d="M85,60 L75,190 Q75,198 85,198 L215,198 Q225,198 225,190 L215,60 Z"
        fill={`${solColor}30`} stroke="#94a3b8" strokeWidth="1.5" />

      {/* Solution fill — animated color change */}
      <path d="M80,100 L72,190 Q72,200 85,200 L215,200 Q228,200 228,190 L220,100 Z"
        fill={solColor} opacity={reacting ? "0.55" : "0.45"}>
        {reacting && !complete && (
          <animate attributeName="fill" from={exp.solutionColor.before} to={exp.solutionColor.after} dur="4s" fill="freeze" />
        )}
        {reacting && !complete && (
          <animate attributeName="opacity" values="0.45;0.6;0.45" dur="2s" repeatCount="indefinite" />
        )}
      </path>

      {/* Beaker graduations */}
      {[140, 160, 180].map((y, i) => (
        <g key={i}>
          <line x1="82" y1={y} x2="92" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="95" y={y + 4} fill="rgba(255,255,255,0.2)" fontSize="7">{(3 - i) * 50}mL</text>
        </g>
      ))}

      {/* Metal strip/nail */}
      {!isAcid ? (
        // Metal strip
        <g>
          <rect x="140" y="55" width="12" height="115" rx="2" fill={complete ? exp.depositColor : exp.metalColor} stroke="rgba(255,255,255,0.2)" strokeWidth="1">
            {reacting && !complete && (
              <animate attributeName="fill" from={exp.metalColor} to={exp.depositColor} dur="5s" fill="freeze" />
            )}
          </rect>
          {/* Copper deposit particles on metal */}
          {complete && (
            <>
              {[65, 80, 95, 110, 125, 140, 155].map((y, i) => (
                <circle key={i} cx={140 + Math.sin(i) * 4} cy={y} r="3" fill={exp.depositColor} opacity="0.85" />
              ))}
            </>
          )}
          {/* Forceps holding the strip */}
          <line x1="146" y1="40" x2="135" y2="58" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="146" y1="40" x2="157" y2="58" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="146" y="38" textAnchor="middle" fill="#64748b" fontSize="7">FORCEPS</text>
        </g>
      ) : (
        // Zinc/Iron granules for acid reactions
        <g>
          {[115, 130, 145, 160, 175, 125, 155].map((x, i) => (
            <circle key={i} cx={x} cy={180 + (i % 3) * 6} r={3.5 + (i % 2)} fill={exp.metalColor} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          ))}
          <text x="150" y="173" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7">METAL GRANULES</text>
        </g>
      )}

      {/* Gas collection tube for acid reactions */}
      {isAcid && (
        <>
          <path d="M195,120 Q220,100 240,90" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
          <rect x="232" y="50" width="20" height="40" rx="4" fill={reacting ? "rgba(200,240,255,0.2)" : "rgba(255,255,255,0.04)"} stroke="#64748b" strokeWidth="1.5" />
          {reacting && <text x="242" y="75" textAnchor="middle" fill="#38BDF8" fontSize="7">H₂</text>}
          <text x="242" y="46" textAnchor="middle" fill="#64748b" fontSize="6">COLLECTION</text>
        </>
      )}

      {/* White precipitate for Pb + CuCl₂ */}
      {exp.id === "pb-cucl2" && complete && (
        <g opacity="0.7">
          {[100, 125, 150, 175].map((x, i) => (
            <circle key={i} cx={x + i * 3} cy={190 - i * 4} r="3" fill="#F8FAFC" />
          ))}
          <text x="150" y="210" textAnchor="middle" fill="#F8FAFC" fontSize="7" opacity="0.7">PbCl₂ ppt.</text>
        </g>
      )}

      {/* Heat glow for exothermic */}
      {isExo && reacting && (
        <ellipse cx="150" cy="155" rx="75" ry="50" fill={exp.accent} opacity="0.05">
          <animate attributeName="opacity" values="0.05;0.12;0.05" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* Beaker label */}
      <text x="150" y="218" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">
        {exp.solutionColor.before === exp.solutionColor.after ? "ACID SOLUTION" : reacting ? exp.id === "fe-cuso4" ? "FeSO₄ (pale green)" : "ZnSO₄ (colourless)" : "CuSO₄ / CuCl₂ SOLUTION"}
      </text>

      {/* Phase indicator light */}
      <circle cx="270" cy="65" r="5" fill={phase === "complete" ? "#34D399" : phase === "reacting" ? exp.accent : "#334155"}>
        {phase === "reacting" && <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />}
      </circle>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// MOLECULAR PANEL
// ═══════════════════════════════════════════════════════════

const METAL_COLORS: Record<string, string> = {
  Fe: "#78716C", Zn: "#9CA3AF", Pb: "#6B7280", Al: "#D1D5DB", Cu: "#B45309", H: "#38BDF8",
};

function MoleculeAtom({ symbol, color, cx, cy, r = 14 }: { symbol: string; color: string; cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} filter="url(#mg)" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize={r > 12 ? 9 : 7} fontWeight="bold">{symbol}</text>
    </g>
  );
}

function MolecularPanel({ exp, phase }: { exp: Exp; phase: Phase }) {
  const showAfter = phase === "complete";
  const reactant1 = exp.id.split("-")[0].toUpperCase();

  const beforeView = (
    <g>
      {/* Metal atom */}
      <MoleculeAtom symbol={reactant1} color={METAL_COLORS[reactant1] ?? "#78716C"} cx={70} cy={50} />
      <text x={70} y={74} textAnchor="middle" fill="#64748b" fontSize={8}>(solid)</text>
      <text x={130} y={54} textAnchor="middle" fill="#64748b" fontSize={14}>+</text>
      {/* Cu²⁺ or H⁺ ions in solution */}
      {exp.isAcid ? (
        <>
          <MoleculeAtom symbol="H⁺" color="#38BDF8" cx={185} cy={40} r={10} />
          <MoleculeAtom symbol="H⁺" color="#38BDF8" cx={215} cy={60} r={10} />
          <text x={200} y={82} textAnchor="middle" fill="#64748b" fontSize={8}>(in solution)</text>
        </>
      ) : (
        <>
          <MoleculeAtom symbol="Cu²⁺" color="#1D4ED8" cx={195} cy={50} r={13} />
          <text x={195} y={74} textAnchor="middle" fill="#64748b" fontSize={8}>(aq, blue)</text>
        </>
      )}
    </g>
  );

  const afterView = (
    <g>
      {/* Displaced product */}
      {exp.isAcid ? (
        <>
          <MoleculeAtom symbol="H" color="#38BDF8" cx={65} cy={50} r={11} />
          <line x1={76} y1={48} x2={90} y2={48} stroke="#38BDF8" strokeWidth={2.5} />
          <line x1={76} y1={52} x2={90} y2={52} stroke="#38BDF8" strokeWidth={2.5} />
          <MoleculeAtom symbol="H" color="#38BDF8" cx={100} cy={50} r={11} />
          <text x={82} y={74} textAnchor="middle" fill="#38BDF8" fontSize={8}>H₂↑ (gas)</text>
        </>
      ) : (
        <MoleculeAtom symbol="Cu" color={METAL_COLORS.Cu} cx={75} cy={50} />
      )}
      <text x={148} y={54} textAnchor="middle" fill="#64748b" fontSize={14}>+</text>
      {/* Metal ion in solution */}
      <MoleculeAtom symbol={`${reactant1}ⁿ⁺`} color={exp.accent} cx={205} cy={50} r={14} />
      <text x={205} y={74} textAnchor="middle" fill="#64748b" fontSize={8}>(aq)</text>
      {/* Electron transfer arrow */}
      <path d="M105,30 Q150,10 200,30" fill="none" stroke="#FDE047" strokeWidth={1.5} strokeDasharray="4,3">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
      </path>
      <text x={152} y={16} textAnchor="middle" fill="#FDE047" fontSize={8}>e⁻ transfer</text>
    </g>
  );

  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Molecular View</span>
        <span className="text-[10px] font-black" style={{ color: exp.accent }}>{showAfter ? "After" : "Before"}</span>
      </div>
      <svg viewBox="0 0 300 90" className="w-full" style={{ height: 82 }}>
        <defs>
          <filter id="mg"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <AnimatePresence mode="wait">
          <motion.g key={showAfter ? "after" : "before"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {showAfter ? afterView : beforeView}
          </motion.g>
        </AnimatePresence>
        {phase === "reacting" && !showAfter && (
          <text x="150" y="90" textAnchor="middle" fill={exp.accent} fontSize={9} opacity="0.8">⚡ Electron transfer in progress…</text>
        )}
      </svg>
      {/* Ionic equation */}
      <div className="mt-2 rounded-lg px-2.5 py-1.5 text-center font-mono text-[10px] border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>
        {exp.ionicEq}
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// REACTIVITY SERIES MINI-PANEL
// ═══════════════════════════════════════════════════════════

const SERIES = [
  { m: "K", col: "#EF4444" }, { m: "Na", col: "#F97316" }, { m: "Ca", col: "#FB923C" },
  { m: "Mg", col: "#FBBF24" }, { m: "Al", col: "#FBBF24" }, { m: "Zn", col: "#A3E635" },
  { m: "Fe", col: "#4ADE80" }, { m: "Pb", col: "#34D399" }, { m: "H", col: "#38BDF8" },
  { m: "Cu", col: "#60A5FA" }, { m: "Ag", col: "#818CF8" }, { m: "Au", col: "#A78BFA" },
];

function ReactivityMini({ exp }: { exp: Exp }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const reactant = exp.id.split("-")[0].toUpperCase();
  return (
    <GlassPanel className="p-3">
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সক্ৰিয়তা শ্ৰেণী" : "Reactivity Series"}</p>
      <div className="flex gap-0.5 flex-wrap">
        {SERIES.map(({ m, col }) => {
          const isReactant = m === reactant;
          const isDisplaced = m === "Cu" || (exp.isAcid && m === "H");
          return (
            <div key={m} className="rounded px-1.5 py-1 text-center text-[9px] font-black border transition-all"
              style={{ borderColor: isReactant ? `${exp.accent}80` : isDisplaced ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.06)", background: isReactant ? `${exp.accent}22` : isDisplaced ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)", color: isReactant ? exp.accent : isDisplaced ? "#EF4444" : col, transform: isReactant ? "scale(1.1)" : "scale(1)" }}>
              {m}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded" style={{ background: exp.accent }} /><span className="text-[9px] text-slate-400">{isAs ? "বিক্ৰিয়াকাৰক ধাতু" : "Reactant metal"}</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-red-500/50" /><span className="text-[9px] text-slate-400">{isAs ? "প্ৰতিস্থাপিত ধাতু/আয়ন" : "Displaced metal/ion"}</span></div>
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// QUIZ SECTION
// ═══════════════════════════════════════════════════════════

function QuizSection({ exp }: { exp: Exp }) {
  const { recordQuizResult } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [answers, setAnswers] = useState<(number | null)[]>(exp.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.filter((a, i) => a === exp.quiz[i].ans).length;

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4" style={{ color: exp.accent }} />
        <span className="text-sm font-black text-white">{isAs ? "CBSE কুইজ" : "CBSE Quiz"}</span>
        {submitted && <NeonBadge label={`${score}/${exp.quiz.length}`} color={score === exp.quiz.length ? "#34D399" : "#FB923C"} />}
      </div>
      <div className="space-y-4">
        {exp.quiz.map((q, qi) => {
          const qText = pickLang(q.q, lang);
          const qOpts = pickLang(q.opts, lang);
          return (
            <div key={qi}>
              <p className="text-xs font-semibold text-slate-300 mb-2">{qi + 1}. {qText}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {qOpts.map((opt, oi) => {
                  const sel = answers[qi] === oi;
                  const correct = submitted && oi === q.ans;
                  const wrong = submitted && sel && oi !== q.ans;
                  return (
                    <button key={oi} disabled={submitted} onClick={() => setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                      className="text-[11px] font-semibold px-2.5 py-2 rounded-xl text-left border transition-all"
                      style={{ borderColor: correct ? "#34D399" : wrong ? "#EF4444" : sel ? exp.accent : "rgba(255,255,255,0.1)", background: correct ? "rgba(52,211,153,0.15)" : wrong ? "rgba(239,68,68,0.15)" : sel ? `${exp.accent}22` : "rgba(255,255,255,0.03)", color: correct ? "#34D399" : wrong ? "#EF4444" : sel ? exp.accent : "#94a3b8" }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!submitted ? (
        <button onClick={() => { const correct = answers.filter((a, i) => a === exp.quiz[i].ans).length; recordQuizResult({ score: Math.round((correct / exp.quiz.length) * 100), totalCorrect: correct, totalAttempted: exp.quiz.length }); setSubmitted(true); }} disabled={answers.some(a => a === null)}
          className="mt-4 w-full py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
          {isAs ? "উত্তৰ জমা দিয়ক" : "Submit Answers"}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
          <div className="text-2xl mb-1">{score === exp.quiz.length ? "🎉" : score >= exp.quiz.length / 2 ? "👍" : "📚"}</div>
          <p className="text-xs font-black" style={{ color: exp.accent }}>
            {score === exp.quiz.length
              ? (isAs ? "অসাধাৰণ! পৰীক্ষাৰ বাবে সাজু!" : "Perfect! Exam ready!")
              : `${score}/${exp.quiz.length} — ${isAs ? "পুনৰ চাই চেষ্টা কৰক" : "Review and retry"}`}
          </p>
          <button onClick={() => { setAnswers(exp.quiz.map(() => null)); setSubmitted(false); }} className="mt-2 text-[10px] text-slate-400 underline">{isAs ? "কুইজ পুনৰাবৃত্তি কৰক" : "Retry Quiz"}</button>
        </motion.div>
      )}
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPERIMENT ROOM
// ═══════════════════════════════════════════════════════════

function ExperimentRoom({ exp, onBack }: { exp: Exp; onBack: () => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const expTitle = pickLang(exp.title, lang);
  const expDesc = pickLang(exp.description, lang);
  const expRealWorld = pickLang(exp.realWorld, lang);
  const expExamNote = pickLang(exp.examNote, lang);
  const expSafety = pickLang(exp.safety, lang);
  const expObservations = pickLang(exp.observations, lang);
  const expReactivity = pickLang(REACTIVITY_LABEL[exp.reactivity], lang);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showQuiz) return;
    const id = setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
    return () => clearTimeout(id);
  }, [showQuiz]);

  const pIntensity = phase === "reacting" ? 1 : phase === "complete" ? 0.2 : 0;
  useParticles(canvasRef, phase === "idle" ? "none" : exp.pmode, pIntensity);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const obs = new ResizeObserver(() => { c.width = c.offsetWidth; c.height = c.offsetHeight; });
    obs.observe(c); return () => obs.disconnect();
  }, []);

  const nextStep = () => {
    if (stepIdx < exp.steps.length - 1) {
      const nxt = stepIdx + 1;
      setStepIdx(nxt);
      setPhase(nxt >= 2 ? "reacting" : `step${nxt + 1}` as Phase);
    } else { setPhase("complete"); setShowQuiz(true); }
  };
  const reset = () => { setPhase("idle"); setStepIdx(0); setShowQuiz(false); };

  const rxnPct = phase === "complete" ? 100 : phase === "reacting" ? 60 : 0;
  const tempPct = phase === "reacting" || phase === "complete" ? (exp.isExo ? 70 : exp.isAcid ? 35 : 10) : 0;

  const typeTag = exp.isAcid
    ? (isAs ? "ধাতু-এচিড" : "Metal-Acid")
    : (isAs ? "ধাতু-লৱণ" : "Metal-Salt");

  return (
    <div className="flex flex-col h-full" style={{ background: "#050B18" }}>
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.06)" }}>
          <ArrowLeft className="w-4 h-4 text-slate-300" />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{exp.emoji}</span>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-white leading-tight truncate">{expTitle}</h2>
            <p className="text-[10px] text-slate-500 font-mono truncate">{exp.equation}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <NeonBadge label={typeTag} color={exp.accent} />
          {exp.isExo && <NeonBadge label={isAs ? "তাপোৎপাদক" : "EXOTHERMIC"} color="#FB923C" />}
        </div>
        <LanguageToggle />
        <button onClick={() => setShowSafety(s => !s)} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><Shield className="w-4 h-4 text-slate-400" /></button>
        <button onClick={reset} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><RotateCcw className="w-4 h-4 text-slate-400" /></button>
      </div>

      {/* Safety panel */}
      <AnimatePresence>
        {showSafety && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 p-3 rounded-xl border shrink-0"
            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-black text-red-300">{isAs ? "সুৰক্ষাৰ সতৰ্কতা" : "Safety Precautions"}</span>
              <button onClick={() => setShowSafety(false)} className="ml-auto text-slate-500">✕</button>
            </div>
            {expSafety.map((s, i) => <p key={i} className="text-xs text-red-200 mb-0.5">• {s}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left — Apparatus */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 230 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="absolute inset-0 p-3">
              <BeakerApparatus exp={exp} phase={phase} />
            </div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen" }} />
            <div className="absolute top-2 right-2">
              <NeonBadge
                label={phase === "idle"     ? (isAs ? "সাজু" : "READY")
                  : phase === "reacting" ? (isAs ? "বিক্ৰিয়া চলিছে" : "REACTING")
                  : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "COMPLETE")
                  : `${isAs ? "পদক্ষেপ" : "STEP"} ${stepIdx + 1}`}
                color={phase === "reacting" ? exp.accent : phase === "complete" ? "#34D399" : "#60A5FA"} />
            </div>
            {/* Solution color indicator */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: phase === "reacting" || phase === "complete" ? exp.solutionColor.after : exp.solutionColor.before }} />
              <span className="text-[9px] text-slate-500">{isAs ? "সমাধানৰ ৰং" : "Solution colour"}</span>
            </div>
          </GlassPanel>

          {/* Step controls */}
          <GlassPanel className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {phase === "complete"
                  ? (isAs ? "✅ সম্পূৰ্ণ" : "✅ Complete")
                  : (isAs ? `${exp.steps.length}-ৰ ${stepIdx + 1} নং পদক্ষেপ` : `Step ${stepIdx + 1}/${exp.steps.length}`)}
              </span>
              <div className="flex gap-1">
                {exp.steps.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: i <= stepIdx && phase !== "idle" ? exp.accent : "rgba(255,255,255,0.15)" }} />)}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx + phase} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="mb-3">
                <p className="text-sm font-black text-white mb-1">{pickLang(exp.steps[stepIdx].label, lang)}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{pickLang(exp.steps[stepIdx].desc, lang)}</p>
              </motion.div>
            </AnimatePresence>

            {phase !== "complete" ? (
              <button onClick={phase === "idle" ? () => setPhase("step1") : nextStep}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white hover:opacity-90 active:scale-95 transition-all"
                style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
                <Play className="w-4 h-4" />
                {phase === "idle"
                  ? (isAs ? "পৰীক্ষা আৰম্ভ কৰক" : "Start Experiment")
                  : stepIdx < exp.steps.length - 1
                    ? pickLang(exp.steps[stepIdx + 1].label, lang)
                    : (isAs ? "সম্পূৰ্ণ" : "Complete")}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl text-xs font-black border hover:bg-white/5 transition-all" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />{isAs ? "পুনৰাবৃত্তি" : "Repeat"}
                </button>
                <button onClick={() => setShowQuiz(true)} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
                  <BarChart2 className="w-3.5 h-3.5 inline mr-1" />{isAs ? "কুইজ দিয়ক" : "Take Quiz"}
                </button>
              </div>
            )}
          </GlassPanel>

          {/* Reactivity series mini */}
          <ReactivityMini exp={exp} />
        </div>

        {/* Middle — Data + Observations */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Equation */}
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সমতুল্য সমীকৰণ" : "Balanced Equation"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-sm border"
              style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>
              {exp.equation}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[[isAs ? "প্ৰকাৰ" : "Type", typeTag], [isAs ? "সক্ৰিয়তা" : "Reactivity", expReactivity], [isAs ? "বিপদ" : "Hazard", exp.hazard]].map(([l, v]) => (
                <div key={l} className="rounded-lg py-2 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[8px] text-slate-600 mb-0.5">{l}</p>
                  <p className="text-[9px] font-black text-slate-300 leading-tight truncate">{v}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Live data */}
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "প্ৰত্যক্ষ তথ্য" : "Live Data"}</p>
            <div className="space-y-3">
              <AnimatedBar label={isAs ? "বিক্ৰিয়াৰ অগ্ৰগতি" : "Reaction Progress"} target={rxnPct} accent={exp.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimatedBar label={isAs ? "উষ্ণতা বৃদ্ধি" : "Temperature Rise"} target={tempPct} accent="#FB923C" icon={<Thermometer className="w-3 h-3" />} />
              {exp.isAcid && <AnimatedBar label={isAs ? "গেছ নিৰ্গমন" : "Gas Evolution"} target={rxnPct} accent="#38BDF8" icon={<Zap className="w-3 h-3" />} />}
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "বিক্ৰিয়াৰ প্ৰকাৰ" : "Reaction Type"} value={isAs ? "এক ধৰণৰ প্ৰতিস্থাপন" : "Single Displacement"} color={exp.accent} />
              <DataRow label={isAs ? "জাৰণ" : "Oxidation"} value={`${exp.id.split("-")[0].toUpperCase()} → ${exp.id.split("-")[0].toUpperCase()}ⁿ⁺`} color="#FB923C" />
              <DataRow label={isAs ? "বিজাৰণ" : "Reduction"} value={exp.isAcid ? "2H⁺ → H₂" : "Cu²⁺ → Cu"} color="#60A5FA" />
              <DataRow label={isAs ? "অৱস্থা" : "State"} value={
                phase === "idle" ? (isAs ? "আৰম্ভ হোৱা নাই" : "Not started")
                : phase === "complete" ? (isAs ? "সম্পূৰ্ণ ✓" : "Completed ✓")
                : (isAs ? "চলি আছে" : "In progress")
              } color={phase === "complete" ? "#34D399" : exp.accent} />
            </div>
          </GlassPanel>

          {/* Observations */}
          <GlassPanel className="p-3 flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "পৰ্যবেক্ষণ লগ" : "Observations Log"}</p>
            <div className="space-y-1.5">
              {expObservations.map((obs, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: phase !== "idle" ? 1 : i === 0 ? 0.4 : 0.15, x: 0 }} transition={{ delay: i * 0.12 }}
                  className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: phase === "complete" ? `${exp.accent}22` : "rgba(255,255,255,0.05)" }}>
                    {phase === "complete" ? <CheckCircle className="w-3 h-3" style={{ color: exp.accent }} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{obs}</p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right — Molecular + Info + Quiz */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <MolecularPanel exp={exp} phase={phase} />

          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5" style={{ color: exp.accent }} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "পৰীক্ষাৰ টোকা" : "Exam Note"}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{expExamNote}</p>
          </GlassPanel>

          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{isAs ? "বাস্তৱ ব্যৱহাৰ" : "Real World"}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{expRealWorld}</p>
          </GlassPanel>

          <div ref={quizRef}>
            <AnimatePresence>
              {showQuiz && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <QuizSection exp={exp} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAB HUB
// ═══════════════════════════════════════════════════════════

function LabHub({ onSelect }: { onSelect: (e: Exp) => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [filter, setFilter] = useState<"All" | "Metal-Salt" | "Metal-Acid">("All");
  const visible = EXPERIMENTS.filter(e => filter === "All" || (filter === "Metal-Acid" ? e.isAcid : !e.isAcid));

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #0D1117 60%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-15 animate-pulse"
            style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: ["#FB923C","#60A5FA","#34D399","#FBBF24","#A78BFA","#F472B6"][i % 6], animationDelay: `${Math.random() * 4}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 pb-28">
        <div className="flex items-center justify-between mb-6">
          <Link href="/virtual-lab/chemistry">
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" /> {isAs ? "ৰসায়ন পৰীক্ষাগাৰ" : "Chemistry Lab"}
            </button>
          </Link>
          <LanguageToggle />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border text-xs font-black uppercase tracking-widest"
            style={{ borderColor: "rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.08)", color: "#60A5FA" }}>
            <FlaskConical className="w-3.5 h-3.5" /> {isAs ? "প্ৰতিস্থাপন বিক্ৰিয়া · অধ্যায় ১" : "Displacement Reactions · Chapter 1"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "প্ৰতিস্থাপন" : "Displacement"}<br />
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #FB923C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isAs ? "বিক্ৰিয়া পৰীক্ষাগাৰ" : "Reactions Lab"}
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs
              ? "৭টা পাৰস্পৰিক প্ৰতিস্থাপন পৰীক্ষা — ধাতু-লৱণ আৰু ধাতু-এচিড বিক্ৰিয়া প্ৰত্যক্ষ ৰং পৰিৱৰ্তন, কণা দৃশ্যকল্পন আৰু CBSE-ধৰণৰ কুইজৰ সৈতে।"
              : "7 interactive displacement experiments — metal-salt and metal-acid reactions with live colour changes, particle visualization, and CBSE-style quiz."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs
              ? [["৭","পৰীক্ষা"],["সক্ৰিয়তা","শ্ৰেণী"],["জাৰণ-বিজাৰণ","বিক্ৰিয়া"],["CBSE","অনুকূল"]]
              : [["7","Experiments"],["Reactivity","Series"],["Redox","Reactions"],["CBSE","Aligned"]]
            ).map(([v,l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-7 flex-wrap justify-center">
          {(["All", "Metal-Salt", "Metal-Acid"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-xs font-black transition-all border"
              style={{ borderColor: filter === f ? "#60A5FA" : "rgba(255,255,255,0.1)", background: filter === f ? "rgba(96,165,250,0.15)" : "transparent", color: filter === f ? "#60A5FA" : "#64748b" }}>
              {f === "All"
                ? (isAs ? "🔬 সকলো প্ৰকাৰ" : "🔬 All Types")
                : f === "Metal-Salt"
                  ? (isAs ? "🧪 ধাতু + লৱণ" : "🧪 Metal + Salt")
                  : (isAs ? "⚗️ ধাতু + এচিড" : "⚗️ Metal + Acid")}
            </button>
          ))}
        </div>

        {/* Reactivity series strip */}
        <div className="mb-8 p-4 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 text-center">{isAs ? "সক্ৰিয়তা শ্ৰেণী (সৰ্বাধিক → সৰ্বনিম্ন সক্ৰিয়)" : "Reactivity Series (Most → Least Reactive)"}</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {SERIES.map(({ m, col }) => (
              <div key={m} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white border"
                  style={{ background: `${col}25`, borderColor: `${col}50`, color: col }}>
                  {m}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-600 text-center mt-2">{isAs ? "ওপৰৰ ধাতুসমূহে সমাধানৰ পৰা তলৰ ধাতুসমূহ প্ৰতিস্থাপন কৰে" : "Metals above displace metals below them from solutions"}</p>
        </div>

        {/* Experiment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((exp, idx) => {
            const cardTitle = pickLang(exp.title, lang);
            const cardSubtitle = pickLang(exp.subtitle, lang);
            const cardReactivity = pickLang(REACTIVITY_LABEL[exp.reactivity], lang);
            return (
              <motion.div key={exp.id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                <button onClick={() => onSelect(exp)} className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${exp.accent}55`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                  <div className="h-1.5" style={{ background: `linear-gradient(to right, ${exp.gradFrom}, ${exp.gradTo})` }} />
                  <div className="p-4">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border shadow-lg"
                          style={{ background: `${exp.accent}18`, borderColor: `${exp.accent}40` }}>
                          {exp.emoji}
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isAs ? "পৰীক্ষা" : "Exp"} {String(exp.num).padStart(2,"0")}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded border" style={{ color: exp.isAcid ? "#34D399" : "#60A5FA", borderColor: exp.isAcid ? "rgba(52,211,153,0.3)" : "rgba(96,165,250,0.3)", background: exp.isAcid ? "rgba(52,211,153,0.08)" : "rgba(96,165,250,0.08)" }}>
                          {exp.isAcid ? (isAs ? "এচিড" : "ACID") : (isAs ? "লৱণ" : "SALT")}
                        </span>
                        {exp.isExo && <span className="text-[8px] font-black px-1.5 py-0.5 rounded border text-orange-400 border-orange-500/30 bg-orange-500/08">{isAs ? "তাপোৎপাদক" : "EXOTHERMIC"}</span>}
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-white mb-0.5 leading-snug">{cardTitle}</h3>
                    <p className="text-[10px] font-semibold mb-2" style={{ color: exp.accent }}>{cardSubtitle}</p>

                    {/* Equation */}
                    <div className="font-mono text-[10px] font-black px-2 py-1.5 rounded-lg mb-3 border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>
                      {exp.equation}
                    </div>

                    {/* Color change preview */}
                    {!exp.isAcid && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-5 rounded-md border border-white/10" style={{ background: exp.solutionColor.before }} />
                        <span className="text-[9px] text-slate-600">→</span>
                        <div className="w-8 h-5 rounded-md border border-white/10" style={{ background: exp.solutionColor.after }} />
                        <span className="text-[9px] text-slate-500">{isAs ? "ৰং পৰিৱৰ্তন" : "colour change"}</span>
                      </div>
                    )}
                    {exp.isAcid && (
                      <div className="flex items-center gap-2 mb-3 text-[9px] text-slate-400">
                        <span>💧 {isAs ? "H₂ গেছ" : "H₂ gas evolved"}</span>
                        <span>🔊 {isAs ? "পপ পৰীক্ষা" : "Pop test"}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full border" style={{ color: exp.reactivity === "Very High" ? "#EF4444" : exp.reactivity === "High" ? "#FB923C" : "#FBBF24", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                        {cardReactivity}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-black transition-transform group-hover:translate-x-1" style={{ color: exp.accent }}>
                        {isAs ? "খোলক" : "Open"} <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════

export default function DisplacementReactionsLab() {
  const [active, setActive] = useState<Exp | null>(null);
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#050B18" }}>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div key="room" className="flex-1 overflow-hidden" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.27 }}>
            <ExperimentRoom exp={active} onBack={() => setActive(null)} />
          </motion.div>
        ) : (
          <motion.div key="hub" className="flex-1 overflow-auto" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.27 }}>
            <LabHub onSelect={setActive} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
