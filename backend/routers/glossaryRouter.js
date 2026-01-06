const express = require("express");
const glossaryItemRouter = express.Router();
const {
  createGlossaryItem,
  getAllGlossaryItems,
  getGlossaryItem,
  updateGlossaryItem,
  deleteGlossaryItem,
} = require("../controllers/glossaryItemController");

const {
  authenticate,
  requireMfaVerified,
} = require("../middleware/authMiddleware");

// Create glossary item
glossaryItemRouter.post(
  "/glossaryItem/create",
  authenticate,
  requireMfaVerified,
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
  requireMfaVerified,
  updateGlossaryItem
);

// Delete glossary item
glossaryItemRouter.delete(
  "/glossaryItem/delete",
  authenticate,
  requireMfaVerified,
  deleteGlossaryItem
);

module.exports = glossaryItemRouter;
