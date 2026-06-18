"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const BODY = "'Gramatika', sans-serif";

const NAV = [
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/certificates", label: "Сертификаты" },
  { href: "/admin/returns", label: "Возвраты" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div style={{ fontFamily: BODY }}>
      <header className="flex items-center gap-6 px-6 h-14 border-b border-[#171513]/15 sticky top-0 bg-white z-10">
        <Link href="/admin" className="font-bold text-[#171513] text-[15px] whitespace-nowrap">
          RePanel · админка
        </Link>
        <nav className="flex items-center gap-5">
          {NAV.map((n) => {
            const on = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className="text-[14px] transition-opacity" style={{ color: "#171513", fontWeight: on ? 700 : 400, opacity: on ? 1 : 0.55 }}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="ml-auto text-[13px] text-[#171513]/50 hover:text-[#171513] transition-colors cursor-pointer">
          Выйти
        </button>
      </header>
      <main className="px-6 py-7 mx-auto w-full" style={{ maxWidth: 1200 }}>
        {children}
      </main>
    </div>
  );
}
