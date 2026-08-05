import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const COLLECTIONS = [
  "products",
  "shop_orders",
  "order_timeline",
  "order_shipments",
  "notification_log",
  "certificates",
  "certificate_redemptions",
  "promo_codes",
  "promo_redemptions",
  "returns",
];

const [supabasePath, ydbPath, outputPath, manifestPath] = process.argv.slice(2);
if (!supabasePath || !ydbPath || !outputPath || !manifestPath) {
  console.error("Usage: node scripts/build-site-migration-bundle.mjs SUPABASE.json YDB.json OUTPUT.json MANIFEST.json");
  process.exit(1);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function canonicalRows(rows) {
  return [...rows]
    .map(stable)
    .sort((left, right) => String(left.id ?? "").localeCompare(String(right.id ?? "")));
}

function sha(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

const supabaseBytes = await readFile(supabasePath);
const ydbBytes = await readFile(ydbPath);
const supabase = JSON.parse(supabaseBytes);
const ydb = JSON.parse(ydbBytes);

if (supabase.format !== "repanel-supabase-export-v1") throw new Error("Неизвестный формат Supabase export");
if (ydb.format !== "repanel-ydb-export-v1") throw new Error("Неизвестный формат YDB export");

const ydbByCollection = Object.groupBy(ydb.records, (record) => record.collection);
const personalCollections = new Set(["shop_orders", "order_timeline", "returns", "certificates"]);
const collections = {};

for (const collection of COLLECTIONS) {
  const supabaseRows = supabase.collections[collection] ?? [];
  const ydbRows = (ydbByCollection[collection] ?? []).map((record) => record.body);
  if (!Array.isArray(supabaseRows)) throw new Error(`${collection}: Supabase export не является массивом`);
  if (personalCollections.has(collection) && supabaseRows.length && ydbRows.length) {
    throw new Error(`${collection}: данные одновременно присутствуют в Supabase и YDB`);
  }
  collections[collection] = canonicalRows(ydbRows.length ? ydbRows : supabaseRows);
}

const generatedAt = new Date().toISOString();
const bundle = stable({
  format: "repanel-site-records-v1",
  generated_at: generatedAt,
  sources: {
    supabase_exported_at: supabase.exported_at,
    ydb_exported_at: ydb.exported_at,
  },
  collections,
});
const bundleBytes = Buffer.from(`${JSON.stringify(bundle)}\n`);

const collectionManifest = Object.fromEntries(COLLECTIONS.map((collection) => {
  const bytes = Buffer.from(JSON.stringify(collections[collection]));
  return [collection, { count: collections[collection].length, sha256: sha(bytes), bytes: bytes.length }];
}));

const manifest = stable({
  format: "repanel-site-migration-manifest-v1",
  generated_at: generatedAt,
  sources: {
    supabase: { bytes: supabaseBytes.length, sha256: sha(supabaseBytes) },
    ydb: { bytes: ydbBytes.length, sha256: sha(ydbBytes) },
  },
  bundle: { bytes: bundleBytes.length, sha256: sha(bundleBytes) },
  collections: collectionManifest,
  auth_users: Array.isArray(supabase.auth?.users) ? supabase.auth.users.length : 0,
  storage_buckets: Array.isArray(supabase.storage?.buckets) ? supabase.storage.buckets.length : 0,
  storage_objects: Object.values(supabase.storage?.objects ?? {}).reduce((sum, rows) => sum + rows.length, 0),
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, bundleBytes, { mode: 0o600 });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });

console.log(JSON.stringify(manifest));
