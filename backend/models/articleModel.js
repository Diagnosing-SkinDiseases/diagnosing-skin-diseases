const mongoose = require("mongoose");
const ArticleContentType = require("../enums/articleContentType");
const Status = require("../enums/status");

const Schema = mongoose.Schema;

// define schema for article content
const articleContentSchema = new Schema({
  // type of content, must be one of the values in ArticleContentType
  type: {
    type: String,
    required: true,
    enum: Object.values(ArticleContentType),
  },
  // actual content, must be a string
  content: {
    type: String,
    required: true,
  },
});

// define schema for article
const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  // array of article content, each element follows the article content schema
  content: [
    {
      type: articleContentSchema,
      required: true,
    },
  ],
  // status of article, must be one of the values in Status
  status: {
    type: String,
    required: true,
    enum: Object.values(Status),
  },
});

module.exports = mongoose.model("Article", articleSchema);
