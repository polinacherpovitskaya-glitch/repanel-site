import { UnderlineLink } from "./UnderlineLink";

/**
 * Финальный CTA-блок в стиле главной — переиспользуется в конце каждой страницы.
 * Верхний хайрлайн — во всю ширину экрана (на самом <section>).
 */
export function FinalCTA({
  heading = "Обсудим ваш проект?",
  text = "Опишите задачу — подберём материал, цвет и формат. Бесплатные образцы, чертёж и расчёт под ваш проект.",
}: {
  heading?: string;
  text?: string;
}) {
  return (
    <section className="px-[var(--site-margins)] border-t border-[#171513] pt-10 lg:pt-16 pb-20 lg:pb-32">
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <h2
          className="font-bold text-[#171513]"
          style={{
            fontFamily: "'Chalet', 'Gramatika', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(40px, 7vw, 96px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
          }}
        >
          {heading}
        </h2>
        <p
          className="text-[#171513] mt-5 lg:mt-7 max-w-[560px]"
          style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "clamp(15px, 1.3vw, 18px)", lineHeight: 1.5 }}
        >
          {text}
        </p>
        <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <UnderlineLink href="https://t.me/panelpanelre" external>
            Написать в Telegram →
          </UnderlineLink>
          <UnderlineLink href="/contacts">Запросить расчёт →</UnderlineLink>
        </div>
      </div>
    </section>
  );
}
