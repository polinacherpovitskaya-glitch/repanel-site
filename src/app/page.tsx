"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import { FAQ } from "@/components/FAQ";

/* ── Data ── */

const faqItems = [
  { question: "Можно ли купить только панели?", answer: "Да, мы поставляем листовой материал для вашего производства или подрядчика. Форматы: 1000×1000 и 1100×2100 мм, толщина 12–30 мм." },
  { question: "Делаете ли вы объекты под ключ?", answer: "Да. Мы проектируем и производим готовые решения: стойки, мебель, торговое оборудование, бренд-объекты и элементы интерьера." },
  { question: "Можно ли кастомизировать цвет?", answer: "Есть базовая палитра из 12 цветов и возможность создать кастомный цвет под проект. Рекомендуем начать с заказа образцов." },
  { question: "Есть ли минимальная партия?", answer: "Зависит от формата работы. Для листового материала — от нескольких панелей. Для готовых изделий обсуждаем индивидуально." },
  { question: "Как получить расчёт?", answer: "Отправьте бриф через форму на сайте или напишите в Telegram. Мы ответим в течение рабочего дня." },
  { question: "Можно ли посмотреть материал вживую?", answer: "Да. Закажите образцы (бесплатно для архитекторов в МО) или приезжайте на производство по предварительной договорённости." },
];

const directions = [
  { title: "Панели", desc: "Листовой материал. От 3 дней.", href: "/material", img: "/images/direction-panels.jpg" },
  { title: "Готовые решения", desc: "Стойки, столы, стеллажи. Готовая цена.", href: "/solutions", img: "/images/direction-solutions.jpg" },
  { title: "Магазин", desc: "Из каталога с быстрой доставкой.", href: "/catalog", img: "/images/direction-shop.jpg" },
  { title: "Проекты под ключ", desc: "От обмеров до монтажа.", href: "/contacts", img: "/images/direction-projects.jpg" },
];

const fears = [
  { objection: "«Пластик — это дёшево и непрезентабельно»", answer: "RePanel выглядит и ощущается как терраццо или камень. Каждая панель уникальна по текстуре — это не принт, а структура самого материала.", img: "/images/why-texture.jpg" },
  { objection: "«Переработанный = ненадёжный»", answer: "ЕАС-сертифицированный материал. Выдерживает воду, УФ и механические нагрузки. Срок службы — десятилетия.", img: "/images/why-reliable.jpg" },
  { objection: "«Сложно интегрировать в проект»", answer: "Обрабатывается стандартным столярным инструментом. Режется, фрезеруется, клеится. Мы даём чертежи и техподдержку.", img: "/images/why-easy.jpg" },
  { objection: "«Долго ждать и непонятно по цене»", answer: "Стандартные панели — от 3 дней. Готовые решения — от 1 недели. Прозрачное ценообразование с первого запроса.", img: "/images/why-fast.jpg" },
];

const whereWorks = [
  { label: "Столешницы", img: "/images/sposoby/a-modern-kitchen-counter-close-up-shot--countertop.png" },
  { label: "Кухонные фасады", img: "/images/sposoby/a-modern-kitchen-sink-area--slight-3-4-angle-shot-.png" },
  { label: "Ванные комнаты", img: "/images/sposoby/bathroom-countertop-close-up--slight-angle--counte.png" },
  { label: "Стеновые панели", img: "/images/sposoby/large-translucent-recycled-plastic-panel-wall--low.png" },
  { label: "Мебель и объекты", img: "/images/sposoby/three-modular-lounge-chairs-made-entirely-of-flat-.png" },
  { label: "Ритейл и HoReCa", img: "/images/sposoby/a-bright--modern-boutique-interior-for-a-sustainab.png" },
  { label: "Офисные пространства", img: "/images/sposoby/open-plan-office-interior--freestanding-room-divid.png" },
  { label: "Городская среда", img: "/images/DSC02233.jpg" },
  { label: "Переговорные", img: "/images/sposoby/--prompt-------a-modern-loft-style-meeting-room-in.png" },
  { label: "Урны и контейнеры", img: "/images/sposoby/a-single-modern-waste-bin-on-small-black-wheels--r.png" },
  { label: "Подоконники и откосы", img: "/images/sposoby/interior-architectural-detail-of-a-window-wall--wi.png" },
  { label: "Гостиницы и спальни", img: "/images/sposoby/minimalist-hotel-bedroom-interior--large-wall-moun.png" },
  { label: "Лестницы", img: "/images/sposoby/modern-interior-staircase--straight-on-side-angle-.png" },
  { label: "Барные стулья", img: "/images/sposoby/two-round-bar-stools-shot-from-above-at-slight-ang.png" },
  { label: "Раздевалки и фитнес", img: "/images/sposoby/a-modern-gym-changing-room-interior--long-vanity-c.png" },
];

const cases = [
  { name: "PACE", desc: "Тираж из переработанного пластика для крупнейшего российского девелопера.", photos: ["/images/07.jpg", "/images/04.jpg", "/images/05.jpg"], slug: "samolet" },
  { name: "Drinkit", desc: "Стеновые панели, перегородки и декоративные элементы для сети кофеен.", photos: ["/images/DSC09441.jpg", "/images/DSC09389.jpg", "/images/DSC09429.jpg"], slug: "drinkit" },
  { name: "LAMODA", desc: "Ресепшен, столешницы, полки — всё из одного материала.", photos: ["/images/photo_2025-09-09 10.10.09.jpeg", "/images/photo_2025-09-09 10.10.08.jpeg", "/images/photo_2025-09-09 10.10.10.jpeg"], slug: "lamoda" },
  { name: "ЖК Lucky", desc: "Безопасные и долговечные элементы детской площадки.", photos: ["/images/DSC02233.jpg", "/images/DSC02232.jpg", "/images/DSC02247.jpg"], slug: "lucky" },
];

const trustClients = ["САМОЛЕТ", "Drinkit", "RIPPle", "ВКУСВИЛЛ", "Кофемания", "СКОЛКОВО", "Яндекс", "ПИК"];

const marqueeCSS = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

export default function Home() {
  /* ── Drag-scroll for "where works" carousel ── */
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const autoRef = useRef<number>(0);
  const [autoPaused, setAutoPaused] = useState(false);

  const startAutoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tick = () => {
      if (!isDragging.current && !autoPaused) {
        el.scrollLeft += 0.5;
        // Loop back when reaching half (duplicated content)
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      autoRef.current = requestAnimationFrame(tick);
    };
    autoRef.current = requestAnimationFrame(tick);
  }, [autoPaused]);

  useEffect(() => {
    startAutoScroll();
    return () => cancelAnimationFrame(autoRef.current);
  }, [startAutoScroll]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    scrollRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - dx;
  };
  const onPointerUp = () => { isDragging.current = false; };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeCSS }} />

      {/* ═══ 1. HERO (untouched) ═══ */}
      <section style={{ padding: "0 20px" }}>
        <div
          style={{
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px - 40px)",
            zIndex: 0,
            display: "flex",
            gap: 16,
          }}
        >
          <div className="relative flex-1 overflow-hidden">
            <Image src="/images/ro0151.jpg" alt="RePanel" fill sizes="100vw" className="object-cover" priority />
          </div>
          <div className="relative flex-1 overflow-hidden hidden md:block">
            <Image src="/images/ro0184.jpg" alt="RePanel" fill sizes="33vw" className="object-cover" priority />
          </div>
          <div className="relative flex-1 overflow-hidden hidden lg:block">
            <Image src="/images/ro0164.jpg" alt="RePanel" fill sizes="33vw" className="object-cover" priority />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: "calc(-24.02vw + 1.6px)",
          }}
        >
          <img src="/logo/repanel.svg" alt="RePanel" style={{ display: "block", width: "100%", height: "auto" }} />
          <img src="/logo/subtitle.svg" alt="Панели из переработанного пластика" style={{ display: "block", width: "100%", height: "auto", marginTop: 8 }} />
          <div style={{ height: "100vh" }} />
        </div>
      </section>

      {/* ── Divider between hero and directions ── */}
      <div className="px-[var(--site-margins)] py-5">
        <div className="w-full h-px bg-[#171513]" />
      </div>

      {/* ═══ 2. ЧЕТЫРЕ НАПРАВЛЕНИЯ ═══ */}
      <section className="px-[var(--site-margins)] pt-10 lg:pt-14 pb-8 lg:pb-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold font-[Montserrat] text-[#171513] mb-5 lg:mb-8"
            style={{ fontSize: "clamp(28px, 9vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Четыре направления работы
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {directions.map((d) => (
              <Link
                key={d.title}
                href={d.href}
                className="group/card block overflow-hidden"
              >
                <div className="relative overflow-hidden aspect-square bg-[#171513]">
                  <Image
                    src={d.img}
                    alt={d.title}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                  />
                </div>
                <div className="px-3 lg:px-4 pb-2 lg:pb-3 pt-1.5 lg:pt-2">
                  <h3 className="text-[13px] lg:text-[16px] font-bold font-[Montserrat] text-[#171513] leading-tight">{d.title}</h3>
                  <p className="text-[13px] lg:text-[16px] text-[#171513] leading-tight mt-0.5">{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. ПОЧЕМУ ЭТО РАБОТАЕТ ═══ */}
      <section className="px-[var(--site-margins)] pt-8 pb-8 lg:pb-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold font-[Montserrat] text-[#171513] mb-5 lg:mb-8"
            style={{ fontSize: "clamp(28px, 9vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Почему это работает
          </h2>
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0">
            {fears.map((f, i) => (
              <div key={i} className="border-t border-[#171513] py-5 lg:py-6 lg:pr-8 flex gap-4 lg:gap-5 items-start">
                <div className="shrink-0 w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] relative">
                  <Image src={f.img} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] lg:text-[18px] leading-[1.4] text-[#171513] font-[Montserrat] font-bold mb-2 lg:mb-3">
                    {f.objection}
                  </p>
                  <p className="text-[14px] lg:text-[16px] leading-[1.5] text-[#171513]">
                    {f.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. ГДЕ РАБОТАЕТ — draggable + auto-scroll carousel ═══ */}
      <section className="pt-8 pb-8 lg:pb-12">
        <div className="px-[var(--site-margins)] mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold font-[Montserrat] text-[#171513] mb-5 lg:mb-8"
            style={{ fontSize: "clamp(28px, 9vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Где работает материал
          </h2>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ gap: 12, paddingLeft: "var(--site-margins)", paddingRight: "var(--site-margins)", scrollbarWidth: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onMouseEnter={() => setAutoPaused(true)}
          onMouseLeave={() => setAutoPaused(false)}
        >
          {[...whereWorks, ...whereWorks].map((w, i) => (
            <div
              key={`${w.label}-${i}`}
              className="shrink-0 flex flex-col overflow-hidden w-[calc(50vw-16px)] lg:w-[calc((100vw-100px)/5)]"
              style={{ userSelect: "none" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={w.img} alt={w.label} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover pointer-events-none" draggable={false} />
              </div>
              <div className="px-2 lg:px-4 pb-2 lg:pb-3 pt-1.5 lg:pt-2">
                <span className="text-[13px] lg:text-[16px] font-bold font-[Montserrat] text-[#171513]">{w.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 5. КЕЙСЫ ═══ */}
      <section className="px-[var(--site-margins)] pt-8 pb-0">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold font-[Montserrat] text-[#171513] mb-5 lg:mb-8"
            style={{ fontSize: "clamp(28px, 9vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Кейсы
          </h2>

          <div className="flex flex-col">
            {cases.map((c) => (
              <Link
                key={c.name}
                href={`/projects/${c.slug}`}
                className="group block border-t border-[#171513] pt-5 lg:pt-6 pb-6 lg:pb-8"
              >
                {/* ── MOBILE: stacked layout ── */}
                <div className="lg:hidden">
                  <h3 className="text-[clamp(28px,9vw,44px)] font-bold font-[Montserrat] text-[#171513] leading-none tracking-[-0.03em] mb-2">
                    {c.name}
                  </h3>
                  <p className="text-[14px] leading-[1.5] text-[#171513] mb-3">{c.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative overflow-hidden bg-[#171513] aspect-[3/4]">
                      <Image src={c.photos[0]} alt={c.name} fill sizes="50vw" className="object-cover" />
                    </div>
                    <div className="relative overflow-hidden bg-[#171513] aspect-[3/4]">
                      <Image src={c.photos[1]} alt={c.name} fill sizes="50vw" className="object-cover" />
                    </div>
                  </div>
                </div>

                {/* ── DESKTOP: row 1 = title + desc aligned, row 2 = 3 photos ── */}
                <div className="hidden lg:block">
                  {/* Text row: title (1/3) + desc (2/3), aligned at bottom */}
                  <div className="flex items-end mb-2" style={{ gap: 16 }}>
                    <h3 className="flex-1 text-[clamp(28px,3.5vw,52px)] font-bold font-[Montserrat] text-[#171513] leading-none tracking-[-0.03em]">
                      {c.name}
                    </h3>
                    <p className="flex-[2] text-[16px] leading-[1.5] text-[#171513]">{c.desc}</p>
                  </div>
                  {/* Photos row: 3 equal columns */}
                  <div className="flex" style={{ gap: 16 }}>
                    <div className="relative overflow-hidden flex-1 bg-[#171513]" style={{ aspectRatio: "3/4" }}>
                      <Image src={c.photos[0]} alt={c.name} fill sizes="33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="relative overflow-hidden flex-1 bg-[#171513]" style={{ aspectRatio: "3/4" }}>
                      <Image src={c.photos[1]} alt={c.name} fill sizes="33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="relative overflow-hidden flex-1 bg-[#171513]" style={{ aspectRatio: "3/4" }}>
                      <Image src={c.photos[2]} alt={c.name} fill sizes="33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. ДОВЕРИЕ — gray logos, no borders ═══ */}
      <section className="overflow-hidden py-5 lg:py-6">
        <div
          className="flex items-center"
          style={{ animation: "marquee 20s linear infinite", width: "max-content", gap: 32 }}
        >
          {[...trustClients, ...trustClients, ...trustClients].map((name, i) => (
            <span key={`${name}-${i}`} className="text-[clamp(22px,6vw,52px)] font-bold font-[Montserrat] tracking-[-0.03em] whitespace-nowrap"
              style={{ color: "#C0C0C0" }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ 7. СМОТРЕТЬ ВСЕ КЕЙСЫ ═══ */}
      <section className="px-[var(--site-margins)] pb-8 lg:pb-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <Link
            href="/projects"
            className="font-bold font-[Montserrat] text-[#171513] underline underline-offset-4 hover:opacity-60 transition-opacity inline-block"
            style={{ fontSize: "clamp(22px,6vw,52px)", letterSpacing: "-0.03em" }}
          >
            Смотреть все кейсы →
          </Link>
        </div>
      </section>

      {/* ═══ 8. ВЫБЕРИТЕ СВОЙ ПУТЬ ═══ */}
      <section className="px-[var(--site-margins)] pt-8 pb-8 lg:pb-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold font-[Montserrat] text-[#171513] mb-5 lg:mb-8"
            style={{ fontSize: "clamp(28px, 9vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Выберите свой путь
          </h2>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
            {[
              { title: "Архитекторам", desc: "Образцы, техкарты, чертежи и поддержка на каждом этапе проекта. Бесплатная доставка образцов в МО.", href: "/for-architects", link: "Подробнее →" },
              { title: "Производителям", desc: "Листовой материал для вашего производства. Стабильные поставки, 12 базовых цветов, кастом.", href: "/material", link: "О материале →" },
              { title: "Готовые решения", desc: "Каталог изделий с фиксированной ценой и доставкой. Стойки, мебель, декор.", href: "/catalog", link: "Каталог →" },
            ].map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="block border border-[#171513] p-[5px] transition-all duration-200"
                style={{ textDecoration: "none", borderRadius: 20 }}
                onMouseEnter={(e) => {
                  const inner = e.currentTarget.querySelector("[data-inner]") as HTMLElement;
                  if (inner) { inner.style.backgroundColor = "#171513"; }
                  e.currentTarget.querySelectorAll("[data-txt]").forEach((t) => { (t as HTMLElement).style.color = "#FFFFFF"; });
                }}
                onMouseLeave={(e) => {
                  const inner = e.currentTarget.querySelector("[data-inner]") as HTMLElement;
                  if (inner) { inner.style.backgroundColor = ""; }
                  e.currentTarget.querySelectorAll("[data-txt]").forEach((t) => { (t as HTMLElement).style.color = "#171513"; });
                }}
              >
                <div data-inner className="flex flex-col justify-between p-5 lg:p-7 h-full transition-colors duration-200"
                  style={{ borderRadius: 14 }}>
                  <div>
                    <h3 data-txt className="font-bold font-[Montserrat] leading-none tracking-[-0.03em] mb-3 lg:mb-4 transition-colors duration-200"
                      style={{ fontSize: "clamp(22px,6vw,36px)", color: "#171513" }}>
                      {a.title}
                    </h3>
                    <p data-txt className="text-[14px] lg:text-[16px] leading-[1.5] transition-colors duration-200"
                      style={{ color: "#171513" }}>
                      {a.desc}
                    </p>
                  </div>
                  <span data-txt className="text-[14px] lg:text-[16px] font-bold font-[Montserrat] mt-5 lg:mt-8 inline-block transition-colors duration-200"
                    style={{ color: "#171513" }}>
                    {a.link}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. FAQ ═══ */}
      <section className="px-[var(--site-margins)] pt-8 pb-8 lg:pb-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* ═══ 10. ФИНАЛЬНЫЙ CTA ═══ */}
      <section className="px-[var(--site-margins)] py-10 lg:py-20">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold font-[Montserrat] text-[#171513]"
            style={{ fontSize: "clamp(28px, 9vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Не знаете с чего начать?<br />Опишите задачу — подберём формат.
          </h2>

          <div className="mt-6 lg:mt-8 flex flex-col gap-4 lg:flex-row lg:gap-6">
            <Link
              href="/contacts"
              className="text-[15px] lg:text-[16px] font-bold font-[Montserrat] text-[#171513] underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Запросить расчёт →
            </Link>
            <a
              href="https://t.me/repanel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] lg:text-[16px] font-bold font-[Montserrat] text-[#171513] underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Написать в Телеграм →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
