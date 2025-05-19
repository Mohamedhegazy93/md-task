import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";
import ApiError from "../utils/apiError.js";

// Generate Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Store refresh-token at Redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};
// Set tokens in cookie
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc    Register
// @route   POST /auth/register
export const register = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  // check phone number duplicated (user existed)
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "user already existed due to phone number" });
  }

  const user = await User.create(req.body);
  res.status(201).json({ data: user });
});

// @desc    Login
// @route   POST /auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (user && (await user.comparePassword(password))) {
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({
      messgae: "login sucessfully",
    });
  } else {
    return next(new ApiError("Invalid email or password",401));
  }
});


// Clear cookies function
const clearCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};
// @desc    Logout
// @route   POST /auth/logout
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    } catch (error) {
      console.error("Error verifying refresh token during logout:", error);
    }
  }

  clearCookies(res);
  res.json({ message: "Logged out successfully" });
});

// Generate new access token function
const generateNewAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

// @desc    Refresh token
// @route   POST /auth/refresh-token
export const refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(new ApiError("Refresh token not found", 401));
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const userId = decoded.userId;

  // Check if the refresh-token exists in Redis
  const storedRefreshToken = await redis.get(`refresh_token:${userId}`);

  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    return next(new ApiError("Invalid refresh token", 401));
  }

  // Generate a new access token
  const newAccessToken = generateNewAccessToken(userId);

  // Set the new access token in the cookie
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({ accessToken: newAccessToken });
});


// @desc    Get user profile
// @route   POST /auth/profile
export const getProfile = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.userId).select(
    "-password -createdAt -updatedAt -__v -_id"
  );

  if (!user) {
    return next(new ApiError("Refresh token not found", 404));
  }
  res.status(200).json({ data: user });
});
