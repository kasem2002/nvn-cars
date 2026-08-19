import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { asyncHandler } from "../utils/asyncHandler";

const SETTINGS_ID = "singleton";

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID },
    update: {},
  });
  res.json(settings);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...req.body },
    update: req.body,
  });
  res.json(settings);
});

export const getOverview = asyncHandler(async (req: Request, res: Response) => {
  const [totalBookings, pending, confirmed, completed, services, gallery, reviews] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.booking.count({ where: { status: "completed" } }),
    prisma.service.count(),
    prisma.galleryItem.count(),
    prisma.review.count(),
  ]);

  res.json({
    totalBookings,
    pendingBookings: pending,
    confirmedBookings: confirmed,
    completedBookings: completed,
    services,
    galleryItems: gallery,
    reviews,
  });
});
