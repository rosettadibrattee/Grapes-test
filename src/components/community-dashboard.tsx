import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Brain,
  Crown,
  Grid3x3,
  MapPin,
  Sparkles,
  Star,
  Trophy,
  Wine,
} from "lucide-react";

type Player = {
  rank: number;
  name: string;
  hood: string;
  points: number;
  streak: number;
  badge: string;
};

const LEADERBOARD: Player[] = [
  { rank: 1, name: "Sofia R.", hood: "Mission District", points: 4820, streak: 12, badge: "🍷" },
  { rank: 2, name: "Marcus T.", hood: "Hayes Valley", points: 4415, streak: 9, badge: "🧠" },
  { rank: 3, name: "Ana L.", hood: "North Beach", points: 3990, streak: 7, badge: "🗺️" },
  { rank: 4, name: "Devon K.", hood: "SoMa", points: 3120, streak: 5, badge: "🥂" },
  { rank: 5, name: "Priya M.", hood: "Castro", points: 2870, streak: 4, badge: "⭐" },
  { rank: 6, name: "You", hood: "Potrero Hill", points: 2410, streak: 3, badge: "🍇" },
];

const BADGES = [
  {
    icon: Star,
    name: "First Pour",
    detail: "Leave your first bottle review",
    earned: true,
    progress: 100,
  },
  {
    icon: MapPin,
    name: "City Explorer",
    detail: "Visit 10 partner locations on the map",
    earned: false,
    progress: 70,
  },
  {
    icon: Brain,
    name: "Blind Palate",
    detail: "Win 5 blind tasting rounds",
    earned: false,
    progress: 40,
  },
  {
    icon: Wine,
    name: "Bar Hopper",
    detail: "Check in at 5 wine bars",
    earned: false,
    progress: 20,
  },
  {
    icon: Crown,
    name: "Cellar Master",
    detail: "Reserve 25 bottles",
    earned: false,
    progress: 12,
  },
  {
    icon: Sparkles,
    name: "Sommelier's Pick",
    detail: "Get 50 likes on one review",
    earned: true,
    progress: 100,
  },
];

const GAME_TILES = [
  {
    id: "trivia",
    icon: Brain,
    title: "Blind Tasting Trivia",
    meta: "2–8 players · 15 min",
    points: "+120 pts",
    blurb: "Guess grape, region and vintage from three clues. Fastest correct answer scores.",
  },
  {
    id: "bingo",
    icon: Grid3x3,
    title: "Wine Bingo",
    meta: "Solo or table · Ongoing",
    points: "+80 pts",
    blurb: "Tick off tasting notes as you find them — cherry, flint, leather, five in a row wins.",
  },
  {
    id: "quiz",
    icon: Trophy,
    title: "Tasting Quiz",
    meta: "Solo · 5 min",
    points: "+60 pts",
    blurb: "Daily five-question sprint on grapes, regions and pairings. Streaks multiply points.",
  },
];

const BINGO_CELLS = [
  "Cherry",
  "Oak",
  "Citrus",
  "Leather",
  "Flint",
  "Vanilla",
  "Pepper",
  "Free",
  "Honey",
  "Tobacco",
  "Green apple",
  "Rose",
  "Cocoa",
  "Salt",
  "Herbs",
  "Butter",
];

export function CommunityDashboard() {
  const [tab, setTab] = useState<"leaderboard" | "badges">("leaderboard");
  const [marked, setMarked] = useState<number[]>([7]);
  const earned = useMemo(() => BADGES.filter((b) => b.earned).length, []);

  const toggleCell = (i: number) =>
    setMarked((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]));

  return (
    <section className="space-y-6">
      {/* Header stats */}
      <div className="tech-card grid-tech overflow-hidden p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="chip">
              <Sparkles className="h-3 w-3" /> Community Dashboard
            </div>
            <h2 className="tech-gradient-text mt-2 font-display text-2xl sm:text-3xl">
              Play, review, climb the ranks
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Earn points for reviewing bottles, checking in at partner venues and winning games.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { k: "2,410", v: "Your points" },
              { k: "#6", v: "Lisbon rank" },
              { k: `${earned}/6`, v: "Badges" },
            ].map((s) => (
              <div
                key={s.v}
                className="hover-lift rounded-2xl border border-primary/10 bg-background/70 px-3 py-2 backdrop-blur"
              >
                <div className="font-display text-lg text-primary">{s.k}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Games */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Wine Games</h3>
          <Link to="/games" className="text-xs font-semibold text-primary hover:underline">
            All games
          </Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {GAME_TILES.map((g) => (
            <div key={g.id} className="tech-card sheen p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <g.icon className="h-4.5 w-4.5" />
                </span>
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {g.points}
                </span>
              </div>
              <div className="mt-3 font-display text-base">{g.title}</div>
              <div className="text-[11px] text-muted-foreground">{g.meta}</div>
              <p className="mt-2 text-xs text-muted-foreground">{g.blurb}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bingo + ranking */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="tech-card p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base">Wine Bingo card</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap a note the moment you taste it. Five in a row scores the round.
          </p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {BINGO_CELLS.map((c, i) => {
              const on = marked.includes(i);
              return (
                <button
                  key={c}
                  onClick={() => toggleCell(i)}
                  className={`aspect-square rounded-xl border text-[10px] font-semibold leading-tight transition-all duration-200 ${
                    on
                      ? "scale-[0.97] border-primary bg-primary text-primary-foreground shadow-inner"
                      : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tech-card p-4 sm:p-5">
          <div className="flex items-center gap-1 rounded-full bg-muted p-1 text-xs font-semibold">
            {(["leaderboard", "badges"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full px-3 py-1.5 capitalize transition-all duration-200 ${
                  tab === t
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "leaderboard" ? (
            <ul className="mt-3 space-y-1.5">
              {LEADERBOARD.map((p) => (
                <li
                  key={p.rank}
                  className={`hover-lift flex items-center gap-3 rounded-2xl border px-3 py-2 ${
                    p.name === "You"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-background"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      p.rank <= 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.rank}
                  </span>
                  <span className="text-base">{p.badge}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {p.hood} · {p.streak}-week streak
                    </span>
                  </span>
                  <span className="font-display text-sm text-primary">
                    {p.points.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {BADGES.map((b) => (
                <div
                  key={b.name}
                  className={`hover-lift rounded-2xl border p-3 ${
                    b.earned ? "border-primary/35 bg-primary/5" : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl ${
                        b.earned
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <b.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{b.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{b.detail}</div>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${b.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 flex items-center gap-2 rounded-2xl border border-dashed border-primary/30 px-3 py-2 text-[11px] text-muted-foreground">
                <Award className="h-3.5 w-3.5 text-primary" />
                Review a bottle or check in at a partner venue to unlock the next badge.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CommunityDashboard;
