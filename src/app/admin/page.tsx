import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { supabaseAdmin } from "@/lib/server-db";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";

export default async function AdminDashboard() {
  const db = supabaseAdmin();
  const [orders, paid, products, certs] = await Promise.all([
    db.from("shop_orders").select("id", { count: "exact", head: true }),
    db.from("shop_orders").select("id", { count: "exact", head: true }).eq("payment_status", "paid"),
    db.from("products").select("id", { count: "exact", head: true }),
    db.from("certificates").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { href: "/admin/orders", label: "Заказы", value: orders.count ?? 0, sub: `${paid.count ?? 0} оплачено` },
    { href: "/admin/products", label: "Товары", value: products.count ?? 0, sub: "каталог" },
    { href: "/admin/certificates", label: "Сертификаты", value: certs.count ?? 0, sub: "выпущено" },
    { href: "/admin/returns", label: "Возвраты", value: "→", sub: "оформить" },
  ];

  return (
    <AdminShell>
      <h1 className="text-[26px] font-bold text-[#171513] mb-6" style={{ fontFamily: BODY }}>
        Обзор
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="border border-[#171513]/15 p-5 hover:border-[#171513] transition-colors" style={{ fontFamily: BODY }}>
            <p className="text-[13px] text-[#171513]/55">{c.label}</p>
            <p className="text-[32px] font-bold text-[#171513] mt-1 leading-none">{c.value}</p>
            <p className="text-[12px] text-[#171513]/45 mt-2">{c.sub}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
