import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError";

export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const extension = ALLOWED_MIME_TYPES[file.mimetype];
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      cb(new ApiError(400, "Only JPEG, PNG, WebP, GIF, or AVIF images are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("file");
