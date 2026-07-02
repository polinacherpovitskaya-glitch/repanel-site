import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getObject, objectsByCategory } from "@/data/solutionObjects";
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
  return <ProductConfigurator object={object} />;
}
