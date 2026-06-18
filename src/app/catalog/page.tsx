import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { CatalogGrid } from "@/components/CatalogGrid";
import { supabase, type Product } from "@/lib/supabase";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Магазин RePanel — изделия из переработанного полистирола",
  description:
    "Готовые предметы из переработанного полистирола: мебель, аксессуары, наборы образцов. Адаптируем под цвет, размер и тираж.",
};

export const revalidate = 60;

export default async function CatalogPage() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  const products = (data ?? []) as Product[];

  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-16 lg:pb-28">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h1
            className="font-bold text-[#171513]"
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}
          >
            Магазин
          </h1>
          <p
            className="mt-3 lg:mt-4 text-[#171513] max-w-[640px]"
            style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.45, opacity: 0.6 }}
          >
            Готовые предметы из переработанного полистирола. Любой адаптируем под цвет, размер и тираж.
          </p>

          <CatalogGrid products={products} />
        </div>
      </section>

      <FinalCTA heading="Нужно что-то особенное?" text="Разработаем предмет с нуля или адаптируем существующий под ваши задачи и тираж." />
    </>
  );
}
