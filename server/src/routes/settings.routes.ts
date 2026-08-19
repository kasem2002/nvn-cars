import { Router } from "express";
import { getOverview, getSettings, updateSettings } from "../controllers/settings.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { settingsSchema } from "../validators/settings.validator";

export const settingsRouter = Router();

settingsRouter.get("/", getSettings);
settingsRouter.put("/", requireAdmin, validateBody(settingsSchema), updateSettings);

export const overviewRouter = Router();
overviewRouter.get("/", requireAdmin, getOverview);
