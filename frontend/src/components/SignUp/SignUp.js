import React from "react";
import SignUpForm from "./SignUpForm";
import "./SignUp.css";

function App() {
  const addUser = async (user) => {
    try {
      const response = await fetch("http://localhost:4000/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Could not complete signup");
      }
      const data = await response.json();
      console.log("User created:", data);
      // Handle success (e.g., display success message, clear form, etc.)
    } catch (error) {
      console.error("Error creating user:", error);
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
