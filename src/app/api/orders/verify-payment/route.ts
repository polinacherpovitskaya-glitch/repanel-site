/**
 * Запасное подтверждение оплаты (поллинг со страницы /checkout/success).
 * На localhost вебхук Точки недоступен, поэтому success-страница опрашивает
 * этот роут: он спрашивает статус у банка и метит заказ paid, если APPROVED.
 *
 * Доступ — по паре order + tracking_token (capability-token из ссылки редиректа),
 * без админ-сессии. Подделать оплату нельзя: paid ставится только если САМ банк
 * подтвердил APPROVED (см. confirmAndMarkPaid). Идемпотентно.
 */
import { NextRequest, NextResponse } from "next/server";
import { siteDb } from "@/lib/server-db";
import { confirmAndMarkPaid, type ShopOrder } from "@/lib/shop-payments";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { order: orderId, token } = await req.json().catch(() => ({}));
    if (!orderId || !token) {
      return NextResponse.json({ status: "pending", error: "missing_params" }, { status: 400 });
    }

    const db = siteDb();
    const { data: order, error } = await db
      .from("shop_orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle<ShopOrder>();

    if (error || !order) {
      return NextResponse.json({ status: "pending", error: "not_found" }, { status: 404 });
    }
    if (!order.tracking_token || String(order.tracking_token) !== String(token)) {
      return NextResponse.json({ status: "pending", error: "forbidden" }, { status: 403 });
    }

    const result = await confirmAndMarkPaid(db, order);
    return NextResponse.json({ status: result.status, paid: result.paid });
  } catch (err) {
    console.error("[verify-payment]", err);
    return NextResponse.json({ status: "pending", error: String(err) });
  }
}
