const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define schema for user
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // Indicates whether MFA is enabled for the user
  mfaEnabled: {
    type: Boolean,
    default: false,
  },

  // Stores the user's TOTP secret (base32 encoded)
  mfaSecret: {
    type: String,
    default: null,
  },

  // One-time MFA link data
  mfaLinkToken: {
    type: String,
    default: null,
  },

  mfaLinkExpiresAt: {
    type: Date,
    default: null,
  },

  mfaLinkUsed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
