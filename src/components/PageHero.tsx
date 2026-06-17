import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Единый герой внутренних страниц — по Figma «collection-hero» (4:7967).
 * Слева: крупный Chalet-заголовок (сверху) + лид (прижат к низу), вертикальный хайрлайн.
 * Справа: большое фото на всю высоту блока. Снизу всего блока — хайрлайн.
 * Используется на всех страницах, кроме главной.
 */
export function PageHero({
  title,
  lead,
  image,
  imageAlt = "",
  cta,
}: {
  title: string;
  lead?: string;
  image: string;
  imageAlt?: string;
  cta?: ReactNode;
}) {
  return (
    <section className="px-[var(--site-margins)] border-b border-[#171513] pt-1 lg:pt-2">
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-5">
          {/* Текст: заголовок сверху, лид снизу */}
          <div className="lg:col-span-5 lg:border-r border-[#171513] flex flex-col pt-5 pb-5 lg:pr-5">
            <h1
              className="font-bold text-[#171513]"
              style={{
                fontFamily: "'Chalet', 'Gramatika', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(44px, 6vw, 79px)",
                lineHeight: 1.05,
                letterSpacing: "-1.6px",
              }}
            >
              {title}
            </h1>
            {(lead || cta) && (
              <div className="mt-10 lg:mt-auto lg:pt-10">
                {lead && (
                  <p
                    className="text-[#171513] max-w-[340px]"
                    style={{ fontFamily: "'Gramatika', sans-serif", fontSize: "14.6px", lineHeight: "20px" }}
                  >
                    {lead}
                  </p>
                )}
                {cta && <div className="mt-5">{cta}</div>}
              </div>
            )}
          </div>

          {/* Фото */}
          <div className="lg:col-span-7 pt-0 lg:pt-5 pb-5">
            <div className="relative w-full overflow-hidden h-[300px] sm:h-[420px] lg:h-[72vh] lg:max-h-[640px] lg:min-h-[440px]">
              <Image src={image} alt={imageAlt} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
