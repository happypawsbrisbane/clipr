import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InfoPanel } from "@/components/InfoPanel";
import { MobileMenu } from "@/components/MobileMenu";
import { Providers } from "@/components/Providers";
import { QuickView } from "@/components/QuickView";
import { SearchOverlay } from "@/components/SearchOverlay";
import { Toast } from "@/components/Toast";

// The brand guide names Neue Montreal Bold and Suisse Int'l, both commercial,
// and nominates Archivo Black and Inter as the web substitutes.
const display = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display-face",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Good Sort. Australian wearables for dogs & humans",
  description:
    "Good-looking gear for dogs, humans and everywhere you go together. Harnesses, leads, tees and walk gear, designed in Brisbane. Est. 2024.",
};

export const viewport: Viewport = {
  themeColor: "#F5F0E7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-chalk"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileMenu />
          <SearchOverlay />
          <CartDrawer />
          <QuickView />
          <InfoPanel />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
