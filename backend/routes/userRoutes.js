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

// const router = express.Router();

// router
//   .route("/")
//   .post(createUser)
//   .get(authenticate, authorizeAdmin, getAllUsers);

// router.post("/auth", loginUser);
// router.post("/logout", logoutCurrentUser);

// router
//   .route("/profile")
//   .get(authenticate, getCurrentUserProfile)
//   .put(authenticate, updateCurrentUserProfile);

// export default router;

import express from "express";
// controllers
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "../controllers/userController.js";

// middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import loginLimiter from "../middlewares/rateLimiter.js"; // ✅ FIXED: default import!

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

// ✅ Apply limiter ONLY on login
router.post("/auth", loginLimiter, loginUser);

router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

export default router;
