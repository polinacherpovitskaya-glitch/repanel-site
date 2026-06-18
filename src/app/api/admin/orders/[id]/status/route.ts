import { supabaseAdmin } from "@/lib/supabase";

// Поля статуса, которые админ может менять вручную. Любое другое поле отклоняется.
const ALLOWED_FIELDS = [
  "processing_status",
  "fulfillment_status",
  "delivery_status",
  "payment_status",
  "status",
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];

/** Смена одного статусного поля заказа + запись в order_timeline. */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { field?: unknown; value?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }

  const field = String(body.field ?? "");
  const value = body.value;

  if (!ALLOWED_FIELDS.includes(field as AllowedField)) {
    return Response.json({ error: "field не разрешён" }, { status: 400 });
  }
  if (typeof value !== "string" || !value) {
    return Response.json({ error: "value обязателен" }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { error: updateError } = await db
    .from("shop_orders")
    .update({ [field]: value })
    .eq("id", id);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  await db.from("order_timeline").insert({
    order_id: id,
    event_type: "status_change",
    actor: "admin",
    payload: { field, value },
  });

  return Response.json({ ok: true });
}
