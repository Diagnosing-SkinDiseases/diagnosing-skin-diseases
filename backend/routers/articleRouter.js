const express = require("express");
const articleRouter = express.Router();
const {
  createArticle,
  getAllArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  listArticles,
} = require("../controllers/articleController");

// Create article
articleRouter.post("/article/create", createArticle);

// Read all articles
articleRouter.get("/article/read/all", getAllArticles);

// List (id + title only)
articleRouter.get("/article/list", listArticles);

// Read singular article
articleRouter.get("/article/read", getArticle);

// Update article
articleRouter.patch("/article/update", updateArticle);

// Delete article
articleRouter.delete("/article/delete", deleteArticle);

module.exports = articleRouter;
