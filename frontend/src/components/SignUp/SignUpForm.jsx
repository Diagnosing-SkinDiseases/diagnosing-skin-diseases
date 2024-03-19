import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


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

  const isValidPassword = (password) => {
    const uppercaseRegExp = /[A-Z]/;
    const lowercaseRegExp = /[a-z]/; // Check for lowercase letter
    const numberRegExp = /\d/; // Check for numeric digit
    const symbolRegExp = /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/; // Adjust based on symbols you want to include
    return uppercaseRegExp.test(password) && 
           lowercaseRegExp.test(password) && 
           numberRegExp.test(password) && 
           symbolRegExp.test(password);
  };

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
      
      // Set success message and clear form
      setSignUpStatus("Sign Up Successful!");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      
      // Redirect to the login page after a short delay
      setTimeout(() => navigate("/login"), 2000); // Adjust the delay as needed

    } catch (error) {
      // Assuming addUser handles the API call and throws an error on failure
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "An error occurred during sign-up. Please try again later.";
      setErrorMessage(errorMessage);
      // Clear the success status in case of error after a retry
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



