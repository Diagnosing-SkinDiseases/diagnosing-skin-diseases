const express = require("express");
const treeRouter = express.Router();
const {
  createTree,
  getAllTrees,
  getTree,
  updateTree,
  deleteTree,
} = require("../controllers/treeController");

// Create
treeRouter.post("/tree/create", createTree);

// Read all
treeRouter.get("/tree/read/all", getAllTrees);

// Read
treeRouter.get("/tree/read", getTree);

// Update
treeRouter.patch("/tree/update", updateTree);

// Delete
treeRouter.delete("/tree/delete", deleteTree);

module.exports = treeRouter;
