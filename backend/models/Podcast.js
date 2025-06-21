const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Trim whitespace from the title
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String, // URL of the image hosted on Cloudinary
    required: true,
  },
  youtubeLink: {
    type: String, // Link to the YouTube podcast video
    required: true,
    validate: {
      validator: function (v) {
        // Basic validation for a YouTube URL
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid YouTube URL!`,
    },
  },
  // Optional: You might want to link podcasts to a user (e.g., admin who posted it)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Assuming podcasts are added by a logged-in user (e.g., admin)
  },
  // Optional: Date of the podcast, if different from creation date
  podcastDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

module.exports = mongoose.model("Podcast", podcastSchema);