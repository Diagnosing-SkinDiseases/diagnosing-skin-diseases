import React, { useState } from "react";

const SignUpForm = ({ addUser }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpStatus, setSignUpStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const hasUppercaseLetterAndSymbol = (password) => {
    const uppercaseRegExp = /[A-Z]/;
    const symbolRegExp = /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/; // Adjust based on symbols you want to include
    return uppercaseRegExp.test(password) && symbolRegExp.test(password);
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

    if (!hasUppercaseLetterAndSymbol(password)) {
      setErrorMessage("Password must contain at least one uppercase letter and one symbol");
      return;
    }


    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    addUser({ username, email, password });

    setSignUpStatus("Sign Up Successful!");
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
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



