import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useRef, useState, useEffect } from "react";
import { type City, type Shop, type Bottle } from "@/lib/data";
import { useCatalog } from "@/lib/use-catalog";
import { filterBottles, filterShopsByQuery } from "@/lib/bottle-search";
import { ArrowRight, MapPin, Maximize2, Search, Star, X } from "lucide-react";


const ShopMap = lazy(() => import("@/components/shop-map"));

export const Route = createFileRoute("/shops")({
  head: () => ({
    meta: [
      { title: "Discover wine stores — Grapes partner shops in Lisbon" },
      {
        name: "description",
        content:
          "Explore Grapes' partner wine shops across Lisbon. Reserve bottles from +50 curated local venues.",
      },
      { property: "og:title", content: "Grapes partner shops — Lisbon" },
      {
        property: "og:description",
        content: "+50 partner wine, spirits and bar venues live on the Grapes map.",
      },
    ],
  }),
  component: ShopsPage,
});

// Deterministic mock rating/distance per shop
function ratingFor(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const rating = (4.5 + ((h % 50) / 100)).toFixed(1); // 4.50 - 4.99
  const reviews = 80 + (h % 420);
  const distance = (0.2 + ((h % 45) / 10)).toFixed(1); // 0.2 - 4.6 mi
  return { rating, reviews, distance };
}

function ShopsPage() {
  const city: City = "sf";
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<Shop | null>(null);
  const [query, setQuery] = useState("");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { shops, bottles } = useCatalog();

  const { list, matchCount } = useMemo(() => {
    const base = shops.filter((s) => s.city === city);
    const q = query.trim();
    if (!q) return { list: base, matchCount: {} as Record<string, number> };
    const { shops: byBottle, matchCount } = filterShopsByQuery(base, bottles, q);
    const lower = q.toLowerCase();
    const byName = base.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.neighborhood.toLowerCase().includes(lower) ||
        s.tags.some((t) => t.toLowerCase().includes(lower)),
    );
    const merged = [...byBottle, ...byName.filter((s) => !byBottle.includes(s))];
    return { list: merged, matchCount };
  }, [city, query, shops, bottles]);

  const previewBottles = useMemo(
    () =>
      preview
        ? filterBottles(
            bottles.filter((b) => b.shopSlug === preview.slug),
            query,
          ).slice(0, 6)
        : [],
    [preview, bottles, query],
  );

  const totalBottles = list.reduce((s, x) => s + x.bottleCount, 0);


  useEffect(() => {
    if (!selected) return;
    const el = cardRefs.current[selected];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selected]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container-page pt-8 pb-4">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-widest text-primary">
            <MapPin className="mr-1 inline h-3 w-3" /> Partner venues
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Discover Lisbon wine stores
          </h1>
          <p className="text-sm text-muted-foreground">
            {query.trim()
              ? `${list.length} venues stock a match for “${query.trim()}”.`
              : `Find ${list.length} partner venues · ${totalBottles.toLocaleString()} bottles reservable now.`}

          </p>
        </div>

        {/* Search bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-white px-5 py-2 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the right bottle in Lisbon"
              className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Mini preview map with full-map expand */}
      <div className="container-page">
        <div className="flex items-end justify-between gap-4 pb-2">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
              Wine stores near you
            </h2>
            <p className="text-xs text-muted-foreground">
              {list.length} shops · {totalBottles.toLocaleString()} bottles in stock
            </p>
          </div>
          <Link
            to="/map"
            className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary transition hover:opacity-80"
          >
            Full map <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm ring-1 ring-black/5">
          <div className="h-[200px] md:h-[260px] w-full">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-secondary/40 text-sm text-muted-foreground">
                  Loading map…
                </div>
              }
            >
              <ShopMap
                city={city}
                shops={list}
                selectedSlug={selected}
                onSelect={(s) => {
                  setSelected(s.slug);
                  setPreview(s);
                }}
              />
            </Suspense>
          </div>

          <Link
            to="/map"
            aria-label="View full map"
            className="absolute right-3 top-3 z-[500] inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/95 px-3 py-2 text-[11px] font-semibold text-primary shadow-lg backdrop-blur transition hover:bg-white"
          >
            <Maximize2 className="h-3.5 w-3.5" /> View full map
          </Link>
        </div>
      </div>


      {/* Stores grid below map */}
      <section className="container-page py-10">
        <div className="flex items-end justify-between gap-4 pb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              All partner stores

            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a card to view live inventory and reserve a bottle.
            </p>
          </div>
          <div className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:block">
            {list.length} venues
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {list.map((s) => (
            <StoreCard
              key={s.slug}
              shop={s}
              highlighted={selected === s.slug}
              setRef={(el) => {
                cardRefs.current[s.slug] = el;
              }}
              onHover={() => setSelected(s.slug)}
            />
          ))}
          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-white/60 p-10 text-center text-sm text-muted-foreground">
              No stores match "{query}" in Lisbon.
            </div>
          )}
        </div>
      </section>

      {preview && (
        <StorePreviewSheet
          shop={preview}
          bottles={previewBottles}
          matches={matchCount[preview.slug]}
          onClose={() => setPreview(null)}
        />
      )}
    </div>

  );
}

type StoreCardProps = {
  shop: Shop;
  highlighted: boolean;
  onHover: () => void;
  setRef: (el: HTMLDivElement | null) => void;
};

function StoreCard({ shop, highlighted, onHover, setRef }: StoreCardProps) {
  const { rating, reviews, distance } = ratingFor(shop.slug);
  return (
    <div ref={setRef} onMouseEnter={onHover}>
      <Link
        to="/business/$slug"
        params={{ slug: shop.slug }}
        className={
          "group flex items-center gap-3 overflow-hidden rounded-2xl border bg-white p-2.5 transition " +
          (highlighted
            ? "border-primary shadow-md ring-1 ring-primary/20"
            : "border-border hover:border-primary/20 hover:shadow-sm")
        }
      >
        <img
          src={shop.image}
          alt={shop.name}
          className="h-16 w-16 shrink-0 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold tracking-tight">
            {shop.name}
          </h3>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            📍 {shop.neighborhood} · {distance} mi
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#e8b84a] text-[#e8b84a]" />
              <span className="font-semibold">{rating}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              🍷 <span className="font-medium text-foreground">{shop.bottleCount}</span> bottles
            </span>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-primary/20 px-3 py-1.5 text-[11px] font-semibold text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
          View
        </span>
      </Link>
    </div>
  );
}



function StorePreviewSheet({
  shop,
  bottles,
  matches,
  onClose,
}: {
  shop: Shop;
  bottles: Bottle[];
  matches?: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close store preview"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-border bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <img
            src={shop.image}
            alt={shop.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-lg font-semibold">{shop.name}</div>
            <div className="text-xs text-muted-foreground">
              {shop.neighborhood} ·{" "}
              {matches != null ? `${matches} matching bottles` : `${shop.bottleCount} bottles`}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[45vh] overflow-y-auto p-4">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Available now
          </div>
          <ul className="mt-3 flex flex-col gap-3">
            {bottles.map((b) => (
              <li key={b.slug}>
                <Link
                  to="/bottle/$slug"
                  params={{ slug: b.slug }}
                  className="flex items-center gap-3 rounded-2xl border border-border p-2 transition hover:bg-cream"
                >
                  <img src={b.image} alt={b.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {b.name} {b.vintage}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {b.flag} {b.region} · {b.varietal}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary">${b.price}</div>
                </Link>
              </li>
            ))}
            {bottles.length === 0 && (
              <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No bottles to preview here yet.
              </li>
            )}
          </ul>
        </div>

        <div className="border-t border-border p-4">
          <Link
            to="/business/$slug"
            params={{ slug: shop.slug }}
            className="block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
          >
            View full inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
