import React, { useState } from "react";
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const SignUpForm = ({ addUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpStatus, setSignUpStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate user input
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Hash the password before sending it to addUser function
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Add the new user with hashed password to the database
    addUser({ email, password: hashedPassword });

    setSignUpStatus("Sign Up Successful!");
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
      {errorMessage && <div>{errorMessage}</div>}
      <div>{signUpStatus}</div>
    </div>
  );
};

export default SignUpForm;



