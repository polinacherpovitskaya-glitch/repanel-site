import Link from "next/link";

const items = [
  { key: "price", label: "Прайс", href: "/calc/prices" },
  { key: "calc", label: "Расчёт по м²", href: "/calc" },
  { key: "countertop", label: "Столешница", href: "/calc/countertop" },
];

/** Переключатель трёх режимов приватных расчётов: Прайс · Расчёт по м² · Столешница. */
export function CalcNav({ active }: { active: "price" | "calc" | "countertop" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const on = it.key === active;
        return (
          <Link
            key={it.key}
            href={it.href}
            className="px-5 py-2.5 transition-colors"
            style={{ fontFamily: "'Gramatika', sans-serif", fontWeight: 700, fontSize: "13.5px", border: "1px solid #171513", background: on ? "#171513" : "transparent", color: on ? "#FFFFFF" : "#171513" }}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
