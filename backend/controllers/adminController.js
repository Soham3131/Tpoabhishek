const User = require("../models/User");

// @desc    Get all users (for admin dashboard)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users, but exclude their password and OTP details for security
    const users = await User.find().select("-password -otp -otpExpires");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ msg: "Server Error", detailedError: error.message });
  }
};

// @desc    Delete a user by ID (for admin dashboard)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Optional: Prevent admin from deleting themselves if you implement a specific admin user
    if (req.user.id === id) {
        return res.status(403).json({ msg: "Admin cannot delete their own account via this interface." });
    }

    await user.deleteOne(); // Use deleteOne for Mongoose 5.x+, remove for Mongoose 6.x+
    // Or, for Mongoose 6+: await User.findByIdAndDelete(id);

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ msg: "Server Error", detailedError: error.message });
  }
};

// Assuming you already have this if you followed previous steps:
exports.getAdminDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const pendingVerifications = await User.countDocuments({ isVerified: false });

    res.status(200).json({
      msg: `Welcome, Admin ${req.user.name}!`,
      stats: {
        totalUsers,
        verifiedUsers,
        pendingVerifications,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ msg: "Server Error", detailedError: error.message });
  }
};
