import assert from "node:assert/strict";
import test from "node:test";
import { matchesLike, serverDbTesting, SiteQueryBuilder } from "../src/lib/server-db";

test("ilike implements percent, underscore and case-insensitive matching", () => {
  assert.equal(matchesLike("RP-SALE-2026", "rp-%"), true);
  assert.equal(matchesLike("ABC", "A_C"), true);
  assert.equal(matchesLike("ABC", "A_D"), false);
});

test("filters combine eq, neq, in and ilike", () => {
  const row = { id: "p1", title: "Стол RePanel", price: 12000, published: true };
  assert.equal(serverDbTesting.matchesFilters(row, [
    { kind: "eq", column: "published", value: true },
    { kind: "neq", column: "id", value: "p2" },
    { kind: "in", column: "price", values: [5000, 12000] },
    { kind: "ilike", column: "title", pattern: "%repanel%" },
  ]), true);
});

test("projection and ordering preserve the PostgREST subset", () => {
  assert.deepEqual(serverDbTesting.project({ id: "p1", title: "Стол", price: 12 }, "id, price"), {
    id: "p1",
    price: 12,
  });
  assert.equal(serverDbTesting.compareValues(12, 7), 5);
  assert.equal(serverDbTesting.compareValues("2026-08-05T00:00:00Z", "2026-08-04T00:00:00Z") > 0, true);
});

test("write freeze rejects mutations before connecting to PostgreSQL", async () => {
  const previous = process.env.CUTOVER_WRITE_FREEZE;
  process.env.CUTOVER_WRITE_FREEZE = "1";
  try {
    const result = await new SiteQueryBuilder("products").insert({ title: "test" });
    assert.equal(result.status, 503);
    assert.equal(result.error?.code, "WRITE_FROZEN");
  } finally {
    if (previous == null) delete process.env.CUTOVER_WRITE_FREEZE;
    else process.env.CUTOVER_WRITE_FREEZE = previous;
  }
});
