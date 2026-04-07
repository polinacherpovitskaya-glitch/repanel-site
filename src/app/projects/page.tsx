"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const D = "'Montserrat', var(--font-display), sans-serif";
const I = "'Gramatika', var(--font-sans), sans-serif";

const filters = [
  { label: "Все", value: "Все" },
  { label: "девелопмент", value: "девелопмент" },
  { label: "ритейл", value: "ритейл" },
  { label: "horeca", value: "horeca" },
  { label: "мебель", value: "мебель" },
  { label: "объекты", value: "объекты" },
  { label: "городская среда", value: "городская среда" },
];

const projects = [
  {
    slug: "samolet",
    title: "САМОЛЕТ — 42 000 органайзеров",
    description: "Тиражное производство органайзеров из переработанного пластика для девелопера",
    photo: "/images/07.jpg",
    category: "девелопмент",
  },
  {
    slug: "drinkit",
    title: "Drinkit — мозаика и стенки перегородок",
    description: "Интерьерное решение для сети кофеен: мозаичные панели и перегородки",
    photo: "/images/DSC09441.jpg",
    category: "horeca",
  },
  {
    slug: "ripple-chopchop",
    title: "RIPPle × Chop-Chop — ресепшн, менью, стойка",
    description: "Комплексное оформление пространства: стойка ресепшн, меню-борды, барная стойка",
    photo: "/images/DSC09389.jpg",
    category: "horeca",
  },
  {
    slug: "lucky",
    title: "ЖК Lucky — элементы детской площадки",
    description: "Малые архитектурные формы для детской площадки жилого комплекса",
    photo: "/images/DSC02233.jpg",
    category: "девелопмент",
  },
  {
    slug: "vkusvill",
    title: "ВКУСВИЛЛ — POS-материалы, навигация",
    description: "POS-материалы и навигационные элементы для сети магазинов",
    photo: "/images/photo_2025-09-09 10.10.09.jpeg",
    category: "ритейл",
  },
  {
    slug: "kofemania",
    title: "Кофемания — столешницы и панели",
    description: "Столешницы и декоративные панели для ресторанов сети",
    photo: "/images/photo_2025-09-09 10.10.08.jpeg",
    category: "horeca",
  },
  {
    slug: "skolkovo",
    title: "СКОЛКОВО — мебель и декор",
    description: "Мебель и декоративные элементы для пространств инновационного центра",
    photo: "/images/DSC02247.jpg",
    category: "мебель",
  },
  {
    slug: "yandex",
    title: "Яндекс — элементы интерьера",
    description: "Элементы интерьера для офисных пространств из переработанного пластика",
    photo: "/images/DSC02232.jpg",
    category: "объекты",
  },
];

export default function ProjectsPage() {
  const [active, setActive] = useState("Все");

  const filtered =
    active === "Все"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ padding: "80px 20px 0 20px" }}>
        <div className="wrap">
          <h1
            className="font-bold mb-5"
            style={{
              fontFamily: D,
              fontSize: 52,
              letterSpacing: "-1.5px",
              lineHeight: 0.92,
            }}
          >
            Кейсы RePanel
          </h1>
          <p
            className="max-w-[680px] mb-10"
            style={{
              fontFamily: I,
              fontSize: 18,
              lineHeight: 1.55,
              color: "#171513",
            }}
          >
            От тиражей до интерьеров — материал, который настроен на результат
          </p>

          {/* Filter pills */}
          <div
            className="flex flex-wrap gap-2 pb-6"
            style={{ borderBottom: "1px solid #000" }}
          >
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className="rounded-pill text-[14px] font-bold px-5 py-2 transition-colors"
                style={{
                  fontFamily: D,
                  background: active === f.value ? "#171513" : "transparent",
                  color: active === f.value ? "#fff" : "#171513",
                  border: "1px solid #000",
                  cursor: "pointer",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cases Grid ── */}
      <section style={{ padding: "0 20px 80px 20px" }}>
        <div className="wrap">
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 24, marginTop: 40 }}
          >
            {filtered.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group flex flex-col"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/3", borderRadius: 8 }}
                >
                  <Image
                    src={p.photo}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3
                  className="font-bold mt-4 mb-1"
                  style={{
                    fontFamily: D,
                    fontSize: 20,
                    letterSpacing: "-0.3px",
                    lineHeight: 1.25,
                    color: "#171513",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: "#555",
                  }}
                >
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 20px", background: "#171513" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2
            className="font-bold mb-4"
            style={{
              fontFamily: D,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "-1.5px",
              lineHeight: 0.92,
              color: "#fff",
            }}
          >
            Хочу похожий проект
          </h2>
          <p
            className="max-w-lg mx-auto mb-8"
            style={{
              fontFamily: I,
              fontSize: 16,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Расскажите о задаче — предложим формат материала и вариант
            реализации.
          </p>
          <Link
            href="/contacts"
            className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
            style={{
              fontFamily: D,
              background: "#fff",
              color: "#171513",
            }}
          >
            Обсудить проект
          </Link>
        </div>

        {/* Portfolio sub-CTA */}
        <div
          className="wrap mt-16"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 40,
            textAlign: "center",
          }}
        >
          <h3
            className="font-bold mb-3"
            style={{
              fontFamily: D,
              fontSize: 24,
              letterSpacing: "-0.5px",
              color: "#fff",
            }}
          >
            Хотите попасть в портфолио?
          </h3>
          <p
            className="max-w-md mx-auto mb-6"
            style={{
              fontFamily: I,
              fontSize: 15,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Подпишитесь на рассылку, чтобы первыми узнавать о новых кейсах и
            возможностях сотрудничества.
          </p>
          <form
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email"
              className="rounded-pill px-5 py-3 text-[15px] w-full sm:flex-1"
              style={{
                fontFamily: I,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "transparent",
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="rounded-pill text-[15px] font-bold px-8 py-3 cursor-pointer"
              style={{
                fontFamily: D,
                background: "#fff",
                color: "#171513",
                border: "none",
              }}
            >
              Подписаться
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
