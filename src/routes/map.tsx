import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { ArrowLeft, Info, MapPin, Search, Star, X } from "lucide-react";
import type { City, Shop } from "@/lib/data";
import { useCatalog } from "@/lib/use-catalog";
import { filterShopsByQuery } from "@/lib/bottle-search";

const ShopMap = lazy(() => import("@/components/shop-map"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Wine map of Lisbon — Grapes partner stores" },
      {
        name: "description",
        content:
          "Full-screen map of Grapes partner wine stores across Chiado, Bairro Alto, Alfama, Príncipe Real and beyond. Tap a pin to see bottles you can reserve.",
      },
      { property: "og:title", content: "Grapes wine map — Lisbon" },
      {
        property: "og:description",
        content: "Explore every Grapes partner store on one full-screen Lisbon map.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FullScreenMapPage,
});

function FullScreenMapPage() {
  const city: City = "sf";
  const { shops, bottles } = useCatalog();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Shop | null>(null);

  const list = useMemo(() => {
    const base = shops.filter((s) => s.city === city);
    const q = query.trim();
    if (!q) return base;
    const { shops: byBottle } = filterShopsByQuery(base, bottles, q);
    const lower = q.toLowerCase();
    const byName = base.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) || s.neighborhood.toLowerCase().includes(lower),
    );
    return [...byBottle, ...byName.filter((s) => !byBottle.includes(s))];
  }, [shops, bottles, query]);

  const selectedBottles = useMemo(
    () =>
      selected ? bottles.filter((b) => b.shopSlug === selected.slug) : [],
    [selected, bottles, query],
  );

  return (
    <div className="fixed inset-0 z-40 bg-[#efe8dc]">
      <Suspense
        fallback={<div className="h-full w-full animate-pulse bg-[#efe8dc]" />}
      >
        <ShopMap
          city={city}
          shops={list}
          selectedSlug={selected?.slug ?? null}
          onSelect={(s) => setSelected(s)}
        />
      </Suspense>

      {/* Floating top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-2xl items-center gap-2">
          <Link
            to="/"
            aria-label="Back home"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/5 bg-white shadow-lg"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div className="flex flex-1 items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2.5 shadow-lg">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the right bottle in Lisbon"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="pointer-events-auto mx-auto mt-2 flex max-w-2xl flex-wrap items-center gap-2">
          <span className="rounded-full border border-black/5 bg-white/90 px-3 py-1 text-[11px] font-semibold text-primary shadow backdrop-blur">
            {list.length} partner stores · Lisbon
          </span>
          <span className="flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-3 py-1 text-[10px] font-semibold shadow backdrop-blur">
            <span className="flex items-center gap-1 text-primary">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-white" /> Wine
              stores
            </span>
            <span className="flex items-center gap-1 text-[#0e7c86]">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-[#0e7c86] bg-white" /> Wine
              bars
            </span>
          </span>
        </div>

      </div>

      {/* Floating always-visible reserve CTA */}
      {!selected && (
        <div className="absolute inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[600] p-4 md:bottom-0">
          <Link
            to="/shops"
            className="mx-auto flex max-w-sm items-center justify-center rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white shadow-2xl transition hover:opacity-90"
          >
            Order a bottle for delivery
          </Link>
        </div>
      )}

      {/* Wine bar — read-only info panel */}
      {selected && selected.kind === "Bar" && (
        <div className="absolute inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[500] p-3 sm:p-4 md:bottom-0">
          <div className="mx-auto flex max-h-[70vh] max-w-2xl flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl">
            <div className="flex items-start gap-3 p-4">
              <img
                src={selected.image}
                alt={selected.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0e7c86]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0e7c86]">
                  <Info className="h-3 w-3" /> Wine bar · info only
                </span>
                <div className="mt-1 font-display text-lg leading-tight">{selected.name}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {selected.address} · {selected.neighborhood}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close wine bar info"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-4 pb-4">
              <p className="text-xs leading-relaxed text-muted-foreground">{selected.blurb}</p>

              {selectedBottles.length > 0 && (
                <>
                  <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Wines they pour
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {selectedBottles.map((b) => (
                      <div key={b.slug} className="select-none">
                        <img
                          src={b.image}
                          alt={b.name}
                          className="aspect-square w-full rounded-xl border border-border object-cover"
                        />
                        <div className="mt-1 truncate text-[11px] font-medium">{b.name}</div>
                        <div className="truncate text-[10px] text-muted-foreground">
                          {b.producer} · {b.vintage}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <p className="mt-4 rounded-2xl bg-[#0e7c86]/5 px-3 py-2 text-[11px] leading-relaxed text-[#0e7c86]">
                Wine bars are listed for discovery only — bottles here can't be reserved or
                delivered.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom store sheet */}
      {selected && selected.kind !== "Bar" && (
        <div className="absolute inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[500] p-3 sm:p-4 md:bottom-0">
          <div className="mx-auto flex max-h-[70vh] max-w-2xl flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl">

            <div className="flex items-start gap-3 p-4">
              <img
                src={selected.image}
                alt={selected.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg leading-tight">{selected.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {selected.neighborhood}
                  <Star className="ml-1 h-3 w-3 fill-current text-[#c99a2e]" /> 4.8
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  🍇 {selected.bottleCount} bottles for delivery
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close store preview"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedBottles.length > 0 && (
              <div className="flex gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {selectedBottles.map((b) => (
                  <Link
                    key={b.slug}
                    to="/bottle/$slug"
                    params={{ slug: b.slug }}
                    className="w-28 shrink-0"
                  >
                    <img
                      src={b.image}
                      alt={b.name}
                      className="h-28 w-28 rounded-xl border border-border object-cover"
                    />
                    <div className="mt-1 truncate text-[11px] font-medium">{b.name}</div>
                    <div className="text-[11px] text-muted-foreground">${b.price}</div>
                  </Link>
                ))}
              </div>
            )}

            <div className="sticky bottom-0 border-t border-black/5 bg-white p-4">
              <Link
                to="/business/$slug"
                params={{ slug: selected.slug }}
                className="flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                View store & order
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
