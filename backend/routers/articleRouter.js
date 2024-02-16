const express = require("express");
const articleRouter = express.Router();
const {
  createArticle,
  getAllArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

// Create
articleRouter.post("/article/create", createArticle);

// Read all
articleRouter.get("/article/read/all", getAllArticles);

// Read
articleRouter.get("/article/read", getArticle);

// Update
articleRouter.patch("/article/update", updateArticle);

// Delete
articleRouter.delete("/article/delete", deleteArticle);

module.exports = articleRouter;
