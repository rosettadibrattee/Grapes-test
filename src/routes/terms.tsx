import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Grapes" },
      {
        name: "description",
        content:
          "The terms that govern orders, delivery and use of the Grapes wine discovery service in Lisbon.",
      },
      { property: "og:title", content: "Terms & Conditions — Grapes" },
      {
        property: "og:description",
        content: "Terms governing reservations and use of Grapes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions" updated="Last updated: August 2026">
      <p>
        By using Grapes you agree to these terms. Grapes is a discovery and
        reservation service: we help you find bottles at partner wine, spirits and
        liquor stores in Lisbon for delivery to your address. Grapes does not sell
        alcohol.
      </p>
      <h2>Age requirement</h2>
      <p>
        You must be 21 or older to reserve or purchase alcohol. Partner stores verify
        a valid government-issued ID on delivery. Orders placed by anyone under 21
        are void.
      </p>
      <h2>Reservations</h2>
      <p>
        Reservations are free and are held by the partner store for 24 hours. Payment
        is made in person at the store at its shelf price. Stock counts come from
        partner stores and can change before delivery.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not misuse the service, attempt to scrape inventory, or place reservations
        you do not intend to collect. We may suspend accounts that abuse the platform.
      </p>
      <h2>Contact</h2>
      <p>Questions about these terms: legal@grapeswine.app</p>
    </LegalShell>
  );
}

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{updated}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/75 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-ink">
          {children}
        </div>
      </div>
    </section>
  );
}
