import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Прайс-лист RePanel — ориентиры по ценам",
  description:
    "Ориентировочные цены RePanel: образцы, листы из переработанного пластика, цвет, готовые изделия. Точный расчёт под проект — по запросу.",
};

type Row = { label: string; value: string; note?: string };
type Block = { title: string; rows: Row[]; cta?: { label: string; href: string } };

const blocks: Block[] = [
  {
    title: "Образцы",
    rows: [
      { label: "6 цветов", value: "3 500 ₽" },
      { label: "9 цветов", value: "4 500 ₽" },
      { label: "12 цветов", value: "5 500 ₽" },
    ],
    cta: { label: "Собрать набор образцов →", href: "/samples" },
  },
  {
    title: "Листы",
    rows: [
      { label: "Лист 20 мм, 1 м²", value: "от ~20 000 ₽", note: "при тираже; тоньше — дешевле, толще — дороже" },
      { label: "Толщины", value: "12 / 16 / 20 / 30 / 40 мм" },
      { label: "Форматы", value: "1000×1000 · 2200×1100 мм" },
    ],
    cta: { label: "Рассчитать под проект →", href: "/contacts" },
  },
  {
    title: "Цвет",
    rows: [
      { label: "Базовое сочетание", value: "в стоимости листа", note: "12 складских сочетаний" },
      { label: "Подбор из гранул", value: "+ 18 000 ₽", note: "микс под проект, включены 3 образца" },
      { label: "Покраска RAL / Pantone", value: "+ 144 000 ₽", note: "от 500 кг сырья на цвет, включены 3 образца" },
    ],
  },
  {
    title: "Готовые изделия и решения",
    rows: [
      { label: "Изделия из магазина", value: "от 1 800 ₽" },
      { label: "Столешницы", value: "по запросу", note: "считаем по раскрою и обработке" },
      { label: "Проект под ключ", value: "индивидуально" },
    ],
    cta: { label: "Перейти в магазин →", href: "/catalog" },
  },
];

export default function PricesPage() {
  return (
    <>
      <PageHero
        title="Прайс-лист"
        image="/images/colors/color-02.jpg"
        imageAlt="Палитра RePanel"
        lead="Ориентиры, чтобы прикинуть бюджет. Точную стоимость под проект — по площади, толщине и тиражу — считаем по запросу."
      />

      <section className="px-[var(--site-margins)] pt-12 lg:pt-20 pb-8 lg:pb-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 lg:gap-y-14">
            {blocks.map((b) => (
              <div key={b.title}>
                <h2 className="font-bold text-[#171513] border-b border-[#171513] pb-3 mb-1" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(22px, 2.2vw, 31px)", letterSpacing: "-0.4px" }}>
                  {b.title}
                </h2>
                {b.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-[#171513]/12 py-3.5">
                    <div>
                      <span className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "15px", fontWeight: 700 }}>{r.label}</span>
                      {r.note && <span className="block text-[#171513]" style={{ fontFamily: BODY, fontSize: "12.5px", opacity: 0.5, lineHeight: 1.4, marginTop: 2 }}>{r.note}</span>}
                    </div>
                    <span className="text-[#171513] text-right whitespace-nowrap" style={{ fontFamily: BODY, fontSize: "15px", fontWeight: 700 }}>{r.value}</span>
                  </div>
                ))}
                {b.cta && (
                  <Link href={b.cta.href} className="group/l relative inline-block mt-4 font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.5px" }}>
                    {b.cta.label}
                    <span className="absolute left-0 -bottom-0.5 h-[1.5px] bg-[#66704D] w-0 group-hover/l:w-full transition-[width] duration-300 ease-out" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="mt-12 lg:mt-16 max-w-[680px] text-[#171513]" style={{ fontFamily: BODY, fontSize: "13.5px", lineHeight: "20px", opacity: 0.6 }}>
            Цены — ориентировочные, с НДС. Зависят от объёма, толщины, цвета и обработки. Это не оферта: точную смету под ваш проект пришлём после короткого запроса.
          </p>
        </div>
      </section>

      <FinalCTA heading="Посчитать ваш проект?" text="Опишите задачу — пришлём точную смету с раскроем и сроками." />
    </>
  );
}
