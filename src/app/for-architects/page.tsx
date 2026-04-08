import Image from "next/image";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";
const I = "'Gramatika', var(--font-sans), sans-serif";

export const metadata: Metadata = {
  title: "Для архитекторов и производителей — RePanel",
  description:
    "Форматы, толщины, цвета, обработка, FAQ и форма запроса образцов. Всё для включения RePanel в проект.",
};

const architectFaq = [
  {
    question: "Чем можно обрабатывать материал?",
    answer:
      "RePanel обрабатывается стандартным деревообрабатывающим оборудованием: пилы, фрезеры, сверлильные станки. Рекомендуем использовать твёрдосплавный инструмент.",
  },
  {
    question: "Можно ли гнуть материал?",
    answer:
      "При нагреве материал можно гнуть. Минимальный радиус зависит от толщины. Рекомендуем обсудить конкретную задачу.",
  },
  {
    question: "Как материал ведёт себя при контакте с водой и UV?",
    answer:
      "Материал не впитывает воду и устойчив к ультрафиолету. Подходит для наружного и внутреннего применения — фасады, столешницы, ванные комнаты.",
  },
  {
    question: "Есть ли ограничения по весовой нагрузке?",
    answer:
      "Зависит от толщины и конструкции. Для столешниц рекомендуем толщины от 18 мм. Для нагруженных конструкций — от 25 мм.",
  },
  {
    question: "Как работает кастомизация цвета?",
    answer:
      "Мы подбираем состав сырья для создания нужного цветового решения. Рекомендуем закладывать 2–3 недели на подбор и утверждение образца.",
  },
  {
    question: "Можно ли получить образцы для проекта?",
    answer:
      "Да. Заполните форму ниже — отправим образцы выбранных цветов и толщин.",
  },
  {
    question: "Какие сроки производства?",
    answer:
      "Стандартный заказ — 10–14 рабочих дней. Кастомные цвета — от 3 недель с учётом согласования.",
  },
  {
    question: "Есть ли минимальный объём заказа?",
    answer:
      "Минимальный заказ — от 10 листов одного цвета и толщины. Для кастомных цветов — от 50 листов.",
  },
];

const quickActions = [
  { label: "Скачать каталог", href: "#documents" },
  { label: "Заказать образцы", href: "#sample-request" },
  { label: "Консультация", href: "/contacts" },
  { label: "Отправить чертёж", href: "/contacts" },
];

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
  { label: "Форматы", value: "1000 x 1000 мм / 1100 x 2100 мм" },
  { label: "Толщина", value: "12–30 мм (шаг по запросу)" },
  { label: "Плотность", value: "0.94–0.96 г/см3" },
  { label: "Водопоглощение", value: "< 0.01%" },
  { label: "UV-стойкость", value: "Да (наружное применение)" },
  { label: "Класс горючести", value: "Г2 (умеренногорючий)" },
];

const techSpecs = [
  { label: "Прочность на изгиб", value: "25–35 МПа" },
  { label: "Прочность на растяжение", value: "20–30 МПа" },
  { label: "Модуль упругости", value: "800–1200 МПа" },
  { label: "Теплопроводность", value: "0.22–0.36 Вт/(м*К)" },
  { label: "Рабочая температура", value: "-40...+80 °C" },
  { label: "Срок службы", value: "> 50 лет" },
];

const processingMethods = [
  { method: "Фрезеровка", desc: "ЧПУ и ручной фрезер. Твёрдосплавный инструмент." },
  { method: "Сверление", desc: "Стандартные свёрла по дереву и металлу." },
  { method: "Распил", desc: "Циркулярная пила, лобзик, ленточная пила." },
  { method: "Шлифовка", desc: "Абразивы P80–P320. Финишная полировка по запросу." },
  { method: "Термогибка", desc: "При нагреве до 160 °C. Минимальный радиус — от 50 мм." },
  { method: "Склейка", desc: "Полиуретановые и эпоксидные клеи. Механический крепёж." },
];

const documents = [
  { name: "Каталог продукции", format: "PDF, 12 МБ" },
  { name: "Технический паспорт", format: "PDF, 3 МБ" },
  { name: "3D-модели панелей (STEP)", format: "ZIP, 45 МБ" },
  { name: "Текстуры для визуализации", format: "ZIP, 120 МБ" },
  { name: "BIM-объекты (Revit)", format: "ZIP, 28 МБ" },
  { name: "Инструкция по монтажу", format: "PDF, 5 МБ" },
];

const certificates = [
  { name: "Сертификат соответствия ГОСТ", desc: "Подтверждение соответствия стандартам качества" },
  { name: "Пожарный сертификат (Г2)", desc: "Класс горючести — умеренногорючий" },
  { name: "Санитарно-эпидемиологическое заключение", desc: "Безопасность для использования внутри помещений" },
  { name: "Экологический сертификат", desc: "Подтверждение использования переработанного сырья" },
];

const forArchitectsHeroDescription =
  "Всё, что помогает быстро заложить RePanel в проект";

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: D,
  fontSize: "clamp(34px, 9vw, 52px)",
  fontWeight: 700,
  letterSpacing: -1.5,
  lineHeight: 0.92,
  color: "#171513",
};

export default function ForArchitectsPage() {
  return (
    <div style={{ maxWidth: 1440, margin: "0 auto" }}>
      {/* ===== HERO ===== */}
      <section
        style={{
          background: "#fff",
        }}
      >
        <div className="block px-5 pt-10 pb-8 lg:hidden">
          <h1
            style={{
              fontFamily: D,
              fontSize: "clamp(32px, 9.5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.85,
              color: "#171513",
              margin: 0,
            }}
          >
            {"Для\nархитекторов,\nдизайнеров и\nпроизводителей".split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p
            style={{
              fontFamily: I,
              fontSize: 16,
              lineHeight: 1.6,
              color: "#171513",
              margin: "24px 0 0",
            }}
          >
            {forArchitectsHeroDescription}
          </p>
          <div className="relative mt-8 overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
            <Image
              src="/images/ro0184.jpg"
              alt="RePanel для архитекторов"
              fill
              sizes="(max-width: 1023px) calc(100vw - 40px), 706px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className="mt-8 h-px bg-black" />
        </div>

        <div className="relative hidden h-[700px] overflow-hidden lg:block">
          {/* Title */}
          <h1
            style={{
              position: "absolute",
              left: 40,
              top: 40,
              width: 649,
              fontFamily: D,
              fontSize: 80,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 0.85,
              color: "#171513",
              margin: 0,
              zIndex: 2,
            }}
          >
            {"Для архитекторов,\nдизайнеров и\nпроизводителей".split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 699,
              top: 0,
              width: 1,
              height: 660,
              background: "#000",
              zIndex: 2,
            }}
          />

          {/* Description */}
          <p
            style={{
              position: "absolute",
              left: 22,
              top: 531,
              width: 570,
              fontFamily: I,
              fontSize: 16,
              lineHeight: 1.6,
              color: "#171513",
              margin: 0,
              zIndex: 2,
            }}
          >
            {forArchitectsHeroDescription}
          </p>

          {/* Photo */}
          <div
            style={{
              position: "absolute",
              right: 0,
              left: 716,
              top: 15.5,
              width: 706,
              height: 629,
              zIndex: 1,
            }}
          >
            <Image
              src="/images/ro0184.jpg"
              alt="RePanel для архитекторов"
              fill
              sizes="(max-width: 1439px) 49vw, 706px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Horizontal line at bottom */}
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 661,
              width: 1401,
              height: 1,
              background: "#000",
            }}
          />
        </div>
      </section>

      {/* ===== Quick Actions ===== */}
      <section style={{ padding: "0 20px 40px 20px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-pill cursor-pointer w-full sm:flex-1"
              style={{
                flex: "1 1 240px",
                minWidth: 0,
                border: "1px solid #000",
                padding: "16px 20px",
                background: "transparent",
                fontFamily: I,
                fontSize: 15,
                color: "#171513",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Характеристики ===== */}
      <section style={{ padding: "20px 20px 60px 20px" }}>
        <h2
          style={{ ...sectionTitleStyle, marginBottom: 40 }}
        >
          Характеристики
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specs.map((s) => (
            <div key={s.label} style={{ borderBottom: "1px solid #000", paddingBottom: 20 }}>
              <p
                style={{
                  fontFamily: I,
                  fontSize: 13,
                  color: "#171513",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: D,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#171513",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Цветовая палитра ===== */}
      <section style={{ padding: "0 20px 60px 20px" }}>
        <h2
          style={{ ...sectionTitleStyle, marginBottom: 40 }}
        >
          Цветовая палитра
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {colors.map((c) => (
            <div key={c.name}>
              <div
                className="aspect-square mb-2"
                style={{ backgroundColor: c.hex }}
              />
              <p style={{ fontFamily: I, fontSize: 13, color: "#171513", marginBottom: 2 }}>
                {c.name}
              </p>
              <p style={{ fontFamily: I, fontSize: 11, color: "#999" }}>
                {c.hex}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Технические характеристики ===== */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ borderTop: "1px solid #000", paddingTop: 40 }}>
          <h2
            style={{ ...sectionTitleStyle, marginBottom: 40 }}
          >
            Технические характеристики
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techSpecs.map((s) => (
              <div key={s.label} style={{ paddingBottom: 16, borderBottom: "1px solid #000" }}>
                <p style={{ fontFamily: I, fontSize: 13, color: "#171513", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  {s.label}
                </p>
                <p style={{ fontFamily: D, fontSize: 20, fontWeight: 600, color: "#171513" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Обработка материала ===== */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ borderTop: "1px solid #000", paddingTop: 40 }}>
          <h2
            style={{ ...sectionTitleStyle, marginBottom: 40 }}
          >
            Обработка материала
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processingMethods.map((p) => (
              <div key={p.method} style={{ paddingBottom: 16, borderBottom: "1px solid #000" }}>
                <p style={{ fontFamily: D, fontSize: 18, fontWeight: 600, color: "#171513", marginBottom: 8 }}>
                  {p.method}
                </p>
                <p style={{ fontFamily: I, fontSize: 15, lineHeight: 1.6, color: "#171513" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Углеродный след ===== */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ borderTop: "1px solid #000", paddingTop: 40 }}>
          <h2
            style={{ ...sectionTitleStyle, marginBottom: 40 }}
          >
            Углеродный след
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p style={{ fontFamily: D, fontSize: 48, fontWeight: 700, color: "#171513", marginBottom: 8 }}>
                -62%
              </p>
              <p style={{ fontFamily: I, fontSize: 15, lineHeight: 1.6, color: "#171513" }}>
                снижение CO2 по сравнению с первичным пластиком
              </p>
            </div>
            <div>
              <p style={{ fontFamily: D, fontSize: 48, fontWeight: 700, color: "#171513", marginBottom: 8 }}>
                100%
              </p>
              <p style={{ fontFamily: I, fontSize: 15, lineHeight: 1.6, color: "#171513" }}>
                переработанное сырьё в составе
              </p>
            </div>
            <div>
              <p style={{ fontFamily: D, fontSize: 48, fontWeight: 700, color: "#171513", marginBottom: 8 }}>
                0
              </p>
              <p style={{ fontFamily: I, fontSize: 15, lineHeight: 1.6, color: "#171513" }}>
                отходов при производстве — полный цикл переработки
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Документы и файлы ===== */}
      <section id="documents" style={{ padding: "80px 20px" }}>
        <div style={{ borderTop: "1px solid #000", paddingTop: 40 }}>
          <h2
            style={{ ...sectionTitleStyle, marginBottom: 16 }}
          >
            Документы и файлы
          </h2>
          <p style={{ fontFamily: I, fontSize: 16, lineHeight: 1.6, color: "#171513", marginBottom: 40 }}>
            Всё что нужно для включения RePanel в проект.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((d) => (
              <a
                key={d.name}
                href="#"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  border: "1px solid #000",
                  textDecoration: "none",
                  color: "#171513",
                }}
              >
                <span style={{ fontFamily: D, fontSize: 15, fontWeight: 600 }}>
                  {d.name}
                </span>
                <span style={{ fontFamily: I, fontSize: 13, color: "#999" }}>
                  {d.format}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Сертификаты и стандарты ===== */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ borderTop: "1px solid #000", paddingTop: 40 }}>
          <h2
            style={{ ...sectionTitleStyle, marginBottom: 40 }}
          >
            Сертификаты и стандарты
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((c) => (
              <div
                key={c.name}
                style={{
                  padding: "20px 24px",
                  border: "1px solid #000",
                }}
              >
                <p style={{ fontFamily: D, fontSize: 16, fontWeight: 600, color: "#171513", marginBottom: 6 }}>
                  {c.name}
                </p>
                <p style={{ fontFamily: I, fontSize: 14, lineHeight: 1.5, color: "#666" }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={{ padding: "0 20px 60px 20px" }}>
        <FAQ items={architectFaq} title="FAQ" />
      </section>

      {/* ===== Форма запроса образцов ===== */}
      <section id="sample-request" style={{ padding: "80px 20px" }}>
        <h2
          style={{ ...sectionTitleStyle, marginBottom: 16 }}
        >
          Форма запроса образцов
        </h2>
        <p style={{ fontFamily: I, fontSize: 16, lineHeight: 1.6, color: "#171513", marginBottom: 40 }}>
          Укажите интересующие цвета и толщины — отправим образцы для оценки.
        </p>
        <div style={{ maxWidth: 600 }}>
          <ContactForm compact />
        </div>
      </section>
    </div>
  );
}
