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
  xPos: {
    type: Number,
    required: true,
  },
  yPos: {
    type: Number,
    required: true,
  },
});

// define schema for existingMidOffset
const midOffsetSchema = new Schema(
  {
    edgeId: {
      type: String,
      required: true,
    },
    midOffset: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  },
  { _id: false }
);

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
  previewText: {
    type: String,
    required: false,
  },
  existingMidOffsets: {
    type: [midOffsetSchema],
    required: false,
  },
});

module.exports = mongoose.model("Tree", treeSchema);
