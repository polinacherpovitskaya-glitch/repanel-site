// Общие серверные хелперы магазина: идемпотентная отметка оплаты и уведомления.
// Источник истины об оплате — статус операции в API Точки, НЕ входной вебхук и
// НЕ клиент. И поллинг (/api/orders/verify-payment), и вебхук метят оплату через
// confirmAndMarkPaid → защита от поддельного "APPROVED".
import type { SiteDatabase } from "@/lib/server-db";
import { getTochkaPaymentStatus, extractTochkaPaymentOperation } from "@/lib/tochka";
import { issueCertificatesForOrder } from "@/lib/certificates";

/** Минимально нужная форма заказа из shop_orders для платёжной логики. */
export type ShopOrder = {
  id: string;
  grand_total: number | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  payment_status: string | null;
  tochka_operation_id: string | null;
  tracking_token: string | null;
  [k: string]: unknown;
};

/** Короткий человекочитаемый номер заказа из uuid. */
export function displayOrderNumber(id: string): string {
  return id.slice(0, 6).toUpperCase();
}

/** HTML-экранирование для Telegram-сообщений. */
export function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Совместимый no-op: клиентские контакты не передаются во внешние мессенджеры. */
export async function notifyTelegram(_text: string): Promise<void> {
  return;
}

/** Запись события в ленту заказа. Ошибку логируем, поток не роняем. */
export async function insertTimeline(
  db: SiteDatabase,
  orderId: string,
  eventType: string,
  actor: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const { error } = await db.from("order_timeline").insert({
    order_id: orderId,
    event_type: eventType,
    actor,
    payload,
  });
  if (error) console.error("[shop] order_timeline insert failed:", error);
}

export type MarkPaidOutcome = { paid: boolean; status: string };

/**
 * Идемпотентно подтверждает оплату ЧЕРЕЗ API банка и метит заказ paid.
 * - already paid          → { paid:true,  status:"paid" }
 * - нет operationId        → { paid:false, status:"pending" }
 * - банк не подтвердил     → { paid:false, status:<lowercased статус Точки> }
 * - подтверждено и помечено→ { paid:true,  status:"paid" }
 */
export async function confirmAndMarkPaid(db: SiteDatabase, order: ShopOrder): Promise<MarkPaidOutcome> {
  if (order.payment_status === "paid") return { paid: true, status: "paid" };

  const opId = order.tochka_operation_id;
  if (!opId) return { paid: false, status: "pending" };

  let op: { status?: string; amount?: number };
  try {
    op = extractTochkaPaymentOperation(await getTochkaPaymentStatus(opId));
  } catch (e) {
    console.error("[shop] reverify status call failed:", e);
    return { paid: false, status: "pending" };
  }

  if (String(op.status) !== "APPROVED") {
    return { paid: false, status: String(op.status ?? "pending").toLowerCase() };
  }

  // Мягкая сверка суммы — только предупреждение, оплату не блокирует.
  const opAmount = Number(op.amount ?? 0);
  const expected = Number(order.grand_total ?? 0);
  if (opAmount > 0 && expected > 0 && Math.round(opAmount) !== Math.round(expected)) {
    console.warn("[shop] amount mismatch", { opAmount, expected, orderId: order.id });
    await notifyTelegram(
      `⚠️ Расхождение суммы по заказу #${displayOrderNumber(order.id)}: банк ${opAmount} ₽, заказ ${expected} ₽`,
    );
  }

  const { error } = await db
    .from("shop_orders")
    .update({ status: "paid", payment_status: "paid" })
    .eq("id", order.id);
  if (error) throw error;

  await insertTimeline(db, order.id, "status_change", "payment", {
    layer: "payment",
    from: "pending",
    to: "paid",
  });
  await notifyTelegram(
    `✅ <b>Оплачено! Заказ #${displayOrderNumber(order.id)}</b>\nСумма: <b>${expected.toLocaleString("ru-RU")} ₽</b>`,
  );

  // Подарочные сертификаты: выпустить для позиций с certificate_payload (best-effort).
  try {
    await issueCertificatesForOrder(db, order);
  } catch (e) {
    console.error("[shop] cert issuance failed:", e);
  }

  return { paid: true, status: "paid" };
}
