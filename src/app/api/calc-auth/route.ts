import { cookies } from "next/headers";

const COOKIE = "calc_auth";

/** Вход в приватный раздел расчётов: проверка пароля → ставим сессионную куку. */
export async function POST(request: Request) {
  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }

  const password = String(body.password ?? "");
  const expected = process.env.CALC_PASSWORD ?? "";
  const token = process.env.CALC_TOKEN ?? "";

  if (!expected || !token) return Response.json({ error: "Раздел не настроен" }, { status: 500 });
  if (password !== expected) return Response.json({ error: "Неверный пароль" }, { status: 401 });

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
    secure: process.env.NODE_ENV === "production",
  });
  return Response.json({ ok: true });
}

/** Выход. */
export async function DELETE() {
  (await cookies()).delete(COOKIE);
  return Response.json({ ok: true });
}
