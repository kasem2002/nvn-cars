import { z } from "zod";

export const reviewSchema = z.object({
  customerName: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  reviewEn: z.string().min(1),
  reviewAr: z.string().optional().nullable(),
  vehicle: z.string().optional().nullable(),
  customerImage: z.string().optional().nullable(),
  date: z.coerce.date().optional(),
  featured: z.boolean().optional(),
  approved: z.boolean().optional(),
});

export const reviewUpdateSchema = reviewSchema.partial();
