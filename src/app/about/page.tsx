import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";
const I = "'Gramatika', var(--font-sans), sans-serif";

export const metadata: Metadata = {
  title: "О RePanel — бренд, подход, команда",
  description:
    "RePanel — производство панелей и объектов из переработанного пластика для коммерческих, интерьерных и бренд-проектов.",
};

const stats = [
  { value: "2021", label: "Год основания" },
  { value: "80+", label: "Б2Б клиентов" },
  { value: "40 000+", label: "Произведённых объектов" },
  { value: "8", label: "Человек в команде" },
];

const formats = [
  {
    title: "Поставка материала",
    text: "Листовой материал для вашего производства или подрядчика. Два формата, диапазон толщин, базовая палитра и кастомизация.",
  },
  {
    title: "Адаптация решений",
    text: "Берём готовые решения из нашего портфолио и адаптируем под цвет, размер, конструкцию и тираж вашего проекта.",
  },
  {
    title: "Полный цикл",
    text: "От идеи до готового изделия: проектирование, производство, контроль и доставка на объект.",
  },
];

const audiences = [
  "Архитекторы",
  "Интерьерные студии",
  "Ритейл",
  "Рестораны",
  "Девелоперы",
  "Мебельные производства",
  "Подрядчики",
  "Франчайзи",
];

const values = [
  {
    title: "Материал с характером",
    text: "Каждая панель уникальна. Мы не пытаемся имитировать натуральные материалы — мы даём переработанному пластику собственную эстетику.",
  },
  {
    title: "Прозрачность",
    text: "Мы говорим прямо: что можем, чего не можем, какие есть ограничения. Это экономит время и строит доверие.",
  },
  {
    title: "Функциональность",
    text: "Красивый материал бесполезен, если он не работает в реальном пространстве. Мы думаем о конструкции, нагрузке, сроке и обслуживании.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ═══ HERO — padding:[80,20] ═══ */}
      <section style={{ padding: "80px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h1
            className="font-bold"
            style={{
              fontFamily: D,
              fontSize: 52,
              letterSpacing: -1.5,
              lineHeight: 0.92,
              color: "#000",
            }}
          >
            О RePanel
          </h1>
          <p
            className="mt-6"
            style={{
              fontFamily: I,
              fontSize: 18,
              lineHeight: 1.5,
              color: "#000",
              maxWidth: 680,
            }}
          >
            Это материал, родившийся в городе. Из переработанного пластика делаем
            то, что работает в реальных интерьерах.
          </p>
        </div>
      </section>

      {/* ═══ PHOTO — full-width ═══ */}
      <section>
        <div className="mx-auto" style={{ maxWidth: 1440, padding: "0 20px" }}>
          <div className="relative w-full overflow-hidden" style={{ height: 400 }}>
            <Image
              src="/images/Screenshot 2026-03-20 at 22.39.54.png"
              alt="RePanel производство"
              fill
              sizes="(max-width: 1440px) calc(100vw - 40px), 1400px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ═══ КТО МЫ — padding:[80,20] ═══ */}
      <section style={{ padding: "80px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold"
            style={{
              fontFamily: D,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 0.92,
              color: "#000",
            }}
          >
            Кто мы
          </h2>
          <p
            className="mt-6"
            style={{
              fontFamily: I,
              fontSize: 18,
              lineHeight: 1.5,
              color: "#000",
              maxWidth: 680,
            }}
          >
            RePanel — это производство материала и объектов из переработанного
            пластика. Мы работаем для архитекторов, интерьерных студий, ритейла,
            ресторанов, девелоперов и производителей мебели. Наша задача —
            превращать вторичный пластик в рабочий материал для серьёзных
            проектов: интерьерных, коммерческих, бренд-объектов и серийных
            решений.
          </p>
        </div>
      </section>

      {/* ═══ STATS ROW — 4 numbers, border-top ═══ */}
      <section style={{ padding: "0 20px" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 1440,
            borderTop: "1px solid #000",
            paddingTop: 32,
            paddingBottom: 32,
          }}
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: 32 }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <span
                  className="block font-bold"
                  style={{
                    fontFamily: D,
                    fontSize: 42,
                    letterSpacing: -1,
                    lineHeight: 1,
                    color: "#000",
                  }}
                >
                  {s.value}
                </span>
                <span
                  className="block mt-2"
                  style={{
                    fontFamily: I,
                    fontSize: 16,
                    lineHeight: 1.4,
                    color: "#000",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ КАК МЫ РАБОТАЕМ — padding:[60,20] ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold mb-8"
            style={{
              fontFamily: D,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 0.92,
              color: "#000",
            }}
          >
            Как мы работаем
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 32 }}>
            {formats.map((item) => (
              <div
                key={item.title}
                style={{ borderTop: "1px solid #000", paddingTop: 20 }}
              >
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontFamily: D,
                    fontSize: 24,
                    letterSpacing: -0.5,
                    color: "#000",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "#000",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ НАША ИСТОРИЯ — padding:[60,20] ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold mb-6"
            style={{
              fontFamily: D,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 0.92,
              color: "#000",
            }}
          >
            Наша история
          </h2>
          <p
            style={{
              fontFamily: I,
              fontSize: 18,
              lineHeight: 1.5,
              color: "#000",
              maxWidth: 680,
            }}
          >
            RePanel начался в 2021 году как эксперимент: можно ли сделать из
            городского пластика материал, который будет работать в реальных
            интерьерах? Мы нашли технологию, отладили процесс и начали
            производить первые листы. Сегодня мы работаем с десятками
            архитектурных бюро и брендов по всей России — от штучных объектов до
            серийного производства.
          </p>
        </div>
      </section>

      {/* ═══ С КЕМ МЫ РАБОТАЕМ — padding:[60,20] ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold mb-8"
            style={{
              fontFamily: D,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 0.92,
              color: "#000",
            }}
          >
            С кем мы работаем
          </h2>
          <div className="flex flex-wrap" style={{ gap: 12 }}>
            {audiences.map((a) => (
              <span
                key={a}
                className="rounded-pill"
                style={{
                  fontFamily: D,
                  fontSize: 14,
                  fontWeight: 700,
                  border: "1px solid #000",
                  padding: "10px 20px",
                  color: "#000",
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ЧТО ДЛЯ НАС ВАЖНО — border-top ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div
          className="mx-auto"
          style={{ maxWidth: 1440, borderTop: "1px solid #000", paddingTop: 40 }}
        >
          <h2
            className="font-bold mb-8"
            style={{
              fontFamily: D,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 0.92,
              color: "#000",
            }}
          >
            Что для нас важно
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 32 }}>
            {values.map((v) => (
              <div
                key={v.title}
                style={{ borderTop: "1px solid #000", paddingTop: 20 }}
              >
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontFamily: D,
                    fontSize: 24,
                    letterSpacing: -0.5,
                    color: "#000",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "#000",
                  }}
                >
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA — padding:[80,20] ═══ */}
      <section style={{ padding: "80px 20px" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 1440,
            borderTop: "1px solid #000",
            paddingTop: 40,
            textAlign: "center",
          }}
        >
          <h2
            className="font-bold mb-4"
            style={{
              fontFamily: D,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 0.92,
              color: "#000",
            }}
          >
            Хотите узнать больше?
          </h2>
          <p
            className="mx-auto mb-8"
            style={{
              fontFamily: I,
              fontSize: 18,
              lineHeight: 1.5,
              color: "#000",
              maxWidth: 520,
            }}
          >
            Расскажите о своём проекте — найдём подходящий формат работы.
          </p>
          <Link
            href="/contacts"
            className="inline-block rounded-pill font-bold"
            style={{
              fontFamily: D,
              fontSize: 15,
              padding: "14px 32px",
              background: "#000",
              color: "#fff",
              border: "2px solid #000",
            }}
          >
            Связаться
          </Link>
        </div>
      </section>
    </>
  );
}
