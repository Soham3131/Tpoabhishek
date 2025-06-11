
const authorize = require("../middlewares/authorizeMiddleware");
const express = require("express");
const router = express.Router();
const {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById, // Import the new function
  deleteWorkshop
} = require("../controllers/workshopController");
const { protect,  } = require("../middlewares/authMiddleware");

router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createWorkshop)
  .get(getAllWorkshops);

router.route('/:id')
  .get(getWorkshopById) // NEW: Route for getting a single workshop by ID
  .delete(protect, authorize(['recruiter', 'admin']), deleteWorkshop);

module.exports = router;
