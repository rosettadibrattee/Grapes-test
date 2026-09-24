import { useState } from "react";
import { Clock, MapPin, Maximize2, Navigation, Phone, X } from "lucide-react";
import type { Shop } from "@/lib/data";
import { directionsUrl, mapEmbedUrl, shopPhone } from "@/lib/shop-contact";

/** Store address, hours, phone and map — the store your order is delivered from. */
export function StoreInfoCard({ shop }: { shop: Shop }) {
  const phone = shopPhone(shop.slug);
  const [full, setFull] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative">
        <iframe
          title={`Map of ${shop.name}`}
          src={mapEmbedUrl(shop.lat, shop.lng)}
          loading="lazy"
          className="h-24 w-full border-0"
        />
        <button
          type="button"
          onClick={() => setFull(true)}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-primary shadow-md backdrop-blur transition hover:bg-white"
        >
          <Maximize2 className="h-3.5 w-3.5" /> View full map
        </button>
      </div>

      {full && (
        <div className="fixed inset-0 z-[70] bg-black/70">
          <iframe
            title={`Full map of ${shop.name}`}
            src={mapEmbedUrl(shop.lat, shop.lng)}
            className="h-full w-full border-0"
          />
          <button
            type="button"
            onClick={() => setFull(false)}
            aria-label="Close full map"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-primary shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
          <a
            href={directionsUrl(shop.name, shop.address)}
            target="_blank"
            rel="noreferrer noopener"
            className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            <Navigation className="h-4 w-4" /> Get directions
          </a>
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="font-medium">{shop.name}</div>
            <div className="text-muted-foreground">{shop.address}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0 text-primary" /> {shop.hours}
        </div>
        <a
          href={`tel:${phone.replace(/[^\d]/g, "")}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <Phone className="h-4 w-4 shrink-0 text-primary" /> {phone}
        </a>
        <a
          href={directionsUrl(shop.name, shop.address)}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Navigation className="h-4 w-4" /> Get directions
        </a>
        <p className="text-center text-[11px] text-muted-foreground">
          Opens in Google Maps · works with Apple Maps on iOS
        </p>
      </div>
    </div>
  );
}

export default StoreInfoCard;
