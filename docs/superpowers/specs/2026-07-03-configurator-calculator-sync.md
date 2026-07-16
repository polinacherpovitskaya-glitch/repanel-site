# Спек: тиражи/цены конфигуратора из калькулятора

**Дата:** 2026-07-03 · **Статус:** одобрено (Полина), в реализации

## Цель
Заменить захардкоженные тиражи/цены HoReCa-конфигуратора на реальные из калькулятора.
Источник правды — калькулятор (Railway), раздел «Бланки → Тиражная экономика».
Сайт **только читает** его публичный API (как уже читает `sheet_prices`/`granules`).

## Источник данных
`GET https://web-production-d2761c.up.railway.app/api/public/blanks_catalog` → `{ items: [...] }`.
Каждый опубликованный товар:
- `slug` (напр. `"Табурет Sofia"`) — **ключ сшивки с сайтом**;
- `name`, `category`, `vat_rate` (0.05), `min_order_qty`, `order_step_qty`;
- `tiers[]`: `{ qty, sheets, empty_units, is_perfect_layout, unit_price_no_vat, unit_price_with_vat, total_price_no_vat, total_price_with_vat }`;
- `sales_policy`: `recommended_quantities[]`, `custom_quantity_allowed`, `custom_quantity_title`, `custom_quantity_note` (текст плашки «любой тираж»), min/step;
- `product_context`: `catalog_role`, `customization_note`, `not_stock_note`, `layout_note` и др.;
- `quote_endpoint` (`.../quote?qty=N`) — расчёт любого числа (пока НЕ используем, выбран вариант «плашка»).

НДС в API = 5% — совпадает с сайтом.

## Сшивка
В `src/data/solutionObjects.ts` каждому объекту добавить `calcSlug`:
stool→`Табурет Sofia`, chair→`Стул Sofia`, bench→`Скамья Sofia`, table→`Стол Sofia`.
Сайт матчит `object.calcSlug` с `item.slug` из API. (Полина держит «Slug сайта» = это значение.)

## Поведение конфигуратора (вариант: отмеченные тиражи + плашка)
Если товар найден в API:
- Таблица тиражей — из `item.tiers` (кнопки: `qty` + `unit_price_with_vat`/шт). Никаких `QTY_TIERS`/`TIER_DISCOUNT`.
- Выбор тиража задаёт количество; мин./шаг из `sales_policy`.
- ИТОГО = `unit_price_no_vat × qty` + доплаты за цвет (mix +18000 / RAL +144000, как сейчас), затем × (1 + `vat_rate`).
- Плашка под таблицей: `custom_quantity_title` + `custom_quantity_note` + кнопка «Связаться с менеджером» (та же модалка).
- (Опц.) тексты `product_context` мелким шрифтом вместо статичного blurb.

Если товар НЕ найден (ещё не опубликован / API упал):
- Фолбэк: базовое «от …» + «точные тиражи и цены — по запросу» + плашка менеджера. Без выдуманных цен.

## Поток / кэш
Серверный fetch в `src/lib/calc.ts` (`getBlanksCatalog()`), `revalidate ~300s`.
Страница `src/app/solutions/horeca/[slug]/page.tsx` — async ISR: тянет каталог, находит по `calcSlug`, отдаёт в `ProductConfigurator` (или `null`).
Витрина `/solutions` + `SolutionModelCard` — «от {мин. ₽/шт}» из API (иначе basePrice).
Публикация/правка цены в калькуляторе → на сайте через ~5 мин, без передеплоя.

## Файлы
- `src/lib/calc.ts` — `getBlanksCatalog()` + типы + обработка ошибок.
- `src/data/solutionObjects.ts` — `calcSlug` на объектах; `basePrice` оставить (карточка «от»).
- `src/app/solutions/horeca/[slug]/page.tsx` — fetch + матч + проп.
- `src/components/ProductConfigurator.tsx` — тиражи/цена из API + плашка + фолбэк. НЕ трогать 3D/модалку/линии/ресет.
- `src/app/solutions/page.tsx` + `SolutionModelCard.tsx` — «от» из API.

## Часть Полины
В калькуляторе для стул/скамья/стол: «Slug сайта» = названия выше, тиражи «На сайт», опубликовать.

## Не входит (YAGNI)
Живой quote для произвольного числа; заказ/оплата HoReCa; перенос в Supabase.
