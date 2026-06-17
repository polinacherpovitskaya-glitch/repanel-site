import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Group, DefRows } from "@/components/blocks";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Решения — RePanel",
  description: "Готовые решения из переработанного полистирола для HoReCa, торгового оборудования и готовой мебели — от листа до объекта под ключ.",
};

const sectors = [
  { title: "HoReCa", description: "Кафе, рестораны, бары, отели. Барные стойки, столешницы, панели.", href: "/solutions/horeca", img: "/images/DSC09441.jpg" },
  { title: "Торговое оборудование", description: "Магазины, шоурумы, торговые пространства. Витрины, острова, кассовые зоны, дисплеи.", href: "/solutions/retail", img: "/images/photo_2025-09-09 10.08.38.jpeg" },
  { title: "Готовая мебель", description: "Фасады, тумбы, storage и bespoke-предметы — от листа до готового изделия.", href: "/solutions/furniture-objects", img: "/images/ro0184.jpg" },
];

const stats = [
  { value: "40 000+", label: "объектов для крупнейших девелоперов" },
  { value: "1000+ м²", label: "панелей ежемесячно" },
  { value: "100+", label: "реализованных проектов" },
  { value: "12", label: "цветов в базовой палитре" },
];

const steps = [
  { t: "Бриф", d: "Вы описываете задачу, размеры и тираж — мы подбираем формат материала." },
  { t: "Подбор решения", d: "Подбираем цвет и обработку для максимальной стойкости в конкретных условиях." },
  { t: "Производство и поставка", d: "Изготавливаем и доставляем по графику: Москва и область — быстро, по России — от 3 дней." },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        title="Решения"
        image="/images/DSC09441.jpg"
        imageAlt="Решения RePanel"
        lead="Готовые решения из переработанного полистирола для HoReCa, торгового оборудования и готовой мебели — от листа до объекта под ключ."
      />

      <Group title="По секторам">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
          {sectors.map((s) => (
            <Link key={s.href} href={s.href} className="group/card block">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 2" }}>
                <Image src={s.img} alt={s.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="pt-4">
                <h3 className="font-bold text-[#171513] inline-block relative" style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.6vw, 38px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                  {s.title}
                  <span className="absolute left-0 -bottom-1 h-[2px] bg-[#171513] w-0 group-hover/card:w-full transition-[width] duration-[450ms] ease-out" />
                </h3>
                <p className="text-[#171513] mt-2 max-w-[420px]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px", opacity: 0.7 }}>{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Group>

      {/* Цифры */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
        <div className="mx-auto border-t border-[#171513] pt-8" style={{ maxWidth: 1440 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <span className="block font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(34px, 3.6vw, 50px)", letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</span>
                <span className="block mt-2 text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: 1.4, opacity: 0.7 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Group title="Как мы работаем">
        <DefRows rows={steps} />
      </Group>

      <FinalCTA />
    </>
  );
}
