const express = require("express");
const router = express.Router();
const {
  createCorporateEvent,
  getAllCorporateEvents,
  getCorporateEventById,
  deleteCorporateEvent
} = require("../controllers/corporateEventController");
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");

router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createCorporateEvent)
  .get(getAllCorporateEvents);

router.route('/:id')
  .get(getCorporateEventById)
  .delete(protect, authorize(['recruiter', 'admin']), deleteCorporateEvent);

module.exports = router;