import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listLocations = asyncHandler(async (req: Request, res: Response) => {
  const publicOnly = !req.admin;
  const locations = await prisma.location.findMany({
    where: publicOnly ? { active: true } : undefined,
    orderBy: { createdAt: "asc" },
  });
  res.json(locations);
});

export const createLocation = asyncHandler(async (req: Request, res: Response) => {
  const location = await prisma.location.create({ data: req.body });
  res.status(201).json(location);
});

export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const location = await prisma.location
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!location) throw ApiError.notFound("Location not found");
  res.json(location);
});

export const deleteLocation = asyncHandler(async (req: Request, res: Response) => {
  await prisma.location.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Location not found");
  });
  res.status(204).send();
});
