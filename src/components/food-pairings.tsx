import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Bookmark,
  BookmarkCheck,
  ChefHat,
  Clock,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Wine,
} from "lucide-react";
import { toast } from "sonner";
import { dishesForBottle, bottlesForDish, type PairedDish, type DishMatch } from "@/lib/pairings.functions";
import { dishImage } from "@/lib/dish-images";
import { makePairId, useSavedPairs } from "@/lib/saved-pairs";

export type PairingBottle = {
  slug?: string;
  name: string;
  producer?: string;
  varietal?: string;
  region?: string;
  vintage?: string | number;
  notes?: string;
  image?: string;
  shopName?: string;
};

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
  medium: "bg-amber-500/10 text-amber-700 border-amber-500/25",
  hard: "bg-rose-500/10 text-rose-700 border-rose-500/25",
};

const DISH_PROMPTS = ["Duck ragù", "Grilled ribeye", "Oysters", "Mushroom risotto", "Spicy Thai curry"];

export function FoodPairings({
  bottles,
  shopSlug,
  title = "AI Wine Assistant & Food Pairings",
  subtitle = "Describe your night, pick a bottle to see what to cook, or name a dish and we'll find the bottle.",
  assistant,
  assistantLabel = "Describe your night",
}: {
  bottles: PairingBottle[];
  shopSlug?: string;
  title?: string;
  subtitle?: string;
  assistant?: ReactNode;
  assistantLabel?: string;
}) {
  const [mode, setMode] = useState<"assistant" | "bottle" | "dish">(assistant ? "assistant" : "bottle");

  const tabs: Array<[typeof mode, string]> = [
    ...(assistant ? ([["assistant", assistantLabel]] as Array<[typeof mode, string]>) : []),
    ["bottle", "Bottle → dishes"],
    ["dish", "Dish → bottles"],
  ];

  return (
    <div className="rounded-3xl border border-primary/20 bg-white/80 p-5 md:p-7 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <ChefHat className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Wine &amp; plate
          </div>
          <h3 className="mt-1 font-display text-2xl md:text-3xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 inline-flex flex-wrap rounded-full border border-primary/20 bg-[#f8f4ec] p-1 text-xs font-semibold">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-full px-4 py-1.5 transition ${
              mode === id ? "bg-primary text-primary-foreground" : "text-primary hover:bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "assistant" && assistant ? (
        <div className="mt-5">{assistant}</div>
      ) : mode === "bottle" ? (
        <BottleToDishes bottles={bottles} />
      ) : (
        <DishToBottles shopSlug={shopSlug} />
      )}
    </div>
  );
}


/* ---------------- Bottle -> dishes ---------------- */

function BottleToDishes({ bottles }: { bottles: PairingBottle[] }) {
  const run = useServerFn(dishesForBottle);
  const [selected, setSelected] = useState<PairingBottle | null>(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dishes, setDishes] = useState<PairedDish[] | null>(null);

  const visible = bottles
    .filter((b) => `${b.name} ${b.producer ?? ""} ${b.varietal ?? ""}`.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 12);

  const pick = async (b: PairingBottle) => {
    setSelected(b);
    setDishes(null);
    setError(null);
    setLoading(true);
    try {
      const result = await run({
        data: {
          name: b.name,
          producer: b.producer,
          varietal: b.varietal,
          region: b.region,
          vintage: b.vintage,
          notes: b.notes,
        },
      });
      setDishes(result.dishes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pairing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search a bottle to pair…"
          className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {visible.map((b) => (
          <button
            key={b.slug ?? b.name}
            data-pair-chip
            type="button"
            onClick={() => void pick(b)}
            className={`shrink-0 rounded-2xl border px-3 py-2 text-left text-xs transition ${
              selected?.name === b.name
                ? "border-primary bg-primary/5"
                : "border-border bg-white hover:bg-secondary"
            }`}
          >
            <div className="flex items-center gap-2">
              <Wine className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{b.name}</span>
            </div>
            <span className="text-muted-foreground">{b.varietal ?? b.region ?? ""}</span>
          </button>
        ))}
        {visible.length === 0 && (
          <div className="py-2 text-xs text-muted-foreground">No bottles match that search.</div>
        )}
      </div>

      {loading && <DishSkeleton />}

      {error && !loading && (
        <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {dishes && !loading && selected && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {dishes.map((d) => (
            <DishCard key={d.name} dish={d} bottle={selected} />
          ))}
        </div>
      )}
    </div>
  );
}

function DishSkeleton() {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Loader2 className="h-4 w-4 animate-spin" /> Building plates for this bottle…
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export function DishCard({ dish, bottle }: { dish: PairedDish; bottle: PairingBottle }) {
  const { isSaved, savePair, removePair } = useSavedPairs();
  const id = makePairId(dish.name, bottle.name);
  const saved = isSaved(id);
  const img = dishImage(dish.name);
  const diff = DIFFICULTY_STYLE[dish.difficulty.toLowerCase()] ?? DIFFICULTY_STYLE.medium;

  const toggle = () => {
    if (saved) {
      removePair(id);
      toast("Removed from saved pairings");
      return;
    }
    savePair({
      id,
      dishName: dish.name,
      dishImage: img,
      why: dish.why,
      ingredients: dish.ingredients,
      difficulty: dish.difficulty,
      timeMinutes: dish.timeMinutes,
      steps: dish.steps,
      bottleName: bottle.name,
      bottleSlug: bottle.slug,
      bottleImage: bottle.image,
      shopName: bottle.shopName,
    });
    toast.success("Saved to your profile", { description: `${dish.name} × ${bottle.name}` });
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
        <img src={img} alt={dish.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <h4 className="font-display text-xl tracking-tight">{dish.name}</h4>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className={`rounded-full border px-2.5 py-0.5 font-semibold ${diff}`}>
            {dish.difficulty || "Medium"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-muted-foreground">
            <Clock className="h-3 w-3" /> {dish.timeMinutes} min
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{dish.why}</p>

        {dish.ingredients.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Key ingredients</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {dish.ingredients.map((i) => (
                <span key={i} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px]">
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {dish.steps && (
          <details className="mt-3 group">
            <summary className="cursor-pointer text-xs font-semibold text-primary">Method</summary>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{dish.steps}</p>
          </details>
        )}

        <button
          type="button"
          onClick={toggle}
          className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
            saved
              ? "bg-primary/10 text-primary"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          {saved ? "Saved pair" : "Save recipe & bottle pair"}
        </button>
      </div>
    </article>
  );
}

/* ---------------- Dish -> bottles ---------------- */

function DishToBottles({ shopSlug }: { shopSlug?: string }) {
  const run = useServerFn(bottlesForDish);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [matches, setMatches] = useState<DishMatch[] | null>(null);

  const search = async (dish: string) => {
    if (!dish.trim()) return;
    setLoading(true);
    setError(null);
    setMatches(null);
    setReply(null);
    try {
      const result = await run({ data: { dish, shopSlug: shopSlug ?? null } });
      setReply(result.reply);
      setMatches(result.matches);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void search(q);
        }}
        className="flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2"
      >
        <ChefHat className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What are you cooking? e.g. duck ragù"
          className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!q.trim() || loading}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Match bottles
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {DISH_PROMPTS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setQ(d);
              void search(d);
            }}
            className="rounded-full border border-border px-3 py-1 text-[11px] hover:bg-secondary"
          >
            {d}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-5 grid gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {reply && !loading && <p className="mt-5 text-sm text-foreground/80">{reply}</p>}

      {matches && !loading && matches.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No bottles on the shelf matched that dish. Try another dish or protein.
        </div>
      )}

      {matches && matches.length > 0 && !loading && (
        <div className="mt-4 grid gap-3">
          {matches.map((m) => (
            <div key={m.slug} className="flex gap-4 rounded-2xl border border-border bg-white p-3">
              <Link
                to="/bottle/$slug"
                params={{ slug: m.slug }}
                className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {m.flag} {m.region} · {m.varietal}
                </div>
                <Link
                  to="/bottle/$slug"
                  params={{ slug: m.slug }}
                  className="font-display text-lg tracking-tight hover:underline"
                >
                  {m.name} {m.vintage}
                </Link>
                <Link
                  to="/business/$slug"
                  params={{ slug: m.shopSlug }}
                  className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <MapPin className="h-3 w-3" /> {m.shopName} · {m.neighborhood}
                </Link>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-medium">${m.price}</div>
                <Link
                  to="/bottle/$slug"
                  params={{ slug: m.slug }}
                  className="mt-2 inline-block rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-white"
                >
                  Reserve
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
