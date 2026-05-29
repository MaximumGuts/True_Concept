/**
 * Oxidation & Reduction (Redox) Reactions Virtual Lab
 * 6 interactive experiments with electron-transfer visualization,
 * redox analysis panel, canvas particle physics, and CBSE quiz.
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";
import {
  ArrowLeft, Shield, FlaskConical, RotateCcw, Play,
  AlertTriangle, CheckCircle, Info, ChevronRight,
  BarChart2, Thermometer, Zap,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ExpId = "cu-oxidation" | "cuo-reduction" | "steam-iron" | "thermite" | "hcl-mno2" | "h2s-combustion";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "oxidation-heat" | "reduction-steam" | "steam-iron" | "thermite" | "chlorine-gas" | "h2s-flame" | "none";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; blur: number; type: string;
}

interface RedoxAnalysis {
  oxidized: BilingualField<string>; reduced: BilingualField<string>;
  oxidizingAgent: BilingualField<string>; reducingAgent: BilingualField<string>;
  electronDonor: BilingualField<string>; electronAcceptor: BilingualField<string>;
  oxNumChanges: { species: string; from: string; to: string; color: string }[];
}

interface Exp {
  id: ExpId; num: number;
  title: BilingualField<string>;
  subtitle: BilingualField<string>;
  equation: string;
  halfReactions: { ox: BilingualField<string>; red: BilingualField<string> };
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  hazard: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  description: BilingualField<string>;
  realWorld: BilingualField<string>;
  examNote: BilingualField<string>;
  safety: BilingualField<string[]>;
  steps: { label: BilingualField<string>; desc: BilingualField<string> }[];
  observations: BilingualField<string[]>;
  redox: RedoxAnalysis;
  pmode: PMode;
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
}

// ═══════════════════════════════════════════════════════════
// EXPERIMENT CONFIG
// ═══════════════════════════════════════════════════════════

const EXPERIMENTS: Exp[] = [
  {
    id: "cu-oxidation", num: 1,
    title: { en: "Oxidation of Copper", as: "তামাৰ জাৰণ" },
    subtitle: { en: "Copper → Copper Oxide", as: "তামা → তামা অক্সাইড" },
    equation: "2Cu + O₂ → 2CuO",
    halfReactions: {
      ox: { en: "Cu → Cu²⁺ + 2e⁻ (Oxidation)", as: "Cu → Cu²⁺ + 2e⁻ (জাৰণ)" },
      red: { en: "O₂ + 4e⁻ → 2O²⁻ (Reduction)", as: "O₂ + 4e⁻ → 2O²⁻ (অপচয়ন)" },
    },
    accent: "#FB923C", glow: "rgba(251,146,60,0.4)", gradFrom: "#C2410C", gradTo: "#FB923C", emoji: "🟠",
    hazard: "LOW",
    description: {
      en: "Copper metal heated in air reacts with oxygen to form black copper oxide (CuO). Copper loses electrons to oxygen — copper is oxidised, oxygen is reduced. The colour change from reddish-brown to black is a key observation.",
      as: "বায়ুত উত্তপ্ত কৰা তামা ধাতুৱে অক্সিজেনৰ সৈতে বিক্ৰিয়া কৰি ক’লা তামা অক্সাইড (CuO) গঠন কৰে। তামাই অক্সিজেনলৈ ইলেক্ট্ৰন হেৰুৱায় — তামা জাৰিত হয়, অক্সিজেন অপচয়িত হয়। ৰঙা-মুগা ৰঙৰ পৰা ক’লালৈ ৰং সলনি এক মুখ্য পৰ্যবেক্ষণ।",
    },
    realWorld: {
      en: "Copper plumbing corrosion · Patina on copper statues · Electrical contact oxidation · Copper metallurgy",
      as: "তামাৰ পাইপৰ মৰিচা · তামাৰ মূৰ্তিত পাতিনা · বৈদ্যুতিক যোগাযোগ জাৰণ · তামাৰ ধাতুবিদ্যা",
    },
    examNote: {
      en: "Cu is OXIDISED (loses electrons, O.N. goes from 0 to +2). O₂ is the OXIDISING AGENT. CuO is black — key colour change. 2Cu + O₂ → 2CuO. CBSE frequently tests oxidation number changes.",
      as: "Cu জাৰিত হয় (ইলেক্ট্ৰন হেৰুৱায়, জা.সং. 0ৰ পৰা +2 হয়)। O₂ হ’ল জাৰক। CuO ক’লা — মুখ্য ৰং সলনি। 2Cu + O₂ → 2CuO। CBSE-এ প্ৰায়ে জাৰণ সংখ্যাৰ পৰিবৰ্তন পৰীক্ষা কৰে।",
    },
    safety: {
      en: ["Use tongs for hot copper", "Bunsen burner — fire hazard", "Wear goggles", "Avoid touching hot apparatus"],
      as: ["গৰম তামাৰ বাবে চিমটা ব্যৱহাৰ কৰক", "বুনছেন বাৰ্নাৰ — অগ্নি বিপদ", "চশমা পিন্ধক", "গৰম যন্ত্ৰ স্পৰ্শ নকৰিব"],
    },
    steps: [
      { label: { en: "Prepare Copper", as: "তামা প্ৰস্তুত কৰক" }, desc: { en: "Hold a copper wire/strip with tongs. Note the characteristic reddish-brown metallic colour of copper.", as: "চিমটাৰে তামাৰ তাঁৰ/পাত ধৰক। তামাৰ চিনাকি ৰঙা-মুগা ধাতৱীয় ৰং লক্ষ্য কৰক।" } },
      { label: { en: "Heat Strongly", as: "তীব্ৰভাৱে উত্তপ্ত কৰক" }, desc: { en: "Heat copper in a Bunsen flame. As temperature rises, copper starts reacting with atmospheric oxygen.", as: "বুনছেন শিখাত তামা উত্তপ্ত কৰক। উষ্ণতা বাঢ়াৰ লগে লগে তামাই বায়ুৰ অক্সিজেনৰ সৈতে বিক্ৰিয়া আৰম্ভ কৰে।" } },
      { label: { en: "Observe Oxidation", as: "জাৰণ লক্ষ্য কৰক" }, desc: { en: "The reddish-brown copper gradually turns BLACK. CuO layer forms progressively on the surface.", as: "ৰঙা-মুগা তামা ক্ৰমে ক’লা হয়। পৃষ্ঠত CuO স্তৰ ক্ৰমে গঠিত হয়।" } },
      { label: { en: "Confirm Product", as: "উৎপাদ নিশ্চিত কৰক" }, desc: { en: "Black coating is CuO (copper oxide). Remove from flame — the black colour persists.", as: "ক’লা আবৰণ হ’ল CuO (তামা অক্সাইড)। শিখাৰ পৰা আঁতৰাওক — ক’লা ৰং থাকি যায়।" } },
    ],
    observations: {
      en: ["Reddish-brown copper gradually turns black", "Black CuO layer spreads from heated zone", "Metal glows red-hot under heat", "Black coating remains after cooling"],
      as: ["ৰঙা-মুগা তামা ক্ৰমে ক’লা হয়", "উত্তপ্ত অঞ্চলৰ পৰা ক’লা CuO স্তৰ বিস্তাৰ হয়", "তাপত ধাতু ৰঙা-গৰমকৈ জ্বলে", "ঠাণ্ডা হোৱাৰ পিছতো ক’লা আবৰণ থাকে"],
    },
    redox: {
      oxidized: { en: "Copper (Cu)", as: "তামা (Cu)" },
      reduced: { en: "Oxygen (O₂)", as: "অক্সিজেন (O₂)" },
      oxidizingAgent: { en: "Oxygen (O₂)", as: "অক্সিজেন (O₂)" },
      reducingAgent: { en: "Copper (Cu)", as: "তামা (Cu)" },
      electronDonor: { en: "Copper (Cu)", as: "তামা (Cu)" },
      electronAcceptor: { en: "Oxygen (O₂)", as: "অক্সিজেন (O₂)" },
      oxNumChanges: [
        { species: "Cu", from: "0", to: "+2", color: "#FB923C" },
        { species: "O", from: "0", to: "−2", color: "#60A5FA" },
      ],
    },
    pmode: "oxidation-heat",
    quiz: [
      { q: { en: "What colour does copper turn when heated in air?", as: "বায়ুত উত্তপ্ত কৰিলে তামা কি ৰংলৈ পৰিবৰ্তন হয়?" }, opts: { en: ["Red", "Green", "Black", "White"], as: ["ৰঙা", "সেউজীয়া", "ক’লা", "বগা"] }, ans: 2 },
      { q: { en: "Which substance is oxidised in 2Cu + O₂ → 2CuO?", as: "2Cu + O₂ → 2CuO-ত কোন পদাৰ্থ জাৰিত হয়?" }, opts: { en: ["Oxygen", "Copper", "CuO", "Both"], as: ["অক্সিজেন", "তামা", "CuO", "দুয়োটা"] }, ans: 1 },
      { q: { en: "What is the oxidation number of Cu in CuO?", as: "CuO-ত Cu-ৰ জাৰণ সংখ্যা কিমান?" }, opts: { en: ["+1", "+2", "−2", "0"], as: ["+1", "+2", "−2", "0"] }, ans: 1 },
      { q: { en: "Which is the oxidising agent in this reaction?", as: "এই বিক্ৰিয়াত জাৰক কোনটো?" }, opts: { en: ["Cu", "CuO", "O₂", "CO₂"], as: ["Cu", "CuO", "O₂", "CO₂"] }, ans: 2 },
    ],
  },
  {
    id: "cuo-reduction", num: 2,
    title: { en: "Reduction of Copper Oxide", as: "তামা অক্সাইডৰ অপচয়ন" },
    subtitle: { en: "CuO + H₂ → Cu + H₂O", as: "CuO + H₂ → Cu + H₂O" },
    equation: "CuO + H₂ → Cu + H₂O",
    halfReactions: {
      ox: { en: "H₂ → 2H⁺ + 2e⁻ (Oxidation)", as: "H₂ → 2H⁺ + 2e⁻ (জাৰণ)" },
      red: { en: "Cu²⁺ + 2e⁻ → Cu (Reduction)", as: "Cu²⁺ + 2e⁻ → Cu (অপচয়ন)" },
    },
    accent: "#60A5FA", glow: "rgba(96,165,250,0.4)", gradFrom: "#1D4ED8", gradTo: "#60A5FA", emoji: "🔵",
    hazard: "HIGH",
    description: {
      en: "Hydrogen gas passed over hot black copper oxide reduces it back to reddish-brown copper metal. Hydrogen is the reducing agent — it removes oxygen from CuO. Water vapour condenses in the cool part of the tube.",
      as: "গৰম ক’লা তামা অক্সাইডৰ ওপৰেদি প্ৰবাহিত কৰা হাইড্ৰ’জেন গেছে ইয়াক ৰঙা-মুগা তামা ধাতুলৈ অপচয়িত কৰে। হাইড্ৰ’জেন হ’ল অপচায়ক — ই CuOৰ পৰা অক্সিজেন আঁতৰায়। জলীয় বাষ্প টিউবৰ ঠাণ্ডা অংশত ঘনীভূত হয়।",
    },
    realWorld: {
      en: "Metal refining · Copper extraction · Hydrogen fuel cells · Industrial reduction of metal oxides",
      as: "ধাতু পৰিশোধন · তামা নিষ্কাশন · হাইড্ৰ’জেন ইন্ধন কোষ · ধাতু অক্সাইডৰ ঔদ্যোগিক অপচয়ন",
    },
    examNote: {
      en: "CuO is REDUCED (Cu²⁺ → Cu, gains electrons, O.N. +2 → 0). H₂ is OXIDISED (0 → +1). H₂ is the REDUCING AGENT. Black CuO turns reddish-brown Cu. Water forms as by-product. Reverse of Cu oxidation.",
      as: "CuO অপচয়িত হয় (Cu²⁺ → Cu, ইলেক্ট্ৰন লাভ, জা.সং. +2 → 0)। H₂ জাৰিত হয় (0 → +1)। H₂ হ’ল অপচায়ক। ক’লা CuO ৰঙা-মুগা Cu হয়। উপজাত হিচাপে পানী গঠিত হয়। Cu জাৰণৰ বিপৰীত।",
    },
    safety: {
      en: ["H₂ is highly flammable — no open flame near source", "Ensure H₂ flow before heating", "Wear goggles", "Never heat before H₂ flows (risk of explosion)"],
      as: ["H₂ অতি দাহ্য — উৎসৰ ওচৰত খোলা শিখা ৰাখিব নলাগে", "উত্তাপৰ পূৰ্বে H₂ প্ৰবাহ নিশ্চিত কৰক", "চশমা পিন্ধক", "H₂ প্ৰবাহৰ পূৰ্বে কেতিয়াও উত্তপ্ত নকৰিব (বিস্ফোৰণৰ আশংকা)"],
    },
    steps: [
      { label: { en: "Load CuO", as: "CuO ভৰাওক" }, desc: { en: "Place black CuO powder in a hard-glass tube. Ensure the tube is clean and dry.", as: "এটা শক্ত-কাঁচৰ টিউবত ক’লা CuO গুড়ি ৰাখক। টিউব পৰিষ্কাৰ আৰু শুকান হোৱাটো নিশ্চিত কৰক।" } },
      { label: { en: "Flow Hydrogen", as: "হাইড্ৰ’জেন প্ৰবাহ কৰক" }, desc: { en: "Start H₂ gas flow FIRST — before heating! This purges air from tube (prevents explosion risk).", as: "উত্তাপৰ পূৰ্বে — প্ৰথমে H₂ গেছ প্ৰবাহ আৰম্ভ কৰক! ই টিউবৰ পৰা বায়ু আঁতৰায় (বিস্ফোৰণৰ আশংকা ৰোধ কৰে)।" } },
      { label: { en: "Apply Heat", as: "তাপ প্ৰয়োগ কৰক" }, desc: { en: "Heat the CuO strongly. H₂ reacts: removes oxygen from CuO, forming Cu and H₂O.", as: "CuO তীব্ৰভাৱে উত্তপ্ত কৰক। H₂ বিক্ৰিয়া কৰে: CuOৰ পৰা অক্সিজেন আঁতৰাই Cu আৰু H₂O গঠন কৰে।" } },
      { label: { en: "Observe Products", as: "উৎপাদ লক্ষ্য কৰক" }, desc: { en: "Black CuO turns reddish-brown (Cu). Water condenses in cool zone. CuO has been REDUCED.", as: "ক’লা CuO ৰঙা-মুগা (Cu) হয়। ঠাণ্ডা অঞ্চলত পানী ঘনীভূত হয়। CuO অপচয়িত হ’ল।" } },
    ],
    observations: {
      en: ["Black CuO gradually turns reddish-brown", "Water droplets condense in cooler part of tube", "Colour change confirms reduction of Cu²⁺ → Cu", "H₂ burns off at exit with blue flame"],
      as: ["ক’লা CuO ক্ৰমে ৰঙা-মুগা হয়", "টিউবৰ ঠাণ্ডা অংশত পানীৰ টোপাল ঘনীভূত হয়", "ৰং সলনিয়ে Cu²⁺ → Cu অপচয়ন নিশ্চিত কৰে", "প্ৰস্থানত H₂ নীলা শিখাৰে জ্বলে"],
    },
    redox: {
      oxidized: { en: "Hydrogen (H₂)", as: "হাইড্ৰ’জেন (H₂)" },
      reduced: { en: "Copper Oxide (CuO)", as: "তামা অক্সাইড (CuO)" },
      oxidizingAgent: { en: "Copper Oxide (CuO)", as: "তামা অক্সাইড (CuO)" },
      reducingAgent: { en: "Hydrogen (H₂)", as: "হাইড্ৰ’জেন (H₂)" },
      electronDonor: { en: "Hydrogen (H₂)", as: "হাইড্ৰ’জেন (H₂)" },
      electronAcceptor: { en: "CuO (Cu²⁺)", as: "CuO (Cu²⁺)" },
      oxNumChanges: [
        { species: "Cu", from: "+2", to: "0", color: "#60A5FA" },
        { species: "H",  from: "0",  to: "+1", color: "#FB923C" },
      ],
    },
    pmode: "reduction-steam",
    quiz: [
      { q: { en: "In CuO + H₂ → Cu + H₂O, which substance is reduced?", as: "CuO + H₂ → Cu + H₂O-ত কোন পদাৰ্থ অপচয়িত হয়?" }, opts: { en: ["H₂", "H₂O", "CuO", "Cu"], as: ["H₂", "H₂O", "CuO", "Cu"] }, ans: 2 },
      { q: { en: "What is the colour change observed?", as: "কি ৰং সলনি লক্ষ্য কৰা হয়?" }, opts: { en: ["Red to black", "Black to reddish-brown", "White to black", "Green to blue"], as: ["ৰঙাৰ পৰা ক’লা", "ক’লাৰ পৰা ৰঙা-মুগা", "বগাৰ পৰা ক’লা", "সেউজীয়াৰ পৰা নীলা"] }, ans: 1 },
      { q: { en: "Why is H₂ called the reducing agent?", as: "H₂ক অপচায়ক বুলি কিয় কোৱা হয়?" }, opts: { en: ["It gains oxygen", "It loses oxygen", "It removes oxygen from CuO", "It gains electrons"], as: ["ই অক্সিজেন লাভ কৰে", "ই অক্সিজেন হেৰুৱায়", "ই CuOৰ পৰা অক্সিজেন আঁতৰায়", "ই ইলেক্ট্ৰন লাভ কৰে"] }, ans: 2 },
      { q: { en: "What by-product forms in this reaction?", as: "এই বিক্ৰিয়াত কি উপজাত গঠিত হয়?" }, opts: { en: ["CO₂", "H₂O", "H₂SO₄", "CuSO₄"], as: ["CO₂", "H₂O", "H₂SO₄", "CuSO₄"] }, ans: 1 },
      { q: { en: "Why must H₂ flow BEFORE heating?", as: "উত্তাপৰ পূৰ্বে H₂ প্ৰবাহ কিয় হ’ব লাগিব?" }, opts: { en: ["To cool the tube", "To purge air and prevent explosion", "To oxidise CuO faster", "To remove water"], as: ["টিউব ঠাণ্ডা কৰিবলৈ", "বায়ু আঁতৰাই বিস্ফোৰণ ৰোধ কৰিবলৈ", "CuO দ্ৰুতভাৱে জাৰিত কৰিবলৈ", "পানী আঁতৰাবলৈ"] }, ans: 1 },
    ],
  },
  {
    id: "steam-iron", num: 3,
    title: { en: "Action of Steam on Iron", as: "লোহাত বাষ্পৰ ক্ৰিয়া" },
    subtitle: { en: "3Fe + 4H₂O → Fe₃O₄ + 4H₂", as: "3Fe + 4H₂O → Fe₃O₄ + 4H₂" },
    equation: "3Fe + 4H₂O → Fe₃O₄ + 4H₂↑",
    halfReactions: {
      ox: { en: "3Fe → Fe₃O₄ + 8e⁻ (Oxidation)", as: "3Fe → Fe₃O₄ + 8e⁻ (জাৰণ)" },
      red: { en: "4H₂O + 8e⁻ → 4H₂ + 4O²⁻ (Reduction)", as: "4H₂O + 8e⁻ → 4H₂ + 4O²⁻ (অপচয়ন)" },
    },
    accent: "#A78BFA", glow: "rgba(167,139,250,0.4)", gradFrom: "#6D28D9", gradTo: "#A78BFA", emoji: "♨️",
    hazard: "MEDIUM",
    description: {
      en: "Red-hot iron reacts with steam to form iron(II,III) oxide (Fe₃O₄ — black magnetic iron oxide) and hydrogen gas. Iron is oxidised, steam is reduced. This demonstrates oxidation of metals by steam at high temperature.",
      as: "ৰঙা-গৰম লোহাই বাষ্পৰ সৈতে বিক্ৰিয়া কৰি লোহা(II,III) অক্সাইড (Fe₃O₄ — ক’লা চুম্বকীয় লোহা অক্সাইড) আৰু হাইড্ৰ’জেন গেছ গঠন কৰে। লোহা জাৰিত হয়, বাষ্প অপচয়িত হয়। ই উচ্চ উষ্ণতাত বাষ্পৰ দ্বাৰা ধাতুৰ জাৰণ প্ৰদৰ্শন কৰে।",
    },
    realWorld: {
      en: "Industrial steam reforming · Rusting prevention · Magnetite formation · Water-gas shift reaction",
      as: "ঔদ্যোগিক বাষ্প পুনৰ্গঠন · মৰিচা ৰোধ · মেগনেটাইট গঠন · জল-গেছ স্থানান্তৰ বিক্ৰিয়া",
    },
    examNote: {
      en: "Fe is OXIDISED (0 → +⁸⁄₃ avg). H₂O is REDUCED (H: +1 → 0). Fe₃O₄ is black magnetic iron oxide. H₂ gas evolved — confirmed by pop test. This reaction only occurs at HIGH temperature (red-hot iron).",
      as: "Fe জাৰিত হয় (0 → +⁸⁄₃ গড়)। H₂O অপচয়িত হয় (H: +1 → 0)। Fe₃O₄ ক’লা চুম্বকীয় লোহা অক্সাইড। H₂ গেছ নিৰ্গত — পপ পৰীক্ষাৰে নিশ্চিত। এই বিক্ৰিয়া কেৱল উচ্চ উষ্ণতাত (ৰঙা-গৰম লোহা) হয়।",
    },
    safety: {
      en: ["Steam burns are severe — steam hotter than boiling water", "Red-hot iron — use tongs", "H₂ is flammable", "Wear heat-resistant gloves"],
      as: ["বাষ্পৰ পোৰা গুৰুতৰ — বাষ্প উতলা পানীতকৈ গৰম", "ৰঙা-গৰম লোহা — চিমটা ব্যৱহাৰ কৰক", "H₂ দাহ্য", "তাপ-প্ৰতিৰোধী দস্তানা পিন্ধক"],
    },
    steps: [
      { label: { en: "Heat Iron Filings", as: "লোহাৰ গুড়ি উত্তপ্ত কৰক" }, desc: { en: "Heat iron filings/wool to red-hot temperature in a glass/quartz tube. High temperature is essential.", as: "কাঁচ/কোৱাৰ্টজ টিউবত লোহাৰ গুড়ি/উলক ৰঙা-গৰম উষ্ণতালৈ উত্তপ্ত কৰক। উচ্চ উষ্ণতা অপৰিহাৰ্য।" } },
      { label: { en: "Pass Steam", as: "বাষ্প পাৰ কৰক" }, desc: { en: "Generate steam and pass it over the red-hot iron. Steam immediately begins to react.", as: "বাষ্প উৎপাদন কৰি ৰঙা-গৰম লোহাৰ ওপৰেদি পাৰ কৰক। বাষ্পই তৎক্ষণাৎ বিক্ৰিয়া আৰম্ভ কৰে।" } },
      { label: { en: "Collect Hydrogen", as: "হাইড্ৰ’জেন সংগ্ৰহ কৰক" }, desc: { en: "H₂ gas evolves from the reaction. Collect it over water. Test with burning splint — pop sound.", as: "বিক্ৰিয়াৰ পৰা H₂ গেছ নিৰ্গত হয়। ইয়াক পানীৰ ওপৰত সংগ্ৰহ কৰক। জ্বলন্ত চিপাৰে পৰীক্ষা কৰক — পপ শব্দ হয়।" } },
      { label: { en: "Observe Fe₃O₄", as: "Fe₃O₄ লক্ষ্য কৰক" }, desc: { en: "Iron becomes coated with black Fe₃O₄ (magnetite). This is iron in both +2 and +3 oxidation states.", as: "লোহা ক’লা Fe₃O₄ (মেগনেটাইট) আবৃত হয়। ই +2 আৰু +3 দুয়োটা জাৰণ অৱস্থাৰ লোহা।" } },
    ],
    observations: {
      en: ["Red-hot iron glows intensely", "Steam reacts immediately on contact", "H₂ gas collected (pop test positive)", "Black Fe₃O₄ (magnetite) coating forms on iron"],
      as: ["ৰঙা-গৰম লোহা তীব্ৰভাৱে জ্বলে", "স্পৰ্শতে বাষ্পই তৎক্ষণাৎ বিক্ৰিয়া কৰে", "H₂ গেছ সংগৃহীত (পপ পৰীক্ষা ধনাত্মক)", "লোহাত ক’লা Fe₃O₄ (মেগনেটাইট) আবৰণ গঠিত হয়"],
    },
    redox: {
      oxidized: { en: "Iron (Fe)", as: "লোহা (Fe)" },
      reduced: { en: "Steam (H₂O)", as: "বাষ্প (H₂O)" },
      oxidizingAgent: { en: "Steam (H₂O)", as: "বাষ্প (H₂O)" },
      reducingAgent: { en: "Iron (Fe)", as: "লোহা (Fe)" },
      electronDonor: { en: "Iron (Fe)", as: "লোহা (Fe)" },
      electronAcceptor: { en: "Water (H₂O)", as: "পানী (H₂O)" },
      oxNumChanges: [
        { species: "Fe", from: "0",  to: "+8/3", color: "#A78BFA" },
        { species: "H",  from: "+1", to: "0",    color: "#60A5FA" },
      ],
    },
    pmode: "steam-iron",
    quiz: [
      { q: { en: "Which gas is evolved when steam reacts with hot iron?", as: "বাষ্পই গৰম লোহাৰ সৈতে বিক্ৰিয়া কৰিলে কি গেছ নিৰ্গত হয়?" }, opts: { en: ["O₂", "CO₂", "H₂", "N₂"], as: ["O₂", "CO₂", "H₂", "N₂"] }, ans: 2 },
      { q: { en: "What iron oxide is formed in this reaction?", as: "এই বিক্ৰিয়াত কি লোহা অক্সাইড গঠিত হয়?" }, opts: { en: ["FeO", "Fe₂O₃", "Fe₃O₄", "FeO₂"], as: ["FeO", "Fe₂O₃", "Fe₃O₄", "FeO₂"] }, ans: 2 },
      { q: { en: "Which acts as the oxidising agent?", as: "জাৰক হিচাপে কোনে কাম কৰে?" }, opts: { en: ["Iron", "Fe₃O₄", "Steam (H₂O)", "H₂"], as: ["লোহা", "Fe₃O₄", "বাষ্প (H₂O)", "H₂"] }, ans: 2 },
      { q: { en: "Why is the reaction done at very high temperature?", as: "বিক্ৰিয়া অতি উচ্চ উষ্ণতাত কিয় কৰা হয়?" }, opts: { en: ["To prevent rust", "Iron only reacts with steam when red-hot", "To decompose water completely", "To purify iron"], as: ["মৰিচা ৰোধৰ বাবে", "লোহা ৰঙা-গৰম হ’লেহে বাষ্পৰ সৈতে বিক্ৰিয়া কৰে", "পানী সম্পূৰ্ণৰূপে বিযোজিত কৰিবলৈ", "লোহা শুদ্ধ কৰিবলৈ"] }, ans: 1 },
    ],
  },
  {
    id: "thermite", num: 4,
    title: { en: "Thermite Reaction", as: "থাৰ্মাইট বিক্ৰিয়া" },
    subtitle: { en: "Fe₂O₃ + 2Al → Al₂O₃ + 2Fe", as: "Fe₂O₃ + 2Al → Al₂O₃ + 2Fe" },
    equation: "Fe₂O₃ + 2Al → Al₂O₃ + 2Fe + Heat",
    halfReactions: {
      ox: { en: "2Al → 2Al³⁺ + 6e⁻ (Oxidation)", as: "2Al → 2Al³⁺ + 6e⁻ (জাৰণ)" },
      red: { en: "Fe₂O₃ + 6e⁻ → 2Fe + 3O²⁻ (Reduction)", as: "Fe₂O₃ + 6e⁻ → 2Fe + 3O²⁻ (অপচয়ন)" },
    },
    accent: "#FBBF24", glow: "rgba(251,191,36,0.5)", gradFrom: "#B45309", gradTo: "#FBBF24", emoji: "⚡",
    hazard: "EXTREME",
    description: {
      en: "Aluminium powder mixed with iron(III) oxide reacts in an extremely exothermic reaction producing molten iron and aluminium oxide. Temperatures reach ~2500°C. Used for welding railway tracks. Al is more reactive — displaces Fe from its oxide.",
      as: "এলুমিনিয়াম গুড়িৰ সৈতে লোহা(III) অক্সাইড মিহলোৱাত অত্যন্ত তাপমোচী বিক্ৰিয়া হয়, যাৰ ফলত গলিত লোহা আৰু এলুমিনিয়াম অক্সাইড উৎপন্ন হয়। উষ্ণতা ~২৫০০°C পৰ্যন্ত পায়। ৰে’ল লাইন ৱেল্ডিঙৰ বাবে ব্যৱহৃত। Al অধিক ক্ৰিয়াশীল — ইয়াৰ অক্সাইডৰ পৰা Fe প্ৰতিস্থাপন কৰে।",
    },
    realWorld: {
      en: "Railway track welding · Incendiary devices · Metal joining · Mining blasting",
      as: "ৰে’ল লাইন ৱেল্ডিং · অগ্নিকাণ্ডকাৰী যন্ত্ৰ · ধাতু যোজনা · খনি বিস্ফোৰণ",
    },
    examNote: {
      en: "Al is OXIDISED (0 → +3). Fe³⁺ is REDUCED (+3 → 0). Al is REDUCING AGENT (more reactive than Fe). Fe₂O₃ is OXIDISING AGENT. Extremely exothermic (~2500°C). Molten Fe produced. Used in THERMITE WELDING.",
      as: "Al জাৰিত হয় (0 → +3)। Fe³⁺ অপচয়িত হয় (+3 → 0)। Al হ’ল অপচায়ক (Fe-তকৈ অধিক ক্ৰিয়াশীল)। Fe₂O₃ হ’ল জাৰক। অত্যন্ত তাপমোচী (~২৫০০°C)। গলিত Fe উৎপন্ন। থাৰ্মাইট ৱেল্ডিঙত ব্যৱহৃত।",
    },
    safety: {
      en: ["EXTREMELY EXOTHERMIC — maintain safe distance", "Never touch ignited thermite — burns through steel", "Use protective blast shield", "Fire cannot be extinguished with water — sand only"],
      as: ["অত্যন্ত তাপমোচী — সুৰক্ষিত দূৰত্ব বজাই ৰাখক", "জ্বলন্ত থাৰ্মাইট কেতিয়াও স্পৰ্শ নকৰিব — ই ইস্পাত ভেদ কৰে", "সুৰক্ষাত্মক ব্লাষ্ট শ্বিল্ড ব্যৱহাৰ কৰক", "জুই পানীৰে নুমাব নোৱাৰি — কেৱল বালিৰে"],
    },
    steps: [
      { label: { en: "Prepare Mixture", as: "মিশ্ৰণ প্ৰস্তুত কৰক" }, desc: { en: "Mix iron(III) oxide (Fe₂O₃) powder with aluminium powder in 1:1 ratio in a crucible. Handle carefully.", as: "ক্ৰুচিবলত লোহা(III) অক্সাইড (Fe₂O₃) গুড়িৰ সৈতে এলুমিনিয়াম গুড়ি 1:1 অনুপাতত মিহলাওক। সাৱধানে পৰিচালনা কৰক।" } },
      { label: { en: "Safety Checks", as: "সুৰক্ষা পৰীক্ষা" }, desc: { en: "Deploy blast shield. Clear safe zone of 3 metres. Wear UV-protective goggles and heat shield.", as: "ব্লাষ্ট শ্বিল্ড স্থাপন কৰক। 3 মিটাৰ সুৰক্ষিত অঞ্চল ৰাখক। UV-প্ৰতিৰোধী চশমা আৰু তাপ শ্বিল্ড পিন্ধক।" } },
      { label: { en: "Ignite Reaction", as: "বিক্ৰিয়া জ্বলাওক" }, desc: { en: "Use magnesium ribbon as a fuse. Once lit, stand back — reaction is instantaneous and violent.", as: "ফিউজ হিচাপে মেগনেছিয়াম ফিটা ব্যৱহাৰ কৰক। জ্বলোৱাৰ পিছত পিছলৈ গুচি যাওক — বিক্ৰিয়া তৎক্ষণাৎ আৰু প্ৰচণ্ড।" } },
      { label: { en: "Observe Products", as: "উৎপাদ লক্ষ্য কৰক" }, desc: { en: "Brilliant white-hot reaction! Molten iron pours into the collection vessel. Al₂O₃ slag floats on top.", as: "উজ্জ্বল বগা-গৰম বিক্ৰিয়া! গলিত লোহা সংগ্ৰহ পাত্ৰত পৰে। Al₂O₃ ধ্বংসাৱশেষ ওপৰত ভাঁহে।" } },
    ],
    observations: {
      en: ["Brilliant white-hot flame (≥2500 °C)", "Intense light — do NOT look directly", "Molten iron (orange/red) drips below slag", "White Al₂O₃ slag floats on top of iron"],
      as: ["উজ্জ্বল বগা-গৰম শিখা (≥২৫০০°C)", "তীব্ৰ পোহৰ — পোনপটীয়াকৈ নাচাব", "গলিত লোহা (কমলা/ৰঙা) ধ্বংসাৱশেষৰ তলত পৰে", "বগা Al₂O₃ ধ্বংসাৱশেষ লোহাৰ ওপৰত ভাঁহে"],
    },
    redox: {
      oxidized: { en: "Aluminium (Al)", as: "এলুমিনিয়াম (Al)" },
      reduced: { en: "Iron Oxide (Fe₂O₃)", as: "লোহা অক্সাইড (Fe₂O₃)" },
      oxidizingAgent: { en: "Iron(III) Oxide (Fe₂O₃)", as: "লোহা(III) অক্সাইড (Fe₂O₃)" },
      reducingAgent: { en: "Aluminium (Al)", as: "এলুমিনিয়াম (Al)" },
      electronDonor: { en: "Aluminium (Al)", as: "এলুমিনিয়াম (Al)" },
      electronAcceptor: { en: "Fe³⁺ in Fe₂O₃", as: "Fe₂O₃-ত Fe³⁺" },
      oxNumChanges: [
        { species: "Al", from: "0",  to: "+3", color: "#FBBF24" },
        { species: "Fe", from: "+3", to: "0",  color: "#FB923C" },
      ],
    },
    pmode: "thermite",
    quiz: [
      { q: { en: "Which metal acts as the reducing agent in the thermite reaction?", as: "থাৰ্মাইট বিক্ৰিয়াত অপচায়ক হিচাপে কোন ধাতুৱে কাম কৰে?" }, opts: { en: ["Iron", "Aluminium", "Manganese", "Magnesium"], as: ["লোহা", "এলুমিনিয়াম", "মেংগানিজ", "মেগনেছিয়াম"] }, ans: 1 },
      { q: { en: "What is the molten product formed?", as: "কি গলিত উৎপাদ গঠিত হয়?" }, opts: { en: ["Al₂O₃", "Molten iron (Fe)", "FeO", "AlFe alloy"], as: ["Al₂O₃", "গলিত লোহা (Fe)", "FeO", "AlFe সংকৰ ধাতু"] }, ans: 1 },
      { q: { en: "Why is Al preferred over other metals in thermite?", as: "থাৰ্মাইটত অন্য ধাতুতকৈ Al কিয় পছন্দ কৰা হয়?" }, opts: { en: ["Al is cheapest", "Al is more reactive than Fe", "Al has lower melting point", "Al produces less heat"], as: ["Al সবাতোকৈ সস্তা", "Al, Fe-তকৈ অধিক ক্ৰিয়াশীল", "Al-ৰ গলনাংক কম", "Al কম তাপ উৎপন্ন কৰে"] }, ans: 1 },
      { q: { en: "This reaction is used industrially for:", as: "এই বিক্ৰিয়া ঔদ্যোগিকভাৱে ব্যৱহৃত হয়:" }, opts: { en: ["Making aluminium cans", "Welding railway tracks", "Producing oxygen", "Reducing pollution"], as: ["এলুমিনিয়াম কেন প্ৰস্তুত কৰিবলৈ", "ৰে’ল লাইন ৱেল্ডিঙৰ বাবে", "অক্সিজেন উৎপাদনৰ বাবে", "প্ৰদূষণ কমাবলৈ"] }, ans: 1 },
      { q: { en: "Temperature reached in thermite reaction is approximately:", as: "থাৰ্মাইট বিক্ৰিয়াত পোৱা উষ্ণতা প্ৰায়:" }, opts: { en: ["500 °C", "1000 °C", "1500 °C", "2500 °C"], as: ["500 °C", "1000 °C", "1500 °C", "2500 °C"] }, ans: 3 },
    ],
  },
  {
    id: "hcl-mno2", num: 5,
    title: { en: "HCl Oxidised by MnO₂", as: "MnO₂-ৰ দ্বাৰা HCl-ৰ জাৰণ" },
    subtitle: { en: "MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O", as: "MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O" },
    equation: "MnO₂ + 4HCl → MnCl₂ + Cl₂↑ + 2H₂O",
    halfReactions: {
      ox: { en: "2Cl⁻ → Cl₂ + 2e⁻ (Oxidation)", as: "2Cl⁻ → Cl₂ + 2e⁻ (জাৰণ)" },
      red: { en: "MnO₂ + 4H⁺ + 2e⁻ → Mn²⁺ + 2H₂O (Reduction)", as: "MnO₂ + 4H⁺ + 2e⁻ → Mn²⁺ + 2H₂O (অপচয়ন)" },
    },
    accent: "#86EFAC", glow: "rgba(134,239,172,0.4)", gradFrom: "#166534", gradTo: "#86EFAC", emoji: "🟢",
    hazard: "HIGH",
    description: {
      en: "Manganese dioxide oxidises hydrochloric acid — the Cl⁻ ions are oxidised to Cl₂ gas. MnO₂ acts as oxidising agent, HCl acts as reducing agent. Greenish-yellow chlorine gas is produced.",
      as: "মেংগানিজ ডাইঅক্সাইডে হাইড্ৰ’ক্ল’ৰিক এচিড জাৰিত কৰে — Cl⁻ আয়ন Cl₂ গেছলৈ জাৰিত হয়। MnO₂ জাৰক হিচাপে আৰু HCl অপচায়ক হিচাপে কাম কৰে। সেউজীয়া-হালধীয়া ক্ল’ৰিন গেছ উৎপন্ন হয়।",
    },
    realWorld: {
      en: "Chlorine gas production · Bleaching agents · Dry cell batteries (MnO₂ electrode) · Water purification",
      as: "ক্ল’ৰিন গেছ উৎপাদন · ব্লিচিং এজেণ্ট · শুকান কোষ বেটাৰী (MnO₂ ইলেক্ট্ৰ’ড) · পানী শুদ্ধিকৰণ",
    },
    examNote: {
      en: "HCl is OXIDISED (Cl⁻: −1 → 0). MnO₂ is REDUCED (Mn: +4 → +2). MnO₂ is OXIDISING AGENT. HCl is REDUCING AGENT. Cl₂ is greenish-yellow and toxic. Must work in fume hood.",
      as: "HCl জাৰিত হয় (Cl⁻: −1 → 0)। MnO₂ অপচয়িত হয় (Mn: +4 → +2)। MnO₂ হ’ল জাৰক। HCl হ’ল অপচায়ক। Cl₂ সেউজীয়া-হালধীয়া আৰু বিষাক্ত। ফিউম হুডতহে কাম কৰিব লাগে।",
    },
    safety: {
      en: ["Cl₂ is TOXIC — work in fume hood only", "Concentrated HCl causes burns", "Wear chemical-resistant gloves and face shield", "Keep Cl₂ away from eyes and lungs"],
      as: ["Cl₂ বিষাক্ত — কেৱল ফিউম হুডত কাম কৰক", "ঘন HCl-এ পোৰে", "ৰাসায়নিক-প্ৰতিৰোধী দস্তানা আৰু মুখ আবৰণ পিন্ধক", "Cl₂ চকু আৰু হাঁওফাঁওৰ পৰা আঁতৰত ৰাখক"],
    },
    steps: [
      { label: { en: "Set Up Flask", as: "ফ্লাস্ক সাজু কৰক" }, desc: { en: "Add MnO₂ (black powder) to a round-bottom flask. Fit with gas delivery tube connected to collection vessel.", as: "এটা গোলাকাৰ-তলযুক্ত ফ্লাস্কত MnO₂ (ক’লা গুড়ি) যোগ কৰক। সংগ্ৰহ পাত্ৰৰ সৈতে সংযুক্ত গেছ পৰিৱহন টিউব লগাওক।" } },
      { label: { en: "Add Conc. HCl", as: "ঘন HCl যোগ কৰক" }, desc: { en: "Add concentrated HCl through thistle tube. Immediate reaction at room temp; heat if needed.", as: "থিচল টিউবৰ মাজেদি ঘন HCl যোগ কৰক। কোঠাৰ উষ্ণতাত তৎক্ষণাৎ বিক্ৰিয়া; প্ৰয়োজন হ’লে উত্তপ্ত কৰক।" } },
      { label: { en: "Observe Cl₂ Gas", as: "Cl₂ গেছ লক্ষ্য কৰক" }, desc: { en: "Greenish-yellow Cl₂ gas evolves. It has a pungent, suffocating smell. Collect carefully.", as: "সেউজীয়া-হালধীয়া Cl₂ গেছ নিৰ্গত হয়। ইয়াৰ এক উগ্ৰ, শ্বাসৰোধী গন্ধ আছে। সাৱধানে সংগ্ৰহ কৰক।" } },
      { label: { en: "Confirm Chlorine", as: "ক্ল’ৰিন নিশ্চিত কৰক" }, desc: { en: "Cl₂ bleaches damp litmus paper (turns colourless). MnCl₂ (pale pink) remains in solution.", as: "Cl₂-এ তিতা লিটমাছ কাগজ ব্লিচ কৰে (বৰ্ণহীন হয়)। MnCl₂ (পাতল গোলাপী) সমাধানত থাকে।" } },
    ],
    observations: {
      en: ["Greenish-yellow Cl₂ gas visible", "Pungent, suffocating smell (toxic)", "Damp litmus paper bleached (turns colourless)", "MnO₂ (black) gradually disappears — MnCl₂ (pale pink) forms"],
      as: ["সেউজীয়া-হালধীয়া Cl₂ গেছ দেখা যায়", "উগ্ৰ, শ্বাসৰোধী গন্ধ (বিষাক্ত)", "তিতা লিটমাছ কাগজ ব্লিচ হয় (বৰ্ণহীন)", "MnO₂ (ক’লা) ক্ৰমে অদৃশ্য হয় — MnCl₂ (পাতল গোলাপী) গঠিত হয়"],
    },
    redox: {
      oxidized: { en: "HCl (Cl⁻ ions)", as: "HCl (Cl⁻ আয়ন)" },
      reduced: { en: "MnO₂ (Mn)", as: "MnO₂ (Mn)" },
      oxidizingAgent: { en: "Manganese Dioxide (MnO₂)", as: "মেংগানিজ ডাইঅক্সাইড (MnO₂)" },
      reducingAgent: { en: "Hydrochloric Acid (HCl)", as: "হাইড্ৰ’ক্ল’ৰিক এচিড (HCl)" },
      electronDonor: { en: "Cl⁻ in HCl", as: "HCl-ত Cl⁻" },
      electronAcceptor: { en: "Mn⁴⁺ in MnO₂", as: "MnO₂-ত Mn⁴⁺" },
      oxNumChanges: [
        { species: "Cl", from: "−1", to: "0",  color: "#86EFAC" },
        { species: "Mn", from: "+4", to: "+2", color: "#60A5FA" },
      ],
    },
    pmode: "chlorine-gas",
    quiz: [
      { q: { en: "Which gas is evolved when MnO₂ reacts with conc. HCl?", as: "MnO₂-এ ঘন HCl-ৰ সৈতে বিক্ৰিয়া কৰিলে কি গেছ নিৰ্গত হয়?" }, opts: { en: ["HCl gas", "H₂", "Cl₂", "O₂"], as: ["HCl গেছ", "H₂", "Cl₂", "O₂"] }, ans: 2 },
      { q: { en: "Which substance acts as the oxidising agent?", as: "জাৰক হিচাপে কোন পদাৰ্থই কাম কৰে?" }, opts: { en: ["HCl", "MnCl₂", "H₂O", "MnO₂"], as: ["HCl", "MnCl₂", "H₂O", "MnO₂"] }, ans: 3 },
      { q: { en: "What is the colour of chlorine gas?", as: "ক্ল’ৰিন গেছৰ ৰং কি?" }, opts: { en: ["Red-brown", "Colourless", "Greenish-yellow", "White"], as: ["ৰঙা-মুগা", "বৰ্ণহীন", "সেউজীয়া-হালধীয়া", "বগা"] }, ans: 2 },
      { q: { en: "Oxidation number of Mn changes from:", as: "Mn-ৰ জাৰণ সংখ্যা সলনি হয়:" }, opts: { en: ["+2 to +4", "+4 to +2", "0 to +4", "+4 to 0"], as: ["+2-ৰ পৰা +4", "+4-ৰ পৰা +2", "0-ৰ পৰা +4", "+4-ৰ পৰা 0"] }, ans: 1 },
      { q: { en: "How is Cl₂ detected in this experiment?", as: "এই পৰীক্ষাত Cl₂ কেনেকৈ চিনাক্ত কৰা হয়?" }, opts: { en: ["Lime water test", "Bleaches damp litmus paper", "Burns with pop sound", "Turns blue litmus red"], as: ["চূনপানী পৰীক্ষা", "তিতা লিটমাছ কাগজ ব্লিচ কৰে", "পপ শব্দেৰে জ্বলে", "নীলা লিটমাছ ৰঙা কৰে"] }, ans: 1 },
    ],
  },
  {
    id: "h2s-combustion", num: 6,
    title: { en: "Combustion of H₂S", as: "H₂S-ৰ দহন" },
    subtitle: { en: "2H₂S + 3O₂ → 2SO₂ + 2H₂O", as: "2H₂S + 3O₂ → 2SO₂ + 2H₂O" },
    equation: "2H₂S + 3O₂ → 2SO₂↑ + 2H₂O",
    halfReactions: {
      ox: { en: "S²⁻ → S⁴⁺ + 6e⁻ (Oxidation)", as: "S²⁻ → S⁴⁺ + 6e⁻ (জাৰণ)" },
      red: { en: "O₂ + 4e⁻ → 2O²⁻ (Reduction)", as: "O₂ + 4e⁻ → 2O²⁻ (অপচয়ন)" },
    },
    accent: "#F59E0B", glow: "rgba(245,158,11,0.4)", gradFrom: "#92400E", gradTo: "#F59E0B", emoji: "🔵",
    hazard: "HIGH",
    description: {
      en: "Hydrogen sulphide burns in oxygen with a characteristic pale blue flame to form sulphur dioxide (SO₂) and water. Sulphur is oxidised (+4 in SO₂) from −2 in H₂S. Oxygen is the oxidising agent.",
      as: "হাইড্ৰ’জেন ছালফাইডে অক্সিজেনত এক চিনাকি পাতল নীলা শিখাৰে জ্বলি ছালফাৰ ডাইঅক্সাইড (SO₂) আৰু পানী গঠন কৰে। ছালফাৰ H₂S-ত −2-ৰ পৰা জাৰিত হয় (SO₂-ত +4)। অক্সিজেন জাৰক।",
    },
    realWorld: {
      en: "Natural gas purification · Sulphuric acid production (via SO₂) · Volcanic gas reactions · Industrial waste treatment",
      as: "প্ৰাকৃতিক গেছ শুদ্ধিকৰণ · ছালফিউৰিক এচিড উৎপাদন (SO₂-ৰ জৰিয়তে) · আগ্নেয়গিৰি গেছ বিক্ৰিয়া · ঔদ্যোগিক বৰ্জ্য পৰিশোধন",
    },
    examNote: {
      en: "S in H₂S is OXIDISED (−2 → +4). O₂ is REDUCED (0 → −2). O₂ is OXIDISING AGENT. H₂S is REDUCING AGENT. Blue flame characteristic of H₂S combustion. SO₂ is toxic with a pungent smell. SO₂ turns acidic dichromate green.",
      as: "H₂S-ত S জাৰিত হয় (−2 → +4)। O₂ অপচয়িত হয় (0 → −2)। O₂ হ’ল জাৰক। H₂S হ’ল অপচায়ক। H₂S দহনৰ চিনাকি নীলা শিখা। SO₂ উগ্ৰ গন্ধৰ সৈতে বিষাক্ত। SO₂-এ অম্লীয় ডাইক্ৰ’মেট সেউজীয়া কৰে।",
    },
    safety: {
      en: ["H₂S is TOXIC and EXPLOSIVE", "Work in fume hood only", "Detector required — rotten egg smell at low conc.", "SO₂ is also toxic — respiratory hazard"],
      as: ["H₂S বিষাক্ত আৰু বিস্ফোৰক", "কেৱল ফিউম হুডত কাম কৰক", "ডিটেক্টৰ প্ৰয়োজন — কম ঘনত্বতো পচা কণীৰ গন্ধ", "SO₂ও বিষাক্ত — শ্বাস-প্ৰশ্বাসৰ বিপদ"],
    },
    steps: [
      { label: { en: "Prepare H₂S", as: "H₂S প্ৰস্তুত কৰক" }, desc: { en: "Generate H₂S gas from iron sulphide and dilute H₂SO₄. Note characteristic rotten-egg smell even at low concentrations.", as: "লোহা ছালফাইড আৰু পাতল H₂SO₄-ৰ পৰা H₂S গেছ উৎপন্ন কৰক। কম ঘনত্বতো চিনাকি পচা কণীৰ গন্ধ লক্ষ্য কৰক।" } },
      { label: { en: "Safety Check", as: "সুৰক্ষা পৰীক্ষা" }, desc: { en: "Ensure fume hood is ON. H₂S detector active. All personnel wearing appropriate PPE. Flame sources controlled.", as: "ফিউম হুড অন থকাটো নিশ্চিত কৰক। H₂S ডিটেক্টৰ সক্ৰিয়। সকলোৱে উপযুক্ত PPE পিন্ধি থকাটো। শিখাৰ উৎস নিয়ন্ত্ৰিত।" } },
      { label: { en: "Ignite H₂S", as: "H₂S জ্বলাওক" }, desc: { en: "Carefully bring a lighted splint near H₂S outlet. Gas ignites with a pale BLUE flame. Combustion begins.", as: "সাৱধানে এটা জ্বলন্ত চিপা H₂S প্ৰস্থানৰ ওচৰলৈ আনক। গেছে পাতল নীলা শিখাৰে জ্বলে। দহন আৰম্ভ হয়।" } },
      { label: { en: "Identify Products", as: "উৎপাদ চিনাক্ত কৰক" }, desc: { en: "SO₂ (pungent gas) and H₂O vapour produced. Test: SO₂ turns K₂Cr₂O₇ paper from orange to green.", as: "SO₂ (উগ্ৰ গেছ) আৰু H₂O বাষ্প উৎপন্ন হয়। পৰীক্ষা: SO₂-এ K₂Cr₂O₇ কাগজ কমলাৰ পৰা সেউজীয়া কৰে।" } },
    ],
    observations: {
      en: ["Pale blue flame — characteristic of H₂S combustion", "Pungent SO₂ gas produced (sulphur dioxide smell)", "Water vapour condenses near flame", "K₂Cr₂O₇ paper turns green (SO₂ confirmed)"],
      as: ["পাতল নীলা শিখা — H₂S দহনৰ চিনাকি", "উগ্ৰ SO₂ গেছ উৎপন্ন (ছালফাৰ ডাইঅক্সাইড গন্ধ)", "শিখাৰ ওচৰত জলীয় বাষ্প ঘনীভূত হয়", "K₂Cr₂O₇ কাগজ সেউজীয়া হয় (SO₂ নিশ্চিত)"],
    },
    redox: {
      oxidized: { en: "Sulphur in H₂S", as: "H₂S-ত ছালফাৰ" },
      reduced: { en: "Oxygen (O₂)", as: "অক্সিজেন (O₂)" },
      oxidizingAgent: { en: "Oxygen (O₂)", as: "অক্সিজেন (O₂)" },
      reducingAgent: { en: "Hydrogen Sulphide (H₂S)", as: "হাইড্ৰ’জেন ছালফাইড (H₂S)" },
      electronDonor: { en: "S²⁻ in H₂S", as: "H₂S-ত S²⁻" },
      electronAcceptor: { en: "O₂", as: "O₂" },
      oxNumChanges: [
        { species: "S", from: "−2", to: "+4", color: "#F59E0B" },
        { species: "O", from: "0",  to: "−2", color: "#60A5FA" },
      ],
    },
    pmode: "h2s-flame",
    quiz: [
      { q: { en: "What colour is the flame of burning H₂S?", as: "জ্বলন্ত H₂S-ৰ শিখাৰ ৰং কি?" }, opts: { en: ["Yellow", "Red-orange", "Pale blue", "Green"], as: ["হালধীয়া", "ৰঙা-কমলা", "পাতল নীলা", "সেউজীয়া"] }, ans: 2 },
      { q: { en: "Which gas is produced when H₂S burns in O₂?", as: "H₂S অক্সিজেনত জ্বলিলে কি গেছ উৎপন্ন হয়?" }, opts: { en: ["H₂O only", "SO₃", "SO₂ and H₂O", "H₂SO₄"], as: ["কেৱল H₂O", "SO₃", "SO₂ আৰু H₂O", "H₂SO₄"] }, ans: 2 },
      { q: { en: "In 2H₂S + 3O₂ → 2SO₂ + 2H₂O, sulphur is:", as: "2H₂S + 3O₂ → 2SO₂ + 2H₂O-ত ছালফাৰ:" }, opts: { en: ["Reduced (−2 → −4)", "Oxidised (−2 → +4)", "Unchanged", "Reduced (0 → −2)"], as: ["অপচয়িত (−2 → −4)", "জাৰিত (−2 → +4)", "অপৰিবৰ্তিত", "অপচয়িত (0 → −2)"] }, ans: 1 },
      { q: { en: "Which acts as the reducing agent?", as: "অপচায়ক হিচাপে কোনে কাম কৰে?" }, opts: { en: ["O₂", "H₂O", "SO₂", "H₂S"], as: ["O₂", "H₂O", "SO₂", "H₂S"] }, ans: 3 },
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
      const cx = W / 2, base = H * 0.65;

      const add = (p: Omit<Particle, "life"> & { life?: number }) =>
        particles.current.push({ life: p.maxLife, ...p });

      switch (mode) {
        case "oxidation-heat":
          // Orange/red glow + oxidation sparks
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 35 + Math.random() * 25;
            add({ x: cx + (Math.random() - .5) * 22, y: base, vx: (Math.random() - .5) * 2.5, vy: -(2 + Math.random() * 4), maxLife: life, size: 2 + Math.random() * 4, color: ["#FF4500","#FF6B35","#FB923C","#FDE047","#FF8C00"][Math.floor(Math.random() * 5)], blur: 16, type: "fire" });
          }
          if (Math.random() < 0.4 * intensity) {
            const angle = Math.random() * Math.PI; const speed = 2 + Math.random() * 4;
            add({ x: cx + (Math.random() - .5) * 18, y: base - 10, vx: Math.cos(angle) * speed, vy: -Math.abs(Math.sin(angle)) * speed - 1, maxLife: 18 + Math.random() * 12, size: 1.5, color: "#FFFFFF", blur: 12, type: "spark" });
          }
          break;

        case "reduction-steam":
          // Blue hydrogen glow + steam condensation
          for (let i = 0; i < Math.ceil(2 * intensity); i++) {
            const life = 50 + Math.random() * 40;
            add({ x: cx + (Math.random() - .5) * 20, y: base, vx: (Math.random() - .5) * 1.5, vy: -(1.5 + Math.random() * 3), maxLife: life, size: 3 + Math.random() * 5, color: `rgba(147,197,253,${0.3 + Math.random() * 0.3})`, blur: 7, type: "steam" });
          }
          if (Math.random() < 0.3 * intensity) {
            add({ x: cx + (Math.random() - .5) * 14, y: base + 5, vx: (Math.random() - .5) * 1.5, vy: -(1.5 + Math.random() * 2.5), maxLife: 28 + Math.random() * 18, size: 2 + Math.random() * 3, color: "#60A5FA", blur: 14, type: "fire" });
          }
          break;

        case "steam-iron":
          // White steam flow + H₂ bubbles
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 70 + Math.random() * 50;
            add({ x: cx + (Math.random() - .5) * 35, y: base - 10, vx: (Math.random() - .5) * 1.8, vy: -(1 + Math.random() * 2.5), maxLife: life, size: 6 + Math.random() * 10, color: `rgba(220,230,255,${0.25 + Math.random() * 0.25})`, blur: 6, type: "steam" });
          }
          // Iron glow
          for (let i = 0; i < Math.ceil(2 * intensity); i++) {
            add({ x: cx + (Math.random() - .5) * 16, y: base, vx: (Math.random() - .5) * 2, vy: -(2 + Math.random() * 3), maxLife: 30 + Math.random() * 20, size: 2 + Math.random() * 3, color: "#EF4444", blur: 14, type: "fire" });
          }
          break;

        case "thermite":
          // Explosive white-hot sparks + molten metal
          for (let i = 0; i < Math.ceil(6 * intensity); i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 9;
            const life = 25 + Math.random() * 20;
            add({ x: cx + (Math.random() - .5) * 25, y: base, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 5, maxLife: life, size: 1.5 + Math.random() * 3, color: ["#FFFFFF","#FEF08A","#FDE047","#FBBF24","#FF6B35"][Math.floor(Math.random() * 5)], blur: 20, type: "spark" });
          }
          // Molten iron glow
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            add({ x: cx + (Math.random() - .5) * 20, y: base + 15 + Math.random() * 20, vx: (Math.random() - .5) * 1, vy: 0.5 + Math.random() * 1.5, maxLife: 60 + Math.random() * 40, size: 4 + Math.random() * 6, color: "#FB923C", blur: 10, type: "molten" });
          }
          // White core flash
          if (Math.random() < 0.5 * intensity) {
            add({ x: cx + (Math.random() - .5) * 15, y: base - 10, vx: (Math.random() - .5) * 3, vy: -(3 + Math.random() * 5), maxLife: 15 + Math.random() * 10, size: 5 + Math.random() * 8, color: "#FFFFFF", blur: 30, type: "flash" });
          }
          break;

        case "chlorine-gas":
          // Greenish-yellow chlorine cloud
          for (let i = 0; i < Math.ceil(3 * intensity); i++) {
            const life = 90 + Math.random() * 60;
            add({ x: cx + (Math.random() - .5) * 30, y: base - 15, vx: (Math.random() - .5) * 2, vy: -(0.8 + Math.random() * 1.5), maxLife: life, size: 8 + Math.random() * 14, color: `rgba(${140 + Math.floor(Math.random()*40)},${200 + Math.floor(Math.random()*30)},0,${0.2 + Math.random() * 0.2})`, blur: 8, type: "cloud" });
          }
          // Bubbling in acid
          if (Math.random() < 0.5 * intensity) {
            add({ x: cx + (Math.random() - .5) * 40, y: base + 15, vx: (Math.random() - .5) * 0.8, vy: -(1 + Math.random() * 2), maxLife: 50 + Math.random() * 30, size: 2.5 + Math.random() * 3, color: `rgba(200,240,100,0.5)`, blur: 5, type: "bubble" });
          }
          break;

        case "h2s-flame":
          // Pale blue flame
          for (let i = 0; i < Math.ceil(4 * intensity); i++) {
            const life = 30 + Math.random() * 22;
            add({ x: cx + (Math.random() - .5) * 12, y: base, vx: (Math.random() - .5) * 1.8, vy: -(2.5 + Math.random() * 4), maxLife: life, size: 2 + Math.random() * 4, color: ["#60A5FA","#38BDF8","#93C5FD","#BFDBFE","#2563EB"][Math.floor(Math.random() * 5)], blur: 18, type: "fire" });
          }
          // SO₂ smoke
          if (Math.random() < 0.35 * intensity) {
            const life = 80 + Math.random() * 50;
            add({ x: cx + (Math.random() - .5) * 14, y: base - 35, vx: (Math.random() - .5) * 1.2, vy: -(0.8 + Math.random() * 1.2), maxLife: life, size: 7 + Math.random() * 9, color: `rgba(180,200,130,${0.2 + Math.random() * 0.2})`, blur: 5, type: "smoke" });
          }
          break;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawn();
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        const t = p.life / p.maxLife;
        let alpha = t;
        if (p.type === "steam" || p.type === "smoke" || p.type === "cloud") alpha = Math.sin(t * Math.PI) * 0.65;
        if (p.type === "bubble") alpha = t < 0.15 ? t / 0.15 * 0.7 : t * 0.7;
        if (p.type === "molten") alpha = t < 0.2 ? t / 0.2 * 0.8 : t * 0.8;
        if (p.type === "flash") alpha = t;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowBlur = p.blur;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const r = (p.type === "steam" || p.type === "cloud" || p.type === "smoke") ? p.size * (1.4 - t * 0.5) : p.size;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (p.type === "bubble") { ctx.globalAlpha = alpha * 0.4; ctx.strokeStyle = p.color; ctx.lineWidth = 0.8; ctx.stroke(); }
        ctx.restore();

        p.x += p.vx; p.y += p.vy;
        if (p.type === "fire" || p.type === "spark" || p.type === "flash") { p.vx *= 0.97; p.vy -= 0.06; }
        if (p.type === "molten") { p.vy += 0.1; p.vx *= 0.98; }
        if (p.type === "bubble") { p.vx += (Math.random() - .5) * 0.1; p.vy *= 0.99; }
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
// APPARATUS SVG
// ═══════════════════════════════════════════════════════════

function ApparatusSVG({ exp, phase }: { exp: Exp; phase: Phase }) {
  const hot = phase === "reacting" || phase === "complete";

  if (exp.id === "cu-oxidation") {
    return (
      <svg viewBox="0 0 300 220" className="w-full h-full">
        <rect x="20" y="205" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Stand */}
        <line x1="150" y1="205" x2="110" y2="205" stroke="#475569" strokeWidth="2.5" />
        <line x1="110" y1="205" x2="95" y2="188" stroke="#475569" strokeWidth="2.5" />
        <line x1="150" y1="205" x2="190" y2="205" stroke="#475569" strokeWidth="2.5" />
        <line x1="190" y1="205" x2="205" y2="188" stroke="#475569" strokeWidth="2.5" />
        {/* Crucible ring */}
        <ellipse cx="150" cy="148" rx="28" ry="7" fill="none" stroke="#64748b" strokeWidth="3" />
        <line x1="150" y1="141" x2="150" y2="188" stroke="#64748b" strokeWidth="2.5" />
        {/* Crucible */}
        <path d="M128,148 Q128,175 150,177 Q172,175 172,148" fill={hot ? "rgba(251,146,60,0.2)" : "rgba(99,99,99,0.15)"} stroke="#94a3b8" strokeWidth="1.5" />
        {/* Copper — changes from orange to black */}
        <ellipse cx="150" cy="168" rx="14" ry="5" fill={hot ? "#292524" : "#B45309"}>
          {hot && <animate attributeName="fill" from="#B45309" to="#292524" dur="3s" fill="freeze" />}
        </ellipse>
        {/* Glow */}
        {hot && <ellipse cx="150" cy="155" rx="35" ry="22" fill="#FB923C" opacity="0.08"><animate attributeName="opacity" values="0.08;0.18;0.08" dur="1s" repeatCount="indefinite" /></ellipse>}
        {/* Burner */}
        <rect x="138" y="188" width="24" height="14" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <rect x="143" y="184" width="14" height="6" rx="2" fill="#334155" />
        <path d="M138,198 Q110,198 110,218" fill="none" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
        {/* O₂ label */}
        <text x="220" y="155" fill="#60A5FA" fontSize="10" fontWeight="bold">O₂</text>
        <path d="M215,158 Q195,165 175,165" fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="150" y="218" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">COPPER OXIDATION</text>
      </svg>
    );
  }

  if (exp.id === "cuo-reduction") {
    return (
      <svg viewBox="0 0 300 220" className="w-full h-full">
        <rect x="20" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Hard glass tube */}
        <rect x="50" y="80" width="200" height="26" rx="6" fill={hot ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.03)"} stroke="#94a3b8" strokeWidth="1.5" />
        {/* CuO → Cu inside tube */}
        <rect x="110" y="86" width="80" height="14" rx="3" fill={hot ? "#B45309" : "#292524"}>
          {hot && <animate attributeName="fill" from="#292524" to="#B45309" dur="4s" fill="freeze" />}
        </rect>
        <text x="150" y="97" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontWeight="bold">CuO → Cu</text>
        {/* H₂ inlet left */}
        <rect x="22" y="87" width="28" height="12" rx="3" fill="#1e293b" stroke="#60A5FA" strokeWidth="1.5" />
        <text x="36" y="96" textAnchor="middle" fill="#60A5FA" fontSize="8" fontWeight="bold">H₂</text>
        {/* H₂O condenser right */}
        <rect x="250" y="87" width="30" height="12" rx="3" fill="rgba(96,165,250,0.1)" stroke="#64748b" strokeWidth="1.5" />
        <text x="265" y="96" textAnchor="middle" fill="#94a3b8" fontSize="7">H₂O</text>
        {/* Water droplets in cool zone */}
        {hot && [256,262,268].map((x, i) => (
          <circle key={i} cx={x} cy={100 + i * 8} r="2.5" fill="#60A5FA" opacity="0.6"><animate attributeName="cy" from="88" to={115 + i * 5} dur={`${0.8 + i * 0.2}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" /></circle>
        ))}
        {/* Bunsen burner */}
        <rect x="128" y="130" width="44" height="16" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <rect x="136" y="126" width="28" height="6" rx="2" fill="#334155" />
        <path d="M128,142 Q100,145 100,165" fill="none" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
        {hot && <ellipse cx="150" cy="107" rx="45" ry="18" fill="#60A5FA" opacity="0.05"><animate attributeName="opacity" values="0.05;0.1;0.05" dur="1s" repeatCount="indefinite" /></ellipse>}
        <text x="150" y="218" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">CuO REDUCTION WITH H₂</text>
      </svg>
    );
  }

  if (exp.id === "thermite") {
    return (
      <svg viewBox="0 0 300 220" className="w-full h-full">
        <rect x="20" y="208" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Crucible on stand */}
        <line x1="150" y1="208" x2="110" y2="208" stroke="#475569" strokeWidth="2.5" />
        <line x1="110" y1="208" x2="95" y2="192" stroke="#475569" strokeWidth="2.5" />
        <line x1="150" y1="208" x2="190" y2="208" stroke="#475569" strokeWidth="2.5" />
        <line x1="190" y1="208" x2="205" y2="192" stroke="#475569" strokeWidth="2.5" />
        <ellipse cx="150" cy="152" rx="35" ry="8" fill="none" stroke="#64748b" strokeWidth="3" />
        <line x1="150" y1="144" x2="150" y2="192" stroke="#64748b" strokeWidth="2.5" />
        {/* Crucible body */}
        <path d="M120,152 Q118,185 150,188 Q182,185 180,152" fill={hot ? "rgba(251,191,36,0.25)" : "rgba(99,99,99,0.15)"} stroke="#94a3b8" strokeWidth="2" />
        {/* Thermite mixture or molten iron */}
        {!hot ? (
          <ellipse cx="150" cy="178" rx="22" ry="7" fill="#713F12" opacity="0.8" />
        ) : (
          <>
            <ellipse cx="150" cy="178" rx="22" ry="7" fill="#FB923C" opacity="0.9">
              <animate attributeName="fill" values="#FB923C;#FBBF24;#FB923C" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="150" cy="186" rx="16" ry="5" fill="#F8FAFC" opacity="0.5" />
          </>
        )}
        {/* Blast shield */}
        <rect x="230" y="110" width="8" height="90" rx="3" fill="#1e293b" stroke={hot ? "#EF4444" : "#334155"} strokeWidth="1.5" />
        <text x="242" y="155" fill={hot ? "#EF4444" : "#475569"} fontSize="7" fontWeight="bold">⚠️</text>
        {/* Intense glow */}
        {hot && <ellipse cx="150" cy="160" rx="60" ry="40" fill="#FBBF24" opacity="0.12"><animate attributeName="opacity" values="0.12;0.3;0.12" dur="0.5s" repeatCount="indefinite" /></ellipse>}
        <text x="150" y="218" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">THERMITE REACTION — BLAST SHIELD DEPLOYED</text>
      </svg>
    );
  }

  if (exp.id === "hcl-mno2") {
    return (
      <svg viewBox="0 0 300 220" className="w-full h-full">
        <rect x="20" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Round flask */}
        <circle cx="120" cy="145" r="40" fill={hot ? "rgba(134,239,172,0.1)" : "rgba(255,255,255,0.03)"} stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="112" y="98" width="16" height="30" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
        {/* MnO₂ inside */}
        <ellipse cx="120" cy="165" rx="20" ry="6" fill={hot ? "#4B5563" : "#1C1917"} opacity="0.8" />
        {/* HCl level */}
        {hot && <path d="M83,145 Q83,178 120,180 Q157,178 157,145 Z" fill="rgba(248,250,252,0.15)" />}
        {/* Gas delivery tube */}
        <path d="M120,98 Q165,60 195,60" fill="none" stroke="#64748b" strokeWidth="2" />
        {/* Collection flask for Cl₂ */}
        <rect x="185" y="45" width="60" height="70" rx="8" fill={hot ? "rgba(134,239,172,0.12)" : "rgba(255,255,255,0.03)"} stroke="#64748b" strokeWidth="1.5" />
        {hot && <text x="215" y="88" textAnchor="middle" fill="#86EFAC" fontSize="9" fontWeight="bold">Cl₂</text>}
        {/* Burner */}
        <rect x="100" y="190" width="40" height="14" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        {/* Thistle tube for HCl */}
        <path d="M128,98 L128,50 Q128,35 135,30" fill="none" stroke="#475569" strokeWidth="2" />
        <circle cx="135" cy="28" r="8" fill="rgba(248,250,252,0.1)" stroke="#475569" strokeWidth="1.5" />
        <text x="145" y="30" fill="#94a3b8" fontSize="7">HCl</text>
        {hot && <ellipse cx="215" cy="80" rx="25" ry="20" fill="#86EFAC" opacity="0.07"><animate attributeName="opacity" values="0.07;0.15;0.07" dur="1.5s" repeatCount="indefinite" /></ellipse>}
        <text x="150" y="218" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">MnO₂ + HCl → Cl₂ GAS</text>
      </svg>
    );
  }

  // Default: generic heated test tube (steam-iron, h2s-combustion, cuo-reduction fallback)
  const flameColor = exp.id === "h2s-combustion" ? "#60A5FA" : exp.id === "steam-iron" ? "#EF4444" : "#FB923C";
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      <rect x="20" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Test tube */}
      <path d="M120,55 L120,165 Q120,182 150,183 Q180,182 180,165 L180,55 Z" fill="rgba(255,255,255,0.03)" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Contents */}
      <path d="M122,130 L122,165 Q122,180 150,181 Q178,180 178,165 L178,130 Z"
        fill={exp.id === "steam-iron" ? (hot ? "rgba(167,139,250,0.2)" : "rgba(99,99,99,0.15)") : (hot ? `${exp.accent}22` : "rgba(99,99,99,0.15)")} />
      {/* Steam output for steam-iron */}
      {exp.id === "steam-iron" && hot && (
        <path d="M150,55 Q165,35 175,20" fill="none" stroke="rgba(220,230,255,0.4)" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
        </path>
      )}
      {/* H₂S flame */}
      {exp.id === "h2s-combustion" && hot && (
        <g>
          <ellipse cx="150" cy="50" rx="14" ry="22" fill="#60A5FA" opacity="0.85">
            <animate attributeName="ry" values="22;28;22" dur="0.35s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="150" cy="42" rx="8" ry="14" fill="#93C5FD" opacity="0.9">
            <animate attributeName="ry" values="14;19;14" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}
      {/* Glow */}
      {hot && <ellipse cx="150" cy="150" rx="40" ry="30" fill={flameColor} opacity="0.07"><animate attributeName="opacity" values="0.07;0.15;0.07" dur="1s" repeatCount="indefinite" /></ellipse>}
      {/* Burner */}
      <rect x="130" y="192" width="40" height="14" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      <rect x="138" y="188" width="24" height="6" rx="2" fill="#334155" />
      <path d="M130,200 Q105,204 105,218" fill="none" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <text x="150" y="218" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">{exp.title.en.toUpperCase()}</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// MOLECULAR PANEL
// ═══════════════════════════════════════════════════════════

function MolecularPanel({ exp, phase }: { exp: Exp; phase: Phase }) {
  const showAfter = phase === "complete";
  const reacting = phase === "reacting";
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "ইলেক্ট্ৰন স্থানান্তৰ দৃশ্য" : "Electron Transfer View"}</span>
        <span className="text-[10px] font-black" style={{ color: exp.accent }}>{showAfter ? (isAs ? "পিছত" : "After") : (isAs ? "পূৰ্বে" : "Before")}</span>
      </div>
      <svg viewBox="0 0 290 95" className="w-full" style={{ height: 85 }}>
        <defs>
          <filter id="rx"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#FDE047" />
          </marker>
        </defs>
        <AnimatePresence mode="wait">
          <motion.g key={showAfter ? "after" : "before"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {/* Oxidised species (left) */}
            <circle cx="70" cy="42" r="20" fill={exp.accent} filter="url(#rx)" opacity="0.9" />
            <text x="70" y="38" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{exp.redox.electronDonor.en.split("(")[0].trim().split(" ").slice(-1)[0]}</text>
            <text x="70" y="50" textAnchor="middle" fill="white" fontSize="7">O.N. {exp.redox.oxNumChanges[0]?.from}</text>
            <text x="70" y="72" textAnchor="middle" fill="#94a3b8" fontSize="7">{isAs ? "জাৰিত" : "OXIDISED"}</text>
            {/* Arrow showing electron transfer */}
            <path d="M95,42 L190,42" fill="none" stroke="#FDE047" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray={reacting ? "none" : "5,3"}>
              {reacting && <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.6s" repeatCount="indefinite" />}
            </path>
            <text x="145" y="36" textAnchor="middle" fill="#FDE047" fontSize="8">{exp.redox.oxNumChanges[0] ? `${Math.abs(parseFloat(exp.redox.oxNumChanges[0].to) - parseFloat(exp.redox.oxNumChanges[0].from.replace("+","").replace("−","-")))}e⁻` : "e⁻"}</text>
            {reacting && <text x="145" y="58" textAnchor="middle" fill="#FDE047" fontSize="7" opacity="0.8">{isAs ? "⚡ স্থানান্তৰ" : "⚡ transferring"}</text>}
            {/* Reduced species (right) */}
            <circle cx="215" cy="42" r="20" fill="#60A5FA" filter="url(#rx)" opacity="0.9" />
            <text x="215" y="38" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{exp.redox.electronAcceptor.en.split("(")[0].trim().split(" ").slice(-1)[0]}</text>
            <text x="215" y="50" textAnchor="middle" fill="white" fontSize="7">O.N. {exp.redox.oxNumChanges[1]?.from}</text>
            <text x="215" y="72" textAnchor="middle" fill="#94a3b8" fontSize="7">{isAs ? "অপচয়িত" : "REDUCED"}</text>
          </motion.g>
        </AnimatePresence>
        {showAfter && (
          <g>
            <text x="70" y="85" textAnchor="middle" fill={exp.accent} fontSize="7">→ O.N. {exp.redox.oxNumChanges[0]?.to}</text>
            <text x="215" y="85" textAnchor="middle" fill="#60A5FA" fontSize="7">→ O.N. {exp.redox.oxNumChanges[1]?.to}</text>
          </g>
        )}
      </svg>
      {/* Half reactions */}
      <div className="mt-2 space-y-1">
        <div className="rounded-lg px-2 py-1.5 text-center font-mono text-[9px] border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>{pickLang(exp.halfReactions.ox, lang)}</div>
        <div className="rounded-lg px-2 py-1.5 text-center font-mono text-[9px] border" style={{ borderColor: "rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.07)", color: "#60A5FA" }}>{pickLang(exp.halfReactions.red, lang)}</div>
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// REDOX ANALYSIS PANEL (unique to this module)
// ═══════════════════════════════════════════════════════════

function RedoxAnalysisPanel({ exp, phase }: { exp: Exp; phase: Phase }) {
  const active = phase !== "idle";
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <GlassPanel className="p-3">
      <div className="flex items-center gap-1.5 mb-3">
        <Zap className="w-3.5 h-3.5" style={{ color: exp.accent }} />
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "ৰেডক্স বিশ্লেষণ" : "Redox Analysis"}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: isAs ? "জাৰিত" : "Oxidised", value: pickLang(exp.redox.oxidized, lang), color: exp.accent, icon: "↑" },
          { label: isAs ? "অপচয়িত" : "Reduced", value: pickLang(exp.redox.reduced, lang), color: "#60A5FA", icon: "↓" },
          { label: isAs ? "জাৰক" : "Oxidising Agent", value: pickLang(exp.redox.oxidizingAgent, lang), color: "#60A5FA", icon: "🔵" },
          { label: isAs ? "অপচায়ক" : "Reducing Agent", value: pickLang(exp.redox.reducingAgent, lang), color: exp.accent, icon: "🔴" },
        ].map(({ label, value, color, icon }) => (
          <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.3 }} className="rounded-xl p-2.5 border" style={{ borderColor: `${color}30`, background: `${color}08` }}>
            <div className="text-[8px] text-slate-500 font-black uppercase mb-1">{icon} {label}</div>
            <div className="text-[10px] font-black leading-snug" style={{ color }}>{value}</div>
          </motion.div>
        ))}
      </div>
      {/* Oxidation number flow */}
      <div className="space-y-1.5">
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{isAs ? "জাৰণ সংখ্যা পৰিবৰ্তন" : "Oxidation Number Changes"}</p>
        {exp.redox.oxNumChanges.map(({ species, from, to, color }) => (
          <div key={species} className="flex items-center gap-2">
            <span className="text-[10px] font-black w-8" style={{ color }}>{species}</span>
            <div className="flex items-center gap-1 flex-1">
              <span className="text-[10px] font-black text-slate-400 w-8 text-center">{from}</span>
              <motion.div className="flex-1 h-1.5 rounded-full" style={{ background: `${color}30` }}>
                <motion.div className="h-full rounded-full" initial={{ width: "0%" }} animate={{ width: active ? "100%" : "0%" }} transition={{ duration: 1.5, ease: "easeOut" }} style={{ background: color }} />
              </motion.div>
              <span className="text-[10px] font-black w-8 text-center" style={{ color }}>{to}</span>
            </div>
            <span className="text-[9px]" style={{ color }}>{parseFloat(to.replace("−","-").replace("+","")) > parseFloat(from.replace("−","-").replace("+","")) ? (isAs ? "▲ জাৰিত" : "▲ Oxidised") : (isAs ? "▼ অপচয়িত" : "▼ Reduced")}</span>
          </div>
        ))}
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
      const nxt = stepIdx + 1; setStepIdx(nxt);
      setPhase(nxt >= 2 ? "reacting" : `step${nxt + 1}` as Phase);
    } else { setPhase("complete"); setShowQuiz(true); }
  };
  const reset = () => { setPhase("idle"); setStepIdx(0); setShowQuiz(false); };

  const rxnPct = phase === "complete" ? 100 : phase === "reacting" ? 65 : 0;
  const heatPct = phase === "reacting" || phase === "complete" ? (exp.id === "thermite" ? 100 : exp.id === "steam-iron" ? 85 : 60) : 0;

  const hazardLabel: Record<typeof exp.hazard, string> = isAs
    ? { LOW: "কম", MEDIUM: "মধ্যম", HIGH: "উচ্চ", EXTREME: "চৰম" }
    : { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", EXTREME: "EXTREME" };

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
          <NeonBadge label={isAs ? "ৰেডক্স" : "Redox"} color={exp.accent} />
          {exp.hazard === "EXTREME" && <NeonBadge label={isAs ? "⚠ চৰম" : "⚠ EXTREME"} color="#FF0044" />}
          {exp.hazard === "HIGH" && <NeonBadge label={isAs ? "উচ্চ বিপদ" : "HIGH HAZARD"} color="#EF4444" />}
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
              <span className="text-xs font-black text-red-300">{isAs ? "সুৰক্ষা সাৱধানতা" : "Safety Precautions"}</span>
              <button onClick={() => setShowSafety(false)} className="ml-auto text-slate-500">✕</button>
            </div>
            {expSafety.map((s, i) => <p key={i} className="text-xs text-red-200 mb-0.5">• {s}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 228 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
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

          <RedoxAnalysisPanel exp={exp} phase={phase} />
        </div>

        {/* Middle */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "সন্তুলিত সমীকৰণ" : "Balanced Equation"}</p>
            <div className="rounded-xl px-3 py-2.5 text-center font-mono font-black text-sm border" style={{ borderColor: `${exp.accent}40`, background: `${exp.accent}0F`, color: exp.accent }}>
              {exp.equation}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                [isAs ? "জাৰক" : "Oxidising Agent", pickLang(exp.redox.oxidizingAgent, lang)],
                [isAs ? "অপচায়ক" : "Reducing Agent", pickLang(exp.redox.reducingAgent, lang)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg py-2 px-2 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-[8px] text-slate-600 mb-0.5">{l}</p>
                  <p className="text-[9px] font-black text-slate-300 leading-tight truncate">{v}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "জীৱন্ত তথ্য" : "Live Data"}</p>
            <div className="space-y-3">
              <AnimBar label={isAs ? "বিক্ৰিয়াৰ অগ্ৰগতি" : "Reaction Progress"} target={rxnPct} accent={exp.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimBar label={isAs ? "তাপৰ তীব্ৰতা" : "Heat Intensity"} target={heatPct} accent="#FB923C" icon={<Thermometer className="w-3 h-3" />} />
              <AnimBar label={isAs ? "ইলেক্ট্ৰন স্থানান্তৰ" : "Electron Transfer"} target={rxnPct} accent="#A78BFA" icon={<Zap className="w-3 h-3" />} />
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "বিক্ৰিয়াৰ ধৰণ" : "Reaction Type"} value={isAs ? "ৰেডক্স (জাৰণ-অপচয়ন)" : "Redox (Oxidation-Reduction)"} color={exp.accent} />
              <DataRow label={isAs ? "বিপদৰ স্তৰ" : "Hazard Level"} value={hazardLabel[exp.hazard]} color={exp.hazard === "EXTREME" ? "#FF0044" : exp.hazard === "HIGH" ? "#EF4444" : exp.hazard === "MEDIUM" ? "#FB923C" : "#22C55E"} />
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
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const hazardLabel: Record<Exp["hazard"], string> = isAs
    ? { LOW: "কম", MEDIUM: "মধ্যম", HIGH: "উচ্চ", EXTREME: "চৰম" }
    : { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", EXTREME: "EXTREME" };

  const memoryAids: [string, string, string][] = isAs
    ? [
        ["OIL RIG", "জাৰণ হ’ল হেৰোৱা, অপচয়ন হ’ল লাভ (ইলেক্ট্ৰনৰ)", "#FB923C"],
        ["জাৰক", "অপচয়িত হয় · ইলেক্ট্ৰন লাভ · জা.সং. কমে", "#60A5FA"],
        ["অপচায়ক", "জাৰিত হয় · ইলেক্ট্ৰন হেৰুৱায় · জা.সং. বাঢ়ে", "#FB923C"],
        ["LEO GER", "Lose Electrons Oxidation, Gain Electrons Reduction", "#A78BFA"],
      ]
    : [
        ["OIL RIG", "Oxidation Is Loss, Reduction Is Gain (of electrons)", "#FB923C"],
        ["Oxidising Agent", "Gets reduced · Gains electrons · O.N. decreases", "#60A5FA"],
        ["Reducing Agent", "Gets oxidised · Loses electrons · O.N. increases", "#FB923C"],
        ["LEO GER", "Lose Electrons Oxidation, Gain Electrons Reduction", "#A78BFA"],
      ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #0D1117 60%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-15 animate-pulse"
            style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: ["#FB923C","#60A5FA","#FBBF24","#A78BFA","#86EFAC","#F472B6"][i % 6], animationDelay: `${Math.random() * 4}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
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
            style={{ borderColor: "rgba(251,146,60,0.3)", background: "rgba(251,146,60,0.08)", color: "#FB923C" }}>
            <Zap className="w-3.5 h-3.5" /> {isAs ? "জাৰণ আৰু অপচয়ন · অধ্যায় ১" : "Oxidation & Reduction · Chapter 1"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "ৰেডক্স বিক্ৰিয়া" : "Redox Reactions"}<br />
            <span style={{ background: "linear-gradient(135deg, #FB923C, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{isAs ? "ভাৰ্চুৱেল লেব" : "Virtual Lab"}</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs ? "৬টা জীৱন্ত ৰেডক্স পৰীক্ষা — ইলেক্ট্ৰন স্থানান্তৰ দৃশ্যায়ন, জাৰণ সংখ্যা অনুসৰণ, জাৰক/অপচায়ক চিনাক্তকৰণ, আৰু CBSE-ধৰণৰ মূল্যায়ন।" : "6 immersive redox experiments — electron transfer visualization, oxidation number tracking, oxidising/reducing agent identification, and CBSE-style assessment."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs
              ? [["৬","পৰীক্ষা"],["ইলেক্ট্ৰন","স্থানান্তৰ"],["ৰেডক্স","বিশ্লেষণ"],["CBSE","সংযুক্ত"]]
              : [["6","Experiments"],["Electron","Transfer"],["Redox","Analysis"],["CBSE","Aligned"]]
            ).map(([v,l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Oxidation number reference */}
        <div className="mb-8 p-4 rounded-2xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 text-center">{isAs ? "ৰেডক্স মনত ৰখা সহায়ক" : "Redox Memory Aid"}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {memoryAids.map(([title, desc, col]) => (
              <div key={title} className="rounded-xl p-3 border" style={{ background: `${col}08`, borderColor: `${col}25` }}>
                <p className="text-xs font-black mb-1" style={{ color: col }}>{title}</p>
                <p className="text-[9px] text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPERIMENTS.map((exp, idx) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
              <button onClick={() => onSelect(exp)} className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${exp.accent}55`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                <div className="h-1.5" style={{ background: `linear-gradient(to right, ${exp.gradFrom}, ${exp.gradTo})` }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-lg"
                        style={{ background: `${exp.accent}18`, borderColor: `${exp.accent}40` }}>
                        {exp.emoji}
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isAs ? "পৰীক্ষা" : "Exp."} {String(exp.num).padStart(2,"0")}</span>
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded border"
                      style={{ color: exp.hazard === "EXTREME" ? "#FF0044" : exp.hazard === "HIGH" ? "#EF4444" : "#FB923C", borderColor: "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)" }}>
                      ⚠ {hazardLabel[exp.hazard]}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white mb-0.5 leading-snug">{pickLang(exp.title, lang)}</h3>
                  <p className="text-[10px] font-semibold mb-3" style={{ color: exp.accent }}>{pickLang(exp.subtitle, lang)}</p>

                  <div className="font-mono text-[10px] font-black px-2 py-1.5 rounded-lg mb-3 border" style={{ borderColor: `${exp.accent}30`, background: `${exp.accent}0A`, color: exp.accent }}>
                    {exp.equation}
                  </div>

                  {/* Redox agent labels */}
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    <div className="rounded-lg px-2 py-1.5 text-center" style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
                      <p className="text-[7px] text-orange-400 font-black mb-0.5">{isAs ? "অপচায়ক" : "REDUCING AGENT"}</p>
                      <p className="text-[9px] text-slate-300 font-black leading-tight truncate">{pickLang(exp.redox.reducingAgent, lang).split("(")[0].trim()}</p>
                    </div>
                    <div className="rounded-lg px-2 py-1.5 text-center" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}>
                      <p className="text-[7px] text-blue-400 font-black mb-0.5">{isAs ? "জাৰক" : "OXIDISING AGENT"}</p>
                      <p className="text-[9px] text-slate-300 font-black leading-tight truncate">{pickLang(exp.redox.oxidizingAgent, lang).split("(")[0].trim()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {(isAs
                        ? ["কণিকা FX","অণু দৃশ্য","ৰেডক্স বিশ্লেষণ","কুইজ"]
                        : ["Particle FX","Mol. View","Redox Analysis","Quiz"]
                      ).map(t => (
                        <span key={t} className="text-[7px] px-1 py-0.5 rounded font-black" style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-black transition-transform group-hover:translate-x-1" style={{ color: exp.accent }}>
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

export default function RedoxReactionsLab() {
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
