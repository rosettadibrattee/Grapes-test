import { useCallback, useEffect, useState } from "react";

export type GrapesUser = { name: string; phone?: string; email?: string; via: "google" | "phone" };

const KEY = "grapes.user.v1";
const EVENT = "grapes:user-changed";

export function readUser(): GrapesUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GrapesUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: GrapesUser) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function signOutUser() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useUser() {
  const [user, setUser] = useState<GrapesUser | null>(null);

  useEffect(() => {
    setUser(readUser());
    const sync = () => setUser(readUser());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = useCallback((u: GrapesUser) => saveUser(u), []);
  return { user, signIn, signOut: signOutUser };
}
