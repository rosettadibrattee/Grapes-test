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

const insightsSchema = z.object({
  isWine: z.boolean().catch(true),
  name: str,
  producer: str,
  vintage: str,
  region: str,
  grape: str,
  rating: str,
  profile: str,
  flavorNotes: strArray,
  pairings: z
    .array(
      z.object({
        recipe: str,
        why: str,
        ingredients: strArray,
        steps: str,
      }),
    )
    .catch([]),
});

export type WineInsights = z.infer<typeof insightsSchema>;

export const analyzeLabel = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ imageDataUrl: z.string() }).parse(input))
  .handler(async ({ data }): Promise<WineInsights> => {
    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const provider = createLovableAiGatewayProvider(apiKey());
    const mediaType = data.imageDataUrl.slice(5, data.imageDataUrl.indexOf(";")) || "image/jpeg";

    const { text } = await generateText({
      model: provider(MODEL),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: [
                "You are an expert sommelier. Look at this photo of a wine bottle / label and reply with JSON only, no prose.",
                "Shape:",
                '{"isWine":boolean,"name":string,"producer":string,"vintage":string,"region":string,"grape":string,',
                '"rating":string,"profile":string,"flavorNotes":string[],',
                '"pairings":[{"recipe":string,"why":string,"ingredients":string[],"steps":string}]}',
                "rating is like '92/100 · Excellent'. profile is one sentence about body, acidity and structure.",
                "flavorNotes: 4-6 one-or-two-word tags. pairings: exactly 3 specific dishes, each with a short reason,",
                "4-7 ingredients and 2-3 sentences of method.",
                "If the photo does not show a wine bottle or label, return {\"isWine\":false} and nothing else.",
                "If the exact wine is unreadable, infer the most likely style from what is visible and still fill the fields.",
              ].join(" "),
            },
            { type: "file" as const, data: data.imageDataUrl, mediaType },
          ],
        },
      ],
    });

    const parsed = insightsSchema.safeParse(salvageJson(text));
    if (!parsed.success) {
      throw new Error("Could not read that label. Try a clearer, closer photo.");
    }
    return parsed.data;
  });

const querySchema = z.object({
  style: str,
  keywords: strArray,
  maxPrice: z.number().nullable().catch(null),
  minPrice: z.number().nullable().catch(null),
  reply: str,
});

export type WineMatch = {
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
  city: string;
  inStock: number;
};

export const searchWines = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ query: z.string() }).parse(input))
  .handler(async ({ data }): Promise<{ reply: string; matches: WineMatch[] }> => {
    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const provider = createLovableAiGatewayProvider(apiKey());

    const { text } = await generateText({
      model: provider(MODEL),
      prompt: [
        "Translate this casual wine request into search parameters. Reply with JSON only, no prose.",
        '{"style":string,"keywords":string[],"maxPrice":number|null,"minPrice":number|null,"reply":string}',
        "style: one of red, white, rose, sparkling, orange, dessert, any.",
        "keywords: 3-8 lowercase terms (grapes, regions, flavor words, food words).",
        "maxPrice/minPrice in dollars, null when not implied.",
        "reply: one friendly sentence from a sommelier introducing the picks.",
        `Request: """${data.query}"""`,
      ].join("\n"),
    });

    const parsedResult = querySchema.safeParse(salvageJson(text));
    const parsed = parsedResult.success
      ? parsedResult.data
      : {
          style: "any",
          keywords: data.query.toLowerCase().split(/\s+/),
          maxPrice: null,
          minPrice: null,
          reply: "Here are bottles on the shelf that fit what you described.",
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

    const scored = bottles.map((b) => {
      const hay =
        `${b.name} ${b.producer} ${b.varietal} ${b.region} ${b.country} ${b.notes} ${b.pairing} ${b.category}`.toLowerCase();
      let score = 0;
      for (const k of kw) if (hay.includes(k)) score += 2;
      if (styleRe && styleRe.test(hay)) score += 3;
      if (parsed.maxPrice != null && b.price <= parsed.maxPrice) score += 2;
      if (parsed.minPrice != null && b.price >= parsed.minPrice) score += 1;
      return { b, score };
    });

    const seen = new Set<string>();
    const matches = scored
      .filter((x) => x.score > 0)
      .sort((a, b) => {
        const cityRank = (slug: string) =>
          shops.find((s) => s.slug === slug)?.city === "sf" ? 0 : 1;
        return cityRank(a.b.shopSlug) - cityRank(b.b.shopSlug);
      })
      .filter((x) => {
        const key = `${x.b.name}|${x.b.producer}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .filter((x) => (parsed.maxPrice == null ? true : x.b.price <= parsed.maxPrice))
      .filter((x) => (parsed.minPrice == null ? true : x.b.price >= parsed.minPrice))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ b }) => {
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
          city: shop.city,
          inStock: 2 + ((b.name.length + b.price) % 9),
        };
      });

    return { reply: parsed.reply, matches };
  });
