import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

export const isAllowedEvidenceType = (mime: string): boolean =>
  ALLOWED_TYPES.includes(mime);

export const isAllowedEvidenceName = (name: string): boolean =>
  ALLOWED_EXTENSIONS.includes(path.extname(name).toLowerCase());

/**
 * Validate and store one evidence file under uploads/alarms/{alarmId}/.
 * Returns URL path like /uploads/alarms/{alarmId}/timestamp_originalname.ext
 * Uses public dir so URL is served by Next.js.
 */
export const uploadEvidenceFile = async (
  alarmId: string,
  file: File,
  baseDir: string = process.cwd(),
): Promise<{ url: string; fileType: string }> => {
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
  return {
    url: `/uploads/alarms/${alarmId}/${safeName}`,
    fileType: "image",
  };
};
