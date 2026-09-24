import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Wine, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useReservations } from "@/lib/reservations";
import type { Bottle } from "@/lib/data";

export type FoodItem = { key: string; name: string; sub: string; price: number; image: string };

export const FOOD_ITEMS: FoodItem[] = [
  {
    key: "cheese-board",
    name: "Cheese Board",
    sub: "Tagliere Formaggi",
    price: 9,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=70&auto=format&fit=crop",
  },
  {
    key: "fruit-box",
    name: "Mixed Fruit Box",
    sub: "Frutta Mix",
    price: 6,
    image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&q=70&auto=format&fit=crop",
  },
  {
    key: "chips",
    name: "Gourmet Chips",
    sub: "Patatine",
    price: 4,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=70&auto=format&fit=crop",
  },
  {
    key: "croquettes",
    name: "Croquettes",
    sub: "Crocchetta",
    price: 7,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=70&auto=format&fit=crop",
  },
  {
    key: "pastel",
    name: "Pastel de Nata",
    sub: "Box of 4",
    price: 5,
    image: "https://images.unsplash.com/photo-1600617953089-e2c1a5e0b0a0?w=600&q=70&auto=format&fit=crop",
  },
  {
    key: "olives",
    name: "Olives & Taralli",
    sub: "Artisanal snack duo",
    price: 5,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=70&auto=format&fit=crop",
  },
];


export function HappyHourBuilder({
  open,
  bottle,
  shopSlug,
  shopName,
  onClose,
}: {
  open: boolean;
  bottle: Bottle | null;
  shopSlug: string;
  shopName: string;
  onClose: () => void;
}) {
  const { addBag } = useReservations();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");

  const bottlePrice = bottle ? Math.round(bottle.price) : 0;
  const snacksTotal = useMemo(
    () => FOOD_ITEMS.reduce((s, f) => s + f.price * (counts[f.key] ?? 0), 0),
    [counts],
  );
  const total = bottlePrice + snacksTotal;


  if (!open) return null;

  const bump = (key: string, delta: number) =>
    setCounts((c) => {
      const next = Math.max(0, (c[key] ?? 0) + delta);
      return { ...c, [key]: next };
    });

  const chosen = FOOD_ITEMS.filter((f) => (counts[f.key] ?? 0) > 0);

  const confirm = () => {
    addBag(shopSlug, {
      budget: total,
      wines: bottle ? [`${bottle.name} ${bottle.vintage}`] : ["Surprise Me!"],
      foods: chosen.map((f) => `${f.name} ×${counts[f.key]}`),
      notes: notes.trim(),
      shopName,
      items: chosen.map((f) => ({ name: f.name, price: f.price, qty: counts[f.key]! })),
      bottleSlug: bottle?.slug,
      bottleName: bottle ? `${bottle.name} ${bottle.vintage}` : undefined,
      bottlePrice: bottle ? bottlePrice : undefined,
    });
    toast.success("Happy Hour Bag added", { description: `€${total} · ${shopName} · Pay on Delivery` });
    onClose();
    navigate({ to: "/checkout" });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close builder"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
      />
      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-[#FAF7F2] shadow-2xl duration-300 animate-in slide-in-from-bottom-6 sm:max-w-lg sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-start gap-3 bg-primary p-5 text-white">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15">
            <Wine className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/70">
              Build your bag · Pay on Delivery
            </div>
            <h3 className="font-display text-2xl leading-tight">Mystery Happy Hour Bag 🍷+🧀</h3>
            <p className="mt-1 truncate text-sm text-white/80">
              {bottle ? `${bottle.name} ${bottle.vintage} · ${shopName}` : `Surprise bottle · ${shopName}`}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-white/15">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Food grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Add food, one by one
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {FOOD_ITEMS.map((f) => {
              const n = counts[f.key] ?? 0;
              return (
                <div
                  key={f.key}
                  className={`overflow-hidden rounded-2xl border bg-white transition duration-300 ${
                    n ? "border-primary shadow-lg shadow-black/10" : "border-black/10"
                  }`}
                >
                  <img src={f.image} alt={f.name} loading="lazy" className="h-24 w-full bg-muted object-cover" />
                  <div className="p-3">
                    <div className="truncate text-sm font-semibold leading-tight">{f.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{f.sub}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">€{f.price}</span>
                      <div className="inline-flex items-center overflow-hidden rounded-full border border-primary/20">
                        <button
                          type="button"
                          aria-label={`Remove one ${f.name}`}
                          onClick={() => bump(f.key, -1)}
                          className="grid h-7 w-7 place-items-center text-primary hover:bg-primary/10"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">{n}</span>
                        <button
                          type="button"
                          aria-label={`Add one ${f.name}`}
                          onClick={() => bump(f.key, 1)}
                          className="grid h-7 w-7 place-items-center text-primary hover:bg-primary/10"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dietary notes (optional)
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="No nuts, lactose-free cheese…"
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-primary"
            />
          </label>
        </div>

        {/* Live summary */}
        <div className="border-t border-primary/20 bg-white px-5 py-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="truncate text-muted-foreground">
                {bottle ? `${bottle.name} ${bottle.vintage}` : "Shop's surprise bottle"}
              </span>
              <span className="font-medium">{bottle ? `€${bottlePrice}` : "included"}</span>
            </div>
            {chosen.map((f) => (
              <div key={f.key} className="flex justify-between">
                <span className="truncate text-muted-foreground">
                  {f.name} ×{counts[f.key]}
                </span>
                <span className="font-medium">€{f.price * counts[f.key]!}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-black/10 pt-2 font-display text-xl">
              <span>Total</span>
              <span className="text-primary">€{total}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={confirm}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Reserve &amp; Pay on Delivery · €{total}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HappyHourBuilder;
