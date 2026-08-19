import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listGalleryItems = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  const items = await prisma.galleryItem.findMany({
    where: typeof category === "string" && category !== "all" ? { category } : undefined,
    orderBy: { order: "asc" },
  });
  res.json(items);
});

export const createGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await prisma.galleryItem.create({ data: req.body });
  res.status(201).json(item);
});

export const updateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await prisma.galleryItem
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!item) throw ApiError.notFound("Gallery item not found");
  res.json(item);
});

export const deleteGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  await prisma.galleryItem.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Gallery item not found");
  });
  res.status(204).send();
});
