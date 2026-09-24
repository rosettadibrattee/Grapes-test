/** Deterministic demo customer reviews for a bottle (display-only). */

export type Review = { name: string; initials: string; stars: number; date: string; text: string };

const NAMES = [
  "Sofia R.", "Marcus T.", "Elena P.", "Jonah K.", "Priya N.", "Luca B.",
  "Amara O.", "Dylan F.", "Chiara M.", "Noah W.", "Ines D.", "Theo G.",
];

const TEXTS = [
  "Opened it for a Friday dinner — silky, balanced, and gone way too fast.",
  "Great value for the price. Picked it up in 10 minutes, no queue.",
  "Beautiful nose. Let it breathe 20 minutes and it really opens up.",
  "My go-to bottle now. The shop staff recommended it and they nailed it.",
  "Smooth and food-friendly. Paired perfectly with what the app suggested.",
  "Slightly bolder than I expected, but in the best way. Would buy again.",
  "Elegant and clean finish. Perfect gift bottle.",
  "Reserved it on my phone, picked it up on the way home. Too easy.",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function bottleRating(slug: string) {
  const h = hash(slug);
  const score = 4 + ((h % 11) / 10); // 4.0 – 5.0
  const count = 18 + (h % 180);
  return { score: Math.min(5, Math.round(score * 10) / 10), count };
}

export function bottleReviews(slug: string, n = 3): Review[] {
  const h = hash(slug);
  return Array.from({ length: n }, (_, i) => {
    const k = (h >>> (i * 3)) + i * 7;
    const name = NAMES[k % NAMES.length];
    return {
      name,
      initials: name.slice(0, 1) + name.split(" ")[1]?.slice(0, 1),
      stars: 4 + ((k >>> 2) % 2),
      date: `${1 + (k % 27)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][(k >>> 4) % 8]} 2026`,
      text: TEXTS[(k >>> 1) % TEXTS.length],
    };
  });
}

/** Split a bottle's pairing string into individual dish names. */
export function pairingDishes(pairing: string): string[] {
  return pairing
    .split(/[,.;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
}
