"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

const colors = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { n, img: `/images/colors/color-${n}.jpg` };
});

// Превью потока «готового решения»: выбор цвета → скачать 3D → заказать.
// Картинка и подписи — пример-заглушка; заменим реальными изделиями и моделями.
export function SolutionFlowPreview() {
  const [sel, setSel] = useState(0);

  return (
    <section className="px-[var(--site-margins)] pt-6 lg:pt-10 pb-12 lg:pb-20">
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <h2 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Как это будет работать
        </h2>
        <p className="mt-3 text-[#171513] max-w-[640px]" style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.45, opacity: 0.6 }}>
          Выбираете изделие и цвет → скачиваете 3D-модель для своего проекта или сразу заказываете готовое. Ниже — пример интерфейса; наполним реальными изделиями и моделями.
        </p>

        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-px overflow-hidden" style={{ border: "1px solid rgba(23,21,19,0.12)", background: "rgba(23,21,19,0.12)" }}>
          {/* Фото-стенд */}
          <div className="relative bg-[#EAEAE7] flex items-center justify-center p-8" style={{ minHeight: 320 }}>
            <span className="absolute left-4 top-4 px-2 py-[3px]" style={{ fontFamily: BODY, fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase", background: "rgba(255,255,255,0.9)", color: "#171513", borderRadius: 6 }}>Пример</span>
            <div className="relative w-[70%] aspect-square">
              <Image src="/images/shop/shop-stolik.png" alt="Пример готового изделия" fill sizes="(min-width:1024px) 30vw, 70vw" className="object-contain" />
            </div>
          </div>

          {/* Детали + поток */}
          <div className="bg-[#FFFFFF] flex flex-col justify-center p-6 lg:p-10">
            <h3 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(22px, 2.4vw, 32px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Стол (пример)</h3>
            <p className="text-[#171513] mt-1.5" style={{ fontFamily: BODY, fontSize: "14.5px", lineHeight: 1.4, opacity: 0.6 }}>Просчитанная конструкция · размеры уточняются</p>

            {/* Выбор цвета */}
            <div className="mt-5">
              <p className="text-[#171513] mb-2" style={{ fontFamily: BODY, fontSize: "13px", fontWeight: 700 }}>Цвет: № {colors[sel].n}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c, i) => (
                  <button
                    key={c.n}
                    onClick={() => setSel(i)}
                    aria-label={`Цвет № ${c.n}`}
                    aria-pressed={sel === i}
                    className="cursor-pointer transition-transform hover:scale-110"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 9999,
                      backgroundImage: `url(${c.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      outline: sel === i ? "2px solid #171513" : "1px solid rgba(0,0,0,0.12)",
                      outlineOffset: sel === i ? 2 : 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Действия */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button disabled className="inline-flex items-center gap-2 cursor-not-allowed" style={{ fontFamily: BODY, fontSize: "14px", fontWeight: 700, color: "rgba(23,21,19,0.4)", border: "1px solid rgba(23,21,19,0.2)", borderRadius: 8, padding: "11px 16px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
                Скачать 3D-модель — скоро
              </button>
              <Link href="/contacts" className="inline-flex items-center hover:opacity-80 transition-opacity" style={{ fontFamily: BODY, fontSize: "14px", fontWeight: 700, color: "#FFFFFF", background: "#171513", borderRadius: 8, padding: "11px 18px" }}>
                Заказать →
              </Link>
              <span className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.5 }}>Цена по запросу</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
