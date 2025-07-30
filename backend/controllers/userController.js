

// // ✅ Password check helper
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

// // ✅ Register user & send OTP
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

//   // ✅ Generate OTP
//   const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//   const newUser = await User.create({
//     username,
//     email,
//     password: hashedPassword,
//     passwordHistory: [{ password: hashedPassword }],
//     passwordChangedAt: new Date(),
//     passwordExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//     emailVerificationCode: verificationCode,
//     isVerified: false,
//   });

//   await sendVerificationEmail(email, verificationCode);

//   res.status(201).json({
//     message: "Account created. A verification code has been sent to your email.",
//   });
// });

// // ✅ Verify OTP & activate account
// const verifyUser = asyncHandler(async (req, res) => {
//   const { email, code } = req.body;

//   if (!email || !code) {
//     res.status(400);
//     throw new Error("Email and code are required");
//   }

//   const user = await User.findOne({ email });
//   if (!user) {
//     res.status(400);
//     throw new Error("Invalid email");
//   }

//   if (user.isVerified) {
//     res.status(400);
//     throw new Error("User is already verified");
//   }

//   if (user.emailVerificationCode !== code) {
//     res.status(400);
//     throw new Error("Invalid verification code");
//   }

//   user.isVerified = true;
//   user.emailVerificationCode = undefined;
//   await user.save();

//   // ✅ Generate JWT now that user is verified
//   generateAccessToken(res, user._id);
//   generateRefreshToken(res, user._id);

//   res.status(200).json({
//     _id: user._id,
//     username: user.username,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   });
// });

// // ✅ Login - block if not verified
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(401);
//     throw new Error("Invalid credentials");
//   }

//   if (!user.isVerified) {
//     res.status(401);
//     throw new Error("Please verify your email first");
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

//   generateAccessToken(res, user._id);
//   generateRefreshToken(res, user._id);

//   res.json({
//     _id: user._id,
//     username: user.username,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   });
// });

// // ✅ Logout
// const logoutCurrentUser = asyncHandler(async (req, res) => {
//   res.cookie("jwt", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });

//   res.cookie("jwt_access", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });

//   res.status(200).json({ message: "Logged out successfully" });
// });

// // ✅ Refresh token
// const refreshToken = asyncHandler(async (req, res) => {
//   const token = req.cookies.jwt;

//   if (!token) {
//     res.status(401);
//     throw new Error("No refresh token found");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       res.status(401);
//       throw new Error("User not found");
//     }

//     generateAccessToken(res, user._id);

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

// // ✅ Get current user
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

// // ✅ Update profile
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

// // ✅ Admin: get all users
// const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({});
//   res.json(users);
// });

// // ✅ EXPORT ALL
// export {
//   createUser,
//   verifyUser,
//   loginUser,
//   logoutCurrentUser,
//   getAllUsers,
//   getCurrentUserProfile,
//   updateCurrentUserProfile,
//   refreshToken,
// };


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/sendEmails.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/createToken.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator"; // ✅ Import validationResult

// ✅ Password check helper
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

// ✅ Register user & send OTP
const createUser = asyncHandler(async (req, res) => {
  // ✅ Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a 400 status with an array of validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  // The following checks are now largely handled by express-validator,
  // but keeping `userExists` is still good as it's a database check.
  // You can remove the `if (!username || !email || !password)` and `if (!isPasswordStrong(password))`
  // if you are confident in your express-validator rules.

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Set status before throwing error for consistent error handling
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // ✅ Generate OTP
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    passwordHistory: [{ password: hashedPassword }],
    passwordChangedAt: new Date(),
    passwordExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    emailVerificationCode: verificationCode,
    isVerified: false,
  });

  try {
    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({
      message: "Account created. A verification code has been sent to your email.",
      // Optionally send back user data that is safe to expose
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isVerified: newUser.isVerified,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    // If email sending fails, you might want to consider deleting the user
    // or marking them for manual review, as they won't be able to verify.
    // For now, return a 500 error but keep the user in DB.
    res.status(500).json({ message: "User registered but failed to send verification email. Please try again or contact support." });
  }
});

// ✅ Verify OTP & activate account
const verifyUser = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Email and code are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid email");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  if (user.emailVerificationCode !== code) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  user.isVerified = true;
  user.emailVerificationCode = undefined;
  await user.save();

  // ✅ Generate JWT now that user is verified
  generateAccessToken(res, user._id);
  generateRefreshToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// ✅ Login - block if not verified
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error("Please verify your email first");
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

// ✅ Logout
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

// ✅ Refresh token
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

// ✅ Get current user
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

// ✅ Update profile
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

    // Check password history
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
      user.passwordHistory.shift(); // Keep only the last 5 passwords
    }

    user.passwordChangedAt = new Date();
    user.passwordExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
  }

  await user.save();

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// ✅ Admin: get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// ✅ Admin: get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// ✅ Admin: update user by ID
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin); // Ensure isAdmin is boolean

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// ✅ Admin: delete user by ID
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent admin from deleting themselves
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// ✅ EXPORT ALL
export {
  createUser,
  verifyUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  refreshToken,
  getUserById, // ✅ Export new admin functions
  updateUserById, // ✅ Export new admin functions
  deleteUserById, // ✅ Export new admin functions
};
