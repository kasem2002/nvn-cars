import { Router } from "express";
import { createReview, deleteReview, listReviews, updateReview } from "../controllers/review.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { reviewSchema, reviewUpdateSchema } from "../validators/review.validator";

export const reviewRouter = Router();

reviewRouter.get("/", optionalAdmin, listReviews);
reviewRouter.post("/", validateBody(reviewSchema), createReview);
reviewRouter.put("/:id", requireAdmin, validateBody(reviewUpdateSchema), updateReview);
reviewRouter.delete("/:id", requireAdmin, deleteReview);
