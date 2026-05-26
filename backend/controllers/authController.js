import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";

// Static mock users for offline fallback
const OFFLINE_CREDENTIALS = [
  {
    id: "offline-admin-id",
    name: "Luxora Admin",
    email: "admin@luxora.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "offline-customer-id",
    name: "Dunmini Rathnayake",
    email: "customer@luxora.com",
    password: "customer123",
    role: "customer",
  },
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Check if DB is online
  if (mongoose.connection.readyState === 1) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists with this email address");
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "customer",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data received");
    }
  } else {
    // Offline mode: generate token and send simulated success
    console.warn("MongoDB is offline. Simulating user registration.");
    res.status(201).json({
      _id: "offline-" + Date.now(),
      name,
      email: email.toLowerCase(),
      role: role || "customer",
      token: generateToken("offline-id", role || "customer"),
      isOffline: true,
    });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter both email and password");
  }

  // Check if DB is online
  if (mongoose.connection.readyState === 1) {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    // Offline mode fallback
    console.warn("MongoDB is offline. Performing static offline credential matching.");
    const match = OFFLINE_CREDENTIALS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (match) {
      res.json({
        _id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        token: generateToken(match.id, match.role),
        isOffline: true,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password (offline match failed)");
    }
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404);
    throw new Error("User profile not found");
  }
});
