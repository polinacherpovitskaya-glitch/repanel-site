"use client";

// Галерея кадров кейса.
// Десктоп — разбросанный вертикальный поток: фото разного размера в 3 смещённые колонки,
// листаем вниз (координаты в долях ширины доски). Мобилка — одна колонка, фото ~76–82%
// ширины, в шахматку лево/право (по макету Figma 68:5300). Белый фон, без поворота и теней.
// Клик → лайтбокс.
import { useState } from "react";
import Image from "next/image";

// Десктоп: x — left, y — верх, w — ширина (всё в долях ширины доски). Высота кадра = w·4/3.
const SLOTS = [
  { x: 0.04, y: 0.0, w: 0.3 },
  { x: 0.38, y: 0.1, w: 0.27 },
  { x: 0.71, y: 0.02, w: 0.25 },
  { x: 0.06, y: 0.44, w: 0.27 },
  { x: 0.36, y: 0.52, w: 0.3 },
  { x: 0.7, y: 0.4, w: 0.24 },
  { x: 0.03, y: 0.84, w: 0.29 },
  { x: 0.39, y: 0.98, w: 0.26 },
  { x: 0.72, y: 0.78, w: 0.27 },
  { x: 0.05, y: 1.28, w: 0.27 },
];
const ASPECT = 4 / 3; // высота = ширина · ASPECT (портрет 3:4)

export function ProjectGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const shown = photos.slice(0, SLOTS.length);

  const close = () => setOpen(null);
  const go = (dir: number) => setOpen((i) => (i === null ? null : (i + dir + shown.length) % shown.length));

  // Высота доски (в долях ширины) = низ самого нижнего показанного кадра + воздух.
  const boardH = Math.max(...shown.map((_, i) => SLOTS[i].y + SLOTS[i].w * ASPECT)) + 0.05;

  return (
    <section style={{ background: "#FFFFFF" }} className="lg:pt-12">
      {/* Десктоп — разбросанный вертикальный поток, листаем вниз */}
      <div className="hidden lg:block relative mx-auto w-full" style={{ maxWidth: 1440 }}>
        {/* распорка задаёт высоту доски (в % от ширины) */}
        <div style={{ paddingBottom: `${boardH * 100}%` }} />
        {shown.map((src, i) => {
          const s = SLOTS[i];
          return (
            <button
              key={i}
              onClick={() => setOpen(i)}
              aria-label={`${alt} — кадр ${i + 1}`}
              className="absolute cursor-pointer transition-transform duration-300 hover:scale-[1.03] hover:z-30"
              style={{ top: `${(s.y / boardH) * 100}%`, left: `${s.x * 100}%`, width: `${s.w * 100}%`, aspectRatio: "3 / 4", zIndex: 10 + i }}
            >
              <span className="block relative w-full h-full">
                <Image src={src} alt={`${alt} — кадр ${i + 1}`} fill sizes="32vw" className="object-cover" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Мобилка — одна колонка, фото ~76–82% ширины, в шахматку (Figma 68:5300) */}
      <div className="lg:hidden flex flex-col gap-4 px-[var(--site-margins)] py-7">
        {shown.map((src, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            aria-label={`${alt} — кадр ${i + 1}`}
            className={`relative cursor-pointer ${i % 2 ? "self-end" : "self-start"}`}
            style={{ width: i % 2 ? "82%" : "76%", aspectRatio: "3 / 4" }}
          >
            <Image src={src} alt={`${alt} — кадр ${i + 1}`} fill sizes="80vw" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Лайтбокс */}
      {open !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 cursor-zoom-out" style={{ background: "rgba(0,0,0,0.88)" }} onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shown[open]}
            alt={`${alt} — кадр ${open + 1}`}
            style={{ maxWidth: "92vw", maxHeight: "90vh", objectFit: "contain", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={close} className="absolute top-5 right-6 text-white text-[14px] font-bold cursor-pointer" style={{ fontFamily: "'Gramatika', sans-serif" }}>
            Закрыть
          </button>
          {shown.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-[34px] leading-none px-3 cursor-pointer hover:opacity-60 transition-opacity" aria-label="Предыдущее">‹</button>
              <button onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-[34px] leading-none px-3 cursor-pointer hover:opacity-60 transition-opacity" aria-label="Следующее">›</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
