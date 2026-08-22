import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth";
import { uploadImage } from "../middleware/upload";
import { ApiError } from "../utils/ApiError";

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  requireAdmin,
  uploadImage,
  (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      next(new ApiError(400, err.code === "LIMIT_FILE_SIZE" ? "Image must be 16MB or smaller" : err.message));
      return;
    }
    if (err) {
      next(err instanceof ApiError ? err : new ApiError(400, "Upload failed"));
      return;
    }
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      next(ApiError.badRequest("No file uploaded"));
      return;
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  }
);
