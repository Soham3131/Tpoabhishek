const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contentId: { // The ID of the job, internship, etc. that was applied for
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentType: { // e.g., 'job', 'internship', 'seminar', 'workshop', 'visit', 'jobfair', 'training'
    type: String,
    required: true,
    enum: ['job', 'internship', 'seminar', 'workshop', 'visit', 'jobfair', 'training'],
  },
  appliedLink: { // The external link the user was directed to
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Optional: Add an index for faster lookups by user and content
ApplicationSchema.index({ userId: 1, contentId: 1, contentType: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
