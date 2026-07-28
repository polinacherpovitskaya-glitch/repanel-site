import { AdminShell } from "@/components/AdminShell";
import { supabaseAdmin } from "@/lib/server-db";

export const dynamic = "force-dynamic";

const BODY = "'Gramatika', sans-serif";
const HAIRLINE = "rgba(23,21,19,0.15)";

type Certificate = {
  id: string;
  code: string;
  initial_amount: number;
  balance: number;
  status: string;
  recipient_email: string | null;
  recipient_name: string | null;
  created_at: string;
};

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Активен", bg: "rgba(44,138,44,0.12)", color: "#2C8A2C" },
  used_up: { label: "Использован", bg: "rgba(23,21,19,0.08)", color: "#171513" },
  disabled: { label: "Отключён", bg: "rgba(198,40,40,0.10)", color: "#C62828" },
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

export default async function AdminCertificates() {
  const db = supabaseAdmin();
  const { data } = await db
    .from("certificates")
    .select("id, code, initial_amount, balance, status, recipient_email, recipient_name, created_at")
    .order("created_at", { ascending: false });
  const certs = (data as Certificate[] | null) ?? [];

  const th = "text-left px-4 py-3 text-[12px] uppercase tracking-wide text-[#171513]/50 font-normal";
  const td = "px-4 py-3 text-[14px] text-[#171513] align-middle";

  return (
    <AdminShell>
      <div style={{ fontFamily: BODY }}>
        <h1 className="text-[26px] font-bold text-[#171513] mb-1">Сертификаты</h1>
        <p className="text-[13px] text-[#171513]/55 mb-6">
          Выпускаются автоматически при покупке на сайте
        </p>

        {certs.length === 0 ? (
          <div className="border p-8 text-center text-[14px] text-[#171513]/50" style={{ borderColor: HAIRLINE }}>
            Сертификатов ещё нет.
          </div>
        ) : (
          <div className="border overflow-hidden" style={{ borderColor: HAIRLINE }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                  <th className={th}>Код</th>
                  <th className={th}>Номинал</th>
                  <th className={th}>Баланс</th>
                  <th className={th}>Статус</th>
                  <th className={th}>Получатель</th>
                  <th className={th}>Дата</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c) => {
                  const meta = STATUS_META[c.status] ?? {
                    label: c.status,
                    bg: "rgba(23,21,19,0.08)",
                    color: "#171513",
                  };
                  return (
                    <tr key={c.id} className="border-b last:border-b-0" style={{ borderColor: HAIRLINE }}>
                      <td className={`${td} font-mono text-[13px] whitespace-nowrap`}>{c.code}</td>
                      <td className={`${td} whitespace-nowrap`}>{fmtMoney(c.initial_amount)}</td>
                      <td className={`${td} whitespace-nowrap`}>
                        <span className={c.balance > 0 ? "" : "text-[#171513]/40"}>{fmtMoney(c.balance)}</span>
                      </td>
                      <td className={td}>
                        <span
                          className="cart-pill inline-block px-2.5 py-0.5 text-[11px]"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className={td}>
                        <div className="text-[13px]">{c.recipient_name || "—"}</div>
                        <div className="text-[11px] text-[#171513]/50">{c.recipient_email || "—"}</div>
                      </td>
                      <td className={`${td} text-[12px] text-[#171513]/65 whitespace-nowrap`}>
                        {fmtDate(c.created_at)}
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
