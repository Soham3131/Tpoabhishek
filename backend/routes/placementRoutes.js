
const authorize = require("../middlewares/authorizeMiddleware"); 
const express = require("express");
const router = express.Router();
const {
  createPlacement,
  getAllPlacements,
  getPlacementById, // Import the new function
  deletePlacement
} = require("../controllers/placementController");
const { protect } = require("../middlewares/authMiddleware");

router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createPlacement)
  .get(getAllPlacements);

router.route('/:id')
  .get(getPlacementById) // NEW: Route for getting a single placement by ID
  .delete(protect, authorize(['recruiter', 'admin']), deletePlacement);

module.exports = router;