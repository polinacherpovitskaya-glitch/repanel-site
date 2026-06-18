import { NextRequest, NextResponse } from "next/server";
import { calculateDelivery } from "@/lib/cdek";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { toCityCode, weight, tariffCode } = await req.json().catch(() => ({}));
    if (!toCityCode) return NextResponse.json({ price: null, deliveryDays: "" });
    const data = await calculateDelivery({
      toCityCode: Number(toCityCode),
      weight: Number(weight) || 500,
      tariffCode: Number(tariffCode) || 136,
    });
    const price = Math.ceil(Number(data?.total_sum ?? data?.delivery_sum ?? 0));
    const days =
      data?.period_min != null && data?.period_max != null ? `${data.period_min}–${data.period_max} дн.` : "";
    return NextResponse.json({ price: price > 0 ? price : null, deliveryDays: days });
  } catch (err) {
    console.warn("[cdek/calculate]", err);
    return NextResponse.json({ price: null, deliveryDays: "" });
  }
}
