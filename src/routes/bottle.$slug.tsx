import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { getBottle, getShop, type Shop } from "@/lib/data";
import { bottleRating, bottleReviews, pairingDishes } from "@/lib/reviews";
import { dishImage } from "@/lib/dish-images";
import { ReserveModal } from "@/components/reserve-modal";
import { useReservations } from "@/lib/reservations";

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i <= Math.round(value) ? "fill-gold text-gold" : "text-border"}
        />
      ))}
    </div>
  );
}

export const Route = createFileRoute("/bottle/$slug")({
  loader: ({ params }) => {
    const bottle = getBottle(params.slug);
    if (!bottle) throw notFound();
    return { bottle, shop: getShop(bottle.shopSlug)! };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Bottle not found — Grapes" }, { name: "robots", content: "noindex" }] };
    }
    const { bottle } = loaderData;
    return {
      meta: [
        { title: `${bottle.name} ${bottle.vintage} — Grapes` },
        { name: "description", content: bottle.notes },
        { property: "og:title", content: `${bottle.name} ${bottle.vintage} — Grapes` },
        { property: "og:description", content: bottle.notes },
        { property: "og:image", content: bottle.image },
        { name: "twitter:image", content: bottle.image },
      ],
    };
  },
  component: BottlePage,
});

function BottlePage() {
  const { bottle, shop } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [reserving, setReserving] = useState(false);
  const { addReservation } = useReservations();
  const rating = bottleRating(bottle.slug);
  const reviews = bottleReviews(bottle.slug);
  const dishes = pairingDishes(bottle.pairing);

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setReserving(true);
  };

  return (
    <div className="container-page py-12 pb-32 md:py-16 md:pb-16">
      <Link
        to="/business/$slug"
        params={{ slug: shop.slug }}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        ← {shop.name}
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-xl overflow-hidden bg-muted">
          <img
            src={bottle.image}
            alt={bottle.name}
            width={800}
            height={1000}
            className="w-full h-auto object-cover"
          />
        </div>

        <div>
          <div className="chip">
            {bottle.flag} {bottle.country} · {bottle.region}
          </div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl leading-none">
            {bottle.name}
          </h1>
          <div className="mt-2 text-muted-foreground text-lg">
            {bottle.producer} · {bottle.vintage}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Stars value={rating.score} size={16} />
            <span className="text-sm font-semibold">{rating.score.toFixed(1)}/5</span>
            <span className="text-xs text-muted-foreground">({rating.count} reviews)</span>
          </div>


          <div className="mt-8 grid grid-cols-2 gap-6 max-w-md">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Varietal
              </div>
              <div className="mt-1 text-sm">{bottle.varietal}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Vintage
              </div>
              <div className="mt-1 text-sm">{bottle.vintage}</div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Tasting notes
            </div>
            <p className="mt-2 leading-relaxed text-foreground/85">{bottle.notes}</p>
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Pair with
            </div>
            <p className="mt-2 leading-relaxed text-foreground/85">{bottle.pairing}</p>
          </div>

          {/* Reserve card */}
          <form
            onSubmit={handleReserve}
            className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Price / bottle
                </div>
                <div className="font-display text-4xl mt-1">${bottle.price}</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Reserving at
                </div>
                <Link
                  to="/business/$slug"
                  params={{ slug: shop.slug }}
                  className="font-medium hover:text-primary"
                >
                  {shop.name}
                </Link>
                <div className="text-xs text-muted-foreground">{shop.neighborhood}</div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 hover:bg-secondary rounded-l-full"
                >
                  −
                </button>
                <div className="w-10 text-center text-sm">{qty}</div>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(12, q + 1))}
                  className="h-9 w-9 hover:bg-secondary rounded-r-full"
                >
                  +
                </button>
              </div>
              <div className="text-sm text-muted-foreground">
                Delivery only · Pay by card on delivery
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 hidden w-full rounded-full bg-primary text-primary-foreground py-3 font-medium hover:opacity-90 transition md:block"
            >
              Reserve {qty} bottle{qty > 1 ? "s" : ""} · ${bottle.price * qty}
            </button>

            <p className="mt-3 text-xs text-muted-foreground text-center">
              Home delivery in 60–90 min. Cancel free before dispatch.
            </p>
          </form>
        </div>
      </div>

      {/* Food pairings */}
      <section className="mt-16">
        <div className="chip">Food pairings</div>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          🍽️ Perfect with…
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {dishes.map((dish) => (
            <div
              key={dish}
              className="overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-sm"
            >
              <img
                src={dishImage(dish)}
                alt={dish}
                loading="lazy"
                className="h-28 w-full bg-muted object-cover"
              />
              <div className="p-3">
                <div className="text-sm font-medium capitalize leading-snug">{dish}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Great match for {bottle.varietal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-16">
        <div className="chip">Reviews</div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            ⭐ {rating.score.toFixed(1)}/5
          </h2>
          <div>
            <Stars value={rating.score} size={16} />
            <div className="mt-1 text-xs text-muted-foreground">
              Based on {rating.count} Grapes customers
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-xs font-semibold text-primary">
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.date}</div>
                </div>
              </div>
              <div className="mt-3">
                <Stars value={r.stars} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky mobile reserve bar */}
      <div className="fixed inset-x-0 bottom-16 z-[60] border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="font-display text-xl leading-none">${bottle.price * qty}</div>
          </div>
          <button
            type="button"
            onClick={() => setReserving(true)}
            className="ml-auto flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Reserve {qty} bottle{qty > 1 ? "s" : ""}
          </button>
        </div>
      </div>


      <ReserveModal
        bottle={reserving ? bottle : null}
        shop={shop as Shop}
        onClose={() => setReserving(false)}
        onConfirm={(modalQty) => {
          const created = addReservation(bottle.slug, shop.slug, modalQty);
          toast.success("Order sent", { description: `${bottle.name} · #${created.id}` });
          return created.id;
        }}
      />
    </div>
  );
}
