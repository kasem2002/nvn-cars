import { z } from "zod";

export const socialPostSchema = z.object({
  image: z.string().min(1),
  captionEn: z.string().optional().nullable(),
  captionAr: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  postedAt: z.coerce.date().optional().nullable(),
  order: z.number().int().optional(),
});

export const socialPostUpdateSchema = socialPostSchema.partial();
