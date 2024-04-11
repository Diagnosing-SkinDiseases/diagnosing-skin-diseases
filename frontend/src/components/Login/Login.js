import React from "react";
import LoginForm from "./LoginForm";
import "../CSS/Login.css";

/**
 * App Component
 *
 * This is the root component for the login page. It renders the LoginForm component within a div container
 * styled with a specific class for layout purposes. This setup ensures that the login form is presented
 * appropriately on the page, adhering to the styling defined in the associated CSS file.
 *
 * Structure:
 *   - A div container with class 'Login' wraps the LoginForm component to apply specific styling.
 */
function App() {
  return (
    <div className="Login">
      <LoginForm />
    </div>
  );
}

export default App;
