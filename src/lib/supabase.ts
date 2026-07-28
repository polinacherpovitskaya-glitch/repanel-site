import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Публичный клиент (anon-ключ). Только чтение опубликованных товаров — всё
 * остальное закрыто RLS. Безопасен в браузере.
 */
export const supabase = createClient(url, anonKey);

/* ── Типы ── */
export type ProductColor = { name: string; hex: string; image: string | null };

export type Product = {
  id: string;
  slug: string | null;
  title: string;
  price: number; // целые рубли
  description: string | null;
  category: string;
  image_url: string | null; // главное фото (в сетке каталога)
  gallery_urls: string[] | null; // доп. фото внутри карточки
  colors: ProductColor[] | null; // варианты цвета: {name, hex, image}
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
