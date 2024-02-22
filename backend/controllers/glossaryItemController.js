const GlossaryItem = require("../models/glossaryItemModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Create GlossaryItem
const createGlossaryItem = async (req, res) => {
  let { term, definition, status } = req.body;
  if (status) {
    status = status.toUpperCase();
  }

  try {
    const glossaryItem = await GlossaryItem.create({
      term,
      definition,
      status,
    });
    res.status(200).json(glossaryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all glossaryItems
const getAllGlossaryItems = async (req, res) => {
  try {
    const glossaryItems = await GlossaryItem.find({}).sort({ createdAt: -1 });
    res.status(200).json(glossaryItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read single glossaryItem
const getGlossaryItem = async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const glossaryItem = await GlossaryItem.findById(id);

  if (!glossaryItem) {
    return res.status(404).json({ error: "GlossaryItem not found" });
  }

  res.status(200).json(glossaryItem);
};

// Update glossaryItem
const updateGlossaryItem = async (req, res) => {
  let { status } = req.body;

  if (status) {
    status = status.toUpperCase();
    req.body.status = status;
  }

  const { id, ...data } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const glossaryItem = await GlossaryItem.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { ...data },
      { runValidators: true }
    );
    if (!glossaryItem) {
      return res.status(404).json({ error: "GlossaryItem not found" });
    }
    res.status(200).json(glossaryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete glossaryItem
const deleteGlossaryItem = async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const glossaryItem = await GlossaryItem.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!glossaryItem) {
    return res.status(404).json({ error: "GlossaryItem not found" });
  }

  res.status(200).json(glossaryItem);
};

module.exports = {
  createGlossaryItem,
  getAllGlossaryItems,
  getGlossaryItem,
  updateGlossaryItem,
  deleteGlossaryItem,
};
