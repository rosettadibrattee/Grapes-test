import { useMemo, useState } from "react";
import { Plus, X, RotateCcw, Sparkles, Users } from "lucide-react";
import { RefillUpsell } from "@/components/refill-upsell";

type Category = "Wine Trivia" | "Group Dare" | "Social Prompt";

type Card = { category: Category; text: string; intensity: 1 | 2 | 3 };

const DECK: Card[] = [
  { category: "Wine Trivia", intensity: 1, text: "Which country produces the most wine in the world? Wrong answer takes 1 sip.", },
  { category: "Wine Trivia", intensity: 1, text: "Name three grape varietals in under 10 seconds — or sip." },
  { category: "Wine Trivia", intensity: 2, text: "Guess the region of tonight's bottle. Everyone who's wrong takes 2 sips." },
  { category: "Wine Trivia", intensity: 2, text: "True or false: Rosé is made by blending red and white wine. Wrong = 2 sips." },
  { category: "Wine Trivia", intensity: 3, text: "Describe the wine in your glass using three tasting notes. The table votes — no votes, 3 sips." },
  { category: "Group Dare", intensity: 1, text: "Do your best sommelier impression while swirling your glass." },
  { category: "Group Dare", intensity: 2, text: "Everyone wearing something red takes 2 sips." },
  { category: "Group Dare", intensity: 2, text: "Swap seats with the person on your left. Last one seated drinks." },
  { category: "Group Dare", intensity: 3, text: "Give a 20-second toast in a fake accent. Break character and take 3 sips." },
  { category: "Group Dare", intensity: 3, text: "Pick someone to be your 'wine twin' — you both drink whenever they drink, until the next card." },
  { category: "Social Prompt", intensity: 1, text: "The last person to post a story takes 2 sips." },
  { category: "Social Prompt", intensity: 1, text: "Whoever has the most unread messages drinks." },
  { category: "Social Prompt", intensity: 2, text: "Show the last photo in your camera roll — refuse and take 2 sips." },
  { category: "Social Prompt", intensity: 2, text: "The person with the longest screen time today pours the next round." },
  { category: "Social Prompt", intensity: 3, text: "Read out the last message you sent, out loud. Skip = 3 sips." },
];

const CAT_STYLE: Record<Category, string> = {
  "Wine Trivia": "bg-primary text-primary-foreground",
  "Group Dare": "bg-[#0e7c86] text-white",
  "Social Prompt": "bg-gold text-ink",
};

export function SommelierSpin() {
  const [players, setPlayers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [turn, setTurn] = useState(0);
  const [card, setCard] = useState<Card | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");

  const pool = useMemo(
    () => (filter === "all" ? DECK : DECK.filter((c) => c.category === filter)),
    [filter],
  );

  const addPlayer = () => {
    const n = name.trim();
    if (!n || players.includes(n)) return;
    setPlayers((p) => [...p, n]);
    setName("");
  };

  const spin = () => {
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCard(next);
    setTurn((t) => (players.length ? (t + 1) % players.length : 0));
  };

  const reset = () => {
    setStarted(false);
    setCard(null);
    setTurn(0);
  };

  if (!started) {
    return (
      <div>
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="chip">
            <Users className="h-3.5 w-3.5" /> Pass and play
          </div>
          <h3 className="mt-3 font-display text-2xl">Sommelier Spin</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Truth, dare or drink. Add everyone at the table, then pass the phone around —
            the app picks who plays and what they have to do.
          </p>

          <div className="mt-5 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPlayer())}
              placeholder="Player name"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={addPlayer}
              className="shrink-0 rounded-xl bg-primary px-4 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {players.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {players.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium"
                >
                  {p}
                  <button
                    type="button"
                    aria-label={`Remove ${p}`}
                    onClick={() => setPlayers((s) => s.filter((x) => x !== p))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={players.length < 2}
            onClick={() => setStarted(true)}
            className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {players.length < 2 ? "Add at least 2 players" : `Start with ${players.length} players`}
          </button>
        </div>
        <RefillUpsell />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            It&apos;s{" "}
            <span className="text-primary">{players[turn]}</span>&apos;s turn
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> New game
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "Wine Trivia", "Group Dare", "Social Prompt"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/20"
              }`}
            >
              {c === "all" ? "All cards" : c}
            </button>
          ))}
        </div>

        <div className="mt-5 min-h-44 rounded-2xl border border-primary/20 bg-cream p-6 text-center">
          {card ? (
            <>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${CAT_STYLE[card.category]}`}
              >
                {card.category} · {"🍷".repeat(card.intensity)}
              </span>
              <p className="mt-4 font-display text-xl leading-snug tracking-tight">{card.text}</p>
            </>
          ) : (
            <p className="pt-8 text-sm text-muted-foreground">
              Tap spin to draw the first card.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={spin}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" /> Spin the card
        </button>
      </div>
      <RefillUpsell />
    </div>
  );
}

export default SommelierSpin;
