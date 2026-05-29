import type { BilingualField } from "@/lib/i18n";

/**
 * Digestive system data — bilingual (English + Assamese).
 * Source: NCERT Class IX/X Biology Assamese edition + Vigyan Bharati glossary.
 * NCERT-preferred organ terms: পাকস্থলী, যকৃৎ, অগ্ন্যাশয়, ক্ষুদ্ৰান্ত্ৰ, বৃহদান্ত্ৰ.
 * Enzyme names follow conventional Assamese transliteration (পেপ্‌চিন,
 * ট্ৰিপ্‌চিন, লাইপেছ) as used in the NCERT-Assam textbook.
 */
export interface OrganData {
  id: string;
  name: BilingualField<string>;
  color: string;
  glowColor: string;
  role: BilingualField<string>;
  description: BilingualField<string>;
  functions: BilingualField<string[]>;
  secretions: BilingualField<string[]>;
  examNotes: BilingualField<string[]>;
  funFact: BilingualField<string>;
  disorders: BilingualField<string>;
  journeyNote: BilingualField<string>;
}

export interface QuizQ {
  q: BilingualField<string>;
  opts: BilingualField<string[]>;
  ans: number;
  explanation: BilingualField<string>;
}

export interface JourneyStep {
  x: number;
  y: number;
  organId: string;
  stage: BilingualField<string>;
  shortNote: BilingualField<string>;
}

export const ORGANS: Record<string, OrganData> = {
  mouth: {
    id: 'mouth', color: '#d4a832', glowColor: '#f0c850',
    name: { en: 'Oral Cavity (Mouth)', as: 'মুখগহ্বৰ (মুখ)' },
    role: {
      en: 'Entry point — Mechanical & Chemical Digestion',
      as: 'প্ৰৱেশদ্বাৰ — যান্ত্ৰিক আৰু ৰাসায়নিক পাচন',
    },
    description: {
      en: 'The oral cavity is the entry point of the alimentary canal containing teeth for mastication, the tongue for mixing, and salivary gland ducts.',
      as: 'মুখগহ্বৰ হৈছে পাচন নলিকাৰ প্ৰৱেশদ্বাৰ য\'ত চিবোৱাৰ বাবে দাঁত, খাদ্য মিহলোৱাৰ বাবে জিভা, আৰু লালা গ্ৰন্থিৰ নলিকা থাকে।',
    },
    functions: {
      en: [
        'Mastication (chewing) — mechanical breakdown into a soft bolus',
        'Mixing food with saliva via tongue movements',
        'Chemical digestion of starch → maltose by salivary amylase',
        'Taste perception and initiation of swallowing reflex',
      ],
      as: [
        'চিবোৱা — যান্ত্ৰিকভাৱে খাদ্যক কোমল গ্ৰাসাত পৰিণত কৰে',
        'জিভাৰ গতিৰে খাদ্যক লালাৰ লগত মিহলায়',
        'লালা এমাইলেজে মাণ্ডক মাল্টোজলৈ ৰাসায়নিকভাৱে ভাঙি দিয়ে',
        'সোৱাদ অনুভৱ আৰু গিলা প্ৰতিৱৰ্ত আৰম্ভ',
      ],
    },
    secretions: {
      en: ['Saliva (1.0–1.5 L/day): salivary amylase (ptyalin), mucin, lysozyme, water, bicarbonate'],
      as: ['লালা (১.০–১.৫ লি./দিন): লালা এমাইলেজ (টায়েলিন), মিউচিন, লাইছোজাইম, পানী, বাইকাৰ্বনেট'],
    },
    examNotes: {
      en: [
        'Saliva pH = 6.8–7.4 (slightly acidic to slightly alkaline)',
        'Salivary amylase (ptyalin) converts starch → maltose',
        'Lysozyme in saliva has antibacterial action',
        'HCl in the stomach stops salivary amylase activity',
        'Bolus = chewed, moistened food ready for swallowing',
      ],
      as: [
        'লালাৰ pH = ৬.৮–৭.৪ (অলপ অম্লীয়ৰ পৰা অলপ ক্ষাৰীয়লৈ)',
        'লালা এমাইলেজ (টায়েলিন)-এ মাণ্ডক মাল্টোজলৈ ৰূপান্তৰিত কৰে',
        'লালাৰ লাইছোজাইমৰ বেক্টেৰিয়া-নাশক ক্ৰিয়া আছে',
        'পাকস্থলীৰ HCl-এ লালা এমাইলেজৰ ক্ৰিয়া বন্ধ কৰে',
        'গ্ৰাসা = চিবাই-ভিজোৱা খাদ্য, গিলিবলৈ সাজু',
      ],
    },
    funFact: {
      en: 'You produce about 1–1.5 litres of saliva every day — enough to fill two large water bottles!',
      as: 'আপুনি দৈনিক প্ৰায় ১–১.৫ লিটাৰ লালা উৎপন্ন কৰে — দুটা ডাঙৰ পানীৰ বটল পূৰাবলৈ যথেষ্ট!',
    },
    disorders: {
      en: 'Dental caries, oral cancer, xerostomia (dry mouth), aphthous ulcers',
      as: 'দাঁতৰ ক্ষয়, মুখৰ কৰ্কট ৰোগ, জেৰোষ্টমিয়া (শুকান মুখ), মুখৰ ঘা',
    },
    journeyNote: {
      en: 'Food enters the mouth. Teeth grind it mechanically into small pieces. Saliva softens the food and salivary amylase begins breaking down starch into maltose. The tongue shapes the food into a rounded bolus ready to be swallowed.',
      as: 'খাদ্য মুখত সোমায়। দাঁতে ইয়াক যান্ত্ৰিকভাৱে সৰু টুকুৰাত পিহি দিয়ে। লালাই খাদ্যক কোমল কৰে আৰু লালা এমাইলেজে মাণ্ডক মাল্টোজলৈ ভাঙিবলৈ আৰম্ভ কৰে। জিভাই খাদ্যক গোলাকাৰ গ্ৰাসাৰ আকাৰ দিয়ে — গিলিবলৈ সাজু।',
    },
  },

  salivary: {
    id: 'salivary', color: '#f0a0a0', glowColor: '#ffbcbc',
    name: { en: 'Salivary Glands', as: 'লালা গ্ৰন্থি' },
    role: {
      en: 'Secrete saliva for lubrication and initial chemical digestion',
      as: 'খাদ্যৰ পিছল-ক্ৰিয়া আৰু প্ৰাৰম্ভিক ৰাসায়নিক পাচনৰ বাবে লালা ক্ষৰণ',
    },
    description: {
      en: 'Three pairs of salivary glands: parotid (below ear, largest), submandibular (below lower jaw), and sublingual (below tongue, smallest).',
      as: 'তিনিযোৰ লালা গ্ৰন্থি: পেৰোটিড (কাণৰ তলত, সৰ্ববৃহৎ), ছাবমেণ্ডিবুলাৰ (তলৰ হনুৰ তলত), আৰু ছাবলিংগুৱেল (জিভাৰ তলত, সৰ্বসৰু)।',
    },
    functions: {
      en: [
        'Produce and secrete saliva into oral cavity',
        'Lubricate food for easy swallowing',
        'Begin chemical digestion of carbohydrates (starch → maltose)',
        'Provide antibacterial protection via lysozyme',
      ],
      as: [
        'মুখগহ্বৰত লালা উৎপন্ন আৰু ক্ষৰণ কৰে',
        'খাদ্যক সহজে গিলিবলৈ পিছল কৰে',
        'কাৰ্বহাইড্ৰেটৰ ৰাসায়নিক পাচন আৰম্ভ কৰে (মাণ্ড → মাল্টোজ)',
        'লাইছোজাইমৰ যোগেদি বেক্টেৰিয়াৰ পৰা সুৰক্ষা',
      ],
    },
    secretions: {
      en: ['Salivary amylase (ptyalin)', 'Mucin (mucus for lubrication)', 'Lysozyme (antibacterial enzyme)', 'Bicarbonate (buffering)'],
      as: ['লালা এমাইলেজ (টায়েলিন)', 'মিউচিন (পিছল-ক্ৰিয়াৰ বাবে শ্লেষ্মা)', 'লাইছোজাইম (বেক্টেৰিয়া-নাশক এনজাইম)', 'বাইকাৰ্বনেট (বাফাৰিং)'],
    },
    examNotes: {
      en: [
        'Three pairs: parotid (largest), submandibular, sublingual (smallest)',
        "Parotid gland opens opposite upper second molar (Stensen's duct)",
        'Parotid gland swells in mumps (paramyxovirus infection)',
        'Salivary amylase is the only digestive enzyme in saliva',
        'Total secretion: ~1.0–1.5 L/day',
      ],
      as: [
        'তিনিযোৰ: পেৰোটিড (সৰ্ববৃহৎ), ছাবমেণ্ডিবুলাৰ, ছাবলিংগুৱেল (সৰ্বসৰু)',
        'পেৰোটিড গ্ৰন্থি ওপৰৰ দ্বিতীয় ম\'লাৰ দাঁতৰ বিপৰীতে মুখলৈ মুকলি হয় (ষ্টেনছেনৰ নলিকা)',
        'মাম্পছ (পেৰামাইক্সোভাইৰাছ সংক্ৰমণ)-ত পেৰোটিড গ্ৰন্থি ফুলে',
        'লালাত একমাত্ৰ পাচক এনজাইম হ\'ল লালা এমাইলেজ',
        'মুঠ ক্ষৰণ: ~১.০–১.৫ লি./দিন',
      ],
    },
    funFact: {
      en: 'The parotid gland is the largest salivary gland — it is the one that swells painfully during mumps infection.',
      as: 'পেৰোটিড গ্ৰন্থি সৰ্ববৃহৎ লালা গ্ৰন্থি — মাম্পছ সংক্ৰমণৰ সময়ত এইটোৱেই বেদনাদায়কভাৱে ফুলি যায়।',
    },
    disorders: {
      en: 'Mumps (parotitis), sialolithiasis (salivary stones), Sjögren syndrome, parotid cancer',
      as: 'মাম্পছ (পেৰোটাইটিছ), লালা শিল (ছিয়েলোলিথিয়াছিছ), ছ\'গ্ৰেন ছিনড্ৰম, পেৰোটিড কৰ্কট ৰোগ',
    },
    journeyNote: {
      en: 'As food is chewed, all three pairs of salivary glands pour saliva into the mouth. Salivary amylase immediately begins breaking down the starch in food into maltose — the very first chemical digestion of the meal.',
      as: 'খাদ্য চিবাই থাকোঁতে তিনিযোৰ লালা গ্ৰন্থিয়ে মুখলৈ লালা ঢালে। লালা এমাইলেজে তৎক্ষণাত খাদ্যৰ মাণ্ডক মাল্টোজলৈ ভাঙিবলৈ আৰম্ভ কৰে — খোৱাৰ প্ৰথম ৰাসায়নিক পাচন।',
    },
  },

  pharynx: {
    id: 'pharynx', color: '#cc8870', glowColor: '#e8a888',
    name: { en: 'Pharynx', as: 'গ্ৰাসনালী' },
    role: {
      en: 'Swallowing passage — common pathway for food and air',
      as: 'গিলাৰ পথ — খাদ্য আৰু বায়ুৰ সাধাৰণ পথ',
    },
    description: {
      en: 'The pharynx is a muscular funnel-shaped chamber serving as a common passage for the respiratory tract and digestive tract. It connects the oral cavity to the esophagus.',
      as: 'গ্ৰাসনালী হৈছে এক পেশীযুক্ত ফানেল-আকৃতিৰ প্ৰকোষ্ঠ যি শ্বসন নলিকা আৰু পাচন নলিকাৰ সাধাৰণ পথ। ই মুখগহ্বৰক অন্ননালীৰ সৈতে সংযোগ কৰে।',
    },
    functions: {
      en: [
        'Deglutition (swallowing) — propels bolus from mouth to esophagus',
        'Epiglottis covers the glottis (tracheal opening) during swallowing',
        'Coordinates the swallowing reflex (partly voluntary, partly involuntary)',
      ],
      as: [
        'গিলা — গ্ৰাসাক মুখৰ পৰা অন্ননালীলৈ ঠেলি পঠিয়ায়',
        'গিলোৱাৰ সময়ত এপিগ্লোটিছে গ্লটিছ (শ্বাসনালীৰ মুখ) বন্ধ কৰে',
        'গিলা প্ৰতিৱৰ্ত সমন্বয় কৰে (আংশিকভাৱে স্বেচ্ছামূলক, আংশিকভাৱে অনিচ্ছাকৃত)',
      ],
    },
    secretions: {
      en: ['Mucus (from mucosal glands for lubrication)'],
      as: ['শ্লেষ্মা (পিছল-ক্ৰিয়াৰ বাবে মিউক\'ছাল গ্ৰন্থিৰ পৰা)'],
    },
    examNotes: {
      en: [
        'Pharynx is a common passage for food and air',
        'Epiglottis: flap of cartilage that prevents food entering the trachea during swallowing',
        'Three regions: nasopharynx, oropharynx, laryngopharynx',
        'Swallowing involves >30 muscles in perfect coordination',
        'Aspiration = food entering trachea (blocked by healthy epiglottis reflex)',
      ],
      as: [
        'গ্ৰাসনালী খাদ্য আৰু বায়ু দুয়োৰে সাধাৰণ পথ',
        'এপিগ্লোটিছ: কাৰ্টিলেজৰ এক ফ্লেপ যিয়ে গিলাৰ সময়ত খাদ্যক শ্বাসনালীত সোমাবলৈ নিদিয়ে',
        'তিনিটা অঞ্চল: নাছোফেৰিংক্স, অৰোফেৰিংক্স, লেৰিংগোফেৰিংক্স',
        'গিলা প্ৰক্ৰিয়াত ৩০-তকৈও বেছি পেশীৰ নিখুঁত সমন্বয় হয়',
        'এছ্পিৰেশ্যন = খাদ্য শ্বাসনালীত সোমোৱা (সুস্থ এপিগ্লোটিছ প্ৰতিৱৰ্তে ৰোধ কৰে)',
      ],
    },
    funFact: {
      en: 'Swallowing involves over 30 muscles working in perfect coordination — all in less than one second!',
      as: 'গিলা প্ৰক্ৰিয়াত ৩০-তকৈ অধিক পেশীয়ে নিখুঁত সমন্বয়েৰে কাম কৰে — সকলোবোৰ এক ছেকেণ্ডতকৈও কম সময়ত!',
    },
    disorders: {
      en: 'Dysphagia (difficulty swallowing), pharyngitis, laryngopharyngeal reflux, aspiration',
      as: 'ডিছফেজিয়া (গিলোতে অসুবিধা), গ্ৰাসনালীৰ প্ৰদাহ, লেৰিংগোফেৰিঞ্জিয়েল ৰিফ্লাক্স, এছ্পিৰেশ্যন',
    },
    journeyNote: {
      en: 'The bolus reaches the pharynx. The epiglottis automatically swings down to cover the trachea (windpipe) — preventing choking. The bolus is swiftly pushed into the esophagus by muscular contractions.',
      as: 'গ্ৰাসা গ্ৰাসনালীত আহি পায়। এপিগ্লোটিছে স্বয়ংক্ৰিয়ভাৱে শ্বাসনালী বন্ধ কৰে — হেঁচা মৰাৰ পৰা ৰক্ষা কৰে। পেশীৰ সংকোচনে গ্ৰাসাক দ্ৰুতগতিত অন্ননালীত ঠেলি দিয়ে।',
    },
  },

  esophagus: {
    id: 'esophagus', color: '#c07060', glowColor: '#e08878',
    name: { en: 'Esophagus', as: 'অন্ননালী' },
    role: {
      en: 'Muscular food tube — transport by peristaltic waves',
      as: 'পেশীযুক্ত খাদ্য নলিকা — ক্ৰম-সংকোচন তৰঙ্গৰ যোগেদি পৰিবহন',
    },
    description: {
      en: 'The esophagus is a muscular tube ~25 cm long connecting the pharynx to the stomach. It passes through the thoracic cavity beside the trachea and through the diaphragm.',
      as: 'অন্ননালী হৈছে ~২৫ চে.মি. দীঘল পেশীযুক্ত নলিকা যিয়ে গ্ৰাসনালীক পাকস্থলীৰ সৈতে সংযোগ কৰে। ই শ্বাসনালীৰ কাষেৰে বক্ষগহ্বৰ অতিক্ৰম কৰি ডায়াফ্ৰামৰ মাজেৰে যায়।',
    },
    functions: {
      en: [
        'Transports bolus from pharynx to stomach by peristalsis (6–8 seconds)',
        'No digestive enzymes secreted — purely transport function',
        'Gastro-esophageal (cardiac) sphincter prevents reflux of gastric acid',
      ],
      as: [
        'ক্ৰম-সংকোচনৰ যোগেদি গ্ৰাসাক গ্ৰাসনালীৰ পৰা পাকস্থলীলৈ পৰিবহন কৰে (৬–৮ ছেকেণ্ড)',
        'কোনো পাচক এনজাইম ক্ষৰণ নকৰে — কেৱল পৰিবহন কাৰ্য',
        'গেষ্ট্ৰো-ইছফেজিয়েল (কাৰ্ডিয়াক) ছফিংটাৰে গেষ্ট্ৰিক এচিডৰ ৰিফ্লাক্স ৰোধ কৰে',
      ],
    },
    secretions: {
      en: ['Mucus only (no digestive enzymes)'],
      as: ['কেৱল শ্লেষ্মা (কোনো পাচক এনজাইম নাই)'],
    },
    examNotes: {
      en: [
        'Length: ~25 cm; lined with stratified squamous epithelium',
        'Peristalsis: rhythmic, wave-like contractions of circular and longitudinal muscles',
        'Transit time: 6–8 seconds (can work against gravity!)',
        'Cardiac (gastro-esophageal) sphincter: prevents backflow of gastric acid',
        'GERD (Gastro-Esophageal Reflux Disease): cardiac sphincter fails → acid reflux',
        'Bolus can travel even in zero gravity (peristalsis is gravity-independent)',
      ],
      as: [
        'দৈৰ্ঘ্য: ~২৫ চে.মি.; ষ্ট্ৰেটিফায়েড স্কোৱেমাছ এপিথেলিয়ামৰে ৰেখাযুক্ত',
        'ক্ৰম-সংকোচন: বৃত্তাকাৰ আৰু দীঘল পেশীৰ ছন্দময়, তৰঙ্গাকৃতিৰ সংকোচন',
        'ট্ৰাঞ্জিট সময়: ৬–৮ ছেকেণ্ড (অভিকৰ্ষৰ বিপৰীতেও কাম কৰিব পাৰে!)',
        'কাৰ্ডিয়াক ছফিংটাৰ: গেষ্ট্ৰিক এচিডৰ উভতি অহা ৰোধ কৰে',
        'GERD (গেষ্ট্ৰো-ইছফেজিয়েল ৰিফ্লাক্স ৰোগ): কাৰ্ডিয়াক ছফিংটাৰ অকামিলা হ\'লে → এচিড ৰিফ্লাক্স',
        'অভিকৰ্ষহীন অৱস্থাতো গ্ৰাসা চলিব পাৰে (ক্ৰম-সংকোচন অভিকৰ্ষ-নিৰপেক্ষ)',
      ],
    },
    funFact: {
      en: 'Astronauts in zero gravity can still eat and swallow food — peristalsis works perfectly without gravity!',
      as: 'অভিকৰ্ষহীন অৱস্থাত মহাকাশচাৰীয়েও খাদ্য খাব আৰু গিলিব পাৰে — অভিকৰ্ষ অবিহনেও ক্ৰম-সংকোচনে নিখুঁতভাৱে কাম কৰে!',
    },
    disorders: {
      en: "GERD, Barrett's esophagus, achalasia, esophageal varices, esophageal cancer",
      as: 'GERD, বেৰেট\'ছ অন্ননালী, একালেছিয়া, অন্ননালীৰ ভেৰিচেছ, অন্ননালীৰ কৰ্কট ৰোগ',
    },
    journeyNote: {
      en: 'The esophagus propels the bolus downward using rhythmic peristaltic waves — alternating contractions of circular and longitudinal muscles. The food travels at ~3–4 cm/second. The cardiac sphincter relaxes to allow entry into the stomach.',
      as: 'অন্ননালীয়ে ক্ৰম-সংকোচন তৰঙ্গৰ যোগেদি গ্ৰাসাক তললৈ ঠেলি পঠিয়ায় — বৃত্তাকাৰ আৰু দীঘল পেশীৰ পৰিৱৰ্তিত সংকোচন। খাদ্যই ~৩–৪ চে.মি./ছেকেণ্ড বেগেৰে গতি কৰে। কাৰ্ডিয়াক ছফিংটাৰ শিথিল হৈ পাকস্থলীত প্ৰৱেশৰ পথ মুকলি কৰি দিয়ে।',
    },
  },

  stomach: {
    id: 'stomach', color: '#b85258', glowColor: '#d87070',
    name: { en: 'Stomach', as: 'পাকস্থলী' },
    role: {
      en: 'J-shaped muscular organ — Storage, Churning & Protein digestion',
      as: 'J-আকৃতিৰ পেশীযুক্ত অংগ — সংৰক্ষণ, খুন্দা আৰু প্ৰটিন পাচন',
    },
    description: {
      en: 'The J-shaped stomach is a muscular hollow organ with a capacity of 1–1.5 litres. It has three muscle layers and is lined by gastric glands that produce gastric juice.',
      as: 'J-আকৃতিৰ পাকস্থলী হৈছে ১–১.৫ লিটাৰ ধাৰণ ক্ষমতাৰ এক পেশীযুক্ত খালী অংগ। ইয়াত তিনিটা পেশী স্তৰ আছে আৰু গেষ্ট্ৰিক ৰস উৎপন্ন কৰা গেষ্ট্ৰিক গ্ৰন্থিৰে আবৃত।',
    },
    functions: {
      en: [
        'Temporary food storage (chyme) for 3–4 hours',
        'Mechanical churning — three muscle layers mix food thoroughly',
        'Protein digestion begins: pepsinogen → pepsin (activated by HCl)',
        'Kills ingested microorganisms with HCl (pH 1.5–2.0)',
        'Produces intrinsic factor required for Vitamin B12 absorption',
      ],
      as: [
        'অস্থায়ীভাৱে খাদ্য (কাইম) ৩–৪ ঘণ্টা সংৰক্ষণ',
        'যান্ত্ৰিকভাৱে খুন্দা — তিনিটা পেশী স্তৰে খাদ্য ভালদৰে মিহলায়',
        'প্ৰটিন পাচন আৰম্ভ হয়: পেপ্‌চিনজেন → পেপ্‌চিন (HCl-এ সক্ৰিয় কৰে)',
        'HCl-এ গ্ৰহণ কৰা সূক্ষ্মজীৱসমূহক মাৰি পেলায় (pH ১.৫–২.০)',
        'ভিটামিন B12 অৱশোষণৰ বাবে প্ৰয়োজনীয় ইন্ট্ৰিনছিক ফেক্টৰ উৎপন্ন কৰে',
      ],
    },
    secretions: {
      en: [
        'HCl (parietal/oxyntic cells) — creates acidic environment, activates pepsin',
        'Pepsinogen (chief cells) → Pepsin — protein digestion',
        'Mucus (mucous cells) — protects stomach lining from HCl',
        'Intrinsic factor — essential for ileal absorption of Vitamin B12',
        'Gastrin (G-cells, hormone) — stimulates HCl secretion',
      ],
      as: [
        'HCl (পেৰাইটেল/অক্সিন্টিক কোষ) — অম্লীয় পৰিৱেশ সৃষ্টি কৰে, পেপ্‌চিনক সক্ৰিয় কৰে',
        'পেপ্‌চিনজেন (চিফ কোষ) → পেপ্‌চিন — প্ৰটিন পাচন',
        'শ্লেষ্মা (মিউক\'ছ কোষ) — পাকস্থলীৰ আস্তৰক HCl-ৰ পৰা ৰক্ষা কৰে',
        'ইন্ট্ৰিনছিক ফেক্টৰ — ভিটামিন B12 অৱশোষণৰ বাবে অপৰিহাৰ্য',
        'গেষ্ট্ৰিন (G-কোষ, হৰমোন) — HCl ক্ষৰণ উদ্দীপ্ত কৰে',
      ],
    },
    examNotes: {
      en: [
        'J-shaped, capacity 1–1.5 L; has fundus, body, and pyloric regions',
        'Gastric juice pH = 1.5–2.0 (highly acidic)',
        'Rugae: internal folds allowing stomach expansion when full',
        'Oxyntic (parietal) cells → HCl + intrinsic factor; Chief cells → pepsinogen',
        'Pepsinogen + HCl → Pepsin (protein digestion, not complete)',
        'Chyme: semi-liquid mixture of food + gastric juice released into duodenum',
        'Pyloric sphincter: controls chyme entry into duodenum (small spurts)',
      ],
      as: [
        'J-আকৃতি, ধাৰণ ক্ষমতা ১–১.৫ লি.; ফাণ্ডাছ, দেহ আৰু পাইলৰিক অঞ্চল',
        'গেষ্ট্ৰিক ৰসৰ pH = ১.৫–২.০ (অতি অম্লীয়)',
        'ৰুগে: পাকস্থলী ভৰিলে প্ৰসাৰিত হ\'বলৈ অভ্যন্তৰীণ ভাঁজ',
        'অক্সিন্টিক (পেৰাইটেল) কোষ → HCl + ইন্ট্ৰিনছিক ফেক্টৰ; চিফ কোষ → পেপ্‌চিনজেন',
        'পেপ্‌চিনজেন + HCl → পেপ্‌চিন (প্ৰটিন পাচন, সম্পূৰ্ণ নহয়)',
        'কাইম: খাদ্য + গেষ্ট্ৰিক ৰসৰ অৰ্ধতৰল মিশ্ৰণ যি ডুঅ\'ডেনামত ছাড়ি দিয়া হয়',
        'পাইলৰিক ছফিংটাৰ: ডুঅ\'ডেনামত কাইম প্ৰৱেশ নিয়ন্ত্ৰণ কৰে (সৰু সৰু পৰিমাণত)',
      ],
    },
    funFact: {
      en: 'The stomach lining completely replaces itself every 3–4 days to protect itself from digesting its own lining with HCl!',
      as: 'পাকস্থলীয়ে নিজৰ আস্তৰক HCl-ৰে পচাই পেলোৱাৰ পৰা ৰক্ষা কৰিবলৈ প্ৰতি ৩–৪ দিনত নিজৰ আস্তৰ সম্পূৰ্ণৰূপে সলনি কৰে!',
    },
    disorders: {
      en: 'Gastric ulcers (H. pylori), GERD, gastritis, gastric cancer, achlorhydria, pyloric stenosis',
      as: 'গেষ্ট্ৰিক আলচাৰ (H. pylori), GERD, গেষ্ট্ৰাইটিছ, পাকস্থলীৰ কৰ্কট ৰোগ, একলৰ\'হাইড্ৰিয়া, পাইলৰিক ষ্টেনচিছ',
    },
    journeyNote: {
      en: 'Food (now called chyme) is churned vigorously in the stomach for 3–4 hours. HCl (pH 1.5–2.0) kills bacteria and converts pepsinogen to pepsin, which begins breaking down proteins. Small amounts of acidic chyme are released into the duodenum through the pyloric sphincter.',
      as: 'খাদ্য (এতিয়া কাইম নামেৰে) পাকস্থলীত ৩–৪ ঘণ্টা ধৰি জোৰেৰে খুন্দা হয়। HCl (pH ১.৫–২.০)-এ বেক্টেৰিয়া মাৰে আৰু পেপ্‌চিনজেনক পেপ্‌চিনলৈ ৰূপান্তৰ কৰে, যিয়ে প্ৰটিন ভাঙিবলৈ আৰম্ভ কৰে। সৰু সৰু পৰিমাণৰ অম্লীয় কাইম পাইলৰিক ছফিংটাৰৰ যোগেদি ডুঅ\'ডেনামত ছাড়ি দিয়া হয়।',
    },
  },

  liver: {
    id: 'liver', color: '#8b3535', glowColor: '#b05050',
    name: { en: 'Liver', as: 'যকৃৎ' },
    role: {
      en: 'Largest gland (~1.5 kg) — Bile production, Metabolism, Detoxification',
      as: 'সৰ্ববৃহৎ গ্ৰন্থি (~১.৫ কে.জি.) — পিত্ত উৎপাদন, বিপাক, নিৰ্বিষকৰণ',
    },
    description: {
      en: 'The liver is the largest gland in the human body (~1.5 kg), located in the upper right abdomen. It has four lobes and receives a dual blood supply: hepatic artery (oxygenated) and portal vein (nutrient-rich from intestine).',
      as: 'যকৃৎ হৈছে মানৱ দেহৰ সৰ্ববৃহৎ গ্ৰন্থি (~১.৫ কে.জি.), উদৰৰ ওপৰ-সোঁফালে অৱস্থিত। ইয়াত চাৰিটা লব আছে আৰু ই দুটা উৎসৰ পৰা তেজ পায়: হেপাটিক ধমনী (অক্সিজেনযুক্ত) আৰু পৰ্টেল শিৰা (অন্ত্ৰৰ পৰা পুষ্টিৰে সমৃদ্ধ)।',
    },
    functions: {
      en: [
        'Produces bile (600–800 mL/day) for fat emulsification',
        'Glycogen storage — regulates blood glucose (glycogenesis/glycogenolysis)',
        'Detoxification of drugs, alcohol, ammonia, and toxins',
        'Synthesis of plasma proteins: albumin, fibrinogen, prothrombin (clotting factors)',
        'Urea synthesis — converts toxic ammonia to urea (urea cycle)',
        'Storage of fat-soluble vitamins (A, D, E, K) and Vitamin B12',
      ],
      as: [
        'চৰ্বী ইমালছিফিকেচনৰ বাবে পিত্ত উৎপাদন কৰে (৬০০–৮০০ মি.লি./দিন)',
        'গ্লাইক\'জেন সংৰক্ষণ — তেজৰ গ্লুকোজ নিয়ন্ত্ৰণ কৰে (গ্লাইক\'জেনেছিছ/গ্লাইক\'জেনলাইছিছ)',
        'ঔষধ, মদ, এম\'নিয়া আৰু বিষাক্ত পদাৰ্থৰ নিৰ্বিষকৰণ',
        'প্লাজমা প্ৰটিন সংশ্লেষণ: এলবুমিন, ফাইব্ৰিনজেন, প্ৰথ্ৰম্বিন (তেজ গোট মৰাৰ কাৰক)',
        'ইউৰিয়া সংশ্লেষণ — বিষাক্ত এম\'নিয়াক ইউৰিয়ালৈ ৰূপান্তৰ কৰে (ইউৰিয়া চক্ৰ)',
        'চৰ্বী-দ্ৰৱণীয় ভিটামিন (A, D, E, K) আৰু ভিটামিন B12 সংৰক্ষণ',
      ],
    },
    secretions: {
      en: ['Bile: bile salts, bile pigments (bilirubin/biliverdin), cholesterol, water, lecithin', 'Stored in gallbladder, released into duodenum via common bile duct'],
      as: ['পিত্ত: পিত্ত লৱণ, পিত্ত ৰঞ্জক (বিলিৰুবিন/বিলিভাৰডিন), কলেষ্টেৰল, পানী, লেচিথিন', 'পিত্তাশয়ত সংৰক্ষিত হয়, কমন বাইল ডাক্টৰ যোগেদি ডুঅ\'ডেনামত ছাড়ি দিয়া হয়'],
    },
    examNotes: {
      en: [
        'Largest gland in body (~1.5 kg), 4 lobes: right, left, caudate, quadrate',
        'Bile does NOT contain digestive enzymes — it only emulsifies fats',
        'Bile salts emulsify fats (large fat droplets → tiny droplets for lipase)',
        'Bilirubin = breakdown product of haemoglobin → gives bile/feces yellow-brown color',
        'Hepatic portal vein brings absorbed nutrients from intestine directly to liver',
        'Jaundice: yellowing of skin/eyes due to excess bilirubin (liver disease)',
        'Liver can regenerate — up to 75% can be removed and it regrows!',
      ],
      as: [
        'দেহৰ সৰ্ববৃহৎ গ্ৰন্থি (~১.৫ কে.জি.), ৪ লব: সোঁ, বাওঁ, কডেট, কোৱাড্ৰেট',
        'পিত্তত পাচক এনজাইম নাথাকে — ই কেৱল চৰ্বী ইমালছিফাই কৰে',
        'পিত্ত লৱণে চৰ্বী ইমালছিফাই কৰে (ডাঙৰ চৰ্বী ফোঁটা → সৰু সৰু ফোঁটা যাতে লাইপেছে কাম কৰিব পাৰে)',
        'বিলিৰুবিন = হিম\'গ্লবিন ভাঙি পোৱা পদাৰ্থ → পিত্ত/মলক হালধীয়া-মুগা ৰং দিয়ে',
        'হেপাটিক পৰ্টেল শিৰাই অন্ত্ৰৰ পৰা অৱশোষিত পুষ্টিক পোনপটীয়াকৈ যকৃতলৈ আনে',
        'জণ্ডিছ: অতিৰিক্ত বিলিৰুবিনৰ ফলত ছাল/চকু হালধীয়া হোৱা (যকৃৎ ৰোগ)',
        'যকৃৎ পুনৰ গজি উঠিব পাৰে — ৭৫% পৰ্যন্ত আঁতৰোৱাৰ পিছতো পুনৰ বাঢ়ে!',
      ],
    },
    funFact: {
      en: 'The liver performs over 500 different biochemical functions and can regenerate from just 25% of its original mass!',
      as: 'যকৃতে ৫০০-তকৈ অধিক বিভিন্ন জৈৱ-ৰাসায়নিক কাৰ্য সম্পাদন কৰে আৰু কেৱল ২৫% মূল ভৰৰ পৰাই পুনৰ গজি উঠিব পাৰে!',
    },
    disorders: {
      en: "Hepatitis (A/B/C), cirrhosis, fatty liver (NAFLD/NASH), jaundice, liver cancer, Wilson's disease",
      as: 'হেপাটাইটিছ (A/B/C), চিৰ\'ছিছ, চৰ্বী যকৃৎ (NAFLD/NASH), জণ্ডিছ, যকৃৎৰ কৰ্কট ৰোগ, উইলছন ৰোগ',
    },
    journeyNote: {
      en: 'The liver continuously produces bile and sends it to the gallbladder for storage. When fat-rich chyme arrives in the duodenum, bile is released to emulsify fats — breaking large fat globules into tiny droplets so that pancreatic lipase can efficiently digest them.',
      as: 'যকৃতে একেৰাহে পিত্ত উৎপন্ন কৰি পিত্তাশয়লৈ সংৰক্ষণৰ বাবে পঠিয়াই থাকে। ডুঅ\'ডেনামত চৰ্বী-সমৃদ্ধ কাইম আহি পালে, পিত্ত নিৰ্গত হৈ চৰ্বী ইমালছিফাই কৰে — ডাঙৰ চৰ্বী গোলকবোৰ সৰু সৰু ফোঁটাত ভাঙি দিয়ে যাতে অগ্ন্যাশয় লাইপেছে দক্ষতাৰে পচাব পাৰে।',
    },
  },

  gallbladder: {
    id: 'gallbladder', color: '#4a8855', glowColor: '#60a870',
    name: { en: 'Gallbladder', as: 'পিত্তাশয়' },
    role: {
      en: 'Bile storage and concentration organ — releases bile on demand',
      as: 'পিত্ত সংৰক্ষণ আৰু ঘনীভৱনৰ অংগ — প্ৰয়োজন অনুসৰি পিত্ত নিৰ্গত কৰে',
    },
    description: {
      en: 'The gallbladder is a small pear-shaped organ (~7–10 cm, 50 mL capacity) located on the inferior surface of the liver. It stores and concentrates bile between meals.',
      as: 'পিত্তাশয় হৈছে যকৃতৰ তলৰ পৃষ্ঠত অৱস্থিত এক সৰু ন\'গাঁৱৰ আকৃতিৰ অংগ (~৭–১০ চে.মি., ৫০ মি.লি. ধাৰণ ক্ষমতা)। ই ভোজনৰ মাজত পিত্ত সংৰক্ষণ আৰু ঘনীভূত কৰে।',
    },
    functions: {
      en: [
        'Stores bile produced by the liver (capacity ~50 mL)',
        'Concentrates bile by absorbing water (up to 10× concentration)',
        'Releases concentrated bile into duodenum via common bile duct when stimulated',
        'CCK (cholecystokinin) from duodenum triggers gallbladder contraction',
      ],
      as: [
        'যকৃতে উৎপন্ন কৰা পিত্ত সংৰক্ষণ কৰে (ধাৰণ ক্ষমতা ~৫০ মি.লি.)',
        'পানী অৱশোষণ কৰি পিত্তক ঘনীভূত কৰে (১০× পৰ্যন্ত ঘনত্ব)',
        'উদ্দীপিত হ\'লে কমন বাইল ডাক্টৰ যোগেদি ঘনীভূত পিত্তক ডুঅ\'ডেনামত নিৰ্গত কৰে',
        'ডুঅ\'ডেনামৰ পৰা CCK (ক\'লেচিষ্টোকাইনিন)-এ পিত্তাশয়ৰ সংকোচন আৰম্ভ কৰে',
      ],
    },
    secretions: {
      en: ['Concentrated bile (stores and releases liver-produced bile)'],
      as: ['ঘনীভূত পিত্ত (যকৃতে উৎপন্ন কৰা পিত্ত সংৰক্ষণ আৰু নিৰ্গত কৰে)'],
    },
    examNotes: {
      en: [
        'Pear-shaped, capacity ~50 mL, ~7–10 cm long',
        'Connected to liver by cystic duct; joins hepatic duct to form common bile duct',
        'Bile enters duodenum via sphincter of Oddi (hepatopancreatic ampulla)',
        'CCK (cholecystokinin): secreted by duodenum when fat/protein enters; causes gallbladder contraction',
        'Bile salts: emulsify fats (physical action, not chemical)',
        'Gallstones (cholelithiasis): cholesterol precipitates in bile → crystalline stones',
      ],
      as: [
        'ন\'গাঁৱৰ আকৃতি, ধাৰণ ক্ষমতা ~৫০ মি.লি., ~৭–১০ চে.মি. দীঘল',
        'চিষ্টিক ডাক্টৰ যোগেদি যকৃতৰ লগত সংযুক্ত; হেপাটিক ডাক্টৰ সৈতে মিলি কমন বাইল ডাক্ট গঠন কৰে',
        'পিত্তই অডিৰ ছফিংটাৰ (হেপাট\'পেংক্ৰিয়েটিক এম্পুলা)-ৰ যোগেদি ডুঅ\'ডেনামত প্ৰৱেশ কৰে',
        'CCK (ক\'লেচিষ্টোকাইনিন): চৰ্বী/প্ৰটিন সোমালে ডুঅ\'ডেনামে নিৰ্গত কৰে; পিত্তাশয়ৰ সংকোচন ঘটায়',
        'পিত্ত লৱণ: চৰ্বী ইমালছিফাই কৰে (ভৌতিক ক্ৰিয়া, ৰাসায়নিক নহয়)',
        'পিত্তশিল (ক\'লেলিথিয়াছিছ): পিত্তত কলেষ্টেৰল জমা হৈ → স্ফটিকীয় শিল গঠন কৰে',
      ],
    },
    funFact: {
      en: 'The gallbladder concentrates bile up to 10 times! You can live without a gallbladder — bile will flow directly from liver to small intestine.',
      as: 'পিত্তাশয়ে পিত্তক ১০ গুণ পৰ্যন্ত ঘনীভূত কৰে! পিত্তাশয় অবিহনেও জীয়াই থাকিব পাৰি — পিত্ত পোনপটীয়াকৈ যকৃতৰ পৰা ক্ষুদ্ৰান্ত্ৰলৈ যাব।',
    },
    disorders: {
      en: 'Gallstones (cholelithiasis), cholecystitis (inflammation), bile duct obstruction, bile duct cancer',
      as: 'পিত্তশিল (ক\'লেলিথিয়াছিছ), ক\'লেচিষ্টাইটিছ (প্ৰদাহ), বাইল ডাক্ট বন্ধ হোৱা, বাইল ডাক্ট কৰ্কট ৰোগ',
    },
    journeyNote: {
      en: 'As fat-rich chyme enters the duodenum, the hormone CCK (cholecystokinin) signals the gallbladder to contract. Concentrated bile is squirted through the cystic duct → common bile duct → sphincter of Oddi into the duodenum, where it emulsifies fats.',
      as: 'চৰ্বী-সমৃদ্ধ কাইম ডুঅ\'ডেনামত সোমালে, CCK (ক\'লেচিষ্টোকাইনিন) হৰমোনে পিত্তাশয়ক সংকোচিত হ\'বলৈ সংকেত দিয়ে। ঘনীভূত পিত্ত চিষ্টিক ডাক্ট → কমন বাইল ডাক্ট → অডিৰ ছফিংটাৰৰ যোগেদি ডুঅ\'ডেনামত পিচকাৰি দিয়া হয়, য\'ত ই চৰ্বী ইমালছিফাই কৰে।',
    },
  },

  pancreas: {
    id: 'pancreas', color: '#d49060', glowColor: '#e8a878',
    name: { en: 'Pancreas', as: 'অগ্ন্যাশয়' },
    role: {
      en: 'Compound gland — secretes the most complete digestive juice',
      as: 'যৌগিক গ্ৰন্থি — সৰ্বাধিক সম্পূৰ্ণ পাচক ৰস ক্ষৰণ কৰে',
    },
    description: {
      en: 'The pancreas (~15 cm) is both an exocrine gland (secretes pancreatic juice for digestion) and an endocrine gland (Islets of Langerhans secrete insulin and glucagon). It lies posterior to the stomach.',
      as: 'অগ্ন্যাশয় (~১৫ চে.মি.) এটা বহিঃস্ৰাৱী গ্ৰন্থি (পাচনৰ বাবে অগ্ন্যাশয় ৰস ক্ষৰণ কৰে) আৰু এটা অন্তঃস্ৰাৱী গ্ৰন্থি (লেংগাৰহান্স দ্বীপৰ পৰা ইনছুলিন আৰু গ্লুকাগন ক্ষৰণ হয়)। ই পাকস্থলীৰ পিছফালে থাকে।',
    },
    functions: {
      en: [
        'Exocrine: secretes pancreatic juice (~1.5 L/day) into the duodenum',
        'Neutralizes acidic chyme from stomach (sodium bicarbonate; pH 7.8–8.0)',
        'Digests all three major food groups: proteins, carbohydrates, fats',
        'Endocrine: insulin (lowers blood glucose), glucagon (raises blood glucose)',
      ],
      as: [
        'বহিঃস্ৰাৱী: ডুঅ\'ডেনামত অগ্ন্যাশয় ৰস ক্ষৰণ কৰে (~১.৫ লি./দিন)',
        'পাকস্থলীৰ অম্লীয় কাইমক নিৰপেক্ষ কৰে (চ\'ডিয়াম বাইকাৰ্বনেট; pH ৭.৮–৮.০)',
        'খাদ্যৰ তিনিও মুখ্য গোটক পচায়: প্ৰটিন, কাৰ্বহাইড্ৰেট, চৰ্বী',
        'অন্তঃস্ৰাৱী: ইনছুলিন (তেজৰ গ্লুকোজ কমায়), গ্লুকাগন (তেজৰ গ্লুকোজ বঢ়ায়)',
      ],
    },
    secretions: {
      en: [
        'Trypsinogen → Trypsin (proteins; activated by enterokinase)',
        'Chymotrypsinogen → Chymotrypsin (proteins)',
        'Pancreatic amylase (starch → maltose)',
        'Pancreatic lipase (fats → fatty acids + glycerol)',
        'DNase, RNase (nucleic acids)',
        'Sodium bicarbonate (NaHCO₃) — neutralizes HCl',
        'Pro-carboxypeptidase → Carboxypeptidase (proteins)',
      ],
      as: [
        'ট্ৰিপ্‌চিনজেন → ট্ৰিপ্‌চিন (প্ৰটিন; এণ্টাৰোকাইনেজে সক্ৰিয় কৰে)',
        'কাইম\'ট্ৰিপ্‌চিনজেন → কাইম\'ট্ৰিপ্‌চিন (প্ৰটিন)',
        'অগ্ন্যাশয় এমাইলেজ (মাণ্ড → মাল্টোজ)',
        'অগ্ন্যাশয় লাইপেছ (চৰ্বী → চৰ্বী এচিড + গ্লিচাৰল)',
        'DNase, RNase (নিউক্লিয়িক এচিড)',
        'চ\'ডিয়াম বাইকাৰ্বনেট (NaHCO₃) — HCl-ক নিৰপেক্ষ কৰে',
        'প্ৰ-কাৰ্বক্সিপেপ্‌টিডেছ → কাৰ্বক্সিপেপ্‌টিডেছ (প্ৰটিন)',
      ],
    },
    examNotes: {
      en: [
        'Pancreatic juice pH = 7.8–8.0 (alkaline); neutralizes stomach HCl',
        'Enterokinase (secreted by duodenal mucosa): trypsinogen → trypsin',
        'Trypsin activates all other pancreatic pro-enzymes (cascade)',
        'Endocrine: α-cells (glucagon), β-cells (insulin), δ-cells (somatostatin)',
        'Pancreatitis: inflammation causes auto-digestion of the pancreas itself!',
        'Duct of Wirsung (main pancreatic duct) joins common bile duct at ampulla of Vater',
      ],
      as: [
        'অগ্ন্যাশয় ৰসৰ pH = ৭.৮–৮.০ (ক্ষাৰীয়); পাকস্থলীৰ HCl নিৰপেক্ষ কৰে',
        'এণ্টাৰোকাইনেজ (ডুঅ\'ডেনাল মিউক\'ছাই ক্ষৰণ কৰে): ট্ৰিপ্‌চিনজেন → ট্ৰিপ্‌চিন',
        'ট্ৰিপ্‌চিনে আন সকলো অগ্ন্যাশয় প্ৰ\'-এনজাইম সক্ৰিয় কৰে (কেছকেড)',
        'অন্তঃস্ৰাৱী: α-কোষ (গ্লুকাগন), β-কোষ (ইনছুলিন), δ-কোষ (চ\'মেট\'ষ্টেটিন)',
        'পেংক্ৰিয়েটাইটিছ: প্ৰদাহৰ ফলত অগ্ন্যাশয়ে নিজেই নিজকে পচাই পেলায়!',
        'ৱিৰচাঙৰ ডাক্ট (মুখ্য অগ্ন্যাশয় ডাক্ট) ভেটাৰৰ এম্পুলাত কমন বাইল ডাক্টৰ লগত মিলে',
      ],
    },
    funFact: {
      en: 'The pancreas produces nearly 1.5 litres of digestive juice per day — powerful enough to digest the pancreas itself if protective mechanisms fail (acute pancreatitis)!',
      as: 'অগ্ন্যাশয়ে দৈনিক প্ৰায় ১.৫ লিটাৰ পাচক ৰস উৎপন্ন কৰে — সুৰক্ষা ব্যৱস্থা ব্যৰ্থ হ\'লে অগ্ন্যাশয়ক নিজকে পচাই পেলোৱাৰ ক্ষমতা ৰাখে (একিউট পেংক্ৰিয়েটাইটিছ)!',
    },
    disorders: {
      en: 'Pancreatitis (acute/chronic), pancreatic cancer, diabetes mellitus (Type 1/2)',
      as: 'পেংক্ৰিয়েটাইটিছ (একিউট/ক্ৰনিক), অগ্ন্যাশয়ৰ কৰ্কট ৰোগ, মধুমেহ (Type 1/2)',
    },
    journeyNote: {
      en: 'The pancreas secretes pancreatic juice into the duodenum through the duct of Wirsung. This alkaline juice neutralizes the acidic chyme from the stomach (raising pH to 7.8–8.0) and contains a complete set of enzymes to digest proteins, fats, carbohydrates, and nucleic acids.',
      as: 'অগ্ন্যাশয়ে ৱিৰচাঙৰ ডাক্টৰ যোগেদি ডুঅ\'ডেনামত অগ্ন্যাশয় ৰস ক্ষৰণ কৰে। এই ক্ষাৰীয় ৰসে পাকস্থলীৰ অম্লীয় কাইমক নিৰপেক্ষ কৰে (pH-ক ৭.৮–৮.০ লৈ বঢ়ায়) আৰু প্ৰটিন, চৰ্বী, কাৰ্বহাইড্ৰেট, আৰু নিউক্লিয়িক এচিড পচাবলৈ সম্পূৰ্ণ এনজাইমৰ সমষ্টি ৰাখে।',
    },
  },

  smallIntestine: {
    id: 'smallIntestine', color: '#d49075', glowColor: '#e8a890',
    name: { en: 'Small Intestine', as: 'ক্ষুদ্ৰান্ত্ৰ' },
    role: {
      en: 'Primary site of complete digestion and nutrient absorption (6–7 m)',
      as: 'সম্পূৰ্ণ পাচন আৰু পুষ্টি অৱশোষণৰ মুখ্য স্থান (৬–৭ মি.)',
    },
    description: {
      en: 'The small intestine (6–7 m) consists of the duodenum (25 cm), jejunum (2.5 m), and ileum (3.5 m). It is lined with villi and microvilli providing ~200 m² of absorptive surface area.',
      as: 'ক্ষুদ্ৰান্ত্ৰ (৬–৭ মি.) তিনিটা অংশেৰে গঠিত: ডুঅ\'ডেনাম (২৫ চে.মি.), জেজুনাম (২.৫ মি.), আৰু ইলিয়াম (৩.৫ মি.)। ই ভিলাই আৰু মাইক্ৰোভিলাইৰে আবৃত যিয়ে ~২০০ বৰ্গ মি. অৱশোষণ পৃষ্ঠ আয়তন প্ৰদান কৰে।',
    },
    functions: {
      en: [
        'Complete digestion of all nutrients (proteins, carbohydrates, fats, nucleic acids)',
        'Maximum absorption of digested nutrients into blood and lymph',
        'Villi and microvilli massively increase absorptive surface area (~200 m²)',
        'Secretes intestinal juice (succus entericus) with brush border enzymes',
        'Segmentation contractions mix chyme with digestive juices',
      ],
      as: [
        'সকলো পুষ্টিৰ সম্পূৰ্ণ পাচন (প্ৰটিন, কাৰ্বহাইড্ৰেট, চৰ্বী, নিউক্লিয়িক এচিড)',
        'পচন কৰা পুষ্টিৰ সৰ্বোচ্চ অৱশোষণ — তেজ আৰু লসিকাৰ মাজলৈ',
        'ভিলাই আৰু মাইক্ৰোভিলাইয়ে অৱশোষণ পৃষ্ঠ আয়তন বহুগুণে বঢ়ায় (~২০০ বৰ্গ মি.)',
        'ব্ৰাছ বৰ্ডাৰ এনজাইম যুক্ত অন্ত্ৰ ৰস (ছাকাচ এণ্টেৰিকাছ) ক্ষৰণ কৰে',
        'খণ্ডন সংকোচনে কাইমক পাচক ৰসৰ সৈতে মিহলায়',
      ],
    },
    secretions: {
      en: [
        'Maltase (maltose → glucose + glucose)',
        'Sucrase (sucrose → glucose + fructose)',
        'Lactase (lactose → glucose + galactose)',
        'Peptidases (dipeptides → amino acids)',
        'Intestinal lipase',
        'Enterokinase (activates trypsinogen → trypsin)',
      ],
      as: [
        'মাল্টেছ (মাল্টোজ → গ্লুকোজ + গ্লুকোজ)',
        'ছুক্ৰেছ (ছুক্ৰোজ → গ্লুকোজ + ফ্ৰুক্টোজ)',
        'লেক্টেছ (লেক্টোজ → গ্লুকোজ + গেলেক্টোজ)',
        'পেপ্‌টিডেছ (ডাইপেপ্‌টাইড → এমিনো এচিড)',
        'অন্ত্ৰ লাইপেছ',
        'এণ্টাৰোকাইনেজ (ট্ৰিপ্‌চিনজেন → ট্ৰিপ্‌চিন সক্ৰিয় কৰে)',
      ],
    },
    examNotes: {
      en: [
        'Longest: 6–7 m; duodenum (25 cm) + jejunum (2.5 m) + ileum (3.5 m)',
        'Villi: finger-like projections lined with epithelial cells (absorptive)',
        'Microvilli (brush border): on each epithelial cell → enormously increase surface area',
        'Total surface area ~200 m² (size of a singles tennis court!)',
        'Glucose + amino acids → absorbed into blood capillaries in villi → hepatic portal vein → liver',
        'Fatty acids + glycerol → absorbed into lacteals (lymph vessels) in villi → lymph',
        'Ileum absorbs Vitamin B12 (bound to intrinsic factor) and bile salts',
        'Villi absent in large intestine',
        'Chyme stays 5–6 hours in small intestine',
      ],
      as: [
        'সৰ্ব-দীঘল: ৬–৭ মি.; ডুঅ\'ডেনাম (২৫ চে.মি.) + জেজুনাম (২.৫ মি.) + ইলিয়াম (৩.৫ মি.)',
        'ভিলাই: এপিথেলিয়েল কোষেৰে আবৃত আঙুলিৰ আকৃতিৰ প্ৰক্ষেপণ (অৱশোষক)',
        'মাইক্ৰোভিলাই (ব্ৰাছ বৰ্ডাৰ): প্ৰতিটো এপিথেলিয়েল কোষৰ ওপৰত → পৃষ্ঠ আয়তন বহুগুণে বঢ়ায়',
        'মুঠ পৃষ্ঠ আয়তন ~২০০ বৰ্গ মি. (এখন একক টেনিছ পথাৰৰ আকাৰ!)',
        'গ্লুকোজ + এমিনো এচিড → ভিলাইৰ তেজ কেপিলেৰীত অৱশোষিত → হেপাটিক পৰ্টেল শিৰা → যকৃৎ',
        'চৰ্বী এচিড + গ্লিচাৰল → ভিলাইৰ লেকটিয়েল (লসিকা নলিকা)-ত অৱশোষিত → লসিকা',
        'ইলিয়ামে ভিটামিন B12 (ইন্ট্ৰিনছিক ফেক্টৰৰ লগত যুক্ত) আৰু পিত্ত লৱণ অৱশোষণ কৰে',
        'বৃহদান্ত্ৰত ভিলাই নাই',
        'কাইম ক্ষুদ্ৰান্ত্ৰত ৫–৬ ঘণ্টা থাকে',
      ],
    },
    funFact: {
      en: 'The tiny microvilli covering the small intestine create a total absorptive surface area of ~200 m² — roughly the size of a singles tennis court!',
      as: 'ক্ষুদ্ৰান্ত্ৰক আবৃত কৰি থকা সৰু মাইক্ৰোভিলাইয়ে ~২০০ বৰ্গ মি. মুঠ অৱশোষণ পৃষ্ঠ আয়তন গঠন কৰে — প্ৰায় এখন একক টেনিছ পথাৰৰ আকাৰ!',
    },
    disorders: {
      en: "Celiac disease, Crohn's disease, lactose intolerance, malabsorption syndrome, intestinal obstruction, intussusception",
      as: 'চিলিয়াক ৰোগ, ক্ৰ\'নছ ৰোগ, লেক্টোজ অসহিষ্ণুতা, মেলএবচৰ্পচন ছিনড্ৰম, অন্ত্ৰ বন্ধ হোৱা, ইনটাচাছেপচন',
    },
    journeyNote: {
      en: 'Chyme spends 5–6 hours in the small intestine. Bile emulsifies fats; pancreatic enzymes digest proteins, fats, and carbohydrates; intestinal enzymes complete digestion. Villi absorb glucose, amino acids, and fatty acids into blood and lymph — this is where your food truly becomes part of you.',
      as: 'কাইম ক্ষুদ্ৰান্ত্ৰত ৫–৬ ঘণ্টা থাকে। পিত্তই চৰ্বী ইমালছিফাই কৰে; অগ্ন্যাশয় এনজাইমে প্ৰটিন, চৰ্বী, কাৰ্বহাইড্ৰেট পচায়; অন্ত্ৰ এনজাইমে পাচন সম্পূৰ্ণ কৰে। ভিলাইয়ে গ্লুকোজ, এমিনো এচিড, আৰু চৰ্বী এচিড তেজ আৰু লসিকাত অৱশোষণ কৰে — ইয়াতেই আপোনাৰ খাদ্য সঁচাকৈয়ে আপোনাৰ এটা অংশ হৈ পৰে।',
    },
  },

  largeIntestine: {
    id: 'largeIntestine', color: '#a06848', glowColor: '#c08060',
    name: { en: 'Large Intestine', as: 'বৃহদান্ত্ৰ' },
    role: {
      en: 'Water absorption, feces formation, and gut microbiome host',
      as: 'পানী অৱশোষণ, মল গঠন, আৰু অন্ত্ৰ মাইক্ৰোবায়োমৰ স্থান',
    },
    description: {
      en: 'The large intestine is ~1.5 m long and consists of the cecum, ascending colon, transverse colon, descending colon, sigmoid colon, and rectum. It has haustrae (pouches) and no villi.',
      as: 'বৃহদান্ত্ৰ ~১.৫ মি. দীঘল আৰু ছিকাম, এচেণ্ডিং কোলন, ট্ৰান্সভাৰ্ছ কোলন, ডিচেণ্ডিং কোলন, ছিগময়েড কোলন, আৰু মলাশয়ৰে গঠিত। ইয়াত হাষ্ট্ৰে (থলি) আছে কিন্তু ভিলাই নাই।',
    },
    functions: {
      en: [
        'Absorption of water and electrolytes (Na⁺, Cl⁻) — most critical function',
        'Fermentation of undigested material by gut microbiome (~100 trillion bacteria)',
        'Synthesis of Vitamin K and some B vitamins by gut bacteria',
        'Formation and temporary storage of feces',
        'Secretion of mucus to lubricate feces passage',
      ],
      as: [
        'পানী আৰু ইলেক্ট্ৰলাইট (Na⁺, Cl⁻) অৱশোষণ — সৰ্বাধিক গুৰুত্বপূৰ্ণ কাৰ্য',
        'অপাচিত পদাৰ্থৰ গাঁজোন (~১০০ ট্ৰিলিয়ন বেক্টেৰিয়া দ্বাৰা)',
        'অন্ত্ৰ বেক্টেৰিয়াই ভিটামিন K আৰু কিছুমান B ভিটামিন সংশ্লেষণ কৰে',
        'মল গঠন আৰু অস্থায়ী সংৰক্ষণ',
        'মল পাৰ হোৱাত পিছল-ক্ৰিয়াৰ বাবে শ্লেষ্মা ক্ষৰণ',
      ],
    },
    secretions: {
      en: [
        'Mucus only (no digestive enzymes produced)',
        'Bacterial fermentation products: short-chain fatty acids, gases (CO₂, methane, H₂S)',
        'Vitamins synthesized by bacteria: Vitamin K, Vitamin B12, biotin',
      ],
      as: [
        'কেৱল শ্লেষ্মা (কোনো পাচক এনজাইম উৎপন্ন নকৰে)',
        'বেক্টেৰিয়াল গাঁজোনৰ উৎপাদ: ক্ষুদ্ৰ-শৃংখল চৰ্বী এচিড, গেছ (CO₂, মিথেন, H₂S)',
        'বেক্টেৰিয়াই সংশ্লেষণ কৰা ভিটামিন: ভিটামিন K, ভিটামিন B12, বায়োটিন',
      ],
    },
    examNotes: {
      en: [
        'Length ~1.5 m; wider than small intestine (~6.5 cm diameter)',
        'No villi → no significant nutrient absorption',
        'Water absorption: reduces 1.5 L liquid chyme → ~100–200 mL semi-solid feces',
        'Cecum: blind pouch at ileocecal junction; appendix hangs from it',
        'Appendix: vestigial, rich in lymphoid tissue (MALT); appendicitis if blocked',
        'Haustrae: sac-like pouches along colon walls',
        'Gut microbiome: >100 trillion bacteria — more than human cells!',
        'Vitamin K synthesized by bacteria: essential for blood clotting factors II, VII, IX, X',
      ],
      as: [
        'দৈৰ্ঘ্য ~১.৫ মি.; ক্ষুদ্ৰান্ত্ৰতকৈ বহল (~৬.৫ চে.মি. ব্যাস)',
        'ভিলাই নাই → কোনো উল্লেখযোগ্য পুষ্টি অৱশোষণ নহয়',
        'পানী অৱশোষণ: ১.৫ লি. তৰল কাইম → ~১০০–২০০ মি.লি. অৰ্ধ-কঠিন মললৈ কমাই দিয়ে',
        'ছিকাম: ইল\'চিকেল সংযোগস্থলৰ অন্ধ থলি; ইয়াৰ পৰা পৰিশিষ্ট ওলমি থাকে',
        'পৰিশিষ্ট (এপেণ্ডিক্স): অনাৱশ্যকীয়, লিম্ফয়েড কলাত সমৃদ্ধ (MALT); বন্ধ হ\'লে এপেণ্ডিচাইটিছ',
        'হাষ্ট্ৰে: কোলনৰ গাত থলিৰ আকৃতিৰ পকেট',
        'অন্ত্ৰ মাইক্ৰোবায়োম: >১০০ ট্ৰিলিয়ন বেক্টেৰিয়া — মানৱ কোষতকৈও অধিক!',
        'বেক্টেৰিয়াই সংশ্লেষণ কৰা ভিটামিন K: তেজ গোট মৰাৰ কাৰক II, VII, IX, X-ৰ বাবে অপৰিহাৰ্য',
      ],
    },
    funFact: {
      en: 'Your gut microbiome contains more bacterial cells than you have human cells — and their collective genome is 150× larger than the human genome!',
      as: 'আপোনাৰ অন্ত্ৰ মাইক্ৰোবায়োমত আপোনাৰ মানৱ কোষতকৈ বেছি বেক্টেৰিয়াল কোষ আছে — আৰু তেওঁলোকৰ সামূহিক জিনোম মানৱ জিনোমতকৈ ১৫০ গুণ ডাঙৰ!',
    },
    disorders: {
      en: "Constipation, diarrhea, colorectal cancer, IBS (irritable bowel syndrome), Crohn's disease, ulcerative colitis, appendicitis",
      as: 'কোষ্ঠকাঠিন্য, ডায়েৰিয়া, কলৰেক্টেল কৰ্কট ৰোগ, IBS (ইৰিটেবল বাৱেল ছিনড্ৰম), ক্ৰ\'নছ ৰোগ, আলচাৰেটিভ কলাইটিছ, এপেণ্ডিচাইটিছ',
    },
    journeyNote: {
      en: 'Unabsorbed material enters the large intestine. Over 12–24 hours, water and salts are absorbed, transforming liquid chyme into solid feces. Gut bacteria ferment remaining fibers, producing gas and synthesizing Vitamin K. Goblet cells secrete mucus to lubricate passage.',
      as: 'অৱশোষণ নোহোৱা পদাৰ্থ বৃহদান্ত্ৰত সোমায়। ১২–২৪ ঘণ্টাত পানী আৰু লৱণ অৱশোষিত হয়, তৰল কাইম কঠিন মললৈ ৰূপান্তৰিত হয়। অন্ত্ৰ বেক্টেৰিয়াই বাকী থকা আঁহক গজায়, গেছ উৎপন্ন কৰে আৰু ভিটামিন K সংশ্লেষণ কৰে। গব্লেট কোষে পাৰ হোৱাত পিছল-ক্ৰিয়াৰ বাবে শ্লেষ্মা ক্ষৰণ কৰে।',
    },
  },

  rectum: {
    id: 'rectum', color: '#7a4838', glowColor: '#9a6050',
    name: { en: 'Rectum', as: 'মলাশয়' },
    role: {
      en: 'Feces storage reservoir until defecation',
      as: 'মলত্যাগৰ আগলৈকে মল সংৰক্ষণ',
    },
    description: {
      en: 'The rectum is the final ~15 cm of the large intestine, connecting the sigmoid colon to the anal canal. It lies within the pelvic cavity and serves as a temporary storage reservoir.',
      as: 'মলাশয় হৈছে বৃহদান্ত্ৰৰ অন্তিম ~১৫ চে.মি. অংশ, ছিগময়েড কোলনক পায়ু নলিকাৰ সৈতে সংযোগ কৰে। ই পেলভিছ গহ্বৰৰ ভিতৰত থাকে আৰু অস্থায়ী সংৰক্ষণৰ ৰূপত কাম কৰে।',
    },
    functions: {
      en: [
        'Temporary storage of feces before defecation',
        'Stretch receptors in rectal wall signal the urge to defecate when ~300 mL accumulates',
        'Mucus secretion for lubrication',
      ],
      as: [
        'মলত্যাগৰ আগলৈকে মল অস্থায়ীভাৱে সংৰক্ষণ',
        'মলাশয়ৰ গাত থকা ষ্ট্ৰেচ ৰিচেপ্টৰে ~৩০০ মি.লি. জমা হ\'লে মলত্যাগৰ ইচ্ছাৰ সংকেত দিয়ে',
        'পিছল-ক্ৰিয়াৰ বাবে শ্লেষ্মা ক্ষৰণ',
      ],
    },
    secretions: {
      en: ['Mucus (for lubrication)'],
      as: ['শ্লেষ্মা (পিছল-ক্ৰিয়াৰ বাবে)'],
    },
    examNotes: {
      en: [
        'Length: ~15 cm; lies within the pelvis',
        'Stretch receptors → defecation reflex when feces accumulates',
        'Internal anal sphincter: smooth muscle, involuntary (autonomic nerve control)',
        'External anal sphincter: skeletal muscle, voluntary (pudendal nerve — conscious control)',
        'Defecation reflex: feces → rectal wall stretch → parasympathetic → relaxation of internal sphincter + contraction of rectum',
      ],
      as: [
        'দৈৰ্ঘ্য: ~১৫ চে.মি.; পেলভিছৰ ভিতৰত থাকে',
        'ষ্ট্ৰেচ ৰিচেপ্টৰ → মল জমা হ\'লে মলত্যাগ প্ৰতিৱৰ্ত',
        'অভ্যন্তৰীণ পায়ু ছফিংটাৰ: মসৃণ পেশী, অনিচ্ছাকৃত (স্বায়ত্ত স্নায়ুৰ নিয়ন্ত্ৰণ)',
        'বাহ্যিক পায়ু ছফিংটাৰ: কঙ্কাল পেশী, স্বেচ্ছামূলক (পুডেণ্ডেল স্নায়ু — সচেতন নিয়ন্ত্ৰণ)',
        'মলত্যাগ প্ৰতিৱৰ্ত: মল → মলাশয়ৰ গা প্ৰসাৰিত → পেৰাচিম্পেথেটিক → অভ্যন্তৰীণ ছফিংটাৰৰ শিথিলকৰণ + মলাশয়ৰ সংকোচন',
      ],
    },
    funFact: {
      en: 'The rectum can comfortably hold up to 300 mL of feces before the urge to defecate becomes overwhelming — it knows how to be patient!',
      as: 'মলাশয়ে ~৩০০ মি.লি. পৰ্যন্ত মল আৰামদায়কভাৱে ধাৰণ কৰিব পাৰে — মলত্যাগৰ ইচ্ছা প্ৰবল হোৱাৰ আগলৈ ই ধৈৰ্য ধৰিব জানে!',
    },
    disorders: {
      en: 'Constipation, rectal prolapse, hemorrhoids (piles), rectal cancer, fecal incontinence',
      as: 'কোষ্ঠকাঠিন্য, মলাশয় প্ৰলেপছ, পাইলছ (অৰ্শ), মলাশয়ৰ কৰ্কট ৰোগ, মল-অসংযম',
    },
    journeyNote: {
      en: 'Feces (water, bacteria, undigested cellulose, dead cells, bile pigments) is stored in the rectum. When enough accumulates (~300 mL), stretch receptors send signals to the brain creating the conscious urge to defecate. The internal sphincter (involuntary) and external sphincter (voluntary) coordinate to control timing.',
      as: 'মল (পানী, বেক্টেৰিয়া, অপাচিত চেলুলোজ, মৃত কোষ, পিত্ত ৰঞ্জক) মলাশয়ত জমা হৈ থাকে। যথেষ্ট জমা হ\'লে (~৩০০ মি.লি.), ষ্ট্ৰেচ ৰিচেপ্টৰে মগজুলৈ সংকেত পঠাই মলত্যাগৰ সচেতন ইচ্ছা সৃষ্টি কৰে। অভ্যন্তৰীণ ছফিংটাৰ (অনিচ্ছাকৃত) আৰু বাহ্যিক ছফিংটাৰ (স্বেচ্ছামূলক)-এ সময় নিয়ন্ত্ৰণৰ বাবে সমন্বয় কৰে।',
    },
  },

  anus: {
    id: 'anus', color: '#5a3028', glowColor: '#784040',
    name: { en: 'Anus', as: 'পায়ু' },
    role: {
      en: 'Terminal opening — elimination of waste',
      as: 'অন্তিম মুখ — বৰ্জ্য নিৰ্গমন',
    },
    description: {
      en: 'The anus is the terminal opening of the alimentary canal, formed by the anal canal (~3–4 cm long). It is guarded by two sphincters and represents the end of the 6–9 metre digestive journey.',
      as: 'পায়ু হৈছে পাচন নলিকাৰ অন্তিম মুখ, পায়ু নলিকা (~৩–৪ চে.মি. দীঘল)-ৰে গঠিত। ই দুটা ছফিংটাৰৰ দ্বাৰা সুৰক্ষিত আৰু ৬–৯ মিটাৰ পাচন যাত্ৰাৰ অন্ত সূচিত কৰে।',
    },
    functions: {
      en: [
        'Final elimination of feces (defecation)',
        'Internal sphincter (involuntary) prevents involuntary leakage',
        'External sphincter (voluntary) allows conscious control of defecation timing',
      ],
      as: [
        'মলৰ অন্তিম নিৰ্গমন (মলত্যাগ)',
        'অভ্যন্তৰীণ ছফিংটাৰ (অনিচ্ছাকৃত)-এ অনিচ্ছাকৃত লিকেজ ৰোধ কৰে',
        'বাহ্যিক ছফিংটাৰ (স্বেচ্ছামূলক)-এ মলত্যাগৰ সময়ৰ সচেতন নিয়ন্ত্ৰণৰ অনুমতি দিয়ে',
      ],
    },
    secretions: {
      en: ['None'],
      as: ['একো নাই'],
    },
    examNotes: {
      en: [
        'Anal canal length: ~3–4 cm',
        'Internal anal sphincter: smooth muscle, autonomic (involuntary)',
        'External anal sphincter: skeletal muscle, voluntary (conscious control)',
        'Feces composition: ~75% water, ~25% solids (bacteria, cellulose, dead cells, fats, bile pigments)',
        'Defecation: Valsalva manoeuvre + relaxation of both sphincters',
        'The entire digestive journey (mouth to anus) takes 24–72 hours in a healthy adult',
      ],
      as: [
        'পায়ু নলিকাৰ দৈৰ্ঘ্য: ~৩–৪ চে.মি.',
        'অভ্যন্তৰীণ পায়ু ছফিংটাৰ: মসৃণ পেশী, স্বায়ত্ত (অনিচ্ছাকৃত)',
        'বাহ্যিক পায়ু ছফিংটাৰ: কঙ্কাল পেশী, স্বেচ্ছামূলক (সচেতন নিয়ন্ত্ৰণ)',
        'মলৰ গঠন: ~৭৫% পানী, ~২৫% কঠিন (বেক্টেৰিয়া, চেলুলোজ, মৃত কোষ, চৰ্বী, পিত্ত ৰঞ্জক)',
        'মলত্যাগ: ভালছালভা মেনৱাৰ + দুয়োটা ছফিংটাৰৰ শিথিলকৰণ',
        'সম্পূৰ্ণ পাচন যাত্ৰাই (মুখৰ পৰা পায়ুলৈ) এজন সুস্থ প্ৰাপ্তবয়স্কৰ ক্ষেত্ৰত ২৪–৭২ ঘণ্টা লয়',
      ],
    },
    funFact: {
      en: 'About 30% of feces by mass consists of bacteria — mostly dead gut bacteria making up a surprisingly large portion of your daily waste!',
      as: 'মলৰ ভৰৰ প্ৰায় ৩০% হ\'ল বেক্টেৰিয়া — মূলতঃ মৃত অন্ত্ৰ বেক্টেৰিয়াই আপোনাৰ দৈনিক বৰ্জ্যৰ আশ্চৰ্যজনকভাৱে ডাঙৰ অংশ গঠন কৰে!',
    },
    disorders: {
      en: 'Hemorrhoids (piles), anal fissures, fecal incontinence, anal cancer, anal fistula',
      as: 'পাইলছ (অৰ্শ), পায়ুৰ ফাট, মল-অসংযম, পায়ুৰ কৰ্কট ৰোগ, পায়ুৰ ফিষ্টুলা',
    },
    journeyNote: {
      en: 'The journey is complete! Feces is eliminated through the anus. The total transit time from mouth to anus is 24–72 hours in a healthy adult. The digestive system has successfully extracted all available nutrients, vitamins, minerals, and water from the food.',
      as: 'যাত্ৰা সম্পূৰ্ণ! পায়ুৰ যোগেদি মল নিৰ্গত হয়। সুস্থ প্ৰাপ্তবয়স্কৰ মুখৰ পৰা পায়ুলৈ মুঠ ট্ৰাঞ্জিট সময় ২৪–৭২ ঘণ্টা। পাচন তন্ত্ৰই খাদ্যৰ পৰা সকলো উপলব্ধ পুষ্টি, ভিটামিন, খনিজ, আৰু পানী সফলতাৰে আহৰণ কৰিলে।',
    },
  },
};

export const JOURNEY_STEPS: JourneyStep[] = [
  { x: 270, y: 72,  organId: 'mouth',
    stage:     { en: 'Oral Cavity',                  as: 'মুখগহ্বৰ' },
    shortNote: { en: 'Teeth grind food. Salivary amylase converts starch → maltose. Bolus formed.',
                 as: 'দাঁতে খাদ্য পিহি দিয়ে। লালা এমাইলেজে মাণ্ডক মাল্টোজলৈ ৰূপান্তৰ কৰে। গ্ৰাসা গঠিত হয়।' } },
  { x: 192, y: 90,  organId: 'salivary',
    stage:     { en: 'Salivary Glands',              as: 'লালা গ্ৰন্থি' },
    shortNote: { en: 'Parotid, submandibular, sublingual glands flood the mouth with 1.5 L saliva/day.',
                 as: 'পেৰোটিড, ছাবমেণ্ডিবুলাৰ, ছাবলিংগুৱেল গ্ৰন্থিয়ে মুখলৈ ১.৫ লি./দিন লালা পঠিয়ায়।' } },
  { x: 270, y: 108, organId: 'pharynx',
    stage:     { en: 'Pharynx',                       as: 'গ্ৰাসনালী' },
    shortNote: { en: 'Epiglottis snaps shut over trachea. Bolus enters esophagus in <1 second.',
                 as: 'এপিগ্লোটিছে শ্বাসনালী বন্ধ কৰে। গ্ৰাসা ১ ছেকেণ্ডতকৈও কম সময়ত অন্ননালীত প্ৰৱেশ কৰে।' } },
  { x: 270, y: 212, organId: 'esophagus',
    stage:     { en: 'Esophagus',                     as: 'অন্ননালী' },
    shortNote: { en: 'Peristaltic waves push the bolus 25 cm downward in 6–8 seconds.',
                 as: 'ক্ৰম-সংকোচন তৰঙ্গে গ্ৰাসাক ২৫ চে.মি. তললৈ ৬–৮ ছেকেণ্ডত ঠেলি দিয়ে।' } },
  { x: 192, y: 342, organId: 'stomach',
    stage:     { en: 'Stomach',                       as: 'পাকস্থলী' },
    shortNote: { en: 'HCl (pH 1.5–2.0) activates pepsin. Proteins begin digesting. Churns for 3–4 hours.',
                 as: 'HCl (pH ১.৫–২.০)-এ পেপ্‌চিন সক্ৰিয় কৰে। প্ৰটিন পচিবলৈ আৰম্ভ কৰে। ৩–৪ ঘণ্টা খুন্দে।' } },
  { x: 350, y: 332, organId: 'liver',
    stage:     { en: 'Liver → Bile',                   as: 'যকৃৎ → পিত্ত' },
    shortNote: { en: 'Liver produces bile; CCK signal from duodenum triggers gallbladder to release it.',
                 as: 'যকৃতে পিত্ত উৎপন্ন কৰে; ডুঅ\'ডেনামৰ CCK সংকেতে পিত্তাশয়ক ইয়াক নিৰ্গত কৰিবলৈ পঠিয়ায়।' } },
  { x: 326, y: 405, organId: 'gallbladder',
    stage:     { en: 'Gallbladder',                    as: 'পিত্তাশয়' },
    shortNote: { en: 'Concentrated bile enters duodenum. Fat globules are emulsified into tiny droplets.',
                 as: 'ঘনীভূত পিত্ত ডুঅ\'ডেনামত প্ৰৱেশ কৰে। চৰ্বী গোলকবোৰ সৰু সৰু ফোঁটাত ইমালছিফাই হয়।' } },
  { x: 278, y: 388, organId: 'pancreas',
    stage:     { en: 'Pancreas',                       as: 'অগ্ন্যাশয়' },
    shortNote: { en: 'Pancreatic juice (amylase, lipase, trypsin, bicarbonate) pours into duodenum.',
                 as: 'অগ্ন্যাশয় ৰস (এমাইলেজ, লাইপেছ, ট্ৰিপ্‌চিন, বাইকাৰ্বনেট) ডুঅ\'ডেনামত ঢালি দিয়া হয়।' } },
  { x: 350, y: 462, organId: 'smallIntestine',
    stage:     { en: 'Small Intestine',                as: 'ক্ষুদ্ৰান্ত্ৰ' },
    shortNote: { en: 'Complete digestion. Villi absorb all nutrients. 200 m² absorptive surface at work.',
                 as: 'সম্পূৰ্ণ পাচন। ভিলাইয়ে সকলো পুষ্টি অৱশোষণ কৰে। ২০০ বৰ্গ মি. অৱশোষণ পৃষ্ঠ কাৰ্যৰত।' } },
  { x: 392, y: 580, organId: 'largeIntestine',
    stage:     { en: 'Large Intestine',                as: 'বৃহদান্ত্ৰ' },
    shortNote: { en: 'Water and salts absorbed. Gut bacteria ferment fibers. Feces gradually forms.',
                 as: 'পানী আৰু লৱণ অৱশোষিত। অন্ত্ৰ বেক্টেৰিয়াই আঁহ গজায়। মল লাহে লাহে গঠিত হয়।' } },
  { x: 270, y: 660, organId: 'rectum',
    stage:     { en: 'Rectum',                          as: 'মলাশয়' },
    shortNote: { en: 'Feces stored. Stretch receptors fire at ~300 mL — the urge to defecate.',
                 as: 'মল সংৰক্ষিত। ~৩০০ মি.লি.-ত ষ্ট্ৰেচ ৰিচেপ্টৰ জ্বলি উঠে — মলত্যাগৰ ইচ্ছা।' } },
  { x: 270, y: 690, organId: 'anus',
    stage:     { en: 'Anus — Journey Complete!',       as: 'পায়ু — যাত্ৰা সম্পূৰ্ণ!' },
    shortNote: { en: 'Elimination complete. 24–72 hour journey from mouth to anus finishes here.',
                 as: 'নিৰ্গমন সম্পূৰ্ণ। মুখৰ পৰা পায়ুলৈ ২৪–৭২ ঘণ্টাৰ যাত্ৰা ইয়াতে শেষ হয়।' } },
];

export const QUIZ_DATA: QuizQ[] = [
  {
    q: { en: 'Which enzyme in saliva begins the digestion of starch?',
         as: 'লালাত থকা কোন এনজাইমে মাণ্ডৰ পাচন আৰম্ভ কৰে?' },
    opts: { en: ['Pepsin', 'Salivary amylase (Ptyalin)', 'Trypsin', 'Lipase'],
            as: ['পেপ্‌চিন', 'লালা এমাইলেজ (টায়েলিন)', 'ট্ৰিপ্‌চিন', 'লাইপেছ'] },
    ans: 1,
    explanation: { en: 'Salivary amylase (ptyalin) converts starch to maltose in the mouth. Its action stops in the acidic environment of the stomach.',
                   as: 'লালা এমাইলেজ (টায়েলিন)-এ মুখত মাণ্ডক মাল্টোজলৈ ৰূপান্তৰ কৰে। ইয়াৰ ক্ৰিয়া পাকস্থলীৰ অম্লীয় পৰিৱেশত বন্ধ হয়।' },
  },
  {
    q: { en: 'HCl in the stomach activates which enzyme for protein digestion?',
         as: 'পাকস্থলীৰ HCl-এ প্ৰটিন পাচনৰ বাবে কোন এনজাইম সক্ৰিয় কৰে?' },
    opts: { en: ['Trypsinogen', 'Pepsinogen → Pepsin', 'Enterokinase', 'Salivary amylase'],
            as: ['ট্ৰিপ্‌চিনজেন', 'পেপ্‌চিনজেন → পেপ্‌চিন', 'এণ্টাৰোকাইনেজ', 'লালা এমাইলেজ'] },
    ans: 1,
    explanation: { en: 'HCl converts inactive pepsinogen → active pepsin. Pepsin begins protein digestion. HCl also kills ingested bacteria (pH 1.5–2.0).',
                   as: 'HCl-এ নিষ্ক্ৰিয় পেপ্‌চিনজেনক → সক্ৰিয় পেপ্‌চিনলৈ ৰূপান্তৰ কৰে। পেপ্‌চিনে প্ৰটিন পাচন আৰম্ভ কৰে। HCl-এ গ্ৰহণ কৰা বেক্টেৰিয়াও মাৰে (pH ১.৫–২.০)।' },
  },
  {
    q: { en: 'What is the primary function of bile produced by the liver?',
         as: 'যকৃতে উৎপন্ন কৰা পিত্তৰ প্ৰধান কাৰ্য কি?' },
    opts: { en: ['Protein digestion', 'Neutralising stomach acid', 'Emulsification of fats', 'Starch breakdown'],
            as: ['প্ৰটিন পাচন', 'পাকস্থলীৰ এচিড নিৰপেক্ষ কৰা', 'চৰ্বী ইমালছিফিকেচন', 'মাণ্ড ভাঙি দিয়া'] },
    ans: 2,
    explanation: { en: 'Bile emulsifies fats — breaking large fat globules into tiny droplets, greatly increasing the surface area for pancreatic lipase. Bile has NO enzymes.',
                   as: 'পিত্তই চৰ্বী ইমালছিফাই কৰে — ডাঙৰ চৰ্বী গোলকবোৰ সৰু সৰু ফোঁটাত ভাঙে, অগ্ন্যাশয় লাইপেছৰ বাবে পৃষ্ঠ আয়তন বহুগুণে বঢ়ায়। পিত্তত কোনো এনজাইম নাই।' },
  },
  {
    q: { en: 'The longest part of the human alimentary canal is:',
         as: 'মানুহৰ পাচন নলিকাৰ সৰ্ব-দীঘল অংশ হ\'ল:' },
    opts: { en: ['Large intestine (1.5 m)', 'Esophagus (25 cm)', 'Small intestine (6–7 m)', 'Stomach'],
            as: ['বৃহদান্ত্ৰ (১.৫ মি.)', 'অন্ননালী (২৫ চে.মি.)', 'ক্ষুদ্ৰান্ত্ৰ (৬–৭ মি.)', 'পাকস্থলী'] },
    ans: 2,
    explanation: { en: 'The small intestine (6–7 m) is the longest: duodenum (25 cm) + jejunum (2.5 m) + ileum (3.5 m). The large intestine is only 1.5 m.',
                   as: 'ক্ষুদ্ৰান্ত্ৰ (৬–৭ মি.) সৰ্ব-দীঘল: ডুঅ\'ডেনাম (২৫ চে.মি.) + জেজুনাম (২.৫ মি.) + ইলিয়াম (৩.৫ মি.)। বৃহদান্ত্ৰ মাত্ৰ ১.৫ মি.।' },
  },
  {
    q: { en: 'Where does maximum absorption of digested nutrients occur?',
         as: 'পচন কৰা পুষ্টিৰ সৰ্বোচ্চ অৱশোষণ ক\'ত হয়?' },
    opts: { en: ['Stomach', 'Large intestine', 'Esophagus', 'Small intestine'],
            as: ['পাকস্থলী', 'বৃহদান্ত্ৰ', 'অন্ননালী', 'ক্ষুদ্ৰান্ত্ৰ'] },
    ans: 3,
    explanation: { en: 'The small intestine is the primary absorption site. Villi and microvilli provide ~200 m² surface area — equivalent to a tennis court.',
                   as: 'ক্ষুদ্ৰান্ত্ৰ হ\'ল মুখ্য অৱশোষণ স্থান। ভিলাই আৰু মাইক্ৰোভিলাইয়ে ~২০০ বৰ্গ মি. পৃষ্ঠ আয়তন প্ৰদান কৰে — এখন টেনিছ পথাৰৰ সমান।' },
  },
  {
    q: { en: 'Which enzyme produced in the duodenum activates trypsinogen into trypsin?',
         as: 'ডুঅ\'ডেনামত উৎপন্ন কোন এনজাইমে ট্ৰিপ্‌চিনজেনক ট্ৰিপ্‌চিনলৈ সক্ৰিয় কৰে?' },
    opts: { en: ['HCl', 'Pepsin', 'Enterokinase', 'Bile salts'],
            as: ['HCl', 'পেপ্‌চিন', 'এণ্টাৰোকাইনেজ', 'পিত্ত লৱণ'] },
    ans: 2,
    explanation: { en: 'Enterokinase (enteropeptidase), secreted by the duodenal mucosa, converts trypsinogen → trypsin. Trypsin then activates other pancreatic pro-enzymes.',
                   as: 'এণ্টাৰোকাইনেজ (এণ্টাৰোপেপ্‌টিডেছ), ডুঅ\'ডেনাল মিউক\'ছাই ক্ষৰণ কৰে, ট্ৰিপ্‌চিনজেনক ট্ৰিপ্‌চিনলৈ ৰূপান্তৰ কৰে। তাৰ পিছত ট্ৰিপ্‌চিনে আন অগ্ন্যাশয় প্ৰ\'-এনজাইম সক্ৰিয় কৰে।' },
  },
  {
    q: { en: 'The primary function of the large intestine is:',
         as: 'বৃহদান্ত্ৰৰ প্ৰধান কাৰ্য হ\'ল:' },
    opts: { en: ['Protein digestion', 'Fat digestion by bile', 'Absorption of water and electrolytes', 'Bile production'],
            as: ['প্ৰটিন পাচন', 'পিত্তৰ দ্বাৰা চৰ্বী পাচন', 'পানী আৰু ইলেক্ট্ৰলাইট অৱশোষণ', 'পিত্ত উৎপাদন'] },
    ans: 2,
    explanation: { en: 'The large intestine absorbs water and electrolytes, converting 1.5 L of liquid chyme into ~200 mL of solid feces. No significant nutrient digestion occurs here.',
                   as: 'বৃহদান্ত্ৰই পানী আৰু ইলেক্ট্ৰলাইট অৱশোষণ কৰে, ১.৫ লি. তৰল কাইমক ~২০০ মি.লি. কঠিন মললৈ ৰূপান্তৰ কৰে। ইয়াত কোনো উল্লেখযোগ্য পুষ্টি পাচন নহয়।' },
  },
  {
    q: { en: 'Peristalsis is defined as:',
         as: 'ক্ৰম-সংকোচনৰ সংজ্ঞা হ\'ল:' },
    opts: { en: ['Chemical breakdown of food', 'Rhythmic muscular contractions that propel food', 'Absorption of nutrients by villi', 'Churning in the stomach'],
            as: ['খাদ্যৰ ৰাসায়নিক ভঞ্জন', 'খাদ্য আগুৱাই নিয়া ছন্দময় পেশী সংকোচন', 'ভিলাইৰ দ্বাৰা পুষ্টি অৱশোষণ', 'পাকস্থলীত খুন্দা'] },
    ans: 1,
    explanation: { en: 'Peristalsis is the rhythmic, wave-like contractions of smooth muscle in the alimentary canal that propel food from esophagus to rectum.',
                   as: 'ক্ৰম-সংকোচন হ\'ল পাচন নলিকাৰ মসৃণ পেশীৰ ছন্দময়, তৰঙ্গাকৃতিৰ সংকোচন যিয়ে খাদ্যক অন্ননালীৰ পৰা মলাশয়লৈ আগুৱাই দিয়ে।' },
  },
  {
    q: { en: 'What gives bile its characteristic yellow-green colour?',
         as: 'পিত্তক ইয়াৰ বৈশিষ্ট্যপূৰ্ণ হালধীয়া-সেউজীয়া ৰং কোনে দিয়ে?' },
    opts: { en: ['Bile salts', 'Bilirubin (from broken-down haemoglobin)', 'Cholesterol', 'Mucin'],
            as: ['পিত্ত লৱণ', 'বিলিৰুবিন (ভাঙি যোৱা হিম\'গ্লবিনৰ পৰা)', 'কলেষ্টেৰল', 'মিউচিন'] },
    ans: 1,
    explanation: { en: 'Bilirubin is the breakdown product of haemoglobin from old red blood cells. It gives bile its colour and is also responsible for the brown colour of feces.',
                   as: 'বিলিৰুবিন হ\'ল পুৰণা ৰঙা ৰক্তকণিকাৰ পৰা ভাঙি যোৱা হিম\'গ্লবিনৰ উৎপাদ। ই পিত্তক ৰং দিয়ে আৰু মলৰ মুগা ৰঙৰো বাবে দায়ী।' },
  },
  {
    q: { en: 'Vitamin K essential for blood clotting is synthesised by bacteria in which organ?',
         as: 'তেজ গোট মৰাৰ বাবে অপৰিহাৰ্য ভিটামিন K কোন অংগত বেক্টেৰিয়াই সংশ্লেষণ কৰে?' },
    opts: { en: ['Stomach', 'Small intestine', 'Large intestine', 'Liver'],
            as: ['পাকস্থলী', 'ক্ষুদ্ৰান্ত্ৰ', 'বৃহদান্ত্ৰ', 'যকৃৎ'] },
    ans: 2,
    explanation: { en: 'Gut bacteria (microbiome) in the large intestine synthesise Vitamin K, which is essential for the synthesis of blood clotting factors II, VII, IX, and X.',
                   as: 'বৃহদান্ত্ৰৰ অন্ত্ৰ বেক্টেৰিয়াই (মাইক্ৰোবায়োম) ভিটামিন K সংশ্লেষণ কৰে, যি তেজ গোট মৰাৰ কাৰক II, VII, IX, আৰু X-ৰ সংশ্লেষণৰ বাবে অপৰিহাৰ্য।' },
  },
];
