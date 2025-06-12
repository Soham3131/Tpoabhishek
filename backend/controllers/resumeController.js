const Resume = require("../models/Resume");
const puppeteer = require("puppeteer"); // Import puppeteer

// @desc    Create or update a user's resume
// @route   POST /api/resume
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
    console.error(err);
    res.status(500).json({ msg: "Error fetching resume", error: err.message });
  }
};

// @desc    Generate PDF from resume data
// @route   GET /api/resume/pdf
// @access  Private (User) - Requires protect middleware
exports.generateResumePDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const resume = await Resume.findOne({ user: userId });

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found for this user. Please create one first." });
    }

    // --- Start PDF Generation Logic ---
    // This is a basic HTML template. For more complex styling or multiple templates,
    // consider using a templating engine like EJS or Handlebars.
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>${resume.fullName}'s Resume</title>
          <style>
              body { font-family: 'Inter', sans-serif; margin: 20px; color: #333; line-height: 1.6; }
              h1, h2, h3 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px; }
              p { margin: 0; padding: 0; }
              ul { list-style-type: none; padding: 0; }
              li { margin-bottom: 5px; }
              .section { margin-bottom: 20px; }
              .item-title { font-weight: bold; margin-bottom: 5px; font-size: 1.1em; }
              .item-details { font-style: italic; color: #555; font-size: 0.9em; }
              .contact-info p { display: inline-block; margin-right: 15px; }
              a { color: #3498db; text-decoration: none; }
              a:hover { text-decoration: underline; }
          </style>
      </head>
      <body>
          <h1>${resume.fullName}</h1>
          <div class="contact-info">
              <p>${resume.email}</p>
              ${resume.phone ? `<p>${resume.phone}</p>` : ''}
              ${resume.linkedin ? `<p><a href="${resume.linkedin}">LinkedIn</a></p>` : ''}
              ${resume.github ? `<p><a href="${resume.github}">GitHub</a></p>` : ''}
              ${resume.portfolio ? `<p><a href="${resume.portfolio}">Portfolio</a></p>` : ''}
          </div>

          ${resume.summary ? `<h2>Summary</h2><p>${resume.summary}</p>` : ''}

          ${resume.experience && resume.experience.length > 0 ? `
              <h2>Experience</h2>
              ${resume.experience.map(exp => `
                  <div class="section">
                      <div class="item-title">${exp.jobTitle} at ${exp.company}</div>
                      <div class="item-details">${exp.location} | ${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}</div>
                      <p>${exp.description}</p>
                  </div>
              `).join('')}
          ` : ''}

          ${resume.education && resume.education.length > 0 ? `
              <h2>Education</h2>
              ${resume.education.map(edu => `
                  <div class="section">
                      <div class="item-title">${edu.degree} from ${edu.institution}</div>
                      <div class="item-details">${new Date(edu.startDate).toLocaleDateString()} - ${edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}</div>
                      <p>${edu.description}</p>
                  </div>
              `).join('')}
          ` : ''}

          ${resume.projects && resume.projects.length > 0 ? `
              <h2>Projects</h2>
              ${resume.projects.map(proj => `
                  <div class="section">
                      <div class="item-title">${proj.projectName}</div>
                      ${proj.technologies && proj.technologies.length > 0 ? `<div class="item-details">Technologies: ${proj.technologies.join(', ')}</div>` : ''}
                      ${proj.projectLink ? `<div class="item-details"><a href="${proj.projectLink}">View Project</a></div>` : ''}
                      <p>${proj.description}</p>
                  </div>
              `).join('')}
          ` : ''}

          ${resume.skills && resume.skills.length > 0 ? `
              <h2>Skills</h2>
              <ul>
                  ${resume.skills.map(skill => `<li>${skill.name}${skill.level ? ` (${skill.level})` : ''}</li>`).join('')}
              </ul>
          ` : ''}

          ${resume.achievements && resume.achievements.length > 0 ? `
              <h2>Achievements</h2>
              <ul>
                  ${resume.achievements.map(ach => `<li>${ach}</li>`).join('')}
              </ul>
          ` : ''}

          ${resume.certifications && resume.certifications.length > 0 ? `
              <h2>Certifications</h2>
              <ul>
                  ${resume.certifications.map(cert => `<li>${cert}</li>`).join('')}
              </ul>
          ` : ''}

          ${resume.languages && resume.languages.length > 0 ? `
              <h2>Languages</h2>
              <ul>
                  ${resume.languages.map(lang => `<li>${lang}</li>`).join('')}
              </ul>
          ` : ''}

      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true, // Use 'new' for latest or true for older versions; false for debugging GUI
      // These args are crucial for Puppeteer to work in production environments (e.g., Docker, Heroku)
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // Wait for network to be idle before printing
    const pdf = await page.pdf({ format: 'A4', printBackground: true }); // printBackground to include styles/colors

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    // Ensure filename is web-safe and uses full name from resume
    res.setHeader('Content-Disposition', `attachment; filename=${resume.fullName.replace(/\s/g, '_')}_Resume.pdf`);
    res.send(pdf);

  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ msg: "Error generating resume PDF", error: err.message });
  }
};