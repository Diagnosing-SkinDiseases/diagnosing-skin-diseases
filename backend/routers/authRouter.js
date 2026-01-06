const express = require("express");
const authRouter = express.Router();

const {
  loginUser,
  authenticate,
  authMe,
  logoutUser,
} = require("../controllers/authController");

// Login
authRouter.post("/auth/login", loginUser);

// Authenticate
authRouter.get("/auth/me", authenticate, authMe);

// Logout
authRouter.post("/auth/logout", logoutUser);

module.exports = authRouter;
