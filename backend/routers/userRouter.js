const express = require("express");
const userRouter = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Create
userRouter.post("/user/create", createUser);

// Login
userRouter.post("/user/login", loginUser);

// Read all
userRouter.get("/user/read/all", getAllUsers);

// Read
userRouter.get("/user/read", getUser);

// Update
userRouter.patch("/user/update", updateUser);

// Delete
userRouter.delete("/user/delete", deleteUser);

module.exports = userRouter;
