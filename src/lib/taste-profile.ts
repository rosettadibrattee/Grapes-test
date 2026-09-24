import { useCallback, useEffect, useState } from "react";

export type TasteProfile = {
  drink: string;
  flavor: string;
  vibe: string;
  completedAt: string;
};

const KEY = "grapes.tasteProfile.v1";
const EVENT = "grapes:taste-profile-changed";

export function readTasteProfile(): TasteProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TasteProfile) : null;
  } catch {
    return null;
  }
}

export function saveTasteProfile(p: Omit<TasteProfile, "completedAt">) {
  const full: TasteProfile = { ...p, completedAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(full));
  } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
  return full;
}

export function clearTasteProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

/** True when no Wine DNA has been saved yet on this device. */
export function isFirstTimeUser() {
  return readTasteProfile() === null;
}

/** Short natural-language hint appended to AI Sommelier requests. */
export function tasteHint(p: TasteProfile | null): string {
  if (!p) return "";
  return ` (Personal Wine DNA — drinks: ${p.drink}; flavors: ${p.flavor}; usual bottle: ${p.vibe}. Favor bottles that fit this palate and budget.)`;
}

export function useTasteProfile() {
  const [profile, setProfile] = useState<TasteProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(readTasteProfile());
    setReady(true);
    const sync = () => setProfile(readTasteProfile());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback(
    (p: Omit<TasteProfile, "completedAt">) => setProfile(saveTasteProfile(p)),
    [],
  );

  return { profile, ready, save, clear: clearTasteProfile };
}
