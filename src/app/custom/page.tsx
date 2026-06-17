import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Group, Statement, DefRows } from "@/components/blocks";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Объекты на заказ — RePanel",
  description:
    "Производим изделия из переработанного полистирола по вашим чертежам и спецификациям. Тираж — от 5 до 40 000+ штук.",
};

const steps = [
  { t: "Бриф", d: "Вы описываете задачу, размеры, тираж и сроки." },
  { t: "Подбор", d: "Предлагаем формат материала и конструктивное решение." },
  { t: "Образец", d: "Делаем тестовый образец для согласования перед запуском." },
  { t: "Производство", d: "Запускаем серийное производство и отгружаем." },
];

const customizations = [
  { t: "Цвет", d: "Базовая палитра из 12 сочетаний, микс из складских цветов или покраска по RAL / Pantone." },
  { t: "Размер", d: "Адаптируем габариты и конфигурацию под вашу задачу — в пределах форматов листа." },
  { t: "Брендирование", d: "Логотип, гравировка, фирменный цвет — для мерча и корпоративных подарков." },
  { t: "Тираж", d: "От 5 до 40 000+ штук. Повторяемость качества между партиями." },
  { t: "Конструкция", d: "Изменим крепёж, фурнитуру и способ сборки под условия эксплуатации." },
  { t: "Упаковка", d: "Индивидуальная или подарочная упаковка для партий." },
];

const cases = [
  { metric: "40 000 шт", title: "САМОЛЕТ", text: "Органайзеры с логотипом в корпоративном цвете." },
  { metric: "12 локаций", title: "Сеть кофеен", text: "Серия из 50 барных стоек и 200 полок." },
  { metric: "500 шт", title: "Корпоративный мерч", text: "Набор настольных объектов для Welcome Pack." },
];

export default function CustomPage() {
  return (
    <>
      <PageHero
        title="Объекты на заказ"
        image="/images/DSC02233.jpg"
        imageAlt="Изделие RePanel на заказ"
        lead="Производим изделия из переработанного полистирола по вашим чертежам и спецификациям. Тираж — от 5 до 40 000+ штук."
      />

      <Statement>
        От штучного объекта до&nbsp;серийного тиража — берём задачу, предлагаем материал
        и&nbsp;конструкцию, делаем образец и&nbsp;запускаем производство.
      </Statement>

      <Group title="Как это работает">
        <DefRows rows={steps} />
      </Group>

      <Group title="Что можно кастомизировать">
        <DefRows rows={customizations} />
      </Group>

      <Group title="Примеры заказов">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div key={c.title} className="border-t border-[#171513] pt-4">
              <span className="block font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 2.6vw, 40px)", letterSpacing: "-1px", lineHeight: 1 }}>{c.metric}</span>
              <h3 className="font-bold text-[#171513] mt-3" style={{ fontFamily: BODY, fontSize: "18px", letterSpacing: "-0.2px" }}>{c.title}</h3>
              <p className="text-[#171513] mt-1.5" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px", opacity: 0.7 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </Group>

      <FinalCTA heading="Расскажите о проекте" text="Опишите задачу — подберём решение из портфолио или разработаем с нуля." />
    </>
  );
}
