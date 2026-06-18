import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function toInt(value: unknown, fallback = 0): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function toIntOrNull(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

/** Обновление товара. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ error: "Укажите название" }, { status: 400 });
    }

    const payload = {
      title,
      slug: String(body.slug ?? "").trim() || null,
      price: toInt(body.price, 0),
      description: String(body.description ?? "").trim() || null,
      category: String(body.category ?? "").trim(),
      image_url: String(body.image_url ?? "").trim() || null,
      is_published: body.is_published !== false,
      weight_grams: toIntOrNull(body.weight_grams),
      sort_order: toInt(body.sort_order, 0),
    };

    const db = supabaseAdmin();
    const { error } = await db.from("products").update(payload).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products PATCH]", err);
    return NextResponse.json({ error: "Не удалось сохранить товар" }, { status: 500 });
  }
}

/** Удаление товара. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = supabaseAdmin();
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products DELETE]", err);
    return NextResponse.json({ error: "Не удалось удалить товар" }, { status: 500 });
  }
}
