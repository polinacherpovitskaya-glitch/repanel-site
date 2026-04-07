import Image from "next/image";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";
const I = "'Gramatika', var(--font-sans), sans-serif";

export const metadata: Metadata = {
  title: "Материал RePanel — листовой материал из переработанного пластика",
  description:
    "Листовой материал из 100% переработанного пластика. Форматы 1000x1000 и 1100x2100 мм, толщина 12-30 мм, 12 цветов. Обрабатывается стандартным инструментом.",
};

/* ── Data ── */

const colors = [
  { name: "Терракота", hex: "#C4593A" },
  { name: "Океан", hex: "#2E6B9C" },
  { name: "Графит", hex: "#4A4A4A" },
  { name: "Песок", hex: "#D4B97E" },
  { name: "Олива", hex: "#6B7D3E" },
  { name: "Кость", hex: "#E8DCC8" },
  { name: "Индиго", hex: "#3B4876" },
  { name: "Коралл", hex: "#E07050" },
  { name: "Мох", hex: "#5B7355" },
  { name: "Пепел", hex: "#9A9A9A" },
  { name: "Карамель", hex: "#B8845C" },
  { name: "Антрацит", hex: "#333333" },
];

const specs = [
  { label: "Плотность", value: "0.94-0.96 г/см\u00B3" },
  { label: "Твёрдость по Шору", value: "D60-D65" },
  { label: "Водопоглощение", value: "<0.01%" },
  { label: "UV-стойкость", value: "Стабилен без покрытия" },
  { label: "Рабочая температура", value: "от -40 до +80 \u00B0C" },
  { label: "Горючесть", value: "Г2 (умеренно горючий)" },
  { label: "Модуль упругости", value: "800-1200 МПа" },
  { label: "Предел прочности", value: "20-30 МПа" },
  { label: "Состав", value: "100% HDPE (переработанный)" },
  { label: "Запах", value: "Без запаха" },
];

const processing = [
  { method: "Пиление", desc: "Циркулярная или ленточная пила. Рез чистый, без сколов." },
  { method: "Фрезерование", desc: "ЧПУ-фрезер или ручной фрезер. Позволяет создавать сложные формы и пазы." },
  { method: "Сверление", desc: "Стандартные свёрла по дереву или металлу. Не трескается." },
  { method: "Шлифовка", desc: "Ленточная или орбитальная шлифмашина. Можно менять фактуру поверхности." },
  { method: "Термогибка", desc: "Нагрев до 160-180\u00B0C. Позволяет создавать изогнутые формы и скругления." },
  { method: "Склейка", desc: "Специализированные клеи для полиэтилена. Возможна сварка горячим воздухом." },
];

const applications = [
  { title: "Интерьеры ресторанов и кафе", desc: "Барные стойки, стеновые панели, столешницы. Материал не боится воды, легко моется." },
  { title: "Ритейл и шоурумы", desc: "Торговое оборудование, стойки, полки. Уникальная текстура привлекает внимание." },
  { title: "Офисные пространства", desc: "Ресепшены, перегородки, мебельные фасады. Устойчивость к износу в зонах высокого трафика." },
  { title: "Жилые интерьеры", desc: "Кухонные фасады, подоконники, декоративные панели. Экологичный выбор для дома." },
  { title: "Общественные пространства", desc: "Навигационные стенды, скамейки, вывески. Устойчив к вандализму и непогоде." },
  { title: "Бренд-объекты", desc: "POS-материалы, инсталляции, выставочные стенды. Кастомный цвет под фирменный стиль." },
];

const carbonData = [
  { material: "RePanel", co2: "1.8 кг CO\u2082/кг", note: "Вторичная переработка" },
  { material: "Первичный HDPE", co2: "3.4 кг CO\u2082/кг", note: "Из нефтехимии" },
  { material: "ЛДСП", co2: "2.5 кг CO\u2082/кг", note: "Древесина + смолы" },
  { material: "HPL", co2: "4.2 кг CO\u2082/кг", note: "Сложное производство" },
  { material: "Натуральный камень", co2: "0.7 кг CO\u2082/кг", note: "Добыча + транспорт" },
];

const comparison = [
  { param: "Влагостойкость", repanel: "Не впитывает воду", ldsp: "Разбухает", hpl: "Устойчив", stone: "Впитывает (пористый)", plywood: "Разбухает" },
  { param: "UV-стойкость", repanel: "Стабилен", ldsp: "Выгорает", hpl: "Стабилен", stone: "Стабилен", plywood: "Темнеет" },
  { param: "Обработка", repanel: "Столярный инструмент", ldsp: "Столярный инструмент", hpl: "Специнструмент", stone: "Камнерезный", plywood: "Столярный инструмент" },
  { param: "Ремонтопригодность", repanel: "Шлифуется", ldsp: "Нет", hpl: "Нет", stone: "Полируется", plywood: "Шлифуется" },
  { param: "Экологичность", repanel: "100% переработка", ldsp: "Формальдегиды", hpl: "Сложная утилизация", stone: "Добыча", plywood: "Клеи" },
  { param: "Уникальность рисунка", repanel: "Каждый лист уникален", ldsp: "Повтор декора", hpl: "Повтор декора", stone: "Уникален", plywood: "Похожий рисунок" },
  { param: "Вес (при 18мм)", repanel: "Средний", ldsp: "Средний", hpl: "Лёгкий", stone: "Тяжёлый", plywood: "Лёгкий" },
];

const materialFaq = [
  {
    question: "Устойчив ли материал к воде?",
    answer:
      "Да. Материал не впитывает воду, не разбухает и не гниёт. Подходит для ванных комнат, кухонь, уличных объектов и зон с повышенной влажностью.",
  },
  {
    question: "Как материал ведёт себя на солнце?",
    answer:
      "Материал UV-стабилен и не выгорает при прямом солнечном воздействии. Подходит для наружного применения без дополнительной обработки.",
  },
  {
    question: "Какую нагрузку выдерживает?",
    answer:
      "Зависит от толщины и конструкции. Листы 18-20 мм подходят для горизонтальных поверхностей, 25-30 мм — для столешниц и стоек с высокой нагрузкой.",
  },
  {
    question: "Можно ли гнуть материал?",
    answer:
      "Материал можно гнуть термическим способом при нагреве до 160-180 градусов. Это позволяет создавать изогнутые формы, скругления и объёмные конструкции.",
  },
  {
    question: "Чем обрабатывать?",
    answer:
      "Стандартным столярным инструментом: циркулярная пила, фрезер, сверло, шлифмашина. Не требует специального оборудования.",
  },
  {
    question: "Как заказать образцы?",
    answer:
      "Заполните форму на странице контактов или напишите в Telegram. Для архитекторов в Москве и МО доставка образцов бесплатна.",
  },
];

/* ── Styles ── */

const h2Style: React.CSSProperties = {
  fontFamily: D,
  fontSize: 52,
  fontWeight: 700,
  letterSpacing: -1.5,
  lineHeight: 0.92,
};

const sectionPadding: React.CSSProperties = {
  padding: "80px 20px",
};

const hr: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #000",
  margin: 0,
};

export default function MaterialPage() {
  return (
    <>
      {/* ══════ HERO ══════ */}
      <section
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          position: "relative",
          height: 700,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: D,
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 0.85,
            position: "absolute",
            left: 40,
            top: 40,
            margin: 0,
          }}
        >
          Материал
        </h1>

        {/* Vertical divider line */}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 20,
            width: 1,
            height: 660,
            background: "#000",
          }}
        />

        {/* Description at bottom-left */}
        <p
          style={{
            fontFamily: I,
            fontSize: 16,
            lineHeight: 1.6,
            position: "absolute",
            left: 22,
            top: 531,
            width: 570,
            margin: 0,
          }}
        >
          Листовой материал из переработанного пластика с уникальной текстурой.
          Для интерьеров, мебели и бренд-объектов. Не просто переработанный
          пластик. Рабочий материал для сильных интерьеров — с характером,
          которого нет у ЛДСП, типового пластика или имитации камня.
        </p>

        {/* Photo on the right */}
        <div
          style={{
            position: "absolute",
            left: 660,
            top: 15.5,
            width: 763,
            height: 629,
          }}
        >
          <Image
            src="/images/RO1258.jpg"
            alt="Материал RePanel"
            fill
            sizes="763px"
            className="object-cover"
            priority
          />
        </div>

        {/* Horizontal line at bottom */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 661,
            width: 1401,
            height: 1,
            background: "#000",
          }}
        />
      </section>

      {/* ══════ ЦВЕТА И КАСТОМИЗАЦИЯ ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", ...sectionPadding }}>
        <h2 style={h2Style}>Цвета и кастомизация</h2>

        <p
          style={{
            fontFamily: I,
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 700,
            marginTop: 24,
            marginBottom: 40,
          }}
        >
          Каждая панель уникальна. Рисунок создаётся смешением гранул
          переработанного пластика — и не повторяется дважды.
        </p>

        <hr style={hr} />

        <div
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          style={{ gap: 24, marginTop: 40 }}
        >
          {colors.map((c) => (
            <div key={c.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  backgroundColor: c.hex,
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: D,
                    fontSize: 14,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {c.name}
                </p>
                <p
                  style={{
                    fontFamily: I,
                    fontSize: 12,
                    color: "#888",
                    margin: 0,
                    marginTop: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {c.hex}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ ФОРМАТЫ И ТОЛЩИНЫ ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", ...sectionPadding }}>
        <h2 style={h2Style}>Форматы и толщины</h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 40, marginTop: 40 }}
        >
          {/* Compact */}
          <div
            style={{
              border: "1px solid #000",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p
              style={{
                fontFamily: D,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              Компактный
            </p>
            <p
              style={{
                fontFamily: D,
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: -1,
                margin: 0,
              }}
            >
              1000 x 1000 мм
            </p>
            <hr style={hr} />
            <p style={{ fontFamily: I, fontSize: 16, margin: 0 }}>
              Толщина: 12, 15, 18, 20, 25, 30 мм
            </p>
            <p style={{ fontFamily: I, fontSize: 14, color: "#666", margin: 0 }}>
              Удобен для мебельных фасадов, полок, декоративных элементов
              и небольших поверхностей.
            </p>
          </div>

          {/* Large */}
          <div
            style={{
              border: "1px solid #000",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p
              style={{
                fontFamily: D,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              Масштабный
            </p>
            <p
              style={{
                fontFamily: D,
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: -1,
                margin: 0,
              }}
            >
              1100 x 2100 мм
            </p>
            <hr style={hr} />
            <p style={{ fontFamily: I, fontSize: 16, margin: 0 }}>
              Толщина: 12, 15, 18, 20, 25, 30 мм
            </p>
            <p style={{ fontFamily: I, fontSize: 14, color: "#666", margin: 0 }}>
              Для стеновых панелей, столешниц, барных стоек
              и крупноформатных поверхностей.
            </p>
          </div>
        </div>
      </section>

      {/* ══════ ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", ...sectionPadding }}>
        <hr style={hr} />

        <h2 style={{ ...h2Style, marginTop: 40 }}>
          Технические характеристики
        </h2>

        <p
          style={{
            fontFamily: I,
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 600,
            marginTop: 16,
            marginBottom: 40,
          }}
        >
          Ключевые параметры материала, подтверждённые лабораторными испытаниями.
        </p>

        <div>
          {specs.map((s) => (
            <div
              key={s.label}
              style={{
                borderTop: "1px solid #000",
                padding: "16px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: I,
                  fontSize: 16,
                  color: "#666",
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontFamily: D,
                  fontSize: 16,
                  fontWeight: 700,
                  textAlign: "right",
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #000" }} />
        </div>
      </section>

      {/* ══════ ОБРАБОТКА МАТЕРИАЛА ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 20px" }}>
        <hr style={hr} />

        <h2 style={{ ...h2Style, marginTop: 40 }}>
          Обработка материала
        </h2>

        <p
          style={{
            fontFamily: I,
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 700,
            marginTop: 16,
            marginBottom: 40,
          }}
        >
          Материал обрабатывается стандартным деревообрабатывающим оборудованием.
          Ключевые способы обработки:
        </p>

        <div>
          {processing.map((p) => (
            <div
              key={p.method}
              style={{
                borderTop: "1px solid #000",
                padding: "20px 0",
                display: "flex",
                gap: 40,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: D,
                  fontSize: 18,
                  fontWeight: 700,
                  minWidth: 180,
                  flexShrink: 0,
                }}
              >
                {p.method}
              </span>
              <span
                style={{
                  fontFamily: I,
                  fontSize: 16,
                  lineHeight: 1.5,
                  color: "#444",
                }}
              >
                {p.desc}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #000" }} />
        </div>
      </section>

      {/* ══════ ГДЕ МАТЕРИАЛ РАБОТАЕТ ЛУЧШЕ ВСЕГО ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", ...sectionPadding }}>
        <hr style={hr} />

        <h2 style={{ ...h2Style, marginTop: 40 }}>
          Где материал работает лучше всего
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 0, marginTop: 40 }}
        >
          {applications.map((a, i) => (
            <div
              key={a.title}
              style={{
                borderTop: "1px solid #000",
                padding: "24px 20px 24px 0",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: D,
                    fontSize: 12,
                    color: "#999",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: D,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {a.title}
                </span>
              </div>
              <p
                style={{
                  fontFamily: I,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#555",
                  margin: 0,
                  paddingLeft: 32,
                }}
              >
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ УГЛЕРОДНЫЙ СЛЕД ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", ...sectionPadding }}>
        <hr style={hr} />

        <h2 style={{ ...h2Style, marginTop: 40 }}>Углеродный след</h2>

        <p
          style={{
            fontFamily: I,
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 700,
            marginTop: 16,
            marginBottom: 40,
          }}
        >
          Производство RePanel из вторичного сырья снижает углеродный след
          по сравнению с первичными материалами.
        </p>

        <div>
          {carbonData.map((c) => (
            <div
              key={c.material}
              style={{
                borderTop: "1px solid #000",
                padding: "16px 0",
                display: "grid",
                gridTemplateColumns: "200px 1fr 1fr",
                gap: 20,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: D,
                  fontSize: 16,
                  fontWeight: c.material === "RePanel" ? 700 : 400,
                }}
              >
                {c.material}
              </span>
              <span
                style={{
                  fontFamily: D,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {c.co2}
              </span>
              <span
                style={{
                  fontFamily: I,
                  fontSize: 14,
                  color: "#666",
                }}
              >
                {c.note}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #000" }} />
        </div>
      </section>

      {/* ══════ СРАВНЕНИЕ С АНАЛОГАМИ ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", ...sectionPadding }}>
        <hr style={hr} />

        <h2 style={{ ...h2Style, marginTop: 40 }}>Сравнение с аналогами</h2>

        <div style={{ marginTop: 40, overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: I,
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #000" }}>
                <th
                  style={{
                    fontFamily: D,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "left",
                    padding: "12px 12px 12px 0",
                  }}
                >
                  Параметр
                </th>
                <th
                  style={{
                    fontFamily: D,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "left",
                    padding: 12,
                    background: "#f5f5f5",
                  }}
                >
                  RePanel
                </th>
                <th
                  style={{
                    fontFamily: D,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "left",
                    padding: 12,
                  }}
                >
                  ЛДСП
                </th>
                <th
                  style={{
                    fontFamily: D,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "left",
                    padding: 12,
                  }}
                >
                  HPL
                </th>
                <th
                  style={{
                    fontFamily: D,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "left",
                    padding: 12,
                  }}
                >
                  Камень
                </th>
                <th
                  style={{
                    fontFamily: D,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "left",
                    padding: 12,
                  }}
                >
                  Фанера
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr
                  key={row.param}
                  style={{ borderBottom: "1px solid #000" }}
                >
                  <td
                    style={{
                      fontFamily: I,
                      fontSize: 14,
                      color: "#666",
                      padding: "14px 12px 14px 0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.param}
                  </td>
                  <td
                    style={{
                      fontFamily: D,
                      fontSize: 14,
                      fontWeight: 700,
                      padding: 14,
                      background: "#f5f5f5",
                    }}
                  >
                    {row.repanel}
                  </td>
                  <td style={{ padding: 14 }}>{row.ldsp}</td>
                  <td style={{ padding: 14 }}>{row.hpl}</td>
                  <td style={{ padding: 14 }}>{row.stone}</td>
                  <td style={{ padding: 14 }}>{row.plywood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════ ВОПРОСЫ ПО МАТЕРИАЛУ ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", ...sectionPadding }}>
        <FAQ items={materialFaq} title="Вопросы по материалу" />
      </section>

      {/* ══════ CTA ══════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 20px" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 60 }}
        >
          <div>
            <h2 style={h2Style}>Хотите попробовать материал?</h2>
            <p
              style={{
                fontFamily: I,
                fontSize: 18,
                lineHeight: 1.6,
                marginTop: 20,
                maxWidth: 500,
              }}
            >
              Закажите образцы, задайте вопрос или обсудите проект.
              Для архитекторов в Москве и МО доставка образцов бесплатна.
            </p>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
