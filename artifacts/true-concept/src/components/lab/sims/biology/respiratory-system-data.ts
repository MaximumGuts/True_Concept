import type { BilingualField } from "@/lib/i18n";

/**
 * Respiratory system data — bilingual (English + Assamese).
 * Source: NCERT Class IX/X Biology Assamese edition + Vigyan Bharati glossary.
 * NCERT-preferred terms: হাঁওফাঁও (lungs), শ্বাসনালী (trachea), বায়ুকোষ
 * (alveoli), মধ্যচ্ছদা (diaphragm), শ্বসন (respiration).
 */
export interface OrganData {
  id: string;
  name: BilingualField<string>;
  color: string;
  glowColor: string;
  role: BilingualField<string>;
  description: BilingualField<string>;
  functions: BilingualField<string[]>;
  keyFacts: BilingualField<string[]>;
  examNotes: BilingualField<string[]>;
  funFact: BilingualField<string>;
  disorders: BilingualField<string>;
  breathingNote: BilingualField<string>;
}

export interface QuizQ {
  q: BilingualField<string>;
  opts: BilingualField<string[]>;
  ans: number;
  explanation: BilingualField<string>;
}

export interface JourneyStep {
  x: number; y: number; organId: string;
  stage: BilingualField<string>;
  shortNote: BilingualField<string>;
}

export const ORGANS: Record<string, OrganData> = {
  nasal: {
    id: 'nasal', color: '#e8a878', glowColor: '#f0c090',
    name: { en: 'Nasal Cavity', as: 'নাসা গহ্বৰ' },
    role: { en: 'Air entry — Filtration, Warming & Humidification',
            as: 'বায়ু প্ৰৱেশ — ফিল্টাৰিং, উষ্ণতা আৰু আৰ্দ্ৰতা' },
    description: {
      en: 'The nasal cavity is the primary entry point for air into the respiratory tract. It is divided by the nasal septum and lined with vascular mucosa and cilia that condition incoming air.',
      as: 'নাসা গহ্বৰ হৈছে শ্বসন নলিকাত বায়ু প্ৰৱেশৰ মুখ্য পথ। ই নাসা পট্টৰ দ্বাৰা বিভক্ত আৰু ভিতৰলৈ অহা বায়ু সংস্কাৰ কৰা ৰক্তসমৃদ্ধ মিউক‘ছা আৰু চিলিয়াৰে আবৃত।',
    },
    functions: {
      en: ['Filters dust, pollen, and microorganisms via mucus and cilia', 'Warms cold air to body temperature (37°C) via vascular conchae', 'Humidifies dry air to ~100% relative humidity', 'Detects odorants via olfactory epithelium (sense of smell)', 'Nasal conchae (turbinates) dramatically increase mucosal surface area'],
      as: ['শ্লেষ্মা আৰু চিলিয়াৰ যোগেদি ধূলি, পৰাগ আৰু সূক্ষ্মজীৱ ফিল্টাৰ কৰে', 'ৰক্তসমৃদ্ধ কনচাৰে ঠাণ্ডা বায়ু দেহৰ উষ্ণতালৈ (৩৭°C) উষ্ণ কৰে', 'শুকান বায়ুক ~১০০% আপেক্ষিক আৰ্দ্ৰতালৈ আৰ্দ্ৰ কৰে', 'ঘ্ৰাণজ এপিথেলিয়ামৰ যোগেদি গন্ধ চিনাক্ত কৰে (ঘ্ৰাণ অনুভূতি)', 'নাসা কনচা (টাৰ্বিনেট)-এ মিউক‘ছাল পৃষ্ঠ আয়তন বহুগুণে বঢ়ায়'],
    },
    keyFacts: {
      en: ['Lined by pseudostratified ciliated columnar epithelium with goblet cells', 'Three nasal conchae (superior, middle, inferior) increase surface area', 'Paranasal sinuses (frontal, maxillary, ethmoid, sphenoid) drain into nasal cavity', 'Nasal hairs (vibrissae) trap large particles at the entrance', 'Mucociliary escalator: cilia beat mucus (with trapped particles) to throat'],
      as: ['গবলেট কোষযুক্ত ছিউড‘ষ্ট্ৰেটিফায়েড চিলিয়েটেড কলামনাৰ এপিথেলিয়ামেৰে আবৃত', 'তিনিটা নাসা কনচা (ঊৰ্ধ্ব, মধ্য, অধঃ)-এ পৃষ্ঠ আয়তন বঢ়ায়', 'পেৰানাছেল চাইনাছ (ফ্ৰণ্টেল, মেক্সিলাৰী, এথময়ড, স্ফিনয়ড) নাসা গহ্বৰত খোৱে', 'নাসা চুলি (ভিব্ৰিচ্ছাই)-এ প্ৰৱেশদ্বাৰত ডাঙৰ কণা আটক কৰে', 'মিউক‘চিলিয়েৰী এস্কেলেটৰ: চিলিয়াই শ্লেষ্মা (আটক কণাৰ সৈতে) ডিঙিলৈ ঠেলি দিয়ে'],
    },
    examNotes: {
      en: ['Nose is the primary pathway; mouth is an alternate (emergency) airway', 'Nasal conchae create turbulent airflow → better conditioning of air', 'Olfactory epithelium is in the roof of nasal cavity (specialized for smell)', 'Eustachian tube from middle ear opens into nasopharynx', 'Warming + humidifying air prevents damage to delicate alveolar epithelium'],
      as: ['নাক হৈছে মুখ্য পথ; মুখ হৈছে বিকল্প (জৰুৰীকালীন) বায়ুপথ', 'নাসা কনচাই অশান্ত বায়ুপ্ৰবাহ সৃষ্টি কৰে → বায়ুৰ ভাল সংস্কাৰ', 'ঘ্ৰাণজ এপিথেলিয়াম নাসা গহ্বৰৰ ছাদত (ঘ্ৰাণৰ বাবে বিশেষীকৃত)', 'মধ্য কাণৰ পৰা ইউষ্টেচিয়ান টিউব নাছোফেৰিংক্সত খোলে', 'বায়ু উষ্ণ + আৰ্দ্ৰ কৰিলে কোমল বায়ুকোষ এপিথেলিয়াম ক্ষতি ৰোধ হয়'],
    },
    funFact: { en: 'You breathe through one nostril predominantly at a time — nostrils switch dominance every 2–4 hours in a process called the nasal cycle!',
               as: 'আপুনি এবাৰত মূলতঃ এটাহে নাকেৰে উশাহ লয় — নাসা চক্ৰ নামৰ প্ৰক্ৰিয়াত নাকৰ ছিদ্ৰই প্ৰতি ২–৪ ঘণ্টাৰ অন্তৰে আধিপত্য সলায়!' },
    disorders: { en: 'Rhinitis (common cold), sinusitis, nasal polyps, deviated nasal septum, anosmia (loss of smell)',
                 as: 'ৰাইনাইটিছ (সাধাৰণ চৰ্দি), চাইনাছাইটিছ, নাসা পলিপ, বিচ্যুত নাসা পট্ট, এন‘ছমিয়া (ঘ্ৰাণ অনুভূতিৰ ক্ষতি)' },
    breathingNote: {
      en: 'Air enters through the nostrils. Nasal hairs immediately trap large particles. As air passes over the conchae (turbinates), it is warmed to 37°C, humidified to ~100% humidity, and filtered by mucus. Cilia sweep the trapped particles to the pharynx.',
      as: 'বায়ু নাকৰ ছিদ্ৰৰে সোমায়। নাসা চুলিয়ে তৎক্ষণাত ডাঙৰ কণা আটক কৰে। বায়ুৱে কনচা (টাৰ্বিনেট)-ৰ ওপৰেদি যোৱাৰ লগে লগে, ই ৩৭°C-লৈ উষ্ণ হয়, ~১০০% আৰ্দ্ৰতালৈ আৰ্দ্ৰ হয়, আৰু শ্লেষ্মাৰে ফিল্টাৰ হয়। চিলিয়াই আটক কণাবোৰ গ্ৰাসনালীলৈ ঠেলি পঠিয়ায়।',
    },
  },
  mouth: {
    id: 'mouth', color: '#d4a832', glowColor: '#f0c850',
    name: { en: 'Oral Cavity (Mouth)', as: 'মুখগহ্বৰ (মুখ)' },
    role: { en: 'Alternate airway — bypasses nasal filtration',
            as: 'বিকল্প বায়ুপথ — নাসা ফিল্টাৰিং এৰাই যায়' },
    description: {
      en: 'The mouth serves as an alternate entry route for air when nasal breathing is insufficient (e.g., during exercise) or obstructed. Unlike the nose, the mouth does not filter or condition air effectively.',
      as: 'নাসা শ্বসন অপৰ্যাপ্ত (যেনে ব্যায়ামৰ সময়ত) বা বাধাগ্ৰস্ত হ’লে মুখে বায়ুৰ বিকল্প প্ৰৱেশ পথ ৰূপে কাম কৰে। নাকৰ বিপৰীতে, মুখে বায়ু কাৰ্যকৰীভাৱে ফিল্টাৰ বা সংস্কাৰ নকৰে।',
    },
    functions: {
      en: ['Alternate route for air intake during heavy exercise or nasal obstruction', 'Can move much larger volumes of air than the nose for high-demand breathing', 'No filtration, warming, or humidification of air occurs here'],
      as: ['কঠিন ব্যায়াম বা নাসা বাধাৰ সময়ত বায়ু গ্ৰহণৰ বিকল্প পথ', 'উচ্চ চাহিদাৰ শ্বসনৰ বাবে নাকতকৈ বহুত অধিক আয়তনৰ বায়ু গতি কৰিব পাৰে', 'ইয়াত বায়ুৰ কোনো ফিল্টাৰিং, উষ্ণতা বা আৰ্দ্ৰতা নহয়'],
    },
    keyFacts: {
      en: ['Mouth breathing bypasses the nasal filtering and conditioning mechanism', 'Air entering through the mouth is cooler, drier, and less filtered', 'During exercise, both nose and mouth are used simultaneously', 'Mouth breathing predisposes to dry throat and respiratory infections'],
      as: ['মুখেৰে শ্বসনে নাসা ফিল্টাৰিং আৰু সংস্কাৰ ব্যৱস্থা এৰাই যায়', 'মুখেৰে অহা বায়ু ঠাণ্ডা, শুকান, আৰু কম ফিল্টাৰ কৰা', 'ব্যায়ামৰ সময়ত, নাক আৰু মুখ দুয়োটা একে সময়ত ব্যৱহাৰ কৰা হয়', 'মুখেৰে শ্বসনে শুকান ডিঙি আৰু শ্বসন সংক্ৰমণৰ আশংকা বঢ়ায়'],
    },
    examNotes: {
      en: ['Nasal breathing is preferred; mouth is the alternate/accessory airway', 'Air from the mouth joins nasal air in the pharynx (oropharynx)', 'Mouth breathing during sleep → dry mouth, snoring, poorer sleep quality', 'Both air pathways converge at the laryngopharynx above the larynx'],
      as: ['নাসা শ্বসন পছন্দনীয়; মুখ হৈছে বিকল্প/সহায়ক বায়ুপথ', 'মুখৰ বায়ু গ্ৰাসনালীত (অৰোফেৰিংক্স) নাসা বায়ুৰ সৈতে মিলে', 'টোপনিৰ সময়ত মুখেৰে শ্বসন → শুকান মুখ, ঘোৰোৱা, কম টোপনিৰ মান', 'দুয়োটা বায়ু পথ স্বৰযন্ত্ৰৰ ওপৰৰ লেৰিংগোফেৰিংক্সত মিলিত হয়'],
    },
    funFact: { en: 'Breathing through your nose is healthier — the nose produces nitric oxide, which dilates blood vessels and helps oxygen absorption by up to 18%!',
               as: 'নাকেৰে উশাহ লোৱা স্বাস্থ্যৰ বাবে ভাল — নাকে নাইট্ৰিক অক্সাইড উৎপন্ন কৰে, যিয়ে ৰক্তনালী প্ৰসাৰিত কৰে আৰু ১৮% পৰ্যন্ত অক্সিজেন অৱশোষণত সহায় কৰে!' },
    disorders: { en: 'Mouth breathing (habit/obstruction), dry mouth (xerostomia), increased risk of respiratory infections',
                 as: 'মুখেৰে শ্বসন (অভ্যাস/বাধা), শুকান মুখ (জেৰোষ্টমিয়া), শ্বসন সংক্ৰমণৰ অধিক আশংকা' },
    breathingNote: {
      en: 'During exercise or nasal obstruction, air enters through the mouth. It is less filtered and conditioned than nasal air. The air enters the oropharynx, where it joins the nasal airstream and continues to the larynx.',
      as: 'ব্যায়াম বা নাসা বাধাৰ সময়ত, বায়ু মুখেৰে সোমায়। ই নাসা বায়ুতকৈ কম ফিল্টাৰ আৰু সংস্কাৰ কৰা। বায়ু অৰোফেৰিংক্সত প্ৰৱেশ কৰে, য’ত ই নাসা বায়ুৰ ধাৰাৰ সৈতে মিলি স্বৰযন্ত্ৰলৈ যায়।',
    },
  },
  pharynx: {
    id: 'pharynx', color: '#cc8870', glowColor: '#e0a080',
    name: { en: 'Pharynx', as: 'গ্ৰাসনালী' },
    role: { en: 'Common passage — airways and alimentary canal meet',
            as: 'সাধাৰণ পথ — বায়ুপথ আৰু পাচন নলিকা মিলিত হয়' },
    description: {
      en: 'The pharynx is a muscular funnel-shaped tube (~12 cm) that connects the nasal and oral cavities to the larynx and esophagus. It has three regions: nasopharynx, oropharynx, and laryngopharynx.',
      as: 'গ্ৰাসনালী হৈছে এক পেশীযুক্ত ফানেল-আকৃতিৰ নলিকা (~১২ চে.মি.) যিয়ে নাসা আৰু মুখগহ্বৰক স্বৰযন্ত্ৰ আৰু অন্ননালীৰ সৈতে সংযোগ কৰে। ইয়াত তিনিটা অঞ্চল আছে: নাছোফেৰিংক্স, অৰোফেৰিংক্স আৰু লেৰিংগোফেৰিংক্স।',
    },
    functions: {
      en: ['Channels air from nasal cavity/mouth to the larynx', 'Common pathway for both air (respiratory) and food (digestive)', 'Houses pharyngeal tonsils (adenoids) in nasopharynx — immune defence', 'Eustachian tube from middle ear opens here (nasopharynx) — ear pressure equalization'],
      as: ['নাসা গহ্বৰ/মুখৰ পৰা স্বৰযন্ত্ৰলৈ বায়ু পঠিয়ায়', 'বায়ু (শ্বসন) আৰু খাদ্য (পাচন) দুয়োৰে সাধাৰণ পথ', 'নাছোফেৰিংক্সত ফেৰিনজিয়েল টনছিল (এডিনয়ড) ৰাখে — ৰোগ-প্ৰতিৰোধী সুৰক্ষা', 'মধ্য কাণৰ পৰা ইউষ্টেচিয়ান টিউব ইয়াত (নাছোফেৰিংক্স) খোলে — কাণৰ চাপ সমান কৰা'],
    },
    keyFacts: {
      en: ['Three regions: nasopharynx (posterior nasal cavity), oropharynx (mouth level), laryngopharynx (larynx level)', 'Nasopharynx: respiratory only; contains pharyngeal tonsils (adenoids)', 'Oropharynx: contains palatine tonsils (the "tonsils" removed in tonsillectomy)', 'Laryngopharynx: splits into larynx (air) and esophagus (food)', 'Eustachian (auditory) tube opens into nasopharynx — connects to middle ear'],
      as: ['তিনিটা অঞ্চল: নাছোফেৰিংক্স (পিছফালৰ নাসা গহ্বৰ), অৰোফেৰিংক্স (মুখ স্তৰ), লেৰিংগোফেৰিংক্স (স্বৰযন্ত্ৰ স্তৰ)', 'নাছোফেৰিংক্স: কেৱল শ্বসন; ফেৰিনজিয়েল টনছিল (এডিনয়ড) থাকে', 'অৰোফেৰিংক্স: পেলেটাইন টনছিল থাকে (টনছিলেক্টমিত আঁতৰোৱা "টনছিল")', 'লেৰিংগোফেৰিংক্স: স্বৰযন্ত্ৰ (বায়ু) আৰু অন্ননালী (খাদ্য)-ত বিভক্ত হয়', 'ইউষ্টেচিয়ান (শ্ৰৱণ) টিউব নাছোফেৰিংক্সত খোলে — মধ্য কাণৰ সৈতে সংযোগ'],
    },
    examNotes: {
      en: ['Pharynx is the common pathway for air (to larynx) and food (to esophagus)', 'Nasopharynx is respiratory only; oropharynx and laryngopharynx are shared', 'Adenoids = pharyngeal tonsils in the roof of nasopharynx', 'Waldeyer\'s ring: lymphoid tissue ring (adenoids + palatine + lingual tonsils)', 'Throat infection (pharyngitis) can cause ear pain via Eustachian tube inflammation'],
      as: ['গ্ৰাসনালী হৈছে বায়ু (স্বৰযন্ত্ৰলৈ) আৰু খাদ্য (অন্ননালীলৈ)-ৰ সাধাৰণ পথ', 'নাছোফেৰিংক্স কেৱল শ্বসন; অৰোফেৰিংক্স আৰু লেৰিংগোফেৰিংক্স অংশীদাৰ', 'এডিনয়ড = নাছোফেৰিংক্সৰ ছাদৰ ফেৰিনজিয়েল টনছিল', 'ৱাল্ডিয়েৰৰ ৰিং: লিম্ফয়েড কলা ৰিং (এডিনয়ড + পেলেটাইন + লিংগুৱেল টনছিল)', 'ডিঙিৰ সংক্ৰমণে (ফেৰিঞ্জাইটিছ) ইউষ্টেচিয়ান টিউব প্ৰদাহৰ যোগেদি কাণৰ বিষ ঘটাব পাৰে'],
    },
    funFact: { en: 'The Eustachian tube connecting your ears to your throat is why you need to swallow or yawn to "pop" your ears when pressure changes during flights!',
               as: 'আপোনাৰ কাণক ডিঙিৰ সৈতে সংযোগ কৰা ইউষ্টেচিয়ান টিউবৰ কাৰণেই বিমান যাত্ৰাত চাপ সলনি হ’লে কাণ "পপ" কৰিবলৈ আপুনি গিলিব বা হাঁপাব লাগে!' },
    disorders: { en: 'Pharyngitis (sore throat), adenoid hypertrophy, tonsillitis, nasopharyngeal cancer, sleep apnea',
                 as: 'ফেৰিঞ্জাইটিছ (ডিঙিৰ বিষ), এডিনয়ড হাইপাৰট্ৰফী, টনছিলাইটিছ, নাছোফেৰিংজিয়েল কৰ্কট ৰোগ, স্লিপ এপনিয়া' },
    breathingNote: {
      en: 'Air from the nasal cavity and mouth converges in the pharynx. The nasopharynx receives nasal air, the oropharynx receives oral air. Both streams continue to the laryngopharynx, where the trachea (air) splits from the esophagus (food) below.',
      as: 'নাসা গহ্বৰ আৰু মুখৰ পৰা বায়ু গ্ৰাসনালীত মিলিত হয়। নাছোফেৰিংক্সে নাসা বায়ু পায়, অৰোফেৰিংক্সে মুখৰ বায়ু পায়। দুয়োটা ধাৰাই লেৰিংগোফেৰিংক্সলৈ যায়, য’ত তলত শ্বাসনালী (বায়ু) অন্ননালী (খাদ্য)-ৰ পৰা বেলেগ হয়।',
    },
  },
  larynx: {
    id: 'larynx', color: '#b08870', glowColor: '#c8a080',
    name: { en: 'Larynx (Voice Box)', as: 'স্বৰযন্ত্ৰ' },
    role: { en: 'Voice production — guards tracheal entrance',
            as: 'মাত উৎপাদন — শ্বাসনালীৰ প্ৰৱেশদ্বাৰ সুৰক্ষা' },
    description: {
      en: 'The larynx is a cartilaginous box (~5 cm) that connects the pharynx to the trachea. It contains the vocal cords (true vocal folds) for phonation and the epiglottis to prevent aspiration during swallowing.',
      as: 'স্বৰযন্ত্ৰ হৈছে এক কাৰ্টিলেজযুক্ত বাকচ (~৫ চে.মি.) যিয়ে গ্ৰাসনালীক শ্বাসনালীৰ সৈতে সংযোগ কৰে। ইয়াত শব্দ উৎপাদনৰ বাবে স্বৰৰজ্জু (প্ৰকৃত স্বৰ ভাঁজ) আৰু গিলিবলৈ লোৱাৰ সময়ত এছ্পিৰেশ্যন ৰোধ কৰিবলৈ এপিগ্লোটিছ থাকে।',
    },
    functions: {
      en: ['Phonation — vocal cords vibrate to produce voice/sound', 'Airway protection — epiglottis closes during swallowing to prevent aspiration', 'Cough reflex — expels foreign particles from the airway', 'Controls airflow during Valsalva manoeuvre (holding breath)'],
      as: ['ফ’নেচন — স্বৰৰজ্জুৱে কম্পন কৰি মাত/শব্দ উৎপন্ন কৰে', 'বায়ুপথ সুৰক্ষা — গিলিবলৈ লোৱাৰ সময়ত এপিগ্লোটিছে এছ্পিৰেশ্যন ৰোধ কৰিবলৈ বন্ধ হয়', 'কাহ প্ৰতিৱৰ্ত — বায়ুপথৰ পৰা বহিৰাগত কণা বাহিৰ কৰে', 'ভালছালভা মেনৱাৰ (উশাহ ধৰি ৰখা)-ৰ সময়ত বায়ু প্ৰবাহ নিয়ন্ত্ৰণ কৰে'],
    },
    keyFacts: {
      en: ['Thyroid cartilage: the largest cartilage; forms the Adam\'s apple (more prominent in males)', 'Cricoid cartilage: the only COMPLETE ring of cartilage in the airway', 'Epiglottis: leaf-shaped cartilage that folds over larynx during swallowing', 'True vocal cords (folds): two bands of elastic tissue; vibrate to produce sound', 'Glottis: the opening between the vocal cords — varies in size during breathing vs. speech'],
      as: ['থাইৰয়েড কাৰ্টিলেজ: আটাইতকৈ ডাঙৰ কাৰ্টিলেজ; এডামছ এপল গঠন কৰে (পুৰুষৰ ক্ষেত্ৰত অধিক প্ৰকট)', 'ক্ৰাইকয়েড কাৰ্টিলেজ: বায়ুপথৰ একমাত্ৰ সম্পূৰ্ণ কাৰ্টিলেজ ৰিং', 'এপিগ্লোটিছ: পাত-আকৃতিৰ কাৰ্টিলেজ যিয়ে গিলিবলৈ লোৱাৰ সময়ত স্বৰযন্ত্ৰৰ ওপৰত ভাঁজ খায়', 'প্ৰকৃত স্বৰৰজ্জু (ভাঁজ): স্থিতিস্থাপক কলাৰ দুটা পট্টি; কম্পন কৰি শব্দ উৎপন্ন কৰে', 'গ্লটিছ: স্বৰৰজ্জুৰ মাজৰ মুকলি অংশ — শ্বসন বনাম কথাৰ সময়ত আকাৰ সলনি হয়'],
    },
    examNotes: {
      en: ['Larynx is the voice box; contains vocal cords for phonation', 'Epiglottis: guards entrance to trachea; prevents food/liquid aspiration', 'Cricoid cartilage is the ONLY complete (360°) ring of cartilage in the airway', 'Thyroid cartilage forms the Adam\'s apple (laryngeal prominence)', 'Laryngitis: inflammation of vocal cords → hoarseness or voice loss', 'Male vocal cords are longer and thicker → lower-pitched voice'],
      as: ['স্বৰযন্ত্ৰ হৈছে ভইছ বাক্স; ফ’নেচনৰ বাবে স্বৰৰজ্জু থাকে', 'এপিগ্লোটিছ: শ্বাসনালীৰ প্ৰৱেশদ্বাৰ সুৰক্ষা; খাদ্য/তৰলৰ এছ্পিৰেশ্যন ৰোধ কৰে', 'ক্ৰাইকয়েড কাৰ্টিলেজ হৈছে বায়ুপথৰ একমাত্ৰ সম্পূৰ্ণ (৩৬০°) কাৰ্টিলেজ ৰিং', 'থাইৰয়েড কাৰ্টিলেজে এডামছ এপল গঠন কৰে (লেৰিঞ্জিয়েল প্ৰমিনেন্স)', 'লেৰিঞ্জাইটিছ: স্বৰৰজ্জুৰ প্ৰদাহ → মাত শাঁহী হোৱা বা মাত হেৰোৱা', 'পুৰুষৰ স্বৰৰজ্জু দীঘল আৰু ডাঠ → চাপৰ-পিচৰ মাত'],
    },
    funFact: { en: 'Human vocal cords can vibrate between 60 Hz (deep bass) and 2,000 Hz (high soprano) — producing the entire range of human speech and song!',
               as: 'মানুহৰ স্বৰৰজ্জুৱে ৬০ Hz (গভীৰ বেছ) আৰু ২,০০০ Hz (উচ্চ চপ্ৰানো)-ৰ মাজত কম্পন কৰিব পাৰে — মানুহৰ কথা আৰু গানৰ সম্পূৰ্ণ পৰিসৰ উৎপন্ন কৰি!' },
    disorders: { en: 'Laryngitis, croup (in children), vocal cord nodules/polyps, laryngeal cancer, epiglottitis',
                 as: 'লেৰিঞ্জাইটিছ, ক্ৰুপ (শিশুৰ ক্ষেত্ৰত), স্বৰৰজ্জু নডিউল/পলিপ, লেৰিঞ্জিয়েল কৰ্কট ৰোগ, এপিগ্লোটাইটিছ' },
    breathingNote: {
      en: 'Air passes through the glottis (vocal cord opening) into the larynx. During breathing, the vocal cords are relaxed and abducted (open wide) to allow maximum airflow. The epiglottis is upright during breathing. During speech, the cords adduct (close) and vibrate as air passes.',
      as: 'বায়ু গ্লটিছ (স্বৰৰজ্জুৰ মুকলি)-ৰ যোগেদি স্বৰযন্ত্ৰত যায়। শ্বসনৰ সময়ত, স্বৰৰজ্জু শিথিল আৰু ফাঁক (বহলকৈ মুকলি) যাতে সৰ্বোচ্চ বায়ু প্ৰবাহ হ’ব পাৰে। শ্বসনৰ সময়ত এপিগ্লোটিছ ঠিয় হৈ থাকে। কথাৰ সময়ত, ৰজ্জু মিলিত (বন্ধ) হয় আৰু বায়ু যোৱাৰ লগে লগে কম্পন কৰে।',
    },
  },
  trachea: {
    id: 'trachea', color: '#7090a8', glowColor: '#90b0c8',
    name: { en: 'Trachea (Windpipe)', as: 'শ্বাসনালী' },
    role: { en: 'Air transport from larynx to bronchi — mucociliary clearance',
            as: 'স্বৰযন্ত্ৰৰ পৰা ব্ৰঙ্কাছলৈ বায়ু পৰিবহন — মিউক‘চিলিয়েৰী পৰিষ্কাৰ' },
    description: {
      en: 'The trachea is a flexible, cylindrical airway tube ~10–12 cm long and 1.5–2.5 cm wide, reinforced by 16–20 C-shaped hyaline cartilage rings that prevent collapse during inhalation.',
      as: 'শ্বাসনালী হৈছে এক নমনীয়, বেলনাকাৰ বায়ুপথ নলিকা ~১০–১২ চে.মি. দীঘল আৰু ১.৫–২.৫ চে.মি. বহল, যিয়ে শ্বাসৰ সময়ত পতন ৰোধ কৰিবলৈ ১৬–২০টা C-আকৃতিৰ হাইলাইন কাৰ্টিলেজ ৰিঙৰে শক্তিশালী।',
    },
    functions: {
      en: ['Conducts air between larynx and main bronchi — pure transport, no gas exchange', 'Mucociliary escalator: cilia beat mucus (with trapped particles) upward to throat', 'C-shaped cartilage rings maintain patency (prevent collapse during negative pressure inhalation)', 'Posterior wall (no cartilage): adjacent to esophagus — allows food to pass'],
      as: ['স্বৰযন্ত্ৰ আৰু মুখ্য ব্ৰঙ্কাছৰ মাজত বায়ু পৰিবহন কৰে — শুদ্ধ পৰিবহন, কোনো গেছ বিনিময় নাই', 'মিউক‘চিলিয়েৰী এস্কেলেটৰ: চিলিয়াই শ্লেষ্মা (আটক কণাৰ সৈতে) ওপৰৰ ডিঙিলৈ ঠেলি পঠিয়ায়', 'C-আকৃতিৰ কাৰ্টিলেজ ৰিঙে মুকলি অৱস্থা বজাই ৰাখে (ঋণাত্মক চাপৰ শ্বাসৰ সময়ত পতন ৰোধ কৰে)', 'পিছফালৰ গা (কোনো কাৰ্টিলেজ নাই): অন্ননালীৰ কাষত — খাদ্য পাৰ হ’বলৈ দিয়ে'],
    },
    keyFacts: {
      en: ['Length: ~10–12 cm; diameter: ~1.5–2.5 cm', '16–20 C-shaped hyaline cartilage rings (open posteriorly)', 'Lined with pseudostratified ciliated columnar epithelium + goblet cells', 'Cilia beat at ~1,000 strokes/min — mucus moves upward at ~10–30 mm/min', 'Carina: the ridge at tracheal bifurcation (T4–T5 level) — very sensitive, triggers cough reflex', 'Trachealis muscle: posterior smooth muscle — can narrow trachea during coughing'],
      as: ['দৈৰ্ঘ্য: ~১০–১২ চে.মি.; ব্যাস: ~১.৫–২.৫ চে.মি.', '১৬–২০টা C-আকৃতিৰ হাইলাইন কাৰ্টিলেজ ৰিং (পিছফালে মুকলি)', 'গবলেট কোষ + ছিউড‘ষ্ট্ৰেটিফায়েড চিলিয়েটেড কলামনাৰ এপিথেলিয়ামেৰে আবৃত', 'চিলিয়াৰ গতি ~১,০০০ ষ্ট্ৰোক/মিনিট — শ্লেষ্মা ~১০–৩০ মি.মি./মিনিটত ওপৰলৈ যায়', 'কেৰিনা: শ্বাসনালী দ্বিভাজনৰ ৰিজ (T4–T5 স্তৰ) — অতি স্পৰ্শকাতৰ, কাহ প্ৰতিৱৰ্ত উদ্দীপ্ত কৰে', 'ট্ৰেকিয়েলিছ পেশী: পিছফালৰ মসৃণ পেশী — কাহৰ সময়ত শ্বাসনালী চেপিব পাৰে'],
    },
    examNotes: {
      en: ['Trachea: ~10–12 cm long; reinforced by 16–20 C-shaped cartilage rings', 'Carina: point where trachea bifurcates into left and right main bronchi (T4/T5 vertebral level)', 'No gas exchange in trachea (anatomical dead space)', 'Mucociliary escalator: removes inhaled particles; damaged by smoking', 'Intubation: tube inserted into trachea for mechanical ventilation'],
      as: ['শ্বাসনালী: ~১০–১২ চে.মি. দীঘল; ১৬–২০টা C-আকৃতিৰ কাৰ্টিলেজ ৰিঙেৰে শক্তিশালী', 'কেৰিনা: শ্বাসনালী বাওঁ আৰু সোঁ মুখ্য ব্ৰঙ্কাছত দ্বিভাজিত হোৱা বিন্দু (T4/T5 কশেৰুকা স্তৰ)', 'শ্বাসনালীত কোনো গেছ বিনিময় নাই (শৰীৰ-গঠনগত মৃত স্থান)', 'মিউক‘চিলিয়েৰী এস্কেলেটৰ: শ্বাসত লোৱা কণা আঁতৰায়; ধূমপানে ক্ষতি কৰে', 'ইনটিউবেচন: যান্ত্ৰিক ভেণ্টিলেচনৰ বাবে শ্বাসনালীত নলিকা সন্নিৱেশ'],
    },
    funFact: { en: 'The cilia lining your trachea beat about 1,000 times per minute — equivalent to an Olympic-level swimmer doing butterfly stroke continuously, just to keep your airway clear!',
               as: 'আপোনাৰ শ্বাসনালীক আবৃত কৰি থকা চিলিয়াৰ গতি মিনিটত প্ৰায় ১,০০০ বাৰ — এজন অলিম্পিক-স্তৰৰ চাঁতৰোতাৱে একেৰাহে বাটাৰফ্লাই ষ্ট্ৰোক কৰাৰ সমান, কেৱল আপোনাৰ বায়ুপথ পৰিষ্কাৰ ৰাখিবলৈ!' },
    disorders: { en: 'Tracheitis, tracheal stenosis, tracheomalacia, tracheostomy (surgical opening), aspirated foreign bodies (right bronchus more common)',
                 as: 'ট্ৰেকিয়াইটিছ, শ্বাসনালী ষ্টেনচিছ, ট্ৰেকিয়মেলেচিয়া, ট্ৰেকিয়‘ষ্টমী (অস্ত্ৰোপচাৰ মুকলি), এছ্পিৰেট কৰা বহিৰাগত বস্তু (সোঁ ব্ৰঙ্কাছত অধিক সাধাৰণ)' },
    breathingNote: {
      en: 'Air flows downward through the trachea. The C-shaped cartilage rings keep the tube open even as the surrounding pressure drops during inhalation. Cilia and mucus are constantly sweeping particles upward. At the carina (bifurcation point), the airway divides into two main bronchi.',
      as: 'বায়ু শ্বাসনালীৰ মাজেৰে তললৈ যায়। শ্বাসৰ সময়ত চাৰিওফালৰ চাপ কম হোৱাৰ পিছতো C-আকৃতিৰ কাৰ্টিলেজ ৰিঙে নলিকাটো মুকলি ৰাখে। চিলিয়া আৰু শ্লেষ্মাই একেৰাহে কণাবোৰ ওপৰলৈ ঠেলি পঠিয়াই থাকে। কেৰিনা (দ্বিভাজন বিন্দু)-ত, বায়ুপথ দুটা মুখ্য ব্ৰঙ্কাছত বিভক্ত হয়।',
    },
  },
  bronchi: {
    id: 'bronchi', color: '#6080a0', glowColor: '#80a0c0',
    name: { en: 'Primary Bronchi', as: 'মুখ্য ব্ৰঙ্কাছ' },
    role: { en: 'Main airways distributing air to each lung',
            as: 'প্ৰতিটো হাঁওফাঁওলৈ বায়ু বিতৰণ কৰা মুখ্য বায়ুপথ' },
    description: {
      en: 'The trachea divides at the carina into the right and left primary (main) bronchi. The right bronchus is shorter, wider, and more vertical; the left bronchus is longer, narrower, and more horizontal.',
      as: 'শ্বাসনালী কেৰিনাত সোঁ আৰু বাওঁ মুখ্য ব্ৰঙ্কাছত বিভক্ত হয়। সোঁ ব্ৰঙ্কাছ চুটি, বহল আৰু অধিক উলম্ব; বাওঁ ব্ৰঙ্কাছ দীঘল, সংকীৰ্ণ আৰু অধিক অনুভূমিক।',
    },
    functions: {
      en: ['Conducts air from trachea into each respective lung', 'Continues mucociliary clearance — no gas exchange', 'Divides into secondary (lobar) bronchi — one per lobe', 'Further divides into tertiary (segmental) bronchi supplying bronchopulmonary segments'],
      as: ['শ্বাসনালীৰ পৰা প্ৰতিটো নিজ নিজ হাঁওফাঁওলৈ বায়ু পৰিবহন কৰে', 'মিউক‘চিলিয়েৰী পৰিষ্কাৰ অব্যাহত — কোনো গেছ বিনিময় নাই', 'ছেকেণ্ডাৰী (লবাৰ) ব্ৰঙ্কাছত বিভক্ত হয় — প্ৰতিটো লবৰ বাবে এটাকৈ', 'অধিকতৰ ভাগ হয় টাৰ্চিয়েৰী (চেগমেণ্টেল) ব্ৰঙ্কাছত যিয়ে ব্ৰঙ্কপালমনেৰী চেগমেণ্ট যোগায়'],
    },
    keyFacts: {
      en: ['Right main bronchus: ~2.5 cm long, wider (~15 mm), more vertical (~25° from midline)', 'Left main bronchus: ~5 cm long, narrower (~11 mm), more horizontal (~45° from midline)', 'Right bronchus more vertical → aspirated foreign objects enter RIGHT lung more often', 'Right lung has 3 lobar bronchi; left lung has 2 lobar bronchi', 'Still contain cartilage (unlike bronchioles)'],
      as: ['সোঁ মুখ্য ব্ৰঙ্কাছ: ~২.৫ চে.মি. দীঘল, বহল (~১৫ মি.মি.), অধিক উলম্ব (মাজৰ ৰেখাৰ পৰা ~২৫°)', 'বাওঁ মুখ্য ব্ৰঙ্কাছ: ~৫ চে.মি. দীঘল, সংকীৰ্ণ (~১১ মি.মি.), অধিক অনুভূমিক (মাজৰ ৰেখাৰ পৰা ~৪৫°)', 'সোঁ ব্ৰঙ্কাছ অধিক উলম্ব → এছ্পিৰেট কৰা বহিৰাগত বস্তু প্ৰায়ে সোঁ হাঁওফাঁওত সোমায়', 'সোঁ হাঁওফাঁওত ৩টা লবাৰ ব্ৰঙ্কাছ; বাওঁ হাঁওফাঁওত ২টা লবাৰ ব্ৰঙ্কাছ আছে', 'এতিয়াও কাৰ্টিলেজ আছে (ব্ৰঙ্কিয়‘লৰ বিপৰীতে)'],
    },
    examNotes: {
      en: ['Right bronchus: shorter, wider, more vertical — aspirated objects preferentially enter here', 'Left bronchus: longer, narrower, more horizontal — passes under aortic arch', 'Bronchial tree: trachea → primary → secondary (lobar) → tertiary (segmental) → bronchioles', 'Bronchi still have cartilage; bronchioles do NOT have cartilage (key distinction)', 'Bronchial arteries supply bronchi; pulmonary arteries supply alveoli for gas exchange'],
      as: ['সোঁ ব্ৰঙ্কাছ: চুটি, বহল, অধিক উলম্ব — এছ্পিৰেট কৰা বস্তু পছন্দনীয়ভাৱে ইয়াত সোমায়', 'বাওঁ ব্ৰঙ্কাছ: দীঘল, সংকীৰ্ণ, অধিক অনুভূমিক — মহাধমনী চাপৰ তলেদি যায়', 'ব্ৰঙ্কিয়েল গছ: শ্বাসনালী → মুখ্য → ছেকেণ্ডাৰী (লবাৰ) → টাৰ্চিয়েৰী (চেগমেণ্টেল) → ব্ৰঙ্কিয়‘ল', 'ব্ৰঙ্কাছত এতিয়াও কাৰ্টিলেজ আছে; ব্ৰঙ্কিয়‘লত কাৰ্টিলেজ নাই (মুখ্য পাৰ্থক্য)', 'ব্ৰঙ্কিয়েল ধমনীয়ে ব্ৰঙ্কাছ যোগায়; ফুসফুসীয় ধমনীয়ে গেছ বিনিময়ৰ বাবে বায়ুকোষ যোগায়'],
    },
    funFact: { en: 'If you accidentally inhale a peanut, it statistically enters the right bronchus because of its more vertical angle — which is why surgeons always check the right lung first!',
               as: 'যদি আপুনি ভুলত এটা চানা গিলি দিয়ে, পৰিসংখ্যাগতভাৱে ই সোঁ ব্ৰঙ্কাছত সোমায় কাৰণ ইয়াৰ কোণ অধিক উলম্ব — সেইবাবে শল্য চিকিৎসকে সদায় প্ৰথমে সোঁ হাঁওফাঁও পৰীক্ষা কৰে!' },
    disorders: { en: 'Bronchitis (acute/chronic), bronchiectasis, bronchoconstriction, bronchial carcinoma, right bronchus foreign body aspiration',
                 as: 'ব্ৰঙ্কাইটিছ (একিউট/ক্ৰনিক), ব্ৰঙ্কিয়েক্টেচিছ, ব্ৰঙ্কোসংকোচন, ব্ৰঙ্কিয়েল কাৰ্চিনোমা, সোঁ ব্ৰঙ্কাছ বহিৰাগত বস্তু এছ্পিৰেশ্যন' },
    breathingNote: {
      en: 'At the carina, the airstream splits into right and left bronchi. The right bronchus supplies the right lung (3 lobes) and the left bronchus supplies the left lung (2 lobes, slightly smaller due to the heart). Each bronchus branches further into lobar then segmental bronchi inside the lungs.',
      as: 'কেৰিনাত, বায়ু ধাৰা সোঁ আৰু বাওঁ ব্ৰঙ্কাছত বিভক্ত হয়। সোঁ ব্ৰঙ্কাছে সোঁ হাঁওফাঁও (৩টা লব) যোগায় আৰু বাওঁ ব্ৰঙ্কাছে বাওঁ হাঁওফাঁও (২টা লব, হৃদপিণ্ডৰ বাবে অলপ সৰু) যোগায়। প্ৰতিটো ব্ৰঙ্কাছ হাঁওফাঁওৰ ভিতৰত লবাৰ তাৰ পিছত চেগমেণ্টেল ব্ৰঙ্কাছত আৰু শাখায়িত হয়।',
    },
  },
  bronchioles: {
    id: 'bronchioles', color: '#5890a8', glowColor: '#78b0c8',
    name: { en: 'Bronchioles', as: 'ব্ৰঙ্কিয়‘ল' },
    role: { en: 'Finest conducting airways — no cartilage, pure airflow regulation',
            as: 'সৰ্বসৰু পৰিবহনকাৰী বায়ুপথ — কাৰ্টিলেজ নাই, বায়ু প্ৰবাহ নিয়ন্ত্ৰণ' },
    description: {
      en: 'Bronchioles are the smallest conducting airways (diameter <1 mm), formed when bronchi lose their cartilage. They terminate in respiratory bronchioles that transition into alveolar ducts and ultimately alveoli.',
      as: 'ব্ৰঙ্কিয়‘ল হৈছে সৰ্বসৰু পৰিবহনকাৰী বায়ুপথ (ব্যাস <১ মি.মি.), যেতিয়া ব্ৰঙ্কাছে কাৰ্টিলেজ হেৰাই তেতিয়া গঠিত হয়। ইহঁতে শ্বসন ব্ৰঙ্কিয়‘লত শেষ হয় যিয়ে বায়ুকোষীয় নলিকা আৰু চূড়ান্তভাৱে বায়ুকোষলৈ গতি কৰে।',
    },
    functions: {
      en: ['Final distribution of air to alveolar units', 'Regulate airflow resistance — smooth muscle contracts/relaxes (bronchospasm vs. bronchodilation)', 'Terminal bronchioles → respiratory bronchioles → alveolar ducts → alveolar sacs → alveoli', 'Still part of the anatomical dead space (no gas exchange until respiratory bronchioles)'],
      as: ['বায়ুকোষীয় এককলৈ বায়ুৰ অন্তিম বিতৰণ', 'বায়ু প্ৰবাহ প্ৰতিৰোধ নিয়ন্ত্ৰণ — মসৃণ পেশী সংকোচন/শিথিল (ব্ৰঙ্কস্পাজম বনাম ব্ৰঙ্কডায়ালেচন)', 'টাৰ্মিনেল ব্ৰঙ্কিয়‘ল → শ্বসন ব্ৰঙ্কিয়‘ল → বায়ুকোষীয় নলিকা → বায়ুকোষীয় থলি → বায়ুকোষ', 'এতিয়াও শৰীৰ-গঠনগত মৃত স্থানৰ অংশ (শ্বসন ব্ৰঙ্কিয়‘ললৈকে কোনো গেছ বিনিময় নাই)'],
    },
    keyFacts: {
      en: ['Diameter <1 mm; NO cartilage — this is the defining difference from bronchi', 'Lined with simple cuboidal/columnar ciliated epithelium', 'Smooth muscle walls → bronchoconstriction (asthma) or bronchodilation (β₂ agonists)', 'Clara cells (club cells): in terminal bronchioles — produce surfactant-like substances', 'Terminal bronchioles: the last purely conducting airways', 'Respiratory bronchioles: have alveoli budding from their walls — first site of gas exchange'],
      as: ['ব্যাস <১ মি.মি.; কাৰ্টিলেজ নাই — এইটোৱেই ব্ৰঙ্কাছৰ পৰা মুখ্য পাৰ্থক্য', 'ছিম্পল কিউবয়ডেল/কলামনাৰ চিলিয়েটেড এপিথেলিয়ামেৰে আবৃত', 'মসৃণ পেশী গা → ব্ৰঙ্কসংকোচন (এজমা) বা ব্ৰঙ্কডায়ালেচন (β₂ এগনিষ্ট)', 'ক্লাৰা কোষ (ক্লাব কোষ): টাৰ্মিনেল ব্ৰঙ্কিয়‘লত — ছাৰ্ফেক্টেণ্ট-জাতীয় পদাৰ্থ উৎপন্ন কৰে', 'টাৰ্মিনেল ব্ৰঙ্কিয়‘ল: অন্তিম শুদ্ধ পৰিবহনকাৰী বায়ুপথ', 'শ্বসন ব্ৰঙ্কিয়‘ল: ইয়াৰ গাত বায়ুকোষ ওলায় — গেছ বিনিময়ৰ প্ৰথম স্থান'],
    },
    examNotes: {
      en: ['KEY: Bronchioles have NO cartilage; bronchi DO have cartilage', 'Asthma: bronchoconstriction (smooth muscle spasm) → narrowed bronchioles → wheeze', 'Anatomical dead space = ~150 mL (trachea + bronchi + conducting bronchioles — no gas exchange)', 'Total surface area of respiratory bronchioles to alveoli = ~70–80 m²', 'Bronchodilators (salbutamol/albuterol): relax smooth muscle → widen bronchioles → easier breathing'],
      as: ['মুখ্য: ব্ৰঙ্কিয়‘লত কাৰ্টিলেজ নাই; ব্ৰঙ্কাছত কাৰ্টিলেজ আছে', 'এজমা: ব্ৰঙ্কসংকোচন (মসৃণ পেশী স্পাজম) → সংকীৰ্ণ ব্ৰঙ্কিয়‘ল → শোঁ-শোঁ শব্দ', 'শৰীৰ-গঠনগত মৃত স্থান = ~১৫০ মি.লি. (শ্বাসনালী + ব্ৰঙ্কাছ + পৰিবহনকাৰী ব্ৰঙ্কিয়‘ল — কোনো গেছ বিনিময় নাই)', 'শ্বসন ব্ৰঙ্কিয়‘লৰ পৰা বায়ুকোষলৈ মুঠ পৃষ্ঠ আয়তন = ~৭০–৮০ বৰ্গ মি.', 'ব্ৰঙ্কডায়ালেটৰ (চালবিউটামল/এলবিউটেৰল): মসৃণ পেশী শিথিল কৰে → ব্ৰঙ্কিয়‘ল প্ৰসাৰিত → সহজে উশাহ লোৱা'],
    },
    funFact: { en: 'The total length of airways from trachea to alveoli, if laid end-to-end, would stretch approximately 2,400 km — the distance from London to Cairo!',
               as: 'শ্বাসনালীৰ পৰা বায়ুকোষলৈ বায়ুপথৰ মুঠ দৈৰ্ঘ্য, মুৰৰ পৰা মুৰলৈ পাৰি দিলে, প্ৰায় ২,৪০০ কি.মি. ব্যাপ্ত হ’ব — লণ্ডনৰ পৰা কায়ৰোৰ দূৰত্ব!' },
    disorders: { en: 'Asthma, bronchiolitis (infants, RSV), obliterative bronchiolitis, COPD (small airways disease)',
                 as: 'এজমা, ব্ৰঙ্কিয়‘লাইটিছ (শিশু, RSV), অব্লিটাৰেটিভ ব্ৰঙ্কিয়‘লাইটিছ, COPD (সৰু বায়ুপথ ৰোগ)' },
    breathingNote: {
      en: 'Air enters progressively smaller bronchioles after the segmental bronchi. The bronchioles have no cartilage — they rely on elastic recoil of surrounding lung tissue to stay open. Terminal bronchioles transition into respiratory bronchioles where alveoli first appear, marking the start of the gas exchange zone.',
      as: 'চেগমেণ্টেল ব্ৰঙ্কাছৰ পিছত বায়ু ক্ৰমান্বয়ে সৰু ব্ৰঙ্কিয়‘লত প্ৰৱেশ কৰে। ব্ৰঙ্কিয়‘লত কাৰ্টিলেজ নাই — মুকলি থাকিবলৈ ই চাৰিওফালৰ হাঁওফাঁও কলাৰ স্থিতিস্থাপক ৰিকইলৰ ওপৰত নিৰ্ভৰ কৰে। টাৰ্মিনেল ব্ৰঙ্কিয়‘ল শ্বসন ব্ৰঙ্কিয়‘ললৈ গতি কৰে য’ত বায়ুকোষ প্ৰথমে দেখা দিয়ে, গেছ বিনিময় অঞ্চলৰ আৰম্ভণি সূচায়।',
    },
  },
  lungs: {
    id: 'lungs', color: '#e8a0a8', glowColor: '#f0bcbf',
    name: { en: 'Lungs', as: 'হাঁওফাঁও' },
    role: { en: 'Paired respiratory organs — contain alveoli for gas exchange',
            as: 'যোৰা শ্বসন অংগ — গেছ বিনিময়ৰ বাবে বায়ুকোষ থাকে' },
    description: {
      en: 'The lungs are the paired principal organs of respiration, located in the thoracic cavity and enclosed by the pleura. The right lung has 3 lobes; the left lung has 2 lobes (cardiac notch accommodates the heart).',
      as: 'হাঁওফাঁও হৈছে শ্বসনৰ যোৰা মুখ্য অংগ, বক্ষ গহ্বৰত অৱস্থিত আৰু প্লিউৰাৰে আবৃত। সোঁ হাঁওফাঁওত ৩টা লব আছে; বাওঁ হাঁওফাঁওত ২টা লব আছে (কাৰ্ডিয়াক নচে হৃদপিণ্ডক ঠাই দিয়ে)।',
    },
    functions: {
      en: ['House ~600 million alveoli for gas exchange', 'Expand and contract with each breathing cycle (tidal volume: ~500 mL)', 'Right lung: 3 lobes (superior, middle, inferior); Left lung: 2 lobes (superior, inferior)', 'Produce surfactant (type II pneumocytes) to prevent alveolar collapse', 'Filter small blood clots and air emboli from pulmonary circulation'],
      as: ['গেছ বিনিময়ৰ বাবে ~৬০ কোটি বায়ুকোষ ৰাখে', 'প্ৰতিটো শ্বসন চক্ৰৰ সৈতে প্ৰসাৰিত আৰু সংকোচিত হয় (টাইডেল ভলিউম: ~৫০০ মি.লি.)', 'সোঁ হাঁওফাঁও: ৩টা লব (ঊৰ্ধ্ব, মধ্য, অধঃ); বাওঁ হাঁওফাঁও: ২টা লব (ঊৰ্ধ্ব, অধঃ)', 'বায়ুকোষ পতন ৰোধ কৰিবলৈ ছাৰ্ফেক্টেণ্ট উৎপন্ন কৰে (টাইপ II নিউমোচাইট)', 'ফুসফুসীয় পৰিবহনৰ পৰা সৰু তেজ গোট আৰু বায়ু এম্বলি ফিল্টাৰ কৰে'],
    },
    keyFacts: {
      en: ['Right lung: larger, 3 lobes, 10 bronchopulmonary segments', 'Left lung: smaller (cardiac notch), 2 lobes, 8–9 bronchopulmonary segments', 'Total lung capacity (TLC): ~6 L; Vital capacity (VC): ~3.5–4.8 L', 'Tidal volume (TV): ~500 mL (normal breath)', 'Inspiratory Reserve Volume (IRV): ~2,500 mL; Expiratory Reserve Volume (ERV): ~1,000 mL', 'Residual Volume (RV): ~1,200 mL (air that cannot be expelled)', 'Functional Residual Capacity (FRC) = ERV + RV = ~2,200 mL'],
      as: ['সোঁ হাঁওফাঁও: ডাঙৰ, ৩টা লব, ১০টা ব্ৰঙ্কপালমনেৰী চেগমেণ্ট', 'বাওঁ হাঁওফাঁও: সৰু (কাৰ্ডিয়াক নচ), ২টা লব, ৮–৯টা ব্ৰঙ্কপালমনেৰী চেগমেণ্ট', 'মুঠ হাঁওফাঁও ধাৰণ ক্ষমতা (TLC): ~৬ লি.; ভাইটেল কেপাচিটি (VC): ~৩.৫–৪.৮ লি.', 'টাইডেল ভলিউম (TV): ~৫০০ মি.লি. (স্বাভাৱিক উশাহ)', 'ইন্‌স্পিৰেটৰি ৰিজাৰ্ভ ভলিউম (IRV): ~২,৫০০ মি.লি.; এক্সপিৰেটৰি ৰিজাৰ্ভ ভলিউম (ERV): ~১,০০০ মি.লি.', 'ৰেচিডিউয়েল ভলিউম (RV): ~১,২০০ মি.লি. (বাহিৰ কৰিব নোৱৰা বায়ু)', 'ফাংকচনেল ৰেচিডিউয়েল কেপাচিটি (FRC) = ERV + RV = ~২,২০০ মি.লি.'],
    },
    examNotes: {
      en: ['Right lung: 3 lobes; Left lung: 2 lobes (cardiac notch makes it smaller)', 'Vital Capacity = TV + IRV + ERV ≈ 4,000 mL', 'Total Lung Capacity = VC + RV ≈ 5,200 mL', 'Tidal Volume: ~500 mL (normal quiet breathing)', 'Residual Volume: ~1,200 mL (always remains in lungs — prevents collapse)', 'Surfactant: reduces surface tension in alveoli; produced by type II pneumocytes', 'Pulmonary circulation: right heart → lungs → left heart (for oxygenation)'],
      as: ['সোঁ হাঁওফাঁও: ৩টা লব; বাওঁ হাঁওফাঁও: ২টা লব (কাৰ্ডিয়াক নচে সৰু কৰে)', 'ভাইটেল কেপাচিটি = TV + IRV + ERV ≈ ৪,০০০ মি.লি.', 'মুঠ হাঁওফাঁও ধাৰণ ক্ষমতা = VC + RV ≈ ৫,২০০ মি.লি.', 'টাইডেল ভলিউম: ~৫০০ মি.লি. (স্বাভাৱিক শান্ত শ্বসন)', 'ৰেচিডিউয়েল ভলিউম: ~১,২০০ মি.লি. (সদায় হাঁওফাঁওত থাকে — পতন ৰোধ কৰে)', 'ছাৰ্ফেক্টেণ্ট: বায়ুকোষত পৃষ্ঠ টেনচন কমায়; টাইপ II নিউমোচাইটে উৎপন্ন কৰে', 'ফুসফুসীয় পৰিবহন: সোঁ হৃদপিণ্ড → হাঁওফাঁও → বাওঁ হৃদপিণ্ড (অক্সিজেনৰ বাবে)'],
    },
    funFact: { en: 'If you could unfold and flatten all the alveoli in your lungs, their combined surface area would cover an entire singles tennis court (approximately 75–80 m²)!',
               as: 'যদি আপুনি আপোনাৰ হাঁওফাঁওৰ সকলো বায়ুকোষ খুলি চেপেটা কৰিব পাৰে, তেওঁলোকৰ সংযুক্ত পৃষ্ঠ আয়তনে সম্পূৰ্ণ এখন একক টেনিছ পথাৰ (প্ৰায় ৭৫–৮০ বৰ্গ মি.) জুৰি ল’ব!' },
    disorders: { en: 'Pneumonia, tuberculosis (TB), lung cancer, COPD, pulmonary fibrosis, pulmonary embolism, pneumothorax, atelectasis',
                 as: 'নিউমোনিয়া, যক্ষ্মা (TB), হাঁওফাঁও কৰ্কট ৰোগ, COPD, ফুসফুসীয় ফাইব্ৰছিছ, ফুসফুসীয় এম্বলিজম, নিউমথ’ৰাক্স, এটেলেক্টেচিছ' },
    breathingNote: {
      en: 'During inhalation, both lungs expand in all directions as the diaphragm contracts downward and the intercostal muscles raise the ribs. Intrapulmonary pressure drops below atmospheric, drawing air in. The right lung receives slightly more airflow (60%) than the left due to the right bronchus geometry.',
      as: 'শ্বাসৰ সময়ত, মধ্যচ্ছদা তললৈ সংকোচিত হোৱাৰ আৰু আন্তঃকশেৰুকা পেশীয়ে পঞ্জৰাস্থি উঠাই দিয়াৰ লগে লগে দুয়োটা হাঁওফাঁও সকলো দিশলৈ প্ৰসাৰিত হয়। ইন্ট্ৰাপালমনেৰী চাপ বায়ুমণ্ডলীয়ৰ তলত পৰে, বায়ু ভিতৰলৈ টানি আনে। সোঁ ব্ৰঙ্কাছ জ্যামিতিৰ বাবে সোঁ হাঁওফাঁওয়ে বাওঁতকৈ অলপ অধিক বায়ু প্ৰবাহ পায় (৬০%)।',
    },
  },
  alveoli: {
    id: 'alveoli', color: '#f0c8c8', glowColor: '#ffdddd',
    name: { en: 'Alveoli', as: 'বায়ুকোষ' },
    role: { en: 'Primary site of gas exchange — O₂ enters blood, CO₂ exits',
            as: 'গেছ বিনিময়ৰ মুখ্য স্থান — O₂ তেজলৈ যায়, CO₂ ওলায়' },
    description: {
      en: 'Alveoli are tiny air sacs (~0.2 mm diameter) at the terminal ends of the bronchiolar tree. With ~600 million alveoli per adult lung pair, the total surface area is ~75–80 m², optimized for efficient gas exchange.',
      as: 'বায়ুকোষ হৈছে ব্ৰঙ্কিয়‘লাৰ গছৰ অন্তিম মুৰৰ সৰু বায়ু থলি (~০.২ মি.মি. ব্যাস)। প্ৰাপ্তবয়স্ক হাঁওফাঁও যোৰাত ~৬০ কোটি বায়ুকোষ থকাৰ লগে লগে, মুঠ পৃষ্ঠ আয়তন ~৭৫–৮০ বৰ্গ মি., কাৰ্যক্ষম গেছ বিনিময়ৰ বাবে অনুকূলিত।',
    },
    functions: {
      en: ['Gaseous exchange: O₂ diffuses from alveoli → blood; CO₂ diffuses from blood → alveoli', 'Very thin walls (0.1–0.2 μm) minimize diffusion distance for gases', 'Surrounded by a dense capillary network for rapid gas exchange', 'Type II pneumocytes secrete pulmonary surfactant (reduces surface tension → prevents collapse)', 'Alveolar macrophages (dust cells): immune defence — engulf inhaled particles'],
      as: ['গেছীয় বিনিময়: O₂ বায়ুকোষ → তেজলৈ ব্যাপিত হয়; CO₂ তেজ → বায়ুকোষলৈ ব্যাপিত হয়', 'অতি পাতল গা (০.১–০.২ μm)-এ গেছৰ ব্যাপন দূৰত্ব কমায়', 'দ্ৰুত গেছ বিনিময়ৰ বাবে ঘন কেপিলেৰী জালেৰে আবৃত', 'টাইপ II নিউমোচাইটে ফুসফুসীয় ছাৰ্ফেক্টেণ্ট ক্ষৰণ কৰে (পৃষ্ঠ টেনচন কমায় → পতন ৰোধ কৰে)', 'বায়ুকোষীয় মেক্ৰোফেজ (ধূলি কোষ): ৰোগ-প্ৰতিৰোধী সুৰক্ষা — শ্বাসত লোৱা কণা গ্ৰাস কৰে'],
    },
    keyFacts: {
      en: ['~600 million alveoli per adult; diameter ~0.2 mm', 'Total surface area: ~75–80 m² (size of a singles tennis court)', 'Wall thickness: 0.1–0.2 μm (extremely thin for rapid diffusion)', 'Type I pneumocytes (squamous): ~95% of alveolar surface — gas exchange', 'Type II pneumocytes (~5%): produce surfactant (lecithin/phosphatidylcholine)', 'Partial pressure gradient drives diffusion: PO₂ alveoli=104 mmHg, blood=40 mmHg (O₂ enters); PCO₂ blood=45 mmHg, alveoli=40 mmHg (CO₂ exits)', 'Respiratory membrane = alveolar epithelium + basement membrane + capillary endothelium (~0.5 μm)'],
      as: ['প্ৰাপ্তবয়স্ক প্ৰতিজনত ~৬০ কোটি বায়ুকোষ; ব্যাস ~০.২ মি.মি.', 'মুঠ পৃষ্ঠ আয়তন: ~৭৫–৮০ বৰ্গ মি. (একক টেনিছ পথাৰৰ আকাৰ)', 'গাৰ ডাঠ: ০.১–০.২ μm (দ্ৰুত ব্যাপনৰ বাবে অতি পাতল)', 'টাইপ I নিউমোচাইট (স্কোৱেমাছ): বায়ুকোষীয় পৃষ্ঠৰ ~৯৫% — গেছ বিনিময়', 'টাইপ II নিউমোচাইট (~৫%): ছাৰ্ফেক্টেণ্ট উৎপন্ন কৰে (লেচিথিন/ফছফেটিডিল‘কলিন)', 'আংশিক চাপ গ্ৰেডিয়েণ্টে ব্যাপন চলায়: PO₂ বায়ুকোষ=১০৪ mmHg, তেজ=৪০ mmHg (O₂ সোমায়); PCO₂ তেজ=৪৫ mmHg, বায়ুকোষ=৪০ mmHg (CO₂ ওলায়)', 'শ্বসন আৱৰণ = বায়ুকোষীয় এপিথেলিয়াম + বেচ‘মেণ্ট আৱৰণ + কেপিলেৰী এণ্ডোথেলিয়াম (~০.৫ μm)'],
    },
    examNotes: {
      en: ['Alveoli: primary site of gaseous exchange in humans', 'Fick\'s law: rate of diffusion ∝ surface area × pressure difference / thickness', '~600 million alveoli; total surface area ~75–80 m²', 'Surfactant: prevents alveolar collapse (atelectasis); deficient in premature infants → NRDS', 'Partial pressures: O₂ (alveoli=104 mmHg) > O₂ (blood=40 mmHg) → O₂ enters blood', 'PCO₂ (blood=45 mmHg) > PCO₂ (alveoli=40 mmHg) → CO₂ enters alveoli', 'Alveolar macrophages = dust cells: immune defence in alveoli'],
      as: ['বায়ুকোষ: মানুহৰ গেছীয় বিনিময়ৰ মুখ্য স্থান', 'ফিকৰ নীতি: ব্যাপনৰ হাৰ ∝ পৃষ্ঠ আয়তন × চাপ পাৰ্থক্য / ডাঠ', '~৬০ কোটি বায়ুকোষ; মুঠ পৃষ্ঠ আয়তন ~৭৫–৮০ বৰ্গ মি.', 'ছাৰ্ফেক্টেণ্ট: বায়ুকোষীয় পতন (এটেলেক্টেচিছ) ৰোধ কৰে; অকাল শিশুত অভাৱ → NRDS', 'আংশিক চাপ: O₂ (বায়ুকোষ=১০৪ mmHg) > O₂ (তেজ=৪০ mmHg) → O₂ তেজত সোমায়', 'PCO₂ (তেজ=৪৫ mmHg) > PCO₂ (বায়ুকোষ=৪০ mmHg) → CO₂ বায়ুকোষত সোমায়', 'বায়ুকোষীয় মেক্ৰোফেজ = ধূলি কোষ: বায়ুকোষত ৰোগ-প্ৰতিৰোধী সুৰক্ষা'],
    },
    funFact: { en: 'Your lungs contain about 600 million alveoli — if you laid them all out flat, they\'d cover an entire tennis court. They perform their gas exchange work in less than 0.75 seconds per breath!',
               as: 'আপোনাৰ হাঁওফাঁওত প্ৰায় ৬০ কোটি বায়ুকোষ আছে — যদি আপুনি ইহঁতক সকলো চেপেটাকৈ পাৰি দিয়ে, ইহঁতে এখন সম্পূৰ্ণ টেনিছ পথাৰ জুৰি ল’ব। ইহঁতে প্ৰতি উশাহত ০.৭৫ ছেকেণ্ডতকৈও কম সময়ত গেছ বিনিময় কাম সম্পাদন কৰে!' },
    disorders: { en: 'Pulmonary fibrosis, ARDS (acute respiratory distress syndrome), pneumonia, emphysema (alveolar destruction), NRDS (neonatal — surfactant deficiency)',
                 as: 'ফুসফুসীয় ফাইব্ৰছিছ, ARDS (একিউট ৰেছপিৰেটৰি ডিষ্ট্ৰেছ ছিনড্ৰম), নিউমোনিয়া, এমফিজেমা (বায়ুকোষ ধ্বংস), NRDS (ন’ভজাত — ছাৰ্ফেক্টেণ্ট অভাৱ)' },
    breathingNote: {
      en: 'This is the miracle moment! Oxygen-rich air in the alveoli meets the oxygen-poor blood in surrounding capillaries. O₂ diffuses along its partial pressure gradient from alveoli (PO₂=104 mmHg) into blood (PO₂=40 mmHg). Simultaneously, CO₂ moves from blood (PCO₂=45 mmHg) into alveoli (PCO₂=40 mmHg). The whole exchange takes less than 0.75 seconds.',
      as: 'এইটোৱে অলৌকিক মুহূৰ্ত! বায়ুকোষৰ অক্সিজেন-সমৃদ্ধ বায়ু চাৰিওফালৰ কেপিলেৰীৰ অক্সিজেন-দুৰ্বল তেজৰ সৈতে মিলিত হয়। O₂ ইয়াৰ আংশিক চাপ গ্ৰেডিয়েণ্টৰ সৈতে বায়ুকোষ (PO₂=১০৪ mmHg)-ৰ পৰা তেজ (PO₂=৪০ mmHg)-লৈ ব্যাপিত হয়। একে সময়তে, CO₂ তেজ (PCO₂=৪৫ mmHg)-ৰ পৰা বায়ুকোষ (PCO₂=৪০ mmHg)-লৈ গতি কৰে। গোটেই বিনিময় ০.৭৫ ছেকেণ্ডতকৈও কম সময় লয়।',
    },
  },
  diaphragm: {
    id: 'diaphragm', color: '#a05858', glowColor: '#c07070',
    name: { en: 'Diaphragm', as: 'মধ্যচ্ছদা' },
    role: { en: 'Primary muscle of inspiration — dome-shaped musculotendinous sheet',
            as: 'শ্বাসৰ মুখ্য পেশী — গম্বুজ-আকৃতিৰ পেশী-টেণ্ডিনাছ চাদৰ' },
    description: {
      en: 'The diaphragm is a dome-shaped musculotendinous partition separating the thoracic cavity from the abdominal cavity. It is the principal muscle of inspiration, responsible for ~70–80% of the work of normal quiet breathing.',
      as: 'মধ্যচ্ছদা হৈছে বক্ষ গহ্বৰক উদৰ গহ্বৰৰ পৰা পৃথক কৰা গম্বুজ-আকৃতিৰ পেশী-টেণ্ডিনাছ পট্ট। ই শ্বাসৰ মুখ্য পেশী, স্বাভাৱিক শান্ত শ্বসনৰ ~৭০–৮০% কামৰ বাবে দায়ী।',
    },
    functions: {
      en: ['Primary muscle of inspiration: contracts → flattens → increases thoracic volume → air enters', 'Relaxation during expiration: rises back to dome shape → decreases thoracic volume → air exits', 'Hiccups: sudden involuntary diaphragm contraction with glottis closure', 'Assists in coughing, sneezing, vomiting, urination, defecation (increased intra-abdominal pressure)'],
      as: ['শ্বাসৰ মুখ্য পেশী: সংকোচিত → চেপেটা → বক্ষ আয়তন বঢ়ায় → বায়ু সোমায়', 'প্ৰশ্বাসৰ সময়ত শিথিল: গম্বুজ আকাৰলৈ ঘূৰি যায় → বক্ষ আয়তন কমায় → বায়ু ওলায়', 'হিক্কা: গ্লটিছ বন্ধৰ সৈতে আকস্মিক অনিচ্ছাকৃত মধ্যচ্ছদা সংকোচন', 'কাহ, হাঁচি, বমি, মূত্ৰত্যাগ, মলত্যাগত সহায় কৰে (বঢ়া আন্তঃ-উদৰীয় চাপ)'],
    },
    keyFacts: {
      en: ['Dome-shaped when relaxed (rises ~5 cm into thorax); flattens ~1–1.5 cm during quiet breathing', 'Innervated by phrenic nerve (C3, C4, C5 — "C3, 4, 5 keeps the diaphragm alive")', 'Central tendon: non-muscular, tendinous centre of diaphragm', 'Three major openings: aortic hiatus (T12), esophageal hiatus (T10), caval opening (T8)', 'Right dome is higher than left (liver pushes it up)'],
      as: ['শিথিল হ’লে গম্বুজ-আকৃতি (বক্ষলৈ ~৫ চে.মি. উঠে); শান্ত শ্বসনৰ সময়ত ~১–১.৫ চে.মি. চেপেটা হয়', 'ফ্ৰেনিক স্নায়ুৰে ইনাৰভেট কৰা (C3, C4, C5 — "C3, 4, 5 মধ্যচ্ছদা জীয়াই ৰাখে")', 'কেন্দ্ৰীয় টেণ্ডন: মধ্যচ্ছদাৰ অ-পেশীযুক্ত, টেণ্ডিনাছ কেন্দ্ৰ', 'তিনিটা মুখ্য মুকলি: এৰটিক হায়েটাছ (T12), ইছফেজিয়েল হায়েটাছ (T10), কেভাল মুকলি (T8)', 'সোঁ গম্বুজ বাওঁতকৈ ওপৰত (যকৃতে ইয়াক ওপৰলৈ ঠেলি দিয়ে)'],
    },
    examNotes: {
      en: ['Diaphragm: primary muscle of inspiration (70–80% of breathing effort)', 'Innervated by phrenic nerve (C3, C4, C5 spinal nerves)', 'Inhalation: diaphragm contracts and descends → thoracic volume increases → pressure drops → air flows in', 'Exhalation (quiet): passive — diaphragm relaxes and ascends → thoracic volume decreases → air flows out', 'Forced exhalation: internal intercostals + abdominal muscles actively compress thorax', 'Hiccups = singultus: involuntary diaphragm spasm + simultaneous glottis closure'],
      as: ['মধ্যচ্ছদা: শ্বাসৰ মুখ্য পেশী (শ্বসন প্ৰচেষ্টাৰ ৭০–৮০%)', 'ফ্ৰেনিক স্নায়ুৰে (C3, C4, C5 স্পাইনেল স্নায়ু) ইনাৰভেট কৰা', 'শ্বাস: মধ্যচ্ছদা সংকোচিত আৰু নামি যায় → বক্ষ আয়তন বাঢ়ে → চাপ কমে → বায়ু ভিতৰলৈ যায়', 'প্ৰশ্বাস (শান্ত): পেছিভ — মধ্যচ্ছদা শিথিল আৰু ওপৰলৈ উঠে → বক্ষ আয়তন কমে → বায়ু বাহিৰলৈ যায়', 'বলপূৰ্ণ প্ৰশ্বাস: ভিতৰৰ আন্তঃকশেৰুকা + উদৰীয় পেশীয়ে সক্ৰিয়ভাৱে বক্ষ চেপি ধৰে', 'হিক্কা = ছিংগাল্টাছ: অনিচ্ছাকৃত মধ্যচ্ছদা স্পাজম + একে সময়ত গ্লটিছ বন্ধ'],
    },
    funFact: { en: 'The diaphragm contracts over 20,000 times a day — more than any other skeletal muscle in the body — and rarely fatigues because it is rich in fatigue-resistant type I muscle fibres!',
               as: 'মধ্যচ্ছদা দৈনিক ২০,০০০-তকৈ অধিক বাৰ সংকোচিত হয় — শৰীৰৰ আন কোনো কঙ্কাল পেশীতকৈও অধিক — আৰু ই কেতিয়াও ক্লান্ত নহয় কাৰণ ই ক্লান্তি-প্ৰতিৰোধী টাইপ I পেশী তন্তুত সমৃদ্ধ!' },
    disorders: { en: 'Diaphragmatic hernia, hiccups (singultus), diaphragmatic paralysis (phrenic nerve damage), eventration of diaphragm',
                 as: 'মধ্যচ্ছদাজনিত হাৰ্নিয়া, হিক্কা (ছিংগাল্টাছ), মধ্যচ্ছদা পক্ষাঘাত (ফ্ৰেনিক স্নায়ু ক্ষতি), মধ্যচ্ছদা ইভেণ্ট্ৰেচন' },
    breathingNote: {
      en: 'During inhalation, the diaphragm is the powerhouse: it contracts and flattens, pushing abdominal organs downward and increasing the vertical dimension of the thoracic cavity. This drops intrapulmonary pressure ~1–3 mmHg below atmospheric, creating the suction that draws air into the lungs. During quiet exhalation, it simply relaxes and rises back passively.',
      as: 'শ্বাসৰ সময়ত, মধ্যচ্ছদা হৈছে শক্তিকেন্দ্ৰ: ই সংকোচিত আৰু চেপেটা হয়, উদৰীয় অংগক তললৈ ঠেলি বক্ষ গহ্বৰৰ উলম্ব আয়তন বঢ়ায়। ই ইন্ট্ৰাপালমনেৰী চাপ বায়ুমণ্ডলীয়তকৈ ~১–৩ mmHg কমাই দিয়ে, হাঁওফাঁওলৈ বায়ু টানি অনা চোষণ সৃষ্টি কৰে। শান্ত প্ৰশ্বাসৰ সময়ত, ই কেৱল শিথিল হয় আৰু নিষ্ক্ৰিয়ভাৱে ওপৰলৈ উঠে।',
    },
  },
  pleura: {
    id: 'pleura', color: '#90b8d0', glowColor: '#a8d0e8',
    name: { en: 'Pleural Membrane', as: 'ফুসফুসাৱৰণ' },
    role: { en: 'Double-layered sac enclosing each lung — reduces friction, maintains negative pressure',
            as: 'প্ৰতিটো হাঁওফাঁও আগুৰি ৰখা দ্বি-স্তৰীয় থলি — ঘৰ্ষণ কমায়, ঋণাত্মক চাপ বজাই ৰাখে' },
    description: {
      en: 'The pleura is a thin double-layered serous membrane enclosing each lung: the visceral pleura (covers the lung) and the parietal pleura (lines the thoracic wall). The potential space between them contains ~15–20 mL of lubricating fluid.',
      as: 'ফুসফুসাৱৰণ হৈছে প্ৰতিটো হাঁওফাঁও আগুৰি ৰখা এক পাতল দ্বি-স্তৰীয় চেৰ’ছ আৱৰণ: ভিচাৰেল প্লিউৰা (হাঁওফাঁও ঢাকে) আৰু পেৰাইটেল প্লিউৰা (বক্ষ গাত আবৃত)। ইহঁতৰ মাজৰ সম্ভাৱ্য স্থানত ~১৫–২০ মি.লি. পিছল-ক্ৰিয়াকাৰী তৰল থাকে।',
    },
    functions: {
      en: ['Lubricates lung surface during breathing — reduces friction between lung and chest wall', 'Negative intrapleural pressure (~−3 to −5 mmHg) keeps lungs expanded against chest wall', 'Transmits mechanical forces from chest wall to lung during breathing', 'Maintains structural integrity of the breathing mechanism'],
      as: ['শ্বসনৰ সময়ত হাঁওফাঁও পৃষ্ঠ পিছল কৰে — হাঁওফাঁও আৰু বুকুৰ গাৰ মাজৰ ঘৰ্ষণ কমায়', 'ঋণাত্মক ইন্ট্ৰাপ্লিউৰাল চাপ (~−৩ ৰ পৰা −৫ mmHg)-এ হাঁওফাঁও বুকুৰ গাৰ বিৰুদ্ধে প্ৰসাৰিত ৰাখে', 'শ্বসনৰ সময়ত বুকুৰ গাৰ পৰা হাঁওফাঁওলৈ যান্ত্ৰিক বল প্ৰেৰণ কৰে', 'শ্বসন প্ৰক্ৰিয়াৰ গাঠনিক অখণ্ডতা বজাই ৰাখে'],
    },
    keyFacts: {
      en: ['Visceral pleura: tightly adheres to lung surface, innervated by visceral nerve (no pain)', 'Parietal pleura: lines thoracic wall, diaphragm, mediastinum — innervated by somatic nerves (pain-sensitive)', 'Pleural cavity: potential space between visceral and parietal pleura', 'Pleural fluid: 15–20 mL, acts as lubricant — reduces friction during breathing', 'Intrapleural pressure: always negative (−3 to −5 mmHg at rest) — prevents lung collapse'],
      as: ['ভিচাৰেল প্লিউৰা: হাঁওফাঁও পৃষ্ঠৰ লগত টানকৈ লাগি থাকে, ভিচাৰেল স্নায়ুৰে ইনাৰভেট (বিষ নাই)', 'পেৰাইটেল প্লিউৰা: বক্ষ গা, মধ্যচ্ছদা, মেডিয়াষ্টিনাম আবৃত — চ‘মেটিক স্নায়ুৰে ইনাৰভেট (বিষ-স্পৰ্শকাতৰ)', 'প্লিউৰাল গহ্বৰ: ভিচাৰেল আৰু পেৰাইটেল প্লিউৰাৰ মাজৰ সম্ভাৱ্য স্থান', 'প্লিউৰাল তৰল: ১৫–২০ মি.লি., পিছল-ক্ৰিয়াকাৰী ৰূপে কাম কৰে — শ্বসনৰ সময়ত ঘৰ্ষণ কমায়', 'ইন্ট্ৰাপ্লিউৰাল চাপ: সদায় ঋণাত্মক (জিৰণিত −৩ ৰ পৰা −৫ mmHg) — হাঁওফাঁও পতন ৰোধ কৰে'],
    },
    examNotes: {
      en: ['Visceral pleura: covers lung (no pain sensation); Parietal pleura: lines chest wall (pain sensation)', 'Pleural cavity: potential space with 15–20 mL lubricating fluid', 'Intrapleural pressure is always negative → keeps lungs inflated against chest wall', 'Pneumothorax: air enters pleural cavity → lung collapses (intrapleural pressure equalizes with atmosphere)', 'Pleurisy: inflamed pleura → sharp chest pain on breathing', 'Pleural effusion: excess fluid in pleural space → compresses lung → breathlessness'],
      as: ['ভিচাৰেল প্লিউৰা: হাঁওফাঁও ঢাকে (বিষ অনুভৱ নাই); পেৰাইটেল প্লিউৰা: বুকুৰ গা আবৃত (বিষ অনুভৱ)', 'প্লিউৰাল গহ্বৰ: ১৫–২০ মি.লি. পিছল তৰলৰ সৈতে সম্ভাৱ্য স্থান', 'ইন্ট্ৰাপ্লিউৰাল চাপ সদায় ঋণাত্মক → হাঁওফাঁওক বুকুৰ গাৰ বিৰুদ্ধে স্ফীত ৰাখে', 'নিউমথ’ৰাক্স: বায়ু প্লিউৰাল গহ্বৰত সোমায় → হাঁওফাঁও পতন (ইন্ট্ৰাপ্লিউৰাল চাপ বায়ুমণ্ডলৰ সৈতে সমান হয়)', 'প্লিউৰিচী: প্ৰদাহিত প্লিউৰা → উশাহ ল’লে বুকুৰ তীব্ৰ বিষ', 'প্লিউৰাল ইফিউজন: প্লিউৰাল স্থানত অতিৰিক্ত তৰল → হাঁওফাঁও চেপি ধৰে → উশাহ লোৱাত অসুবিধা'],
    },
    funFact: { en: 'The negative pressure in your pleural cavity essentially "sucks" your lungs open — like a plunger effect. That\'s why a stab wound that opens the chest wall causes a lung to immediately collapse!',
               as: 'আপোনাৰ প্লিউৰাল গহ্বৰৰ ঋণাত্মক চাপে মূলতঃ আপোনাৰ হাঁওফাঁওক মুকলিকৈ "চোষণ" কৰে — প্লাঞ্জাৰ প্ৰভাৱৰ দৰে। সেইবাবেই বুকুৰ গা মুকলি কৰা এটা ছুৰিৰ আঘাতে এটা হাঁওফাঁও তৎক্ষণাত পতন কৰাই দিয়ে!' },
    disorders: { en: 'Pleurisy (pleuritis), pleural effusion, pneumothorax (collapsed lung), haemothorax, mesothelioma (pleural cancer from asbestos)',
                 as: 'প্লিউৰিচী (প্লিউৰাইটিছ), প্লিউৰাল ইফিউজন, নিউমথ’ৰাক্স (পতিত হাঁওফাঁও), হিমথ’ৰাক্স, মেছ‘থেলিয়মা (এ্যাছবেষ্টছৰ পৰা প্লিউৰাল কৰ্কট ৰোগ)' },
    breathingNote: {
      en: 'The pleura is not visible in normal breathing, but it is crucial: the negative pressure between the visceral and parietal pleura (like a suction cup) keeps the lung surface pressed against the chest wall. As the chest wall expands during inhalation, the lung is dragged along with it — all thanks to pleural pressure.',
      as: 'স্বাভাৱিক শ্বসনত প্লিউৰা দেখা নাযায়, কিন্তু ই অতি গুৰুত্বপূৰ্ণ: ভিচাৰেল আৰু পেৰাইটেল প্লিউৰাৰ মাজৰ ঋণাত্মক চাপ (চোষণ কাপৰ দৰে)-এ হাঁওফাঁও পৃষ্ঠক বুকুৰ গাৰ বিৰুদ্ধে চেপি ৰাখে। শ্বাসৰ সময়ত বুকুৰ গা প্ৰসাৰিত হোৱাৰ লগে লগে, হাঁওফাঁওটোকো তাৰ লগতে টানি নিয়া হয় — সকলো প্লিউৰাল চাপৰ বাবে।',
    },
  },
  ribs: {
    id: 'ribs', color: '#c8d8e8', glowColor: '#d8e8f0',
    name: { en: 'Rib Cage', as: 'পঞ্জৰাস্থিখাঁচা' },
    role: { en: 'Bony thorax — protects organs, assists breathing via intercostal muscles',
            as: 'অস্থিময় বক্ষ — অংগ সুৰক্ষা, আন্তঃকশেৰুকা পেশীৰ যোগেদি শ্বসনত সহায় কৰে' },
    description: {
      en: 'The rib cage consists of 12 pairs of ribs, costal cartilages, and the sternum. The intercostal muscles between the ribs are crucial for breathing: external intercostals elevate ribs (inspiration); internal intercostals depress ribs (forced expiration).',
      as: 'পঞ্জৰাস্থিখাঁচা ১২ যোৰা পঞ্জৰা, কষ্টেল কাৰ্টিলেজ, আৰু ষ্টাৰ্ণামেৰে গঠিত। পঞ্জৰাৰ মাজৰ আন্তঃকশেৰুকা পেশী শ্বসনৰ বাবে অতি গুৰুত্বপূৰ্ণ: বাহ্যিক আন্তঃকশেৰুকাই পঞ্জৰা উঠাই দিয়ে (শ্বাস); ভিতৰৰ আন্তঃকশেৰুকাই পঞ্জৰা তললৈ লমায় (বলপূৰ্ণ প্ৰশ্বাস)।',
    },
    functions: {
      en: ['Protects thoracic organs (heart, lungs, great vessels)', 'External intercostal muscles: elevate ribs → increase thoracic volume (inspiration)', 'Internal intercostal muscles: depress ribs → decrease thoracic volume (forced expiration)', 'Provides structural framework for respiratory mechanics (pump handle and bucket handle movements)'],
      as: ['বক্ষ অংগ (হৃদপিণ্ড, হাঁওফাঁও, ডাঙৰ পাত্ৰ) সুৰক্ষা কৰে', 'বাহ্যিক আন্তঃকশেৰুকা পেশী: পঞ্জৰা উঠাই দিয়ে → বক্ষ আয়তন বঢ়ায় (শ্বাস)', 'ভিতৰৰ আন্তঃকশেৰুকা পেশী: পঞ্জৰা তললৈ লমায় → বক্ষ আয়তন কমায় (বলপূৰ্ণ প্ৰশ্বাস)', 'শ্বসন যন্ত্ৰবিদ্যাৰ বাবে গাঠনিক কাঠামো প্ৰদান কৰে (পাম্প হেণ্ডেল আৰু বাল্টি হেণ্ডেল গতি)'],
    },
    keyFacts: {
      en: ['12 pairs of ribs; sternum (manubrium + body + xiphoid process) in the front', 'True ribs (1–7): attach directly to sternum via costal cartilage', 'False ribs (8–10): attach to 7th costal cartilage (not directly to sternum)', 'Floating ribs (11–12): free anteriorly — no sternal attachment', 'External intercostal muscles: fibres run downward-forward → elevate ribs (inspiration)', 'Internal intercostal muscles: fibres run downward-backward → depress ribs (forced expiration)', '"Pump handle" movement: upper ribs increase AP diameter; "bucket handle": lower ribs increase lateral diameter'],
      as: ['১২ যোৰা পঞ্জৰা; ষ্টাৰ্ণাম (মেনুব্ৰিয়াম + দেহ + জাইফয়েড প্ৰচেছ) আগফালে', 'প্ৰকৃত পঞ্জৰা (১–৭): কষ্টেল কাৰ্টিলেজৰ যোগেদি ষ্টাৰ্ণামৰ লগত পোনপটীয়াকৈ লাগে', 'মিছা পঞ্জৰা (৮–১০): ৭ম কষ্টেল কাৰ্টিলেজৰ লগত লাগে (ষ্টাৰ্ণামৰ সৈতে পোনপটীয়াকৈ নহয়)', 'ভাহি থকা পঞ্জৰা (১১–১২): আগফালে মুক্ত — কোনো ষ্টাৰ্ণাল সংযোগ নাই', 'বাহ্যিক আন্তঃকশেৰুকা পেশী: তন্তু তললৈ-আগলৈ চলে → পঞ্জৰা উঠাই দিয়ে (শ্বাস)', 'ভিতৰৰ আন্তঃকশেৰুকা পেশী: তন্তু তললৈ-পিছলৈ চলে → পঞ্জৰা তললৈ লমায় (বলপূৰ্ণ প্ৰশ্বাস)', '"পাম্প হেণ্ডেল" গতি: ওপৰৰ পঞ্জৰাই AP ব্যাস বঢ়ায়; "বাল্টি হেণ্ডেল": তলৰ পঞ্জৰাই পাৰ্শ্ব ব্যাস বঢ়ায়'],
    },
    examNotes: {
      en: ['12 pairs of ribs: 7 true (1–7) + 3 false (8–10) + 2 floating (11–12)', 'External intercostals: active during INSPIRATION (elevate ribs)', 'Internal intercostals: active during FORCED EXPIRATION (depress ribs)', 'Quiet expiration is PASSIVE (only diaphragm and external intercostals relax)', 'Intercostal nerve: runs in costal groove (under each rib) — important for nerve blocks', 'Sternal angle (angle of Louis): marks junction of manubrium and body; level of T4/T5, carina'],
      as: ['১২ যোৰা পঞ্জৰা: ৭টা প্ৰকৃত (১–৭) + ৩টা মিছা (৮–১০) + ২টা ভাহি থকা (১১–১২)', 'বাহ্যিক আন্তঃকশেৰুকা: শ্বাসৰ সময়ত সক্ৰিয় (পঞ্জৰা উঠাই দিয়ে)', 'ভিতৰৰ আন্তঃকশেৰুকা: বলপূৰ্ণ প্ৰশ্বাসৰ সময়ত সক্ৰিয় (পঞ্জৰা তললৈ লমায়)', 'শান্ত প্ৰশ্বাস হৈছে পেছিভ (কেৱল মধ্যচ্ছদা আৰু বাহ্যিক আন্তঃকশেৰুকা শিথিল হয়)', 'আন্তঃকশেৰুকা স্নায়ু: কষ্টেল গ্ৰুভত (প্ৰতিটো পঞ্জৰাৰ তলত) চলে — স্নায়ু ব্লকৰ বাবে গুৰুত্বপূৰ্ণ', 'ষ্টাৰ্ণাল কোণ (এংগেল অফ লুইছ): মেনুব্ৰিয়াম আৰু দেহৰ সংযোগ সূচায়; T4/T5 স্তৰ, কেৰিনা'],
    },
    funFact: { en: 'A newborn baby has the same number of ribs as an adult: 24 (12 pairs). Ribs 1 through 7 are often called "true ribs" while 11 and 12 are "floating" — attached only at the back!',
               as: 'এজন নৱজাত শিশুৰ এজন প্ৰাপ্তবয়স্কৰ সমান সংখ্যক পঞ্জৰা থাকে: ২৪ (১২ যোৰা)। ১ ৰ পৰা ৭ নং পৰ্যন্ত পঞ্জৰাবোৰক প্ৰায়ে "প্ৰকৃত পঞ্জৰা" কোৱা হয় আৰু ১১ আৰু ১২ "ভাহি থকা" — কেৱল পিছফালে লাগি আছে!' },
    disorders: { en: 'Rib fractures, costochondritis (Tietze syndrome), flail chest, intercostal neuralgia, thoracic outlet syndrome',
                 as: 'পঞ্জৰা ভঙা, কষ্টোক‘ণ্ড্ৰাইটিছ (টিটজে ছিনড্ৰম), ফ্লেইল চেষ্ট, আন্তঃকশেৰুকা নিউৰালজিয়া, থ‘ৰাচিক আউটলেট ছিনড্ৰম' },
    breathingNote: {
      en: 'During inhalation, the external intercostal muscles contract, pulling the ribs upward and outward (like lifting a bucket handle). This increases the lateral and anteroposterior diameters of the thorax, helping draw air in alongside the diaphragm\'s contribution. During quiet expiration, the intercostals simply relax and the chest recoils passively.',
      as: 'শ্বাসৰ সময়ত, বাহ্যিক আন্তঃকশেৰুকা পেশী সংকোচিত হয়, পঞ্জৰাবোৰক ওপৰলৈ আৰু বাহিৰলৈ টানে (বাল্টি হেণ্ডেল উঠোৱাৰ দৰে)। ই বক্ষৰ পাৰ্শ্ব আৰু আগ-পিছৰ ব্যাস বঢ়ায়, মধ্যচ্ছদাৰ অৱদানৰ লগতে বায়ু ভিতৰলৈ টানি অনাত সহায় কৰে। শান্ত প্ৰশ্বাসৰ সময়ত, আন্তঃকশেৰুকাবোৰ কেৱল শিথিল হয় আৰু বুকু নিষ্ক্ৰিয়ভাৱে পুনৰ আকাৰ লয়।',
    },
  },
};

export const JOURNEY_STEPS: JourneyStep[] = [
  { x: 270, y: 48,  organId: 'nasal',       stage: { en: 'Nasal Cavity',        as: 'নাসা গহ্বৰ' },
    shortNote: { en: 'Air enters. Filtered by hairs & mucus. Warmed to 37°C. Humidified to 100%.',
                 as: 'বায়ু সোমায়। চুলি আৰু শ্লেষ্মাৰে ফিল্টাৰ। ৩৭°C-লৈ উষ্ণ। ১০০%-লৈ আৰ্দ্ৰ।' } },
  { x: 270, y: 92,  organId: 'pharynx',      stage: { en: 'Pharynx',             as: 'গ্ৰাসনালী' },
    shortNote: { en: 'Air passes through the nasopharynx → oropharynx → laryngopharynx.',
                 as: 'বায়ু নাছোফেৰিংক্স → অৰোফেৰিংক্স → লেৰিংগোফেৰিংক্সৰ মাজেৰে যায়।' } },
  { x: 270, y: 135, organId: 'larynx',       stage: { en: 'Larynx',              as: 'স্বৰযন্ত্ৰ' },
    shortNote: { en: 'Vocal cords open wide (abduct). Epiglottis is upright. Air flows freely.',
                 as: 'স্বৰৰজ্জু বহলকৈ মুকলি (ফাঁক)। এপিগ্লোটিছ ঠিয়। বায়ু মুক্তভাৱে যায়।' } },
  { x: 270, y: 215, organId: 'trachea',      stage: { en: 'Trachea',             as: 'শ্বাসনালী' },
    shortNote: { en: 'Air travels down 10–12 cm. Cilia beat mucus upward. C-cartilage keeps tube open.',
                 as: 'বায়ু ১০–১২ চে.মি. তললৈ যায়। চিলিয়াই শ্লেষ্মা ওপৰলৈ ঠেলি দিয়ে। C-কাৰ্টিলেজে নলিকা মুকলি ৰাখে।' } },
  { x: 218, y: 298, organId: 'bronchi',      stage: { en: 'Right Main Bronchus', as: 'সোঁ মুখ্য ব্ৰঙ্কাছ' },
    shortNote: { en: 'Air splits at carina. Right bronchus is shorter & wider — receives more airflow.',
                 as: 'বায়ু কেৰিনাত বিভক্ত হয়। সোঁ ব্ৰঙ্কাছ চুটি আৰু বহল — অধিক বায়ু প্ৰবাহ পায়।' } },
  { x: 334, y: 310, organId: 'bronchi',      stage: { en: 'Left Main Bronchus',  as: 'বাওঁ মুখ্য ব্ৰঙ্কাছ' },
    shortNote: { en: 'Left bronchus curves under aortic arch to reach the left lung\'s two lobes.',
                 as: 'বাওঁ ব্ৰঙ্কাছ মহাধমনী চাপৰ তলেদি বক্ৰ হৈ বাওঁ হাঁওফাঁওৰ দুটা লবলৈ যায়।' } },
  { x: 195, y: 378, organId: 'bronchioles',  stage: { en: 'Bronchioles',         as: 'ব্ৰঙ্কিয়‘ল' },
    shortNote: { en: 'Air reaches finest airways (<1 mm). No cartilage. Smooth muscle regulates flow.',
                 as: 'বায়ু সৰ্বসৰু বায়ুপথ (<১ মি.মি.)-ত পায়। কাৰ্টিলেজ নাই। মসৃণ পেশীয়ে প্ৰবাহ নিয়ন্ত্ৰণ কৰে।' } },
  { x: 195, y: 418, organId: 'alveoli',      stage: { en: 'Alveoli — O₂ in!',   as: 'বায়ুকোষ — O₂ সোমাই!' },
    shortNote: { en: 'O₂ (PO₂=104 mmHg) diffuses into blood (PO₂=40 mmHg). CO₂ moves the other way.',
                 as: 'O₂ (PO₂=১০৪ mmHg) তেজলৈ (PO₂=৪০ mmHg) ব্যাপিত। CO₂ ওলোটা দিশে যায়।' } },
  { x: 270, y: 545, organId: 'diaphragm',    stage: { en: 'Diaphragm',           as: 'মধ্যচ্ছদা' },
    shortNote: { en: 'Contraction complete. Now the diaphragm relaxes — exhalation begins passively.',
                 as: 'সংকোচন সম্পূৰ্ণ। এতিয়া মধ্যচ্ছদা শিথিল হয় — প্ৰশ্বাস নিষ্ক্ৰিয়ভাৱে আৰম্ভ।' } },
  { x: 270, y: 215, organId: 'trachea',      stage: { en: 'Exhalation — CO₂↑',  as: 'প্ৰশ্বাস — CO₂↑' },
    shortNote: { en: 'CO₂-rich air travels back up through bronchi → trachea → larynx → pharynx → nose.',
                 as: 'CO₂-সমৃদ্ধ বায়ু ব্ৰঙ্কাছ → শ্বাসনালী → স্বৰযন্ত্ৰ → গ্ৰাসনালী → নাকৰ মাজেৰে ঘূৰি যায়।' } },
  { x: 270, y: 48,  organId: 'nasal',        stage: { en: 'Exhalation Complete', as: 'প্ৰশ্বাস সম্পূৰ্ণ' },
    shortNote: { en: 'CO₂ exits through the nose (or mouth). One complete breathing cycle in ~5 seconds.',
                 as: 'CO₂ নাক (বা মুখ)-ৰ মাজেৰে ওলায়। ~৫ ছেকেণ্ডত এটা সম্পূৰ্ণ শ্বসন চক্ৰ।' } },
];

export const QUIZ_DATA: QuizQ[] = [
  {
    q: { en: 'What is the primary site of gaseous exchange in the human respiratory system?',
         as: 'মানৱ শ্বসন তন্ত্ৰত গেছীয় বিনিময়ৰ মুখ্য স্থান কি?' },
    opts: { en: ['Trachea', 'Bronchioles', 'Alveoli', 'Bronchi'],
            as: ['শ্বাসনালী', 'ব্ৰঙ্কিয়‘ল', 'বায়ুকোষ', 'ব্ৰঙ্কাছ'] },
    ans: 2,
    explanation: { en: 'Alveoli are the primary site of gaseous exchange. Their thin walls (0.1–0.2 μm), large surface area (~75 m²), and rich capillary supply allow rapid O₂ and CO₂ diffusion.',
                   as: 'বায়ুকোষ হৈছে গেছীয় বিনিময়ৰ মুখ্য স্থান। ইহঁতৰ পাতল গা (০.১–০.২ μm), ডাঙৰ পৃষ্ঠ আয়তন (~৭৫ বৰ্গ মি.), আৰু সমৃদ্ধ কেপিলেৰী যোগানে দ্ৰুত O₂ আৰু CO₂ ব্যাপনৰ অনুমতি দিয়ে।' },
  },
  {
    q: { en: 'During inhalation, what happens to the diaphragm?',
         as: 'শ্বাসৰ সময়ত, মধ্যচ্ছদাৰ কি হয়?' },
    opts: { en: ['It relaxes and rises upward', 'It contracts and moves downward', 'It remains stationary', 'It expands sideways'],
            as: ['ই শিথিল হৈ ওপৰলৈ উঠে', 'ই সংকোচিত হৈ তললৈ যায়', 'ই স্থিৰ হৈ থাকে', 'ই কাষলৈ প্ৰসাৰিত হয়'] },
    ans: 1,
    explanation: { en: 'During inhalation, the diaphragm contracts and flattens (moves downward), increasing the vertical dimension of the thoracic cavity, reducing intrapulmonary pressure, and drawing air in.',
                   as: 'শ্বাসৰ সময়ত, মধ্যচ্ছদা সংকোচিত আৰু চেপেটা হয় (তললৈ যায়), বক্ষ গহ্বৰৰ উলম্ব আয়তন বঢ়ায়, ইন্ট্ৰাপালমনেৰী চাপ কমায়, আৰু বায়ু ভিতৰলৈ টানি আনে।' },
  },
  {
    q: { en: 'The trachea is kept open (patent) by:',
         as: 'শ্বাসনালীক মুকলি (পেটেণ্ট) ৰখা হয় কোনে?' },
    opts: { en: ['Elastic tissue rings', 'C-shaped rings of hyaline cartilage', 'Smooth muscle rings', 'Intercostal muscles'],
            as: ['স্থিতিস্থাপক কলা ৰিং', 'হাইলাইন কাৰ্টিলেজৰ C-আকৃতিৰ ৰিং', 'মসৃণ পেশী ৰিং', 'আন্তঃকশেৰুকা পেশী'] },
    ans: 1,
    explanation: { en: 'The trachea is reinforced by 16–20 C-shaped rings of hyaline cartilage that prevent it from collapsing during the negative pressures of inhalation. The posterior opening faces the esophagus.',
                   as: 'শ্বাসনালী ১৬–২০টা হাইলাইন কাৰ্টিলেজৰ C-আকৃতিৰ ৰিঙেৰে শক্তিশালী যিয়ে শ্বাসৰ ঋণাত্মক চাপত পতন ৰোধ কৰে। পিছফালৰ মুকলি অংশ অন্ননালীৰ দিশে।' },
  },
  {
    q: { en: 'Normal adult breathing rate (at rest) is approximately:',
         as: 'প্ৰাপ্তবয়স্কৰ স্বাভাৱিক শ্বসন হাৰ (জিৰণিত) প্ৰায় কিমান?' },
    opts: { en: ['5–8 breaths/min', '12–16 breaths/min', '25–30 breaths/min', '40–50 breaths/min'],
            as: ['৫–৮ উশাহ/মিনিট', '১২–১৬ উশাহ/মিনিট', '২৫–৩০ উশাহ/মিনিট', '৪০–৫০ উশাহ/মিনিট'] },
    ans: 1,
    explanation: { en: 'Normal adult breathing rate at rest is 12–16 breaths per minute. This is called eupnoea. Tachypnoea (>20/min) and bradypnoea (<12/min) are abnormal.',
                   as: 'প্ৰাপ্তবয়স্কৰ জিৰণিত স্বাভাৱিক শ্বসন হাৰ মিনিটত ১২–১৬ উশাহ। ইয়াক ইউপনিয়া কোৱা হয়। টেকিপনিয়া (>২০/মিনিট) আৰু ব্ৰেডিপনিয়া (<১২/মিনিট) অস্বাভাৱিক।' },
  },
  {
    q: { en: 'Tidal Volume (TV) refers to:',
         as: 'টাইডেল ভলিউম (TV) বুলিলে বুজা যায়:' },
    opts: { en: ['Maximum air inhaled forcefully', 'Air that always remains in lungs', 'Volume breathed in/out during normal quiet breathing (~500 mL)', 'Maximum air that can be exhaled'],
            as: ['বলপূৰ্বক শ্বাসত লোৱা সৰ্বোচ্চ বায়ু', 'হাঁওফাঁওত সদায় থকা বায়ু', 'স্বাভাৱিক শান্ত শ্বসনত শ্বাস/প্ৰশ্বাস কৰা আয়তন (~৫০০ মি.লি.)', 'প্ৰশ্বাসত উলিয়াব পৰা সৰ্বোচ্চ বায়ু'] },
    ans: 2,
    explanation: { en: 'Tidal Volume is the volume of air inhaled or exhaled in a normal, quiet breathing cycle — approximately 500 mL in adults. It is NOT the maximum volume the lungs can hold.',
                   as: 'টাইডেল ভলিউম হৈছে স্বাভাৱিক, শান্ত শ্বসন চক্ৰত শ্বাসত লোৱা বা প্ৰশ্বাসত উলিওৱা বায়ুৰ আয়তন — প্ৰাপ্তবয়স্কত প্ৰায় ৫০০ মি.লি.। ই হাঁওফাঁৱে ধাৰণ কৰিব পৰা সৰ্বোচ্চ আয়তন নহয়।' },
  },
  {
    q: { en: 'Which muscle is innervated by the phrenic nerve (C3, C4, C5)?',
         as: 'কোন পেশী ফ্ৰেনিক স্নায়ু (C3, C4, C5)-এ ইনাৰভেট কৰে?' },
    opts: { en: ['External intercostals', 'Internal intercostals', 'Diaphragm', 'Abdominal muscles'],
            as: ['বাহ্যিক আন্তঃকশেৰুকা', 'ভিতৰৰ আন্তঃকশেৰুকা', 'মধ্যচ্ছদা', 'উদৰীয় পেশী'] },
    ans: 2,
    explanation: { en: 'The diaphragm is innervated by the phrenic nerve (C3, C4, C5). The mnemonic "C3, 4, 5 keeps the diaphragm alive" is widely used. Injury above C3 requires mechanical ventilation.',
                   as: 'মধ্যচ্ছদা ফ্ৰেনিক স্নায়ু (C3, C4, C5)-এ ইনাৰভেট কৰে। "C3, 4, 5 মধ্যচ্ছদা জীয়াই ৰাখে" সূত্ৰটো বহুলভাৱে ব্যৱহৃত। C3-ৰ ওপৰৰ আঘাতত যান্ত্ৰিক ভেণ্টিলেচন প্ৰয়োজন।' },
  },
  {
    q: { en: 'Which gas diffuses FROM the blood INTO the alveoli during gas exchange?',
         as: 'গেছ বিনিময়ৰ সময়ত কোন গেছ তেজৰ পৰা বায়ুকোষলৈ ব্যাপিত হয়?' },
    opts: { en: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Water vapour'],
            as: ['অক্সিজেন (O₂)', 'কাৰ্বন ডাইঅক্সাইড (CO₂)', 'নাইট্ৰজেন (N₂)', 'পানীৰ ভাপ'] },
    ans: 1,
    explanation: { en: 'CO₂ diffuses FROM the blood (PCO₂=45 mmHg) INTO the alveoli (PCO₂=40 mmHg) along its partial pressure gradient. O₂ moves in the opposite direction — from alveoli to blood.',
                   as: 'CO₂ আংশিক চাপ গ্ৰেডিয়েণ্টৰ সৈতে তেজ (PCO₂=৪৫ mmHg)-ৰ পৰা বায়ুকোষ (PCO₂=৪০ mmHg)-লৈ ব্যাপিত হয়। O₂ ওলোটা দিশে যায় — বায়ুকোষৰ পৰা তেজলৈ।' },
  },
  {
    q: { en: 'What is the key structural difference between bronchi and bronchioles?',
         as: 'ব্ৰঙ্কাছ আৰু ব্ৰঙ্কিয়‘লৰ মাজত মুখ্য গাঠনিক পাৰ্থক্য কি?' },
    opts: { en: ['Bronchioles have thicker walls', 'Bronchi have no cilia', 'Bronchioles have NO cartilage; bronchi DO have cartilage', 'Bronchi have no smooth muscle'],
            as: ['ব্ৰঙ্কিয়‘লৰ গা ডাঠ', 'ব্ৰঙ্কাছত চিলিয়া নাই', 'ব্ৰঙ্কিয়‘লত কাৰ্টিলেজ নাই; ব্ৰঙ্কাছত কাৰ্টিলেজ আছে', 'ব্ৰঙ্কাছত মসৃণ পেশী নাই'] },
    ans: 2,
    explanation: { en: 'The defining structural difference: bronchi contain cartilage (C-rings and plates) that keep them open; bronchioles lack cartilage and rely on elastic recoil of lung tissue and smooth muscle tone.',
                   as: 'নিৰ্ণায়ক গাঠনিক পাৰ্থক্য: ব্ৰঙ্কাছত কাৰ্টিলেজ (C-ৰিং আৰু প্লেট) থাকে যিয়ে ইহঁতক মুকলি ৰাখে; ব্ৰঙ্কিয়‘লত কাৰ্টিলেজ নাথাকে আৰু হাঁওফাঁও কলাৰ স্থিতিস্থাপক ৰিকইল আৰু মসৃণ পেশী টোনৰ ওপৰত নিৰ্ভৰ কৰে।' },
  },
  {
    q: { en: 'Vital Capacity (VC) of the lungs equals:',
         as: 'হাঁওফাঁওৰ ভাইটেল কেপাচিটি (VC) সমান হয়:' },
    opts: { en: ['Tidal Volume only', 'TV + IRV (Inspiratory Reserve Volume)', 'TV + IRV + ERV (Expiratory Reserve Volume)', 'Total Lung Capacity − Tidal Volume'],
            as: ['কেৱল টাইডেল ভলিউম', 'TV + IRV (ইন্‌স্পিৰেটৰি ৰিজাৰ্ভ ভলিউম)', 'TV + IRV + ERV (এক্সপিৰেটৰি ৰিজাৰ্ভ ভলিউম)', 'মুঠ হাঁওফাঁও ক্ষমতা − টাইডেল ভলিউম'] },
    ans: 2,
    explanation: { en: 'Vital Capacity = TV + IRV + ERV ≈ 500 + 2500 + 1000 = 4000 mL (~4 L). It represents the maximum volume of air that can be exhaled after a maximum inhalation.',
                   as: 'ভাইটেল কেপাচিটি = TV + IRV + ERV ≈ ৫০০ + ২৫০০ + ১০০০ = ৪০০০ মি.লি. (~৪ লি.)। ই সৰ্বোচ্চ শ্বাসৰ পিছত প্ৰশ্বাসত উলিয়াব পৰা সৰ্বোচ্চ বায়ু আয়তন বুজায়।' },
  },
  {
    q: { en: 'Breathing rate (respiratory rhythm) is primarily controlled by the:',
         as: 'শ্বসন হাৰ (শ্বসন ছন্দ) মুখ্যত নিয়ন্ত্ৰিত হয়:' },
    opts: { en: ['Cerebellum', 'Medulla oblongata', 'Cerebral cortex', 'Hypothalamus'],
            as: ['চেৰিবেলাম', 'মেডুলা অব্লংগাটা', 'চেৰিব্ৰেল কৰ্টেক্স', 'হাইপথেলামাছ'] },
    ans: 1,
    explanation: { en: 'The respiratory centre in the medulla oblongata (brainstem) sets the basic rhythmic pattern of breathing. It responds to CO₂ levels (via pH/chemoreceptors) — rising CO₂ increases breathing rate.',
                   as: 'মেডুলা অব্লংগাটা (ব্ৰেইনষ্টেম)-ৰ শ্বসন কেন্দ্ৰে শ্বসনৰ মৌলিক ছন্দময় ছাঁচ নিৰ্ধাৰণ কৰে। ই CO₂ স্তৰলৈ সঁহাৰি দিয়ে (pH/কেমোৰিচেপ্টৰৰ যোগেদি) — CO₂ বঢ়িলে শ্বসন হাৰ বঢ়ে।' },
  },
];
