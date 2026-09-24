import { Link } from "@tanstack/react-router";
import { Timer, ShoppingBag } from "lucide-react";

/** Soft upsell shown at the bottom of every game screen. */
export function RefillUpsell() {
  return (
    <Link
      to="/shops"
      className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 transition hover:bg-primary/10"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <ShoppingBag className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight">
          Running low? Order a refill bag in 20 mins.
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Timer className="h-3 w-3" /> Mystery Happy Hour Bag · Pay on Delivery
        </span>
      </span>
    </Link>
  );
}

export default RefillUpsell;
