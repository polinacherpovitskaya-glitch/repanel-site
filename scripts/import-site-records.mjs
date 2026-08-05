import { readFile } from "node:fs/promises";
import pg from "pg";

const { Client } = pg;
const input = process.argv[2];
const databaseUrl = process.env.SITE_DATABASE_URL;

if (process.env.ALLOW_SITE_IMPORT !== "1" || !databaseUrl || !input) {
  console.error("Usage: ALLOW_SITE_IMPORT=1 SITE_DATABASE_URL=... node scripts/import-site-records.mjs SITE-RECORDS.json");
  process.exit(1);
}

const payload = JSON.parse(await readFile(input, "utf8"));
if (payload.format !== "repanel-site-records-v1" || !payload.collections) {
  throw new Error("Неизвестный формат импорта");
}

const client = new Client({ connectionString: databaseUrl, application_name: "repanel-site-import" });
await client.connect();

try {
  const existing = await client.query("select count(*)::integer as count from site_records");
  if (existing.rows[0].count !== 0) {
    throw new Error(`Целевая база не пустая: ${existing.rows[0].count} записей`);
  }

  await client.query("begin");
  for (const [collection, rows] of Object.entries(payload.collections)) {
    if (!Array.isArray(rows)) throw new Error(`${collection}: ожидался массив`);
    for (const row of rows) {
      if (!row?.id) throw new Error(`${collection}: запись без id`);
      await client.query(
        `insert into site_records (collection, id, body, created_at, updated_at)
         values ($1, $2, $3::jsonb, coalesce($4::timestamptz, now()), coalesce($5::timestamptz, now()))`,
        [collection, String(row.id), JSON.stringify(row), row.created_at ?? null, row.updated_at ?? row.created_at ?? null],
      );
    }
  }
  await client.query("commit");
} catch (error) {
  await client.query("rollback").catch(() => undefined);
  throw error;
} finally {
  await client.end();
}

const counts = Object.fromEntries(Object.entries(payload.collections).map(([collection, rows]) => [collection, rows.length]));
console.log(JSON.stringify({ imported: counts }));
