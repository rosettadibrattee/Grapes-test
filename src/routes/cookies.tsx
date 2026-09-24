import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./terms";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy & Legal Disclaimers — Grapes" },
      {
        name: "description",
        content:
          "How Grapes uses cookies, plus legal disclaimers and the 21+ age compliance notice for alcohol reservations.",
      },
      { property: "og:title", content: "Cookie Policy & Legal Disclaimers — Grapes" },
      {
        property: "og:description",
        content: "Cookies, disclaimers and the 21+ notice for Grapes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalShell
      title="Cookie Policy & Legal Disclaimers"
      updated="Last updated: August 2026"
    >
      <div className="rounded-2xl border border-primary/20 bg-cream p-5 text-sm font-medium text-ink">
        Must be 21+ to purchase or reserve alcohol. Valid government-issued ID is
        required on delivery. Please drink responsibly.
      </div>
      <h2>Cookies we use</h2>
      <p>
        Essential cookies keep your session, cart and reservations working. Analytics
        cookies help us understand which stores and bottles people look for. You can
        block cookies in your browser, but reservations may stop working.
      </p>
      <h2>Legal disclaimers</h2>
      <p>
        Grapes is not a retailer and does not sell or ship alcohol. All sales happen
        in person at licensed partner stores in Lisbon, subject to their own
        policies, pricing and stock. Tasting notes, ratings and AI recommendations are
        informational only.
      </p>
      <h2>Responsible service</h2>
      <p>
        Partner stores may refuse service to anyone who cannot show valid ID or who
        appears intoxicated. Never drink and drive.
      </p>
      <h2>Contact</h2>
      <p>legal@grapeswine.app</p>
    </LegalShell>
  );
}
