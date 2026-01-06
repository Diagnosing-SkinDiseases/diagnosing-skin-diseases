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
const { authenticate } = require("../controllers/authController");

// Create article
articleRouter.post("/article/create", authenticate, createArticle);

// Read all articles
articleRouter.get("/article/read/all", getAllArticles);

// List (id + title only)
articleRouter.get("/article/list", listArticles);

// Read singular article
articleRouter.get("/article/read", authenticate, getArticle);

// Update article
articleRouter.patch("/article/update", authenticate, updateArticle);

// Delete article
articleRouter.delete("/article/delete", authenticate, deleteArticle);

module.exports = articleRouter;
