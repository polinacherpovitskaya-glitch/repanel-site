import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";
const I = "'Gramatika', var(--font-sans), sans-serif";

export const metadata: Metadata = {
  title: "Производство RePanel — полный цикл из переработанного пластика",
  description:
    "Полный цикл — от сырья до готового объекта. Локальное производство в Москве и МО.",
};

const heroStats = [
  { value: "500 м\u00B2", label: "площадь цеха" },
  { value: "2 / мес", label: "прессования" },
  { value: "до 200 м\u00B2", label: "листов в месяц" },
  { value: "7 дней", label: "минимальный срок" },
];

const steps = [
  { num: "01", title: "Сбор сырья", text: "Принимаем отсортированный пластик от партнёров" },
  { num: "02", title: "Очистка", text: "Очистка, дробление, подготовка гранулята" },
  { num: "03", title: "Прессование", text: "Формирование листов под давлением и температурой" },
  { num: "04", title: "Обработка", text: "Фрезеровка, шлифовка, проверка качества" },
  { num: "05", title: "Производство", text: "Сборка готовых изделий из обработанных панелей" },
  { num: "06", title: "Отгрузка", text: "Упаковка и доставка по всей России" },
];

const co2Stats = [
  { value: "~5", unit: "кг CO\u2082/м\u00B2", label: "углеродный след" },
  { value: "61", unit: "%", label: "меньше, чем ДСП" },
  { value: "74", unit: "%", label: "вторичного сырья" },
  { value: "20", unit: "лет", label: "службы" },
];

const sustainabilityPoints = [
  "Локальное производство — минимальный углеродный след",
  "100% переработанный пластик — ни грамма первичного сырья",
  "Долговечность — материал служит десятилетиями",
  "Замкнутый цикл — изделия можно переработать повторно",
  "Безотходное производство — обрезки возвращаются в цикл",
];

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: D,
  fontSize: "clamp(34px, 9vw, 52px)",
  fontWeight: 700,
  letterSpacing: -1.5,
  lineHeight: 0.92,
  color: "#000",
};

export default function ProductionPage() {
  return (
    <>
      {/* ═══ HERO — padding:[80,20] ═══ */}
      <section style={{ padding: "80px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h1
            className="font-bold"
            style={{
              ...sectionTitleStyle,
              fontSize: "clamp(38px, 11vw, 52px)",
            }}
          >
            Производство RePanel
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
            Полный цикл — от сырья до готового объекта. Москва и МО.
          </p>
        </div>
      </section>

      {/* ═══ HERO PHOTO ═══ */}
      <section>
        <div className="mx-auto" style={{ maxWidth: 1440, padding: "0 20px" }}>
          <div className="relative w-full overflow-hidden" style={{ height: 460 }}>
            <Image
              src="/images/DSC02276.jpg"
              alt="Производство RePanel"
              fill
              sizes="(max-width: 1440px) calc(100vw - 40px), 1400px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ═══ КАК МЫ РАБОТАЕМ — stats row ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 1440,
            borderTop: "1px solid #000",
            paddingTop: 32,
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 32 }}>
            {heroStats.map((s) => (
              <div key={s.label}>
                <span
                  className="block font-bold"
                  style={{
                    fontFamily: D,
                    fontSize: "clamp(30px, 9vw, 42px)",
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

      {/* ═══ ЭТАПЫ ПРОИЗВОДСТВА — padding:[60,20], 2x3 grid ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold mb-8"
            style={sectionTitleStyle}
          >
            Этапы производства
          </h2>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 32 }}
          >
            {steps.map((s) => (
              <div
                key={s.num}
                style={{ borderTop: "1px solid #000", paddingTop: 20 }}
              >
                <span
                  className="block font-bold"
                  style={{
                    fontFamily: D,
                    fontSize: 36,
                    color: "#000",
                    letterSpacing: -1,
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </span>
                <h3
                  className="font-bold mt-3 mb-2"
                  style={{
                    fontFamily: D,
                    fontSize: 20,
                    letterSpacing: -0.5,
                    color: "#000",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: "#000",
                  }}
                >
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ЧТО ВЫХОДИТ С ПРОИЗВОДСТВА — photos ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold mb-8"
            style={sectionTitleStyle}
          >
            Что выходит с производства
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
            <div className="relative overflow-hidden" style={{ height: 400 }}>
              <Image
                src="/images/DSC02231.jpg"
                alt="Продукция RePanel"
                fill
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 56px) / 2), calc((100vw - 72px) / 3)"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden" style={{ height: 400 }}>
              <Image
                src="/images/DSC02226.jpg"
                alt="Продукция RePanel"
                fill
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 56px) / 2), calc((100vw - 72px) / 3)"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden" style={{ height: 400 }}>
              <Image
                src="/images/DSC02247.jpg"
                alt="Продукция RePanel"
                fill
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 56px) / 2), calc((100vw - 72px) / 3)"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ СРАВНЕНИЕ CO2 — stats ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 1440,
            borderTop: "1px solid #000",
            paddingTop: 32,
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 32 }}>
            {co2Stats.map((s) => (
              <div key={s.label}>
                <span
                  className="block font-bold"
                  style={{
                    fontFamily: D,
                    fontSize: "clamp(34px, 9vw, 52px)",
                    letterSpacing: -1.5,
                    lineHeight: 1,
                    color: "#000",
                  }}
                >
                  {s.value}
                </span>
                <span
                  className="block mt-1"
                  style={{
                    fontFamily: D,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#000",
                  }}
                >
                  {s.unit}
                </span>
                <span
                  className="block mt-1"
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

      {/* ═══ ПРО УСТОЙЧИВОСТЬ ═══ */}
      <section style={{ padding: "60px 20px" }}>
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold mb-8"
            style={sectionTitleStyle}
          >
            Про устойчивость
          </h2>
          <p
            className="mb-6"
            style={{
              fontFamily: I,
              fontSize: 18,
              lineHeight: 1.5,
              color: "#000",
              maxWidth: 680,
            }}
          >
            Мы не делаем гринвошинг. Наш материал — это честный ответ на вопрос,
            что делать с пластиком, который уже существует.
          </p>
          <ul
            style={{
              fontFamily: I,
              fontSize: 16,
              lineHeight: 2,
              color: "#000",
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxWidth: 680,
            }}
          >
            {sustainabilityPoints.map((point) => (
              <li
                key={point}
                style={{ borderTop: "1px solid #000", paddingTop: 12, paddingBottom: 12 }}
              >
                {point}
              </li>
            ))}
          </ul>
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
            style={sectionTitleStyle}
          >
            Хотите увидеть производство?
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
            Приезжайте по предварительной договорённости. Покажем процесс,
            материалы и готовые решения.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 12 }}>
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
              Обсудить проект
            </Link>
            <Link
              href="/contacts"
              className="inline-block rounded-pill font-bold"
              style={{
                fontFamily: D,
                fontSize: 15,
                padding: "14px 32px",
                background: "transparent",
                color: "#000",
                border: "2px solid #000",
              }}
            >
              Посетить производство
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
