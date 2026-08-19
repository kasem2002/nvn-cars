import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listBookings = asyncHandler(async (req: Request, res: Response) => {
  const { status, serviceId, from, to, search } = req.query;

  const bookings = await prisma.booking.findMany({
    where: {
      status: typeof status === "string" ? status : undefined,
      serviceId: typeof serviceId === "string" ? serviceId : undefined,
      preferredDate: {
        gte: typeof from === "string" ? new Date(from) : undefined,
        lte: typeof to === "string" ? new Date(to) : undefined,
      },
      OR:
        typeof search === "string" && search.length > 0
          ? [
              { customerName: { contains: search } },
              { phone: { contains: search } },
            ]
          : undefined,
    },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(bookings);
});

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: { service: true },
  });
  if (!booking) throw ApiError.notFound("Booking not found");
  res.json(booking);
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await prisma.booking.create({ data: req.body });
  res.status(201).json(booking);
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const booking = await prisma.booking
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!booking) throw ApiError.notFound("Booking not found");
  res.json(booking);
});

export const deleteBooking = asyncHandler(async (req: Request, res: Response) => {
  await prisma.booking.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Booking not found");
  });
  res.status(204).send();
});
