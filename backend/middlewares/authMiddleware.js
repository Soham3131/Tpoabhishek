const jwt = require("jsonwebtoken");
const User = require("../models/User");


const protect = async (req, res, next) => {
  let token;

  // --- MODIFIED: Look for token in Authorization header first ---
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer TOKEN"
    console.log("PROTECT MIDDLEWARE: Token found in Authorization header.");
  }
  // If no token in Authorization header, check cookies (as fallback, or for CSRF cookie)
  // For JWT bearer, you typically wouldn't rely on HttpOnly cookie after this change.
  // We keep the old cookie check for potential debugging, but it should fail
  // for the main JWT now if you remove HttpOnly in setAuthCookies (which we did by moving to body)
  // if (!token && req.cookies.token) {
  //   token = req.cookies.token;
  //   console.log("PROTECT MIDDLEWARE: Token found in cookies (fallback).");
  // }
  // --- END MODIFIED ---

  if (!token) {
    console.log("PROTECT MIDDLEWARE: No token found in Authorization header.");
    return res.status(401).json({ msg: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isVerified) {
      console.log("PROTECT MIDDLEWARE: User not found or not verified AFTER token decode.");
      return res.status(401).json({ msg: "Not authorized, user not found or not verified" });
    }
    next();
  } catch (error) {
    console.error("PROTECT MIDDLEWARE: Token verification error:", error);
    res.status(401).json({ msg: "Not authorized, token failed" });
  }
};
// const protect = async (req, res, next) => {
//   let token;


//    // --- ADD THESE LOGS1 ---
//     console.log("\nPROTECT MIDDLEWARE: Checking authentication for request...");
//     console.log("PROTECT MIDDLEWARE: req.cookies.token:", req.cookies.token);
//     // --- END ADDED LOGS ---


//   if (req.cookies.token) {
//     try {
//       token = req.cookies.token;
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user || !req.user.isVerified) {
//         return res.status(401).json({ msg: "Not authorized, user not found or not verified" });
//       }
//       next();
//     } catch (error) {
//       console.error("Token verification error:", error);
//       res.status(401).json({ msg: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ msg: "Not authorized, no token" });
//   }
// };

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