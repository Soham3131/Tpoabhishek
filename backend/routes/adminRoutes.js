const express = require("express");
const router = express.Router();
// Import the adminProtect middleware specifically
const { protect, adminProtect } = require("../middlewares/authMiddleware"); 
const { getAllUsers, deleteUser, getAdminDashboardData } = require("../controllers/adminController"); // Import new controller functions

// Route to get basic data for Admin Dashboard
router.get("/dashboard-data", protect, adminProtect, getAdminDashboardData);

// NEW: Route to get all users (Admin only)
router.get("/users", protect, adminProtect, getAllUsers);

// NEW: Route to delete a user by ID (Admin only)
router.delete("/users/:id", protect, adminProtect, deleteUser);

module.exports = router;
