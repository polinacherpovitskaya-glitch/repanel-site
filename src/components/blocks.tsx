import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Общие блоки для внутренних страниц в стиле главной / страницы «Материал».
 * Заголовки секций — Chalet, слева, как на главной. Хайрлайн-якоря — как в Figma-шаблоне.
 */

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

export const SITE_MAX = 1440;

// Заголовок секции — размер как у заголовков главной
export function GroupTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="font-bold text-[#171513] mb-5 lg:mb-7"
      style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}
    >
      {children}
    </h2>
  );
}

// Секция с большим верхним воздухом + заголовком (как группы на «Материале»)
export function Group({ title, children, className = "", id }: { title: string; children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`px-[var(--site-margins)] pt-20 lg:pt-36 ${className}`} style={id ? { scrollMarginTop: 80 } : undefined}>
      <div className="mx-auto" style={{ maxWidth: SITE_MAX }}>
        <GroupTitle>{title}</GroupTitle>
        {children}
      </div>
    </section>
  );
}

// Крупный жирный стейтмент сразу под героем
export function Statement({ children }: { children: ReactNode }) {
  return (
    <section className="px-[var(--site-margins)] pt-5">
      <div className="mx-auto" style={{ maxWidth: SITE_MAX }}>
        <p style={{ fontFamily: BODY, fontWeight: 700, color: "#171513", fontSize: "clamp(16.8px, 4.5vw, 31.9px)", lineHeight: 1.37, letterSpacing: "-0.021em" }}>
          {children}
        </p>
      </div>
    </section>
  );
}

// Деф-строки: хайрлайн + жирный ярлык (5 кол.) + текст (4 кол.), сдвиг к 4-й колонке
export function DefRows({ rows }: { rows: { t: string; d: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
      <div className="md:col-start-4 md:col-span-9">
        {rows.map((r) => (
          <div key={r.t} className="border-t border-[#171513] grid grid-cols-1 md:grid-cols-9 gap-y-4 md:gap-y-1 gap-x-5 pt-5 md:pt-3 pb-6 md:pb-5">
            <h3 className="md:col-span-5 font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "18.6px", lineHeight: "22.77px", letterSpacing: "-0.36px" }}>{r.t}</h3>
            <p className="md:col-span-4 text-[#171513]" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px" }}>{r.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Чередующиеся ряды «фото + текст» (как «Как мы это делаем»): фото 3 кол., текст 4 кол.,
// позиции чередуются слева→справа, текст заякорен хайрлайном и выровнен по верху фото.
const altRowLayouts = [
  { photo: "lg:col-span-3 lg:row-start-1", text: "lg:col-start-4 lg:col-span-4 lg:row-start-1" },
  { photo: "lg:col-start-10 lg:col-span-3 lg:row-start-1", text: "lg:col-start-6 lg:col-span-4 lg:row-start-1" },
];
export function AltRows({ rows }: { rows: { name: string; desc: string; img: string }[] }) {
  return (
    <div>
      {rows.map((row, i) => {
        const L = altRowLayouts[i % 2];
        return (
          <div key={row.name} className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-5">
            <div className={`relative aspect-square overflow-hidden order-first lg:order-none ${L.photo}`}>
              <Image src={row.img} alt={row.name} fill sizes="(min-width:1024px) 25vw, 100vw" className="object-cover" />
            </div>
            <div className={`border-t border-[#171513] pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 self-start ${L.text}`}>
              <h3 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.2vw, 31.7px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{row.name}</h3>
              <p style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px", color: "#171513" }}>{row.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Свайп-карусель карточек (паттерн главной): фото 455/606 + подпись с hover-подчёркиванием
export function Carousel({ items }: { items: { title: string; img: string; href?: string }[] }) {
  return (
    <div className="flex gap-3 lg:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mr-[var(--site-margins)] pr-[var(--site-margins)]">
      {items.map((d) => {
        const inner = (
          <>
            <div className="relative overflow-hidden" style={{ aspectRatio: "455 / 606" }}>
              <Image src={d.img} alt={d.title} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "rgba(255, 255, 255,0.82)" }} />
            </div>
            <div className="pt-1.5">
              <h3 className="font-bold text-[#171513] inline-block relative" style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.5vw, 18px)", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                {d.title}
                <span className="absolute left-0 -bottom-1 h-[1.5px] bg-[#171513] w-0 group-hover/card:w-full transition-[width] duration-[450ms] ease-out" />
              </h3>
            </div>
          </>
        );
        const cls = "group/card block shrink-0 w-[clamp(240px,42vw,330px)] snap-start";
        return d.href ? (
          <Link key={d.title} href={d.href} className={cls}>{inner}</Link>
        ) : (
          <div key={d.title} className={cls}>{inner}</div>
        );
      })}
    </div>
  );
}
