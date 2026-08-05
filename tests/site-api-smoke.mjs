import assert from "node:assert/strict";

const baseUrl = (process.env.REPANEL_SITE_SMOKE_URL ?? "http://127.0.0.1:3300").replace(/\/$/, "");
const expectedProducts = Number(process.env.REPANEL_SITE_EXPECTED_PRODUCTS ?? "7");

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    ...init,
  });
  return response;
}

const healthResponse = await request("/api/health");
assert.equal(healthResponse.status, 200, "health endpoint must return 200");
const health = await healthResponse.json();
assert.deepEqual(
  { ok: health.ok, database: health.database, writeFreeze: health.writeFreeze },
  { ok: true, database: "ok", writeFreeze: false },
);
assert.equal(typeof health.version, "string");
assert.ok(health.version.length > 0, "health endpoint must expose an immutable version");

const catalogResponse = await request("/api/catalog/products");
assert.equal(catalogResponse.status, 200, "catalog endpoint must return 200");
const catalog = await catalogResponse.json();
assert.ok(Array.isArray(catalog.products), "catalog response must contain products[]");
assert.equal(catalog.products.length, expectedProducts);
for (const product of catalog.products) {
  assert.deepEqual(Object.keys(product).sort(), ["id", "image_url", "price", "slug", "title"]);
}

for (const path of ["/", "/privacy", "/catalog", "/admin/login"]) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path} must return 200`);
}

const emptyCheckout = await request("/api/tochka-payment", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{}",
});
assert.equal(emptyCheckout.status, 400, "an order without consent must be rejected before mutation");

const webhookHealth = await request("/api/tochka-webhook");
assert.equal(webhookHealth.status, 200, "webhook health check must return 200");

console.log(`site API smoke passed: ${baseUrl} (${catalog.products.length} products)`);
