import { NextRequest, NextResponse } from "next/server";

// Защита админки: /admin/* и /api/admin/* доступны только с валидной cookie admin_auth.
// Логин (/admin/login и /api/admin/login) — открыты.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_auth")?.value;
  const ok = Boolean(process.env.ADMIN_TOKEN) && token === process.env.ADMIN_TOKEN;
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
