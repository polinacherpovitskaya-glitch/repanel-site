import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { FinalCTA } from "@/components/FinalCTA";
import { Group } from "@/components/blocks";
import { ProductDetail } from "@/components/ProductDetail";
import { supabaseAdmin } from "@/lib/server-db";
import type { Product } from "@/lib/supabase";

const BODY = "'Gramatika', sans-serif";
const DISPLAY = "'Chalet', 'Gramatika', sans-serif";

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as Product) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  return {
    title: p ? `${p.title} — RePanel` : "Товар — RePanel",
    description: p?.description ?? "Изделие из переработанного полистирола RePanel.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <section className="px-[var(--site-margins)] pt-32 pb-32 text-center">
        <h1 className="font-bold text-[#171513]" style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,4vw,48px)" }}>Товар не найден</h1>
        <div className="mt-6 flex justify-center">
          <Link href="/catalog" className="font-bold underline" style={{ fontFamily: BODY }}>← В магазин</Link>
        </div>
      </section>
    );
  }

  const db = supabaseAdmin();
  const { data: relatedRaw } = await db
    .from("products")
    .select("id, slug, title, price, image_url")
    .eq("is_published", true)
    .neq("id", product.id)
    .order("sort_order", { ascending: false })
    .limit(5);
  const related = (relatedRaw ?? []).filter((r) => r.slug).slice(0, 4);

  return (
    <>
      <section className="px-[var(--site-margins)] pt-8 lg:pt-12">
        <div className="mx-auto" style={{ maxWidth: 1440 }}>
          <div className="mb-8" style={{ fontFamily: BODY, fontSize: "13px", opacity: 0.45 }}>
            <Link href="/" className="hover:opacity-60">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/catalog" className="hover:opacity-60">Магазин</Link>
            <span className="mx-2">/</span>
            <span style={{ opacity: 0.8 }}>{product.title}</span>
          </div>

          <ProductDetail product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <Group title="Смотрите также">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5">
            {related.map((r) => (
              <Link key={r.id} href={`/catalog/${r.slug}`} className="group/card flex flex-col bg-white" style={{ border: "1px solid rgba(23,21,19,0.1)" }}>
                <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ aspectRatio: "4 / 3", background: "#EAEAE7" }}>
                  {r.image_url ? (
                    <Image src={r.image_url} alt={r.title} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-contain p-4" />
                  ) : (
                    <span style={{ fontFamily: BODY, fontSize: 12, opacity: 0.3 }}>Фото</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="relative inline-block" style={{ color: "#171513", fontFamily: BODY, fontWeight: 700, fontSize: "14.5px", lineHeight: 1.25 }}>
                    {r.title}
                    <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 group-hover/card:w-full transition-[width] duration-300 ease-out" style={{ background: "#66704D" }} />
                  </h3>
                  <p style={{ color: "#171513", fontFamily: BODY, fontWeight: 700, fontSize: "14px", marginTop: 6 }}>{r.price.toLocaleString("ru-RU")} ₽</p>
                </div>
              </Link>
            ))}
          </div>
        </Group>
      )}

      <FinalCTA heading="Нужен этот предмет под проект?" text="Адаптируем цвет, размер и тираж — или разработаем новое изделие с нуля." />
    </>
  );
}
