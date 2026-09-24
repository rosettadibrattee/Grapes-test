import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ReservationStatus = "Order Received" | "Preparing Bottle" | "Out for Delivery";

export type BagItem = { name: string; price: number; qty: number };

export type BagConfig = {
  budget: number;
  wines: string[];
  foods: string[];
  notes: string;
  shopName?: string;
  /** Itemised snacks picked in the Happy Hour builder. */
  items?: BagItem[];
  bottleSlug?: string;
  bottleName?: string;
  bottlePrice?: number;
};

export type Reservation = {
  id: string;
  bottleSlug: string;
  shopSlug: string;
  qty: number;
  reservedAt: number;
  status: ReservationStatus;
  /** Present when this line is a Mystery Happy Hour Bag instead of a bottle. */
  bag?: BagConfig;
};

type Ctx = {
  reservations: Reservation[];
  isReserved: (bottleSlug: string) => boolean;
  addReservation: (bottleSlug: string, shopSlug: string, qty?: number) => Reservation;
  addBag: (shopSlug: string, bag: BagConfig) => Reservation;
  updateQty: (id: string, qty: number) => void;
  getReservation: (bottleSlug: string) => Reservation | undefined;
  removeReservation: (id: string) => void;
  clearAll: () => void;
};

const ReservationsContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "grapes.reservations.v1";

function computeStatus(reservedAt: number): ReservationStatus {
  const elapsedMin = (Date.now() - reservedAt) / 60000;
  if (elapsedMin < 1) return "Order Received";
  if (elapsedMin < 3) return "Preparing Bottle";
  return "Out for Delivery";
}

export function ReservationsProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Reservation[];
        setReservations(parsed.map((r) => ({ ...r, status: computeStatus(r.reservedAt) })));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch {}
  }, [reservations]);

  // Progress statuses over time
  useEffect(() => {
    const t = setInterval(() => {
      setReservations((prev) => {
        let changed = false;
        const next = prev.map((r) => {
          const s = computeStatus(r.reservedAt);
          if (s !== r.status) {
            changed = true;
            return { ...r, status: s };
          }
          return r;
        });
        return changed ? next : prev;
      });
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const addReservation = useCallback((bottleSlug: string, shopSlug: string, qty: number = 1) => {
    const res: Reservation = {
      id: Math.random().toString(36).slice(2, 8).toUpperCase(),
      bottleSlug,
      shopSlug,
      qty: Math.max(1, qty),
      reservedAt: Date.now(),
      status: "Order Received",
    };
    setReservations((prev) => [res, ...prev]);
    return res;
  }, []);

  const addBag = useCallback((shopSlug: string, bag: BagConfig) => {
    const res: Reservation = {
      id: Math.random().toString(36).slice(2, 8).toUpperCase(),
      bottleSlug: `mystery-bag-${shopSlug}`,
      shopSlug,
      qty: 1,
      reservedAt: Date.now(),
      status: "Order Received",
      bag,
    };
    setReservations((prev) => [res, ...prev]);
    return res;
  }, []);

  const removeReservation = useCallback((id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, qty } : r)));
  }, []);

  const isReserved = useCallback(
    (bottleSlug: string) => reservations.some((r) => r.bottleSlug === bottleSlug),
    [reservations],
  );

  const getReservation = useCallback(
    (bottleSlug: string) => reservations.find((r) => r.bottleSlug === bottleSlug),
    [reservations],
  );

  const clearAll = useCallback(() => setReservations([]), []);

  const value = useMemo(
    () => ({ reservations, isReserved, addReservation, addBag, removeReservation, updateQty, getReservation, clearAll }),
    [reservations, isReserved, addReservation, addBag, removeReservation, updateQty, getReservation, clearAll],
  );

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>;
}

const noopReservation: Reservation = {
  id: "",
  bottleSlug: "",
  shopSlug: "",
  qty: 1,
  reservedAt: 0,
  status: "Order Received",
};

/** Safe fallback so a missing provider (e.g. during hot reload) never blanks the page. */
const FALLBACK_CTX: Ctx = {
  reservations: [],
  isReserved: () => false,
  addReservation: () => noopReservation,
  addBag: () => noopReservation,
  updateQty: () => {},
  getReservation: () => undefined,
  removeReservation: () => {},
  clearAll: () => {},
};

export function useReservations() {
  const ctx = useContext(ReservationsContext);
  return ctx ?? FALLBACK_CTX;
}

export function qrUrl(id: string, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=GRAPES-${encodeURIComponent(id)}`;
}
