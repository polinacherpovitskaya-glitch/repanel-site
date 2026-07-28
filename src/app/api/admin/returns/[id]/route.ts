import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server-db";

export const runtime = "nodejs";

const ALLOWED_STATUSES = ["requested", "approved", "refunded", "rejected"] as const;
type ReturnStatus = (typeof ALLOWED_STATUSES)[number];

/** Смена статуса возврата. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const status = String(body.status ?? "");
    if (!ALLOWED_STATUSES.includes(status as ReturnStatus)) {
      return NextResponse.json({ error: "status не разрешён" }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { error } = await db
      .from("returns")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/returns PATCH]", err);
    return NextResponse.json({ error: "Не удалось обновить возврат" }, { status: 500 });
  }
}
