import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sommelier")({
  beforeLoad: () => {
    throw redirect({ to: "/ai-sommelier" });
  },
});
