"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FinalCTA } from "@/components/FinalCTA";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const OLIVE = "#66704D";

const filters = ["Все", "Образцы", "Мебель", "Аксессуары", "Дети"];

const productColors = ["#E8A33D", "#F3EFE6", "#171513", "#C9B79A", "#5A6647", "#3C4657", "#16233D"];
const sampleColors = Array.from({ length: 12 }, (_, i) => `/images/colors/color-${String(i + 1).padStart(2, "0")}.jpg`);

type Product = { slug: string; name: string; price: string; cat: string; img: string; sample?: boolean };

const products: Product[] = [
  { slug: "obraztsy", name: "Набор образцов", price: "от 3 500 ₽", cat: "Образцы", img: "/images/obraztsy-card.png", sample: true },
  { slug: "side-table", name: "Приставной столик", price: "от 12 900 ₽", cat: "Мебель", img: "/images/shop/shop-stolik.png" },
  { slug: "clock", name: "Настольные часы", price: "от 4 500 ₽", cat: "Аксессуары", img: "/images/shop/shop-chasy.png" },
  { slug: "rocking-horse", name: "Лошадка-качалка", price: "от 8 900 ₽", cat: "Дети", img: "/images/shop/shop-loshadka.png" },
  { slug: "step-stool", name: "Стул-стремянка", price: "от 9 900 ₽", cat: "Мебель", img: "/images/shop/shop-stremianka.png" },
  { slug: "stool-01", name: "Табурет", price: "от 7 500 ₽", cat: "Мебель", img: "/images/shop/shop-taburet.png" },
  { slug: "bench", name: "Скамья", price: "от 14 900 ₽", cat: "Мебель", img: "/images/shop/shop-skameika.png" },
];

export default function CatalogPage() {
  const [active, setActive] = useState("Все");
  const filtered = active === "Все" ? products : products.filter((p) => p.cat === active);

  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-16 lg:pb-28">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          {/* Заголовок — как в проектах */}
          <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Магазин
          </h1>
          <p className="mt-3 lg:mt-4 text-[#171513] max-w-[640px]" style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.45, opacity: 0.6 }}>
            Готовые предметы из переработанного полистирола. Любой адаптируем под цвет, размер и тираж.
          </p>

          {/* Фильтр — текстовые лейблы (как в проектах) */}
          <div className="flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-2 mt-7 lg:mt-9 mb-8 lg:mb-12">
            {filters.map((f) => {
              const on = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`group/filter relative cursor-pointer pb-1.5 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-40 hover:opacity-75"}`}
                  style={{ fontFamily: BODY, fontWeight: 700, fontSize: "clamp(14.5px, 1.4vw, 17px)", color: "#171513", letterSpacing: "-0.01em" }}
                >
                  {f}
                  <span className={`absolute left-0 bottom-0 h-[2px] transition-[width] duration-300 ease-out ${on ? "w-full" : "w-0 group-hover/filter:w-full"}`} style={{ background: OLIVE }} />
                </button>
              );
            })}
          </div>

          {/* Сетка карточек — точь-в-точь как блок «Магазин» на главной */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                href={p.sample ? "/samples" : `/catalog/${p.slug}`}
                className="group/card relative flex flex-col bg-[#EAEAE7]"
                style={{ border: "1px solid rgba(23,21,19,0.1)" }}
              >
                {/* Лупа на ховере — всегда сверху */}
                <span
                  className="absolute left-2.5 top-2.5 z-10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                  style={{ width: 38, height: 38, borderRadius: 10, background: "#171513" }}
                  aria-hidden
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M21 21l-5-5" /></svg>
                </span>

                {/* Фото — единая структура (парит на сером, поднимается на ховере) */}
                <div className="w-full px-5 pt-9 pb-[34px]" style={{ background: "#EAEAE7" }}>
                  <div className="relative w-full aspect-square transition-transform duration-300 ease-out group-hover/card:-translate-y-2">
                    <Image src={p.img} alt={p.name} fill sizes="(min-width:1024px) 22vw, 45vw" quality={95} className={`object-contain ${p.sample ? "scale-[0.7]" : ""}`} />
                  </div>
                </div>

                {/* Тело — имя/цена едут вверх, снизу появляются кружочки цветов */}
                <div className="relative w-full px-2.5 pb-2.5 pt-1">
                  <div className="transition-transform duration-300 ease-out group-hover/card:-translate-y-[26px]">
                    <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.4px", lineHeight: "20px", fontWeight: 700 }}>{p.name}</p>
                    <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13.8px", lineHeight: "20px", fontWeight: 400 }}>{p.price}</p>
                  </div>
                  <div className="absolute inset-x-2.5 bottom-2.5 flex flex-wrap items-center gap-[5px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ease-out" style={{ transitionDelay: "80ms" }}>
                    {(p.sample ? sampleColors : productColors).map((c, i) => (
                      <span
                        key={i}
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: 9999,
                          border: "1px solid rgba(0,0,0,0.12)",
                          flexShrink: 0,
                          ...(p.sample ? { backgroundImage: `url(${c})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: c }),
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA heading="Нужно что-то особенное?" text="Разработаем предмет с нуля или адаптируем существующий под ваши задачи и тираж." />
    </>
  );
}
