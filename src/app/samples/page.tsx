import type { Metadata } from "next";
import Link from "next/link";
import { SampleSelector } from "@/components/SampleSelector";
import { FinalCTA } from "@/components/FinalCTA";

const BODY = "'Gramatika', sans-serif";

export const metadata: Metadata = {
  title: "Набор образцов RePanel — заказать образцы переработанного пластика",
  description:
    "Наборы образцов RePanel: 6, 9 или 12 цветов из переработанного полистирола. Плашки 12×6 см, срок 14 дней. Выберите цвета и оставьте заявку.",
};

export default function SamplesPage() {
  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="mb-8" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.45 }}>
            <Link href="/" className="hover:opacity-60">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/catalog" className="hover:opacity-60">Магазин</Link>
            <span className="mx-2">/</span>
            <span style={{ opacity: 0.8 }}>Набор образцов</span>
          </div>

          <SampleSelector />
        </div>
      </section>

      <FinalCTA heading="Нужен материал под проект?" text="Подберём цвет из гранул или покрасим по RAL. Рассчитаем листы и изделия под ваши задачи." />
    </>
  );
}
