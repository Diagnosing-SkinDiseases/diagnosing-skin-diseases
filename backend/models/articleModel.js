const mongoose = require("mongoose");
const ArticleContentType = require("../enums/articleContentType");
const Status = require("../enums/status");

const Schema = mongoose.Schema;

const articleContentSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: Object.values(ArticleContentType),
  },
  content: {
    type: String,
    required: true,
  },
});

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: [
    {
      type: articleContentSchema,
      required: true,
    },
  ],
  status: {
    type: String,
    required: true,
    enum: Object.values(Status),
  },
});

module.exports = mongoose.model("Article", articleSchema);
