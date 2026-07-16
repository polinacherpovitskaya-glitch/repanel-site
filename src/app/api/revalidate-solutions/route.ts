import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { SOLUTIONS_TAG } from "@/lib/calc";

// Вебхук on-demand обновления решений. Калькулятор дёргает его при «опубликовать в облако»
// (?secret=... или заголовок x-revalidate-secret) → сайт сбрасывает кэш каталога и на
// следующем запросе тянет свежие тиражи/цены. Никакого опроса по таймеру.
function handle(req: Request) {
  const secret =
    new URL(req.url).searchParams.get("secret") ?? req.headers.get("x-revalidate-secret") ?? "";
  // Токен от случайного дёрганья. Ревалидация безвредна (лишь сброс кэша), поэтому дефолт зашит;
  // при желании переопределяется env SOLUTIONS_REVALIDATE_SECRET на сайте.
  const expected = process.env.SOLUTIONS_REVALIDATE_SECRET || "repanel-solutions-revalidate";
  if (secret !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  // 2-й аргумент обязателен в Next 16 (профиль cacheLife); "max" — самое длинное окно stale-while-revalidate.
  revalidateTag(SOLUTIONS_TAG, "max");
  return NextResponse.json({ ok: true, revalidated: SOLUTIONS_TAG });
}

export async function POST(req: Request) {
  return handle(req);
}

export async function GET(req: Request) {
  return handle(req);
}
