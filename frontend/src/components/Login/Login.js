import React from "react";
import LoginForm from "./LoginForm";
import "./Login.css";

function App() {
  const usersDB = [
    { id: 1, email: "user1@example.com", password: "pass1" },
    { id: 2, email: "user2@example.com", password: "pass2" },
  ];

  return (
    <div className="Login">
      <LoginForm usersDB={usersDB} />
    </div>
  );
}

export default App;
