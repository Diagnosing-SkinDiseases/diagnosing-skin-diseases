import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../CSS/ContactForm.css';
import { contactFormController } from "../../apiControllers/contactApiController"; 

const ContactForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert('Please complete the reCAPTCHA.');
      return;
    }

    setLoading(true);

    const formData = new FormData(e.target); 
    const requestBody = {
      event: {
        token: captchaToken,
        expectedAction: "submit_contact_form", 
        siteKey: process.env.REACT_APP_RECAPTCHA_KEY,
      },
    };

    try {
      // Verify reCAPTCHA
      // const response = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/dsd-contact-form-1727805515226/assessments?key=${process.env.REACT_APP_API_KEY}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestBody),
      // });

      // const verificationResult = await response.json();

      // if (!verificationResult.token?.success) {
      //   alert('reCAPTCHA verification failed. Please try again.');
      //   return;
      // }

      // Handle form submission
      const contactResponse = await contactFormController({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      });

      if (contactResponse.status === 200) {
        setFormSubmitted(true);
      } else {
        console.error('Failed to submit contact form:', contactResponse);
        // TODO : add msg for user
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred while submitting the form. Please try again later.'); 
      // TODO : add msg for user
    } finally {
      setLoading(false);
      setCaptchaToken(null); // Reset captcha token after submission
    }
  };

  return (
    <div className="container pb-5 mt-5 contact-form-container">
      <div className="container px-5 contact-form">
        <h1>Contact Us</h1>
        {formSubmitted ? (
          <p className='contact-form-success'>Thank you for reaching out! We will get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className='contact-form-label' htmlFor="name">Name:</label>
            <input className='contact-form-input' type="text" id="name" name="name" required disabled={loading} />

            <label className='contact-form-label' htmlFor="email">Email:</label>
            <input className='contact-form-input' type="email" id="email" name="email" required disabled={loading} />

            <label className='contact-form-label' htmlFor="message">Message:</label>
            <textarea className='contact-form-textarea' id="message" name="message" rows="5" required disabled={loading}></textarea>

            {/* reCAPTCHA */}
            <ReCAPTCHA
              className='contact-form-recaptcha'
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
              onChange={handleCaptchaChange}
            />

            <button type="submit" disabled={loading || !captchaToken}>
              {loading ? 'Submitting...' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
