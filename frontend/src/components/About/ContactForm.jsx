import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../CSS/ContactForm.css';
import {contactFormController} from "../../apiControllers/contactApiController"; 

const ContactForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert('Please complete the reCAPTCHA.');
      return;
    }

    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);

    // Call the controller to handle form submission through backend API
    try {
      const response = await contactFormController({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        captchaToken, // Send captcha token to backend for verification
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        alert('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
      setCaptchaToken(null); // Reset captcha token after form submission
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Store captcha token on change
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
            <input className='contact-form-input' type="text" id="name" name="name" autoComplete="on" required disabled={loading} />

            <label className='contact-form-label' htmlFor="email">Email:</label>
            <input className='contact-form-input' type="email" id="email" name="email" autoComplete="on" required disabled={loading} />

            <label className='contact-form-label' htmlFor="message">Message:</label>
            <textarea className='contact-form-textarea' id="message" name="message" rows="5" required disabled={loading}></textarea>

            {/* reCAPTCHA */}
            <ReCAPTCHA
              className='contact-form-recaptcha'
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
              onChange={handleCaptchaChange}
            />

            {loading ? (
              <button type="submit" disabled>Submitting...</button>
            ) : (
               <button type="submit" disabled={!captchaToken}> {/* Disabled until reCAPTCHA is verified */}
                  Send</button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
