import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Публичный клиент (anon-ключ). Только чтение опубликованных товаров — всё
 * остальное закрыто RLS. Безопасен в браузере.
 */
export const supabase = createClient(url, anonKey);

/**
 * Привилегированный клиент (service_role). Обходит RLS — пишет заказы, метит
 * оплату. ТОЛЬКО НА СЕРВЕРЕ (в API-роутах). Никогда не импортировать в
 * клиентские компоненты — это утечка секрета.
 */
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase env vars (URL / SERVICE_ROLE_KEY) не заданы");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/* ── Типы ── */
export type Product = {
  id: string;
  slug: string | null;
  title: string;
  price: number; // целые рубли
  description: string | null;
  category: string;
  image_url: string | null;
  is_published: boolean;
  weight_grams: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  sort_order: number;
};

export type OrderItem = {
  productId: string;
  slug: string | null;
  title: string;
  price: number; // снимок цены на момент заказа
  quantity: number;
  color?: string | null;
};
