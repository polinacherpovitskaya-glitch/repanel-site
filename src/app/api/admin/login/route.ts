import { cookies } from "next/headers";

const COOKIE = "admin_auth";

/** Вход в админку: проверка пароля → httpOnly-кука с токеном. */
export async function POST(req: Request) {
  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const password = String(body.password ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const token = process.env.ADMIN_TOKEN ?? "";
  if (!expected || !token) return Response.json({ error: "Админка не настроена" }, { status: 500 });
  if (password !== expected) return Response.json({ error: "Неверный пароль" }, { status: 401 });

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    secure: process.env.NODE_ENV === "production",
  });
  return Response.json({ ok: true });
}

/** Выход. */
export async function DELETE() {
  (await cookies()).delete(COOKIE);
  return Response.json({ ok: true });
}
