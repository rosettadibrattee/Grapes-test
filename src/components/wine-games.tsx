import { useState } from "react";
import { ChevronLeft, Clock, Shuffle, Users, Wine } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Game = {
  id: string;
  emoji: string;
  title: string;
  players: string;
  time: string;
  tagline: string;
  steps: string[];
  tip: string;
  cards: string[];
};

const GAMES: Game[] = [
  {
    id: "truth-or-wine",
    emoji: "🍷",
    title: "Truth or Wine",
    players: "2–6 players",
    time: "20–30 min",
    tagline: "Answer honestly, or take a sip. Either way, you learn something.",
    steps: [
      "Draw a card and read it out loud.",
      "Answer truthfully — or pass and take a sip instead.",
      "Whoever passes the most pours the next round.",
    ],
    tip: "No follow-up questions unless the answer earns them.",
    cards: [
      "What's the last thing that genuinely surprised you about me?",
      "What's a compliment you've never said out loud?",
      "Which of my habits would you steal?",
      "What was your first impression of me — be honest.",
      "What's something you're secretly proud of this year?",
      "If we swapped lives for a week, what would you change first?",
    ],
  },
  {
    id: "couples-taste-test",
    emoji: "💞",
    title: "Couple's Taste Test",
    players: "2 players",
    time: "25 min",
    tagline: "How well do you know each other's palate? Time to find out.",
    steps: [
      "Each person secretly picks a bottle the other might love.",
      "Pour blind and guess: which glass did your partner choose for you?",
      "Whoever guesses wrong plans the next date night.",
    ],
    tip: "Pick opposites — a crisp white against a bold red makes it fun.",
    cards: [
      "Guess: does your partner prefer red, white or bubbles tonight?",
      "Which glass reminds you of your first date?",
      "Describe your partner as a wine in three words.",
      "Which bottle would your partner never order — and why?",
      "Pick a wine for the version of us in ten years.",
    ],
  },
  {
    id: "get-to-know-each-other",
    emoji: "🫶",
    title: "Get To Know Each Other",
    players: "2–8 players",
    time: "however long the bottle lasts",
    tagline: "Deep questions, low pressure. The bottle does the icebreaking.",
    steps: [
      "Shuffle the deck and pass it around the table.",
      "Everyone answers the same card before moving on.",
      "Skip a card and you top up everyone else's glass.",
    ],
    tip: "Start light, let the questions get deeper as the bottle empties.",
    cards: [
      "What's a small thing that instantly makes your day better?",
      "Who in your life would you call at 3am, no questions asked?",
      "What's something you changed your mind about recently?",
      "What are you most looking forward to in the next six months?",
      "What's a memory you'd relive exactly as it happened?",
      "What do people usually get wrong about you?",
    ],
  },
  {
    id: "first-date-decoder",
    emoji: "💘",
    title: "First Date Decoder",
    players: "2 players",
    time: "15 min",
    tagline: "The perfect opener when you've just met and the menu is still closed.",
    steps: [
      "Take turns drawing a card between sips.",
      "Both of you answer — no one-sided interviews.",
      "Any question you both refuse gets replaced with a toast.",
    ],
    tip: "Two questions per glass. Leave them wanting the second date.",
    cards: [
      "What's your most useless but impressive talent?",
      "Best trip you've ever taken — and who was there?",
      "What's your comfort meal on a bad day?",
      "Are you a plan-everything or figure-it-out-later person?",
      "What's something you're learning right now?",
      "What would make tonight a great night for you?",
    ],
  },
  {
    id: "how-well-do-you-know-me",
    emoji: "🔮",
    title: "How Well Do You Know Me?",
    players: "2–6 players",
    time: "20 min",
    tagline: "Predict their answer before they say it. Points for mind-reading.",
    steps: [
      "One player reads a card and writes down their own answer.",
      "Everyone else guesses what they wrote.",
      "One point per correct guess — loser refills the glasses.",
    ],
    tip: "Play in pairs and keep score across the whole bottle.",
    cards: [
      "My go-to karaoke song is…",
      "The thing I'd never give up is…",
      "My ideal Sunday looks like…",
      "The compliment I love hearing most is…",
      "My biggest irrational fear is…",
      "If I had a free year, I'd spend it…",
    ],
  },
  {
    id: "toast-to-us",
    emoji: "🥂",
    title: "Toast To Us",
    players: "2–10 players",
    time: "10 min",
    tagline: "End the night with words people actually remember.",
    steps: [
      "Everyone draws one card and raises their glass.",
      "Give the toast in under 30 seconds — no rambling.",
      "Clink, sip, pass the deck to the left.",
    ],
    tip: "Great as the closer after any other game on this list.",
    cards: [
      "Toast to something the person on your right did well this year.",
      "Toast to a risk you're glad someone took.",
      "Toast to the version of you from five years ago.",
      "Toast to the next time this exact group is together.",
      "Toast to something ordinary you'd miss if it vanished.",
    ],
  },
];

function CardDeck({ cards }: { cards: string[] }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="mt-4 rounded-2xl border border-primary/20 bg-cream p-5 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Card {idx + 1} of {cards.length}
      </div>
      <p className="mt-3 min-h-16 font-display text-xl leading-snug tracking-tight">
        {cards[idx]}
      </p>
      <button
        onClick={() => setIdx((i) => (i + 1) % cards.length)}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
      >
        <Shuffle className="h-3.5 w-3.5" /> Next card
      </button>
    </div>
  );
}

export function WineGames() {
  const [openId, setOpenId] = useState<string | null>(null);
  const game = GAMES.find((g) => g.id === openId) ?? null;

  if (game) {
    return (
      <div>
        <button
          onClick={() => setOpenId(null)}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
        >
          <ChevronLeft className="h-4 w-4" /> All games
        </button>

        <div className="mt-4 rounded-3xl border border-primary/20 bg-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl leading-none">{game.emoji}</span>
            <div className="min-w-0">
              <h3 className="font-display text-2xl">{game.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {game.players}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {game.time}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 italic text-foreground/80">“{game.tagline}”</p>

          <CardDeck key={game.id} cards={game.cards} />

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              How to play
            </div>
            <ol className="mt-3 space-y-3">
              {game.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4 rounded-2xl bg-cream p-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Sommelier tip
            </div>
            <p className="mt-1 text-sm">{game.tip}</p>
          </div>

          <Link
            to="/shops"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
          >
            <Wine className="h-4 w-4" /> Pick bottles for this game
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start gap-3 rounded-2xl bg-cream p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-base">
          💞
        </span>
        <p className="text-sm leading-relaxed text-foreground/80">
          Icebreakers and date-night games made for two — or a small table. Real question
          cards, no app, no timer. Just a bottle and better conversation.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setOpenId(g.id)}
            className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/20 hover:bg-cream/40"
          >
            <span className="text-2xl leading-none">{g.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg">{g.title}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> {g.players}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {g.time}
                </span>
              </span>
              <span className="mt-1.5 block text-sm text-foreground/75">{g.tagline}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default WineGames;
