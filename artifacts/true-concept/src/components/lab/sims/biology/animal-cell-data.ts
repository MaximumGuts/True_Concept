import type { BilingualField } from "@/lib/i18n";

/**
 * Animal cell organelle data — bilingual (English + Assamese).
 *
 * Translation source: NCERT Class IX/X Biology Assamese edition, supplemented
 * with the Vigyan Bharati Assamese science glossary. Where NCERT uses a
 * Sanskrit-derived term (কেন্দ্ৰক, ৰিক্তিকা) we prefer it over a pure
 * transliteration (নিউক্লিয়াছ, ভেকুৱ'ল). For organelle names that have no
 * universally accepted Assamese form (ৰাইবোজোম, লাইছোজোম, মাইটকণ্ড্ৰিয়া),
 * we use the standard Assamese transliteration as found in NCERT-Assam.
 */
export interface OrganelleDef {
  id: string;
  name: BilingualField<string>;
  color: string;
  description: BilingualField<string>;
  function: BilingualField<string>;
  examNotes: BilingualField<string>;
  analogy: BilingualField<string>;
}

export const ORGANELLES: Record<string, OrganelleDef> = {
  membrane: {
    id: "membrane", color: "#334155",
    name: { en: "Cell Membrane", as: "কোষ পৰ্দা" },
    description: {
      en: "A thin, flexible bilayer of phospholipids embedded with proteins that forms the outer boundary of the cell. It is selectively permeable.",
      as: "প্ৰটিনযুক্ত ফছফোলিপিডৰ এক পাতল, নমনীয় দ্বিস্তৰীয় আৱৰণ যিয়ে কোষৰ বাহিৰৰ সীমা গঠন কৰে। ই বাছনীয়ভাৱে প্ৰৱেশযোগ্য।",
    },
    function: {
      en: "Controls entry and exit of substances. Provides shape and protection to the cell.",
      as: "পদাৰ্থৰ প্ৰৱেশ আৰু নিৰ্গমন নিয়ন্ত্ৰণ কৰে। কোষক আকৃতি আৰু সুৰক্ষা প্ৰদান কৰে।",
    },
    examNotes: {
      en: "Made of a phospholipid bilayer with embedded proteins (Fluid Mosaic Model). Selectively permeable — allows only specific molecules to pass.",
      as: "প্ৰটিনযুক্ত ফছফোলিপিড দ্বিস্তৰেৰে গঠিত (Fluid Mosaic Model)। বাছনীয়ভাৱে প্ৰৱেশযোগ্য — কেৱল নিৰ্দিষ্ট অণুসমূহকে অতিক্ৰম কৰিবলৈ দিয়ে।",
    },
    analogy: {
      en: "The Security Gate / Border Wall of the cell.",
      as: "কোষৰ সুৰক্ষা প্ৰৱেশদ্বাৰ / সীমাৰ দেৱাল।",
    },
  },
  cytoplasm: {
    id: "cytoplasm", color: "#bae6fd",
    name: { en: "Cytoplasm", as: "সাইটোপ্লাজম" },
    description: {
      en: "A jelly-like, semi-fluid substance (cytosol) that fills the cell between the nucleus and the cell membrane. All organelles are suspended in it.",
      as: "কেন্দ্ৰক আৰু কোষ পৰ্দাৰ মাজত থকা জেলিৰ দৰে অৰ্ধতৰল পদাৰ্থ (চাইটোছল)। সকলো কোষাঙ্গ ইয়াত ভাহি থাকে।",
    },
    function: {
      en: "Site of many chemical reactions. Provides medium for organelles. Contains enzymes for glycolysis.",
      as: "বহু ৰাসায়নিক বিক্ৰিয়াৰ স্থান। কোষাঙ্গৰ বাবে মাধ্যম প্ৰদান কৰে। গ্লাইক'লাইছিছৰ এনজাইম থাকে।",
    },
    examNotes: {
      en: "Made of water, salts, and organic molecules. Cytosol + organelles = cytoplasm. Glycolysis occurs here.",
      as: "পানী, লৱণ আৰু জৈৱিক অণুৰে গঠিত। চাইটোছল + কোষাঙ্গ = সাইটোপ্লাজম। গ্লাইক'লাইছিছ ইয়াতে হয়।",
    },
    analogy: {
      en: "The Factory Floor / Workspace of the cell.",
      as: "কোষৰ কাৰখানাৰ মজিয়া / কাৰ্যক্ষেত্ৰ।",
    },
  },
  nucleus: {
    id: "nucleus", color: "#fef08a",
    name: { en: "Nucleus", as: "কেন্দ্ৰক" },
    description: {
      en: "The largest organelle, bound by a double membrane (nuclear envelope). Contains chromatin (DNA + histone proteins) and the nucleolus.",
      as: "সৰ্ববৃহৎ কোষাঙ্গ, দ্বিস্তৰীয় আৱৰণেৰে আবৃত (কেন্দ্ৰক আৱৰণ)। ক্ৰোমাটিন (DNA + হিষ্টোন প্ৰটিন) আৰু কেন্দ্ৰিকা থাকে।",
    },
    function: {
      en: "Stores genetic material (DNA). Controls cell activities. Site of DNA replication and transcription.",
      as: "জিনগত উপাদান (DNA) সংৰক্ষণ কৰে। কোষৰ কাৰ্যকলাপ নিয়ন্ত্ৰণ কৰে। DNA প্ৰতিৰূপণ আৰু প্ৰতিলিপিকৰণৰ স্থান।",
    },
    examNotes: {
      en: "Double-membrane with nuclear pores. Contains chromatin → chromosomes during division. Nucleolus produces rRNA for ribosomes.",
      as: "কেন্দ্ৰক ছিদ্ৰযুক্ত দ্বিস্তৰীয় আৱৰণ। কোষ বিভাজনৰ সময়ত ক্ৰোমাটিন → ক্ৰোমোজোম। কেন্দ্ৰিকাই ৰাইবোজোমৰ বাবে rRNA উৎপন্ন কৰে।",
    },
    analogy: {
      en: "The Brain / Control Center of the cell.",
      as: "কোষৰ মগজু / নিয়ন্ত্ৰণ কেন্দ্ৰ।",
    },
  },
  nucleolus: {
    id: "nucleolus", color: "#f472b6",
    name: { en: "Nucleolus", as: "কেন্দ্ৰিকা" },
    description: {
      en: "A dense, dark-staining body inside the nucleus. It is not membrane-bound.",
      as: "কেন্দ্ৰকৰ ভিতৰত থকা ঘনত্বপূৰ্ণ, গাঢ় ৰঙৰ গঠন। ইয়াৰ বাহ্যিক আৱৰণ নাই।",
    },
    function: {
      en: "Produces ribosomal RNA (rRNA) and assembles ribosome subunits.",
      as: "ৰাইবোজোমাল RNA (rRNA) উৎপন্ন কৰে আৰু ৰাইবোজোমৰ উপ-অংশ একত্ৰিত কৰে।",
    },
    examNotes: {
      en: "Not membrane-bound. Disappears during cell division. Composed of RNA and proteins.",
      as: "আৱৰণযুক্ত নহয়। কোষ বিভাজনৰ সময়ত অদৃশ্য হয়। RNA আৰু প্ৰটিনেৰে গঠিত।",
    },
    analogy: {
      en: "The Ribosome Factory inside the Brain.",
      as: "মগজুৰ ভিতৰৰ ৰাইবোজোম কাৰখানা।",
    },
  },
  chromatin: {
    id: "chromatin", color: "#d8b4fe",
    name: { en: "Chromatin (DNA)", as: "ক্ৰোমাটিন (DNA)" },
    description: {
      en: "A mass of genetic material composed of DNA and proteins that condense to form chromosomes during eukaryotic cell division.",
      as: "DNA আৰু প্ৰটিনেৰে গঠিত জিনগত উপাদানৰ গোট, যিয়ে ইউক্যাৰিয়টিক কোষ বিভাজনৰ সময়ত ঘনীভূত হৈ ক্ৰোমোজোম গঠন কৰে।",
    },
    function: {
      en: "Packages DNA into a small volume to fit into the nucleus and protects the DNA structure and sequence.",
      as: "DNA-ক সৰু আয়তনত পেক কৰি কেন্দ্ৰকত খাপ খুৱাই থয় আৰু DNA-ৰ গঠন তথা ক্ৰম সুৰক্ষিত ৰাখে।",
    },
    examNotes: {
      en: "Contains genes. Euchromatin is loosely packed and actively transcribed; heterochromatin is densely packed and inactive.",
      as: "জিন থাকে। ইউক্ৰোমাটিন কোমলভাৱে পেক হোৱা আৰু সক্ৰিয়ভাৱে প্ৰতিলিপি হোৱা; হেট্ৰোক্ৰোমাটিন ঘনভাৱে পেক হোৱা আৰু নিষ্ক্ৰিয়।",
    },
    analogy: {
      en: "The Blueprint / Instruction Manual.",
      as: "ব্লুপ্ৰিণ্ট / নিৰ্দেশনা পুথি।",
    },
  },
  mitochondria: {
    id: "mitochondria", color: "#ef4444",
    name: { en: "Mitochondria", as: "মাইটকণ্ড্ৰিয়া" },
    description: {
      en: "Bean-shaped, double-membrane organelles. The inner membrane is extensively folded into cristae to maximize the surface area for ATP production.",
      as: "শিম-আকৃতিৰ দ্বিস্তৰীয় আৱৰণযুক্ত কোষাঙ্গ। ভিতৰৰ আৱৰণে ATP উৎপাদনৰ পৃষ্ঠ আয়তন বঢ়াবলৈ ক্ৰিষ্টা গঠন কৰি ভাঁজ খায়।",
    },
    function: {
      en: "Produces ATP via aerobic cellular respiration (Krebs cycle and oxidative phosphorylation on cristae).",
      as: "এৰোবিক কোষীয় শ্বসনৰ জৰিয়তে ATP উৎপন্ন কৰে (ক্ৰেবছ চক্ৰ আৰু ক্ৰিষ্টাত অক্সিডেটিভ ফছফৰাইলেচন)।",
    },
    examNotes: {
      en: "Double membrane — inner membrane forms cristae. Has its OWN circular DNA and 70S ribosomes (endosymbiotic origin). Called the 'Powerhouse of the Cell'.",
      as: "দ্বিস্তৰীয় আৱৰণ — ভিতৰৰ আৱৰণে ক্ৰিষ্টা গঠন কৰে। নিজৰ বৃত্তাকাৰ DNA আৰু 70S ৰাইবোজোম থাকে (এণ্ডোছিম্বিয়টিক উৎপত্তি)। ইয়াক 'কোষৰ শক্তিকেন্দ্ৰ' বুলি কোৱা হয়।",
    },
    analogy: {
      en: "The Power Plant / Powerhouse of the cell.",
      as: "কোষৰ বিদ্যুৎকেন্দ্ৰ / শক্তিকেন্দ্ৰ।",
    },
  },
  roughER: {
    id: "roughER", color: "#d946ef",
    name: { en: "Rough Endoplasmic Reticulum", as: "অমসৃণ এণ্ডোপ্লাজমিক ৰেটিকুলাম" },
    description: {
      en: "A network of flattened membranous sacs (cisternae) studded with ribosomes on the cytoplasmic surface. Continuous with the outer nuclear membrane.",
      as: "চাইটোপ্লাজমিক পৃষ্ঠত ৰাইবোজোমযুক্ত চেপেটা আৱৰণ-থলি (সিষ্টাৰনি)ৰ এক জাল। কেন্দ্ৰকৰ বাহ্যিক আৱৰণৰ সৈতে সংযুক্ত।",
    },
    function: {
      en: "Synthesizes proteins (via attached ribosomes) and transports them to the Golgi for processing.",
      as: "প্ৰটিন সংশ্লেষণ কৰে (যুক্ত ৰাইবোজোমৰ জৰিয়তে) আৰু সেইবোৰ প্ৰক্ৰিয়াকৰণৰ বাবে গলগিলৈ পঠিয়ায়।",
    },
    examNotes: {
      en: "'Rough' because of bound 80S ribosomes. Continuous with nuclear envelope. Makes secretory and membrane proteins.",
      as: "80S ৰাইবোজোম যুক্ত হোৱা বাবে 'অমসৃণ'। কেন্দ্ৰক আৱৰণৰ সৈতে সংযুক্ত। ক্ষৰণ আৰু আৱৰণ প্ৰটিন তৈয়াৰ কৰে।",
    },
    analogy: {
      en: "The Protein Assembly Line / Manufacturing Belt.",
      as: "প্ৰটিন সমাহাৰ লাইন / উৎপাদন বেল্ট।",
    },
  },
  smoothER: {
    id: "smoothER", color: "#38bdf8",
    name: { en: "Smooth Endoplasmic Reticulum", as: "মসৃণ এণ্ডোপ্লাজমিক ৰেটিকুলাম" },
    description: {
      en: "A tubular network of membranes WITHOUT ribosomes. Extends from the Rough ER.",
      as: "ৰাইবোজোম বিহীন নলাকাৰ আৱৰণ-জাল। অমসৃণ ER-ৰ পৰা বিস্তৃত।",
    },
    function: {
      en: "Synthesizes lipids, phospholipids, and steroids. Detoxifies drugs and poisons. Stores calcium ions in muscle cells.",
      as: "লিপিড, ফছফোলিপিড আৰু ষ্টেৰয়ড সংশ্লেষণ কৰে। ঔষধ আৰু বিষ নিৰ্বিষ কৰে। পেশী কোষত কেলচিয়াম আয়ন জমা ৰাখে।",
    },
    examNotes: {
      en: "No ribosomes (hence 'smooth'). Abundant in liver cells (detoxification) and muscle cells (Ca²⁺ storage). Produces steroid hormones in adrenal glands.",
      as: "ৰাইবোজোম নাই (সেইবাবে 'মসৃণ')। যকৃৎ কোষত (নিৰ্বিষকৰণ) আৰু পেশী কোষত (Ca²⁺ সংৰক্ষণ) প্ৰচুৰ। এড্ৰিনেল গ্ৰন্থিত ষ্টেৰয়ড হৰমোন উৎপন্ন কৰে।",
    },
    analogy: {
      en: "The Lipid Factory / Detox Center.",
      as: "লিপিড কাৰখানা / নিৰ্বিষকৰণ কেন্দ্ৰ।",
    },
  },
  golgi: {
    id: "golgi", color: "#f97316",
    name: { en: "Golgi Apparatus", as: "গলগি যন্ত্ৰ" },
    description: {
      en: "A stack of 4-8 flattened, membrane-bound cisternae (sacs). Has a cis face (receiving) near the ER and a trans face (shipping) near the membrane.",
      as: "৪-৮টা চেপেটা, আৱৰণযুক্ত সিষ্টাৰনিৰ গোট। ER-ৰ ওচৰত cis মুখ (গ্ৰহণ) আৰু আৱৰণৰ ওচৰত trans মুখ (প্ৰেৰণ)।",
    },
    function: {
      en: "Modifies, sorts, and packages proteins and lipids into vesicles for secretion or internal use. Produces lysosomes.",
      as: "প্ৰটিন আৰু লিপিড সংশোধন, বাচনি আৰু প্ৰেৰণ বা অভ্যন্তৰীণ ব্যৱহাৰৰ বাবে ভেছিকেলত পেক কৰে। লাইছোজোম উৎপন্ন কৰে।",
    },
    examNotes: {
      en: "Stack of cisternae. Cis face receives from ER, trans face ships. Adds sugar groups (glycosylation). Forms lysosomes and secretory vesicles.",
      as: "সিষ্টাৰনিৰ গোট। cis মুখে ER-ৰ পৰা গ্ৰহণ কৰে, trans মুখে প্ৰেৰণ কৰে। শৰ্কৰা গোট যোগ কৰে (গ্লাইক'ছাইলেচন)। লাইছোজোম আৰু ক্ষৰণ ভেছিকেল গঠন কৰে।",
    },
    analogy: {
      en: "The Post Office / Shipping & Packaging Center.",
      as: "ডাকঘৰ / প্ৰেৰণ আৰু পেকিং কেন্দ্ৰ।",
    },
  },
  lysosome: {
    id: "lysosome", color: "#9333ea",
    name: { en: "Lysosome", as: "লাইছোজোম" },
    description: {
      en: "Small, spherical, single-membrane vesicles containing ~50 types of hydrolytic (digestive) enzymes that work at acidic pH (~4.5).",
      as: "সৰু, গোলাকাৰ, এক-আৱৰণযুক্ত ভেছিকেল য'ত অম্লীয় pH (~৪.৫) ত কাম কৰা ~৫০ প্ৰকাৰৰ পাচক এনজাইম থাকে।",
    },
    function: {
      en: "Digests worn-out organelles (autophagy), food particles, and invading bacteria. Involved in apoptosis (programmed cell death).",
      as: "পুৰণা কোষাঙ্গ (অটোফেজি), খাদ্যকণা আৰু আক্ৰমণকাৰী বেক্টেৰিয়া পচন কৰে। এপ'প্ট'ছিছ (নিয়ন্ত্ৰিত কোষ মৃত্যু)-ত জড়িত।",
    },
    examNotes: {
      en: "Called 'SUICIDE BAGS' — if ruptured, enzymes digest the cell (autolysis). pH maintained at ~4.5 by proton pumps. Formed by Golgi apparatus.",
      as: "'আত্মহত্যা থলি' কোৱা হয় — ফাটিলে এনজাইমে কোষ পচায় (অটোলাইছিছ)। প্ৰটন পাম্পেৰে pH ~৪.৫ ত ৰখা হয়। গলগি যন্ত্ৰে গঠন কৰে।",
    },
    analogy: {
      en: "The Recycling Center / Waste Disposal.",
      as: "ৰিচাইক্লিং কেন্দ্ৰ / বৰ্জ্য নিষ্কাষণ।",
    },
  },
  centriole: {
    id: "centrosome", color: "#1e3a8a",
    name: { en: "Centrosome", as: "তাৰকা-কেন্দ্ৰ" },
    description: {
      en: "An organelle near the nucleus of a cell that contains the centrioles (in animal cells) and from which the spindle fibers develop in cell division.",
      as: "কোষৰ কেন্দ্ৰকৰ ওচৰৰ এক কোষাঙ্গ য'ত চেণ্ট্ৰিয়ল থাকে (প্ৰাণী কোষত) আৰু ক'ৰ পৰা কোষ বিভাজনৰ সময়ত স্পিণ্ডল ফাইবাৰ গঠন হয়।",
    },
    function: {
      en: "Organizes the mitotic spindle during cell division. Forms the basal body for cilia and flagella.",
      as: "কোষ বিভাজনৰ সময়ত মাইট'টিক স্পিণ্ডল সংগঠিত কৰে। চিলিয়া আৰু ফ্লাজেলাৰ বাবে বেচাল বডি গঠন কৰে।",
    },
    examNotes: {
      en: "Contains 9+0 arrangement of microtubule triplets. Found ONLY in animal cells — ABSENT in most plant cells.",
      as: "মাইক্ৰোটিউবিউল ট্ৰিপ্লেটৰ ৯+০ বিন্যাস থাকে। কেৱল প্ৰাণী কোষত পোৱা যায় — বেছিভাগ উদ্ভিদ কোষত অনুপস্থিত।",
    },
    analogy: {
      en: "The Scaffolding / Construction Manager.",
      as: "স্কেফোল্ডিং / নিৰ্মাণ পৰিচালক।",
    },
  },
  ribosome: {
    id: "ribosome", color: "#111827",
    name: { en: "Ribosomes", as: "ৰাইবোজোম" },
    description: {
      en: "Smallest, non-membrane bound organelles made of rRNA and proteins.",
      as: "rRNA আৰু প্ৰটিনেৰে গঠিত সৰ্বাধিক সৰু, আৱৰণ-বিহীন কোষাঙ্গ।",
    },
    function: {
      en: "Site of protein synthesis (translation).",
      as: "প্ৰটিন সংশ্লেষণৰ (অনুবাদৰ) স্থান।",
    },
    examNotes: {
      en: "Exist as 80S in eukaryotes (cytoplasm/RER). Composed of large and small subunits.",
      as: "ইউক্যাৰিয়টত 80S হিচাপে থাকে (সাইটোপ্লাজম/RER)। ডাঙৰ আৰু সৰু উপ-অংশেৰে গঠিত।",
    },
    analogy: {
      en: "The Protein-Making Machines.",
      as: "প্ৰটিন-তৈয়াৰী যন্ত্ৰ।",
    },
  },
  vacuole: {
    id: "vacuole", color: "#22c55e",
    name: { en: "Vacuole", as: "ৰিক্তিকা" },
    description: {
      en: "Small, temporary, membrane-bound sacs in animal cells. Much smaller and more numerous than in plant cells.",
      as: "প্ৰাণী কোষত সৰু, অস্থায়ী, আৱৰণযুক্ত থলি। উদ্ভিদ কোষৰ তুলনাত বহু সৰু আৰু বহু সংখ্যাত থাকে।",
    },
    function: {
      en: "Stores nutrients, water, and waste products. Assists in endocytosis and exocytosis.",
      as: "পুষ্টি, পানী আৰু বৰ্জ্য পদাৰ্থ সংৰক্ষণ কৰে। এণ্ডোছাইট'ছিছ আৰু এক্সোছাইট'ছিছত সহায় কৰে।",
    },
    examNotes: {
      en: "Animal cells have SMALL, TEMPORARY vacuoles. Plant cells have ONE LARGE permanent central vacuole (tonoplast). Store cell sap.",
      as: "প্ৰাণী কোষত সৰু, অস্থায়ী ৰিক্তিকা থাকে। উদ্ভিদ কোষত এটাই বৃহৎ স্থায়ী কেন্দ্ৰীয় ৰিক্তিকা (টন'প্লাষ্ট) থাকে। কোষৰস ধাৰণ কৰে।",
    },
    analogy: {
      en: "The Storage Closet.",
      as: "সংৰক্ষণ আলমাৰি।",
    },
  },
};

// ── Quiz — bilingual question, options, and answer index ────────────────────
export interface BilingualQuizQ {
  q: BilingualField<string>;
  opts: BilingualField<string[]>;
  ans: number;
}

export const BIOLOGY_QUIZ_DATA: BilingualQuizQ[] = [
  {
    q: {
      en: "Which organelle is known as the 'Powerhouse of the Cell'?",
      as: "কোন কোষাঙ্গক 'কোষৰ শক্তিকেন্দ্ৰ' বুলি কোৱা হয়?",
    },
    opts: {
      en: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Lysosome"],
      as: ["কেন্দ্ৰক", "মাইটকণ্ড্ৰিয়া", "গলগি যন্ত্ৰ", "লাইছোজোম"],
    },
    ans: 1,
  },
  {
    q: {
      en: "What makes the Rough ER 'rough'?",
      as: "অমসৃণ ER-ক 'অমসৃণ' কিহে কৰে?",
    },
    opts: {
      en: ["Lipid molecules", "Friction with cytoplasm", "Ribosomes on its surface", "Digestive enzymes"],
      as: ["লিপিড অণু", "সাইটোপ্লাজমৰ সৈতে ঘৰ্ষণ", "ইয়াৰ পৃষ্ঠত ৰাইবোজোম", "পাচক এনজাইম"],
    },
    ans: 2,
  },
  {
    q: {
      en: "Which organelle is called the 'Suicide Bag'?",
      as: "কোন কোষাঙ্গক 'আত্মহত্যা থলি' বুলি কোৱা হয়?",
    },
    opts: {
      en: ["Lysosome", "Centriole", "Smooth ER", "Nucleolus"],
      as: ["লাইছোজোম", "চেণ্ট্ৰিয়ল", "মসৃণ ER", "কেন্দ্ৰিকা"],
    },
    ans: 0,
  },
  {
    q: {
      en: "Where is DNA primarily stored?",
      as: "DNA প্ৰধানতঃ ক'ত সংৰক্ষিত হৈ থাকে?",
    },
    opts: {
      en: ["Cytoplasm", "Nucleus", "Cell Membrane", "Vacuole"],
      as: ["সাইটোপ্লাজম", "কেন্দ্ৰক", "কোষ পৰ্দা", "ৰিক্তিকা"],
    },
    ans: 1,
  },
  {
    q: {
      en: "Which organelle modifies and packages proteins?",
      as: "কোন কোষাঙ্গই প্ৰটিন সংশোধন আৰু পেক কৰে?",
    },
    opts: {
      en: ["Smooth ER", "Mitochondria", "Golgi Apparatus", "Ribosome"],
      as: ["মসৃণ ER", "মাইটকণ্ড্ৰিয়া", "গলগি যন্ত্ৰ", "ৰাইবোজোম"],
    },
    ans: 2,
  },
  {
    q: {
      en: "Which organelle contains its own DNA?",
      as: "কোন কোষাঙ্গৰ নিজৰ DNA থাকে?",
    },
    opts: {
      en: ["Lysosome", "Golgi", "Mitochondria", "Centriole"],
      as: ["লাইছোজোম", "গলগি", "মাইটকণ্ড্ৰিয়া", "চেণ্ট্ৰিয়ল"],
    },
    ans: 2,
  },
  {
    q: {
      en: "Centrioles are absent in which cell type?",
      as: "চেণ্ট্ৰিয়ল কোন ধৰণৰ কোষত অনুপস্থিত?",
    },
    opts: {
      en: ["Animal cells", "Bacteria", "Most plant cells", "Fungi"],
      as: ["প্ৰাণী কোষ", "বেক্টেৰিয়া", "বেছিভাগ উদ্ভিদ কোষ", "ফাঙ্গাছ"],
    },
    ans: 2,
  },
  {
    q: {
      en: "What is the function of ribosomes?",
      as: "ৰাইবোজোমৰ কাৰ্য কি?",
    },
    opts: {
      en: ["Lipid synthesis", "Protein synthesis", "ATP production", "Detoxification"],
      as: ["লিপিড সংশ্লেষণ", "প্ৰটিন সংশ্লেষণ", "ATP উৎপাদন", "নিৰ্বিষকৰণ"],
    },
    ans: 1,
  },
];
