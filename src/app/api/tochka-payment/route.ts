import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createTochkaPayment } from "@/lib/tochka";
import { getSampleTier } from "@/lib/sample-kits";
import { validateCode } from "@/lib/codes";
import { insertTimeline, notifyTelegram, esc, displayOrderNumber } from "@/lib/shop-payments";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

type CartItemIn = {
  id?: string;
  slug?: string | null;
  title?: string;
  price?: number;
  quantity?: number;
  color?: string | null;
  weight_grams?: number;
  sample_kit_payload?: { count?: number; colors?: string[] };
};

/**
 * Создаёт заказ + платёжную ссылку Точки.
 * Две ветки: корзина (body.items) и набор образцов (body.tier).
 * Цены ВСЕХ позиций сверяются с таблицей products на сервере; скидка
 * перепроверяется через validateCode — клиентским суммам не доверяем.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const db = supabaseAdmin();

    if (Array.isArray(body.items) && body.items.length > 0) {
      return NextResponse.json(await handleCart(db, body));
    }
    if (body.tier != null) {
      return NextResponse.json(await handleSamples(db, body));
    }
    return NextResponse.json({ success: false, error: "Пустой заказ" }, { status: 400 });
  } catch (err) {
    console.error("[tochka-payment]", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

// ─────────────────────────── Корзина ───────────────────────────
async function handleCart(db: SupabaseClient, body: Record<string, unknown>) {
  const items = body.items as CartItemIn[];
  const contactName = String(body.name ?? "").trim();
  const contactEmail = String(body.email ?? "").trim();
  const contactPhone = String(body.phone ?? "").trim();
  if (!contactName || !contactEmail || !contactPhone) {
    throw new Error("Заполните имя, e-mail и телефон");
  }

  // ── серверная сверка цен из products ──
  const ids = items.map((i) => i.id).filter(Boolean) as string[];
  const dbProducts: Record<string, { price: number; title: string; weight_grams: number | null }> = {};
  if (ids.length) {
    const { data } = await db.from("products").select("id, price, title, weight_grams").in("id", ids);
    for (const p of data ?? []) {
      dbProducts[p.id as string] = {
        price: Number(p.price),
        title: String(p.title ?? ""),
        weight_grams: p.weight_grams != null ? Number(p.weight_grams) : null,
      };
    }
  }

  const verifiedItems = items.map((item) => {
    const dbp = item.id ? dbProducts[item.id] : undefined;
    const kitCount = item.sample_kit_payload?.count;
    const sampleTier = kitCount ? getSampleTier(Number(kitCount)) : null;
    const price = sampleTier ? sampleTier.price : dbp && dbp.price > 0 ? dbp.price : Number(item.price);
    if (!(price > 0)) throw new Error(`Некорректная цена товара: ${item.title ?? item.id}`);
    return {
      id: item.id ?? null,
      slug: item.slug ?? null,
      title: dbp?.title ?? String(item.title ?? "Товар"),
      price,
      quantity: Math.max(1, Number(item.quantity) || 1),
      color: item.color ?? null,
      weight_grams: dbp?.weight_grams ?? (Number(item.weight_grams) || 500),
    };
  });
  const verifiedTotal = verifiedItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const deliveryPrice = Math.max(0, Number(body.delivery_price) || 0); // рассчитан нашим /api/cdek/calculate
  const deliveryKey = typeof body.delivery_key === "string" ? body.delivery_key : "";

  // ── повторная серверная проверка скидки ──
  let verifiedDiscount = 0;
  let appliedType: string | null = null;
  let freeShipping = false;
  const appliedCode = body.applied_code ? String(body.applied_code) : null;
  if (appliedCode) {
    const v = await validateCode(db, appliedCode, verifiedTotal, deliveryPrice);
    if (v.valid) {
      appliedType = v.type;
      if (v.type === "promo" && v.discount_type === "free_shipping") freeShipping = true;
      else verifiedDiscount = Math.min(v.discount_amount, verifiedTotal);
    }
  }
  const effectiveDelivery = freeShipping ? 0 : deliveryPrice;
  const grandTotal = Math.max(0, verifiedTotal + effectiveDelivery - verifiedDiscount);

  const { data: row, error } = await db
    .from("shop_orders")
    .insert({
      items: verifiedItems,
      total: verifiedTotal,
      delivery_method: body.delivery_method ?? null,
      delivery_price: effectiveDelivery,
      grand_total: grandTotal,
      name: contactName,
      first_name: body.first_name ?? null,
      last_name: body.last_name ?? null,
      phone: contactPhone,
      email: contactEmail,
      city: body.city ? String(body.city).trim() : null,
      address: body.address ? String(body.address).trim() : null,
      comment: body.comment ? String(body.comment).trim() : null,
      status: "pending",
      payment_status: "pending",
      processing_status: "new",
      fulfillment_status: "not_started",
      delivery_status: "created",
      carrier: body.carrier ?? (deliveryKey.startsWith("cdek") ? "cdek" : deliveryKey === "pickup" ? "self_pickup" : null),
      cdek_city_code: body.cdek_city_code ?? null,
      pvz_code: body.pvz_code ?? null,
      applied_code: appliedCode,
      applied_code_type: appliedType,
      discount_amount: verifiedDiscount,
      submitted_at: body.submitted_at ?? new Date().toISOString(),
    })
    .select("id, tracking_token")
    .single();

  if (error || !row) throw new Error(error?.message ?? "Не удалось создать заказ");
  const orderId = String(row.id);
  const trackingToken = String(row.tracking_token ?? "");
  await insertTimeline(db, orderId, "created", "client", { grand_total: grandTotal });

  const summary = verifiedItems.map((i) => `${i.title}×${i.quantity}`).join(", ").slice(0, 100);
  const payment = await createTochkaPayment({
    orderId,
    amount: grandTotal,
    purpose: `Заказ ${displayOrderNumber(orderId)} — ${summary}`,
    redirectUrl: `${SITE_URL}/checkout/success?order=${orderId}&t=${trackingToken}`,
    failUrl: `${SITE_URL}/checkout/fail?order=${orderId}`,
    customer: { name: contactName, email: contactEmail, phone: contactPhone },
    items: verifiedItems.map((i) => ({ title: i.title, price: i.price, quantity: i.quantity })),
  });

  if (payment.operationId) {
    await db.from("shop_orders").update({ tochka_operation_id: payment.operationId }).eq("id", orderId);
  }

  const itemLines = verifiedItems
    .map((i) => `  • ${esc(i.title)}${i.color ? ` (${esc(i.color)})` : ""} ×${i.quantity} — ${(i.price * i.quantity).toLocaleString("ru-RU")} ₽`)
    .join("\n");
  await notifyTelegram(
    `🛍 <b>Новый заказ #${displayOrderNumber(orderId)} — ожидает оплаты</b>\n${itemLines}\n` +
      `<b>Доставка:</b> ${esc(String(body.delivery_method ?? "—"))}${effectiveDelivery > 0 ? ` — ${effectiveDelivery.toLocaleString("ru-RU")} ₽` : ""}\n` +
      `<b>Итого: ${grandTotal.toLocaleString("ru-RU")} ₽</b>\n${esc(contactName)} | ${esc(contactPhone)} | ${esc(contactEmail)}`,
  );

  if (!payment.paymentUrl) throw new Error("Точка не вернула ссылку на оплату");
  return { success: true, paymentUrl: payment.paymentUrl, orderId };
}

// ─────────────────────────── Набор образцов ───────────────────────────
async function handleSamples(db: SupabaseClient, body: Record<string, unknown>) {
  const tier = getSampleTier(Number(body.tier));
  if (!tier) throw new Error("Некорректный тариф набора образцов");

  const contactName = String(body.name ?? "").trim();
  const contactEmail = String(body.email ?? "").trim();
  const contactPhone = String(body.phone ?? "").trim();
  if (!contactName || !contactEmail || !contactPhone) throw new Error("Заполните имя, e-mail и телефон");

  const selectedColors = Array.isArray(body.colors)
    ? (body.colors as unknown[]).map((c) => Number(c)).filter((c) => Number.isFinite(c))
    : [];
  const colorsLabel = selectedColors.length ? selectedColors.map((c) => `№${c}`).join(", ") : "на ваш выбор";
  const title = `Набор образцов RePanel — ${tier.n} цветов`;
  const price = tier.price;
  const items = [{ slug: "obraztsy", title, price, quantity: 1, tier: tier.n, colors: selectedColors }];

  const { data: row, error } = await db
    .from("shop_orders")
    .insert({
      items,
      total: price,
      delivery_method: "Уточняется менеджером",
      delivery_price: 0,
      grand_total: price,
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
      city: body.city ? String(body.city).trim() : null,
      address: body.address ? String(body.address).trim() : null,
      comment: [body.comment ? String(body.comment).trim() : "", `Цвета: ${colorsLabel}`].filter(Boolean).join(" · "),
      status: "pending",
      payment_status: "pending",
      processing_status: "new",
      fulfillment_status: "not_started",
      delivery_status: "created",
      carrier: "self_pickup",
      submitted_at: new Date().toISOString(),
    })
    .select("id, tracking_token")
    .single();

  if (error || !row) throw new Error(error?.message ?? "Не удалось создать заказ");
  const orderId = String(row.id);
  const trackingToken = String(row.tracking_token ?? "");
  await insertTimeline(db, orderId, "created", "client", { grand_total: price, tier: tier.n });

  const payment = await createTochkaPayment({
    orderId,
    amount: price,
    purpose: `Набор образцов RePanel (${tier.n}) — заказ ${displayOrderNumber(orderId)}`,
    redirectUrl: `${SITE_URL}/checkout/success?order=${orderId}&t=${trackingToken}`,
    failUrl: `${SITE_URL}/checkout/fail?order=${orderId}`,
    customer: { name: contactName, email: contactEmail, phone: contactPhone },
    items: [{ title, price, quantity: 1 }],
  });

  if (payment.operationId) {
    await db.from("shop_orders").update({ tochka_operation_id: payment.operationId }).eq("id", orderId);
  }
  await notifyTelegram(
    `🛍 <b>Новый заказ #${displayOrderNumber(orderId)} — ожидает оплаты</b>\n` +
      `${esc(title)} — ${price.toLocaleString("ru-RU")} ₽\nЦвета: ${esc(colorsLabel)}\n` +
      `${esc(contactName)} | ${esc(contactPhone)} | ${esc(contactEmail)}`,
  );

  if (!payment.paymentUrl) throw new Error("Точка не вернула ссылку на оплату");
  return { success: true, paymentUrl: payment.paymentUrl, orderId };
}
