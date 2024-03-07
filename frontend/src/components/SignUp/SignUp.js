import React, { useState } from "react";
import SignupForm from "./SignUpForm";
import "./SignUp.css";
import bcrypt from "bcryptjs";

function App() {
  const [usersDB, setUsersDB] = useState([
    {
      id: 1,
      email: "user1@example.com",
      password: "$2a$10$2n3fNf/ALoQRxMp2d0f2d.xt32y8DqXdCtKnG70KryfNfzA9Aay1m",
    }, // Hashed password for "pass1"
    {
      id: 2,
      email: "user2@example.com",
      password: "$2a$10$khfyXN46gdFb0be5htpM/OqU3Fn9SzqGidjBoW6j3sG0mMtMltnBa",
    }, // Hashed password for "pass2"
  ]);

  const addUser = (user) => {
    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    // Add the new user to the database
    setUsersDB([
      ...usersDB,
      { id: usersDB.length + 1, email: user.email, password: hashedPassword },
    ]);
  };

  return (
    <div className="SignUp">
      <SignupForm addUser={addUser} />
    </div>
  );
}

export default App;
