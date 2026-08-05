import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} не задан`);
  return value;
};

const endpoint = process.env.SITE_STORAGE_ENDPOINT || "https://storage.yandexcloud.net";
const region = process.env.SITE_STORAGE_REGION || "ru-central1";
const bucket = required("SITE_STORAGE_BUCKET");
const publicBase = required("SITE_STORAGE_PUBLIC_BASE_URL").replace(/\/$/, "");
const body = Buffer.from("repanel-site-object-storage-ok\n");
const key = "system/migration-smoke.txt";

const client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId: required("SITE_STORAGE_ACCESS_KEY_ID"),
    secretAccessKey: required("SITE_STORAGE_SECRET_ACCESS_KEY"),
  },
});

await client.send(new PutObjectCommand({
  Bucket: bucket,
  Key: key,
  Body: body,
  ContentType: "text/plain; charset=utf-8",
  CacheControl: "no-store",
}));

const response = await fetch(`${publicBase}/${key}`, { cache: "no-store" });
if (!response.ok) throw new Error(`Публичное чтение: HTTP ${response.status}`);
const downloaded = Buffer.from(await response.arrayBuffer());
if (!downloaded.equals(body)) throw new Error("Содержимое smoke-объекта не совпало");

console.log(JSON.stringify({ upload: "ok", public_read: "ok", key, bytes: body.length }));
