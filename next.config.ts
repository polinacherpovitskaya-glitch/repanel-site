import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Фото товаров из Supabase Storage (public-бакет product-images).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Образцы пока отправляет офис Recycle Object → «Заказать образцы» ведём в их магазин.
  // Когда образцы будут свои — убрать этот редирект, вернётся внутренний /samples.
  async redirects() {
    return [
      {
        source: "/samples",
        destination: "https://recycleobject.ru/shop/6a12d359-4cbb-47cc-ad31-ed0f1ae0dfae",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
