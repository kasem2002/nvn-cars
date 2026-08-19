import { Router } from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  listGalleryItems,
  updateGalleryItem,
} from "../controllers/gallery.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { galleryItemSchema, galleryItemUpdateSchema } from "../validators/gallery.validator";

export const galleryRouter = Router();

galleryRouter.get("/", listGalleryItems);
galleryRouter.post("/", requireAdmin, validateBody(galleryItemSchema), createGalleryItem);
galleryRouter.put("/:id", requireAdmin, validateBody(galleryItemUpdateSchema), updateGalleryItem);
galleryRouter.delete("/:id", requireAdmin, deleteGalleryItem);
