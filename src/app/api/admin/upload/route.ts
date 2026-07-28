import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server-db";

export const runtime = "nodejs";

const BUCKET = "product-images";
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX = 10 * 1024 * 1024; // 10 МБ

/** Загрузка одного изображения в Storage → публичный URL. Защищено middleware (admin). */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Только PNG, JPEG, WebP или AVIF" }, { status: 400 });
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: "Файл больше 10 МБ" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
    const path = `products/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const db = supabaseAdmin();
    const { error } = await db.storage.from(BUCKET).upload(path, buf, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { data } = db.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("[admin/upload]", err);
    return NextResponse.json({ error: "Не удалось загрузить файл" }, { status: 500 });
  }
}
