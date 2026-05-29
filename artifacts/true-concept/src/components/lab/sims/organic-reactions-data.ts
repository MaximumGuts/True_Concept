export interface BilingualField<T> { en: T; as: T; }

export interface OrganicExperimentDef {
  id: number;
  name: BilingualField<string>;
  category: BilingualField<string>;
  reactants: string[];
  catalyst: string;
  equation: string;
  desc: BilingualField<string>;
  observations: BilingualField<string>;
  examNotes: BilingualField<string>;
  applications: string;
  intensity: number;
  hazards: BilingualField<string[]>;
  visuals: {
    reactionType: "ESTERIFICATION" | "SAPONIFICATION" | "SCUM_FORMATION" | "HYDROGENATION";
    liquidColor1: string;
    liquidColor2: string;
    productColor: string;
    environment: "heated_fume_hood" | "stirred_beaker" | "catalyst_chamber";
  };
  quiz: { q: BilingualField<string>; opts: BilingualField<string[]>; ans: number }[];
}

export const ORGANIC_EXPERIMENTS: OrganicExperimentDef[] = [
  {
    id: 1,
    name: { en: "Esterification Reaction", as: "ইষ্টাৰিফিকেচন বিক্ৰিয়া" },
    category: { en: "SYNTHESIS", as: "সংশ্লেষণ" },
    reactants: ["CH₃COOH (Ethanoic Acid)", "C₂H₅OH (Ethanol)"],
    catalyst: "Conc. H₂SO₄",
    equation: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O",
    desc: { en: "Ethanoic acid reacts with ethanol in the presence of concentrated sulphuric acid as a catalyst to form a sweet-smelling ester (ethyl ethanoate) and water. The reaction is slow and reversible.", as: "ঘন ছালফিউৰিক এচিড উদ্দীপক হিচাপে থকাত ইথান'ইক এচিডে ইথান'লৰ সৈতে বিক্ৰিয়া কৰি মধুৰ গন্ধযুক্ত ইষ্টাৰ (ইথাইল ইথান'ৱেট) আৰু পানী গঠন কৰে। বিক্ৰিয়া লেহেমীয়া আৰু বিপৰীতমুখী।" },
    observations: { en: "Upon gentle heating in a water bath, the mixture becomes homogenous, and a distinct sweet, fruity smell is observed indicating ester formation. A separate oily layer may form if poured into sodium carbonate solution.", as: "পানীৰ বাথত লাহে লাহে গৰম কৰিলে মিশ্ৰণ সমসত্ত্ব হয়, আৰু ইষ্টাৰ গঠনৰ সংকেত দিয়া স্পষ্ট মধুৰ, ফলৰ গন্ধ পৰিলক্ষিত হয়। ছ'ডিয়াম কাৰ্বনেট দ্ৰৱণত ঢালিলে পৃথক তৈলাক্ত স্তৰ গঠিত হ'ব পাৰে।" },
    examNotes: { en: "Concentrated H₂SO₄ acts as both a catalyst and a dehydrating agent. It removes water to drive the equilibrium forward (Le Chatelier's principle).", as: "ঘন H₂SO₄ উদ্দীপক আৰু নিৰ্জলকাৰক উভয় হিচাপে কাম কৰে। ই সাম্যাৱস্থা আগলৈ নিবলৈ পানী আঁতৰায় (লে চেটেলিয়াৰৰ নীতি)।" },
    applications: "Esters are widely used in artificial flavors, perfumes, and as industrial solvents.",
    intensity: 6,
    hazards: { en: ["Corrosive Acid", "Flammable Alcohol", "Toxic Vapors"], as: ["ক্ষয়কাৰক অম্ল", "জ্বলনযোগ্য এলক'হল", "বিষাক্ত বাষ্প"] },
    visuals: { reactionType: "ESTERIFICATION", liquidColor1: "rgba(255, 255, 255, 0.2)", liquidColor2: "rgba(200, 230, 255, 0.3)", productColor: "rgba(255, 240, 200, 0.8)", environment: "heated_fume_hood" },
    quiz: [
      { q: { en: "What is the primary role of concentrated H₂SO₄ in esterification?", as: "ইষ্টাৰিফিকেচনত ঘন H₂SO₄-ৰ মূল ভূমিকা কি?" }, opts: { en: ["It acts as a reducing agent", "It acts as a catalyst and dehydrating agent", "It neutralizes the ethanoic acid", "It provides heat for the reaction"], as: ["ই বিজাৰক হিচাপে কাম কৰে", "ই উদ্দীপক আৰু নিৰ্জলকাৰক হিচাপে কাম কৰে", "ই ইথান'ইক এচিড নিৰপেক্ষ কৰে", "ই বিক্ৰিয়াৰ বাবে উষ্ণতা যোগান দিয়ে"] }, ans: 1 },
      { q: { en: "Which organic compound is formed in this reaction?", as: "এই বিক্ৰিয়াত কোন জৈৱ যৌগ গঠিত হয়?" }, opts: { en: ["Ethyl ethanoate", "Methyl ethanoate", "Ethanoic anhydride", "Diethyl ether"], as: ["ইথাইল ইথান'ৱেট", "মিথাইল ইথান'ৱেট", "ইথান'ইক এনহাইড্ৰাইড", "ডাইইথাইল ইথাৰ"] }, ans: 0 },
      { q: { en: "What is the characteristic physical property of the product?", as: "উৎপাদৰ বৈশিষ্ট্যমূলক ভৌতিক ধৰ্ম কি?" }, opts: { en: ["Pungent smell", "Choking gas", "Sweet, fruity smell", "Solid white precipitate"], as: ["তীব্ৰ গন্ধ", "দমবন্ধকাৰী গেছ", "মধুৰ, ফলৰ গন্ধ", "বগা কঠিন অৱক্ষেপ"] }, ans: 2 }
    ]
  },
  {
    id: 2,
    name: { en: "Saponification Reaction", as: "চাবোনীকৰণ বিক্ৰিয়া" },
    category: { en: "HYDROLYSIS", as: "জলবিভাজন" },
    reactants: ["CH₃COOC₂H₅ (Ester)", "NaOH (Alkali)"],
    catalyst: "Heat",
    equation: "CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH",
    desc: { en: "Saponification is the alkaline hydrolysis of an ester. When an ester is heated with an alkali like NaOH, it breaks down to yield the sodium salt of the carboxylic acid (soap) and an alcohol.", as: "চাবোনীকৰণ হ'ল ইষ্টাৰৰ ক্ষাৰকীয় জলবিভাজন। NaOH-ৰ দৰে ক্ষাৰকৰ সৈতে ইষ্টাৰ গৰম কৰিলে ই ভাঙি কাৰ্বক্সিলিক এচিডৰ ছ'ডিয়াম লৱণ (চাবোন) আৰু এলক'হল উৎপন্ন কৰে।" },
    observations: { en: "As the mixture is heated and stirred, the two immiscible layers of ester and aqueous NaOH disappear. The solution becomes viscous and soapy. Adding NaCl precipitates out the solid soap.", as: "মিশ্ৰণ গৰম আৰু নাড়াৰ লগে লগে ইষ্টাৰ আৰু জলীয় NaOH-ৰ দুটা অমিশ্ৰণীয় স্তৰ অদৃশ্য হয়। দ্ৰৱণ চিপচিপীয়া আৰু চাবোনীয়া হয়। NaCl যোগ কৰিলে কঠিন চাবোন অৱক্ষেপিত হয়।" },
    examNotes: { en: "This is the reverse process of esterification. In industry, higher esters (fats/oils) are saponified to make real soap.", as: "এইটো ইষ্টাৰিফিকেচনৰ বিপৰীত প্ৰক্ৰিয়া। শিল্পত প্ৰকৃত চাবোন তৈয়াৰ কৰিবলৈ উচ্চ ইষ্টাৰ (চৰ্বি/তেল) চাবোনীকৰণ কৰা হয়।" },
    applications: "The fundamental chemical process used globally for manufacturing soaps and detergents from animal fats and vegetable oils.",
    intensity: 5,
    hazards: { en: ["Strong Alkali (NaOH)", "Thermal Burns", "Slippery Spills"], as: ["শক্তিশালী ক্ষাৰক (NaOH)", "তাপীয় দাহ", "পিছল ছলকি পড়া"] },
    visuals: { reactionType: "SAPONIFICATION", liquidColor1: "rgba(255, 240, 200, 0.8)", liquidColor2: "rgba(255, 255, 255, 0.1)", productColor: "rgba(240, 245, 255, 0.95)", environment: "stirred_beaker" },
    quiz: [
      { q: { en: "Saponification is best described as:", as: "চাবোনীকৰণৰ সৰ্বোত্তম বৰ্ণনা হ'ল:" }, opts: { en: ["Acidic hydrolysis of an ester", "Alkaline hydrolysis of an ester", "Dehydration of an alcohol", "Oxidation of a carboxylic acid"], as: ["ইষ্টাৰৰ অম্লীয় জলবিভাজন", "ইষ্টাৰৰ ক্ষাৰকীয় জলবিভাজন", "এলক'হলৰ নিৰ্জলীকৰণ", "কাৰ্বক্সিলিক এচিডৰ জাৰণ"] }, ans: 1 },
      { q: { en: "What are the final products of this specific reaction?", as: "এই বিশেষ বিক্ৰিয়াৰ অন্তিম উৎপাদ কি?" }, opts: { en: ["Sodium ethanoate and water", "Sodium ethanoate and ethanol", "Ethanoic acid and ethanol", "Sodium hydroxide and ethanol"], as: ["ছ'ডিয়াম ইথান'ৱেট আৰু পানী", "ছ'ডিয়াম ইথান'ৱেট আৰু ইথান'ল", "ইথান'ইক এচিড আৰু ইথান'ল", "ছ'ডিয়াম হাইড্ৰ'ক্সাইড আৰু ইথান'ল"] }, ans: 1 },
      { q: { en: "Why is sodium chloride (NaCl) often added at the end of saponification?", as: "চাবোনীকৰণৰ শেষত প্ৰায়ে ছ'ডিয়াম ক্ল'ৰাইড (NaCl) কিয় যোগ কৰা হয়?" }, opts: { en: ["To act as a catalyst", "To neutralize the NaOH", "To decrease the solubility of soap and precipitate it", "To add fragrance"], as: ["উদ্দীপক হিচাপে কাম কৰিবলৈ", "NaOH নিৰপেক্ষ কৰিবলৈ", "চাবোনৰ দ্ৰৱণীয়তা হ্ৰাস কৰি অৱক্ষেপিত কৰিবলৈ", "সুগন্ধ যোগ কৰিবলৈ"] }, ans: 2 }
    ]
  },
  {
    id: 3,
    name: { en: "Scum Formation with Soap", as: "চাবোনৰ সৈতে কলুষ গঠন" },
    category: { en: "PRECIPITATION", as: "অৱক্ষেপণ" },
    reactants: ["Soap Solution", "Hard Water (Ca²⁺/Mg²⁺)"],
    catalyst: "None",
    equation: "2RCOONa + Ca²⁺ → (RCOO)₂Ca↓ + 2Na⁺",
    desc: { en: "Hard water contains dissolved calcium and magnesium salts. When soap (sodium salt of a fatty acid) is added to hard water, it reacts with these ions to form an insoluble precipitate called scum.", as: "কঠিন পানীত দ্ৰৱীভূত কেলচিয়াম আৰু মেগনেছিয়াম লৱণ থাকে। কঠিন পানীত চাবোন (চৰ্বিৰ অম্লৰ ছ'ডিয়াম লৱণ) যোগ কৰিলে ই এই আয়নৰ সৈতে বিক্ৰিয়া কৰি কলুষ নামৰ অদ্ৰৱণীয় অৱক্ষেপ গঠন কৰে।" },
    observations: { en: "Instead of lathering, white curdy precipitates (scum) form immediately in the solution. The foam collapses, and the liquid becomes cloudy with floating white particles.", as: "ফেনা হোৱাৰ পৰিৱৰ্তে দ্ৰৱণত তৎক্ষণাৎ বগা দৈ-সদৃশ অৱক্ষেপ (কলুষ) গঠিত হয়। ফেনা ভাঙি যায়, আৰু ভাঁহমান বগা কণাৰ সৈতে তৰল মেঘলা হয়।" },
    examNotes: { en: "This demonstrates why soap is ineffective in hard water. Synthetic detergents are used instead because their calcium/magnesium salts are soluble in water.", as: "এইটো প্ৰদৰ্শন কৰে যে কঠিন পানীত চাবোন অকাৰ্যকৰ কিয়। সিন্থেটিক ডিটাৰজেণ্ট পৰিৱৰ্তে ব্যৱহাৰ হয় কাৰণ সিহঁতৰ কেলচিয়াম/মেগনেছিয়াম লৱণ পানীত দ্ৰৱণীয়।" },
    applications: "Understanding water hardness and formulating modern laundry detergents that resist scum formation.",
    intensity: 2,
    hazards: { en: ["Mild Eye Irritant"], as: ["মৃদু চকু খজুওৱা"] },
    visuals: { reactionType: "SCUM_FORMATION", liquidColor1: "rgba(240, 245, 255, 0.8)", liquidColor2: "rgba(200, 220, 255, 0.2)", productColor: "rgba(230, 235, 240, 1)", environment: "stirred_beaker" },
    quiz: [
      { q: { en: "What ions in hard water are responsible for scum formation?", as: "কঠিন পানীত কোন আয়নে কলুষ গঠনৰ বাবে দায়ী?" }, opts: { en: ["Sodium and Potassium", "Calcium and Magnesium", "Chloride and Sulfate", "Iron and Copper"], as: ["ছ'ডিয়াম আৰু পটেছিয়াম", "কেলচিয়াম আৰু মেগনেছিয়াম", "ক্ল'ৰাইড আৰু ছালফেট", "আয়ৰন আৰু কপাৰ"] }, ans: 1 },
      { q: { en: "What is the chemical nature of the 'scum' formed?", as: "গঠিত 'কলুষ'-ৰ ৰাসায়নিক প্ৰকৃতি কি?" }, opts: { en: ["Soluble sodium salt", "Insoluble calcium/magnesium salt of fatty acid", "Calcium carbonate precipitate", "Unreacted fat/oil"], as: ["দ্ৰৱণীয় ছ'ডিয়াম লৱণ", "চৰ্বিৰ অম্লৰ অদ্ৰৱণীয় কেলচিয়াম/মেগনেছিয়াম লৱণ", "কেলচিয়াম কাৰ্বনেট অৱক্ষেপ", "অবিক্ৰিত চৰ্বি/তেল"] }, ans: 1 },
      { q: { en: "How do synthetic detergents overcome this problem?", as: "সিন্থেটিক ডিটাৰজেণ্টে এই সমস্যা কেনেকৈ অতিক্ৰম কৰে?" }, opts: { en: ["They react with calcium to form soluble salts", "They destroy the calcium ions", "They increase the pH of the water", "They form scum that sinks instead of floats"], as: ["সিহঁতে কেলচিয়ামৰ সৈতে বিক্ৰিয়া কৰি দ্ৰৱণীয় লৱণ গঠন কৰে", "সিহঁতে কেলচিয়াম আয়ন ধ্বংস কৰে", "সিহঁতে পানীৰ pH বৃদ্ধি কৰে", "সিহঁতে ডুবা কলুষ গঠন কৰে"] }, ans: 0 }
    ]
  },
  {
    id: 4,
    name: { en: "Hydrogenation of Oils", as: "তেলৰ হাইড্ৰ'জেনেচন" },
    category: { en: "ADDITION", as: "যোগ" },
    reactants: ["Unsaturated Oil", "H₂ Gas"],
    catalyst: "Nickel (Ni) / 473K",
    equation: "R₂C=CR₂ + H₂ → R₂CH–CHR₂",
    desc: { en: "Unsaturated hydrocarbons (like vegetable oils) undergo addition reactions with hydrogen in the presence of a catalyst such as palladium or nickel to yield saturated hydrocarbons (solid fats).", as: "অসম্পৃক্ত হাইড্ৰ'কাৰ্বন (যেনে উদ্ভিদ তেল) প্যালেডিয়াম বা নিকেলৰ দৰে উদ্দীপক থকাত হাইড্ৰ'জেনৰ সৈতে যোগ বিক্ৰিয়া কৰি সম্পৃক্ত হাইড্ৰ'কাৰ্বন (কঠিন চৰ্বি) উৎপন্ন কৰে।" },
    observations: { en: "As hydrogen gas is bubbled through the hot oil over a nickel catalyst, the clear, runny liquid oil gradually thickens, turning cloudy and viscous as it converts into a semi-solid fat.", as: "নিকেল উদ্দীপকৰ ওপৰেদি গৰম তেলৰ মাজেদি হাইড্ৰ'জেন গেছৰ বুদবুদ পাৰ কৰাৰ লগে লগে স্পষ্ট, পাতল তৰল তেল ক্ৰমশঃ ঘন হয়, আধা-কঠিন চৰ্বিলৈ ৰূপান্তৰিত হোৱাৰ লগে লগে মেঘলা আৰু সান্দ্ৰ হয়।" },
    examNotes: { en: "Addition reactions only occur in unsaturated compounds (alkenes/alkynes). This process converts liquid vegetable oils into solid vegetable ghee (Vanaspati).", as: "যোগ বিক্ৰিয়া কেৱল অসম্পৃক্ত যৌগত (এলকেন/এলকাইন) হয়। এই প্ৰক্ৰিয়াই তৰল উদ্ভিদ তেলক কঠিন উদ্ভিদ ঘিউ (ভানস্পতি)-লৈ ৰূপান্তৰিত কৰে।" },
    applications: "Industrial manufacturing of margarine and vegetable ghee from liquid oils.",
    intensity: 7,
    hazards: { en: ["Highly Flammable Gas (H₂)", "High Temperature/Pressure", "Catalyst Toxicity"], as: ["অতি জ্বলনযোগ্য গেছ (H₂)", "উচ্চ উষ্ণতা/চাপ", "উদ্দীপকৰ বিষাক্ততা"] },
    visuals: { reactionType: "HYDROGENATION", liquidColor1: "rgba(255, 215, 0, 0.6)", liquidColor2: "transparent", productColor: "rgba(255, 250, 220, 0.95)", environment: "catalyst_chamber" },
    quiz: [
      { q: { en: "Which type of hydrocarbons undergo addition reactions like hydrogenation?", as: "হাইড্ৰ'জেনেচনৰ দৰে যোগ বিক্ৰিয়া কোন ধৰণৰ হাইড্ৰ'কাৰ্বনত হয়?" }, opts: { en: ["Alkanes", "Saturated hydrocarbons", "Unsaturated hydrocarbons (Alkenes/Alkynes)", "Cycloalkanes"], as: ["এলকেন", "সম্পৃক্ত হাইড্ৰ'কাৰ্বন", "অসম্পৃক্ত হাইড্ৰ'কাৰ্বন (এলকেন/এলকাইন)", "চক্লো-এলকেন"] }, ans: 2 },
      { q: { en: "What is the industrial application of this reaction?", as: "এই বিক্ৰিয়াৰ শিল্প প্ৰয়োগ কি?" }, opts: { en: ["Making soap from fats", "Converting vegetable oils into solid fats (margarine)", "Producing ethanol from ethene", "Cracking heavy oils into petrol"], as: ["চৰ্বিৰ পৰা চাবোন তৈয়াৰ", "উদ্ভিদ তেলক কঠিন চৰ্বিলৈ ৰূপান্তৰ (মার্জাৰিন)", "ইথেনৰ পৰা ইথান'ল উৎপাদন", "পেট্ৰলৰ বাবে ভাৰী তেল ক্ৰেকিং"] }, ans: 1 },
      { q: { en: "What role does Nickel play in this reaction?", as: "এই বিক্ৰিয়াত নিকেলে কি ভূমিকা পালন কৰে?" }, opts: { en: ["It provides hydrogen atoms", "It acts as a catalyst to lower activation energy", "It absorbs impurities from the oil", "It acts as an emulsifier"], as: ["ই হাইড্ৰ'জেন পৰমাণু যোগান দিয়ে", "ই সক্ৰিয়তা শক্তি হ্ৰাস কৰিবলৈ উদ্দীপক হিচাপে কাম কৰে", "ই তেলৰ পৰা অশুদ্ধতা শোষণ কৰে", "ই ইমালচিফায়াৰ হিচাপে কাম কৰে"] }, ans: 1 }
    ]
  }
];
