const express = require("express");
const userRouter = express.Router();
const { createUser } = require("../controllers/userController");

// Create
userRouter.post("/user/create", createUser);

// Read
userRouter.get("/user/read", (req, res) => {
  let response = req.query.user ? `Hello ${req.query.user}!` : "Hello User!";
  res.send(`Read: ${response}`);
});

// Update
userRouter.patch("/user/update", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let user;
  if (isEmpty) {
    user = "Empty";
  } else {
    user = req.body.user;
  }
  console.log(user);
  res.send(`Update: ${user}`);
});

// Delete
userRouter.delete("/user/delete", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let user;
  if (isEmpty) {
    user = "Empty";
  } else {
    user = req.body.user;
  }
  console.log(user);
  res.send(`Delete: ${user}`);
});

module.exports = userRouter;
