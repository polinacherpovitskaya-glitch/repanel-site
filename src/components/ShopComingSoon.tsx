const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

const PHRASE = "Скоро открытие · ";

/** Заглушка магазина «скоро» — мелкий повторяющийся текст-паттерн (как обои).
 *  fill=false (главная): компактный блок в 5 строк.
 *  fill=true (/catalog): паттерн на всю высоту экрана — до секции рассылки в футере. */
export function ShopComingSoon({ fill = false }: { fill?: boolean }) {
  const rows = fill ? 30 : 5;
  return (
    <div
      className="overflow-hidden select-none"
      aria-label="Скоро открытие"
      style={fill ? { height: "calc(100dvh - 140px)" } : undefined}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <p
          key={i}
          aria-hidden
          className="whitespace-nowrap"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(20px, 2.4vw, 30px)",
            lineHeight: 1.28,
            letterSpacing: "-0.02em",
            color: "rgba(23, 21, 19, 0.2)",
            transform: `translateX(${i % 2 ? "-6%" : "-2%"})`,
          }}
        >
          {PHRASE.repeat(16)}
        </p>
      ))}
    </div>
  );
}
