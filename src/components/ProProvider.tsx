"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProContextValue = { isPro: boolean; refresh: () => void };

const ProContext = createContext<ProContextValue>({
  isPro: false,
  refresh: () => {},
});

function readProCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("supplyr_pro=1"));
}

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);

  const refresh = () => setIsPro(readProCookie());

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    const onPro = () => refresh();
    window.addEventListener("focus", onFocus);
    window.addEventListener("supplyr-pro", onPro);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("supplyr-pro", onPro);
    };
  }, []);

  const value = useMemo(() => ({ isPro, refresh }), [isPro]);
  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function useProStatus() {
  return useContext(ProContext);
}
