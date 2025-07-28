// import express from "express";
// // controllers
// import {
//   createUser,
//   loginUser,
//   logoutCurrentUser,
//   getAllUsers,
//   getCurrentUserProfile,
//   updateCurrentUserProfile,
// } from "../controllers/userController.js";

// // middlewares
// import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
// import loginLimiter from "../middlewares/rateLimiter.js"; // ✅ FIXED: default import!

// const router = express.Router();

// router
//   .route("/")
//   .post(createUser)
//   .get(authenticate, authorizeAdmin, getAllUsers);

// // ✅ Apply limiter ONLY on login
// router.post("/auth", loginLimiter, loginUser);

// router.post("/logout", logoutCurrentUser);

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
  refreshToken,  // import the refresh controller
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import loginLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginLimiter, loginUser);

router.post("/logout", logoutCurrentUser);

// NEW: Add the refresh token route (no auth middleware needed, token from cookie)
router.get("/refresh", refreshToken);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

export default router;
