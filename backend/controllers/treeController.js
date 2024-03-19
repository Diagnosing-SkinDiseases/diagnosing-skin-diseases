const Tree = require("../models/treeModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Create Tree
const createTree = async (req, res) => {
  let { name, nodeTree, about, status } = req.body;
  if (status) {
    status = status.toUpperCase();
  }

  nodeTree = inOrderToList(nodeTree, []);

  try {
    const tree = await Tree.create({ name, nodes: nodeTree, about, status });
    res.status(200).json(tree);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all trees
const getAllTrees = async (req, res) => {
  try {
    const trees = await Tree.find({}).sort({ name: 1 });
    res.status(200).json(trees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read single tree
const getTree = async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const tree = await Tree.findById(id);

  if (!tree) {
    return res.status(404).json({ error: "Tree not found" });
  }

  res.status(200).json(tree);
};

// Update tree
const updateTree = async (req, res) => {
  let { nodeTree, status } = req.body;

  if (status) {
    status = status.toUpperCase();
    req.body.status = status;
  }

  if (nodeTree) {
    nodeTree = inOrderToList(nodeTree, []);
    req.body.nodeTree = nodeTree;
  }

  const { id, ...data } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const tree = await Tree.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { ...data },
      { runValidators: true }
    );
    if (!tree) {
      return res.status(404).json({ error: "Tree not found" });
    }
    res.status(200).json(tree);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete tree
const deleteTree = async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const tree = await Tree.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!tree) {
    return res.status(404).json({ error: "Tree not found" });
  }

  res.status(200).json(tree);
};

// Helper functions
const inOrderToList = (node, acc) => {
  if (node) {
    let { parentId, content, currentId, yesChild, noChild } = node;
    let parsedNode = { currentId, content, parentId };
    parsedNode.noChildId = noChild ? noChild.currentId : null;
    parsedNode.yesChildId = yesChild ? yesChild.currentId : null;
    acc.push(parsedNode);
    inOrderToList(node.noChild, acc);
    inOrderToList(node.yesChild, acc);
  }
  return acc;
};

module.exports = {
  createTree,
  getAllTrees,
  getTree,
  updateTree,
  deleteTree,
};
