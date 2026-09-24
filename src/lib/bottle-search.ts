import type { Bottle, Shop } from "@/lib/data";

const STYLE_WORDS: Record<string, RegExp> = {
  red: /red|cabernet|syrah|zinfandel|nebbiolo|sangiovese|malbec|merlot|barolo|chianti|pinot noir|grenache|tempranillo|brunello|rioja|amarone/i,
  white: /white|chardonnay|sauvignon|riesling|pinot grigio|albari|chenin|verdicchio|gr[üu]ner|vermentino|soave/i,
  rose: /ros[eé]/i,
  sparkling: /sparkling|champagne|franciacorta|cr[eé]mant|prosecco|cava|brut|spumante/i,
  orange: /orange|skin.contact|amber/i,
  natural: /natural|biodynamic|organic|low.intervention|skin.contact/i,
  italian: /ital|barolo|chianti|piedmont|tuscan|nebbiolo|sangiovese|franciacorta|etna|veneto|sicil/i,
  french: /french|france|burgundy|bordeaux|loire|rh[oô]ne|champagne|sancerre|beaujolais/i,
  california: /california|napa|sonoma|paso robles|russian river/i,
  champagne: /champagne/i,
  piedmont: /piedmont|barolo|barbaresco|nebbiolo|barbera|langhe/i,
};

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9$àèéìòóùü\s.]/g, " ")
    .split(/\s+/)
    .map((t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t))
    .filter((t) => t.length > 2 && !["the", "and", "for", "with", "wine", "bottle"].includes(t));
}

function haystack(b: Bottle): string {
  return `${b.name} ${b.producer} ${b.varietal} ${b.region} ${b.country} ${b.notes} ${b.pairing} ${b.category}`.toLowerCase();
}

/** Max price implied by a query such as "under $30". */
function maxPriceOf(q: string): number | null {
  const m = q.match(/(?:under|below|less than|max)\s*\$?\s*(\d{1,4})/i) ?? q.match(/\$\s*(\d{1,4})/);
  return m ? Number(m[1]) : null;
}

export function bottleMatches(b: Bottle, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const cap = maxPriceOf(q);
  if (cap != null && b.price > cap) return false;
  const tokens = tokenize(q).filter((t) => !/^\d+$/.test(t) && !["under", "below", "max"].includes(t));
  if (tokens.length === 0) return cap != null;
  const hay = haystack(b);
  return tokens.every((t) => {
    if (hay.includes(t)) return true;
    const re = STYLE_WORDS[t];
    return re ? re.test(hay) : false;
  });
}

export function filterBottles(bottles: Bottle[], query: string): Bottle[] {
  if (!query.trim()) return bottles;
  return bottles.filter((b) => bottleMatches(b, query));
}

/** Shops that currently stock at least one bottle matching the query, with match counts. */
export function filterShopsByQuery(
  shops: Shop[],
  bottles: Bottle[],
  query: string,
): { shops: Shop[]; matchCount: Record<string, number> } {
  if (!query.trim()) return { shops, matchCount: {} };
  const matchCount: Record<string, number> = {};
  for (const b of filterBottles(bottles, query)) {
    matchCount[b.shopSlug] = (matchCount[b.shopSlug] ?? 0) + 1;
  }
  return { shops: shops.filter((s) => (matchCount[s.slug] ?? 0) > 0), matchCount };
}
