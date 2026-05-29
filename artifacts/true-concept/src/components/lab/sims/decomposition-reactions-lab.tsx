/**
 * Decomposition Reactions Virtual Lab — Production-Grade Module
 * 7 interactive experiments: thermal, photolytic, electrolytic decomposition
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
  ChevronRight, BarChart2, Sun, Flame,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ExpId = "caco3" | "feso4" | "pb-no3" | "znco3" | "agcl" | "agbr" | "h2o-electrolysis";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "thermal" | "brown-gas" | "so2-gas" | "co2-gas" | "uv-glow" | "electrolysis" | "none";

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
  equation: string;
  category: "Thermal" | "Photolytic" | "Electrolytic";
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  energy: string; peakTemp: string; hazard: "LOW" | "MEDIUM" | "HIGH";
  pmode: PMode;
}

// ─── Category & label translation maps ──────────────────────────────────
const CATEGORY_LABEL: Record<Exp["category"], BilingualField<string>> = {
  Thermal:      { en: "Thermal",      as: "তাপীয়" },
  Photolytic:   { en: "Photolytic",   as: "আলোক" },
  Electrolytic: { en: "Electrolytic", as: "বৈদ্যুতিক" },
};

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════

const EXPERIMENTS: Exp[] = [
  {
    id: "caco3", num: 1,
    title: { en: "Calcium Carbonate", as: "কেলচিয়াম কাৰ্বনেট" },
    subtitle: { en: "Thermal Decomposition", as: "তাপীয় বিযোজন" },
    equation: "CaCO₃ → CaO + CO₂↑",
    category: "Thermal", accent: "#FB923C", glow: "rgba(251,146,60,0.4)",
    gradFrom: "#EA580C", gradTo: "#FB923C", emoji: "🔥",
    energy: "~840 kJ/mol", peakTemp: "840 °C", hazard: "MEDIUM",
    description: {
      en: "Calcium carbonate (limestone) decomposes on strong heating to form calcium oxide (quicklime) and carbon dioxide gas. The CO₂ can be confirmed by lime water test.",
      as: "কেলচিয়াম কাৰ্বনেটে (চূনশিল) প্ৰবল উত্তাপত বিযোজিত হৈ কেলচিয়াম অক্সাইড (কুইকলাইম) আৰু কাৰ্বন ডাইঅক্সাইড গেছ গঠন কৰে। CO₂-ক চূনৰ পানীৰ পৰীক্ষাৰে নিশ্চিত কৰিব পাৰি।",
    },
    realWorld: { en: "Cement industry · Lime kiln · Glass manufacturing · Steel production", as: "চিমেণ্ট উদ্যোগ · চূন ভাটি · কাঁচ উৎপাদন · ইস্পাত উৎপাদন" },
    examNote: { en: "CaCO₃ is a white solid. CaO is also white. CO₂ turns lime water milky. This is a thermal decomposition reaction.", as: "CaCO₃ এক বগা কঠিন। CaO-ও বগা। CO₂-এ চূনৰ পানী গাখীৰীয়া কৰে। এইটো এক তাপীয় বিযোজন বিক্ৰিয়া।" },
    safety: { en: ["Wear heat-resistant gloves", "Use tongs for hot crucible", "Ensure proper ventilation for CO₂"], as: ["তাপ-প্ৰতিৰোধী দস্তানা পিন্ধক", "গৰম ক্ৰুচিবলৰ বাবে টংছ ব্যৱহাৰ কৰক", "CO₂-ৰ বাবে সঠিক বায়ু চলাচল নিশ্চিত কৰক"] },
    steps: [
      { label: { en: "Load Crucible", as: "ক্ৰুচিবল ভৰাওক" }, desc: { en: "Place calcium carbonate (limestone) powder in the crucible. Note the white colour.", as: "ক্ৰুচিবলত কেলচিয়াম কাৰ্বনেট (চূনশিল) চূৰ্ণ ৰাখক। বগা ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Apply Strong Heat", as: "প্ৰবল উত্তাপ প্ৰয়োগ কৰক" }, desc: { en: "Heat strongly with Bunsen burner. Temperature must reach ~840 °C for decomposition.", as: "বানচেন বাৰ্নাৰেৰে প্ৰবলভাৱে তাপ দিয়ক। বিযোজনৰ বাবে উষ্ণতা ~৮৪০ °C-ত উঠা আৱশ্যক।" } },
      { label: { en: "Observe Decomposition", as: "বিযোজন লক্ষ্য কৰক" }, desc: { en: "CO₂ gas evolves. White CaO residue remains in crucible.", as: "CO₂ গেছ নিৰ্গত হয়। ক্ৰুচিবলত বগা CaO অৱশিষ্ট থাকে।" } },
      { label: { en: "Lime Water Test", as: "চূনৰ পানীৰ পৰীক্ষা" }, desc: { en: "Pass evolved gas through lime water — it turns milky, confirming CO₂.", as: "নিৰ্গত গেছ চূনৰ পানীৰ মাজেদি গতি কৰাওক — ই গাখীৰীয়া হয়, CO₂ নিশ্চিত হয়।" } },
    ],
    observations: { en: ["White CaCO₃ gradually loses CO₂ on heating", "Colourless CO₂ gas evolves", "White CaO residue remains", "Lime water turns milky (confirms CO₂)"], as: ["তাপৰ ফলত বগা CaCO₃-এ ক্ৰমে CO₂ হেৰুৱায়", "বৰ্ণহীন CO₂ গেছ নিৰ্গত হয়", "বগা CaO অৱশিষ্ট থাকে", "চূনৰ পানী গাখীৰীয়া হয় (CO₂ নিশ্চিত)"] },
    pmode: "thermal",
    quiz: [
      { q: { en: "Which gas is evolved when CaCO₃ is heated?", as: "CaCO₃ তাপ দিলে কোন গেছ নিৰ্গত হয়?" }, opts: { en: ["SO₂", "CO₂", "O₂", "NO₂"], as: ["SO₂", "CO₂", "O₂", "NO₂"] }, ans: 1 },
      { q: { en: "What is the residue formed after decomposition of CaCO₃?", as: "CaCO₃-ৰ বিযোজনৰ পিছত গঠিত অৱশিষ্ট কি?" }, opts: { en: ["Ca(OH)₂", "CaCO₃", "CaO", "Ca₃(PO₄)₂"], as: ["Ca(OH)₂", "CaCO₃", "CaO", "Ca₃(PO₄)₂"] }, ans: 2 },
      { q: { en: "How is CO₂ confirmed in this experiment?", as: "এই পৰীক্ষাত CO₂ কেনেকৈ নিশ্চিত কৰা হয়?" }, opts: { en: ["Burns with pop sound", "Lime water turns milky", "Glowing splint relights", "Blue litmus turns red"], as: ["পপ শব্দেৰে জ্বলে", "চূনৰ পানী গাখীৰীয়া হয়", "চিকমিকা চাকি পুনৰ জ্বলে", "নীলা লিটমাছ ৰঙা হয়"] }, ans: 1 },
      { q: { en: "This reaction is an example of:", as: "এই বিক্ৰিয়াটো ইয়াৰ উদাহৰণ:" }, opts: { en: ["Combination reaction", "Displacement reaction", "Thermal decomposition", "Double displacement"], as: ["সংযোগ বিক্ৰিয়া", "প্ৰতিস্থাপন বিক্ৰিয়া", "তাপীয় বিযোজন", "দ্বৈত প্ৰতিস্থাপন"] }, ans: 2 },
    ],
  },
  {
    id: "feso4", num: 2,
    title: { en: "Ferrous Sulphate", as: "ফেৰাছ ছালফেট" },
    subtitle: { en: "Thermal Decomposition", as: "তাপীয় বিযোজন" },
    equation: "2FeSO₄ → Fe₂O₃ + SO₂↑ + SO₃↑",
    category: "Thermal", accent: "#84CC16", glow: "rgba(132,204,22,0.4)",
    gradFrom: "#4D7C0F", gradTo: "#84CC16", emoji: "🟢",
    energy: "Endothermic", peakTemp: "~480 °C", hazard: "HIGH",
    description: { en: "Green ferrous sulphate crystals decompose on heating to form reddish-brown ferric oxide and release sulphur dioxide and sulphur trioxide gases (smell of burning sulphur).", as: "সেউজীয়া ফেৰাছ ছালফেট স্ফটিকবোৰ তাপত বিযোজিত হৈ ৰঙা-মুগা ফেৰিক অক্সাইড গঠন কৰে আৰু ছালফাৰ ডাইঅক্সাইড আৰু ছালফাৰ ট্ৰাইঅক্সাইড গেছ (গন্ধক জ্বলা গোন্ধ) নিৰ্গত কৰে।" },
    realWorld: { en: "Iron extraction · Metallurgy · Sulphur gas detection · Soil treatment", as: "লোহা নিষ্কাষণ · ধাতুবিদ্যা · ছালফাৰ গেছ চিনাক্তকৰণ · মাটি শোধন" },
    examNote: { en: "FeSO₄ is green. Fe₂O₃ is reddish-brown. SO₂ and SO₃ have pungent odour. Key observation: colour change from green to reddish-brown.", as: "FeSO₄ সেউজীয়া। Fe₂O₃ ৰঙা-মুগা। SO₂ আৰু SO₃-ৰ কটু গোন্ধ। মূল পৰ্যবেক্ষণ: সেউজীয়াৰ পৰা ৰঙা-মুগালৈ ৰং সলনি।" },
    safety: { en: ["SO₂ and SO₃ are toxic — work in fume hood", "Wear respiratory mask", "Goggles essential"], as: ["SO₂ আৰু SO₃ বিষাক্ত — ফিউম হুডত কাম কৰক", "শ্বসন মাস্ক পিন্ধক", "চশমা আৱশ্যক"] },
    steps: [
      { label: { en: "Load Test Tube", as: "টেষ্ট টিউব ভৰাওক" }, desc: { en: "Place green ferrous sulphate crystals in a dry test tube. Note the green colour of crystals.", as: "শুকান টেষ্ট টিউবত সেউজীয়া ফেৰাছ ছালফেট স্ফটিক ৰাখক। স্ফটিকৰ সেউজীয়া ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Apply Heat", as: "তাপ প্ৰয়োগ কৰক" }, desc: { en: "Heat gently with Bunsen burner. Crystals start losing water of crystallization first.", as: "বানচেন বাৰ্নাৰেৰে লাহে লাহে তাপ দিয়ক। স্ফটিকবোৰে প্ৰথমে স্ফটিকজলৰ পানী হেৰুৱায়।" } },
      { label: { en: "Observe Colour Change", as: "ৰঙৰ পৰিবৰ্তন লক্ষ্য কৰক" }, desc: { en: "Green colour gradually changes to reddish-brown as Fe₂O₃ forms. Pungent gases evolve.", as: "Fe₂O₃ গঠিত হোৱাৰ লগে লগে সেউজীয়া ৰং ক্ৰমে ৰঙা-মুগালৈ পৰিবৰ্তিত হয়। কটু গেছ নিৰ্গত হয়।" } },
      { label: { en: "Confirm Products", as: "উৎপাদ নিশ্চিত কৰক" }, desc: { en: "Reddish-brown Fe₂O₃ residue visible. Smell of burning sulphur confirms SO₂/SO₃.", as: "ৰঙা-মুগা Fe₂O₃ অৱশিষ্ট দৃশ্যমান। গন্ধক জ্বলা গোন্ধই SO₂/SO₃ নিশ্চিত কৰে।" } },
    ],
    observations: { en: ["Green FeSO₄ crystals heat and crack", "Colour changes green → yellowish → reddish-brown", "Pungent smell (SO₂/SO₃) is detected", "Reddish-brown Fe₂O₃ residue remains"], as: ["সেউজীয়া FeSO₄ স্ফটিক তপত হৈ ফাটে", "ৰং সেউজীয়া → হালধীয়া → ৰঙা-মুগা", "কটু গোন্ধ (SO₂/SO₃) অনুভূত হয়", "ৰঙা-মুগা Fe₂O₃ অৱশিষ্ট থাকে"] },
    pmode: "so2-gas",
    quiz: [
      { q: { en: "What is the colour of ferrous sulphate crystals?", as: "ফেৰাছ ছালফেট স্ফটিকৰ ৰং কি?" }, opts: { en: ["Blue", "White", "Green", "Yellow"], as: ["নীলা", "বগা", "সেউজীয়া", "হালধীয়া"] }, ans: 2 },
      { q: { en: "Which reddish-brown residue is formed?", as: "কোন ৰঙা-মুগা অৱশিষ্ট গঠিত হয়?" }, opts: { en: ["FeO", "Fe₂O₃", "FeSO₄", "Fe₃O₄"], as: ["FeO", "Fe₂O₃", "FeSO₄", "Fe₃O₄"] }, ans: 1 },
      { q: { en: "Which gases are released during FeSO₄ decomposition?", as: "FeSO₄ বিযোজনৰ সময়ত কোন গেছ মুক্ত হয়?" }, opts: { en: ["CO₂ and O₂", "SO₂ and SO₃", "H₂ and O₂", "NO₂ and O₂"], as: ["CO₂ আৰু O₂", "SO₂ আৰু SO₃", "H₂ আৰু O₂", "NO₂ আৰু O₂"] }, ans: 1 },
      { q: { en: "The pungent smell in this reaction is due to:", as: "এই বিক্ৰিয়াৰ কটু গোন্ধৰ কাৰণ:" }, opts: { en: ["CO₂", "H₂S", "SO₂ and SO₃", "NO₂"], as: ["CO₂", "H₂S", "SO₂ আৰু SO₃", "NO₂"] }, ans: 2 },
    ],
  },
  {
    id: "pb-no3", num: 3,
    title: { en: "Lead Nitrate", as: "ছীহ নাইট্ৰেট" },
    subtitle: { en: "Thermal Decomposition", as: "তাপীয় বিযোজন" },
    equation: "2Pb(NO₃)₂ → 2PbO + 4NO₂↑ + O₂↑",
    category: "Thermal", accent: "#A78BFA", glow: "rgba(167,139,250,0.4)",
    gradFrom: "#7C3AED", gradTo: "#A78BFA", emoji: "🟡",
    energy: "Endothermic", peakTemp: "~470 °C", hazard: "HIGH",
    description: { en: "Lead nitrate crystals decompose on heating producing toxic brown nitrogen dioxide gas, oxygen gas, and a yellow lead oxide residue. A glowing splint relights in the oxygen-rich environment.", as: "ছীহ নাইট্ৰেট স্ফটিক তাপত বিযোজিত হৈ বিষাক্ত মুগা নাইট্ৰ’জেন ডাইঅক্সাইড গেছ, অক্সিজেন গেছ আৰু হালধীয়া ছীহ অক্সাইড অৱশিষ্ট উৎপন্ন কৰে। অক্সিজেন-সমৃদ্ধ পৰিৱেশত চিকমিকা চাকি পুনৰ জ্বলি উঠে।" },
    realWorld: { en: "Lead metallurgy · Fireworks · Glass colouring · Pyrotechnics", as: "ছীহ ধাতুবিদ্যা · আতচবাজী · কাঁচৰ ৰঙ · পাইৰ’টেকনিক্স" },
    examNote: { en: "Pb(NO₃)₂ is white. PbO is yellow. NO₂ is brown and toxic. O₂ relights a glowing splint. CBSE boards frequently ask about the brown gas.", as: "Pb(NO₃)₂ বগা। PbO হালধীয়া। NO₂ মুগা আৰু বিষাক্ত। O₂-এ চিকমিকা চাকি পুনৰ জ্বলায়। CBSE বাৰ্ডে প্ৰায়ে মুগা গেছৰ বিষয়ে সোধে।" },
    safety: { en: ["NO₂ is highly toxic — fume hood mandatory", "Lead compounds are poisonous", "Never inhale the brown gas"], as: ["NO₂ অতি বিষাক্ত — ফিউম হুড বাধ্যতামূলক", "ছীহ যৌগ বিষাক্ত", "মুগা গেছ উশাহত নলব"] },
    steps: [
      { label: { en: "Load Test Tube", as: "টেষ্ট টিউব ভৰাওক" }, desc: { en: "Add white lead nitrate crystals to a boiling tube. Note the colourless/white appearance.", as: "ফুটি থকা টিউবত বগা ছীহ নাইট্ৰেট স্ফটিক যোগ কৰক। বৰ্ণহীন/বগা ৰূপ লক্ষ্য কৰক।" } },
      { label: { en: "Heat Strongly", as: "প্ৰবলভাৱে তাপ দিয়ক" }, desc: { en: "Apply strong flame. Observe evolution of dense brown NO₂ gas above the crystals.", as: "প্ৰবল জ্বালা প্ৰয়োগ কৰক। স্ফটিকৰ ওপৰত ঘন মুগা NO₂ গেছৰ নিৰ্গমন লক্ষ্য কৰক।" } },
      { label: { en: "Collect Oxygen", as: "অক্সিজেন সংগ্ৰহ কৰক" }, desc: { en: "Pass gas through collection tube. Test with glowing splint — it relights (O₂ present).", as: "সংগ্ৰহ টিউবৰ মাজেদি গেছ পঠিয়াওক। চিকমিকা চাকিৰে পৰীক্ষা — ই পুনৰ জ্বলি উঠে (O₂ উপস্থিত)।" } },
      { label: { en: "Observe Residue", as: "অৱশিষ্ট লক্ষ্য কৰক" }, desc: { en: "After cooling, yellow PbO residue remains in the test tube.", as: "শীতল হোৱাৰ পিছত টেষ্ট টিউবত হালধীয়া PbO অৱশিষ্ট থাকে।" } },
    ],
    observations: { en: ["White crystals melt and then decompose", "Dense brown NO₂ fumes visible", "Glowing splint relights (O₂ confirmed)", "Yellow PbO residue remains after cooling"], as: ["বগা স্ফটিক গলি বিযোজিত হয়", "ঘন মুগা NO₂ ধোঁৱা দৃশ্যমান", "চিকমিকা চাকি পুনৰ জ্বলে (O₂ নিশ্চিত)", "শীতল হোৱাৰ পিছত হালধীয়া PbO অৱশিষ্ট থাকে"] },
    pmode: "brown-gas",
    quiz: [
      { q: { en: "Which brown gas is released during decomposition of lead nitrate?", as: "ছীহ নাইট্ৰেট বিযোজনৰ সময়ত কোন মুগা গেছ মুক্ত হয়?" }, opts: { en: ["SO₂", "CO₂", "NO₂", "Cl₂"], as: ["SO₂", "CO₂", "NO₂", "Cl₂"] }, ans: 2 },
      { q: { en: "What colour is the PbO residue?", as: "PbO অৱশিষ্টৰ ৰং কি?" }, opts: { en: ["White", "Green", "Red", "Yellow"], as: ["বগা", "সেউজীয়া", "ৰঙা", "হালধীয়া"] }, ans: 3 },
      { q: { en: "How is O₂ confirmed in this experiment?", as: "এই পৰীক্ষাত O₂ কেনেকৈ নিশ্চিত কৰা হয়?" }, opts: { en: ["Lime water test", "Glowing splint relights", "Blue litmus test", "Smell test"], as: ["চূনৰ পানীৰ পৰীক্ষা", "চিকমিকা চাকি পুনৰ জ্বলে", "নীলা লিটমাছ পৰীক্ষা", "গোন্ধ পৰীক্ষা"] }, ans: 1 },
      { q: { en: "Why must this experiment be done in a fume hood?", as: "এই পৰীক্ষা কিয় ফিউম হুডত কৰিব লাগে?" }, opts: { en: ["CO₂ is released", "NO₂ is toxic", "H₂S smells bad", "High temperature"], as: ["CO₂ মুক্ত হয়", "NO₂ বিষাক্ত", "H₂S-ৰ গোন্ধ বেয়া", "উচ্চ উষ্ণতা"] }, ans: 1 },
    ],
  },
  {
    id: "znco3", num: 4,
    title: { en: "Zinc Carbonate", as: "জিংক কাৰ্বনেট" },
    subtitle: { en: "Thermal Decomposition", as: "তাপীয় বিযোজন" },
    equation: "ZnCO₃ → ZnO + CO₂↑",
    category: "Thermal", accent: "#38BDF8", glow: "rgba(56,189,248,0.4)",
    gradFrom: "#0EA5E9", gradTo: "#38BDF8", emoji: "⚪",
    energy: "Endothermic", peakTemp: "~300 °C", hazard: "LOW",
    description: { en: "Zinc carbonate (white powder) decomposes on heating to form zinc oxide and carbon dioxide. The unique property: ZnO is white when cold but turns yellow when hot, reverting on cooling.", as: "জিংক কাৰ্বনেটে (বগা চূৰ্ণ) তাপত বিযোজিত হৈ জিংক অক্সাইড আৰু কাৰ্বন ডাইঅক্সাইড গঠন কৰে। অদ্বিতীয় ধৰ্ম: ZnO ঠাণ্ডা অৱস্থাত বগা কিন্তু গৰম অৱস্থাত হালধীয়া হয়, শীতল হ’লে পুনৰ বগা হয়।" },
    realWorld: { en: "Zinc production · Paints · Pharmaceuticals · Rubber manufacturing", as: "জিংক উৎপাদন · ৰং · ঔষধ · ৰাবৰ উৎপাদন" },
    examNote: { en: "ZnCO₃ is white. ZnO is white (cold) but YELLOW when hot — a thermochromic property. Very common NCERT/CBSE question about the colour change.", as: "ZnCO₃ বগা। ZnO বগা (ঠাণ্ডা) কিন্তু গৰম অৱস্থাত হালধীয়া — থাৰ্মক্ৰমিক ধৰ্ম। ৰং পৰিবৰ্তনৰ বিষয়ে NCERT/CBSE-ৰ অতি সাধাৰণ প্ৰশ্ন।" },
    safety: { en: ["Wear goggles", "Handle hot crucible with tongs", "Ensure ventilation"], as: ["চশমা পিন্ধক", "গৰম ক্ৰুচিবল টংছেৰে নাড়ক", "বায়ু চলাচল নিশ্চিত কৰক"] },
    steps: [
      { label: { en: "Load Crucible", as: "ক্ৰুচিবল ভৰাওক" }, desc: { en: "Place white ZnCO₃ powder in the crucible. Observe the white colour carefully.", as: "ক্ৰুচিবলত বগা ZnCO₃ চূৰ্ণ ৰাখক। বগা ৰং সাৱধানে লক্ষ্য কৰক।" } },
      { label: { en: "Heat Gently", as: "লাহে লাহে তাপ দিয়ক" }, desc: { en: "Apply Bunsen flame. CO₂ starts evolving. ZnO begins to form.", as: "বানচেন জ্বালা প্ৰয়োগ কৰক। CO₂ নিৰ্গত হ’বলৈ আৰম্ভ কৰে। ZnO গঠিত হ’বলৈ লয়।" } },
      { label: { en: "Observe Hot Colour", as: "গৰম অৱস্থাৰ ৰং লক্ষ্য কৰক" }, desc: { en: "ZnO appears YELLOW while hot (thermochromic effect). CO₂ turns lime water milky.", as: "গৰম অৱস্থাত ZnO হালধীয়া দেখা যায় (থাৰ্মক্ৰমিক প্ৰভাৱ)। CO₂-এ চূনৰ পানী গাখীৰীয়া কৰে।" } },
      { label: { en: "Cool and Observe", as: "শীতল কৰি লক্ষ্য কৰক" }, desc: { en: "Remove from heat — ZnO returns to WHITE as it cools. Reversible colour change!", as: "তাপৰ পৰা আঁতৰাওক — শীতল হোৱাৰ লগে লগে ZnO পুনৰ বগা হয়। প্ৰত্যাবৰ্তনীয় ৰং পৰিবৰ্তন!" } },
    ],
    observations: { en: ["White ZnCO₃ starts decomposing at ~300 °C", "CO₂ gas evolves (lime water test positive)", "ZnO appears yellow when hot", "ZnO returns to white on cooling"], as: ["বগা ZnCO₃ ~৩০০ °C-ত বিযোজিত হ’বলৈ আৰম্ভ কৰে", "CO₂ গেছ নিৰ্গত হয় (চূনৰ পানীৰ পৰীক্ষা ধনাত্মক)", "গৰম অৱস্থাত ZnO হালধীয়া দেখা যায়", "শীতল হোৱাৰ পিছত ZnO পুনৰ বগা হয়"] },
    pmode: "co2-gas",
    quiz: [
      { q: { en: "What colour does ZnO become when heated?", as: "তপত কৰিলে ZnO-ৰ ৰং কেনে হয়?" }, opts: { en: ["Red", "Yellow", "Blue", "Brown"], as: ["ৰঙা", "হালধীয়া", "নীলা", "মুগা"] }, ans: 1 },
      { q: { en: "Which gas is released during ZnCO₃ decomposition?", as: "ZnCO₃ বিযোজনৰ সময়ত কোন গেছ মুক্ত হয়?" }, opts: { en: ["O₂", "SO₂", "CO₂", "H₂"], as: ["O₂", "SO₂", "CO₂", "H₂"] }, ans: 2 },
      { q: { en: "What happens to the colour of ZnO on cooling?", as: "শীতল কৰিলে ZnO-ৰ ৰঙৰ কি হয়?" }, opts: { en: ["Stays yellow", "Turns green", "Returns to white", "Turns blue"], as: ["হালধীয়াই থাকে", "সেউজীয়া হয়", "পুনৰ বগা হয়", "নীলা হয়"] }, ans: 2 },
      { q: { en: "The colour change of ZnO is called:", as: "ZnO-ৰ ৰং পৰিবৰ্তনক কোৱা হয়:" }, opts: { en: ["Photochromic", "Thermochromic", "Electrochromic", "Halochromic"], as: ["প্ৰকাশক্ৰমিক", "থাৰ্মক্ৰমিক", "ইলেক্ট্ৰক্ৰমিক", "হেলোক্ৰমিক"] }, ans: 1 },
    ],
  },
  {
    id: "agcl", num: 5,
    title: { en: "Silver Chloride", as: "ছিলভাৰ ক্ল’ৰাইড" },
    subtitle: { en: "Photolytic Decomposition", as: "আলোক বিযোজন" },
    equation: "2AgCl → 2Ag + Cl₂↑",
    category: "Photolytic", accent: "#FDE047", glow: "rgba(253,224,71,0.4)",
    gradFrom: "#CA8A04", gradTo: "#FDE047", emoji: "☀️",
    energy: "Light energy", peakTemp: "Room temp", hazard: "LOW",
    description: { en: "White silver chloride decomposes in the presence of sunlight (UV radiation), turning grey/dark as silver metal particles form. This principle is used in black-and-white photography.", as: "বগা ছিলভাৰ ক্ল’ৰাইডে সূৰ্যৰ পোহৰৰ (UV বিকিৰণ) উপস্থিতিত বিযোজিত হৈ ৰূপৰ ধাতৱ কণা গঠনৰ লগে লগে ধূসৰ/গাঢ় ৰংলৈ পৰিবৰ্তিত হয়। এই নীতি কেলা-বগা ফটোগ্ৰাফীত ব্যৱহৃত হয়।" },
    realWorld: { en: "Black & white photography · Silver plating · UV sensors · Photochromic glass", as: "কেলা-বগা ফটোগ্ৰাফী · ছিলভাৰ প্লেটিং · UV চেন্সৰ · প্ৰকাশক্ৰমিক কাঁচ" },
    examNote: { en: "AgCl is white. After light exposure it turns grey (Ag forms). This is PHOTOLYTIC decomposition — energy source is light, not heat.", as: "AgCl বগা। পোহৰৰ সংস্পৰ্শৰ পিছত ই ধূসৰ হয় (Ag গঠিত হয়)। এইটো আলোক বিযোজন — শক্তিৰ উৎস তাপ নহয়, পোহৰ।" },
    safety: { en: ["Avoid direct UV exposure to eyes", "Wear UV-protective goggles", "Store AgCl in dark bottles"], as: ["প্ৰত্যক্ষ UV চকুত প্ৰৱেশ এৰক", "UV-সুৰক্ষিত চশমা পিন্ধক", "AgCl-ক আন্ধাৰ বটলত সংৰক্ষণ কৰক"] },
    steps: [
      { label: { en: "Prepare Sample", as: "নমুনা প্ৰস্তুত কৰক" }, desc: { en: "Place white AgCl on a watch glass. Note the bright white colour before light exposure.", as: "ৱাচ গ্লাছত বগা AgCl ৰাখক। পোহৰৰ সংস্পৰ্শৰ আগৰ উজ্জ্বল বগা ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Expose to UV/Sunlight", as: "UV/সূৰ্যৰ পোহৰত ৰাখক" }, desc: { en: "Turn on the UV lamp or expose to sunlight. Photons start breaking Ag-Cl bonds.", as: "UV বাতি জ্বলাওক বা সূৰ্যৰ পোহৰত ৰাখক। ফ’টনে Ag-Cl বন্ধ ভাঙিবলৈ আৰম্ভ কৰে।" } },
      { label: { en: "Observe Darkening", as: "গাঢ় হোৱা লক্ষ্য কৰক" }, desc: { en: "Surface gradually turns grey as silver atoms cluster. Cl₂ gas evolves.", as: "ৰূপৰ পৰমাণু গোট খালেই পৃষ্ঠ ক্ৰমে ধূসৰ হয়। Cl₂ গেছ নিৰ্গত হয়।" } },
      { label: { en: "Record Observation", as: "পৰ্যবেক্ষণ লিখক" }, desc: { en: "Compare before/after — from white to grey/dark. Confirm Ag metal formation.", as: "আগৰ/পিছৰ তুলনা কৰক — বগাৰ পৰা ধূসৰ/গাঢ়। Ag ধাতু গঠন নিশ্চিত কৰক।" } },
    ],
    observations: { en: ["White AgCl turns grey on light exposure", "Reaction rate increases with light intensity", "Grey colour due to silver metal (Ag) particles", "Faint Cl₂ smell may be detected"], as: ["পোহৰৰ সংস্পৰ্শত বগা AgCl ধূসৰ হয়", "পোহৰৰ তীব্ৰতাৰ লগে লগে বিক্ৰিয়াৰ হাৰ বৃদ্ধি পায়", "ৰূপৰ ধাতৱ (Ag) কণাৰ বাবে ধূসৰ ৰং", "মৃদু Cl₂-ৰ গোন্ধ অনুভৱ হ’ব পাৰে"] },
    pmode: "uv-glow",
    quiz: [
      { q: { en: "What energy source is required for AgCl decomposition?", as: "AgCl বিযোজনৰ বাবে কি শক্তিৰ উৎস প্ৰয়োজন?" }, opts: { en: ["Heat", "Electricity", "Light", "Pressure"], as: ["তাপ", "বিদ্যুৎ", "পোহৰ", "চাপ"] }, ans: 2 },
      { q: { en: "Which metal is formed when AgCl decomposes?", as: "AgCl বিযোজিত হ’লে কোন ধাতু গঠিত হয়?" }, opts: { en: ["Gold", "Silver", "Copper", "Zinc"], as: ["সোণ", "ৰূপ", "তাম", "জিংক"] }, ans: 1 },
      { q: { en: "Why does AgCl turn grey in sunlight?", as: "AgCl সূৰ্যৰ পোহৰত কিয় ধূসৰ হয়?" }, opts: { en: ["Fe₂O₃ forms", "Silver metal particles form", "Chlorine is absorbed", "Oxidation occurs"], as: ["Fe₂O₃ গঠিত হয়", "ৰূপৰ ধাতৱ কণা গঠিত হয়", "ক্ল’ৰিন শোষিত হয়", "জাৰণ হয়"] }, ans: 1 },
      { q: { en: "This principle is used in:", as: "এই নীতি ব্যৱহাৰ কৰা হয়:" }, opts: { en: ["Electrolysis", "Photography", "Electroplating", "Smelting"], as: ["বৈদ্যুতিক বিশ্লেষণ", "ফটোগ্ৰাফী", "ইলেক্ট্ৰ’প্লেটিং", "ধাতু গলোৱা"] }, ans: 1 },
    ],
  },
  {
    id: "agbr", num: 6,
    title: { en: "Silver Bromide", as: "ছিলভাৰ ব্ৰ’মাইড" },
    subtitle: { en: "Photolytic Decomposition", as: "আলোক বিযোজন" },
    equation: "2AgBr → 2Ag + Br₂↑",
    category: "Photolytic", accent: "#F59E0B", glow: "rgba(245,158,11,0.4)",
    gradFrom: "#B45309", gradTo: "#F59E0B", emoji: "🌅",
    energy: "Light energy", peakTemp: "Room temp", hazard: "LOW",
    description: { en: "Cream-coloured silver bromide decomposes in light to form silver metal and bromine vapour. More light-sensitive than AgCl, widely used in photographic film.", as: "ক্ৰিম-ৰঙা ছিলভাৰ ব্ৰ’মাইডে পোহৰত বিযোজিত হৈ ৰূপৰ ধাতু আৰু ব্ৰ’মিন বাষ্প গঠন কৰে। AgCl-তকৈ অধিক পোহৰ-সংবেদনশীল, ফ’টোগ্ৰাফিক ফিল্মত ব্যাপকভাৱে ব্যৱহৃত।" },
    realWorld: { en: "Photographic film · X-ray films · Photochromic lenses · Solar cells", as: "ফ’টোগ্ৰাফিক ফিল্ম · এক্স-ৰে ফিল্ম · প্ৰকাশক্ৰমিক চশমাৰ লেন্স · চৌৰ কোষ" },
    examNote: { en: "AgBr is cream/pale yellow. It is MORE photosensitive than AgCl. Br₂ vapour is reddish-brown. Silver formed causes darkening. Used in photographic film.", as: "AgBr ক্ৰিম/পাতল হালধীয়া। ই AgCl-তকৈ অধিক পোহৰ-সংবেদনশীল। Br₂ বাষ্প ৰঙা-মুগা। উৎপন্ন ৰূপৰ ফলত গাঢ় হয়। ফ’টোগ্ৰাফিক ফিল্মত ব্যৱহৃত।" },
    safety: { en: ["Br₂ vapour is toxic — work in ventilated space", "UV goggles required", "Store in dark containers"], as: ["Br₂ বাষ্প বিষাক্ত — বায়ু চলাচলযুক্ত স্থানত কাম কৰক", "UV চশমা আৱশ্যক", "আন্ধাৰ পাত্ৰত সংৰক্ষণ কৰক"] },
    steps: [
      { label: { en: "Prepare AgBr", as: "AgBr প্ৰস্তুত কৰক" }, desc: { en: "Place cream-coloured AgBr on watch glass. Note the pale cream/yellow colour.", as: "ৱাচ গ্লাছত ক্ৰিম-ৰঙা AgBr ৰাখক। পাতল ক্ৰিম/হালধীয়া ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Control Light Intensity", as: "পোহৰৰ তীব্ৰতা নিয়ন্ত্ৰণ কৰক" }, desc: { en: "Adjust UV lamp intensity. Higher intensity = faster decomposition rate.", as: "UV বাতিৰ তীব্ৰতা নিয়ন্ত্ৰণ কৰক। অধিক তীব্ৰতা = দ্ৰুত বিযোজনৰ হাৰ।" } },
      { label: { en: "Observe Decomposition", as: "বিযোজন লক্ষ্য কৰক" }, desc: { en: "AgBr darkens rapidly as Ag particles form. Reddish-brown Br₂ vapour is visible.", as: "Ag কণা গঠিত হোৱাৰ লগে লগে AgBr দ্ৰুত গাঢ় হয়। ৰঙা-মুগা Br₂ বাষ্প দৃশ্যমান।" } },
      { label: { en: "Compare with AgCl", as: "AgCl-ৰ সৈতে তুলনা কৰক" }, desc: { en: "AgBr decomposes faster than AgCl — it is more photosensitive. Silver appears black.", as: "AgBr AgCl-তকৈ দ্ৰুত বিযোজিত হয় — ই অধিক পোহৰ-সংবেদনশীল। ৰূপ ক’লা দেখা যায়।" } },
    ],
    observations: { en: ["Cream AgBr darkens rapidly in light", "Rate increases with light intensity", "Reddish-brown Br₂ vapour visible", "Black silver (Ag) particles form on surface"], as: ["ক্ৰিম AgBr পোহৰত দ্ৰুত গাঢ় হয়", "পোহৰৰ তীব্ৰতাৰ লগে হাৰ বৃদ্ধি পায়", "ৰঙা-মুগা Br₂ বাষ্প দৃশ্যমান", "পৃষ্ঠত ক’লা ৰূপৰ (Ag) কণা গঠিত হয়"] },
    pmode: "uv-glow",
    quiz: [
      { q: { en: "What colour is silver bromide (AgBr)?", as: "ছিলভাৰ ব্ৰ’মাইডৰ (AgBr) ৰং কি?" }, opts: { en: ["White", "Cream/pale yellow", "Blue", "Green"], as: ["বগা", "ক্ৰিম/পাতল হালধীয়া", "নীলা", "সেউজীয়া"] }, ans: 1 },
      { q: { en: "Which gas is released when AgBr decomposes?", as: "AgBr বিযোজিত হ’লে কোন গেছ মুক্ত হয়?" }, opts: { en: ["Cl₂", "O₂", "Br₂", "I₂"], as: ["Cl₂", "O₂", "Br₂", "I₂"] }, ans: 2 },
      { q: { en: "Compared to AgCl, AgBr is:", as: "AgCl-ৰ তুলনাত AgBr:" }, opts: { en: ["Less photosensitive", "More photosensitive", "Equally sensitive", "Not photosensitive"], as: ["কম পোহৰ-সংবেদনশীল", "অধিক পোহৰ-সংবেদনশীল", "সমানভাৱে সংবেদনশীল", "পোহৰ-সংবেদনশীল নহয়"] }, ans: 1 },
      { q: { en: "AgBr is widely used in:", as: "AgBr ব্যাপকভাৱে ব্যৱহৃত হয়:" }, opts: { en: ["Batteries", "Photographic film", "Electroplating", "Water treatment"], as: ["বেটাৰী", "ফ’টোগ্ৰাফিক ফিল্ম", "ইলেক্ট্ৰ’প্লেটিং", "পানী শোধন"] }, ans: 1 },
    ],
  },
  {
    id: "h2o-electrolysis", num: 7,
    title: { en: "Water (Electrolysis)", as: "পানী (বৈদ্যুতিক বিশ্লেষণ)" },
    subtitle: { en: "Electrolytic Decomposition", as: "বৈদ্যুতিক বিযোজন" },
    equation: "2H₂O → 2H₂↑ + O₂↑",
    category: "Electrolytic", accent: "#60A5FA", glow: "rgba(96,165,250,0.4)",
    gradFrom: "#1D4ED8", gradTo: "#60A5FA", emoji: "⚡",
    energy: "Electrical energy", peakTemp: "Room temp", hazard: "LOW",
    description: { en: "Pure water is a poor conductor. On adding dilute H₂SO₄ (electrolyte), it becomes conducting. On passing electric current, water decomposes at electrodes — H₂ at cathode (−), O₂ at anode (+) in 2:1 ratio.", as: "বিশুদ্ধ পানী খাৰাপ পৰিবাহক। তনু H₂SO₄ (ইলেক্ট্ৰ’লাইট) যোগ কৰিলে ই পৰিবাহী হয়। বৈদ্যুতিক প্ৰৱাহ চলালে ইলেক্ট্ৰ’ডত পানী বিযোজিত হয় — কেথ’ডত (−) H₂, এন’ডত (+) O₂, ২:১ অনুপাতত।" },
    realWorld: { en: "Hydrogen fuel production · Oxygen production · Fuel cells · Industrial hydrogen", as: "হাইড্ৰ’জেন ইন্ধন উৎপাদন · অক্সিজেন উৎপাদন · ইন্ধন কোষ · ঔদ্যোগিক হাইড্ৰ’জেন" },
    examNote: { en: "H₂ collects at cathode (twice the volume of O₂). O₂ collects at anode. Ratio H₂:O₂ = 2:1. Electrolyte (H₂SO₄ or NaOH) is added to increase conductivity.", as: "H₂ কেথ’ডত (O₂-ৰ আয়তনৰ দুগুণ) সংগ্ৰহ হয়। O₂ এন’ডত সংগ্ৰহ হয়। অনুপাত H₂:O₂ = ২:১। পৰিবাহিতা বৃদ্ধি কৰিবলৈ ইলেক্ট্ৰ’লাইট (H₂SO₄ বা NaOH) যোগ কৰা হয়।" },
    safety: { en: ["H₂ is flammable — keep away from flame", "H₂SO₄ is corrosive", "Electrical safety precautions"], as: ["H₂ দাহ্য — জ্বালাৰ পৰা দূৰত ৰাখক", "H₂SO₄ ক্ষয়কাৰক", "বৈদ্যুতিক সুৰক্ষাৰ সাৱধানতা"] },
    steps: [
      { label: { en: "Set Up Apparatus", as: "যন্ত্ৰ স্থাপন কৰক" }, desc: { en: "Fill Hoffmann voltameter with dilute H₂SO₄ solution. Connect battery/DC supply.", as: "হফমেন ভল্টামিটাৰত তনু H₂SO₄ সমাধান ভৰাওক। বেটাৰী/DC সংযোগ কৰক।" } },
      { label: { en: "Switch On Current", as: "প্ৰৱাহ চলাওক" }, desc: { en: "Switch on DC supply. Observe immediate bubble formation at both electrodes.", as: "DC চলাওক। দুয়োটা ইলেক্ট্ৰ’ডত তৎক্ষণাৎ বুদবুদ গঠন লক্ষ্য কৰক।" } },
      { label: { en: "Collect Gases", as: "গেছ সংগ্ৰহ কৰক" }, desc: { en: "H₂ collects at cathode (−) — double the volume of O₂ at anode (+). Ratio is 2:1.", as: "H₂ কেথ’ডত (−) সংগ্ৰহ হয় — এন’ডত (+) O₂-ৰ আয়তনৰ দুগুণ। অনুপাত ২:১।" } },
      { label: { en: "Test the Gases", as: "গেছ পৰীক্ষা কৰক" }, desc: { en: "Test cathode gas: pop sound with flame (H₂). Test anode gas: glowing splint (O₂).", as: "কেথ’ড গেছ পৰীক্ষা: জ্বালাৰ সৈতে পপ শব্দ (H₂)। এন’ড গেছ পৰীক্ষা: চিকমিকা চাকি (O₂)।" } },
    ],
    observations: { en: ["Bubbles appear immediately at both electrodes", "Cathode produces twice the gas volume of anode", "H₂ burns with a pop (cathode)", "O₂ relights glowing splint (anode)"], as: ["দুয়োটা ইলেক্ট্ৰ’ডত তৎক্ষণাৎ বুদবুদ ওলায়", "কেথ’ডে এন’ডতকৈ দুগুণ গেছ আয়তন উৎপন্ন কৰে", "H₂ পপ শব্দেৰে জ্বলে (কেথ’ড)", "O₂-এ চিকমিকা চাকি পুনৰ জ্বলায় (এন’ড)"] },
    pmode: "electrolysis",
    quiz: [
      { q: { en: "At which electrode does hydrogen collect?", as: "কোন ইলেক্ট্ৰ’ডত হাইড্ৰ’জেন সংগ্ৰহ হয়?" }, opts: { en: ["Anode (+)", "Cathode (−)", "Both equally", "Neither"], as: ["এন’ড (+)", "কেথ’ড (−)", "দুয়োটাতে সমানে", "কোনো এটাতে নহয়"] }, ans: 1 },
      { q: { en: "What is the volume ratio of H₂:O₂ in electrolysis of water?", as: "পানীৰ বৈদ্যুতিক বিশ্লেষণত H₂:O₂-ৰ আয়তন অনুপাত কি?" }, opts: { en: ["1:2", "2:1", "1:1", "3:1"], as: ["1:2", "2:1", "1:1", "3:1"] }, ans: 1 },
      { q: { en: "Why is electrolyte (H₂SO₄) added to water?", as: "পানীত ইলেক্ট্ৰ’লাইট (H₂SO₄) কিয় যোগ কৰা হয়?" }, opts: { en: ["To slow the reaction", "To increase conductivity", "To change colour", "To reduce temperature"], as: ["বিক্ৰিয়া লেহেমীয়া কৰিবলৈ", "পৰিবাহিতা বৃদ্ধি কৰিবলৈ", "ৰং সলনি কৰিবলৈ", "উষ্ণতা হ্ৰাস কৰিবলৈ"] }, ans: 1 },
      { q: { en: "How is hydrogen confirmed at cathode?", as: "কেথ’ডত হাইড্ৰ’জেন কেনেকৈ নিশ্চিত কৰা হয়?" }, opts: { en: ["Lime water test", "Glowing splint", "Burns with a pop sound", "Blue litmus test"], as: ["চূনৰ পানীৰ পৰীক্ষা", "চিকমিকা চাকি", "পপ শব্দেৰে জ্বলে", "নীলা লিটমাছ পৰীক্ষা"] }, ans: 2 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// PARTICLE ENGINE
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
      const base = H * 0.68;

      const add = (p: Omit<Particle, "life"> & { life?: number }) =>
        particles.current.push({ life: p.maxLife, ...p });

      switch (mode) {
        case "thermal":
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 40 + Math.random() * 30;
            add({ x: cx + (Math.random() - .5) * 20, y: base, vx: (Math.random() - .5) * 2.5, vy: -(2.5 + Math.random() * 4), maxLife: life, size: 2 + Math.random() * 4, color: ["#FF4500","#FF6B35","#FB923C","#FDE047","#FF0000"][Math.floor(Math.random()*5)], blur: 14, type: "fire" });
          }
          if (Math.random() < 0.35) {
            const life = 90 + Math.random() * 50;
            add({ x: cx + (Math.random() - .5) * 16, y: base - 35, vx: (Math.random() - .5) * 1.2, vy: -(1 + Math.random() * 1.5), maxLife: life, size: 7 + Math.random() * 9, color: `rgba(160,160,160,${0.25 + Math.random() * 0.25})`, blur: 4, type: "smoke" });
          }
          break;

        case "brown-gas":
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 70 + Math.random() * 50;
            add({ x: cx + (Math.random() - .5) * 25, y: base - 20, vx: (Math.random() - .5) * 1.8, vy: -(1.2 + Math.random() * 2), maxLife: life, size: 6 + Math.random() * 10, color: `rgba(${180 + Math.floor(Math.random()*30)},${80 + Math.floor(Math.random()*30)},0,${0.35 + Math.random() * 0.3})`, blur: 6, type: "smoke" });
          }
          // Fire below
          for (let i = 0; i < Math.ceil(2 * intensity); i++) {
            const life = 30 + Math.random() * 20;
            add({ x: cx + (Math.random() - .5) * 12, y: base + 10, vx: (Math.random() - .5) * 2, vy: -(2 + Math.random() * 3), maxLife: life, size: 2 + Math.random() * 3, color: "#FB923C", blur: 12, type: "fire" });
          }
          break;

        case "so2-gas":
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 65 + Math.random() * 45;
            add({ x: cx + (Math.random() - .5) * 20, y: base - 15, vx: (Math.random() - .5) * 1.5, vy: -(1.2 + Math.random() * 2), maxLife: life, size: 5 + Math.random() * 8, color: `rgba(${200 + Math.floor(Math.random()*30)},${200 + Math.floor(Math.random()*30)},0,${0.3 + Math.random() * 0.25})`, blur: 5, type: "smoke" });
          }
          for (let i = 0; i < Math.ceil(2 * intensity); i++) {
            const life = 35 + Math.random() * 25;
            add({ x: cx + (Math.random() - .5) * 14, y: base + 5, vx: (Math.random() - .5) * 2, vy: -(2 + Math.random() * 3), maxLife: life, size: 2 + Math.random() * 3, color: "#FBBF24", blur: 12, type: "fire" });
          }
          break;

        case "co2-gas":
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 55 + Math.random() * 40;
            add({ x: cx + (Math.random() - .5) * 18, y: base - 10, vx: (Math.random() - .5) * 1.2, vy: -(1.5 + Math.random() * 2.5), maxLife: life, size: 4 + Math.random() * 6, color: `rgba(200,220,255,${0.3 + Math.random() * 0.25})`, blur: 5, type: "steam" });
          }
          for (let i = 0; i < Math.ceil(2 * intensity); i++) {
            const life = 35 + Math.random() * 20;
            add({ x: cx + (Math.random() - .5) * 14, y: base + 5, vx: (Math.random() - .5) * 2, vy: -(2 + Math.random() * 3), maxLife: life, size: 2 + Math.random() * 3, color: "#38BDF8", blur: 12, type: "fire" });
          }
          break;

        case "uv-glow":
          for (let i = 0; i < Math.ceil(4 * intensity); i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 30 + Math.random() * 50;
            const life = 30 + Math.random() * 25;
            add({ x: cx + Math.cos(angle) * r, y: base - 30 + Math.sin(angle) * 20, vx: (Math.random() - .5) * 0.5, vy: (Math.random() - .5) * 0.5, maxLife: life, size: 1.5 + Math.random() * 2.5, color: ["#FDE047","#FACC15","#FCD34D","#FEF08A","#FFFBEB"][Math.floor(Math.random()*5)], blur: 12, type: "glow" });
          }
          break;

        case "electrolysis":
          // Cathode bubbles (left)
          if (Math.random() < 0.6 * intensity) {
            add({ x: cx - 38 + (Math.random() - .5) * 8, y: base, vx: (Math.random() - .5) * 0.8, vy: -(1.5 + Math.random() * 2.5), maxLife: 60 + Math.random() * 40, size: 2.5 + Math.random() * 3, color: "#60A5FA", blur: 8, type: "bubble" });
          }
          // Anode bubbles (right) — half volume
          if (Math.random() < 0.3 * intensity) {
            add({ x: cx + 38 + (Math.random() - .5) * 8, y: base, vx: (Math.random() - .5) * 0.8, vy: -(1.5 + Math.random() * 2.5), maxLife: 60 + Math.random() * 40, size: 2.5 + Math.random() * 3, color: "#34D399", blur: 8, type: "bubble" });
          }
          // Electric sparks
          if (Math.random() < 0.15 * intensity) {
            const life = 10 + Math.random() * 10;
            add({ x: cx + (Math.random() - .5) * 80, y: H * 0.5 + (Math.random() - .5) * 30, vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, maxLife: life, size: 1.5 + Math.random() * 2, color: "#FDE047", blur: 16, type: "spark" });
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
        if (p.type === "smoke" || p.type === "steam") alpha = t < 0.2 ? t / 0.2 * 0.55 : t > 0.6 ? (t - 0.6) / 0.4 * 0.45 : 0.55;
        if (p.type === "glow") alpha = Math.sin(t * Math.PI);
        if (p.type === "bubble") alpha = t < 0.1 ? t * 10 * 0.7 : t * 0.7;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowBlur = p.blur;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const r = p.type === "smoke" || p.type === "steam" ? p.size * (1.4 - t * 0.4) : p.size;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (p.type === "bubble") { ctx.globalAlpha = alpha * 0.4; ctx.strokeStyle = p.color; ctx.lineWidth = 0.8; ctx.stroke(); }
        ctx.restore();

        p.x += p.vx; p.y += p.vy;
        if (p.type === "fire" || p.type === "spark") { p.vx *= 0.97; p.vy -= 0.07; }
        if (p.type === "smoke" || p.type === "steam") { p.vx *= 0.995; }
        if (p.type === "bubble") { p.vx += (Math.random() - .5) * 0.15; p.vy *= 0.99; }
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
    <div className={`rounded-2xl border ${className}`} style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.08)", ...style }}>
      {children}
    </div>
  );
}

function NeonBadge({ label, color }: { label: string; color: string }) {
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ color, borderColor: `${color}60`, background: `${color}18` }}>{label}</span>;
}

function CategoryIcon({ cat }: { cat: Exp["category"] }) {
  if (cat === "Thermal") return <Flame className="w-3.5 h-3.5" />;
  if (cat === "Photolytic") return <Sun className="w-3.5 h-3.5" />;
  return <Zap className="w-3.5 h-3.5" />;
}

function DataRow({ label, value, color = "#94a3b8" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-black" style={{ color }}>{value}</span>
    </div>
  );
}

function AnimatedBar({ label, target, max, accent, icon }: { label: string; target: number; max: number; accent: string; icon: React.ReactNode }) {
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
        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${(val / max) * 100}%` }} transition={{ duration: 2, ease: "easeOut" }} style={{ background: `linear-gradient(to right, ${accent}88, ${accent})` }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APPARATUS SVG COMPONENTS
// ═══════════════════════════════════════════════════════════

function ThermalApparatus({ exp, phase }: { exp: Exp; phase: Phase }) {
  const hot = phase === "reacting" || phase === "complete";
  const isLeadNitrate = exp.id === "pb-no3";
  const isFeSO4 = exp.id === "feso4";
  const isZnCO3 = exp.id === "znco3";

  const crystalColor = isFeSO4 ? "#4ADE80" : isLeadNitrate ? "#F8FAFC" : "#F8FAFC";
  const hotResidueColor = isFeSO4 ? "#B45309" : isLeadNitrate ? "#FDE047" : isZnCO3 ? "#FDE047" : "#F8FAFC";
  const gasColor = isLeadNitrate ? "rgba(160,80,0,0.5)" : isFeSO4 ? "rgba(220,220,0,0.5)" : "rgba(200,220,255,0.4)";

  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      <rect x="20" y="200" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Stand */}
      <line x1="150" y1="200" x2="115" y2="200" stroke="#475569" strokeWidth="2.5" />
      <line x1="115" y1="200" x2="100" y2="185" stroke="#475569" strokeWidth="2.5" />
      <line x1="150" y1="200" x2="185" y2="200" stroke="#475569" strokeWidth="2.5" />
      <line x1="185" y1="200" x2="200" y2="185" stroke="#475569" strokeWidth="2.5" />
      {/* Ring clamp */}
      <ellipse cx="150" cy="148" rx="28" ry="7" fill="none" stroke="#64748b" strokeWidth="3" />
      <line x1="150" y1="141" x2="150" y2="185" stroke="#64748b" strokeWidth="2.5" />
      {/* Crucible / test tube */}
      <path d="M127,148 Q127,175 150,177 Q173,175 173,148" fill={hot ? `${hotResidueColor}44` : `${crystalColor}33`} stroke="#94a3b8" strokeWidth="1.5" />
      {/* Crystals / residue */}
      {!hot ? (
        <ellipse cx="150" cy="168" rx="14" ry="5" fill={crystalColor} opacity="0.9" />
      ) : (
        <ellipse cx="150" cy="168" rx="14" ry="5" fill={hotResidueColor} opacity="0.85">
          {isZnCO3 && <animate attributeName="fill" values="#FDE047;#FBBF24;#FDE047" dur="2s" repeatCount="indefinite" />}
        </ellipse>
      )}
      {/* Gas evolution */}
      {hot && (
        <>
          <ellipse cx="150" cy="138" rx="12" ry="6" fill={gasColor}>
            <animate attributeName="ry" values="6;10;6" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="150" cy="122" rx="9" ry="7" fill={gasColor} opacity="0.5">
            <animate attributeName="ry" values="7;12;7" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </ellipse>
        </>
      )}
      {/* Burner */}
      <rect x="138" y="185" width="24" height="14" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      <rect x="143" y="181" width="14" height="6" rx="2" fill="#334155" />
      <path d="M138,195 Q110,195 110,215" fill="none" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      {/* Glow when hot */}
      {hot && <ellipse cx="150" cy="155" rx="35" ry="25" fill={exp.accent} opacity="0.07"><animate attributeName="opacity" values="0.07;0.14;0.07" dur="1s" repeatCount="indefinite" /></ellipse>}
      {/* Lime water tube (for caco3 and znco3) */}
      {(exp.id === "caco3" || exp.id === "znco3") && (
        <>
          <path d="M173,155 Q210,140 225,130" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3" />
          <rect x="218" y="115" width="16" height="40" rx="3" fill="rgba(255,255,255,0.05)" stroke="#475569" strokeWidth="1.5" />
          <rect x="220" y={phase === "complete" ? "138" : "148"} width="12" height={phase === "complete" ? "16" : "6"} rx="1" fill={phase === "complete" ? "rgba(240,240,255,0.7)" : "rgba(255,255,255,0.2)"}>
            {phase === "complete" && <animate attributeName="fill" values="rgba(240,240,255,0.7);rgba(200,200,240,0.9);rgba(240,240,255,0.7)" dur="1.5s" repeatCount="indefinite" />}
          </rect>
          <text x="226" y="112" textAnchor="middle" fill="#64748b" fontSize="6">Ca(OH)₂</text>
        </>
      )}
      <text x="150" y="215" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">{exp.title.en.toUpperCase()} DECOMPOSITION</text>
    </svg>
  );
}

function PhotolyticApparatus({ exp, phase }: { exp: Exp; phase: Phase }) {
  const active = phase === "reacting" || phase === "complete";
  const isAgBr = exp.id === "agbr";
  const sampleColor = isAgBr ? "#FDE68A" : "#F8FAFC";
  const darkColor = isAgBr ? "#292524" : "#6B7280";

  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      <rect x="20" y="200" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* UV Lamp */}
      <rect x="110" y="30" width="80" height="22" rx="6" fill="#1e293b" stroke={active ? "#A78BFA" : "#475569"} strokeWidth={active ? 2 : 1.5}>
        {active && <animate attributeName="stroke" values="#A78BFA;#7C3AED;#A78BFA" dur="1.5s" repeatCount="indefinite" />}
      </rect>
      <text x="150" y="45" textAnchor="middle" fill={active ? "#C4B5FD" : "#64748b"} fontSize="7" fontWeight="bold">UV LAMP</text>
      {/* UV rays */}
      {active && [140, 150, 160, 170, 145, 155, 165].map((x, i) => (
        <line key={i} x1={x} y1="52" x2={x + (Math.random() > .5 ? 3 : -3)} y2="120" stroke="#FDE047" strokeWidth="0.8" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${0.8 + i * 0.1}s`} begin={`${i * 0.1}s`} repeatCount="indefinite" />
        </line>
      ))}
      {/* Watch glass */}
      <ellipse cx="150" cy="155" rx="40" ry="10" fill="rgba(255,255,255,0.04)" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="150" cy="153" rx="38" ry="8" fill="rgba(255,255,255,0.03)" />
      {/* Sample on watch glass */}
      <ellipse cx="150" cy="150" rx="28" ry="6" fill={active && phase === "complete" ? darkColor : sampleColor} opacity="0.85">
        {active && <animate attributeName="fill" values={`${sampleColor};${darkColor}`} dur="4s" fill="freeze" />}
      </ellipse>
      {/* Label */}
      <text x="150" y="147" textAnchor="middle" fill="rgba(0,0,0,0.4)" fontSize="7" fontWeight="bold">{isAgBr ? "AgBr" : "AgCl"}</text>
      {/* Support */}
      <rect x="120" y="163" width="60" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* UV glow around sample */}
      {active && <ellipse cx="150" cy="150" rx="45" ry="20" fill={exp.accent} opacity="0.06"><animate attributeName="opacity" values="0.06;0.15;0.06" dur="1s" repeatCount="indefinite" /></ellipse>}
      {/* Sun indicator */}
      <circle cx="245" cy="45" r="18" fill="rgba(253,224,71,0.15)" stroke="#FDE047" strokeWidth="1.5">
        {active && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
      </circle>
      <text x="245" y="50" textAnchor="middle" fill="#FDE047" fontSize="13">☀️</text>
      <text x="150" y="215" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">PHOTOLYTIC DECOMPOSITION — {exp.title.en.toUpperCase()}</text>
    </svg>
  );
}

function ElectrolysisApparatus({ phase }: { phase: Phase }) {
  const active = phase === "reacting" || phase === "complete";
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      <rect x="20" y="205" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Electrolysis vessel */}
      <rect x="80" y="90" width="140" height="105" rx="8" fill="rgba(96,165,250,0.06)" stroke="#475569" strokeWidth="2" />
      {/* Water level */}
      <rect x="82" y="130" width="136" height="63" rx="0" fill="rgba(96,165,250,0.12)" />
      {/* Cathode (-) left electrode */}
      <rect x="110" y="95" width="6" height="80" rx="2" fill={active ? "#60A5FA" : "#475569"}>
        {active && <animate attributeName="fill" values="#60A5FA;#93C5FD;#60A5FA" dur="1s" repeatCount="indefinite" />}
      </rect>
      <text x="113" y="90" textAnchor="middle" fill="#60A5FA" fontSize="7" fontWeight="bold">−</text>
      <text x="113" y="84" textAnchor="middle" fill="#64748b" fontSize="6">H₂</text>
      {/* Anode (+) right electrode */}
      <rect x="184" y="95" width="6" height="80" rx="2" fill={active ? "#34D399" : "#475569"}>
        {active && <animate attributeName="fill" values="#34D399;#6EE7B7;#34D399" dur="1s" begin="0.2s" repeatCount="indefinite" />}
      </rect>
      <text x="187" y="90" textAnchor="middle" fill="#34D399" fontSize="7" fontWeight="bold">+</text>
      <text x="187" y="84" textAnchor="middle" fill="#64748b" fontSize="6">O₂</text>
      {/* Volume tubes above */}
      <rect x="98" y="50" width="28" height="42" rx="4" fill="rgba(96,165,250,0.08)" stroke="#60A5FA" strokeWidth="1.5" />
      <rect x="174" y="62" width="28" height="30" rx="4" fill="rgba(52,211,153,0.08)" stroke="#34D399" strokeWidth="1.5" />
      {/* Volume labels */}
      <text x="112" y="68" textAnchor="middle" fill="#60A5FA" fontSize="8" fontWeight="bold">2H₂</text>
      <text x="188" y="78" textAnchor="middle" fill="#34D399" fontSize="8" fontWeight="bold">O₂</text>
      {/* Battery */}
      <rect x="120" y="22" width="60" height="22" rx="5" fill="#1e293b" stroke={active ? "#FDE047" : "#475569"} strokeWidth="1.5" />
      <text x="150" y="37" textAnchor="middle" fill={active ? "#FDE047" : "#64748b"} fontSize="8" fontWeight="bold">⚡ DC</text>
      {/* Wires */}
      <path d="M113,22 L113,50 L113,95" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray={active ? "none" : "4,3"} />
      <path d="M187,22 L187,62 L187,95" fill="none" stroke="#34D399" strokeWidth="1.5" strokeDasharray={active ? "none" : "4,3"} />
      <line x1="120" y1="33" x2="113" y2="33" stroke="#60A5FA" strokeWidth="1.5" />
      <line x1="180" y1="33" x2="187" y2="33" stroke="#34D399" strokeWidth="1.5" />
      {/* Electrolyte label */}
      <text x="150" y="170" textAnchor="middle" fill="#64748b" fontSize="7">dil. H₂SO₄</text>
      {/* Electric current flow animation */}
      {active && (
        <path d="M113,33 L150,33 L187,33" fill="none" stroke="#FDE047" strokeWidth="1" strokeDasharray="4,3" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.5s" repeatCount="indefinite" />
        </path>
      )}
      <text x="150" y="218" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">HOFFMANN VOLTAMETER — ELECTROLYSIS</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// MOLECULAR PANEL (simplified SVG)
// ═══════════════════════════════════════════════════════════

const MOL_CONFIGS: Record<ExpId, { before: React.ReactNode; after: React.ReactNode }> = {
  "caco3": {
    before: (
      <g>
        <circle cx="120" cy="50" r="16" fill="#F59E0B" filter="url(#gd)" /><text x="120" y="56" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Ca</text>
        <line x1="136" y1="50" x2="150" y2="50" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="165" cy="50" r="13" fill="#78716C" filter="url(#gd)" /><text x="165" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">C</text>
        <line x1="178" y1="44" x2="190" y2="38" stroke="#EF4444" strokeWidth="2" />
        <line x1="178" y1="50" x2="195" y2="50" stroke="#EF4444" strokeWidth="2" />
        <line x1="178" y1="56" x2="190" y2="62" stroke="#EF4444" strokeWidth="2" />
        <circle cx="200" cy="35" r="10" fill="#EF4444" filter="url(#gd)" /><text x="200" y="40" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="205" cy="50" r="10" fill="#EF4444" filter="url(#gd)" /><text x="205" y="54" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="200" cy="65" r="10" fill="#EF4444" filter="url(#gd)" /><text x="200" y="70" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="120" y="82" textAnchor="middle" fill="#64748b" fontSize="8">CaCO₃ lattice</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="70" cy="50" r="16" fill="#F59E0B" filter="url(#gd)" /><text x="70" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Ca</text>
        <line x1="86" y1="50" x2="100" y2="50" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="113" cy="50" r="12" fill="#EF4444" filter="url(#gd)" /><text x="113" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">O</text>
        <text x="90" y="75" textAnchor="middle" fill="#FB923C" fontSize="8">CaO</text>
        <text x="175" y="35" textAnchor="middle" fill="#64748b" fontSize="9">+</text>
        <circle cx="210" cy="50" r="12" fill="#EF4444" filter="url(#gd)" /><text x="210" y="55" textAnchor="middle" fill="white" fontSize="9">O</text>
        <line x1="222" y1="48" x2="236" y2="48" stroke="#78716C" strokeWidth="2.5" />
        <line x1="222" y1="52" x2="236" y2="52" stroke="#78716C" strokeWidth="2.5" />
        <circle cx="248" cy="50" r="12" fill="#78716C" filter="url(#gd)" /><text x="248" y="55" textAnchor="middle" fill="white" fontSize="9">C</text>
        <line x1="260" y1="50" x2="274" y2="50" stroke="#EF4444" strokeWidth="2.5" />
        <line x1="260" y1="46" x2="274" y2="46" stroke="#EF4444" strokeWidth="2.5" />
        <circle cx="279" cy="50" r="10" fill="#EF4444" filter="url(#gd)" /><text x="279" y="54" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="250" y="75" textAnchor="middle" fill="#38BDF8" fontSize="8">CO₂</text>
      </g>
    ),
  },
  "feso4": {
    before: (
      <g>
        <circle cx="80" cy="50" r="16" fill="#84CC16" filter="url(#gd)" /><text x="80" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Fe²⁺</text>
        <line x1="96" y1="50" x2="110" y2="50" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="125" cy="50" r="13" fill="#78716C" filter="url(#gd)" /><text x="125" y="55" textAnchor="middle" fill="white" fontSize="8">S</text>
        <line x1="138" y1="46" x2="153" y2="40" stroke="#EF4444" strokeWidth="2" />
        <line x1="138" y1="50" x2="155" y2="50" stroke="#EF4444" strokeWidth="2" />
        <line x1="138" y1="54" x2="153" y2="60" stroke="#EF4444" strokeWidth="2" />
        <circle cx="160" cy="38" r="9" fill="#EF4444" filter="url(#gd)" /><text x="160" y="43" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="163" cy="50" r="9" fill="#EF4444" filter="url(#gd)" /><text x="163" y="55" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="160" cy="62" r="9" fill="#EF4444" filter="url(#gd)" /><text x="160" y="67" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="155" cy="32" r="7" fill="#EF4444" filter="url(#gd)" /><text x="155" y="37" textAnchor="middle" fill="white" fontSize="6">O</text>
        <text x="110" y="80" textAnchor="middle" fill="#84CC16" fontSize="8">FeSO₄ (green)</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="60" cy="45" r="15" fill="#B45309" filter="url(#gd)" /><text x="60" y="50" textAnchor="middle" fill="white" fontSize="8">Fe³⁺</text>
        <line x1="75" y1="45" x2="88" y2="45" stroke="#EF4444" strokeWidth="2" />
        <circle cx="98" cy="45" r="11" fill="#EF4444" filter="url(#gd)" /><text x="98" y="50" textAnchor="middle" fill="white" fontSize="8">O</text>
        <text x="80" y="72" textAnchor="middle" fill="#FB923C" fontSize="8">Fe₂O₃</text>
        <text x="145" y="48" textAnchor="middle" fill="#64748b" fontSize="12">+</text>
        <circle cx="185" cy="45" r="11" fill="#78716C" filter="url(#gd)" /><text x="185" y="50" textAnchor="middle" fill="white" fontSize="8">S</text>
        <line x1="196" y1="43" x2="208" y2="43" stroke="#EF4444" strokeWidth="2" />
        <line x1="196" y1="47" x2="208" y2="47" stroke="#EF4444" strokeWidth="2" />
        <circle cx="216" cy="45" r="10" fill="#EF4444" filter="url(#gd)" /><text x="216" y="50" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="200" y="68" textAnchor="middle" fill="#FBBF24" fontSize="8">SO₂ / SO₃</text>
      </g>
    ),
  },
  "pb-no3": {
    before: (
      <g>
        <circle cx="80" cy="50" r="16" fill="#6B7280" filter="url(#gd)" /><text x="80" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Pb</text>
        <line x1="96" y1="50" x2="110" y2="50" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="122" cy="50" r="13" fill="#84CC16" filter="url(#gd)" /><text x="122" y="55" textAnchor="middle" fill="white" fontSize="8">N</text>
        <circle cx="142" cy="38" r="9" fill="#EF4444" filter="url(#gd)" /><text x="142" y="43" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="145" cy="50" r="9" fill="#EF4444" filter="url(#gd)" /><text x="145" y="55" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="142" cy="62" r="9" fill="#EF4444" filter="url(#gd)" /><text x="142" y="67" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="110" y="82" textAnchor="middle" fill="#94a3b8" fontSize="8">Pb(NO₃)₂ crystal</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="60" cy="50" r="14" fill="#6B7280" filter="url(#gd)" /><text x="60" y="55" textAnchor="middle" fill="white" fontSize="8">Pb</text>
        <line x1="74" y1="50" x2="86" y2="50" stroke="#EF4444" strokeWidth="2" />
        <circle cx="96" cy="50" r="11" fill="#EF4444" filter="url(#gd)" /><text x="96" y="55" textAnchor="middle" fill="white" fontSize="8">O</text>
        <text x="78" y="74" textAnchor="middle" fill="#FDE047" fontSize="8">PbO (yellow)</text>
        <text x="140" y="50" textAnchor="middle" fill="#64748b" fontSize="11">+</text>
        <circle cx="175" cy="45" r="11" fill="#84CC16" filter="url(#gd)" /><text x="175" y="50" textAnchor="middle" fill="white" fontSize="8">N</text>
        <line x1="186" y1="43" x2="198" y2="38" stroke="#EF4444" strokeWidth="2" />
        <line x1="186" y1="47" x2="200" y2="47" stroke="#EF4444" strokeWidth="2" />
        <circle cx="205" cy="36" r="9" fill="#EF4444" filter="url(#gd)" /><text x="205" y="41" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="208" cy="47" r="9" fill="#EF4444" filter="url(#gd)" /><text x="208" y="52" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="190" y="68" textAnchor="middle" fill="#A78BFA" fontSize="8">NO₂ (brown)</text>
        <text x="250" y="50" textAnchor="middle" fill="#64748b" fontSize="11">+</text>
        <circle cx="275" cy="50" r="9" fill="#EF4444" filter="url(#gd)" /><text x="275" y="55" textAnchor="middle" fill="white" fontSize="7">O₂</text>
      </g>
    ),
  },
  "znco3": {
    before: (
      <g>
        <circle cx="90" cy="50" r="15" fill="#38BDF8" filter="url(#gd)" /><text x="90" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Zn</text>
        <line x1="105" y1="50" x2="118" y2="50" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="130" cy="50" r="13" fill="#78716C" filter="url(#gd)" /><text x="130" y="55" textAnchor="middle" fill="white" fontSize="8">C</text>
        <line x1="143" y1="44" x2="156" y2="38" stroke="#EF4444" strokeWidth="2" />
        <line x1="143" y1="50" x2="158" y2="50" stroke="#EF4444" strokeWidth="2" />
        <line x1="143" y1="56" x2="156" y2="62" stroke="#EF4444" strokeWidth="2" />
        <circle cx="163" cy="36" r="9" fill="#EF4444" filter="url(#gd)" /><text x="163" y="41" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="165" cy="50" r="9" fill="#EF4444" filter="url(#gd)" /><text x="165" y="55" textAnchor="middle" fill="white" fontSize="7">O</text>
        <circle cx="163" cy="64" r="9" fill="#EF4444" filter="url(#gd)" /><text x="163" y="69" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="120" y="82" textAnchor="middle" fill="#38BDF8" fontSize="8">ZnCO₃ (white)</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="75" cy="50" r="15" fill="#FDE047" filter="url(#gd)" /><text x="75" y="55" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold">Zn</text>
        <line x1="90" y1="50" x2="104" y2="50" stroke="#EF4444" strokeWidth="2" />
        <circle cx="115" cy="50" r="11" fill="#EF4444" filter="url(#gd)" /><text x="115" y="55" textAnchor="middle" fill="white" fontSize="8">O</text>
        <text x="92" y="75" textAnchor="middle" fill="#FDE047" fontSize="8">ZnO (yellow/hot)</text>
        <text x="158" y="50" textAnchor="middle" fill="#64748b" fontSize="12">+</text>
        <circle cx="205" cy="50" r="11" fill="#EF4444" filter="url(#gd)" /><text x="205" y="55" textAnchor="middle" fill="white" fontSize="9">O</text>
        <line x1="216" y1="48" x2="228" y2="48" stroke="#78716C" strokeWidth="2.5" />
        <line x1="216" y1="52" x2="228" y2="52" stroke="#78716C" strokeWidth="2.5" />
        <circle cx="238" cy="50" r="11" fill="#78716C" filter="url(#gd)" /><text x="238" y="55" textAnchor="middle" fill="white" fontSize="9">C</text>
        <line x1="249" y1="50" x2="261" y2="50" stroke="#EF4444" strokeWidth="2" />
        <line x1="249" y1="46" x2="261" y2="46" stroke="#EF4444" strokeWidth="2" />
        <circle cx="266" cy="50" r="9" fill="#EF4444" filter="url(#gd)" /><text x="266" y="54" textAnchor="middle" fill="white" fontSize="7">O</text>
        <text x="237" y="75" textAnchor="middle" fill="#38BDF8" fontSize="8">CO₂↑</text>
      </g>
    ),
  },
  "agcl": {
    before: (
      <g>
        <circle cx="90" cy="50" r="16" fill="#94a3b8" filter="url(#gd)" /><text x="90" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Ag⁺</text>
        <line x1="106" y1="50" x2="120" y2="50" stroke="#FDE047" strokeWidth="2" /><text x="113" y="45" textAnchor="middle" fill="#FDE047" fontSize="7">hν</text>
        <circle cx="133" cy="50" r="14" fill="#84CC16" filter="url(#gd)" /><text x="133" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Cl⁻</text>
        <text x="112" y="76" textAnchor="middle" fill="#F8FAFC" fontSize="8">AgCl (white)</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="80" cy="50" r="16" fill="#6B7280" filter="url(#gd)" /><text x="80" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Ag</text>
        <text x="80" y="74" textAnchor="middle" fill="#94a3b8" fontSize="8">Ag metal (grey)</text>
        <text x="145" y="50" textAnchor="middle" fill="#64748b" fontSize="12">+</text>
        <circle cx="200" cy="45" r="12" fill="#84CC16" filter="url(#gd)" /><text x="200" y="50" textAnchor="middle" fill="white" fontSize="9">Cl</text>
        <line x1="212" y1="43" x2="225" y2="43" stroke="#84CC16" strokeWidth="2" />
        <line x1="212" y1="47" x2="225" y2="47" stroke="#84CC16" strokeWidth="2" />
        <circle cx="236" cy="45" r="12" fill="#84CC16" filter="url(#gd)" /><text x="236" y="50" textAnchor="middle" fill="white" fontSize="9">Cl</text>
        <text x="218" y="70" textAnchor="middle" fill="#84CC16" fontSize="8">Cl₂↑</text>
      </g>
    ),
  },
  "agbr": {
    before: (
      <g>
        <circle cx="90" cy="50" r="16" fill="#94a3b8" filter="url(#gd)" /><text x="90" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Ag⁺</text>
        <line x1="106" y1="50" x2="120" y2="50" stroke="#FDE047" strokeWidth="2" /><text x="113" y="45" textAnchor="middle" fill="#FDE047" fontSize="7">hν</text>
        <circle cx="133" cy="50" r="14" fill="#B45309" filter="url(#gd)" /><text x="133" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Br⁻</text>
        <text x="112" y="76" textAnchor="middle" fill="#FDE68A" fontSize="8">AgBr (cream)</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="80" cy="50" r="16" fill="#292524" filter="url(#gd)" stroke="#6B7280" strokeWidth="1" /><text x="80" y="55" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">Ag</text>
        <text x="80" y="74" textAnchor="middle" fill="#94a3b8" fontSize="8">Ag (black)</text>
        <text x="145" y="50" textAnchor="middle" fill="#64748b" fontSize="12">+</text>
        <circle cx="200" cy="45" r="12" fill="#B45309" filter="url(#gd)" /><text x="200" y="50" textAnchor="middle" fill="white" fontSize="9">Br</text>
        <line x1="212" y1="43" x2="225" y2="43" stroke="#B45309" strokeWidth="2" />
        <line x1="212" y1="47" x2="225" y2="47" stroke="#B45309" strokeWidth="2" />
        <circle cx="236" cy="45" r="12" fill="#B45309" filter="url(#gd)" /><text x="236" y="50" textAnchor="middle" fill="white" fontSize="9">Br</text>
        <text x="218" y="70" textAnchor="middle" fill="#F59E0B" fontSize="8">Br₂↑ (reddish)</text>
      </g>
    ),
  },
  "h2o-electrolysis": {
    before: (
      <g>
        <circle cx="120" cy="50" r="12" fill="#EF4444" filter="url(#gd)" /><text x="120" y="55" textAnchor="middle" fill="white" fontSize="8">O</text>
        <line x1="108" y1="43" x2="96" y2="34" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="89" cy="29" r="9" fill="#38BDF8" filter="url(#gd)" /><text x="89" y="34" textAnchor="middle" fill="white" fontSize="7">H</text>
        <line x1="108" y1="57" x2="96" y2="66" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="89" cy="71" r="9" fill="#38BDF8" filter="url(#gd)" /><text x="89" y="76" textAnchor="middle" fill="white" fontSize="7">H</text>
        <circle cx="195" cy="50" r="12" fill="#EF4444" filter="url(#gd)" /><text x="195" y="55" textAnchor="middle" fill="white" fontSize="8">O</text>
        <line x1="183" y1="43" x2="171" y2="34" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="164" cy="29" r="9" fill="#38BDF8" filter="url(#gd)" /><text x="164" y="34" textAnchor="middle" fill="white" fontSize="7">H</text>
        <line x1="183" y1="57" x2="171" y2="66" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="164" cy="71" r="9" fill="#38BDF8" filter="url(#gd)" /><text x="164" y="76" textAnchor="middle" fill="white" fontSize="7">H</text>
        <text x="150" y="92" textAnchor="middle" fill="#60A5FA" fontSize="8">2H₂O molecules</text>
      </g>
    ),
    after: (
      <g>
        <circle cx="65" cy="45" r="10" fill="#38BDF8" filter="url(#gd)" /><text x="65" y="50" textAnchor="middle" fill="white" fontSize="8">H</text>
        <line x1="75" y1="43" x2="87" y2="43" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="75" y1="47" x2="87" y2="47" stroke="#38BDF8" strokeWidth="2.5" />
        <circle cx="97" cy="45" r="10" fill="#38BDF8" filter="url(#gd)" /><text x="97" y="50" textAnchor="middle" fill="white" fontSize="8">H</text>
        <circle cx="65" cy="72" r="10" fill="#38BDF8" filter="url(#gd)" /><text x="65" y="77" textAnchor="middle" fill="white" fontSize="8">H</text>
        <line x1="75" y1="70" x2="87" y2="70" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="75" y1="74" x2="87" y2="74" stroke="#38BDF8" strokeWidth="2.5" />
        <circle cx="97" cy="72" r="10" fill="#38BDF8" filter="url(#gd)" /><text x="97" y="77" textAnchor="middle" fill="white" fontSize="8">H</text>
        <text x="81" y="96" textAnchor="middle" fill="#60A5FA" fontSize="8">2H₂ (cathode)</text>
        <text x="150" y="58" textAnchor="middle" fill="#64748b" fontSize="12">+</text>
        <circle cx="210" cy="50" r="12" fill="#EF4444" filter="url(#gd)" /><text x="210" y="55" textAnchor="middle" fill="white" fontSize="9">O</text>
        <line x1="222" y1="48" x2="236" y2="48" stroke="#EF4444" strokeWidth="2.5" />
        <line x1="222" y1="52" x2="236" y2="52" stroke="#EF4444" strokeWidth="2.5" />
        <circle cx="246" cy="50" r="12" fill="#EF4444" filter="url(#gd)" /><text x="246" y="55" textAnchor="middle" fill="white" fontSize="9">O</text>
        <text x="228" y="78" textAnchor="middle" fill="#34D399" fontSize="8">O₂ (anode)</text>
      </g>
    ),
  },
};

function MolecularPanel({ expId, phase, accent }: { expId: ExpId; phase: Phase; accent: string }) {
  const showAfter = phase === "complete";
  const cfg = MOL_CONFIGS[expId];
  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Molecular View</span>
        <span className="text-[10px] font-black" style={{ color: accent }}>{showAfter ? "After Reaction" : "Before"}</span>
      </div>
      <svg viewBox="0 0 300 100" className="w-full" style={{ height: 88 }}>
        <defs>
          <filter id="gd"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <AnimatePresence mode="wait">
          <motion.g key={showAfter ? "after" : "before"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {showAfter ? cfg.after : cfg.before}
          </motion.g>
        </AnimatePresence>
        {phase === "reacting" && !showAfter && (
          <text x="150" y="95" textAnchor="middle" fill={accent} fontSize="9" className="animate-pulse">⚡ Breaking bonds…</text>
        )}
      </svg>
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
          style={{ background: `linear-gradient(135deg, ${exp.gradFrom}, ${exp.gradTo})` }}>{isAs ? "উত্তৰ জমা দিয়ক" : "Submit Answers"}</button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
          <div className="text-2xl mb-1">{score === exp.quiz.length ? "🎉" : "📚"}</div>
          <p className="text-xs font-black" style={{ color: exp.accent }}>
            {score === exp.quiz.length
              ? (isAs ? "অসাধাৰণ! পৰীক্ষাৰ বাবে সাজু!" : "Perfect! Exam-ready!")
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
  // Pre-compute translated fields once per render
  const expTitle = pickLang(exp.title, lang);
  const expDesc = pickLang(exp.description, lang);
  const expRealWorld = pickLang(exp.realWorld, lang);
  const expExamNote = pickLang(exp.examNote, lang);
  const expSafety = pickLang(exp.safety, lang);
  const expObservations = pickLang(exp.observations, lang);
  const expCategory = pickLang(CATEGORY_LABEL[exp.category], lang);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [voltage, setVoltage] = useState(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to quiz whenever it appears (post-completion OR Take Quiz tap)
  useEffect(() => {
    if (!showQuiz) return;
    const id = setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
    return () => clearTimeout(id);
  }, [showQuiz]);

  const pIntensity = phase === "reacting" ? 1 : phase === "complete" ? 0.25 : 0;
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

  const tempTarget = phase === "reacting" || phase === "complete"
    ? (exp.category === "Thermal" ? 75 : exp.category === "Electrolytic" ? 30 : 20) : 0;
  const rxnProgress = phase === "complete" ? 100 : phase === "reacting" ? 65 : 0;

  const catColor = exp.category === "Thermal" ? "#FB923C" : exp.category === "Photolytic" ? "#FDE047" : "#60A5FA";

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
          <NeonBadge label={expCategory} color={catColor} />
        </div>
        <LanguageToggle />
        <button onClick={() => setShowSafety(s => !s)} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><Shield className="w-4 h-4 text-slate-400" /></button>
        <button onClick={reset} className="p-1.5 rounded-lg hover:bg-white/5 shrink-0"><RotateCcw className="w-4 h-4 text-slate-400" /></button>
      </div>

      {/* Safety overlay */}
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

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left — Apparatus + Controls */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 220 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="absolute inset-0 p-3">
              {exp.category === "Thermal" && <ThermalApparatus exp={exp} phase={phase} />}
              {exp.category === "Photolytic" && <PhotolyticApparatus exp={exp} phase={phase} />}
              {exp.category === "Electrolytic" && <ElectrolysisApparatus phase={phase} />}
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
                {exp.steps.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= stepIdx && phase !== "idle" ? exp.accent : "rgba(255,255,255,0.15)" }} />)}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx + phase} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="mb-3">
                <p className="text-sm font-black text-white mb-1">{pickLang(exp.steps[stepIdx].label, lang)}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{pickLang(exp.steps[stepIdx].desc, lang)}</p>
              </motion.div>
            </AnimatePresence>

            {/* Voltage control for electrolysis */}
            {exp.id === "h2o-electrolysis" && phase !== "complete" && (
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-slate-400">{isAs ? "ভোল্টেজ" : "Voltage"}</span>
                  <span className="text-[10px] font-black tabular-nums" style={{ color: exp.accent }}>{voltage} V</span>
                </div>
                <input type="range" min={2} max={12} value={voltage} onChange={e => setVoltage(+e.target.value)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: exp.accent }} />
              </div>
            )}

            {phase !== "complete" ? (
              <button onClick={phase === "idle" ? () => { setPhase("step1"); } : nextStep}
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
        </div>

        {/* Middle — Data + Observations */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Equation */}
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সমতুল্য সমীকৰণ" : "Balanced Equation"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-sm border" style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>
              {exp.equation}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[[isAs ? "শ্ৰেণী" : "Category", expCategory], [isAs ? "শক্তি" : "Energy", exp.energy], [isAs ? "উষ্ণতা" : "Temp", exp.peakTemp]].map(([l, v]) => (
                <div key={l} className="rounded-lg py-2 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[8px] text-slate-600 mb-0.5">{l}</p>
                  <p className="text-[9px] font-black text-slate-300 leading-tight truncate">{v}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Live meters */}
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "প্ৰত্যক্ষ তথ্য" : "Live Data"}</p>
            <div className="space-y-3">
              <AnimatedBar label={isAs ? "বিক্ৰিয়াৰ অগ্ৰগতি" : "Reaction Progress"} target={rxnProgress} max={100} accent={exp.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimatedBar label={isAs ? "উষ্ণতা বৃদ্ধি" : "Temperature Rise"} target={tempTarget} max={100} accent="#FB923C" icon={<Thermometer className="w-3 h-3" />} />
              {exp.id === "h2o-electrolysis" && <AnimatedBar label={isAs ? "বিদ্যুৎ প্ৰৱাহ" : "Current Flow"} target={phase !== "idle" ? voltage * 8 : 0} max={100} accent="#FDE047" icon={<Zap className="w-3 h-3" />} />}
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "বিযোজনৰ প্ৰকাৰ" : "Decomposition Type"} value={expCategory} color={catColor} />
              <DataRow label={isAs ? "বিপদ" : "Hazard"} value={exp.hazard} color={exp.hazard === "HIGH" ? "#EF4444" : exp.hazard === "MEDIUM" ? "#FB923C" : "#22C55E"} />
              <DataRow label={isAs ? "অৱস্থা" : "State"} value={
                phase === "idle" ? (isAs ? "আৰম্ভ হোৱা নাই" : "Not started")
                : phase === "complete" ? (isAs ? "সম্পূৰ্ণ ✓" : "Completed ✓")
                : (isAs ? "চলি আছে" : "In progress")
              } color={phase === "complete" ? "#34D399" : exp.accent} />
            </div>
          </GlassPanel>

          {/* Observations */}
          <GlassPanel className="p-3 flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "পৰ্যবেক্ষণ" : "Observations"}</p>
            <div className="space-y-1.5">
              {expObservations.map((obs, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: phase !== "idle" || i === 0 ? 1 : 0.3, x: 0 }} transition={{ delay: i * 0.12 }}
                  className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: phase === "complete" ? `${exp.accent}22` : "rgba(255,255,255,0.05)" }}>
                    {phase === "complete" ? <CheckCircle className="w-3 h-3" style={{ color: exp.accent }} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{obs}</p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right — Molecular + Info + Quiz */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <MolecularPanel expId={exp.id} phase={phase} accent={exp.accent} />

          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-2"><Info className="w-3.5 h-3.5" style={{ color: exp.accent }} /><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "পৰীক্ষাৰ টোকা" : "Exam Note"}</span></div>
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
// LAB HUB DASHBOARD
// ═══════════════════════════════════════════════════════════

function LabHub({ onSelect }: { onSelect: (e: Exp) => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const categories = ["All", "Thermal", "Photolytic", "Electrolytic"] as const;
  const [filter, setFilter] = useState<typeof categories[number]>("All");
  const visible = EXPERIMENTS.filter(e => filter === "All" || e.category === filter);

  const catColor = (c: string) => c === "Thermal" ? "#FB923C" : c === "Photolytic" ? "#FDE047" : "#60A5FA";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #0A0F2E 50%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-20 animate-pulse"
            style={{ width: 2 + Math.random() * 3, height: 2 + Math.random() * 3, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: ["#FB923C","#FDE047","#60A5FA","#34D399","#A78BFA"][i % 5], animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
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
            style={{ borderColor: "rgba(251,146,60,0.3)", background: "rgba(251,146,60,0.08)", color: "#FB923C" }}>
            <FlaskConical className="w-3.5 h-3.5" /> {isAs ? "বিযোজন বিক্ৰিয়া · অধ্যায় ১" : "Decomposition Reactions · Chapter 1"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "বিযোজন" : "Decomposition"}<br />
            <span style={{ background: "linear-gradient(135deg, #FB923C, #FDE047)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isAs ? "বিক্ৰিয়া পৰীক্ষাগাৰ" : "Reactions Lab"}
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs
              ? "৭টা পাৰস্পৰিক বিযোজন পৰীক্ষা — তাপীয়, আলোক আৰু বৈদ্যুতিক। NCERT-অনুকূল, পৰীক্ষা-উপযোগী, সম্পূৰ্ণ নিমজ্জিত।"
              : "7 interactive decomposition experiments — thermal, photolytic, and electrolytic. NCERT-aligned, exam-oriented, fully immersive."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs
              ? [["৭","পৰীক্ষা"],["৩","বিক্ৰিয়াৰ প্ৰকাৰ"],["CBSE","অনুকূল"],["কুইজ","অন্তৰ্ভুক্ত"]]
              : [["7","Experiments"],["3","Reaction Types"],["CBSE","Aligned"],["Quiz","Included"]]
            ).map(([v,l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-base font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {categories.map(cat => {
            const catLabel = cat === "All"
              ? (isAs ? "সকলো প্ৰকাৰ" : "All Types")
              : pickLang(CATEGORY_LABEL[cat], lang);
            return (
              <button key={cat} onClick={() => setFilter(cat)}
                className="px-4 py-2 rounded-full text-xs font-black transition-all border"
                style={{ borderColor: filter === cat ? (cat === "All" ? "#94a3b8" : catColor(cat)) : "rgba(255,255,255,0.1)", background: filter === cat ? `${cat === "All" ? "#94a3b8" : catColor(cat)}22` : "transparent", color: filter === cat ? (cat === "All" ? "#94a3b8" : catColor(cat)) : "#64748b" }}>
                {cat === "Thermal" ? <><Flame className="w-3 h-3 inline mr-1" />{catLabel}</> : cat === "Photolytic" ? <><Sun className="w-3 h-3 inline mr-1" />{catLabel}</> : cat === "Electrolytic" ? <><Zap className="w-3 h-3 inline mr-1" />{catLabel}</> : catLabel}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((exp, idx) => {
            const cardTitle = pickLang(exp.title, lang);
            const cardSubtitle = pickLang(exp.subtitle, lang);
            const cardDesc = pickLang(exp.description, lang);
            const cardCategory = pickLang(CATEGORY_LABEL[exp.category], lang);
            return (
              <motion.div key={exp.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
                <button onClick={() => onSelect(exp)} className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${exp.accent}50`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                  <div className="h-1.5" style={{ background: `linear-gradient(to right, ${exp.gradFrom}, ${exp.gradTo})` }} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${exp.gradFrom}22, ${exp.gradTo}22)`, borderColor: `${exp.accent}40` }}>
                          {exp.emoji}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAs ? "পৰীক্ষা" : "Exp."} {String(exp.num).padStart(2,"0")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border"
                        style={{ color: catColor(exp.category), borderColor: `${catColor(exp.category)}40`, background: `${catColor(exp.category)}12` }}>
                        <CategoryIcon cat={exp.category} />{cardCategory}
                      </div>
                    </div>
                    <h3 className="text-base font-black text-white mb-0.5">{cardTitle}</h3>
                    <p className="text-xs font-semibold mb-3" style={{ color: exp.accent }}>{cardSubtitle}</p>
                    <div className="font-mono text-[11px] font-black px-3 py-2 rounded-lg mb-3 border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>
                      {exp.equation}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{cardDesc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {(isAs ? ["কণা FX","আণৱিক","কুইজ"] : ["Particle FX","Mol. View","Quiz"]).map(t => <span key={t} className="text-[8px] px-1.5 py-0.5 rounded font-black" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{t}</span>)}
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
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════

export default function DecompositionReactionsLab() {
  const [active, setActive] = useState<Exp | null>(null);
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#050B18" }}>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div key="room" className="flex-1 overflow-hidden" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.28 }}>
            <ExperimentRoom exp={active} onBack={() => setActive(null)} />
          </motion.div>
        ) : (
          <motion.div key="hub" className="flex-1 overflow-auto" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.28 }}>
            <LabHub onSelect={setActive} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
