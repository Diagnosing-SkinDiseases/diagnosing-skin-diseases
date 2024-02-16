const User = require("../models/userModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Create User
const createUser = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read single user
const getUser = async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
};

// Update user
const updateUser = async (req, res) => {
  const { id, ...data } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { ...data },
      { runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const user = await User.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
