import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./terms";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Grapes" },
      {
        name: "description",
        content:
          "How Grapes collects, uses and protects your information when you search, order and receive wine deliveries in Lisbon.",
      },
      { property: "og:title", content: "Privacy Policy — Grapes" },
      {
        property: "og:description",
        content: "How Grapes handles your data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="Last updated: August 2026">
      <p>
        This policy explains what we collect when you use Grapes and what we do with
        it. We keep it to the minimum needed to run reservations.
      </p>
      <h2>What we collect</h2>
      <p>
        Order details (bottles, store, delivery address and time), the contact details you
        provide so the store can hold your order, and basic usage analytics.
      </p>
      <h2>How we use it</h2>
      <p>
        To hold your bottles, notify you and the store about a reservation, improve
        recommendations, and keep the service secure. We do not sell your personal
        information.
      </p>
      <h2>Sharing</h2>
      <p>
        We share only what a partner store and courier need to fulfil your delivery, plus service
        providers that host our infrastructure and deliver notifications.
      </p>
      <h2>Your choices</h2>
      <p>
        You can cancel reservations at any time and request deletion of your data by
        emailing privacy@grapeswine.app.
      </p>
    </LegalShell>
  );
}
