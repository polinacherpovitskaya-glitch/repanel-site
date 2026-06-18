"use client";

// Сетка каталога: товары из Supabase, фильтр по категориям, «В корзину» на ховере.
// Дизайн карточек сохранён из прежней (захардкоженной) версии.
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/supabase";

const BODY = "'Gramatika', sans-serif";
const OLIVE = "#66704D";
const sampleColors = Array.from({ length: 12 }, (_, i) => `/images/colors/color-${String(i + 1).padStart(2, "0")}.jpg`);

function isSample(p: Product) {
  return p.slug === "obraztsy" || p.category === "Образцы";
}

export function CatalogGrid({ products }: { products: Product[] }) {
  const { addItem, openCart } = useCart();
  const cats = ["Все", ...Array.from(new Set(products.map((p) => p.category)))];
  const [active, setActive] = useState("Все");
  const filtered = active === "Все" ? products : products.filter((p) => p.category === active);

  const add = (p: Product) => {
    addItem({ id: p.id, title: p.title, price: p.price, image_url: p.image_url });
    openCart();
  };

  return (
    <>
      {/* Фильтр по категориям */}
      <div className="flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-2 mt-7 lg:mt-9 mb-8 lg:mb-12">
        {cats.map((f) => {
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

      {/* Сетка карточек */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5">
        {active === "Все" && (
          <Link href="/certificate" className="group/card relative flex flex-col bg-[#171513] text-white" style={{ border: "1px solid #171513" }}>
            <div className="w-full px-5 pt-9 pb-[34px]">
              <div className="relative w-full aspect-square flex items-center justify-center text-center">
                <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, lineHeight: 1.15 }}>
                  Подарочный<br />сертификат
                </span>
              </div>
            </div>
            <div className="px-2.5 pb-2.5 pt-1">
              <p style={{ fontFamily: BODY, fontSize: "14.4px", lineHeight: "20px", fontWeight: 700 }}>Подарочный сертификат</p>
              <p style={{ fontFamily: BODY, fontSize: "13.8px", lineHeight: "20px", opacity: 0.75 }}>от 1 000 ₽</p>
            </div>
          </Link>
        )}
        {filtered.map((p) => {
          const sample = isSample(p);
          return (
            <div key={p.id} className="group/card relative flex flex-col bg-[#EAEAE7]" style={{ border: "1px solid rgba(23,21,19,0.1)" }}>
              <Link href={sample ? "/samples" : `/catalog/${p.slug}`} className="block">
                <span
                  className="absolute left-2.5 top-2.5 z-10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                  style={{ width: 38, height: 38, borderRadius: 10, background: "#171513" }}
                  aria-hidden
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="10.5" cy="10.5" r="7" />
                    <path d="M21 21l-5-5" />
                  </svg>
                </span>
                <div className="w-full px-5 pt-9 pb-[34px]" style={{ background: "#EAEAE7" }}>
                  <div className="relative w-full aspect-square transition-transform duration-300 ease-out group-hover/card:-translate-y-2">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.title} fill sizes="(min-width:1024px) 22vw, 45vw" quality={95} className={`object-contain ${sample ? "scale-[0.7]" : ""}`} />
                    ) : null}
                  </div>
                </div>
              </Link>

              <div className="relative w-full px-2.5 pb-2.5 pt-1">
                <div className="transition-transform duration-300 ease-out group-hover/card:-translate-y-[30px]">
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.4px", lineHeight: "20px", fontWeight: 700 }}>
                    {p.title}
                  </p>
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13.8px", lineHeight: "20px", fontWeight: 400 }}>
                    {sample ? "от " : ""}
                    {p.price.toLocaleString("ru-RU")} ₽
                  </p>
                </div>

                {/* Ховер-низ: образцы → плашки цветов; товар → «В корзину» */}
                <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ease-out" style={{ transitionDelay: "80ms" }}>
                  {sample ? (
                    <div className="flex flex-wrap items-center gap-[5px]">
                      {sampleColors.map((c, i) => (
                        <span
                          key={i}
                          style={{ width: 15, height: 15, borderRadius: 9999, border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0, backgroundImage: `url(${c})`, backgroundSize: "cover", backgroundPosition: "center" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => add(p)}
                      className="cart-pill w-full py-2 bg-[#171513] text-white hover:bg-[#2c2a28] transition-colors cursor-pointer"
                      style={{ fontFamily: BODY, fontWeight: 700, fontSize: 12.5 }}
                    >
                      В корзину
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
