import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
} from "@/constants/evidence";

export const isAllowedEvidenceType = (mime: string): boolean =>
  ALLOWED_MIME_TYPES.includes(mime);

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
