import { getSheetPrices, toSlimPrices } from "@/lib/calc";
import { CalcNav } from "@/components/calc/CalcNav";
import { CalcLogout } from "@/components/calc/CalcLogout";
import { PriceTable } from "@/components/calc/PriceTable";

const DISPLAY = "'Chalet', 'Gramatika', sans-serif";
const BODY = "'Gramatika', sans-serif";

export default async function CalcPricesPage() {
  const data = await getSheetPrices();
  return (
    <section className="px-[var(--site-margins)] pt-24 lg:pt-32 pb-24">
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.0, letterSpacing: "-0.03em" }}>Прайс-лист</h1>
            <p className="mt-3 text-[#171513] max-w-[560px]" style={{ fontFamily: BODY, fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.5 }}>Цена за лист по формату и толщине, с НДС 5 %. Раскрой, обработка и доставка из Дмитрова — отдельно.</p>
          </div>
          <CalcLogout />
        </div>
        <div className="mt-8"><CalcNav active="price" /></div>
        <div className="mt-10 lg:mt-12">
          {data ? <PriceTable rows={toSlimPrices(data)} /> : <p className="text-[#171513]" style={{ fontFamily: BODY, opacity: 0.7 }}>Прайс временно недоступен.</p>}
        </div>
      </div>
    </section>
  );
}
