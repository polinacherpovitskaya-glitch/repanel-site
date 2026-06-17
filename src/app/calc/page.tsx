import { getSheetPrices } from "@/lib/calc";
import { CalcNav } from "@/components/calc/CalcNav";
import { CalcLogout } from "@/components/calc/CalcLogout";
import { QuickCalc } from "@/components/calc/QuickCalc";

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

export default async function CalcEstimatePage() {
  const data = await getSheetPrices();
  return (
    <section className="px-[var(--site-margins)] pt-24 lg:pt-32 pb-24">
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.0, letterSpacing: "-0.03em" }}>Расчёт по м²</h1>
            <p className="mt-3 text-[#171513] max-w-[560px]" style={{ fontFamily: BODY, fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.5 }}>Примерный просчёт бюджета по площади. Точную смету на столешницу считает соседний раздел.</p>
          </div>
          <CalcLogout />
        </div>
        <div className="mt-8"><CalcNav active="calc" /></div>
        <div className="mt-10 lg:mt-12">
          {data ? <QuickCalc rows={data.rows} /> : <p className="text-[#171513]" style={{ fontFamily: BODY, opacity: 0.7 }}>Прайс временно недоступен.</p>}
        </div>
      </div>
    </section>
  );
}
