import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { AdminTokenPayload, verifyAdminToken } from "../utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export function optionalAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      req.admin = verifyAdminToken(header.slice("Bearer ".length));
    } catch {
      // ignore invalid token on optional auth routes
    }
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing authentication token");
  }

  const token = header.slice("Bearer ".length);
  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
}
