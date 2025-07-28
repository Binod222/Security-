// import jwt from "jsonwebtoken";

// const generateToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });

//   // Set JWT as an HTTP-Only Cookie
//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== "development",
//     sameSite: "strict",
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//   });

//   return token;
// };

// export default generateToken;

// import jwt from "jsonwebtoken";

// const createToken = {
//   generateAccessToken: (res, userId) => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//       expiresIn: "15m", // short lived access token
//     });

//     // Set access token as HTTP-only cookie
//     res.cookie("jwt_access", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV !== "development",
//       sameSite: "strict",
//       maxAge: 15 * 60 * 1000, // 15 minutes
//     });

//     return token;
//   },

//   generateRefreshToken: (res, userId) => {
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//       expiresIn: "7d", // longer refresh token
//     });

//     // Set refresh token as HTTP-only cookie
//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV !== "development",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     return token;
//   },
// };

// export default createToken;



import jwt from "jsonwebtoken";

// Generates and sets an **access token** cookie
export const generateAccessToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // short-lived access token
  });

  res.cookie("jwt_access", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  return token;
};

// Generates and sets a **refresh token** cookie
export const generateRefreshToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // longer refresh token
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

