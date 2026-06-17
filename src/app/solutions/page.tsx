import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FinalCTA } from "@/components/FinalCTA";
import { SolutionFlowPreview } from "@/components/SolutionFlowPreview";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Готовые решения RePanel — HoReCa, ритейл, мебель",
  description:
    "Просчитанные готовые изделия из переработанного полистирола для HoReCa и ритейла, а также мебель бюро Румянцева. Скоро — 3D-модели: выберите цвет и закажите без проектирования.",
};

const pillars = [
  {
    title: "HoReCa",
    href: "/solutions/horeca",
    cover: "/images/applications/hospitality-entrance-bar-tops.png",
    text: "Барные стойки, столешницы и входные группы — просчитанные изделия для кафе, баров и ресторанов.",
  },
  {
    title: "Ритейл",
    href: "/solutions/retail",
    cover: "/images/applications/retail-shopfloor-wall-panelling.png",
    text: "Торговое оборудование, стеновые панели, ресепшены и витрины для магазинов и шоурумов.",
  },
  {
    title: "Мебель — бюро Румянцева",
    href: "/solutions/furniture-objects",
    cover: "/images/applications/work-meeting-boardroom-table.png",
    text: "Готовые предметы мебели в коллаборации с бюро Румянцева. Выбираете цвет — и заказываете без проектирования.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-4 lg:pb-6">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Готовые решения
          </h1>
          <p className="mt-3 lg:mt-4 text-[#171513] max-w-[700px]" style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.45, opacity: 0.6 }}>
            Просчитанные изделия из переработанного полистирола под конкретные направления. Скоро — 3D-модели: выбираете цвет, скачиваете модель для своего проекта и заказываете без долгого проектирования.
          </p>
        </div>
      </section>

      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-6 lg:pb-10">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-9">
            {pillars.map((p) => (
              <Link key={p.title} href={p.href} className="group/sol block">
                <div className="relative w-full overflow-hidden aspect-square lg:aspect-[4/3]">
                  <Image src={p.cover} alt={p.title} fill sizes="(min-width:1024px) 33vw, 100vw" quality={95} className="object-cover transition-transform duration-500 ease-out group-hover/sol:scale-[1.03]" />
                  <span
                    className="absolute left-3 top-3 px-2 py-[3px]"
                    style={{ fontFamily: BODY, fontSize: "11.5px", letterSpacing: "0.04em", textTransform: "uppercase", background: "rgba(255,255,255,0.92)", color: "#171513", borderRadius: 6 }}
                  >
                    3D-модели — скоро
                  </span>
                </div>
                <div className="pt-3">
                  <h2 className="font-bold text-[#171513] inline-block relative" style={{ fontFamily: DISPLAY, fontSize: "clamp(20px, 2.2vw, 30px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {p.title}
                    <span className="absolute left-0 -bottom-1 h-[2px] bg-[#171513] w-0 group-hover/sol:w-full transition-[width] duration-[450ms] ease-out" />
                  </h2>
                  <p className="text-[#171513] mt-2 max-w-[420px]" style={{ fontFamily: BODY, fontSize: "14.5px", lineHeight: 1.45, opacity: 0.6 }}>{p.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SolutionFlowPreview />

      <FinalCTA heading="Нужно готовое решение под ваш проект?" text="Подберём изделие под формат, рассчитаем стоимость и пришлём образцы материала." />
    </>
  );
}
