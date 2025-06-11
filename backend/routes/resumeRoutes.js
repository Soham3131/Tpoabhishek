const express = require("express");
const router = express.Router();
const { createOrUpdateResume, getResume, generateResumePDF } = require("../controllers/resumeController");

// CORRECT IMPORT: Destructure 'protect' from the object exported by authMiddleware
const { protect } = require("../middlewares/authMiddleware"); 

// POST /api/resume - Create or update a user's resume
router.post("/", protect, createOrUpdateResume);

// GET /api/resume - Get the authenticated user's resume
router.get("/", protect, getResume);

// GET /api/resume/pdf - Generate and download the authenticated user's resume as a PDF
router.get("/pdf", protect, generateResumePDF);

module.exports = router;
