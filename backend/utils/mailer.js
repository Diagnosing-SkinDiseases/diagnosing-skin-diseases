const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MFA_RESET_EMAIL_HOST,
  port: process.env.MFA_RESET_EMAIL_PORT,
  secure: false, // true for port 465
  auth: {
    user: process.env.MFA_RESET_EMAIL_USER,
    pass: process.env.MFA_RESET_EMAIL_PASS,
  },
});

async function sendHelloWorldEmail(to, userId) {
  // ✅ Embed the userId in the link
  const resetLink = `http://localhost:3000/mfa-reset-confirm/${userId}`;

  const info = await transporter.sendMail({
    from: `"Your App" <${process.env.MFA_RESET_EMAIL_USER}>`,
    to,
    subject: "MFA Reset Request",
    html: `
      <p>You requested to reset your MFA QR code.</p>
      <p>Click the link below to complete the reset:</p>
      <p><a href="${resetLink}" target="_blank" rel="noopener noreferrer">Reset QR code</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });

  console.log("MFA reset email sent: %s", info.messageId);
}

module.exports = sendHelloWorldEmail;
