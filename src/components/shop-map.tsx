import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { Shop, City } from "@/lib/data";

const CITY_VIEW: Record<City, { center: [number, number]; zoom: number }> = {
  sf: { center: [38.7223, -9.1393], zoom: 12.6 },
};

const GLASS_SVG = `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M6 3h12l-1 6a5 5 0 0 1-10 0Z"/></svg>`;

function makePin(selected: boolean, count: number, kind: Shop["kind"] = "Wine") {
  const bar = kind === "Bar";
  const size = selected ? 34 : 27;
  const brand = bar ? "#0e7c86" : "#320D14";
  const ring = selected ? (bar ? "#0e7c86" : "#4A121A") : brand;
  const badge = bar ? "#0e7c86" : "#4A121A";
  const bg = selected ? ring : "#ffffff";
  const emojiSize = size - 11;
  const glyph = bar
    ? `<span style="color:${selected ? "#ffffff" : "#0e7c86"};display:grid;place-items:center;width:100%;height:100%;">${GLASS_SVG}</span>`
    : `<span style="font-size:${emojiSize}px;line-height:1;">🍇</span>`;

  return L.divIcon({
    className: "grapes-pin",
    html: `
      <div style="position:relative;transform:translate(-50%,-100%);">
        <div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${bg};border:2px solid ${ring};
          box-shadow:0 8px 20px rgba(20,20,30,0.28);
          display:grid;place-items:center;overflow:hidden;">${glyph}</div>
        <div style="
          position:absolute;left:50%;top:${size - 4}px;transform:translateX(-50%);
          width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
          border-top:8px solid ${ring};"></div>
        <div style="
          position:absolute;top:-5px;right:-5px;min-width:15px;height:15px;padding:0 4px;
          border-radius:999px;background:${badge};color:#fff;font-size:8px;font-weight:600;
          display:grid;place-items:center;border:1.5px solid #fff;">${count}</div>

      </div>
    `,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
  });
}



function FlyToCity({ city }: { city: City }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    const { center, zoom } = CITY_VIEW[city];
    if (first.current) {
      map.setView(center, zoom, { animate: false });
      first.current = false;
    } else {
      map.flyTo(center, zoom, { duration: 0.8 });
    }
  }, [city, map]);
  return null;
}

export function ShopMap({
  city,
  shops,
  selectedSlug,
  onSelect,
}: {
  city: City;
  shops: Shop[];
  selectedSlug?: string | null;
  onSelect?: (shop: Shop) => void;
}) {
  const visible = useMemo(() => shops.filter((s) => s.city === city), [city, shops]);
  const { center, zoom } = CITY_VIEW[city];
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      zoomControl={false}
      style={{ height: "100%", width: "100%", background: "#efe8dc" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <FlyToCity city={city} />
      {visible.map((s) => (
        <Marker
          key={s.slug}
          position={[s.lat, s.lng]}
          icon={makePin(selectedSlug === s.slug, Math.min(99, Math.round(s.bottleCount / 20)), s.kind)}
          eventHandlers={{ click: () => onSelect?.(s) }}
        />
      ))}
    </MapContainer>
  );
}

export default ShopMap;
