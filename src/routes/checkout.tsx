import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, ShieldCheck, Check, Truck, Gift, ChevronDown } from "lucide-react";
import { getBottle, getShop } from "@/lib/data";
import { useReservations } from "@/lib/reservations";
import { useI18n } from "@/lib/i18n";
import { WhatsappSupportButton } from "@/components/whatsapp-support";
import ReferralCard from "@/components/referral-card";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Wine delivered in Lisbon | Grapes" },
      {
        name: "description",
        content:
          "Order wine for delivery in Lisbon and pay by card in person when the courier arrives.",
      },
      { name: "keywords", content: "wine delivery Lisbon, pay on delivery wine, Grapes Lisbon" },
      { property: "og:title", content: "Checkout — Grapes Lisbon" },
      {
        property: "og:description",
        content: "Wine delivered in Lisbon — payment by card upon delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { t } = useI18n();
  const { reservations } = useReservations();
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [card, setCard] = useState({ number: "", exp: "", cvc: "", name: "", email: "" });
  const [ship, setShip] = useState({ name: "", address: "", city: "Lisboa", zip: "", phone: "", notes: "" });
  const [refCode, setRefCode] = useState("");
  const [refApplied, setRefApplied] = useState(false);
  const [refError, setRefError] = useState(false);
  const [refOpen, setRefOpen] = useState(false);

  type Line = {
    id: string;
    qty: number;
    title: string;
    sub: string;
    detail?: string;
    image?: string;
    unit: number;
  };

  const items = useMemo<Line[]>(
    () =>
      reservations
        .map((r): Line | null => {
          if (r.bag) {
            const shop = getShop(r.shopSlug);
            return {
              id: r.id,
              qty: r.qty,
              title: "Mystery Happy Hour Bag",
              sub: `${r.bag.shopName ?? shop?.name ?? "Partner shop"}${
                r.bag.budget >= 26 ? " · Premium aperitivo" : " · Classic bag"
              }`,
              detail: [
                r.bag.bottleName
                  ? `${r.bag.bottleName}${r.bag.bottlePrice ? ` (€${r.bag.bottlePrice})` : ""}`
                  : r.bag.wines.join(", "),
                (r.bag.items?.length
                  ? r.bag.items.map((i) => `${i.name} ×${i.qty} (€${i.price * i.qty})`)
                  : r.bag.foods
                ).join(", "),
                r.bag.notes,
              ]
                .filter(Boolean)
                .join(" · "),
              image: shop?.image,
              unit: r.bag.budget,
            };
          }
          const bottle = getBottle(r.bottleSlug);
          if (!bottle) return null;
          const shop = getShop(bottle.shopSlug);
          return {
            id: r.id,
            qty: r.qty,
            title: `${bottle.name} ${bottle.vintage}`,
            sub: `${shop?.name ?? ""} · ${shop?.neighborhood ?? ""}`,
            image: bottle.image,
            unit: bottle.price,
          };
        })
        .filter(Boolean) as Line[],
    [reservations],
  );

  const shipReady =
    ship.name.trim().length > 1 &&
    ship.address.trim().length > 4 &&
    ship.city.trim().length > 1 &&
    ship.zip.trim().length > 3 &&
    ship.phone.trim().length > 6;

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unit, 0);
  const fee = items.length && !refApplied ? 3.9 : 0;
  const total = subtotal + fee;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 1400);
  };

  return (
    <div className="container-page max-w-5xl py-8 pb-28 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl tracking-tight">{t("checkout.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("checkout.subtitle")}</p>

      {paid ? (
        <div className="tech-card mt-8 p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Check className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-display text-3xl">{t("checkout.success")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("checkout.successBody")}</p>
          <div className="mx-auto mt-6 max-w-xs">
            <WhatsappSupportButton message={t("whatsapp.order")} />
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          {/* Cart */}
          <div className="tech-card p-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">Step 1</div>
            <h2 className="font-display text-2xl">{t("checkout.cart")}</h2>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">
              <Truck className="h-3.5 w-3.5" /> {t("checkout.delivery")}
            </div>
            {items.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">{t("checkout.empty")}</p>
                <Link
                  to="/shops"
                  className="hover-lift mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {t("checkout.browse")}
                </Link>
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-border">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-4 py-4">
                    {i.image ? (
                      <img
                        src={i.image}
                        alt={i.title}
                        width={80}
                        height={100}
                        className="h-20 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="grid h-20 w-16 shrink-0 place-items-center rounded-lg bg-primary/10 text-2xl">
                        🎁
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{i.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{i.sub}</div>
                      {i.detail && (
                        <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                          {i.detail}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-muted-foreground">
                        {t("checkout.qty")}: {i.qty}
                      </div>
                    </div>
                    <div className="font-display text-xl">€{(i.qty * i.unit).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>{t("checkout.subtotal")}</dt>
                <dd>€{subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>{t("checkout.deliveryFee")}</dt>
                <dd>
                  {refApplied ? (
                    <span className="font-semibold text-[#0e7c86]">
                      <span className="mr-1.5 line-through opacity-50">€3.90</span>Free
                    </span>
                  ) : (
                    <>€{fee.toFixed(2)}</>
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>{t("checkout.total")}</dt>
                <dd className="font-display text-2xl">€{total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          {/* Delivery address + payment */}
          <div className="space-y-6">
          <div className="tech-card p-6">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-primary">Step 1</div>
                <h2 className="font-display text-2xl">{t("checkout.shipping")}</h2>
              </div>
            </div>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">
              {t("checkout.fullName")}
              <input
                required
                value={ship.name}
                onChange={(e) => setShip({ ...ship, name: e.target.value })}
                placeholder="Maria Silva"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">
              {t("checkout.address")}
              <input
                required
                value={ship.address}
                onChange={(e) => setShip({ ...ship, address: e.target.value })}
                placeholder="Rua Garrett 42, 3º Dto."
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-muted-foreground">
                {t("checkout.city")}
                <input
                  required
                  value={ship.city}
                  onChange={(e) => setShip({ ...ship, city: e.target.value })}
                  placeholder="Lisboa"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                {t("checkout.zip")}
                <input
                  required
                  value={ship.zip}
                  onChange={(e) => setShip({ ...ship, zip: e.target.value })}
                  placeholder="1200-203"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
            </div>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">
              {t("checkout.phone")}
              <input
                required
                inputMode="tel"
                value={ship.phone}
                onChange={(e) => setShip({ ...ship, phone: e.target.value })}
                placeholder="+351 912 345 678"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">
              {t("checkout.notes")}
              <input
                value={ship.notes}
                onChange={(e) => setShip({ ...ship, notes: e.target.value })}
                placeholder="Campainha 3B"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>
          </div>

          {/* Payment — card on delivery only */}
          <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0e7c86]">Step 2</div>
                <h2 className="font-display text-2xl">Payment</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0e7c86]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0e7c86]">
                <Truck className="h-3 w-3" /> Delivery only
              </span>
            </div>

            <div className="mt-5 flex w-full items-center gap-3 rounded-2xl border-2 border-[#0e7c86] bg-[#0e7c86]/10 p-4 text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0e7c86] text-white">
                <CreditCard className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">Payment by card upon delivery</span>
                <span className="block text-[11px] text-muted-foreground">
                  Pay the courier by card in person. Online payment is not available.
                </span>
              </span>
              <Check className="h-5 w-5 shrink-0 text-[#0e7c86]" />
            </div>


            {/* Referral · free delivery */}
            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Gift className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight">{t("referral.hero")}</div>
                  <div className="text-[11px] text-muted-foreground">{t("referral.heroSub")}</div>
                </div>
              </div>

              {refApplied ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#0e7c86]/10 px-3 py-2.5 text-xs font-semibold text-[#0e7c86]">
                  <Check className="h-4 w-4" /> {refCode.toUpperCase()} · Free delivery applied (−€3.90)
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    value={refCode}
                    onChange={(e) => {
                      setRefCode(e.target.value.toUpperCase());
                      setRefError(false);
                    }}
                    placeholder="REFERRAL CODE"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm uppercase tracking-wider text-foreground outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      refCode.trim().length >= 4 ? setRefApplied(true) : setRefError(true)
                    }
                    className="shrink-0 rounded-xl bg-primary px-4 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
              )}
              {refError && (
                <p className="mt-2 text-[11px] font-medium text-primary">
                  Enter a valid referral code (min. 4 characters).
                </p>
              )}

              <button
                type="button"
                onClick={() => setRefOpen((o) => !o)}
                className="mt-3 flex w-full items-center justify-between text-[11px] font-semibold text-primary"
              >
                Invite a friend and both get $10 off your next bottle
                <ChevronDown className={`h-4 w-4 transition ${refOpen ? "rotate-180" : ""}`} />
              </button>
              {refOpen && (
                <div className="mt-3">
                  <ReferralCard compact />
                </div>
              )}
            </div>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">
              {t("checkout.email")}
              <input
                type="email"
                required
                value={card.email}
                onChange={(e) => setCard({ ...card, email: e.target.value })}
                placeholder="tu@email.com"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <div className="mt-4 rounded-2xl border border-dashed border-[#0e7c86]/40 bg-[#0e7c86]/5 p-4 text-xs leading-relaxed text-muted-foreground">
              Nothing is charged now. Bring nothing but your ID — you pay by card in person
              when the courier delivers your order.
            </div>

            <button
              type="submit"
              disabled={paying || items.length === 0 || !shipReady}
              className="hover-lift mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0e7c86] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <Truck className="h-4 w-4" />
              {paying
                ? t("checkout.paying")
                : `Place order · Pay by card on delivery €${total.toFixed(2)}`}
            </button>

            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Delivery only — no online payment. Please have your ID ready for the courier.
            </p>
          </form>
          </div>
        </div>
      )}

    </div>
  );
}
