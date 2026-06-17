import type { Metadata } from "next";
import Image from "next/image";
import { FAQ } from "@/components/FAQ";
import { PageHero } from "@/components/PageHero";
import { FinalCTA } from "@/components/FinalCTA";
import { Group, Statement, DefRows } from "@/components/blocks";
import { UnderlineLink } from "@/components/UnderlineLink";

const BODY = "'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Архитекторам и дизайнерам — RePanel",
  description:
    "Всё, чтобы заложить RePanel в проект: характеристики, обработка, цвета, документы, 3D/BIM-модели и образцы.",
};

// map — ссылка на карту материала (текстуру для рендера); пока файлов нет → кнопка «скоро»
const basePalette = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { num: `№ ${n}`, img: `/images/colors/color-${n}.jpg`, map: undefined as string | undefined };
});

const specs = [
  { t: "Состав", d: "100 % переработанный полистирол (rPS)." },
  { t: "Форматы листа", d: "2200 × 1100 мм и 1000 × 1000 мм." },
  { t: "Толщины", d: "12–40 мм. Склад: 12 / 16 / 18 / 20 / 30 / 40 мм." },
  { t: "Плотность и вес", d: "1,0–1,1 г/см³; 13–42 кг/м² в зависимости от толщины." },
  { t: "Прочность", d: "Разрыв 22–26 МПа, изгиб 49–56 Н/мм², модуль упругости 2100–2240 МПа." },
  { t: "Твёрдость", d: "По Шору D 73–74." },
  { t: "Теплостойкость", d: "HDT 72–86 °C; рабочая температура −40…+80 °C." },
  { t: "Огнестойкость", d: "EN 13501-1 — Class E без покрытия (есть лабораторный отчёт)." },
  { t: "Влага и грибок", d: "Водопоглощение <0,01 %, грибостойкость 0 % роста (ASTM G21-15)." },
];

const processing = [
  { t: "Распил", d: "Циркулярная, ленточная пила, лобзик. Твёрдосплавный инструмент." },
  { t: "Фрезеровка", d: "ЧПУ и ручной фрезер: формы, пазы, отверстия под мойки." },
  { t: "Сверление", d: "Стандартные свёрла по дереву и металлу. Не трескается." },
  { t: "Шлифовка", d: "Абразивы P80–P320; восстанавливает матовый финиш." },
  { t: "Термоформование", d: "При нагреве — плавные изгибы и радиусы." },
  { t: "Склейка", d: "MMA-клеи (типа Plexus) и MS-полимеры; механический крепёж с овальными отверстиями под расширение." },
];

// file — ссылка на файл; пока нет → кнопка «Скоро» (disabled)
const documents: { t: string; d: string; file?: string }[] = [
  { t: "3D-модели панелей", d: "STEP / ZIP" },
  { t: "BIM-объекты", d: "Revit / ZIP" },
  { t: "Каталог продукции", d: "PDF" },
  { t: "Технический паспорт", d: "PDF" },
  { t: "Инструкция по монтажу", d: "PDF" },
];

const architectFaq = [
  { question: "Чем можно обрабатывать материал?", answer: "Стандартным деревообрабатывающим оборудованием: пилы, фрезеры, сверлильные станки и ЧПУ. Рекомендуем твёрдосплавный инструмент и пылеудаление." },
  { question: "Можно ли гнуть материал?", answer: "Да, термоформованием: при нагреве лист принимает плавные изгибы и радиусы. Минимальный радиус зависит от толщины — обсудим конкретную задачу." },
  { question: "Как материал ведёт себя с водой и на солнце?", answer: "Воду не впитывает, не разбухает и не гниёт — подходит для влажных зон. UV-стойкость умеренная: для интерьеров отлично, для постоянного прямого солнца поможем подобрать цвет и решение." },
  { question: "Есть ли ограничения по нагрузке?", answer: "Зависит от толщины и конструкции: столешницы — от 18–20 мм, нагруженные стойки — 30–40 мм, с рёбрами жёсткости. Поможем рассчитать." },
  { question: "Как работает кастомизация цвета?", answer: "Микс из 12 складских цветов по референсу или покраска по RAL / Pantone. Перед партией утверждаем физический образец 500 × 500 мм. На подбор закладывайте 2–3 недели." },
  { question: "Можно ли получить образцы для проекта?", answer: "Да. Напишите нам — отправим образцы выбранных цветов и толщин для согласования в проекте." },
  { question: "Какие сроки и минимальный объём?", answer: "Стандартный заказ — 10–14 рабочих дней, кастомные цвета — от 3 недель. Минимальный заказ — от 1 листа; для покраски по RAL — от 500 кг сырья." },
  { question: "Принимаете ли материал обратно?", answer: "Да, по программе buy-back: чистые обрезки и панели в конце службы возвращаются в производство, заказчик получает кредит на следующий заказ." },
];

export default function ForArchitectsPage() {
  return (
    <>
      <PageHero
        title="Архитекторам"
        image="/images/ro0184.jpg"
        imageAlt="Образцы материала RePanel"
        lead="Всё, чтобы быстро и уверенно заложить RePanel в проект: характеристики, обработка, цвета, документы и образцы."
      />

      <Statement>
        Реальный материал для серьёзных проектов — с&nbsp;понятными характеристиками, обработкой
        как&nbsp;у&nbsp;дерева и&nbsp;документами для&nbsp;спецификации.
      </Statement>

      <Group title="Характеристики">
        <DefRows rows={specs} />
      </Group>

      <Group title="Обработка">
        <DefRows rows={processing} />
      </Group>

      {/* Цвета и карты материалов — 12 базовых + текстуры для рендера (скачивание по цветам) */}
      <Group title="Цвета и карты материалов" id="colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-3 border-t border-[#171513] pt-2.5 self-start">
            <h3 className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "clamp(22px, 2.2vw, 31.7px)", lineHeight: 1.34, letterSpacing: "-0.5px" }}>12 базовых сочетаний</h3>
            <p className="text-[#171513] mt-2" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px", opacity: 0.7 }}>Плюс миксы из складских цветов и покраска по RAL / Pantone. Карты материалов (текстуры для рендера) — по каждому цвету.</p>
            <div className="mt-4 flex flex-col gap-3 items-start">
              <UnderlineLink href="/material" fontSize={16}>Подробнее о цвете →</UnderlineLink>
              <button disabled className="inline-flex items-center gap-2 cursor-not-allowed" style={{ fontFamily: BODY, fontSize: "13px", fontWeight: 700, color: "rgba(23,21,19,0.4)", border: "1px solid rgba(23,21,19,0.2)", borderRadius: 8, padding: "8px 12px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
                Скачать все карты (ZIP) — скоро
              </button>
            </div>
          </div>
          <div className="lg:col-start-4 lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {basePalette.map((c) => (
              <div key={c.num}>
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image src={c.img} alt={`Базовое сочетание ${c.num}`} fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover" />
                </div>
                <div className="flex items-center justify-between pt-2.5 gap-2">
                  <p className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px", lineHeight: "20px" }}>{c.num}</p>
                  {c.map ? (
                    <a href={c.map} download className="shrink-0 inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(23,21,19,0.25)", color: "#171513" }} aria-label={`Скачать карту ${c.num}`} title={`Скачать карту ${c.num}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
                    </a>
                  ) : (
                    <button disabled className="shrink-0 inline-flex items-center justify-center cursor-not-allowed" style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(23,21,19,0.2)", color: "rgba(23,21,19,0.4)" }} aria-label={`Карта ${c.num} — скоро`} title="Карта материала — скоро">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Group>

      <Group title="3D-модели и документы" id="downloads">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-start-4 md:col-span-9">
            {documents.map((r) => (
              <div key={r.t} className="border-t border-[#171513] flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "18.6px", lineHeight: "24px", letterSpacing: "-0.4px" }}>{r.t}</h3>
                  <p className="text-[#171513]" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "12.5px", lineHeight: "18px", letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.45 }}>{r.d}</p>
                </div>
                {r.file ? (
                  <a href={r.file} download className="shrink-0 inline-flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ fontFamily: BODY, fontSize: "13px", fontWeight: 700, color: "#171513", border: "1px solid rgba(23,21,19,0.3)", borderRadius: 8, padding: "9px 15px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
                    Скачать
                  </a>
                ) : (
                  <button disabled className="shrink-0 inline-flex items-center gap-2 cursor-not-allowed" style={{ fontFamily: BODY, fontSize: "13px", fontWeight: 700, color: "rgba(23,21,19,0.4)", border: "1px solid rgba(23,21,19,0.2)", borderRadius: 8, padding: "9px 15px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
                    Скоро
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[#171513] mt-6 md:ml-[25%]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px", opacity: 0.7 }}>
          Нужно под конкретный проект сейчас? <UnderlineLink href="/contacts" fontSize={14}>Напишите нам →</UnderlineLink> — вышлем актуальные файлы.
        </p>
      </Group>

      <Group title="Частые вопросы">
        <FAQ items={architectFaq} title="" />
      </Group>

      <FinalCTA heading="Заложить RePanel в проект?" text="Пришлём образцы, спецификации и 3D/BIM-модели — и поможем с расчётом и конструкцией." />
    </>
  );
}
