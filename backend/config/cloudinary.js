const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensure dotenv is loaded here, or earlier in server.js

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // <-- CORRECTED
  api_key: process.env.CLOUDINARY_API_KEY,         // <-- CORRECTED
  api_secret: process.env.CLOUDINARY_API_SECRET,   // <-- CORRECTED
  secure: true // Use HTTPS URLs
});

console.log("Cloudinary Configured (after correction):");
console.log("  CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "NOT LOADED");
console.log("  API_KEY:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "NOT LOADED");
console.log("  API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "NOT LOADED");

module.exports = cloudinary; // Export the configured cloudinary instance