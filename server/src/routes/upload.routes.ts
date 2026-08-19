import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth";
import { uploadImage } from "../middleware/upload";
import { ApiError } from "../utils/ApiError";

export const uploadRouter = Router();

uploadRouter.post("/", requireAdmin, (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new ApiError(400, err.code === "LIMIT_FILE_SIZE" ? "Image must be 8MB or smaller" : err.message));
      return;
    }
    if (err) {
      next(err instanceof ApiError ? err : new ApiError(400, "Upload failed"));
      return;
    }
    if (!req.file) {
      next(ApiError.badRequest("No file uploaded"));
      return;
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});
