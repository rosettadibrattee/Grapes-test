import { useMemo, useState } from "react";
import { Plus, X, Trophy, RotateCcw, Wine, Star } from "lucide-react";
import { RefillUpsell } from "@/components/refill-upsell";

const NOTES = [
  "🍒 Cherry",
  "🪵 Oak",
  "🌿 Vanilla",
  "🌶️ Pepper",
  "🍑 Stone fruit",
  "🍫 Cocoa",
  "🌸 Floral",
  "🍋 Citrus",
  "🧂 Mineral",
  "🍯 Honey",
];

type Entry = { player: string; score: number; notes: string[] };

export function TastingBattle() {
  const [wine, setWine] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"setup" | "rating" | "reveal">("setup");
  const [idx, setIdx] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [score, setScore] = useState(7);
  const [notes, setNotes] = useState<string[]>([]);

  const addPlayer = () => {
    const n = name.trim();
    if (!n || players.includes(n)) return;
    setPlayers((p) => [...p, n]);
    setName("");
  };

  const submit = () => {
    const entry: Entry = { player: players[idx], score, notes };
    const next = [...entries, entry];
    setEntries(next);
    setScore(7);
    setNotes([]);
    if (idx + 1 >= players.length) setPhase("reveal");
    else setIdx(idx + 1);
  };

  const results = useMemo(() => {
    if (entries.length === 0) return null;
    const avg = entries.reduce((s, e) => s + e.score, 0) / entries.length;
    const counts = new Map<string, number>();
    for (const e of entries) for (const n of e.notes) counts.set(n, (counts.get(n) ?? 0) + 1);
    const consensus = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    const ranked = [...entries]
      .map((e) => ({
        ...e,
        accuracy:
          100 -
          Math.abs(e.score - avg) * 8 -
          Math.max(0, 3 - e.notes.filter((n) => (counts.get(n) ?? 0) > 1).length) * 6,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
    return { avg, consensus, ranked };
  }, [entries]);

  const reset = () => {
    setPhase("setup");
    setEntries([]);
    setIdx(0);
    setScore(7);
    setNotes([]);
  };

  return (
    <div>
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        {phase === "setup" && (
          <>
            <div className="chip">
              <Wine className="h-3.5 w-3.5" /> Live tasting party
            </div>
            <h3 className="mt-3 font-display text-2xl">Blind Tasting Battle</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Host a tasting at your table. Everyone rates the same wine anonymously and adds
              flavour notes — at the end we reveal the group&apos;s Master Sommelier.
            </p>

            <label className="mt-5 block text-xs font-medium text-muted-foreground">
              What are you drinking? (kept hidden from the scores)
              <input
                value={wine}
                onChange={(e) => setWine(e.target.value)}
                placeholder="Bottle #1"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <div className="mt-4 flex gap-2">
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
              onClick={() => setPhase("rating")}
              className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {players.length < 2 ? "Add at least 2 tasters" : "Start the tasting"}
            </button>
          </>
        )}

        {phase === "rating" && (
          <>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Taster {idx + 1} of {players.length} · pass the phone
            </div>
            <h3 className="mt-2 font-display text-2xl">{players[idx]}, rate it</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Nobody sees your score until the reveal.
            </p>

            <div className="mt-5 rounded-2xl bg-cream p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your score
                </span>
                <span className="font-display text-3xl text-primary">{score}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-3 w-full accent-[#4A121A]"
              />

              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Flavour notes
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {NOTES.map((n) => {
                  const on = notes.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setNotes((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]))
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={submit}
              className="mt-5 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {idx + 1 >= players.length ? "Reveal the Master Sommelier" : "Lock in & pass the phone"}
            </button>
          </>
        )}

        {phase === "reveal" && results && (
          <>
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-3xl">
                🏆
              </div>
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                Master Sommelier{wine ? ` · ${wine}` : ""}
              </div>
              <div className="font-display text-4xl text-primary">{results.ranked[0].player}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Group average {results.avg.toFixed(1)}/10
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-cream p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                The table agreed on
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {results.consensus.length === 0 ? (
                  <span className="text-sm text-muted-foreground">No shared notes — tough crowd.</span>
                ) : (
                  results.consensus.map(([n, c]) => (
                    <span key={n} className="rounded-full bg-card px-3 py-1.5 text-xs font-medium">
                      {n} · {c}
                    </span>
                  ))
                )}
              </div>
            </div>

            <ol className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {results.ranked.map((e, i) => (
                <li key={e.player} className="flex items-center gap-3 p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{e.player}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {e.notes.join(" · ") || "No notes"}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {e.score}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:border-primary/20"
              >
                <RotateCcw className="h-4 w-4" /> New round
              </button>
              <button
                type="button"
                onClick={() => {
                  setEntries([]);
                  setIdx(0);
                  setPhase("rating");
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Trophy className="h-4 w-4" /> Next bottle
              </button>
            </div>
          </>
        )}
      </div>
      <RefillUpsell />
    </div>
  );
}

export default TastingBattle;
