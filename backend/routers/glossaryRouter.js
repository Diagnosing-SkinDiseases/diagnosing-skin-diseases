const express = require("express");
const glossaryItemRouter = express.Router();
const {
  createGlossaryItem,
  getAllGlossaryItems,
  getGlossaryItem,
  updateGlossaryItem,
  deleteGlossaryItem,
} = require("../controllers/glossaryItemController");

// Create glossary item
glossaryItemRouter.post("/glossaryItem/create", createGlossaryItem);

// Read all glossary items
glossaryItemRouter.get("/glossaryItem/read/all", getAllGlossaryItems);

// Read singular glossary
glossaryItemRouter.get("/glossaryItem/read", getGlossaryItem);

// Update glossary item
glossaryItemRouter.patch("/glossaryItem/update", updateGlossaryItem);

// Delete glossary item
glossaryItemRouter.delete("/glossaryItem/delete", deleteGlossaryItem);

module.exports = glossaryItemRouter;
