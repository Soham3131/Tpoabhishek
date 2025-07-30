

const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { generateOTP, getExpiry } = require("../services/otpService");
const { sendEmail } = require("../services/emailService");
const { uploadImageToCloudinary } = require("../utils/uploadImage"); // Ensure this path is correct


const setAuthCookies = (res, userId, userRole) => {
  const token = generateToken(userId, userRole);

  const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/', 
  };

  if (process.env.NODE_ENV === 'production') {
    
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'None';
  } else {
 
    cookieOptions.secure = false; 
    cookieOptions.sameSite = 'Lax';
  }

  res.cookie('token', token, cookieOptions);
};

// @desc    Register new user (sends OTP for verification)
// @route   POST /api/auth/signup
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("Register: Received request for email:", email);

  try {
    if (!name || !email || !password) {
      console.log("Register: Missing name, email, or password.");
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.isVerified) {
            console.log("Register: User already exists and is verified for email:", email);
            return res.status(400).json({ msg: "Email already registered and verified. Please login." });
        } else {
            console.log("Register: User exists but not verified. Attempting to resend OTP to:", email);
            const otp = generateOTP();
            const otpExpires = getExpiry();
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            await existingUser.save();

            await sendEmail(email, "Verify your account - OTP (Resend)", `Your new OTP for account verification is: ${otp}. It is valid for 10 minutes.`);
            console.log("Register: Resent OTP successfully.");
            return res.status(200).json({ msg: "Account already registered but not verified. New OTP sent to your email." });
        }
    }

    const userRole = (role && ["user", "recruiter", "admin"].includes(role)) ? role : "user";
    console.log("Register: User role determined as:", userRole);

    const otp = generateOTP();
    const otpExpires = getExpiry();

    console.log("Register: Generated OTP:", otp, "Expires:", otpExpires);

    const user = await User.create({ name, email, password, role: userRole, otp, otpExpires, isVerified: false });
    console.log("Register: New user created in DB:", user._id);
    console.log("Register: User OTP and Expiry in DB:", user.otp, user.otpExpires);
    console.log("Register: isVerified status:", user.isVerified);

    await sendEmail(email, "Verify your account - OTP", `Your OTP for account verification is: ${otp}. It is valid for 10 minutes.`);
    console.log("Register: Email sent successfully for new user.");

    res.status(200).json({ msg: "OTP sent to your email. Please verify your account." });

  } catch (err) {
    console.error("Register error (caught in try/catch):", err);
    res.status(500).json({ msg: "Server Error", detailedError: err.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

     // --- ADD THESE LOGS1 ---
    console.log("AUTH CONTROLLER: Attempting login for email:", email);
    // --- END ADDED LOGS ---

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.isVerified) {
        console.log("Login: User not verified for email:", email);
        return res.status(401).json({ msg: "Account not verified. Please verify your email with the OTP sent during signup." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    setAuthCookies(res, user._id, user.role);

     // --- ADD THIS LOGS1 AFTER setAuthCookies ---
        console.log("AUTH CONTROLLER: Login successful. Cookie set via setAuthCookies.");
        console.log("AUTH CONTROLLER: Headers sent in login response (looking for Set-Cookie):", res.getHeaders());
        // --- END ADDED LOG ---

    const { password: _, ...userData } = user._doc;
    res.status(200).json({ user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc    Log out user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  // Clear the token cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  // Clear the XSRF-TOKEN cookie too (optional, but good practice for full logout)
  res.cookie('XSRF-TOKEN', '', {
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  res.status(200).json({ msg: 'Logged out successfully' });
};

// @desc    Request OTP for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = generateOTP();
    const expiry = getExpiry();

    user.otp = otp;
    user.otpExpires = expiry;
    await user.save();

    console.log("Generated OTP for forgot password:", otp);
    await sendEmail(email, "Your OTP for Password Reset", `Your OTP is: ${otp}`);

    res.json({ msg: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("Verify OTP: Received request for email:", email, "with OTP:", otp);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Verify OTP: User not found for email:", email);
      return res.status(404).json({ msg: "User not found." });
    }

    if (user.isVerified) {
        console.log("Verify OTP: User already verified:", email);
        return res.status(200).json({ msg: "Account already verified." });
    }

    if (!user.otp || !user.otpExpires) {
      console.log("Verify OTP: OTP data missing for email:", email);
      return res.status(400).json({ msg: "OTP not found for this account. Please request a new one (try signing up again)." });
    }

    console.log("Verify OTP: Stored OTP:", user.otp, "Received OTP:", otp);
    console.log("Verify OTP: Expiry:", user.otpExpires, "Current time:", new Date());

    if (user.otpExpires < new Date()) {
      console.log("Verify OTP: OTP expired for email:", email);
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(400).json({ msg: "OTP expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      console.log("Verify OTP: Invalid OTP for email:", email);
      return res.status(400).json({ msg: "Invalid OTP. Please try again." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    console.log("Verify OTP: Account verified successfully for email:", email);

    res.status(200).json({ msg: "Account verified successfully!" });

  } catch (error) {
    console.error("Verify OTP error (caught in try/catch):", error);
    res.status(500).json({ msg: "Server Error", detailedError: error.message });
  }
};

// @desc    Reset user password after OTP verification
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ msg: "Server error during password reset" });
  }
};

// @desc    Get current logged-in user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ msg: "Server Error", detailedError: error.message });
  }
};

// @desc    Update user profile (name, email, profilePicture)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  console.log("updateUserProfile: --- START ---");
  console.log("updateUserProfile: Authenticated userId:", req.user.id);
  console.log("updateUserProfile: Received req.body:", req.body);
  console.log("updateUserProfile: Received req.files:", req.files);

  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      console.log("updateUserProfile: User not found for ID:", userId);
      return res.status(404).json({ msg: "User not found" });
    }

    user.name = name || user.name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, isVerified: true });
      if (emailExists && emailExists._id.toString() !== userId) {
        console.log("updateUserProfile: Email already taken:", email);
        return res.status(400).json({ msg: "Email already taken by another verified user." });
      }
      user.email = email;
    }

    if (req.files && req.files.profilePicture) {
      const profilePictureFile = req.files.profilePicture;
      console.log("Profile picture file received:", profilePictureFile.name);

      const cloudinaryResponse = await uploadImageToCloudinary(profilePictureFile, "profile_pictures");
      user.profilePicture = cloudinaryResponse.secure_url;
      console.log("Profile picture uploaded to Cloudinary URL:", user.profilePicture);
    } else {
      console.log("updateUserProfile: No new profile picture file received.");
    }

    await user.save();
    console.log("updateUserProfile: User model saved successfully.");

    const { password: _, ...updatedUser } = user._doc;
    res.status(200).json({ msg: "Profile updated successfully", user: updatedUser });

  } catch (err) {
    console.error("updateUserProfile: Catch block error:", err);
    if (err.name === 'ValidationError') {
      console.error("updateUserProfile: Mongoose Validation Error Details:", err.errors);
      const errors = Object.values(err.errors).map(el => el.message);
      const errorMessage = `Validation failed: ${errors.join('. ')}`;
      return res.status(400).json({ msg: errorMessage, detailedError: err.message, validationErrors: err.errors });
    }
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  } finally {
    console.log("updateUserProfile: --- END ---");
  }
};
