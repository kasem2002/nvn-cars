import { Router } from "express";
import {
  createSocialPost,
  deleteSocialPost,
  listSocialPosts,
  updateSocialPost,
} from "../controllers/socialPost.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { socialPostSchema, socialPostUpdateSchema } from "../validators/socialPost.validator";

export const socialPostRouter = Router();

socialPostRouter.get("/", listSocialPosts);
socialPostRouter.post("/", requireAdmin, validateBody(socialPostSchema), createSocialPost);
socialPostRouter.put("/:id", requireAdmin, validateBody(socialPostUpdateSchema), updateSocialPost);
socialPostRouter.delete("/:id", requireAdmin, deleteSocialPost);
