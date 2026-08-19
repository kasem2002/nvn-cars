import { z } from "zod";

export const BOOKING_STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"] as const;

export const bookingSchema = z.object({
  serviceId: z.string().optional().nullable(),
  vehicleType: z.string().min(1),
  vehicleMake: z.string().optional().nullable(),
  vehicleModel: z.string().optional().nullable(),
  vehicleYear: z.string().optional().nullable(),
  vehicleColor: z.string().optional().nullable(),
  customerName: z.string().min(1),
  phone: z.string().min(6),
  whatsapp: z.string().optional().nullable(),
  preferredDate: z.coerce.date(),
  preferredTime: z.string().min(1),
  notes: z.string().optional().nullable(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
  internalNotes: z.string().optional().nullable(),
});
