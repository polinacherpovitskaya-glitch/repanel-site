"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

/* ── Data ── */

const directions = [
  { title: "Панели", caption: "Листы из переработанного пластика, палитра и образцы.", href: "/material", img: "/images/ill-panely.jpg" },
  { title: "Готовые решения", caption: "HoReCa, торговое оборудование, готовая мебель.", href: "/solutions", img: "/images/ill-resheniya.jpg" },
  { title: "Магазин", caption: "Готовые предметы из переработанного пластика.", href: "/catalog", img: "/images/ill-magazin.jpg" },
  { title: "Проект под ключ", caption: "Интерьеры под ключ — от замера до монтажа.", href: "/contacts", img: "/images/ill-proekt.jpg" },
];

const applications = [
  { title: "Кухонные фасады", href: "/material", img: "/images/sposoby/sp-kitchen.png" },
  { title: "Фартуки на кухню", href: "/material", img: "/images/sposoby/sp-backsplash.png" },
  { title: "Мебель для ванной", href: "/material", img: "/images/sposoby/sp-bathroom.png" },
  { title: "Подоконники", href: "/material", img: "/images/sposoby/sp-windowsill.png" },
  { title: "Стеновые панели", href: "/material", img: "/images/sposoby/sp-wall.png" },
  { title: "Изголовья кроватей", href: "/material", img: "/images/sposoby/sp-headboard.png" },
  { title: "Городская среда", href: "/material", img: "/images/sposoby/sp-urban.png" },
  { title: "Офисные столешницы", href: "/material", img: "/images/sposoby/sp-office.png" },
];

const shopProducts = [
  { name: "Приставной столик", price: "12 900", img: "/images/shop/shop-stolik.png", badge: "Хит" },
  { name: "Настольные часы", price: "4 500", img: "/images/shop/shop-chasy.png" },
  { name: "Лошадка-качалка", price: "8 900", img: "/images/shop/shop-loshadka.png", badge: "Хит" },
  { name: "Стул-стремянка", price: "9 900", img: "/images/shop/shop-stremianka.png" },
  { name: "Табурет", price: "7 500", img: "/images/shop/shop-taburet.png", badge: "Новинка" },
  { name: "Скамья", price: "14 900", img: "/images/shop/shop-skameika.png" },
];

const productColors = ["#E8A33D", "#F3EFE6", "#171513", "#C9B79A", "#5A6647", "#3C4657", "#16233D"];

const cases = [
  { name: "PACE", desc: "Тираж из переработанного пластика для крупнейшего российского девелопера.", photos: ["/images/07.jpg", "/images/04.jpg", "/images/05.jpg"], slug: "samolet" },
  { name: "Drinkit", desc: "Стеновые панели, перегородки и декоративные элементы для сети кофеен.", photos: ["/images/DSC09441.jpg", "/images/DSC09389.jpg", "/images/DSC09429.jpg", "/images/DSC09459.jpg"], slug: "drinkit" },
  { name: "LAMODA", desc: "Ресепшен, столешницы, полки — всё из одного материала.", photos: ["/images/photo_2025-09-09 10.10.09.jpeg", "/images/photo_2025-09-09 10.10.08.jpeg", "/images/photo_2025-09-09 10.10.10.jpeg", "/images/photo_2025-09-09 10.08.38.jpeg"], slug: "lamoda" },
  { name: "ЖК Lucky", desc: "Безопасные и долговечные элементы детской площадки.", photos: ["/images/DSC02233.jpg", "/images/DSC02232.jpg", "/images/DSC02247.jpg", "/images/DSC02231.jpg"], slug: "lucky" },
];

const trustClients = ["САМОЛЕТ", "Drinkit", "RIPPle", "ВКУСВИЛЛ", "Кофемания", "СКОЛКОВО", "Яндекс", "ПИК"];

const marqueeCSS = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

/* Наборы кадров для героя — листаются за курсором (влево-вправо) */
const MAT_HERO = Array.from({ length: 7 }, (_, i) => `/images/hero/mat-${i + 1}.jpg`);
const MAG_HERO = Array.from({ length: 7 }, (_, i) => `/images/hero/mag-${i + 1}.jpg`);

export default function Home() {
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const heroIntroRef = useRef<HTMLDivElement>(null);
  const [matIdx, setMatIdx] = useState(0);
  const [magIdx, setMagIdx] = useState(0);

  /* Hero «занавес»: логотип уезжает вверх, интро — вниз, проявляя фото и подписи */
  useEffect(() => {
    const logo = heroLogoRef.current;
    const intro = heroIntroRef.current;
    const labels = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-label]"));
    const onScroll = () => {
      const y = window.scrollY;
      if (logo) logo.style.transform = `translateY(${-y * 0.9}px)`;
      if (intro) intro.style.transform = `translateY(${y * 0.9}px)`;
      // подписи «Материал»/«Магазин» проступают по мере раскрытия
      const o = Math.min(1, Math.max(0, (y - 20) / 240));
      labels.forEach((l) => { l.style.opacity = String(o); });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeCSS }} />

      {/* ═══ 1. HERO — Figma: 2 фото + гигантский белый логотип поверх ═══ */}
      <section className="relative" style={{ backgroundColor: "#171513" }}>
        {/* Sticky hero: две половины — Материал (слева) и Магазин (справа) */}
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden">
          {/* МАТЕРИАЛ */}
          <Link
            href="/material"
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setMatIdx(Math.min(MAT_HERO.length - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * MAT_HERO.length)))); }}
            className="group relative flex-1 overflow-hidden block"
          >
            {MAT_HERO.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Материал RePanel — переработанный полистирол"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                priority={i === 0}
                quality={90}
                className="object-cover transition-opacity duration-200 ease-out"
                style={{ objectPosition: "center 50%", opacity: i === matIdx ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span data-hero-label className="relative" style={{ opacity: 0, fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 4.6vw, 68px)", letterSpacing: "-0.02em", color: "#FFFFFF", textShadow: "0 2px 34px rgba(0,0,0,0.5)" }}>
                Материал
                <span className="absolute left-0 bottom-0.5 h-[4px] bg-[#FFFFFF] w-0 group-hover:w-full transition-[width] duration-[450ms] ease-out" />
              </span>
            </div>
          </Link>
          {/* МАГАЗИН */}
          <Link
            href="/catalog"
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setMagIdx(Math.min(MAG_HERO.length - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * MAG_HERO.length)))); }}
            className="group relative flex-1 overflow-hidden block"
          >
            {MAG_HERO.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Магазин RePanel — готовые изделия"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                priority={i === 0}
                quality={90}
                className="object-cover transition-opacity duration-200 ease-out"
                style={{ objectPosition: "center 50%", opacity: i === magIdx ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span data-hero-label className="relative" style={{ opacity: 0, fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 4.6vw, 68px)", letterSpacing: "-0.02em", color: "#FFFFFF", textShadow: "0 2px 34px rgba(0,0,0,0.5)" }}>
                Магазин
                <span className="absolute left-0 bottom-0.5 h-[4px] bg-[#FFFFFF] w-0 group-hover:w-full transition-[width] duration-[450ms] ease-out" />
              </span>
            </div>
          </Link>

          {/* Top scrim — читаемость навигации */}
          <div
            className="absolute top-0 left-0 right-0 z-[5] pointer-events-none"
            style={{ height: "42%", background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0))" }}
          />
          {/* Bottom scrim — читаемость интро */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none"
            style={{ height: "44%", background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))" }}
          />

          {/* Гигантский белый логотип «RePanel» — сверху, уезжает вверх на скролле */}
          <div
            ref={heroLogoRef}
            className="absolute left-0 right-0 z-10 pointer-events-none pt-[76px] lg:pt-[14px]"
            style={{ top: 0, paddingLeft: "var(--site-margins)", paddingRight: "var(--site-margins)", willChange: "transform" }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1430.1 / 294.4",
                backgroundColor: "#FFFFFF",
                WebkitMaskImage: "url(/logo/repanel.svg)",
                maskImage: "url(/logo/repanel.svg)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center top",
                maskPosition: "center top",
              }}
            />
          </div>

          {/* Интро — снизу героя, белым; уезжает вниз на скролле */}
          <div
            ref={heroIntroRef}
            className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none"
            style={{ paddingLeft: "var(--site-margins)", paddingRight: "var(--site-margins)", paddingBottom: "clamp(24px, 5vh, 58px)", willChange: "transform" }}
          >
            <div className="mx-auto" style={{ maxWidth: 1440 }}>
              <h2
                className="text-left lg:text-right lg:whitespace-nowrap"
                style={{
                  fontFamily: "'Chalet', 'Gramatika', sans-serif",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontSize: "clamp(32px, 5.3vw, 75.5px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.021em",
                  margin: 0,
                  textShadow: "0 2px 30px rgba(0,0,0,0.5)",
                }}
              >
                Панели из переработанного пластика...
              </h2>
            </div>
          </div>
        </div>

        {/* Длина прокрутки для хореографии «занавеса» */}
        <div style={{ height: "62vh" }} />
      </section>

      {/* ═══ 3. ЧЕТЫРЕ НАПРАВЛЕНИЯ (по Figma 1:3470) ═══ */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-10 lg:pb-16">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold text-[#171513] mb-4 lg:mb-5"
            style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Четыре направления нашей работы<span style={{ fontSize: "0.27em", fontWeight: 700, letterSpacing: "-0.02em", marginLeft: "0.06em", position: "relative", top: "-1.75em", display: "inline-block" }}>(4)</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 lg:gap-x-5 lg:gap-y-[44px]">
            {directions.map((d) => (
              <Link key={d.title} href={d.href} className="group/card block">
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={d.img}
                    alt={d.title}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
                  />
                </div>
                <div className="pt-2.5">
                  <h3
                    className="font-bold text-[#171513] inline-block relative"
                    style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "clamp(15px, 1.5vw, 18px)", letterSpacing: "-0.3px", lineHeight: 1.2 }}
                  >
                    {d.title}
                    <span className="absolute left-0 -bottom-1 h-[1.5px] bg-[#171513] w-0 group-hover/card:w-full transition-[width] duration-[450ms] ease-out" />
                  </h3>
                  <p
                    className="text-[#171513] mt-1.5"
                    style={{ fontFamily: "'Gramatika', sans-serif", fontWeight: 400, fontSize: "clamp(13.5px, 1.05vw, 15.5px)", lineHeight: 1.4, opacity: 0.5 }}
                  >
                    {d.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. ПРЕИМУЩЕСТВО МАТЕРИАЛА (по Figma 4:8885) ═══ */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-10 lg:pb-16">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold text-[#171513] mb-5 lg:mb-7"
            style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Преимущество материала
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:items-stretch">
            {/* Фото — col-span-3, высотой со список (grid-stretch), по Figma 4:8885 */}
            <div className="md:col-span-3 relative aspect-square md:aspect-auto overflow-hidden">
              <Image
                src="/images/adv-swatches.jpg"
                alt="Образцы цветов RePanel"
                fill
                sizes="(min-width:768px) 25vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* Список преимуществ — col-span-9 (по Figma 4:8885) */}
            <div className="md:col-start-4 md:col-span-9">
              {[
                { title: "Безопасный", desc: "ЕАС-сертифицированный материал. Выдерживает воду, УФ и механические нагрузки. Срок службы — десятилетия." },
                { title: "Лёгкий в обработке", desc: "Обрабатывается стандартным столярным инструментом. Режется, фрезеруется, клеится. Мы даём чертежи и техподдержку." },
                { title: "Тактильно приятный", desc: "RePanel выглядит и ощущается как терраццо или камень. Каждая панель уникальна по текстуре — это не принт, а структура самого материала." },
                { title: "Быстрые сроки производства", desc: "Стандартные панели — от 3 дней. Готовые решения — от 1 недели. Прозрачное ценообразование с первого запроса." },
              ].map((a) => (
                <div key={a.title} className="border-t border-[#171513] grid grid-cols-1 md:grid-cols-9 gap-y-1 gap-x-5 pt-3 pb-5">
                  <h3 className="md:col-span-5 font-bold text-[#171513]" style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "18.6px", lineHeight: "26.66px", letterSpacing: "-0.4px" }}>
                    {a.title}
                  </h3>
                  <p className="md:col-span-4 text-[#171513]" style={{ fontFamily: "'Gramatika', sans-serif", fontWeight: 400, fontSize: "14.6px", lineHeight: "20px" }}>
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. СПОСОБЫ ПРИМЕНЕНИЯ (по Figma 7:3371) ═══ */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-10 lg:pb-16">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold text-[#171513] mb-4 lg:mb-5"
            style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Способы применения
          </h2>
          <div className="flex gap-3 lg:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mr-[var(--site-margins)] pr-[var(--site-margins)]">
            {applications.map((d) => (
              <Link key={d.title} href={d.href} className="group/card block shrink-0 w-[clamp(240px,42vw,330px)] snap-start">
                <div className="relative overflow-hidden" style={{ aspectRatio: "455 / 606" }}>
                  <Image
                    src={d.img}
                    alt={d.title}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "rgba(255, 255, 255,0.82)" }}
                  />
                </div>
                <div className="pt-1.5">
                  <h3
                    className="font-bold text-[#171513] inline-block relative"
                    style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "clamp(15px, 1.5vw, 18px)", letterSpacing: "-0.3px", lineHeight: 1.2 }}
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

      {/* ═══ 7. КЕЙСЫ — 4 кейса, полоса из 4 вертикальных фото + подпись под ним ═══ */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-10 lg:pb-16">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h2 className="font-bold text-[#171513] mb-5 lg:mb-7"
            style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Кейсы
          </h2>

          {/* 4 кейса — каждый полоса из 4 вертикальных фото вплотную, подпись под кейсом */}
          <div className="flex flex-col gap-12 lg:gap-[84px]">
            {cases.slice(0, 4).map((c) => (
              <Link key={c.slug} href={`/projects/${c.slug}`} className="group/case block">
                <div className="grid grid-cols-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="relative overflow-hidden" style={{ aspectRatio: "455 / 606" }}>
                      <Image src={c.photos[i % c.photos.length]} alt={`${c.name} — фото ${i + 1}`} fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="pt-3 lg:pt-4">
                  <h3 className="font-bold text-[#171513] inline-block relative" style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontSize: "clamp(24px, 2.7vw, 42px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                    {c.name}
                    <span className="absolute left-0 -bottom-1 h-[2px] bg-[#171513] w-0 group-hover/case:w-full transition-[width] duration-[450ms] ease-out" />
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Смотреть все проекты — крупно, как заголовок «Магазин» */}
          <div className="mt-12 lg:mt-[84px]">
            <Link href="/projects" className="group/all inline-block relative font-bold text-[#171513]"
              style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
              Смотреть все проекты →
              <span className="absolute left-0 -bottom-1 h-[3px] bg-[#171513] w-0 group-hover/all:w-full transition-[width] duration-[450ms] ease-out" />
            </Link>
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
            <span key={`${name}-${i}`} className="text-[clamp(22px,6vw,52px)] font-bold font-[Gramatika] tracking-[-0.03em] whitespace-nowrap"
              style={{ color: "#C0C0C0" }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ 8. МАГАЗИН — сетка товаров (по Figma 4:9554) ═══ */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-12 lg:pb-20">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="border-t border-[#171513] pt-5 lg:pt-6">
            <h2 className="font-bold text-[#171513] mb-6 lg:mb-8"
              style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.8px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
              Магазин
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5">
              {shopProducts.map((p) => (
                <Link key={p.name} href="/catalog" className="group/card relative flex flex-col bg-[#EAEAE7]" style={{ border: "1px solid rgba(23,21,19,0.1)" }}>
                  {p.badge && (
                    <span className="absolute left-2.5 top-2.5 z-10 px-2 py-[3px] text-[12px] leading-[1.3]" style={{ fontFamily: "'Gramatika', sans-serif", background: "rgba(23,21,19,0.1)", color: "#171513", borderRadius: "6px" }}>{p.badge}</span>
                  )}
                  {/* лупа — появляется при наведении */}
                  <span className="absolute left-2.5 top-11 z-10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" style={{ width: 38, height: 38, borderRadius: 10, background: "#171513" }} aria-hidden>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M21 21l-5-5" /></svg>
                  </span>
                  <div className="w-full px-5 pt-7 pb-[38px]" style={{ background: "#EAEAE7" }}>
                    <div className="relative w-full aspect-square transition-transform duration-300 ease-out group-hover/card:-translate-y-2">
                      <Image src={p.img} alt={p.name} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-contain" />
                    </div>
                  </div>
                  <div className="relative w-full px-2.5 pb-2.5 pt-1">
                    <div className="transition-transform duration-300 ease-out group-hover/card:-translate-y-[26px]">
                      <p className="text-[#171513]" style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "14.4px", lineHeight: "20px", fontWeight: 700 }}>{p.name}</p>
                      <p className="text-[#171513]" style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "13.8px", lineHeight: "20px", fontWeight: 400 }}>от {p.price} ₽</p>
                    </div>
                    <div className="absolute inset-x-2.5 bottom-2.5 flex flex-wrap items-center gap-[5px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ease-out" style={{ transitionDelay: "80ms" }}>
                      {productColors.map((c, i) => (
                        <span key={i} style={{ width: 15, height: 15, borderRadius: 9999, background: c, border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0 }} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ О НАС (по Figma 12:5556 десктоп / 17:6681 мобайл) ═══ */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-12 lg:pb-16">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="border-t border-[#171513] pt-5 lg:pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="flex flex-col">
                <h2 className="font-bold text-[#171513] mb-4"
                  style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(48px, 7vw, 73px)", lineHeight: 1.05, letterSpacing: "-1.6px" }}>
                  О нас
                </h2>
                <p className="text-[#171513] max-w-[390px]"
                  style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "14.6px", lineHeight: "20px" }}>
                  RePanel превращает переработанный пластик в долговечные панели и изделия — на вид как терраццо или камень, но легче и не боятся воды. Производим в России: от сортировки сырья до решения под ключ.
                </p>
                <div className="mt-8 lg:mt-11">
                  <Link href="/about" className="group/ul relative inline-block self-start pb-[3px]"
                    style={{ fontFamily: "'Gramatika', sans-serif", fontWeight: 700, fontSize: "16px", color: "#171513" }}>
                    Подробнее →
                    <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-[#171513] origin-right scale-x-100 group-hover/ul:scale-x-0 transition-transform duration-[450ms] ease-out" />
                  </Link>
                </div>
              </div>
              <div className="relative w-full aspect-square overflow-hidden">
                <Image src="/images/DSC00437-HDR.jpg" alt="RePanel — переработанный пластик" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 9. ФИНАЛЬНЫЙ CTA — крупный акцент в стиле страницы ═══ */}
      <section className="px-[var(--site-margins)] pt-6 lg:pt-8 pb-20 lg:pb-32">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="border-t border-[#171513] pt-10 lg:pt-16">
            <h2 className="font-bold text-[#171513]"
              style={{ fontFamily: "'Chalet', 'Gramatika', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 7vw, 96px)", lineHeight: 1.0, letterSpacing: "-0.03em" }}>
              Обсудим ваш проект?
            </h2>
            <p className="text-[#171513] mt-5 lg:mt-7 max-w-[560px]"
              style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "clamp(15px, 1.3vw, 18px)", lineHeight: 1.5 }}>
              Опишите задачу — подберём материал, цвет и формат. Бесплатные образцы, чертёж и расчёт под ваш проект.
            </p>
            <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://t.me/panelpanelre"
                target="_blank"
                rel="noopener noreferrer"
                className="group/ul relative inline-block self-start pb-[3px]"
                style={{ fontFamily: "'Gramatika', sans-serif", fontWeight: 700, fontSize: "18px", color: "#171513" }}
              >
                Написать в Telegram →
                <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-[#171513] origin-right scale-x-100 group-hover/ul:scale-x-0 transition-transform duration-[450ms] ease-out" />
              </a>
              <Link
                href="/contacts"
                className="group/ul relative inline-block self-start pb-[3px]"
                style={{ fontFamily: "'Gramatika', sans-serif", fontWeight: 700, fontSize: "18px", color: "#171513" }}
              >
                Запросить расчёт →
                <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-[#171513] origin-right scale-x-100 group-hover/ul:scale-x-0 transition-transform duration-[450ms] ease-out" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
