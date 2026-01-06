/* eslint-disable quotes */
import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { parcelRoutes } from "../modules/parcel/parcel.routes";
import { userRoutes } from "../modules/user/user.routes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Parcel Delivery API is running successfully",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// API info endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Parcel Delivery API",
    version: "1.0.0",
    documentation: "/api/health for health check",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      parcels: "/api/parcels",
    },
  });
});

// Module routes
const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/parcels",
    route: parcelRoutes,
  },
];

// Register all module routes
console.log('\n📋 Registering module routes:');
moduleRoutes.forEach((moduleRoute) => {
  console.log(`   🔗 ${moduleRoute.path}`);
  router.use(moduleRoute.path, moduleRoute.route);
});

console.log('✅ All module routes registered\n');

export { router };
