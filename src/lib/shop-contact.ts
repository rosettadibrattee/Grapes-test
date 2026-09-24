/** Presentation helpers for a shop's pickup details (display-only). */

export function shopPhone(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const mid = 200 + (h % 700);
  const last = 1000 + ((h >>> 5) % 9000);
  return `(212) ${mid}-${last}`;
}

export function directionsUrl(name: string, address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${name}, ${address}, Lisbon, CA`,
  )}`;
}

export function mapEmbedUrl(lat: number, lng: number) {
  const d = 0.004;
  const bbox = [lng - d, lat - d / 2, lng + d, lat + d / 2].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
