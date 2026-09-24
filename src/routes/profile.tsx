import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, CheckCircle2, Package, ShoppingBag, X, QrCode } from "lucide-react";
import { bottles, shops, getBottle, getShop } from "@/lib/data";
import { useReservations, qrUrl, type ReservationStatus } from "@/lib/reservations";
import { useSavedPairs } from "@/lib/saved-pairs";
import { ChefHat, Trash2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Grapes" },
      { name: "description", content: "Track your Grapes reservations, saved bottles and favorite shops." },
      { property: "og:title", content: "Your profile — Grapes" },
      { property: "og:description", content: "Reservations, saved bottles, favorite shops." },
    ],
  }),
  component: Profile,
});

const STATUS_STEPS: ReservationStatus[] = ["Order Received", "Preparing Bottle", "Out for Delivery"];
const STATUS_ICON = {
  "Order Received": CheckCircle2,
  "Preparing Bottle": Package,
  "Out for Delivery": ShoppingBag,
} as const;

function StatusTracker({ status }: { status: ReservationStatus }) {
  const activeIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="mt-4 flex items-center">
      {STATUS_STEPS.map((s, i) => {
        const Icon = STATUS_ICON[s];
        const active = i <= activeIdx;
        return (
          <div key={s} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full border-2 transition ${
                  active
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-border text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div
                className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-center ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {s}
              </div>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 -mt-6 ${i < activeIdx ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const TIERS = [
  { name: "Sipper", min: 0 },
  { name: "Enthusiast", min: 50 },
  { name: "Connoisseur", min: 150 },
  { name: "Cellar Master", min: 300 },
];

function RewardsCard({ bottleCount }: { bottleCount: number }) {
  const points = 20 + bottleCount * 25;
  const tierIdx = Math.max(0, TIERS.findIndex((t, i) => points >= t.min && (!TIERS[i + 1] || points < TIERS[i + 1].min)));
  const tier = TIERS[tierIdx];
  const next = TIERS[tierIdx + 1];
  const progress = next
    ? Math.min(100, ((points - tier.min) / (next.min - tier.min)) * 100)
    : 100;

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#4A121A] to-[#320D14] p-6 text-white shadow-sm">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
            Grapes Rewards
          </div>
          <div className="mt-1 font-display text-3xl leading-none">{points} pts</div>
          <div className="mt-1 text-sm text-white/80">{tier.name} level</div>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl">
          🍇
        </span>
      </div>

      <div className="mt-5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-white/70">
          <span>{tier.name}</span>
          <span>
            {next ? `${Math.max(0, next.min - points)} pts to ${next.name}` : "Top level unlocked"}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-white/80">
        Più bottiglie prenoti, più punti accumuli per sbloccare vantaggi — the more bottles you
        reserve, the more points you earn to unlock perks like free tastings and partner discounts.
      </p>
    </section>
  );
}

function Profile() {

  const { reservations, removeReservation } = useReservations();
  const { pairs, removePair } = useSavedPairs();
  const [tab, setTab] = useState<"orders" | "pairings" | "saved" | "shops">("orders");
  const savedBottles = bottles.slice(0, 3);
  const favoriteShops = shops.slice(0, 2);

  return (
    <div className="container-page py-16">
      <div className="flex items-center gap-5">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground text-xl font-display">
          Y
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Level 2 Enthusiast · Lisbon
          </div>
          <h1 className="mt-1 font-display text-5xl">Your cellar</h1>
        </div>
      </div>

      <RewardsCard bottleCount={reservations.reduce((n, r) => n + (r.qty ?? 1), 0)} />

      <div className="mt-10 border-b border-border flex gap-6 overflow-x-auto">

        {[
          { id: "orders", label: `My Reservations & Orders${reservations.length ? ` · ${reservations.length}` : ""}` },
          { id: "pairings", label: `Saved pairings${pairs.length ? ` · ${pairs.length}` : ""}` },
          { id: "saved", label: "Saved bottles" },
          { id: "shops", label: "Favorite shops" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`pb-3 text-sm whitespace-nowrap transition ${
              tab === t.id
                ? "border-b-2 border-primary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <section className="mt-8">
          {reservations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-3 font-display text-2xl">No active reservations</div>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Reserve a bottle from any partner shop and it will show up here with a live delivery status and QR code.
              </p>
              <Link
                to="/shops"
                className="mt-5 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Browse shops
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {reservations.map((r) => {
                const bottle = getBottle(r.bottleSlug);
                const shop = getShop(r.shopSlug);
                if (!bottle || !shop) return null;
                return (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex gap-4">
                      <img
                        src={bottle.image}
                        alt={bottle.name}
                        loading="lazy"
                        className="h-24 w-20 rounded-md object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                              #{r.id} · Qty {r.qty}
                            </div>
                            <div className="font-display text-xl leading-tight mt-0.5 truncate">
                              {bottle.name}
                            </div>
                          </div>
                          <button
                            onClick={() => removeReservation(r.id)}
                            aria-label="Cancel reservation"
                            className="text-muted-foreground hover:text-foreground shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {shop.name} · {shop.address}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> Reserved {new Date(r.reservedAt).toLocaleString()}
                        </div>
                        <div className="mt-2 font-medium text-sm">${bottle.price * r.qty}</div>
                      </div>
                    </div>

                    <StatusTracker status={r.status} />

                    <div className="mt-5 flex gap-4 items-center rounded-xl bg-secondary/60 p-3">
                      <img
                        src={qrUrl(r.id, 160)}
                        alt={`Delivery QR for ${r.id}`}
                        className="h-20 w-20 rounded-md bg-white p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                          <QrCode className="h-3 w-3" /> Show to the courier
                        </div>
                        <div className="mt-0.5 font-mono text-sm">GRAPES-{r.id}</div>
                        <Link
                          to="/business/$slug"
                          params={{ slug: shop.slug }}
                          className="mt-1 inline-block text-xs text-primary hover:underline"
                        >
                          Directions to {shop.neighborhood} →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {tab === "pairings" && (
        <section className="mt-8">
          {pairs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <ChefHat className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-3 font-display text-2xl">No saved pairings yet</div>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Use the Food Pairings &amp; Recipes section on any store or AI Sommelier page and tap
                “Save recipe &amp; bottle pair”.
              </p>
              <Link
                to="/sommelier"
                className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
              >
                Open AI Sommelier
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pairs.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img src={p.dishImage} alt={p.dishName} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-xl">{p.dishName}</div>
                        <div className="text-xs text-muted-foreground">
                          paired with {p.bottleName}{p.shopName ? ` · ${p.shopName}` : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePair(p.id)}
                        className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-secondary"
                        aria-label="Remove pairing"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full border border-border px-2.5 py-0.5">{p.difficulty}</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-muted-foreground">
                        <Clock className="h-3 w-3" /> {p.timeMinutes} min
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-foreground/80">{p.why}</p>
                    {p.ingredients.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.ingredients.map((i) => (
                          <span key={i} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px]">{i}</span>
                        ))}
                      </div>
                    )}
                    {p.bottleSlug && (
                      <Link
                        to="/bottle/$slug"
                        params={{ slug: p.bottleSlug }}
                        className="mt-4 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        View bottle
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "saved" && (
        <section className="mt-8">
          <div className="grid gap-4 md:grid-cols-3">
            {savedBottles.map((b) => (
              <Link
                key={b.slug}
                to="/bottle/$slug"
                params={{ slug: b.slug }}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={b.image}
                    alt={b.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground">{b.flag} {b.region}</div>
                  <div className="font-display text-xl mt-1">{b.name}</div>
                  <div className="text-sm text-muted-foreground">${b.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tab === "shops" && (
        <section className="mt-8">
          <div className="grid gap-4 md:grid-cols-2">
            {favoriteShops.map((s) => (
              <Link
                key={s.slug}
                to="/business/$slug"
                params={{ slug: s.slug }}
                className="flex gap-4 rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="h-28 w-32 object-cover"
                />
                <div className="py-4 pr-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.neighborhood}
                  </div>
                  <div className="font-display text-2xl">{s.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {s.bottleCount.toLocaleString()} bottles
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
