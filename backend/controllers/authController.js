const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isProduction } = require("../utils/environment");

// Login User
const loginUser = async (req, res) => {
  const { username, password, expectedUserId } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (expectedUserId && String(user._id) !== String(expectedUserId)) {
      return res.status(403).json({ error: "REAUTH_ACCOUNT_MISMATCH" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        mfaEnabled: user.mfaEnabled || false,
        mfaVerified: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Auth Me
const authMe = (req, res) => {
  res.status(200).json({ userId: String(req.user.userId) });
};

// Logout User
const logoutUser = (req, res) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  });

  return res.sendStatus(204);
};

module.exports = {
  loginUser,
  authMe,
  logoutUser,
};
