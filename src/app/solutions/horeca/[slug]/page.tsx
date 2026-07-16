import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getObject, objectsByCategory } from "@/data/solutionObjects";
import { getBlanksCatalog, findBlankBySlug } from "@/lib/calc";
import { ProductConfigurator } from "@/components/ProductConfigurator";

export function generateStaticParams() {
  return objectsByCategory("horeca").map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const o = getObject(slug);
  if (!o) return { title: "RePanel" };
  return { title: `${o.name} — RePanel для HoReCa`, description: o.blurb };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const object = getObject(slug);
  if (!object || object.category !== "horeca") notFound();
  // Реальные тиражи/цены из калькулятора (null, если товар ещё не опубликован или API недоступен).
  const catalog = await getBlanksCatalog();
  const calcProduct = findBlankBySlug(catalog, object.calcSlug);
  return <ProductConfigurator object={object} calcProduct={calcProduct} />;
}
