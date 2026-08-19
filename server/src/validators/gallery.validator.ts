import { z } from "zod";

export const galleryItemSchema = z.object({
  image: z.string().min(1),
  captionEn: z.string().optional().nullable(),
  captionAr: z.string().optional().nullable(),
  category: z.string().min(1),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const galleryItemUpdateSchema = galleryItemSchema.partial();
