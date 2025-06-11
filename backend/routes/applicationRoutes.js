// const express = require('express');
// const router = express.Router();
// // CORRECTED: Changed 'middleware' to 'middlewares' in the import path
// const { protect } = require('../middlewares/authMiddleware');
// const authorize = require ("../middlewares/authorizeMiddleware")
// const {
//   trackApplication,
//   getMyApplications,
//   getAllApplications,
//   getApplicationReport, // Ensure this is also imported if you have a report route
// } = require('../controllers/applicationController');

// // Route to track an application click
// // POST /api/applications/track
// router.route('/track').post(protect, trackApplication);

// // Route to get applications for the logged-in user
// // GET /api/applications/my
// router.route('/my').get(protect, getMyApplications);

// // Route to get all applications (Admin only)
// // GET /api/applications/all
// router.route('/all').get(protect, authorize(['admin']), getAllApplications);

// // Route for the admin application report (if you have one)
// // GET /api/applications/report
// router.route('/report').get(protect, authorize(['admin']), getApplicationReport);

// module.exports = router;

const express = require('express');
const router = express.Router();
// Ensure these are correctly destructured based on how your authMiddleware exports
const { protect} = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');

const {
  trackApplication,
  getMyApplications,
  getAllApplications,
  getApplicationReport, // NEW: Import the report function
} = require('../controllers/applicationController');

console.log('Backend: applicationRoutes.js loaded.'); // DEBUG LOG

// Route to track an application click
// POST /api/applications/track
router.route('/track').post(protect, trackApplication);
console.log('Backend: Route POST /track registered.'); // DEBUG LOG

// Route to get applications for the logged-in user
// GET /api/applications/my
router.route('/my').get(protect, getMyApplications);
console.log('Backend: Route GET /my registered.'); // DEBUG LOG

// Route to get all applications (Admin only)
// GET /api/applications/all
router.route('/all').get(protect, authorize(['admin']), getAllApplications);
console.log('Backend: Route GET /all registered.'); // DEBUG LOG

// NEW: Route for the admin application report
router.route('/report').get(protect, authorize(['admin']), getApplicationReport);
console.log('Backend: Route GET /report registered.'); // DEBUG LOG

module.exports = router;
