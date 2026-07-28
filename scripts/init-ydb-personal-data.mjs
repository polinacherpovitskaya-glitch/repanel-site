import { connectYdb, ensurePersonalDataSchema, getYdbTableName } from "./ydb-client.mjs";

const { driver, sql } = await connectYdb();
try {
  await ensurePersonalDataSchema(sql);
  console.log(`YDB schema ready: ${getYdbTableName()}`);
} finally {
  driver.close();
}

