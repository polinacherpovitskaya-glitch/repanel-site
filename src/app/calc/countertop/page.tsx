import { CalcNav } from "@/components/calc/CalcNav";
import { CalcLogout } from "@/components/calc/CalcLogout";
import { UnderlineLink } from "@/components/UnderlineLink";

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

export default function CalcCountertopPage() {
  return (
    <section className="px-[var(--site-margins)] pt-24 lg:pt-32 pb-24">
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.0, letterSpacing: "-0.03em" }}>Столешница</h1>
            <p className="mt-3 text-[#171513] max-w-[560px]" style={{ fontFamily: BODY, fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.5 }}>Смета на столешницу: габариты и форма → раскрой на листы → резка, кромка, склейка, опалубка.</p>
          </div>
          <CalcLogout />
        </div>
        <div className="mt-8"><CalcNav active="countertop" /></div>
        <div className="mt-10 lg:mt-12">
          <p className="text-[#171513] max-w-[560px]" style={{ fontFamily: BODY, fontSize: "16px", lineHeight: 1.5 }}>
            Полный калькулятор столешниц с раскроем — в сборке. Пока посчитаем под чертёж вручную или в рабочем калькуляторе.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-5">
            <UnderlineLink href="https://web-production-d2761c.up.railway.app/countertop" external fontSize={16}>Открыть рабочий калькулятор →</UnderlineLink>
            <UnderlineLink href="/contacts" fontSize={16}>Прислать чертёж →</UnderlineLink>
          </div>
        </div>
      </div>
    </section>
  );
}
