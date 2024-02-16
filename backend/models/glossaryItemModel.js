const mongoose = require("mongoose");
const Status = require("../enums/status");

const Schema = mongoose.Schema;

const glossaryItemSchema = new Schema({
  term: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status),
  },
});

module.exports = mongoose.model("GlossaryItem", glossaryItemSchema);
