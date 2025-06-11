
const authorize = require("../middlewares/authorizeMiddleware");
const express = require("express");
const router = express.Router();
const {
  createTraining,
  getAllTrainings,
  getTrainingById, // Import the new function
  deleteTraining
} = require("../controllers/trainingController");
const { protect, } = require("../middlewares/authMiddleware");

router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createTraining)
  .get(getAllTrainings);

router.route('/:id')
  .get(getTrainingById) // NEW: Route for getting a single training by ID
  .delete(protect, authorize(['recruiter', 'admin']), deleteTraining);

module.exports = router;
