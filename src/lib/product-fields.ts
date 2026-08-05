import type { ProductColor } from "@/lib/shop-types";

export function toInt(value: unknown, fallback = 0): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function toIntOrNull(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function sanitizeGallery(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((u): u is string => typeof u === "string" && u.trim() !== "").slice(0, 20);
}

function sanitizeColors(raw: unknown): ProductColor[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
    .map((c) => ({
      name: String(c.name ?? "").trim(),
      hex: String(c.hex ?? "").trim() || "#999999",
      image: c.image ? String(c.image) : null,
    }))
    .filter((c) => c.name || c.image)
    .slice(0, 24);
}

/** Общие поля товара из тела запроса (без title/slug — их роуты задают сами). */
export function commonProductFields(body: Record<string, unknown>) {
  return {
    price: toInt(body.price, 0),
    description: String(body.description ?? "").trim() || null,
    category: String(body.category ?? "").trim(),
    image_url: String(body.image_url ?? "").trim() || null,
    gallery_urls: sanitizeGallery(body.gallery_urls),
    colors: sanitizeColors(body.colors),
    weight_grams: toIntOrNull(body.weight_grams),
    length_cm: toIntOrNull(body.length_cm),
    width_cm: toIntOrNull(body.width_cm),
    height_cm: toIntOrNull(body.height_cm),
    sort_order: toInt(body.sort_order, 0),
    is_published: body.is_published !== false,
  };
}
