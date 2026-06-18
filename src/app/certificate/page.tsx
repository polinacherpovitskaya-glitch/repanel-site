"use client";

// Подарочный сертификат: выбор номинала + получатель → в корзину (certificate_payload).
// При оплате вебхук/поллинг выпускает сертификат (lib/certificates).
import { useState } from "react";
import { useCart } from "@/lib/cart";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const OLIVE = "#66704D";
const PRESETS = [3000, 5000, 10000, 15000];

export default function CertificatePage() {
  const { addItem, openCart } = useCart();
  const [amount, setAmount] = useState(5000);
  const [form, setForm] = useState({ recipient_name: "", recipient_email: "", message: "" });

  const valid = amount >= 1000 && amount <= 100000;

  const add = () => {
    if (!valid) return;
    addItem({
      id: `certificate-${amount}`,
      title: `Подарочный сертификат — ${amount.toLocaleString("ru-RU")} ₽`,
      price: amount,
      image_url: null,
      color: form.recipient_name ? `Кому: ${form.recipient_name}` : undefined,
      certificate_payload: {
        amount,
        recipient_name: form.recipient_name.trim(),
        recipient_email: form.recipient_email.trim(),
        message: form.message.trim() || undefined,
      },
    });
    openCart();
  };

  const input = "w-full border-0 border-b border-[#171513] bg-transparent pt-5 pb-2 text-[16px] text-[#171513] outline-none placeholder:text-[#171513]/40";

  return (
    <section className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-16" style={{ fontFamily: BODY }}>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" style={{ maxWidth: 1440 }}>
        {/* Левая колонка — описание + номинал */}
        <div className="lg:col-span-5">
          <p style={{ fontSize: 13, color: "rgba(23,21,19,0.45)" }}>Подарок</p>
          <h1 className="font-bold text-[#171513] mt-1" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px, 3.6vw, 52px)", letterSpacing: "-0.02em", lineHeight: 1.02 }}>
            Подарочный сертификат
          </h1>
          <p className="text-[#171513] mt-4 max-w-[460px]" style={{ fontSize: "14.6px", lineHeight: "21px", opacity: 0.8 }}>
            Электронный сертификат RePanel на любую сумму. После оплаты придёт код, который можно потратить на любой заказ на сайте. Срок действия — 1 год.
          </p>

          <p className="font-bold text-[#171513] mt-7 mb-2" style={{ fontSize: 14 }}>Номинал</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((v) => {
              const on = amount === v;
              return (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="px-4 py-3 transition-colors cursor-pointer"
                  style={{ border: `1px solid ${on ? OLIVE : "rgba(23,21,19,0.2)"}`, background: on ? OLIVE : "transparent", color: on ? "#FFFFFF" : "#171513", fontWeight: 700, fontSize: 15 }}
                >
                  {v.toLocaleString("ru-RU")} ₽
                </button>
              );
            })}
          </div>
          <label className="block mt-4">
            <span style={{ fontSize: 13, color: "rgba(23,21,19,0.6)" }}>Или своя сумма (₽)</span>
            <input
              type="number"
              min={1000}
              max={100000}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
              className={input}
              style={{ fontFamily: BODY }}
            />
          </label>
          {!valid && <p className="mt-2 text-[13px] text-[#b00020]">Сумма от 1 000 до 100 000 ₽</p>}
        </div>

        {/* Правая колонка — получатель */}
        <div className="lg:col-start-7 lg:col-span-6">
          <p className="font-bold text-[#171513] mb-1" style={{ fontSize: 14 }}>Кому (необязательно)</p>
          <input placeholder="Имя получателя" value={form.recipient_name} onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))} className={input} style={{ fontFamily: BODY }} />
          <input type="email" placeholder="E-mail получателя" value={form.recipient_email} onChange={(e) => setForm((f) => ({ ...f, recipient_email: e.target.value }))} className={input} style={{ fontFamily: BODY }} />
          <textarea placeholder="Поздравление (необязательно)" rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full border border-[#171513] p-3 mt-5 text-[16px] bg-transparent outline-none resize-none placeholder:text-[#171513]/40" style={{ fontFamily: BODY }} />

          <button
            onClick={add}
            disabled={!valid}
            className="cart-pill w-full mt-6 px-6 py-3.5 transition-opacity cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: BODY, fontWeight: 700, fontSize: 15, background: "#171513", color: "#FFFFFF" }}
          >
            В корзину — {amount.toLocaleString("ru-RU")} ₽
          </button>
          <p className="mt-2.5" style={{ fontSize: 12, color: "rgba(23,21,19,0.45)", lineHeight: 1.45 }}>
            Сертификат придёт кодом после оплаты. Оплата картой или СБП через Точку.
          </p>
        </div>
      </div>
    </section>
  );
}
