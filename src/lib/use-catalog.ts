import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCatalog } from "@/lib/catalog.functions";
import { bottles as staticBottles, shops as staticShops, type Bottle, type Shop } from "@/lib/data";

/**
 * Reads stores + bottles from the database.
 * Falls back to the bundled catalog while the database has no rows yet,
 * so the UI never renders empty.
 */
export function useCatalog(): { shops: Shop[]; bottles: Bottle[]; isLive: boolean } {
  const fetchCatalog = useServerFn(getCatalog);
  const { data } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetchCatalog({}),
    staleTime: 60_000,
  });

  if (data && data.shops.length > 0) {
    return { shops: data.shops, bottles: data.bottles, isLive: true };
  }
  return { shops: staticShops, bottles: staticBottles, isLive: false };
}
