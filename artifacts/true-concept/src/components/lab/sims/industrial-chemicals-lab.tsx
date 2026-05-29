/**
 * Industrial Chemicals from Common Salt Virtual Lab
 * 5 processes: NaOH (Chlor-Alkali), Bleaching Powder, Baking Soda, Washing Soda, Plaster of Paris
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";
import {
  ArrowLeft, Shield, RotateCcw, Play, Zap,
  FlaskConical, CheckCircle, Info, AlertTriangle, Gauge, Thermometer,
} from "lucide-react";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type ProcId = "chlor-alkali" | "bleaching-powder" | "baking-soda" | "washing-soda" | "plaster-of-paris";
type Phase = "idle" | "step1" | "step2" | "reacting" | "complete";
type PMode = "electrolysis" | "chlorine-diff" | "crystal-form" | "furnace-heat" | "steam-vent" | "none";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; blur: number; type: string;
}
interface Ion { sym: string; col: string; desc: BilingualField<string>; }
interface GaugeData { temp: number; pressure: number; yield_: number; }
interface Proc {
  id: ProcId; num: number;
  title: BilingualField<string>; iupac: BilingualField<string>; subtitle: BilingualField<string>; equation: string;
  accent: string; glow: string; gradFrom: string; gradTo: string; emoji: string;
  hazard: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  pmode: PMode;
  phaseGauges: Record<Phase, GaugeData>;
  phaseColors: Record<Phase, string>;
  description: BilingualField<string>; realWorld: BilingualField<string>; examNote: BilingualField<string>;
  safety: BilingualField<string[]>;
  steps: { label: BilingualField<string>; desc: BilingualField<string> }[];
  ions: { reactants: Ion[]; products: Ion[] };
  observations: BilingualField<string[]>;
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
}

// ═══════════════════════════════════════════════════════════
// PROCESS CONFIG
// ═══════════════════════════════════════════════════════════

const PROCESSES: Proc[] = [
  {
    id: "chlor-alkali", num: 1,
    title: { en: "Sodium Hydroxide", as: "ছ'ডিয়াম হাইড্ৰ'ক্সাইড" },
    iupac: { en: "Sodium Hydroxide (NaOH)", as: "ছ'ডিয়াম হাইড্ৰ'ক্সাইড (NaOH)" },
    subtitle: { en: "Chlor-Alkali Electrolysis Process", as: "ক্ল'ৰ-এলকালি তড়িৎবিশ্লেষণ প্ৰক্ৰিয়া" },
    equation: "2NaCl + 2H₂O → 2NaOH + Cl₂↑ + H₂↑",
    accent: "#FBBF24", glow: "rgba(251,191,36,0.45)", gradFrom: "#B45309", gradTo: "#FCD34D", emoji: "⚡",
    hazard: "HIGH", pmode: "electrolysis",
    phaseGauges: {
      idle:     { temp: 25,  pressure: 1.0, yield_: 0   },
      step1:    { temp: 35,  pressure: 1.2, yield_: 5   },
      step2:    { temp: 55,  pressure: 1.8, yield_: 30  },
      reacting: { temp: 80,  pressure: 2.5, yield_: 72  },
      complete: { temp: 60,  pressure: 2.0, yield_: 100 },
    },
    phaseColors: {
      idle:     "rgba(220,210,170,0.1)",
      step1:    "rgba(220,210,150,0.18)",
      step2:    "rgba(210,200,120,0.28)",
      reacting: "rgba(200,190,100,0.38)",
      complete: "rgba(190,185,90,0.32)",
    },
    description: { en: "The Chlor-Alkali process electrolyses concentrated brine (NaCl solution). At the cathode, H₂ gas and OH⁻ ions form (NaOH). At the anode, Cl⁻ is oxidised to Cl₂ gas. This is one of the largest industrial electrochemical processes worldwide.", as: "ক্ল'ৰ-এলকালি প্ৰক্ৰিয়াই ঘন ব্ৰাইন (NaCl দ্ৰৱণ) তড়িৎবিশ্লেষণ কৰে। কেথ'ডত H₂ গেছ আৰু OH⁻ আয়ন (NaOH) গঠিত হয়। এনডত Cl⁻-ৰ Cl₂ গেছলৈ জাৰণ হয়। এইটো বিশ্বৰ অন্যতম বৃহত্তম শিল্প তড়িৎৰাসায়নিক প্ৰক্ৰিয়া।" },
    realWorld: { en: "NaOH: paper/pulp industry · soap/detergent manufacture · aluminium production · water treatment · petroleum refining. Cl₂: PVC · disinfectants · pharmaceuticals. H₂: fuel cells · Haber process.", as: "NaOH: কাগজ/মণ্ড উদ্যোগ · চাবোন/ডিটাৰজেণ্ট প্ৰস্তুতি · এলুমিনিয়াম উৎপাদন · পানী শোধন · পেট্ৰ'লিয়াম পৰিশোধন। Cl₂: PVC · জীবাণুনাশক · ঔষধ। H₂: ইন্ধন কোষ · হেবাৰ প্ৰক্ৰিয়া।" },
    examNote: { en: "2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂. ANODE: 2Cl⁻ → Cl₂ + 2e⁻ (oxidation). CATHODE: 2H₂O + 2e⁻ → H₂ + 2OH⁻ (reduction). NaOH stays in solution. THREE products: NaOH, Cl₂, H₂. CBSE: this is called the Chlor-Alkali process.", as: "2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂। এনড: 2Cl⁻ → Cl₂ + 2e⁻ (জাৰণ)। কেথ'ড: 2H₂O + 2e⁻ → H₂ + 2OH⁻ (বিজাৰণ)। NaOH দ্ৰৱণত থাকে। তিনিটা উৎপাদ: NaOH, Cl₂, H₂। CBSE: ইয়াক ক্ল'ৰ-এলকালি প্ৰক্ৰিয়া বোলে।" },
    safety: { en: ["Cl₂ is highly toxic — sealed system required", "NaOH is corrosive — wear PPE", "H₂ is explosive — no flames", "HIGH VOLTAGE — maintain safety distance"], as: ["Cl₂ অত্যন্ত বিষাক্ত — বন্ধ ব্যৱস্থা প্ৰয়োজন", "NaOH ক্ষয়কাৰক — PPE পিন্ধক", "H₂ বিস্ফোৰণযোগ্য — কোনো জুই নাই", "উচ্চ ভোল্টেজ — সুৰক্ষা দূৰত্ব বজাই ৰাখক"] },
    steps: [
      { label: { en: "Load Brine into Electrolysis Cell", as: "তড়িৎবিশ্লেষণ কোষত ব্ৰাইন ভৰক" }, desc: { en: "Saturated NaCl solution (brine) is pumped into the industrial electrolysis cell. Graphite/titanium electrodes are fully submerged.", as: "সম্পৃক্ত NaCl দ্ৰৱণ (ব্ৰাইন) শিল্প তড়িৎবিশ্লেষণ কোষত পাম্প কৰা হয়। গ্ৰেফাইট/টাইটেনিয়াম ইলেকট্ৰড সম্পূৰ্ণৰূপে ডুবোৱা থাকে।" } },
      { label: { en: "Activate Electrical Current", as: "বৈদ্যুতিক প্ৰবাহ সক্ৰিয় কৰক" }, desc: { en: "High DC current applied (250–300 kA). Na⁺ and Cl⁻ ions migrate. Cl⁻ attracted to anode (+), Na⁺ and H₂O to cathode (−).", as: "উচ্চ DC প্ৰবাহ প্ৰয়োগ (250–300 kA)। Na⁺ আৰু Cl⁻ আয়ন প্ৰব্ৰজন কৰে। Cl⁻ এনডৰ (+) প্ৰতি আকৃষ্ট, Na⁺ আৰু H₂O কেথ'ডৰ (−) প্ৰতি।" } },
      { label: { en: "Monitor Gas Evolution", as: "গেছ নিৰ্গমন নিৰীক্ষণ কৰক" }, desc: { en: "ANODE: yellow-green Cl₂ gas bubbles form (Cl⁻ oxidised). CATHODE: colourless H₂ gas forms. NaOH accumulates on cathode side.", as: "এনড: হালধীয়া-সেউজীয়া Cl₂ গেছৰ বুদবুদ গঠিত হয় (Cl⁻ জাৰিত)। কেথ'ড: বৰ্ণহীন H₂ গেছ গঠিত হয়। NaOH কেথ'ড দিশত জমা হয়।" } },
      { label: { en: "Collect Products", as: "উৎপাদ সংগ্ৰহ কৰক" }, desc: { en: "Cl₂ collected from anode chamber. H₂ from cathode. NaOH solution drained. Electrolysis cell runs continuously in industry.", as: "এনড কক্ষৰ পৰা Cl₂ সংগ্ৰহ। কেথ'ডৰ পৰা H₂। NaOH দ্ৰৱণ নিষ্কাশন। শিল্পত তড়িৎবিশ্লেষণ কোষ নিৰন্তৰ চলে।" } },
    ],
    ions: {
      reactants: [{ sym: "Na⁺", col: "#FCD34D", desc: { en: "Sodium ion (from brine)", as: "ছ'ডিয়াম আয়ন (ব্ৰাইনৰ পৰা)" } }, { sym: "Cl⁻", col: "#86EFAC", desc: { en: "Chloride ion (from brine)", as: "ক্ল'ৰাইড আয়ন (ব্ৰাইনৰ পৰা)" } }, { sym: "H₂O", col: "#67E8F9", desc: { en: "Water molecules", as: "পানী অণু" } }],
      products:  [{ sym: "OH⁻", col: "#4ADE80", desc: { en: "Hydroxide (→ NaOH)", as: "হাইড্ৰ'ক্সাইড (→ NaOH)" } }, { sym: "Cl₂↑", col: "#BEF264", desc: { en: "Chlorine gas (anode)", as: "ক্ল'ৰিন গেছ (এনড)" } }, { sym: "H₂↑", col: "#E2E8F0", desc: { en: "Hydrogen gas (cathode)", as: "হাইড্ৰ'জেন গেছ (কেথ'ড)" } }],
    },
    observations: { en: ["Yellow-green Cl₂ at anode", "Colourless H₂ at cathode", "NaOH solution at cathode side", "Solution becomes increasingly alkaline", "Electrodes glow under high current", "Brine depletes as reaction proceeds"], as: ["এনডত হালধীয়া-সেউজীয়া Cl₂", "কেথ'ডত বৰ্ণহীন H₂", "কেথ'ড দিশত NaOH দ্ৰৱণ", "দ্ৰৱণ ক্ৰমশঃ ক্ষাৰকীয় হয়", "উচ্চ প্ৰবাহত ইলেকট্ৰড জিলিকে", "বিক্ৰিয়া অগ্ৰসৰত ব্ৰাইন হ্ৰাস পায়"] },
    quiz: [
      { q: { en: "Products of the Chlor-Alkali process:", as: "ক্ল'ৰ-এলকালি প্ৰক্ৰিয়াৰ উৎপাদ:" }, opts: { en: ["NaCl + H₂O", "NaOH + Cl₂ + H₂", "Na₂CO₃ + HCl", "NaHCO₃ + H₂"], as: ["NaCl + H₂O", "NaOH + Cl₂ + H₂", "Na₂CO₃ + HCl", "NaHCO₃ + H₂"] }, ans: 1 },
      { q: { en: "At the anode in electrolysis of brine:", as: "ব্ৰাইনৰ তড়িৎবিশ্লেষণত এনডত:" }, opts: { en: ["H₂ is produced", "NaOH forms", "Cl₂ is evolved", "Na deposits"], as: ["H₂ উৎপন্ন হয়", "NaOH গঠিত হয়", "Cl₂ নিৰ্গত হয়", "Na জমা হয়"] }, ans: 2 },
      { q: { en: "Brine is a solution of:", as: "ব্ৰাইন হ'ল এক দ্ৰৱণ:" }, opts: { en: ["Sodium carbonate", "Sodium chloride", "Sodium hydroxide", "Calcium chloride"], as: ["ছ'ডিয়াম কাৰ্বনেট", "ছ'ডিয়াম ক্ল'ৰাইড", "ছ'ডিয়াম হাইড্ৰ'ক্সাইড", "কেলচিয়াম ক্ল'ৰাইড"] }, ans: 1 },
      { q: { en: "The Chlor-Alkali process uses which technique?", as: "ক্ল'ৰ-এলকালি প্ৰক্ৰিয়াত কোন পদ্ধতি ব্যৱহাৰ?" }, opts: { en: ["Distillation", "Crystallization", "Electrolysis", "Fractional distillation"], as: ["পাতন", "স্ফটিকীকৰণ", "তড়িৎবিশ্লেষণ", "ভগ্নাংশ পাতন"] }, ans: 2 },
      { q: { en: "NaOH is collected from which part of the cell?", as: "NaOH কোষৰ কোন অংশৰ পৰা সংগ্ৰহ হয়?" }, opts: { en: ["Anode chamber", "Centre", "Cathode chamber", "Above electrodes"], as: ["এনড কক্ষ", "মাজ অংশ", "কেথ'ড কক্ষ", "ইলেকট্ৰডৰ ওপৰত"] }, ans: 2 },
    ],
  },
  {
    id: "bleaching-powder", num: 2,
    title: { en: "Bleaching Powder", as: "ব্লিচিং পাউডাৰ" },
    iupac: { en: "Calcium Oxychloride (CaOCl₂)", as: "কেলচিয়াম অক্সিক্ল'ৰাইড (CaOCl₂)" },
    subtitle: { en: "Chlorination of Slaked Lime", as: "স্লেকড চূনৰ ক্ল'ৰিনেচন" },
    equation: "Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O",
    accent: "#86EFAC", glow: "rgba(134,239,172,0.45)", gradFrom: "#15803D", gradTo: "#4ADE80", emoji: "🟢",
    hazard: "HIGH", pmode: "chlorine-diff",
    phaseGauges: {
      idle:     { temp: 25, pressure: 1.0, yield_: 0   },
      step1:    { temp: 30, pressure: 1.1, yield_: 10  },
      step2:    { temp: 35, pressure: 1.3, yield_: 40  },
      reacting: { temp: 40, pressure: 1.5, yield_: 78  },
      complete: { temp: 35, pressure: 1.2, yield_: 100 },
    },
    phaseColors: {
      idle:     "rgba(220,250,220,0.1)",
      step1:    "rgba(200,240,200,0.18)",
      step2:    "rgba(180,230,180,0.28)",
      reacting: "rgba(150,220,150,0.35)",
      complete: "rgba(240,250,240,0.2)",
    },
    description: { en: "Bleaching powder is produced by passing chlorine gas over dry slaked lime (Ca(OH)₂) at about 40°C. The product is calcium oxychloride (CaOCl₂) — a white powder with a strong chlorine smell. It is the cheapest bleaching agent.", as: "শুকান স্লেকড চূন (Ca(OH)₂)-ৰ ওপৰেদি প্ৰায় 40°C-ত ক্ল'ৰিন গেছ পাৰ কৰি ব্লিচিং পাউডাৰ তৈয়াৰ হয়। উৎপাদটো হ'ল কেলচিয়াম অক্সিক্ল'ৰাইড (CaOCl₂) — তীব্ৰ ক্ল'ৰিন গন্ধযুক্ত বগা গুড়ি। ই সৰ্বাধিক সস্তা বিৰঞ্জন কাৰক।" },
    realWorld: { en: "Bleaching textiles and paper · Disinfecting water supplies · Disinfectant in swimming pools · Stain removal · Disinfecting hospitals and public areas", as: "বস্ত্ৰ আৰু কাগজৰ বিৰঞ্জন · পানী সৰবৰাহ জীবাণুমুক্তকৰণ · ছুইমিং পুলত জীবাণুনাশক · দাগ আঁতৰোৱা · চিকিৎসালয় আৰু ৰাজহুৱা স্থান জীবাণুমুক্তকৰণ" },
    examNote: { en: "Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O. Bleaching powder = calcium oxychloride. It has available chlorine which makes it a bleaching/disinfecting agent. CBSE: produced by action of Cl₂ on dry Ca(OH)₂ at 40°C. Available chlorine = ~33–36%. Do NOT heat above 60°C (decomposes).", as: "Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O। ব্লিচিং পাউডাৰ = কেলচিয়াম অক্সিক্ল'ৰাইড। ইয়াত উপলব্ধ ক্ল'ৰিন আছে যি ইয়াক বিৰঞ্জন/জীবাণুনাশক কৰে। CBSE: 40°C-ত শুকান Ca(OH)₂-ত Cl₂-ৰ ক্ৰিয়াৰ ফলত উৎপন্ন। উপলব্ধ ক্ল'ৰিন = ~33–36%। 60°C-ৰ ওপৰত গৰম কৰিব নালাগে (বিযোজিত হয়)।" },
    safety: { en: ["Cl₂ is toxic — sealed reaction chamber", "Bleaching powder irritates lungs", "Do not mix with acids (releases Cl₂)", "PPE: gas mask, gloves required"], as: ["Cl₂ বিষাক্ত — বন্ধ বিক্ৰিয়া কক্ষ", "ব্লিচিং পাউডাৰে ফুচফুচ খজুওৱায়", "অম্লৰ সৈতে মিহলি কৰিব নালাগে (Cl₂ নিৰ্গত হয়)", "PPE: গেছ মুখোশ, দস্তানা প্ৰয়োজন"] },
    steps: [
      { label: { en: "Prepare Dry Slaked Lime", as: "শুকান স্লেকড চূন প্ৰস্তুত কৰক" }, desc: { en: "Dry Ca(OH)₂ (slaked lime) loaded into rotating industrial Hasenclever chamber. Moisture content < 1% required.", as: "শুকান Ca(OH)₂ (স্লেকড চূন) ঘূৰা শিল্প হাছেনক্লেভাৰ কক্ষত ভৰক। আৰ্দ্ৰতাৰ পৰিমাণ < 1% প্ৰয়োজন।" } },
      { label: { en: "Introduce Chlorine Gas", as: "ক্ল'ৰিন গেছ সুমোৱাওক" }, desc: { en: "Cl₂ gas pumped through the rotating chamber at controlled pressure. Temperature maintained at 40°C max.", as: "নিয়ন্ত্ৰিত চাপত ঘূৰা কক্ষৰ মাজেদি Cl₂ গেছ পাম্প কৰা হয়। সৰ্বাধিক 40°C উষ্ণতা বজাই ৰখা হয়।" } },
      { label: { en: "Observe Reaction", as: "বিক্ৰিয়া পৰ্যবেক্ষণ কৰক" }, desc: { en: "White Ca(OH)₂ powder reacts with Cl₂. The lime takes up available chlorine. Yellow-green Cl₂ absorbed. White CaOCl₂ powder forms.", as: "বগা Ca(OH)₂ গুড়ি Cl₂-ৰ সৈতে বিক্ৰিয়া কৰে। চূনে উপলব্ধ ক্ল'ৰিন গ্ৰহণ কৰে। হালধীয়া-সেউজীয়া Cl₂ শোষিত। বগা CaOCl₂ গুড়ি গঠিত হয়।" } },
      { label: { en: "Collect Bleaching Powder", as: "ব্লিচিং পাউডাৰ সংগ্ৰহ কৰক" }, desc: { en: "White bleaching powder (CaOCl₂) collected. Smell of Cl₂ indicates available chlorine content. Stored in airtight drums.", as: "বগা ব্লিচিং পাউডাৰ (CaOCl₂) সংগ্ৰহ। Cl₂-ৰ গন্ধে উপলব্ধ ক্ল'ৰিনৰ পৰিমাণ নিৰ্দেশ কৰে। বায়ুৰোধী ড্ৰামত সংৰক্ষণ।" } },
    ],
    ions: {
      reactants: [{ sym: "Ca(OH)₂", col: "#E2E8F0", desc: { en: "Slaked lime (dry)", as: "স্লেকড চূন (শুকান)" } }, { sym: "Cl₂", col: "#BEF264", desc: { en: "Chlorine gas", as: "ক্ল'ৰিন গেছ" } }],
      products:  [{ sym: "CaOCl₂", col: "#F8FAFC", desc: { en: "Bleaching powder (white)", as: "ব্লিচিং পাউডাৰ (বগা)" } }, { sym: "H₂O", col: "#67E8F9", desc: { en: "Water vapour", as: "জলীয় বাষ্প" } }],
    },
    observations: { en: ["Yellow-green Cl₂ enters chamber", "White powder turns slightly yellowish", "Chlorine smell intensifies", "White CaOCl₂ powder accumulates", "Temperature rises slightly (exothermic)", "Gas absorption monitored by pressure drop"], as: ["হালধীয়া-সেউজীয়া Cl₂ কক্ষত প্ৰৱেশ", "বগা গুড়ি অলপ হালধীয়া হয়", "ক্ল'ৰিনৰ গন্ধ তীব্ৰ হয়", "বগা CaOCl₂ গুড়ি জমা হয়", "উষ্ণতা অলপ বৃদ্ধি (তাপোৎপাদী)", "চাপ হ্ৰাসৰ দ্বাৰা গেছ শোষণ নিৰীক্ষণ"] },
    quiz: [
      { q: { en: "Chemical name of bleaching powder:", as: "ব্লিচিং পাউডাৰৰ ৰাসায়নিক নাম:" }, opts: { en: ["Calcium oxide", "Calcium hydroxide", "Calcium oxychloride", "Calcium hypochlorite"], as: ["কেলচিয়াম অক্সাইড", "কেলচিয়াম হাইড্ৰ'ক্সাইড", "কেলচিয়াম অক্সিক্ল'ৰাইড", "কেলচিয়াম হাইপ'ক্ল'ৰাইট"] }, ans: 2 },
      { q: { en: "Bleaching powder is produced by passing Cl₂ over:", as: "ব্লিচিং পাউডাৰ উৎপন্ন হয় Cl₂ পাৰ কৰিলে:" }, opts: { en: ["CaCO₃", "CaO", "Ca(OH)₂", "CaCl₂"], as: ["CaCO₃", "CaO", "Ca(OH)₂", "CaCl₂"] }, ans: 2 },
      { q: { en: "Available chlorine in bleaching powder makes it a:", as: "ব্লিচিং পাউডাৰত উপলব্ধ ক্ল'ৰিনে ইয়াক কৰে:" }, opts: { en: ["Fertiliser", "Bleaching/disinfecting agent", "Reducing agent", "Acid"], as: ["সাৰ", "বিৰঞ্জন/জীবাণুনাশক কাৰক", "বিজাৰক", "অম্ল"] }, ans: 1 },
      { q: { en: "Temperature for bleaching powder production:", as: "ব্লিচিং পাউডাৰ উৎপাদনৰ উষ্ণতা:" }, opts: { en: ["100°C", "250°C", "40°C", "Room temp"], as: ["100°C", "250°C", "40°C", "কোঠা উষ্ণতা"] }, ans: 2 },
      { q: { en: "Bleaching powder should NOT be mixed with acids because:", as: "ব্লিচিং পাউডাৰ অম্লৰ সৈতে মিহলি কৰিব নালাগে কাৰণ:" }, opts: { en: ["It explodes", "It releases toxic Cl₂ gas", "It becomes blue", "It melts"], as: ["বিস্ফোৰণ হয়", "বিষাক্ত Cl₂ গেছ নিৰ্গত হয়", "নীলা হয়", "গলি যায়"] }, ans: 1 },
    ],
  },
  {
    id: "baking-soda", num: 3,
    title: { en: "Baking Soda", as: "বেকিং ছ'ডা" },
    iupac: { en: "Sodium Hydrogencarbonate (NaHCO₃)", as: "ছ'ডিয়াম হাইড্ৰ'জেনকাৰ্বনেট (NaHCO₃)" },
    subtitle: { en: "Solvay (Ammonia-Soda) Process", as: "ছলভে (এমোনিয়া-ছ'ডা) প্ৰক্ৰিয়া" },
    equation: "NaCl + H₂O + CO₂ + NH₃ → NH₄Cl + NaHCO₃↓",
    accent: "#67E8F9", glow: "rgba(103,232,249,0.45)", gradFrom: "#0E7490", gradTo: "#22D3EE", emoji: "🔵",
    hazard: "LOW", pmode: "crystal-form",
    phaseGauges: {
      idle:     { temp: 25, pressure: 1.0, yield_: 0   },
      step1:    { temp: 30, pressure: 1.5, yield_: 15  },
      step2:    { temp: 15, pressure: 2.0, yield_: 45  },
      reacting: { temp: 10, pressure: 2.8, yield_: 80  },
      complete: { temp: 25, pressure: 1.0, yield_: 100 },
    },
    phaseColors: {
      idle:     "rgba(200,240,255,0.1)",
      step1:    "rgba(180,235,255,0.18)",
      step2:    "rgba(160,230,255,0.3)",
      reacting: "rgba(240,248,255,0.55)",
      complete: "rgba(248,252,255,0.65)",
    },
    description: { en: "The Solvay process passes CO₂ and NH₃ through saturated brine. NH₃ increases the alkalinity so CO₂ reacts with Na⁺ to form NaHCO₃ which precipitates (less soluble than NaCl). NH₄Cl remains in solution and is recycled with Ca(OH)₂.", as: "ছলভে প্ৰক্ৰিয়াত সম্পৃক্ত ব্ৰাইনৰ মাজেদি CO₂ আৰু NH₃ পাৰ কৰা হয়। NH₃-এ ক্ষাৰকত্ব বৃদ্ধি কৰে যাতে CO₂-এ Na⁺-ৰ সৈতে বিক্ৰিয়া কৰি NaHCO₃ গঠন কৰে যি অৱক্ষেপিত হয় (NaCl-তকৈ কম দ্ৰৱণীয়)। NH₄Cl দ্ৰৱণত থাকে আৰু Ca(OH)₂-ৰ সৈতে পুনৰ ব্যৱহাৰ হয়।" },
    realWorld: { en: "Baking/leavening in food · Antacid medication · Fire extinguisher (CO₂ release) · pH buffer · Cleaning agent · Heartburn relief", as: "খাদ্যত বেক/খামীৰ · এণ্টাচিড ঔষধ · অগ্নি নিৰ্বাপক (CO₂ নিৰ্গমন) · pH বাফাৰ · পৰিষ্কাৰক · বুকুজ্বলা উপশম" },
    examNote: { en: "NaHCO₃ is sodium hydrogencarbonate (sodium bicarbonate, baking soda). Solvay process: NH₃ + CO₂ + NaCl + H₂O → NaHCO₃ (precipitate) + NH₄Cl. NaHCO₃ precipitates because it is LESS SOLUBLE than NH₄Cl in the cold ammoniated brine. CBSE: NaHCO₃ + HCl → NaCl + H₂O + CO₂.", as: "NaHCO₃ হ'ল ছ'ডিয়াম হাইড্ৰ'জেনকাৰ্বনেট (বেকিং ছ'ডা)। ছলভে প্ৰক্ৰিয়া: NH₃ + CO₂ + NaCl + H₂O → NaHCO₃ (অৱক্ষেপ) + NH₄Cl। NaHCO₃ অৱক্ষেপিত হয় কাৰণ ঠাণ্ডা এমোনিয়াযুক্ত ব্ৰাইনত NH₄Cl-তকৈ কম দ্ৰৱণীয়। CBSE: NaHCO₃ + HCl → NaCl + H₂O + CO₂।" },
    safety: { en: ["NH₃ is toxic — fume hood required", "CO₂ high concentration — ventilate", "Low temperature operation required", "Wear protective equipment"], as: ["NH₃ বিষাক্ত — ফিউম হুড প্ৰয়োজন", "CO₂ উচ্চ ঘনত্ব — বায়ু চলাচল কৰক", "কম উষ্ণতাত কাৰ্য পৰিচালনা প্ৰয়োজন", "সুৰক্ষা সামগ্ৰী পিন্ধক"] },
    steps: [
      { label: { en: "Saturate Brine with Ammonia", as: "ব্ৰাইনক এমোনিয়াৰে সম্পৃক্ত কৰক" }, desc: { en: "Brine is first saturated with NH₃ gas in the ammonia saturation tower. NH₃ increases alkalinity of solution.", as: "এমোনিয়া সম্পৃক্তিকৰণ স্তম্ভত ব্ৰাইনক প্ৰথমে NH₃ গেছৰে সম্পৃক্ত কৰা হয়। NH₃-এ দ্ৰৱণৰ ক্ষাৰকত্ব বৃদ্ধি কৰে।" } },
      { label: { en: "Pass CO₂ Under Pressure", as: "চাপত CO₂ পাৰ কৰক" }, desc: { en: "CO₂ pumped into the ammoniated brine under pressure at ~10°C. CO₂ + H₂O → H₂CO₃ → HCO₃⁻ forms.", as: "~10°C-ত চাপত এমোনিয়াযুক্ত ব্ৰাইনত CO₂ পাম্প কৰা হয়। CO₂ + H₂O → H₂CO₃ → HCO₃⁻ গঠিত হয়।" } },
      { label: { en: "NaHCO₃ Precipitates", as: "NaHCO₃ অৱক্ষেপিত হয়" }, desc: { en: "HCO₃⁻ combines with Na⁺ to form NaHCO₃. It precipitates because it is less soluble in cold solution. NH₄Cl stays dissolved.", as: "HCO₃⁻-এ Na⁺-ৰ সৈতে যুক্ত হৈ NaHCO₃ গঠন কৰে। ঠাণ্ডা দ্ৰৱণত কম দ্ৰৱণীয় হোৱাৰ কাৰণে ই অৱক্ষেপিত হয়। NH₄Cl দ্ৰৱীভূত থাকে।" } },
      { label: { en: "Filter and Collect NaHCO₃", as: "NaHCO₃ চেকা আৰু সংগ্ৰহ কৰক" }, desc: { en: "White NaHCO₃ crystals filtered out. NH₄Cl solution treated with Ca(OH)₂ to recover NH₃ for recycling.", as: "বগা NaHCO₃ স্ফটিক চেকা হয়। NH₃ পুনৰ প্ৰাপ্তিৰ বাবে NH₄Cl দ্ৰৱণক Ca(OH)₂-ৰ সৈতে প্ৰক্ৰিয়া কৰা হয়।" } },
    ],
    ions: {
      reactants: [{ sym: "Na⁺", col: "#FDE047", desc: { en: "Sodium ion", as: "ছ'ডিয়াম আয়ন" } }, { sym: "NH₃", col: "#A78BFA", desc: { en: "Ammonia gas", as: "এমোনিয়া গেছ" } }, { sym: "CO₂", col: "#94A3B8", desc: { en: "Carbon dioxide", as: "কাৰ্বন ডাইঅক্সাইড" } }],
      products:  [{ sym: "NaHCO₃↓", col: "#E2E8F0", desc: { en: "Baking soda crystals", as: "বেকিং ছ'ডা স্ফটিক" } }, { sym: "NH₄⁺", col: "#A78BFA", desc: { en: "Ammonium ion (recycled)", as: "এমোনিয়াম আয়ন (পুনৰ ব্যৱহাৰ)" } }, { sym: "Cl⁻", col: "#67E8F9", desc: { en: "Chloride ion", as: "ক্ল'ৰাইড আয়ন" } }],
    },
    observations: { en: ["NH₃ saturates solution (pungent smell)", "CO₂ bubbles through ammoniated brine", "Solution becomes cloudy/milky", "White NaHCO₃ crystals precipitate", "Filtration separates NaHCO₃", "NH₄Cl remains in filtrate"], as: ["NH₃-এ দ্ৰৱণ সম্পৃক্ত কৰে (তীব্ৰ গন্ধ)", "CO₂-ৰ বুদবুদ এমোনিয়াযুক্ত ব্ৰাইনৰ মাজেদি যায়", "দ্ৰৱণ মেঘলা/গাখীৰৰ দৰে হয়", "বগা NaHCO₃ স্ফটিক অৱক্ষেপিত হয়", "পৰিষ্কৰণে NaHCO₃ পৃথক কৰে", "ছাঁকনিত NH₄Cl থাকে"] },
    quiz: [
      { q: { en: "Chemical name of baking soda:", as: "বেকিং ছ'ডাৰ ৰাসায়নিক নাম:" }, opts: { en: ["Na₂CO₃", "NaHCO₃", "NaCl", "NaOH"], as: ["Na₂CO₃", "NaHCO₃", "NaCl", "NaOH"] }, ans: 1 },
      { q: { en: "Industrial production of NaHCO₃ uses which process?", as: "NaHCO₃-ৰ শিল্প উৎপাদনত কোন প্ৰক্ৰিয়া?" }, opts: { en: ["Haber process", "Contact process", "Solvay process", "Chlor-Alkali process"], as: ["হেবাৰ প্ৰক্ৰিয়া", "কণ্টেক্ট প্ৰক্ৰিয়া", "ছলভে প্ৰক্ৰিয়া", "ক্ল'ৰ-এলকালি প্ৰক্ৰিয়া"] }, ans: 2 },
      { q: { en: "Why does NaHCO₃ precipitate in the Solvay process?", as: "ছলভে প্ৰক্ৰিয়াত NaHCO₃ অৱক্ষেপিত হোৱাৰ কাৰণ?" }, opts: { en: ["It is more reactive", "It is less soluble in cold solution", "It is a gas", "NH₃ pushes it out"], as: ["ই অধিক ক্ৰিয়াশীল", "ঠাণ্ডা দ্ৰৱণত কম দ্ৰৱণীয়", "ই এক গেছ", "NH₃-এ ইয়াক বাহিৰ ঠেলে"] }, ans: 1 },
      { q: { en: "Gas evolved when NaHCO₃ is heated:", as: "NaHCO₃ গৰম কৰিলে নিৰ্গত গেছ:" }, opts: { en: ["H₂", "NH₃", "CO₂", "Cl₂"], as: ["H₂", "NH₃", "CO₂", "Cl₂"] }, ans: 2 },
      { q: { en: "NaHCO₃ acts as antacid because:", as: "NaHCO₃-এ এণ্টাচিড হিচাপে কাম কৰে কাৰণ:" }, opts: { en: ["It is acidic", "It neutralises excess HCl in stomach", "It releases H₂", "It is alkaline metal"], as: ["ই অম্লীয়", "পাকস্থলীৰ অতিৰিক্ত HCl নিৰপেক্ষ কৰে", "H₂ নিৰ্গত কৰে", "ই ক্ষাৰকীয় ধাতু"] }, ans: 1 },
    ],
  },
  {
    id: "washing-soda", num: 4,
    title: { en: "Washing Soda", as: "ৱাশ্বিং ছ'ডা" },
    iupac: { en: "Sodium Carbonate Decahydrate (Na₂CO₃·10H₂O)", as: "ছ'ডিয়াম কাৰ্বনেট ডেকাহাইড্ৰেট (Na₂CO₃·10H₂O)" },
    subtitle: { en: "Thermal Decomposition + Recrystallisation", as: "তাপীয় বিযোজন + পুনৰ-স্ফটিকীকৰণ" },
    equation: "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂ | Na₂CO₃ + 10H₂O → Na₂CO₃·10H₂O",
    accent: "#FB923C", glow: "rgba(251,146,60,0.45)", gradFrom: "#C2410C", gradTo: "#FDBA74", emoji: "🔶",
    hazard: "MEDIUM", pmode: "furnace-heat",
    phaseGauges: {
      idle:     { temp: 25,  pressure: 1.0, yield_: 0   },
      step1:    { temp: 180, pressure: 1.0, yield_: 20  },
      step2:    { temp: 300, pressure: 1.0, yield_: 55  },
      reacting: { temp: 25,  pressure: 1.0, yield_: 85  },
      complete: { temp: 20,  pressure: 1.0, yield_: 100 },
    },
    phaseColors: {
      idle:     "rgba(255,220,180,0.1)",
      step1:    "rgba(255,200,130,0.2)",
      step2:    "rgba(255,180,80,0.35)",
      reacting: "rgba(220,235,255,0.4)",
      complete: "rgba(200,225,255,0.55)",
    },
    description: { en: "Baking soda (NaHCO₃) heated strongly gives soda ash (Na₂CO₃) — an anhydrous white solid. Na₂CO₃ dissolved in water and then allowed to cool gives large transparent crystals of washing soda (Na₂CO₃·10H₂O) — sodium carbonate decahydrate. Contains 10 water molecules of crystallisation.", as: "বেকিং ছ'ডা (NaHCO₃) জোৰেদি গৰম কৰিলে ছ'ডা এছ (Na₂CO₃) — এক নিৰ্জল বগা কঠিন পদাৰ্থ পোৱা যায়। Na₂CO₃ পানীত দ্ৰৱীভূত কৰি ঠণ্ডা হ'বলৈ দিলে ৱাশ্বিং ছ'ডাৰ (Na₂CO₃·10H₂O) ডাঙৰ স্বচ্ছ স্ফটিক পোৱা যায়। স্ফটিকীকৰণৰ 10টা পানী অণু থাকে।" },
    realWorld: { en: "Laundry detergent · Removing water hardness · Glass industry (soda glass) · Paper industry · Cleaning agent (soda water treatment) · pH control in pools", as: "ধোৱা ডিটাৰজেণ্ট · পানীৰ কঠিনতা আঁতৰোৱা · কাঁচ উদ্যোগ (ছ'ডা কাঁচ) · কাগজ উদ্যোগ · পৰিষ্কাৰক · পুলত pH নিয়ন্ত্ৰণ" },
    examNote: { en: "Na₂CO₃·10H₂O = washing soda (decahydrate). Made from NaHCO₃ by heating. Water of crystallisation = 10H₂O. Formula mass = 286 g/mol. CBSE: Na₂CO₃ is a salt of strong base (NaOH) and weak acid (H₂CO₃) → aqueous solution is alkaline. Removes permanent and temporary hardness of water.", as: "Na₂CO₃·10H₂O = ৱাশ্বিং ছ'ডা (ডেকাহাইড্ৰেট)। NaHCO₃ গৰম কৰি তৈয়াৰ। স্ফটিকীকৰণৰ পানী = 10H₂O। সূত্ৰ ভৰ = 286 g/mol। CBSE: Na₂CO₃ হ'ল শক্তিশালী ক্ষাৰ (NaOH) আৰু দুৰ্বল অম্ল (H₂CO₃)-ৰ লৱণ → জলীয় দ্ৰৱণ ক্ষাৰকীয়। পানীৰ স্থায়ী আৰু অস্থায়ী কঠিনতা আঁতৰায়।" },
    safety: { en: ["Hot furnace — thermal burns", "CO₂ released — ventilate", "Na₂CO₃ — corrosive in high concentration", "Eye protection required"], as: ["গৰম ভাটি — তাপীয় দাহ", "CO₂ নিৰ্গত — বায়ু চলাচল কৰক", "Na₂CO₃ — উচ্চ ঘনত্বত ক্ষয়কাৰক", "চোকা সুৰক্ষা প্ৰয়োজন"] },
    steps: [
      { label: { en: "Load NaHCO₃ into Calcination Furnace", as: "ক্যালচিনেচন ভাটিত NaHCO₃ ভৰক" }, desc: { en: "Sodium hydrogencarbonate (baking soda) loaded into industrial rotary furnace. Temperature raised to 300°C for calcination.", as: "ছ'ডিয়াম হাইড্ৰ'জেনকাৰ্বনেট (বেকিং ছ'ডা) শিল্প ঘূৰা ভাটিত ভৰক। ক্যালচিনেচনৰ বাবে উষ্ণতা 300°C-লৈ বৃদ্ধি কৰা হয়।" } },
      { label: { en: "Thermal Decomposition", as: "তাপীয় বিযোজন" }, desc: { en: "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑. Water and CO₂ driven off as gases. White anhydrous soda ash (Na₂CO₃) remains.", as: "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑। পানী আৰু CO₂ গেছ হিচাপে বাহিৰ হয়। বগা নিৰ্জল ছ'ডা এছ (Na₂CO₃) থাকে।" } },
      { label: { en: "Dissolve and Crystallise", as: "দ্ৰৱীভূত আৰু স্ফটিকীকৰণ" }, desc: { en: "Soda ash dissolved in hot water. Solution cooled slowly in crystallisation tanks. Na₂CO₃·10H₂O crystals nucleate and grow.", as: "গৰম পানীত ছ'ডা এছ দ্ৰৱীভূত কৰা হয়। স্ফটিকীকৰণ পাত্ৰত দ্ৰৱণ লাহে লাহে ঠণ্ডা কৰা হয়। Na₂CO₃·10H₂O স্ফটিক গঠিত আৰু বৃদ্ধি হয়।" } },
      { label: { en: "Collect Washing Soda Crystals", as: "ৱাশ্বিং ছ'ডা স্ফটিক সংগ্ৰহ কৰক" }, desc: { en: "Large transparent crystals of Na₂CO₃·10H₂O harvested. Each formula unit contains 10 water molecules of crystallisation.", as: "Na₂CO₃·10H₂O-ৰ ডাঙৰ স্বচ্ছ স্ফটিক সংগ্ৰহ। প্ৰতিটো সূত্ৰ এককত স্ফটিকীকৰণৰ 10টা পানী অণু আছে।" } },
    ],
    ions: {
      reactants: [{ sym: "NaHCO₃", col: "#E2E8F0", desc: { en: "Baking soda (heated)", as: "বেকিং ছ'ডা (গৰম কৰা)" } }, { sym: "H₂O", col: "#67E8F9", desc: { en: "Water (crystallisation)", as: "পানী (স্ফটিকীকৰণ)" } }],
      products:  [{ sym: "Na₂CO₃", col: "#FDBA74", desc: { en: "Soda ash (anhydrous)", as: "ছ'ডা এছ (নিৰ্জল)" } }, { sym: "CO₂↑", col: "#94A3B8", desc: { en: "Carbon dioxide gas", as: "কাৰ্বন ডাইঅক্সাইড গেছ" } }, { sym: "Na₂CO₃·10H₂O", col: "#BAE6FD", desc: { en: "Washing soda crystals", as: "ৱাশ্বিং ছ'ডা স্ফটিক" } }],
    },
    observations: { en: ["NaHCO₃ decomposes with CO₂ evolution", "Furnace temperature maintained at 300°C", "White soda ash (Na₂CO₃) forms", "Cooling solution becomes cloudy", "Large transparent crystals grow", "10 water molecules bound per formula unit"], as: ["NaHCO₃ CO₂ নিৰ্গমনৰ সৈতে বিযোজিত হয়", "ভাটিৰ উষ্ণতা 300°C-ত বজাই ৰখা হয়", "বগা ছ'ডা এছ (Na₂CO₃) গঠিত হয়", "ঠণ্ডা দ্ৰৱণ মেঘলা হয়", "ডাঙৰ স্বচ্ছ স্ফটিক বৃদ্ধি পায়", "প্ৰতি সূত্ৰ এককত 10টা পানী অণু আবদ্ধ"] },
    quiz: [
      { q: { en: "Chemical formula of washing soda:", as: "ৱাশ্বিং ছ'ডাৰ ৰাসায়নিক সূত্ৰ:" }, opts: { en: ["Na₂CO₃", "NaHCO₃", "Na₂CO₃·10H₂O", "Na₂SO₄·10H₂O"], as: ["Na₂CO₃", "NaHCO₃", "Na₂CO₃·10H₂O", "Na₂SO₄·10H₂O"] }, ans: 2 },
      { q: { en: "Washing soda contains how many water molecules?", as: "ৱাশ্বিং ছ'ডাত কিমানটা পানী অণু আছে?" }, opts: { en: ["5", "7", "10", "2"], as: ["5", "7", "10", "2"] }, ans: 2 },
      { q: { en: "Gas evolved when NaHCO₃ is heated to make Na₂CO₃:", as: "Na₂CO₃ তৈয়াৰ কৰিবলৈ NaHCO₃ গৰম কৰিলে নিৰ্গত গেছ:" }, opts: { en: ["H₂", "Cl₂", "CO₂ + H₂O", "NH₃"], as: ["H₂", "Cl₂", "CO₂ + H₂O", "NH₃"] }, ans: 2 },
      { q: { en: "Washing soda is used for:", as: "ৱাশ্বিং ছ'ডা ব্যৱহাৰ হয়:" }, opts: { en: ["Making POP", "Removing water hardness", "Bleaching", "Electroplating"], as: ["POP তৈয়াৰ", "পানীৰ কঠিনতা আঁতৰোৱা", "বিৰঞ্জন", "তড়িৎলেপন"] }, ans: 1 },
      { q: { en: "Na₂CO₃ solution is alkaline because:", as: "Na₂CO₃ দ্ৰৱণ ক্ষাৰকীয় কাৰণ:" }, opts: { en: ["Na⁺ is acidic", "CO₃²⁻ hydrolyses to give OH⁻", "It contains NaOH", "Water is alkaline"], as: ["Na⁺ অম্লীয়", "CO₃²⁻-এ জলবিভাজনত OH⁻ দিয়ে", "ইয়াত NaOH আছে", "পানী ক্ষাৰকীয়"] }, ans: 1 },
    ],
  },
  {
    id: "plaster-of-paris", num: 5,
    title: { en: "Plaster of Paris", as: "প্লাষ্টাৰ অৱ পেৰিছ" },
    iupac: { en: "Calcium Sulphate Hemihydrate (CaSO₄·½H₂O)", as: "কেলচিয়াম ছালফেট হেমিহাইড্ৰেট (CaSO₄·½H₂O)" },
    subtitle: { en: "Controlled Dehydration of Gypsum", as: "জিপচামৰ নিয়ন্ত্ৰিত নিৰ্জলীকৰণ" },
    equation: "CaSO₄·2H₂O → CaSO₄·½H₂O + 1½H₂O↑",
    accent: "#E2E8F0", glow: "rgba(226,232,240,0.4)", gradFrom: "#64748B", gradTo: "#CBD5E1", emoji: "🏛️",
    hazard: "LOW", pmode: "steam-vent",
    phaseGauges: {
      idle:     { temp: 25,  pressure: 1.0, yield_: 0   },
      step1:    { temp: 80,  pressure: 1.0, yield_: 10  },
      step2:    { temp: 120, pressure: 1.2, yield_: 50  },
      reacting: { temp: 150, pressure: 1.3, yield_: 82  },
      complete: { temp: 60,  pressure: 1.0, yield_: 100 },
    },
    phaseColors: {
      idle:     "rgba(226,232,240,0.5)",
      step1:    "rgba(220,228,238,0.55)",
      step2:    "rgba(214,222,235,0.6)",
      reacting: "rgba(248,250,252,0.65)",
      complete: "rgba(250,252,254,0.7)",
    },
    description: { en: "Plaster of Paris is made by heating gypsum (CaSO₄·2H₂O) to exactly 100–120°C (not above 150°C). At this temperature, 1½ water molecules are removed, giving the hemihydrate CaSO₄·½H₂O. Above 200°C it becomes completely anhydrous (dead burnt) and loses the ability to set with water.", as: "জিপচাম (CaSO₄·2H₂O) ঠিক 100–120°C-লৈ (150°C-ৰ ওপৰত নহয়) গৰম কৰি প্লাষ্টাৰ অৱ পেৰিছ তৈয়াৰ হয়। এই উষ্ণতাত 1½টা পানী অণু আঁতৰি গৈ হেমিহাইড্ৰেট CaSO₄·½H₂O পোৱা যায়। 200°C-ৰ ওপৰত ই সম্পূৰ্ণ নিৰ্জল (মৃত দগ্ধ) হয় আৰু পানীৰ সৈতে জমা হোৱাৰ ক্ষমতা হেৰুৱায়।" },
    realWorld: { en: "Medical plaster casts · Sculptures · Fire-resistant building boards · Dental moulding · Ornamental plasterwork · Architecture · Crack filling", as: "চিকিৎসা প্লাষ্টাৰ ঢালাই · ভাস্কৰ্য · অগ্নিৰোধী নিৰ্মাণ বোৰ্ড · দন্তীয় ছাঁচ · অলংকাৰমূলক প্লাষ্টাৰ · স্থাপত্য · ফাট পূৰণ" },
    examNote: { en: "CaSO₄·½H₂O = POP = Plaster of Paris. GYPSUM has 2H₂O, POP has ½H₂O. POP + H₂O → Gypsum (sets). Setting of POP: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O (gypsum again — exothermic, expands slightly). Temperature MUST be 100–150°C — NOT above (dead burnt). CBSE: hemihydrate.", as: "CaSO₄·½H₂O = POP = প্লাষ্টাৰ অৱ পেৰিছ। জিপচামত 2H₂O আছে, POPত ½H₂O আছে। POP + H₂O → জিপচাম (জমে)। POPৰ জমা: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O (পুনৰ জিপচাম — তাপোৎপাদী)। উষ্ণতা অৱশ্যই 100–150°C হ'ব লাগিব (মৃত দগ্ধ নহয়)। CBSE: হেমিহাইড্ৰেট।" },
    safety: { en: ["Temperature must not exceed 150°C", "Dead burnt POP (above 200°C) is unusable", "Fine powder — respiratory irritant", "Eye protection when handling powder"], as: ["উষ্ণতা 150°C-ৰ বেছি হ'ব নালাগে", "মৃত দগ্ধ POP (200°C-ৰ ওপৰত) অব্যৱহাৰযোগ্য", "মিহি গুড়ি — শ্বাসতন্ত্ৰৰ বাবে উদ্বেগজনক", "গুড়ি ব্যৱহাৰত চোকা সুৰক্ষা"] },
    steps: [
      { label: { en: "Load Gypsum (CaSO₄·2H₂O)", as: "জিপচাম (CaSO₄·2H₂O) ভৰক" }, desc: { en: "White gypsum rock (dihydrate) crushed and loaded into the rotary kiln. Initial temperature is 25°C.", as: "বগা জিপচাম শিল (ডাইহাইড্ৰেট) চূৰ্ণ কৰি ঘূৰা ভাটিত ভৰক। আৰম্ভণিৰ উষ্ণতা 25°C।" } },
      { label: { en: "Heat to 100–120°C (Calcination)", as: "100–120°C-লৈ গৰম কৰক (ক্যালচিনেচন)" }, desc: { en: "Temperature carefully raised. At ~100°C, water of crystallisation begins to escape as steam. ½ + 1 water molecules depart.", as: "উষ্ণতা সাৱধানে বৃদ্ধি কৰা হয়। ~100°C-ত স্ফটিকীকৰণৰ পানী বাষ্প হিচাপে ওলাবলৈ আৰম্ভ কৰে। ½ + 1টা পানী অণু ওলায়।" } },
      { label: { en: "Monitor Steam Release", as: "বাষ্প নিৰ্গমন নিৰীক্ষণ কৰক" }, desc: { en: "White steam vents from the kiln. Gypsum loses 1½H₂O progressively. White powder (POP) forms inside kiln.", as: "ভাটিৰ পৰা বগা বাষ্প নিৰ্গত হয়। জিপচাম ক্ৰমশঃ 1½H₂O হেৰুৱায়। ভাটিৰ ভিতৰত বগা গুড়ি (POP) গঠিত হয়।" } },
      { label: { en: "Collect and Grind POP Powder", as: "POP গুড়ি সংগ্ৰহ আৰু পিষক" }, desc: { en: "Temperature controlled — MUST not exceed 150°C. Fine white POP powder collected. Cooled before storage. Sets with water.", as: "উষ্ণতা নিয়ন্ত্ৰণ — 150°C-ৰ বেছি হ'ব নালাগে। মিহি বগা POP গুড়ি সংগ্ৰহ। সংৰক্ষণৰ আগতে ঠণ্ডা। পানীৰ সৈতে জমে।" } },
    ],
    ions: {
      reactants: [{ sym: "CaSO₄·2H₂O", col: "#E2E8F0", desc: { en: "Gypsum (dihydrate)", as: "জিপচাম (ডাইহাইড্ৰেট)" } }],
      products:  [{ sym: "CaSO₄·½H₂O", col: "#F8FAFC", desc: { en: "POP (hemihydrate)", as: "POP (হেমিহাইড্ৰেট)" } }, { sym: "1½H₂O↑", col: "#67E8F9", desc: { en: "Water vapour released", as: "জলীয় বাষ্প নিৰ্গত" } }],
    },
    observations: { en: ["Gypsum (white solid) loaded into kiln", "Steam vents as temperature rises", "White powder gradually forms", "Mass decreases (water lost)", "Fine white POP powder produced", "POP sets solid when mixed with water"], as: ["জিপচাম (বগা কঠিন) ভাটিত ভৰোৱা হয়", "উষ্ণতা বৃদ্ধিৰ লগে লগে বাষ্প ওলায়", "বগা গুড়ি ক্ৰমশঃ গঠিত হয়", "ভৰ হ্ৰাস পায় (পানী হেৰায়)", "মিহি বগা POP গুড়ি উৎপন্ন", "পানীৰ সৈতে মিহলিলে POP কঠিন জমে"] },
    quiz: [
      { q: { en: "Chemical formula of Plaster of Paris:", as: "প্লাষ্টাৰ অৱ পেৰিছৰ ৰাসায়নিক সূত্ৰ:" }, opts: { en: ["CaSO₄", "CaSO₄·2H₂O", "CaSO₄·½H₂O", "CaSO₄·10H₂O"], as: ["CaSO₄", "CaSO₄·2H₂O", "CaSO₄·½H₂O", "CaSO₄·10H₂O"] }, ans: 2 },
      { q: { en: "POP is made by heating gypsum at:", as: "POP তৈয়াৰ হয় জিপচাম গৰম কৰিলে:" }, opts: { en: ["200°C+", "50°C", "100–150°C", "300°C"], as: ["200°C-ৰ ওপৰত", "50°C", "100–150°C", "300°C"] }, ans: 2 },
      { q: { en: "When POP sets with water, it forms:", as: "POP পানীৰ সৈতে জমিলে গঠিত হয়:" }, opts: { en: ["CaO", "CaSO₄ (anhydrous)", "CaSO₄·2H₂O (gypsum)", "Ca(OH)₂"], as: ["CaO", "CaSO₄ (নিৰ্জল)", "CaSO₄·2H₂O (জিপচাম)", "Ca(OH)₂"] }, ans: 2 },
      { q: { en: "'Dead burnt' POP occurs above:", as: "'মৃত দগ্ধ' POP কোন তাপমাত্ৰাৰ ওপৰত হয়:" }, opts: { en: ["100°C", "150°C", "200°C", "50°C"], as: ["100°C", "150°C", "200°C", "50°C"] }, ans: 2 },
      { q: { en: "POP is used in:", as: "POP ব্যৱহাৰ হয়:" }, opts: { en: ["Soap making", "Fertilisers", "Medical casts and moulds", "Making NaOH"], as: ["চাবোন প্ৰস্তুতি", "সাৰ", "চিকিৎসা ঢালাই আৰু ছাঁচ", "NaOH তৈয়াৰ"] }, ans: 2 },
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

      if (mode === "electrolysis") {
        // Cl₂ at anode (right) — yellow-green large bubbles
        if (Math.random() < 0.45 * intensity) ps.push({
          x: W() * 0.65 + Math.random() * W() * 0.2, y: H() * 0.7 + Math.random() * H() * 0.15,
          vx: (Math.random() - 0.5) * 1, vy: -1.5 - Math.random() * 2,
          life: 80, maxLife: 80, size: 4 + Math.random() * 6,
          color: `rgba(190,242,100,${0.55 + Math.random() * 0.3})`, blur: 7, type: "cl2",
        });
        // H₂ at cathode (left) — small white/blue bubbles
        if (Math.random() < 0.55 * intensity) ps.push({
          x: W() * 0.15 + Math.random() * W() * 0.2, y: H() * 0.7 + Math.random() * H() * 0.15,
          vx: (Math.random() - 0.5) * 0.8, vy: -2 - Math.random() * 2.5,
          life: 60, maxLife: 60, size: 2 + Math.random() * 4,
          color: `rgba(200,230,255,${0.6 + Math.random() * 0.35})`, blur: 5, type: "h2",
        });
        // Electric sparks
        if (Math.random() < 0.12 * intensity) {
          const sx = W() * 0.1 + Math.random() * W() * 0.8;
          ps.push({ x: sx, y: H() * 0.4 + Math.random() * H() * 0.2, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, life: 15, maxLife: 15, size: 1.5 + Math.random()*2, color: "rgba(253,224,71,0.95)", blur: 12, type: "spark" });
        }
      }

      if (mode === "chlorine-diff") {
        // Yellow-green Cl₂ diffusing
        if (Math.random() < 0.3 * intensity) ps.push({
          x: W() * 0.05 + Math.random() * W() * 0.3, y: H() * 0.2 + Math.random() * H() * 0.4,
          vx: 0.5 + Math.random() * 1.5, vy: (Math.random() - 0.5) * 0.8,
          life: 120, maxLife: 120, size: 5 + Math.random() * 8,
          color: `rgba(163,230,53,${0.25 + Math.random() * 0.25})`, blur: 12, type: "cl2",
        });
        // Powder particles
        if (Math.random() < 0.2 * intensity) ps.push({
          x: W() * 0.3 + Math.random() * W() * 0.4, y: H() * 0.4 + Math.random() * H() * 0.4,
          vx: (Math.random() - 0.5) * 0.5, vy: -0.3 - Math.random() * 0.5,
          life: 80, maxLife: 80, size: 2 + Math.random() * 3,
          color: `rgba(240,250,240,${0.5 + Math.random() * 0.4})`, blur: 3, type: "powder",
        });
      }

      if (mode === "crystal-form") {
        // CO₂ bubbles rising
        if (Math.random() < 0.3 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6, y: H() * 0.6 + Math.random() * H() * 0.25,
          vx: (Math.random() - 0.5) * 0.8, vy: -1 - Math.random() * 1.5,
          life: 70, maxLife: 70, size: 2.5 + Math.random() * 4,
          color: `rgba(200,230,255,${0.5 + Math.random() * 0.35})`, blur: 5, type: "co2",
        });
        // Crystal settling
        if (Math.random() < 0.2 * intensity) ps.push({
          x: W() * 0.15 + Math.random() * W() * 0.7, y: H() * 0.15 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 0.4, vy: 0.5 + Math.random() * 1,
          life: 100, maxLife: 100, size: 3 + Math.random() * 5,
          color: `rgba(255,255,255,${0.6 + Math.random() * 0.35})`, blur: 4, type: "crystal",
        });
      }

      if (mode === "furnace-heat") {
        // Heat shimmer / fire glow
        if (Math.random() < 0.35 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6, y: H() * 0.55 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 1.5, vy: -2 - Math.random() * 3,
          life: 40, maxLife: 40, size: 3 + Math.random() * 5,
          color: `rgba(${Math.random()>0.5?"251,146,60":"253,186,116"},${0.4+Math.random()*0.4})`, blur: 10, type: "heat",
        });
        // Steam
        if (Math.random() < 0.25 * intensity) ps.push({
          x: W() * 0.3 + Math.random() * W() * 0.4, y: H() * 0.2 + Math.random() * H() * 0.2,
          vx: (Math.random() - 0.5) * 1, vy: -1.5 - Math.random() * 2,
          life: 60, maxLife: 60, size: 4 + Math.random() * 7,
          color: `rgba(240,248,255,${0.3 + Math.random() * 0.3})`, blur: 10, type: "steam",
        });
      }

      if (mode === "steam-vent") {
        // White steam venting upward
        if (Math.random() < 0.3 * intensity) ps.push({
          x: W() * 0.3 + Math.random() * W() * 0.4, y: H() * 0.3 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 1.2, vy: -1 - Math.random() * 2,
          life: 80, maxLife: 80, size: 4 + Math.random() * 8,
          color: `rgba(248,250,252,${0.35 + Math.random() * 0.35})`, blur: 12, type: "steam",
        });
        // Fine powder dust
        if (Math.random() < 0.15 * intensity) ps.push({
          x: W() * 0.2 + Math.random() * W() * 0.6, y: H() * 0.5 + Math.random() * H() * 0.3,
          vx: (Math.random() - 0.5) * 0.8, vy: -0.3 - Math.random() * 0.6,
          life: 60, maxLife: 60, size: 1.5 + Math.random() * 2.5,
          color: `rgba(240,245,250,${0.5 + Math.random() * 0.4})`, blur: 3, type: "dust",
        });
      }
    }

    function draw() {
      const ctx = canvas?.getContext("2d"); if (!ctx) return;
      ctx.clearRect(0, 0, W(), H());
      spawn();
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]; p.x += p.vx; p.y += p.vy; p.life--;
        if (p.type === "heat" || p.type === "steam") { p.vy -= 0.04; p.vx *= 0.99; }
        if (p.type === "cl2") { p.vx *= 0.98; }
        if (p.type === "spark") { p.vx *= 0.92; p.vy *= 0.92; }
        if (p.life <= 0) { ps.splice(i, 1); continue; }
        const a = p.life / p.maxLife;
        ctx.save(); ctx.globalAlpha = a;
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
// INDUSTRIAL GAUGES PANEL (unique to this lab)
// ═══════════════════════════════════════════════════════════

function IndustrialGaugesPanel({ proc, phase }: { proc: Proc; phase: Phase }) {
  const g = proc.phaseGauges[phase];
  const tempColor = g.temp > 200 ? "#EF4444" : g.temp > 100 ? "#FB923C" : g.temp > 50 ? "#FBBF24" : "#22C55E";
  const pressColor = g.pressure > 2.0 ? "#EF4444" : g.pressure > 1.5 ? "#FB923C" : "#22C55E";
  const { lang } = useLanguage();
  const isAs = lang === "as";

  return (
    <GlassPanel className="p-3">
      <div className="flex items-center gap-1.5 mb-3">
        <Gauge className="w-3.5 h-3.5" style={{ color: proc.accent }} />
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "শিল্প গেজ" : "Industrial Gauges"}</span>
      </div>

      {/* Temperature gauge */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex flex-col items-center">
          <Thermometer className="w-4 h-4 mb-1" style={{ color: tempColor }} />
          <motion.p className="text-lg font-black leading-none" animate={{ color: tempColor }} transition={{ duration: 0.5 }}>
            {g.temp}°
          </motion.p>
          <p className="text-[8px] text-slate-500">TEMP</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-500">{isAs ? "উষ্ণতা" : "Temperature"}</span>
            <span className="text-[9px] font-black" style={{ color: tempColor }}>{g.temp}°C</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${Math.min(100, g.temp / 3.5)}%` }} transition={{ duration: 1, ease: "easeOut" }}
              style={{ background: `linear-gradient(90deg, #22C55E, ${tempColor})`, boxShadow: `0 0 6px ${tempColor}` }} />
          </div>
        </div>
      </div>

      {/* Pressure */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-slate-500">{isAs ? "চাপ" : "Pressure"}</span>
          <span className="text-[9px] font-black" style={{ color: pressColor }}>{g.pressure.toFixed(1)} atm</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${Math.min(100, (g.pressure - 1) * 67)}%` }} transition={{ duration: 1 }}
            style={{ background: `linear-gradient(90deg, #22C55E, ${pressColor})`, boxShadow: `0 0 6px ${pressColor}` }} />
        </div>
      </div>

      {/* Product yield */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-slate-500">{isAs ? "উৎপাদৰ ফলাফল" : "Product Yield"}</span>
          <span className="text-[9px] font-black" style={{ color: proc.accent }}>{g.yield_}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${g.yield_}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ background: `linear-gradient(90deg, ${proc.gradFrom}, ${proc.gradTo})`, boxShadow: `0 0 8px ${proc.accent}` }} />
        </div>
      </div>

      {/* Process stage */}
      <div className="rounded-lg px-2.5 py-2 border text-center" style={{ background: `${proc.accent}0A`, borderColor: `${proc.accent}25` }}>
        <p className="text-[9px] text-slate-500 mb-0.5">Stage</p>
        <p className="text-[10px] font-black" style={{ color: proc.accent }}>
          {phase === "idle" ? (isAs ? "⏸ অপেক্ষাত" : "⏸ STANDBY") : phase === "step1" ? (isAs ? "🔄 লোড কৰিছে" : "🔄 LOADING") : phase === "step2" ? (isAs ? "⚡ সক্ৰিয় কৰিছে" : "⚡ ACTIVATING") : phase === "reacting" ? (isAs ? "🏭 উৎপাদন চলিছে" : "🏭 PRODUCING") : (isAs ? "✅ সম্পূৰ্ণ" : "✅ COMPLETE")}
        </p>
      </div>
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// APPARATUS SVG
// ═══════════════════════════════════════════════════════════

function ApparatusSVG({ proc, phase }: { proc: Proc; phase: Phase }) {
  const active = phase === "reacting" || phase === "complete";
  const anyActive = phase !== "idle";
  const g = proc.phaseGauges[phase];

  if (proc.id === "chlor-alkali") {
    const electActive = phase === "step2" || active;
    return (
      <svg viewBox="0 0 280 220" className="w-full h-full">
        <rect x="10" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Electrolysis cell body */}
        <rect x="40" y="70" width="200" height="130" rx="8" fill={electActive ? "rgba(251,191,36,0.06)" : "rgba(255,255,255,0.02)"} stroke={electActive ? "rgba(251,191,36,0.4)" : "#334155"} strokeWidth="2">
          {electActive && <animate attributeName="stroke" values="rgba(251,191,36,0.4);rgba(251,191,36,0.8);rgba(251,191,36,0.4)" dur="1.5s" repeatCount="indefinite" />}
        </rect>
        {/* Cell divider (membrane) */}
        <line x1="140" y1="72" x2="140" y2="198" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6,4" />
        <text x="140" y="68" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="6">MEMBRANE</text>
        {/* Brine fill */}
        <rect x="42" y={anyActive ? "120" : "145"} width="196" height={anyActive ? "77" : "53"} rx="0" fill="rgba(220,200,100,0.18)" />
        {/* CATHODE (left) — H₂ + NaOH side */}
        <rect x="80" y="78" width="8" height="115" rx="3" fill={electActive ? "#60A5FA" : "#334155"}>
          {electActive && <animate attributeName="fill" values="#60A5FA;#93C5FD;#60A5FA" dur="0.8s" repeatCount="indefinite" />}
        </rect>
        <text x="84" y="72" textAnchor="middle" fill="#60A5FA" fontSize="7" fontWeight="bold">−</text>
        <text x="84" y="64" textAnchor="middle" fill="#64748b" fontSize="5.5">CATHODE</text>
        <text x="95" y="200" textAnchor="middle" fill="#60A5FA" fontSize="6">NaOH+H₂</text>
        {/* ANODE (right) — Cl₂ side */}
        <rect x="192" y="78" width="8" height="115" rx="3" fill={electActive ? "#BEF264" : "#334155"}>
          {electActive && <animate attributeName="fill" values="#BEF264;#A3E635;#BEF264" dur="0.8s" begin="0.2s" repeatCount="indefinite" />}
        </rect>
        <text x="196" y="72" textAnchor="middle" fill="#BEF264" fontSize="7" fontWeight="bold">+</text>
        <text x="196" y="64" textAnchor="middle" fill="#64748b" fontSize="5.5">ANODE</text>
        <text x="185" y="200" textAnchor="middle" fill="#BEF264" fontSize="6">Cl₂↑</text>
        {/* Electrode wires to power supply */}
        <line x1="84" y1="78" x2="84" y2="48" stroke="#60A5FA" strokeWidth="2" />
        <line x1="196" y1="78" x2="196" y2="48" stroke="#BEF264" strokeWidth="2" />
        <rect x="100" y="28" width="80" height="22" rx="5" fill="#1e293b" stroke={electActive ? "#FBBF24" : "#334155"} strokeWidth="2">
          {electActive && <animate attributeName="stroke" values="#FBBF24;#FDE047;#FBBF24" dur="0.6s" repeatCount="indefinite" />}
        </rect>
        <text x="140" y="42" textAnchor="middle" fill={electActive ? "#FDE047" : "#64748b"} fontSize="8" fontWeight="bold">⚡ DC {electActive ? `${Math.round(g.temp * 3.5)}A` : "OFF"}</text>
        <line x1="84" y1="48" x2="100" y2="39" stroke="#60A5FA" strokeWidth="2" />
        <line x1="196" y1="48" x2="180" y2="39" stroke="#BEF264" strokeWidth="2" />
        {/* H₂ bubbles at cathode */}
        {electActive && [0,1,2].map(i => (
          <motion.circle key={i} cx={75+i*5} cy={160} r="3"
            fill="rgba(200,230,255,0.7)" stroke="rgba(200,230,255,0.3)" strokeWidth="0.5"
            animate={{ cy:[160,85], opacity:[0.8,0] }} transition={{ duration:1.2+i*0.2, repeat:Infinity, delay:i*0.4 }} />
        ))}
        {/* Cl₂ bubbles at anode */}
        {electActive && [0,1,2].map(i => (
          <motion.circle key={i} cx={188+i*5} cy={155} r="4"
            fill="rgba(190,242,100,0.65)" stroke="rgba(163,230,53,0.3)" strokeWidth="0.5"
            animate={{ cy:[155,80], opacity:[0.8,0] }} transition={{ duration:1+i*0.25, repeat:Infinity, delay:i*0.35 }} />
        ))}
        {/* Brine inlet pipe */}
        <rect x="20" y="130" width="20" height="14" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <text x="30" y="140" textAnchor="middle" fill="#64748b" fontSize="6.5">BRINE</text>
        <line x1="40" y1="137" x2="40" y2="137" stroke="#64748b" strokeWidth="2" />
        <text x="140" y="218" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="monospace">CHLOR-ALKALI ELECTROLYSIS CELL</text>
      </svg>
    );
  }

  if (proc.id === "bleaching-powder") {
    return (
      <svg viewBox="0 0 280 220" className="w-full h-full">
        <rect x="10" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Hasenclever rotating chamber (drum) */}
        <ellipse cx="140" cy="140" rx="80" ry="50" fill={active ? "rgba(134,239,172,0.06)" : "rgba(255,255,255,0.02)"} stroke={active ? "rgba(134,239,172,0.3)" : "#334155"} strokeWidth="2">
          {active && <animate attributeName="stroke" values="rgba(134,239,172,0.3);rgba(134,239,172,0.6);rgba(134,239,172,0.3)" dur="2s" repeatCount="indefinite" />}
        </ellipse>
        {/* Rotating paddles */}
        {active && [0,60,120,180,240,300].map((angle, i) => (
          <line key={i} x1="140" y1="140" x2={140 + Math.cos(angle * Math.PI/180) * 60} y2={140 + Math.sin(angle * Math.PI/180) * 38}
            stroke="rgba(255,255,255,0.15)" strokeWidth="2">
            <animateTransform attributeName="transform" type="rotate" from={`${angle} 140 140`} to={`${angle+360} 140 140`} dur="8s" repeatCount="indefinite" />
          </line>
        ))}
        {/* Ca(OH)₂ powder inside drum */}
        <ellipse cx="140" cy="168" rx="60" ry="12"
          fill={active ? "rgba(200,250,200,0.35)" : "rgba(230,235,240,0.6)"} />
        {!active && <text x="140" y="172" textAnchor="middle" fill="rgba(200,210,220,0.8)" fontSize="7" fontWeight="bold">Ca(OH)₂ (dry)</text>}
        {active && <text x="140" y="172" textAnchor="middle" fill="rgba(200,240,200,0.8)" fontSize="7" fontWeight="bold">CaOCl₂ forming</text>}
        {/* Cl₂ inlet pipe (left) */}
        <rect x="20" y="108" width="42" height="16" rx="5" fill="#1e293b" stroke="rgba(163,230,53,0.5)" strokeWidth="1.5" />
        <text x="41" y="119" textAnchor="middle" fill="#86EFAC" fontSize="7" fontWeight="bold">Cl₂ →</text>
        <path d="M62,116 L60,116" fill="none" stroke="rgba(163,230,53,0.4)" strokeWidth="2" />
        {/* Cl₂ gas flow arrows */}
        {anyActive && (
          <path d="M62,116 L76,130 Q80,135 88,138" fill="none" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" strokeDasharray="4,2">
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
          </path>
        )}
        {/* HCl outlet pipe (right) */}
        <rect x="218" y="108" width="50" height="16" rx="5" fill="#1e293b" stroke="rgba(96,165,250,0.35)" strokeWidth="1.5" />
        <text x="243" y="119" textAnchor="middle" fill="#93C5FD" fontSize="6">← HCl/H₂O</text>
        {/* Temperature indicator */}
        <rect x="108" y="75" width="64" height="22" rx="5" fill="#1e293b" stroke={active ? "#86EFAC" : "#334155"} strokeWidth="1.5" />
        <text x="140" y="83" textAnchor="middle" fill={active ? "#86EFAC" : "#64748b"} fontSize="6">TEMP: {g.temp}°C</text>
        <text x="140" y="93" textAnchor="middle" fill={active ? "#86EFAC" : "#475569"} fontSize="5.5">{active ? "REACTION ACTIVE" : "STANDBY"}</text>
        <text x="140" y="218" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="monospace">HASENCLEVER CHAMBER — BLEACHING POWDER</text>
      </svg>
    );
  }

  if (proc.id === "baking-soda") {
    const pptAlpha = phase === "complete" ? 0.85 : phase === "reacting" ? 0.6 : phase === "step2" ? 0.3 : 0;
    return (
      <svg viewBox="0 0 280 220" className="w-full h-full">
        <rect x="10" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Solvay tower / precipitation tank */}
        <rect x="80" y="55" width="120" height="150" rx="8" fill="rgba(6,182,212,0.05)" stroke={anyActive ? "rgba(6,182,212,0.3)" : "#334155"} strokeWidth="2" />
        {/* Brine level */}
        <rect x="82" y={anyActive ? "100" : "160"} width="116" height={anyActive ? "103" : "43"} rx="0" fill="rgba(200,235,255,0.12)" />
        {/* NaHCO₃ precipitate settling at bottom */}
        {pptAlpha > 0 && (
          <ellipse cx="140" cy="194" rx="50" ry="8" fill={`rgba(240,248,255,${pptAlpha})`} />
        )}
        {pptAlpha > 0.5 && <text x="140" y="198" textAnchor="middle" fill="rgba(200,220,240,0.8)" fontSize="6">NaHCO₃ ↓</text>}
        {/* NH₃ inlet */}
        <rect x="20" y="80" width="60" height="16" rx="4" fill="#1e293b" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" />
        <text x="50" y="91" textAnchor="middle" fill="#A78BFA" fontSize="7">NH₃ →</text>
        <line x1="80" y1="88" x2="80" y2="88" stroke="rgba(167,139,250,0.4)" strokeWidth="2" />
        {anyActive && <path d="M80,88 L80,120" fill="none" stroke="rgba(167,139,250,0.35)" strokeWidth="1.5" strokeDasharray="4,2"><animate attributeName="stroke-dashoffset" from="0" to="-15" dur="0.7s" repeatCount="indefinite" /></path>}
        {/* CO₂ inlet */}
        <rect x="200" y="80" width="60" height="16" rx="4" fill="#1e293b" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
        <text x="230" y="91" textAnchor="middle" fill="#94A3B8" fontSize="7">← CO₂</text>
        {anyActive && <path d="M200,88 L200,120" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="1.5" strokeDasharray="4,2"><animate attributeName="stroke-dashoffset" from="0" to="-15" dur="0.9s" repeatCount="indefinite" /></path>}
        {/* Brine inlet top */}
        <rect x="110" y="35" width="60" height="18" rx="4" fill="#1e293b" stroke="rgba(253,224,71,0.35)" strokeWidth="1.5" />
        <text x="140" y="46" textAnchor="middle" fill="#FDE047" fontSize="7">↓ BRINE</text>
        <line x1="140" y1="53" x2="140" y2="55" stroke="rgba(253,224,71,0.4)" strokeWidth="2" />
        {/* CO₂ bubbles in solution */}
        {anyActive && [0,1,2].map(i => (
          <motion.circle key={i} cx={100+i*25} cy={165} r="3"
            fill="rgba(200,230,255,0.65)" stroke="rgba(200,230,255,0.2)" strokeWidth="0.4"
            animate={{ cy:[165,105], opacity:[0.7,0] }} transition={{ duration:2+i*0.3, repeat:Infinity, delay:i*0.5 }} />
        ))}
        {/* Temperature label */}
        <text x="140" y="75" textAnchor="middle" fill={anyActive ? "#22D3EE" : "#475569"} fontSize="7" fontWeight="bold">{g.temp}°C | {g.pressure} atm</text>
        <text x="140" y="218" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="monospace">SOLVAY PRECIPITATION TOWER</text>
      </svg>
    );
  }

  if (proc.id === "washing-soda") {
    const isCalcining = phase === "step1" || phase === "step2";
    const isCrystallising = phase === "reacting" || phase === "complete";
    return (
      <svg viewBox="0 0 280 220" className="w-full h-full">
        <rect x="10" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Calcination furnace */}
        <rect x="20" y="60" width="100" height="100" rx="10" fill={isCalcining ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.02)"} stroke={isCalcining ? "#FB923C" : "#334155"} strokeWidth="2.5">
          {isCalcining && <animate attributeName="stroke" values="#FB923C;#FDBA74;#FB923C" dur="1s" repeatCount="indefinite" />}
        </rect>
        <text x="70" y="90" textAnchor="middle" fill={isCalcining ? "#FDBA74" : "#475569"} fontSize="7" fontWeight="bold">CALCINATION</text>
        <text x="70" y="102" textAnchor="middle" fill={isCalcining ? "#FB923C" : "#64748b"} fontSize="8" fontWeight="bold">{g.temp}°C</text>
        {/* NaHCO₃ inside furnace */}
        <ellipse cx="70" cy="142" rx="32" ry="8" fill={isCalcining ? "rgba(251,146,60,0.35)" : "rgba(230,235,240,0.6)"} />
        <text x="70" y="146" textAnchor="middle" fill={isCalcining ? "#FDBA74" : "rgba(200,210,220,0.8)"} fontSize="6.5">
          {isCalcining ? "Na₂CO₃" : "NaHCO₃"}
        </text>
        {/* CO₂ + H₂O gas outlet from furnace */}
        {isCalcining && (
          <path d="M70,60 Q70,35 70,20" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="2">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </path>
        )}
        {isCalcining && <text x="70" y="18" textAnchor="middle" fill="#94A3B8" fontSize="7">CO₂+H₂O↑</text>}
        {/* Pipe from furnace to crystalliser */}
        <path d="M120,110 L160,110" fill="none" stroke={anyActive ? "#64748b" : "#334155"} strokeWidth="3" strokeLinecap="round" />
        <text x="140" y="106" textAnchor="middle" fill="#475569" fontSize="6">Na₂CO₃ aq.</text>
        {/* Crystallisation drum */}
        <ellipse cx="210" cy="110" rx="55" ry="45" fill={isCrystallising ? "rgba(186,230,253,0.1)" : "rgba(255,255,255,0.02)"} stroke={isCrystallising ? "rgba(186,230,253,0.4)" : "#334155"} strokeWidth="2" />
        <text x="210" y="95" textAnchor="middle" fill={isCrystallising ? "#BAE6FD" : "#475569"} fontSize="6.5" fontWeight="bold">CRYSTALLISER</text>
        <text x="210" y="108" textAnchor="middle" fill={isCrystallising ? "#67E8F9" : "#64748b"} fontSize="6">+10H₂O</text>
        {/* Crystal growth inside drum */}
        {isCrystallising && [0,1,2,3].map(i => (
          <motion.rect key={i} x={188+i*8} y={115+i%2*4} width={5+i%2*3} height={8+i%2*4} rx="1"
            fill="rgba(200,235,255,0.75)" stroke="rgba(148,210,255,0.4)" strokeWidth="0.5"
            animate={{ scaleY:[0.3,1,0.3], opacity:[0.5,0.9,0.5] }} transition={{ duration:2, repeat:Infinity, delay:i*0.5 }} />
        ))}
        {isCrystallising && <text x="210" y="145" textAnchor="middle" fill="#67E8F9" fontSize="6">Na₂CO₃·10H₂O</text>}
        <text x="140" y="218" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="monospace">CALCINATION FURNACE + CRYSTALLISER</text>
      </svg>
    );
  }

  // Plaster of Paris — rotary kiln
  const kilnActive = phase === "step1" || phase === "step2" || active;
  return (
    <svg viewBox="0 0 280 220" className="w-full h-full">
      <rect x="10" y="210" width="260" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Rotary kiln body (elongated cylinder) */}
      <ellipse cx="140" cy="130" rx="110" ry="55" fill={kilnActive ? "rgba(100,116,139,0.12)" : "rgba(255,255,255,0.02)"} stroke={kilnActive ? "#94A3B8" : "#334155"} strokeWidth="2.5" />
      {/* Kiln rotation animation */}
      {kilnActive && [0,45,90,135].map((a, i) => (
        <line key={i} x1="140" y1="130" x2={140 + Math.cos(a*Math.PI/180)*80} y2={130 + Math.sin(a*Math.PI/180)*42}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from={`${a} 140 130`} to={`${a+360} 140 130`} dur="6s" repeatCount="indefinite" />
        </line>
      ))}
      {/* Gypsum input (left) */}
      <rect x="15" y="118" width="40" height="24" rx="5" fill="#1e293b" stroke="rgba(226,232,240,0.4)" strokeWidth="1.5" />
      <text x="35" y="130" textAnchor="middle" fill="#E2E8F0" fontSize="6.5">GYPSUM</text>
      <text x="35" y="139" textAnchor="middle" fill="#94A3B8" fontSize="6">CaSO₄·2H₂O</text>
      {/* Burner (below kiln) */}
      <rect x="100" y="188" width="80" height="16" rx="5" fill="#1e293b" stroke={kilnActive ? "#FB923C" : "#334155"} strokeWidth="1.5" />
      <text x="140" y="199" textAnchor="middle" fill={kilnActive ? "#FB923C" : "#64748b"} fontSize="7" fontWeight="bold">⊞ BURNER {g.temp}°C</text>
      {/* Flame glow */}
      {kilnActive && <ellipse cx="140" cy="185" rx="50" ry="15" fill="#FB923C" opacity="0.08"><animate attributeName="opacity" values="0.08;0.18;0.08" dur="1s" repeatCount="indefinite" /></ellipse>}
      {/* Steam vents */}
      {kilnActive && (
        <>
          {[100, 140, 180].map((x, i) => (
            <motion.ellipse key={i} cx={x} cy={85} rx={8+i*2} ry={6+i}
              fill="rgba(240,248,255,0.25)"
              animate={{ cy:[85,55], ry:[6+i,12+i], opacity:[0.4,0] }}
              transition={{ duration:1.5, repeat:Infinity, delay:i*0.5 }} />
          ))}
          <text x="140" y="48" textAnchor="middle" fill="rgba(200,220,240,0.6)" fontSize="7">1½H₂O ↑ steam</text>
        </>
      )}
      {/* POP powder output (right) */}
      <rect x="225" y="118" width="42" height="24" rx="5" fill="#1e293b" stroke={active ? "rgba(200,210,220,0.5)" : "#334155"} strokeWidth="1.5" />
      <text x="246" y="130" textAnchor="middle" fill={active ? "#E2E8F0" : "#64748b"} fontSize="6.5">POP</text>
      <text x="246" y="139" textAnchor="middle" fill={active ? "#CBD5E1" : "#475569"} fontSize="6">CaSO₄·½H₂O</text>
      {/* Inside kiln material colour change */}
      <ellipse cx="140" cy="148" rx="70" ry="20" fill={kilnActive ? "rgba(226,232,240,0.2)" : "rgba(226,232,240,0.35)"} />
      <text x="140" y="152" textAnchor="middle" fill="rgba(200,210,220,0.7)" fontSize="7">
        {active ? "POP (white powder)" : "Gypsum (white solid)"}
      </text>
      <text x="140" y="218" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="monospace">ROTARY KILN — PLASTER OF PARIS PRODUCTION</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// ION PANEL
// ═══════════════════════════════════════════════════════════

function IonPanel({ proc, phase }: { proc: Proc; phase: Phase }) {
  const showAfter = phase === "reacting" || phase === "complete";
  const ions = showAfter ? proc.ions.products : proc.ions.reactants;
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "আণৱিক দৃশ্য" : "Molecular View"}</span>
        <motion.span className="text-[10px] font-black" animate={{ color: proc.accent }}>{showAfter ? (isAs ? "উৎপাদ" : "Products") : (isAs ? "বিক্ৰিয়াকাৰক" : "Reactants")}</motion.span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={showAfter ? "p" : "r"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          className="flex flex-wrap gap-2 justify-center py-2">
          {ions.map((ion, i) => (
            <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.09 }}
              className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[9px] font-black border-2 relative"
                style={{ background: `${ion.col}15`, borderColor: `${ion.col}50`, color: ion.col, boxShadow: `0 0 12px ${ion.col}44` }}>
                <motion.div className="absolute inset-0 rounded-full" animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2.2, repeat: Infinity }}>
                  <div className="w-full h-full rounded-full" style={{ background: `radial-gradient(circle, ${ion.col}22, transparent)` }} />
                </motion.div>
                <span className="relative text-center leading-tight px-1">{ion.sym.length > 6 ? ion.sym.slice(0,6) : ion.sym}</span>
              </div>
              <span className="text-[7px] text-slate-500 text-center max-w-[52px] leading-tight">{pickLang(ion.desc, lang)}</span>
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

function QuizSection({ proc }: { proc: Proc }) {
  const { recordQuizResult } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [answers, setAnswers] = useState<(number | null)[]>(proc.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.filter((a, i) => a === proc.quiz[i].ans).length;
  return (
    <GlassPanel className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "CBSE কুইজ" : "CBSE Quiz"}</span>
        {submitted && <NeonBadge label={`${score}/${proc.quiz.length}`} color={score === proc.quiz.length ? "#34D399" : proc.accent} />}
      </div>
      <div className="space-y-3">
        {proc.quiz.map((q, qi) => (
          <div key={qi} className="rounded-xl p-2.5 border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <p className="text-xs font-black text-white mb-2">{qi + 1}. {pickLang(q.q, lang)}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {pickLang(q.opts, lang).map((opt, oi) => {
                const sel = answers[qi] === oi, correct = submitted && oi === q.ans, wrong = submitted && sel && oi !== q.ans;
                return (
                  <button key={oi} disabled={submitted} onClick={() => setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })}
                    className="text-left text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all"
                    style={{
                      borderColor: correct ? "#34D399" : wrong ? "#EF4444" : sel ? `${proc.accent}88` : "rgba(255,255,255,0.08)",
                      background: correct ? "rgba(52,211,153,0.12)" : wrong ? "rgba(239,68,68,0.12)" : sel ? `${proc.accent}15` : "rgba(255,255,255,0.02)",
                      color: correct ? "#34D399" : wrong ? "#EF4444" : sel ? proc.accent : "#94a3b8",
                    }}>{opt}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={() => { const correct = answers.filter((a, i) => a === proc.quiz[i].ans).length; recordQuizResult({ score: Math.round((correct / proc.quiz.length) * 100), totalCorrect: correct, totalAttempted: proc.quiz.length }); setSubmitted(true); }} disabled={answers.some(a => a === null)}
          className="mt-3 w-full py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-40 hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${proc.gradFrom}, ${proc.gradTo})` }}>{isAs ? "উত্তৰ জমা দিয়ক" : "Submit Answers"}</button>
      ) : (
        <div className="mt-3 text-center">
          <div className="text-xl mb-1">{score === proc.quiz.length ? "🎉" : "📚"}</div>
          <p className="text-xs font-black" style={{ color: proc.accent }}>{score === proc.quiz.length ? (isAs ? "শাবাশ! পৰীক্ষাৰ বাবে সাজু!" : "Perfect Score!") : `${score}/${proc.quiz.length} — ${isAs ? "অভ্যাস কৰি থাকক" : "Keep revising"}`}</p>
          <button onClick={() => { setAnswers(proc.quiz.map(() => null)); setSubmitted(false); }} className="mt-2 text-[10px] text-slate-400 underline">{isAs ? "পুনৰ কুইজ দিয়ক" : "Retry Quiz"}</button>
        </div>
      )}
    </GlassPanel>
  );
}

// ═══════════════════════════════════════════════════════════
// PRODUCTION ROOM
// ═══════════════════════════════════════════════════════════

function ProductionRoom({ proc, onBack }: { proc: Proc; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const isAs = lang === "as";

  const procTitle = pickLang(proc.title, lang);
  const procSafety = pickLang(proc.safety, lang);
  const procObservations = pickLang(proc.observations, lang);
  const procExamNote = pickLang(proc.examNote, lang);
  const procRealWorld = pickLang(proc.realWorld, lang);

  const pIntensity = phase === "reacting" ? 1 : phase === "complete" ? 0.1 : phase !== "idle" ? 0.45 : 0;
  useParticles(canvasRef, phase === "idle" ? "none" : proc.pmode, pIntensity);

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
    if (stepIdx < proc.steps.length - 1) {
      const nxt = stepIdx + 1; setStepIdx(nxt);
      setPhase(nxt >= 2 ? "reacting" : `step${nxt + 1}` as Phase);
    } else { setPhase("complete"); setShowQuiz(true); }
  };
  const reset = () => { setPhase("idle"); setStepIdx(0); setShowQuiz(false); };
  const g = proc.phaseGauges[phase];
  const rxnPct = phase === "complete" ? 100 : phase === "reacting" ? g.yield_ : phase === "step2" ? 30 : phase === "step1" ? 8 : 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.06)" }}>
          <ArrowLeft className="w-4 h-4 text-slate-300" />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{proc.emoji}</span>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-white leading-tight truncate">{procTitle}</h2>
            <p className="text-[10px] text-slate-500 font-mono truncate">{proc.equation.split("|")[0].trim()}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <NeonBadge label={isAs ? "শিল্প" : "Industrial"} color={proc.accent} />
          <NeonBadge label={isAs ? { HIGH: "উচ্চ", EXTREME: "অতি উচ্চ", MEDIUM: "মধ্যম", LOW: "কম" }[proc.hazard] : proc.hazard} color={proc.hazard === "HIGH" || proc.hazard === "EXTREME" ? "#EF4444" : proc.hazard === "MEDIUM" ? "#FB923C" : "#22C55E"} />
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
              <span className="text-xs font-black text-red-300">{isAs ? "শিল্প সুৰক্ষা" : "Industrial Safety"}</span>
              <button onClick={() => setShowSafety(false)} className="ml-auto text-slate-500 text-sm">✕</button>
            </div>
            {procSafety.map((s, i) => <p key={i} className="text-xs text-red-200 mb-0.5">• {s}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 pb-28 overflow-auto min-h-0" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>

        {/* Left — Apparatus + Controls */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <GlassPanel className="relative overflow-hidden" style={{ minHeight: 240 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute inset-0 p-3"><ApparatusSVG proc={proc} phase={phase} /></div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen" }} />
            <div className="absolute top-2 right-2">
              <NeonBadge label={phase === "idle" ? (isAs ? "অপেক্ষাত" : "STANDBY") : phase === "reacting" ? (isAs ? "উৎপাদন চলিছে" : "PRODUCING") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ" : "COMPLETE") : `${isAs ? "স্তৰ" : "STAGE"} ${stepIdx + 1}`}
                color={phase === "reacting" ? proc.accent : phase === "complete" ? "#34D399" : "#60A5FA"} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {phase === "complete" ? `✅ ${isAs ? "উৎপাদন সম্পূৰ্ণ" : "Production Complete"}` : `${isAs ? "স্তৰ" : "Stage"} ${stepIdx + 1}/${proc.steps.length}`}
              </span>
              <div className="flex gap-1">
                {proc.steps.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= stepIdx && phase !== "idle" ? proc.accent : "rgba(255,255,255,0.15)" }} />)}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx + phase} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="mb-3">
                <p className="text-sm font-black text-white mb-1">{pickLang(proc.steps[stepIdx].label, lang)}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{pickLang(proc.steps[stepIdx].desc, lang)}</p>
              </motion.div>
            </AnimatePresence>
            {phase !== "complete" ? (
              <button onClick={phase === "idle" ? () => setPhase("step1") : nextStep}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white hover:opacity-90 active:scale-95 transition-all"
                style={{ background: `linear-gradient(135deg, ${proc.gradFrom}, ${proc.gradTo})` }}>
                <Play className="w-4 h-4" />{phase === "idle" ? (isAs ? "উৎপাদন আৰম্ভ কৰক" : "Start Production") : stepIdx < proc.steps.length - 1 ? pickLang(proc.steps[stepIdx + 1].label, lang) : (isAs ? "উৎপাদন সম্পূৰ্ণ কৰক" : "Complete Production")}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl text-xs font-black border hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />{isAs ? "পুনৰ কৰক" : "Repeat"}
                </button>
                <button onClick={() => setShowQuiz(true)} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${proc.gradFrom}, ${proc.gradTo})` }}>{isAs ? "কুইজ দিয়ক" : "Take Quiz"}</button>
              </div>
            )}
          </GlassPanel>

          <IndustrialGaugesPanel proc={proc} phase={phase} />
        </div>

        {/* Middle */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "প্ৰক্ৰিয়া সমীকৰণ" : "Process Equation"}</p>
            {proc.equation.split("|").map((eq, i) => (
              <div key={i} className={`rounded-xl px-3 py-2 text-center font-mono font-black text-xs border ${i > 0 ? "mt-2" : ""}`}
                style={{ borderColor: `${proc.accent}40`, background: `${proc.accent}0F`, color: proc.accent }}>
                {eq.trim()}
              </div>
            ))}
          </GlassPanel>

          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{isAs ? "উৎপাদন বিশ্লেষণ" : "Production Analysis"}</p>
            <div className="space-y-3">
              <AnimBar label={isAs ? "বিক্ৰিয়া অগ্ৰগতি" : "Reaction Progress"} target={rxnPct} accent={proc.accent} icon={<FlaskConical className="w-3 h-3" />} />
              <AnimBar label={isAs ? "শক্তি ব্যৱহাৰ" : "Energy Usage"} target={rxnPct * 0.85} accent="#FBBF24" icon={<Zap className="w-3 h-3" />} />
              <AnimBar label={isAs ? "ফলাফল দক্ষতা" : "Yield Efficiency"} target={g.yield_} accent="#34D399" icon={<Gauge className="w-3 h-3" />} />
            </div>
            <div className="mt-3 space-y-0">
              <DataRow label={isAs ? "প্ৰক্ৰিয়া" : "Process"} value={pickLang(proc.subtitle, lang).split(" ").slice(0,2).join(" ")} color={proc.accent} />
              <DataRow label={isAs ? "উষ্ণতা" : "Temperature"} value={`${g.temp}°C`} color={g.temp > 150 ? "#EF4444" : g.temp > 80 ? "#FB923C" : "#22C55E"} />
              <DataRow label={isAs ? "চাপ" : "Pressure"} value={`${g.pressure.toFixed(1)} atm`} color={g.pressure > 2 ? "#FB923C" : "#22C55E"} />
              <DataRow label={isAs ? "অৱস্থা" : "State"} value={phase === "idle" ? (isAs ? "অপেক্ষাত" : "Standby") : phase === "complete" ? (isAs ? "সম্পূৰ্ণ ✓" : "Complete ✓") : (isAs ? "চলি আছে" : "In progress")} color={phase === "complete" ? "#34D399" : proc.accent} />
            </div>
          </GlassPanel>

          <GlassPanel className="p-3 flex-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{isAs ? "শিল্প পৰ্যবেক্ষণ" : "Industrial Observations"}</p>
            <div className="space-y-1.5">
              {procObservations.map((obs, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: phase !== "idle" ? 1 : i === 0 ? 0.4 : 0.12, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: phase === "complete" ? `${proc.accent}22` : "rgba(255,255,255,0.05)" }}>
                    {phase === "complete" ? <CheckCircle className="w-3 h-3" style={{ color: proc.accent }} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{obs}</p>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <IonPanel proc={proc} phase={phase} />
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5" style={{ color: proc.accent }} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isAs ? "পৰীক্ষাৰ টোকা" : "Exam Note"}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{procExamNote}</p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{isAs ? "শিল্প ব্যৱহাৰ" : "Industrial Use"}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{procRealWorld}</p>
          </GlassPanel>
          <div ref={quizRef}>
            <AnimatePresence>
              {showQuiz && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <QuizSection proc={proc} />
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
// PRODUCTION HUB
// ═══════════════════════════════════════════════════════════

function ProductionHub({ onSelect }: { onSelect: (p: Proc) => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050B18 0%, #08101f 60%, #050B18 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-15 animate-pulse"
            style={{ width: 2 + (i * 11 % 4), height: 2 + (i * 11 % 4), left: `${(i * 43 + 9) % 100}%`, top: `${(i * 71 + 15) % 100}%`, background: ["#FBBF24","#86EFAC","#67E8F9","#FB923C","#E2E8F0","#A78BFA"][i % 6], animationDelay: `${i * 0.28}s`, animationDuration: `${2 + i % 3}s` }} />
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
            style={{ borderColor: "rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.08)", color: "#FBBF24" }}>
            <Zap className="w-3.5 h-3.5" /> {isAs ? "শিল্প ৰসায়ন · সাধাৰণ লৱণৰ উপজাত" : "Industrial Chemistry · Common Salt Derivatives"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isAs ? "শিল্প ৰাসায়নিক" : "Industrial Chemicals"}<br />
            <span style={{ background: "linear-gradient(135deg, #FBBF24, #86EFAC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {isAs ? "সাধাৰণ লৱণৰ পৰা" : "from Common Salt"}
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {isAs ? "৫টা শিল্প প্ৰক্ৰিয়া — তড়িৎবিশ্লেষণ, ক্ল'ৰিনেচন, ছলভে প্ৰক্ৰিয়া, ক্যালচিনেচন, আৰু নিয়ন্ত্ৰিত নিৰ্জলীকৰণ — CBSE MCQ মূল্যায়নসহ।" : "5 industrial processes — electrolysis, chlorination, Solvay process, calcination, and controlled dehydration — with CBSE MCQ assessment."}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {(isAs ? [["৫","প্ৰক্ৰিয়া"],["শিল্প","গেজ"],["আণৱিক","দৃশ্য"],["CBSE","সংৰেখিত"]] : [["5","Processes"],["Industrial","Gauges"],["Molecular","View"],["CBSE","Aligned"]]).map(([v, l]) => (
              <div key={l} className="text-center px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-sm font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Process cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {PROCESSES.map((proc, i) => (
            <motion.button key={proc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(proc)}
              className="group text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 border"
              style={{ borderColor: `${proc.accent}30`, background: `${proc.accent}07` }}>
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${proc.gradFrom}, ${proc.gradTo})` }} />
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${proc.gradFrom}, ${proc.gradTo})`, boxShadow: `0 0 24px ${proc.glow}` }}>
                    {proc.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <NeonBadge label={`${isAs ? "প্ৰক্ৰিয়া" : "PROCESS"} ${proc.num}`} color={proc.accent} />
                      <NeonBadge label={isAs ? { HIGH: "উচ্চ", EXTREME: "অতি উচ্চ", MEDIUM: "মধ্যম", LOW: "কম" }[proc.hazard] : proc.hazard} color={proc.hazard === "HIGH" || proc.hazard === "EXTREME" ? "#EF4444" : proc.hazard === "MEDIUM" ? "#FB923C" : "#22C55E"} />
                    </div>
                    <h3 className="font-black text-white text-base leading-snug group-hover:opacity-80 transition-all">{pickLang(proc.title, lang)}</h3>
                    <p className="text-[10px] text-slate-400">{pickLang(proc.subtitle, lang)}</p>
                  </div>
                </div>
                <div className="font-mono text-[10px] rounded-lg px-2 py-1.5 mb-3 border"
                  style={{ borderColor: `${proc.accent}25`, background: `${proc.accent}08`, color: proc.accent }}>
                  {proc.equation.split("|")[0].trim()}
                </div>
                <p className="text-[10px] text-slate-400 mb-3 line-clamp-2">{pickLang(proc.iupac, lang)} · {pickLang(proc.realWorld, lang).split("·")[0].trim()}</p>
                <div className="flex items-center justify-between">
                  <NeonBadge label={isAs ? `${proc.steps.length} স্তৰ · ${proc.quiz.length} MCQ` : `${proc.steps.length} stages · ${proc.quiz.length} MCQs`} color="#64748B" />
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${proc.gradFrom}, ${proc.gradTo})` }}>
                    <span className="text-white text-xs">▶</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Reference cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(isAs ? [
            { title: "ক্ল'ৰ-এলকালি প্ৰক্ৰিয়া", icon: "⚡", col: "#FBBF24", desc: "ব্ৰাইনৰ তড়িৎবিশ্লেষণ → NaOH + Cl₂ + H₂। এনড: Cl₂ (জাৰণ)। কেথ'ড: H₂ + NaOH (বিজাৰণ)। তিনিওটা উৎপাদ বাণিজ্যিকভাৱে গুৰুত্বপূৰ্ণ।" },
            { title: "ছলভে প্ৰক্ৰিয়া", icon: "🔵", col: "#67E8F9", desc: "ব্ৰাইন + NH₃ + CO₂ → NaHCO₃ (অৱক্ষেপ) + NH₄Cl। NH₃ পুনৰ ব্যৱহাৰ হয়। NaHCO₃ কম দ্ৰৱণীয় → অৱক্ষেপিত। তাৰপিছত গৰম কৰিলে → Na₂CO₃।" },
            { title: "স্ফটিকীকৰণৰ পানী", icon: "💎", col: "#FB923C", desc: "ৱাশ্বিং ছ'ডা: Na₂CO₃·10H₂O (ডেকাহাইড্ৰেট)। POP: CaSO₄·½H₂O। জিপচাম: CaSO₄·2H₂O। স্ফটিক জালিকাত স্থিৰ H₂O অণু।" },
            { title: "শিল্প সুৰক্ষা", icon: "⚠️", col: "#EF4444", desc: "Cl₂ বিষাক্ত · NaOH ক্ষয়কাৰক · H₂ বিস্ফোৰণযোগ্য · POP উৎপাদনত উষ্ণতা নিয়ন্ত্ৰণ জৰুৰী · মৃত দগ্ধ POP (>200°C) অব্যৱহাৰযোগ্য।" },
          ] : [
            { title: "Chlor-Alkali Process", icon: "⚡", col: "#FBBF24", desc: "Electrolysis of brine → NaOH + Cl₂ + H₂. Anode: Cl₂ (oxidation). Cathode: H₂ + NaOH (reduction). All 3 products are commercially important." },
            { title: "Solvay Process", icon: "🔵", col: "#67E8F9", desc: "Brine + NH₃ + CO₂ → NaHCO₃ (precipitate) + NH₄Cl. NH₃ is recycled. NaHCO₃ is less soluble → precipitates. Then heated → Na₂CO₃." },
            { title: "Water of Crystallisation", icon: "💎", col: "#FB923C", desc: "Washing soda: Na₂CO₃·10H₂O (decahydrate). Plaster of Paris: CaSO₄·½H₂O. Gypsum: CaSO₄·2H₂O. Fixed H₂O molecules in crystal lattice." },
            { title: "Industrial Safety", icon: "⚠️", col: "#EF4444", desc: "Cl₂ is toxic · NaOH is corrosive · H₂ is explosive · Temperature control critical in POP production · Dead burnt POP (>200°C) unusable." },
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

export default function IndustrialChemicalsLab() {
  const [active, setActive] = useState<Proc | null>(null);
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#050B18" }}>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div key="room" className="flex-1 overflow-hidden" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.27 }}>
            <ProductionRoom proc={active} onBack={() => setActive(null)} />
          </motion.div>
        ) : (
          <motion.div key="hub" className="flex-1 overflow-auto" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.27 }}>
            <ProductionHub onSelect={setActive} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
