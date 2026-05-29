/**
 * Ionic Dissociation & Neutralization Reactions Virtual Lab
 * 4 experiments: HCl dissociation, NaOH dissociation, HCl+NaOH, HNO₃+KOH
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";
import {
  ArrowLeft, Shield, RotateCcw, Play, Zap,
  FlaskConical, CheckCircle, Info, AlertTriangle, Activity, Droplets,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ExpId = "hcl-water" | "naoh-diss" | "hcl-naoh" | "hno3-koh";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "acid-ions" | "base-ions" | "neutralize" | "none";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; blur: number; type: string;
}

interface Ion { sym: string; charge: string; col: string; desc: BilingualField<string>; }

interface PhaseData { pH: number; indicator: BilingualField<string>; indicatorColor: string; }

interface Exp {
  id: ExpId; num: number;
  title: BilingualField<string>;
  subtitle: BilingualField<string>;
  equation: string; ionEquation: string;
  type: "dissociation" | "neutralization";
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  hazard: "LOW" | "MEDIUM" | "HIGH";
  description: BilingualField<string>;
  realWorld: BilingualField<string>;
  examNote: BilingualField<string>;
  safety: BilingualField<string[]>;
  steps: { label: BilingualField<string>; desc: BilingualField<string> }[];
  phaseData: Record<Phase, PhaseData>;
  ions: { reactants: Ion[]; products: Ion[] };
  observations: BilingualField<string[]>;
  pmode: PMode;
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
}

// ═══════════════════════════════════════════════════════════
// PH UTILITY
// ═══════════════════════════════════════════════════════════

function phToColor(pH: number): string {
  if (pH <= 1)  return "#DC2626";
  if (pH <= 2)  return "#EF4444";
  if (pH <= 3)  return "#F97316";
  if (pH <= 4)  return "#FB923C";
  if (pH <= 5)  return "#F59E0B";
  if (pH <= 6)  return "#EAB308";
  if (pH === 7) return "#22C55E";
  if (pH <= 8)  return "#10B981";
  if (pH <= 9)  return "#06B6D4";
  if (pH <= 10) return "#3B82F6";
  if (pH <= 11) return "#6366F1";
  if (pH <= 12) return "#8B5CF6";
  if (pH <= 13) return "#7C3AED";
  return "#6D28D9";
}

function phToLabel(pH: number, isAs = false): string {
  if (pH <= 2)  return isAs ? "প্ৰবল অম্লীয়" : "Strongly Acidic";
  if (pH <= 5)  return isAs ? "দুৰ্বল অম্লীয়" : "Weakly Acidic";
  if (pH === 7) return isAs ? "নিৰপেক্ষ" : "Neutral";
  if (pH <= 10) return isAs ? "দুৰ্বল ক্ষাৰীয়" : "Weakly Alkaline";
  return isAs ? "প্ৰবল ক্ষাৰীয়" : "Strongly Alkaline";
}

// ═══════════════════════════════════════════════════════════
// EXPERIMENT CONFIG
// ═══════════════════════════════════════════════════════════

const EXPERIMENTS: Exp[] = [
  {
    id: "hcl-water", num: 1,
    title: { en: "HCl Dissociation in Water", as: "পানীত HCl-ৰ বিযোজন" },
    subtitle: { en: "Strong Acid Ionisation", as: "প্ৰবল অম্লৰ আয়নীকৰণ" },
    equation: "HCl + H₂O → H₃O⁺ + Cl⁻",
    ionEquation: "HCl(aq) → H⁺ + Cl⁻",
    type: "dissociation",
    accent: "#EF4444", glow: "rgba(239,68,68,0.4)", gradFrom: "#DC2626", gradTo: "#F97316", emoji: "🔴",
    hazard: "MEDIUM",
    description: {
      en: "Hydrochloric acid is a strong acid that completely dissociates (ionises) in water. Every HCl molecule donates a proton to water, forming hydronium (H₃O⁺) and chloride (Cl⁻) ions. The solution becomes strongly acidic (pH ≈ 1) and conducts electricity.",
      as: "হাইড্ৰ’ক্ল’ৰিক এচিড এক প্ৰবল অম্ল, যি পানীত সম্পূৰ্ণভাৱে বিযোজিত (আয়নিত) হয়। প্ৰতিটো HCl অণুৱে পানীক এটা প্ৰট’ন দিয়ে, হাইড্ৰ’নিয়াম (H₃O⁺) আৰু ক্ল’ৰাইড (Cl⁻) আয়ন গঠন কৰে। সমাধান প্ৰবল অম্লীয় (pH ≈ 1) হয় আৰু বিদ্যুৎ পৰিবাহিতা কৰে।",
    },
    realWorld: {
      en: "Stomach acid (gastric acid) · Pickling steel · Swimming pool pH control · Industrial cleaning",
      as: "পাকস্থলীৰ এচিড (গেষ্ট্ৰিক এচিড) · ইস্পাত পিকলিং · ছুইমিং পুলৰ pH নিয়ন্ত্ৰণ · ঔদ্যোগিক চাফাই",
    },
    examNote: {
      en: "HCl is a STRONG ACID — 100% dissociation. H₃O⁺ causes acidic nature. Cl⁻ is spectator ion. Conductivity increases due to free ions. pH ≈ 1 for 0.1M HCl. CBSE: distinguish dissociation vs ionisation.",
      as: "HCl এক প্ৰবল অম্ল — ১০০% বিযোজন। H₃O⁺-এ অম্লীয় প্ৰকৃতি দিয়ে। Cl⁻ দৰ্শক আয়ন। মুক্ত আয়নৰ বাবে পৰিবাহিতা বাঢ়ে। 0.1M HCl-ৰ pH ≈ 1। CBSE: বিযোজন বনাম আয়নীকৰণ পাৰ্থক্য কৰক।",
    },
    safety: {
      en: ["Corrosive — wear gloves and goggles", "Releases HCl gas — work in fume hood", "Avoid skin contact", "Keep away from metals"],
      as: ["ক্ষয়কাৰক — দস্তানা আৰু চশমা পিন্ধক", "HCl গেছ নিৰ্গত — ফিউম হুডত কাম কৰক", "ছালৰ সংস্পৰ্শ এৰক", "ধাতুৰ পৰা আঁতৰত ৰাখক"],
    },
    steps: [
      { label: { en: "Fill Beaker with Water", as: "বিকাৰত পানী ভৰাওক" }, desc: { en: "Add 100 mL of distilled water into a clean glass beaker. Note initial pH = 7 (neutral, pure water).", as: "এক পৰিষ্কাৰ কাঁচৰ বিকাৰত 100 mL পাতিত পানী যোগ কৰক। প্ৰাৰম্ভিক pH = 7 লক্ষ্য কৰক (নিৰপেক্ষ, শুদ্ধ পানী)।" } },
      { label: { en: "Add HCl Drops", as: "HCl টোপাল যোগ কৰক" }, desc: { en: "Using a dropper, carefully add concentrated HCl solution drop by drop. Observe the solution turning pale yellow.", as: "এক ড্ৰপাৰ ব্যৱহাৰ কৰি, সাৱধানে ঘন HCl সমাধান টোপালে টোপালে যোগ কৰক। সমাধান পাতল হালধীয়া হোৱা লক্ষ্য কৰক।" } },
      { label: { en: "Observe Dissociation", as: "বিযোজন লক্ষ্য কৰক" }, desc: { en: "HCl molecules dissociate instantly. H₃O⁺ and Cl⁻ ions spread throughout the solution. pH drops rapidly.", as: "HCl অণুসমূহ তৎক্ষণাৎ বিযোজিত হয়। H₃O⁺ আৰু Cl⁻ আয়ন সমাধানজুৰি বিয়পি পৰে। pH দ্ৰুতভাৱে কমে।" } },
      { label: { en: "Measure & Confirm", as: "মাপ আৰু নিশ্চিত কৰক" }, desc: { en: "Dip pH meter — reading ≈ 1. Add universal indicator: turns bright red. Conductivity meter glows — many ions present.", as: "pH মিটাৰ ডুবাওক — পঠন ≈ 1। সাৰ্বজনীন সূচক যোগ কৰক: উজ্জ্বল ৰঙা হয়। পৰিবাহিতা মিটাৰ জ্বলে — বহু আয়ন আছে।" } },
    ],
    phaseData: {
      idle:     { pH: 7, indicator: { en: "Purple",     as: "বেঙুনীয়া" },        indicatorColor: "#8B5CF6" },
      step1:    { pH: 5, indicator: { en: "Orange-Red", as: "কমলা-ৰঙা" },        indicatorColor: "#F97316" },
      step2:    { pH: 2, indicator: { en: "Red",        as: "ৰঙা" },             indicatorColor: "#EF4444" },
      reacting: { pH: 1, indicator: { en: "Deep Red",   as: "ঘন ৰঙা" },          indicatorColor: "#B91C1C" },
      complete: { pH: 1, indicator: { en: "Deep Red",   as: "ঘন ৰঙা" },          indicatorColor: "#B91C1C" },
    },
    ions: {
      reactants: [{ sym: "HCl", charge: "", col: "#FCA5A5", desc: { en: "Hydrochloric acid molecule", as: "হাইড্ৰ’ক্ল’ৰিক এচিড অণু" } }],
      products: [
        { sym: "H₃O⁺", charge: "+", col: "#F97316", desc: { en: "Hydronium ion (causes acidity)", as: "হাইড্ৰ’নিয়াম আয়ন (অম্লতাৰ কাৰণ)" } },
        { sym: "Cl⁻",  charge: "−", col: "#67E8F9", desc: { en: "Chloride ion (spectator)", as: "ক্ল’ৰাইড আয়ন (দৰ্শক)" } },
      ],
    },
    observations: {
      en: [
        "Solution turns pale colourless/yellow on HCl addition",
        "pH drops sharply from 7 to ~1",
        "Universal indicator turns deep red",
        "Conductivity increases significantly",
        "Litmus turns red — confirms acidic nature",
        "Solution feels slightly warm (exothermic)",
      ],
      as: [
        "HCl যোগ কৰিলে সমাধান পাতল বৰ্ণহীন/হালধীয়া হয়",
        "pH 7-ৰ পৰা ~1 লৈ তীব্ৰভাৱে কমে",
        "সাৰ্বজনীন সূচক ঘন ৰঙা হয়",
        "পৰিবাহিতা যথেষ্ট বাঢ়ে",
        "লিটমাছ ৰঙা হয় — অম্লীয় প্ৰকৃতি নিশ্চিত",
        "সমাধান অলপ গৰম অনুভৱ হয় (তাপমোচী)",
      ],
    },
    pmode: "acid-ions",
    quiz: [
      { q: { en: "Which ion is responsible for the acidic nature of HCl solution?", as: "HCl সমাধানৰ অম্লীয় প্ৰকৃতিৰ বাবে কোন আয়ন দায়ী?" }, opts: { en: ["Cl⁻", "H₃O⁺", "OH⁻", "Na⁺"], as: ["Cl⁻", "H₃O⁺", "OH⁻", "Na⁺"] }, ans: 1 },
      { q: { en: "What is formed when HCl dissolves in water?", as: "HCl পানীত দ্ৰৱীভূত হ’লে কি গঠিত হয়?" }, opts: { en: ["NaCl + H₂O", "H₃O⁺ + Cl⁻", "OH⁻ + H₂", "HClO + H₂"], as: ["NaCl + H₂O", "H₃O⁺ + Cl⁻", "OH⁻ + H₂", "HClO + H₂"] }, ans: 1 },
      { q: { en: "Why does conductivity increase when HCl dissolves in water?", as: "HCl পানীত দ্ৰৱীভূত হ’লে পৰিবাহিতা কিয় বাঢ়ে?" }, opts: { en: ["HCl is a gas", "Free ions are formed", "Water heats up", "pH decreases"], as: ["HCl এটা গেছ", "মুক্ত আয়ন গঠিত হয়", "পানী গৰম হয়", "pH কমে"] }, ans: 1 },
      { q: { en: "HCl is called a strong acid because:", as: "HCl-ক প্ৰবল অম্ল কোৱাৰ কাৰণ:" }, opts: { en: ["It has high density", "It reacts with metals", "It completely dissociates in water", "It is corrosive"], as: ["ইয়াৰ উচ্চ ঘনত্ব আছে", "ই ধাতুৰ সৈতে বিক্ৰিয়া কৰে", "ই পানীত সম্পূৰ্ণভাৱে বিযোজিত হয়", "ই ক্ষয়কাৰক"] }, ans: 2 },
      { q: { en: "Approximate pH of 0.1M HCl solution is:", as: "0.1M HCl সমাধানৰ আনুমানিক pH:" }, opts: { en: ["7", "14", "1", "4"], as: ["7", "14", "1", "4"] }, ans: 2 },
    ],
  },

  {
    id: "naoh-diss", num: 2,
    title: { en: "Sodium Hydroxide Dissociation", as: "ছ’ডিয়াম হাইড্ৰক্সাইডৰ বিযোজন" },
    subtitle: { en: "Strong Base Ionisation", as: "প্ৰবল ক্ষাৰৰ আয়নীকৰণ" },
    equation: "NaOH → Na⁺ + OH⁻",
    ionEquation: "NaOH(aq) → Na⁺ + OH⁻",
    type: "dissociation",
    accent: "#8B5CF6", glow: "rgba(139,92,246,0.4)", gradFrom: "#7C3AED", gradTo: "#A78BFA", emoji: "🟣",
    hazard: "MEDIUM",
    description: {
      en: "Sodium hydroxide (NaOH) is a strong base that completely dissociates in water releasing Na⁺ and OH⁻ ions. The excess OH⁻ ions make the solution strongly alkaline (pH ≈ 13). The solution conducts electricity and feels slippery due to saponification of skin oils.",
      as: "ছ’ডিয়াম হাইড্ৰক্সাইড (NaOH) এক প্ৰবল ক্ষাৰ, যি পানীত সম্পূৰ্ণভাৱে বিযোজিত হৈ Na⁺ আৰু OH⁻ আয়ন মুক্ত কৰে। অতিৰিক্ত OH⁻ আয়নে সমাধানক প্ৰবল ক্ষাৰীয় (pH ≈ 13) কৰে। সমাধানে বিদ্যুৎ পৰিবাহিতা কৰে আৰু ছালৰ তেলৰ চাবোনীকৰণৰ বাবে পিছল অনুভৱ হয়।",
    },
    realWorld: {
      en: "Soap making (saponification) · Paper industry · Oven cleaners · Drain unblocking · Water treatment",
      as: "চাবোন প্ৰস্তুতি (চাবোনীকৰণ) · কাগজ উদ্যোগ · অভেন ক্লিনাৰ · নলা পৰিষ্কাৰ · পানী পৰিশোধন",
    },
    examNote: {
      en: "NaOH is a STRONG BASE — complete dissociation. OH⁻ ion causes alkaline nature. Na⁺ is spectator ion. pH ≈ 13 for 0.1M NaOH. Highly hygroscopic. CBSE: NaOH + fat → soap (saponification).",
      as: "NaOH এক প্ৰবল ক্ষাৰ — সম্পূৰ্ণ বিযোজন। OH⁻ আয়নে ক্ষাৰীয় প্ৰকৃতি দিয়ে। Na⁺ দৰ্শক আয়ন। 0.1M NaOH-ৰ pH ≈ 13। অতি জলাকৰ্ষী। CBSE: NaOH + চৰ্বি → চাবোন (চাবোনীকৰণ)।",
    },
    safety: {
      en: ["Strongly corrosive — wear gloves", "Causes severe burns on skin/eyes", "Highly exothermic when dissolved", "Do NOT inhale dust"],
      as: ["প্ৰবলভাৱে ক্ষয়কাৰক — দস্তানা পিন্ধক", "ছাল/চকুত গুৰুতৰ পোৰা সৃষ্টি কৰে", "দ্ৰৱীভূত হ’লে অতি তাপমোচী", "ধূলি শ্বাসৰ সৈতে নলওক"],
    },
    steps: [
      { label: { en: "Prepare Water", as: "পানী প্ৰস্তুত কৰক" }, desc: { en: "Take 100 mL distilled water in beaker. Note pH = 7. Pure water with no excess ions — neutral.", as: "বিকাৰত 100 mL পাতিত পানী লওক। pH = 7 লক্ষ্য কৰক। অতিৰিক্ত আয়নবিহীন শুদ্ধ পানী — নিৰপেক্ষ।" } },
      { label: { en: "Add NaOH Pellets", as: "NaOH টেবলেট যোগ কৰক" }, desc: { en: "Carefully add 1–2 NaOH pellets. The solid immediately begins dissolving. The solution heats up noticeably.", as: "সাৱধানে 1–2টা NaOH টেবলেট যোগ কৰক। কঠিন তৎক্ষণাৎ দ্ৰৱীভূত হ’বলৈ আৰম্ভ কৰে। সমাধান লক্ষণীয়ভাৱে গৰম হয়।" } },
      { label: { en: "Observe Dissociation", as: "বিযোজন লক্ষ্য কৰক" }, desc: { en: "NaOH lattice breaks apart — Na⁺ and OH⁻ ions spread rapidly. OH⁻ causes alkalinity and blue litmus response.", as: "NaOH জালিকা ভাঙি যায় — Na⁺ আৰু OH⁻ আয়ন দ্ৰুতভাৱে বিয়পে। OH⁻-এ ক্ষাৰতা আৰু নীলা লিটমাছ প্ৰতিক্ৰিয়া দিয়ে।" } },
      { label: { en: "Confirm Alkalinity", as: "ক্ষাৰতা নিশ্চিত কৰক" }, desc: { en: "pH meter reads ~13. Universal indicator turns deep violet. Conductivity meter: very high (strong electrolyte).", as: "pH মিটাৰে ~13 পঢ়ে। সাৰ্বজনীন সূচক ঘন বেঙুনীয়া হয়। পৰিবাহিতা মিটাৰ: অতি উচ্চ (প্ৰবল ইলেক্ট্ৰ’লাইট)।" } },
    ],
    phaseData: {
      idle:     { pH: 7,  indicator: { en: "Purple",      as: "বেঙুনীয়া" },       indicatorColor: "#8B5CF6" },
      step1:    { pH: 9,  indicator: { en: "Blue",         as: "নীলা" },           indicatorColor: "#6366F1" },
      step2:    { pH: 11, indicator: { en: "Violet",       as: "বেঙুনীয়া" },       indicatorColor: "#7C3AED" },
      reacting: { pH: 13, indicator: { en: "Deep Violet",  as: "ঘন বেঙুনীয়া" },    indicatorColor: "#5B21B6" },
      complete: { pH: 13, indicator: { en: "Deep Violet",  as: "ঘন বেঙুনীয়া" },    indicatorColor: "#5B21B6" },
    },
    ions: {
      reactants: [{ sym: "NaOH", charge: "", col: "#C4B5FD", desc: { en: "Sodium hydroxide", as: "ছ’ডিয়াম হাইড্ৰক্সাইড" } }],
      products: [
        { sym: "Na⁺", charge: "+", col: "#FDE047", desc: { en: "Sodium ion (spectator)", as: "ছ’ডিয়াম আয়ন (দৰ্শক)" } },
        { sym: "OH⁻", charge: "−", col: "#A78BFA", desc: { en: "Hydroxide ion (causes alkalinity)", as: "হাইড্ৰক্সাইড আয়ন (ক্ষাৰতাৰ কাৰণ)" } },
      ],
    },
    observations: {
      en: [
        "NaOH pellets dissolve rapidly with heat release",
        "Solution temperature rises (exothermic dissolution)",
        "pH rises from 7 to ~13",
        "Universal indicator turns deep violet/purple",
        "Red litmus turns blue — confirms alkaline nature",
        "High electrical conductivity",
      ],
      as: [
        "NaOH টেবলেট তাপ নিৰ্গত কৰি দ্ৰুতভাৱে দ্ৰৱীভূত হয়",
        "সমাধানৰ উষ্ণতা বাঢ়ে (তাপমোচী দ্ৰৱণ)",
        "pH 7-ৰ পৰা ~13 লৈ বাঢ়ে",
        "সাৰ্বজনীন সূচক ঘন বেঙুনীয়া হয়",
        "ৰঙা লিটমাছ নীলা হয় — ক্ষাৰীয় প্ৰকৃতি নিশ্চিত",
        "উচ্চ বৈদ্যুতিক পৰিবাহিতা",
      ],
    },
    pmode: "base-ions",
    quiz: [
      { q: { en: "Which ion makes NaOH solution alkaline?", as: "NaOH সমাধানক কোন আয়নে ক্ষাৰীয় কৰে?" }, opts: { en: ["Na⁺", "OH⁻", "H₃O⁺", "Cl⁻"], as: ["Na⁺", "OH⁻", "H₃O⁺", "Cl⁻"] }, ans: 1 },
      { q: { en: "NaOH is called a strong base because:", as: "NaOH-ক প্ৰবল ক্ষাৰ কোৱাৰ কাৰণ:" }, opts: { en: ["It has high pH", "It is soluble in water", "It completely dissociates in water", "It reacts with acids"], as: ["ইয়াৰ উচ্চ pH আছে", "ই পানীত দ্ৰৱণীয়", "ই পানীত সম্পূৰ্ণভাৱে বিযোজিত হয়", "ই অম্লৰ সৈতে বিক্ৰিয়া কৰে"] }, ans: 2 },
      { q: { en: "Approximate pH of 0.1M NaOH is:", as: "0.1M NaOH-ৰ আনুমানিক pH:" }, opts: { en: ["1", "7", "13", "10"], as: ["1", "7", "13", "10"] }, ans: 2 },
      { q: { en: "When NaOH dissolves in water, temperature:", as: "NaOH পানীত দ্ৰৱীভূত হ’লে উষ্ণতা:" }, opts: { en: ["Falls", "No change", "Rises (exothermic)", "Rises then falls"], as: ["কমে", "অপৰিবৰ্তিত", "বাঢ়ে (তাপমোচী)", "বাঢ়ে তাৰ পিছত কমে"] }, ans: 2 },
      { q: { en: "Which indicator colour confirms alkaline solution?", as: "কোন সূচকৰ ৰঙে ক্ষাৰীয় সমাধান নিশ্চিত কৰে?" }, opts: { en: ["Red", "Orange", "Yellow", "Blue/Violet"], as: ["ৰঙা", "কমলা", "হালধীয়া", "নীলা/বেঙুনীয়া"] }, ans: 3 },
    ],
  },

  {
    id: "hcl-naoh", num: 3,
    title: { en: "HCl + NaOH Neutralization", as: "HCl + NaOH নিৰপেক্ষণ" },
    subtitle: { en: "Strong Acid × Strong Base", as: "প্ৰবল অম্ল × প্ৰবল ক্ষাৰ" },
    equation: "HCl + NaOH → NaCl + H₂O",
    ionEquation: "H⁺ + OH⁻ → H₂O",
    type: "neutralization",
    accent: "#06B6D4", glow: "rgba(6,182,212,0.4)", gradFrom: "#0E7490", gradTo: "#22D3EE", emoji: "🔵",
    hazard: "MEDIUM",
    description: {
      en: "When HCl (strong acid) reacts with NaOH (strong base), H⁺ and OH⁻ ions combine to form water. Na⁺ and Cl⁻ remain as spectator ions forming NaCl (common salt). The reaction is exothermic and produces a neutral solution (pH = 7).",
      as: "HCl (প্ৰবল অম্ল)-এ NaOH (প্ৰবল ক্ষাৰ)-ৰ সৈতে বিক্ৰিয়া কৰিলে H⁺ আৰু OH⁻ আয়ন মিলি পানী গঠন কৰে। Na⁺ আৰু Cl⁻ দৰ্শক আয়ন হিচাপে থাকি NaCl (সাধাৰণ লৱণ) গঠন কৰে। বিক্ৰিয়া তাপমোচী আৰু এক নিৰপেক্ষ সমাধান (pH = 7) উৎপন্ন কৰে।",
    },
    realWorld: {
      en: "Antacid tablets · Toothpaste (neutralize mouth acid) · Treating acid spills · Waste water treatment",
      as: "এণ্টাচিড টেবলেট · টুথপেষ্ট (মুখৰ এচিড নিৰপেক্ষ কৰে) · এচিড পৰাৰ চিকিৎসা · বৰ্জ্য পানী পৰিশোধন",
    },
    examNote: {
      en: "NET IONIC: H⁺ + OH⁻ → H₂O. Na⁺ and Cl⁻ are spectator ions. Salt + Water formed. Exothermic. pH = 7 at equivalence. Indicator: phenolphthalein (pink at endpoint). CBSE: acid + base → salt + water.",
      as: "নেট আয়নিক: H⁺ + OH⁻ → H₂O। Na⁺ আৰু Cl⁻ দৰ্শক আয়ন। লৱণ + পানী গঠিত। তাপমোচী। সাম্যাৱস্থাত pH = 7। সূচক: ফেনলপথেলিন (অন্তবিন্দুত গোলাপী)। CBSE: অম্ল + ক্ষাৰ → লৱণ + পানী।",
    },
    safety: {
      en: ["Work with both acid and base — double hazard", "Wear goggles and gloves", "Add acid to base slowly", "Neutralization is exothermic — handle carefully"],
      as: ["অম্ল আৰু ক্ষাৰ দুয়োৰে সৈতে কাম — দ্বিগুণ বিপদ", "চশমা আৰু দস্তানা পিন্ধক", "ক্ষাৰত এচিড লাহে লাহে যোগ কৰক", "নিৰপেক্ষণ তাপমোচী — সাৱধানে পৰিচালনা কৰক"],
    },
    steps: [
      { label: { en: "Set Up Acid", as: "এচিড সাজু কৰক" }, desc: { en: "Take 50 mL of HCl in a conical flask. Add 2–3 drops of phenolphthalein indicator. Solution is colourless (acidic, pH ≈ 1).", as: "এক শংকু ফ্লাস্কত 50 mL HCl লওক। 2–3 টোপাল ফেনলপথেলিন সূচক যোগ কৰক। সমাধান বৰ্ণহীন (অম্লীয়, pH ≈ 1)।" } },
      { label: { en: "Add NaOH Gradually", as: "NaOH ক্ৰমে যোগ কৰক" }, desc: { en: "Using a burette, slowly add NaOH. Swirl after each addition. pH rises slowly as neutralization occurs.", as: "এক ব্যুৰেট ব্যৱহাৰ কৰি লাহে লাহে NaOH যোগ কৰক। প্ৰতিবাৰ যোগ কৰাৰ পিছত ঘূৰাওক। নিৰপেক্ষণ হোৱাৰ লগে লগে pH লাহে লাহে বাঢ়ে।" } },
      { label: { en: "Observe Neutralization", as: "নিৰপেক্ষণ লক্ষ্য কৰক" }, desc: { en: "H⁺ + OH⁻ → H₂O (ionic reaction). Temperature rises. Na⁺ and Cl⁻ remain in solution as spectators.", as: "H⁺ + OH⁻ → H₂O (আয়নিক বিক্ৰিয়া)। উষ্ণতা বাঢ়ে। Na⁺ আৰু Cl⁻ দৰ্শক হিচাপে সমাধানত থাকে।" } },
      { label: { en: "Endpoint Reached", as: "অন্তবিন্দু পোৱা গ’ল" }, desc: { en: "pH = 7. Phenolphthalein flashes pink permanently. Temperature at maximum. NaCl solution is neutral.", as: "pH = 7। ফেনলপথেলিন স্থায়ীভাৱে গোলাপী জ্বলি উঠে। উষ্ণতা সৰ্বোচ্চ। NaCl সমাধান নিৰপেক্ষ।" } },
    ],
    phaseData: {
      idle:     { pH: 1, indicator: { en: "Colourless",      as: "বৰ্ণহীন" },         indicatorColor: "#94A3B8" },
      step1:    { pH: 3, indicator: { en: "Colourless",      as: "বৰ্ণহীন" },         indicatorColor: "#94A3B8" },
      step2:    { pH: 5, indicator: { en: "Pale Pink",       as: "পাতল গোলাপী" },     indicatorColor: "#FCA5A5" },
      reacting: { pH: 7, indicator: { en: "Pink Flash",      as: "গোলাপী জ্বলন" },    indicatorColor: "#F472B6" },
      complete: { pH: 7, indicator: { en: "Pink (Endpoint)", as: "গোলাপী (অন্তবিন্দু)" }, indicatorColor: "#EC4899" },
    },
    ions: {
      reactants: [
        { sym: "H⁺",  charge: "+", col: "#F97316", desc: { en: "From HCl (causes acidity)", as: "HCl-ৰ পৰা (অম্লতাৰ কাৰণ)" } },
        { sym: "OH⁻", charge: "−", col: "#A78BFA", desc: { en: "From NaOH (causes alkalinity)", as: "NaOH-ৰ পৰা (ক্ষাৰতাৰ কাৰণ)" } },
      ],
      products: [
        { sym: "H₂O", charge: "",  col: "#67E8F9", desc: { en: "Water (neutralization product)", as: "পানী (নিৰপেক্ষণ উৎপাদ)" } },
        { sym: "Na⁺", charge: "+", col: "#FDE047", desc: { en: "Sodium ion (spectator)", as: "ছ’ডিয়াম আয়ন (দৰ্শক)" } },
        { sym: "Cl⁻", charge: "−", col: "#67E8F9", desc: { en: "Chloride ion (spectator)", as: "ক্ল’ৰাইড আয়ন (দৰ্শক)" } },
      ],
    },
    observations: {
      en: [
        "Phenolphthalein stays colourless in acid",
        "Temperature rises as NaOH is added",
        "pH gradually increases from 1 toward 7",
        "At equivalence: sharp pink flash (permanent)",
        "Solution becomes neutral — pH = 7",
        "NaCl (table salt) remains in solution",
      ],
      as: [
        "এচিডত ফেনলপথেলিন বৰ্ণহীন থাকে",
        "NaOH যোগ কৰাৰ লগে লগে উষ্ণতা বাঢ়ে",
        "pH 1-ৰ পৰা 7-ৰ ফালে ক্ৰমে বাঢ়ে",
        "সাম্যাৱস্থাত: তীব্ৰ গোলাপী জ্বলন (স্থায়ী)",
        "সমাধান নিৰপেক্ষ হয় — pH = 7",
        "NaCl (টেবুল লৱণ) সমাধানত থাকে",
      ],
    },
    pmode: "neutralize",
    quiz: [
      { q: { en: "Products of HCl + NaOH reaction are:", as: "HCl + NaOH বিক্ৰিয়াৰ উৎপাদ হ’ল:" }, opts: { en: ["HNaO + Cl₂", "NaCl + H₂O", "Na₂O + HCl₂", "H₂ + NaCl₂"], as: ["HNaO + Cl₂", "NaCl + H₂O", "Na₂O + HCl₂", "H₂ + NaCl₂"] }, ans: 1 },
      { q: { en: "Why does temperature increase during neutralization?", as: "নিৰপেক্ষণৰ সময়ত উষ্ণতা কিয় বাঢ়ে?" }, opts: { en: ["Due to light", "Exothermic reaction", "Endothermic reaction", "Dissolution"], as: ["পোহৰৰ বাবে", "তাপমোচী বিক্ৰিয়া", "তাপগ্ৰাহী বিক্ৰিয়া", "দ্ৰৱণ"] }, ans: 1 },
      { q: { en: "Net ionic equation for HCl + NaOH is:", as: "HCl + NaOH-ৰ নেট আয়নিক সমীকৰণ:" }, opts: { en: ["Na⁺ + Cl⁻ → NaCl", "H⁺ + OH⁻ → H₂O", "HCl + NaOH → NaCl", "H₂ + O₂ → H₂O"], as: ["Na⁺ + Cl⁻ → NaCl", "H⁺ + OH⁻ → H₂O", "HCl + NaOH → NaCl", "H₂ + O₂ → H₂O"] }, ans: 1 },
      { q: { en: "Which indicator detects endpoint of this titration?", as: "এই অনুমাপনৰ অন্তবিন্দু কোন সূচকে চিনাক্ত কৰে?" }, opts: { en: ["Litmus", "Methyl orange", "Phenolphthalein", "Starch"], as: ["লিটমাছ", "মিথাইল কমলা", "ফেনলপথেলিন", "ষ্টাৰ্চ"] }, ans: 2 },
      { q: { en: "Na⁺ and Cl⁻ are called ______ ions in neutralization:", as: "নিৰপেক্ষণত Na⁺ আৰু Cl⁻-ক ______ আয়ন কোৱা হয়:" }, opts: { en: ["Reactive", "Spectator", "Acidic", "Basic"], as: ["ক্ৰিয়াশীল", "দৰ্শক", "অম্লীয়", "ক্ষাৰীয়"] }, ans: 1 },
    ],
  },

  {
    id: "hno3-koh", num: 4,
    title: { en: "HNO₃ + KOH Neutralization", as: "HNO₃ + KOH নিৰপেক্ষণ" },
    subtitle: { en: "Nitric Acid × Potassium Hydroxide", as: "নাইট্ৰিক এচিড × প’টাছিয়াম হাইড্ৰক্সাইড" },
    equation: "HNO₃ + KOH → KNO₃ + H₂O",
    ionEquation: "H⁺ + OH⁻ → H₂O",
    type: "neutralization",
    accent: "#10B981", glow: "rgba(16,185,129,0.4)", gradFrom: "#065F46", gradTo: "#34D399", emoji: "🟢",
    hazard: "HIGH",
    description: {
      en: "Nitric acid (HNO₃) reacts with potassium hydroxide (KOH) producing potassium nitrate (KNO₃) and water. The net ionic equation is identical to all strong acid-base neutralizations: H⁺ + OH⁻ → H₂O. Methyl orange indicator changes from red → yellow at equivalence.",
      as: "নাইট্ৰিক এচিড (HNO₃)-এ প’টাছিয়াম হাইড্ৰক্সাইড (KOH)-ৰ সৈতে বিক্ৰিয়া কৰি প’টাছিয়াম নাইট্ৰেট (KNO₃) আৰু পানী উৎপন্ন কৰে। সকলো প্ৰবল অম্ল-ক্ষাৰ নিৰপেক্ষণৰ নেট আয়নিক সমীকৰণ একে: H⁺ + OH⁻ → H₂O। সাম্যাৱস্থাত মিথাইল কমলা সূচক ৰঙাৰ পৰা হালধীয়া হয়।",
    },
    realWorld: {
      en: "KNO₃ is used in: fertilisers (N + K source) · gunpowder · food preservative (E252) · fireworks",
      as: "KNO₃ ব্যৱহৃত হয়: সাৰ (N + K উৎস) · বাৰুদ · খাদ্য সংৰক্ষক (E252) · আতচবাজী",
    },
    examNote: {
      en: "HNO₃ is a strong acid. KOH is a strong base. Salt formed: KNO₃ (potassium nitrate). Net ionic equation same for ALL strong acid-base pairs. KNO₃ is an important nitrogen fertiliser. CBSE: acid + base → salt + water.",
      as: "HNO₃ এক প্ৰবল অম্ল। KOH এক প্ৰবল ক্ষাৰ। গঠিত লৱণ: KNO₃ (প’টাছিয়াম নাইট্ৰেট)। সকলো প্ৰবল অম্ল-ক্ষাৰ যুগ্মৰ নেট আয়নিক সমীকৰণ একে। KNO₃ এক গুৰুত্বপূৰ্ণ নাইট্ৰ’জেন সাৰ। CBSE: অম্ল + ক্ষাৰ → লৱণ + পানী।",
    },
    safety: {
      en: ["HNO₃ is oxidising — highly dangerous", "KOH is corrosive", "Wear acid-resistant gloves", "Work in well-ventilated area — HNO₃ fumes toxic"],
      as: ["HNO₃ জাৰক — অতি বিপজ্জনক", "KOH ক্ষয়কাৰক", "এচিড-প্ৰতিৰোধী দস্তানা পিন্ধক", "ভাল বায়ু চলাচল থকা ঠাইত কাম কৰক — HNO₃ ধোঁৱা বিষাক্ত"],
    },
    steps: [
      { label: { en: "Prepare Nitric Acid", as: "নাইট্ৰিক এচিড প্ৰস্তুত কৰক" }, desc: { en: "Take 50 mL of dilute HNO₃ in conical flask. Add methyl orange indicator — solution turns red (acidic). pH ≈ 1.", as: "শংকু ফ্লাস্কত 50 mL পাতল HNO₃ লওক। মিথাইল কমলা সূচক যোগ কৰক — সমাধান ৰঙা হয় (অম্লীয়)। pH ≈ 1।" } },
      { label: { en: "Fill KOH in Burette", as: "ব্যুৰেটত KOH ভৰাওক" }, desc: { en: "Fill burette with KOH solution. Open stopcock slowly — KOH drips into acid. Swirl constantly to mix.", as: "ব্যুৰেটত KOH সমাধান ভৰাওক। ষ্টপককটো লাহে লাহে খোলক — KOH এচিডত পৰে। মিহলোৱাৰ বাবে অহৰহ ঘূৰাওক।" } },
      { label: { en: "Observe Neutralization", as: "নিৰপেক্ষণ লক্ষ্য কৰক" }, desc: { en: "H⁺ + OH⁻ → H₂O forms at ionic level. K⁺ and NO₃⁻ remain free. Temperature rises. pH climbs.", as: "আয়নিক স্তৰত H⁺ + OH⁻ → H₂O গঠিত হয়। K⁺ আৰু NO₃⁻ মুক্ত থাকে। উষ্ণতা বাঢ়ে। pH বাঢ়ি যায়।" } },
      { label: { en: "Endpoint (pH = 7)", as: "অন্তবিন্দু (pH = 7)" }, desc: { en: "Methyl orange changes red → orange → yellow at endpoint. pH = 7. KNO₃ solution formed. Complete.", as: "অন্তবিন্দুত মিথাইল কমলা ৰঙা → কমলা → হালধীয়া হয়। pH = 7। KNO₃ সমাধান গঠিত। সম্পূৰ্ণ।" } },
    ],
    phaseData: {
      idle:     { pH: 1, indicator: { en: "Red",              as: "ৰঙা" },              indicatorColor: "#EF4444" },
      step1:    { pH: 3, indicator: { en: "Red-Orange",       as: "ৰঙা-কমলা" },         indicatorColor: "#F97316" },
      step2:    { pH: 5, indicator: { en: "Orange",           as: "কমলা" },             indicatorColor: "#F59E0B" },
      reacting: { pH: 7, indicator: { en: "Yellow (endpoint)", as: "হালধীয়া (অন্তবিন্দু)" }, indicatorColor: "#EAB308" },
      complete: { pH: 7, indicator: { en: "Yellow",           as: "হালধীয়া" },           indicatorColor: "#CA8A04" },
    },
    ions: {
      reactants: [
        { sym: "H⁺",   charge: "+", col: "#F97316", desc: { en: "From HNO₃ (proton)", as: "HNO₃-ৰ পৰা (প্ৰট’ন)" } },
        { sym: "NO₃⁻", charge: "−", col: "#4ADE80", desc: { en: "Nitrate ion (spectator)", as: "নাইট্ৰেট আয়ন (দৰ্শক)" } },
        { sym: "K⁺",   charge: "+", col: "#A3E635", desc: { en: "Potassium ion (spectator)", as: "প’টাছিয়াম আয়ন (দৰ্শক)" } },
        { sym: "OH⁻",  charge: "−", col: "#A78BFA", desc: { en: "Hydroxide ion", as: "হাইড্ৰক্সাইড আয়ন" } },
      ],
      products: [
        { sym: "K⁺",   charge: "+", col: "#A3E635", desc: { en: "Potassium ion (in KNO₃)", as: "প’টাছিয়াম আয়ন (KNO₃-ত)" } },
        { sym: "NO₃⁻", charge: "−", col: "#4ADE80", desc: { en: "Nitrate ion (in KNO₃)", as: "নাইট্ৰেট আয়ন (KNO₃-ত)" } },
        { sym: "H₂O",  charge: "",  col: "#67E8F9", desc: { en: "Water formed", as: "গঠিত পানী" } },
      ],
    },
    observations: {
      en: [
        "Methyl orange turns red in HNO₃ (acid confirmed)",
        "pH gradually increases as KOH is added",
        "Temperature rises steadily (exothermic)",
        "At endpoint: methyl orange turns yellow",
        "pH = 7 at equivalence point",
        "KNO₃ remains as white salt in solution",
      ],
      as: [
        "HNO₃-ত মিথাইল কমলা ৰঙা হয় (এচিড নিশ্চিত)",
        "KOH যোগ কৰাৰ লগে লগে pH ক্ৰমে বাঢ়ে",
        "উষ্ণতা স্থিৰভাৱে বাঢ়ে (তাপমোচী)",
        "অন্তবিন্দুত: মিথাইল কমলা হালধীয়া হয়",
        "সাম্যাৱস্থা বিন্দুত pH = 7",
        "KNO₃ সমাধানত বগা লৱণ হিচাপে থাকে",
      ],
    },
    pmode: "neutralize",
    quiz: [
      { q: { en: "Salt formed when HNO₃ reacts with KOH:", as: "HNO₃-এ KOH-ৰ সৈতে বিক্ৰিয়া কৰিলে গঠিত লৱণ:" }, opts: { en: ["NaNO₃", "KCl", "KNO₃", "KOH₂"], as: ["NaNO₃", "KCl", "KNO₃", "KOH₂"] }, ans: 2 },
      { q: { en: "Net ionic equation for HNO₃ + KOH is:", as: "HNO₃ + KOH-ৰ নেট আয়নিক সমীকৰণ:" }, opts: { en: ["K⁺ + NO₃⁻ → KNO₃", "H⁺ + OH⁻ → H₂O", "HNO₃ + KOH → salt", "H₂ + O₂ → H₂O"], as: ["K⁺ + NO₃⁻ → KNO₃", "H⁺ + OH⁻ → H₂O", "HNO₃ + KOH → লৱণ", "H₂ + O₂ → H₂O"] }, ans: 1 },
      { q: { en: "Indicator used for HNO₃ + KOH titration:", as: "HNO₃ + KOH অনুমাপনৰ বাবে ব্যৱহৃত সূচক:" }, opts: { en: ["Phenolphthalein", "Methyl orange", "Starch", "Litmus"], as: ["ফেনলপথেলিন", "মিথাইল কমলা", "ষ্টাৰ্চ", "লিটমাছ"] }, ans: 1 },
      { q: { en: "Methyl orange colour at the endpoint:", as: "অন্তবিন্দুত মিথাইল কমলাৰ ৰং:" }, opts: { en: ["Red", "Blue", "Yellow", "Green"], as: ["ৰঙা", "নীলা", "হালধীয়া", "সেউজীয়া"] }, ans: 2 },
      { q: { en: "KNO₃ (potassium nitrate) is important because:", as: "KNO₃ (প’টাছিয়াম নাইট্ৰেট) গুৰুত্বপূৰ্ণ কাৰণ:" }, opts: { en: ["It is a strong acid", "It is used in fertilisers and fireworks", "It is a strong base", "It conducts electricity"], as: ["ই এক প্ৰবল অম্ল", "ই সাৰ আৰু আতচবাজীত ব্যৱহাৰ হয়", "ই এক প্ৰবল ক্ষাৰ", "ই বিদ্যুৎ পৰিবাহিতা কৰে"] }, ans: 1 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// PARTICLE ENGINE
// ═══════════════════════════════════════════════════════════

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, mode: PMode, intensity: number) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animId: number;
    const particles: Particle[] = [];
    const W = () => canvas.width;
    const H = () => canvas.height;

    function spawn() {
      if (intensity === 0 || mode === "none") return;

      if (mode === "acid-ions") {
        if (Math.random() < 0.35 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.65 + Math.random() * H() * 0.25,
          vx: (Math.random() - 0.5) * 2.5, vy: -1.2 - Math.random() * 2,
          life: 90, maxLife: 90, size: 4 + Math.random() * 5,
          color: `rgba(249,115,22,${0.7 + Math.random() * 0.3})`, blur: 8, type: "h3o",
        });
        if (Math.random() < 0.35 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.65 + Math.random() * H() * 0.25,
          vx: (Math.random() - 0.5) * 2.5, vy: -0.8 - Math.random() * 1.5,
          life: 100, maxLife: 100, size: 3 + Math.random() * 4,
          color: `rgba(103,232,249,${0.7 + Math.random() * 0.3})`, blur: 6, type: "cl",
        });
        if (Math.random() < 0.2 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.4 + Math.random() * H() * 0.4,
          vx: (Math.random() - 0.5) * 0.8, vy: -0.5 - Math.random(),
          life: 40, maxLife: 40, size: 1.5 + Math.random() * 2,
          color: `rgba(255,255,255,${0.3 + Math.random() * 0.3})`, blur: 3, type: "shimmer",
        });
      }

      if (mode === "base-ions") {
        if (Math.random() < 0.35 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.6 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 1.5,
          life: 100, maxLife: 100, size: 4 + Math.random() * 4,
          color: `rgba(253,224,71,${0.7 + Math.random() * 0.3})`, blur: 7, type: "na",
        });
        if (Math.random() < 0.4 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.6 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 2.2, vy: -0.8 - Math.random() * 2,
          life: 110, maxLife: 110, size: 4 + Math.random() * 5,
          color: `rgba(167,139,250,${0.7 + Math.random() * 0.3})`, blur: 9, type: "oh",
        });
      }

      if (mode === "neutralize") {
        if (Math.random() < 0.2 * intensity) {
          const x = W() * 0.2 + Math.random() * W() * 0.6;
          const y = H() * 0.4 + Math.random() * H() * 0.45;
          for (let k = 0; k < 4; k++) {
            const angle = Math.random() * Math.PI * 2;
            particles.push({
              x, y,
              vx: Math.cos(angle) * (1 + Math.random() * 2.5),
              vy: Math.sin(angle) * (1 + Math.random() * 2.5),
              life: 35, maxLife: 35, size: 2 + Math.random() * 3,
              color: "rgba(255,255,255,0.9)", blur: 12, type: "h2o",
            });
          }
        }
        if (Math.random() < 0.3 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.3 + Math.random() * H() * 0.5,
          vx: (Math.random() - 0.5) * 0.8, vy: -1.5 - Math.random() * 2,
          life: 50, maxLife: 50, size: 2 + Math.random() * 3,
          color: `rgba(250,204,21,${0.35 + Math.random() * 0.35})`, blur: 8, type: "heat",
        });
        if (Math.random() < 0.12 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.5 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
          life: 28, maxLife: 28, size: 2.5 + Math.random() * 3,
          color: "rgba(249,115,22,0.55)", blur: 6, type: "h",
        });
        if (Math.random() < 0.12 * intensity) particles.push({
          x: Math.random() * W(), y: H() * 0.5 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
          life: 28, maxLife: 28, size: 2.5 + Math.random() * 3,
          color: "rgba(167,139,250,0.55)", blur: 6, type: "oh",
        });
      }
    }

    function draw() {
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, W(), H());
      spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.type === "shimmer" || p.type === "heat") p.vy -= 0.04;
        if (p.type === "h2o") { p.vx *= 0.95; p.vy *= 0.95; }
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.blur;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [canvasRef, mode, intensity]);
}

// ═══════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════

function GlassPanel({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`}
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", ...style }}>
      {children}
    </div>
  );
}

function NeonBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest"
      style={{ color, borderColor: `${color}44`, background: `${color}15` }}>
      {label}
    </span>
  );
}

function DataRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <span className="text-[10px] text-slate-500 font-semibold">{label}</span>
      <span className="text-[10px] font-black" style={{ color }}>{value}</span>
    </div>
  );
}

function AnimBar({ label, target, accent, icon }: { label: string; target: number; accent: string; icon: React.ReactNode }) {
  const [val, setVal] = useState(0);
  useEffect(() => { const t = setTimeout(() => setVal(target), 100); return () => clearTimeout(t); }, [target]);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span style={{ color: accent }}>{icon}</span>
        <span className="text-[10px] text-slate-400 font-semibold flex-1">{label}</span>
        <span className="text-[10px] font-black" style={{ color: accent }}>{val}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${val}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)`, boxShadow: `0 0 8px ${accent}` }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PH SCALE PANEL
// ═══════════════════════════════════════════════════════════

function PhScalePanel({ pH, accent }: { pH: number; accent: string }) {
  const pct = (pH / 14) * 100;
  const currentColor = phToColor(pH);
  const hConc = `10⁻${pH} mol/L`;
  const ohConc = `10⁻${14 - pH} mol/L`;
  const { lang } = useLanguage();
  const isAs = lang === "as";

  return (
    <GlassPanel className="p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Activity className="w-3.5 h-3.5" style={{ color: accent }} />
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "pH বিশ্লেষণ" : "pH Analysis"}</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[9px] text-slate-500 mb-0.5">{isAs ? "বৰ্তমান pH" : "Current pH"}</p>
          <motion.p className="text-3xl font-black leading-none" animate={{ color: currentColor }} transition={{ duration: 0.5 }}>
            {pH.toFixed(0)}
          </motion.p>
          <p className="text-[10px] font-bold mt-1" style={{ color: currentColor }}>{phToLabel(pH, isAs)}</p>
        </div>
        <div className="text-right space-y-1.5">
          <div className="rounded-lg px-2 py-1.5" style={{ background: "rgba(249,115,22,0.1)", borderLeft: "2px solid #F97316" }}>
            <p className="text-[8px] text-slate-500">H⁺ (H₃O⁺)</p>
            <p className="text-[9px] font-black text-orange-400">{hConc}</p>
          </div>
          <div className="rounded-lg px-2 py-1.5" style={{ background: "rgba(167,139,250,0.1)", borderLeft: "2px solid #A78BFA" }}>
            <p className="text-[8px] text-slate-500">OH⁻</p>
            <p className="text-[9px] font-black text-purple-400">{ohConc}</p>
          </div>
        </div>
      </div>

      {/* pH gradient bar */}
      <div className="relative mb-1">
        <div className="h-3 rounded-full overflow-hidden" style={{
          background: "linear-gradient(90deg, #DC2626,#EF4444,#F97316,#FB923C,#F59E0B,#EAB308,#22C55E,#10B981,#06B6D4,#3B82F6,#6366F1,#8B5CF6,#7C3AED,#6D28D9,#5B21B6)",
        }} />
        <motion.div className="absolute top-0 -translate-x-1/2 -translate-y-0.5"
          animate={{ left: `${Math.max(2, Math.min(98, pct))}%` }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <div style={{ width: 3, height: 16, background: "white", borderRadius: 2, boxShadow: `0 0 10px ${currentColor}, 0 0 24px ${currentColor}` }} />
        </motion.div>
      </div>
      <div className="flex justify-between px-0.5 mb-1">
        {[0, 3, 5, 7, 9, 11, 14].map(n => (
          <span key={n} className="text-[7px] text-slate-600">{n}</span>
        ))}
      </div>
      <div className="flex text-[8px] font-black justify-between">
        <span className="text-red-400">{isAs ? "◀ অম্ল" : "◀ ACID"}</span>
        <span className="text-green-400">{isAs ? "নিৰপেক্ষ" : "NEUTRAL"}</span>
        <span className="text-purple-400">{isAs ? "ক্ষাৰ ▶" : "BASE ▶"}</span>
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// APPARATUS SVG
// ═══════════════════════════════════════════════════════════

function ApparatusSVG({ exp, phase }: { exp: Exp; phase: Phase }) {
  const pH = exp.phaseData[phase].pH;
  const solutionColor = phToColor(pH);
  const liqAlpha = phase === "idle" ? 0.22 : phase === "complete" ? 0.5 : 0.38;

  if (exp.type === "dissociation") {
    return (
      <svg viewBox="0 0 240 200" className="w-full h-full">
        <defs>
          <radialGradient id={`sl-${exp.id}`} cx="50%" cy="65%" r="60%">
            <stop offset="0%" stopColor={solutionColor} stopOpacity={liqAlpha + 0.1} />
            <stop offset="100%" stopColor={solutionColor} stopOpacity={liqAlpha - 0.05} />
          </radialGradient>
          <filter id="glow-d"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {/* Beaker body */}
        <path d="M55,35 L55,162 Q55,175 70,175 L170,175 Q185,175 185,162 L185,35"
          fill="rgba(147,197,253,0.05)" stroke="rgba(147,197,253,0.3)" strokeWidth="2" />
        <line x1="55" y1="35" x2="40" y2="20" stroke="rgba(147,197,253,0.3)" strokeWidth="2" />
        <line x1="185" y1="35" x2="200" y2="20" stroke="rgba(147,197,253,0.3)" strokeWidth="2" />
        {/* Liquid */}
        <path d="M57,78 L57,164 Q57,173 70,173 L170,173 Q183,173 183,164 L183,78 Z"
          fill={`url(#sl-${exp.id})`} />
        <motion.ellipse cx="120" cy="78" rx="63" ry="4" fill={solutionColor} opacity={liqAlpha * 0.6}
          animate={{ ry: [3.5, 5, 3.5] }} transition={{ duration: 2.5, repeat: Infinity }} />

        {/* Dropper / Pellets */}
        {exp.id === "hcl-water" ? (
          <g>
            <rect x="100" y="2" width="20" height="48" rx="4" fill="rgba(252,165,165,0.12)" stroke="rgba(252,165,165,0.45)" strokeWidth="1.5" />
            <path d="M107,50 L113,50 L112,68 L108,68 Z" fill="rgba(252,165,165,0.25)" stroke="rgba(252,165,165,0.4)" strokeWidth="1" />
            <text x="110" y="30" textAnchor="middle" fill="rgba(252,165,165,0.85)" fontSize="6.5" fontWeight="bold">HCl</text>
            {phase !== "idle" && (
              <motion.circle cx="110" cy="76" r="3.5" fill="rgba(252,165,165,0.75)"
                animate={{ cy: [73, 84], opacity: [1, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeIn" }} />
            )}
          </g>
        ) : (
          <g>
            <rect x="98" y="4" width="24" height="36" rx="4" fill="rgba(196,181,253,0.12)" stroke="rgba(196,181,253,0.45)" strokeWidth="1.5" />
            <text x="110" y="26" textAnchor="middle" fill="rgba(196,181,253,0.85)" fontSize="5.5" fontWeight="bold">NaOH</text>
            {phase !== "idle" && [0, 1, 2].map(i => (
              <motion.circle key={i} cx={104 + i * 6} cy={42} r="3" fill="rgba(196,181,253,0.65)"
                animate={{ cy: [40, 78], opacity: [1, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.55, ease: "easeIn" }} />
            ))}
          </g>
        )}

        {/* pH meter */}
        <g transform="translate(155,52)">
          <rect x="0" y="0" width="28" height="58" rx="4" fill="rgba(15,23,42,0.85)" stroke={solutionColor} strokeWidth="1.2" />
          <text x="14" y="14" textAnchor="middle" fill={solutionColor} fontSize="5.5" fontWeight="bold">pH</text>
          <motion.text x="14" y="36" textAnchor="middle" fontSize="15" fontWeight="bold" animate={{ fill: solutionColor }} transition={{ duration: 0.5 }}>
            {pH}
          </motion.text>
          <line x1="14" y1="58" x2="14" y2="100" stroke={solutionColor} strokeWidth="1.2" strokeDasharray="3,2" />
        </g>

        <text x="120" y="192" textAnchor="middle" fill="rgba(148,163,184,0.55)" fontSize="7.5">{exp.equation}</text>
      </svg>
    );
  }

  /* Neutralization: conical flask + burette */
  return (
    <svg viewBox="0 0 240 210" className="w-full h-full">
      <defs>
        <radialGradient id={`nl-${exp.id}`} cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor={solutionColor} stopOpacity={liqAlpha + 0.15} />
          <stop offset="100%" stopColor={solutionColor} stopOpacity={liqAlpha} />
        </radialGradient>
      </defs>
      {/* Burette */}
      <rect x="90" y="4" width="18" height="82" rx="2" fill="rgba(167,243,208,0.07)" stroke="rgba(167,243,208,0.38)" strokeWidth="1.5" />
      <text x="99" y="48" textAnchor="middle" fill="rgba(167,243,208,0.7)" fontSize="5.5" fontWeight="bold"
        transform="rotate(-90,99,48)">{exp.id === "hcl-naoh" ? "NaOH" : "KOH"}</text>
      <path d="M93,86 L105,86 L103,103 L95,103 Z" fill="rgba(167,243,208,0.1)" stroke="rgba(167,243,208,0.38)" strokeWidth="1" />
      {/* Drip */}
      {phase !== "idle" && (
        <motion.ellipse cx="99" cy="109" rx="2.5" ry="4.5"
          fill={exp.id === "hcl-naoh" ? "rgba(167,139,250,0.8)" : "rgba(134,239,172,0.8)"}
          animate={{ cy: [107, 125], ry: [4.5, 2], opacity: [1, 0] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeIn" }} />
      )}
      {/* Conical flask */}
      <path d="M62,122 L78,176 Q78,186 99,186 Q120,186 122,176 L138,122 Z"
        fill={`url(#nl-${exp.id})`} stroke="rgba(147,197,253,0.3)" strokeWidth="1.5" />
      <line x1="62" y1="122" x2="138" y2="122" stroke="rgba(147,197,253,0.3)" strokeWidth="2" />
      <rect x="84" y="114" width="30" height="9" rx="4" fill="rgba(147,197,253,0.06)" stroke="rgba(147,197,253,0.28)" strokeWidth="1" />
      {/* Heat shimmer */}
      {(phase === "reacting" || phase === "complete") && (
        <motion.ellipse cx="100" cy="155" rx="26" ry="5" fill="rgba(255,255,255,0.04)"
          animate={{ rx: [26, 30, 26], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} />
      )}
      {/* pH meter */}
      <g transform="translate(142,126)">
        <rect x="0" y="0" width="26" height="52" rx="3" fill="rgba(15,23,42,0.88)" stroke={solutionColor} strokeWidth="1.2" />
        <text x="13" y="13" textAnchor="middle" fill={solutionColor} fontSize="5" fontWeight="bold">pH</text>
        <motion.text x="13" y="34" textAnchor="middle" fontSize="14" fontWeight="bold" animate={{ fill: solutionColor }} transition={{ duration: 0.5 }}>
          {pH}
        </motion.text>
        <line x1="13" y1="52" x2="13" y2="80" stroke={solutionColor} strokeWidth="1.2" strokeDasharray="3,2" />
      </g>
      <text x="100" y="200" textAnchor="middle" fill="rgba(148,163,184,0.55)" fontSize="7.5">{exp.equation}</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// ION PANEL
// ═══════════════════════════════════════════════════════════

function IonPanel({ exp, phase }: { exp: Exp; phase: Phase }) {
  const showAfter = phase === "reacting" || phase === "complete";
  const ions = showAfter ? exp.ions.products : exp.ions.reactants;
  const { lang } = useLanguage();
  const isAs = lang === "as";

  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "আয়ন দৃশ্য" : "Ion View"}</span>
        <motion.span className="text-[10px] font-black" animate={{ color: exp.accent }}>{showAfter ? (isAs ? "উৎপাদ" : "Products") : (isAs ? "বিক্ৰিয়াকাৰক" : "Reactants")}</motion.span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={showAfter ? "after" : "before"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          className="flex flex-wrap gap-2 justify-center py-2">
          {ions.map((ion, i) => (
            <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-1">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-[10px] border-2 relative"
                style={{ background: `${ion.col}15`, borderColor: `${ion.col}50`, color: ion.col, boxShadow: `0 0 14px ${ion.col}44` }}>
                <motion.div className="absolute inset-0 rounded-full" animate={{ opacity: [0.15, 0.45, 0.15] }} transition={{ duration: 2.2, repeat: Infinity }}>
                  <div className="w-full h-full rounded-full" style={{ background: `radial-gradient(circle, ${ion.col}25, transparent)` }} />
                </motion.div>
                <span className="relative">{ion.sym}</span>
              </div>
              <span className="text-[7px] text-slate-500 text-center max-w-[48px] leading-tight">{pickLang(ion.desc, lang).split("(")[0].trim()}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {phase !== "idle" && (
        <div className="text-center mt-1">
          <span className="text-[9px] font-mono font-black" style={{ color: exp.accent }}>{exp.ionEquation}</span>
        </div>
      )}
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
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "CBSE কুইজ" : "CBSE Quiz"}</span>
        {submitted && <NeonBadge label={`${score}/${exp.quiz.length}`} color={score === exp.quiz.length ? "#34D399" : exp.accent} />}
      </div>
      <div className="space-y-3">
        {exp.quiz.map((q, qi) => (
          <div key={qi} className="rounded-xl p-2.5 border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <p className="text-xs font-black text-white mb-2">{qi + 1}. {pickLang(q.q, lang)}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {pickLang(q.opts, lang).map((opt, oi) => {
                const selected = answers[qi] === oi;
                const correct = submitted && oi === q.ans;
                const wrong = submitted && selected && oi !== q.ans;
                return (
                  <button key={oi} disabled={submitted}
                    onClick={() => setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                    className="text-left text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all"
                    style={{
                      borderColor: correct ? "#34D399" : wrong ? "#EF4444" : selected ? `${exp.accent}88` : "rgba(255,255,255,0.08)",
                      background: correct ? "rgba(52,211,153,0.12)" : wrong ? "rgba(239,68,68,0.12)" : selected ? `${exp.accent}15` : "rgba(255,255,255,0.02)",
                      color: correct ? "#34D399" : wrong ? "#EF4444" : selected ? exp.accent : "#94a3b8",
                    }}>
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
          className="mt-3 w-full py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-40 hover:opacity-90 transition-all"
          style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
          {isAs ? "উত্তৰ জমা দিয়ক" : "Submit Answers"}
        </button>
      ) : (
        <div className="mt-3 text-center">
          <div className="text-2xl mb-1">{score === exp.quiz.length ? "🎉" : "📚"}</div>
          <p className="text-xs font-black" style={{ color: exp.accent }}>
            {score === exp.quiz.length ? (isAs ? "শাবাশ! পৰীক্ষাৰ বাবে সাজু!" : "Perfect! Exam ready!") : `${score}/${exp.quiz.length} — ${isAs ? "অভ্যাস কৰি থাকক" : "Keep practising"}`}
          </p>
          <button onClick={() => { setAnswers(exp.quiz.map(() => null)); setSubmitted(false); }} className="mt-2 text-[10px] text-slate-400 underline">
            {isAs ? "পুনৰ কুইজ দিয়ক" : "Retry Quiz"}
          </button>
        </div>
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
  const expSafety = pickLang(exp.safety, lang);
  const expObservations = pickLang(exp.observations, lang);
  const expExamNote = pickLang(exp.examNote, lang);
  const expRealWorld = pickLang(exp.realWorld, lang);

  const pIntensity = phase === "reacting" ? 1 : phase === "complete" ? 0.12 : phase !== "idle" ? 0.45 : 0;
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
      const nxt = stepIdx + 1; setStepIdx(nxt);
      setPhase(nxt >= 2 ? "reacting" : `step${nxt + 1}` as Phase);
    } else { setPhase("complete"); setShowQuiz(true); }
  };
  const reset = () => { setPhase("idle"); setStepIdx(0); setShowQuiz(false); };

  const currentPH = exp.phaseData[phase].pH;
  const rxnPct = phase === "complete" ? 100 : phase === "reacting" ? 70 : phase === "step2" ? 35 : phase === "step1" ? 10 : 0;
  const conductivity = exp.type === "dissociation"
    ? rxnPct
    : (phase === "reacting" || phase === "complete" ? 85 : rxnPct * 0.5);
  const phChangePct = Math.round(
    Math.abs(currentPH - exp.phaseData.idle.pH) /
    Math.max(1, Math.abs(exp.phaseData.complete.pH - exp.phaseData.idle.pH)) * 100
  );

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
          <NeonBadge label={exp.type === "dissociation" ? (isAs ? "বিযোজন" : "Dissociation") : (isAs ? "নিৰপেক্ষণ" : "Neutralization")} color={exp.accent} />
        </div>
        <LanguageToggle />
        <button onClick={() => setShowSafety(s => !s)} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><Shield className="w-4 h-4 text-slate-400" /></button>
        <button onClick={reset} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><RotateCcw className="w-4 h-4 text-slate-400" /></button>
      </div>

      {/* Safety banner */}
      <AnimatePresence>
        {showSafety && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 p-3 rounded-xl border shrink-0"
            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-black text-red-300">{isAs ? "সুৰক্ষা সাৱধানতা" : "Safety Precautions"}</span>
              <button onClick={() => setShowSafety(false)} className="ml-auto text-slate-500 text-sm">✕</button>
            </div>
            {expSafety.map((s, i) => <p key={i} className="text-xs text-red-200 mb-0.5">• {s}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* ── Left: Apparatus + Controls + pH ── */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 240 }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            <div className="absolute inset-0 p-3"><ApparatusSVG exp={exp} phase={phase} /></div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen" }} />
            <div className="absolute top-2 right-2">
              <NeonBadge
                label={phase === "idle" ? (isAs ? "সাজু" : "READY") : phase === "reacting" ? (isAs ? "বিক্ৰিয়া" : "REACTING") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "COMPLETE") : `${isAs ? "পদক্ষেপ" : "STEP"} ${stepIdx + 1}`}
                color={phase === "reacting" ? exp.accent : phase === "complete" ? "#34D399" : "#60A5FA"} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {phase === "complete" ? (isAs ? "✅ সম্পূৰ্ণ" : "✅ Complete") : `${isAs ? "পদক্ষেপ" : "Step"} ${stepIdx + 1}/${exp.steps.length}`}
              </span>
              <div className="flex gap-1">
                {exp.steps.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= stepIdx && phase !== "idle" ? exp.accent : "rgba(255,255,255,0.15)" }} />
                ))}
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
                {phase === "idle" ? (isAs ? "পৰীক্ষা আৰম্ভ কৰক" : "Start Experiment") : stepIdx < exp.steps.length - 1 ? pickLang(exp.steps[stepIdx + 1].label, lang) : (isAs ? "সম্পূৰ্ণ কৰক" : "Complete")}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl text-xs font-black border hover:bg-white/5 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />{isAs ? "পুনৰাবৃত্তি" : "Repeat"}
                </button>
                <button onClick={() => setShowQuiz(true)} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
                  {isAs ? "কুইজ দিয়ক" : "Take Quiz"}
                </button>
              </div>
            )}
          </GlassPanel>

          <PhScalePanel pH={currentPH} accent={exp.accent} />
        </div>

        {/* ── Middle: Analysis + Observations ── */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সমীকৰণ" : "Equations"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-sm border mb-2"
              style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>
              {exp.equation}
            </div>
            <div className="rounded-lg px-3 py-2 text-center border"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[9px] text-slate-500 mb-0.5">{isAs ? "নেট আয়নিক" : "Net Ionic"}</p>
              <p className="text-xs font-black text-slate-300">{exp.ionEquation}</p>
            </div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "জীৱন্ত বিশ্লেষণ" : "Live Analysis"}</p>
            <div className="space-y-3">
              <AnimBar label={isAs ? "বিক্ৰিয়াৰ অগ্ৰগতি" : "Reaction Progress"} target={rxnPct} accent={exp.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimBar label={isAs ? "পৰিবাহিতা" : "Conductivity"} target={conductivity} accent="#22D3EE" icon={<Zap className="w-3 h-3" />} />
              <AnimBar label={isAs ? "pH পৰিবৰ্তন" : "pH Change"} target={phChangePct} accent={phToColor(currentPH)} icon={<Activity className="w-3 h-3" />} />
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "ধৰণ" : "Type"} value={exp.type === "dissociation" ? (isAs ? "আয়নিক বিযোজন" : "Ionic Dissociation") : (isAs ? "নিৰপেক্ষণ" : "Neutralization")} color={exp.accent} />
              <DataRow label={isAs ? "সূচক" : "Indicator"} value={pickLang(exp.phaseData[phase].indicator, lang)} color={exp.phaseData[phase].indicatorColor} />
              <DataRow label={isAs ? "বিপদ" : "Hazard"} value={isAs ? (exp.hazard === "HIGH" ? "উচ্চ" : exp.hazard === "MEDIUM" ? "মধ্যম" : "কম") : exp.hazard} color={exp.hazard === "HIGH" ? "#EF4444" : "#FB923C"} />
              <DataRow label={isAs ? "অৱস্থা" : "State"} value={phase === "idle" ? (isAs ? "আৰম্ভ হোৱা নাই" : "Not started") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ ✓" : "Completed ✓") : (isAs ? "চলি আছে" : "In progress")} color={phase === "complete" ? "#34D399" : exp.accent} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-3 flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "পৰ্যবেক্ষণ লগ" : "Observation Log"}</p>
            <div className="space-y-1.5">
              {expObservations.map((obs, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: phase !== "idle" ? 1 : i === 0 ? 0.4 : 0.12, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: phase === "complete" ? `${exp.accent}22` : "rgba(255,255,255,0.05)" }}>
                    {phase === "complete"
                      ? <CheckCircle className="w-3 h-3" style={{ color: exp.accent }} />
                      : <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{obs}</p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* ── Right: Ion Panel + Exam Note + Quiz ── */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <IonPanel exp={exp} phase={phase} />

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
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const hazardLabel = (h: Exp["hazard"]) =>
    isAs ? (h === "HIGH" ? "উচ্চ" : h === "MEDIUM" ? "মধ্যম" : "কম") : h;

  const theoryCards = isAs
    ? [
        { title: "আয়নিক বিযোজন", icon: "⚡", col: "#06B6D4", desc: "আয়নিক যৌগ পানীত মুক্ত আয়নলৈ ভাগ হয়। প্ৰবল ইলেক্ট্ৰ’লাইট সম্পূৰ্ণৰূপে বিযোজিত হয়। মুক্ত আয়নে বৈদ্যুতিক পৰিবাহিতা বঢ়ায়।" },
        { title: "নিৰপেক্ষণ", icon: "⚖️", col: "#10B981", desc: "অম্ল + ক্ষাৰ → লৱণ + পানী। নেট আয়নিক: H⁺ + OH⁻ → H₂O। তাপমোচী। সাম্যাৱস্থা বিন্দুত pH = 7।" },
        { title: "pH স্কেল", icon: "📊", col: "#8B5CF6", desc: "0–14 স্কেল। pH < 7 = অম্ল। pH = 7 = নিৰপেক্ষ। pH > 7 = ক্ষাৰ। প্ৰতিটো একক = 10× ঘনত্ব পৰিবৰ্তন।" },
        { title: "সূচক", icon: "🌡️", col: "#F97316", desc: "ফেনলপথেলিন: বৰ্ণহীন (অম্ল) → গোলাপী (ক্ষাৰ)। মিথাইল কমলা: ৰঙা (অম্ল) → হালধীয়া (ক্ষাৰ)। লিটমাছ: ৰঙা (অম্ল) → নীলা (ক্ষাৰ)।" },
      ]
    : [
        { title: "Ionic Dissociation", icon: "⚡", col: "#06B6D4", desc: "Ionic compounds split into free ions in water. Strong electrolytes dissociate completely. Free ions increase electrical conductivity." },
        { title: "Neutralization", icon: "⚖️", col: "#10B981", desc: "Acid + Base → Salt + Water. Net ionic: H⁺ + OH⁻ → H₂O. Exothermic. pH = 7 at equivalence point." },
        { title: "pH Scale", icon: "📊", col: "#8B5CF6", desc: "0–14 scale. pH < 7 = Acid. pH = 7 = Neutral. pH > 7 = Base. Each unit = 10× concentration change." },
        { title: "Indicators", icon: "🌡️", col: "#F97316", desc: "Phenolphthalein: colourless (acid) → pink (base). Methyl orange: red (acid) → yellow (base). Litmus: red (acid) → blue (base)." },
      ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #0a0f1e 60%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-15 animate-pulse"
            style={{
              width: 2 + (i * 17 % 4), height: 2 + (i * 17 % 4),
              left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 7) % 100}%`,
              background: ["#EF4444","#8B5CF6","#06B6D4","#10B981","#FDE047","#F97316"][i % 6],
              animationDelay: `${i * 0.3}s`, animationDuration: `${2.5 + (i % 3)}s`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 pb-28">
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
            style={{ borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.08)", color: "#06B6D4" }}>
            <Droplets className="w-3.5 h-3.5" /> {isAs ? "আয়নিক বিযোজন আৰু নিৰপেক্ষণ · অধ্যায় ২" : "Ionic Dissociation & Neutralization · Chapter 2"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "আয়নিক বিক্ৰিয়া" : "Ionic Reactions"}<br />
            <span style={{ background: "linear-gradient(135deg, #06B6D4, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isAs ? "ভাৰ্চুৱেল লেব" : "Virtual Lab"}
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs ? "৪টা ক্ৰিয়াশীল পৰীক্ষা — আয়নিক বিযোজন, জীৱন্ত pH অনুসৰণ, নিৰপেক্ষণ দৃশ্যায়ন, আৰু CBSE-ধৰণৰ MCQ মূল্যায়ন।" : "4 interactive experiments — ionic dissociation, live pH tracking, neutralization visualization, and CBSE-style MCQ assessment."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs
              ? [["৪","পৰীক্ষা"],["pH","স্কেল"],["আয়ন","দৃশ্য"],["CBSE","সংযুক্ত"]]
              : [["4","Experiments"],["pH","Scale"],["Ion","View"],["CBSE","Aligned"]]
            ).map(([v, l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* pH scale reference */}
        <div className="mb-8 p-4 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 text-center">{isAs ? "pH স্কেল সন্দৰ্ভ" : "pH Scale Reference"}</p>
          <div className="h-4 rounded-full overflow-hidden mb-1" style={{
            background: "linear-gradient(90deg, #DC2626,#EF4444,#F97316,#FB923C,#F59E0B,#EAB308,#22C55E,#10B981,#06B6D4,#3B82F6,#6366F1,#8B5CF6,#7C3AED,#6D28D9,#5B21B6)",
          }} />
          <div className="flex justify-between px-1">
            {[0,2,4,6,7,8,10,12,14].map(n => <span key={n} className="text-[9px] text-slate-500">{n}</span>)}
          </div>
          <div className="flex justify-between mt-1 text-[9px] font-black px-1">
            <span className="text-red-400">{isAs ? "◀ অম্লীয়" : "◀ ACIDIC"}</span>
            <span className="text-green-400">{isAs ? "নিৰপেক্ষ" : "NEUTRAL"}</span>
            <span className="text-purple-400">{isAs ? "ক্ষাৰীয় ▶" : "ALKALINE ▶"}</span>
          </div>
        </div>

        {/* Experiment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {EXPERIMENTS.map((exp, i) => (
            <motion.button key={exp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
              onClick={() => onSelect(exp)}
              className="group text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 border"
              style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}07` }}>
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${exp.gradFrom}, ${exp.gradTo})` }} />
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})`, boxShadow: `0 0 20px ${exp.glow}` }}>
                    {exp.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <NeonBadge label={`${isAs ? "পৰীক্ষা" : "EXP"} ${exp.num}`} color={exp.accent} />
                      <NeonBadge label={exp.type === "dissociation" ? (isAs ? "বিযোজন" : "Dissociation") : (isAs ? "নিৰপেক্ষণ" : "Neutralization")} color={exp.accent} />
                      <NeonBadge label={hazardLabel(exp.hazard)} color={exp.hazard === "HIGH" ? "#EF4444" : "#FB923C"} />
                    </div>
                    <h3 className="font-black text-white text-sm leading-snug group-hover:opacity-80 transition-all mt-1">{pickLang(exp.title, lang)}</h3>
                    <p className="text-[10px] text-slate-400">{pickLang(exp.subtitle, lang)}</p>
                  </div>
                </div>

                <div className="font-mono text-[10px] rounded-lg px-2 py-1.5 mb-3 border"
                  style={{ borderColor: `${exp.accent}25`, background: `${exp.accent}08`, color: exp.accent }}>
                  {exp.equation}
                </div>

                {/* Animated pH range */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] text-slate-500 shrink-0">pH:</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${phToColor(exp.phaseData.idle.pH)}, ${phToColor(exp.phaseData.complete.pH)})` }}
                      initial={{ width: "20%" }} animate={{ width: "85%" }} transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
                  </div>
                  <span className="text-[9px] font-black shrink-0" style={{ color: exp.accent }}>
                    {exp.phaseData.idle.pH} → {exp.phaseData.complete.pH}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{exp.steps.length} {isAs ? "পদক্ষেপ" : "steps"} · {exp.quiz.length} {isAs ? "প্ৰশ্ন" : "MCQs"}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
                    <span className="text-white text-xs">▶</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Theory reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {theoryCards.map(card => (
            <div key={card.title} className="rounded-xl p-3 border" style={{ background: `${card.col}08`, borderColor: `${card.col}25` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span>{card.icon}</span>
                <p className="text-xs font-black" style={{ color: card.col }}>{card.title}</p>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════

export default function IonicNeutralizationLab() {
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
