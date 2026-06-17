import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Group, Statement, DefRows } from "@/components/blocks";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "О нас — RePanel",
  description:
    "RePanel — производство панелей и изделий из переработанного полистирола для коммерческих, интерьерных и бренд-проектов. Бренд, подход, команда.",
};

const stats = [
  { value: "2021", label: "Год основания" },
  { value: "80+", label: "B2B-клиентов" },
  { value: "40 000+", label: "Произведённых объектов" },
  { value: "8", label: "Человек в команде" },
];

const formats = [
  { t: "Поставка материала", d: "Листы для вашего производства или подрядчика: два формата, толщины 12–40 мм, базовая палитра и кастомизация." },
  { t: "Адаптация решений", d: "Берём готовое решение из портфолио и адаптируем под цвет, размер, конструкцию и тираж вашего проекта." },
  { t: "Полный цикл", d: "От идеи до готового изделия: проектирование, производство, контроль и доставка на объект." },
];

const audiences = ["Архитекторы", "Интерьерные студии", "Ритейл", "Рестораны", "Девелоперы", "Мебельные производства", "Подрядчики", "Франчайзи"];

const values = [
  { t: "Материал с характером", d: "Каждая панель уникальна. Мы не имитируем натуральные материалы — даём переработанному пластику собственную эстетику." },
  { t: "Прозрачность", d: "Говорим прямо: что можем, чего не можем, какие есть ограничения. Это экономит время и строит доверие." },
  { t: "Функциональность", d: "Красивый материал бесполезен, если не работает в реальном пространстве. Думаем о конструкции, нагрузке, сроке и обслуживании." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="О нас"
        image="/images/Screenshot 2026-03-20 at 22.39.54.png"
        imageAlt="Производство RePanel"
        lead="Материал, родившийся в городе. Из переработанного пластика делаем то, что работает в реальных интерьерах — от листа до изделия под ключ."
      />

      <Statement>
        RePanel — производство материала и изделий из&nbsp;переработанного полистирола. Превращаем
        вторичный пластик в&nbsp;рабочий материал для серьёзных проектов: интерьерных, коммерческих,
        бренд-объектов и&nbsp;серийных решений.
      </Statement>

      {/* Цифры */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
        <div className="mx-auto border-t border-[#171513] pt-8" style={{ maxWidth: 1440 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <span className="block font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(40px, 4vw, 56px)", letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</span>
                <span className="block mt-2 text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: 1.4, opacity: 0.7 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Group title="Как мы работаем">
        <DefRows rows={formats} />
      </Group>

      <Group title="Наша история">
        <p className="text-[#171513] max-w-[680px]" style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.5vw, 21px)", lineHeight: 1.45 }}>
          RePanel начался в 2021 году как эксперимент: можно ли сделать из городского пластика материал,
          который работает в реальных интерьерах? Мы нашли технологию, отладили процесс и выпустили первые
          листы. Сегодня работаем с десятками архитектурных бюро и брендов по всей России — от штучных
          объектов до серийного производства.
        </p>
      </Group>

      <Group title="С кем мы работаем">
        <div className="flex flex-wrap gap-3">
          {audiences.map((a) => (
            <span key={a} className="text-[#171513]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "14px", border: "1px solid #171513", padding: "10px 20px" }}>
              {a}
            </span>
          ))}
        </div>
      </Group>

      <Group title="Что для нас важно">
        <DefRows rows={values} />
      </Group>

      <FinalCTA heading="Поговорим о проекте?" text="Расскажите о задаче — найдём подходящий формат работы: материал, адаптация решения или полный цикл." />
    </>
  );
}
