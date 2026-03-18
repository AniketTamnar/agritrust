const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use app password
  },
});

async function sendEmail(to, subject, text, attachments = []) {
  try {
    await transporter.sendMail({
      from: `AgriTrust <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments,
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email send error:", err);
  }
}

module.exports = sendEmail;
