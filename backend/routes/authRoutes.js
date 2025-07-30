

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