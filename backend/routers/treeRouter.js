const express = require("express");
const treeRouter = express.Router();
const {
  createTree,
  getAllTrees,
  getTree,
  updateTree,
  deleteTree,
} = require("../controllers/treeController");
const { authenticate } = require("../controllers/authController");

// Create tree
treeRouter.post("/tree/create", authenticate, createTree);

// Read all trees
treeRouter.get("/tree/read/all", getAllTrees);

// Read singular tree
treeRouter.get("/tree/read", getTree);

// Update tree
treeRouter.patch("/tree/update", authenticate, updateTree);

// Delete tree
treeRouter.delete("/tree/delete", authenticate, deleteTree);

module.exports = treeRouter;
