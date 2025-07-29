// import express from "express";
// import {
//   createUser,
//   loginUser,
//   logoutCurrentUser,
//   getAllUsers,
//   getCurrentUserProfile,
//   updateCurrentUserProfile,
//   refreshToken,
// } from "../controllers/userController.js";

// import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
// import loginLimiter from "../middlewares/rateLimiter.js";

// const router = express.Router();

// // Register and get all users (admin only)
// router
//   .route("/")
//   .post(createUser)
//   .get(authenticate, authorizeAdmin, getAllUsers);

// // Login route with rate limiter
// router.post("/auth", loginLimiter, loginUser);

// // Logout route
// router.post("/logout", logoutCurrentUser);

// // Refresh token route - no auth middleware needed, token from cookie
// router.get("/refresh", refreshToken);

// // User profile routes
// router
//   .route("/profile")
//   .get(authenticate, getCurrentUserProfile)
//   .put(authenticate, updateCurrentUserProfile);

// export default router;


import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  refreshToken,
  verifyUser, // ✅ ADD THIS
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import loginLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

// Register and get all users (admin only)
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

// ✅ NEW: Verify OTP
router.post("/verify", verifyUser);

// Login route with rate limiter
router.post("/auth", loginLimiter, loginUser);

// Logout route
router.post("/logout", logoutCurrentUser);

// Refresh token route
router.get("/refresh", refreshToken);

// User profile routes
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

export default router;
