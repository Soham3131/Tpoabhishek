
// const mongoose = require("mongoose");

// const visitSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   organization: String, // Or company
//   date: Date, // Assuming 'date' will be used for expiry
//   location: String,
//   description: String,
//   link: String,
//   // New fields for creator and status
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true // Assuming a visit must be created by a logged-in user
//   },
//   status: {
//     type: String,
//     enum: ["active", "expired", "archived", "draft"],
//     default: "active",
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Visit", visitSchema);

const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: String,
  date: Date,
  location: String,
  purpose: String, // ADDED: Purpose of Visit
  contactPerson: String, // ADDED: Contact Person
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

module.exports = mongoose.model("Visit", visitSchema);
