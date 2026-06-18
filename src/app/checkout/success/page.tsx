"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const token = params.get("t");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!orderId || !token) return;
    let stopped = false;
    let attempts = 0;
    const maxAttempts = 6;

    async function verify() {
      try {
        const res = await fetch("/api/orders/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: orderId, token }),
        });
        const data = await res.json();
        if (data.status === "paid") {
          if (!stopped) setPaid(true);
          return;
        }
      } catch {
        /* сеть моргнула — просто повторим */
      }
      attempts += 1;
      if (!stopped && attempts < maxAttempts) setTimeout(verify, 3000);
    }

    verify();
    return () => {
      stopped = true;
    };
  }, [orderId, token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-[var(--site-margins)]">
      <div className="max-w-lg w-full text-center">
        <div style={{ fontSize: 56, marginBottom: 16 }}>{paid ? "✓" : "⏳"}</div>
        <h1
          className="font-bold text-[#171513]"
          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "-0.02em" }}
        >
          {paid ? "Оплата прошла!" : "Заказ оформлен"}
        </h1>
        <p className="mt-4 mx-auto max-w-[460px]" style={{ fontFamily: BODY, fontSize: "15px", color: "rgba(23,21,19,0.6)", lineHeight: 1.6 }}>
          {paid
            ? "Спасибо за заказ! Мы получили оплату и начинаем готовить ваш набор образцов."
            : "Мы получили заказ и проверяем оплату. Если вы только что оплатили — это займёт несколько секунд."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/samples" className="px-7 py-3.5" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "14px", background: "#171513", color: "#FFFFFF" }}>
            В образцы
          </Link>
          <Link href="/" className="px-7 py-3.5" style={{ fontFamily: BODY, fontSize: "14px", border: "1px solid rgba(23,21,19,0.2)", color: "#171513" }}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div style={{ fontSize: 56 }}>⏳</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
