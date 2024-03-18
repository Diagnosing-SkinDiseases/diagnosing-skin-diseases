import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../App/AuthContext"; 

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth(); // Use the login function provided by AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear previous error messages on new submit

    try {
      // Replace the URL with your actual login endpoint
      const response = await axios.post("http://localhost:4000/api/user/login", {
        username,
        password,
      });

      // Assuming the response includes the token
      const { token } = response.data;

      // Use the login method from your context to update the auth status and set the token
      login(token);

      // Redirect to a protected route or homepage after successful login
      navigate("/admin/articles");
    } catch (error) {
      // Handle login error
      // If the error is from the server response
      if (error.response) {
        // Set custom error messages based on the status code or use a generic message
        const message = error.response.status === 401 ? "Invalid credentials." : "Login failed.";
        setErrorMessage(message);
      } else {
        // For network errors or other issues not related to the server response
        setErrorMessage("The login service is currently unavailable.");
      }
    }
  };

  return (
    <div className="login-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
        {/* Conditionally render the error message if it exists */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default LoginForm;

