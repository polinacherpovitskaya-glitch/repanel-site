import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CalcLogin } from "@/components/calc/CalcLogin";

// Приватный раздел: не индексируем, не в меню.
export const metadata: Metadata = {
  title: "Расчёты — RePanel",
  robots: { index: false, follow: false },
};

export default async function CalcLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const authed = !!process.env.CALC_TOKEN && cookieStore.get("calc_auth")?.value === process.env.CALC_TOKEN;

  if (!authed) return <CalcLogin />;
  return <>{children}</>;
}
