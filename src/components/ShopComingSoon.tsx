const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

const ROWS = 3;
const PHRASE = "Скоро открытие · ";

/** Заглушка магазина «скоро» — крупный повторяющийся текст-паттерн (на главной и /catalog). */
export function ShopComingSoon() {
  return (
    <div className="overflow-hidden select-none" aria-label="Скоро открытие">
      {Array.from({ length: ROWS }).map((_, i) => (
        <p
          key={i}
          aria-hidden
          className="whitespace-nowrap"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(46px, 7.6vw, 122px)",
            lineHeight: 1.03,
            letterSpacing: "-0.03em",
            color: "rgba(23, 21, 19, 0.2)",
            transform: `translateX(${i % 2 ? "-9%" : "-3%"})`,
          }}
        >
          {PHRASE.repeat(6)}
        </p>
      ))}
    </div>
  );
}
