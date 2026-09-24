import { createFileRoute } from "@tanstack/react-router";
import { SommelierWorkspace } from "@/components/sommelier-workspace";


export const Route = createFileRoute("/ai-sommelier")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
  }),


  head: () => ({
    meta: [
      { title: "AI Sommelier — Scan, describe, pair | Grapes" },
      {
        name: "description",
        content:
          "One workspace: scan a wine label, describe your night or name the dish, and get a bottle-and-plate match in stock at Lisbon partner shops.",
      },
      { property: "og:title", content: "AI Sommelier — Grapes" },
      {
        property: "og:description",
        content:
          "Scan a label, describe your night or match your meal — one unified AI Sommelier for Lisbon wine delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiSommelierPage,
});

function AiSommelierPage() {
  const { q } = Route.useSearch();

  return (
    <div className="container-page max-w-3xl py-10 md:py-16">
      <div className="text-center">
        <div className="chip mx-auto">AI Sommelier</div>
        <h1 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
          One prompt. <span className="italic text-primary">The right bottle.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">
          Scan a label, describe your night or name the dish — all in the same box. We match a
          bottle to a plate and show where it is in stock in Lisbon.
        </p>
      </div>

      <div className="mt-8">
        <SommelierWorkspace initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
