const required = [
  "SITE_DATABASE_URL",
  "SITE_STORAGE_BUCKET",
  "SITE_STORAGE_ACCESS_KEY_ID",
  "SITE_STORAGE_SECRET_ACCESS_KEY",
  "SITE_STORAGE_PUBLIC_BASE_URL",
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Не заданы обязательные переменные: ${missing.join(", ")}`);
  process.exit(1);
}

const forbidden = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "YDB_CONNECTION_STRING",
  "YDB_METADATA_CREDENTIALS",
  "YDB_SERVICE_ACCOUNT_KEY_FILE_CREDENTIALS",
  "PERSONAL_DATA_BACKEND",
];

const presentForbidden = forbidden.filter((key) => process.env[key]);
if (presentForbidden.length) {
  console.error(`В runtime остались переменные прежнего контура: ${presentForbidden.join(", ")}`);
  process.exit(1);
}

const database = new URL(process.env.SITE_DATABASE_URL);
if (database.protocol !== "postgres:" && database.protocol !== "postgresql:") {
  console.error("SITE_DATABASE_URL должен указывать на PostgreSQL");
  process.exit(1);
}

const storageBase = new URL(process.env.SITE_STORAGE_PUBLIC_BASE_URL);
if (storageBase.protocol !== "https:" || !storageBase.hostname.endsWith("storage.yandexcloud.net")) {
  console.error("SITE_STORAGE_PUBLIC_BASE_URL должен указывать на Yandex Object Storage по HTTPS");
  process.exit(1);
}

console.log("Yandex data-plane configuration: OK");
