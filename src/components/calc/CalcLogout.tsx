"use client";

import { useRouter } from "next/navigation";

/** Выход из приватного раздела расчётов. */
export function CalcLogout() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/calc-auth", { method: "DELETE" });
    router.refresh();
  }
  return (
    <button onClick={logout} className="hover:opacity-60 transition-opacity cursor-pointer" style={{ fontFamily: "'Gramatika', sans-serif", fontWeight: 700, fontSize: "13px", color: "#171513", opacity: 0.6 }}>
      Выйти
    </button>
  );
}
