import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Wind, Atom, ShieldAlert, AlertTriangle, Zap, CheckCircle2, ChevronRight, Check, Microscope, FlaskConical, Flame, Droplets } from 'lucide-react';
import { useLabTracker } from '@/lib/analytics/lab-tracking-context';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { pick as pickLang, type BilingualField } from '@/lib/i18n';

interface ExperimentDef {
  id: number;
  name: BilingualField<string>;
  category: BilingualField<string>;
  acid: string;
  metal: string;
  equation: string;
  desc: BilingualField<string>;
  observations: BilingualField<string>;
  examNotes: BilingualField<string>;
  applications: string;
  intensity: number;
  hazards: BilingualField<string[]>;
  visuals: {
    metalColor: string;
    productColor: string;
    gasColor: string;
    particleType: string;
    environment: string;
  };
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
}

const EXPERIMENTS: ExperimentDef[] = [
  {
    id: 1, name: { en: "Iron + Dilute Nitric Acid", as: "লোহা + পাতল নাইট্ৰিক এচিড" }, category: { en: "NITRIC ANOMALY", as: "নাইট্ৰিক এনোমেলি" }, metal: "Fe(s)", acid: "Dil. HNO₃",
    equation: "3Fe + 8HNO₃ → 3Fe(NO₃)₂ + 4H₂O + 2NO",
    desc: { en: "When iron reacts with dilute nitric acid, hydrogen gas is NOT evolved. Nitric acid is a strong oxidizing agent; it oxidizes the hydrogen produced to water and itself gets reduced to nitric oxide (NO).", as: "লোহা পাতল নাইট্ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰিলে হাইড্ৰ'জেন গেছ নিৰ্গত নহয়। নাইট্ৰিক এচিড এক শক্তিশালী জাৰক; ই উৎপন্ন হাইড্ৰ'জেনক পানীলৈ জাৰণ কৰে আৰু নিজে নাইট্ৰিক অক্সাইড (NO) লৈ বিজাৰিত হয়।" },
    observations: { en: "Iron filings dissolve, forming a pale green solution of iron(II) nitrate. Colorless NO gas is evolved, which quickly oxidizes in air to form brown toxic NO₂ fumes.", as: "লোহাৰ গুড়ি দ্ৰৱীভূত হয়, আয়ৰন(II) নাইট্ৰেটৰ পাতল সেউজীয়া দ্ৰৱণ গঠন কৰে। বৰ্ণহীন NO গেছ নিৰ্গত হয়, যি বায়ুত দ্ৰুতভাৱে জাৰিত হৈ বাদামী বিষাক্ত NO₂ ধোঁৱা গঠন কৰে।" },
    examNotes: { en: "Classic example of the nitric acid anomaly. Standard mineral acids yield H₂, but HNO₃ yields water and NO/NO₂ due to its oxidizing nature.", as: "নাইট্ৰিক এচিড এনোমেলিৰ ক্লাছিক উদাহৰণ। সাধাৰণ খনিজ অম্লে H₂ দিয়ে, কিন্তু HNO₃-এ ইয়াৰ জাৰক স্বভাৱৰ কাৰণে পানী আৰু NO/NO₂ দিয়ে।" },
    applications: "Used in etching processes and understanding corrosion resistance of steel in acidic environments.",
    intensity: 6, hazards: { en: ["Toxic Gas (NO₂)", "Corrosive Acid", "Oxidizing Agent"], as: ["বিষাক্ত গেছ (NO₂)", "ক্ষয়কাৰক অম্ল", "জাৰক"] },
    visuals: { metalColor: "#71717a", productColor: "#d9f99d", gasColor: "rgba(165,42,42,0.4)", particleType: "brown_fumes", environment: "fume_hood" },
    quiz: [
      { q: { en: "Why is hydrogen gas NOT evolved in this reaction?", as: "এই বিক্ৰিয়াত হাইড্ৰ'জেন গেছ নিৰ্গত নোহোৱাৰ কাৰণ?" }, opts: { en: ["Iron is too unreactive", "Nitric acid oxidizes the hydrogen to water", "Iron forms a passive oxide layer immediately", "The reaction is endothermic"], as: ["লোহা অতি কম ক্ৰিয়াশীল", "নাইট্ৰিক এচিডে হাইড্ৰ'জেনক পানীলৈ জাৰণ কৰে", "লোহাত তৎক্ষণাৎ নিষ্ক্ৰিয় অক্সাইড স্তৰ গঠন হয়", "বিক্ৰিয়া তাপগ্ৰাহী"] }, ans: 1 },
      { q: { en: "Which gas is initially produced before reacting with air?", as: "বায়ুৰ সৈতে বিক্ৰিয়া কৰাৰ আগতে প্ৰাথমিকভাৱে কোন গেছ উৎপন্ন হয়?" }, opts: { en: ["Nitrogen Dioxide (NO₂)", "Hydrogen (H₂)", "Nitric Oxide (NO)", "Ammonia (NH₃)"], as: ["নাইট্ৰ'জেন ডাইঅক্সাইড (NO₂)", "হাইড্ৰ'জেন (H₂)", "নাইট্ৰিক অক্সাইড (NO)", "এমোনিয়া (NH₃)"] }, ans: 2 },
      { q: { en: "Why are brown fumes observed above the flask?", as: "ফ্লাস্কৰ ওপৰত বাদামী ধোঁৱা কিয় দেখা যায়?" }, opts: { en: ["Iron vaporizing", "NO reacting with atmospheric oxygen to form NO₂", "Nitric acid decomposing due to heat", "Impurities in the iron"], as: ["লোহা বাষ্পীভূত", "NO বায়ুমণ্ডলীয় অক্সিজেনৰ সৈতে বিক্ৰিয়া কৰি NO₂ গঠন কৰে", "নাইট্ৰিক এচিড উত্তাপৰ কাৰণে বিযোজিত", "লোহাত অশুদ্ধতা"] }, ans: 1 }
    ]
  },
  {
    id: 2, name: { en: "Copper + Dilute Nitric Acid", as: "তামৰ + পাতল নাইট্ৰিক এচিড" }, category: { en: "OXIDATION", as: "জাৰণ" }, metal: "Cu(s)", acid: "Dil. HNO₃",
    equation: "3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 4H₂O + 2NO",
    desc: { en: "Copper is below hydrogen in the reactivity series and does not react with non-oxidizing acids (like HCl). However, it reacts with nitric acid because HNO₃ acts as a strong oxidizing agent.", as: "তামৰ ক্ৰিয়াশীলতা শ্ৰেণীত হাইড্ৰ'জেনৰ তলত আছে আৰু অ-জাৰক অম্ল (যেনে HCl)-ৰ সৈতে বিক্ৰিয়া নকৰে। কিন্তু ই নাইট্ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰে কাৰণ HNO₃ শক্তিশালী জাৰক হিচাপে কাম কৰে।" },
    observations: { en: "The reddish-brown copper dissolves, turning the solution blue due to Cu²⁺ ions. Colorless NO gas bubbles out and turns into brown NO₂ upon contact with air.", as: "ৰঙালী-বাদামী তামৰ দ্ৰৱীভূত হয়, Cu²⁺ আয়নৰ কাৰণে দ্ৰৱণ নীলা হয়। বৰ্ণহীন NO গেছৰ বুদবুদ ওলায় আৰু বায়ুৰ সংস্পৰ্শত বাদামী NO₂ হয়।" },
    examNotes: { en: "Copper's reaction with dilute vs concentrated HNO₃ yields different gases. Dilute yields NO; Concentrated yields NO₂ directly.", as: "পাতল আৰু ঘন HNO₃-ৰ সৈতে তামৰ বিক্ৰিয়াত বেলেগ বেলেগ গেছ পোৱা যায়। পাতলে NO দিয়ে; ঘনে পোনপটীয়াকৈ NO₂ দিয়ে।" },
    applications: "Used in copper etching, engraving, and production of copper nitrate for agriculture and dyes.",
    intensity: 7, hazards: { en: ["Toxic Gas (NO₂)", "Corrosive Acid", "Heavy Metal Salts"], as: ["বিষাক্ত গেছ (NO₂)", "ক্ষয়কাৰক অম্ল", "গধুৰ ধাতু লৱণ"] },
    visuals: { metalColor: "#b45309", productColor: "#3b82f6", gasColor: "rgba(165,42,42,0.5)", particleType: "brown_fumes_intense", environment: "fume_hood" },
    quiz: [
      { q: { en: "Why does the solution turn blue?", as: "দ্ৰৱণ নীলা হোৱাৰ কাৰণ?" }, opts: { en: ["Formation of NO gas", "Dissolution of Cu²⁺ ions", "Water reacting with acid", "Nitrate ions changing color"], as: ["NO গেছ গঠন", "Cu²⁺ আয়নৰ দ্ৰৱণ", "পানী অম্লৰ সৈতে বিক্ৰিয়া", "নাইট্ৰেট আয়নৰ ৰং পৰিৱৰ্তন"] }, ans: 1 },
      { q: { en: "Why does copper react with HNO₃ but not with HCl?", as: "তামৰ HNO₃-ৰ সৈতে বিক্ৰিয়া হয় কিন্তু HCl-ৰ সৈতে নহয় কিয়?" }, opts: { en: ["HNO₃ is a stronger acid", "HNO₃ is a strong oxidizing agent", "HCl forms a protective layer", "Copper is a noble metal"], as: ["HNO₃ শক্তিশালী অম্ল", "HNO₃ শক্তিশালী জাৰক", "HCl সুৰক্ষামূলক স্তৰ গঠন কৰে", "তামৰ উচ্চ ধাতু"] }, ans: 1 },
      { q: { en: "What is the role of Nitric Acid in this reaction?", as: "এই বিক্ৰিয়াত নাইট্ৰিক এচিডৰ ভূমিকা?" }, opts: { en: ["Reducing agent", "Catalyst", "Oxidizing agent", "Dehydrating agent"], as: ["বিজাৰক", "উদ্দীপক", "জাৰক", "নিৰ্জলকাৰক"] }, ans: 2 }
    ]
  },
  {
    id: 3, name: { en: "Magnesium + Very Dilute Nitric Acid", as: "মেগনেছিয়াম + অতি পাতল নাইট্ৰিক এচিড" }, category: { en: "ANOMALY EXCEPTION", as: "এনোমেলি ব্যতিক্ৰম" }, metal: "Mg(s)", acid: "Very Dil. HNO₃",
    equation: "Mg + 2HNO₃ → Mg(NO₃)₂ + H₂",
    desc: { en: "Magnesium (and Manganese) are exceptions to the nitric acid anomaly. When reacting with VERY dilute nitric acid (approx 1%), they do actually evolve hydrogen gas.", as: "মেগনেছিয়াম (আৰু মেংগানিজ) নাইট্ৰিক এচিড এনোমেলিৰ ব্যতিক্ৰম। অতি পাতল নাইট্ৰিক এচিড (প্ৰায় 1%)-ৰ সৈতে বিক্ৰিয়া কৰিলে এইবোৰে সঁচাকৈয়ে হাইড্ৰ'জেন গেছ নিৰ্গত কৰে।" },
    observations: { en: "Magnesium ribbon reacts briskly with the very dilute acid, producing steady bubbles of colorless, odorless hydrogen gas.", as: "মেগনেছিয়াম ফিতাই অতি পাতল এচিডৰ সৈতে দ্ৰুতভাৱে বিক্ৰিয়া কৰে, বৰ্ণহীন, গন্ধহীন হাইড্ৰ'জেন গেছৰ নিৰন্তৰ বুদবুদ উৎপন্ন কৰে।" },
    examNotes: { en: "Crucial exception to remember for exams: Mg and Mn with very dilute HNO₃ are the only cases where H₂ gas is evolved.", as: "পৰীক্ষাৰ বাবে মনত ৰাখিবলগীয়া গুৰুত্বপূৰ্ণ ব্যতিক্ৰম: অতি পাতল HNO₃-ৰ সৈতে Mg আৰু Mn হ'ল একমাত্ৰ ক্ষেত্ৰ য'ত H₂ গেছ নিৰ্গত হয়।" },
    applications: "Demonstrates concentration-dependent chemical behavior and standard reduction potentials.",
    intensity: 3, hazards: { en: ["Flammable Gas (H₂)", "Mildly Corrosive"], as: ["জ্বলনযোগ্য গেছ (H₂)", "মৃদু ক্ষয়কাৰক"] },
    visuals: { metalColor: "#e2e8f0", productColor: "transparent", gasColor: "transparent", particleType: "clear_bubbles", environment: "open_bench" },
    quiz: [
      { q: { en: "Which gas is evolved when Magnesium reacts with VERY dilute nitric acid?", as: "মেগনেছিয়াম অতি পাতল নাইট্ৰিক এচিডৰ সৈতে বিক্ৰিয়া কৰিলে কোন গেছ নিৰ্গত হয়?" }, opts: { en: ["Nitric Oxide (NO)", "Nitrogen Dioxide (NO₂)", "Hydrogen (H₂)", "Ammonia (NH₃)"], as: ["নাইট্ৰিক অক্সাইড (NO)", "নাইট্ৰ'জেন ডাইঅক্সাইড (NO₂)", "হাইড্ৰ'জেন (H₂)", "এমোনিয়া (NH₃)"] }, ans: 2 },
      { q: { en: "Why is Magnesium an exception to the normal nitric acid behavior?", as: "মেগনেছিয়াম সাধাৰণ নাইট্ৰিক এচিড আচৰণৰ ব্যতিক্ৰম কিয়?" }, opts: { en: ["It is a transition metal", "The acid is too dilute to act as an oxidizing agent", "It forms a basic oxide", "It is lower in the reactivity series"], as: ["ই এক সংক্ৰমণ ধাতু", "অম্ল জাৰক হিচাপে কাম কৰাৰ বাবে অতি পাতল", "ই ক্ষাৰকীয় অক্সাইড গঠন কৰে", "ক্ৰিয়াশীলতা শ্ৰেণীত তলত আছে"] }, ans: 1 },
      { q: { en: "Which other metal shares this specific exception with Magnesium?", as: "কোন অন্য ধাতুৱে মেগনেছিয়ামৰ সৈতে এই বিশেষ ব্যতিক্ৰম ভাগ কৰে?" }, opts: { en: ["Iron (Fe)", "Copper (Cu)", "Manganese (Mn)", "Zinc (Zn)"], as: ["আয়ৰন (Fe)", "তামৰ (Cu)", "মেংগানিজ (Mn)", "জিংক (Zn)"] }, ans: 2 }
    ]
  },
  {
    id: 4, name: { en: "Copper + Hot Concentrated Sulphuric Acid", as: "তামৰ + গৰম ঘন ছালফিউৰিক এচিড" }, category: { en: "DEHYDRATION/OXIDATION", as: "নিৰ্জলীকৰণ/জাৰণ" }, metal: "Cu(s)", acid: "Conc. H₂SO₄",
    equation: "Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O",
    desc: { en: "Hot concentrated sulphuric acid acts as a powerful oxidizing agent. It oxidizes copper to copper(II) sulphate and is itself reduced to sulphur dioxide gas.", as: "গৰম ঘন ছালফিউৰিক এচিড শক্তিশালী জাৰক হিচাপে কাম কৰে। ই তামৰক কপাৰ(II) ছালফেটলৈ জাৰণ কৰে আৰু নিজে ছালফাৰ ডাইঅক্সাইড গেছলৈ বিজাৰিত হয়।" },
    observations: { en: "Upon strong heating, the copper dissolves. The solution turns blue/green. Choking, pungent-smelling sulphur dioxide (SO₂) gas is evolved.", as: "জোৰেদি গৰম কৰাত তামৰ দ্ৰৱীভূত হয়। দ্ৰৱণ নীলা/সেউজীয়া হয়। দম বন্ধ কৰা, তীব্ৰ গন্ধযুক্ত ছালফাৰ ডাইঅক্সাইড (SO₂) গেছ নিৰ্গত হয়।" },
    examNotes: { en: "Concentrated H₂SO₄ is an oxidizing agent, whereas dilute H₂SO₄ is not. Copper only reacts with the concentrated, hot form.", as: "ঘন H₂SO₄ জাৰক, যেতিয়াত পাতল H₂SO₄ নহয়। তামৰ কেৱল ঘন, গৰম ৰূপৰ সৈতেহে বিক্ৰিয়া কৰে।" },
    applications: "Laboratory preparation of SO₂ gas and synthesis of copper sulphate for fungicides (Bordeaux mixture).",
    intensity: 9, hazards: { en: ["Extreme Heat", "Toxic/Choking Gas (SO₂)", "Severe Acid Burns"], as: ["অতি উচ্চ উষ্ণতা", "বিষাক্ত/দমবন্ধকাৰী গেছ (SO₂)", "তীব্ৰ অম্ল দাহ"] },
    visuals: { metalColor: "#b45309", productColor: "#0891b2", gasColor: "rgba(255,255,255,0.4)", particleType: "white_choking_fumes", environment: "heated_fume_hood" },
    quiz: [
      { q: { en: "Which gas is evolved in this reaction?", as: "এই বিক্ৰিয়াত কোন গেছ নিৰ্গত হয়?" }, opts: { en: ["Hydrogen", "Hydrogen Sulphide", "Sulphur Dioxide", "Sulphur Trioxide"], as: ["হাইড্ৰ'জেন", "হাইড্ৰ'জেন ছালফাইড", "ছালফাৰ ডাইঅক্সাইড", "ছালফাৰ ট্ৰাইঅক্সাইড"] }, ans: 2 },
      { q: { en: "Why must the acid be hot and concentrated?", as: "অম্ল গৰম আৰু ঘন হ'ব লাগে কিয়?" }, opts: { en: ["To dissolve the copper physically", "To act as an oxidizing agent", "To prevent water formation", "To slow down the reaction"], as: ["তামৰ ভৌতিকভাৱে দ্ৰৱীভূত কৰিবলৈ", "জাৰক হিচাপে কাম কৰিবলৈ", "পানী গঠন ৰোধ কৰিবলৈ", "বিক্ৰিয়া লেহেমীয়া কৰিবলৈ"] }, ans: 1 },
      { q: { en: "What is the pungent smell characteristic of?", as: "তীব্ৰ গন্ধ কিহৰ বৈশিষ্ট্য?" }, opts: { en: ["Copper vapor", "Sulphuric acid fumes", "Sulphur dioxide gas", "Water vapor"], as: ["তামৰ বাষ্প", "ছালফিউৰিক এচিডৰ ধোঁৱা", "ছালফাৰ ডাইঅক্সাইড গেছ", "জলীয় বাষ্প"] }, ans: 2 }
    ]
  }
];

export function MineralAcidsModule() {
  const { recordCompletion, recordInteraction } = useLabTracker();
  const { lang } = useLanguage();
  const isAs = lang === "as";
  const [selectedExp, setSelectedExp] = useState<ExperimentDef | null>(null);
  const [state, setState] = useState<"SETUP" | "REACTING" | "FINISHED" | "QUIZ">("SETUP");
  const [progress, setProgress] = useState(0);
  useEffect(() => { if (selectedExp) recordInteraction(`exp-${selectedExp.id}`); }, [selectedExp, recordInteraction]);

  if (!selectedExp) {
    return <ExperimentDashboard onSelect={setSelectedExp} />;
  }

  if (state === "QUIZ") {
    return <QuizSection exp={selectedExp} onFinish={() => { setSelectedExp(null); setState("SETUP"); setProgress(0); }} />;
  }

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans flex flex-col relative h-[85vh] md:h-[800px] max-h-[1200px]">
      <div className="bg-slate-900 border-b border-slate-800 p-3 md:p-4 flex justify-between items-center z-10 shadow-lg">
        <div className="min-w-0 pr-2">
          <h2 className="text-base md:text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent truncate">{pickLang(selectedExp.name, lang)}</h2>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">{pickLang(selectedExp.category, lang)}</span>
            <span className="px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-red-900/30 text-red-400 border border-red-800/50">{isAs ? "বিষাক্ততা" : "Toxicity"}: {selectedExp.intensity}/10</span>
          </div>
        </div>
        <LanguageToggle />
        <button onClick={() => setSelectedExp(null)} className="shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] md:text-xs font-bold transition-all border border-slate-700">← {isAs ? "উভতি যাওক" : "Back"}</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 bg-slate-900/50 border-t md:border-t-0 md:border-r border-slate-800 p-4 md:p-6 flex flex-col justify-between overflow-y-auto order-2 md:order-1">
          <div>
            <div className="mb-4 md:mb-6">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5" /> {isAs ? "ৰাসায়নিক সমীকৰণ" : "Chemical Equation"}
              </div>
              <div className="bg-slate-950 p-2 md:p-3 rounded-lg border border-slate-800 font-mono text-center text-cyan-400 shadow-inner text-xs md:text-sm">
                {selectedExp.equation}
              </div>
            </div>
            
            <div className="mb-4 md:mb-6 space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1.5 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> {isAs ? "অম্ল তত্ত্ব" : "Acid Theory"}
                </div>
                <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed">{pickLang(selectedExp.desc, lang)}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-black mb-1.5 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" /> {isAs ? "লাইভ পৰ্যবেক্ষণ" : "Live Observations"}
                </div>
                <p className="text-[11px] md:text-xs text-emerald-200 leading-relaxed bg-emerald-950/30 p-2 md:p-2.5 rounded-lg border border-emerald-900/50">{pickLang(selectedExp.observations, lang)}</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-black mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {isAs ? "NCERT পৰীক্ষাৰ টোকা" : "NCERT Exam Notes"}
                </div>
                <p className="text-[11px] md:text-xs text-indigo-200 leading-relaxed bg-indigo-950/30 p-2 md:p-2.5 rounded-lg border border-indigo-900/50">{pickLang(selectedExp.examNotes, lang)}</p>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> {isAs ? "ফিউম হুড সুৰক্ষা প্ৰ'ট'কল" : "Fume Hood Safety Protocols"}
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
                <button onClick={() => { setState("REACTING"); setProgress(0); }} className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-xs md:text-sm">
                  <Flame className="w-4 h-4 md:w-5 md:h-5" /> {isAs ? "বিক্ৰিয়া আৰম্ভ কৰক" : "Initiate Reaction"}
                </button>
             )}
             {state === "REACTING" && (
                <div className="w-full p-3 md:p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="text-[10px] md:text-xs font-bold text-slate-400 mb-2 flex justify-between">
                    <span>{isAs ? "বিক্ৰিয়া অগ্ৰগতি" : "Reaction Progress"}</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 ease-linear" style={{ width: `${progress * 100}%` }} />
                  </div>
                </div>
             )}
             {state === "FINISHED" && (
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="w-full p-3 md:p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs md:text-sm font-black text-center flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> {isAs ? "গেছ নিৰ্গমন সম্পূৰ্ণ" : "Gas Evolution Complete"}
                  </div>
                  <button onClick={() => setState("QUIZ")} className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-black shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-[10px] md:text-sm">
                    {isAs ? "সুৰক্ষা কুইজ দিয়ক" : "Take Safety Quiz"} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button onClick={() => { setState("SETUP"); setProgress(0); }} className="w-full py-2.5 md:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 transition-all flex justify-center items-center gap-2 text-[10px] md:text-xs">
                    <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" /> {isAs ? "পুনৰ আৰম্ভ" : "Vent & Reset"}
                  </button>
                </div>
             )}
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col order-1 md:order-2 shrink-0 md:shrink border-b border-slate-800 md:border-b-0 h-[40vh] min-h-[320px] md:h-auto md:min-h-0 bg-slate-950 md:relative">
           <div className="relative overflow-hidden flex-1 w-full">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.5)_0%,rgba(2,6,23,1)_100%)] z-0" />
             <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0 pointer-events-none" />

             <div className="absolute inset-0 z-10 flex items-center justify-center">
               <ReactionCanvas exp={selectedExp} progress={progress} state={state} onProgressUpdate={setProgress} onFinish={() => { setState("FINISHED"); recordCompletion("interaction"); }} />
             </div>

             <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-1.5 md:gap-2 pointer-events-none">
                <HUDCard label={isAs ? "অম্ল অৱস্থা" : "Acid State"} value={progress === 0 ? (isAs ? "স্থিৰ" : "Stable") : progress < 1 ? (isAs ? "সক্ৰিয়" : "Active") : (isAs ? "শেষ" : "Exhausted")} color={progress > 0 && progress < 1 ? "text-orange-400" : "text-slate-400"} />
                <HUDCard label={isAs ? "বিষাক্ততা" : "Toxicity"} value={state === "REACTING" ? `${isAs ? "স্তৰ" : "Level"} ${Math.round(progress * selectedExp.intensity)}` : (isAs ? "সুৰক্ষিত" : "Safe")} color={state === "REACTING" && selectedExp.intensity > 5 ? "text-red-500 animate-pulse" : "text-emerald-400"} />
             </div>
           </div>

           <div className={`md:absolute md:bottom-0 md:inset-x-0 bg-slate-900/95 border-t border-slate-700/50 backdrop-blur-xl transition-all duration-700 ease-out z-30 flex w-full overflow-hidden ${state !== "SETUP" ? "h-20 md:h-48 opacity-100 md:translate-y-0" : "h-0 md:h-48 opacity-0 md:opacity-100 md:translate-y-full border-transparent md:border-slate-700/50"}`}>
             <div className="w-1/4 md:w-1/3 border-r border-slate-800/50 p-2 md:p-4 flex flex-col justify-center items-center text-center">
                <Microscope className="hidden md:block w-8 h-8 text-cyan-400 mb-2 opacity-50" />
                <h3 className="text-[8px] md:text-xs font-black uppercase tracking-widest text-slate-400">{isAs ? "আণৱিক" : "Molecular"}</h3>
                <p className="hidden md:block text-[10px] text-slate-500 mt-2 font-mono">
                  {progress < 0.5 ? (isAs ? "অম্ল আয়নীকৰণ..." : "Acid ionization...") : (isAs ? "ৰেডক্স স্থানান্তৰ সক্ৰিয়..." : "Redox transfer active...")}
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
  const reqRef = useRef<number | undefined>(undefined);
  const startRef = useRef(0);

  useEffect(() => {
    if (state === "SETUP") {
      pts.current = [];
      startRef.current = 0;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawSetup(ctx, canvas.width, canvas.height, exp, 0);
        }
      }
    }

    if (state !== "REACTING") return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const duration = 7 + (10 - exp.intensity) * 0.5;
    startRef.current = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startRef.current) / 1000;
      const p = Math.min(1, elapsed / duration);
      onProgressUpdate(p);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSetup(ctx, canvas.width, canvas.height, exp, p, time);

      // Spawn particles
      if (p > 0.03 && p < 0.97) {
        const spawnRate = exp.intensity / 8;
        if (Math.random() < spawnRate) spawnParticle(exp, pts, canvas.width, canvas.height, p);
      }

      // Update & render particles
      for (let i = pts.current.length - 1; i >= 0; i--) {
        const pt = pts.current[i];
        pt.x += pt.vx; pt.y += pt.vy; pt.life -= pt.ml;
        if (pt.kind === 'fume' || pt.kind === 'smoke') { pt.r += 0.3; pt.vx += (Math.random() - 0.5) * 0.15; }
        if (pt.kind === 'bubble') { pt.vx += (Math.random() - 0.5) * 0.3; }
        if (pt.life <= 0) { pts.current.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.c;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, Math.max(0.5, pt.r), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (p < 1) { reqRef.current = requestAnimationFrame(render); }
      else { setTimeout(() => onFinish(), 400); }
    };

    reqRef.current = requestAnimationFrame(render);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [state, exp]);

  // Draw the initial SETUP frame
  useEffect(() => {
    if (state === "SETUP") {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) drawSetup(ctx, canvas.width, canvas.height, exp, 0);
      }
    }
  }, [exp, state]);

  return <canvas ref={canvasRef} width={700} height={450} className="max-w-full" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
}

function drawSetup(ctx: CanvasRenderingContext2D, W: number, H: number, exp: ExperimentDef, p: number, time = 0) {
  const cx = W / 2;
  const isHeated = exp.visuals.environment === "heated_fume_hood";

  // --- Bench surface ---
  ctx.fillStyle = "rgba(51, 65, 85, 0.6)";
  ctx.fillRect(0, H * 0.78, W, 4);

  // --- Bunsen Burner (for heated experiments) ---
  if (isHeated) {
    const bx = cx, by = H * 0.78;
    // Base
    ctx.fillStyle = "#475569";
    ctx.fillRect(bx - 20, by - 8, 40, 8);
    // Barrel
    ctx.fillStyle = "#334155";
    ctx.fillRect(bx - 6, by - 55, 12, 48);
    // Flame
    if (p > 0) {
      const flicker = Math.sin(time / 80) * 4;
      // Outer flame
      ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
      ctx.beginPath();
      ctx.moveTo(bx - 12, by - 55);
      ctx.quadraticCurveTo(bx - 15 + flicker, by - 90, bx, by - 105 - flicker);
      ctx.quadraticCurveTo(bx + 15 - flicker, by - 90, bx + 12, by - 55);
      ctx.fill();
      // Inner flame
      ctx.fillStyle = "rgba(96, 165, 250, 0.8)";
      ctx.beginPath();
      ctx.moveTo(bx - 6, by - 55);
      ctx.quadraticCurveTo(bx - 8 + flicker/2, by - 80, bx, by - 90 - flicker/2);
      ctx.quadraticCurveTo(bx + 8 - flicker/2, by - 80, bx + 6, by - 55);
      ctx.fill();
    }
  }

  // --- Wire Gauze (for heated) ---
  const flaskBot = isHeated ? H * 0.78 - 60 : H * 0.78;
  if (isHeated) {
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
    ctx.lineWidth = 1;
    for (let i = -35; i <= 35; i += 7) {
      ctx.beginPath(); ctx.moveTo(cx + i, flaskBot); ctx.lineTo(cx + i, flaskBot + 3); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(cx - 35, flaskBot + 1); ctx.lineTo(cx + 35, flaskBot + 1); ctx.stroke();
  }

  // --- Flask / Beaker ---
  const bTop = isHeated ? flaskBot - 130 : flaskBot - 150;
  const bBot = flaskBot;
  const topW = 55; // half-width at the top opening
  const botW = 50; // half-width at the bottom
  const neckW = 18; // half-width of the narrow neck (for round-bottom flask)

  if (isHeated) {
    // Round-bottom flask with neck
    const neckTop = bTop;
    const neckBot = bTop + 40;
    const bulbTop = neckBot;
    const bulbBot = bBot;
    const bulbCy = (bulbTop + bulbBot) / 2 + 10;
    const bulbR = (bulbBot - bulbTop) / 2 + 5;

    // Neck
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - neckW, neckTop);
    ctx.lineTo(cx - neckW, neckBot);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + neckW, neckTop);
    ctx.lineTo(cx + neckW, neckBot);
    ctx.stroke();

    // Bulb
    ctx.beginPath();
    ctx.arc(cx, bulbCy, bulbR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
    ctx.stroke();

    // Liquid fill inside bulb
    const liquidAlpha = 0.15 + p * 0.5;
    if (exp.visuals.productColor !== "transparent") {
      ctx.fillStyle = hexToRgb(exp.visuals.productColor, liquidAlpha);
    } else {
      ctx.fillStyle = `rgba(200, 210, 255, ${0.08 + p * 0.1})`;
    }
    const liquidLevel = bulbCy - bulbR * 0.4 + p * 10;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, bulbCy, bulbR - 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillRect(cx - bulbR, liquidLevel, bulbR * 2, bulbBot - liquidLevel + 20);
    ctx.restore();

    // Metal inside bulb
    const mSize = 12 * (1 - p * 0.8);
    ctx.fillStyle = exp.visuals.metalColor;
    ctx.fillRect(cx - mSize / 2, bulbCy + bulbR * 0.3 - mSize / 2, mSize, mSize * 0.6);

  } else {
    // Standard wide beaker
    ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
    ctx.lineWidth = 2.5;
    // Left wall (slightly tapered)
    ctx.beginPath();
    ctx.moveTo(cx - topW, bTop);
    ctx.lineTo(cx - botW, bBot);
    ctx.stroke();
    // Right wall
    ctx.beginPath();
    ctx.moveTo(cx + topW, bTop);
    ctx.lineTo(cx + botW, bBot);
    ctx.stroke();
    // Bottom
    ctx.beginPath();
    ctx.moveTo(cx - botW, bBot);
    ctx.lineTo(cx + botW, bBot);
    ctx.stroke();
    // Lip
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - topW - 4, bTop);
    ctx.lineTo(cx - topW, bTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + topW, bTop);
    ctx.lineTo(cx + topW + 4, bTop);
    ctx.stroke();

    // Acid liquid in beaker
    const liqTop = bTop + 30;
    const liqFrac = (liqTop - bTop) / (bBot - bTop);
    const liqLW = topW + (botW - topW) * liqFrac;
    const liquidAlpha = 0.12 + p * 0.5;
    if (exp.visuals.productColor !== "transparent") {
      ctx.fillStyle = hexToRgb(exp.visuals.productColor, liquidAlpha);
    } else {
      ctx.fillStyle = `rgba(200, 210, 255, ${0.08 + p * 0.08})`;
    }
    ctx.beginPath();
    ctx.moveTo(cx - liqLW, liqTop);
    ctx.lineTo(cx - botW, bBot);
    ctx.lineTo(cx + botW, bBot);
    ctx.lineTo(cx + liqLW, liqTop);
    ctx.closePath();
    ctx.fill();

    // Acid surface ripple
    if (p > 0) {
      ctx.strokeStyle = `rgba(200, 230, 255, ${0.15 + Math.sin(time / 200) * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - liqLW + 3, liqTop);
      for (let x = cx - liqLW + 3; x < cx + liqLW - 3; x += 4) {
        ctx.lineTo(x, liqTop + Math.sin((x + time / 5) * 0.08) * 2);
      }
      ctx.stroke();
    }

    // Metal inside beaker
    const mSize = 20 * (1 - p * 0.75);
    ctx.fillStyle = exp.visuals.metalColor;

    if (exp.id === 1) {
      // Iron filings (small dots)
      for (let i = 0; i < 8; i++) {
        const fx = cx - 15 + i * 4;
        const fy = bBot - 8 - Math.sin(i * 1.3) * 3;
        ctx.beginPath();
        ctx.arc(fx, fy, mSize / 6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (exp.id === 3) {
      // Mg ribbon
      ctx.fillRect(cx - mSize * 0.8, bBot - 6 - mSize * 0.15, mSize * 1.6, mSize * 0.15);
    } else {
      // Cu turnings / block
      ctx.fillRect(cx - mSize / 2, bBot - 6 - mSize * 0.4, mSize, mSize * 0.4);
    }
  }

  // --- Label ---
  ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText(exp.acid, cx, bTop - 8);
  ctx.fillText(exp.metal, cx, bBot + 16);
}

function spawnParticle(exp: ExperimentDef, pts: React.MutableRefObject<Pt[]>, W: number, H: number, p: number) {
  const cx = W / 2;
  const isHeated = exp.visuals.environment === "heated_fume_hood";
  const surfaceY = isHeated ? H * 0.78 - 130 : H * 0.78 - 120;

  switch (exp.visuals.particleType) {
    case "brown_fumes":
    case "brown_fumes_intense": {
      const intense = exp.visuals.particleType === "brown_fumes_intense";
      pts.current.push({
        x: cx + (Math.random() - 0.5) * 50,
        y: surfaceY + Math.random() * 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -0.8 - Math.random() * (intense ? 2.5 : 1.5),
        life: 1, ml: 0.004 + Math.random() * 0.008,
        r: 6 + Math.random() * (intense ? 18 : 12),
        c: `rgba(${140 + Math.random() * 60}, ${40 + Math.random() * 30}, 15, 0.6)`,
        kind: 'fume'
      });
      // Small bubbles inside liquid
      if (Math.random() < 0.4) {
        pts.current.push({
          x: cx + (Math.random() - 0.5) * 30,
          y: surfaceY + 40 + Math.random() * 30,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -1.5 - Math.random(),
          life: 1, ml: 0.03, r: 1.5 + Math.random() * 2,
          c: "rgba(255,255,255,0.6)", kind: 'bubble'
        });
      }
      break;
    }
    case "clear_bubbles": {
      pts.current.push({
        x: cx + (Math.random() - 0.5) * 25,
        y: surfaceY + 50 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -2.5 - Math.random() * 2,
        life: 1, ml: 0.015 + Math.random() * 0.02,
        r: 2 + Math.random() * 4,
        c: "rgba(220, 240, 255, 0.7)", kind: 'bubble'
      });
      break;
    }
    case "white_choking_fumes": {
      // Dense white/grey SO₂ smoke
      pts.current.push({
        x: cx + (Math.random() - 0.5) * 30,
        y: surfaceY + Math.random() * 5,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -1.5 - Math.random() * 2.5,
        life: 1, ml: 0.005 + Math.random() * 0.008,
        r: 8 + Math.random() * 20,
        c: `rgba(${200 + Math.random() * 40}, ${210 + Math.random() * 30}, ${220 + Math.random() * 30}, 0.5)`,
        kind: 'smoke'
      });
      // Heat shimmer
      if (Math.random() < 0.3) {
        pts.current.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: surfaceY + 60,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -1 - Math.random(),
          life: 1, ml: 0.025, r: 1 + Math.random() * 1.5,
          c: "rgba(255, 200, 100, 0.5)", kind: 'bubble'
        });
      }
      break;
    }
  }
}

// --- MOLECULAR ANIMATION ---
function MolecularAnimation({ exp, progress }: { exp: ExperimentDef, progress: number }) {
   const { lang } = useLanguage();
   const isAs = lang === "as";
   if (progress === 0) return <div className="text-slate-600 font-mono text-[9px] md:text-xs animate-pulse">{isAs ? "বিক্ৰিয়াৰ অপেক্ষা..." : "Awaiting reaction..."}</div>;
   if (progress >= 1) return <div className="text-emerald-500 font-mono text-[9px] md:text-xs">{isAs ? "সাম্যাৱস্থা পোৱা গৈছে" : "Equilibrium Reached"}</div>;

   const getLeftAtom = () => {
     if(exp.id === 1) return "Fe";
     if(exp.id === 2) return "Cu";
     if(exp.id === 3) return "Mg";
     return "Cu";
   };

   const getRightAtom = () => {
     if(exp.id === 1 || exp.id === 2) return "HNO₃";
     if(exp.id === 3) return "H⁺";
     return "H₂SO₄";
   };

   return (
     <div className="w-full h-full flex items-center justify-center relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <div className="flex items-center gap-3 md:gap-6 z-10">
          <div className={`relative w-9 h-9 md:w-14 md:h-14 rounded-full border-2 md:border-4 flex items-center justify-center transition-all duration-1000 ${progress > 0.5 ? 'border-indigo-500 text-indigo-400 bg-indigo-900/30 scale-90 translate-x-1 md:translate-x-4' : 'border-slate-500 text-slate-300 bg-slate-800'}`}>
            <span className="font-bold text-[10px] md:text-base">{getLeftAtom()}</span>
            {progress > 0.5 && <span className="absolute -top-1 -right-1 md:-top-2.5 md:-right-2.5 text-[7px] md:text-[10px] bg-indigo-600 text-white px-1 md:px-1.5 rounded-full shadow-lg border border-indigo-400">2+</span>}
          </div>

          <div className={`relative w-10 h-10 md:w-16 md:h-16 rounded-full border-2 md:border-4 flex items-center justify-center transition-all duration-1000 ${progress > 0.5 ? 'border-red-500 text-red-400 bg-red-950/50 scale-110 -translate-x-1 md:-translate-x-4' : 'border-cyan-400 text-cyan-300 bg-cyan-900/30'}`}>
            <span className="font-bold text-[8px] md:text-sm">{getRightAtom()}</span>
            {progress > 0.5 && <span className="absolute -top-1 -right-1 md:-top-2.5 md:-right-2.5 text-[7px] md:text-[10px] bg-red-600 text-white px-1 md:px-1.5 rounded-full shadow-lg border border-red-400">-</span>}
          </div>
        </div>

        {progress > 0.1 && progress < 0.9 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm opacity-80 animate-pulse" />
        )}

        <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 text-[6px] md:text-[9px] text-slate-500 tracking-widest uppercase whitespace-nowrap">
          {progress < 0.5 ? (isAs ? "ইলেকট্ৰন স্থানান্তৰ" : "Electron Transfer") : (isAs ? "আয়নীকৰণ" : "Ionization")}
        </div>
     </div>
   );
}


// --- DASHBOARD UI ---
function ExperimentDashboard({ onSelect }: { onSelect: (e: ExperimentDef) => void }) {
  const { lang } = useLanguage();
  const isAs = lang === "as";
  return (
    <div className="w-full bg-slate-950 min-h-[50vh] text-slate-100 font-sans selection:bg-cyan-500/30 rounded-2xl border border-slate-800">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight">{isAs ? "খনিজ অম্ল পৰীক্ষাগাৰ" : "Mineral Acids Laboratory"}</h1>
          <LanguageToggle />
        </div>
        <div className="text-center mb-10">
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-sm md:text-base">{isAs ? "নাইট্ৰিক এচিড এনোমেলি আৰু অত্যন্ত বিষাক্ত গেছ বিচ্ছুৰণ পদাৰ্থবিজ্ঞানসহ ধাতু আৰু খনিজ অম্লৰ জটিল ৰেডক্স বিক্ৰিয়া অন্বেষণ কৰক।" : "Investigate the complex redox reactions of metals with mineral acids, featuring the famous Nitric Acid Anomaly and highly toxic gas diffusion physics."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIMENTS.map((exp) => (
            <div key={exp.id} onClick={() => onSelect(exp)} 
                 className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 cursor-pointer hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.3)] flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
              
              <div className="absolute -inset-20 bg-gradient-to-br from-cyan-500/0 via-emerald-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:via-emerald-500/10 group-hover:to-blue-500/10 rounded-full blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400`}>
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${exp.intensity > 7 ? 'bg-red-950/30 border-red-900/50 text-red-400' : exp.intensity > 4 ? 'bg-orange-950/30 border-orange-900/50 text-orange-400' : 'bg-green-950/30 border-green-900/50 text-green-400'}`}>
                    Lv. {exp.intensity}
                  </span>
                </div>
                
                <h3 className="text-base md:text-lg font-black text-slate-100 mb-1">{pickLang(exp.name, lang)}</h3>
                <p className="text-[10px] md:text-xs text-slate-500 font-mono font-bold mb-4">{exp.equation}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-4 text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>{isAs ? "ফিউম হুডত প্ৰৱেশ" : "Access Fume Hood"}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_100%)] pointer-events-none" />
       
       <div className="max-w-xl w-full z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-cyan-400 font-black uppercase text-[10px] md:text-xs tracking-widest">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" /> {isAs ? "সুৰক্ষা যাচাই" : "Safety Verification"}
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
              
              let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800";
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
               <p className="text-rose-400 text-xs md:text-sm font-bold mb-2 md:mb-3">{isAs ? "ভুল পৰ্যবেক্ষণ। ৰাসায়নিক তত্ত্ব পুনৰীক্ষণ কৰক।" : "Incorrect observation. Review the chemical theory."}</p>
               <button onClick={() => { setStatus("IDLE"); setSelectedOpt(null); }} className="text-slate-400 hover:text-white text-[10px] md:text-xs font-bold underline underline-offset-4 transition-colors">{isAs ? "পুনৰ চেষ্টা কৰক" : "Try Again"}</button>
            </div>
          )}

          {status === "CORRECT" && (
            <div className="mt-6 md:mt-8 text-center animate-fade-in">
               <div className="inline-flex items-center gap-1.5 md:gap-2 bg-emerald-500/20 text-emerald-400 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-emerald-500/50 font-black text-xs md:text-sm uppercase tracking-wide">
                 <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> {qIdx < exp.quiz.length - 1 ? (isAs ? "সঠিক! পৰৱৰ্তী লোড হৈছে..." : "Correct! Loading next...") : (isAs ? "যাচাই সম্পূৰ্ণ" : "Verification Complete")}
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

function hexToRgb(hex: string, alpha: number) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : `rgba(0,0,0,${alpha})`;
}
