import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { bottles as allBottles, shops } from "@/lib/data";

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

const dishSchema = z.object({
  dishes: z
    .array(
      z.object({
        name: str,
        why: str,
        ingredients: strArray,
        difficulty: str,
        timeMinutes: z.number().catch(30),
        steps: str,
      }),
    )
    .catch([]),
});

export type PairedDish = z.infer<typeof dishSchema>["dishes"][number];

export const dishesForBottle = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string(),
        producer: z.string().optional(),
        varietal: z.string().optional(),
        region: z.string().optional(),
        vintage: z.union([z.string(), z.number()]).optional(),
        notes: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ dishes: PairedDish[] }> => {
    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const provider = createLovableAiGatewayProvider(apiKey());

    const { text } = await generateText({
      model: provider(MODEL),
      prompt: [
        "You are an expert sommelier and chef. Suggest 4 home-cookable dishes that pair with this wine.",
        "Reply with JSON only, no prose.",
        '{"dishes":[{"name":string,"why":string,"ingredients":string[],"difficulty":"Easy"|"Medium"|"Hard","timeMinutes":number,"steps":string}]}',
        "why: one sentence naming the specific structural reason (acidity, tannin, body, sweetness) — e.g. \"The high acidity in this Sangiovese cuts through the richness of the duck ragù\".",
        "ingredients: 5-8 items. steps: 2-3 sentences of method. Exactly 4 dishes, all different cuisines or proteins.",
        `Wine: ${data.name} ${data.vintage ?? ""} — ${data.producer ?? ""}, ${data.varietal ?? ""}, ${data.region ?? ""}. Notes: ${data.notes ?? ""}`,
      ].join("\n"),
    });

    const parsed = dishSchema.safeParse(salvageJson(text));
    if (!parsed.success || parsed.data.dishes.length === 0) {
      throw new Error("Couldn't build pairings for that bottle. Please try again.");
    }
    return { dishes: parsed.data.dishes.slice(0, 4) };
  });

const dishQuerySchema = z.object({
  keywords: strArray,
  style: str,
  reply: str,
});

export type DishMatch = {
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
  why: string;
};

export const bottlesForDish = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ dish: z.string(), shopSlug: z.string().nullable().optional() }).parse(input),
  )
  .handler(async ({ data }): Promise<{ reply: string; matches: DishMatch[] }> => {
    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const provider = createLovableAiGatewayProvider(apiKey());

    const { text } = await generateText({
      model: provider(MODEL),
      prompt: [
        "A guest is cooking a dish and wants a wine pairing. Reply with JSON only, no prose.",
        '{"style":string,"keywords":string[],"reply":string}',
        "style: one of red, white, rose, sparkling, orange, dessert, any.",
        "keywords: 4-8 lowercase grape, region or flavor terms that would pair well.",
        "reply: one sentence explaining the pairing logic (acidity, tannin, body).",
        `Dish: """${data.dish}"""`,
      ].join("\n"),
    });

    const parsedResult = dishQuerySchema.safeParse(salvageJson(text));
    const parsed = parsedResult.success
      ? parsedResult.data
      : {
          style: "any",
          keywords: data.dish.toLowerCase().split(/\s+/),
          reply: "Here are bottles that should work well with that dish.",
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

    const pool = data.shopSlug
      ? allBottles.filter((b) => b.shopSlug === data.shopSlug)
      : allBottles;

    const seen = new Set<string>();
    const matches = pool
      .map((b) => {
        const hay =
          `${b.name} ${b.producer} ${b.varietal} ${b.region} ${b.country} ${b.notes} ${b.pairing} ${b.category}`.toLowerCase();
        let score = 0;
        for (const k of kw) if (hay.includes(k)) score += 2;
        if (styleRe && styleRe.test(hay)) score += 3;
        return { b, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .filter((x) => {
        const key = data.shopSlug ? x.b.slug : `${x.b.name}|${x.b.producer}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 4)
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
          why: parsed.reply,
        };
      });

    return { reply: parsed.reply, matches };
  });
