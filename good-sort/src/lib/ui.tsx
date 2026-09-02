"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ColourKey, Kind, Product } from "./catalogue";
import type { InfoTopic } from "./info";

export type QuickViewRequest = { product: Product; colour?: ColourKey };

type Toast = { id: number; message: string };

type UIContextValue = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  quickView: QuickViewRequest | null;
  openQuickView: (req: QuickViewRequest) => void;
  closeQuickView: () => void;
  info: InfoTopic | null;
  openInfo: (topic: InfoTopic) => void;
  closeInfo: () => void;
  filter: Kind | "all";
  setFilter: (kind: Kind | "all") => void;
  toast: Toast | null;
  notify: (message: string) => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<QuickViewRequest | null>(null);
  const [info, setInfo] = useState<InfoTopic | null>(null);
  const [filter, setFilter] = useState<Kind | "all">("all");
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);

  const closeAll = useCallback(() => {
    setCartOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
    setQuickView(null);
    setInfo(null);
  }, []);

  const notify = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      cartOpen,
      openCart: () => {
        closeAll();
        setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      menuOpen,
      openMenu: () => {
        closeAll();
        setMenuOpen(true);
      },
      closeMenu: () => setMenuOpen(false),
      searchOpen,
      openSearch: () => {
        closeAll();
        setSearchOpen(true);
      },
      closeSearch: () => setSearchOpen(false),
      quickView,
      openQuickView: (req) => {
        closeAll();
        setQuickView(req);
      },
      closeQuickView: () => setQuickView(null),
      info,
      openInfo: (topic) => {
        closeAll();
        setInfo(topic);
      },
      closeInfo: () => setInfo(null),
      filter,
      setFilter,
      toast,
      notify,
    }),
    [cartOpen, menuOpen, searchOpen, quickView, info, filter, toast, closeAll, notify],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}
