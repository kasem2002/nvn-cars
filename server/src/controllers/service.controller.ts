import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const publicOnly = !req.admin;
  const services = await prisma.service.findMany({
    where: publicOnly ? { active: true } : undefined,
    orderBy: { order: "asc" },
  });
  res.json(services);
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) throw ApiError.notFound("Service not found");
  res.json(service);
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.create({ data: req.body });
  res.status(201).json(service);
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!service) throw ApiError.notFound("Service not found");
  res.json(service);
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  await prisma.service.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Service not found");
  });
  res.status(204).send();
});
