import { UnderlineLink } from "@/components/UnderlineLink";

export const metadata = { title: "Конфиденциальность — RePanel" };

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

export default function PrivacyPage() {
  return (
    <section className="px-[var(--site-margins)] pt-24 lg:pt-32 pb-20 lg:pb-32">
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px, 6vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.03em", overflowWrap: "break-word", WebkitHyphens: "auto", hyphens: "auto" }}>
          Политика конфиденциальности
        </h1>
        <p className="mt-6 text-[#171513] max-w-[720px]" style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.55 }}>
          Полный текст политики обработки персональных данных и использования cookies готовится.
          Пока по любым вопросам о данных — напишите нам.
        </p>
        <div className="mt-8">
          <UnderlineLink href="/contacts" fontSize={16}>Связаться →</UnderlineLink>
        </div>
      </div>
    </section>
  );
}
