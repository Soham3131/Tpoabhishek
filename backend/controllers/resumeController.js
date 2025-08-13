

// const Resume = require("../models/Resume");
// const html_to_pdf = require('html-pdf-node'); // Import html-pdf-node

// // @desc    Create or update a user's resume
// // @route   POST /api/resume
// // @access  Private (User) - Requires protect middleware
// exports.createOrUpdateResume = async (req, res) => {
//    // --- DEBUG LOGS START ---
//   console.log("createOrUpdateResume: --- START ---");
//   console.log("createOrUpdateResume: Authenticated userId:", req.user.id);
//   console.log("createOrUpdateResume: Received req.body:", req.body); // Check all resume data
//    // --- DEBUG LOGS END ---

//   try {
//     const userId = req.user.id;
//     const resumeData = req.body;

//     let resume = await Resume.findOne({ user: userId });

//     if (resume) {
//       // If resume exists, update it
//       resume = await Resume.findOneAndUpdate({ user: userId }, resumeData, {
//         new: true, // Return the updated document
//         runValidators: true, // Run Mongoose schema validators on update
//       });
//       res.status(200).json(resume);
//     } else {
//       // If no resume exists, create a new one
//       resume = await Resume.create({ ...resumeData, user: userId });
//       res.status(201).json(resume);
//     }
//   } catch (err) {
//     console.error("Error in createOrUpdateResume:", err); // More specific logging
//     res.status(500).json({ msg: "Error saving resume", error: err.message });
//   }
// };

// // @desc    Get a user's resume
// // @route   GET /api/resume
// // @access  Private (User) - Requires protect middleware
// exports.getResume = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     // Populate user details if you want to access name/email directly from the user document
//     const resume = await Resume.findOne({ user: userId }).populate("user", "name email");

//     if (!resume) {
//       return res.status(404).json({ msg: "Resume not found for this user" });
//     }
//     res.status(200).json(resume);
//   } catch (err) {
//     console.error("Error in getResume:", err); // More specific logging
//     res.status(500).json({ msg: "Error fetching resume", error: err.message });
//   }
// };

// // @desc    Generate PDF from resume data
// // @route   GET /api/resume/pdf
// // @access  Private (User) - Requires protect middleware
// exports.generateResumePDF = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const resume = await Resume.findOne({ user: userId });

//     if (!resume) {
//       return res.status(404).json({ msg: "Resume not found for this user. Please create one first." });
//     }

//     const resumeData = resume.toObject();
//     const resumeHtml = generateResumeHtml(resumeData); // Get the HTML content

//     // html-pdf-node configuration
//     const file = { content: resumeHtml }; // The HTML content to convert
//     const options = {
//       format: 'A4',
//       printBackground: true, // Ensure background colors/images are printed
//       margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
//       // html-pdf-node often uses Puppeteer internally.
//       // These args are common for headless Chrome in server environments.
//       // If you face browser not found issues, you might need to add executablePath here
//       // pointing to a system-installed Chromium, but try without it first.
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-gpu',
//         '--single-process',
//         '--no-zygote',
//       ],
//     };

//     try {
//       // Generate PDF using html-pdf-node
//       const pdfBuffer = await html_to_pdf.generatePdf(file, options);

//       res.setHeader('Content-Type', 'application/pdf');
//       const fileName = resumeData.fullName ? resumeData.fullName.replace(/\s/g, '_') : 'Resume';
//       res.setHeader('Content-Disposition', `attachment; filename=${fileName}_Resume.pdf`);
//       res.send(pdfBuffer);

//     } catch (pdfGenError) {
//       console.error("Error generating PDF with html-pdf-node:", pdfGenError);
//       res.status(500).json({ msg: "Error generating resume PDF", error: pdfGenError.message });
//     }

//   } catch (err) {
//     console.error("Error fetching resume data or general PDF error:", err);
//     res.status(500).json({ msg: "Error generating resume PDF", error: err.message });
//   }
// };

// // Helper function to generate HTML for the resume PDF
// // const generateResumeHtml = (resumeData) => {
// //   // Defensive checks for data existence
// //   const fullName = resumeData.fullName || 'N/A';
// //   const email = resumeData.email || 'N/A';
// //   const phone = resumeData.phone || '';
// //   const linkedin = resumeData.linkedin || '';
// //   const github = resumeData.github || '';
// //   const portfolio = resumeData.portfolio || '';
// //   const summary = resumeData.summary || '';

// //   // Helper to format dates consistently
// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     try {
// //       return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
// //     } catch (e) {
// //       return 'Invalid Date';
// //     }
// //   };

// //   // HTML content for the PDF, using fetched resumeData
// //   // Optimized for better readability and handling of missing data
// //   return `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //         <title>${fullName}'s Resume</title>
// //         <meta charset="UTF-8">
// //         <style>
// //             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
// //             body { font-family: 'Inter', Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; font-size: 14px; }
// //             h1 { font-size: 24px; color: #2c3e50; text-align: center; margin-bottom: 10px; }
// //             h2 { font-size: 18px; color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px; }
// //             h3 { font-size: 16px; margin-top: 15px; margin-bottom: 5px; color: #34495e; }
// //             p { margin: 0 0 5px 0; padding: 0; }
// //             ul { list-style-type: none; padding: 0; margin: 0; }
// //             li { margin-bottom: 5px; padding-left: 15px; position: relative; }
// //             li::before { content: '•'; position: absolute; left: 0; color: #2c3e50; }
// //             .section { margin-bottom: 20px; }
// //             .item-title { font-weight: bold; margin-bottom: 5px; font-size: 1.1em; }
// //             .item-details { font-style: italic; color: #555; font-size: 0.9em; margin-bottom: 5px; }
// //             .contact-info { text-align: center; margin-bottom: 20px; }
// //             .contact-info p { display: inline-block; margin: 0 10px; }
// //             a { color: #3498db; text-decoration: none; }
// //             a:hover { text-decoration: underline; }
// //             .description { margin-top: 5px; }
// //             .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
// //             .skill-item { background-color: #ecf0f1; padding: 5px 10px; border-radius: 3px; font-size: 0.9em; white-space: nowrap; }
// //         </style>
// //     </head>
// //     <body>
// //         <div class="section">
// //             <h1>${fullName}</h1>
// //             <div class="contact-info">
// //                 <p>${email}</p>
// //                 ${phone ? `<p>${phone}</p>` : ''}
// //                 ${linkedin ? `<p><a href="${linkedin}">LinkedIn</a></p>` : ''}
// //                 ${github ? `<p><a href="${github}">GitHub</a></p>` : ''}
// //                 ${portfolio ? `<p><a href="${portfolio}">Portfolio</a></p>` : ''}
// //             </div>
// //         </div>

// //         ${summary ? `<div class="section">
// //             <h2>Summary</h2>
// //             <p class="description">${summary}</p>
// //         </div>` : ''}

// //         ${resumeData.experience && resumeData.experience.length > 0 ? `
// //             <div class="section">
// //                 <h2>Experience</h2>
// //                 ${resumeData.experience.map(exp => `
// //                     <div>
// //                         <h3>${exp.jobTitle || 'N/A'} at ${exp.company || 'N/A'}</h3>
// //                         <div class="item-details">${exp.location || 'N/A'} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
// //                         ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
// //                     </div>
// //                 `).join('')}
// //             </div>
// //         ` : ''}

// //         ${resumeData.education && resumeData.education.length > 0 ? `
// //             <div class="section">
// //                 <h2>Education</h2>
// //                 ${resumeData.education.map(edu => `
// //                     <div>
// //                         <h3>${edu.degree || 'N/A'} from ${edu.institution || 'N/A'}</h3>
// //                         <div class="item-details">${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}</div>
// //                         ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
// //                     </div>
// //                 `).join('')}
// //             </div>
// //         ` : ''}

// //         ${resumeData.projects && resumeData.projects.length > 0 ? `
// //             <div class="section">
// //                 <h2>Projects</h2>
// //                 ${resumeData.projects.map(proj => `
// //                     <div>
// //                         <h3>${proj.projectName || 'N/A'}</h3>
// //                         ${proj.technologies && proj.technologies.length > 0 ? `<div class="item-details">Technologies: ${proj.technologies.join(', ')}</div>` : ''}
// //                         ${proj.projectLink ? `<div class="item-details"><a href="${proj.projectLink}">${proj.projectLink}</a></div>` : ''}
// //                         ${proj.description ? `<p class="description">${proj.description}</p>` : ''}
// //                     </div>
// //                 `).join('')}
// //             </div>
// //         ` : ''}

// //         ${resumeData.skills && resumeData.skills.length > 0 ? `
// //             <div class="section">
// //                 <h2>Skills</h2>
// //                 <div class="skills-list">
// //                     ${resumeData.skills.map(skill => {
// //                         // Handle both string array and object array for skills
// //                         const skillName = typeof skill === 'string' ? skill : (skill.name || 'N/A');
// //                         const skillLevel = typeof skill === 'object' && skill.level ? ` (${skill.level})` : '';
// //                         return `<span class="skill-item">${skillName}${skillLevel}</span>`;
// //                     }).join('')}
// //                 </div>
// //             </div>
// //         ` : ''}

// //         ${resumeData.achievements && resumeData.achievements.length > 0 ? `
// //             <div class="section">
// //                 <h2>Achievements</h2>
// //                 <ul>
// //                     ${resumeData.achievements.map(ach => `<li>${ach}</li>`).join('')}
// //                 </ul>
// //             </div>
// //         ` : ''}

// //         ${resumeData.certifications && resumeData.certifications.length > 0 ? `
// //             <div class="section">
// //                 <h2>Certifications</h2>
// //                 <ul>
// //                     ${resumeData.certifications.map(cert => `<li>${cert.name || 'N/A'} (${cert.issuer || 'N/A'})</li>`).join('')}
// //                 </ul>
// //             </div>
// //         ` : ''}

// //         ${resumeData.languages && resumeData.languages.length > 0 ? `
// //             <div class="section">
// //                 <h2>Languages</h2>
// //                 <ul>
// //                     ${resumeData.languages.map(lang => `<li>${lang.name || 'N/A'}${lang.proficiency ? ` (${lang.proficiency})` : ''}</li>`).join('')}
// //                 </ul>
// //             </div>
// //         ` : ''}

// //     </body>
// //     </html>
// //   `;
// // };

const Resume = require("../models/Resume");
const html_to_pdf = require('html-pdf-node'); // Import html-pdf-node

// @desc    Create or update a user's resume
// @route   POST /api/resume
// @access  Private (User) - Requires protect middleware
exports.createOrUpdateResume = async (req, res) => {
    // --- DEBUG LOGS START ---
  console.log("createOrUpdateResume: --- START ---");
  console.log("createOrUpdateResume: Authenticated userId:", req.user.id);
  console.log("createOrUpdateResume: Received req.body:", req.body); // Check all resume data
    // --- DEBUG LOGS END ---

  try {
    const userId = req.user.id;
    const resumeData = req.body;

    let resume = await Resume.findOne({ user: userId });

    if (resume) {
      // If resume exists, update it
      resume = await Resume.findOneAndUpdate({ user: userId }, resumeData, {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose schema validators on update
      });
      res.status(200).json(resume);
    } else {
      // If no resume exists, create a new one
      resume = await Resume.create({ ...resumeData, user: userId });
      res.status(201).json(resume);
    }
  } catch (err) {
    console.error("Error in createOrUpdateResume:", err); // More specific logging
    res.status(500).json({ msg: "Error saving resume", error: err.message });
  }
};

// @desc    Get a user's resume
// @route   GET /api/resume
// @access  Private (User) - Requires protect middleware
exports.getResume = async (req, res) => {
  try {
    const userId = req.user.id;
    // Populate user details if you want to access name/email directly from the user document
    const resume = await Resume.findOne({ user: userId }).populate("user", "name email");

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found for this user" });
    }
    res.status(200).json(resume);
  } catch (err) {
    console.error("Error in getResume:", err); // More specific logging
    res.status(500).json({ msg: "Error fetching resume", error: err.message });
  }
};

// @desc    Generate PDF from resume data
// @route   GET /api/resume/pdf
// @access  Private (User) - Requires protect middleware
exports.generateResumePDF = async (req, res) => {
  const userId = req.user.id;

  try {
    const resume = await Resume.findOne({ user: userId });

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found for this user. Please create one first." });
    }

    const resumeData = resume.toObject();
    const resumeHtml = generateResumeHtml(resumeData); // Get the HTML content

    // html-pdf-node configuration
    const file = { content: resumeHtml }; // The HTML content to convert
    const options = {
      format: 'A4',
      printBackground: true, // Ensure background colors/images are printed
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
      ],
    };

    try {
      // Generate PDF using html-pdf-node
      const pdfBuffer = await html_to_pdf.generatePdf(file, options);

      res.setHeader('Content-Type', 'application/pdf');
      const fileName = resumeData.fullName ? resumeData.fullName.replace(/\s/g, '_') : 'Resume';
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}_Resume.pdf`);
      res.send(pdfBuffer);

    } catch (pdfGenError) {
      console.error("Error generating PDF with html-pdf-node:", pdfGenError);
      res.status(500).json({ msg: "Error generating resume PDF", error: pdfGenError.message });
    }

  } catch (err) {
    console.error("Error fetching resume data or general PDF error:", err);
    res.status(500).json({ msg: "Error generating resume PDF", error: err.message });
  }
};

// Helper function to generate HTML for the resume PDF
const generateResumeHtml = (resumeData) => {
  // Helper to format dates consistently
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // HTML content for the PDF, using fetched resumeData
  return `
     <!DOCTYPE html>
     <html>
     <head>
         <title>${resumeData.fullName || 'N/A'}'s Resume</title>
         <meta charset="UTF-8">
         <style>
             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
             body { font-family: 'Inter', Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; font-size: 14px; }
             h1 { font-size: 24px; color: #2c3e50; text-align: center; margin-bottom: 10px; }
             h2 { font-size: 18px; color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px; }
             h3 { font-size: 16px; margin-top: 15px; margin-bottom: 5px; color: #34495e; }
             p { margin: 0 0 5px 0; padding: 0; }
             ul { list-style-type: none; padding: 0; margin: 0; }
             li { margin-bottom: 5px; padding-left: 15px; position: relative; }
             li::before { content: '•'; position: absolute; left: 0; color: #2c3e50; }
             .section { margin-bottom: 20px; }
             .item-title { font-weight: bold; margin-bottom: 5px; font-size: 1.1em; }
             .item-details { font-style: italic; color: #555; font-size: 0.9em; margin-bottom: 5px; }
             .contact-info { text-align: center; margin-bottom: 20px; }
             .contact-info p { display: inline-block; margin: 0 10px; }
             a { color: #3498db; text-decoration: none; }
             a:hover { text-decoration: underline; }
             .description { margin-top: 5px; }
             .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
             .skill-item { background-color: #ecf0f1; padding: 5px 10px; border-radius: 3px; font-size: 0.9em; white-space: nowrap; }
         </style>
     </head>
     <body>
         <div class="section">
             <h1>${resumeData.fullName || 'N/A'}</h1>
             <div class="contact-info">
                 <p>${resumeData.email || 'N/A'}</p>
                 ${resumeData.phone ? `<p>${resumeData.phone}</p>` : ''}
                 ${resumeData.linkedin ? `<p><a href="${resumeData.linkedin}">LinkedIn</a></p>` : ''}
                 ${resumeData.github ? `<p><a href="${resumeData.github}">GitHub</a></p>` : ''}
                 ${resumeData.portfolio ? `<p><a href="${resumeData.portfolio}">Portfolio</a></p>` : ''}
             </div>
         </div>

         ${resumeData.summary ? `<div class="section">
             <h2>Summary</h2>
             <p class="description">${resumeData.summary}</p>
         </div>` : ''}

         ${resumeData.experience && resumeData.experience.length > 0 ? `
             <div class="section">
                 <h2>Experience</h2>
                 ${resumeData.experience.map(exp => `
                     <div>
                         <h3>${exp.jobTitle || 'N/A'} at ${exp.company || 'N/A'}</h3>
                         <div class="item-details">${exp.location || 'N/A'} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                         ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                     </div>
                 `).join('')}
             </div>
         ` : ''}

         ${resumeData.education && resumeData.education.length > 0 ? `
             <div class="section">
                 <h2>Education</h2>
                 ${resumeData.education.map(edu => `
                     <div>
                         <h3>${edu.degree || 'N/A'} from ${edu.institution || 'N/A'}</h3>
                         <div class="item-details">${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}</div>
                         ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
                     </div>
                 `).join('')}
             </div>
         ` : ''}

         ${resumeData.projects && resumeData.projects.length > 0 ? `
             <div class="section">
                 <h2>Projects</h2>
                 ${resumeData.projects.map(proj => `
                     <div>
                         <h3>${proj.projectName || 'N/A'}</h3>
                         ${proj.technologies && proj.technologies.length > 0 ? `<div class="item-details">Technologies: ${proj.technologies.join(', ')}</div>` : ''}
                         ${proj.projectLink ? `<div class="item-details"><a href="${proj.projectLink}">${proj.projectLink}</a></div>` : ''}
                         ${proj.description ? `<p class="description">${proj.description}</p>` : ''}
                     </div>
                 `).join('')}
             </div>
         ` : ''}

         ${resumeData.skills && resumeData.skills.length > 0 ? `
             <div class="section">
                 <h2>Skills</h2>
                 <div class="skills-list">
                     ${resumeData.skills.map(skill => {
                         const skillName = typeof skill === 'string' ? skill : (skill.name || 'N/A');
                         const skillLevel = typeof skill === 'object' && skill.level ? ` (${skill.level})` : '';
                         return `<span class="skill-item">${skillName}${skillLevel}</span>`;
                     }).join('')}
                 </div>
             </div>
         ` : ''}

         ${resumeData.achievements && resumeData.achievements.length > 0 ? `
             <div class="section">
                 <h2>Achievements</h2>
                 <ul>
                     ${resumeData.achievements.map(ach => `<li>${ach}</li>`).join('')}
                 </ul>
             </div>
         ` : ''}

         ${resumeData.certifications && resumeData.certifications.length > 0 ? `
             <div class="section">
                 <h2>Certifications</h2>
                 <ul>
                     ${resumeData.certifications.map(cert => `<li>${cert.name || 'N/A'} (${cert.issuer || 'N/A'})</li>`).join('')}
                 </ul>
             </div>
         ` : ''}

         ${resumeData.languages && resumeData.languages.length > 0 ? `
             <div class="section">
                 <h2>Languages</h2>
                 <ul>
                     ${resumeData.languages.map(lang => `<li>${lang.name || 'N/A'}${lang.proficiency ? ` (${lang.proficiency})` : ''}</li>`).join('')}
                 </ul>
             </div>
         ` : ''}
     </body>
     </html>
   `;
};