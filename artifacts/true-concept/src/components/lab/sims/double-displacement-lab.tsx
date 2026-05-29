/**
 * Double Displacement & Precipitation Reactions Virtual Lab
 * 5 interactive experiments with precipitate particle physics,
 * ion-exchange molecular view, SVG apparatus, and CBSE quiz.
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";
import {
  ArrowLeft, Shield, FlaskConical, RotateCcw, Play,
  AlertTriangle, CheckCircle, Info, ChevronRight, BarChart2,
  Droplets, Zap,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ExpId = "na2so4-bacl2" | "agno3-hcl" | "pbno3-ki" | "bacl2-al2so4" | "kbr-bai2";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "ppt-white" | "ppt-yellow" | "ppt-curdy" | "mix-ions" | "none";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; blur: number;
  type: "cloud" | "settle" | "ion" | "crystal" | "spark";
  settled?: boolean; settleY?: number;
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
  sol1: { label: string; color: string; name: BilingualField<string> };
  sol2: { label: string; color: string; name: BilingualField<string> };
  pptName: BilingualField<string>;
  spectatorIons: BilingualField<string>;
  // Language-neutral
  equation: string; netIonic: string;
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  pptColor: string; hasPpt: boolean;
  hazard: "LOW" | "MEDIUM" | "HIGH";
  pmode: PMode;
}

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════

const EXPERIMENTS: Exp[] = [
  {
    id: "na2so4-bacl2", num: 1,
    title: { en: "Sodium Sulphate + Barium Chloride", as: "ছ’ডিয়াম ছালফেট + বেৰিয়াম ক্ল’ৰাইড" },
    subtitle: { en: "White Precipitate Formation", as: "বগা অৱক্ষেপ গঠন" },
    equation: "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl",
    netIonic: "Ba²⁺ + SO₄²⁻ → BaSO₄↓",
    accent: "#F8FAFC", glow: "rgba(248,250,252,0.3)", gradFrom: "#64748B", gradTo: "#CBD5E1", emoji: "⚪",
    sol1: { label: "Na₂SO₄", color: "rgba(248,250,252,0.15)", name: { en: "Sodium Sulphate (colourless)", as: "ছ’ডিয়াম ছালফেট (বৰ্ণহীন)" } },
    sol2: { label: "BaCl₂", color: "rgba(248,250,252,0.15)", name: { en: "Barium Chloride (colourless)", as: "বেৰিয়াম ক্ল’ৰাইড (বৰ্ণহীন)" } },
    pptColor: "#F8FAFC", pptName: { en: "Barium Sulphate (BaSO₄)", as: "বেৰিয়াম ছালফেট (BaSO₄)" }, hasPpt: true,
    hazard: "MEDIUM",
    description: { en: "When sodium sulphate and barium chloride solutions are mixed, Ba²⁺ and SO₄²⁻ ions combine to form insoluble white barium sulphate precipitate. Na⁺ and Cl⁻ ions remain in solution as spectator ions.", as: "ছ’ডিয়াম ছালফেট আৰু বেৰিয়াম ক্ল’ৰাইড সমাধান মিহলোৱাত Ba²⁺ আৰু SO₄²⁻ আয়ন মিলি অদ্ৰৱণীয় বগা বেৰিয়াম ছালফেট অৱক্ষেপ গঠন কৰে। Na⁺ আৰু Cl⁻ আয়ন দৰ্শক আয়ন হিচাপে সমাধানত থাকে।" },
    realWorld: { en: "Detection of SO₄²⁻ ions · Barium meal X-rays · White pigment production · Water hardness testing", as: "SO₄²⁻ আয়ন চিনাক্তকৰণ · বেৰিয়াম মিল এক্স-ৰে · বগা পিগমেণ্ট উৎপাদন · পানীৰ কঠিনতা পৰীক্ষা" },
    examNote: { en: "BaSO₄ is a white insoluble precipitate. Net ionic equation: Ba²⁺ + SO₄²⁻ → BaSO₄↓. Na⁺ and Cl⁻ are spectator ions. This is the standard test for sulphate ions.", as: "BaSO₄ এক বগা অদ্ৰৱণীয় অৱক্ষেপ। নেট আয়নিক সমীকৰণ: Ba²⁺ + SO₄²⁻ → BaSO₄↓। Na⁺ আৰু Cl⁻ দৰ্শক আয়ন। এইটো ছালফেট আয়নৰ মানক পৰীক্ষা।" },
    safety: { en: ["BaCl₂ is toxic — avoid ingestion", "Wear gloves and goggles", "Dispose of barium salts safely"], as: ["BaCl₂ বিষাক্ত — গিলিব নলাগে", "দস্তানা আৰু চশমা পিন্ধক", "বেৰিয়াম লৱণ সুৰক্ষিতভাৱে নিষ্পত্তি কৰক"] },
    steps: [
      { label: { en: "Prepare Solutions", as: "সমাধান প্ৰস্তুত কৰক" }, desc: { en: "Take colourless Na₂SO₄ solution in a test tube. Note: both solutions are transparent and colourless.", as: "টেষ্ট টিউবত বৰ্ণহীন Na₂SO₄ সমাধান লওক। লক্ষ্য কৰক: দুয়োটা সমাধান স্বচ্ছ আৰু বৰ্ণহীন।" } },
      { label: { en: "Add BaCl₂ Slowly", as: "BaCl₂ লাহে লাহে যোগ কৰক" }, desc: { en: "Carefully add barium chloride solution dropwise from a dropper into the Na₂SO₄ solution.", as: "ড্ৰপাৰৰ পৰা সাৱধানে বেৰিয়াম ক্ল’ৰাইড সমাধান টোপাল টোপালে Na₂SO₄ সমাধানত যোগ কৰক।" } },
      { label: { en: "Observe Precipitate", as: "অৱক্ষেপ লক্ষ্য কৰক" }, desc: { en: "Instant white cloudiness appears! BaSO₄ precipitate forms immediately on mixing.", as: "তৎক্ষণাৎ বগা ঘোলা ৰং দেখা যায়! মিহলোৱাৰ লগে লগে BaSO₄ অৱক্ষেপ গঠিত হয়।" } },
      { label: { en: "Allow to Settle", as: "পৰিব দিয়ক" }, desc: { en: "White BaSO₄ particles slowly settle to the bottom. Supernatant liquid (NaCl) remains clear.", as: "বগা BaSO₄ কণিকা লাহে লাহে তললৈ পৰে। ওপৰৰ তৰল (NaCl) স্বচ্ছ থাকে।" } },
    ],
    observations: { en: ["Immediate white cloudiness on mixing", "Dense white BaSO₄ precipitate forms", "Precipitate gradually settles to bottom", "Supernatant remains clear (NaCl solution)"], as: ["মিহলোৱাৰ লগে লগে বগা ঘোলা", "ঘন বগা BaSO₄ অৱক্ষেপ গঠিত হয়", "অৱক্ষেপ ক্ৰমে তললৈ পৰে", "ওপৰৰ তৰল স্বচ্ছ থাকে (NaCl সমাধান)"] },
    pmode: "ppt-white",
    spectatorIons: { en: "Na⁺ and Cl⁻", as: "Na⁺ আৰু Cl⁻" },
    quiz: [
      { q: { en: "Which white precipitate forms in this reaction?", as: "এই বিক্ৰিয়াত কি বগা অৱক্ষেপ গঠিত হয়?" }, opts: { en: ["NaCl", "BaSO₄", "BaCl₂", "Na₂SO₄"], as: ["NaCl", "BaSO₄", "BaCl₂", "Na₂SO₄"] }, ans: 1 },
      { q: { en: "Which ions are spectator ions?", as: "কোন আয়নবোৰ দৰ্শক আয়ন?" }, opts: { en: ["Ba²⁺ and SO₄²⁻", "Na⁺ and Cl⁻", "Na⁺ and SO₄²⁻", "Ba²⁺ and Cl⁻"], as: ["Ba²⁺ আৰু SO₄²⁻", "Na⁺ আৰু Cl⁻", "Na⁺ আৰু SO₄²⁻", "Ba²⁺ আৰু Cl⁻"] }, ans: 1 },
      { q: { en: "This reaction is used as the test for:", as: "এই বিক্ৰিয়া ইয়াৰ পৰীক্ষাৰ বাবে ব্যৱহাৰ হয়:" }, opts: { en: ["Chloride ions", "Sodium ions", "Sulphate ions", "Barium ions"], as: ["ক্ল’ৰাইড আয়ন", "ছ’ডিয়াম আয়ন", "ছালফেট আয়ন", "বেৰিয়াম আয়ন"] }, ans: 2 },
      { q: { en: "The net ionic equation is:", as: "নেট আয়নিক সমীকৰণ:" }, opts: { en: ["Na⁺ + Cl⁻ → NaCl", "Ba²⁺ + SO₄²⁻ → BaSO₄↓", "Na₂SO₄ + BaCl₂ → products", "2Na⁺ + SO₄²⁻ → Na₂SO₄↓"], as: ["Na⁺ + Cl⁻ → NaCl", "Ba²⁺ + SO₄²⁻ → BaSO₄↓", "Na₂SO₄ + BaCl₂ → উৎপাদ", "2Na⁺ + SO₄²⁻ → Na₂SO₄↓"] }, ans: 1 },
    ],
  },
  {
    id: "agno3-hcl", num: 2,
    title: { en: "Silver Nitrate + Hydrochloric Acid", as: "ছিলভাৰ নাইট্ৰেট + হাইড্ৰ’ক্ল’ৰিক এচিড" },
    subtitle: { en: "White Curdy Precipitate", as: "বগা পনীৰ-সদৃশ অৱক্ষেপ" },
    equation: "AgNO₃ + HCl → AgCl↓ + HNO₃",
    netIonic: "Ag⁺ + Cl⁻ → AgCl↓",
    accent: "#E2E8F0", glow: "rgba(226,232,240,0.35)", gradFrom: "#475569", gradTo: "#94A3B8", emoji: "🥛",
    sol1: { label: "AgNO₃", color: "rgba(248,250,252,0.12)", name: { en: "Silver Nitrate (colourless)", as: "ছিলভাৰ নাইট্ৰেট (বৰ্ণহীন)" } },
    sol2: { label: "HCl", color: "rgba(240,249,255,0.12)", name: { en: "Hydrochloric Acid (colourless)", as: "হাইড্ৰ’ক্ল’ৰিক এচিড (বৰ্ণহীন)" } },
    pptColor: "#E2E8F0", pptName: { en: "Silver Chloride (AgCl)", as: "ছিলভাৰ ক্ল’ৰাইড (AgCl)" }, hasPpt: true,
    hazard: "HIGH",
    description: { en: "Silver nitrate reacts with hydrochloric acid to form white curdy silver chloride precipitate. AgCl is insoluble in water but dissolves in ammonia solution. This is the standard test for chloride ions.", as: "ছিলভাৰ নাইট্ৰেটে হাইড্ৰ’ক্ল’ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰি বগা পনীৰ-সদৃশ ছিলভাৰ ক্ল’ৰাইড অৱক্ষেপ গঠন কৰে। AgCl পানীত অদ্ৰৱণীয় কিন্তু এম’নিয়া সমাধানত দ্ৰৱীভূত হয়। এইটো ক্ল’ৰাইড আয়নৰ মানক পৰীক্ষা।" },
    realWorld: { en: "Chloride ion test · Photographic film · Silver recovery · Analytical chemistry", as: "ক্ল’ৰাইড আয়ন পৰীক্ষা · ফ’টোগ্ৰাফিক ফিল্ম · ৰূপ পুনৰুদ্ধাৰ · বিশ্লেষণাত্মক ৰসায়ন" },
    examNote: { en: "AgCl is a white CURDY precipitate (not fluffy — curdy/cheese-like texture). It is soluble in NH₃ solution. Net ionic: Ag⁺ + Cl⁻ → AgCl↓. This tests for Cl⁻ ions. CBSE frequently asks about the curdy texture.", as: "AgCl বগা পনীৰ-সদৃশ অৱক্ষেপ (মৃদু নহয় — পনীৰৰ দৰে গাঢ় গঠন)। ই NH₃ সমাধানত দ্ৰৱণীয়। নেট আয়নিক: Ag⁺ + Cl⁻ → AgCl↓। ইয়াৰ দ্বাৰা Cl⁻ আয়ন পৰীক্ষা কৰা হয়। CBSE-এ প্ৰায়ে পনীৰ-সদৃশ গঠনৰ বিষয়ে সোধে।" },
    safety: { en: ["AgNO₃ stains skin black", "HCl fumes are irritating", "Wear goggles and gloves", "Work in ventilated area"], as: ["AgNO₃-এ চামৰি ক’লা কৰে", "HCl-ৰ ধোঁৱা জ্বলজ্বলাকাৰক", "চশমা আৰু দস্তানা পিন্ধক", "বায়ু চলাচলযুক্ত স্থানত কাম কৰক"] },
    steps: [
      { label: { en: "Prepare AgNO₃", as: "AgNO₃ প্ৰস্তুত কৰক" }, desc: { en: "Take colourless silver nitrate solution. Keep in dark — AgNO₃ is light-sensitive and may decompose.", as: "বৰ্ণহীন ছিলভাৰ নাইট্ৰেট সমাধান লওক। আন্ধাৰত ৰাখক — AgNO₃ পোহৰ-সংবেদনশীল আৰু বিযোজিত হ’ব পাৰে।" } },
      { label: { en: "Add HCl Dropwise", as: "HCl টোপাল টোপালে যোগ কৰক" }, desc: { en: "Add dilute HCl solution slowly. Immediate reaction occurs at point of contact.", as: "তনু HCl সমাধান লাহে লাহে যোগ কৰক। স্পৰ্শৰ বিন্দুত তৎক্ষণাৎ বিক্ৰিয়া হয়।" } },
      { label: { en: "Observe Curdy Ppt", as: "পনীৰ-সদৃশ অৱক্ষেপ লক্ষ্য কৰক" }, desc: { en: "White CURDY precipitate of AgCl forms immediately. Note the curdy/cheese-like texture.", as: "AgCl-ৰ বগা পনীৰ-সদৃশ অৱক্ষেপ তৎক্ষণাৎ গঠিত হয়। পনীৰৰ দৰে গঠন লক্ষ্য কৰক।" } },
      { label: { en: "Ammonia Test", as: "এম’নিয়া পৰীক্ষা" }, desc: { en: "Add ammonia solution — AgCl dissolves! This confirms AgCl (distinguishes from BaSO₄).", as: "এম’নিয়া সমাধান যোগ কৰক — AgCl দ্ৰৱীভূত হয়! ইয়াৰ দ্বাৰা AgCl নিশ্চিত হয় (BaSO₄-ৰ পৰা পৃথক)।" } },
    ],
    observations: { en: ["Immediate white curdy precipitate on adding HCl", "Curdy texture (unlike fluffy BaSO₄)", "Precipitate settles slowly", "Dissolves in ammonia solution (diagnostic test)"], as: ["HCl যোগ কৰাৰ লগে লগে বগা পনীৰ-সদৃশ অৱক্ষেপ", "পনীৰ-সদৃশ গঠন (BaSO₄-ৰ মৃদু নহয়)", "অৱক্ষেপ লাহে লাহে পৰে", "এম’নিয়া সমাধানত দ্ৰৱীভূত হয় (নিৰ্ণায়ক পৰীক্ষা)"] },
    pmode: "ppt-curdy",
    spectatorIons: { en: "NO₃⁻ and H⁺", as: "NO₃⁻ আৰু H⁺" },
    quiz: [
      { q: { en: "What is the colour and texture of AgCl precipitate?", as: "AgCl অৱক্ষেপৰ ৰং আৰু গঠন কি?" }, opts: { en: ["Yellow fluffy", "White curdy", "White fluffy", "Pale yellow"], as: ["হালধীয়া মৃদু", "বগা পনীৰ-সদৃশ", "বগা মৃদু", "পাতল হালধীয়া"] }, ans: 1 },
      { q: { en: "AgCl precipitate is soluble in:", as: "AgCl অৱক্ষেপ ইয়াত দ্ৰৱণীয়:" }, opts: { en: ["Water", "HCl", "Ammonia solution", "H₂SO₄"], as: ["পানী", "HCl", "এম’নিয়া সমাধান", "H₂SO₄"] }, ans: 2 },
      { q: { en: "This reaction is the standard test for:", as: "এই বিক্ৰিয়া ইয়াৰ মানক পৰীক্ষা:" }, opts: { en: ["Sulphate ions", "Silver ions", "Nitrate ions", "Chloride ions"], as: ["ছালফেট আয়ন", "ৰূপৰ আয়ন", "নাইট্ৰেট আয়ন", "ক্ল’ৰাইড আয়ন"] }, ans: 3 },
      { q: { en: "Net ionic equation for this reaction is:", as: "এই বিক্ৰিয়াৰ নেট আয়নিক সমীকৰণ:" }, opts: { en: ["Ag⁺ + NO₃⁻ → AgNO₃", "Ag⁺ + Cl⁻ → AgCl↓", "H⁺ + Cl⁻ → HCl", "AgNO₃ → Ag + NO₃"], as: ["Ag⁺ + NO₃⁻ → AgNO₃", "Ag⁺ + Cl⁻ → AgCl↓", "H⁺ + Cl⁻ → HCl", "AgNO₃ → Ag + NO₃"] }, ans: 1 },
    ],
  },
  {
    id: "pbno3-ki", num: 3,
    title: { en: "Lead Nitrate + Potassium Iodide", as: "ছীহ নাইট্ৰেট + পটাছিয়াম আইডাইড" },
    subtitle: { en: "Bright Yellow Precipitate", as: "উজ্জ্বল হালধীয়া অৱক্ষেপ" },
    equation: "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
    netIonic: "Pb²⁺ + 2I⁻ → PbI₂↓",
    accent: "#FDE047", glow: "rgba(253,224,71,0.45)", gradFrom: "#CA8A04", gradTo: "#FDE047", emoji: "🟡",
    sol1: { label: "Pb(NO₃)₂", color: "rgba(248,250,252,0.12)", name: { en: "Lead Nitrate (colourless)", as: "ছীহ নাইট্ৰেট (বৰ্ণহীন)" } },
    sol2: { label: "KI", color: "rgba(248,250,252,0.12)", name: { en: "Potassium Iodide (colourless)", as: "পটাছিয়াম আইডাইড (বৰ্ণহীন)" } },
    pptColor: "#FDE047", pptName: { en: "Lead Iodide (PbI₂)", as: "ছীহ আইডাইড (PbI₂)" }, hasPpt: true,
    hazard: "HIGH",
    description: { en: "Lead nitrate reacts with potassium iodide to form a brilliant yellow precipitate of lead iodide (PbI₂). The vivid yellow colour makes this one of the most visually striking precipitation reactions. Both reactant solutions are colourless, making the colour change dramatic.", as: "ছীহ নাইট্ৰেটে পটাছিয়াম আইডাইডৰ সৈতে বিক্ৰিয়া কৰি ছীহ আইডাইড (PbI₂)-ৰ এক উজ্জ্বল হালধীয়া অৱক্ষেপ গঠন কৰে। চটচটে হালধীয়া ৰঙে ইয়াক দৃষ্টিনন্দন অৱক্ষেপ বিক্ৰিয়াৰ এটা কৰি তোলে। দুয়োটা বিক্ৰিয়াকাৰক সমাধান বৰ্ণহীন, যাৰ ফলত ৰং পৰিৱৰ্তন নাটকীয় হয়।" },
    realWorld: { en: "Lead detection in water · Analytical chemistry · Educational demonstrations · Lead contamination testing", as: "পানীত ছীহ চিনাক্তকৰণ · বিশ্লেষণাত্মক ৰসায়ন · শিক্ষামূলক প্ৰদৰ্শন · ছীহ দূষণ পৰীক্ষা" },
    examNote: { en: "PbI₂ is a BRIGHT YELLOW precipitate — very distinctive. Pb²⁺ + 2I⁻ → PbI₂↓. Lead compounds are toxic. KNO₃ remains in solution as spectator. CBSE boards frequently ask about the yellow colour of PbI₂.", as: "PbI₂ উজ্জ্বল হালধীয়া অৱক্ষেপ — অতি বৈশিষ্ট্যপূৰ্ণ। Pb²⁺ + 2I⁻ → PbI₂↓। ছীহ যৌগ বিষাক্ত। KNO₃ দৰ্শক হিচাপে সমাধানত থাকে। CBSE বাৰ্ডে প্ৰায়ে PbI₂-ৰ হালধীয়া ৰঙৰ বিষয়ে সোধে।" },
    safety: { en: ["Lead compounds are TOXIC — serious health hazard", "Never ingest or inhale", "Wear nitrile gloves and goggles", "Dispose of lead waste in designated containers"], as: ["ছীহ যৌগ বিষাক্ত — গম্ভীৰ স্বাস্থ্য বিপদ", "কেতিয়াও গিলিব বা উশাহত নলব", "নাইট্ৰাইল দস্তানা আৰু চশমা পিন্ধক", "ছীহ আবৰ্জনা নিৰ্ধাৰিত পাত্ৰত নিষ্পত্তি কৰক"] },
    steps: [
      { label: { en: "Prepare Lead Nitrate", as: "ছীহ নাইট্ৰেট প্ৰস্তুত কৰক" }, desc: { en: "Take colourless Pb(NO₃)₂ solution. Handle with extreme care — all lead compounds are highly toxic.", as: "বৰ্ণহীন Pb(NO₃)₂ সমাধান লওক। অতি সাৱধানে নাড়ক — সকলো ছীহ যৌগ অতি বিষাক্ত।" } },
      { label: { en: "Add KI Solution", as: "KI সমাধান যোগ কৰক" }, desc: { en: "Add potassium iodide solution to Pb(NO₃)₂. Both solutions are initially colourless.", as: "Pb(NO₃)₂-ত পটাছিয়াম আইডাইড সমাধান যোগ কৰক। দুয়োটা সমাধান আৰম্ভণিতে বৰ্ণহীন।" } },
      { label: { en: "Dramatic Colour Change", as: "নাটকীয় ৰং পৰিৱৰ্তন" }, desc: { en: "Brilliant YELLOW cloud of PbI₂ instantly appears! Striking colour change from clear to vivid yellow.", as: "PbI₂-ৰ উজ্জ্বল হালধীয়া মেঘ তৎক্ষণাৎ দেখা যায়! স্বচ্ছৰ পৰা চটচটে হালধীয়ালৈ আকৰ্ষণীয় ৰং পৰিৱৰ্তন।" } },
      { label: { en: "Observe Settling", as: "পৰা লক্ষ্য কৰক" }, desc: { en: "Yellow PbI₂ crystals settle slowly. The yellow precipitate is very distinctive and characteristic.", as: "হালধীয়া PbI₂ স্ফটিক লাহে লাহে পৰে। হালধীয়া অৱক্ষেপ অতি বৈশিষ্ট্যপূৰ্ণ।" } },
    ],
    observations: { en: ["Both solutions colourless before mixing", "Instant brilliant yellow PbI₂ precipitate", "Dense yellow cloud forms on mixing", "Yellow crystals settle gradually to bottom"], as: ["মিহলোৱাৰ আগতে দুয়োটা সমাধান বৰ্ণহীন", "তৎক্ষণাৎ উজ্জ্বল হালধীয়া PbI₂ অৱক্ষেপ", "মিহলোৱাত ঘন হালধীয়া মেঘ গঠিত হয়", "হালধীয়া স্ফটিক ক্ৰমে তললৈ পৰে"] },
    pmode: "ppt-yellow",
    spectatorIons: { en: "K⁺ and NO₃⁻", as: "K⁺ আৰু NO₃⁻" },
    quiz: [
      { q: { en: "What colour is the PbI₂ precipitate?", as: "PbI₂ অৱক্ষেপৰ ৰং কি?" }, opts: { en: ["White", "Red", "Yellow", "Green"], as: ["বগা", "ৰঙা", "হালধীয়া", "সেউজীয়া"] }, ans: 2 },
      { q: { en: "Which ions form PbI₂?", as: "কোন আয়নবোৰে PbI₂ গঠন কৰে?" }, opts: { en: ["Pb²⁺ and NO₃⁻", "Pb²⁺ and I⁻", "K⁺ and I⁻", "K⁺ and NO₃⁻"], as: ["Pb²⁺ আৰু NO₃⁻", "Pb²⁺ আৰু I⁻", "K⁺ আৰু I⁻", "K⁺ আৰু NO₃⁻"] }, ans: 1 },
      { q: { en: "The spectator ions in this reaction are:", as: "এই বিক্ৰিয়াৰ দৰ্শক আয়ন:" }, opts: { en: ["Pb²⁺ and I⁻", "Pb²⁺ and NO₃⁻", "K⁺ and NO₃⁻", "K⁺ and I⁻"], as: ["Pb²⁺ আৰু I⁻", "Pb²⁺ আৰু NO₃⁻", "K⁺ আৰু NO₃⁻", "K⁺ আৰু I⁻"] }, ans: 2 },
      { q: { en: "Why are lead compounds dangerous?", as: "ছীহ যৌগ কিয় বিপজ্জনক?" }, opts: { en: ["They are radioactive", "They are explosive", "They are highly toxic", "They are flammable"], as: ["ইহঁত তেজস্ক্ৰিয়", "ইহঁত বিস্ফোৰক", "ইহঁত অতি বিষাক্ত", "ইহঁত দাহ্য"] }, ans: 2 },
      { q: { en: "The ratio of I⁻ to Pb²⁺ in PbI₂ is:", as: "PbI₂-ত I⁻ আৰু Pb²⁺-ৰ অনুপাত:" }, opts: { en: ["1:1", "2:1", "1:2", "3:1"], as: ["1:1", "2:1", "1:2", "3:1"] }, ans: 1 },
    ],
  },
  {
    id: "bacl2-al2so4", num: 4,
    title: { en: "Barium Chloride + Aluminium Sulphate", as: "বেৰিয়াম ক্ল’ৰাইড + এলুমিনিয়াম ছালফেট" },
    subtitle: { en: "Dense White Precipitate", as: "ঘন বগা অৱক্ষেপ" },
    equation: "3BaCl₂ + Al₂(SO₄)₃ → 2AlCl₃ + 3BaSO₄↓",
    netIonic: "Ba²⁺ + SO₄²⁻ → BaSO₄↓",
    accent: "#CBD5E1", glow: "rgba(203,213,225,0.35)", gradFrom: "#334155", gradTo: "#94A3B8", emoji: "🔬",
    sol1: { label: "BaCl₂", color: "rgba(248,250,252,0.12)", name: { en: "Barium Chloride (colourless)", as: "বেৰিয়াম ক্ল’ৰাইড (বৰ্ণহীন)" } },
    sol2: { label: "Al₂(SO₄)₃", color: "rgba(248,250,252,0.12)", name: { en: "Aluminium Sulphate (colourless)", as: "এলুমিনিয়াম ছালফেট (বৰ্ণহীন)" } },
    pptColor: "#F8FAFC", pptName: { en: "Barium Sulphate (BaSO₄)", as: "বেৰিয়াম ছালফেট (BaSO₄)" }, hasPpt: true,
    hazard: "MEDIUM",
    description: { en: "Three moles of barium chloride react with one mole of aluminium sulphate to produce three moles of insoluble white barium sulphate precipitate and two moles of aluminium chloride in solution. The net ionic equation is the same as Na₂SO₄ + BaCl₂ since the same ions react.", as: "তিনি ম’ল বেৰিয়াম ক্ল’ৰাইডে এক ম’ল এলুমিনিয়াম ছালফেটৰ সৈতে বিক্ৰিয়া কৰি তিনি ম’ল অদ্ৰৱণীয় বগা বেৰিয়াম ছালফেট অৱক্ষেপ আৰু সমাধানত দুই ম’ল এলুমিনিয়াম ক্ল’ৰাইড উৎপন্ন কৰে। একে আয়নবোৰ বিক্ৰিয়া কৰাত নেট আয়নিক সমীকৰণ Na₂SO₄ + BaCl₂-ৰ একে।" },
    realWorld: { en: "Sulphate ion quantification · Gravimetric analysis · Water quality testing · Industrial chemistry", as: "ছালফেট আয়ন পৰিমাপ · গ্ৰেভিমেট্ৰিক বিশ্লেষণ · পানীৰ গুণৱত্তা পৰীক্ষা · ঔদ্যোগিক ৰসায়ন" },
    examNote: { en: "Same precipitate (BaSO₄) as Na₂SO₄ + BaCl₂ but with different stoichiometry. 3:1 ratio of BaCl₂:Al₂(SO₄)₃. Net ionic still Ba²⁺ + SO₄²⁻ → BaSO₄↓. Important for balancing practice.", as: "Na₂SO₄ + BaCl₂-ৰ সদৃশ একে অৱক্ষেপ (BaSO₄) কিন্তু ভিন্ন ষ্ট’ইক’মেট্ৰিৰ সৈতে। BaCl₂:Al₂(SO₄)₃-ৰ ৩:১ অনুপাত। নেট আয়নিক এতিয়াও Ba²⁺ + SO₄²⁻ → BaSO₄↓। সমতা ৰক্ষাৰ অনুশীলনৰ বাবে গুৰুত্বপূৰ্ণ।" },
    safety: { en: ["BaCl₂ is toxic", "Wear gloves", "Wash hands thoroughly", "Aluminium sulphate is a mild irritant"], as: ["BaCl₂ বিষাক্ত", "দস্তানা পিন্ধক", "হাত ভালদৰে ধুব", "এলুমিনিয়াম ছালফেট মৃদু জ্বলজ্বলাকাৰক"] },
    steps: [
      { label: { en: "Prepare BaCl₂", as: "BaCl₂ প্ৰস্তুত কৰক" }, desc: { en: "Take barium chloride solution. It is colourless. Note: 3 moles of BaCl₂ react with 1 mole of Al₂(SO₄)₃.", as: "বেৰিয়াম ক্ল’ৰাইড সমাধান লওক। ই বৰ্ণহীন। লক্ষ্য কৰক: ৩ ম’ল BaCl₂ ১ ম’ল Al₂(SO₄)₃-ৰ সৈতে বিক্ৰিয়া কৰে।" } },
      { label: { en: "Add Al₂(SO₄)₃", as: "Al₂(SO₄)₃ যোগ কৰক" }, desc: { en: "Add aluminium sulphate solution. Each Al₂(SO₄)₃ provides 3 SO₄²⁻ ions for 3 BaSO₄ precipitates.", as: "এলুমিনিয়াম ছালফেট সমাধান যোগ কৰক। প্ৰতি Al₂(SO₄)₃-এ ৩ BaSO₄ অৱক্ষেপৰ বাবে ৩ SO₄²⁻ আয়ন দিয়ে।" } },
      { label: { en: "Dense Precipitation", as: "ঘন অৱক্ষেপণ" }, desc: { en: "Dense white BaSO₄ precipitate forms. More precipitate than Na₂SO₄ + BaCl₂ due to 3× sulphate ions.", as: "ঘন বগা BaSO₄ অৱক্ষেপ গঠিত হয়। ৩× ছালফেট আয়নৰ বাবে Na₂SO₄ + BaCl₂-তকৈ অধিক অৱক্ষেপ।" } },
      { label: { en: "Analyse Products", as: "উৎপাদ বিশ্লেষণ কৰক" }, desc: { en: "White BaSO₄↓ settles. Colourless AlCl₃ remains in solution. Same net ionic as previous sulphate test.", as: "বগা BaSO₄↓ পৰে। বৰ্ণহীন AlCl₃ সমাধানত থাকে। পূৰ্বৰ ছালফেট পৰীক্ষাৰ একে নেট আয়নিক।" } },
    ],
    observations: { en: ["Dense white cloudiness immediately on mixing", "Large amount of BaSO₄ precipitate (3 moles per formula unit)", "Precipitate settles leaving clear AlCl₃ solution", "White precipitate identical to BaSO₄ from other sulphate tests"], as: ["মিহলোৱাৰ লগে লগে ঘন বগা ঘোলা", "বহু পৰিমাণে BaSO₄ অৱক্ষেপ (প্ৰতি সূত্ৰ এককত ৩ ম’ল)", "অৱক্ষেপ পৰি স্বচ্ছ AlCl₃ সমাধান থাকে", "অন্য ছালফেট পৰীক্ষাৰ BaSO₄-ৰ সদৃশ বগা অৱক্ষেপ"] },
    pmode: "ppt-white",
    spectatorIons: { en: "Al³⁺ and Cl⁻", as: "Al³⁺ আৰু Cl⁻" },
    quiz: [
      { q: { en: "Which precipitate forms in this reaction?", as: "এই বিক্ৰিয়াত কি অৱক্ষেপ গঠিত হয়?" }, opts: { en: ["AlCl₃", "BaSO₄", "Al₂(SO₄)₃", "BaCl₂"], as: ["AlCl₃", "BaSO₄", "Al₂(SO₄)₃", "BaCl₂"] }, ans: 1 },
      { q: { en: "How many moles of BaSO₄ form from 1 mole of Al₂(SO₄)₃?", as: "১ ম’ল Al₂(SO₄)₃-ৰ পৰা কিমান ম’ল BaSO₄ গঠিত হয়?" }, opts: { en: ["1", "2", "3", "4"], as: ["1", "2", "3", "4"] }, ans: 2 },
      { q: { en: "The spectator ions in this reaction are:", as: "এই বিক্ৰিয়াৰ দৰ্শক আয়ন:" }, opts: { en: ["Ba²⁺ and SO₄²⁻", "Al³⁺ and Cl⁻", "Ba²⁺ and Cl⁻", "Al³⁺ and SO₄²⁻"], as: ["Ba²⁺ আৰু SO₄²⁻", "Al³⁺ আৰু Cl⁻", "Ba²⁺ আৰু Cl⁻", "Al³⁺ আৰু SO₄²⁻"] }, ans: 1 },
      { q: { en: "The net ionic equation for this reaction is:", as: "এই বিক্ৰিয়াৰ নেট আয়নিক সমীকৰণ:" }, opts: { en: ["Ba²⁺ + 2Cl⁻ → BaCl₂↓", "Al³⁺ + Cl⁻ → AlCl₃↓", "Ba²⁺ + SO₄²⁻ → BaSO₄↓", "3Ba²⁺ + Al₂(SO₄)₃ → products"], as: ["Ba²⁺ + 2Cl⁻ → BaCl₂↓", "Al³⁺ + Cl⁻ → AlCl₃↓", "Ba²⁺ + SO₄²⁻ → BaSO₄↓", "3Ba²⁺ + Al₂(SO₄)₃ → উৎপাদ"] }, ans: 2 },
    ],
  },
  {
    id: "kbr-bai2", num: 5,
    title: { en: "Potassium Bromide + Barium Iodide", as: "পটাছিয়াম ব্ৰ’মাইড + বেৰিয়াম আইডাইড" },
    subtitle: { en: "No Precipitate — Ion Exchange Only", as: "অৱক্ষেপ নাই — কেৱল আয়ন বিনিময়" },
    equation: "2KBr + BaI₂ → 2KI + BaBr₂",
    netIonic: "No reaction (all products soluble)",
    accent: "#34D399", glow: "rgba(52,211,153,0.4)", gradFrom: "#059669", gradTo: "#34D399", emoji: "🌊",
    sol1: { label: "KBr", color: "rgba(248,250,252,0.15)", name: { en: "Potassium Bromide (colourless)", as: "পটাছিয়াম ব্ৰ’মাইড (বৰ্ণহীন)" } },
    sol2: { label: "BaI₂", color: "rgba(253,224,71,0.12)", name: { en: "Barium Iodide (pale yellow)", as: "বেৰিয়াম আইডাইড (পাতল হালধীয়া)" } },
    pptColor: "transparent", pptName: { en: "No precipitate formed", as: "কোনো অৱক্ষেপ গঠিত নহয়" }, hasPpt: false,
    hazard: "LOW",
    description: { en: "When potassium bromide and barium iodide solutions are mixed, ion exchange occurs forming potassium iodide and barium bromide. HOWEVER — both products are soluble in water, so NO precipitate forms. This teaches the concept of solubility rules and when precipitation occurs.", as: "পটাছিয়াম ব্ৰ’মাইড আৰু বেৰিয়াম আইডাইড সমাধান মিহলোৱাত আয়ন বিনিময় হৈ পটাছিয়াম আইডাইড আৰু বেৰিয়াম ব্ৰ’মাইড গঠিত হয়। কিন্তু — দুয়োটা উৎপাদ পানীত দ্ৰৱণীয়, সেয়েহে কোনো অৱক্ষেপ গঠিত নহয়। এইটোৱে দ্ৰৱণীয়তাৰ নিয়ম আৰু অৱক্ষেপণ কেতিয়া হয় সেই ধাৰণা শিকায়।" },
    realWorld: { en: "Solubility rules in analytical chemistry · Understanding ionic reactions · Non-precipitation ion exchange · Concept of spectator ions", as: "বিশ্লেষণাত্মক ৰসায়নত দ্ৰৱণীয়তা নিয়ম · আয়নিক বিক্ৰিয়া বুজা · অৱক্ষেপ-নোহোৱা আয়ন বিনিময় · দৰ্শক আয়নৰ ধাৰণা" },
    examNote: { en: "KEY CONCEPT: Not all double displacement reactions form precipitates! KI and BaBr₂ are BOTH soluble. So no visible change occurs. All ions remain in solution — this IS a double displacement but WITHOUT precipitation. Tests understanding of solubility rules.", as: "মুখ্য ধাৰণা: সকলো দ্বৈত প্ৰতিস্থাপন বিক্ৰিয়াত অৱক্ষেপ গঠিত নহয়! KI আৰু BaBr₂ দুয়োটা দ্ৰৱণীয়। সেয়েহে কোনো দৃশ্যমান পৰিবৰ্তন নহয়। সকলো আয়ন সমাধানত থাকে — এইটো দ্বৈত প্ৰতিস্থাপন কিন্তু অৱক্ষেপ নোহোৱাকৈ। দ্ৰৱণীয়তা নিয়মৰ বুজাবুজি পৰীক্ষা কৰে।" },
    safety: { en: ["Barium compounds are toxic", "Wear gloves", "Avoid ingestion", "Dispose of properly"], as: ["বেৰিয়াম যৌগ বিষাক্ত", "দস্তানা পিন্ধক", "গিলিব নলাগে", "সঠিকভাৱে নিষ্পত্তি কৰক"] },
    steps: [
      { label: { en: "Prepare Solutions", as: "সমাধান প্ৰস্তুত কৰক" }, desc: { en: "Take colourless KBr solution. Observe barium iodide — it may be slightly yellow due to I⁻ ions.", as: "বৰ্ণহীন KBr সমাধান লওক। বেৰিয়াম আইডাইড লক্ষ্য কৰক — I⁻ আয়নৰ বাবে ই অলপ হালধীয়া হ’ব পাৰে।" } },
      { label: { en: "Mix the Solutions", as: "সমাধান মিহলাওক" }, desc: { en: "Add KBr solution to BaI₂. Ion exchange occurs: K⁺ pairs with I⁻ and Ba²⁺ pairs with Br⁻.", as: "BaI₂-ত KBr সমাধান যোগ কৰক। আয়ন বিনিময় হয়: K⁺ I⁻-ৰ সৈতে আৰু Ba²⁺ Br⁻-ৰ সৈতে যুটি বান্ধে।" } },
      { label: { en: "Observe — No Change!", as: "লক্ষ্য কৰক — কোনো পৰিবৰ্তন নাই!" }, desc: { en: "Surprisingly, NO precipitate forms. The solution remains clear. Both products (KI and BaBr₂) are soluble.", as: "আশ্চৰ্যজনকভাৱে, কোনো অৱক্ষেপ গঠিত নহয়। সমাধান স্বচ্ছ থাকে। দুয়োটা উৎপাদ (KI আৰু BaBr₂) দ্ৰৱণীয়।" } },
      { label: { en: "Understand Solubility", as: "দ্ৰৱণীয়তা বুজক" }, desc: { en: "All ions remain dissolved. This demonstrates that double displacement does NOT always give a precipitate.", as: "সকলো আয়ন দ্ৰৱীভূত থাকে। এইটোৱে প্ৰদৰ্শন কৰে যে দ্বৈত প্ৰতিস্থাপনত সদায় অৱক্ষেপ নিদিয়ে।" } },
    ],
    observations: { en: ["No visible precipitate forms", "Solution remains clear throughout", "No colour change (both products soluble)", "This proves: double displacement ≠ always precipitation"], as: ["কোনো দৃশ্যমান অৱক্ষেপ গঠিত নহয়", "সমাধান সম্পূৰ্ণভাৱে স্বচ্ছ থাকে", "কোনো ৰং পৰিবৰ্তন নাই (দুয়োটা উৎপাদ দ্ৰৱণীয়)", "ইয়াৰ দ্বাৰা প্ৰমাণিত হয়: দ্বৈত প্ৰতিস্থাপন ≠ সদায় অৱক্ষেপণ"] },
    pmode: "mix-ions",
    spectatorIons: { en: "All ions remain in solution", as: "সকলো আয়ন সমাধানত থাকে" },
    quiz: [
      { q: { en: "Does a precipitate form when KBr reacts with BaI₂?", as: "KBr-এ BaI₂-ৰ সৈতে বিক্ৰিয়া কৰিলে অৱক্ষেপ গঠিত হয় নে?" }, opts: { en: ["Yes, white precipitate", "Yes, yellow precipitate", "No precipitate forms", "Yes, colourless precipitate"], as: ["হয়, বগা অৱক্ষেপ", "হয়, হালধীয়া অৱক্ষেপ", "কোনো অৱক্ষেপ গঠিত নহয়", "হয়, বৰ্ণহীন অৱক্ষেপ"] }, ans: 2 },
      { q: { en: "Why is no precipitate formed?", as: "কিয় কোনো অৱক্ষেপ গঠিত নহয়?" }, opts: { en: ["Reaction does not occur", "Both products (KI and BaBr₂) are soluble", "Temperature is too low", "Concentration is too low"], as: ["বিক্ৰিয়া নহয়", "দুয়োটা উৎপাদ (KI আৰু BaBr₂) দ্ৰৱণীয়", "উষ্ণতা বৰ কম", "ঘনত্ব বৰ কম"] }, ans: 1 },
      { q: { en: "The products KI and BaBr₂ are:", as: "উৎপাদ KI আৰু BaBr₂:" }, opts: { en: ["Both insoluble", "KI insoluble, BaBr₂ soluble", "Both soluble in water", "BaBr₂ insoluble"], as: ["দুয়োটা অদ্ৰৱণীয়", "KI অদ্ৰৱণীয়, BaBr₂ দ্ৰৱণীয়", "দুয়োটা পানীত দ্ৰৱণীয়", "BaBr₂ অদ্ৰৱণীয়"] }, ans: 2 },
      { q: { en: "What determines whether precipitation occurs in a double displacement reaction?", as: "দ্বৈত প্ৰতিস্থাপন বিক্ৰিয়াত অৱক্ষেপণ হ’ব নে নহয় সেইটো কিহে নিৰ্ধাৰণ কৰে?" }, opts: { en: ["Temperature", "Concentration", "Solubility of products", "Colour of reactants"], as: ["উষ্ণতা", "ঘনত্ব", "উৎপাদৰ দ্ৰৱণীয়তা", "বিক্ৰিয়াকাৰকৰ ৰং"] }, ans: 2 },
      { q: { en: "In this reaction, which statement is TRUE?", as: "এই বিক্ৰিয়াত কোন বক্তব্য সঁচা?" }, opts: { en: ["All ions form new lattices", "No ions are exchanged", "Ions exchange but all products are soluble", "KI precipitates out"], as: ["সকলো আয়নে নতুন জালিকা গঠন কৰে", "কোনো আয়ন বিনিময় নহয়", "আয়ন বিনিময় হয় কিন্তু সকলো উৎপাদ দ্ৰৱণীয়", "KI অৱক্ষেপিত হয়"] }, ans: 2 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// PARTICLE ENGINE
// ═══════════════════════════════════════════════════════════

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, mode: PMode, intensity = 1.0) {
  const particles = useRef<Particle[]>([]);
  const settled = useRef<{ x: number; y: number; size: number; color: string }[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode === "none") { particles.current = []; settled.current = []; return; }
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const cx = W / 2;
    const baseY = H * 0.55;
    const floorY = H * 0.82;

    const pptColor = mode === "ppt-yellow" ? "#FDE047"
      : mode === "ppt-curdy" ? "#E2E8F0"
        : "#F8FAFC";

    const ionColors = ["#60A5FA", "#34D399", "#A78BFA", "#FB923C", "#F472B6"];

    const spawn = () => {
      const add = (p: Omit<Particle, "life"> & { life?: number }) =>
        particles.current.push({ life: p.maxLife, ...p });

      switch (mode) {
        case "ppt-white":
        case "ppt-yellow":
        case "ppt-curdy": {
          // Precipitate cloud bursting from mixing zone
          for (let i = 0; i < Math.ceil(4 * intensity); i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 10 + Math.random() * 40;
            const life = 60 + Math.random() * 50;
            add({ x: cx + Math.cos(angle) * r, y: baseY + Math.sin(angle) * 20, vx: (Math.random() - .5) * 1.5, vy: (Math.random() - .5) * 1.5, maxLife: life, size: 4 + Math.random() * 8, color: pptColor, blur: mode === "ppt-curdy" ? 3 : 6, type: "cloud" });
          }
          // Settling particles
          if (Math.random() < 0.5 * intensity) {
            const x = cx + (Math.random() - .5) * 80;
            add({ x, y: baseY + Math.random() * 40, vx: (Math.random() - .5) * 0.5, vy: 0.4 + Math.random() * 0.8, maxLife: 120 + Math.random() * 80, size: 2 + Math.random() * 3, color: pptColor, blur: 4, type: "settle" });
          }
          // Crystal sparkle for yellow
          if (mode === "ppt-yellow" && Math.random() < 0.25 * intensity) {
            add({ x: cx + (Math.random() - .5) * 60, y: baseY + Math.random() * 50, vx: (Math.random() - .5) * 1, vy: (Math.random() - .5) * 1, maxLife: 20 + Math.random() * 15, size: 2, color: "#FEF08A", blur: 14, type: "crystal" });
          }
          break;
        }
        case "mix-ions": {
          // Gentle ion mixing — no precipitate
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const col = ionColors[Math.floor(Math.random() * ionColors.length)];
            add({ x: cx + (Math.random() - .5) * 100, y: baseY + (Math.random() - .5) * 60, vx: (Math.random() - .5) * 1.5, vy: (Math.random() - .5) * 1.5, maxLife: 90 + Math.random() * 60, size: 2 + Math.random() * 2.5, color: col, blur: 8, type: "ion" });
          }
          break;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      spawn();

      // Draw settled layer at bottom
      settled.current.forEach(s => {
        ctx.save();
        ctx.globalAlpha = 0.65;
        ctx.shadowBlur = 4;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        const t = p.life / p.maxLife;

        // When settle particles reach floor, add to settled
        if (p.type === "settle" && p.y >= floorY - p.size) {
          if (settled.current.length < 180) {
            settled.current.push({ x: p.x + (Math.random() - .5) * 6, y: floorY - p.size * 0.5, size: p.size * 0.9, color: p.color });
          }
          p.life = 0;
          return;
        }

        let alpha = t;
        if (p.type === "cloud") alpha = Math.sin(t * Math.PI) * 0.6;
        if (p.type === "ion") alpha = Math.sin(t * Math.PI) * 0.8;
        if (p.type === "crystal") alpha = t < 0.3 ? t / 0.3 : t;
        if (p.type === "settle") alpha = 0.7;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowBlur = p.blur;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const r = p.type === "cloud" ? p.size * (1 + (1 - t) * 0.6) : p.size;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.vx; p.y += p.vy;
        if (p.type === "cloud") { p.vx *= 0.96; p.vy *= 0.96; }
        if (p.type === "ion") { p.vx += (Math.random() - .5) * 0.2; p.vy += (Math.random() - .5) * 0.2; p.vx *= 0.98; p.vy *= 0.98; }
        if (p.type === "settle") { p.vy += 0.04; p.vx *= 0.97; }
        p.life--;
      });

      frame.current = requestAnimationFrame(draw);
    };

    settled.current = [];
    draw();
    return () => { cancelAnimationFrame(frame.current); particles.current = []; settled.current = []; };
  }, [mode, intensity, canvasRef]);
}

// ═══════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════

function GlassPanel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.08)", ...style }}>
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
function AnimBar({ label, target, accent, icon }: { label: string; target: number; accent: string; icon: React.ReactNode }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let cur = 0; const step = target / 55;
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
        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 2.2, ease: "easeOut" }} style={{ background: `linear-gradient(to right, ${accent}88, ${accent})` }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MIXING APPARATUS SVG
// ═══════════════════════════════════════════════════════════

function MixingApparatus({ exp, phase }: { exp: Exp; phase: Phase }) {
  const mixing = phase === "reacting" || phase === "complete";
  const settled = phase === "complete";
  const pptLayerH = settled ? 22 : mixing ? 10 : 0;
  const sol1Dropped = phase !== "idle";
  const sol2Dropped = phase === "step2" || phase === "reacting" || phase === "complete";

  return (
    <svg viewBox="0 0 300 230" className="w-full h-full">
      <rect x="20" y="215" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />

      {/* Main beaker */}
      <path d="M80,65 L70,198 Q70,208 84,208 L216,208 Q230,208 230,198 L220,65 Z"
        fill="rgba(255,255,255,0.03)" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Graduated markings */}
      {[130, 155, 175].map((y, i) => (
        <g key={i}>
          <line x1="77" y1={y} x2="88" y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <text x="91" y={y + 4} fill="rgba(255,255,255,0.18)" fontSize="7">{(3 - i) * 30}mL</text>
        </g>
      ))}

      {/* Solution 1 (bottom) */}
      {sol1Dropped && (
        <path d="M74,140 L72,196 Q72,205 84,205 L216,205 Q228,205 228,196 L226,140 Z"
          fill={exp.sol1.color}>
          <animate attributeName="d" from="M74,198 L72,198 Q72,205 84,205 L216,205 Q228,205 228,198 L226,198 Z"
            to="M74,140 L72,196 Q72,205 84,205 L216,205 Q228,205 228,196 L226,140 Z" dur="1s" fill="freeze" />
        </path>
      )}

      {/* Solution 2 added on top */}
      {sol2Dropped && (
        <path d="M76,95 L74,140 L226,140 L224,95 Z" fill={exp.sol2.color} opacity="0.6">
          <animate attributeName="d" from="M76,140 L74,140 L226,140 L224,140 Z"
            to="M76,95 L74,140 L226,140 L224,95 Z" dur="1.2s" fill="freeze" />
        </path>
      )}

      {/* Mixed zone — turbulence effect */}
      {mixing && exp.hasPpt && (
        <path d="M75,93 L73,200 Q73,207 86,207 L214,207 Q227,207 227,200 L225,93 Z"
          fill={`${exp.pptColor}18`}>
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </path>
      )}

      {/* Precipitate layer at bottom */}
      {exp.hasPpt && pptLayerH > 0 && (
        <path d={`M73,${208 - pptLayerH} L72,205 Q72,208 84,208 L216,208 Q228,208 228,205 L227,${208 - pptLayerH} Z`}
          fill={exp.pptColor} opacity="0.75">
          <animate attributeName="d" from={`M73,207 L72,205 Q72,208 84,208 L216,208 Q228,208 228,205 L227,207 Z`}
            to={`M73,${208 - pptLayerH} L72,205 Q72,208 84,208 L216,208 Q228,208 228,205 L227,${208 - pptLayerH} Z`}
            dur="3s" fill="freeze" />
        </path>
      )}

      {/* No precipitate indicator */}
      {!exp.hasPpt && mixing && (
        <text x="150" y="160" textAnchor="middle" fill="#34D399" fontSize="8" fontFamily="monospace">No precipitate — all soluble</text>
      )}

      {/* Dropper 1 (left) */}
      <rect x="95" y="20" width="14" height="36" rx="4" fill="#1e293b" stroke={sol1Dropped ? exp.accent : "#475569"} strokeWidth="1.5" />
      <path d="M102,56 L98,72 L106,72 Z" fill={exp.sol1.color !== "rgba(248,250,252,0.15)" ? exp.sol1.color : "#64748b"} opacity="0.7" />
      <text x="102" y="16" textAnchor="middle" fill="#64748b" fontSize="7">{exp.sol1.label}</text>
      {sol1Dropped && (
        <>
          <circle cx="102" cy="78" r="3" fill={exp.sol1.color !== "rgba(248,250,252,0.15)" ? exp.sol1.color : "#94a3b8"} opacity="0.7">
            <animate attributeName="cy" from="78" to="140" dur="0.6s" fill="freeze" />
          </circle>
        </>
      )}

      {/* Dropper 2 (right) */}
      <rect x="191" y="20" width="14" height="36" rx="4" fill="#1e293b" stroke={sol2Dropped ? exp.accent : "#475569"} strokeWidth="1.5" />
      <path d="M198,56 L194,72 L202,72 Z" fill={exp.sol2.color !== "rgba(248,250,252,0.12)" ? exp.sol2.color : "#64748b"} opacity="0.7" />
      <text x="198" y="16" textAnchor="middle" fill="#64748b" fontSize="7">{exp.sol2.label}</text>
      {sol2Dropped && (
        <>
          <circle cx="198" cy="78" r="3" fill={exp.sol2.color !== "rgba(248,250,252,0.12)" ? exp.sol2.color : "#94a3b8"} opacity="0.7">
            <animate attributeName="cy" from="78" to="140" dur="0.8s" fill="freeze" />
          </circle>
        </>
      )}

      {/* Stirring rod */}
      {mixing && (
        <g opacity="0.6">
          <line x1="148" y1="60" x2="152" y2="190" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="150" cy="190" rx="8" ry="3" fill="none" stroke="#94a3b8" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="rotate" from="0 150 190" to="360 150 190" dur="1s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Status label */}
      <text x="150" y="226" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">
        {settled && exp.hasPpt ? `↓ ${exp.pptName.en} ↓` : mixing && !exp.hasPpt ? "ION EXCHANGE — NO PRECIPITATE" : "MIXING BEAKER"}
      </text>

      {/* Phase indicator */}
      <circle cx="270" cy="72" r="5" fill={phase === "complete" ? "#34D399" : phase === "reacting" ? exp.accent : "#334155"}>
        {phase === "reacting" && <animate attributeName="opacity" values="1;0.3;1" dur="0.7s" repeatCount="indefinite" />}
      </circle>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// MOLECULAR PANEL
// ═══════════════════════════════════════════════════════════

function MolecularPanel({ exp, phase }: { exp: Exp; phase: Phase }) {
  const showAfter = phase === "complete";

  const ionPairs: Record<ExpId, { before: { sym: string; col: string; x: number; y: number; ppt?: boolean }[]; after: { sym: string; col: string; x: number; y: number; ppt?: boolean }[] }> = {
    "na2so4-bacl2": {
      before: [
        { sym: "Na⁺", col: "#FDE047", x: 45, y: 40 }, { sym: "Na⁺", col: "#FDE047", x: 45, y: 65 },
        { sym: "SO₄²⁻", col: "#38BDF8", x: 110, y: 50 },
        { sym: "Ba²⁺", col: "#F59E0B", x: 185, y: 50 },
        { sym: "Cl⁻", col: "#4ADE80", x: 240, y: 40 }, { sym: "Cl⁻", col: "#4ADE80", x: 240, y: 65 },
      ],
      after: [
        { sym: "Na⁺", col: "#FDE047", x: 40, y: 45 }, { sym: "Na⁺", col: "#FDE047", x: 40, y: 68 },
        { sym: "Cl⁻", col: "#4ADE80", x: 235, y: 45 }, { sym: "Cl⁻", col: "#4ADE80", x: 235, y: 68 },
        { sym: "BaSO₄", col: "#F8FAFC", x: 145, y: 50, ppt: true },
      ],
    },
    "agno3-hcl": {
      before: [
        { sym: "Ag⁺", col: "#E2E8F0", x: 55, y: 50 }, { sym: "NO₃⁻", col: "#A78BFA", x: 120, y: 50 },
        { sym: "H⁺", col: "#38BDF8", x: 185, y: 50 }, { sym: "Cl⁻", col: "#4ADE80", x: 240, y: 50 },
      ],
      after: [
        { sym: "H⁺", col: "#38BDF8", x: 50, y: 50 }, { sym: "NO₃⁻", col: "#A78BFA", x: 235, y: 50 },
        { sym: "AgCl↓", col: "#E2E8F0", x: 145, y: 50, ppt: true },
      ],
    },
    "pbno3-ki": {
      before: [
        { sym: "Pb²⁺", col: "#6B7280", x: 55, y: 50 }, { sym: "NO₃⁻", col: "#A78BFA", x: 105, y: 40 }, { sym: "NO₃⁻", col: "#A78BFA", x: 105, y: 65 },
        { sym: "K⁺", col: "#FDE047", x: 185, y: 40 }, { sym: "K⁺", col: "#FDE047", x: 185, y: 65 }, { sym: "I⁻", col: "#F59E0B", x: 235, y: 50 },
      ],
      after: [
        { sym: "K⁺", col: "#FDE047", x: 40, y: 42 }, { sym: "K⁺", col: "#FDE047", x: 40, y: 62 },
        { sym: "NO₃⁻", col: "#A78BFA", x: 230, y: 42 }, { sym: "NO₃⁻", col: "#A78BFA", x: 230, y: 62 },
        { sym: "PbI₂↓", col: "#FDE047", x: 145, y: 50, ppt: true },
      ],
    },
    "bacl2-al2so4": {
      before: [
        { sym: "Ba²⁺", col: "#F59E0B", x: 50, y: 50 }, { sym: "Cl⁻", col: "#4ADE80", x: 90, y: 40 }, { sym: "Cl⁻", col: "#4ADE80", x: 90, y: 62 },
        { sym: "Al³⁺", col: "#38BDF8", x: 185, y: 50 }, { sym: "SO₄²⁻", col: "#60A5FA", x: 235, y: 50 },
      ],
      after: [
        { sym: "Al³⁺", col: "#38BDF8", x: 45, y: 50 }, { sym: "Cl⁻", col: "#4ADE80", x: 235, y: 50 },
        { sym: "BaSO₄↓", col: "#F8FAFC", x: 145, y: 50, ppt: true },
      ],
    },
    "kbr-bai2": {
      before: [
        { sym: "K⁺", col: "#FDE047", x: 50, y: 42 }, { sym: "Br⁻", col: "#FB923C", x: 95, y: 50 },
        { sym: "Ba²⁺", col: "#F59E0B", x: 185, y: 50 }, { sym: "I⁻", col: "#A78BFA", x: 235, y: 50 },
      ],
      after: [
        { sym: "K⁺", col: "#FDE047", x: 40, y: 42 }, { sym: "I⁻", col: "#A78BFA", x: 95, y: 50 },
        { sym: "Ba²⁺", col: "#F59E0B", x: 185, y: 50 }, { sym: "Br⁻", col: "#FB923C", x: 235, y: 50 },
      ],
    },
  };

  const cfg = ionPairs[exp.id];
  const items = showAfter ? cfg.after : cfg.before;
  const { lang } = useLanguage();
  const isAs = lang === "as";

  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "আয়ন বিনিময় দৃশ্য" : "Ion Exchange View"}</span>
        <span className="text-[10px] font-black" style={{ color: exp.accent }}>{showAfter ? (isAs ? "মিহলোৱাৰ পিছত" : "After Mixing") : (isAs ? "মিহলোৱাৰ পূৰ্বে" : "Before Mixing")}</span>
      </div>
      <svg viewBox="0 0 290 100" className="w-full" style={{ height: 85 }}>
        <defs>
          <filter id="dg"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <AnimatePresence mode="wait">
          <motion.g key={showAfter ? "after" : "before"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {items.map((ion, i) => (
              <g key={i}>
                <circle cx={ion.x} cy={ion.y} r={ion.ppt ? 18 : 13} fill={ion.col} filter="url(#dg)" opacity={ion.ppt ? 1 : 0.85} />
                <text x={ion.x} y={ion.y + 4} textAnchor="middle" fill={ion.ppt && ion.col === "#F8FAFC" ? "#1e293b" : "white"} fontSize={ion.ppt ? 8 : 7} fontWeight="bold">{ion.sym}</text>
                {ion.ppt && (
                  <text x={ion.x} y={ion.y + 28} textAnchor="middle" fill={ion.col} fontSize={7} opacity="0.8">{isAs ? "অৱক্ষেপ ↓" : "precipitate ↓"}</text>
                )}
              </g>
            ))}
            {/* Arrows showing ion exchange for before state */}
            {!showAfter && phase === "reacting" && (
              <g>
                <path d="M145,20 Q145,10 145,5" fill="none" stroke="#FDE047" strokeWidth="1.5" markerEnd="url(#arr)">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="0.8s" repeatCount="indefinite" />
                </path>
                <text x="145" y="3" textAnchor="middle" fill="#FDE047" fontSize="7">{isAs ? "⚡ বিনিময়" : "⚡ exchanging"}</text>
              </g>
            )}
          </motion.g>
        </AnimatePresence>
        {!showAfter && !exp.hasPpt && (
          <text x="145" y="88" textAnchor="middle" fill="#34D399" fontSize="8">{isAs ? "সকলো আয়ন দ্ৰৱীভূত — অৱক্ষেপ নাই" : "All ions remain dissolved — no precipitate"}</text>
        )}
      </svg>
      {/* Net ionic equation */}
      <div className="mt-2 rounded-lg px-2.5 py-1.5 text-center font-mono text-[10px] border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>
        {exp.netIonic}
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// SOLUBILITY PANEL
// ═══════════════════════════════════════════════════════════

const SOLUBILITY_RULES = [
  { salt: "BaSO₄", soluble: false, color: "#F8FAFC" },
  { salt: "AgCl", soluble: false, color: "#E2E8F0" },
  { salt: "PbI₂", soluble: false, color: "#FDE047" },
  { salt: "KI", soluble: true, color: "#34D399" },
  { salt: "BaBr₂", soluble: true, color: "#60A5FA" },
  { salt: "NaCl", soluble: true, color: "#34D399" },
  { salt: "AlCl₃", soluble: true, color: "#34D399" },
  { salt: "KNO₃", soluble: true, color: "#34D399" },
];

function SolubilityPanel({ exp }: { exp: Exp }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <GlassPanel className="p-3">
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "দ্ৰৱণীয়তা সন্দৰ্ভ" : "Solubility Reference"}</p>
      <div className="grid grid-cols-2 gap-1">
        {SOLUBILITY_RULES.map(({ salt, soluble, color }) => {
          const isProduct = exp.equation.includes(salt.replace("↓", "")) || (salt === exp.pptName.en.split(" ")[0]);
          return (
            <div key={salt} className="flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all"
              style={{ borderColor: isProduct ? `${color}60` : "rgba(255,255,255,0.06)", background: isProduct ? `${color}12` : "rgba(255,255,255,0.02)" }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: soluble ? "#34D399" : "#EF4444" }} />
              <span className="text-[9px] font-black" style={{ color: isProduct ? color : "#64748b" }}>{salt}</span>
              <span className="text-[8px] ml-auto" style={{ color: soluble ? "#34D399" : "#EF4444" }}>{soluble ? (isAs ? "দ্ৰৱ." : "Sol.") : (isAs ? "অদ্ৰৱ." : "Insol.")}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-slate-600 mt-2">{isAs ? "🟢 দ্ৰৱণীয় — সমাধানত থাকে | 🔴 অদ্ৰৱণীয় — অৱক্ষেপিত হয়" : "🟢 Soluble — stays in solution | 🔴 Insoluble — precipitates out"}</p>
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
        {exp.quiz.map((q, qi) => (
          <div key={qi}>
            <p className="text-xs font-semibold text-slate-300 mb-2">{qi + 1}. {pickLang(q.q, lang)}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {pickLang(q.opts, lang).map((opt, oi) => {
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
        ))}
      </div>
      {!submitted ? (
        <button onClick={() => { const correct = answers.filter((a, i) => a === exp.quiz[i].ans).length; recordQuizResult({ score: Math.round((correct / exp.quiz.length) * 100), totalCorrect: correct, totalAttempted: exp.quiz.length }); setSubmitted(true); }} disabled={answers.some(a => a === null)}
          className="mt-4 w-full py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>{isAs ? "উত্তৰ জমা দিয়ক" : "Submit Answers"}</button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
          <div className="text-2xl mb-1">{score === exp.quiz.length ? "🎉" : "📚"}</div>
          <p className="text-xs font-black" style={{ color: exp.accent }}>{score === exp.quiz.length ? (isAs ? "শাবাশ! পৰীক্ষাৰ বাবে সাজু!" : "Perfect! Exam ready!") : `${score}/${exp.quiz.length} — ${isAs ? "অভ্যাস কৰি থাকক" : "Keep practising"}`}</p>
          <button onClick={() => { setAnswers(exp.quiz.map(() => null)); setSubmitted(false); }} className="mt-2 text-[10px] text-slate-400 underline">{isAs ? "পুনৰ কুইজ দিয়ক" : "Retry Quiz"}</button>
        </motion.div>
      )}
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPERIMENT ROOM
// ═══════════════════════════════════════════════════════════

function ExperimentRoom({ exp, onBack }: { exp: Exp; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const expTitle = pickLang(exp.title, lang);
  const expPptName = pickLang(exp.pptName, lang);
  const expSpectatorIons = pickLang(exp.spectatorIons, lang);
  const expSafety = pickLang(exp.safety, lang);
  const expObservations = pickLang(exp.observations, lang);
  const expExamNote = pickLang(exp.examNote, lang);
  const expRealWorld = pickLang(exp.realWorld, lang);

  const pIntensity = phase === "reacting" ? 1 : phase === "complete" ? 0.15 : 0;
  useParticles(canvasRef, phase === "idle" ? "none" : exp.pmode, pIntensity);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const obs = new ResizeObserver(() => { c.width = c.offsetWidth; c.height = c.offsetHeight; });
    obs.observe(c); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!showQuiz) return;
    const id = setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
    return () => clearTimeout(id);
  }, [showQuiz]);

  const nextStep = () => {
    if (stepIdx < exp.steps.length - 1) {
      const nxt = stepIdx + 1;
      setStepIdx(nxt);
      setPhase(nxt >= 2 ? "reacting" : `step${nxt + 1}` as Phase);
    } else { setPhase("complete"); setShowQuiz(true); }
  };
  const reset = () => { setPhase("idle"); setStepIdx(0); setShowQuiz(false); };

  const rxnPct = phase === "complete" ? 100 : phase === "reacting" ? 65 : 0;
  const pptPct = exp.hasPpt ? rxnPct : 0;

  const typeLabel = exp.hasPpt ? (isAs ? "অৱক্ষেপণ" : "Precipitation") : (isAs ? "আয়ন বিনিময় (অৱক্ষেপ নাই)" : "Ion Exchange (no ppt)");

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
          <NeonBadge label={typeLabel} color={exp.hasPpt ? exp.accent : "#34D399"} />
        </div>
        <LanguageToggle />
        <button onClick={() => setShowSafety(s => !s)} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><Shield className="w-4 h-4 text-slate-400" /></button>
        <button onClick={reset} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><RotateCcw className="w-4 h-4 text-slate-400" /></button>
      </div>

      <AnimatePresence>
        {showSafety && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 p-3 rounded-xl border shrink-0"
            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-black text-red-300">{isAs ? "সুৰক্ষা" : "Safety"}</span>
              <button onClick={() => setShowSafety(false)} className="ml-auto text-slate-500">✕</button>
            </div>
            {expSafety.map((s, i) => <p key={i} className="text-xs text-red-200 mb-0.5">• {s}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 240 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="absolute inset-0 p-3">
              <MixingApparatus exp={exp} phase={phase} />
            </div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen" }} />
            <div className="absolute top-2 right-2">
              <NeonBadge label={phase === "idle" ? (isAs ? "সাজু" : "READY") : phase === "reacting" ? (isAs ? "মিহলোৱা" : "MIXING") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "COMPLETE") : `${isAs ? "পদক্ষেপ" : "STEP"} ${stepIdx + 1}`}
                color={phase === "reacting" ? exp.accent : phase === "complete" ? "#34D399" : "#60A5FA"} />
            </div>
            {/* Precipitate indicator bottom */}
            {exp.hasPpt && (phase === "reacting" || phase === "complete") && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: exp.pptColor }} />
                <span className="text-[9px] font-black" style={{ color: exp.pptColor }}>{expPptName}</span>
              </div>
            )}
          </GlassPanel>

          {/* Step controls */}
          <GlassPanel className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {phase === "complete" ? (isAs ? "✅ সম্পূৰ্ণ" : "✅ Complete") : `${isAs ? "পদক্ষেপ" : "Step"} ${stepIdx + 1}/${exp.steps.length}`}
              </span>
              <div className="flex gap-1">
                {exp.steps.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= stepIdx && phase !== "idle" ? exp.accent : "rgba(255,255,255,0.15)" }} />)}
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
                <Play className="w-4 h-4" />{phase === "idle" ? (isAs ? "পৰীক্ষা আৰম্ভ কৰক" : "Start Experiment") : stepIdx < exp.steps.length - 1 ? pickLang(exp.steps[stepIdx + 1].label, lang) : (isAs ? "সম্পূৰ্ণ কৰক" : "Complete")}
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

          <SolubilityPanel exp={exp} />
        </div>

        {/* Middle */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সন্তুলিত সমীকৰণ" : "Balanced Equation"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-sm border"
              style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>
              {exp.equation}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                [isAs ? "ধৰণ" : "Type", isAs ? "দ্বৈত প্ৰতিস্থাপন" : "Double Displacement"],
                [isAs ? "অৱক্ষেপ" : "Precipitate", exp.hasPpt ? exp.pptName.en.split(" ")[0] : (isAs ? "নাই" : "None")],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg py-2 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[8px] text-slate-600 mb-0.5">{l}</p>
                  <p className="text-[9px] font-black text-slate-300 leading-tight truncate" style={{ color: exp.hasPpt && (l === "Precipitate" || l === "অৱক্ষেপ") ? exp.pptColor : undefined }}>{v}</p>
                </div>
              ))}
              {[
                [isAs ? "দৰ্শক আয়ন" : "Spectator Ions", expSpectatorIons],
                [isAs ? "বিপদ" : "Hazard", exp.hazard],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg py-2 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[8px] text-slate-600 mb-0.5">{l}</p>
                  <p className="text-[9px] font-black text-slate-300 leading-tight">{v}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "জীৱন্ত তথ্য" : "Live Data"}</p>
            <div className="space-y-3">
              <AnimBar label={isAs ? "বিক্ৰিয়াৰ অগ্ৰগতি" : "Reaction Progress"} target={rxnPct} accent={exp.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimBar label={isAs ? "অৱক্ষেপ গঠিত" : "Precipitate Formed"} target={pptPct} accent={exp.hasPpt ? exp.pptColor : "#64748b"} icon={<Droplets className="w-3 h-3" />} />
              <AnimBar label={isAs ? "আয়ন বিনিময়" : "Ion Exchange"} target={rxnPct} accent="#A78BFA" icon={<Zap className="w-3 h-3" />} />
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "বিক্ৰিয়াৰ ধৰণ" : "Reaction Type"} value={isAs ? "দ্বৈত প্ৰতিস্থাপন" : "Double Displacement"} color={exp.accent} />
              <DataRow label={isAs ? "অৱক্ষেপণ" : "Precipitation"} value={exp.hasPpt ? (isAs ? "হয় ↓" : "YES ↓") : (isAs ? "নহয়" : "NO")} color={exp.hasPpt ? "#EF4444" : "#34D399"} />
              <DataRow label={isAs ? "অৱস্থা" : "State"} value={phase === "idle" ? (isAs ? "আৰম্ভ হোৱা নাই" : "Not started") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ ✓" : "Completed ✓") : (isAs ? "চলি আছে" : "In progress")} color={phase === "complete" ? "#34D399" : exp.accent} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-3 flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "পৰ্যবেক্ষণ লগ" : "Observation Log"}</p>
            <div className="space-y-1.5">
              {expObservations.map((obs, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: phase !== "idle" ? 1 : i === 0 ? 0.4 : 0.15, x: 0 }} transition={{ delay: i * 0.1 }}
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

        {/* Right */}
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
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{isAs ? "বাস্তৱ জগত" : "Real World"}</p>
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
  const [showPptOnly, setShowPptOnly] = useState<boolean | null>(null);
  const visible = showPptOnly === null ? EXPERIMENTS : EXPERIMENTS.filter(e => e.hasPpt === showPptOnly);
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const colourGuide: [string, string, string][] = isAs
    ? [
        ["BaSO₄", "বগা", "↓ SO₄²⁻ পৰীক্ষাৰ পৰা"],
        ["AgCl", "বগা পনীৰ-সদৃশ", "↓ Cl⁻ পৰীক্ষাৰ পৰা"],
        ["PbI₂", "উজ্জ্বল হালধীয়া", "↓ Pb²⁺ + I⁻ পৰা"],
        ["অৱক্ষেপ নাই", "স্বচ্ছ সমাধান", "সকলো উৎপাদ দ্ৰৱণীয়"],
      ]
    : [
        ["BaSO₄", "White", "↓ from SO₄²⁻ test"],
        ["AgCl", "White curdy", "↓ from Cl⁻ test"],
        ["PbI₂", "Bright yellow", "↓ from Pb²⁺ + I⁻"],
        ["No ppt", "Clear solution", "All products soluble"],
      ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #0D1117 60%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-15 animate-pulse"
            style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: ["#FDE047", "#F8FAFC", "#E2E8F0", "#34D399", "#60A5FA"][i % 5], animationDelay: `${Math.random() * 4}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 pb-28">
        <div className="flex items-center justify-between mb-6">
          <Link href="/virtual-lab/chemistry">
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" /> {isAs ? "ৰসায়ন লেব" : "Chemistry Lab"}
            </button>
          </Link>
          <LanguageToggle />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border text-xs font-black uppercase tracking-widest"
            style={{ borderColor: "rgba(253,224,71,0.3)", background: "rgba(253,224,71,0.08)", color: "#FDE047" }}>
            <FlaskConical className="w-3.5 h-3.5" /> {isAs ? "দ্বৈত প্ৰতিস্থাপন আৰু অৱক্ষেপণ · অধ্যায় ১" : "Double Displacement & Precipitation · Chapter 1"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "অৱক্ষেপণ" : "Precipitation"}<br />
            <span style={{ background: "linear-gradient(135deg, #FDE047, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{isAs ? "বিক্ৰিয়া লেব" : "Reactions Lab"}</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs ? "৫টা ক্ৰিয়াশীল দ্বৈত প্ৰতিস্থাপন পৰীক্ষা — আয়ন বিনিময় দৃশ্যায়ন, অৱক্ষেপ গঠনৰ পদাৰ্থ বিজ্ঞান, দ্ৰৱণীয়তা নিয়ম, আৰু CBSE-ধৰণৰ মূল্যায়ন।" : "5 interactive double displacement experiments — ion exchange visualization, precipitate formation physics, solubility rules, and CBSE-style assessment."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs
              ? [["৫", "পৰীক্ষা"], ["৪", "অৱক্ষেপ"], ["আয়ন", "বিনিময়"], ["CBSE", "সংযুক্ত"]]
              : [["5", "Experiments"], ["4", "Precipitates"], ["Ion", "Exchange"], ["CBSE", "Aligned"]]
            ).map(([v, l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 justify-center">
          {([null, true, false] as const).map((f, i) => (
            <button key={i} onClick={() => setShowPptOnly(f)}
              className="px-4 py-2 rounded-full text-xs font-black transition-all border"
              style={{ borderColor: showPptOnly === f ? "#FDE047" : "rgba(255,255,255,0.1)", background: showPptOnly === f ? "rgba(253,224,71,0.12)" : "transparent", color: showPptOnly === f ? "#FDE047" : "#64748b" }}>
              {f === null ? (isAs ? "🔬 সকলো" : "🔬 All") : f ? (isAs ? "⬇ অৱক্ষেপণ" : "⬇ Precipitation") : (isAs ? "🌊 অৱক্ষেপ নাই" : "🌊 No Precipitate")}
            </button>
          ))}
        </div>

        {/* Precipitate colour guide */}
        <div className="mb-8 p-4 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 text-center">{isAs ? "সাধাৰণ অৱক্ষেপ ৰং — CBSE সন্দৰ্ভ" : "Common Precipitate Colours — CBSE Reference"}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colourGuide.map(([salt, colour, note], idx) => (
              <div key={salt} className="rounded-xl p-3 text-center border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="text-lg mb-1">{idx <= 1 ? "⬜" : idx === 2 ? "🟡" : "💧"}</div>
                <p className="text-xs font-black text-white">{salt}</p>
                <p className="text-[9px]" style={{ color: idx === 2 ? "#FDE047" : "#94a3b8" }}>{colour}</p>
                <p className="text-[8px] text-slate-600 mt-0.5">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experiment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((exp, idx) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
              <button onClick={() => onSelect(exp)} className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${exp.hasPpt ? exp.pptColor : "#34D399"}50`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                <div className="h-1.5" style={{ background: `linear-gradient(to right, ${exp.gradFrom}, ${exp.gradTo})` }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-lg"
                        style={{ background: `${exp.pptColor !== "transparent" ? exp.pptColor : "#34D399"}18`, borderColor: `${exp.pptColor !== "transparent" ? exp.pptColor : "#34D399"}40` }}>
                        {exp.emoji}
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isAs ? "পৰীক্ষা" : "Exp."} {String(exp.num).padStart(2, "0")}</span>
                    </div>
                    <NeonBadge label={exp.hasPpt ? `↓ ${exp.pptName.en.split("(")[1]?.replace(")", "") ?? "ppt"}` : (isAs ? "অৱক্ষেপ নাই" : "No ppt")} color={exp.hasPpt ? exp.pptColor !== "transparent" ? exp.pptColor : "#F8FAFC" : "#34D399"} />
                  </div>

                  <h3 className="text-sm font-black text-white mb-0.5 leading-snug">{pickLang(exp.title, lang)}</h3>
                  <p className="text-[10px] font-semibold mb-3" style={{ color: exp.accent }}>{pickLang(exp.subtitle, lang)}</p>

                  <div className="font-mono text-[10px] font-black px-2 py-1.5 rounded-lg mb-3 border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>
                    {exp.equation}
                  </div>

                  {/* Solution colour preview */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-md border border-white/20" style={{ background: exp.sol1.color }} />
                      <span className="text-[9px] text-slate-600">+</span>
                      <div className="w-6 h-6 rounded-md border border-white/20" style={{ background: exp.sol2.color }} />
                    </div>
                    <span className="text-[9px] text-slate-600">→</span>
                    <div className="w-6 h-6 rounded-md border border-white/20 flex items-center justify-center text-[8px]"
                      style={{ background: exp.hasPpt ? `${exp.pptColor}60` : "rgba(52,211,153,0.2)" }}>
                      {exp.hasPpt ? "↓" : "∅"}
                    </div>
                    <span className="text-[9px] text-slate-500">{exp.hasPpt ? exp.pptName.en.split(" ")[0] : (isAs ? "দ্ৰৱণীয়" : "soluble")}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">{exp.hasPpt ? (isAs ? "অৱক্ষেপণ বিক্ৰিয়া" : "Precipitation reaction") : (isAs ? "কেৱল আয়ন বিনিময়" : "Ion exchange only")}</span>
                    <div className="flex items-center gap-1 text-xs font-black transition-transform group-hover:translate-x-1" style={{ color: exp.hasPpt ? exp.pptColor : "#34D399" }}>
                      {isAs ? "খোলক" : "Open"} <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════

export default function DoubleDisplacementLab() {
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
