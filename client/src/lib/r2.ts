import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_EXT = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg"]);
export type UploadCategory = "publications" | "gallery" | "avatars" | "sponsors" | "events";

export function sanitizeFilename(name: string): string {
  // Strip path traversal and dangerous characters, keep only alphanumeric + dot
  return name.replace(/[^a-zA-Z0-9.]/g, "");
}

export function buildObjectKey({
  category,
  filename,
  id,
}: {
  category: UploadCategory;
  filename: string;
  id: string;
}): string {
  const safe = sanitizeFilename(filename);
  const ext = safe.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.has(ext)) throw new Error(`Disallowed extension: ${ext}`);
  return `${category}/${id}/${randomUUID()}.${ext}`;
}

export function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function presignPut(
  key: string,
  contentType: string,
  expiresIn = 600
): Promise<string> {
  const client = r2Client();
  const cmd = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, cmd, { expiresIn });
}

export function publicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL_BASE}/${key}`;
}
