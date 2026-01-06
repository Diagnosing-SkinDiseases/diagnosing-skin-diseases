const express = require("express");
const authRouter = express.Router();

const {
  loginUser,
  logoutUser,
  authMe,
} = require("../controllers/authController");
const {
  authenticate,
  requireMfaVerified,
} = require("../middleware/authMiddleware");

// Login
authRouter.post("/auth/login", loginUser);

// Auth Me
authRouter.get("/auth/me", authenticate, requireMfaVerified, authMe);

// Logout
authRouter.post("/auth/logout", logoutUser);

module.exports = authRouter;
