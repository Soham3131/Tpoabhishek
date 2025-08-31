const mongoose = require("mongoose");

const corporateEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  hostCompany: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  registrationLink: String,
  speakers: [String],
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

module.exports = mongoose.model("CorporateEvent", corporateEventSchema);