import { Link } from "@tanstack/react-router";
import { ShoppingBag, MapPin, Clock, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useReservations } from "@/lib/reservations";
import { getBottle, getShop } from "@/lib/data";

export function PickupMenu() {
  const { reservations, removeReservation } = useReservations();
  const count = reservations.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Cart"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold grid place-items-center border-2 border-background">
              {count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Your cart</div>
          <div className="font-display text-lg">Active orders</div>
        </div>
        {count === 0 ? (
          <div className="p-6 text-center">
            <ShoppingBag className="mx-auto h-6 w-6 text-muted-foreground" />
            <div className="mt-2 text-sm text-muted-foreground">
              Your cart is empty. Find a bottle and order it in one tap.
            </div>
            <Link
              to="/shops"
              className="mt-4 inline-flex rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white"
            >
              Browse shops
            </Link>
          </div>
        ) : (
          <div className="max-h-[340px] overflow-y-auto divide-y divide-border">
            {reservations.map((r) => {
              const bottle = getBottle(r.bottleSlug);
              const shop = getShop(r.shopSlug);
              if ((!bottle && !r.bag) || !shop) return null;
              const title = r.bag
                ? `Mystery Happy Hour Bag · €${r.bag.budget}`
                : bottle!.name;
              return (
                <div key={r.id} className="flex gap-3 p-3">
                  {r.bag ? (
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-primary/10 text-xl">
                      🎁
                    </span>
                  ) : (
                    <img
                      src={bottle!.image}
                      alt=""
                      className="h-14 w-14 rounded-md object-cover bg-muted"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium truncate">{title}</div>
                      <button
                        onClick={() => removeReservation(r.id)}
                        aria-label="Cancel"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {shop.name}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Clock className="h-2.5 w-2.5" /> {r.status}
                      </span>
                      <span className="text-[11px] text-muted-foreground">#{r.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="border-t border-border p-3 space-y-2">
          <Link
            to="/checkout"
            className="block w-full rounded-full bg-primary text-primary-foreground text-center text-xs font-semibold py-2.5 hover:opacity-90"
          >
            Checkout · Delivery & payment
          </Link>
          <Link
            to="/profile"
            className="block w-full rounded-full bg-foreground text-background text-center text-xs font-medium py-2 hover:opacity-90"
          >
            View all orders
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
