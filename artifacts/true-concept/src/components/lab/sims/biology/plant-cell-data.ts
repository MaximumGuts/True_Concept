import type { BilingualField } from "@/lib/i18n";

/**
 * Plant cell organelle data — bilingual (English + Assamese).
 * Translation source: NCERT Class IX/X Biology Assamese edition + Vigyan
 * Bharati Assamese science glossary. Re-uses terminology established in
 * animal-cell-data.ts where applicable.
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

export const PLANT_ORGANELLES: Record<string, OrganelleDef> = {
  cellWall: {
    id: "cellWall", color: "#16a34a",
    name: { en: "Cell Wall", as: "কোষ প্ৰাচীৰ" },
    description: {
      en: "A rigid, semi-permeable outer layer made primarily of cellulose, hemicellulose, and pectin.",
      as: "মূলতঃ চেলুলোজ, হেমিচেলুলোজ আৰু পেক্টিনেৰে গঠিত এক কঠিন, অৰ্ধভেদ্য বাহ্যিক স্তৰ।",
    },
    function: {
      en: "Provides structural support, shape, and protection against mechanical stress and osmotic bursting.",
      as: "গাঠনিক সমৰ্থন, আকৃতি প্ৰদান কৰে আৰু যান্ত্ৰিক চাপ তথা অভিস্ৰৱণ-জনিত বিদাৰণৰ পৰা সুৰক্ষা দিয়ে।",
    },
    examNotes: {
      en: "Unique to plant cells (and fungi/bacteria, but made of different materials). Fully permeable compared to the selectively permeable cell membrane.",
      as: "কেৱল উদ্ভিদ কোষত পোৱা যায় (ফাঙ্গাছ/বেক্টেৰিয়াতো আছে, কিন্তু বেলেগ পদাৰ্থেৰে গঠিত)। বাছনীয়ভাৱে প্ৰৱেশযোগ্য কোষ পৰ্দাৰ বিপৰীতে সম্পূৰ্ণৰূপে প্ৰৱেশযোগ্য।",
    },
    analogy: {
      en: "The Brick Wall / Exoskeleton.",
      as: "ইটাৰ দেৱাল / বাহিৰৰ কঙ্কাল।",
    },
  },
  membrane: {
    id: "membrane", color: "#4ade80",
    name: { en: "Cell Membrane", as: "কোষ পৰ্দা" },
    description: {
      en: "A thin, flexible bilayer of phospholipids pressed firmly against the inside of the cell wall.",
      as: "ফছফোলিপিডৰ এক পাতল, নমনীয় দ্বিস্তৰীয় আৱৰণ যি কোষ প্ৰাচীৰৰ ভিতৰৰ অংশৰ লগত শক্তভাৱে লাগি থাকে।",
    },
    function: {
      en: "Controls entry and exit of substances. Selectively permeable.",
      as: "পদাৰ্থৰ প্ৰৱেশ আৰু নিৰ্গমন নিয়ন্ত্ৰণ কৰে। বাছনীয়ভাৱে প্ৰৱেশযোগ্য।",
    },
    examNotes: {
      en: "Fluid Mosaic Model. In plant cells, it is pushed against the cell wall by turgor pressure from the central vacuole.",
      as: "Fluid Mosaic Model। উদ্ভিদ কোষত কেন্দ্ৰীয় ৰিক্তিকাৰ স্ফীতি চাপৰ ফলত ই কোষ প্ৰাচীৰৰ গাত হেঁচা মাৰি থাকে।",
    },
    analogy: {
      en: "The Security Gate.",
      as: "সুৰক্ষা প্ৰৱেশদ্বাৰ।",
    },
  },
  cytoplasm: {
    id: "cytoplasm", color: "#bbf7d0",
    name: { en: "Cytoplasm", as: "সাইটোপ্লাজম" },
    description: {
      en: "The jelly-like substance enclosed by the cell membrane, containing the cytosol and organelles.",
      as: "কোষ পৰ্দাৰ ভিতৰৰ জেলিৰ দৰে পদাৰ্থ য'ত চাইটোছল আৰু কোষাঙ্গ থাকে।",
    },
    function: {
      en: "Provides a medium for organelles and site for many metabolic pathways like glycolysis.",
      as: "কোষাঙ্গৰ বাবে মাধ্যম প্ৰদান কৰে আৰু গ্লাইক'লাইছিছৰ দৰে বহু বিপাকীয় পথৰ স্থান।",
    },
    examNotes: {
      en: "In plant cells, the cytoplasm is often pushed to the periphery by the large central vacuole.",
      as: "উদ্ভিদ কোষত বৃহৎ কেন্দ্ৰীয় ৰিক্তিকাই সাইটোপ্লাজমক প্ৰায়ে কোষৰ প্ৰান্তলৈ ঠেলি পঠিয়ায়।",
    },
    analogy: {
      en: "The Jello / Fluid Medium.",
      as: "জেলি / তৰল মাধ্যম।",
    },
  },
  vacuole: {
    id: "vacuole", color: "#7dd3fc",
    name: { en: "Central Vacuole", as: "কেন্দ্ৰীয় ৰিক্তিকা" },
    description: {
      en: "A massive, membrane-bound sac that can take up 30% to 90% of the cell's volume. Its membrane is called the tonoplast.",
      as: "এক বৃহৎ, আৱৰণযুক্ত থলি যিয়ে কোষৰ আয়তনৰ ৩০% ৰ পৰা ৯০% পৰ্যন্ত দখল কৰিব পাৰে। ইয়াৰ আৱৰণক টন'প্লাষ্ট বুলি কোৱা হয়।",
    },
    function: {
      en: "Stores water, nutrients, and waste. Maintains turgor pressure to keep the plant upright.",
      as: "পানী, পুষ্টি আৰু বৰ্জ্য সংৰক্ষণ কৰে। গছজোপাক সোঁচা কৰি ৰখাৰ বাবে স্ফীতি চাপ বজাই ৰাখে।",
    },
    examNotes: {
      en: "The tonoplast is the membrane surrounding the vacuole. Turgor pressure is crucial for plant structure; without it, the plant wilts.",
      as: "টন'প্লাষ্ট হৈছে ৰিক্তিকাৰ চাৰিওফালে থকা আৱৰণ। গছৰ গঠনৰ বাবে স্ফীতি চাপ অতি গুৰুত্বপূৰ্ণ; ই নাথাকিলে গছজোপা শুকাই যায়।",
    },
    analogy: {
      en: "The Water Tower / Storage Tank.",
      as: "পানীৰ টেংকি / সংৰক্ষণ ভঁৰাল।",
    },
  },
  chloroplast: {
    id: "chloroplast", color: "#22c55e",
    name: { en: "Chloroplast", as: "হৰিতকণা" },
    description: {
      en: "A plastid containing the green pigment chlorophyll. Has an inner and outer membrane, and internal stacks of thylakoids called grana.",
      as: "পৰ্ণসেউজ (ক্লোৰোফিল) ধাৰণ কৰা এক প্লাষ্টিড। ইয়াৰ ভিতৰ আৰু বাহিৰ দুয়োটা আৱৰণ আছে, আৰু ভিতৰত গ্ৰানা নামৰ থাইলকইডৰ গোট আছে।",
    },
    function: {
      en: "Site of photosynthesis; converts solar energy into chemical energy (glucose).",
      as: "সালোকসংশ্লেষণৰ স্থান; সৌৰ শক্তিক ৰাসায়নিক শক্তি (গ্লুকোজ)-লৈ ৰূপান্তৰ কৰে।",
    },
    examNotes: {
      en: "Contains its own circular DNA and 70S ribosomes (like mitochondria). Light-dependent reactions occur in the thylakoids; light-independent (Calvin cycle) in the stroma.",
      as: "নিজৰ বৃত্তাকাৰ DNA আৰু 70S ৰাইবোজোম থাকে (মাইটকণ্ড্ৰিয়াৰ দৰে)। পোহৰ-নিৰ্ভৰ বিক্ৰিয়া থাইলকইডত হয়; পোহৰ-নিৰপেক্ষ (কেলভিন চক্ৰ) ষ্ট্ৰমাত হয়।",
    },
    analogy: {
      en: "The Solar Panels / Sugar Factory.",
      as: "সৌৰ পেনেল / চেনিৰ কাৰখানা।",
    },
  },
  nucleus: {
    id: "nucleus", color: "#fb923c",
    name: { en: "Nucleus", as: "কেন্দ্ৰক" },
    description: {
      en: "A double-membrane bound organelle housing the plant's genetic material (chromatin).",
      as: "এক দ্বিস্তৰীয় আৱৰণযুক্ত কোষাঙ্গ য'ত উদ্ভিদৰ জিনগত উপাদান (ক্ৰোমাটিন) থাকে।",
    },
    function: {
      en: "Controls gene expression and mediates the replication of DNA.",
      as: "জিন প্ৰকাশ নিয়ন্ত্ৰণ কৰে আৰু DNA-ৰ প্ৰতিৰূপণ পৰিচালনা কৰে।",
    },
    examNotes: {
      en: "Pushed to the side of the cell by the large central vacuole in mature plant cells.",
      as: "প্ৰাপ্তবয়স্ক উদ্ভিদ কোষত বৃহৎ কেন্দ্ৰীয় ৰিক্তিকাই কেন্দ্ৰকক কোষৰ এটা ফালে ঠেলি ৰাখে।",
    },
    analogy: {
      en: "The Command Center.",
      as: "কমাণ্ড কেন্দ্ৰ।",
    },
  },
  nucleolus: {
    id: "nucleolus", color: "#ea580c",
    name: { en: "Nucleolus", as: "কেন্দ্ৰিকা" },
    description: {
      en: "A dense, dark-staining body inside the nucleus.",
      as: "কেন্দ্ৰকৰ ভিতৰৰ এক ঘনত্বপূৰ্ণ, গাঢ় ৰঙৰ গঠন।",
    },
    function: {
      en: "Produces ribosomal RNA (rRNA) and assembles ribosome subunits.",
      as: "ৰাইবোজোমাল RNA (rRNA) উৎপন্ন কৰে আৰু ৰাইবোজোমৰ উপ-অংশ একত্ৰিত কৰে।",
    },
    examNotes: {
      en: "Not membrane-bound. Disappears during cell division.",
      as: "আৱৰণযুক্ত নহয়। কোষ বিভাজনৰ সময়ত অদৃশ্য হয়।",
    },
    analogy: {
      en: "The Ribosome Factory.",
      as: "ৰাইবোজোম কাৰখানা।",
    },
  },
  chromatin: {
    id: "chromatin", color: "#d8b4fe",
    name: { en: "Chromatin (DNA)", as: "ক্ৰোমাটিন (DNA)" },
    description: {
      en: "A mass of genetic material composed of DNA and proteins.",
      as: "DNA আৰু প্ৰটিনেৰে গঠিত জিনগত উপাদানৰ গোট।",
    },
    function: {
      en: "Packages DNA into a small volume and protects the genetic sequence.",
      as: "DNA-ক সৰু আয়তনত পেক কৰে আৰু জিনগত ক্ৰম সুৰক্ষিত ৰাখে।",
    },
    examNotes: {
      en: "Condenses into chromosomes during cell division. Contains the genes.",
      as: "কোষ বিভাজনৰ সময়ত ঘনীভূত হৈ ক্ৰোমোজোম গঠন কৰে। জিন থাকে।",
    },
    analogy: {
      en: "The Blueprint / Instruction Manual.",
      as: "ব্লুপ্ৰিণ্ট / নিৰ্দেশনা পুথি।",
    },
  },
  mitochondria: {
    id: "mitochondria", color: "#f97316",
    name: { en: "Mitochondria", as: "মাইটকণ্ড্ৰিয়া" },
    description: {
      en: "Bean-shaped organelles with a folded inner membrane (cristae).",
      as: "ভাঁজ খোৱা ভিতৰৰ আৱৰণ (ক্ৰিষ্টা) থকা শিম-আকৃতিৰ কোষাঙ্গ।",
    },
    function: {
      en: "Produces ATP through aerobic respiration. Yes, plants have mitochondria too!",
      as: "এৰোবিক শ্বসনৰ যোগেদি ATP উৎপন্ন কৰে। হয়, উদ্ভিদৰো মাইটকণ্ড্ৰিয়া আছে!",
    },
    examNotes: {
      en: "Students often forget plants have mitochondria. They need them to break down the glucose produced by chloroplasts.",
      as: "শিক্ষাৰ্থীয়ে প্ৰায়ে পাহৰি যায় যে উদ্ভিদৰো মাইটকণ্ড্ৰিয়া আছে। হৰিতকণাই উৎপন্ন কৰা গ্লুকোজ ভাঙিবলৈ ইয়াৰ প্ৰয়োজন।",
    },
    analogy: {
      en: "The Power Plant.",
      as: "বিদ্যুৎকেন্দ্ৰ।",
    },
  },
  roughER: {
    id: "roughER", color: "#a855f7",
    name: { en: "Rough Endoplasmic Reticulum", as: "অমসৃণ এণ্ডোপ্লাজমিক ৰেটিকুলাম" },
    description: {
      en: "Membrane network studded with ribosomes, continuous with the nuclear envelope.",
      as: "ৰাইবোজোমযুক্ত আৱৰণৰ জাল, কেন্দ্ৰক আৱৰণৰ সৈতে সংযুক্ত।",
    },
    function: {
      en: "Synthesizes and modifies proteins destined for secretion or the cell membrane.",
      as: "ক্ষৰণ বা কোষ পৰ্দাৰ বাবে নিৰ্ধাৰিত প্ৰটিন সংশ্লেষণ আৰু সংশোধন কৰে।",
    },
    examNotes: {
      en: "Highly active in cells that produce a lot of proteins.",
      as: "বহু প্ৰটিন উৎপন্ন কৰা কোষত অতিশয় সক্ৰিয়।",
    },
    analogy: {
      en: "The Protein Factory.",
      as: "প্ৰটিন কাৰখানা।",
    },
  },
  smoothER: {
    id: "smoothER", color: "#60a5fa",
    name: { en: "Smooth Endoplasmic Reticulum", as: "মসৃণ এণ্ডোপ্লাজমিক ৰেটিকুলাম" },
    description: {
      en: "Tubular membrane network without ribosomes.",
      as: "ৰাইবোজোম-বিহীন নলাকাৰ আৱৰণ-জাল।",
    },
    function: {
      en: "Synthesizes lipids and helps in the detoxification of chemicals.",
      as: "লিপিড সংশ্লেষণ কৰে আৰু ৰাসায়নিক পদাৰ্থৰ নিৰ্বিষকৰণত সহায় কৰে।",
    },
    examNotes: {
      en: "Also plays a role in the synthesis of plant hormones.",
      as: "উদ্ভিদ হৰমোন সংশ্লেষণতো ভূমিকা পালন কৰে।",
    },
    analogy: {
      en: "The Lipid Lab.",
      as: "লিপিড পৰীক্ষাগাৰ।",
    },
  },
  golgi: {
    id: "golgi", color: "#3b82f6",
    name: { en: "Golgi Apparatus (Dictyosomes)", as: "গলগি যন্ত্ৰ (ডিকটিয়োজম)" },
    description: {
      en: "A series of distinct, separate flattened membrane sacs. In plants, these are often called dictyosomes.",
      as: "পৃথক, চেপেটা আৱৰণ-থলিৰ এক শৃঙ্খলা। উদ্ভিদত ইহঁতক প্ৰায়ে ডিকটিয়োজম বুলি কোৱা হয়।",
    },
    function: {
      en: "Modifies proteins and synthesizes complex polysaccharides for the cell wall (like pectin).",
      as: "প্ৰটিন সংশোধন কৰে আৰু কোষ প্ৰাচীৰৰ বাবে জটিল পলিচেকেৰাইড (যেনে পেক্টিন) সংশ্লেষণ কৰে।",
    },
    examNotes: {
      en: "In plant cells, Golgi stacks are smaller and more scattered, specifically termed 'dictyosomes'. Crucial for cell plate formation during division.",
      as: "উদ্ভিদ কোষত গলগি গোটবোৰ সৰু আৰু বিচ্ছিন্ন, যিবোৰক বিশেষকৈ 'ডিকটিয়োজম' কোৱা হয়। বিভাজনৰ সময়ত কোষ পাত গঠনৰ বাবে অপৰিহাৰ্য।",
    },
    analogy: {
      en: "The Shipping & Packaging Center.",
      as: "প্ৰেৰণ আৰু পেকিং কেন্দ্ৰ।",
    },
  },
  amyloplast: {
    id: "amyloplast", color: "#d946ef",
    name: { en: "Amyloplast", as: "এমাইলোপ্লাষ্ট" },
    description: {
      en: "Non-pigmented organelles (leucoplasts) specialized for the synthesis and storage of starch granules.",
      as: "ৰঞ্জক-বিহীন কোষাঙ্গ (লিউক'প্লাষ্ট) যিবোৰ মাণ্ড (ষ্টাৰ্চ) কণিকা সংশ্লেষণ আৰু সংৰক্ষণৰ বাবে বিশেষীকৃত।",
    },
    function: {
      en: "Converts glucose into starch for long-term energy storage.",
      as: "দীৰ্ঘকালীন শক্তি সংৰক্ষণৰ বাবে গ্লুকোজক মাণ্ডলৈ ৰূপান্তৰ কৰে।",
    },
    examNotes: {
      en: "Abundant in roots (like potatoes) and seeds. They can also sense gravity (statoliths) to help roots grow downwards.",
      as: "শিপা (যেনে আলু) আৰু গুটিত প্ৰচুৰ পৰিমাণে থাকে। ইহঁতে অভিকৰ্ষৰো অনুভূতি (ষ্টেট'লিথ) ৰাখে আৰু শিপাক তললৈ বঢ়াত সহায় কৰে।",
    },
    analogy: {
      en: "The Starch Pantry.",
      as: "মাণ্ডৰ ভঁৰাল।",
    },
  },
  peroxisome: {
    id: "peroxisome", color: "#facc15",
    name: { en: "Peroxisome", as: "পেৰক্সিজম" },
    description: {
      en: "Small, single-membrane bound organelles containing oxidative enzymes.",
      as: "অক্সিডেটিভ এনজাইম থকা সৰু, এক-আৱৰণযুক্ত কোষাঙ্গ।",
    },
    function: {
      en: "Breaks down fatty acids and toxic hydrogen peroxide (H₂O₂) into water and oxygen.",
      as: "চৰ্বী এচিড আৰু বিষাক্ত হাইড্ৰজেন পেৰক্সাইড (H₂O₂)-ক পানী আৰু অক্সিজেনলৈ ভাঙি দিয়ে।",
    },
    examNotes: {
      en: "In plants, specialized peroxisomes (glyoxysomes) convert stored fats into sugars during seed germination. Also involved in photorespiration.",
      as: "উদ্ভিদত বিশেষীকৃত পেৰক্সিজম (গ্লাইক্সিজম)-এ গুটি অংকুৰণৰ সময়ত সংৰক্ষিত চৰ্বীক চেনিলৈ ৰূপান্তৰ কৰে। সালোক-শ্বসনতো জড়িত।",
    },
    analogy: {
      en: "The Hazmat / Detox Unit.",
      as: "বিপজ্জনক বৰ্জ্য / নিৰ্বিষকৰণ ইউনিট।",
    },
  },
  ribosome: {
    id: "ribosome", color: "#1e293b",
    name: { en: "Ribosomes", as: "ৰাইবোজোম" },
    description: {
      en: "Tiny granules made of rRNA and proteins, found free or attached to the rough ER.",
      as: "rRNA আৰু প্ৰটিনেৰে গঠিত অতি সৰু কণিকা, মুক্ত অৱস্থাত বা অমসৃণ ER-ৰ সৈতে যুক্ত হৈ থাকে।",
    },
    function: {
      en: "Site of protein synthesis (translation).",
      as: "প্ৰটিন সংশ্লেষণৰ (অনুবাদৰ) স্থান।",
    },
    examNotes: {
      en: "80S in the cytoplasm/rough ER. 70S inside chloroplasts and mitochondria.",
      as: "সাইটোপ্লাজম/অমসৃণ ER-ত 80S। হৰিতকণা আৰু মাইটকণ্ড্ৰিয়াৰ ভিতৰত 70S।",
    },
    analogy: {
      en: "The Protein-Making Machines.",
      as: "প্ৰটিন-তৈয়াৰী যন্ত্ৰ।",
    },
  },
};

// ── Quiz — bilingual question, options, and answer index ────────────────────
export interface BilingualQuizQ {
  q: BilingualField<string>;
  opts: BilingualField<string[]>;
  ans: number;
}

export const PLANT_QUIZ_DATA: BilingualQuizQ[] = [
  {
    q: {
      en: "Which organelle is found in plant cells but NOT in animal cells?",
      as: "উদ্ভিদ কোষত পোৱা যায় কিন্তু প্ৰাণী কোষত নাথাকে এনে কোষাঙ্গ কোনটো?",
    },
    opts: {
      en: ["Mitochondria", "Cell Membrane", "Chloroplast", "Nucleus"],
      as: ["মাইটকণ্ড্ৰিয়া", "কোষ পৰ্দা", "হৰিতকণা", "কেন্দ্ৰক"],
    },
    ans: 2,
  },
  {
    q: {
      en: "What is the primary function of the large central vacuole?",
      as: "বৃহৎ কেন্দ্ৰীয় ৰিক্তিকাৰ প্ৰধান কাৰ্য কি?",
    },
    opts: {
      en: ["Protein synthesis", "Maintaining turgor pressure", "Producing ATP", "Cell division"],
      as: ["প্ৰটিন সংশ্লেষণ", "স্ফীতি চাপ বজাই ৰখা", "ATP উৎপাদন", "কোষ বিভাজন"],
    },
    ans: 1,
  },
  {
    q: {
      en: "The plant cell wall is primarily composed of what substance?",
      as: "উদ্ভিদ কোষৰ কোষ প্ৰাচীৰ মূলতঃ কি পদাৰ্থেৰে গঠিত?",
    },
    opts: {
      en: ["Cellulose", "Peptidoglycan", "Chitin", "Phospholipids"],
      as: ["চেলুলোজ", "পেপ্‌টাইডোগ্লাইকেন", "কাইটিন", "ফছফোলিপিড"],
    },
    ans: 0,
  },
  {
    q: {
      en: "Which of the following is true about plant cell mitochondria?",
      as: "উদ্ভিদ কোষৰ মাইটকণ্ড্ৰিয়াৰ বিষয়ে কোনটো সত্য?",
    },
    opts: {
      en: ["Plant cells do not have them", "They perform photosynthesis", "They produce ATP for the cell", "They are green in color"],
      as: ["উদ্ভিদ কোষত নাথাকে", "ইহঁতে সালোকসংশ্লেষণ কৰে", "কোষৰ বাবে ATP উৎপন্ন কৰে", "ইহঁত সেউজীয়া বৰণৰ"],
    },
    ans: 2,
  },
  {
    q: {
      en: "What is the name of the membrane that surrounds the central vacuole?",
      as: "কেন্দ্ৰীয় ৰিক্তিকাৰ চাৰিওফালে থকা আৱৰণৰ নাম কি?",
    },
    opts: {
      en: ["Nuclear envelope", "Plasma membrane", "Tonoplast", "Thylakoid"],
      as: ["কেন্দ্ৰক আৱৰণ", "প্লাজমা পৰ্দা", "টন'প্লাষ্ট", "থাইলকইড"],
    },
    ans: 2,
  },
  {
    q: {
      en: "Where does the light-dependent reaction of photosynthesis occur?",
      as: "সালোকসংশ্লেষণৰ পোহৰ-নিৰ্ভৰ বিক্ৰিয়া ক'ত হয়?",
    },
    opts: {
      en: ["Stroma", "Thylakoids (Granum)", "Mitochondrial cristae", "Cytoplasm"],
      as: ["ষ্ট্ৰমা", "থাইলকইড (গ্ৰানা)", "মাইটকণ্ড্ৰিয়াৰ ক্ৰিষ্টা", "সাইটোপ্লাজম"],
    },
    ans: 1,
  },
  {
    q: {
      en: "In plant cells, Golgi bodies are often scattered and referred to as:",
      as: "উদ্ভিদ কোষত গলগি বডিবোৰ প্ৰায়ে বিচ্ছিন্ন হৈ থাকে আৰু ইহঁতক কি বুলি কোৱা হয়?",
    },
    opts: {
      en: ["Dictyosomes", "Lysosomes", "Plastids", "Centrosomes"],
      as: ["ডিকটিয়োজম", "লাইছোজোম", "প্লাষ্টিড", "তাৰকা-কেন্দ্ৰ"],
    },
    ans: 0,
  },
  {
    q: {
      en: "Why do plant cells usually lack lysosomes?",
      as: "উদ্ভিদ কোষত সাধাৰণতে লাইছোজোম কিয় নাথাকে?",
    },
    opts: {
      en: ["They don't produce waste", "The central vacuole handles degradation", "They have a cell wall", "They don't eat food"],
      as: ["ইহঁতে বৰ্জ্য উৎপন্ন নকৰে", "কেন্দ্ৰীয় ৰিক্তিকাই পচন কাৰ্য চলায়", "ইহঁতৰ কোষ প্ৰাচীৰ আছে", "ইহঁতে খাদ্য নাখায়"],
    },
    ans: 1,
  },
];
