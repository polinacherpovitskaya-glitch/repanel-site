"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";

const BODY = "'Gramatika', sans-serif";

const filters = ["Все", "девелопмент", "ритейл", "horeca", "мебель", "объекты"];

const projects = [
  { slug: "samolet", title: "САМОЛЕТ — 42 000 органайзеров", description: "Тиражное производство органайзеров из переработанного пластика для девелопера.", photo: "/images/07.jpg", category: "девелопмент" },
  { slug: "drinkit", title: "Drinkit — мозаика и перегородки", description: "Интерьерное решение для сети кофеен: мозаичные панели и перегородки.", photo: "/images/DSC09441.jpg", category: "horeca" },
  { slug: "ripple-chopchop", title: "RIPPle × Chop-Chop — ресепшен и стойка", description: "Стойка ресепшен, меню-борды и барная стойка для пространства.", photo: "/images/DSC09389.jpg", category: "horeca" },
  { slug: "lucky", title: "ЖК Lucky — детская площадка", description: "Малые архитектурные формы для детской площадки жилого комплекса.", photo: "/images/DSC02233.jpg", category: "девелопмент" },
  { slug: "vkusvill", title: "ВКУСВИЛЛ — POS и навигация", description: "POS-материалы и навигационные элементы для сети магазинов.", photo: "/images/photo_2025-09-09 10.10.09.jpeg", category: "ритейл" },
  { slug: "kofemania", title: "Кофемания — столешницы и панели", description: "Столешницы и декоративные панели для ресторанов сети.", photo: "/images/photo_2025-09-09 10.10.08.jpeg", category: "horeca" },
  { slug: "skolkovo", title: "СКОЛКОВО — мебель и декор", description: "Мебель и декоративные элементы для пространств инновационного центра.", photo: "/images/DSC02247.jpg", category: "мебель" },
  { slug: "yandex", title: "Яндекс — элементы интерьера", description: "Элементы интерьера для офисных пространств из переработанного пластика.", photo: "/images/DSC02232.jpg", category: "объекты" },
];

export default function ProjectsPage() {
  const [active, setActive] = useState("Все");
  const filtered = active === "Все" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <PageHero
        title="Проекты"
        image="/images/DSC09389.jpg"
        imageAlt="Проекты RePanel"
        lead="Объекты, тиражи и интерьеры из переработанного полистирола — для девелоперов, ритейла, HoReCa и брендов."
      />

      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
            {filtered.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group/card block">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 2" }}>
                  <Image src={p.photo} alt={p.title} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="pt-3">
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "12px", letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.5 }}>{p.category}</p>
                  <h3 className="font-bold text-[#171513] inline-block relative mt-1" style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.5vw, 19px)", lineHeight: 1.25, letterSpacing: "-0.3px" }}>
                    {p.title}
                    <span className="absolute left-0 -bottom-1 h-[1.5px] bg-[#171513] w-0 group-hover/card:w-full transition-[width] duration-[450ms] ease-out" />
                  </h3>
                  <p className="text-[#171513] mt-1.5" style={{ fontFamily: BODY, fontSize: "14px", lineHeight: 1.45, opacity: 0.7 }}>{p.description}</p>
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
