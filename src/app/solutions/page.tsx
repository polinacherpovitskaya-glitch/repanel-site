import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

const D = "'Montserrat', var(--font-display), sans-serif";
const I = "'Gramatika', var(--font-sans), sans-serif";

export const metadata: Metadata = {
  title: "Решения RePanel — по секторам и задачам",
  description:
    "Готовые решения из переработанного пластика для ритейла, HoReCa, девелопмента и мебели.",
};

/* ── Data ── */

const sectors = [
  {
    title: "Ритейл",
    description:
      "Магазины, шоурумы, торговые пространства. Стойки, дисплеи, POS-материалы.",
    href: "/solutions/retail",
    img: "/images/photo_2025-09-09 10.08.38.jpeg",
  },
  {
    title: "HoReCa",
    description:
      "Кафе, рестораны, бары, отели. Барные стойки, столешницы, панели.",
    href: "/solutions/horeca",
    img: "/images/DSC09441.jpg",
  },
  {
    title: "Городская среда и МАФ",
    description:
      "Скамейки, кашпо, игровые модули, навигация для парков и общественных пространств. МАФ из переработанного пластика.",
    href: "/solutions/public",
    img: "/images/DSC02233.jpg",
  },
  {
    title: "Офисные пространства",
    description:
      "Перегородки, ресепшен, акустика, мебель для подрядчиков и дизайнеров. ЕАС-сертифицированный материал.",
    href: "/solutions/furniture-objects",
    img: "/images/ro0184.jpg",
  },
];

const stats = [
  { value: "40 000+", label: "объектов для крупнейших девелоперов" },
  { value: "1000+", label: "м² панелей ежемесячно" },
  { value: "100+", label: "реализованных проектов" },
  { value: "12", label: "цветов в базовой палитре" },
];

const steps = [
  {
    title: "Бриф",
    desc: "Вы описываете задачу, размеры, тираж. Мы подбираем формат материала.",
  },
  {
    title: "Подбор решений",
    desc: "Подбираем цвет и способ обработки для максимальной стойкости в конкретных условиях.",
  },
  {
    title: "Производство и поставка",
    desc: "Изготовливаем и доставим по вашему графику (МСК 1-80 минут, РФ от 3 дней).",
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* ══════ HERO ══════ */}
      <section style={{ padding: "80px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h1
            className="font-bold"
            style={{
              fontFamily: D,
              fontSize: 52,
              letterSpacing: -1.5,
              lineHeight: 0.92,
            }}
          >
            Решения RePanel
          </h1>
          <p
            className="mt-5"
            style={{
              fontFamily: I,
              fontSize: 18,
              lineHeight: 1.5,
              maxWidth: 700,
            }}
          >
            От панелей до готовых объектов — для каждого сценария свой путь
          </p>
        </div>
      </section>

      {/* ══════ SECTOR GRID 2×2 ══════ */}
      <section style={{ padding: "0 20px 60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 24 }}
          >
            {sectors.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="card-hover flex flex-col"
                style={{ borderTop: "1px solid #000", paddingTop: 16 }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: 300 }}
                >
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div
                  className="flex flex-col"
                  style={{ gap: 16, paddingTop: 16 }}
                >
                  <h3
                    className="font-bold"
                    style={{ fontFamily: D, fontSize: 24 }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: I, fontSize: 14, lineHeight: 1.5 }}>
                    {s.description}
                  </p>
                  <span
                    className="font-bold"
                    style={{ fontFamily: D, fontSize: 14 }}
                  >
                    Подробнее →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ REPANEL В ЦИФРАХ ══════ */}
      <section style={{ padding: "80px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: 24 }}>
            <h2
              className="font-bold"
              style={{
                fontFamily: D,
                fontSize: 52,
                letterSpacing: -1.5,
                lineHeight: 0.92,
              }}
            >
              RePanel в цифрах
            </h2>
            <div
              className="grid grid-cols-2 lg:grid-cols-4 mt-8"
              style={{ gap: 32 }}
            >
              {stats.map((s) => (
                <div
                  key={s.value}
                  style={{ borderTop: "1px solid #000", paddingTop: 24 }}
                >
                  <p
                    className="font-bold"
                    style={{
                      fontFamily: D,
                      fontSize: 52,
                      letterSpacing: -1.5,
                      lineHeight: 0.92,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="mt-2"
                    style={{ fontFamily: I, fontSize: 18, lineHeight: 1.5 }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ КАК МЫ РАБОТАЕМ ══════ */}
      <section style={{ padding: "60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold"
            style={{
              fontFamily: D,
              fontSize: 52,
              letterSpacing: -1.5,
              lineHeight: 0.92,
            }}
          >
            Как мы работаем
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 mt-8"
            style={{ gap: 24 }}
          >
            {steps.map((s) => (
              <div
                key={s.title}
                className="flex flex-col"
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: 16,
                  gap: 12,
                }}
              >
                <h3
                  className="font-bold"
                  style={{ fontFamily: D, fontSize: 24 }}
                >
                  {s.title}
                </h3>
                <p style={{ fontFamily: I, fontSize: 18, lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section style={{ padding: "40px 20px" }}>
        <div
          className="mx-auto flex flex-col lg:flex-row"
          style={{ maxWidth: 1440, gap: 40 }}
        >
          <div className="flex-1 flex flex-col" style={{ gap: 16 }}>
            <h2
              className="font-bold"
              style={{
                fontFamily: D,
                fontSize: 52,
                letterSpacing: -1.5,
                lineHeight: 0.92,
              }}
            >
              Обсудим ваш проект
            </h2>
            <p style={{ fontFamily: I, fontSize: 18, lineHeight: 1.5 }}>
              Пришлите задачу, размеры, сроки и референсы. Мы предложим формат
              материала, вариант реализации и следующий шаг.
            </p>
            <p style={{ fontFamily: I, fontSize: 18 }}>info@re-panel.ru</p>
            <p style={{ fontFamily: I, fontSize: 18 }}>@repanel</p>
          </div>
          <div className="flex-1">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
