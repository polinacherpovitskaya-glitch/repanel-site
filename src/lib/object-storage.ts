import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let storageClient: S3Client | null = null;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} не задан`);
  return value;
}

function client(): S3Client {
  if (!storageClient) {
    storageClient = new S3Client({
      endpoint: process.env.SITE_STORAGE_ENDPOINT || "https://storage.yandexcloud.net",
      region: process.env.SITE_STORAGE_REGION || "ru-central1",
      credentials: {
        accessKeyId: required("SITE_STORAGE_ACCESS_KEY_ID"),
        secretAccessKey: required("SITE_STORAGE_SECRET_ACCESS_KEY"),
      },
    });
  }
  return storageClient;
}

function bucket(): string {
  return required("SITE_STORAGE_BUCKET");
}

function safeKey(key: string): string {
  if (!/^[a-zA-Z0-9/_.-]+$/.test(key) || key.includes("..") || key.startsWith("/")) {
    throw new Error("Недопустимый ключ объекта");
  }
  return key;
}

export async function putProductImage(key: string, body: Buffer, contentType: string): Promise<string> {
  const checkedKey = safeKey(key);
  await client().send(new PutObjectCommand({
    Bucket: bucket(),
    Key: checkedKey,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
    IfNoneMatch: "*",
  }));

  const base = process.env.SITE_STORAGE_PUBLIC_BASE_URL || `https://${bucket()}.storage.yandexcloud.net`;
  const encoded = checkedKey.split("/").map(encodeURIComponent).join("/");
  return `${base.replace(/\/$/, "")}/${encoded}`;
}
