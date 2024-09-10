const Tree = require("../models/treeModel");
const Article = require("../models/articleModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Create Tree
const createTree = async (req, res) => {

  let { name, nodeTree, aboutLink, status, coverImage } = req.body;
  if (status) {
    status = status.toUpperCase();
  }
  nodeTree = inOrderToList(nodeTree, []);
  const articleId = extractArticleId(aboutLink);
  
  try {
    const previewText = await extractPreviewText(articleId);

    const tree = await Tree.create({
      name,
      nodes: nodeTree,
      aboutLink,
      status,
      coverImage,
      previewText, 
    });
    res.status(200).json(tree);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all trees
const getAllTrees = async (req, res) => {
  try {
    const trees = await Tree.find({}).sort({ name: 1 });
    res.status(200).json(trees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read single tree
const getTree = async (req, res) => {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const tree = await Tree.findById(id);
  if (!tree) {
    return res.status(404).json({ error: "Tree not found" });
  }
  res.status(200).json(tree);
};

// Update tree
const updateTree = async (req, res) => {
  let { nodeTree, status, aboutLink } = req.body;
  if (status) {
    status = status.toUpperCase();
    req.body.status = status;
  }
  if (nodeTree) {
    nodeTree = inOrderToList(nodeTree, []);
    req.body.nodes = nodeTree;
  }

  if (aboutLink) {
    // Fetch article and extract preview
    const articleId = extractArticleId(aboutLink);
    const previewText = await extractPreviewText(articleId);
    req.body.previewText = previewText;
  }

  const { id, ...data } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const tree = await Tree.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { ...data },
      { runValidators: true }
    );
    if (!tree) {
      return res.status(404).json({ error: "Tree not found" });
    }
    res.status(200).json(tree);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete tree
const deleteTree = async (req, res) => {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const tree = await Tree.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });
  if (!tree) {
    return res.status(404).json({ error: "Tree not found" });
  }
  res.status(200).json(tree);
};

// Helper functions
const inOrderToList = (node, acc) => {
  if (node) {
    let { parentId, content, currentId, yesChild, noChild, xPos, yPos } = node;
    let parsedNode = { currentId, content, parentId, xPos, yPos };
    parsedNode.noChildId = noChild ? noChild.currentId : null;
    parsedNode.yesChildId = yesChild ? yesChild.currentId : null;
    acc.push(parsedNode);
    inOrderToList(node.noChild, acc);
    inOrderToList(node.yesChild, acc);
  }
  return acc;
};

/**
 * Extracts the article ID from a given URL.
 * @param {string} url - The URL to extract the article ID from.
 * @returns {string} The article ID extracted from the URL.
 */
const extractArticleId = (url) => {
  const parts = url.split("/");
  return parts.pop();
}

  /**
   * Extracts a preview text from an article with the given ID.
   * It takes the first content block of type 'PARAGRAPH' and extracts up to
   * 100 characters of its content. If the content is longer than 100 characters,
   * it ensures the preview text ends on a full word by finding the last space and
   * truncating there. If the content is shorter than 100 characters, the full
   * content is returned.
   * @param {string} articleId - The ID of the article to extract the preview
   * text from.
   * @returns {string} The preview text.
   */
const extractPreviewText = async (articleId) => {
  try {
    const article = await Article.findById(articleId);
    if (!article || !article.content || article.content.length === 0) {
      return "";
    }
    // Find the first content block of type 'PARAGRAPH'
    const paragraphBlock = article.content.find(
      (block) => block.type === "PARAGRAPH"
    ).content;
    if (!paragraphBlock) {
      return "";
    }

    // Extract up to 100 characters
    const previewLength = 100;
    let previewText = paragraphBlock.slice(0, previewLength).trimEnd();

    // Ensure it ends on a full word and not in the middle of a word
    if (paragraphBlock.length > previewLength) {
      const lastSpaceIndex = previewText.lastIndexOf(" ");
      if (lastSpaceIndex > 0) {
        previewText = previewText.slice(0, lastSpaceIndex);
      }
      previewText = `${previewText}...`;
    }

    return previewText;
  } catch (error) {
    console.error("Error extracting preview text:", error);
    return "";
  }
};


module.exports = {
  createTree,
  getAllTrees,
  getTree,
  updateTree,
  deleteTree,
};
