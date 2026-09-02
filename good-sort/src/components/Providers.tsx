"use client";

import { CartProvider } from "@/lib/cart";
import { UIProvider } from "@/lib/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <CartProvider>{children}</CartProvider>
    </UIProvider>
  );
}
