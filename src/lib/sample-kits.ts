// Единый источник правды по наборам образцов RePanel.
// Импортируется И клиентом (SampleSelector), И сервером (роут оплаты), чтобы
// цена тарифа считалась на сервере и не зависела от того, что прислал браузер.

export type SampleTier = {
  /** число образцов в наборе */
  n: number;
  /** цена в целых рублях */
  price: number;
};

export const SAMPLE_TIERS: SampleTier[] = [
  { n: 6, price: 3500 },
  { n: 9, price: 4500 },
  { n: 12, price: 5500 },
];

/** Тариф по умолчанию (6 образцов — 3500 ₽). */
export const DEFAULT_SAMPLE_TIER = SAMPLE_TIERS[0].n;

/** Возвращает тариф по числу образцов, либо undefined, если такого нет. */
export function getSampleTier(n: number): SampleTier | undefined {
  return SAMPLE_TIERS.find((t) => t.n === Number(n));
}

/** Форматирование рублей: 3500 → «3 500 ₽». */
export function formatRub(value: number): string {
  return value.toLocaleString("ru-RU") + " ₽";
}
