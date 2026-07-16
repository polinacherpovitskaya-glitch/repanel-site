import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { SolutionModelCard } from "@/components/SolutionModelCard";
import { objectsByCategory } from "@/data/solutionObjects";
import { getBlanksCatalog, findBlankBySlug, blankFromPrice } from "@/lib/calc";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Готовые решения RePanel — мебель с 3D-подбором цвета",
  description:
    "Предметы из переработанного полистирола под заказ. Откройте предмет, покрутите в 3D, подберите цвет из 12 — и сразу узнайте цену.",
};

function SectionLabel({ title }: { title: string }) {
  return (
    <h2
      className="font-bold text-[#171513] border-b border-[#171513] pb-3"
      style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(22px, 3vw, 38px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
    >
      {title}
    </h2>
  );
}

export default async function SolutionsPage() {
  const horeca = objectsByCategory("horeca");
  const catalog = await getBlanksCatalog();

  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-4 lg:pb-6">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h1
            className="font-bold text-[#171513]"
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}
          >
            Готовые решения
          </h1>
          <p className="mt-3 lg:mt-4 text-[#171513] max-w-[640px]" style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.45, opacity: 0.6 }}>
            Предметы из переработанного полистирола под заказ. Откройте предмет, покрутите в 3D, подберите цвет из 12 — и сразу узнайте цену.
          </p>
        </div>
      </section>

      <section className="px-[var(--site-margins)] pb-12 lg:pb-20">
        <div className="mx-auto flex flex-col gap-12 lg:gap-16" style={{ maxWidth: 1440 }}>
          {/* HoReCa — рабочая коллекция */}
          <div>
            <SectionLabel title="HoReCa" />
            <div className="mt-5 lg:mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {horeca.map((o) => {
                const b = findBlankBySlug(catalog, o.calcSlug);
                return <SolutionModelCard key={o.slug} object={o} fromPrice={b ? blankFromPrice(b) : null} />;
              })}
            </div>
          </div>

          {/* Ритейл — пока пусто */}
          <div>
            <SectionLabel title="Ритейл" />
            <p className="mt-4" style={{ fontFamily: BODY, fontSize: 14, color: "rgba(23,21,19,0.4)" }}>
              Готовим коллекцию.
            </p>
          </div>

          {/* Мебель — бюро Румянцева — пока пусто */}
          <div>
            <SectionLabel title="Мебель — бюро Румянцева" />
            <p className="mt-4" style={{ fontFamily: BODY, fontSize: 14, color: "rgba(23,21,19,0.4)" }}>
              Готовим коллекцию.
            </p>
          </div>
        </div>
      </section>

      <FinalCTA heading="Нужно готовое решение под ваш проект?" text="Подберём изделие под формат, рассчитаем стоимость и пришлём образцы материала." />
    </>
  );
}
