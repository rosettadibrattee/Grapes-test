import bottleBarolo from "@/assets/bottle-barolo.jpg";
import bottleMalbec from "@/assets/bottle-malbec.jpg";
import bottleSancerre from "@/assets/bottle-sancerre.jpg";
import bottleFranciacorta from "@/assets/bottle-franciacorta.jpg";
import shopVintners from "@/assets/shop-vintners.jpg";
import shopBrooklyn from "@/assets/shop-brooklyn.jpg";
import shopChelsea from "@/assets/shop-chelsea.jpg";
import shopGreenpoint from "@/assets/shop-greenpoint.jpg";

export type City = "sf";

export type BottleCategory = "California" | "Italian" | "French" | "Special";

export type Bottle = {
  slug: string;
  name: string;
  producer: string;
  region: string;
  country: string;
  flag: string;
  varietal: string;
  vintage: number;
  price: number;
  image: string;
  notes: string;
  pairing: string;
  shopSlug: string;
  category: BottleCategory;
};

export type Shop = {
  slug: string;
  name: string;
  city: City;
  neighborhood: string;
  address: string;
  hours: string;
  image: string;
  bottleCount: number;
  tags: string[];
  blurb: string;
  lat: number;
  lng: number;
  kind: "Wine" | "Spirits" | "Bar";
};

export type Post = {
  id: string;
  author: string;
  authorInitials: string;
  authorMeta: string;
  avatar: string;
  time: string;
  country: string;
  flag: string;
  bottleSlug: string;
  shopSlug: string;
  text: string;
  likes: number;
  image: string;
  occasion: string;
  comments: { author: string; avatar: string; text: string }[];
};


export const shops: Shop[] = [
  {
    slug: "vintners-guild-soho",
    name: "Vintner's Guild Chiado",
    city: "sf",
    neighborhood: "Chiado",
    address: "R. Garrett 42, 1200-204 Lisboa",
    hours: "Mon–Sat 11am–10pm · Sun 12–8pm",
    image: shopVintners,
    bottleCount: 412,
    tags: ["Italian", "Old World", "Curated"],
    blurb:
      "A tightly curated cellar leaning Piedmontese, with weekly tastings and certified sommeliers.",
    lat: 38.7106,
    lng: -9.1416,
    kind: "Wine",
  },
  {
    slug: "brooklyn-cellars",
    name: "Alfama Cellars",
    city: "sf",
    neighborhood: "Alfama",
    address: "R. de São Pedro 21, 1100-055 Lisboa",
    hours: "Daily 12pm–11pm",
    image: shopBrooklyn,
    bottleCount: 856,
    tags: ["South American", "Value", "Big Reds"],
    blurb:
      "Vaulted brick cellar. Best Malbec selection in the neighborhood and rotating grower Champagne.",
    lat: 38.7118,
    lng: -9.129,
    kind: "Spirits",
  },
  {
    slug: "chelsea-wine-vault",
    name: "Belém Wine Vault",
    city: "sf",
    neighborhood: "Belém",
    address: "R. de Belém 12, 1300-085 Lisboa",
    hours: "Mon–Sun 10am–9pm",
    image: shopChelsea,
    bottleCount: 2100,
    tags: ["French", "Grand", "Storage"],
    blurb:
      "Warehouse-scale selection with a serious Burgundy and Loire program. Climate-controlled storage.",
    lat: 38.697,
    lng: -9.2036,
    kind: "Wine",
  },
  {
    slug: "greenpoint-natural",
    name: "Marvila Natural",
    city: "sf",
    neighborhood: "Marvila",
    address: "R. do Açúcar 76, 1950-013 Lisboa",
    hours: "Tue–Sun 1pm–10pm",
    image: shopGreenpoint,
    bottleCount: 340,
    tags: ["Natural", "Low-intervention", "Orange"],
    blurb:
      "Skin-contact whites, glou-glou reds and pét-nat. Everything the chain shop won't carry.",
    lat: 38.7405,
    lng: -9.0995,
    kind: "Wine",
  },

  // ————— Lisboa —————
  {
    slug: "mission-bottle-shop",
    name: "Bairro Alto Bottle Shop",
    city: "sf",
    neighborhood: "Bairro Alto",
    address: "R. da Atalaia 88, 1200-038 Lisboa",
    hours: "Daily 11am–10pm",
    image: shopVintners,
    bottleCount: 520,
    tags: ["Natural", "California", "Small producers"],
    blurb:
      "Mission cornerstone with a bias toward Sonoma coast growers and low-sulfur reds.",
    lat: 38.7128,
    lng: -9.1465,
    kind: "Wine",
  },
  {
    slug: "hayes-valley-cellar",
    name: "Príncipe Real Cellar",
    city: "sf",
    neighborhood: "Príncipe Real",
    address: "R. Escola Politécnica 30, 1250-100 Lisboa",
    hours: "Tue–Sun 12pm–9pm",
    image: shopBrooklyn,
    bottleCount: 680,
    tags: ["Burgundy", "Champagne", "Curator"],
    blurb:
      "White-glove Burgundy and grower Champagne, hand-carried allocations, quiet tasting bar in back.",
    lat: 38.7167,
    lng: -9.152,
    kind: "Wine",
  },
  {
    slug: "north-beach-vino",
    name: "Graça Vino",
    city: "sf",
    neighborhood: "Graça",
    address: "Largo da Graça 5, 1170-165 Lisboa",
    hours: "Mon–Sat 10am–10pm",
    image: shopChelsea,
    bottleCount: 940,
    tags: ["Italian", "Piedmont", "Family run"],
    blurb:
      "Three-generation Italian shop. If it's Nebbiolo, they have it. Grappa wall in the back.",
    lat: 38.7166,
    lng: -9.13,
    kind: "Spirits",
  },
  {
    slug: "marina-cork-club",
    name: "Cais do Sodré Cork Club",
    city: "sf",
    neighborhood: "Cais do Sodré",
    address: "R. Nova do Carvalho 20, 1200-292 Lisboa",
    hours: "Daily 11am–11pm",
    image: shopGreenpoint,
    bottleCount: 410,
    tags: ["Bar", "By the glass", "Snacks"],
    blurb:
      "Neighborhood wine bar & bottle shop. Retail wall out front, 40 wines by the glass in back.",
    lat: 38.7069,
    lng: -9.1449,
    kind: "Bar",
  },
  // ————— Lisboa —————
  {
    slug: "castro-corkscrew",
    name: "Estrela Corkscrew",
    city: "sf",
    neighborhood: "Estrela",
    address: "Calçada da Estrela 60, 1200-661 Lisboa",
    hours: "Daily 12pm–10pm",
    image: shopBrooklyn,
    bottleCount: 380,
    tags: ["Rosé", "Sparkling", "Neighborhood"],
    blurb: "Rainbow-lit corner shop with a killer rosé wall and a rotating grower Champagne fridge.",
    lat: 38.7135, lng: -9.16, kind: "Wine",
  },
  {
    slug: "soma-spirits",
    name: "Parque das Nações Spirits & Wine",
    city: "sf",
    neighborhood: "Parque das Nações",
    address: "Alameda dos Oceanos 44, 1990-203 Lisboa",
    hours: "Mon–Sat 11am–10pm",
    image: shopChelsea,
    bottleCount: 720,
    tags: ["Spirits", "Whiskey", "Wine"],
    blurb: "Wide-format warehouse with rare bourbon allocations and a serious California section.",
    lat: 38.7633, lng: -9.095, kind: "Spirits",
  },
  {
    slug: "richmond-reserve",
    name: "Campo de Ourique Reserve",
    city: "sf",
    neighborhood: "Campo de Ourique",
    address: "R. Ferreira Borges 110, 1350-129 Lisboa",
    hours: "Tue–Sun 12pm–9pm",
    image: shopGreenpoint,
    bottleCount: 290,
    tags: ["Natural", "Cellar picks"],
    blurb: "Small-lot cellar selections from Sonoma, Anderson Valley and coastal Oregon.",
    lat: 38.7175, lng: -9.1682, kind: "Wine",
  },
  {
    slug: "presidio-pour",
    name: "Avenida Pour House",
    city: "sf",
    neighborhood: "Avenida da Liberdade",
    address: "Av. da Liberdade 180, 1250-146 Lisboa",
    hours: "Daily 11am–11pm",
    image: shopVintners,
    bottleCount: 460,
    tags: ["Bar", "Retail", "Curated"],
    blurb: "Half wine bar, half bottle shop. Pull anything off the shelf and drink it in — $15 corkage.",
    lat: 38.7223, lng: -9.145, kind: "Bar",
  },
  {
    slug: "dogpatch-vine",
    name: "Beato Vine",
    city: "sf",
    neighborhood: "Beato",
    address: "R. de Xabregas 8, 1900-440 Lisboa",
    hours: "Wed–Sun 12pm–10pm",
    image: shopBrooklyn,
    bottleCount: 350,
    tags: ["Natural", "Orange", "Skin-contact"],
    blurb: "Industrial-chic natural wine bar with a tightly edited retail wall by the door.",
    lat: 38.7325, lng: -9.108, kind: "Wine",
  },
  {
    slug: "nob-hill-cellar",
    name: "Lapa Cellar",
    city: "sf",
    neighborhood: "Lapa",
    address: "R. do Sacramento 30, 1200-793 Lisboa",
    hours: "Daily 10am–10pm",
    image: shopChelsea,
    bottleCount: 610,
    tags: ["Bordeaux", "Cellar", "Fine wine"],
    blurb: "Serious Bordeaux and Burgundy for the hilltop crowd. Ask about the back-vintage room.",
    lat: 38.7085, lng: -9.1665, kind: "Wine",
  },
  // ————— Lisboa —————
  {
    slug: "east-village-bottle",
    name: "Anjos Bottle",
    city: "sf",
    neighborhood: "Anjos",
    address: "R. Maria da Fonte 12, 1170-221 Lisboa",
    hours: "Tue–Sun 1pm–10pm",
    image: shopGreenpoint,
    bottleCount: 122,
    tags: ["Organic", "Biodynamic", "Family"],
    blurb: "Cozy 400sqft shop with hand-written shelf notes. Organic, biodynamic and family-run producers.",
    lat: 38.7255, lng: -9.1345, kind: "Wine",
  },
  {
    slug: "uws-vintners",
    name: "Avenidas Novas Vintners",
    city: "sf",
    neighborhood: "Avenidas Novas",
    address: "Av. da República 50, 1050-196 Lisboa",
    hours: "Mon–Sun 10am–10pm",
    image: shopVintners,
    bottleCount: 890,
    tags: ["Grand cru", "Cellar", "Delivery"],
    blurb: "Grand-scale neighborhood institution with a temperature-controlled back cellar for library bottles.",
    lat: 38.7382, lng: -9.145, kind: "Wine",
  },
  {
    slug: "les-fine-wines",
    name: "Santos Fine Wines",
    city: "sf",
    neighborhood: "Santos",
    address: "R. de São Paulo 200, 1200-431 Lisboa",
    hours: "Daily 12pm–11pm",
    image: shopBrooklyn,
    bottleCount: 520,
    tags: ["Natural", "Skin-contact", "Value"],
    blurb: "Late-night natural bottle shop. Fridge full of pét-nats and $18 crushable reds.",
    lat: 38.7075, lng: -9.154, kind: "Wine",
  },
  {
    slug: "bushwick-barrel",
    name: "Intendente Barrel",
    city: "sf",
    neighborhood: "Intendente",
    address: "Largo do Intendente 15, 1100-304 Lisboa",
    hours: "Wed–Sun 2pm–11pm",
    image: shopGreenpoint,
    bottleCount: 280,
    tags: ["Natural", "Cider", "Sake"],
    blurb: "Cider, sake and natural wine under one industrial roof. DJs on Fridays.",
    lat: 38.7215, lng: -9.1355, kind: "Bar",
  },
  {
    slug: "harlem-heritage",
    name: "Mouraria Heritage Wines",
    city: "sf",
    neighborhood: "Mouraria",
    address: "R. do Benformoso 90, 1100-089 Lisboa",
    hours: "Mon–Sat 11am–10pm",
    image: shopChelsea,
    bottleCount: 640,
    tags: ["Black-owned", "South African", "New World"],
    blurb: "Neighborhood cornerstone spotlighting Black-owned wineries and South African producers.",
    lat: 38.718, lng: -9.1355, kind: "Wine",
  },
  {
    slug: "flatiron-fine",
    name: "Baixa Fine Wine",
    city: "sf",
    neighborhood: "Baixa",
    address: "R. Augusta 100, 1100-053 Lisboa",
    hours: "Mon–Sun 10am–9pm",
    image: shopVintners,
    bottleCount: 1580,
    tags: ["Grand cru", "Import", "Storage"],
    blurb: "Import-house-adjacent shop with allocations you won't see anywhere else in the city.",
    lat: 38.7107, lng: -9.1366, kind: "Wine",
  },

];

type BottleTemplate = Omit<Bottle, "slug" | "shopSlug"> & { key: string };

const TEMPLATES: BottleTemplate[] = [
  // ————— California (4) —————
  {
    key: "napa-cabernet",
    name: "Napa Valley Cabernet",
    producer: "Stagecoach Estate",
    region: "Napa Valley",
    country: "USA",
    flag: "🇺🇸",
    varietal: "Cabernet Sauvignon",
    vintage: 2019,
    price: 68,
    image: bottleBarolo,
    notes: "Blackcurrant, cedar and graphite. Firm tannin, long finish — a classic Napa Cab built for the cellar.",
    pairing: "Dry-aged ribeye, mushroom risotto, aged cheddar.",
    category: "California",
  },
  {
    key: "sonoma-pinot",
    name: "Sonoma Coast Pinot Noir",
    producer: "Foggy Ridge",
    region: "Sonoma Coast",
    country: "USA",
    flag: "🇺🇸",
    varietal: "Pinot Noir",
    vintage: 2021,
    price: 46,
    image: bottleMalbec,
    notes: "Wild strawberry, rose petal and a whisper of sea spray. Coastal cool-climate elegance.",
    pairing: "Roast duck, salmon, mushroom pizza.",
    category: "California",
  },
  {
    key: "russian-river-chard",
    name: "Russian River Chardonnay",
    producer: "Willow Creek",
    region: "Russian River",
    country: "USA",
    flag: "🇺🇸",
    varietal: "Chardonnay",
    vintage: 2022,
    price: 38,
    image: bottleSancerre,
    notes: "Meyer lemon, brioche, hazelnut. Balanced oak, bright acid, creamy mid-palate.",
    pairing: "Roast chicken, crab, brown-butter pasta.",
    category: "California",
  },
  {
    key: "paso-zinfandel",
    name: "Paso Robles Zinfandel",
    producer: "Adelaida Hills",
    region: "Paso Robles",
    country: "USA",
    flag: "🇺🇸",
    varietal: "Zinfandel",
    vintage: 2020,
    price: 34,
    image: bottleBarolo,
    notes: "Brambly blackberry, black pepper, cocoa. Ripe and generous without going jammy.",
    pairing: "BBQ ribs, burgers, smoked brisket.",
    category: "California",
  },
  {
    key: "santa-barbara-syrah",
    name: "Santa Barbara Syrah",
    producer: "Los Olivos Cellars",
    region: "Santa Barbara",
    country: "USA",
    flag: "🇺🇸",
    varietal: "Syrah",
    vintage: 2020,
    price: 44,
    image: bottleBarolo,
    notes: "Blueberry, olive tapenade, smoked meat. Cool-climate Syrah with real Northern Rhône swagger.",
    pairing: "Grilled lamb chops, duck confit, hard cheeses.",
    category: "California",
  },
  {
    key: "anderson-valley-rose",
    name: "Anderson Valley Rosé",
    producer: "Navarro Ridge",
    region: "Anderson Valley",
    country: "USA",
    flag: "🇺🇸",
    varietal: "Pinot Noir Rosé",
    vintage: 2023,
    price: 26,
    image: bottleSancerre,
    notes: "Wild strawberry, pink grapefruit, a hint of white pepper. Dry, crisp, and infinitely gulpable.",
    pairing: "Grilled salmon, summer salads, spicy tacos.",
    category: "California",
  },
  // ————— Italian (6) —————
  {
    key: "barolo-riserva",
    name: "Barolo Riserva",
    producer: "Cantina Piemonte",
    region: "Piedmont",
    country: "Italy",
    flag: "🇮🇹",
    varietal: "Nebbiolo",
    vintage: 2016,
    price: 84,
    image: bottleBarolo,
    notes: "Silky tannins, dried cherry, roses and just enough tar. Built to age another decade.",
    pairing: "Braised short rib, aged Parmigiano, wild mushroom risotto.",
    category: "Italian",
  },
  {
    key: "chianti-classico",
    name: "Chianti Classico",
    producer: "Tenuta San Marco",
    region: "Tuscany",
    country: "Italy",
    flag: "🇮🇹",
    varietal: "Sangiovese",
    vintage: 2020,
    price: 28,
    image: bottleMalbec,
    notes: "Sour cherry, tomato leaf, dried herbs. Bright acidity — the ultimate table red.",
    pairing: "Bolognese, margherita pizza, roast lamb.",
    category: "Italian",
  },
  {
    key: "brunello",
    name: "Brunello di Montalcino",
    producer: "Poggio Antico",
    region: "Tuscany",
    country: "Italy",
    flag: "🇮🇹",
    varietal: "Sangiovese Grosso",
    vintage: 2018,
    price: 96,
    image: bottleBarolo,
    notes: "Dark cherry, leather, tobacco, balsamic. Powerful and structured, decades of life ahead.",
    pairing: "Bistecca alla Fiorentina, wild boar ragù.",
    category: "Italian",
  },
  {
    key: "franciacorta-brut",
    name: "Franciacorta Brut NV",
    producer: "Ca' del Lago",
    region: "Lombardy",
    country: "Italy",
    flag: "🇮🇹",
    varietal: "Chardonnay / Pinot Nero",
    vintage: 2019,
    price: 38,
    image: bottleFranciacorta,
    notes: "Fine bead, brioche and lemon curd, a lingering saline finish. Champagne poise at half the price.",
    pairing: "Sunday brunch, fried chicken, salty snacks.",
    category: "Italian",
  },
  {
    key: "amarone",
    name: "Amarone della Valpolicella",
    producer: "Corte Antica",
    region: "Veneto",
    country: "Italy",
    flag: "🇮🇹",
    varietal: "Corvina Blend",
    vintage: 2018,
    price: 78,
    image: bottleBarolo,
    notes: "Dried fig, black cherry, cocoa and warm spice. Full-bodied, opulent, made from air-dried grapes.",
    pairing: "Braised beef, aged Gorgonzola, dark chocolate.",
    category: "Italian",
  },
  {
    key: "etna-rosso",
    name: "Etna Rosso",
    producer: "Vigneti Vulcano",
    region: "Sicily",
    country: "Italy",
    flag: "🇮🇹",
    varietal: "Nerello Mascalese",
    vintage: 2021,
    price: 42,
    image: bottleMalbec,
    notes: "Volcanic minerality, red cherry, wild herbs. Elegant and savory — Sicily's answer to Burgundy.",
    pairing: "Grilled swordfish, pasta alla Norma, roast pork.",
    category: "Italian",
  },
  // ————— French (6) —————
  {
    key: "sancerre-blanc",
    name: "Sancerre Blanc",
    producer: "Domaine Loire",
    region: "Loire Valley",
    country: "France",
    flag: "🇫🇷",
    varietal: "Sauvignon Blanc",
    vintage: 2022,
    price: 42,
    image: bottleSancerre,
    notes: "Crushed stone, grapefruit pith, chalk. Crisp, mineral, dangerous on a warm evening.",
    pairing: "Oysters, chèvre, warm asparagus.",
    category: "French",
  },
  {
    key: "cotes-du-rhone",
    name: "Côtes du Rhône Villages",
    producer: "Domaine Saint-André",
    region: "Rhône",
    country: "France",
    flag: "🇫🇷",
    varietal: "Grenache / Syrah",
    vintage: 2021,
    price: 24,
    image: bottleMalbec,
    notes: "Sun-warmed raspberry, garrigue, cracked pepper. Effortless weeknight generosity.",
    pairing: "Roast chicken, ratatouille, lentil stew.",
    category: "French",
  },
  {
    key: "burgundy-rouge",
    name: "Bourgogne Rouge",
    producer: "Maison Chapelle",
    region: "Burgundy",
    country: "France",
    flag: "🇫🇷",
    varietal: "Pinot Noir",
    vintage: 2021,
    price: 52,
    image: bottleBarolo,
    notes: "Red currant, violet, forest floor. Silky, transparent Pinot from village-level vines.",
    pairing: "Coq au vin, seared duck breast, mushroom tart.",
    category: "French",
  },
  {
    key: "champagne-grower",
    name: "Grower Champagne Brut",
    producer: "R. Beaufort",
    region: "Champagne",
    country: "France",
    flag: "🇫🇷",
    varietal: "Pinot Meunier / Chardonnay",
    vintage: 2019,
    price: 72,
    image: bottleFranciacorta,
    notes: "Baked apple, toasted almond, chalky finish. Small-grower depth without the big-house markup.",
    pairing: "Fried chicken, oysters, aged Comté.",
    category: "French",
  },
  {
    key: "chablis",
    name: "Chablis 1er Cru",
    producer: "Domaine Sainte-Marie",
    region: "Burgundy",
    country: "France",
    flag: "🇫🇷",
    varietal: "Chardonnay",
    vintage: 2021,
    price: 56,
    image: bottleSancerre,
    notes: "Oyster shell, lemon zest, wet flint. Unoaked, taut, gloriously mineral.",
    pairing: "Oysters, sushi, goat cheese, crab.",
    category: "French",
  },
  {
    key: "chateauneuf",
    name: "Châteauneuf-du-Pape",
    producer: "Clos des Papes",
    region: "Southern Rhône",
    country: "France",
    flag: "🇫🇷",
    varietal: "Grenache Blend",
    vintage: 2019,
    price: 88,
    image: bottleBarolo,
    notes: "Kirsch, garrigue, leather, sweet spice. Warm-hearted, generous, built for the long haul.",
    pairing: "Roast lamb, cassoulet, wild game.",
    category: "French",
  },
  // ————— Special (6) —————
  {
    key: "mendoza-malbec",
    name: "Mendoza Malbec Reserva",
    producer: "Bodega Andes",
    region: "Mendoza",
    country: "Argentina",
    flag: "🇦🇷",
    varietal: "Malbec",
    vintage: 2020,
    price: 32,
    image: bottleMalbec,
    notes: "Dark plum, cocoa nib, a whisper of violets. Ripe but never jammy — altitude keeps the acidity honest.",
    pairing: "Grilled short rib, chimichurri, anything off the grill.",
    category: "Special",
  },
  {
    key: "rioja-gran-reserva",
    name: "Rioja Gran Reserva",
    producer: "Bodegas Herencia",
    region: "Rioja",
    country: "Spain",
    flag: "🇪🇸",
    varietal: "Tempranillo",
    vintage: 2015,
    price: 58,
    image: bottleBarolo,
    notes: "Dried fig, vanilla, leather, dill. Decade-plus in bottle — tertiary, elegant, ready to drink.",
    pairing: "Jamón ibérico, roast lamb, manchego.",
    category: "Special",
  },
  {
    key: "mosel-riesling",
    name: "Mosel Riesling Kabinett",
    producer: "Weingut Steinberg",
    region: "Mosel",
    country: "Germany",
    flag: "🇩🇪",
    varietal: "Riesling",
    vintage: 2022,
    price: 30,
    image: bottleSancerre,
    notes: "Green apple, wet slate, lime zest. Barely off-dry, feather-light, thrilling acidity.",
    pairing: "Thai curry, pork schnitzel, spicy tuna roll.",
    category: "Special",
  },
  {
    key: "orange-pet-nat",
    name: "Skin-Contact Pét-Nat",
    producer: "Furlani Family",
    region: "Alto Adige",
    country: "Italy",
    flag: "🇮🇹",
    varietal: "Field blend",
    vintage: 2023,
    price: 36,
    image: bottleFranciacorta,
    notes: "Cloudy amber, dried apricot, ginger, wild yeast fizz. Low-intervention, high-personality.",
    pairing: "Charcuterie board, kimchi, roast squash.",
    category: "Special",
  },
  {
    key: "douro-red",
    name: "Douro Reserva",
    producer: "Quinta do Vale",
    region: "Douro",
    country: "Portugal",
    flag: "🇵🇹",
    varietal: "Touriga Nacional Blend",
    vintage: 2019,
    price: 40,
    image: bottleBarolo,
    notes: "Blackberry, slate, wild herbs, cocoa. Structured and mineral — Portugal's best-kept secret.",
    pairing: "Grilled sausage, lamb stew, aged cheeses.",
    category: "Special",
  },
  {
    key: "hunter-semillon",
    name: "Hunter Valley Semillon",
    producer: "Old Vines Estate",
    region: "Hunter Valley",
    country: "Australia",
    flag: "🇦🇺",
    varietal: "Semillon",
    vintage: 2020,
    price: 34,
    image: bottleSancerre,
    notes: "Lemon curd, beeswax, toast. Low-alcohol, waxy, and ageless — one of wine's great oddities.",
    pairing: "Fish & chips, Thai salad, aged cheddar.",
    category: "Special",
  },
];

export const bottles: Bottle[] = shops.flatMap((shop) =>
  TEMPLATES.map((t) => ({
    ...t,
    slug: `${shop.slug}--${t.key}`,
    shopSlug: shop.slug,
  })),
);

// Alias original short slugs (used by community posts) to the first shop's inventory.
const ALIAS: Record<string, { key: string; shopSlug: string }> = {
  "barolo-riserva-2016": { key: "barolo-riserva", shopSlug: "vintners-guild-soho" },
  "mendoza-malbec-2020": { key: "mendoza-malbec", shopSlug: "brooklyn-cellars" },
  "sancerre-2022": { key: "sancerre-blanc", shopSlug: "chelsea-wine-vault" },
  "franciacorta-brut-nv": { key: "franciacorta-brut", shopSlug: "greenpoint-natural" },
};

export const posts: Post[] = [
  {
    id: "p1",
    author: "Marco Rinaldi",
    authorInitials: "MR",
    authorMeta: "East Village · Level 3 Somm",
    avatar: "https://i.pravatar.cc/120?img=68",
    time: "2h",
    country: "Italian",
    flag: "🇮🇹",
    bottleSlug: "barolo-riserva-2016",
    shopSlug: "vintners-guild-soho",
    text:
      "30th birthday dinner with the whole crew — popped the Barolo and everyone lost it. Best night of the year so far. 🎉",
    likes: 128,
    occasion: "Birthday",
    image:
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80",
    comments: [
      {
        author: "Elena V.",
        avatar: "https://i.pravatar.cc/80?img=32",
        text: "That table looks unreal — happy birthday Marco! 🥂",
      },
      {
        author: "Danny R.",
        avatar: "https://i.pravatar.cc/80?img=15",
        text: "Save me a glass next time please 🙏",
      },
    ],
  },
  {
    id: "p2",
    author: "Giulia P.",
    authorInitials: "GP",
    authorMeta: "Williamsburg",
    avatar: "https://i.pravatar.cc/120?img=47",
    time: "5h",
    country: "Argentinean",
    flag: "🇦🇷",
    bottleSlug: "mendoza-malbec-2020",
    shopSlug: "brooklyn-cellars",
    text:
      "Graduation dinner for my sister 🎓 — Malbec + grilled steak on the roof. She finally did it!",
    likes: 86,
    occasion: "Graduation",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    comments: [
      {
        author: "Marco R.",
        avatar: "https://i.pravatar.cc/80?img=68",
        text: "Congrats to her! Malbec was the right call.",
      },
    ],
  },
  {
    id: "p3",
    author: "Aaron K.",
    authorInitials: "AK",
    authorMeta: "Lisbon wine writer",
    avatar: "https://i.pravatar.cc/120?img=13",
    time: "1d",
    country: "French",
    flag: "🇫🇷",
    bottleSlug: "sancerre-2022",
    shopSlug: "chelsea-wine-vault",
    text:
      "Rooftop party with the neighbors — Sancerre was gone in 20 minutes. Reserved 4 more for next weekend.",
    likes: 214,
    occasion: "Party",
    image:
      "https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=1200&q=80",
    comments: [
      {
        author: "Priya S.",
        avatar: "https://i.pravatar.cc/80?img=44",
        text: "The golden hour on that rooftop 😍",
      },
      {
        author: "Tom L.",
        avatar: "https://i.pravatar.cc/80?img=22",
        text: "Where did you grab it? Need for Sat.",
      },
    ],
  },
  {
    id: "p4",
    author: "Sofia M.",
    authorInitials: "SM",
    authorMeta: "Mission local",
    avatar: "https://i.pravatar.cc/120?img=45",
    time: "2d",
    country: "Italian",
    flag: "🇮🇹",
    bottleSlug: "franciacorta-brut-nv",
    shopSlug: "greenpoint-natural",
    text:
      "Engagement celebration with my girls 💍 — Franciacorta bubbles, sunset on the terrace. Cried a little. Worth it.",
    likes: 63,
    occasion: "Celebration",
    image:
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&w=1200&q=80",
    comments: [
      {
        author: "Lea B.",
        avatar: "https://i.pravatar.cc/80?img=49",
        text: "CONGRATS SOFI 🥹💍",
      },
    ],
  },
];


export const getShop = (slug: string) => shops.find((s) => s.slug === slug);
export const getBottle = (slug: string): Bottle | undefined => {
  const direct = bottles.find((b) => b.slug === slug);
  if (direct) return direct;
  const alias = ALIAS[slug];
  if (alias) {
    return bottles.find(
      (b) => b.shopSlug === alias.shopSlug && b.slug === `${alias.shopSlug}--${alias.key}`,
    );
  }
  return undefined;
};
export const getBottlesForShop = (shopSlug: string) =>
  bottles.filter((b) => b.shopSlug === shopSlug);
export const getShopsByCity = (city: City) => shops.filter((s) => s.city === city);
