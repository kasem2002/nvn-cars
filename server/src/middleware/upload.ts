import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const RASTER_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const PASSTHROUGH_MIME_TYPES: Record<string, string> = {
  "image/svg+xml": ".svg",
};

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

/**
 * Multer buffers the incoming file in memory, then sharp downscales it
 * to a max width of 1920px and re-encodes it as WebP at ~80 quality.
 * Vector formats (SVG) are written through unchanged since sharp would
 * rasterize them and lose scalability.
 */
const memoryStorage = multer.memoryStorage();

const multerHandler = multer({
  storage: memoryStorage,
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (RASTER_MIME_TYPES.has(file.mimetype) || PASSTHROUGH_MIME_TYPES[file.mimetype]) {
      cb(null, true);
      return;
    }
    cb(new ApiError(400, "Only JPEG, PNG, WebP, GIF, AVIF, or SVG images are allowed"));
  },
}).single("file");

export function uploadImage(req: Request, res: Response, next: NextFunction) {
  multerHandler(req, res, async (err) => {
    if (err) {
      next(err);
      return;
    }
    if (!req.file) {
      next();
      return;
    }
    try {
      const id = crypto.randomUUID();
      const passthroughExt = PASSTHROUGH_MIME_TYPES[req.file.mimetype];

      if (passthroughExt) {
        const filename = `${id}${passthroughExt}`;
        await fs.promises.writeFile(path.join(UPLOADS_DIR, filename), req.file.buffer);
        req.file.filename = filename;
        next();
        return;
      }

      const filename = `${id}.webp`;
      await sharp(req.file.buffer, { failOn: "none" })
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(UPLOADS_DIR, filename));
      req.file.filename = filename;
      next();
    } catch (e) {
      next(new ApiError(400, "Uploaded image could not be processed"));
    }
  });
}
