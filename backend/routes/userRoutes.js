// import express from "express";
// import {
//   createUser,
//   loginUser,
//   logoutCurrentUser,
//   getAllUsers,
//   getCurrentUserProfile,
//   updateCurrentUserProfile,
//   refreshToken,
//   verifyUser, // ✅ ADD THIS
// } from "../controllers/userController.js";

// import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
// import loginLimiter from "../middlewares/rateLimiter.js";

// const router = express.Router();

// // Register and get all users (admin only)
// router
//   .route("/")
//   .post(createUser)
//   .get(authenticate, authorizeAdmin, getAllUsers);

// // ✅ NEW: Verify OTP
// router.post("/verify", verifyUser);

// // Login route with rate limiter
// router.post("/auth", loginLimiter, loginUser);

// // Logout route
// router.post("/logout", logoutCurrentUser);

// // Refresh token route
// router.get("/refresh", refreshToken);

// // User profile routes
// router
//   .route("/profile")
//   .get(authenticate, getCurrentUserProfile)
//   .put(authenticate, updateCurrentUserProfile);

// export default router;



import express from "express";
import { body } from "express-validator"; // ✅ Import body from express-validator
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  refreshToken,
  verifyUser,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import loginLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

// ✅ Validation middleware for createUser
const registerValidation = [
  body("username")
    .trim() // Remove leading/trailing whitespace
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(), // Standardize email format (e.g., lowercase)
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];

// Register and get all users (admin only)
router
  .route("/")
  .post(registerValidation, createUser) // ✅ Add validation middleware here
  .get(authenticate, authorizeAdmin, getAllUsers);

// Verify OTP
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

