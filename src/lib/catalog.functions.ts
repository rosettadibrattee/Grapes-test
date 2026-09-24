import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Bottle, BottleCategory, City, Shop } from "@/lib/data";

const FLAGS: Record<string, string> = {
  usa: "🇺🇸",
  "united states": "🇺🇸",
  italy: "🇮🇹",
  italian: "🇮🇹",
  france: "🇫🇷",
  french: "🇫🇷",
  argentina: "🇦🇷",
  spain: "🇪🇸",
  portugal: "🇵🇹",
  germany: "🇩🇪",
  australia: "🇦🇺",
  chile: "🇨🇱",
  "new zealand": "🇳🇿",
};

const CATEGORIES: BottleCategory[] = ["California", "Italian", "French", "Special"];

function toCity(city: string | null): City {
  return "sf";
}

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return { shops: [] as Shop[], bottles: [] as Bottle[] };

  const supabase = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const [storeRes, wineRes] = await Promise.all([
    supabase
      .from("stores")
      .select("id, slug, name, city, neighborhood, address, hours, image, lat, lng")
      .eq("is_active", true),
    supabase
      .from("wines")
      .select(
        "store_id, slug, name, producer, vintage, region, country, varietal, category, price, image, notes, pairing",
      )
      .eq("is_active", true),
  ]);

  if (storeRes.error || wineRes.error) {
    return { shops: [] as Shop[], bottles: [] as Bottle[] };
  }

  const storeById = new Map((storeRes.data ?? []).map((s) => [s.id, s]));

  const bottles: Bottle[] = (wineRes.data ?? [])
    .filter((w) => storeById.has(w.store_id))
    .map((w) => {
      const country = w.country ?? "";
      const category = (CATEGORIES as string[]).includes(w.category ?? "")
        ? (w.category as BottleCategory)
        : "Special";
      return {
        slug: w.slug,
        name: w.name,
        producer: w.producer ?? "",
        region: w.region ?? "",
        country,
        flag: FLAGS[country.toLowerCase()] ?? "🍇",
        varietal: w.varietal ?? "",
        vintage: Number(w.vintage) || 0,
        price: Number(w.price) || 0,
        image: w.image ?? "",
        notes: w.notes ?? "",
        pairing: w.pairing ?? "",
        shopSlug: storeById.get(w.store_id)!.slug,
        category,
      } satisfies Bottle;
    });

  const shops: Shop[] = (storeRes.data ?? []).map((s) => {
    const own = bottles.filter((b) => b.shopSlug === s.slug);
    return {
      slug: s.slug,
      name: s.name,
      city: toCity(s.city),
      neighborhood: s.neighborhood ?? "",
      address: s.address ?? "",
      hours: s.hours ?? "",
      image: s.image ?? "",
      bottleCount: own.length,
      tags: Array.from(new Set(own.map((b) => b.category))),
      blurb: "",
      lat: s.lat ?? 0,
      lng: s.lng ?? 0,
      kind: "Wine",
    } satisfies Shop;
  });

  return { shops, bottles };
});
