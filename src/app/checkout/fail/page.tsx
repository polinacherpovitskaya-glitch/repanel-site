import Link from "next/link";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export default function CheckoutFailPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-[var(--site-margins)]">
      <div className="max-w-lg w-full text-center">
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
        <h1
          className="font-bold text-[#171513]"
          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "-0.02em" }}
        >
          Оплата не завершена
        </h1>
        <p className="mt-4 mx-auto max-w-[460px]" style={{ fontFamily: BODY, fontSize: "15px", color: "rgba(23,21,19,0.6)", lineHeight: 1.6 }}>
          Платёж не прошёл или был отменён. Заказ сохранён — можно попробовать оплатить ещё раз.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/samples" className="px-7 py-3.5" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "14px", background: "#171513", color: "#FFFFFF" }}>
            Вернуться к образцам
          </Link>
          <Link href="/" className="px-7 py-3.5" style={{ fontFamily: BODY, fontSize: "14px", border: "1px solid rgba(23,21,19,0.2)", color: "#171513" }}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
