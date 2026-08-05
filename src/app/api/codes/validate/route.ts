import { NextRequest, NextResponse } from "next/server";
import { siteDb } from "@/lib/server-db";
import { validateCode } from "@/lib/codes";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { code, itemsTotal, shipping } = await req.json().catch(() => ({}));
    const db = siteDb();
    const result = await validateCode(db, String(code ?? ""), Number(itemsTotal) || 0, Number(shipping) || 0);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[codes/validate]", err);
    return NextResponse.json({ valid: false, message: "Не удалось проверить код" });
  }
}
