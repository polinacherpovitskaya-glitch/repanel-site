import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { supabaseAdmin } from "@/lib/server-db";
import type { Product } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";
const INK = "#171513";
const HAIRLINE = "rgba(23,21,19,0.15)";

export default async function AdminProductsPage() {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <AdminShell>
      <div style={{ fontFamily: BODY }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[26px] font-bold" style={{ color: INK }}>
            Товары
          </h1>
          <Link
            href="/admin/products/new"
            className="cart-pill px-5 py-2.5 text-[14px] text-white transition-colors"
            style={{ background: INK }}
          >
            + Добавить товар
          </Link>
        </div>

        {products.length === 0 ? (
          <div
            className="border border-dashed py-12 text-center text-[14px]"
            style={{ borderColor: HAIRLINE, color: "rgba(23,21,19,0.5)" }}
          >
            Товаров пока нет
          </div>
        ) : (
          <div className="border" style={{ borderColor: HAIRLINE }}>
            <table className="w-full text-left text-[14px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <th className="px-4 py-3 font-medium" style={{ color: "rgba(23,21,19,0.55)" }}>
                    Название
                  </th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "rgba(23,21,19,0.55)" }}>
                    Цена
                  </th>
                  <th className="px-4 py-3 font-medium" style={{ color: "rgba(23,21,19,0.55)" }}>
                    Категория
                  </th>
                  <th className="px-4 py-3 font-medium text-center" style={{ color: "rgba(23,21,19,0.55)" }}>
                    Опубл.
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    style={{ borderTop: `1px solid ${HAIRLINE}` }}
                    className="hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium hover:underline"
                        style={{ color: INK }}
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: INK }}>
                      {product.price.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="px-4 py-3" style={{ color: "rgba(23,21,19,0.7)" }}>
                      {product.category || "—"}
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: INK }}>
                      {product.is_published ? "✓" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
