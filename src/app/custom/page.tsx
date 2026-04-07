import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";

export const metadata: Metadata = {
  title: "Объекты на заказ — RePanel",
  description:
    "Производим изделия из переработанного пластика по вашим чертежам и спецификациям. Минимальный заказ — от 5 штук.",
};

const steps = [
  {
    num: "01",
    title: "Бриф",
    text: "Вы описываете задачу, размеры, тираж и сроки.",
  },
  {
    num: "02",
    title: "Подбор",
    text: "Мы предлагаем формат материала и конструктивное решение.",
  },
  {
    num: "03",
    title: "Образец",
    text: "Делаем тестовый образец для согласования.",
  },
  {
    num: "04",
    title: "Производство",
    text: "Запускаем серийное производство.",
  },
];

const customizations = [
  {
    title: "Цвет",
    text: "Базовая палитра из 12 цветов или кастомный цвет под проект.",
  },
  {
    title: "Размер",
    text: "Адаптируем габариты и конфигурацию под вашу задачу.",
  },
  {
    title: "Брендирование",
    text: "Логотип, гравировка, фирменный цвет — для мерча и подарков.",
  },
  {
    title: "Тираж",
    text: "От 5 до 40 000+ штук. Повторяемость качества гарантирована.",
  },
  {
    title: "Конструкция",
    text: "Изменим крепёж, фурнитуру, способ сборки — под условия эксплуатации.",
  },
  {
    title: "Упаковка",
    text: "Индивидуальная или подарочная упаковка для партий.",
  },
];

const cases = [
  {
    title: "САМОЛЕТ",
    text: "40 000 органайзеров с логотипом в корпоративном цвете.",
    metric: "40 000 шт",
  },
  {
    title: "Сеть кофеен",
    text: "Серия из 50 барных стоек и 200 полок для 12 локаций.",
    metric: "12 локаций",
  },
  {
    title: "Корпоративный мерч",
    text: "Набор настольных объектов для Welcome Pack из 500 штук.",
    metric: "500 шт",
  },
];

export default function CustomPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: "60px 20px 80px" }}>
        <div className="wrap">
          <div className="max-w-3xl pt-10">
            <h1
              className="font-bold mb-6"
              style={{
                fontFamily: D,
                fontSize: "clamp(34px, 4.5vw, 56px)",
                letterSpacing: "-2px",
                lineHeight: 0.95,
              }}
            >
              Объекты на заказ
            </h1>
            <p
              className="text-[17px] md:text-[20px] leading-[1.55] max-w-[640px] mb-8"
              style={{ opacity: 0.55 }}
            >
              Производим изделия из переработанного пластика по вашим чертежам и
              спецификациям. Минимальный заказ — от 5 штук.
            </p>
            <Link
              href="/contacts"
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{
                background: "#171513",
                color: "#fff",
                fontFamily: D,
              }}
            >
              Обсудить проект
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="section"
        style={{ borderTop: "1px solid #171513" }}
      >
        <div className="wrap">
          <SectionHeading title="Как это работает" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="pt-5"
                style={{ borderTop: "1px solid rgba(23,21,19,0.15)" }}
              >
                <span
                  className="text-[28px] font-bold"
                  style={{ fontFamily: D, opacity: 0.15 }}
                >
                  {s.num}
                </span>
                <h3
                  className="text-[17px] font-bold mt-2 mb-2"
                  style={{ fontFamily: D }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.6]"
                  style={{ opacity: 0.55 }}
                >
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What can be customized */}
      <section className="section" style={{ background: "#F5F5F5" }}>
        <div className="wrap">
          <SectionHeading title="Что можно кастомизировать" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {customizations.map((c) => (
              <div
                key={c.title}
                className="p-5 md:p-6"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(23,21,19,0.1)",
                }}
              >
                <h3
                  className="text-[16px] font-bold mb-2"
                  style={{ fontFamily: D }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.6]"
                  style={{ opacity: 0.55 }}
                >
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="section">
        <div className="wrap">
          <SectionHeading title="Примеры заказов" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((c) => (
              <div
                key={c.title}
                className="p-6"
                style={{
                  border: "1px solid rgba(23,21,19,0.15)",
                  background: "#F5F5F5",
                }}
              >
                <span
                  className="text-[24px] font-bold"
                  style={{ fontFamily: D, opacity: 0.2 }}
                >
                  {c.metric}
                </span>
                <h3
                  className="text-[17px] font-bold mt-3 mb-2"
                  style={{ fontFamily: D }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.6]"
                  style={{ opacity: 0.55 }}
                >
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 20px", background: "#171513" }}>
        <div className="wrap text-center">
          <h2
            className="font-bold mb-4"
            style={{
              fontFamily: D,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              letterSpacing: "-1px",
              color: "#fff",
            }}
          >
            Расскажите о проекте
          </h2>
          <p
            className="text-[16px] mb-8 max-w-lg mx-auto"
            style={{ opacity: 0.5, color: "#fff" }}
          >
            Опишите задачу — подберём решение или разработаем с нуля.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contacts"
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{
                background: "#fff",
                color: "#171513",
                fontFamily: D,
              }}
            >
              Обсудить проект
            </Link>
            <Link
              href="/catalog"
              className="rounded-pill inline-block text-[15px] font-bold px-8 py-3"
              style={{
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "#fff",
                fontFamily: D,
              }}
            >
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
