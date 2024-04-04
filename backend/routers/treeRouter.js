const express = require("express");
const treeRouter = express.Router();
const {
  createTree,
  getAllTrees,
  getTree,
  updateTree,
  deleteTree,
} = require("../controllers/treeController");

// Create tree
treeRouter.post("/tree/create", createTree);

// Read all trees
treeRouter.get("/tree/read/all", getAllTrees);

// Read singular tree
treeRouter.get("/tree/read", getTree);

// Update tree
treeRouter.patch("/tree/update", updateTree);

// Delete tree
treeRouter.delete("/tree/delete", deleteTree);

module.exports = treeRouter;
