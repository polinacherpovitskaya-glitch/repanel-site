import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";

const TABLES = [
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

const base = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const output = process.argv[2];

if (!base || !serviceKey || !output) {
  console.error("Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/export-supabase-source.mjs OUTPUT.json");
  process.exit(1);
}

const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

async function checkedJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

const collections = {};
for (const table of TABLES) {
  collections[table] = await checkedJson(`${base}/rest/v1/${table}?select=*`, {
    headers: { ...headers, Range: "0-9999" },
  });
}

const auth = await checkedJson(`${base}/auth/v1/admin/users?page=1&per_page=1000`, { headers });
const buckets = await checkedJson(`${base}/storage/v1/bucket`, { headers });
const objects = {};

for (const bucket of buckets) {
  const bucketId = String(bucket.id);
  objects[bucketId] = await checkedJson(`${base}/storage/v1/object/list/${encodeURIComponent(bucketId)}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 1000, offset: 0, sortBy: { column: "name", order: "asc" } }),
  });
}

const exportedAt = new Date().toISOString();
const payload = {
  format: "repanel-supabase-export-v1",
  exported_at: exportedAt,
  project_ref: new URL(base).hostname.split(".")[0],
  collections,
  auth,
  storage: { buckets, objects },
};

await mkdir(dirname(resolve(output)), { recursive: true });
await writeFile(output, `${JSON.stringify(payload)}\n`, { mode: 0o600 });

const objectRoot = resolve(`${output}.objects`);
let objectCount = 0;
for (const [bucketId, list] of Object.entries(objects)) {
  for (const object of list) {
    const name = String(object.name || "");
    const target = resolve(objectRoot, bucketId, name);
    if (!name || (!target.startsWith(`${objectRoot}${sep}`) && target !== objectRoot)) {
      throw new Error(`Недопустимый ключ Storage: ${name}`);
    }
    const response = await fetch(`${base}/storage/v1/object/authenticated/${encodeURIComponent(bucketId)}/${name.split("/").map(encodeURIComponent).join("/")}`, { headers });
    if (!response.ok) throw new Error(`Storage ${bucketId}/${name}: HTTP ${response.status}`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(await response.arrayBuffer()), { mode: 0o600 });
    objectCount += 1;
  }
}

console.log(JSON.stringify({
  output,
  counts: Object.fromEntries(TABLES.map((table) => [table, collections[table].length])),
  auth_users: Array.isArray(auth.users) ? auth.users.length : 0,
  buckets: buckets.length,
  objects: objectCount,
}));
