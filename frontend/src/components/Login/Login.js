import React from "react";
import LoginForm from "./LoginForm";
import "./Login.css";

function App() {
  const credentials = {
    correctEmail: `1@1`,
    correctPassword: `1`,
  };

  return (
    <div className="Login">
      <LoginForm
        correctEmail={credentials.correctEmail}
        correctPassword={credentials.correctPassword}
      />
    </div>
  );
}

export default App;
