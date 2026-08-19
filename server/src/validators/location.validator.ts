import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional().nullable(),
  address: z.string().min(1),
  addressAr: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  wazeUrl: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  workingHours: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export const locationUpdateSchema = locationSchema.partial();
