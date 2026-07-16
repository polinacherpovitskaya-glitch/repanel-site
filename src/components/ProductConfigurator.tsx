"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  PALETTE_12,
  CUSTOM_MIX_SURCHARGE,
  RAL_SURCHARGE,
  computeTierOrder,
  formatRub,
  type ColorMode,
  type SolutionObject,
} from "@/data/solutionObjects";
import type { BlankProduct } from "@/lib/calc";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const INK = "#171513";
const MUTE = "#8a8783"; // солид, без прозрачности
const LINE = "#cdcac5"; // солид тонкая линия (мелкие контролы: таблица, свотчи, чекбоксы)
const RULE = "#000000"; // структурные линии страницы — 100% чёрный, без «прозрачности»
const GREY_BG = "#EAEAE7"; // серый фон превью

// Telegram-логин менеджера. Кнопка открывает его личку напрямую, а текст заявки кладёт в буфер.
// @panelpanelre — ПОДТВЕРЖДЁННЫЙ рабочий контакт менеджера (Полина, 2026-07), не заглушка. Не менять.
const MANAGER_TG = "panelpanelre";

const Model3D = dynamic(() => import("./Model3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full grid place-items-center" style={{ background: GREY_BG }}>
      <span style={{ fontFamily: BODY, fontSize: 14, color: MUTE }}>Загрузка 3D…</span>
    </div>
  ),
});

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: INK }}>
      {children}
    </span>
  );
}

function Check({ active }: { active: boolean }) {
  return (
    <span className="w-[18px] h-[18px] shrink-0 grid place-items-center" style={{ border: `1px solid ${active ? INK : LINE}`, background: active ? INK : "transparent" }}>
      {active && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 6" />
        </svg>
      )}
    </span>
  );
}

const PAD = "pl-[var(--site-margins)] lg:pl-9 pr-[var(--site-margins)]";

export function ProductConfigurator({ object, calcProduct }: { object: SolutionObject; calcProduct: BlankProduct | null }) {
  const tiers = calcProduct?.tiers ?? [];
  const vatRate = calcProduct?.vat_rate ?? 0.05;
  const policy = calcProduct?.sales_policy;

  const [qty, setQty] = useState(tiers[0]?.qty ?? 1);
  const [mode, setMode] = useState<ColorMode>("standard");
  const [idx, setIdx] = useState(0);
  const [ral, setRal] = useState<string[]>([""]);
  const [showModal, setShowModal] = useState(false);
  const resetViewRef = useRef<(() => void) | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Подсказку-жест показываем, когда модель загрузилась, и гасим через пару секунд.
  function onModelReady() {
    setShowHint(true);
    window.setTimeout(() => setShowHint(false), 3500);
  }

  // Поп-ап «скопировано»: Esc закрывает, фон под ним не скроллится.
  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const selectedTier = tiers.find((t) => t.qty === qty) ?? null;
  const order = computeTierOrder(selectedTier?.unit_price_no_vat ?? 0, qty, mode, ral.length, vatRate);
  const perUnitVat = Math.round(order.total / Math.max(1, qty));
  const vatPct = Math.round(vatRate * 100);
  const priceLine = selectedTier
    ? `Итого: ${formatRub(order.total)} — включая НДС ${vatPct}% (${perUnitVat.toLocaleString("ru-RU")} ₽/шт)`
    : "Прошу рассчитать этот тираж под выбранный цвет.";
  const colorIndex = mode === "standard" ? idx : -1;
  const nn = (n: number) => String(n).padStart(2, "0");

  const colorHeader =
    mode === "standard"
      ? `${PALETTE_12[idx].label} · № ${nn(PALETTE_12[idx].n)}`
      : mode === "mix"
      ? "Своё сочетание"
      : `RAL / Pantone · ${ral.length} ${ral.length === 1 ? "цвет" : "цвета"}`;

  // Готовый текст для менеджера
  const colorLine =
    mode === "standard"
      ? `${PALETTE_12[idx].label} (№ ${nn(PALETTE_12[idx].n)})`
      : mode === "mix"
      ? "Своё сочетание (+18 000 ₽)"
      : `Покраска RAL / Pantone: ${ral.map((c) => c.trim()).filter(Boolean).join(", ") || "уточнить"} (${ral.length} × 144 000 ₽)`;
  const specsLine = [object.dims, object.thickness && `лист ${object.thickness}`].filter(Boolean).join(" · ");
  const summary = `Здравствуйте! Расчёт с сайта RePanel:\n${object.name}${specsLine ? ` (${specsLine})` : ""}\nТираж: ${Math.max(1, qty)} шт\nЦвет: ${colorLine}\n${priceLine}`;
  const managerChatUrl = `https://t.me/${MANAGER_TG.replace(/^@/, "")}`;

  function openManagerFlow() {
    // Копируем расчёт в буфер (secure context: https / localhost) и показываем поп-ап с инструкцией.
    navigator.clipboard?.writeText(summary).catch(() => {});
    setShowModal(true);
  }

  return (
    <>
    <div className="lg:grid lg:grid-cols-2 border-b" style={{ borderColor: RULE }}>
      {/* ── Слева: аккуратный серый блок (равные отступы), превью-текст сверху, 3D ниже ── */}
      <div className="lg:sticky lg:self-start lg:top-[54px] lg:h-[calc(100dvh-54px)] p-[var(--site-margins)]">
        <div className="relative w-full h-full min-h-[380px] overflow-hidden" style={{ background: GREY_BG }}>
          {/* 3D — на весь блок, модель ровно по центру */}
          <div className="absolute inset-0">
            <Model3D url={object.glb} colorIndex={colorIndex} customHex="#b7b4b0" interactive autoRotate scale={object.viewScale ?? 1} resetRef={resetViewRef} onInteract={() => setShowHint(false)} onReady={onModelReady} />
          </div>

          {/* Подсказка-жест: только ручка, без фона, поверх модели */}
          <style>{`@keyframes rpSwipe{0%,100%{transform:translateX(-14px)}50%{transform:translateX(14px)}}`}</style>
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-700"
            style={{ opacity: showHint ? 1 : 0 }}
          >
            <svg
              width="44" height="44" viewBox="0 0 24 24" fill="none"
              stroke="#171513" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: "rpSwipe 1.5s ease-in-out infinite", filter: "drop-shadow(0 0 4px rgba(255,255,255,0.95)) drop-shadow(0 2px 3px rgba(0,0,0,0.22))" }}
            >
              <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
              <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>

          {/* Снизу по центру: «Превью» (2 строки) + кнопка-ресет, одной высоты */}
          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
            <div className="flex items-stretch gap-2" style={{ maxWidth: "100%" }}>
              <div className="flex items-center px-3.5 py-2 bg-white" style={{ width: 320, minWidth: 0, boxShadow: "0 1px 6px rgba(0,0,0,0.09)" }}>
                <p style={{ fontFamily: BODY, fontSize: 11.5, lineHeight: 1.35, color: MUTE }}>
                  <b style={{ color: INK }}>Превью.</b> Реальный цвет переработанного пластика может немного отличаться — стараемся попасть в палитру.
                </p>
              </div>
              <button
                type="button"
                onClick={() => resetViewRef.current?.()}
                title="Вернуть в центр"
                aria-label="Вернуть модель в центр экрана"
                className="shrink-0 w-11 grid place-items-center cursor-pointer bg-white hover:bg-[#f4f3f1] transition-colors"
                style={{ color: INK, boxShadow: "0 1px 6px rgba(0,0,0,0.09)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Справа: параметры (скроллятся), линии до края экрана ── */}
      <div className="lg:border-l" style={{ borderColor: RULE }}>
        {/* Заголовок + характеристики */}
        <div className={`${PAD} pt-6 lg:pt-8 pb-7 border-b`} style={{ borderColor: RULE }}>
          <h1 className="font-bold" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.03, letterSpacing: "-0.02em", color: INK }}>
            {object.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {[
              object.dims && { l: "Размер", v: object.dims },
              object.thickness && { l: "Толщина листа", v: object.thickness },
              object.weight && { l: "Вес", v: object.weight },
              { l: "Материал", v: "переработанный полистирол (rPS)" },
              { l: "Изготовление", v: "10–15 рабочих дней" },
            ]
              .filter((s): s is { l: string; v: string } => Boolean(s))
              .map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: BODY, fontSize: 12, color: MUTE }}>{s.l}</div>
                  <div style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 700, color: INK }}>{s.v}</div>
                </div>
              ))}
          </div>
        </div>

        {/* ТИРАЖ */}
        <div className={`${PAD} py-7 border-b`} style={{ borderColor: RULE }}>
          <Label>Тираж</Label>
          {selectedTier ? (
            <>
              <div className="mt-4" style={{ border: `1px solid ${LINE}` }}>
                {(["Шт", "₽/шт"] as const).map((rowLabel, r) => (
                  <div key={rowLabel} className="grid" style={{ gridTemplateColumns: `56px repeat(${tiers.length}, 1fr)` }}>
                    <div className="grid place-items-center py-2.5" style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: MUTE, borderBottom: r === 0 ? `1px solid ${LINE}` : undefined }}>
                      {rowLabel}
                    </div>
                    {tiers.map((t) => {
                      const on = t.qty === qty;
                      return (
                        <button
                          key={t.qty}
                          type="button"
                          onClick={() => setQty(t.qty)}
                          className="grid place-items-center py-2.5 cursor-pointer transition-colors"
                          style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: on ? "#fff" : INK, background: on ? INK : "transparent", borderLeft: `1px solid ${LINE}`, borderBottom: r === 0 ? `1px solid ${LINE}` : undefined }}
                        >
                          {r === 0 ? t.qty : Math.round(t.unit_price_with_vat).toLocaleString("ru-RU")}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="mt-2.5" style={{ fontFamily: BODY, fontSize: 12, color: MUTE }}>
                Цена за штуку — с НДС {vatPct}%. Чем больше тираж — тем выгоднее.
              </p>
            </>
          ) : (
            <p className="mt-3" style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.5, color: MUTE }}>
              Точные тиражи и цены для этого предмета ещё готовим. Напишите менеджеру нужное количество — рассчитаем под ваш тираж.
            </p>
          )}

          {policy?.custom_quantity_allowed && (
            <div className="mt-4 px-4 py-3.5" style={{ border: `1px solid ${LINE}`, background: "#f6f5f3" }}>
              <div style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 700, color: INK }}>
                {policy.custom_quantity_title || "Можно изготовить любой тираж"}
              </div>
              <p className="mt-1" style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.5, color: MUTE }}>
                {policy.custom_quantity_note || "Мы можем сделать любое количество — цена может быть выше из-за раскладки деталей на листы. Для нестандартного тиража свяжитесь с менеджером."}
              </p>
            </div>
          )}
        </div>

        {/* ЦВЕТ */}
        <div className={`${PAD} py-7 border-b`} style={{ borderColor: RULE }}>
          <div className="flex items-baseline justify-between gap-3">
            <Label>Цвет</Label>
            <span style={{ fontFamily: BODY, fontSize: 12.5, color: MUTE, textAlign: "right" }}>{colorHeader}</span>
          </div>

          <div className="mt-4 grid grid-cols-6 gap-2">
            {PALETTE_12.map((c, i) => {
              const on = mode === "standard" && i === idx;
              return (
                <button
                  key={c.n}
                  type="button"
                  onClick={() => { setMode("standard"); setIdx(i); }}
                  aria-label={`Цвет № ${nn(c.n)}`}
                  title={`${c.label} · № ${nn(c.n)}`}
                  className="relative aspect-square overflow-hidden cursor-pointer transition-transform hover:scale-[1.04]"
                  style={{ backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center", outline: on ? `2px solid ${INK}` : `1px solid ${LINE}`, outlineOffset: on ? "2px" : "0" }}
                />
              );
            })}
          </div>

          {/* Своё сочетание — галочка, соберём под вас */}
          <button type="button" onClick={() => setMode("mix")} className="mt-4 w-full flex items-center justify-between px-4 py-3 cursor-pointer" style={{ border: `1px solid ${mode === "mix" ? INK : LINE}`, background: mode === "mix" ? "#f6f5f3" : "transparent" }}>
            <span className="flex items-center gap-3">
              <Check active={mode === "mix"} />
              <span style={{ fontFamily: BODY, fontSize: 14, fontWeight: 700, color: INK }}>Своё сочетание</span>
            </span>
            <span style={{ fontFamily: BODY, fontSize: 13, color: MUTE }}>+ {formatRub(CUSTOM_MIX_SURCHARGE)}</span>
          </button>

          {/* RAL / Pantone — ввод номера цвета */}
          <div className="mt-3" style={{ border: `1px solid ${mode === "ral" ? INK : LINE}`, background: mode === "ral" ? "#f6f5f3" : "transparent" }}>
            <button type="button" onClick={() => setMode("ral")} className="w-full flex items-center justify-between px-4 py-3 cursor-pointer">
              <span className="flex items-center gap-3">
                <Check active={mode === "ral"} />
                <span style={{ fontFamily: BODY, fontSize: 14, fontWeight: 700, color: INK }}>Покраска RAL / Pantone — в один цвет</span>
              </span>
              <span className="shrink-0" style={{ fontFamily: BODY, fontSize: 13, color: MUTE }}>+ {formatRub(RAL_SURCHARGE)} / цвет</span>
            </button>
            {mode === "ral" && (
              <div className="px-4 pb-4 flex flex-col gap-2">
                {ral.map((code, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setRal((r) => r.map((h, j) => (j === i ? e.target.value : h)))}
                      placeholder="напр. RAL 5010 или Pantone 300 C"
                      className="flex-1 h-10 px-3 bg-white"
                      style={{ fontFamily: BODY, fontSize: 13.5, color: INK, border: `1px solid ${LINE}`, outline: "none" }}
                    />
                    <span className="shrink-0" style={{ fontFamily: BODY, fontSize: 13, color: MUTE }}>{formatRub(RAL_SURCHARGE)}</span>
                    {ral.length > 1 && (
                      <button type="button" onClick={() => setRal((r) => r.filter((_, j) => j !== i))} className="shrink-0 cursor-pointer" style={{ fontFamily: BODY, fontSize: 12, color: MUTE }}>убрать</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setRal((r) => [...r, ""])} className="self-start mt-1 cursor-pointer" style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: INK, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  + Добавить цвет
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ИТОГО + CTA */}
        <div className={`${PAD} py-7 pb-10`}>
          <Label>Итого</Label>
          {selectedTier ? (
            <>
              <div className="mt-3 font-bold" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 5vw, 60px)", letterSpacing: "-0.02em", lineHeight: 1, color: INK }}>
                {formatRub(order.total)}
              </div>
              <div className="mt-2" style={{ fontFamily: BODY, fontSize: 13.5, color: MUTE }}>
                {perUnitVat.toLocaleString("ru-RU")} ₽/шт · включая НДС {vatPct}%
              </div>

              <div className="mt-5 flex flex-col gap-2" style={{ fontFamily: BODY, fontSize: 13.5 }}>
                <div className="flex justify-between" style={{ color: INK }}>
                  <span>Изделие × {Math.max(1, qty)} шт</span>
                  <span>{formatRub(order.goods)}</span>
                </div>
                {order.mixAdd > 0 && (
                  <div className="flex justify-between" style={{ color: INK }}>
                    <span>Своё сочетание</span>
                    <span>{formatRub(order.mixAdd)}</span>
                  </div>
                )}
                {order.ralAdd > 0 && (
                  <div className="flex justify-between" style={{ color: INK }}>
                    <span>Покраска RAL / Pantone × {ral.length}</span>
                    <span>{formatRub(order.ralAdd)}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ color: MUTE }}>
                  <span>НДС {vatPct}%</span>
                  <span>{formatRub(order.vat)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-3 font-bold" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.2vw, 38px)", letterSpacing: "-0.01em", lineHeight: 1.05, color: INK }}>
              Цена по запросу
            </div>
          )}
          <p className="mt-4" style={{ fontFamily: BODY, fontSize: 12.5, color: MUTE }}>
            Срок изготовления — 10–15 рабочих дней. {selectedTier ? "Цена ориентировочная, финальную подтверждаем по проекту." : "Пришлите нужный тираж — рассчитаем и подтвердим."}
          </p>

          <button
            type="button"
            onClick={openManagerFlow}
            className="mt-6 inline-flex items-center justify-center w-full sm:w-auto px-8 h-13 py-3.5 cursor-pointer transition-colors hover:bg-[#2c2a28]"
            style={{ fontFamily: BODY, fontSize: 15, fontWeight: 700, color: "#FFFFFF", background: INK }}
          >
            Связаться с менеджером →
          </button>
        </div>
      </div>
    </div>

    {showModal && (
      <div
        role="dialog"
        aria-modal="true"
        onClick={() => setShowModal(false)}
        className="fixed inset-0 z-[100] flex items-center justify-center p-5"
        style={{ background: "rgba(23,21,19,0.55)" }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[440px] bg-white p-7 sm:p-8"
          style={{ border: `1px solid ${RULE}` }}
        >
          <button
            type="button"
            onClick={() => setShowModal(false)}
            aria-label="Закрыть"
            className="absolute right-3 top-3 w-8 h-8 grid place-items-center cursor-pointer"
            style={{ color: MUTE }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 shrink-0 grid place-items-center rounded-full" style={{ background: INK }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
            </span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em", color: INK }}>Расчёт скопирован</span>
          </div>

          <p className="mt-4" style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.55, color: INK }}>
            Всё уже готово — <b>менеджеру ничего писать и объяснять не нужно</b>. Откройте чат, вставьте расчёт (<b>⌘V</b> на Mac или <b>Ctrl&nbsp;+&nbsp;V</b> на Windows) и отправьте сообщение.
          </p>

          <a
            href={managerChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowModal(false)}
            className="mt-6 inline-flex items-center justify-center w-full px-6 h-12 cursor-pointer transition-colors hover:bg-[#2c2a28]"
            style={{ fontFamily: BODY, fontSize: 15, fontWeight: 700, color: "#FFFFFF", background: INK }}
          >
            Открыть чат менеджера →
          </a>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="mt-2.5 w-full text-center cursor-pointer"
            style={{ fontFamily: BODY, fontSize: 13, color: MUTE }}
          >
            Закрыть
          </button>
        </div>
      </div>
    )}
    </>
  );
}
