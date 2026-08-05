import { NextRequest, NextResponse } from "next/server";
import { siteDb } from "@/lib/server-db";
import { commonProductFields } from "@/lib/product-fields";

export const runtime = "nodejs";

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
      ...commonProductFields(body),
    };

    const db = siteDb();
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
    const db = siteDb();
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
