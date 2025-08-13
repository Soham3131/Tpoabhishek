// const mongoose = require("mongoose");

// // Sub-schemas for repeatable sections
// const educationSchema = new mongoose.Schema({
//   degree: { type: String, required: true },
//   institution: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: Date, // Nullable for ongoing education
//   description: String, // e.g., relevant coursework, achievements
// });

// const experienceSchema = new mongoose.Schema({
//   jobTitle: { type: String, required: true },
//   company: { type: String, required: true },
//   location: String,
//   startDate: { type: Date, required: true },
//   endDate: Date, // Nullable for current job
//   description: String, // e.g., bullet points of responsibilities and achievements
// });

// const projectSchema = new mongoose.Schema({
//   projectName: { type: String, required: true },
//   description: String,
//   technologies: [String], // Array of strings (e.g., ["React", "Node.js"])
//   projectLink: String, // URL to GitHub or live demo
// });

// const skillSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // e.g., "JavaScript", "React", "MongoDB"
//   level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"] }, // Optional
// });

// // Main Resume Schema
// const resumeSchema = new mongoose.Schema({
//   user: { // Link to the User model
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true, // A user can only have one resume
//   },
//   // Personal Information
//   fullName: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: String,
//   linkedin: String,
//   github: String,
//   portfolio: String,
//   link: String,
//   // Summary/Objective
//   summary: String,
//   // Sections (arrays of sub-schemas)
//   education: [educationSchema],
//   experience: [experienceSchema],
//   projects: [projectSchema],
//   skills: [skillSchema],
//   achievements: [String], // Array of general achievements/awards
//   certifications: [String], // Array of certifications
//   languages: [String], // Array of languages known
// }, { timestamps: true });

// module.exports = mongoose.model("Resume", resumeSchema);

const mongoose = require("mongoose");

// Sub-schemas for repeatable sections
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  description: String,
});

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  description: String,
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: String,
  technologies: [String],
  projectLink: String,
});

// A new schema for skills, certifications, and languages
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"] },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: String,
});

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Native"] },
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  linkedin: String,
  github: String,
  portfolio: String,
  summary: String,
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: [skillSchema],
  achievements: [String],
  certifications: [certificationSchema],
  languages: [languageSchema],
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);