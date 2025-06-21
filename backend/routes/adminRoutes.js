const express = require("express");
const router = express.Router();

const { protect, adminProtect } = require("../middlewares/authMiddleware"); 
const { getAllUsers, deleteUser, getAdminDashboardData } = require("../controllers/adminController"); // Import new controller functions


router.get("/dashboard-data", protect, adminProtect, getAdminDashboardData);


router.get("/users", protect, adminProtect, getAllUsers);


router.delete("/users/:id", protect, adminProtect, deleteUser);

module.exports = router;
