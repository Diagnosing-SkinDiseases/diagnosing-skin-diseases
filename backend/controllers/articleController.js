const Article = require("../models/articleModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Create Article
const createArticle = async (req, res) => {
  let { title, content, status } = req.body;

  if (status) {
    status = status.toUpperCase();
  }

  content.forEach((content) => {
    content.type = content.type.toUpperCase();
  });

  try {
    const article = await Article.create({ title, content, status });
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read single article
const getArticle = async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const article = await Article.findById(id);

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.status(200).json(article);
};

// Update article
const updateArticle = async (req, res) => {
  let { status, content } = req.body;

  if (status) {
    status = status.toUpperCase();
    req.body.status = status;
  }

  content.forEach((content) => {
    content.type = content.type.toUpperCase();
  });
  req.body.content = content;

  const { id, ...data } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const article = await Article.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { ...data },
      { runValidators: true }
    );
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const article = await Article.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.status(200).json(article);
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticle,
  updateArticle,
  deleteArticle,
};
