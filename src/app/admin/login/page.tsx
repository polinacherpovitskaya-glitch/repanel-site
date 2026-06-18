"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const BODY = "'Gramatika', sans-serif";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Ошибка входа");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ fontFamily: BODY, background: "#FFFFFF" }}>
      <form onSubmit={submit} className="w-full max-w-[360px]">
        <h1 className="text-[24px] font-bold text-[#171513] mb-1">Админка RePanel</h1>
        <p className="text-[13px] text-[#171513]/50 mb-6">Вход по паролю</p>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full border-b border-[#171513] bg-transparent pt-4 pb-2 text-[16px] text-[#171513] outline-none"
          style={{ fontFamily: BODY }}
        />
        {error && <p className="text-[#b00020] text-[13px] mt-3">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="cart-pill w-full mt-6 py-3 bg-[#171513] text-white font-bold text-[14px] cursor-pointer hover:bg-[#2c2a28] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
