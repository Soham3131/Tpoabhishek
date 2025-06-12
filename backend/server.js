
const express = require("express");
const dotenv = require("dotenv"); // Always at the very top!
dotenv.config(); // Load environment variables first.

const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary').v2; // Import cloudinary here


// --- CONFIGURE CLOUDINARY DIRECTLY HERE ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("Cloudinary Configured in server.js:");
console.log("  CLOUD_NAME (env):", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "NOT LOADED");
console.log("  API_KEY (env):", process.env.CLOUDINARY_API_KEY ? "Loaded" : "NOT LOADED");
console.log("  API_SECRET (env):", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "NOT LOADED");


connectDB(); // Connect to MongoDB after dotenv.config()

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://tpoabhishek.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed.'));
    }
  },
  credentials: true,
}));

// fileUpload middleware MUST be before express.json() and express.urlencoded()
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 },
  createParentPath: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// --- Routes that DO NOT need CSRF protection ---
app.use("/api/auth", require("./routes/authRoutes"));


// --- CSRF protection instance ---
const csrfProtection = csurf({ cookie: true });

// --- Middleware to set XSRF-TOKEN cookie ---
app.use((req, res, next) => {
    if (req.csrfToken) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
});

// --- Dedicated endpoint to get CSRF token ---
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// --- Import and Mount Application Routes ---
const applicationRoutes = require("./routes/applicationRoutes"); // Import the routes
// It's generally good practice to place more specific routes or those that might
// have broader matching patterns (like ID routes) abhor before more general ones.
// Apply csrfProtection here to protect application tracking endpoints.
app.use("/api/applications", csrfProtection, applicationRoutes);


// --- Routes that DO need CSRF protection ---
// Ensure these are placed AFTER any general CSRF middleware if specific routes are not protected above
app.use("/api/resume", csrfProtection, require("./routes/resumeRoutes"));
app.use("/api/placements", csrfProtection, require("./routes/placementRoutes"));
app.use("/api/internships", csrfProtection, require("./routes/internshipRoutes"));
app.use("/api/seminars", csrfProtection, require("./routes/seminarRoutes"));
app.use("/api/trainings", csrfProtection, require("./routes/trainingRoutes"));
app.use("/api/jobfairs", csrfProtection, require("./routes/jobFairRoutes"));
app.use("/api/visits", csrfProtection, require("./routes/visitRoutes"));
app.use("/api/workshops", csrfProtection, require("./routes/workshopRoutes"));
app.use("/api/admin", csrfProtection, require("./routes/adminRoutes"));


// Error handling for CSRF tokens
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('SERVER: EBADCSRFTOKEN caught for:', {
      method: req.method,
      path: req.path,
      headers: req.headers['x-csrf-token'] ? 'X-CSRF-Token present' : 'X-CSRF-Token absent',
      cookies: req.cookies
    });
    return res.status(403).json({ msg: 'Invalid CSRF token' });
  }
  next(err);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
