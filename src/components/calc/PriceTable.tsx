"use client";

import { useState } from "react";
import type { SlimRow } from "@/lib/calc";
import { fmtRub } from "@/lib/calc";

const BODY = "'Gramatika', sans-serif";

const FORMATS = [
  { key: "1000x1000", label: "1000 × 1000 мм", area: "1.00 м²" },
  { key: "2200x1100", label: "2200 × 1100 мм", area: "2.42 м²" },
];
const MATERIALS = [
  { key: "normal", label: "Обычный пластик" },
  { key: "fragile", label: "Полупрозрачный пластик" },
];

const fmtKg = (v: number) => v.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function PriceTable({ rows }: { rows: SlimRow[] }) {
  const [fmt, setFmt] = useState("1000x1000");
  const [mat, setMat] = useState("normal");

  const visible = rows
    .filter((r) => r.format === fmt && r.material === mat)
    .sort((a, b) => a.thickness - b.thickness);

  return (
    <div>
      {/* Формат */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FORMATS.map((f) => {
          const on = f.key === fmt;
          return (
            <button key={f.key} onClick={() => setFmt(f.key)} className="px-5 py-3 text-left transition-colors cursor-pointer" style={{ fontFamily: BODY, border: "1px solid #171513", background: on ? "#171513" : "transparent", color: on ? "#FFFFFF" : "#171513" }}>
              <span className="font-bold block" style={{ fontSize: "15px" }}>{f.label}</span>
              <span style={{ fontSize: "12px", opacity: 0.6 }}>{f.area}</span>
            </button>
          );
        })}
      </div>

      {/* Материал */}
      <div className="flex flex-wrap gap-2 mb-7">
        {MATERIALS.map((m) => {
          const on = m.key === mat;
          return (
            <button key={m.key} onClick={() => setMat(m.key)} className="px-4 py-2 transition-colors cursor-pointer" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "13px", border: "1px solid #171513", background: on ? "rgba(102,112,77,0.16)" : "transparent", color: "#171513" }}>
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Список: толщина → «от … ₽/лист» */}
      <div className="border-t border-[#171513] max-w-[640px]">
        {visible.length === 0 ? (
          <p className="py-6" style={{ fontFamily: BODY, opacity: 0.6 }}>Нет данных по этому размеру и материалу.</p>
        ) : (
          visible.map((r) => (
            <div key={r.thickness} className="flex items-baseline justify-between gap-4 border-b border-[#171513]/15 py-4">
              <div>
                <span className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "19px" }}>{r.thickness}<span style={{ fontSize: "12px", opacity: 0.5 }}> мм</span></span>
                <span className="text-[#171513] ml-3" style={{ fontFamily: BODY, fontSize: "12.5px", opacity: 0.5 }}>{fmtKg(r.weight)} кг/лист</span>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.5 }}>от </span>
                <span className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "19px" }}>{fmtRub(r.from)}</span>
                <span className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.5 }}> / лист</span>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-5 max-w-[640px] text-[#171513]" style={{ fontFamily: BODY, fontSize: "13.5px", lineHeight: "20px", opacity: 0.65 }}>
        Цена за лист с НДС 5 %. «От» — при крупном тираже; для одного-двух листов выше. Точную цену под ваш
        проект, с раскроем и обработкой, посчитает калькулятор или менеджер.
      </p>
    </div>
  );
}
