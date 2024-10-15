import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../CSS/ContactForm.css';

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

    setLoading(true); // Display loader during submission

    const form = e.target;
    const formData = new FormData(form);
    formData.append('_replyto', formData.get('email'));
    formData.delete('g-recaptcha-response');

    try {
      await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      setFormSubmitted(true); // Show success message after submission
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false); // Hide loader after submission
      setCaptchaToken(null); // Reset captcha token
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <div className="container pb-5 mt-5 contact-form-container">
        <div className="container px-5 contact-form">
          <h1>Contact Us</h1>
          {formSubmitted ? (
            <p className='contact-form-success'>Thank you for reaching out! We will get back to you soon.</p>
          ) : (
            <form 
              // check env varibales
              action="form_url" 
              method="POST" 
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="_subject" value="DSD Contact Form Submission" />
              
              <label className='contact-form-label' htmlFor="name">Name:</label>
              <input className='contact-form-input' type="text" id="name" name="name" autocomplete="on" required disabled={loading} />

              <label className='contact-form-label' htmlFor="email">Email:</label>
              <input className='contact-form-input' type="email" id="email" name="email" autocomplete="on" required disabled={loading} />

              <label className='contact-form-label' htmlFor="message">Message:</label>
              <textarea className='contact-form-textarea' id="message" name="message" rows="5" required disabled={loading}></textarea>

              <input type="hidden" name="_captcha" value="false" />

              {/* Google reCAPTCHA */}
              <ReCAPTCHA
                className='contact-form-recaptcha'
                // check env variables
                sitekey="recaptcha_key" 
                onChange={handleCaptchaChange}
              />

              {loading ? (
                <button type="submit" disabled>
                  Submitting...
                </button>
              ) : (
                <button type="submit">Send</button>
              )}
            </form>
          )}
        </div>
    </div>
  );
};

export default ContactForm;
