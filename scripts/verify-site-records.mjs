import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import pg from "pg";

const { Client } = pg;
const sourcePath = process.argv[2];
const databaseUrl = process.env.SITE_DATABASE_URL;
if (!databaseUrl || !sourcePath) {
  console.error("Usage: SITE_DATABASE_URL=... node scripts/verify-site-records.mjs SITE-RECORDS.json");
  process.exit(1);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function canonical(rows) {
  return JSON.stringify([...rows].map(stable).sort((a, b) => String(a.id ?? "").localeCompare(String(b.id ?? ""))));
}

function sha(value) {
  return createHash("sha256").update(value).digest("hex");
}

const source = JSON.parse(await readFile(sourcePath, "utf8"));
if (source.format !== "repanel-site-records-v1") throw new Error("Неизвестный формат источника");

const client = new Client({ connectionString: databaseUrl, application_name: "repanel-site-verify" });
await client.connect();
const result = await client.query("select collection, body from site_records order by collection, id");
await client.end();

const target = Object.groupBy(result.rows, (row) => row.collection);
const report = {};
let matches = true;

for (const [collection, sourceRows] of Object.entries(source.collections)) {
  const targetRows = (target[collection] ?? []).map((row) => row.body);
  const sourceHash = sha(canonical(sourceRows));
  const targetHash = sha(canonical(targetRows));
  const equal = sourceHash === targetHash && sourceRows.length === targetRows.length;
  report[collection] = { source: sourceRows.length, target: targetRows.length, source_sha256: sourceHash, target_sha256: targetHash, matches: equal };
  matches &&= equal;
}

console.log(JSON.stringify({ matches, collections: report }));
if (!matches) process.exit(1);
