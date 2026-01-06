const express = require("express");
const glossaryItemRouter = express.Router();
const {
  createGlossaryItem,
  getAllGlossaryItems,
  getGlossaryItem,
  updateGlossaryItem,
  deleteGlossaryItem,
} = require("../controllers/glossaryItemController");

const { authenticate } = require("../controllers/authController");

// Create glossary item
glossaryItemRouter.post(
  "/glossaryItem/create",
  authenticate,
  createGlossaryItem
);

// Read all glossary items
glossaryItemRouter.get("/glossaryItem/read/all", getAllGlossaryItems);

// Read singular glossary
glossaryItemRouter.get("/glossaryItem/read", getGlossaryItem);

// Update glossary item
glossaryItemRouter.patch(
  "/glossaryItem/update",
  authenticate,
  updateGlossaryItem
);

// Delete glossary item
glossaryItemRouter.delete(
  "/glossaryItem/delete",
  authenticate,
  deleteGlossaryItem
);

module.exports = glossaryItemRouter;
