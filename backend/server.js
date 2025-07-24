

const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables first.

const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const csurf = require('csurf'); // Import csurf
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary').v2; // Import cloudinary here


// --- CONFIGURE CLOUDINARY DIRECTLY HERE ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use HTTPS for all Cloudinary URLs
});

console.log("Cloudinary Configured in server.js:");
console.log("   CLOUD_NAME (env):", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "NOT LOADED");
console.log("   API_KEY (env):", process.env.CLOUDINARY_API_KEY ? "Loaded" : "NOT LOADED");
console.log("   API_SECRET (env):", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "NOT LOADED");


connectDB(); // Connect to MongoDB after dotenv.config()

const app = express();

// Define allowed origins for CORS.
// These should precisely match your Vercel frontend URLs.
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://tpoabhishek.vercel.app', // Your base Vercel project domain
  'https://tpoabhishek-fg5z.vercel.app', // Your previous specific Vercel deployment
  'https://tpoabhishek-awtb.vercel.app', 
  "https://www.trainingandplacementcell.com"
];

// --- CORS Middleware Configuration ---
// This must be placed before any other middleware that processes requests.
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (e.g., Postman, mobile apps, same-origin)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true); // Allow the request if origin is in the whitelist
    } else {
      console.warn(`CORS: Origin '${origin}' not allowed by policy.`);
      return callback(new Error('CORS policy: This origin is not allowed.'));
    }
  },
  credentials: true, // Crucial: Allows cookies (including JWT token cookie and _csrf cookie) to be sent and received cross-origin
}));

// --- File Upload Middleware ---
// This must be placed before express.json() and express.urlencoded()
// as it handles multipart/form-data.
app.use(fileUpload({
  useTempFiles: true, // Use temporary files for uploads
  tempFileDir: '/tmp/', // Specify a temporary directory for files (required for Render)
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  createParentPath: true // Create parent directories if they don't exist
}));

// --- Body Parsing Middlewares ---
// For parsing JSON request bodies
app.use(express.json());
// For parsing URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// --- Cookie Parser Middleware ---
// This must be placed before any middleware that relies on cookies, such as csurf.
app.use(cookieParser());


// --- Routes that DO NOT need CSRF protection (place BEFORE csurf middleware) ---
// Authentication routes typically do not require CSRF tokens on login/logout
// because they either handle tokens (e.g., JWT) or are session-initiation/termination points.
app.use("/api/auth", require("./routes/authRoutes"));


// --- CSRF protection instance and GLOBAL APPLICATION ---
// This middleware MUST come AFTER cookieParser()
// ... inside csurf configuration
// In backend/server.js
const csrfProtection = csurf({
    cookie: {
        key: '_csrf',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    },
    value: (req) => req.headers['x-csrf-token']
});

app.use(csrfProtection);


// --- Dedicated endpoint to Get CSRF Token ---
// This endpoint will now automatically have req.csrfToken() available
// because it passes through the global csrfProtection.
// No need to pass csrfProtection again here.
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// --- Import and Mount Application Routes ---
// All routes defined below this point will be protected by the global csrfProtection.
// No need to apply csrfProtection individually here anymore.
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/placements", require("./routes/placementRoutes"));
app.use("/api/internships", require("./routes/internshipRoutes"));
app.use("/api/seminars", require("./routes/seminarRoutes"));
app.use("/api/trainings", require("./routes/trainingRoutes"));
app.use("/api/jobfairs", require("./routes/jobFairRoutes"));
app.use("/api/visits", require("./routes/visitRoutes"));
app.use("/api/workshops", require("./routes/workshopRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/podcasts", require("./routes/podcastRoutes"));


// --- Global Error Handling Middleware for CSRF Tokens ---
// This catches specific errors thrown by csurf middleware (e.g., if token is missing or invalid).
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('SERVER: EBADCSRFTOKEN caught for:', {
      method: req.method,
      path: req.path,
      headers: req.headers['x-csrf-token'] ? 'X-CSRF-Token present' : 'X-CSRF-Token absent',
      cookies: req.cookies // Log received cookies for debugging
    });
    // Respond with 403 Forbidden and a message
    return res.status(403).json({ msg: 'Invalid CSRF token. Please refresh the page or try again.' });
  }
  // Pass other errors to the next error handling middleware (if any)
  next(err);
});


// --- Server Listener ---
// The server listens on the port provided by the environment (e.g., Render) or defaults to 5000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
