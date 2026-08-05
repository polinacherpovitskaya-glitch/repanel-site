import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { OrderStatusControls } from "@/components/admin/OrderStatusControls";
import { siteDb } from "@/lib/server-db";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";
const HAIR = "rgba(23,21,19,0.15)";
const MUTED = "rgba(23,21,19,0.55)";

const PAYMENT_LABELS: Record<string, string> = {
  pending: "Ожидает",
  paid: "Оплачен",
  failed: "Ошибка",
  refunded: "Возврат",
};
const PAYMENT_COLOR: Record<string, string> = {
  paid: "#1B7A3D",
  pending: MUTED,
  failed: "#C62828",
  refunded: "#C62828",
};
const PROCESSING_LABELS: Record<string, string> = {
  new: "Новый",
  assembling: "В сборке",
  done: "Готов",
};
const FULFILLMENT_LABELS: Record<string, string> = {
  not_started: "Не начато",
  assembling: "Сборка",
  packed: "Упаковано",
  shipped: "Отправлено",
};
const DELIVERY_LABELS: Record<string, string> = {
  created: "Создана",
  handed: "Передана",
  in_transit: "В пути",
  delivered: "Доставлена",
};

type OrderItem = {
  title?: string;
  price?: number;
  quantity?: number;
  color?: string | null;
};

type Order = {
  id: string;
  items: OrderItem[] | null;
  total: number | null;
  delivery_method: string | null;
  delivery_price: number | null;
  grand_total: number | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
  comment: string | null;
  status: string | null;
  payment_status: string | null;
  processing_status: string | null;
  fulfillment_status: string | null;
  delivery_status: string | null;
  tochka_operation_id: string | null;
  carrier: string | null;
  pvz_code: string | null;
  discount_amount: number | null;
  applied_code: string | null;
  submitted_at: string | null;
  created_at: string | null;
};

type TimelineRow = {
  id: string;
  event_type: string | null;
  actor: string | null;
  payload: Record<string, unknown> | null;
  created_at: string | null;
};

function formatPrice(n: number | null | undefined): string {
  return (n ?? 0).toLocaleString("ru-RU") + " ₽";
}

function formatDateTime(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timelineText(e: TimelineRow): string {
  const p = (e.payload ?? {}) as Record<string, unknown>;
  if (e.event_type === "created") return "Заказ создан";
  if (e.event_type === "status_change") {
    const field = String(p.field ?? "");
    const value = String(p.value ?? "");
    const labels: Record<string, Record<string, string>> = {
      processing_status: PROCESSING_LABELS,
      payment_status: PAYMENT_LABELS,
      fulfillment_status: FULFILLMENT_LABELS,
      delivery_status: DELIVERY_LABELS,
    };
    const human =
      field === "processing_status"
        ? "Обработка"
        : field === "payment_status"
          ? "Оплата"
          : field === "fulfillment_status"
            ? "Сборка"
            : field === "delivery_status"
              ? "Доставка"
              : field || "Статус";
    return `${human} → ${(labels[field] ?? {})[value] ?? value}`;
  }
  return e.event_type ?? "Событие";
}

const card: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${HAIR}`,
  marginBottom: 20,
};
const cardH: React.CSSProperties = {
  padding: "14px 18px",
  borderBottom: `1px solid ${HAIR}`,
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};
const cardB: React.CSSProperties = { padding: 18 };
const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "8px 0",
  borderBottom: `1px solid ${HAIR}`,
  fontSize: 14,
};

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        border: `1px solid ${HAIR}`,
        padding: "3px 10px",
        fontSize: 12,
        color,
      }}
    >
      {label}
    </span>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = siteDb();

  const [{ data: order }, { data: timelineData }] = await Promise.all([
    db.from("shop_orders").select("*").eq("id", id).single(),
    db
      .from("order_timeline")
      .select("id, event_type, actor, payload, created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!order) {
    return (
      <AdminShell>
        <div style={{ fontFamily: BODY }}>
          <Link
            href="/admin/orders"
            style={{ color: MUTED, fontSize: 13 }}
          >
            ← Заказы
          </Link>
          <p style={{ marginTop: 16, fontSize: 16 }}>Заказ не найден</p>
        </div>
      </AdminShell>
    );
  }

  const o = order as Order;
  const timeline = (timelineData ?? []) as TimelineRow[];
  const items = Array.isArray(o.items) ? o.items : [];

  return (
    <AdminShell>
      <div style={{ fontFamily: BODY, color: "#171513" }}>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>
          <Link href="/admin/orders" style={{ color: MUTED }}>
            ← Заказы
          </Link>{" "}
          / {o.id.slice(0, 6).toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 700 }}>
            {o.id.slice(0, 6).toUpperCase()}
          </span>
          <Chip
            label={
              PAYMENT_LABELS[o.payment_status ?? ""] ?? o.payment_status ?? "—"
            }
            color={PAYMENT_COLOR[o.payment_status ?? ""] ?? MUTED}
          />
          <Chip
            label={
              PROCESSING_LABELS[o.processing_status ?? ""] ??
              o.processing_status ??
              "—"
            }
            color="#171513"
          />
          {o.fulfillment_status && (
            <Chip
              label={
                FULFILLMENT_LABELS[o.fulfillment_status] ?? o.fulfillment_status
              }
              color={MUTED}
            />
          )}
          {o.delivery_status && (
            <Chip
              label={DELIVERY_LABELS[o.delivery_status] ?? o.delivery_status}
              color={MUTED}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <div>
            {/* Состав */}
            <div style={card}>
              <div style={cardH}>Состав заказа</div>
              <div style={cardB}>
                {items.length === 0 ? (
                  <p style={{ fontSize: 14, color: MUTED }}>Нет позиций</p>
                ) : (
                  items.map((it, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        padding: "10px 0",
                        borderBottom:
                          i < items.length - 1 ? `1px solid ${HAIR}` : "none",
                        fontSize: 14,
                      }}
                    >
                      <div>
                        <div>{it.title ?? "—"}</div>
                        {it.color && (
                          <div style={{ fontSize: 13, color: MUTED }}>
                            {it.color}
                          </div>
                        )}
                      </div>
                      <div style={{ whiteSpace: "nowrap" }}>
                        ×{it.quantity ?? 1} — {formatPrice(it.price)}
                      </div>
                    </div>
                  ))
                )}

                <div style={{ marginTop: 14 }}>
                  <div style={{ ...row, color: MUTED }}>
                    <span>Товары</span>
                    <span>{formatPrice(o.total)}</span>
                  </div>
                  <div style={{ ...row, color: MUTED }}>
                    <span>Доставка</span>
                    <span>{formatPrice(o.delivery_price)}</span>
                  </div>
                  {(o.discount_amount ?? 0) > 0 && (
                    <div style={{ ...row, color: MUTED }}>
                      <span>
                        Скидка{o.applied_code ? ` (${o.applied_code})` : ""}
                      </span>
                      <span>−{formatPrice(o.discount_amount)}</span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      fontSize: 15,
                      fontWeight: 700,
                      borderTop: `1px solid #171513`,
                      marginTop: 6,
                    }}
                  >
                    <span>Итого</span>
                    <span>{formatPrice(o.grand_total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Коммент */}
            {o.comment && (
              <div style={card}>
                <div style={cardH}>Комментарий</div>
                <div style={{ ...cardB, fontSize: 14, lineHeight: 1.5 }}>
                  {o.comment}
                </div>
              </div>
            )}

            {/* Таймлайн */}
            <div style={card}>
              <div style={cardH}>Таймлайн</div>
              <div style={cardB}>
                {timeline.length === 0 ? (
                  <p style={{ fontSize: 14, color: MUTED }}>Нет событий</p>
                ) : (
                  timeline.map((e, i) => (
                    <div
                      key={e.id}
                      style={{
                        padding: "10px 0",
                        borderBottom:
                          i < timeline.length - 1
                            ? `1px solid ${HAIR}`
                            : "none",
                      }}
                    >
                      <div style={{ fontSize: 13, color: MUTED }}>
                        {formatDateTime(e.created_at)}
                      </div>
                      <div style={{ fontSize: 14, marginTop: 2 }}>
                        {timelineText(e)}
                      </div>
                      {e.actor && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(23,21,19,0.4)",
                            marginTop: 1,
                          }}
                        >
                          {e.actor}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Статусы */}
            <div style={card}>
              <div style={cardH}>Статус</div>
              <div style={cardB}>
                <OrderStatusControls
                  orderId={o.id}
                  processingStatus={o.processing_status ?? "new"}
                  paymentStatus={o.payment_status ?? "pending"}
                />
              </div>
            </div>

            {/* Покупатель */}
            <div style={card}>
              <div style={cardH}>Покупатель</div>
              <div style={cardB}>
                <div style={row}>
                  <span style={{ color: MUTED }}>Имя</span>
                  <span>{o.name || "—"}</span>
                </div>
                <div style={row}>
                  <span style={{ color: MUTED }}>Телефон</span>
                  <span>{o.phone || "—"}</span>
                </div>
                <div style={{ ...row, borderBottom: "none" }}>
                  <span style={{ color: MUTED }}>Email</span>
                  <span style={{ wordBreak: "break-all" }}>
                    {o.email || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Доставка */}
            <div style={card}>
              <div style={cardH}>Доставка</div>
              <div style={cardB}>
                <div style={row}>
                  <span style={{ color: MUTED }}>Способ</span>
                  <span>{o.delivery_method || "—"}</span>
                </div>
                <div style={row}>
                  <span style={{ color: MUTED }}>Город</span>
                  <span>{o.city || "—"}</span>
                </div>
                <div style={row}>
                  <span style={{ color: MUTED }}>Адрес</span>
                  <span style={{ textAlign: "right" }}>{o.address || "—"}</span>
                </div>
                <div style={row}>
                  <span style={{ color: MUTED }}>ПВЗ</span>
                  <span>{o.pvz_code || "—"}</span>
                </div>
                <div style={{ ...row, borderBottom: "none" }}>
                  <span style={{ color: MUTED }}>Перевозчик</span>
                  <span>{o.carrier || "—"}</span>
                </div>
              </div>
            </div>

            {/* Оплата */}
            <div style={card}>
              <div style={cardH}>Оплата</div>
              <div style={cardB}>
                <div style={row}>
                  <span style={{ color: MUTED }}>Статус</span>
                  <span style={{ color: PAYMENT_COLOR[o.payment_status ?? ""] ?? MUTED }}>
                    {PAYMENT_LABELS[o.payment_status ?? ""] ??
                      o.payment_status ??
                      "—"}
                  </span>
                </div>
                <div style={row}>
                  <span style={{ color: MUTED }}>Сумма</span>
                  <span>{formatPrice(o.grand_total)}</span>
                </div>
                <div style={{ ...row, borderBottom: "none" }}>
                  <span style={{ color: MUTED }}>ID операции</span>
                  <span style={{ fontSize: 13, color: MUTED, wordBreak: "break-all" }}>
                    {o.tochka_operation_id || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
