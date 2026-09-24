import { BellRing, Check, Timer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoreInfoCard } from "@/components/store-info-card";
import { WhatsappSupportButton } from "@/components/whatsapp-support";
import type { Bottle, Shop } from "@/lib/data";
import { useReservations } from "@/lib/reservations";

export type ConfirmationData = { reservationId: string; bottle: Bottle; shop: Shop };

export function ReservationConfirmation({
  data,
  onOpenChange,
}: {
  data: ConfirmationData | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { reservations } = useReservations();
  if (!data) return null;
  const live = reservations.find((r) => r.id === data.reservationId);
  const qty = live?.qty ?? 1;
  const status = live?.status ?? "Order Received";

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Order confirmed</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-5 w-5" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {status === "Out for Delivery"
                ? "Out for delivery"
                : "Order received — preparing for delivery"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Order #{data.reservationId}
            </div>
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl border border-border bg-cream p-3">
          <img
            src={data.bottle.image}
            alt={data.bottle.name}
            className="h-20 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-semibold">{data.bottle.name}</div>
            <div className="text-xs text-muted-foreground">
              {data.bottle.producer} · {data.bottle.vintage}
            </div>
            <div className="mt-1 text-sm">
              Qty {qty} ·{" "}
              <span className="font-semibold">${(data.bottle.price * qty).toFixed(0)}</span>{" "}
              <span className="text-xs text-muted-foreground">paid by card on delivery</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-secondary p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Timer className="h-4 w-4 text-primary" /> Est. delivery in 60–90 minutes
          </div>
          <p className="mt-1.5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <BellRing className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            You will receive a confirmation message when your bottle is packed and the courier
            is on the way. Cancel any time before dispatch, free.
          </p>
        </div>

        <StoreInfoCard shop={data.shop} />

        <WhatsappSupportButton
          message={`Hi Grapes! I need help with order #${data.reservationId} — ${data.bottle.name} at ${data.shop.name}.`}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ReservationConfirmation;
