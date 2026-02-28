import path from "path";

import { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS } from "@/constants/evidence";

//  Returns true if the given MIME type is allowed for evidence uploads (JPEG/PNG).
export const isAllowedEvidenceMimeType = (mime: string): boolean =>
  ALLOWED_MIME_TYPES.includes(mime);

//  Returns true if the file name has an allowed extension (.jpg, .jpeg, .png).
export const isAllowedEvidenceFileName = (name: string): boolean =>
  ALLOWED_EXTENSIONS.includes(path.extname(name).toLowerCase());
