import React, { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, RotateCcw, AlertTriangle, ShieldAlert, Atom, Beaker, Wind, Zap, CheckCircle2, ChevronRight, Check, Info, Microscope } from "lucide-react";
import { SimContainer, SimButton, useRafLoop } from "../sim-ui";
import { useLabTracker } from "@/lib/analytics/lab-tracking-context";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { pick as pickLang, type BilingualField } from "@/lib/i18n";

// --- EXPERIMENT DATA ---
interface ExperimentDef {
  id: number;
  name: BilingualField<string>;
  category: "OXYGEN" | "WATER" | "ACID";
  metal: string;
  reactant: string;
  equation: string;
  desc: BilingualField<string>;
  observations: BilingualField<string>;
  examNotes: BilingualField<string>;
  applications: BilingualField<string>;
  intensity: number;
  hazards: BilingualField<string[]>;
  visuals: {
    metalColor: string;
    productColor: string;
    particleType: "spark" | "bubble" | "steam" | "blinding-glow" | "dissolve";
    flameColor: string | null;
    environment: "trough" | "burner" | "flask";
  };
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
}

const EXPERIMENTS: ExperimentDef[] = [
  {
    id: 1, name: { en: "Sodium + Oxygen", as: "ছ'ডিয়াম + অক্সিজেন" }, category: "OXYGEN", metal: "Na", reactant: "O₂",
    equation: "4Na + O₂ → 2Na₂O",
    desc: { en: "Sodium is an alkali metal that reacts vigorously with atmospheric oxygen to form sodium oxide.", as: "ছ'ডিয়াম এক ক্ষাৰ ধাতু যি বায়ুমণ্ডলীয় অক্সিজেনৰ সৈতে প্ৰচণ্ডভাৱে বিক্ৰিয়া কৰি ছ'ডিয়াম অক্সাইড গঠন কৰে।" },
    observations: { en: "Highly vigorous reaction. Burns with a bright yellow-orange flame. White solid of sodium oxide is formed. Violent combustion with sparks.", as: "অত্যন্ত প্ৰচণ্ড বিক্ৰিয়া। উজ্জ্বল হালধীয়া-কমলা শিখাৰে জ্বলে। ছ'ডিয়াম অক্সাইডৰ বগা কঠিন গঠিত হয়। স্ফুলিঙ্গসহ তীব্ৰ দহন।" },
    examNotes: { en: "Alkali metals are stored under kerosene oil to prevent accidental fires caused by reaction with moisture and oxygen in the air.", as: "ক্ষাৰ ধাতুসমূহ কেৰাচিন তেলৰ তলত সংৰক্ষণ কৰা হয় যাতে বায়ুৰ আৰ্দ্ৰতা আৰু অক্সিজেনৰ সৈতে বিক্ৰিয়াৰ ফলত হোৱা আকস্মিক জুইৰ পৰা ৰক্ষা পাব পাৰি।" },
    applications: { en: "Sodium vapor lamps (yellow streetlights) utilize the characteristic emission spectrum of sodium.", as: "ছ'ডিয়াম বাষ্প লেম্প (হালধীয়া ৰাস্তাৰ পোহৰ) ছ'ডিয়ামৰ বৈশিষ্ট্যমূলক নিৰ্গমন বৰ্ণালী ব্যৱহাৰ কৰে।" },
    intensity: 10, hazards: { en: ["Explosion Risk", "Corrosive Product", "Fire Hazard"], as: ["বিস্ফোৰণৰ আশঙ্কা", "ক্ষয়কাৰক উৎপাদ", "জুইৰ বিপদ"] },
    visuals: { metalColor: "#d1d5db", productColor: "#fde047", particleType: "spark", flameColor: "#f59e0b", environment: "burner" },
    quiz: [
      { q: { en: "Why is sodium strictly stored under kerosene oil?", as: "ছ'ডিয়াম কিয় কেৰাচিন তেলৰ তলত সংৰক্ষণ কৰা হয়?" }, opts: { en: ["It is highly reactive with air/moisture", "It is volatile and evaporates", "To increase its density", "It is toxic to breathe"], as: ["বায়ু/আৰ্দ্ৰতাৰ সৈতে অতি ক্ৰিয়াশীল", "ই বাষ্পীভূত হয়", "ঘনত্ব বৃদ্ধি কৰিবলৈ", "শ্বাস নিবলৈ বিষাক্ত"] }, ans: 0 },
      { q: { en: "What color flame is observed when sodium burns in oxygen?", as: "অক্সিজেনত ছ'ডিয়াম জ্বলিলে কোন ৰঙৰ শিখা দেখা যায়?" }, opts: { en: ["Crimson Red", "Yellow-Orange", "Dazzling White", "Lilac"], as: ["গাঢ় ৰঙা", "হালধীয়া-কমলা", "উজ্জ্বল বগা", "বেঙুনীয়া"] }, ans: 1 },
      { q: { en: "Which oxide is formed as the primary product?", as: "মূল উৎপাদ হিচাপে কোন অক্সাইড গঠিত হয়?" }, opts: { en: ["NaO₂", "Na₂O", "Na₂O₂", "NaOH"], as: ["NaO₂", "Na₂O", "Na₂O₂", "NaOH"] }, ans: 1 },
      { q: { en: "Is the reaction of sodium with oxygen exothermic or endothermic?", as: "অক্সিজেনৰ সৈতে ছ'ডিয়ামৰ বিক্ৰিয়া তাপোৎপাদী নে তাপগ্ৰাহী?" }, opts: { en: ["Highly Exothermic", "Highly Endothermic", "Neutral", "Reversible"], as: ["অত্যন্ত তাপোৎপাদী", "অত্যন্ত তাপগ্ৰাহী", "নিৰপেক্ষ", "বিপৰীতমুখী"] }, ans: 0 }
    ]
  },
  {
    id: 2, name: { en: "Magnesium + Oxygen", as: "মেগনেছিয়াম + অক্সিজেন" }, category: "OXYGEN", metal: "Mg", reactant: "O₂",
    equation: "2Mg + O₂ → 2MgO",
    desc: { en: "Magnesium ribbon burns in air with a dazzling white flame, forming a white powdery ash of magnesium oxide.", as: "মেগনেছিয়াম ফিতা বায়ুত উজ্জ্বল বগা শিখাৰে জ্বলে, মেগনেছিয়াম অক্সাইডৰ বগা গুড়ি ছাই গঠন কৰে।" },
    observations: { en: "Intense, dazzling white light emission. Heat shimmer is visible. White ash residue accumulates as the reaction finishes.", as: "তীব্ৰ, উজ্জ্বল বগা পোহৰ নিৰ্গমন। তাপৰ কম্পন দেখা যায়। বিক্ৰিয়া শেষ হোৱাৰ লগে লগে বগা ছাই জমা হয়।" },
    examNotes: { en: "Magnesium ribbon must be cleaned with sandpaper before burning to remove the protective layer of basic magnesium carbonate.", as: "জ্বলোৱাৰ আগতে মেগনেছিয়াম ফিতাক বেছিক মেগনেছিয়াম কাৰ্বনেটৰ সুৰক্ষামূলক স্তৰ আঁতৰাবলৈ বালিকাগজেৰে পৰিষ্কাৰ কৰিব লাগিব।" },
    applications: { en: "Used in fireworks, flares, and flash photography due to the intense white light it produces when burning.", as: "জ্বলোৱাৰ সময়ত তীব্ৰ বগা পোহৰ উৎপন্ন কৰাৰ কাৰণে আতচবাজি, সংকেত আলো, আৰু ফ্লেছ ফটোগ্ৰাফিত ব্যৱহাৰ হয়।" },
    intensity: 8, hazards: { en: ["Blinding Light", "Extreme Heat"], as: ["চকু অন্ধ কৰা পোহৰ", "অত্যন্ত উচ্চ উষ্ণতা"] },
    visuals: { metalColor: "#cbd5e1", productColor: "#ffffff", particleType: "blinding-glow", flameColor: "#ffffff", environment: "burner" },
    quiz: [
      { q: { en: "What is the physical appearance of the product formed (MgO)?", as: "গঠিত উৎপাদ (MgO)-ৰ ভৌতিক ৰূপ কি?" }, opts: { en: ["Black crust", "Yellow powder", "White powdery ash", "Colorless gas"], as: ["ক'লা আৱৰণ", "হালধীয়া গুড়ি", "বগা গুড়ি ছাই", "বৰ্ণহীন গেছ"] }, ans: 2 },
      { q: { en: "Why must magnesium ribbon be cleaned with sandpaper before burning?", as: "জ্বলোৱাৰ আগতে মেগনেছিয়াম ফিতাক বালিকাগজেৰে পৰিষ্কাৰ কৰিব লাগে কিয়?" }, opts: { en: ["To make it shiny", "To remove the protective carbonate/oxide layer", "To increase its surface area", "To make it brittle"], as: ["উজ্জ্বল কৰিবলৈ", "সুৰক্ষামূলক কাৰ্বনেট/অক্সাইড স্তৰ আঁতৰাবলৈ", "পৃষ্ঠ এলেকা বৃদ্ধি কৰিবলৈ", "ভঙুৰ কৰিবলৈ"] }, ans: 1 },
      { q: { en: "What is the key visual observation during this reaction?", as: "এই বিক্ৰিয়াত মূল দৃশ্যমান পৰ্যবেক্ষণ কি?" }, opts: { en: ["Blue flame", "Dazzling white flame", "Spontaneous explosion", "No visible change"], as: ["নীলা শিখা", "উজ্জ্বল বগা শিখা", "স্বতঃস্ফূৰ্ত বিস্ফোৰণ", "কোনো দৃশ্যমান পৰিৱৰ্তন নাই"] }, ans: 1 },
      { q: { en: "What is the nature of Magnesium Oxide?", as: "মেগনেছিয়াম অক্সাইডৰ প্ৰকৃতি কি?" }, opts: { en: ["Acidic", "Neutral", "Basic", "Amphoteric"], as: ["অম্লীয়", "নিৰপেক্ষ", "ক্ষাৰকীয়", "উভচৰ"] }, ans: 2 }
    ]
  },
  {
    id: 3, name: { en: "Aluminium + Oxygen", as: "এলুমিনিয়াম + অক্সিজেন" }, category: "OXYGEN", metal: "Al", reactant: "O₂",
    equation: "4Al + 3O₂ → 2Al₂O₃",
    desc: { en: "Aluminium reacts with oxygen to form a thin, continuous layer of aluminium oxide. This layer protects the metal underneath from further oxidation.", as: "এলুমিনিয়ামে অক্সিজেনৰ সৈতে বিক্ৰিয়া কৰি এলুমিনিয়াম অক্সাইডৰ পাতল, অবিচ্ছিন্ন স্তৰ গঠন কৰে। এই স্তৰে তলৰ ধাতুক আৰু অক্সিজেনীকৰণৰ পৰা ৰক্ষা কৰে।" },
    observations: { en: "The shiny metallic surface gradually dulls. A thin, reflective oxide film grows, stopping further corrosion (passivation).", as: "চকচকে ধাতৱ পৃষ্ঠ ক্ৰমশঃ মলিন হয়। পাতল, প্ৰতিফলনকাৰী অক্সাইড ফিল্ম বৃদ্ধি পায়, আৰু ক্ষয় বন্ধ কৰে (নিষ্ক্ৰিয়কৰণ)।" },
    examNotes: { en: "Aluminium oxide is an amphoteric oxide. The passivation property makes aluminium highly useful for making cooking utensils.", as: "এলুমিনিয়াম অক্সাইড এক উভচৰ অক্সাইড। নিষ্ক্ৰিয়কৰণ ধৰ্মই এলুমিনিয়ামক ৰান্ধনৰ বাচন-বৰ্তন তৈয়াৰৰ বাবে অতি উপযোগী কৰে।" },
    applications: { en: "Anodizing is used to artificially thicken this protective oxide layer on aluminium articles to make them corrosion-resistant.", as: "এলুমিনিয়ামৰ বস্তুত ক্ষয়-প্ৰতিৰোধী কৰিবলৈ এই সুৰক্ষামূলক অক্সাইড স্তৰ কৃত্ৰিমভাৱে ঘন কৰিবলৈ এনোডাইজিং ব্যৱহাৰ হয়।" },
    intensity: 2, hazards: { en: ["Hot Surface"], as: ["গৰম পৃষ্ঠ"] },
    visuals: { metalColor: "#94a3b8", productColor: "#e2e8f0", particleType: "spark", flameColor: null, environment: "burner" },
    quiz: [
      { q: { en: "What is the term for the protective layer formation on aluminium?", as: "এলুমিনিয়ামত সুৰক্ষামূলক স্তৰ গঠনৰ পৰিভাষা কি?" }, opts: { en: ["Galvanization", "Sublimation", "Passivation", "Vulcanization"], as: ["গেলভানাইজেচন", "উৰ্ধ্বপাতন", "নিষ্ক্ৰিয়কৰণ", "ভালকানাইজেচন"] }, ans: 2 },
      { q: { en: "What is the chemical nature of Aluminium Oxide (Al₂O₃)?", as: "এলুমিনিয়াম অক্সাইড (Al₂O₃)-ৰ ৰাসায়নিক প্ৰকৃতি কি?" }, opts: { en: ["Acidic", "Basic", "Amphoteric", "Neutral"], as: ["অম্লীয়", "ক্ষাৰকীয়", "উভচৰ", "নিৰপেক্ষ"] }, ans: 2 },
      { q: { en: "Why is aluminium used for cooking utensils despite being highly reactive?", as: "এলুমিনিয়াম অতি ক্ৰিয়াশীল হোৱা সত্ত্বেও ৰান্ধনৰ বাচনত কিয় ব্যৱহাৰ হয়?" }, opts: { en: ["It is cheap", "The oxide layer prevents further corrosion", "It is a poor conductor", "It does not melt"], as: ["ই সস্তা", "অক্সাইড স্তৰে আৰু ক্ষয় ৰোধ কৰে", "ই দুৰ্বল পৰিবাহক", "ই গলে নাই"] }, ans: 1 },
      { q: { en: "What process artificially thickens this protective layer?", as: "কোন প্ৰক্ৰিয়াই এই সুৰক্ষামূলক স্তৰ কৃত্ৰিমভাৱে ঘন কৰে?" }, opts: { en: ["Anodizing", "Alloying", "Smelting", "Roasting"], as: ["এনোডাইজিং", "সংকৰ", "গলন", "ৰোষ্টিং"] }, ans: 0 }
    ]
  },
  {
    id: 4, name: { en: "Copper + Oxygen", as: "তামৰ + অক্সিজেন" }, category: "OXYGEN", metal: "Cu", reactant: "O₂",
    equation: "2Cu + O₂ → 2CuO",
    desc: { en: "Copper does not burn easily. When heated strongly in air, it reacts slowly to form a black coating of copper(II) oxide.", as: "তামৰ সহজে জ্বলে নাই। বায়ুত জোৰেদি গৰম কৰিলে ই লাহে লাহে বিক্ৰিয়া কৰি কপাৰ(II) অক্সাইডৰ ক'লা আৱৰণ গঠন কৰে।" },
    observations: { en: "The copper metal glows red hot under the burner. Gradually, the surface darkens, and a black crust (CuO) covers the metal.", as: "বাৰ্নাৰৰ তলত তামৰ ধাতু ৰঙালী গৰম হয়। ক্ৰমশঃ পৃষ্ঠ ক'লা হয়, আৰু ক'লা আৱৰণ (CuO)-এ ধাতু ঢাকে।" },
    examNotes: { en: "Copper does not burn, unlike Mg or Na. It requires sustained heating, showing it is lower in the reactivity series.", as: "তামৰ Mg বা Na-ৰ দৰে জ্বলে নাই। ইয়াক নিৰন্তৰ গৰম কৰিব লাগে, যি দেখায় যে ই ক্ৰিয়াশীলতা শ্ৰেণীত তলত আছে।" },
    applications: { en: "Copper(II) oxide is used as a pigment in ceramics and as an active material in some dry cell batteries.", as: "কপাৰ(II) অক্সাইড চিৰামিকছত ৰঞ্জক হিচাপে আৰু কিছু শুকান কোষ বেটাৰিত সক্ৰিয় পদাৰ্থ হিচাপে ব্যৱহাৰ হয়।" },
    intensity: 3, hazards: { en: ["Hot Surface"], as: ["গৰম পৃষ্ঠ"] },
    visuals: { metalColor: "#b45309", productColor: "#1e293b", particleType: "spark", flameColor: null, environment: "burner" },
    quiz: [
      { q: { en: "What color is the Copper(II) oxide coating formed on heating?", as: "গৰম কৰাত গঠিত কপাৰ(II) অক্সাইড আৱৰণৰ ৰং কি?" }, opts: { en: ["Green", "Blue", "Black", "White"], as: ["সেউজীয়া", "নীলা", "ক'লা", "বগা"] }, ans: 2 },
      { q: { en: "Does copper burn with a flame when heated in air?", as: "তামৰ বায়ুত গৰম কৰিলে শিখাৰে জ্বলে নেকি?" }, opts: { en: ["Yes, a green flame", "Yes, a blue flame", "No, it just glows and turns black", "Yes, a yellow flame"], as: ["হয়, সেউজীয়া শিখা", "হয়, নীলা শিখা", "নহয়, কেৱল গৰম হৈ ক'লা হয়", "হয়, হালধীয়া শিখা"] }, ans: 2 },
      { q: { en: "What does this reaction indicate about copper's reactivity?", as: "এই বিক্ৰিয়াই তামৰৰ ক্ৰিয়াশীলতা সম্পৰ্কে কি নিৰ্দেশ কৰে?" }, opts: { en: ["It is highly reactive", "It is less reactive than Mg and Al", "It is an alkali metal", "It does not react with oxygen at all"], as: ["ই অত্যন্ত ক্ৰিয়াশীল", "ই Mg আৰু Al-তকৈ কম ক্ৰিয়াশীল", "ই এক ক্ষাৰ ধাতু", "ই অক্সিজেনৰ সৈতে মোটেই বিক্ৰিয়া নকৰে"] }, ans: 1 },
      { q: { en: "What is the valency of copper in the product formed (CuO)?", as: "গঠিত উৎপাদ (CuO)-ত তামৰৰ সংযোজন মান কি?" }, opts: { en: ["1", "2", "3", "4"], as: ["1", "2", "3", "4"] }, ans: 1 }
    ]
  },
  {
    id: 5, name: { en: "Sodium + Cold Water", as: "ছ'ডিয়াম + ঠাণ্ডা পানী" }, category: "WATER", metal: "Na", reactant: "H₂O(l)",
    equation: "2Na + 2H₂O → 2NaOH + H₂",
    desc: { en: "Sodium reacts violently with cold water, floating on the surface and melting into a silvery ball due to the extreme heat generated.", as: "ছ'ডিয়ামে ঠাণ্ডা পানীৰ সৈতে তীব্ৰভাৱে বিক্ৰিয়া কৰে, পৃষ্ঠত ভাঁহি থাকে আৰু অত্যন্ত উষ্ণতাৰ কাৰণে ৰুপালী গুলিত গলে।" },
    observations: { en: "Violent fizzing. The metal darts across the water surface. The hydrogen gas evolved catches fire spontaneously due to the exothermic heat.", as: "তীব্ৰ বুদবুদ। ধাতু পানীৰ পৃষ্ঠত তীৰৰ দৰে ধাৱন কৰে। নিৰ্গত হাইড্ৰ'জেন গেছ তাপোৎপাদী উষ্ণতাৰ কাৰণে স্বতঃস্ফূৰ্তভাৱে জ্বলি উঠে।" },
    examNotes: { en: "The reaction is so exothermic that the evolved hydrogen gas immediately catches fire. The resulting solution is highly alkaline (turns red litmus blue).", as: "বিক্ৰিয়া ইমান তাপোৎপাদী যে নিৰ্গত হাইড্ৰ'জেন গেছ তৎক্ষণাৎ জ্বলি উঠে। ফলাফল দ্ৰৱণ অত্যন্ত ক্ষাৰকীয় (ৰঙা লিটমাছ নীলা হয়)।" },
    applications: { en: "Used in advanced chemical syntheses to remove trace moisture from organic solvents.", as: "জৈৱ দ্ৰাৱকৰ পৰা নিৰীক্ষণ আৰ্দ্ৰতা আঁতৰাবলৈ উন্নত ৰাসায়নিক সংশ্লেষণত ব্যৱহাৰ হয়।" },
    intensity: 9, hazards: { en: ["Explosion Hazard", "Alkaline Solution", "Fire Hazard"], as: ["বিস্ফোৰণৰ আশঙ্কা", "ক্ষাৰকীয় দ্ৰৱণ", "জুইৰ বিপদ"] },
    visuals: { metalColor: "#d1d5db", productColor: "#f1f5f9", particleType: "spark", flameColor: "#fbbf24", environment: "trough" },
    quiz: [
      { q: { en: "Why does the evolved hydrogen gas ignite spontaneously?", as: "নিৰ্গত হাইড্ৰ'জেন গেছ স্বতঃস্ফূৰ্তভাৱে জ্বলি উঠে কিয়?" }, opts: { en: ["Sodium acts as a spark", "The reaction is highly exothermic", "Water provides oxygen", "NaOH is flammable"], as: ["ছ'ডিয়াম স্ফুলিঙ্গ হিচাপে কাম কৰে", "বিক্ৰিয়া অত্যন্ত তাপোৎপাদী", "পানীয়ে অক্সিজেন যোগান দিয়ে", "NaOH জ্বলনযোগ্য"] }, ans: 1 },
      { q: { en: "Why does the sodium metal float on water during the reaction?", as: "বিক্ৰিয়াৰ সময়ত ছ'ডিয়াম ধাতু পানীত কিয় ভাঁহি থাকে?" }, opts: { en: ["It is lighter than water (lower density)", "The hydrogen bubbles hold it up", "It repels water", "It forms a foam"], as: ["ই পানীতকৈ হালকা (কম ঘনত্ব)", "হাইড্ৰ'জেন বুদবুদে ইয়াক ধৰে", "ই পানী ঠেলি পঠিয়ায়", "ই ফেনা গঠন কৰে"] }, ans: 0 },
      { q: { en: "What is the nature of the solution formed after the reaction?", as: "বিক্ৰিয়াৰ পিছত গঠিত দ্ৰৱণৰ প্ৰকৃতি কি?" }, opts: { en: ["Acidic", "Neutral", "Highly Alkaline (Basic)", "Amphoteric"], as: ["অম্লীয়", "নিৰপেক্ষ", "অত্যন্ত ক্ষাৰকীয়", "উভচৰ"] }, ans: 2 },
      { q: { en: "Which gas is evolved with a 'pop' sound during this reaction?", as: "এই বিক্ৰিয়াত 'পপ' শব্দৰ সৈতে কোন গেছ নিৰ্গত হয়?" }, opts: { en: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"], as: ["অক্সিজেন", "কাৰ্বন ডাইঅক্সাইড", "হাইড্ৰ'জেন", "নাইট্ৰ'জেন"] }, ans: 2 }
    ]
  },
  {
    id: 6, name: { en: "Magnesium + Hot Water", as: "মেগনেছিয়াম + গৰম পানী" }, category: "WATER", metal: "Mg", reactant: "H₂O(hot)",
    equation: "Mg + 2H₂O → Mg(OH)₂ + H₂",
    desc: { en: "Magnesium does not react with cold water. It reacts with hot water to form magnesium hydroxide and hydrogen gas.", as: "মেগনেছিয়াম ঠাণ্ডা পানীৰ সৈতে বিক্ৰিয়া নকৰে। ই গৰম পানীৰ সৈতে বিক্ৰিয়া কৰি মেগনেছিয়াম হাইড্ৰ'ক্সাইড আৰু হাইড্ৰ'জেন গেছ গঠন কৰে।" },
    observations: { en: "Steady bubbling is observed as hydrogen gas evolves. The magnesium ribbon floats as bubbles stick to its surface.", as: "হাইড্ৰ'জেন গেছ নিৰ্গত হোৱাৰ লগে লগে নিৰন্তৰ বুদবুদ দেখা যায়। মেগনেছিয়াম ফিতা ভাঁহে কাৰণ বুদবুদ ইয়াৰ পৃষ্ঠত লাগি থাকে।" },
    examNotes: { en: "Magnesium floats because bubbles of hydrogen gas stick to its surface. It demonstrates that Mg is less reactive than Na and Ca.", as: "মেগনেছিয়াম ভাঁহে কাৰণ হাইড্ৰ'জেন গেছৰ বুদবুদ ইয়াৰ পৃষ্ঠত লাগি থাকে। ই প্ৰদৰ্শন কৰে যে Mg, Na আৰু Ca-তকৈ কম ক্ৰিয়াশীল।" },
    applications: { en: "Magnesium hydroxide is mildly basic and is used in medicine as an antacid (Milk of Magnesia).", as: "মেগনেছিয়াম হাইড্ৰ'ক্সাইড মৃদু ক্ষাৰকীয় আৰু চিকিৎসাত এণ্টাচিড হিচাপে (মিল্ক অৱ মেগনেছিয়া) ব্যৱহাৰ হয়।" },
    intensity: 5, hazards: { en: ["Hot Liquid", "Flammable Gas"], as: ["গৰম তৰল", "জ্বলনযোগ্য গেছ"] },
    visuals: { metalColor: "#cbd5e1", productColor: "#e2e8f0", particleType: "bubble", flameColor: null, environment: "trough" },
    quiz: [
      { q: { en: "Why does magnesium float during this reaction?", as: "এই বিক্ৰিয়াত মেগনেছিয়াম কিয় ভাঁহে?" }, opts: { en: ["It is lighter than water", "Hydrogen bubbles stick to its surface", "It forms a foam", "It turns into gas"], as: ["ই পানীতকৈ হালকা", "হাইড্ৰ'জেন বুদবুদ ইয়াৰ পৃষ্ঠত লাগি থাকে", "ই ফেনা গঠন কৰে", "ই গেছলৈ পৰিণত হয়"] }, ans: 1 },
      { q: { en: "Why is hot water required for this reaction?", as: "এই বিক্ৰিয়াৰ বাবে গৰম পানী কিয় লাগে?" }, opts: { en: ["Cold water is too dense", "Magnesium is not reactive enough to react with cold water", "Hot water contains more oxygen", "Cold water freezes the metal"], as: ["ঠাণ্ডা পানী অতি ঘন", "মেগনেছিয়াম ঠাণ্ডা পানীৰ সৈতে বিক্ৰিয়া কৰিবলৈ ইমান ক্ৰিয়াশীল নহয়", "গৰম পানীত অধিক অক্সিজেন আছে", "ঠাণ্ডা পানীয়ে ধাতু জমা কৰে"] }, ans: 1 },
      { q: { en: "What is the common name for the product Magnesium Hydroxide?", as: "উৎপাদ মেগনেছিয়াম হাইড্ৰ'ক্সাইডৰ সাধাৰণ নাম কি?" }, opts: { en: ["Slaked Lime", "Milk of Magnesia", "Baking Soda", "Caustic Soda"], as: ["স্লেকড চূন", "মিল্ক অৱ মেগনেছিয়া", "বেকিং ছ'ডা", "কষ্টিক ছ'ডা"] }, ans: 1 },
      { q: { en: "Which gas is evolved during the reaction?", as: "বিক্ৰিয়াত কোন গেছ নিৰ্গত হয়?" }, opts: { en: ["Oxygen", "Carbon Dioxide", "Chlorine", "Hydrogen"], as: ["অক্সিজেন", "কাৰ্বন ডাইঅক্সাইড", "ক্ল'ৰিন", "হাইড্ৰ'জেন"] }, ans: 3 }
    ]
  },
  {
    id: 7, name: { en: "Zinc + Steam", as: "জিংক + বাষ্প" }, category: "WATER", metal: "Zn", reactant: "H₂O(g)",
    equation: "Zn + H₂O → ZnO + H₂",
    desc: { en: "Metals like zinc, aluminium, and iron do not react with cold or hot water. They only react with steam to form the metal oxide and hydrogen.", as: "জিংক, এলুমিনিয়াম, আৰু লোহাৰ দৰে ধাতু ঠাণ্ডা বা গৰম পানীৰ সৈতে বিক্ৰিয়া নকৰে। সিহঁতে কেৱল বাষ্পৰ সৈতে বিক্ৰিয়া কৰি ধাতু অক্সাইড আৰু হাইড্ৰ'জেন গঠন কৰে।" },
    observations: { en: "Steam interacts with the heated zinc metal. White zinc oxide is formed and hydrogen gas is collected.", as: "বাষ্পে গৰম জিংক ধাতুৰ সৈতে বিক্ৰিয়া কৰে। বগা জিংক অক্সাইড গঠিত হয় আৰু হাইড্ৰ'জেন গেছ সংগ্ৰহ কৰা হয়।" },
    examNotes: { en: "Notice that steam reactions form metal OXIDES, not metal HYDROXIDES. Zinc oxide is yellow when hot and white when cold.", as: "লক্ষ্য কৰক যে বাষ্পৰ বিক্ৰিয়াত ধাতু অক্সাইড গঠিত হয়, ধাতু হাইড্ৰ'ক্সাইড নহয়। জিংক অক্সাইড গৰমত হালধীয়া আৰু ঠাণ্ডাত বগা।" },
    applications: { en: "This principle was historically used to generate hydrogen gas in laboratories and early industries.", as: "এই নীতি ঐতিহাসিকভাৱে পৰীক্ষাগাৰ আৰু প্ৰাথমিক শিল্পত হাইড্ৰ'জেন গেছ উৎপাদন কৰিবলৈ ব্যৱহাৰ হৈছিল।" },
    intensity: 6, hazards: { en: ["Pressurized Steam", "Hot Surface"], as: ["চাপযুক্ত বাষ্প", "গৰম পৃষ্ঠ"] },
    visuals: { metalColor: "#64748b", productColor: "#f8fafc", particleType: "steam", flameColor: null, environment: "flask" },
    quiz: [
      { q: { en: "Why does zinc form an oxide instead of a hydroxide with steam?", as: "জিংকে বাষ্পৰ সৈতে হাইড্ৰ'ক্সাইডৰ পৰিৱৰ্তে অক্সাইড কিয় গঠন কৰে?" }, opts: { en: ["Steam is too hot to form hydroxides", "Zinc is moderately reactive and requires steam, which results in the oxide", "Zinc hydroxide is soluble", "Steam lacks oxygen"], as: ["বাষ্প হাইড্ৰ'ক্সাইড গঠনৰ বাবে অতি গৰম", "জিংক মধ্যমীয়া ক্ৰিয়াশীল আৰু বাষ্প প্ৰয়োজন যি অক্সাইড গঠন কৰে", "জিংক হাইড্ৰ'ক্সাইড দ্ৰৱণীয়", "বাষ্পত অক্সিজেন নাই"] }, ans: 1 },
      { q: { en: "Which of the following metals behaves exactly like Zinc (reacts only with steam)?", as: "নিম্নলিখিত কোন ধাতুৱে জিংকৰ দৰে (কেৱল বাষ্পৰ সৈতে বিক্ৰিয়া) আচৰণ কৰে?" }, opts: { en: ["Sodium", "Iron", "Copper", "Gold"], as: ["ছ'ডিয়াম", "আয়ৰন", "তামৰ", "সোণ"] }, ans: 1 },
      { q: { en: "What is the color of Zinc Oxide when it cools down?", as: "জিংক অক্সাইড ঠাণ্ডা হ'লে কোন ৰং হয়?" }, opts: { en: ["Yellow", "Black", "White", "Green"], as: ["হালধীয়া", "ক'লা", "বগা", "সেউজীয়া"] }, ans: 2 },
      { q: { en: "Which gas is evolved when zinc reacts with steam?", as: "জিংক বাষ্পৰ সৈতে বিক্ৰিয়া কৰিলে কোন গেছ নিৰ্গত হয়?" }, opts: { en: ["Hydrogen", "Water Vapor", "Oxygen", "Ozone"], as: ["হাইড্ৰ'জেন", "জলীয় বাষ্প", "অক্সিজেন", "অজোন"] }, ans: 0 }
    ]
  },
  {
    id: 8, name: { en: "Al₂O₃ + Hydrochloric Acid", as: "Al₂O₃ + হাইড্ৰ'ক্ল'ৰিক এচিড" }, category: "ACID", metal: "Al₂O₃", reactant: "HCl(aq)",
    equation: "Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O",
    desc: { en: "Aluminium oxide is amphoteric, meaning it reacts with both acids and bases. Here, it acts as a base and dissolves in HCl.", as: "এলুমিনিয়াম অক্সাইড উভচৰ, অৰ্থাৎ ই অম্ল আৰু ক্ষাৰক উভয়ৰ সৈতে বিক্ৰিয়া কৰে। ইয়াত ই ক্ষাৰক হিচাপে কাম কৰে আৰু HCl-ত দ্ৰৱীভূত হয়।" },
    observations: { en: "The solid oxide lattice breaks down. The powder gradually dissolves into the acidic solution, forming an aluminium chloride solution.", as: "কঠিন অক্সাইড জালিকা ভাঙি যায়। গুড়ি ক্ৰমশঃ অম্লীয় দ্ৰৱণত দ্ৰৱীভূত হৈ এলুমিনিয়াম ক্ল'ৰাইড দ্ৰৱণ গঠন কৰে।" },
    examNotes: { en: "Amphoteric oxides (like Al₂O₃ and ZnO) show both acidic and basic behaviors, yielding salt and water in both cases.", as: "উভচৰ অক্সাইড (যেনে Al₂O₃ আৰু ZnO) অম্লীয় আৰু ক্ষাৰকীয় উভয় আচৰণ দেখায়, উভয় ক্ষেত্ৰত লৱণ আৰু পানী উৎপন্ন হয়।" },
    applications: { en: "This property is heavily utilized in the Bayer process to purify bauxite ore for aluminium extraction.", as: "এলুমিনিয়াম নিষ্কাশনৰ বাবে বক্সাইট আকৰ পৰিশুদ্ধ কৰিবলৈ বায়াৰ প্ৰক্ৰিয়াত এই ধৰ্ম ব্যাপকভাৱে ব্যৱহাৰ হয়।" },
    intensity: 4, hazards: { en: ["Corrosive Acid", "Toxic Fumes"], as: ["ক্ষয়কাৰক অম্ল", "বিষাক্ত ধোঁৱা"] },
    visuals: { metalColor: "#e2e8f0", productColor: "#bae6fd", particleType: "dissolve", flameColor: null, environment: "flask" },
    quiz: [
      { q: { en: "What does the term 'amphoteric' mean?", as: "'উভচৰ' পৰিভাষাৰ অৰ্থ কি?" }, opts: { en: ["Reacts only with acids", "Reacts only with bases", "Reacts with both acids and bases", "Does not react with anything"], as: ["কেৱল অম্লৰ সৈতে বিক্ৰিয়া কৰে", "কেৱল ক্ষাৰকৰ সৈতে বিক্ৰিয়া কৰে", "অম্ল আৰু ক্ষাৰক উভয়ৰ সৈতে বিক্ৰিয়া কৰে", "কোনো বস্তুৰ সৈতে বিক্ৰিয়া নকৰে"] }, ans: 2 },
      { q: { en: "In this specific reaction with HCl, how is Al₂O₃ behaving?", as: "HCl-ৰ সৈতে এই বিশেষ বিক্ৰিয়াত Al₂O₃ কেনেকৈ আচৰণ কৰে?" }, opts: { en: ["As an acid", "As a base", "As a catalyst", "As an oxidizing agent"], as: ["অম্ল হিচাপে", "ক্ষাৰক হিচাপে", "উদ্দীপক হিচাপে", "জাৰক হিচাপে"] }, ans: 1 },
      { q: { en: "What are the final products of this neutralization reaction?", as: "এই নিৰপেক্ষীকৰণ বিক্ৰিয়াৰ অন্তিম উৎপাদ কি?" }, opts: { en: ["Aluminium Chloride and Hydrogen", "Aluminium Chloride and Water", "Aluminium Hydride", "Chlorine gas"], as: ["এলুমিনিয়াম ক্ল'ৰাইড আৰু হাইড্ৰ'জেন", "এলুমিনিয়াম ক্ল'ৰাইড আৰু পানী", "এলুমিনিয়াম হাইড্ৰাইড", "ক্ল'ৰিন গেছ"] }, ans: 1 },
      { q: { en: "Which other metal oxide is famously amphoteric?", as: "কোন অন্য ধাতু অক্সাইড বিখ্যাতভাৱে উভচৰ?" }, opts: { en: ["Sodium Oxide", "Calcium Oxide", "Zinc Oxide", "Copper Oxide"], as: ["ছ'ডিয়াম অক্সাইড", "কেলচিয়াম অক্সাইড", "জিংক অক্সাইড", "কপাৰ অক্সাইড"] }, ans: 2 }
    ]
  }
];

// --- CORE ENGINE ---
export function ReactiveMetalsModule() {
  const { recordCompletion, recordInteraction } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [selectedExp, setSelectedExp] = useState<ExperimentDef | null>(null);
  const [state, setState] = useState<"SETUP" | "REACTING" | "FINISHED" | "QUIZ">("SETUP");
  const [progress, setProgress] = useState(0); // 0 to 1
  useEffect(() => { if (selectedExp) recordInteraction(`exp-${selectedExp.id}`); }, [selectedExp, recordInteraction]);

  if (!selectedExp) {
    return <ExperimentDashboard onSelect={setSelectedExp} />;
  }

  if (state === "QUIZ") {
    return <QuizSection exp={selectedExp} onFinish={() => { setSelectedExp(null); setState("SETUP"); setProgress(0); }} />;
  }

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans flex flex-col relative h-[85vh] md:h-[800px] max-h-[1200px]">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 md:p-4 flex justify-between items-center z-10 shadow-lg">
        <div className="min-w-0 pr-2">
          <h2 className="text-base md:text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent truncate">{pickLang(selectedExp.name, lang)}</h2>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">{isAs ? { OXYGEN: "অক্সিজেন", WATER: "পানী", ACID: "অম্ল" }[selectedExp.category] : selectedExp.category}</span>
            <span className="px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-orange-900/30 text-orange-400 border border-orange-800/50">{isAs ? "তীব্ৰতা" : "Intensity"}: {selectedExp.intensity}/10</span>
          </div>
        </div>
        <LanguageToggle />
        <button onClick={() => setSelectedExp(null)} className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] md:text-xs font-bold transition-all border border-slate-700">← {isAs ? "উভতি যাওক" : "Back"}</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left/Bottom: Theory & Controls */}
        <div className="w-full md:w-1/3 bg-slate-900/50 border-t md:border-t-0 md:border-r border-slate-800 p-4 md:p-6 flex flex-col justify-between overflow-y-auto order-2 md:order-1">
          <div>
            <div className="mb-4 md:mb-6">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5" /> {isAs ? "ৰাসায়নিক সমীকৰণ" : "Chemical Equation"}
              </div>
              <div className="bg-slate-950 p-2 md:p-3 rounded-lg border border-slate-800 font-mono text-center text-emerald-400 shadow-inner text-xs md:text-sm">
                {selectedExp.equation}
              </div>
            </div>
            
            <div className="mb-4 md:mb-6 space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> {isAs ? "তত্ত্ব" : "Theory"}
                </div>
                <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed">{pickLang(selectedExp.desc, lang)}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-black mb-1.5 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" /> {isAs ? "পৰ্যবেক্ষণ" : "Observations"}
                </div>
                <p className="text-[11px] md:text-xs text-indigo-200 leading-relaxed bg-indigo-950/30 p-2 md:p-2.5 rounded-lg border border-indigo-900/50">{pickLang(selectedExp.observations, lang)}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-black mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {isAs ? "পৰীক্ষাৰ টোকা" : "Exam Notes"}
                </div>
                <p className="text-[11px] md:text-xs text-emerald-200 leading-relaxed bg-emerald-950/30 p-2 md:p-2.5 rounded-lg border border-emerald-900/50">{pickLang(selectedExp.examNotes, lang)}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-orange-400 font-black mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> {isAs ? "বাস্তৱ ব্যৱহাৰ" : "Real-World Application"}
                </div>
                <p className="text-[11px] md:text-xs text-orange-200 leading-relaxed bg-orange-950/30 p-2 md:p-2.5 rounded-lg border border-orange-900/50">{pickLang(selectedExp.applications, lang)}</p>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> {isAs ? "সুৰক্ষা প্ৰ'ট'কল" : "Safety Protocols"}
              </div>
              <div className="flex flex-col gap-2">
                {pickLang(selectedExp.hazards, lang).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-red-950/20 border border-red-900/30 text-red-400 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" /> {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 shrink-0">
             {state === "SETUP" && (
                <button onClick={() => { setState("REACTING"); setProgress(0); }} className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-xs md:text-sm">
                  <Play className="w-4 h-4 md:w-5 md:h-5" /> {isAs ? "বিক্ৰিয়া জ্বলাওক" : "Ignite Reaction"}
                </button>
             )}
             {state === "REACTING" && (
                <div className="w-full p-3 md:p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="text-[10px] md:text-xs font-bold text-slate-400 mb-2 flex justify-between">
                    <span>{isAs ? "বিক্ৰিয়া অগ্ৰগতি" : "Reaction Progress"}</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300 ease-linear" style={{ width: `${progress * 100}%` }} />
                  </div>
                </div>
             )}
             {state === "FINISHED" && (
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="w-full p-3 md:p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs md:text-sm font-black text-center flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> {isAs ? "সম্পূৰ্ণ" : "Complete"}
                  </div>
                  <button onClick={() => setState("QUIZ")} className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-black shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-[10px] md:text-sm">
                    {isAs ? "কুইজ দিয়ক" : "Take Quiz"} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button onClick={() => { setState("SETUP"); setProgress(0); }} className="w-full py-2.5 md:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 transition-all flex justify-center items-center gap-2 text-[10px] md:text-xs">
                    <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" /> {isAs ? "পুনৰ আৰম্ভ" : "Reset"}
                  </button>
                </div>
             )}
          </div>
        </div>

        {/* Right/Top: Cinematic Viewport */}
        <div className="w-full md:w-2/3 flex flex-col order-1 md:order-2 shrink-0 md:shrink border-b border-slate-800 md:border-b-0 h-[40vh] min-h-[320px] md:h-auto md:min-h-0 bg-slate-950 md:relative">
           
           <div className="relative overflow-hidden flex-1 w-full">
             {/* Background Grid & Vignette */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.5)_0%,rgba(2,6,23,1)_100%)] z-0" />
             <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0 pointer-events-none" />

             {/* Canvas Engine */}
             <div className="absolute inset-0 z-10 flex items-center justify-center">
               <ReactionCanvas exp={selectedExp} progress={progress} state={state} onProgressUpdate={setProgress} onFinish={() => { setState("FINISHED"); recordCompletion("interaction"); }} />
             </div>

             {/* HUD Overlays */}
             <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-1.5 md:gap-2 pointer-events-none">
                <HUDCard label={isAs ? "ধাতু" : "Metal"} value={progress === 0 ? (isAs ? "কাঁচা" : "Raw") : progress < 1 ? (isAs ? "বিক্ৰিয়া চলিছে" : "Reacting") : (isAs ? "জাৰিত" : "Oxidized")} color={progress > 0 && progress < 1 ? "text-orange-400" : "text-emerald-400"} />
                <HUDCard label={isAs ? "উষ্ণতা" : "Heat"} value={state === "REACTING" ? `${Math.round(progress * selectedExp.intensity * 100)}°C` : "25°C"} color={state === "REACTING" ? "text-rose-500" : "text-blue-400"} />
             </div>
           </div>

           {/* Molecular Split Screen (Normal flow on mobile, Overlay on desktop) */}
           <div className={`md:absolute md:bottom-0 md:inset-x-0 bg-slate-900/95 border-t border-slate-700/50 backdrop-blur-xl transition-all duration-700 ease-out z-30 flex w-full overflow-hidden ${state !== "SETUP" ? "h-20 md:h-48 opacity-100 md:translate-y-0" : "h-0 md:h-48 opacity-0 md:opacity-100 md:translate-y-full border-transparent md:border-slate-700/50"}`}>
             <div className="w-1/4 md:w-1/3 border-r border-slate-800/50 p-2 md:p-4 flex flex-col justify-center items-center text-center">
                <Microscope className="hidden md:block w-8 h-8 text-indigo-400 mb-2 opacity-50" />
                <h3 className="text-[8px] md:text-xs font-black uppercase tracking-widest text-slate-400">{isAs ? "আণৱিক" : "Molecular"}</h3>
                <p className="hidden md:block text-[10px] text-slate-500 mt-2 font-mono">
                  {progress < 0.5 ? (isAs ? "ইলেকট্ৰন স্থানান্তৰ আৰম্ভ হৈছে..." : "Electron transfer initiating...") : (isAs ? "স্ফটিক জালিকা গঠিত হৈছে..." : "Crystal lattice forming...")}
                </p>
             </div>
             <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <MolecularAnimation exp={selectedExp} progress={progress} />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- PARTICLE PHYSICS ENGINE ---
type Pt = { x:number; y:number; vx:number; vy:number; life:number; ml:number; r:number; c:string; kind:string };

function ReactionCanvas({ exp, progress, state, onProgressUpdate, onFinish }: { exp: ExperimentDef, progress: number, state: string, onProgressUpdate: (p: number) => void, onFinish: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts = useRef<Pt[]>([]);
  const tRef = useRef(0);

  useEffect(() => { if (state === "SETUP") { pts.current = []; tRef.current = 0; } }, [state]);

  const duration = 5 + (10 - exp.intensity) * 0.6;

  useRafLoop(state === "REACTING", (dt) => {
    const np = Math.min(1, progress + dt / duration);
    onProgressUpdate(np);
    if (np >= 1) onFinish();
  });

  useRafLoop(true, (dt) => {
    const cv = canvasRef.current; if (!cv) return;
    const g = cv.getContext('2d'); if (!g) return;
    const W = cv.width, H = cv.height;
    tRef.current += dt;
    const t = tRef.current;
    const p = state === "REACTING" ? progress : state === "FINISHED" ? 1 : 0;
    const active = state === "REACTING";
    g.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;

    // ── APPARATUS ──
    if (exp.visuals.environment === "burner") {
      // Bunsen burner body
      g.fillStyle = "#1e293b"; g.strokeStyle = "#475569"; g.lineWidth = 2;
      g.fillRect(cx - 8, cy + 60, 16, 70); g.strokeRect(cx - 8, cy + 60, 16, 70);
      g.fillRect(cx - 20, cy + 130, 40, 10); g.strokeRect(cx - 20, cy + 130, 40, 10);
      // Burner flame (always on during reaction)
      if (active || state === "FINISHED") {
        const fh = 25 + Math.sin(t * 12) * 5;
        const fg = g.createRadialGradient(cx, cy + 58, 2, cx, cy + 58, fh);
        fg.addColorStop(0, "rgba(59,130,246,0.9)"); fg.addColorStop(0.5, "rgba(99,102,241,0.5)"); fg.addColorStop(1, "transparent");
        g.fillStyle = fg; g.fillRect(cx - fh, cy + 58 - fh, fh * 2, fh);
      }
      // Wire gauze
      g.strokeStyle = "#64748b"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx - 60, cy + 40); g.lineTo(cx + 60, cy + 40); g.stroke();
      for (let i = -55; i <= 55; i += 10) { g.beginPath(); g.moveTo(cx + i, cy + 38); g.lineTo(cx + i, cy + 42); g.stroke(); }
      // Crucible
      g.fillStyle = "#334155"; g.strokeStyle = "#64748b";
      g.beginPath(); g.moveTo(cx - 30, cy + 10); g.lineTo(cx - 25, cy + 40); g.lineTo(cx + 25, cy + 40); g.lineTo(cx + 30, cy + 10);
      g.closePath(); g.fill(); g.stroke();
    } else if (exp.visuals.environment === "trough") {
      // Glass trough
      g.strokeStyle = "rgba(148,163,184,0.6)"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx - 160, cy - 40); g.lineTo(cx - 140, cy + 80); g.lineTo(cx + 140, cy + 80); g.lineTo(cx + 160, cy - 40); g.stroke();
      // Water body
      g.fillStyle = "rgba(14,165,233,0.15)";
      g.beginPath(); g.moveTo(cx - 155, cy - 10); g.lineTo(cx - 140, cy + 80); g.lineTo(cx + 140, cy + 80); g.lineTo(cx + 155, cy - 10); g.closePath(); g.fill();
      // Water surface with wave
      g.strokeStyle = "rgba(56,189,248,0.5)"; g.lineWidth = 2;
      g.beginPath();
      for (let x = cx - 155; x <= cx + 155; x += 3) {
        const wave = Math.sin((x - cx) * 0.04 + t * 3) * (active ? 3 + p * 5 : 1.5);
        if (x === cx - 155) g.moveTo(x, cy - 10 + wave); else g.lineTo(x, cy - 10 + wave);
      }
      g.stroke();
    } else {
      // Flask (round bottom)
      g.strokeStyle = "rgba(148,163,184,0.5)"; g.lineWidth = 2.5;
      g.beginPath(); g.arc(cx, cy + 30, 70, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke();
      g.beginPath(); g.moveTo(cx - 22, cy - 30); g.lineTo(cx - 22, cy - 70); g.moveTo(cx + 22, cy - 30); g.lineTo(cx + 22, cy - 70); g.stroke();
      // Flask neck
      g.beginPath(); g.moveTo(cx - 22, cy - 70); g.lineTo(cx + 22, cy - 70); g.stroke();
      // Liquid inside
      if (exp.id === 8) {
        g.fillStyle = `rgba(14,165,233,${0.15 + p * 0.1})`;
        g.beginPath(); g.arc(cx, cy + 30, 65, 0.25 * Math.PI, 0.75 * Math.PI); g.closePath(); g.fill();
      }
    }

    // ── METAL PIECE ──
    const c1 = hexToRgb(exp.visuals.metalColor), c2 = hexToRgb(exp.visuals.productColor);
    const mc = `rgb(${lerp(c1.r, c2.r, p)},${lerp(c1.g, c2.g, p)},${lerp(c1.b, c2.b, p)})`;
    let mx = cx, my = cy;

    if (exp.visuals.environment === "burner") { my = cy + 5; }
    else if (exp.visuals.environment === "trough") {
      mx = cx + (active ? Math.sin(t * (exp.id === 5 ? 4 : 1.5)) * (exp.id === 5 ? 60 * p : 20 * p) : 0);
      my = cy - 15 + (active ? Math.sin(t * (exp.id === 5 ? 6 : 2)) * 6 : 0);
    } else { my = cy + 30; }

    // Metal glow
    if (active && exp.visuals.flameColor) {
      g.shadowColor = exp.visuals.flameColor; g.shadowBlur = p * exp.intensity * 8;
    }
    g.fillStyle = mc;
    if (exp.metal === "Mg") {
      const shrink = p * 30;
      g.fillRect(mx - 35 + shrink / 2, my - 4, 70 - shrink, 8);
    } else if (exp.metal === "Al₂O₃") {
      // Powder pile
      const sz = 18 * (1 - p * 0.7);
      g.beginPath(); g.moveTo(mx - sz, my + 8); g.lineTo(mx, my - sz); g.lineTo(mx + sz, my + 8); g.closePath(); g.fill();
    } else {
      const sz = exp.id === 5 ? 14 * (1 - p * 0.4) : 18;
      g.beginPath(); g.arc(mx, my, sz, 0, Math.PI * 2); g.fill();
    }
    g.shadowBlur = 0; g.shadowColor = "transparent";

    // ── PER-EXPERIMENT EFFECTS ──

    // 1. Na + O₂: Yellow-orange flame with shooting sparks
    if (exp.id === 1 && active) {
      // Flame
      for (let i = 0; i < 3; i++) {
        const fh = 20 + Math.random() * 30 * p; const fw = 12 + Math.random() * 10;
        g.fillStyle = `rgba(245,158,11,${0.4 + Math.random() * 0.3})`;
        g.beginPath(); g.ellipse(mx + (Math.random() - 0.5) * 10, my - fh / 2, fw, fh, 0, 0, Math.PI * 2); g.fill();
      }
      // Sparks
      if (Math.random() < 0.4) pts.current.push({ x: mx, y: my - 10, vx: (Math.random() - 0.5) * 200, vy: -100 - Math.random() * 150, life: 1, ml: 1, r: 2 + Math.random() * 2, c: "#fbbf24", kind: "spark" });
    }

    // 2. Mg + O₂: Blinding white glow + ash
    if (exp.id === 2 && active) {
      const glow = Math.min(p * 4, (1 - p) * 4, 1) * 0.85;
      const grad = g.createRadialGradient(mx, my, 5, mx, my, 250);
      grad.addColorStop(0, `rgba(255,255,255,${glow})`); grad.addColorStop(0.3, `rgba(200,220,255,${glow * 0.4})`); grad.addColorStop(1, "transparent");
      g.fillStyle = grad; g.fillRect(0, 0, W, H);
      // White ash falling
      if (Math.random() < 0.3) pts.current.push({ x: mx + (Math.random() - 0.5) * 30, y: my, vx: (Math.random() - 0.5) * 20, vy: 20 + Math.random() * 30, life: 2, ml: 2, r: 1.5 + Math.random(), c: "#e2e8f0", kind: "ash" });
    }

    // 3. Al + O₂: Subtle surface oxidation shimmer
    if (exp.id === 3 && (active || state === "FINISHED")) {
      g.strokeStyle = `rgba(148,163,184,${0.3 + p * 0.5})`; g.lineWidth = 2 + p * 2;
      g.beginPath(); g.arc(mx, my, 20 + p * 4, 0, Math.PI * 2); g.stroke();
      if (active && Math.random() < 0.1) pts.current.push({ x: mx + (Math.random() - 0.5) * 30, y: my - 20, vx: (Math.random() - 0.5) * 10, vy: -5 - Math.random() * 10, life: 1.5, ml: 1.5, r: 1, c: "#cbd5e1", kind: "glint" });
    }

    // 4. Cu + O₂: Red hot glow, darkening surface
    if (exp.id === 4 && active) {
      const heat = Math.min(p * 3, 1);
      const hg = g.createRadialGradient(mx, my, 8, mx, my, 40);
      hg.addColorStop(0, `rgba(239,68,68,${heat * 0.6})`); hg.addColorStop(0.5, `rgba(180,83,9,${heat * 0.3})`); hg.addColorStop(1, "transparent");
      g.fillStyle = hg; g.beginPath(); g.arc(mx, my, 40, 0, Math.PI * 2); g.fill();
      if (Math.random() < 0.15) pts.current.push({ x: mx + (Math.random() - 0.5) * 20, y: my - 15, vx: (Math.random() - 0.5) * 15, vy: -15 - Math.random() * 20, life: 1, ml: 1, r: 1.5, c: "#f97316", kind: "heat" });
    }

    // 5. Na + H₂O: Erratic movement, water splash, H₂ fire
    if (exp.id === 5 && active) {
      // Splash droplets
      if (Math.random() < 0.5 * p) pts.current.push({ x: mx + (Math.random() - 0.5) * 20, y: my, vx: (Math.random() - 0.5) * 120, vy: -60 - Math.random() * 80, life: 0.8, ml: 0.8, r: 2 + Math.random() * 2, c: "#38bdf8", kind: "splash" });
      // H₂ fire burst
      if (p > 0.3) {
        const fint = Math.min((p - 0.3) * 3, 1);
        for (let i = 0; i < 2; i++) {
          const fh = 15 + Math.random() * 25 * fint;
          g.fillStyle = `rgba(251,191,36,${0.3 + Math.random() * 0.3 * fint})`;
          g.beginPath(); g.ellipse(mx + (Math.random() - 0.5) * 15, my - fh / 2 - 5, 8 + Math.random() * 6, fh, 0, 0, Math.PI * 2); g.fill();
        }
      }
      // Rising bubbles
      if (Math.random() < 0.6) pts.current.push({ x: mx + (Math.random() - 0.5) * 30, y: my + 5, vx: (Math.random() - 0.5) * 10, vy: -30 - Math.random() * 40, life: 1.2, ml: 1.2, r: 2 + Math.random() * 3, c: "rgba(186,230,253,0.6)", kind: "bubble" });
    }

    // 6. Mg + Hot Water: Steam + steady bubbles
    if (exp.id === 6 && active) {
      // Steam wisps at top
      if (Math.random() < 0.3) pts.current.push({ x: cx + (Math.random() - 0.5) * 100, y: cy - 30, vx: (Math.random() - 0.5) * 20, vy: -20 - Math.random() * 30, life: 2, ml: 2, r: 6 + Math.random() * 8, c: "rgba(226,232,240,0.2)", kind: "steam" });
      // Bubbles from metal
      if (Math.random() < 0.4 * p) pts.current.push({ x: mx + (Math.random() - 0.5) * 15, y: my + 5, vx: (Math.random() - 0.5) * 8, vy: -20 - Math.random() * 25, life: 1.5, ml: 1.5, r: 2 + Math.random() * 2.5, c: "rgba(186,230,253,0.5)", kind: "bubble" });
    }

    // 7. Zn + Steam: Steam flowing over metal, white oxide forming
    if (exp.id === 7 && active) {
      // Steam particles flowing from left
      if (Math.random() < 0.5) pts.current.push({ x: cx - 80, y: cy + 20 + (Math.random() - 0.5) * 30, vx: 40 + Math.random() * 30, vy: (Math.random() - 0.5) * 15, life: 2.5, ml: 2.5, r: 5 + Math.random() * 6, c: "rgba(226,232,240,0.25)", kind: "steam" });
      // White ZnO particles forming on surface
      if (Math.random() < 0.2 * p) pts.current.push({ x: mx + (Math.random() - 0.5) * 25, y: my - 5, vx: (Math.random() - 0.5) * 5, vy: -3 - Math.random() * 5, life: 3, ml: 3, r: 2 + Math.random(), c: "#f1f5f9", kind: "oxide" });
    }

    // 8. Al₂O₃ + HCl: Dissolving into solution
    if (exp.id === 8 && active) {
      // Dissolving particles sinking
      if (Math.random() < 0.4 * p) pts.current.push({ x: mx + (Math.random() - 0.5) * 20, y: my + 8, vx: (Math.random() - 0.5) * 15, vy: 10 + Math.random() * 20, life: 2, ml: 2, r: 1.5 + Math.random(), c: "#93c5fd", kind: "dissolve" });
      // Faint fumes
      if (Math.random() < 0.15) pts.current.push({ x: cx + (Math.random() - 0.5) * 30, y: cy - 40, vx: (Math.random() - 0.5) * 10, vy: -10 - Math.random() * 15, life: 1.5, ml: 1.5, r: 4 + Math.random() * 4, c: "rgba(148,163,184,0.15)", kind: "steam" });
    }

    // ── UPDATE & DRAW PARTICLES ──
    const alive: Pt[] = [];
    for (const pt of pts.current) {
      pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt;
      if (pt.kind === "spark" || pt.kind === "heat") pt.vy += 180 * dt; // gravity
      if (pt.kind === "splash") pt.vy += 250 * dt;
      if (pt.kind === "ash") pt.vx += (Math.random() - 0.5) * 20 * dt;
      if (pt.kind === "bubble") { pt.vx += (Math.random() - 0.5) * 30 * dt; pt.vy -= 10 * dt; }
      if (pt.life > 0) alive.push(pt);
    }
    pts.current = alive;

    for (const pt of pts.current) {
      const alpha = Math.max(0, pt.life / pt.ml);
      g.globalAlpha = alpha;
      g.fillStyle = pt.c;
      if (pt.kind === "bubble") {
        g.strokeStyle = pt.c; g.lineWidth = 1; g.beginPath(); g.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); g.stroke();
      } else if (pt.kind === "steam") {
        g.beginPath(); g.arc(pt.x, pt.y, pt.r * (1 + (1 - alpha) * 1.5), 0, Math.PI * 2); g.fill();
      } else {
        g.beginPath(); g.arc(pt.x, pt.y, pt.r * alpha, 0, Math.PI * 2); g.fill();
      }
    }
    g.globalAlpha = 1;
  });

  return (
    <canvas ref={canvasRef} width={700} height={450} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
  );
}

// --- MOLECULAR ANIMATION ---
function MolecularAnimation({ exp, progress }: { exp: ExperimentDef, progress: number }) {
   const { lang } = useLanguage();
   const isAs = lang === "as";
   return (
     <div className="w-full h-full relative flex items-center justify-center bg-slate-950 font-mono overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        
        <div className="flex items-center gap-4 md:gap-12 text-base md:text-2xl font-black">
           {/* Metal Atom */}
           <div className={`relative w-9 h-9 md:w-16 md:h-16 rounded-full border-2 md:border-4 flex items-center justify-center transition-all duration-1000 text-xs md:text-base ${progress > 0.5 ? 'border-indigo-500 text-indigo-400 bg-indigo-950/50 scale-90' : 'border-slate-400 text-slate-300 bg-slate-800 scale-100'}`}>
             {exp.metal.replace(/[0-9₂₃]/g, '')}
             {progress > 0.5 && <span className="absolute -top-1.5 -right-1.5 md:-top-3 md:-right-3 text-[8px] md:text-xs bg-indigo-600 text-white px-1 md:px-1.5 rounded-full shadow-lg border border-indigo-400">+</span>}
           </div>

           {/* Oxygen/Water Atom */}
           <div className={`relative w-9 h-9 md:w-16 md:h-16 rounded-full border-2 md:border-4 flex items-center justify-center transition-all duration-1000 text-xs md:text-base ${progress > 0.5 ? 'border-rose-500 text-rose-400 bg-rose-950/50 scale-110 -translate-x-2 md:-translate-x-6' : 'border-blue-400 text-blue-300 bg-blue-900/30'}`}>
             {exp.category === "OXYGEN" ? "O" : exp.category === "WATER" ? "OH" : "Cl"}
             {progress > 0.5 && <span className="absolute -top-1.5 -right-1.5 md:-top-3 md:-right-3 text-[8px] md:text-xs bg-rose-600 text-white px-1 md:px-1.5 rounded-full shadow-lg border border-rose-400">-</span>}
           </div>
        </div>

        {/* Electron transfer beam */}
        {progress > 0.1 && progress < 0.9 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm opacity-80 animate-pulse" />
        )}

        <div className="absolute bottom-1 md:bottom-4 left-1/2 -translate-x-1/2 text-[7px] md:text-xs text-slate-500 tracking-widest uppercase whitespace-nowrap">
          {progress < 0.5 ? (isAs ? "যোজ্যতা কক্ষ মিথষ্ক্ৰিয়া" : "Valence Shell Interaction") : (isAs ? "আয়নিক বন্ধন স্থিতিশীল" : "Ionic Bond Stabilized")}
        </div>
     </div>
   );
}


// --- DASHBOARD UI ---
function ExperimentDashboard({ onSelect }: { onSelect: (e: ExperimentDef) => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <SimContainer className="bg-slate-950">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6 px-4">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">{isAs ? "ক্ৰিয়াশীল ধাতু পৰীক্ষাগাৰ" : "Reactive Metals Laboratory"}</h1>
          <LanguageToggle />
        </div>
        <div className="text-center mb-10">
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto font-medium">{isAs ? "এক সুৰক্ষিত, চলচ্চিত্ৰমূলক সিমুলেচন পৰিৱেশত অক্সিজেন, পানী, আৰু অম্লৰ সৈতে ধাতুৰ উচ্চ-বিশ্বস্ততা ৰাসায়নিক ক্ৰিয়াশীলতা অন্বেষণ কৰক।" : "Explore the high-fidelity chemical reactivity of metals with oxygen, water, and acid in a safe, cinematic simulation environment."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIMENTS.map((exp) => (
            <div key={exp.id} onClick={() => onSelect(exp)} 
                 className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:bg-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] flex flex-col justify-between min-h-[220px]">
              
              {/* Animated background glow */}
              <div className="absolute -inset-20 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-cyan-500/10 rounded-full blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${exp.category === 'OXYGEN' ? 'text-rose-400' : exp.category === 'WATER' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                    {exp.category === "OXYGEN" ? <Wind className="w-5 h-5" /> : exp.category === "WATER" ? <Beaker className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${exp.intensity > 7 ? 'bg-red-950/30 border-red-900/50 text-red-400' : exp.intensity > 4 ? 'bg-orange-950/30 border-orange-900/50 text-orange-400' : 'bg-green-950/30 border-green-900/50 text-green-400'}`}>
                    Lv. {exp.intensity}
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-slate-100 mb-1">{pickLang(exp.name, lang)}</h3>
                <p className="text-xs text-slate-500 font-mono font-bold mb-4">{exp.equation}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-4 text-xs font-bold text-slate-400 group-hover:text-indigo-400 transition-colors">
                <span>{isAs ? "লেবত প্ৰৱেশ" : "Access Lab"}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimContainer>
  );
}

// --- QUIZ UI ---
function QuizSection({ exp, onFinish }: { exp: ExperimentDef, onFinish: () => void }) {
  const { recordQuizResult } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [status, setStatus] = useState<"IDLE"|"CORRECT"|"WRONG">("IDLE");
  const correctRef = useRef(0);
  const wrongRef = useRef(0);

  const q = exp.quiz[qIdx];

  const handleSelect = (idx: number) => {
    if (status !== "IDLE") return;
    setSelectedOpt(idx);
    if (idx === q.ans) {
      correctRef.current++;
      setStatus("CORRECT");
      setTimeout(() => {
        if (qIdx < exp.quiz.length - 1) {
          setQIdx(prev => prev + 1);
          setSelectedOpt(null);
          setStatus("IDLE");
        } else {
          const total = correctRef.current + wrongRef.current;
          const score = total > 0 ? Math.round((correctRef.current / total) * 100) : 100;
          recordQuizResult({ score, totalCorrect: correctRef.current, totalAttempted: total });
          onFinish();
        }
      }, 1500);
    } else {
      wrongRef.current++;
      setStatus("WRONG");
    }
  };

  return (
    <div className="w-full min-h-[500px] md:h-[600px] bg-slate-950 text-slate-100 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl relative overflow-hidden p-4">
       {/* Background */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)] pointer-events-none" />
       
       <div className="max-w-xl w-full z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-indigo-400 font-black uppercase text-[10px] md:text-xs tracking-widest">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" /> {isAs ? "লেব বিশ্লেষণ পৰ্যায়" : "Lab Analysis Phase"}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-500 shrink-0">
              {isAs ? "প্ৰশ্ন" : "Question"} {qIdx + 1} {isAs ? "মুঠৰ পৰা" : "of"} {exp.quiz.length}
            </div>
          </div>
          
          <h2 className="text-lg md:text-xl font-black text-slate-100 mb-6 md:mb-8 leading-tight">{pickLang(q.q, lang)}</h2>

          <div className="flex flex-col gap-2.5 md:gap-3">
            {pickLang(q.opts, lang).map((opt, i) => {
              const isSelected = selectedOpt === i;
              const isCorrect = i === q.ans;
              
              let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800";
              if (status !== "IDLE" && isCorrect) btnClass = "bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
              else if (status !== "IDLE" && isSelected && !isCorrect) btnClass = "bg-rose-950 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]";

              return (
                <button key={i} onClick={() => handleSelect(i)} className={`p-3 md:p-4 rounded-xl border text-left font-bold transition-all duration-300 flex justify-between items-center text-xs md:text-sm ${btnClass}`}>
                  <span className="pr-2">{opt}</span>
                  {status !== "IDLE" && isCorrect && <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 shrink-0" />}
                </button>
              )
            })}
          </div>

          {status === "WRONG" && (
            <div className="mt-5 md:mt-6 text-center animate-fade-in">
               <p className="text-rose-400 text-xs md:text-sm font-bold mb-2 md:mb-3">{isAs ? "ভুল বিশ্লেষণ। আণৱিক তথ্য পুনৰীক্ষণ কৰক।" : "Incorrect analysis. Review the molecular data."}</p>
               <button onClick={() => { setStatus("IDLE"); setSelectedOpt(null); }} className="text-slate-400 hover:text-white text-[10px] md:text-xs font-bold underline underline-offset-4 transition-colors">{isAs ? "পুনৰ চেষ্টা কৰক" : "Try Again"}</button>
            </div>
          )}

          {status === "CORRECT" && (
            <div className="mt-6 md:mt-8 text-center animate-fade-in">
               <div className="inline-flex items-center gap-1.5 md:gap-2 bg-emerald-500/20 text-emerald-400 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-emerald-500/50 font-black text-xs md:text-sm uppercase tracking-wide">
                 <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> {qIdx < exp.quiz.length - 1 ? (isAs ? "সঠিক! পৰৱৰ্তী লোড হৈছে..." : "Correct! Loading next...") : (isAs ? "মডিউল সম্পূৰ্ণ" : "Module Complete")}
               </div>
            </div>
          )}
       </div>
    </div>
  );
}

// --- UTILS ---
function HUDCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-2 md:p-2.5 min-w-[90px] md:min-w-[140px] shadow-lg">
      <div className="text-[8px] md:text-[9px] uppercase font-black text-slate-500 tracking-widest mb-0.5">{label}</div>
      <div className={`text-[10px] md:text-sm font-black font-mono ${color}`}>{value}</div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
}

function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}
