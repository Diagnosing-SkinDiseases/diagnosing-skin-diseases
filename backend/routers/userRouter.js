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

const { loginUser, authenticate } = require("../controllers/authController");

// Create user
userRouter.post("/user/create", authenticate, createUser);

// Login
userRouter.post("/user/login", loginUser);

// Read all users
userRouter.get("/user/read/all", authenticate, getAllUsers);

// Read singular user
userRouter.get("/user/read", authenticate, getUser);

// Update user
userRouter.patch("/user/update", authenticate, updateUser);

// Delete user
userRouter.delete("/user/delete", authenticate, deleteUser);

// MFA Setup
userRouter.post("/user/mfa/setup", authenticate, mfaSetup);

// MFA Verify
userRouter.post("/user/mfa/verify", authenticate, mfaVerify);

// MFA Reset
userRouter.post("/user/mfa/reset/email", mfaResetTrigger);

// MFA Reset True
userRouter.post("/user/mfa/reset", mfaReset);

module.exports = userRouter;
