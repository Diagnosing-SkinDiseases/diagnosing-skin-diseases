import React, { useState } from 'react';

const LoginForm = ({ correctEmail, correctPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login Attempt with Email:", correctEmail, "Password:", correctPassword);
    if (email === correctEmail && password === correctPassword) {
      // If the credentials match the props, log the user in
      console.log("Login successful");
      setLoginStatus('Login successful!');
    } else {
      // If the credentials do not match, set an error message
      console.log("Login failed");
      setLoginStatus('Invalid email or password.');
    }
  };

  return (
    <div className="login-card">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
    {loginStatus && <div>{loginStatus}</div>}
  </div>
);
};

export default LoginForm;

