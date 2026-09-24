import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Loader2, MapPin, Minus, Phone, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/lib/user-session";
import { WhatsappSupportButton } from "@/components/whatsapp-support";
import type { Bottle, Shop } from "@/lib/data";

type Props = {
  bottle: Bottle | null;
  shop: Shop;
  onClose: () => void;
  onConfirm: (qty: number) => string;
};

export function ReserveModal({ bottle, shop, onClose, onConfirm }: Props) {
  const navigate = useNavigate();
  const { user, signIn } = useUser();
  const [step, setStep] = useState<"auth" | "summary" | "success">("auth");
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState<null | "google" | "phone">(null);
  const [googleLinked, setGoogleLinked] = useState(false);
  const [orderId, setOrderId] = useState("");


  useEffect(() => {
    if (!bottle) return;
    setQty(1);
    setPhone(user?.phone ?? "");

    setPending(null);
    setGoogleLinked(false);
    // Always confirm Google + phone before an order can be submitted.
    setStep("auth");
  }, [bottle, user]);

  if (!bottle) return null;

  const phoneValid = phone.replace(/[^\d]/g, "").length >= 10;

  const connectGoogle = () => {
    setPending("google");
    setTimeout(() => {
      setGoogleLinked(true);
      setPending(null);
    }, 700);
  };

  const finishSignIn = () => {
    if (!googleLinked || !phoneValid) return;
    setPending("phone");
    setTimeout(() => {
      signIn(
        googleLinked
          ? { name: "Google account", email: "you@gmail.com", phone, via: "google" }
          : { name: "Phone account", phone, via: "phone" },
      );
      setPending(null);
      onConfirm(qty);
      onClose();
      navigate({ to: "/checkout" });
    }, 600);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === "auth" && "Sign in to reserve"}
            {step === "summary" && "Order summary"}
            {step === "success" && "Order sent 🎉"}
          </DialogTitle>
        </DialogHeader>

        {/* bottle strip */}
        <div className="flex gap-3 rounded-2xl border border-border bg-cream p-3">
          <img src={bottle.image} alt={bottle.name} className="h-16 w-14 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-semibold">🍷 {bottle.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {bottle.producer} · {bottle.vintage}
            </div>
            <div className="mt-1 text-xs">
              📍 {shop.name} · {shop.neighborhood}
            </div>
          </div>
        </div>

        {step === "auth" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              New to Grapes? Create your account in two quick steps — sign up with Google, then add your
              phone number so the shop can hold your bottle and text you when it's ready.
            </p>

            <div className="text-xs font-semibold">
              Step 1 · Google account <span className="text-primary">*required</span>
            </div>
            <button
              type="button"
              disabled={pending !== null || googleLinked}
              onClick={connectGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold transition hover:bg-cream disabled:opacity-60"
            >
              {pending === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : googleLinked ? (
                <Check className="h-4 w-4 text-primary" strokeWidth={3} />
              ) : (
                <span className="font-display text-base">G</span>
              )}
              {googleLinked ? "Google connected" : "Sign up with Google"}
            </button>

            <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> then <span className="h-px flex-1 bg-border" />
            </div>

            <div className={googleLinked ? "" : "pointer-events-none opacity-50"}>
              <label className="block text-xs font-semibold">
                Step 2 · Phone number <span className="text-primary">*required</span>
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
                <Phone className="h-4 w-4 text-primary" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  disabled={!googleLinked}
                  placeholder="(555) 555-5555"
                  className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                We need your number so the courier can reach you at delivery.
              </p>
            </div>

            <button
              type="button"
              disabled={!googleLinked || !phoneValid || pending !== null}
              onClick={finishSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {pending === "phone" && <Loader2 className="h-4 w-4 animate-spin" />}
              {googleLinked ? "Create account & go to checkout" : "Sign up with Google first"}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> 21+ only · we never share your number
            </p>
          </div>
        )}


        {step === "summary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-border p-3">
              <span className="text-sm font-medium">Quantity</span>
              <div className="inline-flex items-center overflow-hidden rounded-full border border-primary/20">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-8 w-8 place-items-center text-primary hover:bg-primary/10"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-8 w-8 place-items-center text-primary hover:bg-primary/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 rounded-2xl border border-border p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bottle</span>
                <span>${bottle.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span>× {qty}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                <span>Total</span>
                <span>${(bottle.price * qty).toFixed(0)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-cream p-3 text-xs leading-relaxed text-muted-foreground">
              🚚 Delivered from <span className="font-medium text-foreground">{shop.name}</span>,{" "}
              {shop.neighborhood}
              <br />⏰ Free cancellation before dispatch
              <br />
              📍 You'll confirm your delivery address on the next step.
            </div>

            <button
              type="button"
              onClick={() => {
                onConfirm(qty);
                onClose();
                navigate({ to: "/checkout" });
              }}
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              Continue to delivery & payment
            </button>


          </div>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-secondary p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
              <div className="text-sm leading-relaxed text-primary">
                <div className="font-semibold">Order sent!</div>
                You'll receive an SMS as soon as the courier is on the way.
                <div className="mt-1 text-xs text-muted-foreground">Order #{orderId}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {shop.name} · {shop.address}
            </div>
            <WhatsappSupportButton
              message={`Hi Grapes! I need help with order #${orderId} — ${bottle.name} at ${shop.name}.`}
            />
            <p className="text-center text-[11px] text-muted-foreground">
              Questions about your delivery? Our team replies on WhatsApp in minutes.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border-2 border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Done
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReserveModal;
