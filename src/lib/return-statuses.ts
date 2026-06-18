// Статусы возврата + русские подписи и цвета пилюль. Используется на страницах
// списка и карточки возврата.
export type ReturnStatus = "requested" | "approved" | "refunded" | "rejected";

export const RETURN_STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  requested: { label: "Запрошен", bg: "rgba(23,21,19,0.08)", color: "#171513" },
  approved: { label: "Одобрен", bg: "rgba(21,101,192,0.10)", color: "#1565C0" },
  refunded: { label: "Возвращён", bg: "rgba(44,138,44,0.12)", color: "#2C8A2C" },
  rejected: { label: "Отклонён", bg: "rgba(198,40,40,0.10)", color: "#C62828" },
};

export function returnStatusMeta(status: string) {
  return RETURN_STATUS_META[status] ?? { label: status, bg: "rgba(23,21,19,0.08)", color: "#171513" };
}
