import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { bottles, shops } from "@/lib/data";

const MODEL = "google/gemini-2.5-flash";

function apiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}

function salvageJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

const str = z.string().catch("");
const strArray = z.array(z.string()).catch([]);

const resultSchema = z.object({
  reply: str,
  style: str,
  keywords: strArray,
  maxPrice: z.number().nullable().catch(null),
  minPrice: z.number().nullable().catch(null),
  labelRead: str,
  dishes: z
    .array(z.object({ name: str, why: str, notes: str }))
    .catch([]),
});

export type MatchDish = { name: string; why: string; notes: string };

export type MatchBottle = {
  slug: string;
  name: string;
  producer: string;
  vintage: number;
  price: number;
  image: string;
  flag: string;
  region: string;
  varietal: string;
  notes: string;
  shopName: string;
  shopSlug: string;
  neighborhood: string;
  inStock: number;
};

export type SommelierResult = {
  reply: string;
  labelRead: string;
  bottles: MatchBottle[];
  dishes: MatchDish[];
};

const PROMPT_LINES = [
  "You are an expert sommelier working the floor of a Lisbon wine shop.",
  "Read the guest's request (and the wine label photo if one is attached) and reply with JSON only, no prose.",
  '{"reply":string,"style":string,"keywords":string[],"maxPrice":number|null,"minPrice":number|null,"labelRead":string,"dishes":[{"name":string,"why":string,"notes":string}]}',
  "style: one of red, white, rose, sparkling, orange, dessert, any.",
  "keywords: 4-8 lowercase grape, region or flavor terms to search shelf inventory with.",
  "maxPrice/minPrice in dollars, null when not implied.",
  "labelRead: if a photo is attached, the wine you recognised (producer, name, vintage); otherwise an empty string.",
  "dishes: exactly 4 different plates that pair with these wines. why: a short structural reason under 60 characters, e.g. \"High acidity cuts through lipid richness\". notes: one sentence of flavour detail.",
];

export const sommelierMatch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        query: z.string().default(""),
        imageDataUrl: z.string().nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<SommelierResult> => {
    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const provider = createLovableAiGatewayProvider(apiKey());

    const textPart = [...PROMPT_LINES, `Request: """${data.query || "Recommend something great"}"""`].join(
      "\n",
    );

    const content: Array<
      { type: "text"; text: string } | { type: "file"; data: string; mediaType: string }
    > = [{ type: "text", text: textPart }];

    if (data.imageDataUrl) {
      const mediaType =
        data.imageDataUrl.slice(5, data.imageDataUrl.indexOf(";")) || "image/jpeg";
      content.push({ type: "file", data: data.imageDataUrl, mediaType });
    }

    const { text } = await generateText({
      model: provider(MODEL),
      messages: [{ role: "user", content }],
    });

    const parsedResult = resultSchema.safeParse(salvageJson(text));
    const parsed = parsedResult.success
      ? parsedResult.data
      : {
          reply: "Here are bottles on the shelf that fit what you described.",
          style: "any",
          keywords: data.query.toLowerCase().split(/\s+/),
          maxPrice: null,
          minPrice: null,
          labelRead: "",
          dishes: [] as MatchDish[],
        };

    const styleWords: Record<string, RegExp> = {
      red: /red|cabernet|syrah|zinfandel|nebbiolo|sangiovese|malbec|merlot|barolo|chianti|pinot noir|grenache|tempranillo/i,
      white: /white|chardonnay|sauvignon|riesling|pinot grigio|albari|chenin|verdicchio|gr[üu]ner/i,
      rose: /ros[eé]/i,
      sparkling: /sparkling|champagne|franciacorta|cr[eé]mant|prosecco|cava|brut/i,
      orange: /orange|skin.contact|amber/i,
      dessert: /dessert|sauternes|port|late harvest|moscato/i,
    };
    const styleRe = styleWords[parsed.style.toLowerCase()];
    const kw = parsed.keywords.map((k) => k.toLowerCase()).filter((k) => k.length > 2);

    const seen = new Set<string>();
    const scored = bottles
      .map((b) => {
        const hay =
          `${b.name} ${b.producer} ${b.varietal} ${b.region} ${b.country} ${b.notes} ${b.pairing} ${b.category}`.toLowerCase();
        let score = 0;
        for (const k of kw) if (hay.includes(k)) score += 2;
        if (styleRe && styleRe.test(hay)) score += 3;
        if (parsed.maxPrice != null && b.price <= parsed.maxPrice) score += 2;
        if (parsed.minPrice != null && b.price >= parsed.minPrice) score += 1;
        return { b, score };
      })
      .filter((x) => x.score > 0)
      .filter((x) => (parsed.maxPrice == null ? true : x.b.price <= parsed.maxPrice))
      .filter((x) => (parsed.minPrice == null ? true : x.b.price >= parsed.minPrice))
      .sort((a, b) => b.score - a.score)
      .filter((x) => {
        const key = `${x.b.name}|${x.b.producer}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);

    const pool = scored.length > 0 ? scored.map((x) => x.b) : bottles.slice(0, 6);

    const matched: MatchBottle[] = pool.map((b) => {
      const shop = shops.find((s) => s.slug === b.shopSlug)!;
      return {
        slug: b.slug,
        name: b.name,
        producer: b.producer,
        vintage: b.vintage,
        price: b.price,
        image: b.image,
        flag: b.flag,
        region: b.region,
        varietal: b.varietal,
        notes: b.notes,
        shopName: shop.name,
        shopSlug: shop.slug,
        neighborhood: shop.neighborhood,
        inStock: 2 + ((b.name.length + b.price) % 9),
      };
    });

    const dishes =
      parsed.dishes.length > 0
        ? parsed.dishes.slice(0, 4)
        : [
            {
              name: "Roast chicken with herbs",
              why: "Savory herbs echo the wine's aromatics",
              notes: "A crowd-pleasing plate that flatters almost any style.",
            },
          ];

    return { reply: parsed.reply, labelRead: parsed.labelRead, bottles: matched, dishes };
  });
