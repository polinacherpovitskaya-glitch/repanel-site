import Link from "next/link";
import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { Group } from "@/components/blocks";

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

const catalogFallbacks: Record<string, { name: string; price: string; use: string }> = {
  "stool-01": { name: "Табурет RePanel", price: "8 500 ₽", use: "Мебель" },
  "board-serving": { name: "Сервировочная доска", price: "3 200 ₽", use: "Аксессуары" },
  "organizer-desk": { name: "Органайзер настольный", price: "4 800 ₽", use: "Офис" },
  "shelf-wall": { name: "Полка модульная", price: "6 900 ₽", use: "Мебель" },
  "planter-floor": { name: "Кашпо", price: "5 500 ₽", use: "Аксессуары" },
  "kids-table": { name: "Столик детский", price: "7 200 ₽", use: "Дети" },
  tray: { name: "Поднос", price: "2 800 ₽", use: "Аксессуары" },
  bench: { name: "Скамья", price: "12 000 ₽", use: "Мебель" },
  "menu-holder": { name: "Менюхолдер", price: "3 500 ₽", use: "HoReCa" },
  "coaster-set": { name: "Подставки (набор)", price: "1 800 ₽", use: "Аксессуары" },
  "kids-stool": { name: "Табурет детский", price: "6 400 ₽", use: "Дети" },
  console: { name: "Консоль", price: "15 000 ₽", use: "Мебель" },
  "menu-stand": { name: "Держатель меню", price: "2 200 ₽", use: "HoReCa" },
};

const productsData: Record<string, { name: string; price: string; description: string; use: string; sizes: string; colors: string; customizable: string; moq: string; lead: string; features: string[] }> = {
  "stool-01": { name: "Табурет RO-01", price: "от 12 000 ₽", description: "Компактный табурет из переработанного полистирола для кафе, баров, общественных пространств и дома. Прочная конструкция, уникальная фактура каждого экземпляра.", use: "HoReCa, общественные пространства, дом", sizes: "400 × 400 × 450 мм", colors: "12 базовых сочетаний + кастом", customizable: "Цвет, высота", moq: "от 10 шт", lead: "2–3 недели", features: ["Устойчив к влаге", "Выдерживает до 120 кг", "Штабелируется", "Уникальная фактура"] },
  "board-serving": { name: "Сервировочная доска", price: "от 5 000 ₽", description: "Сервировочная доска из переработанного полистирола для подачи в ресторанах, кафе и дома. Не впитывает запахи, легко моется.", use: "HoReCa, подарки, дом", sizes: "400 × 250 × 20 мм", colors: "12 базовых сочетаний + кастом", customizable: "Цвет, размер, брендирование", moq: "от 20 шт", lead: "1–2 недели", features: ["Не впитывает запахи", "Легко моется", "Стойкость к пятнам", "Уникальный рисунок"] },
  "organizer-desk": { name: "Органайзер настольный", price: "от 3 500 ₽", description: "Настольный органайзер для канцелярии, визиток и мелочей. Отличный корпоративный подарок с возможностью брендирования.", use: "Офис, дом, корпоративный подарок", sizes: "250 × 150 × 120 мм", colors: "12 базовых сочетаний + кастом", customizable: "Цвет, брендирование, конфигурация отсеков", moq: "от 50 шт", lead: "2–3 недели", features: ["Компактный", "Брендируемый", "Тираж от 50 шт", "Идеален для мерча"] },
  "shelf-wall": { name: "Полка настенная", price: "от 8 000 ₽", description: "Настенная полка из переработанного полистирола. Выразительная фактура материала превращает утилитарный предмет в интерьерный акцент.", use: "Интерьер, ритейл, офис", sizes: "800 × 200 × 25 мм", colors: "12 базовых сочетаний + кастом", customizable: "Цвет, длина, глубина", moq: "от 10 шт", lead: "2 недели", features: ["Несущая способность до 15 кг", "Скрытый крепёж", "Уникальная фактура", "Устойчива к влаге"] },
  "planter-floor": { name: "Кашпо напольное", price: "от 15 000 ₽", description: "Напольное кашпо для лобби, ресторанов и общественных пространств. Тяжёлое основание, устойчивая конструкция.", use: "Лобби, HoReCa, дом, public", sizes: "300 × 300 × 400 мм", colors: "12 базовых сочетаний + кастом", customizable: "Цвет, высота, форма", moq: "от 5 шт", lead: "2–3 недели", features: ["Устойчивое основание", "Внутренний контейнер", "Для интерьера", "Уникальная фактура"] },
  "kids-table": { name: "Детский стол", price: "от 18 000 ₽", description: "Стол для детских комнат, игровых зон ЖК и детских кафе. Безопасные скруглённые углы, устойчивая конструкция.", use: "Детская, ЖК, кафе", sizes: "600 × 600 × 500 мм", colors: "12 базовых сочетаний + кастом", customizable: "Цвет, размер, высота", moq: "от 5 шт", lead: "2–3 недели", features: ["Скруглённые углы", "Устойчив к ударам", "Легко моется", "Безопасен для детей"] },
};

const defaultProduct = { name: "Изделие RePanel", price: "по запросу", description: "Предмет из переработанного полистирола. Кастомизация цвета, размера и тиража.", use: "Универсальное", sizes: "По запросу", colors: "12 базовых сочетаний + кастом", customizable: "Цвет, размер", moq: "от 5 шт", lead: "2–4 недели", features: ["Уникальная фактура", "Переработанный полистирол", "Кастомизация"] };

function getProduct(slug: string) {
  const detailed = productsData[slug];
  if (detailed) return detailed;
  const preview = catalogFallbacks[slug];
  if (!preview) return defaultProduct;
  const price = preview.price.startsWith("от") || preview.price.startsWith("по") ? preview.price : `от ${preview.price}`;
  return { ...defaultProduct, name: preview.name, price, use: preview.use, description: `${preview.name} из переработанного полистирола. Доступна кастомизация цвета, размера и тиража под проект.` };
}

export async function generateStaticParams() {
  return Array.from(new Set([...Object.keys(catalogFallbacks), ...Object.keys(productsData)])).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: `${p.name} — RePanel`, description: p.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);

  const specs: [string, string][] = [
    ["Размеры", p.sizes], ["Цвета", p.colors], ["Кастомизация", p.customizable], ["Мин. партия", p.moq], ["Срок", p.lead],
  ];

  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="mb-8" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.45 }}>
            <Link href="/" className="hover:opacity-60">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/catalog" className="hover:opacity-60">Магазин</Link>
            <span className="mx-2">/</span>
            <span style={{ opacity: 0.8 }}>{p.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* Галерея — плейсхолдеры (фото добавим из админки) */}
            <div>
              <div className="flex items-center justify-center mb-3" style={{ aspectRatio: "1", background: "#EAEAE7", border: "1px solid rgba(23,21,19,0.1)" }}>
                <span style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.3 }}>Фото изделия</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-center" style={{ aspectRatio: "1", background: "#EAEAE7", border: "1px solid rgba(23,21,19,0.08)" }}>
                    <span style={{ fontFamily: BODY, fontSize: "10px", opacity: 0.25 }}>{i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Инфо */}
            <div>
              <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px, 3.5vw, 52px)", letterSpacing: "-0.02em", lineHeight: 1.0 }}>{p.name}</h1>
              <p className="mt-3 text-[#171513]" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.45 }}>{p.use}</p>
              <p className="mt-4 font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.4vw, 34px)", letterSpacing: "-0.5px" }}>{p.price}</p>
              <p className="mt-6 text-[#171513] max-w-[480px]" style={{ fontFamily: BODY, fontSize: "14.6px", lineHeight: "20px", opacity: 0.8 }}>{p.description}</p>

              <div className="mt-8">
                {specs.map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4 border-t border-[#171513]/15 py-3" style={{ fontFamily: BODY, fontSize: "14px" }}>
                    <span className="text-[#171513]" style={{ opacity: 0.5 }}>{label}</span>
                    <span className="font-bold text-[#171513] text-right">{val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {p.features.map((f) => (
                  <span key={f} className="text-[#171513]" style={{ fontFamily: BODY, fontSize: "12px", border: "1px solid rgba(23,21,19,0.2)", padding: "6px 12px" }}>{f}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/contacts" className="px-7 py-3.5 text-center transition-opacity hover:opacity-90" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "15px", background: "#66704D", color: "#FFFFFF" }}>Запросить стоимость →</Link>
                <Link href="/contacts" className="px-7 py-3.5 text-center transition-colors hover:bg-[#171513]/[0.04]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "15px", border: "1px solid rgba(23,21,19,0.25)", color: "#171513" }}>Заказать партию →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Group title="Смотрите также">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5">
          {Object.entries(productsData).filter(([s]) => s !== slug).slice(0, 4).map(([s, item]) => (
            <Link key={s} href={`/catalog/${s}`} className="group/card flex flex-col bg-white" style={{ border: "1px solid rgba(23,21,19,0.1)" }}>
              <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ aspectRatio: "4 / 3", background: "#EAEAE7" }}>
                <span style={{ fontFamily: BODY, fontSize: "12px", opacity: 0.3 }}>Фото</span>
              </div>
              <div className="p-4">
                <h3 className="relative inline-block" style={{ color: "#171513", fontFamily: BODY, fontWeight: 700, fontSize: "14.5px", lineHeight: 1.25 }}>
                  {item.name}
                  <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 group-hover/card:w-full transition-[width] duration-300 ease-out" style={{ background: "#66704D" }} />
                </h3>
                <p style={{ color: "#171513", fontFamily: BODY, fontWeight: 700, fontSize: "14px", marginTop: 6 }}>{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </Group>

      <FinalCTA heading="Нужен этот предмет под проект?" text="Адаптируем цвет, размер и тираж — или разработаем новое изделие с нуля." />
    </>
  );
}
