// ── Bilingual Translation Dictionary ─────────────────────────────────────────
// Architecture: flat key → { en, as } (Assamese)
// Fallback: if 'as' missing → 'en' displayed
// Future: add 'hi', 'bn', etc. following same pattern

export type LangCode = "en" | "as";
export type TranslationEntry = Record<LangCode, string>;
export type TranslationDict = Record<string, TranslationEntry>;

export const TRANSLATIONS: TranslationDict = {

  // ── Common UI ──────────────────────────────────────────────────────────────
  "ui.back": { en: "Back", as: "উভতি যাওক" },
  "ui.backToDashboard": { en: "← Dashboard", as: "← ডেচব'ৰ্ড" },
  "ui.quiz": { en: "Quiz", as: "প্ৰশ্নোত্তৰ" },
  "ui.clear": { en: "Clear", as: "মুচি পেলাওক" },
  "ui.stop": { en: "■ Stop", as: "■ থামক" },
  "ui.startExploration": { en: "Start Exploration →", as: "অন্বেষণ আৰম্ভ কৰক →" },
  "ui.exploreNow": { en: "Explore →", as: "অন্বেষণ কৰক →" },
  "ui.retry": { en: "Retry", as: "পুনৰ চেষ্টা কৰক" },
  "ui.next": { en: "Next Question →", as: "পৰৱৰ্তী প্ৰশ্ন →" },
  "ui.seeResults": { en: "See Results", as: "ফলাফল চাওক" },
  "ui.correct": { en: "Correct!", as: "শুদ্ধ!" },
  "ui.wrong": { en: "Wrong", as: "ভুল" },
  "ui.score": { en: "Score", as: "নম্বৰ" },
  "ui.clickToExplore": {
    en: "Click any structure to explore",
    as: "অন্বেষণৰ বাবে যিকোনো অংগত ক্লিক কৰক",
  },
  "ui.followJourney": { en: "▶ Follow Journey", as: "▶ যাত্ৰা অনুসৰণ কৰক" },
  "ui.filtrationJourney": { en: "▶ Filtration Journey", as: "▶ পৰিস্ৰাৱণ যাত্ৰা" },
  "ui.nephronJourney": { en: "▶ Nephron Journey", as: "▶ নেফ্ৰন যাত্ৰা" },
  "ui.followBloodJourney": { en: "▶ Follow Blood Journey", as: "▶ তেজৰ যাত্ৰা অনুসৰণ কৰক" },
  "ui.step": { en: "Step", as: "পদক্ষেপ" },
  "ui.quizComplete": { en: "Quiz Complete!", as: "প্ৰশ্নোত্তৰ সম্পূৰ্ণ!" },
  "ui.language": { en: "EN", as: "অ" },
  "ui.excellent": { en: "Excellent! Expert level!", as: "অসাধাৰণ! বিশেষজ্ঞ স্তৰ!" },
  "ui.goodWork": { en: "Good work — review more!", as: "ভাল কাম — আৰু অধ্যয়ন কৰক!" },
  "ui.reviewMore": { en: "Review the module again.", as: "আকৌ অধ্যয়ন কৰক।" },

  // Info panel section headers
  "panel.functions": { en: "Functions", as: "কাৰ্যসমূহ" },
  "panel.keyFacts": { en: "Key Facts", as: "মূল তথ্য" },
  "panel.examNotes": { en: "Exam Notes (NCERT)", as: "পৰীক্ষাৰ টোকা (NCERT)" },
  "panel.ncertNote": { en: "NCERT Note", as: "NCERT টোকা" },
  "panel.funFact": { en: "Fun Fact", as: "মজাৰ তথ্য" },
  "panel.disorders": { en: "Associated Disorders", as: "সংশ্লিষ্ট ব্যাধিসমূহ" },
  "panel.circulationNote": { en: "Circulation Note", as: "পৰিবহন টোকা" },
  "panel.filtrationNote": { en: "Filtration Note", as: "পৰিস্ৰাৱণ টোকা" },

  // Blood type badges
  "blood.oxygenated": { en: "Oxygenated Blood", as: "অক্সিজেনযুক্ত তেজ" },
  "blood.deoxygenated": { en: "Deoxygenated Blood", as: "অক্সিজেনবিহীন তেজ" },
  "blood.both": { en: "Both (exchange site)", as: "উভয় (বিনিময় স্থান)" },
  "blood.none": { en: "No blood flow", as: "তেজৰ প্ৰবাহ নাই" },
  "category.organ": { en: "Excretory Organ", as: "বৰ্জন অংগ" },
  "category.nephron": { en: "Nephron Structure", as: "নেফ্ৰন গঠন" },

  // ── Biology Module names ───────────────────────────────────────────────────
  "module.animalCell": { en: "Animal Cell Explorer", as: "প্ৰাণী কোষ অন্বেষণ" },
  "module.plantCell": { en: "Plant Cell Explorer", as: "উদ্ভিদ কোষ অন্বেষণ" },
  "module.digestive": { en: "Human Digestive System", as: "মানৱ পাচন তন্ত্ৰ" },
  "module.respiratory": { en: "Human Respiratory System", as: "মানৱ শ্বাস তন্ত্ৰ" },
  "module.heart": { en: "Heart & Blood Circulation", as: "হৃদয় আৰু তেজ পৰিবহন" },
  "module.excretory": { en: "Excretory System & Nephron", as: "মলত্যাগ তন্ত্ৰ আৰু নেফ্ৰন" },

  // Module tag lines (virtual-lab cards)
  "module.animalCell.tag": { en: "INTERACTIVE", as: "আলতৈয়ালি" },
  "module.animalCell.desc": {
    en: "Organelles · Live animation · NCERT Aligned",
    as: "কোষাঙ্গ · জীৱন্ত চলচ্চিত্ৰ · NCERT মানদণ্ড",
  },
  "module.plantCell.tag": { en: "LIVE DIAGRAM", as: "জীৱন্ত চিত্ৰ" },
  "module.plantCell.desc": {
    en: "Cell wall · Chloroplasts · Central vacuole · NCERT Aligned",
    as: "কোষ প্ৰাচীৰ · হৰিতকণা · কেন্দ্ৰীয় গহ্বৰ · NCERT মানদণ্ড",
  },
  "module.respiratory.tag": { en: "LIVE ANIMATION", as: "জীৱন্ত চলচ্চিত্ৰ" },
  "module.respiratory.desc": {
    en: "12 organs · Live breathing cycle · O₂/CO₂ exchange · Alveoli",
    as: "১২টা অংগ · জীৱন্ত শ্বাস চক্ৰ · O₂/CO₂ বিনিময় · বায়ুকোষ",
  },
  "module.digestive.tag": { en: "LIVE ANIMATION", as: "জীৱন্ত চলচ্চিত্ৰ" },
  "module.digestive.desc": {
    en: "12 organs · Live digestion journey · Peristalsis · NCERT Exam notes",
    as: "১২টা অংগ · জীৱন্ত পাচন যাত্ৰা · পেৰিষ্টালছিছ · NCERT পৰীক্ষাৰ টোকা",
  },
  "module.heart.tag": { en: "DOUBLE CIRCULATION", as: "দ্বিপৰিবহন" },
  "module.heart.desc": {
    en: "16 structures · 4 chambers · Valves · Pulmonary & Systemic circuits",
    as: "১৬টা গঠন · ৪টা কক্ষ · কপাটিকা · ফুসফুসীয় আৰু তন্ত্ৰগত চক্ৰ",
  },
  "module.excretory.tag": { en: "LIVE FILTRATION", as: "জীৱন্ত পৰিস্ৰাৱণ" },
  "module.excretory.desc": {
    en: "Kidneys · Nephron · Blood filtration · Urine formation · ADH & Aldosterone",
    as: "বৃক্ক · নেফ্ৰন · তেজ পৰিস্ৰাৱণ · মূত্ৰ গঠন · ADH আৰু এল্ডষ্টেৰন",
  },

  // ── Dashboard content ──────────────────────────────────────────────────────
  "dash.excretory.title": {
    en: "Human Excretory System & Nephron",
    as: "মানৱ মলত্যাগ তন্ত্ৰ আৰু নেফ্ৰন",
  },
  "dash.excretory.subtitle": {
    en: "Explore kidney anatomy, trace blood filtration live, watch urine form step-by-step through the nephron, and master NCERT excretion concepts interactively.",
    as: "বৃক্কৰ গঠন অন্বেষণ কৰক, জীৱন্তভাৱে তেজ পৰিস্ৰাৱণ চাওক, নেফ্ৰনৰ মাজেৰে মূত্ৰ গঠন পদক্ষেপে পদক্ষেপে পৰ্যবেক্ষণ কৰক।",
  },
  "dash.excretory.stat1": { en: "180 L/day", as: "১৮০ লি./দিন" },
  "dash.excretory.stat1sub": { en: "blood filtered", as: "তেজ পৰিস্ৰাৱণ" },
  "dash.excretory.stat2": { en: "1.5 L/day", as: "১.৫ লি./দিন" },
  "dash.excretory.stat2sub": { en: "urine produced", as: "মূত্ৰ উৎপন্ন" },
  "dash.excretory.stat3": { en: "~1 Million", as: "~১০ লাখ" },
  "dash.excretory.stat3sub": { en: "nephrons/kidney", as: "নেফ্ৰন/বৃক্ক" },
  "dash.excretory.stat4": { en: "GFR 125", as: "GFR ১২৫" },
  "dash.excretory.stat4sub": { en: "mL/min normal", as: "মি.লি./মিনিট" },

  "dash.heart.title": {
    en: "Human Heart & Blood Circulation",
    as: "মানৱ হৃদপিণ্ড আৰু তেজ পৰিবহন",
  },

  // Explorer tabs
  "tab.excretorySystem": { en: "🫘 Excretory System", as: "🫘 মলত্যাগ তন্ত্ৰ" },
  "tab.nephron": { en: "🔬 Nephron Detail", as: "🔬 নেফ্ৰনৰ বিৱৰণ" },

  // ── Structure names ────────────────────────────────────────────────────────
  // ── Animal Cell ──
  "struct.cellMembrane": { en: "Cell Membrane", as: "কোষ আৱৰণ" },
  "struct.nucleus": { en: "Nucleus", as: "কেন্দ্ৰক" },
  "struct.nucleolus": { en: "Nucleolus", as: "কেন্দ্ৰিকা" },
  "struct.nuclearMembrane": { en: "Nuclear Membrane", as: "কেন্দ্ৰক আৱৰণ" },
  "struct.cytoplasm": { en: "Cytoplasm", as: "কোষদ্ৰব্য" },
  "struct.mitochondria": { en: "Mitochondria", as: "মাইট'কণ্ড্ৰিয়া" },
  "struct.roughER": { en: "Rough ER", as: "অমসৃণ ER" },
  "struct.smoothER": { en: "Smooth ER", as: "মসৃণ ER" },
  "struct.golgi": { en: "Golgi Apparatus", as: "গ'লজি বস্তু" },
  "struct.lysosome": { en: "Lysosome", as: "লাইছ'জম" },
  "struct.ribosome": { en: "Ribosome", as: "ৰাইব'জম" },
  "struct.centriole": { en: "Centriole", as: "তাৰকাকেন্দ্ৰ" },
  "struct.vacuole": { en: "Vacuole", as: "গহ্বৰ" },

  // ── Plant Cell ──
  "struct.cellWall": { en: "Cell Wall", as: "কোষ প্ৰাচীৰ" },
  "struct.chloroplast": { en: "Chloroplast", as: "হৰিতকণা" },
  "struct.centralVacuole": { en: "Central Vacuole", as: "কেন্দ্ৰীয় গহ্বৰ" },
  "struct.plasmodesmata": { en: "Plasmodesmata", as: "প্লাজমডেছমাটা" },

  // ── Digestive System ──
  "struct.mouth": { en: "Mouth", as: "মুখ" },
  "struct.oralCavity": { en: "Oral Cavity", as: "মুখগহ্বৰ" },
  "struct.salivaryGlands": { en: "Salivary Glands", as: "লালাগ্ৰন্থি" },
  "struct.pharynx": { en: "Pharynx", as: "গলনালী" },
  "struct.esophagus": { en: "Esophagus", as: "অন্ননলী" },
  "struct.stomach": { en: "Stomach", as: "পাকস্থলী" },
  "struct.liver": { en: "Liver", as: "যকৃৎ" },
  "struct.gallbladder": { en: "Gallbladder", as: "পিত্তাশয়" },
  "struct.pancreas": { en: "Pancreas", as: "অগ্ন্যাশয়" },
  "struct.smallIntestine": { en: "Small Intestine", as: "ক্ষুদ্ৰান্ত্ৰ" },
  "struct.largeIntestine": { en: "Large Intestine", as: "বৃহদান্ত্ৰ" },
  "struct.rectum": { en: "Rectum", as: "মলাশয়" },
  "struct.anus": { en: "Anus", as: "পায়ু" },

  // ── Respiratory System ──
  "struct.nasalCavity": { en: "Nasal Cavity", as: "নাসাগহ্বৰ" },
  "struct.nasalMouth": { en: "Nasal / Oral", as: "নাসা / মুখ" },
  "struct.pharynxResp": { en: "Pharynx", as: "গলবিল" },
  "struct.larynx": { en: "Larynx", as: "স্বৰযন্ত্ৰ" },
  "struct.trachea": { en: "Trachea", as: "শ্বাসনলী" },
  "struct.bronchi": { en: "Bronchi", as: "ব্ৰঙ্কাই" },
  "struct.bronchioles": { en: "Bronchioles", as: "ব্ৰঙ্কিঅ'ল" },
  "struct.lungs": { en: "Lungs", as: "হাঁওফাঁও" },
  "struct.alveoli": { en: "Alveoli", as: "বায়ুকোষ" },
  "struct.diaphragm": { en: "Diaphragm", as: "মধ্যচ্ছদা" },
  "struct.pleura": { en: "Pleura", as: "ফুসফুসাৱৰণ" },
  "struct.ribs": { en: "Ribs", as: "পঞ্জৰাস্থি" },

  // ── Heart & Circulation ──
  "struct.rightAtrium": { en: "Right Atrium", as: "সোঁ অলিন্দ" },
  "struct.rightVentricle": { en: "Right Ventricle", as: "সোঁ নিলয়" },
  "struct.leftAtrium": { en: "Left Atrium", as: "বাওঁ অলিন্দ" },
  "struct.leftVentricle": { en: "Left Ventricle", as: "বাওঁ নিলয়" },
  "struct.septum": { en: "Septum", as: "মধ্যপাৰ্শ্ব" },
  "struct.tricuspidValve": { en: "Tricuspid Valve", as: "ত্ৰিৰূপ কপাটিকা" },
  "struct.mitralValve": { en: "Mitral Valve", as: "দ্বিৰূপ কপাটিকা" },
  "struct.pulmonaryValve": { en: "Pulm. Valve", as: "ফুসফুসীয় কপাটিকা" },
  "struct.aorticValve": { en: "Aortic Valve", as: "মহাধমনী কপাটিকা" },
  "struct.aorta": { en: "Aorta", as: "মহাধমনী" },
  "struct.aortaSystemic": { en: "Aorta", as: "মহাধমনী" },
  "struct.pulmonaryArtery": { en: "Pulm. Artery", as: "ফুসফুসীয় ধমনী" },
  "struct.pulmonaryVeins": { en: "Pulm. Veins", as: "ফুসফুসীয় শিৰা" },
  "struct.svc": { en: "SVC", as: "ঊৰ্ধ্ব মহাশিৰা" },
  "struct.ivc": { en: "IVC", as: "নিম্ন মহাশিৰা" },
  "struct.lungsPulm": { en: "Lungs", as: "হাঁওফাঁও" },
  "struct.bodyCapillaries": { en: "Body Capillaries", as: "দেহৰ কৈশিক নলী" },
  "struct.cardiacApex": { en: "Cardiac Apex", as: "হৃদয়ৰ শীৰ্ষ" },

  // ── Excretory System (organs) ──
  "struct.kidneys": { en: "Right Kidney", as: "সোঁ বৃক্ক" },
  "struct.kidneysLeft": { en: "Left Kidney", as: "বাওঁ বৃক্ক" },
  "struct.renalArtery": { en: "Renal Artery", as: "বৃক্কীয় ধমনী" },
  "struct.renalVein": { en: "Renal Vein", as: "বৃক্কীয় শিৰা" },
  "struct.ureter": { en: "Ureter", as: "মূত্ৰনলী" },
  "struct.bladder": { en: "Urinary Bladder", as: "মূত্ৰাশয়" },
  "struct.urethra": { en: "Urethra", as: "মূত্ৰমাৰ্গ" },
  "struct.abdominalAorta": { en: "Aorta", as: "মহাধমনী" },
  "struct.ivcExcretory": { en: "IVC", as: "নিম্ন মহাশিৰা" },
  "struct.adrenalGland": { en: "Adrenal Gland", as: "অধিবৃক্ক গ্ৰন্থি" },

  // ── Nephron structures ──
  "struct.afferentArteriole": { en: "Afferent Arteriole", as: "অভিবাহী ধমনিকা" },
  "struct.glomerulus": { en: "Glomerulus", as: "গ্লোমেৰুলাছ" },
  "struct.bowmansCapsule": { en: "Bowman's Capsule", as: "বৌমানৰ কেপছুল" },
  "struct.pct": { en: "PCT", as: "PCT (নিকটতম বাঁকা নলিকা)" },
  "struct.loopOfHenle": { en: "Loop of Henle", as: "হেনলেৰ লুপ" },
  "struct.dct": { en: "DCT", as: "DCT (দূৰৱৰ্তী বাঁকা নলিকা)" },
  "struct.collectingDuct": { en: "Collecting Duct", as: "সংগ্ৰহী নলিকা" },
  "struct.efferentArteriole": { en: "Efferent Arteriole", as: "অপবাহী ধমনিকা" },
  "struct.peritubularCaps": { en: "Peritubular Caps", as: "পেৰিটিউবুলাৰ কৈশিক" },

  // ── Sub-labels (subtitle hints under structure labels in SVG) ──
  "sub.bloodSupply": { en: "blood supply", as: "তেজৰ যোগান" },
  "sub.oxygenated": { en: "oxygenated", as: "অক্সিজেনযুক্ত" },
  "sub.purifiedBlood": { en: "purified blood", as: "পৰিশ্ৰুত তেজ" },
  "sub.peristalsis": { en: "peristalsis", as: "অনুক্ৰমিক সংকোচন" },
  "sub.300600ml": { en: "300-600 mL", as: "৩০০-৬০০ মি.লি." },
  "sub.exitPathway": { en: "exit pathway", as: "নিৰ্গমন পথ" },
  "sub.returnsToHeart": { en: "returns to heart", as: "হৃদয়লৈ উভতি যায়" },
  "sub.1MNephrons": { en: "~1M nephrons", as: "~১০ লাখ নেফ্ৰন" },
  "sub.highPressure": { en: "high pressure", as: "উচ্চ চাপ" },
  "sub.collectsFiltrate": { en: "collects filtrate", as: "পৰিস্ৰুত তৰল সংগ্ৰহ" },
  "sub.6570Reabsorbed": { en: "65-70% reabsorbed", as: "৬৫-৭০% পুনৰশোষণ" },
  "sub.countercurrent": { en: "countercurrent", as: "বিপৰীতপ্ৰবাহ" },
  "sub.ultrafiltration": { en: "ultrafiltration", as: "পৰম পৰিস্ৰাৱণ" },
  "sub.narrowerVessel": { en: "narrower vessel", as: "সংকীৰ্ণ নলী" },
  "sub.reabsorption": { en: "reabsorption", as: "পুনৰশোষণ" },
  "sub.aldosteroneTarget": { en: "aldosterone target", as: "এল্ডষ্টেৰন লক্ষ্য" },
  "sub.adhTarget": { en: "ADH target", as: "ADH লক্ষ্য" },
  "sub.gasExchange": { en: "gas exchange", as: "গেছ বিনিময়" },
  "sub.upperBody": { en: "upper body", as: "দেহৰ ওপৰভাগ" },
  "sub.lowerBody": { en: "lower body", as: "দেহৰ তলভাগ" },
  "sub.systemic": { en: "systemic", as: "তন্ত্ৰগত" },
  "sub.semilunar": { en: "semilunar", as: "অৰ্ধচন্দ্ৰাকাৰ" },
  "sub.3cusps": { en: "3 cusps", as: "৩টা পত্ৰ" },
  "sub.2cusps": { en: "2 cusps", as: "২টা পত্ৰ" },
  "sub.la": { en: "(LA)", as: "(বাওঁ অলিন্দ)" },
  "sub.lv": { en: "(LV)", as: "(বাওঁ নিলয়)" },
  "sub.ra": { en: "(RA)", as: "(সোঁ অলিন্দ)" },
  "sub.rv": { en: "(RV)", as: "(সোঁ নিলয়)" },
  "sub.preventsmixing": { en: "prevents mixing", as: "মিশ্ৰণ ৰোধ কৰে" },
  "sub.deoxygenated": { en: "deoxygenated", as: "অক্সিজেনবিহীন" },

  // ── Nephron journey steps ──
  "journey.nephron.afferent": {
    en: "Blood under high pressure flows into glomerulus via afferent arteriole.",
    as: "অভিবাহী ধমনিকাৰে উচ্চ চাপত তেজ গ্লোমেৰুলাছলৈ প্ৰবাহিত হয়।",
  },
  "journey.nephron.glom": {
    en: "Ultrafiltration: small molecules forced into Bowman's capsule. GFR = 125 mL/min.",
    as: "পৰম পৰিস্ৰাৱণ: ক্ষুদ্ৰ অণু বৌমানৰ কেপছুললৈ প্ৰৱেশ কৰে। GFR = ১২৫ মি.লি./মিনিট।",
  },
  "journey.nephron.pct": {
    en: "65-70% of Na⁺/water reabsorbed. 100% glucose and amino acids recovered.",
    as: "৬৫-৭০% Na⁺/পানী পুনৰশোষণ। ১০০% গ্লুকোজ আৰু এমিনো এছিড পুনৰুদ্ধাৰ।",
  },
  "journey.nephron.loop": {
    en: "Countercurrent multiplier creates 300→1200 mOsm medullary gradient.",
    as: "বিপৰীতপ্ৰবাহ গুণক ৩০০→১২০০ mOsm মেডুলাৰি গ্ৰেডিয়েন্ট সৃষ্টি কৰে।",
  },
  "journey.nephron.dct": {
    en: "K⁺, H⁺ secreted. Na⁺, Ca²⁺ reabsorbed under hormone control.",
    as: "K⁺, H⁺ নিঃসৰণ। হৰম'নৰ নিয়ন্ত্ৰণত Na⁺, Ca²⁺ পুনৰশোষণ।",
  },
  "journey.nephron.cd": {
    en: "ADH-driven water reabsorption. Final urine concentrated to ~1.5 L/day.",
    as: "ADH-চালিত পানী পুনৰশোষণ। চূড়ান্ত মূত্ৰ ~১.৫ লি./দিনলৈ ঘনীভূত হয়।",
  },

  // ── Quiz UI strings ───────────────────────────────────────────────────────
  "quiz.title.excretory": { en: "Excretory System Quiz", as: "মলত্যাগ তন্ত্ৰ প্ৰশ্নোত্তৰ" },
  "quiz.excellent.excretory": {
    en: "Excellent! Kidney expert!",
    as: "অসাধাৰণ! বৃক্ক বিশেষজ্ঞ!",
  },
  "quiz.good.excretory": {
    en: "Good — review nephron functions!",
    as: "ভাল — নেফ্ৰনৰ কাৰ্য পুনৰীক্ষণ কৰক!",
  },
  "quiz.try.excretory": {
    en: "Review the excretory system module.",
    as: "মলত্যাগ তন্ত্ৰ পাঠ পুনৰ অধ্যয়ন কৰক।",
  },
  "quiz.excellent.heart": {
    en: "Excellent! Heart expert!",
    as: "অসাধাৰণ! হৃদয় বিশেষজ্ঞ!",
  },
  "quiz.good.heart": {
    en: "Good work — review the valves!",
    as: "ভাল কাম — কপাটিকাসমূহ পুনৰীক্ষণ কৰক!",
  },

  // ── Virtual Lab page ───────────────────────────────────────────────────────
  "vlab.title": { en: "Virtual Science Lab", as: "ভাৰ্চুৱেল বিজ্ঞান পৰীক্ষাগাৰ" },
  "vlab.bio.title": { en: "Biology Lab", as: "জীৱবিজ্ঞান পৰীক্ষাগাৰ" },
  "vlab.bio.subtitle": {
    en: "Interactive biology simulations aligned with NCERT/CBSE curriculum",
    as: "NCERT/CBSE পাঠ্যক্ৰম অনুযায়ী আলতৈয়ালি জীৱবিজ্ঞান অনুকৰণ",
  },
  "vlab.experiments": { en: "Experiments", as: "পৰীক্ষা-নিৰীক্ষা" },
  "vlab.interactiveMod": { en: "Interactive Modules", as: "আলতৈয়ালি পাঠ" },
  "vlab.launchSim": { en: "Launch Simulation →", as: "অনুকৰণ আৰম্ভ কৰক →" },

  // ── Cortex/Medulla labels (nephron SVG) ──
  "nephron.corteMedialla": { en: "— CORTEX | MEDULLA —", as: "— বাহ্যিক ভাগ | অভ্যন্তৰীণ ভাগ —" },
  "nephron.descLoop": { en: "↓DESC", as: "↓অবতৰণ" },
  "nephron.ascLoop": { en: "ASC↑", as: "উত্থান↑" },
  "nephron.bladderLabel": { en: "Bladder", as: "মূত্ৰাশয়" },

  // ── Biology lab headings (virtual-lab) ──
  "bio.heading": { en: "Biology", as: "জীৱবিজ্ঞান" },
  "bio.moduleCount": { en: "interactive modules", as: "আলতৈয়ালি পাঠ" },
  "bio.liveAnimation": { en: "LIVE ANIMATION", as: "জীৱন্ত চলচ্চিত্ৰ" },

  // ── Extra panel section headers ─────────────────────────────────────────────
  "panel.structure": { en: "Structure", as: "গঠন" },
  "panel.function": { en: "Function", as: "কাৰ্য" },
  "panel.secretions": { en: "Secretions / Enzymes", as: "নিঃসৰণ / এনজাইম" },
  "panel.digestionJourney": { en: "Digestion Journey", as: "পাচন যাত্ৰা" },
  "panel.breathingNote": { en: "During Breathing", as: "শ্বাস-প্ৰশ্বাসৰ সময়ত" },
  "panel.commonDisorders": { en: "Common Disorders", as: "সাধাৰণ ব্যাধি" },
  "panel.ncertExamNotes": { en: "NCERT Exam Notes", as: "NCERT পৰীক্ষাৰ টোকা" },

  // ── Extra UI strings ─────────────────────────────────────────────────────────
  "ui.journey": { en: "Journey", as: "যাত্ৰা" },
  "ui.pause": { en: "Pause", as: "বিৰতি" },
  "ui.resume": { en: "Resume", as: "পুনৰাৰম্ভ" },
  "ui.breathMode": { en: "Breath Mode", as: "শ্বাস ধৰণ" },
  "ui.hideBreath": { en: "Hide Breath", as: "লুকুৱাওক" },
  "ui.watchJourney": { en: "▶ Watch Digestion Journey", as: "▶ পাচন যাত্ৰা চাওক" },
  "ui.traceBreathing": { en: "Trace Breathing Pathway", as: "শ্বাস পথ অনুসৰণ কৰক" },
  "ui.exploreAgain": { en: "Explore Again", as: "পুনৰ অন্বেষণ কৰক" },
  "ui.exploreCell": { en: "Explore Cell", as: "কোষ অন্বেষণ কৰক" },
  "ui.explorePlant": { en: "Explore Plant Cell", as: "উদ্ভিদ কোষ অন্বেষণ কৰক" },
  "ui.clickOrganelle": { en: "Click any organelle to learn", as: "যিকোনো কোষাঙ্গত ক্লিক কৰক" },
  "ui.takeQuiz": { en: "Take Quiz", as: "প্ৰশ্নোত্তৰ দিয়ক" },
  "ui.quizComplete.excl": { en: "Quiz Complete!", as: "প্ৰশ্নোত্তৰ সম্পূৰ্ণ!" },

  // ── Cell structure sub-labels ─────────────────────────────────────────────────
  "struct.chromatin": { en: "Chromatin", as: "ক্ৰমাটিন" },
  // De-duplicated 2026-05: organs/structures previously listed here are now
  // defined once in their canonical section above (Digestive / Respiratory /
  // Cell). Only NEW keys remain below.
  "struct.cecumColon": { en: "Cecum / Colon", as: "অন্তনালী / কোলন" },
  "struct.appendix": { en: "Appendix", as: "পৰিশিষ্ট" },
  "struct.rightBronchus": { en: "Right Bronchus", as: "সোঁ ব্ৰঙ্কাছ" },
  "struct.leftBronchus": { en: "Left Bronchus", as: "বাওঁ ব্ৰঙ্কাছ" },
  "struct.rightLung": { en: "Right Lung", as: "সোঁ হাঁওফাঁও" },
  "struct.leftLung": { en: "Left Lung", as: "বাওঁ হাঁওফাঁও" },
  "struct.tonoplast": { en: "Tonoplast", as: "টনোপ্লাষ্ট" },
  "struct.amyloplast": { en: "Amyloplast", as: "এমাইলোপ্লাষ্ট" },
  "struct.peroxisome": { en: "Peroxisome", as: "পেৰক্সিজম" },
  "struct.golgiDictyosome": { en: "Golgi/Dictyosome", as: "গ'লজি/ডিকটিওজম" },
  "struct.centrosome": { en: "Centrosome", as: "তাৰকাকেন্দ্ৰ" },
  "struct.cellSap": { en: "Cell Sap", as: "কোষৰস" },
  "struct.pleuralMembrane": { en: "Pleural Membrane", as: "ফুসফুসাৱৰণ" },
  "struct.ribCage": { en: "Rib Cage", as: "পঞ্জৰাস্থিখাঁচা" },
  "struct.pharynxDigest": { en: "Pharynx", as: "গলনালী" },

  // ── Dashboard text — cell modules ───────────────────────────────────────────
  "dash.animalCell.title": { en: "Animal Cell", as: "প্ৰাণী কোষ" },
  "dash.animalCell.desc": {
    en: "Explore a scientifically accurate 2D diagram of an animal cell. Click any organelle to reveal its structure, function, and NCERT exam notes.",
    as: "এটা বৈজ্ঞানিকভাৱে সঠিক প্ৰাণী কোষৰ চিত্ৰ অন্বেষণ কৰক। যিকোনো কোষাঙ্গত ক্লিক কৰক আৰু ইয়াৰ গঠন, কাৰ্য আৰু NCERT পৰীক্ষাৰ টোকা জানক।",
  },
  "dash.plantCell.title": { en: "Plant Cell", as: "উদ্ভিদ কোষ" },
  "dash.plantCell.desc": {
    en: "Explore a scientifically accurate hexagonal plant cell. Discover plant-exclusive organelles — chloroplasts, the central vacuole, cell wall, and plasmodesmata.",
    as: "ষড়ভুজাকৃতিৰ উদ্ভিদ কোষ অন্বেষণ কৰক। হৰিতকণা, কেন্দ্ৰীয় গহ্বৰ, কোষ প্ৰাচীৰ আৰু প্লাজমডেছমাটা আৱিষ্কাৰ কৰক।",
  },

  // ── Heart Dashboard ──────────────────────────────────────────────────────────
  "dash.heart.subtitle": {
    en: "Explore the double circulation system — pulmonary & systemic circuits, all 4 chambers, heart valves, major vessels, and NCERT-aligned exam content.",
    as: "দ্বিপৰিবহন তন্ত্ৰ অন্বেষণ কৰক — ফুসফুসীয় আৰু তন্ত্ৰগত চক্ৰ, ৪টা কক্ষ, হৃদয় কপাটিকা, প্ৰধান ৰক্তবাহী নলী আৰু NCERT পৰীক্ষাৰ বিষয়বস্তু।",
  },
  "dash.heart.chambers": { en: "4 Chambers", as: "৪টা কক্ষ" },
  "dash.heart.valves": { en: "4 Valves", as: "৪টা কপাটিকা" },
  "dash.heart.circuit": { en: "Double Circuit", as: "দ্বিপৰিবহন" },
  "dash.heart.bpm": { en: "~72 bpm", as: "~৭২ বিপিএম" },
  "dash.heart.valvesSub": { en: "Tricuspid, Mitral, Pulm., Aortic", as: "ত্ৰিৰূপ, দ্বিৰূপ, ফুসফুসীয়, মহাধমনী" },
  "dash.heart.circuitSub": { en: "Pulm. + Systemic", as: "ফুসফুসীয় + তন্ত্ৰগত" },
  "dash.heart.bpmSub": { en: "100,000 beats/day", as: "১,০০,০০০ স্পন্দন/দিন" },
  "dash.heart.chambersSub": { en: "RA, RV, LA, LV", as: "RA, RV, LA, LV" },
  "dash.heart.pulmonaryTitle": { en: "Pulmonary Circulation", as: "ফুসফুসীয় পৰিবহন" },
  "dash.heart.pulmonaryPath": { en: "RV → Pulmonary Artery → Lungs → Pulmonary Veins → LA", as: "RV → ফুসফুসীয় ধমনী → হাঁওফাঁও → ফুসফুসীয় শিৰা → LA" },
  "dash.heart.pulmonarySub": { en: "Lesser circulation · Oxygenates blood · ~25 mmHg", as: "লঘু পৰিবহন · তেজ অক্সিজেনযুক্ত কৰে · ~২৫ mmHg" },
  "dash.heart.systemicTitle": { en: "Systemic Circulation", as: "তন্ত্ৰগত পৰিবহন" },
  "dash.heart.systemicPath": { en: "LV → Aorta → Body → SVC/IVC → RA", as: "LV → মহাধমনী → দেহ → SVC/IVC → RA" },
  "dash.heart.systemicSub": { en: "Greater circulation · Delivers O₂ to body · ~120 mmHg", as: "বৃহৎ পৰিবহন · দেহলৈ O₂ যোগান · ~১২০ mmHg" },
  "dash.heart.exploreBtn": { en: "Explore the Heart →", as: "হৃদয় অন্বেষণ কৰক →" },

  // ── Blood type badges (heart info panel) ───────────────────────────────────
  "badge.oxygenated": { en: "Oxygenated Blood", as: "অক্সিজেনযুক্ত তেজ" },
  "badge.deoxygenated": { en: "Deoxygenated Blood", as: "অক্সিজেনবিহীন তেজ" },
  "badge.both": { en: "Both (exchange site)", as: "উভয় (বিনিময় স্থান)" },
  "badge.none": { en: "No blood flow", as: "তেজৰ প্ৰবাহ নাই" },
};

// ── Helper: get translated name for a known structure id ───────────────────
const STRUCT_ID_TO_KEY: Record<string, string> = {
  // ── Excretory system organs ──
  kidneys: "struct.kidneys",
  renalArtery: "struct.renalArtery",
  renalVein: "struct.renalVein",
  ureter: "struct.ureter",
  bladder: "struct.bladder",
  urethra: "struct.urethra",
  aorta: "struct.abdominalAorta",
  inferiorVenaCava: "struct.ivcExcretory",
  // ── Nephron ──
  afferentArteriole: "struct.afferentArteriole",
  glomerulus: "struct.glomerulus",
  bowmansCapsule: "struct.bowmansCapsule",
  proximalConvolutedTubule: "struct.pct",
  loopOfHenle: "struct.loopOfHenle",
  distalConvolutedTubule: "struct.dct",
  collectingDuct: "struct.collectingDuct",
  efferentArteriole: "struct.efferentArteriole",
  peritubularCapillaries: "struct.peritubularCaps",
  // ── Heart ──
  rightAtrium: "struct.rightAtrium",
  rightVentricle: "struct.rightVentricle",
  leftAtrium: "struct.leftAtrium",
  leftVentricle: "struct.leftVentricle",
  septum: "struct.septum",
  tricuspidValve: "struct.tricuspidValve",
  mitralValve: "struct.mitralValve",
  pulmonaryValve: "struct.pulmonaryValve",
  aorticValve: "struct.aorticValve",
  pulmonaryArtery: "struct.pulmonaryArtery",
  pulmonaryVein: "struct.pulmonaryVeins",
  superiorVenaCava: "struct.svc",
  inferiorVenaCavaHeart: "struct.ivc",
  lungs: "struct.lungsPulm",
  bodyCapillaries: "struct.bodyCapillaries",
  // ── Animal/Plant Cell organelles ──
  membrane: "struct.cellMembrane",
  cytoplasm: "struct.cytoplasm",
  nucleus: "struct.nucleus",
  nucleolus: "struct.nucleolus",
  chromatin: "struct.chromatin",
  roughER: "struct.roughER",
  smoothER: "struct.smoothER",
  golgi: "struct.golgi",
  mitochondria: "struct.mitochondria",
  lysosome: "struct.lysosome",
  centriole: "struct.centrosome",
  vacuole: "struct.vacuole",
  ribosome: "struct.ribosome",
  cellWall: "struct.cellWall",
  chloroplast: "struct.chloroplast",
  amyloplast: "struct.amyloplast",
  peroxisome: "struct.peroxisome",
  // ── Digestive system ──
  mouth: "struct.oralCavity",
  salivary: "struct.salivaryGlands",
  pharynx: "struct.pharynxDigest",
  esophagus: "struct.esophagus",
  stomach: "struct.stomach",
  smallIntestine: "struct.smallIntestine",
  largeIntestine: "struct.largeIntestine",
  rectum: "struct.rectum",
  anus: "struct.anus",
  liver: "struct.liver",
  gallbladder: "struct.gallbladder",
  pancreas: "struct.pancreas",
  // ── Respiratory system ──
  nasal: "struct.nasalCavity",
  larynx: "struct.larynx",
  trachea: "struct.trachea",
  bronchi: "struct.bronchi",
  bronchioles: "struct.bronchioles",
  alveoli: "struct.alveoli",
  diaphragm: "struct.diaphragm",
  pleura: "struct.pleuralMembrane",
  ribs: "struct.ribCage",
};

export function getStructureNameKey(structureId: string): string {
  return STRUCT_ID_TO_KEY[structureId] ?? structureId;
}

// ── Phase 1 additions — Dashboard landing strings ─────────────────────────────
// These are static UI strings shown on each simulation's landing card
// (the "Start Exploration / Take Quiz" screen before entering the sim).
Object.assign(TRANSLATIONS, {
  // Lab-pill labels
  "pill.biologyLab":             { en: "Biology Virtual Lab",   as: "জীৱ বিজ্ঞান গৱেষণাগাৰ" },
  // CTA buttons
  "btn.startExploration":        { en: "Start Exploration",     as: "অন্বেষণ আৰম্ভ কৰক" },
  "btn.takeQuiz":                { en: "Take Quiz",             as: "প্ৰশ্নোত্তৰ দিয়ক" },
  // Generic feature badges (used by multiple modules)
  "badge.liveJourney":           { en: "Live Journey",          as: "জীৱন্ত যাত্ৰা" },
  "badge.ncertNotes":            { en: "NCERT Notes",           as: "NCERT টোকা" },
  "badge.organsCount":           { en: "{n} Organs",            as: "{n}টা অংগ" },
  "badge.mcqCount":              { en: "{n} MCQs",              as: "{n}টা MCQ" },
  "badge.structuresCount":       { en: "{n} Structures",        as: "{n}টা গঠন" },
  "badge.organellesCount":       { en: "{n} Organelles",        as: "{n}টা কোষাঙ্গ" },
  // Digestive system Dashboard
  "dash.digestive.title":        { en: "Human Digestive System",
                                   as: "মানৱ পাচন তন্ত্ৰ" },
  "dash.digestive.desc":         { en: "Explore a fully interactive, anatomically accurate digestive system. Watch food travel from mouth to anus, understand each organ's role, and master NCERT exam questions.",
                                   as: "এটা সম্পূৰ্ণ ক্লিকযোগ্য, শৰীৰ-গঠনগতভাৱে সঠিক পাচন তন্ত্ৰ অন্বেষণ কৰক। মুখৰ পৰা পায়ুলৈ খাদ্যৰ যাত্ৰা চাওক, প্ৰতিটো অংগৰ কাৰ্য বুজি লওক, আৰু NCERT পৰীক্ষাৰ প্ৰশ্নবোৰ আয়ত্ত কৰক।" },
  // Respiratory system Dashboard
  "dash.respiratory.title":      { en: "Human Respiratory System",
                                   as: "মানৱ শ্বসন তন্ত্ৰ" },
  "dash.respiratory.desc":       { en: "Explore the human respiratory system with live animations. Watch the breathing cycle, O₂/CO₂ exchange in alveoli, and the journey of air through 12 organs.",
                                   as: "জীৱন্ত এনিমেশ্যনৰ সৈতে মানৱ শ্বসন তন্ত্ৰ অন্বেষণ কৰক। শ্বাস-প্ৰশ্বাসৰ চক্ৰ, বায়ুকোষত O₂/CO₂ বিনিময়, আৰু ১২টা অংগৰ মাজেৰে বায়ুৰ যাত্ৰা চাওক।" },
  // Heart Dashboard — dash.heart.title already defined at line 117; only add desc
  "dash.heart.desc":             { en: "Explore the human heart and the double circulation system. See blood flow through four chambers, four valves, and both pulmonary and systemic circuits.",
                                   as: "মানৱ হৃদপিণ্ড আৰু দ্বৈত পৰিবহন তন্ত্ৰ অন্বেষণ কৰক। চাৰিটা প্ৰকোষ্ঠ, চাৰিটা কপাটিকা, আৰু ফুসফুসীয় তথা তন্ত্ৰগত পৰিবহনৰ মাজেৰে তেজৰ প্ৰবাহ চাওক।" },
  // Excretory Dashboard (title/subtitle keys already exist)
  "dash.excretory.desc":         { en: "Explore the human excretory system and the nephron. Watch blood filtration, urine formation, and the role of ADH and Aldosterone hormones.",
                                   as: "মানৱ বৰ্জ্যনিষ্কাষণ তন্ত্ৰ আৰু নেফ্ৰন অন্বেষণ কৰক। তেজ ফিল্টাৰিং, মূত্ৰ গঠন, আৰু ADH তথা এলডোষ্টেৰন হৰমোনৰ ভূমিকা চাওক।" },
  // Animal cell + Plant cell descriptions already exist as dash.animalCell.desc / dash.plantCell.desc

  // Per-module Quiz titles (excretory already exists separately)
  "quiz.title.digestive":        { en: "Digestive System Quiz",       as: "পাচন তন্ত্ৰ প্ৰশ্নোত্তৰ" },
  "quiz.title.respiratory":      { en: "Respiratory System Quiz",     as: "শ্বসন তন্ত্ৰ প্ৰশ্নোত্তৰ" },
  "quiz.title.heart":            { en: "Heart & Circulation Quiz",    as: "হৃদপিণ্ড আৰু পৰিবহন প্ৰশ্নোত্তৰ" },
  "quiz.title.animalCell":       { en: "Animal Cell Quiz",            as: "প্ৰাণী কোষ প্ৰশ্নোত্তৰ" },
  "quiz.title.plantCell":        { en: "Plant Cell Quiz",             as: "উদ্ভিদ কোষ প্ৰশ্নোত্তৰ" },
  // Quiz UI bits
  "quiz.score":                  { en: "Score",                       as: "নম্বৰ" },
  "quiz.questionPrefix":         { en: "Q",                           as: "প্ৰ" },
  "ui.tryAgain":                 { en: "Try again",                   as: "পুনৰ চেষ্টা কৰক" },
  "ui.incorrect":                { en: "Incorrect",                   as: "ভুল" },
});
