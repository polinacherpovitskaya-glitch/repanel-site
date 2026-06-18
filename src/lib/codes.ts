// Валидация сертификатов и промокодов. Используется и роутом /api/codes/validate,
// и роутом оплаты (повторная серверная проверка скидки — клиенту не доверяем).
import type { SupabaseClient } from "@supabase/supabase-js";

export type CodeValidation =
  | {
      valid: true;
      code: string;
      type: "certificate" | "promo";
      discount_amount: number; // рубли, которые уходят со стоимости товаров
      display: string;
      balance?: number; // только сертификат
      discount_type?: "percent" | "fixed" | "free_shipping"; // только промо
    }
  | { valid: false; message: string };

const fmt = (v: number) => v.toLocaleString("ru-RU");

/**
 * Проверяет код на фоне корзины. itemsTotal/shipping — целые рубли.
 * Сертификат гасит сумму товаров (в пределах баланса). Промо: percent/fixed/free_shipping.
 */
export async function validateCode(
  db: SupabaseClient,
  rawCode: string,
  itemsTotal: number,
  shipping: number,
): Promise<CodeValidation> {
  const code = String(rawCode ?? "").trim();
  if (!code) return { valid: false, message: "Введите код" };

  // ── Сертификат ──
  const { data: cert } = await db
    .from("certificates")
    .select("code, balance, status, expires_at")
    .ilike("code", code)
    .maybeSingle();

  if (cert) {
    if (cert.status !== "active") return { valid: false, message: "Сертификат недействителен" };
    if (cert.expires_at && new Date(cert.expires_at as string).getTime() < Date.now())
      return { valid: false, message: "Срок действия сертификата истёк" };
    const balance = Number(cert.balance) || 0;
    if (balance <= 0) return { valid: false, message: "На сертификате нет средств" };
    const discount = Math.min(balance, itemsTotal);
    return {
      valid: true,
      code: String(cert.code),
      type: "certificate",
      discount_amount: discount,
      display: `Сертификат · −${fmt(discount)} ₽`,
      balance,
    };
  }

  // ── Промокод ──
  const { data: promo } = await db
    .from("promo_codes")
    .select("code, discount_type, discount_value, max_uses, uses, active, expires_at")
    .ilike("code", code)
    .maybeSingle();

  if (promo) {
    if (!promo.active) return { valid: false, message: "Промокод неактивен" };
    if (promo.expires_at && new Date(promo.expires_at as string).getTime() < Date.now())
      return { valid: false, message: "Срок действия промокода истёк" };
    if (promo.max_uses != null && Number(promo.uses) >= Number(promo.max_uses))
      return { valid: false, message: "Промокод исчерпан" };

    const type = String(promo.discount_type) as "percent" | "fixed" | "free_shipping";
    const value = Number(promo.discount_value) || 0;

    if (type === "free_shipping") {
      return {
        valid: true,
        code: String(promo.code),
        type: "promo",
        discount_amount: 0,
        display: "Бесплатная доставка",
        discount_type: "free_shipping",
      };
    }

    const discount =
      type === "percent" ? Math.round((itemsTotal * value) / 100) : Math.min(value, itemsTotal);
    if (discount <= 0) return { valid: false, message: "Промокод не даёт скидки на эту корзину" };
    return {
      valid: true,
      code: String(promo.code),
      type: "promo",
      discount_amount: discount,
      display: `Промокод · −${fmt(discount)} ₽`,
      discount_type: type,
    };
  }

  return { valid: false, message: "Код не найден" };
}
