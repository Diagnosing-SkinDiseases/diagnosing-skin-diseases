const express = require("express");
const userRouter = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  mfaSetup,
  mfaVerify,
} = require("../controllers/userController");

// Create user
userRouter.post("/user/create", createUser);

// Login
userRouter.post("/user/login", loginUser);

// Read all users
userRouter.get("/user/read/all", getAllUsers);

// Read singular user
userRouter.get("/user/read", getUser);

// Update user
userRouter.patch("/user/update", updateUser);

// Delete user
userRouter.delete("/user/delete", deleteUser);

// MFA Setup
userRouter.post("/user/mfa/setup", mfaSetup);

// MFA Verify
userRouter.post("/user/mfa/verify", mfaVerify);

module.exports = userRouter;
