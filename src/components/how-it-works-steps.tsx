import { useRef, useState } from "react";
import { Sparkles, Wine, Truck, Dices, ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  {
    n: "1",
    icon: Sparkles,
    title: "Ask the AI",
    desc: "Type what you're eating, your budget or your mood. The Grapes AI Sommelier reads it like a human sommelier would.",
  },
  {
    n: "2",
    icon: Wine,
    title: "Instant Match",
    desc: "Flavor profiles, region and price are matched in real time against live stock across +50 Lisbon stores.",
  },
  {
    n: "3",
    icon: Truck,
    title: "Delivered to Your Door",
    desc: "One tap to order. Delivery only — pay by card in person when the courier arrives.",
  },
  {
    n: "4",
    icon: Dices,
    title: "Enjoy and play Wine Games",
    desc: "Open the bottle and play Sommelier Spin or a Blind Tasting Battle with friends.",
  },
];

export default function HowItWorksSteps() {
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.max(0, Math.min(STEPS.length - 1, i));
    const child = track.children[idx] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActive(idx);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / (track.clientWidth * 0.86));
    setActive(Math.max(0, Math.min(STEPS.length - 1, i)));
  };

  return (
    <section className="bg-gradient-to-b from-[#8C2A3C] to-[#6B1C2C] transition-colors duration-700">
      <div className="container-page py-16 md:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-xl">
            How it works
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            How Grapes Works in 4 steps
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 md:text-base">
            From a simple request to a bottle at your door — delivery only, paid by card
            on arrival.
          </p>
        </div>

        <div className="relative mt-12">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous step"
            className="hidden md:grid absolute -left-4 top-1/2 z-10 h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl transition hover:bg-white/25"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next step"
            className="hidden md:grid absolute -right-4 top-1/2 z-10 h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl transition hover:bg-white/25"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <ol
            ref={trackRef}
            onScroll={onScroll}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {STEPS.map(({ n, icon: Icon, title, desc }) => (
              <li
                key={n}
                className="w-[86%] shrink-0 snap-center rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:w-[58%] lg:w-[31%]"
              >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30">
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span className="text-sm font-bold text-white/50">Step {n}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-2 flex justify-center gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to step ${s.n}`}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
