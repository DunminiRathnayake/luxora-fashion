import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Protected user route middleware
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Retrieve token from authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify JWT token
      const secret = process.env.JWT_SECRET || "luxora_secret_key_default_123456";
      const decoded = jwt.verify(token, secret);

      // Attach user profile to request
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          res.status(401);
          throw new Error("Not authorized, user profile not found");
        }
      } else {
        // Offline development mode fallback
        req.user = {
          _id: decoded.id,
          name: decoded.role === "admin" ? "Luxora Admin" : "Offline Customer",
          email: decoded.role === "admin" ? "admin@luxora.com" : "customer@luxora.com",
          role: decoded.role,
        };
      }

      next();
    } catch (error) {
      console.error("JWT Verification error:", error.message);
      res.status(401);
      throw new Error("Not authorized, token validation failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, access token missing");
  }
});

// Admin-only route guard
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized, admin privileges required");
  }
};

