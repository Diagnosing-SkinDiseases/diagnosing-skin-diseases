import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SignUpForm Component
 * 
 * This component provides a user interface for signing up a new user. It validates the user's
 * input before submitting the form. The form captures the email, username, and password.
 * 
 * Props:
 *   addUser (Function): Function to add the user to the backend or state management.
 *
 * State:
 *   email (String): User's email address.
 *   username (String): Desired username.
 *   password (String): User's chosen password.
 *   confirmPassword (String): Confirmation of the user's password.
 *   signUpStatus (String): Message indicating the success or pending status of the signup process.
 *   errorMessage (String): Error message related to signup issues.
 * 
 * Behavior:
 *   - Validates email format, password criteria, and ensures password and confirm password match.
 *   - Upon successful validation, addUser is called, and the user is redirected after a delay.
 *   - Errors during submission are caught and displayed.
 */

const SignUpForm = ({ addUser }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpStatus, setSignUpStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  // Validates the email using a regular expression to ensure it meets basic email format criteria.
  const isValidPassword = (password) => {
    const uppercaseRegExp = /[A-Z]/;
    const lowercaseRegExp = /[a-z]/; 
    const numberRegExp = /\d/; 
    const symbolRegExp = /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/;
    return uppercaseRegExp.test(password) && 
           lowercaseRegExp.test(password) && 
           numberRegExp.test(password) && 
           symbolRegExp.test(password);
  };

  // Handles form submission, performing validation and invoking the addUser prop on success.
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    if (username === password) {
      setErrorMessage("Username and password cannot be the same");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Password must contain at least one uppercase letter and one symbol");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      addUser({ username, email, password });
      
      setSignUpStatus("Sign Up Successful!");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      
      setTimeout(() => navigate("/login"), 2000); 
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "An error occurred during sign-up. Please try again later.";
      setErrorMessage(errorMessage);
      setSignUpStatus("");
    }
  };

  return (
    <div className="SignUp-card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
        type="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="signup-status">{signUpStatus}</div>
    </div>
  );
};

export default SignUpForm;



