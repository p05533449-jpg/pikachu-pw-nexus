import { useEffect, useState } from "react";

const KEY = "nexus-admin";

/** Persistent admin session (survives refresh + reopen; cleared only on logout). */
export function readAdminCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY) ?? window.sessionStorage.getItem(KEY);
}

export function saveAdminCode(code: string) {
  window.localStorage.setItem(KEY, code);
}

export function clearAdminCode() {
  window.localStorage.removeItem(KEY);
  window.sessionStorage.removeItem(KEY);
}

/** True once an admin code is stored locally — used to bypass maintenance mode. */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(Boolean(readAdminCode()));
    const onStorage = () => setIsAdmin(Boolean(readAdminCode()));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return isAdmin;
}
