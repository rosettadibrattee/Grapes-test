import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Camera,
  Loader2,
  MapPin,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { dishImage } from "@/lib/dish-images";
import { readTasteProfile, tasteHint } from "@/lib/taste-profile";
import {
  sommelierMatch,
  type MatchBottle,
  type SommelierResult,
} from "@/lib/unified-sommelier.functions";


const ASK_PROMPTS = [
  { emoji: "🎉", label: "What should I drink this Friday night?" },
  { emoji: "💘", label: "Going on a date, what should I bring?" },
  { emoji: "💸", label: "Best bottle under $30?" },
  { emoji: "💍", label: "Anniversary dinner — go all out" },
  { emoji: "🍇", label: "I don't know wine — where do I start?" },
];

const PILLS = [
  { label: "🥩 Pairing with a Steak Dinner", query: "Pairing with a steak dinner" },
  { label: "🍕 Casual Pizza Night with Friends", query: "Casual pizza night with friends" },
  { label: "🧀 Cheese Board & Bubbles", query: "Cheese board and bubbles for a small party" },
  { label: "🥗 Light Summer Lunch", query: "Crisp bottle for a light summer lunch" },
];


export function SommelierWorkspace({ initialQuery = "" }: { initialQuery?: string }) {
  const run = useServerFn(sommelierMatch);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(initialQuery);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SommelierResult | null>(null);
  const [wineIdx, setWineIdx] = useState(0);
  const [dishIdx, setDishIdx] = useState(0);
  const [bottlesOnly, setBottlesOnly] = useState(false);
  const autoRan = useRef(false);


  const onFile = async (file?: File | null) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image — try a JPG or PNG of the label.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("That image is over 8MB — try a smaller photo.");
      return;
    }
    const dataUrl = await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
    if (!dataUrl) {
      setError("Couldn't read that photo. Please try again.");
      return;
    }
    setImage(dataUrl);
  };

  const submit = async (
    query: string,
    imageDataUrl: string | null,
    quickPick = false,
  ) => {
    if (!query.trim() && !imageDataUrl) return;
    setBottlesOnly(quickPick);
    setLoading(true);
    setError(null);
    setResult(null);
    setWineIdx(0);
    setDishIdx(0);
    try {
      const res = await run({
        data: { query: query + tasteHint(readTasteProfile()), imageDataUrl },
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRan.current || !initialQuery.trim()) return;
    autoRan.current = true;
    void submit(initialQuery, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const wine = result?.bottles[wineIdx % Math.max(result.bottles.length, 1)];

  const dish = result?.dishes[dishIdx % Math.max(result.dishes.length, 1)];

  return (
    <div>
      {/* Unified input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(q, image);
        }}
        className="rounded-[28px] border border-border bg-card p-4 shadow-md md:p-5"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" strokeWidth={1.9} />
          </div>
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            rows={4}
            placeholder="I'm having spicy Thai beef salad under $50… or scan a label"
            className="min-w-0 flex-1 resize-none bg-transparent p-2 text-base leading-relaxed outline-none placeholder:text-muted-foreground md:text-lg"
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            aria-label="Scan a wine label"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-white transition hover:bg-cream"
          >
            <Camera className="h-5 w-5" strokeWidth={1.9} />
          </button>
          <button
            type="submit"
            disabled={loading || (!q.trim() && !image)}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="hidden sm:inline">Match</span>
          </button>
        </div>

        {image && (
          <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
            <img
              src={image}
              alt="Wine label to scan"
              className="h-14 w-14 rounded-xl object-cover ring-1 ring-border"
            />
            <span className="text-xs text-muted-foreground">Label attached to your prompt</span>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-cream"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        )}
      </form>

      {/* Minimal prompt chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary transition hover:bg-primary/10"
        >
          📷 Scan label
        </button>
        {ASK_PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setQ(p.label);
              void submit(p.label, image, true);
            }}
            className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] text-foreground/70 transition hover:border-primary/20 hover:bg-cream hover:text-foreground"
          >
            {p.emoji} {p.label}
          </button>
        ))}
        {PILLS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setQ(p.query);
              void submit(p.query, image, true);
            }}
            className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] text-foreground/70 transition hover:border-primary/20 hover:bg-cream hover:text-foreground"
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-6 h-72 animate-pulse rounded-3xl bg-muted" />
      )}

      {error && !loading && (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && !loading && bottlesOnly && result.bottles.length > 0 && (
        <div className="mt-6">
          <p className="text-sm leading-relaxed text-foreground/80">{result.reply}</p>
          <div className="mt-4 flex items-center justify-between">
            <h3 className="font-display text-lg tracking-tight">
              {result.bottles.length} bottles for you
            </h3>
            <span className="text-xs text-muted-foreground">Swipe to browse →</span>
          </div>
          <div className="-mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {result.bottles.map((b) => (
              <article
                key={b.slug}
                className="w-[74%] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-white shadow-sm sm:w-auto"
              >
                <div className="aspect-[4/3] bg-cream">
                  <img src={b.image} alt={b.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {b.flag} {b.region} · {b.varietal}
                  </div>
                  <Link
                    to="/bottle/$slug"
                    params={{ slug: b.slug }}
                    className="mt-0.5 block font-display text-base leading-snug tracking-tight hover:underline"
                  >
                    {b.name} {b.vintage}
                  </Link>
                  <Link
                    to="/business/$slug"
                    params={{ slug: b.shopSlug }}
                    className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    <MapPin className="h-3 w-3" /> {b.shopName} · {b.neighborhood}
                  </Link>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {b.inStock > 3 ? "In stock" : "Low stock"} · ${b.price}
                  </div>
                  <Link
                    to="/bottle/$slug"
                    params={{ slug: b.slug }}
                    className="mt-3 flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    Order for delivery
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {result && !loading && !bottlesOnly && wine && dish && (
        <div className="mt-6">
          {result.labelRead && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-xs font-medium">
              <Camera className="h-3.5 w-3.5 text-primary" /> Label read: {result.labelRead}
            </div>
          )}
          <p className="text-sm leading-relaxed text-foreground/80">{result.reply}</p>

          <article className="mt-4 overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/3] bg-cream">
                <img
                  src={wine.image}
                  alt={wine.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                  The bottle
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={dishImage(dish.name)}
                  alt={dish.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                  The plate
                </span>
                <span className="absolute inset-x-3 bottom-3 rounded-xl bg-white/92 px-3 py-2 text-[11px] font-medium text-primary shadow-sm backdrop-blur">
                  {dish.why}
                </span>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {wine.flag} {wine.region} · {wine.varietal}
                </div>
                <Link
                  to="/bottle/$slug"
                  params={{ slug: wine.slug }}
                  className="font-display text-xl tracking-tight hover:underline"
                >
                  {wine.name} {wine.vintage}
                </Link>
                <div className="text-xs text-muted-foreground">{wine.producer}</div>
                <Link
                  to="/business/$slug"
                  params={{ slug: wine.shopSlug }}
                  className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <MapPin className="h-3 w-3" /> {wine.shopName} · {wine.neighborhood}, Lisbon
                </Link>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {wine.inStock > 3 ? "In stock" : "Low stock"} · {wine.inStock} left · ${wine.price}
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium">{dish.name}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{dish.notes}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border p-5 pt-4">
              <Link
                to="/bottle/$slug"
                params={{ slug: wine.slug }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Order for delivery
              </Link>
              <button
                type="button"
                onClick={() => setWineIdx((i) => i + 1)}
                disabled={result.bottles.length < 2}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" /> Swap wine
              </button>
              <button
                type="button"
                onClick={() => setDishIdx((i) => i + 1)}
                disabled={result.dishes.length < 2}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-cream disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" /> Swap plate
              </button>
            </div>
          </article>

          {/* Food pairings */}
          {result.dishes.length > 0 && (
            <section className="mt-5 rounded-3xl border border-border bg-white p-5">
              <h3 className="font-display text-lg tracking-tight">Food pairings</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {result.dishes.map((d) => (
                  <div key={d.name} className="flex gap-3 rounded-2xl border border-border p-3">
                    <img
                      src={dishImage(d.name)}
                      alt={d.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{d.name}</div>
                      <div className="mt-0.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {d.why}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Where to buy */}
          <section className="mt-5 rounded-3xl border border-border bg-white p-5">
            <h3 className="flex items-center gap-2 font-display text-lg tracking-tight">
              <MapPin className="h-4 w-4 text-primary" /> Where to buy nearby
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {Array.from(
                result.bottles
                  .reduce((map, b) => {
                    const cur = map.get(b.shopSlug);
                    if (cur) cur.items.push(b);
                    else map.set(b.shopSlug, { shop: b, items: [b] });
                    return map;
                  }, new Map<string, { shop: MatchBottle; items: MatchBottle[] }>())
                  .values(),
              ).map(({ shop, items }) => (
                <li key={shop.shopSlug}>
                  <Link
                    to="/business/$slug"
                    params={{ slug: shop.shopSlug }}
                    className="flex items-center gap-3 rounded-2xl border border-border p-3 transition hover:bg-cream"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-base">
                      🍇
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{shop.shopName}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {shop.neighborhood}, Lisbon · {items.length} matching bottle
                        {items.length > 1 ? "s" : ""} · from $
                        {Math.min(...items.map((i) => i.price))}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-primary">
                      In stock →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

    </div>
  );
}

export default SommelierWorkspace;
