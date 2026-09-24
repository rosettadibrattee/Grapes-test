import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { BellRing, Timer } from "lucide-react";
import { getBottle, getShop } from "@/lib/data";
import { StoreInfoCard } from "@/components/store-info-card";

const searchSchema = z.object({
  bottle: z.string(),
  qty: z.number().default(1),
});

export const Route = createFileRoute("/reserve/$id")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ bottle: search.bottle, qty: search.qty }),
  loader: ({ deps, params }) => {
    const bottle = getBottle(deps.bottle);
    if (!bottle) throw notFound();
    return {
      id: params.id,
      qty: deps.qty,
      bottle,
      shop: getShop(bottle.shopSlug)!,
    };
  },
  head: () => ({
    meta: [
      { title: "Reservation confirmed — Grapes" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReservePage,
});

function ReservePage() {
  const { id, qty, bottle, shop } = Route.useLoaderData();
  const total = qty * bottle.price;
  const deliveryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "short", day: "numeric" },
  );

  return (
    <div className="container-page py-16 max-w-2xl">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-accent/20 text-primary text-2xl">
          ✓
        </div>
        <h1 className="mt-6 font-display text-5xl">You're set.</h1>
        <p className="mt-3 text-muted-foreground">
          Reservation <span className="font-mono text-foreground">#{id}</span> confirmed.
          Your bottles are on their way to your address.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Order received — preparing for delivery
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/20 bg-secondary p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Timer className="h-4 w-4 text-primary" /> Est. delivery in 60–90 minutes
        </div>
        <p className="mt-1.5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <BellRing className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          You will receive a confirmation message when your bottle is packed and the courier is
          on the way.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex gap-5 p-6">
          <img
            src={bottle.image}
            alt={bottle.name}
            width={200}
            height={250}
            className="h-32 w-24 object-cover rounded-md"
          />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {bottle.flag} {bottle.region}
            </div>
            <div className="font-display text-2xl mt-1">
              {bottle.name} {bottle.vintage}
            </div>
            <div className="text-sm text-muted-foreground">{bottle.producer}</div>
            <div className="mt-3 text-sm">
              Quantity: <span className="font-medium">{qty}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="font-display text-3xl">${total}</div>
            <div className="text-xs text-muted-foreground">Delivery included</div>
          </div>
        </div>
        <div className="border-t border-border p-6 grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Delivered from
            </div>
            <div className="mt-1 font-medium">{shop.name}</div>
            <div className="text-muted-foreground">{shop.address}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Delivery by
            </div>
            <div className="mt-1 font-medium">{deliveryDate}</div>
            <div className="text-muted-foreground">Cancel free before dispatch.</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <StoreInfoCard shop={shop} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/business/$slug"
          params={{ slug: shop.slug }}
          className="rounded-full border border-border px-5 py-2.5 text-sm hover:bg-secondary transition"
        >
          Back to {shop.name}
        </Link>
        <Link
          to="/shops"
          className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm hover:opacity-90 transition"
        >
          Find another bottle
        </Link>
      </div>
    </div>
  );
}
