/**
 * Вебхук Точки: вызывается при смене статуса платежа.
 * Тело — JWT (RS256), Content-Type: text/plain.
 *
 * Локально (localhost) Точка его НЕ вызывает — подтверждение идёт поллингом
 * (/api/orders/verify-payment). В проде вебхук регистрируется вручную на
 * https://ДОМЕН/api/tochka-webhook (тип acquiringInternetPayment).
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server-db";
import { verifyTochkaWebhookSignature } from "@/lib/tochka-webhook-verify";
import {
  confirmAndMarkPaid,
  insertTimeline,
  notifyTelegram,
  displayOrderNumber,
  type ShopOrder,
} from "@/lib/shop-payments";

export const runtime = "nodejs";

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT format");
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
  } catch (e) {
    console.error("[tochka-webhook] JWT decode error:", e);
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // RS256-подпись (защита в глубину): monitor — логируем, enforce — отклоняем, off — пропускаем.
    const verifyMode = (process.env.TOCHKA_WEBHOOK_VERIFY ?? "monitor").toLowerCase();
    if (verifyMode !== "off") {
      const sig = await verifyTochkaWebhookSignature(rawBody);
      console.log("[tochka-webhook] signature:", sig, "| mode:", verifyMode);
      if (sig === "invalid" && verifyMode === "enforce") {
        await notifyTelegram("⚠️ Вебхук Точки отклонён: подпись не прошла проверку.");
        return NextResponse.json({ ok: true, rejected: "invalid_signature" });
      }
    }

    const payload = decodeJwtPayload(rawBody);
    const { operationId, status, webhookType, paymentLinkId } = payload as Record<string, string>;

    if (!operationId || !webhookType) return NextResponse.json({ ok: true }); // тест-пинг
    if (webhookType !== "acquiringInternetPayment") return NextResponse.json({ ok: true });

    const db = supabaseAdmin();

    // найти заказ по operationId, иначе по paymentLinkId (= наш order id)
    let order: ShopOrder | null = null;
    {
      const { data } = await db
        .from("shop_orders")
        .select("*")
        .eq("tochka_operation_id", operationId)
        .maybeSingle<ShopOrder>();
      order = data ?? null;
    }
    if (!order && paymentLinkId) {
      const { data } = await db
        .from("shop_orders")
        .select("*")
        .eq("id", paymentLinkId)
        .maybeSingle<ShopOrder>();
      order = data ?? null;
    }
    if (!order) return NextResponse.json({ ok: true, warning: "order_not_found" });

    // дозаписать operationId, если заказ найден по paymentLinkId
    if (operationId && order.tochka_operation_id !== operationId) {
      await db.from("shop_orders").update({ tochka_operation_id: operationId }).eq("id", order.id);
      order = { ...order, tochka_operation_id: operationId };
    }

    if (status === "APPROVED") {
      // перепроверяем оплату у банка и метим paid (идемпотентно)
      await confirmAndMarkPaid(db, order);
    } else if (status === "EXPIRED" || status === "FAILED" || status === "REJECTED") {
      if (order.payment_status !== "failed") {
        await db
          .from("shop_orders")
          .update({ status: "payment_failed", payment_status: "failed" })
          .eq("id", order.id);
        await insertTimeline(db, order.id, "status_change", "payment", {
          layer: "payment",
          from: "pending",
          to: "failed",
        });
        await notifyTelegram(`❌ <b>Оплата не прошла. Заказ #${displayOrderNumber(order.id)}</b>\nСтатус: ${status}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[tochka-webhook]", err);
    return NextResponse.json({ ok: true }); // всегда 200 — иначе Точка ретраит 30 раз
  }
}

// health-check
export async function GET() {
  return NextResponse.json({ ok: true });
}
