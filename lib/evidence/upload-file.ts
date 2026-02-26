import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export function isAllowedEvidenceType(mime: string): boolean {
  return ALLOWED_TYPES.includes(mime);
}

export function isAllowedEvidenceName(name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  return [".jpg", ".jpeg", ".png"].includes(ext);
}

/**
 * Validate and store one evidence file under uploads/alarms/{alarmId}/.
 * Returns URL path like /uploads/alarms/{alarmId}/timestamp_originalname.ext
 * Uses public dir so URL is served by Next.js.
 */
export async function uploadEvidenceFile(
  alarmId: string,
  file: File,
  baseDir: string = process.cwd(),
): Promise<{ url: string; fileType: string }> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File too large (max 5MB): ${file.name}`);
  }
  const mime = file.type.toLowerCase();
  if (!isAllowedEvidenceType(mime) && !isAllowedEvidenceName(file.name)) {
    throw new Error("Only JPEG and PNG images are allowed");
  }
  const ext =
    path.extname(file.name) || (mime === "image/png" ? ".png" : ".jpg");
  const safeName =
    `${Date.now()}_${path.basename(file.name, path.extname(file.name))}${ext}`.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );
  const dir = path.join(baseDir, "public", "uploads", "alarms", alarmId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, safeName);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));
  const url = `/uploads/alarms/${alarmId}/${safeName}`;
  const fileType = "image";
  return { url, fileType };
}
