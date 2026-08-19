import { Router } from "express";
import {
  createBeforeAfter,
  deleteBeforeAfter,
  listBeforeAfter,
  updateBeforeAfter,
} from "../controllers/beforeAfter.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { beforeAfterSchema, beforeAfterUpdateSchema } from "../validators/beforeAfter.validator";

export const beforeAfterRouter = Router();

beforeAfterRouter.get("/", listBeforeAfter);
beforeAfterRouter.post("/", requireAdmin, validateBody(beforeAfterSchema), createBeforeAfter);
beforeAfterRouter.put("/:id", requireAdmin, validateBody(beforeAfterUpdateSchema), updateBeforeAfter);
beforeAfterRouter.delete("/:id", requireAdmin, deleteBeforeAfter);
