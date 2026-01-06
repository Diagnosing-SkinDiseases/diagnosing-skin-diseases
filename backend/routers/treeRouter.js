const express = require("express");
const treeRouter = express.Router();
const {
  createTree,
  getAllTrees,
  getTree,
  updateTree,
  deleteTree,
} = require("../controllers/treeController");
const {
  authenticate,
  requireMfaVerified,
} = require("../middleware/authMiddleware");

// Create tree
treeRouter.post("/tree/create", authenticate, requireMfaVerified, createTree);

// Read all trees
treeRouter.get("/tree/read/all", getAllTrees);

// Read singular tree
treeRouter.get("/tree/read", getTree);

// Update tree
treeRouter.patch("/tree/update", authenticate, requireMfaVerified, updateTree);

// Delete tree
treeRouter.delete("/tree/delete", authenticate, requireMfaVerified, deleteTree);

module.exports = treeRouter;
