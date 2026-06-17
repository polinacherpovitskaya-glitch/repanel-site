"use client";

import { useState } from "react";
import Link from "next/link";
import { FinalCTA } from "@/components/FinalCTA";
import { CaseStrip } from "@/components/CaseStrip";
import { cases, caseFilters } from "@/data/cases";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export default function ProjectsPage() {
  const [active, setActive] = useState("Все");
  const filtered = active === "Все" ? cases : cases.filter((c) => c.use === active);

  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-14 lg:pb-24">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          {/* Заголовок */}
          <h1 className="font-bold text-[#171513]"
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Проекты
          </h1>
          <p className="mt-3 lg:mt-4 text-[#171513] max-w-[640px]" style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.45, opacity: 0.6 }}>
            Объекты, интерьеры и тиражи из переработанного полистирола — для HoReCa, ритейла, офисов и девелоперов.
          </p>

          {/* Фильтр по сектору — текстовые лейблы с растущим подчёркиванием (в стиле сайта) */}
          <div className="flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-2 mt-7 lg:mt-9 mb-10 lg:mb-14">
            {caseFilters.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`group/filter relative cursor-pointer pb-1.5 transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-40 hover:opacity-75"}`}
                  style={{ fontFamily: BODY, fontWeight: 700, fontSize: "clamp(14.5px, 1.4vw, 17px)", color: "#171513", letterSpacing: "-0.01em" }}
                >
                  {f}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] transition-[width] duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover/filter:w-full"}`}
                    style={{ background: "#66704D" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Кейсы — каждый полоса из 4 вертикальных фото вплотную, подпись под кейсом */}
          <div className="flex flex-col gap-12 lg:gap-[84px]">
            {filtered.map((c) => (
              <Link key={c.slug} href={`/projects/${c.slug}`} className="group/case block">
                <CaseStrip photos={c.photos} alt={c.name} wide={c.wide} />
                <div className="pt-3 lg:pt-4">
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "12px", letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.45 }}>{c.use}</p>
                  <h3 className="font-bold text-[#171513] inline-block relative mt-1" style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.7vw, 42px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                    {c.name}
                    <span className="absolute left-0 -bottom-1 h-[2px] bg-[#171513] w-0 group-hover/case:w-full transition-[width] duration-[450ms] ease-out" />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA heading="Хотите так же?" text="Расскажите о проекте — подберём решение, материал и тираж под вашу задачу." />
    </>
  );
}
