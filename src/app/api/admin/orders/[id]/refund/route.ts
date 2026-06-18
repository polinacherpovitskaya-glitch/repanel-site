import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { refundTochkaPayment } from "@/lib/tochka";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Реальный возврат денег по заказу через Точку. Отказоустойчиво:
 * сначала возврат в банке — БД трогаем ТОЛЬКО при успехе.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const amount = Math.round(Number(body.amount));
  if (!(amount > 0)) {
    return NextResponse.json({ error: "Некорректная сумма возврата" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // 1. Загружаем заказ.
  const { data: order, error: fetchError } = await db
    .from("shop_orders")
    .select("id, payment_status, tochka_operation_id")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }

  // 2. Валидируем состояние — возврат только для оплаченного заказа с операцией Точки.
  if (order.payment_status !== "paid" || !order.tochka_operation_id) {
    return NextResponse.json(
      { error: "Возврат возможен только для оплаченного заказа с операцией Точки" },
      { status: 400 },
    );
  }

  // 3. Сначала возврат в Точке. Если упало — БД НЕ трогаем.
  try {
    await refundTochkaPayment(order.tochka_operation_id, amount);
  } catch (e) {
    return NextResponse.json(
      { error: "Возврат не прошёл в Точке: " + (e instanceof Error ? e.message : String(e)) },
      { status: 400 },
    );
  }

  // 4. Только при успехе — обновляем заказ.
  const { error: updateError } = await db
    .from("shop_orders")
    .update({
      payment_status: "refunded",
      status: "refunded",
      refunded_at: new Date().toISOString(),
      refund_amount: amount,
    })
    .eq("id", id);

  if (updateError) {
    console.error("[refund] DB update FAILED after successful Tochka refund:", updateError);
    return NextResponse.json(
      { error: "Возврат прошёл в банке, но статус заказа не обновился: " + updateError.message },
      { status: 500 },
    );
  }

  await db.from("order_timeline").insert({
    order_id: id,
    event_type: "refund",
    actor: "admin",
    payload: { amount },
  });

  return NextResponse.json({ ok: true });
}
