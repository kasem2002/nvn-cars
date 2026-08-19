import { z } from "zod";

export const beforeAfterSchema = z.object({
  vehicleName: z.string().min(1),
  vehicleCategory: z.string().optional().nullable(),
  beforeImage: z.string().min(1),
  afterImage: z.string().min(1),
  serviceName: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  date: z.coerce.date().optional().nullable(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const beforeAfterUpdateSchema = beforeAfterSchema.partial();
