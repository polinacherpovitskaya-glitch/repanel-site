"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HAIRLINE = "rgba(23,21,19,0.15)";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "requested", label: "Запрошен" },
  { value: "approved", label: "Одобрен" },
  { value: "refunded", label: "Возвращён" },
  { value: "rejected", label: "Отклонён" },
];

export function ReturnControls({
  returnId,
  currentStatus,
  orderId,
  amount,
  canRefund,
}: {
  returnId: string;
  currentStatus: string;
  orderId: string | null;
  amount: number;
  canRefund: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [savingStatus, setSavingStatus] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const changeStatus = async (next: string) => {
    setError(null);
    setNotice(null);
    setStatus(next);
    setSavingStatus(true);
    const res = await fetch(`/api/admin/returns/${returnId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSavingStatus(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Не удалось обновить статус");
      setStatus(currentStatus);
      return;
    }
    router.refresh();
  };

  const refund = async () => {
    if (!orderId) return;
    if (!confirm(`Вернуть ${amount.toLocaleString("ru-RU")} ₽ через Точку? Это реальный возврат денег.`)) return;
    setError(null);
    setNotice(null);
    setRefunding(true);
    const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    setRefunding(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(d.error ?? "Возврат не прошёл");
      return;
    }
    // Деньги вернулись — переводим заявку в «Возвращён».
    await fetch(`/api/admin/returns/${returnId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "refunded" }),
    });
    setStatus("refunded");
    setNotice("Возврат выполнен.");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-[12px] uppercase tracking-wide text-[#171513]/50 mb-2">Статус</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const on = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={savingStatus}
                onClick={() => changeStatus(opt.value)}
                className="cart-pill px-4 py-1.5 text-[13px] border transition-colors disabled:opacity-50"
                style={{
                  background: on ? "#171513" : "#fff",
                  color: on ? "#fff" : "#171513",
                  borderColor: on ? "#171513" : HAIRLINE,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[12px] uppercase tracking-wide text-[#171513]/50 mb-2">Деньги</div>
        <button
          type="button"
          disabled={!canRefund || refunding}
          onClick={refund}
          className="cart-pill px-5 py-2 text-[14px] border disabled:opacity-40"
          style={{ background: "#fff", color: "#C62828", borderColor: "#C62828" }}
        >
          {refunding ? "Возвращаю…" : `Вернуть деньги через Точку (${amount.toLocaleString("ru-RU")} ₽)`}
        </button>
        {!canRefund && (
          <p className="text-[12px] text-[#171513]/50 mt-2">
            Возврат доступен для оплаченного заказа с операцией Точки и суммой больше 0.
          </p>
        )}
      </div>

      {error && <p className="text-[13px] text-[#C62828]">{error}</p>}
      {notice && <p className="text-[13px] text-[#2C8A2C]">{notice}</p>}
    </div>
  );
}
