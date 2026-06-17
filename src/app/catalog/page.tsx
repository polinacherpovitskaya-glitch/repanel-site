"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";

const BODY = "'Gramatika', sans-serif";

const filters = ["Все", "Мебель", "Аксессуары", "HoReCa", "Офис", "Дети"];

const products = [
  { slug: "stool-01", name: "Табурет RePanel", price: "8 500 ₽", badge: "Хит", cat: "Мебель" },
  { slug: "board-serving", name: "Сервировочная доска", price: "3 200 ₽", badge: "Новинка", cat: "Аксессуары" },
  { slug: "organizer-desk", name: "Органайзер настольный", price: "4 800 ₽", badge: "", cat: "Офис" },
  { slug: "shelf-wall", name: "Полка модульная", price: "6 900 ₽", badge: "", cat: "Мебель" },
  { slug: "planter-floor", name: "Кашпо", price: "5 500 ₽", badge: "", cat: "Аксессуары" },
  { slug: "kids-table", name: "Столик детский", price: "7 200 ₽", badge: "", cat: "Дети" },
  { slug: "tray", name: "Поднос", price: "2 800 ₽", badge: "Новинка", cat: "Аксессуары" },
  { slug: "bench", name: "Скамья", price: "12 000 ₽", badge: "", cat: "Мебель" },
  { slug: "menu-holder", name: "Менюхолдер", price: "3 500 ₽", badge: "", cat: "HoReCa" },
  { slug: "coaster-set", name: "Подставки (набор)", price: "1 800 ₽", badge: "", cat: "Аксессуары" },
  { slug: "kids-stool", name: "Табурет детский", price: "6 400 ₽", badge: "", cat: "Дети" },
  { slug: "console", name: "Консоль", price: "15 000 ₽", badge: "", cat: "Мебель" },
  { slug: "menu-stand", name: "Держатель меню", price: "2 200 ₽", badge: "", cat: "HoReCa" },
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

      <section className="px-[var(--site-margins)] pt-20 lg:pt-36 pb-20 lg:pb-32">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="flex flex-wrap gap-2 mb-8 lg:mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className="px-5 py-2.5 transition-colors cursor-pointer"
                style={{ fontFamily: BODY, fontWeight: 700, fontSize: "13.5px", border: "1px solid #171513", background: active === f ? "#171513" : "transparent", color: active === f ? "#FFFFFF" : "#171513" }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5">
            {filtered.map((p) => (
              <Link key={p.slug} href={`/catalog/${p.slug}`} className="group/card relative flex flex-col bg-[#EAEAE7]" style={{ border: "1px solid rgba(23,21,19,0.1)" }}>
                {p.badge && (
                  <span className="absolute left-2.5 top-2.5 z-[2] px-2.5 py-1 text-[#171513]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "11px", background: "rgba(23,21,19,0.1)" }}>{p.badge}</span>
                )}
                <div className="w-full px-5 pt-7 pb-[38px]">
                  <div className="relative w-full aspect-square flex items-center justify-center transition-transform duration-300 ease-out group-hover/card:-translate-y-2" style={{ background: "#EAEAE7" }}>
                    <span style={{ fontFamily: BODY, fontSize: "12px", opacity: 0.3 }}>Фото</span>
                  </div>
                </div>
                <div className="w-full px-2.5 pb-2.5 pt-1">
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "11.5px", opacity: 0.45 }}>{p.cat}</p>
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "14.4px", lineHeight: 1.25 }}>{p.name}</p>
                  <p className="text-[#171513] mt-0.5" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "13.8px" }}>{p.price}</p>
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
