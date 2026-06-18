// Подарочные сертификаты: генерация кода + автовыпуск при оплате заказа.
import type { SupabaseClient } from "@supabase/supabase-js";

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // без похожих символов (O/0, I/1)

/** Код вида RP-XXXX-XXXX. */
export function generateCertificateCode(): string {
  const part = () => Array.from({ length: 4 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join("");
  return `RP-${part()}-${part()}`;
}

/** Срок действия по умолчанию — 1 год. */
export function defaultExpiresAt(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

type CertPayload = {
  amount: number;
  recipient_name?: string;
  recipient_email?: string;
  message?: string;
  purchaser_name?: string;
  purchaser_email?: string;
};

type OrderLike = {
  id: string;
  email?: string | null;
  name?: string | null;
  items?: unknown;
};

/**
 * Выпускает подарочные сертификаты для всех позиций заказа с certificate_payload.
 * Идемпотентно: если по заказу уже есть сертификаты — повторно не выпускает.
 */
export async function issueCertificatesForOrder(db: SupabaseClient, order: OrderLike): Promise<void> {
  const items = Array.isArray(order.items)
    ? (order.items as Array<{ quantity?: number; certificate_payload?: CertPayload }>)
    : [];
  const certItems = items.filter((i) => i?.certificate_payload && Number(i.certificate_payload.amount) > 0);
  if (!certItems.length) return;

  const { data: existing } = await db.from("certificates").select("id").eq("source_order_id", order.id).limit(1);
  if (existing && existing.length) return; // уже выпущены

  for (const item of certItems) {
    const p = item.certificate_payload!;
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    for (let n = 0; n < qty; n += 1) {
      const { error } = await db.from("certificates").insert({
        code: generateCertificateCode(),
        initial_amount: Math.round(p.amount),
        balance: Math.round(p.amount),
        status: "active",
        purchaser_email: p.purchaser_email ?? order.email ?? null,
        purchaser_name: p.purchaser_name ?? order.name ?? null,
        recipient_email: p.recipient_email ?? null,
        recipient_name: p.recipient_name ?? null,
        message: p.message ?? null,
        source_order_id: order.id,
        expires_at: defaultExpiresAt(),
      });
      if (error) console.error("[certificates] insert failed:", error);
    }
  }
}
