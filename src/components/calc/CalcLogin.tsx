"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

/** Форма пароля для приватного раздела расчётов. */
export function CalcLogin() {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pwd) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/calc-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pwd }) });
      if (res.ok) {
        router.refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Неверный пароль");
        setLoading(false);
      }
    } catch {
      setErr("Ошибка соединения. Попробуйте ещё раз.");
      setLoading(false);
    }
  }

  return (
    <section className="px-[var(--site-margins)] pt-24 lg:pt-36 pb-32" style={{ minHeight: "62vh" }}>
      <div className="mx-auto" style={{ maxWidth: 480 }}>
        <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.0, letterSpacing: "-0.03em" }}>
          Доступ к расчётам
        </h1>
        <p className="mt-5 text-[#171513]" style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.5 }}>
          Раздел закрыт. Введите пароль — его даёт менеджер RePanel.
        </p>
        <form onSubmit={submit} className="mt-8">
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Пароль"
            autoFocus
            className="w-full bg-transparent border-b border-[#171513] pb-2 placeholder:opacity-40"
            style={{ fontFamily: BODY, fontSize: "22px", color: "#171513", outline: "none" }}
          />
          <button type="submit" disabled={!pwd || loading} className="mt-6 px-8 py-3 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "14px", background: "#171513", color: "#FFFFFF" }}>
            {loading ? "Проверяем…" : "Войти →"}
          </button>
          {err && <p className="mt-4" style={{ fontFamily: BODY, fontSize: "14px", color: "#a33" }}>{err}</p>}
        </form>
      </div>
    </section>
  );
}
