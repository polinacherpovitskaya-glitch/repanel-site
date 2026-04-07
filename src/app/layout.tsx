import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* Montserrat — display/heading font (matches Recycle Object site) */
const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "700", "900"],
});

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
      className={`${display.variable} h-full`}
      style={{ fontFamily: "'Gramatika', system-ui, -apple-system, sans-serif" }}
    >
      <body
        className="min-h-full flex flex-col antialiased overflow-x-hidden"
        style={{ background: "#FFFFFF", color: "#171513" }}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
