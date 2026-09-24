import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { WineGames } from "@/components/wine-games";
import { SommelierSpin } from "@/components/sommelier-spin";
import { TastingBattle } from "@/components/tasting-battle";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Play with Friends · Wine party games — Grapes" },
      {
        name: "description",
        content:
          "Sommelier Spin, Blind Tasting Battle and icebreaker card decks. Pass-and-play wine party games for couples and small tables in Lisbon.",
      },
      { property: "og:title", content: "Play with Friends — Grapes" },
      {
        property: "og:description",
        content:
          "Truth, dare or drink with Sommelier Spin, host a Blind Tasting Battle, or draw icebreaker cards over a bottle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamesPage,
});

const TABS = [
  { id: "spin", label: "🎡 Sommelier Spin" },
  { id: "battle", label: "🏆 Tasting Battle" },
  { id: "cards", label: "🃏 Card decks" },
] as const;

function GamesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("spin");

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="chip">Play with Friends</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl tracking-tight">
          Games to play over a bottle
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pass-and-play party games for two or a full table. Add your names, spin a card, or
          host a blind tasting and crown the night&apos;s Master Sommelier.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-1 rounded-full border border-border bg-cream p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={
                "rounded-full px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs " +
                (tab === t.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "spin" && <SommelierSpin />}
          {tab === "battle" && <TastingBattle />}
          {tab === "cards" && <WineGames />}
        </div>
      </div>
    </div>
  );
}
