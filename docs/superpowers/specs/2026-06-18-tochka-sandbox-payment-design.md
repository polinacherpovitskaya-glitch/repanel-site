# Спек: приём оплаты в песочнице Точки — слайс «Набор образцов»

- **Дата:** 2026-06-18
- **Статус:** одобрено пользователем, в реализации
- **Контекст:** порт обрезанного бэкенда из `Recycle Object site/shop-infrastructure-handoff` в `repanel-site` (Next.js 16 + Supabase + эквайринг Точки + касса DigitalKassa на стороне банка).

## Цель

Рабочий сквозной платёж в **песочнице Точки** на одном товаре (**Набор образцов, 3500 ₽**): заказ создаётся в Supabase, покупатель уходит на платёжную ссылку песочницы, оплата подтверждается и заказ метится `paid`. С фискальным чеком 54-ФЗ через `payments-with-receipt`.

## В объёме

1. Накат `supabase/schema.sql` в проект `cxnrraaiiczctdpmkbqk` (через SQL Editor — CLI/psql не установлены, пароля БД нет).
2. Перенос (обрезанный) бэкенда Точки: клиент API, проверка подписи вебхука, роуты оплаты/вебхука, поллинг-подтверждение.
3. Минимальный фронт: кнопка «Купить» на `/samples` → `/checkout` (форма) → `/checkout/success|fail`.
4. Песочница: `TOCHKA_JWT=sandbox.jwt.token`, без реальных денег и кредов Никиты.

## Вне объёма (YAGNI)

Полная корзина, СДЭК-доставка/трекинг, сертификаты, промокоды, админка заказов, письма Resend, Telegram, боевые креды Точки. (Resend/Telegram креды пусты → код best-effort, молча пропускает.)

## Поток

```
/samples («Купить за 3500 ₽») → /checkout (имя/почта/телефон/город/адрес/коммент)
  → POST /api/tochka-payment
      [сверка цены из products НА СЕРВЕРЕ → INSERT shop_orders(pending)
       → createTochkaPayment(с чеком) → сохранить tochka_operation_id + order_timeline]
  → редирект на paymentUrl (sandbox)
  → /checkout/success?order=<id>&t=<tracking_token>
      → poll POST /api/orders/verify-payment {order, token}
          [getTochkaPaymentStatus → если APPROVED: mark paid, идемпотентно]
  (/api/tochka-webhook — подключаем, но на localhost Точка его не вызывает; тест в проде/туннеле)
```

## Файлы

| Из донора | Куда в repanel-site | Правки при переносе |
|---|---|---|
| `lib/tochka.ts` | `src/lib/tochka.ts` | без изменений (самодостаточен, чек встроен) |
| `lib/tochka-webhook-verify.ts` | `src/lib/tochka-webhook-verify.ts` | без изменений |
| `api/tochka-payment/route.ts` | `src/app/api/tochka-payment/route.ts` | убрать СДЭК-расчёт, сертификаты, промокоды; Telegram/subscribers best-effort |
| `api/tochka-webhook/route.ts` | `src/app/api/tochka-webhook/route.ts` | убрать сертификаты, СДЭК-отправление; письмо best-effort; подпись `monitor` |
| `admin/orders/[id]/verify-payment` | `src/app/api/orders/verify-payment/route.ts` | без admin-guard; доступ по `order_id` + `tracking_token` (capability-token), идемпотентно |
| — (новое) | `src/app/checkout/page.tsx`, `success/page.tsx`, `fail/page.tsx` | минимальная buy-форма под образцы |

Доставка образцов: `delivery_price = 0` (уточняет менеджер). СДЭК не подключаем.

## Инварианты (важно — деньги)

- **Цену берём только из `products` на сервере.** Клиентским суммам не верим.
- **Идемпотентность** mark-paid: вебхук и поллинг не дублируют отметку оплаты; дедуп неоплаченного заказа за 24ч.
- **Вебхук:** reverify статуса у банка (`TOCHKA_WEBHOOK_REVERIFY=true`) перед `paid`; подпись RS256 в режиме `monitor`.
- `SUPABASE_SERVICE_ROLE_KEY` — только в серверных роутах, никогда в браузер.

## Env (правки в `.env.local`)

- `NEXT_PUBLIC_SITE_URL=http://localhost:3001` (сейчас пусто — нужно для redirect).
- `TOCHKA_JWT=sandbox.jwt.token` (оставляем песочницу), `TOCHKA_RECEIPTS_ENABLED=true`.

## Песочница — проверенная конфигурация (2026-06-18)

- `TOCHKA_CUSTOMER_CODE=1234567ab`, `TOCHKA_MERCHANT_ID=200000000001097` (демо OOO ALTERO, карта+СБП) — получены из sandbox `GET /open-banking/v1.0/customers` и `GET /acquiring/v1.0/retailers`. Доковский «any» НЕ работает (нужно ≥9 симв. + consent + merchantId).
- redirect-URL должны быть **https** (Точка отклоняет http) → `NEXT_PUBLIC_SITE_URL=https://localhost:3001`.
- `payments-with-receipt` в песочнице отвечает `501` → `tochka.ts` молча откатывается на простую ссылку (фискальный чек выпустит боевая касса).
- GET статуса операции в песочнице всегда `APPROVED` → поллинг доводит заказ до `paid`. create отдаёт один и тот же демо `operationId` и dummy `paymentLink` (merch.example.com).

## Открытые вопросы (для боевого)

- **СНО** (`TOCHKA_RECEIPT_TAX_SYSTEM_CODE` пуст) и **ставка НДС** (`TOCHKA_RECEIPT_VAT_TYPE`) — подтвердить у Никиты/бухгалтерии перед боем.
- Боевые `TOCHKA_*` креды от Никиты (его точка); вебхук на проде (нужен публичный https-домен).

## Проверка

End-to-end на `localhost:3001` (preview_*) + REST-проверка `shop_orders`. Юнит-тесты отложены (в репо нет тест-харнесса; верификация слайса — sandbox e2e).
