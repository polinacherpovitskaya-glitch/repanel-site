import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { siteDb } from "@/lib/server-db";
import { displayOrderNumber } from "@/lib/shop-payments";
import { returnStatusMeta } from "@/lib/return-statuses";
import { ReturnControls } from "./ReturnControls";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";
const HAIRLINE = "rgba(23,21,19,0.15)";

type ReturnDetail = {
  id: string;
  order_id: string | null;
  reason: string | null;
  status: string;
  amount: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

type OrderDetail = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  grand_total: number | null;
  payment_status: string | null;
  tochka_operation_id: string | null;
};

function fmtMoney(n: number | null) {
  return `${(n ?? 0).toLocaleString("ru-RU")} ₽`;
}

function fmtDateTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })}, ${d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
}

export default async function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = siteDb();

  const { data: returnData } = await db
    .from("returns")
    .select("id, order_id, reason, status, amount, comment, created_at, updated_at")
    .eq("id", id)
    .single();
  const ret = returnData as ReturnDetail | null;
  if (!ret) notFound();

  let order: OrderDetail | null = null;
  if (ret.order_id) {
    const { data: orderData } = await db
      .from("shop_orders")
      .select("id, name, email, phone, grand_total, payment_status, tochka_operation_id")
      .eq("id", ret.order_id)
      .single();
    order = (orderData as OrderDetail | null) ?? null;
  }

  const meta = returnStatusMeta(ret.status);

  const canRefund =
    !!order &&
    order.payment_status === "paid" &&
    !!order.tochka_operation_id &&
    ret.amount > 0;

  const card = "border";
  const cardH = "px-5 py-4 border-b text-[13px] uppercase tracking-wide text-[#171513]/55";
  const cardB = "px-5 py-4";
  const row = "flex justify-between gap-4 py-2 text-[14px]";
  const rowLabel = "text-[#171513]/55";

  return (
    <AdminShell>
      <div style={{ fontFamily: BODY }}>
        <div className="text-[13px] text-[#171513]/50 mb-4">
          <Link href="/admin/returns" className="hover:text-[#171513]">
            ← Возвраты
          </Link>{" "}
          / #{ret.id.slice(0, 6).toUpperCase()}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-[26px] font-bold text-[#171513]">
            Возврат #{ret.id.slice(0, 6).toUpperCase()}
          </h1>
          <span
            className="cart-pill inline-block px-3 py-1 text-[12px]"
            style={{ backgroundColor: meta.bg, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 360px" }}>
          {/* Левая колонка — детали возврата */}
          <div className="flex flex-col gap-5">
            <div className={card} style={{ borderColor: HAIRLINE }}>
              <div className={cardH} style={{ borderColor: HAIRLINE }}>Детали возврата</div>
              <div className={cardB}>
                <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <span className={rowLabel}>Причина</span>
                  <span className="text-right">{ret.reason || "—"}</span>
                </div>
                <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <span className={rowLabel}>Сумма</span>
                  <span className="font-bold">{fmtMoney(ret.amount)}</span>
                </div>
                <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <span className={rowLabel}>Создан</span>
                  <span>{fmtDateTime(ret.created_at)}</span>
                </div>
                <div className={row}>
                  <span className={rowLabel}>Обновлён</span>
                  <span>{fmtDateTime(ret.updated_at)}</span>
                </div>
                {ret.comment && (
                  <div className="mt-3">
                    <div className="text-[12px] text-[#171513]/55 mb-1">Комментарий</div>
                    <div className="text-[14px] text-[#171513]/80">{ret.comment}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={card} style={{ borderColor: HAIRLINE }}>
              <div className={cardH} style={{ borderColor: HAIRLINE }}>Управление</div>
              <div className={cardB}>
                <ReturnControls
                  returnId={ret.id}
                  currentStatus={ret.status}
                  orderId={ret.order_id}
                  amount={ret.amount}
                  canRefund={canRefund}
                />
              </div>
            </div>
          </div>

          {/* Правая колонка — заказ */}
          <div>
            <div className={card} style={{ borderColor: HAIRLINE }}>
              <div className={cardH} style={{ borderColor: HAIRLINE }}>Заказ</div>
              <div className={cardB}>
                {order ? (
                  <>
                    <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <span className={rowLabel}>Номер</span>
                      <span className="font-mono text-[13px]">#{displayOrderNumber(order.id)}</span>
                    </div>
                    <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <span className={rowLabel}>Клиент</span>
                      <span className="text-right">{order.name || "—"}</span>
                    </div>
                    <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <span className={rowLabel}>Email</span>
                      <span className="text-right text-[13px]">{order.email || "—"}</span>
                    </div>
                    <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <span className={rowLabel}>Телефон</span>
                      <span className="text-right text-[13px]">{order.phone || "—"}</span>
                    </div>
                    <div className={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <span className={rowLabel}>Сумма заказа</span>
                      <span>{fmtMoney(order.grand_total)}</span>
                    </div>
                    <div className={row}>
                      <span className={rowLabel}>Оплата</span>
                      <span>{order.payment_status || "—"}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-[14px] text-[#171513]/50">Заказ не привязан или удалён.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
