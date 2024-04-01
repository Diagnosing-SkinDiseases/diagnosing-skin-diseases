const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// define schema for user
const userSchema = new Schema({
  // username, must be a string
  username: {
    type: String,
    required: true,
  },
  // email, must be a string
  email: {
    type: String,
    required: true,
  },
  // password, must be a string
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
