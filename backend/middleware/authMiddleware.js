import asyncHandler from "../utils/asyncHandler.js";

// Protected user route middleware skeleton
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Retrieve token from authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // Future JWT decoding: jwt.verify(token, process.env.JWT_SECRET)
      // For now, pass next
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Admin-only route guard skeleton
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};
