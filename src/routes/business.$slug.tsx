import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Plus, Minus, Sparkles, Send, Star } from "lucide-react";
import { toast } from "sonner";
import { getShop, getBottlesForShop, type Bottle, type BottleCategory, type Shop } from "@/lib/data";
import { getCatalog } from "@/lib/catalog.functions";
import { useReservations } from "@/lib/reservations";
import { ReserveModal } from "@/components/reserve-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoreInfoCard } from "@/components/store-info-card";
import { HappyHourBuilder } from "@/components/happy-hour-builder";
import { bottleRating } from "@/lib/reviews";





const CATEGORY_ORDER: BottleCategory[] = ["California", "Italian", "French", "Special"];
const CATEGORY_LABEL: Record<BottleCategory, string> = {
  California: "California Wine",
  Italian: "Italian Wine",
  French: "French Wine",
  Special: "Special Wine",
};
const CATEGORY_FLAG: Record<BottleCategory, string> = {
  California: "🇺🇸",
  Italian: "🇮🇹",
  French: "🇫🇷",
  Special: "✨",
};

type SommelierPrompt = { label: string; response: (bottles: Bottle[]) => Bottle[] };
const QUICK_PROMPTS: SommelierPrompt[] = [
  {
    label: "Full-bodied red under $30",
    response: (b) =>
      b
        .filter((x) => x.price < 30 && /red|cabernet|syrah|zinfandel|nebbiolo|sangiovese|malbec|merlot|barolo|chianti|rhône|rhone/i.test(`${x.varietal} ${x.notes}`))
        .slice(0, 3),
  },
  {
    label: "Crisp white for oysters",
    response: (b) =>
      b
        .filter((x) => /white|chardonnay|sauvignon|riesling|pinot grigio|albariño|chenin/i.test(`${x.varietal} ${x.notes}`))
        .slice(0, 3),
  },
  {
    label: "Something for a celebration",
    response: (b) => b.filter((x) => x.category === "Special").slice(0, 3),
  },
  {
    label: "Best for pasta night",
    response: (b) => b.filter((x) => x.category === "Italian").slice(0, 3),
  },
];

function sommelierMatch(query: string, bottles: Bottle[]): Bottle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const priceMatch = q.match(/under\s*\$?(\d+)/);
  const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : Infinity;
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  const scored = bottles.map((b) => {
    const hay = `${b.name} ${b.producer} ${b.varietal} ${b.region} ${b.notes} ${b.pairing} ${b.category}`.toLowerCase();
    let score = 0;
    for (const t of tokens) if (hay.includes(t)) score += 2;
    if (b.price <= maxPrice) score += 1;
    return { b, score };
  });
  return scored
    .filter((x) => x.score > 0 && x.b.price <= maxPrice)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.b);
}


export const Route = createFileRoute("/business/$slug")({
  loader: async ({ params }) => {
    const catalog = await getCatalog({}).catch(() => null);
    const dbShop = catalog?.shops.find((s) => s.slug === params.slug);
    if (dbShop) {
      return {
        shop: dbShop,
        bottles: catalog!.bottles.filter((b) => b.shopSlug === dbShop.slug),
      };
    }
    const shop = getShop(params.slug);
    if (!shop) throw notFound();
    return { shop, bottles: getBottlesForShop(shop.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Shop not found — Grapes" }, { name: "robots", content: "noindex" }] };
    }
    const { shop } = loaderData;
    return {
      meta: [
        { title: `${shop.name} · ${shop.neighborhood} — Grapes` },
        { name: "description", content: shop.blurb },
        { property: "og:title", content: `${shop.name} — Grapes` },
        { property: "og:description", content: shop.blurb },
        { property: "og:image", content: shop.image },
        { name: "twitter:image", content: shop.image },
      ],
    };
  },
  component: BusinessPage,
});

function BusinessPage() {
  const { shop, bottles: allBottles } = Route.useLoaderData();
  const bottles = allBottles as Bottle[];
  const { addReservation, getReservation, updateQty, removeReservation } = useReservations();
  const categoryCounts = useMemo(() => {
    const map = new Map<BottleCategory, number>();
    for (const b of bottles) map.set(b.category, (map.get(b.category) ?? 0) + 1);
    return CATEGORY_ORDER.map((c) => ({ category: c, count: map.get(c) ?? 0 })).filter((x) => x.count > 0);
  }, [bottles]);
  const [filter, setFilter] = useState<BottleCategory | "all">("all");
  
  const [reserving, setReserving] = useState<Bottle | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderBottle, setBuilderBottle] = useState<Bottle | null>(null);
  const openBuilder = (b: Bottle | null) => {
    setBuilderBottle(b);
    setBuilderOpen(true);
  };
  const [aiOpen, setAiOpen] = useState(false);


  const grouped = useMemo(() => {
    const src = filter === "all" ? bottles : bottles.filter((b) => b.category === filter);
    const byCat = new Map<BottleCategory, Bottle[]>();
    for (const b of src) {
      const arr = byCat.get(b.category) ?? [];
      arr.push(b);
      byCat.set(b.category, arr);
    }
    return CATEGORY_ORDER.filter((c) => byCat.has(c)).map((c) => ({
      category: c,
      items: byCat.get(c)!,
    }));
  }, [bottles, filter]);


  return (
    <>
      <section className="relative">
        <div className="aspect-[21/9] w-full overflow-hidden bg-muted">
          <img
            src={shop.image}
            alt={shop.name}
            width={1600}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container-page -mt-14 relative">
          <div className="rounded-3xl bg-card border border-border p-5 md:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  🍇 Wine shop · {shop.neighborhood}
                </div>
                <h1 className="mt-1.5 font-display text-3xl md:text-5xl font-semibold tracking-tight">
                  {shop.name}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setAiOpen(true)}
                aria-label="Open AI wine assistant"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" /> AI
              </button>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-foreground/80 leading-relaxed">{shop.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-cream px-3 py-1.5">📍 {shop.address}</span>
              <span className="rounded-full bg-cream px-3 py-1.5">⏰ {shop.hours}</span>
              <span className="rounded-full bg-cream px-3 py-1.5">
                🍷 {shop.bottleCount.toLocaleString()} bottles in stock
              </span>
            </div>
          </div>
        </div>
      </section>



      <section className="container-page pt-10">
        <button
          type="button"
          onClick={() => openBuilder(null)}
          className="flex w-full items-center gap-4 rounded-3xl border border-primary/20 bg-gradient-to-r from-[#4A121A] to-[#320D14] p-5 text-left text-white transition hover:opacity-95"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15 text-xl">🍷</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-widest text-white/70">
              Featured · Pay by card on delivery
            </span>
            <span className="block font-display text-2xl leading-tight">
              Build a Mystery Happy Hour Bag 🍷+🧀
            </span>
            <span className="mt-1 block text-sm text-white/80">
              Pick a budget €15–€50, add cheese boards, croquettes, pastéis de nata and more.
            </span>
          </span>
          <span className="hidden shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold sm:block">
            Start building
          </span>
        </button>
      </section>

      <section className="container-page py-10">

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="chip">Available now</div>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold tracking-tight">
              🍾 Reserve Bottle or Build Happy Hour Bag
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Order a bottle on its own, or turn it into an aperitivo bag with food. Delivery only — pay by card on arrival.
            </p>
          </div>

        </div>

        {categoryCounts.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                filter === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white/70 text-foreground/80 hover:bg-white"
              }`}
            >
              All · {bottles.length}
            </button>
            {categoryCounts.map((c) => (
              <button
                key={c.category}
                type="button"
                onClick={() => setFilter(c.category)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  filter === c.category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white/70 text-foreground/80 hover:bg-white"
                }`}
              >
                {CATEGORY_FLAG[c.category]} {CATEGORY_LABEL[c.category]} · {c.count}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 space-y-10">
          {grouped.map((group) => (
            <div key={group.category}>
              <div className="flex items-baseline justify-between border-b border-border pb-2">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {CATEGORY_FLAG[group.category]} {CATEGORY_LABEL[group.category]}
                </h3>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {group.items.length} bottles
                </span>
              </div>
              <div className="mt-4 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {group.items.map((b) => {
                  const r = getReservation(b.slug);
                  const rating = bottleRating(b.slug);
                  return (
                    <div
                      key={b.slug}
                      className="flex w-full items-center gap-3 p-3 transition hover:bg-cream/60 sm:gap-4 sm:p-4"
                    >
                      <Link
                        to="/bottle/$slug"
                        params={{ slug: b.slug }}
                        className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
                      >
                        <img
                          src={b.image}
                          alt={b.name}
                          loading="lazy"
                          className="h-20 w-16 shrink-0 rounded-xl bg-muted object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {b.flag} {b.region} · {b.vintage}
                          </div>
                          <div className="mt-0.5 truncate font-display text-base font-semibold leading-tight">
                            {b.name}
                          </div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground">
                            {b.producer} · {b.varietal}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Star className="h-3 w-3 fill-gold text-gold" />
                            <span className="font-semibold text-foreground">
                              {rating.score.toFixed(1)}
                            </span>
                            ({rating.count})
                          </div>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:line-clamp-2">
                            {b.notes}
                          </p>
                        </div>
                      </Link>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="text-base font-semibold">
                          ${r ? (b.price * r.qty).toFixed(0) : b.price}
                        </span>
                        {r ? (
                          <div className="inline-flex items-center overflow-hidden rounded-full border border-primary/20 bg-white">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => {
                                if (r.qty <= 1) {
                                  removeReservation(r.id);
                                  toast("Removed from Bucket", { description: b.name });
                                } else {
                                  updateQty(r.id, r.qty - 1);
                                }
                              }}
                              className="grid h-7 w-7 place-items-center text-primary hover:bg-primary/10"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-primary">
                              {r.qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQty(r.id, r.qty + 1)}
                              className="grid h-7 w-7 place-items-center text-primary hover:bg-primary/10"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setReserving(b)}
                            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                          >
                            Reserve bottle
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openBuilder(b)}
                          className="rounded-full border border-primary px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                        >
                          Turn into Mystery Bag 🍷+🧀
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}


          {bottles.length === 0 && (
            <div className="text-muted-foreground">No inventory synced yet. Check back soon.</div>
          )}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-6 md:grid-cols-[1fr_360px] md:items-start">
          <div>
            <div className="chip">Delivery</div>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              How delivery works
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Delivery only — pay by card in person when the courier arrives. We message you
              the moment it's packaged and ready.
            </p>
          </div>
          <StoreInfoCard shop={shop as Shop} />
        </div>
      </section>

      <HappyHourBuilder
        open={builderOpen}
        bottle={builderBottle}
        shopSlug={shop.slug}
        shopName={shop.name}
        onClose={() => setBuilderOpen(false)}
      />

      <ReserveModal
        bottle={reserving}
        shop={shop as Shop}
        onClose={() => setReserving(null)}
        onConfirm={(qty) => {
          const created = addReservation(reserving!.slug, shop.slug, qty);
          toast.success("Order sent", { description: `${reserving!.name} · #${created.id}` });
          return created.id;
        }}
      />

      {/* Compact floating AI assistant */}
      <button
        type="button"
        onClick={() => setAiOpen(true)}
        aria-label="Ask the AI wine assistant"
        className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:opacity-90 md:bottom-6"
      >
        <Sparkles className="h-5 w-5" />
      </button>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">🍇 AI wine assistant</DialogTitle>
          </DialogHeader>
          <AiWineAssistant bottles={bottles} shopName={shop.name} />
        </DialogContent>
      </Dialog>
    </>
  );
}


function AiWineAssistant({ bottles, shopName }: { bottles: Bottle[]; shopName: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Bottle[] | null>(null);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const { addReservation, getReservation } = useReservations();

  const runQuery = (q: string) => {
    const matches = sommelierMatch(q, bottles);
    setResults(matches);
    setActivePrompt(null);
  };

  const runPrompt = (p: SommelierPrompt) => {
    setResults(p.response(bottles));
    setActivePrompt(p.label);
    setQuery("");
  };

  return (
    <div>
      <div>
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>Describe a taste, pairing, price, or occasion — we'll suggest bottles from {shopName}.</span>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) runQuery(query);
          }}
          className="mt-4 flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/30"
        >

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find me a full-bodied red under $30"
            className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            disabled={!query.trim()}
          >
            <Send className="h-3.5 w-3.5" /> Ask
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => runPrompt(p)}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                activePrompt === p.label
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/20 bg-white/70 text-primary hover:bg-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {results !== null && (
          <div className="mt-6">
            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary/20 bg-white/60 p-6 text-center text-sm text-muted-foreground">
                No bottles matched — try a different pairing, price, or style.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {results.map((b) => {
                  const reserved = !!getReservation(b.slug);
                  return (
                    <div key={b.slug} className="flex gap-3 rounded-2xl border border-border bg-white p-3">
                      <Link to="/bottle/$slug" params={{ slug: b.slug }} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img src={b.image} alt={b.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-display text-sm font-semibold">{b.name}</div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {b.flag} {b.varietal} · ${b.price}
                        </div>
                        <button
                          type="button"
                          disabled={reserved}
                          onClick={() => {
                            const r = addReservation(b.slug, b.shopSlug, 1);
                            toast.success("Reserved in Bucket", { description: `${b.name} · #${r.id}` });
                          }}
                          className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-white transition hover:opacity-90 disabled:bg-primary/20 disabled:text-primary"
                        >
                          {reserved ? (<><Check className="h-3 w-3" /> Reserved</>) : "Reserve"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>

  );
}
