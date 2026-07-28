import type { NextConfig } from "next";

const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageOrigin = new URL(configuredSupabaseUrl || "https://data.re-panel.ru");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Текущий managed Supabase и будущий self-hosted Storage в российском ЦОД.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: storageOrigin.protocol === "http:" ? "http" : "https",
        hostname: storageOrigin.hostname,
        port: storageOrigin.port,
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
