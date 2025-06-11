const jwt = require("jsonwebtoken");
const User = require("../models/User");

// General authentication middleware (checks if user is logged in and verified)
const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user || !req.user.isVerified) {
        return res.status(401).json({ msg: "Not authorized, user not found or not verified" });
      }
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ msg: "Not authorized, no token" });
  }
};

// NEW: Middleware to restrict access to Admin role
const adminProtect = (req, res, next) => {
  // This middleware assumes `protect` has already run and `req.user` is available
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ msg: 'Not authorized as an admin' }); // Forbidden
  }
};

module.exports = { protect, adminProtect }; // Export both