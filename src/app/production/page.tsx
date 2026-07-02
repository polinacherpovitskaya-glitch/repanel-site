import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Group, Statement, DefRows } from "@/components/blocks";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Производство — RePanel",
  description:
    "Полный цикл из переработанного полистирола: от проверенного вторсырья до готового изделия. Локальное производство в Дмитрове.",
};

const stats = [
  { value: "500 м²", label: "площадь цеха" },
  { value: "до 200 м²", label: "листов в месяц" },
  { value: "12–40 мм", label: "диапазон толщин" },
  { value: "7 дней", label: "минимальный срок" },
];

const steps = [
  { t: "Сбор сырья", d: "Принимаем отсортированный переработанный полистирол от проверенных партнёров-переработчиков." },
  { t: "Очистка и подготовка", d: "Очистка, дробление и подготовка гранулята к прессованию." },
  { t: "Прессование", d: "Формируем листы под давлением и температурой — без пустот и связующих смол." },
  { t: "Обработка", d: "Калибровка по толщине, шлифовка, фрезеровка, контроль качества." },
  { t: "Производство изделий", d: "Сборка готовых изделий из обработанных панелей — под ключ." },
  { t: "Отгрузка", d: "Упаковка и доставка по всей России из Дмитрова." },
];

const sustainability = [
  { t: "Локальное производство", d: "Короткое плечо логистики и минимальный транспортный след — всё в одном месте под Москвой." },
  { t: "100 % переработанный полистирол", d: "Ни грамма первичного сырья — только вторичный пластик, уже прошедший сортировку и очистку." },
  { t: "Долговечность", d: "Материал служит десятилетиями: не гниёт, не разбухает, восстанавливается шлифовкой." },
  { t: "Замкнутый цикл", d: "Обрезки и изделия в конце службы принимаем обратно по программе buy-back и снова пускаем в производство." },
];

const productPhotos = ["/images/DSC02231.jpg", "/images/DSC02226.jpg", "/images/DSC02247.jpg"];

export default function ProductionPage() {
  return (
    <>
      <PageHero
        title="Производство"
        image="/images/production-hero.jpg"
        imageAlt="Производство RePanel"
        lead="Полный цикл — от проверенного вторсырья до готового изделия. Производим в России, под Москвой, в Дмитрове."
      />

      <Statement>
        Мы не делаем гринвошинг. Наш материал — честный ответ на&nbsp;вопрос, что&nbsp;делать
        с&nbsp;пластиком, который уже существует.
      </Statement>

      {/* Цифры */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
        <div className="mx-auto border-t border-[#171513] pt-8" style={{ maxWidth: 1440 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <span className="block font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(34px, 3.6vw, 50px)", letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</span>
                <span className="block mt-2 text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: 1.4, opacity: 0.7 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Group title="Этапы производства">
        <DefRows rows={steps} />
      </Group>

      <Group title="Что выходит с производства">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productPhotos.map((src) => (
            <div key={src} className="relative overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
              <Image src={src} alt="Продукция RePanel" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </Group>

      <Group title="Про устойчивость">
        <DefRows rows={sustainability} />
      </Group>

      <FinalCTA heading="Хотите увидеть производство?" text="Приезжайте по предварительной договорённости — покажем процесс, материалы и готовые решения." />
    </>
  );
}
