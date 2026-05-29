/**
 * Acid-Base Interactions with Metals and Oxides Virtual Lab
 * 7 experiments: Zn+H₂SO₄, Zn+HCl, Zn+NaOH, CuO+HCl, CuO+H₂SO₄, CO₂+Ca(OH)₂, CO₂+NaOH
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";
import {
  ArrowLeft, Shield, RotateCcw, Play, Zap,
  FlaskConical, CheckCircle, Info, AlertTriangle, Flame, Wind,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ExpId = "zn-h2so4" | "zn-hcl" | "zn-naoh" | "cuo-hcl" | "cuo-h2so4" | "co2-caoh2" | "co2-naoh";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "h2-bubbles" | "base-h2" | "milky-ppt" | "co2-absorb" | "blue-dissolve" | "none";
type Category = "metal-acid" | "metal-base" | "oxide-acid" | "co2-base";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; blur: number;
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
  gasEvolved: string | null;
  precipitate: boolean; amphoteric: boolean;
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
    id: "zn-h2so4", num: 1,
    title: { en: "Zinc + Sulphuric Acid", as: "জিংক + ছালফিউৰিক এচিড" },
    subtitle: { en: "Metal + Dilute Acid → H₂ Gas", as: "ধাতু + পাতল এচিড → H₂ গেছ" },
    equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    category: "metal-acid",
    accent: "#3B82F6", glow: "rgba(59,130,246,0.4)", gradFrom: "#1D4ED8", gradTo: "#60A5FA", emoji: "⚗️",
    hazard: "MEDIUM", gasEvolved: "H₂", precipitate: false, amphoteric: false,
    phaseColors: {
      idle: "rgba(200,220,255,0.12)", step1: "rgba(180,210,255,0.2)",
      step2: "rgba(160,200,255,0.28)", reacting: "rgba(140,190,255,0.36)", complete: "rgba(120,180,255,0.42)",
    },
    description: {
      en: "Zinc metal reacts with dilute sulphuric acid to produce zinc sulphate (ZnSO₄) and hydrogen gas (H₂). Zinc is oxidised (loses electrons) and hydrogen ions are reduced. The reaction is exothermic and vigorous effervescence is observed.",
      as: "জিংক ধাতুৱে পাতল ছালফিউৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰি জিংক ছালফেট (ZnSO₄) আৰু হাইড্ৰ’জেন গেছ (H₂) উৎপন্ন কৰে। জিংক জাৰিত হয় (ইলেক্ট্ৰন হেৰুৱায়) আৰু হাইড্ৰ’জেন আয়ন অপচয়িত হয়। বিক্ৰিয়া তাপমোচী আৰু প্ৰচণ্ড বুদবুদ লক্ষ্য কৰা হয়।",
    },
    realWorld: {
      en: "Hydrogen fuel cells · Galvanic cells · Metal etching · Industrial hydrogen production",
      as: "হাইড্ৰ’জেন ইন্ধন কোষ · গেলভানিক কোষ · ধাতু এচিং · ঔদ্যোগিক হাইড্ৰ’জেন উৎপাদন",
    },
    examNote: {
      en: "Zn is ABOVE hydrogen in reactivity series — so it displaces H₂. ZnSO₄ is formed (colourless salt). H₂ gas is confirmed by the burning splint 'pop' test. CBSE: metal + dilute acid → salt + hydrogen gas.",
      as: "Zn ক্ৰিয়াশীলতা শ্ৰেণীত হাইড্ৰ’জেনৰ ওপৰত — সেয়েহে ই H₂ প্ৰতিস্থাপন কৰে। ZnSO₄ গঠিত হয় (বৰ্ণহীন লৱণ)। জ্বলন্ত চিপাৰ ‘পপ’ পৰীক্ষাৰে H₂ গেছ নিশ্চিত হয়। CBSE: ধাতু + পাতল এচিড → লৱণ + হাইড্ৰ’জেন গেছ।",
    },
    safety: {
      en: ["H₂SO₄ is corrosive — wear gloves", "H₂ is flammable — no open flames near", "Wear goggles", "Work in well-ventilated area"],
      as: ["H₂SO₄ ক্ষয়কাৰক — দস্তানা পিন্ধক", "H₂ দাহ্য — ওচৰত খোলা শিখা ৰাখিব নলাগে", "চশমা পিন্ধক", "ভাল বায়ু চলাচল থকা ঠাইত কাম কৰক"],
    },
    steps: [
      { label: { en: "Add Zinc Granules", as: "জিংক দানা যোগ কৰক" }, desc: { en: "Place 2–3 zinc granules into a clean test tube. Observe the metallic grey surface of zinc before reaction.", as: "এক পৰিষ্কাৰ টেষ্ট টিউবত 2–3টা জিংক দানা ৰাখক। বিক্ৰিয়াৰ পূৰ্বে জিংকৰ ধাতৱীয় ধূসৰ পৃষ্ঠ লক্ষ্য কৰক।" } },
      { label: { en: "Add Dilute H₂SO₄", as: "পাতল H₂SO₄ যোগ কৰক" }, desc: { en: "Slowly pour dilute sulphuric acid over the zinc. Immediate vigorous effervescence begins — H₂ bubbles form.", as: "জিংকৰ ওপৰত লাহে লাহে পাতল ছালফিউৰিক এচিড ঢালক। তৎক্ষণাৎ প্ৰচণ্ড বুদবুদ আৰম্ভ হয় — H₂ বুদবুদ গঠিত হয়।" } },
      { label: { en: "Collect Hydrogen Gas", as: "হাইড্ৰ’জেন গেছ সংগ্ৰহ কৰক" }, desc: { en: "Attach delivery tube to collect H₂ in an inverted test tube over water. Gas fills the tube rapidly.", as: "পানীৰ ওপৰত উলটাকৈ ৰখা টেষ্ট টিউবত H₂ সংগ্ৰহ কৰিবলৈ পৰিৱহন টিউব লগাওক। গেছে টিউব দ্ৰুতভাৱে ভৰাই পেলায়।" } },
      { label: { en: "Pop Test", as: "পপ পৰীক্ষা" }, desc: { en: "Bring a burning splint to the mouth of gas-filled tube. A sharp 'POP' sound confirms hydrogen gas evolution.", as: "গেছ ভৰা টিউবৰ মুখলৈ এক জ্বলন্ত চিপা আনক। এক তীব্ৰ ‘পপ’ শব্দে হাইড্ৰ’জেন গেছ নিৰ্গমন নিশ্চিত কৰে।" } },
    ],
    ions: {
      reactants: [
        { sym: "Zn", col: "#94A3B8", desc: { en: "Zinc metal (solid)", as: "জিংক ধাতু (কঠিন)" } },
        { sym: "H⁺", col: "#F97316", desc: { en: "Hydrogen ions from H₂SO₄", as: "H₂SO₄-ৰ পৰা হাইড্ৰ’জেন আয়ন" } },
      ],
      products: [
        { sym: "Zn²⁺", col: "#60A5FA", desc: { en: "Zinc ion (in solution)", as: "জিংক আয়ন (সমাধানত)" } },
        { sym: "SO₄²⁻", col: "#818CF8", desc: { en: "Sulphate ion (spectator)", as: "ছালফেট আয়ন (দৰ্শক)" } },
        { sym: "H₂↑", col: "#E2E8F0", desc: { en: "Hydrogen gas evolved", as: "নিৰ্গত হাইড্ৰ’জেন গেছ" } },
      ],
    },
    observations: {
      en: ["Vigorous effervescence on zinc surface", "Colourless hydrogen gas evolved", "Zinc granules dissolve gradually", "Test tube becomes warm (exothermic)", "Colourless ZnSO₄ solution remains", "Pop test confirms H₂ gas"],
      as: ["জিংকৰ পৃষ্ঠত প্ৰচণ্ড বুদবুদ", "বৰ্ণহীন হাইড্ৰ’জেন গেছ নিৰ্গত", "জিংক দানা ক্ৰমে দ্ৰৱীভূত হয়", "টেষ্ট টিউব গৰম হয় (তাপমোচী)", "বৰ্ণহীন ZnSO₄ সমাধান থাকে", "পপ পৰীক্ষাৰে H₂ গেছ নিশ্চিত"],
    },
    pmode: "h2-bubbles",
    quiz: [
      { q: { en: "Which gas is evolved when Zn reacts with H₂SO₄?", as: "Zn-এ H₂SO₄-ৰ সৈতে বিক্ৰিয়া কৰিলে কি গেছ নিৰ্গত হয়?" }, opts: { en: ["O₂", "CO₂", "H₂", "SO₂"], as: ["O₂", "CO₂", "H₂", "SO₂"] }, ans: 2 },
      { q: { en: "Which test confirms the gas evolved is hydrogen?", as: "নিৰ্গত গেছ হাইড্ৰ’জেন বুলি কোন পৰীক্ষাই নিশ্চিত কৰে?" }, opts: { en: ["Glowing splint", "Burning splint pop", "Litmus test", "Lime water test"], as: ["জ্বলি থকা চিপা", "জ্বলন্ত চিপাৰ পপ", "লিটমাছ পৰীক্ষা", "চূনপানী পৰীক্ষা"] }, ans: 1 },
      { q: { en: "Which salt is formed in this reaction?", as: "এই বিক্ৰিয়াত কি লৱণ গঠিত হয়?" }, opts: { en: ["ZnCl₂", "ZnO", "ZnSO₄", "ZnCO₃"], as: ["ZnCl₂", "ZnO", "ZnSO₄", "ZnCO₃"] }, ans: 2 },
      { q: { en: "Zinc is above hydrogen in reactivity series because:", as: "জিংক ক্ৰিয়াশীলতা শ্ৰেণীত হাইড্ৰ’জেনৰ ওপৰত কাৰণ:" }, opts: { en: ["It is heavier", "It can displace H₂ from acids", "It is a non-metal", "It does not react"], as: ["ই গধুৰ", "ই এচিডৰ পৰা H₂ প্ৰতিস্থাপন কৰিব পাৰে", "ই এক অধাতু", "ই বিক্ৰিয়া নকৰে"] }, ans: 1 },
      { q: { en: "The reaction between Zn and H₂SO₄ is:", as: "Zn আৰু H₂SO₄-ৰ মাজৰ বিক্ৰিয়া:" }, opts: { en: ["Endothermic", "Exothermic", "Photochemical", "No energy change"], as: ["তাপগ্ৰাহী", "তাপমোচী", "আলোকৰাসায়নিক", "কোনো শক্তি পৰিবৰ্তন নাই"] }, ans: 1 },
    ],
  },
  {
    id: "zn-hcl", num: 2,
    title: { en: "Zinc + Hydrochloric Acid", as: "জিংক + হাইড্ৰ’ক্ল’ৰিক এচিড" },
    subtitle: { en: "Metal + HCl → H₂ Gas", as: "ধাতু + HCl → H₂ গেছ" },
    equation: "Zn + 2HCl → ZnCl₂ + H₂↑",
    category: "metal-acid",
    accent: "#06B6D4", glow: "rgba(6,182,212,0.4)", gradFrom: "#0E7490", gradTo: "#22D3EE", emoji: "🔵",
    hazard: "MEDIUM", gasEvolved: "H₂", precipitate: false, amphoteric: false,
    phaseColors: {
      idle: "rgba(200,240,255,0.12)", step1: "rgba(170,230,255,0.2)",
      step2: "rgba(140,220,255,0.3)", reacting: "rgba(103,232,249,0.35)", complete: "rgba(80,220,249,0.4)",
    },
    description: {
      en: "Zinc reacts with dilute hydrochloric acid to form zinc chloride (ZnCl₂) and hydrogen gas. Two HCl molecules provide two H⁺ ions that are reduced to H₂ while Zn is oxidised to Zn²⁺. This is a classic metal-acid reaction.",
      as: "জিংকে পাতল হাইড্ৰ’ক্ল’ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰি জিংক ক্ল’ৰাইড (ZnCl₂) আৰু হাইড্ৰ’জেন গেছ গঠন কৰে। দুটা HCl অণুৱে দুটা H⁺ আয়ন দিয়ে যি H₂ লৈ অপচয়িত হয় আৰু Zn, Zn²⁺ লৈ জাৰিত হয়। এইটো এক প্ৰথাগত ধাতু-এচিড বিক্ৰিয়া।",
    },
    realWorld: {
      en: "Electroplating · Battery electrodes · Metal cleaning · Zinc refining",
      as: "ইলেক্ট্ৰ’প্লেটিং · বেটাৰী ইলেক্ট্ৰ’ড · ধাতু চাফাই · জিংক পৰিশোধন",
    },
    examNote: {
      en: "Zn + 2HCl → ZnCl₂ + H₂. ZnCl₂ is colourless in solution. Two moles HCl per mole Zn. H₂ confirmed by pop test. CBSE: all metals above H in reactivity series react with HCl to give H₂.",
      as: "Zn + 2HCl → ZnCl₂ + H₂। ZnCl₂ সমাধানত বৰ্ণহীন। প্ৰতি মোল Zn-ৰ বাবে দুমোল HCl। পপ পৰীক্ষাৰে H₂ নিশ্চিত। CBSE: ক্ৰিয়াশীলতা শ্ৰেণীত H-ৰ ওপৰত থকা সকলো ধাতুৱে HCl-ৰ সৈতে বিক্ৰিয়া কৰি H₂ দিয়ে।",
    },
    safety: {
      en: ["HCl is corrosive", "H₂ is flammable — no flames", "Wear goggles and gloves", "HCl fumes — work in fume hood"],
      as: ["HCl ক্ষয়কাৰক", "H₂ দাহ্য — শিখা নাৰাখিব", "চশমা আৰু দস্তানা পিন্ধক", "HCl ধোঁৱা — ফিউম হুডত কাম কৰক"],
    },
    steps: [
      { label: { en: "Place Zinc Strip", as: "জিংক পাত ৰাখক" }, desc: { en: "Add a zinc strip or granules to a test tube. Clean the zinc surface with sand paper to remove oxide layer.", as: "এক টেষ্ট টিউবত জিংক পাত বা দানা যোগ কৰক। অক্সাইড স্তৰ আঁতৰাবলৈ বালি কাগজেৰে জিংকৰ পৃষ্ঠ পৰিষ্কাৰ কৰক।" } },
      { label: { en: "Add Dilute HCl", as: "পাতল HCl যোগ কৰক" }, desc: { en: "Pour dilute HCl over the zinc. Rapid bubbling starts immediately. Gas evolves at the metal surface.", as: "জিংকৰ ওপৰত পাতল HCl ঢালক। তৎক্ষণাৎ দ্ৰুত বুদবুদ আৰম্ভ হয়। ধাতুৰ পৃষ্ঠত গেছ নিৰ্গত হয়।" } },
      { label: { en: "Observe Reaction", as: "বিক্ৰিয়া লক্ষ্য কৰক" }, desc: { en: "Zinc dissolves steadily. The solution remains colourless (ZnCl₂ is colourless). Gas rises rapidly.", as: "জিংক স্থিৰভাৱে দ্ৰৱীভূত হয়। সমাধান বৰ্ণহীন থাকে (ZnCl₂ বৰ্ণহীন)। গেছ দ্ৰুতভাৱে ওপৰলৈ উঠে।" } },
      { label: { en: "Pop Test", as: "পপ পৰীক্ষা" }, desc: { en: "Collect H₂ in inverted tube. Apply burning splint — characteristic 'pop' sound confirms H₂ gas.", as: "উলটা টিউবত H₂ সংগ্ৰহ কৰক। জ্বলন্ত চিপা প্ৰয়োগ কৰক — চিনাকি ‘পপ’ শব্দে H₂ গেছ নিশ্চিত কৰে।" } },
    ],
    ions: {
      reactants: [
        { sym: "Zn", col: "#94A3B8", desc: { en: "Zinc metal", as: "জিংক ধাতু" } },
        { sym: "H⁺", col: "#F97316", desc: { en: "Hydrogen ions from HCl", as: "HCl-ৰ পৰা হাইড্ৰ’জেন আয়ন" } },
        { sym: "Cl⁻", col: "#67E8F9", desc: { en: "Chloride ions (spectators)", as: "ক্ল’ৰাইড আয়ন (দৰ্শক)" } },
      ],
      products: [
        { sym: "Zn²⁺", col: "#22D3EE", desc: { en: "Zinc ion (in ZnCl₂)", as: "জিংক আয়ন (ZnCl₂-ত)" } },
        { sym: "Cl⁻", col: "#67E8F9", desc: { en: "Chloride ion", as: "ক্ল’ৰাইড আয়ন" } },
        { sym: "H₂↑", col: "#E2E8F0", desc: { en: "Hydrogen gas evolved", as: "নিৰ্গত হাইড্ৰ’জেন গেছ" } },
      ],
    },
    observations: {
      en: ["Rapid effervescence from zinc surface", "Colourless solution (ZnCl₂) forms", "Zinc strip gets thinner and dissolves", "Reaction is exothermic (warm)", "H₂ collected confirms pop test", "No colour change observed"],
      as: ["জিংকৰ পৃষ্ঠৰ পৰা দ্ৰুত বুদবুদ", "বৰ্ণহীন সমাধান (ZnCl₂) গঠিত হয়", "জিংক পাত পাতল হয় আৰু দ্ৰৱীভূত হয়", "বিক্ৰিয়া তাপমোচী (গৰম)", "সংগৃহীত H₂ পপ পৰীক্ষা নিশ্চিত কৰে", "কোনো ৰং পৰিবৰ্তন লক্ষ্য কৰা নাযায়"],
    },
    pmode: "h2-bubbles",
    quiz: [
      { q: { en: "Products of Zn + 2HCl reaction:", as: "Zn + 2HCl বিক্ৰিয়াৰ উৎপাদ:" }, opts: { en: ["ZnO + H₂", "ZnCl₂ + H₂", "ZnSO₄ + H₂O", "ZnH₂ + Cl₂"], as: ["ZnO + H₂", "ZnCl₂ + H₂", "ZnSO₄ + H₂O", "ZnH₂ + Cl₂"] }, ans: 1 },
      { q: { en: "What produces the 'pop' sound in the splint test?", as: "চিপা পৰীক্ষাত ‘পপ’ শব্দ কিহে উৎপন্ন কৰে?" }, opts: { en: ["CO₂ igniting", "H₂ igniting", "Cl₂ exploding", "O₂ burning"], as: ["CO₂ জ্বলা", "H₂ জ্বলা", "Cl₂ বিস্ফোৰণ", "O₂ জ্বলা"] }, ans: 1 },
      { q: { en: "The colour of ZnCl₂ solution is:", as: "ZnCl₂ সমাধানৰ ৰং:" }, opts: { en: ["Blue", "Green", "Yellow", "Colourless"], as: ["নীলা", "সেউজীয়া", "হালধীয়া", "বৰ্ণহীন"] }, ans: 3 },
      { q: { en: "How many moles of HCl react with 1 mole of Zn?", as: "1 মোল Zn-ৰ সৈতে কিমান মোল HCl বিক্ৰিয়া কৰে?" }, opts: { en: ["1", "2", "3", "4"], as: ["1", "2", "3", "4"] }, ans: 1 },
      { q: { en: "In Zn + HCl reaction, Zn is:", as: "Zn + HCl বিক্ৰিয়াত Zn:" }, opts: { en: ["Reduced", "Oxidised", "Neutralised", "Decomposed"], as: ["অপচয়িত", "জাৰিত", "নিৰপেক্ষিত", "বিযোজিত"] }, ans: 1 },
    ],
  },
  {
    id: "zn-naoh", num: 3,
    title: { en: "Zinc + Sodium Hydroxide", as: "জিংক + ছ’ডিয়াম হাইড্ৰক্সাইড" },
    subtitle: { en: "Amphoteric Metal + Base → H₂", as: "উভধাৰ্মী ধাতু + ক্ষাৰ → H₂" },
    equation: "Zn + 2NaOH → Na₂ZnO₂ + H₂↑",
    category: "metal-base",
    accent: "#8B5CF6", glow: "rgba(139,92,246,0.4)", gradFrom: "#7C3AED", gradTo: "#A78BFA", emoji: "🟣",
    hazard: "MEDIUM", gasEvolved: "H₂", precipitate: false, amphoteric: true,
    phaseColors: {
      idle: "rgba(200,200,255,0.1)", step1: "rgba(167,139,250,0.15)",
      step2: "rgba(167,139,250,0.25)", reacting: "rgba(139,92,246,0.3)", complete: "rgba(109,40,217,0.35)",
    },
    description: {
      en: "Zinc is an AMPHOTERIC metal — it reacts with BOTH acids and bases. With concentrated NaOH, zinc dissolves to form sodium zincate (Na₂ZnO₂) and hydrogen gas. This demonstrates zinc's dual chemical nature — a key CBSE concept.",
      as: "জিংক এক উভধাৰ্মী ধাতু — ই অম্ল আৰু ক্ষাৰ দুয়োৰে সৈতে বিক্ৰিয়া কৰে। ঘন NaOH-ৰ সৈতে জিংক দ্ৰৱীভূত হৈ ছ’ডিয়াম জিংকেট (Na₂ZnO₂) আৰু হাইড্ৰ’জেন গেছ গঠন কৰে। ই জিংকৰ দ্বৈত ৰাসায়নিক প্ৰকৃতি প্ৰদৰ্শন কৰে — এক মুখ্য CBSE ধাৰণা।",
    },
    realWorld: {
      en: "Zinc used in alkaline batteries · Galvanising steel · Die casting · Sunscreen (ZnO)",
      as: "ক্ষাৰীয় বেটাৰীত জিংক ব্যৱহৃত · ইস্পাত গেলভানাইজিং · ডাই কাষ্টিং · ছানস্ক্ৰীন (ZnO)",
    },
    examNote: {
      en: "AMPHOTERIC = reacts with both acid AND base. Na₂ZnO₂ (sodium zincate) is formed. H₂ gas evolved. ONLY zinc and aluminium are amphoteric metals in CBSE syllabus. Concentrated NaOH required — not dilute.",
      as: "উভধাৰ্মী = অম্ল আৰু ক্ষাৰ দুয়োৰে সৈতে বিক্ৰিয়া কৰে। Na₂ZnO₂ (ছ’ডিয়াম জিংকেট) গঠিত হয়। H₂ গেছ নিৰ্গত। CBSE পাঠ্যসূচীত কেৱল জিংক আৰু এলুমিনিয়াম উভধাৰ্মী ধাতু। পাতল নহয় — ঘন NaOH লাগে।",
    },
    safety: {
      en: ["Concentrated NaOH — severely corrosive", "H₂ evolved — flammable", "Reaction generates heat", "Wear acid-resistant gloves"],
      as: ["ঘন NaOH — গুৰুতৰভাৱে ক্ষয়কাৰক", "H₂ নিৰ্গত — দাহ্য", "বিক্ৰিয়া তাপ উৎপন্ন কৰে", "এচিড-প্ৰতিৰোধী দস্তানা পিন্ধক"],
    },
    steps: [
      { label: { en: "Add Concentrated NaOH", as: "ঘন NaOH যোগ কৰক" }, desc: { en: "Pour concentrated NaOH solution into a beaker. Add zinc granules — reaction is slower than with acid.", as: "এক বিকাৰত ঘন NaOH সমাধান ঢালক। জিংক দানা যোগ কৰক — এচিডৰ লগৰ তুলনাত বিক্ৰিয়া লেহেমীয়া।" } },
      { label: { en: "Observe Metal Dissolution", as: "ধাতু দ্ৰৱণ লক্ষ্য কৰক" }, desc: { en: "Zinc slowly dissolves in the alkaline solution. Gentle bubbling of H₂ observed at metal surface.", as: "জিংক ক্ষাৰীয় সমাধানত লাহে লাহে দ্ৰৱীভূত হয়। ধাতুৰ পৃষ্ঠত H₂-ৰ মৃদু বুদবুদ লক্ষ্য কৰা হয়।" } },
      { label: { en: "Gas Collection", as: "গেছ সংগ্ৰহ" }, desc: { en: "Collect the H₂ gas evolved. Sodium zincate (Na₂ZnO₂) remains dissolved in solution (colourless).", as: "নিৰ্গত H₂ গেছ সংগ্ৰহ কৰক। ছ’ডিয়াম জিংকেট (Na₂ZnO₂) সমাধানত দ্ৰৱীভূত থাকে (বৰ্ণহীন)।" } },
      { label: { en: "Confirm Amphoteric Nature", as: "উভধাৰ্মী প্ৰকৃতি নিশ্চিত কৰক" }, desc: { en: "Compare: Zn reacted with both HCl (acid) AND NaOH (base). This confirms zinc is AMPHOTERIC.", as: "তুলনা কৰক: Zn-এ HCl (অম্ল) আৰু NaOH (ক্ষাৰ) দুয়োৰে সৈতে বিক্ৰিয়া কৰিলে। ই জিংক উভধাৰ্মী বুলি নিশ্চিত কৰে।" } },
    ],
    ions: {
      reactants: [
        { sym: "Zn", col: "#94A3B8", desc: { en: "Zinc metal (amphoteric)", as: "জিংক ধাতু (উভধাৰ্মী)" } },
        { sym: "OH⁻", col: "#A78BFA", desc: { en: "Hydroxide ions from NaOH", as: "NaOH-ৰ পৰা হাইড্ৰক্সাইড আয়ন" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ions (spectators)", as: "ছ’ডিয়াম আয়ন (দৰ্শক)" } },
      ],
      products: [
        { sym: "ZnO₂²⁻", col: "#8B5CF6", desc: { en: "Zincate ion (in Na₂ZnO₂)", as: "জিংকেট আয়ন (Na₂ZnO₂-ত)" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ion", as: "ছ’ডিয়াম আয়ন" } },
        { sym: "H₂↑", col: "#E2E8F0", desc: { en: "Hydrogen gas evolved", as: "নিৰ্গত হাইড্ৰ’জেন গেছ" } },
      ],
    },
    observations: {
      en: ["Zinc dissolves slowly in NaOH", "Gentle bubbling — H₂ gas evolved", "Solution remains colourless (Na₂ZnO₂)", "Reaction slower than with acid", "H₂ confirmed by pop test", "Zinc completely dissolves in excess NaOH"],
      as: ["জিংক NaOH-ত লাহে লাহে দ্ৰৱীভূত হয়", "মৃদু বুদবুদ — H₂ গেছ নিৰ্গত", "সমাধান বৰ্ণহীন থাকে (Na₂ZnO₂)", "এচিডৰ লগৰ তুলনাত বিক্ৰিয়া লেহেমীয়া", "পপ পৰীক্ষাৰে H₂ নিশ্চিত", "অতিৰিক্ত NaOH-ত জিংক সম্পূৰ্ণভাৱে দ্ৰৱীভূত হয়"],
    },
    pmode: "base-h2",
    quiz: [
      { q: { en: "Zinc + NaOH reaction produces:", as: "জিংক + NaOH বিক্ৰিয়াই উৎপন্ন কৰে:" }, opts: { en: ["ZnO + H₂O", "Na₂ZnO₂ + H₂", "NaZnO + H₂O", "ZnNaO + H₂O₂"], as: ["ZnO + H₂O", "Na₂ZnO₂ + H₂", "NaZnO + H₂O", "ZnNaO + H₂O₂"] }, ans: 1 },
      { q: { en: "Zinc is called amphoteric because:", as: "জিংকক উভধাৰ্মী কোৱাৰ কাৰণ:" }, opts: { en: ["It is above H in reactivity", "It reacts with both acids and bases", "It is a transition metal", "It produces CO₂"], as: ["ই ক্ৰিয়াশীলতাত H-ৰ ওপৰত", "ই অম্ল আৰু ক্ষাৰ দুয়োৰে সৈতে বিক্ৰিয়া কৰে", "ই এক সংক্ৰমণ ধাতু", "ই CO₂ উৎপন্ন কৰে"] }, ans: 1 },
      { q: { en: "Na₂ZnO₂ is called:", as: "Na₂ZnO₂-ক কোৱা হয়:" }, opts: { en: ["Zinc sulphate", "Zinc chloride", "Sodium zincate", "Sodium zinc oxide"], as: ["জিংক ছালফেট", "জিংক ক্ল’ৰাইড", "ছ’ডিয়াম জিংকেট", "ছ’ডিয়াম জিংক অক্সাইড"] }, ans: 2 },
      { q: { en: "Which other metal is amphoteric like zinc?", as: "জিংকৰ দৰে আন কোন ধাতু উভধাৰ্মী?" }, opts: { en: ["Iron", "Copper", "Aluminium", "Calcium"], as: ["লোহা", "তামা", "এলুমিনিয়াম", "কেলচিয়াম"] }, ans: 2 },
      { q: { en: "For Zn+NaOH reaction, which NaOH is required?", as: "Zn+NaOH বিক্ৰিয়াৰ বাবে কেনে NaOH প্ৰয়োজন?" }, opts: { en: ["Dilute NaOH", "Concentrated NaOH", "Any concentration", "Hot NaOH only"], as: ["পাতল NaOH", "ঘন NaOH", "যিকোনো ঘনত্ব", "কেৱল গৰম NaOH"] }, ans: 1 },
    ],
  },
  {
    id: "cuo-hcl", num: 4,
    title: { en: "Copper(II) Oxide + HCl", as: "তামা(II) অক্সাইড + HCl" },
    subtitle: { en: "Basic Oxide + Acid → Salt + Water", as: "ক্ষাৰীয় অক্সাইড + অম্ল → লৱণ + পানী" },
    equation: "CuO + 2HCl → CuCl₂ + H₂O",
    category: "oxide-acid",
    accent: "#0891B2", glow: "rgba(8,145,178,0.4)", gradFrom: "#155E75", gradTo: "#22D3EE", emoji: "🩵",
    hazard: "LOW", gasEvolved: null, precipitate: false, amphoteric: false,
    phaseColors: {
      idle: "rgba(200,200,200,0.15)", step1: "rgba(6,182,212,0.15)",
      step2: "rgba(6,182,212,0.28)", reacting: "rgba(8,145,178,0.42)", complete: "rgba(0,150,180,0.55)",
    },
    description: {
      en: "Black copper(II) oxide (CuO) reacts with dilute hydrochloric acid to form copper(II) chloride (CuCl₂) and water. This is an acid-base neutralization where CuO acts as a basic oxide. The black powder completely dissolves producing a distinctive blue-green solution.",
      as: "ক’লা তামা(II) অক্সাইড (CuO)-এ পাতল হাইড্ৰ’ক্ল’ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰি তামা(II) ক্ল’ৰাইড (CuCl₂) আৰু পানী গঠন কৰে। এইটো এক অম্ল-ক্ষাৰ নিৰপেক্ষণ য’ত CuO ক্ষাৰীয় অক্সাইড হিচাপে কাম কৰে। ক’লা গুড়িটো সম্পূৰ্ণভাৱে দ্ৰৱীভূত হৈ এক চিনাকি নীলা-সেউজীয়া সমাধান উৎপন্ন কৰে।",
    },
    realWorld: {
      en: "Copper plating industry · Pigment production · Catalysis · CuCl₂ as reagent in organic chemistry",
      as: "তামা প্লেটিং উদ্যোগ · ৰংচাকি উৎপাদন · উৎপ্ৰেৰক · জৈৱ ৰসায়নত CuCl₂ অভিকাৰক হিচাপে",
    },
    examNote: {
      en: "CuO is a BASIC OXIDE — reacts with acids, not bases. Black solid dissolves → blue-green CuCl₂. NO gas evolved. CBSE: basic oxide + acid → salt + water. CuCl₂ solution is blue-green due to Cu²⁺ ions.",
      as: "CuO এক ক্ষাৰীয় অক্সাইড — এচিডৰ সৈতে বিক্ৰিয়া কৰে, ক্ষাৰৰ সৈতে নহয়। ক’লা কঠিন দ্ৰৱীভূত হয় → নীলা-সেউজীয়া CuCl₂। কোনো গেছ নিৰ্গত নহয়। CBSE: ক্ষাৰীয় অক্সাইড + অম্ল → লৱণ + পানী। Cu²⁺ আয়নৰ বাবে CuCl₂ সমাধান নীলা-সেউজীয়া।",
    },
    safety: {
      en: ["HCl is corrosive", "CuO dust may irritate lungs — avoid inhaling", "Wear gloves", "Cu compounds are toxic to aquatic life"],
      as: ["HCl ক্ষয়কাৰক", "CuO ধূলিয়ে হাঁওফাঁওত জ্বলন কৰিব পাৰে — শ্বাস লোৱাত পৰিহাৰ কৰক", "দস্তানা পিন্ধক", "Cu যৌগ জলজ জীৱনৰ বাবে বিষাক্ত"],
    },
    steps: [
      { label: { en: "Add CuO Powder", as: "CuO গুড়ি যোগ কৰক" }, desc: { en: "Add a spatula of black CuO powder to a beaker. Observe the distinctive black colour of copper(II) oxide.", as: "এক বিকাৰত এক চামুচ ক’লা CuO গুড়ি যোগ কৰক। তামা(II) অক্সাইডৰ চিনাকি ক’লা ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Add Dilute HCl", as: "পাতল HCl যোগ কৰক" }, desc: { en: "Slowly add dilute HCl to the black CuO. Stir continuously. Black powder begins dissolving.", as: "ক’লা CuO-ত লাহে লাহে পাতল HCl যোগ কৰক। অহৰহ লৰাওক। ক’লা গুড়ি দ্ৰৱীভূত হ’বলৈ আৰম্ভ কৰে।" } },
      { label: { en: "Observe Dissolution", as: "দ্ৰৱণ লক্ষ্য কৰক" }, desc: { en: "Black CuO dissolves completely as HCl is added. The solution gradually turns blue-green — characteristic of Cu²⁺ ions.", as: "HCl যোগ কৰাৰ লগে লগে ক’লা CuO সম্পূৰ্ণৰূপে দ্ৰৱীভূত হয়। সমাধান ক্ৰমে নীলা-সেউজীয়া হয় — Cu²⁺ আয়নৰ চিনাকি।" } },
      { label: { en: "Confirm Product", as: "উৎপাদ নিশ্চিত কৰক" }, desc: { en: "Colourless water and blue-green CuCl₂ solution confirm the neutralization. Filter if excess CuO remains.", as: "বৰ্ণহীন পানী আৰু নীলা-সেউজীয়া CuCl₂ সমাধানে নিৰপেক্ষণ নিশ্চিত কৰে। অতিৰিক্ত CuO থাকিলে ফিল্টাৰ কৰক।" } },
    ],
    ions: {
      reactants: [
        { sym: "CuO", col: "#1E293B", desc: { en: "Copper oxide (black, basic)", as: "তামা অক্সাইড (ক’লা, ক্ষাৰীয়)" } },
        { sym: "H⁺", col: "#F97316", desc: { en: "Hydrogen ions from HCl", as: "HCl-ৰ পৰা হাইড্ৰ’জেন আয়ন" } },
        { sym: "Cl⁻", col: "#67E8F9", desc: { en: "Chloride ions", as: "ক্ল’ৰাইড আয়ন" } },
      ],
      products: [
        { sym: "Cu²⁺", col: "#06B6D4", desc: { en: "Copper ion (blue-green)", as: "তামা আয়ন (নীলা-সেউজীয়া)" } },
        { sym: "Cl⁻", col: "#67E8F9", desc: { en: "Chloride ion (in CuCl₂)", as: "ক্ল’ৰাইড আয়ন (CuCl₂-ত)" } },
        { sym: "H₂O", col: "#BAE6FD", desc: { en: "Water formed", as: "গঠিত পানী" } },
      ],
    },
    observations: {
      en: ["Black CuO powder visible initially", "HCl addition dissolves the black solid", "Solution gradually turns blue-green", "Complete dissolution of black powder", "No gas evolved", "Blue-green CuCl₂ solution formed"],
      as: ["আৰম্ভণিতে ক’লা CuO গুড়ি দেখা যায়", "HCl যোগ কৰিলে ক’লা কঠিন দ্ৰৱীভূত হয়", "সমাধান ক্ৰমে নীলা-সেউজীয়া হয়", "ক’লা গুড়ি সম্পূৰ্ণৰূপে দ্ৰৱীভূত", "কোনো গেছ নিৰ্গত নহয়", "নীলা-সেউজীয়া CuCl₂ সমাধান গঠিত"],
    },
    pmode: "blue-dissolve",
    quiz: [
      { q: { en: "What colour does the solution turn in CuO + HCl reaction?", as: "CuO + HCl বিক্ৰিয়াত সমাধান কি ৰংলৈ পৰিণত হয়?" }, opts: { en: ["Yellow", "Red", "Blue-green", "Purple"], as: ["হালধীয়া", "ৰঙা", "নীলা-সেউজীয়া", "বেঙুনীয়া"] }, ans: 2 },
      { q: { en: "Products of CuO + 2HCl:", as: "CuO + 2HCl-ৰ উৎপাদ:" }, opts: { en: ["CuCl + H₂O", "CuCl₂ + H₂O", "CuO₂ + HCl", "Cu + H₂O + Cl₂"], as: ["CuCl + H₂O", "CuCl₂ + H₂O", "CuO₂ + HCl", "Cu + H₂O + Cl₂"] }, ans: 1 },
      { q: { en: "CuO is classified as:", as: "CuO-ক শ্ৰেণীভুক্ত কৰা হয়:" }, opts: { en: ["Acidic oxide", "Basic oxide", "Neutral oxide", "Amphoteric oxide"], as: ["অম্লীয় অক্সাইড", "ক্ষাৰীয় অক্সাইড", "নিৰপেক্ষ অক্সাইড", "উভধাৰ্মী অক্সাইড"] }, ans: 1 },
      { q: { en: "Is gas evolved in CuO + HCl reaction?", as: "CuO + HCl বিক্ৰিয়াত গেছ নিৰ্গত হয়নে?" }, opts: { en: ["Yes, H₂", "Yes, CO₂", "Yes, Cl₂", "No gas evolved"], as: ["হয়, H₂", "হয়, CO₂", "হয়, Cl₂", "কোনো গেছ নিৰ্গত নহয়"] }, ans: 3 },
      { q: { en: "The blue-green colour in product is due to:", as: "উৎপাদৰ নীলা-সেউজীয়া ৰং কাৰণে:" }, opts: { en: ["Cl⁻ ions", "Cu²⁺ ions", "H⁺ ions", "OH⁻ ions"], as: ["Cl⁻ আয়ন", "Cu²⁺ আয়ন", "H⁺ আয়ন", "OH⁻ আয়ন"] }, ans: 1 },
    ],
  },
  {
    id: "cuo-h2so4", num: 5,
    title: { en: "Copper(II) Oxide + H₂SO₄", as: "তামা(II) অক্সাইড + H₂SO₄" },
    subtitle: { en: "Basic Oxide + Sulphuric Acid", as: "ক্ষাৰীয় অক্সাইড + ছালফিউৰিক এচিড" },
    equation: "CuO + H₂SO₄ → CuSO₄ + H₂O",
    category: "oxide-acid",
    accent: "#2563EB", glow: "rgba(37,99,235,0.4)", gradFrom: "#1E3A8A", gradTo: "#60A5FA", emoji: "💙",
    hazard: "MEDIUM", gasEvolved: null, precipitate: false, amphoteric: false,
    phaseColors: {
      idle: "rgba(200,200,200,0.15)", step1: "rgba(59,130,246,0.15)",
      step2: "rgba(59,130,246,0.3)", reacting: "rgba(37,99,235,0.45)", complete: "rgba(30,58,138,0.55)",
    },
    description: {
      en: "Copper(II) oxide reacts with dilute sulphuric acid to form copper sulphate (CuSO₄) and water. CuSO₄ produces a characteristic bright blue solution. This is a classic neutralization reaction between a basic metal oxide and a strong acid.",
      as: "তামা(II) অক্সাইডে পাতল ছালফিউৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰি তামা ছালফেট (CuSO₄) আৰু পানী গঠন কৰে। CuSO₄-এ এক চিনাকি উজ্জ্বল নীলা সমাধান উৎপন্ন কৰে। এইটো ক্ষাৰীয় ধাতু অক্সাইড আৰু এক প্ৰবল অম্লৰ মাজত এক প্ৰথাগত নিৰপেক্ষণ বিক্ৰিয়া।",
    },
    realWorld: {
      en: "CuSO₄ used in: electroplating · Bordeaux mixture (fungicide) · swimming pools · food additive (E519)",
      as: "CuSO₄ ব্যৱহৃত: ইলেক্ট্ৰ’প্লেটিং · বৰ্ড’ মিশ্ৰণ (ছত্ৰাকনাশক) · ছুইমিং পুল · খাদ্য সংযোজক (E519)",
    },
    examNote: {
      en: "CuO (basic oxide) + H₂SO₄ (acid) → CuSO₄ (salt) + H₂O. CuSO₄ solution is BRIGHT BLUE (darker than CuCl₂). No gas evolved. CBSE: basic oxide + acid = salt + water (same as base + acid).",
      as: "CuO (ক্ষাৰীয় অক্সাইড) + H₂SO₄ (অম্ল) → CuSO₄ (লৱণ) + H₂O। CuSO₄ সমাধান উজ্জ্বল নীলা (CuCl₂-তকৈ ঘন)। কোনো গেছ নিৰ্গত নহয়। CBSE: ক্ষাৰীয় অক্সাইড + অম্ল = লৱণ + পানী (ক্ষাৰ + অম্লৰ দৰে)।",
    },
    safety: {
      en: ["H₂SO₄ is highly corrosive", "CuSO₄ is a skin irritant", "Wear gloves and goggles", "Neutralize spills with NaHCO₃"],
      as: ["H₂SO₄ অতি ক্ষয়কাৰক", "CuSO₄ ছালত জ্বলন কৰে", "দস্তানা আৰু চশমা পিন্ধক", "NaHCO₃-ৰে পৰা ঠাই নিৰপেক্ষ কৰক"],
    },
    steps: [
      { label: { en: "Measure CuO Powder", as: "CuO গুড়ি জোখক" }, desc: { en: "Weigh out black CuO powder. Notice its distinctive jet-black colour before the reaction begins.", as: "ক’লা CuO গুড়ি জোখক। বিক্ৰিয়া আৰম্ভ হোৱাৰ পূৰ্বে ইয়াৰ চিনাকি জেট-ক’লা ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Add Dilute H₂SO₄", as: "পাতল H₂SO₄ যোগ কৰক" }, desc: { en: "Slowly add dilute sulphuric acid to the CuO. The black solid begins reacting and dissolving.", as: "CuO-ত লাহে লাহে পাতল ছালফিউৰিক এচিড যোগ কৰক। ক’লা কঠিন বিক্ৰিয়া আৰু দ্ৰৱীভূত হ’বলৈ আৰম্ভ কৰে।" } },
      { label: { en: "Observe Blue Colour", as: "নীলা ৰং লক্ষ্য কৰক" }, desc: { en: "As CuO dissolves, the solution turns bright blue — characteristic of CuSO₄. Black solid disappears.", as: "CuO দ্ৰৱীভূত হোৱাৰ লগে লগে সমাধান উজ্জ্বল নীলা হয় — CuSO₄-ৰ চিনাকি। ক’লা কঠিন অদৃশ্য হয়।" } },
      { label: { en: "Confirm CuSO₄", as: "CuSO₄ নিশ্চিত কৰক" }, desc: { en: "Bright blue solution confirms copper sulphate formation. Evaporate to obtain blue CuSO₄·5H₂O crystals.", as: "উজ্জ্বল নীলা সমাধানে তামা ছালফেট গঠন নিশ্চিত কৰে। নীলা CuSO₄·5H₂O স্ফটিক পাবলৈ বাষ্পীভৱন কৰক।" } },
    ],
    ions: {
      reactants: [
        { sym: "CuO", col: "#1E293B", desc: { en: "Copper oxide (black)", as: "তামা অক্সাইড (ক’লা)" } },
        { sym: "H⁺", col: "#F97316", desc: { en: "Hydrogen from H₂SO₄", as: "H₂SO₄-ৰ পৰা হাইড্ৰ’জেন" } },
        { sym: "SO₄²⁻", col: "#818CF8", desc: { en: "Sulphate ion", as: "ছালফেট আয়ন" } },
      ],
      products: [
        { sym: "Cu²⁺", col: "#3B82F6", desc: { en: "Copper ion (bright blue)", as: "তামা আয়ন (উজ্জ্বল নীলা)" } },
        { sym: "SO₄²⁻", col: "#818CF8", desc: { en: "Sulphate (in CuSO₄)", as: "ছালফেট (CuSO₄-ত)" } },
        { sym: "H₂O", col: "#BAE6FD", desc: { en: "Water molecule", as: "পানী অণু" } },
      ],
    },
    observations: {
      en: ["Black CuO powder dissolves slowly", "Solution turns bright blue (CuSO₄)", "No gas evolved during reaction", "Reaction generates mild heat", "Complete dissolution of CuO", "Bright blue solution — CuSO₄ confirmed"],
      as: ["ক’লা CuO গুড়ি লাহে লাহে দ্ৰৱীভূত হয়", "সমাধান উজ্জ্বল নীলা হয় (CuSO₄)", "বিক্ৰিয়াৰ সময়ত কোনো গেছ নিৰ্গত নহয়", "বিক্ৰিয়াই মৃদু তাপ উৎপন্ন কৰে", "CuO সম্পূৰ্ণৰূপে দ্ৰৱীভূত", "উজ্জ্বল নীলা সমাধান — CuSO₄ নিশ্চিত"],
    },
    pmode: "blue-dissolve",
    quiz: [
      { q: { en: "Salt formed in CuO + H₂SO₄ reaction:", as: "CuO + H₂SO₄ বিক্ৰিয়াত গঠিত লৱণ:" }, opts: { en: ["CuCl₂", "CuSO₄", "CuO₂", "Cu₂SO₄"], as: ["CuCl₂", "CuSO₄", "CuO₂", "Cu₂SO₄"] }, ans: 1 },
      { q: { en: "CuSO₄ solution appears:", as: "CuSO₄ সমাধান দেখা যায়:" }, opts: { en: ["Green", "Yellow", "Bright blue", "Colourless"], as: ["সেউজীয়া", "হালধীয়া", "উজ্জ্বল নীলা", "বৰ্ণহীন"] }, ans: 2 },
      { q: { en: "Type of reaction: CuO + H₂SO₄:", as: "বিক্ৰিয়াৰ ধৰণ: CuO + H₂SO₄:" }, opts: { en: ["Displacement", "Decomposition", "Neutralization", "Combination"], as: ["প্ৰতিস্থাপন", "বিযোজন", "নিৰপেক্ষণ", "সংযোগ"] }, ans: 2 },
      { q: { en: "What is CuSO₄·5H₂O called?", as: "CuSO₄·5H₂O-ক কি বুলি কোৱা হয়?" }, opts: { en: ["Blue vitriol", "Green vitriol", "White vitriol", "Red vitriol"], as: ["নীলা ভিট্ৰিয়’ল", "সেউজীয়া ভিট্ৰিয়’ল", "বগা ভিট্ৰিয়’ল", "ৰঙা ভিট্ৰিয়’ল"] }, ans: 0 },
      { q: { en: "Which product makes the solution blue?", as: "কোন উৎপাদে সমাধানক নীলা কৰে?" }, opts: { en: ["SO₄²⁻ ions", "H₂O molecules", "Cu²⁺ ions", "O²⁻ ions"], as: ["SO₄²⁻ আয়ন", "H₂O অণু", "Cu²⁺ আয়ন", "O²⁻ আয়ন"] }, ans: 2 },
    ],
  },
  {
    id: "co2-caoh2", num: 6,
    title: { en: "CO₂ + Calcium Hydroxide", as: "CO₂ + কেলচিয়াম হাইড্ৰক্সাইড" },
    subtitle: { en: "Limewater Test — White Precipitate", as: "চূনপানী পৰীক্ষা — বগা অৱক্ষেপ" },
    equation: "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O",
    category: "co2-base",
    accent: "#F8FAFC", glow: "rgba(248,250,252,0.3)", gradFrom: "#94A3B8", gradTo: "#CBD5E1", emoji: "🤍",
    hazard: "LOW", gasEvolved: null, precipitate: true, amphoteric: false,
    phaseColors: {
      idle: "rgba(210,240,255,0.2)", step1: "rgba(220,240,255,0.3)",
      step2: "rgba(230,240,255,0.5)", reacting: "rgba(240,248,255,0.65)", complete: "rgba(248,250,252,0.75)",
    },
    description: {
      en: "Carbon dioxide gas passed through limewater (Ca(OH)₂ solution) causes the formation of insoluble calcium carbonate (CaCO₃) — a white precipitate that turns the solution milky. This is the standard laboratory test for CO₂ gas.",
      as: "চূনপানী (Ca(OH)₂ সমাধান)-ৰ মাজেদি কাৰ্বন ডাইঅক্সাইড গেছ প্ৰবাহিত কৰিলে অদ্ৰৱণীয় কেলচিয়াম কাৰ্বনেট (CaCO₃) গঠিত হয় — এক বগা অৱক্ষেপ যিয়ে সমাধানক গাখীৰৰ দৰে কৰে। এইটো CO₂ গেছৰ মানক পৰীক্ষাগাৰ পৰীক্ষা।",
    },
    realWorld: {
      en: "Laboratory CO₂ test · Cement/lime industry · Water hardness · Stalactite/stalagmite formation",
      as: "পৰীক্ষাগাৰ CO₂ পৰীক্ষা · চিমেণ্ট/চূন উদ্যোগ · পানীৰ কঠিনতা · ষ্টেলেক্টাইট/ষ্টেলেগমাইট গঠন",
    },
    examNote: {
      en: "LIMEWATER TEST: CO₂ turns limewater MILKY due to CaCO₃↓ precipitate. This is the STANDARD test for CO₂. CaCO₃ is insoluble — appears as white suspension. Excess CO₂ dissolves CaCO₃ back to Ca(HCO₃)₂. CBSE standard test.",
      as: "চূনপানী পৰীক্ষা: CaCO₃↓ অৱক্ষেপৰ বাবে CO₂-এ চূনপানীক গাখীৰৰ দৰে কৰে। এইটো CO₂-ৰ মানক পৰীক্ষা। CaCO₃ অদ্ৰৱণীয় — বগা ভাঁহি থকা ৰূপত দেখা যায়। অতিৰিক্ত CO₂-এ CaCO₃-ক পুনৰ Ca(HCO₃)₂লৈ দ্ৰৱীভূত কৰে। CBSE মানক পৰীক্ষা।",
    },
    safety: {
      en: ["CO₂ in excess can cause asphyxiation", "Limewater is mildly alkaline", "Ensure proper ventilation", "Goggles recommended"],
      as: ["অতিৰিক্ত CO₂-এ শ্বাসৰোধ কৰিব পাৰে", "চূনপানী মৃদু ক্ষাৰীয়", "সঠিক বায়ু চলাচল নিশ্চিত কৰক", "চশমা উপদেশিত"],
    },
    steps: [
      { label: { en: "Prepare Limewater", as: "চূনপানী প্ৰস্তুত কৰক" }, desc: { en: "Take clear limewater (saturated Ca(OH)₂ solution) in a test tube. Note it is perfectly clear and colourless.", as: "এক টেষ্ট টিউবত স্বচ্ছ চূনপানী (সম্পৃক্ত Ca(OH)₂ সমাধান) লওক। ই সম্পূৰ্ণ স্বচ্ছ আৰু বৰ্ণহীন বুলি লক্ষ্য কৰক।" } },
      { label: { en: "Bubble CO₂ Gas", as: "CO₂ গেছ পাৰ কৰক" }, desc: { en: "Insert delivery tube from CO₂ source into limewater. Bubble gas through the solution steadily.", as: "CO₂ উৎসৰ পৰা পৰিৱহন টিউব চূনপানীত ভৰাওক। সমাধানৰ মাজেদি স্থিৰভাৱে গেছ পাৰ কৰক।" } },
      { label: { en: "Observe Milky Change", as: "গাখীৰৰ দৰে পৰিবৰ্তন লক্ষ্য কৰক" }, desc: { en: "The clear limewater gradually turns milky white as CaCO₃ precipitate forms. White cloudiness spreads.", as: "CaCO₃ অৱক্ষেপ গঠিত হোৱাৰ লগে লগে স্বচ্ছ চূনপানী ক্ৰমে গাখীৰৰ দৰে বগা হয়। বগা ঘোলা ৰং বিয়পি পৰে।" } },
      { label: { en: "Confirm CO₂", as: "CO₂ নিশ্চিত কৰক" }, desc: { en: "Milky appearance confirms CO₂ presence. This is the standard laboratory test for carbon dioxide gas.", as: "গাখীৰৰ দৰে ৰূপে CO₂-ৰ উপস্থিতি নিশ্চিত কৰে। এইটো কাৰ্বন ডাইঅক্সাইড গেছৰ মানক পৰীক্ষাগাৰ পৰীক্ষা।" } },
    ],
    ions: {
      reactants: [
        { sym: "CO₂", col: "#94A3B8", desc: { en: "Carbon dioxide gas", as: "কাৰ্বন ডাইঅক্সাইড গেছ" } },
        { sym: "Ca²⁺", col: "#FDE047", desc: { en: "Calcium ions from Ca(OH)₂", as: "Ca(OH)₂-ৰ পৰা কেলচিয়াম আয়ন" } },
        { sym: "OH⁻", col: "#A78BFA", desc: { en: "Hydroxide ions", as: "হাইড্ৰক্সাইড আয়ন" } },
      ],
      products: [
        { sym: "CaCO₃↓", col: "#F8FAFC", desc: { en: "Calcium carbonate (white ppt)", as: "কেলচিয়াম কাৰ্বনেট (বগা অৱক্ষেপ)" } },
        { sym: "H₂O", col: "#BAE6FD", desc: { en: "Water molecule", as: "পানী অণু" } },
      ],
    },
    observations: {
      en: ["Clear limewater initially colourless", "CO₂ bubbles through solution", "Solution turns milky-white", "White precipitate (CaCO₃) forms", "Precipitate settles slowly", "Standard test confirms CO₂ presence"],
      as: ["আৰম্ভণিতে স্বচ্ছ চূনপানী বৰ্ণহীন", "CO₂ সমাধানৰ মাজেদি বুদবুদ", "সমাধান গাখীৰৰ দৰে বগা হয়", "বগা অৱক্ষেপ (CaCO₃) গঠিত হয়", "অৱক্ষেপ লাহে লাহে তললৈ পৰে", "মানক পৰীক্ষাই CO₂-ৰ উপস্থিতি নিশ্চিত কৰে"],
    },
    pmode: "milky-ppt",
    quiz: [
      { q: { en: "Limewater turns milky due to formation of:", as: "চূনপানী গাখীৰৰ দৰে হোৱাৰ কাৰণ গঠন:" }, opts: { en: ["Ca(OH)₂", "CaCO₃", "CaO", "CaCl₂"], as: ["Ca(OH)₂", "CaCO₃", "CaO", "CaCl₂"] }, ans: 1 },
      { q: { en: "CO₂ + Ca(OH)₂ reaction is the laboratory test for:", as: "CO₂ + Ca(OH)₂ বিক্ৰিয়া কাৰ পৰীক্ষাগাৰ পৰীক্ষা?" }, opts: { en: ["O₂", "H₂", "CO₂", "N₂"], as: ["O₂", "H₂", "CO₂", "N₂"] }, ans: 2 },
      { q: { en: "CaCO₃ in this reaction is:", as: "এই বিক্ৰিয়াত CaCO₃:" }, opts: { en: ["A gas", "A salt in solution", "An insoluble precipitate", "A liquid"], as: ["এক গেছ", "সমাধানত এক লৱণ", "এক অদ্ৰৱণীয় অৱক্ষেপ", "এক তৰল"] }, ans: 2 },
      { q: { en: "Limewater is a solution of:", as: "চূনপানী হ’ল কাৰ সমাধান:" }, opts: { en: ["CaCO₃", "CaO", "Ca(OH)₂", "CaCl₂"], as: ["CaCO₃", "CaO", "Ca(OH)₂", "CaCl₂"] }, ans: 2 },
      { q: { en: "Excess CO₂ in limewater causes:", as: "চূনপানীত অতিৰিক্ত CO₂-এ কৰে:" }, opts: { en: ["More precipitate", "Milky becomes clear (Ca(HCO₃)₂)", "No change", "Yellow colour"], as: ["অধিক অৱক্ষেপ", "গাখীৰৰ দৰে স্বচ্ছ হয় (Ca(HCO₃)₂)", "কোনো পৰিবৰ্তন নাই", "হালধীয়া ৰং"] }, ans: 1 },
    ],
  },
  {
    id: "co2-naoh", num: 7,
    title: { en: "CO₂ + Sodium Hydroxide", as: "CO₂ + ছ’ডিয়াম হাইড্ৰক্সাইড" },
    subtitle: { en: "Acidic Gas + Strong Base", as: "অম্লীয় গেছ + প্ৰবল ক্ষাৰ" },
    equation: "CO₂ + 2NaOH → Na₂CO₃ + H₂O",
    category: "co2-base",
    accent: "#10B981", glow: "rgba(16,185,129,0.4)", gradFrom: "#065F46", gradTo: "#34D399", emoji: "🟢",
    hazard: "LOW", gasEvolved: null, precipitate: false, amphoteric: false,
    phaseColors: {
      idle: "rgba(200,230,210,0.15)", step1: "rgba(16,185,129,0.12)",
      step2: "rgba(16,185,129,0.22)", reacting: "rgba(16,185,129,0.32)", complete: "rgba(6,95,70,0.38)",
    },
    description: {
      en: "Carbon dioxide reacts with sodium hydroxide solution to form sodium carbonate (Na₂CO₃) and water. Unlike CO₂ + limewater, NO visible precipitate forms because Na₂CO₃ is soluble in water. CO₂ is an acidic oxide that neutralises the alkali NaOH.",
      as: "কাৰ্বন ডাইঅক্সাইডে ছ’ডিয়াম হাইড্ৰক্সাইড সমাধানৰ সৈতে বিক্ৰিয়া কৰি ছ’ডিয়াম কাৰ্বনেট (Na₂CO₃) আৰু পানী গঠন কৰে। CO₂ + চূনপানীৰ বিপৰীতে কোনো দৃশ্যমান অৱক্ষেপ গঠিত নহয় কাৰণ Na₂CO₃ পানীত দ্ৰৱণীয়। CO₂ এক অম্লীয় অক্সাইড যিয়ে ক্ষাৰ NaOH নিৰপেক্ষ কৰে।",
    },
    realWorld: {
      en: "Industrial CO₂ scrubbers · Soda ash production · Baking soda manufacturing · CO₂ capture technology",
      as: "ঔদ্যোগিক CO₂ স্ক্ৰাবাৰ · ছ’ডা ছাই উৎপাদন · বেকিং ছ’ডা প্ৰস্তুতি · CO₂ ধৰি ৰখাৰ প্ৰযুক্তি",
    },
    examNote: {
      en: "CO₂ is an ACIDIC OXIDE. Na₂CO₃ (sodium carbonate/washing soda) is SOLUBLE — no precipitate unlike CaCO₃. Reaction is invisible (no colour change). CBSE: acidic oxide + base → salt + water. This contrasts with CO₂ + Ca(OH)₂.",
      as: "CO₂ এক অম্লীয় অক্সাইড। Na₂CO₃ (ছ’ডিয়াম কাৰ্বনেট/ৱাশিং ছ’ডা) দ্ৰৱণীয় — CaCO₃-ৰ বিপৰীতে কোনো অৱক্ষেপ নাই। বিক্ৰিয়া অদৃশ্য (কোনো ৰং পৰিবৰ্তন নাই)। CBSE: অম্লীয় অক্সাইড + ক্ষাৰ → লৱণ + পানী। ই CO₂ + Ca(OH)₂-ৰ সৈতে বৈপৰীত্য।",
    },
    safety: {
      en: ["NaOH is corrosive — wear gloves", "CO₂ at high concentrations is asphyxiating", "Ensure ventilation", "No major hazard with dilute NaOH"],
      as: ["NaOH ক্ষয়কাৰক — দস্তানা পিন্ধক", "উচ্চ ঘনত্বত CO₂ শ্বাসৰোধী", "বায়ু চলাচল নিশ্চিত কৰক", "পাতল NaOH-ৰ লগত কোনো প্ৰধান বিপদ নাই"],
    },
    steps: [
      { label: { en: "Prepare NaOH Solution", as: "NaOH সমাধান প্ৰস্তুত কৰক" }, desc: { en: "Take NaOH solution in a flask. Note that NaOH is colourless and strongly alkaline (pH ≈ 13).", as: "এক ফ্লাস্কত NaOH সমাধান লওক। লক্ষ্য কৰক যে NaOH বৰ্ণহীন আৰু প্ৰবলভাৱে ক্ষাৰীয় (pH ≈ 13)।" } },
      { label: { en: "Bubble CO₂ Through", as: "CO₂ পাৰ কৰক" }, desc: { en: "Pass CO₂ gas through NaOH solution via delivery tube. Gas is absorbed — no visible change in solution.", as: "পৰিৱহন টিউবৰ মাজেদি NaOH সমাধানৰ মাজেদি CO₂ গেছ পাৰ কৰক। গেছ শোষিত হয় — সমাধানত কোনো দৃশ্যমান পৰিবৰ্তন নাই।" } },
      { label: { en: "Observe Absorption", as: "শোষণ লক্ষ্য কৰক" }, desc: { en: "CO₂ reacts with OH⁻ ions. Na₂CO₃ dissolves in water so no precipitate visible. Solution stays clear.", as: "CO₂-এ OH⁻ আয়নৰ সৈতে বিক্ৰিয়া কৰে। Na₂CO₃ পানীত দ্ৰৱীভূত হয় সেয়েহে কোনো অৱক্ষেপ দেখা নাযায়। সমাধান স্বচ্ছ থাকে।" } },
      { label: { en: "Confirm Na₂CO₃", as: "Na₂CO₃ নিশ্চিত কৰক" }, desc: { en: "Test solution with CaCl₂: white precipitate confirms CO₃²⁻ ions present → Na₂CO₃ formed.", as: "CaCl₂-ৰে সমাধান পৰীক্ষা কৰক: বগা অৱক্ষেপে CO₃²⁻ আয়নৰ উপস্থিতি নিশ্চিত কৰে → Na₂CO₃ গঠিত।" } },
    ],
    ions: {
      reactants: [
        { sym: "CO₂", col: "#94A3B8", desc: { en: "Carbon dioxide (acidic oxide)", as: "কাৰ্বন ডাইঅক্সাইড (অম্লীয় অক্সাইড)" } },
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ions", as: "ছ’ডিয়াম আয়ন" } },
        { sym: "OH⁻", col: "#A78BFA", desc: { en: "Hydroxide ions from NaOH", as: "NaOH-ৰ পৰা হাইড্ৰক্সাইড আয়ন" } },
      ],
      products: [
        { sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ion (in Na₂CO₃)", as: "ছ’ডিয়াম আয়ন (Na₂CO₃-ত)" } },
        { sym: "CO₃²⁻", col: "#34D399", desc: { en: "Carbonate ion (in solution)", as: "কাৰ্বনেট আয়ন (সমাধানত)" } },
        { sym: "H₂O", col: "#BAE6FD", desc: { en: "Water molecule", as: "পানী অণু" } },
      ],
    },
    observations: {
      en: ["CO₂ bubbles through NaOH solution", "NO visible precipitate forms", "Solution remains clear (Na₂CO₃ soluble)", "CO₂ is completely absorbed", "Slight warming may occur", "Na₂CO₃ confirmed by CaCl₂ test"],
      as: ["NaOH সমাধানৰ মাজেদি CO₂ বুদবুদ", "কোনো দৃশ্যমান অৱক্ষেপ গঠিত নহয়", "সমাধান স্বচ্ছ থাকে (Na₂CO₃ দ্ৰৱণীয়)", "CO₂ সম্পূৰ্ণৰূপে শোষিত", "অলপ গৰম হ’ব পাৰে", "CaCl₂ পৰীক্ষাৰে Na₂CO₃ নিশ্চিত"],
    },
    pmode: "co2-absorb",
    quiz: [
      { q: { en: "CO₂ + 2NaOH produces:", as: "CO₂ + 2NaOH উৎপন্ন কৰে:" }, opts: { en: ["NaHCO₃ + H₂", "Na₂CO₃ + H₂O", "NaOH + CO₂", "Na₂O + H₂CO₃"], as: ["NaHCO₃ + H₂", "Na₂CO₃ + H₂O", "NaOH + CO₂", "Na₂O + H₂CO₃"] }, ans: 1 },
      { q: { en: "Why is no precipitate seen in CO₂ + NaOH?", as: "CO₂ + NaOH-ত অৱক্ষেপ কিয় দেখা নাযায়?" }, opts: { en: ["No reaction occurs", "Na₂CO₃ is soluble in water", "CO₂ escapes", "NaOH prevents precipitation"], as: ["কোনো বিক্ৰিয়া নহয়", "Na₂CO₃ পানীত দ্ৰৱণীয়", "CO₂ পলাই যায়", "NaOH-এ অৱক্ষেপণ ৰোধ কৰে"] }, ans: 1 },
      { q: { en: "CO₂ is classified as:", as: "CO₂-ক শ্ৰেণীভুক্ত কৰা হয়:" }, opts: { en: ["Basic oxide", "Acidic oxide", "Neutral oxide", "Amphoteric oxide"], as: ["ক্ষাৰীয় অক্সাইড", "অম্লীয় অক্সাইড", "নিৰপেক্ষ অক্সাইড", "উভধাৰ্মী অক্সাইড"] }, ans: 1 },
      { q: { en: "Na₂CO₃ is also known as:", as: "Na₂CO₃-ক কোৱা হয়:" }, opts: { en: ["Baking soda", "Washing soda", "Caustic soda", "Quick lime"], as: ["বেকিং ছ’ডা", "ৱাশিং ছ’ডা", "ক’ষ্টিক ছ’ডা", "ক্যুইক লাইম"] }, ans: 1 },
      { q: { en: "Difference between CO₂+Ca(OH)₂ and CO₂+NaOH:", as: "CO₂+Ca(OH)₂ আৰু CO₂+NaOH-ৰ পাৰ্থক্য:" }, opts: { en: ["Different gas", "Different temperature", "CaCO₃ insoluble, Na₂CO₃ soluble", "Same product"], as: ["বেলেগ গেছ", "বেলেগ উষ্ণতা", "CaCO₃ অদ্ৰৱণীয়, Na₂CO₃ দ্ৰৱণীয়", "একে উৎপাদ"] }, ans: 2 },
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

      if (mode === "h2-bubbles" || mode === "base-h2") {
        const speed = mode === "h2-bubbles" ? 1 : 0.5;
        const rate = mode === "h2-bubbles" ? 0.4 : 0.2;
        if (Math.random() < rate * intensity) ps.push({
          x: W() * 0.25 + Math.random() * W() * 0.5,
          y: H() * 0.65 + Math.random() * H() * 0.2,
          vx: (Math.random() - 0.5) * 0.8, vy: -(speed + Math.random() * 1.5),
          life: 80, maxLife: 80, size: 2.5 + Math.random() * 4,
          color: `rgba(${mode === "h2-bubbles" ? "200,230,255" : "220,200,255"},${0.5 + Math.random() * 0.4})`,
          blur: 4,
        });
      }

      if (mode === "milky-ppt") {
        if (Math.random() < 0.3 * intensity) ps.push({
          x: W() * 0.15 + Math.random() * W() * 0.7,
          y: H() * 0.2 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 0.4, vy: 0.4 + Math.random() * 0.8,
          life: 120, maxLife: 120, size: 2 + Math.random() * 4,
          color: `rgba(248,250,252,${0.6 + Math.random() * 0.35})`, blur: 5,
        });
        if (Math.random() < 0.15 * intensity) ps.push({
          x: W() * 0.15 + Math.random() * W() * 0.7,
          y: H() * 0.1 + Math.random() * H() * 0.2,
          vx: (Math.random() - 0.5) * 0.3, vy: 0.2 + Math.random() * 0.5,
          life: 60, maxLife: 60, size: 1.5 + Math.random() * 2.5,
          color: `rgba(210,230,255,${0.4 + Math.random() * 0.3})`, blur: 3,
        });
      }

      if (mode === "blue-dissolve") {
        if (Math.random() < 0.25 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6,
          y: H() * 0.5 + Math.random() * H() * 0.35,
          vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
          life: 60, maxLife: 60, size: 3 + Math.random() * 5,
          color: `rgba(6,182,212,${0.6 + Math.random() * 0.3})`, blur: 9,
        });
        if (Math.random() < 0.1 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6,
          y: H() * 0.4 + Math.random() * H() * 0.4,
          vx: (Math.random() - 0.5) * 0.6, vy: -0.8 - Math.random(),
          life: 40, maxLife: 40, size: 1.5 + Math.random() * 2,
          color: `rgba(255,255,255,0.4)`, blur: 5,
        });
      }

      if (mode === "co2-absorb") {
        if (Math.random() < 0.2 * intensity) ps.push({
          x: W() * 0.3 + Math.random() * W() * 0.4,
          y: H() * 0.1 + Math.random() * H() * 0.2,
          vx: (Math.random() - 0.5) * 0.7, vy: 0.6 + Math.random() * 1,
          life: 70, maxLife: 70, size: 3 + Math.random() * 4,
          color: `rgba(52,211,153,${0.4 + Math.random() * 0.3})`, blur: 7,
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
        if (mode === "h2-bubbles" || mode === "base-h2") p.vx *= 0.99;
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
// GAS TEST PANEL (unique to this lab)
// ═══════════════════════════════════════════════════════════

function GasTestPanel({ exp, phase }: { exp: Exp; phase: Phase }) {
  const [popTested, setPopTested] = useState(false);
  const canTest = exp.gasEvolved === "H₂" && phase === "complete";
  const { lang } = useLanguage();
  const isAs = lang === "as";

  return (
    <GlassPanel className="p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Wind className="w-3.5 h-3.5" style={{ color: exp.accent }} />
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "গেছ বিশ্লেষণ" : "Gas Analysis"}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between rounded-lg px-2.5 py-2" style={{ background: "rgba(255,255,255,0.04)" }}>
          <span className="text-[10px] text-slate-400">{isAs ? "নিৰ্গত গেছ" : "Gas Evolved"}</span>
          <span className="text-[10px] font-black" style={{ color: exp.gasEvolved ? exp.accent : "#94A3B8" }}>
            {exp.gasEvolved ?? (isAs ? "নাই" : "None")}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg px-2.5 py-2" style={{ background: "rgba(255,255,255,0.04)" }}>
          <span className="text-[10px] text-slate-400">{isAs ? "অৱক্ষেপ" : "Precipitate"}</span>
          <span className="text-[10px] font-black" style={{ color: exp.precipitate ? "#F8FAFC" : "#94A3B8" }}>
            {exp.precipitate ? (isAs ? "বগা ↓" : "White ↓") : (isAs ? "নাই" : "None")}
          </span>
        </div>
        {exp.amphoteric && (
          <div className="rounded-lg px-2.5 py-2 border" style={{ background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.3)" }}>
            <p className="text-[9px] font-black text-purple-300">{isAs ? "⚡ উভধাৰ্মী ধাতু" : "⚡ AMPHOTERIC METAL"}</p>
            <p className="text-[8px] text-slate-400">{isAs ? "অম্ল আৰু ক্ষাৰ দুয়োৰে সৈতে বিক্ৰিয়া কৰে" : "Reacts with both acids & bases"}</p>
          </div>
        )}
        {exp.gasEvolved === "H₂" && (
          <button disabled={!canTest} onClick={() => setPopTested(true)}
            className="w-full py-2 rounded-xl text-xs font-black transition-all disabled:opacity-30"
            style={{ background: canTest ? `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` : "rgba(255,255,255,0.05)", color: "white" }}>
            <Flame className="w-3.5 h-3.5 inline mr-1" />{canTest ? (isAs ? "🔥 পপ পৰীক্ষা" : "🔥 Pop Test") : (isAs ? "প্ৰথমে পৰীক্ষা সম্পূৰ্ণ কৰক" : "Complete exp. first")}
          </button>
        )}
        <AnimatePresence>
          {popTested && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-lg p-2.5 border text-center" style={{ background: "rgba(251,146,60,0.12)", borderColor: "rgba(251,146,60,0.3)" }}>
              <p className="text-sm">🔥</p>
              <p className="text-[10px] font-black text-orange-300">{isAs ? "পপ! — H₂ নিশ্চিত" : "POP! — H₂ Confirmed"}</p>
              <p className="text-[8px] text-slate-400">{isAs ? "জ্বলন্ত চিপাই পপ শব্দ উৎপন্ন কৰে" : "Burning splint produces pop sound"}</p>
              <button onClick={() => setPopTested(false)} className="mt-1 text-[8px] text-slate-500 underline">{isAs ? "পুনৰ আৰম্ভ" : "Reset"}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// APPARATUS SVG
// ═══════════════════════════════════════════════════════════

function ApparatusSVG({ exp, phase }: { exp: Exp; phase: Phase }) {
  const liqColor = exp.phaseColors[phase];
  const reacting = phase === "reacting" || phase === "complete";

  if (exp.category === "metal-acid" || exp.category === "metal-base") {
    const metalColor = phase === "complete" ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.7)";
    const bubbleColor = exp.category === "metal-base" ? "rgba(167,139,250,0.7)" : "rgba(200,230,255,0.7)";
    return (
      <svg viewBox="0 0 240 210" className="w-full h-full">
        <defs>
          <radialGradient id={`liq-${exp.id}`} cx="50%" cy="70%" r="55%">
            <stop offset="0%" stopColor={liqColor} stopOpacity="1" />
            <stop offset="100%" stopColor={liqColor} stopOpacity="0.5" />
          </radialGradient>
        </defs>
        {/* Test tube / beaker */}
        <path d="M80,20 L80,160 Q80,178 100,178 L140,178 Q160,178 160,160 L160,20"
          fill="rgba(147,197,253,0.05)" stroke="rgba(147,197,253,0.3)" strokeWidth="1.8" />
        {/* Liquid */}
        <path d={`M82,70 L82,162 Q82,176 100,176 L140,176 Q158,176 158,162 L158,70 Z`}
          fill={`url(#liq-${exp.id})`} />
        {/* Metal strip */}
        <motion.rect x="110" y="22" width="12" height={reacting ? 80 : 100} rx="2"
          fill={metalColor} animate={{ height: reacting ? [100, 85, 70] : [100] }}
          transition={{ duration: 8, ease: "linear", repeat: reacting ? Infinity : 0 }} />
        {/* Bubbles */}
        {reacting && [0, 1, 2, 3].map(i => (
          <motion.circle key={i} cx={108 + i * 4} cy={160} r="3"
            fill={bubbleColor} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"
            animate={{ cy: [160, 70], opacity: [0.8, 0], r: [3, 2] }}
            transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }} />
        ))}
        {/* Delivery tube for H₂ collection (metal-acid only) */}
        {exp.category === "metal-acid" && (
          <g>
            <path d="M160,60 Q185,60 185,40 L185,25" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" />
            <path d="M175,8 L195,8 L192,25 L178,25 Z" fill="rgba(200,230,255,0.15)" stroke="rgba(147,197,253,0.4)" strokeWidth="1" />
            <text x="185" y="6" textAnchor="middle" fill="rgba(200,230,255,0.6)" fontSize="6">H₂</text>
          </g>
        )}
        {/* Acid/base label */}
        <text x="200" y="100" fill="rgba(148,163,184,0.5)" fontSize="7.5" textAnchor="middle" transform="rotate(90,200,100)">
          {exp.category === "metal-base" ? "NaOH" : exp.id === "zn-h2so4" ? "H₂SO₄" : "HCl"}
        </text>
        <text x="120" y="200" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="7.5">{exp.equation}</text>
      </svg>
    );
  }

  if (exp.category === "oxide-acid") {
    const isCuSO4 = exp.id === "cuo-h2so4";
    return (
      <svg viewBox="0 0 240 210" className="w-full h-full">
        <defs>
          <radialGradient id={`ox-${exp.id}`} cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor={exp.phaseColors[phase]} stopOpacity="1.2" />
            <stop offset="100%" stopColor={exp.phaseColors[phase]} stopOpacity="0.4" />
          </radialGradient>
        </defs>
        {/* Beaker */}
        <path d="M55,35 L55,162 Q55,175 70,175 L170,175 Q185,175 185,162 L185,35"
          fill="rgba(147,197,253,0.04)" stroke="rgba(147,197,253,0.28)" strokeWidth="1.8" />
        <line x1="55" y1="35" x2="40" y2="20" stroke="rgba(147,197,253,0.28)" strokeWidth="1.8" />
        <line x1="185" y1="35" x2="200" y2="20" stroke="rgba(147,197,253,0.28)" strokeWidth="1.8" />
        {/* Liquid / solution */}
        <path d="M57,78 L57,163 Q57,173 70,173 L170,173 Q183,173 183,163 L183,78 Z" fill={`url(#ox-${exp.id})`} />
        {/* CuO powder (black particles) */}
        {["idle","step1"].includes(phase) && [0,1,2,3,4,5,6,7].map(i => (
          <circle key={i} cx={85 + (i % 4) * 18} cy={100 + Math.floor(i / 4) * 14}
            r={3 + (i % 2)} fill="rgba(30,41,59,0.9)" />
        ))}
        {/* Dissolving CuO */}
        {phase === "step2" && [0,1,2,3].map(i => (
          <motion.circle key={i} cx={90 + i * 20} cy={105 + i * 8}
            r="3" fill="rgba(30,41,59,0.5)"
            animate={{ opacity: [0.5, 0], cy: [105 + i * 8, 130 + i * 5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
        ))}
        {/* Blue glow of solution */}
        {reacting && (
          <motion.ellipse cx="120" cy="130" rx="55" ry="20"
            fill={isCuSO4 ? "rgba(37,99,235,0.15)" : "rgba(6,182,212,0.15)"}
            animate={{ rx: [55, 60, 55] }} transition={{ duration: 2, repeat: Infinity }} />
        )}
        {/* Stirring rod */}
        <line x1="150" y1="30" x2="148" y2="170" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeDasharray="4,3" />
        <text x="120" y="198" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="7.5">{exp.equation}</text>
      </svg>
    );
  }

  // CO₂ + base: delivery tube into solution
  return (
    <svg viewBox="0 0 240 210" className="w-full h-full">
      <defs>
        <radialGradient id={`co2-${exp.id}`} cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor={exp.phaseColors[phase]} stopOpacity="1" />
          <stop offset="100%" stopColor={exp.phaseColors[phase]} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {/* Conical flask */}
      <path d="M65,115 L80,170 Q80,182 100,182 Q120,182 120,170 L135,115 Z"
        fill={`url(#co2-${exp.id})`} stroke="rgba(147,197,253,0.3)" strokeWidth="1.5" />
      <line x1="65" y1="115" x2="135" y2="115" stroke="rgba(147,197,253,0.3)" strokeWidth="2" />
      <rect x="86" y="107" width="28" height="9" rx="4" fill="rgba(147,197,253,0.06)" stroke="rgba(147,197,253,0.25)" strokeWidth="1" />
      {/* CO₂ source flask */}
      <ellipse cx="185" cy="55" rx="28" ry="22" fill="rgba(148,163,184,0.07)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.5" />
      <text x="185" y="59" textAnchor="middle" fill="rgba(148,163,184,0.7)" fontSize="8" fontWeight="bold">CO₂</text>
      {/* Delivery tube */}
      <path d="M185,77 Q185,105 130,110 L100,130" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" />
      {/* CO₂ bubbles into flask */}
      {phase !== "idle" && [0,1,2].map(i => (
        <motion.circle key={i} cx={100} cy={165 - i * 15} r="4"
          fill="rgba(148,163,184,0.5)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"
          animate={{ cy: [165 - i * 8, 130], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }} />
      ))}
      {/* Milky effect for Ca(OH)₂ */}
      {exp.id === "co2-caoh2" && reacting && (
        <motion.ellipse cx="100" cy="158" rx="28" ry="12"
          fill="rgba(248,250,252,0.3)"
          animate={{ rx: [28, 32, 28], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      )}
      <text x="100" y="200" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="7.5">{exp.equation}</text>
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
            <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }}
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

  const rxnPct = phase === "complete" ? 100 : phase === "reacting" ? 72 : phase === "step2" ? 35 : phase === "step1" ? 12 : 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#050B18" }}>
      {/* Header */}
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
          {exp.gasEvolved && <NeonBadge label={`${exp.gasEvolved}↑`} color={exp.accent} />}
          {exp.precipitate && <NeonBadge label={isAs ? "অৱক্ষেপ↓" : "ppt↓"} color="#F8FAFC" />}
          {exp.amphoteric && <NeonBadge label={isAs ? "উভধাৰ্মী" : "amphoteric"} color="#8B5CF6" />}
        </div>
        <LanguageToggle />
        <button onClick={() => setShowSafety(s => !s)} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><Shield className="w-4 h-4 text-slate-400" /></button>
        <button onClick={reset} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><RotateCcw className="w-4 h-4 text-slate-400" /></button>
      </div>

      {/* Safety */}
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

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 240 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="absolute inset-0 p-3"><ApparatusSVG exp={exp} phase={phase} /></div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen" }} />
            <div className="absolute top-2 right-2">
              <NeonBadge label={phase === "idle" ? (isAs ? "সাজু" : "READY") : phase === "reacting" ? (isAs ? "বিক্ৰিয়া" : "REACTING") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "COMPLETE") : `${isAs ? "পদক্ষেপ" : "STEP"} ${stepIdx + 1}`}
                color={phase === "reacting" ? exp.accent : phase === "complete" ? "#34D399" : "#60A5FA"} />
            </div>
          </GlassPanel>

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
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl text-xs font-black border hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />{isAs ? "পুনৰাবৃত্তি" : "Repeat"}
                </button>
                <button onClick={() => setShowQuiz(true)} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>{isAs ? "কুইজ দিয়ক" : "Take Quiz"}</button>
              </div>
            )}
          </GlassPanel>

          <GasTestPanel exp={exp} phase={phase} />
        </div>

        {/* Middle */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সন্তুলিত সমীকৰণ" : "Balanced Equation"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-sm border mb-2"
              style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>{exp.equation}</div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "জীৱন্ত বিশ্লেষণ" : "Live Analysis"}</p>
            <div className="space-y-3">
              <AnimBar label={isAs ? "বিক্ৰিয়াৰ অগ্ৰগতি" : "Reaction Progress"} target={rxnPct} accent={exp.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimBar label={isAs ? "গেছ নিৰ্গমন" : "Gas Evolution"} target={exp.gasEvolved ? rxnPct : 0} accent="#E2E8F0" icon={<Wind className="w-3 h-3" />} />
              <AnimBar label={isAs ? "পৰিবাহিতা" : "Conductivity"} target={rxnPct * 0.8} accent="#22D3EE" icon={<Zap className="w-3 h-3" />} />
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "শ্ৰেণী" : "Category"} value={
                exp.category === "metal-acid" ? (isAs ? "ধাতু + অম্ল" : "Metal + Acid") :
                exp.category === "metal-base" ? (isAs ? "ধাতু + ক্ষাৰ" : "Metal + Base") :
                exp.category === "oxide-acid" ? (isAs ? "অক্সাইড + অম্ল" : "Oxide + Acid") : (isAs ? "CO₂ + ক্ষাৰ" : "CO₂ + Base")
              } color={exp.accent} />
              <DataRow label={isAs ? "নিৰ্গত গেছ" : "Gas Evolved"} value={exp.gasEvolved ?? (isAs ? "নাই" : "None")} color={exp.gasEvolved ? "#E2E8F0" : "#475569"} />
              <DataRow label={isAs ? "অৱক্ষেপ" : "Precipitate"} value={exp.precipitate ? (isAs ? "হয় — CaCO₃↓" : "Yes — CaCO₃↓") : (isAs ? "নাই" : "No")} color={exp.precipitate ? "#F8FAFC" : "#475569"} />
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

const CAT_MAP: Record<string, Category | null> = {
  "All": null, "Metal + Acid": "metal-acid", "Metal + Base": "metal-base",
  "Oxide + Acid": "oxide-acid", "CO₂ + Base": "co2-base",
};
const CAT_COLORS: Record<string, string> = {
  "All": "#64748B", "Metal + Acid": "#3B82F6", "Metal + Base": "#8B5CF6",
  "Oxide + Acid": "#06B6D4", "CO₂ + Base": "#10B981",
};

function LabHub({ onSelect }: { onSelect: (e: Exp) => void }) {
  const [filter, setFilter] = useState("All");
  const visible = EXPERIMENTS.filter(e => CAT_MAP[filter] === null || e.category === CAT_MAP[filter]);
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const categories = ["All", "Metal + Acid", "Metal + Base", "Oxide + Acid", "CO₂ + Base"];
  const catLabel = (cat: string): string => {
    if (!isAs) return cat;
    return cat === "All" ? "সকলো" : cat === "Metal + Acid" ? "ধাতু + অম্ল" : cat === "Metal + Base" ? "ধাতু + ক্ষাৰ" : cat === "Oxide + Acid" ? "অক্সাইড + অম্ল" : "CO₂ + ক্ষাৰ";
  };
  const hazardLabel = (h: Exp["hazard"]) => isAs ? (h === "HIGH" ? "উচ্চ" : h === "MEDIUM" ? "মধ্যম" : "কম") : h;

  const refCards = isAs
    ? [
        { title: "ধাতু + অম্ল", icon: "⚗️", col: "#3B82F6", desc: "ধাতু + পাতল অম্ল → লৱণ + H₂↑। ক্ৰিয়াশীলতা শ্ৰেণীত H-ৰ ওপৰৰ ধাতুৱে H₂ প্ৰতিস্থাপন কৰে। পপ পৰীক্ষাৰে নিশ্চিত।" },
        { title: "উভধাৰ্মী ধাতু", icon: "⚡", col: "#8B5CF6", desc: "Zn আৰু Al অম্ল আৰু ক্ষাৰ দুয়োৰে সৈতে বিক্ৰিয়া কৰে। Zn+NaOH → Na₂ZnO₂ + H₂। দ্বৈত প্ৰকৃতি প্ৰদৰ্শন।" },
        { title: "অক্সাইড + অম্ল", icon: "🔵", col: "#06B6D4", desc: "ক্ষাৰীয় অক্সাইড + অম্ল → লৱণ + পানী। কোনো গেছ নাই। CuO+এচিডে ৰঙীন Cu²⁺ লৱণ দিয়ে (নীলা/সেউজীয়া)।" },
        { title: "CO₂ বিক্ৰিয়া", icon: "☁️", col: "#10B981", desc: "CO₂+Ca(OH)₂ → CaCO₃↓ (গাখীৰৰ দৰে)। CO₂+NaOH → Na₂CO₃ (অৱক্ষেপ নাই, দ্ৰৱণীয়)। চূনপানী পৰীক্ষা।" },
      ]
    : [
        { title: "Metal + Acid", icon: "⚗️", col: "#3B82F6", desc: "Metal + Dilute Acid → Salt + H₂↑. Metals above H in reactivity series displace H₂. Confirmed by pop test." },
        { title: "Amphoteric Metals", icon: "⚡", col: "#8B5CF6", desc: "Zn and Al react with BOTH acids and bases. Zn+NaOH → Na₂ZnO₂ + H₂. Demonstrates dual nature." },
        { title: "Oxide + Acid", icon: "🔵", col: "#06B6D4", desc: "Basic oxide + acid → salt + water. No gas evolved. CuO+acid gives coloured Cu²⁺ salts (blue/green)." },
        { title: "CO₂ Reactions", icon: "☁️", col: "#10B981", desc: "CO₂+Ca(OH)₂ → CaCO₃↓ (milky). CO₂+NaOH → Na₂CO₃ (no precipitate, soluble). Limewater test." },
      ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #0a0d1a 60%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-15 animate-pulse"
            style={{ width: 2 + (i * 13 % 4), height: 2 + (i * 13 % 4), left: `${(i * 41 + 5) % 100}%`, top: `${(i * 67 + 13) % 100}%`, background: ["#3B82F6","#8B5CF6","#06B6D4","#10B981","#F97316","#EF4444"][i % 6], animationDelay: `${i * 0.28}s`, animationDuration: `${2.5 + (i % 3)}s` }} />
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
            <Zap className="w-3.5 h-3.5" /> {isAs ? "অম্ল-ক্ষাৰ আন্তঃক্ৰিয়া · অধ্যায় ২" : "Acid-Base Interactions · Chapter 2"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "ধাতু আৰু অক্সাইড" : "Metals & Oxides"}<br />
            <span style={{ background: "linear-gradient(135deg, #3B82F6, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isAs ? "বিক্ৰিয়া লেব" : "Reaction Lab"}
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs ? "৭টা ক্ৰিয়াশীল পৰীক্ষা — ধাতু-অম্ল বিক্ৰিয়া, H₂ গেছ নিৰ্গমন, অক্সাইড নিৰপেক্ষণ, CO₂ শোষণ, আৰু CBSE-ধৰণৰ মূল্যায়ন।" : "7 interactive experiments — metal-acid reactions, H₂ gas evolution, oxide neutralization, CO₂ absorption, and CBSE-style assessment."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs
              ? [["৭","পৰীক্ষা"],["H₂","পপ পৰীক্ষা"],["উভধাৰ্মী","জিংক"],["CBSE","সংযুক্ত"]]
              : [["7","Experiments"],["H₂","Pop Test"],["Amphoteric","Zinc"],["CBSE","Aligned"]]
            ).map(([v, l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all hover:scale-105"
              style={{
                background: filter === cat ? `linear-gradient(135deg, ${CAT_COLORS[cat]}, ${CAT_COLORS[cat]}88)` : "rgba(255,255,255,0.05)",
                color: filter === cat ? "white" : CAT_COLORS[cat],
                border: `1px solid ${filter === cat ? "transparent" : `${CAT_COLORS[cat]}44`}`,
              }}>
              {catLabel(cat)}
            </button>
          ))}
        </div>

        {/* Experiment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {visible.map((exp, i) => (
            <motion.button key={exp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
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
                      {exp.gasEvolved && <NeonBadge label={`${exp.gasEvolved}↑`} color="#E2E8F0" />}
                      {exp.precipitate && <NeonBadge label={isAs ? "অৱক্ষেপ↓" : "ppt↓"} color="#94A3B8" />}
                      {exp.amphoteric && <NeonBadge label={isAs ? "উভধাৰ্মী" : "amphoteric"} color="#8B5CF6" />}
                    </div>
                    <h3 className="font-black text-white text-sm leading-snug group-hover:opacity-80 transition-all mt-1">{pickLang(exp.title, lang)}</h3>
                    <p className="text-[10px] text-slate-400">{pickLang(exp.subtitle, lang)}</p>
                  </div>
                </div>
                <div className="font-mono text-[10px] rounded-lg px-2 py-1.5 mb-3 border"
                  style={{ borderColor: `${exp.accent}25`, background: `${exp.accent}08`, color: exp.accent }}>
                  {exp.equation}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <NeonBadge label={hazardLabel(exp.hazard)} color={exp.hazard === "HIGH" ? "#EF4444" : exp.hazard === "MEDIUM" ? "#FB923C" : "#22C55E"} />
                    <NeonBadge label={`${exp.steps.length} ${isAs ? "পদক্ষেপ" : "steps"}`} color="#64748B" />
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

        {/* Reference cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {refCards.map(card => (
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

export default function AcidMetalOxideLab() {
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
