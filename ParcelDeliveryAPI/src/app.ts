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

// Debug: Log all registered routes
if (process.env.NODE_ENV !== 'production') {
  console.log('\n📋 Registered Routes:');
  const routes: any[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods).join(', ').toUpperCase()
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const path = middleware.regexp.source.replace(/\\/g, '').replace(/\^|\$/g, '').replace(/\?\(\?=\/\|\$\)/g, '');
          routes.push({
            path: path + handler.route.path,
            methods: Object.keys(handler.route.methods).join(', ').toUpperCase()
          });
        }
      });
    }
  });
  routes.forEach(r => console.log(`  ${r.methods.padEnd(10)} ${r.path}`));
  console.log('');
}

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
