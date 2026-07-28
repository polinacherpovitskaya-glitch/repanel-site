import { createClient } from "@supabase/supabase-js";
import {
  connectYdb,
  countPersonalDataRows,
  ensurePersonalDataSchema,
  upsertPersonalDataRow,
} from "./ydb-client.mjs";

const COLLECTIONS = [
  "shop_orders",
  "order_timeline",
  "returns",
  "certificates",
];

const sourceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const sourceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!sourceUrl || !sourceKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY не заданы");
}

const source = createClient(sourceUrl, sourceKey, {
  auth: { persistSession: false },
});

async function readAll(collection) {
  const pageSize = 500;
  const rows = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await source
      .from(collection)
      .select("*")
      .range(offset, offset + pageSize - 1);

    if (error) {
      if (/does not exist|relation .* not found/i.test(error.message)) {
        console.warn(`${collection}: source table is absent, skipped`);
        return [];
      }
      throw error;
    }

    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) return rows;
  }
}

const { driver, sql } = await connectYdb();
try {
  await ensurePersonalDataSchema(sql);

  for (const collection of COLLECTIONS) {
    const rows = await readAll(collection);
    for (const row of rows) {
      await upsertPersonalDataRow(sql, collection, row);
    }

    const targetCount = await countPersonalDataRows(sql, collection);
    if (targetCount !== rows.length) {
      throw new Error(
        `${collection}: проверка не пройдена, источник=${rows.length}, YDB=${targetCount}`,
      );
    }
    console.log(`${collection}: ${targetCount} rows copied and verified`);
  }
} finally {
  driver.close();
}

