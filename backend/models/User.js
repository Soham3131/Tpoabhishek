const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "recruiter", "admin"],
    default: "user",
  },
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String, default: "" }, // NEW: Field for profile picture URL
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(passworda, this.password);
};

module.exports = mongoose.model("User", userSchema);