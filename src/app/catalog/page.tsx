"use client";

import { useState } from "react";
import Link from "next/link";

const D = "'Montserrat', var(--font-display), sans-serif";

const filters = ["Все", "Мебель", "Аксессуары", "HoReCa", "Офис", "Дети"];

const products = [
  { slug: "stool-01", name: "Табурет RePanel", price: "8 500 ₽", badge: "Bestseller", cat: "Мебель" },
  { slug: "board-serving", name: "Сервировочная доска", price: "3 200 ₽", badge: "New", cat: "Аксессуары" },
  { slug: "organizer-desk", name: "Органайзер настольный", price: "4 800 ₽", badge: "", cat: "Офис" },
  { slug: "shelf-wall", name: "Полка модульная", price: "6 900 ₽", badge: "", cat: "Мебель" },
  { slug: "planter-floor", name: "Кашпо", price: "5 500 ₽", badge: "", cat: "Аксессуары" },
  { slug: "kids-table", name: "Столик детский", price: "7 200 ₽", badge: "", cat: "Дети" },
  { slug: "tray", name: "Поднос", price: "2 800 ₽", badge: "New", cat: "Аксессуары" },
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
      {/* Hero */}
      <section style={{ padding: "60px 20px 40px" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl pt-10">
            <h1
              className="font-bold mb-6"
              style={{
                fontFamily: D,
                fontSize: "clamp(34px, 4.5vw, 56px)",
                letterSpacing: "-2px",
                lineHeight: 0.95,
              }}
            >
              Каталог изделий
            </h1>
            <p
              className="text-[17px] md:text-[20px] leading-[1.55] max-w-[640px]"
              style={{ opacity: 0.55 }}
            >
              Готовые предметы из переработанного пластика. Каждый можно адаптировать под цвет, размер и тираж.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: "0 20px 40px" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className="rounded-pill text-[14px] font-bold px-6 py-2.5 transition-colors"
                style={{
                  fontFamily: D,
                  background: active === f ? "#171513" : "transparent",
                  color: active === f ? "#FFFFFF" : "#171513",
                  border: active === f ? "1px solid #171513" : "1px solid rgba(23,21,19,0.2)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ padding: "0 20px 80px" }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                href={`/catalog/${p.slug}`}
                className="card-hover group block"
                style={{ border: "1px solid rgba(23,21,19,0.1)", overflow: "hidden" }}
              >
                {/* Photo placeholder */}
                <div
                  className="relative flex items-center justify-center"
                  style={{ aspectRatio: "4/3", background: "#F5F5F5" }}
                >
                  <span style={{ fontSize: 12, opacity: 0.25 }}>Фото</span>
                  {p.badge && (
                    <span
                      className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-3 py-1"
                      style={{
                        fontFamily: D,
                        background: p.badge === "Bestseller" ? "#171513" : "#171513",
                        color: "#FFFFFF",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px 16px 20px" }}>
                  <p className="text-[12px] mb-1" style={{ opacity: 0.4 }}>
                    {p.cat}
                  </p>
                  <h3
                    className="font-bold mb-2 group-hover:opacity-60 transition-opacity"
                    style={{ fontFamily: D, fontSize: 16, lineHeight: 1.25 }}
                  >
                    {p.name}
                  </h3>
                  <span className="font-bold" style={{ fontFamily: D, fontSize: 16 }}>
                    {p.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "60px 20px",
          borderTop: "1px solid rgba(23,21,19,0.1)",
        }}
      >
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2
              className="font-bold mb-2"
              style={{ fontFamily: D, fontSize: "clamp(24px, 2.5vw, 36px)", letterSpacing: "-1px" }}
            >
              Нужно что-то особенное?
            </h2>
            <p className="text-[16px]" style={{ opacity: 0.5 }}>
              Разработаем предмет с нуля или адаптируем существующий под ваши задачи.
            </p>
          </div>
          <Link
            href="/custom"
            className="inline-block text-[15px] font-bold px-8 py-3 rounded-pill"
            style={{ background: "#171513", color: "#FFFFFF", fontFamily: D }}
          >
            Обсудить проект
          </Link>
        </div>
      </section>
    </>
  );
}
