import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

export const setAuthCookie = (res, user) => {
  const token = generateToken(user);
  const cookieDays = parseInt(process.env.COOKIE_MAX_AGE_DAYS) || 7;
  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: cookieDays * 24 * 60 * 60 * 1000, // in milliseconds
    secure: true,
    sameSite: "none",
    partitioned: true,
  });
};

