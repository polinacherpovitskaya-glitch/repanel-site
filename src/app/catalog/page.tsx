"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";

const BODY = "'Gramatika', sans-serif";
const OLIVE = "#66704D";

const filters = ["Все", "Образцы", "Мебель", "Аксессуары", "HoReCa", "Офис", "Дети"];

type Product = { slug: string; name: string; price: string; badge?: string; cat: string; use: string; sample?: boolean };

const products: Product[] = [
  { slug: "obraztsy", name: "Набор образцов", price: "от 3 500 ₽", cat: "Образцы", use: "6 / 9 / 12 цветов", sample: true },
  { slug: "stool-01", name: "Табурет RePanel", price: "от 8 500 ₽", badge: "Хит", cat: "Мебель", use: "HoReCa · дом" },
  { slug: "board-serving", name: "Сервировочная доска", price: "от 3 200 ₽", badge: "Новинка", cat: "Аксессуары", use: "Кухня · подарки" },
  { slug: "organizer-desk", name: "Органайзер настольный", price: "от 4 800 ₽", cat: "Офис", use: "Стол · мерч" },
  { slug: "shelf-wall", name: "Полка модульная", price: "от 6 900 ₽", cat: "Мебель", use: "Интерьер · ритейл" },
  { slug: "planter-floor", name: "Кашпо", price: "от 5 500 ₽", cat: "Аксессуары", use: "Лобби · дом" },
  { slug: "kids-table", name: "Столик детский", price: "от 7 200 ₽", cat: "Дети", use: "Детская · ЖК" },
  { slug: "tray", name: "Поднос", price: "от 2 800 ₽", badge: "Новинка", cat: "Аксессуары", use: "HoReCa · дом" },
  { slug: "bench", name: "Скамья", price: "от 12 000 ₽", cat: "Мебель", use: "Public · интерьер" },
  { slug: "menu-holder", name: "Менюхолдер", price: "от 3 500 ₽", cat: "HoReCa", use: "Кафе · бары" },
  { slug: "coaster-set", name: "Подставки (набор)", price: "от 1 800 ₽", cat: "Аксессуары", use: "Стол · подарки" },
  { slug: "kids-stool", name: "Табурет детский", price: "от 6 400 ₽", cat: "Дети", use: "Детская · кафе" },
  { slug: "console", name: "Консоль", price: "от 15 000 ₽", cat: "Мебель", use: "Прихожая · лобби" },
  { slug: "menu-stand", name: "Держатель меню", price: "от 2 200 ₽", cat: "HoReCa", use: "HoReCa" },
];

export default function CatalogPage() {
  const [active, setActive] = useState("Все");
  const filtered = active === "Все" ? products : products.filter((p) => p.cat === active);

  return (
    <>
      <PageHero
        title="Магазин"
        image="/images/DSC02233.jpg"
        imageAlt="Каталог изделий RePanel"
        lead="Готовые предметы из переработанного полистирола. Каждый можно адаптировать под цвет, размер и тираж."
      />

      <section className="px-[var(--site-margins)] pt-12 lg:pt-20 pb-20 lg:pb-32">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          {/* Фильтры */}
          <div className="flex flex-wrap gap-2 mb-8 lg:mb-10">
            {filters.map((f) => {
              const on = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className="px-4 py-2 transition-colors cursor-pointer"
                  style={{ fontFamily: BODY, fontWeight: 700, fontSize: "13px", border: `1px solid ${on ? "#171513" : "rgba(23,21,19,0.22)"}`, background: on ? "#171513" : "transparent", color: on ? "#FFFFFF" : "#171513" }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Сетка карточек — рецепт recycleobject, палитра RePanel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                href={p.sample ? "/samples" : `/catalog/${p.slug}`}
                className="group/card flex flex-col bg-white"
                style={{ border: "1px solid rgba(23,21,19,0.1)" }}
              >
                {/* Фото / превью */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3", background: "#EAEAE7" }}>
                  {p.badge && (
                    <span
                      className="absolute left-2.5 top-2.5 z-[2] uppercase"
                      style={{ fontFamily: BODY, fontWeight: 700, fontSize: "10px", letterSpacing: "0.04em", padding: "3px 8px", background: OLIVE, color: "#FFFFFF" }}
                    >
                      {p.badge}
                    </span>
                  )}
                  {p.sample ? (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="relative overflow-hidden">
                          <Image src={`/images/colors/color-${i}.jpg`} alt="" fill className="object-cover" sizes="12vw" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ fontFamily: BODY, fontSize: "12px", opacity: 0.3 }}>Фото</span>
                    </div>
                  )}
                </div>

                {/* Тело */}
                <div className="p-4">
                  <p style={{ fontFamily: BODY, fontSize: "11px", color: "rgba(23,21,19,0.35)" }}>{p.cat}</p>
                  <h3 className="relative inline-block" style={{ color: "#171513", fontFamily: BODY, fontWeight: 700, fontSize: "15px", lineHeight: 1.25, marginTop: 2 }}>
                    {p.name}
                    <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 group-hover/card:w-full transition-[width] duration-300 ease-out" style={{ background: OLIVE }} />
                  </h3>
                  <p style={{ fontFamily: BODY, fontSize: "12px", color: "rgba(23,21,19,0.4)", marginTop: 2 }}>{p.use}</p>
                  <p style={{ color: "#171513", fontFamily: BODY, fontWeight: 700, fontSize: "15px", marginTop: 10 }}>{p.price}</p>
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
