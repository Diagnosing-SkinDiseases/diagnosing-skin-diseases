const User = require("../models/userModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

// MFA Code
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const sendHelloWorldEmail = require("../utils/mailer");

// Create User
const createUser = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // You might want to avoid sending back the password, even if it's hashed
    const userForResponse = { ...user._doc };
    delete userForResponse.password;
    res
      .status(200)
      .json({ message: "User created successfully", user: userForResponse });
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

// MFA Setup
const mfaSetup = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Guardrail: Block setup if MFA is already enabled
    if (user.mfaEnabled) {
      return res.status(403).json({
        error:
          "MFA is already enabled. Reset it first if you want to reconfigure.",
      });
    }

    let secretBase32 = user.mfaSecret;

    // Only generate a new secret if one doesn't exist
    if (!secretBase32) {
      const secret = speakeasy.generateSecret({
        name: `YourApp (${user.email})`,
      });

      secretBase32 = secret.base32;
      user.mfaSecret = secretBase32;
      await user.save();
    }

    const otpauthUrl = `otpauth://totp/YourApp:${user.email}?secret=${secretBase32}&issuer=YourApp`;
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    res.status(200).json({
      qrCodeUrl,
      manualKey: secretBase32,
    });
  } catch (error) {
    console.error("Error in mfaSetup:", error);
    res.status(500).json({ error: "Failed to generate MFA setup." });
  }
};

// MFA Verify
const mfaVerify = async (req, res) => {
  const { code } = req.body;

  try {
    // Identity comes ONLY from authenticated session
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user || !user.mfaSecret) {
      return res
        .status(404)
        .json({ error: "MFA not set up or user not found" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid MFA token" });
    }

    // Mark MFA enabled (if not already)
    user.mfaEnabled = true;
    await user.save();

    // 🔐 Upgrade session → new JWT
    const upgradedToken = jwt.sign(
      {
        userId: user._id,
        mfaEnabled: true,
        mfaVerified: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🍪 Store in HttpOnly cookie
    res.cookie("access_token", upgradedToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "MFA verified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to verify MFA" });
  }
};

// MFA Reset Trigger
const mfaResetTrigger = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // ✅ Find user in DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Generate cryptographically secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // ✅ Save token to user for one-time use
    user.mfaLinkToken = token;
    user.mfaLinkExpiresAt = expiresAt;
    user.mfaLinkUsed = false;
    await user.save();

    // ✅ Send email (emailService builds the link)
    await sendHelloWorldEmail(user.email, token);

    res.status(200).json({ message: "MFA reset email sent successfully" });
  } catch (err) {
    console.error("Error in MFA reset trigger:", err);
    res.status(500).json({ error: "Failed to send MFA reset email" });
  }
};

// MFA Reset
const mfaReset = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    const user = await User.findOne({ mfaLinkToken: token });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired link" });

    if (user.mfaLinkUsed) {
      return res.status(400).json({ error: "This link has already been used" });
    }

    if (!user.mfaLinkExpiresAt || Date.now() > user.mfaLinkExpiresAt) {
      return res.status(400).json({ error: "Link has expired" });
    }

    user.mfaSecret = undefined;
    user.mfaEnabled = false;
    user.mfaLinkUsed = true;
    await user.save();

    const newLoginToken = jwt.sign(
      {
        userId: user._id,
        mfaEnabled: false,
        mfaVerified: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "MFA has been reset successfully",
      token: newLoginToken,
    });
  } catch (err) {
    console.error("Error in MFA reset:", err);
    res.status(500).json({ error: "Failed to reset MFA" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  mfaSetup,
  mfaVerify,
  mfaResetTrigger,
  mfaReset,
};
