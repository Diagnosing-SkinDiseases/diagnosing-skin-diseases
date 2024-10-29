const https = require("https");
const FormData = require("form-data");

// Controller to handle contact form submission
const contactController = async (req, res) => {
  const { name, email, message, captchaToken } = req.body;

  // reCAPTCHA secret key and verification URL
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const captchaVerificationBaseURL = process.env.RECAPTCHA_VERIFICATION_URL;
    // Construct the full verification URL
    const captchaVerificationURL = `${captchaVerificationBaseURL}?secret=${secretKey}&response=${captchaToken}`;

  // Helper function to make an HTTPS POST request
  const postRequest = (url, data, headers = {}) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "POST",
        headers,
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });

      req.on("error", (e) => reject(e));

      if (data) {
        req.write(data);
      }

      req.end();
    });
  };

  try {
    // Verify reCAPTCHA with Google API
    const captchaData = `secret=${secretKey}&response=${captchaToken}`;
    const captchaHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(captchaData),
    };
    const captchaResult = await postRequest(
      captchaVerificationURL,
      captchaData,
      captchaHeaders
    );

    if (!captchaResult.success) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }

    // Prepare form data for FormSubmit service
    const formData = new FormData();
    formData.append("_replyto", email);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    // Headers for form submission
    const formHeaders = formData.getHeaders();
      const formSubmitUrl = process.env.FORM_URL;

    // Submit form to FormSubmit service
    const formResponse = await postRequest(
      formSubmitUrl,
      formData.getBuffer(),
      formHeaders
    );

    if (formResponse.success) {
      return res.status(200).json({ message: "Form submitted successfully" });
    } else {
      return res.status(500).json({ message: "Failed to submit form" });
    }
  } catch (error) {
    console.error("Error in form submission:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  contactController,
};

