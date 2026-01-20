const express = require("express");
const userRouter = express.Router();
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  mfaSetup,
  mfaVerify,
  mfaResetTrigger,
  mfaReset,
} = require("../controllers/userController");

const {
  authenticate,
  requireMfaVerified,
} = require("../middleware/authMiddleware");
const { loginUser } = require("../controllers/authController");

// Create user
userRouter.post("/user/create", authenticate, requireMfaVerified, createUser);

// Login
userRouter.post("/user/login", loginUser);

// Read all users
userRouter.get("/user/read/all", authenticate, requireMfaVerified, getAllUsers);

// Read singular user
userRouter.get("/user/read", authenticate, requireMfaVerified, getUser);

// Update user
userRouter.patch("/user/update", authenticate, requireMfaVerified, updateUser);

// Delete user
userRouter.delete("/user/delete", authenticate, requireMfaVerified, deleteUser);

// MFA Setup
userRouter.post("/user/mfa/setup", authenticate, mfaSetup);

// MFA Verify
userRouter.post("/user/mfa/verify", authenticate, mfaVerify);

// MFA Reset Email
userRouter.post("/user/mfa/reset/email", authenticate, mfaResetTrigger);

// MFA Reset Reset
userRouter.post("/user/mfa/reset", mfaReset);

module.exports = userRouter;
