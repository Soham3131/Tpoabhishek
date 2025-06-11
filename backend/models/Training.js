
// const mongoose = require("mongoose");

// const trainingSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   provider: String,
//   duration: String,
//   startDate: Date, // Assuming 'startDate' will be used for expiry
//   cost: String,
//   description: String,
//   link: String,
//   // New fields for creator and status
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true // Assuming a training must be created by a logged-in user
//   },
//   status: {
//     type: String,
//     enum: ["active", "expired", "archived", "draft"],
//     default: "active",
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Training", trainingSchema);

const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: String,
  duration: String,
  startDate: Date,
  endDate: Date, // ADDED: End Date field
  location: String, // ADDED: Location field
  cost: String,
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

module.exports = mongoose.model("Training", trainingSchema);
