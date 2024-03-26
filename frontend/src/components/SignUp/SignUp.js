import React, { useState } from "react";
import { apiCreateUser } from "../../apiControllers/userApiController";
import SignUpForm from "./SignUpForm";
import "./SignUp.css";

function App() {
  const [serverError, setServerError] = useState("");

  const addUser = async (user) => {
    setServerError("");
    try {
      // Using Axios for the POST request
      const response = await apiCreateUser(user);
      console.log("User created:", response.data);
      // Handle success (e.g., display success message, clear form, etc.)
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred during sign-up.";
      setServerError(errorMessage);
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
