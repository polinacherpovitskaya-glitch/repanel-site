import { createClient } from "@supabase/supabase-js";
import { connectYdb, countPersonalDataRows } from "./ydb-client.mjs";

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

const { driver, sql } = await connectYdb();
let failed = false;
try {
  for (const collection of COLLECTIONS) {
    const { count, error } = await source
      .from(collection)
      .select("id", { count: "exact", head: true });
    if (error && /does not exist|relation .* not found/i.test(error.message)) {
      console.warn(`${collection}: source table is absent, skipped`);
      continue;
    }
    if (error) throw error;

    const targetCount = await countPersonalDataRows(sql, collection);
    const sourceCount = count ?? 0;
    const ok = sourceCount === targetCount;
    failed ||= !ok;
    console.log(
      `${collection}: source=${sourceCount}, YDB=${targetCount}, ${ok ? "OK" : "MISMATCH"}`,
    );
  }
} finally {
  driver.close();
}

if (failed) process.exitCode = 1;

