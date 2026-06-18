import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { supabaseAdmin } from "@/lib/supabase";
import { displayOrderNumber } from "@/lib/shop-payments";
import { returnStatusMeta } from "@/lib/return-statuses";
import { NewReturnForm } from "./NewReturnForm";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";
const HAIRLINE = "rgba(23,21,19,0.15)";

type ReturnRow = {
  id: string;
  order_id: string | null;
  reason: string | null;
  status: string;
  amount: number;
  created_at: string;
};

function fmtMoney(n: number) {
  return `${(n ?? 0).toLocaleString("ru-RU")} ₽`;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function AdminReturns() {
  const db = supabaseAdmin();
  const { data: returnsData } = await db
    .from("returns")
    .select("id, order_id, reason, status, amount, created_at")
    .order("created_at", { ascending: false });
  const returns = (returnsData as ReturnRow[] | null) ?? [];

  // Подтягиваем заказы одним запросом для № и клиента.
  const orderIds = Array.from(new Set(returns.map((r) => r.order_id).filter(Boolean))) as string[];
  const orders: Record<string, { name: string | null; email: string | null }> = {};
  if (orderIds.length) {
    const { data: ordersData } = await db
      .from("shop_orders")
      .select("id, name, email")
      .in("id", orderIds);
    for (const o of ordersData ?? []) {
      orders[o.id as string] = { name: o.name as string | null, email: o.email as string | null };
    }
  }

  const th = "text-left px-4 py-3 text-[12px] uppercase tracking-wide text-[#171513]/50 font-normal";
  const td = "px-4 py-3 text-[14px] text-[#171513] align-middle";

  return (
    <AdminShell>
      <div style={{ fontFamily: BODY }}>
        <h1 className="text-[26px] font-bold text-[#171513] mb-6">Возвраты</h1>

        <NewReturnForm />

        {returns.length === 0 ? (
          <div className="border p-8 text-center text-[14px] text-[#171513]/50" style={{ borderColor: HAIRLINE }}>
            Возвратов пока нет.
          </div>
        ) : (
          <div className="border overflow-hidden" style={{ borderColor: HAIRLINE }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                  <th className={th}>Заказ №</th>
                  <th className={th}>Причина</th>
                  <th className={th}>Сумма</th>
                  <th className={th}>Статус</th>
                  <th className={th}>Дата</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((r) => {
                  const meta = returnStatusMeta(r.status);
                  const order = r.order_id ? orders[r.order_id] : undefined;
                  return (
                    <tr
                      key={r.id}
                      className="border-b last:border-b-0 hover:bg-[#171513]/[0.03] transition-colors"
                      style={{ borderColor: HAIRLINE }}
                    >
                      <td className={`${td} whitespace-nowrap`}>
                        <Link href={`/admin/returns/${r.id}`} className="block">
                          <span className="font-mono text-[13px]">
                            {r.order_id ? `#${displayOrderNumber(r.order_id)}` : "—"}
                          </span>
                          {order?.name && (
                            <span className="block text-[11px] text-[#171513]/50">{order.name}</span>
                          )}
                        </Link>
                      </td>
                      <td className={td}>
                        <Link
                          href={`/admin/returns/${r.id}`}
                          className="block max-w-[280px] truncate text-[#171513]/80"
                        >
                          {r.reason || "—"}
                        </Link>
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        <Link href={`/admin/returns/${r.id}`} className="block">
                          {fmtMoney(r.amount)}
                        </Link>
                      </td>
                      <td className={td}>
                        <Link href={`/admin/returns/${r.id}`} className="block">
                          <span
                            className="cart-pill inline-block px-2.5 py-0.5 text-[11px]"
                            style={{ backgroundColor: meta.bg, color: meta.color }}
                          >
                            {meta.label}
                          </span>
                        </Link>
                      </td>
                      <td className={`${td} text-[12px] text-[#171513]/65 whitespace-nowrap`}>
                        <Link href={`/admin/returns/${r.id}`} className="block">
                          {fmtDate(r.created_at)}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
