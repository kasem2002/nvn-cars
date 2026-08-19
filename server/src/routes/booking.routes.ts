import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createBooking,
  deleteBooking,
  getBooking,
  listBookings,
  updateBookingStatus,
} from "../controllers/booking.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { bookingSchema, bookingStatusSchema } from "../validators/booking.validator";

export const bookingRouter = Router();

const createBookingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 });

bookingRouter.get("/", requireAdmin, listBookings);
bookingRouter.get("/:id", requireAdmin, getBooking);
bookingRouter.post("/", createBookingLimiter, validateBody(bookingSchema), createBooking);
bookingRouter.put("/:id/status", requireAdmin, validateBody(bookingStatusSchema), updateBookingStatus);
bookingRouter.delete("/:id", requireAdmin, deleteBooking);
