import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, Send } from "lucide-react";
import { isFirstTimeUser } from "@/lib/taste-profile";
import TasteTestModal from "@/components/taste-test-modal";
import bottleBg from "@/assets/hero-wine-bottle.jpg";

const TAGS = [
  { label: "🍷 Pairing with Steak", query: "Pairing with a steak dinner" },
  { label: "🍕 Pizza Night under €20", query: "Pizza night under 20 euros" },
  { label: "🎁 Impress a Date", query: "Impress a date, sparkling or elegant red" },
];

export function HeroAiFinder() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);
  const pending = useRef<string>("");

  const open = (query: string) => {
    navigate({ to: "/ai-sommelier", search: { q: query } });
  };

  const go = (query: string) => {
    const q = query.trim();
    if (!q) return;
    if (isFirstTimeUser()) {
      pending.current = q;
      setQuizOpen(true);
      return;
    }
    open(q);
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* editorial bottle backdrop */}
      <img
        src={bottleBg}
        alt="Bottle of red wine"
        width={1920}
        height={1280}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center] opacity-[0.38] md:opacity-60"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/[0.06]" />
      <div className="container-page relative flex min-h-[86vh] flex-col items-center justify-center pt-14 pb-20 text-center md:min-h-[92vh] md:pt-20 md:pb-28">
        {/* Wordmark */}
        <button
          type="button"
          onClick={() => go("Help me find a great bottle tonight")}
          aria-label="Start with the AI Sommelier"
          className="font-display text-2xl font-bold tracking-[-0.03em] text-primary md:text-3xl"
        >
          Grapes
        </button>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/60 backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Sommelier · Lisbon
        </div>

        <h1 className="mt-7 max-w-[19ch] text-[2.85rem] font-bold leading-[0.94] tracking-[-0.045em] text-ink text-balance sm:max-w-[22ch] sm:text-[4.25rem] md:text-[5.75rem] lg:text-[6.75rem]">
          Find your perfect wine in{" "}
          <span className="text-primary">3 seconds.</span>
        </h1>

        <p className="mt-6 max-w-[34ch] text-lg leading-snug text-muted-foreground text-balance md:max-w-[46ch] md:text-2xl">
          Tell us what you're eating, your budget, or your mood — our AI handles the rest.
        </p>

        {/* Primary CTA widget */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(text);
          }}
          className="mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-[1.75rem] border border-black/10 bg-white/85 p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:flex-row sm:items-center sm:rounded-full sm:p-2"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I'm having spicy Thai beef salad, under €50…"
            className="min-w-0 flex-1 bg-transparent px-5 py-3 text-base text-ink outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="relative shrink-0 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-black/15 transition hover:opacity-90 active:scale-[0.98] sm:py-3.5"
          >
            <span className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" /> Match me
            </span>
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
          {TAGS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => go(t.query)}
              className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-foreground/70 transition hover:bg-black/[0.04]"
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
          Delivered in Lisbon · Pay by card on delivery
        </p>
      </div>


      <TasteTestModal
        open={quizOpen}
        onClose={() => {
          setQuizOpen(false);
          if (pending.current) open(pending.current);
        }}
        onComplete={() => {
          setQuizOpen(false);
          if (pending.current) open(pending.current);
        }}
      />
    </section>
  );
}

export default HeroAiFinder;
