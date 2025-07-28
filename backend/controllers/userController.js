// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import asyncHandler from "../middlewares/asyncHandler.js";
// import createToken from "../utils/createToken.js";

// // Helper: Validate password complexity
// function isPasswordStrong(password) {
//   const lengthRegex = /^.{8,20}$/; // Min 8, max 20 chars
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

// // Register new user
// const createUser = asyncHandler(async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     throw new Error("Please fill all the fields");
//   }

//   if (!isPasswordStrong(password)) {
//     res.status(400);
//     throw new Error(
//       "Password must be 8-20 characters and include uppercase, lowercase, number, and special character."
//     );
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const newUser = new User({
//     username,
//     email,
//     password: hashedPassword,
//     passwordHistory: [{ password: hashedPassword }],
//     passwordChangedAt: new Date(),
//     passwordExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // expires in 90 days
//   });

//   await newUser.save();
//   createToken(res, newUser._id);

//   res.status(201).json({
//     _id: newUser._id,
//     username: newUser.username,
//     email: newUser.email,
//     isAdmin: newUser.isAdmin,
//   });
// });

// // Login user
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const existingUser = await User.findOne({ email });

//   if (!existingUser) {
//     res.status(401);
//     throw new Error("User not found");
//   }

//   // Check password expiry
//   if (
//     existingUser.passwordExpiry &&
//     existingUser.passwordExpiry < new Date()
//   ) {
//     res.status(403);
//     throw new Error("Your password has expired. Please reset it.");
//   }

//   const isPasswordValid = await bcrypt.compare(password, existingUser.password);

//   if (!isPasswordValid) {
//     res.status(401);
//     throw new Error("Wrong Password");
//   }

//   createToken(res, existingUser._id);

//   res.status(201).json({
//     _id: existingUser._id,
//     username: existingUser.username,
//     email: existingUser.email,
//     isAdmin: existingUser.isAdmin,
//   });
// });

// // @desc Logout user
// const logoutCurrentUser = asyncHandler(async (req, res) => {
//   res.cookie("jwt", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });

//   res.status(200).json({ message: "Logged out successfully" });
// });

// // @desc Get all users (admin)
// const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({});
//   res.json(users);
// });

// // @desc Get current user profile
// const getCurrentUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found.");
//   }
// });

// // @desc Update current user profile
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
//       throw new Error(
//         "Password must be 8-20 characters and include uppercase, lowercase, number, and special character."
//       );
//     }

//     // Check for reuse
//     for (const old of user.passwordHistory) {
//       const isSame = await bcrypt.compare(req.body.password, old.password);
//       if (isSame) {
//         res.status(400);
//         throw new Error("You cannot reuse a recent password.");
//       }
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     user.password = hashedPassword;
//     user.passwordHistory.push({ password: hashedPassword });

//     // Keep only last 5
//     if (user.passwordHistory.length > 5) {
//       user.passwordHistory.shift();
//     }

//     user.passwordChangedAt = new Date();
//     user.passwordExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
//   }

//   const updatedUser = await user.save();

//   res.json({
//     _id: updatedUser._id,
//     username: updatedUser.username,
//     email: updatedUser.email,
//     isAdmin: updatedUser.isAdmin,
//   });
// });

// export {
//   createUser,
//   loginUser,
//   logoutCurrentUser,
//   getAllUsers,
//   getCurrentUserProfile,
//   updateCurrentUserProfile,
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

// Helper: Validate password complexity
function isPasswordStrong(password) {
  const lengthRegex = /^.{8,20}$/; // Min 8, max 20 chars
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

// Register new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the fields");
  }

  if (!isPasswordStrong(password)) {
    res.status(400);
    throw new Error(
      "Password must be 8-20 characters and include uppercase, lowercase, number, and special character."
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    passwordHistory: [{ password: hashedPassword }],
    passwordChangedAt: new Date(),
    passwordExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // expires in 90 days
  });

  await newUser.save();

  // Issue access and refresh tokens
  createToken.generateAccessToken(res, newUser._id);
  createToken.generateRefreshToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(401);
    throw new Error("User not found");
  }

  if (existingUser.passwordExpiry && existingUser.passwordExpiry < new Date()) {
    res.status(403);
    throw new Error("Your password has expired. Please reset it.");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Wrong Password");
  }

  // Issue access and refresh tokens
  createToken.generateAccessToken(res, existingUser._id);
  createToken.generateRefreshToken(res, existingUser._id);

  res.status(201).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});

// Refresh access token using refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }

    // Issue new access token only
    createToken.generateAccessToken(res, user._id);

    res.status(200).json({
      message: "Access token refreshed.",
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(403);
    throw new Error("Invalid refresh token.");
  }
});

// Logout user (clear both access and refresh cookies)
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

// @desc Get all users (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc Get current user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// @desc Update current user profile
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
      throw new Error(
        "Password must be 8-20 characters and include uppercase, lowercase, number, and special character."
      );
    }

    // Check for reuse
    for (const old of user.passwordHistory) {
      const isSame = await bcrypt.compare(req.body.password, old.password);
      if (isSame) {
        res.status(400);
        throw new Error("You cannot reuse a recent password.");
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    user.passwordHistory.push({ password: hashedPassword });

    // Keep only last 5 passwords
    if (user.passwordHistory.length > 5) {
      user.passwordHistory.shift();
    }

    user.passwordChangedAt = new Date();
    user.passwordExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
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
