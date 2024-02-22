const express = require("express");
const glossaryItemRouter = express.Router();
const {
  createGlossaryItem,
  getAllGlossaryItems,
  getGlossaryItem,
  updateGlossaryItem,
  deleteGlossaryItem,
} = require("../controllers/glossaryItemController");

// Create
glossaryItemRouter.post("/glossaryItem/create", createGlossaryItem);

// Read all users
glossaryItemRouter.get("/glossaryItem/read/all", getAllGlossaryItems);

// Read
glossaryItemRouter.get("/glossaryItem/read", getGlossaryItem);

// Update
glossaryItemRouter.patch("/glossaryItem/update", updateGlossaryItem);

// Delete
glossaryItemRouter.delete("/glossaryItem/delete", deleteGlossaryItem);

module.exports = glossaryItemRouter;
