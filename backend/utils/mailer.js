const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MFA_RESET_EMAIL_HOST,
  port: process.env.MFA_RESET_EMAIL_PORT,
  secure: process.env.MFA_RESET_EMAIL_PORT == 465, // auto-handle TLS
  auth: {
    user: process.env.MFA_RESET_EMAIL_USER,
    pass: process.env.MFA_RESET_EMAIL_PASS,
  },
});

async function sendHelloWorldEmail(to, token) {
  // ✅ Build frontend link dynamically
  const resetLink = `${process.env.MFA_FRONTEND_TEST}/mfa-reset-confirm?token=${token}`;

  const info = await transporter.sendMail({
    from: `"Your App" <${process.env.MFA_RESET_EMAIL_USER}>`,
    to,
    subject: "MFA Reset Request",
    html: `
      <p>You requested to reset your MFA QR code.</p>
      <p>Click the link below to complete the reset (valid for 15 minutes):</p>
      <p><a href="${resetLink}" target="_blank" rel="noopener noreferrer">Reset QR Code</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
}

module.exports = sendHelloWorldEmail;
