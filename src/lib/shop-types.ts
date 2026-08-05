export type ProductColor = { name: string; hex: string; image: string | null };

export type Product = {
  id: string;
  slug: string | null;
  title: string;
  price: number;
  description: string | null;
  category: string;
  image_url: string | null;
  gallery_urls: string[] | null;
  colors: ProductColor[] | null;
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
  price: number;
  quantity: number;
  color?: string | null;
};
