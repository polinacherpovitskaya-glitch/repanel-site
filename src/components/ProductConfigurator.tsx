"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  PALETTE_12,
  QTY_TIERS,
  CUSTOM_MIX_SURCHARGE,
  RAL_SURCHARGE,
  unitPriceForQty,
  activeTier,
  computeOrder,
  formatRub,
  type ColorMode,
  type SolutionObject,
} from "@/data/solutionObjects";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const INK = "#171513";
const MUTE = "#8a8783"; // солид, без прозрачности
const LINE = "#cdcac5"; // солид тонкая линия
const GREY_BG = "#EAEAE7"; // серый фон превью

// Telegram-логин менеджера. Кнопка открывает его личку напрямую, а текст заявки кладёт в буфер.
// TODO: заменить на личный @username Глеба (сейчас — общий контакт RePanel как запасной).
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

export function ProductConfigurator({ object }: { object: SolutionObject }) {
  const [qty, setQty] = useState(3);
  const [mode, setMode] = useState<ColorMode>("standard");
  const [idx, setIdx] = useState(0);
  const [ral, setRal] = useState<string[]>([""]);
  const [copied, setCopied] = useState(false);

  // Меняешь параметры — подтверждение «скопировано» гаснет (текст в буфере уже неактуален).
  useEffect(() => {
    setCopied(false);
  }, [qty, mode, idx, ral]);

  const tier = activeTier(qty);
  const order = computeOrder(object.basePrice, qty, mode, ral.length);
  const perUnitVat = Math.round(order.total / Math.max(1, qty));
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
  const summary = `Здравствуйте! Расчёт с сайта RePanel:\n${object.name}${specsLine ? ` (${specsLine})` : ""}\nТираж: ${Math.max(1, qty)} шт\nЦвет: ${colorLine}\nИтого: ${formatRub(order.total)} — включая НДС 5% (${perUnitVat.toLocaleString("ru-RU")} ₽/шт)`;
  const managerChatUrl = `https://t.me/${MANAGER_TG.replace(/^@/, "")}`;

  function contactManager() {
    // Кладём готовый текст в буфер (secure context: https / localhost); чат откроет сам <a href>.
    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopied(true);
  }

  return (
    <div className="lg:grid lg:grid-cols-2">
      {/* ── Слева: аккуратный серый блок (равные отступы), превью-текст сверху, 3D ниже ── */}
      <div className="lg:sticky lg:self-start lg:top-[54px] lg:h-[calc(100dvh-54px)] p-[var(--site-margins)]">
        <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: GREY_BG }}>
          <p className="px-5 pt-5 pb-1" style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.45, color: MUTE, maxWidth: 480 }}>
            <b style={{ color: INK }}>Превью.</b> Реальный цвет переработанного пластика может немного отличаться — стараемся попасть в палитру.
          </p>
          <div className="relative flex-1 min-h-[320px]">
            <Model3D url={object.glb} colorIndex={colorIndex} customHex="#b7b4b0" interactive autoRotate scale={object.viewScale ?? 1} />
            <span className="absolute left-4 bottom-3 select-none" style={{ fontFamily: BODY, fontSize: 12, color: MUTE }}>
              Потяните, чтобы повернуть
            </span>
          </div>
        </div>
      </div>

      {/* ── Справа: параметры (скроллятся), линии до края экрана ── */}
      <div className="lg:border-l" style={{ borderColor: LINE }}>
        {/* Заголовок + характеристики */}
        <div className={`${PAD} pt-6 lg:pt-8 pb-7 border-b`} style={{ borderColor: LINE }}>
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
        <div className={`${PAD} py-7 border-b`} style={{ borderColor: LINE }}>
          <Label>Тираж</Label>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="text"
              inputMode="numeric"
              value={qty || ""}
              onChange={(e) => setQty(Math.max(0, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0))}
              onBlur={() => setQty((q) => Math.max(1, q || 1))}
              className="w-[110px] h-14 text-center bg-transparent"
              style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: INK, border: `1px solid ${INK}`, outline: "none" }}
            />
            <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTE }}>шт</span>
          </div>

          <div className="mt-4" style={{ border: `1px solid ${LINE}` }}>
            {(["Шт", "₽/шт"] as const).map((rowLabel, r) => (
              <div key={rowLabel} className="grid" style={{ gridTemplateColumns: `56px repeat(${QTY_TIERS.length}, 1fr)` }}>
                <div className="grid place-items-center py-2.5" style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: MUTE, borderBottom: r === 0 ? `1px solid ${LINE}` : undefined }}>
                  {rowLabel}
                </div>
                {QTY_TIERS.map((t) => {
                  const on = t === tier;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQty(t)}
                      className="grid place-items-center py-2.5 cursor-pointer transition-colors"
                      style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 700, color: on ? "#fff" : INK, background: on ? INK : "transparent", borderLeft: `1px solid ${LINE}`, borderBottom: r === 0 ? `1px solid ${LINE}` : undefined }}
                    >
                      {r === 0 ? t : unitPriceForQty(object.basePrice, t).toLocaleString("ru-RU")}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-2.5" style={{ fontFamily: BODY, fontSize: 12, color: MUTE }}>
            Цены в таблице — без НДС. + НДС 5% добавляется в итог ниже.
          </p>
        </div>

        {/* ЦВЕТ */}
        <div className={`${PAD} py-7 border-b`} style={{ borderColor: LINE }}>
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
          <div className="mt-3 font-bold" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 5vw, 60px)", letterSpacing: "-0.02em", lineHeight: 1, color: INK }}>
            {formatRub(order.total)}
          </div>
          <div className="mt-2" style={{ fontFamily: BODY, fontSize: 13.5, color: MUTE }}>
            {perUnitVat.toLocaleString("ru-RU")} ₽/шт · включая НДС 5%
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
              <span>НДС 5%</span>
              <span>{formatRub(order.vat)}</span>
            </div>
          </div>
          <p className="mt-4" style={{ fontFamily: BODY, fontSize: 12.5, color: MUTE }}>
            Срок изготовления — 10–15 рабочих дней. Цена ориентировочная, финальную подтверждаем по проекту.
          </p>

          <a
            href={managerChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={contactManager}
            className="mt-6 inline-flex items-center justify-center w-full sm:w-auto px-8 h-13 py-3.5 cursor-pointer transition-colors hover:bg-[#2c2a28]"
            style={{ fontFamily: BODY, fontSize: 15, fontWeight: 700, color: "#FFFFFF", background: INK }}
          >
            Связаться с менеджером →
          </a>
          {copied ? (
            <div className="mt-4 flex items-start gap-3 px-4 py-4" style={{ border: `1px solid ${INK}`, background: "#f4f3f1" }}>
              <span className="w-[22px] h-[22px] mt-0.5 shrink-0 grid place-items-center rounded-full" style={{ background: INK }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
              </span>
              <div>
                <div style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 700, color: INK }}>Готово — весь расчёт уже скопирован</div>
                <div className="mt-1" style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.5, color: MUTE }}>
                  Мы открыли чат менеджера в соседней вкладке. Ничего писать и объяснять не нужно — просто вставьте (<b style={{ color: INK }}>⌘V</b> на Mac или <b style={{ color: INK }}>Ctrl + V</b> на Windows) и отправьте сообщение.
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3" style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.4, color: MUTE }}>
              По кнопке откроется чат менеджера, а весь расчёт скопируется в буфер — останется только вставить и отправить.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
