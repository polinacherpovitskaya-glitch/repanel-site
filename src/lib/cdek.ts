// СДЭК — расчёт доставки, пункты выдачи, поиск городов. Перенесено из Recycle Object.
// Тест-режим: CDEK_USE_TEST=true + публичные тест-креды CDEK (api.edu.cdek.ru).
const ACCOUNT = process.env.CDEK_ACCOUNT ?? "";
const PASSWORD = process.env.CDEK_PASSWORD ?? "";
const API_URL =
  process.env.CDEK_USE_TEST === "true"
    ? process.env.CDEK_TEST_API_URL ?? "https://api.edu.cdek.ru/v2"
    : process.env.CDEK_API_URL ?? "https://api.cdek.ru/v2";
const SENDER_CITY_CODE = parseInt(process.env.SENDER_CITY_CODE ?? "44", 10);

let cachedToken: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.token;
  if (!ACCOUNT || !PASSWORD) throw new Error("CDEK creds not set");
  const res = await fetch(`${API_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: ACCOUNT, client_secret: PASSWORD }),
  });
  const data = await res.json();
  if (!res.ok || !data?.access_token) {
    throw new Error(`CDEK auth failed: ${res.status} ${data?.error_description ?? data?.message ?? ""}`);
  }
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

async function cdekFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...options.headers },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = Array.isArray(data?.errors) && data.errors.length
      ? data.errors.map((e: { message?: string; code?: string }) => e.message ?? e.code).filter(Boolean).join("; ")
      : data?.message ?? data?.error ?? text ?? "CDEK request failed";
    throw new Error(`CDEK API error ${res.status}: ${message}`);
  }
  return data;
}

export async function calculateDelivery(params: {
  toCityCode: number;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  tariffCode: number;
}) {
  return cdekFetch("/calculator/tariff", {
    method: "POST",
    body: JSON.stringify({
      from_location: { code: SENDER_CITY_CODE },
      to_location: { code: params.toCityCode },
      packages: [{ weight: params.weight, length: params.length ?? 20, width: params.width ?? 15, height: params.height ?? 10 }],
      tariff_code: params.tariffCode,
    }),
  });
}

export async function getPickupPoints(cityCode: number) {
  return cdekFetch(`/deliverypoints?city_code=${cityCode}&type=PVZ,POSTAMAT`);
}

export async function findCities(query: string) {
  return cdekFetch(`/location/cities?city=${encodeURIComponent(query)}&size=10&country_codes=RU`);
}
