import React from "react";
import axios from "axios"; // Import Axios
import SignUpForm from "./SignUpForm";
import "./SignUp.css";

function App() {
  const addUser = async (user) => {
    try {
      // Using Axios for the POST request
      const response = await axios.post(
        "http://localhost:4000/api/user/create",
        user
      );
      console.log("User created:", response.data);
      // Handle success (e.g., display success message, clear form, etc.)
    } catch (error) {
      // With Axios, the error response (if available) can be accessed via error.response
      console.error(
        "Error creating user:",
        error.response ? error.response.data : error
      );
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="SignUp">
      <SignUpForm addUser={addUser} />
    </div>
  );
}

export default App;
