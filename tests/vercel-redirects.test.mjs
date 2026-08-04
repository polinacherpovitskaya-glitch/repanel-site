import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const config = JSON.parse(
  await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
);

test("the legacy apex homepage redirects before the catch-all route", () => {
  const rootIndex = config.redirects.findIndex((route) => route.source === "/");
  const catchAllIndex = config.redirects.findIndex(
    (route) => route.source === "/:path*",
  );

  assert.notEqual(rootIndex, -1, "missing an explicit redirect for /");
  assert.notEqual(catchAllIndex, -1, "missing the legacy-domain catch-all");
  assert.ok(rootIndex < catchAllIndex, "the exact root route must run first");
  assert.deepEqual(config.redirects[rootIndex], {
    source: "/",
    destination: "https://site.re-panel.ru/",
    permanent: false,
  });
});
