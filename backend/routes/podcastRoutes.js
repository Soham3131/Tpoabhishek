const express = require("express");
const router = express.Router();
const {
  createPodcast,
  getAllPodcasts,
  getPodcastById,
  deletePodcast,
  updatePodcast,
} = require("../controllers/podcastController");
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

// Routes for creating and getting all podcasts
router.route('/')
  .post(protect, authorize(['admin']), createPodcast) // Only admin can create podcasts
  .get(getAllPodcasts); // Publicly accessible to view all podcasts

// Routes for getting, updating, and deleting a single podcast by ID
router.route('/:id')
  .get(getPodcastById) // Publicly accessible
  .put(protect, authorize(['admin']), updatePodcast) // Only admin can update podcasts
  .delete(protect, authorize(['admin']), deletePodcast); // Only admin can delete podcasts

module.exports = router;