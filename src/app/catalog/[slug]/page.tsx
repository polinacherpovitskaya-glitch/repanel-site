import Link from "next/link";
import type { Metadata } from "next";

const D = "'Montserrat', var(--font-display), sans-serif";

const catalogFallbacks: Record<string, {
  name: string;
  price: string;
  use: string;
}> = {
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

const productsData: Record<string, {
  name: string;
  price: string;
  description: string;
  use: string;
  sizes: string;
  colors: string;
  customizable: string;
  moq: string;
  lead: string;
  features: string[];
}> = {
  "stool-01": {
    name: "Табурет RO-01",
    price: "от 12 000 ₽",
    description: "Компактный табурет из переработанного пластика для кафе, баров, общественных пространств и дома. Прочная конструкция, уникальная фактура каждого экземпляра.",
    use: "HoReCa, общественные пространства, дом",
    sizes: "400 × 400 × 450 мм",
    colors: "Базовая палитра (6 цветов) + кастом",
    customizable: "Цвет, высота",
    moq: "от 10 шт",
    lead: "2–3 недели",
    features: ["Устойчив к влаге", "Выдерживает до 120 кг", "Штабелируется", "Уникальная фактура"],
  },
  "board-serving": {
    name: "Сервировочная доска",
    price: "от 5 000 ₽",
    description: "Сервировочная доска из переработанного пластика для подачи в ресторанах, кафе и дома. Не впитывает запахи, легко моется.",
    use: "HoReCa, подарки, дом",
    sizes: "400 × 250 × 20 мм",
    colors: "Базовая палитра + кастом",
    customizable: "Цвет, размер, брендирование",
    moq: "от 20 шт",
    lead: "1–2 недели",
    features: ["Не впитывает запахи", "Легко моется", "Безопасна для продуктов", "Уникальный рисунок"],
  },
  "organizer-desk": {
    name: "Органайзер настольный",
    price: "от 3 500 ₽",
    description: "Настольный органайзер для канцелярии, визиток и мелочей. Отличный корпоративный подарок с возможностью брендирования.",
    use: "Офис, дом, корпоративный подарок",
    sizes: "250 × 150 × 120 мм",
    colors: "Базовая палитра + кастом",
    customizable: "Цвет, брендирование, конфигурация отсеков",
    moq: "от 50 шт",
    lead: "2–3 недели",
    features: ["Компактный", "Брендируемый", "Тираж от 50 шт", "Идеален для мерча"],
  },
  "shelf-wall": {
    name: "Полка настенная",
    price: "от 8 000 ₽",
    description: "Настенная полка из переработанного пластика. Выразительная фактура материала превращает утилитарный предмет в интерьерный акцент.",
    use: "Интерьер, ритейл, офис",
    sizes: "800 × 200 × 25 мм",
    colors: "Базовая палитра + кастом",
    customizable: "Цвет, длина, глубина",
    moq: "от 10 шт",
    lead: "2 недели",
    features: ["Несущая способность до 15 кг", "Скрытый крепёж", "Уникальная фактура", "Устойчива к влаге"],
  },
  "planter-floor": {
    name: "Кашпо напольное",
    price: "от 15 000 ₽",
    description: "Напольное кашпо для лобби, ресторанов и общественных пространств. Тяжёлое основание, устойчивая конструкция.",
    use: "Лобби, HoReCa, дом, public",
    sizes: "300 × 300 × 400 мм",
    colors: "Базовая палитра + кастом",
    customizable: "Цвет, высота, форма",
    moq: "от 5 шт",
    lead: "2–3 недели",
    features: ["Устойчивое основание", "Внутренний контейнер", "Для интерьера и улицы", "Уникальная фактура"],
  },
  "kids-table": {
    name: "Детский стол",
    price: "от 18 000 ₽",
    description: "Стол для детских комнат, игровых зон ЖК и детских кафе. Безопасные скруглённые углы, устойчивая конструкция.",
    use: "Детская, ЖК, кафе",
    sizes: "600 × 600 × 500 мм",
    colors: "Базовая палитра + кастом",
    customizable: "Цвет, размер, высота",
    moq: "от 5 шт",
    lead: "2–3 недели",
    features: ["Скруглённые углы", "Устойчив к ударам", "Легко моется", "Безопасен для детей"],
  },
};

const defaultProduct = {
  name: "Изделие RePanel",
  price: "по запросу",
  description: "Предмет из переработанного пластика. Кастомизация цвета, размера и тиража.",
  use: "Универсальное",
  sizes: "По запросу",
  colors: "Базовая палитра + кастом",
  customizable: "Цвет, размер",
  moq: "от 5 шт",
  lead: "2–4 недели",
  features: ["Уникальная фактура", "Переработанный пластик", "Кастомизация"],
};

function getProduct(slug: string) {
  const detailed = productsData[slug];
  if (detailed) return detailed;

  const preview = catalogFallbacks[slug];
  if (!preview) return defaultProduct;

  return {
    ...defaultProduct,
    name: preview.name,
    price: preview.price,
    use: preview.use,
    description: `${preview.name} из переработанного пластика. Доступна кастомизация цвета, размера и тиража под проект.`,
  };
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

  return (
    <>
      <section style={{ padding: "60px 20px 80px" }}>
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb */}
          <div className="text-[13px] mb-8" style={{ opacity: 0.4 }}>
            <Link href="/">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/catalog">Каталог</Link>
            <span className="mx-2">/</span>
            <span style={{ opacity: 0.8 }}>{p.name}</span>
          </div>

          <div className="md:grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image placeholder */}
            <div>
              <div
                className="flex items-center justify-center mb-3"
                style={{ aspectRatio: "1", background: "#F5F5F5", border: "1px solid rgba(23,21,19,0.1)" }}
              >
                <span className="text-[14px]" style={{ opacity: 0.2 }}>Фотография изделия</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center"
                    style={{ aspectRatio: "1", background: "#F5F5F5", border: "1px solid rgba(23,21,19,0.08)" }}
                  >
                    <span className="text-[10px]" style={{ opacity: 0.2 }}>{i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              <h1
                className="font-bold mb-3"
                style={{ fontFamily: D, fontSize: "clamp(28px, 3vw, 36px)", letterSpacing: "-1px", lineHeight: 1.05 }}
              >
                {p.name}
              </h1>
              <p className="text-[13px] mb-4" style={{ opacity: 0.4 }}>{p.use}</p>
              <p className="text-[24px] font-bold mb-6" style={{ fontFamily: D }}>{p.price}</p>

              <p className="text-[15px] leading-[1.6] mb-8" style={{ opacity: 0.6 }}>
                {p.description}
              </p>

              {/* Specs */}
              <div className="pt-5 space-y-3 mb-8" style={{ borderTop: "1px solid rgba(23,21,19,0.15)" }}>
                {[
                  ["Размеры", p.sizes],
                  ["Цвета", p.colors],
                  ["Кастомизация", p.customizable],
                  ["Мин. партия", p.moq],
                  ["Срок", p.lead],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-[14px]">
                    <span style={{ opacity: 0.4 }}>{label}</span>
                    <span style={{ opacity: 0.75 }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-8">
                {p.features.map((f) => (
                  <span
                    key={f}
                    className="text-[12px] px-3 py-1.5"
                    style={{ border: "1px solid rgba(23,21,19,0.12)", opacity: 0.6 }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacts"
                  className="rounded-pill inline-block text-[15px] font-bold px-8 py-3 text-center"
                  style={{ background: "#171513", color: "#fff", fontFamily: D }}
                >
                  Запросить стоимость
                </Link>
                <Link
                  href="/contacts"
                  className="rounded-pill inline-block text-[15px] font-bold px-8 py-3 text-center"
                  style={{ border: "2px solid #171513", fontFamily: D }}
                >
                  Заказать партию
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section style={{ padding: "60px 20px", background: "#F5F5F5" }}>
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-[24px] font-bold mb-8" style={{ fontFamily: D, letterSpacing: "-0.5px" }}>
            Смотрите также
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(productsData)
              .filter(([s]) => s !== slug)
              .slice(0, 4)
              .map(([s, item]) => (
                <Link
                  key={s}
                  href={`/catalog/${s}`}
                  style={{ background: "#fff", border: "1px solid rgba(23,21,19,0.1)" }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ aspectRatio: "4/3", background: "#F5F5F5" }}
                  >
                    <span className="text-[11px]" style={{ opacity: 0.2 }}>Фото</span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-[14px] font-bold mb-1">{item.name}</h3>
                    <span className="text-[13px]" style={{ opacity: 0.5 }}>{item.price}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
