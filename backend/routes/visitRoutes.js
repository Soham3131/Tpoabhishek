
const authorize = require("../middlewares/authorizeMiddleware");

const express = require("express");
const router = express.Router();
const {
  createVisit,
  getAllVisits,
  getVisitById, // Import the new function
  deleteVisit
} = require("../controllers/visitController");
const { protect,  } = require("../middlewares/authMiddleware");

router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createVisit)
  .get(getAllVisits);

router.route('/:id')
  .get(getVisitById) // NEW: Route for getting a single visit by ID
  .delete(protect, authorize(['recruiter', 'admin']), deleteVisit);

module.exports = router;
