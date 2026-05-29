import type { BilingualField } from "@/lib/i18n";

/**
 * Excretory system data — bilingual (English + Assamese).
 * Source: NCERT Class IX/X Biology Assamese edition + Vigyan Bharati glossary.
 * NCERT-preferred terms: বৃক্ক (kidney), নেফ্ৰন (nephron), মূত্ৰ (urine),
 * মূত্ৰনালী (ureter), মূত্ৰাশয় (urinary bladder), পৰিস্ৰাৱণ (filtration).
 */
export interface StructureInfo {
  id: string;
  name: BilingualField<string>;
  color: string;
  glowColor: string;
  category: 'organ' | 'nephron';
  role: BilingualField<string>;
  description: BilingualField<string>;
  functions: BilingualField<string[]>;
  keyFacts: BilingualField<string[]>;
  examNotes: BilingualField<string[]>;
  funFact: BilingualField<string>;
  disorders: BilingualField<string>;
  ncertNote: BilingualField<string>;
}

export interface JourneyStep {
  x: number; y: number; structureId: string; view: 'system' | 'nephron';
  stage: BilingualField<string>;
  shortNote: BilingualField<string>;
}

export interface QuizQ {
  q: BilingualField<string>;
  opts: BilingualField<string[]>;
  ans: number;
  explanation: BilingualField<string>;
}

export const STRUCTURES: Record<string, StructureInfo> = {
  kidneys: {
    id: 'kidneys', color: '#9b3060', glowColor: '#c05080', category: 'organ',
    name: { en: 'Kidneys', as: 'বৃক্ক' },
    role: { en: 'Primary excretory organs — filter blood and produce urine',
            as: 'মুখ্য বৰ্জ্যনিষ্কাষণ অংগ — তেজ ফিল্টাৰ কৰে আৰু মূত্ৰ উৎপন্ন কৰে' },
    description: {
      en: 'Paired bean-shaped organs in the retroperitoneal space. Each kidney (~150g, 10-12 cm) contains ~1 million nephrons that filter blood and produce urine, regulating fluid balance, electrolytes, and pH.',
      as: 'ৰেট্ৰোপেৰিটোনিয়েল স্থানত থকা যোৰা শিম-আকৃতিৰ অংগ। প্ৰতিটো বৃক্ক (~১৫০ গ্ৰাম, ১০-১২ চে.মি.)-ত ~১০ লাখ নেফ্ৰন থাকে যিয়ে তেজ ফিল্টাৰ কৰে আৰু মূত্ৰ উৎপন্ন কৰে, তৰল ভাৰসাম্য, ইলেক্ট্ৰলাইট আৰু pH নিয়ন্ত্ৰণ কৰে।',
    },
    functions: {
      en: ['Filter ~180 L blood/day; produce ~1.5 L urine', 'Regulate blood pressure via renin secretion', 'Maintain acid-base and electrolyte balance', 'Produce erythropoietin (RBC production) and activate Vitamin D'],
      as: ['দৈনিক ~১৮০ লি. তেজ ফিল্টাৰ; ~১.৫ লি. মূত্ৰ উৎপন্ন', 'ৰেনিন ক্ষৰণৰ যোগেদি ৰক্তচাপ নিয়ন্ত্ৰণ', 'এচিড-ক্ষাৰ আৰু ইলেক্ট্ৰলাইট ভাৰসাম্য বজাই ৰাখে', 'এৰিথ্ৰ‘প’য়েটিন উৎপন্ন কৰে (RBC উৎপাদন) আৰু ভিটামিন D সক্ৰিয় কৰে'],
    },
    keyFacts: {
      en: ['Located at L1-L3 (retroperitoneal); right kidney slightly lower (liver)', 'Receives 20-25% of cardiac output (~1200 mL/min)', 'Cortex: glomeruli, PCT, DCT | Medulla: Loop of Henle, collecting ducts', 'Right kidney lower; left kidney has longer renal vein'],
      as: ['L1-L3-ত অৱস্থিত (ৰেট্ৰোপেৰিটোনিয়েল); সোঁ বৃক্ক অলপ তলত (যকৃৎ)', 'কাৰ্ডিয়াক আউটপুটৰ ২০-২৫% পায় (~১২০০ মি.লি./মিনিট)', 'কৰ্টেক্স: গ্লমেৰুলাছ, PCT, DCT | মেডুলা: হেনলিৰ লুপ, সংগ্ৰাহী নলিকা', 'সোঁ বৃক্ক তলত; বাওঁ বৃক্কৰ বৃক্ক শিৰা দীঘল'],
    },
    examNotes: {
      en: ['Kidneys = principal excretory organs in humans (NCERT)', 'Each kidney has ~1 million nephrons', 'GFR = 125 mL/min → 180 L/day filtered → only ~1.5 L urine formed', 'Nephron processes: Filtration → Reabsorption → Secretion → Excretion'],
      as: ['বৃক্ক = মানুহৰ মুখ্য বৰ্জ্যনিষ্কাষণ অংগ (NCERT)', 'প্ৰতিটো বৃক্কত ~১০ লাখ নেফ্ৰন আছে', 'GFR = ১২৫ মি.লি./মিনিট → দৈনিক ১৮০ লি. ফিল্টাৰ → কেৱল ~১.৫ লি. মূত্ৰ গঠিত', 'নেফ্ৰন প্ৰক্ৰিয়া: পৰিস্ৰাৱণ → পুনঃ অৱশোষণ → ক্ষৰণ → বৰ্জন'],
    },
    funFact: {
      en: 'Your kidneys filter your entire blood volume ~40 times per day! Of the 180 L filtered, 99% is reabsorbed and only 1.5 L becomes urine.',
      as: 'আপোনাৰ বৃক্কই আপোনাৰ গোটেই তেজৰ আয়তন দৈনিক ~৪০ বাৰ ফিল্টাৰ কৰে! ১৮০ লি. ফিল্টাৰৰ পৰা ৯৯% পুনৰ অৱশোষিত হয় আৰু কেৱল ১.৫ লি. মূত্ৰ হয়।',
    },
    disorders: {
      en: 'Kidney stones, nephritis, CKD, acute kidney injury, polycystic kidney disease',
      as: 'বৃক্ক শিল, নেফ্ৰাইটিছ, CKD, একিউট কিডনি ইনজুৰি, পলিচিষ্টিক কিডনি ৰোগ',
    },
    ncertNote: {
      en: 'NCERT: Kidneys regulate body fluid composition, acid-base balance, and excrete metabolic wastes. Functional unit = nephron.',
      as: 'NCERT: বৃক্কই শৰীৰৰ তৰলৰ গঠন, এচিড-ক্ষাৰ ভাৰসাম্য নিয়ন্ত্ৰণ কৰে আৰু বিপাকীয় বৰ্জ্য নিষ্কাষণ কৰে। কাৰ্যকৰী একক = নেফ্ৰন।',
    },
  },
  renalArtery: {
    id: 'renalArtery', color: '#dc2626', glowColor: '#ef4444', category: 'organ',
    name: { en: 'Renal Artery', as: 'বৃক্ক ধমনী' },
    role: { en: 'Delivers oxygenated, waste-laden blood to kidneys for filtration',
            as: 'ফিল্টাৰিংৰ বাবে অক্সিজেনযুক্ত, বৰ্জ্য ভৰা তেজ বৃক্কলৈ কঢ়িয়াই নিয়ে' },
    description: {
      en: 'Paired branches of the abdominal aorta delivering 20-25% of cardiac output (~1200 mL/min combined) to the kidneys. Blood in the renal artery is rich in metabolic wastes (urea, creatinine) that need filtration.',
      as: 'উদৰীয় মহাধমনীৰ যোৰা শাখা যিয়ে কাৰ্ডিয়াক আউটপুটৰ ২০-২৫% (~১২০০ মি.লি./মিনিট মুঠ) বৃক্কলৈ পঠিয়ায়। বৃক্ক ধমনীৰ তেজত বিপাকীয় বৰ্জ্য (ইউৰিয়া, ক্ৰিয়েটিনিন) সমৃদ্ধ থাকে যিবোৰক ফিল্টাৰ কৰিব লাগে।',
    },
    functions: {
      en: ['Delivers oxygenated blood to kidneys', 'Branches into afferent arterioles → glomerular capillaries', 'Right renal artery is longer (passes behind IVC)', 'High-pressure delivery ensures adequate GFR'],
      as: ['বৃক্কলৈ অক্সিজেনযুক্ত তেজ পঠিয়ায়', 'অভিকেন্দ্ৰিক ধমনিকা → গ্লমেৰুলাৰ কেপিলেৰীত শাখায়িত হয়', 'সোঁ বৃক্ক ধমনী দীঘল (IVC-ৰ পিছেদি যায়)', 'উচ্চ চাপৰ পঠিওৱাই পৰ্যাপ্ত GFR নিশ্চিত কৰে'],
    },
    keyFacts: {
      en: ['20-25% of cardiac output to kidneys (highest per gram of any organ)', 'Glomerular capillary pressure ~60 mmHg (high, for filtration)', 'Right renal artery longer; left is shorter', 'Renal artery stenosis → renovascular hypertension (↑ renin)'],
      as: ['কাৰ্ডিয়াক আউটপুটৰ ২০-২৫% বৃক্কলৈ (যিকোনো অংগৰ গ্ৰাম প্ৰতি সৰ্বোচ্চ)', 'গ্লমেৰুলাৰ কেপিলেৰী চাপ ~৬০ mmHg (উচ্চ, ফিল্টাৰিংৰ বাবে)', 'সোঁ বৃক্ক ধমনী দীঘল; বাওঁ চুটি', 'বৃক্ক ধমনী ষ্টেনচিছ → ৰিনোভাছকুলাৰ উচ্চ ৰক্তচাপ (↑ ৰেনিন)'],
    },
    examNotes: {
      en: ['Renal artery = standard artery, carries oxygenated blood TO kidney', 'High renal blood flow (1200 mL/min) ensures efficient filtration', 'Renal artery → afferent arterioles → glomerular capillaries (filtration begins)', 'Stenosis → ↓ renal perfusion → ↑ renin → ↑ angiotensin II → ↑ BP'],
      as: ['বৃক্ক ধমনী = মানক ধমনী, বৃক্কলৈ অক্সিজেনযুক্ত তেজ কঢ়িয়ায়', 'উচ্চ বৃক্ক তেজ প্ৰবাহ (১২০০ মি.লি./মিনিট)-এ কাৰ্যক্ষম ফিল্টাৰিং নিশ্চিত কৰে', 'বৃক্ক ধমনী → অভিকেন্দ্ৰিক ধমনিকা → গ্লমেৰুলাৰ কেপিলেৰী (ফিল্টাৰিং আৰম্ভ)', 'ষ্টেনচিছ → ↓ বৃক্ক পাৰ্ফিউজন → ↑ ৰেনিন → ↑ এনজিয়‘টেনছিন II → ↑ BP'],
    },
    funFact: {
      en: 'Despite kidneys being just 0.5% of body weight, they receive 20-25% of the heart\'s output — the highest blood flow per gram of any organ!',
      as: 'বৃক্ক শৰীৰৰ ওজনৰ মাত্ৰ ০.৫% হোৱাৰ পিছতো, ই হৃদপিণ্ডৰ আউটপুটৰ ২০-২৫% পায় — যিকোনো অংগৰ গ্ৰাম প্ৰতি সৰ্বোচ্চ তেজ প্ৰবাহ!',
    },
    disorders: {
      en: 'Renal artery stenosis, renovascular hypertension, renal artery aneurysm',
      as: 'বৃক্ক ধমনী ষ্টেনচিছ, ৰিনোভাছকুলাৰ উচ্চ ৰক্তচাপ, বৃক্ক ধমনী এন্যুৰিজম',
    },
    ncertNote: {
      en: 'Renal artery brings blood (with wastes) to kidneys for filtration. It is a normal artery carrying oxygenated blood.',
      as: 'বৃক্ক ধমনীয়ে ফিল্টাৰিংৰ বাবে বৃক্কলৈ তেজ (বৰ্জ্য সহ) আনে। ই অক্সিজেনযুক্ত তেজ কঢ়িয়াই নিয়া স্বাভাৱিক ধমনী।',
    },
  },
  renalVein: {
    id: 'renalVein', color: '#2563eb', glowColor: '#3b82f6', category: 'organ',
    name: { en: 'Renal Vein', as: 'বৃক্ক শিৰা' },
    role: { en: 'Returns purified, filtered blood from kidneys to IVC',
            as: 'বৃক্কৰ পৰা পৰিশোধিত, ফিল্টাৰ কৰা তেজ IVC-লৈ ঘুৰাই দিয়ে' },
    description: {
      en: 'The renal veins drain filtered (purified) blood from the kidneys into the inferior vena cava. After nephron filtration and reabsorption, the blood leaving has reduced urea/creatinine — wastes have been removed.',
      as: 'বৃক্ক শিৰাই বৃক্কৰ পৰা ফিল্টাৰ কৰা (পৰিশোধিত) তেজ অধঃ মহাশিৰালৈ নিকাশ কৰে। নেফ্ৰন ফিল্টাৰিং আৰু পুনঃ অৱশোষণৰ পিছত, ওলোৱা তেজৰ ইউৰিয়া/ক্ৰিয়েটিনিন কম হয় — বৰ্জ্য আঁতৰোৱা হয়।',
    },
    functions: {
      en: ['Returns purified blood from kidneys to IVC → right heart', 'Left renal vein crosses aorta anteriorly (longer than right)', 'Left renal vein also receives left gonadal and adrenal veins', 'Carries blood with corrected composition after filtration'],
      as: ['বৃক্কৰ পৰা পৰিশোধিত তেজ IVC → সোঁ হৃদপিণ্ডলৈ ঘুৰাই দিয়ে', 'বাওঁ বৃক্ক শিৰাই মহাধমনীক আগেদি অতিক্ৰম কৰে (সোঁতকৈ দীঘল)', 'বাওঁ বৃক্ক শিৰাই বাওঁ গনাডেল আৰু এড্ৰিনেল শিৰাও পায়', 'ফিল্টাৰিংৰ পিছত শুদ্ধ কৰা গঠনৰ তেজ কঢ়িয়ায়'],
    },
    keyFacts: {
      en: ['Left renal vein is longer (clinically important for transplant)', 'Left renal vein crosses anterior to aorta', 'Renal venous blood has lower urea than arterial blood', 'Drains into IVC → right atrium → pulmonary circulation'],
      as: ['বাওঁ বৃক্ক শিৰা দীঘল (ট্ৰান্সপ্লাণ্টৰ বাবে চিকিৎসাগতভাৱে গুৰুত্বপূৰ্ণ)', 'বাওঁ বৃক্ক শিৰা মহাধমনীৰ আগেদি অতিক্ৰম কৰে', 'বৃক্ক শিৰাজনিত তেজৰ ইউৰিয়া ধমনীয় তেজতকৈ কম', 'IVC → সোঁ অলিন্দ → ফুসফুসীয় পৰিবহনলৈ নিকাশ কৰে'],
    },
    examNotes: {
      en: ['Renal vein carries purified blood FROM kidneys to IVC', 'Left renal vein longer → preferred for live kidney donation (longer vessel)', 'Purified blood: lower urea/creatinine than renal arterial blood', 'Nutcracker syndrome: left renal vein compressed between aorta and SMA'],
      as: ['বৃক্ক শিৰাই বৃক্কৰ পৰা IVC-লৈ পৰিশোধিত তেজ কঢ়িয়ায়', 'বাওঁ বৃক্ক শিৰা দীঘল → জীৱিত বৃক্ক দানৰ বাবে পছন্দনীয় (দীঘল পাত্ৰ)', 'পৰিশোধিত তেজ: বৃক্ক ধমনীয় তেজতকৈ কম ইউৰিয়া/ক্ৰিয়েটিনিন', 'নাটক্ৰেকাৰ ছিনড্ৰম: বাওঁ বৃক্ক শিৰা মহাধমনী আৰু SMA-ৰ মাজত চেপি ধৰা'],
    },
    funFact: {
      en: 'Blood leaving the kidneys via the renal vein has had its urea content dramatically reduced — your kidneys selectively extract waste with remarkable molecular precision!',
      as: 'বৃক্ক শিৰাৰ যোগেদি বৃক্কৰ পৰা ওলোৱা তেজৰ ইউৰিয়া পৰিমাণ নাটকীয়ভাৱে কমে — আপোনাৰ বৃক্কই উল্লেখযোগ্য অণুক সঠিকতাৰে বাছনিকৈ বৰ্জ্য আঁতৰায়!',
    },
    disorders: {
      en: 'Renal vein thrombosis, nutcracker syndrome',
      as: 'বৃক্ক শিৰা থ্ৰম্বছিছ, নাটক্ৰেকাৰ ছিনড্ৰম',
    },
    ncertNote: {
      en: 'Renal vein carries purified blood away from kidneys to inferior vena cava.',
      as: 'বৃক্ক শিৰাই বৃক্কৰ পৰা পৰিশোধিত তেজ অধঃ মহাশিৰালৈ লৈ যায়।',
    },
  },
  ureter: {
    id: 'ureter', color: '#d97706', glowColor: '#f59e0b', category: 'organ',
    name: { en: 'Ureters', as: 'মূত্ৰনালী' },
    role: { en: 'Muscular tubes transporting urine from kidneys to bladder',
            as: 'বৃক্কৰ পৰা মূত্ৰাশয়লৈ মূত্ৰ পৰিবহন কৰা পেশীযুক্ত নলিকা' },
    description: {
      en: 'Paired muscular tubes (~25-30 cm) connecting renal pelvis to the urinary bladder. Peristaltic contractions (1-5 waves/min) propel urine downward even against gravity. Three anatomical narrowings are common sites for kidney stones.',
      as: 'যোৰা পেশীযুক্ত নলিকা (~২৫-৩০ চে.মি.) যিয়ে বৃক্ক পেলভিছক মূত্ৰাশয়ৰ সৈতে সংযোগ কৰে। ক্ৰম-সংকোচন (১-৫ তৰঙ্গ/মিনিট)-এ অভিকৰ্ষৰ বিৰুদ্ধেও মূত্ৰক তললৈ ঠেলি দিয়ে। তিনিটা শৰীৰ-গঠনগত সংকীৰ্ণতা বৃক্ক শিলৰ সাধাৰণ স্থান।',
    },
    functions: {
      en: ['Transport urine via peristaltic contractions (gravity-independent)', 'Enter bladder obliquely (prevents vesicoureteric reflux)', 'Three narrowings: PUJ, pelvic brim, VUJ — stones lodge here', 'Each ureter drains one kidney independently'],
      as: ['ক্ৰম-সংকোচনৰ যোগেদি মূত্ৰ পৰিবহন (অভিকৰ্ষ-নিৰপেক্ষ)', 'মূত্ৰাশয়ত তিৰ্যকভাৱে প্ৰৱেশ কৰে (ভেচিকোইউৰেটেৰিক ৰিফ্লাক্স ৰোধ কৰে)', 'তিনিটা সংকীৰ্ণতা: PUJ, পেলভিক ব্ৰিম, VUJ — শিল ইয়াত আটকা পৰে', 'প্ৰতিটো মূত্ৰনালীয়ে এটা বৃক্ক স্বাধীনভাৱে নিকাশ কৰে'],
    },
    keyFacts: {
      en: ['Length: 25-30 cm; diameter 2-8 mm', 'Three narrow sites: PUJ, pelvic brim crossing, VUJ', 'Crossed by gonadal vessels anteriorly ("water under the bridge")', 'Three layers: mucosa + muscularis + adventitia'],
      as: ['দৈৰ্ঘ্য: ২৫-৩০ চে.মি.; ব্যাস ২-৮ মি.মি.', 'তিনিটা সংকীৰ্ণ স্থান: PUJ, পেলভিক ব্ৰিম ক্ৰছিং, VUJ', 'আগেদি গনাডেল পাত্ৰে অতিক্ৰম কৰে ("জোঁপাৰ তলেদি পানী")', 'তিনিটা স্তৰ: মিউক‘ছা + মাছকুলাৰিছ + এডভেণ্টিচিয়া'],
    },
    examNotes: {
      en: ['Ureter carries urine from renal pelvis → urinary bladder', 'Peristalsis propels urine (works against gravity)', 'Three anatomical narrowings = where kidney stones get stuck', 'VUJ oblique entry prevents urine reflux back to kidneys'],
      as: ['মূত্ৰনালীয়ে বৃক্ক পেলভিছৰ পৰা → মূত্ৰাশয়লৈ মূত্ৰ কঢ়িয়ায়', 'ক্ৰম-সংকোচনে মূত্ৰক আগুৱাই দিয়ে (অভিকৰ্ষৰ বিৰুদ্ধে কাম কৰে)', 'তিনিটা শৰীৰ-গঠনগত সংকীৰ্ণতা = য’ত বৃক্ক শিল আটকা পৰে', 'VUJ তিৰ্যক প্ৰৱেশই মূত্ৰক বৃক্কলৈ উভতি যোৱা ৰোধ কৰে'],
    },
    funFact: {
      en: 'Even upside down, urine still flows from kidney to bladder! The muscular ureter generates peristaltic waves that pump urine regardless of body position.',
      as: 'উলটি থাকিলেও, মূত্ৰ এতিয়াও বৃক্কৰ পৰা মূত্ৰাশয়লৈ যায়! পেশীযুক্ত মূত্ৰনালীয়ে শৰীৰৰ অৱস্থান নিৰ্বিশেষে মূত্ৰ পাম্প কৰা ক্ৰম-সংকোচন তৰঙ্গ উৎপন্ন কৰে।',
    },
    disorders: {
      en: 'Ureteral stones, VUJ obstruction, vesicoureteric reflux (VUR)',
      as: 'মূত্ৰনালীৰ শিল, VUJ বাধা, ভেচিকোইউৰেটেৰিক ৰিফ্লাক্স (VUR)',
    },
    ncertNote: {
      en: 'Ureters transport urine by peristalsis from kidneys to urinary bladder.',
      as: 'মূত্ৰনালীয়ে ক্ৰম-সংকোচনৰ যোগেদি বৃক্কৰ পৰা মূত্ৰাশয়লৈ মূত্ৰ পৰিবহন কৰে।',
    },
  },
  bladder: {
    id: 'bladder', color: '#3b82f6', glowColor: '#60a5fa', category: 'organ',
    name: { en: 'Urinary Bladder', as: 'মূত্ৰাশয়' },
    role: { en: 'Stores urine (300-600 mL) until voluntary micturition',
            as: 'স্বেচ্ছামূলক মলত্যাগৰ আগলৈকে মূত্ৰ (৩০০-৬০০ মি.লি.) সংৰক্ষণ' },
    description: {
      en: 'A hollow muscular organ (detrusor muscle) that collects and stores urine from both ureters. Contracts during micturition (urination) to expel urine through the urethra. Has involuntary (internal) and voluntary (external) sphincters.',
      as: 'এক খালী পেশীযুক্ত অংগ (ডেট্ৰাছৰ পেশী) যিয়ে দুয়োটা মূত্ৰনালীৰ পৰা মূত্ৰ সংগ্ৰহ আৰু সংৰক্ষণ কৰে। মূত্ৰদ্বাৰৰ যোগেদি মূত্ৰ বাহিৰ কৰিবলৈ মূত্ৰত্যাগৰ সময়ত সংকোচিত হয়। অনিচ্ছাকৃত (অভ্যন্তৰীণ) আৰু স্বেচ্ছামূলক (বাহ্যিক) ছফিংটাৰ থাকে।',
    },
    functions: {
      en: ['Stores urine (normal capacity 300-600 mL)', 'Detrusor muscle contracts during micturition', 'Internal sphincter (involuntary) + External sphincter (voluntary)', 'Trigone: smooth triangular area between ureteral orifices and urethral opening'],
      as: ['মূত্ৰ সংৰক্ষণ কৰে (স্বাভাৱিক ধাৰণ ক্ষমতা ৩০০-৬০০ মি.লি.)', 'মূত্ৰত্যাগৰ সময়ত ডেট্ৰাছৰ পেশী সংকোচিত হয়', 'অভ্যন্তৰীণ ছফিংটাৰ (অনিচ্ছাকৃত) + বাহ্যিক ছফিংটাৰ (স্বেচ্ছামূলক)', 'ট্ৰাইগন: মূত্ৰনালী ছিদ্ৰ আৰু মূত্ৰদ্বাৰ মুখৰ মাজৰ মসৃণ ত্ৰিভুজ অঞ্চল'],
    },
    keyFacts: {
      en: ['Normal voiding volume: 300-600 mL; first urge at ~150 mL', 'Transitional epithelium (urothelium) — stretches as bladder fills', 'Trigone: no rugae, always smooth — infection-prone area', 'Micturition reflex: stretch receptors → parasympathetic → detrusor contracts'],
      as: ['স্বাভাৱিক ভয়ডিং আয়তন: ৩০০-৬০০ মি.লি.; প্ৰথম ইচ্ছা ~১৫০ মি.লি.-ত', 'ট্ৰানজিচনেল এপিথেলিয়াম (ইউৰোথেলিয়াম) — মূত্ৰাশয় ভৰিলে প্ৰসাৰিত হয়', 'ট্ৰাইগন: ৰুগে নাই, সদায় মসৃণ — সংক্ৰমণপ্ৰৱণ অঞ্চল', 'মূত্ৰত্যাগ প্ৰতিৱৰ্ত: ষ্ট্ৰেচ ৰিচেপ্টৰ → পেৰাচিম্পেথেটিক → ডেট্ৰাছৰ সংকোচিত হয়'],
    },
    examNotes: {
      en: ['Bladder stores urine temporarily; detrusor contraction = urination', 'Internal sphincter: smooth, involuntary | External: skeletal, voluntary', 'First urge to urinate at ~150-200 mL (NCERT relevant)', 'Trigone = triangular area between 2 ureteric orifices + internal urethral orifice'],
      as: ['মূত্ৰাশয়ই অস্থায়ীভাৱে মূত্ৰ সংৰক্ষণ কৰে; ডেট্ৰাছৰ সংকোচন = মূত্ৰত্যাগ', 'অভ্যন্তৰীণ ছফিংটাৰ: মসৃণ, অনিচ্ছাকৃত | বাহ্যিক: কঙ্কাল, স্বেচ্ছামূলক', 'মূত্ৰত্যাগৰ প্ৰথম ইচ্ছা ~১৫০-২০০ মি.লি.-ত (NCERT প্ৰাসংগিক)', 'ট্ৰাইগন = ২টা মূত্ৰনালী ছিদ্ৰ + অভ্যন্তৰীণ মূত্ৰদ্বাৰ ছিদ্ৰৰ মাজৰ ত্ৰিভুজ অঞ্চল'],
    },
    funFact: {
      en: 'The bladder\'s transitional epithelium can stretch to 5× its resting size — cells that are rounded when empty flatten dramatically as the bladder fills!',
      as: 'মূত্ৰাশয়ৰ ট্ৰানজিচনেল এপিথেলিয়াম জিৰণিত আকাৰৰ ৫× লৈ প্ৰসাৰিত হ’ব পাৰে — খালী থাকিলে গোলাকাৰ থকা কোষবোৰ মূত্ৰাশয় ভৰি অহাৰ লগে লগে নাটকীয়ভাৱে চেপেটা হৈ যায়!',
    },
    disorders: {
      en: 'UTI, overactive bladder, bladder stones, bladder cancer, incontinence',
      as: 'UTI, অভাৰএক্টিভ ব্লাডাৰ, মূত্ৰাশয়ৰ শিল, মূত্ৰাশয়ৰ কৰ্কট ৰোগ, ইনকণ্টিনেন্স',
    },
    ncertNote: {
      en: 'Urinary bladder stores urine; micturition empties it via urethral sphincter control.',
      as: 'মূত্ৰাশয়ই মূত্ৰ সংৰক্ষণ কৰে; মূত্ৰদ্বাৰ ছফিংটাৰ নিয়ন্ত্ৰণৰ যোগেদি মূত্ৰত্যাগে ইয়াক খালী কৰে।',
    },
  },
  urethra: {
    id: 'urethra', color: '#d97706', glowColor: '#f59e0b', category: 'organ',
    name: { en: 'Urethra', as: 'মূত্ৰদ্বাৰ' },
    role: { en: 'Terminal duct expelling urine from bladder to outside',
            as: 'মূত্ৰাশয়ৰ পৰা বাহিৰলৈ মূত্ৰ বাহিৰ কৰা অন্তিম নলিকা' },
    description: {
      en: 'The terminal duct of the urinary system. Significantly different between sexes: female (3-4 cm) and male (18-20 cm, also carries semen). Voluntary external sphincter allows conscious control of urination.',
      as: 'মূত্ৰ ব্যৱস্থাৰ অন্তিম নলিকা। লিংগৰ মাজত উল্লেখযোগ্যভাৱে পৃথক: মহিলা (৩-৪ চে.মি.) আৰু পুৰুষ (১৮-২০ চে.মি., শুক্ৰাণুও কঢ়িয়ায়)। স্বেচ্ছামূলক বাহ্যিক ছফিংটাৰে মূত্ৰত্যাগৰ সচেতন নিয়ন্ত্ৰণৰ অনুমতি দিয়ে।',
    },
    functions: {
      en: ['Conveys urine from bladder to exterior', 'External urethral sphincter: voluntary control', 'In males: also serves as seminal duct (carries semen during ejaculation)', 'Internal and external sphincters coordinate micturition'],
      as: ['মূত্ৰাশয়ৰ পৰা বাহিৰলৈ মূত্ৰ পঠিয়ায়', 'বাহ্যিক মূত্ৰদ্বাৰ ছফিংটাৰ: স্বেচ্ছামূলক নিয়ন্ত্ৰণ', 'পুৰুষৰ ক্ষেত্ৰত: শুক্ৰনলিকা ৰূপেও কাম কৰে (স্খলনৰ সময়ত শুক্ৰাণু কঢ়িয়ায়)', 'অভ্যন্তৰীণ আৰু বাহ্যিক ছফিংটাৰে মূত্ৰত্যাগ সমন্বয় কৰে'],
    },
    keyFacts: {
      en: ['Female urethra: 3-4 cm | Male urethra: 18-20 cm (3 parts)', 'Female shorter → 8-10× higher risk of UTI', 'External sphincter = skeletal muscle (voluntary, learned during toilet training)', 'Male urethra: prostatic → membranous → spongy/penile portions'],
      as: ['মহিলা মূত্ৰদ্বাৰ: ৩-৪ চে.মি. | পুৰুষ মূত্ৰদ্বাৰ: ১৮-২০ চে.মি. (৩ অংশ)', 'মহিলাৰ চুটি → UTI-ৰ আশংকা ৮-১০× বেছি', 'বাহ্যিক ছফিংটাৰ = কঙ্কাল পেশী (স্বেচ্ছামূলক, টয়লেট প্ৰশিক্ষণৰ সময়ত শিকা)', 'পুৰুষ মূত্ৰদ্বাৰ: প্ৰষ্টেটিক → মেমব্ৰেনাছ → স্পন্‌জী/পেনাইল অংশ'],
    },
    examNotes: {
      en: ['Urethra: final passage for urine exit', 'Female shorter (3-4 cm) → higher UTI risk', 'Male longer (18-20 cm) + carries semen in males', 'External urethral sphincter = voluntary control (somatic innervation)'],
      as: ['মূত্ৰদ্বাৰ: মূত্ৰ ওলোৱাৰ অন্তিম পথ', 'মহিলা চুটি (৩-৪ চে.মি.) → অধিক UTI আশংকা', 'পুৰুষ দীঘল (১৮-২০ চে.মি.) + পুৰুষৰ ক্ষেত্ৰত শুক্ৰাণু কঢ়িয়ায়', 'বাহ্যিক মূত্ৰদ্বাৰ ছফিংটাৰ = স্বেচ্ছামূলক নিয়ন্ত্ৰণ (চ‘মেটিক ইনাৰভেচন)'],
    },
    funFact: {
      en: 'Females are 8-10× more likely to get UTIs than males — the shorter female urethra (3-4 cm vs 18-20 cm) makes it much easier for bacteria to ascend to the bladder!',
      as: 'মহিলাৰ পুৰুষতকৈ UTI হোৱাৰ সম্ভাৱনা ৮-১০× বেছি — চুটি মহিলা মূত্ৰদ্বাৰে (৩-৪ চে.মি. বনাম ১৮-২০ চে.মি.) বেক্টেৰিয়াক মূত্ৰাশয়লৈ উঠা বহু সহজ কৰে!',
    },
    disorders: {
      en: 'Urethritis, urethral stricture, UTI',
      as: 'মূত্ৰদ্বাৰ প্ৰদাহ, মূত্ৰদ্বাৰ ষ্ট্ৰিকচাৰ, UTI',
    },
    ncertNote: {
      en: 'Urethra = final exit passage for urine from urinary bladder to outside.',
      as: 'মূত্ৰদ্বাৰ = মূত্ৰাশয়ৰ পৰা বাহিৰলৈ মূত্ৰ ওলোৱাৰ অন্তিম পথ।',
    },
  },
  aorta: {
    id: 'aorta', color: '#dc2626', glowColor: '#ef4444', category: 'organ',
    name: { en: 'Abdominal Aorta', as: 'উদৰীয় মহাধমনী' },
    role: { en: 'Blood supply source — gives renal arteries at L1-L2 level',
            as: 'তেজ যোগানৰ উৎস — L1-L2 স্তৰত বৃক্ক ধমনী দিয়ে' },
    description: {
      en: 'The abdominal aorta runs along the vertebral column giving rise to paired renal arteries at L1-L2. These renal branches supply the kidneys with oxygenated blood for filtration, representing 20-25% of cardiac output.',
      as: 'উদৰীয় মহাধমনীয়ে কশেৰুকা স্তম্ভৰ কাষে চলি L1-L2-ত যোৰা বৃক্ক ধমনী দিয়ে। এই বৃক্ক শাখাবোৰে ফিল্টাৰিংৰ বাবে বৃক্কলৈ অক্সিজেনযুক্ত তেজ যোগান ধৰে, যি কাৰ্ডিয়াক আউটপুটৰ ২০-২৫%।',
    },
    functions: {
      en: ['Gives off renal arteries at L1-L2 level', 'Delivers systemic oxygenated blood to abdominal organs', 'Also supplies celiac, SMA, IMA, gonadal arteries', 'Bifurcates into common iliac arteries at L4'],
      as: ['L1-L2 স্তৰত বৃক্ক ধমনী দিয়ে', 'উদৰীয় অংগলৈ তন্ত্ৰগত অক্সিজেনযুক্ত তেজ পঠিয়ায়', 'চেলিয়েক, SMA, IMA, গনাডেল ধমনীও যোগায়', 'L4-ত সাধাৰণ ইলিয়াক ধমনীত দ্বিভাজিত হয়'],
    },
    keyFacts: {
      en: ['Runs slightly left of midline anterior to vertebrae', 'Renal arteries arise at L1-L2 (level of renal hilum)', 'Right renal artery passes behind IVC (longer)', 'Blood in aorta is oxygenated (high pressure ~120 mmHg)'],
      as: ['মাজৰ ৰেখাৰ অলপ বাওঁফালে কশেৰুকাৰ আগেদি চলে', 'বৃক্ক ধমনী L1-L2-ত উৎপন্ন হয় (বৃক্ক হাইলামৰ স্তৰ)', 'সোঁ বৃক্ক ধমনী IVC-ৰ পিছেদি যায় (দীঘল)', 'মহাধমনীৰ তেজ অক্সিজেনযুক্ত (উচ্চ চাপ ~১২০ mmHg)'],
    },
    examNotes: {
      en: ['Aorta → renal arteries → afferent arterioles → glomerular capillaries (filtration)', '20-25% cardiac output to kidneys via aorta → renal arteries', 'Aortic aneurysm (AAA) common below renal arteries (infrarenal AAA)'],
      as: ['মহাধমনী → বৃক্ক ধমনী → অভিকেন্দ্ৰিক ধমনিকা → গ্লমেৰুলাৰ কেপিলেৰী (ফিল্টাৰিং)', 'মহাধমনী → বৃক্ক ধমনীৰ যোগেদি কাৰ্ডিয়াক আউটপুটৰ ২০-২৫% বৃক্কলৈ', 'মহাধমনী এন্যুৰিজম (AAA) বৃক্ক ধমনীৰ তলত সাধাৰণ (ইনফ্ৰাৰেনাল AAA)'],
    },
    funFact: {
      en: 'The kidneys receive blood from the aorta at almost the same pressure as the heart generates — this high pressure is essential to drive the glomerular filtration process.',
      as: 'বৃক্কই মহাধমনীৰ পৰা হৃদপিণ্ডে উৎপন্ন কৰাৰ প্ৰায় সমান চাপত তেজ পায় — এই উচ্চ চাপ গ্লমেৰুলাৰ ফিল্টাৰিং প্ৰক্ৰিয়া চলাবলৈ অপৰিহাৰ্য।',
    },
    disorders: {
      en: 'Abdominal aortic aneurysm (AAA), aortic atherosclerosis',
      as: 'উদৰীয় মহাধমনী এন্যুৰিজম (AAA), মহাধমনী এথেৰোস্ক্লেৰছিছ',
    },
    ncertNote: {
      en: 'Aorta provides blood to kidneys via renal arteries — source of blood for filtration.',
      as: 'মহাধমনীয়ে বৃক্ক ধমনীৰ যোগেদি বৃক্কলৈ তেজ যোগায় — ফিল্টাৰিংৰ তেজৰ উৎস।',
    },
  },
  inferiorVenaCava: {
    id: 'inferiorVenaCava', color: '#1d4ed8', glowColor: '#3b82f6', category: 'organ',
    name: { en: 'Inferior Vena Cava (IVC)', as: 'অধঃ মহাশিৰা (IVC)' },
    role: { en: 'Receives purified blood from renal veins — returns to heart',
            as: 'বৃক্ক শিৰাৰ পৰা পৰিশোধিত তেজ গ্ৰহণ কৰে — হৃদপিণ্ডলৈ ঘুৰাই দিয়ে' },
    description: {
      en: 'The IVC is the largest abdominal vein, receiving purified blood from both renal veins and returning it to the right atrium. After kidney filtration, the blood entering the IVC has significantly reduced metabolic waste levels.',
      as: 'IVC হৈছে সৰ্ববৃহৎ উদৰীয় শিৰা, যিয়ে দুয়োটা বৃক্ক শিৰাৰ পৰা পৰিশোধিত তেজ পায় আৰু সোঁ অলিন্দলৈ ঘুৰাই দিয়ে। বৃক্ক ফিল্টাৰিংৰ পিছত, IVC-ত প্ৰৱেশ কৰা তেজৰ বিপাকীয় বৰ্জ্য স্তৰ উল্লেখযোগ্যভাৱে কমে।',
    },
    functions: {
      en: ['Receives purified blood from both renal veins', 'Returns blood to right atrium → pulmonary circulation', 'Right renal vein: short, direct entry | Left: longer, crosses aorta', 'Passes through diaphragm at T8 level'],
      as: ['দুয়োটা বৃক্ক শিৰাৰ পৰা পৰিশোধিত তেজ পায়', 'তেজক সোঁ অলিন্দ → ফুসফুসীয় পৰিবহনলৈ ঘুৰাই দিয়ে', 'সোঁ বৃক্ক শিৰা: চুটি, পোনে পোনে প্ৰৱেশ | বাওঁ: দীঘল, মহাধমনী অতিক্ৰম কৰে', 'T8 স্তৰত ডায়াফ্ৰামৰ মাজেৰে যায়'],
    },
    keyFacts: {
      en: ['Largest abdominal vein', 'Right renal vein shorter; left crosses aorta anteriorly', 'IVC blood (after renal entry): lower urea/creatinine', 'Passes through diaphragm at T8 (vs esophagus T10, aorta T12)'],
      as: ['সৰ্ববৃহৎ উদৰীয় শিৰা', 'সোঁ বৃক্ক শিৰা চুটি; বাওঁ মহাধমনীৰ আগেদি অতিক্ৰম কৰে', 'IVC তেজ (বৃক্ক প্ৰৱেশৰ পিছত): কম ইউৰিয়া/ক্ৰিয়েটিনিন', 'T8-ত ডায়াফ্ৰামৰ মাজেৰে যায় (অন্ননালী T10, মহাধমনী T12-ৰ বিপৰীতে)'],
    },
    examNotes: {
      en: ['IVC: returns filtered blood from kidneys to heart', 'Mnemonic T8-T10-T12: IVC, Esophagus, Aorta through diaphragm', 'Left renal vein crosses aorta → clinically important landmark'],
      as: ['IVC: বৃক্কৰ পৰা হৃদপিণ্ডলৈ ফিল্টাৰ কৰা তেজ ঘুৰাই দিয়ে', 'সূত্ৰ T8-T10-T12: IVC, অন্ননালী, মহাধমনী ডায়াফ্ৰামৰ মাজেৰে', 'বাওঁ বৃক্ক শিৰাই মহাধমনী অতিক্ৰম কৰে → চিকিৎসাগতভাৱে গুৰুত্বপূৰ্ণ চিহ্ন'],
    },
    funFact: {
      en: 'The blood returning via IVC from the kidneys is remarkably clean — the kidneys have stripped out urea, creatinine, and other wastes, returning purified plasma to the circulation.',
      as: 'বৃক্কৰ পৰা IVC-ৰ যোগেদি ঘূৰি অহা তেজ উল্লেখযোগ্যভাৱে পৰিষ্কাৰ — বৃক্কই ইউৰিয়া, ক্ৰিয়েটিনিন আৰু আন বৰ্জ্য আঁতৰাই, পৰিশোধিত প্লাজমা পৰিবহনলৈ ঘুৰাই দিয়ে।',
    },
    disorders: {
      en: 'IVC thrombosis, Budd-Chiari syndrome, IVC filter complications',
      as: 'IVC থ্ৰম্বছিছ, বাড-চিয়াৰী ছিনড্ৰম, IVC ফিল্টাৰ জটিলতা',
    },
    ncertNote: {
      en: 'IVC receives purified blood from renal veins after kidney filtration, returning it to the heart.',
      as: 'বৃক্ক ফিল্টাৰিংৰ পিছত IVC-এ বৃক্ক শিৰাৰ পৰা পৰিশোধিত তেজ পায়, তাক হৃদপিণ্ডলৈ ঘুৰাই দিয়ে।',
    },
  },

  // ── Nephron Structures ─────────────────────────────────────────────────────
  afferentArteriole: {
    id: 'afferentArteriole', color: '#ef4444', glowColor: '#f87171', category: 'nephron',
    name: { en: 'Afferent Arteriole', as: 'অভিকেন্দ্ৰিক ধমনিকা' },
    role: { en: 'Delivers blood into glomerulus under high pressure for filtration',
            as: 'ফিল্টাৰিংৰ বাবে উচ্চ চাপত গ্লমেৰুলাছত তেজ পঠিয়ায়' },
    description: {
      en: 'The afferent arteriole brings blood from interlobular arteries to the glomerular capillaries. Being wider than the efferent arteriole, it creates the high hydrostatic pressure (~60 mmHg) required for ultrafiltration. Contains juxtaglomerular (JG) cells that secrete renin.',
      as: 'অভিকেন্দ্ৰিক ধমনিকাই ইণ্টাৰলবুলাৰ ধমনীৰ পৰা গ্লমেৰুলাৰ কেপিলেৰীলৈ তেজ আনে। অপকেন্দ্ৰিক ধমনিকাতকৈ বহল হোৱা বাবে, ই অতিৰিক্ত ফিল্টাৰিংৰ বাবে প্ৰয়োজনীয় উচ্চ হাইড্ৰ‘ষ্টেটিক চাপ (~৬০ mmHg) সৃষ্টি কৰে। জাক্সটাগ্লমেৰুলাৰ (JG) কোষ থাকে যিয়ে ৰেনিন ক্ষৰণ কৰে।',
    },
    functions: {
      en: ['Delivers blood to glomerular capillaries at high pressure', 'Regulates GFR by vasodilation/constriction', 'Contains JG cells → secrete renin (blood pressure regulation)', 'Wider than efferent → high glomerular capillary pressure'],
      as: ['গ্লমেৰুলাৰ কেপিলেৰীলৈ উচ্চ চাপত তেজ পঠিয়ায়', 'ভাছ‘ডাইলেচন/সংকোচনৰ যোগেদি GFR নিয়ন্ত্ৰণ কৰে', 'JG কোষ থাকে → ৰেনিন ক্ষৰণ কৰে (ৰক্তচাপ নিয়ন্ত্ৰণ)', 'অপকেন্দ্ৰিকতকৈ বহল → উচ্চ গ্লমেৰুলাৰ কেপিলেৰী চাপ'],
    },
    keyFacts: {
      en: ['Wider than efferent arteriole → high glomerular pressure (~60 mmHg)', 'JG cells in afferent wall + macula densa (DCT) = juxtaglomerular apparatus (JGA)', 'Constriction → ↓ GFR; Dilation → ↑ GFR', 'NSAIDs constrict afferent → ↓ GFR (acute kidney injury risk)'],
      as: ['অপকেন্দ্ৰিক ধমনিকাতকৈ বহল → উচ্চ গ্লমেৰুলাৰ চাপ (~৬০ mmHg)', 'অভিকেন্দ্ৰিক গাৰ JG কোষ + মেকুলা ডেন্‌ছা (DCT) = জাক্সটাগ্লমেৰুলাৰ যন্ত্ৰ (JGA)', 'সংকোচন → ↓ GFR; ডাইলেচন → ↑ GFR', 'NSAIDs অভিকেন্দ্ৰিক চেপি ধৰে → ↓ GFR (একিউট কিডনি ইনজুৰিৰ আশংকা)'],
    },
    examNotes: {
      en: ['Afferent = WIDER than efferent → creates pressure difference → ultrafiltration', 'JGA = JG cells (afferent wall) + macula densa (DCT cells)', 'Renin from JG cells → angiotensin II → vasoconstriction + aldosterone → ↑ BP', 'NSAIDs reduce prostaglandins → afferent constriction → ↓ GFR'],
      as: ['অভিকেন্দ্ৰিক = অপকেন্দ্ৰিকতকৈ বহল → চাপ পাৰ্থক্য সৃষ্টি কৰে → অতি-ফিল্টাৰিং', 'JGA = JG কোষ (অভিকেন্দ্ৰিক গা) + মেকুলা ডেন্‌ছা (DCT কোষ)', 'JG কোষৰ ৰেনিন → এনজিয়‘টেনছিন II → ভাছ‘সংকোচন + এলডোষ্টেৰন → ↑ BP', 'NSAIDs প্ৰষ্টাগ্লেণ্ডিন কমায় → অভিকেন্দ্ৰিক সংকোচন → ↓ GFR'],
    },
    funFact: {
      en: 'The afferent arteriole is thicker than the efferent — this single anatomical difference creates the pressure gradient driving 180 L/day of filtration, separating waste from blood at nanoscale precision!',
      as: 'অভিকেন্দ্ৰিক ধমনিকা অপকেন্দ্ৰিকতকৈ মোটা — এই এটাই শৰীৰ-গঠনগত পাৰ্থক্যই দৈনিক ১৮০ লি. ফিল্টাৰিং চলোৱা চাপ গ্ৰেডিয়েণ্ট সৃষ্টি কৰে, নেন‘স্কেল সঠিকতাৰে তেজৰ পৰা বৰ্জ্য পৃথক কৰে!',
    },
    disorders: {
      en: 'Constriction by NSAIDs, dilation by ACE inhibitors, diabetic arteriolar changes',
      as: 'NSAIDs দ্বাৰা সংকোচন, ACE inhibitors দ্বাৰা ডাইলেচন, মধুমেহজনিত ধমনিকাৰ পৰিৱৰ্তন',
    },
    ncertNote: {
      en: 'Afferent arteriole brings blood INTO glomerulus; wider than efferent → creates high pressure for ultrafiltration.',
      as: 'অভিকেন্দ্ৰিক ধমনিকাই গ্লমেৰুলাছত তেজ আনে; অপকেন্দ্ৰিকতকৈ বহল → অতি-ফিল্টাৰিংৰ বাবে উচ্চ চাপ সৃষ্টি কৰে।',
    },
  },
  glomerulus: {
    id: 'glomerulus', color: '#f97316', glowColor: '#fb923c', category: 'nephron',
    name: { en: 'Glomerulus', as: 'গ্লমেৰুলাছ' },
    role: { en: 'Ultrafiltration — first step of urine formation',
            as: 'অতি-ফিল্টাৰিং — মূত্ৰ গঠনৰ প্ৰথম পদক্ষেপ' },
    description: {
      en: 'A tuft of fenestrated capillaries inside Bowman\'s capsule. Performs ultrafiltration under ~60 mmHg pressure, forcing water, small solutes, and wastes into Bowman\'s space while retaining plasma proteins and blood cells.',
      as: 'বোমেনৰ প্ৰকোষ্ঠৰ ভিতৰৰ ফেনেষ্ট্ৰেটেড কেপিলেৰীৰ গোট। ~৬০ mmHg চাপত অতি-ফিল্টাৰিং কৰে, পানী, সৰু দ্ৰৱ আৰু বৰ্জ্য বোমেনৰ স্থানলৈ ঠেলি দিয়ে আৰু প্লাজমা প্ৰটিন আৰু ৰক্তকণিকা ধৰি ৰাখে।',
    },
    functions: {
      en: ['Ultrafiltration of blood plasma under high pressure', 'Filters: water, ions, glucose, amino acids, urea, creatinine', 'Retains: plasma proteins (albumin), RBCs, large molecules', 'GFR = 125 mL/min (~180 L/day) — first step of urine formation'],
      as: ['উচ্চ চাপত তেজৰ প্লাজমাৰ অতি-ফিল্টাৰিং', 'ফিল্টাৰ কৰে: পানী, আয়ন, গ্লুকোজ, এমিনো এচিড, ইউৰিয়া, ক্ৰিয়েটিনিন', 'ধৰি ৰাখে: প্লাজমা প্ৰটিন (এলবুমিন), RBC, ডাঙৰ অণু', 'GFR = ১২৫ মি.লি./মিনিট (~১৮০ লি./দিন) — মূত্ৰ গঠনৰ প্ৰথম পদক্ষেপ'],
    },
    keyFacts: {
      en: ['GFR = 125 mL/min (entire kidney); filtration fraction = 20%', 'Three filtration barriers: fenestrated endothelium + GBM + podocyte slits', 'Net filtration pressure = ~17 mmHg (60 − 32 − 11)', 'Podocytes: specialized cells with foot processes forming filtration slits'],
      as: ['GFR = ১২৫ মি.লি./মিনিট (গোটেই বৃক্ক); ফিল্টাৰিং ভগ্নাংশ = ২০%', 'তিনিটা ফিল্টাৰিং বাধা: ফেনেষ্ট্ৰেটেড এণ্ডোথেলিয়াম + GBM + পডোচাইট ফাঁক', 'মুঠ ফিল্টাৰিং চাপ = ~১৭ mmHg (৬০ − ৩২ − ১১)', 'পডোচাইট: বিশেষীকৃত কোষ যাৰ পদ-প্ৰক্ৰিয়াৰে ফিল্টাৰিং ফাঁক গঠন কৰে'],
    },
    examNotes: {
      en: ['Glomerulus = site of ULTRAFILTRATION (Step 1 of urine formation)', 'Filters everything EXCEPT plasma proteins and blood cells', 'GFR = 125 mL/min; 180 L/day filtered → only 1.5 L urine (99% reabsorbed)', 'Damage → proteinuria (protein in urine) = sign of glomerular disease'],
      as: ['গ্লমেৰুলাছ = অতি-ফিল্টাৰিংৰ স্থান (মূত্ৰ গঠনৰ পদক্ষেপ ১)', 'প্লাজমা প্ৰটিন আৰু ৰক্তকণিকা বাদে সকলো ফিল্টাৰ কৰে', 'GFR = ১২৫ মি.লি./মিনিট; দৈনিক ১৮০ লি. ফিল্টাৰ → কেৱল ১.৫ লি. মূত্ৰ (৯৯% পুনৰ অৱশোষিত)', 'ক্ষতি → প্ৰটিনিউৰিয়া (মূত্ৰত প্ৰটিন) = গ্লমেৰুলাৰ ৰোগৰ চিন'],
    },
    funFact: {
      en: 'The glomerular filtration membrane is 1000× more permeable than normal capillaries yet so selective that a molecule just slightly larger than albumin cannot pass — molecular sorting at the nanoscale!',
      as: 'গ্লমেৰুলাৰ ফিল্টাৰিং আৱৰণ স্বাভাৱিক কেপিলেৰীতকৈ ১০০০× অধিক প্ৰৱেশযোগ্য তথাপি ইমান বাছনীয় যে এলবুমিনতকৈ অলপ ডাঙৰ অণুও যাব নোৱাৰে — নেন‘স্কেলত অণুক বাচনি!',
    },
    disorders: {
      en: 'Glomerulonephritis, nephrotic syndrome, diabetic nephropathy, IgA nephropathy',
      as: 'গ্লমেৰুল‘নেফ্ৰাইটিছ, নেফ্ৰটিক ছিনড্ৰম, মধুমেহজনিত নেফ্ৰ‘পেথী, IgA নেফ্ৰ‘পেথী',
    },
    ncertNote: {
      en: 'NCERT: Glomerulus performs ULTRAFILTRATION. GFR = 125 mL/min. Blood cells and proteins are NOT filtered. Filtrate = primary urine.',
      as: 'NCERT: গ্লমেৰুলাছে অতি-ফিল্টাৰিং কৰে। GFR = ১২৫ মি.লি./মিনিট। ৰক্তকণিকা আৰু প্ৰটিন ফিল্টাৰ নহয়। ফিল্ট্ৰেট = প্ৰাথমিক মূত্ৰ।',
    },
  },
  bowmansCapsule: {
    id: 'bowmansCapsule', color: '#10b981', glowColor: '#34d399', category: 'nephron',
    name: { en: "Bowman's Capsule", as: 'বোমেনৰ প্ৰকোষ্ঠ' },
    role: { en: 'Cup-shaped structure surrounding glomerulus — collects filtrate',
            as: 'গ্লমেৰুলাছক আগুৰি থকা কাপ-আকৃতিৰ গঠন — ফিল্ট্ৰেট সংগ্ৰহ কৰে' },
    description: {
      en: 'A double-walled epithelial cup surrounding the glomerulus. The space between visceral (podocyte) and parietal layers collects glomerular filtrate (primary urine). Together with the glomerulus, it forms the renal corpuscle (Malpighian body).',
      as: 'গ্লমেৰুলাছক আগুৰি থকা দ্বি-গাৰ এপিথেলিয়েল কাপ। ভিচাৰেল (পডোচাইট) আৰু পেৰাইটেল স্তৰৰ মাজৰ স্থানে গ্লমেৰুলাৰ ফিল্ট্ৰেট (প্ৰাথমিক মূত্ৰ) সংগ্ৰহ কৰে। গ্লমেৰুলাছৰ সৈতে মিলি, ই বৃক্ক কৰ্পাছ্‌ল (মাল্পিজিয়ান বডি) গঠন কৰে।',
    },
    functions: {
      en: ['Surrounds and houses the glomerulus', 'Collects ultrafiltrate in Bowman\'s space', 'Visceral layer (podocytes) = filtration slit membrane', 'Filtrate flows from Bowman\'s space → PCT'],
      as: ['গ্লমেৰুলাছক আগুৰি ৰাখে', 'বোমেনৰ স্থানত অতি-ফিল্ট্ৰেট সংগ্ৰহ কৰে', 'ভিচাৰেল স্তৰ (পডোচাইট) = ফিল্টাৰিং ফাঁক আৱৰণ', 'ফিল্ট্ৰেট বোমেনৰ স্থান → PCT-লৈ যায়'],
    },
    keyFacts: {
      en: ['Glomerulus + Bowman\'s capsule = Renal Corpuscle / Malpighian body', 'Parietal layer: simple squamous epithelium', 'Visceral layer: podocytes with foot processes', 'Bowman\'s space: between visceral and parietal layers — filtrate collects here'],
      as: ['গ্লমেৰুলাছ + বোমেনৰ প্ৰকোষ্ঠ = বৃক্ক কৰ্পাছ্‌ল / মাল্পিজিয়ান বডি', 'পেৰাইটেল স্তৰ: ছিম্পল স্কোৱেমাছ এপিথেলিয়াম', 'ভিচাৰেল স্তৰ: পদ-প্ৰক্ৰিয়াযুক্ত পডোচাইট', 'বোমেনৰ স্থান: ভিচাৰেল আৰু পেৰাইটেল স্তৰৰ মাজত — ফিল্ট্ৰেট ইয়াত জমা হয়'],
    },
    examNotes: {
      en: ['Bowman\'s capsule + glomerulus = Renal Corpuscle (also called Malpighian body)', 'Filtrate collected in Bowman\'s space enters PCT', 'NCERT: Renal corpuscle = site of ultrafiltration', 'Primary filtrate = plasma composition minus large proteins/cells'],
      as: ['বোমেনৰ প্ৰকোষ্ঠ + গ্লমেৰুলাছ = বৃক্ক কৰ্পাছ্‌ল (মাল্পিজিয়ান বডিও কোৱা হয়)', 'বোমেনৰ স্থানত সংগৃহীত ফিল্ট্ৰেট PCT-ত প্ৰৱেশ কৰে', 'NCERT: বৃক্ক কৰ্পাছ্‌ল = অতি-ফিল্টাৰিংৰ স্থান', 'প্ৰাথমিক ফিল্ট্ৰেট = প্লাজমা গঠনৰ পৰা ডাঙৰ প্ৰটিন/কোষ বাদ দি'],
    },
    funFact: {
      en: 'Bowman\'s capsule was described by Sir William Bowman in 1842. The podocyte foot processes forming filtration slits are visible only with electron microscopy — sophisticated nanofilters!',
      as: 'বোমেনৰ প্ৰকোষ্ঠ ১৮৪২ চনত ছাৰ উইলিয়াম বোমেনে বৰ্ণনা কৰিছিল। ফিল্টাৰিং ফাঁক গঠন কৰা পডোচাইট পদ-প্ৰক্ৰিয়া কেৱল ইলেক্ট্ৰন মাইক্ৰোস্কোপীৰে দেখা যায় — উন্নত নেন’ফিল্টাৰ!',
    },
    disorders: {
      en: 'Crescent formation (rapidly progressive GN), amyloidosis, diabetic glomerulosclerosis',
      as: 'ক্ৰিচেণ্ট গঠন (দ্ৰুতগতিৰে আগবঢ়া GN), এমাইল‘ইডছিছ, মধুমেহজনিত গ্লমেৰুলোস্ক্লেৰছিছ',
    },
    ncertNote: {
      en: 'NCERT: Bowman\'s capsule (+ glomerulus) = Renal corpuscle / Malpighian body. Filtrate collects here and enters PCT.',
      as: 'NCERT: বোমেনৰ প্ৰকোষ্ঠ (+ গ্লমেৰুলাছ) = বৃক্ক কৰ্পাছ্‌ল / মাল্পিজিয়ান বডি। ইয়াত ফিল্ট্ৰেট জমা হয় আৰু PCT-ত প্ৰৱেশ কৰে।',
    },
  },
  proximalConvolutedTubule: {
    id: 'proximalConvolutedTubule', color: '#06b6d4', glowColor: '#22d3ee', category: 'nephron',
    name: { en: 'Proximal Convoluted Tubule (PCT)', as: 'আদিম সংবৃত্ত নলিকা (PCT)' },
    role: { en: 'Major reabsorption site — reclaims 65-70% of filtrate',
            as: 'মুখ্য পুনঃ অৱশোষণ স্থান — ফিল্ট্ৰেটৰ ৬৫-৭০% পুনৰ লয়' },
    description: {
      en: 'The first and most metabolically active tubular segment. Its brush border (microvilli) increases surface area 30-40×, enabling massive reabsorption of Na⁺, water, glucose, amino acids, and bicarbonate. The site of 100% glucose and amino acid reabsorption under normal conditions.',
      as: 'প্ৰথম আৰু আটাইতকৈ বিপাকীয়ভাৱে সক্ৰিয় নলিকা অংশ। ইয়াৰ ব্ৰাছ বৰ্ডাৰ (মাইক্ৰোভিলাই)-এ পৃষ্ঠ আয়তন ৩০-৪০× বঢ়ায়, Na⁺, পানী, গ্লুকোজ, এমিনো এচিড আৰু বাইকাৰ্বনেটৰ বৃহৎ পুনঃ অৱশোষণ সক্ষম কৰে। স্বাভাৱিক অৱস্থাত গ্লুকোজ আৰু এমিনো এচিডৰ ১০০% পুনঃ অৱশোষণৰ স্থান।',
    },
    functions: {
      en: ['Reabsorbs 65-70% of Na⁺, K⁺, water, HCO₃⁻', '100% reabsorption of glucose and amino acids (below threshold)', 'Secretes H⁺ ions, urea, creatinine, drugs', 'Brush border microvilli → 30-40× increased surface area'],
      as: ['Na⁺, K⁺, পানী, HCO₃⁻-ৰ ৬৫-৭০% পুনৰ অৱশোষণ', 'গ্লুকোজ আৰু এমিনো এচিডৰ ১০০% পুনঃ অৱশোষণ (থ্ৰেছহোল্ডৰ তলত)', 'H⁺ আয়ন, ইউৰিয়া, ক্ৰিয়েটিনিন, ঔষধ ক্ষৰণ কৰে', 'ব্ৰাছ বৰ্ডাৰ মাইক্ৰোভিলাই → ৩০-৪০× অধিক পৃষ্ঠ আয়তন'],
    },
    keyFacts: {
      en: ['Brush border (microvilli) greatly increases surface area', 'SGLT2 cotransporter: glucose + Na⁺ reabsorption (target for SGLT2 inhibitors)', 'Glucose renal threshold: 180 mg/dL plasma glucose', '100% amino acid reabsorption via specific transporters', 'Na-K-ATPase on basolateral membrane drives Na⁺ gradient'],
      as: ['ব্ৰাছ বৰ্ডাৰ (মাইক্ৰোভিলাই)-এ পৃষ্ঠ আয়তন বহুগুণে বঢ়ায়', 'SGLT2 কোট্ৰান্সপোৰ্টাৰ: গ্লুকোজ + Na⁺ পুনঃ অৱশোষণ (SGLT2 ইনহিবিটৰৰ লক্ষ্য)', 'গ্লুকোজ বৃক্ক থ্ৰেছহোল্ড: প্লাজমা গ্লুকোজ ১৮০ মিগ্ৰা/ডিলি', 'নিৰ্দিষ্ট ট্ৰান্সপোৰ্টাৰৰ যোগেদি ১০০% এমিনো এচিড পুনঃ অৱশোষণ', 'বেছ‘লেটাৰেল আৱৰণৰ Na-K-ATPase-এ Na⁺ গ্ৰেডিয়েণ্ট চলায়'],
    },
    examNotes: {
      en: ['PCT = largest reabsorption (65-70% of filtrate)', '100% glucose + amino acids reabsorbed in PCT (below threshold)', 'Glucose threshold = 180 mg/dL; above = glycosuria (diabetes sign)', 'SGLT2 inhibitors (flozins) block PCT glucose reabsorption → diabetes treatment', 'Brush border = ↑ surface area for maximal reabsorption'],
      as: ['PCT = সৰ্ববৃহৎ পুনঃ অৱশোষণ (ফিল্ট্ৰেটৰ ৬৫-৭০%)', 'PCT-ত ১০০% গ্লুকোজ + এমিনো এচিড পুনঃ অৱশোষিত (থ্ৰেছহোল্ডৰ তলত)', 'গ্লুকোজ থ্ৰেছহোল্ড = ১৮০ মিগ্ৰা/ডিলি; ওপৰত = গ্লাইকোছুৰিয়া (মধুমেহ চিন)', 'SGLT2 ইনহিবিটৰ (ফ্লোজিন)-এ PCT গ্লুকোজ পুনঃ অৱশোষণ ৰোধ কৰে → মধুমেহ চিকিৎসা', 'ব্ৰাছ বৰ্ডাৰ = সৰ্বোচ্চ পুনঃ অৱশোষণৰ বাবে ↑ পৃষ্ঠ আয়তন'],
    },
    funFact: {
      en: 'If you could unroll all PCT microvilli in both kidneys, they would cover an area larger than a tennis court — all dedicated to rapid, efficient reabsorption!',
      as: 'যদি আপুনি দুয়োটা বৃক্কৰ সকলো PCT মাইক্ৰোভিলাই খুলি পাৰি দিয়ে, ই এখন টেনিছ পথাৰতকৈ ডাঙৰ আয়তন জুৰি ল’ব — সকলোবোৰ দ্ৰুত, কাৰ্যক্ষম পুনঃ অৱশোষণৰ বাবে নিৱেদিত!',
    },
    disorders: {
      en: 'Fanconi syndrome (generalized PCT defect), proximal RTA (Type 2)',
      as: 'ফেনকোনি ছিনড্ৰম (সাধাৰণীকৃত PCT ত্ৰুটি), প্ৰক্সিমেল RTA (টাইপ ২)',
    },
    ncertNote: {
      en: 'NCERT: PCT reabsorbs nutrients (glucose, amino acids), electrolytes, and water. Brush border increases absorption surface. 65-70% of filtrate reabsorbed here.',
      as: 'NCERT: PCT-এ পুষ্টি (গ্লুকোজ, এমিনো এচিড), ইলেক্ট্ৰলাইট আৰু পানী পুনঃ অৱশোষণ কৰে। ব্ৰাছ বৰ্ডাৰে অৱশোষণ পৃষ্ঠ বঢ়ায়। ইয়াত ফিল্ট্ৰেটৰ ৬৫-৭০% পুনৰ অৱশোষিত হয়।',
    },
  },
  loopOfHenle: {
    id: 'loopOfHenle', color: '#7c3aed', glowColor: '#a78bfa', category: 'nephron',
    name: { en: 'Loop of Henle', as: 'হেনলিৰ লুপ' },
    role: { en: 'Creates medullary concentration gradient — countercurrent multiplication',
            as: 'মেডুলেৰী ঘনত্ব গ্ৰেডিয়েণ্ট সৃষ্টি কৰে — কাউন্টাৰকাৰেণ্ট গুণন' },
    description: {
      en: 'The U-shaped tubular loop dipping into the renal medulla. Creates the medullary hyperosmotic gradient (300→1200 mOsm) through countercurrent multiplication — essential for urine concentration. Descending limb (water permeable) and thick ascending limb (salt pump, water impermeable).',
      as: 'বৃক্ক মেডুলাত ডুবি থকা U-আকৃতিৰ নলিকা লুপ। কাউন্টাৰকাৰেণ্ট গুণনৰ যোগেদি মেডুলেৰী হাইপাৰঅছমটিক গ্ৰেডিয়েণ্ট (৩০০→১২০০ mOsm) সৃষ্টি কৰে — মূত্ৰ ঘনত্বৰ বাবে অপৰিহাৰ্য। অৱৰোহী লুপ (পানী প্ৰৱেশযোগ্য) আৰু মোটা আৰোহী লুপ (লৱণ পাম্প, পানী অপ্ৰৱেশযোগ্য)।',
    },
    functions: {
      en: ['Creates medullary osmotic gradient (300-1200 mOsm/kg)', 'Descending limb: water exits by osmosis (AQP1 channels present)', 'Thick ascending limb: pumps Na⁺/K⁺/Cl⁻ out, water-impermeable', 'Countercurrent multiplier (with vasa recta = countercurrent exchanger)'],
      as: ['মেডুলেৰী অছমটিক গ্ৰেডিয়েণ্ট সৃষ্টি কৰে (৩০০-১২০০ mOsm/কে.জি.)', 'অৱৰোহী লুপ: অছমছিচৰ যোগেদি পানী ওলায় (AQP1 চেনেল আছে)', 'মোটা আৰোহী লুপ: Na⁺/K⁺/Cl⁻ বাহিৰ পাম্প কৰে, পানী-অপ্ৰৱেশযোগ্য', 'কাউন্টাৰকাৰেণ্ট গুণক (ভাছা ৰেক্টাৰ সৈতে = কাউন্টাৰকাৰেণ্ট বিনিময়ক)'],
    },
    keyFacts: {
      en: ['Thin descending: water permeable (AQP1), salt impermeable', 'Thick ascending (TAL): water-IMPERMEABLE, NKCC2 pumps NaCl out', 'TAL = site of action of LOOP DIURETICS (furosemide/frusemide)', 'Juxtamedullary nephrons have longer loops → better concentration', 'Vasa recta = countercurrent exchanger preserving medullary gradient'],
      as: ['পাতল অৱৰোহী: পানী প্ৰৱেশযোগ্য (AQP1), লৱণ অপ্ৰৱেশযোগ্য', 'মোটা আৰোহী (TAL): পানী-অপ্ৰৱেশযোগ্য, NKCC2-এ NaCl বাহিৰ পাম্প কৰে', 'TAL = লুপ ডায়ুৰেটিক (ফিউৰোছেমাইড/ফ্ৰুছেমাইড)-ৰ ক্ৰিয়া স্থান', 'জাক্সটামেডুলেৰী নেফ্ৰনৰ লুপ দীঘল → উন্নত ঘনত্ব', 'ভাছা ৰেক্টা = মেডুলেৰী গ্ৰেডিয়েণ্ট সংৰক্ষণ কৰা কাউন্টাৰকাৰেণ্ট বিনিময়ক'],
    },
    examNotes: {
      en: ['Descending limb = water permeable | Ascending limb = water impermeable, pumps NaCl', 'Countercurrent multiplier creates 300→1200 mOsm cortex-to-medulla gradient', 'Loop diuretics (furosemide): block NKCC2 in thick ascending limb → ↑ urine output', 'Gradient from Loop of Henle drives collecting duct urine concentration under ADH', 'Juxtamedullary nephrons (15%) have long loops → maximum concentrating ability'],
      as: ['অৱৰোহী লুপ = পানী প্ৰৱেশযোগ্য | আৰোহী লুপ = পানী অপ্ৰৱেশযোগ্য, NaCl পাম্প কৰে', 'কাউন্টাৰকাৰেণ্ট গুণকে ৩০০→১২০০ mOsm কৰ্টেক্স-ৰ পৰা-মেডুলা গ্ৰেডিয়েণ্ট সৃষ্টি কৰে', 'লুপ ডায়ুৰেটিক (ফিউৰোছেমাইড): মোটা আৰোহী লুপৰ NKCC2 ৰোধ কৰে → ↑ মূত্ৰ আউটপুট', 'হেনলিৰ লুপৰ গ্ৰেডিয়েণ্টে ADH-ৰ অধীনত সংগ্ৰাহী নলিকাৰ মূত্ৰ ঘনত্ব চলায়', 'জাক্সটামেডুলেৰী নেফ্ৰন (১৫%)-ৰ দীঘল লুপ → সৰ্বোচ্চ ঘনীভূত ক্ষমতা'],
    },
    funFact: {
      en: 'The Loop of Henle acts like a biological osmosis machine — water exits going down while salt is pumped out going up, creating a concentration gradient powerful enough to produce urine 4× more concentrated than blood plasma!',
      as: 'হেনলিৰ লুপে এক জৈৱিক অছমছিচ যন্ত্ৰৰ দৰে কাম কৰে — তললৈ যোৱাৰ সময়ত পানী ওলায় আৰু ওপৰলৈ যোৱাৰ সময়ত লৱণ বাহিৰ পাম্প কৰা হয়, তেজৰ প্লাজমাতকৈ ৪× অধিক ঘনীভূত মূত্ৰ উৎপন্ন কৰিব পৰাকৈ শক্তিশালী ঘনত্ব গ্ৰেডিয়েণ্ট সৃষ্টি কৰে!',
    },
    disorders: {
      en: 'Bartter syndrome (NKCC2 defect), furosemide toxicity, sickle cell papillary necrosis',
      as: 'বাৰ্টাৰ ছিনড্ৰম (NKCC2 ত্ৰুটি), ফিউৰোছেমাইড বিষাক্ততা, ছিকল চেল পেপিলেৰী নেক্ৰছিছ',
    },
    ncertNote: {
      en: 'NCERT: Loop of Henle maintains concentration gradient. Descending: water permeable. Ascending: pumps NaCl out, water impermeable → creates medullary gradient for urine concentration.',
      as: 'NCERT: হেনলিৰ লুপে ঘনত্ব গ্ৰেডিয়েণ্ট বজাই ৰাখে। অৱৰোহী: পানী প্ৰৱেশযোগ্য। আৰোহী: NaCl বাহিৰ পাম্প কৰে, পানী অপ্ৰৱেশযোগ্য → মূত্ৰ ঘনত্বৰ বাবে মেডুলেৰী গ্ৰেডিয়েণ্ট সৃষ্টি কৰে।',
    },
  },
  distalConvolutedTubule: {
    id: 'distalConvolutedTubule', color: '#ec4899', glowColor: '#f472b6', category: 'nephron',
    name: { en: 'Distal Convoluted Tubule (DCT)', as: 'অন্ত্যম সংবৃত্ত নলিকা (DCT)' },
    role: { en: 'Hormonal fine-tuning — aldosterone-driven Na⁺/K⁺ regulation',
            as: 'হৰমোনাল সূক্ষ্ম-নিয়ন্ত্ৰণ — এলডোষ্টেৰন-চালিত Na⁺/K⁺ নিয়ন্ত্ৰণ' },
    description: {
      en: 'The final convoluted tubule before the collecting duct. Site of aldosterone action (↑ Na⁺ reabsorption, ↑ K⁺ secretion) and PTH action (↑ Ca²⁺ reabsorption). Contains macula densa cells of the juxtaglomerular apparatus.',
      as: 'সংগ্ৰাহী নলিকাৰ আগৰ অন্তিম সংবৃত্ত নলিকা। এলডোষ্টেৰন ক্ৰিয়াৰ স্থান (↑ Na⁺ পুনঃ অৱশোষণ, ↑ K⁺ ক্ষৰণ) আৰু PTH ক্ৰিয়াৰ স্থান (↑ Ca²⁺ পুনঃ অৱশোষণ)। জাক্সটাগ্লমেৰুলাৰ যন্ত্ৰৰ মেকুলা ডেন্‌ছা কোষ থাকে।',
    },
    functions: {
      en: ['Na⁺ reabsorption under aldosterone control (ENaC channels)', 'K⁺ and H⁺ secretion regulated by aldosterone', 'Ca²⁺ reabsorption under PTH (parathyroid hormone)', 'Macula densa senses tubular NaCl → regulates renin and GFR'],
      as: ['এলডোষ্টেৰন নিয়ন্ত্ৰণত Na⁺ পুনঃ অৱশোষণ (ENaC চেনেল)', 'এলডোষ্টেৰনে K⁺ আৰু H⁺ ক্ষৰণ নিয়ন্ত্ৰণ কৰে', 'PTH (পেৰাথাইৰয়েড হৰমোন) অধীনত Ca²⁺ পুনঃ অৱশোষণ', 'মেকুলা ডেন্‌ছাই নলিকা NaCl অনুভৱ কৰে → ৰেনিন আৰু GFR নিয়ন্ত্ৰণ কৰে'],
    },
    keyFacts: {
      en: ['Major site of ALDOSTERONE action: Na⁺ in ↑, K⁺ out ↑', 'Aldosterone = mineralocorticoid from adrenal cortex', 'NaCl cotransporter (NCC) = target of thiazide diuretics', 'Macula densa cells (specialized DCT) = part of JGA', 'PTH increases Ca²⁺ reabsorption here'],
      as: ['এলডোষ্টেৰন ক্ৰিয়াৰ মুখ্য স্থান: Na⁺ ↑, K⁺ ↑', 'এলডোষ্টেৰন = এড্ৰিনেল কৰ্টেক্সৰ মিনাৰেলকৰ্টিকয়েড', 'NaCl কোট্ৰান্সপোৰ্টাৰ (NCC) = থিয়াজাইড ডায়ুৰেটিকৰ লক্ষ্য', 'মেকুলা ডেন্‌ছা কোষ (বিশেষীকৃত DCT) = JGA-ৰ অংশ', 'PTH-এ ইয়াত Ca²⁺ পুনঃ অৱশোষণ বঢ়ায়'],
    },
    examNotes: {
      en: ['DCT = site of aldosterone (Na⁺ reabsorption, K⁺ secretion) and PTH (Ca²⁺ reabsorption)', 'Aldosterone from adrenal cortex → acts on DCT + CD', 'Thiazide diuretics block NCC cotransporter in DCT → used for hypertension', 'Macula densa of JGA located in DCT wall near afferent arteriole'],
      as: ['DCT = এলডোষ্টেৰন (Na⁺ পুনঃ অৱশোষণ, K⁺ ক্ষৰণ) আৰু PTH (Ca²⁺ পুনঃ অৱশোষণ)-ৰ স্থান', 'এড্ৰিনেল কৰ্টেক্সৰ এলডোষ্টেৰন → DCT + CD-ত ক্ৰিয়া কৰে', 'থিয়াজাইড ডায়ুৰেটিকে DCT-ত NCC কোট্ৰান্সপোৰ্টাৰ ৰোধ কৰে → উচ্চ ৰক্তচাপৰ বাবে ব্যৱহৃত', 'JGA-ৰ মেকুলা ডেন্‌ছা অভিকেন্দ্ৰিক ধমনিকাৰ ওচৰৰ DCT গাত অৱস্থিত'],
    },
    funFact: {
      en: 'Aldosterone can change Na⁺ reabsorption by just 2-3% in the DCT, but this translates to keeping millions of Na⁺ ions from being lost — a small percentage with massive blood pressure consequences!',
      as: 'এলডোষ্টেৰনে DCT-ত Na⁺ পুনঃ অৱশোষণ মাত্ৰ ২-৩% সলনি কৰিব পাৰে, কিন্তু ইয়াৰ অৰ্থ লাখ লাখ Na⁺ আয়ন হেৰাই যোৱাত বাধা দিয়া — সৰু শতাংশৰ বিশাল ৰক্তচাপজনিত ফলাফল!',
    },
    disorders: {
      en: 'Pseudohypoaldosteronism, Gitelman syndrome (NCC defect), Gordon syndrome',
      as: 'ছুড‘হাইপোএলডোষ্টেৰনিজম, গিটেলমান ছিনড্ৰম (NCC ত্ৰুটি), গৰ্ডন ছিনড্ৰম',
    },
    ncertNote: {
      en: 'NCERT: DCT = selective reabsorption/secretion under hormonal control. Aldosterone: ↑ Na⁺ reabsorption, ↑ K⁺ secretion. PTH: ↑ Ca²⁺ reabsorption.',
      as: 'NCERT: DCT = হৰমোনাল নিয়ন্ত্ৰণৰ অধীনত বাছনীয় পুনঃ অৱশোষণ/ক্ষৰণ। এলডোষ্টেৰন: ↑ Na⁺ পুনঃ অৱশোষণ, ↑ K⁺ ক্ষৰণ। PTH: ↑ Ca²⁺ পুনঃ অৱশোষণ।',
    },
  },
  collectingDuct: {
    id: 'collectingDuct', color: '#d97706', glowColor: '#f59e0b', category: 'nephron',
    name: { en: 'Collecting Duct', as: 'সংগ্ৰাহী নলিকা' },
    role: { en: 'Final urine concentration under ADH control',
            as: 'ADH নিয়ন্ত্ৰণত অন্তিম মূত্ৰ ঘনত্ব' },
    description: {
      en: 'Receives tubular fluid from multiple nephrons and concentrates urine using the medullary osmotic gradient. ADH (vasopressin) from the posterior pituitary inserts AQP2 water channels into collecting duct cells, enabling water reabsorption and producing concentrated urine.',
      as: 'একাধিক নেফ্ৰনৰ পৰা নলিকা তৰল পায় আৰু মেডুলেৰী অছমটিক গ্ৰেডিয়েণ্টৰ যোগেদি মূত্ৰ ঘনীভূত কৰে। পিছ পিটুইটেৰীৰ পৰা ADH (ভাছোপ্ৰেছিন)-এ সংগ্ৰাহী নলিকা কোষত AQP2 পানী চেনেল সন্নিৱেশ কৰে, পানী পুনঃ অৱশোষণ সক্ষম কৰি ঘনীভূত মূত্ৰ উৎপন্ন কৰে।',
    },
    functions: {
      en: ['Concentrates urine using medullary osmotic gradient', 'ADH inserts AQP2 water channels → water reabsorption → concentrated urine', 'Aldosterone: further Na⁺ reabsorption, K⁺ secretion', 'Delivers final urine to renal pelvis → ureter'],
      as: ['মেডুলেৰী অছমটিক গ্ৰেডিয়েণ্টৰ যোগেদি মূত্ৰ ঘনীভূত কৰে', 'ADH-এ AQP2 পানী চেনেল সন্নিৱেশ কৰে → পানী পুনঃ অৱশোষণ → ঘনীভূত মূত্ৰ', 'এলডোষ্টেৰন: অধিক Na⁺ পুনঃ অৱশোষণ, K⁺ ক্ষৰণ', 'অন্তিম মূত্ৰ বৃক্ক পেলভিছ → মূত্ৰনালীলৈ পঠিয়ায়'],
    },
    keyFacts: {
      en: ['Principal cells: respond to ADH (AQP2) and aldosterone', 'Intercalated cells: H⁺/HCO₃⁻ secretion (acid-base)', 'ADH from posterior pituitary (supraoptic nuclei)', 'No ADH → diabetes insipidus (20 L/day dilute urine)', 'Urine osmolality: 50 mOsm (no ADH) to 1200 mOsm (max ADH)'],
      as: ['প্ৰিন্সিপাল কোষ: ADH (AQP2) আৰু এলডোষ্টেৰনলৈ সঁহাৰি দিয়ে', 'ইণ্টাৰকেলেটেড কোষ: H⁺/HCO₃⁻ ক্ষৰণ (এচিড-ক্ষাৰ)', 'পিছ পিটুইটেৰীৰ পৰা ADH (ছুপ্ৰাঅপটিক নিউক্লিয়াই)', 'ADH নাথাকিলে → ডায়েবেটিছ ইনছিপিডাছ (দৈনিক ২০ লি. তৰল মূত্ৰ)', 'মূত্ৰ অছম‘লেলিটি: ৫০ mOsm (ADH নাই) ৰ পৰা ১২০০ mOsm (সৰ্বোচ্চ ADH) লৈ'],
    },
    examNotes: {
      en: ['Collecting duct = FINAL site of urine concentration (ADH-dependent)', 'ADH inserts AQP2 → ↑ water reabsorption → concentrated urine', 'No ADH → diabetes insipidus (dilute, large-volume urine)', 'SIADH (excess ADH) → water retention, hyponatremia', 'Aldosterone also acts here: ↑ Na⁺ reabsorption, ↑ K⁺ secretion'],
      as: ['সংগ্ৰাহী নলিকা = মূত্ৰ ঘনত্বৰ অন্তিম স্থান (ADH-নিৰ্ভৰ)', 'ADH-এ AQP2 সন্নিৱেশ কৰে → ↑ পানী পুনঃ অৱশোষণ → ঘনীভূত মূত্ৰ', 'ADH নাথাকিলে → ডায়েবেটিছ ইনছিপিডাছ (তৰল, ডাঙৰ আয়তনৰ মূত্ৰ)', 'SIADH (অতিৰিক্ত ADH) → পানী সংৰক্ষণ, হাইপোনেট্ৰিমিয়া', 'এলডোষ্টেৰনো ইয়াত ক্ৰিয়া কৰে: ↑ Na⁺ পুনঃ অৱশোষণ, ↑ K⁺ ক্ষৰণ'],
    },
    funFact: {
      en: 'Without ADH, you would produce up to 20 litres of dilute urine per day instead of 1.5 L! ADH is the water-conservation switch that determines how concentrated your urine will be.',
      as: 'ADH অবিহনে, আপুনি দৈনিক ১.৫ লি.-ৰ ঠাইত ২০ লিটাৰ পৰ্যন্ত তৰল মূত্ৰ উৎপন্ন কৰিব! ADH হৈছে পানী-সংৰক্ষণ চুইচ যিয়ে আপোনাৰ মূত্ৰ কিমান ঘনীভূত হ’ব নিৰ্ধাৰণ কৰে।',
    },
    disorders: {
      en: 'Nephrogenic DI (unresponsive to ADH), central DI (no ADH), SIADH',
      as: 'নেফ্ৰ‘জেনিক DI (ADH-লৈ সঁহাৰি নকৰে), চেণ্ট্ৰেল DI (ADH নাই), SIADH',
    },
    ncertNote: {
      en: 'NCERT: Collecting duct concentrates urine using medullary gradient + ADH. ADH (from posterior pituitary) = antidiuretic hormone → ↑ water reabsorption → concentrated urine.',
      as: 'NCERT: সংগ্ৰাহী নলিকাই মেডুলেৰী গ্ৰেডিয়েণ্ট + ADH-ৰ যোগেদি মূত্ৰ ঘনীভূত কৰে। ADH (পিছ পিটুইটেৰীৰ পৰা) = এণ্টিডায়ুৰেটিক হৰমোন → ↑ পানী পুনঃ অৱশোষণ → ঘনীভূত মূত্ৰ।',
    },
  },
  efferentArteriole: {
    id: 'efferentArteriole', color: '#f97316', glowColor: '#fb923c', category: 'nephron',
    name: { en: 'Efferent Arteriole', as: 'অপকেন্দ্ৰিক ধমনিকা' },
    role: { en: 'Carries blood away from glomerulus — narrower, maintains filtration pressure',
            as: 'গ্লমেৰুলাছৰ পৰা তেজ লৈ যায় — চুটি, ফিল্টাৰিং চাপ বজাই ৰাখে' },
    description: {
      en: 'Carries post-filtration blood away from the glomerulus. Narrower than the afferent arteriole, creating the back-pressure needed to maintain high glomerular capillary pressure. Branches into peritubular capillaries (cortex) or vasa recta (medulla).',
      as: 'গ্লমেৰুলাছৰ পৰা ফিল্টাৰিং-পিছৰ তেজ লৈ যায়। অভিকেন্দ্ৰিক ধমনিকাতকৈ চুটি, উচ্চ গ্লমেৰুলাৰ কেপিলেৰী চাপ বজাই ৰাখিবলৈ প্ৰয়োজনীয় উভতি যোৱা চাপ সৃষ্টি কৰে। পেৰিটিউবিউলাৰ কেপিলেৰী (কৰ্টেক্স) বা ভাছা ৰেক্টা (মেডুলা)-ত শাখায়িত হয়।',
    },
    functions: {
      en: ['Carries post-filtration blood from glomerulus', 'Narrower than afferent → maintains high glomerular pressure', 'Branches into peritubular capillaries (cortex) or vasa recta (medulla)', 'Post-filtration blood has higher protein concentration (proteins not filtered)'],
      as: ['গ্লমেৰুলাছৰ পৰা ফিল্টাৰিং-পিছৰ তেজ কঢ়িয়ায়', 'অভিকেন্দ্ৰিকতকৈ চুটি → উচ্চ গ্লমেৰুলাৰ চাপ বজাই ৰাখে', 'পেৰিটিউবিউলাৰ কেপিলেৰী (কৰ্টেক্স) বা ভাছা ৰেক্টা (মেডুলা)-ত শাখায়িত হয়', 'ফিল্টাৰিং-পিছৰ তেজত প্ৰটিন ঘনত্ব বেছি (প্ৰটিন ফিল্টাৰ নহয়)'],
    },
    keyFacts: {
      en: ['NARROWER than afferent → creates back-pressure → filtration continues', 'ACE inhibitors dilate efferent → ↓ GFR (reduces proteinuria in diabetes)', 'NSAIDs constrict afferent; ACEi dilate efferent — both ↓ GFR', 'Blood in efferent has higher oncotic pressure (proteins concentrated)'],
      as: ['অভিকেন্দ্ৰিকতকৈ চুটি → উভতি যোৱা চাপ সৃষ্টি কৰে → ফিল্টাৰিং চলি থাকে', 'ACE inhibitors-এ অপকেন্দ্ৰিকক ডাইলেট কৰে → ↓ GFR (মধুমেহত প্ৰটিনিউৰিয়া কমায়)', 'NSAIDs অভিকেন্দ্ৰিক চেপি ধৰে; ACEi অপকেন্দ্ৰিকক ডাইলেট কৰে — দুয়ো ↓ GFR', 'অপকেন্দ্ৰিকৰ তেজত অন্‌কটিক চাপ বেছি (প্ৰটিন ঘনীভূত)'],
    },
    examNotes: {
      en: ['Efferent NARROWER than afferent → maintains glomerular filtration pressure', 'ACE inhibitors dilate efferent arteriole → ↓ GFR → used for diabetic nephropathy', 'Efferent → peritubular caps (cortical nephrons) OR vasa recta (juxtamedullary)'],
      as: ['অপকেন্দ্ৰিক অভিকেন্দ্ৰিকতকৈ চুটি → গ্লমেৰুলাৰ ফিল্টাৰিং চাপ বজাই ৰাখে', 'ACE inhibitors-এ অপকেন্দ্ৰিক ধমনিকা ডাইলেট কৰে → ↓ GFR → মধুমেহজনিত নেফ্ৰ‘পেথীৰ বাবে ব্যৱহৃত', 'অপকেন্দ্ৰিক → পেৰিটিউবিউলাৰ কেপ (কৰ্টিকেল নেফ্ৰন) বা ভাছা ৰেক্টা (জাক্সটামেডুলেৰী)'],
    },
    funFact: {
      en: 'The efferent arteriole being narrower than the afferent creates a pressure bottleneck — blood can\'t easily escape the glomerulus, forcing the filtrate out at high pressure!',
      as: 'অপকেন্দ্ৰিক ধমনিকা অভিকেন্দ্ৰিকতকৈ চুটি হোৱাই চাপৰ এক বটলনেক সৃষ্টি কৰে — তেজে গ্লমেৰুলাছৰ পৰা সহজে ওলাব নোৱাৰে, ফিল্ট্ৰেটক উচ্চ চাপত বাহিৰ ঠেলি দিয়ে!',
    },
    disorders: {
      en: 'Affected by ACE inhibitors, ARBs, diabetes, hypertension',
      as: 'ACE inhibitors, ARB, মধুমেহ, উচ্চ ৰক্তচাপ দ্বাৰা প্ৰভাৱিত',
    },
    ncertNote: {
      en: 'Efferent arteriole carries filtered blood from glomerulus; narrower than afferent to maintain filtration pressure. → peritubular capillaries.',
      as: 'অপকেন্দ্ৰিক ধমনিকাই গ্লমেৰুলাছৰ পৰা ফিল্টাৰ কৰা তেজ লৈ যায়; ফিল্টাৰিং চাপ বজাই ৰাখিবলৈ অভিকেন্দ্ৰিকতকৈ চুটি। → পেৰিটিউবিউলাৰ কেপিলেৰীত যায়।',
    },
  },
  peritubularCapillaries: {
    id: 'peritubularCapillaries', color: '#3b82f6', glowColor: '#60a5fa', category: 'nephron',
    name: { en: 'Peritubular Capillaries / Vasa Recta', as: 'পেৰিটিউবিউলাৰ কেপিলেৰী / ভাছা ৰেক্টা' },
    role: { en: 'Reabsorb substances from tubular fluid back into bloodstream',
            as: 'নলিকা তৰলৰ পৰা পদাৰ্থ ৰক্তপ্ৰবাহলৈ পুনঃ অৱশোষণ' },
    description: {
      en: 'Low-pressure capillaries surrounding the renal tubules. High oncotic pressure draws reabsorbed water and solutes from the tubular fluid back into the circulation. Juxtamedullary nephrons have vasa recta — specialized loops that act as countercurrent exchangers preserving the medullary osmotic gradient.',
      as: 'বৃক্ক নলিকাবোৰক আগুৰি থকা কম চাপৰ কেপিলেৰী। উচ্চ অন্‌কটিক চাপে নলিকা তৰলৰ পৰা পুনঃ অৱশোষিত পানী আৰু দ্ৰৱ পৰিবহনলৈ টানি আনে। জাক্সটামেডুলেৰী নেফ্ৰনৰ ভাছা ৰেক্টা আছে — বিশেষীকৃত লুপ যিয়ে মেডুলেৰী অছমটিক গ্ৰেডিয়েণ্ট সংৰক্ষণ কৰি কাউন্টাৰকাৰেণ্ট বিনিময়ক ৰূপে কাম কৰে।',
    },
    functions: {
      en: ['Reabsorb water, glucose, amino acids, electrolytes from tubular fluid', 'Low hydrostatic + high oncotic pressure → favors reabsorption', 'Vasa recta: countercurrent exchanger preserving medullary gradient', 'Return reabsorbed substances to systemic circulation'],
      as: ['নলিকা তৰলৰ পৰা পানী, গ্লুকোজ, এমিনো এচিড, ইলেক্ট্ৰলাইট পুনঃ অৱশোষণ', 'কম হাইড্ৰ‘ষ্টেটিক + উচ্চ অন্‌কটিক চাপ → পুনঃ অৱশোষণৰ পক্ষে', 'ভাছা ৰেক্টা: মেডুলেৰী গ্ৰেডিয়েণ্ট সংৰক্ষণ কৰা কাউন্টাৰকাৰেণ্ট বিনিময়ক', 'পুনঃ অৱশোষিত পদাৰ্থ তন্ত্ৰগত পৰিবহনলৈ ঘুৰাই দিয়ে'],
    },
    keyFacts: {
      en: ['Low pressure (post-efferent) + high oncotic pressure → ideal for reabsorption', 'Peritubular capillaries in cortex: surround PCT and DCT', 'Vasa recta: long hairpin loops alongside Loop of Henle in medulla', 'Countercurrent exchange by vasa recta preserves medullary hyperosmolarity'],
      as: ['কম চাপ (পোষ্ট-অপকেন্দ্ৰিক) + উচ্চ অন্‌কটিক চাপ → পুনঃ অৱশোষণৰ বাবে আদৰ্শ', 'কৰ্টেক্সৰ পেৰিটিউবিউলাৰ কেপিলেৰী: PCT আৰু DCT-ক আগুৰি থাকে', 'ভাছা ৰেক্টা: মেডুলাত হেনলিৰ লুপৰ কাষে দীঘল হেয়াৰপিন লুপ', 'ভাছা ৰেক্টাৰ কাউন্টাৰকাৰেণ্ট বিনিময়ে মেডুলেৰী হাইপাৰঅছম‘লেৰিটি সংৰক্ষণ কৰে'],
    },
    examNotes: {
      en: ['Peritubular capillaries absorb reabsorbed substances from PCT/DCT', 'Low pressure → absorption; high oncotic pressure (concentrated proteins) → absorption', 'Vasa recta = countercurrent exchanger (maintains medullary concentration gradient)', 'Together with Loop of Henle forms the countercurrent multiplication/exchange system'],
      as: ['পেৰিটিউবিউলাৰ কেপিলেৰীয়ে PCT/DCT-ৰ পৰা পুনঃ অৱশোষিত পদাৰ্থ অৱশোষণ কৰে', 'কম চাপ → অৱশোষণ; উচ্চ অন্‌কটিক চাপ (ঘনীভূত প্ৰটিন) → অৱশোষণ', 'ভাছা ৰেক্টা = কাউন্টাৰকাৰেণ্ট বিনিময়ক (মেডুলেৰী ঘনত্ব গ্ৰেডিয়েণ্ট বজাই ৰাখে)', 'হেনলিৰ লুপৰ সৈতে মিলি কাউন্টাৰকাৰেণ্ট গুণন/বিনিময় ব্যৱস্থা গঠন কৰে'],
    },
    funFact: {
      en: 'The vasa recta run parallel to the Loop of Henle in a hairpin arrangement — blood flowing down and up exchanges solutes just enough to preserve the kidney\'s concentration gradient without washing it away!',
      as: 'ভাছা ৰেক্টা হেনলিৰ লুপৰ সমান্তৰালে হেয়াৰপিন বিন্যাসত চলে — তললৈ আৰু ওপৰলৈ যোৱা তেজে দ্ৰৱ ইমান বিনিময় কৰে যিমান বৃক্কৰ ঘনত্ব গ্ৰেডিয়েণ্ট ধুই নিদিয়াকৈ সংৰক্ষণ কৰিব পাৰে!',
    },
    disorders: {
      en: 'Sickle cell disease (vasa recta infarction → papillary necrosis)',
      as: 'ছিকল চেল ৰোগ (ভাছা ৰেক্টা ইনফাৰ্কচন → পেপিলেৰী নেক্ৰছিছ)',
    },
    ncertNote: {
      en: 'Peritubular capillaries/vasa recta reabsorb substances from tubular fluid back into blood. Vasa recta = countercurrent exchanger maintaining medullary gradient.',
      as: 'পেৰিটিউবিউলাৰ কেপিলেৰী/ভাছা ৰেক্টাই নলিকা তৰলৰ পৰা পদাৰ্থ পুনৰ তেজলৈ অৱশোষণ কৰে। ভাছা ৰেক্টা = মেডুলেৰী গ্ৰেডিয়েণ্ট বজাই ৰখা কাউন্টাৰকাৰেণ্ট বিনিময়ক।',
    },
  },
};

export const SYSTEM_JOURNEY: JourneyStep[] = [
  { x: 252, y: 130, structureId: 'aorta', view: 'system',
    stage: { en: 'Abdominal Aorta', as: 'উদৰীয় মহাধমনী' },
    shortNote: { en: 'Oxygenated blood carrying metabolic wastes arrives via the abdominal aorta.',
                 as: 'বিপাকীয় বৰ্জ্য বহন কৰা অক্সিজেনযুক্ত তেজ উদৰীয় মহাধমনীৰ যোগেদি আহি পায়।' } },
  { x: 200, y: 252, structureId: 'renalArtery', view: 'system',
    stage: { en: 'Renal Artery', as: 'বৃক্ক ধমনী' },
    shortNote: { en: 'Renal artery delivers 20-25% of cardiac output (~1200 mL/min) to both kidneys.',
                 as: 'বৃক্ক ধমনীয়ে কাৰ্ডিয়াক আউটপুটৰ ২০-২৫% (~১২০০ মি.লি./মিনিট) দুয়োটা বৃক্কলৈ পঠিয়ায়।' } },
  { x: 150, y: 265, structureId: 'kidneys', view: 'system',
    stage: { en: 'Kidney Filtration', as: 'বৃক্ক ফিল্টাৰিং' },
    shortNote: { en: '~1 million nephrons filter blood at GFR 125 mL/min. Urine formation begins.',
                 as: '~১০ লাখ নেফ্ৰনে GFR ১২৫ মি.লি./মিনিটত তেজ ফিল্টাৰ কৰে। মূত্ৰ গঠন আৰম্ভ।' } },
  { x: 210, y: 140, structureId: 'glomerulus', view: 'nephron',
    stage: { en: 'Glomerular Filtration', as: 'গ্লমেৰুলাৰ ফিল্টাৰিং' },
    shortNote: { en: 'Ultrafiltration: blood filtered under 60 mmHg pressure. 180 L/day filtrate formed.',
                 as: 'অতি-ফিল্টাৰিং: ৬০ mmHg চাপত তেজ ফিল্টাৰ। দৈনিক ১৮০ লি. ফিল্ট্ৰেট গঠিত।' } },
  { x: 270, y: 295, structureId: 'proximalConvolutedTubule', view: 'nephron',
    stage: { en: 'PCT Reabsorption', as: 'PCT পুনঃ অৱশোষণ' },
    shortNote: { en: '65-70% of Na⁺/water reabsorbed. 100% glucose and amino acids recovered.',
                 as: 'Na⁺/পানীৰ ৬৫-৭০% পুনঃ অৱশোষিত। গ্লুকোজ আৰু এমিনো এচিডৰ ১০০% পুনৰ লোৱা।' } },
  { x: 278, y: 480, structureId: 'loopOfHenle', view: 'nephron',
    stage: { en: 'Loop of Henle', as: 'হেনলিৰ লুপ' },
    shortNote: { en: 'Countercurrent multiplier creates 300→1200 mOsm medullary gradient.',
                 as: 'কাউন্টাৰকাৰেণ্ট গুণকে ৩০০→১২০০ mOsm মেডুলেৰী গ্ৰেডিয়েণ্ট সৃষ্টি কৰে।' } },
  { x: 430, y: 345, structureId: 'distalConvolutedTubule', view: 'nephron',
    stage: { en: 'DCT Fine-tuning', as: 'DCT সূক্ষ্ম-নিয়ন্ত্ৰণ' },
    shortNote: { en: 'Aldosterone regulates Na⁺/K⁺. PTH regulates Ca²⁺. Selective secretion.',
                 as: 'এলডোষ্টেৰনে Na⁺/K⁺ নিয়ন্ত্ৰণ কৰে। PTH-এ Ca²⁺ নিয়ন্ত্ৰণ। বাছনীয় ক্ষৰণ।' } },
  { x: 515, y: 440, structureId: 'collectingDuct', view: 'nephron',
    stage: { en: 'Collecting Duct', as: 'সংগ্ৰাহী নলিকা' },
    shortNote: { en: 'ADH-driven water reabsorption. Final urine concentrated to ~1.5 L/day.',
                 as: 'ADH-চালিত পানী পুনঃ অৱশোষণ। অন্তিম মূত্ৰ দৈনিক ~১.৫ লি.-লৈ ঘনীভূত।' } },
  { x: 155, y: 360, structureId: 'ureter', view: 'system',
    stage: { en: 'Ureter Transport', as: 'মূত্ৰনালী পৰিবহন' },
    shortNote: { en: 'Urine travels from renal pelvis via peristaltic contractions through the ureter.',
                 as: 'মূত্ৰ বৃক্ক পেলভিছৰ পৰা ক্ৰম-সংকোচনৰ যোগেদি মূত্ৰনালীৰ মাজেৰে যায়।' } },
  { x: 268, y: 495, structureId: 'bladder', view: 'system',
    stage: { en: 'Bladder Storage', as: 'মূত্ৰাশয় সংৰক্ষণ' },
    shortNote: { en: 'Urine stored (300-600 mL) until micturition — voluntary sphincter control.',
                 as: 'মূত্ৰত্যাগৰ আগলৈকে মূত্ৰ সংৰক্ষিত (৩০০-৬০০ মি.লি.) — স্বেচ্ছামূলক ছফিংটাৰ নিয়ন্ত্ৰণ।' } },
  { x: 268, y: 578, structureId: 'urethra', view: 'system',
    stage: { en: 'Excretion Complete!', as: 'বৰ্জন সম্পূৰ্ণ!' },
    shortNote: { en: 'Urine expelled via urethra. Metabolic wastes removed from body. Cycle repeats!',
                 as: 'মূত্ৰদ্বাৰৰ যোগেদি মূত্ৰ বাহিৰ। শৰীৰৰ পৰা বিপাকীয় বৰ্জ্য আঁতৰোৱা। চক্ৰ পুনৰাবৃত্তি!' } },
];

export const QUIZ_DATA: QuizQ[] = [
  {
    q: { en: 'What is the functional unit of the kidney?',
         as: 'বৃক্কৰ কাৰ্যকৰী একক কি?' },
    opts: { en: ['Neuron', 'Nephron', 'Glomerulus', 'Collecting duct'],
            as: ['নিউৰন', 'নেফ্ৰন', 'গ্লমেৰুলাছ', 'সংগ্ৰাহী নলিকা'] },
    ans: 1,
    explanation: { en: 'The nephron is the structural and functional unit of the kidney. Each kidney has ~1 million nephrons. Each nephron performs: filtration (glomerulus) → reabsorption (PCT) → secretion (DCT) → excretion (collecting duct).',
                   as: 'নেফ্ৰন হৈছে বৃক্কৰ গাঠনিক আৰু কাৰ্যকৰী একক। প্ৰতিটো বৃক্কত ~১০ লাখ নেফ্ৰন আছে। প্ৰতিটো নেফ্ৰনে কৰে: ফিল্টাৰিং (গ্লমেৰুলাছ) → পুনঃ অৱশোষণ (PCT) → ক্ষৰণ (DCT) → বৰ্জন (সংগ্ৰাহী নলিকা)।' },
  },
  {
    q: { en: 'What is the normal Glomerular Filtration Rate (GFR) in adults?',
         as: 'প্ৰাপ্তবয়স্কৰ স্বাভাৱিক গ্লমেৰুলাৰ ফিল্ট্ৰেচন ৰেট (GFR) কিমান?' },
    opts: { en: ['50 mL/min', '80 mL/min', '125 mL/min', '200 mL/min'],
            as: ['৫০ মি.লি./মিনিট', '৮০ মি.লি./মিনিট', '১২৫ মি.লি./মিনিট', '২০০ মি.লি./মিনিট'] },
    ans: 2,
    explanation: { en: 'GFR = 125 mL/min (180 L/day). Despite filtering 180 L, only ~1.5 L becomes urine as 99% is reabsorbed. GFR is the key clinical measure of kidney function.',
                   as: 'GFR = ১২৫ মি.লি./মিনিট (দৈনিক ১৮০ লি.)। ১৮০ লি. ফিল্টাৰ হোৱাৰ পিছতো, মাত্ৰ ~১.৫ লি. মূত্ৰ হয় কাৰণ ৯৯% পুনৰ অৱশোষিত হয়। GFR হৈছে বৃক্ক কাৰ্যৰ মুখ্য চিকিৎসা পৰিমাপ।' },
  },
  {
    q: { en: 'Which substance is 100% reabsorbed from the filtrate in a healthy person?',
         as: 'এজন সুস্থ মানুহৰ ফিল্ট্ৰেটৰ পৰা ১০০% পুনৰ অৱশোষিত হোৱা পদাৰ্থ কোনটো?' },
    opts: { en: ['Urea', 'Creatinine', 'Glucose', 'Sodium'],
            as: ['ইউৰিয়া', 'ক্ৰিয়েটিনিন', 'গ্লুকোজ', 'চ‘ডিয়াম'] },
    ans: 2,
    explanation: { en: 'Glucose is completely reabsorbed in the PCT via SGLT2 cotransporters (below the renal threshold of 180 mg/dL). Above this threshold → glycosuria (glucose in urine) — a key sign of diabetes mellitus.',
                   as: 'গ্লুকোজ SGLT2 কোট্ৰান্সপোৰ্টাৰৰ যোগেদি PCT-ত সম্পূৰ্ণৰূপে পুনঃ অৱশোষিত হয় (১৮০ মিগ্ৰা/ডিলিৰ বৃক্ক থ্ৰেছহোল্ডৰ তলত)। এই থ্ৰেছহোল্ডৰ ওপৰত → গ্লাইকোছুৰিয়া (মূত্ৰত গ্লুকোজ) — মধুমেহৰ মুখ্য চিন।' },
  },
  {
    q: { en: 'ADH (antidiuretic hormone) acts on which structure to concentrate urine?',
         as: 'ADH (এণ্টিডায়ুৰেটিক হৰমোন)-এ মূত্ৰ ঘনীভূত কৰিবলৈ কোন গঠনত ক্ৰিয়া কৰে?' },
    opts: { en: ['Glomerulus', 'PCT', 'Loop of Henle', 'Collecting duct'],
            as: ['গ্লমেৰুলাছ', 'PCT', 'হেনলিৰ লুপ', 'সংগ্ৰাহী নলিকা'] },
    ans: 3,
    explanation: { en: 'ADH (vasopressin) from the posterior pituitary acts on collecting duct principal cells, inserting AQP2 water channels → water reabsorption → concentrated urine. Absence of ADH → diabetes insipidus (20 L/day dilute urine).',
                   as: 'পিছ পিটুইটেৰীৰ ADH (ভাছোপ্ৰেছিন)-এ সংগ্ৰাহী নলিকা প্ৰিন্সিপাল কোষত ক্ৰিয়া কৰে, AQP2 পানী চেনেল সন্নিৱেশ কৰে → পানী পুনঃ অৱশোষণ → ঘনীভূত মূত্ৰ। ADH নাথাকিলে → ডায়েবেটিছ ইনছিপিডাছ (দৈনিক ২০ লি. তৰল মূত্ৰ)।' },
  },
  {
    q: { en: 'The descending limb of Loop of Henle is:',
         as: 'হেনলিৰ লুপৰ অৱৰোহী লুপ হ’ল:' },
    opts: { en: ['Water impermeable, pumps Na⁺', 'Water permeable, salt impermeable', 'Permeable to both water and salts', 'Impermeable to both'],
            as: ['পানী অপ্ৰৱেশযোগ্য, Na⁺ পাম্প কৰে', 'পানী প্ৰৱেশযোগ্য, লৱণ অপ্ৰৱেশযোগ্য', 'পানী আৰু লৱণ দুয়োৰে বাবে প্ৰৱেশযোগ্য', 'দুয়োৰে বাবে অপ্ৰৱেশযোগ্য'] },
    ans: 1,
    explanation: { en: 'Descending limb: permeable to water (AQP1), impermeable to NaCl → water exits by osmosis into the hypertonic medulla. Thick ascending limb: water-IMPERMEABLE but pumps out Na⁺/K⁺/Cl⁻ via NKCC2 → builds medullary gradient.',
                   as: 'অৱৰোহী লুপ: পানীৰ বাবে প্ৰৱেশযোগ্য (AQP1), NaCl-ৰ বাবে অপ্ৰৱেশযোগ্য → অছমছিচৰ যোগেদি পানী হাইপাৰট‘নিক মেডুলালৈ ওলায়। মোটা আৰোহী লুপ: পানী-অপ্ৰৱেশযোগ্য কিন্তু NKCC2-ৰ যোগেদি Na⁺/K⁺/Cl⁻ বাহিৰ পাম্প কৰে → মেডুলেৰী গ্ৰেডিয়েণ্ট গঠন কৰে।' },
  },
  {
    q: { en: 'Aldosterone acts on which part of the nephron?',
         as: 'এলডোষ্টেৰনে নেফ্ৰনৰ কোন অংশত ক্ৰিয়া কৰে?' },
    opts: { en: ['Glomerulus', 'PCT', 'Loop of Henle', 'DCT and Collecting duct'],
            as: ['গ্লমেৰুলাছ', 'PCT', 'হেনলিৰ লুপ', 'DCT আৰু সংগ্ৰাহী নলিকা'] },
    ans: 3,
    explanation: { en: 'Aldosterone (mineralocorticoid from adrenal cortex) acts on DCT and collecting duct: increases Na⁺ reabsorption (ENaC channels) and increases K⁺ secretion. Regulates blood pressure and potassium balance.',
                   as: 'এলডোষ্টেৰন (এড্ৰিনেল কৰ্টেক্সৰ মিনাৰেলকৰ্টিকয়েড)-এ DCT আৰু সংগ্ৰাহী নলিকাত ক্ৰিয়া কৰে: Na⁺ পুনঃ অৱশোষণ বঢ়ায় (ENaC চেনেল) আৰু K⁺ ক্ষৰণ বঢ়ায়। ৰক্তচাপ আৰু পটাছিয়াম ভাৰসাম্য নিয়ন্ত্ৰণ কৰে।' },
  },
  {
    q: { en: 'In a healthy kidney, which component of blood CANNOT pass through the glomerular filter?',
         as: 'এটা সুস্থ বৃক্কত, তেজৰ কোন অংশ গ্লমেৰুলাৰ ফিল্টাৰৰ মাজেৰে যাব নোৱাৰে?' },
    opts: { en: ['Urea', 'Glucose', 'Creatinine', 'Plasma albumin'],
            as: ['ইউৰিয়া', 'গ্লুকোজ', 'ক্ৰিয়েটিনিন', 'প্লাজমা এলবুমিন'] },
    ans: 3,
    explanation: { en: 'Plasma albumin (~69 kDa) cannot pass through the glomerular filtration barrier due to its large size and negative charge. Urea, glucose, creatinine (small molecules) freely pass. Protein in urine (proteinuria) = sign of glomerular damage.',
                   as: 'প্লাজমা এলবুমিন (~৬৯ kDa) তাৰ ডাঙৰ আকাৰ আৰু ঋণাত্মক চাৰ্জৰ বাবে গ্লমেৰুলাৰ ফিল্টাৰিং বাধাৰ মাজেৰে যাব নোৱাৰে। ইউৰিয়া, গ্লুকোজ, ক্ৰিয়েটিনিন (সৰু অণু) মুক্তভাৱে যায়। মূত্ৰত প্ৰটিন (প্ৰটিনিউৰিয়া) = গ্লমেৰুলাৰ ক্ষতিৰ চিন।' },
  },
  {
    q: { en: 'Loop diuretics (furosemide) work by blocking which transporter?',
         as: 'লুপ ডায়ুৰেটিক (ফিউৰোছেমাইড)-এ কোন ট্ৰান্সপোৰ্টাৰ ৰোধ কৰি কাম কৰে?' },
    opts: { en: ['SGLT2 in PCT', 'NCC in DCT', 'NKCC2 in thick ascending limb', 'AQP2 in collecting duct'],
            as: ['PCT-ত SGLT2', 'DCT-ত NCC', 'মোটা আৰোহী লুপত NKCC2', 'সংগ্ৰাহী নলিকাত AQP2'] },
    ans: 2,
    explanation: { en: 'Furosemide blocks NKCC2 (Na-K-2Cl cotransporter) in the thick ascending limb of Loop of Henle. This prevents NaCl reabsorption, reduces the medullary gradient, and increases urine output. Used for edema, heart failure, hypertension.',
                   as: 'ফিউৰোছেমাইডে হেনলিৰ লুপৰ মোটা আৰোহী লুপত NKCC2 (Na-K-2Cl কোট্ৰান্সপোৰ্টাৰ) ৰোধ কৰে। ই NaCl পুনঃ অৱশোষণ ৰোধ কৰে, মেডুলেৰী গ্ৰেডিয়েণ্ট কমায়, আৰু মূত্ৰ আউটপুট বঢ়ায়। শোথ, হৃদ ব্যৰ্থতা, উচ্চ ৰক্তচাপৰ বাবে ব্যৱহৃত।' },
  },
  {
    q: { en: 'Bowman\'s capsule + Glomerulus is called:',
         as: 'বোমেনৰ প্ৰকোষ্ঠ + গ্লমেৰুলাছক কি বুলি কোৱা হয়?' },
    opts: { en: ['Juxtaglomerular apparatus', 'Renal corpuscle (Malpighian body)', 'Renal pyramid', 'Juxtaglomerular complex'],
            as: ['জাক্সটাগ্লমেৰুলাৰ যন্ত্ৰ', 'বৃক্ক কৰ্পাছ্‌ল (মাল্পিজিয়ান বডি)', 'বৃক্ক পিৰামিড', 'জাক্সটাগ্লমেৰুলাৰ কমপ্লেক্স'] },
    ans: 1,
    explanation: { en: 'Bowman\'s capsule + Glomerulus = Renal Corpuscle, also called the Malpighian body. This is the site of ultrafiltration. Together with the renal tubule (PCT + Loop of Henle + DCT + CD), it forms the complete nephron.',
                   as: 'বোমেনৰ প্ৰকোষ্ঠ + গ্লমেৰুলাছ = বৃক্ক কৰ্পাছ্‌ল, মাল্পিজিয়ান বডিও কোৱা হয়। এইটোৱে অতি-ফিল্টাৰিংৰ স্থান। বৃক্ক নলিকা (PCT + হেনলিৰ লুপ + DCT + CD)-ৰ সৈতে মিলি, ই সম্পূৰ্ণ নেফ্ৰন গঠন কৰে।' },
  },
  {
    q: { en: 'Which of the following is NOT an excretory organ in humans?',
         as: 'নিম্নলিখিত কোনটো মানুহৰ বৰ্জ্যনিষ্কাষণ অংগ নহয়?' },
    opts: { en: ['Kidney', 'Skin', 'Liver', 'Spleen'],
            as: ['বৃক্ক', 'ছাল', 'যকৃৎ', 'প্লীহা'] },
    ans: 3,
    explanation: { en: 'The spleen is NOT an excretory organ — it filters blood and destroys old RBCs but does not excrete metabolic wastes. Excretory organs: Kidneys (urea/uric acid), Skin (sweat — salts, urea), Liver (bilirubin via bile), Lungs (CO₂, water vapour).',
                   as: 'প্লীহা বৰ্জ্যনিষ্কাষণ অংগ নহয় — ই তেজ ফিল্টাৰ কৰে আৰু পুৰণা RBC ধ্বংস কৰে কিন্তু বিপাকীয় বৰ্জ্য নিষ্কাষণ নকৰে। বৰ্জ্যনিষ্কাষণ অংগ: বৃক্ক (ইউৰিয়া/ইউৰিক এচিড), ছাল (ঘাম — লৱণ, ইউৰিয়া), যকৃৎ (পিত্তৰ যোগেদি বিলিৰুবিন), হাঁওফাঁও (CO₂, পানীৰ ভাপ)।' },
  },
];
