import { Router } from "express";
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from "../controllers/service.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { serviceSchema, serviceUpdateSchema } from "../validators/service.validator";

export const serviceRouter = Router();

serviceRouter.get("/", optionalAdmin, listServices);
serviceRouter.get("/:id", getService);
serviceRouter.post("/", requireAdmin, validateBody(serviceSchema), createService);
serviceRouter.put("/:id", requireAdmin, validateBody(serviceUpdateSchema), updateService);
serviceRouter.delete("/:id", requireAdmin, deleteService);
