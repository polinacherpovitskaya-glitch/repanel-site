import type { ReactNode } from "react";

// Минимальная оболочка под /admin/* (шрифт + белый фон). Навигация/выход — в AdminShell
// внутри авторизованных страниц, чтобы не показывать их на /admin/login.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", color: "#171513" }}>{children}</div>
  );
}
