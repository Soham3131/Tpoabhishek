
const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  stipend: String,
  salary: String, // ADDED: Salary field
  deadline: Date,
  description: String,
  link: String, // Already present, confirmed
  requirements: [String], // ADDED: Requirements field as an array of strings
  // New fields for creator and status
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Assuming a placement must be created by a logged-in user
  },
  status: {
    type: String,
    enum: ["active", "expired", "archived", "draft"],
    default: "active",
  },
}, { timestamps: true });

module.exports = mongoose.model("Placement", placementSchema);
