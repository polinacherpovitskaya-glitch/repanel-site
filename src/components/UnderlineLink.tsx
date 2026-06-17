import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Подчёркнутая ссылка в стиле главной: линия под текстом «стирается» слева направо при наведении.
 * Работает как внутренняя (next/link) или внешняя (<a target=_blank>) ссылка.
 * inline-block + self-start → подчёркивание строго по ширине текста (не на весь контейнер).
 */
export function UnderlineLink({
  href,
  children,
  external = false,
  fontSize = 18,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  fontSize?: number | string;
}) {
  const cls = "group/ul relative inline-block self-start pb-[3px]";
  const style = {
    fontFamily: "'Gramatika', sans-serif",
    fontWeight: 700,
    fontSize,
    color: "#171513",
  } as const;
  const inner = (
    <>
      {children}
      <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-[#171513] origin-right scale-x-100 group-hover/ul:scale-x-0 transition-transform duration-[450ms] ease-out" />
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} style={style}>
      {inner}
    </Link>
  );
}
