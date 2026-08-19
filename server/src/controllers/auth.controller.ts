import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { signAdminToken } from "../utils/jwt";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signAdminToken({ sub: admin.id, email: admin.email, role: admin.role });
  res.json({
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) throw ApiError.unauthorized();
  const admin = await prisma.admin.findUnique({ where: { id: req.admin.sub } });
  if (!admin) throw ApiError.unauthorized();
  res.json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
});
