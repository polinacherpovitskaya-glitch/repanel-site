"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BODY = "'Gramatika', sans-serif";
const HAIRLINE = "rgba(23,21,19,0.15)";

export function NewReturnForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orderId.trim()) {
      setError("Укажите № заказа");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId.trim(),
        reason: reason.trim() || undefined,
        amount: parseInt(amount, 10) || 0,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Не удалось создать возврат");
      return;
    }
    const { id } = await res.json();
    router.push(`/admin/returns/${id}`);
    router.refresh();
  };

  const inputCls =
    "border px-3 py-2 text-[14px] text-[#171513] outline-none focus:border-[#171513] bg-white";

  return (
    <div className="border p-5 mb-7" style={{ borderColor: HAIRLINE, fontFamily: BODY }}>
      <h2 className="text-[15px] font-bold text-[#171513] mb-4">Оформить возврат по № заказа</h2>
      <form onSubmit={submit} className="flex flex-wrap items-start gap-3">
        <input
          type="text"
          placeholder="№ заказа (uuid)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className={`${inputCls} w-[300px]`}
          style={{ borderColor: HAIRLINE }}
        />
        <input
          type="text"
          placeholder="Причина"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inputCls} flex-1 min-w-[200px]`}
          style={{ borderColor: HAIRLINE }}
        />
        <input
          type="number"
          placeholder="Сумма, ₽"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`${inputCls} w-[140px]`}
          style={{ borderColor: HAIRLINE }}
        />
        <button
          type="submit"
          disabled={saving}
          className="cart-pill bg-[#171513] text-white px-5 py-2 text-[14px] disabled:opacity-50"
        >
          {saving ? "Создаю…" : "Оформить"}
        </button>
      </form>
      {error && <p className="text-[13px] text-[#C62828] mt-3">{error}</p>}
    </div>
  );
}
