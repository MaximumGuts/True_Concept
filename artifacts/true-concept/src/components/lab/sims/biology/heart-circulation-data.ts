import type { BilingualField } from "@/lib/i18n";

/**
 * Heart & blood circulation data — bilingual (English + Assamese).
 * Source: NCERT Class IX/X Biology Assamese edition; Assamese cardiology
 * terminology from Vigyan Bharati glossary. NCERT-preferred terms:
 * অলিন্দ (atrium), নিলয় (ventricle), কপাটিকা (valve), মহাধমনী (aorta),
 * হৃদপিণ্ড (heart), দ্বৈত পৰিবহন (double circulation).
 */
export interface StructureData {
  id: string;
  name: BilingualField<string>;
  color: string;
  glowColor: string;
  bloodType: 'oxygenated' | 'deoxygenated' | 'both' | 'none';
  role: BilingualField<string>;
  description: BilingualField<string>;
  functions: BilingualField<string[]>;
  keyFacts: BilingualField<string[]>;
  examNotes: BilingualField<string[]>;
  funFact: BilingualField<string>;
  disorders: BilingualField<string>;
  circulationNote: BilingualField<string>;
}

export interface QuizQ {
  q: BilingualField<string>;
  opts: BilingualField<string[]>;
  ans: number;
  explanation: BilingualField<string>;
}

export interface JourneyStep {
  x: number; y: number; structureId: string;
  stage: BilingualField<string>;
  shortNote: BilingualField<string>;
}

export const STRUCTURES: Record<string, StructureData> = {
  rightAtrium: {
    id: 'rightAtrium', color: '#3868d0', glowColor: '#5888f0', bloodType: 'deoxygenated',
    name: { en: 'Right Atrium (RA)', as: 'সোঁ অলিন্দ (RA)' },
    role: { en: 'Receives deoxygenated blood from entire body (SVC + IVC)',
            as: 'সমগ্ৰ শৰীৰৰ পৰা অক্সিজেনবিহীন তেজ গ্ৰহণ কৰে (SVC + IVC)' },
    description: {
      en: 'The right atrium is the upper-right chamber of the heart. Thin-walled, it serves as a collection reservoir for deoxygenated blood returning from the body via the superior and inferior vena cavae, then delivers it to the right ventricle.',
      as: 'সোঁ অলিন্দ হৈছে হৃদপিণ্ডৰ ওপৰৰ-সোঁ প্ৰকোষ্ঠ। পাতল গাৰে ই ঊৰ্ধ্ব আৰু অধঃ মহাশিৰাৰ যোগেদি শৰীৰৰ পৰা ঘূৰি অহা অক্সিজেনবিহীন তেজৰ সংগ্ৰহ ভঁৰাল ৰূপে কাম কৰে, তাৰ পিছত সোঁ নিলয়লৈ দিয়ে।',
    },
    functions: {
      en: [
        'Receives deoxygenated blood from SVC (upper body) and IVC (lower body)',
        'Passes blood to right ventricle through the tricuspid valve',
        'Houses the SA node (sinoatrial node) — the natural pacemaker',
        'Also receives coronary sinus blood (deoxygenated blood from heart muscle itself)',
      ],
      as: [
        'SVC (ওপৰৰ অংশ) আৰু IVC (তলৰ অংশ)-ৰ পৰা অক্সিজেনবিহীন তেজ গ্ৰহণ কৰে',
        'ত্ৰিৰূপ কপাটিকাৰ যোগেদি তেজ সোঁ নিলয়লৈ পঠিয়ায়',
        'SA নড (চাইন‘এট্ৰিয়েল নড) ৰাখে — প্ৰাকৃতিক হৃদ-স্পন্দক',
        'কৰোনাৰী চাইনাছৰ তেজো গ্ৰহণ কৰে (হৃৎপেশীৰ পৰা অহা অক্সিজেনবিহীন তেজ)',
      ],
    },
    keyFacts: {
      en: [
        'Thin walls (no high-pressure pumping needed)',
        'SA node in RA wall generates electrical impulse → initiates heartbeat',
        'Coronary sinus opens into RA (returns blood used by heart muscle)',
        'Contains the fossa ovalis (remnant of fetal foramen ovale)',
      ],
      as: [
        'পাতল গা (উচ্চ চাপৰ পাম্পিং নালাগে)',
        'RA গাৰ SA নডে বৈদ্যুতিক উদ্দীপ্ত উৎপন্ন কৰে → হৃদ-স্পন্দন আৰম্ভ',
        'কৰোনাৰী চাইনাছ RA-ত মুকলি হয় (হৃৎপেশীৰ ব্যৱহৃত তেজ ঘুৰাই আনে)',
        'ফোছা ওভালিছ থাকে (ভ্ৰূণৰ ফোৰামেন ওভেলৰ অৱশেষ)',
      ],
    },
    examNotes: {
      en: [
        'RA receives blood from SVC (upper body) + IVC (lower body) + coronary sinus',
        'SA node (sinoatrial node) in RA wall = pacemaker of heart — generates impulse 72/min',
        'Tricuspid valve (3 cusps) separates RA from RV',
        'Atrial systole: RA contracts, pushes blood into RV through open tricuspid valve',
        'Fossa ovalis: depression in interatrial septum, remnant of foramen ovale (fetal circulation)',
      ],
      as: [
        'RA-এ SVC (ওপৰৰ অংশ) + IVC (তলৰ অংশ) + কৰোনাৰী চাইনাছৰ পৰা তেজ পায়',
        'RA গাৰ SA নড (চাইন‘এট্ৰিয়েল নড) = হৃদপিণ্ডৰ হৃদ-স্পন্দক — মিনিটত ৭২ বাৰ উদ্দীপ্ত',
        'ত্ৰিৰূপ কপাটিকা (৩ পত্ৰিকা)-এ RA-ক RV-ৰ পৰা পৃথক কৰে',
        'অলিন্দ চিষ্টোল: RA সংকোচিত হয়, খোলা ত্ৰিৰূপ কপাটিকাৰ যোগেদি তেজ RV-লৈ ঠেলি দিয়ে',
        'ফোছা ওভালিছ: অলিন্দ-মধ্যৱৰ্তী পট্টৰ গভীৰতা, ভ্ৰূণৰ ফোৰামেন ওভেলৰ অৱশেষ',
      ],
    },
    funFact: {
      en: 'The SA node in your right atrium fires over 100,000 times per day, generating the electrical signal that starts every single heartbeat for your entire life!',
      as: 'আপোনাৰ সোঁ অলিন্দৰ SA নডে দৈনিক ১,০০,০০০-তকৈ অধিক বাৰ উদ্দীপ্ত হয়, আপোনাৰ গোটেই জীৱনৰ প্ৰতিটো হৃদ-স্পন্দন আৰম্ভ কৰা বৈদ্যুতিক সংকেত উৎপন্ন কৰে!',
    },
    disorders: {
      en: 'Atrial fibrillation (AF), atrial flutter, ASD (atrial septal defect), sick sinus syndrome',
      as: 'অলিন্দ ফিব্ৰিলেচন (AF), অলিন্দ ফ্লাটাৰ, ASD (অলিন্দ পট্ট ত্ৰুটি), ছিক চাইনাছ ছিনড্ৰম',
    },
    circulationNote: {
      en: 'Deoxygenated blood from the entire body arrives here. The SA node fires, the RA contracts, and blood is pushed through the tricuspid valve into the right ventricle. This is the START of pulmonary circulation.',
      as: 'সমগ্ৰ শৰীৰৰ অক্সিজেনবিহীন তেজ ইয়াত আহি পায়। SA নড উদ্দীপ্ত হয়, RA সংকোচিত হয়, আৰু ত্ৰিৰূপ কপাটিকাৰ যোগেদি তেজ সোঁ নিলয়লৈ ঠেলি দিয়ে। এইটোৱেই ফুসফুসীয় পৰিবহনৰ আৰম্ভণি।',
    },
  },

  rightVentricle: {
    id: 'rightVentricle', color: '#2758b8', glowColor: '#4878d8', bloodType: 'deoxygenated',
    name: { en: 'Right Ventricle (RV)', as: 'সোঁ নিলয় (RV)' },
    role: { en: 'Pumps deoxygenated blood to lungs via pulmonary artery',
            as: 'ফুসফুসীয় ধমনীৰ যোগেদি অক্সিজেনবিহীন তেজ হাঁওফাঁওলৈ পাম্প কৰে' },
    description: {
      en: 'The right ventricle is the lower-right chamber, with thinner walls than the left ventricle (pumps against lower pressure to nearby lungs). It receives blood from the RA and forcefully ejects it into the pulmonary trunk during ventricular systole.',
      as: 'সোঁ নিলয় হৈছে তলৰ-সোঁ প্ৰকোষ্ঠ, বাওঁ নিলয়তকৈ পাতল গাৰে (ওচৰৰ হাঁওফাঁওলৈ কম চাপত পাম্প কৰে)। ই RA-ৰ পৰা তেজ পায় আৰু নিলয় চিষ্টোলৰ সময়ত বলেৰে ফুসফুসীয় ট্ৰাঙ্কলৈ ঠেলি পঠিয়ায়।',
    },
    functions: {
      en: [
        'Receives deoxygenated blood from right atrium via tricuspid valve',
        'Pumps blood into pulmonary trunk/artery under ~25 mmHg pressure',
        'Drives pulmonary circulation (to the lungs)',
        'Contracts simultaneously with the left ventricle during systole',
      ],
      as: [
        'ত্ৰিৰূপ কপাটিকাৰ যোগেদি সোঁ অলিন্দৰ পৰা অক্সিজেনবিহীন তেজ গ্ৰহণ কৰে',
        '~২৫ mmHg চাপত ফুসফুসীয় ট্ৰাঙ্ক/ধমনীলৈ তেজ পাম্প কৰে',
        'ফুসফুসীয় পৰিবহন চলায় (হাঁওফাঁওলৈ)',
        'চিষ্টোলৰ সময়ত বাওঁ নিলয়ৰ লগতে একে সময়ত সংকোচিত হয়',
      ],
    },
    keyFacts: {
      en: [
        'Less muscular than left ventricle (pumps only to lungs — lower resistance)',
        'Pulmonary valve (semilunar) at RV outlet prevents backflow',
        'Contains moderator band (septomarginal trabecula)',
        'Papillary muscles + chordae tendineae prevent tricuspid valve eversion',
        'Crescent-shaped cross-section (wraps around LV)',
      ],
      as: [
        'বাওঁ নিলয়তকৈ কম পেশীযুক্ত (কেৱল হাঁওফাঁওলৈ পাম্প কৰে — কম প্ৰতিৰোধ)',
        'RV-ৰ মুখত ফুসফুসীয় কপাটিকা (অৰ্ধচন্দ্ৰাকৃতি)-এ উভতি অহা ৰোধ কৰে',
        'মড‘ৰেটৰ বেণ্ড থাকে (চেপ্টোমাৰ্জিনেল ট্ৰাবেকুলা)',
        'পেপিলেৰী পেশী + ক‘ৰ্ডি টেণ্ডিনিৰে ত্ৰিৰূপ কপাটিকাৰ উলটিযোৱা ৰোধ কৰে',
        'অৰ্ধচন্দ্ৰাকৃতি ক্ৰছ-চেকচন (LV-ৰ চাৰিওফালে আগুৰে)',
      ],
    },
    examNotes: {
      en: [
        'RV pumps blood to lungs via pulmonary artery (deoxygenated blood)',
        'Pulmonary circulation: RV → Pulmonary Artery → Lungs → Pulmonary Vein → LA',
        'RV wall is thinner than LV (3× difference) — pumps against lower resistance',
        'During ventricular systole: tricuspid valve CLOSES (Lubb sound, S1); pulmonary valve OPENS',
        'Pulmonary valve closes during diastole (Dubb sound, S2, along with aortic valve)',
      ],
      as: [
        'RV-এ ফুসফুসীয় ধমনীৰ যোগেদি হাঁওফাঁওলৈ তেজ পাম্প কৰে (অক্সিজেনবিহীন তেজ)',
        'ফুসফুসীয় পৰিবহন: RV → ফুসফুসীয় ধমনী → হাঁওফাঁও → ফুসফুসীয় শিৰা → LA',
        'RV গা LV-তকৈ পাতল (৩× পাৰ্থক্য) — কম প্ৰতিৰোধৰ বিৰুদ্ধে পাম্প কৰে',
        'নিলয় চিষ্টোলৰ সময়ত: ত্ৰিৰূপ কপাটিকা বন্ধ (লাব শব্দ, S1); ফুসফুসীয় কপাটিকা খোলে',
        'ফুসফুসীয় কপাটিকা ডায়াষ্টোলৰ সময়ত বন্ধ হয় (ডাব শব্দ, S2, মহাধমনী কপাটিকাৰ লগতে)',
      ],
    },
    funFact: {
      en: 'The right ventricle ejects blood at only about 25 mmHg — the equivalent pressure of blowing air through a straw. The left ventricle does the same job but at 5× the pressure!',
      as: 'সোঁ নিলয়ে মাত্ৰ ~২৫ mmHg চাপত তেজ ছাড়ি দিয়ে — খেৰৰ পাইপৰ মাজেৰে বতাহ ফুঁ মাৰাৰ সমপৰিমাণ চাপ। বাওঁ নিলয়ে একে কাম কৰে কিন্তু ৫× চাপত!',
    },
    disorders: {
      en: 'Right heart failure, pulmonary hypertension, tetralogy of Fallot, pulmonary valve stenosis',
      as: 'সোঁ হৃদ ব্যৰ্থতা, ফুসফুসীয় উচ্চ ৰক্তচাপ, টেট্ৰালজী অফ ফেলট, ফুসফুসীয় কপাটিকা ষ্টেনচিছ',
    },
    circulationNote: {
      en: 'Blood fills the RV from the RA. Ventricular systole: the RV contracts powerfully, tricuspid valve snaps shut (producing the "Lubb" sound), and the pulmonary valve opens — ejecting deoxygenated blood into the pulmonary trunk toward the lungs.',
      as: 'RA-ৰ পৰা তেজ RV ভৰাই দিয়ে। নিলয় চিষ্টোল: RV শক্তিশালীভাৱে সংকোচিত হয়, ত্ৰিৰূপ কপাটিকা বন্ধ হৈ যায় ("লাব" শব্দ উৎপন্ন কৰি), আৰু ফুসফুসীয় কপাটিকা খোলে — অক্সিজেনবিহীন তেজ ফুসফুসীয় ট্ৰাঙ্কৰ যোগেদি হাঁওফাঁওলৈ ছাড়ি দিয়ে।',
    },
  },

  leftAtrium: {
    id: 'leftAtrium', color: '#c83030', glowColor: '#e85050', bloodType: 'oxygenated',
    name: { en: 'Left Atrium (LA)', as: 'বাওঁ অলিন্দ (LA)' },
    role: { en: 'Receives oxygenated blood from the lungs (pulmonary veins)',
            as: 'হাঁওফাঁওৰ পৰা অক্সিজেনযুক্ত তেজ গ্ৰহণ কৰে (ফুসফুসীয় শিৰা)' },
    description: {
      en: 'The left atrium is the upper-left chamber of the heart. It receives freshly oxygenated blood returning from the lungs via the four pulmonary veins and delivers it to the left ventricle through the mitral (bicuspid) valve.',
      as: 'বাওঁ অলিন্দ হৈছে হৃদপিণ্ডৰ ওপৰৰ-বাওঁ প্ৰকোষ্ঠ। ই চাৰিটা ফুসফুসীয় শিৰাৰ যোগেদি হাঁওফাঁওৰ পৰা ঘূৰি অহা তাজা অক্সিজেনযুক্ত তেজ পায় আৰু মাইট্ৰেল (দ্বিৰূপ) কপাটিকাৰ যোগেদি বাওঁ নিলয়লৈ দিয়ে।',
    },
    functions: {
      en: [
        'Receives oxygenated blood from all four pulmonary veins',
        'Passes blood to left ventricle through the mitral (bicuspid) valve',
        'Atrial contraction (left atrial systole) completes LV filling',
        'Thin-walled — serves as receiving chamber, not a high-pressure pump',
      ],
      as: [
        'চাৰিওটা ফুসফুসীয় শিৰাৰ পৰা অক্সিজেনযুক্ত তেজ গ্ৰহণ কৰে',
        'মাইট্ৰেল (দ্বিৰূপ) কপাটিকাৰ যোগেদি তেজ বাওঁ নিলয়লৈ দিয়ে',
        'অলিন্দ সংকোচন (বাওঁ অলিন্দ চিষ্টোল)-এ LV পূৰণ সম্পূৰ্ণ কৰে',
        'পাতল গা — গ্ৰহণ প্ৰকোষ্ঠ ৰূপে কাম কৰে, উচ্চ-চাপৰ পাম্প নহয়',
      ],
    },
    keyFacts: {
      en: [
        'Four pulmonary veins (2 from each lung) open into the LA',
        'LA is the most POSTERIOR chamber of the heart (hence LA enlargement → hoarse voice, as it compresses recurrent laryngeal nerve)',
        'Left pulmonary veins and right pulmonary veins both drain here',
        'Mitral valve (2 cusps/bicuspid) between LA and LV',
      ],
      as: [
        'চাৰিটা ফুসফুসীয় শিৰা (প্ৰতিটো হাঁওফাঁওৰ পৰা ২টা) LA-ত মুকলি হয়',
        'LA হৈছে হৃদপিণ্ডৰ আটাইতকৈ পিছফালৰ প্ৰকোষ্ঠ (সেইবাবে LA ডাঙৰ হ’লে → মাত শাঁহী হয়, কাৰণ ই ৰিকাৰেণ্ট লেৰিনজিয়েল স্নায়ু চেপি ধৰে)',
        'বাওঁ আৰু সোঁ দুয়োপক্ষৰ ফুসফুসীয় শিৰা ইয়াত খোৱে',
        'LA আৰু LV-ৰ মাজত মাইট্ৰেল কপাটিকা (২ পত্ৰিকা/দ্বিৰূপ)',
      ],
    },
    examNotes: {
      en: [
        'LA receives oxygenated blood via 4 pulmonary veins (EXCEPTION: veins carry oxygenated blood here)',
        'Mitral/bicuspid valve (2 cusps) separates LA from LV',
        'LA is posterior to other chambers; enlargement can compress esophagus → dysphagia',
        'Pulmonary veins carry oxygenated blood (unique exception to vein = deoxygenated rule)',
        'LA contraction during atrial systole ensures complete ventricular filling',
      ],
      as: [
        'LA-এ ৪টা ফুসফুসীয় শিৰাৰ যোগেদি অক্সিজেনযুক্ত তেজ পায় (ব্যতিক্ৰম: ইয়াত শিৰাই অক্সিজেনযুক্ত তেজ কঢ়িয়ায়)',
        'মাইট্ৰেল/দ্বিৰূপ কপাটিকা (২ পত্ৰিকা)-এ LA-ক LV-ৰ পৰা পৃথক কৰে',
        'LA আন প্ৰকোষ্ঠৰ পিছফালে থাকে; ডাঙৰ হ’লে অন্ননালী চেপি ধৰিব পাৰে → ডিছফেজিয়া',
        'ফুসফুসীয় শিৰাই অক্সিজেনযুক্ত তেজ কঢ়িয়ায় (শিৰা = অক্সিজেনবিহীন নিয়মৰ অনন্য ব্যতিক্ৰম)',
        'অলিন্দ চিষ্টোলৰ সময়ত LA সংকোচনে নিলয়ৰ সম্পূৰ্ণ পূৰণ নিশ্চিত কৰে',
      ],
    },
    funFact: {
      en: 'The left atrium receives blood from all four pulmonary veins — two from each lung. These are the only veins in the body that carry bright red oxygenated blood!',
      as: 'বাওঁ অলিন্দে চাৰিওটা ফুসফুসীয় শিৰাৰ পৰা তেজ পায় — প্ৰতিটো হাঁওফাঁওৰ পৰা দুটাকৈ। শৰীৰৰ এইকেইটাই একমাত্ৰ শিৰা যিয়ে উজ্জ্বল ৰঙা অক্সিজেনযুক্ত তেজ কঢ়িয়ায়!',
    },
    disorders: {
      en: 'Atrial fibrillation, mitral stenosis, LA enlargement (causing hoarse voice), LA thrombus (clot risk)',
      as: 'অলিন্দ ফিব্ৰিলেচন, মাইট্ৰেল ষ্টেনচিছ, LA ডাঙৰ হোৱা (শাঁহী মাত), LA থ্ৰম্বাছ (তেজ গোট মৰাৰ আশংকা)',
    },
    circulationNote: {
      en: 'Freshly oxygenated blood arrives here from the lungs via 4 pulmonary veins. The LA contracts, pushing blood through the bicuspid (mitral) valve into the left ventricle. This marks the start of systemic circulation.',
      as: 'হাঁওফাঁওৰ পৰা ৪টা ফুসফুসীয় শিৰাৰ যোগেদি তাজা অক্সিজেনযুক্ত তেজ ইয়াত আহি পায়। LA সংকোচিত হয়, দ্বিৰূপ (মাইট্ৰেল) কপাটিকাৰ যোগেদি তেজ বাওঁ নিলয়লৈ ঠেলি দিয়ে। এইটোৱে তন্ত্ৰগত পৰিবহনৰ আৰম্ভণি সূচায়।',
    },
  },

  leftVentricle: {
    id: 'leftVentricle', color: '#9a1818', glowColor: '#c03030', bloodType: 'oxygenated',
    name: { en: 'Left Ventricle (LV)', as: 'বাওঁ নিলয় (LV)' },
    role: { en: 'Pumps oxygenated blood to entire body via aorta — most powerful chamber',
            as: 'মহাধমনীৰ যোগেদি সমগ্ৰ শৰীৰলৈ অক্সিজেনযুক্ত তেজ পাম্প কৰে — সৰ্বশক্তিশালী প্ৰকোষ্ঠ' },
    description: {
      en: 'The left ventricle is the most muscular and powerful chamber of the heart. Its thick walls (about 3× thicker than the RV) generate ~120 mmHg pressure to propel oxygenated blood through the aorta to every cell in the body.',
      as: 'বাওঁ নিলয় হৈছে হৃদপিণ্ডৰ আটাইতকৈ পেশীযুক্ত আৰু শক্তিশালী প্ৰকোষ্ঠ। ইয়াৰ ডাঠ গা (RV-তকৈ প্ৰায় ৩× ডাঠ)-ই ~১২০ mmHg চাপ উৎপন্ন কৰি মহাধমনীৰ যোগেদি শৰীৰৰ প্ৰতিটো কোষলৈ অক্সিজেনযুক্ত তেজ পঠিয়ায়।',
    },
    functions: {
      en: [
        'Pumps oxygenated blood into the aorta at ~120 mmHg (systolic pressure)',
        'Drives systemic circulation (to entire body)',
        'Thick muscular walls generate the highest pressures in the heart',
        'Aortic valve at outlet prevents backflow into LV during diastole',
      ],
      as: [
        '~১২০ mmHg (চিষ্টোলিক চাপ)-ত মহাধমনীলৈ অক্সিজেনযুক্ত তেজ পাম্প কৰে',
        'তন্ত্ৰগত পৰিবহন চলায় (সমগ্ৰ শৰীৰলৈ)',
        'ডাঠ পেশীযুক্ত গা-এ হৃদপিণ্ডৰ সৰ্বোচ্চ চাপ উৎপন্ন কৰে',
        'মুখৰ মহাধমনী কপাটিকাই ডায়াষ্টোলৰ সময়ত LV-লৈ উভতি অহা ৰোধ কৰে',
      ],
    },
    keyFacts: {
      en: [
        'Wall thickness: ~10–12 mm (3× thicker than RV ~3–4 mm)',
        'Generates systolic pressure ~120 mmHg (normal blood pressure)',
        'Papillary muscles (anterior and posterior) + chordae tendineae prevent mitral valve eversion',
        'Ellipsoidal/conical shape — efficient for high-pressure ejection',
        'Cardiac output: ~5 L/min at rest; up to 25 L/min during exercise',
      ],
      as: [
        'গাৰ ডাঠ: ~১০–১২ মি.মি. (RV ~৩–৪ মি.মি.-তকৈ ৩× ডাঠ)',
        'চিষ্টোলিক চাপ উৎপন্ন কৰে ~১২০ mmHg (স্বাভাৱিক ৰক্তচাপ)',
        'পেপিলেৰী পেশী (আগ আৰু পিছ) + ক‘ৰ্ডি টেণ্ডিনিৰে মাইট্ৰেল কপাটিকাৰ উলটিযোৱা ৰোধ কৰে',
        'উপবৃত্তাকাৰ/শঙ্কু আকৃতি — উচ্চ-চাপ নিৰ্গমনৰ বাবে কাৰ্যক্ষম',
        'কাৰ্ডিয়াক আউটপুট: জিৰণিত ~৫ লি./মিনিট; ব্যায়ামত ২৫ লি./মিনিট পৰ্যন্ত',
      ],
    },
    examNotes: {
      en: [
        'LV pumps blood into AORTA via aortic valve — systemic circulation',
        'LV wall is 3× thicker than RV — must pump against high systemic resistance',
        'Normal blood pressure = 120/80 mmHg: 120=LV systolic pressure; 80=aortic diastolic pressure',
        'During LV systole: mitral valve CLOSES (Lubb), aortic valve OPENS',
        'During LV diastole: aortic valve CLOSES (Dubb), mitral valve OPENS (filling phase)',
        'Ejection fraction: normally ~60% (fraction of blood pumped per beat)',
      ],
      as: [
        'LV-এ মহাধমনী কপাটিকাৰ যোগেদি মহাধমনীলৈ তেজ পাম্প কৰে — তন্ত্ৰগত পৰিবহন',
        'LV গা RV-তকৈ ৩× ডাঠ — উচ্চ তন্ত্ৰগত প্ৰতিৰোধৰ বিৰুদ্ধে পাম্প কৰিব লাগে',
        'স্বাভাৱিক ৰক্তচাপ = ১২০/৮০ mmHg: ১২০=LV চিষ্টোলিক চাপ; ৮০=মহাধমনী ডায়াষ্টোলিক চাপ',
        'LV চিষ্টোলৰ সময়ত: মাইট্ৰেল কপাটিকা বন্ধ (লাব), মহাধমনী কপাটিকা খোলে',
        'LV ডায়াষ্টোলৰ সময়ত: মহাধমনী কপাটিকা বন্ধ (ডাব), মাইট্ৰেল কপাটিকা খোলে (পূৰণ পৰ্যায়)',
        'ইজেকচন ফ্ৰেকচন: সাধাৰণতে ~৬০% (প্ৰতি স্পন্দনত পাম্প কৰা তেজৰ অংশ)',
      ],
    },
    funFact: {
      en: 'In a lifetime of 70 years, the left ventricle pumps over 2.5 BILLION times, moving enough blood to fill 100 Olympic swimming pools! It never rests for more than 0.5 seconds.',
      as: '৭০ বছৰৰ এক জীৱনত, বাওঁ নিলয়ে ২৫০ কোটিৰো অধিক বাৰ পাম্প কৰে, ১০০টা অলিম্পিক চাঁতৰ-পুখুৰী পূৰাব পৰাকৈ তেজ আঁতৰাই দিয়ে! ই ০.৫ ছেকেণ্ডতকৈ অধিক সময় কেতিয়াও বিশ্ৰাম নকৰে।',
    },
    disorders: {
      en: 'Left heart failure, myocardial infarction (heart attack), hypertensive heart disease, aortic stenosis, dilated cardiomyopathy',
      as: 'বাওঁ হৃদ ব্যৰ্থতা, মাইক‘কাৰ্ডিয়েল ইনফাৰ্কচন (হৃদ আক্ৰমণ), উচ্চ ৰক্তচাপজনিত হৃদ ৰোগ, মহাধমনী ষ্টেনচিছ, ডাইলেটেড কাৰ্ডিয়মাইপেথী',
    },
    circulationNote: {
      en: 'The most powerful pump in the body. During ventricular systole, the LV contracts with enormous force (~120 mmHg), snapping the mitral valve shut (Lubb!) and forcing oxygenated blood through the aortic valve into the aorta — beginning systemic circulation to every cell in the body.',
      as: 'শৰীৰৰ আটাইতকৈ শক্তিশালী পাম্প। নিলয় চিষ্টোলৰ সময়ত, LV বিপুল বলৰে সংকোচিত হয় (~১২০ mmHg), মাইট্ৰেল কপাটিকা বন্ধ কৰি (লাব!) মহাধমনী কপাটিকাৰ যোগেদি অক্সিজেনযুক্ত তেজ মহাধমনীলৈ ঠেলি পঠিয়ায় — শৰীৰৰ প্ৰতিটো কোষলৈ তন্ত্ৰগত পৰিবহন আৰম্ভ কৰি।',
    },
  },

  septum: {
    id: 'septum', color: '#6a3030', glowColor: '#8a5050', bloodType: 'none',
    name: { en: 'Cardiac Septum', as: 'হৃদ পট্ট' },
    role: { en: 'Wall dividing right and left sides — prevents blood mixing',
            as: 'সোঁ আৰু বাওঁ ফাল ভাগ কৰা প্ৰাচীৰ — তেজ মিহলি যোৱা ৰোধ কৰে' },
    description: {
      en: 'The cardiac septum consists of the interatrial septum (between the two atria) and the interventricular septum (between the two ventricles). This crucial wall completely separates oxygenated from deoxygenated blood in the mature heart.',
      as: 'হৃদ পট্ট অলিন্দ-মধ্যৱৰ্তী পট্ট (দুই অলিন্দৰ মাজত) আৰু নিলয়-মধ্যৱৰ্তী পট্ট (দুই নিলয়ৰ মাজত)-ৰে গঠিত। এই গুৰুত্বপূৰ্ণ প্ৰাচীৰে প্ৰাপ্তবয়স্ক হৃদপিণ্ডত অক্সিজেনযুক্ত আৰু অক্সিজেনবিহীন তেজক সম্পূৰ্ণৰূপে পৃথক কৰে।',
    },
    functions: {
      en: [
        'Completely separates right (deoxygenated) from left (oxygenated) blood',
        'Prevents oxygenated and deoxygenated blood from mixing',
        'Forms the left side of the RV (RV wraps around the septum)',
        'Contains the AV bundle (Bundle of His) for electrical conduction',
      ],
      as: [
        'সোঁ (অক্সিজেনবিহীন) আৰু বাওঁ (অক্সিজেনযুক্ত) তেজক সম্পূৰ্ণৰূপে পৃথক কৰে',
        'অক্সিজেনযুক্ত আৰু অক্সিজেনবিহীন তেজ মিহলি যোৱা ৰোধ কৰে',
        'RV-ৰ বাওঁফাল গঠন কৰে (RV পট্টৰ চাৰিওফালে আগুৰে)',
        'বৈদ্যুতিক পৰিবহনৰ বাবে AV বাণ্ডিল (হিছৰ বাণ্ডিল) থাকে',
      ],
    },
    keyFacts: {
      en: [
        'Interventricular Septum (IVS): thicker, muscular — very important for LV function',
        'Interatrial Septum (IAS): thinner; contains fossa ovalis (remnant of foramen ovale)',
        'Foramen ovale: opening in IAS that allows fetal blood to bypass lungs; closes at birth',
        'VSD (ventricular septal defect): most common congenital heart defect — hole in IVS',
        'IVS forms part of LV wall — septum contracts with LV during systole',
      ],
      as: [
        'নিলয়-মধ্যৱৰ্তী পট্ট (IVS): ডাঠ, পেশীযুক্ত — LV কাৰ্যৰ বাবে অতি গুৰুত্বপূৰ্ণ',
        'অলিন্দ-মধ্যৱৰ্তী পট্ট (IAS): পাতল; ফোছা ওভালিছ থাকে (ফোৰামেন ওভেলৰ অৱশেষ)',
        'ফোৰামেন ওভেল: IAS-ৰ ছিদ্ৰ যিয়ে ভ্ৰূণৰ তেজক হাঁওফাঁও এৰাই যাবলৈ দিয়ে; জন্মত বন্ধ হয়',
        'VSD (নিলয় পট্ট ত্ৰুটি): আটাইতকৈ সাধাৰণ জন্মগত হৃদ ত্ৰুটি — IVS-ত গাঁত',
        'IVS LV গাৰ অংশ গঠন কৰে — চিষ্টোলৰ সময়ত পট্ট LV-ৰ লগতে সংকোচিত হয়',
      ],
    },
    examNotes: {
      en: [
        'Septum prevents mixing of oxygenated and deoxygenated blood in double circulation',
        'Fossa ovalis: depression in IAS, remnant of fetal foramen ovale',
        'VSD (hole in IVS): most common congenital heart defect — allows blood mixing (L→R shunt)',
        'Foramen ovale normally closes within hours of birth (pressure reversal)',
        'Double circulation in mammals requires COMPLETE septum — unlike fish (single circulation)',
      ],
      as: [
        'পট্টই দ্বৈত পৰিবহনত অক্সিজেনযুক্ত আৰু অক্সিজেনবিহীন তেজ মিহলি যোৱা ৰোধ কৰে',
        'ফোছা ওভালিছ: IAS-ৰ গভীৰতা, ভ্ৰূণৰ ফোৰামেন ওভেলৰ অৱশেষ',
        'VSD (IVS-ত গাঁত): আটাইতকৈ সাধাৰণ জন্মগত হৃদ ত্ৰুটি — তেজ মিহলি যাবলৈ দিয়ে (L→R শ্বাণ্ট)',
        'ফোৰামেন ওভেল সাধাৰণতে জন্মৰ ঘণ্টাৰ ভিতৰতে বন্ধ হয় (চাপ ওলোটা)',
        'স্তন্যপায়ী জীৱৰ দ্বৈত পৰিবহনত সম্পূৰ্ণ পট্ট প্ৰয়োজন — মাছ (এক পৰিবহন)-ৰ বিপৰীতে',
      ],
    },
    funFact: {
      en: 'In the fetus, the foramen ovale (a hole in the septum) allows blood to bypass the lungs — since lungs aren\'t used yet! It closes within seconds of the first breath after birth.',
      as: 'ভ্ৰূণত, ফোৰামেন ওভেল (পট্টৰ এটা গাঁত)-এ তেজক হাঁওফাঁও এৰাই যাবলৈ দিয়ে — কাৰণ হাঁওফাঁও তেতিয়া ব্যৱহাৰ নহয়! জন্মৰ পিছত প্ৰথম উশাহৰ কেইছেকেণ্ডমানৰ ভিতৰতে ই বন্ধ হয়।',
    },
    disorders: {
      en: 'VSD (ventricular septal defect), ASD (atrial septal defect), patent foramen ovale, hypertrophic cardiomyopathy',
      as: 'VSD (নিলয় পট্ট ত্ৰুটি), ASD (অলিন্দ পট্ট ত্ৰুটি), পেটেণ্ট ফোৰামেন ওভেল, হাইপাৰট্ৰফিক কাৰ্ডিয়মাইপেথী',
    },
    circulationNote: {
      en: 'The septum is what makes DOUBLE CIRCULATION possible. By completely dividing the heart into right (deoxygenated) and left (oxygenated) sides, it ensures that oxygen-rich blood never mixes with oxygen-poor blood — giving humans the high metabolic efficiency needed for warm-blooded activity.',
      as: 'পট্টয়েই দ্বৈত পৰিবহন সম্ভৱ কৰে। হৃদপিণ্ডক সম্পূৰ্ণভাৱে সোঁ (অক্সিজেনবিহীন) আৰু বাওঁ (অক্সিজেনযুক্ত) ফালে ভাগ কৰি, ই অক্সিজেন-সমৃদ্ধ তেজ অক্সিজেন-দুৰ্বল তেজৰ লগত মিহলি নহোৱাটো নিশ্চিত কৰে — মানুহক উষ্ণ-তেজ জীৱৰ কাৰ্যৰ বাবে প্ৰয়োজনীয় উচ্চ বিপাকীয় দক্ষতা দিয়ে।',
    },
  },

  tricuspidValve: {
    id: 'tricuspidValve', color: '#4070d8', glowColor: '#6090e8', bloodType: 'deoxygenated',
    name: { en: 'Tricuspid Valve', as: 'ত্ৰিৰূপ কপাটিকা' },
    role: { en: 'AV valve between RA and RV — prevents backflow to RA',
            as: 'RA আৰু RV-ৰ মাজৰ AV কপাটিকা — RA-লৈ উভতি অহা ৰোধ কৰে' },
    description: {
      en: 'The tricuspid valve (right atrioventricular valve) has three cusps/leaflets. It opens during diastole to let blood flow from RA → RV, and slams shut during ventricular systole to prevent backflow. It contributes to the "Lubb" heart sound.',
      as: 'ত্ৰিৰূপ কপাটিকা (সোঁ অলিন্দ-নিলয় কপাটিকা)-ৰ তিনিটা পত্ৰিকা/কাচ্প থাকে। ই ডায়াষ্টোলৰ সময়ত খোলে যাতে তেজ RA → RV-লৈ যাব পাৰে, আৰু নিলয় চিষ্টোলৰ সময়ত উভতি অহা ৰোধ কৰিবলৈ বন্ধ হৈ যায়। ই "লাব" হৃদ শব্দত ভূমিকা ৰাখে।',
    },
    functions: {
      en: [
        'Opens during diastole: allows blood flow from RA → RV',
        'Closes during ventricular systole: prevents backflow RA ← RV',
        'Three cusps (anterior, posterior, septal) provide complete seal',
        'Chordae tendineae anchor cusps to papillary muscles — prevent inversion',
      ],
      as: [
        'ডায়াষ্টোলৰ সময়ত খোলে: RA → RV-লৈ তেজ যাবলৈ দিয়ে',
        'নিলয় চিষ্টোলৰ সময়ত বন্ধ: RA ← RV উভতি অহা ৰোধ কৰে',
        'তিনিটা পত্ৰিকা (আগ, পিছ, পট্ট)-ই সম্পূৰ্ণ ছিল দিয়ে',
        'ক‘ৰ্ডি টেণ্ডিনিৰে পত্ৰিকাবোৰক পেপিলেৰী পেশীৰ লগত বান্ধি ৰাখে — উলটিযোৱা ৰোধ কৰে',
      ],
    },
    keyFacts: {
      en: ['3 cusps: hence "tri-cuspid"', 'Right atrioventricular (AV) valve',
           'Closure produces the S1 "Lubb" sound (along with mitral valve closure)',
           'Chordae tendineae + papillary muscles prevent valve eversion during high RV pressure',
           'Located between RA and RV on the right side of the heart'],
      as: ['৩ পত্ৰিকা: সেইবাবে "ত্ৰি-ৰূপ"', 'সোঁ অলিন্দ-নিলয় (AV) কপাটিকা',
           'বন্ধ হোৱাত S1 "লাব" শব্দ উৎপন্ন কৰে (মাইট্ৰেল কপাটিকা বন্ধ হোৱাৰ লগতে)',
           'উচ্চ RV চাপৰ সময়ত ক‘ৰ্ডি টেণ্ডিনি + পেপিলেৰী পেশীয়ে কপাটিকাৰ উলটিযোৱা ৰোধ কৰে',
           'হৃদপিণ্ডৰ সোঁফালে RA আৰু RV-ৰ মাজত অৱস্থিত'],
    },
    examNotes: {
      en: [
        'Tricuspid = 3 cusps; Mitral = 2 cusps — easy mnemonic!',
        'AV valves (tricuspid + mitral): close at START of systole → produce "Lubb" (S1)',
        'Semilunar valves (pulmonary + aortic): close at START of diastole → produce "Dubb" (S2)',
        'Tricuspid regurgitation: valve leaks → backflow from RV → RA',
        'Rheumatic fever can damage tricuspid valve (though mitral is more commonly affected)',
      ],
      as: [
        'ত্ৰিৰূপ = ৩ পত্ৰিকা; মাইট্ৰেল = ২ পত্ৰিকা — সহজ মনে ৰখা সূত্ৰ!',
        'AV কপাটিকা (ত্ৰিৰূপ + মাইট্ৰেল): চিষ্টোলৰ আৰম্ভণিত বন্ধ → "লাব" (S1) উৎপন্ন কৰে',
        'অৰ্ধচন্দ্ৰাকৃতি কপাটিকা (ফুসফুসীয় + মহাধমনী): ডায়াষ্টোলৰ আৰম্ভণিত বন্ধ → "ডাব" (S2) উৎপন্ন কৰে',
        'ত্ৰিৰূপ ৰিগাৰ্জিটেচন: কপাটিকা লিক → RV → RA-লৈ উভতি অহা',
        'ৰিউমেটিক জ্বৰে ত্ৰিৰূপ কপাটিকা ক্ষতি কৰিব পাৰে (যদিও মাইট্ৰেলেই অধিক সাধাৰণভাৱে প্ৰভাৱিত হয়)',
      ],
    },
    funFact: {
      en: 'The word "tricuspid" comes from Latin meaning "three points" — referring to its three leaf-like flaps. When all three flaps seal together, the valve is watertight under high pressure!',
      as: '"ত্ৰিকাচ্প" শব্দটো লেটিন ভাষাৰ পৰা আহিছে যাৰ অৰ্থ "তিনি বিন্দু" — ইয়াৰ তিনিটা পাতৰ দৰে ফ্লেপক বুজোৱা হৈছে। তিনিওটা ফ্লেপ একেলগে ছিল কৰিলে, উচ্চ চাপতো কপাটিকা পানীৰোধী হয়!',
    },
    disorders: {
      en: 'Tricuspid regurgitation, tricuspid stenosis, Ebstein\'s anomaly',
      as: 'ত্ৰিৰূপ ৰিগাৰ্জিটেচন, ত্ৰিৰূপ ষ্টেনচিছ, এপ্‌ষ্টাইনৰ এন’মালী',
    },
    circulationNote: {
      en: 'During ventricular filling (diastole), the tricuspid valve is OPEN, allowing deoxygenated blood to flow from RA into RV. When the ventricle contracts (systole), pressure slams the valve shut with the "Lubb" sound, preventing blood from surging back into the atrium.',
      as: 'নিলয় পূৰণৰ সময়ত (ডায়াষ্টোল), ত্ৰিৰূপ কপাটিকা খোলা থাকে, অক্সিজেনবিহীন তেজক RA-ৰ পৰা RV-লৈ যাবলৈ দিয়ে। নিলয় সংকোচিত হ’লে (চিষ্টোল), চাপে কপাটিকাটো "লাব" শব্দেৰে বন্ধ কৰে, তেজক অলিন্দলৈ উভতি যাব নিদিয়ে।',
    },
  },

  mitralValve: {
    id: 'mitralValve', color: '#c03030', glowColor: '#e05050', bloodType: 'oxygenated',
    name: { en: 'Mitral Valve (Bicuspid)', as: 'মাইট্ৰেল কপাটিকা (দ্বিৰূপ)' },
    role: { en: 'AV valve between LA and LV — prevents backflow to LA',
            as: 'LA আৰু LV-ৰ মাজৰ AV কপাটিকা — LA-লৈ উভতি অহা ৰোধ কৰে' },
    description: {
      en: 'The mitral valve (left atrioventricular valve, also called bicuspid) has two cusps. It allows oxygenated blood to flow from LA → LV during diastole and prevents backflow during the powerful LV systole. It is the most commonly diseased heart valve.',
      as: 'মাইট্ৰেল কপাটিকা (বাওঁ অলিন্দ-নিলয় কপাটিকা, দ্বিৰূপো বুলি কোৱা হয়)-ৰ দুটা পত্ৰিকা থাকে। ই ডায়াষ্টোলৰ সময়ত অক্সিজেনযুক্ত তেজক LA → LV-লৈ যাবলৈ দিয়ে আৰু শক্তিশালী LV চিষ্টোলৰ সময়ত উভতি অহা ৰোধ কৰে। ই আটাইতকৈ সাধাৰণভাৱে ৰোগগ্ৰস্ত হৃদ কপাটিকা।',
    },
    functions: {
      en: [
        'Opens during diastole: allows oxygenated blood from LA → LV',
        'Closes during LV systole: prevents backflow from LV → LA (resists ~120 mmHg)',
        'Two large cusps: anterior (aortic) and posterior (mural)',
        'Chordae tendineae + papillary muscles prevent prolapse under high LV pressure',
      ],
      as: [
        'ডায়াষ্টোলৰ সময়ত খোলে: LA → LV-লৈ অক্সিজেনযুক্ত তেজ যাবলৈ দিয়ে',
        'LV চিষ্টোলৰ সময়ত বন্ধ: LV → LA উভতি অহা ৰোধ কৰে (~১২০ mmHg-ৰ বিৰুদ্ধে)',
        'দুটা ডাঙৰ পত্ৰিকা: আগ (মহাধমনী) আৰু পিছ (মিউৰেল)',
        'উচ্চ LV চাপৰ সময়ত ক‘ৰ্ডি টেণ্ডিনি + পেপিলেৰী পেশীয়ে প্ৰলেপছ ৰোধ কৰে',
      ],
    },
    keyFacts: {
      en: [
        '2 cusps: hence "bi-cuspid" or "mitral" (shape resembles a bishop\'s mitre)',
        'Left atrioventricular (AV) valve — most commonly diseased valve',
        'Closure at LV systole onset = S1 "Lubb" sound',
        'Must withstand very high LV pressures (~120 mmHg) — reinforced by chordae tendineae',
        'Most commonly damaged in rheumatic heart disease',
      ],
      as: [
        '২ পত্ৰিকা: সেইবাবে "দ্বি-কাচ্প" বা "মাইট্ৰেল" (আকৃতি বিচপৰ মাইট্ৰৰ দৰে)',
        'বাওঁ অলিন্দ-নিলয় (AV) কপাটিকা — আটাইতকৈ সাধাৰণভাৱে ৰোগগ্ৰস্ত কপাটিকা',
        'LV চিষ্টোল আৰম্ভ হোৱাৰ সময়ত বন্ধ = S1 "লাব" শব্দ',
        'অতি উচ্চ LV চাপ (~১২০ mmHg) সহিব লাগে — ক‘ৰ্ডি টেণ্ডিনিৰে শক্তিশালী কৰা',
        'ৰিউমেটিক হৃদ ৰোগত আটাইতকৈ সাধাৰণভাৱে ক্ষতি হয়',
      ],
    },
    examNotes: {
      en: [
        'Mitral/bicuspid valve: 2 cusps; located between LA and LV',
        'Most frequently damaged heart valve in rheumatic fever (molecular mimicry)',
        'Mitral stenosis: narrowed valve → left heart backs up → pulmonary congestion',
        'Mitral regurgitation: leaky valve → blood squirts back into LA during LV systole',
        'MVP (Mitral Valve Prolapse): cusps billow into LA during systole — common (2–3% population)',
      ],
      as: [
        'মাইট্ৰেল/দ্বিৰূপ কপাটিকা: ২ পত্ৰিকা; LA আৰু LV-ৰ মাজত অৱস্থিত',
        'ৰিউমেটিক জ্বৰত আটাইতকৈ অধিক ক্ষতি হোৱা হৃদ কপাটিকা (অণুক অনুকৰণ)',
        'মাইট্ৰেল ষ্টেনচিছ: সংকীৰ্ণ কপাটিকা → বাওঁ হৃদ ফুলি যায় → ফুসফুসীয় কনজেচন',
        'মাইট্ৰেল ৰিগাৰ্জিটেচন: লিক কপাটিকা → LV চিষ্টোলৰ সময়ত তেজ LA-লৈ পিচকাৰি যায়',
        'MVP (মাইট্ৰেল কপাটিকা প্ৰলেপছ): চিষ্টোলৰ সময়ত পত্ৰিকা LA-লৈ ফুলে — সাধাৰণ (২–৩% জনসংখ্যা)',
      ],
    },
    funFact: {
      en: 'The mitral valve must seal perfectly against 120 mmHg of pressure during every heartbeat — equivalent to a car tire pressure — yet does this over 100,000 times per day without mechanical failure!',
      as: 'প্ৰতিটো হৃদ-স্পন্দনত মাইট্ৰেল কপাটিকাই ১২০ mmHg চাপৰ বিৰুদ্ধে নিখুঁতভাৱে ছিল কৰিব লাগে — গাড়ীৰ টায়াৰৰ চাপৰ সমান — তথাপি দৈনিক ১,০০,০০০ বাৰৰো অধিক বাৰ যান্ত্ৰিক ব্যৰ্থতা অবিহনে এই কাম কৰে!',
    },
    disorders: {
      en: 'Mitral stenosis (rheumatic), mitral regurgitation, mitral valve prolapse (MVP), chordal rupture',
      as: 'মাইট্ৰেল ষ্টেনচিছ (ৰিউমেটিক), মাইট্ৰেল ৰিগাৰ্জিটেচন, মাইট্ৰেল কপাটিকা প্ৰলেপছ (MVP), ক‘ৰ্ডেল ৰাপচাৰ',
    },
    circulationNote: {
      en: 'Oxygenated blood from the LA flows through the open mitral valve into the LV during diastole. When the powerful LV contracts (systole), the mitral valve CLOSES tightly (Lubb!) — the two cusps meet perfectly to prevent any backflow despite the intense pressure generated.',
      as: 'LA-ৰ অক্সিজেনযুক্ত তেজ ডায়াষ্টোলৰ সময়ত খোলা মাইট্ৰেল কপাটিকাৰ যোগেদি LV-লৈ যায়। শক্তিশালী LV সংকোচিত হ’লে (চিষ্টোল), মাইট্ৰেল কপাটিকা টানকৈ বন্ধ হৈ যায় (লাব!) — দুটা পত্ৰিকা নিখুঁতভাৱে মিলি যায় যাতে উৎপন্ন তীব্ৰ চাপৰ পিছতো কোনো উভতি অহা নাথাকে।',
    },
  },

  pulmonaryValve: {
    id: 'pulmonaryValve', color: '#2050b8', glowColor: '#4070d8', bloodType: 'deoxygenated',
    name: { en: 'Pulmonary Valve', as: 'ফুসফুসীয় কপাটিকা' },
    role: { en: 'Semilunar valve between RV and pulmonary artery',
            as: 'RV আৰু ফুসফুসীয় ধমনীৰ মাজৰ অৰ্ধচন্দ্ৰাকৃতি কপাটিকা' },
    description: {
      en: 'The pulmonary valve is a semilunar valve (3 crescent-shaped cusps) located at the exit of the right ventricle. It opens during RV systole to allow blood into the pulmonary trunk and closes during diastole to prevent backflow into the RV.',
      as: 'ফুসফুসীয় কপাটিকা হৈছে এক অৰ্ধচন্দ্ৰাকৃতি কপাটিকা (৩টা অৰ্ধচন্দ্ৰাকৃতিৰ পত্ৰিকা) যি সোঁ নিলয়ৰ মুখত অৱস্থিত। ই RV চিষ্টোলৰ সময়ত খোলে যাতে তেজ ফুসফুসীয় ট্ৰাঙ্কত প্ৰৱেশ কৰিব পাৰে আৰু ডায়াষ্টোলৰ সময়ত RV-লৈ উভতি অহা ৰোধ কৰিবলৈ বন্ধ হয়।',
    },
    functions: {
      en: [
        'Opens during RV systole: allows deoxygenated blood into pulmonary trunk',
        'Closes during RV diastole: prevents backflow from PA → RV',
        'Three semilunar (half-moon shaped) cusps provide complete seal',
        'Works against pulmonary pressure (~25 mmHg, much lower than aortic)',
      ],
      as: [
        'RV চিষ্টোলৰ সময়ত খোলে: ফুসফুসীয় ট্ৰাঙ্কত অক্সিজেনবিহীন তেজ যাবলৈ দিয়ে',
        'RV ডায়াষ্টোলৰ সময়ত বন্ধ: PA → RV উভতি অহা ৰোধ কৰে',
        'তিনিটা অৰ্ধচন্দ্ৰাকৃতি পত্ৰিকাই সম্পূৰ্ণ ছিল দিয়ে',
        'ফুসফুসীয় চাপৰ (~২৫ mmHg, মহাধমনীতকৈ বহু কম) বিৰুদ্ধে কাম কৰে',
      ],
    },
    keyFacts: {
      en: [
        'Semilunar valve (3 half-moon cusps): anterior, right, left',
        'Also called pulmonary semilunar valve',
        'Closure at start of diastole → S2 "Dubb" sound (along with aortic valve)',
        'Located at the RV-pulmonary trunk junction',
        'No chordae tendineae (unlike AV valves) — cusps held by arterial pressure',
      ],
      as: [
        'অৰ্ধচন্দ্ৰাকৃতি কপাটিকা (৩টা অৰ্ধচন্দ্ৰাকৃতি পত্ৰিকা): আগ, সোঁ, বাওঁ',
        'ফুসফুসীয় অৰ্ধচন্দ্ৰাকৃতি কপাটিকা বুলিও কোৱা হয়',
        'ডায়াষ্টোলৰ আৰম্ভণিত বন্ধ → S2 "ডাব" শব্দ (মহাধমনী কপাটিকাৰ লগতে)',
        'RV-ফুসফুসীয় ট্ৰাঙ্ক সংযোগস্থলত অৱস্থিত',
        'ক‘ৰ্ডি টেণ্ডিনি নাই (AV কপাটিকাৰ বিপৰীতে) — পত্ৰিকা ধমনীয় চাপৰ যোগেদি ধৰি ৰখা',
      ],
    },
    examNotes: {
      en: [
        'Semilunar valves (pulmonary + aortic) close at START of DIASTOLE → "Dubb" (S2)',
        'Pulmonary stenosis: obstructs RV outflow → RV hypertrophy',
        'Pulmonary regurgitation: backflow from PA → RV (common after certain surgeries)',
        'Pulmonary valve operates at lower pressure (~25 mmHg) vs aortic (~120 mmHg)',
        'In Tetralogy of Fallot: pulmonary stenosis + VSD + RV hypertrophy + overriding aorta',
      ],
      as: [
        'অৰ্ধচন্দ্ৰাকৃতি কপাটিকা (ফুসফুসীয় + মহাধমনী) ডায়াষ্টোলৰ আৰম্ভণিত বন্ধ → "ডাব" (S2)',
        'ফুসফুসীয় ষ্টেনচিছ: RV-ৰ বহিৰ্গমন বাধা দিয়ে → RV হাইপাৰট্ৰফী',
        'ফুসফুসীয় ৰিগাৰ্জিটেচন: PA → RV উভতি অহা (কিছুমান অস্ত্ৰোপচাৰৰ পিছত সাধাৰণ)',
        'ফুসফুসীয় কপাটিকা কম চাপত (~২৫ mmHg) কাম কৰে, মহাধমনী (~১২০ mmHg)-তকৈ',
        'টেট্ৰালজী অফ ফেলটত: ফুসফুসীয় ষ্টেনচিছ + VSD + RV হাইপাৰট্ৰফী + মহাধমনী আগুৰি যোৱা',
      ],
    },
    funFact: {
      en: 'Unlike the mitral and tricuspid valves, semilunar valves like the pulmonary valve have NO chordae tendineae — they close purely from the pressure wave bouncing back from the pulmonary arteries!',
      as: 'মাইট্ৰেল আৰু ত্ৰিৰূপ কপাটিকাৰ বিপৰীতে, ফুসফুসীয় কপাটিকাৰ দৰে অৰ্ধচন্দ্ৰাকৃতি কপাটিকাৰ ক‘ৰ্ডি টেণ্ডিনি নাই — ই কেৱল ফুসফুসীয় ধমনীৰ পৰা ঘূৰি অহা চাপ তৰঙ্গৰ ফলত বন্ধ হয়!',
    },
    disorders: {
      en: 'Pulmonary stenosis, pulmonary regurgitation, pulmonary atresia, tetralogy of Fallot',
      as: 'ফুসফুসীয় ষ্টেনচিছ, ফুসফুসীয় ৰিগাৰ্জিটেচন, ফুসফুসীয় এট্ৰেচিয়া, টেট্ৰালজী অফ ফেলট',
    },
    circulationNote: {
      en: 'As the RV contracts during systole, blood pressure builds up until it exceeds pulmonary pressure — the pulmonary valve snaps open and deoxygenated blood is ejected into the pulmonary trunk. During diastole, the valve closes (contributing to Dubb), preventing blood from flowing backward.',
      as: 'চিষ্টোলৰ সময়ত RV সংকোচিত হোৱাৰ লগে লগে, ৰক্তচাপ ফুসফুসীয় চাপতকৈ অধিক নোহোৱা পৰ্যন্ত বাঢ়ি যায় — ফুসফুসীয় কপাটিকা খোলে আৰু অক্সিজেনবিহীন তেজ ফুসফুসীয় ট্ৰাঙ্কত ছাড়ি দিয়া হয়। ডায়াষ্টোলৰ সময়ত, কপাটিকা বন্ধ হয় (ডাবত অৱদান), তেজক উভতি যাব নিদিয়ে।',
    },
  },

  aorticValve: {
    id: 'aorticValve', color: '#a01818', glowColor: '#c03030', bloodType: 'oxygenated',
    name: { en: 'Aortic Valve', as: 'মহাধমনী কপাটিকা' },
    role: { en: 'Semilunar valve between LV and aorta — prevents backflow',
            as: 'LV আৰু মহাধমনীৰ মাজৰ অৰ্ধচন্দ্ৰাকৃতি কপাটিকা — উভতি অহা ৰোধ কৰে' },
    description: {
      en: 'The aortic valve is a semilunar valve at the LV-aorta junction with three cusps (right, left, and posterior). It opens during LV systole to allow blood into the aorta and must close tightly during diastole against the full aortic pressure (~80 mmHg).',
      as: 'মহাধমনী কপাটিকা হৈছে LV-মহাধমনী সংযোগস্থলৰ এক অৰ্ধচন্দ্ৰাকৃতি কপাটিকা যাৰ তিনিটা পত্ৰিকা আছে (সোঁ, বাওঁ, পিছ)। ই LV চিষ্টোলৰ সময়ত খোলে যাতে তেজ মহাধমনীত যাব পাৰে আৰু ডায়াষ্টোলৰ সময়ত সম্পূৰ্ণ মহাধমনী চাপৰ (~৮০ mmHg) বিৰুদ্ধে টানকৈ বন্ধ হ’ব লাগে।',
    },
    functions: {
      en: [
        'Opens during LV systole: allows oxygenated blood into aorta',
        'Closes during diastole: prevents backflow from aorta → LV (against ~80 mmHg)',
        'Coronary arteries originate from aortic sinuses (just above the valve cusps)',
        'Three semilunar cusps: right coronary, left coronary, non-coronary/posterior',
      ],
      as: [
        'LV চিষ্টোলৰ সময়ত খোলে: মহাধমনীত অক্সিজেনযুক্ত তেজ যাবলৈ দিয়ে',
        'ডায়াষ্টোলৰ সময়ত বন্ধ: মহাধমনী → LV উভতি অহা ৰোধ কৰে (~৮০ mmHg-ৰ বিৰুদ্ধে)',
        'কৰোনাৰী ধমনী মহাধমনী চাইনাছৰ পৰা উৎপন্ন হয় (কপাটিকা পত্ৰিকাৰ ঠিক ওপৰত)',
        'তিনিটা অৰ্ধচন্দ্ৰাকৃতি পত্ৰিকা: সোঁ কৰোনাৰী, বাওঁ কৰোনাৰী, অ-কৰোনাৰী/পিছ',
      ],
    },
    keyFacts: {
      en: [
        'Three semilunar cusps: right, left (give rise to coronary arteries), and non-coronary',
        'Coronary arteries fill during diastole (when LV relaxes and aortic valve is closed)',
        'Closure = S2 "Dubb" sound (with pulmonary valve)',
        'Most commonly affected valve in elderly (calcific aortic stenosis)',
        'Aortic regurgitation = significant leak → LV volume overload',
      ],
      as: [
        'তিনিটা অৰ্ধচন্দ্ৰাকৃতি পত্ৰিকা: সোঁ, বাওঁ (কৰোনাৰী ধমনীৰ উৎস), আৰু অ-কৰোনাৰী',
        'কৰোনাৰী ধমনী ডায়াষ্টোলৰ সময়ত ভৰে (যেতিয়া LV শিথিল হয় আৰু মহাধমনী কপাটিকা বন্ধ থাকে)',
        'বন্ধ হোৱা = S2 "ডাব" শব্দ (ফুসফুসীয় কপাটিকাৰ লগতে)',
        'বৃদ্ধসকলৰ ক্ষেত্ৰত আটাইতকৈ সাধাৰণভাৱে প্ৰভাৱিত কপাটিকা (কেলচিফিক মহাধমনী ষ্টেনচিছ)',
        'মহাধমনী ৰিগাৰ্জিটেচন = উল্লেখযোগ্য লিক → LV আয়তন অতিভাৰ',
      ],
    },
    examNotes: {
      en: [
        'Aortic valve: semilunar valve at LV-aorta junction (3 cusps)',
        'Coronary arteries arise from aortic sinuses ABOVE the aortic valve cusps',
        'Aortic stenosis (most common in elderly): calcification → reduced LV outflow → syncope/angina/dyspnea',
        'Closure of aortic + pulmonary valves = "Dubb" (S2) heart sound',
        'Bicuspid aortic valve: congenital 2-cusp variant (1-2% of population) → early stenosis',
      ],
      as: [
        'মহাধমনী কপাটিকা: LV-মহাধমনী সংযোগস্থলৰ অৰ্ধচন্দ্ৰাকৃতি কপাটিকা (৩ পত্ৰিকা)',
        'কৰোনাৰী ধমনী মহাধমনী কপাটিকা পত্ৰিকাৰ ওপৰৰ মহাধমনী চাইনাছৰ পৰা উৎপন্ন হয়',
        'মহাধমনী ষ্টেনচিছ (বৃদ্ধত আটাইতকৈ সাধাৰণ): কেলচিফিকেচন → কম LV আউটফ্ল‘ → ছিনক‘পী/এনজিনা/ডিছপনিয়া',
        'মহাধমনী + ফুসফুসীয় কপাটিকা বন্ধ হোৱা = "ডাব" (S2) হৃদ শব্দ',
        'দ্বিৰূপ মহাধমনী কপাটিকা: জন্মগত ২-পত্ৰিকা ভিন্নৰূপ (জনসংখ্যাৰ ১-২%) → অকাল ষ্টেনচিছ',
      ],
    },
    funFact: {
      en: 'Your coronary arteries (which feed the heart muscle) fill with blood only when the aortic valve is CLOSED, during the brief rest phase between heartbeats — a clever engineering solution!',
      as: 'আপোনাৰ কৰোনাৰী ধমনী (যিয়ে হৃৎপেশীক পুষ্টি দিয়ে) কেৱল মহাধমনী কপাটিকা বন্ধ থকা সময়তহে তেজেৰে ভৰে, হৃদ-স্পন্দনৰ মাজত চমু বিশ্ৰাম পৰ্যায়ত — এক চতুৰ ইঞ্জিনিয়েৰিং সমাধান!',
    },
    disorders: {
      en: 'Aortic stenosis (calcific, rheumatic), aortic regurgitation, bicuspid aortic valve, endocarditis',
      as: 'মহাধমনী ষ্টেনচিছ (কেলচিফিক, ৰিউমেটিক), মহাধমনী ৰিগাৰ্জিটেচন, দ্বিৰূপ মহাধমনী কপাটিকা, এণ্ডোকাৰ্ডাইটিছ',
    },
    circulationNote: {
      en: 'When LV pressure exceeds aortic pressure (~80 mmHg), the aortic valve opens wide and oxygenated blood floods into the aorta. As the LV relaxes, aortic pressure exceeds LV pressure and the valve slams shut (Dubb!), preventing backflow and maintaining diastolic blood pressure.',
      as: 'LV চাপ মহাধমনী চাপতকৈ (~৮০ mmHg) অধিক হ’লে, মহাধমনী কপাটিকা ফাঁক হৈ খোলে আৰু অক্সিজেনযুক্ত তেজ মহাধমনীত প্ৰৱেশ কৰে। LV শিথিল হোৱাৰ লগে লগে, মহাধমনী চাপ LV চাপতকৈ অধিক হয় আৰু কপাটিকা বন্ধ হৈ যায় (ডাব!), উভতি অহা ৰোধ কৰি ডায়াষ্টোলিক ৰক্তচাপ বজাই ৰাখে।',
    },
  },

  aorta: {
    id: 'aorta', color: '#c03030', glowColor: '#e05050', bloodType: 'oxygenated',
    name: { en: 'Aorta', as: 'মহাধমনী' },
    role: { en: 'Largest artery — distributes oxygenated blood to entire body',
            as: 'সৰ্ববৃহৎ ধমনী — সমগ্ৰ শৰীৰলৈ অক্সিজেনযুক্ত তেজ বিতৰণ কৰে' },
    description: {
      en: 'The aorta is the largest artery in the body (diameter ~2.5 cm), arising from the left ventricle. It consists of the ascending aorta, aortic arch (giving rise to major branches to head/arms), and descending aorta (thoracic and abdominal).',
      as: 'মহাধমনী হৈছে শৰীৰৰ সৰ্ববৃহৎ ধমনী (ব্যাস ~২.৫ চে.মি.), যি বাওঁ নিলয়ৰ পৰা উৎপন্ন হয়। ইয়াত আৰোহী মহাধমনী, মহাধমনী চাপ (মূৰ/বাহুলৈ মুখ্য শাখা দিয়া), আৰু অৱৰোহী মহাধমনী (বক্ষ আৰু উদৰ) আছে।',
    },
    functions: {
      en: [
        'Receives oxygenated blood directly from LV at high pressure',
        'Distributes blood to all systemic arteries via branches',
        'Aortic arch branches: brachiocephalic trunk, left common carotid, left subclavian arteries',
        'Descending aorta supplies thorax, abdomen, pelvis, and legs',
      ],
      as: [
        'উচ্চ চাপত LV-ৰ পৰা পোনে পোনে অক্সিজেনযুক্ত তেজ পায়',
        'শাখাৰ যোগেদি সকলো তন্ত্ৰগত ধমনীলৈ তেজ বিতৰণ কৰে',
        'মহাধমনী চাপৰ শাখা: ব্ৰেকিয়েচেফালিক ট্ৰাঙ্ক, বাওঁ সাধাৰণ কেৰটিড, বাওঁ ছাবক্লেভিয়েন ধমনী',
        'অৱৰোহী মহাধমনীয়ে বক্ষ, উদৰ, পেলভিছ আৰু ভৰি সংযোগ কৰে',
      ],
    },
    keyFacts: {
      en: [
        'Diameter: ~2.5 cm (largest artery); wall thickness reflects high pressure',
        'Ascending aorta: gives rise to coronary arteries',
        'Aortic arch: brachiocephalic, left common carotid, left subclavian',
        'Thoracic aorta → abdominal aorta → bifurcates into common iliac arteries at L4',
        'Carries OXYGENATED blood (standard artery function)',
      ],
      as: [
        'ব্যাস: ~২.৫ চে.মি. (সৰ্ববৃহৎ ধমনী); গাৰ ডাঠ-এ উচ্চ চাপ প্ৰতিফলিত কৰে',
        'আৰোহী মহাধমনী: কৰোনাৰী ধমনীৰ উৎস',
        'মহাধমনী চাপ: ব্ৰেকিয়েচেফালিক, বাওঁ সাধাৰণ কেৰটিড, বাওঁ ছাবক্লেভিয়েন',
        'বক্ষীয় মহাধমনী → উদৰীয় মহাধমনী → L4-ত সাধাৰণ ইলিয়াক ধমনীত দ্বিভাজিত',
        'অক্সিজেনযুক্ত তেজ কঢ়িয়ায় (মানক ধমনী কাৰ্য)',
      ],
    },
    examNotes: {
      en: [
        'Aorta: largest artery; carries oxygenated blood from LV to body (systemic circulation)',
        'Aortic arch branches: brachiocephalic trunk → right subclavian + right common carotid; left common carotid; left subclavian',
        'Coronary arteries branch from aortic sinuses of ascending aorta (fill during diastole)',
        'Coarctation of aorta: congenital narrowing → hypertension in upper limbs, hypotension in lower limbs',
        'Aortic aneurysm: dilation of aortic wall → risk of rupture (life-threatening emergency)',
      ],
      as: [
        'মহাধমনী: সৰ্ববৃহৎ ধমনী; LV-ৰ পৰা শৰীৰলৈ অক্সিজেনযুক্ত তেজ কঢ়িয়ায় (তন্ত্ৰগত পৰিবহন)',
        'মহাধমনী চাপৰ শাখা: ব্ৰেকিয়েচেফালিক ট্ৰাঙ্ক → সোঁ ছাবক্লেভিয়েন + সোঁ সাধাৰণ কেৰটিড; বাওঁ সাধাৰণ কেৰটিড; বাওঁ ছাবক্লেভিয়েন',
        'কৰোনাৰী ধমনী আৰোহী মহাধমনীৰ মহাধমনী চাইনাছৰ পৰা শাখায়িত (ডায়াষ্টোলৰ সময়ত ভৰে)',
        'মহাধমনীৰ ক‘আৰ্কটেচন: জন্মগত সংকীৰ্ণতা → ওপৰৰ অংগত উচ্চ ৰক্তচাপ, তলৰ অংগত নিম্ন ৰক্তচাপ',
        'মহাধমনী এন্যুৰিজম: মহাধমনী গাৰ স্ফীতি → ফাটিযোৱাৰ আশংকা (জীৱন-বিপন্ন জৰুৰীকালীন)',
      ],
    },
    funFact: {
      en: 'The aorta is so elastic that it expands slightly with every heartbeat, acting as a "pressure reservoir" — this elasticity (Windkessel effect) converts pulsatile blood flow into smoother continuous flow in smaller vessels!',
      as: 'মহাধমনী ইমান স্থিতিস্থাপক যে ই প্ৰতিটো হৃদ-স্পন্দনত অলপ প্ৰসাৰিত হয়, "চাপ ভঁৰাল" ৰূপে কাম কৰে — এই স্থিতিস্থাপকতা (উইণ্ডকেচেল প্ৰভাৱ)-এ স্পন্দনশীল ৰক্ত প্ৰবাহক সৰু পাত্ৰত মসৃণ একেৰাহে প্ৰবাহলৈ ৰূপান্তৰ কৰে!',
    },
    disorders: {
      en: 'Aortic aneurysm, aortic dissection, aortic stenosis, coarctation of aorta, atherosclerosis',
      as: 'মহাধমনী এন্যুৰিজম, মহাধমনী ডিচেকচন, মহাধমনী ষ্টেনচিছ, মহাধমনীৰ ক‘আৰ্কটেচন, এথেৰোস্ক্লেৰছিছ',
    },
    circulationNote: {
      en: 'Blood exits the LV into the aorta at ~120 mmHg. The ascending aorta gives coronary arteries, the arch gives branches to the brain/arms, and the descending aorta carries blood to the thorax, abdomen, and legs — beginning systemic circulation.',
      as: 'তেজ LV-ৰ পৰা ~১২০ mmHg-ত মহাধমনীত প্ৰৱেশ কৰে। আৰোহী মহাধমনীয়ে কৰোনাৰী ধমনী দিয়ে, চাপে মগজু/বাহুলৈ শাখা দিয়ে, আৰু অৱৰোহী মহাধমনীয়ে বক্ষ, উদৰ আৰু ভৰিলৈ তেজ কঢ়িয়ায় — তন্ত্ৰগত পৰিবহন আৰম্ভ কৰে।',
    },
  },

  pulmonaryArtery: {
    id: 'pulmonaryArtery', color: '#2050b8', glowColor: '#4070d8', bloodType: 'deoxygenated',
    name: { en: 'Pulmonary Artery', as: 'ফুসফুসীয় ধমনী' },
    role: { en: 'EXCEPTION: artery carrying deoxygenated blood to lungs',
            as: 'ব্যতিক্ৰম: হাঁওফাঁওলৈ অক্সিজেনবিহীন তেজ কঢ়িয়াই নিয়া ধমনী' },
    description: {
      en: 'The pulmonary artery (pulmonary trunk) carries DEOXYGENATED blood from the right ventricle to the lungs — the crucial EXCEPTION to the rule that "arteries carry oxygenated blood." It bifurcates into left and right pulmonary arteries supplying each lung.',
      as: 'ফুসফুসীয় ধমনীয়ে (ফুসফুসীয় ট্ৰাঙ্ক) সোঁ নিলয়ৰ পৰা হাঁওফাঁওলৈ অক্সিজেনবিহীন তেজ কঢ়িয়াই নিয়ে — "ধমনীয়ে অক্সিজেনযুক্ত তেজ কঢ়িয়ায়" নিয়মৰ গুৰুত্বপূৰ্ণ ব্যতিক্ৰম। ই বাওঁ আৰু সোঁ ফুসফুসীয় ধমনীত দ্বিভাজিত হয় প্ৰতিটো হাঁওফাঁও সংযোগ কৰে।',
    },
    functions: {
      en: [
        'Carries deoxygenated blood from RV to lungs for oxygenation',
        'Bifurcates into left pulmonary artery (to left lung) and right pulmonary artery (to right lung)',
        'Pulmonary circulation begins with the pulmonary trunk',
        'Operates at much lower pressure (~25 mmHg) than aorta (~120 mmHg)',
      ],
      as: [
        'অক্সিজেনৰ বাবে RV-ৰ পৰা হাঁওফাঁওলৈ অক্সিজেনবিহীন তেজ কঢ়িয়ায়',
        'বাওঁ ফুসফুসীয় ধমনী (বাওঁ হাঁওফাঁওলৈ) আৰু সোঁ ফুসফুসীয় ধমনী (সোঁ হাঁওফাঁওলৈ)-ত দ্বিভাজিত হয়',
        'ফুসফুসীয় পৰিবহন ফুসফুসীয় ট্ৰাঙ্কেৰে আৰম্ভ হয়',
        'মহাধমনী (~১২০ mmHg)-তকৈ বহু কম চাপত (~২৫ mmHg) চলে',
      ],
    },
    keyFacts: {
      en: [
        'EXCEPTION: artery that carries DEOXYGENATED blood (only exception to artery = oxygenated rule)',
        'Pulmonary trunk bifurcates at the level of T4/T5 (carina level)',
        'Right PA is longer (goes under aortic arch to right lung)',
        'Carries blue blood despite being called an "artery"',
        'Normal pulmonary artery pressure: 25/10 mmHg (systolic/diastolic)',
      ],
      as: [
        'ব্যতিক্ৰম: অক্সিজেনবিহীন তেজ কঢ়িয়াই নিয়া ধমনী (ধমনী = অক্সিজেনযুক্ত নিয়মৰ একমাত্ৰ ব্যতিক্ৰম)',
        'ফুসফুসীয় ট্ৰাঙ্ক T4/T5 (কেৰিনা) স্তৰত দ্বিভাজিত হয়',
        'সোঁ PA দীঘল (মহাধমনী চাপৰ তলেদি সোঁ হাঁওফাঁওলৈ যায়)',
        '"ধমনী" বুলি কোৱা হ’লেও নীলা তেজ কঢ়িয়ায়',
        'স্বাভাৱিক ফুসফুসীয় ধমনী চাপ: ২৫/১০ mmHg (চিষ্টোলিক/ডায়াষ্টোলিক)',
      ],
    },
    examNotes: {
      en: [
        'KEY EXCEPTION: Pulmonary artery carries DEOXYGENATED blood (opposite of normal arteries)',
        'Pulmonary trunk → right PA (longer) + left PA',
        'Pulmonary hypertension: elevated PA pressure (>25 mmHg) → RV strain → failure',
        'Pulmonary embolism (PE): blood clot in PA → sudden chest pain, breathlessness (emergency)',
        'Patent ductus arteriosus (PDA): connection between PA and aorta persists after birth (fetal remnant)',
      ],
      as: [
        'মুখ্য ব্যতিক্ৰম: ফুসফুসীয় ধমনীয়ে অক্সিজেনবিহীন তেজ কঢ়িয়ায় (স্বাভাৱিক ধমনীৰ বিপৰীতে)',
        'ফুসফুসীয় ট্ৰাঙ্ক → সোঁ PA (দীঘল) + বাওঁ PA',
        'ফুসফুসীয় উচ্চ ৰক্তচাপ: উচ্চ PA চাপ (>২৫ mmHg) → RV চাপ → ব্যৰ্থতা',
        'ফুসফুসীয় এম্বলিজম (PE): PA-ত তেজ গোট → হঠাৎ বুকুৰ বিষ, উশাহ লোৱাত অসুবিধা (জৰুৰীকালীন)',
        'পেটেণ্ট ডাক্টাছ আৰ্টেৰিয়‘ছাছ (PDA): জন্মৰ পিছত PA আৰু মহাধমনীৰ সংযোগ থাকি যায় (ভ্ৰূণৰ অৱশেষ)',
      ],
    },
    funFact: {
      en: 'The pulmonary artery is the body\'s most important "exception" that EVERY biology student must memorize: it is the ONLY artery in the body that carries deoxygenated (blue) blood!',
      as: 'ফুসফুসীয় ধমনী শৰীৰৰ আটাইতকৈ গুৰুত্বপূৰ্ণ "ব্যতিক্ৰম" যিটো প্ৰতিজন জীৱ বিজ্ঞান শিক্ষাৰ্থীয়ে মনত ৰখা প্ৰয়োজন: ই শৰীৰৰ একমাত্ৰ ধমনী যিয়ে অক্সিজেনবিহীন (নীলা) তেজ কঢ়িয়ায়!',
    },
    disorders: {
      en: 'Pulmonary hypertension, pulmonary embolism, patent ductus arteriosus (PDA), pulmonary atresia',
      as: 'ফুসফুসীয় উচ্চ ৰক্তচাপ, ফুসফুসীয় এম্বলিজম, পেটেণ্ট ডাক্টাছ আৰ্টেৰিয়‘ছাছ (PDA), ফুসফুসীয় এট্ৰেচিয়া',
    },
    circulationNote: {
      en: 'The right ventricle pumps deoxygenated blood into the pulmonary trunk. This bifurcates into left and right pulmonary arteries, each carrying this blue, oxygen-poor blood to its respective lung, where the magic of gas exchange will transform it.',
      as: 'সোঁ নিলয়ে অক্সিজেনবিহীন তেজ ফুসফুসীয় ট্ৰাঙ্কত পাম্প কৰে। ই বাওঁ আৰু সোঁ ফুসফুসীয় ধমনীত দ্বিভাজিত হয়, প্ৰতিটোৱে এই নীলা, অক্সিজেন-দুৰ্বল তেজক নিজ নিজ হাঁওফাঁওলৈ কঢ়িয়াই নিয়ে, য’ত গেছ বিনিময়ৰ যাদুৱে ইয়াক ৰূপান্তৰিত কৰিব।',
    },
  },

  pulmonaryVein: {
    id: 'pulmonaryVein', color: '#d03030', glowColor: '#f05050', bloodType: 'oxygenated',
    name: { en: 'Pulmonary Veins', as: 'ফুসফুসীয় শিৰা' },
    role: { en: 'EXCEPTION: veins carrying oxygenated blood from lungs to LA',
            as: 'ব্যতিক্ৰম: হাঁওফাঁওৰ পৰা LA-লৈ অক্সিজেনযুক্ত তেজ কঢ়িয়াই নিয়া শিৰা' },
    description: {
      en: 'The four pulmonary veins (two from each lung) carry OXYGENATED blood from the lungs back to the left atrium — the crucial EXCEPTION to the rule that "veins carry deoxygenated blood." This marks the completion of pulmonary circulation.',
      as: 'চাৰিটা ফুসফুসীয় শিৰাই (প্ৰতিটো হাঁওফাঁওৰ পৰা দুটাকৈ) হাঁওফাঁওৰ পৰা বাওঁ অলিন্দলৈ অক্সিজেনযুক্ত তেজ ঘুৰাই আনে — "শিৰাই অক্সিজেনবিহীন তেজ কঢ়িয়ায়" নিয়মৰ গুৰুত্বপূৰ্ণ ব্যতিক্ৰম। ই ফুসফুসীয় পৰিবহনৰ সম্পূৰ্ণতা সূচায়।',
    },
    functions: {
      en: [
        'Carry freshly oxygenated blood from lung capillaries to the left atrium',
        'Four veins: 2 from right lung (superior and inferior) + 2 from left lung',
        'Complete pulmonary circulation (lung → heart)',
        'Red, oxygen-rich blood — opposite of what typical veins carry',
      ],
      as: [
        'হাঁওফাঁও কেপিলেৰীৰ পৰা বাওঁ অলিন্দলৈ তাজা অক্সিজেনযুক্ত তেজ কঢ়িয়ায়',
        'চাৰিটা শিৰা: সোঁ হাঁওফাঁওৰ পৰা ২টা (ঊৰ্ধ্ব আৰু অধঃ) + বাওঁ হাঁওফাঁওৰ পৰা ২টা',
        'ফুসফুসীয় পৰিবহন সম্পূৰ্ণ কৰে (হাঁওফাঁও → হৃদপিণ্ড)',
        'ৰঙা, অক্সিজেন-সমৃদ্ধ তেজ — সাধাৰণ শিৰাই কঢ়িয়োৱাৰ বিপৰীত',
      ],
    },
    keyFacts: {
      en: [
        'EXCEPTION: veins that carry OXYGENATED blood (only exception to vein = deoxygenated rule)',
        '4 pulmonary veins total: right superior, right inferior, left superior, left inferior — all enter LA',
        'Blood goes from lung capillaries → pulmonary venules → pulmonary veins → LA',
        'Lowest pressure veins in the body (~5–10 mmHg)',
        'No valves in pulmonary veins',
      ],
      as: [
        'ব্যতিক্ৰম: অক্সিজেনযুক্ত তেজ কঢ়িয়াই নিয়া শিৰা (শিৰা = অক্সিজেনবিহীন নিয়মৰ একমাত্ৰ ব্যতিক্ৰম)',
        'মুঠ ৪টা ফুসফুসীয় শিৰা: সোঁ ঊৰ্ধ্ব, সোঁ অধঃ, বাওঁ ঊৰ্ধ্ব, বাওঁ অধঃ — সকলো LA-ত প্ৰৱেশ কৰে',
        'তেজ হাঁওফাঁও কেপিলেৰী → ফুসফুসীয় ভেনিউল → ফুসফুসীয় শিৰা → LA',
        'শৰীৰৰ আটাইতকৈ কম চাপৰ শিৰা (~৫–১০ mmHg)',
        'ফুসফুসীয় শিৰাত কপাটিকা নাই',
      ],
    },
    examNotes: {
      en: [
        'KEY EXCEPTION: Pulmonary veins carry OXYGENATED blood (opposite of normal veins)',
        '4 pulmonary veins: 2 from right lung + 2 from left lung → all drain into left atrium',
        'Pulmonary venous hypertension: elevated pressure → pulmonary edema (fluid in lungs)',
        'Anomalous pulmonary venous drainage: rare condition where PVs drain into right side instead of LA',
        'Complete pulmonary circulation: RV → PA → Lungs → PV → LA',
      ],
      as: [
        'মুখ্য ব্যতিক্ৰম: ফুসফুসীয় শিৰাই অক্সিজেনযুক্ত তেজ কঢ়িয়ায় (স্বাভাৱিক শিৰাৰ বিপৰীতে)',
        '৪টা ফুসফুসীয় শিৰা: সোঁ হাঁওফাঁওৰ পৰা ২টা + বাওঁ হাঁওফাঁওৰ পৰা ২টা → সকলো বাওঁ অলিন্দত খোৱে',
        'ফুসফুসীয় শিৰাজনিত উচ্চ ৰক্তচাপ: উচ্চ চাপ → ফুসফুসীয় শোথ (হাঁওফাঁওত পানী)',
        'অস্বাভাৱিক ফুসফুসীয় শিৰা নিৰ্গমন: বিৰল অৱস্থা য’ত PV-বোৰ LA-ৰ পৰিৱৰ্তে সোঁফালে খোৱে',
        'সম্পূৰ্ণ ফুসফুসীয় পৰিবহন: RV → PA → হাঁওফাঁও → PV → LA',
      ],
    },
    funFact: {
      en: 'The four pulmonary veins are the most oxygenated blood vessels in the body — the blood in them has just been freshly loaded with oxygen in the lungs and hasn\'t delivered it to any tissues yet!',
      as: 'চাৰিটা ফুসফুসীয় শিৰা শৰীৰৰ আটাইতকৈ অক্সিজেনযুক্ত ৰক্তনালী — ইয়াৰ তেজ এইমাত্ৰ হাঁওফাঁওত অক্সিজেনেৰে ভৰোৱা হৈছে আৰু এতিয়াও কোনো কলালৈ পঠিওৱা হোৱা নাই!',
    },
    disorders: {
      en: 'Pulmonary venous hypertension, anomalous pulmonary venous return, pulmonary vein stenosis',
      as: 'ফুসফুসীয় শিৰাজনিত উচ্চ ৰক্তচাপ, অস্বাভাৱিক ফুসফুসীয় শিৰা প্ৰত্যাগমন, ফুসফুসীয় শিৰা ষ্টেনচিছ',
    },
    circulationNote: {
      en: 'After gas exchange in the alveoli (O₂ absorbed, CO₂ released), the bright red oxygenated blood flows from lung capillaries into pulmonary venules, then into the four pulmonary veins, back to the left atrium — completing the pulmonary circuit.',
      as: 'বায়ুকোষত গেছ বিনিময়ৰ পিছত (O₂ অৱশোষিত, CO₂ মুক্ত), উজ্জ্বল ৰঙা অক্সিজেনযুক্ত তেজ হাঁওফাঁও কেপিলেৰীৰ পৰা ফুসফুসীয় ভেনিউল, তাৰ পিছত চাৰিটা ফুসফুসীয় শিৰাৰ যোগেদি বাওঁ অলিন্দলৈ যায় — ফুসফুসীয় চক্ৰ সম্পূৰ্ণ কৰি।',
    },
  },

  superiorVenaCava: {
    id: 'superiorVenaCava', color: '#2858c0', glowColor: '#4878e0', bloodType: 'deoxygenated',
    name: { en: 'Superior Vena Cava (SVC)', as: 'ঊৰ্ধ্ব মহাশিৰা (SVC)' },
    role: { en: 'Returns deoxygenated blood from upper body to right atrium',
            as: 'ওপৰৰ শৰীৰৰ পৰা সোঁ অলিন্দলৈ অক্সিজেনবিহীন তেজ ঘুৰাই আনে' },
    description: {
      en: 'The superior vena cava is a large vein (~7 cm long, 2 cm diameter) that collects deoxygenated blood from the upper half of the body (head, neck, arms, and thorax) and empties it into the right atrium.',
      as: 'ঊৰ্ধ্ব মহাশিৰা হৈছে এক ডাঙৰ শিৰা (~৭ চে.মি. দীঘল, ২ চে.মি. ব্যাস) যিয়ে শৰীৰৰ ওপৰৰ আধাৰ পৰা (মূৰ, ডিঙি, বাহু আৰু বক্ষ) অক্সিজেনবিহীন তেজ সংগ্ৰহ কৰি সোঁ অলিন্দত ঢালি দিয়ে।',
    },
    functions: {
      en: [
        'Drains all venous blood from head, neck, upper limbs, and thorax into RA',
        'Formed by union of right and left brachiocephalic veins',
        'Empties into the upper part of the right atrium',
        'No valves — relies on respiratory pressure changes and right atrial pressure',
      ],
      as: [
        'মূৰ, ডিঙি, ওপৰৰ অংগ আৰু বক্ষৰ সকলো শিৰাৰ তেজ RA-লৈ নিকাশ কৰে',
        'সোঁ আৰু বাওঁ ব্ৰেকিয়েচেফালিক শিৰাৰ মিলনেৰে গঠিত',
        'সোঁ অলিন্দৰ ওপৰৰ অংশত খোৱে',
        'কপাটিকা নাই — শ্বসন চাপ পৰিৱৰ্তন আৰু সোঁ অলিন্দ চাপৰ ওপৰত নিৰ্ভৰ কৰে',
      ],
    },
    keyFacts: {
      en: [
        'Receives blood from head, neck, arms, and upper thorax',
        'Formed by right + left brachiocephalic (innominate) veins at T1 level',
        'Enters RA from above (superior aspect)',
        'No valves (unlike peripheral veins)',
        'SVC obstruction → SVC syndrome: facial edema, distended neck veins',
      ],
      as: [
        'মূৰ, ডিঙি, বাহু আৰু ওপৰৰ বক্ষৰ পৰা তেজ পায়',
        'T1 স্তৰত সোঁ + বাওঁ ব্ৰেকিয়েচেফালিক (ইনোমিনেট) শিৰাৰ মিলনেৰে গঠিত',
        'RA-ত ওপৰৰ পৰা প্ৰৱেশ কৰে (ঊৰ্ধ্ব দিশ)',
        'কপাটিকা নাই (প্ৰান্তীয় শিৰাৰ বিপৰীতে)',
        'SVC বাধা → SVC ছিনড্ৰম: মুখৰ শোথ, ডিঙিৰ শিৰা স্ফীত',
      ],
    },
    examNotes: {
      en: [
        'SVC receives blood from UPPER body; IVC from LOWER body — both drain into RA',
        'SVC syndrome: compression of SVC (e.g., by lung cancer/lymph nodes) → facial/upper extremity edema',
        'Formed by union of brachiocephalic veins behind the right sternoclavicular joint',
        'Central venous catheters are often placed in SVC for monitoring',
        'JVP (jugular venous pressure) reflects SVC and RA pressure',
      ],
      as: [
        'SVC-এ ওপৰৰ শৰীৰৰ পৰা তেজ পায়; IVC-এ তলৰ শৰীৰৰ পৰা — দুয়োটাই RA-ত খোৱে',
        'SVC ছিনড্ৰম: SVC-ৰ চেপ (যেনে হাঁওফাঁও কৰ্কট/লিম্ফ নডৰ দ্বাৰা) → মুখ/ওপৰৰ অংগ শোথ',
        'সোঁ ষ্টাৰ্ণোক্লেভিকুলাৰ জইণ্টৰ পিছত ব্ৰেকিয়েচেফালিক শিৰাৰ মিলনেৰে গঠিত',
        'কেন্দ্ৰীয় শিৰা কেথেটাৰ প্ৰায়ে নিৰীক্ষণৰ বাবে SVC-ত স্থাপন কৰা হয়',
        'JVP (জুগুলাৰ শিৰাজনিত চাপ)-এ SVC আৰু RA চাপ প্ৰতিফলিত কৰে',
      ],
    },
    funFact: {
      en: 'If you\'ve ever seen a doctor look at a patient\'s neck veins, they\'re estimating the pressure in the SVC — your jugular veins give a direct "window" into the right atrium\'s filling pressure!',
      as: 'যদি আপুনি কেতিয়াবা চিকিৎসকক ৰোগীৰ ডিঙিৰ শিৰা চাই থকা দেখিছে, তেওঁ SVC-ৰ চাপ অনুমান কৰি আছে — আপোনাৰ জুগুলাৰ শিৰাই সোঁ অলিন্দৰ পূৰণ চাপলৈ পোনে পোনে "জনুৱেল" প্ৰদান কৰে!',
    },
    disorders: {
      en: 'SVC syndrome (compression by tumor/clot), SVC thrombosis, persistent left SVC (rare variant)',
      as: 'SVC ছিনড্ৰম (টিউমাৰ/তেজ গোটৰ চেপ), SVC থ্ৰম্বছিছ, ধাৰাবাহিক বাওঁ SVC (বিৰল ভিন্নৰূপ)',
    },
    circulationNote: {
      en: 'Deoxygenated blood from your brain, head, neck, and arms flows down into the SVC by gravity and venous pressure. This large vein empties directly into the right atrium from above, completing the upper-body venous return.',
      as: 'আপোনাৰ মগজু, মূৰ, ডিঙি আৰু বাহুৰ অক্সিজেনবিহীন তেজ অভিকৰ্ষ আৰু শিৰাজনিত চাপৰ যোগেদি SVC-লৈ তললৈ যায়। এই ডাঙৰ শিৰাই ওপৰৰ পৰা পোনে পোনে সোঁ অলিন্দত খোৱে, ওপৰৰ শৰীৰৰ শিৰা প্ৰত্যাগমন সম্পূৰ্ণ কৰি।',
    },
  },

  inferiorVenaCava: {
    id: 'inferiorVenaCava', color: '#2050b0', glowColor: '#4070d0', bloodType: 'deoxygenated',
    name: { en: 'Inferior Vena Cava (IVC)', as: 'অধঃ মহাশিৰা (IVC)' },
    role: { en: 'Returns deoxygenated blood from lower body to right atrium',
            as: 'তলৰ শৰীৰৰ পৰা সোঁ অলিন্দলৈ অক্সিজেনবিহীন তেজ ঘুৰাই আনে' },
    description: {
      en: 'The inferior vena cava is the largest vein in the body, draining deoxygenated blood from the lower half of the body (abdomen, pelvis, and lower limbs) upward into the right atrium. It passes through the diaphragm at T8 level.',
      as: 'অধঃ মহাশিৰা হৈছে শৰীৰৰ সৰ্ববৃহৎ শিৰা, শৰীৰৰ তলৰ আধাৰ পৰা (উদৰ, পেলভিছ আৰু তলৰ অংগ) অক্সিজেনবিহীন তেজ ওপৰলৈ সোঁ অলিন্দত নিকাশ কৰে। ই T8 স্তৰত ডায়াফ্ৰামৰ মাজেৰে যায়।',
    },
    functions: {
      en: [
        'Drains all venous blood from abdomen, pelvis, and lower limbs into RA',
        'Largest vein in the body (by diameter: ~3 cm)',
        'Passes through diaphragm at T8 vertebral level to enter RA from below',
        'Receives blood from hepatic veins, renal veins, gonadal veins, iliac veins, etc.',
      ],
      as: [
        'উদৰ, পেলভিছ আৰু তলৰ অংগৰ সকলো শিৰাজনিত তেজ RA-লৈ নিকাশ কৰে',
        'শৰীৰৰ সৰ্ববৃহৎ শিৰা (ব্যাসেৰে: ~৩ চে.মি.)',
        'T8 কশেৰুকা স্তৰত ডায়াফ্ৰামৰ মাজেৰে গৈ RA-ত তলৰ পৰা প্ৰৱেশ কৰে',
        'হেপাটিক শিৰা, ৰেনাল শিৰা, গনাডেল শিৰা, ইলিয়াক শিৰা ইত্যাদিৰ পৰা তেজ পায়',
      ],
    },
    keyFacts: {
      en: [
        'Largest vein in the body by diameter (~3 cm)',
        'Formed by union of right + left common iliac veins at L4–L5 level',
        'Receives: hepatic veins, renal veins, suprarenal (adrenal) veins, lumbar veins',
        'IVC has a valve (Eustachian valve) at its RA entrance (vestigial in adults)',
        'IVC does NOT receive blood from GI tract directly (that goes to portal vein first)',
      ],
      as: [
        'ব্যাসেৰে শৰীৰৰ সৰ্ববৃহৎ শিৰা (~৩ চে.মি.)',
        'L4–L5 স্তৰত সোঁ + বাওঁ সাধাৰণ ইলিয়াক শিৰাৰ মিলনেৰে গঠিত',
        'পায়: হেপাটিক শিৰা, ৰেনাল শিৰা, ছুপ্ৰাৰেনাল (এড্ৰিনেল) শিৰা, লাম্বাৰ শিৰা',
        'IVC-ৰ RA প্ৰৱেশদ্বাৰত এটা কপাটিকা আছে (ইউষ্টেচিয়ান কপাটিকা) (প্ৰাপ্তবয়স্কত অৱশেষ মাত্ৰ)',
        'IVC-এ GI ট্ৰেক্টৰ পৰা পোনে পোনে তেজ নাপায় (সেইটো প্ৰথমে পৰ্টেল শিৰালৈ যায়)',
      ],
    },
    examNotes: {
      en: [
        'IVC: largest vein; returns blood from below diaphragm to RA',
        'IVC passes through diaphragm at T8; esophagus at T10; aorta at T12 (mnemonic: IVC 8, esophagus 10, aorta 12)',
        'IVC obstruction → swollen legs, distended abdominal veins, hepatic congestion',
        'Hepatic veins drain liver blood into IVC (portal blood goes to liver, then hepatic veins → IVC)',
        'NCERT: SVC and IVC return deoxygenated blood to right atrium',
      ],
      as: [
        'IVC: সৰ্ববৃহৎ শিৰা; ডায়াফ্ৰামৰ তলৰ পৰা RA-লৈ তেজ ঘুৰাই আনে',
        'IVC T8-ত ডায়াফ্ৰামৰ মাজেৰে যায়; অন্ননালী T10-ত; মহাধমনী T12-ত (সূত্ৰ: IVC ৮, অন্ননালী ১০, মহাধমনী ১২)',
        'IVC বাধা → ফুলা ভৰি, স্ফীত উদৰীয় শিৰা, হেপাটিক কনজেচন',
        'হেপাটিক শিৰাই যকৃতৰ তেজ IVC-লৈ নিকাশ কৰে (পৰ্টেল তেজ যকৃতলৈ যায়, তাৰ পিছত হেপাটিক শিৰা → IVC)',
        'NCERT: SVC আৰু IVC-এ অক্সিজেনবিহীন তেজ সোঁ অলিন্দলৈ ঘুৰাই আনে',
      ],
    },
    funFact: {
      en: 'Despite being the body\'s largest vein, the IVC has to work against gravity to return blood from your legs to your heart — that\'s why people who stand for long periods get swollen ankles as blood pools in their lower extremities!',
      as: 'শৰীৰৰ সৰ্ববৃহৎ শিৰা হোৱাৰ পিছতো, IVC-এ ভৰিৰ পৰা হৃদপিণ্ডলৈ তেজ ঘুৰাই আনিবলৈ অভিকৰ্ষৰ বিৰুদ্ধে কাম কৰিব লাগে — সেইবাবেই দীঘল সময় থিয় হৈ থকা মানুহৰ ভৰিৰ আঁঠুৱে ফুলি যায় কাৰণ তলৰ অংগত তেজ জমা হয়!',
    },
    disorders: {
      en: 'Deep vein thrombosis (DVT), IVC thrombosis, IVC filter insertion, Budd-Chiari syndrome',
      as: 'গভীৰ শিৰা থ্ৰম্বছিছ (DVT), IVC থ্ৰম্বছিছ, IVC ফিল্টাৰ সন্নিৱেশ, বাড-চিয়াৰী ছিনড্ৰম',
    },
    circulationNote: {
      en: 'Deoxygenated blood from the lower body — legs, pelvis, abdomen, and liver — flows upward through the IVC against gravity. This massive vein empties into the right atrium from below, completing the lower-body venous return and allowing the cycle to continue.',
      as: 'তলৰ শৰীৰৰ — ভৰি, পেলভিছ, উদৰ আৰু যকৃতৰ — অক্সিজেনবিহীন তেজ অভিকৰ্ষৰ বিৰুদ্ধে IVC-ৰ যোগেদি ওপৰলৈ যায়। এই বিশাল শিৰাই তলৰ পৰা সোঁ অলিন্দত খোৱে, তলৰ শৰীৰৰ শিৰা প্ৰত্যাগমন সম্পূৰ্ণ কৰি চক্ৰটো চলি থকাৰ অনুমতি দিয়ে।',
    },
  },

  lungs: {
    id: 'lungs', color: '#c8a0b8', glowColor: '#e0b8d0', bloodType: 'both',
    name: { en: 'Lungs (Pulmonary Capillaries)', as: 'হাঁওফাঁও (ফুসফুসীয় কেপিলেৰী)' },
    role: { en: 'Gas exchange — O₂ absorbed, CO₂ released; blue blood → red blood',
            as: 'গেছ বিনিময় — O₂ অৱশোষিত, CO₂ মুক্ত; নীলা তেজ → ৰঙা তেজ' },
    description: {
      en: 'In the context of circulation, the lungs are where the critical gas exchange occurs. Deoxygenated blood from the pulmonary artery flows through millions of alveolar capillaries, absorbing O₂ and releasing CO₂ — transforming blue deoxygenated blood into bright red oxygenated blood.',
      as: 'পৰিবহনৰ পৰিপ্ৰেক্ষিতত, হাঁওফাঁওত সংকটজনক গেছ বিনিময় হয়। ফুসফুসীয় ধমনীৰ পৰা অক্সিজেনবিহীন তেজ লাখ লাখ বায়ুকোষীয় কেপিলেৰীৰ মাজেৰে যায়, O₂ অৱশোষণ কৰে আৰু CO₂ মুক্ত কৰে — নীলা অক্সিজেনবিহীন তেজক উজ্জ্বল ৰঙা অক্সিজেনযুক্ত তেজলৈ ৰূপান্তৰ কৰে।',
    },
    functions: {
      en: [
        'Receive deoxygenated blood via pulmonary arteries',
        'Alveolar capillaries absorb O₂ (PO₂ alveoli=104 mmHg > blood=40 mmHg)',
        'Release CO₂ from blood into alveoli (PCO₂ blood=45 > alveoli=40 mmHg)',
        'Return oxygenated blood to LA via pulmonary veins',
        'Complete pulmonary (lesser) circulation',
      ],
      as: [
        'ফুসফুসীয় ধমনীৰ যোগেদি অক্সিজেনবিহীন তেজ পায়',
        'বায়ুকোষীয় কেপিলেৰীয়ে O₂ অৱশোষণ কৰে (PO₂ বায়ুকোষ=১০৪ mmHg > তেজ=৪০ mmHg)',
        'তেজৰ পৰা বায়ুকোষলৈ CO₂ মুক্ত কৰে (PCO₂ তেজ=৪৫ > বায়ুকোষ=৪০ mmHg)',
        'ফুসফুসীয় শিৰাৰ যোগেদি অক্সিজেনযুক্ত তেজ LA-লৈ ঘুৰাই দিয়ে',
        'ফুসফুসীয় (লঘু) পৰিবহন সম্পূৰ্ণ কৰে',
      ],
    },
    keyFacts: {
      en: [
        '~600 million alveoli with dense capillary network',
        'Gas exchange by diffusion across respiratory membrane (0.1–0.2 μm thick)',
        'Pulmonary circulation is a LOW-PRESSURE system (~25/10 mmHg)',
        'Right lung receives slightly more blood (wider, shorter right PA)',
        'Blood takes <1 second to traverse pulmonary capillaries — rapid gas exchange',
      ],
      as: [
        '~৬০ কোটি বায়ুকোষ ঘন কেপিলেৰী জালেৰে',
        'শ্বসন আৱৰণৰ (০.১–০.২ μm ডাঠ) মাজেৰে ব্যাপন দ্বাৰা গেছ বিনিময়',
        'ফুসফুসীয় পৰিবহন এক কম-চাপৰ ব্যৱস্থা (~২৫/১০ mmHg)',
        'সোঁ হাঁওফাঁওয়ে অলপ অধিক তেজ পায় (বহল, চুটি সোঁ PA)',
        'ফুসফুসীয় কেপিলেৰী অতিক্ৰম কৰিবলৈ তেজে <১ ছেকেণ্ড লয় — দ্ৰুত গেছ বিনিময়',
      ],
    },
    examNotes: {
      en: [
        'Pulmonary circulation: RV → PA → lung capillaries → PV → LA',
        'O₂ diffuses from alveoli (PO₂=104 mmHg) into blood (40 mmHg) by diffusion gradient',
        'CO₂ diffuses from blood (45 mmHg) into alveoli (40 mmHg) and is exhaled',
        'Blood changes from BLUE (deoxygenated) to RED (oxygenated) in lung capillaries',
        'Pulmonary edema: fluid in alveoli (from high pulmonary venous pressure) → impairs gas exchange',
      ],
      as: [
        'ফুসফুসীয় পৰিবহন: RV → PA → হাঁওফাঁও কেপিলেৰী → PV → LA',
        'O₂ ব্যাপন গ্ৰেডিয়েণ্টৰ যোগেদি বায়ুকোষৰ (PO₂=১০৪ mmHg) পৰা তেজলৈ (৪০ mmHg) ব্যাপিত হয়',
        'CO₂ তেজৰ (৪৫ mmHg) পৰা বায়ুকোষলৈ (৪০ mmHg) ব্যাপিত হয় আৰু উশাহেৰে ত্যাগ কৰা হয়',
        'হাঁওফাঁও কেপিলেৰীত তেজ নীলা (অক্সিজেনবিহীন)-ৰ পৰা ৰঙা (অক্সিজেনযুক্ত)-লৈ সলনি হয়',
        'ফুসফুসীয় শোথ: বায়ুকোষত পানী (উচ্চ ফুসফুসীয় শিৰাজনিত চাপৰ পৰা) → গেছ বিনিময় ব্যাহত কৰে',
      ],
    },
    funFact: {
      en: 'In a single heartbeat (~0.8 seconds), blood passing through the alveolar capillaries picks up enough oxygen to fuel your body for the NEXT entire beat. This incredibly rapid exchange occurs in capillaries thinner than a human hair!',
      as: 'এটা একক হৃদ-স্পন্দনত (~০.৮ ছেকেণ্ড), বায়ুকোষীয় কেপিলেৰীৰ মাজেৰে যোৱা তেজে আপোনাৰ শৰীৰক পৰৱৰ্তী সম্পূৰ্ণ স্পন্দনৰ বাবে ইন্ধন দিবলৈ যথেষ্ট অক্সিজেন তোলে। মানৱ চুলিতকৈও পাতল কেপিলেৰীত এই অবিশ্বাস্যভাৱে দ্ৰুত বিনিময় হয়!',
    },
    disorders: {
      en: 'Pulmonary edema, pulmonary hypertension, pneumonia (infection impairs gas exchange), pulmonary embolism',
      as: 'ফুসফুসীয় শোথ, ফুসফুসীয় উচ্চ ৰক্তচাপ, নিউমোনিয়া (সংক্ৰমণে গেছ বিনিময় ব্যাহত কৰে), ফুসফুসীয় এম্বলিজম',
    },
    circulationNote: {
      en: 'The critical transformation point: deoxygenated blue blood arrives via pulmonary arteries. In millions of alveolar capillaries, O₂ floods across the thin respiratory membrane into the blood while CO₂ exits. The blood literally changes color — from blue to red — as it picks up 97% oxygen saturation.',
      as: 'গুৰুত্বপূৰ্ণ ৰূপান্তৰৰ বিন্দু: অক্সিজেনবিহীন নীলা তেজ ফুসফুসীয় ধমনীৰ যোগেদি আহি পায়। লাখ লাখ বায়ুকোষীয় কেপিলেৰীত, O₂ পাতল শ্বসন আৱৰণৰ যোগেদি তেজলৈ প্ৰৱেশ কৰে আৰু CO₂ ওলায়। তেজৰ আক্ষৰিক অৰ্থত ৰং সলনি হয় — নীলাৰ পৰা ৰঙালৈ — যেতিয়া ই ৯৭% অক্সিজেন চেচুৰেচন তোলে।',
    },
  },

  bodyCapillaries: {
    id: 'bodyCapillaries', color: '#c83030', glowColor: '#e05050', bloodType: 'both',
    name: { en: 'Body Capillaries (Systemic)', as: 'দৈহিক কেপিলেৰী (তন্ত্ৰগত)' },
    role: { en: 'Deliver O₂ to body cells; collect CO₂; start of venous return',
            as: 'দেহৰ কোষলৈ O₂ পঠিয়ায়; CO₂ সংগ্ৰহ কৰে; শিৰা প্ৰত্যাগমনৰ আৰম্ভণি' },
    description: {
      en: 'The systemic capillaries are the microscopic exchange vessels (~8–10 μm diameter, 1 cell thick) throughout every tissue of the body. They receive oxygenated blood from arterioles and release O₂ to cells while absorbing CO₂ and waste — beginning the venous return.',
      as: 'তন্ত্ৰগত কেপিলেৰী হৈছে শৰীৰৰ প্ৰতিটো কলাত থকা অণুদৰ্শী বিনিময় পাত্ৰ (~৮–১০ μm ব্যাস, ১ কোষ ডাঠ)। ইহঁতে আৰ্টেৰিয়\'ল-ৰ পৰা অক্সিজেনযুক্ত তেজ পায় আৰু কোষলৈ O₂ ছাড়ি দিয়ে আৰু লগতে CO₂ আৰু বৰ্জ্য অৱশোষণ কৰে — শিৰা প্ৰত্যাগমন আৰম্ভ কৰি।',
    },
    functions: {
      en: [
        'Deliver oxygen and nutrients from blood to every body cell',
        'Collect CO₂, metabolic waste, and used blood from tissues',
        'Blood changes from RED (oxygenated) to BLUE (deoxygenated) here',
        'Start of venous return to the heart',
        'Site of actual TISSUE-LEVEL gas exchange (vs alveolar gas exchange in lungs)',
      ],
      as: [
        'তেজৰ পৰা প্ৰতিটো দেহ কোষলৈ অক্সিজেন আৰু পুষ্টি পঠিয়ায়',
        'কলাৰ পৰা CO₂, বিপাকীয় বৰ্জ্য আৰু ব্যৱহৃত তেজ সংগ্ৰহ কৰে',
        'ইয়াতে তেজ ৰঙা (অক্সিজেনযুক্ত)-ৰ পৰা নীলা (অক্সিজেনবিহীন)-লৈ সলনি হয়',
        'হৃদপিণ্ডলৈ শিৰা প্ৰত্যাগমনৰ আৰম্ভণি',
        'প্ৰকৃত কলা-স্তৰৰ গেছ বিনিময়ৰ স্থান (হাঁওফাঁওত বায়ুকোষীয় গেছ বিনিময়ৰ বিপৰীতে)',
      ],
    },
    keyFacts: {
      en: [
        'Diameter: 5–10 μm (just wide enough for 1 red blood cell at a time!)',
        'Wall: single layer of endothelial cells (1 cell thick) for easy diffusion',
        'Total length of all capillaries in human body: ~25,000 miles (~40,000 km)!',
        'Capillary beds connect arterioles to venules',
        'O₂ saturation drops from ~98% (arterial) to ~65–70% (venous) at rest',
      ],
      as: [
        'ব্যাস: ৫–১০ μm (এবাৰত মাত্ৰ ১টা ৰঙা ৰক্তকণিকা ঢুকিব পৰাকৈ বহল!)',
        'গা: সহজ ব্যাপনৰ বাবে এণ্ডোথেলিয়েল কোষৰ এটা স্তৰ (১ কোষ ডাঠ)',
        'মানৱ দেহৰ সকলো কেপিলেৰীৰ মুঠ দৈৰ্ঘ্য: ~২৫,০০০ মাইল (~৪০,০০০ কি.মি.)!',
        'কেপিলেৰী বেডে আৰ্টেৰিয়‘লক ভেনিউলৰ লগত সংযোগ কৰে',
        'O₂ চেচুৰেচন ~৯৮% (ধমনীয়)-ৰ পৰা ~৬৫–৭০% (শিৰাজনিত)-লৈ পৰে জিৰণিত অৱস্থাত',
      ],
    },
    examNotes: {
      en: [
        'Systemic capillaries: site of O₂/nutrient delivery and CO₂/waste collection in TISSUES',
        'Oxygenated blood (red, from aorta) → arterioles → capillaries → O₂ released → venules → deoxygenated blood (blue)',
        'Deoxygenated blood from capillaries → venules → veins → SVC/IVC → RA',
        'Complete systemic circulation: LV → Aorta → arteries → arterioles → capillaries → venules → veins → SVC/IVC → RA',
        'Fick\'s principle: O₂ consumption = cardiac output × (arterial-venous O₂ difference)',
      ],
      as: [
        'তন্ত্ৰগত কেপিলেৰী: কলাত O₂/পুষ্টি পঠিওৱা আৰু CO₂/বৰ্জ্য সংগ্ৰহৰ স্থান',
        'অক্সিজেনযুক্ত তেজ (ৰঙা, মহাধমনীৰ পৰা) → আৰ্টেৰিয়‘ল → কেপিলেৰী → O₂ মুক্ত → ভেনিউল → অক্সিজেনবিহীন তেজ (নীলা)',
        'কেপিলেৰীৰ পৰা অক্সিজেনবিহীন তেজ → ভেনিউল → শিৰা → SVC/IVC → RA',
        'সম্পূৰ্ণ তন্ত্ৰগত পৰিবহন: LV → মহাধমনী → ধমনী → আৰ্টেৰিয়‘ল → কেপিলেৰী → ভেনিউল → শিৰা → SVC/IVC → RA',
        'ফিকৰ নীতি: O₂ ব্যৱহাৰ = কাৰ্ডিয়াক আউটপুট × (ধমনীয়-শিৰাজনিত O₂ পাৰ্থক্য)',
      ],
    },
    funFact: {
      en: 'If you laid out all the capillaries in a human body end-to-end, they would stretch approximately 40,000 km — long enough to circle the Earth at the equator!',
      as: 'যদি আপুনি মানৱ দেহৰ সকলো কেপিলেৰীক মুৰৰ পৰা মুৰলৈ পাৰি দিয়ে, ই প্ৰায় ৪০,০০০ কি.মি. ব্যাপ্ত হ’ব — বিষুৱৰেখাত পৃথিৱীক আগুৰি ধৰিব পৰাকৈ দীঘল!',
    },
    disorders: {
      en: 'Peripheral vascular disease, diabetic microangiopathy, capillary leak syndrome, Raynaud\'s phenomenon',
      as: 'প্ৰান্তীয় ৰক্তনালী ৰোগ, মধুমেহজনিত মাইক্ৰোএনজিয়‘পেথী, কেপিলেৰী লিক ছিনড্ৰম, ৰেনডৰ পৰিঘটনা',
    },
    circulationNote: {
      en: 'Red, oxygen-rich blood from the aorta reaches every cell via arterioles and capillaries. Here oxygen diffuses into tissues and CO₂ diffuses into blood. The blood turns blue and flows into venules → veins → SVC/IVC → right atrium, completing the systemic circuit.',
      as: 'মহাধমনীৰ পৰা ৰঙা, অক্সিজেন-সমৃদ্ধ তেজ আৰ্টেৰিয়‘ল আৰু কেপিলেৰীৰ যোগেদি প্ৰতিটো কোষলৈ যায়। ইয়াত অক্সিজেন কলাত ব্যাপিত হয় আৰু CO₂ তেজলৈ ব্যাপিত হয়। তেজ নীলা হৈ যায় আৰু ভেনিউল → শিৰা → SVC/IVC → সোঁ অলিন্দলৈ যায়, তন্ত্ৰগত চক্ৰ সম্পূৰ্ণ কৰি।',
    },
  },
};

export const JOURNEY_STEPS: JourneyStep[] = [
  { x: 270, y: 605, structureId: 'bodyCapillaries',
    stage:     { en: 'Body Tissues',                       as: 'দেহৰ কলা' },
    shortNote: { en: 'O₂ delivered to cells. CO₂ collected. Blood becomes deoxygenated (blue).',
                 as: 'কোষলৈ O₂ পঠিওৱা হ’ল। CO₂ সংগৃহীত। তেজ অক্সিজেনবিহীন (নীলা) হ’ল।' } },
  { x: 215, y: 545, structureId: 'inferiorVenaCava',
    stage:     { en: 'Inferior Vena Cava',                 as: 'অধঃ মহাশিৰা' },
    shortNote: { en: 'Deoxygenated blood from lower body flows upward through the IVC.',
                 as: 'তলৰ শৰীৰৰ অক্সিজেনবিহীন তেজ IVC-ৰ যোগেদি ওপৰলৈ যায়।' } },
  { x: 215, y: 78,  structureId: 'superiorVenaCava',
    stage:     { en: 'Superior Vena Cava',                 as: 'ঊৰ্ধ্ব মহাশিৰা' },
    shortNote: { en: 'Blood from upper body (head/arms) descends via SVC into right atrium.',
                 as: 'ওপৰৰ শৰীৰৰ (মূৰ/বাহু) তেজ SVC-ৰ যোগেদি সোঁ অলিন্দলৈ নামে।' } },
  { x: 205, y: 218, structureId: 'rightAtrium',
    stage:     { en: 'Right Atrium',                       as: 'সোঁ অলিন্দ' },
    shortNote: { en: 'SA node fires. RA contracts. Tricuspid valve opens. Blood enters RV.',
                 as: 'SA নড উদ্দীপ্ত হয়। RA সংকোচিত হয়। ত্ৰিৰূপ কপাটিকা খোলে। তেজ RV-ত প্ৰৱেশ কৰে।' } },
  { x: 205, y: 285, structureId: 'tricuspidValve',
    stage:     { en: 'Tricuspid Valve Opens',              as: 'ত্ৰিৰূপ কপাটিকা খোলে' },
    shortNote: { en: 'AV valve opens during diastole. Deoxygenated blood flows into RV.',
                 as: 'ডায়াষ্টোলৰ সময়ত AV কপাটিকা খোলে। অক্সিজেনবিহীন তেজ RV-ত যায়।' } },
  { x: 205, y: 365, structureId: 'rightVentricle',
    stage:     { en: 'Right Ventricle',                    as: 'সোঁ নিলয়' },
    shortNote: { en: 'RV contracts. Tricuspid closes (Lubb!). Pulmonary valve opens. Blood ejected.',
                 as: 'RV সংকোচিত হয়। ত্ৰিৰূপ বন্ধ (লাব!)। ফুসফুসীয় কপাটিকা খোলে। তেজ ছাড়ি দিয়া হয়।' } },
  { x: 235, y: 148, structureId: 'pulmonaryValve',
    stage:     { en: 'Pulmonary Valve Opens',              as: 'ফুসফুসীয় কপাটিকা খোলে' },
    shortNote: { en: 'Semilunar valve opens. Deoxygenated blood enters pulmonary trunk.',
                 as: 'অৰ্ধচন্দ্ৰাকৃতি কপাটিকা খোলে। অক্সিজেনবিহীন তেজ ফুসফুসীয় ট্ৰাঙ্কত যায়।' } },
  { x: 135, y: 215, structureId: 'pulmonaryArtery',
    stage:     { en: 'Pulmonary Artery',                   as: 'ফুসফুসীয় ধমনী' },
    shortNote: { en: 'Blue deoxygenated blood travels to both lungs. Pulmonary circulation begins.',
                 as: 'নীলা অক্সিজেনবিহীন তেজ দুয়োটা হাঁওফাঁওলৈ যায়। ফুসফুসীয় পৰিবহন আৰম্ভ।' } },
  { x: 108, y: 282, structureId: 'lungs',
    stage:     { en: 'Lung Capillaries (O₂!)',             as: 'হাঁওফাঁও কেপিলেৰী (O₂!)' },
    shortNote: { en: 'O₂ absorbed (104→40 mmHg), CO₂ released. Blue blood becomes RED.',
                 as: 'O₂ অৱশোষিত (১০৪→৪০ mmHg), CO₂ মুক্ত। নীলা তেজ ৰঙা হ’ল।' } },
  { x: 145, y: 352, structureId: 'pulmonaryVein',
    stage:     { en: 'Pulmonary Veins',                    as: 'ফুসফুসীয় শিৰা' },
    shortNote: { en: 'Oxygenated blood returns via 4 pulmonary veins → left atrium.',
                 as: '৪টা ফুসফুসীয় শিৰাৰ যোগেদি অক্সিজেনযুক্ত তেজ → বাওঁ অলিন্দলৈ ঘূৰি যায়।' } },
  { x: 335, y: 218, structureId: 'leftAtrium',
    stage:     { en: 'Left Atrium',                        as: 'বাওঁ অলিন্দ' },
    shortNote: { en: 'Oxygenated blood received. LA contracts. Mitral valve opens.',
                 as: 'অক্সিজেনযুক্ত তেজ গ্ৰহণ। LA সংকোচিত হয়। মাইট্ৰেল কপাটিকা খোলে।' } },
  { x: 325, y: 285, structureId: 'mitralValve',
    stage:     { en: 'Mitral Valve Opens',                 as: 'মাইট্ৰেল কপাটিকা খোলে' },
    shortNote: { en: 'Bicuspid valve opens. Oxygenated blood flows from LA → LV.',
                 as: 'দ্বিৰূপ কপাটিকা খোলে। অক্সিজেনযুক্ত তেজ LA → LV-লৈ যায়।' } },
  { x: 335, y: 375, structureId: 'leftVentricle',
    stage:     { en: 'Left Ventricle',                     as: 'বাওঁ নিলয়' },
    shortNote: { en: 'Most powerful pump. Mitral closes (Lubb!). Aortic valve opens. 120 mmHg.',
                 as: 'আটাইতকৈ শক্তিশালী পাম্প। মাইট্ৰেল বন্ধ (লাব!)। মহাধমনী কপাটিকা খোলে। ১২০ mmHg।' } },
  { x: 312, y: 148, structureId: 'aorticValve',
    stage:     { en: 'Aortic Valve Opens',                 as: 'মহাধমনী কপাটিকা খোলে' },
    shortNote: { en: 'Semilunar valve opens. Oxygenated blood ejected into the aorta.',
                 as: 'অৰ্ধচন্দ্ৰাকৃতি কপাটিকা খোলে। অক্সিজেনযুক্ত তেজ মহাধমনীত ছাড়ি দিয়া হয়।' } },
  { x: 195, y: 55,  structureId: 'aorta',
    stage:     { en: 'Aorta — Systemic Start',             as: 'মহাধমনী — তন্ত্ৰগত আৰম্ভ' },
    shortNote: { en: 'Red oxygenated blood enters the aorta at 120 mmHg. Distributed to body.',
                 as: 'ৰঙা অক্সিজেনযুক্ত তেজ ১২০ mmHg-ত মহাধমনীত যায়। শৰীৰলৈ বিতৰিত।' } },
  { x: 270, y: 605, structureId: 'bodyCapillaries',
    stage:     { en: 'Body Tissues — Complete!',           as: 'দেহৰ কলা — সম্পূৰ্ণ!' },
    shortNote: { en: 'O₂ delivered to cells. Cycle repeats ~72 times/minute. Double circulation complete!',
                 as: 'কোষলৈ O₂ পঠিওৱা হ’ল। চক্ৰ মিনিটত ~৭২ বাৰ পুনৰাবৃত্তি হয়। দ্বৈত পৰিবহন সম্পূৰ্ণ!' } },
];

export const QUIZ_DATA: QuizQ[] = [
  {
    q: { en: 'Which chamber of the heart pumps blood to the lungs?',
         as: 'হৃদপিণ্ডৰ কোন প্ৰকোষ্ঠই হাঁওফাঁওলৈ তেজ পাম্প কৰে?' },
    opts: { en: ['Left Atrium', 'Left Ventricle', 'Right Ventricle', 'Right Atrium'],
            as: ['বাওঁ অলিন্দ', 'বাওঁ নিলয়', 'সোঁ নিলয়', 'সোঁ অলিন্দ'] },
    ans: 2,
    explanation: { en: 'The right ventricle pumps deoxygenated blood to the lungs via the pulmonary artery. This is the start of pulmonary (lesser) circulation.',
                   as: 'সোঁ নিলয়ে ফুসফুসীয় ধমনীৰ যোগেদি হাঁওফাঁওলৈ অক্সিজেনবিহীন তেজ পাম্প কৰে। এইটোৱেই ফুসফুসীয় (লঘু) পৰিবহনৰ আৰম্ভণি।' },
  },
  {
    q: { en: 'The pulmonary artery carries:',
         as: 'ফুসফুসীয় ধমনীয়ে কঢ়িয়ায়:' },
    opts: { en: ['Oxygenated blood to the lungs', 'Deoxygenated blood to the lungs', 'Oxygenated blood to the body', 'Deoxygenated blood to the body'],
            as: ['হাঁওফাঁওলৈ অক্সিজেনযুক্ত তেজ', 'হাঁওফাঁওলৈ অক্সিজেনবিহীন তেজ', 'শৰীৰলৈ অক্সিজেনযুক্ত তেজ', 'শৰীৰলৈ অক্সিজেনবিহীন তেজ'] },
    ans: 1,
    explanation: { en: 'KEY EXCEPTION: The pulmonary artery carries DEOXYGENATED blood from the right ventricle to the lungs — the only artery that carries deoxygenated blood.',
                   as: 'মুখ্য ব্যতিক্ৰম: ফুসফুসীয় ধমনীয়ে সোঁ নিলয়ৰ পৰা হাঁওফাঁওলৈ অক্সিজেনবিহীন তেজ কঢ়িয়ায় — অক্সিজেনবিহীন তেজ কঢ়িয়াই নিয়া একমাত্ৰ ধমনী।' },
  },
  {
    q: { en: 'Which valve is located between the left atrium and left ventricle?',
         as: 'বাওঁ অলিন্দ আৰু বাওঁ নিলয়ৰ মাজত কোন কপাটিকা অৱস্থিত?' },
    opts: { en: ['Tricuspid valve', 'Pulmonary valve', 'Aortic valve', 'Mitral (bicuspid) valve'],
            as: ['ত্ৰিৰূপ কপাটিকা', 'ফুসফুসীয় কপাটিকা', 'মহাধমনী কপাটিকা', 'মাইট্ৰেল (দ্বিৰূপ) কপাটিকা'] },
    ans: 3,
    explanation: { en: 'The mitral (bicuspid) valve has 2 cusps and separates the left atrium from the left ventricle. It prevents backflow during powerful LV contraction.',
                   as: 'মাইট্ৰেল (দ্বিৰূপ) কপাটিকাৰ ২টা পত্ৰিকা আছে আৰু ই বাওঁ অলিন্দক বাওঁ নিলয়ৰ পৰা পৃথক কৰে। শক্তিশালী LV সংকোচনৰ সময়ত উভতি অহা ৰোধ কৰে।' },
  },
  {
    q: { en: 'Which vein carries oxygenated blood?',
         as: 'কোন শিৰাই অক্সিজেনযুক্ত তেজ কঢ়িয়ায়?' },
    opts: { en: ['Superior vena cava', 'Inferior vena cava', 'Pulmonary vein', 'Jugular vein'],
            as: ['ঊৰ্ধ্ব মহাশিৰা', 'অধঃ মহাশিৰা', 'ফুসফুসীয় শিৰা', 'জুগুলাৰ শিৰা'] },
    ans: 2,
    explanation: { en: 'KEY EXCEPTION: The pulmonary vein carries oxygenated blood from the lungs to the left atrium — the only vein in the body that carries oxygenated blood.',
                   as: 'মুখ্য ব্যতিক্ৰম: ফুসফুসীয় শিৰাই হাঁওফাঁওৰ পৰা বাওঁ অলিন্দলৈ অক্সিজেনযুক্ত তেজ কঢ়িয়ায় — শৰীৰৰ একমাত্ৰ শিৰা যিয়ে অক্সিজেনযুক্ত তেজ কঢ়িয়ায়।' },
  },
  {
    q: { en: 'The "Lubb" (S1) heart sound is produced by closure of:',
         as: '"লাব" (S1) হৃদ শব্দ কোনৰ বন্ধ হোৱাত উৎপন্ন হয়?' },
    opts: { en: ['Aortic and pulmonary valves', 'Tricuspid and mitral valves', 'All four valves together', 'Only the aortic valve'],
            as: ['মহাধমনী আৰু ফুসফুসীয় কপাটিকা', 'ত্ৰিৰূপ আৰু মাইট্ৰেল কপাটিকা', 'চাৰিওটা কপাটিকা একেলগে', 'কেৱল মহাধমনী কপাটিকা'] },
    ans: 1,
    explanation: { en: 'Lubb (S1) is produced by the simultaneous closure of the tricuspid and mitral (AV) valves at the START of ventricular systole. Dubb (S2) is produced by aortic and pulmonary valve closure.',
                   as: 'লাব (S1) নিলয় চিষ্টোলৰ আৰম্ভণিত ত্ৰিৰূপ আৰু মাইট্ৰেল (AV) কপাটিকা একে সময়ত বন্ধ হোৱাত উৎপন্ন হয়। ডাব (S2) মহাধমনী আৰু ফুসফুসীয় কপাটিকা বন্ধ হোৱাত উৎপন্ন হয়।' },
  },
  {
    q: { en: 'Which chamber of the heart has the thickest muscular wall?',
         as: 'হৃদপিণ্ডৰ কোন প্ৰকোষ্ঠৰ গা আটাইতকৈ ডাঠ পেশীযুক্ত?' },
    opts: { en: ['Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle'],
            as: ['সোঁ অলিন্দ', 'বাওঁ অলিন্দ', 'সোঁ নিলয়', 'বাওঁ নিলয়'] },
    ans: 3,
    explanation: { en: 'The left ventricle has the thickest walls (~3× thicker than RV) because it must generate ~120 mmHg pressure to pump blood to the entire body via systemic circulation.',
                   as: 'বাওঁ নিলয়ৰ গা আটাইতকৈ ডাঠ (RV-তকৈ ~৩× ডাঠ) কাৰণ ই তন্ত্ৰগত পৰিবহনৰ যোগেদি সমগ্ৰ শৰীৰলৈ তেজ পাম্প কৰিবলৈ ~১২০ mmHg চাপ উৎপন্ন কৰিব লাগে।' },
  },
  {
    q: { en: 'Double circulation in humans means:',
         as: 'মানুহৰ দ্বৈত পৰিবহনৰ অৰ্থ হ’ল:' },
    opts: { en: ['The heart beats twice per second', 'Blood passes through the heart twice per complete circuit', 'Blood flows through two vessels simultaneously', 'The lungs receive blood twice per heartbeat'],
            as: ['হৃদপিণ্ডে প্ৰতি ছেকেণ্ডত দুবাৰ স্পন্দিত হয়', 'এটা সম্পূৰ্ণ চক্ৰত তেজ হৃদপিণ্ডৰ মাজেৰে দুবাৰ যায়', 'তেজ একে সময়ত দুটা পাত্ৰৰ মাজেৰে যায়', 'হাঁওফাঁওয়ে প্ৰতি হৃদ-স্পন্দনত দুবাৰ তেজ পায়'] },
    ans: 1,
    explanation: { en: 'Double circulation: blood passes through the heart TWICE per complete circuit. Once through the right side (pulmonary circulation to lungs) and once through the left side (systemic circulation to body).',
                   as: 'দ্বৈত পৰিবহন: এটা সম্পূৰ্ণ চক্ৰত তেজ হৃদপিণ্ডৰ মাজেৰে দুবাৰ যায়। এবাৰ সোঁ ফালেৰে (হাঁওফাঁওলৈ ফুসফুসীয় পৰিবহন) আৰু এবাৰ বাওঁ ফালেৰে (শৰীৰলৈ তন্ত্ৰগত পৰিবহন)।' },
  },
  {
    q: { en: 'The sinoatrial (SA) node is called the pacemaker because:',
         as: 'চাইন‘এট্ৰিয়েল (SA) নডক হৃদ-স্পন্দক বুলি কোৱা হয় কাৰণ:' },
    opts: { en: ['It stores electrical energy like a battery', 'It generates the rhythmic impulse that initiates each heartbeat', 'It controls the speed of blood flow', 'It maintains body temperature'],
            as: ['ই বেটাৰীৰ দৰে বৈদ্যুতিক শক্তি জমা ৰাখে', 'ই প্ৰতিটো হৃদ-স্পন্দন আৰম্ভ কৰা ছন্দময় উদ্দীপ্ত উৎপন্ন কৰে', 'ই তেজ প্ৰবাহৰ গতি নিয়ন্ত্ৰণ কৰে', 'ই দেহৰ উষ্ণতা বজাই ৰাখে'] },
    ans: 1,
    explanation: { en: 'The SA node in the right atrium generates spontaneous electrical impulses (~72/min) that spread through the heart, triggering each heartbeat. It sets the heart rate — hence "pacemaker".',
                   as: 'সোঁ অলিন্দৰ SA নডে স্বতঃস্ফূৰ্ত বৈদ্যুতিক উদ্দীপ্ত (~৭২/মিনিট) উৎপন্ন কৰে যি হৃদপিণ্ডৰ মাজেৰে বিয়পি প্ৰতিটো হৃদ-স্পন্দন আৰম্ভ কৰে। ই হৃদ গতি নিৰ্ধাৰণ কৰে — সেইবাবে "হৃদ-স্পন্দক"।' },
  },
  {
    q: { en: 'Which blood vessels return deoxygenated blood from the UPPER body to the right atrium?',
         as: 'কোনবোৰ ৰক্তনালীয়ে ওপৰৰ শৰীৰৰ পৰা সোঁ অলিন্দলৈ অক্সিজেনবিহীন তেজ ঘুৰাই আনে?' },
    opts: { en: ['Inferior vena cava', 'Aorta', 'Superior vena cava', 'Pulmonary artery'],
            as: ['অধঃ মহাশিৰা', 'মহাধমনী', 'ঊৰ্ধ্ব মহাশিৰা', 'ফুসফুসীয় ধমনী'] },
    ans: 2,
    explanation: { en: 'The superior vena cava (SVC) returns deoxygenated blood from the head, neck, arms, and upper thorax to the right atrium. The inferior vena cava (IVC) handles the lower body.',
                   as: 'ঊৰ্ধ্ব মহাশিৰাই (SVC) মূৰ, ডিঙি, বাহু আৰু ওপৰৰ বক্ষৰ পৰা সোঁ অলিন্দলৈ অক্সিজেনবিহীন তেজ ঘুৰাই আনে। অধঃ মহাশিৰাই (IVC) তলৰ শৰীৰ চমজে।' },
  },
  {
    q: { en: 'In the double circulation of humans, pulmonary circulation refers to:',
         as: 'মানুহৰ দ্বৈত পৰিবহনত, ফুসফুসীয় পৰিবহন বুলিলে বুজা যায়:' },
    opts: { en: ['Heart → body → heart', 'Heart → lungs → heart', 'Lungs → brain → heart', 'Arteries → veins → arteries'],
            as: ['হৃদপিণ্ড → শৰীৰ → হৃদপিণ্ড', 'হৃদপিণ্ড → হাঁওফাঁও → হৃদপিণ্ড', 'হাঁওফাঁও → মগজু → হৃদপিণ্ড', 'ধমনী → শিৰা → ধমনী'] },
    ans: 1,
    explanation: { en: 'Pulmonary (lesser) circulation: Right ventricle → Pulmonary artery → Lungs → Pulmonary veins → Left atrium. The blood gets oxygenated here. Systemic (greater) circulation then distributes the blood to the body.',
                   as: 'ফুসফুসীয় (লঘু) পৰিবহন: সোঁ নিলয় → ফুসফুসীয় ধমনী → হাঁওফাঁও → ফুসফুসীয় শিৰা → বাওঁ অলিন্দ। ইয়াত তেজ অক্সিজেনযুক্ত হয়। তাৰ পিছত তন্ত্ৰগত (বৃহৎ) পৰিবহনে শৰীৰলৈ তেজ বিতৰণ কৰে।' },
  },
];
