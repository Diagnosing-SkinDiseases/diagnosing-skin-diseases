import React, { useState } from "react";
import { apiCreateUser } from "../../apiControllers/userApiController";
import SignUpForm from "./SignUpForm";
import "../CSS/SignUp.css";

/**
 * App Component
 *
 * This is the main component of the application's signup page. It handles the registration of
 * a new user through the SignUpForm component. It interacts with the backend via the `apiCreateUser`
 * function which sends a POST request to create a new user. This component also manages the
 * state related to server errors which might occur during the signup process.
 *
 * State:
 *   serverError (String): Message indicating errors returned by the server during the signup process.
 *
 * Behavior:
 *   - Provides `addUser` function to SignUpForm as a prop.
 *   - Captures and displays server-side errors.
 *   - Manages API interactions for creating a new user.
 */
function App() {
  const [serverError, setServerError] = useState("");

  /**
   * App Component
   *
   * This is the main component of the application's signup page. It handles the registration of
   * a new user through the SignUpForm component. It interacts with the backend via the `apiCreateUser`
   * function which sends a POST request to create a new user. This component also manages the
   * state related to server errors which might occur during the signup process.
   *
   * State:
   *   serverError (String): Message indicating errors returned by the server during the signup process.
   *
   * Behavior:
   *   - Provides `addUser` function to SignUpForm as a prop.
   *   - Captures and displays server-side errors.
   *   - Manages API interactions for creating a new user.
   */
  const addUser = async (user) => {
    setServerError(""); // Clear any existing errors before a new request
    try {
      const response = await apiCreateUser(user);
      console.log("User created:", response.data);
      // Handle success (e.g., display success message, clear form, etc.)
    } catch (error) {
      // Construct a user-friendly error message based on the server's response
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred during sign-up.";
      setServerError(errorMessage); // Update state with the new error message
    }
  };

  return (
    <div className="SignUp">
      {serverError && <div className="error-message">{serverError}</div>}
      <SignUpForm addUser={addUser} />
    </div>
  );
}

export default App;
