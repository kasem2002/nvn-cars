import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listBeforeAfter = asyncHandler(async (req: Request, res: Response) => {
  const items = await prisma.beforeAfter.findMany({ orderBy: { order: "asc" } });
  res.json(items);
});

export const createBeforeAfter = asyncHandler(async (req: Request, res: Response) => {
  const item = await prisma.beforeAfter.create({ data: req.body });
  res.status(201).json(item);
});

export const updateBeforeAfter = asyncHandler(async (req: Request, res: Response) => {
  const item = await prisma.beforeAfter
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!item) throw ApiError.notFound("Before/After item not found");
  res.json(item);
});

export const deleteBeforeAfter = asyncHandler(async (req: Request, res: Response) => {
  await prisma.beforeAfter.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Before/After item not found");
  });
  res.status(204).send();
});
