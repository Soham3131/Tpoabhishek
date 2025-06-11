// const express = require("express");
// const router = express.Router();
// const { createInternship, getAllInternships, deleteInternship } = require("../controllers/internshipController");

// // CORRECT IMPORT: Destructure 'protect' from the object exported by authMiddleware
// const { protect } = require("../middlewares/authMiddleware");
// // Assuming authorizeMiddleware exports a single function directly
// const authorize = require("../middlewares/authorizeMiddleware");

// // Route to create a new internship (restricted to 'recruiter' and 'admin')
// router.post("/create", protect, authorize(['recruiter', 'admin']), createInternship); // Corrected authorize usage

// // Route to get all internships (publicly accessible)
// router.get("/", getAllInternships);

// // Route to delete an internship by ID (restricted to 'recruiter' (owner) and 'admin')
// router.delete("/:id", protect, authorize(['recruiter', 'admin']), deleteInternship);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createInternship,
  getAllInternships,
  getInternshipById, // Ensure this is imported from your controller
  deleteInternship
} = require("../controllers/internshipController");
const { protect, } = require("../middlewares/authMiddleware"); 
const authorize = require("../middlewares/authorizeMiddleware");

// Routes for operations on the collection (e.g., /api/internships)
router.route('/')
  .post(protect, authorize(['recruiter', 'admin']), createInternship) // Route to create a new internship
  .get(getAllInternships); // Route to get all internships (publicly accessible)

// Routes for operations on a specific item (e.g., /api/internships/:id)
router.route('/:id')
  .get(getInternshipById) // THIS IS THE CRITICAL ROUTE FOR FETCHING BY ID
  .delete(protect, authorize(['recruiter', 'admin']), deleteInternship); // Route to delete an internship by ID

module.exports = router;
