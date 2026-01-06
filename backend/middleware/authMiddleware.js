const jwt = require("jsonwebtoken");

// Auth Middleware
const authenticate = (req, res, next) => {
  console.log("AUTH HIT:", req.method, req.originalUrl);

  const token = req.cookies?.access_token;

  console.log("Authentication TOKEN", token);

  // No token present
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
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

    console.log("Authentication USER", req.user);

    // Proceed to protected route
    next();
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const requireMfaVerified = (req, res, next) => {
  console.log(
    "MFA CHECK:",
    req.originalUrl,
    "enabled:",
    req.user.mfaEnabled,
    "verified:",
    req.user.mfaVerified
  );

  if (!req.user?.mfaEnabled) {
    // User does not have MFA enabled → allow
    return next();
  }

  if (!req.user.mfaVerified) {
    return res.status(403).json({
      error: "MFA_REQUIRED",
    });
  }

  next();
};

module.exports = { authenticate, requireMfaVerified };
