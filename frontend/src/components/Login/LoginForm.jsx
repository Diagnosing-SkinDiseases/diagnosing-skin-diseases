import React, { useState } from 'react';

const LoginForm = ({ usersDB }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Find user in the mock database
    const user = usersDB.find(user => user.email === email && user.password === password);
    if (user) {
      setLoginStatus('Login successful!');
      console.log("User ID:", user.id); 
    } else {
      setLoginStatus('Login failed');
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
      <div>{loginStatus}</div>
    </div>
  );
};


export default LoginForm;

