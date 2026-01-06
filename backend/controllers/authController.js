const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("LOGIN PROCESS", username, password);

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
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    console.log("SUCCESS", token);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.cookies?.access_token;

  console.log("TOKEN", token);

  // No token present
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user context to request
    req.user = {
      userId: decoded.userId,
      mfaEnabled: decoded.mfaEnabled,
      mfaVerified: decoded.mfaVerified,
    };

    // Proceed to protected route
    next();
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Auth Me
const authMe = (req, res) => {
  res.sendStatus(200);
};

// Logout User
const logoutUser = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    path: "/",
  });

  return res.sendStatus(204);
};

module.exports = {
  loginUser,
  authenticate,
  authMe,
  logoutUser,
};
