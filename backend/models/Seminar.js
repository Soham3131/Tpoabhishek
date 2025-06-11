// const mongoose = require("mongoose");

// const seminarSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   speaker: String,
//   date: Date, // Assuming 'date' will be used for expiry
//   location: String,
//   description: String,
//   link: String,
//   // New fields for creator and status
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true // Assuming a seminar must be created by a logged-in user
//   },
//   status: {
//     type: String,
//     enum: ["active", "expired", "archived", "draft"],
//     default: "active",
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Seminar", seminarSchema);

const mongoose = require("mongoose");

const seminarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: String, // RENAMED: from speaker to organizer
  date: Date,
  location: String,
  description: String,
  link: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["active", "expired", "archived", "draft"],
    default: "active",
  },
}, { timestamps: true });

module.exports = mongoose.model("Seminar", seminarSchema);
