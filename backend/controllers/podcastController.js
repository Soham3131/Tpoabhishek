const Podcast = require("../models/Podcast");
const { uploadImageToCloudinary } = require('../utils/uploadImage'); 

exports.createPodcast = async (req, res) => {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    try {
        const { title, description, youtubeLink } = req.body;

        // Check if an image file is provided
        // Now, check if req.files.podcastImage exists AND is an array with at least one item
        if (!req.files || !req.files.podcastImage || req.files.podcastImage.length === 0) {
            return res.status(400).json({ msg: "Please upload an image for the podcast" });
        }

        // Get the first file object from the podcastImage array
        const podcastImageFile = req.files.podcastImage[0]; // <--- CRUCIAL CHANGE HERE

        // Upload image to Cloudinary
        const cloudinaryResponse = await uploadImageToCloudinary(
            podcastImageFile, // <--- Pass the single file object
            "podcasts" // Folder name in Cloudinary for podcast images
        );

        if (!cloudinaryResponse) {
            // This might catch errors from uploadImageToCloudinary if it throws
            return res.status(500).json({ msg: "Failed to upload image to Cloudinary" });
        }

        const newPodcastData = {
            title,
            description,
            youtubeLink,
            imageUrl: cloudinaryResponse.secure_url, // Store the secure URL from Cloudinary
            user: req.user.id, // Link the podcast to the user (admin) who created it
        };

        const podcast = await Podcast.create(newPodcastData);
        res.status(201).json(podcast);
    } catch (err) {
        console.error("Error creating podcast:", err);
        // Ensure you return a meaningful error message to the frontend
        res.status(500).json({ msg: "Error creating podcast", error: err.message || "Unknown error" });
    }
};

// @desc    Get all podcasts
// @route   GET /api/podcasts
// @access  Public
// backend/controllers/podcastController.js
exports.getAllPodcasts = async (req, res) => {
    console.log("--- getAllPodcasts controller hit! ---"); // Add this
    try {
        const podcasts = await Podcast.find({});
        console.log("Fetched podcasts:", podcasts.length, "podcasts."); // Add this
        res.status(200).json(podcasts);
    } catch (error) {
        console.error("Error fetching all podcasts:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// @desc    Get a single podcast by ID
// @route   GET /api/podcasts/:id
// @access  Public
exports.getPodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ msg: "Podcast not found" });
    }
    res.status(200).json(podcast);
  } catch (err) {
    console.error("Error fetching podcast by ID:", err);
    res.status(500).json({ msg: "Error fetching podcast", error: err.message });
  }
};

// @desc    Delete a podcast by ID
// @route   DELETE /api/podcasts/:id
// @access  Private (Admin or Creator)
exports.deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);

    if (!podcast) {
      return res.status(404).json({ msg: "Podcast not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && podcast.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this podcast. Only an admin or the creator can delete." });
    }

    // Optional: Delete image from Cloudinary as well
    // You'll need to extract public_id from the imageUrl for this
    // For now, we'll just delete the database entry.
    // To implement Cloudinary deletion, you'd need the public_id from the original upload.
    // cloudinary.uploader.destroy(public_id_here);

    await podcast.deleteOne();
    res.status(200).json({ msg: "Podcast deleted successfully" });
  } catch (err) {
    console.error("Error deleting podcast:", err);
    res.status(500).json({ msg: "Error deleting podcast", error: err.message });
  }
};

// @desc    Update a podcast by ID
// @route   PUT /api/podcasts/:id
// @access  Private (Admin or Creator)
exports.updatePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, youtubeLink } = req.body;

    let podcast = await Podcast.findById(id);

    if (!podcast) {
      return res.status(404).json({ msg: "Podcast not found" });
    }

    // Authorization check: Only admin OR the creator can update
    if (req.user.role !== 'admin' && podcast.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this podcast." });
    }

    let imageUrl = podcast.imageUrl; // Keep existing image by default

    // If a new image is uploaded, process it
    if (req.files && req.files.podcastImage) {
      const podcastImage = req.files.podcastImage;

      // Optional: Delete old image from Cloudinary before uploading new one
      // This requires storing the public_id with the podcast entry
      // For now, we'll just update the URL.

      const cloudinaryResponse = await uploadImageToCloudinary(
        podcastImage,
        "podcasts"
      );

      if (!cloudinaryResponse) {
        return res.status(500).json({ msg: "Failed to upload new image to Cloudinary" });
      }
      imageUrl = cloudinaryResponse.secure_url;
    }

    const updatedPodcastData = {
      title: title || podcast.title,
      description: description || podcast.description,
      youtubeLink: youtubeLink || podcast.youtubeLink,
      imageUrl: imageUrl,
    };

    podcast = await Podcast.findByIdAndUpdate(
      id,
      { $set: updatedPodcastData },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    res.status(200).json(podcast);
  } catch (err) {
    console.error("Error updating podcast:", err);
    res.status(500).json({ msg: "Error updating podcast", error: err.message });
  }
};