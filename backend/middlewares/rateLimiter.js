import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per 15 minutes
  message: {
    message: "Too many login attempts, please try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter;
