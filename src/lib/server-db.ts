import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isPersonalDataTable, personalDataFrom } from "@/lib/ydb-personal-data";

/**
 * Серверный клиент магазина.
 *
 * При PERSONAL_DATA_BACKEND=ydb четыре таблицы с персональными данными
 * маршрутизируются в YDB, а каталог, промокоды и файловое хранилище продолжают
 * работать через Supabase. Это позволяет перенести только обязательный минимум.
 */
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase env vars (URL / SERVICE_ROLE_KEY) не заданы");
  }

  const base = createClient(url, serviceKey, { auth: { persistSession: false } });
  if (process.env.PERSONAL_DATA_BACKEND !== "ydb") return base;

  return new Proxy(base, {
    get(target, property, receiver) {
      if (property === "from") {
        return (table: string) =>
          isPersonalDataTable(table)
            ? personalDataFrom(table)
            : target.from(table);
      }
      const value = Reflect.get(target, property, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  }) as SupabaseClient;
}

