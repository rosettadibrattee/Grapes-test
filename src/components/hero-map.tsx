import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { Wine } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCatalog } from "@/lib/use-catalog";
import { filterBottles, filterShopsByQuery } from "@/lib/bottle-search";


const LISBON_HOODS = new Set([
  "Chiado",
  "Alfama",
  "Belém",
  "Marvila",
  "Bairro Alto",
  "Príncipe Real",
  "Graça",
  "Cais do Sodré",
  "Estrela",
  "Parque das Nações",
  "Campo de Ourique",
  "Avenida da Liberdade",
  "Beato",
  "Lapa",
  "Anjos",
  "Avenidas Novas",
  "Santos",
  "Intendente",
  "Mouraria",
  "Baixa",
]);

// Extra Lisbon partner pins so the map feels like a thriving Grapes network.
const extraPins: { name: string; lat: number; lng: number; bottles: number; kind: "Wine" | "Bar" }[] = [
  { name: "Alcântara Cellars", lat: 38.7045, lng: -9.1755, bottles: 268, kind: "Wine" },
  { name: "Ajuda Wines", lat: 38.7075, lng: -9.1975, bottles: 96, kind: "Wine" },
  { name: "Alvalade Pour", lat: 38.7530, lng: -9.1400, bottles: 132, kind: "Bar" },
  { name: "Benfica Fine Wines", lat: 38.7500, lng: -9.2010, bottles: 178, kind: "Wine" },
  { name: "Arroios Wines", lat: 38.7290, lng: -9.1345, bottles: 302, kind: "Wine" },
  { name: "Penha de França Bottle Co.", lat: 38.7280, lng: -9.1230, bottles: 214, kind: "Wine" },
  { name: "Saldanha Reserve", lat: 38.7330, lng: -9.1445, bottles: 121, kind: "Bar" },
  { name: "Olivais Vintners", lat: 38.7690, lng: -9.1140, bottles: 159, kind: "Wine" },
  { name: "Campolide Cellar", lat: 38.7285, lng: -9.1660, bottles: 187, kind: "Wine" },
  { name: "Santa Apolónia Pour", lat: 38.7145, lng: -9.1215, bottles: 143, kind: "Bar" },
];

const GLASS_SVG = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M6 3h12l-1 6a5 5 0 0 1-10 0Z"/></svg>`;

const makePin = (bottles: number, highlight: boolean, kind: "Wine" | "Bar" = "Wine") => {
  const bar = kind === "Bar";
  const brand = bar ? "#0e7c86" : "#4A121A";
  const shadow = bar ? "rgba(14,124,134,0.32)" : "rgba(123,31,43,0.3)";
  const glyph = bar
    ? `<span style="color:${brand};display:grid;place-items:center;">${GLASS_SVG}</span>`
    : `<span style="font-size:11px;line-height:1;">🍇</span>`;
  return L.divIcon({
    className: "grapes-hero-pin",
    html: `
      <div style="position:relative;transform:translate(-50%,-100%);display:flex;align-items:center;gap:3px;">
        <div style="
          width:22px;height:22px;border-radius:50%;
          background:#ffffff;border:2px solid ${brand};
          box-shadow:0 4px 12px ${shadow};
          display:grid;place-items:center;">${glyph}</div>
        <div style="
          background:${highlight ? (bar ? "#0a5c64" : "#320D14") : brand};color:#ffffff;
          font-size:9px;font-weight:700;border-radius:999px;
          padding:1px 5px;box-shadow:0 2px 8px ${shadow};">
          ${bottles}
        </div>
      </div>
    `,
    iconSize: [52, 24],
    iconAnchor: [11, 24],
  });
};


function FitPins({ pins }: { pins: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
    map.flyToBounds(bounds.pad(0.25), { duration: 0.6, maxZoom: 14 });
  }, [map, pins]);
  return null;
}

export function HeroMap({ query = "" }: { query?: string }) {
  const { shops, bottles } = useCatalog();
  const active = query.trim().length > 0;

  const { pins, count } = useMemo(() => {
    const manhattan = shops.filter(
      (s) => s.city === "sf" && LISBON_HOODS.has(s.neighborhood),
    );
    const { shops: filtered, matchCount } = filterShopsByQuery(manhattan, bottles, query);
    const matches = active ? filterBottles(bottles, query) : [];
    const base = filtered.map((s) => {
      const top = matches.find((b) => b.shopSlug === s.slug);
      return {
        key: s.slug,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        kind: (s.kind === "Bar" ? "Bar" : "Wine") as "Wine" | "Bar",
        bottles: active ? (matchCount[s.slug] ?? 0) : s.bottleCount,
        slug: s.slug as string | undefined,
        neighborhood: s.neighborhood as string | undefined,
        match: top
          ? { name: top.name, image: top.image, price: top.price, slug: top.slug }
          : undefined,
      };

    });
    const extras = active
      ? []
      : extraPins.map((p) => ({
          key: p.name,
          ...p,
          slug: undefined,
          neighborhood: "Lisboa",
          match: undefined as
            | { name: string; image: string; price: number; slug: string }
            | undefined,
        }));
    const all = [...base, ...extras];
    return { pins: all, count: all.length };
  }, [shops, bottles, query, active]);

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl shadow-xl">
      <div className="absolute left-4 top-4 z-[500] flex items-center gap-2 rounded-full border border-primary/20 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-primary backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        {active ? `${count} stores stocking “${query.trim()}”` : `${count} live partners · Lisbon`}
      </div>
      <Link
        to="/map"
        className="hover-lift absolute right-4 top-4 z-[500] rounded-full border border-primary/20 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-primary shadow backdrop-blur hover:bg-white"
      >
        Open full map
      </Link>
      <div className="absolute bottom-4 left-4 z-[500] flex items-center gap-3 rounded-full border border-black/5 bg-white/90 px-3 py-1.5 text-[10px] font-semibold shadow backdrop-blur">
        <span className="flex items-center gap-1.5 text-primary">
          <span className="grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-white text-[8px]">
            🍇
          </span>
          Wine stores
        </span>
        <span className="flex items-center gap-1.5 text-[#0e7c86]">
          <span className="grid h-4 w-4 place-items-center rounded-full border-2 border-[#0e7c86] bg-white">
            <Wine className="h-2.5 w-2.5" />
          </span>
          Wine bars
        </span>
      </div>
      {active && count === 0 && (
        <div className="absolute inset-x-4 bottom-4 z-[500] rounded-2xl bg-white/95 px-4 py-3 text-xs text-muted-foreground shadow-lg backdrop-blur">
          No Lisbon partner currently stocks a match for “{query.trim()}”. Try another bottle,
          grape or price.
        </div>
      )}
      <MapContainer
        center={[38.7223, -9.1393]}
        zoom={12}
        scrollWheelZoom
        dragging
        doubleClickZoom
        zoomControl
        style={{ height: 420, width: "100%", background: "#f3f0ff" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FitPins pins={pins} />
        {pins.map((p) => (
          <Marker key={p.key} position={[p.lat, p.lng]} icon={makePin(p.bottles, active, p.kind)}>

            {p.match ? (
              <Tooltip
                key={`m-${p.match.slug}`}
                permanent
                direction="top"
                offset={[0, -26]}
                opacity={1}
                className="grapes-bottle-tip"
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 6, maxWidth: 168 }}
                >
                  <img
                    src={p.match.image}
                    alt={p.match.name}
                    style={{ width: 22, height: 30, objectFit: "cover", borderRadius: 4 }}
                  />
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 120,
                      }}
                    >
                      {p.match.name}
                    </span>
                    <span style={{ display: "block", fontSize: 10, opacity: 0.7 }}>
                      ${p.match.price} · {p.name}
                    </span>
                  </span>
                </span>
              </Tooltip>
            ) : (
              <Tooltip direction="top" offset={[0, -22]} opacity={1}>
                <span style={{ fontSize: 12 }}>
                  {p.name} · {p.bottles} {active ? "matches" : "bottles"}
                </span>
              </Tooltip>
            )}
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  {p.neighborhood} · {p.bottles} {active ? "matching bottles" : "bottles in stock"}
                </div>
                {p.slug ? (
                  <Link
                    to="/business/$slug"
                    params={{ slug: p.slug }}
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      background: "#4A121A",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    View bottles
                  </Link>
                ) : (
                  <Link
                    to="/shops"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      background: "#4A121A",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Explore partners
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default HeroMap;
