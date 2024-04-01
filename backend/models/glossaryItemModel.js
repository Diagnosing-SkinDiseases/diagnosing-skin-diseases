const mongoose = require("mongoose");
const Status = require("../enums/status");

const Schema = mongoose.Schema;

// define schema for glossary item
const glossaryItemSchema = new Schema({
  // term, must be a string
  term: {
    type: String,
    required: true,
  },
  // definition, must be a string
  definition: {
    type: String,
    required: true,
  },
  // status of glossary item, must be one of the values in Status
  status: {
    type: String,
    required: true,
    enum: Object.values(Status),
  },
});

module.exports = mongoose.model("GlossaryItem", glossaryItemSchema);
