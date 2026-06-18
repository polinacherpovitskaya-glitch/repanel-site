"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Скрывает обвязку основного сайта (шапка/футер/промо) на страницах админки. */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
