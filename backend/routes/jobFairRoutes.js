

const express = require("express");
const router = express.Router();
const {
  createJobFair,
  getAllJobFairs,
  getJobFairById, // Import the new function
  deleteJobFair
} = require("../controllers/jobFairController");
const { protect,  } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createJobFair)
  .get(getAllJobFairs);

router.route('/:id')
  .get(getJobFairById) // NEW: Route for getting a single job fair by ID
  .delete(protect, authorize(['recruiter', 'admin']), deleteJobFair);

module.exports = router;
