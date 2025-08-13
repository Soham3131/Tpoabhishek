// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// exports.sendEmail = async (to, subject, text) => {
//   await transporter.sendMail({
//     from: `"Training and Placement Cell Support" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   });
// };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email using Nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 */
exports.sendEmail = async ({ to, subject, html }) => {
  if (!to || typeof to !== "string") {
    throw new Error("No recipients defined");
  }

  await transporter.sendMail({
    from: `"Training and Placement Cell Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html, // ✅ send as HTML
  });
};
