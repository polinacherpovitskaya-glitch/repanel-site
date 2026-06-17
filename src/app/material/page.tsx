import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { PageHero } from "@/components/PageHero";
import { UnderlineLink } from "@/components/UnderlineLink";

export const metadata: Metadata = {
  title: "Материал — RePanel",
  description:
    "Переработанный пластик RePanel: вид терраццо и камня, влагостойкость, UV-стабильность, обработка столярным инструментом. Цвета, форматы и технические характеристики.",
};

/* ── Шрифты (паттерны главной) ── */
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

/* ── Данные ── */

// Этапы производства — материал-ряды (Figma: Materials, ряды Walnut/Ash/Oak).
// Факты — из базы знаний RePanel: сырьё rPS (HIPS/GPPS), закупка у сертифицированных переработчиков.
const productionRows = [
  {
    name: "Проверенное вторсырьё",
    desc: "Мы не работаем со свалочным мусором. Сырьё для панелей — готовый переработанный полистирол, который мы закупаем у проверенных компаний-переработчиков с сертификатами на вторичный материал. Это корпуса холодильников и бытовой техники, электроника, одноразовая посуда и технологические отходы производств — пластик, уже прошедший сортировку, очистку и контроль качества. На входе дополнительно проверяем каждую партию: однородность, чистоту и оттенок. Загрязнённый пластик и композиты с другими материалами в работу не берём.",
    img: "/images/ro0151.jpg",
  },
  {
    name: "Прессование",
    desc: "Подготовленное сырьё прессуем под давлением и температурой в плотный монолитный лист — без пустот, связующих смол и формальдегидов. Рисунок рождается на этом этапе, и он не обязан быть терраццо: выкладываем художественные паттерны, собираем монохромные миксы из нескольких оттенков одного цвета, делаем контрастную крошку или полностью однотонные листы. Подберём микс по референсу или мудборду, а если нужного оттенка нет — покрасим по RAL или Pantone. Каждый лист уникален: рисунок — это структура самого материала, а не печать на поверхности.",
    img: "/images/ro0164.jpg",
  },
  {
    name: "Раскрой и финиш",
    desc: "Готовые листы калибруем по толщине — от 12 до 40 мм, затем шлифуем до ровного заводского матового финиша. После этого режем в размер проекта: пилой, на ЧПУ или фрезером, а кромке даём прямой рез, фаску или скругление. Дальше — постобработка под задачу: отверстия под крепёж и мойки, пазы, термоформование плавных изгибов. Если заказана не панель, а готовое изделие — собираем его целиком: столешницу, стойку, мебельный фасад. Обрезки не выбрасываем: принимаем обратно по программе buy-back и снова пускаем в производство.",
    img: "/images/ro0184.jpg",
  },
];

// Позиции рядов (Figma 4:7762/4:7774): фото 3 кол. (455px), текст 4 кол. (имя 2 + описание 2).
// row-start-1 обязателен: без него грид уносит текст во вторую строку (вниз), а он должен
// быть выровнен по верху фото. Чередование: фото слева → справа → слева → справа.
const rowLayouts = [
  { photo: "lg:col-span-3 lg:row-start-1", text: "lg:col-start-4 lg:col-span-4 lg:row-start-1" },
  { photo: "lg:col-start-10 lg:col-span-3 lg:row-start-1", text: "lg:col-start-6 lg:col-span-4 lg:row-start-1" },
  { photo: "lg:col-span-3 lg:row-start-1", text: "lg:col-start-4 lg:col-span-4 lg:row-start-1" },
  { photo: "lg:col-start-10 lg:col-span-3 lg:row-start-1", text: "lg:col-start-6 lg:col-span-4 lg:row-start-1" },
];

// 12 базовых сочетаний цветов — фото из калькулятора (палитра №01–№12), входят в стоимость листа
const basePalette = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { num: `№ ${n}`, img: `/images/colors/color-${n}.jpg` };
});

// Живые остатки гранул со склада — публичный API калькулятора
const CALC_ORIGIN = "https://web-production-d2761c.up.railway.app";

type Granule = { id: number; code: string; color: string; ral: string; stock_kg: number; photo_url: string };

async function getGranules(): Promise<Granule[] | null> {
  try {
    const res = await fetch(`${CALC_ORIGIN}/api/public/granules`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { granules?: Granule[] };
    return data.granules?.length ? data.granules : null;
  } catch {
    return null;
  }
}

const properties = [
  { t: "Не боится воды", d: "Не впитывает влагу, не разбухает и не гниёт. Грибостойкость — 0 % роста (ASTM G21-15): для ванных, кухонь и влажных зон." },
  { t: "Стойкость к пятнам", d: "Вино, кофе, лимон, специи — без следов. По стейн-тестам rPS держит пятна лучше акрилового камня." },
  { t: "Ремонтопригодность", d: "Царапины и потёртости снимаются шлифовкой — поверхность восстанавливается рефинишем." },
  { t: "Обработка как дерево", d: "Пилится, фрезеруется и сверлится обычным столярным инструментом и на ЧПУ." },
  { t: "Уникальный рисунок", d: "Рисунок — структура самого материала, не печать. Ни один лист не повторяется." },
  { t: "100 % переработка", d: "Вторичный полистирол без формальдегидов. Обрезки и изделия принимаем обратно по программе buy-back." },
];

const formats = [
  { t: "Форматы листа", d: "2200 × 1100 мм (2,42 м²) — основной формат; 1000 × 1000 мм — для акцентов, малых изделий и образцов. Раскрой в любой размер под проект." },
  { t: "Толщины", d: "Складские: 12 · 16 · 18 · 20 · 30 · 40 мм. Под заказ — любая в диапазоне 12–40 мм. Толще любого импортного аналога: массивные столешницы без подложки." },
  { t: "Кромка и финиш", d: "Прямой рез, фаска, скругление; заводской матовый финиш. Термоформование плавных изгибов." },
];

const processing = [
  { t: "Пиление", d: "Циркулярная или ленточная пила. Рез чистый, без сколов." },
  { t: "ЧПУ и фрезерование", d: "Сложные формы, пазы, отверстия под мойки. На толстых листах — несколько проходов по 3–4 мм." },
  { t: "Сверление", d: "Стандартные свёрла по дереву или металлу. На толщинах 30–40 мм — охлаждение воздухом." },
  { t: "Шлифовка", d: "Ленточная или орбитальная машина. Снимает царапины и восстанавливает матовый финиш." },
  { t: "Термоформование", d: "При нагреве лист принимает плавные изгибы и радиусы — изогнутые фасады и скругления." },
  { t: "Склейка", d: "MMA-клеи (типа Plexus) и MS-полимеры: кромка к кромке и крепление к подложке." },
];

// Embodied carbon (GWP-fossil), кг CO₂e/м² — по EPD европейских производителей rPS-панелей
// (Polygood, Smile Plastics — материал того же типа). Собственный EPD RePanel — в работе.
const carbonRows = [
  { t: "Массив дерева", d: "3,2 кг CO₂e/м²" },
  { t: "МДФ с лаком", d: "3,7 кг CO₂e/м²" },
  { t: "ДСП с лаком", d: "4,0 кг CO₂e/м²" },
  { t: "Панели из rPS — как RePanel", d: "4,6 кг CO₂e/м²" },
  { t: "Кварцевый агломерат", d: "28,0 кг CO₂e/м²" },
  { t: "Акриловый камень (solid surface)", d: "61,4 кг CO₂e/м²" },
];

const specs = [
  { label: "Состав", value: "100 % переработанный полистирол (rPS)" },
  { label: "Форматы листа", value: "2200 × 1100 мм · 1000 × 1000 мм" },
  { label: "Толщины", value: "12–40 мм (склад: 12 / 16 / 18 / 20 / 30 / 40)" },
  { label: "Плотность", value: "1,0–1,1 г/см³" },
  { label: "Вес", value: "13–42 кг/м² (по толщине)" },
  { label: "Твёрдость по Шору", value: "D 73–74" },
  { label: "Модуль упругости", value: "2100–2240 МПа" },
  { label: "Прочность на разрыв", value: "22–26 МПа" },
  { label: "Теплостойкость (HDT)", value: "72–86 °C" },
  { label: "Огнестойкость", value: "EN 13501-1 — Class E (без покрытия)" },
  { label: "Грибостойкость", value: "0 % роста (ASTM G21-15)" },
  { label: "Финиш", value: "Заводской матовый" },
];

const applicationsCarousel = [
  { title: "Кухонные фасады", img: "/images/sposoby/sp-kitchen.png" },
  { title: "Фартуки на кухню", img: "/images/sposoby/sp-backsplash.png" },
  { title: "Мебель для ванной", img: "/images/sposoby/sp-bathroom.png" },
  { title: "Подоконники", img: "/images/sposoby/sp-windowsill.png" },
  { title: "Стеновые панели", img: "/images/sposoby/sp-wall.png" },
  { title: "Изголовья кроватей", img: "/images/sposoby/sp-headboard.png" },
  { title: "Городская среда", img: "/images/sposoby/sp-urban.png" },
  { title: "Офисные столешницы", img: "/images/sposoby/sp-office.png" },
];

const materialFaq = [
  { question: "Устойчив ли материал к воде?", answer: "Да. Материал не впитывает воду, не разбухает и не гниёт, грибостойкость — 0 % роста. Подходит для ванных комнат, кухонь и зон с повышенной влажностью." },
  { question: "Как материал ведёт себя на солнце?", answer: "Для интерьеров — без ограничений. UV-стойкость умеренная: при постоянном прямом солнце оттенки со временем могут меняться, поэтому для улицы и южных витрин поможем подобрать подходящий цвет и решение." },
  { question: "Какую нагрузку выдерживает?", answer: "Зависит от толщины: 12 мм — панели и фасады (столешницы — с подложкой), 20 мм — лёгкие столешницы, 30 мм — барные и ресепшен-стойки, 40 мм — массивные столешницы и скамьи. Поможем рассчитать конструкцию." },
  { question: "Можно ли гнуть материал?", answer: "Да, термоформованием: при нагреве лист принимает плавные изгибы и радиусы. Изогнутые фасады, скругления и объёмные элементы делаем на производстве." },
  { question: "Как ухаживать за поверхностью?", answer: "Влажная губка и мягкое средство без абразива. Пятна от вина, кофе и специй материал держит лучше акрилового камня. Глубокие царапины снимаются шлифовкой — поверхность восстанавливается рефинишем." },
  { question: "Можно ли заказать цвет под бренд?", answer: "Да: соберём микс из складских цветов по референсу или покрасим по RAL / Pantone. Перед запуском партии утверждаем физический образец 500 × 500 мм." },
  { question: "Что делать с обрезками и старыми панелями?", answer: "Принимаем обратно по программе buy-back: чистые обрезки и панели в конце службы возвращаются в производство, а вы получаете кредит на следующий заказ." },
];

/* ── Паттерны шаблона ── */

// Заголовок группы — размер и стиль как у заголовков секций главной
function GroupTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="font-bold text-[#171513] mb-5 lg:mb-7"
      style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}
    >
      {children}
    </h2>
  );
}

// Деф-строка (Figma Sustainability / главная 4:8885): хайрлайн + ярлык + текст
function DefRows({ rows }: { rows: { t: string; d: string }[] }) {
  return (
    <>
      {rows.map((r) => (
        <div key={r.t} className="border-t border-[#171513] grid grid-cols-1 md:grid-cols-9 gap-y-1 gap-x-5 pt-3 pb-5">
          <h3 className="md:col-span-5 font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "18.6px", lineHeight: "26.66px", letterSpacing: "-0.4px" }}>
            {r.t}
          </h3>
          <p className="md:col-span-4 text-[#171513]" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px" }}>
            {r.d}
          </p>
        </div>
      ))}
    </>
  );
}

export default async function MaterialPage() {
  const granules = await getGranules();
  return (
    <>
      {/* ═══ HERO — единый PageHero (Figma collection-hero 4:7967) ═══ */}
      <PageHero
        title="Материал"
        image="/images/RO1258.jpg"
        imageAlt="RePanel — панели из переработанного пластика"
        lead="Переработанный пластик с видом терраццо или камня. Не боится воды, легче камня, обрабатывается как дерево — и каждый лист уникален. Производим в России из переработанного полистирола."
      />

      {/* ═══ СТЕЙТМЕНТ (Figma p.is-h3 — сразу после героя, во всю ширину) ═══ */}
      <section className="px-[var(--site-margins)] pt-5">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 700,
              color: "#171513",
              fontSize: "clamp(16.8px, 4.5vw, 31.9px)",
              lineHeight: 1.37,
              letterSpacing: "-0.021em",
            }}
          >
            Мы перерабатываем пластиковые отходы в&nbsp;плотные листы — терраццо, художественный
            паттерн или ровный однотон — материал для мебели, интерьеров и&nbsp;городской среды,
            который не&nbsp;боится воды и&nbsp;времени.
          </p>
        </div>
      </section>

      {/* ═══ КАК МЫ ЭТО ДЕЛАЕМ — материал-ряды (Figma: Solid Wood rows, чередование) ═══ */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <GroupTitle>Как мы это делаем</GroupTitle>
          <div>
            {productionRows.map((row, i) => {
              const L = rowLayouts[i % rowLayouts.length];
              return (
                <div key={row.name} className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-5">
                  <div className={`relative aspect-square overflow-hidden order-first lg:order-none ${L.photo}`}>
                    <Image src={row.img} alt={row.name} fill sizes="(min-width:1024px) 25vw, 100vw" className="object-cover" />
                  </div>
                  {/* Текстовый блок ряда «заякорен» хайрлайном (Figma: линия над name+desc) */}
                  <div className={`border-t border-[#171513] pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 self-start ${L.text}`}>
                    <h3 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.2vw, 31.7px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                      {row.name}
                    </h3>
                    <p style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px", color: "#171513", opacity: 1 }}>
                      {row.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ЦВЕТА — паттерн Finishes (ярлык слева + сетка образцов с подписями) ═══ */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <GroupTitle>Цвета</GroupTitle>

          {/* ── Вариант 1. Базовые сочетания — 12 фото, в стоимости листа ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3">
            <div className="lg:col-span-3 border-t border-[#171513] pt-2.5 self-start">
              <h3 className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "clamp(22px, 2.2vw, 31.7px)", lineHeight: 1.34, letterSpacing: "-0.5px" }}>
                Базовые сочетания
              </h3>
              <p className="text-[#171513] mt-1" style={{ fontFamily: BODY, fontSize: "13.5px", lineHeight: "19px", opacity: 0.6 }}>
                12 вариантов · в стоимости листа
              </p>
            </div>
            <div className="lg:col-start-4 lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {basePalette.map((c) => (
                <div key={c.num}>
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Image src={c.img} alt={`Базовое сочетание ${c.num}`} fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover" />
                  </div>
                  <p className="font-bold text-[#171513] pt-2.5" style={{ fontFamily: BODY, fontSize: "13px", lineHeight: "20px" }}>{c.num}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Вариант 2. Подбор из гранул на складе (+18 000 ₽) + живые остатки ── */}
          <div className="border-t border-[#171513] pt-2.5 grid grid-cols-1 lg:grid-cols-12 gap-5 mt-12 lg:mt-16">
            <div className="lg:col-span-3 self-start">
              <h3 className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "clamp(22px, 2.2vw, 31.7px)", lineHeight: 1.34, letterSpacing: "-0.5px" }}>
                Подбор из гранул на складе
              </h3>
              <p className="text-[#171513] mt-1" style={{ fontFamily: BODY, fontSize: "13.5px", lineHeight: "19px", opacity: 0.6 }}>
                +18 000 ₽ за подбор с образцами
              </p>
            </div>
            <div className="lg:col-start-4 lg:col-span-5">
              <p className="text-[#171513]" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px" }}>
                <strong>Бесплатно:</strong> если нравится одно из 12 базовых сочетаний, но хочется заменить
                один цвет на другой при той же пропорции — запускаем заказ без образцов. Риск: разные цвета
                ведут себя по-разному, результат может отличаться от ожидания.
              </p>
              <p className="text-[#171513] mt-4" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px" }}>
                <strong>+18 000 ₽ — подбор с образцами:</strong> в стоимость входят 3 образца 50 × 50 см.
                Делаем по одному: смотрим → корректируем пропорцию → следующий. Когда пропорция найдена —
                фиксируем и запускаем лист. Ориентиры пропорций: 50/50 · 70/30 · 90/10 · 95/5 · 97/3.
              </p>
            </div>
          </div>

          {/* Живые остатки гранул — публичный API калькулятора (обновляется раз в час) */}
          {granules && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-8">
              <p className="lg:col-span-3 font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px" }}>
                Гранулы на складе сейчас
              </p>
              <div className="lg:col-start-4 lg:col-span-9 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {granules.map((g) => (
                  <div key={g.id}>
                    <div className="relative w-full aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${CALC_ORIGIN}${g.photo_url}`} alt={`${g.code} — ${g.color}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-[#171513] pt-1.5" style={{ fontFamily: BODY, fontSize: "12.5px", lineHeight: "17px" }}>
                      {g.code} · {g.color}
                    </p>
                    <p className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "12px", lineHeight: "17px", opacity: 0.55 }}>
                      {g.ral ? `RAL ${g.ral} · ` : ""}{Math.round(g.stock_kg)} кг
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Вариант 3. Покраска по RAL / Pantone (+144 000 ₽ · от 500 кг) ── */}
          <div className="border-t border-[#171513] pt-2.5 grid grid-cols-1 lg:grid-cols-12 gap-5 mt-12 lg:mt-16">
            <div className="lg:col-span-3 self-start">
              <h3 className="font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "clamp(22px, 2.2vw, 31.7px)", lineHeight: 1.34, letterSpacing: "-0.5px" }}>
                Покраска по RAL / Pantone
              </h3>
              <p className="text-[#171513] mt-1" style={{ fontFamily: BODY, fontSize: "13.5px", lineHeight: "19px", opacity: 0.6 }}>
                +144 000 ₽ · от 500 кг
              </p>
            </div>
            <div className="lg:col-start-4 lg:col-span-5 flex flex-col items-start gap-4">
              <p className="text-[#171513]" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px" }}>
                Если нужен точный фирменный оттенок — красим сырьё под выбранный RAL или Pantone.
                Минимальный заказ — 500 кг на один цвет: в стоимость входят доставка сырья к покрасчику,
                закупка красителя, работа и доставка обратно. Частичной покраски не делаем — крашеное
                сырьё идёт ровно на весь лист. В стоимость включены 3 образца 50 × 50 см — утверждаем
                цвет до запуска в производство.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                <UnderlineLink href="/contacts" fontSize={16}>Запросить расчёт с цветом →</UnderlineLink>
                <UnderlineLink href="/contacts" fontSize={16}>Обсудить с менеджером →</UnderlineLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ СВОЙСТВА — квадратное фото + деф-строки (Figma Sustainability) ═══ */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <GroupTitle>Свойства</GroupTitle>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-2 relative aspect-square overflow-hidden self-start">
              <Image src="/images/04_texture.png" alt="Фактура RePanel крупным планом" fill sizes="(min-width:768px) 17vw, 100vw" className="object-cover" />
            </div>
            <div className="md:col-start-4 md:col-span-9">
              <DefRows rows={properties} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ФОРМАТЫ И ОБРАБОТКА — деф-строки ═══ */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <GroupTitle>Форматы и обработка</GroupTitle>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-start-4 md:col-span-9">
              <DefRows rows={formats} />
              <div className="pt-10" />
              <DefRows rows={processing} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ТЕХ-ХАРАКТЕРИСТИКИ — деф-строки «ярлык + значение» ═══ */}
      <section className="px-[var(--site-margins)] pt-20 lg:pt-36 pb-20 lg:pb-32">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <GroupTitle>Технические характеристики</GroupTitle>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-start-4 md:col-span-9">
              {specs.map((s) => (
                <div key={s.label} className="border-t border-[#171513] grid grid-cols-1 md:grid-cols-9 gap-y-0.5 gap-x-5 pt-3 pb-4">
                  <h3 className="md:col-span-5 font-bold text-[#171513]" style={{ fontFamily: BODY, fontSize: "18.6px", lineHeight: "26.66px", letterSpacing: "-0.4px" }}>
                    {s.label}
                  </h3>
                  <p className="md:col-span-4 text-[#171513]" style={{ fontFamily: BODY, fontWeight: 400, fontSize: "14.6px", lineHeight: "20px" }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ПРИМЕЧАНИЕ — центрированная строка со ссылкой (Figma care-note) ═══ */}
      <section className="px-[var(--site-margins)] border-t border-[#171513] py-16 lg:py-24">
        <div className="mx-auto text-center" style={{ maxWidth: 980 }}>
          <p
            className="text-[#171513]"
            style={{ fontFamily: BODY, fontWeight: 700, fontSize: "clamp(20px, 2.4vw, 31.7px)", lineHeight: 1.37, letterSpacing: "-0.021em" }}
          >
            Поможем выбрать цвет, толщину и формат под вашу задачу.
          </p>
          <div className="mt-5 flex justify-center">
            <UnderlineLink href="/contacts">Запросить бесплатные образцы →</UnderlineLink>
          </div>
        </div>
      </section>

      {/* ═══ ГДЕ ПРИМЕНЯЮТ — свайп-карусель (паттерн главной) ═══ */}
      <section className="px-[var(--site-margins)] border-t border-[#171513] pt-8 lg:pt-12 pb-10 lg:pb-16">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2
            className="font-bold text-[#171513] mb-4 lg:mb-5"
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}
          >
            Где применяют
          </h2>
          <div className="flex gap-3 lg:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mr-[var(--site-margins)] pr-[var(--site-margins)]">
            {applicationsCarousel.map((d) => (
              <Link key={d.title} href="/solutions" className="group/card block shrink-0 w-[clamp(240px,42vw,330px)] snap-start">
                <div className="relative overflow-hidden" style={{ aspectRatio: "455 / 606" }}>
                  <Image src={d.img} alt={d.title} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "rgba(255, 255, 255,0.82)" }}
                  />
                </div>
                <div className="pt-1.5">
                  <h3
                    className="font-bold text-[#171513] inline-block relative"
                    style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.5vw, 18px)", letterSpacing: "-0.3px", lineHeight: 1.2 }}
                  >
                    {d.title}
                    <span className="absolute left-0 -bottom-1 h-[1.5px] bg-[#171513] w-0 group-hover/card:w-full transition-[width] duration-[450ms] ease-out" />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-[var(--site-margins)] border-t border-[#171513] pt-8 lg:pt-12 pb-8 lg:pb-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <FAQ items={materialFaq} title="Вопросы о материале" />
        </div>
      </section>

      {/* ═══ УГЛЕРОДНЫЙ СЛЕД — в конце страницы ═══ */}
      <section className="px-[var(--site-margins)] border-t border-[#171513] pt-8 lg:pt-12 pb-10 lg:pb-16">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <GroupTitle>Углеродный след</GroupTitle>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-start-4 md:col-span-9">
              <DefRows rows={carbonRows} />
              <p className="pt-5 text-[#171513] max-w-[610px]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px", opacity: 0.7 }}>
                Данные — из опубликованных EPD европейских производителей панелей из переработанного
                полистирола (Polygood, Smile Plastics): это материал того же типа, что RePanel.
                Панели rPS живут в одном диапазоне с деревом и МДФ — и в разы ниже кварца и акрилового
                камня. Собственная экологическая декларация (EPD) RePanel — в работе.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <FinalCTA
        heading="Нужны образцы?"
        text="Пришлём бесплатные образцы цветов и фактур, поможем выбрать толщину и формат под вашу задачу."
      />
    </>
  );
}
