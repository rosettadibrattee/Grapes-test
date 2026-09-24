import { useState } from "react";
import { Camera, RotateCcw, Trophy, Wine, Eye, Tag } from "lucide-react";

const NOTES = [
  "🍒 Cherry",
  "🪵 Oak",
  "🌿 Vanilla",
  "🌶️ Black Pepper",
  "🍑 Stone Fruit",
  "🍫 Cocoa",
  "🌸 Floral",
  "🍋 Citrus",
  "🌰 Nutty",
  "🍓 Strawberry",
  "🧂 Minerality",
  "🍯 Honey",
];

const BRACKETS = ["Under $20", "$20–$40", "$40–$70", "$70+"] as const;

const STEPS = ["Pour & Observe", "Sniff & Tap", "Guess the Price", "Reveal & Score"];

export function BlindTastingGame() {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [bracket, setBracket] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const toggleNote = (n: string) =>
    setNotes((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));

  const reveal = () => {
    const base = 40 + Math.min(notes.length, 5) * 8 + (bracket ? 12 : 0);
    setScore(Math.min(99, base + Math.floor(Math.random() * 10)));
    setStep(3);
  };

  const reset = () => {
    setStep(0);
    setNotes([]);
    setBracket(null);
    setScore(null);
  };

  const title =
    score === null
      ? ""
      : score > 85
        ? "Master Sommelier"
        : score > 70
          ? "Sharp Palate"
          : "Curious Taster";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      {/* Game card */}
      <div className="rounded-3xl border border-primary/20 bg-card p-5 sm:p-6">
        <div className="chip">
          <Wine className="h-3.5 w-3.5" /> Playable now
        </div>
        <h3 className="mt-3 font-display text-2xl md:text-3xl">
          Blind Tasting Master: Guess the Note &amp; Price
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Grab a covered bottle, pass the phone around the table, and let Grapes host your
          tasting challenge!
        </p>

        {/* Stepper */}
        <ol className="mt-5 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <span className="hidden truncate text-xs text-muted-foreground sm:block">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-2xl border border-border bg-cream p-5">
          {step === 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4 text-primary" /> Step 1 — Pour &amp; Observe
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Wrap the bottle so no one sees the label, pour a small glass for each player, and
                take a moment to look at the color and legs in the glass.
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                We&apos;ve poured — next
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4 text-primary" /> Step 2 — Sniff &amp; Tap
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap every aroma and flavor you pick up. No wrong answers — the table votes.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {NOTES.map((n) => {
                  const on = notes.includes(n);
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNote(n)}
                      aria-pressed={on}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={notes.length === 0}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
                >
                  Lock in {notes.length || ""} note{notes.length === 1 ? "" : "s"}
                </button>
                <button onClick={() => setStep(0)} className="text-xs text-muted-foreground underline">
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Trophy className="h-4 w-4 text-primary" /> Step 3 — Guess the Price Bracket
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                How much do you think this bottle costs at a local Grapes partner?
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BRACKETS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBracket(b)}
                    aria-pressed={bracket === b}
                    className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                      bracket === b
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={reveal}
                  disabled={!bracket}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
                >
                  <Camera className="h-4 w-4" /> Scan Label to Reveal Winner
                </button>
                <button onClick={() => setStep(1)} className="text-xs text-muted-foreground underline">
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-3xl">
                🏆
              </div>
              <div className="mt-3 text-sm text-muted-foreground">Sommelier Score</div>
              <div className="font-display text-5xl text-primary">{score}</div>
              <div className="mt-1 text-sm font-medium">{title}</div>
              <p className="mx-auto mt-3 max-w-sm text-xs text-muted-foreground">
                Guessed {notes.length} note{notes.length === 1 ? "" : "s"} · price bracket{" "}
                {bracket}. Closest guess at the table takes the crown — pass the phone and play
                again with the next bottle.
              </p>
              <button
                onClick={reset}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm transition hover:border-primary/40"
              >
                <RotateCcw className="h-4 w-4" /> Play another round
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick rules */}
      <aside className="rounded-3xl border border-border bg-cream p-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Quick rules
        </div>
        <ol className="mt-4 space-y-4">
          {[
            { t: "Pick & Hide", d: "Wrap any bottle in foil or a sleeve." },
            { t: "Pass & Guess", d: "Use Grapes to log flavor profiles and price guesses." },
            {
              t: "Scan & Score",
              d: "Reveal the bottle and let Grapes declare the evening's Master Sommelier!",
            },
          ].map((r, i) => (
            <li key={r.t} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <div className="text-sm font-medium">{r.t}</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}

export default BlindTastingGame;
