const User = require("../models/userModel");

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

// Read single user

// Update user

// Delete user

module.exports = {
  createUser,
};
