const jwt = require("jsonwebtoken");

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.cookies?.access_token;

  console.log("DEBUG", token);

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

    console.log("DEBUG", req.user);

    // Proceed to protected route
    next();
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const requireMfaVerified = (req, res, next) => {
  // MFA not set up at all
  if (!req.user.mfaEnabled) {
    return res.status(403).json({
      error: "MFA_NOT_INITIALIZED",
    });
  }

  // MFA set up but not verified
  if (!req.user.mfaVerified) {
    return res.status(403).json({
      error: "MFA_REQUIRED",
    });
  }

  // MFA verified
  next();
};

module.exports = { authenticate, requireMfaVerified };
