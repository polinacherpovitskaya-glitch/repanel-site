import type { Metadata } from "next";
import Image from "next/image";
import { FinalCTA } from "@/components/FinalCTA";
import { appCats } from "@/data/applications";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Где применяют RePanel — применения переработанного полистирола",
  description:
    "Где применяют панели RePanel: интерьеры, HoReCa, ритейл, офисы. Кухонные острова, столешницы, фартуки, стеновые панели, барные стойки, примерочные и десятки других сценариев.",
};

export default function ApplicationsPage() {
  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-4 lg:pb-6">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(32px, 5.3vw, 75.5px)", lineHeight: 1.05, letterSpacing: "-0.021em" }}>
            Где применяют
          </h1>
          <p className="mt-3 lg:mt-4 text-[#171513] max-w-[680px]" style={{ fontFamily: BODY, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.45, opacity: 0.6 }}>
            RePanel заменяет камень, терраццо и ламинат — от кухонных островов и столешниц до стеновых панелей, барных стоек и торгового оборудования. Несколько десятков сценариев по категориям.
          </p>

          {/* Якоря категорий */}
          <div className="flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-2 mt-7 lg:mt-9">
            {appCats.map((c) => (
              <a key={c.key} href={`#${c.key}`} className="group/anchor relative pb-1.5 text-[#171513]" style={{ fontFamily: BODY, fontWeight: 700, fontSize: "clamp(14.5px, 1.4vw, 17px)", letterSpacing: "-0.01em" }}>
                {c.title}
                <span className="text-[#171513]" style={{ opacity: 0.4, fontWeight: 400, marginLeft: 5 }}>{c.count}</span>
                <span className="absolute left-0 bottom-0 h-[2px] w-0 group-hover/anchor:w-full transition-[width] duration-300 ease-out" style={{ background: "#66704D" }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {appCats.map((cat) => (
        <section key={cat.key} id={cat.key} className="px-[var(--site-margins)] pt-8 lg:pt-12 pb-6 lg:pb-10" style={{ scrollMarginTop: 90 }}>
          <div className="mx-auto" style={{ maxWidth: 1440 }}>
            <h2 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              {cat.title}
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: "0.27em", letterSpacing: "-0.02em", marginLeft: "0.1em", position: "relative", top: "-1.75em", display: "inline-block" }}>({cat.count})</span>
            </h2>

            {cat.spaces.map((sp) => (
              <div key={sp.space} className="mt-7 lg:mt-9">
                <h3 className="text-[#171513] mb-3 lg:mb-4" style={{ fontFamily: BODY, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45 }}>{sp.space}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
                  {sp.items.map((it) => (
                    <div key={it.img} className="group/tile block">
                      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                        <Image src={it.img} alt={it.cap} fill sizes="(min-width:1024px) 23vw, 45vw" quality={95} className="object-cover transition-transform duration-500 ease-out group-hover/tile:scale-[1.04]" />
                      </div>
                      <p className="text-[#171513] mt-2" style={{ fontFamily: BODY, fontSize: "13.5px", lineHeight: 1.25, fontWeight: 700 }}>{it.cap}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <FinalCTA heading="Не нашли свой сценарий?" text="Покажем образцы и предложим решение под вашу задачу — от листа до готового изделия." />
    </>
  );
}
