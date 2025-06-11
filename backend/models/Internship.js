const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  stipend: String,
  deadline: Date,
  description: String,
  link: String,
  // New fields for creator and status
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Assuming an internship must be created by a logged-in user
  },
  status: {
    type: String,
    enum: ["active", "expired", "archived", "draft"],
    default: "active",
  },
}, { timestamps: true });

module.exports = mongoose.model("Internship", internshipSchema);