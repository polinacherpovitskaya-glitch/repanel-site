/**
 * Слой данных для страниц расчётов (прайс, прикидка, столешница).
 * Источник правды — рабочий калькулятор RePanel на Railway (публичные API).
 * Цены приходят УЖЕ посчитанными бэкендом (с наценками по тиражу и НДС) — мы не дублируем формулу маржи.
 */

export const CALC_ORIGIN = "https://web-production-d2761c.up.railway.app";

/* ── Прайс на листы (/api/public/sheet_prices) ── */

export interface MarginTier {
  key: string;          // q1_10 | q11_20 | q21_30 | q31_plus
  label: string;        // "1–10 листов"
  margin?: number;      // 0.4
  margin_pct?: number;  // 40
  min: number | null;
  max: number | null;
  price_no_vat?: number;
  price_with_vat?: number;
  vat_amount?: number;
}

export interface SheetRow {
  format: string;            // "500x500" | "1000x1000" | "2200x1100"
  thickness_mm: number;      // 12 | 16 | 20 | 30 | 40
  material_type: string;     // "normal" | "fragile"
  material_label: string;    // "Обычный" | "Хрупкий"
  area_sqm: number;
  cost_per_sqm: number;
  price_no_vat: number;
  price_with_vat: number;
  vat_amount: number;
  weight_per_sheet_kg: number;
  weight_per_sqm_kg: number;
  margin_tiers: MarginTier[];
}

export interface SheetPrices {
  rows: SheetRow[];
  margin_tiers: MarginTier[];
  vat_rate: number;          // 0.05
  updated_at?: string;
  success?: boolean;
}

export async function getSheetPrices(): Promise<SheetPrices | null> {
  try {
    const res = await fetch(`${CALC_ORIGIN}/api/public/sheet_prices`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as SheetPrices;
    return data?.rows?.length ? data : null;
  } catch {
    return null;
  }
}

/* ── Остатки гранул (/api/public/granules) ── */

export interface Granule {
  id: number;
  code: string;        // "ПС 4"
  color: string;       // "синий"
  ral: string;         // "5005" | ""
  stock_kg: number;
  photo_url: string;   // относительный путь на CALC_ORIGIN
}

export async function getGranules(): Promise<Granule[] | null> {
  try {
    const res = await fetch(`${CALC_ORIGIN}/api/public/granules`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { granules?: Granule[] };
    return data.granules?.length ? data.granules : null;
  } catch {
    return null;
  }
}

export const granulePhoto = (g: Granule) => `${CALC_ORIGIN}${g.photo_url}`;

/* ── Опции цвета (как в калькуляторе) ── */

export interface ColorOption {
  key: "basic" | "custom" | "ral";
  label: string;
  surcharge: number;     // ₽ к стоимости, сверх цены листов
  note: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { key: "basic", label: "Базовое сочетание", surcharge: 0, note: "Одно из 12 складских сочетаний — в стоимости листа." },
  { key: "custom", label: "Подбор из гранул", surcharge: 18000, note: "Микс из складских цветов. Включены 3 образца 50×50 см." },
  { key: "ral", label: "Покраска RAL / Pantone", surcharge: 144000, note: "От 500 кг сырья на один цвет. Включены 3 образца 50×50 см." },
];

// 12 базовых сочетаний — фото скачаны в /public/images/colors/color-01..12.jpg
export const BASE_PALETTE = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { num: `№ ${n}`, img: `/images/colors/color-${n}.jpg` };
});

// Ориентиры пропорций для подбора
export const RATIO_PRESETS = ["50 / 50", "70 / 30", "90 / 10", "95 / 5", "97 / 3"];

/* ── Утилиты ── */

export const fmtRub = (n: number) =>
  Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";

// Тир по количеству листов
export function tierForQty(tiers: MarginTier[], qty: number): MarginTier | undefined {
  return tiers.find((t) => qty >= (t.min ?? 1) && (t.max == null || qty <= t.max));
}

/* ── «Тонкие» данные для прайса (только то, что показываем; считается на сервере) ── */

export interface SlimRow {
  format: string;
  material: string;   // normal | fragile
  thickness: number;
  weight: number;
  from: number;       // минимальная цена с НДС (крупный тираж) — тиражную лесенку наружу не отдаём
}

// Форматы, которые показываем (500x500 в прайсе/прикидке не выводим)
export const SHOWN_FORMATS = ["1000x1000", "2200x1100"];

export const SHEET_AREA: Record<string, number> = { "1000x1000": 1.0, "2200x1100": 2.42 };

/** Готовит минимальные данные для PriceTable — без тиражной лесенки, без «без НДС», без себестоимости. */
export function toSlimPrices(data: SheetPrices | null): SlimRow[] {
  if (!data) return [];
  return data.rows
    .filter((r) => SHOWN_FORMATS.includes(r.format))
    .map((r) => ({
      format: r.format,
      material: r.material_type,
      thickness: r.thickness_mm,
      weight: r.weight_per_sheet_kg,
      from: Math.min(...r.margin_tiers.map((t) => t.price_with_vat ?? r.price_with_vat)),
    }));
}

/* ── Расчёт прикидки (исполняется ТОЛЬКО на сервере, в API-роуте) ── */

const TIER_LABELS = ["1–10", "11–20", "21–30", "31+"];

export type QuoteCard =
  | { fmt: string; unavailable: true; avail: number[] }
  | { fmt: string; unavailable?: false; sheets: number; tierLabel: string; sheetPrice: number; sheetsTotal: number; total: number };

export function computeQuote(rows: SheetRow[], p: { area: number; thickness: number; material: string; color: string }): QuoteCard[] {
  const surcharge = COLOR_OPTIONS.find((o) => o.key === p.color)?.surcharge ?? 0;
  return SHOWN_FORMATS.map((fmt): QuoteCard => {
    const sa = SHEET_AREA[fmt];
    const sheets = Math.ceil(Math.round(p.area * 10000) / Math.round(sa * 10000));
    const idx = sheets <= 10 ? 0 : sheets <= 20 ? 1 : sheets <= 30 ? 2 : 3;
    const row = rows.find((r) => r.format === fmt && r.material_type === p.material && r.thickness_mm === p.thickness);
    if (!row) {
      const avail = rows.filter((r) => r.format === fmt && r.material_type === p.material).map((r) => r.thickness_mm).sort((a, b) => a - b);
      return { fmt, unavailable: true, avail };
    }
    const sheetPrice = row.margin_tiers[idx]?.price_with_vat ?? row.price_with_vat;
    const sheetsTotal = sheets * sheetPrice;
    return { fmt, sheets, tierLabel: TIER_LABELS[idx], sheetPrice, sheetsTotal, total: sheetsTotal + surcharge };
  });
}
