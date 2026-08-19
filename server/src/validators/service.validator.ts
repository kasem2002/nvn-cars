import { z } from "zod";

export const serviceSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  detailedDescriptionEn: z.string().optional().nullable(),
  detailedDescriptionAr: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
  duration: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const serviceUpdateSchema = serviceSchema.partial();
