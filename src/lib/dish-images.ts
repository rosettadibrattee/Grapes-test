// Curated food photography, matched by keyword to an AI-suggested dish name.
const CATALOG: { re: RegExp; url: string }[] = [
  { re: /ragu|ragù|bolognese|lasagn|pasta|spaghett|tagliatell|linguine|penne|carbonara|risotto|gnocchi/i, url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=70&auto=format&fit=crop" },
  { re: /pizza|focaccia|flatbread/i, url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=70&auto=format&fit=crop" },
  { re: /steak|ribeye|sirloin|beef|brisket|short rib|burger/i, url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=70&auto=format&fit=crop" },
  { re: /lamb|venison|game/i, url: "https://images.unsplash.com/photo-1602473812169-a5b2a1b9a1e0?w=800&q=70&auto=format&fit=crop" },
  { re: /duck|goose|quail/i, url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=70&auto=format&fit=crop" },
  { re: /pork|sausage|bacon|porchetta|ham/i, url: "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=800&q=70&auto=format&fit=crop" },
  { re: /chicken|poultry|turkey/i, url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=70&auto=format&fit=crop" },
  { re: /oyster|clam|mussel|shellfish|scallop|shrimp|prawn|crab|lobster/i, url: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=70&auto=format&fit=crop" },
  { re: /salmon|tuna|fish|cod|halibut|branzino|sea bass|ceviche|sushi/i, url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=70&auto=format&fit=crop" },
  { re: /cheese|fondue|burrata|parmig|charcuter/i, url: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=70&auto=format&fit=crop" },
  { re: /salad|greens|slaw|vegetab|roast(ed)? veg|ratatouille/i, url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=70&auto=format&fit=crop" },
  { re: /mushroom|truffle|polenta/i, url: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&q=70&auto=format&fit=crop" },
  { re: /taco|enchilada|mole|chili|burrito/i, url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=70&auto=format&fit=crop" },
  { re: /curry|tikka|masala|thai|noodle|ramen|dumpling|stir.fry/i, url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=70&auto=format&fit=crop" },
  { re: /soup|stew|braise|cassoulet|chowder/i, url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=70&auto=format&fit=crop" },
  { re: /chocolate|dessert|tart|cake|panna cotta|tiramisu|fruit/i, url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=70&auto=format&fit=crop" },
  { re: /egg|brunch|frittata|omelet/i, url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=70&auto=format&fit=crop" },
];

const FALLBACK = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=70&auto=format&fit=crop";

export function dishImage(name: string) {
  return CATALOG.find((c) => c.re.test(name))?.url ?? FALLBACK;
}
