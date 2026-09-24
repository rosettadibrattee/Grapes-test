import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Apple,
  Play,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCatalog } from "@/lib/use-catalog";
import HowItWorksSteps from "@/components/how-it-works-steps";
import HeroAiFinder from "@/components/hero-ai-finder";





export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grapes — AI-powered wine discovery in Lisbon" },
      {
        name: "description",
        content:
          "Grapes is the AI wine app for consumers. Find & reserve the bottle you want across +50 local wine, spirits and liquor stores in Lisbon.",
      },
      { property: "og:title", content: "Grapes — AI-powered wine discovery" },
      {
        property: "og:description",
        content:
          "AI recommendations, live inventory across +50 Lisbon stores, reserve in a tap.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { shops } = useCatalog();
  const bottleCount = shops.reduce((s, x) => s + x.bottleCount, 0);


  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    carouselRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };
  return (
    <>
      {/* Hero — AI wine assistant */}
      <HeroAiFinder />


      {/* How it works — simple 4 steps */}
      <HowItWorksSteps />


      {/* Shops preview */}
      <section className="container-page py-14 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="chip">Wine, spirits & liquor stores</div>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              +50 local stores · {bottleCount.toLocaleString()} bottles in stock
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Boutique wine shops, spirits merchants and neighborhood liquor
              stores across Lisbon.
            </p>
          </div>
          <Link
            to="/shops"
            className="hidden md:inline-flex items-center gap-1 text-sm font-medium hover:text-primary"
          >
            Full map →
          </Link>
        </div>


        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="hidden md:grid absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 place-items-center rounded-full border border-border bg-card/90 backdrop-blur shadow-sm hover:bg-card transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="hidden md:grid absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 place-items-center rounded-full border border-border bg-card/90 backdrop-blur shadow-sm hover:bg-card transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-5 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {shops.map((s) => (
              <Link
                key={s.slug}
                to="/business/$slug"
                params={{ slug: s.slug }}
                className="group snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[30%] xl:w-[24%] overflow-hidden rounded-2xl border border-black/5 bg-card transition hover:shadow-2xl hover:shadow-black/5"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.neighborhood}
                  </div>
                  <div className="mt-1 font-display text-2xl">{s.name}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {s.bottleCount.toLocaleString()} bottles
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            to="/shops"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-primary"
          >
            See all stores on the map
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>





      <section className="bg-gradient-to-b from-[#8C2A3C] to-[#6B1C2C] transition-colors duration-700">
        <div className="container-page py-14 md:py-24">
          <DownloadBanner />
        </div>
      </section>

      <Faq />
    </>
  );
}

const FAQS = [
  {
    q: "Do I need to download the app to order a bottle?",
    a: "No. The web version does everything the app does for ordering: browse live inventory at nearby stores, pick your bottles and order in a tap. The app adds AI recommendations, saved cellars and delivery notifications.",
  },
  {
    q: "How do I get my bottles?",
    a: "Delivery only. A courier brings your order from the partner store to your address — there is no in-store pickup.",
  },
  {
    q: "How do I pay?",
    a: "You pay by card in person when the courier hands over your order. Online payment is not available.",
  },
  {
    q: "Do I have to create an account?",
    a: "Not upfront. You can order instantly as a guest — we only ask for your details after the order so delivery is fast.",
  },
  {
    q: "How long does delivery take?",
    a: "Most Lisbon orders arrive in 60–90 minutes. You'll see the delivery window in your orders.",
  },
  {
    q: "Is there a fee to order?",
    a: "Browsing is free. You pay the store's shelf price plus a small delivery fee — no markup.",
  },
  {
    q: "Which cities are covered?",
    a: "Lisbon today, with +50 partner wine, spirits and liquor stores. More cities are on the way.",
  },
  {
    q: "Is the inventory live?",
    a: "Yes. Stock counts come from our partner stores, so what you see on a store page is what's on the shelf. If a bottle sells out before dispatch, we'll suggest the closest match nearby.",
  },
  {
    q: "How does the AI Sommelier work?",
    a: "Snap a photo of any wine label for instant tasting notes and recipe pairings, or just describe your night — 'light red under $30 for pasta' — and we'll match bottles in stock near you.",
  },
  {
    q: "Can I cancel an order?",
    a: "Anytime before the courier leaves the store. Open your cart or your profile and cancel — nothing is charged, since you only pay on delivery.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-page pb-20 md:pb-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl tracking-tight text-ink">
            Common questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything about ordering, delivery and the Grapes app.
          </p>
        </div>

        <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-white/80 shadow-2xl shadow-black/5 backdrop-blur-xl">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-ink">{f.q}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 -mt-1 text-sm leading-relaxed text-foreground/70">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function DownloadBanner() {
  return (
    <div
      id="download"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 md:p-16"
    >
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5" />
          Early access
        </div>
        <h3 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
          Grapes App is coming
        </h3>
        <p className="mt-4 text-base text-white/65 md:text-lg">
          Download Grapes to get a full experience
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#download"
            aria-label="Download on the App Store"
            className="group inline-flex w-full max-w-[220px] items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-[#0D0D0F] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
          >
            <Apple className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] uppercase tracking-wider opacity-80">
                Download on the
              </span>
              <span className="block text-base font-semibold">App Store</span>
            </span>
          </a>
          <a
            href="#download"
            aria-label="Get it on Google Play"
            className="group inline-flex w-full max-w-[220px] items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-[#0D0D0F] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
          >
            <Play className="h-6 w-6 fill-current transition-transform duration-300 group-hover:scale-110" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] uppercase tracking-wider opacity-80">
                Get it on
              </span>
              <span className="block text-base font-semibold">Google Play</span>
            </span>
          </a>
        </div>

        <p className="mt-6 text-xs text-white/50">
          Must be 21+ to purchase or reserve alcohol.
        </p>
      </div>
    </div>
  );
}

