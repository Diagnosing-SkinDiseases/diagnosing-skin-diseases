import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLoginUser } from '../../apiControllers/userApiController';
import { useAuth } from "../App/AuthContext"; 

/**
 * LoginForm Component
 * 
 * Provides a user interface for the login process. Users can enter their username and password to authenticate.
 * On successful login, the user is redirected to a specific page (e.g., '/admin/trees'). If there are any errors
 * during the login process, such as invalid credentials or server issues, appropriate error messages are displayed.
 *
 * State:
 *   username (String): Stores the username input by the user.
 *   password (String): Stores the password input by the user.
 *   errorMessage (String): Stores any error messages to display based on login attempt outcomes.
 *
 * Context:
 *   useAuth: Hook to access the login function from AuthContext, which updates the authentication status and token.
 *
 * Navigation:
 *   useNavigate: Hook for programmatically navigating to other routes post-login.
 */
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth(); // Use the login function provided by AuthContext
  const navigate = useNavigate();

  /**
   * handleSubmit Function
   * 
   * Handles the form submission event. Clears previous error messages, then makes an API call to
   * authenticate the user. Upon successful authentication, the user is logged in via the context provider
   * and redirected to a secure page. Errors during the process are caught and handled by setting appropriate
   * error messages.
   *
   * Parameters:
   *   event (Event): The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear previous error messages on new submit

    try {
      // Call to API to log in the user using username and password
      const response = await apiLoginUser( {
        username,
        password,
      });

      // Assuming the response includes the token
      const { token } = response.data;

      // Use the login method from your context to update the auth status and set the token
      login(token);

      // Redirect to a protected route or homepage after successful login
      navigate("/admin/trees");
    } catch (error) {
      // Handle login error
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default LoginForm;

