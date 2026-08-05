import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { siteDb } from "@/lib/server-db";
import type { Product } from "@/lib/shop-types";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = siteDb();
  const { data } = await db.from("products").select("*").eq("id", id).single();

  if (!data) {
    return (
      <AdminShell>
        <div style={{ fontFamily: BODY }}>
          <Link
            href="/admin/products"
            className="text-[13px]"
            style={{ color: "rgba(23,21,19,0.55)" }}
          >
            ← Назад к товарам
          </Link>
          <p className="mt-6 text-[15px]" style={{ color: "#c72a00" }}>
            Товар не найден
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <ProductForm mode="edit" product={data as Product} />
    </AdminShell>
  );
}
