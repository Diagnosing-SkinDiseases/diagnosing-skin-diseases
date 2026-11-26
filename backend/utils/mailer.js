const nodemailer = require("nodemailer");
const { isProduction } = require("./environment");

const emailPort = Number(process.env.MFA_RESET_EMAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.MFA_RESET_EMAIL_HOST,
  port: emailPort,
  secure: emailPort === 465,
  auth: {
    user: process.env.MFA_RESET_EMAIL_USER,
    pass: process.env.MFA_RESET_EMAIL_PASS,
  },
});

async function sendHelloWorldEmail(to, token) {
  // ✅ Build frontend link dynamically
  const frontendBaseUrl =
    process.env.MFA_FRONTEND_URL || process.env.MFA_FRONTEND_TEST;

  if (!frontendBaseUrl) {
    throw new Error("MFA_FRONTEND_URL must be configured for MFA reset emails");
  }

  const frontendUrl = new URL(frontendBaseUrl);
  if (isProduction && frontendUrl.protocol !== "https:") {
    throw new Error("MFA_FRONTEND_URL must use HTTPS in production");
  }

  frontendUrl.pathname = "/mfa-reset-confirm";
  frontendUrl.search = "";
  frontendUrl.searchParams.set("token", token);
  const resetLink = frontendUrl.toString();

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
