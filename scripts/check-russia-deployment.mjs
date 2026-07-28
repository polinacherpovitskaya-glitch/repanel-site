const required = [
  "NEXT_PUBLIC_SITE_URL",
  "YDB_CONNECTION_STRING",
  "PERSONAL_DATA_BACKEND",
];

const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) {
  console.error(`Не заданы переменные: ${missing.join(", ")}`);
  process.exit(1);
}

function validHttpsUrl(name) {
  try {
    const value = new URL(process.env[name]);
    if (value.protocol !== "https:") throw new Error("требуется HTTPS");
    return value;
  } catch (error) {
    console.error(`${name}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

const siteUrl = validHttpsUrl("NEXT_PUBLIC_SITE_URL");
const ydbConnection = process.env.YDB_CONNECTION_STRING;
if (!ydbConnection.startsWith("grpcs://ydb.serverless.yandexcloud.net:2135/")) {
  console.error("YDB_CONNECTION_STRING не указывает на YDB Serverless.");
  process.exit(1);
}

if (!ydbConnection.includes("/ru-central1/")) {
  console.error("YDB_CONNECTION_STRING не подтверждает российский регион ru-central1.");
  process.exit(1);
}

if (process.env.PERSONAL_DATA_BACKEND !== "ydb") {
  console.error("PERSONAL_DATA_BACKEND должен быть равен ydb.");
  process.exit(1);
}

console.log(`Сайт: ${siteUrl.origin}`);
console.log("Персональные данные: YDB Serverless, ru-central1");
console.log("Базовая проверка российского контура пройдена.");
