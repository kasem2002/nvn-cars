import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const publicOnly = !req.admin;
  const reviews = await prisma.review.findMany({
    where: publicOnly ? { approved: true } : undefined,
    orderBy: { date: "desc" },
  });
  res.json(reviews);
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.create({ data: req.body });
  res.status(201).json(review);
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!review) throw ApiError.notFound("Review not found");
  res.json(review);
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  await prisma.review.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Review not found");
  });
  res.status(204).send();
});
