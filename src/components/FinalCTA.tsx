import { UnderlineLink } from "./UnderlineLink";

const BODY = "'Gramatika', sans-serif";

/**
 * Финальный CTA-блок в стиле главной — переиспользуется в конце каждой страницы.
 * Верхний хайрлайн — во всю ширину экрана (на самом <section>).
 * compact — мелкая подпись + малый отступ (для страницы проекта, Figma 68:4979).
 */
export function FinalCTA({
  heading = "Обсудим ваш проект?",
  text = "Опишите задачу — подберём материал, цвет и формат. Бесплатные образцы, чертёж и расчёт под ваш проект.",
  compact = false,
}: {
  heading?: string;
  text?: string;
  compact?: boolean;
}) {
  return (
    <section className={`px-[var(--site-margins)] border-t border-[#171513] pb-20 lg:pb-32 ${compact ? "pt-8 lg:pt-10" : "pt-10 lg:pt-16"}`}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        {compact ? (
          <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "15px", lineHeight: "20px" }}>
            {heading}
          </p>
        ) : (
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
        )}
        <p
          className={`text-[#171513] max-w-[560px] ${compact ? "mt-2.5" : "mt-5 lg:mt-7"}`}
          style={{ fontFamily: BODY, fontSize: compact ? "14.6px" : "clamp(15px, 1.3vw, 18px)", lineHeight: compact ? "20px" : 1.5 }}
        >
          {text}
        </p>
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${compact ? "mt-5" : "mt-8 lg:mt-10"}`}>
          <UnderlineLink href="https://t.me/panelpanelre" external>
            Написать в Telegram →
          </UnderlineLink>
          <UnderlineLink href="/contacts">Запросить расчёт →</UnderlineLink>
        </div>
      </div>
    </section>
  );
}
