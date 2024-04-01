const mongoose = require("mongoose");
const Status = require("../enums/status");

const Schema = mongoose.Schema;

// define schema for node
const nodeSchema = new Schema({
  currentId: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: false,
  },
  noChildId: {
    type: String,
    required: false,
  },
  yesChildId: {
    type: String,
    required: false,
  },
});

// define schema for tree
const treeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nodes: [
    {
      type: nodeSchema,
      required: true,
    },
  ],
  aboutLink: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status),
  },
});

module.exports = mongoose.model("Tree", treeSchema);
