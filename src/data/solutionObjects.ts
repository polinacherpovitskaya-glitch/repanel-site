// Готовые решения — предметы под заказ с 3D-конфигуратором.
// MVP: данные лежат в этом файле. Следующий шаг — перенос в Supabase + правка в админке.
// Цены — ЗАГЛУШКИ, легко поменять (потом придут из базы).

export type SolutionCategory = "horeca" | "retail";

export type SolutionObject = {
  slug: string;
  name: string; // полное имя карточки
  short: string; // короткое (Табурет / Стул / …)
  category: SolutionCategory;
  glb: string; // путь к 3D-модели в /public
  basePrice: number; // ₽ за штуку в одном из 12 стандартных цветов (ЗАГЛУШКА)
  blurb: string;
  dims?: string; // габарит
  thickness?: string; // толщина листа
  weight?: string;
  viewScale?: number; // множитель размера в 3D-превью (кадрирование)
};

// Доплата за индивидуальный (не из 12) цвет — за штуку. Как в калькуляторе панелей.
export const UNIQUE_COLOR_SURCHARGE = 18000;

// 12 классических цветов RePanel. hex — усреднённый цвет свотча (для тинта 3D),
// img — фото терраццо-свотча, label — название (ЗАГЛУШКИ, заменим на реальные).
export const PALETTE_12: { n: number; hex: string; img: string; label: string; translucent?: boolean }[] = [
  { n: 1, hex: "#867d8e", img: "/images/colors/color-01.jpg", label: "Красно-голубая крошка" },
  { n: 2, hex: "#3373cb", img: "/images/colors/color-02.jpg", label: "Синяя" },
  { n: 3, hex: "#4f1b3c", img: "/images/colors/color-03.jpg", label: "Тёмно-бордовая" },
  { n: 4, hex: "#e7e5ea", img: "/images/colors/color-04.jpg", label: "Белая с искрой" },
  { n: 5, hex: "#dcdce6", img: "/images/colors/color-05.jpg", label: "Светло-серая" },
  { n: 6, hex: "#99a4d5", img: "/images/colors/color-06.jpg", label: "Полупрозрачный с синими вкраплениями", translucent: true },
  { n: 7, hex: "#2b2b31", img: "/images/colors/color-07.jpg", label: "Чёрная" },
  { n: 8, hex: "#1d3d8c", img: "/images/colors/color-08.jpg", label: "Синяя ночь" },
  { n: 9, hex: "#e7e8ee", img: "/images/colors/color-09.jpg", label: "Белая" },
  { n: 10, hex: "#d980b8", img: "/images/colors/color-10.jpg", label: "Розовая" },
  { n: 11, hex: "#4ba4bf", img: "/images/colors/color-11.jpg", label: "Бирюзовая" },
  { n: 12, hex: "#a0a3ab", img: "/images/colors/color-12.jpg", label: "Серая" },
];

export const SOLUTION_OBJECTS: SolutionObject[] = [
  {
    slug: "stool",
    name: "Табурет Sofia",
    short: "Табурет",
    category: "horeca",
    glb: "/models/stool.glb",
    basePrice: 14900,
    dims: "Сиденье Ø338 · высота 455 мм",
    thickness: "18 мм",
    weight: "≈ 4,9 кг",
    blurb: "Компактный барный табурет для кафе и ресторанов. Литой корпус из переработанного полистирола — прочный, лёгкий, не боится влаги.",
    viewScale: 0.9,
  },
  {
    slug: "chair",
    name: "Стул Sofia",
    short: "Стул",
    category: "horeca",
    glb: "/models/chair.glb",
    basePrice: 22900,
    dims: "Сиденье Ø400 · высота 665 мм",
    thickness: "18 мм",
    weight: "≈ 7 кг",
    blurb: "Стул со спинкой для залов и террас. Терраццо-фактура в любом из 12 цветов, устойчив к ежедневной нагрузке.",
  },
  {
    slug: "bench",
    name: "Скамья Sofia",
    short: "Скамья",
    category: "horeca",
    glb: "/models/bench.glb",
    basePrice: 39900,
    dims: "974 × 338 мм · высота 455 мм",
    thickness: "18 мм",
    weight: "≈ 12,9 кг",
    blurb: "Монолитная скамья для входных групп, лаунж-зон и ожидания. Без крепежа, единое литое изделие.",
  },
  {
    slug: "table",
    name: "Стол Sofia",
    short: "Стол",
    category: "horeca",
    glb: "/models/table.glb",
    basePrice: 49900,
    dims: "Ø970 мм · высота 750 мм",
    thickness: "25 мм",
    weight: "≈ 31,6 кг",
    blurb: "Стол для кафе и ресторанов. Уникальная терраццо-поверхность, подбирается под цвет интерьера.",
  },
];

export function getObject(slug: string): SolutionObject | undefined {
  return SOLUTION_OBJECTS.find((o) => o.slug === slug);
}

export function objectsByCategory(cat: SolutionCategory): SolutionObject[] {
  return SOLUTION_OBJECTS.filter((o) => o.category === cat);
}

/** Итоговая цена: база × количество + (индивидуальный цвет ? доплата × количество : 0). */
export function priceFor(basePrice: number, qty: number, unique: boolean): number {
  return basePrice * qty + (unique ? UNIQUE_COLOR_SURCHARGE * qty : 0);
}

export function formatRub(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}

/* ── Тиражная цена (как на recycleobject.ru/order) ── */

// Тиражи (штук). Цены за штуку — ЗАГЛУШКА (скидка за объём от basePrice), заменим на реальные.
export const QTY_TIERS = [3, 5, 10, 30, 50, 100] as const;
const TIER_DISCOUNT: Record<number, number> = { 3: 1, 5: 0.95, 10: 0.9, 30: 0.85, 50: 0.82, 100: 0.78 };

export const CUSTOM_MIX_SURCHARGE = 18000; // своё сочетание, ₽ (без НДС)
export const RAL_SURCHARGE = 144000; // покраска RAL, ₽ за один цвет (без НДС)
export const VAT_RATE = 0.05; // НДС 5%

export type ColorMode = "standard" | "mix" | "ral";

/** Активный тираж — наибольший ≤ количества. */
export function activeTier(qty: number): number {
  return [...QTY_TIERS].reverse().find((t) => qty >= t) ?? QTY_TIERS[0];
}

/** Цена за штуку (без НДС) при данном количестве. ЗАГЛУШКА — считается из basePrice. */
export function unitPriceForQty(base: number, qty: number): number {
  const tier = activeTier(qty);
  return Math.round((base * TIER_DISCOUNT[tier]) / 100) * 100;
}

/** Полный расчёт заказа: изделия + доплаты за цвет + НДС 5%. */
export function computeOrder(base: number, qty: number, mode: ColorMode, ralCount: number) {
  const unit = unitPriceForQty(base, qty);
  const goods = unit * Math.max(1, qty);
  const mixAdd = mode === "mix" ? CUSTOM_MIX_SURCHARGE : 0;
  const ralAdd = mode === "ral" ? RAL_SURCHARGE * Math.max(1, ralCount) : 0;
  const net = goods + mixAdd + ralAdd;
  const vat = Math.round(net * VAT_RATE);
  const total = net + vat;
  return { unit, goods, mixAdd, ralAdd, net, vat, total };
}
