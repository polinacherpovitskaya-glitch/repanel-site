import { Driver } from "@ydbjs/core";
import { EnvironCredentialsProvider } from "@ydbjs/auth/environ";
import { AccessTokenCredentialsProvider } from "@ydbjs/auth/access-token";
import { query } from "@ydbjs/query";
import { JsonDocument } from "@ydbjs/value/primitive";
import { readFile } from "node:fs/promises";
import { constants, createPrivateKey, sign } from "node:crypto";
import https from "node:https";

const DEFAULT_TABLE = "personal_data_records";

export function getYdbTableName() {
  const value = process.env.YDB_PERSONAL_DATA_TABLE ?? DEFAULT_TABLE;
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
    throw new Error("YDB_PERSONAL_DATA_TABLE содержит недопустимое имя таблицы");
  }
  return value;
}

async function iamTokenFromServiceAccountFile(filePath) {
  const key = JSON.parse(await readFile(filePath, "utf8"));
  const endpoint =
    process.env.YDB_IAM_ENDPOINT ??
    "https://iam.api.cloud.yandex.net/iam/v1/tokens";
  const now = Math.floor(Date.now() / 1000);
  const encodedHeader = Buffer.from(
    JSON.stringify({ typ: "JWT", alg: "PS256", kid: key.id }),
  ).toString("base64url");
  const encodedPayload = Buffer.from(
    JSON.stringify({
      iss: key.service_account_id,
      aud: endpoint,
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const signature = sign("sha256", Buffer.from(unsigned), {
    key: createPrivateKey({ key: key.private_key, format: "pem" }),
    padding: constants.RSA_PKCS1_PSS_PADDING,
    saltLength: 32,
  }).toString("base64url");
  const payload = JSON.stringify({ jwt: `${unsigned}.${signature}` });

  const response = await new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const request = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: "POST",
        family: 4,
        timeout: 15_000,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`IAM API error: ${res.statusCode ?? "unknown"}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      },
    );
    request.on("timeout", () => request.destroy(new Error("IAM API timeout")));
    request.on("error", reject);
    request.end(payload);
  });

  if (!response || typeof response !== "object" || !response.iamToken) {
    throw new Error("IAM API response missing iamToken");
  }
  return response.iamToken;
}

export async function connectYdb() {
  const connectionString = process.env.YDB_CONNECTION_STRING;
  if (!connectionString) throw new Error("YDB_CONNECTION_STRING не задан");

  const serviceAccountKeyFile =
    process.env.YDB_SERVICE_ACCOUNT_KEY_FILE_CREDENTIALS;
  const credentials = serviceAccountKeyFile
    ? new AccessTokenCredentialsProvider({
        token: await iamTokenFromServiceAccountFile(serviceAccountKeyFile),
      })
    : new EnvironCredentialsProvider(connectionString);
  const driver = new Driver(connectionString, {
    credentialsProvider: credentials,
    secureOptions:
      credentials instanceof EnvironCredentialsProvider
        ? credentials.secureOptions
        : undefined,
    "ydb.sdk.application": "repanel-migration",
  });
  await driver.ready();
  return { driver, sql: query(driver, { poolOptions: { maxSize: 5 } }) };
}

export async function ensurePersonalDataSchema(sql) {
  const table = getYdbTableName();
  await sql`
    CREATE TABLE IF NOT EXISTS ${sql.identifier(table)} (
      collection Utf8 NOT NULL,
      id Utf8 NOT NULL,
      body JsonDocument NOT NULL,
      created_at Timestamp NOT NULL,
      updated_at Timestamp NOT NULL,
      PRIMARY KEY (collection, id)
    )
  `;
}

export async function upsertPersonalDataRow(sql, collection, row) {
  const table = getYdbTableName();
  const id = String(row.id);
  const now = new Date();
  await sql`
    UPSERT INTO ${sql.identifier(table)}
      (collection, id, body, created_at, updated_at)
    VALUES
      (${collection}, ${id}, ${new JsonDocument(JSON.stringify(row))}, ${now}, ${now})
  `.idempotent(true);
}

export async function countPersonalDataRows(sql, collection) {
  const table = getYdbTableName();
  const resultSets = await sql`
    SELECT COUNT(*) AS count
    FROM ${sql.identifier(table)}
    WHERE collection = ${collection}
  `.isolation("onlineReadOnly", { allowInconsistentReads: false });
  return Number(resultSets[0]?.[0]?.count ?? 0);
}
