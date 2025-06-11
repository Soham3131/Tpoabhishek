

const express = require("express");
const router = express.Router();
const {
  createSeminar,
  getAllSeminars,
  getSeminarById, // Import the new function
  deleteSeminar
} = require("../controllers/seminarController");
const { protect, } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createSeminar)
  .get(getAllSeminars);

router.route('/:id')
  .get(getSeminarById) // NEW: Route for getting a single seminar by ID
  .delete(protect, authorize(['recruiter', 'admin']), deleteSeminar);

module.exports = router;
