import { Router } from "express";
import { login, me } from "../controllers/auth.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { loginSchema } from "../validators/auth.validator";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", requireAdmin, me);
