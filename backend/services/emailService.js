const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Training and Placement Cell Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
