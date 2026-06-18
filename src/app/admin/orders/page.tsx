import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";
const HAIR = "rgba(23,21,19,0.15)";

const PAYMENT_LABELS: Record<string, string> = {
  pending: "Ожидает",
  paid: "Оплачен",
  failed: "Ошибка",
  refunded: "Возврат",
};

// Цвет текста статуса оплаты: paid — зелёный, pending — серый, failed/refunded — красный.
const PAYMENT_COLOR: Record<string, string> = {
  paid: "#1B7A3D",
  pending: "rgba(23,21,19,0.55)",
  failed: "#C62828",
  refunded: "#C62828",
};

const PROCESSING_LABELS: Record<string, string> = {
  new: "Новый",
  assembling: "В сборке",
  done: "Готов",
};

type OrderRow = {
  id: string;
  submitted_at: string | null;
  created_at: string | null;
  name: string | null;
  grand_total: number | null;
  payment_status: string | null;
  processing_status: string | null;
};

function formatDate(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(n: number | null): string {
  return (n ?? 0).toLocaleString("ru-RU") + " ₽";
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 400,
  color: "rgba(23,21,19,0.55)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: `1px solid ${HAIR}`,
};

const td: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 14,
  color: "#171513",
  borderBottom: `1px solid ${HAIR}`,
};

export default async function AdminOrdersPage() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("shop_orders")
    .select(
      "id, submitted_at, created_at, name, grand_total, payment_status, processing_status"
    )
    .order("submitted_at", { ascending: false })
    .limit(100);

  const orders = (data ?? []) as OrderRow[];

  return (
    <AdminShell>
      <h1
        className="text-[26px] font-bold text-[#171513] mb-6"
        style={{ fontFamily: BODY }}
      >
        Заказы
      </h1>

      {error ? (
        <p style={{ fontFamily: BODY, color: "#C62828", fontSize: 14 }}>
          Ошибка загрузки: {error.message}
        </p>
      ) : orders.length === 0 ? (
        <p
          style={{ fontFamily: BODY, color: "rgba(23,21,19,0.55)", fontSize: 14 }}
        >
          Заказов пока нет
        </p>
      ) : (
        <div style={{ border: `1px solid ${HAIR}`, fontFamily: BODY }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>№</th>
                <th style={th}>Дата</th>
                <th style={th}>Покупатель</th>
                <th style={th}>Сумма</th>
                <th style={th}>Оплата</th>
                <th style={th}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="group hover:bg-[#171513]/[0.03]">
                  <td style={td}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-bold"
                      style={{ color: "#171513" }}
                    >
                      {o.id.slice(0, 6).toUpperCase()}
                    </Link>
                  </td>
                  <td style={{ ...td, color: "rgba(23,21,19,0.7)" }}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="block"
                      style={{ color: "inherit" }}
                    >
                      {formatDate(o.submitted_at ?? o.created_at)}
                    </Link>
                  </td>
                  <td style={td}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="block"
                      style={{ color: "inherit" }}
                    >
                      {o.name || "—"}
                    </Link>
                  </td>
                  <td style={td}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="block"
                      style={{ color: "inherit" }}
                    >
                      {formatPrice(o.grand_total)}
                    </Link>
                  </td>
                  <td style={td}>
                    <span
                      style={{
                        color:
                          PAYMENT_COLOR[o.payment_status ?? ""] ??
                          "rgba(23,21,19,0.55)",
                      }}
                    >
                      {PAYMENT_LABELS[o.payment_status ?? ""] ??
                        o.payment_status ??
                        "—"}
                    </span>
                  </td>
                  <td style={{ ...td, color: "rgba(23,21,19,0.7)" }}>
                    {PROCESSING_LABELS[o.processing_status ?? ""] ??
                      o.processing_status ??
                      "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
