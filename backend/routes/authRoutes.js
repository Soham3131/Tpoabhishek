// const express = require("express");
// const {
//   register,
//   login,
//   resetPassword,
//   forgotPassword,
//   verifyOtp,
//   logout,        // Ensure logout is correctly imported
//   getMe,         // Correct getMe to be used for the /me route
//   updateUserProfile
// } = require("../controllers/authController");

// // CORRECT IMPORT: Destructure 'protect' from the object exported by authMiddleware
// const { protect } = require("../middlewares/authMiddleware");

// // User model is not directly used here for routes, it's used in controllers
// // so you can remove: const User = require("../models/User");

// const router = express.Router();

// router.post("/signup", register);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.post("/verify-otp", verifyOtp);

// // This is line 22:8 in your error. 'protect' is now correctly imported.
// router.post("/logout", protect, logout);

// // Use the getMe function imported from authController directly
// router.get("/me", protect, getMe); 

// // Remove the redundant /me route that uses an anonymous async function:
// // router.get("/me", protect, async (req, res) => { /* ... */ });
// // The above block should be deleted as it conflicts with the line above this comment.

// router.put("/profile", protect, updateUserProfile);

// module.exports = router;

const express = require("express");
const {
  register,
  login,
  resetPassword,
  forgotPassword,
  verifyOtp,
  logout,
  getMe,
  updateUserProfile
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);

// --- CHANGE THIS LINE ---
router.post("/logout", logout); // <--- REMOVE 'protect' HERE!

router.get("/me", protect, getMe);
router.put("/profile", protect, updateUserProfile);

module.exports = router;