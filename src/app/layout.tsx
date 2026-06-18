import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PromoBar } from "@/components/PromoBar";
import { CookieConsent } from "@/components/CookieConsent";
import { PageTransition } from "@/components/PageTransition";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { HideOnAdmin } from "@/components/HideOnAdmin";

export const metadata: Metadata = {
  title: "RePanel — панели и изделия из переработанного пластика",
  description:
    "Панели, детали и готовые решения из переработанного пластика для ритейла, HoReCa и общественных пространств. Москва и МО.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className="h-full"
      style={{ fontFamily: "'Gramatika', system-ui, -apple-system, sans-serif" }}
    >
      <body
        className="min-h-full flex flex-col antialiased overflow-x-hidden"
        style={{ background: "#FFFFFF", color: "#171513" }}
      >
        <CartProvider>
          <HideOnAdmin>
            <Header />
          </HideOnAdmin>
          <main className="flex-1">{children}</main>
          <HideOnAdmin>
            <Footer />
            <PromoBar />
            <CookieConsent />
          </HideOnAdmin>
          <PageTransition />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
