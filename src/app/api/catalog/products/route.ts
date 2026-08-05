import { NextResponse } from "next/server";
import { siteDb } from "@/lib/server-db";

export const runtime = "nodejs";

export async function GET() {
  const { data, error } = await siteDb()
    .from("products")
    .select("id, slug, title, price, image_url")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(30);

  if (error) {
    console.error("[catalog/products]", error);
    return NextResponse.json({ error: "Каталог временно недоступен" }, { status: 503 });
  }
  return NextResponse.json(
    { products: data ?? [] },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
  );
}
