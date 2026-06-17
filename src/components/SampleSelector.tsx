"use client";

import { useState } from "react";
import Image from "next/image";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const OLIVE = "#66704D";
const TG = "https://t.me/panelpanelre";

const TIERS = [
  { n: 6, price: 3500 },
  { n: 9, price: 4500 },
  { n: 12, price: 5500 },
];

const COLORS = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, label: `№ ${i + 1}`, img: `/images/colors/color-${i + 1}.jpg` }));

const fmt = (v: number) => v.toLocaleString("ru-RU") + " ₽";

export function SampleSelector() {
  const [tierN, setTierN] = useState(6);
  const [selected, setSelected] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const tier = TIERS.find((t) => t.n === tierN)!;
  const full = selected.length >= tier.n;

  const pickTier = (n: number) => {
    setTierN(n);
    setSelected((prev) => prev.slice(0, n));
  };
  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < tier.n ? [...prev, id] : prev));
  };

  const orderText =
    `Здравствуйте! Хочу заказать набор образцов RePanel.\n` +
    `Тариф: ${tier.n} образцов — ${fmt(tier.price)}.\n` +
    `Цвета: ${selected.length ? selected.map((id) => `№${id}`).join(", ") : "на ваш выбор"}.`;

  const order = () => {
    try {
      navigator.clipboard?.writeText(orderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
    window.open(TG, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Левая колонка — тариф + заказ */}
      <div className="lg:col-span-5">
        <p style={{ fontFamily: BODY, fontSize: "13px", color: "rgba(23,21,19,0.45)" }}>Материал · образцы</p>
        <h1 className="font-bold text-[#171513] mt-1" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px, 3.6vw, 52px)", letterSpacing: "-0.02em", lineHeight: 1.02 }}>
          Набор образцов
        </h1>
        <p className="text-[#171513] mt-4 max-w-[460px]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "21px", opacity: 0.8 }}>
          Плашки 12 × 6 см из переработанного полистирола — потрогать материал и выбрать цвет под проект.
          Срок изготовления — 14 дней. Стоимость образцов вычитается из заказа листов.
        </p>

        {/* Тарифы */}
        <p className="font-bold text-[#171513] mt-7 mb-2" style={{ fontFamily: BODY, fontSize: "14px" }}>Сколько образцов</p>
        <div className="flex gap-2">
          {TIERS.map((t) => {
            const on = t.n === tierN;
            return (
              <button
                key={t.n}
                onClick={() => pickTier(t.n)}
                className="flex-1 text-left px-4 py-3 transition-colors cursor-pointer"
                style={{ fontFamily: BODY, border: `1px solid ${on ? OLIVE : "rgba(23,21,19,0.2)"}`, background: on ? OLIVE : "transparent", color: on ? "#FFFFFF" : "#171513" }}
              >
                <span className="font-bold block" style={{ fontSize: "18px" }}>{t.n}</span>
                <span style={{ fontSize: "13px", opacity: on ? 0.85 : 0.55 }}>{fmt(t.price)}</span>
              </button>
            );
          })}
        </div>

        {/* Итог + заказ */}
        <div className="mt-7 border-t border-[#171513] pt-5">
          <div className="flex items-baseline justify-between">
            <span style={{ fontFamily: BODY, fontSize: "14px", color: "rgba(23,21,19,0.55)" }}>
              Выбрано <b style={{ color: "#171513" }}>{selected.length}</b> из {tier.n}
            </span>
            <span className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.4vw, 34px)", letterSpacing: "-0.5px" }}>{fmt(tier.price)}</span>
          </div>
          <button
            onClick={order}
            className="mt-4 w-full px-6 py-3.5 transition-opacity cursor-pointer hover:opacity-90"
            style={{ fontFamily: BODY, fontWeight: 700, fontSize: "15px", background: "#171513", color: "#FFFFFF" }}
          >
            {copied ? "Заявка скопирована — вставьте в чат" : "Заказать в Telegram →"}
          </button>
          <p className="mt-2.5" style={{ fontFamily: BODY, fontSize: "12px", color: "rgba(23,21,19,0.45)", lineHeight: 1.45 }}>
            Откроется чат RePanel, текст заявки скопируется — останется вставить и отправить.
          </p>
        </div>
      </div>

      {/* Правая колонка — палитра */}
      <div className="lg:col-start-7 lg:col-span-6">
        <p className="font-bold text-[#171513] mb-3" style={{ fontFamily: BODY, fontSize: "14px" }}>Выберите цвета</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {COLORS.map((c) => {
            const on = selected.includes(c.id);
            const disabled = !on && full;
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={on}
                className="group/sw relative w-full aspect-square overflow-hidden cursor-pointer disabled:cursor-not-allowed"
                style={{ border: on ? `2px solid ${OLIVE}` : "1px solid rgba(23,21,19,0.12)", opacity: disabled ? 0.4 : 1, outline: "none" }}
                disabled={disabled}
              >
                <Image src={c.img} alt={c.label} fill className="object-cover" sizes="20vw" />
                {on && (
                  <span className="absolute right-1.5 top-1.5 flex items-center justify-center" style={{ width: 20, height: 20, background: OLIVE, color: "#FFFFFF" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
                <span className="absolute left-0 bottom-0 right-0 px-1.5 py-0.5" style={{ fontFamily: BODY, fontSize: "10.5px", fontWeight: 700, color: "#FFFFFF", background: "rgba(0,0,0,0.35)" }}>{c.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3" style={{ fontFamily: BODY, fontSize: "12.5px", color: "rgba(23,21,19,0.5)", lineHeight: 1.5 }}>
          12 базовых складских сочетаний. Каждая плашка уникальна по рисунку. Нужен свой цвет — подберём из гранул или покрасим по RAL.
        </p>
      </div>
    </div>
  );
}
