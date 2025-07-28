// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import generateToken from "../utils/createToken.js";
// import jwt from "jsonwebtoken";

// // Helper: Validate password complexity
// function isPasswordStrong(password) {
//   const lengthRegex = /^.{8,20}$/;
//   const uppercaseRegex = /[A-Z]/;
//   const lowercaseRegex = /[a-z]/;
//   const numberRegex = /[0-9]/;
//   const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

//   return (
//     lengthRegex.test(password) &&
//     uppercaseRegex.test(password) &&
//     lowercaseRegex.test(password) &&
//     numberRegex.test(password) &&
//     specialCharRegex.test(password)
//   );
// }

// // Register
// const createUser = asyncHandler(async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     res.status(400);
//     throw new Error("Please fill all fields");
//   }

//   if (!isPasswordStrong(password)) {
//     res.status(400);
//     throw new Error(
//       "Password must be 8-20 chars, include uppercase, lowercase, number, special char."
//     );
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const newUser = await User.create({
//     username,
//     email,
//     password: hashedPassword,
//     passwordHistory: [{ password: hashedPassword }],
//     passwordChangedAt: new Date(),
//     passwordExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//   });

//   generateToken(res, newUser._id);

//   res.status(201).json({
//     _id: newUser._id,
//     username: newUser.username,
//     email: newUser.email,
//     isAdmin: newUser.isAdmin,
//   });
// });

// // Login
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(401);
//     throw new Error("Invalid credentials");
//   }

//   if (user.passwordExpiry < new Date()) {
//     res.status(403);
//     throw new Error("Password expired, please reset");
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     res.status(401);
//     throw new Error("Invalid credentials");
//   }

//   generateToken(res, user._id);

//   res.json({
//     _id: user._id,
//     username: user.username,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   });
// });

// // Logout
// const logoutCurrentUser = asyncHandler(async (req, res) => {
//   res.cookie("jwt", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });

//   res.status(200).json({ message: "Logged out successfully" });
// });

// // Refresh token
// const refreshToken = asyncHandler(async (req, res) => {
//   const token = req.cookies.jwt; // get token from cookie

//   if (!token) {
//     res.status(401);
//     throw new Error("No refresh token found");
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user from token payload
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       res.status(401);
//       throw new Error("User not found");
//     }

//     // Issue a new token (access token)
//     const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     // Set new cookie with new token
//     res.cookie("jwt", newToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV !== "development",
//       sameSite: "strict",
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });

//     // Send back user info (optional)
//     res.json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } catch (error) {
//     res.status(401);
//     throw new Error("Invalid refresh token");
//   }
// });

// // Get profile
// const getCurrentUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   res.json({
//     _id: user._id,
//     username: user.username,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   });
// });

// // Update profile
// const updateCurrentUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   user.username = req.body.username || user.username;
//   user.email = req.body.email || user.email;

//   if (req.body.password) {
//     if (!isPasswordStrong(req.body.password)) {
//       res.status(400);
//       throw new Error("Weak password");
//     }

//     for (const old of user.passwordHistory) {
//       const isSame = await bcrypt.compare(req.body.password, old.password);
//       if (isSame) {
//         res.status(400);
//         throw new Error("Cannot reuse recent password");
//       }
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     user.password = hashedPassword;
//     user.passwordHistory.push({ password: hashedPassword });

//     if (user.passwordHistory.length > 5) {
//       user.passwordHistory.shift();
//     }

//     user.passwordChangedAt = new Date();
//     user.passwordExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
//   }

//   await user.save();

//   res.json({
//     _id: user._id,
//     username: user.username,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   });
// });

// // Admin get all users
// const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({});
//   res.json(users);
// });

// export {
//   createUser,
//   loginUser,
//   logoutCurrentUser,
//   getAllUsers,
//   getCurrentUserProfile,
//   updateCurrentUserProfile,
//   refreshToken,
// };


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/createToken.js";
import jwt from "jsonwebtoken";

// Helper: Validate password complexity
function isPasswordStrong(password) {
  const lengthRegex = /^.{8,20}$/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    lengthRegex.test(password) &&
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numberRegex.test(password) &&
    specialCharRegex.test(password)
  );
}

// Register
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  if (!isPasswordStrong(password)) {
    res.status(400);
    throw new Error(
      "Password must be 8-20 chars, include uppercase, lowercase, number, special char."
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    passwordHistory: [{ password: hashedPassword }],
    passwordChangedAt: new Date(),
    passwordExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  generateAccessToken(res, newUser._id);
  generateRefreshToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (user.passwordExpiry < new Date()) {
    res.status(403);
    throw new Error("Password expired, please reset");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  generateAccessToken(res, user._id);
  generateRefreshToken(res, user._id);

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// Logout
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("jwt_access", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// Refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error("No refresh token found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Issue new access token only
    generateAccessToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }
});

// Get profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// Update profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    if (!isPasswordStrong(req.body.password)) {
      res.status(400);
      throw new Error("Weak password");
    }

    for (const old of user.passwordHistory) {
      const isSame = await bcrypt.compare(req.body.password, old.password);
      if (isSame) {
        res.status(400);
        throw new Error("Cannot reuse recent password");
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    user.passwordHistory.push({ password: hashedPassword });

    if (user.passwordHistory.length > 5) {
      user.passwordHistory.shift();
    }

    user.passwordChangedAt = new Date();
    user.passwordExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  }

  await user.save();

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// Admin get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  refreshToken,
};
