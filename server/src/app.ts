import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { UPLOADS_DIR } from "./middleware/upload";
import { authRouter } from "./routes/auth.routes";
import { beforeAfterRouter } from "./routes/beforeAfter.routes";
import { bookingRouter } from "./routes/booking.routes";
import { galleryRouter } from "./routes/gallery.routes";
import { locationRouter } from "./routes/location.routes";
import { reviewRouter } from "./routes/review.routes";
import { serviceRouter } from "./routes/service.routes";
import { overviewRouter, settingsRouter } from "./routes/settings.routes";
import { socialPostRouter } from "./routes/socialPost.routes";
import { uploadRouter } from "./routes/upload.routes";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "7d" }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 });
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 });

app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/before-after", beforeAfterRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/locations", locationRouter);
app.use("/api/social-posts", socialPostRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/overview", overviewRouter);
app.use("/api/uploads", uploadLimiter, uploadRouter);

app.use(notFoundHandler);
app.use(errorHandler);
