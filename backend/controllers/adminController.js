const User = require("../models/User");


exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password -otp -otpExpires");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ msg: "Server Error", detailedError: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (req.user.id === id) {
        return res.status(403).json({ msg: "Admin cannot delete their own account via this interface." });
    }

    await user.deleteOne(); 

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ msg: "Server Error", detailedError: error.message });
  }
};

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
