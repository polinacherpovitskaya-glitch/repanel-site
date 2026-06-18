"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BODY = "'Gramatika', sans-serif";

const PROCESSING_OPTIONS: { value: string; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "assembling", label: "В сборке" },
  { value: "done", label: "Готов" },
];

const PAYMENT_OPTIONS: { value: string; label: string }[] = [
  { value: "pending", label: "Ожидает" },
  { value: "paid", label: "Оплачен" },
  { value: "failed", label: "Ошибка" },
  { value: "refunded", label: "Возврат" },
];

const selectStyle: React.CSSProperties = {
  fontFamily: BODY,
  fontSize: 14,
  color: "#171513",
  padding: "8px 12px",
  border: "1px solid rgba(23,21,19,0.15)",
  background: "#fff",
  outline: "none",
  width: "100%",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  fontFamily: BODY,
  fontSize: 12,
  color: "rgba(23,21,19,0.55)",
  marginBottom: 6,
  display: "block",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export function OrderStatusControls({
  orderId,
  processingStatus,
  paymentStatus,
}: {
  orderId: string;
  processingStatus: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async (field: string, value: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Не удалось сохранить");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: BODY }}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle} htmlFor="processing_status">
          Статус обработки
        </label>
        <select
          id="processing_status"
          value={processingStatus}
          disabled={saving}
          onChange={(e) => change("processing_status", e.target.value)}
          style={selectStyle}
        >
          {PROCESSING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="payment_status">
          Оплата
        </label>
        <select
          id="payment_status"
          value={paymentStatus}
          disabled={saving}
          onChange={(e) => change("payment_status", e.target.value)}
          style={selectStyle}
        >
          {PAYMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p style={{ fontSize: 12, color: "rgba(23,21,19,0.45)", marginTop: 6 }}>
          Оплата обычно ставится автоматически. Меняйте вручную только при необходимости (возврат / ошибка).
        </p>
      </div>

      {error && (
        <p style={{ fontSize: 13, color: "#C62828", marginTop: 10 }}>{error}</p>
      )}
    </div>
  );
}
