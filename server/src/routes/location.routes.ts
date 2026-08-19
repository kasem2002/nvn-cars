import { Router } from "express";
import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from "../controllers/location.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { locationSchema, locationUpdateSchema } from "../validators/location.validator";

export const locationRouter = Router();

locationRouter.get("/", optionalAdmin, listLocations);
locationRouter.post("/", requireAdmin, validateBody(locationSchema), createLocation);
locationRouter.put("/:id", requireAdmin, validateBody(locationUpdateSchema), updateLocation);
locationRouter.delete("/:id", requireAdmin, deleteLocation);
