import { useState } from "react";
import { useLocation } from "react-router-dom";
import apiUrl from "../../api";
import { apiLoginUser } from "../../apiControllers/authApiController";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/trees";

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
    setErrorMessage("");

    try {
      await apiLoginUser({ username, password });

      // After successful login, let gates decide next step
      window.location.href = from;
    } catch (error) {
      if (error.response) {
        const message =
          error.response.status === 401
            ? "Invalid credentials."
            : "Login failed.";
        setErrorMessage(message);
      } else {
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
