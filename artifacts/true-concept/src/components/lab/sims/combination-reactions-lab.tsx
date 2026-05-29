/**
 * Combination Reactions Virtual Lab — Production-Grade Module
 * 6 interactive chemistry experiments with canvas particle physics,
 * SVG apparatus, molecular visualization, and real-time data panels.
 */
import { useState, useRef, useEffect, useCallback } from "react";
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

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type ExpId = "mg-o2" | "cao-h2o" | "h2-o2" | "n2-h2" | "c-o2" | "ch4-o2";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type ParticleMode = "mg-fire" | "steam" | "explosion" | "haber-gas" | "coal-fire" | "methane-blue" | "methane-yellow" | "none";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  color: string; blur: number; type: string;
}

interface ExpConfig {
  id: ExpId; num: number;
  // Bilingual fields — student-facing text
  title: BilingualField<string>;
  subtitle: BilingualField<string>;
  description: BilingualField<string>;
  realWorld: BilingualField<string>;
  reactionType: BilingualField<string>;
  safety: BilingualField<string[]>;
  steps: { label: BilingualField<string>; desc: BilingualField<string>; action: string }[];
  observations: BilingualField<string[]>;
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
  controls?: { label: BilingualField<string>; min: number; max: number; unit: string; key: string }[];
  // Language-neutral fields — chemical formulas, numeric values, enums, styling
  equation: string;
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  energy: string; peakTemp: string;
  hazard: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
}

// ═══════════════════════════════════════════════════════════════
// CONFIG DATA
// ═══════════════════════════════════════════════════════════════

const EXPERIMENTS: ExpConfig[] = [
  {
    id: "mg-o2", num: 1,
    title: { en: "Magnesium + Oxygen", as: "মেগনেছিয়াম + অক্সিজেন" },
    subtitle: { en: "Brilliant White Combustion", as: "উজ্জ্বল বগা দহন" },
    equation: "2Mg + O₂ → 2MgO",
    accent: "#FFE066", glow: "rgba(255,224,102,0.4)", gradFrom: "#FF6B35", gradTo: "#FFE066", emoji: "✨",
    reactionType: { en: "Combination · Exothermic", as: "সংযোগ · তাপোৎপাদক" },
    energy: "−601 kJ/mol", peakTemp: "2,800 °C", hazard: "HIGH",
    description: {
      en: "Magnesium burns with a dazzling white flame, releasing enormous energy. Mg atoms donate electrons to O₂, forming ionic MgO — a salt-like lattice.",
      as: "মেগনেছিয়ামে এক চকমকীয়া বগা জ্বালাৰে জ্বলে আৰু বিপুল শক্তি মুক্ত কৰে। Mg পৰমাণুৱে O₂ক ইলেকট্ৰন দান কৰি লৱণ-সদৃশ জালিকা আয়নিক MgO গঠন কৰে।",
    },
    realWorld: {
      en: "Signal flares · Fireworks · Photography flash · Incendiary devices",
      as: "সংকেত জ্বালা · আতচবাজী · ফটোগ্ৰাফী ফ্লেছ · দহনকাৰী সঁজুলি",
    },
    safety: {
      en: ["Never look directly at the flame — causes permanent eye damage", "Use UV-rated protective goggles", "NEVER use water to extinguish — use dry sand"],
      as: ["জ্বালালৈ পোনে চাব নালাগে — স্থায়ী চকুৰ ক্ষতি কৰে", "UV সুৰক্ষাৰ চশমা ব্যৱহাৰ কৰক", "নুমাবলৈ কেতিয়াও পানী ব্যৱহাৰ নকৰিব — শুকান বালি ব্যৱহাৰ কৰক"],
    },
    steps: [
      { label: { en: "Load Crucible", as: "ক্ৰুচিবল ভৰাওক" }, desc: { en: "Pick up the Mg ribbon with tongs and place it in the crucible. Note the silvery metallic sheen.", as: "Mg ৰিবনডাল টংছেৰে ধৰি ক্ৰুচিবলত ৰাখক। ৰূপালী ধাতৱ চমকটো লক্ষ্য কৰক।" }, action: "load" },
      { label: { en: "Apply Heat", as: "তাপ প্ৰয়োগ কৰক" }, desc: { en: "Lower the Bunsen burner flame and heat the ribbon gently. Temp rises to ~650 °C.", as: "বানচেন বাৰ্নাৰৰ জ্বালা নমাই ৰিবনডালত লাহে লাহে তাপ দিয়ক। উষ্ণতা ~৬৫০°C পৰ্যন্ত উঠে।" }, action: "heat" },
      { label: { en: "Ignition!", as: "প্ৰজ্বলন!" }, desc: { en: "The ribbon ignites with a brilliant white flash. Avert your eyes — intense UV emitted!", as: "ৰিবনডাল এক উজ্জ্বল বগা ফ্লেছেৰে জ্বলি উঠে। চকু আঁতৰাই ৰাখক — তীব্ৰ UV নিৰ্গত হয়!" }, action: "ignite" },
      { label: { en: "Collect MgO", as: "MgO সংগ্ৰহ কৰক" }, desc: { en: "Once cool, white powdery MgO ash remains. Mass has slightly increased — oxygen was absorbed.", as: "শীতল হোৱাৰ পিছত বগা চূৰ্ণ MgO ভস্ম অৱশিষ্ট থাকে। ভৰ অলপ বাঢ়িছে — অক্সিজেন শোষিত হৈছে।" }, action: "collect" },
    ],
    observations: {
      en: ["Intense white/blue-white flame visible even in daylight", "Rapid temperature surge (exothermic process)", "White fluffy powder (MgO) left in crucible", "Mass of crucible + contents increases slightly"],
      as: ["তীব্ৰ বগা/নীলা-বগা জ্বালা দিনৰ পোহৰতো দেখা যায়", "দ্ৰুত উষ্ণতা বৃদ্ধি (তাপোৎপাদক প্ৰক্ৰিয়া)", "ক্ৰুচিবলত বগা মৃদু চূৰ্ণ (MgO) থাকে", "ক্ৰুচিবল + ভিতৰৰ পদাৰ্থৰ ভৰ অলপ বাঢ়ে"],
    },
    quiz: [
      { q: { en: "What is the product of Mg burning in air?", as: "বায়ুত Mg জ্বলিলে কি উৎপাদ পোৱা যায়?" }, opts: { en: ["MgO₂", "MgO", "Mg₂O", "MgO₃"], as: ["MgO₂", "MgO", "Mg₂O", "MgO₃"] }, ans: 1 },
      { q: { en: "This reaction is:", as: "এই বিক্ৰিয়াটো:" }, opts: { en: ["Endothermic", "Exothermic", "Neutral", "Reversible"], as: ["তাপশোষক", "তাপোৎপাদক", "নিৰপেক্ষ", "প্ৰত্যাবৰ্তনীয়"] }, ans: 1 },
      { q: { en: "Why is water not used to extinguish burning Mg?", as: "জ্বলি থকা Mg নুমাবলৈ কিয় পানী ব্যৱহাৰ নকৰে?" }, opts: { en: ["Water is expensive", "Mg reacts violently with water", "Water increases brightness", "No specific reason"], as: ["পানী দামী", "Mg পানীৰ সৈতে প্ৰচণ্ডভাৱে বিক্ৰিয়া কৰে", "পানীয়ে উজ্জ্বলতা বৃদ্ধি কৰে", "কোনো নিৰ্দিষ্ট কাৰণ নাই"] }, ans: 1 },
    ],
  },
  {
    id: "cao-h2o", num: 2,
    title: { en: "Calcium Oxide + Water", as: "কেলচিয়াম অক্সাইড + পানী" },
    subtitle: { en: "Slaking of Lime", as: "চূনৰ স্লেকিং" },
    equation: "CaO + H₂O → Ca(OH)₂ + Heat",
    accent: "#38BDF8", glow: "rgba(56,189,248,0.4)", gradFrom: "#0EA5E9", gradTo: "#38BDF8", emoji: "💨",
    reactionType: { en: "Combination · Exothermic", as: "সংযোগ · তাপোৎপাদক" },
    energy: "−65 kJ/mol", peakTemp: "~300 °C", hazard: "MEDIUM",
    description: {
      en: "Calcium oxide (quicklime) reacts vigorously with water to form calcium hydroxide (slaked lime). The reaction generates significant heat, producing steam and a caustic paste.",
      as: "কেলচিয়াম অক্সাইডে (কুইকলাইম) পানীৰ সৈতে প্ৰচণ্ডভাৱে বিক্ৰিয়া কৰি কেলচিয়াম হাইড্ৰক্সাইড (স্লেকড লাইম) গঠন কৰে। এই বিক্ৰিয়াই উল্লেখযোগ্য তাপ উৎপন্ন কৰে, বাষ্প আৰু এক ক্ষাৰক প্ৰলেপ তৈয়াৰ কৰে।",
    },
    realWorld: {
      en: "Construction cement · Water treatment · Food industry · Agriculture (pH control)",
      as: "নিৰ্মাণ চিমেণ্ট · পানী শোধন · খাদ্য উদ্যোগ · কৃষি (pH নিয়ন্ত্ৰণ)",
    },
    safety: {
      en: ["Wear gloves — Ca(OH)₂ is corrosive to skin", "Wear goggles — steam can carry caustic droplets", "Do not inhale steam"],
      as: ["দস্তানা পিন্ধক — Ca(OH)₂ চামৰিৰ বাবে ক্ষয়কাৰী", "চশমা পিন্ধক — বাষ্পত ক্ষাৰক ফোঁট থাকিব পাৰে", "বাষ্প উশাহত নলব"],
    },
    steps: [
      { label: { en: "Prepare CaO", as: "CaO প্ৰস্তুত কৰক" }, desc: { en: "Observe the white lumps of calcium oxide in the beaker. Handle with care — it absorbs moisture from air.", as: "বিকাৰটোত কেলচিয়াম অক্সাইডৰ বগা পিণ্ডবোৰ লক্ষ্য কৰক। সাৱধানে নাড়ক — ই বায়ুৰ পৰা আৰ্দ্ৰতা শোষণ কৰে।" }, action: "prepare" },
      { label: { en: "Add Water Slowly", as: "পানী লাহে লাহে দিয়ক" }, desc: { en: "Carefully pour water over the CaO. Start the reaction — notice the immediate sizzling sound.", as: "CaO-ৰ ওপৰত সাৱধানে পানী ঢালক। বিক্ৰিয়া আৰম্ভ কৰক — তৎক্ষণাৎ ফেচফেচাই শব্দ লক্ষ্য কৰক।" }, action: "pour" },
      { label: { en: "Observe Heat & Steam", as: "তাপ আৰু বাষ্প লক্ষ্য কৰক" }, desc: { en: "Steam billows upward. The container heats rapidly. Thermometer rises sharply.", as: "বাষ্প ওপৰলৈ উঠে। পাত্ৰ দ্ৰুতগতিত তপত হয়। থাৰ্ম’মিটাৰ তীব্ৰভাৱে উঠে।" }, action: "observe" },
      { label: { en: "Slaked Lime Formed", as: "স্লেকড লাইম গঠিত হ’ল" }, desc: { en: "A white milky paste of Ca(OH)₂ forms. This is 'slaked lime' or 'lime milk'.", as: "Ca(OH)₂-ৰ এক বগা গাখীৰীয়া প্ৰলেপ গঠিত হয়। এইটোৱেই 'স্লেকড লাইম' বা 'চূনৰ গাখীৰ'।" }, action: "complete" },
    ],
    observations: {
      en: ["Vigorous hissing/sizzling when water added", "Immediate steam release", "Container becomes very hot to touch", "White paste (lime milk) forms gradually"],
      as: ["পানী যোগ কৰিলে প্ৰচণ্ড হিচহিচাই/ফেচফেচাই শব্দ", "তৎক্ষণাত বাষ্প নিৰ্গমন", "পাত্ৰ চুবলৈ বৰ গৰম হয়", "ক্ৰমে বগা প্ৰলেপ (চূনৰ গাখীৰ) গঠিত হয়"],
    },
    quiz: [
      { q: { en: "What is the common name of CaO?", as: "CaO-ৰ সাধাৰণ নাম কি?" }, opts: { en: ["Slaked lime", "Quicklime", "Limestone", "Chalk"], as: ["স্লেকড লাইম", "কুইকলাইম", "চূনশিল", "চক"] }, ans: 1 },
      { q: { en: "What is Ca(OH)₂ commonly called?", as: "Ca(OH)₂ক সাধাৰণতে কি বুলি কোৱা হয়?" }, opts: { en: ["Quicklime", "Limestone", "Slaked lime", "Chalk"], as: ["কুইকলাইম", "চূনশিল", "স্লেকড লাইম", "চক"] }, ans: 2 },
      { q: { en: "The CaO + H₂O reaction is:", as: "CaO + H₂O বিক্ৰিয়াটো:" }, opts: { en: ["Endothermic", "Exothermic", "No energy change", "Photochemical"], as: ["তাপশোষক", "তাপোৎপাদক", "শক্তিৰ পৰিবৰ্তন নাই", "আলোক ৰাসায়নিক"] }, ans: 1 },
    ],
  },
  {
    id: "h2-o2", num: 3,
    title: { en: "Hydrogen + Oxygen", as: "হাইড্ৰ’জেন + অক্সিজেন" },
    subtitle: { en: "Explosive Synthesis of Water", as: "পানীৰ বিস্ফোৰক সংশ্লেষ" },
    equation: "2H₂ + O₂ → 2H₂O",
    accent: "#A78BFA", glow: "rgba(167,139,250,0.4)", gradFrom: "#7C3AED", gradTo: "#A78BFA", emoji: "💥",
    reactionType: { en: "Combination · Highly Exothermic", as: "সংযোগ · অতি তাপোৎপাদক" },
    energy: "−286 kJ/mol", peakTemp: "3,000 °C (detonation)", hazard: "EXTREME",
    description: {
      en: "Hydrogen combustion with oxygen is one of the most energetic chemical reactions known, used in rocket engines. The explosive release produces pure water vapor.",
      as: "অক্সিজেনৰ সৈতে হাইড্ৰ’জেনৰ দহন জনাজাত আটাইতকৈ শক্তিশালী ৰাসায়নিক বিক্ৰিয়াসমূহৰ ভিতৰত এটা, ৰকেট ইঞ্জিনত ব্যৱহৃত হয়। বিস্ফোৰক মুক্তিয়ে বিশুদ্ধ পানীৰ বাষ্প উৎপন্ন কৰে।",
    },
    realWorld: {
      en: "Rocket fuel · Hydrogen fuel cells · Welding (oxyhydrogen torch) · Future clean energy",
      as: "ৰকেট ইন্ধন · হাইড্ৰ’জেন ইন্ধন কোষ · ৱেল্ডিং (অক্সিহাইড্ৰ’জেন টৰ্চ) · ভৱিষ্যত পৰিচ্ছন্ন শক্তি",
    },
    safety: {
      en: ["Hydrogen + oxygen is EXPLOSIVE at all ratios", "Keep away from ignition sources", "Use blast shield", "Ensure proper ventilation"],
      as: ["হাইড্ৰ’জেন + অক্সিজেন সকলো অনুপাততে বিস্ফোৰক", "প্ৰজ্বলনৰ উৎসৰ পৰা দূৰত ৰাখক", "বিস্ফোৰণ ঢাল ব্যৱহাৰ কৰক", "সঠিক বায়ু চলাচল নিশ্চিত কৰক"],
    },
    steps: [
      { label: { en: "Flood Chamber", as: "কক্ষ ভৰাওক" }, desc: { en: "Set H₂:O₂ molar ratio using sliders. Optimal stoichiometry is 2:1. Flood the chamber with gases.", as: "স্লাইডাৰ ব্যৱহাৰ কৰি H₂:O₂ ম’লাৰ অনুপাত নিৰ্ধাৰণ কৰক। উত্তম ষ্ট’ইক’মেট্ৰি ২:১। গেছেৰে কক্ষ ভৰাওক।" }, action: "fill" },
      { label: { en: "Check Safety Lock", as: "সুৰক্ষা লক পৰীক্ষা কৰক" }, desc: { en: "Verify ratio is within safe range. Safety system engages — explosion shield activates.", as: "অনুপাত নিৰাপদ সীমাৰ ভিতৰত আছে নে পৰীক্ষা কৰক। সুৰক্ষা প্ৰণালী সক্ৰিয় হয় — বিস্ফোৰণ ঢাল সক্ৰিয় হয়।" }, action: "check" },
      { label: { en: "Controlled Ignition", as: "নিয়ন্ত্ৰিত প্ৰজ্বলন" }, desc: { en: "Apply electric spark. If ratio is 2:1, controlled combustion occurs. Outside range: explosion!", as: "বৈদ্যুতিক স্ফুলিংগ প্ৰয়োগ কৰক। অনুপাত ২:১ হ’লে নিয়ন্ত্ৰিত দহন হয়। সীমাৰ বাহিৰত: বিস্ফোৰণ!" }, action: "ignite" },
      { label: { en: "Water Condenses", as: "পানী ঘনীভূত হয়" }, desc: { en: "H₂O vapor forms and condenses on chamber walls as tiny droplets. Pure water produced!", as: "H₂O বাষ্প গঠিত হৈ কক্ষৰ দেৱালত সৰু সৰু ফোঁটাৰূপে ঘনীভূত হয়। বিশুদ্ধ পানী উৎপন্ন হয়!" }, action: "condense" },
    ],
    observations: {
      en: ["Loud pop or explosion depending on H₂:O₂ ratio", "Bright flash at point of ignition", "Water droplets condense on chamber walls", "Pressure drops rapidly after reaction"],
      as: ["H₂:O₂ অনুপাতৰ ওপৰত নিৰ্ভৰ কৰি ডাঙৰ পপ বা বিস্ফোৰণ", "প্ৰজ্বলন বিন্দুত উজ্জ্বল ফ্লেছ", "কক্ষৰ দেৱালত পানীৰ ফোঁট ঘনীভূত হয়", "বিক্ৰিয়াৰ পিছত চাপ দ্ৰুতগতিত হ্ৰাস পায়"],
    },
    controls: [
      { label: { en: "H₂ Volume", as: "H₂ আয়তন" }, min: 0, max: 100, unit: "mL", key: "h2" },
      { label: { en: "O₂ Volume", as: "O₂ আয়তন" }, min: 0, max: 100, unit: "mL", key: "o2" },
    ],
    quiz: [
      { q: { en: "What is the correct molar ratio of H₂:O₂ for water formation?", as: "পানী গঠনৰ বাবে H₂:O₂-ৰ সঠিক ম’লাৰ অনুপাত কি?" }, opts: { en: ["1:1", "2:1", "1:2", "3:1"], as: ["1:1", "2:1", "1:2", "3:1"] }, ans: 1 },
      { q: { en: "What is produced when H₂ burns in O₂?", as: "O₂ত H₂ জ্বলিলে কি উৎপন্ন হয়?" }, opts: { en: ["H₂O₂", "H₂O", "HO", "H₃O"], as: ["H₂O₂", "H₂O", "HO", "H₃O"] }, ans: 1 },
      { q: { en: "This reaction is used in:", as: "এই বিক্ৰিয়াটো ব্যৱহাৰ কৰা হয়:" }, opts: { en: ["Cooking gas", "Rocket engines", "Car engines", "Lightbulbs"], as: ["ৰন্ধন গেছ", "ৰকেট ইঞ্জিন", "গাড়ীৰ ইঞ্জিন", "বাল্ব"] }, ans: 1 },
    ],
  },
  {
    id: "n2-h2", num: 4,
    title: { en: "Nitrogen + Hydrogen", as: "নাইট্ৰ’জেন + হাইড্ৰ’জেন" },
    subtitle: { en: "Industrial Haber Process", as: "ঔদ্যোগিক হেবাৰ প্ৰক্ৰিয়া" },
    equation: "N₂ + 3H₂ ⇌ 2NH₃ + Heat",
    accent: "#34D399", glow: "rgba(52,211,153,0.4)", gradFrom: "#059669", gradTo: "#34D399", emoji: "🏭",
    reactionType: { en: "Combination · Reversible · Exothermic", as: "সংযোগ · প্ৰত্যাবৰ্তনীয় · তাপোৎপাদক" },
    energy: "−92 kJ/mol", peakTemp: "400–500 °C (optimal)", hazard: "MEDIUM",
    description: {
      en: "The Haber Process synthesizes ammonia from nitrogen and hydrogen using an iron catalyst under high pressure. It is one of the most important industrial reactions, producing fertilizers.",
      as: "হেবাৰ প্ৰক্ৰিয়াই উচ্চ চাপত লোহাৰ প্ৰভাৱক ব্যৱহাৰ কৰি নাইট্ৰ’জেন আৰু হাইড্ৰ’জেনৰ পৰা এম’নিয়া সংশ্লেষণ কৰে। ই আটাইতকৈ গুৰুত্বপূৰ্ণ ঔদ্যোগিক বিক্ৰিয়াসমূহৰ এটা, যিয়ে সাৰ উৎপাদন কৰে।",
    },
    realWorld: {
      en: "Fertilizer production · Explosives manufacturing · Refrigerants · Cleaning products",
      as: "সাৰ উৎপাদন · বিস্ফোৰক প্ৰস্তুতি · শীতলকাৰক · পৰিষ্কাৰক সামগ্ৰী",
    },
    safety: {
      en: ["Ammonia is toxic — ensure sealed system", "High pressure — risk of rupture", "Handle catalyst (Fe) carefully — carcinogenic dust"],
      as: ["এম’নিয়া বিষাক্ত — চিল কৰা প্ৰণালী নিশ্চিত কৰক", "উচ্চ চাপ — ফাটিবৰ আশংকা", "প্ৰভাৱক (Fe) সাৱধানে নাড়ক — কাৰ্চিন’জেনিক ধূলি"],
    },
    steps: [
      { label: { en: "Load Gases", as: "গেছ ভৰাওক" }, desc: { en: "Pump N₂ and H₂ in 1:3 ratio into the high-pressure reactor. Pressurize to 150–300 atm.", as: "১:৩ অনুপাতত N₂ আৰু H₂ উচ্চ-চাপ ৰিএক্টৰলৈ পাম্প কৰক। ১৫০–৩০০ atm চাপত নিয়ক।" }, action: "load" },
      { label: { en: "Activate Catalyst", as: "প্ৰভাৱক সক্ৰিয় কৰক" }, desc: { en: "Insert iron (Fe) catalyst. It lowers activation energy without being consumed.", as: "লোহাৰ (Fe) প্ৰভাৱক ভৰাওক। ই ব্যৱহৃত নোহোৱাকৈ সক্ৰিয়ণ শক্তি কমাই দিয়ে।" }, action: "catalyst" },
      { label: { en: "Raise Temperature", as: "উষ্ণতা বঢ়াওক" }, desc: { en: "Heat to 400–500 °C. Higher temp speeds reaction but shifts equilibrium toward reactants.", as: "৪০০–৫০০ °C লৈ গৰম কৰক। উচ্চ উষ্ণতাই বিক্ৰিয়া দ্ৰুত কৰে কিন্তু সাম্যাৱস্থা বিক্ৰিয়াকাৰকৰ ফালে স্থানান্তৰ কৰে।" }, action: "heat" },
      { label: { en: "Collect NH₃", as: "NH₃ সংগ্ৰহ কৰক" }, desc: { en: "Ammonia condenses and is piped out. Unreacted gases are recycled.", as: "এম’নিয়া ঘনীভূত হৈ পাইপেৰে বাহিৰ কৰা হয়। বিক্ৰিয়া নোহোৱা গেছ পুনৰ ব্যৱহাৰ কৰা হয়।" }, action: "collect" },
    ],
    observations: {
      en: ["Colorless gas (NH₃) with pungent odor produced", "Yield depends on pressure and temperature", "Catalyst increases reaction rate but not yield", "High pressure favors product formation (Le Chatelier)"],
      as: ["কটু গোন্ধৰ বৰ্ণহীন গেছ (NH₃) উৎপন্ন হয়", "উৎপাদন চাপ আৰু উষ্ণতাৰ ওপৰত নিৰ্ভৰ কৰে", "প্ৰভাৱকে বিক্ৰিয়াৰ হাৰ বঢ়াই কিন্তু উৎপাদন নহয়", "উচ্চ চাপে উৎপাদ গঠনত সহায় কৰে (লে চাটেলিয়েৰ)"],
    },
    controls: [
      { label: { en: "Pressure", as: "চাপ" }, min: 50, max: 350, unit: "atm", key: "pressure" },
      { label: { en: "Temperature", as: "উষ্ণতা" }, min: 200, max: 600, unit: "°C", key: "temperature" },
    ],
    quiz: [
      { q: { en: "What catalyst is used in the Haber Process?", as: "হেবাৰ প্ৰক্ৰিয়াত কি প্ৰভাৱক ব্যৱহাৰ কৰা হয়?" }, opts: { en: ["Platinum", "Iron", "Manganese", "Vanadium"], as: ["প্লেটিনাম", "লোহা", "মেংগানিজ", "ভেনাডিয়াম"] }, ans: 1 },
      { q: { en: "Increasing pressure in the Haber Process:", as: "হেবাৰ প্ৰক্ৰিয়াত চাপ বৃদ্ধি কৰিলে:" }, opts: { en: ["Decreases NH₃ yield", "Increases NH₃ yield", "Has no effect", "Destroys catalyst"], as: ["NH₃ উৎপাদন কমায়", "NH₃ উৎপাদন বঢ়ায়", "কোনো প্ৰভাৱ নাই", "প্ৰভাৱক নষ্ট কৰে"] }, ans: 1 },
      { q: { en: "What is the main use of ammonia produced by the Haber Process?", as: "হেবাৰ প্ৰক্ৰিয়াত উৎপন্ন এম’নিয়াৰ মুখ্য ব্যৱহাৰ কি?" }, opts: { en: ["Cooking fuel", "Fertilizers", "Fuel cells", "Batteries"], as: ["ৰন্ধন ইন্ধন", "সাৰ", "ইন্ধন কোষ", "বেটাৰী"] }, ans: 1 },
    ],
  },
  {
    id: "c-o2", num: 5,
    title: { en: "Carbon + Oxygen", as: "কাৰ্বন + অক্সিজেন" },
    subtitle: { en: "Combustion of Carbon", as: "কাৰ্বনৰ দহন" },
    equation: "C + O₂ → CO₂",
    accent: "#FB923C", glow: "rgba(251,146,60,0.4)", gradFrom: "#EA580C", gradTo: "#FB923C", emoji: "🔥",
    reactionType: { en: "Combination · Exothermic", as: "সংযোগ · তাপোৎপাদক" },
    energy: "−393 kJ/mol", peakTemp: "~700 °C", hazard: "MEDIUM",
    description: {
      en: "Carbon (coal, charcoal, graphite) burns in oxygen to form carbon dioxide. Flame color and intensity vary with oxygen supply. Complete combustion produces CO₂; incomplete gives CO.",
      as: "কাৰ্বন (কয়লা, চাৰক’ল, গ্ৰাফাইট) অক্সিজেনত জ্বলি কাৰ্বন ডাইঅক্সাইড গঠন কৰে। অক্সিজেনৰ যোগানৰ লগে লগে জ্বালাৰ ৰং আৰু তীব্ৰতা সলনি হয়। সম্পূৰ্ণ দহনে CO₂ উৎপন্ন কৰে; অসম্পূৰ্ণ দহনে CO দিয়ে।",
    },
    realWorld: {
      en: "Coal power plants · Charcoal grills · Steel production · Carbon capture research",
      as: "কয়লা শক্তি কেন্দ্ৰ · চাৰক’ল গ্ৰিল · ইস্পাত উৎপাদন · কাৰ্বন কেপচাৰ গৱেষণা",
    },
    safety: {
      en: ["CO₂ displaces oxygen — ensure ventilation", "Hot coal can cause severe burns", "Risk of incomplete combustion producing toxic CO"],
      as: ["CO₂-এ অক্সিজেন স্থানান্তৰ কৰে — বায়ু চলাচল নিশ্চিত কৰক", "তপত কয়লাই গভীৰ পোৰা ক্ষত কৰিব পাৰে", "অসম্পূৰ্ণ দহনে বিষাক্ত CO উৎপন্ন কৰাৰ আশংকা"],
    },
    steps: [
      { label: { en: "Load Carbon", as: "কাৰ্বন ভৰাওক" }, desc: { en: "Place carbon block in the combustion chamber. Note the dull black appearance of carbon.", as: "দহন কক্ষত কাৰ্বন ব্লক ৰাখক। কাৰ্বনৰ ম্লান ক’লা ৰূপটো লক্ষ্য কৰক।" }, action: "load" },
      { label: { en: "Control Oxygen", as: "অক্সিজেন নিয়ন্ত্ৰণ কৰক" }, desc: { en: "Adjust O₂ supply. More O₂ = brighter, hotter flame. Less O₂ = smoky incomplete combustion.", as: "O₂ যোগান নিয়ন্ত্ৰণ কৰক। অধিক O₂ = উজ্জ্বল, গৰম জ্বালা। কম O₂ = ধোঁৱাযুক্ত অসম্পূৰ্ণ দহন।" }, action: "adjust" },
      { label: { en: "Ignite", as: "প্ৰজ্বলন" }, desc: { en: "Apply heat source. Carbon ignites at ~700 °C, glowing red-orange.", as: "তাপৰ উৎস প্ৰয়োগ কৰক। কাৰ্বন ~৭০০ °C-ত প্ৰজ্বলিত হৈ ৰঙা-কমলা ৰঙৰ পোহৰ দিয়ে।" }, action: "ignite" },
      { label: { en: "Analyze Gas", as: "গেছ বিশ্লেষণ কৰক" }, desc: { en: "CO₂ exits the chamber. Gas analyzer confirms the product.", as: "CO₂ কক্ষৰ পৰা ওলায়। গেছ বিশ্লেষকে উৎপাদটো নিশ্চিত কৰে।" }, action: "analyze" },
    ],
    observations: {
      en: ["Red-orange glow from burning carbon", "Flame intensity proportional to O₂ supply", "Colorless CO₂ gas produced (detectable by lime water test)", "Carbon mass decreases as CO₂ is released"],
      as: ["জ্বলি থকা কাৰ্বনৰ পৰা ৰঙা-কমলা পোহৰ", "জ্বালাৰ তীব্ৰতা O₂ যোগানৰ সমানুপাতিক", "বৰ্ণহীন CO₂ গেছ উৎপন্ন হয় (চূনৰ পানীৰ পৰীক্ষাৰে চিনাক্ত)", "CO₂ মুক্ত হোৱাৰ লগে লগে কাৰ্বনৰ ভৰ কমে"],
    },
    controls: [
      { label: { en: "O₂ Supply", as: "O₂ যোগান" }, min: 0, max: 100, unit: "%", key: "oxygen" },
    ],
    quiz: [
      { q: { en: "Complete combustion of carbon produces:", as: "কাৰ্বনৰ সম্পূৰ্ণ দহনে উৎপন্ন কৰে:" }, opts: { en: ["CO", "CO₂", "C₂O", "C₂O₃"], as: ["CO", "CO₂", "C₂O", "C₂O₃"] }, ans: 1 },
      { q: { en: "Which gas turns lime water milky?", as: "কোন গেছে চূনৰ পানীক গাখীৰীয়া কৰে?" }, opts: { en: ["O₂", "N₂", "CO₂", "H₂"], as: ["O₂", "N₂", "CO₂", "H₂"] }, ans: 2 },
      { q: { en: "Incomplete combustion of carbon produces:", as: "কাৰ্বনৰ অসম্পূৰ্ণ দহনে উৎপন্ন কৰে:" }, opts: { en: ["CO₂", "CO", "C₂H₄", "CH₄"], as: ["CO₂", "CO", "C₂H₄", "CH₄"] }, ans: 1 },
    ],
  },
  {
    id: "ch4-o2", num: 6,
    title: { en: "Methane + Oxygen", as: "মিথেন + অক্সিজেন" },
    subtitle: { en: "Natural Gas Combustion", as: "প্ৰাকৃতিক গেছৰ দহন" },
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    accent: "#60A5FA", glow: "rgba(96,165,250,0.4)", gradFrom: "#2563EB", gradTo: "#60A5FA", emoji: "🔵",
    reactionType: { en: "Combination · Exothermic", as: "সংযোগ · তাপোৎপাদক" },
    energy: "−890 kJ/mol", peakTemp: "~1,950 °C (adiabatic)", hazard: "HIGH",
    description: {
      en: "Methane (natural gas) combustion is the most common energy-releasing reaction in everyday life. The flame color reveals combustion completeness: blue = complete, yellow = incomplete.",
      as: "মিথেনৰ (প্ৰাকৃতিক গেছ) দহন দৈনন্দিন জীৱনৰ আটাইতকৈ সাধাৰণ শক্তি-মুক্তিকাৰী বিক্ৰিয়া। জ্বালাৰ ৰঙে দহনৰ সম্পূৰ্ণতা প্ৰকাশ কৰে: নীলা = সম্পূৰ্ণ, হালধীয়া = অসম্পূৰ্ণ।",
    },
    realWorld: {
      en: "Cooking gas · Gas turbines · Home heating · Power generation · CNG vehicles",
      as: "ৰন্ধন গেছ · গেছ টাৰ্বাইন · ঘৰৰ উষ্ণায়ন · শক্তি উৎপাদন · CNG বাহন",
    },
    safety: {
      en: ["Methane is highly flammable and explosive", "Ensure no gas leaks before ignition", "Adequate ventilation required"],
      as: ["মিথেন অতি দাহ্য আৰু বিস্ফোৰক", "প্ৰজ্বলনৰ আগতে গেছ লিক নোহোৱা নিশ্চিত কৰক", "পৰ্যাপ্ত বায়ু চলাচল প্ৰয়োজনীয়"],
    },
    steps: [
      { label: { en: "Open Gas Supply", as: "গেছৰ যোগান খোলক" }, desc: { en: "Open the CH₄ valve. Gas flows to the burner. Keep open flame away until ready.", as: "CH₄ ভাল্ভ খোলক। গেছ বাৰ্নাৰলৈ যায়। সাজু নোহোৱালৈ মুকলি জ্বালা দূৰত ৰাখক।" }, action: "open" },
      { label: { en: "Set Air-Fuel Ratio", as: "বায়ু-ইন্ধন অনুপাত নিৰ্ধাৰণ কৰক" }, desc: { en: "Adjust the air intake. More air = hotter, bluer flame. Less air = cooler, yellow sooty flame.", as: "বায়ু গ্ৰহণ নিয়ন্ত্ৰণ কৰক। অধিক বায়ু = গৰম, নীলা জ্বালা। কম বায়ু = শীতল, হালধীয়া ধোঁৱাযুক্ত জ্বালা।" }, action: "adjust" },
      { label: { en: "Ignite Burner", as: "বাৰ্নাৰ প্ৰজ্বলিত কৰক" }, desc: { en: "Apply spark. Methane ignites immediately. Observe flame color based on O₂ ratio.", as: "স্ফুলিংগ প্ৰয়োগ কৰক। মিথেন তৎক্ষণাত প্ৰজ্বলিত হয়। O₂ অনুপাতৰ ওপৰত আধাৰিত জ্বালাৰ ৰং লক্ষ্য কৰক।" }, action: "ignite" },
      { label: { en: "Observe Products", as: "উৎপাদ লক্ষ্য কৰক" }, desc: { en: "CO₂ and H₂O vapor produced. Emission monitor displays output.", as: "CO₂ আৰু H₂O বাষ্প উৎপন্ন হয়। নিৰ্গমন মনিটৰে আউটপুট দেখুৱায়।" }, action: "monitor" },
    ],
    observations: {
      en: ["Blue flame: complete combustion (stoichiometric O₂)", "Yellow/orange flame: incomplete combustion (insufficient O₂)", "Water vapor condenses on cool surfaces", "Blue flame is hotter (~1950 °C) than yellow (~1200 °C)"],
      as: ["নীলা জ্বালা: সম্পূৰ্ণ দহন (ষ্ট’ইক’মেট্ৰিক O₂)", "হালধীয়া/কমলা জ্বালা: অসম্পূৰ্ণ দহন (অপৰ্যাপ্ত O₂)", "পানীৰ বাষ্প শীতল পৃষ্ঠত ঘনীভূত হয়", "নীলা জ্বালা (~১৯৫০ °C) হালধীয়াতকৈ (~১২০০ °C) বেছি গৰম"],
    },
    controls: [
      { label: { en: "Air Intake", as: "বায়ু গ্ৰহণ" }, min: 0, max: 100, unit: "%", key: "air" },
    ],
    quiz: [
      { q: { en: "Complete combustion of methane produces:", as: "মিথেনৰ সম্পূৰ্ণ দহনে উৎপন্ন কৰে:" }, opts: { en: ["CO + H₂", "CO₂ + H₂O", "C + H₂O", "CO₂ + H₂"], as: ["CO + H₂", "CO₂ + H₂O", "C + H₂O", "CO₂ + H₂"] }, ans: 1 },
      { q: { en: "A blue Bunsen flame indicates:", as: "বানচেন বাৰ্নাৰৰ নীলা জ্বালাই সূচায়:" }, opts: { en: ["Incomplete combustion", "Complete combustion", "No combustion", "Partial oxidation"], as: ["অসম্পূৰ্ণ দহন", "সম্পূৰ্ণ দহন", "দহন নাই", "আংশিক জাৰণ"] }, ans: 1 },
      { q: { en: "How many moles of O₂ does 1 mole of CH₄ require?", as: "১ ম’ল CH₄-ক কিমান ম’ল O₂ লাগে?" }, opts: { en: ["1", "2", "3", "4"], as: ["1", "2", "3", "4"] }, ans: 1 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// CANVAS PARTICLE ENGINE
// ═══════════════════════════════════════════════════════════════

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, mode: ParticleMode, intensity = 1.0) {
  const particles = useRef<Particle[]>([]);
  const frame = useRef(0);
  const pidRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode === "none") { particles.current = []; return; }
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const spawn = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, base = H * 0.72;

      const add = (p: Omit<Particle, "life"> & { life?: number }) =>
        particles.current.push({ life: p.maxLife, ...p });

      const id = pidRef.current++;

      switch (mode) {
        case "mg-fire":
          for (let i = 0; i < Math.ceil(4 * intensity); i++) {
            const life = 35 + Math.random() * 25;
            add({ x: cx + (Math.random() - .5) * 14, y: base - 10, vx: (Math.random() - .5) * 3.5, vy: -(3 + Math.random() * 5), maxLife: life, size: 2 + Math.random() * 3, color: ["#FFFFFF","#FFFDE7","#FFF176","#FFE566","#FFCA28"][Math.floor(Math.random() * 5)], blur: 18, type: "fire" });
          }
          // Smoke
          if (Math.random() < 0.3) {
            const life = 80 + Math.random() * 40;
            add({ x: cx + (Math.random() - .5) * 10, y: base - 40, vx: (Math.random() - .5) * 1.2, vy: -(1.5 + Math.random() * 2), maxLife: life, size: 6 + Math.random() * 8, color: "rgba(220,220,220,0.6)", blur: 4, type: "smoke" });
          }
          break;

        case "steam":
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 60 + Math.random() * 50;
            add({ x: cx + (Math.random() - .5) * 30, y: base, vx: (Math.random() - .5) * 1.5, vy: -(2 + Math.random() * 3.5), maxLife: life, size: 5 + Math.random() * 10, color: `rgba(200,230,255,${0.4 + Math.random() * 0.3})`, blur: 8, type: "steam" });
          }
          break;

        case "explosion":
          if (intensity > 0.5 && Math.random() < 0.7) {
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
              const speed = 4 + Math.random() * 8;
              const life = 20 + Math.random() * 20;
              add({ x: cx, y: base, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3, maxLife: life, size: 3 + Math.random() * 4, color: ["#FF6B35","#FFE066","#FF4444","#FFFFFF"][Math.floor(Math.random() * 4)], blur: 20, type: "spark" });
            }
          }
          // Water droplets after controlled reaction
          if (intensity < 0.5) {
            for (let i = 0; i < 3; i++) {
              const life = 50 + Math.random() * 30;
              add({ x: cx + (Math.random() - .5) * W * 0.5, y: H * 0.3 + Math.random() * 0.2 * H, vx: (Math.random() - .5) * 2, vy: 1 + Math.random() * 2, maxLife: life, size: 3 + Math.random() * 4, color: "#60A5FA", blur: 6, type: "water" });
            }
          }
          break;

        case "haber-gas":
          for (let i = 0; i < Math.ceil(5 * intensity); i++) {
            const angle = Math.random() * Math.PI * 2;
            add({ x: cx + Math.cos(angle) * 60, y: base - 20 + Math.sin(angle) * 20, vx: (Math.random() - .5) * 2, vy: -(1 + Math.random() * 2), maxLife: 60 + Math.random() * 40, size: 2 + Math.random() * 2, color: ["#34D399","#A78BFA","#60A5FA"][Math.floor(Math.random() * 3)], blur: 8, type: "gas" });
          }
          break;

        case "coal-fire":
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 40 + Math.random() * 30;
            add({ x: cx + (Math.random() - .5) * 20, y: base - 5, vx: (Math.random() - .5) * 2, vy: -(2.5 + Math.random() * 4), maxLife: life, size: 3 + Math.random() * 5, color: ["#FF4500","#FF6B35","#FB923C","#FDE047","#FF0000"][Math.floor(Math.random() * 5)], blur: 14, type: "fire" });
          }
          if (Math.random() < 0.4) {
            const life = 100 + Math.random() * 60;
            add({ x: cx + (Math.random() - .5) * 15, y: base - 35, vx: (Math.random() - .5) * 1.5, vy: -(1 + Math.random() * 1.5), maxLife: life, size: 8 + Math.random() * 10, color: `rgba(80,80,80,${0.3 + Math.random() * 0.3})`, blur: 5, type: "smoke" });
          }
          break;

        case "methane-blue":
          for (let i = 0; i < Math.ceil(4 * intensity); i++) {
            const life = 30 + Math.random() * 20;
            add({ x: cx + (Math.random() - .5) * 10, y: base, vx: (Math.random() - .5) * 1.5, vy: -(3 + Math.random() * 4), maxLife: life, size: 2 + Math.random() * 3, color: ["#60A5FA","#38BDF8","#7DD3FC","#BFDBFE","#2563EB"][Math.floor(Math.random() * 5)], blur: 16, type: "fire" });
          }
          break;

        case "methane-yellow":
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 40 + Math.random() * 25;
            add({ x: cx + (Math.random() - .5) * 14, y: base, vx: (Math.random() - .5) * 2, vy: -(2 + Math.random() * 3.5), maxLife: life, size: 3 + Math.random() * 5, color: ["#FCD34D","#FB923C","#F97316","#FBBF24","#EF4444"][Math.floor(Math.random() * 5)], blur: 12, type: "fire" });
          }
          if (Math.random() < 0.5) {
            const life = 80 + Math.random() * 40;
            add({ x: cx + (Math.random() - .5) * 12, y: base - 30, vx: (Math.random() - .5) * 1, vy: -(1 + Math.random() * 1.5), maxLife: life, size: 6 + Math.random() * 8, color: `rgba(60,60,60,${0.3 + Math.random() * 0.25})`, blur: 4, type: "smoke" });
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
        if (p.type === "steam" || p.type === "smoke") { alpha = t < 0.2 ? t / 0.2 * 0.6 : t > 0.6 ? (t - 0.6) / 0.4 * 0.5 : 0.6; }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowBlur = p.blur;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;

        if (p.type === "smoke" || p.type === "steam") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1.5 - t * 0.5), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        if (p.type === "fire" || p.type === "spark") { p.vx *= 0.97; p.vy -= 0.08; }
        if (p.type === "smoke" || p.type === "steam") { p.vx *= 0.995; p.vy *= 0.99; }
        if (p.type === "water") { p.vy += 0.15; p.vx *= 0.98; }
        if (p.type === "gas") { p.vx += (Math.random() - .5) * 0.3; p.vy *= 0.98; }
        p.life--;
      });

      frame.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(frame.current); particles.current = []; };
  }, [mode, intensity, canvasRef]);
}

// ═══════════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════

function GlassPanel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl border ${className}`} style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.08)", ...style }}>
      {children}
    </div>
  );
}

function NeonBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ color, borderColor: `${color}60`, background: `${color}18` }}>{label}</span>
  );
}

function HazardBadge({ level }: { level: "LOW" | "MEDIUM" | "HIGH" | "EXTREME" }) {
  const map = { LOW: "#22C55E", MEDIUM: "#FB923C", HIGH: "#EF4444", EXTREME: "#FF0044" };
  return <NeonBadge label={`⚠ ${level} HAZARD`} color={map[level]} />;
}

function DataRow({ label, value, unit = "", color = "#94a3b8" }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className="text-xs font-black tabular-nums" style={{ color }}>{value}{unit && <span className="font-medium text-slate-500 ml-0.5">{unit}</span>}</span>
    </div>
  );
}

function AnimatedTemp({ target, accent }: { target: number; accent: string }) {
  const [val, setVal] = useState(20);
  useEffect(() => {
    if (target <= 20) { setVal(20); return; }
    const step = (target - 20) / 80;
    let cur = 20;
    const iv = setInterval(() => { cur = Math.min(cur + step, target); setVal(Math.round(cur)); if (cur >= target) clearInterval(iv); }, 25);
    return () => clearInterval(iv);
  }, [target]);
  const pct = Math.min((val / 3000) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1"><Thermometer className="w-3 h-3" />Temperature</span>
        <span className="text-xs font-black tabular-nums" style={{ color: accent }}>{val.toLocaleString()} °C</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 2, ease: "easeOut" }} style={{ background: `linear-gradient(to right, #3B82F6, ${accent}, #EF4444)` }} />
      </div>
    </div>
  );
}

function AnimatedEnergy({ target, accent }: { target: number; accent: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const step = target / 60;
    let cur = 0;
    const iv = setInterval(() => { cur = Math.min(cur + step, target); setVal(Math.round(cur)); if (cur >= target) clearInterval(iv); }, 25);
    return () => clearInterval(iv);
  }, [target]);
  const pct = Math.min((val / 1000) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1"><Zap className="w-3 h-3" />Energy Released</span>
        <span className="text-xs font-black tabular-nums" style={{ color: accent }}>{val} kJ/mol</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 2.5, ease: "easeOut" }} style={{ background: `linear-gradient(to right, ${accent}88, ${accent})` }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APPARATUS SVG COMPONENTS (per experiment)
// ═══════════════════════════════════════════════════════════════

function MgO2Apparatus({ phase }: { phase: Phase }) {
  const reacting = phase === "reacting" || phase === "complete";
  const collected = phase === "complete";
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {/* Bench */}
      <rect x="20" y="195" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Tripod stand */}
      <line x1="150" y1="195" x2="120" y2="195" stroke="#475569" strokeWidth="2.5" />
      <line x1="120" y1="195" x2="105" y2="180" stroke="#475569" strokeWidth="2.5" />
      <line x1="150" y1="195" x2="175" y2="195" stroke="#475569" strokeWidth="2.5" />
      <line x1="175" y1="195" x2="192" y2="180" stroke="#475569" strokeWidth="2.5" />
      {/* Ceramic ring */}
      <ellipse cx="150" cy="150" rx="28" ry="7" fill="none" stroke="#64748b" strokeWidth="3" />
      <line x1="150" y1="143" x2="150" y2="180" stroke="#64748b" strokeWidth="2.5" />
      {/* Crucible */}
      <path d="M128,150 Q128,175 150,177 Q172,175 172,150" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
      {/* Mg ribbon or ash */}
      {!collected ? (
        <rect x="140" y="152" width="20" height="4" rx="1.5" fill={reacting ? "#FFF8DC" : "#C0C0C0"} opacity={reacting ? 0.9 : 1}>
          {reacting && <animate attributeName="opacity" values="1;0.4;1" dur="0.3s" repeatCount="indefinite" />}
        </rect>
      ) : (
        <ellipse cx="150" cy="168" rx="14" ry="4" fill="#F8FAFC" opacity="0.9" />
      )}
      {/* Bunsen burner */}
      <rect x="138" y="180" width="24" height="14" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      <rect x="143" y="176" width="14" height="6" rx="2" fill="#334155" />
      {/* Gas hose */}
      <path d="M138,190 Q110,190 110,210" fill="none" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      {/* White flash overlay during ignition */}
      {reacting && !collected && (
        <ellipse cx="150" cy="150" rx="50" ry="50" fill="white" opacity="0.08">
          <animate attributeName="opacity" values="0.08;0.25;0.08" dur="0.4s" repeatCount="indefinite" />
        </ellipse>
      )}
      {/* Lab bench label */}
      <text x="150" y="210" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">CRUCIBLE STAND</text>
    </svg>
  );
}

function CaOH2OApparatus({ phase }: { phase: Phase }) {
  const pouring = phase === "step2" || phase === "reacting";
  const hot = phase === "reacting" || phase === "complete";
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {/* Bench */}
      <rect x="20" y="195" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Beaker */}
      <path d="M110,90 L110,175 Q110,188 125,188 L175,188 Q190,188 190,175 L190,90 Z" fill="rgba(99,179,237,0.08)" stroke="#38BDF8" strokeWidth="1.5" />
      {/* CaO solid */}
      <ellipse cx="150" cy="180" rx="30" ry="8" fill={hot ? "#FDE68A" : "#F8FAFC"} opacity="0.8">
        {hot && <animate attributeName="fill" values="#FDE68A;#FCA5A5;#FDE68A" dur="1.5s" repeatCount="indefinite" />}
      </ellipse>
      {/* Water level */}
      {(pouring || hot) && (
        <path d="M112,155 L188,155 L188,175 Q188,186 175,186 L125,186 Q112,186 112,175 Z" fill="rgba(96,165,250,0.25)">
          <animate attributeName="d" values="M112,165 L188,165 L188,175 Q188,186 175,186 L125,186 Q112,186 112,175 Z;M112,155 L188,155 L188,175 Q188,186 175,186 L125,186 Q112,186 112,175 Z" dur="2s" fill="freeze" />
        </path>
      )}
      {/* Water dropper/burette */}
      <rect x="160" y="30" width="16" height="55" rx="4" fill="#1e293b" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="165" y="82" width="6" height="10" rx="2" fill="#38BDF8" />
      {/* Water drops falling */}
      {pouring && (
        <>
          <circle cx="168" cy="92" r="2.5" fill="#60A5FA" opacity="0.8">
            <animate attributeName="cy" from="92" to="160" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2" dur="0.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="168" cy="92" r="2.5" fill="#60A5FA" opacity="0.8">
            <animate attributeName="cy" from="92" to="160" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      {/* Thermometer */}
      <rect x="200" y="95" width="8" height="90" rx="4" fill="rgba(255,255,255,0.05)" stroke="#475569" strokeWidth="1" />
      <rect x="202" y={hot ? "120" : "178"} width="4" height={hot ? "65" : "7"} rx="2" fill={hot ? "#EF4444" : "#64748b"}>
        {hot && <animate attributeName="y" from="178" to="120" dur="2s" fill="freeze" />}
        {hot && <animate attributeName="height" from="7" to="65" dur="2s" fill="freeze" />}
      </rect>
      <circle cx="204" cy="187" r="5" fill={hot ? "#EF4444" : "#64748b"} />
      <text x="150" y="212" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">CaO + H₂O REACTION VESSEL</text>
    </svg>
  );
}

function H2O2Apparatus({ phase, h2Vol, o2Vol }: { phase: Phase; h2Vol: number; o2Vol: number }) {
  const isOptimal = Math.abs(h2Vol / (o2Vol || 1) - 2) < 0.3;
  const active = phase === "reacting";
  const complete = phase === "complete";
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {/* Bench */}
      <rect x="20" y="200" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* H₂ cylinder */}
      <rect x="28" y="60" width="40" height="120" rx="8" fill="#1e293b" stroke="#A78BFA" strokeWidth="2" />
      <text x="48" y="115" textAnchor="middle" fill="#A78BFA" fontSize="9" fontWeight="bold">H₂</text>
      <rect x="40" y="55" width="16" height="8" rx="3" fill="#7C3AED" />
      {/* O₂ cylinder */}
      <rect x="232" y="60" width="40" height="120" rx="8" fill="#1e293b" stroke="#38BDF8" strokeWidth="2" />
      <text x="252" y="115" textAnchor="middle" fill="#38BDF8" fontSize="9" fontWeight="bold">O₂</text>
      <rect x="244" y="55" width="16" height="8" rx="3" fill="#0EA5E9" />
      {/* Tubes to chamber */}
      <path d="M68,120 Q100,120 120,140" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeDasharray="5,3">
        <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M232,120 Q200,120 180,140" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5,3">
        <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="1s" repeatCount="indefinite" />
      </path>
      {/* Reaction chamber */}
      <rect x="108" y="100" width="84" height="90" rx="8" fill="rgba(255,255,255,0.03)" stroke={active ? (isOptimal ? "#34D399" : "#EF4444") : "#475569"} strokeWidth="2">
        {active && <animate attributeName="stroke" values={isOptimal ? "#34D399;#22C55E;#34D399" : "#EF4444;#FF6B35;#EF4444"} dur="0.5s" repeatCount="indefinite" />}
      </rect>
      {/* Water droplets after complete */}
      {complete && isOptimal && (
        <>
          {[120, 140, 162, 180].map(x => (
            <circle key={x} cx={x} cy={125} r="3" fill="#60A5FA" opacity="0.7">
              <animate attributeName="cy" from="100" to="185" dur={`${0.5 + Math.random()}s`} begin={`${Math.random()}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </>
      )}
      {/* Pressure gauge */}
      <circle cx="150" cy="90" r="12" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
      <text x="150" y="94" textAnchor="middle" fill="#94a3b8" fontSize="8">PSI</text>
      {/* Ignition button */}
      <circle cx="150" cy="195" r="8" fill={active ? "#EF4444" : "#1e293b"} stroke="#EF4444" strokeWidth="1.5" />
      <text x="150" y="199" textAnchor="middle" fill="#EF4444" fontSize="6" fontWeight="bold">⚡</text>
      <text x="150" y="213" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">H₂/O₂ REACTION CHAMBER</text>
    </svg>
  );
}

function HaberApparatus({ phase, pressure, temperature }: { phase: Phase; pressure: number; temperature: number }) {
  const active = phase === "reacting" || phase === "complete";
  const yield_ = Math.min(100, ((pressure / 350) * 0.5 + (1 - Math.abs(temperature - 450) / 400) * 0.5) * 100);
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {/* Bench */}
      <rect x="20" y="205" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Reactor body */}
      <rect x="100" y="70" width="100" height="120" rx="10" fill="#1e293b" stroke={active ? "#34D399" : "#475569"} strokeWidth="2.5">
        {active && <animate attributeName="stroke" values="#34D399;#059669;#34D399" dur="2s" repeatCount="indefinite" />}
      </rect>
      {/* Catalyst bed inside */}
      <rect x="112" y="140" width="76" height="30" rx="4" fill={active ? "#78350F" : "#292524"} opacity="0.9" />
      <text x="150" y="158" textAnchor="middle" fill="#FB923C" fontSize="7" fontWeight="bold">Fe CATALYST</text>
      {/* N₂ inlet */}
      <rect x="40" y="100" width="60" height="20" rx="5" fill="#1e293b" stroke="#A78BFA" strokeWidth="1.5" />
      <text x="70" y="113" textAnchor="middle" fill="#A78BFA" fontSize="8">N₂</text>
      <line x1="100" y1="110" x2="100" y2="110" stroke="#A78BFA" strokeWidth="2" />
      {/* H₂ inlet */}
      <rect x="40" y="130" width="60" height="20" rx="5" fill="#1e293b" stroke="#38BDF8" strokeWidth="1.5" />
      <text x="70" y="143" textAnchor="middle" fill="#38BDF8" fontSize="8">3H₂</text>
      {/* Outlet pipe */}
      <path d="M200,110 L250,110 L250,150" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
      {/* NH₃ collection */}
      <rect x="220" y="150" width="50" height="45" rx="6" fill="rgba(52,211,153,0.08)" stroke="#34D399" strokeWidth="1.5" />
      <text x="245" y="176" textAnchor="middle" fill="#34D399" fontSize="7" fontWeight="bold">NH₃</text>
      {/* Yield bar */}
      {active && (
        <>
          <rect x="112" y="82" width="76" height="10" rx="2" fill="rgba(255,255,255,0.04)" />
          <rect x="112" y="82" width={76 * yield_ / 100} height="10" rx="2" fill="#34D399" opacity="0.8">
            <animate attributeName="width" from="0" to={76 * yield_ / 100} dur="3s" fill="freeze" />
          </rect>
          <text x="150" y="91" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">{Math.round(yield_)}% YIELD</text>
        </>
      )}
      {/* Pressure gauge */}
      <circle cx="150" cy="65" r="12" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
      <text x="150" y="62" textAnchor="middle" fill="#94a3b8" fontSize="6">{pressure}</text>
      <text x="150" y="71" textAnchor="middle" fill="#64748b" fontSize="5">atm</text>
      <text x="150" y="215" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">HABER PROCESS REACTOR</text>
    </svg>
  );
}

function CO2Apparatus({ phase, oxygenPct }: { phase: Phase; oxygenPct: number }) {
  const reacting = phase === "reacting" || phase === "complete";
  const brightness = oxygenPct / 100;
  const color = `hsl(${30 - brightness * 10},100%,${40 + brightness * 20}%)`;
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      <rect x="20" y="200" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Combustion chamber */}
      <rect x="90" y="80" width="120" height="115" rx="8" fill="rgba(255,255,255,0.02)" stroke="#475569" strokeWidth="2" />
      {/* Carbon block */}
      <rect x="120" y="155" width="60" height="30" rx="3" fill={reacting ? color : "#1C1917"} stroke="#44403C" strokeWidth="1">
        {reacting && <animate attributeName="fill" values={`${color};#FF6B35;${color}`} dur="1.5s" repeatCount="indefinite" />}
      </rect>
      <text x="150" y="174" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontWeight="bold">C</text>
      {/* O₂ supply pipe */}
      <rect x="30" y="125" width="60" height="20" rx="5" fill="#1e293b" stroke="#FB923C" strokeWidth="1.5" />
      <text x="60" y="138" textAnchor="middle" fill="#FB923C" fontSize="8">O₂ {oxygenPct}%</text>
      <path d="M90,135 L90,135" fill="none" stroke="#FB923C" strokeWidth="2" />
      {/* CO₂ outlet */}
      <path d="M210,130 L260,130" fill="none" stroke="#64748b" strokeWidth="2.5" />
      <rect x="240" y="115" width="45" height="35" rx="5" fill="rgba(255,255,255,0.03)" stroke="#64748b" strokeWidth="1.5" />
      <text x="262" y="130" textAnchor="middle" fill="#64748b" fontSize="7">CO₂</text>
      <text x="262" y="141" textAnchor="middle" fill="#475569" fontSize="6">analyzer</text>
      {/* Gas analyzer indicator */}
      {reacting && <circle cx="262" cy="120" r="4" fill="#34D399"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" /></circle>}
      {/* Temperature display */}
      <text x="150" y="100" textAnchor="middle" fill={reacting ? "#FB923C" : "#475569"} fontSize="9" fontWeight="bold">
        {reacting ? `${Math.round(500 + oxygenPct * 2)} °C` : "— °C"}
      </text>
      <text x="150" y="212" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">COMBUSTION CHAMBER</text>
    </svg>
  );
}

function CH4O2Apparatus({ phase, airPct }: { phase: Phase; airPct: number }) {
  const reacting = phase === "reacting" || phase === "complete";
  const isBlue = airPct > 60;
  const flameColor = isBlue ? "#60A5FA" : "#FB923C";
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      <rect x="20" y="205" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Burner base */}
      <rect x="120" y="175" width="60" height="25" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      {/* Burner barrel */}
      <rect x="135" y="140" width="30" height="38" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Air hole */}
      <ellipse cx="150" cy="158" rx="8" ry="4" fill="#0F172A" stroke={isBlue ? "#60A5FA" : "#FB923C"} strokeWidth="1.5" />
      {/* Gas supply */}
      <path d="M120,190 Q90,190 90,210" fill="none" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
      <text x="60" y="200" textAnchor="middle" fill="#60A5FA" fontSize="7">CH₄</text>
      {/* Air control */}
      <rect x="225" y="150" width="50" height="20" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
      <text x="250" y="162" textAnchor="middle" fill="#94a3b8" fontSize="7">Air {airPct}%</text>
      {/* Flame body */}
      {reacting && (
        <>
          <ellipse cx="150" cy="115" rx="18" ry="28" fill={flameColor} opacity="0.85">
            <animate attributeName="ry" values="28;36;28" dur="0.35s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0.95;0.85" dur="0.28s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="150" cy="105" rx="10" ry="18" fill={isBlue ? "#93C5FD" : "#FDE68A"} opacity="0.9">
            <animate attributeName="ry" values="18;24;18" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="150" cy="96" rx="4" ry="8" fill="white" opacity="0.85" />
        </>
      )}
      {/* Beaker with water vapor condensation */}
      <rect x="220" y="60" width="60" height="80" rx="5" fill="rgba(96,165,250,0.05)" stroke="#475569" strokeWidth="1.5" />
      {phase === "complete" && (
        <text x="250" y="105" textAnchor="middle" fill="#60A5FA" fontSize="7">H₂O↑</text>
      )}
      <text x="150" y="215" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">BUNSEN BURNER — METHANE</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOLECULAR VISUALIZATION
// ═══════════════════════════════════════════════════════════════

const MOLECULE_CONFIGS: Record<ExpId, { before: React.ReactNode; after: React.ReactNode }> = {
  "mg-o2": {
    before: (
      <g>
        {/* 2 Mg atoms */}
        <circle cx="60" cy="50" r="14" fill="#B8B8FF" filter="url(#glow)" />
        <text x="60" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Mg</text>
        <circle cx="105" cy="50" r="14" fill="#B8B8FF" filter="url(#glow)" />
        <text x="105" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Mg</text>
        {/* O₂ molecule */}
        <circle cx="185" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="185" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <line x1="197" y1="48" x2="213" y2="48" stroke="#FF6B6B" strokeWidth="2.5" />
        <line x1="197" y1="52" x2="213" y2="52" stroke="#FF6B6B" strokeWidth="2.5" />
        <circle cx="225" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="225" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        {/* + sign */}
        <text x="147" y="55" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="bold">+</text>
      </g>
    ),
    after: (
      <g>
        {/* 2 MgO units */}
        <circle cx="80" cy="50" r="14" fill="#B8B8FF" filter="url(#glow)" />
        <text x="80" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Mg</text>
        <line x1="94" y1="50" x2="106" y2="50" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="120" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="120" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>

        <circle cx="175" cy="50" r="14" fill="#B8B8FF" filter="url(#glow)" />
        <text x="175" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Mg</text>
        <line x1="189" y1="50" x2="201" y2="50" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="215" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="215" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
      </g>
    ),
  },
  "cao-h2o": {
    before: (
      <g>
        <circle cx="75" cy="50" r="16" fill="#F59E0B" filter="url(#glow)" />
        <text x="75" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Ca</text>
        <line x1="91" y1="50" x2="103" y2="50" stroke="white" strokeWidth="2" />
        <circle cx="115" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="115" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <text x="147" y="55" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="bold">+</text>
        <circle cx="185" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="185" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <line x1="197" y1="45" x2="208" y2="38" stroke="#38BDF8" strokeWidth="2" />
        <line x1="197" y1="55" x2="208" y2="62" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="215" cy="35" r="8" fill="#38BDF8" filter="url(#glow)" />
        <text x="215" y="39" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
        <circle cx="215" cy="65" r="8" fill="#38BDF8" filter="url(#glow)" />
        <text x="215" y="69" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="90" cy="50" r="16" fill="#F59E0B" filter="url(#glow)" />
        <text x="90" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Ca</text>
        <line x1="106" y1="50" x2="118" y2="50" stroke="white" strokeWidth="2" />
        <circle cx="130" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="130" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <line x1="142" y1="50" x2="153" y2="50" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="162" cy="50" r="8" fill="#38BDF8" filter="url(#glow)" />
        <text x="162" y="54" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>

        <line x1="106" y1="50" x2="118" y2="73" stroke="white" strokeWidth="2" />
        <circle cx="130" cy="78" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="130" y="83" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <line x1="142" y1="78" x2="153" y2="78" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="162" cy="78" r="8" fill="#38BDF8" filter="url(#glow)" />
        <text x="162" y="82" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
      </g>
    ),
  },
  "h2-o2": {
    before: (
      <g>
        {[40, 90].map(x => (
          <g key={x}>
            <circle cx={x} cy="50" r="10" fill="#38BDF8" filter="url(#glow)" />
            <text x={x} y="55" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
            <line x1={x + 10} y1="50" x2={x + 20} y2="50" stroke="#38BDF8" strokeWidth="2.5" />
            <circle cx={x + 30} cy="50" r="10" fill="#38BDF8" filter="url(#glow)" />
            <text x={x + 30} y="55" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
          </g>
        ))}
        <text x="155" y="55" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold">+</text>
        <circle cx="195" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="195" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <line x1="207" y1="48" x2="219" y2="48" stroke="#FF6B6B" strokeWidth="2" />
        <line x1="207" y1="52" x2="219" y2="52" stroke="#FF6B6B" strokeWidth="2" />
        <circle cx="231" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="231" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
      </g>
    ),
    after: (
      <g>
        {[55, 155].map(cx => (
          <g key={cx}>
            <circle cx={cx} cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
            <text x={cx} y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
            <line x1={cx - 12} y1="44" x2={cx - 24} y2="36" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={cx - 30} cy="32" r="9" fill="#38BDF8" filter="url(#glow)" />
            <text x={cx - 30} y="37" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
            <line x1={cx - 12} y1="56" x2={cx - 24} y2="64" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={cx - 30} cy="68" r="9" fill="#38BDF8" filter="url(#glow)" />
            <text x={cx - 30} y="73" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
          </g>
        ))}
      </g>
    ),
  },
  "n2-h2": {
    before: (
      <g>
        <circle cx="65" cy="50" r="13" fill="#A78BFA" filter="url(#glow)" />
        <text x="65" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">N</text>
        <line x1="78" y1="46" x2="92" y2="46" stroke="#A78BFA" strokeWidth="2.5" />
        <line x1="78" y1="50" x2="92" y2="50" stroke="#A78BFA" strokeWidth="2.5" />
        <line x1="78" y1="54" x2="92" y2="54" stroke="#A78BFA" strokeWidth="2.5" />
        <circle cx="105" cy="50" r="13" fill="#A78BFA" filter="url(#glow)" />
        <text x="105" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">N</text>
        <text x="137" y="55" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold">+</text>
        {[165, 195, 225].map(x => (
          <g key={x}>
            <circle cx={x} cy="45" r="8" fill="#38BDF8" filter="url(#glow)" />
            <text x={x} y="49" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
            <line x1={x + 8} y1="45" x2={x + 12} y2="45" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={x + 20} cy="45" r="8" fill="#38BDF8" filter="url(#glow)" />
            <text x={x + 20} y="49" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
          </g>
        ))}
      </g>
    ),
    after: (
      <g>
        {[75, 175].map(cx => (
          <g key={cx}>
            <circle cx={cx} cy="50" r="13" fill="#A78BFA" filter="url(#glow)" />
            <text x={cx} y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">N</text>
            <line x1={cx - 13} y1="40" x2={cx - 24} y2="30" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={cx - 30} cy="25" r="9" fill="#38BDF8" filter="url(#glow)" />
            <text x={cx - 30} y="29" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
            <line x1={cx} y1="37" x2={cx} y2="25" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={cx} cy="19" r="9" fill="#38BDF8" filter="url(#glow)" />
            <text x={cx} y="23" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
            <line x1={cx + 13} y1="40" x2={cx + 24} y2="30" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={cx + 30} cy="25" r="9" fill="#38BDF8" filter="url(#glow)" />
            <text x={cx + 30} y="29" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">H</text>
          </g>
        ))}
      </g>
    ),
  },
  "c-o2": {
    before: (
      <g>
        <circle cx="75" cy="50" r="15" fill="#44403C" filter="url(#glow)" />
        <text x="75" y="55" textAnchor="middle" fill="#D6D3D1" fontSize="10" fontWeight="bold">C</text>
        <text x="140" y="55" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold">+</text>
        <circle cx="190" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="190" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <line x1="202" y1="48" x2="218" y2="48" stroke="#FF6B6B" strokeWidth="2" />
        <line x1="202" y1="52" x2="218" y2="52" stroke="#FF6B6B" strokeWidth="2" />
        <circle cx="230" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="230" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="90" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="90" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <line x1="102" y1="48" x2="118" y2="48" stroke="#44403C" strokeWidth="2" />
        <line x1="102" y1="52" x2="118" y2="52" stroke="#44403C" strokeWidth="2" />
        <circle cx="130" cy="50" r="14" fill="#44403C" filter="url(#glow)" />
        <text x="130" y="55" textAnchor="middle" fill="#D6D3D1" fontSize="9" fontWeight="bold">C</text>
        <line x1="144" y1="48" x2="160" y2="48" stroke="#FF6B6B" strokeWidth="2" />
        <line x1="144" y1="52" x2="160" y2="52" stroke="#FF6B6B" strokeWidth="2" />
        <circle cx="172" cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
        <text x="172" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <text x="130" y="78" textAnchor="middle" fill="#FB923C" fontSize="8">CO₂</text>
      </g>
    ),
  },
  "ch4-o2": {
    before: (
      <g>
        {/* CH₄ tetrahedral */}
        <circle cx="80" cy="50" r="14" fill="#44403C" filter="url(#glow)" />
        <text x="80" y="55" textAnchor="middle" fill="#D6D3D1" fontSize="9" fontWeight="bold">C</text>
        {[[80,28],[58,63],[102,63],[80,72]].map(([hx,hy],i) => (
          <g key={i}>
            <line x1="80" y1="50" x2={hx} y2={hy} stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx={hx} cy={hy} r="8" fill="#38BDF8" filter="url(#glow)" />
            <text x={hx} y={hy + 4} textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">H</text>
          </g>
        ))}
        <text x="130" y="55" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold">+</text>
        {/* 2 O₂ */}
        {[160, 205].map(x => (
          <g key={x}>
            <circle cx={x} cy="45" r="10" fill="#FF6B6B" filter="url(#glow)" />
            <text x={x} y="49" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">O</text>
            <line x1={x + 10} y1="43" x2={x + 18} y2="43" stroke="#FF6B6B" strokeWidth="1.5" />
            <line x1={x + 10} y1="47" x2={x + 18} y2="47" stroke="#FF6B6B" strokeWidth="1.5" />
            <circle cx={x + 28} cy="45" r="10" fill="#FF6B6B" filter="url(#glow)" />
            <text x={x + 28} y="49" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">O</text>
          </g>
        ))}
      </g>
    ),
    after: (
      <g>
        {/* CO₂ */}
        <circle cx="55" cy="50" r="10" fill="#FF6B6B" filter="url(#glow)" />
        <text x="55" y="54" textAnchor="middle" fill="white" fontSize="7">O</text>
        <line x1="65" y1="48" x2="78" y2="48" stroke="#44403C" strokeWidth="2" />
        <line x1="65" y1="52" x2="78" y2="52" stroke="#44403C" strokeWidth="2" />
        <circle cx="90" cy="50" r="12" fill="#44403C" filter="url(#glow)" />
        <text x="90" y="54" textAnchor="middle" fill="#D6D3D1" fontSize="9">C</text>
        <line x1="102" y1="48" x2="115" y2="48" stroke="#FF6B6B" strokeWidth="2" />
        <line x1="102" y1="52" x2="115" y2="52" stroke="#FF6B6B" strokeWidth="2" />
        <circle cx="127" cy="50" r="10" fill="#FF6B6B" filter="url(#glow)" />
        <text x="127" y="54" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="90" y="72" textAnchor="middle" fill="#FB923C" fontSize="7">CO₂</text>
        {/* 2 H₂O */}
        {[175, 225].map(cx => (
          <g key={cx}>
            <circle cx={cx} cy="50" r="12" fill="#FF6B6B" filter="url(#glow)" />
            <text x={cx} y="55" textAnchor="middle" fill="white" fontSize="8">O</text>
            <line x1={cx - 12} y1="43" x2={cx - 22} y2="33" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={cx - 27} cy="28" r="8" fill="#38BDF8" filter="url(#glow)" />
            <text x={cx - 27} y="32" textAnchor="middle" fill="white" fontSize="6">H</text>
            <line x1={cx + 12} y1="43" x2={cx + 22} y2="33" stroke="#38BDF8" strokeWidth="2" />
            <circle cx={cx + 27} cy="28" r="8" fill="#38BDF8" filter="url(#glow)" />
            <text x={cx + 27} y="32" textAnchor="middle" fill="white" fontSize="6">H</text>
            <text x={cx} y="72" textAnchor="middle" fill="#38BDF8" fontSize="7">H₂O</text>
          </g>
        ))}
      </g>
    ),
  },
};

function MolecularPanel({ expId, phase, accent }: { expId: ExpId; phase: Phase; accent: string }) {
  const showAfter = phase === "complete";
  const config = MOLECULE_CONFIGS[expId];
  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Molecular View</span>
        <span className="text-[10px] font-black" style={{ color: accent }}>{showAfter ? "Products" : "Reactants"}</span>
      </div>
      <div className="relative">
        <svg viewBox="0 0 300 100" className="w-full" style={{ height: 90 }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <AnimatePresence mode="wait">
            <motion.g key={showAfter ? "after" : "before"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              {showAfter ? config.after : config.before}
            </motion.g>
          </AnimatePresence>
        </svg>
        {!showAfter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {phase === "reacting" && (
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity }} className="text-xl">⚡</motion.div>
            )}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUIZ SECTION
// ═══════════════════════════════════════════════════════════════

function QuizSection({ exp, accent }: { exp: ExpConfig; accent: string }) {
  const { recordQuizResult } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [answers, setAnswers] = useState<(number | null)[]>(exp.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.filter((a, i) => a === exp.quiz[i].ans).length;

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4" style={{ color: accent }} />
        <span className="text-sm font-black text-white">{isAs ? "দ্ৰুত কুইজ" : "Quick Quiz"}</span>
        {submitted && <NeonBadge label={`${score}/${exp.quiz.length} ${isAs ? "শুদ্ধ" : "Correct"}`} color={score === exp.quiz.length ? "#34D399" : "#FB923C"} />}
      </div>
      <div className="space-y-4">
        {exp.quiz.map((q, qi) => {
          const qText = pickLang(q.q, lang);
          const qOpts = pickLang(q.opts, lang);
          return (
            <div key={qi}>
              <p className="text-xs font-semibold text-slate-300 mb-2">{qi + 1}. {qText}</p>
              <div className="grid grid-cols-2 gap-2">
                {qOpts.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  const correct = submitted && oi === q.ans;
                  const wrong = submitted && selected && oi !== q.ans;
                  return (
                    <button key={oi} disabled={submitted} onClick={() => setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                      className="text-[11px] font-semibold px-3 py-2 rounded-xl text-left transition-all border"
                      style={{ borderColor: correct ? "#34D399" : wrong ? "#EF4444" : selected ? accent : "rgba(255,255,255,0.1)", background: correct ? "rgba(52,211,153,0.15)" : wrong ? "rgba(239,68,68,0.15)" : selected ? `${accent}22` : "rgba(255,255,255,0.03)", color: correct ? "#34D399" : wrong ? "#EF4444" : selected ? accent : "#94a3b8" }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!submitted && (
        <button onClick={() => { const correct = answers.filter((a, i) => a === exp.quiz[i].ans).length; recordQuizResult({ score: Math.round((correct / exp.quiz.length) * 100), totalCorrect: correct, totalAttempted: exp.quiz.length }); setSubmitted(true); }} disabled={answers.some(a => a === null)}
          className="mt-4 w-full py-2.5 rounded-xl text-xs font-black text-white transition-all disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${accent}88, ${accent})` }}>
          {isAs ? "উত্তৰ জমা দিয়ক" : "Submit Answers"}
        </button>
      )}
      {submitted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
          <div className="text-2xl mb-1">{score === exp.quiz.length ? "🎉" : score >= exp.quiz.length / 2 ? "👍" : "📚"}</div>
          <p className="text-xs font-black" style={{ color: accent }}>
            {score === exp.quiz.length
              ? (isAs ? "সম্পূৰ্ণ নম্বৰ!" : "Perfect score!")
              : score >= exp.quiz.length / 2
                ? (isAs ? "ভাল কাম!" : "Good job!")
                : (isAs ? "পৰীক্ষাটো পুনৰ চাই চেষ্টা কৰক!" : "Review the experiment and try again!")}
          </p>
          <button onClick={() => { setAnswers(exp.quiz.map(() => null)); setSubmitted(false); }} className="mt-2 text-[10px] text-slate-400 underline underline-offset-2">{isAs ? "কুইজ পুনৰ আৰম্ভ কৰক" : "Reset Quiz"}</button>
        </motion.div>
      )}
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPERIMENT ROOM (main simulation view)
// ═══════════════════════════════════════════════════════════════

function ExperimentRoom({ exp, onBack }: { exp: ExpConfig; onBack: () => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  // Pre-compute translated fields once per render
  const expTitle = pickLang(exp.title, lang);
  const expDesc = pickLang(exp.description, lang);
  const expRealWorld = pickLang(exp.realWorld, lang);
  const expReactionType = pickLang(exp.reactionType, lang);
  const expSafety = pickLang(exp.safety, lang);
  const expObservations = pickLang(exp.observations, lang);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [controls, setControls] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    exp.controls?.forEach(c => { init[c.key] = Math.round((c.min + c.max) / 2); });
    return init;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to quiz section whenever it becomes visible (either after
  // experiment completion or when the student taps "Take Quiz").
  useEffect(() => {
    if (!showQuiz) return;
    const id = setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
    return () => clearTimeout(id);
  }, [showQuiz]);

  // Determine particle mode
  const particleMode: ParticleMode = phase === "idle" ? "none"
    : exp.id === "mg-o2" ? "mg-fire"
    : exp.id === "cao-h2o" ? "steam"
    : exp.id === "h2-o2" ? "explosion"
    : exp.id === "n2-h2" ? "haber-gas"
    : exp.id === "c-o2" ? "coal-fire"
    : exp.id === "ch4-o2" ? ((controls.air ?? 50) > 60 ? "methane-blue" : "methane-yellow")
    : "none";

  const particleIntensity = phase === "reacting" ? 1.0 : phase === "complete" ? 0.2 : 0.5;
  const h2Vol = controls.h2 ?? 67;
  const o2Vol = controls.o2 ?? 33;
  const isOptimalH2O2 = Math.abs(h2Vol / (o2Vol || 1) - 2) < 0.4;

  useParticles(canvasRef, particleMode, particleIntensity);

  // Resize canvas to parent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obs = new ResizeObserver(() => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; });
    obs.observe(canvas);
    return () => obs.disconnect();
  }, []);

  const nextStep = () => {
    if (stepIdx < exp.steps.length - 1) {
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next === 2) setPhase("reacting");
      else if (next < 2) setPhase(`step${next + 1}` as Phase);
    } else {
      setPhase("complete");
      setShowQuiz(true);
    }
  };

  const reset = () => { setPhase("idle"); setStepIdx(0); setShowQuiz(false); };

  const tempTarget = phase === "reacting" || phase === "complete"
    ? parseInt(exp.peakTemp.replace(/[^0-9]/g, "").slice(0, 4)) || 500
    : 20;
  const energyTarget = phase === "complete"
    ? Math.abs(parseInt(exp.energy.replace(/[^0-9]/g, "")) || 0)
    : 0;

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
          <HazardBadge level={exp.hazard} />
        </div>
        <LanguageToggle />
        <button onClick={() => setShowSafety(s => !s)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5 shrink-0">
          <Shield className="w-4 h-4 text-slate-400" />
        </button>
        <button onClick={reset} className="p-1.5 rounded-lg transition-colors hover:bg-white/5 shrink-0">
          <RotateCcw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Safety overlay */}
      <AnimatePresence>
        {showSafety && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-3 p-3 rounded-xl border shrink-0"
            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-black text-red-300">{isAs ? "সুৰক্ষাৰ সতৰ্কতা" : "Safety Precautions"}</span>
              <button onClick={() => setShowSafety(false)} className="ml-auto text-slate-500 hover:text-white">✕</button>
            </div>
            {expSafety.map((s, i) => (
              <div key={i} className="flex items-start gap-2 mb-1">
                <span className="text-red-400 text-xs mt-0.5">•</span>
                <span className="text-xs text-red-200">{s}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left — Simulation area */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Canvas + Apparatus */}
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 220 }}>
            {/* Animated grid background */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`,
              backgroundSize: "24px 24px",
            }} />
            {/* Apparatus SVG */}
            <div className="absolute inset-0 p-4">
              {exp.id === "mg-o2" && <MgO2Apparatus phase={phase} />}
              {exp.id === "cao-h2o" && <CaOH2OApparatus phase={phase} />}
              {exp.id === "h2-o2" && <H2O2Apparatus phase={phase} h2Vol={h2Vol} o2Vol={o2Vol} />}
              {exp.id === "n2-h2" && <HaberApparatus phase={phase} pressure={controls.pressure ?? 200} temperature={controls.temperature ?? 400} />}
              {exp.id === "c-o2" && <CO2Apparatus phase={phase} oxygenPct={controls.oxygen ?? 50} />}
              {exp.id === "ch4-o2" && <CH4O2Apparatus phase={phase} airPct={controls.air ?? 50} />}
            </div>
            {/* Particle canvas overlay */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen" }} />
            {/* Phase badge */}
            <div className="absolute top-2 right-2">
              <NeonBadge
                label={
                  phase === "idle"     ? (isAs ? "সাজু" : "READY")
                  : phase === "reacting" ? (isAs ? "বিক্ৰিয়া চলিছে" : "REACTING")
                  : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "COMPLETE")
                  : `${isAs ? "পদক্ষেপ" : "STEP"} ${stepIdx + 1}`
                }
                color={phase === "reacting" ? exp.accent : phase === "complete" ? "#34D399" : "#60A5FA"}
              />
            </div>
          </GlassPanel>

          {/* Step controls */}
          <GlassPanel className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {phase === "complete"
                  ? (isAs ? "✅ পৰীক্ষা সম্পূৰ্ণ" : "✅ Experiment Complete")
                  : (isAs ? `${exp.steps.length}-ৰ ${stepIdx + 1} নং পদক্ষেপ` : `Step ${stepIdx + 1} of ${exp.steps.length}`)
                }
              </span>
              {phase !== "idle" && (
                <div className="flex gap-1">
                  {exp.steps.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: i <= stepIdx ? exp.accent : "rgba(255,255,255,0.15)" }} />
                  ))}
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="mb-3">
                {phase === "idle" ? (
                  <div>
                    <p className="text-sm font-black text-white mb-1">{pickLang(exp.steps[0].label, lang)}</p>
                    <p className="text-xs text-slate-400">{pickLang(exp.steps[0].desc, lang)}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-black text-white mb-1">{pickLang(exp.steps[stepIdx].label, lang)}</p>
                    <p className="text-xs text-slate-400">{pickLang(exp.steps[stepIdx].desc, lang)}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Controls (sliders) */}
            {exp.controls && phase !== "complete" && (
              <div className="mb-3 space-y-2">
                {exp.controls.map(c => (
                  <div key={c.key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-slate-400 font-semibold">{pickLang(c.label, lang)}</span>
                      <span className="text-[10px] font-black tabular-nums" style={{ color: exp.accent }}>{controls[c.key] ?? Math.round((c.min + c.max) / 2)} {c.unit}</span>
                    </div>
                    <input type="range" min={c.min} max={c.max} value={controls[c.key] ?? Math.round((c.min + c.max) / 2)}
                      onChange={e => setControls(p => ({ ...p, [c.key]: parseInt(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: exp.accent }} />
                  </div>
                ))}
              </div>
            )}

            {phase !== "complete" ? (
              <button onClick={phase === "idle" ? () => { setPhase("step1"); } : nextStep}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
                <Play className="w-4 h-4" />
                {phase === "idle"
                  ? (isAs ? "পৰীক্ষা আৰম্ভ কৰক" : "Start Experiment")
                  : stepIdx < exp.steps.length - 1
                    ? `${isAs ? "পৰৱৰ্তী:" : "Next:"} ${pickLang(exp.steps[stepIdx + 1].label, lang)}`
                    : (isAs ? "পৰীক্ষা সম্পূৰ্ণ কৰক" : "Complete Experiment")
                }
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={reset} className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-black border transition-all hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                  <RotateCcw className="w-3.5 h-3.5" /> {isAs ? "পুনৰাবৃত্তি" : "Repeat"}
                </button>
                <button onClick={() => setShowQuiz(true)} className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-black text-white transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>
                  <BarChart2 className="w-3.5 h-3.5" /> {isAs ? "কুইজ দিয়ক" : "Take Quiz"}
                </button>
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Middle — Data + Observations */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Equation panel */}
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সমতুল্য সমীকৰণ" : "Balanced Equation"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-sm border" style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>
              {exp.equation}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="rounded-lg py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[9px] text-slate-500 mb-0.5">{isAs ? "প্ৰকাৰ" : "Type"}</p>
                <p className="text-[10px] font-black text-slate-300 leading-tight">{expReactionType.split(" · ")[0]}</p>
              </div>
              <div className="rounded-lg py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[9px] text-slate-500 mb-0.5">{isAs ? "শক্তি" : "Energy"}</p>
                <p className="text-[10px] font-black leading-tight" style={{ color: exp.accent }}>{exp.energy}</p>
              </div>
              <div className="rounded-lg py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[9px] text-slate-500 mb-0.5">{isAs ? "চৰম উষ্ণতা" : "Peak Temp"}</p>
                <p className="text-[10px] font-black text-orange-400 leading-tight">{exp.peakTemp}</p>
              </div>
            </div>
          </GlassPanel>

          {/* Live data panel */}
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "প্ৰত্যক্ষ মাপ" : "Live Measurements"}</p>
            <div className="space-y-3">
              <AnimatedTemp target={tempTarget} accent={exp.accent} />
              <AnimatedEnergy target={energyTarget} accent={exp.accent} />
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "বিক্ৰিয়াৰ প্ৰকাৰ" : "Reaction Type"} value={expReactionType.split(" · ").slice(1).join(" · ") || expReactionType.split(" · ")[0]} color={exp.accent} />
              <DataRow label={isAs ? "বিপদৰ মাত্ৰা" : "Hazard Level"} value={exp.hazard} color={exp.hazard === "EXTREME" ? "#FF0044" : exp.hazard === "HIGH" ? "#EF4444" : exp.hazard === "MEDIUM" ? "#FB923C" : "#22C55E"} />
              {exp.id === "h2-o2" && <DataRow label={isAs ? "H₂:O₂ অনুপাত" : "H₂:O₂ Ratio"} value={`${h2Vol}:${o2Vol}`} color={isOptimalH2O2 ? "#34D399" : "#EF4444"} />}
              {exp.id === "n2-h2" && <DataRow label={isAs ? "প্ৰভাৱক" : "Catalyst"} value={isAs ? "লোহা (Fe)" : "Iron (Fe)"} color="#FB923C" />}
              <DataRow label={isAs ? "বিক্ৰিয়াৰ অৱস্থা" : "Reaction State"} value={
                phase === "idle" ? (isAs ? "আৰম্ভ হোৱা নাই" : "Not started")
                : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "Completed")
                : (isAs ? "চলি আছে" : "In progress")
              } color={phase === "complete" ? "#34D399" : phase === "reacting" ? exp.accent : "#64748b"} />
            </div>
          </GlassPanel>

          {/* Observations */}
          <GlassPanel className="p-3 flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "পৰ্যবেক্ষণ" : "Observations"}</p>
            <div className="space-y-1.5">
              {expObservations.map((obs, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: phase !== "idle" || i === 0 ? 1 : 0.3, x: 0 }} transition={{ delay: i * 0.15 }}
                  className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: phase === "complete" ? `${exp.accent}22` : "rgba(255,255,255,0.05)" }}>
                    {phase === "complete" ? <CheckCircle className="w-3 h-3" style={{ color: exp.accent }} /> : <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{obs}</p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right — Molecular view + Info */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <MolecularPanel expId={exp.id} phase={phase} accent={exp.accent} />

          {/* Description */}
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5" style={{ color: exp.accent }} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "বিৱৰণ" : "About"}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{expDesc}</p>
          </GlassPanel>

          {/* Real-world */}
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "বাস্তৱ ব্যৱহাৰ" : "Real-World Use"}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{expRealWorld}</p>
          </GlassPanel>

          {/* Quiz */}
          <div ref={quizRef}>
            <AnimatePresence>
              {showQuiz && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <QuizSection exp={exp} accent={exp.accent} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPERIMENT HUB (dashboard / selection screen)
// ═══════════════════════════════════════════════════════════════

function LabHub({ onSelect }: { onSelect: (exp: ExpConfig) => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #0A0F2E 50%, #050B18 100%)" }}>
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-20 animate-pulse"
            style={{ width: 2 + Math.random() * 3, height: 2 + Math.random() * 3, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: ["#FFE066","#38BDF8","#A78BFA","#34D399","#FB923C","#60A5FA"][i % 6], animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 pb-28">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <Link href="/virtual-lab/chemistry">
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold mb-6">
              <ArrowLeft className="w-4 h-4" /> {isAs ? "ৰসায়ন পৰীক্ষাগাৰ" : "Chemistry Lab"}
            </button>
          </Link>
          <LanguageToggle />
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border text-xs font-black uppercase tracking-widest"
            style={{ borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", color: "#34D399" }}>
            <FlaskConical className="w-3.5 h-3.5" /> {isAs ? "সংযোগ বিক্ৰিয়া · অধ্যায় ১" : "Combination Reactions · Chapter 1"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            {isAs ? "ভাৰ্চুৱেল ৰসায়ন" : "Virtual Chemistry"}<br />
            <span style={{ background: "linear-gradient(135deg, #34D399, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isAs ? "পৰীক্ষাগাৰ মডিউল" : "Lab Module"}
            </span>
          </h1>
          <p className="text-slate-400 text-base font-medium max-w-xl mx-auto leading-relaxed">
            {isAs
              ? "৬টা নিমজ্জিত সংযোগ বিক্ৰিয়াৰ পৰীক্ষা প্ৰত্যক্ষ অনুকৰণ, আণৱিক দৃশ্যকল্পন আৰু পদক্ষেপ-অনুযায়ী দিহাৰে।"
              : "6 immersive combination reaction experiments with real-time simulation, molecular visualization, and interactive step-by-step guidance."}
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            {(isAs
              ? [["৬", "পৰীক্ষা"], ["প্ৰত্যক্ষ", "অনুকৰণ"], ["আণৱিক", "দৃশ্য"], ["কুইজ", "অন্তৰ্ভুক্ত"]]
              : [["6", "Experiments"], ["Real-Time", "Simulation"], ["Molecular", "View"], ["Quiz", "Included"]]
            ).map(([val, lbl]) => (
              <div key={lbl} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-base font-black text-white">{val}</div>
                <div className="text-[10px] text-slate-500 font-medium">{lbl}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experiment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPERIMENTS.map((exp, idx) => {
            const cardTitle = pickLang(exp.title, lang);
            const cardSubtitle = pickLang(exp.subtitle, lang);
            const cardDesc = pickLang(exp.description, lang);
            const cardReactionType = pickLang(exp.reactionType, lang);
            const typeLabel = cardReactionType.split(" · ").slice(1).join(" · ") || cardReactionType.split(" · ")[0];
            return (
              <motion.div key={exp.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <button onClick={() => onSelect(exp)} className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${exp.accent}50`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                  {/* Gradient stripe */}
                  <div className="h-1.5" style={{ background: `linear-gradient(to right, ${exp.gradFrom}, ${exp.gradTo})` }} />
                  <div className="p-5">
                    {/* Number + emoji */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black border shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${exp.gradFrom}22, ${exp.gradTo}22)`, borderColor: `${exp.accent}40` }}>
                          {exp.emoji}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAs ? "পৰীক্ষা" : "Exp."} {String(exp.num).padStart(2, "0")}</span>
                      </div>
                      <HazardBadge level={exp.hazard} />
                    </div>

                    <h3 className="text-base font-black text-white mb-1 leading-snug">{cardTitle}</h3>
                    <p className="text-xs font-semibold mb-3" style={{ color: exp.accent }}>{cardSubtitle}</p>

                    {/* Equation */}
                    <div className="font-mono text-[11px] font-black px-3 py-2 rounded-lg mb-4 border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>
                      {exp.equation}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{cardDesc}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[[isAs ? "প্ৰকাৰ" : "Type", typeLabel], [isAs ? "শক্তি" : "Energy", exp.energy], [isAs ? "উষ্ণতা" : "Temp", exp.peakTemp]].map(([lbl, val]) => (
                        <div key={lbl} className="rounded-lg px-2 py-2 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <div className="text-[8px] text-slate-600 font-bold mb-0.5">{lbl}</div>
                          <div className="text-[9px] font-black text-slate-300 leading-tight truncate">{val}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {(isAs ? ["কণা FX", "আণৱিক", "কুইজ"] : ["Particle FX", "Mol. View", "Quiz"]).map(tag => (
                          <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded font-black" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{tag}</span>
                        ))}
                      </div>
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

        {/* Bottom info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-10 rounded-2xl p-5 border text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-black text-slate-300">{isAs ? "নিৰাপদ ভাৰ্চুৱেল পৰিৱেশ" : "Safe Virtual Environment"}</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-lg mx-auto">
            {isAs
              ? "সকলো পৰীক্ষা সম্পূৰ্ণ নিৰাপদ ভাৰ্চুৱেল পৰিৱেশত অনুকৰণ কৰা হয়। ভাল বৈজ্ঞানিক অভ্যাস গঢ়িবলৈ প্ৰকৃত পৰীক্ষাগাৰৰ সুৰক্ষা প্ৰট’ক’ল দেখুওৱা হয়।"
              : "All experiments are simulated in a completely safe virtual environment. Real laboratory safety protocols are displayed to build good scientific habits."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT EXPORT — MAIN MODULE
// ═══════════════════════════════════════════════════════════════

export default function CombinationReactionsLab() {
  const [activeExp, setActiveExp] = useState<ExpConfig | null>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#050B18" }}>
      <AnimatePresence mode="wait">
        {activeExp ? (
          <motion.div key="room" className="flex-1 overflow-hidden" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <ExperimentRoom exp={activeExp} onBack={() => setActiveExp(null)} />
          </motion.div>
        ) : (
          <motion.div key="hub" className="flex-1 overflow-auto" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.3 }}>
            <LabHub onSelect={setActiveExp} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
