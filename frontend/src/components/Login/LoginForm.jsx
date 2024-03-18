import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../App/AuthContext"; 

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Use the login function provided by AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      // The error handling can be as simple as logging the error to the console,
      // or displaying an error message on your login form
      console.error("Login error:", error.response ? error.response.data : error);
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
      </form>
    </div>
  );
};

export default LoginForm;

