"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { PRODUCT_BY_ID, type ColourKey, type Product } from "./catalogue";

export type Line = {
  id: string;
  productId: string;
  colour: ColourKey;
  size: string;
  qty: number;
};

type State = { lines: Line[] };

type Action =
  | { type: "hydrate"; lines: Line[] }
  | { type: "add"; productId: string; colour: ColourKey; size: string; qty: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

const lineId = (productId: string, colour: ColourKey, size: string) => `${productId}:${colour}:${size}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const id = lineId(action.productId, action.colour, action.size);
      const existing = state.lines.find((l) => l.id === id);
      if (existing) {
        return {
          lines: state.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + action.qty } : l)),
        };
      }
      return {
        lines: [
          ...state.lines,
          { id, productId: action.productId, colour: action.colour, size: action.size, qty: action.qty },
        ],
      };
    }
    case "setQty":
      if (action.qty <= 0) return { lines: state.lines.filter((l) => l.id !== action.id) };
      return { lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty: action.qty } : l)) };
    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return { lines: [] };
  }
}

type CartContextValue = {
  lines: Line[];
  count: number;
  subtotalCents: number;
  add: (product: Product, colour: ColourKey, size: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "good-sort-cart";

function isLine(value: unknown): value is Line {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.productId === "string" &&
    typeof v.colour === "string" &&
    typeof v.size === "string" &&
    typeof v.qty === "number" &&
    v.productId in PRODUCT_BY_ID
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed.filter(isLine) });
      }
    } catch {
      // Ignore a bad or unavailable store; start empty.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage may be unavailable; the cart still works for the session.
    }
  }, [state.lines, hydrated]);

  const add = useCallback<CartContextValue["add"]>((product, colour, size, qty = 1) => {
    dispatch({ type: "add", productId: product.id, colour, size, qty });
  }, []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.qty, 0);
    const subtotalCents = state.lines.reduce(
      (n, l) => n + l.qty * (PRODUCT_BY_ID[l.productId]?.priceCents ?? 0),
      0,
    );
    return { lines: state.lines, count, subtotalCents, add, setQty, remove, clear };
  }, [state.lines, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
