import type { NextConfig } from "next";

const storageOrigin = new URL(
  process.env.SITE_STORAGE_PUBLIC_BASE_URL || "https://storage.yandexcloud.net",
);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: storageOrigin.protocol === "http:" ? "http" : "https",
        hostname: storageOrigin.hostname,
        port: storageOrigin.port,
        pathname: "/**",
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
