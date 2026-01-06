import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Load environment variables FIRST
dotenv.config();

import passport from "passport";
import "./config/passport"; // Initialize passport config after env vars loaded
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { router } from "./routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport
console.log('🔧 Initializing Passport...');
app.use(passport.initialize());
console.log('✅ Passport initialized');

// Routes
console.log('🔧 Mounting /api routes...');
app.use("/api", router);
console.log('✅ Routes mounted on /api');

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
