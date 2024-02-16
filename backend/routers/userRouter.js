const express = require("express");
const userRouter = express.Router();
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Create
userRouter.post("/user/create", createUser);

// Read all users
userRouter.get("/user/read/all", getAllUsers);

// Read
userRouter.get("/user/read", getUser);

// Update
userRouter.patch("/user/update", updateUser);

// Delete
userRouter.delete("/user/delete", deleteUser);

module.exports = userRouter;
