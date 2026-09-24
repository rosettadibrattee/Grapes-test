import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, MessageCircle, UtensilsCrossed } from "lucide-react";

const POINTS = [
  {
    id: "scan",
    icon: Camera,
    label: "Scan a label",
    prompt: "Scanning label… Barolo Riserva 2016",
    result: "Nebbiolo · tar & roses · in stock at 3 Lisbon shops",
  },
  {
    id: "meal",
    icon: UtensilsCrossed,
    label: "Match your meal",
    prompt: "Spicy Thai beef salad, under $50",
    result: "Off-dry Riesling · sweetness tames the chili heat",
  },
  {
    id: "night",
    icon: MessageCircle,
    label: "Describe your night",
    prompt: "Cozy pasta night for two, bold red",
    result: "Chianti Classico · bright acidity cuts the sauce",
  },
] as const;

export function SommelierCta() {
  const [active, setActive] = useState<string | null>(null);
  const [typed, setTyped] = useState("");

  const point = POINTS.find((p) => p.id === active) ?? null;

  useEffect(() => {
    if (!point) return;
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(point.prompt.slice(0, i));
      if (i >= point.prompt.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [point]);

  return (
    <section className="border-t border-border bg-white">
      <div className="container-page py-14 md:py-20">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-cream p-7 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <div className="min-w-0">
              <div className="chip">One assistant</div>
              <h2 className="mt-3 font-display text-3xl md:text-5xl">
                Ask the AI Sommelier
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Scan labels, match your meal, or describe your night — one prompt box that
                finds the bottle and the shelf it's sitting on in Lisbon.
              </p>

              {point && (
                <div className="mt-6 max-w-lg rounded-2xl border border-primary/20 bg-white p-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Live preview
                  </div>
                  <div className="mt-2 rounded-xl bg-cream px-3 py-2 text-sm">
                    {typed}
                    <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-primary" />
                  </div>
                  {typed.length === point.prompt.length && (
                    <div className="mt-2 rounded-xl border border-border px-3 py-2 text-sm text-foreground/80">
                      {point.result}
                    </div>
                  )}
                </div>
              )}

              <Link
                to="/ai-sommelier"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Open the AI Sommelier <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid gap-3">
              {POINTS.map((p) => {
                const isActive = active === p.id;
                return (
                  <li key={p.label}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActive(isActive ? null : p.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md ${
                        isActive ? "border-primary shadow-md" : "border-border"
                      }`}
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                        <p.icon className="h-4 w-4" strokeWidth={1.9} />
                      </span>
                      <span className="text-sm font-medium">{p.label}</span>
                      <ArrowRight
                        className={`ml-auto h-4 w-4 text-primary transition ${
                          isActive ? "translate-x-0.5 opacity-100" : "opacity-40"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SommelierCta;
