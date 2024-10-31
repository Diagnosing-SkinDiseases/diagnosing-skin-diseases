import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../CSS/ContactForm.css';
import strings from '../strings.json'
import { contactFormController } from "../../apiControllers/contactApiController"; 

const ContactForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [formError, setFormError] = useState(''); 

  // Utility functions
  const sanitizeInput = (input) => input.trim();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Error Reset Handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) setNameError(''); 
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(''); 
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (messageError) setMessageError(''); 
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError(''); 
  };

  // Validation Function
  const validateForm = () => {
    let isValid = true;

    // Reset error messages
    setNameError('');
    setEmailError('');
    setMessageError('');
    setCaptchaError('');
    setFormError('');

    if (!sanitizeInput(name)) {
      setNameError(strings.ContactForm.nameError);
      isValid = false;
    }
    if (!sanitizeInput(email)) {
      setEmailError(strings.ContactForm.emailRequiredError);
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(strings.ContactForm.emailInvalidError);
      isValid = false;
    }
    if (!sanitizeInput(message)) {
      setMessageError(strings.ContactForm.messageError);
      isValid = false;
    }
    if (!captchaToken) {
      setCaptchaError(strings.ContactForm.captchaError);
      isValid = false;
    }
    return isValid;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if captcha token is missing or expired and trigger a new one if necessary
    if (!captchaToken) {
        setCaptchaError(strings.captchaError);
        return;
    }

    setLoading(true); // Show loader

    const formData = new FormData();
    formData.append("name", sanitizeInput(name));
    formData.append("email", sanitizeInput(email));
    formData.append("message", sanitizeInput(message));
    formData.append("g-recaptcha-response", captchaToken);

    try {
      const contactResponse = await contactFormController(formData);
      if (contactResponse.status === 200) {
        setFormSubmitted(true);
        setFormError(''); // Reset error message on success
      } else {
        console.error('Failed to submit contact form:', contactResponse);
        setFormError(strings.ContactForm.submissionError);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError(strings.ContactForm.genericError);
    } finally {
      setLoading(false);
      setCaptchaToken(null); // Reset captcha token after submission
    }
  };

  return (
    <div className="container pb-5 mt-5">
      <div className="row justify-content-center article-container">
        <div className="container px-5 contact-form">
          <h1>{strings.ContactForm.contactUs}</h1>
          {formSubmitted ? (
            <p>{strings.ContactForm.thankYouMessage}</p>
          ) : (
            <>
              {formError && <p className="error-text result-error">{formError}</p>}
              <form onSubmit={handleSubmit} noValidate>
                {/* name */}
                <label className='contact-form-label' htmlFor="name">{strings.ContactForm.nameLabel}</label>
                <input
                  className='contact-form-input'
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  disabled={loading}
                />
                {nameError && <p className="error-text">{nameError}</p>}

                {/* email */}
                <label className='contact-form-label' htmlFor="email">{strings.ContactForm.emailLabel}</label>
                <input
                  className='contact-form-input'
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                />
                {emailError && <p className="error-text">{emailError}</p>}

                {/* message */}
                <label className='contact-form-label' htmlFor="message">{strings.ContactForm.messageLabel}</label>
                <textarea
                  className='contact-form-textarea'
                  id="message"
                  name="message"
                  rows="5"
                  value={message}
                  onChange={handleMessageChange}
                  disabled={loading}
                ></textarea>
                {messageError && <p className="error-text">{messageError}</p>}

                {/* reCAPTCHA */}
                <ReCAPTCHA
                  className='contact-form-recaptcha'
                  sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                  onChange={handleCaptchaChange}
                />
                {captchaError && <p className="error-text">{captchaError}</p>}

                <button type="submit" disabled={loading || !captchaToken}>
                  {loading ? strings.ContactForm.loadingText : strings.ContactForm.submitText}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
