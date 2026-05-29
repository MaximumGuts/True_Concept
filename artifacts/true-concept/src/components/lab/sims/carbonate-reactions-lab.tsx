/**
 * Reactions with Metal Carbonates & Hydrogencarbonates Virtual Lab
 * 5 experiments: Na₂CO₃+HCl, NaHCO₃+HCl, Na₂CO₃+CH₃COOH, NaHCO₃+CH₃COOH, CaCO₃+H₂O+CO₂
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";
import {
  ArrowLeft, Shield, RotateCcw, Play, Zap,
  FlaskConical, CheckCircle, Info, AlertTriangle, Wind, Droplets,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ExpId = "na2co3-hcl" | "nahco3-hcl" | "na2co3-acid" | "nahco3-acid" | "caco3-co2";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "co2-vigorous" | "co2-moderate" | "co2-slow" | "co2-foam" | "co2-dissolve" | "none";
type Category = "carbonate-strong" | "hydrogencarbonate-strong" | "carbonate-weak" | "hydrogencarbonate-weak" | "dissolution";
type Intensity = "VIGOROUS" | "HIGH" | "MODERATE" | "LOW";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; blur: number; type: string;
}
interface Ion { sym: string; col: string; desc: BilingualField<string>; }
interface Exp {
  id: ExpId; num: number;
  title: BilingualField<string>;
  subtitle: BilingualField<string>;
  equation: string;
  category: Category;
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  hazard: "LOW" | "MEDIUM" | "HIGH";
  effervescence: Intensity;
  foamForm: boolean;
  limewaterTest: boolean;
  acidType: "strong" | "weak" | "none";
  phaseColors: Record<Phase, string>;
  description: BilingualField<string>;
  realWorld: BilingualField<string>;
  examNote: BilingualField<string>;
  safety: BilingualField<string[]>;
  steps: { label: BilingualField<string>; desc: BilingualField<string> }[];
  ions: { reactants: Ion[]; products: Ion[] };
  observations: BilingualField<string[]>;
  pmode: PMode;
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
}

// ═══════════════════════════════════════════════════════════
// EXPERIMENTS
// ═══════════════════════════════════════════════════════════

const EXPERIMENTS: Exp[] = [
  {
    id: "na2co3-hcl", num: 1,
    title: { en: "Na₂CO₃ + Hydrochloric Acid", as: "Na₂CO₃ + হাইড্ৰ’ক্ল’ৰিক এচিড" },
    subtitle: { en: "Carbonate + Strong Acid → Vigorous CO₂", as: "কাৰ্বনেট + প্ৰবল অম্ল → প্ৰচণ্ড CO₂" },
    equation: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
    category: "carbonate-strong",
    accent: "#3B82F6", glow: "rgba(59,130,246,0.45)", gradFrom: "#1D4ED8", gradTo: "#60A5FA", emoji: "⚗️",
    hazard: "MEDIUM", effervescence: "VIGOROUS", foamForm: true, limewaterTest: true, acidType: "strong",
    phaseColors: {
      idle: "rgba(235,242,250,0.06)", step1: "rgba(235,242,250,0.08)",
      step2: "rgba(235,242,250,0.1)", reacting: "rgba(235,242,250,0.12)", complete: "rgba(235,242,250,0.08)",
    },
    description: {
      en: "Sodium carbonate (Na₂CO₃) reacts vigorously with dilute hydrochloric acid. The carbonate ion (CO₃²⁻) is attacked by H⁺ ions, forming carbonic acid (H₂CO₃) which instantly decomposes to CO₂ and H₂O. The reaction is fast and vigorous with strong acid HCl.",
      as: "ছ’ডিয়াম কাৰ্বনেট (Na₂CO₃)-এ পাতল হাইড্ৰ’ক্ল’ৰিক এচিডৰ সৈতে প্ৰচণ্ডভাৱে বিক্ৰিয়া কৰে। কাৰ্বনেট আয়ন (CO₃²⁻)-ক H⁺ আয়নে আক্ৰমণ কৰি কাৰ্বনিক এচিড (H₂CO₃) গঠন কৰে যি তৎক্ষণাৎ CO₂ আৰু H₂O লৈ বিযোজিত হয়। প্ৰবল অম্ল HCl-ৰ লগত বিক্ৰিয়া দ্ৰুত আৰু প্ৰচণ্ড।",
    },
    realWorld: {
      en: "Antacid tablets · Water softening · Glass manufacturing · Baking powder · pH correction in swimming pools",
      as: "এণ্টাচিড টেবলেট · পানী কোমলকৰণ · কাঁচ প্ৰস্তুতি · বেকিং পাউডাৰ · ছুইমিং পুলত pH সংশোধন",
    },
    examNote: {
      en: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. CO₂ confirms limewater test. STRONG ACID — vigorous reaction. NaCl (common salt) is the salt formed. HCl donates 2 H⁺ for each CO₃²⁻. CBSE: carbonate + acid → salt + water + CO₂.",
      as: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂। চূনপানী পৰীক্ষাই CO₂ নিশ্চিত কৰে। প্ৰবল অম্ল — প্ৰচণ্ড বিক্ৰিয়া। NaCl (সাধাৰণ লৱণ) গঠিত হয়। প্ৰতিটো CO₃²⁻-ৰ বাবে HCl-এ 2 H⁺ দিয়ে। CBSE: কাৰ্বনেট + অম্ল → লৱণ + পানী + CO₂।",
    },
    safety: {
      en: ["HCl is corrosive — wear gloves", "CO₂ in enclosed space — ventilate", "Wear goggles", "Vigorous reaction — use small quantities"],
      as: ["HCl ক্ষয়কাৰক — দস্তানা পিন্ধক", "বন্ধ ঠাইত CO₂ — বায়ু চলাচল কৰক", "চশমা পিন্ধক", "প্ৰচণ্ড বিক্ৰিয়া — সৰু পৰিমাণ ব্যৱহাৰ কৰক"],
    },
    steps: [
      { label: { en: "Add Na₂CO₃ Powder", as: "Na₂CO₃ গুড়ি যোগ কৰক" }, desc: { en: "Place a spatula of white Na₂CO₃ powder into a test tube. Note the white crystalline appearance of sodium carbonate.", as: "এক টেষ্ট টিউবত এক চামুচ বগা Na₂CO₃ গুড়ি ৰাখক। ছ’ডিয়াম কাৰ্বনেটৰ বগা স্ফটিকাকাৰ ৰূপ লক্ষ্য কৰক।" } },
      { label: { en: "Add Dilute HCl", as: "পাতল HCl যোগ কৰক" }, desc: { en: "Slowly add dilute HCl using a dropper. Vigorous effervescence begins immediately — CO₂ bubbles form rapidly.", as: "ড্ৰপাৰৰে লাহে লাহে পাতল HCl যোগ কৰক। তৎক্ষণাৎ প্ৰচণ্ড বুদবুদ আৰম্ভ হয় — CO₂ বুদবুদ দ্ৰুতভাৱে গঠিত হয়।" } },
      { label: { en: "Collect CO₂", as: "CO₂ সংগ্ৰহ কৰক" }, desc: { en: "Attach delivery tube to collect CO₂ gas. Observe rapid bubble flow through the tube. Foam may form at surface.", as: "CO₂ গেছ সংগ্ৰহ কৰিবলৈ পৰিৱহন টিউব লগাওক। টিউবৰ মাজেদি দ্ৰুত বুদবুদ প্ৰবাহ লক্ষ্য কৰক। পৃষ্ঠত ফেনা গঠিত হ’ব পাৰে।" } },
      { label: { en: "Limewater Test", as: "চূনপানী পৰীক্ষা" }, desc: { en: "Bubble CO₂ through limewater. Limewater turns milky — CaCO₃ precipitate confirms CO₂ gas evolved.", as: "চূনপানীৰ মাজেদি CO₂ পাৰ কৰক। চূনপানী গাখীৰৰ দৰে হয় — CaCO₃ অৱক্ষেপে নিৰ্গত CO₂ গেছ নিশ্চিত কৰে।" } },
    ],
    ions: {
      reactants: [
        { sym: "CO₃²⁻", col: "#60A5FA", desc: { en: "Carbonate ion (from Na₂CO₃)", as: "কাৰ্বনেট আয়ন (Na₂CO₃-ৰ পৰা)" } },
        { sym: "H⁺", col: "#F97316", desc: { en: "Hydrogen ions from HCl", as: "HCl-ৰ পৰা হাইড্ৰ’জেন আয়ন" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ions (spectators)", as: "ছ’ডিয়াম আয়ন (দৰ্শক)" } },
      ],
      products: [
        { sym: "CO₂↑", col: "#94A3B8", desc: { en: "Carbon dioxide gas evolved", as: "নিৰ্গত কাৰ্বন ডাইঅক্সাইড গেছ" } },
        { sym: "H₂O", col: "#67E8F9", desc: { en: "Water molecule formed", as: "গঠিত পানী অণু" } },
        { sym: "NaCl", col: "#E2E8F0", desc: { en: "Sodium chloride (salt)", as: "ছ’ডিয়াম ক্ল’ৰাইড (লৱণ)" } },
      ],
    },
    observations: {
      en: ["Vigorous effervescence from Na₂CO₃", "Rapid CO₂ bubble evolution", "Foam formation at liquid surface", "White powder dissolves completely", "Limewater turns milky (CaCO₃↓)", "Colourless NaCl solution remains"],
      as: ["Na₂CO₃-ৰ পৰা প্ৰচণ্ড বুদবুদ", "দ্ৰুত CO₂ বুদবুদ নিৰ্গমন", "তৰলৰ পৃষ্ঠত ফেনা গঠন", "বগা গুড়ি সম্পূৰ্ণৰূপে দ্ৰৱীভূত", "চূনপানী গাখীৰৰ দৰে হয় (CaCO₃↓)", "বৰ্ণহীন NaCl সমাধান থাকে"],
    },
    pmode: "co2-vigorous",
    quiz: [
      { q: { en: "Gas evolved in Na₂CO₃ + HCl reaction:", as: "Na₂CO₃ + HCl বিক্ৰিয়াত নিৰ্গত গেছ:" }, opts: { en: ["H₂", "O₂", "CO₂", "Cl₂"], as: ["H₂", "O₂", "CO₂", "Cl₂"] }, ans: 2 },
      { q: { en: "Limewater turns milky because of:", as: "চূনপানী গাখীৰৰ দৰে হয় কাৰণে:" }, opts: { en: ["NaCl", "H₂O", "CaCO₃↓", "CO₂ dissolving"], as: ["NaCl", "H₂O", "CaCO₃↓", "CO₂ দ্ৰৱীভূত"] }, ans: 2 },
      { q: { en: "Salt formed in Na₂CO₃ + HCl:", as: "Na₂CO₃ + HCl-ত গঠিত লৱণ:" }, opts: { en: ["Na₂SO₄", "NaCl", "NaHCO₃", "NaOH"], as: ["Na₂SO₄", "NaCl", "NaHCO₃", "NaOH"] }, ans: 1 },
      { q: { en: "Number of HCl moles reacting with 1 mole Na₂CO₃:", as: "1 মোল Na₂CO₃-ৰ সৈতে বিক্ৰিয়া কৰা HCl-ৰ মোল সংখ্যা:" }, opts: { en: ["1", "2", "3", "4"], as: ["1", "2", "3", "4"] }, ans: 1 },
      { q: { en: "Why is the reaction vigorous?", as: "বিক্ৰিয়া প্ৰচণ্ড হোৱাৰ কাৰণ?" }, opts: { en: ["Na₂CO₃ is reactive", "HCl is a strong acid", "Temperature is high", "CO₂ is unstable"], as: ["Na₂CO₃ ক্ৰিয়াশীল", "HCl এক প্ৰবল অম্ল", "উষ্ণতা উচ্চ", "CO₂ অস্থিৰ"] }, ans: 1 },
    ],
  },
  {
    id: "nahco3-hcl", num: 2,
    title: { en: "NaHCO₃ + Hydrochloric Acid", as: "NaHCO₃ + হাইড্ৰ’ক্ল’ৰিক এচিড" },
    subtitle: { en: "Hydrogencarbonate + Strong Acid → CO₂", as: "হাইড্ৰ’জেনকাৰ্বনেট + প্ৰবল অম্ল → CO₂" },
    equation: "NaHCO₃ + HCl → NaCl + H₂O + CO₂↑",
    category: "hydrogencarbonate-strong",
    accent: "#06B6D4", glow: "rgba(6,182,212,0.45)", gradFrom: "#0E7490", gradTo: "#22D3EE", emoji: "🧪",
    hazard: "LOW", effervescence: "HIGH", foamForm: false, limewaterTest: true, acidType: "strong",
    phaseColors: {
      idle: "rgba(235,242,250,0.06)", step1: "rgba(235,242,250,0.08)",
      step2: "rgba(235,242,250,0.1)", reacting: "rgba(235,242,250,0.12)", complete: "rgba(235,242,250,0.08)",
    },
    description: {
      en: "Sodium hydrogencarbonate (NaHCO₃, baking soda) reacts with dilute HCl to produce CO₂. Only ONE H⁺ is needed per HCO₃⁻ ion (compared to 2 H⁺ per CO₃²⁻). The reaction is controlled and produces CO₂ efficiently. This is why NaHCO₃ is used in baking.",
      as: "ছ’ডিয়াম হাইড্ৰ’জেনকাৰ্বনেট (NaHCO₃, বেকিং ছ’ডা)-এ পাতল HCl-ৰ সৈতে বিক্ৰিয়া কৰি CO₂ উৎপন্ন কৰে। প্ৰতিটো HCO₃⁻ আয়নৰ বাবে কেৱল এটা H⁺ প্ৰয়োজন (CO₃²⁻-ৰ বাবে 2 H⁺-ৰ তুলনাত)। বিক্ৰিয়া নিয়ন্ত্ৰিত আৰু কাৰ্যকৰীভাৱে CO₂ উৎপন্ন কৰে। সেইবাবে NaHCO₃ বেকিঙত ব্যৱহাৰ হয়।",
    },
    realWorld: {
      en: "Baking soda in cooking · Antacid for heartburn · Fire extinguishers (CO₂ type) · pH neutralization",
      as: "ৰন্ধনত বেকিং ছ’ডা · বুকুজ্বলাৰ বাবে এণ্টাচিড · অগ্নি নিৰ্বাপক (CO₂ ধৰণৰ) · pH নিৰপেক্ষণ",
    },
    examNote: {
      en: "NaHCO₃ + HCl → NaCl + H₂O + CO₂. ONE mole HCl per mole NaHCO₃. Differs from Na₂CO₃ which needs 2 HCl. NaHCO₃ is also called sodium bicarbonate or baking soda. CO₂ confirmed by limewater test. CBSE: hydrogencarbonate + acid → salt + water + CO₂.",
      as: "NaHCO₃ + HCl → NaCl + H₂O + CO₂। প্ৰতি মোল NaHCO₃-ৰ বাবে এক মোল HCl। 2 HCl লাগে এনে Na₂CO₃-ৰ পৰা বেলেগ। NaHCO₃-ক ছ’ডিয়াম বাইকাৰ্বনেট বা বেকিং ছ’ডাও কোৱা হয়। চূনপানী পৰীক্ষাৰে CO₂ নিশ্চিত। CBSE: হাইড্ৰ’জেনকাৰ্বনেট + অম্ল → লৱণ + পানী + CO₂।",
    },
    safety: {
      en: ["HCl is corrosive", "Wear gloves and goggles", "Good ventilation for CO₂", "Keep away from face"],
      as: ["HCl ক্ষয়কাৰক", "দস্তানা আৰু চশমা পিন্ধক", "CO₂-ৰ বাবে ভাল বায়ু চলাচল", "মুখৰ পৰা আঁতৰত ৰাখক"],
    },
    steps: [
      { label: { en: "Add NaHCO₃ Powder", as: "NaHCO₃ গুড়ি যোগ কৰক" }, desc: { en: "Place baking soda (NaHCO₃) in a test tube. Observe white fine powder — commonly found in kitchens.", as: "এক টেষ্ট টিউবত বেকিং ছ’ডা (NaHCO₃) ৰাখক। বগা মিহি গুড়ি লক্ষ্য কৰক — সাধাৰণতে ৰান্নাঘৰত পোৱা যায়।" } },
      { label: { en: "Add Dilute HCl", as: "পাতল HCl যোগ কৰক" }, desc: { en: "Add HCl dropwise. Controlled but vigorous bubbling begins — CO₂ evolution is rapid with strong acid.", as: "HCl টোপালে টোপালে যোগ কৰক। নিয়ন্ত্ৰিত কিন্তু প্ৰচণ্ড বুদবুদ আৰম্ভ হয় — প্ৰবল অম্লৰ লগত CO₂ নিৰ্গমন দ্ৰুত।" } },
      { label: { en: "Observe Gas", as: "গেছ লক্ষ্য কৰক" }, desc: { en: "CO₂ escapes steadily. Less foam than Na₂CO₃ reaction. Collect gas through delivery tube.", as: "CO₂ স্থিৰভাৱে নিৰ্গত হয়। Na₂CO₃ বিক্ৰিয়াতকৈ কম ফেনা। পৰিৱহন টিউবৰে গেছ সংগ্ৰহ কৰক।" } },
      { label: { en: "Limewater Confirmation", as: "চূনপানী নিশ্চিতকৰণ" }, desc: { en: "Bubble collected CO₂ through limewater. Milky precipitate (CaCO₃) confirms CO₂ gas.", as: "সংগৃহীত CO₂ চূনপানীৰ মাজেদি পাৰ কৰক। গাখীৰৰ দৰে অৱক্ষেপ (CaCO₃)-এ CO₂ গেছ নিশ্চিত কৰে।" } },
    ],
    ions: {
      reactants: [
        { sym: "HCO₃⁻", col: "#22D3EE", desc: { en: "Hydrogencarbonate ion", as: "হাইড্ৰ’জেনকাৰ্বনেট আয়ন" } },
        { sym: "H⁺", col: "#F97316", desc: { en: "Hydrogen from HCl", as: "HCl-ৰ পৰা হাইড্ৰ’জেন" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ion (spectator)", as: "ছ’ডিয়াম আয়ন (দৰ্শক)" } },
      ],
      products: [
        { sym: "CO₂↑", col: "#94A3B8", desc: { en: "Carbon dioxide gas", as: "কাৰ্বন ডাইঅক্সাইড গেছ" } },
        { sym: "H₂O", col: "#67E8F9", desc: { en: "Water formed", as: "গঠিত পানী" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium in NaCl solution", as: "NaCl সমাধানত ছ’ডিয়াম" } },
        { sym: "Cl⁻", col: "#67E8F9", desc: { en: "Chloride ion", as: "ক্ল’ৰাইড আয়ন" } },
      ],
    },
    observations: {
      en: ["Controlled steady effervescence", "CO₂ bubbles from NaHCO₃", "Less foam than Na₂CO₃", "White powder dissolves completely", "Limewater turns milky", "Colourless NaCl solution remains"],
      as: ["নিয়ন্ত্ৰিত স্থিৰ বুদবুদ", "NaHCO₃-ৰ পৰা CO₂ বুদবুদ", "Na₂CO₃-তকৈ কম ফেনা", "বগা গুড়ি সম্পূৰ্ণৰূপে দ্ৰৱীভূত", "চূনপানী গাখীৰৰ দৰে হয়", "বৰ্ণহীন NaCl সমাধান থাকে"],
    },
    pmode: "co2-moderate",
    quiz: [
      { q: { en: "NaHCO₃ is commonly called:", as: "NaHCO₃-ক সাধাৰণতে কোৱা হয়:" }, opts: { en: ["Washing soda", "Baking soda", "Caustic soda", "Bleaching powder"], as: ["ৱাশিং ছ’ডা", "বেকিং ছ’ডা", "ক’ষ্টিক ছ’ডা", "ব্লিচিং পাউডাৰ"] }, ans: 1 },
      { q: { en: "Gas evolved in NaHCO₃ + HCl:", as: "NaHCO₃ + HCl-ত নিৰ্গত গেছ:" }, opts: { en: ["H₂", "CO₂", "O₂", "HCl gas"], as: ["H₂", "CO₂", "O₂", "HCl গেছ"] }, ans: 1 },
      { q: { en: "Moles of HCl needed per mole NaHCO₃:", as: "প্ৰতি মোল NaHCO₃-ৰ বাবে প্ৰয়োজনীয় HCl-ৰ মোল:" }, opts: { en: ["2", "3", "1", "0.5"], as: ["2", "3", "1", "0.5"] }, ans: 2 },
      { q: { en: "NaHCO₃ + HCl produces which salt?", as: "NaHCO₃ + HCl-এ কি লৱণ উৎপন্ন কৰে?" }, opts: { en: ["Na₂CO₃", "NaCl", "NaHCl", "NaOH"], as: ["Na₂CO₃", "NaCl", "NaHCl", "NaOH"] }, ans: 1 },
      { q: { en: "What confirms CO₂ gas in the limewater test?", as: "চূনপানী পৰীক্ষাত CO₂ গেছ কিহে নিশ্চিত কৰে?" }, opts: { en: ["Blue colour", "Red litmus", "Milky precipitate", "Gas ignites"], as: ["নীলা ৰং", "ৰঙা লিটমাছ", "গাখীৰৰ দৰে অৱক্ষেপ", "গেছ জ্বলে"] }, ans: 2 },
    ],
  },
  {
    id: "na2co3-acid", num: 3,
    title: { en: "Na₂CO₃ + Ethanoic Acid", as: "Na₂CO₃ + এথেনইক এচিড" },
    subtitle: { en: "Carbonate + Weak Acid → Slower CO₂", as: "কাৰ্বনেট + দুৰ্বল অম্ল → লেহেমীয়া CO₂" },
    equation: "Na₂CO₃ + 2CH₃COOH → 2CH₃COONa + H₂O + CO₂↑",
    category: "carbonate-weak",
    accent: "#F59E0B", glow: "rgba(245,158,11,0.45)", gradFrom: "#B45309", gradTo: "#FCD34D", emoji: "🟡",
    hazard: "LOW", effervescence: "MODERATE", foamForm: false, limewaterTest: true, acidType: "weak",
    phaseColors: {
      idle: "rgba(255,230,150,0.08)", step1: "rgba(255,225,120,0.15)",
      step2: "rgba(255,220,100,0.25)", reacting: "rgba(252,211,77,0.35)", complete: "rgba(245,200,80,0.3)",
    },
    description: {
      en: "Ethanoic acid (CH₃COOH, vinegar) is a WEAK acid. It reacts with Na₂CO₃ to produce sodium acetate (CH₃COONa), water and CO₂. The reaction is SLOWER than with HCl because ethanoic acid only partially ionises — fewer H⁺ ions available to attack CO₃²⁻. This is a classic strong vs weak acid comparison.",
      as: "এথেনইক এচিড (CH₃COOH, ভিনেগাৰ) এক দুৰ্বল অম্ল। ই Na₂CO₃-ৰ সৈতে বিক্ৰিয়া কৰি ছ’ডিয়াম এচিটেট (CH₃COONa), পানী আৰু CO₂ উৎপন্ন কৰে। HCl-ৰ লগৰ তুলনাত বিক্ৰিয়া লেহেমীয়া কাৰণ এথেনইক এচিড কেৱল আংশিকভাৱে আয়নিত হয় — CO₃²⁻ আক্ৰমণ কৰিবলৈ কম H⁺ আয়ন উপলব্ধ। ই প্ৰবল বনাম দুৰ্বল অম্লৰ এক প্ৰথাগত তুলনা।",
    },
    realWorld: {
      en: "Vinegar (ethanoic acid) in cooking · Sodium acetate in food preservative (E262) · Hot ice hand warmers · Textile dyeing",
      as: "ৰন্ধনত ভিনেগাৰ (এথেনইক এচিড) · খাদ্য সংৰক্ষকত ছ’ডিয়াম এচিটেট (E262) · গৰম বৰফ হাত উষ্ণতা · বস্ত্ৰ ৰঞ্জনকৰণ",
    },
    examNote: {
      en: "Ethanoic acid is a WEAK ACID (partial ionisation). Reaction SLOWER than HCl. Same products: salt + water + CO₂. Salt formed: CH₃COONa (sodium ethanoate/acetate). CBSE: weak acid gives slower reaction but same products. Compare with HCl reaction.",
      as: "এথেনইক এচিড এক দুৰ্বল অম্ল (আংশিক আয়নীকৰণ)। HCl-তকৈ বিক্ৰিয়া লেহেমীয়া। একে উৎপাদ: লৱণ + পানী + CO₂। গঠিত লৱণ: CH₃COONa (ছ’ডিয়াম এথেনইট/এচিটেট)। CBSE: দুৰ্বল অম্লে লেহেমীয়া বিক্ৰিয়া দিয়ে কিন্তু একে উৎপাদ। HCl বিক্ৰিয়াৰ সৈতে তুলনা কৰক।",
    },
    safety: {
      en: ["Ethanoic acid is mildly corrosive", "CO₂ evolved — ventilate", "Avoid contact with eyes", "Low hazard — safe for demonstration"],
      as: ["এথেনইক এচিড মৃদু ক্ষয়কাৰক", "CO₂ নিৰ্গত — বায়ু চলাচল কৰক", "চকুৰ স্পৰ্শ এৰক", "কম বিপদ — প্ৰদৰ্শনৰ বাবে সুৰক্ষিত"],
    },
    steps: [
      { label: { en: "Add Na₂CO₃ Powder", as: "Na₂CO₃ গুড়ি যোগ কৰক" }, desc: { en: "Add Na₂CO₃ to a test tube. Compare to experiment 1 — same reactant, different acid.", as: "এক টেষ্ট টিউবত Na₂CO₃ যোগ কৰক। পৰীক্ষা 1-ৰ সৈতে তুলনা কৰক — একে বিক্ৰিয়াকাৰক, বেলেগ এচিড।" } },
      { label: { en: "Add Ethanoic Acid", as: "এথেনইক এচিড যোগ কৰক" }, desc: { en: "Add ethanoic acid (vinegar) to Na₂CO₃. Moderate bubbling — slower than HCl reaction.", as: "Na₂CO₃-ত এথেনইক এচিড (ভিনেগাৰ) যোগ কৰক। মধ্যম বুদবুদ — HCl বিক্ৰিয়াতকৈ লেহেমীয়া।" } },
      { label: { en: "Observe Rate Difference", as: "হাৰৰ পাৰ্থক্য লক্ষ্য কৰক" }, desc: { en: "Bubbling is moderate and controlled. COMPARE: this is slower than Na₂CO₃+HCl because ethanoic acid is a weak acid.", as: "বুদবুদ মধ্যম আৰু নিয়ন্ত্ৰিত। তুলনা: এথেনইক এচিড এক দুৰ্বল অম্ল হোৱাৰ বাবে ই Na₂CO₃+HCl-তকৈ লেহেমীয়া।" } },
      { label: { en: "Confirm CO₂", as: "CO₂ নিশ্চিত কৰক" }, desc: { en: "Test evolved gas with limewater. Milky precipitate confirms CO₂ despite the slower reaction rate.", as: "নিৰ্গত গেছ চূনপানীৰে পৰীক্ষা কৰক। লেহেমীয়া বিক্ৰিয়া হাৰ স্বত্ত্বেও গাখীৰৰ দৰে অৱক্ষেপে CO₂ নিশ্চিত কৰে।" } },
    ],
    ions: {
      reactants: [
        { sym: "CO₃²⁻", col: "#FCD34D", desc: { en: "Carbonate ion", as: "কাৰ্বনেট আয়ন" } },
        { sym: "CH₃COOH", col: "#F59E0B", desc: { en: "Ethanoic acid (weak, partial)", as: "এথেনইক এচিড (দুৰ্বল, আংশিক)" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ion", as: "ছ’ডিয়াম আয়ন" } },
      ],
      products: [
        { sym: "CH₃COO⁻", col: "#F59E0B", desc: { en: "Acetate/ethanoate ion", as: "এচিটেট/এথেনইট আয়ন" } },
        { sym: "CO₂↑", col: "#94A3B8", desc: { en: "Carbon dioxide gas", as: "কাৰ্বন ডাইঅক্সাইড গেছ" } },
        { sym: "H₂O", col: "#67E8F9", desc: { en: "Water formed", as: "গঠিত পানী" } },
      ],
    },
    observations: {
      en: ["Moderate effervescence (slower than HCl)", "CO₂ bubbles evolve steadily", "Reaction notably slower than Exp 1", "Vinegar smell of ethanoic acid", "Na₂CO₃ dissolves gradually", "Limewater turns milky — CO₂ confirmed"],
      as: ["মধ্যম বুদবুদ (HCl-তকৈ লেহেমীয়া)", "CO₂ বুদবুদ স্থিৰভাৱে নিৰ্গত হয়", "বিক্ৰিয়া পৰীক্ষা 1-তকৈ লক্ষণীয়ভাৱে লেহেমীয়া", "এথেনইক এচিডৰ ভিনেগাৰ গন্ধ", "Na₂CO₃ ক্ৰমে দ্ৰৱীভূত হয়", "চূনপানী গাখীৰৰ দৰে হয় — CO₂ নিশ্চিত"],
    },
    pmode: "co2-slow",
    quiz: [
      { q: { en: "Why is the reaction slower with ethanoic acid vs HCl?", as: "HCl-ৰ সৈতে তুলনাত এথেনইক এচিডৰ বিক্ৰিয়া কিয় লেহেমীয়া?" }, opts: { en: ["Temperature difference", "Ethanoic acid is weak (partial ionisation)", "CO₃²⁻ is less reactive", "Na₂CO₃ is different"], as: ["উষ্ণতাৰ পাৰ্থক্য", "এথেনইক এচিড দুৰ্বল (আংশিক আয়নীকৰণ)", "CO₃²⁻ কম ক্ৰিয়াশীল", "Na₂CO₃ বেলেগ"] }, ans: 1 },
      { q: { en: "Salt formed in Na₂CO₃ + CH₃COOH:", as: "Na₂CO₃ + CH₃COOH-ত গঠিত লৱণ:" }, opts: { en: ["NaCl", "Na₂SO₄", "CH₃COONa", "NaHCO₃"], as: ["NaCl", "Na₂SO₄", "CH₃COONa", "NaHCO₃"] }, ans: 2 },
      { q: { en: "Ethanoic acid is classified as:", as: "এথেনইক এচিড শ্ৰেণীভুক্ত:" }, opts: { en: ["Strong acid", "Weak acid", "Neutral", "Base"], as: ["প্ৰবল অম্ল", "দুৰ্বল অম্ল", "নিৰপেক্ষ", "ক্ষাৰ"] }, ans: 1 },
      { q: { en: "Gas evolved in this reaction:", as: "এই বিক্ৰিয়াত নিৰ্গত গেছ:" }, opts: { en: ["H₂", "O₂", "SO₂", "CO₂"], as: ["H₂", "O₂", "SO₂", "CO₂"] }, ans: 3 },
      { q: { en: "Common name for ethanoic acid:", as: "এথেনইক এচিডৰ সাধাৰণ নাম:" }, opts: { en: ["Citric acid", "Vinegar / Acetic acid", "Tartaric acid", "Lactic acid"], as: ["চিট্ৰিক এচিড", "ভিনেগাৰ / এচেটিক এচিড", "টাৰ্টাৰিক এচিড", "লেক্টিক এচিড"] }, ans: 1 },
    ],
  },
  {
    id: "nahco3-acid", num: 4,
    title: { en: "NaHCO₃ + Ethanoic Acid", as: "NaHCO₃ + এথেনইক এচিড" },
    subtitle: { en: "Vinegar + Baking Soda — Volcano Effect", as: "ভিনেগাৰ + বেকিং ছ’ডা — আগ্নেয়গিৰি প্ৰভাৱ" },
    equation: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑",
    category: "hydrogencarbonate-weak",
    accent: "#10B981", glow: "rgba(16,185,129,0.45)", gradFrom: "#065F46", gradTo: "#34D399", emoji: "🌋",
    hazard: "LOW", effervescence: "HIGH", foamForm: true, limewaterTest: true, acidType: "weak",
    phaseColors: {
      idle: "rgba(200,255,220,0.1)", step1: "rgba(180,255,210,0.2)",
      step2: "rgba(160,255,200,0.35)", reacting: "rgba(52,211,153,0.5)", complete: "rgba(16,185,129,0.38)",
    },
    description: {
      en: "Baking soda (NaHCO₃) reacts with vinegar (ethanoic acid) to produce a spectacular foam eruption — the famous 'volcano' experiment. CO₂ is rapidly released, trapped in the liquid, forming expanding foam. Despite ethanoic acid being weak, the single H⁺ needed per HCO₃⁻ makes this reaction noticeably active.",
      as: "বেকিং ছ’ডা (NaHCO₃)-এ ভিনেগাৰ (এথেনইক এচিড)-ৰ সৈতে বিক্ৰিয়া কৰি এক চমৎকাৰ ফেনাৰ বিস্ফোৰণ উৎপন্ন কৰে — বিখ্যাত ‘আগ্নেয়গিৰি’ পৰীক্ষা। CO₂ দ্ৰুতভাৱে মুক্ত হয়, তৰলত আবদ্ধ হৈ বৰ্ধমান ফেনা গঠন কৰে। এথেনইক এচিড দুৰ্বল হোৱা স্বত্ত্বেও, প্ৰতিটো HCO₃⁻-ৰ বাবে একক H⁺ প্ৰয়োজন হোৱাৰ বাবে এই বিক্ৰিয়া লক্ষণীয়ভাৱে সক্ৰিয়।",
    },
    realWorld: {
      en: "Science volcano experiments · Baking leavening agent · Natural antacid · Cleaning agent (baking soda + vinegar) · CO₂ fire extinguisher principle",
      as: "বিজ্ঞান আগ্নেয়গিৰি পৰীক্ষা · বেকিং লেভেনিং এজেণ্ট · প্ৰাকৃতিক এণ্টাচিড · চাফাই এজেণ্ট (বেকিং ছ’ডা + ভিনেগাৰ) · CO₂ অগ্নি নিৰ্বাপক নীতি",
    },
    examNote: {
      en: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. Salt is sodium ethanoate (CH₃COONa). Foam forms because CO₂ is trapped in liquid. CBSE: this is the household baking soda + vinegar reaction. Weak acid but HCO₃⁻ needs only 1 H⁺ so reaction is notable.",
      as: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂। লৱণ হ’ল ছ’ডিয়াম এথেনইট (CH₃COONa)। CO₂ তৰলত আবদ্ধ হোৱাৰ বাবে ফেনা গঠিত হয়। CBSE: এইটো ঘৰুৱা বেকিং ছ’ডা + ভিনেগাৰ বিক্ৰিয়া। দুৰ্বল অম্ল কিন্তু HCO₃⁻-ৰ বাবে কেৱল 1 H⁺ প্ৰয়োজন গতিকে বিক্ৰিয়া লক্ষণীয়।",
    },
    safety: {
      en: ["Low hazard — safe for classroom", "CO₂ evolved — ventilate", "Foam may overflow — use large container", "Keep away from eyes"],
      as: ["কম বিপদ — শ্ৰেণীকোঠাৰ বাবে সুৰক্ষিত", "CO₂ নিৰ্গত — বায়ু চলাচল কৰক", "ফেনা পৰি যাব পাৰে — ডাঙৰ পাত্ৰ ব্যৱহাৰ কৰক", "চকুৰ পৰা আঁতৰত ৰাখক"],
    },
    steps: [
      { label: { en: "Add NaHCO₃ Powder", as: "NaHCO₃ গুড়ি যোগ কৰক" }, desc: { en: "Add baking soda to a large beaker. Use a larger container than needed — foam will expand significantly.", as: "এক ডাঙৰ বিকাৰত বেকিং ছ’ডা যোগ কৰক। প্ৰয়োজনতকৈ ডাঙৰ পাত্ৰ ব্যৱহাৰ কৰক — ফেনা যথেষ্ট বিস্তৃত হ’ব।" } },
      { label: { en: "Add Ethanoic Acid (Vinegar)", as: "এথেনইক এচিড (ভিনেগাৰ) যোগ কৰক" }, desc: { en: "Pour vinegar over baking soda. Immediate and vigorous foamy reaction begins — classic volcano effect.", as: "বেকিং ছ’ডাৰ ওপৰত ভিনেগাৰ ঢালক। তৎক্ষণাৎ আৰু প্ৰচণ্ড ফেনিল বিক্ৰিয়া আৰম্ভ হয় — প্ৰথাগত আগ্নেয়গিৰি প্ৰভাৱ।" } },
      { label: { en: "Observe Foam Expansion", as: "ফেনা বিস্তাৰ লক্ষ্য কৰক" }, desc: { en: "Foam expands rapidly as CO₂ gets trapped. Gas bubbles in the liquid create frothy white foam. Visual display.", as: "CO₂ আবদ্ধ হোৱাৰ লগে লগে ফেনা দ্ৰুতভাৱে বিস্তৃত হয়। তৰলত গেছ বুদবুদে বগা ফেনিল মাছ সৃষ্টি কৰে। দৃশ্যমান প্ৰদৰ্শন।" } },
      { label: { en: "Gas Collection & Test", as: "গেছ সংগ্ৰহ আৰু পৰীক্ষা" }, desc: { en: "Collect CO₂ from foam. Bubble through limewater — milky precipitate confirms CO₂ gas release.", as: "ফেনাৰ পৰা CO₂ সংগ্ৰহ কৰক। চূনপানীৰ মাজেদি পাৰ কৰক — গাখীৰৰ দৰে অৱক্ষেপে CO₂ গেছ নিৰ্গমন নিশ্চিত কৰে।" } },
    ],
    ions: {
      reactants: [
        { sym: "HCO₃⁻", col: "#34D399", desc: { en: "Hydrogencarbonate ion", as: "হাইড্ৰ’জেনকাৰ্বনেট আয়ন" } },
        { sym: "CH₃COOH", col: "#F59E0B", desc: { en: "Ethanoic acid (vinegar)", as: "এথেনইক এচিড (ভিনেগাৰ)" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ion", as: "ছ’ডিয়াম আয়ন" } },
      ],
      products: [
        { sym: "CH₃COO⁻", col: "#F59E0B", desc: { en: "Acetate ion (in CH₃COONa)", as: "এচিটেট আয়ন (CH₃COONa-ত)" } },
        { sym: "CO₂↑", col: "#94A3B8", desc: { en: "Carbon dioxide — causes foam", as: "কাৰ্বন ডাইঅক্সাইড — ফেনাৰ কাৰণ" } },
        { sym: "H₂O", col: "#67E8F9", desc: { en: "Water formed", as: "গঠিত পানী" } },
      ],
    },
    observations: {
      en: ["Immediate vigorous foam formation", "Rapid CO₂ bubble evolution", "Foam expands dramatically (volcano)", "CO₂ trapped in foam bubbles", "White frothy mass forms", "Limewater confirms CO₂"],
      as: ["তৎক্ষণাৎ প্ৰচণ্ড ফেনা গঠন", "দ্ৰুত CO₂ বুদবুদ নিৰ্গমন", "ফেনা নাটকীয়ভাৱে বিস্তৃত হয় (আগ্নেয়গিৰি)", "ফেনা বুদবুদত CO₂ আবদ্ধ", "বগা ফেনিল মাছ গঠিত হয়", "চূনপানীয়ে CO₂ নিশ্চিত কৰে"],
    },
    pmode: "co2-foam",
    quiz: [
      { q: { en: "Common household substances in this experiment:", as: "এই পৰীক্ষাত সাধাৰণ ঘৰুৱা পদাৰ্থ:" }, opts: { en: ["Salt + water", "Baking soda + vinegar", "Sugar + lemon", "Chalk + water"], as: ["লৱণ + পানী", "বেকিং ছ’ডা + ভিনেগাৰ", "চেনি + নেমু", "খৰি + পানী"] }, ans: 1 },
      { q: { en: "Why does foam form in this reaction?", as: "এই বিক্ৰিয়াত ফেনা কিয় গঠিত হয়?" }, opts: { en: ["NaHCO₃ is foamy", "CO₂ gas trapped in liquid", "Vinegar is foamy", "Temperature rises"], as: ["NaHCO₃ ফেনিল", "তৰলত CO₂ গেছ আবদ্ধ", "ভিনেগাৰ ফেনিল", "উষ্ণতা বাঢ়ে"] }, ans: 1 },
      { q: { en: "Gas released in this reaction:", as: "এই বিক্ৰিয়াত মুক্ত গেছ:" }, opts: { en: ["H₂", "O₂", "CO₂", "N₂"], as: ["H₂", "O₂", "CO₂", "N₂"] }, ans: 2 },
      { q: { en: "Salt formed: NaHCO₃ + CH₃COOH:", as: "গঠিত লৱণ: NaHCO₃ + CH₃COOH:" }, opts: { en: ["NaCl", "Na₂CO₃", "CH₃COONa", "NaHCl"], as: ["NaCl", "Na₂CO₃", "CH₃COONa", "NaHCl"] }, ans: 2 },
      { q: { en: "This reaction is the basis of:", as: "এই বিক্ৰিয়া কাৰ ভিত্তি?" }, opts: { en: ["Metal refining", "Baking/leavening in cooking", "Water purification", "Glass making"], as: ["ধাতু পৰিশোধন", "ৰন্ধনত বেকিং/লেভেনিং", "পানী শুদ্ধিকৰণ", "কাঁচ প্ৰস্তুতি"] }, ans: 1 },
    ],
  },
  {
    id: "caco3-co2", num: 5,
    title: { en: "CaCO₃ + H₂O + CO₂", as: "CaCO₃ + H₂O + CO₂" },
    subtitle: { en: "Limestone Dissolution — Water Hardness", as: "চূনশিল দ্ৰৱণ — পানীৰ কঠিনতা" },
    equation: "CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂",
    category: "dissolution",
    accent: "#8B5CF6", glow: "rgba(139,92,246,0.45)", gradFrom: "#7C3AED", gradTo: "#A78BFA", emoji: "🪨",
    hazard: "LOW", effervescence: "LOW", foamForm: false, limewaterTest: false, acidType: "none",
    phaseColors: {
      idle: "rgba(220,220,220,0.35)", step1: "rgba(200,210,230,0.35)",
      step2: "rgba(180,200,240,0.3)", reacting: "rgba(160,190,240,0.25)", complete: "rgba(200,220,255,0.15)",
    },
    description: {
      en: "Calcium carbonate (chalk/limestone) normally does not dissolve in pure water. But when CO₂ is dissolved, it forms carbonic acid which reacts with CaCO₃ to form calcium hydrogencarbonate (Ca(HCO₃)₂) — which is soluble. This is responsible for TEMPORARY HARDNESS of water and cave/stalactite formation.",
      as: "কেলচিয়াম কাৰ্বনেট (খৰি/চূনশিল) সাধাৰণতে শুদ্ধ পানীত দ্ৰৱীভূত নহয়। কিন্তু CO₂ দ্ৰৱীভূত হ’লে কাৰ্বনিক এচিড গঠন কৰে যি CaCO₃-ৰ সৈতে বিক্ৰিয়া কৰি কেলচিয়াম হাইড্ৰ’জেনকাৰ্বনেট (Ca(HCO₃)₂) গঠন কৰে — যিটো দ্ৰৱণীয়। ই পানীৰ অস্থায়ী কঠিনতা আৰু গুহা/ষ্টেলেক্টাইট গঠনৰ বাবে দায়ী।",
    },
    realWorld: {
      en: "Temporary hardness of water · Stalactite and stalagmite formation in caves · Karst landscape formation · Carbon cycle in nature · Limestone cave erosion",
      as: "পানীৰ অস্থায়ী কঠিনতা · গুহাত ষ্টেলেক্টাইট আৰু ষ্টেলেগমাইট গঠন · কাৰ্ষ্ট ভূদৃশ্য গঠন · প্ৰকৃতিত কাৰ্বন চক্ৰ · চূনশিল গুহা ক্ষয়",
    },
    examNote: {
      en: "CaCO₃ is insoluble alone but dissolves in CO₂+H₂O. Ca(HCO₃)₂ is soluble (temporary hardness). Heating Ca(HCO₃)₂ reverses: Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂ (removes temporary hardness). CBSE: important for water chemistry and geochemistry.",
      as: "CaCO₃ অকলে অদ্ৰৱণীয় কিন্তু CO₂+H₂O-ত দ্ৰৱীভূত হয়। Ca(HCO₃)₂ দ্ৰৱণীয় (অস্থায়ী কঠিনতা)। Ca(HCO₃)₂ উত্তপ্ত কৰিলে উলটি যায়: Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂ (অস্থায়ী কঠিনতা আঁতৰায়)। CBSE: পানী ৰসায়ন আৰু ভূ-ৰসায়নৰ বাবে গুৰুত্বপূৰ্ণ।",
    },
    safety: {
      en: ["Very low hazard", "CO₂ in large amounts — ventilate", "CaCO₃ dust may irritate lungs", "Use goggles as precaution"],
      as: ["অতি কম বিপদ", "অধিক পৰিমাণৰ CO₂ — বায়ু চলাচল কৰক", "CaCO₃ ধূলিয়ে হাঁওফাঁওত জ্বলন কৰিব পাৰে", "সাৱধানতা হিচাপে চশমা ব্যৱহাৰ কৰক"],
    },
    steps: [
      { label: { en: "Add CaCO₃ + Water", as: "CaCO₃ + পানী যোগ কৰক" }, desc: { en: "Add calcium carbonate (chalk) to a flask of water. Observe: CaCO₃ does NOT dissolve in pure water — it remains as white solid.", as: "এক পানী ভৰা ফ্লাস্কত কেলচিয়াম কাৰ্বনেট (খৰি) যোগ কৰক। লক্ষ্য কৰক: CaCO₃ শুদ্ধ পানীত দ্ৰৱীভূত নহয় — ই বগা কঠিন হিচাপে থাকে।" } },
      { label: { en: "Bubble CO₂ Through", as: "CO₂ পাৰ কৰক" }, desc: { en: "Pass CO₂ gas through the water-CaCO₃ mixture. CO₂ dissolves forming carbonic acid (H₂CO₃).", as: "পানী-CaCO₃ মিশ্ৰণৰ মাজেদি CO₂ গেছ পাৰ কৰক। CO₂ দ্ৰৱীভূত হৈ কাৰ্বনিক এচিড (H₂CO₃) গঠন কৰে।" } },
      { label: { en: "Observe Dissolution", as: "দ্ৰৱণ লক্ষ্য কৰক" }, desc: { en: "H₂CO₃ reacts with CaCO₃. White solid GRADUALLY DISSOLVES. Solution becomes clear — Ca(HCO₃)₂ is soluble.", as: "H₂CO₃-এ CaCO₃-ৰ সৈতে বিক্ৰিয়া কৰে। বগা কঠিন ক্ৰমে দ্ৰৱীভূত হয়। সমাধান স্বচ্ছ হয় — Ca(HCO₃)₂ দ্ৰৱণীয়।" } },
      { label: { en: "Confirm & Conclude", as: "নিশ্চিত আৰু সমাপ্ত কৰক" }, desc: { en: "Clear solution confirms Ca(HCO₃)₂ formation. This is TEMPORARY HARDNESS of water. Heat will re-precipitate CaCO₃.", as: "স্বচ্ছ সমাধানে Ca(HCO₃)₂ গঠন নিশ্চিত কৰে। ই পানীৰ অস্থায়ী কঠিনতা। তাপে CaCO₃ পুনৰ অৱক্ষেপিত কৰিব।" } },
    ],
    ions: {
      reactants: [
        { sym: "CaCO₃", col: "#E2E8F0", desc: { en: "Calcium carbonate (solid)", as: "কেলচিয়াম কাৰ্বনেট (কঠিন)" } },
        { sym: "CO₂", col: "#94A3B8", desc: { en: "Carbon dioxide gas", as: "কাৰ্বন ডাইঅক্সাইড গেছ" } },
        { sym: "H₂O", col: "#67E8F9", desc: { en: "Water molecules", as: "পানী অণু" } },
      ],
      products: [
        { sym: "Ca²⁺", col: "#A78BFA", desc: { en: "Calcium ion (in solution)", as: "কেলচিয়াম আয়ন (সমাধানত)" } },
        { sym: "HCO₃⁻", col: "#8B5CF6", desc: { en: "Hydrogencarbonate ion", as: "হাইড্ৰ’জেনকাৰ্বনেট আয়ন" } },
        { sym: "Ca(HCO₃)₂", col: "#C4B5FD", desc: { en: "Calcium hydrogencarbonate (soluble)", as: "কেলচিয়াম হাইড্ৰ’জেনকাৰ্বনেট (দ্ৰৱণীয়)" } },
      ],
    },
    observations: {
      en: ["CaCO₃ white solid initially insoluble", "CO₂ bubbles dissolve in water", "White solid slowly dissolves", "Solution transitions from milky to clear", "Ca(HCO₃)₂ dissolves completely", "Temporary hardness demonstrated"],
      as: ["CaCO₃ বগা কঠিন আৰম্ভণিতে অদ্ৰৱণীয়", "CO₂ বুদবুদ পানীত দ্ৰৱীভূত হয়", "বগা কঠিন লাহে লাহে দ্ৰৱীভূত হয়", "সমাধান গাখীৰৰ দৰে পৰা স্বচ্ছ হয়", "Ca(HCO₃)₂ সম্পূৰ্ণৰূপে দ্ৰৱীভূত হয়", "অস্থায়ী কঠিনতা প্ৰদৰ্শিত"],
    },
    pmode: "co2-dissolve",
    quiz: [
      { q: { en: "Product formed when CaCO₃ dissolves in CO₂ + H₂O:", as: "CaCO₃ CO₂ + H₂O-ত দ্ৰৱীভূত হ’লে গঠিত উৎপাদ:" }, opts: { en: ["CaCl₂", "Ca(HCO₃)₂", "CaO", "CaCO₃ stays"], as: ["CaCl₂", "Ca(HCO₃)₂", "CaO", "CaCO₃ থাকে"] }, ans: 1 },
      { q: { en: "This reaction explains:", as: "এই বিক্ৰিয়াই কি ব্যাখ্যা কৰে:" }, opts: { en: ["Permanent hardness", "Temporary hardness of water", "Boiling point change", "Freezing point"], as: ["স্থায়ী কঠিনতা", "পানীৰ অস্থায়ী কঠিনতা", "উতলনাংক পৰিবৰ্তন", "ঘনীভৱনাংক"] }, ans: 1 },
      { q: { en: "Gas that causes CaCO₃ to dissolve:", as: "CaCO₃ দ্ৰৱীভূত কৰাৰ কাৰক গেছ:" }, opts: { en: ["O₂", "H₂", "CO₂", "N₂"], as: ["O₂", "H₂", "CO₂", "N₂"] }, ans: 2 },
      { q: { en: "Stalactites in caves form due to:", as: "গুহাত ষ্টেলেক্টাইট গঠনৰ কাৰণ:" }, opts: { en: ["Erosion by wind", "Reverse of CaCO₃+CO₂+H₂O reaction", "Volcanic activity", "Bacterial activity"], as: ["বতাহৰ ক্ষয়", "CaCO₃+CO₂+H₂O বিক্ৰিয়াৰ বিপৰীত", "আগ্নেয়গিৰি ক্ৰিয়া", "বেক্টেৰিয়া ক্ৰিয়া"] }, ans: 1 },
      { q: { en: "Ca(HCO₃)₂ compared to CaCO₃ is:", as: "CaCO₃-ৰ তুলনাত Ca(HCO₃)₂:" }, opts: { en: ["Insoluble", "Soluble in water", "A gas", "An acid"], as: ["অদ্ৰৱণীয়", "পানীত দ্ৰৱণীয়", "এক গেছ", "এক অম্ল"] }, ans: 1 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// PARTICLE ENGINE
// ═══════════════════════════════════════════════════════════

function useParticles(ref: React.RefObject<HTMLCanvasElement | null>, mode: PMode, intensity: number) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    let animId: number;
    const ps: Particle[] = [];
    const W = () => canvas.width, H = () => canvas.height;

    function spawn() {
      if (!intensity || mode === "none") return;

      if (mode === "co2-vigorous") {
        if (Math.random() < 0.55 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6,
          y: H() * 0.6 + Math.random() * H() * 0.25,
          vx: (Math.random() - 0.5) * 1.8, vy: -2 - Math.random() * 3,
          life: 60, maxLife: 60, size: 3 + Math.random() * 6,
          color: `rgba(200,230,255,${0.5 + Math.random() * 0.4})`, blur: 5, type: "bubble",
        });
        if (Math.random() < 0.25 * intensity) ps.push({
          x: W() * 0.15 + Math.random() * W() * 0.7,
          y: H() * 0.35 + Math.random() * H() * 0.25,
          vx: (Math.random() - 0.5) * 2, vy: -0.8 - Math.random() * 1.5,
          life: 35, maxLife: 35, size: 4 + Math.random() * 7,
          color: `rgba(220,240,255,${0.3 + Math.random() * 0.35})`, blur: 8, type: "foam",
        });
      }

      if (mode === "co2-moderate") {
        if (Math.random() < 0.35 * intensity) ps.push({
          x: W() * 0.25 + Math.random() * W() * 0.5,
          y: H() * 0.65 + Math.random() * H() * 0.2,
          vx: (Math.random() - 0.5) * 1.2, vy: -1.2 - Math.random() * 2,
          life: 70, maxLife: 70, size: 3 + Math.random() * 5,
          color: `rgba(103,232,249,${0.5 + Math.random() * 0.4})`, blur: 5, type: "bubble",
        });
      }

      if (mode === "co2-slow") {
        if (Math.random() < 0.18 * intensity) ps.push({
          x: W() * 0.3 + Math.random() * W() * 0.4,
          y: H() * 0.7 + Math.random() * H() * 0.15,
          vx: (Math.random() - 0.5) * 0.8, vy: -0.8 - Math.random() * 1.2,
          life: 90, maxLife: 90, size: 2.5 + Math.random() * 4,
          color: `rgba(252,211,77,${0.5 + Math.random() * 0.35})`, blur: 5, type: "bubble",
        });
      }

      if (mode === "co2-foam") {
        if (Math.random() < 0.5 * intensity) ps.push({
          x: W() * 0.15 + Math.random() * W() * 0.7,
          y: H() * 0.45 + Math.random() * H() * 0.35,
          vx: (Math.random() - 0.5) * 2.5, vy: -1.5 - Math.random() * 2.5,
          life: 45, maxLife: 45, size: 5 + Math.random() * 9,
          color: `rgba(52,211,153,${0.35 + Math.random() * 0.4})`, blur: 9, type: "foam",
        });
        if (Math.random() < 0.3 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6,
          y: H() * 0.55 + Math.random() * H() * 0.25,
          vx: (Math.random() - 0.5) * 3, vy: -2.5 - Math.random() * 3,
          life: 30, maxLife: 30, size: 2 + Math.random() * 4,
          color: "rgba(255,255,255,0.8)", blur: 4, type: "burst",
        });
      }

      if (mode === "co2-dissolve") {
        if (Math.random() < 0.15 * intensity) ps.push({
          x: W() * 0.3 + Math.random() * W() * 0.4,
          y: H() * 0.15 + Math.random() * H() * 0.25,
          vx: (Math.random() - 0.5) * 0.5, vy: 0.5 + Math.random() * 1,
          life: 100, maxLife: 100, size: 2 + Math.random() * 3,
          color: `rgba(167,139,250,${0.4 + Math.random() * 0.3})`, blur: 6, type: "co2",
        });
        if (Math.random() < 0.08 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6,
          y: H() * 0.5 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          life: 60, maxLife: 60, size: 1.5 + Math.random() * 2.5,
          color: "rgba(255,255,255,0.3)", blur: 3, type: "dissolve",
        });
      }
    }

    function draw() {
      const ctx = canvas?.getContext("2d"); if (!ctx) return;
      ctx.clearRect(0, 0, W(), H());
      spawn();
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.type === "co2") { p.vy += 0.02; p.vx *= 0.99; }
        if (p.type === "foam" || p.type === "burst") { p.vy -= 0.03; p.vx *= 0.98; }
        if (p.life <= 0) { ps.splice(i, 1); continue; }
        const a = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.shadowColor = p.color; ctx.shadowBlur = p.blur;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [ref, mode, intensity]);
}

// ═══════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════

function GlassPanel({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", ...style }}>
      {children}
    </div>
  );
}
function NeonBadge({ label, color }: { label: string; color: string }) {
  return <span className="text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest" style={{ color, borderColor: `${color}44`, background: `${color}15` }}>{label}</span>;
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
// EFFERVESCENCE PANEL (unique to this lab)
// ═══════════════════════════════════════════════════════════

const INTENSITY_COLORS: Record<Intensity, string> = {
  VIGOROUS: "#EF4444", HIGH: "#F97316", MODERATE: "#F59E0B", LOW: "#22C55E",
};
const INTENSITY_BARS: Record<Intensity, number> = {
  VIGOROUS: 100, HIGH: 75, MODERATE: 45, LOW: 18,
};

function EffervescencePanel({ exp, phase }: { exp: Exp; phase: Phase }) {
  const [limeTested, setLimeTested] = useState(false);
  const reacting = phase === "reacting" || phase === "complete";
  const intColor = INTENSITY_COLORS[exp.effervescence];
  const intPct = reacting ? INTENSITY_BARS[exp.effervescence] : 0;
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const intensityLabel: Record<Intensity, string> = isAs
    ? { VIGOROUS: "প্ৰচণ্ড", HIGH: "উচ্চ", MODERATE: "মধ্যম", LOW: "কম" }
    : { VIGOROUS: "VIGOROUS", HIGH: "HIGH", MODERATE: "MODERATE", LOW: "LOW" };

  return (
    <GlassPanel className="p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Wind className="w-3.5 h-3.5" style={{ color: exp.accent }} />
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "CO₂ বিশ্লেষণ" : "CO₂ Analysis"}</span>
      </div>

      <div className="space-y-2.5">
        {/* Effervescence intensity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500">{isAs ? "বুদবুদ" : "Effervescence"}</span>
            <motion.span className="text-[10px] font-black" animate={{ color: reacting ? intColor : "#475569" }}>
              {reacting ? intensityLabel[exp.effervescence] : "—"}
            </motion.span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${intPct}%` }} transition={{ duration: 1, ease: "easeOut" }}
              style={{ background: `linear-gradient(90deg, ${intColor}, ${intColor}88)`, boxShadow: `0 0 8px ${intColor}` }} />
          </div>
        </div>

        {/* CO₂ rate */}
        <DataRow label={isAs ? "CO₂ হাৰ" : "CO₂ Rate"} value={reacting ? (exp.effervescence === "VIGOROUS" ? (isAs ? "দ্ৰুত ★★★★" : "Fast ★★★★") : exp.effervescence === "HIGH" ? (isAs ? "উচ্চ ★★★" : "High ★★★") : exp.effervescence === "MODERATE" ? (isAs ? "মধ্যম ★★" : "Moderate ★★") : (isAs ? "লেহেমীয়া ★" : "Slow ★")) : "—"} color={intColor} />
        <DataRow label={isAs ? "ফেনা" : "Foam"} value={exp.foamForm ? (reacting ? (isAs ? "গঠিত হৈছে ✓" : "Forming ✓") : "—") : (isAs ? "নাই" : "None")} color={exp.foamForm && reacting ? "#A78BFA" : "#475569"} />
        <DataRow label={isAs ? "অম্ল ধৰণ" : "Acid Type"} value={exp.acidType === "strong" ? (isAs ? "প্ৰবল (HCl)" : "Strong (HCl)") : exp.acidType === "weak" ? (isAs ? "দুৰ্বল (CH₃COOH)" : "Weak (CH₃COOH)") : "CO₂ + H₂O"} color={exp.acidType === "strong" ? "#EF4444" : exp.acidType === "weak" ? "#F59E0B" : "#8B5CF6"} />

        {/* Limewater test button */}
        {exp.limewaterTest && (
          <>
            <button disabled={!reacting} onClick={() => setLimeTested(true)}
              className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-30"
              style={{ background: reacting ? `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` : "rgba(255,255,255,0.05)", color: "white" }}>
              <Droplets className="w-3.5 h-3.5 inline mr-1.5" />{reacting ? (isAs ? "চূনপানীৰে পৰীক্ষা" : "Test with Limewater") : (isAs ? "প্ৰথমে পৰীক্ষা সম্পূৰ্ণ কৰক" : "Complete exp. first")}
            </button>
            <AnimatePresence>
              {limeTested && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-lg p-2.5 border text-center" style={{ background: "rgba(248,250,252,0.08)", borderColor: "rgba(248,250,252,0.3)" }}>
                  <p className="text-sm mb-0.5">☁️</p>
                  <p className="text-[10px] font-black text-slate-200">{isAs ? "চূনপানী → গাখীৰৰ দৰে" : "Limewater → MILKY"}</p>
                  <p className="text-[8px] text-slate-400">{isAs ? "CaCO₃↓ অৱক্ষেপে CO₂ গেছ নিশ্চিত কৰে" : "CaCO₃↓ precipitate confirms CO₂ gas"}</p>
                  <button onClick={() => setLimeTested(false)} className="mt-1 text-[8px] text-slate-500 underline">{isAs ? "পুনৰ আৰম্ভ" : "Reset"}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {exp.id === "caco3-co2" && (
          <div className="rounded-lg p-2 border" style={{ background: "rgba(167,139,250,0.1)", borderColor: "rgba(167,139,250,0.3)" }}>
            <p className="text-[9px] font-black text-purple-300">{isAs ? "💧 অস্থায়ী কঠিনতা" : "💧 TEMPORARY HARDNESS"}</p>
            <p className="text-[8px] text-slate-400">{isAs ? "Ca(HCO₃)₂-এ অস্থায়ী কঠিনতা সৃষ্টি কৰে। উতলোৱাত আঁতৰোৱা যায়।" : "Ca(HCO₃)₂ causes temporary hardness. Removable by boiling."}</p>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// APPARATUS SVG
// ═══════════════════════════════════════════════════════════

function ApparatusSVG({ exp, phase }: { exp: Exp; phase: Phase }) {
  const liqCol = exp.phaseColors[phase];
  const reacting = phase === "reacting" || phase === "complete";
  const bubbleCol = exp.id === "na2co3-acid" || exp.id === "nahco3-acid" ? "rgba(252,211,77,0.7)" : exp.id === "caco3-co2" ? "rgba(167,139,250,0.6)" : "rgba(200,240,255,0.75)";

  if (exp.id === "caco3-co2") {
    return (
      <svg viewBox="0 0 240 210" className="w-full h-full">
        <defs>
          <radialGradient id="caco3-sol" cx="50%" cy="65%" r="55%">
            <stop offset="0%" stopColor={liqCol} stopOpacity="1.2" />
            <stop offset="100%" stopColor={liqCol} stopOpacity="0.3" />
          </radialGradient>
        </defs>
        {/* Round flask */}
        <path d="M75,100 Q55,125 65,155 Q75,185 100,188 Q125,188 135,155 Q145,125 125,100 Z"
          fill={`url(#caco3-sol)`} stroke="rgba(147,197,253,0.3)" strokeWidth="1.5" />
        <path d="M75,100 L82,75 L118,75 L125,100" fill="rgba(147,197,253,0.05)" stroke="rgba(147,197,253,0.3)" strokeWidth="1.5" />
        <rect x="88" y="65" width="24" height="11" rx="4" fill="rgba(147,197,253,0.06)" stroke="rgba(147,197,253,0.25)" strokeWidth="1" />
        {/* CaCO₃ solid */}
        {["idle","step1"].includes(phase) && [0,1,2,3,4,5].map(i => (
          <circle key={i} cx={88 + (i % 3) * 14} cy={160 + Math.floor(i / 3) * 10}
            r="4" fill="rgba(226,232,240,0.85)" />
        ))}
        {phase === "step2" && [0,1,2].map(i => (
          <motion.circle key={i} cx={90 + i * 14} cy={158} r="3"
            fill="rgba(226,232,240,0.5)"
            animate={{ opacity: [0.5, 0.1], r: [3, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }} />
        ))}
        {/* CO₂ source */}
        <ellipse cx="185" cy="50" rx="26" ry="20" fill="rgba(148,163,184,0.07)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.5" />
        <text x="185" y="54" textAnchor="middle" fill="rgba(148,163,184,0.7)" fontSize="8" fontWeight="bold">CO₂</text>
        {/* Delivery tube */}
        <path d="M185,70 Q185,100 130,102 L100,120" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" />
        {phase !== "idle" && [0,1].map(i => (
          <motion.circle key={i} cx={100} cy={158 - i * 12} r="3.5"
            fill={bubbleCol} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"
            animate={{ cy: [158 - i * 8, 118], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }} />
        ))}
        <text x="100" y="202" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="7">{exp.equation}</text>
      </svg>
    );
  }

  // Standard test tube / beaker for carbonate experiments
  const isFoam = exp.id === "nahco3-acid";
  const acidLabel = exp.acidType === "strong" ? "HCl" : "CH₃COOH";
  const acidColor = exp.acidType === "strong" ? "rgba(252,165,165,0.7)" : "rgba(252,211,77,0.7)";

  return (
    <svg viewBox="0 0 240 210" className="w-full h-full">
      <defs>
        <radialGradient id={`liq-c-${exp.id}`} cx="50%" cy="65%" r="60%">
          <stop offset="0%" stopColor={liqCol} stopOpacity="1.2" />
          <stop offset="100%" stopColor={liqCol} stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Beaker */}
      <path d="M55,38 L55,162 Q55,175 70,175 L170,175 Q185,175 185,162 L185,38"
        fill="rgba(147,197,253,0.04)" stroke="rgba(147,197,253,0.28)" strokeWidth="1.8" />
      <line x1="55" y1="38" x2="40" y2="22" stroke="rgba(147,197,253,0.28)" strokeWidth="1.8" />
      <line x1="185" y1="38" x2="200" y2="22" stroke="rgba(147,197,253,0.28)" strokeWidth="1.8" />

      {/* Solution */}
      <path d={`M57,${isFoam && reacting ? 55 : 80} L57,163 Q57,173 70,173 L170,173 Q183,173 183,163 L183,${isFoam && reacting ? 55 : 80} Z`}
        fill={`url(#liq-c-${exp.id})`} />

      {/* Carbonate powder */}
      {phase === "idle" && [0,1,2,3,4,5,6].map(i => (
        <circle key={i} cx={80 + (i % 4) * 18} cy={120 + Math.floor(i / 4) * 12}
          r={3 + (i % 2)} fill="rgba(240,248,255,0.85)" />
      ))}

      {/* Foam for NaHCO₃ + ethanoic */}
      {isFoam && reacting && (
        <>
          <motion.ellipse cx="120" cy="60" rx="60" ry="15"
            fill="rgba(52,211,153,0.2)" stroke="rgba(52,211,153,0.3)" strokeWidth="1"
            animate={{ ry: [15,20,15], opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }} />
          {[0,1,2,3].map(i => (
            <motion.circle key={i} cx={80+i*20} cy={65} r="6+i"
              fill="rgba(52,211,153,0.25)" stroke="rgba(52,211,153,0.4)" strokeWidth="0.8"
              animate={{ cy:[65,45], opacity:[0.8,0], r:[6,3] }}
              transition={{ duration:1, repeat:Infinity, delay:i*0.25 }} />
          ))}
        </>
      )}

      {/* Bubbles */}
      {reacting && !isFoam && [0,1,2,3,4].map(i => {
        const bSpeed = exp.effervescence === "VIGOROUS" ? 1.8 : exp.effervescence === "HIGH" ? 1.4 : 0.9;
        return (
          <motion.circle key={i} cx={80+(i%5)*18} cy={140} r="3.5"
            fill={bubbleCol} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"
            animate={{ cy:[140, 60], opacity:[0.8,0], r:[3.5,2] }}
            transition={{ duration:bSpeed+i*0.2, repeat:Infinity, delay:i*0.35, ease:"easeOut" }} />
        );
      })}

      {/* Acid dropper */}
      <g transform="translate(100,0)">
        <rect x="5" y="3" width="18" height="42" rx="4" fill={`${acidColor}22`} stroke={acidColor} strokeWidth="1.2" />
        <path d="M11,45 L17,45 L16,58 L12,58 Z" fill={`${acidColor}33`} stroke={acidColor} strokeWidth="1" />
        <text x="14" y="28" textAnchor="middle" fill={acidColor} fontSize="6" fontWeight="bold">{acidLabel}</text>
        {phase !== "idle" && (
          <motion.circle cx="14" cy="65" r="3" fill={acidColor}
            animate={{ cy:[62,82], opacity:[1,0] }} transition={{ duration:1.2, repeat:Infinity, ease:"easeIn" }} />
        )}
      </g>

      {/* Delivery tube to limewater (for limewater test experiments) */}
      {exp.limewaterTest && (
        <g>
          <path d="M185,90 Q205,90 205,70 L205,50" fill="none" stroke="rgba(147,197,253,0.35)" strokeWidth="1.5" />
          <rect x="196" y="30" width="18" height="22" rx="3" fill="rgba(220,252,231,0.12)" stroke="rgba(134,239,172,0.4)" strokeWidth="1" />
          <text x="205" y="44" textAnchor="middle" fill="rgba(134,239,172,0.7)" fontSize="5.5" fontWeight="bold">Ca(OH)₂</text>
        </g>
      )}

      <text x="120" y="195" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="7">{exp.equation}</text>
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
        <motion.div key={showAfter ? "p" : "r"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          className="flex flex-wrap gap-2 justify-center py-2">
          {ions.map((ion, i) => (
            <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.09 }}
              className="flex flex-col items-center gap-1">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[9px] font-black border-2 relative"
                style={{ background: `${ion.col}15`, borderColor: `${ion.col}50`, color: ion.col, boxShadow: `0 0 12px ${ion.col}44` }}>
                <motion.div className="absolute inset-0 rounded-full" animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2.2, repeat: Infinity }}>
                  <div className="w-full h-full rounded-full" style={{ background: `radial-gradient(circle, ${ion.col}22, transparent)` }} />
                </motion.div>
                <span className="relative">{ion.sym}</span>
              </div>
              <span className="text-[7px] text-slate-500 text-center max-w-[48px] leading-tight">{pickLang(ion.desc, lang).split("(")[0].trim()}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
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
                const sel = answers[qi] === oi, correct = submitted && oi === q.ans, wrong = submitted && sel && oi !== q.ans;
                return (
                  <button key={oi} disabled={submitted} onClick={() => setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                    className="text-left text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all"
                    style={{
                      borderColor: correct ? "#34D399" : wrong ? "#EF4444" : sel ? `${exp.accent}88` : "rgba(255,255,255,0.08)",
                      background: correct ? "rgba(52,211,153,0.12)" : wrong ? "rgba(239,68,68,0.12)" : sel ? `${exp.accent}15` : "rgba(255,255,255,0.02)",
                      color: correct ? "#34D399" : wrong ? "#EF4444" : sel ? exp.accent : "#94a3b8",
                    }}>{opt}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={() => { const correct = answers.filter((a, i) => a === exp.quiz[i].ans).length; recordQuizResult({ score: Math.round((correct / exp.quiz.length) * 100), totalCorrect: correct, totalAttempted: exp.quiz.length }); setSubmitted(true); }} disabled={answers.some(a => a === null)}
          className="mt-3 w-full py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-40 hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>{isAs ? "উত্তৰ জমা দিয়ক" : "Submit Answers"}</button>
      ) : (
        <div className="mt-3 text-center">
          <div className="text-xl mb-1">{score === exp.quiz.length ? "🎉" : "📚"}</div>
          <p className="text-xs font-black" style={{ color: exp.accent }}>{score === exp.quiz.length ? (isAs ? "শাবাশ! পৰীক্ষাৰ বাবে সাজু!" : "Perfect! Exam ready!") : `${score}/${exp.quiz.length} — ${isAs ? "অভ্যাস কৰি থাকক" : "Keep practising"}`}</p>
          <button onClick={() => { setAnswers(exp.quiz.map(() => null)); setSubmitted(false); }} className="mt-2 text-[10px] text-slate-400 underline">{isAs ? "পুনৰ কুইজ দিয়ক" : "Retry Quiz"}</button>
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

  const pIntensity = phase === "reacting" ? 1 : phase === "complete" ? 0.1 : phase !== "idle" ? 0.4 : 0;
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

  const rxnPct = phase === "complete" ? 100 : phase === "reacting" ? 72 : phase === "step2" ? 35 : phase === "step1" ? 10 : 0;
  const co2Pct = phase === "complete" ? INTENSITY_BARS[exp.effervescence] : phase === "reacting" ? INTENSITY_BARS[exp.effervescence] * 0.85 : 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#050B18" }}>
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
        <div className="hidden sm:flex items-center gap-1.5">
          <NeonBadge label="CO₂↑" color={exp.accent} />
          {exp.foamForm && <NeonBadge label={isAs ? "ফেনা" : "foam"} color="#A78BFA" />}
          <NeonBadge label={isAs ? ({ VIGOROUS: "প্ৰচণ্ড", HIGH: "উচ্চ", MODERATE: "মধ্যম", LOW: "কম" } as Record<Intensity, string>)[exp.effervescence] : exp.effervescence} color={INTENSITY_COLORS[exp.effervescence]} />
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
              <button onClick={() => setShowSafety(false)} className="ml-auto text-slate-500 text-sm">✕</button>
            </div>
            {expSafety.map((s, i) => <p key={i} className="text-xs text-red-200 mb-0.5">• {s}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 240 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="absolute inset-0 p-3"><ApparatusSVG exp={exp} phase={phase} /></div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen" }} />
            <div className="absolute top-2 right-2">
              <NeonBadge label={phase === "idle" ? (isAs ? "সাজু" : "READY") : phase === "reacting" ? (isAs ? "বিক্ৰিয়া চলিছে" : "REACTING") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "COMPLETE") : `${isAs ? "পদক্ষেপ" : "STEP"} ${stepIdx + 1}`}
                color={phase === "reacting" ? exp.accent : phase === "complete" ? "#34D399" : "#60A5FA"} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {phase === "complete" ? `✅ ${isAs ? "সম্পূৰ্ণ" : "Complete"}` : `${isAs ? "পদক্ষেপ" : "Step"} ${stepIdx + 1}/${exp.steps.length}`}
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
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl text-xs font-black border hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />{isAs ? "পুনৰ কৰক" : "Repeat"}
                </button>
                <button onClick={() => setShowQuiz(true)} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>{isAs ? "কুইজ দিয়ক" : "Take Quiz"}</button>
              </div>
            )}
          </GlassPanel>

          <EffervescencePanel exp={exp} phase={phase} />
        </div>

        {/* Middle */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সন্তুলিত সমীকৰণ" : "Balanced Equation"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-xs border"
              style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>{exp.equation}</div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "লাইভ বিশ্লেষণ" : "Live Analysis"}</p>
            <div className="space-y-3">
              <AnimBar label={isAs ? "বিক্ৰিয়া অগ্ৰগতি" : "Reaction Progress"} target={rxnPct} accent={exp.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimBar label={isAs ? "CO₂ নিৰ্গমন" : "CO₂ Evolution"} target={co2Pct} accent="#94A3B8" icon={<Wind className="w-3 h-3" />} />
              <AnimBar label={isAs ? "দ্ৰৱণ" : "Dissolution"} target={rxnPct * 0.9} accent="#22D3EE" icon={<Zap className="w-3 h-3" />} />
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "অম্লৰ শক্তি" : "Acid Strength"} value={exp.acidType === "strong" ? (isAs ? "প্ৰবল (HCl)" : "Strong (HCl)") : exp.acidType === "weak" ? (isAs ? "দুৰ্বল (CH₃COOH)" : "Weak (CH₃COOH)") : "CO₂ + H₂O"} color={exp.acidType === "strong" ? "#EF4444" : exp.acidType === "weak" ? "#F59E0B" : "#8B5CF6"} />
              <DataRow label={isAs ? "বুদবুদ" : "Effervescence"} value={phase !== "idle" ? (isAs ? ({ VIGOROUS: "প্ৰচণ্ড", HIGH: "উচ্চ", MODERATE: "মধ্যম", LOW: "কম" } as Record<Intensity, string>)[exp.effervescence] : exp.effervescence) : "—"} color={INTENSITY_COLORS[exp.effervescence]} />
              <DataRow label={isAs ? "নিৰ্গত গেছ" : "Gas Evolved"} value="CO₂" color="#94A3B8" />
              <DataRow label={isAs ? "অৱস্থা" : "State"} value={phase === "idle" ? (isAs ? "আৰম্ভ হোৱা নাই" : "Not started") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ ✓" : "Completed ✓") : (isAs ? "চলি আছে" : "In progress")} color={phase === "complete" ? "#34D399" : exp.accent} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-3 flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "পৰ্যবেক্ষণ লগ" : "Observation Log"}</p>
            <div className="space-y-1.5">
              {expObservations.map((obs, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: phase !== "idle" ? 1 : i === 0 ? 0.4 : 0.12, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: phase === "complete" ? `${exp.accent}22` : "rgba(255,255,255,0.05)" }}>
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

const CATS = ["All", "Carbonate + Strong", "Hydrogencarbonate + Strong", "Carbonate + Weak", "Hydrogencarbonate + Weak", "Dissolution"];
const CAT_MAP: Record<string, Category | null> = {
  "All": null, "Carbonate + Strong": "carbonate-strong", "Hydrogencarbonate + Strong": "hydrogencarbonate-strong",
  "Carbonate + Weak": "carbonate-weak", "Hydrogencarbonate + Weak": "hydrogencarbonate-weak", "Dissolution": "dissolution",
};

function LabHub({ onSelect }: { onSelect: (e: Exp) => void }) {
  const [filter, setFilter] = useState("All");
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const visible = EXPERIMENTS.filter(e => CAT_MAP[filter] === null || e.category === CAT_MAP[filter]);

  const CAT_LABELS: Record<string, string> = isAs ? {
    "All": "সকলো", "Carbonate + Strong": "কাৰ্বনেট + প্ৰবল",
    "Hydrogencarbonate + Strong": "হাইড্ৰ'জেনকাৰ্বনেট + প্ৰবল",
    "Carbonate + Weak": "কাৰ্বনেট + দুৰ্বল",
    "Hydrogencarbonate + Weak": "হাইড্ৰ'জেনকাৰ্বনেট + দুৰ্বল",
    "Dissolution": "দ্ৰৱণ",
  } : { "All": "All", "Carbonate + Strong": "Carbonate + Strong", "Hydrogencarbonate + Strong": "Hydrogencarbonate + Strong", "Carbonate + Weak": "Carbonate + Weak", "Hydrogencarbonate + Weak": "Hydrogencarbonate + Weak", "Dissolution": "Dissolution" };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #080e1c 60%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-15 animate-pulse"
            style={{ width: 2 + (i * 11 % 4), height: 2 + (i * 11 % 4), left: `${(i * 43 + 9) % 100}%`, top: `${(i * 71 + 15) % 100}%`, background: ["#3B82F6","#10B981","#F59E0B","#8B5CF6","#06B6D4","#EF4444"][i % 6], animationDelay: `${i * 0.3}s`, animationDuration: `${2 + (i % 3)}s` }} />
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
            style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", color: "#60A5FA" }}>
            <Wind className="w-3.5 h-3.5" /> {isAs ? "কাৰ্বনেট আৰু হাইড্ৰ'জেনকাৰ্বনেট · অধ্যায় ২" : "Carbonates & Hydrogencarbonates · Chapter 2"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "কাৰ্বনেট বিক্ৰিয়া" : "Carbonate Reactions"}<br />
            <span style={{ background: "linear-gradient(135deg, #3B82F6, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isAs ? "ভাৰ্চুৱেল লেব" : "Virtual Lab"}
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs ? "৫টা ইন্টাৰেক্টিভ পৰীক্ষা — CO₂ নিৰ্গমন, বুদবুদৰ তীব্ৰতা, চূনপানী পৰীক্ষা, প্ৰবল বনাম দুৰ্বল অম্ল তুলনা, আৰু CBSE MCQ মূল্যায়ন।" : "5 interactive experiments — CO₂ evolution, effervescence intensity, limewater tests, strong vs weak acid comparison, and CBSE MCQ assessment."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs ? [["৫","পৰীক্ষা"],["CO₂","নিৰ্গমন"],["চূনপানী","পৰীক্ষা"],["CBSE","সংৰেখিত"]] : [["5","Experiments"],["CO₂","Evolution"],["Limewater","Test"],["CBSE","Aligned"]]).map(([v, l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-3 py-2 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all hover:scale-105 border"
              style={{
                background: filter === cat ? "linear-gradient(135deg, #1D4ED8, #10B981)" : "rgba(255,255,255,0.04)",
                color: filter === cat ? "white" : "#94A3B8",
                borderColor: filter === cat ? "transparent" : "rgba(255,255,255,0.08)",
              }}>
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Experiment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {visible.map((exp, i) => (
            <motion.button key={exp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
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
                      <NeonBadge label={`EXP ${exp.num}`} color={exp.accent} />
                      <NeonBadge label="CO₂↑" color="#94A3B8" />
                      <NeonBadge label={exp.effervescence} color={INTENSITY_COLORS[exp.effervescence]} />
                      {exp.foamForm && <NeonBadge label="foam" color="#A78BFA" />}
                    </div>
                    <h3 className="font-black text-white text-sm leading-snug group-hover:opacity-80 mt-1">{pickLang(exp.title, lang)}</h3>
                    <p className="text-[10px] text-slate-400">{pickLang(exp.subtitle, lang)}</p>
                  </div>
                </div>
                <div className="font-mono text-[10px] rounded-lg px-2 py-1.5 mb-3 border"
                  style={{ borderColor: `${exp.accent}25`, background: `${exp.accent}08`, color: exp.accent }}>
                  {exp.equation}
                </div>
                {/* Effervescence preview bar */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] text-slate-500 shrink-0">CO₂:</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${INTENSITY_COLORS[exp.effervescence]}, ${INTENSITY_COLORS[exp.effervescence]}88)` }}
                      initial={{ width: "10%" }} animate={{ width: `${INTENSITY_BARS[exp.effervescence]}%` }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
                  </div>
                  <span className="text-[9px] font-black shrink-0" style={{ color: INTENSITY_COLORS[exp.effervescence] }}>{isAs ? ({ VIGOROUS: "প্ৰচণ্ড", HIGH: "উচ্চ", MODERATE: "মধ্যম", LOW: "কম" } as Record<Intensity, string>)[exp.effervescence] : exp.effervescence}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <NeonBadge label={isAs ? { HIGH: "উচ্চ", MEDIUM: "মধ্যম", LOW: "কম" }[exp.hazard] : exp.hazard} color={exp.hazard === "HIGH" ? "#EF4444" : exp.hazard === "MEDIUM" ? "#FB923C" : "#22C55E"} />
                    {exp.limewaterTest && <NeonBadge label={isAs ? "চূনপানী" : "limewater"} color="#22C55E" />}
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
                    <span className="text-white text-xs">▶</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Theory cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(isAs ? [
            { title: "কাৰ্বনেট বিক্ৰিয়া", icon: "⚗️", col: "#3B82F6", desc: "CO₃²⁻ + 2H⁺ → H₂O + CO₂↑। প্ৰবল অম্ল (HCl)-ৰ লগত প্ৰচণ্ড বিক্ৰিয়া। দুৰ্বল অম্ল (CH₃COOH)-ৰ লগত মধ্যম। সদায় লৱণ + পানী + CO₂ গঠিত হয়।" },
            { title: "হাইড্ৰ'জেনকাৰ্বনেট", icon: "🧪", col: "#06B6D4", desc: "HCO₃⁻ + H⁺ → H₂O + CO₂↑। মাত্ৰ ১টা H⁺ প্ৰয়োজন (CO₃²⁻-ৰ বাবে ২-ৰ তুলনাত)। বেকিং ছ'ডা। ৰান্ধনি আৰু এণ্টাচিডত ব্যৱহাৰ।" },
            { title: "প্ৰবল বনাম দুৰ্বল অম্ল", icon: "⚡", col: "#F59E0B", desc: "HCl (প্ৰবল): সম্পূৰ্ণ আয়নীকৰণ → প্ৰচণ্ড বিক্ৰিয়া। CH₃COOH (দুৰ্বল): আংশিক আয়নীকৰণ → মধ্যম/লেহেমীয়া বিক্ৰিয়া। একেই উৎপাদ, বেলেগ হাৰ।" },
            { title: "CO₂ পৰীক্ষা", icon: "☁️", col: "#10B981", desc: "চূনপানী পৰীক্ষা: CO₂ + Ca(OH)₂ → CaCO₃↓ (গাখীৰৰ দৰে)। CaCO₃+H₂O+CO₂ → Ca(HCO₃)₂ (অস্থায়ী কঠিনতা, গুহা গঠন)।" },
          ] : [
            { title: "Carbonate Reactions", icon: "⚗️", col: "#3B82F6", desc: "CO₃²⁻ + 2H⁺ → H₂O + CO₂↑. Vigorous with strong acids (HCl). Moderate with weak acids (CH₃COOH). Salt + water + CO₂ always formed." },
            { title: "Hydrogencarbonate", icon: "🧪", col: "#06B6D4", desc: "HCO₃⁻ + H⁺ → H₂O + CO₂↑. Only 1 H⁺ needed (vs 2 for CO₃²⁻). Baking soda. Used in cooking, antacids." },
            { title: "Strong vs Weak Acid", icon: "⚡", col: "#F59E0B", desc: "HCl (strong): complete ionisation → vigorous reaction. CH₃COOH (weak): partial ionisation → moderate/slow reaction. Same products, different rates." },
            { title: "CO₂ Tests", icon: "☁️", col: "#10B981", desc: "Limewater test: CO₂ + Ca(OH)₂ → CaCO₃↓ (milky). CaCO₃+H₂O+CO₂ → Ca(HCO₃)₂ (temporary hardness, cave formation)." },
          ]).map(card => (
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
// ROOT
// ═══════════════════════════════════════════════════════════

export default function CarbonateReactionsLab() {
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
