import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SavedPair = {
  id: string;
  dishName: string;
  dishImage: string;
  why: string;
  ingredients: string[];
  difficulty: string;
  timeMinutes: number;
  steps?: string;
  bottleName: string;
  bottleSlug?: string;
  bottleImage?: string;
  shopName?: string;
  savedAt: number;
};

type Ctx = {
  pairs: SavedPair[];
  isSaved: (id: string) => boolean;
  savePair: (pair: Omit<SavedPair, "savedAt">) => void;
  removePair: (id: string) => void;
};

const SavedPairsContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "grapes.savedPairs.v1";

export function makePairId(dishName: string, bottleName: string) {
  return `${bottleName}::${dishName}`.toLowerCase().replace(/\s+/g, "-");
}

export function SavedPairsProvider({ children }: { children: ReactNode }) {
  const [pairs, setPairs] = useState<SavedPair[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPairs(JSON.parse(raw) as SavedPair[]);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
    } catch {}
  }, [pairs]);

  const savePair = useCallback((pair: Omit<SavedPair, "savedAt">) => {
    setPairs((prev) =>
      prev.some((p) => p.id === pair.id) ? prev : [{ ...pair, savedAt: Date.now() }, ...prev],
    );
  }, []);

  const removePair = useCallback((id: string) => {
    setPairs((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const isSaved = useCallback((id: string) => pairs.some((p) => p.id === id), [pairs]);

  const value = useMemo(
    () => ({ pairs, isSaved, savePair, removePair }),
    [pairs, isSaved, savePair, removePair],
  );

  return <SavedPairsContext.Provider value={value}>{children}</SavedPairsContext.Provider>;
}

export function useSavedPairs() {
  const ctx = useContext(SavedPairsContext);
  if (!ctx) throw new Error("useSavedPairs must be used within SavedPairsProvider");
  return ctx;
}
