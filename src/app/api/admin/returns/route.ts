import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server-db";

export const runtime = "nodejs";

function toInt(value: unknown, fallback = 0): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

/** Создание заявки на возврат по № заказа. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const orderId = String(body.order_id ?? "").trim();
    if (!orderId) {
      return NextResponse.json({ error: "Укажите № заказа" }, { status: 400 });
    }

    const reason = String(body.reason ?? "").trim() || null;
    const amount = Math.max(0, toInt(body.amount, 0));

    const db = supabaseAdmin();
    const { data, error } = await db
      .from("returns")
      .insert({
        order_id: orderId,
        reason,
        amount,
        status: "requested",
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Не удалось создать возврат" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[admin/returns POST]", err);
    return NextResponse.json({ error: "Не удалось создать возврат" }, { status: 500 });
  }
}
