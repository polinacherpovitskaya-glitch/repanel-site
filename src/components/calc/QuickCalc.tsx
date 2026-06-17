"use client";

import { useState, useMemo } from "react";
import type { SheetRow } from "@/lib/calc";
import { fmtRub, COLOR_OPTIONS } from "@/lib/calc";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

const SHEET_AREA: Record<string, number> = { "1000x1000": 1.0, "2200x1100": 2.42 };
const FORMAT_LABEL: Record<string, string> = { "1000x1000": "1000 × 1000 · 1.00 м²", "2200x1100": "2200 × 1100 · 2.42 м²" };
const THICKS = [12, 16, 20, 30, 40];
const MATS = [{ k: "normal", l: "Обычный" }, { k: "fragile", l: "Полупрозрачный" }];
const TIER_LABELS = ["1–10", "11–20", "21–30", "31+"];

function pluralSheets(n: number): string {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return "листов";
  if (b > 1 && b < 5) return "листа";
  if (b === 1) return "лист";
  return "листов";
}
function tierIdx(s: number): number { return s <= 10 ? 0 : s <= 20 ? 1 : s <= 30 ? 2 : 3; }

type Card =
  | { fmt: string; unavailable: true; avail: number[] }
  | { fmt: string; unavailable?: false; sheets: number; idx: number; sheetPrice: number; sheetsTotal: number; total: number };

function ChipRow<T extends string | number>({ label, items, value, onChange }: { label: string; items: { k: T; l: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div>
      <label className="block font-bold mb-2 text-[#171513]" style={{ fontFamily: BODY, fontSize: "14px" }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const on = it.k === value;
          return (
            <button key={String(it.k)} onClick={() => onChange(it.k)} className="px-4 py-2 transition-colors cursor-pointer" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "13px", border: "1px solid #171513", background: on ? "#171513" : "transparent", color: on ? "#FFFFFF" : "#171513" }}>{it.l}</button>
          );
        })}
      </div>
    </div>
  );
}

export function QuickCalc({ rows }: { rows: SheetRow[] }) {
  const [area, setArea] = useState("");
  const [thick, setThick] = useState<number>(20);
  const [mat, setMat] = useState<string>("normal");
  const [opt, setOpt] = useState<string>("basic");

  const a = parseFloat(area);
  const valid = isFinite(a) && a > 0;
  const optLabel = COLOR_OPTIONS.find((o) => o.key === opt)?.label ?? "";
  const surcharge = COLOR_OPTIONS.find((o) => o.key === opt)?.surcharge ?? 0;

  const cards = useMemo<Card[]>(() => {
    if (!valid) return [];
    return Object.keys(SHEET_AREA).map((fmt): Card => {
      const sheetArea = SHEET_AREA[fmt];
      const sheets = Math.ceil(Math.round(a * 10000) / Math.round(sheetArea * 10000));
      const idx = tierIdx(sheets);
      const row = rows.find((r) => r.format === fmt && r.material_type === mat && r.thickness_mm === thick);
      if (!row) {
        const avail = rows.filter((r) => r.format === fmt && r.material_type === mat).map((r) => r.thickness_mm).sort((x, y) => x - y);
        return { fmt, unavailable: true, avail };
      }
      const sheetPrice = row.margin_tiers[idx]?.price_with_vat ?? row.price_with_vat;
      const sheetsTotal = sheets * sheetPrice;
      return { fmt, sheets, idx, sheetPrice, sheetsTotal, total: sheetsTotal + surcharge };
    });
  }, [a, valid, thick, mat, rows, surcharge]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
      {/* Управление */}
      <div className="lg:col-span-5 flex flex-col gap-7">
        <div>
          <label className="block font-bold mb-2 text-[#171513]" style={{ fontFamily: BODY, fontSize: "14px" }}>Площадь, м²</label>
          <input type="number" min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="например, 50" className="w-full bg-transparent border-b border-[#171513] pb-2 placeholder:opacity-40" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "32px", color: "#171513", outline: "none" }} />
        </div>
        <ChipRow label="Толщина" items={THICKS.map((t) => ({ k: t, l: `${t} мм` }))} value={thick} onChange={setThick} />
        <ChipRow label="Материал" items={MATS} value={mat} onChange={setMat} />
        <div>
          <label className="block font-bold mb-2 text-[#171513]" style={{ fontFamily: BODY, fontSize: "14px" }}>Цветовое решение</label>
          <div className="flex flex-col gap-2">
            {COLOR_OPTIONS.map((o) => {
              const on = o.key === opt;
              return (
                <button key={o.key} onClick={() => setOpt(o.key)} className="text-left px-4 py-3 transition-colors cursor-pointer" style={{ fontFamily: BODY, border: "1px solid #171513", background: on ? "#171513" : "transparent", color: on ? "#FFFFFF" : "#171513" }}>
                  <span className="font-bold block" style={{ fontSize: "14px" }}>{o.label}</span>
                  <span style={{ fontSize: "12px", opacity: on ? 0.75 : 0.55 }}>{o.surcharge > 0 ? `+ ${fmtRub(o.surcharge)}` : "в стоимости листа"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Результат */}
      <div className="lg:col-start-7 lg:col-span-6 flex flex-col gap-5">
        {!valid ? (
          <div className="border-t border-[#171513] pt-5 text-[#171513]" style={{ fontFamily: BODY, opacity: 0.6 }}>Введите площадь, чтобы посчитать прикидку.</div>
        ) : (
          cards.map((c) =>
            c.unavailable ? (
              <div key={c.fmt} className="border-t border-[#171513] pt-5">
                <p className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "15px" }}>{FORMAT_LABEL[c.fmt]}</p>
                <p className="text-[#171513] mt-1.5" style={{ fontFamily: BODY, fontSize: "14px", opacity: 0.6 }}>Эту толщину в этом размере не производим.{c.avail.length ? ` Доступны: ${c.avail.join(", ")} мм.` : ""}</p>
              </div>
            ) : (
              <div key={c.fmt} className="border-t border-[#171513] pt-5">
                <p className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "15px" }}>Из листов {FORMAT_LABEL[c.fmt]}</p>
                <p className="text-[#171513] mt-1.5" style={{ fontFamily: BODY, fontSize: "13.5px", opacity: 0.6 }}>Нужно: <b>{c.sheets}</b> {pluralSheets(c.sheets)} (тариф {TIER_LABELS[c.idx]})</p>
                <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13.5px", opacity: 0.6 }}>{c.sheets} × {fmtRub(c.sheetPrice)} = {fmtRub(c.sheetsTotal)}</p>
                {surcharge > 0 && <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13.5px", opacity: 0.6 }}>+ {fmtRub(surcharge)} · {optLabel}</p>}
                <p className="font-bold mt-3 text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 3vw, 42px)", letterSpacing: "-0.5px", lineHeight: 1 }}>{fmtRub(c.total)}</p>
                <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "12px", opacity: 0.5 }}>с НДС 5 % (включён)</p>
              </div>
            )
          )
        )}
        <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "12px", opacity: 0.5 }}>Прикидка по площади. Точную смету с раскроем считает раздел «Столешница».</p>
      </div>
    </div>
  );
}
