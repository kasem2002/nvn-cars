import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listSocialPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await prisma.socialPost.findMany({ orderBy: { order: "asc" } });
  res.json(posts);
});

export const createSocialPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.socialPost.create({ data: req.body });
  res.status(201).json(post);
});

export const updateSocialPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.socialPost
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!post) throw ApiError.notFound("Social post not found");
  res.json(post);
});

export const deleteSocialPost = asyncHandler(async (req: Request, res: Response) => {
  await prisma.socialPost.delete({ where: { id: req.params.id } }).catch(() => {
    throw ApiError.notFound("Social post not found");
  });
  res.status(204).send();
});
