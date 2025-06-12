// const Resume = require("../models/Resume");
// const puppeteer = require("puppeteer"); // Import puppeteer

// // @desc    Create or update a user's resume
// // @route   POST /api/resume
// // @access  Private (User) - Requires protect middleware
// exports.createOrUpdateResume = async (req, res) => {
//    // --- DEBUG LOGS START ---
//   console.log("createOrUpdateResume: --- START ---");
//   console.log("createOrUpdateResume: Authenticated userId:", req.user.id);
//   console.log("createOrUpdateResume: Received req.body:", req.body); // Check all resume data
//   // --- DEBUG LOGS END ---

//   try {
//     // req.user.id comes from your `protect` middleware, assuming it decodes the JWT
//     // and attaches the user's ID to the request object.
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
//     console.error(err); // Log the full error for debugging
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
//     console.error(err);
//     res.status(500).json({ msg: "Error fetching resume", error: err.message });
//   }
// };

// // @desc    Generate PDF from resume data
// // @route   GET /api/resume/pdf
// // @access  Private (User) - Requires protect middleware
// exports.generateResumePDF = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const resume = await Resume.findOne({ user: userId });

//     if (!resume) {
//       return res.status(404).json({ msg: "Resume not found for this user. Please create one first." });
//     }

//     // --- Start PDF Generation Logic ---
//     // This is a basic HTML template. For more complex styling or multiple templates,
//     // consider using a templating engine like EJS or Handlebars.
//     let htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//           <title>${resume.fullName}'s Resume</title>
//           <style>
//               body { font-family: 'Inter', sans-serif; margin: 20px; color: #333; line-height: 1.6; }
//               h1, h2, h3 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px; }
//               p { margin: 0; padding: 0; }
//               ul { list-style-type: none; padding: 0; }
//               li { margin-bottom: 5px; }
//               .section { margin-bottom: 20px; }
//               .item-title { font-weight: bold; margin-bottom: 5px; font-size: 1.1em; }
//               .item-details { font-style: italic; color: #555; font-size: 0.9em; }
//               .contact-info p { display: inline-block; margin-right: 15px; }
//               a { color: #3498db; text-decoration: none; }
//               a:hover { text-decoration: underline; }
//           </style>
//       </head>
//       <body>
//           <h1>${resume.fullName}</h1>
//           <div class="contact-info">
//               <p>${resume.email}</p>
//               ${resume.phone ? `<p>${resume.phone}</p>` : ''}
//               ${resume.linkedin ? `<p><a href="${resume.linkedin}">LinkedIn</a></p>` : ''}
//               ${resume.github ? `<p><a href="${resume.github}">GitHub</a></p>` : ''}
//               ${resume.portfolio ? `<p><a href="${resume.portfolio}">Portfolio</a></p>` : ''}
//           </div>

//           ${resume.summary ? `<h2>Summary</h2><p>${resume.summary}</p>` : ''}

//           ${resume.experience && resume.experience.length > 0 ? `
//               <h2>Experience</h2>
//               ${resume.experience.map(exp => `
//                   <div class="section">
//                       <div class="item-title">${exp.jobTitle} at ${exp.company}</div>
//                       <div class="item-details">${exp.location} | ${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}</div>
//                       <p>${exp.description}</p>
//                   </div>
//               `).join('')}
//           ` : ''}

//           ${resume.education && resume.education.length > 0 ? `
//               <h2>Education</h2>
//               ${resume.education.map(edu => `
//                   <div class="section">
//                       <div class="item-title">${edu.degree} from ${edu.institution}</div>
//                       <div class="item-details">${new Date(edu.startDate).toLocaleDateString()} - ${edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}</div>
//                       <p>${edu.description}</p>
//                   </div>
//               `).join('')}
//           ` : ''}

//           ${resume.projects && resume.projects.length > 0 ? `
//               <h2>Projects</h2>
//               ${resume.projects.map(proj => `
//                   <div class="section">
//                       <div class="item-title">${proj.projectName}</div>
//                       ${proj.technologies && proj.technologies.length > 0 ? `<div class="item-details">Technologies: ${proj.technologies.join(', ')}</div>` : ''}
//                       ${proj.projectLink ? `<div class="item-details"><a href="${proj.projectLink}">View Project</a></div>` : ''}
//                       <p>${proj.description}</p>
//                   </div>
//               `).join('')}
//           ` : ''}

//           ${resume.skills && resume.skills.length > 0 ? `
//               <h2>Skills</h2>
//               <ul>
//                   ${resume.skills.map(skill => `<li>${skill.name}${skill.level ? ` (${skill.level})` : ''}</li>`).join('')}
//               </ul>
//           ` : ''}

//           ${resume.achievements && resume.achievements.length > 0 ? `
//               <h2>Achievements</h2>
//               <ul>
//                   ${resume.achievements.map(ach => `<li>${ach}</li>`).join('')}
//               </ul>
//           ` : ''}

//           ${resume.certifications && resume.certifications.length > 0 ? `
//               <h2>Certifications</h2>
//               <ul>
//                   ${resume.certifications.map(cert => `<li>${cert}</li>`).join('')}
//               </ul>
//           ` : ''}

//           ${resume.languages && resume.languages.length > 0 ? `
//               <h2>Languages</h2>
//               <ul>
//                   ${resume.languages.map(lang => `<li>${lang}</li>`).join('')}
//               </ul>
//           ` : ''}

//       </body>
//       </html>
//     `;

//     const browser = await puppeteer.launch({
//       headless: true, // Use 'new' for latest or true for older versions; false for debugging GUI
//       // These args are crucial for Puppeteer to work in production environments (e.g., Docker, Heroku)
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // Wait for network to be idle before printing
//     const pdf = await page.pdf({ format: 'A4', printBackground: true }); // printBackground to include styles/colors

//     await browser.close();

//     res.setHeader('Content-Type', 'application/pdf');
//     // Ensure filename is web-safe and uses full name from resume
//     res.setHeader('Content-Disposition', `attachment; filename=${resume.fullName.replace(/\s/g, '_')}_Resume.pdf`);
//     res.send(pdf);

//   } catch (err) {
//     console.error("Error generating PDF:", err);
//     res.status(500).json({ msg: "Error generating resume PDF", error: err.message });
//   }
// };

const Resume = require("../models/Resume");
const puppeteer = require("puppeteer"); // Now import the full puppeteer package directly

// @desc    Create or update a user's resume
// @route   POST /api/resume
// @access  Private (User) - Requires protect middleware
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

// @desc    Get a user's resume
// @route   GET /api/resume
// @access  Private (User) - Requires protect middleware
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

// @desc    Generate PDF from resume data
// @route   GET /api/resume/pdf
// @access  Private (User) - Requires protect middleware
exports.generateResumePDF = async (req, res) => {
  const userId = req.user.id;

  try {
    const resume = await Resume.findOne({ user: userId });

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found for this user. Please create one first." });
    }

    // Convert Mongoose document to a plain JavaScript object for easier handling
    const resumeData = resume.toObject();

    // Generate HTML content for the PDF
    const resumeHtml = generateResumeHtml(resumeData);

    let browser;
    try {
      // Launch Puppeteer, now configured to use a pre-installed Chromium from Render's environment
      browser = await puppeteer.launch({
        // These arguments are crucial for headless Chrome in server environments
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // Recommended for low-memory environments like Render
          '--disable-gpu',
          '--single-process', // Can sometimes help stability in constrained environments
          '--no-zygote' // Another option for certain Linux environments
        ],
        headless: true, // Keep headless as true for production
        // The PUPPETEER_EXECUTABLE_PATH environment variable on Render will
        // explicitly tell Puppeteer where to find Chrome.
        // This makes the launch more robust as it bypasses auto-discovery.
      });

      const page = await browser.newPage();
      await page.setContent(resumeHtml, { waitUntil: 'networkidle0' }); // Wait for network to be idle before printing
      await page.emulateMediaType('screen'); // Ensure screen media type for styling

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, // Include background colors/images from CSS
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      });

      res.setHeader('Content-Type', 'application/pdf');
      // Ensure filename is web-safe and uses full name from resume
      const fileName = resumeData.fullName ? resumeData.fullName.replace(/\s/g, '_') : 'Resume';
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}_Resume.pdf`);
      res.send(pdfBuffer);

    } catch (launchError) {
      console.error("Error launching browser or generating PDF:", launchError);
      res.status(500).json({ msg: "Error generating resume PDF", error: launchError.message });
    } finally {
      if (browser) {
        await browser.close(); // Ensure browser is closed to free up resources
      }
    }
  } catch (err) {
    console.error("Error fetching resume data or general PDF error:", err);
    res.status(500).json({ msg: "Error generating resume PDF", error: err.message });
  }
};

// Helper function to generate HTML for the resume PDF
const generateResumeHtml = (resumeData) => {
  // Defensive checks for data existence
  const fullName = resumeData.fullName || 'N/A';
  const email = resumeData.email || 'N/A';
  const phone = resumeData.phone || '';
  const linkedin = resumeData.linkedin || '';
  const github = resumeData.github || '';
  const portfolio = resumeData.portfolio || '';
  const summary = resumeData.summary || '';

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
  // Optimized for better readability and handling of missing data
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${fullName}'s Resume</title>
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
            <h1>${fullName}</h1>
            <div class="contact-info">
                <p>${email}</p>
                ${phone ? `<p>${phone}</p>` : ''}
                ${linkedin ? `<p><a href="${linkedin}">LinkedIn</a></p>` : ''}
                ${github ? `<p><a href="${github}">GitHub</a></p>` : ''}
                ${portfolio ? `<p><a href="${portfolio}">Portfolio</a></p>` : ''}
            </div>
        </div>

        ${summary ? `<div class="section">
            <h2>Summary</h2>
            <p class="description">${summary}</p>
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
                        // Handle both string array and object array for skills
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
