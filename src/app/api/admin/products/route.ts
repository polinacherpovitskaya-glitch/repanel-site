import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { commonProductFields } from "@/lib/product-fields";

export const runtime = "nodejs";

/* Транслитерация кириллицы → латиница для slug. */
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `tovar-${Date.now()}`;
}

/** Создание товара. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ error: "Укажите название" }, { status: 400 });
    }

    const slugInput = String(body.slug ?? "").trim();
    const slug = slugInput ? slugify(slugInput) : slugify(title);

    const payload = { title, slug, ...commonProductFields(body) };

    const db = supabaseAdmin();
    const { data, error } = await db.from("products").insert(payload).select("id").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[admin/products POST]", err);
    return NextResponse.json({ error: "Не удалось создать товар" }, { status: 500 });
  }
}
