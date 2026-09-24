import { useEffect, useState } from "react";
import { Sparkles, X, ArrowLeft, Check } from "lucide-react";
import { saveTasteProfile } from "@/lib/taste-profile";

const STEPS = [
  {
    key: "drink" as const,
    title: "How do you take your coffee or tea?",
    hint: "This tells us a lot about your palate.",
    options: [
      { label: "Black & Strong", emoji: "☕️" },
      { label: "With Milk & Sugar", emoji: "🥛" },
      { label: "Soft & Herbal", emoji: "🌿" },
      { label: "Sweet & Iced", emoji: "🧊" },
    ],
  },
  {
    key: "flavor" as const,
    title: "Which flavors do you naturally gravitate toward?",
    hint: "Pick the one that makes your mouth water.",
    options: [
      { label: "Dark Chocolate & Berry", emoji: "🍫" },
      { label: "Fresh Citrus & Green Apple", emoji: "🍏" },
      { label: "Oak & Vanilla", emoji: "🪵" },
      { label: "Bright Flowers & Peach", emoji: "🌸" },
    ],
  },
  {
    key: "vibe" as const,
    title: "What's your typical bottle vibe?",
    hint: "We'll keep matches in this range.",
    options: [
      { label: "Everyday Casual under $25", emoji: "🍷" },
      { label: "Weekend Dinner $25–$50", emoji: "🍽️" },
      { label: "Special Cellar Selection $50+", emoji: "✨" },
    ],
  },
];

export function TasteTestModal({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setStep(0);
      setAnswers({});
    }
  }, [open]);

  if (!open) return null;

  const current = STEPS[step];

  const pick = (label: string) => {
    const next = { ...answers, [current.key]: label };
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    saveTasteProfile({
      drink: next.drink ?? "",
      flavor: next.flavor ?? "",
      vibe: next.vibe ?? "",
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-lg overflow-hidden rounded-t-3xl border border-black/5 bg-white shadow-2xl shadow-black/10 sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI Taste Test · {step + 1} of {STEPS.length}
          </div>
          <div className="flex items-center gap-1">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                aria-label="Back"
                className="grid h-8 w-8 place-items-center rounded-full text-foreground/60 hover:bg-black/5"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Skip the taste test"
              className="grid h-8 w-8 place-items-center rounded-full text-foreground/60 hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-black/5">
          <div
            className="h-1 bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="px-5 pb-6 pt-5">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{current.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{current.hint}</p>

          <div className="mt-5 grid gap-2">
            {current.options.map((o) => {
              const selected = answers[current.key] === o.label;
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => pick(o.label)}
                  className={
                    "flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition " +
                    (selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-black/5 bg-white text-ink hover:border-primary/30 hover:bg-black/[0.02]")
                  }
                >
                  <span className="text-lg">{o.emoji}</span>
                  <span className="flex-1">{o.label}</span>
                  {selected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Skip and just show me bottles
          </button>
        </div>
      </div>
    </div>
  );
}

export default TasteTestModal;
