const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
  res.sendStatus(200);
};

// Logout User
const logoutUser = (req, res) => {
  res.cookie("access_token", "", {
    httpOnly: true,
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
